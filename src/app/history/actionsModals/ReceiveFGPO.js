"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import Loading from "@/components/customui/Loading";
import ModalSkeleton from "@/components/customui/ModalSkeleton";
import RadioOption from "@/components/customui/RadioOption";

export default function ReceiveFGPO({ ticketNo, onClose }) {
  const [receivedStatus, setReceivedStatus] = useState("");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    async function fetchData() {
      if (!ticketNo) {
        // toast.error("Please enter ticket number");
        return;
      }

      try {
        setIsLoading(true);
        const res = await axiosInstance.post("doa/process", {
          type: "DOADetail",
          TicketNo: ticketNo,
        });

        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          setData(res.data.data[0]);
        } else {
          toast.error("No data found");
        }
      } catch (error) {
        toast.error("Failed to fetch data. Please try again.");
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [ticketNo]);

  async function handleSubmit() {
    if (!receivedStatus) {
      toast.error("Please select received status");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        type: "DOAReceive",
        data: [
          {
            ...data,
            ok: receivedStatus === "ok" ? 1 : 0,
            damaged: receivedStatus === "damaged" ? 1 : 0,
            short: receivedStatus === "short" ? 1 : 0,
            wrong: receivedStatus === "wrong" ? 1 : 0,
          },
        ],
      };

      const res = await axiosInstance.post("doa/process", payload);
      if (res.data.statusCode === 200 && res.data.statusMsg.includes("Unit Recieved")) {
        toast.success(`${res.data.statusMsg}`);
        onClose();
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Unable to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputsToRender = [
    {
      label: "Ticket Number",
      value: data.Ticket_no,
    },
    {
      label: "Serial Number",
      value: data.OldserialNumber,
    },
    {
      label: "PO Number",
      value: data.Ponumber,
    },
    {
      label: "Proposed Model", //TODO:
      value: data.ProposedModel,
    },
    // {
    //   label: "Invoice Number",
    //   value: data.Invoiceno,
    // },
    {
      label: "New Serial Number",
      value: data.MAchineSlNo,
    },
    {
      label: "Courier Name",
      value: data.CourierName,
    },
    {
      label: "Packing Slip",
      value: data.PackingSlip,
    },
    {
      label: "Docket Number",
      value: data.DocketNo,
    },
    {
      label: "Weight",
      value: data.Weight,
    },
  ];
  return (
    <ModalSkeleton title={"Receive FG PO"}>
      {isLoading ? (
        <Loading />
      ) : Object.keys(data).length === 0 ? (
        <div className="200 mt-20 h-full text-center text-amber-900">
          <span className="rounded-2xl bg-amber-100 px-8 py-3 text-xl">
            ⚠️ Data not found
          </span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6">
            {inputsToRender.map((input, index) => (
              <InputField
                key={index}
                className={"readOnly"}
                label={input.label}
                value={input.value}
                disabled={true}
              />
            ))}
          </div>
          <div className="mt-8 w-2xl rounded-lg border border-gray-300">
            <h3 className="rounded-lg bg-gray-100 p-4 font-semibold">Received Status</h3>
            <div className="mt-8 ml-8 flex w-fit items-center justify-between gap-8">
              <RadioOption
                name={"receivedStatus"}
                value="ok"
                label="Ok"
                color="text-green-600"
                // actionsAllowed={actionsAllowed}
                checked={receivedStatus === "ok"}
                onChange={() => setReceivedStatus("ok")}
              />
              <RadioOption
                name={"receivedStatus"}
                value="damaged"
                label="Damaged"
                color="text-red-600"
                // actionsAllowed={actionsAllowed}
                checked={receivedStatus === "damaged"}
                onChange={() => setReceivedStatus("damaged")}
              />
              <RadioOption
                name={"receivedStatus"}
                value="short"
                label="Short"
                color="text-amber-600"
                // actionsAllowed={actionsAllowed}
                checked={receivedStatus === "short"}
                onChange={() => setReceivedStatus("short")}
              />
              <RadioOption
                name={"receivedStatus"}
                value="mismatch"
                label="Mismatch"
                color="text-blue-600"
                // actionsAllowed={actionsAllowed}
                checked={receivedStatus === "mismatch"}
                onChange={() => setReceivedStatus("mismatch")}
              />
            </div>
            <div className="my-4 ml-8">
              <Button onClick={handleSubmit} className="mt-4">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </>
      )}
    </ModalSkeleton>
  );
}
