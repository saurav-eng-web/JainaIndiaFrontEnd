"use client";

import { useEffect, useState } from "react";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/ui/PageSkeleton";
import Subheading from "@/components/ui/Subheading";

export default function Page() {
  const [complaints, setComplaints] = useState("");
  const [issueList, setIssueList] = useState("");
  const [assignToList, setAssignToList] = useState("");
  const [userId, setUserId] = useState(async () => {
    const obj = localStorage.getItem("userData");
    const parsed = await JSON.parse(obj);
    console.log("obj: ", { test: parsed.userID, obj });
    return parsed.userID;
  });

  useEffect(() => {
    async function fetchDropdownData() {
      console.log("userID: ", userId);
      if (!userId) return;
      // test
      const [complaintRes, issueRes, assignRes] = await Promise.all([
        axiosInstance.post("/DropdownMaster/GetDropdown", {
          type: "callno",
          dispatchType: userId,
        }),
        axiosInstance.post("/DropdownMaster/GetDropdown", {
          type: "getproblem",
        }),
        axiosInstance.post("/DropdownMaster/GetDropdown", {
          type: "getassignedto",
        }),
      ]);

      setComplaints(complaintRes.data?.data);
      setIssueList(issueRes.data?.data);
      setAssignToList(assignRes.data?.data);
    }

    fetchDropdownData();
  }, [userId]);

  return (
    <PageSkeleton title="Ticket Portal" rolesAllowed={["BR", "NSP"]}>
      <Subheading title="Raise Ticket" marginTop={8} />
      <div>create ticket section</div>
      <Subheading title="Ticket Details" marginTop={8} />
      <div>get tickets</div>
    </PageSkeleton>
  );
}
