"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense, useCallback } from "react"; // ✅ import Suspense
import { useParams, useSearchParams } from "next/navigation";
import SideBar from "@/components/SideBar";
import "./history.css";
import axiosInstance from "@/api/axiosInstance";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomDropdown from "@/components/common/Dropdown";
import RemarkSection from "@/components/history/RemarkSection";
import AllotmentDetails from "@/components/history/AllotmentDetails";
import Popup from "@/components/common/Popup";
import { useRouter } from "next/navigation";
import CancelPopup from "./CancelPopup";
import EditCustPopup from "./EditCustPopup";

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

  const searchParams = useSearchParams(); // ✅ now safe inside Suspense
  const fromPage = searchParams.get("fromPage");
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

  const role = user?.roleName;

  useEffect(() => {
    if (custDetail) {
      setFormData({
        ascName: custDetail.asC_NAME || "",
        tickeT_NO: custDetail.tickeT_NO || "",
        calL_TYPE: custDetail.calL_TYPE || "-",
        call_TypeID: custDetail.call_TypeID || 0,
        loggedInUserId: loggedInUserId || 0,
        DOP: detail.purchasE_DATE || "-",
        engineer: custDetail.engineeR_NAME || "-",
        eng_ID: custDetail.eng_ID || "-",
      });
    }
  }, [custDetail]);

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const buildPayload = (action) => ({
    TICKET_NO: formData.tickeT_NO,
    Apptdate: formData.appointmentDate,
    Appttime: `${formData.appointmentHour || "00"}:${
      formData.appointmentMinute || "00"
    }`,
    DOP: formData.DOP,
    Reallot: formData.reAllot ? 1 : 0,
    Type: "Re-Allot",
    Type1: "ASM",
    ContactPersion: formData.engineer,
    CustomerRemark: formData.customerRemark,
    UsrId: loggedInUserId,
    Eng_Id: formData.eng_ID,
    CallTypeID: formData.call_TypeID,
    CallType: formData.calL_TYPE,
    Action: action,
  });
  const handleApprove = async () => {
    const payload = buildPayload("Approved");
    try {
      await axiosInstance.post("/JobSheet/process", payload);
      setPopup({ isOpen: true, message: "Approved successfully!" });

      setTimeout(() => {
        router.push("/nsp/dashboard"); // ✅ redirect to dashboard
      }, 1500); // wait 1.5s so popup is visible
    } catch (err) {
      console.error("Approve Error:", err);
      setPopup({ isOpen: true, message: "Failed to approve" });
    }
  };

  const handleReject = async () => {
    const payload = buildPayload("Reject");
    try {
      await axiosInstance.post("/JobSheet/process", payload);
      setPopup({ isOpen: true, message: "Rejected successfully!" });

      setTimeout(() => {
        router.push("/nsp/dashboard"); // ✅ redirect to dashboard
      }, 1500);
    } catch (err) {
      console.error("Reject Error:", err);
      setPopup({ isOpen: true, message: "Failed to reject" });
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
  }, [custDetail]);

  // end for realott
  // COMPLAINT DETAILS
  useEffect(() => {
    const storedTicket = sessionStorage.getItem("currentTicket");
    if (storedTicket) {
      // fetch data with storedTicket
      axiosInstance
        .get(`ComplaintHistory/history-by-ticket/${storedTicket}`)
        .then((res) =>
          setLogData(Array.isArray(res.data) ? res.data : [res.data]),
        )
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));

      axiosInstance
        .get(`ComplaintCustDetail/${storedTicket}`)
        .then((res) => setCustDetail(res.data))
        .catch((err) => console.error(err));
    }
  }, []);
  // Fetch history logs
  useEffect(() => {
    if (ticketNo) {
      axiosInstance
        .get(`ComplaintHistory/history-by-ticket/${ticketNo}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [res.data];
          setLogData(data);
        })
        .catch((err) => console.error("Failed to fetch history:", err))
        .finally(() => setLoading(false));
    }
  }, [ticketNo]);

  useEffect(() => {
    if (ticketNo) {
      axiosInstance
        .get(`PartConsumption/ByTicket/${ticketNo}`)
        .then((res) =>
          setPartConsumption(Array.isArray(res.data) ? res.data : []),
        )
        .catch((err) =>
          console.error("Failed to fetch part consumption:", err),
        );
    }
  }, [ticketNo]);

  // Fetch customer + complaint detail
  useEffect(() => {
    const storedTicket = sessionStorage.getItem("currentTicket");
    const fetchTicket = ticketNo || storedTicket; // fallback
    if (fetchTicket) {
      console.log("Fetching PartConsumption for ticket:", fetchTicket);
      axiosInstance
        .get(`PartConsumption/ByTicket/${fetchTicket}`)
        .then((res) =>
          setPartConsumption(Array.isArray(res.data) ? res.data : [res.data]),
        )
        .catch((err) =>
          console.error("Failed to fetch part consumption:", err),
        );
    }
  }, [ticketNo]);

  useEffect(() => {
    const storedTicket = sessionStorage.getItem("currentTicket");
    const fetchTicket = ticketNo || storedTicket; // fallback
    if (fetchTicket) {
      axiosInstance
        .get(`DocumentUpload/ticket/${fetchTicket}`)
        .then((res) => setDocuments(Array.isArray(res.data) ? res.data : []))
        .catch((err) => console.error("Failed to fetch documents:", err));
    }
  }, [ticketNo]);

  useEffect(() => {
    const storedTicket = sessionStorage.getItem("currentTicket");
    const fetchTicket = ticketNo || storedTicket;

    if (fetchTicket) {
      axiosInstance
        .get(`LevelPendingHistory/ticket/${fetchTicket}`)
        .then((res) =>
          setPendingHistory(Array.isArray(res.data) ? res.data : []),
        )
        .catch((err) =>
          console.error("Failed to fetch Pending Level History:", err),
        );
    }
  }, [ticketNo]);

  useEffect(() => {
    const storedTicket = sessionStorage.getItem("currentTicket");
    const fetchTicket = ticketNo || storedTicket;

    if (fetchTicket) {
      axiosInstance
        .get(`visit/ticket/${fetchTicket}`)
        .then((res) => setVisitDetails(Array.isArray(res.data) ? res.data : []))
        .catch((err) => console.error("Failed to fetch visit details:", err));
    }
  }, [ticketNo]);

  useEffect(() => {
    const storedTicket = sessionStorage.getItem("currentTicket");
    const fetchTicket = ticketNo || storedTicket;

    if (fetchTicket) {
      axiosInstance
        .get(`reminder/Ticket/${fetchTicket}`)
        .then((res) => {
          // ✅ Handle single object OR array
          const data = Array.isArray(res.data) ? res.data : [res.data];
          setReminders(data);
        })
        .catch((err) => console.error("Failed to fetch reminders:", err))
        .finally(() => setLoadingReminders(false));
    }
  }, [ticketNo]);

  const firstEntry = logData[0] || {};
  const detail = custDetail || {};

  const fetchCustomerDetails = useCallback(() => {
    const storedTicket = sessionStorage.getItem("currentTicket");
    if (!storedTicket) return;

    axiosInstance
      .get(`ComplaintCustDetail/${storedTicket}`)
      .then((res) => setCustDetail(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchCustomerDetails();
  }, [fetchCustomerDetails]);

  // useEffect(() => {
  //   const fetchActions = async () => {
  //     try {
  //       const storedTicket = sessionStorage.getItem("currentTicket");
  //       if (!storedTicket) return;

  //       const { data: complaintDetail } = await axiosInstance.get(
  //         `ComplaintCustDetail/${storedTicket}`
  //       );

  //       if (!complaintDetail) return;

  //       const complaintStatus = complaintDetail.complainT_STATUS ;
  //       const complaintSubStatus = complaintDetail.complainT_SUBSTATUS ;
  //       const role = "SF/SSD";

  //       const payload = {
  //         type: "jobactions",
  //         role: "SF/SSD",
  //         complaint_SubStatus: complaintSubStatus,
  //         complaint_Status: "ToAllot",
  //       };

  //       const res = await axiosInstance.post("ActionMaster/get-actions", payload);
  //       console.log("Response:", res.data);
  //       if (Array.isArray(res.data) && res.data.length > 0) {
  //         const actionsString = res.data[0].action || "";
  //         setActions(actionsString.split(",").map((a) => a.trim()));
  //       } else {
  //         console.warn("No actions found for:", payload);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch actions:", error);
  //     }
  //   };

  //   fetchActions();
  // }, [ticketNo]);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const storedTicket = sessionStorage.getItem("currentTicket");
        if (!storedTicket) return;

        // ✅ Fetch complaint detail dynamically
        const { data: complaintDetail } = await axiosInstance.get(
          `ComplaintCustDetail/${storedTicket}`,
        );

        if (!complaintDetail) return;

        // ✅ Dynamically extract from API + Redux
        const complaintStatus = complaintDetail.complainT_STATUS || "";
        const complaintSubStatus = complaintDetail.complaint_SubStatus || "";
        const userRole = user?.roleName || "Unknown";
        const calltype = complaintDetail.calL_TYPE || "";
        const product = complaintDetail.product || "";

        // ✅ Build payload dynamically
        const payload = {
          type: "jobactions",
          role: userRole,
          complaint_SubStatus: "Assigned",
          complaint_Status: "open",
          calltype: "installation",
          product: "smart led",
        };

        console.log("Dynamic Payload:", payload);

        const res = await axiosInstance.post(
          "ActionMaster/get-actions",
          payload,
        );
        console.log("Response:", res.data);

        if (Array.isArray(res.data) && res.data.length > 0) {
          const actionsString = res.data[0].action || "";
          setActions(actionsString.split(",").map((a) => a.trim()));
        } else {
          console.warn("No actions found for:", payload);
          setActions([]); // clear if empty
        }
      } catch (error) {
        console.error("Failed to fetch actions:", error);
      }
    };

    fetchActions();
  }, [ticketNo, user]);

  useEffect(() => {
    fetchCancelReasons();
  }, []);

  const fetchCancelReasons = async () => {
    try {
      const res = await axiosInstance.post(
        "DropdownMaster/GetDropdown",
        { type: "CancelReason" }, // ✅ required payload
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
      const res = await axiosInstance.post(
        "/RequestCancellation/create",
        payload,
      );

      console.log("API Response:", res.data);

      // ✔ Show the message coming from API response
      if (res?.data?.statusMsg) {
        alert(res.data.statusMsg);
      } else {
        alert("Cancellation Request Submitted Successfully!");
      }

      // ✔ Close popup only when success
      // If statusMsg indicates failure, popup will remain open
      if (
        res?.data?.statusCode === 200 &&
        res.data.statusMsg.includes("success")
      ) {
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
  };

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
                        <label className="font-medium text-gray-700">
                          Remark:
                        </label>
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
                        <h2 className="text-xl font-semibold text-gray-800">
                          WIP
                        </h2>
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
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-end gap-4">
                        <button className="rounded-md bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
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
                          <label className="font-medium text-gray-700">
                            ASC Name:
                          </label>
                          <div className="rounded-md border bg-gray-100 px-3 py-2">
                            {detail.asC_NAME || "-"}
                          </div>
                        </div>

                        {/* Engineer Name */}
                        <div className="flex flex-col">
                          <label className="font-medium text-gray-700">
                            Engineer Name:
                          </label>
                          <div className="rounded-md border bg-gray-100 px-3 py-2">
                            {detail.engName || "Null"}
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <label className="font-medium text-gray-700">
                            Address:
                          </label>
                          <textarea
                            className="h-20 rounded-md border bg-gray-100 px-3 py-2"
                            readOnly
                            value={[
                              detail?.addresS1,
                              detail?.addresS2,
                              detail?.addresS3,
                            ]
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
                              value={appointmentDate}
                              onChange={(e) => {
                                setAppointmentDate(e.target.value);
                                setSelectedHour("");
                                setSelectedMinute("");
                              }}
                            />
                          </div>

                          {/* Hour */}
                          <div className="flex flex-col">
                            <label className="font-medium text-gray-700">
                              Hour:
                            </label>
                            <select
                              className="rounded-md border px-3 py-2"
                              value={selectedHour}
                              onChange={(e) => setSelectedHour(e.target.value)}
                            >
                              <option value="">--Hour--</option>

                              {Array.from({ length: 24 }).map((_, i) => {
                                const hr = i < 10 ? "0" + i : i.toString();

                                // If date is today → disable past hours
                                const disabled =
                                  appointmentDate === todayStr &&
                                  i < currentHour;

                                return (
                                  <option
                                    key={i}
                                    value={hr}
                                    disabled={disabled}
                                  >
                                    {hr}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          {/* Minute */}
                          <div className="flex flex-col">
                            <label className="font-medium text-gray-700">
                              Minute:
                            </label>
                            <select
                              className="rounded-md border px-3 py-2"
                              value={selectedMinute}
                              onChange={(e) =>
                                setSelectedMinute(e.target.value)
                              }
                            >
                              <option value="">--Minute--</option>

                              {Array.from({ length: 60 }).map((_, i) => {
                                const mn = i < 10 ? "0" + i : i.toString();

                                const disabled =
                                  appointmentDate === todayStr &&
                                  selectedHour ===
                                    currentHour.toString().padStart(2, "0") &&
                                  i < currentMinute;

                                return (
                                  <option
                                    key={i}
                                    value={mn}
                                    disabled={disabled}
                                  >
                                    {mn}
                                  </option>
                                );
                              })}
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
                            />
                          </div>

                          {/* Customer Remark */}
                          <div className="flex flex-col">
                            <label className="font-medium text-gray-700">
                              Customer Remark:
                            </label>
                            <textarea className="h-20 rounded-md border px-3 py-2" />
                          </div>
                        </div>

                        {/* Cancel Reason */}
                      </div>

                      {/* Footer */}
                      <div className="mt-8 flex justify-end gap-4">
                        <button className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700">
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

        {/* {user?.roleName === "SF/SSD" && (
          <>
            <h2 className="page-title">👉 Action</h2>

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
            </div>
          </>
        )} */}

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
        {mounted && user?.roleName === "CC" && (
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
        {fromPage === "dashboardcall" &&
          user?.roleName === "ASM" &&
          detail.complainT_STATUS === "Open" &&
          detail.complaint_SubStatus === "Cancellation Request to ASM" && (
            <RemarkSection
              onSubmit={async (remark) => {
                try {
                  const payload = {
                    TICKET_NO: detail.tickeT_NO,
                    remark: remark,
                    type: "open",
                    action: "Approved",
                    uid: user?.userID || 0,
                  };

                  console.log("📦 Sending payload:", payload);

                  const res = await axiosInstance.post(
                    "/Cancellation/request",
                    payload,
                  );
                  console.log("✅ API Success:", res.data);

                  // 🔹 show popup instead of toast
                  setPopupMessage("Call cancellation request Approved ✅");
                  setPopupOpen(true);
                } catch (err) {
                  console.error("❌ API Failed:", err);
                  setPopupMessage("Failed to submit remark ❌");
                  setPopupOpen(true);
                }
              }}
              onCancel={async () => {
                try {
                  const payload = {
                    TICKET_NO: detail.tickeT_NO,
                    remark: "Cancellation rejected by ASM",
                    type: "open",
                    action: "Reject",
                    uid: user?.userID || 0,
                  };

                  console.log("📦 Sending reject payload:", payload);

                  const res = await axiosInstance.post(
                    "/Cancellation/request",
                    payload,
                  );
                  console.log("✅ Rejection Success:", res.data);

                  // 🔹 show popup instead of toast
                  setPopupMessage("Cancellation rejected ❌");
                  setPopupOpen(true);
                } catch (err) {
                  console.error("❌ Reject API Failed:", err);
                  setPopupMessage("Failed to reject request ❌");
                  setPopupOpen(true);
                }
              }}
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
                  <th>Complaint No</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Entered Date</th>
                  <th>Entered By</th>
                </tr>
              </thead>

              <tbody>
                {[...logData].reverse().map((row, index) => (
                  <tr key={index}>
                    <td>{row.ticketNo}</td>
                    <td> {row.complaintStatus}</td>
                    <td>{row.complaintSubStatus || "-"}</td>
                    <td>
                      {row.tdate ? new Date(row.tdate).toLocaleString() : "-"}
                    </td>
                    <td>{row.enteredBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>

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

            <div className="tab-bar m-0 flex gap-0 p-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-button m-0 p-0 ${
                    tab === activeTab ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
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
                      <strong>Complaint Status:</strong>{" "}
                      {detail.complainT_STATUS || "-"}
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
                      <strong>Appointment Date:</strong> {"-"}
                    </div>
                    <div>
                      <strong>Appointment Time:</strong> {"-"}
                    </div>
                    <div>
                      <strong>Promise Date:</strong>{" "}
                      {/* {detail.promisE_DATE
                        ? new Date(detail.promisE_DATE).toLocaleDateString()
                        : "-"} */}
                      {detail.promisE_DATE
                        ? new Date(detail.promisE_DATE).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "-"}
                    </div>
                    <div>
                      <strong>Promise Time:</strong>{" "}
                      {detail.promisE_TIME || "-"}
                    </div>
                    <div>
                      <strong>Legal Case:</strong>{" "}
                      {detail.legal === 1 ? "Yes" : "No"}
                    </div>
                    <div>
                      <strong>Special Instructions:</strong>{" "}
                      {detail.splInt || "-"}
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
                      <strong>Alternate No:</strong>{" "}
                      {detail.wkph || detail.hmph || "-"}
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
                      <strong>Product Category:</strong>{" "}
                      {detail.category || "-"}
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
                      <strong>Model Description:</strong>{" "}
                      {detail.modelDesc || "-"}
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
                              <th className="border border-gray-300 px-3 py-2">
                                Sr. No
                              </th>
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
                                    ? new Date(
                                        item.pC_Date,
                                      ).toLocaleDateString()
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
                  <h3 style={{ fontWeight: "bold" }}>🧪 Visit Details</h3>
                  {visitDetails.length > 0 ? (
                    visitDetails.map((visit, index) => (
                      <div key={index} className="row-content">
                        <div>
                          <strong>VISIT DETAIL:</strong>{" "}
                          {visit.visitDetail || "N/A"}
                        </div>
                        <div>
                          <strong>DATE:</strong>{" "}
                          {visit.vDate
                            ? new Date(visit.vDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                        <div>
                          <strong>Eng Name:</strong> {visit.engName || "N/A"}
                        </div>
                        <div>
                          <strong>IN TIME:</strong> {visit.vInTime || "N/A"}
                        </div>
                        <div>
                          <strong>OUT TIME:</strong> {visit.vOutTime || "N/A"}
                        </div>
                        <div>
                          <strong>STATUS:</strong> {visit.vStatus || "N/A"}
                        </div>
                        <div>
                          <strong>REMARK:</strong> {visit.remark || "N/A"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No visit details found.</p>
                  )}
                </div>
              )}
            </div>

            {user?.roleName === "CC" && (
              <div className="reminder-section">
                <ToastContainer
                  position="top-center"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                />
                <h3 className="page-title">⏰ Add Reminder</h3>
                <form
                  className="reminder-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const storedTicket =
                      sessionStorage.getItem("currentTicket");
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

                      const res = await axiosInstance.get(
                        `/reminder/Ticket/${ticket}`,
                      );
                      const data = Array.isArray(res.data)
                        ? res.data
                        : [res.data];
                      setReminders(data);

                      setReminderReason("");
                      setReminderText("");

                      toast.success("✅ Reminder added successfully!");
                    } catch (err) {
                      console.error("Failed to add reminder:", err);
                      toast.error("❌ Failed to add reminder");
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
