import React from "react";

export default function ActionButtons({ actions, onActionClick }) {
  if (!actions || actions.length === 0) {
    return <p className="text-gray-500">No actions available.</p>;
  }

  return (
    <div className="action-buttons mt-4 flex gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`rounded-md px-4 py-2 font-medium text-white transition-colors duration-200 ${
            index === 0
              ? "bg-blue-600 hover:bg-blue-700"
              : index === 1
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={() => onActionClick(action)}
        >
          {action}
        </button>
      ))}
    </div>
  );
}
