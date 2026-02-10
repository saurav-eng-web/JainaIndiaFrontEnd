"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { getUserFromLocalStorage } from "../../../../redux/slices/authSlice";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import { Button } from "@/components/ui/button";
import ImagePreview from "@/components/ui/image/ImagePreview";
import ImageUpload from "@/components/ui/image/ImageUpload";
import PageSkeleton from "@/components/ui/PageSkeleton";
import Subheading from "@/components/ui/Subheading";
import { UploadProgressModal } from "@/components/ui/UploadProgress";
import { useTheme } from "@/theme/ThemeContext";
import { logger } from "@/utils/logger";
import { uploadImage } from "@/utils/uploadImage";

// --- Main Content Component ---
function DetailsContent() {
  // Form State
  const [remarks, setRemarks] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [complaintData, setComplaintData] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(false);
  const router = useRouter();

  // Get ticket number from Redux store instead of query params
  const ticketNo = useSelector((state) => state.routeData.store.claimApproveTicket);
  const { colors } = useTheme();
  const userData = getUserFromLocalStorage();
  const userId = userData?.userID;
  const MAX_FILES = 3;
  const MAX_SIZE_MB = 5;

  // Redirect back if ticketNo is not available (e.g., page reload)
  useEffect(() => {
    if (!ticketNo) {
      router.push("/nsp/claim-approve");
    }
  }, [ticketNo, router]);

  useEffect(() => {
    if (!ticketNo || !userId) return;

    let isMounted = true;

    async function fetchAll() {
      setIsDataLoading(true);
      try {
        // Parallel calls for better performance
        const [docRes, claimRes] = await Promise.all([
          axios.post("/api/documents/list", { Ticket_no: ticketNo }),
          axiosInstance.post("ClaimProcess/select", {
            userId,
            type: "Open1",
            action: "Select",
            RecId: ticketNo,
          }),
        ]);

        if (!isMounted) return;

        // Documents
        setDocuments(docRes?.data?.documents || []);

        // Claim data
        setComplaintData(claimRes?.data?.table1?.[0] || {});
      } catch (err) {
        console.error("Error fetching details:", err);

        logger.error(`Error fetching details: ${err?.message}`, "claim-approve/details");
      } finally {
        setIsDataLoading(false);
      }
    }

    fetchAll();

    return () => {
      isMounted = false; // cleanup
    };
  }, [ticketNo, userId]);

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} images allowed`);
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_SIZE_MB * 1024 * 1024
    );

    if (oversizedFile) {
      toast.error(`Each image must be less than ${MAX_SIZE_MB} MB`);
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    try {
      if (files.length === 0) {
        toast.error("Please select at least one file");
        return { success: false };
      }

      setIsUploading(true);
      setUploadProgress(0);
      setCurrentFileInfo({ current: 1, total: files.length });

      const res = await uploadImage({
        files,
        ticketNo,
        documentType: "Claim Resubmit Document",
        onProgress: (percent, current, total) => {
          setUploadProgress(percent);
          setCurrentFileInfo({ current, total });
        },
      });

      return res;
    } catch (err) {
      console.error("Upload error", err);
      logger.error(`Upload error ${err.message}`, "claim-approve/details");
      return { success: false, error: err };
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }
    setIsDataLoading(true);

    // 1) Upload file first
    const uploadResult = await handleUpload();

    if (!uploadResult.success) {
      toast.error("File upload failed. Please try again.");
      setIsDataLoading(false);
      return;
    }

    // 2) After upload succeeds, call second API
    try {
      const res = await axiosInstance.post("ClaimProcess/update", {
        UserId: userId,
        Type: "Upload",
        Action: "update",
        RecId: ticketNo,
        Remarks: remarks,
      });

      toast.success("Saved successfully");
    } catch (err) {
      console.error("Save error", err);
      logger.error(`Save error ${err.message}`, "claim-approve/details");
      toast.error("Save failed. Please try again.");
    }

    setIsDataLoading(false);
  };

  const handleDownload = async (url, filename) => {
    try {
      // 1. Fetch the file data
      const response = await fetch(url);

      // 2. Convert to Blob (Binary Large Object)
      const blob = await response.blob();

      // 3. Create a temporary URL for the Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // 4. Create a temporary anchor element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename; // This forces the download name

      // 5. Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed");
      logger.error(`Downloading image failed ${error.message}`, "claim-approve/details");
      // Fallback: Just open in new tab if the fetch fails (e.g. CORS error)
      window.open(url, "_blank");
    }
  };

  // Define columns for the Table component
  const complaintColumns = [
    { label: "Id", key: "TicketKey", size: "xs" },
    { label: "Complaint Number", key: "ticket_no", size: "md" },
    { label: "Serial Number", key: "serialNo", size: "md" },
    { label: "Call Type", key: "callType", size: "sm" },
    { label: "Warranty", key: "warranty", size: "sm" },
    { label: "DOP", key: "DOP", size: "sm" },
    { label: "Finance Remarks", key: "FinanceRemarks", size: "xl" },
    { label: "Rejection Reason", key: "Action", size: "xl" },
    { label: "Rejection Date", key: "RejectionDate", size: "sm" },
    { label: "OK Date", key: "OKDate", size: "sm" },
    { label: "Customer Name", key: "CustName", size: "sm" },
    { label: "Customer Mobile", key: "CustMobile", size: "sm" },
  ];

  const documentsColumns = [
    { label: "Sr. No.", key: "rowNum", size: "sm" },
    { label: "Document Type", key: "documentType", size: "xl" },
    { label: "Entered Date", key: "enteredDate", size: "md" },
    {
      label: "Action",
      key: "action",
      size: "sm",
      render: (_value, doc) => (
        <button
          onClick={() =>
            handleDownload(
              doc?.documentURL,
              doc?.documentURL.split("/")[doc?.documentURL?.split("/").length - 1]
            )
          }
          className="group flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          Download
        </button>
      ),
    },
  ];

  // Prepare rows data - Table component expects an array
  const complaintRows = Object.keys(complaintData).length > 0 ? [complaintData] : [];

  return (
    <PageSkeleton title="Claim Details" rolesAllowed={["BR", "NSP", "SF/SSD"]}>
      {/* <Subheading title="Cal" /> */}
      {isDataLoading ? (
        <div className="p-4 text-center text-slate-500">Loading...</div>
      ) : (
        <div className="mt-4">
          <Table columns={complaintColumns} rows={complaintRows} />
        </div>
      )}
      {/* <h2 className="mt-16 mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
        Documents
      </h2> */}
      <Subheading title="Documents" marginTop={8} />

      {isDataLoading ? (
        <div className="p-4 text-center text-slate-500">Loading...</div>
      ) : (
        <Table columns={documentsColumns} rows={documents} />
      )}
      {/* Section 3: Input Area (Remarks & Image Upload) */}
      <UploadProgressModal
        open={isUploading}
        title="Uploading Files"
        progress={uploadProgress}
        fileInfo={currentFileInfo}
      />
      <div className="mt-6 rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="remarks" className="block text-sm font-bold text-[#714b67]">
              Remarks <span className="text-sm text-red-500">*</span>
            </label>
            <textarea
              id="remarks"
              rows={4}
              className="w-full resize-none rounded-md border border-[#714b67] bg-white px-3 py-2 text-sm shadow-sm transition-all outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#714b67]"
              placeholder="Enter remarks here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <ImageUpload
              label="Image Upload"
              variant="box"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              maxFileAllowed={MAX_FILES}
              maxFileSize={MAX_SIZE_MB}
              required
            />
          </div>

          {previews.length > 0 && (
            <div className="rounded-lg bg-white">
              <h4 className="mb-2 text-sm font-semibold text-gray-700">
                Selected Images ({previews.length})
              </h4>
              <ImagePreview images={previews} onRemove={handleRemove} />
            </div>
          )}
        </div>
      </div>
      {/* Section 4: Actions */}
      <div className="flex flex-col gap-4 pt-4 sm:flex-row">
        <Button variant="outline" onClick={() => router.back()}>
          {/* <Save className="mr-2 h-4 w-4" /> */}
          Back
        </Button>
        <Button onClick={handleSave} disabled={isDataLoading || isUploading}>
          {/* <ArrowLeft className="mr-2 h-4 w-4" /> */}
          {isUploading ? "Uploading..." : isDataLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </PageSkeleton>
  );
}

export default function DetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
