import React from 'react';

export function Button({ children, ...props }) {
  return (
    <button
      className="px-4 py-2 bg-[#71b67f] text-white rounded hover:bg-[#5da96c] transition"
      {...props}
    >
      {children}
    </button>
  );
}