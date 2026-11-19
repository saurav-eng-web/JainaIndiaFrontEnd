/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */
/**
 * Helpers for API rows that come straight from stored procedures (dynamic column names).
 */

/** Returns the first matching column value (case-insensitive), or "" when none exists. */
export function pick(row, ...names) {
  if (!row) return "";
  const keys = Object.keys(row);
  for (const name of names) {
    const key = keys.find((k) => k.toLowerCase() === name.toLowerCase());
    if (key !== undefined && row[key] !== null && row[key] !== undefined) return row[key];
  }
  return "";
}

/**
 * Large SP results (the docket reports can return 100k+ rows) freeze the browser when every row is rendered.
 * The grid shows only the first PREVIEW_ROW_LIMIT rows; Export to Excel still uses the full data
 * (the legacy pages downloaded the full result as an Excel file).
 */
export const PREVIEW_ROW_LIMIT = 500;

/** First PREVIEW_ROW_LIMIT rows for display. */
export function previewRows(rows) {
  return Array.isArray(rows) && rows.length > PREVIEW_ROW_LIMIT ? rows.slice(0, PREVIEW_ROW_LIMIT) : rows;
}

/** Message shown above a truncated grid, or "" when everything is shown. */
export function previewNote(rows) {
  const total = Array.isArray(rows) ? rows.length : 0;
  return total > PREVIEW_ROW_LIMIT
    ? `Showing the first ${PREVIEW_ROW_LIMIT.toLocaleString()} of ${total.toLocaleString()} rows. Use "Export to Excel" to get all rows.`
    : "";
}

const ISO_DATETIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?$/;

/**
 * SP datetime values reach the page as ISO text (2021-06-21T09:34:53.607). Shows them as dd-mm-yyyy
 * (plus hh:mm:ss when there is a time part). Parsed from the text, so no time-zone shift. Other values are unchanged.
 */
export function formatCell(value) {
  if (typeof value !== "string") return value;
  const m = ISO_DATETIME.exec(value);
  if (!m) return value;
  const [, y, mo, d, h, mi, s] = m;
  const date = `${d}-${mo}-${y}`;
  return h === "00" && mi === "00" && s === "00" ? date : `${date} ${h}:${mi}:${s}`;
}

/** Copy of the rows with every ISO datetime formatted (used for display and Excel export). */
export function formatRows(rows) {
  if (!Array.isArray(rows)) return rows;
  return rows.map((row) =>
    Object.fromEntries(Object.entries(row || {}).map(([k, v]) => [k, formatCell(v)]))
  );
}

/** Builds Table columns from the keys of the first row. */
export function columnsFromRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  return Object.keys(rows[0]).map((key) => ({ key, label: key }));
}
