"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module (report dropdown + preview grid)
 * 16-Nov-2026           Replaced by the Reports page (/logistic/reports-hub), which has the date filter and downloads
 *                       the Excel directly like the legacy ReportLog.aspx. This route only redirects (old links/bookmarks).
 * -----------------------------------------------------------------------------
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogisticReportsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/logistic/reports-hub");
  }, [router]);

  return <div className="p-6 text-gray-600">Redirecting to Reports...</div>;
}
