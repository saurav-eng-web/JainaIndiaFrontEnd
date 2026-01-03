"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";

import CustomDropdown from "@/components/common/Dropdown";

export default function CustomerDetailsStep({
  formData,
  handleChange,
  setFormData,
  errors,
}) {
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
  };

  const fieldLabels = {
    title: "Title",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone",
    altPhone: "Alternate Number",
  };

  // Options for title dropdown
  const titleOptions = [
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
    { label: "Ms", value: "Ms" },
    { label: "Dr", value: "Dr" },
  ];

  return (
    <>
      <h3 className="mb-5 text-lg font-semibold text-gray-800">Customer Details</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Call By */}
        <div className="flex flex-col">
          <label htmlFor="callBy" className="mb-2 pl-2 text-sm font-medium text-gray-800">
            Select
          </label>

          <CustomDropdown
            options={[
              { label: "Customer", value: "Customer" },
              { label: "Dealer", value: "Dealer" },
            ]}
            value={formData.callBy || ""}
            onChange={(val) => setFormData((prev) => ({ ...prev, callBy: val }))}
            placeholder="Select"
          />

          {errors.callBy && <p className="mt-1 text-sm text-red-600">{errors.callBy}</p>}
        </div>

        {/* Customer Fields */}
        {["title", "firstName", "lastName", "phone", "altPhone"].map((field) => (
          <div key={field} className="flex flex-col">
            <label
              htmlFor={field}
              className="mb-2 pl-2 text-sm font-medium text-gray-800"
            >
              {fieldLabels[field] || field}
            </label>

            {field === "title" ? (
              <CustomDropdown
                options={titleOptions}
                value={formData.title || ""}
                onChange={(val) => setFormData((prev) => ({ ...prev, title: val }))}
                placeholder="Select Title"
              />
            ) : (
              <input
                id={field}
                name={field}
                placeholder={fieldLabels[field] || field}
                type={field === "phone" || field === "altPhone" ? "tel" : "text"}
                value={formData[field] || ""}
                maxLength={field === "phone" || field === "altPhone" ? 10 : 50}
                pattern={
                  field === "phone" || field === "altPhone" ? "\\d{10}" : undefined
                }
                title={
                  field === "phone" || field === "altPhone"
                    ? "Must be exactly 10 digits"
                    : undefined
                }
                onChange={
                  field === "phone" || field === "altPhone"
                    ? handleNumberChange
                    : handleChange
                }
                onPaste={
                  field === "phone" || field === "altPhone"
                    ? (e) => e.preventDefault()
                    : undefined
                }
                className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm transition outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]/30"
              />
            )}

            {errors[field] && (
              <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
