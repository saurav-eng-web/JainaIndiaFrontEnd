import React from "react";
import clsx from "clsx";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  readOnly = false,
  className = "",
  inputClassName = "",
  rows = 3,
  ...props
}) => {
  const isTextarea = type === "textarea";

  const baseClasses =
    "w-full rounded border border-gray-400 p-2 outline-none focus:ring-1 focus:ring-gray-400 transition-all";
  const stateClasses = readOnly
    ? "cursor-not-allowed bg-gray-100 text-gray-600"
    : "bg-white text-gray-800";

  return (
    <div className={className}>
      {label && <label className="mb-1 block font-medium text-gray-700">{label}</label>}
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          readOnly={readOnly}
          className={clsx(baseClasses, stateClasses, "resize-none", inputClassName)}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={clsx(baseClasses, stateClasses, inputClassName)}
          {...props}
        />
      )}
    </div>
  );
};

export default FormInput;
