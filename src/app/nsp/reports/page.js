// 'use client';
// import { FaDownload } from 'react-icons/fa';
// import { useTheme } from '@/theme/ThemeContext';

// export default function ReportFilter() {
//     const { colors } = useTheme(); 
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
     

//       <div className="bg-white p-6 rounded shadow border border-gray-200">
//       <h2 className="mb-4"style={{color:colors.primary,padding:5,fontWeight:700,fontSize:18, border: `2px solid ${colors.primary}`,borderRadius:5}}>All Reports</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           {/* From Date */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">From Date</label>
//             <input
//               type="date"
//               className="w-full border-1 border-[#000] rounded px-1 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           {/* To Date */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">To Date</label>
//             <input
//               type="date"
//               className="w-full border-1 border-[#000] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>
//         </div>

//         {/* Report Dropdown */}
//         <div className="mb-4 md:w-1/3">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Select Report Name:</label>
//           <select className="w-full border-1 border-[#000] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
//             <option>---Select---</option>
//             <option>Report 1</option>
//             <option>Report 2</option>
//           </select>
//         </div>

//         {/* Download Button */}
//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded" style={{background:colors.primary}}>
//           <FaDownload className="text-white" />
//           Download Report
//         </button>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import SideBar from '@/components/SideBar';
// import { useTheme } from '@/theme/ThemeContext';
// import { FaDownload } from 'react-icons/fa';

// export default function DashboardPage() {
//   const { colors } = useTheme();

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <SideBar />

//       {/* Main content */}
//       <div className="flex-1 p-25 pt-10 bg-gray-50 min-h-screen">
//         <div className="bg-white p-6 rounded ">
//           {/* Heading */}
//           <h2
//             className="mb-4"
//             style={{
//               color: colors.primary,
//               padding: 5,
//               fontWeight: 700,
//               fontSize: 18,
//               border: `2px solid ${colors.primary}`,
//               borderRadius: 5,
//             }}
//           >
//             All Reports
//           </h2>

//           {/* Inputs */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             {/* From Date */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">From Date</label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>

//             {/* To Date */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">To Date</label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//           </div>

//           {/* Report Dropdown */}
//           <div className="mb-4 md:w-1/3">
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Select Report Name:</label>
//             <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
//               <option>---Select---</option>
//               <option>Report 1</option>
//               <option>Report 2</option>
//             </select>
//           </div>

//           {/* Download Button */}
//           <button
//             className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded"
//             style={{ background: colors.primary }}
//           >
//             <FaDownload />
//             Download Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
