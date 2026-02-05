import axios from "axios";

import { getDocumentsUploadUrl } from "./documentsApi";
import { logger } from "./logger";

async function uploadImage({
  files,
  ticketNo,
  documentType,
  onProgress = null,
  useProxy = false,
  uploadUrl,
}) {
  if (!files) {
    return { success: false, error: "Please select a file" };
  }

  if (!ticketNo || !documentType) {
    return { success: false, error: "ticketNo or documentType is missing" };
  }

  try {
    // Convert single file to array for uniform processing
    const fileArray = Array.isArray(files) ? files : [files];
    const results = [];

    // Upload files one by one
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const formData = new FormData();

      formData.append("file", file);
      formData.append("Ticket_no", ticketNo);
      formData.append("DocumentType", documentType);

      const endpoint = getDocumentsUploadUrl({ useProxy, uploadUrl });

      const res = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        // Track upload progress for current file
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            // Calculate overall progress: (current file index + progress of current file) / total files
            const totalBytes = progressEvent.total || file.size || 0;
            const fileProgress =
              totalBytes > 0
                ? Math.round((progressEvent.loaded * 100) / totalBytes)
                : 0;
            const overallProgress = Math.round(
              ((i + fileProgress / 100) * 100) / fileArray.length
            );
            onProgress(overallProgress, i + 1, fileArray.length);
          }
        },
      });

      if (res.data.status === "Success") {
        results.push({
          success: true,
          fileName: file.name,
          data: res.data,
        });
      } else {
        results.push({
          success: false,
          fileName: file.name,
          error: res.data,
        });
      }
    }

    // Check if all uploads were successful
    const allSuccess = results.every((r) => r.success);
    return {
      success: allSuccess,
      data: results,
      totalFiles: fileArray.length,
      successCount: results.filter((r) => r.success).length,
    };
  } catch (err) {
    console.error("Upload error", err);
    logger.error(`Upload error ${err.message}`, `${documentType}/${ticketNo}`);
    return { success: false, error: err };
  }
}

export { uploadImage };
