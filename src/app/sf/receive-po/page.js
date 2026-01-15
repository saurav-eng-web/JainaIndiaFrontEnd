"use client";

import { type } from "os";

import { useState, useMemo } from "react";
import { Search, Send } from "lucide-react";
import toast from "react-hot-toast";

import { useTheme } from "@/theme/ThemeContext";
import PageSkeleton from "@/components/ui/PageSkeleton";
import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import Loading from "@/components/ui/Loading";
// unit 1 of 3 dispatched qty
// const rawData = [
//   {
//     id: "m5gr84i9",
//     challanNumber: "CH001",
//     complaintNumber: "CMP456",
//     partCode: "PC789",
//     partDesc: "Engine Oil Filter",
//     quantity: "3",
//   },
//   {
//     id: "3u1reuv4",
//     challanNumber: "CH002",
//     complaintNumber: "CMP123",
//     partCode: "PC101",
//     partDesc: "Brake Pads Set",
//     quantity: "3",
//   },
//   {
//     id: "derv1ws0",
//     challanNumber: "CH003",
//     complaintNumber: "CMP789",
//     partCode: "PC202",
//     partDesc: "Spark Plug Kit",
//     quantity: "1",
//   },
// ];

// two things: 1. if the user has clicked on the search without any query then we have to disabled the statuses and submit, read only allow
// 2. if there is a query then we have to enable the statuses and submit

// another thing the type of data will be different

export default function ReceivePO() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selections, setSelections] = useState({});
  const [actionsAllowed, setActionsAllowed] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoaing] = useState(false);
  const { colors } = useTheme();

  const handleStatusChange = (row, value) => {
    setSelections((prev) => ({
      ...prev,
      [row.id]: value,
    }));

    const filteredItems = selectedItem.filter((item) => item.id !== row.id);
    const updatedValue = value.toLowerCase();
    const receivedStatus = {
      ok: updatedValue === "ok" ? 1 : 0,
      damaged: updatedValue === "damaged" ? 1 : 0,
      short: updatedValue === "short" ? 1 : 0,
      wrong: updatedValue === "wrong" ? 1 : 0,
    };
    setSelectedItem([...filteredItems, { ...row, ...receivedStatus }]);
  };

  const handleSubmit = async () => {
    const totalItems = tableData.length;
    const selectedCount = Object.keys(selections).length;

    // const missingItems = expandedData.filter((row) => !selections[row.uniqueKey]);
    const unselectedItems = totalItems - selectedCount;
    if (unselectedItems > 0) {
      toast.error(
        `Please select a status for all items.\n${unselectedItems}  items are missing.`
      );
      return;
    }

    const payload = {
      type: "Receive",
      // ChallanNo: tableData[0].ChallanNo,
      payload: { data: selectedItem },
    };

    try {
      setIsLoaing(true);
      const res = await axiosInstance.post("po-receive/list", payload);
    } catch (error) {
      toast.error("Something went wrong while submitting, please try again");
      console.error(error);
    } finally {
      setIsLoaing(false);
    }

    toast.success("Payload generated successfully! Check console for details.");
  };

  const handleSearch = async () => {
    setTableData([]);
    setSelectedItem([]);
    setSelections({});
    const payload = {
      type: searchQuery.trim() ? "PendingSearch" : "Pending",
      search: searchQuery.trim(),
    };
    try {
      setIsLoaing(true);
      // wait the code here by timeout by 2 sec
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await axiosInstance.post("po-receive/list", payload);

      const data = res.data.data;
      if (data.length === 0) {
        toast.error("No results found");
        return;
      }
      const sortedByChallan = data.sort((a, b) => b.ChallanNumber - a.ChallanNumber);
      const sortedByPartCode = sortedByChallan.sort((a, b) =>
        a.PartCode.localeCompare(b.PartCode)
      );
      setTableData(sortedByPartCode);
      if (payload.type === "PendingSearch") {
        setActionsAllowed(true);
      } else {
        setActionsAllowed(false);
      }

      // console.log("res; ", res.data);
    } catch (error) {
      toast.error("Unable to search challan, please try again");
      console.error("Error searching challan:", error);
    } finally {
      setIsLoaing(false);
    }
  };

  const columns = [
    {
      label: "S. No",
      key: "sr",
      size: "xs",
      render: (v, r, index) => (
        <div className="flex justify-center">
          <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
            {index + 1}
          </span>
        </div>
      ),
      // render: (_v, _row, index) => <span className="badge">{index + 1}</span>,
    },
    {
      label: "Challan No",
      key: "ChallanNo",
      size: "md",
      render: (v) => <span className="font-medium text-slate-700">{v}</span>,
    },
    {
      label: "Complaint No",
      key: "Ticket_no",
      size: "lg",
      render: (v) => <span className="font-medium text-slate-700">{v}</span>,
    },
    {
      label: "Part Code",
      key: "PartCode",
      size: "md",
      render: (v) => (
        <div className="flex flex-col">
          <span className="font-semibold">{v}</span>
        </div>
      ),
    },
    {
      label: "Part Description",
      key: "PartDesc",
      size: "lg",
    },
    {
      label: "Received Status",
      key: "received",
      size: "xxl",
      render: (_v, row) => (
        <div className="flex flex-wrap items-center justify-start gap-4">
          <RadioOption
            name={row.id}
            value="ok"
            label="Ok"
            color="text-green-600"
            actionsAllowed={actionsAllowed}
            checked={selections[row.id] === "ok"}
            onChange={() => handleStatusChange(row, "ok")}
          />
          <RadioOption
            name={row.id}
            value="damaged"
            label="Damaged"
            color="text-red-600"
            actionsAllowed={actionsAllowed}
            checked={selections[row.id] === "damaged"}
            onChange={() => handleStatusChange(row, "damaged")}
          />
          <RadioOption
            name={row.id}
            value="short"
            label="Short"
            color="text-amber-600"
            actionsAllowed={actionsAllowed}
            checked={selections[row.id] === "short"}
            onChange={() => handleStatusChange(row, "short")}
          />
          <RadioOption
            name={row.id}
            value="wrong"
            label="Wrong"
            color="text-blue-600"
            actionsAllowed={actionsAllowed}
            checked={selections[row.id] === "wrong"}
            onChange={() => handleStatusChange(row, "wrong")}
          />
        </div>
      ),
    },
  ];

  return (
    <PageSkeleton title="Receive PO" rolesAllowed={["sf/ssd"]}>
      <div className="mb-8 flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search Challan or Part Code..."
          className="h-10 w-82 rounded-md border border-slate-300 bg-white px-3 py-2 pr-4 pl-9 text-sm ring-offset-white focus-visible:ring-2 focus-visible:ring-[#714b67] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-8 py-2 text-sm font-medium whitespace-nowrap text-white shadow ring-offset-white transition-colors hover:bg-[#4c3947] focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          style={{ backgroundColor: "#714b67" }}
        >
          {isLoading ? "Searching..." : "Search"}
          <Search className="ml-2 h-4 w-4" />
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table columns={columns} rows={tableData} isLoading={isLoading} />
        </div>
      </div>

      {/* Footer Actions */}
      {actionsAllowed && tableData.length > 0 && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md px-8 py-2 text-sm font-medium whitespace-nowrap text-white shadow ring-offset-white transition-colors hover:bg-[#5a3b52] focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            style={{ backgroundColor: "#714b67" }}
          >
            {isLoading ? "Submitting..." : "Submit"}
            <Send className="ml-2 h-4 w-4" />
          </button>
        </div>
      )}
    </PageSkeleton>
  );
}

function RadioOption({ name, value, label, checked, onChange, color, actionsAllowed }) {
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
          disabled={!actionsAllowed}
          className="peer h-4 w-4 border-slate-300 text-[#714b67] focus:ring-[#714b67]"
        />
      </div>
      <span className={`text-sm font-medium ${checked ? color : "text-slate-600"}`}>
        {label}
      </span>
    </label>
  );
}

// unique ids for every items
// response message for successful submission
// call updatecomplaint for every complaint numbers, what will the status and substatuses
