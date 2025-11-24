

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axiosInstance from "@/api/axiosInstance";
import Image from "next/image";

const Barcode = dynamic(() => import("react-barcode"), { ssr: false });

/** Hardcoded terms (kept exactly as requested) */
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

/**
 * ============================
 * Small reusable sub-components
 * ============================
 */

function AscRightBox({ invoiceDetail }) {
  return (
    <div className="w-64 ml-4">
      
      <div className="border p-2 text-sm">
        <div><strong>GSTIN:</strong> {invoiceDetail.ascgst || "-"}</div>
        <div><strong>DCR Number:</strong> {invoiceDetail.asc_dcrno || "-"}</div>
        <div><strong>DCR Date:</strong> {invoiceDetail.asc_dcrdate || "-"}</div>
        <div><strong>Shipment ID:</strong> {invoiceDetail.asc_shipid || "-"}</div>
      </div>
    </div>
  );
}

function NspRightBox({ invoiceDetail }) {
  return (
    <div className="w-64 ml-4">
      <div className="border p-2 text-sm">
        <div><strong>GSTIN:</strong> {invoiceDetail.nspgst || "-"}</div>
        <div><strong>DCR Number:</strong> {invoiceDetail.invno || "-"}</div>
        <div><strong>DCR Date:</strong> {invoiceDetail.invdate || "-"}</div>
        <div><strong>Shipment ID:</strong> {invoiceDetail.defPO_SFDocNo || "-"}</div>
      </div>
    </div>
  );
}

function TermsBlock({ terms = HARD_TERMS }) {
  return (
    <div className="col-span-4 border-r p-3 text-xs">
      <div className="font-bold mb-2">Terms & Conditions:</div>
      {terms.map((t, idx) => (
        <div key={idx} className={idx === 0 ? "" : "mt-2"}>
          {t}
        </div>
      ))}
    </div>
  );
}

function PickupBlock() {
  return (
    <div className="col-span-4 border-r p-3 text-xs">
      <div className="mb-2"><strong>LSP Name</strong> ..........................................................</div>
      <div className="mb-2"><strong>Pickup Boy Name</strong> ............................................</div>
      <div className="mb-2"><strong>Pickup Boy Mobile number</strong> ............................</div>
      <div className="mb-2"><strong>Number of Boxes Received</strong> .......................</div>
      <div className="mb-2"><strong>Pickup Date</strong> ....................................................</div>
      <div className="mb-2"><strong>Pickup Boy Signature</strong> ...............................</div>
    </div>
  );
}

function SignatoryBlock({ name }) {
  return (
    <div className="col-span-4 p-3 text-center text-xs">
      <div className="font-bold mb-2">{name}</div>
      <div className="mt-10 font-semibold">(Authorized Signatory)</div>
    </div>
  );
}

/**
 * ============================
 * ASC and NSP components (receive data via props)
 * ============================
 */

export function ChallanASC({ invoiceDetail, items, total, totalTax, grandTotal }) {
  const ascName = invoiceDetail.asC_Name || "ASC";
  const ascAddress = invoiceDetail.address || "-";
  const ascMobile = invoiceDetail.mobileno || "-";

  // shippedTo (ASC view)
  const shippedTo = {
    name: ascName,
    address: ascAddress,
    extra: `Mobile: ${ascMobile}`,
  };

  return (
    <article className="challan asc-copy bg-white border p-4 shadow-sm">
      <header className="flex justify-between items-start border-b pb-2 mb-2">
        <div className="flex-1">
          <Image
            src="/SansuiLogo.jpg"
            alt="SANSUI Logo"
            width={160}
            height={60}
            className="object-contain"
          />

          <div className="text-center">
            <h2 className="text-lg font-semibold">Delivery Challan</h2>
            <div className="text-xs">Goods Not For Sale / Return of Defective Parts</div>
            <div className="text-sm font-medium mt-1">{invoiceDetail?.ctype || "Defective Spare"}</div>
          </div>

          <div className="mt-3 text-sm">
            <strong>Copy Type: </strong><span className="font-bold">ASC COPY</span>
          </div>

          <div className="mt-3 text-sm">
            <strong>ASC Name:</strong> {shippedTo.name}
            <div className="mt-1">{shippedTo.address}</div>
            <div className="mt-1"><strong>State:</strong> {invoiceDetail.asC_State || "-"}</div>
          </div>
        </div>

        <AscRightBox invoiceDetail={invoiceDetail} />
      </header>

      {/* ADDRESS BLOCKS */}
      <section className="grid grid-cols-12 gap-4 text-sm mb-2">
        <div className="col-span-3 border p-2 text-xs">
          <div className="font-semibold mb-1">Billed To</div>
          <div>{invoiceDetail.whs1 || "-"}</div>
          <div className="mt-1">{invoiceDetail.cwhs1 || "-"}</div>
          <div className="mt-1"><strong>GSTIN:</strong> {invoiceDetail.gsT1 || "-"}</div>
        </div>

        <div className="col-span-3 border p-2 text-xs">
          <div className="font-semibold mb-1">Shipped To</div>
          <div>{shippedTo.name}</div>
          <div className="mt-1">{shippedTo.address}</div>
          <div className="mt-1">{shippedTo.extra}</div>
        </div>

        <div className="col-span-3 border p-2 text-xs">
          <strong>Shipped From</strong>
          <div className="mt-1">{ascName}</div>
          <div className="mt-1">{ascAddress}</div>
          <div className="mt-1"><strong>Mobile:</strong> {ascMobile}</div>
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

      {/* ITEMS TABLE */}
      <ItemsTable items={items} total={total} totalTax={totalTax} grandTotal={grandTotal} />

      {/* TERMS / PICKUP / SIGNATORY */}
      <section className="grid grid-cols-12 mt-4 border text-xs">
        <TermsBlock />
        <PickupBlock />
        <SignatoryBlock name={ascName} />
      </section>

      <div className="text-center mt-3 text-xs font-medium">This is Computer Generated Challan.</div>
      <div className="text-right text-xs mt-2">ASC COPY</div>
    </article>
  );
}

export function ChallanNSP({ invoiceDetail, items, total, totalTax, grandTotal }) {
  const nspName = invoiceDetail.nspName || invoiceDetail.whs || "NSP";
  const nspAddress = invoiceDetail.nspAddress || invoiceDetail.cwhs || "-";

  const shippedTo = {
    name: invoiceDetail.whs || nspName,
    address: invoiceDetail.cwhs || nspAddress,
    extra: `GSTIN: ${invoiceDetail.gst || "-"}`,
  };

  return (
    <article className="challan nsp-copy bg-white border p-4 shadow-sm">
      <header className="flex justify-between items-start border-b pb-2 mb-2">
        <div className="flex-1">
          <Image
            src="/SansuiLogo.jpg"
            alt="SANSUI Logo"
            width={160}
            height={60}
            className="object-contain"
          />

          <div className="text-center">
            <h2 className="text-lg font-semibold">Delivery Challan</h2>
            <div className="text-xs">Goods Not For Sale / Return of Defective Parts</div>
            <div className="text-sm font-medium mt-1">{invoiceDetail?.ctype || "Defective Spare"}</div>
          </div>

          <div className="mt-3 text-sm">
            <strong>Copy Type: </strong><span className="font-bold">NSP COPY</span>
          </div>

          <div className="mt-3 text-sm">
            <strong>NSP Name:</strong> {nspName}
            <div className="mt-1">{nspAddress}</div>
            <div className="mt-1"><strong>State:</strong> {invoiceDetail.nSpState || "-"}</div>
            {invoiceDetail.gst && <div className="mt-1"><strong>GSTIN:</strong> {invoiceDetail.gst}</div>}
          </div>
        </div>

        <NspRightBox invoiceDetail={invoiceDetail} />
      </header>

      {/* ADDRESS BLOCKS */}
      <section className="grid grid-cols-12 gap-4 text-sm mb-2">
        <div className="col-span-3 border p-2 text-xs">
          <div className="font-semibold mb-1">Billed To</div>
          <div>{invoiceDetail.whs1 || "-"}</div>
          <div className="mt-1">{invoiceDetail.cwhs1 || "-"}</div>
          <div className="mt-1"><strong>GSTIN:</strong> {invoiceDetail.gsT1 || "-"}</div>
        </div>

        <div className="col-span-3 border p-2 text-xs">
          <div className="font-semibold mb-1">Shipped To</div>
          <div>{shippedTo.name}</div>
          <div className="mt-1">{shippedTo.address}</div>
          <div className="mt-1">{shippedTo.extra}</div>
        </div>

        <div className="col-span-3 border p-2 text-xs">
          <strong>Shipped From</strong>
          <div className="mt-1">{invoiceDetail.asC_Name || "-"}</div>
          <div className="mt-1">{invoiceDetail.address || "-"}</div>
          <div className="mt-1"><strong>Mobile:</strong> {invoiceDetail.mobileno || "-"}</div>
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

      <ItemsTable items={items} total={total} totalTax={totalTax} grandTotal={grandTotal} />

      <section className="grid grid-cols-12 mt-4 border text-xs">
        <TermsBlock />
        <PickupBlock />
        <SignatoryBlock name={invoiceDetail.nspName || "NSP"} />
      </section>

      <div className="text-center mt-3 text-xs font-medium">This is Computer Generated Challan.</div>
      <div className="text-right text-xs mt-2">NSP COPY</div>
    </article>
  );
}

/**
 * Shared items table
 */
function ItemsTable({ items, total, totalTax, grandTotal }) {
  return (
    <section className="mb-2">
      <table className="w-full border-collapse text-sm">
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
            <td colSpan="7" className="border px-2 py-1 text-right">Total:</td>
            <td className="border px-2 py-1 text-right">{formatMoney(total)}</td>
          </tr>
          <tr>
            <td colSpan="7" className="border px-2 py-1 text-right">Tax:</td>
            <td className="border px-2 py-1 text-right">{formatMoney(totalTax)}</td>
          </tr>
          <tr>
            <td colSpan="7" className="border px-2 py-1 text-right font-bold">Grand Total:</td>
            <td className="border px-2 py-1 text-right font-bold">{formatMoney(grandTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}

/**
 * ============================
 * Main page component - fetches data and passes as props (Option B)
 * ============================
 */

export default function PrintChallanPage({ searchParams }) {
  const pono = searchParams?.pono;
  const challanType = searchParams?.challanType || "Defective";

  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // totals stored here so we compute once and pass down
  const [totals, setTotals] = useState({
    total: 0,
    totalTax: 0,
    grandTotal: 0,
  });

  useEffect(() => {
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
          (s, it) => s + (Number(it.price || 0) * Number(it.qty || 0) * Number(it.tax || 0)) / 100,
          0
        );
        setTotals({ total, totalTax, grandTotal: total + totalTax });
      } catch (err) {
        console.error("Error Fetching Print Challan: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [pono]);

  if (loading) return <div className="p-6 text-lg">Loading...</div>;
  if (!invoiceDetail) return <div className="p-6 text-red-500">No Data Found</div>;

  // Print helpers: set data-print attribute on <html> so media-print CSS can hide/show
  function setPrintTarget(target) {
    // target: 'asc' | 'nsp' | 'all'
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-print", target);
    // give browser a moment to apply attribute before print
    setTimeout(() => {
      window.print();
      // remove attribute after slight delay to avoid affecting other UI
      setTimeout(() => document.documentElement.removeAttribute("data-print"), 200);
    }, 50);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setPrintTarget("asc")}
          className="px-4 py-2 border rounded bg-white shadow-sm"
        >
          Print ASC Only
        </button>

        <button
          onClick={() => setPrintTarget("nsp")}
          className="px-4 py-2 border rounded bg-white shadow-sm"
        >
          Print NSP Only
        </button>

        {/* <button
          onClick={() => setPrintTarget("all")}
          className="px-4 py-2 border rounded bg-white shadow-sm"
        >
          Print Both
        </button> */}
      </div>

      <div className="flex flex-col gap-10">
        <ChallanASC
          invoiceDetail={invoiceDetail}
          items={items}
          total={totals.total}
          totalTax={totals.totalTax}
          grandTotal={totals.grandTotal}
        />

        <div style={{ pageBreakAfter: "always" }} />

        <ChallanNSP
          invoiceDetail={invoiceDetail}
          items={items}
          total={totals.total}
          totalTax={totals.totalTax}
          grandTotal={totals.grandTotal}
        />
      </div>

      {/* PRINT CSS */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 12mm;
        }

        /* default: when printing without data-print attribute — show both */
        @media print {
          /* hide the on-screen print buttons */
          button { display: none !important; }

          /* if attribute set to asc → hide nsp copy */
          html[data-print="asc"] .nsp-copy { display: none !important; }
          html[data-print="asc"] .asc-copy { display: block !important; }

          /* if attribute set to nsp → hide asc copy */
          html[data-print="nsp"] .asc-copy { display: none !important; }
          html[data-print="nsp"] .nsp-copy { display: block !important; }

          /* if attribute set to all → show both (default) */
          html[data-print="all"] .asc-copy,
          html[data-print="all"] .nsp-copy { display: block !important; }

          /* ensure print uses exact colors where possible */
          body { -webkit-print-color-adjust: exact; color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
