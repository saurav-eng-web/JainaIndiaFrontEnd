// Helper function to format date to Indian Standard Time (IST)
const formatIndianDate = (dateString) => {
  if (!dateString) return "Not Available";

  // Attempt to create a date object
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", // Forces Indian Timezone
    day: "2-digit",
    month: "short", // e.g., 'Feb'
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // hour12: true, // AM/PM format
  }).format(date);
};

export { formatIndianDate };
