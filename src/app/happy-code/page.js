"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SideBar from "@/components/SideBar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import axiosInstance from "@/api/axiosInstance";
import { logger } from "@/utils/logger";
import toast from "react-hot-toast";

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
  }, []);

  // async function sendSMS({ primaryno, altNo, happycode }) {
  //   // ---------- Helper: validate a 10-digit mobile number ----------
  //   const isValid = (num) => /^\d{10}$/.test(num);

  //   const primaryValid = isValid(primaryno);
  //   const altValid = isValid(altNo);
  //   const message = `Dear Customer, Service Request No.- ${complaintNo} assigned to engineer, Pls Provide H-Code :${happycode} only after satisfactory job completion. Jaina India`;

  //   // ---------- Determine the list of numbers to send ----------
  //   let numbersToSend = [];

  //   if (primaryValid && altValid) {
  //     if (primaryno === altNo) {
  //       // (1) Same numbers → send ONLY once
  //       numbersToSend = [primaryno];
  //     } else {
  //       // (4) Both valid & different → send to both
  //       numbersToSend = [primaryno, altNo];
  //     }
  //   } else if (primaryValid) {
  //     // (2) Only primary valid → send to primary
  //     numbersToSend = [primaryno];
  //   } else if (altValid) {
  //     // (2) Primary invalid → send to alt
  //     numbersToSend = [altNo];
  //   } else {
  //     throw new Error("No valid mobile numbers to send SMS.");
  //   }

  //   // ---------- Build request payload ----------
  //   const sendSingleSMS = async (mobile) => {
  //     const payload = new URLSearchParams();
  //     payload.append("message", message);
  //     payload.append("mobile", mobile);
  //     payload.append("ticketKey", complaintNo);
  //     payload.append("source", "OTPWebCR");

  //     return axiosInstance.post("SMS/send", payload, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });
  //   };

  //   // ---------- Send SMS to each number ----------
  //   const results = [];
  //   for (const mobile of numbersToSend) {
  //     try {
  //       const res = await sendSingleSMS(mobile);
  //       results.push({ mobile, success: true, response: res.data });
  //     } catch (err) {
  //       results.push({ mobile, success: false, error: err.message });
  //     }
  //   }

  //   return results;
  // }

  // const handleSend = async () => {
  //   if (complaintNo === "" || complaintNo.length < 10) {
  //     alert("Enter Complaint Number");
  //     return;
  //   }

  //   if (userName === "") {
  //     return;
  //   }

  //   try {
  //     const res = await axiosInstance.post(`/CheckHappyCode/check`, {
  //       TK: complaintNo,
  //       UserName: userName,
  //     });

  //     const happycode = res.data?.happycode;
  //     if (happycode !== 0) {
  //       const { primaryno, altNo } = res.data.mobileNumber;

  //       await sendSMS({ primaryno, altNo, happycode });
  //     }

  //     toast.promise(
  //       saveOperation,
  //       {
  //         loading: "Sending happy code...",
  //         success: "Happy code successfully!",
  //         error: "Could not send happy code.",
  //       },
  //       {
  //         style: {
  //           minWidth: "250px",
  //         },
  //       }
  //     );

  //     console.log("res: ", res.data);
  //   } catch (error) {
  //     logger.error(`Error sending happy code: ${error.message}`, "Sending happy code", {
  //       userName,
  //       complaintNo,
  //     });
  //     console.error("Error sending happy code:", error);
  //   }
  // };

  // ------------------ SMS Sender ------------------
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
      const checkRes = await axiosInstance.post(`/CheckHappyCode/check`, {
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
      const { primaryno, altNo } = checkRes?.data;

      // Step 3: Send SMS to one/both numbers
      const smsResults = await sendSMS({ primaryno, altNo, happycode });

      console.log("SMS results:", smsResults);

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
    // router.back();
    toast.error("Back to previous page");
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
