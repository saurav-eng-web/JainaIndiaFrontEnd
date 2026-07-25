"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Loader from "@/components/common/LoaderComponent";
import DashboardCard from "@/components/DashboardCard";
import SideBar from "@/components/SideBar";
import { hideLoader, showLoader } from "@/redux/slices/loaderSlice";
import { useTheme } from "@/theme/ThemeContext";
import { encodeRouteData } from "@/utils/secureRoute";
// import "../../../components/Sidebar.css";

// Some buckets have a dedicated count API instead of using the shared
// DashboardBucket/aggregation numbers. Keys are the bucket title returned by
// DashboardBucket/role, lowercased (aliases allowed). Each fetcher resolves to
// a number, or null to fall back to the aggregation count.
async function fetchRejectedClaimCount(firstID) {
  const res = await axiosInstance.post("claim-process-v1/process", {
    type: "ClaimDashboardCount",
    sfid: firstID,
  });

  if (res.data?.statusCode !== 200) return null;
  return res.data?.data?.[0]?.RejectClaimCount ?? null;
}

const CUSTOM_COUNT_FETCHERS = {
  "claims rejected": fetchRejectedClaimCount,
  "rejected claim calls": fetchRejectedClaimCount,
};

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

        // ---------------------------
        //  Override counts that come from a dedicated API
        // ---------------------------
        const withCustomCounts = await Promise.all(
          formatted.map(async (card) => {
            const fetcher = CUSTOM_COUNT_FETCHERS[card.title?.trim().toLowerCase()];
            if (!fetcher) return card;

            try {
              const count = await fetcher(firstID);
              return count === null ? card : { ...card, value: count };
            } catch (err) {
              // Keep the aggregation count so one failing endpoint
              // cannot blank out the whole dashboard.
              console.error(`Count API failed for "${card.title}":`, err);
              return card;
            }
          })
        );

        const sorted = withCustomCounts.sort((a, b) => a.order - b.order);

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

  const handleCardClick = (item) => {
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
    console.log("paydload dashboard: ", payload);

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
