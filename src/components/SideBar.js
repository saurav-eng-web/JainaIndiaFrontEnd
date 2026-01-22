"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "./common/LoaderComponent";

import { logout } from "@/redux/slices/authSlice";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
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
      <div className="flex h-screen w-[60px] items-center justify-center bg-neutral-900">
        <Loader />
      </div>
    );
  }

  const menuItems = [
    { href: "/cc/home", icon: "fa fa-home", text: "Dashboard", roles: ["CC"] },
    {
      href: "/nsp/dashboard", // Naviation_Url
      icon: "fa fa-home", // Icon
      text: "Dashboard", // Menu_Name
      roles: ["BR", "ASM", "ZONE", "SF/SSD"], // Menu_Role
    },
    { href: "/cc/call", icon: "fa fa-phone", text: "Call Registration", roles: ["CC"] },
    {
      href: "/search-complaint",
      icon: "fa fa-search",
      text: "Call Search",
      roles: ["CC", "BR", "ASM", "ZONE", "SF/SSD"],
    },
    {
      href: "/warrantyregisteration",
      icon: "fa fa-certificate",
      text: "Warranty Registration",
      roles: ["CC"],
    },
    {
      href: "/technicalApproval",
      icon: "fa fa-wrench",
      text: "Technical Approval",
      roles: ["CC"],
    },
    {
      href: "/bulk-uploader",
      icon: "fa fa-phone",
      text: "Bulk Call Creation",
      roles: ["CC"],
    },
    {
      href: "/nsp/asc-creation",
      icon: "fa fa-plus",
      text: "Asc Creation",
      roles: ["BR"],
    },
    {
      href: "/nsp/reports",
      icon: "fa fa-file-text",
      text: "Reports",
      roles: ["BR", "ZONE", "SF/SSD", "NSP", "ASM", "RSM", "HOuser"],
    },
    {
      href: "/nsp/transfercall",
      icon: "fa fa-exchange",
      text: "Call Transfer",
      roles: ["BR", "ASM", "ZONE"],
    },
    { href: "/print", icon: "fa fa-print", text: "Print", roles: ["SF/SSD"] },
    {
      href: "/sf/receive-po",
      icon: "fa fa-archive",
      text: "Receive PO",
      roles: ["SF/SSD"],
    },
    {
      href: "/happy-code",
      icon: "fa fa-envelope",
      // icon: "fa fa-paper-plane",
      text: "Send Happy Code",
      roles: ["SF/SSD", "ASM"],
    },
    {
      href: "/sf/dispatch",
      icon: "fa fa-paper-plane",
      text: "Dispatch",
      roles: ["SF/SSD", "ASM"],
    },
    {
      href: "/knowledge-portal",
      icon: "fa fa-files-o",
      text: "Knowledge Portal",
      roles: ["ASM", "BR", "SF/SSD"],
    },
    {
      href: "/nsp/special-approval",
      icon: "fa fa-book",
      text: "Special Allowance",
      roles: ["NSP", "BR"],
    },
    {
      href: "/rsm/special-allowance",
      icon: "fa fa-book",
      text: "Special Allowance Requests",
      roles: ["ZONE", "RSM"],
    },
  ];

  const allowedBulkUsers = ["T284977"];

  return (
    <nav className="group fixed top-0 left-0 z-50 flex h-screen w-[60px] flex-col justify-between border-r border-neutral-800 bg-neutral-900 transition-all duration-100 ease-linear hover:w-[250px]">
      {/* TOP SECTION */}
      <ul className="mt-2 flex flex-col">
        {/* LOGO */}
        <li className="flex h-[70px] items-center justify-center">
          <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={190}
              height={60}
              className="rounded"
            />
          </div>
        </li>

        {menuItems
          .filter((item) => {
            if (!roleName || !item.roles.includes(roleName)) return false;
            if (item.href === "/bulk-uploader" && !allowedBulkUsers.includes(userName))
              return false;
            return true;
          })
          .map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <button
                  onClick={() => {
                    if (isActive) {
                      window.location.reload();
                    } else {
                      router.push(item.href);
                    }
                  }}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-neutral-400 transition-colors hover:bg-black hover:text-white ${isActive ? " bg-black text-white" : ""} `}
                >
                  <i className={`${item.icon} fa-lg text-center`} />

                  <span className="pointer-events-none whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                    {item.text}
                  </span>
                </button>
              </li>
            );
          })}
      </ul>

      {/* USER SECTION */}
      <div className="h-24 border-t border-neutral-700 bg-neutral-800 px-3">
        <div className="flex h-full items-center gap-3">
          <Image
            src="/avatar.png"
            alt="User"
            width={40}
            height={40}
            className="shrink-0 rounded-full"
            loading="lazy"
          />

          <div className="pointer-events-none flex flex-col justify-center opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
            <p className="text-sm leading-tight font-semibold text-white">{userName}</p>

            <p className="text-xs leading-tight font-medium text-neutral-400">
              {roleName ? `Logged in as ${roleName}` : ""}
            </p>

            <button
              onClick={handleLogout}
              className="mt-2 cursor-pointer rounded bg-[#714b67] px-2 py-1 text-center text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#5a3c52] hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
