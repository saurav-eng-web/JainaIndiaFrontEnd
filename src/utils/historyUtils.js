export function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);

  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function getAllowedHours(selectedDate) {
  const start = 9;
  const end = 20;

  if (!selectedDate) return [];

  if (!isToday(selectedDate)) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  // If today → enforce +1 hour rule
  const now = new Date();
  const nextAllowedHour = now.getHours() + 1;

  const finalStart = Math.max(start, nextAllowedHour);

  if (finalStart > end) return []; // No valid hours left today

  return Array.from({ length: end - finalStart + 1 }, (_, i) => finalStart + i);
}

export function getNearestValidMinute(minute) {
  const slots = [0, 15, 30, 45];
  for (const m of slots) {
    if (m >= minute) return m;
  }
  return null; // no valid minute in this hour
}

export function getAllowedMinutes(selectedDate, selectedHour) {
  const slots = [0, 15, 30, 45];
  if (!selectedDate || selectedHour === "") return slots;

  if (!isToday(selectedDate)) return slots;

  const now = new Date();
  const nextHour = now.getHours() + 1;

  if (selectedHour > nextHour) {
    return slots; // full range allowed
  }

  if (selectedHour == nextHour) {
    const nearest = getNearestValidMinute(now.getMinutes());
    if (nearest === null) return []; // no valid minute this hour
    return slots.filter((m) => m >= nearest);
  }

  return []; // anything earlier than required hour
}

export function parseStatusMessage(statusMsg = "") {
  const [status, subStatus, message] = statusMsg.split("|");
  return { status, subStatus, message };
}
