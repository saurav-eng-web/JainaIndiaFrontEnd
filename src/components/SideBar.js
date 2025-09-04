
// 'use client';

// import './Sidebar.css';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useDispatch } from 'react-redux';
// import { logout } from '@/redux/slices/authSlice';

// export default function SideBar() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout()); // Clear Redux state + localStorage
//     router.push('/login'); // Redirect
//   };

//   return (
//     <nav className="mainMenu">
//       <ul>
//         <li className="logo">
//           <Link href="#">
//             <div className="logoContainer">
//               <Image
//                 src="/logo.jpg"
//                 alt="Dashboard Logo"
//                 width={190}
//                 height={60}
//                 className="logoImg"
//               />
//             </div>
//           </Link>
//         </li>
//         <li>
//           <Link href="/test">
//             <i className="fa fa-home fa-2x"></i>
//             <span className="navText">Dashboard</span>
//           </Link>
//         </li>
//         <li>
//           <Link href="/call">
//             <i className="fa fa-phone fa-2x"></i>
//             <span className="navText">Call Registration</span>
//           </Link>
//         </li>
//         <li>
//           <Link href="/search-complaint">
//             <i className="fa fa-search fa-2x"></i>
//             <span className="navText">Call Search</span>
//           </Link>
//         </li>
//         <li>
//           <Link href="/warrantyregisteration">
//             <i className="fa fa-certificate fa-2x"></i>
//             <span className="navText">Warranty Registration</span>
//           </Link>
//         </li>
//         <li>
//           <Link href="/technicalApproval">
//             <i className="fa fa-wrench fa-2x"></i>
//             <span className="navText">Technical Approval</span>
//           </Link>
//         </li>
//         <ul className="logout">
//         <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
//           <div>
//             <i className="fa fa-power-off fa-2x"></i>
//             <span className="navText">Logout</span>
//           </div>
//         </li>
//       </ul>
     
    
     
//       </ul>

//       {/* <ul className="logout">
//         <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
//           <div>
//             <i className="fa fa-power-off fa-2x"></i>
//             <span className="navText">Logout</span>
//           </div>
//         </li>
//       </ul> */}
//     </nav>
//   );
// }


'use client';

import './Sidebar.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';

export default function SideBar() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Pull user info from redux (authSlice)
  const user = useSelector((state) => state.auth.user);

const userName = user?.userName;
const roleName = user?.roleName;

  const handleLogout = () => {
    dispatch(logout()); 
    router.push('/login'); 
  };

  return (
    <nav className="mainMenu">
      <ul>
        {/* Logo */}
        <li className="logo">
          <Link href="#">
            <div className="logoContainer">
              <Image
                src="/logo.jpg"
                alt="Dashboard Logo"
                width={190}
                height={60}
                className="logoImg"
              />
            </div>
          </Link>
        </li>

        {/* Navigation */}
        <li>
          <Link href="/test">
            <i className="fa fa-home fa-2x"></i>
            <span className="navText">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/call">
            <i className="fa fa-phone fa-2x"></i>
            <span className="navText">Call Registration</span>
          </Link>
        </li>
        <li>
          <Link href="/search-complaint">
            <i className="fa fa-search fa-2x"></i>
            <span className="navText">Call Search</span>
          </Link>
        </li>
        <li>
          <Link href="/warrantyregisteration">
            <i className="fa fa-certificate fa-2x"></i>
            <span className="navText">Warranty Registration</span>
          </Link>
        </li>
        <li>
          <Link href="/technicalApproval">
            <i className="fa fa-wrench fa-2x"></i>
            <span className="navText">Technical Approval</span>
          </Link>
        </li>
      </ul>

      {/* 🔽 User Info at Bottom */}
      <div className="userInfo">
        <Image
          src="/avatar.png"   // 👉 put default avatar image in /public
          alt="User Avatar"
          width={45}
          height={45}
          className="userAvatar"
        />
        <div className="userDetails">
          <p className="userName">{userName}</p>
          <p className="userRole">You are logged in as {roleName}</p>
          <button onClick={handleLogout} className="signOutBtn">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
