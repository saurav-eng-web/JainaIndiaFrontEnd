"use client";

import { set } from "date-fns";
import { Input } from "postcss";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import TimePicker from "@/components/ui/timepicker";

export default function SCAPopup({ ticketNo, onClose, productType }) {
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

  const [engineerData, setEngineerData] = useState([]);
  const [engineerId, setEngineerId] = useState("");

  const [visitDate, setVisitDate] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [visitRemarks, setVisitRemarks] = useState("");

  const sfId = 1420;
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

  const handleVisitSubmit = async () => {
    if (!engineerId || !visitDate || !inTime || !outTime) {
      toast.error("Please fill all fields!");
      return;
    }
    const payload = {
      type: "Insert",
      ticket_no: ticketNo,
      eng_id: engineerId,
      visit_date: visitDate,
      in_time: inTime,
      out_time: outTime,
      remarks: "",
    };
    console.log("payload: ", payload);
  };

  return (
    <ModalSkeleton title="Symptom Cause Analysis" size="xl">
      <div className="flex min-h-full flex-col justify-center">
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
          <Button onClick={handleSubmit}>Submit SCA</Button>
        </div>
        <SectionHeading>Update Visit Details</SectionHeading>
        <div className="grid grid-cols-3 items-center gap-6">
          <CustomDropdown
            label="Engineer Name"
            placeholder="Select Engineer"
            value={engineerId}
            onChange={(val) => setEngineerId(val)}
            options={engineerData}
            required
          />

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              Visit Date<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="date"
              className="rounded-md border px-3 py-2"
              value={visitDate}
              onChange={(e) => {
                setVisitDate(e.target.value);
                // Reset time when date changes (handled by parent logic usually, but here just updating state)
                // setHour("");
                // setMinute("");
              }}
              // min={todayStr}
              // max={new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split("T")[0]}
            />
          </div>

          <InputField
            label="Remarks"
            value={visitRemarks}
            onChange={(e) => setVisitRemarks(e.target.value)}
            required
          />

          <TimePicker label="In Time" value={inTime} onChange={setInTime} />
          <TimePicker label="Out Time" value={outTime} onChange={setOutTime} />
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleVisitSubmit}>Submit Visit details</Button>
        </div>
      </div>
    </ModalSkeleton>
  );
}
