"use client";

import axios from "axios";
import { Trash2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import Table from "@/components/common/Table";
import Modal from "@/components/ui/Modal";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import { useTheme } from "@/theme/ThemeContext";
import { updateJob } from "@/utils/commonApis";

// ---- MOCK TICKET TABLE ----

export default function AddPartPending({ ticketNumber }) {
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user); // Adjust slice name if needed

  const [selectedPart, setSelectedPart] = useState(null);
  const [showSerial, setShowSerial] = useState(false);
  const [serialNo, setSerialNo] = useState("");
  const [grid, setGrid] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isValidSerialNumber, setIsValidSerialNumber] = useState(false);
  const [saveConfirmationOpen, setSaveConfirmationOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const normalizeBoolean = (value) => String(value).toLowerCase() === "true";

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
        const res = await axiosInstance.post("DropdownMaster/GetDropdown", {
          type: "PartCodePO",
          dispatchType: ticketNumber,
        });

        // Ensure we filter out parts already in the grid if any (though grid starts empty usually)
        const gridPartCodes = new Set(grid.map((g) => g.partCode));

        const dropdownData = res.data.data
          .filter((item) => !gridPartCodes.has(item.key))
          .map((item) => {
            // Parse message: "serialcheck|partCode|partDescription|imageUploadFlag"
            const messageParts = item.message.split("|");
            return {
              label: item.value,
              value: item.key,
              serialCheck: messageParts[0] === "1",
              extraPartCode: messageParts[1] || "",
              extraPartDescription: messageParts[2] || "",
              imageUploadRequired: messageParts[3] === "1",
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

  const handlePartSelect = (selectedValue) => {
    const part = dropdownOptions.find((item) => item.value === selectedValue);
    if (!part) return;
    setSelectedPart({
      label: part.label,
      value: part.value,
      serialCheck: part.serialCheck,
      extraPartCode: part.extraPartCode,
      extraPartDescription: part.extraPartDescription,
      imageUploadRequired: part.imageUploadRequired,
    });

    setSerialNo("");
    setShowSerial(part.serialCheck);
    setShowImageUpload(part.imageUploadRequired);
    setIsValidSerialNumber(false);
    setImages([]);
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

  const handleAddToGrid = async () => {
    if (!selectedPart) return;

    if (showSerial && !isValidSerialNumber) {
      toast.error("Valid serial number is required!");
      return;
    }

    // Check if images are required but not uploaded
    if (showImageUpload && images.length === 0) {
      toast.error("Please upload at least one image!");
      return;
    }

    try {
      const res = await axiosInstance.post("po-validation/validate", {
        partcode: selectedPart.value,
        type: "stockcheck",
        ticket_no: ticketNumber,
      });

      const message = res.data?.statusMsg || "";
      // Check for presence of key data fields to confirm success/data payload
      if (message.includes("Inventory Type") || message.includes("Price")) {
        const parts = message.split("|");
        // Assume the data object is after the first pipe
        const msgData = parts.length > 1 ? parts[1] : parts[0];

        const data = parseKeyValueString(msgData);

        setGrid((prev) => [
          ...prev,
          {
            partCode: selectedPart.value,
            desc: selectedPart.label,
            inventoryType: data["Inventory Type"] || "N/A",
            price: data["Price"] || 0,
            availableQty: data["Qty"] || 0,
            poQty: 1,
            serialNo: showSerial ? serialNo : "",
            isSerialised: selectedPart.serialCheck,
            images: [...images], // Store images in memory
            extraPartCode: selectedPart.extraPartCode,
            extraPartDescription: selectedPart.extraPartDescription,
            imageUploadRequired: selectedPart.imageUploadRequired,
          },
        ]);

        setDropdownOptions((prev) =>
          prev.filter((item) => item.value !== selectedPart.value)
        );

        setSelectedPart(null);
        setSerialNo("");
        setShowSerial(false);
        setShowImageUpload(false);
        setIsValidSerialNumber(false);
        setImages([]);
      } else {
        // Handle rejection or simple message cases
        const parts = message.includes("|") ? message.split("|") : [message];
        const msg = parts[0];
        const qty = parts[1] ? parts[1].trim() : null;

        toast.error(
          <div>
            <p>{msg}</p>
            {qty && <p className="mt-1 text-sm">Available Qty: {qty}</p>}
          </div>
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate part");
    }
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
        return newOptions.sort((a, b) => a.label.localeCompare(b.label));
      });
    }
  };

  const checkSerialNumber = async () => {
    if (!serialNo) {
      toast.error("Please enter serial number");
      return;
    }

    try {
      const partCode = selectedPart.value;
      const res = await axiosInstance.post("CheckSerialNo/CheckSerial", {
        serialNo,
        ticketNo: `${ticketNumber}|${partCode}`,
        pincode: 0,
        type: "partcodeserialno",
      });

      if (res.data.message === "Valid serial no") {
        setIsValidSerialNumber(true);
        toast.success("Serial number is valid");
      } else {
        toast.error(res.data.message);
        setIsValidSerialNumber(false);
      }
    } catch (error) {
      toast.error("Invalid serial number");
      console.error(error);
    }
  };

  function handleSaveClick() {
    setSaveConfirmationOpen(true);
  }

  const handleUpload = async () => {
    try {
      let allSuccess = true;

      for (const item of grid) {
        if (item.images && item.images.length > 0) {
          for (const file of item.images) {
            if (!file) continue;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("Ticket_no", ticketNumber);
            formData.append("DocumentType", "HVP Parts");

            try {
              await axios.post("/api/documents/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
            } catch (err) {
              console.error("Upload error for file", file.name, err);
              allSuccess = false;
            }
          }
        }
      }
      return allSuccess;
    } catch (err) {
      console.error("Global Upload error", err);
      return false;
    }
  };

  async function onConfirmSave() {
    const data = grid.flatMap((item) => {
      const mainPart = {
        partCode: item.partCode,
        inventoryType: item.inventoryType,
        price: item.price,
        serialNo: item.serialNo,
        partDesc: item.desc,
        availableQty: item.availableQty,
        POQty: item.poQty,
        imageupload: item.images.length > 0 ? "Uploaded" : null,
      };

      if (item.extraPartCode && item.extraPartDescription) {
        const extraPart = {
          partCode: item.extraPartCode,
          inventoryType: item.inventoryType,
          price: 0,
          serialNo: "",
          partDesc: item.extraPartDescription,
          availableQty: 1,
          POQty: 1,
          imageupload: null,
        };
        return [mainPart, extraPart];
      }

      return [mainPart];
    });
    const payload = {
      TicketNo: ticketNumber,
      type: "SFPNAPO",
      data,
    };

    try {
      const res = await axiosInstance.post("po/request", payload);
      const message = res.data?.statusMsg || "";
      if (message.includes("PO Created")) {
        const parts = message.split("|");
        const status = parts[0]?.trim();
        const subStatus = parts[1]?.trim();
        const responseMessage = parts[2]?.trim() || "";
        await updateJob({
          status,
          subStatus,
          message: responseMessage,
          ticketNumber,
          loggedInUser: user.userName,
        });

        const uploadSuccess = await handleUpload();
        if (!uploadSuccess) {
          toast.error("Failed to upload some images. Please try again.");
          return;
        }
        toast.success("Request submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
    }

    setSaveConfirmationOpen(false);
  }

  /* ---------------- GRID TABLE CONFIG ---------------- */

  const gridColumns = [
    {
      label: "Part Code",
      key: "partCode",
      size: "md",
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
      label: "Price",
      key: "price",
      size: "xs",
      render: (value) => <span className="font-medium">₹{value}</span>,
    },
    {
      label: "Available Qty",
      key: "availableQty",
      size: "xs",
      render: (value) => (
        <div className="w-16 rounded border border-gray-300 bg-white py-1 text-center text-sm text-gray-700 shadow-sm">
          {value}
        </div>
      ),
    },
    {
      label: "PO Qty",
      key: "poQty",
      size: "xs",
      render: (value) => (
        <div className="w-16 rounded bg-white py-1 text-center text-sm text-gray-900">
          {value}
        </div>
      ),
    },
    {
      label: "Serial Number",
      key: "serialNo",
      size: "md",
      render: (value) =>
        value ? (
          <span className="rounded bg-gray-100 px-1 font-mono text-sm">{value}</span>
        ) : (
          <span className="text-gray-400">-</span>
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
    <ModalSkeleton title="PO Request" rolesAllowed={["sf/ssd"]} size={"xl"}>
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

          {showSerial && (
            <>
              <div className="min-w-[200px] flex-1">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Serial Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    value={serialNo}
                    onChange={(e) => {
                      setSerialNo(e.target.value);
                      setIsValidSerialNumber(false);
                    }}
                    className="h-11 w-full rounded-lg border p-2 pr-10 shadow-sm focus:border-[#714b67] focus:ring-[#714b67]"
                    placeholder="Enter Serial Number"
                    style={{
                      borderColor: isValidSerialNumber ? "green" : colors.primary,
                    }}
                  />
                  {isValidSerialNumber && (
                    <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-green-500">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Unified Action Button Container */}
          <div className="w-24 flex-none">
            {showSerial && !isValidSerialNumber && (
              <button
                onClick={checkSerialNumber}
                className="h-10 w-full cursor-pointer rounded-lg text-sm font-medium text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                style={{ background: colors.primary }}
              >
                Check
              </button>
            )}

            {selectedPart &&
              (!selectedPart.serialCheck ||
                (selectedPart.serialCheck && isValidSerialNumber)) &&
              (!selectedPart.imageUploadRequired ||
                (selectedPart.imageUploadRequired && images.length > 0)) && (
                <button
                  onClick={handleAddToGrid}
                  className="h-10 w-full cursor-pointer rounded-lg text-sm font-medium text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                  style={{ background: colors.primary }}
                >
                  Add
                </button>
              )}
          </div>
        </div>

        {/* Image Upload Section */}
        {showImageUpload && (!showSerial || (showSerial && isValidSerialNumber)) && (
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
              Save Changes
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
          <p className="mb-8 text-gray-600">
            Are you sure you want to save these changes? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSaveConfirmationOpen(false)}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmSave}
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
