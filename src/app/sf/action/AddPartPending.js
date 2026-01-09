"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, CheckCircle2 } from "lucide-react";

import CustomDropdown from "@/components/common/Dropdown";
import Table from "@/components/common/Table";
import { useTheme } from "@/theme/ThemeContext";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import Modal from "@/components/ui/Modal";
import axiosInstance from "@/api/axiosInstance";

// ---- MOCK TICKET TABLE ----


export default function AddPartPending({ ticketNumber }) {
  const { colors } = useTheme();

  const [selectedPart, setSelectedPart] = useState(null);
  const [showSerial, setShowSerial] = useState(false);
  const [serialNo, setSerialNo] = useState("");
  const [grid, setGrid] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isValidSerialNumber, setIsValidSerialNumber] = useState(false);
  const [saveConfirmationOpen, setSaveConfirmationOpen] = useState(false);

  const normalizeBoolean = (value) => String(value).toLowerCase() === "true";

  function parseKeyValueString(str) {
    if (!str) return {};
    // Robust cleanup: remove leading/trailing braces and whitespace
    let cleaned = str.trim();
    if (cleaned.startsWith("{")) cleaned = cleaned.slice(1);
    if (cleaned.endsWith("}")) cleaned = cleaned.slice(0, -1);
    
    const pairs = cleaned.split(",");
    const result = {};

    pairs.forEach((pair) => {
      const parts = pair.split(":");
      if (parts.length < 2) return;
      
      const key = parts[0].trim();
      const valueStr = parts.slice(1).join(":").trim(); // Re-join in case value contains :

      let value = valueStr;
      // convert number if applicable
      if (!isNaN(value) && value !== "") {
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

        // Ensure we filter out parts already in the grid if any (though grid starts empty usually)
        const gridPartCodes = new Set(grid.map(g => g.partCode));
        
        const dropdownData = res.data.data
          .filter(item => !gridPartCodes.has(item.key))
          .map((item) => ({
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
    // We only want to run this once on mount/ticket change, not when grid changes 
    // to avoid re-fetching and overriding our local filtering logic.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setIsValidSerialNumber(false);
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

      const message = res.data?.statusMsg || "";
      // Check for presence of key data fields to confirm success/data payload
      if (message.includes("Inventory Type") || message.includes("Price")) {
        const parts = message.split("|");
        // Assume the data object is after the first pipe
        const msgData = parts.length > 1 ? parts[1] : parts[0]; 
        
        const data = parseKeyValueString(msgData);
        
        setGrid((prev) => [
          ...prev,
          {
            partCode: selectedPart.value,
            desc: selectedPart.label,
            inventoryType: data["Inventory Type"] || "N/A",
            price: data["Price"] || 0,
            availableQty: data["Qty"] || 0,
            poQty: 1,
            serialNo: showSerial ? serialNo : "",
            isSerialised: selectedPart.isSerialised,
          },
        ]);

        setDropdownOptions((prev) =>
          prev.filter((item) => item.value !== selectedPart.value)
        );

        setSelectedPart(null);
        setSerialNo("");
        setShowSerial(false);
        setIsValidSerialNumber(false);
      } else {
        // Handle rejection or simple message cases
        const parts = message.includes("|") ? message.split("|") : [message];
        const msg = parts[0];
        const qty = parts[1] ? parts[1].trim() : null;
        
        toast.error(
          <div>
            <p>{msg}</p>
            {qty && <p className="text-sm mt-1">Available Qty: {qty}</p>}
          </div>
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate part");
    }
  };

  const handleDelete = (data) => {
    const itemToDelete = data;
    setGrid((prev) => prev.filter((item) => item.partCode !== data.partCode));

    if (itemToDelete) {
      setDropdownOptions((prev) => {
        const newOptions = [
          ...prev,
          {
            label: itemToDelete.desc,
            value: itemToDelete.partCode,
            message: itemToDelete.isSerialised,
          },
        ];
        // Optional: Sort options alphabetically by label so the restored item is in place
        return newOptions.sort((a, b) => a.label.localeCompare(b.label));
      });
    }
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
        setIsValidSerialNumber(false);
      }
    } catch (error) {
      toast.error("Invalid serial number");
      console.error(error);
    }
  };

  function handleSaveClick() {
    setSaveConfirmationOpen(true);
  }

  function onConfirmSave() {
    const payload = {
      TicketNo: ticketNumber,
      data: grid.map((item) => ({
        partCode: item.partCode,
        inventoryType: item.inventoryType,
        price: item.price,
        serialNo: item.serialNo || "",
      }))
    };
    console.log('payload: ', payload);
    setSaveConfirmationOpen(false);
  }

  /* ---------------- GRID TABLE CONFIG ---------------- */

  const gridColumns = [
    {
      label: "Part Code",
      key: "partCode",
      size: "md",
      render: (value) => (
        <div className="font-semibold text-gray-700">{value}</div>
      ),
    },
    {
      label: "Desc.",
      key: "desc",
      size: "xl",
      render: (value) => <span className="text-gray-600 text-sm">{value}</span>,
    },
    {
      label: "Inventory Type",
      key: "inventoryType",
      size: "sm",
      render: (value) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            value === "Free"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      label: "Price",
      key: "price",
      size: "xs",
      render: (value) => <span className="font-medium">₹{value}</span>,
    },
    {
      label: "Available Qty",
      key: "availableQty",
      size: "xs",
      render: (value) => (
        <div className="w-16 rounded bg-white py-1 text-center text-sm  text-gray-700 border border-gray-300 shadow-sm">
            {value}
        </div>
      ),
    },
    {
      label: "PO Qty",
      key: "poQty",
      size: "xs",
      render: (value) => (
        <div className="w-16 rounded bg-white py-1 text-center text-sm  text-gray-900 ">
          {value}
        </div>
      ),
    },
    {
      label: "Serial Number",
      key: "serialNo",
      size: "md",
      render: (value) => value ? <span className="text-sm font-mono bg-gray-100 px-1 rounded">{value}</span> : <span className="text-gray-400">-</span>,
    },
    {
      label: "",
      key: "action",
      size: "xs",
      render: (_value, _row, index) => (
        <button
          onClick={() => handleDelete(_row)}
          className="p-1.5 text-red-500 hover:bg-red-50 cursor-pointer hover:text-red-700 rounded transition-colors"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ];



  return (
    <ModalSkeleton title="Add PO" rolesAllowed={["sf/ssd"]} size="xl">
      {/* PART SELECTION */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Select Part to Add
        </h3>
        <div className="flex items-end gap-4">
          <div className="basis-3/5">
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
              <div className="flex-1 min-w-[200px]">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Serial Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    value={serialNo}
                    onChange={(e) => {
                      setSerialNo(e.target.value);
                      setIsValidSerialNumber(false); // Reset validation on change
                    }}
                    className="w-full rounded-lg h-11 p-2 pr-10 border shadow-sm focus:border-[#714b67] focus:ring-[#714b67]"
                    placeholder="Enter Serial Number"
                    style={{ borderColor: isValidSerialNumber ? "green" : colors.primary }}
                  />
                  {isValidSerialNumber && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>
              </div>
              <div className="w-24 flex-none">
                <button
                  onClick={checkSerialNumber}
                  className="h-10 rounded-lg w-full text-sm font-medium text-white shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ background: colors.primary }}
                >
                  Check
                </button>
              </div>
            </>
          )}

          {selectedPart &&
            (!selectedPart.isSerialised ||
              (selectedPart.isSerialised && isValidSerialNumber)) && (
              <div className="  flex-none">
                <button
                  onClick={handleAddToGrid}
                  className="h-10 w-24 rounded-lg px-6 font-medium text-white shadow-md transition-transform cursor-pointer hover:scale-105 active:scale-95"
                  style={{ background: colors.primary }}
                >
                  Add 
                </button>
               </div>
            )}
        </div>
      </div>

      {/* GRID TABLE */}
      {grid.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mb-8">
            <h4 className="mb-2 text-sm font-semibold text-gray-700">Added Parts</h4>
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <Table columns={gridColumns} rows={grid} />
            </div>

            <div className="mt-4 flex justify-end">
                <button
                onClick={handleSaveClick}
                className="rounded-lg border px-8 py-2.5 text-sm font-semibold cursor-pointer text-white transition-transform hover:scale-105 active:scale-95"
                style={{
                    background: colors.primary,
                    borderColor: colors.primary,
                }}
                >
                Save Changes
                </button>
            </div>
        </div>
      )}

 

      <Modal open={saveConfirmationOpen} onClose={() => setSaveConfirmationOpen(false)} center>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Save</h3>
          <p className="text-gray-600 mb-8">Are you sure you want to save these changes? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSaveConfirmationOpen(false)}
              className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmSave}
              className="px-4 py-2 cursor-pointer rounded-lg text-white transition-transform hover:scale-105 active:scale-95"
              style={{ background: colors.primary }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

    </ModalSkeleton>
  );
}
