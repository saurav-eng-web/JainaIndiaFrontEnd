"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import SideBar from "@/components/SideBar";
import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { logger } from "@/utils/logger";
import Table from "@/components/common/Table";

export default function SearchComplaintPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      router.replace("/");
    } else {
      const user = JSON.parse(userData);
      const role = user.roleName?.toLowerCase();
      setUserRole(role);
    }
  }, [router]);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewHistory = (ticketNo) => {
    sessionStorage.setItem("currentTicket", ticketNo);
    router.push("/history");
  };

  const handleSearch = async () => {
    const q = query.trim();

    if (!q) {
      toast.error("Please enter a complaint number, mobile number, or serial number");
      return;
    }

    if (q.length < 10) {
      toast.error("Please enter at least 10 characters to search");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("CallSearch/search", {
        params: {
          searchText: q,
        },
      });

      if (response?.status === 204) {
        setSearchResults([]);
        setSearchAttempted(true);
        // toast.error("No results found");
        return;
      }

      const results = Array.isArray(response.data?.data)
        ? response.data?.data
        : [response.data?.data];

      setSearchResults(results);
      setSearchAttempted(true);
    } catch (error) {
      console.error("Search error:", error);
      logger.error(`Search error: ${error.message}`, "search-complaint", {
        payload: { query: q },
      });
      setSearchResults([]);
      setSearchAttempted(true);
    } finally {
      setIsLoading(false);
    }

    setQuery("");
  };

  const handleClick = (result) => {
    const params = new URLSearchParams({
      title: result?.salutation || "",
      firstName: result?.firstname || "",
      lastName: result?.lastname || "",
      phone: result?.hmph || result?.mobile || "",
      altPhone: result?.wkph || "",
      customerAddress: result?.addresS1 || "",
      landmark: result?.landmark || "",
      pincode: result?.pincode || "",
      state: result?.state || "",
      city: result?.city || "",
      locality: result?.locality || "",
      localityId: result?.localitY_ID?.toString() || "",
      modelID: result?.modeL_ID?.toString() || "",
      cityId: result?.citY_ID?.toString() || "",
      serialNo: result?.seriaL_NO || "",
      productCategory: result?.category || "",
      brand: result?.brand || "",
      pop: result?.purchasE_DATE || "",
      product: result?.product || "",
      productID: result?.producT_ID?.toString() || "",
      model: result?.model || "",
      warranty: result?.warranty || "",
      callType: result?.calL_TYPE || "",
      faultVoc: result?.remarks || "",
      availableTime: result?.promisE_TIME || "",
    });
    router.push(`/call?${params.toString()}`);
  };

  const showRegistrationColumn =
    userRole === "cc" &&
    searchResults.some(
      (r) =>
        r?.complainT_SUBSTATUS?.toLowerCase() === "ok" ||
        r?.complainT_SUBSTATUS?.toLowerCase() === "cancel"
    );

  const columns = [
    {
      key: "history",
      label: "History",
      size: "xs",
      render: (_, row) => (
        <button
          className="cursor-pointer rounded-md bg-[#714b67] px-3.5 py-2 text-[13px] text-white transition-colors hover:bg-[#5a3c52]"
          onClick={() => handleViewHistory(row.tickeT_NO)}
        >
          History
        </button>
      ),
    },

    ...(showRegistrationColumn
      ? [
          {
            key: "registration",
            label: "New Reg.",
            size: "sm",
            render: (_, row) => {
              const show =
                row?.complainT_SUBSTATUS?.toLowerCase() === "ok" ||
                row?.complainT_SUBSTATUS?.toLowerCase() === "cancel";

              return show ? (
                <button
                  className="cursor-pointer rounded-md bg-[#714b67] px-3.5 py-2 text-[13px] text-white transition-colors hover:bg-[#5a3c52]"
                  onClick={() => handleClick(row)}
                >
                  New Reg.
                </button>
              ) : (
                "-"
              );
            },
          },
        ]
      : []),

    // 3️⃣ Name
    {
      key: "name",
      label: "Name",
      size: "sm",
      render: (_, row) =>
        `${row?.salutation || ""} ${row?.firstname || ""} ${row?.lastname || ""}`,
    },

    // 4️⃣ Mobile No.
    {
      key: "hmph",
      label: "Mobile No.",
      size: "xs",
    },

    // 5️⃣ Product
    {
      key: "product",
      label: "Product",
      size: "sm",
      render: (v) => v || "-",
    },

    // 6️⃣ Model
    {
      key: "model",
      label: "Model",
      size: "sm",
      render: (v) => v || "-",
    },

    // 7️⃣ Complaint No.
    {
      key: "tickeT_NO",
      label: "Complaint No.",
      size: "sm",
    },

    // 8️⃣ Serial No.
    {
      key: "seriaL_NO",
      label: "Serial No.",
      size: "sm",
      render: (v) => v || "-",
    },

    // 9️⃣ Call Type
    {
      key: "calL_TYPE",
      label: "Call Type",
      size: "sm",
      render: (v) => v || "-",
    },

    // 🔟 Sub Status
    {
      key: "complainT_SUBSTATUS",
      label: "Sub Status",
      size: "sm",
      render: (v) => v || "-",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["cc", "br", "asm", "zone", "sf/ssd"]}>
      <div className="flex w-full">
        <SideBar />

        {/* Content Wrapper */}
        <div className="ml-[60px] w-full transition-all duration-300 ease-in-out">
          {/* Main Container */}
          <div className="mt-10 ml-10 max-w-[1300px] rounded-xl bg-gray-100 p-10">
            {/* Header */}
            <h2 className="mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
              Search Complaint
            </h2>

            {/* Search Box Section */}
            <div className="mt-5 flex flex-col items-start gap-2.5">
              <input
                type="text"
                placeholder="Complaint No / Mobile No / Serial No"
                className="w-[350px] rounded-md border border-[#714b67] bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#714b67]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="mt-5 flex gap-2.5">
                <button
                  disabled={isLoading}
                  className="cursor-pointer rounded-lg bg-[#714b67] px-5 py-3 text-base font-bold text-white transition-colors duration-300 hover:bg-[#5a3c52]"
                  onClick={handleSearch}
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {/* Results Table */}
            {searchResults.length > 0 && (
              <div className="mt-8">
                <Table columns={columns} rows={searchResults} />
              </div>
            )}

            {searchAttempted && searchResults.length === 0 && (
              <p className="mt-5 text-red-600">No results found.</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// --------------------------
// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// import SideBar from "@/components/SideBar";
// import axiosInstance from "@/api/axiosInstance";
// import ProtectedRoute from "@/components/auth/ProtectedRoute";
// import { logger } from "@/utils/logger";

// export default function SearchComplaintPage() {
//   const router = useRouter();
//   const [userRole, setUserRole] = useState("");

//   useEffect(() => {
//     const userData = localStorage.getItem("userData");
//     if (!userData) {
//       router.replace("/");
//     } else {
//       const user = JSON.parse(userData);
//       const role = user.roleName?.toLowerCase();
//       setUserRole(role);
//     }
//   }, [router]);

//   const [query, setQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchAttempted, setSearchAttempted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleViewHistory = (ticketNo) => {
//     sessionStorage.setItem("currentTicket", ticketNo);
//     router.push("/history");
//   };

//   const handleSearch = async () => {
//     const q = query.trim();

//     if (!q) {
//       toast.error("Please enter a complaint number, mobile number, or serial number");
//       return;
//     }

//     if (q.length < 10) {
//       toast.error("Please enter at least 10 characters to search");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await axiosInstance.get("CallSearch/search", {
//         params: {
//           searchText: q,
//         },
//       });

//       if (response?.status === 204) {
//         setSearchResults([]);
//         setSearchAttempted(true);
//         // toast.error("No results found");
//         return;
//       }

//       const results = Array.isArray(response.data?.data)
//         ? response.data?.data
//         : [response.data?.data];

//       setSearchResults(results);
//       setSearchAttempted(true);
//     } catch (error) {
//       console.error("Search error:", error);
//       logger.error(`Search error: ${error.message}`, "search-complaint", {
//         payload: { query: q },
//       });
//       setSearchResults([]);
//       setSearchAttempted(true);
//     } finally {
//       setIsLoading(false);
//     }

//     setQuery("");
//   };

//   const handleClick = () => {
//     const params = new URLSearchParams({
//       title: result?.salutation || "",
//       firstName: result?.firstname || "",
//       lastName: result?.lastname || "",
//       phone: result?.hmph || result?.mobile || "",
//       altPhone: result?.wkph || "",
//       customerAddress: result?.addresS1 || "",
//       landmark: result?.landmark || "",
//       pincode: result?.pincode || "",
//       state: result?.state || "",
//       city: result?.city || "",
//       locality: result?.locality || "",
//       localityId: result?.localitY_ID?.toString() || "",
//       modelID: result?.modeL_ID?.toString() || "",
//       cityId: result?.citY_ID?.toString() || "",
//       serialNo: result?.seriaL_NO || "",
//       productCategory: result?.category || "",
//       brand: result?.brand || "",
//       pop: result?.purchasE_DATE || "",
//       product: result?.product || "",
//       productID: result?.producT_ID?.toString() || "",
//       model: result?.model || "",
//       warranty: result?.warranty || "",
//       callType: result?.calL_TYPE || "",
//       faultVoc: result?.remarks || "",
//       availableTime: result?.promisE_TIME || "",
//     });
//     router.push(`/call?${params.toString()}`);
//   };

//   return (
//     <ProtectedRoute allowedRoles={["cc", "br", "asm", "zone", "sf/ssd"]}>
//       <div className="flex w-full">
//         <SideBar />

//         {/* Content Wrapper */}
//         <div className="ml-[60px] w-full transition-all duration-300 ease-in-out">
//           {/* Main Container */}
//           <div className="mt-10 ml-10 max-w-[1300px] rounded-xl bg-gray-100 p-10">
//             {/* Header */}
//             <h2 className="mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
//               Search Complaint
//             </h2>

//             {/* Search Box Section */}
//             <div className="mt-5 flex flex-col items-start gap-2.5">
//               <input
//                 type="text"
//                 placeholder="Complaint No / Mobile No / Serial No"
//                 className="w-[350px] rounded-md border border-[#714b67] bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#714b67]"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//               />
//               <div className="mt-5 flex gap-2.5">
//                 <button
//                   disabled={isLoading}
//                   className="cursor-pointer rounded-lg bg-[#714b67] px-5 py-3 text-base font-bold text-white transition-colors duration-300 hover:bg-[#5a3c52]"
//                   onClick={handleSearch}
//                 >
//                   {isLoading ? "Searching..." : "Search"}
//                 </button>
//               </div>
//             </div>

//             {/* Results Table */}
//             {searchResults.length > 0 && (
//               <div className="mt-8 overflow-x-auto rounded-xl bg-white">
//                 <table className="w-full min-w-[1000px] border-separate border-spacing-0 overflow-hidden rounded-xl">
//                   <thead>
//                     <tr className="bg-[#714b67]">
//                       <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
//                         History
//                       </th>
//                       {searchResults.some(
//                         (result) =>
//                           result?.complainT_SUBSTATUS?.toLowerCase() === "ok" ||
//                           result?.complainT_SUBSTATUS?.toLowerCase() === "cancel"
//                       ) &&
//                         userRole === "cc" && (
//                           <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
//                             Registration
//                           </th>
//                         )}

//                       <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
//                         Name
//                       </th>
//                       <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
//                         Mobile No.
//                       </th>
//                       <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
//                         Product
//                       </th>
//                       <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
//                         Model
//                       </th>
//                       <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
//                         Complaint No.
//                       </th>
//                       <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
//                         Serial No.
//                       </th>
//                       <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
//                         Call Type
//                       </th>
//                       <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
//                         Sub Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {searchResults.map((result, index) => {
//                       const showRegistration =
//                         result?.complainT_SUBSTATUS?.toLowerCase() === "ok" ||
//                         result?.complainT_SUBSTATUS?.toLowerCase() === "cancel";

//                       return (
//                         <tr
//                           key={index}
//                           className="group bg-[#f9f9f9] transition-colors duration-200 even:bg-[#f1faff] hover:bg-[#e3f2fd]"
//                         >
//                           {/* History Button */}
//                           <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//                             <button
//                               className="cursor-pointer rounded-md bg-[#714b67] px-3.5 py-2 text-[13px] text-white transition-colors duration-300 hover:bg-[#5a3c52]"
//                               onClick={() => handleViewHistory(result.tickeT_NO)}
//                             >
//                               History
//                             </button>
//                           </td>

//                           {/* Registration Button */}
//                           {searchResults.some(
//                             (r) =>
//                               r?.complainT_SUBSTATUS?.toLowerCase() === "ok" ||
//                               r?.complainT_SUBSTATUS?.toLowerCase() === "cancel"
//                           ) &&
//                             userRole === "cc" && (
//                               <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//                                 {showRegistration && (
//                                   <button
//                                     className="cursor-pointer rounded-md bg-[#714b67] px-3.5 py-2 text-[13px] text-white transition-colors duration-300 hover:bg-[#5a3c52]"
//                                     onClick={handleClick}
//                                   >
//                                     New Reg.
//                                   </button>
//                                 )}
//                               </td>
//                             )}

//                           <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//                             {`${result?.salutation} ${result?.firstname} ${result?.lastname}`}
//                           </td>
//                           <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//                             {result?.hmph}
//                           </td>
//                           <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//                             {result?.product || "-"}
//                           </td>
//                           <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//                             {result?.model || "-"}
//                           </td>
//                           <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//                             {result?.tickeT_NO || "-"}
//                           </td>
//                           <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//                             {result?.seriaL_NO || "-"}
//                           </td>
//                           <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//                             {result?.calL_TYPE || "-"}
//                           </td>
//                           <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//                             {result?.complainT_SUBSTATUS || "-"}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {searchAttempted && searchResults.length === 0 && (
//               <p className="mt-5 text-red-600">No results found.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }
