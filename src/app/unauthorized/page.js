import SideBar from "@/components/SideBar";

export default function Unauthorized() {
    return (
      <>   <SideBar />
      <div className="flex h-screen items-center justify-center text-red-600 text-2xl font-bold">
        🚫 Unauthorized Access
      </div>
      </>

    );
  }