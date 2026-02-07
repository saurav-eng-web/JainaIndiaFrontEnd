"use client";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import { Button } from "@/components/ui/button";
import Dropdown from "@/components/ui/Dropdown";
import InputWithLabel from "@/components/ui/InputWithLabel";
import PageSkeleton from "@/components/ui/PageSkeleton";

export default function Page() {
  const ticketNo = sessionStorage.getItem("currentTicket");
  const router = useRouter();

  const [dropdownData, setDropdownData] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [otherClaimDetails, setOtherClaimDetails] = useState([]);

  const [remarks, setRemarks] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);

  if (!ticketNo) {
    router.push("/fin/search");
  }

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const res = await axiosInstance.post("claim-process-v1/process", {
          type: "ClaimDD",
        });
        console.log("res: ", res);
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          const ddData = res.data.data[0].JSON_Data;
          console.log("ddData: ", ddData);
          const parsedData = await JSON.parse(ddData);
          setDropdownData(parsedData);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    const fetchClaimDetails = async () => {
      try {
        const res = await axiosInstance.post("claim-process-v1/process", {
          type: "ClaimDetail",
          ticket_no: ticketNo,
        });
        console.log("res: ", res);
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          setClaimData(res.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    const fetchOtherClaimDetails = async () => {
      try {
        const res = await axiosInstance.post("claim-process-v1/process", {
          type: "ClaimDetailserialNo",
          ticket_no: ticketNo,
        });
        console.log("res: ", res);
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          setOtherClaimDetails(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
    fetchClaimDetails();
    fetchOtherClaimDetails();
  }, [ticketNo]);

  const typeOptions = dropdownData.map((item) => ({
    label: item.Type,
    value: item.Type,
  }));

  const reasonOptions =
    dropdownData
      .find((item) => item.Type === selectedType?.value)
      ?.Reasons?.map((reason) => ({
        label: reason.Holdreject_reason,
        value: reason.Holdreject_reason,
      })) || [];

  const hasReasonOptions = reasonOptions.length > 0;

  async function handleSubmit() {
    if (!selectedType || !selectedReason) {
      toast.error("Please select a type and reason");
      return;
    }

    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }

    try {
      const res = await axiosInstance.post("claim-process-v1/process", {
        type: "ClaimDetailAction",
        ticket_no: ticketNo,
        task: selectedType.value,
        dropdownaction: selectedReason.value,
        remarks: remarks,
      });

      console.log("res: ", res);

      if (res.data.statusCode === 200 && res.data?.data.length > 0) {
        toast.success("Request submitted successfully");
        router.back();
      }
    } catch (error) {
      toast.error("Unable to submit the request, please try again");
    }
  }

  const claimFields = [
    { label: "Complaint No.", key: "Complaint No." },
    { label: "Serial No.", key: "Serial No." },
    { label: "Model", key: "Model" },
    { label: "Call Type", key: "Call Type" },
    { label: "Warranty", key: "Warranty" },
    { label: "DOP", key: "DOP" },
    { label: "Call OK Date", key: "Call OK Date" },
    { label: "Claim Substatus", key: "Claim Substatus" },
    { label: "Reason", key: "Reason" },
    { label: "Remarks", key: "Remarks" },
  ];

  const columnConfig = [
    {
      label: "S. No",
      key: "",
      size: "sm",
      render: (row, _, index) => index + 1,
    },
    {
      label: "Ticket No",
      key: "TICKET_NO",
      size: "lg",
    },
    {
      label: "Customer Name",
      key: "Custname",
      size: "xl",
    },
    {
      label: "Purchase Date",
      key: "PURCHASE_DATE",
      size: "sm",
      render: (val) => (val ? val.split("T")[0] : "-"),
      // render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    {
      label: "Complaint Status",
      key: "COMPLAINT_STATUS",
      size: "sm",
    },
    {
      label: "Sub Status",
      key: "Complaint_SubStatus",
      size: "md",
    },
    // {
    //   label: "TDate",
    //   key: "TDATE",
    //   size: "md",
    //   render: (val) => (val ? new Date(val).toLocaleString() : "-"),
    // },
    {
      label: "OK Date",
      key: "OKDate",
      size: "sm",
      // render: (val) => (val ? new Date(val).toLocaleString() : "-"),
      render: (val) => (val ? val.split("T")[0] : "-"),
    },
  ];

  return (
    <PageSkeleton title={"History"}>
      <div className="mt-8 rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#714b67]">Action</h3>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Dropdown
            label="Type"
            value={selectedType}
            onChange={(opt) => {
              setSelectedType(opt);
              setSelectedReason(null);
            }}
            options={typeOptions}
            placeholder="Select Type"
          />
          {hasReasonOptions && (
            <Dropdown
              label="Reason"
              value={selectedReason}
              onChange={setSelectedReason}
              options={reasonOptions}
              placeholder="Select Reason"
            />
          )}
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4">
          <InputWithLabel
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={() => router.back()} variant="outline" className="mt-8">
            Back
          </Button>
          <Button className="mt-8" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>

      <div className="mt-8 rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#714b67]">Claim Details</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {claimFields.map((field) => (
            <InputWithLabel
              key={field.key}
              label={field.label}
              value={claimData?.[field.key] || "-"}
              disabled
              size="md"
            />
          ))}
        </div>
      </div>

      {/* otherClaim details: otherClaimDetails, this will be in tabular form, use the Table that we already built, for that we have to first create columnConfig */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-[#714b67]">
          Other jobs on the same serial number
        </h3>
        <Table columns={columnConfig} rows={otherClaimDetails} />
      </div>
    </PageSkeleton>
  );
}

// two dropdow
// remarks
