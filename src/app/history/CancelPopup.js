"use client";

import { useCallback, useMemo, useState } from "react";

import CustomDropdown from "@/components/common/Dropdown";
import { useTheme } from "@/theme/ThemeContext";

export default function CancelPopup({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) {
  const { colors } = useTheme();
  const [warning, setWarning] = useState(""); // <-- Added state

  const cancelOptions = useMemo(
    () => [
      // Note: The "Select" option uses the label text as the value for consistency.
      { label: "----Select----", value: "----Select----" },
      {
        label: "Not required service / complaint cancel by customer",
        value: "Not required service / complaint cancel by customer",
      },
      {
        label: "Customer not responding/ number not reachable or switched off",
        value: "Customer not responding/ number not reachable or switched off",
      },
      {
        label: "Customer donot have bill or document",
        value: "Customer donot have bill or document",
      },
      { label: "Customer out of station", value: "Customer out of station" },
      { label: "Duplicate complaints", value: "Duplicate complaints" },
      {
        label: "Damage / Defective product",
        value: "Damage / Defective product",
      },
      {
        label: "Not repairable at home, so visit at shop",
        value: "Not repairable at home, so visit at shop",
      },
      {
        label: "Customer went to dealer shop for service",
        value: "Customer went to dealer shop for service",
      },
      {
        label: "Not ready to pay for spare/service",
        value: "Not ready to pay for spare/service",
      },
      {
        label: "Product is not repairable",
        value: "Product is not repairable",
      },
      {
        label: "Customer didnot register the complaint",
        value: "Customer didnot register the complaint",
      },
      { label: "Wrong address", value: "Wrong address" },
      { label: "Wrong contact number", value: "Wrong contact number" },
      {
        label: "Old product, Spare not available",
        value: "Old product, Spare not available",
      },
      {
        label: "Replacement / unavailability of product",
        value: "Replacement / unavailability of product",
      },
      { label: "Sales Enquiry", value: "Sales Enquiry" },
      {
        label: "Call resolved over phone.",
        value: "Call resolved over phone.",
      },
      {
        label: "Unit working fine, no visit required.",
        value: "Unit working fine, no visit required.",
      },
      { label: "Others", value: "Others" },
    ],
    []
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setFormData]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.contactPerson?.trim()) {
      setWarning("Contact Person is required.");
      return;
    }
    if (!formData.cancelReason) {
      setWarning("Please select a cancellation reason.");
      return;
    }

    setWarning(""); // Clear warning if valid
    onSubmit();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20">
      <div
        className="w-full max-w-md rounded-2xl bg-[#fdfdfd] p-6 shadow-lg transition-all duration-300"
        style={{
          background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
        }}
      >
        <h2 className="mb-5 border-b border-[#714b67] pb-2 text-lg font-bold text-[#714b67]">
          Request for Cancellation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Person */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#714b67]">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]"
              placeholder="Enter contact person name"
              required
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#714b67]">
              Customer Remarks
            </label>
            <textarea
              name="customerRemarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]"
              placeholder="Enter remarks"
              required
            />
          </div>

          {/* Cancel Reason (Custom Dropdown) */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#714b67]">
              Cancel Reason
            </label>
            <CustomDropdown
              options={cancelOptions}
              value={formData.cancelReason}
              onChange={(val) => setFormData((prev) => ({ ...prev, cancelReason: val }))}
              placeholder="----Select----"
            />
          </div>

          {/* Warning Message */}
          {warning && <p className="text-sm font-medium text-red-600">{warning}</p>}

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#714b67] px-4 py-2 text-sm font-semibold text-[#714b67] transition hover:bg-[#714b67]/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#714b67] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5d3d56]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
