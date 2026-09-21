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

// The buckets the logistics dashboard reports on, in display order
export const PICKUP_STATUS_BUCKETS = [
  { key: "pickupawaited", label: "Pickup Awaited" },
  { key: "scheduled", label: "Scheduled" },
  { key: "intransit", label: "In Transit" },
];

export function normaliseStatus(status) {
  return String(status || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "");
}

export function emptyPickupTotals() {
  return PICKUP_STATUS_BUCKETS.reduce((acc, bucket) => ({ ...acc, [bucket.key]: 0 }), {
    total: 0,
  });
}

// Maps the "distwisecount1" rows — one row per Status with its own Total —
// onto the bucket keys the cards render.
export function mapStatusTotals(rows = []) {
  const totals = emptyPickupTotals();

  for (const row of rows) {
    // the SP returns the status column as docStatus
    const bucket = normaliseStatus(pickColumn(row, "docStatus", "Status"));
    const count = Number(pickColumn(row, "Total") ?? 0);

    if (Number.isNaN(count)) continue;
    if (bucket in totals) totals[bucket] = count;

    // every status counts toward the overall volume, even ones without a card
    totals.total += count;
  }

  return totals;
}

// Maps the "distwisecount" rows — already pivoted per CreatedBy by the SP
export function mapDistributorCounts(rows = []) {
  return rows.map((row) => ({
    createdBy: pickColumn(row, "CreatedBy") || "Unknown",
    pickupawaited: Number(pickColumn(row, "PickupAwaited") ?? 0) || 0,
    scheduled: Number(pickColumn(row, "Scheduled") ?? 0) || 0,
    intransit: Number(pickColumn(row, "InTransit") ?? 0) || 0,
    total: Number(pickColumn(row, "Total") ?? 0) || 0,
  }));
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
    status: pickColumn(row, "docStatus", "Status") || "",
  };
}
