/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

export function pick(row, ...names) {
  if (!row) return "";
  const keys = Object.keys(row);
  for (const name of names) {
    const key = keys.find((k) => k.toLowerCase() === name.toLowerCase());
    if (key !== undefined && row[key] !== null && row[key] !== undefined) return row[key];
  }
  return "";
}

export const PREVIEW_ROW_LIMIT = 500;

export function previewRows(rows) {
  return Array.isArray(rows) && rows.length > PREVIEW_ROW_LIMIT ? rows.slice(0, PREVIEW_ROW_LIMIT) : rows;
}

export function previewNote(rows) {
  const total = Array.isArray(rows) ? rows.length : 0;
  return total > PREVIEW_ROW_LIMIT
    ? `Showing the first ${PREVIEW_ROW_LIMIT.toLocaleString()} of ${total.toLocaleString()} rows. Use "Export to Excel" to get all rows.`
    : "";
}

const ISO_DATETIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?$/;

export function formatCell(value) {
  if (typeof value !== "string") return value;
  const m = ISO_DATETIME.exec(value);
  if (!m) return value;
  const [, y, mo, d, h, mi, s] = m;
  const date = `${d}-${mo}-${y}`;
  return h === "00" && mi === "00" && s === "00" ? date : `${date} ${h}:${mi}:${s}`;
}

export function formatRows(rows) {
  if (!Array.isArray(rows)) return rows;
  return rows.map((row) =>
    Object.fromEntries(Object.entries(row || {}).map(([k, v]) => [k, formatCell(v)]))
  );
}

export function columnsFromRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  return Object.keys(rows[0]).map((key) => ({ key, label: key }));
}
