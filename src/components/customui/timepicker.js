"use client";
import clsx from "clsx";

const sizeMap = {
  sm: { input: "h-8 px-2 text-sm", label: "text-xs" },
  md: { input: "h-10 px-3 text-sm", label: "text-sm" },
  lg: { input: "h-12 px-4 text-base", label: "text-sm" },
  xl: { input: "h-14 px-5 text-lg", label: "text-base" },
};

const pad = (n) => String(n).padStart(2, "0");

const parseTime = (value = "") => {
  if (!value || !value.includes(":")) return { hour: "00", minute: "00" };
  const [h, m] = value.split(":");
  return { hour: pad(h), minute: pad(m) };
};

const buildTime = (h, m) => `${pad(h)}:${pad(m)}`;

const toMinutes = (value) => {
  if (!value) return null;
  const [h, m] = value.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
};

export default function TimePicker({
  label,
  value = "",
  onChange,
  size = "md",
  required = false,
  disabled = false,
  error = "",
  minuteStep = 1,
  min,
  max,
  className,
  name,
  id,
  message,
}) {
  const styles = sizeMap[size] || sizeMap.md;

  const minMinutes = toMinutes(min);
  const maxMinutes = toMinutes(max);

  const isAllowed = (h, m) => {
    const total = Number(h) * 60 + Number(m);

    if (minMinutes !== null && total < minMinutes) return false;
    if (maxMinutes !== null && total > maxMinutes) return false;

    return true;
  };

  // ---- Build only allowed hours ----
  const hours = Array.from({ length: 24 }, (_, i) => pad(i)).filter((h) => {
    // keep hour if ANY minute in this hour is valid
    return Array.from({ length: 60 / minuteStep }, (_, i) => pad(i * minuteStep)).some(
      (m) => isAllowed(h, m)
    );
  });

  // ---- Parse current value ----
  let { hour, minute } = parseTime(value);

  // If current hour not allowed → fallback to first allowed
  if (!hours.includes(hour)) {
    hour = hours[0] || "00";
  }

  // ---- Build allowed minutes for selected hour ----
  const minutes = Array.from({ length: 60 / minuteStep }, (_, i) =>
    pad(i * minuteStep)
  ).filter((m) => isAllowed(hour, m));

  // If current minute not allowed → fallback
  if (!minutes.includes(minute)) {
    minute = minutes[0] || "00";
  }

  // ---- Sync correction to parent ----
  const normalized = buildTime(hour, minute);
  if (value && value !== normalized) {
    onChange?.(normalized);
  }

  const handleHourChange = (e) => {
    const newHour = e.target.value;

    const allowedMinutes = Array.from({ length: 60 / minuteStep }, (_, i) =>
      pad(i * minuteStep)
    ).filter((m) => isAllowed(newHour, m));

    const newMinute = allowedMinutes.includes(minute) ? minute : allowedMinutes[0];

    onChange?.(buildTime(newHour, newMinute));
  };

  const handleMinuteChange = (e) => {
    const newMinute = e.target.value;
    onChange?.(buildTime(hour, newMinute));
  };

  return (
    <div className={clsx("flex w-full flex-col gap-2", className)}>
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

      <div className="flex items-center gap-0.5">
        <select
          id={id || name}
          value={hour}
          onChange={handleHourChange}
          disabled={disabled || hours.length === 0}
          className={clsx(
            "h-10 w-1/2 rounded-lg border border-[#a6829d] transition-all outline-none",
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

        <select
          value={minute}
          onChange={handleMinuteChange}
          disabled={disabled || minutes.length === 0}
          className={clsx(
            "h-10 w-1/2 rounded-lg border border-[#a6829d] transition-all outline-none",
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
