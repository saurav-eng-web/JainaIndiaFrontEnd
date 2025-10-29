"use client";
import { useEffect, useRef, useState } from "react";
import "./servicereg.css";
import axios from "axios";
import WebCallRegister from "./WebCallRegister";

export default function ServiceRegistration() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showside, setShowside] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState(""); // store generated OTP
  const callRegisterRef = useRef(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const id = process.env.NEXT_PUBLIC_ID;
  const pass = process.env.NEXT_PUBLIC_PASS;

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "mobileNumber") setPhoneNumber(value);
    if (name === "otp") setOtp(value);
  }

  async function handleValidateOtp() {
    if (otp.trim() === generatedOtp.trim()) {
      setOtpError("");
      await handleLogin();
    } else {
      setOtpError("❌ Invalid OTP. Please try again.");
    }
  }

  function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async function handleSendOTP() {
    if (!phoneNumber || phoneNumber.length !== 10) return;

    setIsLoading(true);

    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtpError("");

    try {
      const response = await axios.post(
        `${BASE_URL}/SMS/send`,
        `message=Dear Customer, Your OTP is ${newOtp}. Jaina India&mobile=${phoneNumber}&ticketKey=${newOtp}&source=OTPWebCR`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      setResendTimer(180); // start countdown
      setTimeout(() => setIsLoading(false), 800); // fake delay

      if (response.status === 200) {
        setShowOtp(true);
      }
      // await handleLogin();
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleValidateOtp() {
    await handleLogin();
  }

  async function handleLogin() {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        userName: id.trim(),
        uPassword: pass.trim(),
      });
      const data = response.data;
      if (data.returnCode === 1 && data.token) {
        localStorage.setItem("userData", JSON.stringify(data));
        setShowside(true);
        setOtpVerified(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex h-20 items-center border-b border-gray-100 bg-white px-4 md:px-8">
        <img
          src="/black-logo.webp"
          className="w-28 md:w-36"
          alt="sansui logo"
        />
        <p className="flex-1 text-center text-sm font-semibold md:pr-32 md:text-lg">
          Job Registration
        </p>
      </div>

      {/* Main Section */}
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4">
        <div
          className={`registration-container flex w-full flex-col gap-6 md:flex-row md:gap-8 ${otpVerified ? "hidden" : ""}`}
        >
          {/* Phone Section */}
          <div className="flex-1">
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="mobileNumber"
            >
              Phone Number
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <InputField
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={handleChange}
                maxLength={10}
                type="tel"
                // disabled={showOtp}
                disabled={resendTimer > 0}
              />
              <button
                disabled={isLoading || resendTimer > 0}
                onClick={handleSendOTP}
                className="h-12 w-full rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6 sm:text-base"
              >
                {isLoading
                  ? "Sending..."
                  : resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : showOtp
                      ? "Resend OTP"
                      : "Send OTP"}
              </button>
            </div>
          </div>

          {/* OTP Section */}
          <div
            className={`flex-1 transition-all duration-300 ${
              showOtp ? "visible opacity-100" : "invisible h-0 opacity-0"
            } md:${showOtp ? "block" : "invisible h-0 opacity-0"} ${
              !showOtp ? "hidden md:block" : ""
            }`}
          >
            <label className="mb-2 block text-sm font-medium" htmlFor="otp">
              OTP
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
                onClick={handleValidateOtp}
                className="h-12 w-full rounded-md bg-green-600 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-green-700 sm:w-auto sm:px-6 sm:text-base"
              >
                Validate OTP
              </button>
            </div>

            {otpError && (
              <p className="mt-2 text-sm font-medium text-red-500">
                {otpError}
              </p>
            )}

            {/* Resend + Change Number Options */}
            {/* {showOtp && (
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                {resendTimer > 0 ? (
                  <span className="text-sm text-gray-600">
                    You can resend OTP in {resendTimer}s
                  </span>
                ) : (
                  <button
                    onClick={handleSendOTP}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowOtp(false);
                    setPhoneNumber("");
                    setOtp("");
                    setOtpError("");
                    setResendTimer(0);
                  }}
                  className="text-sm font-medium text-gray-600 hover:underline sm:ml-auto"
                >
                  Change Number
                </button>
              </div>
            )} */}
          </div>
        </div>

        {/* Call Register Section */}
        <div className="w-full" ref={callRegisterRef}>
          {showside && <WebCallRegister showSidebar={false} />}
        </div>
      </div>
    </div>
  );
}

function InputField({
  id,
  name,
  placeholder,
  value,
  onChange,
  maxLength,
  type = "text",
  disabled,
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
      disabled={disabled}
      className={`h-12 !w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100`}
    />
  );
}
