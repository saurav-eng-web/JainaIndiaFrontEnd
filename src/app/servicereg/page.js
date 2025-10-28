"use client";
import { useEffect, useRef, useState } from "react";
import "./servicereg.css";
import CallRegister from "../call/page";
import axios from "axios";

export default function ServiceRegistration() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showside, setShowside] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const callRegisterRef = useRef(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const id = process.env.NEXT_PUBLIC_ID;
  const pass = process.env.NEXT_PUBLIC_PASS;

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "mobileNumber") {
      setPhoneNumber(value);
    }
    if (name === "otp") {
      setOtp(value);
    }
  }

  async function handleSendOTP() {
    if (!phoneNumber || phoneNumber.length !== 10) return;
    try {
      const response = await axios.post(
        `${BASE_URL}/SMS/send`,
        `message=Dear Customer, Your OTP is {ticketKey}. Jaina India&mobile=${phoneNumber}&ticketKey=1234&source=OTPWebCR`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (response.status == 200) {
        setShowOtp(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }

  async function handleLogin() {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        userName: id.trim(),
        uPassword: pass.trim(),
      });

      const data = response.data;
      if (data.returnCode === 1 && data.token) {
        const user = {
          userID: data.userID,
          roleID: data.roleID,
          roleName: data.roleName,
          userName: data.userName,
          sF_ID: data.sF_ID,
          cat_MapID: data.cat_MapID,
          asmid: data.asmid,
          branch_ID: data.branch_ID,
          token: data.token,
        };

        localStorage.setItem("userData", JSON.stringify(user));
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (showside && callRegisterRef.current) {
      callRegisterRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showside]);

  return (
    <div>
      {/* Header with logo left and title centered */}
      <div className="fx-6 flex h-20 items-center border-b border-gray-100 bg-[#ffffff]">
        <img src="/black-logo.webp" className="ml-6 w-34" alt="sansui logo" />
        <p className="flex-1 pr-32 text-center text-lg font-bold">
          Job Registration
        </p>
      </div>

      <div className="-mt-4 flex flex-col items-center">
        <div className="registration-container flex gap-8">
          {/* Phone Section */}
          <div className="flex-1">
            <label className="mb-2 block" htmlFor="mobileNumber">
              Phone Number
            </label>
            <div className="flex items-center gap-2">
              <InputField
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={handleChange}
                maxLength={10}
                type="tel"
              />
              <button
                onClick={handleSendOTP}
                className="h-12 items-center rounded-md px-3 !text-sm !font-semibold text-white"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* OTP Section */}
          <div
            className={`flex-1 transition-all duration-300 ${
              showOtp ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            <label className="mb-2 block" htmlFor="otp">
              OTP
            </label>
            <div className="flex items-center gap-2">
              <InputField
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleChange}
                maxLength={6}
                type="text"
              />
              <button
                onClick={() => setShowside((prevShow) => !prevShow)}
                className="h-12 rounded-md bg-green-500 px-3 font-semibold text-white"
              >
                Validate OTP
              </button>
            </div>
          </div>
        </div>

        <div
          className="override-callregister-margin -mt-18"
          ref={callRegisterRef}
        >
          {showside && <CallRegister showSidebar={false} />}
        </div>
      </div>
    </div>
  );
}

// Separate Input Component
function InputField({
  id,
  name,
  placeholder,
  value,
  onChange,
  maxLength,
  type = "text",
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className="h-12 w-full rounded-md border border-gray-300 p-3 text-sm"
    />
  );
}
