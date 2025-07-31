
// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import SideBar from '@/components/SideBar';

// export default function Test() {
//   const router = useRouter();

//   useEffect(() => {
//     const userData = localStorage.getItem('userData');
//     if (!userData) {
//       router.replace('/');
//     }
//   }, [router]);

//   return (
//     <div className="flex bg-[#d1e7ff] min-h-screen">
//       <SideBar />
//       <div className="flex justify-center items-start pt-[100px] flex-1">
//         <div className="max-w-[600px] w-full p-[40px] text-center bg-gradient-to-br from-white via-[#d1e7ff] to-slate-500 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
//           <h2 className="text-[28px] mb-[30px] text-[#333] font-semibold">
//             Welcome to Jaina CRM
//           </h2>
//           <div className="flex flex-col items-center gap-[20px]">
//             <button
//               className=" w-[400px] py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] bg-[#2979ff] text-white hover:bg-[#1565c0] transition-colors"
//               onClick={() => router.push('call')}
//             >
//               ➕ New Registration
//             </button>
//             <button
//               className="w-[400px] py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] bg-[#2979ff] text-white hover:bg-[#1565c0] transition-colors"
//               onClick={() => router.push('/search-complaint')}
//             >
//               🔍 Search Complaint
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideBar from '@/components/SideBar';
import { useTheme } from '@/theme/ThemeContext'; // 👈 import your theme

export default function Test() {
  const router = useRouter();
  const { colors } = useTheme(); // 👈 access theme colors

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: colors.background }}>
      <SideBar />
      <div className="flex justify-center items-start pt-[100px] flex-1">
        <div
          className="max-w-[600px] w-full p-[40px] text-center rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
          }}
        >
          <h2 className="text-[28px] mb-[30px]" style={{ color: colors.tex }}>
            Welcome to Jaina CRM
          </h2>
          <div className="flex flex-col items-center gap-[20px]">
            <button
              className="w-[400px] py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] transition-colors"
              style={{ backgroundColor: colors.primary, color: colors.buttonText }}
              onClick={() => router.push('call')}
            >
              ➕ New Registration
            </button>
            <button
              className="w-[400px] py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] transition-colors"
              style={{ backgroundColor: colors.primary, color: colors.buttonText }}
              onClick={() => router.push('/search-complaint')}
            >
              🔍 Search Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
