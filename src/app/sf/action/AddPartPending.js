"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CustomDropdown from "@/components/common/Dropdown";
import Table from "@/components/common/Table";
import { useTheme } from "@/theme/ThemeContext";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import axiosInstance from "@/api/axiosInstance";

// ---- MOCK TICKET TABLE ----
const ticketData = [
  {
    ticketNo: "MHSL250127164648",
    partCode: "SSNTVSVEUPNLP005",
    desc: "LED Panel (BOE)",
    qty: 1,
  },
  {
    ticketNo: "MHSL250127164648",
    partCode: "SSNTVSVEUPCBMB002",
    desc: "Main Board",
    qty: 1,
  },
];

export default function AddPartPending({ ticketNumber }) {
  const { colors } = useTheme();

  const [selectedPart, setSelectedPart] = useState(null);
  const [showSerial, setShowSerial] = useState(false);
  const [serialNo, setSerialNo] = useState("");
  const [grid, setGrid] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isValidSerialNumber, setIsValidSerialNumber] = useState(false);

  const normalizeBoolean = (value) => String(value).toLowerCase() === "true";

  function parseKeyValueString(str) {
    const cleaned = str.replace(/^{|}$/g, ""); // remove { }
    const pairs = cleaned.split(",");

    const result = {};

    pairs.forEach((pair) => {
      const [rawKey, rawValue] = pair.split(":");

      const key = rawKey.trim();

      let value = rawValue.trim();

      // convert number if applicable
      if (!isNaN(value)) {
        value = Number(value);
      }

      result[key] = value;
    });

    return result;
  }

  useEffect(() => {
    async function getDropdown() {
      try {
        const res = await axiosInstance.post("DropdownMaster/GetDropdown", {
          type: "PartCodePO",
          dispatchType: ticketNumber,
        });

        const dropdownData = res.data.data.map((item) => ({
          label: item.value,
          value: item.key,
          message: normalizeBoolean(item.message),
        }));

        setDropdownOptions(dropdownData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }

    getDropdown();
  }, [ticketNumber]);

  const handlePartSelect = (selectedValue) => {
    const part = dropdownOptions.find((item) => item.value === selectedValue);
    if (!part) return;
    const isSerialised = normalizeBoolean(part.message);
    setSelectedPart({
      label: part.label,
      value: part.value,
      isSerialised,
    });

    setSerialNo("");
    setShowSerial(isSerialised);
  };

  const handleAddToGrid = async () => {
    if (!selectedPart) return;

    if (showSerial && !isValidSerialNumber) {
      toast.error("Valid serial number is required!");
      return;
    }

    try {
      const res = await axiosInstance.post("po-validation/check", {
        PartCode: selectedPart.value,
        Type: "stockcheck",
        TicketNo: ticketNumber,
      });

      const message = res.data?.statusMsg;
      if (message.includes("Inventory Type")) {
        const msgData = message.split("|")[1];
        const data = parseKeyValueString(msgData);
        console.log("msgData: ", msgData);
        console.log("data: ", data);
        setGrid((prev) => [
          ...prev,
          {
            partCode: selectedPart.value,
            desc: selectedPart.label,
            inventoryType: data["Inventory Type"],
            price: data["Price"],
            availableQty: data["Qty"],
            poQty: 1,
            // availability: "No",
            serialNo: showSerial ? serialNo : "",
          },
        ]);

        setSelectedPart(null);
        setSerialNo("");
        setShowSerial(false);
        setIsValidSerialNumber(false);
      } else {
        const msg = message.split("|")[0] || message;
        const qty = message.split("|")[1] || 0;
        toast.error(`${msg} ${qty > 0 ? `Available qty: ${qty}` : ""}`);
      }
      console.log("message: ", message);
      console.log("res: ", res);
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (rowIndex) => {
    setGrid((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  const checkSerialNumber = async () => {
    if (!serialNo) {
      toast.error("Please enter serial number");
      return;
    }

    try {
      const partCode = selectedPart.value;
      const res = await axiosInstance.post("CheckSerialNo/CheckSerial", {
        serialNo,
        ticketNo: `${ticketNumber}|${partCode}`,
        pincode: 0,
        type: "partcodeserialno",
      });

      if (res.data.message === "Valid serial no") {
        setIsValidSerialNumber(true);
        toast.success("Serial number is valid");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Invalid serial number");
      console.error(error);
    }
  };

  /* ---------------- GRID TABLE CONFIG ---------------- */

  const gridColumns = [
    {
      label: "Part Code",
      key: "partCode",
      size: "md",
      render: (value) => <span className="text-blue-600">{value}</span>,
    },
    {
      label: "Desc.",
      key: "desc",
      size: "xl",
    },
    {
      label: "Inventory Type",
      key: "inventoryType",
      size: "sm",
      render: (value) => <span className="text-red-600">{value}</span>,
    },
    {
      label: "Price",
      key: "price",
      size: "sm",
    },
    {
      label: "Available Qty",
      key: "availableQty",
      size: "xs",
      render: (value) => (
        <input value={value} readOnly className="w-14 rounded border p-1 text-center" />
      ),
    },
    {
      label: "PO Qty",
      key: "poQty",
      size: "xs",
      render: (value) => (
        <input value={value} readOnly className="w-14 rounded border p-1 text-center" />
      ),
    },
    {
      label: "Serial Number",
      key: "serialNo",
      size: "md",
    },
    {
      label: "",
      key: "action",
      size: "xs",
      render: (_value, _row, index) => (
        <button
          onClick={() => handleDelete(index)}
          className="text-sm font-semibold text-red-600 hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  /* ---------------- TICKET TABLE CONFIG ---------------- */

  const ticketColumns = [
    { label: "Ticket Number", key: "ticketNo", size: "lg" },
    { label: "Part Code", key: "partCode", size: "lg" },
    { label: "Part Desc.", key: "desc", size: "xl" },
    {
      label: "PO Qty",
      key: "qty",
      size: "xs",
      render: (value) => <span className="block text-center">{value}</span>,
    },
  ];

  return (
    <ModalSkeleton title="Add Part Pending" rolesAllowed={["sf/ssd"]} size="xl">
      {/* PART SELECTION */}
      <div className="mb-4 grid grid-cols-5 items-end gap-6">
        <div className="col-span-3">
          <CustomDropdown
            label="Part Code"
            placeholder="Select Part"
            value={selectedPart?.value || ""}
            onChange={handlePartSelect}
            options={dropdownOptions}
          />
        </div>

        {showSerial && (
          <>
            <div>
              <label className="mb-1 block font-medium">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <input
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                className="w-full rounded border p-2"
                placeholder="Enter Serial Number"
              />
            </div>
            <button
              onClick={checkSerialNumber}
              className="h-10 rounded-lg px-4 text-white"
              style={{ background: colors.primary }}
            >
              Check Serial
            </button>
          </>
        )}
      </div>

      {selectedPart &&
        (!selectedPart.isSerialised ||
          (selectedPart.isSerialised && isValidSerialNumber)) && (
          <button
            onClick={handleAddToGrid}
            className="mb-6 rounded-lg px-6 py-2 text-white"
            style={{ background: colors.primary }}
          >
            Add to Grid
          </button>
        )}

      {/* GRID TABLE */}
      {grid.length > 0 && (
        <>
          <Table columns={gridColumns} rows={grid} />

          <div className="mt-4 text-right">
            <button
              className="rounded-lg border px-10 py-2"
              style={{
                color: colors.primary,
                borderColor: colors.primary,
              }}
            >
              Save
            </button>
          </div>
        </>
      )}

      {/* TICKET TABLE */}
      {grid.length > 0 && (
        <div className="mt-8">
          <Table columns={ticketColumns} rows={ticketData} />
        </div>
      )}
    </ModalSkeleton>
  );
}
