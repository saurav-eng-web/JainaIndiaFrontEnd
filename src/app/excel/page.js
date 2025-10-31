"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadExcelPage() {
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      console.log("Parsed Excel Data:", jsonData);
      setData(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="mb-4 text-2xl font-semibold">Upload Excel File</h1>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {fileName && (
        <p className="mb-2 text-sm text-gray-600">File: {fileName}</p>
      )}

      {data.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 font-medium">Preview (first 5 rows):</h2>
          <pre className="max-h-60 overflow-auto rounded-md bg-gray-100 p-3 text-sm">
            {JSON.stringify(data.slice(0, 5), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
