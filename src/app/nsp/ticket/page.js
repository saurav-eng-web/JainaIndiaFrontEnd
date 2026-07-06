"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";
import ImagePreview from "@/components/customui/image/ImagePreview";
import ImageUpload from "@/components/customui/image/ImageUpload";
import InputField from "@/components/customui/InputWithLabel";
import Modal from "@/components/customui/Modal";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import { UploadProgressModal } from "@/components/customui/UploadProgress";
import { uploadImage } from "@/utils/uploadImage";

const toDropdownOptions = (data) =>
  Array.isArray(data)
    ? data.map((item) => ({
      label: String(item.label ?? item.value ?? item.key ?? ""),
      value: item.value ?? item.key ?? "",
    }))
    : [];

export default function Page() {
  const [complaints, setComplaints] = useState([]);
  const [issueList, setIssueList] = useState([]);
  const [assignToList, setAssignToList] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [userId, setUserId] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const MAX_IMAGES = 5;
  const MAX_IMAGE_SIZE_MB = 5;

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      setUserId(user.userID ?? null);
    } catch (error) {
      console.error("Error parsing userData from localStorage", error);
    }
  }, []);

  const fetchTickets = async (currentUserId) => {
    if (!currentUserId) return;
    try {
      const payload = {
        type: "GetTickets",
        RaisedByUserID: currentUserId,
        UserID: currentUserId,
      };
      const res = await axiosInstance.post("Ticket/process", payload);
      if (res.data?.statusCode === 200) {
        setTickets(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching tickets", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    console.log("env: ", process.env.NEXT_PUBLIC_DOC_BASE_URL);

    async function fetchDropdownData() {
      if (!userId) return;

      try {
        const [complaintRes, issueRes, assignRes] = await Promise.all([
          axiosInstance.post("/DropdownMaster/GetDropdown", {
            type: "callno",
            dispatchType: String(userId),
          }),
          axiosInstance.post("/DropdownMaster/GetDropdown", {
            type: "getproblem",
          }),
          axiosInstance.post("/DropdownMaster/GetDropdown", {
            type: "getassignedto",
          }),
        ]);

        if (!isMounted) return;

        setComplaints(toDropdownOptions(complaintRes.data?.data));
        setIssueList(toDropdownOptions(issueRes.data?.data));
        setAssignToList(toDropdownOptions(assignRes.data?.data));

        fetchTickets(userId);
      } catch (error) {
        console.error("Unable to load ticket dropdowns", error);
        if (!isMounted) return;

        setComplaints([]);
        setIssueList([]);
        setAssignToList([]);
      }
    }

    fetchDropdownData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!images || images.length === 0) {
      setImagePreviews([]);
      return;
    }

    const newPreviews = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + images.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024
    );

    if (oversizedFile) {
      toast.error(`Each image must be less than ${MAX_IMAGE_SIZE_MB} MB`);
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const activeUpload = isUploading
    ? {
      title: "Uploading Images",
      progress: uploadProgress,
      fileInfo: currentFileInfo,
    }
    : null;

  async function submitRequest() {
    if (!selectedComplaint || !selectedIssue || !selectedAssignee || !remarks) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    let imageUrls = "";

    try {
      if (images.length > 0) {
        setIsUploading(true);
        const uniqueTicketNo = "ticket-" + new Date().getTime();

        const uploadResult = await uploadImage({
          files: images,
          ticketNo: uniqueTicketNo,
          documentType: "ticket_images",
          onProgress: (percent, current, total) => {
            setUploadProgress(percent);
            setCurrentFileInfo({ current, total });
          },
        });

        if (!uploadResult.success) {
          toast.error("Image upload failed. Please try again.");
          setIsUploading(false);
          setIsSubmitting(false);
          return;
        }

        // Extract URLs. Assuming the backend returns the URL in docurl or similar.
        imageUrls = uploadResult.data
          .map((item) => {
            const d = item.data || {};
            // Attempt to find the URL in common response fields
            return (
              d.docurl ||
              d.docUrl ||
              d.fileUrl ||
              d.url ||
              d.FileUrl ||
              d.imageUrl ||
              d.ImageUrl ||
              ""
            );
          })
          .filter(Boolean)
          .join(",");
      }

      const payload = {
        type: "InsertTicket",
        ProblemName: selectedIssue,
        RaisedByUserID: userId,
        AssignTo: selectedAssignee,
        ImageURLs: imageUrls,
        ComplaintNo: selectedComplaint,
        Remarks: remarks,
      };

      const res = await axiosInstance.post("Ticket/process", payload);

      if (res.data?.statusCode === 200) {
        toast.success(res.data.statusMsg || "Ticket raised successfully");
        const newTicketNumber = res.data.data?.[0]?.TicketNumber;
        if (newTicketNumber) {
          toast.success(`Ticket Number: ${newTicketNumber}`, { duration: 5000 });
        }

        // Reset form
        setSelectedComplaint("");
        setSelectedIssue("");
        setSelectedAssignee("");
        setRemarks("");
        setImages([]);
        fetchTickets(userId);
      } else {
        toast.error("Failed to raise ticket");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred while submitting the ticket");
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
      setUploadProgress(0);
      setCurrentFileInfo(null);
    }
  }

  const columns = [
    { label: "Ticket Number", key: "Ticket_No", size: "md" },
    { label: "Complaint No", key: "ComplaintNo", size: "md" },
    {
      label: "Ticket Date",
      key: "TicketDate",
      size: "md",
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString() +
          " " +
          new Date(value).toLocaleTimeString()
          : "",
    },
    { label: "Issue", key: "Problem", size: "lg" },
    { label: "Remarks", key: "ProblemRemarks", size: "lg" },
    {
      label: "Status",
      key: "TicketStatus",
      size: "sm",
      render: (value) => {
        let badgeClass = "bg-gray-100 text-gray-800";
        const upperValue = String(value || "").toUpperCase();
        if (upperValue.includes("OPEN") || upperValue.includes("ASSIGNED")) {
          badgeClass = "bg-blue-100 text-blue-800";
        } else if (upperValue.includes("CLOSED") || upperValue.includes("RESOLVED")) {
          badgeClass = "bg-green-100 text-green-800";
        } else if (upperValue.includes("REJECTED") || upperValue.includes("CANCELLED")) {
          badgeClass = "bg-red-100 text-red-800";
        } else if (upperValue.includes("TRANSFERRED")) {
          badgeClass = "bg-orange-100 text-orange-800";
        }

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
          >
            {value}
          </span>
        );
      },
    },
    { label: "Assigned to", key: "CurrentAssigneeTo", size: "sm" },
    {
      label: "Images",
      key: "ImageURLs",
      size: "md",
      render: (value) => {
        if (!value) return <span className="text-sm text-gray-400">No Images</span>;
        const urls = value
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean);
        return (
          <div className="flex flex-wrap gap-2">
            {urls.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => setSelectedImage(url)}
                className="cursor-pointer rounded focus:ring-2 focus:ring-[#714b67] focus:ring-offset-2 focus:outline-none"
                aria-label={`Open ticket attachment ${index + 1}`}
              >
                <img
                  src={url}
                  alt={`Ticket Attachment ${index + 1}`}
                  className="h-10 w-10 rounded border border-gray-200 object-cover"
                />
              </button>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <PageSkeleton title="Ticket Portal" rolesAllowed={["BR", "NSP"]}>
      <UploadProgressModal
        open={Boolean(activeUpload)}
        title={activeUpload?.title}
        progress={activeUpload?.progress || 0}
        fileInfo={activeUpload?.fileInfo || null}
      />
      <Modal open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)}>
        <div className="flex max-h-[90vh] max-w-[90vw] items-center justify-center p-4 pt-12">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Ticket attachment preview"
              className="max-h-[80vh] max-w-[85vw] rounded object-contain"
            />
          )}
        </div>
      </Modal>
      <Subheading title="Raise Ticket" marginTop={8} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CustomDropdown
          options={complaints}
          value={selectedComplaint}
          label="Select Complaints"
          onChange={setSelectedComplaint}
          placeholder="----Select----"
        />
        <CustomDropdown
          options={issueList}
          value={selectedIssue}
          label="Select Issue"
          onChange={setSelectedIssue}
          placeholder="----Select----"
        />
        <CustomDropdown
          options={assignToList}
          value={selectedAssignee}
          label="Assign To"
          onChange={setSelectedAssignee}
          placeholder="----Select----"
        />

        <InputField
          label="Remarks"
          value={remarks}
          onChange={(e) => {
            setRemarks(e.target.value);
          }}
          placeholder="Enter Remarks"
          required
          onEnterKeyPressed={() => { }}
        />
      </div>

      <div className="mt-6 flex w-full max-w-4xl flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/2">
          <ImageUpload
            label="Upload Images"
            variant="box"
            maxFileAllowed={MAX_IMAGES}
            maxFileSize={MAX_IMAGE_SIZE_MB}
            onChange={handleImageChange}
            multiple={true}
            accept="image/*"
            disabled={images.length >= MAX_IMAGES || isUploading || isSubmitting}
          />
        </div>
        {imagePreviews.length > 0 && (
          <div className="w-full rounded-lg p-4 md:w-1/2">
            <h4 className="mb-3 text-sm font-semibold text-gray-700">
              Selected Images ({imagePreviews.length})
            </h4>
            <ImagePreview images={imagePreviews} onRemove={handleRemoveImage} />
          </div>
        )}
      </div>

      <Button
        className="mt-6 ml-auto w-32"
        onClick={submitRequest}
        disabled={isUploading || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Raise Ticket"}
      </Button>

      <Subheading title="Ticket Details" marginTop={8} />
      {tickets.length > 0 ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <Table columns={columns} rows={tickets} />
        </div>
      ) : (
        <div className="mt-4 text-gray-500">No tickets found.</div>
      )}
    </PageSkeleton>
  );
}
