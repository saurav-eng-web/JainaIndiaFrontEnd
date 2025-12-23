"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import CustomDropdown from "@/components/common/Dropdown";
import { useTheme } from "@/theme/ThemeContext";
import axiosInstance from "@/api/axiosInstance";

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

export default function SendDefectivePage() {
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user);

  const [warehouseId, setWarehouseId] = useState("");
  const [challanType, setChallanType] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [challanTypeOptions, setChallanTypeOptions] = useState([]);
  // const []

  const [showDispatchForm, setShowDispatchForm] = useState(false);

  const [dispatchForm, setDispatchForm] = useState({
    courierType: "",
    courierCode: "",
    docketNo: "",
    challanDate: "",
    weight: "",
    dimensions: "",
    remark: "",
    box: "",
  });

  // const warehouseOptions = [
  //   { label: "UP-GUDSP", value: "UP-GUDSP" },
  //   { label: "DL-DWARKA", value: "DL-DWARKA" },
  // ];

  // const challanTypeOptions = [
  //   { label: "Defective", value: "Defective" },
  //   { label: "Replacement", value: "Replacement" },
  // ];

  useEffect(() => {
    let isMounted = true;

    async function fetchWarehouseAndChallanType() {
      setIsLoading(true);

      try {
        // 🔹 Parallel API calls
        const [warehouseRes, challanTypeRes] = await Promise.all([
          axiosInstance.post("DropdownMaster/GetDropdown", {
            type: "WarehouseSelect",
          }),
          axiosInstance.post("DropdownMaster/GetDropdown", {
            type: "ChallantypeRev",
          }),
        ]);

        if (!isMounted) return;

        setWarehouseOptions(
          warehouseRes?.data?.data.map((op) => {
            return {
              label: op.value,
              value: op.key,
            };
          }) ?? []
        );
        setChallanTypeOptions(
          challanTypeRes?.data?.data.map((op) => {
            return {
              label: op.value,
              value: op.value,
            };
          }) ?? []
        );
      } catch (error) {
        console.error("Error fetching warehouse and challan type:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchWarehouseAndChallanType();

    return () => {
      isMounted = false; // cleanup to avoid state update on unmounted component
    };
  }, []); // ✅ run once on mount

  const handleSearch = async () => {
    if (!warehouseId || !challanType) {
      toast.error("Please select warehouse and challan type");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("dispatch-line/list", {
        Sfid: user?.sF_ID.toString(), //
        Whs: warehouseId, // warehouse key dropdownid
        Type: challanType,
      });
      console.log("res: ", res);
      if (res?.data?.statusCode === 200) {
        const data = res?.data?.data;
        console.log("data: ", data);
        if (data.length === 0) {
          toast.error("No data found!");
        }

        setTableData(data);
      }
    } catch (error) {
      console.error("Error fetching warehouse and challan type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (item) => {
    if (selectedItems.some((x) => x.srNo === item.srNo)) {
      setSelectedItems(selectedItems.filter((x) => x.srNo !== item.srNo));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleNext = () => {
    if (selectedItems.length === 0) return;

    setDispatchForm({
      ...dispatchForm,
      docketNo: "Dkt-" + Date.now(),
      challanDate: new Date().toISOString().slice(0, 10),
    });

    setShowDispatchForm(true);
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
    <ProtectedRoute allowedRoles={["br", "asm", "zone", "sf/ssd"]}>
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />

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
              Send Defective To NWH
            </h2>

            {/* ---------------- FILTER SECTION ---------------- */}
            <div className="grid grid-cols-3 gap-6">
              <CustomDropdown
                label="Warehouse"
                placeholder="Select Warehouse"
                value={warehouseId}
                onChange={setWarehouseId}
                options={warehouseOptions}
              />

              <CustomDropdown
                label="Challan Type"
                placeholder="Select Challan Type"
                value={challanType}
                onChange={setChallanType}
                options={challanTypeOptions}
              />

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="cursor-pointer rounded-lg px-6 py-2 shadow-md"
                  style={{ background: colors.primary, color: "#fff" }}
                >
                  Search
                </button>
              </div>
            </div>

            {/* ---------------- TABLE SECTION ---------------- */}
            {tableData.length > 0 && (
              <div className="mt-6 rounded-lg border p-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr
                      className="text-left"
                      style={{ background: colors.primary, color: "white" }}
                    >
                      <th className="border p-2">Ticket No</th>
                      <th className="border p-2">Part Code</th>
                      <th className="border p-2">Description</th>
                      <th className="border p-2">Quantity</th>
                      <th className="border p-2">Price</th>
                      <th className="border p-2">Aging</th>
                      <th className="border p-2 text-center">Select</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tableData.map((item) => (
                      <tr key={item.srNo}>
                        <td className="border p-2">{item.ticket_no}</td>
                        <td className="border p-2">{item.Part}</td>
                        <td className="border p-2">{item["Part desc"]}</td>
                        <td className="border p-2">{item.QTY}</td>
                        <td className="border p-2">{item.Price}</td>
                        <td className="border p-2">{item.Ageing}</td>

                        <td className="border p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.some((x) => x.srNo === item.srNo)}
                            onChange={() => toggleSelection(item)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* NEXT BUTTON */}
                {selectedItems.length > 0 && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={handleNext}
                      className="rounded-lg px-6 py-2 shadow-md"
                      style={{ background: colors.primary, color: "#fff" }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}

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
                  {/* Type of Courier */}
                  <div>
                    <label className="mb-1 block font-medium">Type of Courier</label>
                    <input
                      name="courierType"
                      value={dispatchForm.courierType}
                      onChange={onDispatchChange}
                      readOnly
                      placeholder="Local Service Provider"
                      className="w-full cursor-not-allowed rounded border bg-gray-100 p-2"
                    />
                  </div>

                  {/* Courier Code */}
                  <div>
                    <label className="mb-1 block font-medium">Courier Code</label>
                    <input
                      name="courierCode"
                      value={dispatchForm.courierCode}
                      onChange={onDispatchChange}
                      placeholder="Trackon001"
                      readOnly
                      className="w-full cursor-not-allowed rounded border bg-gray-100 p-2"
                    />
                  </div>

                  {/* Docket No */}
                  <div>
                    <label className="mb-1 block font-medium">Docket No.</label>
                    <input
                      name="docketNo"
                      value={dispatchForm.docketNo}
                      readOnly
                      className="w-full cursor-not-allowed rounded border bg-gray-100 p-2"
                    />
                  </div>

                  {/* Challan Date */}
                  <div>
                    <label className="mb-1 block font-medium">Challan Date</label>
                    <input
                      type="date"
                      name="challanDate"
                      value={dispatchForm.challanDate}
                      readOnly
                      className="w-full cursor-not-allowed rounded border bg-gray-100 p-2"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="mb-1 block font-medium">Weight (In grams)</label>
                    <input
                      name="weight"
                      value={dispatchForm.weight}
                      onChange={onDispatchChange}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="mb-1 block font-medium">
                      Dimensions (L*B*H in cm)
                    </label>
                    <input
                      name="dimensions"
                      value={dispatchForm.dimensions}
                      onChange={onDispatchChange}
                      className="w-full rounded border p-2"
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
                    />
                  </div>

                  {/* Box */}
                  <div>
                    <label className="mb-1 block font-medium">Box</label>
                    <input
                      name="box"
                      value={dispatchForm.box}
                      onChange={onDispatchChange}
                      className="w-full rounded border p-2"
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
                    Dispatch
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
