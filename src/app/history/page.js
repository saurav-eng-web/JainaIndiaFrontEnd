"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense, useCallback } from "react"; // ✅ import Suspense
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import SpeicalApprovalPopup from "../nsp/special-approval/specialAllowancePopup";
import SpeicalAllowancePopup from "../rsm/special-allowance/allowancePopup";

import CancelPopup from "./CancelPopup";
import EditCustPopup from "./EditCustPopup";

import SideBar from "@/components/SideBar";
import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import RemarkSection from "@/components/history/RemarkSection";
import AllotmentDetails from "@/components/history/AllotmentDetails";
import Popup from "@/components/common/Popup";
import { logger } from "@/utils/logger";
import { formatIndianDate } from "@/utils/formatDate";
import Loader from "@/components/common/LoaderComponent";
import Pagination from "@/components/Pagination";

import "./history.css";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";

const tabs = [
  "Job Details",
  "Customer Detail",
  "Product Details",
  // "Pending Level",
  "Documents",
  "Job Done",
  "Consumption",
  "Visit Detail",
];

function HistoryPageContent() {
  const [pendingHistory, setPendingHistory] = useState([]);
  const { ticketNo } = useParams();
  const [activeTab, setActiveTab] = useState("Job Details");
  const [logData, setLogData] = useState([]);
  const [custDetail, setCustDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [partConsumption, setPartConsumption] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [visitDetails, setVisitDetails] = useState([]);
  const [reminderReason, setReminderReason] = useState("");
  const [reminderText, setReminderText] = useState("");
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [remark, setRemark] = useState("");
  const [ticketKey, setTicketKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams(); // ✅ now safe inside Suspense
  const fromPage = searchParams.get("fromPage");
  const prevPage = sessionStorage.getItem("fromPage");
  const currentTicket = sessionStorage.getItem("currentTicket");
  const router = useRouter();

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [cancelPopupOpen, setCancelPopupOpen] = useState(false);
  const [editCustomerPopupOpen, setEditCustomerPopupOpen] = useState(false);
  const [actions, setActions] = useState([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  const [cancelReasons, setCancelReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [engineerData, setEngineerData] = useState([]);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  const reminderOptions = [
    { value: "call", label: "📞 Not Attended" },
    { value: "email", label: "⏳ Part Pending" },
    { value: "meeting", label: "🤷 Other" },
  ];

  const { user } = useSelector((state) => state.auth);
  const loggedInUser = user?.userName || "Unknown";
  const loggedInUserId = user?.userID || 0;
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
  });

  const firstEntry = logData[0] || {};
  const detail = custDetail || {};

  // const role = user?.roleName;

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
    prevAppointment: "", // ✅ added
    reallotDate: "", // ✅ added
    ascReason: "",
  });
  // ------------------PAGINATION-------------
  const INITALPAGESIZE = 25;
  const [pageSize, setPageSize] = useState(INITALPAGESIZE);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = logData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const visibleRows = logData.slice(startIndex, endIndex);

  // -----------------POP UP SPECIAL ALLOWANCE----------------
  const [allowancePopup, setAllowancePopup] = useState(false);
  const onOpenAllowanceModal = () => setAllowancePopup(true);
  const onCloseAllowanceModal = () => setAllowancePopup(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [logData, pageSize]);

  useEffect(() => {
    if (!custDetail) return;
    setFormData((prevData) => ({
      ...prevData,
      ascName: custDetail.asC_NAME || "",
      tickeT_NO: custDetail.tickeT_NO || "",
      ticketKey: custDetail.tickeT_KEY || 0,
      calL_TYPE: custDetail.calL_TYPE || "-",
      call_TypeID: custDetail.call_TypeID || 0,
      loggedInUserId: loggedInUserId || 0,
      DOP: custDetail?.purchasE_DATE || "-", // safe optional chaining
      engineer: custDetail.engineeR_NAME || "-",
      eng_ID: custDetail.Eng_ID || "-",
      sf_ID: custDetail.sf_ID || 0,
      firstName: custDetail.firstname || "-",
      pinCode: custDetail.pincode || "-",
      promiseDate: custDetail.promisE_DATE || "-",
      promiseTime: custDetail.promisE_TIME || "-",
    }));
  }, [custDetail, loggedInUserId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // fetch user id
  useEffect(() => {
    const existing = localStorage.getItem("clientIP");

    if (existing) {
      setFormData((prev) => ({ ...prev, userIP: existing }));

      return;
    }
    (async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        const ip = res?.data?.ip || "";
        if (ip) {
          localStorage.setItem("clientIP", ip);

          setFormData((prev) => ({ ...prev, userIP: ip }));
        }
      } catch (e) {
        console.error("Failed to fetch IP:", e);
      }
    })();
  }, []);

  // formData = custDetail
  useEffect(() => {
    if (custDetail) {
      setFormData((prev) => ({
        ...prev,
        ascName: custDetail.asC_NAME || "",
        tickeT_NO: custDetail.tickeT_NO || "",
        calL_TYPE: custDetail.calL_TYPE || "-",
        call_TypeID: custDetail.call_TypeID || 0,
        loggedInUserId: loggedInUserId || 0,
        DOP: detail.purchasE_DATE || "-",
        engineer: custDetail.engineeR_NAME || "-",
        eng_ID: custDetail.eng_ID || "-",
      }));
    }
  }, [custDetail, detail?.purchasE_DATE, loggedInUserId]);

  const activeTicket = ticketNo || sessionStorage.getItem("currentTicket");

  // 2. Main Data Fetching Effect
  useEffect(() => {
    if (!activeTicket) return;

    // Start Loaders
    setLoading(true);
    setLoadingReminders(true);

    const fetchAllTicketData = async () => {
      try {
        // execute all independent requests in parallel
        const results = await Promise.allSettled([
          axiosInstance.get(`ComplaintHistory/history-by-ticket/${activeTicket}`), // 0
          axiosInstance.get(`ComplaintCustDetail/${activeTicket}`), // 1
          axiosInstance.get(`PartConsumption/ByTicket/${activeTicket}`), // 2
          axiosInstance.get(`DocumentUpload/ticket/${activeTicket}`), // 3
          axiosInstance.get(`LevelPendingHistory/ticket/${activeTicket}`), // 4
          // axiosInstance.get(`visit/ticket/${activeTicket}`), // 5
          axiosInstance.get(`reminder/Ticket/${activeTicket}`), // 6
        ]);

        // Helper to safely extract data or default to empty array/obj
        const unwrap = (res, defaultVal = []) =>
          res.status === "fulfilled" ? res.value.data : defaultVal;

        // --- Process Results ---

        // 0. History
        const historyData = unwrap(results[0]);
        setLogData(Array.isArray(historyData) ? historyData : [historyData]);

        // 1. Customer Detail (Critical for Actions)
        const custData = unwrap(results[1], null);
        setCustDetail(custData);
        setTicketKey((prev) => custData?.tickeT_KEY || prev);

        // 2. Part Consumption
        const partData = unwrap(results[2]);
        setPartConsumption(Array.isArray(partData) ? partData : [partData]);

        // 3. Documents
        const docData = unwrap(results[3]);
        setDocuments(Array.isArray(docData) ? docData : []);

        // 4. Pending History
        const pendingData = unwrap(results[4]);
        setPendingHistory(Array.isArray(pendingData) ? pendingData : []);

        // 5. Visits
        // const visitData = unwrap(results[5]);
        // setVisitDetails(Array.isArray(visitData) ? visitData : []);

        // 6. Reminders
        const reminderData = unwrap(results[5]);
        setReminders(Array.isArray(reminderData) ? reminderData : [reminderData]);

        // --- Dependent Logic: Fetch Actions ---
        // We do this here because we already have 'custData' and don't want to fetch it again.
        if (custData && user) {
          fetchActionsInternal(custData, user.roleName);
        }
      } catch (err) {
        console.error("Critical error during batch fetch:", err);
        logger.error(`Batch fetch error: ${err.message}`, "loading data on history page");
      } finally {
        setLoading(false);
        setLoadingReminders(false);
      }
    };

    fetchAllTicketData();
  }, [activeTicket, user]); // Re-run if ticket changes or user logs in/out

  // 3. Helper Function for Actions
  // (Moved outside effect to keep the main logic clean)
  const fetchActionsInternal = async (complaintDetail, userRole) => {
    try {
      const payload = {
        type: "jobactions",
        role: userRole || "Unknown",
        complaint_SubStatus: complaintDetail.complaint_SubStatus || "",
        complaint_Status: complaintDetail.complainT_STATUS || "",
        calltype: complaintDetail.calL_TYPE || "",
        product: complaintDetail.product || "",
      };

      const res = await axiosInstance.post("ActionMaster/get-actions", payload);
      const data = res.data.data || [];

      if (Array.isArray(data) && data.length > 0) {
        // Assuming structure is [{ actions: [...] }]
        const actionsString = data[0].actions.map((a) => a.action) || "";
        setActions(actionsString);
      } else {
        setActions([]);
      }
    } catch (error) {
      console.error("Failed to fetch actions:", error);
    }
  };
  // fetch cancel reasons
  useEffect(() => {
    fetchCancelReasons();
  }, []);

  const fetchCustomerDetails = useCallback(() => {
    const storedTicket = sessionStorage.getItem("currentTicket");
    if (!storedTicket) return;

    axiosInstance
      .get(`ComplaintCustDetail/${storedTicket}`)
      .then((res) => setCustDetail(res.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchCancelReasons = async () => {
    try {
      const res = await axiosInstance.post(
        "DropdownMaster/GetDropdown",
        { type: "CancelReason" } // ✅ required payload
      );

      if (res?.data?.data) {
        setCancelReasons(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching cancel reasons:", error);
    }
  };

  const handleSubmitCancellation = async () => {
    if (!selectedReason) {
      alert("Please select a cancel reason!");
      return;
    }

    try {
      const payload = {
        transactionType: "Jobno",
        transactionID: String(custDetail?.tickeT_KEY || ""), // dynamic ticket key
        transactionNo: formData?.tickeT_NO || ticketNo || "", // dynamic ticket number
        requestedBy: loggedInUser, // dynamic user
        createdBy: loggedInUser, // dynamic user
        reason: selectedReason,
        remarks: remark,
      };
      const res = await axiosInstance.post("/RequestCancellation/create", payload);

      // ✔ Show the message coming from API response
      if (res?.data?.statusMsg) {
        alert(res.data.statusMsg);
      } else {
        alert("Cancellation Request Submitted Successfully!");
      }

      // ✔ Close popup only when success
      // If statusMsg indicates failure, popup will remain open
      if (res?.data?.statusCode === 200 && res.data.statusMsg.includes("success")) {
        setShowPopup(false);
      }
    } catch (error) {
      console.error("Error submitting cancellation:", error);
      alert("Failed to submit cancellation.");
    }
  };

  const handleActionClick = (action) => {
    setSelectedAction(action);
    setShowPopup(true); // 👉 open popup on button click
    if (action === "Assigned") {
      fetchEngineerData();
    }
  };

  const buildActionPayload = (type) => ({
    ticketNo: formData.tickeT_NO,
    usrName: loggedInUser,
    type,
    apptdate: formData.appointmentDate,
    appttime: `${formData.appointmentHour || "00"}:${formData.appointmentMinute || "00"}`,
    dop: formData.DOP,
    contactPersion: formData.contactPersion || formData.firstName || "",
    customerRemark: formData.customerRemark,
    usrId: loggedInUserId.toString(),
    eng_id: formData.eng_ID,
    callTypeID: formData.call_TypeID.toString(),
    CallType: formData.calL_TYPE,
    // Reallot: formData.reAllot ? 1 : 0,
    // Type1: "ASM",
    // Action: action,
  });

  const handleApprove = async () => {
    const payload = buildActionPayload("Re-AllotASMApproved");

    try {
      // 1) LEVEL 1 processing
      const level1Res = await axiosInstance.post(
        "/Level1Operation/UpdateLevel1Operation",
        payload
      );

      const msg = level1Res?.data?.message || "";
      const [status, subStatus, message] = msg.split("|").map((x) => x.trim());

      if (!status || !subStatus) {
        throw new Error("Invalid Level1 response format");
      }

      // 2) JOB UPDATE + HISTORY
      await updateJob(status, subStatus, message);

      // 3) CALL SCHEDULE (Approve only)
      const callSchedulePayload = {
        sfId: formData.sf_ID,
        engId: payload.eng_id,
        appointmentDate: payload.apptdate,
        appointmentTime: payload.appttime,
        talkToWhomeAllot: payload.contactPersion,
        ticketNo: payload.ticketNo,
        ticketKey: formData.ticketKey || 0,
        status: 1,
        apptDateandTime: new Date().toISOString(),
      };

      await axiosInstance.post("/CallSchedule/create", callSchedulePayload);

      // SUCCESS
      toast.success("Approved successfully!");

      setTimeout(() => {
        router.back();
      }, 500);
    } catch (err) {
      console.error("Approve Error:", {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });

      // setPopup({ isOpen: true, message: "Failed to approve" });
      toast.error("Failed to approve");
    }
  };

  const handleReject = async () => {
    const payload = buildActionPayload("Re-AllotASMReject");

    try {
      // 1) LEVEL 1
      const res = await axiosInstance.post(
        "/Level1Operation/UpdateLevel1Operation",
        payload
      );

      const msg = res?.data?.message || "";
      const [status, subStatus, message] = msg.split("|").map((x) => x.trim());

      // 2) Update Job + History (added now)
      await updateJob(status, subStatus, message);

      // 3) NO call schedule on reject

      toast.success("Rejected successfully!");
      setTimeout(() => router.back(), 500);
    } catch (err) {
      console.error("Reject Error:", err);
      setPopup({ isOpen: true, message: "Failed to reject" });
    }
  };

  const handleAssigned = async () => {
    const payload = buildActionPayload("Assigned");

    try {
      // 1) LEVEL 1
      const res = await axiosInstance.post(
        "/Level1Operation/UpdateLevel1Operation",
        payload
      );

      // const msg = res?.data?.message || "";
      // const [status, subStatus, message] = msg.split("|").map((x) => x.trim());

      // // 2) Update Job + History (added now)
      // await updateJobAndHistory(status, subStatus, message);

      setPopup({ isOpen: true, message: "Assigned successfully!" });
      // setTimeout(() => router.push("/nsp/dashboard"), 1500);
    } catch (err) {
      console.error("Reject Error:", err);
      setPopup({ isOpen: true, message: "Failed to Assign" });
    }
  };

  const handleRequestCancellation = async () => {
    const { tickeT_NO, tickeT_KEY } = custDetail;
    const { cancelReason, customerRemarks, contactPerson, userIP } = formData;

    setCancelPopupOpen((prev) => !prev);

    const payload = {
      transactionType: "jobno",
      transactionID: tickeT_KEY.toString() || "",
      transactionNo: tickeT_NO.toString() || "",
      requestDate: new Date().toISOString(),
      requestedBy: user ? `${loggedInUser}` : "Unknown User",
      reason: cancelReason,
      remarks: customerRemarks,
      approvalStatus: "pending",
      approvedBy: user ? `${loggedInUser}` : "Unknown User",
      approvedDate: new Date().toISOString(),
      approvalRemarks: "",
      ipAddress: userIP || "0.0.0.0",
      contactPerson,
    };

    try {
      await axiosInstance.post("/RequestCancellation/create", payload);
      setPopup({ isOpen: true, message: "Cancelled successfully!" });

      // setTimeout(() => {
      //   setPopup({ isOpen: false, message: "" }); // ✅ redirect to dashboard
      // }, 1500);

      // setTimeout(() => {
      //   router.push("/nsp/dashboard"); // ✅ redirect to dashboard
      // }, 1500);
    } catch (err) {
      console.error("Reject Error:", err);
      setPopup({ isOpen: true, message: "Failed request for cancellation" });
    }
  };

  const handleSerialCheck = async () => {
    // setShowSerialPopup(true);
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

      // When "Open|WIP ..."  => parts.length >= 2
      const hasStatus = parts.length >= 2;

      // If response does not contain status => show message only
      if (!hasStatus) {
        alert(message);
        console.log("Info message:", message);
        return;
      }

      // Extract status and substatus
      const status = parts[0]?.trim(); // Open
      const subStatus = parts[1]?.trim(); // WIP Approval or WIP
      const responseMessage = parts[2]?.trim() || "";

      // Everything valid => call updateHistory
      await updateJob(status, subStatus, responseMessage, serialNumber);
      logger.info(
        `Serial check: ${status}|${subStatus}|${message}`,
        "serial check WIP, history page",
        { payload, res }
      );
    } catch (error) {
      console.log(error);
      logger.error(
        `Error serial check: ${error.message}`,
        "serial check WIP, history page",
        { payload }
      );
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
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = res.data;
      setEngineerData(resData.data);
    } catch (err) {
      console.error("Error fetching engineer data:", err);
      logger.error(
        `Error fetching engineer data: ${err.message}`,
        "fetching engineer data, history page"
      );
    }
  }

  function isToday(dateStr) {
    const today = new Date();
    const d = new Date(dateStr);

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }

  function getAllowedHours(selectedDate) {
    const start = 9;
    const end = 20;

    if (!selectedDate) return [];

    if (!isToday(selectedDate)) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    // If today → enforce +1 hour rule
    const now = new Date();
    const nextAllowedHour = now.getHours() + 1;

    const finalStart = Math.max(start, nextAllowedHour);

    if (finalStart > end) return []; // No valid hours left today

    return Array.from({ length: end - finalStart + 1 }, (_, i) => finalStart + i);
  }

  function getNearestValidMinute(minute) {
    const slots = [0, 15, 30, 45];
    for (const m of slots) {
      if (m >= minute) return m;
    }
    return null; // no valid minute in this hour
  }

  function getAllowedMinutes(selectedDate, selectedHour) {
    const slots = [0, 15, 30, 45];

    if (!selectedDate || selectedHour === "") return slots;

    if (!isToday(selectedDate)) return slots;

    const now = new Date();
    const nextHour = now.getHours() + 1;

    if (selectedHour > nextHour) {
      return slots; // full range allowed
    }

    if (selectedHour == nextHour) {
      const nearest = getNearestValidMinute(now.getMinutes());
      if (nearest === null) return []; // no valid minute this hour
      return slots.filter((m) => m >= nearest);
    }

    return []; // anything earlier than required hour
  }

  async function updateJob(status, subStatus, message, serialNumber) {
    const ticketNumber = formData.tickeT_NO || custDetail.tickeT_NO;

    await axiosInstance.post(`/CallRegister/UpdateComplaint/${ticketNumber}`, {
      complaint_Status: status,
      complaint_SubStatus: subStatus,
      CallTransferBY: loggedInUser,
      dlcity: serialNumber ? `${message} - ${serialNumber}` : message, // remark
    });
  }

  // async function handleSubmitRemark(requestType) {
  //   if (!requestType || !user || !detail) {
  //     setPopupMessage("Missing required data");
  //     setPopupOpen(true);
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       // TICKET_NO: detail.tickeT_NO,
  //       // remark: remark,
  //       // type: "open",
  //       // action: "Approved",
  //       // uid: user?.userID || 0,
  //       // --------------
  //       transactionType: "Jobno",
  //       transactionID: custDetail?.tickeT_KEY.toString() || "",
  //       transactionNo: detail.tickeT_NO || ticketNo || "",
  //       requestedBy: user?.userID.toString(),
  //       createdBy: user?.userID.toString(),
  //       approvalStatus: requestType,
  //       approvalRemarks: remark,
  //     };

  //     const res = await axiosInstance.post("/RequestCancellation/update", payload);

  //     const { statusMsg } = res.data;
  //     const { status, subStatus, message } = parseStatusMessage(statusMsg);

  //     console.log("msgs: ", {
  //       status,
  //       subStatus,
  //       message,
  //     });
  //     await updateJob(status, subStatus, message);
  //     await refreshHistory();

  //     const reqeust = requestType.split("|")[0];
  //     setPopupMessage(`Call cancellation request ${reqeust} successfully!`);
  //     setPopupOpen(true);
  //   } catch (err) {
  //     console.error("❌ API Failed:", err);
  //     logger.error(
  //       `Call cancellation request API Failed: ${err.message}, ${err.stack}`,
  //       "submitting remark"
  //     );
  //     setPopupMessage("Failed to submit ❌");
  //     setPopupOpen(true);
  //   }
  // }

  async function handleSubmitRemark(requestType) {
    const submitOperation = async () => {
      const payload = {
        transactionType: "Jobno",
        transactionID: custDetail?.tickeT_KEY?.toString() || "",
        transactionNo: detail.tickeT_NO || ticketNo || "",
        requestedBy: loggedInUser,
        createdBy: loggedInUser,
        approvalStatus: requestType,
        approvalRemarks: remark,
      };

      // ----------------------------
      // API 1: Update cancellation
      // ----------------------------
      const res = await axiosInstance.post("/RequestCancellation/update", payload);

      const { statusMsg } = res.data;
      const { status, subStatus, message } = parseStatusMessage(statusMsg);

      // ----------------------------
      // API 2: Update job status
      // ----------------------------
      await updateJob(status, subStatus, message);

      // ----------------------------
      // Refresh local history
      // ----------------------------
      await refreshHistory();

      return statusMsg; // used by toast success
    };

    toast.promise(
      submitOperation(),
      {
        loading: "Submitting request...",
        success: (statusMsg) => {
          // redirect AFTER toast success
          setTimeout(() => {
            router.back();
          }, 800);

          const action = requestType.split("|")[0];
          return `Call cancellation request ${action} successfully!`;
        },
        error: (err) => {
          const msg =
            err?.response?.data?.statusMsg || err?.message || "Failed to submit request";
          return msg;
        },
      },
      {
        style: {
          minWidth: "320px",
        },
      }
    );
  }

  function parseStatusMessage(statusMsg = "") {
    const [status, subStatus, message] = statusMsg.split("|");
    return { status, subStatus, message };
  }

  async function refreshHistory() {
    try {
      const res = await axiosInstance.get(
        `ComplaintHistory/history-by-ticket/${activeTicket}`
      );

      const data = res.data;
      setLogData(Array.isArray(data) ? data : [data]);
      await fetchCustomerDetails();
    } catch (err) {
      console.error("Failed to refresh history:", err);
    }
  }

  // async function handleCancelRemark() {
  //   try {
  //     const payload = {
  //       TICKET_NO: detail.tickeT_NO,
  //       remark: "Cancellation rejected by ASM",
  //       type: "open",
  //       action: "Reject",
  //       uid: user?.userID || 0,
  //     };

  //     console.log("📦 Sending reject payload:", payload);

  //     const res = await axiosInstance.post("/Cancellation/request", payload);
  //     console.log("✅ Rejection Success:", res.data);

  //     // 🔹 show popup instead of toast
  //     setPopupMessage("Cancellation rejected ❌");
  //     setPopupOpen(true);
  //   } catch (err) {
  //     console.error("❌ Reject API Failed:", err);
  //     setPopupMessage("Failed to reject request ❌");
  //     setPopupOpen(true);
  //   }
  // }

  async function loadVisitData() {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`visit/ticket/${ticketKey}`);
      const data = res.data;
      // setVisitData(Array.isArray(data) ? data : [data]);
      setVisitDetails(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch visit data:", err);
      toast.error("Failed to fetch visit data");
    } finally {
      setIsLoading(false);
    }
  }

  console.log("logData: ", logData);

  return (
    <div className="page-wrapper">
      <SideBar />

      <div className="content-area">
        {/* --------------------------- */}
        {user?.roleName === "SF/SSD" && (
          <>
            <h2 className="page-title">👉 Action</h2>
            {/* ✅ Dynamic buttons from API */}
            <div className="action-buttons mt-4 flex gap-4">
              {actions.length === 0 ? (
                <p className="text-gray-500">No actions available.</p>
              ) : (
                actions.map((action, index) => (
                  <button
                    key={index}
                    className={`rounded-md px-4 py-2 font-medium text-white transition-colors duration-200 ${
                      index === 0
                        ? "bg-blue-600 hover:bg-blue-700"
                        : index === 1
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={() => handleActionClick(action)}
                  >
                    {action}
                  </button>
                ))
              )}
              {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  {/* ========================= */}
                  {/* SMALL POPUP: Request For Cancellation */}
                  {/* ========================= */}
                  {selectedAction === "Request for cancellation" ? (
                    <div className="animate-fadeIn w-[450px] rounded-xl bg-white p-6 shadow-2xl">
                      {/* Header */}
                      <div className="mb-5 flex items-center justify-between border-b pb-3">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Request For Cancellation
                        </h2>
                        <button
                          onClick={() => setShowPopup(false)}
                          className="text-xl text-gray-600 transition hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Cancel Reason */}
                      <div className="mb-5 flex flex-col">
                        <label className="font-medium text-gray-700">
                          Cancel Reason:
                        </label>

                        <div style={{ width: "100%" }}>
                          <CustomDropdown
                            options={cancelReasons.map((item) => ({
                              label: item.value,
                              value: item.value,
                            }))}
                            value={selectedReason}
                            onChange={(val) => setSelectedReason(val)}
                            placeholder="----Select----"
                          />
                        </div>
                      </div>

                      {/* Remark */}
                      <div className="mb-5 flex flex-col">
                        <label className="font-medium text-gray-700">Remark:</label>
                        <textarea
                          className="h-20 rounded-md border px-3 py-2"
                          placeholder="Enter remark here..."
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                        />
                      </div>

                      {/* ============================== */}
                      {/* CONFIRMATION BOX (ADDED) */}
                      {/* ============================== */}
                      {confirmCancel && (
                        <div className="animate-fadeIn mb-5 rounded-md border border-yellow-300 bg-yellow-100 p-3 text-yellow-800">
                          <p className="font-medium">
                            Are you sure you want to submit this cancellation?
                          </p>

                          <div className="mt-3 flex justify-end gap-3">
                            <button
                              onClick={() => setConfirmCancel(false)}
                              className="rounded-md bg-gray-300 px-4 py-1 text-gray-800 hover:bg-gray-400"
                            >
                              No
                            </button>

                            <button
                              onClick={() => {
                                setConfirmCancel(false);
                                handleSubmitCancellation();
                              }}
                              className="rounded-md bg-red-600 px-4 py-1 text-white hover:bg-red-700"
                            >
                              Yes, Submit
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="mt-6 flex justify-end gap-4">
                        <button
                          onClick={() => setConfirmCancel(true)}
                          className="rounded-md bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
                        >
                          Submit Cancellation
                        </button>
                      </div>
                    </div>
                  ) : selectedAction === "WIP" ? (
                    /* ========================= */
                    /* SPECIAL POPUP FOR WIP ONLY */
                    /* ========================= */
                    <div className="animate-fadeIn w-[450px] rounded-xl bg-white p-6 shadow-2xl">
                      {/* Header */}
                      <div className="mb-5 flex items-center justify-between border-b pb-3">
                        <h2 className="text-xl font-semibold text-gray-800">WIP</h2>
                        <button
                          onClick={() => setShowPopup(false)}
                          className="text-xl text-gray-600 transition hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Serial Number Input */}
                      {/* Ticket Number */}
                      <div className="mb-10 flex flex-col">
                        <label className="font-medium text-gray-700">
                          Ticket Number:
                        </label>
                        <div className="rounded-md border bg-gray-100 px-3 py-2">
                          {detail.tickeT_NO || "-"}
                        </div>
                      </div>
                      <div className="mb-6 flex flex-col">
                        <label className="font-medium text-gray-700">
                          Validate Serial Number:
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Serial Number"
                          className="rounded-md border px-3 py-2"
                          value={serialNumber}
                          onChange={(e) => setSerialNumber(e.target.value)}
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={handleSerialCheck}
                          className="rounded-md bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                        >
                          Check Serial Number
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ========================= */
                    /* BIG POPUP: Re-allot, Assigned, etc. */
                    /* ========================= */
                    <div className="animate-fadeIn w-[85%] max-w-5xl rounded-xl bg-white p-6 shadow-2xl">
                      {/* Header */}
                      <div className="mb-5 flex items-center justify-between border-b pb-3">
                        <h2 className="text-2xl font-semibold tracking-wide text-gray-800">
                          {selectedAction}
                        </h2>
                        <button
                          onClick={() => setShowPopup(false)}
                          className="text-xl text-gray-600 transition hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>

                      {/* FORM GRID */}
                      <div className="grid grid-cols-3 gap-6">
                        {/* Ticket Number */}
                        <div className="flex flex-col">
                          <label className="font-medium text-gray-700">
                            Ticket Number:
                          </label>
                          <div className="rounded-md border bg-gray-100 px-3 py-2">
                            {detail.tickeT_NO || "-"}
                          </div>
                        </div>

                        {/* ASC Name */}
                        <div className="flex flex-col">
                          <label className="font-medium text-gray-700">ASC Name:</label>
                          <div className="rounded-md border bg-gray-100 px-3 py-2">
                            {detail.asC_NAME || "-"}
                          </div>
                        </div>

                        {/* Engineer Name */}
                        <div className="flex flex-col">
                          {/* <label className="font-medium text-gray-700">
                            Engineer Name:
                          </label>
                          <div className="rounded-md border bg-gray-100 px-3 py-2">
                            {detail.engName || "Null"}
                          </div> */}
                          <label className="flex flex-col">
                            <span className="font-semibold">Engineer Name:</span>
                            <select
                              className="rounded border p-2"
                              value={formData.Eng_ID}
                              onChange={(e) => handleChange("eng_ID", e.target.value)}
                            >
                              <option value="">-- Select Engineer --</option>
                              {engineerData &&
                                engineerData.map((data) => (
                                  <option key={data.Eng_ID} value={data.Eng_ID}>
                                    {data.Eng_Name}
                                  </option>
                                ))}
                            </select>
                          </label>
                        </div>

                        <div className="flex flex-col">
                          <label className="font-medium text-gray-700">Address:</label>
                          <textarea
                            className="h-20 rounded-md border bg-gray-100 px-3 py-2"
                            readOnly
                            value={[detail?.addresS1, detail?.addresS2, detail?.addresS3]
                              .filter(Boolean)
                              .join(", ")}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="font-medium text-gray-700">
                            Promise Date:
                          </label>
                          <div className="rounded-md border bg-gray-100 px-3 py-2">
                            {detail?.promisE_DATE?.split("T")[0] || "-"}
                          </div>
                        </div>
                        <div className="col-span-3 grid grid-cols-3 gap-6">
                          {/* Appointment Date */}
                          <div className="flex flex-col">
                            <label className="font-medium text-gray-700">
                              Appointment Date:
                            </label>
                            <input
                              type="date"
                              className="rounded-md border px-3 py-2"
                              min={todayStr} // 🚀 minimum = today
                              // value={appointmentDate}
                              value={formData.appointmentDate}
                              onChange={(e) => {
                                // setAppointmentDate(e.target.value);
                                handleChange("appointmentDate", e.target.value);
                                setSelectedHour("");
                                setSelectedMinute("");
                              }}
                              // min={new Date().toISOString().split("T")[0]}
                              max={
                                new Date(Date.now() + 72 * 60 * 60 * 1000)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            />
                          </div>

                          {/* Hour */}
                          <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Hour:</label>
                            <select
                              className="rounded-md border px-3 py-2"
                              // value={selectedHour}
                              // onChange={(e) => setSelectedHour(e.target.value)}
                              value={formData.appointmentHour}
                              onChange={(e) =>
                                handleChange("appointmentHour", e.target.value)
                              }
                            >
                              <option value="">--Hour--</option>
                              {getAllowedHours(formData.appointmentDate).map((h) => (
                                <option key={h} value={h}>
                                  {h}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Minute */}
                          <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Minute:</label>
                            <select
                              className="rounded-md border px-3 py-2"
                              // value={selectedMinute}
                              // onChange={(e) => setSelectedMinute(e.target.value)}
                              value={formData.appointmentMinute}
                              onChange={(e) =>
                                handleChange("appointmentMinute", e.target.value)
                              }
                            >
                              <option value="">--Minute--</option>
                              {getAllowedMinutes(
                                formData.appointmentDate,
                                formData.appointmentHour
                              ).map((m) => (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Promise Date */}

                        {/* Contact Person */}

                        {/* Address + Remark */}
                        <div className="col-span-3 grid grid-cols-2 gap-6">
                          <div className="flex flex-col">
                            <label className="font-medium text-gray-700">
                              Contact Person:
                            </label>
                            <input
                              className="rounded-md border px-3 py-2"
                              defaultValue=""
                              onChange={(e) =>
                                handleChange("contactPerson", e.target.value)
                              }
                            />
                          </div>

                          {/* Customer Remark */}
                          <div className="flex flex-col">
                            <label className="font-medium text-gray-700">
                              Customer Remark:
                            </label>
                            <textarea
                              value={formData.customerRemark}
                              onChange={(e) =>
                                handleChange("customerRemark", e.target.value)
                              }
                              className="h-20 rounded-md border px-3 py-2"
                            />
                          </div>
                        </div>

                        {/* Cancel Reason */}
                      </div>

                      {/* Footer */}
                      <div className="mt-8 flex justify-end gap-4">
                        <button
                          onClick={handleAssigned}
                          className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        {/* -------------------------- */}
        {fromPage === "dashboardcall" &&
          user?.roleName === "ASM" &&
          detail.complainT_STATUS === "Open" &&
          detail.complaint_SubStatus === "Request for re-allot" && (
            <AllotmentDetails
              formData={formData}
              onChange={handleChange}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        {/* ✅ Popup goes here so it always overlays this page */}
        <Popup
          isOpen={popup.isOpen}
          message={popup.message}
          onClose={() => setPopup({ isOpen: false, message: "" })}
        />
        {mounted && user?.roleName === "CC" && custDetail && (
          <button
            onClick={() => setEditCustomerPopupOpen(true)}
            className="mb-6 h-12 w-32 rounded-lg bg-[#714b67] text-white"
          >
            Edit Customer
          </button>
        )}
        {/* // TODO: */}
        <EditCustPopup
          isOpen={editCustomerPopupOpen}
          onClose={() => setEditCustomerPopupOpen(false)}
          details={{
            firstName: custDetail?.firstname || "",
            lastName: custDetail?.lastname || "",
            address: custDetail?.addresS1 || "",
            landmark: custDetail?.landmark || "",
            custintcode: custDetail?.custintcode || "",
          }}
          onUpdated={fetchCustomerDetails}
        />
        <CancelPopup
          isOpen={cancelPopupOpen}
          onClose={() => setCancelPopupOpen(false)}
          onSubmit={handleRequestCancellation}
          formData={formData}
          setFormData={setFormData}
        />
        <h2 className="page-title">📋 Complaint History</h2>
        {prevPage === "special-approval" && (
          <>
            <Button className="mb-4 w-42" onClick={onOpenAllowanceModal}>
              Req Sp. Allowance
            </Button>
            <Modal open={allowancePopup} onClose={onCloseAllowanceModal} center>
              <SpeicalApprovalPopup ticketNo={activeTicket} />
            </Modal>
          </>
        )}
        {prevPage === "special-allowance-request" && (
          <>
            <Button className="mb-4 w-42" onClick={onOpenAllowanceModal}>
              Allowance Req
            </Button>
            <Modal open={allowancePopup} onClose={onCloseAllowanceModal} center>
              <SpeicalAllowancePopup ticketNo={activeTicket} />
            </Modal>
          </>
        )}
        {fromPage === "dashboardcall" &&
          user?.roleName === "ASM" &&
          detail.complainT_STATUS === "Open" &&
          detail.complaint_SubStatus === "Cancellation Request to ASM" && (
            <RemarkSection
              onSubmit={() => handleSubmitRemark("approved-asm")}
              onCancel={() => handleSubmitRemark("rejected-asm")}
              remark={remark}
              setRemark={setRemark}
            />
          )}
        {fromPage === "dashboardcall" &&
          user?.roleName === "ZONE" &&
          detail.complainT_STATUS === "Open" &&
          detail.complaint_SubStatus === "Cancellation Request moved to RSM" && (
            <RemarkSection
              onSubmit={() => handleSubmitRemark("approved-RSM")}
              onCancel={() => handleSubmitRemark("rejected-RSM")}
              remark={remark}
              setRemark={setRemark}
            />
          )}
        {/* Popup modal */}
        <Popup
          isOpen={popupOpen}
          message={popupMessage}
          onClose={() => setPopupOpen(false)}
        />
        {loading ? (
          <div className="loading">Loading history...</div>
        ) : logData.length === 0 ? (
          <p className="empty">No data found.</p>
        ) : (
          <>
            {/* history table still from ComplaintHistory */}
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>S. No</th>
                  <th>Complaint No</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Entered Date</th>
                  <th>Entered By</th>
                </tr>
              </thead>

              <tbody>
                {[...visibleRows].reverse().map((row, index) => (
                  <tr key={index}>
                    <td>{pageSize * (currentPage - 1) + (index + 1)}</td>
                    <td>{row.ticketNo}</td>
                    <td> {row.complaintStatus}</td>
                    <td>{row.complaintSubStatus || "-"}</td>
                    <td>{row.tdate ? new Date(row.tdate).toLocaleString() : "-"}</td>
                    <td>{row.enteredBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {INITALPAGESIZE < logData.length && (
              <div className="mb-18">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            )}

            {/* Tabs */}
            {/* <div className="tab-bar ">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-button mx-1 px-1 ${
                    tab === activeTab ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div> */}

            <div className="tab-bar m-0 mt-6 flex gap-0 p-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-button m-0 p-0 ${tab === activeTab ? "active" : ""}`}
                  onClick={() => {
                    if (tab === "Visit Detail") {
                      loadVisitData();
                    }
                    setActiveTab(tab);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === "Job Details" && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>📌 Job Details</h3>
                  <div className="row-content">
                    <div>
                      <strong>Ticket No:</strong> {detail.tickeT_NO || "-"}
                    </div>
                    <div>
                      <strong>Complaint Sub-status:</strong>{" "}
                      {detail.complaint_SubStatus || "-"}
                    </div>
                    <div>
                      <strong>Complaint Status:</strong> {detail.complainT_STATUS || "-"}
                    </div>
                    <div>
                      <strong>Remarks:</strong> {detail.email || "-"}
                    </div>
                    <div>
                      <strong>Call By:</strong> {detail.calL_BY || "-"}
                    </div>
                    <div className="!overflow-hidden !text-ellipsis !whitespace-nowrap">
                      <strong>Complaint Date:</strong>

                      {detail.tdate
                        ? new Date(detail.tdate).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "-"}
                    </div>
                    <div>
                      <strong>Call Type:</strong> {detail.calL_TYPE || "-"}
                    </div>
                    <div>
                      <strong>Entered By:</strong> {detail.enterby || "-"}
                    </div>
                    <div>
                      <strong>Escalated to HO:</strong>{" "}
                      {firstEntry.escalated === 1 ? "Yes" : "No"}
                    </div>
                    <div>
                      <strong>NSP:</strong> {detail.branchName || "-"}
                    </div>
                    <div>
                      <strong>SF Name:</strong> {detail.asC_NAME || "-"}
                    </div>
                    <div>
                      <strong>SF Code:</strong> {detail.asC_CODE || "-"}
                    </div>
                    <div>
                      <strong>SF Mobile No.:</strong> {detail.stdCode || "-"}
                    </div>
                    <div>
                      <strong>Appointment Date:</strong>{" "}
                      {formatIndianDate(detail.apptDate) || "-"}
                    </div>
                    <div>
                      <strong>Appointment Time:</strong> {detail.apptTime || "-"}
                    </div>
                    <div>
                      <strong>Promise Date:</strong>

                      {detail.promisE_DATE ? formatIndianDate(detail.promisE_DATE) : "-"}
                    </div>
                    <div>
                      <strong>Promise Time:</strong> {detail.promisE_TIME || "-"}
                    </div>
                    <div>
                      <strong>Legal Case:</strong> {detail.legal === 1 ? "Yes" : "No"}
                    </div>
                    <div>
                      <strong>Special Instructions:</strong> {detail.splInt || "-"}
                    </div>
                    <div>
                      <strong>VOC:</strong> {detail.remarks || "-"}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Customer Detail" && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>👤 Customer Detail</h3>
                  <div className="row-content">
                    <div>
                      <strong>Salutation:</strong> {detail.salutation || "-"}
                    </div>
                    <div>
                      <strong>Name:</strong>{" "}
                      {`${detail.firstname || ""} ${detail.middlename || ""} ${
                        detail.lastname || ""
                      }`}
                    </div>
                    <div>
                      <strong>Mobile No:</strong> {detail.mobile || "-"}
                    </div>
                    <div>
                      <strong>Alternate No:</strong> {detail.wkph || detail.hmph || "-"}
                    </div>
                    <div>
                      <strong>Caller Number:</strong> {detail.complaint || "-"}
                    </div>
                    <div>
                      <strong>Address:</strong>{" "}
                      {`${detail.addresS1 || ""} ${detail.addresS2 || ""} ${
                        detail.addresS3 || ""
                      }`}
                    </div>
                    <div>
                      <strong>Landmark:</strong> {detail.landmark || "-"}
                    </div>
                    <div>
                      <strong>Locality:</strong> {detail.locality || "-"}
                    </div>
                    <div>
                      <strong>City:</strong> {detail.city || "-"}
                    </div>
                    <div>
                      <strong>Pincode:</strong> {detail.pincode || "-"}
                    </div>
                    <div>
                      <strong>State:</strong> {detail.state || "-"}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Product Details" && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>📦 Product Details</h3>
                  <div className="row-content">
                    <div>
                      <strong>Model:</strong> {detail.model || "-"}
                    </div>
                    <div>
                      <strong>Product Category:</strong> {detail.category || "-"}
                    </div>
                    <div>
                      <strong>Serial No.:</strong> {detail.seriaL_NO || "-"}
                    </div>
                    <div>
                      <strong>Purchase Date:</strong>{" "}
                      {detail.purchasE_DATE
                        ? new Date(detail.purchasE_DATE).toLocaleDateString()
                        : "-"}
                    </div>
                    <div>
                      <strong>Warranty:</strong> {detail.warranty || "-"}
                    </div>
                    <div>
                      <strong>BOM Type:</strong> {detail.bomType || "-"}
                    </div>
                    <div>
                      <strong>Model Description:</strong> {detail.modelDesc || "-"}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Pending Level" && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>🛠️ Pending Level</h3>

                  {pendingHistory.length === 0 ? (
                    <p>No pending history found.</p>
                  ) : (
                    pendingHistory.map((item, index) => (
                      <div className="row-content" key={item.id}>
                        <div>
                          <strong>Sr. No:</strong> {index + 1}
                        </div>
                        <div>
                          <strong>Ticket No:</strong> {item.ticket_No || "-"}
                        </div>
                        <div>
                          <strong>Ticket Key:</strong> {item.ticket_Key || "-"}
                        </div>
                        <div>
                          <strong>Pending At:</strong> {item.pendingAt || "-"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "Documents" && (
                <div className="tab-section2">
                  <h3 style={{ fontWeight: "bold" }}>📂 Document Uploaded</h3>

                  {documents.length === 0 ? (
                    <p>No documents found.</p>
                  ) : (
                    <table className="complaint-table">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Document Type</th>
                          <th>Entered Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{doc.documentType || "-"}</td>
                            <td>{doc.enteredDate || "-"}</td>
                            <td>
                              {doc.documentURL1 ? (
                                <a
                                  href={doc.documentURL1.replace("..\\", "/")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="view-btn"
                                >
                                  View
                                </a>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeTab === "Document Uploaded from Android Application" && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>🧪 Test Info</h3>
                  <div className="row-content">
                    <div>
                      <strong>Info:</strong> Test content (example)
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "Job Done" && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>🧪 Job Done</h3>
                  <div className="row-content">
                    <div>
                      <strong>Sr. No.:</strong> {detail.seriaL_NO || "-"}
                    </div>

                    <div>
                      <strong>Level.:</strong> Test content (example)
                    </div>

                    <div>
                      <strong>Entered Date.:</strong> Test content (example)
                    </div>

                    <div>
                      <strong>Entered Time.:</strong> Test content (example)
                    </div>

                    <div>
                      <strong>Entered By.:</strong> Test content (example)
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "Consumption" && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>📦 Part Consumption</h3>
                  {
                    partConsumption.length === 0 ? (
                      <p>No part consumption found.</p>
                    ) : (
                      // -------------------------------------

                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-sm">
                          <thead className="bg-[#714b67] text-white">
                            <tr>
                              <th className="border border-gray-300 px-3 py-2">Sr. No</th>
                              <th className="border border-gray-300 px-3 py-2">
                                Part Code
                              </th>
                              <th className="border border-gray-300 px-3 py-2">
                                Description
                              </th>
                              <th className="border border-gray-300 px-3 py-2">
                                Consumption Date
                              </th>
                              <th className="border border-gray-300 px-3 py-2">
                                Inventory Type
                              </th>
                              <th className="border border-gray-300 px-3 py-2">
                                Fresh/Faulty
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {partConsumption.map((item, index) => (
                              <tr key={index} className="even:bg-gray-50">
                                <td className="border border-gray-300 px-3 py-2">
                                  {index + 1 || "-"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  {item.pC_PartCode || "-"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  {item.pC_PartDesc || "-"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  {item.pC_Date
                                    ? new Date(item.pC_Date).toLocaleDateString()
                                    : "-"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  {item.inventoryType ?? "-"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  {item.isFreshFaulty ? "Yes" : "No"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )

                    //   partConsumption.map((item, index) => (
                    //     <div className="row-content" key={item.pC_ID || index}>
                    //       <div>
                    //         <strong>Sr. No:</strong> {item.pC_Srno || "-"}
                    //       </div>
                    //       <div>
                    //         <strong>Part Code:</strong>{" "}
                    //         {item.pC_PartCode || "-"}
                    //       </div>
                    //       <div>
                    //         <strong>Description:</strong>{" "}
                    //         {item.pC_PartDesc || "-"}
                    //       </div>
                    //       <div>
                    //         <strong>Consumption Date:</strong>{" "}
                    //         {item.pC_Date
                    //           ? new Date(item.pC_Date).toLocaleDateString()
                    //           : "-"}
                    //       </div>

                    //       <div>
                    //         <strong>Inventory Type:</strong>{" "}
                    //         {item.inventoryType ?? "-"}
                    //       </div>
                    //       <div>
                    //         <strong>Fresh Faulty:</strong>{" "}
                    //         {item.isFreshFaulty ? "Yes" : "No"}
                    //       </div>
                    //     </div>
                    //   ))
                    // )
                    // --------------------}
                  }
                </div>
              )}
              {activeTab === "Visit Detail" && (
                <div className="tab-section">
                  {isLoading && (
                    <div className="flex h-full w-full items-center justify-center">
                      <Loader />
                    </div>
                  )}
                  <h3 style={{ fontWeight: "bold" }}>🧪 Visit Details</h3>
                  {visitDetails.length > 0 ? (
                    // visitDetails.map((visit, index) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-300 text-sm">
                        <thead className="bg-[#714b67] text-white">
                          <tr>
                            <th className="border border-gray-300 px-3 py-2">Sr. No</th>
                            <th className="border border-gray-300 px-3 py-2">
                              Visit Details
                            </th>
                            <th className="border border-gray-300 px-3 py-2">
                              Visit Date
                            </th>
                            <th className="border border-gray-300 px-3 py-2">Eng Name</th>
                            <th className="border border-gray-300 px-3 py-2">In time</th>
                            <th className="border border-gray-300 px-3 py-2">Out time</th>
                            <th className="border border-gray-300 px-3 py-2">Status</th>
                            <th className="border border-gray-300 px-3 py-2">Remarks</th>
                          </tr>
                        </thead>

                        <tbody>
                          {visitDetails.map((item, index) => (
                            <tr key={index} className="even:bg-gray-50">
                              {/* S.No */}
                              <td className="border border-gray-300 px-3 py-2">
                                {index + 1}
                              </td>
                              {/* VISIT DETAIL */}
                              <td className="border border-gray-300 px-3 py-2">
                                {item.visitDetail || "-"}
                              </td>
                              {/* DATE (Formatted for India) */}
                              <td className="border border-gray-300 px-3 py-2">
                                {item.vDate ? formatIndianDate(item.vDate) : "-"}
                              </td>
                              {/* ENGINEER NAME */}
                              <td className="border border-gray-300 px-3 py-2">
                                {item.engName || "-"}
                              </td>
                              {/* IN / OUT TIME */}
                              <td className="border border-gray-300 px-3 py-2">
                                {item.vInTime || "-"}
                              </td>{" "}
                              <td className="border border-gray-300 px-3 py-2">
                                {item.vOutTime || "-"}
                              </td>
                              {/* STATUS */}
                              <td className="border border-gray-300 px-3 py-2">
                                <span
                                  className={`rounded px-2 py-1 text-xs ${item.vStatus === "OK" ? "bg-green-100 text-green-800" : "bg-gray-100"} ${item.vStatus === "Part Pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100"}`}
                                >
                                  {item.vStatus || "-"}
                                </span>
                              </td>
                              {/* REMARK */}
                              <td className="border border-gray-300 px-3 py-2">
                                {item.remark || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    // ))
                    <p>No visit details found.</p>
                  )}
                </div>
              )}
            </div>

            {user?.roleName === "CC" && (
              <div className="reminder-section">
                <h3 className="page-title">⏰ Add Reminder</h3>
                <form
                  className="reminder-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const storedTicket = sessionStorage.getItem("currentTicket");
                    const ticket = ticketNo || storedTicket;
                    if (!ticket) return alert("Ticket not found");

                    try {
                      const payload = {
                        Remind_Remark: reminderText,
                        Remind_Enterby: loggedInUser,
                        Ticket_No: ticket || "-",
                        Remind_Sfid: detail.sf_ID || 0,
                        Remind_Bid: detail.bid || 0,
                        Remind_Status: "1",
                      };
                      // console.log("📦 Sending Reminder Payload:", payload);
                      await axiosInstance.post("/reminder/create", payload);

                      const res = await axiosInstance.get(`/reminder/Ticket/${ticket}`);
                      const data = Array.isArray(res.data) ? res.data : [res.data];
                      setReminders(data);

                      setReminderReason("");
                      setReminderText("");

                      toast.success("Reminder added successfully!");
                    } catch (err) {
                      console.error("Failed to add reminder:", err);
                      toast.error("Failed to add reminder");
                    }
                  }}
                >
                  <label>
                    <span>Reminder Reason</span>
                    <div style={{ width: 500 }}>
                      <CustomDropdown
                        options={reminderOptions}
                        value={reminderReason}
                        onChange={(val) => setReminderReason(val)}
                        placeholder="Select Type"
                      />
                    </div>
                  </label>

                  <label style={{ width: 500 }}>
                    <textarea
                      placeholder="Enter reminder notes..."
                      value={reminderText}
                      onChange={(e) => setReminderText(e.target.value)}
                    />
                  </label>

                  <button type="submit">Add Reminder</button>
                </form>

                {/* 🔹 Reminder History */}
                {loadingReminders ? (
                  <p>Loading reminders...</p>
                ) : reminders.length === 0 ? (
                  <p>No reminders found.</p>
                ) : (
                  <table className="complaint-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Remark</th>
                        <th>Entered By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reminders.map((rem, index) => (
                        <tr key={index}>
                          <td>
                            {rem.remind_date
                              ? new Date(rem.remind_date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>{rem.remind_Remark || "-"}</td>
                          <td>{rem.remind_Enterby || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="loading">Loading page...</div>}>
      <HistoryPageContent />
    </Suspense>
  );
}
