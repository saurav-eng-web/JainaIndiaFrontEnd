
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideBar from '@/components/SideBar';

export default function Test() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.replace('/');
      return;
    }

    const user = JSON.parse(userData);
    const role = user.roleName?.toLowerCase();

    // 🚫 Redirect if role is not 'nsp'
    if (role !== 'nsp') {
      // alert('Unauthorized: NSP access only');
      router.replace('/');
    }
  }, [router]);


  return (
    <div className="flex bg-[#d1e7ff] min-h-screen">
      <SideBar />
      <div className="flex justify-center items-start pt-[100px] flex-1">
        <div className="max-w-[600px] w-full p-[40px] text-center bg-gradient-to-br from-white via-[#d1e7ff] to-slate-500 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <h2 className="text-[28px] mb-[30px] text-[#333] font-semibold">
            Welcome to Jaina CRM
          </h2>
          <div className="flex flex-col items-center gap-[20px]">
            <button
              className=" w-[400px] py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] bg-[#2979ff] text-white hover:bg-[#1565c0] transition-colors"
              onClick={() => router.push('call')}
            >
              ➕ test
            </button>
            <button
              className="w-[400px] py-[16px] px-[24px] text-[18px] font-bold rounded-[8px] bg-[#2979ff] text-white hover:bg-[#1565c0] transition-colors"
              onClick={() => router.push('/search-complaint')}
            >
              🔍 Search Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
