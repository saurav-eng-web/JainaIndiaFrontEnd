// utils/dateRange.js

export const normalizeDate = (input) => {
  if (!input) return null;

  if (input === "today") {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }

  return input; // already yyyy-mm-dd
};

export const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

export const resolveRange = (min, max) => {
  const resolvedMin = normalizeDate(min);
  let resolvedMax = null;

  // numeric max → relative to min
  if (typeof max === "number" && resolvedMin) {
    resolvedMax = addDays(resolvedMin, max - 1);
  }
  // absolute max date
  else if (typeof max === "string") {
    resolvedMax = normalizeDate(max);
  }

  return {
    min: resolvedMin,
    max: resolvedMax,
  };
};
