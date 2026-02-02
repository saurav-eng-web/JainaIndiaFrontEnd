import React from "react";

export default function ProductDetailsTab({ detail }) {
  if (!detail) return <p>No product details available.</p>;

  return (
    <div className="tab-section">
      <h3 style={{ fontWeight: "bold" }}>📦 Product Details</h3>
      <div className="row-content">
        <div>
          <strong>Model:</strong> {detail.model || "-"}
        </div>
        <div>
          <strong>Product Category:</strong> {detail.category || "-"}
        </div>
        <div>
          <strong>Product:</strong> {detail.product || "-"}
        </div>
        <div>
          <strong>Serial No.:</strong> {detail.seriaL_NO || "-"}
        </div>
        <div>
          <strong>Purchase Date:</strong>{" "}
          {detail.purchasE_DATE
            ? new Date(detail.purchasE_DATE).toLocaleDateString()
            : "-"}
        </div>
        <div>
          <strong>Warranty:</strong> {detail.warranty || "-"}
        </div>
        <div>
          <strong>BOM Type:</strong> {detail.bomType || "-"}
        </div>
        <div>
          <strong>Model Description:</strong> {detail.modelDesc || "-"}
        </div>
      </div>
    </div>
  );
}
