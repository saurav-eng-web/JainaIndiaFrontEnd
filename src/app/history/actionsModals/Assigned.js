import { useRouter } from "next/navigation";
import { Input } from "postcss";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import TextArea from "@/components/ui/Textarea";
import { getAllowedHours, getAllowedMinutes, isToday } from "@/utils/historyUtils";

export default function AssignedPopup({
  selectedAction,
  onClose,
  detail,
  formData,
  setFormData,
  type,
}) {
  const [engineerId, setEngineerId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [customerRemark, setCustomerRemark] = useState("");
  const [engineerData, setEngineerData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callTypeOptions, setCallTypeOptions] = useState([]);
  const [talkToWhom, setTalkToWhom] = useState("");
  const router = useRouter();

  const { DOP, loggedInUserId: userId, promiseDate } = formData;
  const {
    calL_TYPE: callType,
    call_TypeID: callTypeId,
    asC_NAME: ascName,
    sf_ID: sfId,
    tickeT_NO: ticketNo,
    complainT_STATUS: complaintStatus,
    complaint_SubStatus: complaintSubStatus,
    product,
    tickeT_KEY: ticketKey,
  } = detail;

  const [updatedDOP, setUpdatedDOP] = useState(DOP);
  const [selectedCallType, setSelectedCallType] = useState(callType);

  const todayStr = new Date().toISOString().split("T")[0];

  const hourOptions = getAllowedHours(appointmentDate).map((h) => ({
    value: h,
    label: h.toString(),
  }));

  const minuteOptions = getAllowedMinutes(
    formData.appointmentDate,
    formData.appointmentHour
  ).map((m) => ({
    value: m,
    label: m.toString(),
  }));

  useEffect(() => {
    async function fetchEngineerData() {
      try {
        const res = await axiosInstance.post(
          `Engineer/Manage`,
          {
            Action: "SELECT_ACTIVE_BY_SFID",
            Eng_SFID: sfId,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        const data = res.data.data;
        setEngineerData(
          data.map((item) => ({
            value: item.Eng_ID,
            label: item.Eng_Name,
          }))
        );
      } catch (err) {
        console.error("Error fetching engineer data:", err);
      }
    }
    fetchEngineerData();
  }, [sfId]);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await axiosInstance.post("DropdownMaster/GetDropdown", {
          type: "CallType",
          dispatchType: product,
        });
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          setCallTypeOptions(
            res.data.data.map((item) => ({ label: item.value, value: item.value }))
          );
        }
      } catch (error) {
        // toast.error("Failed to fetch data");
        console.error("Failed to fetch call type:", error);
      }
    }

    fetch();
  }, [product]);

  async function handleSubmit() {
    if (
      !appointmentDate ||
      !hour ||
      !minute ||
      !engineerId ||
      !customerRemark ||
      !contactPerson ||
      !talkToWhom
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    const payload = {
      type: type === "Assigned" ? "assigned" : "Re-Allot", //
      ticket_no: ticketNo,
      complaintStatus,
      complaintSubStatus,
      data: [
        {
          apptDate: appointmentDate,
          apptTime: `${hour}:${minute}:00`,
          dop: DOP.split("T")[0],
          reallot: "",
          contactPerson,
          customerRemark,
          engId: engineerId,
          callTypeId: callTypeId.toString(),
          callType: selectedCallType,
          product,
        },
      ],
    };

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("sflevel1/process", payload);

      if (res.data.statusCode === 200 && res.data?.data?.length > 0) {
        await submitCallSchedule();
        toast.success(`Call ${type} successfully`);
        router.back();
      }
    } catch (error) {
      console.error("Error submitting assigned data:", error);
      toast.error("Failed to submit data");
    } finally {
      setIsSubmitting(false);
    }
  }

  console.log("details: ", { formData, detail });

  async function submitCallSchedule() {
    const callSchedulePayload = {
      sfId: formData.sf_ID,
      engId: engineerId,
      appointmentDate: appointmentDate,
      appointmentTime: `${hour}:${minute}:00`,
      talkToWhomeAllot: talkToWhom, // ,
      ticketNo: ticketNo,
      ticketKey,
      status: 1,
      apptDateandTime: new Date().toISOString(),
    };

    try {
      await axiosInstance.post("/CallSchedule/create", callSchedulePayload);
    } catch (error) {
      console.error("Unable to submit call schedule", error);
    }
  }

  return (
    <ModalSkeleton
      title={type === "Assigned" ? "Assign " : "Re-Allot "}
      rolesAllowed={["sf/ssd"]}
    >
      <div className="grid grid-cols-3 gap-6">
        <InputField label="Complaint No" value={detail.tickeT_NO || "-"} disabled />
        <InputField
          label="Promise Date"
          value={promiseDate.split("T")[0] || "-"}
          disabled
        />
        <InputField label="ASC Name" value={ascName || "-"} disabled />

        <TextArea
          label="Address"
          value={[detail?.addresS1, detail?.addresS2, detail?.addresS3]
            .filter(Boolean)
            .join(", ")}
          disabled
          size="sm"
        />

        {/* {type === "Assigned" && (  */}
        <>
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              DOP <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="date"
              disabled={type !== "Assigned"}
              className="rounded-md border px-3 py-2"
              value={updatedDOP.split("T")[0]}
              onChange={(e) => {
                setUpdatedDOP(e.target.value);
                setHour("");
                setMinute("");
              }}
              max={todayStr}
            />
          </div>
          <CustomDropdown
            label="Call Type"
            placeholder="Select Call Type"
            value={selectedCallType}
            onChange={(val) => setSelectedCallType(val)}
            options={callTypeOptions}
            required
            disabled={type !== "Assigned"}
          />
        </>
        {/* )} */}
      </div>
      <div className="mt-10 grid grid-cols-3 gap-6">
        {/* Appointment Date */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Appointment Date<span className="ml-1 text-red-500">*</span>
          </label>
          <input
            type="date"
            className="rounded-md border px-3 py-2"
            value={appointmentDate}
            onChange={(e) => {
              setAppointmentDate(e.target.value);
              // Reset time when date changes (handled by parent logic usually, but here just updating state)
              setHour("");
              setMinute("");
            }}
            min={todayStr}
            max={new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split("T")[0]}
          />
        </div>

        {/* Hour */}
        <CustomDropdown
          label="Hour"
          placeholder="--Hour--"
          value={hour}
          onChange={(val) => setHour(val)} // Assuming CustomDropdown returns value
          options={hourOptions}
          required={true}
        />

        {/* Minute */}
        <CustomDropdown
          label="Minute"
          placeholder="--Minute--"
          value={minute}
          onChange={(val) => setMinute(val)}
          options={minuteOptions}
          required={true}
        />

        {/* Engineer Name */}

        <InputField
          label="Contact Person"
          value={detail?.contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          required
        />

        {/* Address + Remark */}
        <InputField
          label="Customer Remark"
          value={customerRemark}
          onChange={(e) => setCustomerRemark(e.target.value)}
          required
        />

        <InputField
          label="Talk To Whom"
          value={talkToWhom}
          onChange={(e) => setTalkToWhom(e.target.value)}
          required
        />

        <CustomDropdown
          label="Engineer Name"
          placeholder="Select Engineer"
          value={engineerId}
          onChange={(val) => setEngineerId(val)}
          options={engineerData}
          required
        />
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-end gap-4">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </ModalSkeleton>
  );
}
