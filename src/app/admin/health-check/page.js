"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, ShieldCheck, Activity, Globe, Info, Link } from "lucide-react";

import SideBar from "@/components/SideBar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function HealthCheckPage() {
  const [ip, setIp] = useState("Loading...");
  const [mounted, setMounted] = useState(false);
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "v1.0.0";

  useEffect(() => {
    setMounted(true);
    const fetchIp = async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        setIp(res.data.ip);
      } catch (error) {
        console.error("Failed to fetch IP:", error);
        setIp("Unavailable");
      }
    };
    fetchIp();
  }, []);

  if (!mounted) return null;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#f5f7fa]">
        <SideBar />
        <div className="ml-[60px] flex-1 p-10 transition-all duration-300">
          <div className="mx-auto max-w-4xl">
            <header className="mb-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#714b67]">
                  System Health
                </h1>
                <p className="mt-1 text-gray-500">Real-time monitoring and status</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-green-700 shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold">System Live</span>
              </div>
            </header>

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Status Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Operational Status
                    </h2>
                    <p className="text-sm text-gray-500">Core services availability</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                    <span className="font-medium text-gray-700">Application</span>
                    <span className="flex items-center gap-1 font-bold text-green-600">
                      Running <Activity size={14} />
                    </span>
                  </div>
                  <p className="mt-2 rounded-lg bg-purple-50 py-3 text-center font-medium text-[#714b67] italic shadow-inner">
                    "Everything is running up and fine"
                  </p>
                </div>
              </div>

              {/* Environment Details */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Environment Info</h2>
                    <p className="text-sm text-gray-500">Infrastructure and versioning</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <Info size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-700">App Version</span>
                    </div>
                    <span className="rounded border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
                      {version}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-700">User IP Address</span>
                    </div>
                    <span className="rounded border border-gray-200 bg-white px-3 py-1 font-mono font-bold text-gray-900 shadow-sm">
                      {ip}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <Link size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-700">API Base URL</span>
                    </div>
                    <span className="rounded border border-gray-200 bg-white px-3 py-1 font-mono text-xs font-bold text-gray-900 shadow-sm">
                      {process.env.NEXT_PUBLIC_BASE_URL || "Not Set"}
                    </span>
                  </div>
                </div>
              </div>
            </main>

            {/* <footer className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2 text-sm text-gray-500 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                All systems are monitored hourly for optimal performance
              </div>
            </footer> */}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
