"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useSelector } from "react-redux";

import PendingImageUploadPopup from "./pendingImageUploadPopup";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import Pagination from "@/components/Pagination";
import Modal from "@/components/ui/Modal";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { useTheme } from "@/theme/ThemeContext";

function ComplaintTableInner() {
  const { colors } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.userID;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openUploadPopup, setOpenUploadPopup] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // 🔍 SEARCH STATE
  const [search, setSearch] = useState("");

  // 📄 PAGINATION STATE
  const INITIAL_PAGE_SIZE = 15;
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Decode once, memoized

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
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("asc-pending-challan/list", {
        Id: 50623,
        Type: "ImagePendingHVPApproval",
      });
      setComplaints(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComplaints();
  }, []);

  // 🔁 RESET PAGE WHEN SEARCH OR PAGE SIZE CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  // Optional: guard invalid navigation

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700";
      case "ok":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-200 text-gray-800";
      case "cancel":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const columnConfig = [
    {
      label: "",
      key: "upload", // dummy key
      size: "sm",
      render: (_, row) => (
        <button
          className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ background: colors.primary }}
          onClick={() => {
            setOpenUploadPopup(true);
            setSelectedTicket(row.TICKET_NO);
          }}
        >
          Upload image
        </button>
      ),
    },
    { label: "Complaint No.", key: "TICKET_NO", size: "md" },
    {
      label: "Customer Name",
      key: "Custname", // Primary key to watch
      size: "lg",
      //   render: (_, row) =>
      //     `${row.salutation || ""} ${row.firstname || ""} ${row.lastname || ""}`.trim(),
    },
    { label: "Product", key: "PRODUCT", size: "md" },
    { label: "Call Type", key: "CALL_TYPE", size: "md" },
    {
      label: "Status",
      key: "COMPLAINT_STATUS",
      size: "md",
      render: (value) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(value)}`}
        >
          {value}
        </span>
      ),
    },
    { label: "Sub Status", key: "Complaint_SubStatus", size: "md" },
  ];

  return (
    <PageSkeleton title={"Pending Image for HVP"} rolesAllowed={["sf/ssd"]}>
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
          <Table columns={columnConfig} rows={visibleRows} />

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

      <Modal open={openUploadPopup} onClose={() => setOpenUploadPopup(false)}>
        <PendingImageUploadPopup
          userId={userId}
          onClose={() => {
            setOpenUploadPopup(false);
            fetchComplaints();
          }}
          ticketNo={selectedTicket}
        />
      </Modal>
    </PageSkeleton>
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
