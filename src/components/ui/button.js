import React from "react";

export function Button({ children, ...props }) {
  return (
    <button
      className="rounded bg-[#71b67f] px-4 py-2 text-white transition hover:bg-[#5da96c]"
      {...props}
    >
      {children}
    </button>
  );
}
