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

/** Builds Table columns from the keys of the first row. */
export function columnsFromRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  return Object.keys(rows[0]).map((key) => ({ key, label: key }));
}
