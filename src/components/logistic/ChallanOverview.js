"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import ForwardChallanSection from "@/components/logistic/ForwardChallanSection";
import ReverseChallanBoard from "@/components/logistic/ReverseChallanBoard";

/**
 * "Reverse Challan/Docket" + "Forward Challan/Docket" page of a role (BR, ASC).
 * The role's APIs decide whose data is returned; it is taken from the login token, not from this page.
 */
export default function ChallanOverview({ title, rolesAllowed, reverseEndpoint, forwardEndpoint }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // nothing is requested without a login (PageSkeleton redirects to the login page)
    if (!localStorage.getItem("userData")) return;

    async function fetchSummary() {
      try {
        const res = await axiosInstance.post(reverseEndpoint, { type: "summary" });
        setSummary(res.data?.data ?? null);
      } catch (error) {
        toast.error("Failed to load challan/docket overview");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, [reverseEndpoint]);

  return (
    <PageSkeleton title={title} rolesAllowed={rolesAllowed}>
      <ReverseChallanBoard summary={summary} isLoading={isLoading} endpoint={reverseEndpoint} />

      <div className="mt-6">
        <ForwardChallanSection endpoint={forwardEndpoint} />
      </div>
    </PageSkeleton>
  );
}
