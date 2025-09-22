// // components/history/AllotmentDetails.jsx
// 'use client';

// export default function AllotmentDetails({
//   ascName,
//   engineer,
//   reAllot,
//   appointmentDate,
//   appointmentHour,
//   appointmentMinute,
//   promiseDate,
//   asmRemark,
//   customerRemark,
//   onChange,
//   onApprove,
//   onReject,
// }) {
//   return (
//     <div className="p-6 shadow-md border rounded-xl bg-white">
//       <h3 className="font-bold text-lg mb-4">Allotment Details</h3>
//       <div className="space-y-4">

//         {/* ASC + Engineer */}
//         <div className="grid grid-cols-3 gap-4">
//           <label className="flex flex-col">
//             <span className="font-semibold">ASC Name:</span>
//             <select
//               className="border p-2 rounded"
//               value={ascName}
//               onChange={(e) => onChange("ascName", e.target.value)} 
//             >
//               <option>Mithila Enterprises</option>
//               <option>Another ASC</option>
//             </select>
//           </label>

//           <label className="flex flex-col">
//             <span className="font-semibold">Engineer Name:</span>
//             <select
//               className="border p-2 rounded"
//               value={engineer}
//               onChange={(e) => onChange("engineer", e.target.value)}
//             >
//               <option>MHS3ASC-170_Eng</option>
//               <option>ENG-101</option>
//             </select>
//           </label>

//           <label className="flex items-center gap-2 mt-6">
//             <input
//               type="checkbox"
//               checked={reAllot}
//               onChange={(e) => onChange("reAllot", e.target.checked)}
//             />
//             <span className="font-semibold">Re Allot</span>
//           </label>
//         </div>

//         {/* Appointment Date */}
//         <div className="grid grid-cols-2 gap-4">
//           <label className="flex flex-col">
//             <span className="font-semibold">Appointment Date:</span>
//             <input
//               type="date"
//               className="border p-2 rounded"
//               value={appointmentDate}
//               onChange={(e) => onChange("appointmentDate", e.target.value)}
//             />
//           </label>

//           <div className="grid grid-cols-2 gap-2">
//             <select
//               className="border p-2 rounded"
//               value={appointmentHour}
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
//               value={appointmentMinute}
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
//         </div>

//         {/* Promise Date */}
//         <label className="flex flex-col">
//           <span className="font-semibold">Promise Date:</span>
//           <input
//             type="date"
//             className="border p-2 rounded"
//             value={promiseDate}
//             onChange={(e) => onChange("promiseDate", e.target.value)}
//           />
//         </label>

//         {/* ASM & Customer Remark */}
//         <div className="grid grid-cols-2 gap-4">
//           <label className="flex flex-col">
//             <span className="font-semibold">ASM Remark:</span>
//             <textarea
//               className="border p-2 rounded"
//               value={asmRemark}
//               onChange={(e) => onChange("asmRemark", e.target.value)}
//             />
//           </label>

//           <label className="flex flex-col">
//             <span className="font-semibold">Customer Remark (If Any):</span>
//             <textarea
//               className="border p-2 rounded"
//               value={customerRemark}
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
//           <button
//             className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//             onClick={onApprove}
//           >
//             Approve
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// components/history/AllotmentDetails.jsx




// 'use client';

// import SectionHeading from "../common/SectionHeading";
// import ThemedButton from "../common/ThemedButton";

// export default function AllotmentDetails({
//   formData,
//   onChange,
//   onApprove,
//   onReject,
// }) {
//   return (
//     <div className="p-6 shadow-md border rounded-xl bg-white mb-10">
//       <SectionHeading>📝Allotment Details</SectionHeading>


//       <div className="space-y-8">

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

//         {/* Appointment Date + Time */}
// {/* Appointment Date + Time + Promise Date */}
// <div className="grid grid-cols-3 gap-4">
//   {/* Appointment Date */}
//   <label className="flex flex-col">
//     <span className="font-semibold">Appointment Date:</span>
//     <input
//       type="date"
//       className="border p-2 rounded"
//       value={formData.appointmentDate}
//       onChange={(e) => onChange("appointmentDate", e.target.value)}
//     />
//   </label>

//   {/* Appointment Time */}
//   <div className="grid grid-cols-2 gap-2">
//     <select
//       className="border p-2 rounded"
//       value={formData.appointmentHour}
//       onChange={(e) => onChange("appointmentHour", e.target.value)}
//     >
//       <option value="">--Hour--</option>
//       {[...Array(24).keys()].map((h) => (
//         <option key={h} value={h}>
//           {h}
//         </option>
//       ))}
//     </select>
//     <select
//       className="border p-2 rounded"
//       value={formData.appointmentMinute}
//       onChange={(e) => onChange("appointmentMinute", e.target.value)}
//     >
//       <option value="">--Minute--</option>
//       {[0, 15, 30, 45].map((m) => (
//         <option key={m} value={m}>
//           {m}
//         </option>
//       ))}
//     </select>
//   </div>

//   {/* Promise Date */}
//   <label className="flex flex-col">
//     <span className="font-semibold">Promise Date:</span>
//     <input
//       type="date"
//       className="border p-2 rounded"
//       value={formData.promiseDate}
//       onChange={(e) => onChange("promiseDate", e.target.value)}
//     />
//   </label>
// </div>

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
//          </ThemedButton>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import SectionHeading from "../common/SectionHeading";
import ThemedButton from "../common/ThemedButton";
import { useTheme } from '@/theme/ThemeContext';

export default function AllotmentDetails({
  
  formData,
  onChange,
  onApprove,
  onReject,
}) {

  const { colors } = useTheme(); 


  return (
    <div className="p-6 shadow-md border rounded-xl bg-white mb-10">
  <div className="border rounded-lg overflow-hidden mb-10">
        <SectionHeading>Previous Appointment Date/Time</SectionHeading>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left"style={{background:colors.primary,color:colors.textColor}}>
                <th className="border px-4 py-2">Ticket No.</th>
                <th className="border px-4 py-2">Previous Appointment Date/Time</th>
                <th className="border px-4 py-2">Request Re-allot date/time</th>
                <th className="border px-4 py-2">ASC reason</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">{formData.ticketNo || 'Not Available'}</td>
                <td className="border px-4 py-2">{formData.prevAppointment || 'Not Available'}</td>
                <td className="border px-4 py-2">{formData.reallotDate || 'Not Available'}</td>
                <td className="border px-4 py-2">{formData.ascReason || 'Not Available'}</td>
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
              className="border p-2 rounded"
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
              className="border p-2 rounded"
              value={formData.engineer}
              onChange={(e) => onChange("engineer", e.target.value)}
            >
              <option value="">-- Select Engineer --</option>
              {formData.engineer && (
                <option value={formData.engineer}>{formData.engineer}</option>
              )}
            </select>
          </label>

          <label className="flex items-center gap-2 mt-6">
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
              className="border p-2 rounded"
              value={formData.appointmentDate}
              onChange={(e) => onChange("appointmentDate", e.target.value)}
            />
          </label>

          {/* Appointment Time */}
          <div className="grid grid-cols-2 gap-2">
            <select
              className="border p-2 rounded"
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
              className="border p-2 rounded"
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
              className="border p-2 rounded"
              value={formData.promiseDate}
              onChange={(e) => onChange("promiseDate", e.target.value)}
            />
          </label>
        </div>

        {/* ASM & Customer Remark */}
        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col">
            <span className="font-semibold">ASM Remark:</span>
            <textarea
              className="border p-2 rounded"
              value={formData.asmRemark}
              onChange={(e) => onChange("asmRemark", e.target.value)}
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold">Customer Remark (If Any):</span>
            <textarea
              className="border p-2 rounded"
              value={formData.customerRemark}
              onChange={(e) => onChange("customerRemark", e.target.value)}
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
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

