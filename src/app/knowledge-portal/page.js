"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { logger } from "@/utils/logger";
import PageSkeleton from "@/components/ui/PageSkeleton";
import Table from "@/components/common/Table";

const KnowledgePortal = () => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  const columns = [
    {
      label: "Sr. No.",
      key: "sr",
      size: "xs",
      render: (_v, _row, index) => index + 1,
    },
    {
      label: "Document Name",
      key: "fileName",
      size: "xl",
      render: (v) => <span className="font-medium">{v}</span>,
    },
    {
      label: "Entered Date",
      key: "enteredDate",
      size: "md",
    },
    {
      label: "Action",
      key: "action",
      size: "sm",
      render: (_v, row) => (
        <button
          onClick={() =>
            toast.promise(
              handleDownload(
                row.documentURL,
                row.documentURL?.split("/").pop() || "file"
              ),
              {
                loading: "Downloading file...",
                success: "File downloaded successfully!",
                error: (err) => err.message || "Failed to download file.",
              },
              { style: { minWidth: "300px" } }
            )
          }
          className="group flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          Download
        </button>
      ),
    },
  ];

  useEffect(() => {
    let isMounted = true;

    async function fetchAll() {
      setIsDataLoading(true);
      try {
        // Parallel calls for better performance
        const res = await axios.post("/api/documents/knowledge-portal");

        if (!isMounted) return;

        // Documents
        setDocuments(res?.data?.documents || []);

        // Claim data
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
  }, []);

  const handleDownload = (url, filename) => {
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "";
        link.target = "_self"; // important
        document.body.appendChild(link);
        link.click();
        link.remove();

        resolve(true); // ✅ tell toast it succeeded
      } catch (error) {
        console.error("Download failed:", error);
        reject(new Error("File download failed. Please try again."));
      }
    });
  };

  return (
    <PageSkeleton title="Knowledge Portal" rolesAllowed={["asm", "br"]}>
      <div className="overflow-x-auto rounded-md border border-slate-300">
        <div className="overflow-x-auto rounded-md border border-slate-300">
          <Table columns={columns} rows={documents} isLoading={isDataLoading} />
        </div>
      </div>
    </PageSkeleton>
  );
};

export default KnowledgePortal;
