"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import axiosInstance from "@/api/axiosInstance";
import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
import { decodeRouteData } from "@/utils/secureRoute";
import Pagination from "@/components/Pagination";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function ComplaintTableInner() {
  const { colors } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");
  const [subStatus, setSubStatus] = useState("");
  const [roleID, setRoleID] = useState("");
  const [firstID, setFirstID] = useState("");

  // 🔍 SEARCH STATE
  const [search, setSearch] = useState("");

  // 📄 PAGINATION STATE
  const INITIAL_PAGE_SIZE = 15;
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Decode once, memoized
  const routeData = useMemo(() => {
    const encoded = searchParams.get("d");
    if (!encoded) return null;

    try {
      return decodeRouteData(encoded);
    } catch (err) {
      console.error("Invalid route data:", err);
      return null;
    }
  }, [searchParams]);

  useEffect(() => {
    if (!routeData) return;

    const { status, subStatus, roleID, firstID } = routeData;

    setStatus(status);
    setSubStatus(subStatus);
    setRoleID(roleID);
    setFirstID(firstID);

    if (!status || !subStatus || !roleID || !firstID) return;

    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const url = `${BASE_URL}/CallRegister/getstatus/${encodeURIComponent(
          status
        )}/${encodeURIComponent(subStatus)}/${roleID}/${firstID}`;

        const response = await axiosInstance.get(url);
        setComplaints(response.data || []);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [routeData]);

  // 🔍 SEARCH FILTER (memoized)
  const filteredComplaints = useMemo(() => {
    if (!search.trim()) return complaints;

    const query = search.toLowerCase();

    return complaints.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [search, complaints]);

  // 📄 PAGINATION CALCULATIONS (BASED ON FILTERED DATA)
  const totalItems = filteredComplaints.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const visibleRows = filteredComplaints.slice(startIndex, endIndex);

  // 🔁 RESET PAGE WHEN SEARCH OR PAGE SIZE CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  // Optional: guard invalid navigation
  if (!routeData) {
    return (
      <div className="p-4 font-semibold text-red-600">
        Invalid or missing navigation data.
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleViewHistory = (ticketNo) => {
    sessionStorage.setItem("currentTicket", ticketNo);
    router.push("/history?fromPage=dashboardcall");
  };

  return (
    <div className="flex">
      <SideBar />
      <main className="ml-[60px] flex-1 bg-gray-100 p-6 transition-all duration-300">
        <section className="rounded-lg bg-white p-6 shadow-md">
          <h2
            className="mb-6 font-semibold"
            style={{
              color: colors.primary,
              fontSize: 18,
              border: `2px solid ${colors.primary}`,
              padding: 8,
            }}
          >
            Complaints – {status} / {subStatus}
          </h2>

          {/* 🔍 SEARCH INPUT */}
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-6 h-11 w-72 rounded-lg border-2 border-[#714b67] px-3 py-2 text-sm focus:ring-1 focus:ring-[#714b67] focus:outline-none"
          />

          {loading ? (
            <p className="text-gray-500">Loading complaints...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-xs tracking-wider text-gray-700 uppercase">
                    <th className="px-4 py-3 text-left">History</th>
                    <th className="px-4 py-3 text-left">Complaint No.</th>
                    <th className="px-4 py-3 text-left">Customer Name</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Call Type</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Sub Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-4 text-center text-gray-500">
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <button
                            className="rounded-md px-4 py-2 text-sm font-medium text-white"
                            style={{ background: colors.primary }}
                            onClick={() => handleViewHistory(item.tickeT_NO)}
                          >
                            History
                          </button>
                        </td>
                        <td className="px-4 py-3">{item.tickeT_NO}</td>
                        <td className="px-4 py-3">
                          {`${item.salutation || ""} ${item.firstname || ""} ${
                            item.lastname || ""
                          }`}
                        </td>
                        <td className="px-4 py-3">{item.product}</td>
                        <td className="px-4 py-3">{item.calL_TYPE}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              item.complainT_STATUS
                            )}`}
                          >
                            {item.complainT_STATUS}
                          </span>
                        </td>
                        <td className="px-4 py-3">{item.complainT_SUBSTATUS}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* 📄 PAGINATION */}
              {INITIAL_PAGE_SIZE < filteredComplaints.length && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// ✅ Suspense wrapper
export default function ComplaintTable() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComplaintTableInner />
    </Suspense>
  );
}

// "use client";

// import { useEffect, useState, Suspense, useMemo } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// import axiosInstance from "@/api/axiosInstance";
// import SideBar from "@/components/SideBar";
// import { useTheme } from "@/theme/ThemeContext";
// import { decodeRouteData } from "@/utils/secureRoute";
// import Pagination from "@/components/Pagination";
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// function ComplaintTableInner() {
//   const { colors } = useTheme();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");
//   const [subStatus, setSubStatus] = useState("");
//   const [roleID, setRoleID] = useState("");
//   const [firstID, setFirstID] = useState("");
//   const INITALPAGESIZE = 15;
//   const [pageSize, setPageSize] = useState(INITALPAGESIZE);
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalItems = complaints.length;
//   const totalPages = Math.ceil(totalItems / pageSize);

//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;

//   const visibleRows = complaints.slice(startIndex, endIndex);

//   // 🔹 Decode once, memoized
//   const routeData = useMemo(() => {
//     const encoded = searchParams.get("d");
//     if (!encoded) return null;

//     try {
//       return decodeRouteData(encoded);
//     } catch (err) {
//       console.error("Invalid route data:", err);
//       return null;
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (!routeData) return;

//     const { status, subStatus, roleID, firstID } = routeData;

//     setStatus(status);
//     setSubStatus(subStatus);
//     setRoleID(roleID);
//     setFirstID(firstID);

//     if (!status || !subStatus || !roleID || !firstID) return;

//     const fetchComplaints = async () => {
//       setLoading(true);
//       try {
//         const url = `${BASE_URL}/CallRegister/getstatus/${encodeURIComponent(
//           status
//         )}/${encodeURIComponent(subStatus)}/${roleID}/${firstID}`;

//         const response = await axiosInstance.get(url);
//         setComplaints(response.data || []);
//       } catch (error) {
//         console.error("Error fetching complaints:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComplaints();
//   }, [routeData]);

//   // Optional: guard invalid navigation
//   if (!routeData) {
//     return (
//       <div className="p-4 font-semibold text-red-600">
//         Invalid or missing navigation data.
//       </div>
//     );
//   }

//   const getStatusClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case "open":
//         return "bg-green-100 text-green-700";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "closed":
//         return "bg-gray-200 text-gray-800";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   const handleViewHistory = (ticketNo) => {
//     sessionStorage.setItem("currentTicket", ticketNo);
//     router.push("/history?fromPage=dashboardcall");
//   };

//   console.log("complaint size: ", complaints.length);
//   return (
//     <div className="flex">
//       <SideBar />
//       <main className="ml-[60px] flex-1 bg-gray-100 p-6 transition-all duration-300">
//         <section className="rounded-lg bg-white p-6 shadow-md">
//           <h2
//             className="mb-6 font-semibold"
//             style={{
//               color: colors.primary,
//               fontSize: 18,
//               border: `2px solid ${colors.primary}`,
//               padding: 8,
//             }}
//           >
//             Complaints - {status} / {subStatus}
//           </h2>

//           {loading ? (
//             <p className="text-gray-500">Loading complaints...</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-100 text-xs tracking-wider text-gray-700 uppercase">
//                     <th className="px-4 py-3 text-left font-semibold">History</th>
//                     <th className="px-4 py-3 text-left font-semibold">Complaint No.</th>
//                     <th className="px-4 py-3 text-left font-semibold">Customer Name</th>
//                     <th className="px-4 py-3 text-left font-semibold">Product</th>
//                     <th className="px-4 py-3 text-left font-semibold">Call Type</th>
//                     <th className="px-4 py-3 text-left font-semibold">Status</th>
//                     <th className="px-4 py-3 text-left font-semibold">Sub Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {complaints.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" className="py-4 text-center text-gray-500">
//                         No complaints found.
//                       </td>
//                     </tr>
//                   ) : (
//                     visibleRows.map((item, idx) => (
//                       <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
//                         <td className="px-4 py-3">
//                           <button
//                             className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//                             style={{ background: colors.primary }}
//                             onClick={() => handleViewHistory(item.tickeT_NO)}
//                           >
//                             History
//                           </button>
//                         </td>
//                         <td className="px-4 py-3">{item.tickeT_NO}</td>
//                         <td className="px-4 py-3">
//                           {`${item.salutation || ""} ${item.firstname || ""} ${
//                             item.lastname || ""
//                           }`}
//                         </td>
//                         <td className="px-4 py-3">{item.product}</td>
//                         <td className="px-4 py-3">{item.calL_TYPE}</td>
//                         <td className="px-4 py-3">
//                           <span
//                             className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
//                               item.complainT_STATUS
//                             )}`}
//                           >
//                             {item.complainT_STATUS}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">{item.complainT_SUBSTATUS}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//               {INITALPAGESIZE < complaints.length && (
//                 <div>
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     pageSize={pageSize}
//                     setPageSize={setPageSize}
//                     setCurrentPage={setCurrentPage}
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// // ✅ Wrap the component with Suspense to avoid build-time CSR bailout error
// export default function ComplaintTable() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ComplaintTableInner />
//     </Suspense>
//   );
// }
