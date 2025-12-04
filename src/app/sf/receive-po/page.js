"use client";

import { useState, useMemo } from "react";

import SideBar from "@/components/SideBar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
// import { Search, Send } from "lucide-react";
// unit 1 of 3 dispatched qty
const rawData = [
  {
    id: "m5gr84i9",
    challanNumber: "CH001",
    complaintNumber: "CMP456",
    partCode: "PC789",
    partDesc: "Engine Oil Filter",
    quantity: "3",
  },
  {
    id: "3u1reuv4",
    challanNumber: "CH002",
    complaintNumber: "CMP123",
    partCode: "PC101",
    partDesc: "Brake Pads Set",
    quantity: "3",
  },
  {
    id: "derv1ws0",
    challanNumber: "CH003",
    complaintNumber: "CMP789",
    partCode: "PC202",
    partDesc: "Spark Plug Kit",
    quantity: "1",
  },
];

export default function ReceivePO() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selections, setSelections] = useState({});

  const expandedData = useMemo(() => {
    return rawData.flatMap((item) => {
      const qty = parseInt(item.quantity, 10) || 0;
      return Array.from({ length: qty }).map((_, index) => ({
        ...item,
        uniqueKey: `${item.id}-${index}`,
        subIndex: index + 1,
        totalQty: qty,
      }));
    });
  }, []);

  const handleStatusChange = (uniqueKey, value) => {
    setSelections((prev) => ({
      ...prev,
      [uniqueKey]: value,
    }));
  };

  // 3. Submit Logic: Aggregate counts with Validation
  const handleSubmit = () => {
    // const totalItems = expandedData.length;
    // const selectedCount = Object.keys(selections).length;

    const missingItems = expandedData.filter((row) => !selections[row.uniqueKey]);

    if (missingItems.length > 0) {
      alert(
        `Please select a status for all items.\n${missingItems.length}  items are missing.`
      );
      return;
    }

    const payload = {};

    // Initialize payload structure for all items to ensure 0s are present
    rawData.forEach((item) => {
      payload[item.id] = { ok: 0, short: 0, wrong: 0, damaged: 0 };
    });

    // Iterate through current expanded rows to aggregate counts
    expandedData.forEach((row) => {
      const status = selections[row.uniqueKey];

      // If a selection has been made for this row
      if (status && payload[row.id]) {
        payload[row.id][status] += 1;
      }
    });

    console.log(payload);
    alert("Payload generated successfully! Check console for details.");
  };

  return (
    <>
      <ProtectedRoute allowedRoles={["sf/ssd"]}>
        <SideBar />
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
          {/* Header Section */}
          <header
            className="w-full text-white shadow-md"
            style={{ backgroundColor: "#714b67" }}
          >
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-2xl font-bold tracking-tight">Receive against PO</h1>
            </div>
          </header>

          <main className="container mx-auto flex-1 px-4 py-8">
            {/* Top Controls */}
            <div className="mb-8 flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-sm">
                {/* <Search className="absolute top-2.5 right-2.5 h-4 w-4 text-slate-400" /> */}
                <input
                  type="text"
                  placeholder="Search Challan or Part Code..."
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-4 pl-9 text-sm ring-offset-white focus-visible:ring-2 focus-visible:ring-[#714b67] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={handleSubmit}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-8 py-2 text-sm font-medium whitespace-nowrap text-white shadow ring-offset-white transition-colors hover:bg-[#4c3947] focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                style={{ backgroundColor: "#714b67" }}
              >
                Search
                {/* <Search className="ml-2 h-4 w-4" /> */}
              </button>
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-md h-16 border-b border-slate-200 bg-[#714b67] font-medium text-slate-100">
                    <tr>
                      <th className="h-12 px-4 text-center align-middle">S. No</th>
                      <th className="h-12 px-4 align-middle">Challan No</th>
                      <th className="h-12 px-4 align-middle">Complaint No</th>
                      <th className="h-12 px-4 align-middle">Part Code</th>
                      <th className="h-12 px-4 align-middle">Part Description</th>
                      <th className="h-12 px-4 text-center align-middle">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expandedData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-500">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      expandedData.map((row, idx) => (
                        <tr
                          key={row.uniqueKey}
                          className="transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100"
                        >
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                              {idx + 1}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-700">
                            {row.challanNumber}
                          </td>
                          <td className="p-4 font-medium text-slate-700">
                            {row.complaintNumber}
                          </td>
                          <td className="p-4 text-slate-600">
                            <div className="flex flex-col">
                              <span className="font-semibold">{row.partCode}</span>
                              {/* Show which item number this is (e.g., 1 of 5) */}
                              <span className="text-[10px] text-slate-400">
                                Unit {row.subIndex} of {row.totalQty} dispatched qty
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600">{row.partDesc}</td>

                          <td className="py-4">
                            <div className="flex flex-wrap items-center justify-center gap-4">
                              <RadioOption
                                name={row.uniqueKey}
                                value="ok"
                                label="Ok"
                                color="text-green-600"
                                checked={selections[row.uniqueKey] === "ok"}
                                onChange={() => handleStatusChange(row.uniqueKey, "ok")}
                              />
                              <RadioOption
                                name={row.uniqueKey}
                                value="damaged"
                                label="Damaged"
                                color="text-red-600"
                                checked={selections[row.uniqueKey] === "damaged"}
                                onChange={() =>
                                  handleStatusChange(row.uniqueKey, "damaged")
                                }
                              />
                              <RadioOption
                                name={row.uniqueKey}
                                value="short"
                                label="Short"
                                color="text-amber-600"
                                checked={selections[row.uniqueKey] === "short"}
                                onChange={() =>
                                  handleStatusChange(row.uniqueKey, "short")
                                }
                              />
                              <RadioOption
                                name={row.uniqueKey}
                                value="wrong"
                                label="Wrong"
                                color="text-blue-600"
                                checked={selections[row.uniqueKey] === "wrong"}
                                onChange={() =>
                                  handleStatusChange(row.uniqueKey, "wrong")
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md px-8 py-2 text-sm font-medium whitespace-nowrap text-white shadow ring-offset-white transition-colors hover:bg-[#5a3b52] focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                style={{ backgroundColor: "#714b67" }}
              >
                Submit
                {/* <Send className="ml-2 h-4 w-4" /> */}
              </button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
}

function RadioOption({ name, value, label, checked, onChange, color }) {
  return (
    <label
      className={`group flex cursor-pointer items-center space-x-2 ${
        checked ? "opacity-100" : "opacity-60 hover:opacity-100"
      }`}
    >
      <div className="relative flex items-center">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="peer h-4 w-4 border-slate-300 text-[#714b67] focus:ring-[#714b67]"
        />
      </div>
      <span className={`text-sm font-medium ${checked ? color : "text-slate-600"}`}>
        {label}
      </span>
    </label>
  );
}
