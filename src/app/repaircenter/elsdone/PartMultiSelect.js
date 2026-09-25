"use client";

import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

// Multi-select in the same visual language as components/common/Dropdown,
// which only supports a single value.
export default function PartMultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Select Part Code",
  required = false,
  disabled = false,
  isLoading = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    String(opt.label).toLowerCase().includes(search.toLowerCase())
  );

  function toggle(optionValue) {
    const next = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];

    onChange?.(next);
  }

  return (
    <div className="relative flex w-full flex-col" ref={wrapperRef}>
      {label && (
        <label className="mb-1 text-sm font-medium text-[#714b67]">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div
        className={`flex min-h-10 items-center justify-between rounded-lg border border-[#a6829d] bg-white px-3 py-2 transition-all ${
          disabled ? "cursor-not-allowed opacity-90" : "cursor-pointer"
        }`}
        onClick={() => {
          if (disabled) return;
          setIsOpen((prev) => !prev);
        }}
      >
        <div className="flex flex-wrap gap-1">
          {value.length === 0 ? (
            <span className="text-gray-500">
              {isLoading ? "Loading parts..." : placeholder}
            </span>
          ) : (
            value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full bg-[#714b67]/10 px-2 py-0.5 text-xs font-semibold text-[#714b67]"
              >
                {item}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(item);
                  }}
                  className="cursor-pointer text-[#714b67] hover:opacity-70"
                  aria-label={`Remove ${item}`}
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>

        <MdKeyboardArrowDown size={20} className="shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border px-2 py-1 focus:outline-none"
              autoFocus
            />
          </div>

          <ul>
            {filtered.length > 0 ? (
              filtered.map((opt) => {
                const checked = value.includes(opt.value);

                return (
                  <li
                    key={opt.value}
                    onClick={() => toggle(opt.value)}
                    className={`flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors hover:bg-[#714b67]/10 ${
                      checked ? "bg-[#714b67]/5" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="h-4 w-4 border-slate-300 text-[#714b67] focus:ring-[#714b67]"
                    />
                    <span className="text-sm text-slate-700">{opt.label}</span>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 text-gray-500">
                {isLoading ? "Loading..." : "No parts found"}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
