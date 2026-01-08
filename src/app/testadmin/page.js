"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";

import Table from "@/components/common/Table"; // adjust path if needed

export default function DemoTablePage() {
  const handleView = useCallback((row) => {
    toast.success(`Viewing user: ${row.Name}`);
    console.log("Row clicked:", row);
  }, []);

  const columns = [
    {
      label: "Name",
      key: "Name",
      size: "md",
    },
    {
      label: "Email",
      key: "Email",
      size: "xl",
    },
    {
      label: "Type",
      key: "Type",
      size: "sm",
      render: (value) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            value === "Admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      label: "Status",
      key: "Status",
      size: "sm",
      render: (value) => (
        <span
          className={`font-medium ${
            value === "Active" ? "text-green-600" : "text-red-600"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      label: "Action",
      key: "action",
      size: "xs",
      render: (_value, row) => (
        <button
          onClick={() => handleView(row)}
          className="rounded bg-[#714b67] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#5a3c52]"
        >
          View
        </button>
      ),
    },
  ];

  const rows = [
    {
      Name: "Rahul Sharma",
      Email: "rahul.sharma@example.com",
      Type: "Admin",
      Status: "Active",
    },
    {
      Name: "Amit Verma",
      Email: "amit.verma@example.com",
      Type: "User",
      Status: "Inactive",
    },
    {
      Name: "Neha Singh",
      Email: "neha.singh@example.com",
      Type: "User",
      Status: "Active",
    },
  ];

  return (
    <div className="p-10">
      <h2 className="mb-6 text-xl font-bold text-[#714b67]">
        Demo – Generic Table with Custom Cells
      </h2>

      <Table columns={columns} rows={rows} />
    </div>
  );
}

// "use client";

// import { useState } from "react";

// import AddPartPending from "../sf/action/AddPartPending";

// import PageSkeleton from "@/components/ui/PageSkeleton";
// import Modal from "@/components/ui/Modal";
// import ModalSkeleton from "@/components/ui/ModalSkeleton";

// export default function TestAdmin() {
//   const [open, setOpen] = useState(false);

//   const onOpen = () => setOpen(true);
//   const onClose = () => setOpen(false);

//   return (
//     <>
//       <PageSkeleton title="Test Admin" rolesAllowed={["cc", "zone", "sf/ssd", "br"]}>
//         <button
//           onClick={onOpen}
//           className="h-10 rounded-2xl bg-blue-900 px-4 py-2 text-white"
//         >
//           Open modal
//         </button>

//         <Modal open={open} onClose={onClose}>
//           <AddPartPending />
//         </Modal>
//       </PageSkeleton>
//     </>
//   );
// }
