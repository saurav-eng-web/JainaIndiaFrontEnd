"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-6xl font-extrabold text-[#714b67]">404</h1>

        <h2 className="mt-4 text-xl font-semibold text-gray-800">Page not found</h2>

        <p className="mt-2 text-sm text-gray-600">
          Sorry, the page you are looking for doesn’t exist or may have been moved.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={() => router.back()}>Go back</Button>

          <Link href="/dashboard" className="w-full">
            <Button variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
