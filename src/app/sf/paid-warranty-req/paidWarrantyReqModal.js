import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";

// const dummyPartCode= ""

export default function PaidWarrantyReqModal({ data, onClose }) {
  const { ["Serial No."]: serialNo, ["Complaint No."]: ticketNo } = data;
  const [remarks, setRemarks] = useState("");
  const [partDetails, setPartDetails] = useState([]);
  const [selectedPartCodes, setSelectedPartCodes] = useState([]);

  useEffect(() => {
    async function fetchPartCodes() {
      try {
        const res = await axiosInstance.post("paid-warranty/process", {
          type: "PaidPartListingDD",
          ticket_no: ticketNo,
          serial_no: serialNo,
        });
        if (res.data.statusCode === 200 && res.data?.data.length > 0) {
          setPartDetails(res.data.data);
        }
      } catch (error) {
        toast.error("Unable to get part details");
      }
    }

    fetchPartCodes();
  }, [ticketNo, serialNo]);

  async function submitData() {
    if (selectedPartCodes.length === 0) {
      toast.error("Please select at least one part");
      return;
    }

    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }

    // const
    await toast.promise(
      axiosInstance.post("paid-warranty/process", {
        ...data,
        type: "PaidPartRequest",
        remarks,
        part_code: selectedPartCodes,
      }),
      {
        loading: "Submitting Request...",
        success: (res) => {
          toast.success("Request submitted successfully");
          onClose();
        },
        error: () => {
          toast.error("Failed to submit, try again!");
          return null;
        },
      }
    );
  }

  return (
    <ModalSkeleton title={"Paid Warranty Request"} rolesAllowed={["sf/ssd"]} size="lg">
      <div className="min-w-sm space-y-6">
        <PartSelectionList
          parts={partDetails}
          selectedPartCodes={selectedPartCodes}
          setSelectedPartCodes={setSelectedPartCodes}
        />
        <InputField
          label={"Remarks"}
          placeholder={"Enter Remarks"}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          required
        />
        <Button className="ml-auto" onClick={submitData}>
          Submit
        </Button>
      </div>
    </ModalSkeleton>
  );
}

function PartSelectionList({ parts, selectedPartCodes, setSelectedPartCodes }) {
  const normalizedParts = (parts || []).map((part, index) => {
    const code = part?.PC_PartCode || `part-${index}`;
    const name = part?.PC_PartDesc || part?.PartName || part?.partName || "";
    return { code, name };
  });

  const selectedCount = selectedPartCodes.length;
  const allSelected =
    normalizedParts.length > 0 && selectedCount === normalizedParts.length;

  const togglePart = (code, checked) => {
    if (checked) {
      setSelectedPartCodes((prev) => (prev.includes(code) ? prev : [...prev, code]));
      return;
    }
    setSelectedPartCodes((prev) => prev.filter((item) => item !== code));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPartCodes(normalizedParts.map((part) => part.code));
      return;
    }
    setSelectedPartCodes([]);
  };

  return (
    <div className="space-y-3 rounded-lg border border-[#714b67]/30 bg-[#714b67]/5 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#714b67]">Select Parts</p>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#714b67] shadow-sm">
          {selectedCount} selected
        </span>
      </div>

      {normalizedParts.length > 0 ? (
        <>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#714b67]">
            <input
              type="checkbox"
              checked={allSelected}
              className="accent-[#714b67]"
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            Select all parts
          </label>

          <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border border-[#714b67]/20 bg-white p-2">
            {normalizedParts.map((part, index) => {
              const isChecked = selectedPartCodes.includes(part.code);

              return (
                <label
                  key={`${part.code}-${index}`}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
                    isChecked
                      ? "border-[#714b67]/50 bg-[#714b67]/10"
                      : "border-transparent hover:border-[#714b67]/20 hover:bg-[#714b67]/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    className="accent-[#714b67]"
                    onChange={(e) => togglePart(part.code, e.target.checked)}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">{part.code}</p>
                    {!!part.name && (
                      <p className="truncate text-xs text-gray-600">{part.name}</p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </>
      ) : (
        <p className="rounded-md bg-white px-3 py-2 text-sm text-gray-500">
          No parts available
        </p>
      )}
    </div>
  );
}
