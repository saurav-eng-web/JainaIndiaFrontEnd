import React from "react";

export default function SectionHeader({ title, className = "" }) {
  return (
    <tr>
      <td
        colSpan={2}
        className={`border-r-0 border-l-0 bg-gray-50 text-center font-bold ${className}`}
      >
        {title}
      </td>
    </tr>
  );
}
