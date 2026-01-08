import React from "react";

export default function CustomerDetailTab({ detail }) {
  if (!detail) return <p>No customer details available.</p>;

  return (
    <div className="tab-section">
      <h3 style={{ fontWeight: "bold" }}>👤 Customer Detail</h3>
      <div className="row-content">
        <div>
          <strong>Salutation:</strong> {detail.salutation || "-"}
        </div>
        <div>
          <strong>Name:</strong>{" "}
          {`${detail.firstname || ""} ${detail.middlename || ""} ${
            detail.lastname || ""
          }`}
        </div>
        <div>
          <strong>Mobile No:</strong> {detail.mobile || "-"}
        </div>
        <div>
          <strong>Alternate No:</strong> {detail.wkph || detail.hmph || "-"}
        </div>
        <div>
          <strong>Caller Number:</strong> {detail.complaint || "-"}
        </div>
        <div>
          <strong>Address:</strong>{" "}
          {`${detail.addresS1 || ""} ${detail.addresS2 || ""} ${
            detail.addresS3 || ""
          }`}
        </div>
        <div>
          <strong>Landmark:</strong> {detail.landmark || "-"}
        </div>
        <div>
          <strong>Locality:</strong> {detail.locality || "-"}
        </div>
        <div>
          <strong>City:</strong> {detail.city || "-"}
        </div>
        <div>
          <strong>Pincode:</strong> {detail.pincode || "-"}
        </div>
        <div>
          <strong>State:</strong> {detail.state || "-"}
        </div>
      </div>
    </div>
  );
}
