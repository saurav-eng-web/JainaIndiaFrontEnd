"use client";
import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import { useTheme } from "@/theme/ThemeContext";

export default function CustomDropdown({
  label,
  options,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // For keyboard focus
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const { colors } = useTheme();
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered options
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          const selected = filteredOptions[highlightedIndex];
          onChange(selected.value);
          setIsOpen(false);
          setSearch("");
          setHighlightedIndex(-1);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Close if we become disabled
  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }, [disabled]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const activeItem = listRef.current.children[highlightedIndex];
      if (activeItem) activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedIndex]);

  return (
    <div
      className="relative flex w-full flex-col"
      ref={dropdownRef}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={disabled ? undefined : handleKeyDown}
    >
      {label && (
        <label
          className={`mb-2 text-sm font-medium ${disabled ? "text-gray-700" : "text-[#714b67]"}`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Dropdown button */}
      <div
        className={`flex items-center justify-between rounded-lg border border-[#a6829d] bg-white px-3 py-2 ${disabled ? "cursor-not-allowed opacity-90" : "cursor-pointer"}`}
        onClick={() => {
          if (disabled) return;
          setIsOpen(!isOpen);
        }}
        aria-disabled={disabled}
      >
        <span className={`${disabled ? "text-gray-500" : ""}`}>
          {options.find((opt) => opt.value === value)?.label || placeholder}
        </span>
        <MdKeyboardArrowDown size={20} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow">
          {/* Search input */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightedIndex(0);
              }}
              className="w-full rounded border px-2 py-1 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Options */}
          <ul ref={listRef}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <li
                  key={`${opt.value}-${idx}`}
                  className={`cursor-pointer rounded px-3 py-2 transition-colors ${
                    idx === highlightedIndex ? "bg-purple-600 text-white" : ""
                  }`}
                  style={{
                    color: idx === highlightedIndex ? "white" : colors.light,
                    backgroundColor:
                      idx === highlightedIndex
                        ? colors.primary
                        : colors.background || "white",
                  }}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                    setHighlightedIndex(-1);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
