"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/Datepicker";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import TimePicker from "@/components/ui/timepicker";

export default function SCAPopup({ ticketNo, ticketKey, onClose, productType }) {
  const [step, setStep] = useState(1);

  const goNext = () => setStep(2);
  const goBack = () => setStep(1);

  return (
    <ModalSkeleton title="Symptom Cause Analysis / Update Visit Details" size="xl">
      {/* STEP INDICATOR */}
      <div className="mb-6 flex items-center gap-4">
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
        <SCASection
          ticketNo={ticketNo}
          productType={productType}
          onClose={onClose}
          onNext={goNext}
        />
      )}

      {step === 2 && (
        <VisitDetails
          submitType="visitDetails"
          ticketNo={ticketNo}
          ticketKey={ticketKey}
          onBack={goBack}
        />
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

function SCASection({ ticketNo, productType, onClose }) {
  const [jobAction, setJobAction] = useState("");
  const [remarks, setRemarks] = useState("");
  const [data, setData] = useState({});
  const [remarkMandatory, setRemarkMandatory] = useState(false);

  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState("");

  const [cause, setCause] = useState([]);
  const [selectedCause, setSelectedCause] = useState("");

  const [analysis, setAnalysis] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState("");

  // const sfId = useSelector((state) => state.auth.user.sfId);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosInstance.post("symptom-cause/process", {
          type: "GetSCA",
          payload: productType || "",
        });
        if (
          res.data.statusCode === 200 &&
          res.data.statusMsg === "Records Found" &&
          res.data.data.length > 0
        ) {
          const data = res.data.data[0]["DataFlow"]["Symptoms"];
          setData(data);
          setSymptoms(
            data.map((item) => {
              return { label: item.symptom, value: item.syid, data: item.CauseList };
            })
          );
        }
      } catch (error) {
        console.error("Error fetching SCA data:", error);
        toast.error("Failed to fetch SCA options");
      }
    }

    fetchData();
  }, [productType]);

  useEffect(() => {
    async function fetchSCAData() {
      try {
        const res = await axiosInstance.post("symptom-cause/process", {
          type: "GetSCATicketNo",
          ticket_no: ticketNo,
        });
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          const data = res.data.data[0];
          const { syid, cid, anid, JD_Workdone: jobaction, remarks } = data;

          setSelectedSymptom(syid);
          setSelectedCause(cid);
          setSelectedAnalysis(anid);
          setJobAction(jobaction);
          setRemarks(remarks);
        }
      } catch (error) {
        console.error("Error fetching SCA data:", error);
        toast.error("Failed to fetch SCA data");
      }
    }

    fetchSCAData();
  }, [ticketNo]);

  useEffect(() => {
    if (!selectedSymptom || symptoms.length === 0) return;

    const symptom = symptoms.find((s) => s.value === selectedSymptom);
    if (!symptom) return;

    const newCause = symptom.data.map((item) => ({
      label: item.cause,
      value: item.cid,
      data: item.AnalysisList,
    }));
    setCause(newCause);

    if (selectedCause) {
      const found = newCause.find((c) => c.value === selectedCause);
      if (found) {
        const newAnalysis = found.data.map((item) => ({
          label: item.Aanalysis,
          value: item.anid,
        }));
        setAnalysis(newAnalysis);
      } else {
        setSelectedCause("");
        setAnalysis([]);
        setSelectedAnalysis("");
      }
    } else {
      setAnalysis([]);
      setSelectedAnalysis("");
    }
  }, [selectedSymptom, symptoms, selectedCause]);

  useEffect(() => {
    if (!selectedCause || cause.length === 0) return;
    const found = cause.find((c) => c.value === selectedCause);
    if (found) {
      const newAnalysis = found.data.map((item) => ({
        label: item.Aanalysis,
        value: item.anid,
      }));
      setAnalysis(newAnalysis);
    } else {
      setAnalysis([]);
      setSelectedAnalysis("");
    }
  }, [selectedCause, cause]);

  function changeSymptom(value) {
    setSelectedSymptom(value);
    const newCause = symptoms.find((item) => item.value === value);
    setCause(
      newCause.data.map((item) => {
        return { label: item.cause, value: item.cid, data: item.AnalysisList };
      })
    );
  }

  function changeCause(value) {
    setSelectedCause(value);
    const newAnalysis = cause.find((item) => item.value === value);
    const label = newAnalysis.label;

    if (label.includes("remarks")) {
      setRemarkMandatory(true);
    } else {
      setRemarkMandatory(false);
    }
    setAnalysis(
      newAnalysis.data.map((item) => {
        return { label: item.Aanalysis, value: item.anid };
      })
    );
  }

  const handleSubmit = async () => {
    if (!selectedAnalysis || !selectedCause || !selectedSymptom) {
      toast.error("Please select all fields!");
      return;
    }

    if (!jobAction) {
      toast.error("Please fill job action!");
      return;
    }

    if (remarkMandatory && !remarks) {
      toast.error("Please fill remarks!");
      return;
    }

    const payload = {
      type: "Insert",
      ticket_no: ticketNo,
      syid: selectedSymptom,
      cid: selectedCause,
      anid: selectedAnalysis,
      jobaction: jobAction,
      remarks: remarks,
    };

    try {
      const res = await axiosInstance.post("symptom-cause/process", payload);
      if (
        res.data.statusCode === 200 &&
        res.data.statusMsg === "Record Inserted Successfully"
      ) {
        toast.success("SCA submitted Successfully");
        onClose?.();
      }
    } catch (error) {
      console.error("Error fetching SCA data:", error);
      toast.error("Failed to submit SCA data");
    }
  };
  return (
    <>
      <div className="grid min-w-3xl grid-cols-3 items-center gap-6">
        <CustomDropdown
          label="Symptom"
          value={selectedSymptom}
          onChange={(e) => changeSymptom(e)}
          options={symptoms}
          placeholder="Select Symptom"
          required
        />
        <CustomDropdown
          label="Cause"
          value={selectedCause}
          onChange={(e) => changeCause(e)}
          options={cause}
          placeholder="Select Cause"
          required
        />
        <CustomDropdown
          label="Analysis"
          value={selectedAnalysis}
          onChange={(e) => setSelectedAnalysis(e)}
          options={analysis}
          placeholder="Select Analysis"
          required
        />
        <InputField
          label="Job Action"
          value={jobAction}
          onChange={(e) => setJobAction(e.target.value)}
          required
        />{" "}
        <InputField
          label="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          required={remarkMandatory}
        />
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit}>Next</Button>
      </div>
    </>
  );
}

function VisitDetails({ ticketNo, ticketKey }) {
  const [engineerId, setEngineerId] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [inTime, setInTime] = useState("09:00");
  const [outTime, setOutTime] = useState("");
  const [visitRemarks, setVisitRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [engineerData, setEngineerData] = useState([]);

  const sfId = 1420;

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

  const fetchVisitDetails = useCallback(async () => {
    if (!ticketKey) return; // Need ticketKey first

    try {
      const res = await axiosInstance.get(`visit/ticket/${ticketKey}`);
      const data = res.data;
      console.log("data: ", data);
    } catch (err) {
      console.error("Failed to fetch visit data:", err);
    } //finally {
    // }
  }, [ticketKey]);

  const handleSubmitVisit = async () => {
    if (!engineerId || !visitDate || !inTime || !outTime) {
      toast.error("Please fill all fields!");
      return;
    }

    const payload = {
      TicketNo: ticketNo,
      EngName: engineerId,
      VDate: visitDate,
      VInTime: inTime,
      VOutTime: outTime,
      Remark: visitRemarks,
    };
    console.log("p: ", payload);

    setIsSubmitting(true);

    try {
      console.log("hi there");
    } catch (err) {
      console.error("Error submitting visit details:", err);
      toast.error("Failed to submit visit details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid min-w-3xl grid-cols-3 items-center gap-6">
        <CustomDropdown
          label="Engineer Name"
          placeholder="Select Engineer"
          value={engineerId}
          onChange={(val) => setEngineerId(val)}
          options={engineerData}
          required
        />

        <DatePicker
          label="Visit Date"
          // min="today"
          // max={4}
          value={visitDate}
          onChange={setVisitDate}
          required
        />

        <InputField
          label="Remarks"
          value={visitRemarks}
          onChange={(e) => setVisitRemarks(e.target.value)}
          required
        />

        <TimePicker
          label="In Time"
          value={inTime}
          min={"09:00"}
          max={"21:00"}
          onChange={setInTime}
          required
        />
        <TimePicker
          label="Out Time"
          value={outTime}
          min={inTime}
          max={"21:00"}
          onChange={setOutTime}
          required
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button disabled={isSubmitting} onClick={handleSubmitVisit}>
          {isSubmitting ? "Submitting..." : "Submit details"}
        </Button>
      </div>
    </>
  );
}
