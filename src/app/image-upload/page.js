"use client";

import { useState } from "react";

import axiosInstance from "@/api/axiosInstance"; // adjust if your instance path differs
import ImageUpload from "@/components/ui/image/ImageUpload";
import { useTheme } from "@/theme/ThemeContext";

export default function TestUploadPage() {
  const { colors } = useTheme();

  const [file, setFile] = useState(null);
  const [ticketNo, setTicketNo] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !ticketNo || !documentType) {
      setResponseMsg("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setResponseMsg("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("ticketno", ticketNo);
      formData.append("documentType", documentType);

      const res = await axiosInstance.post("/DocumentUpload/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResponseMsg("Upload Successful.");
    } catch (error) {
      console.error("Upload failed:", error);
      setResponseMsg("Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10" style={{ backgroundColor: colors.background }}>
      <div
        className="mx-auto max-w-xl rounded-lg p-6 shadow-lg"
        style={{
          background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
        }}
      >
        <h2 className="mb-4 border-b-2 border-[#714b67] pb-2 text-xl font-bold text-[#714b67]">
          Test Image Upload API
        </h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <ImageUpload
              variant="box"
              onChange={(e) => setFile(e.target.files[0])}
              multiple={true}
            />{" "}
            <ImageUpload
              variant="box"
              onChange={(e) => setFile(e.target.files[0])}
              multiple={true}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="file:hover: block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:h-8 file:w-24 file:rounded-lg file:bg-[#714b67] file:text-white"
          />
          <input
            type="text"
            placeholder="Ticket Number"
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800"
          />
          <input
            type="text"
            placeholder="Document Type"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full rounded-md bg-[#714b67] px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          {responseMsg && (
            <p className="mt-2 text-center text-sm font-medium">{responseMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
