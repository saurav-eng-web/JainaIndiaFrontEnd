"use client";

import axios from "axios";
import { Trash2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import Table from "@/components/common/Table";
import Modal from "@/components/ui/Modal";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import RadioOption from "@/components/ui/RadioOption";
import { useTheme } from "@/theme/ThemeContext";

export default function MSLConsume({ ticketNumber }) {
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user); // Adjust slice name if needed
  const router = useRouter();

  const [selectedPart, setSelectedPart] = useState(null);
  const [grid, setGrid] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [saveConfirmationOpen, setSaveConfirmationOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // const normalizeBoolean = (value) => String(value).toLowerCase() === "true";

  // REM: This is a mock API call to fetch dropdown data

  function parseKeyValueString(str) {
    if (!str) return {};
    // Robust cleanup: remove leading/trailing braces and whitespace
    let cleaned = str.trim();
    if (cleaned.startsWith("{")) cleaned = cleaned.slice(1);
    if (cleaned.endsWith("}")) cleaned = cleaned.slice(0, -1);

    const pairs = cleaned.split(",");
    const result = {};

    pairs.forEach((pair) => {
      const parts = pair.split(":");
      if (parts.length < 2) return;

      const key = parts[0].trim();
      const valueStr = parts.slice(1).join(":").trim(); // Re-join in case value contains :

      let value = valueStr;
      // convert number if applicable
      if (!isNaN(value) && value !== "") {
        value = Number(value);
      }

      result[key] = value;
    });

    return result;
  }

  useEffect(() => {
    async function getDropdown() {
      try {
        const res = await axiosInstance.post("consumption/process", {
          type: "MSLPartDetail",
          ticket_no: ticketNumber,
        });

        // Ensure we filter out parts already in the grid if any (though grid starts empty usually)
        const gridPartCodes = new Set(grid.map((g) => g.partCode));

        const dropdownData = res.data.data
          .filter((item) => !gridPartCodes.has(item.key))
          .map((item) => {
            // Parse message: "serialcheck|partCode|partDescription|imageUploadFlag"
            return {
              label: `${item.PartDescription} - ${item.PartCode}`,
              value: item.PartCode,
              imageUploadRequired: item.Message === "1",
              partId: item.PartID,
            };
          });
        setDropdownOptions(dropdownData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }

    getDropdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketNumber]);

  const validatePart = async (partCode) => {
    if (!partCode) {
      return {
        status: false,
      };
    }

    try {
      const res = await axiosInstance.post("consumption/process", {
        type: "MSLPartDetailCheck",
        ticket_no: ticketNumber,
        PartCode: partCode,
      });
      const data = res.data.data;
      const msg = data[0]?.res;

      if (res.data.statusCode === 200 && msg === "Allow Consumption") {
        // toast.success("Consumption Allowed");
        return {
          status: true,
          SFReceivePOID: data[0]?.SFReceivePOID,
          InventoryType: data[0]?.InventoryType,
        };
      } else {
        toast.error(`${msg}`);
        return {
          status: false,
        };
      }
    } catch (error) {
      console.error("Error validating part:", error);
      return {
        status: false,
      };
    }
  };

  const handlePartSelect = async (selectedValue) => {
    const part = dropdownOptions.find((item) => item.value === selectedValue);
    if (!part) return;
    const validateResult = await validatePart(part.value);
    if (!validateResult.status) {
      return;
    }

    setSelectedPart({
      label: part.label,
      value: part.value,
      imageUploadRequired: part.imageUploadRequired,
      partId: part.partId,
      sfPOReceiveId: validateResult.SFReceivePOID,
      inventoryType: validateResult.InventoryType,
    });

    setShowImageUpload(part.imageUploadRequired);
    setImages([]);
    setVideos([]);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);

    // Validate total count
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Validate each file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    const invalidFiles = files.filter((file) => file.size > maxSize);

    if (invalidFiles.length > 0) {
      toast.error("Each image must be less than 5MB");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    if (videos.length + 1 > 1) {
      toast.error("Maximum 1 video allowed");
      return;
    }

    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Video must be less than 30MB");
      return;
    }

    setVideos([file]);
  };

  const handleRemoveVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddToTable = async () => {
    if (!selectedPart) return;
    // Check if images are required but not uploaded
    if (showImageUpload && images.length === 0) {
      toast.error("Please upload at least one image!");
      return;
    }

    setGrid((prev) => [
      ...prev,
      {
        partCode: selectedPart.value,
        desc: selectedPart.label,
        images: [...images], // Store images in memory
        videos: [...videos],
        imageUploadRequired: selectedPart.imageUploadRequired,
        sfPOReceiveId: selectedPart.sfPOReceiveId,
        inventoryType: selectedPart.inventoryType,
        partId: selectedPart.partId,
        consume: 0,
        freshFaulty: 0,
      },
    ]);

    setDropdownOptions((prev) =>
      prev.filter((item) => item.value !== selectedPart.value)
    );

    setSelectedPart(null);
    setShowImageUpload(false);
    setImages([]);
    setVideos([]);
  };

  const handleDelete = (data) => {
    const itemToDelete = data;
    setGrid((prev) => prev.filter((item) => item.partCode !== data.partCode));

    if (itemToDelete) {
      setDropdownOptions((prev) => {
        const newOptions = [
          ...prev,
          {
            label: itemToDelete.desc,
            value: itemToDelete.partCode,
            serialCheck: itemToDelete.isSerialised,
            extraPartCode: itemToDelete.extraPartCode,
            extraPartDescription: itemToDelete.extraPartDescription,
            imageUploadRequired: itemToDelete.imageUploadRequired,
          },
        ];
        // Optional: Sort options alphabetically by label so the restored item is in place
        return newOptions.sort((a, b) => a.label.localeCompare(b.label));
      });
    }
  };

  function handleSaveClick() {
    if (grid.some((item) => item.consume === 0 && item.freshFaulty === 0)) {
      toast.error("Please select a status for all items.");
      return;
    }
    setSaveConfirmationOpen(true);
  }

  // >>>>>>>>>>>>>>> UPLOAD FUNCTION <<<<<<<<<<<<<<<
  // const handleUpload = async () => {
  //   try {
  //     let allSuccess = true;

  //     for (const item of grid) {
  //       if (item.images && item.images.length > 0) {
  //         for (const file of item.images) {
  //           if (!file) continue;

  //           const formData = new FormData();
  //           formData.append("file", file);
  //           formData.append("Ticket_no", ticketNumber);
  //           formData.append("DocumentType", "HVP Parts"); // Updated type

  //           try {
  //             await axios.post("/api/documents/upload", formData, {
  //               headers: { "Content-Type": "multipart/form-data" },
  //             });
  //           } catch (err) {
  //             console.error("Upload error for file", file.name, err);
  //             allSuccess = false;
  //           }
  //         }
  //       }
  //     }
  //     return allSuccess;
  //   } catch (err) {
  //     console.error("Global Upload error", err);
  //     return false;
  //   }
  // };

  console.log("grid: ", grid);
  async function handleSubmit() {
    const data = grid.map((item) => ({
      PartID: item.partId,
      PartCode: item.partCode,
      PartDescription: item.desc,
      InventoryType: item.inventoryType,
      SFReceivePOID: item.sfPOReceiveId,
      freshFaulty: item.freshFaulty,
      consume: item.consume,
      hvp: item.imageUploadRequired ? 1 : 0,
    }));
    console.log("data: ", data);
    if (data.length === 0) {
      toast.error("No items to submit.");
      return;
    }

    const payload = {
      type: "MSLPartConsume",
      ticket_no: ticketNumber,
      data: data,
    };
    try {
      const res = await axiosInstance.post("consumption/process", payload);
      const message = res.data?.statusMsg || "";
      const data = res.data?.data;
      if (
        res.data.statusCode === 200 &&
        message === "Record Inserted Successfully" &&
        data.length > 0
      ) {
        toast.success("Request submitted successfully!");
        router.back();
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again!");
    }

    setSaveConfirmationOpen(false);
  }

  /* ---------------- GRID TABLE CONFIG ---------------- */

  const handleStatusChange = (row, statusType) => {
    setGrid((prev) =>
      prev.map((item) => {
        if (item.partCode !== row.partCode) return item;

        // Logic: if consume, set 1/0, else set 0/1
        const isConsume = statusType === "consume";
        return {
          ...item,
          consume: isConsume ? 1 : 0,
          freshFaulty: isConsume ? 0 : 1,
        };
      })
    );
  };

  const gridColumns = [
    {
      label: "Part Code",
      key: "partCode",
      size: "lg",
      render: (value) => <div className="font-semibold text-gray-700">{value}</div>,
    },
    {
      label: "Part Description",
      key: "desc",
      size: "xxl",
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      label: "Inventory Type",
      key: "inventoryType",
      size: "sm",
      render: (value) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            value === "Free" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      label: "Received Status",
      key: "received",
      size: "xxl",
      render: (_v, row) => (
        <div className="flex flex-wrap items-center justify-start gap-4">
          <RadioOption
            name={row.partCode}
            value="consume"
            label="Consume"
            color="text-green-600"
            // actionsAllowed={actionsAllowed}
            checked={row.consume === 1}
            onChange={() => handleStatusChange(row, "consume")}
          />
          <RadioOption
            name={row.partCode}
            value="freshFaulty"
            label="Fresh Faulty"
            color="text-red-600"
            // actionsAllowed={actionsAllowed}
            checked={row.freshFaulty === 1}
            onChange={() => handleStatusChange(row, "freshFaulty")}
          />
        </div>
      ),
    },
    {
      label: "",
      key: "action",
      size: "xs",
      render: (_value, _row, index) => (
        <button
          onClick={() => handleDelete(_row)}
          className="cursor-pointer rounded p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  return (
    <ModalSkeleton title="MSL Part Consume" rolesAllowed={["sf/ssd"]} size={"xl"}>
      {/* PART SELECTION */}
      <div className="mb-6 min-w-4xl rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-900 uppercase">
          Select Part to Add
        </h3>
        <div className="flex items-end gap-4">
          <div className="basis-3/5">
            <CustomDropdown
              label="Part Code"
              placeholder="Select Part"
              value={selectedPart?.value || ""}
              onChange={handlePartSelect}
              options={dropdownOptions}
            />
          </div>

          {/* Unified Action Button Container */}
          <div className="w-24 flex-none">
            {selectedPart && (
              <button
                onClick={handleAddToTable}
                className="h-10 w-full cursor-pointer rounded-lg text-sm font-medium text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                style={{ background: colors.primary }}
              >
                Add
              </button>
            )}
          </div>
        </div>

        {/* Image Upload Section */}
        {showImageUpload && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Upload Images <span className="text-red-500">*</span>
              <p className="mt-1 text-xs font-normal text-gray-500">
                Max 5 images allowed (upto 5MB each). At least one image is required.
              </p>
            </label>

            <div className="flex items-start gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={images.length >= 5}
                />
                <div
                  className="flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background: images.length >= 5 ? "#ccc" : colors.primary,
                    cursor: images.length >= 5 ? "not-allowed" : "pointer",
                  }}
                >
                  Choose Files ({images.length}/5)
                </div>
              </label>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="group relative h-16 w-16 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm"
                    >
                      {/* <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      /> */}
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 hidden h-5 w-5 items-center justify-center rounded-bl-lg bg-red-500 text-xs text-white transition-all group-hover:flex hover:bg-red-600"
                        title="Remove"
                      >
                        ×
                      </button>
                      <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 bg-black px-1 py-0.5 text-center text-[10px] text-white">
                        {(file.size / 1024).toFixed(0)}KB
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Upload Video
                <p className="mt-1 text-xs font-normal text-gray-500">
                  Max 1 video allowed (upto 30MB).
                </p>
              </label>

              <div className="flex items-start gap-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                    disabled={videos.length >= 1}
                  />
                  <div
                    className="flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                    style={{
                      background: videos.length >= 1 ? "#ccc" : colors.primary,
                      cursor: videos.length >= 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    Choose Video ({videos.length}/1)
                  </div>
                </label>

                {videos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {videos.map((file, index) => (
                      <div
                        key={index}
                        className="group relative h-16 w-28 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm"
                      >
                        <video
                          src={URL.createObjectURL(file)}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                        />
                        <button
                          onClick={() => handleRemoveVideo(index)}
                          className="absolute top-0 right-0 hidden h-5 w-5 items-center justify-center rounded-bl-lg bg-red-500 text-xs text-white transition-all group-hover:flex hover:bg-red-600"
                          title="Remove"
                        >
                          Ã—
                        </button>
                        <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 bg-black px-1 py-0.5 text-center text-[10px] text-white">
                          {(file.size / (1024 * 1024)).toFixed(1)}MB
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GRID TABLE */}
      {grid.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 mb-8 duration-300">
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Added Parts</h4>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <Table columns={gridColumns} rows={grid} />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveClick}
              className="cursor-pointer rounded-lg border px-8 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
              style={{
                background: colors.primary,
                borderColor: colors.primary,
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <Modal
        open={saveConfirmationOpen}
        onClose={() => setSaveConfirmationOpen(false)}
        center
      >
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Confirm Save</h3>
          <p className="mb-8 pr-18 text-gray-600">
            Are you sure you want to submit the request?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSaveConfirmationOpen(false)}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="cursor-pointer rounded-lg px-4 py-2 text-white transition-transform hover:scale-105 active:scale-95"
              style={{ background: colors.primary }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </ModalSkeleton>
  );
}

// message:
// max 5 images, upto 5mb

// new feature, after verifying the serial number, we have to upload

// stock repair, service | call type
// wip substatus
