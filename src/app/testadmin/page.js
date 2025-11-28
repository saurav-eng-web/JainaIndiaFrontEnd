"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";

export default function Test() {
  // const router = useRouter();

  // useEffect(() => {
  //   const userData = localStorage.getItem('userData');
  //   if (!userData) {
  //     router.replace('/');
  //     return;
  //   }

  //   const user = JSON.parse(userData);
  //   const role = user.roleName?.toLowerCase();

  //   // 🚫 Redirect if role is not 'nsp'
  //   if (role !== 'nsp') {
  //     // alert('Unauthorized: NSP access only');
  //     router.replace('/');
  //   }
  // }, [router]);

  return (
    <div className="flex min-h-screen bg-[#d1e7ff]">
      <SideBar />
      <div className="flex flex-1 items-start justify-center pt-[100px]">
        <div className="w-full max-w-[600px] rounded-[12px] bg-gradient-to-br from-white via-[#d1e7ff] to-slate-500 p-[40px] text-center shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <h2 className="mb-[30px] text-[28px] font-semibold text-[#333]">
            Welcome to Jaina CRM
          </h2>
          <div className="flex flex-col items-center gap-[20px]">
            <button
              className="w-[400px] rounded-[8px] bg-[#2979ff] px-[24px] py-[16px] text-[18px] font-bold text-white transition-colors hover:bg-[#1565c0]"
              onClick={() => router.push("call")}
            >
              ➕ test
            </button>
            <button
              className="w-[400px] rounded-[8px] bg-[#2979ff] px-[24px] py-[16px] text-[18px] font-bold text-white transition-colors hover:bg-[#1565c0]"
              onClick={() => router.push("/search-complaint")}
            >
              🔍 Search Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
