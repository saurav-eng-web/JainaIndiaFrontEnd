"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import ReverseChallanBoard from "@/components/logistic/ReverseChallanBoard";

const ENDPOINT = "BranchReverseDashboard/process";

export default function ReverseChallanOverviewPage() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // nothing is requested without a login (PageSkeleton redirects to the login page)
    if (!localStorage.getItem("userData")) return;

    async function fetchSummary() {
      try {
        const res = await axiosInstance.post(ENDPOINT, { type: "summary" });
        setSummary(res.data?.data ?? null);
      } catch (error) {
        toast.error("Failed to load reverse challan overview");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, []);

  // The API returns only the logged in user's branch
  return (
    <PageSkeleton title="Reverse Challan Overview" rolesAllowed={["br"]}>
      <ReverseChallanBoard summary={summary} isLoading={isLoading} endpoint={ENDPOINT} />
    </PageSkeleton>
  );
}
