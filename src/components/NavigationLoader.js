"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

import { showLoader, hideLoader } from "@/redux/slices/loaderSlice";

export default function NavigationLoader() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showLoader());

    // fade-out delay
    const timer = setTimeout(() => dispatch(hideLoader()), 400);

    return () => clearTimeout(timer);
  }, [pathname, dispatch]);

  return null;
}
