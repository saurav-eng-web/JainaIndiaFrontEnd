"use client";

import Table from "@/components/common/Table";

// Keys are normalised (lowercase, no spaces/hyphens) so status text variations still match
const STATUS_STYLES = {
  pickupawaited: "bg-amber-100 text-amber-700",
  intransit: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
};

function getStatusStyle(status) {
  const key = String(status || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "");

  return STATUS_STYLES[key] || "bg-gray-100 text-gray-700";
}

const COLUMNS = [
  {
    label: "S.No",
    key: "sno",
    size: "xxs",
    render: (_data, _row, rowIndex) => rowIndex + 1,
  },
  { label: "Ticket No", key: "ticketNo", size: "md" },
  { label: "Serial Number", key: "serialNo", size: "lg" },
  { label: "Invoice Date", key: "invoiceDate", size: "sm" },
  { label: "Request Date", key: "requestDate", size: "sm" },
  {
    label: "Ageing Days",
    key: "ageingDays",
    size: "sm",
    render: (value) => (Number.isFinite(value) ? value : "-"),
  },
  { label: "Created By", key: "createdBy", size: "md" },
  {
    label: "Status",
    key: "status",
    size: "md",
    render: (status) => (
      <span
        className={`-ml-2 inline-block rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-300 ${getStatusStyle(status)}`}
      >
        {status || "-"}
      </span>
    ),
  },
  // { label: "Courier Partner", key: "courierPartner", size: "sm" },
  // { label: "Docket Number", key: "docketNo", size: "md" },
  // { label: "Dispatch Date", key: "dispatchDate", size: "sm" },
  // { label: "Delivery Date", key: "deliveryDate", size: "sm" },
  // { label: "Confirmation Receipt", key: "confirmationReceipt", size: "md" },
];

export default function PickupStatusTable({ rows, isLoading = false }) {
  return <Table columns={COLUMNS} rows={rows} isLoading={isLoading} />;
}
