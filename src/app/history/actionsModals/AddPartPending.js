"use client";

import { Trash2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import Table from "@/components/common/Table";
import { Button } from "@/components/ui/button";
import ImagePreview from "@/components/ui/image/ImagePreview";
import ImageUpload from "@/components/ui/image/ImageUpload";
import InputField from "@/components/ui/InputWithLabel";
import Modal from "@/components/ui/Modal";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import { UploadProgressModal } from "@/components/ui/UploadProgress";
import { useTheme } from "@/theme/ThemeContext";
import { updateJob } from "@/utils/commonApis";
import { uploadImage } from "@/utils/uploadImage";

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEOS = 1;
const MAX_VIDEO_SIZE_MB = 30;

// ---- MOCK TICKET TABLE ----

export default function AddPartPending({ ticketNumber, onClose }) {
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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);
  const router = useRouter();
  const activeUpload = isUploading
    ? {
        title: "Uploading Files",
        progress: uploadProgress,
        fileInfo: currentFileInfo,
      }
    : null;

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

  useEffect(() => {
    if (!images || images.length === 0) {
      setImagePreviews([]);
      return;
    }

    const previews = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

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
    setVideos([]);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);

    // Validate total count
    const existingKeys = new Set(
      images.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
    );
    const incomingKeys = new Set();
    const uniqueFiles = [];
    let hasDuplicate = false;

    for (const file of files) {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (existingKeys.has(key) || incomingKeys.has(key)) {
        hasDuplicate = true;
        continue;
      }
      incomingKeys.add(key);
      uniqueFiles.push(file);
    }

    if (hasDuplicate) {
      toast.error("Image already selected");
    }

    // Validate total count
    if (images.length + uniqueFiles.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    // Validate each file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    const invalidFiles = uniqueFiles.filter((file) => file.size > maxSize);

    if (invalidFiles.length > 0) {
      toast.error(`Each image must be less than ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    if (uniqueFiles.length > 0) {
      setImages((prev) => [...prev, ...uniqueFiles]);
    }
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    if (videos.length + 1 > MAX_VIDEOS) {
      toast.error(`Maximum ${MAX_VIDEOS} video allowed`);
      return;
    }

    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      toast.error(`Video must be less than ${MAX_VIDEO_SIZE_MB}MB`);
      return;
    }

    setVideos([file]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
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

    if (showImageUpload && videos.length === 0) {
      toast.error("Please upload video!");
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
            videos: [...videos],
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
        setVideos([]);
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
        // Optional: Sort options alphabetically by label so the restored item is in place
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

      if (res.data.statusMsg === "Valid serial no") {
        setIsValidSerialNumber(true);
        toast.success("Serial number is valid");
      } else {
        toast.error(res.data.statusMsg);
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
      const allFiles = grid.flatMap((item) => [
        ...(item.images || []),
        ...(item.videos || []),
      ]);

      if (allFiles.length === 0) return true;

      setIsUploading(true);
      setUploadProgress(0);
      setCurrentFileInfo({ current: 1, total: allFiles.length });

      const result = await uploadImage({
        files: allFiles,
        ticketNo: ticketNumber,
        documentType: "HVP Parts",
        onProgress: (percent, current, total) => {
          setUploadProgress(percent);
          setCurrentFileInfo({ current, total });
        },
      });

      if (!result.success) {
        toast.error("File upload failed. Please try again.");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Global Upload error", err);
      return false;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFileInfo(null);
    }
  };

  async function onConfirmSave() {
    // 1. Upload Media First

    setSubmitting(true);
    const data = grid.flatMap((item) => {
      // 1. Create the main part object
      const mainPart = {
        partCode: item.partCode,
        inventoryType: item.inventoryType,
        price: item.price,
        serialNo: item.serialNo,
        partDesc: item.desc,
        availableQty: item.availableQty,
        POQty: item.poQty,
        imageupload: item.images.length > 0 || item.videos.length > 0 ? "Uploaded" : null,
      };

      // 2. Check for extra part
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
      const uploadSuccess = await handleUpload();
      if (!uploadSuccess) {
        toast.error("Failed to upload some files. Please try again.");
        return;
      }
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

        toast.success("Request submitted successfully!");
        router.back();
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
      setSaveConfirmationOpen(false);
    } finally {
      setSubmitting(false);
    }

    setSaveConfirmationOpen(false);
  }

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
      <UploadProgressModal
        open={Boolean(activeUpload)}
        title={activeUpload?.title}
        progress={activeUpload?.progress || 0}
        fileInfo={activeUpload?.fileInfo || null}
      />
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
            <div className="min-w-[200px] flex-1">
              <div className="relative">
                <InputField
                  label="Serial Number"
                  value={serialNo}
                  onChange={(e) => {
                    setSerialNo(e.target.value);
                    setIsValidSerialNumber(false);
                  }}
                  placeholder="Enter Serial Number"
                  required
                  onEnterKeyPressed={() => {}}
                />
                {isValidSerialNumber && (
                  <div className="pointer-events-none absolute top-[2.6rem] right-3 -translate-y-1/2 text-green-500">
                    <CheckCircle2 size={20} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Unified Action Button Container */}
          <div className="w-24 flex-none">
            {showSerial && !isValidSerialNumber && (
              <Button
                onClick={checkSerialNumber}
                // className="h-10 w-full cursor-pointer rounded-lg text-sm font-medium text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                style={{ background: colors.primary }}
              >
                Check
              </Button>
            )}

            {selectedPart &&
              (!selectedPart.serialCheck ||
                (selectedPart.serialCheck && isValidSerialNumber)) &&
              !selectedPart.imageUploadRequired && (
                <Button
                  onClick={handleAddToGrid}
                  // className="h-10 w-full cursor-pointer rounded-lg text-sm font-medium text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                  // style={{ background: colors.primary }}
                >
                  Add
                </Button>
              )}
          </div>
        </div>

        {/* Image Upload Section */}
        {showImageUpload && (!showSerial || (showSerial && isValidSerialNumber)) && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                <ImageUpload
                  label="Upload Images"
                  variant="box"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  maxFileAllowed={MAX_IMAGES}
                  maxFileSize={MAX_IMAGE_SIZE_MB}
                  disabled={isSubmitting || isUploading || images.length >= MAX_IMAGES}
                />
                {imagePreviews.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700">
                      Images ({imagePreviews.length}/{MAX_IMAGES})
                    </div>
                    <ImagePreview images={imagePreviews} onRemove={handleRemoveImage} />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <ImageUpload
                  label="Upload Video"
                  variant="box"
                  multiple={false}
                  accept="video/*"
                  onChange={handleVideoSelect}
                  maxFileAllowed={MAX_VIDEOS}
                  maxFileSize={MAX_VIDEO_SIZE_MB}
                  disabled={isSubmitting || isUploading || videos.length >= MAX_VIDEOS}
                />
                {videos.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700">
                      Video ({videos.length}/{MAX_VIDEOS})
                    </div>
                    <ImagePreview
                      images={videos.map(() => ({ type: "video" }))}
                      onRemove={handleRemoveVideo}
                    />
                  </div>
                )}
              </div>
            </div>

            {selectedPart &&
              (!selectedPart.serialCheck ||
                (selectedPart.serialCheck && isValidSerialNumber)) &&
              images.length > 0 &&
              videos.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleAddToGrid}>Add</Button>
                </div>
              )}

            {/* {(imagePreviews.length > 0 || videos.length > 0) && (
              <div className="mt-3 space-y-2">
                {imagePreviews.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700">
                      Images ({imagePreviews.length}/{MAX_IMAGES})
                    </div>
                    <ImagePreview images={imagePreviews} onRemove={handleRemoveImage} />
                  </div>
                )}
                {videos.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700">
                      Video ({videos.length}/{MAX_VIDEOS})
                    </div>
                    <ImagePreview
                      images={videos.map(() => ({ type: "video" }))}
                      onRemove={handleRemoveVideo}
                    />
                  </div>
                )}
              </div>
            )} */}
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
        </div>
      )}

      <div className="mt-4 flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting || isUploading}
        >
          Close
        </Button>
        <Button
          onClick={handleSaveClick}
          disabled={isSubmitting || isUploading || grid.length === 0}
        >
          Save Changes
        </Button>
      </div>

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
              disabled={isSubmitting || isUploading}
              className="cursor-pointer rounded-lg px-4 py-2 text-white transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
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
