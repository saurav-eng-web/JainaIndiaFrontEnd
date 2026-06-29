"use client";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import SectionHeading from "@/components/common/SectionHeading";
import Table from "@/components/common/Table";
import CustomerDetailTab from "@/components/history/tabs/CustomerDetailTab";
import JobDetailsTab from "@/components/history/tabs/JobDetailsTab";
import ProductDetailsTab from "@/components/history/tabs/ProductDetailsTab";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/customui/button";
import Dropdown from "@/components/customui/Dropdown";
import InputWithLabel from "@/components/customui/InputWithLabel";
import PageSkeleton from "@/components/customui/PageSkeleton";
import { useHistoryData } from "@/hooks/useHistoryData";
import "./../../history/history.css";
import { useTheme } from "@/theme/ThemeContext";
import Subheading from "@/components/customui/Subheading";

export default function Page() {
  const { colors } = useTheme();
  const [ticketNo, setTicketNo] = useState(null);
  const [subStatus, setSubStatus] = useState(null);

  const router = useRouter();

  const [dropdownData, setDropdownData] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [otherClaimDetails, setOtherClaimDetails] = useState([]);

  const [remarks, setRemarks] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const {
    logData,
    custDetail,
    partConsumption,
    documents,
    pendingHistory,
    // reminders,
    // actions,
    // allowanceLocationDetails,
    // ticketKey, // from hook
    // refreshHistory,
    loading,
    loadingTabs,
    // Fetch Triggers
    fetchDocuments,
    fetchConsumption,
    fetchPendingHistory,
    fetchVisitDetails,
    visitDetails,
    fetchSCADetails,
    SCAData,
  } = useHistoryData(ticketNo, user, user?.roleName);

  const [activeTab, setActiveTab] = useState("Job Details");

  const detail = custDetail || {};
  const firstEntry = logData[0] || {};

  const tabs = [
    "Job Details",
    "Customer Detail",
    "Product Details",
    // "Pending Level",
    "Documents",
    "S.C.A.",
    "Consumption",
    "Visit Detail",
  ];

  const INITALPAGESIZE = 25;
  const [pageSize, setPageSize] = useState(INITALPAGESIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = logData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleRows = logData.slice(startIndex, endIndex);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTicketNo(sessionStorage.getItem("currentTicket"));
      setSubStatus(sessionStorage.getItem("subStatus"));
    }
  }, []);

  useEffect(() => {
    if (ticketNo === null) return; // wait for initialization

    if (!ticketNo) {
      router.push("/fin/search");
    }
  }, [ticketNo, router]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const res = await axiosInstance.post("claim-process-v1/process", {
          type: "ClaimDD",
        });
        console.log("res: ", res);
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          const ddData = res.data.data[0].JSON_Data;
          console.log("ddData: ", ddData);
          const parsedData = await JSON.parse(ddData);
          setDropdownData(parsedData);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    const fetchClaimDetails = async () => {
      try {
        const res = await axiosInstance.post("claim-process-v1/process", {
          type: "ClaimDetail",
          ticket_no: ticketNo,
        });
        console.log("res: ", res);
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          setClaimData(res.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    const fetchOtherClaimDetails = async () => {
      try {
        const res = await axiosInstance.post("claim-process-v1/process", {
          type: "ClaimDetailserialNo",
          ticket_no: ticketNo,
        });
        console.log("res: ", res);
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          setOtherClaimDetails(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
    fetchClaimDetails();
    fetchOtherClaimDetails();
  }, [ticketNo]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    switch (tab) {
      case "Documents":
        fetchDocuments();
        break;
      case "Consumption":
        fetchConsumption();
        break;
      case "Pending Level":
        fetchPendingHistory();
        break;
      case "S.C.A.":
        fetchSCADetails();
        break;
      case "Visit Detail":
        fetchVisitDetails();
        break;
      default:
        break;
    }
  };

  const typeOptions = dropdownData.map((item) => ({
    label: item.Type,
    value: item.Type,
  }));

  const reasonOptions =
    dropdownData
      .find((item) => item.Type === selectedType?.value)
      ?.Reasons?.map((reason) => ({
        label: reason.Holdreject_reason,
        value: reason.Holdreject_reason,
      })) || [];

  const hasReasonOptions = reasonOptions.length > 0;

  async function handleSubmit() {
    if (!selectedType || !selectedReason) {
      toast.error("Please select a type and reason");
      return;
    }

    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }

    try {
      const res = await axiosInstance.post("claim-process-v1/process", {
        type: "ClaimDetailAction",
        ticket_no: ticketNo,
        task: selectedType.value,
        dropdownaction: selectedReason.value,
        remarks: remarks,
        substatus: subStatus,
      });

      console.log("res: ", res);

      if (res.data.statusCode === 200 && res.data?.data.length > 0) {
        toast.success("Request submitted successfully");
        router.back();
      }
    } catch (error) {
      toast.error("Unable to submit the request, please try again");
    }
  }

  const claimFields = [
    { label: "Complaint No.", key: "Complaint No." },
    { label: "Serial No.", key: "Serial No." },
    { label: "Model", key: "Model" },
    { label: "Call Type", key: "Call Type" },
    { label: "Warranty", key: "Warranty" },
    { label: "DOP", key: "DOP" },
    { label: "Call OK Date", key: "Call OK Date" },
    { label: "Claim Substatus", key: "Claim Substatus" },
    { label: "Reason", key: "Reason" },
    { label: "Remarks", key: "Remarks" },
  ];

  const columnConfig = [
    {
      label: "S. No",
      key: "",
      size: "sm",
      render: (row, _, index) => index + 1,
    },
    {
      label: "Ticket No",
      key: "TICKET_NO",
      size: "lg",
    },
    {
      label: "Customer Name",
      key: "Custname",
      size: "xl",
    },
    {
      label: "Purchase Date",
      key: "PURCHASE_DATE",
      size: "sm",
      render: (val) => (val ? val.split("T")[0] : "-"),
    },
    {
      label: "Complaint Status",
      key: "COMPLAINT_STATUS",
      size: "sm",
    },
    {
      label: "Sub Status",
      key: "Complaint_SubStatus",
      size: "md",
    },
    {
      label: "Login Date",
      key: "TDATE",
      size: "md",
      render: (val) => (val ? val.split("T")[0] : "-"),
    },
    {
      label: "OK Date",
      key: "OKDate",
      size: "sm",
      render: (val) => (val ? val.split("T")[0] : "-"),
    },
  ];

  return (
    <PageSkeleton title={"History"}>
      <div className="mt-8 rounded-md border border-slate-300 bg-white p-4 shadow">
        <Subheading title={"Resolution Action"} variant="thin" marginTop={0} />

        <div className="mt-8 grid grid-cols-3 gap-4">
          <Dropdown
            label="Type"
            value={selectedType}
            onChange={(opt) => {
              setSelectedType(opt);
              setSelectedReason(null);
            }}
            options={typeOptions}
            placeholder="Select Type"
          />
          {hasReasonOptions && (
            <Dropdown
              label="Reason"
              value={selectedReason}
              onChange={setSelectedReason}
              options={reasonOptions}
              placeholder="Select Reason"
            />
          )}
          <InputWithLabel
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={() => router.back()} variant="outline" className="mt-8">
            Back
          </Button>
          <Button className="mt-8" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <Subheading title={"Claim Details"} />

        <div className="grid grid-cols-4 gap-4">
          {claimFields.map((field) => (
            <InputWithLabel
              key={field.key}
              label={field.label}
              value={claimData?.[field.key] || "-"}
              disabled
              size="md"
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Subheading title={"Other jobs on the same serial number"} />
        <Table columns={columnConfig} rows={otherClaimDetails} />
      </div>

      <Subheading title={"Complaint History"} />

      {loading ? (
        <div className="loading">Loading history...</div>
      ) : logData.length === 0 ? (
        <p className="empty">No data found.</p>
      ) : (
        <>
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
              {[...visibleRows].map((row, index) => (
                // {[...visibleRows].reverse().map((row, index) => (
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

          {/* Tab Navigation */}
          <div className="tab-bar m-0 mt-6 flex gap-0 p-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-button m-0 p-0 ${tab === activeTab ? "active" : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "Job Details" && (
              <JobDetailsTab detail={detail} firstEntry={firstEntry} />
            )}
            {activeTab === "Customer Detail" && <CustomerDetailTab detail={detail} />}
            {activeTab === "Product Details" && <ProductDetailsTab detail={detail} />}
            {activeTab === "Pending Level" && (
              <div className="tab-section">
                <h3 style={{ fontWeight: "bold" }}>🛠️ Pending Level</h3>
                {loadingTabs.pending ? (
                  <p>Loading...</p>
                ) : !pendingHistory || pendingHistory.length === 0 ? (
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
                {loadingTabs.documents ? (
                  <p>Loading...</p>
                ) : !documents || documents.length === 0 ? (
                  <p>No documents found.</p>
                ) : (
                  <table className="complaint-table">
                    <thead>
                      <tr>
                        <th>Sr No</th>
                        <th>Doc Type</th>
                        <th>Entered Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{doc.documentType}</td>
                          <td>{doc.enteredDate}</td>
                          <td>
                            <button
                              onClick={() => window.open(doc.documentURL, "_blank")}
                              className="doc-view-btn"
                            >
                              <Eye size={16} />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {activeTab === "S.C.A." && (
              <div className="tab-section2">
                <h3 style={{ fontWeight: "bold" }}>🛠️ Symptom Cause Analysis</h3>
                {loadingTabs.sca ? (
                  <p>Loading...</p>
                ) : !SCAData || SCAData.length === 0 ? (
                  <p>No SCA data available.</p>
                ) : (
                  // Logic for consumption table if exists, else text
                  <Table
                    columns={[
                      {
                        label: "S. No",
                        key: "id",
                        size: "xs",
                        render: (_v, _row, index) => index + 1,
                      },

                      { label: "Symptom", key: "Jd_Symptom", size: "sm" },
                      { label: "Cause", key: "JD_Cause", size: "md" },
                      { label: "Analysis", key: "JD_Analysis", size: "md" },
                      { label: "Job done", key: "JD_Workdone", size: "sm" },
                      { label: "Remarks by Eng.", key: "remarks", size: "sm" },
                      {
                        label: "Date",
                        key: "Tdate",
                        size: "xs",
                        render: (val) => {
                          if (!val) return "-";
                          const d = new Date(val);
                          const day = String(d.getDate()).padStart(2, "0");
                          const month = String(d.getMonth() + 1).padStart(2, "0");
                          const year = d.getFullYear();
                          return `${day}-${month}-${year}`;
                        },
                      },
                    ]}
                    rows={SCAData}
                  />
                )}
              </div>
            )}
            {activeTab === "Consumption" && (
              <div className="tab-section2">
                <h3 style={{ fontWeight: "bold" }}>🧩 Consumption</h3>
                {loadingTabs.consumption ? (
                  <p>Loading...</p>
                ) : !partConsumption || partConsumption.length === 0 ? (
                  <p>No consumption data available.</p>
                ) : (
                  // Logic for consumption table if exists, else text
                  <Table
                    columns={[
                      { label: "Sr. No", key: "pC_ID", size: "xs" },
                      { label: "Part Code", key: "pC_PartCode", size: "md" },
                      { label: "Description", key: "pC_PartDesc", size: "lg" },
                      {
                        label: "Date",
                        key: "pC_Date",
                        size: "sm",
                        render: (val) => {
                          if (!val) return "-";
                          const d = new Date(val);
                          const day = String(d.getDate()).padStart(2, "0");
                          const month = String(d.getMonth() + 1).padStart(2, "0");
                          const year = d.getFullYear();
                          return `${day}-${month}-${year}`;
                        },
                      },
                      { label: "Rate", key: "pC_Rate", size: "sm" },
                      { label: "Quantity", key: "pC_Quantity", size: "xs" },
                      { label: "Amount", key: "pC_Amount", size: "sm" },
                      {
                        label: "Fresh Faulty",
                        key: "isFreshFaulty",
                        size: "sm",
                        render: (val) => (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              val
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {val ? "Yes" : "No"}
                          </span>
                        ),
                      },

                      // {
                      //   label: "Fresh Faulty",
                      //   key: "isFreshFaulty",
                      //   size: "sm",
                      //   render: (val) => (val ? "Yes" : "No"),
                      // },
                    ]}
                    rows={partConsumption}
                  />
                )}
              </div>
            )}
            {activeTab === "Visit Detail" && (
              <div className="tab-section2">
                <h3 style={{ fontWeight: "bold" }}>📍 Visit Detail</h3>
                {loadingTabs.visit ? (
                  <p>Loading...</p>
                ) : !visitDetails || visitDetails.length === 0 ? (
                  <p>No visit details available.</p>
                ) : (
                  <table className="complaint-table">
                    <thead>
                      <tr>
                        <th>Visit Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Remarks</th>
                        <th>Engineer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitDetails.map((visit, index) => (
                        <tr key={index}>
                          <td>{visit.vDate.split("T")[0] || "-"}</td>
                          <td>{visit.vInTime || "-"}</td>
                          <td>{visit.vOutTime || "-"}</td>
                          <td>{visit.remark || "-"}</td>
                          <td>{visit.engName || "-"}</td>
                          {/* <td>
                                    {visit.startLat && visit.startLong ? (
                                      <a
                                        href={`https://www.google.com/maps?q=${visit.startLat},${visit.startLong}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                      >
                                        View Map
                                      </a>
                                    ) : (
                                      "-"
                                    )}
                                  </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </PageSkeleton>
  );
}

// two dropdow
// remarks
