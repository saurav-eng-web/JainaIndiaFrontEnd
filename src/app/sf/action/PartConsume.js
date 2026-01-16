import { useState } from "react";

import Table from "@/components/common/Table";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import RadioOption from "@/components/ui/RadioOption";

export default function PartConsume() {
  const [receivedStatus, setReceivedStatus] = useState("");
  const tableData = [
    {
      partCode: "123",
      description: "desc",
      qty: 4,
      poQty: 2,
      inventoryType: "free", // paid
    },
    {
      partCode: "098",
      description: "abcde",
      qty: 1,
      poQty: 2,
      inventoryType: "paid",
    },
  ];
  const tableConfig = [
    { label: "S. No", key: "id", size: "xs", render: (_v, _row, index) => index + 1 },
    { label: "Part Code", key: "partCode", size: "sm" },
    { label: "Description", key: "description", size: "md" },
    { label: "Avail Qty", key: "qty", size: "xs" },
    { label: "PO Qty", key: "poQty", size: "sm" },
    { label: "Inventory Type", key: "inventoryType", size: "sm" },
    {
      label: "Action",
      key: "action",
      size: "xxl",
      render: () => (
        <div className="flex items-center justify-between gap-4">
          <RadioOption
            name={"receivedStatus"}
            value="freshFaulty"
            label="Fresh Faulty"
            color="text-red-600"
            // actionsAllowed={actionsAllowed}
            checked={receivedStatus === "ok"}
            onChange={() => setReceivedStatus("ok")}
          />
          <RadioOption
            name={"receivedStatus"}
            value="consume"
            label="Consume"
            color="text-green-600"
            // actionsAllowed={actionsAllowed}
            checked={receivedStatus === "damaged"}
            onChange={() => setReceivedStatus("damaged")}
          />
        </div>
      ),
    },
  ];

  return (
    <ModalSkeleton title="Part Consume">
      <div className="w-3xl">
        <Table columns={tableConfig} rows={tableData} />
      </div>
    </ModalSkeleton>
  );
}
