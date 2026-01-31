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
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";

// --- Configuration & Constants ---
const CRITICAL_SERVICES = ["mongo", "mongo-replica", "database", "auth"];
const HIGH_SERVICES = ["kafka", "queue", "sql"];

const SERVICE_PRIORITY = {
  mongo: 1,
  "mongo-replica": 1,
  database: 1,
  kafka: 2,
  sql: 3,
  default: 4,
};

// --- Helper Functions ---
const getServicePriority = (serviceName) => {
  const normalized = serviceName.toLowerCase();
  if (normalized.includes("mongo")) return SERVICE_PRIORITY.mongo;
  if (normalized.includes("kafka")) return SERVICE_PRIORITY.kafka;
  if (normalized.includes("sql")) return SERVICE_PRIORITY.sql;
  return SERVICE_PRIORITY.default;
};

const parseDownSince = (description) => {
  if (!description) return null;
  // Example: "Mongo DOWN | Down since: 2026-01-30 05:45:57 UTC"
  const match = description.match(/Down since: (.+)(?:\sUTC)?/);
  if (match && match[1]) {
    const downDate = new Date(match[1]);
    if (!isNaN(downDate.getTime())) {
      const diffMs = new Date() - downDate;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${diffMins} minutes`;
      const diffHrs = Math.floor(diffMins / 60);
      return `${diffHrs} hours`;
    }
  }
  return null;
};

const getActionHint = (serviceName) => {
  const lower = serviceName.toLowerCase();
  if (lower.includes("mongo") || lower.includes("sql") || lower.includes("database")) {
    return "Check database connection & logs";
  }
  if (lower.includes("kafka") || lower.includes("queue")) {
    return "Verify consumer groups & broker status";
  }
  return "Check service logs";
};

export default function HealthCheckPage() {
  const [ip, setIp] = useState("Loading...");
  const [backendHealth, setBackendHealth] = useState(null); // null = loading
  const [isLoading, setIsLoading] = useState(true);
  const [isEnvExpanded, setIsEnvExpanded] = useState(true);
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "v1.0.0";

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        setIp(res.data.ip);
      } catch (error) {
        setIp("Unavailable");
      }
    };

    const fetchBackendHealth = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("https://ncapi.jainaindia.com/health/ready");
        setBackendHealth(res.data);
      } catch (error) {
        if (error.response && error.response.status === 503) {
          setBackendHealth(error.response.data);
        } else {
          console.error("Failed to fetch backend health:", error);
          // Don't show toast on 503, only on real network errors if needed
          // toast.error(`Failed to connect: ${error.message}`);
          setBackendHealth({ status: "Unreachable", checks: [] });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchIp();
    fetchBackendHealth();
  }, []);

  // --- Derived State ---
  const systemState = useMemo(() => {
    if (!backendHealth || !backendHealth.checks) {
      return { status: "unknown", color: "gray", message: "Checking system status..." };
    }

    const checks = backendHealth.checks;
    const unhealthyChecks = checks.filter((c) => c.status !== "Healthy");

    if (unhealthyChecks.length === 0) {
      return {
        status: "healthy",
        color: "green",
        message: "All Systems Operational",
        subtext: "Backend and Frontend are running smoothly.",
      };
    }

    const criticalDown = unhealthyChecks.some((c) =>
      CRITICAL_SERVICES.some((crit) => c.service.toLowerCase().includes(crit))
    );

    if (criticalDown) {
      const failedServices = unhealthyChecks.map((c) => c.service).join(", ");
      return {
        status: "critical",
        color: "red",
        message: `System Unhealthy – ${failedServices} Down`,
        subtext: "Critical dependencies are unreachable. Immediate action required.",
      };
    }

    return {
      status: "degraded",
      color: "orange",
      message: "System Degraded – Limited Functionality",
      subtext: "Some non-critical services are experiencing issues.",
    };
  }, [backendHealth]);

  const sortedChecks = useMemo(() => {
    if (!backendHealth?.checks) return [];
    return [...backendHealth.checks].sort((a, b) => {
      // 1. Sort by Status (Unhealthy first)
      if (a.status !== "Healthy" && b.status === "Healthy") return -1;
      if (a.status === "Healthy" && b.status !== "Healthy") return 1;

      // 2. Sort by Priority
      const pA = getServicePriority(a.service);
      const pB = getServicePriority(b.service);
      return pA - pB;
    });
  }, [backendHealth]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <Activity className="animate-spin" size={32} />
          <span className="font-medium">Running System Diagnostics...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#f5f7fa]">
        <SideBar />
        <div className="ml-[60px] flex-1 p-8 transition-all duration-300">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* 1. Global Health Banner */}
            <div
              className={`flex items-start gap-4 rounded-xl border p-6 shadow-sm ${
                systemState.status === "healthy"
                  ? "border-green-200 bg-green-50 text-green-900"
                  : systemState.status === "critical"
                    ? "border-red-200 bg-red-50 text-red-900"
                    : "border-orange-200 bg-orange-50 text-orange-900"
              }`}
            >
              <div
                className={`rounded-full p-2 ${
                  systemState.status === "healthy"
                    ? "bg-green-100 text-green-600"
                    : systemState.status === "critical"
                      ? "bg-red-100 text-red-600"
                      : "bg-orange-100 text-orange-600"
                }`}
              >
                {systemState.status === "healthy" ? (
                  <CheckCircle size={32} />
                ) : systemState.status === "critical" ? (
                  <XCircle size={32} />
                ) : (
                  <AlertTriangle size={32} />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{systemState.message}</h2>
                <p className="mt-1 font-medium opacity-90">{systemState.subtext}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* 2. Backend Health (Dominant Section) */}
              <div className="space-y-4 lg:col-span-2">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                  <Activity size={20} className="text-[#714b67]" /> Backend Services
                </h3>
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-50 p-6">
                    <div>
                      <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                        Operational Status
                      </p>
                      <h4
                        className={`mt-1 text-2xl font-bold ${
                          backendHealth?.status === "Healthy"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {backendHealth?.status || "Unknown"}
                      </h4>
                    </div>
                    {backendHealth?.status !== "Healthy" && (
                      <span className="rounded border border-red-200 bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                        ACTION REQUIRED
                      </span>
                    )}
                  </div>

                  {/* List */}
                  <div className="divide-y divide-gray-50">
                    {sortedChecks.map((check, idx) => {
                      const isUnhealthy = check.status !== "Healthy";
                      const isCritical = CRITICAL_SERVICES.some((s) =>
                        check.service.toLowerCase().includes(s)
                      );
                      const downDuration = parseDownSince(check.description);

                      return (
                        <div
                          key={idx}
                          className={`p-6 transition-colors ${
                            isUnhealthy ? "bg-red-50/30" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {isUnhealthy ? (
                                <XCircle className="shrink-0 text-red-500" size={20} />
                              ) : (
                                <CheckCircle
                                  className="shrink-0 text-green-500"
                                  size={20}
                                />
                              )}
                              <div>
                                <h5 className="flex items-center gap-2 font-bold text-gray-800 capitalize">
                                  {check.service}
                                  {isUnhealthy && isCritical && (
                                    <span className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-red-800 uppercase">
                                      Critical
                                    </span>
                                  )}
                                </h5>
                                {/* Derived Action Hint */}
                                {isUnhealthy && (
                                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                                    <Info size={12} /> {getActionHint(check.service)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span
                              className={`text-sm font-bold ${isUnhealthy ? "text-red-600" : "text-green-600"}`}
                            >
                              {check.status}
                            </span>
                          </div>

                          {/* Rich Error Block */}
                          {isUnhealthy && check.description && (
                            <div className="mt-4 ml-8 rounded-lg border border-red-200 bg-white p-4 shadow-sm">
                              <p className="text-sm font-semibold text-gray-800">
                                {check.service.toUpperCase()} is unreachable or
                                unresponsive.
                              </p>
                              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                {downDuration && (
                                  <span className="rounded bg-red-50 px-2 py-1 font-mono font-bold text-red-700">
                                    Down for {downDuration}
                                  </span>
                                )}
                                <span
                                  title={check.description}
                                  className="max-w-[300px] cursor-help truncate border-b border-dotted border-gray-400"
                                >
                                  Raw: {check.description}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {sortedChecks.length === 0 && (
                      <div className="p-8 text-center text-gray-400">
                        No active checks found.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${systemState.status === "healthy" ? "bg-indigo-50 text-indigo-600" : "bg-orange-50 text-orange-600"}`}
                    >
                      <Globe size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">Frontend Status</h3>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Availability
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                        <Activity size={14} /> Operational
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-500">
                      {systemState.status === "healthy"
                        ? "Frontend is serving traffic normally. All connections verified."
                        : "Frontend is running, but user experience may be degraded due to backend issues."}
                    </p>
                  </div>
                </div>

                {/* Environment Info - De-emphasized */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <button
                    onClick={() => setIsEnvExpanded(!isEnvExpanded)}
                    className="flex w-full items-center justify-between bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2 text-gray-600">
                      <ShieldCheck size={18} />
                      <span className="text-sm font-semibold">Environment Details</span>
                    </div>
                    {isEnvExpanded ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </button>

                  {isEnvExpanded && (
                    <div className="space-y-3 border-t border-gray-100 p-4 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>App Version</span>
                        <span className="rounded bg-amber-50 px-2 py-0.5 font-mono text-xs text-amber-700">
                          {version}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>User IP</span>
                        <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700">
                          {ip}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>API Endpoint</span>
                        <span
                          title={process.env.NEXT_PUBLIC_BASE_URL}
                          className="max-w-[150px] truncate font-mono text-xs opacity-70"
                        >
                          {process.env.NEXT_PUBLIC_BASE_URL || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}
                  {!isEnvExpanded && (
                    <div className="border-t border-gray-100 bg-white px-4 py-2">
                      <p className="text-center text-[10px] text-gray-400">
                        v{version} • {ip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
