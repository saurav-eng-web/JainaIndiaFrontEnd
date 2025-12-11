"use client";

import { useEffect, useState } from "react";
import "./Sidebar.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import Loader from "./common/Loader";

import { logout } from "@/redux/slices/authSlice";
export default function SideBar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400); // 👈 small delay for visible loader
    return () => clearTimeout(timer);
  }, []);

  const userName = user?.userName;
  const roleName = user?.roleName;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-1/6 items-center justify-center bg-white dark:bg-gray-900">
        <Loader />
      </div>
    );
  }

  const menuItems = [
    { href: "/test", icon: "fa fa-home fa-2x", text: "Dashboard", roles: ["CC"] },
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
      roles: ["BR", "ZONE", "SF/SSD", "NSP", "ASM", "RSM", "HOuser"],
    },
    {
      href: "/nsp/transfercall",
      icon: "fa fa-phone fa-2x",
      text: "Call Transfer",
      roles: ["BR", "ASM", "ZONE"],
    },
    { href: "/print", icon: "fa fa-print fa-2x", text: "Print", roles: ["SF/SSD"] },
    {
      href: "/sf/receive-po",
      icon: "fa fa-archive fa-2x",
      text: "Receive PO",
      roles: ["SF/SSD"],
    },
    {
      href: "/happy-code",
      icon: "fa fa-archive fa-2x",
      text: "Send Happy Code",
      roles: ["SF/SSD", "ASM"],
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

        {menuItems
          .filter((item) => {
            if (!roleName || !item.roles.includes(roleName)) return false;

            if (item.href === "/bulk-uploader" && !allowedBulkUsers.includes(userName)) {
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
      </ul>

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
          <p className="userRole">{roleName ? `You are logged in as ${roleName}` : ""}</p>
          <button onClick={handleLogout} className="signOutBtn">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
