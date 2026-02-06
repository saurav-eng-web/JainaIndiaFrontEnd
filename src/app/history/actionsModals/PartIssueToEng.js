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
  const [engineerName, setEngineerName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [partData, setPartData] = useState(partcodes);
  console.log("selectedpart", selectedItem);
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

  useEffect(() => {
    async function fetchPartCode() {
      try {
        const res = await axiosInstance.post(`po-receive/list`, {
          type: "AssignEng",
          ticket_no: ticketNo,
        });
        const data = res.data.data;
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          setPartData(data);
        }
      } catch (err) {
        console.error("Error fetching engineer data:", err);
      }
    }
    fetchPartCode();
  }, [ticketNo]);

  function handleSelectItem(partCode) {
    setSelectedItem((prev) => {
      const current = prev ? prev.split(",").filter(Boolean) : [];
      const exists = current.includes(partCode);
      const next = exists
        ? current.filter((code) => code !== partCode)
        : [...current, partCode];
      return next.join(",");
    });
  }

  async function handleSubmit() {
    const apiCall = axiosInstance.post("sflevel1/process", {
      type: "Part Issued To Engg",
      ticket_no: ticketNo,
      eng_id: engineerId,
      engname: engineerName,
      partcode: selectedItem, //string, separated by comma
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
    { label: "S. No", key: "id", size: "xxs", render: (_v, _row, index) => index + 1 },

    { label: "Part Code", key: "PartCode", size: "xs" },
    { label: "Part Desc", key: "PartDesc", size: "md" },
    {
      label: "Select",
      key: "",
      size: "xxs",
      render: (_value, row) => (
        <input
          type="checkbox"
          className={`} rounded-full px-3 py-1 text-xs font-semibold`}
          checked={Boolean(
            selectedItem && selectedItem.split(",").includes(row.PartCode)
          )}
          onChange={() => handleSelectItem(row.PartCode)}
        />
      ),
    },
  ];

  return (
    <ModalSkeleton title={"Part Issue To Engineer"} rolesAllowed={["sf/ssd"]} size="xl">
      <div className="w-xl space-y-6">
        <div className="grid grid-cols-2">
          <CustomDropdown
            label="Engineer Name"
            placeholder="Select Engineer"
            value={engineerId}
            onChange={(val) => {
              setEngineerId(val);
              const selected = engineerData.find((item) => item.value === val);
              setEngineerName(selected?.label || "");
            }}
            options={engineerData}
            required
          />
        </div>
        <Table rows={partData} columns={columnConfig} />
      </div>
      <Button onClick={handleSubmit} className="mt-8 ml-auto">
        Submit
      </Button>
    </ModalSkeleton>
  );
}
