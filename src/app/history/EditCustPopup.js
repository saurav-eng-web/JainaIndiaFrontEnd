"use client";

import { useCallback, useEffect, useState } from "react";

import axiosInstance from "@/api/axiosInstance";
import { useTheme } from "@/theme/ThemeContext";

export default function EditCustPopup({ isOpen, onClose, details, onUpdated }) {
  const { colors } = useTheme();
  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState(false);

  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
    address: "",
    landmark: "",
  });

  useEffect(() => {
    if (details) {
      setFormDetails({
        firstName: details.firstName || "",
        lastName: details.lastName || "",
        address: details.address || "",
        landmark: details.landmark || "",
      });
    }
  }, [details]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formDetails.firstName.trim() ||
      !formDetails.lastName.trim() ||
      !formDetails.address.trim()
    ) {
      setWarning("All fields except landmark are required.");
      return;
    }

    setWarning("");

    const payload = {
      Cust_ID: details.custintcode,
      FIRSTNAME: formDetails.firstName,
      LASTNAME: formDetails.lastName,
      ADDRESS1: formDetails.address,
      landmark: formDetails.landmark,
    };

    try {
      await axiosInstance.put(`/Customer/update`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(true);
      if (onUpdated) onUpdated();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Update Failed:", error);
      setWarning("Failed to update. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20">
      <div className="w-full max-w-md rounded-2xl bg-[#f5f7fa] p-6 shadow-lg transition-all duration-300">
        {/* Title */}
        <h2 className="mb-5 border-b border-[#714b67] pb-2 text-lg font-bold text-[#714b67]">
          Edit Customer
        </h2>

        {/* Success View */}
        {success ? (
          <div className="flex h-48 flex-col items-center justify-center transition-all duration-500">
            <div className="flex items-center justify-center rounded-full bg-green-100 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-3 text-lg font-semibold text-green-600">
              Customer details updated successfully
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#714b67]">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formDetails.firstName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#714b67]">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formDetails.lastName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#714b67]">
                Address
              </label>
              <textarea
                name="address"
                value={formDetails.address}
                onChange={handleChange}
                rows={3}
                className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#714b67]">
                Landmark
              </label>
              <textarea
                name="landmark"
                value={formDetails.landmark}
                onChange={handleChange}
                rows={2}
                className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]"
              />
            </div>

            {warning && <p className="text-sm font-medium text-red-600">{warning}</p>}

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
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
