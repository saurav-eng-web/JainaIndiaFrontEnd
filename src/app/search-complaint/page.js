"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SideBar from "@/components/SideBar";
import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SearchComplaintPage() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      router.replace("/");
    }
  }, [router]);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleViewHistory = (ticketNo) => {
    sessionStorage.setItem("currentTicket", ticketNo);
    router.push("/history");
  };

  const handleSearch = async () => {
    const q = query.trim();

    if (!q) {
      alert("Please enter a complaint number, mobile number, or serial number");
      return;
    }

    if (q.length < 10) {
      alert("Please enter at least 10 characters to search");
      return;
    }

    try {
      const response = await axiosInstance.get("CallSearch/search", {
        params: {
          phone: /^[0-9]{10}$/.test(q) ? q : "",
          callNumber: q,
          serialNo: q,
        },
      });

      const results = Array.isArray(response.data) ? response.data : [response.data];

      setSearchResults(results);
      setSearchAttempted(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setSearchAttempted(true);
    }

    setQuery("");
  };

  return (
    <ProtectedRoute allowedRoles={["cc", "br", "asm", "zone", "sf/ssd"]}>
      <div className="flex w-full">
        <SideBar />

        {/* Content Wrapper */}
        <div className="ml-[60px] w-full transition-all duration-300 ease-in-out">
          {/* Main Container */}
          <div className="mt-10 ml-10 max-w-[1300px] rounded-xl bg-[#dee2e6] p-10">
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
                  className="cursor-pointer rounded-lg bg-[#714b67] px-5 py-3 text-base font-bold text-white transition-colors duration-300 hover:bg-[#5a3c52]"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Results Table */}
            {searchResults.length > 0 && (
              <div className="mt-8 overflow-x-auto rounded-xl bg-white">
                <table className="w-full min-w-[1000px] border-separate border-spacing-0 overflow-hidden rounded-xl">
                  <thead>
                    <tr className="bg-[#714b67]">
                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        History
                      </th>
                      {searchResults.some(
                        (result) =>
                          result.complainT_SUBSTATUS?.toLowerCase() === "ok" ||
                          result.complainT_SUBSTATUS?.toLowerCase() === "cancel"
                      ) && (
                        <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                          Registration
                        </th>
                      )}

                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        Name
                      </th>
                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        Mobile No.
                      </th>
                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        Product
                      </th>
                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        Model
                      </th>
                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        Complaint No.
                      </th>
                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        Serial No.
                      </th>
                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        Call Type
                      </th>
                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        Sub Status
                      </th>
                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        ASC Code
                      </th>
                      <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((result, index) => {
                      const showRegistration =
                        result.complainT_SUBSTATUS?.toLowerCase() === "ok" ||
                        result.complainT_SUBSTATUS?.toLowerCase() === "cancel";

                      return (
                        <tr
                          key={index}
                          className="group bg-[#f9f9f9] transition-colors duration-200 even:bg-[#f1faff] hover:bg-[#e3f2fd]"
                        >
                          {/* History Button */}
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            <button
                              className="cursor-pointer rounded-md bg-[#714b67] px-3.5 py-2 text-[13px] text-white transition-colors duration-300 hover:bg-[#5a3c52]"
                              onClick={() => handleViewHistory(result.tickeT_NO)}
                            >
                              History
                            </button>
                          </td>

                          {/* Registration Button */}
                          {searchResults.some(
                            (r) =>
                              r.complainT_SUBSTATUS?.toLowerCase() === "ok" ||
                              r.complainT_SUBSTATUS?.toLowerCase() === "cancel"
                          ) && (
                            <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                              {showRegistration && (
                                <button
                                  className="cursor-pointer rounded-md bg-[#714b67] px-3.5 py-2 text-[13px] text-white transition-colors duration-300 hover:bg-[#5a3c52]"
                                  onClick={() => {
                                    const params = new URLSearchParams({
                                      title: result.salutation || "",
                                      firstName: result.firstname || "",
                                      lastName: result.lastname || "",
                                      phone: result.hmph || result.mobile || "",
                                      altPhone: result.wkph || "",
                                      customerAddress: result.addresS1 || "",
                                      landmark: result.landmark || "",
                                      pincode: result.pincode || "",
                                      state: result.state || "",
                                      city: result.city || "",
                                      locality: result.locality || "",
                                      localityId: result.localitY_ID?.toString() || "",
                                      modelID: result.modeL_ID?.toString() || "",
                                      cityId: result.citY_ID?.toString() || "",
                                      serialNo: result.seriaL_NO || "",
                                      productCategory: result.category || "",
                                      brand: result.brand || "",
                                      pop: result.purchasE_DATE || "",
                                      product: result.product || "",
                                      productID: result.producT_ID?.toString() || "",
                                      model: result.model || "",
                                      warranty: result.warranty || "",
                                      callType: result.calL_TYPE || "",
                                      faultVoc: result.remarks || "",
                                      availableTime: result.promisE_TIME || "",
                                    });
                                    router.push(`/call?${params.toString()}`);
                                  }}
                                >
                                  New Reg.
                                </button>
                              )}
                            </td>
                          )}

                          {/* Data Cells */}
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {`${result.salutation} ${result.firstname} ${result.lastname}`}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {result.mobile}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {result.category || "-"}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {result.model || "-"}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {result.tickeT_NO || "-"}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {result.seriaL_NO || "-"}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {result.calL_TYPE || "-"}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {result.complainT_SUBSTATUS || "-"}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {result.asC_CODE || "-"}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {result.pop ? new Date(result.pop).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
