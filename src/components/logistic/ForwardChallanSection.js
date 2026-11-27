"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Clock, PackageCheck, TriangleAlert, Truck, X } from "lucide-react";

import axiosInstance from "@/api/axiosInstance";
import ReverseChallanBoard, { ResultTable, columnsFromResult } from "@/components/logistic/ReverseChallanBoard";

const ENDPOINT = "LogisticForwardDashboard/process";

const FORWARD_CARDS = [
  {
    key: "pickupAwaited",
    label: "Pickup Awaited",
    hint: "Waiting for courier pickup",
    icon: Clock,
    tone: "from-amber-500 to-orange-600",
    ring: "ring-orange-300",
    panel: "border-orange-200 bg-orange-50/60",
  },
  {
    key: "inTransit",
    label: "In Transit",
    hint: "Currently on the way",
    icon: Truck,
    tone: "from-sky-500 to-indigo-600",
    ring: "ring-indigo-300",
    panel: "border-indigo-200 bg-indigo-50/60",
  },
  {
    key: "delivered",
    label: "Delivered",
    hint: "This month",
    icon: PackageCheck,
    tone: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-300",
    panel: "border-emerald-200 bg-emerald-50/60",
  },
  {
    key: "receiptPending",
    label: "Receiving Pending",
    clearText: "No receiving pending",
    icon: TriangleAlert,
    isAlert: true,
    panel: "border-red-300 bg-red-50/60",
  },
];

function ChallanDialog({ challanNo, onClose }) {
  const [lines, setLines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchChallan() {
      try {
        const res = await axiosInstance.post(ENDPOINT, { type: "challan", challanNo });
        if (!ignore) setLines(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        if (!ignore) toast.error("Failed to load challan details");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchChallan();
    return () => {
      ignore = true;
    };
  }, [challanNo]);

  useEffect(() => {
    const handleKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Challan ${challanNo}`}
        className="flex max-h-full w-full max-w-6xl flex-col rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-lg font-semibold text-gray-800">Challan {challanNo}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 overflow-auto">
          <ResultTable
            columns={columnsFromResult(lines)}
            rows={lines}
            isLoading={isLoading}
            maxHeightClass="max-h-[60vh]"
          />
        </div>
      </div>
    </div>
  );
}

export default function ForwardChallanSection({ onOpenChange }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openChallan, setOpenChallan] = useState(null);

  // loaded on its own, so a problem here does not affect the other dashboard sections
  useEffect(() => {
    if (!localStorage.getItem("userData")) return;

    async function fetchSummary() {
      try {
        const res = await axiosInstance.post(ENDPOINT, { type: "summary" });
        setSummary(res.data?.data ?? null);
      } catch (error) {
        toast.error("Failed to load forward challan summary");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, []);

  const closeDialog = useCallback(() => setOpenChallan(null), []);

  return (
    <>
      <ReverseChallanBoard
        title="Forward Challan/Docket"
        cards={FORWARD_CARDS}
        queryKey="forward"
        filePrefix="Forward_"
        summary={summary}
        isLoading={isLoading}
        endpoint={ENDPOINT}
        onChallanClick={setOpenChallan}
        onOpenChange={onOpenChange}
      />
      {openChallan && <ChallanDialog challanNo={openChallan} onClose={closeDialog} />}
    </>
  );
}
