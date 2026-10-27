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
import { FileText, ClipboardList, CheckCircle, Truck, Smartphone } from "lucide-react";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";

export default function LogisticReportsHub() {
  const router = useRouter();

  const reports = [
    {
      title: "Available Dockets",
      description: "View all currently available dockets in the system.",
      icon: <ClipboardList className="w-10 h-10 text-emerald-600" />,
      link: "/logistic/reports?type=available-docket",
    },
    {
      title: "Used Dockets",
      description: "View all dockets that have been used.",
      icon: <FileText className="w-10 h-10 text-amber-600" />,
      link: "/logistic/reports?type=used-docket",
    },
    {
      title: "Complete Dockets",
      description: "View dockets marked as completely processed.",
      icon: <CheckCircle className="w-10 h-10 text-blue-600" />,
      link: "/logistic/reports?type=complete-docket",
    },
    {
      title: "Total Dispatch",
      description: "View total dispatch records within a date range.",
      icon: <Truck className="w-10 h-10 text-purple-600" />,
      link: "/logistic/reports?type=total-dispatch",
    },
    {
      title: "Total Dispatch Header",
      description: "View dispatch header records within a date range.",
      icon: <Truck className="w-10 h-10 text-indigo-600" />,
      link: "/logistic/reports?type=total-dispatch-header",
    },
    {
      title: "HO Reports",
      description: "Pending call, OK call, SF PO, DOA, returns, dispatch, claim, DC, CN and more (Excel).",
      icon: <FileText className="w-10 h-10 text-teal-600" />,
      link: "/logistic/ho-reports",
    },
    {
      title: "Mobile Reports",
      description: "Mobile-brand specific operational and challan reports (Excel download).",
      icon: <Smartphone className="w-10 h-10 text-rose-600" />,
      link: "/logistic/mobile/reports",
    },
  ];

  return (
    <PageSkeleton title="Reports Hub" rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Subheading title="Logistic Reports" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((item, idx) => (
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
