"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import PartMultiSelect from "./PartMultiSelect";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import ModalSkeleton from "@/components/customui/ModalSkeleton";
import TextArea from "@/components/customui/Textarea";

// The documents service uses documentURL (capital URL); match keys ignoring case
// so a rename on their side cannot silently blank the thumbnails.
function pickKey(doc, ...names) {
  const keys = Object.keys(doc || {});

  for (const name of names) {
    const match = keys.find((key) => key.toLowerCase() === name.toLowerCase());
    if (match && doc[match]) return doc[match];
  }

  return "";
}

function pickUrl(doc) {
  return pickKey(
    doc,
    "documentURL",
    "documentURL1",
    "docurl",
    "fileUrl",
    "url",
    "filePath"
  );
}

function pickName(doc, index) {
  return pickKey(doc, "fileName", "documentType", "name") || `Document ${index + 1}`;
}

export default function UpdateModal({ detail, onClose, onSaved }) {
  const [problemRemarks, setProblemRemarks] = useState("");
  const [partCodes, setPartCodes] = useState([]);
  const [partOptions, setPartOptions] = useState([]);
  const [isLoadingParts, setIsLoadingParts] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Part list comes from the CRM endpoint with action=partload
  const fetchParts = useCallback(async () => {
    try {
      setIsLoadingParts(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        action: "partload",
        SerialNumber: detail?.serialNo,
        ticketno: detail?.ticketNo,
      });

      const rows = res.data?.data || res.data?.Data || [];

      setPartOptions(
        rows
          .map((row) => {
            const part = row.Part ?? row.part ?? row.PartCode ?? row.partcode ?? "";
            return { label: String(part), value: String(part) };
          })
          .filter((opt) => opt.value)
      );
    } catch (error) {
      console.error("Error loading part codes:", error);
      toast.error("Failed to load part codes");
    } finally {
      setIsLoadingParts(false);
    }
  }, [detail?.serialNo, detail?.ticketNo]);

  // Images live on the separate documents service, proxied by our own route
  const fetchDocuments = useCallback(async () => {
    if (!detail?.ticketNo) return;

    try {
      setIsLoadingDocs(true);

      const res = await axios.post("/api/documents/list", {
        Ticket_no: detail.ticketNo,
      });

      const list = res.data?.documents || res.data?.Documents || [];

      setDocuments(
        list
          .map((doc, index) => ({ url: pickUrl(doc), name: pickName(doc, index) }))
          .filter((doc) => doc.url)
      );
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Failed to load images");
    } finally {
      setIsLoadingDocs(false);
    }
  }, [detail?.ticketNo]);

  useEffect(() => {
    fetchParts();
    fetchDocuments();
  }, [fetchParts, fetchDocuments]);

  function downloadUrl(url) {
    return `/api/documents/download-kp?url=${encodeURIComponent(url)}`;
  }

  async function handleSubmit() {
    if (!problemRemarks.trim()) {
      toast.error("Please enter Problem Remarks");
      return;
    }

    if (partCodes.length === 0) {
      toast.error("Please select at least one Part Code");
      return;
    }

    const payload = {
      SerialNumber: detail?.serialNo,
      ticketno: detail?.ticketNo,
      Problem_Remarks: problemRemarks,
      PartCodes: partCodes.join(","),
    };

    // TODO: the submit action for this modal has not been provided yet
    console.log("Update payload ready to submit:", payload);
    setIsSaving(true);
    toast.error("Submit action not configured yet");
    setIsSaving(false);
    onSaved?.(detail);
  }

  return (
    <ModalSkeleton title="Update" rolesAllowed={["repaircenter"]} size="lg">
      <div className="w-[38rem]">
        <div className="grid grid-cols-2 gap-6">
          <InputField label="Ticket No" value={detail?.ticketNo || "-"} disabled />
          <InputField label="Serial Number" value={detail?.serialNo || "-"} disabled />
        </div>

        <div className="mt-6">
          <TextArea
            label="Problem Remarks"
            placeholder="Enter problem remarks"
            value={problemRemarks}
            onChange={(e) => setProblemRemarks(e.target.value)}
            required
          />
        </div>

        <div className="mt-6">
          <PartMultiSelect
            label="Part Code"
            options={partOptions}
            value={partCodes}
            onChange={setPartCodes}
            isLoading={isLoadingParts}
            required
          />

          <p className="mt-1 text-xs text-gray-500">
            {partCodes.length > 0
              ? `${partCodes.length} part(s) selected`
              : "You can select more than one part"}
          </p>
        </div>

        {/* IMAGES FOR THIS TICKET */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-[#714b67]">
            Images
            {documents.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                {documents.length} file(s)
              </span>
            )}
          </p>

          {isLoadingDocs ? (
            <p className="text-sm text-gray-500">Loading images...</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-gray-500">No images found for this ticket.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {documents.map((doc, index) => (
                <div
                  key={`${doc.url}-${index}`}
                  className="w-28 rounded-lg border border-gray-200 p-2 transition-shadow duration-300 hover:shadow-md"
                >
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.url}
                      alt={doc.name}
                      className="h-20 w-full cursor-pointer rounded object-cover"
                    />
                  </a>

                  <p className="mt-1 truncate text-[11px] text-gray-600" title={doc.name}>
                    {doc.name}
                  </p>

                  <a
                    href={downloadUrl(doc.url)}
                    className="mt-1 block text-center text-[11px] font-semibold text-[#714b67] hover:underline"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Submitting..." : "Submit"}
          </Button>

          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </ModalSkeleton>
  );
}
