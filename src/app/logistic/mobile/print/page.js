"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { pick } from "@/components/logistic/rowUtils";

/*
 * Legacy Mob/PdefInvoice.aspx -> Mob/PrintInvoiceDef_NSP.aspx ("Delivery Challan"):
 * header from invoicedetail1m(@PONum,@Type), lines from ChallanLinem(@PoNo,@Type).
 * (The ASC-copy iframe of the legacy page pointed to a file that does not exist in Mob/.)
 */
function Field({ label, value }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="min-w-36 font-semibold text-gray-700">{label}:</span>
      <span className="text-gray-900">{value || "-"}</span>
    </div>
  );
}

function MobileChallanPrint() {
  const searchParams = useSearchParams();
  const poNo = searchParams.get("poNo");
  const type = searchParams.get("type");

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!poNo || !type) {
      setError("Missing challan number or type.");
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const res = await axiosInstance.get("logistic/mobile/challans/print", { params: { poNo, type } });
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Failed to load challan.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [poNo, type]);

  if (isLoading) return <div className="p-8 text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  const h = data?.header || {};
  const lines = data?.lines || [];

  return (
    <div className="mx-auto max-w-5xl bg-white p-8 text-gray-900 print:p-0">
      <div className="mb-4 flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Print
        </button>
      </div>

      <div className="border-2 border-gray-800 p-6">
        <h1 className="text-center text-2xl font-bold">Delivery Challan</h1>
        <p className="mt-1 text-center text-sm font-semibold">{pick(h, "Ctype")}</p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <h2 className="mb-2 border-b font-bold">From (Service Center)</h2>
            <Field label="Name" value={pick(h, "asc_name")} />
            <Field label="Address" value={pick(h, "Address")} />
            <Field label="State" value={pick(h, "asc_state")} />
            <Field label="State Code" value={pick(h, "ASCSTateCode")} />
            <Field label="GSTIN" value={pick(h, "ASCGSt")} />
          </div>
          <div className="space-y-1">
            <h2 className="mb-2 border-b font-bold">Challan</h2>
            <Field label="DC Number" value={pick(h, "po")} />
            <Field label="DC Date" value={pick(h, "ddate")} />
            <Field label="Courier Name" value={pick(h, "DefPO_Crname")} />
            <Field label="Docket No." value={pick(h, "DefPO_SFDocNo")} />
            <Field label="Weight" value={pick(h, "CourierWeight")} />
            <Field label="Box Qty" value={pick(h, "BoxQty")} />
          </div>
          <div className="space-y-1">
            <h2 className="mb-2 border-b font-bold">Bill To</h2>
            <Field label="Name" value={pick(h, "NSPNAme")} />
            <Field label="Address" value={pick(h, "NSPAddress")} />
            <Field label="GSTIN" value={pick(h, "NSPGST")} />
          </div>
          <div className="space-y-1">
            <h2 className="mb-2 border-b font-bold">Ship To</h2>
            <Field label="Warehouse" value={pick(h, "whs1")} />
            <Field label="Address" value={pick(h, "cwhs1")} />
            <Field label="GSTIN" value={pick(h, "GST1")} />
            <Field label="State Code" value={pick(h, "whstat1")} />
          </div>
        </div>

        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              {["Sr. No.", "Ticket No.", "Part Code", "Description Of Goods", "HSN", "Qty. (Pcs.)", "Price", "Total", "Tax %"].map((t) => (
                <th key={t} className="border border-gray-400 px-2 py-1 text-left">{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr>
                <td colSpan={9} className="border border-gray-400 px-2 py-4 text-center text-gray-500">No lines</td>
              </tr>
            ) : (
              lines.map((line, i) => (
                <tr key={i}>
                  <td className="border border-gray-400 px-2 py-1">{i + 1}</td>
                  <td className="border border-gray-400 px-2 py-1">{pick(line, "Ticket_no")}</td>
                  <td className="border border-gray-400 px-2 py-1">{pick(line, "Def_Partcode")}</td>
                  <td className="border border-gray-400 px-2 py-1">{pick(line, "Def_PartDesc")}</td>
                  <td className="border border-gray-400 px-2 py-1">{pick(line, "HSN")}</td>
                  <td className="border border-gray-400 px-2 py-1">{pick(line, "qty")}</td>
                  <td className="border border-gray-400 px-2 py-1">{pick(line, "Price")}</td>
                  <td className="border border-gray-400 px-2 py-1">{pick(line, "Amount")}</td>
                  <td className="border border-gray-400 px-2 py-1">{pick(line, "Tax")}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={5} className="border border-gray-400 px-2 py-1 text-right">Total</td>
              <td className="border border-gray-400 px-2 py-1">{pick(h, "total")}</td>
              <td className="border border-gray-400 px-2 py-1" />
              <td className="border border-gray-400 px-2 py-1">{pick(h, "Totalval")}</td>
              <td className="border border-gray-400 px-2 py-1" />
            </tr>
          </tfoot>
        </table>

        <div className="mt-6 space-y-1 text-xs text-gray-700">
          <p>Goods Not For Sale/Resale/Return of Defective Parts Post Repair/Installation For Under Warranty</p>
          <p>Goods sold once will not be taken back.</p>
        </div>
      </div>
    </div>
  );
}

export default function LogisticMobilePrintPage() {
  return (
    <ProtectedRoute allowedRoles={["logistic"]}>
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <MobileChallanPrint />
      </Suspense>
    </ProtectedRoute>
  );
}
