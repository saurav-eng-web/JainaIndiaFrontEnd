"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { logout } from "@/redux/slices/authSlice";

export default function SessionSync() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleStorageChange = (event) => {
      // We only care about the 'userData' key being changed from another tab
      if (event.key === "userData") {
        const newValue = event.newValue;
        
        if (!newValue) {
          // User logged out from another tab
          dispatch(logout());
          router.replace("/login");
          return;
        }

        try {
          const newUser = JSON.parse(newValue);
          const oldUserId = user?.userID;
          const newUserId = newUser?.userID;

          // If the user changed to a DIFFERENT account
          if (oldUserId && newUserId && oldUserId !== newUserId) {
            Swal.fire({
              title: "Session Changed",
              text: "The logged-in account was changed in another tab. You will be redirected.",
              icon: "warning",
              confirmButtonText: "OK",
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then(() => {
              // We use window.location.href instead of router.push to force a hard reload,
              // which guarantees all React state/forms are cleared and rebuilt for the new user.
              window.location.href = "/search-complaint";
            });
          } else if (!oldUserId && newUserId) {
             // Edge case: Tab was completely unauthenticated, but logged in somewhere else
             // Optional: redirect to dashboard
             window.location.href = "/search-complaint";
          }
        } catch (error) {
          console.error("Error parsing new user data in storage listener", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch, router, user]);

  // Headless component
  return null;
}
