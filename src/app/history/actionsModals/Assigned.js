import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/customui/button";
import DatePicker from "@/components/customui/Datepicker";
import InputField from "@/components/customui/InputWithLabel";
import ModalSkeleton from "@/components/customui/ModalSkeleton";
import TextArea from "@/components/customui/Textarea";
import TimePicker from "@/components/customui/timepicker";
import {
  buildRequiredFieldsMessage,
  clearFieldError,
  validateRequiredFields,
} from "@/utils/formValidation";
import { getNearestValidMinute, isToday } from "@/utils/historyUtils";

export default function AssignedPopup({ detail, formData, type }) {
  const [engineerId, setEngineerId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [appointmentTime, setAppointmentTime] = useState(getMinTime());
  const [customerRemark, setCustomerRemark] = useState("");
  const [engineerData, setEngineerData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callTypeOptions, setCallTypeOptions] = useState([]);
  const [talkToWhom, setTalkToWhom] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const router = useRouter();

  const { DOP, promiseDate } = formData;
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

  function getMinTime() {
    if (!appointmentDate) return "09:00";
    if (!isToday(appointmentDate)) return "09:00";

    const now = new Date();
    const nextHour = now.getHours() + 1;
    const nearestMinute = getNearestValidMinute(now.getMinutes());
    const safeMinute = nearestMinute === null ? 0 : nearestMinute;
    const clampedHour = Math.max(9, nextHour);
    return `${String(clampedHour).padStart(2, "0")}:${String(safeMinute).padStart(
      2,
      "0"
    )}`;
  }

  useEffect(() => {
    setContactPerson(detail?.contactPerson || "");
  }, [detail?.contactPerson]);

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

  function handleFieldChange(fieldKey, setter) {
    return (valueOrEvent) => {
      setValidationErrors((prev) => clearFieldError(prev, fieldKey));

      if (valueOrEvent?.target) {
        setter(valueOrEvent.target.value);
        return;
      }

      setter(valueOrEvent);
    };
  }

  function validateForm() {
    const validation = validateRequiredFields([
      {
        key: "appointmentDate",
        label: "Appointment Date",
        value: appointmentDate,
        id: "appointment-date",
      },
      {
        key: "appointmentTime",
        label: "Time",
        value: appointmentTime,
        id: "appointment-time",
      },
      {
        key: "engineerId",
        label: "Engineer Name",
        value: engineerId,
        id: "engineer-name",
      },
      {
        key: "contactPerson",
        label: "Contact Person",
        value: contactPerson,
        id: "contact-person",
      },
      {
        key: "customerRemark",
        label: "Customer Remark",
        value: customerRemark,
        id: "customer-remark",
      },
      {
        key: "talkToWhom",
        label: "Talk To Whom",
        value: talkToWhom,
        id: "talk-to-whom",
      },
    ]);

    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      toast.error(buildRequiredFieldsMessage(validation.missingFields));
    }

    return validation.isValid;
  }

  async function handleSubmit() {
    if (!validateForm()) {
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
          apptTime: `${appointmentTime}:00`,
          dop: updatedDOP.split("T")[0] || DOP.split("T")[0],
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

  async function submitCallSchedule() {
    const callSchedulePayload = {
      sfId: formData.sf_ID,
      engId: engineerId,
      appointmentDate: appointmentDate,
      appointmentTime: `${appointmentTime}:00`,
      talkToWhomeAllot: talkToWhom, // ,
      ticketNo: ticketNo,
      ticketKey,
      status: 1,
      apptDateandTime: new Date().toISOString(),
    };

    try {
      await axiosInstance.post("CallSchedule/create", callSchedulePayload);
    } catch (error) {
      console.error("Unable to submit call schedule", error);
    }
  }

  return (
    <ModalSkeleton
      title={type === "Assigned" ? "Assign " : "Re-Allot "}
      rolesAllowed={["sf/ssd"]}
      size="xl"
    >
      <div className="grid min-w-4xl grid-cols-3 gap-6">
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
          <DatePicker
            label="DOP"
            value={updatedDOP.split("T")[0]}
            onChange={(val) => {
              console.log("selected DOP", val);
              setUpdatedDOP(val);
            }}
            max={todayStr}
            disabled={complaintSubStatus === "WIP" ? true : false}
            required
          />
          <CustomDropdown
            label="Call Type"
            placeholder="Select Call Type"
            value={selectedCallType}
            onChange={(val) => setSelectedCallType(val)}
            options={callTypeOptions}
            required
            disabled={complaintSubStatus === "WIP" ? true : false}
          />
        </>
        {/* )} */}
      </div>
      <div className="mt-10 grid grid-cols-3 gap-6">
        {/* Appointment Date */}
        <DatePicker
          id="appointment-date"
          label="Appointment Date"
          value={appointmentDate}
          onChange={handleFieldChange("appointmentDate", (val) => {
            setAppointmentDate(val);
            setAppointmentTime(getMinTime());
          })}
          min={todayStr}
          max={new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split("T")[0]}
          required
          error={validationErrors.appointmentDate}
        />

        {/* Hour */}
        {/* <CustomDropdown
          label="Hour"
          placeholder="--Hour--"
          value={hour}
          onChange={(val) => setHour(val)} 
          options={hourOptions}
          required={true}
        />

       
        <CustomDropdown
          label="Minute"
          placeholder="--Minute--"
          value={minute}
          onChange={(val) => setMinute(val)}
          options={minuteOptions}
          required={true}
        /> */}

        <TimePicker
          id="appointment-time"
          label="Time"
          value={appointmentTime}
          min={getMinTime()}
          max="20:00"
          minuteStep={15}
          onChange={handleFieldChange("appointmentTime", setAppointmentTime)}
          required
          error={validationErrors.appointmentTime}
        />

        <CustomDropdown
          id="engineer-name"
          label="Engineer Name"
          placeholder="Select Engineer"
          value={engineerId}
          onChange={handleFieldChange("engineerId", setEngineerId)}
          options={engineerData}
          required
          error={validationErrors.engineerId}
        />

        {/* Engineer Name */}

        <InputField
          id="contact-person"
          label="Contact Person"
          value={contactPerson}
          onChange={handleFieldChange("contactPerson", setContactPerson)}
          required
          error={validationErrors.contactPerson}
        />

        {/* Address + Remark */}
        <InputField
          id="customer-remark"
          label="Customer Remark"
          value={customerRemark}
          onChange={handleFieldChange("customerRemark", setCustomerRemark)}
          required
          error={validationErrors.customerRemark}
        />

        <InputField
          id="talk-to-whom"
          label="Talk To Whom"
          value={talkToWhom}
          onChange={handleFieldChange("talkToWhom", setTalkToWhom)}
          required
          error={validationErrors.talkToWhom}
        />
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </ModalSkeleton>
  );
}
