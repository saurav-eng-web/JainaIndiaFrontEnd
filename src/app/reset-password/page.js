"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import InputWithLabel from "@/components/customui/InputWithLabel";
import PageSkeleton from "@/components/customui/PageSkeleton";
import { logout } from "@/redux/slices/authSlice";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [userName, setUserName] = useState("");

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      router.replace("/");
      return;
    }
    const user = JSON.parse(userData);
    const uName = user.userName;

    if (!uName) {
      router.replace("/");
    }

    setUserName(uName);
  }, [router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  async function handleChangePassword() {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill all the fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Password doesn't match, try again");
      setConfirmNewPassword("");
      return;
    }

    if (newPassword === oldPassword) {
      toast.error("Old password & new password are same, try again!");
      return;
    }

    console.log("", { oldPassword, newPassword, confirmNewPassword });
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/sflevel1/process", {
        type: "passwordreset",
        username: userName,
        oldpassword: oldPassword,
        ticket_no: "123",
        newpassword: newPassword,
      });

      const data = res.data;

      if (data.statusCode === 207) {
        toast.error(data?.statusMsg || "Unable to reset password");
      } else {
        toast.success("Password updated successfully, please login again");
        handleLogout();
      }
      console.log("data: ", data);
    } catch (error) {
      console.error("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageSkeleton title="Reset Password">
      <div className="overflow-x-auto rounded-xl border border-slate-300 p-8">
        <div className="flex gap-4">
          <InputWithLabel
            label="Old Password"
            type="password"
            placeholder="Enter your old password"
            className="w-xs"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <InputWithLabel
            label="New Password"
            type="password"
            placeholder="Enter new password"
            className="w-xs"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />{" "}
          <InputWithLabel
            label="Confirm New Password"
            type="password"
            placeholder="Confirm your new password"
            className="w-xs"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          {/* </div> */}
        </div>
        <div className="mt-4 flex gap-4">
          <Button disabled={isLoading} variant="outline" className="mt-6">
            Cancel
          </Button>

          <Button disabled={isLoading} className="mt-6" onClick={handleChangePassword}>
            {isLoading ? "Submitting..." : "Change Password"}
          </Button>
        </div>
      </div>
    </PageSkeleton>
  );
}
