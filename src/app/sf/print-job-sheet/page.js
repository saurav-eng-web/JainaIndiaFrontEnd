"use client";

import { Printer } from "lucide-react";
import Image from "next/image";
import React from "react";

// Dummy data to match the screenshot populate
const dummyData = {
  jobSheetNo: "MHSL250220179155VS",
  ascName: "PRAKASH ELECTRONICS SALES & SERVICES-MHS3ASC-089",
  ascAddress:
    "SHOP NO 6 JAY HANUMAN CHAYA BILD DAWADI ROAD DOMBIVALI EAST Mumbai Maharashtra-421203,",
  ascContact: "9322730240",
  customerName: "Mr./Mrs.. BHAVESH SANJAY BHAGAT BHAVESH SANJAY BHAGAT",
  customerAddress:
    "110 SHIVAJI MAHARAJ CHOWK CHINCHAWLI NEAR BY RAILWAY FHATAK BHIVPURI ROAD RAIGARH(MH) Chinchwali (Karjat)",
  city: "RAIGARH",
  state: "Maharashtra",
  pincode: "410201",
  landmark: "Mahim(W)",
  phoneNo: "8237198686",
  contactPerson: "APP",
  contactNumber: "0000000000",
  complaintNo: "MHSL250220179155VS",
  complaintDate: "20/02/2025",
  alternateNo: "7972879538",
  brand: "Sansui",
  category: "LED",
  product: "Smart LED",
  modelNumber: "JSK32LSHD",
  serialNumber: "S19190K0S005182",
  dop: "20/03/2020",
  purchaseFrom: "NA",
  purchaseFromContact: "0000000000",
  invoiceNumber: "NA",
  warrantyType: "Out Warranty",
  callType: "Demo",
  specificRequest: "",
  defectObserved: "",
  actionTaken: "-",
  toFroDistance: "",
  partsConsumed: [
    { code: "", description: "", qty: "" },
    { code: "", description: "", qty: "" },
    { code: "", description: "", qty: "" },
    { code: "", description: "", qty: "" },
  ],
};

export default function PrintJobSheet() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="font-arial min-h-screen bg-gray-100 p-8 print:bg-white print:p-0">
      <style jsx global>{`
        @media print {
          @page {
            margin: 15mm;
            size: auto;
          }
          body {
            background-color: white;
            -webkit-print-color-adjust: exact;
          }
        }
        .job-sheet-table {
          width: 100%;
          border-collapse: collapse;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          line-height: 1.2;
          color: black;
        }
        .job-sheet-table td,
        .job-sheet-table th {
          border: 1px solid black;
          padding: 3px 5px;
          vertical-align: middle;
        }
        .bold-label {
          font-weight: bold;
        }
        .italic-label {
          font-style: italic;
        }
        .label-cell {
          font-weight: bold;
          font-style: italic; /* Based on image, headers are bold italic? Or just bold? 'ASC Name' looks bold. 'Address' looks bold. */
          /* Actually looking closely at 'Customer Name', it is BOLD. 'Address:' is BOLD. 'Job Sheet No.' BOLD. */
          /* Some look slightly condensed? Let's just use font-bold. */
        }
        .section-header {
          background-color: #f3f4f6; /* gray-100/50 */
          text-align: center;
          font-weight: bold;
        }
        .text-center {
          text-align: center;
        }
        .text-right {
          text-align: right;
        }
        .align-top {
          vertical-align: top !important;
        }
        .uppercase {
          text-transform: uppercase;
        }
      `}</style>

      {/* Floating Print Button */}
      <button
        onClick={handlePrint}
        className="fixed right-8 bottom-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-transform hover:scale-110 active:scale-95 print:hidden"
        title="Print Job Sheet"
      >
        <Printer size={24} />
      </button>

      <div className="mx-auto max-w-[210mm] bg-white print:max-w-full">
        {/* RE-WRITING THE TABLE TO BE ONE CONTINUOUS TABLE WITH NESTED TABLES IN THE 2 MAIN COLUMNS FOR THE BODY */}

        <table className="job-sheet-table border-b leading-tight">
          <colgroup>
            <col style={{ width: "55%" }} />
            <col style={{ width: "45%" }} />
          </colgroup>
          <tbody>
            {/* HEADER */}
            <tr>
              <td className="p-4 align-top" style={{ padding: "10px" }}>
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-4">
                      <img
                        src="/SansuiLogo.jpg"
                        alt="SANSUI Logo"
                        className="h-8 object-contain"
                      />
                      <div className="mt-1 flex gap-1">
                        <div className="h-1.5 w-6 bg-[#C6Dba8]"></div>
                        <div className="h-1.5 w-6 bg-[#f7a8b8]"></div>
                        <div className="h-1.5 w-6 bg-black"></div>
                      </div>
                    </div>
                    <div className="mt-4 text-[11px] font-bold">
                      Toll Free : 18605003555
                    </div>
                    <div className="mt-1 text-[11px] font-bold">
                      Email ID : sansuicare@jainaindia.com
                    </div>
                    <div className="mt-2 text-[11px] font-bold hover:text-blue-600">
                      Website : sansuiworld.com
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-0 align-top" style={{ padding: 0 }}>
                <table
                  className="h-full w-full"
                  style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
                >
                  <colgroup>
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "70%" }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="label-cell border-t-0 border-l-0">Job Sheet No.</td>
                      <td className="border-t-0 border-r-0 text-center font-bold">
                        {dummyData.jobSheetNo}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={2}
                        className="border-r-0 border-l-0 bg-gray-50 text-center font-bold"
                      >
                        Sansui Authorised Franchise
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">ASC Name</td>
                      <td className="border-r-0 text-center text-[9px] font-bold uppercase">
                        {dummyData.ascName}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0 align-top">Address</td>
                      <td className="border-r-0 py-1 text-center text-[9px] leading-tight font-bold uppercase">
                        {dummyData.ascAddress}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-b-0 border-l-0">Contact Number</td>
                      <td className="border-r-0 border-b-0 text-center font-bold">
                        {dummyData.ascContact}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* BODY (Split Left/Right) */}
            <tr>
              <td className="p-0 align-top" style={{ padding: 0 }}>
                <table
                  className="h-full w-full"
                  style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
                >
                  <colgroup>
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "75%" }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td colSpan={2} className="border-t-0 border-r-0 border-l-0 py-1">
                        <span className="label-cell">Customer Name: </span>
                        <span className="font-bold uppercase">
                          {dummyData.customerName}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0 py-4 align-top">Address:</td>
                      <td className="border-r-0 py-1 align-top text-[9px] leading-tight font-bold uppercase">
                        {dummyData.customerAddress}
                      </td>
                    </tr>
                    {/* Inner table for row-span effect on columns? No, just render rows. */}
                    <tr>
                      <td colSpan={2} className="border-r-0 border-l-0 p-0">
                        <table
                          className="w-full"
                          style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
                        >
                          <colgroup>
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "50%" }} />
                            <col style={{ width: "25%" }} />
                          </colgroup>
                          <tbody>
                            <tr className="border-t border-black">
                              <td className="label-cell border-t-0 border-l-0">City</td>
                              <td className="border-t-0 text-center uppercase">
                                {dummyData.city}
                              </td>
                              <td className="border-t-0 border-r-0"></td>
                            </tr>
                            <tr>
                              <td className="label-cell border-l-0">State</td>
                              <td className="text-center uppercase">{dummyData.state}</td>
                              <td className="border-r-0 text-center">
                                {dummyData.pincode}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Landmark</td>
                      <td className="border-r-0 text-center">{dummyData.landmark}</td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Phone No.</td>
                      <td className="border-r-0 text-center font-bold">
                        {dummyData.phoneNo}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Contact Person</td>
                      <td className="border-r-0 text-center font-bold">
                        {dummyData.contactPerson}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Contact Number</td>
                      <td className="border-r-0 text-center font-bold">
                        {dummyData.contactNumber}
                      </td>
                    </tr>
                    {/* Specific Request - Tall Cell */}
                    <tr>
                      <td className="label-cell h-24 border-l-0 align-top">
                        Specific Request:
                      </td>
                      <td className="border-r-0 p-1 align-top">
                        {dummyData.specificRequest}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="border-r-0 border-b-0 border-l-0 py-2">
                        <span className="label-cell">Call type:- </span>
                        <span>{dummyData.callType}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="p-0 align-top" style={{ padding: 0 }}>
                <table
                  className="h-full w-full"
                  style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
                >
                  <colgroup>
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "65%" }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="label-cell border-t-0 border-l-0">Complaint No.:</td>
                      <td className="border-t-0 border-r-0 text-center text-[9px] font-bold">
                        {dummyData.complaintNo}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Complaint Date:</td>
                      <td className="border-r-0 text-center font-bold">
                        {dummyData.complaintDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Alternate No.</td>
                      <td className="border-r-0 text-center">{dummyData.alternateNo}</td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Brand</td>
                      <td className="border-r-0 text-center">{dummyData.brand}</td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Category</td>
                      <td className="border-r-0 text-center">{dummyData.category}</td>
                    </tr>
                    <tr className="h-10">
                      <td className="label-cell border-l-0">Product</td>
                      <td className="border-r-0 text-center align-bottom">
                        {dummyData.product}
                      </td>
                    </tr>
                    <tr className="h-10">
                      <td className="label-cell border-l-0">Model Number</td>
                      <td className="border-r-0 text-center align-bottom font-bold">
                        {dummyData.modelNumber}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Serial Number</td>
                      <td className="border-r-0 text-center font-bold">
                        {dummyData.serialNumber}
                      </td>
                    </tr>
                    <tr className="h-12">
                      <td className="label-cell border-l-0 pt-1 align-top">
                        Date of Purchase
                      </td>
                      <td className="border-r-0 pb-1 text-center align-bottom font-bold">
                        {dummyData.dop}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Purchase from</td>
                      <td className="border-r-0">
                        <div className="flex justify-between px-1 text-[9px]">
                          <span>{dummyData.purchaseFrom}</span>
                          <span>{dummyData.purchaseFromContact}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Invoice Number</td>
                      <td className="border-r-0 text-center">
                        {dummyData.invoiceNumber}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-b-0 border-l-0">Warranty Type</td>
                      <td className="border-r-0 border-b-0 text-center font-bold">
                        {dummyData.warrantyType}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* DEFECT OBSERVED */}
            <tr>
              <td colSpan={2} className="border-t p-0">
                <div className="flex w-full" style={{ minHeight: "30px" }}>
                  <div className="label-cell w-[100px] shrink-0 p-1">
                    Defect Observed:
                  </div>
                  <div className="p-1">{dummyData.defectObserved}</div>
                </div>
              </td>
            </tr>

            {/* ACTION TAKEN */}
            <tr>
              <td colSpan={2} className="p-0">
                <div className="flex min-h-[40px] w-full">
                  {/* Left side (Action Taken label + space) */}
                  <div className="flex w-[55%] border-r border-black">
                    <div className="label-cell w-[100px] shrink-0 p-1">Action Taken:</div>
                    <div className="p-1"></div>
                  </div>
                  {/* Right side (Value) */}
                  <div className="w-[45%] p-1 font-bold">{dummyData.actionTaken}</div>
                </div>
              </td>
            </tr>

            {/* PART CONSUMPTION */}
            <tr>
              <td colSpan={2} className="border-b bg-gray-50 p-1 text-center font-bold">
                Part Consumption Detail
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="border-b-0 p-0">
                <table
                  className="w-full"
                  style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
                >
                  <colgroup>
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "60%" }} />
                    <col style={{ width: "10%" }} />
                  </colgroup>
                  <thead>
                    <tr className="text-center font-bold">
                      <td className="border-t-0 border-l-0">Part Code</td>
                      <td className="border-t-0">Description</td>
                      <td className="border-t-0 border-r-0">Qty.</td>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(4)].map((_, i) => {
                      const part = dummyData.partsConsumed[i] || {
                        code: "",
                        description: "",
                        qty: "",
                      };
                      return (
                        <tr key={i} className="h-6 text-center">
                          <td className="border-l-0">{part.code}</td>
                          <td>{part.description}</td>
                          <td className="border-r-0">{part.qty}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </td>
            </tr>

            {/* FOOTER */}
            <tr>
              <td className="h-32 p-0 align-top" style={{ padding: 0 }}>
                <div className="flex h-full flex-col">
                  <div className="border-b border-black p-1 text-center font-bold italic">
                    Engineer Name, Sign & Date
                  </div>
                  <div className="flex-1"></div>
                  <div className="flex border-t border-black">
                    <div className="label-cell flex w-[40%] items-center justify-center border-r border-black bg-gray-50 p-2 text-center">
                      To & Fro Distance
                    </div>
                    <div className="flex flex-1 items-center justify-center p-2">
                      {dummyData.toFroDistance}
                    </div>
                  </div>
                </div>
              </td>
              <td className="h-32 p-0 align-top" style={{ padding: 0 }}>
                <div className="flex h-full flex-col text-center">
                  <div className="border-b border-black p-1 text-center font-bold italic">
                    Product Serviced, Up to My Satisfaction
                  </div>
                  <div className="relative flex flex-1 flex-col items-center justify-center p-2">
                    {/* Image box placeholder */}
                    <div className="mb-2 h-16 w-32 border border-gray-300"></div>
                    <div className="font-bold italic">Customer Signature & Date</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
