"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
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
