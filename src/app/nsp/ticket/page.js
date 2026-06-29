"use client";

import { useEffect, useState } from "react";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";

const toDropdownOptions = (data) =>
  Array.isArray(data)
    ? data.map((item) => ({
        label: String(item.label ?? item.value ?? item.key ?? ""),
        value: item.key ?? item.value ?? "",
      }))
    : [];

export default function Page() {
  const [complaints, setComplaints] = useState([]);
  const [issueList, setIssueList] = useState([]);
  const [assignToList, setAssignToList] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [userId, setUserId] = useState(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      console.log("user: ", user);
      setUserId(user.userID ?? null);
    } catch (error) {
      console.error("Error parsing userData from localStorage", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchDropdownData() {
      if (!userId) return;

      try {
        const [complaintRes, issueRes, assignRes] = await Promise.all([
          axiosInstance.post("/DropdownMaster/GetDropdown", {
            type: "callno",
            dispatchType: String(userId),
          }),
          axiosInstance.post("/DropdownMaster/GetDropdown", {
            type: "getproblem",
          }),
          axiosInstance.post("/DropdownMaster/GetDropdown", {
            type: "getassignedto",
          }),
        ]);

        if (!isMounted) return;

        setComplaints(toDropdownOptions(complaintRes.data?.data));
        setIssueList(toDropdownOptions(issueRes.data?.data));
        setAssignToList(toDropdownOptions(assignRes.data?.data));
      } catch (error) {
        console.error("Unable to load ticket dropdowns", error);
        if (!isMounted) return;

        setComplaints([]);
        setIssueList([]);
        setAssignToList([]);
      }
    }

    fetchDropdownData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  async function submitRequest() {
    // {
    // "type": "InsertTicket",
    // "ProblemName": "Invalid Serial Error",
    // "RaisedByUserID": 48693,
    // "RaisedByUserName": "DLS3NSP-001",
    // "AssignTo": "ASSIGNED-HOuser",
    // "ComplaintNo": "GJSL2602241192465",
    // "Remarks": "Serial number not recognized by system for this model type."

    const payload = {
      type: "InsertTicket",
      ProblemName: selectedIssue,
      RaisedByUserID: userId,

      AssignTo: selectedAssignee,
      ImageURLs: "", //  imageurl, after uploading the images
      ComplaintNo: selectedComplaint,

      Remarks: remarks,
    };
    const res = await axiosInstance.post("Ticket/process", payload);
  }

  return (
    <PageSkeleton title="Ticket Portal" rolesAllowed={["BR", "NSP"]}>
      <Subheading title="Raise Ticket" marginTop={8} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CustomDropdown
          options={complaints}
          value={selectedComplaint}
          label="Select Complaints"
          onChange={setSelectedComplaint}
          placeholder="----Select----"
        />
        <CustomDropdown
          options={issueList}
          value={selectedIssue}
          label="Select Issue"
          onChange={setSelectedIssue}
          placeholder="----Select----"
        />
        <CustomDropdown
          options={assignToList}
          value={selectedAssignee}
          label="Assign To"
          onChange={setSelectedAssignee}
          placeholder="----Select----"
        />

        <InputField
          label="Remarks"
          value={remarks}
          onChange={(e) => {
            setRemarks(e.target.value);
          }}
          placeholder="Enter Remarks"
          required
          onEnterKeyPressed={() => {}}
        />
      </div>
      <Button className="mt-6 ml-auto w-32">Raise Ticket</Button>
      <Subheading title="Ticket Details" marginTop={8} />
      <div>get tickets</div>
    </PageSkeleton>
  );
}
