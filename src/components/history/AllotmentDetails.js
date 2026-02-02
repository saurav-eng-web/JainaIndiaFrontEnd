"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import SectionHeading from "../common/SectionHeading";
import Table from "../common/Table";
import { Button } from "../ui/button";

import axiosInstance from "@/api/axiosInstance";
import { useTheme } from "@/theme/ThemeContext";
import { formatIndianDate } from "@/utils/formatDate";

export default function AllotmentDetails({ formData, onChange, onApprove, onReject }) {
  const [engineerData, setEngineerData] = useState([]);
  const [callScheduleData, setCallScheduleData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingFalse = () => setIsSubmitting(false);
  const { colors } = useTheme();

  useEffect(() => {
    if (!formData?.tickeT_NO) return;

    async function fetchCallSchedule() {
      try {
        const res = await axiosInstance.get(
          `CallSchedule/ticketno/${formData.tickeT_NO}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const resData = res.data;
        onChange("contactPerson", resData?.talkToWhomeAllot);
        setCallScheduleData(resData);
      } catch (err) {
        console.error("Error fetching call schedule:", err);
      }
    }

    fetchCallSchedule();
  }, [formData?.tickeT_NO]);

  useEffect(() => {
    if (!formData?.sf_ID) return;

    async function fetchEngineerData() {
      try {
        const res = await axiosInstance.post(
          `Engineer/Manage`,
          {
            Action: "SELECT_ACTIVE_BY_SFID",
            Eng_SFID: formData.sf_ID,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setEngineerData(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching engineer data:", err);
      }
    }

    fetchEngineerData();
  }, [formData?.sf_ID]);

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

  function handleSubmit(type) {
    const engId = formData?.eng_ID;
    if (type === "approve") {
      if (formData.eng_ID === "-" || formData.eng_ID === "" || !engId) {
        toast.error("Please select engineer");
        return;
      }

      if (!formData.appointmentDate) {
        toast.error("Please select appointment date");
        return;
      }

      if (!formData.appointmentHour) {
        toast.error("Please select appointment hour");
        return;
      }

      if (!formData.appointmentMinute) {
        toast.error("Please select appointment minute");
        return;
      }
    }

    if (!formData.asmRemark) {
      toast.error("Please enter ASM remark!");
      return;
    }
    setIsSubmitting(true);
    if (type === "approve") {
      onApprove(submittingFalse);
    } else {
      onReject(submittingFalse);
    }
  }

  const columns = [
    {
      label: "Ticket No.",
      key: "ticketNo",
      size: "lg",
    },
    {
      label: "Talked To",
      key: "talkedTo",
      size: "md",
    },
    {
      label: "Request Re-allot date/time",
      key: "requestTime",
      size: "lg",
      render: (val) => val || "Not Available",
    },
  ];
  const rows = [
    {
      ticketNo: formData.tickeT_NO || "Not Available",
      talkedTo: callScheduleData?.talkToWhomeAllot || "Not Available",
      requestTime: callScheduleData?.apptDateandTime
        ? new Date(callScheduleData.apptDateandTime).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "Not Available",
    },
  ];

  return (
    <div className="mb-10 rounded-xl bg-white p-6 shadow-md">
      <div className="mb-10 overflow-hidden">
        <SectionHeading>Previous Appointment Date/Time</SectionHeading>
        <Table columns={columns} rows={rows} />
      </div>

      <SectionHeading>📝Allotment Details</SectionHeading>

      <div className="space-y-8">
        {/* ✅ Previous Appointment Details */}

        {/* ASC + Engineer */}
        <div className="grid grid-cols-3 gap-4">
          <FormSelect
            label="ASC Name"
            value={formData.ascName}
            onChange={(e) => onChange("ascName", e.target.value)}
            options={
              formData.ascName
                ? [{ label: formData.ascName, value: formData.ascName }]
                : []
            }
            placeholder="-- Select ASC --"
          />

          <FormSelect
            label="Engineer Name"
            value={formData.Eng_ID}
            onChange={(e) => onChange("eng_ID", e.target.value)}
            options={
              engineerData
                ? engineerData.map((data) => ({
                    label: data.Eng_Name,
                    value: data.Eng_ID,
                  }))
                : []
            }
            placeholder="-- Select Engineer --"
          />

          <FormTextarea
            label="ASM Remark"
            value={formData.asmRemark}
            onChange={(e) => onChange("asmRemark", e.target.value)}
          />

          {/*-------------------------------Re allot checkbox Date NO NOT REMOVE------------------------------ */}
          {/* <label className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.reAllot}
              onChange={(e) => onChange("reAllot", e.target.checked)}
            />
            <span className="font-semibold">Re Allot</span>
          </label> */}
        </div>

        {/* Appointment Date + Time + Promise Date */}
        <div className="grid grid-cols-3 gap-4">
          {/* Appointment Date */}
          <FormInput
            label="Appointment Date"
            type="date"
            value={formData.appointmentDate}
            onChange={(e) => onChange("appointmentDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            max={new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split("T")[0]}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Hour"
              value={formData.appointmentHour}
              onChange={(e) => onChange("appointmentHour", e.target.value)}
              options={getAllowedHours(formData.appointmentDate).map((h) => ({
                label: h,
                value: h,
              }))}
              placeholder="--Hour--"
            />

            <FormSelect
              label="Minute"
              value={formData.appointmentMinute}
              onChange={(e) => onChange("appointmentMinute", e.target.value)}
              options={getAllowedMinutes(
                formData.appointmentDate,
                formData.appointmentHour
              ).map((m) => ({
                label: m,
                value: m,
              }))}
              placeholder="--Minute--"
            />
          </div>

          <FormTextarea
            label="Customer Remark (If Any)"
            value={formData.customerRemark}
            onChange={(e) => onChange("customerRemark", e.target.value)}
          />

          {/*-------------------------------Promise Date NO NOT REMOVE------------------------------ */}
          {/* <label className="flex flex-col">
            <span className="font-semibold">Promise Date:</span>
            <input
              type="date"
              className="rounded border p-2"
              value={formData.promiseDate}
              onChange={(e) => onChange("promiseDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              max={new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split("T")[0]}
            />
          </label> */}
        </div>

        {/* ASM & Customer Remark */}
        {/* <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="font-semibold">ASM Remark:</span>
            <textarea
              className="rounded border p-2"
              value={formData.asmRemark}
              onChange={(e) => onChange("asmRemark", e.target.value)}
            />
          </label>
        </div> */}

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-4">
          <button
            disabled={isSubmitting}
            className="cursor-pointer rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
            onClick={() => handleSubmit("reject")}
          >
            Reject
          </button>
          <Button
            disabled={isSubmitting}
            type="primary"
            onClick={() => handleSubmit("approve")}
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Local Styled Components ---

function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
  disabled,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 transition-all outline-none focus:border-purple-500 focus:ring-purple-500"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  disabled,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 transition-all outline-none focus:border-purple-500 focus:ring-purple-500"
      >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormTextarea({ label, value, onChange, placeholder, rows = 3, disabled }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="block h-10 w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 transition-all outline-none focus:border-purple-500 focus:ring-purple-500"
      />
    </div>
  );
}
