"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import AddPartPending from "@/app/history/actionsModals/AddPartPending";
import DOAClosure from "@/app/history/actionsModals/DOAClosure";
import MSLConsume from "@/app/history/actionsModals/MSLConsume";
import PartConsume from "@/app/history/actionsModals/PartConsume";
import ReceiveFGPO from "@/app/history/actionsModals/ReceiveFGPO";
import ActionButtons from "@/components/history/ActionButtons";
import ActionPopup from "@/components/history/ActionPopup";
import Modal from "@/components/ui/Modal";
import { logger } from "@/utils/logger";

export default function HistoryActionSection() {
  const router = useRouter();
  const { ticketNo } = useParams();
  const { user } = useSelector((state) => state.auth);

  // Get active ticket
  const storedTicket =
    typeof window !== "undefined" ? sessionStorage.getItem("currentTicket") : null;
  const activeTicket = ticketNo || storedTicket;

  const loggedInUser = user?.userName || "Unknown";
  const loggedInUserId = user?.userID || 0;

  // Only show for SF/SSD role

  // --- Internal State ---
  const [custDetail, setCustDetail] = useState(null);
  const [actions, setActions] = useState([]);

  // Popup visibility
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [partPendingPopup, setPartPendingPopup] = useState(false);
  const [doaReceivePopup, setDoaReceivePopup] = useState(false);
  const [partConsumePopup, setPartConsumePopup] = useState(false);
  const [MSLPartConsumePopup, setMSLPartConsumePopup] = useState(false);
  const [DOAConsumePopup, setDOAConsumePopup] = useState(false);

  // Form state
  const [cancelReasons, setCancelReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [remark, setRemark] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [engineerData, setEngineerData] = useState([]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  const [formData, setFormData] = useState({
    ascName: "",
    engineer: "",
    eng_ID: "",
    appointmentDate: "",
    appointmentHour: "",
    appointmentMinute: "",
    customerRemark: "",
    tickeT_NO: "",
    DOP: "",
    calL_TYPE: "",
    call_TypeID: "",
    contactPerson: "",
    sf_ID: 0,
    firstName: "",
    pinCode: "",
  });

  // --- Fetch Customer Details ---
  useEffect(() => {
    if (!activeTicket) return;

    axiosInstance
      .get(`ComplaintCustDetail/${activeTicket}`)
      .then((res) => {
        const detail = res.data.data;
        setCustDetail(detail);

        // Sync to formData
        setFormData((prev) => ({
          ...prev,
          ascName: detail?.asC_NAME || "",
          tickeT_NO: detail?.tickeT_NO || "",
          calL_TYPE: detail?.calL_TYPE || "-",
          call_TypeID: detail?.call_TypeID || 0,
          DOP: detail?.purchasE_DATE || "-",
          engineer: detail?.engineeR_NAME || "-",
          eng_ID: detail?.Eng_ID || "-",
          sf_ID: detail?.sf_ID || 0,
          firstName: detail?.firstname || "-",
          pinCode: detail?.pincode || "-",
        }));
      })
      .catch((err) => console.error("Error fetching customer details:", err));
  }, [activeTicket]);

  // --- Fetch Available Actions ---
  useEffect(() => {
    if (!activeTicket || !user?.roleName) return;

    axiosInstance
      .post("ActionMaster/GetActionByTicket", {
        ticketNo: activeTicket,
        roleName: user.roleName,
      })
      .then((res) => setActions(res.data.data || []))
      .catch((err) => console.error("Error fetching actions:", err));
  }, [activeTicket, user?.roleName]);

  // --- Fetch Cancel Reasons ---
  useEffect(() => {
    axiosInstance
      .post("DropdownMaster/GetDropdown", { type: "CancelReason" })
      .then((res) => {
        if (res?.data?.data) setCancelReasons(res.data.data);
      })
      .catch((err) => console.error("Error fetching cancel reasons:", err));
  }, []);

  // --- Handlers ---
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function updateJob(status, subStatus, message, serialNumber) {
    const ticketNumber = formData.tickeT_NO || custDetail?.tickeT_NO;
    await axiosInstance.post(`/CallRegister/UpdateComplaint/${ticketNumber}`, {
      complaint_Status: status,
      complaint_SubStatus: subStatus,
      CallTransferBY: loggedInUser,
      dlcity: serialNumber ? `${message} - ${serialNumber}` : message,
    });
  }

  const handleActionClick = (action) => {
    setSelectedAction(action);
    if (action === "Part Pending") {
      setPartPendingPopup(true);
      return;
    }
    if (action === "DOA Receive") {
      setDoaReceivePopup(true);
      return;
    }
    if (action === "Consume Part") {
      setPartConsumePopup(true);
      return;
    }
    if (action === "Consume Part From MSL") {
      setMSLPartConsumePopup(true);
      return;
    }
    if (action === "Call Closure") {
      setDOAConsumePopup(true);
      return;
    }
    setShowActionPopup(true);
    if (action === "Assigned") {
      fetchEngineerData();
    }
  };

  async function fetchEngineerData() {
    try {
      const res = await axiosInstance.post(
        `Engineer/Manage`,
        {
          Action: "SELECT_ACTIVE_BY_SFID",
          Eng_SFID: formData.sf_ID || 0,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setEngineerData(res.data.data);
    } catch (err) {
      console.error("Error fetching engineer data:", err);
    }
  }

  const handleSubmitCancellation = async () => {
    if (!selectedReason) {
      alert("Please select a cancel reason!");
      return;
    }
    try {
      const payload = {
        transactionType: "Jobno",
        transactionID: String(custDetail?.tickeT_KEY || ""),
        transactionNo: formData?.tickeT_NO || activeTicket || "",
        requestedBy: loggedInUser,
        createdBy: loggedInUser,
        reason: selectedReason,
        remarks: remark,
      };
      const res = await axiosInstance.post("/RequestCancellation/create", payload);

      if (res?.data?.statusMsg) {
        alert(res.data.statusMsg);
      } else {
        alert("Cancellation Request Submitted Successfully!");
      }

      if (res?.data?.statusCode === 200 && res.data.statusMsg.includes("success")) {
        setShowActionPopup(false);
      }
    } catch (error) {
      toast.error("Failed to submit cancellation.");
    }
  };

  const handleSerialCheck = async () => {
    const payload = {
      serialNo: serialNumber,
      ticketNo: formData.tickeT_NO,
      pincode: formData.pinCode || 0,
      type: "WIPProcess",
    };
    try {
      const res = await axiosInstance.post("/CheckSerialNo/CheckSerial", payload);
      const message = res?.data?.message?.trim() || "";
      const parts = message.split("|");
      const hasStatus = parts.length >= 2;

      if (!hasStatus) {
        alert(message);
        return;
      }

      const status = parts[0]?.trim();
      const subStatus = parts[1]?.trim();
      const responseMessage = parts[2]?.trim() || "";

      await updateJob(status, subStatus, responseMessage, serialNumber);
      logger.info(`Serial check: ${status}|${subStatus}`, "serial check WIP", {
        payload,
      });
      setShowActionPopup(false);
    } catch (error) {
      logger.error(`Error serial check: ${error.message}`, "serial check WIP");
    }
  };

  const handleAssigned = async () => {
    const payload = {
      ticketNo: formData.tickeT_NO,
      type: "Assigned",
      customerRemark: formData.customerRemark,
      CallType: formData.calL_TYPE,
      callTypeID: formData.call_TypeID.toString(),
      usrName: loggedInUser,
      usrId: loggedInUserId.toString(),
      contactPersion: formData.contactPerson || formData.firstName || "",
      apptdate: formData.appointmentDate,
      appttime: `${formData.appointmentHour || "00"}:${formData.appointmentMinute || "00"}`,
      dop: formData.DOP,
      eng_id: formData.eng_ID,
    };

    try {
      await axiosInstance.post("/Level1Operation/UpdateLevel1Operation", payload);
      setPopup({ isOpen: true, message: "Assigned successfully!" });
      setShowActionPopup(false);
    } catch (err) {
      setPopup({ isOpen: true, message: "Failed to Assign" });
    }
  };

  if (user?.roleName !== "SF/SSD") return null;
  if (!activeTicket) return null;

  return (
    <>
      <h2 className="page-title">👉 Action</h2>
      <ActionButtons actions={actions} onActionClick={handleActionClick} />

      <ActionPopup
        isOpen={showActionPopup}
        onClose={() => setShowActionPopup(false)}
        selectedAction={selectedAction}
        detail={custDetail || {}}
        cancelReasons={cancelReasons}
        selectedReason={selectedReason}
        setSelectedReason={setSelectedReason}
        remark={remark}
        setRemark={setRemark}
        confirmCancel={confirmCancel}
        setConfirmCancel={setConfirmCancel}
        handleSubmitCancellation={handleSubmitCancellation}
        serialNumber={serialNumber}
        setSerialNumber={setSerialNumber}
        handleSerialCheck={handleSerialCheck}
        formData={formData}
        handleChange={handleChange}
        engineerData={engineerData}
        handleAssigned={handleAssigned}
      />

      <Modal open={partPendingPopup} onClose={() => setPartPendingPopup(false)}>
        <AddPartPending ticketNumber={activeTicket} />
      </Modal>

      <Modal open={doaReceivePopup} onClose={() => setDoaReceivePopup(false)}>
        <ReceiveFGPO ticketNo={activeTicket} onClose={() => router.back()} />
      </Modal>

      <Modal open={DOAConsumePopup} onClose={() => setDOAConsumePopup(false)}>
        <DOAClosure
          ticketNo={activeTicket}
          model={custDetail?.model}
          oldSerialNumber={custDetail?.seriaL_NO}
        />
      </Modal>

      <Modal open={partConsumePopup} onClose={() => setPartConsumePopup(false)}>
        <PartConsume ticketNo={activeTicket} onClose={() => router.back()} />
      </Modal>

      <Modal open={MSLPartConsumePopup} onClose={() => setMSLPartConsumePopup(false)}>
        <MSLConsume ticketNumber={activeTicket} />
      </Modal>

      {/* Popup for feedback */}
      {popup.isOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <p>{popup.message}</p>
            <button
              onClick={() => setPopup({ isOpen: false, message: "" })}
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
