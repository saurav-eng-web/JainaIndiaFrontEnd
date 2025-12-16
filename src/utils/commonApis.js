import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import { logger } from "@/utils/logger";

async function updateJob({
  ticketNumber,
  status,
  subStatus,
  message,
  serialNumber,
  loggedInUser,
}) {
  try {
    await axiosInstance.post(`/CallRegister/UpdateComplaint/${ticketNumber}`, {
      complaint_Status: status,
      complaint_SubStatus: subStatus,
      CallTransferBY: loggedInUser,
      dlcity: serialNumber ? `${message} - ${serialNumber}` : message,
    });
  } catch (error) {
    logger.error(`updateJob failed: ${error.message}`, "updateJob", {
      ticketNumber,
      status,
      subStatus,
    });
  }
}

export { updateJob };
