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

      console.log("🔴Parsed Excel Data:", jsonData);
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
        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className=""
      />

      <label className="mt-10 flex w-full cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
        Upload Excel File
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
      <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-4 hover:bg-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mb-2 h-6 w-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3"
          />
        </svg>
        <span className="text-sm text-gray-600">
          Click to upload Excel file
        </span>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
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
