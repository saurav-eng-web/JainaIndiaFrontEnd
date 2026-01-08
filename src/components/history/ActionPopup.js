import React, { useState } from "react";
import CustomDropdown from "@/components/common/Dropdown";
import { getAllowedHours, getAllowedMinutes } from "@/utils/historyUtils";

export default function ActionPopup({
  isOpen,
  onClose,
  selectedAction,
  detail = {},
  // Cancellation props
  cancelReasons = [],
  selectedReason,
  setSelectedReason,
  remark,
  setRemark,
  confirmCancel,
  setConfirmCancel,
  handleSubmitCancellation,
  // WIP props
  serialNumber,
  setSerialNumber,
  handleSerialCheck,
  // Assignment/Generic props
  formData,
  handleChange, // function to update formData
  engineerData = [],
  handleAssigned,
}) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* ========================= */}
      {/* SMALL POPUP: Request For Cancellation */}
      {/* ========================= */}
      {selectedAction === "Request for cancellation" ? (
        <div className="animate-fadeIn w-[450px] rounded-xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Request For Cancellation
            </h2>
            <button
              onClick={onClose}
              className="text-xl text-gray-600 transition hover:text-red-600"
            >
              ✕
            </button>
          </div>

          {/* Cancel Reason */}
          <div className="mb-5 flex flex-col">
            <label className="font-medium text-gray-700">Cancel Reason:</label>
            <div style={{ width: "100%" }}>
              <CustomDropdown
                options={cancelReasons.map((item) => ({
                  label: item.value,
                  value: item.value,
                }))}
                value={selectedReason}
                onChange={(val) => setSelectedReason(val)}
                placeholder="----Select----"
              />
            </div>
          </div>

          {/* Remark */}
          <div className="mb-5 flex flex-col">
            <label className="font-medium text-gray-700">Remark:</label>
            <textarea
              className="h-20 rounded-md border px-3 py-2"
              placeholder="Enter remark here..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          {/* CONFIRMATION BOX */}
          {confirmCancel && (
            <div className="animate-fadeIn mb-5 rounded-md border border-yellow-300 bg-yellow-100 p-3 text-yellow-800">
              <p className="font-medium">
                Are you sure you want to submit this cancellation?
              </p>
              <div className="mt-3 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="rounded-md bg-gray-300 px-4 py-1 text-gray-800 hover:bg-gray-400"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    setConfirmCancel(false);
                    handleSubmitCancellation();
                  }}
                  className="rounded-md bg-red-600 px-4 py-1 text-white hover:bg-red-700"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setConfirmCancel(true)}
              className="rounded-md bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
            >
              Submit Cancellation
            </button>
          </div>
        </div>
      ) : selectedAction === "WIP" ? (
        /* ========================= */
        /* SPECIAL POPUP FOR WIP ONLY */
        /* ========================= */
        <div className="animate-fadeIn w-[450px] rounded-xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800">WIP</h2>
            <button
              onClick={onClose}
              className="text-xl text-gray-600 transition hover:text-red-600"
            >
              ✕
            </button>
          </div>

          {/* Ticket Number */}
          <div className="mb-10 flex flex-col">
            <label className="font-medium text-gray-700">Ticket Number:</label>
            <div className="rounded-md border bg-gray-100 px-3 py-2">
              {detail.tickeT_NO || "-"}
            </div>
          </div>
          <div className="mb-6 flex flex-col">
            <label className="font-medium text-gray-700">
              Validate Serial Number:
            </label>
            <input
              type="text"
              placeholder="Enter Serial Number"
              className="rounded-md border px-3 py-2"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleSerialCheck}
              className="rounded-md bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
            >
              Check Serial Number
            </button>
          </div>
        </div>
      ) : (
        /* ========================= */
        /* GENERIC / ASSIGNED POPUP */
        /* ========================= */
        <div className="animate-fadeIn w-[85%] max-w-5xl rounded-xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between border-b pb-3">
            <h2 className="text-2xl font-semibold tracking-wide text-gray-800">
              {selectedAction}
            </h2>
            <button
              onClick={onClose}
              className="text-xl text-gray-600 transition hover:text-red-600"
            >
              ✕
            </button>
          </div>

          {/* FORM GRID */}
          <div className="grid grid-cols-3 gap-6">
            {/* Ticket Number */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Ticket Number:</label>
              <div className="rounded-md border bg-gray-100 px-3 py-2">
                {detail.tickeT_NO || "-"}
              </div>
            </div>

            {/* ASC Name */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">ASC Name:</label>
              <div className="rounded-md border bg-gray-100 px-3 py-2">
                {detail.asC_NAME || "-"}
              </div>
            </div>

            {/* Engineer Name */}
            <div className="flex flex-col">
              <label className="flex flex-col">
                <span className="font-semibold">Engineer Name:</span>
                <select
                  className="rounded border p-2"
                  value={formData.eng_ID} // Note: check case sensitive in parent
                  onChange={(e) => handleChange("eng_ID", e.target.value)}
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
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Address:</label>
              <textarea
                className="h-20 rounded-md border bg-gray-100 px-3 py-2"
                readOnly
                value={[detail?.addresS1, detail?.addresS2, detail?.addresS3]
                  .filter(Boolean)
                  .join(", ")}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Promise Date:</label>
              <div className="rounded-md border bg-gray-100 px-3 py-2">
                {detail?.promisE_DATE?.split("T")[0] || "-"}
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-6">
              {/* Appointment Date */}
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Appointment Date:</label>
                <input
                  type="date"
                  className="rounded-md border px-3 py-2"
                  min={todayStr}
                  value={formData.appointmentDate}
                  onChange={(e) => {
                    handleChange("appointmentDate", e.target.value);
                    // Reset time when date changes (handled by parent logic usually, but here just updating state)
                    handleChange("appointmentHour", "");
                    handleChange("appointmentMinute", "");
                  }}
                  max={
                    new Date(Date.now() + 72 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                />
              </div>

              {/* Hour */}
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Hour:</label>
                <select
                  className="rounded-md border px-3 py-2"
                  value={formData.appointmentHour}
                  onChange={(e) => handleChange("appointmentHour", e.target.value)}
                >
                  <option value="">--Hour--</option>
                  {getAllowedHours(formData.appointmentDate).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minute */}
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Minute:</label>
                <select
                  className="rounded-md border px-3 py-2"
                  value={formData.appointmentMinute}
                  onChange={(e) => handleChange("appointmentMinute", e.target.value)}
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
              </div>
            </div>

            {/* Address + Remark */}
            <div className="col-span-3 grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Contact Person:</label>
                <input
                  className="rounded-md border px-3 py-2"
                  defaultValue="" // TODO: bind?
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                />
              </div>

              {/* Customer Remark */}
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Customer Remark:</label>
                <textarea
                  value={formData.customerRemark}
                  onChange={(e) => handleChange("customerRemark", e.target.value)}
                  className="h-20 rounded-md border px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleAssigned}
              className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
