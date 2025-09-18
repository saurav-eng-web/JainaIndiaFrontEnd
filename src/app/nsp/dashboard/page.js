


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
    let firstID = 0;
  
    if (userInfo?.sF_ID && userInfo.sF_ID !== 0) firstID = userInfo.sF_ID;
    else if (userInfo?.cat_MapID && userInfo.cat_MapID !== 0) firstID = userInfo.cat_MapID;
    else if (userInfo?.asmid && userInfo.asmid !== 0) firstID = userInfo.asmid;
    else if (userInfo?.branch_ID && userInfo.branch_ID !== 0) firstID = userInfo.branch_ID;
    else if (userInfo?.userID) firstID = userInfo.userID;
  
    router.push(
      `/nsp/dashboardcall?status=${encodeURIComponent(item.complaintStatus)}&subStatus=${encodeURIComponent(
        item.complaintSubStatus
      )}&roleID=${userInfo.roleID}&firstID=${firstID}`
    );
  }; 

  return (
     <ProtectedRoute allowedRoles={['br','asm']}> 
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
