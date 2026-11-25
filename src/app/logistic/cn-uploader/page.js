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

import axiosInstance from "@/api/axiosInstance";
import LogisticTable from "@/components/logistic/LogisticTable";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import LogisticExcelUploader from "@/components/logistic/LogisticExcelUploader";
import { exportToExcel } from "@/utils/exportToExcel";

const EXPECTED_HEADERS = ["CNno", "dispatchWarehouse", "docketNo", "dispatchstatus"];

export default function CnUploaderPage() {
  const [ticketNo, setTicketNo] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(e) {
    e?.preventDefault();
    try {
      setIsLoading(true);
      setHasSearched(true);
      const res = await axiosInstance.post("logistic/cn/process", {
        type: "search",
        ticketNo: ticketNo.trim(),
      });
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setRows(data);
      setColumns(data.length > 0 ? Object.keys(data[0]).map((key) => ({ key, label: key })) : []);
    } catch (error) {
      toast.error(error?.response?.data?.statusMsg || "Failed to load CN data");
      setRows([]);
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleExport() {
    if (rows.length === 0) {
      toast.error("No data to export");
      return;
    }
    try {
      exportToExcel({
        data: rows,
        headers: columns.map((c) => ({ label: c.label, key: c.key })),
        fileName: "CN Logistic.xlsx",
        sheetName: "Sheet1",
      });
    } catch (error) {
      toast.error("Export failed");
    }
  }

  return (
    <PageSkeleton title="CN Logistic Uploader" rolesAllowed={["logistic"]} backHref="/logistic/uploaders">
      <LogisticExcelUploader
        title="Upload CN Dispatch Sheet"
        expectedHeaders={EXPECTED_HEADERS}
        endpoint="logistic/cn/process"
        payloadType="upload"
        sampleFileName="CNLogistic.xlsx"
        mapRow={(get) => ({
          CNno: get("CNno"),
          DispatchWarehouse: get("dispatchWarehouse"),
          DocketNo: get("docketNo"),
          DispatchStatus: get("dispatchstatus"),
        })}
        isRowEmpty={(r) => !r.CNno && !r.DispatchWarehouse && !r.DocketNo && !r.DispatchStatus}
        onUploaded={() => hasSearched && handleSearch()}
      />

      <div className="mt-10">
        <Subheading title="Search" />
        <div className="flex flex-wrap items-start gap-6">
          <InputField
            label="Enter Job"
            type="text"
            placeholder="Ticket no. (blank = all CNs)"
            className="w-xs"
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value)}
            onEnterKeyPressed={handleSearch}
          />
          <Button className="mt-6" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
          <Button className="mt-6" variant="outline" onClick={handleExport} disabled={isLoading || rows.length === 0}>
            Export To Excel
          </Button>
        </div>
      </div>

      {hasSearched && (
        <div className="mt-6">
          <LogisticTable columns={columns.length ? columns : [{ key: "_", label: "Result" }]} rows={rows} isLoading={isLoading} />
        </div>
      )}
    </PageSkeleton>
  );
}
