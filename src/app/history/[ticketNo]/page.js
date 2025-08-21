

// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import SideBar from '@/components/SideBar';
// import axios from 'axios';
// import './history.css';
// import axiosInstance from '@/api/axiosInstance';
// const tabs = ['Job Details', 'Customer Detail','Product Details', 'Complaint Detail','Pending Level History', 'Document Uploaded', 'Job Done', 'Part Consumption'];

// const StatusBadge = ({ status }) => (
//   <span className={`badge ${status?.toLowerCase()}`}>{status}</span>
// );

// export default function HistoryPage() { 
//   const { ticketNo } = useParams();
//   const [activeTab, setActiveTab] = useState('Job Details');
//   const [logData, setLogData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (ticketNo) {
//       axiosInstance
//       .get(`ComplaintHistory/history-by-ticket/${ticketNo}`)
//         .then((res) => {
//           const data = Array.isArray(res.data) ? res.data : [res.data];
//           setLogData(data);
//         })
//         .catch((err) => {
//           console.error('Failed to fetch history:', err);
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [ticketNo]);

//   const firstEntry = logData[0] || {};

//   return (
//     <div className="page-wrapper">
//       <SideBar />
//       <div className="content-area">
//         <h2 className="page-title">📋 Complaint History</h2>

//         {loading ? (
//           <div className="loading">Loading history...</div>
//         ) : logData.length === 0 ? (
//           <p className="empty">No data found.</p>
//         ) : ( 
//           <>
//             <table className="complaint-table">
//               <thead>
//                 <tr>
//                   <th>Complaint No</th>
//                   <th>Remarks</th>
//                   <th>Status</th>
//                   <th>Entered Date</th>
//                   <th>Entered By</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {logData.map((row, index) => (
//                   <tr key={index}>
//                     <td>{row.ticketNo}</td>
//                     <td>{row.remarks || '-'}</td>
//                     <td><StatusBadge status={row.complaintStatus} /></td>
//                     <td>{row.tdate ? new Date(row.tdate).toLocaleString() : '-'}</td>
//                     <td>{row.enteredBy}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="tab-bar">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab}
//                   className={`tab-button ${tab === activeTab ? 'active' : ''}`}
//                   onClick={() => setActiveTab(tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             <div className="tab-content">
//             {activeTab === 'Job Details' && (
//   <div className="tab-section">
//     <h3>📌 Job Details</h3>
//     <div className="row-content">
//       <div><strong>Ticket No:</strong> {firstEntry.ticketNo || '-'}</div>
//       <div><strong>Status:</strong> {firstEntry.complaintStatus || '-'}</div>
//       <div><strong>Remarks:</strong> {firstEntry.remarks || '-'}</div>
//       <div><strong>Call By:</strong> {firstEntry.callById || '-'}</div>
//     </div>
//   </div>
// )}
//                {activeTab === 'Customer Detail' && (
//   <div className="tab-section">
//     <h3>👤 Customer Detail</h3>
//     <div className="row-content">
//       <div><strong>Salutation:</strong> {firstEntry.salutation || '-'}</div>
//       <div><strong>First Name:</strong> {firstEntry.firstname  || '-'}</div>
//       <div><strong>Middle Name:</strong> {firstEntry.middleName || '-'}</div>
//       <div><strong>Last Name:</strong> {firstEntry.lastname  || '-'}</div>
//       <div><strong>Mobile No:</strong> {firstEntry.mobileCustomer || firstEntry.mobile || '-'}</div>
//       <div><strong>Alternate No:</strong> {firstEntry.wkPh || firstEntry.hmPh || '-'}</div>
//       <div><strong>Email:</strong> {firstEntry.emailCustomer || firstEntry.email || '-'}</div>
//       <div><strong>Address:</strong> {firstEntry.address1 || '-'} {firstEntry.address2} {firstEntry.address3}</div>
//       <div><strong>Landmark:</strong> {firstEntry.landmark || '-'}</div>
//       <div><strong>Locality:</strong> {firstEntry.locality || '-'}</div>
//       <div><strong>City:</strong> {firstEntry.city || '-'}</div>
//       <div><strong>Pincode:</strong> {firstEntry.pincode || '-'}</div>
//       <div><strong>State:</strong> {firstEntry.state || '-'}</div>
//     </div>
//   </div>
// )}

// {activeTab === 'Product Details' && (
//   <div className="tab-section">
//    <h3>📦 Product Details</h3>
//     <div className="row-content">
//       <div><strong>Model:</strong>  {firstEntry.model || '-'}</div>
//       <div><strong>Product Category:</strong> {firstEntry.category || '-'}</div>
//       <div><strong>Serial No.:</strong> {firstEntry.serialNo || '-'}</div>
//       <div><strong>Purchase Date:</strong>  {firstEntry.purchaseDate ? new Date(firstEntry.purchaseDate).toLocaleDateString() : '-'}</div>
//       <div><strong>Warranty:</strong>  {firstEntry.warranty || '-'}</div>
//       <div><strong>BOM Type:</strong>  {firstEntry.bomType || '-'}</div>
//     </div>
//   </div>
// )}

//                  {activeTab === 'Complaint Detail' && (
//   <div className="tab-section">
//     <h3>🧪 Complaint Detail</h3>
//     <div className="row-content">
//       <div><strong>Complaint No.:</strong> {firstEntry.ticketNo}</div>
//       <div><strong>Complaint Date:</strong> {firstEntry.complaintTDate ? new Date(firstEntry.complaintTDate).toLocaleString() : '-'}</div>
//       <div><strong>Call Type:</strong> {firstEntry.callTypeId || '-'}</div>
//       <div><strong>Complaint Main Status:</strong> {firstEntry.complaintMainStatus || '-'}</div>
//       <div><strong>Complaint Sub Status:</strong> {firstEntry.complaintSubStatus || '-'}</div>
//       <div><strong>Fault Reported/VOC:</strong> {firstEntry.complaintText || '-'}</div>
//       <div><strong>Remarks (Solved over phone):</strong> {firstEntry.remarks || '-'}</div>
//       <div><strong>Enter By:</strong> {firstEntry.enterBy || '-'}</div>
//       <div><strong>Escalated to HO:</strong> {firstEntry.escalated === 1 ? 'Yes' : 'No'}</div>
//       <div><strong>NSP:</strong> {firstEntry.nsp || '-'}</div>
//       <div><strong>SF Name:</strong> {firstEntry.engname || '-'}</div>
//       <div><strong>SF Code:</strong> {firstEntry.engId || '-'}</div>
//       <div><strong>SF Mobile No.:</strong> {firstEntry.mobile || '-'}</div>
//       <div><strong>Appointment Date:</strong> {firstEntry.apptDate ? new Date(firstEntry.apptDate).toLocaleDateString() : '-'}</div>
//       <div><strong>Appointment Time:</strong> {firstEntry.apptTime || '-'}</div>
//       <div><strong>Promise Date:</strong> {firstEntry.promiseDate ? new Date(firstEntry.promiseDate).toLocaleDateString() : '-'}</div>
//       <div><strong>Promise Time:</strong> {firstEntry.promiseTime || '-'}</div>
//       <div><strong>Legal Case:</strong> {firstEntry.legal === 1 ? 'Yes' : 'No'}</div>
//       <div><strong>Special Instructions:</strong> {firstEntry.repairTypeText || '-'}</div>
//     </div>
//   </div>
// )}

            
//               {activeTab === 'Pending Level History' && (
//                 <div className="tab-section">
//                   <h3>🛠️ Pending Level History</h3>
//                   <div className="row-content">
//                     <div><strong>Sr. No:</strong> {firstEntry.tdate ? new Date(firstEntry.tdate).toLocaleString() : '-'}</div>
//                     <div><strong>Job Desc</strong> {firstEntry.complaintSubStatus || '-'}</div>
//                     <div><strong>Symptom:</strong> {firstEntry.complaintSubStatus || '-'}</div>
//                     <div><strong>Cause:</strong> {firstEntry.complaintSubStatus || '-'}</div>
//                     <div><strong>Analysis:</strong> {firstEntry.complaintSubStatus || '-'}</div>
                    
//                   </div>
//                 </div>
//               )}
            
//               {activeTab === 'Document Uploaded' && (
//                 <div className="tab-section">
//                   <h3>🧪 Document Uploaded</h3>
//                   <div className="row-content">
//                     <div><strong>Sr. No.:</strong> Test content (example)</div>
//                     <div><strong>Document Type.:</strong> Test content (example)</div>
//                     <div><strong>Entered Date:</strong> Test content (example)</div>
//                     <div><strong>Action.:</strong> Test content (example)</div>

//                   </div>
//                 </div>
//               )}
//                  {activeTab === 'Document Uploaded from Android Application' && (
//                 <div className="tab-section">
//                   <h3>🧪 Test Info</h3>
//                   <div className="row-content">
//                     <div><strong>Info:</strong> Test content (example)</div>
//                   </div>
//                 </div>
//               )}
//                  {activeTab === 'Job Done' && (
//                 <div className="tab-section">
//                   <h3>🧪 Job Done</h3>
//                   <div className="row-content">
//                     <div><strong>Sr. No.:</strong> Test content (example)</div>
                    
//                     <div><strong>Level.:</strong> Test content (example)</div>
                    
//                     <div><strong>Entered Date.:</strong> Test content (example)</div>
                    
//                     <div><strong>Entered Time.:</strong> Test content (example)</div>
                    
//                     <div><strong>Entered By.:</strong> Test content (example)</div>

//                   </div>
//                 </div>
//               )}
//                {activeTab === 'Part Consumption' && (
//                 <div className="tab-section">
//                   <h3>🧪 Test Info</h3>
//                   <div className="row-content">
//                     <div><strong>Info:</strong> Test content (example)</div>
//                   </div>
//                 </div>
//               )}
//                {activeTab === 'Visit Detail' && (
//                 <div className="tab-section">
//                   <h3>🧪 Test Info</h3>
//                   <div className="row-content">
//                     <div><strong>Info:</strong> Test content (example)</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SideBar from '@/components/SideBar';
import './history.css';
import axiosInstance from '@/api/axiosInstance';

const tabs = [
  'Job Details',
  'Customer Detail',
  'Product Details',
  'Complaint Detail',
  'Pending Level History',
  'Document Uploaded',
  'Job Done',
  'Part Consumption'
];

const StatusBadge = ({ status }) => (
  <span className={`badge ${status?.toLowerCase()}`}>{status}</span>
);

export default function HistoryPage() {
  const { ticketNo } = useParams();
  const [activeTab, setActiveTab] = useState('Job Details');
  const [logData, setLogData] = useState([]);
  const [custDetail, setCustDetail] = useState(null); // ✅ new
  const [loading, setLoading] = useState(true);

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

  // Fetch customer + complaint detail
  useEffect(() => {
    if (ticketNo) {
      axiosInstance
        .get(`ComplaintCustDetail/${ticketNo}`)
        .then((res) => setCustDetail(res.data))
        .catch((err) => console.error('Failed to fetch cust detail:', err));
    }
  }, [ticketNo]);

  const firstEntry = logData[0] || {};
  const detail = custDetail || {}; // ✅ for tabs

  return (
    <div className="page-wrapper">
      <SideBar />
      <div className="content-area">
        <h2 className="page-title">📋 Complaint History</h2>

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
                  <th>Remarks</th>
                  <th>Status</th>
                  <th>Entered Date</th>
                  <th>Entered By</th>
                </tr>
              </thead>
              <tbody>
                {logData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.ticketNo}</td>
                    <td>{row.remarks || '-'}</td>
                    <td><StatusBadge status={row.complaintStatus} /></td>
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
                  <h3>📌 Job Details</h3>
                  <div className="row-content">
                    <div><strong>Ticket No:</strong> {detail.tickeT_NO || '-'}</div>
                    <div><strong>Status:</strong> {detail.complainT_STATUS || '-'}</div>
                    <div><strong>Remarks:</strong> {detail.remarks || '-'}</div>
                    <div><strong>Call By:</strong> {detail.calL_BY || '-'}</div>
                  </div>
                </div>
              )}

              {activeTab === 'Customer Detail' && (
                <div className="tab-section">
                  <h3>👤 Customer Detail</h3>
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
                  <h3>📦 Product Details</h3>
                  <div className="row-content">
                    <div><strong>Model:</strong> {detail.model || '-'}</div>
                    <div><strong>Product Category:</strong> {detail.category || '-'}</div>
                    <div><strong>Serial No.:</strong> {detail.seriaL_NO || '-'}</div>
                    <div><strong>Purchase Date:</strong> {detail.purchasE_DATE ? new Date(detail.purchasE_DATE).toLocaleDateString() : '-'}</div>
                    <div><strong>Warranty:</strong> {detail.warranty || '-'}</div>
                    <div><strong>BOM Type:</strong> {detail.bomType || '-'}</div>
                  </div>
                </div>
              )}

              {activeTab === 'Complaint Detail' && (
                <div className="tab-section">
                  <h3>🧪 Complaint Detail</h3>
                  <div className="row-content">
                    <div><strong>Complaint No:</strong> {detail.tickeT_NO || '-'}</div>
                    <div><strong>Complaint Date:</strong> {detail.tdate ? new Date(detail.tdate).toLocaleString() : '-'}</div>
                    <div><strong>Call Type:</strong> {detail.calL_TYPE || '-'}</div>
                    <div><strong>Complaint Status:</strong> {detail.complainT_STATUS || '-'}</div>
                    <div><strong>Remarks:</strong> {detail.remarks || '-'}</div>
                    <div><strong>Entered By:</strong> {detail.enterby || '-'}</div>
                          <div><strong>Escalated to HO:</strong> {firstEntry.escalated === 1 ? 'Yes' : 'No'}</div>
                          <div><strong>NSP:</strong> {detail.asC_NAME || '-'}</div>
                    <div><strong>SF Name:</strong> {detail.asC_NAME || '-'}</div>
                    <div><strong>SF Code:</strong> {detail.eng_ID || '-'}</div>
                    <div><strong>SF Mobile No.:</strong> {detail.mobile || '-'}</div>
                    <div><strong>Appointment Date:</strong> {detail.apptDate ? new Date(detail.apptDate).toLocaleDateString() : '-'}</div>
                    <div><strong>Appointment Time:</strong> {detail.apptTime || '-'}</div>
                    <div><strong>Promise Date:</strong> {detail.promisE_DATE ? new Date(detail.promisE_DATE).toLocaleDateString() : '-'}</div>
                    <div><strong>Promise Time:</strong> {detail.promisE_TIME || '-'}</div>
                    <div><strong>Legal Case:</strong> {detail.legal === 1 ? 'Yes' : 'No'}</div>
                    <div><strong>Special Instructions:</strong> {detail.splInt || '-'}</div>

                  </div>
                </div>
              )}
                
                {activeTab === 'Pending Level History' && (
                <div className="tab-section">
                  <h3>🛠️ Pending Level History</h3>
                  <div className="row-content">
                    <div><strong>Sr. No:</strong> {detail.seriaL_NO || '-'}</div>
                    <div><strong>Job Desc</strong> {detail.seriaL_NO || '-'}</div>
                    <div><strong>Symptom:</strong> {detail.seriaL_NO || '-'}</div>
                    <div><strong>Cause:</strong> {detail.seriaL_NO|| '-'}</div>
                    <div><strong>Analysis:</strong> {detail.seriaL_NO || '-'}</div>
                    
                  </div>
                </div>
              )}


{activeTab === 'Document Uploaded' && (
                <div className="tab-section">
                  <h3>🧪 Document Uploaded</h3>
                  <div className="row-content">
                    <div><strong>Sr. No.:</strong> {detail.seriaL_NO}</div>
                    <div><strong>Document Type.:</strong> Test content (example)</div>
                    <div><strong>Entered Date:</strong> Test content (example)</div>
                    <div><strong>Action.:</strong> Test content (example)</div>

                  </div>
                </div>
              )}
                 {activeTab === 'Document Uploaded from Android Application' && (
                <div className="tab-section">
                  <h3>🧪 Test Info</h3>
                  <div className="row-content">
                    <div><strong>Info:</strong> Test content (example)</div>
                  </div>
                </div>
              )}
                 {activeTab === 'Job Done' && (
                <div className="tab-section">
                  <h3>🧪 Job Done</h3>
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
                  <h3>🧪 Test Info</h3>
                  <div className="row-content">
                    <div><strong>Info:</strong> Test content (example)</div>
                  </div>
                </div>
              )}
               {activeTab === 'Visit Detail' && (
                <div className="tab-section">
                  <h3>🧪 Test Info</h3>
                  <div className="row-content">
                    <div><strong>Info:</strong> Test content (example)</div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}
