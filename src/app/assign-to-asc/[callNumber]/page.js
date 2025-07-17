
// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import axios from 'axios';
// import SideBar from '@/components/SideBar';
// import './AssignToAscForm.css';

// export default function AssignToAscForm() {
//   const { callNumber } = useParams(); 
//   const [complaint, setComplaint] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchComplaint = async () => {
//       try {
//         const res = await axios.get(`https://ncapi.jainaindia.com/api/CallRegister/by-callnumber/${callNumber}`);
//         setComplaint(res.data);
//       } catch (error) {
//         console.error('Failed to fetch complaint:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (callNumber) fetchComplaint();
//   }, [callNumber]);

//   if (loading) return <p>Loading...</p>;
//   if (!complaint) return <p>No complaint found.</p>;

//   return (
//     <div className="asc-wrapper">
//       <SideBar />
//       <div className="asc-content">
//         <div className="page-header">
//           <h1>Technical Approval</h1>
//         </div>
//         <div className="form-container">
//           <div className="info-grid">
//             <div>
//               <p className="label">Unique Key</p>
//               <p className="value">{complaint.callId}</p>
//             </div>
//             <div>
//               <p className="label">Ticket No</p>
//               <p className="value">{complaint.callNumber}</p>
//             </div>
//             <div>
//               <p className="label">ASC Code</p>
//               <p className="value">{complaint.asC_CODE || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="label">ASC Name</p>
//               <p className="value">{complaint.asc_Name || 'N/A'}</p>
//             </div>
//             <div className="span-2">
//               <p className="label">Issue Description</p>
//               <p className="value">{complaint.faultVoc}</p>
//             </div>
//             <div className="span-2">
//               <p className="label">Product</p>
//               <p className="value">{`${complaint.productCategory} - ${complaint.model}`}</p>
//             </div>
//           </div>

//           <div className="remarks">
//             <p className="remarks-label">Remarks</p>
//             <textarea placeholder="Enter your remarks here..." rows={4} className="remarks-textarea" />
//           </div>

//           <div className="dropdown">
//             <label className="dropdown-label">Select Option (In case of job close)</label>
//             <select className="dropdown-select">
//               <option>----Select----</option>
//               <option>Job Closed - Completed</option>
//               <option>Job Closed - Cancelled</option>
//               <option>Job Closed - Escalated</option>
//             </select>
//           </div>

//           <div className="button-row">
//             <button className="btn btn-secondary">Close</button>
//             <button className="btn btn-primary">Assign to ASC</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SideBar from '@/components/SideBar';
import './AssignToAscForm.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function AssignToAscForm() {
  const { callNumber } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const [remarks, setRemarks] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const router= useRouter();

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await axios.get(`https://ncapi.jainaindia.com/api/CallRegister/by-callnumber/${callNumber}`);
        setComplaint(res.data);
      } catch (error) {
        console.error('Failed to fetch complaint:', error);
      } finally {
        setLoading(false);
      }
    };

    if (callNumber) fetchComplaint();
  }, [callNumber]);

  const handleAssignToASC = async () => {
    if (!complaint?.callNumber || !remarks) {
      Swal.fire('Error', 'Call Number and Remarks are required', 'error');
      return;
    }
  
    const payload = {
      callNumber: complaint.callNumber,
      enteredBy: 'AdminUser',
      enteredByID: 101,
      remarks,
      ASC_Code: complaint.asC_CODE || 'ASC-001', 
    };

    try {
      const response = await axios.post('https://ncapi.jainaindia.com/api/CallRegister/update-to-allot', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Assigned to ASC successfully!',
        confirmButtonText: 'OK'
      });
  
      router.push('/technicalApproval');
  
    } catch (error) {
      console.error('Failed to assign:', error);
      Swal.fire('Error', 'Failed to assign to ASC', 'error');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!complaint) return <p>No complaint found.</p>;

  return (
    <div className="asc-wrapper">
      <SideBar />
      <div className="asc-content">
        <div className="page-header">
          <h1>Technical Approval</h1>
        </div>
        <div className="form-container">
          <div className="info-grid">
            <div>
              <p className="label">Unique Key</p>
              <p className="value">{complaint.callId}</p>
            </div>
            <div>
              <p className="label">Ticket No</p>
              <p className="value">{complaint.callNumber}</p>
            </div>
            <div>
              <p className="label">ASC Code</p>
              <p className="value">{complaint.asC_CODE || 'N/A'}</p>
            </div>
            <div>
              <p className="label">ASC Name</p>
              <p className="value">{complaint.asc_Name || 'N/A'}</p>
            </div>
            <div className="span-2">
              <p className="label">Issue Description</p>
              <p className="value">{complaint.faultVoc}</p>
            </div>
            <div className="span-2">
              <p className="label">Product</p>
              <p className="value">{`${complaint.productCategory} - ${complaint.model}`}</p>
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

          <div className="dropdown">
            <label className="dropdown-label">Select Option (In case of job close)</label>
            <select className="dropdown-select" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
              <option>----Select----</option>
              <option>Job Closed - Completed</option>
              <option>Job Closed - Cancelled</option>
              <option>Job Closed - Escalated</option>
            </select>
          </div>

          <div className="button-row">
            <button className="btn btn-secondary">Close</button>
            <button className="btn btn-primary" onClick={handleAssignToASC}>
              Assign to ASC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
