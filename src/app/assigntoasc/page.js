// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import SideBar from '@/components/SideBar';
// import './AssignToAscForm.css';
// import Swal from 'sweetalert2';
// import { useTheme } from '@/theme/ThemeContext';
// import axiosInstance from '@/api/axiosInstance';

// export default function AssignToAscForm() {
//   const { colors } = useTheme(); 
//   const router = useRouter();

//   const [complaint, setComplaint] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [remarks, setRemarks] = useState('');
//   const [selectedOption, setSelectedOption] = useState('');

//   useEffect(() => {
//     const storedComplaint = localStorage.getItem('selectedComplaint');
//     if (storedComplaint) {
//       setComplaint(JSON.parse(storedComplaint));
//     }
//     setLoading(false);
//   }, []);

//   const handleAssignToASC = async () => {
//     if (!complaint?.tickeT_NO || !remarks) {
//       Swal.fire('Error', 'Ticket No and Remarks are required', 'error');
//       return;
//     }

//     const payload = {
//       callNumber: complaint.tickeT_NO,
//       enteredBy: 'AdminUser',
//       enteredByID: 101,
//       remarks,
//       ASC_Code: complaint.asC_CODE || 'ASC-001',
//     };

//     try {
//       await axiosInstance.post('/CallRegister/update-to-allot', payload, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       await Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: 'Assigned to ASC successfully!',
//         confirmButtonText: 'OK',
//       });

//       router.push('/technicalApproval');
//     } catch (error) {
//       console.error('Failed to assign:', error);
//       Swal.fire('Error', 'Failed to assign to ASC', 'error');
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!complaint) return <p>No complaint found.</p>;

//   return (
//     <div className="asc-wrapper">
//       <SideBar />
//       <div className="asc-content">
//         <div className="form-container">
//           <div className="page-header">
//             <h1>Technical Approval</h1>
//           </div>
//           <div className="info-grid">
//             <div>
//               <p className="label">Ticket No</p>
//               <p className="value">{complaint.tickeT_NO}</p>
//             </div>
//             <div>
//               <p className="label">ASC Code</p>
//               <p className="value">{complaint.asC_CODE || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="label">ASC Name</p>
//               <p className="value">{complaint.asc_Name || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="label">Issue Description</p>
//               <p className="value">{complaint.faultVoc || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="label">Product</p>
//               <p className="value">{complaint.product}-{complaint.model}</p>
//             </div>
//             <div >
//             <label className="label">Select Option (In case of job close)</label>
//             <select
//               className="dropdown-select"
//               value={selectedOption}
//               onChange={(e) => setSelectedOption(e.target.value)}
//             >
//               <option>----Select----</option>
//               <option>Software update</option>
//               <option>Feature Explained</option>
//               <option>External Adjustment done</option>
//               <option>Customer own issue</option>
//               <option>Product damage/Liquid logged</option>
//               <option>OW Call Customer not ready to pay</option>

//               <option>Invalid call</option>
              
//               <option>Other</option>
//             </select>
//           </div>
//           </div>

        

//           <div className="remarks">
//             <p className="remarks-label">Remarks</p>
//             <textarea
//               placeholder="Enter your remarks here..."
//               rows={4}
//               className="remarks-textarea"
//               value={remarks}
//               onChange={(e) => setRemarks(e.target.value)}
//             />
//           </div>

//           <div className="button-row">
//             <button className="btn btn-secondary">Close</button>
//             <button
//               className="btn btn-primary"
//               onClick={handleAssignToASC}
//               style={{ background: colors.primary }}
//             >
//               Assign to ASC
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import SideBar from '@/components/SideBar';
// import './AssignToAscForm.css';
// import Swal from 'sweetalert2';
// import { useTheme } from '@/theme/ThemeContext';
// import axiosInstance from '@/api/axiosInstance';

// export default function AssignToAscForm() {
//   const { colors } = useTheme(); 
//   const router = useRouter();

//   const [complaint, setComplaint] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [remarks, setRemarks] = useState('');
//   const [selectedOption, setSelectedOption] = useState('');

//   useEffect(() => {
//     const storedComplaint = localStorage.getItem('selectedComplaint');
//     if (storedComplaint) {
//       setComplaint(JSON.parse(storedComplaint));
//     }
//     setLoading(false);
//   }, []);

//   const handleAssignToASC = async () => {
//     if (!complaint?.tickeT_NO || !remarks) {
//       Swal.fire('Error', 'Ticket No and Remarks are required', 'error');
//       return;
//     }

//     try {
//       const response = await axiosInstance.post(
//         `/CallRegister/approveOrUpdate`, 
//         {},
//         {
//           params: {
//             ticketNo: complaint.tickeT_NO,
//             userId: 51246, // replace with dynamic logged-in userId if available
//             action: 'Assign',
//             remarks: remarks,
//             ascCode: complaint.asC_CODE || 'ASC-001',
//             dropdownSelection: selectedOption || 'Option1',
//             complaintStatus: 'ToAllot',
//             enteredBy: 'Admin',
//             category: complaint.category || 'Electrical',
//           },
//         }
//       );

//       await Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: response.data?.message || 'Assigned to ASC successfully!',
//         confirmButtonText: 'OK',
//       });

//       router.push('/technicalApproval');
//     } catch (error) {
//       console.error('Failed to assign:', error);
//       Swal.fire('Error', 'Failed to assign to ASC', 'error');
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!complaint) return <p>No complaint found.</p>;

//   return (
//     <div className="asc-wrapper">
//       <SideBar />
//       <div className="asc-content">
//         <div className="form-container">
//           <div className="page-header">
//             <h1>Technical Approval</h1>
//           </div>
//           <div className="info-grid">
//             <div>
//               <p className="label">Ticket No</p>
//               <p className="value">{complaint.tickeT_NO}</p>
//             </div>
//             <div>
//               <p className="label">ASC Code</p>
//               <p className="value">{complaint.asC_CODE || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="label">ASC Name</p>
//               <p className="value">{complaint.asc_Name || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="label">Issue Description</p>
//               <p className="value">{complaint.faultVoc || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="label">Product</p>
//               <p className="value">{complaint.product}-{complaint.model}</p>
//             </div>
//             <div>
//               <label className="label">Select Option (In case of job close)</label>
//               <select
//                 className="dropdown-select"
//                 value={selectedOption}
//                 onChange={(e) => setSelectedOption(e.target.value)}
//               >
//                 <option value="">----Select----</option>
//                 <option value="Software update">Software update</option>
//                 <option value="Feature Explained">Feature Explained</option>
//                 <option value="External Adjustment done">External Adjustment done</option>
//                 <option value="Customer own issue">Customer own issue</option>
//                 <option value="Product damage/Liquid logged">Product damage/Liquid logged</option>
//                 <option value="OW Call Customer not ready to pay">OW Call Customer not ready to pay</option>
//                 <option value="Invalid call">Invalid call</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//           </div>

//           <div className="remarks">
//             <p className="remarks-label">Remarks</p>
//             <textarea
//               placeholder="Enter your remarks here..."
//               rows={4}
//               className="remarks-textarea"
//               value={remarks}
//               onChange={(e) => setRemarks(e.target.value)}
//             />
//           </div>

//           <div className="button-row">
//             <button className="btn btn-secondary">Close</button>
//             <button
//               className="btn btn-primary"
//               onClick={handleAssignToASC}
//               style={{ background: colors.primary }}
//             >
//               Assign to ASC
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideBar from '@/components/SideBar';
import './AssignToAscForm.css';
import Swal from 'sweetalert2';
import { useTheme } from '@/theme/ThemeContext';
import axiosInstance from '@/api/axiosInstance';

export default function AssignToAscForm() {
  const { colors } = useTheme(); 
  const router = useRouter();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const storedComplaint = localStorage.getItem('selectedComplaint');
    if (storedComplaint) {
      setComplaint(JSON.parse(storedComplaint));
    }
    setLoading(false);
  }, []);

  // ✅ Common API caller
  const handleApiCall = async (actionType) => {
    if (!complaint?.tickeT_NO || !remarks) {
      Swal.fire('Error', 'Ticket No and Remarks are required', 'error');
      return;
    }
  
    try {
      const response = await axiosInstance.post(
        `/CallRegister/approveOrUpdate`, 
        {},
        {
          params: {
            ticketNo: complaint.tickeT_NO,
            userId: 51246,
            action: actionType, // Assign or Close
            remarks: remarks,
            ascCode: complaint.asC_CODE || 'ASC-001',
            dropdownSelection: selectedOption || 'Option1',
            complaintStatus: actionType === 'Close' ? 'Ok' : 'ToAllot',
            enteredBy: 'Admin',
            category: complaint.category || 'Electrical',
          },
        }
      );
  
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: actionType === 'Close'
          ? `Complaint ${complaint.tickeT_NO} closed successfully!`
          : `Complaint ${complaint.tickeT_NO} assigned to ASC successfully!`,
        confirmButtonText: 'OK',
      });
  
      router.push('/technicalApproval');
    } catch (error) {
      console.error(`Failed to ${actionType}:`, error);
      Swal.fire('Error', `Failed to ${actionType} complaint`, 'error');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!complaint) return <p>No complaint found.</p>;

  return (
    <div className="asc-wrapper">
      <SideBar />
      <div className="asc-content">
        <div className="form-container">
          <div className="page-header">
            <h1>Technical Approval</h1>
          </div>
          <div className="info-grid">
            <div>
              <p className="label">Ticket No</p>
              <p className="value">{complaint.tickeT_NO}</p>
            </div>
            <div>
              <p className="label">ASC Code</p>
              <p className="value">{complaint.asC_CODE || 'N/A'}</p>
            </div>
            <div>
              <p className="label">ASC Name</p>
              <p className="value">{complaint.asc_Name || 'N/A'}</p>
            </div>
            <div>
              <p className="label">Issue Description</p>
              <p className="value">{complaint.faultVoc || 'N/A'}</p>
            </div>
            <div>
              <p className="label">Product</p>
              <p className="value">{complaint.product}-{complaint.model}</p>
            </div>
            <div>
              <label className="label">Select Option (In case of job close)</label>
              <select
                className="dropdown-select"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">----Select----</option>
                <option value="Software update">Software update</option>
                <option value="Feature Explained">Feature Explained</option>
                <option value="External Adjustment done">External Adjustment done</option>
                <option value="Customer own issue">Customer own issue</option>
                <option value="Product damage/Liquid logged">Product damage/Liquid logged</option>
                <option value="OW Call Customer not ready to pay">OW Call Customer not ready to pay</option>
                <option value="Invalid call">Invalid call</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="remarks">
            <p className="remarks-label">Remarks</p>
            <textarea
              placeholder="Enter your remarks here..."
              rows={4}
              className="remarks-textarea"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="button-row">
            <button
              className="btn btn-secondary"
              onClick={() => handleApiCall('Close')}
            >
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleApiCall('Assign')}
              style={{ background: colors.primary }}
            >
              Assign to ASC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
