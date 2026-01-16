function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
  color,
  actionsAllowed = true,
}) {
  return (
    <label
      className={`group flex cursor-pointer items-center space-x-2 ${
        checked
          ? "opacity-100"
          : actionsAllowed
            ? "opacity-80 hover:opacity-100"
            : "opacity-60"
      }`}
    >
      <div className="relative flex items-center">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={!actionsAllowed}
          className="peer h-4 w-4 border-slate-300 text-[#714b67] focus:ring-[#714b67]"
        />
      </div>
      <span className={`text-sm font-medium ${checked ? color : "text-slate-600"}`}>
        {label}
      </span>
    </label>
  );
}

export default RadioOption;

// const payload
