"use client";

import { useEffect, useState } from "react";

import SectionHeading from "../common/SectionHeading";
import ThemedButton from "../common/ThemedButton";

import { useTheme } from "@/theme/ThemeContext";
import axiosInstance from "@/api/axiosInstance";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AllotmentDetails({ formData, onChange, onApprove, onReject }) {
  const [engineerData, setEngineerData] = useState([]);
  const { colors } = useTheme();
  // console.log("allotment details formData: ", formData);
  // console.log(`🔴sf id: `, sf_Id);

  useEffect(() => {
    async function fetchEngineerData() {
      try {
        console.log("sf id: ", formData.sf_ID);
        const res = await axiosInstance.post(
          `Engineer/Manage`,
          {
            Action: "SELECT_ACTIVE_BY_SFID",
            Eng_SFID: formData.sf_ID || 0,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const resData = res.data;
        setEngineerData(resData.data);
      } catch (err) {
        console.error("Error fetching engineer data:", err);
      }
    }

    fetchEngineerData();
  }, [formData.sf_ID]);

  function isToday(dateStr) {
    const today = new Date();
    const d = new Date(dateStr);

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }

  function getAllowedHours(selectedDate) {
    const start = 9;
    const end = 20;

    if (!selectedDate) return [];

    if (!isToday(selectedDate)) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    // If today → enforce +1 hour rule
    const now = new Date();
    const nextAllowedHour = now.getHours() + 1;

    const finalStart = Math.max(start, nextAllowedHour);

    if (finalStart > end) return []; // No valid hours left today

    return Array.from({ length: end - finalStart + 1 }, (_, i) => finalStart + i);
  }

  function getNearestValidMinute(minute) {
    const slots = [0, 15, 30, 45];
    for (const m of slots) {
      if (m >= minute) return m;
    }
    return null; // no valid minute in this hour
  }

  function getAllowedMinutes(selectedDate, selectedHour) {
    const slots = [0, 15, 30, 45];

    if (!selectedDate || selectedHour === "") return slots;

    if (!isToday(selectedDate)) return slots;

    const now = new Date();
    const nextHour = now.getHours() + 1;

    if (selectedHour > nextHour) {
      return slots; // full range allowed
    }

    if (selectedHour == nextHour) {
      const nearest = getNearestValidMinute(now.getMinutes());
      if (nearest === null) return []; // no valid minute this hour
      return slots.filter((m) => m >= nearest);
    }

    return []; // anything earlier than required hour
  }

  return (
    <div className="mb-10 rounded-xl border bg-white p-6 shadow-md">
      <div className="mb-10 overflow-hidden rounded-lg border">
        <SectionHeading>Previous Appointment Date/Time</SectionHeading>
        <table className="w-full border-collapse">
          <thead>
            <tr
              className="text-left"
              style={{ background: colors.primary, color: colors.textColor }}
            >
              <th className="border px-4 py-2">Ticket No.</th>
              <th className="border px-4 py-2">Previous Appointment Date/Time</th>
              <th className="border px-4 py-2">Request Re-allot date/time</th>
              <th className="border px-4 py-2">ASC reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">
                {formData.tickeT_NO || "Not Available"}
              </td>
              <td className="border px-4 py-2">
                {formData.prevAppointment || "Not Available"}
              </td>
              <td className="border px-4 py-2">
                {formData.reallotDate || "Not Available"}
              </td>
              <td className="border px-4 py-2">
                {formData.ascReason || "Not Available"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeading>📝Allotment Details</SectionHeading>

      <div className="space-y-8">
        {/* ✅ Previous Appointment Details */}

        {/* ASC + Engineer */}
        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col">
            <span className="font-semibold">ASC Name:</span>
            <select
              className="rounded border p-2"
              value={formData.ascName}
              onChange={(e) => onChange("ascName", e.target.value)}
            >
              <option value="">-- Select ASC --</option>
              {formData.ascName && (
                <option value={formData.ascName}>{formData.ascName}</option>
              )}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="font-semibold">Engineer Name:</span>
            <select
              className="rounded border p-2"
              value={formData.Eng_ID}
              onChange={(e) => onChange("eng_ID", e.target.value)}
            >
              <option value="">-- Select Engineer --</option>
              {engineerData &&
                engineerData.map((data) => (
                  <option key={data.Eng_ID} value={data.Eng_ID}>
                    {data.Eng_Name}
                  </option>
                ))}
            </select>
          </label>

          <label className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.reAllot}
              onChange={(e) => onChange("reAllot", e.target.checked)}
            />
            <span className="font-semibold">Re Allot</span>
          </label>
        </div>

        {/* Appointment Date + Time + Promise Date */}
        <div className="grid grid-cols-3 gap-4">
          {/* Appointment Date */}
          <label className="flex flex-col">
            <span className="font-semibold">Appointment Date:</span>
            <input
              type="date"
              className="rounded border p-2"
              value={formData.appointmentDate}
              onChange={(e) => onChange("appointmentDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              max={new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split("T")[0]}
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="font-semibold">Hour:</span>
              <select
                className="h-11 rounded border p-2"
                value={formData.appointmentHour}
                onChange={(e) => onChange("appointmentHour", e.target.value)}
              >
                <option value="">--Hour--</option>
                {getAllowedHours(formData.appointmentDate).map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col">
              <span className="font-semibold">Minute:</span>
              <select
                className="h-11 rounded border p-2"
                value={formData.appointmentMinute}
                onChange={(e) => onChange("appointmentMinute", e.target.value)}
              >
                <option value="">--Minute--</option>
                {getAllowedMinutes(
                  formData.appointmentDate,
                  formData.appointmentHour
                ).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Promise Date */}
          <label className="flex flex-col">
            <span className="font-semibold">Promise Date:</span>
            <input
              type="date"
              className="rounded border p-2"
              value={formData.promiseDate}
              onChange={(e) => onChange("promiseDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              max={new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split("T")[0]}
            />
          </label>
        </div>

        {/* ASM & Customer Remark */}
        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col">
            <span className="font-semibold">ASM Remark:</span>
            <textarea
              className="rounded border p-2"
              value={formData.asmRemark}
              onChange={(e) => onChange("asmRemark", e.target.value)}
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold">Customer Remark (If Any):</span>
            <textarea
              className="rounded border p-2"
              value={formData.customerRemark}
              onChange={(e) => onChange("customerRemark", e.target.value)}
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-4">
          <button
            className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
            onClick={onReject}
          >
            Reject
          </button>
          <ThemedButton type="primary" onClick={onApprove}>
            Approve
          </ThemedButton>
        </div>
      </div>
    </div>
  );
}
