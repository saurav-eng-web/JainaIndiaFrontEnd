"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PaidWarrantyReqModal from "./paidWarrantyReqModal";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import Modal from "@/components/ui/Modal";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { formatIndianDate } from "@/utils/formatDate";

export default function PaidWarrantyRequest() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await toast.promise(
        axiosInstance.post("paid-warranty/process", {
          type: "PaidPartListing",
        }),
        {
          loading: "Loading data...",
          success: (res) => {
            if (res.data?.statusCode === 200 && res.data?.data?.length > 0) {
              setData(res.data.data);
            } else {
              // TODO: remove dummy data
              setData([]);
            }
            return null; // ✅ no success message
          },
          error: () => {
            toast.error("Failed to load data, try again");
            return null;
          },
        }
      );
    };

    fetchData();
  }, []);

  function handleClick(value) {
    setSelectedData(value);
    setOpenPopup(true);
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
    { label: "Complaint No", key: "Complaint No.", size: "md" },
    { label: "Serial No", key: "Serial No.", size: "md" },
    { label: "Call Type", key: "Call Type", size: "md" },
    { label: "Warranty", key: "Warranty", size: "sm" },
    { label: "Category", key: "category", size: "md" },
    { label: "Model", key: "Model", size: "md" },

    {
      label: "DOP",
      key: "dop",
      size: "md",
      render: (value) => {
        const ist = formatIndianDate(value);
        return ist;
        // Example output: "Sat, 1 Feb 2025"
      },
    },
  ];

  return (
    <PageSkeleton title={"Paid Warranty Part Request"}>
      <Table columns={columns} rows={data} />
      <Modal open={openPopup} onClose={() => setOpenPopup(false)} title={"Request"}>
        <PaidWarrantyReqModal data={selectedData} onClose={() => setOpenPopup(false)} />
      </Modal>
    </PageSkeleton>
  );
}
