"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";

import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";

// Legacy Logistic1 menu (UC/Log1.ascx): Logistic Invoice Rate Uploader + Logistic Invoice Uploader.
export default function LogisticInvoiceUploadsHub() {
  const router = useRouter();

  const items = [
    {
      title: "Logistic Invoice Uploader",
      description: "Upload InvoiceNo, FromA, Shipto, TransporterName, DocketNo, VehicleType.",
      icon: <UploadCloud className="w-10 h-10 text-blue-600" />,
      link: "/logistic/invoice-uploads/po",
    },
    {
      title: "Logistic Invoice Rate Uploader",
      description: "Upload FromA, ToA, Transporter, VehicleType, Rate.",
      icon: <UploadCloud className="w-10 h-10 text-green-600" />,
      link: "/logistic/invoice-uploads/rate",
    },
  ];

  return (
    <PageSkeleton title="Logistic Invoice Uploaders" rolesAllowed={["logistic1"]}>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Subheading title="Uploaders" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.link}
              onClick={() => router.push(item.link)}
              className="group cursor-pointer border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 bg-gray-50 hover:bg-blue-50/50 flex flex-col items-center text-center gap-4"
            >
              <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageSkeleton>
  );
}
