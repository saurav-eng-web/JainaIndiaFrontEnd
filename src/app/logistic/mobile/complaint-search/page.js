"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import { pick } from "@/components/logistic/rowUtils";

/*
 * Legacy Mob/ComplaintSearch.aspx: one search box -> Search_Customer25(@Text, @UserId, @ipaddress).
 * Grid: Name, Mobile No., City, ASC Code, Product, Model, Complaint No., Call Type, Call Sub Status, Date.
 * "History" opened Mob/complainthistory.aspx?TICKET_KEY=<complaint>.
 */
export default function LogisticMobileComplaintSearchPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter a search value");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("logistic/mobile/complaints/search", { params: { text: text.trim() } });
      const data = Array.isArray(res.data) ? res.data : [];
      setRows(data);
      setMessage(
        data.length > 0
          ? `${data.length} Result Found according your's search`
          : "No result Found according your's search"
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Search failed");
      setRows([]);
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  }

  const columns = [
    {
      key: "history",
      label: "History",
      size: "sm",
      render: (_, row) => {
        const ticketKey = pick(row, "complaint");
        return ticketKey ? (
          <button
            type="button"
            onClick={() => router.push(`/logistic/mobile/complaint-history?ticketKey=${encodeURIComponent(ticketKey)}`)}
            className="text-blue-600 hover:underline font-semibold"
          >
            History
          </button>
        ) : (
          "-"
        );
      },
    },
    { key: "name", label: "Name", render: (_, r) => pick(r, "Name") || "-" },
    { key: "mob", label: "Mobile No.", render: (_, r) => pick(r, "mob") || "-" },
    { key: "city", label: "City", render: (_, r) => pick(r, "city") || "-" },
    { key: "locality", label: "ASC Code", render: (_, r) => pick(r, "Locality") || "-" },
    { key: "product", label: "Product", render: (_, r) => pick(r, "Product") || "-" },
    { key: "model", label: "Model", render: (_, r) => pick(r, "Model") || "-" },
    // Legacy showed TICKET_NO when present, otherwise the complaint number.
    { key: "complaintNo", label: "Complaint No.", render: (_, r) => pick(r, "TICKET_NO") || pick(r, "complaint") || "-" },
    { key: "callType", label: "Call Type", render: (_, r) => pick(r, "callType") || "-" },
    { key: "status", label: "Call Sub Status", render: (_, r) => pick(r, "status") || "-" },
    { key: "date", label: "Date", render: (_, r) => pick(r, "LastModifyDate") || "-" },
  ];

  return (
    <PageSkeleton title="Mobile Complaint Search" rolesAllowed={["logistic"]} backHref="/logistic/search-history">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <Subheading title="Search Complaint" />
        <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Complaint no. / mobile no. / serial no."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>

      {(message || isLoading) && (
        <div>
          {message && (
            <p className={`mb-3 text-sm font-semibold ${rows.length > 0 ? "text-blue-700" : "text-red-600"}`}>{message}</p>
          )}
          <Table columns={columns} rows={rows} isLoading={isLoading} />
        </div>
      )}
    </PageSkeleton>
  );
}
