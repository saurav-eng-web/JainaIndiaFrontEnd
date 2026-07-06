import React from "react";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";
import Subheading from "@/components/customui/Subheading";
import Loading from "@/components/customui/Loading";
import { ArrowLeft } from "lucide-react";

export default function TicketHistoryView({ ticket, history, isLoading, onBack }) {
  const historyColumns = [

    // { label: "Action By (ID)", key: "ActionByUserID", size: "sm" },
    { label: "Action By", key: "ActionByUsername", size: "sm" },
    { label: "Transferred To", key: "TransferredToUsername", size: "sm" },


    { label: "Remarks", key: "Remarks", size: "lg" },
    {
      label: "Resulting Status",
      key: "ResultingStatus",
      size: "sm",
      render: (value) => {
        let badgeClass = "bg-gray-100 text-gray-800";
        const upperValue = String(value || "").toUpperCase();
        if (upperValue.includes("OPEN") || upperValue.includes("ASSIGNED")) {
          badgeClass = "bg-blue-100 text-blue-800";
        } else if (upperValue.includes("CLOSED") || upperValue.includes("RESOLVED")) {
          badgeClass = "bg-green-100 text-green-800";
        } else if (upperValue.includes("REJECTED") || upperValue.includes("CANCELLED")) {
          badgeClass = "bg-red-100 text-red-800";
        } else if (upperValue.includes("TRANSFERRED")) {
          badgeClass = "bg-orange-100 text-orange-800";
        }

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      label: "Date & Time",
      key: "CreatedDateTime",
      size: "md",
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString() +
          " " +
          new Date(value).toLocaleTimeString()
          : "-",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* <div className="flex items-center gap-4 ml-auto">
        <Button variant="" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div> */}

      <Subheading title="Ticket Details" />


      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* <h3 className="mb-4 text-lg font-medium text-gray-800">Selected Ticket Details</h3> */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Ticket Number</p>
            <p className="mt-1 text-base text-gray-900">{ticket?.Ticket_No || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Complaint No</p>
            <p className="mt-1 text-base text-gray-900">{ticket?.ComplaintNo || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ticket Date</p>
            <p className="mt-1 text-base text-gray-900">
              {ticket?.TicketDate
                ? new Date(ticket.TicketDate).toLocaleDateString() +
                " " +
                new Date(ticket.TicketDate).toLocaleTimeString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="mt-1 text-base text-gray-900">{ticket?.TicketStatus || "-"}</p>
          </div>
          <div className="lg:col-span-2">
            <p className="text-sm font-medium text-gray-500">Issue</p>
            <p className="mt-1 text-base text-gray-900">{ticket?.Problem || "-"}</p>
          </div>
          <div className="lg:col-span-2">
            <p className="text-sm font-medium text-gray-500">Remarks</p>
            <p className="mt-1 text-base text-gray-900">{ticket?.ProblemRemarks || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Assigned To</p>
            <p className="mt-1 text-base text-gray-900">{ticket?.CurrentAssigneeTo || "-"}</p>
          </div>
        </div>
      </div>

      <Subheading title="History Log" marginTop={2} />

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loading />
        </div>
      ) : (
        <Table columns={historyColumns} rows={history || []} />
      )}
    </div>
  );
}
