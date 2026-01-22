"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import Popup from "@/components/common/Popup";
import AllotmentDetails from "@/components/history/AllotmentDetails";
import RemarkSection from "@/components/history/RemarkSection";
import { parseStatusMessage } from "@/utils/historyUtils";

export default function DashboardActionSection() {
  const router = useRouter();
  const { ticketNo } = useParams();
  const searchParams = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  const fromPage = searchParams.get("fromPage");
  const storedTicket =
    typeof window !== "undefined" ? sessionStorage.getItem("currentTicket") : null;
  const activeTicket = ticketNo || storedTicket;

  const loggedInUser = user?.userName || "Unknown";
  const loggedInUserId = user?.userID || 0;

  // Only show for dashboard flows
  if (fromPage !== "dashboardcall") return null;
  if (!activeTicket) return null;

  // --- Internal State ---
  const [custDetail, setCustDetail] = useState(null);
  const [remark, setRemark] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  const [formData, setFormData] = useState({
    ascName: "",
    engineer: "",
    eng_ID: "",
    reAllot: false,
    appointmentDate: "",
    appointmentHour: "",
    appointmentMinute: "",
    promiseDate: "",
    asmRemark: "",
    customerRemark: "",
    tickeT_NO: "",
    DOP: "",
    loggedInUserId: "",
    calL_TYPE: "",
    call_TypeID: "",
    contactPerson: "",
    sf_ID: 0,
    firstName: "",
    pinCode: "",
    promiseTime: "",
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
          loggedInUserId: loggedInUserId || 0,
          DOP: detail?.purchasE_DATE || "-",
          engineer: detail?.engineeR_NAME || "-",
          eng_ID: detail?.Eng_ID || "-",
          sf_ID: detail?.sf_ID || 0,
          firstName: detail?.firstname || "-",
          pinCode: detail?.pincode || "-",
          promiseDate: detail?.promisE_DATE || "-",
          promiseTime: detail?.promisE_TIME || "-",
        }));
      })
      .catch((err) => console.error("Error fetching customer details:", err));
  }, [activeTicket, loggedInUserId]);

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

  const handleApprove = async (submitFalse) => {
    const payload = {
      ticketNo: formData.tickeT_NO,
      type: "Re-AllotASMApproved",
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
      const level1Res = await axiosInstance.post(
        "/Level1Operation/UpdateLevel1Operation",
        payload
      );
      const msg = level1Res?.data?.message || "";
      const [status, subStatus, message] = msg.split("|").map((x) => x.trim());

      await updateJob(status, subStatus, message);

      const callSchedulePayload = {
        sfId: formData.sf_ID,
        engId: payload.eng_id,
        appointmentDate: payload.apptdate,
        appointmentTime: payload.appttime,
        talkToWhomeAllot: payload.contactPersion,
        ticketNo: payload.ticketNo,
        ticketKey: custDetail?.tickeT_KEY || 0,
        status: 1,
        apptDateandTime: new Date().toISOString(),
      };

      await axiosInstance.post("/CallSchedule/create", callSchedulePayload);
      toast.success("Approved successfully!");
      setTimeout(() => router.back(), 500);
    } catch (err) {
      if (submitFalse) submitFalse();
      console.error(err);
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (submitFalse) => {
    const now = new Date();
    const payload = {
      ticketNo: formData.tickeT_NO,
      type: "Re-AllotASMReject",
      customerRemark: formData.asmRemark,
      CALLTYPE: formData.calL_TYPE,
      CallTypeID: formData.call_TypeID.toString(),
      ContactPersion: formData.contactPerson || "",
      usrName: loggedInUser,
      usrId: loggedInUserId.toString(),
      Apptdate: now.toISOString().split("T")[0],
      Appttime: now.toTimeString().split(" ")[0],
    };

    try {
      const res = await axiosInstance.post(
        "/Level1Operation/UpdateLevel1Operation",
        payload
      );
      const msg = res?.data?.message || "";
      const [status, subStatus, message] = msg.split("|").map((x) => x.trim());
      await updateJob(status, subStatus, message);
      toast.success("Rejected successfully!");
      setTimeout(() => router.back(), 500);
    } catch (err) {
      if (submitFalse) submitFalse();
      setPopup({ isOpen: true, message: "Failed to reject" });
    }
  };

  async function handleSubmitRemark(requestType) {
    const submitOperation = async () => {
      const payload = {
        transactionType: "Jobno",
        transactionID: custDetail?.tickeT_KEY?.toString() || "",
        transactionNo: custDetail?.tickeT_NO || activeTicket || "",
        requestedBy: loggedInUser,
        createdBy: loggedInUser,
        approvalStatus: requestType,
        approvalRemarks: remark,
      };

      const res = await axiosInstance.post("/RequestCancellation/update", payload);
      const { statusMsg } = res.data;
      const { status, subStatus, message } = parseStatusMessage(statusMsg);
      await updateJob(status, subStatus, message);

      // Refresh would require parent callback, but we can navigate back
      return statusMsg;
    };

    toast.promise(submitOperation(), {
      loading: "Submitting request...",
      success: (statusMsg) => {
        setTimeout(() => router.back(), 800);
        const action = requestType.split("|")[0];
        return `Call cancellation request ${action} successfully!`;
      },
      error: (err) =>
        err?.response?.data?.statusMsg || err?.message || "Failed to submit",
    });
  }

  return (
    <>
      {/* ASM Re-allot Approval */}
      {user?.roleName === "ASM" &&
        custDetail?.complainT_STATUS === "Open" &&
        custDetail?.complaint_SubStatus === "Request for re-allot" && (
          <AllotmentDetails
            formData={formData}
            onChange={handleChange}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

      {/* ASM Cancellation Remarks */}
      {user?.roleName === "ASM" &&
        custDetail?.complainT_STATUS === "Open" &&
        custDetail?.complaint_SubStatus === "Cancellation Request to ASM" && (
          <RemarkSection
            onSubmit={() => handleSubmitRemark("approved-asm")}
            onCancel={() => handleSubmitRemark("rejected-asm")}
            remark={remark}
            setRemark={setRemark}
          />
        )}

      {/* ZONE Cancellation Remarks */}
      {user?.roleName === "ZONE" &&
        custDetail?.complainT_STATUS === "Open" &&
        custDetail?.complaint_SubStatus === "Cancellation Request moved to RSM" && (
          <RemarkSection
            onSubmit={() => handleSubmitRemark("approved-RSM")}
            onCancel={() => handleSubmitRemark("rejected-RSM")}
            remark={remark}
            setRemark={setRemark}
          />
        )}

      {/* Popup for feedback */}
      <Popup
        isOpen={popup.isOpen}
        message={popup.message}
        onClose={() => setPopup({ isOpen: false, message: "" })}
      />
    </>
  );
}
