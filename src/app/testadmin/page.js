"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { CloseButton } from "react-toastify";

import Table from "@/components/common/Table"; // adjust path if needed
import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { Button } from "@/components/ui/button";
import ThemedButton from "@/components/common/ThemedButton";

export default function DemoTablePage() {
  const [search, setSearch] = useState("");
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

  async function fetchData() {
    try {
      const res = await axiosInstance.post("po-receive/list", {
        type: "PendingSearch",
        search: "JPS-2021-0006177",
      });
      console.log("res: ", res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchData1() {
    try {
      const res = await axios.post("https://ncapi.jainaindia.com/api/po-receive/list", {
        type: "PendingSearch",
        search: "JPS-2021-0006177",
      });
      console.log("res: ", res.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <PageSkeleton title="Test Admin" rolesAllowed={["cc", "zone", "sf/ssd", "br"]}>
      <div className="flex gap-10">
        <button
          onClick={fetchData}
          className="h-10 rounded-2xl bg-blue-900 px-4 py-2 text-white"
        >
          Fetch Data
        </button>
        <Button>Fetch Data</Button>
        <Button variant="danger">Fetch Data</Button>
        <ThemedButton>Fetch Data</ThemedButton>
        <ThemedButton type="secondary">Fetch Data</ThemedButton>
      </div>
      {/* <CloseButton /> */}
    </PageSkeleton>
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
