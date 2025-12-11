"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SideBar from "@/components/SideBar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import axiosInstance from "@/api/axiosInstance";
import { logger } from "@/utils/logger";

export default function SearchComplaintPage() {
  const router = useRouter();
  const [complaintNo, setComplaintNo] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      router.replace("/");
    }
    const { userName } = JSON.parse(userData);
    setUserName(userName);
  }, []);

  const handleSend = async () => {
    if (complaintNo === "" || complaintNo.length < 10) {
      alert("Enter Complaint Number");
      return;
    }

    if (userName === "") {
      return;
    }

    try {
      const res = await axiosInstance.post(`/CheckHappyCode/check`, {
        TK: complaintNo,
        UserName: userName,
      });

      console.log("res: ", res.data);
    } catch (error) {
      logger.error(`Error sending happy code: ${error.message}`, "Sending happy code", {
        userName,
        complaintNo,
      });
    }
  };

  const handleBack = async () => {
    router.back();
  };

  return (
    <ProtectedRoute allowedRoles={["asm", "sf/ssd"]}>
      <div className="flex w-full">
        <SideBar />

        {/* Content Wrapper */}
        <div className="ml-[60px] w-full transition-all duration-300 ease-in-out">
          {/* Main Container */}
          <div className="mt-10 ml-10 max-w-[1300px] rounded-xl bg-[#dee2e6] p-10">
            {/* Header */}
            <h2 className="mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
              Send Happy Code
            </h2>

            {/* Search Box Section */}
            <div className="mt-5 flex flex-col items-start gap-2.5">
              <input
                type="text"
                placeholder="Enter Complaint Number"
                className="w-[350px] rounded-md border border-[#714b67] bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#714b67]"
                value={complaintNo}
                onChange={(e) => setComplaintNo(e.target.value)}
              />
              <div className="mt-5 flex gap-2.5">
                <button
                  className="w-28 cursor-pointer rounded-lg bg-white px-5 py-3 text-base font-bold text-[#714b67] transition-colors duration-300 hover:bg-[#5a3c52]"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="w-28 cursor-pointer rounded-lg bg-[#714b67] px-5 py-3 text-base font-bold text-white transition-colors duration-300 hover:bg-[#5a3c52]"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
