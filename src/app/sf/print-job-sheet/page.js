"use client";

import { ArrowLeft, Printer } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import InfoRow from "./components/InfoRow";
import SectionHeader from "./components/SectionHeader";

import axiosInstance from "@/api/axiosInstance";

// Dummy data to match the screenshot populate
const dummyData = {
  Complaint: "Hanging", // defectObserved
  CALL_TYPE: "Service",
  TICKET_NO: "MHSL2502191188842", // jobSheetNo
  NAME: "Mr. RAJUSAH SHEKH ", // customerName
  ADDRESS1: "CHAWL NO -01, SHRE SADGURU KIRPA CHAWL, KHOONI, WADAVALI KHURD", // customerAddress
  State_Name: "Maharashtra", // state
  CITY: "THANE", // city
  landmark: "NEAR NIRJEE", // landmark
  PINCODE: 421201, // pincode
  Expr1: "app",
  TDATE: "19/02/2025",
  TTIME: "2025-02-19T14:18:15.733",
  category: "LED", // category
  PRODUCT: "Smart LED", // product
  MODEL: "JSWY32GSHD", // modelNumber
  SERIAL_NO: "S32HG1924WP043379", // serialNumber
  PURCHASE_DATE: "25/10/2024", // dop
  InvoiceNo: "", // invoiceNo
  ASC_NAME: "PRAKASH ELECTRONICS SALES & SERVICES-MHS3ASC-089", // ascName
  ASCAddress:
    "SHOP NO 6 JAY HANUMAN CHAYA BILD DAWADI ROAD DOMBIVALI EAST\nMumbai\nMaharashtra-421203,", // ascAddress
  ascMobile: "9322730240", // ascContact
  CUSTREMARK: "", // specificRequest
  WARRANTY: "In Warranty", // warrantyType
  COMPLAINT_STATUS: "Part Pending",
  JD_Workdone: "Backlight problem panel required",
  TICKET_KEY: 1188842,
  Jd_Symptom: "No Picture",
  MOBILE: "9930489503", // customerSecondaryContact
  Dealer: "NANDAS ELEL. ", // dealerName
  DealerMobno: "8692896911", // dealerContact
  engname: null,
  Actualdistance: null,
  HMPH: "9930489503", // customerPrimaryContact
  WKPH: "",
  splint: "8692896911//DIGVIJAY",
  PurchaseFrom: "Dealer", // purchaseFrom
  Complaint_SubStatus: "Part Requested",
  ST_Number: "",
  brand_name: "Sansui",
  Email: "sansuicare@jainaindia.com",
  Web: "sansuiworld.com",
  AF: "Sansui Authorised Franchise", //franchiseName
  Toll: "18605003555", // tollFreeNumber
  Img: "../image/sansui_logo_color.jpg",
  cause: "Panel Faulty",
  Analysis: "Panel replaced", // actionTaken
};

const partConsumed = [];
export default function PrintJobSheet() {
  const complaintNo =
    useSelector((state) => state.routeData.store.complaintNo) || "MHSL2502191188842";
  const [data, setData] = useState({});

  const router = useRouter();
  console.log("complaint No: ", complaintNo);

  const sampleData = {
    Complaint: "Hanging", // defectObserved
    CALL_TYPE: "Service",
    TICKET_NO: "MHSL2502191188842", // jobSheetNo
    NAME: "Mr. RAJUSAH SHEKH ", // customerName
    ADDRESS1: "CHAWL NO -01, SHRE SADGURU KIRPA CHAWL, KHOONI, WADAVALI KHURD", // customerAddress
    State_Name: "Maharashtra", // state
    CITY: "THANE", // city
    landmark: "NEAR NIRJEE", // landmark
    PINCODE: 421201, // pincode
    Expr1: "app",
    TDATE: "19/02/2025",
    TTIME: "2025-02-19T14:18:15.733",
    category: "LED", // category
    PRODUCT: "Smart LED", // product
    MODEL: "JSWY32GSHD", // modelNumber
    SERIAL_NO: "S32HG1924WP043379", // serialNumber
    PURCHASE_DATE: "25/10/2024", // dop
    InvoiceNo: "", // invoiceNo
    ASC_NAME: "PRAKASH ELECTRONICS SALES & SERVICES-MHS3ASC-089", // ascName
    ASCAddress:
      "SHOP NO 6 JAY HANUMAN CHAYA BILD DAWADI ROAD DOMBIVALI EAST\nMumbai\nMaharashtra-421203,", // ascAddress
    ascMobile: "9322730240", // ascContact
    CUSTREMARK: "", // specificRequest
    WARRANTY: "In Warranty", // warrantyType
    COMPLAINT_STATUS: "Part Pending",
    JD_Workdone: "Backlight problem panel required",
    TICKET_KEY: 1188842,
    Jd_Symptom: "No Picture",
    MOBILE: "9930489503",
    Dealer: "NANDAS ELEL. ", // dealerName
    DealerMobno: "8692896911", //dealerContact
    engname: null,
    Actualdistance: null,
    HMPH: "9930489503",
    WKPH: "",
    splint: "8692896911//DIGVIJAY",
    PurchaseFrom: "Dealer", // purchaseFrom
    Complaint_SubStatus: "Part Requested",
    ST_Number: "",
    brand_name: "Sansui",
    Email: "sansuicare@jainaindia.com",
    Web: "sansuiworld.com",
    AF: "Sansui Authorised Franchise", //franchiseName
    Toll: "18605003555", // tollFreeNumber
    Img: "../image/sansui_logo_color.jpg",
    cause: "Panel Faulty",
    Analysis: "Panel replaced", // actionTaken
  };

  const {
    Complaint: defectObserved,
    TICKET_NO: jobSheetNo,
    // TICKET_NO: complaintNo,
    TDATE: complaintDate,
    NAME: customerName,
    ADDRESS1: customerAddress,
    State_Name: state,
    CITY: city,
    landmark: landmark,
    PINCODE: pincode,
    MOBILE: customerPrimaryContact,
    HMPH: customerSecondaryContact,
    // Expr1: contactPerson,
    WKPH: alternateNo,
    brand_name: brand,
    category: category,
    PRODUCT: product,
    MODEL: modelNumber,
    SERIAL_NO: serialNumber,
    PURCHASE_DATE: dop,
    InvoiceNo: invoiceNumber,
    ASC_NAME: ascName,
    ASCAddress: ascAddress,
    ascMobile: ascContact,
    CUSTREMARK: specificRequest,
    WARRANTY: warrantyType,
    splint: specialInstruction,
    AF: franchiseName,
    Toll: tollFreeNumber,
    Analysis: actionTaken,
    CALL_TYPE: callType,
    Actualdistance: toFroDistance,
    Dealer,
    DealerMobno,
  } = data;

  // Now you can use them directly:
  console.log(customerName); // Output: Mr. RAJUSAH SHEKH
  console.log(jobSheetNo); // Output: MHSL2502191188842

  // useEffect(() => {
  //   if(compl)
  // }, [data]);

  useEffect(() => {
    async function fetchData() {
      // if (!complaintNo) {
      //   router.push("/search-complaint");
      //   return;
      // }
      try {
        const res = await axiosInstance.post("print-jobsheet/process", {
          type: "JobSheet",
          ticket_no: complaintNo,
        });
        if (res.data?.statusCode === 200 && res.data?.data.length > 0) {
          setData(res.data.data[0]);
        } else {
          toast.error("No data found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data, try again");
      }
    }

    fetchData();
  }, [complaintNo]);

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
          height: 30px;
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
        className="fixed top-8 left-28 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white bg-[#714b67] text-white shadow-xl transition-transform hover:scale-110 active:scale-95 print:hidden"
        title="Print Job Sheet"
      >
        <Printer size={24} />
      </button>
      <button
        onClick={() => router.back()}
        className="fixed top-8 left-8 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white text-[#714b67] shadow-xl transition-transform hover:scale-110 active:scale-95 print:hidden"
        title="Print Job Sheet"
      >
        <ArrowLeft size={24} strokeWidth={2.75} />
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
              <td className="pl-4 align-top">
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
                  className="h-full w-full"
                  style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
                >
                  <colgroup>
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "65%" }} />
                  </colgroup>
                  <tbody>
                    <InfoRow
                      label="Job Sheet No."
                      value={jobSheetNo}
                      labelClass="border-t-0"
                      valueClass="border-t-0"
                    />
                    <SectionHeader title="Sansui Authorised Franchise" />
                    <InfoRow label="ASC Name" value={ascName} valueClass="text-[9px]" />
                    <InfoRow
                      label="Address"
                      value={ascAddress}
                      labelClass="align-top"
                      valueClass="py-2 text-[9px] leading-tight"
                    />
                    <InfoRow
                      label="Contact Number"
                      value={ascContact}
                      labelClass="border-b-0"
                      valueClass="border-b-0"
                    />
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
                        <span className="label-cell pl-2">Customer Name: </span>
                        <span className="value-cell">{customerName}</span>
                      </td>
                    </tr>
                    <InfoRow
                      label="Address:"
                      value={customerAddress}
                      labelClass="align-top py-2"
                      valueClass="py-1 text-[9px] leading-tight"
                    />
                    {/* Nested table for city/state grid to ensure alignment */}
                    <tr>
                      <td colSpan={2} className="border-r-0 border-l-0 p-0">
                        <table
                          className="w-full"
                          style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
                        >
                          <colgroup>
                            <col style={{ width: "23.5%" }} />
                            <col style={{ width: "50%" }} />
                            <col style={{ width: "20%" }} />
                          </colgroup>
                          <tbody>
                            <tr className="border-t border-black">
                              <td className="label-cell border-t-0 border-l-0 pl-2">
                                City
                              </td>
                              <td className="value-cell border-t-0 text-center">
                                {city}
                              </td>
                              <td className="border-t-0 border-r-0 bg-gray-50"></td>
                              {/* Image shows blank cell? Or just border? It's just border. */}
                            </tr>
                            <tr>
                              <td className="label-cell border-l-0 pl-2">State</td>
                              <td className="value-cell text-center">{state}</td>
                              <td className="border-r-0 text-center font-bold">
                                {pincode}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <InfoRow label="Landmark" value={landmark} />
                    <InfoRow label="Primary No" value={customerPrimaryContact} />
                    <InfoRow label="Contact Person" value={"-"} />
                    <InfoRow
                      label="Alternate Number"
                      value={customerSecondaryContact}
                      labelClass="border-b-0"
                      valueClass="border-b-0"
                    />
                  </tbody>
                </table>
              </td>
              <td className="align-top">
                <table
                  className="h-full w-full"
                  style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
                >
                  <colgroup>
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "65%" }} />
                  </colgroup>
                  <tbody>
                    <InfoRow
                      label="Complaint No.:"
                      value={complaintNo}
                      labelClass="border-t-0"
                      valueClass="border-t-0 text-[10px]"
                    />
                    <InfoRow label="Complaint Date:" value={complaintDate} />
                    <InfoRow
                      label="Alternate No."
                      value={alternateNo}
                      isValueCell={false}
                    />
                    <InfoRow label="Brand" value={brand} isValueCell={false} />
                    <InfoRow label="Category" value={category} isValueCell={false} />
                    <InfoRow
                      label="Product"
                      value={product}
                      valueClass="align-bottom"
                      isValueCell={false}
                      className="h-8"
                    />
                    <InfoRow
                      label="Model Number"
                      value={modelNumber}
                      labelClass="border-b-0"
                      valueClass="border-b-0 align-bottom"
                      className="h-8"
                    />
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
                        className="label-cell border-t-0 border-l-0 pt-2 pl-2 align-top"
                        style={{ height: "100px" }}
                      >
                        Specific Request
                      </td>
                      <td className="border-t-0 border-r-0 p-1 pl-2 align-top">
                        {specialInstruction || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-cell border-b-0 border-l-0 pl-2">Call type</td>
                      <td className="border-r-0 border-b-0 pl-2">{callType}</td>
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
                    <InfoRow
                      label="Serial Number"
                      value={serialNumber}
                      labelClass="border-t-0"
                      valueClass="border-t-0"
                    />
                    <InfoRow
                      label="Date of Purchase"
                      value={dop}
                      labelClass="align-top pt-2"
                      valueClass="pb-1 align-bottom"
                      className="h-[60px]" // check style overrides
                    />
                    <tr>
                      <td className="label-cell border-l-0 pl-2">Purchase from</td>
                      <td className="border-r-0">
                        <div className="flex justify-between px-1">
                          <span>
                            {Dealer} - {DealerMobno}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <InfoRow
                      label="Invoice Number"
                      value={invoiceNumber}
                      isValueCell={false}
                    />
                    <InfoRow
                      label="Warranty Type"
                      value={warrantyType}
                      labelClass="border-b-0"
                      valueClass="border-b-0"
                    />
                  </tbody>
                </table>
              </td>
            </tr>

            {/* --- DEFECT & ACTION --- */}
            <tr>
              <td colSpan={2} className="border-t p-0">
                <div className="flex w-full" style={{ minHeight: "30px" }}>
                  <div className="w-[120px] shrink-0 border-r border-transparent p-1 font-bold">
                    Defect Observed:
                  </div>
                  <div className="pt-1">{defectObserved}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="border-t p-0">
                <div className="flex min-h-10 w-full">
                  <div className="flex w-[60%] border-r border-black">
                    <div className="w-30 shrink-0 pt-1 pl-2 font-bold">Action Taken:</div>
                    <div className="pt-1">{actionTaken || "-"}</div>
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
                      const part = partConsumed[i] || {
                        part: "",
                        quantity: "",
                      };
                      return (
                        <tr key={i} className="h-6">
                          <td className="border-l-0 p-1">{part.part}</td>
                          <td className="p-1">{part.part}</td>
                          <td className="border-r-0 p-1 text-center">{part.quantity}</td>
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
                  <div className="p-2 font-bold">Engineer Name, Sign & Date</div>
                  <div className="flex-1"></div>
                  <div className="flex border-t border-black">
                    <div className="flex w-30 items-center justify-center border-r border-black p-2 text-center font-bold">
                      To & Fro Distance
                    </div>
                    <div className="flex flex-1 items-center justify-center font-bold">
                      {toFroDistance}
                    </div>
                  </div>
                </div>
              </td>
              <td className="h-32 p-0 align-top">
                <div className="flex h-full flex-col border-b-0">
                  <div className="p-1 pt-4 text-center font-bold">
                    Product Serviced, Up to My Satisfaction
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center p-2">
                    <div className="mb-2 h-16 w-72 border border-gray-300 px-12"></div>
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
