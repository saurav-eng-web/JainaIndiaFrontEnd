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

export default function LogisticUploadersHub() {
  const router = useRouter();

  const uploaders = [
    {
      title: "Docket Upload",
      description: "Upload Excel file to bulk insert dockets into the system.",
      icon: <UploadCloud className="w-10 h-10 text-blue-600" />,
      link: "/logistic/docket-upload",
    },
    {
      title: "Update Docket Details",
      description: "Upload ChallanNo, CourierCode, DocketNo and Type to change docket details.",
      icon: <UploadCloud className="w-10 h-10 text-indigo-600" />,
      link: "/logistic/docket-change",
    },
    {
      title: "Update Docket Status",
      description: "Upload ChallanNo, Type, PickupDate, DeliveryDate and Status to update docket status.",
      icon: <UploadCloud className="w-10 h-10 text-green-600" />,
      link: "/logistic/docket-change-status",
    },
    {
      title: "Courier Mapping",
      description: "Upload courier to pincode mapping (CourierCode, Pincode, Slab, Priority, Action).",
      icon: <UploadCloud className="w-10 h-10 text-purple-600" />,
      link: "/logistic/courier-mapping",
    },
    {
      title: "CN Logistic Uploader",
      description: "Upload CN dispatch details (CNno, dispatchWarehouse, docketNo, dispatchstatus) and run CN tracking.",
      icon: <UploadCloud className="w-10 h-10 text-orange-600" />,
      link: "/logistic/cn-uploader",
    },
  ];

  return (
    <PageSkeleton title="Uploaders Hub" rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Subheading title="Logistic Uploaders" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploaders.map((item, idx) => (
            <div
              key={idx}
              onClick={() => router.push(item.link)}
              className="group cursor-pointer border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 bg-gray-50 hover:bg-blue-50/50 flex flex-col items-center text-center gap-4"
            >
              <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageSkeleton>
  );
}
