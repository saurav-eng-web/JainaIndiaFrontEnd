
// // // // // 'use client';
// // // // // import { useRouter } from 'next/navigation';
// // // // // import './test.css';
// // // // // import Header from '@/components/header';
// // // // // import SideBar from '@/components/SideBar';


// // // // // export default function Test() {
// // // // //   const router = useRouter();

// // // // //   return (
// // // // //     <>
// // // // //          <div style={{ display: 'flex' }}>
// // // // //          <SideBar />
// // // // //       <div className="container">
// // // // //         <h2>Welcome to Complaint Portal</h2>
// // // // //         <div className="button-group">
// // // // //           <button className="action-button" onClick={() => router.push('call')}>
// // // // //             ➕ New Registration
// // // // //           </button>
// // // // //           <button className="action-button" onClick={() => router.push('/search-complaint')}>
// // // // //             🔍 Search Complaint
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //       </div>
// // // // //     </>
// // // // //   );
// // // // // }

// // // // 'use client';
// // // // import { useEffect } from 'react';
// // // // import { useRouter } from 'next/navigation';
// // // // import './test.css';
// // // // import Header from '@/components/header';
// // // // import SideBar from '@/components/SideBar';

// // // // export default function Test() {
// // // //   const router = useRouter();

// // // //   useEffect(() => {
// // // //     const userData = localStorage.getItem('userData');
// // // //     if (!userData) {
// // // //       router.replace('/'); // Redirect to login if not authenticated
// // // //     }
// // // //   }, [router]);

// // // //   return (
// // // //     <div style={{ display: 'flex' }}>
// // // //       <SideBar />
// // // //       <div className="container">
// // // //         <h2>Welcome to Complaint Portal</h2>
// // // //         <div className="button-group">
// // // //           <button className="action-button" onClick={() => router.push('call')}>
// // // //             ➕ New Registration
// // // //           </button>
// // // //           <button className="action-button" onClick={() => router.push('/search-complaint')}>
// // // //             🔍 Search Complaint
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // 'use client';
// // // import { useEffect } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Header from '@/components/header';
// // // import SideBar from '@/components/SideBar';

// // // export default function Test() {
// // //   const router = useRouter();

// // //   useEffect(() => {
// // //     const userData = localStorage.getItem('userData');
// // //     if (!userData) {
// // //       router.replace('/'); // Redirect to login if not authenticated
// // //     }
// // //   }, [router]);

// // //   return (
// // //     <div className="flex bg-[#d1e7ff] min-h-screen">
// // //       <SideBar />
// // //       <div className="max-w-xl mx-auto my-24 p-10 text-center bg-gradient-to-br from-white via-[#d1e7ff] to-slate-500 rounded-xl shadow-2xl">
// // //         <h2 className="text-2xl font-semibold mb-8 text-gray-800">
// // //           Welcome to Complaint Portal
// // //         </h2>
// // //         <div className="flex flex-col gap-5">
// // //           <button
// // //             className="py-4 px-6 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-800 transition-colors"
// // //             onClick={() => router.push('call')}
// // //           >
// // //             ➕ New Registration
// // //           </button>
// // //           <button
// // //             className="py-4 px-6 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-800 transition-colors"
// // //             onClick={() => router.push('/search-complaint')}
// // //           >
// // //             🔍 Search Complaint
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // 'use client';
// // import { useEffect } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Header from '@/components/header';
// // import SideBar from '@/components/SideBar';

// // export default function Test() {
// //   const router = useRouter();

// //   useEffect(() => {
// //     const userData = localStorage.getItem('userData');
// //     if (!userData) {
// //       router.replace('/');
// //     }
// //   }, [router]);

// //   return (
// //     <div className="flex bg-[#d1e7ff] min-h-screen">
// //       <SideBar />
// //       <div className="max-w-[600px] mx-auto my-[100px] p-[40px] text-center rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.2)] bg-gradient-to-br from-white via-[#d1e7ff] to-slate-500">
// //         <h2 className="text-[28px] mb-[30px] text-[#333]">Welcome to Complaint Portal</h2>
// //         <div className="flex flex-col gap-[20px]">
// //           <button
// //             className="py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] bg-[#2979ff] text-white hover:bg-[#1565c0] transition-colors"
// //             onClick={() => router.push('call')}
// //           >
// //             ➕ New Registration
// //           </button>
// //           <button
// //             className="py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] bg-[#2979ff] text-white hover:bg-[#1565c0] transition-colors"
// //             onClick={() => router.push('/search-complaint')}
// //           >
// //             🔍 Search Complaint
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
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
//       <div className="flex justify-center items-center flex-1">
//         <div className="w-full max-w-3xl p-10 text-center bg-gradient-to-br from-white via-[#d1e7ff] to-slate-500 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
//           <h2 className="text-[28px] mb-[30px] text-[#333] font-semibold">
//             Welcome to Complaint Portal
//           </h2>
//           <div className="flex flex-col gap-[20px]">
//             <button
//               className="py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] bg-[#2979ff] text-white hover:bg-[#1565c0] transition-colors"
//               onClick={() => router.push('call')}
//             >
//               ➕ New Registration
//             </button>
//             <button
//               className="py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] bg-[#2979ff] text-white hover:bg-[#1565c0] transition-colors"
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

export default function Test() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="flex bg-[#d1e7ff] min-h-screen">
      <SideBar />
      <div className="flex justify-center items-start pt-[100px] flex-1">
        <div className="max-w-[600px] w-full p-[40px] text-center bg-gradient-to-br from-white via-[#d1e7ff] to-slate-500 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <h2 className="text-[28px] mb-[30px] text-[#333] font-semibold">
            Welcome to Jaina CRM
          </h2>
          <div className="flex flex-col items-center gap-[20px]">
            <button
              className=" w-[400px] py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] bg-[#2979ff] text-white hover:bg-[#1565c0] transition-colors"
              onClick={() => router.push('call')}
            >
              ➕ New Registration
            </button>
            <button
              className="w-[400px] py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] bg-[#2979ff] text-white hover:bg-[#1565c0] transition-colors"
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
