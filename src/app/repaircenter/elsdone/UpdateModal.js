"use client";

import axios from "axios";
import { FileText, Video } from "lucide-react";
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

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v", "avi", "mkv", "3gp", "ogv"];
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "heic"];

// Uploads are not all images - videos rendered in an <img> show as a broken icon
function kindOf(url) {
  const path = String(url).split("?")[0].split("#")[0];
  const ext = path.split(".").pop().toLowerCase();

  if (VIDEO_EXTENSIONS.includes(ext)) return "video";
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  return "file";
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
          .map((doc, index) => {
            const url = pickUrl(doc);
            return { url, name: pickName(doc, index), kind: kindOf(url) };
          })
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

    // Keys match the JSON_VALUE paths the SP reads: $.action, $.SerialNumber,
    // $.ticketno, $.Problem_Remarks, $.PartCodes ($.userid comes from the token)
    const payload = {
      action: "update_els",
      SerialNumber: detail?.serialNo,
      ticketno: detail?.ticketNo,
      Problem_Remarks: problemRemarks,
      PartCodes: partCodes.join(","),
    };

    try {
      setIsSaving(true);

      const res = await axiosInstance.post("TDDOAPickup/process", payload);
      const body = res.data || {};
      const statusMsg = String(body.statusMsg || "");

      if (body.statusCode !== 200) {
        toast.error(statusMsg || "Failed to update");
        return;
      }

      toast.success(statusMsg || "Updated successfully");
      onSaved?.(detail);
      onClose?.();
    } catch (error) {
      console.error("Error updating ELS record:", error);
      toast.error(error?.response?.data?.statusMsg || "Failed to update");
    } finally {
      setIsSaving(false);
    }
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
          />

          <p className="mt-1 text-xs text-gray-500">
            {partCodes.length > 0
              ? `${partCodes.length} part(s) selected`
              : "Optional - you can select more than one part"}
          </p>
        </div>

        {/* IMAGES FOR THIS TICKET */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-[#714b67]">
            Attachments
            {documents.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                {documents.length} file(s)
              </span>
            )}
          </p>

          {isLoadingDocs ? (
            <p className="text-sm text-gray-500">Loading attachments...</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-gray-500">No attachments found for this ticket.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {documents.map((doc, index) => (
                <div
                  key={`${doc.url}-${index}`}
                  className="w-28 rounded-lg border border-gray-200 p-2 transition-shadow duration-300 hover:shadow-md"
                >
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.kind === "image" ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={doc.url}
                        alt={doc.name}
                        onError={(e) => {
                          // a dead link would otherwise show the broken-image icon
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextSibling.style.display = "flex";
                        }}
                        className="h-20 w-full cursor-pointer rounded object-cover"
                      />
                    ) : null}

                    <div
                      style={{ display: doc.kind === "image" ? "none" : "flex" }}
                      className="h-20 w-full cursor-pointer items-center justify-center rounded bg-[#714b67]/10 text-[#714b67]"
                    >
                      {doc.kind === "video" ? (
                        <Video size={22} />
                      ) : (
                        <FileText size={22} />
                      )}
                    </div>
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
