"use client";

import { useEffect, useState } from "react";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import PageSkeleton from "@/components/ui/PageSkeleton";
import Subheading from "@/components/ui/Subheading";

//  const [complaintRes, issueRes, assignRes] = await Promise.all([
//    axiosInstance.post("/DropdownMaster/GetDropdown", {
//      type: "callno",
//      dispatchType: userId,
//    }),
//    axiosInstance.post("/DropdownMaster/GetDropdown", {
//      type: "getproblem",
//    }),
//    axiosInstance.post("/DropdownMaster/GetDropdown", {
//      type: "getassignedto",
//    }),
//  ]);

const toDropdownOptions = (data) =>
  Array.isArray(data)
    ? data.map((item) => ({
        label: String(item.label ?? item.value ?? item.key ?? ""),
        value: item.key ?? item.value ?? "",
      }))
    : [];

export default function Page() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      setUserId(user.userID ?? null);
    } catch (error) {
      console.error("Error parsing userData from localStorage", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchComplaints() {
      if (!userId) return;

      try {
        const response = await axiosInstance.post("/DropdownMaster/GetDropdown", {
          type: "callno",
          dispatchType: String(userId),
        });

        if (isMounted) {
          setComplaints(toDropdownOptions(response.data?.data));
        }
      } catch (error) {
        console.error("Unable to load complaint numbers", error);
        if (isMounted) setComplaints([]);
      }
    }

    fetchComplaints();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return (
    <PageSkeleton title="Ticket Portal" rolesAllowed={["BR", "NSP"]}>
      <Subheading title="Raise Ticket" marginTop={8} />
      <div className="flex gap-6">
        <div>
          <label htmlFor="callBy" className="mb-2 pl-2 text-sm font-medium text-gray-800">
            Select Complaints
          </label>

          <CustomDropdown
            options={complaints}
            value={selectedComplaint}
            onChange={setSelectedComplaint}
            placeholder="----Select----"
          />
        </div>
        <div>
          <label htmlFor="callBy" className="mb-2 pl-2 text-sm font-medium text-gray-800">
            Select Issue
          </label>

          <CustomDropdown
            options={complaints}
            value={selectedComplaint}
            onChange={setSelectedComplaint}
            placeholder="----Select----"
          />
        </div>
        <div>
          <label htmlFor="callBy" className="mb-2 pl-2 text-sm font-medium text-gray-800">
            Assign to
          </label>

          <CustomDropdown
            options={complaints}
            value={selectedComplaint}
            onChange={setSelectedComplaint}
            placeholder="----Select----"
          />
        </div>
      </div>
      <Subheading title="Ticket Details" marginTop={8} />
      <div>get tickets</div>
    </PageSkeleton>
  );
}
