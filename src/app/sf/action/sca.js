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

  const [visitState, setVisitState] = useState({
    engineerId: "",
    visitDate: "",
    inTime: "09:00",
    outTime: "",
    visitRemarks: "",
  });
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
        if (visitRes.status === 200) {
          const vData = visitRes?.data;
          const data = vData[vData.length - 1];
          const initial = {
            engineerId: data.engName,
            visitDate: data.vDate.split("T")[0],
            inTime: data.vInTime,
            outTime: data.vOutTime,
            visitRemarks: data.remark,
          };
          setInitialVisitData(initial);
          setVisitState(initial);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load component data");
      }
    }

    fetchAllData();
  }, [ticketNo, productType, sfId, ticketKey]);

  const goNext = () => {
    // Validation for Step 1
    if (
      !scaState.selectedSymptom ||
      !scaState.selectedCause ||
      !scaState.selectedAnalysis ||
      !scaState.jobAction
    ) {
      return toast.error("Please select all SCA fields!");
    }
    if (!scaState.jobAction) {
      return toast.error("Please fill job action!");
    }
    if (remarkMandatory && !scaState.remarks) {
      return toast.error("Please fill remarks!");
    }
    setStep(2);
  };

  const goBack = () => setStep(1);

  const handleFinalSubmit = async () => {
    if (
      !visitState.engineerId ||
      !visitState.visitDate ||
      !visitState.inTime ||
      !visitState.outTime ||
      !visitState.visitRemarks
    ) {
      return toast.error("Please fill all visit details!");
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

    toast.promise(submitPromise(), {
      loading: "Submitting details...",
      success: "Details updated successfully!",
      error: "Failed to submit details.",
    });
  };

  return (
    <ModalSkeleton title="Symptom Cause Analysis / Update Visit Details" size="xl">
      <div className="mx-auto mb-6 flex w-xl items-center gap-4">
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
            setScaState={setScaState}
            symptomsData={symptomsData}
            remarkMandatory={remarkMandatory}
            setRemarkMandatory={setRemarkMandatory}
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
            setVisitState={setVisitState}
            engineers={engineers}
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
  setScaState,
  symptomsData,
  remarkMandatory,
  setRemarkMandatory,
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
    setScaState((prev) => ({
      ...prev,
      selectedSymptom: value,
      selectedCause: "",
      selectedAnalysis: "",
    }));
  };

  const changeCause = (value) => {
    const found = cause.find((item) => item.value === value);
    if (found) {
      setRemarkMandatory(found.label.toLowerCase().includes("remarks"));
    }
    setScaState((prev) => ({
      ...prev,
      selectedCause: value,
      selectedAnalysis: "",
    }));
  };

  const changeAnalysis = (value) => {
    setScaState((prev) => ({ ...prev, selectedAnalysis: value }));
  };

  return (
    <div className="grid min-w-3xl grid-cols-3 items-center gap-6">
      <CustomDropdown
        label="Symptom"
        value={scaState.selectedSymptom}
        onChange={changeSymptom}
        options={symptoms}
        placeholder="Select Symptom"
        required
      />
      <CustomDropdown
        label="Cause"
        value={scaState.selectedCause}
        onChange={changeCause}
        options={cause}
        placeholder="Select Cause"
        required
      />
      <CustomDropdown
        label="Analysis"
        value={scaState.selectedAnalysis}
        onChange={changeAnalysis}
        options={analysis}
        placeholder="Select Analysis"
        required
      />
      <InputField
        label="Job Action"
        value={scaState.jobAction}
        onChange={(e) => setScaState((prev) => ({ ...prev, jobAction: e.target.value }))}
        required
      />
      <InputField
        label="Remarks"
        value={scaState.remarks}
        onChange={(e) => setScaState((prev) => ({ ...prev, remarks: e.target.value }))}
        required={remarkMandatory}
      />
    </div>
  );
}

function VisitDetails({ visitState, setVisitState, engineers }) {
  return (
    <div className="grid min-w-3xl grid-cols-3 items-center gap-6">
      <CustomDropdown
        label="Engineer Name"
        placeholder="Select Engineer"
        value={visitState.engineerId}
        onChange={(val) => setVisitState((prev) => ({ ...prev, engineerId: val }))}
        options={engineers}
        required
      />

      <DatePicker
        label="Visit Date"
        value={visitState.visitDate}
        onChange={(val) => setVisitState((prev) => ({ ...prev, visitDate: val }))}
        max={"today"}
        required
      />

      <InputField
        label="Remarks"
        value={visitState.visitRemarks}
        onChange={(e) =>
          setVisitState((prev) => ({ ...prev, visitRemarks: e.target.value }))
        }
        required
      />

      <TimePicker
        label="In Time"
        value={visitState.inTime}
        min={"09:00"}
        max={"21:00"}
        onChange={(val) => setVisitState((prev) => ({ ...prev, inTime: val }))}
        required
      />
      <TimePicker
        label="Out Time"
        value={visitState.outTime}
        min={visitState.inTime}
        max={"21:00"}
        onChange={(val) => setVisitState((prev) => ({ ...prev, outTime: val }))}
        required
      />
    </div>
  );
}
