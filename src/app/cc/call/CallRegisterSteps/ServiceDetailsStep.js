"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";

import CustomDropdown from "@/components/common/Dropdown";
import axiosInstance from "@/api/axiosInstance";

export default function ServiceDetailsStep({
  formData,
  handleChange,
  errors,
  setFormData,
}) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [callTypes, setCallTypes] = useState([]);
  const [faults, setFaults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCallTypes = async () => {
      try {
        if (!formData.product) {
          setCallTypes([]);
          return;
        }
        const res = await axiosInstance.get(`CallType/subcategory/${formData.product}`);
        if (Array.isArray(res.data)) {
          setCallTypes(res.data);
        }
      } catch (err) {
        console.error("Error fetching call types:", err);
        setCallTypes([]);
      }
    };

    fetchCallTypes();
  }, [formData.product]);

  // ✅ Fetch Faults (Symptoms) based on productID
  useEffect(() => {
    const fetchFaults = async () => {
      try {
        if (!formData.productID) {
          setFaults([]);
          return;
        }
        const res = await axiosInstance.get(
          `SymptomMaster/byProduct/${formData.productID}`
        );
        if (Array.isArray(res.data)) {
          setFaults(res.data);
        }
      } catch (err) {
        console.error("Error fetching faults:", err);
      }
    };

    fetchFaults();
  }, [formData.productID]);

  // ✅ Generate filtered time slots based on selected date
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    const slots = Array.from({ length: 10 }, (_, i) => {
      const hour = 10 + i;
      const start = `${hour.toString().padStart(2, "0")}:00`;
      const end = `${(hour + 1).toString().padStart(2, "0")}:00`;
      return { hour, label: `${start} - ${end}` };
    });

    const filteredSlots =
      selectedDate === now.toISOString().split("T")[0]
        ? slots.filter((slot) => slot.hour > currentHour)
        : slots;

    setTimeSlots(filteredSlots);
  }, [selectedDate]);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 3);

  const formatDate = (date) => date.toISOString().split("T")[0];

  // ✅ Handle call type change (store ID + Name in formData)
  const handleCallTypeChange = (e) => {
    const selectedId = e.target.value;
    const selectedObj = callTypes.find((c) => c.callType_ID.toString() === selectedId);

    setFormData((prev) => ({
      ...prev,
      callTypeId: selectedId,
      callType: selectedObj?.callType_Name || "",
    }));
  };

  // ✅ Handle fault (symptom) change (store syid + symptom)
  const handleFaultChange = (e) => {
    const selectedId = e.target.value;
    const selectedObj = faults.find((f) => f.syid.toString() === selectedId);

    setFormData((prev) => ({
      ...prev,
      faultVocId: selectedId,
      faultVoc: selectedObj?.symptom || "",
    }));
  };

  function hanldeRemarks(e) {
    setFormData((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  }

  function handleCaller(e) {
    const value = e.target.value;

    // Allow only digits
    if (!/^\d*$/.test(value)) {
      setError("Only numbers allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      callerNumber: value,
    }));

    // Validate 10 digits
    if (value.length > 0 && value.length !== 10) {
      setError("Mobile number must be 10 digits");
    } else {
      setError("");
    }
  }

  return (
    <>
      <h3 className="mb-5 text-lg font-semibold text-gray-800">Service Details</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Call Type */}
        <div className="flex flex-col">
          <CustomDropdown
            label="Call Type"
            options={callTypes.map((type) => ({
              value: type.callType_ID,
              label: type.callType_Name,
            }))}
            value={formData.callTypeId || ""}
            onChange={(val) => {
              const selected = callTypes.find((t) => t.callType_ID === val);
              setFormData((prev) => ({
                ...prev,
                callTypeId: val,
                callType: selected?.callType_Name || "",
              }));
            }}
            placeholder="Select Call Type"
          />

          {errors.callType && (
            <span className="mt-1 text-sm text-red-600">{errors.callType}</span>
          )}
        </div>

        {/* Service Date & Time */}
        <div className="flex flex-col">
          <label
            htmlFor="serviceDate"
            className="mb-2 pl-2 text-sm font-medium text-gray-800"
          >
            Customer Available Date & Time
          </label>

          <div className="flex gap-2">
            <input
              type="date"
              id="serviceDate"
              name="serviceDate"
              min={formatDate(today)}
              max={formatDate(maxDate)}
              value={formData.serviceDate || ""}
              onChange={(e) => {
                handleChange(e);
                setSelectedDate(e.target.value);
              }}
              className="w-full flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm transition outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]/30"
            />

            <select
              id="availableTime"
              name="availableTime"
              onChange={handleChange}
              value={formData.availableTime}
              disabled={!selectedDate}
              className={`w-full flex-1 rounded-md border px-3 py-2 text-sm transition outline-none ${
                selectedDate
                  ? "border-gray-300 focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]/30"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <option value="">Select Time</option>

              {timeSlots.length > 0 ? (
                timeSlots.map((slot, index) => (
                  <option key={index} value={slot.label}>
                    {slot.label}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No slots available
                </option>
              )}
            </select>
          </div>

          {errors.availableTime && (
            <span className="mt-1 text-sm text-red-600">{errors.availableTime}</span>
          )}
        </div>

        {/* Fault / VOC */}
        <div className="flex flex-col">
          <CustomDropdown
            label="Fault / VOC"
            options={faults.map((f) => ({
              value: f.syid,
              label: f.symptom,
            }))}
            value={formData.faultVocId || ""}
            onChange={(val) => {
              const selected = faults.find((f) => f.syid === val);
              setFormData((prev) => ({
                ...prev,
                faultVocId: val,
                faultVoc: selected?.symptom || "",
              }));
            }}
            placeholder="Select Fault"
          />

          {errors.faultVoc && (
            <span className="mt-1 text-sm text-red-600">{errors.faultVoc}</span>
          )}
        </div>

        {/* Remarks */}
        <div className="flex w-full flex-col text-sm lg:col-span-2">
          <p className="pb-2 pl-2 font-medium text-gray-800">Remarks</p>
          <textarea
            onChange={(e) => hanldeRemarks(e)}
            maxLength={150}
            placeholder="Enter remarks"
            className="w-full resize-y rounded-md border border-gray-300 px-3 py-3 text-sm transition outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]/30"
          />
        </div>

        {/* Caller Number */}
        <div className="flex flex-col text-sm">
          <p className="pb-2 pl-2 font-medium text-gray-800">Caller Number</p>
          <input
            type="tel"
            maxLength={10}
            pattern="[0-9]{10}"
            onChange={handleCaller}
            value={formData.callerNumber || ""}
            placeholder="Enter 10-digit mobile number"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition outline-none focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67]/30"
          />

          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </>
  );
}
