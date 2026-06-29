"use client";

import { useRouter } from "next/navigation";

import SideBar from "@/components/SideBar";
import { Button } from "@/components/customui/button";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Content */}
      <div className="ml-[60px] flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl text-red-600">🚫</span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold text-gray-800">Unauthorized Access</h1>

          {/* Message */}
          <p className="mt-2 text-sm text-gray-600">
            You don’t have permission to view this page.
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={() => router.back()}>Go Back</Button>

            <Button variant="outline" onClick={() => router.replace("/search-complaint")}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// import SideBar from "@/components/SideBar";

// export default function Unauthorized() {
//   return (
//     <>
//       {" "}
//       <SideBar />
//       <div className="flex h-screen items-center justify-center text-2xl font-bold text-red-600">
//         🚫 Unauthorized Access
//       </div>
//     </>
//   );
// }
