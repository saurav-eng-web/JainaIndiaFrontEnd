"use client";
import { useState } from "react";
import "./servicereg.css";
import CallRegister from "../call/page";

export default function ServiceRegistration() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showside, setShowside] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "mobileNumber") {
      setPhoneNumber(value);
    }
    if (name === "otp") {
      setOtp(value);
    }
  }

  function handleSubmit() {}

  return (
    <div>
      {/* Header with logo left and title centered */}
      <div className="fx-6 flex h-20 items-center border-b border-gray-100 bg-[#ffffff]">
        <img src="/black-logo.webp" className="ml-6 w-34" alt="sansui logo" />
        <p className="mr-12 flex-1 text-center text-lg font-bold">
          Job Registration
        </p>
      </div>

      <div className="main-content flex flex-col items-center">
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
              <button className="h-12 items-center rounded-md px-3 !text-sm !font-semibold text-white">
                Send OTP
              </button>
            </div>
          </div>

          {/* OTP Section */}
          <div className="flex-1">
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

        <div className="override-callregister-margin">
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
