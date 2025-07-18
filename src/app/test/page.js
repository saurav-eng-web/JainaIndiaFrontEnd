
// 'use client';
// import { useRouter } from 'next/navigation';
// import './test.css';
// import Header from '@/components/header';
// import SideBar from '@/components/SideBar';


// export default function Test() {
//   const router = useRouter();

//   return (
//     <>
//          <div style={{ display: 'flex' }}>
//          <SideBar />
//       <div className="container">
//         <h2>Welcome to Complaint Portal</h2>
//         <div className="button-group">
//           <button className="action-button" onClick={() => router.push('call')}>
//             ➕ New Registration
//           </button>
//           <button className="action-button" onClick={() => router.push('/search-complaint')}>
//             🔍 Search Complaint
//           </button>
//         </div>
//       </div>
//       </div>
//     </>
//   );
// }

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './test.css';
import Header from '@/components/header';
import SideBar from '@/components/SideBar';

export default function Test() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.replace('/'); // Redirect to login if not authenticated
    }
  }, [router]);

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div className="container">
        <h2>Welcome to Complaint Portal</h2>
        <div className="button-group">
          <button className="action-button" onClick={() => router.push('call')}>
            ➕ New Registration
          </button>
          <button className="action-button" onClick={() => router.push('/search-complaint')}>
            🔍 Search Complaint
          </button>
        </div>
      </div>
    </div>
  );
}
