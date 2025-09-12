


// 'use client';

// import { useEffect, useState } from 'react';
// import '../../components/Sidebar.css';
// import './technical.css';
// import SideBar from '@/components/SideBar';
// import { useRouter } from 'next/navigation'; 
// import { useTheme } from '@/theme/ThemeContext';
// import axiosInstance from '@/api/axiosInstance';

// export default function ComplaintTable() {
//   const { colors } = useTheme(); 
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const getStatusClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'technical approval': return 'badge open';
//       case 'pending': return 'badge pending';
//       case 'closed': return 'badge closed';
//       default: return 'badge';
//     }
//   };

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const response = await axiosInstance.get(
//           'CallRegister/getstatus/Technical Approval/Not Assigned'
//         );
//         setComplaints(response.data || []);
//       } catch (error) {
//         console.error('Error fetching complaints:', error);
//         setComplaints([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComplaints();
//   }, []);

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh' }}>
//       <SideBar />
//       <div className="content-container">
//         <div className="table-container">
//           <div className='h2'>Technical Approval Listing</div>

//           {loading ? (
//             <p>Loading complaints...</p>
//           ) : (
//             <table className="complaint-table">
//               <thead>
//                 <tr>
//                   <th>Update</th>
//                   <th>Complaint No.</th> 
//                   <th>Customer Name</th>
//                   <th>Product</th>
//                   <th>Call Type</th>
//                   <th>Status</th>
//                   <th>Sub Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {complaints.length === 0 ? (
//                   <tr>
//                     <td colSpan="7">No complaints found.</td>
//                   </tr>
//                 ) : (
//                   complaints.map((item, idx) => (
//                     <tr key={idx}>
//                       <td>
//                         {/* <button
//                           className="update-btn"
//                           onClick={() => router.push(`/assign-to-asc/${item.tickeT_NO}`)}
//                           style={{backgroundColor: colors.primary}}
//                         >
//                           Update
//                         </button> */}
//                         <button
//   className="update-btn"
//   onClick={() => {
//     localStorage.setItem('selectedComplaint', JSON.stringify(item));
//     router.push('/assigntoasc'); // 👈 no ticket number in URL
//   }}
//   style={{ backgroundColor: colors.primary }}
// >
//   Update
// </button>
//                       </td>
//                       <td>{item.tickeT_NO}</td>
//                       <td>{`${item.salutation || ''} ${item.firstname || ''} ${item.lastname || ''}`}</td>
//                       <td>{item.product}</td>
//                       <td>{item.calL_TYPE}</td>
//                       <td>
//                         <span className={getStatusClass(item.complainT_STATUS)}>
//                           {item.complainT_STATUS}
//                         </span>
//                       </td>
//                       <td>{item.complainT_SUBSTATUS}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import '../../components/Sidebar.css';
import './technical.css';
import SideBar from '@/components/SideBar';
import { useRouter } from 'next/navigation'; 
import { useTheme } from '@/theme/ThemeContext';
import axiosInstance from '@/api/axiosInstance';
import { useSelector } from 'react-redux';

export default function ComplaintTable() {
  const { colors } = useTheme(); 
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Get user from Redux or fallback to localStorage
  const reduxUser = useSelector((state) => state.auth?.user);
  const localUser = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('user')) 
    : null;

  const user = reduxUser || localUser;
  const userID = user?.userID;
  const roleID = user?.roleID;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'technical approval': return 'badge open';
      case 'pending': return 'badge pending';
      case 'closed': return 'badge closed';
      default: return 'badge';
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!userID || !roleID) {
        console.warn("Missing userID or roleID, cannot fetch complaints.");
        setLoading(false);
        return;
      }

      try {
       
        const response = await axiosInstance.get(
          `CallRegister/getstatus/ToAllot/Not Assigned/${roleID}/${userID}`
        );

        setComplaints(response.data || []);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userID, roleID]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SideBar />
      <div className="content-container">
        <div className="table-container">
          <div className='h2'>Technical Approval Listing</div>

          {loading ? (
            <p>Loading complaints...</p>
          ) : (
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Update</th>
                  <th>Complaint No.</th> 
                  <th>Customer Name</th>
                  <th>Product</th>
                  <th>Call Type</th>
                  <th>Status</th>
                  <th>Sub Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="7">No complaints found.</td>
                  </tr>
                ) : (
                  complaints.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <button
                          className="update-btn"
                          onClick={() => {
                            localStorage.setItem('selectedComplaint', JSON.stringify(item));
                            router.push('/assigntoasc'); 
                          }}
                          style={{ backgroundColor: colors.primary }}
                        >
                          Update
                        </button>
                      </td>
                      <td>{item.tickeT_NO}</td>
                      <td>{`${item.salutation || ''} ${item.firstname || ''} ${item.lastname || ''}`}</td>
                      <td>{item.product}</td>
                      <td>{item.calL_TYPE}</td>
                      <td>
                        <span className={getStatusClass(item.complainT_STATUS)}>
                          {item.complainT_STATUS}
                        </span>
                      </td>
                      <td>{item.complainT_SUBSTATUS}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
