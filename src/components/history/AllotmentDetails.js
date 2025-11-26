// 'use client';

// import SectionHeading from "../common/SectionHeading";
// import ThemedButton from "../common/ThemedButton";
// import { useTheme } from '@/theme/ThemeContext';

// export default function AllotmentDetails({

//   formData,
//   onChange,
//   onApprove,
//   onReject,
// }) {

//   const { colors } = useTheme();

//   return (
//     <div className="p-6 shadow-md border rounded-xl bg-white mb-10">
//   <div className="border rounded-lg overflow-hidden mb-10">
//         <SectionHeading>Previous Appointment Date/Time</SectionHeading>
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="text-left"style={{background:colors.primary,color:colors.textColor}}>
//                 <th className="border px-4 py-2">Ticket No.</th>
//                 <th className="border px-4 py-2">Previous Appointment Date/Time</th>
//                 <th className="border px-4 py-2">Request Re-allot date/time</th>
//                 <th className="border px-4 py-2">ASC reason</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="border px-4 py-2">{formData.tickeT_NO || 'Not Available'}</td>
//                 <td className="border px-4 py-2">{formData.prevAppointment || 'Not Available'}</td>
//                 <td className="border px-4 py-2">{formData.reallotDate || 'Not Available'}</td>
//                 <td className="border px-4 py-2">{formData.ascReason || 'Not Available'}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//       <SectionHeading>📝Allotment Details</SectionHeading>

//       <div className="space-y-8">

//         {/* ✅ Previous Appointment Details */}

//         {/* ASC + Engineer */}
//         <div className="grid grid-cols-3 gap-4">
//           <label className="flex flex-col">
//             <span className="font-semibold">ASC Name:</span>
//             <select
//               className="border p-2 rounded"
//               value={formData.ascName}
//               onChange={(e) => onChange("ascName", e.target.value)}
//             >
//               <option value="">-- Select ASC --</option>
//               {formData.ascName && (
//                 <option value={formData.ascName}>{formData.ascName}</option>
//               )}
//             </select>
//           </label>

//           <label className="flex flex-col">
//             <span className="font-semibold">Engineer Name:</span>
//             <select
//               className="border p-2 rounded"
//               value={formData.engineer}
//               onChange={(e) => onChange("engineer", e.target.value)}
//             >
//               <option value="">-- Select Engineer --</option>
//               {formData.engineer && (
//                 <option value={formData.engineer}>{formData.engineer}</option>
//               )}
//             </select>
//           </label>

//           <label className="flex items-center gap-2 mt-6">
//             <input
//               type="checkbox"
//               checked={formData.reAllot}
//               onChange={(e) => onChange("reAllot", e.target.checked)}
//             />
//             <span className="font-semibold">Re Allot</span>
//           </label>
//         </div>

//         {/* Appointment Date + Time + Promise Date */}
//         <div className="grid grid-cols-3 gap-4">
//           {/* Appointment Date */}
//           <label className="flex flex-col">
//             <span className="font-semibold">Appointment Date:</span>
//             <input
//               type="date"
//               className="border p-2 rounded"
//               value={formData.appointmentDate}
//               onChange={(e) => onChange("appointmentDate", e.target.value)}
//             />
//           </label>

//           {/* Appointment Time */}
//           <div className="grid grid-cols-2 gap-2 h-10 mt-6">
//             <select
//               className="border p-2 rounded"
//               value={formData.appointmentHour}
//               onChange={(e) => onChange("appointmentHour", e.target.value)}
//             >
//               <option value="">--Hour--</option>
//               {[...Array(24).keys()].map((h) => (
//                 <option key={h} value={h}>
//                   {h}
//                 </option>
//               ))}
//             </select>
//             <select
//               className="border p-2 rounded"
//               value={formData.appointmentMinute}
//               onChange={(e) => onChange("appointmentMinute", e.target.value)}
//             >
//               <option value="">--Minute--</option>
//               {[0, 15, 30, 45].map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Promise Date */}
//           <label className="flex flex-col">
//             <span className="font-semibold">Promise Date:</span>
//             <input
//               type="date"
//               className="border p-2 rounded"
//               value={formData.promiseDate}
//               onChange={(e) => onChange("promiseDate", e.target.value)}
//             />
//           </label>
//         </div>

//         {/* ASM & Customer Remark */}
//         <div className="grid grid-cols-3 gap-4">
//           <label className="flex flex-col">
//             <span className="font-semibold">ASM Remark:</span>
//             <textarea
//               className="border p-2 rounded"
//               value={formData.asmRemark}
//               onChange={(e) => onChange("asmRemark", e.target.value)}
//             />
//           </label>

//           <label className="flex flex-col">
//             <span className="font-semibold">Customer Remark (If Any):</span>
//             <textarea
//               className="border p-2 rounded"
//               value={formData.customerRemark}
//               onChange={(e) => onChange("customerRemark", e.target.value)}
//             />
//           </label>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-4 mt-4">
//           <button
//             className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
//             onClick={onReject}
//           >
//             Reject
//           </button>
//           <ThemedButton type="primary" onClick={onApprove}>
//             Approve
//           </ThemedButton>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import SectionHeading from "../common/SectionHeading";
import ThemedButton from "../common/ThemedButton";
import { useTheme } from "@/theme/ThemeContext";
import axiosInstance from "@/api/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AllotmentDetails({
  formData,
  onChange,
  onApprove,
  onReject,
}) {
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
          },
        );

        const resData = res.data;
        setEngineerData(resData.data);
      } catch (err) {
        console.error("Error fetching engineer data:", err);
      }
    }

    fetchEngineerData();
  }, [formData.sf_ID]);

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
              <th className="border px-4 py-2">
                Previous Appointment Date/Time
              </th>
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
                  <option value={data.Eng_ID}>{data.Eng_Name}</option>
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
            />
          </label>

          {/* Appointment Time */}
          <div className="mt-6 grid h-10 grid-cols-2 gap-2">
            <select
              className="rounded border p-2"
              value={formData.appointmentHour}
              onChange={(e) => onChange("appointmentHour", e.target.value)}
            >
              <option value="">--Hour--</option>
              {[...Array(24).keys()].map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <select
              className="rounded border p-2"
              value={formData.appointmentMinute}
              onChange={(e) => onChange("appointmentMinute", e.target.value)}
            >
              <option value="">--Minute--</option>
              {[0, 15, 30, 45].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
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
