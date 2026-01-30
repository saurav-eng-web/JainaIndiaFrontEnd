"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import ModalSkeleton from "@/components/ui/ModalSkeleton";

export default function CostEstimationModal({ ticketNumber = "UPSL2502221191893" }) {
  const [poData, setPoData] = useState([]);
  const [selected, setSelected] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchParts() {
      setIsLoading(true);
      try {
        const res = await axiosInstance.post("DropdownMaster/GetDropdown", {
          type: "PartCodeCost",
          dispatchType: "UPSL2502221191893",
        });

        if (res.data?.data?.length) {
          const normalized = res.data.data.map((item) => ({
            partCode: item.key,
            label: item.value,
            price: Number(item.message) || 0,
          }));
          setPoData(normalized);
        } else {
          toast.error("No parts found");
        }
      } catch (err) {
        toast.error("Failed to load part list");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchParts();
  }, [ticketNumber]);

  const toggleSelect = (partCode) => {
    setSelected((prev) => ({
      ...prev,
      [partCode]: !prev[partCode],
    }));
  };

  const totalPrice = useMemo(() => {
    return poData.reduce((sum, item) => {
      if (selected[item.partCode]) {
        return sum + item.price;
      }
      return sum;
    }, 0);
  }, [selected, poData]);

  return (
    <ModalSkeleton title="" size="xxl">
      {isLoading ? (
        <div className="py-10 text-center text-slate-500">Loading parts…</div>
      ) : (
        <>
          <div className="mt-4 mb-4 flex min-w-xl items-center rounded-lg bg-[#714b67] px-6 py-4">
            <div className="text-xl font-semibold text-white">
              Estimated Total: ₹ {totalPrice.toFixed(2)}
            </div>
          </div>
          <div className="divide-y rounded-lg border">
            {poData.map((item) => {
              const checked = !!selected[item.partCode];

              return (
                <div
                  key={item.partCode}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col py-1">
                      <span className="font-medium text-slate-700">{item.label}</span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelect(item.partCode)}
                    className="mt-1 ml-10 size-4 cursor-pointer accent-[#714b67]"
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </ModalSkeleton>
  );
}
