// //  'use client';
// // import { useRouter } from 'next/navigation'; 

// // import SideBar from "@/components/SideBar";
// // import DashboardCard from "@/components/DashboardCard";
// // import {
// //   MdAssignmentLate,
// //   MdAssignmentTurnedIn,
// //   MdWork,
// //   MdPendingActions,
// //   MdLocalShipping,
// //   MdInventory,
// //   MdApproval,
// //   MdHourglassDisabled,
// //   MdCancel,
// //   MdOutlineHelpOutline,
// //   MdMailOutline,
// //   MdReplayCircleFilled,
// //   MdBlock,
// //   MdOutlineChecklist,
// //   MdWarningAmber,
// // } from "react-icons/md";
// // import "../../../components/Sidebar.css"
// // import { useTheme } from '@/theme/ThemeContext';

// // export default function Dashboard() {
// //   const { colors } = useTheme(); 
  
// //   const router = useRouter();

// //   const allDashboardData = [
// //     { title: 'WIP', value: 1, Icon: MdWork, iconColor: 'text-yellow-500' },
// //     { title: 'Techical Approval', value: 462, Icon: MdPendingActions, iconColor: 'text-orange-500' },
// //         { title: "Not Assigned", value: 237, Icon: MdAssignmentLate, iconColor: "text-red-500" },
// //     { title: "Assigned", value: 1131, Icon: MdAssignmentTurnedIn, iconColor: "text-green-500" },
// //     { title: "WIP", value: 1, Icon: MdWork, iconColor: "text-yellow-500" },
// //     { title: "Part Pending", value: 462, Icon: MdPendingActions, iconColor: "text-orange-500" },
// //     { title: "Part In Transit", value: 430, Icon: MdLocalShipping, iconColor: "text-blue-500" },
// //     { title: "Part Received", value: 148, Icon: MdInventory, iconColor: "text-green-600" },
// //     { title: "Part Issued", value: 54, Icon: MdOutlineChecklist },
// //     { title: "Spc. Approval", value: 0, Icon: MdApproval },
// //     { title: "DOA Approval", value: 8, Icon: MdApproval },
// //     { title: "Pen >= 15 Days", value: 3751, Icon: MdWarningAmber, iconColor: "text-orange-600" },
// //     { title: "Cancellation", value: 52, Icon: MdCancel, iconColor: "text-red-600" },
// //     { title: "Other", value: 60, Icon: MdOutlineHelpOutline },
// //     { title: "ASC Request", value: 80, Icon: MdMailOutline },
// //     { title: "Request Appr.", value: 100, Icon: MdApproval },
// //     { title: "ASC Created", value: 0, Icon: MdOutlineChecklist },
// //     { title: "Request for Reallot", value: 0, Icon: MdReplayCircleFilled },
// //     { title: "Pend. Challans at NWH", value: "-", Icon: MdHourglassDisabled },
// //     { title: "Claims Rejected", value: "-", Icon: MdBlock, iconColor: "text-red-500" },
   
// //   ];

// //   const handleCardClick = (status) => {
// //     const encodedStatus = encodeURIComponent(status);
// //     router.push(`/nsp/dashboardcall?status=${encodedStatus}`);
// //   };
 
// //   return (
// //     <div className="flex">
// //       <SideBar />
// //       <main className="flex-1 min-h-screen bg-gray-100 p-6 ml-[60px] transition-all duration-300">
// //         <section className="rounded-xl shadow-md p-6 bg-blue-50">
// //           <h2 className="text-xl font-bold mb-6 text-left py-3 rounded-lg" style={{color:colors.primary,fontWeight:700,  padding: 10,border: `2px solid ${colors.primary}`}}>
// //             Dashboard Overview
// //           </h2>
// //           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 2xl:grid-cols-8 gap-6">
// //             {allDashboardData.map((item, idx) => (
// //               <div
// //                 key={idx}
// //                 onClick={() => handleCardClick(item.title)} 
// //                 className="cursor-pointer"
// //               >
// //                 <DashboardCard
// //                   title={item.title}
// //                   value={item.value}
// //                   Icon={item.Icon}
// //                   iconColor={item.iconColor}
// //                 />
// //               </div>
// //             ))}
// //           </div>
// //         </section>
// //       </main>
// //     </div>
// //   );
// // // }
// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import axiosInstance from '@/api/axiosInstance';

// // import SideBar from "@/components/SideBar";
// // import DashboardCard from "@/components/DashboardCard";
// // import {
// //   MdAssignmentLate,
// //   MdAssignmentTurnedIn,
// //   MdWork,
// //   MdPendingActions,
// //   MdLocalShipping,
// //   MdInventory,
// //   MdApproval,
// //   MdHourglassDisabled,
// //   MdCancel,
// //   MdOutlineHelpOutline,
// //   MdMailOutline,
// //   MdReplayCircleFilled,
// //   MdBlock,
// //   MdOutlineChecklist,
// //   MdWarningAmber,
// // } from "react-icons/md";

// // import "../../../components/Sidebar.css";
// // import { useTheme } from '@/theme/ThemeContext';

// // export default function Dashboard() {
// //   const { colors } = useTheme();
// //   const router = useRouter();

// //   const [dashboardData, setDashboardData] = useState([]);

// //   // Map API substatus/bucket → dashboard card config
// //   const statusMap = {
// //     "Not Assigned": { title: "Not Assigned", Icon: MdAssignmentLate, iconColor: "text-red-500" },
// //     "Assigned": { title: "Assigned", Icon: MdAssignmentTurnedIn, iconColor: "text-green-500" },
// //     "WIP": { title: "WIP", Icon: MdWork, iconColor: "text-yellow-500" },
// //     "Part Pending": { title: "Part Pending", Icon: MdPendingActions, iconColor: "text-orange-500" },
// //     "Part In Transit": { title: "Part In Transit", Icon: MdLocalShipping, iconColor: "text-blue-500" },
// //     "Part Received": { title: "Part Received", Icon: MdInventory, iconColor: "text-green-600" },
// //     "Part Issued": { title: "Part Issued", Icon: MdOutlineChecklist },
// //     "Spc. Approval": { title: "Spc. Approval", Icon: MdApproval },
// //     "DOA Approval": { title: "DOA Approval", Icon: MdApproval },
// //     "Pen >= 15 Days": { title: "Pen >= 15 Days", Icon: MdWarningAmber, iconColor: "text-orange-600" },
// //     "Cancellation": { title: "Cancellation", Icon: MdCancel, iconColor: "text-red-600" },
// //     "Other": { title: "Other", Icon: MdOutlineHelpOutline },
// //     "ASC Request": { title: "ASC Request", Icon: MdMailOutline },
// //     "Request Appr.": { title: "Request Appr.", Icon: MdApproval },
// //     "ASC Created": { title: "ASC Created", Icon: MdOutlineChecklist },
// //     "Request for Reallot": { title: "Request for Reallot", Icon: MdReplayCircleFilled },
// //     "Pend. Challans at NWH": { title: "Pend. Challans at NWH", Icon: MdHourglassDisabled },
// //     "Claims Rejected": { title: "Claims Rejected", Icon: MdBlock, iconColor: "text-red-500" },
// //   };

// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         const res = await axiosInstance.get(`/DashboardBucket/role/2`);
// //         const formattedData = res.data.map((item) => {
// //           const mapItem = statusMap[item.bucket] || { title: item.bucket, Icon: MdOutlineHelpOutline };
// //           return {
// //             title: mapItem.title,
// //             value: item.cnt ?? 0,
// //             Icon: mapItem.Icon,
// //             iconColor: mapItem.iconColor,
// //           };
// //         });
  
// //         setDashboardData(formattedData);
// //       } catch (error) {
// //         console.error(
// //           "Error fetching dashboard data:",
// //           error.response?.status,
// //           error.response?.data
// //         );
// //       }
// //     };
  
// //     fetchDashboardData();
// //   }, []);
  

// //   const handleCardClick = (status) => {
// //     const encodedStatus = encodeURIComponent(status);
// //     router.push(`/nsp/dashboardcall?status=${encodedStatus}`);
// //   };

// //   return (
// //     <div className="flex">
// //       <SideBar />
// //       <main className="flex-1 min-h-screen bg-gray-100 p-6 ml-[60px] transition-all duration-300">
// //         <section className="rounded-xl shadow-md p-6 bg-blue-50">
// //           <h2
// //             className="text-xl font-bold mb-6 text-left py-3 rounded-lg"
// //             style={{
// //               color: colors.primary,
// //               fontWeight: 700,
// //               padding: 10,
// //               border: `2px solid ${colors.primary}`,
// //             }}
// //           >
// //             Dashboard Overview
// //           </h2>

// //           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 2xl:grid-cols-8 gap-6">
// //             {dashboardData.map((item, idx) => (
// //               <div
// //                 key={idx}
// //                 onClick={() => handleCardClick(item.title)}
// //                 className="cursor-pointer"
// //               >
// //                 <DashboardCard
// //                   title={item.title}
// //                   value={item.value}
// //                   Icon={item.Icon}
// //                   iconColor={item.iconColor}
// //                 />
// //               </div>
// //             ))}
// //           </div>
// //         </section>
// //       </main>
// //     </div>
// //   );
// // }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axiosInstance from '@/api/axiosInstance';

// import SideBar from "@/components/SideBar";
// import DashboardCard from "@/components/DashboardCard";
// import {
//   MdAssignmentLate,
//   MdAssignmentTurnedIn,
//   MdWork,
//   MdPendingActions,
//   MdLocalShipping,
//   MdInventory,
//   MdApproval,
//   MdHourglassDisabled,
//   MdCancel,
//   MdOutlineHelpOutline,
//   MdMailOutline,
//   MdReplayCircleFilled,
//   MdBlock,
//   MdOutlineChecklist,
//   MdWarningAmber,
// } from "react-icons/md";

// import "../../../components/Sidebar.css";
// import { useTheme } from '@/theme/ThemeContext';
// import { useSelector } from 'react-redux';

// export default function Dashboard() {
//   const { colors } = useTheme();
//   const router = useRouter();
//   const userInfo = useSelector((state) => state.auth?.user); 

//   const [dashboardData, setDashboardData] = useState([]);

//   // 👇 Map bucket names → icons + optional colors
//   const iconMap = {
//     "Not Assigned": { Icon: MdAssignmentLate, iconColor: "text-red-500" },
//     "Assigned": { Icon: MdAssignmentTurnedIn, iconColor: "text-green-500" },
//     "WIP": { Icon: MdWork, iconColor: "text-yellow-500" },
//     "Part Pending": { Icon: MdPendingActions, iconColor: "text-orange-500" },
//     "Part In Transit": { Icon: MdLocalShipping, iconColor: "text-blue-500" },
//     "Part Received": { Icon: MdInventory, iconColor: "text-green-600" },
//     "Part Issued": { Icon: MdOutlineChecklist },
//     "Spc. Approval": { Icon: MdApproval },
//     "DOA Approval": { Icon: MdApproval },
//     "Pen >= 15 Days": { Icon: MdWarningAmber, iconColor: "text-orange-600" },
//     "Cancellation": { Icon: MdCancel, iconColor: "text-red-600" },
//     "Other": { Icon: MdOutlineHelpOutline },
//     "ASC Request": { Icon: MdMailOutline },
//     "Request Appr.": { Icon: MdApproval },
//     "ASC Created": { Icon: MdOutlineChecklist },
//     "Request for Reallot": { Icon: MdReplayCircleFilled },
//     "Pend. Challans at NWH": { Icon: MdHourglassDisabled },
//     "Claims Rejected": { Icon: MdBlock, iconColor: "text-red-500" },
//   };



//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (!userInfo?.roleID) return;
  
//       try {
//         // Pick firstID dynamically
//         let firstID = 0;
  
//         if (userInfo?.sF_ID && userInfo.sF_ID !== 0) firstID = userInfo.sF_ID;
//         else if (userInfo?.cat_MapID && userInfo.cat_MapID !== 0) firstID = userInfo.cat_MapID;
//         else if (userInfo?.asmid && userInfo.asmid !== 0) firstID = userInfo.asmid;
//         else if (userInfo?.branch_ID && userInfo.branch_ID !== 0) firstID = userInfo.branch_ID;
//         else if (userInfo?.userID) firstID = userInfo.userID; 
  
//         const roleID = userInfo.roleID;
  
//         // Fetch both APIs dynamically
//         const [roleRes, aggRes] = await Promise.all([
//           axiosInstance.get(`/DashboardBucket/role/${roleID}`),
//           axiosInstance.get(`/DashboardBucket/aggregation/${firstID}/${roleID}`),
//         ]);
  
//         // Build lookup from aggregation API
//         const countMap = {};
//         aggRes.data.forEach((item) => {
//           countMap[item.complaintSubStatus] = item.count;
//         });
  
//         // Merge role API with aggregation counts
//         const formattedData = roleRes.data.map((item) => {
//           const mapItem = iconMap[item.bucket] || { Icon: MdOutlineHelpOutline };
//           return {
//             id: item.id,
//             title: item.bucket,
//             value: countMap[item.complaintSubStatus] ?? 0,
//             navigatingUrl: item.navigatingUrl,
//             Icon: mapItem.Icon,
//             iconColor: mapItem.iconColor,
//           };
//         });
  
//         setDashboardData(formattedData);
//       } catch (error) {
//         console.error(
//           "Error fetching dashboard data:",
//           error.response?.status,
//           error.response?.data
//         );
//       }
//     };
  
//     fetchDashboardData();
//   }, [userInfo]);
  
  

//   // const handleCardClick = (url, bucket) => {
//   //   if (url) {
//   //     router.push(`/nsp/${url}`);
//   //   } else {
//   //     const encodedStatus = encodeURIComponent(bucket);
//   //     router.push(`/nsp/dashboardcall?status=${encodedStatus}`);
//   //   }
//   // };


//   const handleCardClick = (item) => {
//     if (item.navigatingUrl) {
//       router.push(`/nsp/${item.navigatingUrl}`);
//     } else {
//       const queryParams = new URLSearchParams({
//         complaintStatus: item.complaintStatus,
//         complaintSubStatus: item.title,
//         roleID: userInfo.roleID,
//         branch_ID: userInfo.branch_ID,
//       }).toString();
  
//       router.push(`/nsp/dashboardcall?${queryParams}`);
//     }
//   };

//   return (
//     <div className="flex">
//       <SideBar />
//       <main className="flex-1 min-h-screen bg-gray-100 p-6 ml-[60px] transition-all duration-300">
//         <section className="rounded-xl shadow-md p-6 bg-blue-50">
//           <h2
//             className="text-xl font-bold mb-6 text-left py-3 rounded-lg"
//             style={{
//               color: colors.primary,
//               fontWeight: 700,
//               padding: 10,
//               border: `2px solid ${colors.primary}`,
//             }}
//           >
//             Dashboard Overview
//           </h2>

//           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 2xl:grid-cols-8 gap-6">
//             {dashboardData.map((item) => (
//               <div
//                 key={item.id}
//                 onClick={() => handleCardClick(item.navigatingUrl, item.title)}
//                 className="cursor-pointer"
//               >
//                 <DashboardCard
//                   title={item.title}
//                   value={item.value}
//                   Icon={item.Icon}
//                   iconColor={item.iconColor}
//                 />
//               </div>
//             ))} 
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/api/axiosInstance';

import SideBar from "@/components/SideBar";
import DashboardCard from "@/components/DashboardCard";
import {
  MdAssignmentLate,
  MdAssignmentTurnedIn,
  MdWork,
  MdPendingActions,
  MdLocalShipping,
  MdInventory,
  MdApproval,
  MdHourglassDisabled,
  MdCancel,
  MdOutlineHelpOutline,
  MdMailOutline,
  MdReplayCircleFilled,
  MdBlock,
  MdOutlineChecklist,
  MdWarningAmber,
} from "react-icons/md";

import "../../../components/Sidebar.css";
import { useTheme } from '@/theme/ThemeContext';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Dashboard() {
  const { colors } = useTheme();
  const userInfo = useSelector((state) => state.auth?.user);
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState([]);

  // 👇 Map bucket names → icons
  const iconMap = {
    "Not Assigned": { Icon: MdAssignmentLate, iconColor: "text-red-500" },
    "Assigned": { Icon: MdAssignmentTurnedIn, iconColor: "text-green-500" },
    "WIP": { Icon: MdWork, iconColor: "text-yellow-500" },
    "Part Pending": { Icon: MdPendingActions, iconColor: "text-orange-500" },
    "Part In Transit": { Icon: MdLocalShipping, iconColor: "text-blue-500" },
    "Part Received": { Icon: MdInventory, iconColor: "text-green-600" },
    "Part Issued": { Icon: MdOutlineChecklist },
    "Spc. Approval": { Icon: MdApproval },
    "DOA Approval": { Icon: MdApproval },
    "Pen >= 15 Days": { Icon: MdWarningAmber, iconColor: "text-orange-600" },
    "Cancellation": { Icon: MdCancel, iconColor: "text-red-600" },
    "Other": { Icon: MdOutlineHelpOutline },
    "ASC Request": { Icon: MdMailOutline },
    "Request Appr.": { Icon: MdApproval },
    "ASC Created": { Icon: MdOutlineChecklist },
    "Request for Reallot": { Icon: MdReplayCircleFilled },
    "Pend. Challans at NWH": { Icon: MdHourglassDisabled },
    "Claims Rejected": { Icon: MdBlock, iconColor: "text-red-500" },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userInfo?.roleID) return;

      try {
        let firstID = 0;

        if (userInfo?.sF_ID && userInfo.sF_ID !== 0) firstID = userInfo.sF_ID;
        else if (userInfo?.cat_MapID && userInfo.cat_MapID !== 0) firstID = userInfo.cat_MapID;
        else if (userInfo?.asmid && userInfo.asmid !== 0) firstID = userInfo.asmid;
        else if (userInfo?.branch_ID && userInfo.branch_ID !== 0) firstID = userInfo.branch_ID;
        else if (userInfo?.userID) firstID = userInfo.userID;

        const roleID = userInfo.roleID;

        const [roleRes, aggRes] = await Promise.all([
          axiosInstance.get(`/DashboardBucket/role/${roleID}`),
          axiosInstance.get(`/DashboardBucket/aggregation/${firstID}/${roleID}`),
        ]);

        const countMap = {};
        aggRes.data.forEach((item) => {
          countMap[item.complaintSubStatus] = item.count;
        });

        const formattedData = roleRes.data.map((item) => {
          const mapItem = iconMap[item.bucket] || { Icon: MdOutlineHelpOutline };
          return {
            id: item.id,
            title: item.bucket,
            value: countMap[item.complaintSubStatus] ?? 0,
            complaintStatus: item.complaintStatus,
            complaintSubStatus: item.complaintSubStatus,
            Icon: mapItem.Icon,
            iconColor: mapItem.iconColor,
          };
        });

        setDashboardData(formattedData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.response?.status, error.response?.data);
      }
    };

    fetchDashboardData();
  }, [userInfo]);

  
  const handleCardClick = (item) => {
    router.push(
      `/nsp/dashboardcall?status=${encodeURIComponent(item.complaintStatus)}&subStatus=${encodeURIComponent(item.complaintSubStatus)}&roleID=${userInfo.roleID}&branchID=${userInfo.branch_ID}`
    );
  };

  return ( 
     <ProtectedRoute allowedRoles={['br']}> 
        <div className="flex">
      <SideBar />
      <main className="flex-1 min-h-screen bg-gray-100 p-6 ml-[60px] transition-all duration-300">
        <section className="rounded-xl shadow-md p-6 bg-blue-50">
          <h2
            className="text-xl font-bold mb-6 text-left py-3 rounded-lg"
            style={{
              color: colors.primary,
              fontWeight: 700,
              padding: 10,
              border: `2px solid ${colors.primary}`,
            }}
          >
            Dashboard Overview
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 2xl:grid-cols-8 gap-6">
            {dashboardData.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="cursor-pointer"
              >
                <DashboardCard
                  title={item.title}
                  value={item.value}
                  Icon={item.Icon}
                  iconColor={item.iconColor}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
    </ProtectedRoute>

  );
}
