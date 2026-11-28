"use client";

import ChallanOverview from "@/components/logistic/ChallanOverview";

// BR: all ASCs of the logged in user's branch
export default function BranchChallanOverviewPage() {
  return (
    <ChallanOverview
      title="Challan/Docket Overview"
      rolesAllowed={["br"]}
      reverseEndpoint="BranchReverseDashboard/process"
      forwardEndpoint="BranchForwardDashboard/process"
    />
  );
}
