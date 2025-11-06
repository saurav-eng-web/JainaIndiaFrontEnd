// 'use client';

// import './Sidebar.css';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '@/redux/slices/authSlice';

// export default function SideBar() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   // Pull user info from redux (authSlice)
//   const user = useSelector((state) => state.auth.user);

// const userName = user?.userName;
// const roleName = user?.roleName;

//   const handleLogout = () => {
//     dispatch(logout());
//     router.push('/login');
//   };

//   return (
//     <nav className="mainMenu">
//       <ul>
//         {/* Logo */}
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

//         {/* Navigation */}

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
//       </ul>

//       {/* 🔽 User Info at Bottom */}
//       <div className="userInfo">
//         <Image
//           src="/avatar.png"   // 👉 put default avatar image in /public
//           alt="User Avatar"
//           width={45}
//           height={45}
//           className="userAvatar"
//         />
//         <div className="userDetails">
//           <p className="userName">{userName}</p>
//           <p className="userRole">You are logged in as {roleName}</p>
//           <button onClick={handleLogout} className="signOutBtn">
//             Sign Out
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

// 'use client';

// import './Sidebar.css';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '@/redux/slices/authSlice';

// export default function SideBar() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   // Get user info from redux
//   const user = useSelector((state) => state.auth.user);

//   const userName = user?.userName;
//   const roleName = user?.roleName;

//   const handleLogout = () => {
//     dispatch(logout());
//     router.push('/login');
//   };

//   // Define menu items with allowed roles
//   const menuItems = [
//     {
//       href: '/test',
//       icon: 'fa fa-home fa-2x',
//       text: 'Dashboard',
//       roles: ['CC', 'BR', 'Manager'], // visible to all
//     },
//     {
//       href: '/call',
//       icon: 'fa fa-phone fa-2x',
//       text: 'Call Registration',
//       roles: ['CC'],
//     },
//     {
//       href: '/search-complaint',
//       icon: 'fa fa-search fa-2x',
//       text: 'Call Search',
//       roles: ['CC', 'BR'],
//     },
//     {
//       href: '/warrantyregisteration',
//       icon: 'fa fa-certificate fa-2x',
//       text: 'Warranty Registration',
//       roles: ['CC'],
//     },
//     {
//       href: '/technicalApproval',
//       icon: 'fa fa-wrench fa-2x',
//       text: 'Technical Approval',
//       roles: ['CC'],
//     },
//   ];

//   return (
//     <nav className="mainMenu">
//       <ul>
//         {/* Logo */}
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

//         {/* Role-based Navigation */}
//         {menuItems
//           .filter((item) => item.roles.includes(roleName))
//           .map((item, idx) => (
//             <li key={idx}>
//               <Link href={item.href}>
//                 <i className={item.icon}></i>
//                 <span className="navText">{item.text}</span>
//               </Link>
//             </li>
//           ))}
//       </ul>

//       {/* User Info at Bottom */}
//       <div className="userInfo">
//         <Image
//           src="/avatar.png"
//           alt="User Avatar"
//           width={45}
//           height={45}
//           className="userAvatar"
//         />
//         <div className="userDetails">
//           <p className="userName">{userName}</p>
//           <p className="userRole">You are logged in as {roleName}</p>
//           <button onClick={handleLogout} className="signOutBtn">
//             Sign Out
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import "./Sidebar.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

export default function SideBar() {
  const router = useRouter();
  const dispatch = useDispatch();

  // 🚀 1. Call *all hooks first*
  const user = useSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userName = user?.userName;
  const roleName = user?.roleName;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // 🚀 2. Early return AFTER all hooks
  if (!mounted) {
    return null; // or a skeleton loader
  }

  // Define menu items with allowed roles
  const menuItems = [
    {
      href: "/test",
      icon: "fa fa-home fa-2x",
      text: "Dashboard",
      roles: ["CC"],
    },
    {
      href: "/nsp/dashboard",
      icon: "fa fa-home fa-2x",
      text: "Dashboard",
      roles: ["BR", "ASM", "ZONE", "SF/SSD"],
    },
    {
      href: "/call",
      icon: "fa fa-phone fa-2x",
      text: "Call Registration",
      roles: ["CC"],
    },
    {
      href: "/search-complaint",
      icon: "fa fa-search fa-2x",
      text: "Call Search",
      roles: ["CC", "BR", "ASM", "ZONE", "SF/SSD"],
    },
    {
      href: "/warrantyregisteration",
      icon: "fa fa-certificate fa-2x",
      text: "Warranty Registration",
      roles: ["CC"],
    },
    {
      href: "/technicalApproval",
      icon: "fa fa-wrench fa-2x",
      text: "Technical Approval",
      roles: ["CC"],
    },
    {
      href: "/bulk-uploader",
      icon: "fa fa-phone fa-2x",
      text: "Bulk Call Creation",
      roles: ["CC"],
    },
    {
      href: "/nsp/asc-creation",
      icon: "fa fa-plus fa-2x",
      text: "Asc Creation",
      roles: ["BR"],
    },
    {
      href: "/nsp/reports",
      icon: "fa fa-wrench fa-2x",
      text: "Reports",
      roles: ["BR", "ZONE", "SF/SSD"],
    },
    {
      href: "/nsp/transfercall",
      icon: "fa fa-phone fa-2x",
      text: "Call Transfer",
      roles: ["BR", "ASM", "ZONE"],
    },
  ];

  const allowedBulkUsers = ["T284977"];

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

        {/* Role-based Navigation */}
        {/* {menuItems
          .filter((item) => roleName && item.roles.includes(roleName))
          .map((item, idx) => (
            <li key={idx}>
              <Link href={item.href}>
                <i className={item.icon}></i>
                <span className="navText">{item.text}</span>
              </Link>
            </li>
          ))} */}
        {menuItems
          .filter((item) => {
            // role check (as before)
            if (!roleName || !item.roles.includes(roleName)) return false;

            // special case: Bulk Call Creation allowed ONLY for T284977
            if (
              item.href === "/bulk-uploader" &&
              !allowedBulkUsers.includes(userName)
            ) {
              return false;
            }

            return true;
          })
          .map((item, idx) => (
            <li key={idx}>
              <Link href={item.href}>
                <i className={item.icon}></i>
                <span className="navText">{item.text}</span>
              </Link>
            </li>
          ))}

        {/* ----------------- */}
      </ul>

      {/* User Info at Bottom */}
      <div className="userInfo">
        <Image
          src="/avatar.png"
          alt="User Avatar"
          width={45}
          height={45}
          className="userAvatar"
        />
        <div className="userDetails">
          <p className="userName">{userName}</p>
          <p className="userRole">
            {roleName ? `You are logged in as ${roleName}` : ""}
          </p>
          <button onClick={handleLogout} className="signOutBtn">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
