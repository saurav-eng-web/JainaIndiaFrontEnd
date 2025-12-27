"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";

export default function ComplaintTable() {
  const { colors } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const reduxUser = useSelector((state) => state.auth?.user);
  const localUser =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

  const user = reduxUser || localUser;
  const userID = user?.userID;
  const roleID = user?.roleID;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "technical approval":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!userID || !roleID) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `CallRegister/getstatus/Technical Approval/Not Assigned/${roleID}/${userID}`
        );
        setComplaints(response.data || []);
      } catch (err) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userID, roleID]);

  const columns = [
    {
      label: "Update",
      key: "update",
      size: "sm",
      render: (_, row) => (
        <button
          onClick={() => {
            localStorage.setItem("selectedComplaint", JSON.stringify(row));
            router.push("/assigntoasc");
          }}
          className="cursor-pointer rounded-md px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
          style={{ backgroundColor: colors.primary }}
        >
          Update
        </button>
      ),
    },
    {
      label: "Complaint No.",
      key: "tickeT_NO",
      size: "md",
    },
    {
      label: "Customer Name",
      key: "customerName",
      size: "lg",
      render: (_, row) =>
        `${row.salutation || ""} ${row.firstname || ""} ${row.lastname || ""}`,
    },
    {
      label: "Product",
      key: "product",
      size: "md",
    },
    {
      label: "Call Type",
      key: "calL_TYPE",
      size: "sm",
    },
    {
      label: "Status",
      key: "complainT_STATUS",
      size: "sm",
      render: (status) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
            status
          )}`}
        >
          {status}
        </span>
      ),
    },
    {
      label: "Sub Status",
      key: "complainT_SUBSTATUS",
      size: "md",
    },
  ];

  return (
    <div className="font-inter flex min-h-screen">
      <SideBar />

      <div className="ml-[60px] min-h-screen w-full bg-[#f4f6f8] p-8 transition-all">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-8 rounded-md border-2 border-[#714b67] px-3 py-2 text-left text-lg font-bold text-[#714b67]">
            Technical Approval Listing
          </h2>

          {loading ? (
            <p className="text-sm text-gray-600">Loading complaints...</p>
          ) : (
            <Table columns={columns} rows={complaints} />
          )}

          {/* {loading ? (
            <p className="text-sm text-gray-600">Loading complaints...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#714b67] text-white">
                    <th className="px-4 py-3 text-left font-semibold">Update</th>
                    <th className="px-4 py-3 text-left font-semibold">Complaint No.</th>
                    <th className="px-4 py-3 text-left font-semibold">Customer Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                    <th className="px-4 py-3 text-left font-semibold">Call Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Sub Status</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    complaints.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              localStorage.setItem(
                                "selectedComplaint",
                                JSON.stringify(item)
                              );
                              router.push("/assigntoasc");
                            }}
                            className="rounded-md px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
                            style={{ backgroundColor: colors.primary }}
                          >
                            Update
                          </button>
                        </td>

                        <td className="px-4 py-3">{item.tickeT_NO}</td>
                        <td className="px-4 py-3">
                          {`${item.salutation || ""} ${item.firstname || ""} ${item.lastname || ""}`}
                        </td>
                        <td className="px-4 py-3">{item.product}</td>
                        <td className="px-4 py-3">{item.calL_TYPE}</td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
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
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import "./technical.css";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";

// import SideBar from "@/components/SideBar";
// import { useTheme } from "@/theme/ThemeContext";
// import axiosInstance from "@/api/axiosInstance";

// export default function ComplaintTable() {
//   const { colors } = useTheme();
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // ✅ Get user from Redux or fallback to localStorage
//   const reduxUser = useSelector((state) => state.auth?.user);
//   const localUser =
//     typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

//   const user = reduxUser || localUser;
//   const userID = user?.userID;
//   const roleID = user?.roleID;

//   const getStatusClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case "technical approval":
//         return "badge open";
//       case "pending":
//         return "badge pending";
//       case "closed":
//         return "badge closed";
//       default:
//         return "badge";
//     }
//   };

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       if (!userID || !roleID) {
//         console.warn("Missing userID or roleID, cannot fetch complaints.");
//         setLoading(false);
//         return;
//       }

//       try {
//         // TODO:
//         const response = await axiosInstance.get(
//           `CallRegister/getstatus/Technical Approval/Not Assigned/${roleID}/${userID}`
//         );

//         setComplaints(response.data || []);
//       } catch (error) {
//         console.error("Error fetching complaints:", error);
//         setComplaints([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComplaints();
//   }, [userID, roleID]);

//   return (
//     <div style={{ display: "flex", minHeight: "100vh" }}>
//       <SideBar />
//       <div className="content-container">
//         <div className="table-container">
//           <div className="h2">Technical Approval Listing</div>

//           {loading ? (
//             <p>Loading complaints...</p>
//           ) : (
//             <table className="complaint-table">
//               <thead>
//                 <tr>
//                   <th>Update</th>
//                   <th>Complaint No.</th>
//                   <th>Customer Name</th>
//                   <th>Product</th>
//                   <th>Call Type</th>
//                   <th>Status</th>
//                   <th>Sub Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {complaints.length === 0 ? (
//                   <tr>
//                     <td colSpan="7">No complaints found.</td>
//                   </tr>
//                 ) : (
//                   complaints.map((item, idx) => (
//                     <tr key={idx}>
//                       <td>
//                         <button
//                           className="update-btn"
//                           onClick={() => {
//                             localStorage.setItem(
//                               "selectedComplaint",
//                               JSON.stringify(item)
//                             );
//                             router.push("/assigntoasc");
//                           }}
//                           style={{ backgroundColor: colors.primary }}
//                         >
//                           Update
//                         </button>
//                       </td>
//                       <td>{item.tickeT_NO}</td>
//                       <td>{`${item.salutation || ""} ${item.firstname || ""} ${item.lastname || ""}`}</td>
//                       <td>{item.product}</td>
//                       <td>{item.calL_TYPE}</td>
//                       <td>
//                         <span className={getStatusClass(item.complainT_STATUS)}>
//                           {item.complainT_STATUS}
//                         </span>
//                       </td>
//                       <td>{item.complainT_SUBSTATUS}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
