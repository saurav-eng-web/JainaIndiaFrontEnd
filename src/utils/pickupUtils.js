function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

export function formatApiDate(value) {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : formatDate(parsed);
}

// SP column names reach the response verbatim, so match them ignoring case and spaces
function pickColumn(row, ...names) {
  const keys = Object.keys(row || {});

  for (const name of names) {
    const target = name.toLowerCase().replace(/\s+/g, "");
    const match = keys.find((key) => key.toLowerCase().replace(/\s+/g, "") === target);

    if (match && row[match] !== null && row[match] !== undefined) {
      return row[match];
    }
  }

  return undefined;
}

// Friendly headers for the columns we know about. Anything else the SP starts
// returning is exported automatically under its own column name.
const EXPORT_LABELS = {
  ticketno: "Ticket No",
  SerialNumber: "Serial Number",
  invoicedate: "Invoice Date",
  RequestDate: "Request Date",
  CreatedBy: "Created By",
  Status: "Status",
  CNNumber: "CN Number",
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T/;

function normaliseKey(key) {
  return key.toLowerCase().replace(/\s+/g, "");
}

function labelFor(key) {
  const target = normaliseKey(key);
  const match = Object.keys(EXPORT_LABELS).find((k) => normaliseKey(k) === target);
  return match ? EXPORT_LABELS[match] : key;
}

// Builds headers and rows straight from the API response, so every column the
// backend returns lands in the sheet - not just the ones the table renders.
export function buildPickupExport(rows = []) {
  const keys = [];

  for (const row of rows) {
    for (const key of Object.keys(row || {})) {
      if (!keys.includes(key)) keys.push(key);
    }
  }

  const headers = keys.map((key) => ({ key, label: labelFor(key) }));

  const data = rows.map((row) => {
    const exported = {};

    for (const key of keys) {
      const value = row?.[key];
      exported[key] =
        typeof value === "string" && ISO_DATE.test(value)
          ? formatApiDate(value)
          : (value ?? "");
    }

    return exported;
  });

  return { headers, data };
}

// Maps the DOTDCNDISTPICKUP columns returned by the DISTSELECT / LOGSELECT actions
export function mapPickupRequest(row) {
  return {
    ticketNo: pickColumn(row, "ticketno") || "",
    serialNo: pickColumn(row, "SerialNumber") || "",
    invoiceDate: formatApiDate(pickColumn(row, "invoicedate")),
    requestDate: formatApiDate(pickColumn(row, "RequestDate")),
    ageingDays: Number(pickColumn(row, "Ageing Days") ?? NaN),
    createdBy: pickColumn(row, "CreatedBy") || "",
    status: pickColumn(row, "Status") || "",
  };
}
