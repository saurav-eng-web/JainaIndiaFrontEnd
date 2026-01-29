"use client";
import { ArrowLeft, Printer, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const SansuiJobSheet = () => {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 py-10 font-sans">
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
      {/* Controls */}
      <div className="mb-6 flex gap-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded px-6 py-2 font-semibold shadow transition-colors"
        >
          <Printer size={16} /> Print Job Sheet
        </button>
      </div>

      {/* A4 Page Container */}
      <div className="flex min-h-[297mm] w-[210mm] flex-col overflow-hidden border border-black bg-white text-[10px] leading-tight text-black shadow-lg print:border-none print:shadow-none">
        {/* --- TOP HEADER SECTION --- */}
        <div className="flex border-b border-black">
          {/* Left Block: Logo & Info */}
          <div className="flex w-[40%] flex-col border-r border-black">
            <div className="flex-1 p-3">
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
              <div className="mt-4 space-y-2 text-[9px] font-semibold">
                <p>Toll Free : 18605003555</p>
                <p>Email ID : sansuicare@jainaindia.com</p>
                <p>Website : sansuiworld.com</p>
              </div>
            </div>
          </div>

          {/* Right Block: Job Sheet & ASC Info */}
          <div className="flex w-[60%] flex-col">
            {/* Job Sheet No */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-32 items-center border-r border-black px-2 font-bold">
                Job Sheet No.
              </div>
              <div className="flex flex-1 items-center justify-center font-bold">
                MHSL250220179155VS
              </div>
            </div>
            {/* Franchise Header */}
            <div className="border-b border-black bg-gray-50 py-1 text-center font-bold">
              Sansui Authorised Franchise
            </div>
            {/* ASC Name */}
            <div className="flex h-12 border-b border-black">
              <div className="flex w-32 items-center border-r border-black px-2 font-bold">
                ASC Name
              </div>
              <div className="flex flex-1 items-center justify-center px-2 text-center font-bold">
                PRAKASH ELECTRONICS SALES & SERVICES-MHS3ASC-089
              </div>
            </div>
            {/* Address */}
            <div className="flex h-12 border-b border-black">
              <div className="flex w-32 items-center border-r border-black px-2 font-bold">
                Address
              </div>
              <div className="flex flex-1 items-center justify-center px-2 text-center leading-none font-bold">
                SHOP NO 6 JAY HANUMAN CHAYA BILD DAWADI ROAD DOMBIVALI EAST Mumbai
                Maharashtra-421203,
              </div>
            </div>
            {/* Contact Number */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-32 items-center border-r border-black px-2 font-bold">
                Contact Number
              </div>
              <div className="flex flex-1 items-center justify-center font-bold">
                9322730240
              </div>
            </div>
            {/* Complaint No */}
            <div className="flex h-8">
              <div className="flex w-32 items-center border-r border-black px-2 font-bold">
                Complaint No.:
              </div>
              <div className="flex flex-1 items-center justify-center font-bold">
                MHSL250220179155VS
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN DATA GRID --- */}
        <div className="flex border-b border-black">
          {/* LEFT COLUMN (40%) */}
          <div className="flex w-[40%] flex-col border-r border-black">
            {/* Customer Name (Moved Inside) */}
            <div className="flex h-14 border-b border-black">
              <div className="flex w-24 items-center border-r border-black p-2 leading-tight font-bold">
                Customer Name:
              </div>
              <div className="flex flex-1 items-center p-2 leading-tight font-bold">
                Mr./Mrs.. BHAVESH SANJAY BHAGAT BHAVESH SANJAY BHAGAT
              </div>
            </div>

            {/* Address */}
            <div className="flex h-16 border-b border-black">
              <div className="flex w-24 items-center border-r border-black p-2 font-bold">
                Address:
              </div>
              <div className="flex flex-1 items-center p-2 leading-tight font-bold">
                110 SHIVAJI MAHARAJ CHOWK CHINCHAWLI NEAR BY RAILWAY FHATAK BHIVPURI ROAD
                RAIGARH(MH) Chinchwali (Karjat)
              </div>
            </div>

            {/* City */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-24 items-center border-r border-black px-2 font-bold">
                City
              </div>
              <div className="flex flex-1 items-center justify-center uppercase">
                RAIGARH
              </div>
            </div>

            {/* State */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-24 items-center border-r border-black px-2 font-bold">
                State
              </div>
              <div className="flex h-full flex-1">
                <div className="flex flex-1 items-center justify-center border-r border-black">
                  Maharashtra
                </div>
                <div className="flex w-16 items-center justify-center">410201</div>
              </div>
            </div>

            {/* Landmark */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-24 items-center border-r border-black px-2 font-bold">
                Landmark
              </div>
              <div className="flex flex-1 items-center justify-center">Mahim(W)</div>
            </div>

            {/* Phone No */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-24 items-center border-r border-black px-2 font-bold">
                Phone No.
              </div>
              <div className="flex flex-1 items-center justify-center font-bold">
                8237198686
              </div>
            </div>

            {/* Contact Person */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-24 items-center border-r border-black px-2 leading-none font-bold">
                Contact Person
              </div>
              <div className="flex flex-1 items-center justify-center font-bold">APP</div>
            </div>

            {/* Contact Number */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-24 items-center border-r border-black px-2 leading-none font-bold">
                Contact Number
              </div>
              <div className="flex flex-1 items-center justify-center font-bold">
                0000000000
              </div>
            </div>

            {/* Specific Request (Spans Serial + Date) */}
            <div className="flex h-[5rem] border-b border-black">
              <div className="w-24 border-r border-black p-2 leading-tight font-bold">
                Specific Request:
              </div>
              <div className="flex-1 p-2"></div>
            </div>

            {/* Call Type (Spans Purchase + Invoice + Warranty) */}
            <div className="flex flex-1">
              <div className="flex w-24 items-center border-r border-black p-2 font-bold">
                Call type
              </div>
              <div className="flex-1">Demo</div>
            </div>
          </div>

          {/* RIGHT COLUMN (60%) */}
          <div className="flex w-[60%] flex-col">
            {/* Complaint Date */}
            <div className="flex h-14 border-b border-black">
              <div className="flex w-28 items-center border-r border-black px-2 leading-none font-bold">
                Complaint Date:
              </div>
              <div className="flex flex-1 items-center justify-center font-bold">
                20/02/2025
              </div>
            </div>

            {/* Alternate No */}
            <div className="flex h-16 border-b border-black">
              <div className="flex w-28 items-center border-r border-black px-2 font-bold">
                Alternate No.
              </div>
              <div className="flex flex-1 items-center justify-center font-bold">
                7972879538
              </div>
            </div>

            {/* Brand */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-28 items-center border-r border-black px-2 font-bold">
                Brand
              </div>
              <div className="flex flex-1 items-center justify-center">Sansui</div>
            </div>

            {/* Category */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-28 items-center border-r border-black px-2 font-bold">
                Category
              </div>
              <div className="flex flex-1 items-center justify-center">LED</div>
            </div>

            {/* Product (Spans 2 Left Rows) */}
            <div className="flex h-16 border-b border-black">
              <div className="flex w-28 items-center border-r border-black px-2 font-bold">
                Product
              </div>
              <div className="flex flex-1 items-center justify-center">Smart LED</div>
            </div>

            {/* Model Number (Spans 2 Left Rows) */}
            <div className="flex h-16 border-b border-black">
              <div className="flex w-28 items-center border-r border-black px-2 font-bold">
                Model Number
              </div>
              <div className="flex flex-1 flex-col items-center justify-center pt-8">
                <span>JSK32LSHD</span>
              </div>
            </div>

            {/* Serial Number */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-28 items-center border-r border-black px-2 font-bold">
                Serial Number
              </div>
              <div className="flex flex-1 items-center justify-center">
                S19190K0S005182
              </div>
            </div>

            {/* Date of Purchase */}
            <div className="flex h-12 border-b border-black">
              <div className="flex w-28 items-center border-r border-black px-2 font-bold">
                Date of Purchase
              </div>
              <div className="flex flex-1 items-center justify-center pt-4">
                20/03/2020
              </div>
            </div>

            {/* Purchase from */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-28 items-center border-r border-black px-2 font-bold">
                Purchase from
              </div>
              <div className="flex flex-1 items-center justify-between px-4">
                <span>NA</span>
                <span>0000000000</span>
              </div>
            </div>

            {/* Invoice Number */}
            <div className="flex h-8 border-b border-black">
              <div className="flex w-28 items-center border-r border-black px-2 font-bold">
                Invoice Number
              </div>
              <div className="flex flex-1 items-center justify-center">NA</div>
            </div>

            {/* Warranty Type */}
            <div className="flex h-8">
              <div className="flex w-28 items-center border-r border-black px-2 font-bold">
                Warranty Type
              </div>
              <div className="flex flex-1 items-center justify-center font-bold">
                Out Warranty
              </div>
            </div>
          </div>
        </div>

        {/* --- DEFECT & ACTION --- */}
        <div className="flex h-10 items-center border-b border-black p-2 font-bold">
          Defect Observed:
        </div>
        <div className="flex h-12 border-b border-black">
          <div className="w-32 p-2 font-bold">Action Taken:</div>
          <div className="flex-1 border-l border-black p-2">-</div>
        </div>

        {/* --- PART CONSUMPTION TABLE (Updated to use <table>) --- */}
        <div className="w-full">
          <div className="border-b border-black py-1 text-center font-bold">
            Part Consumption Detail
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="h-10">
                <th className="w-[20%] border-r border-b border-black text-center font-bold">
                  Part Code
                </th>
                <th className="w-[55%] border-r border-b border-black text-center font-bold">
                  Description
                </th>
                <th className="w-[25%] border-b border-black text-center font-bold">
                  Qty.
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr className="h-8">
                <td className="border-r border-b border-black"></td>
                <td className="border-r border-b border-black"></td>
                <td className="border-b border-black"></td>
              </tr>
              {/* Row 2 */}
              <tr className="h-8">
                <td className="border-r border-b border-black"></td>
                <td className="border-r border-b border-black"></td>
                <td className="border-b border-black"></td>
              </tr>
              {/* Row 3 */}
              <tr className="h-8">
                <td className="border-r border-b border-black"></td>
                <td className="border-r border-b border-black"></td>
                <td className="border-b border-black"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- FOOTER --- */}
        <div className="flex flex-1">
          {/* Left Footer Block */}
          <div className="flex w-[40%] flex-col justify-between border-r border-black">
            <div className="h-24 p-2 font-bold">Engineer Name, Sign & Date</div>
            <div className="flex h-16 items-center justify-center border-t border-black p-2 font-bold">
              To & Fro Distance
            </div>
          </div>

          {/* Right Footer Block */}
          <div className="relative flex w-[60%] flex-col">
            <div className="p-2 text-center font-bold">
              Product Serviced, Up to My Satisfaction
            </div>

            {/* Signature Box / Image Placeholder */}
            <div className="flex flex-1 items-center justify-center p-2">
              <div className="h-20 w-32 border border-gray-300 bg-white">
                {/* Image would go here */}
              </div>
            </div>

            <div className="p-2 pb-2 text-center font-bold">
              Customer Signature & Date
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SansuiJobSheet;
