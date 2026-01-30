"use client";

import axios from "axios";
import {
  CheckCircle,
  ShieldCheck,
  Activity,
  Globe,
  Info,
  Link,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";

export default function HealthCheckPage() {
  const [ip, setIp] = useState("Loading...");
  const [backendHealth, setBackendHealth] = useState(null);
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

    const fetchBackendHealth = async () => {
      try {
        const res = await axios.get("https://ncapi.jainaindia.com/health/ready");
        setBackendHealth(res.data);
      } catch (error) {
        if (error.response && error.response.status === 503) {
          // 503 is returned when the system is unhealthy, but we still want to show the details
          setBackendHealth(error.response.data);
          return;
        }

        console.error("Failed to fetch backend health:", error);
        toast.error(`Failed to fetch backend health ${error.message}`);

        setBackendHealth({ status: "Unreachable", checks: [] });
      }
    };

    fetchIp();
    fetchBackendHealth();
  }, []);

  if (!mounted) return null;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#f5f7fa]">
        <SideBar />
        <div className="ml-[60px] flex-1 p-10 transition-all duration-300">
          <div className="mx-auto max-w-6xl">
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

            <main className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Status Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Frontend Status</h2>
                    <p className="text-sm text-gray-500">Client-side availability</p>
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

              {/* Backend Status Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Activity size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Backend Health</h2>
                    <p className="text-sm text-gray-500">API & Services</p>
                  </div>
                </div>

                {backendHealth ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                      <span className="font-medium text-gray-700">Overall Status</span>
                      <span
                        className={`flex items-center gap-2 font-bold ${backendHealth.status === "Healthy" ? "text-green-600" : "text-red-600"}`}
                      >
                        {backendHealth.status === "Healthy" ? (
                          <CheckCircle size={16} />
                        ) : (
                          <AlertCircle size={16} />
                        )}
                        {backendHealth.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-col gap-3">
                      <h3 className="px-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                        Dependencies
                      </h3>
                      {(backendHealth.checks || []).map((check, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-2 rounded-lg border border-dashed border-gray-200 p-3 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-700 capitalize">
                              {check.service}
                            </span>
                            <span
                              className={`flex items-center gap-1.5 text-sm font-medium ${check.status === "Healthy" ? "text-green-600" : "text-red-500"}`}
                            >
                              {check.status === "Healthy" ? (
                                <CheckCircle size={14} />
                              ) : (
                                <XCircle size={14} />
                              )}
                              {check.status}
                            </span>
                          </div>
                          {check.status !== "Healthy" && check.description && (
                            <div className="mt-1 flex items-start gap-2 rounded bg-red-50 px-3 py-2 text-xs text-red-600">
                              <AlertCircle size={14} className="mt-0.5 shrink-0" />
                              <span className="leading-relaxed font-medium opacity-90">
                                {check.description}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center">
                    <span className="animate-pulse text-gray-400">
                      Loading health data...
                    </span>
                  </div>
                )}
              </div>

              {/* Environment Details */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Environment</h2>
                    <p className="text-sm text-gray-500">Infrastructure info</p>
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
                      <span className="font-medium text-gray-700">User IP</span>
                    </div>
                    <span className="rounded border border-gray-200 bg-white px-3 py-1 font-mono text-xs font-bold text-gray-900 shadow-sm">
                      {ip}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <Link size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-700">API URL</span>
                    </div>
                    <span
                      className="max-w-[120px] truncate rounded border border-gray-200 bg-white px-3 py-1 font-mono text-[10px] font-bold text-gray-900 shadow-sm"
                      title={process.env.NEXT_PUBLIC_BASE_URL}
                    >
                      {process.env.NEXT_PUBLIC_BASE_URL || "Not Set"}
                    </span>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
