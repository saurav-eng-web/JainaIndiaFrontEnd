import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import { Button } from "@/components/ui/button";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import RadioOption from "@/components/ui/RadioOption";
import { useTheme } from "@/theme/ThemeContext";

export default function PartConsume({ ticketNo, onClose }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use a map for O(1) lookup and updates: { [SFReceivePOID]: status }
  // status can be "consume", "notRequired", "freshFaulty"
  const [selections, setSelections] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (!ticketNo) {
        return;
      }

      try {
        setIsLoading(true);
        const res = await axiosInstance.post("consumption/process", {
          type: "PNAPartDetail",
          ticket_no: ticketNo,
        });

        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          setData(res.data.data);
        } else {
          toast.error("No data found");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [ticketNo]);

  const handleStatusChange = (status, sfDetailsId) => {
    setSelections((prev) => ({
      ...prev,
      [sfDetailsId]: status,
    }));
  };

  async function handleSubmit() {
    if (data.length === 0) {
      toast.error("No items to submit.");
      return;
    }

    const unselectedItems = data.filter((item) => !selections[item.SFReceivePOID]);

    if (unselectedItems.length > 0) {
      toast.error(
        `Please select a status for all items. Missing: ${unselectedItems.length}`
      );
      return;
    }

    const formattedData = data.map((item) => {
      const status = selections[item.SFReceivePOID];
      return {
        ...item,
        consume: status === "consume" ? 1 : 0,
        notRequired: status === "notRequired" ? 1 : 0,
        freshFaulty: status === "freshFaulty" ? 1 : 0,
      };
    });

    const payload = {
      type: "PNAPartConsume",
      ticket_no: ticketNo,
      data: formattedData,
    };
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("consumption/process", payload);

      if (
        res.data.statusCode === 200 &&
        res.data.statusMsg.includes("Record Inserted Successfully")
      ) {
        toast.success(res.data.statusMsg || "Submitted successfully");
        onClose();
      } else {
        toast.error(res.data.statusMsg || "Submission failed");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Unable to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const tableConfig = useMemo(
    () => [
      { label: "S. No", key: "id", size: "xs", render: (_v, _row, index) => index + 1 },
      { label: "Part Code", key: "Partcode", size: "sm" },
      { label: "Description", key: "PartDesc", size: "xl" },
      { label: "Avail. Qty", key: "OKQty", size: "xs" },
      { label: "PO Qty", key: "poQty", size: "xs", render: () => 1 },
      { label: "Inv. Type", key: "InventoryType", size: "sm" },
      {
        label: "Action",
        key: "action",
        size: "xxxl",
        render: (_value, row) => {
          const currentSelection = selections[row.SFReceivePOID];
          const groupName = `receivedStatus-${row.SFReceivePOID}`;

          return (
            <div className="flex items-center justify-between gap-3">
              <RadioOption
                name={groupName}
                value="freshFaulty"
                label="Fresh Faulty"
                color="text-red-600"
                checked={currentSelection === "freshFaulty"}
                onChange={() => handleStatusChange("freshFaulty", row.SFReceivePOID)}
              />
              <RadioOption
                name={groupName}
                value="consume"
                label="Consume"
                color="text-green-600"
                checked={currentSelection === "consume"}
                onChange={() => handleStatusChange("consume", row.SFReceivePOID)}
              />
              <RadioOption
                name={groupName}
                value="notRequired"
                label="Not Required"
                color="text-yellow-600"
                checked={currentSelection === "notRequired"}
                onChange={() => handleStatusChange("notRequired", row.SFReceivePOID)}
              />
            </div>
          );
        },
      },
    ],
    [selections]
  );

  return (
    <ModalSkeleton title="Part Consume" size="xl">
      <Table columns={tableConfig} rows={data} isLoading={isLoading} />
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </ModalSkeleton>
  );
}
