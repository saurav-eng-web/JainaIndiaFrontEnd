"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { logger } from "@/utils/logger";

export default function SendHappyCode() {
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
  }, [router]);

  async function sendSMS({ primaryno, altNo, happycode }) {
    const message = `Dear Customer, Service Request No.- ${complaintNo} assigned to engineer, Pls Provide H-Code :${happycode} only after satisfactory job completion. Jaina India`;

    // Validate numbers
    const isValid = (num) => /^\d{10}$/.test(num);
    const primaryValid = isValid(primaryno);
    const altValid = isValid(altNo);

    let numbersToSend = [];

    if (primaryValid && altValid) {
      numbersToSend = primaryno === altNo ? [primaryno] : [primaryno, altNo];
    } else if (primaryValid) {
      numbersToSend = [primaryno];
    } else if (altValid) {
      numbersToSend = [altNo];
    } else {
      throw new Error("No valid mobile numbers available to send SMS.");
    }

    const sendSingleSMS = async (mobile) => {
      const payload = new URLSearchParams();
      payload.append("message", message);
      payload.append("mobile", mobile);
      payload.append("ticketKey", complaintNo);
      payload.append("source", "OTPWebCR");

      return axiosInstance.post("SMS/send", payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    };

    const results = [];

    for (const mobile of numbersToSend) {
      try {
        const res = await sendSingleSMS(mobile);
        results.push({ mobile, success: true, data: res.data });
      } catch (err) {
        results.push({ mobile, success: false, error: err.message });
      }
    }

    return results;
  }

  // ------------------ Main Handler ------------------
  const handleSend = async () => {
    if (!complaintNo || complaintNo.length < 10) {
      toast.error("Enter a valid Complaint Number");
      return;
    }

    if (!userName) {
      return;
    }

    const fullOperation = async () => {
      // Step 1: Check happy code
      const checkRes = await axiosInstance.post(`CheckHappyCode/check`, {
        TK: complaintNo,
        UserName: userName,
      });

      const happycode = checkRes.data?.happycode;

      // if (!happycode || happycode === 0) {
      //   toast.error(checkRes?.data?.StatusMsg);
      //   return;
      // }

      if (!happycode || happycode === 0) {
        throw new Error(`${checkRes?.data?.StatusMsg}`);
      }

      // Step 2: Extract mobile numbers
      const { primaryno, altNo } = checkRes.data;

      // Step 3: Send SMS to one/both numbers
      const smsResults = await sendSMS({ primaryno, altNo, happycode });

      // Step 4: Optional: check failures and show message
      const allFailed = smsResults.every((r) => !r.success);
      if (allFailed) {
        throw new Error("SMS failed for all numbers.");
      }

      return smsResults;
    };

    toast.promise(
      fullOperation(),
      {
        loading: "Sending happy code...",
        success: "Happy code sent successfully!",
        error: (err) => err.message || "Could not send happy code.",
      },
      {
        style: { minWidth: "400px" },
      }
    );
  };

  const handleBack = async () => {
    router.back();
  };

  return (
    <PageSkeleton title="Send Happy Code" rolesAllowed={["asm", "sf/ssd"]}>
      <div className="mt-5 flex flex-col items-start gap-2.5">
        <input
          type="text"
          placeholder="Enter Complaint Number"
          className="w-[350px] rounded-md border border-[#714b67] bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#714b67]"
          value={complaintNo}
          onChange={(e) => setComplaintNo(e.target.value)}
        />
        <div className="mt-5 flex gap-2.5">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </PageSkeleton>
  );
}
