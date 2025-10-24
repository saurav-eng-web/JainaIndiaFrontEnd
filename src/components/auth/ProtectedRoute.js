"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute
 * @param {JSX.Element} children - The protected page content
 * @param {Array<string>} allowedRoles - List of allowed roles
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      router.replace("/"); // Not logged in
      return;
    }

    try {
      const user = JSON.parse(userData);
      const role = user.roleName?.toLowerCase();

      // If no roles specified, allow all logged-in users
      if (allowedRoles.length === 0 || allowedRoles.includes(role)) {
        setAuthorized(true);
      } else {
        router.replace("/login");
      }
    } catch {
      router.replace("/");
    }
  }, [router, allowedRoles]);

  if (!authorized) return null;
  return children;
}
