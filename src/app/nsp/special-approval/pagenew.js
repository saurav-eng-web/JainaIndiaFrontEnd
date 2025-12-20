"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import CustomDropdown from "@/components/common/Dropdown";
import { useTheme } from "@/theme/ThemeContext";

// ---------------- MOCK TABLE DATA -------------------
const mockTableData = [
  {
    srNo: 1,
    ticketNo: "PBSW2505271294805",
    partCode: "SSNWMSAPSMOTWM002",
    description: "Wash Motor 180 Watt ( Al. Winding )",
    warranty: "In Warranty",
    packingSlipNo: "JPS-2526-0005440",
    serialNo: "NA",
    qty: 1,
  },
  {
    srNo: 2,
    ticketNo: "PBSW2505291296442",
    partCode: "SSNWMSASSBELSB001",
    description: "RUBBER SEAL FOR DRAIN VALVE (JSPI40S-2024)",
    warranty: "In Warranty",
    packingSlipNo: "JPS-2526-0005765",
    serialNo: "NA",
    qty: 2,
  },
];

export default function SpeicalApprovalPopup() {
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user);

  const [warehouse, setWarehouse] = useState("");

  const [showDispatchForm, setShowDispatchForm] = useState(false);

  const warehouseOptions = [
    { label: "transport", value: "transport" },
    { label: "other", value: "other" },
  ];

  const handleSearch = () => {
    setTableData(mockTableData);
  };

  const onDispatchChange = (e) => {
    setDispatchForm({ ...dispatchForm, [e.target.name]: e.target.value });
  };

  // >>>>>>>>>>>>>>> ADD THIS NEW FUNCTION <<<<<<<<<<<<<<<
  const handleSubmitDispatch = () => {
    alert("Dispatch Submitted Successfully!");
    // Here you will call actual API later.
  };

  return (
    <ProtectedRoute allowedRoles={["br", "asm", "zone"]}>
      <div className="flex rounded-2xl bg-gray-100">
        <div className="flex-1 pt-10 pr-20 pl-30">
          <div className="w-full rounded-2xl bg-white p-8 shadow-lg">
            {/* ---------------- PAGE TITLE ---------------- */}
            <h2
              className="mb-8 text-2xl font-bold"
              style={{
                color: colors.primary,
                border: `2px solid ${colors.primary}`,
                padding: 5,
                borderRadius: 6,
                fontSize: 18,
              }}
            >
              Special Allowance
            </h2>

            {/* ---------------- FILTER SECTION ---------------- */}
            <div className="grid grid-cols-3 gap-6">
              <CustomDropdown
                label="Special Allowance Type"
                placeholder="Select Allowance Type"
                value={warehouse}
                onChange={setWarehouse}
                options={warehouseOptions}
              />

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="rounded-lg px-6 py-2 shadow-md"
                  style={{ background: colors.primary, color: "#fff" }}
                >
                  Search
                </button>
              </div>
            </div>

            {/* ---------------- DISPATCH FORM ---------------- */}
            {showDispatchForm && (
              <div className="mt-6 rounded-xl border bg-white p-6 shadow-lg">
                <h3
                  className="mb-4 text-2xl font-semibold"
                  style={{ color: colors.primary }}
                >
                  Dispatch Detail
                </h3>

                <div className="grid grid-cols-3 gap-6">
                  {/* Dimensions */}
                  <div>
                    <label className="mb-1 block font-medium">Amount</label>
                    <input
                      type="number"
                      name="dimensions"
                      value={dispatchForm.dimensions}
                      onChange={onDispatchChange}
                      className="w-full rounded border p-2"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* Remark */}
                  <div className="col-span-3">
                    <label className="mb-1 block font-medium">Remark</label>
                    <textarea
                      name="remark"
                      value={dispatchForm.remark}
                      onChange={onDispatchChange}
                      className="h-24 w-full rounded border p-2"
                      placeholder="Enter Remarks"
                    />
                  </div>
                </div>

                {/* >>>>>>>>>>> SUBMIT BUTTON ADDED HERE <<<<<<<<<<< */}
                <div className="mt-6 text-right">
                  <button
                    onClick={handleSubmitDispatch}
                    className="rounded-lg px-8 py-3 font-semibold text-white shadow-md"
                    style={{ background: colors.primary }}
                  >
                    Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
