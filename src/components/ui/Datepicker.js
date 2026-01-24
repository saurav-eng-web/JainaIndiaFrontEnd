"use client";

import { Popover } from "@headlessui/react";
import clsx from "clsx";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns";
import { useState } from "react";

const THEME = "#714b67";

export default function CustomDatePicker({
  label,
  value, // "yyyy-MM-dd"
  onChange, // returns "yyyy-MM-dd"
  required = false,
  error = "",
  size = "md",
  className = "",
}) {
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleSelect = (date) => {
    const apiValue = format(date, "yyyy-MM-dd");
    onChange(apiValue);
  };

  const displayValue = value ? format(new Date(value), "dd-MM-yyyy") : "";

  return (
    <div className={clsx("flex w-full flex-col gap-1", className)}>
      {label && (
        <label className="text-sm font-medium text-[#714b67]">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <Popover className="relative">
        <Popover.Button
          className={clsx(
            "flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm",
            "border-[#a6829d] bg-white outline-none focus:ring-1 focus:ring-[#714b67]",
            error && "border-red-500 focus:ring-red-500"
          )}
        >
          <span className={displayValue ? "text-black" : "text-gray-400"}>
            {displayValue || "Select date"}
          </span>
          <span className="text-[#714b67]">📅</span>
        </Popover.Button>

        <Popover.Panel className="absolute z-20 mt-2 w-72 rounded-lg border bg-white p-3 shadow-xl">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="rounded p-1 hover:bg-gray-100"
            >
              ◀
            </button>
            <span className="font-semibold text-[#714b67]">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="rounded p-1 hover:bg-gray-100"
            >
              ▶
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 text-center text-xs text-gray-500">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((day) => {
              const selected = value && isSameDay(day, new Date(value));
              return (
                <button
                  key={day.toString()}
                  onClick={() => handleSelect(day)}
                  className={clsx(
                    "h-9 rounded text-sm transition",
                    selected && "bg-[#714b67] text-white",
                    !selected && "hover:bg-[#f3e8f0]",
                    isToday(day) && !selected && "border border-[#714b67]"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </Popover.Panel>
      </Popover>

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
