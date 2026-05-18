"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import axiosInstance from "@/api/axiosInstance";

const Barcode = dynamic(() => import("react-barcode"), { ssr: false });

const HARD_TERMS = [
  "We reserve the right to recover the amount of this challan at any time.",
  "Warranty is on behalf of manufacturer of the product.",
  "Warranty is as per prevailing warranty policy of the company.",
  "Goods sold once will not be taken back.",
];

function formatMoney(n) {
  return Number(n)?.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PrintASC({ searchParams }) {
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
          challantype: challanType,
        });

        const lineRes = await axiosInstance.post("Print/fetch", {
          pono,
          Type: "ChallanLine",
          challantype: challanType,
        });
        const inv = invoiceRes.data?.data?.[0] || null;
        const lineItems = lineRes.data?.data || [];

        setInvoiceDetail(inv);
        setItems(lineItems);

        const total = lineItems.reduce((s, it) => s + Number(it.amount || 0), 0);
        const totalTax = lineItems.reduce(
          (s, it) =>
            s + (Number(it.price || 0) * Number(it.qty || 0) * Number(it.tax || 0)) / 100,
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

  const ascName = invoiceDetail.asC_Name || "ASC";
  const ascAddress = invoiceDetail.address || "-";
  const ascMobile = invoiceDetail.mobileno || "-";

  return (
    <div className="print-asc-page min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => window.print()}
        className="no-print mb-4 rounded border bg-white px-4 py-2 shadow-sm"
      >
        Print ASC
      </button>

      <article className="challan asc-copy border bg-white p-4 shadow-sm">
        <header className="relative mb-2 flex items-start justify-between border-b pb-2">
          <div className="flex-1">
            <Image
              src="/SansuiLogo.jpg"
              alt="SANSUI Logo"
              width={160}
              height={60}
              className="object-contain"
            />

            <div className="-mt-15 ml-40 text-center">
              <h2 className="text-lg font-semibold">Delivery Challan</h2>
              <div className="text-xs">
                Goods Not For Sale / Return of Defective Parts
              </div>
              <div className="mt-1 text-sm font-medium">
                {invoiceDetail?.ctype || "Defective Spare"}
              </div>
            </div>

            <div className="mt-20 text-sm">
              <strong>ASC Name:</strong> {ascName}
              <div className="mt-1">
                <strong>ASC Address: </strong>
                {ascAddress}
              </div>
              <div className="mt-1">
                <strong>State:</strong> {invoiceDetail.asC_State || "-"}
              </div>
            </div>
          </div>

          {/* ===== COPY TYPE SECTION (TOP-RIGHT) ===== */}
          <div className="absolute top-0 right-0 flex flex-col items-end space-y-1 text-xs">
            <div className="w-48 border border-gray-400 bg-gray-50 px-3 py-1 text-center font-medium">
              Original for Recipient
            </div>
            <div className="h-px w-32 self-center border-t-0 border-r border-b-0 border-l border-gray-400 bg-gray-400" />
            <div className="w-48 border border-gray-400 bg-gray-50 px-3 py-1 text-center font-medium">
              Duplicate for Transporter
            </div>
            <div className="h-px w-32 self-center border-t-0 border-r border-b-0 border-l border-gray-400 bg-gray-400" />
            <div className="w-48 border border-gray-400 bg-gray-50 px-3 py-1 text-center font-medium">
              Triplicate For Supplier
            </div>
          </div>

          {/* ===== RIGHT SIDE BOX ===== */}
          <div className="mt-28 ml-4 w-64 border p-2 text-sm">
            <div>
              <strong>GSTIN:</strong> {invoiceDetail.ascgSt || "-"}
            </div>
            <div>
              <strong>DCR Number:</strong> {invoiceDetail.po || "-"}
            </div>
            <div>
              <strong>DCR Date:</strong> {invoiceDetail.ddate || "-"}
            </div>
            <div>
              <strong>Shipment ID:</strong> {invoiceDetail.asc_shipid || "-"}
            </div>
            <div>
              <strong>State Code:</strong> {invoiceDetail.ascsTateCode || "0"}
            </div>
          </div>
        </header>

        {/* Address & Shipment Blocks */}
        <section className="mb-2 grid grid-cols-12 gap-4 text-sm">
          <div className="col-span-3 border p-2 text-xs">
            <div className="mb-1 font-semibold">Billed To</div>
            <div>
              <strong>Nsp Name: </strong>
              {invoiceDetail.nspName || "-"}
            </div>
            <div className="mt-1">
              <strong>Address: </strong>
              {invoiceDetail.nspAddress || "-"}
            </div>
            <div className="mt-1">
              <strong>GSTIN:</strong> {invoiceDetail.nspgst || "-"}
            </div>
            <div className="mt-1">
              <strong>State Code:</strong> {invoiceDetail.nspStatecode || "-"}
            </div>
          </div>

          <div className="col-span-6 border p-2 text-xs">
            <div className="mb-1 font-semibold">Shipped To</div>
            <div>
              <strong>Warehouse:</strong>
              {invoiceDetail.whs1}
            </div>
            <div className="mt-1">
              <strong>Address:</strong>
              {invoiceDetail.cwhs1}
            </div>
            <div className="mt-1">
              <strong>GSTIN:</strong> {invoiceDetail.gsT1 || "-"}
            </div>
            <div className="mt-1">
              <strong>State Code:</strong> {invoiceDetail.whstat1 || "-"}
            </div>
          </div>
          {/* 
          <div className="col-span-3 border p-2 text-xs">
            <strong>Shipped From</strong>
            <div className="mt-1">{ascName}</div>
            <div className="mt-1">{ascAddress}</div>
            <div className="mt-1"><strong>Mobile:</strong> {ascMobile}</div>
          </div> */}

          <div className="barcode-panel col-span-3 border p-2 text-xs">
            <div>
              <strong>LSP Name:</strong> {invoiceDetail.defPO_Crname || "-"}
            </div>
            <div>
              <strong>Weight:</strong> {invoiceDetail.courierWeight || "-"} gm
            </div>
            <div>
              <strong>Box Qty:</strong> {invoiceDetail.boxQty || "-"}
            </div>

            <div className="mt-2">
              <strong>Docket No:</strong> {invoiceDetail.defPO_SFDocNo || "-"}
            </div>

            <div className="barcode-wrap mt-2">
              <Barcode
                value={invoiceDetail.defPO_SFDocNo || "NA"}
                width={1.05}
                height={58}
                format="CODE128"
              />
            </div>

            {invoiceDetail.po && (
              <div className="barcode-wrap mt-2">
                <Barcode
                  value={invoiceDetail.po}
                  width={1.05}
                  height={58}
                  format="CODE128"
                />
              </div>
            )}
          </div>
        </section>

        {/* Items Table */}
        <table className="items-table mb-2 w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-[5%]" />
            <col className="w-[18%]" />
            <col className="w-[17%]" />
            <col className="w-[26%]" />
            <col className="w-[9%]" />
            <col className="w-[5%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[4%]" />
          </colgroup>
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
                <td className="border px-1 py-1 text-center">{i + 1}</td>
                <td className="border px-1 py-1 break-words">{it.ticket_no}</td>
                <td className="border px-1 py-1 break-words">{it.def_Partcode}</td>
                <td className="border px-1 py-1 break-words">{it.def_PartDesc}</td>
                <td className="border px-1 py-1 break-words">{it.hsn}</td>
                <td className="border px-1 py-1 text-center">{it.qty}</td>
                <td className="border px-1 py-1 text-right">{formatMoney(it.price)}</td>
                <td className="border px-1 py-1 text-right">{formatMoney(it.amount)}</td>
                <td className="border px-1 py-1 text-center">{it.tax}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="7" className="border px-2 py-1 text-right">
                Total Quantity: {invoiceDetail.total}
              </td>
              <td className="border px-2 py-1 text-right">{formatMoney(totals.total)}</td>
              <td className="border px-2 py-1" />
            </tr>
            <tr>
              <td colSpan="7" className="border px-2 py-1 text-right">
                Tax:
              </td>
              <td className="border px-2 py-1 text-right">
                {formatMoney(totals.totalTax)}
              </td>
              <td className="border px-2 py-1" />
            </tr>
            <tr>
              <td colSpan="7" className="border px-2 py-1 text-right font-bold">
                Grand Total:
              </td>
              <td className="border px-2 py-1 text-right font-bold">
                {formatMoney(totals.grandTotal)}
              </td>
              <td className="border px-2 py-1" />
            </tr>
          </tfoot>
        </table>

        {/* Terms */}
        <div className="terms-section mt-4 grid grid-cols-12 border text-xs">
          <div className="col-span-4 border-r p-3">
            <div className="mb-2 font-bold">Terms & Conditions:</div>
            {HARD_TERMS.map((t, idx) => (
              <div key={idx} className={idx ? "mt-2" : ""}>
                {t}
              </div>
            ))}
          </div>
          <div className="col-span-4 border-r p-3">
            <div className="mb-2">
              <strong>LSP Name</strong> ..................................................
            </div>
            <div className="mb-2">
              <strong>Pickup Boy Name</strong> ......................................
            </div>
            <div className="mb-2">
              <strong>Pickup Boy Mobile number</strong> .......................
            </div>
            <div className="mb-2">
              <strong>Number of Boxes Received</strong> ..................
            </div>
            <div className="mb-2">
              <strong>Pickup Date</strong> ..........................................
            </div>
            <div className="mb-2">
              <strong>Pickup Boy Signature</strong> ......................
            </div>
          </div>
          <div className="col-span-4 p-3 text-center text-xs">
            <div className="mb-2 font-bold">{ascName}</div>
            <div className="mt-30 font-semibold">(Authorized Signatory)</div>
          </div>
        </div>

        <div className="mt-3 text-center text-xs font-medium">
          This is Computer Generated Challan.
        </div>
      </article>

      <style jsx global>{`
        .print-asc-page,
        .print-asc-page * {
          box-sizing: border-box;
        }

        .print-asc-page .challan {
          width: min(100%, 190mm);
          margin: 0 auto;
          overflow: hidden;
        }

        .print-asc-page .barcode-panel {
          min-width: 0;
          overflow: hidden;
        }

        .print-asc-page .barcode-wrap {
          width: 100%;
          overflow: hidden;
          text-align: center;
        }

        .print-asc-page .barcode-wrap svg {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 0 auto;
        }

        .print-asc-page .items-table {
          page-break-inside: auto;
        }

        .print-asc-page .items-table th,
        .print-asc-page .items-table td {
          overflow-wrap: anywhere;
          word-break: break-word;
          vertical-align: middle;
        }

        .print-asc-page .items-table tr {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .print-asc-page .items-table thead {
          display: table-header-group;
        }

        .print-asc-page .items-table tfoot {
          display: table-row-group;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .print-asc-page .terms-section {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        @media print {
          @page {
            size: A4;
            margin: 8mm;
          }

          html,
          body {
            background: #fff !important;
          }

          .print-asc-page {
            min-height: auto !important;
            padding: 0 !important;
            background: #fff !important;
          }

          .print-asc-page .no-print {
            display: none !important;
          }

          .print-asc-page .challan {
            width: 100%;
            max-width: none;
            border-color: #000 !important;
            box-shadow: none !important;
            padding: 8mm !important;
            overflow: visible;
          }

          .print-asc-page .items-table {
            font-size: 10px;
          }

          .print-asc-page .items-table th,
          .print-asc-page .items-table td {
            border-color: #000 !important;
            padding: 3px 4px !important;
          }

          .print-asc-page .barcode-wrap svg {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
