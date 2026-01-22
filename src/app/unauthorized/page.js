import SideBar from "@/components/SideBar";

export default function Unauthorized() {
  return (
    <>
      {" "}
      <SideBar />
      <div className="flex h-screen items-center justify-center text-2xl font-bold text-red-600">
        🚫 Unauthorized Access
      </div>
    </>
  );
}
