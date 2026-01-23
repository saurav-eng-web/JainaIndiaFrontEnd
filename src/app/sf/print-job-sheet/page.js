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
          border: 2px solid black;
        }
        .job-sheet-table td,
        .job-sheet-table th {
          border: 1px solid black;

          vertical-align: middle;
        }
        .no-border-left {
          border-left: none !important;
        }
        .no-border-right {
          border-right: none !important;
        }
        .no-border-top {
          border-top: none !important;
        }
        .no-border-bottom {
          border-bottom: none !important;
        }

        .label-cell {
          font-weight: bold;
          white-space: nowrap;
          width: 1px; /* shrink to fit */
          padding-right: 10px;
        }
        .value-cell {
          font-weight: bold;
          text-transform: uppercase;
        }
        .section-header {
          background-color: #f3f4f6;
          text-align: center;
          font-weight: bold;
        }
      `}</style>

      {/* Floating Print Button */}
      <button
        onClick={handlePrint}
        className="fixed right-8 bottom-8 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white bg-[#714b67] text-white shadow-xl transition-transform hover:scale-110 active:scale-95 print:hidden"
        title="Print Job Sheet"
      >
        <Printer size={24} />
      </button>

      <div className="mx-auto max-w-[210mm] bg-white print:max-w-full">
        {/* Main Wrapper Table */}
        <table className="job-sheet-table">
          <colgroup>
            <col style={{ width: "55%" }} />
            <col style={{ width: "45%" }} />
          </colgroup>
          <tbody>
            {/* --- HEADER --- */}
            <tr>
              <td className="align-top">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-4">
                      <Image
                        src="/SansuiLogo.jpg"
                        alt="SANSUI Logo"
                        width={160}
                        height={60}
                        className="object-contain"
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
              <td className="align-top">
                <table
                  className="h-full w-full pl-5"
                  style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
                >
                  <colgroup>
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "70%" }} />
                  </colgroup>
                  <tbody>
                    <tr className="">
                      <td className="label-cell border-t-0 border-l-0">Job Sheet No.</td>
                      <td className="value-cell border-t-0 border-r-0 text-center">
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
                      <td className="value-cell border-r-0 text-center text-[9px]">
                        {dummyData.ascName}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0 align-top">Address</td>
                      <td className="value-cell border-r-0 py-2 text-center text-[9px] leading-tight">
                        {dummyData.ascAddress}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-b-0 border-l-0">Contact Number</td>
                      <td className="value-cell border-r-0 border-b-0 text-center">
                        {dummyData.ascContact}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* --- BLOCK 2: Customer vs Complaint (Split at Contact Number / Model Number) --- */}
            <tr>
              <td className="p-0 align-top">
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
                      <td colSpan={2} className="border-t-0 border-r-0 border-l-0">
                        <span className="label-cell">Customer Name: </span>
                        <span className="value-cell">{dummyData.customerName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0 py-2 align-top">Address:</td>
                      <td className="value-cell border-r-0 py-1 text-[9px] leading-tight">
                        {dummyData.customerAddress}
                      </td>
                    </tr>
                    {/* Nested table for city/state grid to ensure alignment */}
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
                              <td className="value-cell border-t-0 text-center">
                                {dummyData.city}
                              </td>
                              <td className="border-t-0 border-r-0 bg-gray-50"></td>
                              {/* Image shows blank cell? Or just border? It's just border. */}
                            </tr>
                            <tr>
                              <td className="label-cell border-l-0">State</td>
                              <td className="value-cell text-center">
                                {dummyData.state}
                              </td>
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
                      <td className="value-cell border-r-0 text-center">
                        {dummyData.contactPerson}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-b-0 border-l-0">Contact Number</td>
                      <td className="value-cell border-r-0 border-b-0 text-center">
                        {dummyData.contactNumber}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="p-0 align-top">
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
                      <td className="value-cell border-t-0 border-r-0 text-center text-[10px]">
                        {dummyData.complaintNo}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-l-0">Complaint Date:</td>
                      <td className="value-cell border-r-0 text-center">
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
                    <tr className="h-8">
                      <td className="label-cell border-l-0">Product</td>
                      <td className="border-r-0 text-center align-bottom">
                        {dummyData.product}
                      </td>
                    </tr>
                    <tr className="h-8">
                      <td className="label-cell border-b-0 border-l-0">Model Number</td>
                      <td className="value-cell border-r-0 border-b-0 text-center align-bottom">
                        {dummyData.modelNumber}
                      </td>
                    </tr>
                    {/* The number of rows and heights MUST match left side if we want strict bottom alignment.
                                 Left side has 8 rows (Cust, Addr, City, State, Land, Phone, ContactP, ContactN).
                                 Right side has 7 rows (ComplaintNo, Date, Alt, Brand, Cat, Prod, Model).
                                 Address on Left is likely taller.
                                 Product/Model on Right might need to stretch to fill height.
                             */}
                  </tbody>
                </table>
              </td>
            </tr>

            {/* --- BLOCK 3: Specific Request vs Serial No --- */}
            <tr>
              <td className="p-0 align-top">
                <table
                  className="h-full w-full"
                  style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
                >
                  <colgroup>
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "75%" }} />
                  </colgroup>
                  <tbody>
                    {/* Specific Request spans multiple rows of right side */}
                    <tr>
                      <td
                        className="label-cell border-t-0 border-l-0 pt-2 align-top"
                        style={{ height: "100px" }}
                      >
                        Specific Request:
                      </td>
                      <td className="border-t-0 border-r-0 p-1 align-top">
                        {dummyData.specificRequest}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-b-0 border-l-0">Call type:- </td>
                      <td className="border-r-0 border-b-0">{dummyData.callType}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="p-0 align-top">
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
                      <td className="label-cell border-t-0 border-l-0">Serial Number</td>
                      <td className="value-cell border-t-0 border-r-0 text-center">
                        {dummyData.serialNumber}
                      </td>
                    </tr>
                    <tr style={{ height: "60px" }}>
                      <td className="label-cell border-l-0 pt-2 align-top">
                        Date of Purchase
                      </td>
                      <td className="value-cell border-r-0 pb-1 text-center align-bottom">
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
                      <td className="value-cell border-r-0 border-b-0 text-center">
                        {dummyData.warrantyType}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* --- DEFECT & ACTION --- */}
            <tr>
              <td colSpan={2} className="border-t p-0">
                <div className="flex w-full" style={{ minHeight: "30px" }}>
                  <div className="label-cell w-[120px] shrink-0 border-r border-transparent p-1">
                    Defect Observed:
                  </div>
                  <div className="p-1">{dummyData.defectObserved}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="border-t p-0">
                <div className="flex min-h-[40px] w-full">
                  <div className="flex w-[60%] border-r border-black">
                    <div className="label-cell w-[120px] shrink-0 p-1">Action Taken:</div>
                    <div>{dummyData.actionTaken}</div>
                  </div>
                  <div className="w-[40%]"></div>
                </div>
              </td>
            </tr>

            {/* --- PART CONSUMPTION --- */}
            <tr>
              <td
                colSpan={2}
                className="border-t border-b bg-gray-50 p-1 text-center font-bold"
              >
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
                        <tr key={i} className="h-6">
                          <td className="border-l-0 p-1">{part.code}</td>
                          <td className="p-1">{part.description}</td>
                          <td className="border-r-0 p-1 text-center">{part.qty}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </td>
            </tr>

            {/* --- FOOTER --- */}
            <tr>
              <td className="h-32 p-0 align-top">
                <div className="flex h-full flex-col border-b-0">
                  <div className="border-b border-black p-1 text-center font-bold">
                    Engineer Name, Sign & Date
                  </div>
                  <div className="flex-1"></div>
                  <div className="flex border-t border-black">
                    <div className="flex w-[120px] items-center justify-center border-r border-black p-2 text-center font-bold">
                      To & Fro Distance
                    </div>
                    <div className="flex flex-1 items-center justify-center font-bold">
                      {dummyData.toFroDistance}
                    </div>
                  </div>
                </div>
              </td>
              <td className="h-32 p-0 align-top">
                <div className="flex h-full flex-col border-b-0">
                  <div className="border-b border-black p-1 text-center font-bold">
                    Product Serviced, Up to My Satisfaction
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center p-2">
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
