"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { loginUser } from "@/redux/slices/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userName = e.target.username.value;
    const uPassword = e.target.password.value;
    dispatch(loginUser({ userName, uPassword }));
  };

  useEffect(() => {
    if (user) {
      const role = user.roleName?.toLowerCase();
      if (role === "br") {
        router.push("/search-complaint");
      } else if (role === "cc") {
        router.push("/cc/home");
      } else if (role === "technician") {
        router.push("/technician/jobs");
      } else if (role === "sf/ssd") {
        router.push("/search-complaint");
      } else if (role === "asm") {
        router.push("/search-complaint");
      } else if (role === "zone") {
        router.push("/search-complaint");
      } else {
        router.push("/unauthorized");
      }
    }
  }, [user]);

  return (
    <div className="flex h-screen font-sans">
      {/* Left Section */}
      <div
        className="relative flex flex-1 flex-col justify-center bg-cover bg-center p-16 text-white"
        style={{ backgroundImage: "url('/Banner.png')" }}
      ></div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-sm">
          <h2 className="mb-2 text-2xl font-semibold">Sign in to your account</h2>
          <p className="mb-6 text-sm text-gray-600"></p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your Username"
                required
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:outline-none"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg py-3 text-white transition duration-200 hover:opacity-90"
              style={{ backgroundColor: "#714b67" }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
            {/* Error */}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
