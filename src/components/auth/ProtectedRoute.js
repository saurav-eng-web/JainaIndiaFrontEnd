// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode";

// /**
//  * ProtectedRoute
//  * - Checks for valid JWT token and allowed roles
//  * - Auto-logs out if token is expired
//  *
//  * @param {JSX.Element} children - Protected page content
//  * @param {Array<string>} allowedRoles - Roles that can access this page
//  */
// export default function ProtectedRoute({ children, allowedRoles = [] }) {
//   const router = useRouter();
//   const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     const userDataStr = localStorage.getItem("userData");

//     if (!userDataStr) {
//       router.replace("/login");
//       return;
//     }

//     try {
//       const user = JSON.parse(userDataStr);
//       const token = user.token;

//       if (!token) {
//         localStorage.removeItem("userData");
//         router.replace("/login");
//         return;
//       }

//       // Decode JWT to check expiry
//       const decoded = jwtDecode(token);
//       const currentTime = Math.floor(Date.now() / 1000);

//       if (decoded.exp && decoded.exp < currentTime) {
//         // Token expired
//         localStorage.removeItem("userData");
//         router.replace("/login");
//         return;
//       }

//       // Check role
//       const userRole = user.roleName?.toLowerCase();
//       if (
//         allowedRoles.length === 0 ||
//         allowedRoles.map((r) => r.toLowerCase()).includes(userRole)
//       ) {
//         setAuthorized(true);
//       } else {
//         router.replace("/login");
//       }
//     } catch (err) {
//       console.error("Auth check failed:", err);
//       localStorage.removeItem("userData");
//       router.replace("/login");
//     }
//   }, [router, allowedRoles]);

//   if (!authorized) return null;
//   return children;
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    }
  }, [router, allowedRoles]);

  if (!authorized) return null;
  return children;
}
