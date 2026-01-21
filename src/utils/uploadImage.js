import axios from "axios";

import { logger } from "./logger";

async function uploadImage({ file, ticketNo, documentType }) {
  if (!file) {
    return { success: false, error: "Please select a file" };
  }

  if (!ticketNo || !documentType) {
    console.log("received data: ", { ticketNo, documentType });
    // toast.error("Something went wrong, please try again");
    return { success: false, error: "ticketNo or documentType is missing" };
  }
  try {
    const formData = new FormData();
    if (Array.isArray(file)) {
      file.forEach((f) => formData.append("file", f));
    } else {
      formData.append("file", file);
    }

    formData.append("Ticket_no", ticketNo);
    formData.append("DocumentType", documentType);

    const res = await axios.post("/api/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.status === "Success") {
      return { success: true, data: res.data };
    } else {
      return { success: false, error: res.data };
    }
  } catch (err) {
    console.error("Upload error", err);
    logger.error(`Upload error ${err.message}`, `${documentType}/${ticketNo}`);
    return { success: false, error: err };
  }
}

export { uploadImage };
