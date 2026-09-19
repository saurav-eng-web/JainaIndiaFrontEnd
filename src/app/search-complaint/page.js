"use client";

import { BadgeIndianRupee, Printer, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import CostEstimationModal from "../sf/Modals/CostEstimationModal";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import Modal from "@/components/customui/Modal";
import PageSkeleton from "@/components/customui/PageSkeleton";
import { setRouteData } from "@/redux/slices/routeDataSlice";
import { logger } from "@/utils/logger";

export default function SearchComplaintPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openCostEstimationPopup, setOpenCostEstimationPopup] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const searchInputRef = useRef(null);

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

  // Try to focus as early as possible (before paint)
  useLayoutEffect(() => {
    try {
      searchInputRef.current?.focus();
    } catch (e) {
      // ignore
    }
  }, []);

  // Fallback: some UI (modals, router navigation, or other side-effects) can steal focus on mount
  // so retry focus shortly after mount.
  useEffect(() => {
    const t = setTimeout(() => searchInputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

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

  const handlePrintJobSheet = (complaintNo) => {
    dispatch(setRouteData({ key: "complaintNo", data: complaintNo }));
    router.push("sf/print-job-sheet");
  };

  // TODO:
  const handleCostEstimation = (complaintNo) => {
    setOpenCostEstimationPopup(true);
    setActiveTicket(complaintNo);
    // dispatch(setRouteData({ key: "complaintNo", data: complaintNo }));
    // router.push("sf/cost-estimation");
  };

  const showRegistrationColumn =
    userRole === "cc" &&
    searchResults.some(
      (r) =>
        r?.complainT_SUBSTATUS?.toLowerCase() === "ok" ||
        r?.complainT_SUBSTATUS?.toLowerCase() === "cancel"
    );

  const showPrinterColumn = ["sf/ssd", "sf", "ssd"].includes(userRole);

  const costEstimationRoles = ["sf/ssd", "sf", "ssd"];
  const showCostEstimationColumn =
    costEstimationRoles.includes(userRole) &&
    searchResults.some((r) => {
      const s = (r?.complainT_SUBSTATUS || "").toLowerCase();
      return s && !["ok", "cancel"].includes(s);
    });

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
      size: "xs",
      render: (v) => v || "-",
    },
    ...(showPrinterColumn
      ? [
          {
            key: "print",
            label: "Print",
            size: "xs",
            render: (_, row) => {
              const sub = (row?.complainT_SUBSTATUS || "").toLowerCase();
              const canShow = sub && !["ok", "cancel"].includes(sub);
              return canShow ? (
                <button
                  className="flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-[13px] text-[#714b67] transition-colors"
                  onClick={() => handlePrintJobSheet(row.tickeT_NO)}
                  title="Print Job Sheet"
                >
                  <Printer size={20} />
                </button>
              ) : (
                "-"
              );
            },
          },
        ]
      : []),
    ...(showCostEstimationColumn
      ? [
          {
            key: "costEst",
            label: "Cost Est.",
            size: "xs",
            render: (_, row) => {
              const sub = (row?.complainT_SUBSTATUS || "").toLowerCase();
              const canShow = sub && !["ok", "cancel"].includes(sub);
              return canShow ? (
                <button
                  className="flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-[13px] text-[#714b67] transition-colors"
                  onClick={() => handleCostEstimation(row.tickeT_NO)}
                  title="Cost Estimation"
                >
                  <BadgeIndianRupee size={20} />
                </button>
              ) : (
                "-"
              );
            },
          },
        ]
      : []),
  ];

  return (
    <PageSkeleton
      title="Search Complaint"
      rolesAllowed={["cc", "br", "asm", "zone", "sf/ssd", "distributor", "logistic"]}
    >
      {/* Search Box Section */}
      <div className="flex gap-4">
        <InputField
          ref={searchInputRef}
          type="text"
          placeholder="Complaint No / Mobile No / Serial No"
          className="w-xs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onEnterKeyPressed={handleSearch}
        />
        <Button disabled={isLoading} className="mt-6" onClick={handleSearch}>
          {isLoading ? "Searching..." : "Search"}
          <Search size={20} className="ml-2" />
        </Button>
        {/* </div> */}
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

      <Modal
        open={openCostEstimationPopup}
        onClose={() => setOpenCostEstimationPopup(false)}
      >
        <CostEstimationModal ticketNumber={activeTicket} />
      </Modal>
    </PageSkeleton>
  );
}
