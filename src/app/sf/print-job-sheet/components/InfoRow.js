import React from "react";

export default function InfoRow({
  label,
  value,
  labelClass = "",
  valueClass = "",
  className = "",
  labelWidth = "w-auto",
  isValueCell = true,
}) {
  return (
    <tr className={className}>
      <td className={`label-cell border-l-0 pl-2 ${labelClass} ${labelWidth}`}>
        {label}
      </td>
      <td
        className={`${
          isValueCell ? "value-cell" : ""
        } border-r-0 text-center ${valueClass}`}
      >
        {value ? value : "-"}
      </td>
    </tr>
  );
}
