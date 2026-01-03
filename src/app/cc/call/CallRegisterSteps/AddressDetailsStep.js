"use client";
export const dynamic = "force-dynamic";
import { useState, useRef } from "react";

import axiosInstance from "@/api/axiosInstance";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AddressDetailsStep({
  formData,
  handleChange,
  setFormData,
  errors,
  // NEW: lifted to parent so stepper can block Next
  pincodeStatus,
  setPincodeStatus,
}) {
  const [localities, setLocalities] = useState([]);
  const debounceTimer = useRef(null);

  const handlePincodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // digits only
    if (value.length > 6) value = value.slice(0, 6);

    setFormData((prev) => ({ ...prev, pincode: value }));

    clearTimeout(debounceTimer.current);

    if (value.length === 6) {
      // mark as checking to block Next during debounce/API
      setPincodeStatus("checking");
      debounceTimer.current = setTimeout(() => fetchPincodeDetails(value), 400);
    } else {
      resetAddressFields("");
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/LocalityMaster/by-pincode/${pincode}`
      );
      const data = res.data;

      if (Array.isArray(data) && data.length > 0) {
        setLocalities(data);
        // default select first locality
        const first = data[0];
        setFormData((prev) => ({
          ...prev,
          state: first.state_Name || "",
          city: first.city_Name || "",
          locality: first.locality_Name || "",
          localityId: first.locality_Id || "",
          cityId: first.locality_City || "",
        }));
        setPincodeStatus("valid");
      } else {
        resetAddressFields("invalid");
      }
    } catch (err) {
      console.error("API error:", err);
      resetAddressFields("invalid");
    }
  };

  const resetAddressFields = (status = "") => {
    setLocalities([]);
    setPincodeStatus(status);
    setFormData((prev) => ({
      ...prev,
      state: "",
      city: "",
      locality: "",
      localityId: "",
      cityId: "",
    }));
  };

  const handleLocalityChange = (e) => {
    const selected = localities.find((loc) => loc.locality_Name === e.target.value);
    setFormData((prev) => ({
      ...prev,
      locality: selected?.locality_Name || "",
      localityId: selected?.locality_Id || "",
      cityId: selected?.locality_City || "",
    }));
  };

  const fields = ["customerAddress", "landmark", "pincode", "state", "city"];

  const formatLabel = (field) =>
    field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

  return (
    <>
      <h3 className="mb-5 text-lg font-semibold text-gray-800">Address Details</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field} className="flex flex-col">
            <label
              htmlFor={field}
              className="mb-2 pl-2 text-sm font-medium text-gray-800"
            >
              {formatLabel(field)}
            </label>

            <input
              id={field}
              name={field}
              placeholder={formatLabel(field)}
              value={formData[field] || ""}
              onChange={field === "pincode" ? handlePincodeChange : handleChange}
              readOnly={["state", "city"].includes(field)}
              maxLength={field === "pincode" ? 6 : undefined}
              className={`w-full rounded-md border px-3 py-3 text-sm transition outline-none ${
                ["state", "city"].includes(field)
                  ? "bg-gray-100 text-gray-600"
                  : "border-gray-300 focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]/30"
              }`}
            />

            {errors?.[field] && (
              <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
            )}

            {field === "pincode" && pincodeStatus === "valid" && (
              <span className="mt-1 text-sm text-green-600">Valid Pincode</span>
            )}

            {field === "pincode" && pincodeStatus === "invalid" && (
              <span className="mt-1 text-sm text-red-600">Invalid Pincode</span>
            )}
          </div>
        ))}

        {/* Locality */}
        <div className="flex flex-col">
          <label
            htmlFor="locality"
            className="mb-2 pl-2 text-sm font-medium text-gray-800"
          >
            Locality
          </label>

          {localities.length > 0 ? (
            <select
              id="locality"
              name="locality"
              value={formData.locality || ""}
              onChange={handleLocalityChange}
              className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm transition outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]/30"
            >
              {localities.map((loc, idx) => (
                <option key={idx} value={loc.locality_Name}>
                  {loc.locality_Name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="locality"
              name="locality"
              placeholder="Locality"
              value={formData.locality || ""}
              readOnly
              className="w-full rounded-md border bg-gray-100 px-3 py-3 text-sm text-gray-600"
            />
          )}

          {errors?.locality && (
            <p className="mt-1 text-sm text-red-600">{errors.locality}</p>
          )}
        </div>
      </div>
    </>
  );
}
