

'use client';
import { useState, useRef, useEffect } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useTheme } from '@/theme/ThemeContext';

export default function CustomDropdown({ label, options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const { colors } = useTheme();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col relative w-full" ref={dropdownRef}>
      {label && <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>}

      {/* Dropdown button */}
      <div
        className="border rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{options.find((opt) => opt.value === value)?.label || placeholder}</span>
        <MdKeyboardArrowDown size={20} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1 border rounded-lg shadow max-h-60 overflow-auto bg-white">
          {/* Search input */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-2 py-1 focus:outline-none"
            />
          </div>

          {/* Options */}
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <li
                  key={`${opt.value}-${idx}`} // unique key
                  className="px-3 py-2 cursor-pointer transition-colors rounded"
                  style={{
                    color: colors.light,
                    backgroundColor: colors.background || 'white',
                  }}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background || 'white';
                    e.currentTarget.style.color = colors.light;
                  }}
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
