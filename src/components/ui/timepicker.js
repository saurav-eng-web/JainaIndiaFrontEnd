"use client";

import clsx from "clsx";

const sizeMap = {
  sm: { input: "h-8 px-2 text-sm", label: "text-xs" },
  md: { input: "h-10 px-3 text-sm", label: "text-sm" },
  lg: { input: "h-12 px-4 text-base", label: "text-sm" },
  xl: { input: "h-14 px-5 text-lg", label: "text-base" },
};

// ---- Utils ----
const pad = (n) => String(n).padStart(2, "0");

const parseTime = (value = "") => {
  const [h = "00", m = "00"] = value.split(":");
  return { hour: h, minute: m };
};

const buildTime = (h, m) => `${pad(h)}:${pad(m)}`;

export default function TimePicker({
  label,
  value = "",
  onChange,
  size = "md",
  required = false,
  disabled = false,
  error = "",
  minuteStep = 1,
  className,
  name,
  id,
  message,
}) {
  const styles = sizeMap[size] || sizeMap.md;

  const { hour, minute } = parseTime(value);

  const hours = Array.from({ length: 24 }, (_, i) => pad(i));

  const minutes = Array.from({ length: 60 / minuteStep }, (_, i) => pad(i * minuteStep));

  const handleHourChange = (e) => {
    onChange?.(buildTime(e.target.value, minute));
  };

  const handleMinuteChange = (e) => {
    onChange?.(buildTime(hour, e.target.value));
  };

  return (
    <div className={clsx("flex w-full flex-col gap-1", className)}>
      {/* ---- Label (height preserved even if no label) ---- */}
      <div className={styles.label}>
        {label ? (
          <label htmlFor={id || name} className="font-medium text-[#714b67]">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
            {message && <span className="ml-2 text-xs text-gray-500">{message}</span>}
          </label>
        ) : (
          <div className="h-[18px]" />
        )}
      </div>

      {/* ---- Time Selectors ---- */}
      <div className="flex items-center gap-2">
        {/* Hour */}
        <select
          value={hour}
          onChange={handleHourChange}
          disabled={disabled}
          className={clsx(
            "w-1/2 rounded-lg border border-[#a6829d] transition-all outline-none",
            "focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]",
            disabled && "cursor-not-allowed bg-gray-100 opacity-75",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            styles.input
          )}
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <span className="font-semibold text-[#714b67]">:</span>

        {/* Minute */}
        <select
          value={minute}
          onChange={handleMinuteChange}
          disabled={disabled}
          className={clsx(
            "w-1/2 rounded-lg border border-[#a6829d] transition-all outline-none",
            "focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]",
            disabled && "cursor-not-allowed bg-gray-100 opacity-75",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            styles.input
          )}
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
