"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import RequestModal from "./requestModal";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import Modal from "@/components/ui/Modal";
import PageSkeleton from "@/components/ui/PageSkeleton";

export default function POCancelReq() {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [payload, setPayload] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await axiosInstance.post("cancellation-requests/request", {
        type: "POCancelListing",
      });

      if (res.data?.statusCode === 200 && res.data?.data.length > 0) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data, try again");
    }
  }

  function handleClick(row) {
    setPayload(row);

    setOpenModal(true);
  }

  const columns = [
    {
      label: "",
      key: "customerPrice",
      size: "sm",
      render: (_, row) => (
        <button
          className="cursor-pointer rounded-md bg-[#714b67] px-3.5 py-2 text-[13px] text-white transition-colors hover:bg-[#5a3c52]"
          onClick={() => handleClick(row)}
        >
          Request
        </button>
      ),
    },
    { label: "PO Number", key: "PONumber", size: "md" },
    { label: "Ticket No", key: "ticket_no", size: "md" },
    { label: "Part Code", key: "Partcode", size: "md" },
    { label: "Part Desc", key: "PartDesc", size: "xl" },
    { label: "Inventory Type", key: "InventoryType", size: "sm" },
  ];

  return (
    <PageSkeleton title="PO Cancellation Request" rolesAllowed={["SF/SSD"]}>
      <Table columns={columns} rows={data} />
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <RequestModal
          payload={payload}
          onClose={() => {
            setOpenModal(false);
            fetchData();
          }}
        />
      </Modal>
    </PageSkeleton>
  );
}
