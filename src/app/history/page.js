

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import SideBar from '@/components/SideBar';
import './history.css';
import axiosInstance from '@/api/axiosInstance';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomDropdown from '@/components/common/Dropdown';
import RemarkSection from '@/components/history/RemarkSection';
import AllotmentDetails from '@/components/history/AllotmentDetails';

const tabs = [
  'Job Details',
  'Customer Detail',
  'Product Details', 
  'Pending Level History',
  'Document Uploaded',
  'Job Done',
  'Part Consumption',
  'Visit Detail'
];


const StatusBadge = ({ status }) => (
  <span className={`badge ${status?.toLowerCase()}`}>{status}</span>
);

export default function HistoryPage() {
    const [pendingHistory, setPendingHistory] = useState([]);
  const { ticketNo } = useParams();
  const [activeTab, setActiveTab] = useState('Job Details');
  const [logData, setLogData] = useState([]);
  const [custDetail, setCustDetail] = useState(null); // ✅ new
  const [loading, setLoading] = useState(true);
  const [partConsumption, setPartConsumption] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [visitDetails, setVisitDetails] = useState([]);
  const [reminderReason, setReminderReason] = useState('');
const [reminderText, setReminderText] = useState('');
const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);

  const searchParams = useSearchParams();
const fromPage = searchParams.get("fromPage");


  
  

  const reminderOptions = [
    { value: "call", label: "📞 Not Attended" },
    { value: "email", label: "⏳ Part Pending" },
    { value: "meeting", label: "🤷 Other" },
  ];

  const { user } = useSelector((state) => state.auth); // ✅ logged-in user from Redux

  const loggedInUser = user?.userName || 'Unknown';





// this is for re-allott 


  useEffect(() => {
    if (custDetail) {
      setFormData({
        ascName: custDetail.asC_NAME || "",
        engineer: custDetail.engineeR_NAME || "",
        reAllot: custDetail.reAllot || false,
        appointmentDate: custDetail.appointmentDate
          ? custDetail.appointmentDate.split("T")[0]
          : "",
        appointmentHour: custDetail.appointmentTime
          ? new Date(custDetail.appointmentTime).getHours().toString()
          : "",
        appointmentMinute: custDetail.appointmentTime
          ? new Date(custDetail.appointmentTime).getMinutes().toString()
          : "",
        promiseDate: custDetail.promisE_DATE
          ? new Date(custDetail.promisE_DATE).toISOString().split("T")[0]
          : "",
        asmRemark: custDetail.asmRemark || "",
        customerRemark: custDetail.customerRemark || "",
      });
    }
  }, [custDetail]);


  
  const [formData, setFormData] = useState({
    ascName: "",
    engineer: "",
    reAllot: false,
    appointmentDate: "",
    appointmentHour: "",
    appointmentMinute: "",
    promiseDate: "",
    asmRemark: "",
    customerRemark: "",
  });
  
  

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApprove = () => {
    console.log("Approved with:", formData);
  };

  const handleReject = () => {
    console.log("Rejected");
  };

// end for realott



  useEffect(() => {
    const storedTicket = sessionStorage.getItem('currentTicket');
    if (storedTicket) {
      // fetch data with storedTicket
      axiosInstance
        .get(`ComplaintHistory/history-by-ticket/${storedTicket}`)
        .then(res => setLogData(Array.isArray(res.data) ? res.data : [res.data]))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
  
      axiosInstance
        .get(`ComplaintCustDetail/${storedTicket}`)
        .then(res => setCustDetail(res.data))
        .catch(err => console.error(err));
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
        .catch((err) => console.error('Failed to fetch history:', err))
        .finally(() => setLoading(false));
    }
  }, [ticketNo]);

  useEffect(() => {
    if (ticketNo) {
      axiosInstance
        .get(`PartConsumption/ByTicket/${ticketNo}`)
        .then(res => setPartConsumption(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.error('Failed to fetch part consumption:', err));
    }
  }, [ticketNo]);

  // Fetch customer + complaint detail
  useEffect(() => {
    const storedTicket = sessionStorage.getItem('currentTicket');
    const fetchTicket = ticketNo || storedTicket; // fallback
    if (fetchTicket) {
      console.log("Fetching PartConsumption for ticket:", fetchTicket);
      axiosInstance
        .get(`PartConsumption/ByTicket/${fetchTicket}`)
        .then(res => setPartConsumption(Array.isArray(res.data) ? res.data : [res.data]))
        .catch(err => console.error('Failed to fetch part consumption:', err));
    }
  }, [ticketNo]);


  
useEffect(() => {
    const storedTicket = sessionStorage.getItem('currentTicket');
    const fetchTicket = ticketNo || storedTicket; // fallback
    if (fetchTicket) {
      axiosInstance
        .get(`DocumentUpload/ticket/${fetchTicket}`)
        .then(res => setDocuments(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.error('Failed to fetch documents:', err));
    }
  }, [ticketNo]);


  useEffect(() => {
    const storedTicket = sessionStorage.getItem('currentTicket');
    const fetchTicket = ticketNo || storedTicket;
  
    if (fetchTicket) {
      axiosInstance
        .get(`LevelPendingHistory/ticket/${fetchTicket}`)
        .then(res => setPendingHistory(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.error("Failed to fetch Pending Level History:", err));
    }
  }, [ticketNo]);

  useEffect(() => {
    const storedTicket = sessionStorage.getItem('currentTicket');
    const fetchTicket = ticketNo || storedTicket;
  
    if (fetchTicket) {
      axiosInstance
        .get(`visit/ticket/${fetchTicket}`)
        .then(res => setVisitDetails(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.error("Failed to fetch visit details:", err));
    }
  }, [ticketNo]);

  useEffect(() => {
    const storedTicket = sessionStorage.getItem('currentTicket');
    const fetchTicket = ticketNo || storedTicket;

    if (fetchTicket) {
      axiosInstance
        .get(`reminder/Ticket/${fetchTicket}`)
        .then(res => {
          // ✅ Handle single object OR array
          const data = Array.isArray(res.data) ? res.data : [res.data];
          setReminders(data);
        })
        .catch(err => console.error("Failed to fetch reminders:", err))
        .finally(() => setLoadingReminders(false));
    }
  }, [ticketNo]);


  const firstEntry = logData[0] || {};
  const detail = custDetail || {}; // ✅ for tabs

  return (
    
    <div className="page-wrapper">

<SideBar />
     
      <div className="content-area">
      {fromPage === "dashboardcall" && user?.roleName === "ASM" && detail.complainT_STATUS === "Open" && detail.complaint_SubStatus === "Request for re-allot" && (
      <AllotmentDetails
  formData={formData}
  onChange={handleChange}
  onApprove={handleApprove}
  onReject={handleReject}
/>
      )}
        
        <h2 className="page-title">📋 Complaint History</h2>


        {/* {user?.roleName === "ASM" && (
  <RemarkSection
    onSubmit={(remark) => {
      console.log("Submitted remark:", remark);
      // 👉 here you can call axiosInstance.post('/api/remark', { remark, ticketNo }) if needed
    }}
    onCancel={() => console.log("Remark canceled")}
  />
)} */}


{fromPage === "dashboardcall" && user?.roleName === "ASM" && detail.complainT_STATUS === "Open" && detail.complaint_SubStatus === "Cancellation Request to ASM" && (
  <RemarkSection
    onSubmit={(remark) => {
      console.log("Submitted remark:", remark);
      // 👉 Example: call API with remark + ticketNo
      // axiosInstance.post('/api/remark', { remark, ticketNo })
    }}
    onCancel={() => console.log("Remark canceled")}
  />
)}


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
              {/* <tbody>
                {logData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.ticketNo}</td>
                   
                    <td><StatusBadge status={row.complaintStatus} /></td>
                    <td>{row.complaintSubStatus || '-'}</td>
                    <td>{row.tdate ? new Date(row.tdate).toLocaleString() : '-'}</td>
                    <td>{row.enteredBy}</td>
                  </tr>
                ))}
              </tbody> */}


<tbody>
  {[...logData].reverse().map((row, index) => (
    <tr key={index}>
      <td>{row.ticketNo}</td>
      <td> {row.complaintStatus}</td>
      <td>{row.complaintSubStatus || '-'}</td>
      <td>{row.tdate ? new Date(row.tdate).toLocaleString() : '-'}</td>
      <td>{row.enteredBy}</td>
    </tr>
  ))}
</tbody>
            </table>

            {/* Tabs */}
            <div className="tab-bar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${tab === activeTab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'Job Details' && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>📌 Job Details</h3>
                  <div className="row-content">
                    <div><strong>Ticket No:</strong> {detail.tickeT_NO || '-'}</div>
                    <div><strong>Complaint SubStatus:</strong> {detail.complaint_SubStatus || '-'}</div>
                    <div><strong>Complaint Status:</strong> {detail.complainT_STATUS || '-'}</div>
                    <div><strong>Remarks:</strong> {detail.remarks || '-'}</div>
                    <div><strong>Call By:</strong> {detail.calL_BY || '-'}</div>
                    <div><strong>Complaint Date:</strong> {detail.tdate ? new Date(detail.tdate).toLocaleString() : '-'}</div>
                    <div><strong>Call Type:</strong> {detail.calL_TYPE || '-'}</div>
                    <div><strong>Entered By:</strong> {detail.enterby || '-'}</div>
                          <div><strong>Escalated to HO:</strong> {firstEntry.escalated === 1 ? 'Yes' : 'No'}</div>
                          <div><strong>NSP:</strong> {detail.asC_NAME || '-'}</div>
                    <div><strong>SF Name:</strong> {detail.asC_NAME || '-'}</div>
                    <div><strong>SF Code:</strong> {detail.asC_CODE || '-'}</div>
                    <div><strong>SF Mobile No.:</strong> {detail.mobile || '-'}</div>
                    <div><strong>Appointment Date:</strong> {'-'}</div>
                    <div><strong>Appointment Time:</strong> {'-'}</div>
                    <div><strong>Promise Date:</strong> {detail.promisE_DATE ? new Date(detail.promisE_DATE).toLocaleDateString() : '-'}</div>
                    <div><strong>Promise Time:</strong> {detail.promisE_TIME || '-'}</div>
                    <div><strong>Legal Case:</strong> {detail.legal === 1 ? 'Yes' : 'No'}</div>
                    <div><strong>Special Instructions:</strong> {detail.splInt || '-'}</div>
                  </div>
                </div>
              )}

              {activeTab === 'Customer Detail' && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>👤 Customer Detail</h3>
                  <div className="row-content">
                    <div><strong>Salutation:</strong> {detail.salutation || '-'}</div>
                    <div><strong>Name:</strong> {`${detail.firstname || ''} ${detail.middlename || ''} ${detail.lastname || ''}`}</div>
                    <div><strong>Mobile No:</strong> {detail.mobile || '-'}</div>
                    <div><strong>Alternate No:</strong> {detail.wkph || detail.hmph || '-'}</div>
                    <div><strong>Email:</strong> {detail.email || '-'}</div>
                    <div><strong>Address:</strong> {`${detail.addresS1 || ''} ${detail.addresS2 || ''} ${detail.addresS3 || ''}`}</div>
                    <div><strong>Landmark:</strong> {detail.landmark || '-'}</div>
                    <div><strong>Locality:</strong> {detail.locality || '-'}</div>
                    <div><strong>City:</strong> {detail.city || '-'}</div>
                    <div><strong>Pincode:</strong> {detail.pincode || '-'}</div>
                    <div><strong>State:</strong> {detail.state || '-'}</div>

                    
                  </div>
                </div>
              )}

              {activeTab === 'Product Details' && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold"}}>📦 Product Details</h3>
                  <div className="row-content">
                    <div><strong>Model:</strong> {detail.model || '-'}</div>
                    <div><strong>Product Category:</strong> {detail.category || '-'}</div>
                    <div><strong>Serial No.:</strong> {detail.seriaL_NO || '-'}</div>
                    <div><strong>Purchase Date:</strong> {detail.purchasE_DATE ? new Date(detail.purchasE_DATE).toLocaleDateString() : '-'}</div>
                    <div><strong>Warranty:</strong> {detail.warranty || '-'}</div>
                    <div><strong>BOM Type:</strong> {detail.bomType || '-'}</div>
                    <div><strong>Model Description:</strong> {detail.modelDesc || '-'}</div>
                  </div>
                </div>
              )}

              
                {activeTab === 'Pending Level History' && (
  <div className="tab-section">
    <h3 style={{ fontWeight: "bold" }}>🛠️ Pending Level History</h3>

    {pendingHistory.length === 0 ? (
      <p>No pending history found.</p>
    ) : (
      pendingHistory.map((item, index) => (
        <div className="row-content" key={item.id}>
          <div><strong>Sr. No:</strong> {index + 1}</div>
          <div><strong>Ticket No:</strong> {item.ticket_No || '-'}</div>
          <div><strong>Ticket Key:</strong> {item.ticket_Key || '-'}</div>
          <div><strong>Pending At:</strong> {item.pendingAt || '-'}</div>
          
        </div>
      ))
    )}
  </div>
)}
{/* 

{activeTab === 'Document Uploaded' && (
  <div className="tab-section2">
    <h3 style={{ fontWeight: "bold" }}>📂 Document Uploaded</h3>

    {documents.length === 0 ? (
      <p>No documents found.</p>
    ) : (
      documents.map((doc, index) => (
        <div className="row-content2" key={index}>
          <div><strong>Sr. No.:</strong> {index + 1}</div>
          <div><strong>Document Type:</strong> {doc.documentType || '-'}</div>
          <div><strong>Entered Date:</strong> {doc.enteredDate || '-'}</div>
          <div>
  <strong>Action:</strong>{' '}
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
    '-'
  )}
</div>
        </div>
      ))
    )}
  </div>
)} */}


{activeTab === 'Document Uploaded' && (
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
              <td>{doc.documentType || '-'}</td>
              <td>{doc.enteredDate || '-'}</td>
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
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}

                 {activeTab === 'Document Uploaded from Android Application' && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>🧪 Test Info</h3>
                  <div className="row-content">
                    <div><strong>Info:</strong> Test content (example)</div>
                  </div>
                </div>
              )}
                 {activeTab === 'Job Done' && (
                <div className="tab-section">
                  <h3 style={{ fontWeight: "bold" }}>🧪 Job Done</h3>
                  <div className="row-content">
                    <div><strong>Sr. No.:</strong> {detail.seriaL_NO || '-'}</div>
                    
                    <div><strong>Level.:</strong> Test content (example)</div>
                    
                    <div><strong>Entered Date.:</strong> Test content (example)</div>
                    
                    <div><strong>Entered Time.:</strong> Test content (example)</div>
                    
                    <div><strong>Entered By.:</strong> Test content (example)</div>

                  </div>
                </div>
              )}
               {activeTab === 'Part Consumption' && (
  <div className="tab-section">
    <h3 style={{ fontWeight: "bold" }}>📦 Part Consumption</h3>
    {partConsumption.length === 0 ? (
      <p>No part consumption found.</p>
    ) : (
      partConsumption.map((item, index) => (
        <div className="row-content" key={item.pC_ID || index}>
          <div><strong>Sr. No:</strong> {item.pC_Srno || '-'}</div>
          <div><strong>Part Code:</strong> {item.pC_PartCode || '-'}</div>
          <div><strong>Description:</strong> {item.pC_PartDesc || '-'}</div>
          <div><strong>Date:</strong> {item.pC_Date ? new Date(item.pC_Date).toLocaleDateString() : '-'}</div>
          <div><strong>Rate:</strong> {item.pC_Rate ?? '-'}</div>
          <div><strong>Quantity:</strong> {item.pC_Quantity ?? '-'}</div>
          <div><strong>Amount:</strong> {item.pC_Amount ?? '-'}</div>
          <div><strong>Fresh Faulty:</strong> {item.isFreshFaulty ? 'Yes' : 'No'}</div>
        </div>
      ))
    )}
  </div>
)}
              {activeTab === 'Visit Detail' && (
  <div className="tab-section">
    <h3 style={{ fontWeight: "bold" }}>🧪 Visit Details</h3>
    {visitDetails.length > 0 ? (
      visitDetails.map((visit, index) => (
        <div key={index} className="row-content">
          <div><strong>VISIT DETAIL:</strong> {visit.visitDetail || "N/A"}</div>
          <div><strong>DATE:</strong> {visit.vDate ? new Date(visit.vDate).toLocaleDateString() : "N/A"}</div>
          <div><strong>Eng Name:</strong> {visit.engName || "N/A"}</div>
          <div><strong>IN TIME:</strong> {visit.vInTime || "N/A"}</div>
          <div><strong>OUT TIME:</strong> {visit.vOutTime || "N/A"}</div>
          <div><strong>STATUS:</strong> {visit.vStatus || "N/A"}</div>
          <div><strong>REMARK:</strong> {visit.remark || "N/A"}</div>
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
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    />
    <h3 className="page-title">⏰ Add Reminder</h3>
    <form
      className="reminder-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const storedTicket = sessionStorage.getItem('currentTicket');
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
          await axiosInstance.post('/reminder/create', payload);

          const res = await axiosInstance.get(`/reminder/Ticket/${ticket}`);
          const data = Array.isArray(res.data) ? res.data : [res.data];
          setReminders(data);

          setReminderReason('');
          setReminderText('');

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
