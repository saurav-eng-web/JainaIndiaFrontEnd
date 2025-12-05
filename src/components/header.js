"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import "./Header.css";

export default function Header() {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/login");
  };

  return (
    <header className="header">
      <div className="relative">
        <div className="menu-title" onClick={() => setShowMainMenu((prev) => !prev)}>
          Main Menu <FaChevronDown size={14} style={{ marginLeft: 4 }} />
        </div>
        {showMainMenu && (
          <ul className="main-menu-dropdown">
            <li onClick={() => router.push("/call-registration")}>Call Registration</li>
            <li>Reports</li>
            <li>Uploader</li>
          </ul>
        )}
      </div>

      <div className="relative">
        <button className="user-icon" onClick={() => setShowUserMenu(!showUserMenu)}>
          <FaUserCircle />
        </button>
        {showUserMenu && (
          <div className="user-menu">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
