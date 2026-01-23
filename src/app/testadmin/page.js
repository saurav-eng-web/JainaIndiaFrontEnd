"use client";
import React from "react";

/** * Sub-Components for clean table construction
 */

const Th = ({ children, className = "" }) => (
  <th
    className={`border border-gray-300 bg-gray-50 px-8 py-4 text-left text-xs font-semibold tracking-wider text-gray-900 uppercase ${className}`}
  >
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`border px-6 py-4 text-sm whitespace-nowrap text-gray-600 ${className}`}>
    {children}
  </td>
);

const Tr = ({ children, isStriped = false, className = "" }) => (
  <tr
    className={`transition-colors hover:bg-blue-50/40 ${isStriped ? "bg-gray-50/50" : "bg-white"} ${className} `}
  >
    {children}
  </tr>
);

/**
 * Main Page Component
 */
const JobStatusPage = () => {
  const tableData = [
    {
      id: "TKT-9205",
      task: "Serial Verification",
      status: "Completed",
      color: "text-green-700 bg-green-100",
    },
    {
      id: "TKT-8271",
      task: "WIP Documentation",
      status: "In Progress",
      color: "text-blue-700 bg-blue-100",
    },
    {
      id: "TKT-1189",
      task: "Happy Code Validation",
      status: "Pending",
      color: "text-yellow-700 bg-yellow-100",
    },
    {
      id: "TKT-4432",
      task: "Final Job Closure",
      status: "Awaiting",
      color: "text-red-700 bg-red-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Service Ticket Summary</h1>
          <p className="text-sm text-gray-500">
            Overview of current 4 tasks and their status.
          </p>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <Th>Ticket ID</Th>
                <Th>Task Description</Th>
                <Th>Current Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.map((row, index) => (
                <Tr key={row.id} isStriped={index % 2 !== 0}>
                  <Td className="font-mono font-medium text-blue-600">{row.id}</Td>
                  <Td>{row.task}</Td>
                  <Td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${row.color}`}
                    >
                      {row.status}
                    </span>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center">
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Refresh Table Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobStatusPage;
