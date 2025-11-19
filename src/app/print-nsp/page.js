"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axiosInstance from "@/api/axiosInstance";
import Image from "next/image";

const Barcode = dynamic(() => import("react-barcode"), { ssr: false });

const HARD_TERMS = [
  "We reserve the right to recover the amount of this challan at any time.",
  "Warranty is on behalf of manufacturer of the product.",
  "Warranty is as per prevailing warranty policy of the company.",
  "Goods sold once will not be taken back.",
];

function formatMoney(n) {
  return Number(n)?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PrintNSP({ searchParams }) {
  const pono = searchParams?.pono;

  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ total: 0, totalTax: 0, grandTotal: 0 });

  useEffect(() => {
    const challanType = searchParams?.challantype || "Defective";
    if (!pono) return;
    async function fetchData() {
      setLoading(true);
      try {
        const invoiceRes = await axiosInstance.post("Print/fetch", { 
            pono,
            Type: "invoicedetail",
            challantype: challanType
          });
          
          const lineRes = await axiosInstance.post("Print/fetch", { 
            pono, 
            Type: "ChallanLine",
            challantype: challanType
          });
        const inv = invoiceRes.data?.data?.[0] || null;
        const lineItems = lineRes.data?.data || [];

        setInvoiceDetail(inv);
        setItems(lineItems);

        const total = lineItems.reduce((s, it) => s + Number(it.amount || 0), 0);
        const totalTax = lineItems.reduce(
          (s, it) => s + (Number(it.price || 0) * Number(it.qty || 0) * Number(it.tax || 0)) / 100,
          0
        );
        setTotals({ total, totalTax, grandTotal: total + totalTax });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pono]);

  if (loading) return <div className="p-6 text-lg">Loading...</div>;
  if (!invoiceDetail) return <div className="p-6 text-red-500">No Data Found</div>;

  const nspName = invoiceDetail.nspName || invoiceDetail.whs || "NSP";
  const nspAddress = invoiceDetail.nspAddress || invoiceDetail.cwhs || "-";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => window.print()}
        className="px-4 py-2 border rounded bg-white shadow-sm mb-4"
      >
        Print NSP
      </button>

      <article className="challan nsp-copy bg-white border p-4 shadow-sm">
      <header className="flex justify-between items-start border-b pb-2 mb-2 relative">
  <div className="flex-1">
    <Image src="/SansuiLogo.jpg" alt="SANSUI Logo" width={160} height={60} className="object-contain" />

    <div className="text-center ml-40 -mt-15">
      <h2 className="text-lg font-semibold">Delivery Challan</h2>
      <div className="text-xs">Goods Not For Sale / Return of Defective Parts</div>
      <div className="text-sm font-medium mt-1">
        {invoiceDetail?.ctype || "Defective Spare"}
      </div> 
    </div>

    <div className="mt-20 text-sm">
      <strong>NSP Name:</strong> {nspName}
      <div className="mt-1"><strong>Address: </strong>{nspAddress}</div>
      <div className="mt-1"><strong>State:</strong> {invoiceDetail.nSpState || "-"}</div>
    </div>
  </div>

  {/* ADDED COPY TYPE SECTION (positioned above GST box) */}
  <div className="flex flex-col items-end text-xs absolute top-0 right-0 space-y-1">
    <div className="border border-gray-400 px-3 py-1 w-48 text-center bg-gray-50 font-medium">
      Original for Recipient
    </div>
    <div className="border-l border-gray-400 w-32 self-center border-r border-t-0 border-b-0 h-px bg-gray-400" />
    <div className="border border-gray-400 px-3 py-1 w-48 text-center bg-gray-50 font-medium">
      Duplicate for Transporter
    </div>
    <div className="border-l border-gray-400 w-32 self-center border-r border-t-0 border-b-0 h-px bg-gray-400" />
    <div className="border border-gray-400 px-3 py-1 w-48 text-center bg-gray-50 font-medium">
      Triplicate For Supplier
    </div>
  </div>

  {/* EXISTING NSP INFO BOX */}
  <div className="w-64 ml-4 border p-2 text-sm mt-30">
    <div><strong>GSTIN:</strong> {invoiceDetail.nspgst || "-"}</div>
    <div><strong>DCR Number:</strong> {invoiceDetail.invno || "-"}</div>
    <div><strong>DCR Date:</strong> {invoiceDetail.invdate || "-"}</div>
    <div><strong>Shipment ID:</strong> {invoiceDetail.defPO_SFDocNo || "-"}</div>
    <div><strong>State Code:</strong> {invoiceDetail.nspStatecode || "-"}</div>
  </div>
</header>

        {/* Address & Shipment Blocks */}
        <section className="grid grid-cols-12 gap-4 text-sm mb-2">
          <div className="col-span-3 border p-2 text-xs">
            <div className="font-semibold mb-1">Billed To</div>
            <div>{invoiceDetail.whs || "-"}</div>
            <div className="mt-1">{invoiceDetail.cwhs || "-"}</div>
            <div className="mt-1"><strong>GSTIN:</strong> {invoiceDetail.gst || "-"}</div>
            <div className="mt-1"><strong>State Code:</strong> {invoiceDetail.whstat || "-"}</div>
          </div>

          <div className="col-span-3 border p-2 text-xs">
            <div className="font-semibold mb-1">Shipped To</div>
            <div>{invoiceDetail.whs1 || nspName}</div>
            <div className="mt-1">{invoiceDetail.cwhs1 || nspAddress}</div>
            <div className="mt-1">GSTIN: {invoiceDetail.gsT1 || "-"}</div>
            <div className="mt-1">State Code: {invoiceDetail.whstat1 || "-"}</div>
          </div>

          <div className="col-span-3 border p-2 text-xs">
            <strong>Shipped From</strong>
            <div className="mt-1">{invoiceDetail.asC_Name || "-"}</div>
            <div className="mt-1">{invoiceDetail.address || "-"}</div>
            <div className="mt-1"><strong>ASC Challan reference:</strong> {invoiceDetail.po || "-"}</div>
            <div className="mt-1">GSTIN: {invoiceDetail.ascgSt || "-"}</div>
            <div className="mt-1">State Code: {invoiceDetail.ascsTateCode || "-"}</div>
          </div>

          <div className="col-span-3 border p-2 text-xs">
            <div><strong>LSP Name:</strong> {invoiceDetail.defPO_Crname || "-"}</div>
            <div><strong>Weight:</strong> {invoiceDetail.courierWeight || "-"} gm</div>
            <div><strong>Box Qty:</strong> {invoiceDetail.boxQty || "-"}</div>
            <div className="mt-2"><strong>Docket No:</strong> {invoiceDetail.defPO_SFDocNo || "-"}</div>
            <div className="mt-2">
              <Barcode value={invoiceDetail.defPO_SFDocNo || "NA"} width={1.2} height={48} format="CODE128" />
            </div>
          </div>
        </section>

        {/* Items Table */}
        <table className="w-full border-collapse text-sm mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Sr</th>
              <th className="border px-2 py-1">Ticket No</th>
              <th className="border px-2 py-1">Part Code</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">HSN</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Tax %</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{i + 1}</td>
                <td className="border px-2 py-1">{it.ticket_no}</td>
                <td className="border px-2 py-1">{it.def_Partcode}</td>
                <td className="border px-2 py-1">{it.def_PartDesc}</td>
                <td className="border px-2 py-1">{it.hsn}</td>
                <td className="border px-2 py-1">{it.qty}</td>
                <td className="border px-2 py-1 text-right">{formatMoney(it.price)}</td>
                <td className="border px-2 py-1 text-right">{formatMoney(it.amount)}</td>
                <td className="border px-2 py-1">{it.tax}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="7" className="border px-2 py-1 text-right">Total Quantity: {invoiceDetail.total}</td>
              <td className="border px-2 py-1 text-right">{formatMoney(totals.total)}</td>
            </tr>
            <tr>
              <td colSpan="7" className="border px-2 py-1 text-right">Tax:</td>
              <td className="border px-2 py-1 text-right">{formatMoney(totals.totalTax)}</td>
            </tr>
            <tr>
              <td colSpan="7" className="border px-2 py-1 text-right font-bold">Grand Total:</td>
              <td className="border px-2 py-1 text-right font-bold">{formatMoney(totals.grandTotal)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Terms */}
        <div className="grid grid-cols-12 mt-4 border text-xs">
          <div className="col-span-4 border-r p-3">
            <div className="font-bold mb-2">Terms & Conditions:</div>
            {HARD_TERMS.map((t, idx) => <div key={idx} className={idx ? "mt-2" : ""}>{t}</div>)}
          </div>
          <div className="col-span-4 border-r p-3">
            <div className="mb-2"><strong>LSP Name</strong> ..................................................</div>
            <div className="mb-2"><strong>Pickup Boy Name</strong> ......................................</div>
            <div className="mb-2"><strong>Pickup Boy Mobile number</strong> .......................</div>
            <div className="mb-2"><strong>Number of Boxes Received</strong> ..................</div>
            <div className="mb-2"><strong>Pickup Date</strong> ..........................................</div>
            <div className="mb-2"><strong>Pickup Boy Signature</strong> ......................</div>
          </div>
          <div className="col-span-4 text-center p-3 text-xs">
            <div className="font-bold mb-2">{nspName}</div>
            <div className="mt-30 font-semibold">(Authorized Signatory)</div>
          </div>
        </div>

        <div className="text-center mt-3 text-xs font-medium">This is Computer Generated Challan.</div>
       
      </article>
    </div>
  );
}
