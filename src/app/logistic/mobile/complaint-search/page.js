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
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import PageSkeleton from "@/components/customui/PageSkeleton";
import LogisticTable from "@/components/logistic/LogisticTable";
import { pick } from "@/components/logistic/rowUtils";

export default function LogisticMobileComplaintSearchPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSearch() {
    if (!text.trim()) {
      toast.error("Please enter a search value");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("LogisticMobile/process", { type: "complaintSearch", text: text.trim() });
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setRows(data);
      setMessage(
        data.length > 0
          ? `${data.length} Result Found according your's search`
          : "No result Found according your's search"
      );
    } catch (error) {
      toast.error(error?.response?.data?.statusMsg || "Search failed");
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
    { key: "complaintNo", label: "Complaint No.", render: (_, r) => pick(r, "TICKET_NO") || pick(r, "complaint") || "-" },
    { key: "callType", label: "Call Type", render: (_, r) => pick(r, "callType") || "-" },
    { key: "status", label: "Call Sub Status", render: (_, r) => pick(r, "status") || "-" },
    { key: "date", label: "Date", render: (_, r) => pick(r, "LastModifyDate") || "-" },
  ];

  return (
    <PageSkeleton title="Mobile Complaint Search" rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      <div className="flex gap-4">
        <InputField
          type="text"
          placeholder="Complaint No / Mobile No / Serial No"
          className="w-xs"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onEnterKeyPressed={handleSearch}
        />
        <Button disabled={isLoading} className="mt-6" onClick={handleSearch}>
          {isLoading ? "Searching..." : "Search"}
          <Search size={20} className="ml-2" />
        </Button>
      </div>

      {(message || isLoading) && (
        <div className="mt-8">
          {message && (
            <p className={`mb-3 text-sm font-semibold ${rows.length > 0 ? "text-blue-700" : "text-red-600"}`}>{message}</p>
          )}
          <LogisticTable columns={columns} rows={rows} isLoading={isLoading} />
        </div>
      )}
    </PageSkeleton>
  );
}
