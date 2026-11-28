"use client";

import ChallanOverview from "@/components/logistic/ChallanOverview";

// ASC (SF/SSD): only the logged in ASC's own challans
export default function AscChallanOverviewPage() {
  return (
    <ChallanOverview
      title="Challan/Docket Overview"
      rolesAllowed={["sf/ssd"]}
      reverseEndpoint="AscReverseDashboard/process"
      forwardEndpoint="AscForwardDashboard/process"
    />
  );
}
