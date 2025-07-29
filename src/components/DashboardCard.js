// export default function DashboardCard({ title, value, Icon, iconColor = "text-gray-500" }) {
//     return (
//       <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 w-full">
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           {Icon && <Icon className={`text-lg ${iconColor}`} />}
//           <span>{title}</span>
//         </div>
//         <div className="text-2xl font-semibold text-gray-900">{value}</div>
//       </div>
//     );
//   }
  // components/DashboardCard.jsx
import React from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashboardCard({ title, value, Icon, iconColor = 'text-gray-500' }) {
  const percentage = typeof value === 'number' ? Math.min((value / 2000) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center relative min-h-[140px]">
      <div className="absolute top-2 right-2 text-xl">
        <Icon className={`${iconColor}`} />
      </div>
      <div className="w-20 h-20 mb-2">
        <CircularProgressbarWithChildren
          value={percentage}
          styles={buildStyles({
            pathColor: iconColor.replace('text-', ''),
            trailColor: '#eee',
          })}
        >
          <div className="text-xl font-bold text-gray-800">
            {value}
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="text-sm font-semibold text-gray-700 text-center mt-2">
        {title}
      </div>
    </div>
  );
}
