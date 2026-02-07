import React from "react";

import { Button } from "../ui/button";

export default function ActionButtons({ actions, onActionClick }) {
  if (!actions || actions.length === 0) {
    return <p className="mb-6 ml-6 text-gray-500">No actions available.</p>;
  }

  return (
    <div className="action-buttons mt-4 flex flex-wrap gap-4">
      {actions.map((action, index) => (
        <Button
          key={index}
          className={`min-w-32 rounded-md px-2 py-2 text-white transition-colors duration-200 ${
            index === 0
              ? "bg-blue-600 hover:bg-blue-700"
              : index === 1
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={() => onActionClick(action)}
        >
          {action}
        </Button>
      ))}
    </div>
  );
}

//
