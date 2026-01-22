"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

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
      router.replace("/login"); // Not logged in
      return;
    }

    try {
      const user = JSON.parse(userData);
      const role = user.roleName?.toLowerCase();
      const allowed = allowedRoles.map((x) => x.toLowerCase());

      if (allowed.length === 0 || allowed.includes(role)) {
        setAuthorized(true);
      } else {
        router.replace("/unauthorized");
      }
    } catch {
      router.replace("/login");
    }
  }, [router, allowedRoles]);

  if (!authorized) return null;
  return children;
}
