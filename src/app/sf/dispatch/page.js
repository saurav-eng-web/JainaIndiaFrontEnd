"use client";

export const dynamic = "force-dynamic";

import React, { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import CustomDropdown from "@/components/common/Dropdown";
import { useTheme } from "@/theme/ThemeContext";
import axiosInstance from "@/api/axiosInstance";
import ConfirmModal from "@/components/ui/ConfirmationModal";
import Table from "@/components/common/Table";
import PageSkeleton from "@/components/ui/PageSkeleton";
import FormInput from "@/components/ui/FormInput";

function SendDefectivePageContent() {
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [warehouseId, setWarehouseId] = useState("");
  const [challanType, setChallanType] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [challanTypeOptions, setChallanTypeOptions] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [popupType, setPoptype] = useState("submit");
  const [popupTitle, setPopupTitle] = useState("Confirm Action");

  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [pincode, setPincode] = useState(0);
  const [dispatchForm, setDispatchForm] = useState({
    // courierType: "",
    type: "",
    warehouse: warehouseId,
    courierCode: "",
    doc: "",
    remark: "",
    dimensions: "",
    weight: "",
    box: "",
    challanDate: "",
    ipAddress: "",
  });

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

  useEffect(() => {
    const existing = localStorage.getItem("clientIP");
    if (existing) {
      setDispatchForm((prev) => ({ ...prev, ipAddress: existing }));
      return;
    }
    (async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        const ip = res?.data?.ip || "";
        if (ip) {
          localStorage.setItem("clientIP", ip);
          setDispatchForm((prev) => ({ ...prev, ipAddress: ip }));
        }
      } catch (e) {
        console.error("Failed to fetch IP:", e);
      }
    })();
  }, []);

  async function fetchAscDetails() {
    if (!user || !user.userName) return;
    //

    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`ASC_MASTER/asccode/${user?.userName}`);

      if (res.status === 200) {
        setPincode(res.data?.pincode);
      }
    } catch (error) {
      console.error("Error fetching ASC details: ", error);
    } finally {
      setIsLoading(false);
    }
  }

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
      if (res?.data?.statusCode === 200) {
        const data = res?.data?.data;
        if (data.length === 0) {
          toast.error("No data found!");
        }
        const sortedData = data.sort((a, b) => b.Ageing - a.Ageing);
        setTableData(sortedData);

        setDispatchForm((prev) => ({
          ...prev,
          type: challanType,
          warehouse: warehouseId,
        }));
      }
    } catch (error) {
      console.error("Error fetching warehouse and challan type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (item) => {
    if (selectedItems.some((x) => x.ID === item.ID)) {
      setSelectedItems(selectedItems.filter((x) => x.ID !== item.ID));
      setTotalPrice((prev) => prev - item.Price);
      setTotalWeight((prev) => prev - item.Weight);
    } else {
      setSelectedItems([...selectedItems, item]);
      setTotalPrice((prev) => prev + item.Price);
      setTotalWeight((prev) => prev + item.Weight);
      // setTotalPrice(selectedItems.reduce((acc, curr) => acc + curr.TotalPrice, 0));
      // setTotalWeight(selectedItems.reduce((acc, curr) => acc + curr.TotalWeight, 0));
    }
  };

  const handleNext = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item");
      return;
    }

    try {
      const res = await axiosInstance.post("/Cost/check", {
        RecentPrice: totalPrice,
      });

      if (res?.data?.statusCode === 200) {
        const message = res?.data?.statusMsg;
        setServerMessage(message);

        if (message !== "Are you sure to process the items") {
          setPoptype("info");
        } else {
          setPoptype("submit");
        }

        setShowConfirm(true);

        await fetchAscDetails();
      }
    } catch (error) {
      toast.error("Something went wrong try again");
      console.error(error);
    }

    // setShowConfirm(true);

    // setDispatchForm({
    //   ...dispatchForm,
    //   docketNo: "Dkt-" + Date.now(),
    //   challanDate: new Date().toISOString().slice(0, 10),
    // });

    // setShowDispatchForm(true);
  };

  const onDispatchChange = (e) => {
    setDispatchForm({ ...dispatchForm, [e.target.name]: e.target.value });
  };

  // >>>>>>>>>>>>>>> ADD THIS NEW FUNCTION <<<<<<<<<<<<<<<
  const handleSubmitDispatch = async () => {
    // alert("Dispatch Submitted Successfully!");
    if (!dispatchForm.box || !dispatchForm.dimensions || !dispatchForm.remark) {
      toast.error("Please fill all the fields");
      return;
    }
    const idArray = selectedItems.map((x) => x.ID);
    const ids = idArray.join(",");
    const payload = {
      ...dispatchForm,
      ids,
      ipAddress: "",
      userName: user.userName,
    };

    try {
      const res = await axiosInstance.post("challan/process", payload);

      if (res?.data?.statusCode === 200 && res?.data?.data.length > 0) {
        const challanNo = res?.data?.data[0]["challan no"];
        // toast.success(`Generated Defective No: ${challanNo}`);
        setServerMessage(`Generated Defective No: ${challanNo}`);
        setPopupTitle("Success");
        setShowConfirm(true);
        setPoptype("success");
        setSelectedItems([]);
        setTotalPrice(0);
        setTotalWeight(0);
        // setServerMessage("");
        // setShowConfirm(false);
        // handleSearch();
        setShowDispatchForm(false);
        setChallanType("");
        setWarehouseId("");
        setTableData([]);
      }
    } catch (error) {
      toast.error("Something went wrong try again");
      console.error(error?.message);
    }
  };

  const handleConfirmYes = async () => {
    setShowConfirm(false);

    try {
      const res = await axiosInstance.post("/docket/get", {
        Pincode: pincode,
        Weight: totalWeight,
      });
      if (res?.data?.statusCode === 200) {
        const data = res?.data?.data[0];
        setDispatchForm((prev) => ({
          ...prev,
          doc: data.DocketNo,
          challanDate: new Date().toISOString().slice(0, 10),
          courierCode: data.CourierName,
          weight: data.Weightt.toString(),
        }));

        setShowDispatchForm(true);
      }
    } catch (error) {
      console.error("Error fetching docket get:", error);
    }
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
  };

  const columns = [
    {
      label: "Ticket No",
      key: "ticket_no",
      size: "lg",
    },
    {
      label: "Part Code",
      key: "Part",
      size: "lg",
    },
    {
      label: "Description",
      key: "Part desc.",
      size: "xl",
    },
    {
      label: "Quantity",
      key: "QTY",
      size: "xs",
    },
    {
      label: "Price",
      key: "Price",
      size: "sm",
    },
    {
      label: "Aging",
      key: "Ageing",
      size: "sm",
    },
    {
      label: "Select",
      key: "select",
      size: "xs",
      render: (_value, row) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={selectedItems.some((x) => x.ID === row.ID)}
            onChange={() => toggleSelection(row)}
            className="size-4 cursor-pointer"
          />
        </div>
      ),
    },
  ];

  // <ProtectedRoute allowedRoles={["br", "asm", "zone", "sf/ssd"]}> --- Send Defective To NWH
  return (
    <PageSkeleton title="Send Inventory to Warehouse" rolesAllowed={["sf/ssd"]}>
      {/* ---------------- FILTER SECTION ---------------- */}
      <div className="mb-6 grid grid-cols-3 gap-6">
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
            {isLoading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {/* ---------------- TABLE SECTION ---------------- */}

      {tableData.length > 0 && (
        <>
          {/* <div className="mt-6 rounded-lg border p-4"> */}
          <Table columns={columns} rows={tableData} />

          {/* NEXT BUTTON */}
          {selectedItems.length > 0 && (
            <div className="mt-4 text-right">
              <button
                onClick={handleNext}
                className="cursor-pointer rounded-lg px-6 py-2 shadow-md"
                style={{ background: colors.primary, color: "#fff" }}
              >
                Next →
              </button>
            </div>
          )}
        </>
        // </div>
      )}

      {/* ---------------- DISPATCH FORM ---------------- */}
      {showDispatchForm && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-2xl font-semibold" style={{ color: colors.primary }}>
            Dispatch Detail
          </h3>

          <div className="grid grid-cols-3 gap-6">
            {/* Type of Courier */}
            {/* Type of Challan */}
            <FormInput
              label="Type of Challan"
              name="courierType"
              value={dispatchForm.type}
              onChange={onDispatchChange}
              readOnly
              placeholder="Local Service Provider"
            />

            {/* Courier Code */}
            <FormInput
              label="Courier Code"
              name="courierCode"
              value={dispatchForm.courierCode}
              onChange={onDispatchChange}
              placeholder="Courier Code"
              readOnly
            />

            {/* Docket No */}
            <FormInput
              label="Docket No."
              name="docketNo"
              value={dispatchForm.doc}
              readOnly
            />

            {/* Challan Date */}
            <FormInput
              label="Challan Date"
              type="date"
              name="challanDate"
              value={dispatchForm.challanDate}
              readOnly
            />

            {/* Weight */}
            <FormInput
              label="Weight (In grams)"
              name="weight"
              value={dispatchForm.weight}
              readOnly
              onChange={onDispatchChange}
            />

            {/* Dimensions */}
            <FormInput
              label="Dimensions (L*B*H in cm)"
              name="dimensions"
              value={dispatchForm.dimensions}
              onChange={onDispatchChange}
            />

            {/* Box */}
            <FormInput
              label="Box"
              name="box"
              value={dispatchForm.box}
              onChange={onDispatchChange}
            />

            {/* Remark */}
            <FormInput
              label="Remark"
              name="remark"
              value={dispatchForm.remark}
              onChange={onDispatchChange}
              type="textarea"
              className="col-span-2"
              inputClassName="h-14" // slightly taller than h-10 for better UX, or keep h-10 if strict. I'll use h-14 for textarea.
            />
          </div>

          {/* >>>>>>>>>>> SUBMIT BUTTON ADDED HERE <<<<<<<<<<< */}
          <div className="mt-6 text-right">
            <button
              onClick={handleSubmitDispatch}
              className="h-10 cursor-pointer rounded-lg px-8 py-3 text-center font-semibold text-white shadow-md"
              style={{ background: colors.primary }}
            >
              Dispatch
            </button>
          </div>
        </div>
      )}
      <ConfirmModal
        open={showConfirm}
        title={popupTitle}
        message={serverMessage}
        onConfirm={handleConfirmYes}
        onCancel={handleConfirmNo}
        type={popupType}
      />
    </PageSkeleton>
  );
}

export default function CreateChallan() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center text-center text-2xl">
          Loading page...
        </div>
      }
    >
      <SendDefectivePageContent />
    </Suspense>
  );
}

// clear memory, if the drop down changes, for price
