/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Added Logistic and Logistic1 navigation menu items for Logistic Module
 * -----------------------------------------------------------------------------
 */
"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "./common/LoaderComponent";

import { logout } from "@/redux/slices/authSlice";
import { normalizeRole } from "@/utils/roleAccess";

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

  const handleResetPassword = () => {
    router.push("/reset-password");
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-15 items-center justify-center bg-neutral-900">
        <Loader />
      </div>
    );
  }

    const menuItems = [
    { href: "/cc/home", icon: "fa fa-home", text: "Dashboard", roles: ["CC"] },
    {
      href: "/nsp/dashboard",
      icon: "fa fa-home",
      text: "Dashboard",
      roles: ["BR", "ASM", "ZONE", "SF/SSD"],
    },
    {
      // Added by Saurav Date: 26-Oct-2026 for Logistic Module (Dashboard)
      href: "/logistic/dashboard",
      icon: "fa fa-home",
      text: "Dashboard",
      roles: ["Logistic"],
    },
    { href: "/cc/call", icon: "fa fa-phone", text: "Call Registration", roles: ["CC"] },
    {
      href: "/search-complaint",
      icon: "fa fa-search",
      text: "Call Search",
      roles: ["CC", "BR", "ASM", "ZONE", "SF/SSD", "Distributor", "Logistic"],
    },
    {
      // Added by Saurav Date: 26-Oct-2026 for Logistic Module (Reports Hub & Print)
      href: "/logistic/reports-hub",
      icon: "fa fa-file-text",
      text: "Reports",
      roles: ["Logistic"],
    },
    {
      href: "/logistic/print",
      icon: "fa fa-print",
      text: "Print",
      roles: ["Logistic"],
    },
    {
      href: "/distributor/doapickup",
      icon: "fa fa-truck",
      text: "TD / DOA / CN Pickup",
      roles: ["Distributor"],
    },
    {
      href: "/repaircenter/doareceive",
      icon: "fa fa-barcode",
      text: "Receive TD / DOA / CN",
      roles: ["RepairCenter"],
    },
    {
      href: "/repaircenter/elsdone",
      icon: "fa fa-wrench",
      text: "ELS Done Calls",
      roles: ["RepairCenter"],
    },
    {
      href: "/repaircenter/partrequested",
      icon: "fa fa-list-alt",
      text: "ELS Part Requested Calls",
      roles: ["RepairCenter"],
    },
    {
      href: "/repaircenter/partapproved",
      icon: "fa fa-check-square-o",
      text: "ELS Part Approved Calls",
      roles: ["RepairCenter"],
    },
    {
      href: "/repaircenter/qcpending",
      icon: "fa fa-search-plus",
      text: "QC Pending Part Calls",
      roles: ["RepairCenter"],
    },
    {
      href: "/repaircenter/qcpassed",
      icon: "fa fa-thumbs-up",
      text: "QC Passed Part Calls",
      roles: ["RepairCenter"],
    },
    {
      // Added by Saurav Date: 26-Oct-2026 for Logistic Module (Uploaders, Docket Search, Courier Master, Delete, Invoices)
      href: "/logistic/uploaders",
      icon: "fa fa-upload",
      text: "Uploaders",
      roles: ["Logistic"],
    },
    {
      href: "/logistic/search-history",
      icon: "fa fa-search",
      text: "Docket Search",
      roles: ["Logistic"],
    },
    {
      href: "/logistic/courier-add",
      icon: "fa fa-truck",
      text: "Courier Master",
      roles: ["Logistic"],
    },
    {
      href: "/logistic/delete-docket",
      icon: "fa fa-trash",
      text: "Delete Docket",
      roles: ["Logistic"],
    },
    {
      href: "/logistic/invoice-uploads",
      icon: "fa fa-upload",
      text: "Invoice Uploaders",
      roles: ["Logistic1"],
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
      // Changed by Saurav dt: 13-Oct-2026 - menu stays on the OLD Reports page until the new one is signed off.
      // New page is tested directly by URL: /nsp/reports-new . To go live with it, swap the two href lines below.
      href: "/nsp/reports",
      // href: "/nsp/reports-new",
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
      text: "Send Happy Code",
      roles: ["SF/SSD", "ASM"],
    },
    {
      href: "/sf/dispatch",
      icon: "fa fa-paper-plane",
      text: "Dispatch",
      roles: ["SF/SSD"],
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
    {
      href: "/sf/po-cancel-req",
      icon: "fa fa-times",
      text: "PO Cancellation Request",
      roles: ["SF/SSD"],
    },
    {
      href: "/sf/current-stock",
      icon: "fa fa-cubes",
      text: "Current Stock",
      roles: ["sf/ssd", "SF/SSD"],
    },
    {
      href: "/fin/search",
      icon: "fa fa-search",
      text: "Search",
      roles: ["FinanceExec"],
    },
    {
      href: "/fin/claim-process",
      icon: "fa fa-cubes",
      text: "Claim Details",
      roles: ["FinanceExec"],
    },
    {
      href: "/nsp/ticket",
      icon: "fa fa-exclamation-circle",
      text: "Ticket",
      roles: ["BR"],
    }
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
            const currentRole = normalizeRole(roleName);
            if (!currentRole) return false;
            if (!item.roles.some((role) => normalizeRole(role) === currentRole))
              return false;
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

      <div className="border-t border-neutral-700 bg-neutral-800 px-3 py-3">
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

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleResetPassword}
                className="cursor-pointer text-[11px] font-semibold text-neutral-300 transition-colors duration-300 hover:text-white"
              >
                Reset Password
              </button>

              <span className="text-neutral-600">|</span>

              <button
                onClick={handleLogout}
                className="cursor-pointer rounded bg-[#714b67] px-2.5 py-0.5 text-[12px] font-semibold text-white transition-colors duration-300 hover:bg-[#5a3c52] hover:text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
