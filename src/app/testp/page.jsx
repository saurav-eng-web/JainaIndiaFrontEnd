// "use client";

// import React from "react";
// import dynamic from "next/dynamic";

// // react-barcode is browser-only; dynamically import it with ssr: false
// const Barcode = dynamic(() => import("react-barcode"), { ssr: false });

// /** --- Mock JSON data (replace with real source when ready) --- */
// const mockData = {
//   issuer: {
//     logoText: "SANSUI",
//     nspName: "VSAT Refurb Solutions Private Limited",
//     addressLine1: "SF, C-134, PHASE-2, MAYA PURI, West Delhi, Delhi, 110064",
//     state: "Delhi",
//     gstin: "07AAFCV9438H1ZW",
//   },
//   billedTo: {
//     name: "Jaina India Pvt.Ltd.",
//     address:
//       "066, Part of Shed No. 4, Udyog Vihar, Old Kasana Road, Udyog Vihar, Greater Noida, Gautambuddha Nagar, Uttar Pradesh-201306, India",
//     gstin: "09AADCJ3491J1Z8",
//     stateCode: "09",
//   },
//   shippedTo: {
//     name: "Jaina India Pvt. Ltd. - (MH-SERVI-S)",
//     address:
//       "C/O RELAY EXPRESS PVT LTD, RK Logi World Complex, W No.F, Vill-Yelavi Near Shawaya Dhaba, Nashik Road Bhiwandi Maharashtra-421302, India",
//     gstin: "27AADCJ3491J1ZA",
//     stateCode: "27",
//   },
//   asc: {
//     name: "Vedant Services",
//     address:
//       "402 GURUKRIPA BUILDING OPPOSITE HOTEL SETALIGHT DIKSHIT ROAD VILE PARE EAST Mobile: 9820278616 Mumbai Maharashtra-400057",
//     gstin: "27AYYPC3649M1ZM",
//     ref: "DFS-25103182571",
//     dcrDate: "31/10/2025",
//   },
//   meta: {
//     docketNo: "S9560656",
//     shipmentId: "",
//     weight: "8000 gm.",
//     boxQty: 1,
//   },
//   items: [
//     {
//       sr: 1,
//       ticketNo: "MHVL25101819973VS",
//       partCode: "SOBTVSVFUPNLPL001",
//       description: "LED Panel (BOE)",
//       hsn: "85299090",
//       qty: 1,
//       price: 44344.0,
//       taxPercent: 18,
//     },
//     {
//       sr: 2,
//       ticketNo: "MHVL25101819973VS",
//       partCode: "SSNTVSVFUPCMGB005",
//       description: 'Safety Box 65"',
//       hsn: "48191010",
//       qty: 1,
//       price: 4761.25,
//       taxPercent: 18,
//     },
//   ],
//   terms: [
//     "We reserve the right to recover the amount of this challan at any time.",
//     "Warranty is on behalf of manufacturer of the product.",
//     "Warranty is as per prevailing warranty policy of the company.",
//     "Goods sold once will not be taken back.",
//   ],
// };

// /** currency format helper */
// function formatMoney(n) {
//   return n?.toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// }

// export default function PrintChallanPage() {
//   const data = mockData;

//   const total = data.items.reduce((s, it) => s + it.price * it.qty, 0);
//   const totalTax = data.items.reduce(
//     (s, it) => s + (it.price * it.qty * it.taxPercent) / 100,
//     0,
//   );
//   const grandTotal = total + totalTax;

//   // two copies per page (top + bottom)
//   const copies = [0, 1];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="mb-4">
//         <button
//           onClick={() => window.print()}
//           className="rounded border bg-white px-4 py-2 text-sm shadow-sm hover:shadow"
//         >
//           Print / Save as PDF
//         </button>
//       </div>

//       <div className="flex flex-col gap-8">
//         {copies.map((c) => (
//           <article
//             key={c}
//             className="challan border border-gray-200 bg-white p-4 shadow-sm print:border-none print:shadow-none"
//             style={{ pageBreakAfter: c === 0 ? "always" : "auto" }}
//           >
//             <header className="relative mb-2 flex items-start justify-between border-b pb-2">
//               <div className="flex-1">
//                 <div className="text-3xl font-bold text-red-600">
//                   {data.issuer.logoText}
//                 </div>
//                 <div className="text-center">
//                   <h2 className="text-lg font-semibold">Delivery Challan</h2>
//                   <div className="text-xs">
//                     Goods Not For Sale/Resale/Return of Defective Parts Post
//                     Repair/Installation For Under Warranty
//                   </div>
//                   <div className="mt-1 text-sm font-medium">
//                     Defective Spare
//                   </div>
//                 </div>

//                 <div className="mt-3 text-sm">
//                   <div>
//                     <strong>NSP Name:</strong> {data.issuer.nspName}
//                   </div>
//                   <div>{data.issuer.addressLine1}</div>
//                   <div>
//                     <strong>State:</strong> {data.issuer.state}
//                   </div>
//                 </div>
//               </div>

//               {/* NEW BLOCK (placed above the existing box) */}
//               <div className="absolute top-0 right-0 flex flex-col items-end space-y-1 text-xs">
//                 <div className="w-48 border border-gray-400 bg-gray-50 px-3 py-1 text-center font-medium">
//                   Original for Recipient
//                 </div>
//                 <div className="h-px w-32 self-center border-t-0 border-r border-b-0 border-l border-gray-400 bg-gray-400" />
//                 <div className="w-48 border border-gray-400 bg-gray-50 px-3 py-1 text-center font-medium">
//                   Duplicate for Transporter
//                 </div>
//                 <div className="h-px w-32 self-center border-t-0 border-r border-b-0 border-l border-gray-400 bg-gray-400" />
//                 <div className="w-48 border border-gray-400 bg-gray-50 px-3 py-1 text-center font-medium">
//                   Triplicate For Supplier
//                 </div>
//               </div>

//               {/* YOUR ORIGINAL BOX (kept same, placed below) */}
//               <div className="ml-4 w-64 border p-2 text-sm">
//                 <div>
//                   <strong>GSTIN:</strong> {invoiceDetail.nspgst || "-"}
//                 </div>
//                 <div>
//                   <strong>DCR Number:</strong> {invoiceDetail.invno || "-"}
//                 </div>
//                 <div>
//                   <strong>DCR Date:</strong> {invoiceDetail.invdate || "-"}
//                 </div>
//                 <div>
//                   <strong>Shipment ID:</strong>{" "}
//                   {invoiceDetail.defPO_SFDocNo || "-"}
//                 </div>
//                 <div>
//                   <strong>State Code:</strong>{" "}
//                   {invoiceDetail.nspStatecode || "-"}
//                 </div>
//               </div>
//             </header>

//             {/* ADDRESS ROW */}
//             <section className="mb-2 grid grid-cols-12 gap-4 text-sm">
//               <div className="col-span-3">
//                 <div className="mt-15 min-h-[110px] border p-2">
//                   <div className="mb-1 font-semibold">Billed To</div>
//                   <div className="text-xs">{data.billedTo.name}</div>
//                   <div className="mt-1 text-xs">{data.billedTo.address}</div>
//                   <div className="mt-2">
//                     <strong>GSTIN :</strong> {data.billedTo.gstin}
//                   </div>
//                 </div>
//               </div>

//               <div className="col-span-3">
//                 <div className="mt-15 min-h-[110px] border p-2">
//                   <div className="mb-1 font-semibold">Shipped To</div>
//                   <div className="text-xs">{data.shippedTo.name}</div>
//                   <div className="mt-1 text-xs">{data.shippedTo.address}</div>
//                   <div className="mt-2">
//                     <strong>GSTIN :</strong> {data.shippedTo.gstin}
//                   </div>
//                 </div>
//               </div>

//               <div className="col-span-3">
//                 <div className="mt-15 border p-2 text-sm">
//                   <div className="font-semibold">Shipped From</div>
//                   <div className="mt-1 text-xs">{data.asc.name}</div>
//                   <div className="mt-1 text-xs">{data.asc.address}</div>
//                   <div className="mt-1">
//                     <strong>ASC Ref:</strong> {data.asc.ref}
//                   </div>
//                 </div>
//               </div>
//               <div className="col-span-3">
//                 <div className="border p-2 text-sm">
//                   <div className="flex flex-col items-start">
//                     <div>
//                       <strong>LSP Name</strong>
//                       <div className="font-medium">Skybird002</div>
//                     </div>
//                     <div className="mt-1">
//                       <strong>Weight</strong>
//                       <div className="font-medium">{data.meta.weight}</div>
//                     </div>
//                     <div className="mt-1">
//                       <strong>Box Qty</strong>
//                       <div className="font-medium">{data.meta.boxQty}</div>
//                     </div>
//                     <div className="mt-2">
//                       <strong>Docket No.</strong>
//                       <div className="font-medium">{data.meta.docketNo}</div>
//                     </div>
//                     <div className="mt-2">
//                       {/* Real code128 barcode (react-barcode) */}
//                       <Barcode
//                         value={data.meta.docketNo}
//                         format="CODE128"
//                         width={1.2}
//                         height={48}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* ITEMS TABLE */}
//             <section className="mb-2">
//               <table className="w-full border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border px-2 py-1 text-left">Sr. No.</th>
//                     <th className="border px-2 py-1 text-left">Ticket No.</th>
//                     <th className="border px-2 py-1 text-left">Part Code</th>
//                     <th className="border px-2 py-1 text-left">
//                       Description Of Goods
//                     </th>
//                     <th className="border px-2 py-1 text-left">HSN</th>
//                     <th className="border px-2 py-1 text-right">Qty. (Pcs.)</th>
//                     <th className="border px-2 py-1 text-right">Price</th>
//                     <th className="border px-2 py-1 text-right">Total</th>
//                     <th className="border px-2 py-1 text-right">Tax %</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.items.map((it) => (
//                     <tr key={it.sr}>
//                       <td className="border px-2 py-1">{it.sr}</td>
//                       <td className="border px-2 py-1">{it.ticketNo}</td>
//                       <td className="border px-2 py-1">{it.partCode}</td>
//                       <td className="border px-2 py-1">{it.description}</td>
//                       <td className="border px-2 py-1">{it.hsn}</td>
//                       <td className="border px-2 py-1 text-right">{it.qty}</td>
//                       <td className="border px-2 py-1 text-right">
//                         {formatMoney(it.price)}
//                       </td>
//                       <td className="border px-2 py-1 text-right">
//                         {formatMoney(it.price * it.qty)}
//                       </td>
//                       <td className="border px-2 py-1 text-right">
//                         {it.taxPercent}%
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>

//                 <tfoot>
//                   <tr>
//                     <td
//                       colSpan="7"
//                       className="border px-2 py-1 text-right font-semibold"
//                     >
//                       Total:
//                     </td>
//                     <td className="border px-2 py-1 text-right font-semibold">
//                       {formatMoney(total)}
//                     </td>
//                     <td className="border px-2 py-1"></td>
//                   </tr>
//                   <tr>
//                     <td colSpan="7" className="border px-2 py-1 text-right">
//                       Tax:
//                     </td>
//                     <td className="border px-2 py-1 text-right">
//                       {formatMoney(totalTax)}
//                     </td>
//                     <td className="border px-2 py-1"></td>
//                   </tr>
//                   <tr>
//                     <td
//                       colSpan="7"
//                       className="border px-2 py-1 text-right font-bold"
//                     >
//                       Grand Total:
//                     </td>
//                     <td className="border px-2 py-1 text-right font-bold">
//                       {formatMoney(grandTotal)}
//                     </td>
//                     <td className="border px-2 py-1"></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </section>

//             {/* TERMS & SIGNATURE */}
//             <section className="mt-3 flex gap-4">
//               <div className="flex-1 border p-2 text-sm">
//                 <strong>Terms & Conditions:</strong>
//                 <ul className="mt-2 ml-4 list-disc">
//                   {data.terms.map((t, i) => (
//                     <li key={i} className="text-xs">
//                       {t}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="w-64 border p-2 text-center">
//                 <div className="mt-6">
//                   VSAT Refurb Solutions Private Limited
//                 </div>
//                 <div className="mt-6">(Authorized Signatory)</div>
//               </div>
//             </section>

//             <div className="mt-2 text-right text-xs">
//               Original for Recipient
//             </div>
//           </article>
//         ))}
//       </div>

//       {/* Print styles to ensure A4 and hide controls */}
//       <style jsx global>{`
//         @page {
//           size: A4;
//           margin: 12mm;
//         }
//         @media print {
//           body {
//             -webkit-print-color-adjust: exact;
//           }
//           button {
//             display: none !important;
//           }
//           .challan {
//             page-break-after: always;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
