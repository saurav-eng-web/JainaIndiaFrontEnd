import React from "react";

const Loading = () => {
  return (
    // <div
    //   className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${loading ? "opacity-100" : "opacity-0"} `}
    // >
    <div className="h-14 w-14 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
    // </div>
  );
};

export default Loading;
