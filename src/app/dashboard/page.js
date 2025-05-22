
// // 'use client';

// // import { useEffect } from 'react';
// // import { useRouter } from 'next/navigation';

// // export default function DashboardPage() {
// //   const router = useRouter();

// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       router.push('/login');
// //     }
// //   }, []);

// //   const handleLogout = () => {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('refreshToken');
// //     router.push('/login');
// //   };

// //   return (
// //     <div style={{ padding: '2rem' }}>
// //       <h1>Dashboard</h1>
// //       <p>You are logged in!</p>
// //       <button onClick={handleLogout}>Logout</button>
// //     </div>
// //   );
// // }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function DashboardPage() {
//   const router = useRouter();
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     const userData = localStorage.getItem('userData');
//     if (!userData) {
//       router.push('/login');
//     } else {
//       const user = JSON.parse(userData);
//       setUserName(user.userName);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('userData');
//     router.push('/login');
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>Dashboard</h1>
//       <p>Welcome, {userName}!</p>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { FaUserCircle } from 'react-icons/fa';

// export default function DashboardPage() {
//   const router = useRouter();
//   const [userName, setUserName] = useState('');
//   const [showMenu, setShowMenu] = useState(false);

//   useEffect(() => {
//     const userData = localStorage.getItem('userData');
//     if (!userData) {
//       router.push('/login');
//     } else {
//       const user = JSON.parse(userData);
//       setUserName(user.userName);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('userData');
//     router.push('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-blue-100 to-slate-600 text-gray-800">
//       <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md relative">
//         <div className="text-lg font-semibold">Main Menu</div>

//         <div className="relative">
//           <button
//             className="text-2xl text-blue-500 focus:outline-none"
//             onClick={() => setShowMenu(!showMenu)}
//           >
//             <FaUserCircle />
//           </button>
//           {showMenu && (
//             <div className="absolute right-0 mt-2 w-28 bg-white rounded shadow-md z-50">
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="p-8">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-bold text-center text-blue-900 mb-4">Search</h2>

//           <label className="block text-gray-700 font-semibold mb-2">
//             Complaint No. / Serial No. / Mobile No.
//           </label>

//           <div className="flex items-center gap-2 mb-4">
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-10 pr-4 py-2 w-full border rounded focus:outline-none"
//               />
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </span>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50">
//               History/Reminder
//             </button>
//             <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50">
//               Search Call
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { FaUserCircle } from 'react-icons/fa';
// import './Dashboard.css'; // Import the CSS file

// export default function DashboardPage() {
//   const router = useRouter();
//   const [userName, setUserName] = useState('');
//   const [showMenu, setShowMenu] = useState(false);

//   useEffect(() => {
//     const userData = localStorage.getItem('userData');
//     if (!userData) {
//       router.push('/login');
//     } else {
//       const user = JSON.parse(userData);
//       setUserName(user.userName);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('userData');
//     router.push('/login');
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="header">
//         <div className="menu-title">Main Menu</div>

//         <div className="relative">
//           <button
//             className="user-icon"
//             onClick={() => setShowMenu(!showMenu)}
//           >
//             <FaUserCircle />
//           </button>
//           {showMenu && (
//             <div className="user-menu">
//               <button
//                 onClick={handleLogout}
//                 className="logout-button"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="main-content">
//         <div className="search-container">
//           <h2>Search</h2>

//           <label>Complaint No. / Serial No. / Mobile No.</label>

//           <div className="search-input-wrapper">
//             <input
//               type="text"
//               placeholder="Search..."
//             />
//             <span className="search-icon">
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </span>
//           </div>

//           <div className="button-container">
//             <button>History/Reminder</button>
//             <button>Search Call</button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header'; 
import './Dashboard.css';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.push('/login');
    } else {
      const user = JSON.parse(userData);
      setUserName(user.userName);
    }
  }, []);

  return (
    <div className="dashboard-container">
      <Header />

      <main className="main-content">
        <div className="search-container">
          <h2>Search</h2>

          <label>Complaint No. / Serial No. / Mobile No.</label>

          <div className="search-input-wrapper">
            <input type="text" placeholder="Search..." />
            <span className="search-icon">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>

          <div className="button-container">
            <button>History/Reminder</button>
            <button>Search Call</button>
          </div>
        </div>
      </main>
    </div>
  );
}
