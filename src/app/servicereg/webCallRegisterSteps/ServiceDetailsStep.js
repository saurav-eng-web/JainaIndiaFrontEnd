"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";

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
        const res = await axiosInstance.get(
          `CallType/subcategory/${formData.product}`,
        );
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
          `SymptomMaster/byProduct/${formData.productID}`,
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
    const selectedObj = callTypes.find(
      (c) => c.callType_ID.toString() === selectedId,
    );

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
      <h3>Service Details</h3>
      <div className="form-grid">
        <div className="form-group">
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
                callTypeId: val, // numeric ID
                callType: selected?.callType_Name || "", // text for validation + payload
              }));
            }}
            placeholder="Select Call Type"
          />

          {errors.callType && (
            <span className="error-text">{errors.callType}</span>
          )}
        </div>

        {/* ✅ Service Date & Time */}
        <div className="form-group">
          <label htmlFor="serviceDateTime">
            Customer Available Date & Time
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
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
              style={{ flex: 1 }}
            />

            <select
              id="availableTime"
              name="availableTime"
              onChange={handleChange}
              value={formData.availableTime}
              disabled={!selectedDate}
              style={{ flex: 1 }}
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
            <span className="error-text">{errors.availableTime}</span>
          )}
        </div>

        <div className="form-group">
          <CustomDropdown
            label="Fault/VOC"
            options={faults.map((f) => ({
              value: f.syid,
              label: f.symptom,
            }))}
            value={formData.faultVocId || ""}
            onChange={(val) => {
              const selected = faults.find((f) => f.syid === val);
              setFormData((prev) => ({
                ...prev,
                faultVocId: val, // 👈 ID for backend
                faultVoc: selected?.symptom || "", // 👈 text for validation + remarks
              }));
            }}
            placeholder="Select Fault"
          />

          {errors.faultVoc && (
            <span className="error-text">{errors.faultVoc}</span>
          )}
        </div>

        <div className="flex w-full text-sm">
          <div className="mr-6 w-full">
            <p className="pb-2 pl-3">Remarks</p>
            <textarea
              onChange={(e) => hanldeRemarks(e)}
              className=""
              maxLength={150}
              placeholder="Enter remarks"
            />
          </div>
        </div>
        {/* <div className="text-sm">
          <div className="">
            <p className="pl-3 pb-2">Caller Number</p>
            <input
              onChange={(e) => handleCaller(e)}
              placeholder="Caller Number"
            />
          </div>
        </div> */}

        <div className="text-sm">
          <div>
            <p className="pb-2 pl-3">Caller Number</p>
            <input
              type="tel"
              maxLength={10}
              pattern="[0-9]{10}"
              onChange={handleCaller}
              value={formData.callerNumber || ""}
              placeholder="Enter 10-digit mobile number"
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
