import React from "react";

import { formatIndianDate } from "@/utils/formatDate";

export default function JobDetailsTab({ detail, firstEntry }) {
  if (!detail) return <p>No details available.</p>;

  return (
    <div className="tab-section">
      <h3 style={{ fontWeight: "bold" }}>📌 Job Details</h3>
      <div className="row-content">
        <div>
          <strong>Ticket No:</strong> {detail.tickeT_NO || "-"}
        </div>

        <div>
          <strong>Complaint Status:</strong> {detail.complainT_STATUS || "-"}
        </div>
        <div>
          <strong>Complaint Sub-status:</strong> {detail.complaint_SubStatus || "-"}
        </div>
        <div>
          <strong>Remarks:</strong> {detail.email || "-"}
        </div>
        <div>
          <strong>Call By:</strong> {detail.calL_BY || "-"}
        </div>
        <div className="!overflow-hidden !text-ellipsis !whitespace-nowrap">
          <strong>Complaint Date:</strong>
          {detail.tdate
            ? new Date(detail.tdate).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "-"}
        </div>
        <div>
          <strong>Call Type:</strong> {detail.calL_TYPE || "-"}
        </div>
        <div>
          <strong>Entered By:</strong> {detail.enterby || "-"}
        </div>
        <div>
          <strong>Escalated to HO:</strong> {firstEntry?.escalated === 1 ? "Yes" : "No"}
        </div>
        <div>
          <strong>NSP:</strong> {detail.branchName || "-"}
        </div>
        <div>
          <strong>SF Name:</strong> {detail.asC_NAME || "-"}
        </div>
        <div>
          <strong>SF Code:</strong> {detail.asC_CODE || "-"}
        </div>
        <div>
          <strong>SF Mobile No.:</strong> {detail.stdCode || "-"}
        </div>
        <div>
          <strong>Appointment Date:</strong> {formatIndianDate(detail.apptDate) || "-"}
        </div>
        <div>
          <strong>Appointment Time:</strong> {detail.apptTime || "-"}
        </div>
        <div>
          <strong>Promise Date:</strong>
          {detail.promisE_DATE ? formatIndianDate(detail.promisE_DATE) : "-"}
        </div>
        <div>
          <strong>Promise Time:</strong> {detail.promisE_TIME || "-"}
        </div>
        <div>
          <strong>Legal Case:</strong> {detail.legal === 1 ? "Yes" : "No"}
        </div>
        <div>
          <strong>Special Instructions:</strong> {detail.splInt || "-"}
        </div>
        <div>
          <strong>VOC:</strong> {detail.remarks || "-"}
        </div>
      </div>
    </div>
  );
}
