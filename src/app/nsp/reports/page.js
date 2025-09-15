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
// // }
// 'use client'; 

// import ProtectedRoute from '@/components/auth/ProtectedRoute';
// import SideBar from '@/components/SideBar';
// import { useTheme } from '@/theme/ThemeContext';
// import { FaDownload } from 'react-icons/fa';

// export default function DashboardPage() {
//   const { colors } = useTheme();

//   return (
//     <ProtectedRoute allowedRoles={['br']}>  
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
//      </ProtectedRoute>
//   );
// }



// 'use client';

// import ProtectedRoute from '@/components/auth/ProtectedRoute';
// import SideBar from '@/components/SideBar';
// import { useTheme } from '@/theme/ThemeContext';
// import { FaDownload } from 'react-icons/fa';
// import axiosInstance from '@/api/axiosInstance';

// export default function DashboardPage() {
//   const { colors } = useTheme();

//   // const handleDownload = async () => {
//   //   try {
//   //     const body = {
//   //       Type: "OpencallReport",
//   //       UserId: "49857",
//   //       FromDate: "2025-02-13",
//   //       ToDate: "2025-02-18",
//   //     };

//   //     // ✅ axiosInstance POST request with blob response
//   //     const response = await axiosInstance.post(
//   //       "https://ncapi.jainaindia.com/api/reports/downloadreports",
//   //       body,
//   //       {
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiRExTM05TUC0wMDIiLCJVc2VySUQiOiI0ODY5NCIsImV4cCI6MTc1NzkyOTgyNywiaXNzIjoiaHR0cHM6Ly9kZXZjcm1mcm9udGVuZC5qYWluYWluZGlhLmNvbSIsImF1ZCI6Imh0dHBzOi8vZGV2Y3JtZnJvbnRlbmQuamFpbmFpbmRpYS5jb20ifQ.VkO41XI0HrKm075Q2ky3TBIvcFIBqLQZDikt1pTXzbw`,
//   //         },
//   //         responseType: "blob", // ✅ important for file download
//   //       }
//   //     );

//   //     // ✅ Create Blob download
//   //     const url = window.URL.createObjectURL(new Blob([response.data]));
//   //     const a = document.createElement("a");
//   //     a.href = url;

//   //     // Extract filename if present in headers
//   //     const contentDisposition = response.headers["content-disposition"];
//   //     const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
//   //     const fileName = fileNameMatch ? fileNameMatch[1] : "report.csv";

//   //     a.download = fileName;
//   //     document.body.appendChild(a);
//   //     a.click();

//   //     // Cleanup
//   //     a.remove();
//   //     window.URL.revokeObjectURL(url);

//   //   } catch (error) {
//   //     console.error("Download failed:", error);
//   //     alert("Download failed");
//   //   }
//   // };
//   const handleDownload = async () => {
//     try {
//       const body = {
//         Type: "OpencallReport",
//         UserId: "49857",
//         FromDate: "2025-02-13",
//         ToDate: "2025-02-18",
//       };
  
//       // ✅ Only call endpoint, axiosInstance already handles baseURL & headers
//       const response = await axiosInstance.post(
//         "/reports/downloadreports",
//         body,
//         { responseType: "blob" } // 👈 needed for downloading files
//       );
  
//       // ✅ Create Blob download
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const a = document.createElement("a");
//       a.href = url;
  
//       // Extract filename from response headers if available
//       const contentDisposition = response.headers["content-disposition"];
//       const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
//       const fileName = fileNameMatch ? fileNameMatch[1] : "report.csv";
  
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
  
//       // Cleanup
//       a.remove();
//       window.URL.revokeObjectURL(url);
  
//     } catch (error) {
//       console.error("Download failed:", error);
//       alert("Download failed");
//     }
//   };
  
//   return (
//     <ProtectedRoute allowedRoles={['br']}>
//       <div className="flex">
//         {/* Sidebar */}
//         <SideBar />

//         {/* Main content */}
//         <div className="flex-1 p-25 pt-10 bg-gray-50 min-h-screen">
//           <div className="bg-white p-6 rounded">
//             {/* Heading */}
//             <h2
//               className="mb-4"
//               style={{
//                 color: colors.primary,
//                 padding: 5,
//                 fontWeight: 700,
//                 fontSize: 18,
//                 border: `2px solid ${colors.primary}`,
//                 borderRadius: 5,
//               }}
//             >
//               All Reports
//             </h2>

//             {/* Inputs */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               {/* From Date */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">From Date</label>
//                 <input
//                   type="date"
//                   className="w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>

//               {/* To Date */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">To Date</label>
//                 <input
//                   type="date"
//                   className="w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>
//             </div>

//             {/* Report Dropdown */}
//             <div className="mb-4 md:w-1/3">
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Select Report Name:</label>
//               <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
//                 <option>---Select---</option>
//                 <option>Report 1</option>
//                 <option>Report 2</option>
//               </select>
//             </div>

//             {/* Download Button */}
//             <button
//               onClick={handleDownload}
//               className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded"
//               style={{ background: colors.primary }}
//             >
//               <FaDownload />
//               Download Report
//             </button>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }
'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SideBar from '@/components/SideBar';
import { useTheme } from '@/theme/ThemeContext';
import { FaDownload } from 'react-icons/fa';
import axiosInstance from '@/api/axiosInstance';
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const { colors } = useTheme();

  // ✅ State for form inputs
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportType, setReportType] = useState('');
  const { user } = useSelector((state) => state.auth);
const loggedInUserId = user?.userID || "";

  const handleDownload = async () => {
    if (!fromDate || !toDate || !reportType) {
      alert('Please select From Date, To Date and Report');
      return;
    }

    

    try {
      const body = {
        Type: reportType,
        UserId: loggedInUserId, 
        FromDate: fromDate,
        ToDate: toDate,
      };

      // ✅ API call with blob response
      const response = await axiosInstance.post(
        "/reports/downloadreports",
        body,
        { responseType: "blob" }
      );

      // ✅ Create Blob download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;

      // Extract filename if present
      const contentDisposition = response.headers["content-disposition"];
      const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
      const fileName = fileNameMatch ? fileNameMatch[1] : "report.csv";

      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed");
    }
  };

  return (
    <ProtectedRoute allowedRoles={['br']}>
      <div className="flex">
        {/* Sidebar */}
        <SideBar />

        {/* Main content */}
        <div className="flex-1 p-25 pt-10 bg-gray-50 min-h-screen">
          <div className="bg-white p-6 rounded">
            {/* Heading */}
            <h2
              className="mb-4"
              style={{
                color: colors.primary,
                padding: 5,
                fontWeight: 700,
                fontSize: 18,
                border: `2px solid ${colors.primary}`,
                borderRadius: 5,
              }}
            >
              All Reports
            </h2>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* From Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Report Dropdown */}
            <div className="mb-4 md:w-1/3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Report Name:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">---Select---</option>
                <option value="OpencallReport">Open Call Report</option>
               
              </select>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded"
              style={{ background: colors.primary }}
            >
              <FaDownload />
              Download Report
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
