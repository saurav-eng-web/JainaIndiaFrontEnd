import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel({
  data,
  fileName = "export.xlsx",
  sheetName = "Sheet1",
  headers,
}) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No data available to export");
  }

  // Convert data to worksheet
  const worksheetData = headers
    ? [
        headers.map((h) => h.label),
        ...data.map((row) => headers.map((h) => row[h.key] ?? "")),
      ]
    : data;

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);
}
