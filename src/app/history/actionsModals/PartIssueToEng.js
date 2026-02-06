import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import Table from "@/components/common/Table";
import { Button } from "@/components/ui/button";
import ModalSkeleton from "@/components/ui/ModalSkeleton";

const partcodes = [
  { partcode: "P001", partdesc: "Engine Block" },
  { partcode: "P002", partdesc: "Cylinder Head" },
  { partcode: "P003", partdesc: "Piston" },
  { partcode: "P004", partdesc: "Crankshaft" },
];

export default function PartIssueToEng({ ticketNo, sfId, onClose }) {
  const [engineerData, setEngineerData] = useState([]);
  const [engineerId, setEngineerId] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [partData, setPartData] = useState(partcodes);

  useEffect(() => {
    async function fetchEngineerData() {
      try {
        const res = await axiosInstance.post(
          `Engineer/Manage`,
          {
            Action: "SELECT_ACTIVE_BY_SFID",
            Eng_SFID: sfId,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        const data = res.data.data;
        setEngineerData(
          data.map((item) => ({
            value: item.Eng_ID,
            label: item.Eng_Name,
          }))
        );
      } catch (err) {
        console.error("Error fetching engineer data:", err);
      }
    }
    fetchEngineerData();
  }, [sfId]);

  function handleSelectItem(value) {
    console.log("value: ", value);
  }

  async function submitCancelRequest() {
    const apiCall = axiosInstance.post("cancellation-requests/request", {
      type: "JobCancelRequest",
      ticket_no: ticketNo,
    });

    toast.promise(apiCall, {
      loading: "Submitting cancellation request...",
      success: (res) => {
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          onClose();
          return "Request submitted successfully";
        }

        throw new Error(res.data.statusMsg || "Unable to submit request");
      },
      error: (err) => {
        console.error("Error submitting cancel request:", err);
        return "Failed to submit cancel request, try again";
      },
    });
  }

  const columnConfig = [
    { label: "S. No", key: "id", size: "xs", render: (_v, _row, index) => index + 1 },

    { label: "Part Desc", key: "partDesc", size: "md" },
    { label: "Part Code", key: "partcode", size: "md" },
    {
      label: "Select Part",
      key: "",
      size: "xs",
      render: (value) => (
        <input
          type="checkbox"
          className={`} rounded-full px-3 py-1 text-xs font-semibold`}
          onChange={() => handleSelectItem(value)}
        />
      ),
    },
    // { label: "Sub Status", key: "Complaint_SubStatus", size: "md" },
  ];

  return (
    <ModalSkeleton title={"Part Issue To Engineer"} rolesAllowed={["sf/ssd"]} size="xl">
      <div className="w-xl space-y-6">
        <div className="grid grid-cols-2">
          <CustomDropdown
            label="Engineer Name"
            placeholder="Select Engineer"
            value={engineerId}
            onChange={(val) => setEngineerId(val)}
            options={engineerData}
            required
          />
        </div>
        <Table rows={partData} columns={columnConfig} />
      </div>
      <Button className="mt-8 ml-auto">Submit</Button>
    </ModalSkeleton>
  );
}
