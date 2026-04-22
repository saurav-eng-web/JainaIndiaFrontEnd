"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/Datepicker";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import TimePicker from "@/components/ui/timepicker";
import {
  buildRequiredFieldsMessage,
  clearFieldError,
  validateRequiredFields,
} from "@/utils/formValidation";
import { isToday } from "@/utils/historyUtils";

const defaultVisitState = {
  engineerId: "",
  visitDate: "",
  inTime: "09:00",
  outTime: "09:01",
  visitRemarks: "",
};

function getVisitMinTime(visitDate) {
  return "09:00";
}

function getVisitMaxTime(visitDate, fallback = "21:00") {
  if (!visitDate || !isToday(visitDate)) return fallback;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [fallbackHour = "21", fallbackMinute = "00"] = fallback.split(":");
  const fallbackMinutes = Number(fallbackHour) * 60 + Number(fallbackMinute);
  const safeMinutes = Math.min(currentMinutes, fallbackMinutes);
  const nextHours = String(Math.floor(safeMinutes / 60)).padStart(2, "0");
  const nextMinutes = String(safeMinutes % 60).padStart(2, "0");

  return `${nextHours}:${nextMinutes}`;
}

function getDefaultInTime(visitDate) {
  if (!visitDate || !isToday(visitDate)) return "09:00";

  return subtractOneMinute(getVisitMaxTime(visitDate, "20:59"));
}

function getAdjustedOutTime(nextInTime, currentOutTime) {
  const minimumOutTime = addOneMinute(nextInTime);

  if (!currentOutTime || currentOutTime < minimumOutTime) {
    return minimumOutTime;
  }

  return currentOutTime;
}

function normalizeTime(value = "") {
  if (!value) return "";
  return value.split(":").slice(0, 2).join(":");
}

function addOneMinute(value = "09:00") {
  const [hours = "09", minutes = "00"] = value.split(":");
  const totalMinutes = Number(hours) * 60 + Number(minutes) + 1;
  const safeMinutes = Math.min(totalMinutes, 21 * 60);
  const nextHours = String(Math.floor(safeMinutes / 60)).padStart(2, "0");
  const nextMinutes = String(safeMinutes % 60).padStart(2, "0");
  return `${nextHours}:${nextMinutes}`;
}

function subtractOneMinute(value = "09:01") {
  const [hours = "09", minutes = "01"] = value.split(":");
  const totalMinutes = Number(hours) * 60 + Number(minutes) - 1;
  const safeMinutes = Math.max(totalMinutes, 9 * 60);
  const nextHours = String(Math.floor(safeMinutes / 60)).padStart(2, "0");
  const nextMinutes = String(safeMinutes % 60).padStart(2, "0");
  return `${nextHours}:${nextMinutes}`;
}

export default function SCAPopup({
  ticketNo,
  ticketKey,
  onClose,
  productType,
  subStatus,
  sfId,
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [scaState, setScaState] = useState({
    selectedSymptom: "",
    selectedCause: "",
    selectedAnalysis: "",
    jobAction: "",
    remarks: "",
  });

  const [initialScaData, setInitialScaData] = useState(null);
  const [initialVisitData, setInitialVisitData] = useState(null);
  const [symptomsData, setSymptomsData] = useState([]);
  const [remarkMandatory, setRemarkMandatory] = useState(false);
  const [scaErrors, setScaErrors] = useState({});
  const [visitErrors, setVisitErrors] = useState({});

  const [visitState, setVisitState] = useState(defaultVisitState);
  const [engineers, setEngineers] = useState([]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const scaOptionsRes = await axiosInstance.post("symptom-cause/process", {
          type: "GetSCA",
          payload: productType || "",
        });
        if (scaOptionsRes.data.statusCode === 200 && scaOptionsRes.data.data.length > 0) {
          const data = scaOptionsRes.data.data[0]["DataFlow"]["Symptoms"];
          setSymptomsData(data);
        }

        // 2. Fetch Existing SCA Data for the ticket
        const existingScaRes = await axiosInstance.post("symptom-cause/process", {
          type: "GetSCATicketNo",
          ticket_no: ticketNo,
        });
        if (
          existingScaRes.data.statusCode === 200 &&
          existingScaRes.data.data.length > 0
        ) {
          const data = existingScaRes.data.data[0];
          const initial = {
            selectedSymptom: data.syid,
            selectedCause: data.cid,
            selectedAnalysis: data.anid,
            jobAction: data.JD_Workdone,
            remarks: data.remarks,
          };
          setScaState(initial);
          setInitialScaData(initial);
        }

        const engRes = await axiosInstance.post(
          `Engineer/Manage`,
          { Action: "SELECT_ACTIVE_BY_SFID", Eng_SFID: sfId },
          { headers: { "Content-Type": "application/json" } }
        );
        if (engRes.data?.data) {
          setEngineers(
            engRes.data.data.map((item) => ({
              value: item.Eng_Name, //item.Eng_ID,
              label: item.Eng_Name,
            }))
          );
        }

        const visitRes = await axiosInstance.get(`visit/ticket/${ticketKey}`);
        if (visitRes.status === 200 && visitRes.data.length === 0) {
          setVisitState(defaultVisitState);
          return;
        }
        if (visitRes.status === 200) {
          const vData = visitRes?.data;
          const data = vData[vData.length - 1];
          const normalizedInTime = normalizeTime(data.vInTime) || defaultVisitState.inTime;
          const normalizedOutTime =
            normalizeTime(data.vOutTime) || getAdjustedOutTime(normalizedInTime);
          const initial = {
            engineerId: data.engName,
            visitDate: data.vDate.split("T")[0],
            inTime: normalizedInTime,
            outTime: normalizedOutTime,
            visitRemarks: data.remark,
          };
          setInitialVisitData(initial);
          setVisitState(initial);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load visit data");
      }
    }

    fetchAllData();
  }, [ticketNo, productType, sfId, ticketKey]);

  const updateScaField = (field, value) => {
    setScaErrors((prev) => clearFieldError(prev, field));
    setScaState((prev) => ({ ...prev, [field]: value }));
  };

  const updateVisitField = (field, value) => {
    setVisitErrors((prev) => clearFieldError(prev, field));
    setVisitState((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!remarkMandatory) {
      setScaErrors((prev) => clearFieldError(prev, "remarks"));
    }
  }, [remarkMandatory]);

  const validateScaStep = () => {
    const validation = validateRequiredFields([
      {
        key: "selectedSymptom",
        label: "Symptom",
        value: scaState.selectedSymptom,
        id: "sca-symptom",
      },
      {
        key: "selectedCause",
        label: "Cause",
        value: scaState.selectedCause,
        id: "sca-cause",
      },
      {
        key: "selectedAnalysis",
        label: "Analysis",
        value: scaState.selectedAnalysis,
        id: "sca-analysis",
      },
      {
        key: "jobAction",
        label: "Job Action",
        value: scaState.jobAction,
        id: "sca-job-action",
      },
      ...(remarkMandatory
        ? [
            {
              key: "remarks",
              label: "Remarks",
              value: scaState.remarks,
              id: "sca-remarks",
            },
          ]
        : []),
    ]);

    setScaErrors(validation.errors);

    if (!validation.isValid) {
      toast.error(buildRequiredFieldsMessage(validation.missingFields));
    }

    return validation.isValid;
  };

  const validateVisitStep = () => {
    const validation = validateRequiredFields([
      {
        key: "engineerId",
        label: "Engineer Name",
        value: visitState.engineerId,
        id: "visit-engineer",
      },
      {
        key: "visitDate",
        label: "Visit Date",
        value: visitState.visitDate,
        id: "visit-date",
      },
      {
        key: "inTime",
        label: "In Time",
        value: visitState.inTime,
        id: "visit-in-time",
      },
      {
        key: "outTime",
        label: "Out Time",
        value: visitState.outTime,
        id: "visit-out-time",
      },
      {
        key: "visitRemarks",
        label: "Remarks",
        value: visitState.visitRemarks,
        id: "visit-remarks",
      },
    ]);

    setVisitErrors(validation.errors);

    if (!validation.isValid) {
      toast.error(buildRequiredFieldsMessage(validation.missingFields));
      return false;
    }

    if (visitState.outTime <= visitState.inTime) {
      setVisitErrors({ outTime: "Out Time must be greater than In Time" });
      toast.error("Out Time must be greater than In Time");
      return false;
    }

    if (visitState.visitDate && isToday(visitState.visitDate)) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      if (visitState.inTime >= currentTime || visitState.outTime > currentTime) {
        setVisitErrors({
          inTime: "Today visit time must be in the past",
          outTime: "Today visit time must be in the past",
        });
        toast.error("For today, visit time must be in the past");
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateScaStep()) {
      return;
    }

    setStep(2);
  };

  const goBack = () => setStep(1);

  const handleFinalSubmit = async () => {
    if (!validateVisitStep()) {
      return;
    }

    const scaPayload = {
      type: "Insert",
      ticket_no: ticketNo,
      syid: scaState.selectedSymptom,
      cid: scaState.selectedCause,
      anid: scaState.selectedAnalysis,
      jobaction: scaState.jobAction,
      remarks: scaState.remarks,
    };

    const visitPayload = {
      TicketNo: ticketNo,
      EngName: visitState.engineerId,
      VDate: visitState.visitDate,
      VInTime: visitState.inTime,
      VOutTime: visitState.outTime,
      VStatus: subStatus,
      Remark: visitState.visitRemarks,
    };

    const scaChanged =
      !initialScaData ||
      Object.keys(scaState).some((key) => scaState[key] !== initialScaData[key]);

    const visitChanged =
      !initialVisitData ||
      Object.keys(visitState).some((key) => visitState[key] !== initialVisitData[key]);

    const submitPromise = async () => {
      setIsSubmitting(true);
      const requests = [];

      if (scaChanged) {
        requests.push(axiosInstance.post("symptom-cause/process", scaPayload));
      }

      if (visitChanged) {
        requests.push(axiosInstance.post("visit", visitPayload));
      }

      await Promise.all(requests);
      onClose?.();
    };

    try {
      await toast.promise(submitPromise(), {
        loading: "Submitting details...",
        success: "Details updated successfully!",
        error: "Failed to submit details.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalSkeleton title="Symptom Cause Analysis / Update Visit Details" size="xl">
      <div className="mx-auto mb-6 flex max-w-xl items-center gap-4">
        <StepIndicator number={1} active={step === 1}>
          SCA Details
        </StepIndicator>

        <div className="h-0.5 flex-1 bg-gray-300" />

        <StepIndicator number={2} active={step === 2}>
          Visit Details
        </StepIndicator>
      </div>

      {/* STEP CONTENT */}
      {step === 1 && (
        <>
        <SCASection
          scaState={scaState}
          updateScaField={updateScaField}
          symptomsData={symptomsData}
          remarkMandatory={remarkMandatory}
          setRemarkMandatory={setRemarkMandatory}
          scaErrors={scaErrors}
        />
          <div className="mt-10 flex justify-end">
            <Button onClick={goNext}>Next</Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <VisitDetails
            visitState={visitState}
            updateVisitField={updateVisitField}
            engineers={engineers}
            visitErrors={visitErrors}
          />
          <div className="mt-10 flex">
            <Button variant="outline" onClick={goBack}>
              Back
            </Button>
            <Button
              className="ml-auto"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </>
      )}
    </ModalSkeleton>
  );
}

function StepIndicator({ number, active, children }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${active ? "bg-[#714b67] text-white" : "bg-gray-200 text-gray-700"} `}
      >
        {number}
      </div>

      <span
        className={`text-sm font-semibold ${active ? "text-[#714b67]" : "text-gray-500"} `}
      >
        {children}
      </span>
    </div>
  );
}

function SCASection({
  scaState,
  updateScaField,
  symptomsData,
  remarkMandatory,
  setRemarkMandatory,
  scaErrors,
}) {
  const [symptoms, setSymptoms] = useState([]);
  const [cause, setCause] = useState([]);
  const [analysis, setAnalysis] = useState([]);

  useEffect(() => {
    if (symptomsData.length > 0) {
      setSymptoms(
        symptomsData.map((item) => ({
          label: item.symptom,
          value: item.syid,
          data: item.CauseList,
        }))
      );
    }
  }, [symptomsData]);

  useEffect(() => {
    if (!scaState.selectedSymptom || symptoms.length === 0) {
      setCause([]);
      setAnalysis([]);
      return;
    }

    const symptom = symptoms.find((s) => s.value === scaState.selectedSymptom);
    if (!symptom) return;

    const newCause = symptom.data.map((item) => ({
      label: item.cause,
      value: item.cid,
      data: item.AnalysisList,
    }));
    setCause(newCause);

    if (scaState.selectedCause) {
      const found = newCause.find((c) => c.value === scaState.selectedCause);
      if (found) {
        setAnalysis(
          found.data.map((item) => ({
            label: item.Aanalysis,
            value: item.anid,
          }))
        );
      } else {
        setAnalysis([]);
      }
    } else {
      setAnalysis([]);
    }
  }, [scaState.selectedSymptom, scaState.selectedCause, symptoms]);

  const changeSymptom = (value) => {
    setRemarkMandatory(false);
    updateScaField("selectedSymptom", value);
    updateScaField("selectedCause", "");
    updateScaField("selectedAnalysis", "");
  };

  const changeCause = (value) => {
    const found = cause.find((item) => item.value === value);
    const nextRemarkMandatory = found
      ? found.label.toLowerCase().includes("remarks")
      : false;

    setRemarkMandatory(nextRemarkMandatory);
    updateScaField("selectedCause", value);
    updateScaField("selectedAnalysis", "");
  };

  const changeAnalysis = (value) => {
    updateScaField("selectedAnalysis", value);
  };

  return (
    <div className="grid w-3xl grid-cols-3 items-center gap-6">
      <CustomDropdown
        id="sca-symptom"
        label="Symptom"
        value={scaState.selectedSymptom}
        onChange={changeSymptom}
        options={symptoms}
        placeholder="Select Symptom"
        required
        error={scaErrors.selectedSymptom}
      />
      <CustomDropdown
        id="sca-cause"
        label="Cause"
        value={scaState.selectedCause}
        onChange={changeCause}
        options={cause}
        placeholder="Select Cause"
        required
        error={scaErrors.selectedCause}
      />
      <CustomDropdown
        id="sca-analysis"
        label="Analysis"
        value={scaState.selectedAnalysis}
        onChange={changeAnalysis}
        options={analysis}
        placeholder="Select Analysis"
        required
        error={scaErrors.selectedAnalysis}
      />
      <InputField
        id="sca-job-action"
        label="Job Action"
        value={scaState.jobAction}
        onChange={(e) => updateScaField("jobAction", e.target.value)}
        required
        error={scaErrors.jobAction}
      />
      <InputField
        id="sca-remarks"
        label="Remarks"
        value={scaState.remarks}
        onChange={(e) => updateScaField("remarks", e.target.value)}
        required={remarkMandatory}
        error={scaErrors.remarks}
      />
    </div>
  );
}

function VisitDetails({ visitState, updateVisitField, engineers, visitErrors }) {
  const visitMinTime = getVisitMinTime(visitState.visitDate);
  const visitInMaxTime = getVisitMaxTime(visitState.visitDate, "20:59");
  const visitOutMaxTime = getVisitMaxTime(visitState.visitDate, "21:00");
  const safeInTime = visitState.inTime || getDefaultInTime(visitState.visitDate);
  const normalizedInTime =
    safeInTime < visitMinTime
      ? visitMinTime
      : safeInTime > visitInMaxTime
        ? visitInMaxTime
        : safeInTime;
  const outTimeMin = addOneMinute(normalizedInTime);
  const safeOutTime = visitState.outTime || outTimeMin;
  const normalizedOutTime =
    safeOutTime < outTimeMin
      ? outTimeMin
      : safeOutTime > visitOutMaxTime
        ? visitOutMaxTime
        : safeOutTime;

  return (
    <div className="grid min-w-3xl grid-cols-3 items-center gap-6">
      <CustomDropdown
        id="visit-engineer"
        label="Engineer Name"
        placeholder="Select Engineer"
        value={visitState.engineerId}
        onChange={(val) => updateVisitField("engineerId", val)}
        options={engineers}
        required
        error={visitErrors.engineerId}
      />

      <DatePicker
        id="visit-date"
        label="Visit Date"
        value={visitState.visitDate}
        onChange={(val) => {
          const nextInTime = getDefaultInTime(val);

          updateVisitField("visitDate", val);
          updateVisitField("inTime", nextInTime);
          updateVisitField("outTime", getAdjustedOutTime(nextInTime, visitState.outTime));
        }}
        max={"today"}
        required
        error={visitErrors.visitDate}
      />

      <InputField
        id="visit-remarks"
        label="Remarks"
        value={visitState.visitRemarks}
        onChange={(e) => updateVisitField("visitRemarks", e.target.value)}
        required
        error={visitErrors.visitRemarks}
      />

      <TimePicker
        id="visit-in-time"
        label="In Time"
        value={normalizedInTime}
        min={visitMinTime}
        max={visitInMaxTime}
        onChange={(val) => {
          updateVisitField("inTime", val);
          updateVisitField("outTime", getAdjustedOutTime(val, visitState.outTime));
        }}
        required
        error={visitErrors.inTime}
      />
      <TimePicker
        id="visit-out-time"
        label="Out Time"
        value={normalizedOutTime}
        min={outTimeMin}
        max={visitOutMaxTime}
        onChange={(val) => updateVisitField("outTime", val)}
        required
        error={visitErrors.outTime}
      />
    </div>
  );
}
