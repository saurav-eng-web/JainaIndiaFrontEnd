"use client";

import { set } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";

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
        toast.error("Failed to fetch SCA data");
      }
    }

    fetchData();
  }, [productType]);

  function changeSymptom(value) {
    // setSelectedSymptom(value);
    console.log("value: ", value);
    setSelectedSymptom(value);
    const newCause = symptoms.find((item) => item.value === value);
    setCause(
      newCause.data.map((item) => {
        return { label: item.cause, value: item.cid, data: item.AnalysisList };
      })
    );
  }

  function changeCause(value) {
    // setSelectedSymptom(value);
    console.log("value: ", value);
    setSelectedCause(value);
    const newAnalysis = cause.find((item) => item.value === value);
    const label = newAnalysis.label;
    if (label.includes("Specify in remarks")) {
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

    const res = await axiosInstance.post("symptom-cause/process", payload);
    if (
      res.data.statusCode === 200 &&
      res.data.statusMsg === "Record Inserted Successfully"
    ) {
      toast.success("SC Saved Successfully");
      onClose?.();
    }
    console.log("SC Payload:", payload);
    toast.success("SC Saved Successfully");
    onClose?.();
  };

  console.log("symptom: ", { symptoms, selectedSymptom });
  console.log("cause: ", { cause, selectedCause });
  console.log("analysis: ", { analysis, selectedAnalysis });

  return (
    <ModalSkeleton title="Symptom Cause Analysis" size="xl">
      <div className="flex min-h-full flex-col justify-center">
        <div className="grid min-w-3xl grid-cols-2 items-center gap-6">
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
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </ModalSkeleton>
  );
}
