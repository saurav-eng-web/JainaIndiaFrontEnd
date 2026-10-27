"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useRouter } from "next/navigation";
import { Button } from "./button";

/**
 * "Back" button for module pages.
 * Goes to the previous page in the browser history; when there is no previous page
 * (page opened directly / in a new tab), it navigates to `fallbackHref` instead.
 */
export default function BackButton({ fallbackHref = "/", label = "Back", className = "" }) {
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleBack} className={className}>
      &larr; {label}
    </Button>
  );
}
