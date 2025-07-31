 'use client';
import { useRouter } from 'next/navigation'; 

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
import "../../../components/Sidebar.css"
import { useTheme } from '@/theme/ThemeContext';

export default function Dashboard() {
  const { colors } = useTheme(); 
  
  const router = useRouter();

  const allDashboardData = [
    { title: 'WIP', value: 1, Icon: MdWork, iconColor: 'text-yellow-500' },
    { title: 'Techical Approval', value: 462, Icon: MdPendingActions, iconColor: 'text-orange-500' },
        { title: "Not Assigned", value: 237, Icon: MdAssignmentLate, iconColor: "text-red-500" },
    { title: "Assigned", value: 1131, Icon: MdAssignmentTurnedIn, iconColor: "text-green-500" },
    { title: "WIP", value: 1, Icon: MdWork, iconColor: "text-yellow-500" },
    { title: "Part Pending", value: 462, Icon: MdPendingActions, iconColor: "text-orange-500" },
    { title: "Part In Transit", value: 430, Icon: MdLocalShipping, iconColor: "text-blue-500" },
    { title: "Part Received", value: 148, Icon: MdInventory, iconColor: "text-green-600" },
    { title: "Part Issued", value: 54, Icon: MdOutlineChecklist },
    { title: "Spc. Approval", value: 0, Icon: MdApproval },
    { title: "DOA Approval", value: 8, Icon: MdApproval },
    { title: "Pen >= 15 Days", value: 3751, Icon: MdWarningAmber, iconColor: "text-orange-600" },
    { title: "Cancellation", value: 52, Icon: MdCancel, iconColor: "text-red-600" },
    { title: "Other", value: 60, Icon: MdOutlineHelpOutline },
    { title: "ASC Request", value: 80, Icon: MdMailOutline },
    { title: "Request Appr.", value: 100, Icon: MdApproval },
    { title: "ASC Created", value: 0, Icon: MdOutlineChecklist },
    { title: "Request for Reallot", value: 0, Icon: MdReplayCircleFilled },
    { title: "Pend. Challans at NWH", value: "-", Icon: MdHourglassDisabled },
    { title: "Claims Rejected", value: "-", Icon: MdBlock, iconColor: "text-red-500" },
   
  ];

  const handleCardClick = (status) => {
    const encodedStatus = encodeURIComponent(status);
    router.push(`/nsp/dashboardcall?status=${encodedStatus}`);
  };
 
  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 min-h-screen bg-gray-100 p-6 ml-[60px] transition-all duration-300">
        <section className="rounded-xl shadow-md p-6 bg-blue-50">
          <h2 className="text-xl font-bold mb-6 text-left py-3 rounded-lg" style={{color:colors.primary,fontWeight:700,  padding: 10,border: `2px solid ${colors.primary}`}}>
            Dashboard Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 2xl:grid-cols-8 gap-6">
            {allDashboardData.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleCardClick(item.title)} 
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
  );
}
