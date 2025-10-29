"use client";
export const dynamic = "force-dynamic";
import CustomDropdown from "@/components/common/Dropdown";
import { useState } from "react";

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
      <h3>Customer Details</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="callBy">Select</label>
          <CustomDropdown
            // label="Select"
            options={[
              { label: "Customer", value: "Customer" },
              { label: "Dealer", value: "Dealer" },
            ]}
            value={formData.callBy || ""}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, callBy: val }))
            }
            placeholder="Select"
          />
          {errors.callBy && <p className="error-text">{errors.callBy}</p>}
        </div>

        {["title", "firstName", "lastName", "phone", "altPhone"].map(
          (field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{fieldLabels[field] || field}</label>
              {field === "title" ? (
                <CustomDropdown
                  // label="Title"
                  options={titleOptions}
                  value={formData.title || ""}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, title: val }))
                  }
                  placeholder="Select Title"
                />
              ) : (
                <input
                  id={field}
                  name={field}
                  placeholder={fieldLabels[field] || field}
                  type={
                    field === "phone" || field === "altPhone" ? "tel" : "text"
                  }
                  value={formData[field] || ""}
                  maxLength={
                    field === "phone" || field === "altPhone" ? 10 : 50
                  }
                  pattern={
                    field === "phone" || field === "altPhone"
                      ? "\\d{10}"
                      : undefined
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
                />
              )}
              {errors[field] && <p className="error-text">{errors[field]}</p>}
            </div>
          ),
        )}
      </div>
    </>
  );
}
