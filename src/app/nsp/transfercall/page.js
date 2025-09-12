
// 'use client';
// import { useTheme } from '@/theme/ThemeContext';
// import SideBar from '@/components/SideBar';

// export default function TransferCallForm() {
//   const { colors } = useTheme();

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <SideBar />

//       {/* Main content */}
//       <div className="flex-1 pl-30 pt-10 pr-20">
//         {/* Left-aligned card */}
//         <div className="w-full">
//           <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
//             {/* Title */}
//             <h2
//         className="text-2xl font-bold mb-8 text-left"
//         style={{
//           color: colors.primary,
//           padding: 5,
//           fontWeight: 700,
//           fontSize: 18,
//           border: `2px solid ${colors.primary}`,
//           borderRadius: 5
//         }}
//       >
//         Transfer Call
//       </h2>

//             {/* Form */}
//             <form className="grid grid-cols-2 gap-6">
//               {/* Job Id */}
//               <div className="flex flex-col">
//                 <label className="mb-2 text-sm font-medium text-gray-700">complaint No</label>
//                 <input
//                   type="text"
//                   placeholder="Enter Job Id"
//                   className="border rounded-lg px-3 py-2 focus:outline-none"
//                 />
//               </div>

//               {/* Asc Name */}
//               <div className="flex flex-col">
//                 <label className="mb-2 text-sm font-medium text-gray-700">Asc Name</label>
//                 <select className="border rounded-lg px-3 py-2 focus:outline-none">
//                   <option>To SF</option>
//                   <option>test1@example.com</option>
//                   <option>test2@example.com</option>
//                 </select>
//               </div>

//               {/* Buttons */}
//               <div className="col-span-2 flex gap-4 mt-6">
//                 <button
//                   type="button"
//                   className="px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition"
//                   style={{ background: colors.primary, color: '#fff' }}
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition"
//                   style={{ background: colors.primary, color: '#fff' }}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { useState } from 'react';
// import { useTheme } from '@/theme/ThemeContext';
// import SideBar from '@/components/SideBar';
// import axiosInstance from '@/api/axiosInstance';
// import CustomDropdown from '@/components/common/Dropdown';


// export default function TransferCallForm() {
//   const { colors } = useTheme();

//   // Form state
//   const [ticketNo, setTicketNo] = useState('');
//   const [transferTo, setTransferTo] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   // Map of Asc Names to SF Ids
//   const ascList = [
//     { name: 'Technician1', sfId: 101 },
//     { name: 'Technician2', sfId: 102 }
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!ticketNo || !transferTo) {
//       setMessage({ type: 'error', text: 'Please fill all fields.' });
//       return;
//     }

//     const selectedAsc = ascList.find((asc) => asc.name === transferTo);

//     if (!selectedAsc) {
//       setMessage({ type: 'error', text: 'Please select a valid ASC.' });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       const payload = {
//         ticketNo,
//         toSfId: selectedAsc.sfId,
//         transferBy: 51591,
//         transferTo: selectedAsc.name
//       };

//       const response = await axiosInstance.post('/CallTransfer/transfer', payload);

//       setMessage({ type: 'success', text: response.data.status || 'Call transferred successfully.' });
//       setTicketNo('');
//       setTransferTo('');
//     } catch (error) {
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Something went wrong!'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <SideBar />

//       <div className="flex-1 pl-30 pt-10 pr-20">
//         <div className="w-full">
//           <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
//             <h2
//               className="text-2xl font-bold mb-8 text-left"
//               style={{
//                 color: colors.primary,
//                 padding: 5,
//                 fontWeight: 700,
//                 fontSize: 18,
//                 border: `2px solid ${colors.primary}`,
//                 borderRadius: 5
//               }}
//             >
//               Transfer Call
//             </h2>

//             {message && (
//               <div
//                 className={`mb-4 px-4 py-2 rounded ${
//                   message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                 }`}
//               >
//                 {message.text}
//               </div>
//             )}

//             <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
//               {/* Complaint No */}
//               <div className="flex flex-col">
//                 <label className="mb-2 text-sm font-medium text-gray-700">Complaint No</label>
//                 <input
//                   type="text"
//                   placeholder="Enter Complaint No"
//                   className="border rounded-lg px-3 py-2 focus:outline-none"
//                   value={ticketNo}
//                   onChange={(e) => setTicketNo(e.target.value)}
//                 />
//               </div>

//               {/* Asc Name */}
//               {/* <div className="flex flex-col">
//                 <label className="mb-2 text-sm font-medium text-gray-700">Asc Name</label>
//                 <select
//                   className="border rounded-lg px-3 py-2 focus:outline-none"
//                   value={transferTo}
//                   onChange={(e) => setTransferTo(e.target.value)}
//                 >
//                   <option value="">Select ASC</option>
//                   {ascList.map((asc) => (
//                     <option key={asc.sfId} value={asc.name}>
//                       {asc.name}
//                     </option>
//                   ))}
//                 </select>
//               </div> */}
                             
//                <CustomDropdown
//                   label="Asc Name"
//                   placeholder="Select ASC"
//                   value={transferTo}
//                   onChange={setTransferTo}
//                   options={ascList.map((asc) => ({ label: asc.name, value: asc.name }))}
//                 />


//               {/* Buttons */}
//               <div className="col-span-2 flex gap-4 mt-6">
//                 <button
//                   type="button"
//                   className="px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition"
//                   style={{ background: colors.primary, color: '#fff' }}
//                   onClick={() => window.history.back()}
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition"
//                   style={{ background: colors.primary, color: '#fff' }}
//                   disabled={loading}
//                 >
//                   {loading ? 'Transferring...' : 'Submit'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux
import { useTheme } from '@/theme/ThemeContext';
import SideBar from '@/components/SideBar';
import axiosInstance from '@/api/axiosInstance';
import CustomDropdown from '@/components/common/Dropdown';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function TransferCallForm() {
  const { colors } = useTheme();

  // Redux selector to get user login details
  const user = useSelector((state) => state.auth.user); // Adjust slice name if needed
  const branchId = user?.branch_ID;
  const roleName = user?.roleName;

  // Form state
  const [ticketNo, setTicketNo] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [ascList, setAscList] = useState([]);
  const [ascOptions, setAscOptions] = useState([]);

  // Fetch ASC list dynamically based on branchId and roleName
  useEffect(() => {
    if (!branchId || !roleName) return;

    const fetchAscList = async () => {
      try {
        const response = await axiosInstance.get(`/ASC_MASTER/role/${roleName}/${branchId}`);
        if (Array.isArray(response.data)) {
          setAscList(response.data);
          setAscOptions(
            response.data.map((asc) => ({ label: asc.ASC_NAME, value: asc.ASC_NAME }))
          );
        }
      } catch (error) {
        console.error('Error fetching ASC list:', error);
      }
    };

    fetchAscList();
  }, [branchId, roleName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ticketNo || !transferTo) {
      setMessage({ type: 'error', text: 'Please fill all fields.' });
      return;
    }

    const selectedAsc = ascList.find((asc) => asc.ASC_NAME === transferTo);

    if (!selectedAsc) {
      setMessage({ type: 'error', text: 'Please select a valid ASC.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        ticketNo,
        toSfId: selectedAsc.ASCINTCODE, // Use ASCINTCODE as ID
        transferBy: user?.userID || 0, // Logged-in user ID from Redux
        transferTo: selectedAsc.ASC_NAME
      };

      const response = await axiosInstance.post('/CallTransfer/transfer', payload);

      setMessage({ type: 'success', text: response.data.status || 'Call transferred successfully.' });
      setTicketNo('');
      setTransferTo('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Something went wrong!'
      });
    } finally {
      setLoading(false);
    }
  };

  return (

     <ProtectedRoute allowedRoles={['br']}>  
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 pl-30 pt-10 pr-20">
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2
              className="text-2xl font-bold mb-8 text-left"
              style={{
                color: colors.primary,
                padding: 5,
                fontWeight: 700,
                fontSize: 18,
                border: `2px solid ${colors.primary}`,
                borderRadius: 5
              }}
            >
              Transfer Call
            </h2>

            {message && (
              <div
                className={`mb-4 px-4 py-2 rounded ${
                  message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <form className="grid grid-cols-3 gap-6" onSubmit={handleSubmit}>
              {/* Complaint No */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-gray-700">Complaint No</label>
                <input
                  type="text"
                  placeholder="Enter Complaint No"
                  className="border rounded-lg px-3 py-2 focus:outline-none"
                  value={ticketNo}
                  onChange={(e) => setTicketNo(e.target.value)}
                />
              </div>

              {/* ASC Dropdown */}
              <CustomDropdown
                label="Asc Name"
                placeholder="Select ASC"
                value={transferTo}
                onChange={setTransferTo}
                options={ascOptions}
              />

              {/* Buttons */}
              <div className="col-span-2 flex gap-4 mt-6">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition"
                  style={{ background: colors.primary, color: '#fff' }}
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition"
                  style={{ background: colors.primary, color: '#fff' }}
                  disabled={loading}
                >
                  {loading ? 'Transferring...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
