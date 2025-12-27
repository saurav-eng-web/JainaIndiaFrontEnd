"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useDispatch, useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import SideBar from "@/components/SideBar";
import DashboardCard from "@/components/DashboardCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useTheme } from "@/theme/ThemeContext";
import { encodeRouteData } from "@/utils/secureRoute";
import { hideLoader, showLoader } from "@/redux/slices/loaderSlice";
import Loader from "@/components/common/LoaderComponent";
// import "../../../components/Sidebar.css";

export default function Dashboard() {
  const { colors } = useTheme();
  const userInfo = useSelector((state) => state.auth?.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const [dashboardData, setDashboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 👇 Map bucket names → icons
  const iconMap = {
    "Not Assigned": { Icon: MdAssignmentLate, iconColor: "text-red-500" },
    Assigned: { Icon: MdAssignmentTurnedIn, iconColor: "text-green-500" },
    WIP: { Icon: MdWork, iconColor: "text-yellow-500" },
    "Part Pending": { Icon: MdPendingActions, iconColor: "text-orange-500" },
    "Part In Transit": { Icon: MdLocalShipping, iconColor: "text-blue-500" },
    "Part Received": { Icon: MdInventory, iconColor: "text-green-600" },
    "Part Issued": { Icon: MdOutlineChecklist },
    "Spc. Approval": { Icon: MdApproval },
    "DOA Approval": { Icon: MdApproval },
    "Pen >= 15 Days": { Icon: MdWarningAmber, iconColor: "text-orange-600" },
    Cancellation: { Icon: MdCancel, iconColor: "text-red-600" },
    Other: { Icon: MdOutlineHelpOutline },
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
      // dispatch(showLoader());
      setIsLoading(true);
      try {
        // ---------------------------
        //  Resolve FirstID
        // ---------------------------
        const firstID =
          userInfo.sF_ID ||
          userInfo.cat_MapID ||
          userInfo.asmid ||
          userInfo.branch_ID ||
          userInfo.userID;

        const roleID = userInfo.roleID;

        const [roleRes, aggRes] = await Promise.all([
          axiosInstance.get(`/DashboardBucket/role/${roleID}`),
          axiosInstance.get(`/DashboardBucket/aggregation/${firstID}/${roleID}`),
        ]);

        const roleBuckets = roleRes.data || [];
        const aggregation = aggRes.data || [];

        // ---------------------------
        //  Build countMap (keyed by: status::substatus)
        // ---------------------------
        const countMap = {};
        for (const item of aggregation) {
          const key = `${item.complaintStatus}::${item.complaintSubStatus}`;
          countMap[key] = item.count ?? 0;
        }

        // ---------------------------
        //  Format dashboard cards
        // ---------------------------
        const formatted = roleBuckets.map((bucket) => {
          const {
            id,
            bucket: title,
            complaintStatus,
            complaintSubStatus,
            cnt,
            navigatingUrl,
          } = bucket;

          const key = `${complaintStatus}::${complaintSubStatus}`;
          const count = countMap[key] ?? 0;

          const mapItem = iconMap[title] || { Icon: MdOutlineHelpOutline };

          return {
            id,
            title,
            value: count,
            complaintStatus,
            complaintSubStatus,
            Icon: mapItem.Icon,
            iconColor: mapItem.iconColor,
            order: cnt,
            url: navigatingUrl,
          };
        });

        const sorted = formatted.sort((a, b) => a.order - b.order);

        setDashboardData(sorted);
      } catch (error) {
        console.error(
          "Error fetching dashboard data:",
          error.response?.status,
          error.response?.data
        );
      } finally {
        // dispatch(hideLoader());
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userInfo]);

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     if (!userInfo?.roleID) return;

  //     try {
  //       let firstID = 0;

  //       if (userInfo?.sF_ID && userInfo.sF_ID !== 0) firstID = userInfo.sF_ID;
  //       else if (userInfo?.cat_MapID && userInfo.cat_MapID !== 0)
  //         firstID = userInfo.cat_MapID;
  //       else if (userInfo?.asmid && userInfo.asmid !== 0) firstID = userInfo.asmid;
  //       else if (userInfo?.branch_ID && userInfo.branch_ID !== 0)
  //         firstID = userInfo.branch_ID;
  //       else if (userInfo?.userID) firstID = userInfo.userID;

  //       const roleID = userInfo.roleID;
  //       console.log("🔴firstID used →", firstID);

  //       const [roleRes, aggRes] = await Promise.all([
  //         axiosInstance.get(`/DashboardBucket/role/${roleID}`),
  //         axiosInstance.get(`/DashboardBucket/aggregation/${firstID}/${roleID}`),
  //       ]);

  //       console.log("res: ", { roleRes, aggRes });
  //       const countMap = {};
  //       aggRes.data.forEach((item) => {
  //         countMap[item.complaintSubStatus] = item.count;
  //       });
  //       console.log("countMap: ", countMap);
  //       const formattedData = roleRes.data.map((item) => {
  //         const mapItem = iconMap[item.bucket] || { Icon: MdOutlineHelpOutline };
  //         // console.log("maptItem: ", mapItem);
  //         return {
  //           id: item.id,
  //           title: item.bucket,
  //           value: countMap[item.complaintSubStatus] ?? 0,
  //           complaintStatus: item.complaintStatus,
  //           complaintSubStatus: item.complaintSubStatus,
  //           Icon: mapItem.Icon,
  //           iconColor: mapItem.iconColor,
  //         };
  //       });
  //       console.log("data: ", {
  //         countMap,
  //         formattedData,
  //       });

  //       setDashboardData(formattedData);
  //     } catch (error) {
  //       console.error(
  //         "Error fetching dashboard data:",
  //         error.response?.status,
  //         error.response?.data
  //       );
  //     }
  //   };

  //   fetchDashboardData();
  // }, [userInfo]);

  const handleCardClick = (item) => {
    console.log("url: ", item.url);
    if (item.url) {
      router.push(`/${item.url}`);
      return;
    }
    const getFirstID = (userInfo) => {
      return (
        userInfo?.sF_ID ||
        userInfo?.cat_MapID ||
        userInfo?.asmid ||
        userInfo?.branch_ID ||
        userInfo?.userID ||
        0
      );
    };

    const payload = {
      status: item.complaintStatus,
      subStatus: item.complaintSubStatus,
      roleID: userInfo.roleID,
      firstID: getFirstID(userInfo),
    };

    const encoded = encodeRouteData(payload);

    router.push(`/nsp/dashboardcall?d=${encoded}`);
  };

  return (
    <ProtectedRoute allowedRoles={["br", "asm", "zone", "sf/ssd"]}>
      <div className="flex">
        <SideBar />
        <main className="ml-[60px] min-h-screen flex-1 bg-gray-100 p-6 transition-all duration-300">
          <section className="rounded-xl bg-blue-50 p-6 shadow-md">
            <h2
              className="mb-6 rounded-lg py-3 text-left text-xl font-bold"
              style={{
                color: colors.primary,
                fontWeight: 700,
                padding: 10,
                border: `2px solid ${colors.primary}`,
              }}
            >
              Dashboard Overview
            </h2>
            {isLoading && (
              <div className="mt-20 flex h-full w-full items-center justify-center">
                <Loader />
              </div>
            )}

            <div className="grid min-h-[180px] grid-cols-[repeat(auto-fill,minmax(150px,1fr))] items-center gap-6 sm:gap-4">
              {dashboardData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className="flex cursor-pointer items-center justify-center"
                >
                  <DashboardCard {...item} />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
