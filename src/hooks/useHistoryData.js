import axios from "axios";
import { useState, useEffect, useCallback } from "react";

import axiosInstance from "@/api/axiosInstance";
import { logger } from "@/utils/logger";

export function useHistoryData(activeTicket, user, roleName) {
  const [logData, setLogData] = useState([]);
  const [custDetail, setCustDetail] = useState(null);
  // Initialize lazy-loaded data as null to distinguish "not fetched" vs "empty"
  const [partConsumption, setPartConsumption] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [pendingHistory, setPendingHistory] = useState(null);
  const [reminders, setReminders] = useState(null);
  const [visitDetails, setVisitDetails] = useState(null);
  const [SCAData, setSCAData] = useState(null);

  const [actions, setActions] = useState([]);
  const [allowanceLocationDetails, setAllowanceLocationDetails] = useState([]);
  const [ticketKey, setTicketKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [loadingTabs, setLoadingTabs] = useState({
    documents: false,
    consumption: false,
    pending: false,
    visit: false,
  });

  // Fetch Actions Helpers
  const fetchActionsInternal = async (complaintDetail, currentRoleName) => {
    if (currentRoleName !== "SF/SSD") {
      return;
    }
    try {
      const payload = {
        type: "jobactions",
        role: currentRoleName || "Unknown",
        complaint_SubStatus: complaintDetail.complaint_SubStatus || "",
        complaint_Status: complaintDetail.complainT_STATUS || "",
        calltype: complaintDetail.calL_TYPE || "",
        product: complaintDetail.product || "",
      };

      const res = await axiosInstance.post("ActionMaster/get-actions", payload);
      const data = res.data.data || [];

      if (Array.isArray(data) && data.length > 0) {
        const actionsString = data[0].actions.map((a) => a.action) || "";
        setActions(actionsString);
      } else {
        setActions([]);
      }
    } catch (error) {
      console.error("Failed to fetch actions:", error);
    }
  };

  // Initial Fetch: Just Context + History + Customer Detail
  useEffect(() => {
    if (!activeTicket) return;

    setLoading(true);

    const fetchCoreTicketData = async () => {
      try {
        const results = await Promise.allSettled([
          axiosInstance.get(`ComplaintHistory/history-by-ticket/${activeTicket}`), // 0
          axiosInstance.get(`ComplaintCustDetail/${activeTicket}`), // 1
        ]);

        const unwrap = (res, defaultVal = []) =>
          res.status === "fulfilled" ? res.value.data : defaultVal;

        // 0. History
        const historyData = unwrap(results[0]);
        const dataArray = Array.isArray(historyData) ? historyData : [historyData];

        // Create a copy and then reverse it
        setLogData([...dataArray].reverse());

        // 1. Customer Detail
        const custData = unwrap(results[1], null);
        const { asC_Pincode, pincode, distance } = custData || {};
        setAllowanceLocationDetails({
          asC_Pincode,
          pincode,
          distance,
        });
        setCustDetail(custData);
        setTicketKey((prev) => custData?.tickeT_KEY || prev);

        // Dependent Logic: Fetch Actions
        if (custData && roleName === "SF/SSD") {
          fetchActionsInternal(custData, roleName);
        }
      } catch (err) {
        console.error("Critical error during batch fetch:", err);
        logger.error(`Batch fetch error: ${err.message}`, "loading data on history page");
      } finally {
        setLoading(false);
      }
    };

    fetchCoreTicketData();
  }, [activeTicket, roleName]);

  const refreshHistory = async () => {
    try {
      const res = await axiosInstance.get(
        `ComplaintHistory/history-by-ticket/${activeTicket}`
      );
      const data = res.data;
      setLogData(Array.isArray(data) ? data : [data]);

      const custRes = await axiosInstance.get(`ComplaintCustDetail/${activeTicket}`);
      setCustDetail(custRes.data);
    } catch (err) {
      console.error("Failed to refresh history:", err);
    }
  };

  // --- Lazy Loaders ---

  const fetchDocuments = useCallback(async () => {
    if (documents !== null) return; // Already loaded

    setLoadingTabs((prev) => ({ ...prev, documents: true }));
    try {
      const payload = {
        Ticket_no: activeTicket,
        UserName: process.env.NEXT_PUBLIC_DOC_USERNAME,
        Password: process.env.NEXT_PUBLIC_DOC_PASSWORD,
        AccessCode: process.env.NEXT_PUBLIC_DOC_ACCESSCODE,
        AcessUser: user.userName,
      };
      const DOC_BASE_URL = process.env.NEXT_PUBLIC_DOC_BASE_URL;
      const res = await axios.post(
        `${DOC_BASE_URL}/DocumentUpload/get-documents`,
        payload
      );
      const data = res.data?.documents;
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, documents: false }));
    }
  }, [activeTicket, documents]);

  const fetchConsumption = useCallback(async () => {
    if (partConsumption !== null) return;

    setLoadingTabs((prev) => ({ ...prev, consumption: true }));
    try {
      const res = await axiosInstance.get(`PartConsumption/ByTicket/${activeTicket}`);
      const data = res.data;
      setPartConsumption(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Failed to fetch consumption:", err);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, consumption: false }));
    }
  }, [activeTicket, partConsumption]);

  const fetchPendingHistory = useCallback(async () => {
    if (pendingHistory !== null) return;

    setLoadingTabs((prev) => ({ ...prev, pending: true }));
    try {
      const res = await axiosInstance.get(`LevelPendingHistory/ticket/${activeTicket}`);
      const data = res.data;
      setPendingHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch pending history:", err);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, pending: false }));
    }
  }, [activeTicket, pendingHistory]);

  const fetchVisitDetails = useCallback(async () => {
    if (visitDetails !== null) return;
    if (!ticketKey) return; // Need ticketKey first

    setLoadingTabs((prev) => ({ ...prev, visit: true }));
    try {
      const res = await axiosInstance.get(`visit/ticket/${ticketKey}`);
      const data = res.data;
      setVisitDetails(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch visit data:", err);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, visit: false }));
    }
  }, [ticketKey, visitDetails]);

  const fetchSCADetails = useCallback(async () => {
    if (!activeTicket) return;

    setLoadingTabs((prev) => ({ ...prev, sca: true }));
    try {
      const res = await axiosInstance.post(`symptom-cause/process`, {
        type: "GetSCATicketNoTBL",
        ticket_no: activeTicket,
      });
      const data = res.data.data;
      setSCAData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch visit data:", err);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, sca: false }));
    }
  }, [activeTicket]);

  return {
    logData,
    custDetail,
    // Lazy Data
    partConsumption,
    documents,
    pendingHistory,
    reminders,
    visitDetails,
    SCAData,
    // Actions & Metadata
    actions,
    allowanceLocationDetails,
    ticketKey,
    // Loaders
    loading,
    loadingReminders,
    loadingTabs,
    // Methods
    refreshHistory,
    setLogData,
    setCustDetail,
    // Fetch Triggers
    fetchDocuments,
    fetchConsumption,
    fetchPendingHistory,
    fetchVisitDetails,
    fetchSCADetails,
  };
}
