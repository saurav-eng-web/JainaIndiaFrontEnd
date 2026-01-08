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

    setSelectedPart({
      label: part.label,
      value: part.value,
      isSerialised: normalizeBoolean(part.message),
    });

    setSerialNo("");
    setShowSerial(part.message === "True");
  };

  const handleAddToGrid = () => {
    if (!selectedPart) return;

    if (showSerial && !isValidSerialNumber) {
      toast.error("Valid serial number is required!");
      return;
    }

    setGrid((prev) => [
      ...prev,
      {
        partCode: selectedPart.value,
        desc: selectedPart.label,
        inventoryType: "Paid",
        price: "300.00",
        availableQty: 0,
        poQty: 1,
        availability: "No",
        serialNo: showSerial ? serialNo : "",
      },
    ]);

    setSelectedPart(null);
    setSerialNo("");
    setShowSerial(false);
    setIsValidSerialNumber(false);
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

// "use client";

// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// import CustomDropdown from "@/components/common/Dropdown";
// import { useTheme } from "@/theme/ThemeContext";
// import ModalSkeleton from "@/components/ui/ModalSkeleton";
// import axiosInstance from "@/api/axiosInstance";

// // ---- MOCK TICKET TABLE ----
// const ticketData = [
//   {
//     ticketNo: "MHSL250127164648",
//     partCode: "SSNTVSVEUPNLP005",
//     desc: "LED Panel (BOE)",
//     qty: 1,
//   },
//   {
//     ticketNo: "MHSL250127164648",
//     partCode: "SSNTVSVEUPCBMB002",
//     desc: "Main Board",
//     qty: 1,
//   },
// ];

// export default function AddPartPending({ ticketNumber }) {
//   const { colors } = useTheme();

//   const [selectedPart, setSelectedPart] = useState(null);
//   const [showSerial, setShowSerial] = useState(false);
//   const [serialNo, setSerialNo] = useState("");
//   const [grid, setGrid] = useState([]);
//   const [dropdownOptions, setDropdownOptions] = useState([]);
//   const [isValidSerialNumber, setIsValidSerialNumber] = useState(false);

//   const normalizeBoolean = (value) => String(value).toLowerCase() === "true";

//   useEffect(() => {
//     async function getDropdown() {
//       try {
//         const res = await axiosInstance.post("DropdownMaster/GetDropdown", {
//           type: "PartCodePO",
//           dispatchType: ticketNumber,
//         });
//         const data = res.data.data;
//         const dropdownData = data.map((item) => ({
//           label: item.value,
//           value: item.key,
//           message: normalizeBoolean(item.message),
//         }));
//         setDropdownOptions(dropdownData);
//       } catch (error) {
//         console.error("Error fetching dropdown data:", error);
//       }
//     }

//     getDropdown();
//   }, [ticketNumber]);

//   console.log("selectedPart: ", selectedPart);
//   const handlePartSelect = (selectedValue) => {
//     const part = dropdownOptions.find((item) => item.value === selectedValue);

//     if (!part) return;

//     setSelectedPart({
//       label: part.label,
//       value: part.value,
//       isSerialised: normalizeBoolean(part.message),
//     });

//     setSerialNo("");
//     setShowSerial(part.message === "True"); // ✅ WORKING
//   };

//   // ---- ADD TO GRID ----
//   const handleAddToGrid = () => {
//     if (!selectedPart) return;
//     console.log("selected part: ", selectedPart);
//     if (showSerial && !isValidSerialNumber) {
//       toast.error("valid serial number is required!");
//       return;
//     }

//     setGrid((prev) => [
//       ...prev,
//       {
//         partCode: selectedPart.value,
//         desc: selectedPart.label,
//         inventoryType: "Paid",
//         price: "300.00",
//         availableQty: 0,
//         poQty: 1,
//         availability: "No",
//         serialNo: showSerial ? serialNo : "",
//       },
//     ]);

//     setSelectedPart(null);
//     setSerialNo("");
//     setShowSerial(false);
//     setIsValidSerialNumber(false);
//   };

//   // ---- DELETE ROW ----
//   const handleDelete = (index) => {
//     setGrid(grid.filter((_, i) => i !== index));
//   };

//   const checkSerialNumber = async () => {
//     if (!serialNo) {
//       toast.error("Please enter serial number");
//       return;
//     }

//     try {
//       const partCode = selectedPart.value;
//       const res = await axiosInstance.post("CheckSerialNo/CheckSerial", {
//         serialNo,
//         ticketNo: `${ticketNumber}|${partCode}`, // ticket no|part code
//         pincode: 0,
//         type: "partcodeserialno",
//       });

//       if (res.data.message === "Valid serial no") {
//         setIsValidSerialNumber(true);
//         toast.success("Serial number is valid");
//       } else {
//         toast.error(`${res.data.message}`);
//       }
//     } catch (error) {
//       toast.error("Invalid serial number");
//       console.error("serial number not found", error);
//     }
//   };

//   return (
//     <ModalSkeleton title="Add Part Pending" rolesAllowed={["sf/ssd"]}>
//       {/* PART DROPDOWN */}
//       <div className="">
//         <div className="mb-4 grid grid-cols-5 items-end gap-6">
//           <div className="col-span-3">
//             <CustomDropdown
//               label="Part Code"
//               placeholder="Select Part"
//               value={selectedPart?.value || ""}
//               onChange={handlePartSelect}
//               options={dropdownOptions}
//             />
//           </div>
//           {showSerial && (
//             <>
//               <div className="w-full">
//                 <label className="mb-1 block font-medium">
//                   Serial Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={serialNo}
//                   onChange={(e) => setSerialNo(e.target.value)}
//                   className="w-full rounded border p-2"
//                   placeholder="Enter Serial Number"
//                 />
//               </div>
//               <button
//                 onClick={checkSerialNumber}
//                 className="h-10 w-32 rounded-lg text-white"
//                 style={{ background: colors.primary }}
//               >
//                 Check Serial
//               </button>
//             </>
//           )}
//         </div>
//         {selectedPart &&
//           (!selectedPart.isSerialised ||
//             (selectedPart.isSerialised && isValidSerialNumber)) && (
//             <button
//               onClick={handleAddToGrid}
//               className="mt-4 cursor-pointer rounded-lg border px-6 py-2 text-white hover:bg-[#f1f1f1]"
//               style={{ background: colors.primary }}
//             >
//               Add to Grid
//             </button>
//           )}

//         {/* GRID TABLE */}
//         {grid.length > 0 && (
//           <>
//             <table className="mt-6 w-full border-collapse">
//               <thead>
//                 <tr style={{ background: colors.primary, color: "#fff" }}>
//                   <th className="border p-2">Part Code</th>
//                   <th className="border p-2">Desc.</th>
//                   <th className="border p-2">Inventory Type</th>
//                   <th className="border p-2">Price</th>
//                   <th className="border p-2">Available Qty</th>
//                   <th className="border p-2">PO Qty</th>
//                   <th className="border p-2">Serial Number</th>
//                   <th className="border p-2"></th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {grid.map((row, index) => (
//                   <tr key={index}>
//                     <td className="border p-2 text-blue-600">{row.partCode}</td>
//                     <td className="border p-2">{row.desc}</td>
//                     <td className="border p-2 text-red-600">{row.inventoryType}</td>
//                     <td className="border p-2">{row.price}</td>
//                     <td className="border p-2">
//                       <input
//                         value={row.availableQty}
//                         readOnly
//                         className="w-14 border p-1 text-center"
//                       />
//                     </td>
//                     <td className="border p-2">
//                       <input
//                         value={row.poQty}
//                         readOnly
//                         className="w-14 border p-1 text-center"
//                       />
//                     </td>

//                     <td className="border p-2">{row.serialNo}</td>
//                     <td
//                       className="cursor-pointer border p-2 text-red-600"
//                       onClick={() => handleDelete(index)}
//                     >
//                       Delete
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="mt-4 text-right">
//               <button
//                 className="rounded-lg border px-10 py-2"
//                 style={{
//                   color: colors.primary,
//                   borderColor: colors.primary,
//                 }}
//               >
//                 Save
//               </button>
//             </div>
//           </>
//         )}

//         {/* ✅ TICKET TABLE (RESTORED) */}
//         {grid.length > 0 && (
//           <table className="mt-8 w-full border-collapse">
//             <thead>
//               <tr style={{ background: colors.primary, color: "#fff" }}>
//                 <th className="border p-2">Ticket Number</th>
//                 <th className="border p-2">Part Code</th>
//                 <th className="border p-2">Part Desc.</th>
//                 <th className="border p-2">PO Qty</th>
//               </tr>
//             </thead>

//             <tbody>
//               {ticketData.map((row, i) => (
//                 <tr key={i}>
//                   <td className="border p-2">{row.ticketNo}</td>
//                   <td className="border p-2">{row.partCode}</td>
//                   <td className="border p-2">{row.desc}</td>
//                   <td className="border p-2 text-center">{row.qty}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </ModalSkeleton>
//   );
// }

// please update few things:
// 1. improve the style of inventory type(it should not just show red), available qty and po qty also improve the styling
// 2. improve styling of delete button
// 3. the second table will be only visible after clicked on save
