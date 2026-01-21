"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import CustomerDetailsStep from "./CallRegisterSteps/CustomerDetailsStep";
import AddressDetailsStep from "./CallRegisterSteps/AddressDetailsStep";
import ProductDetailsStep from "./CallRegisterSteps/ProductDetailsStep";
import ServiceDetailsStep from "./CallRegisterSteps/ServiceDetailsStep";

import SideBar from "@/components/SideBar";
import axiosInstance from "@/api/axiosInstance";
import { logger } from "@/utils/logger";

const steps = [
  "Customer Details",
  "Address Details",
  "Product Details",
  "Service Details",
];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const id = process.env.NEXT_PUBLIC_ID;

function CallRegisterInner({ showSidebar = true }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [callNumber, setCallNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [pincodeStatus, setPincodeStatus] = useState("");

  const [formData, setFormData] = useState({
    callBy: searchParams.get("callBy") || "",
    title: searchParams.get("title") || "",
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    phone: searchParams.get("phone") || "",
    altPhone: searchParams.get("altPhone") || "",
    customerAddress: searchParams.get("customerAddress") || "",
    landmark: searchParams.get("landmark") || "",
    pincode: "",
    state: "",
    city: "",
    locality: "",
    localityId: "",
    modelID: searchParams.get("modelID") || "",
    cityId: searchParams.get("cityId") || "",
    serialNo: searchParams.get("serialNo") || "",
    productCategory: searchParams.get("productCategory") || "",
    brand: searchParams.get("brand") || "",
    pop: searchParams.get("pop") || "",
    product: searchParams.get("product") || "",
    productID: searchParams.get("productID") || "",
    model: searchParams.get("model") || "",
    warranty: searchParams.get("warranty") || "",
    callType: searchParams.get("callType") || "",
    faultVoc: searchParams.get("faultVoc") || "",
    availableTime: searchParams.get("availableTime") || "",
    userIP: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      callBy: searchParams.get("callBy") || "",
      title: searchParams.get("title") || "",
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      phone: searchParams.get("phone") || "",
      altPhone: searchParams.get("altPhone") || "",
      modelID: searchParams.get("modelID") || "",
      cityId: searchParams.get("cityId") || "",
      serialNo: searchParams.get("serialNo") || "",
      productCategory: searchParams.get("productCategory") || "",
      brand: searchParams.get("brand") || "",
      pop: searchParams.get("pop") || "",
      product: searchParams.get("product") || "",
      productID: searchParams.get("productID") || "",
      model: searchParams.get("model") || "",
      warranty: searchParams.get("warranty") || "",
      callType: searchParams.get("callType") || "",
      faultVoc: searchParams.get("faultVoc") || "",
      availableTime: searchParams.get("availableTime") || "",
    }));
  }, [searchParams]);

  // AUTH CHECK
  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      router.replace("/");
      return;
    }
    const user = JSON.parse(userData);
    const role = user.roleName?.toLowerCase();

    if (role !== "cc") {
      router.replace("/");
    } else {
      setLoggedInUser(user);
    }
  }, [router]);

  useEffect(() => {
    const existing = localStorage.getItem("clientIP");
    if (existing) {
      setFormData((prev) => ({ ...prev, userIP: existing }));
      return;
    }
    (async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        const ip = res?.data?.ip || "";
        if (ip) {
          localStorage.setItem("clientIP", ip);
          setFormData((prev) => ({ ...prev, userIP: ip }));
        }
      } catch (e) {
        console.error("Failed to fetch IP:", e);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const requiredFieldsByStep = [
    ["callBy", "title", "firstName", "lastName", "phone", "altPhone"],
    ["customerAddress", "landmark", "pincode"],
    [
      "serialNo",
      "productCategory",
      "brand",
      "pop",
      "product",
      "model",
      "modelDescription",
      "warranty",
    ],
    ["callType", "faultVoc", "availableTime"],
  ];

  const fieldLabels = {
    callBy: "Call By",
    title: "Title",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone",
    altPhone: "Alternate Phone",
    customerAddress: "Customer Address",
    pincode: "Pincode",
    productCategory: "Product Category",
    brand: "Brand",
    callType: "Call Type",
    faultVoc: "Fault Description",
    availableTime: "Available Time",
    serialNo: "serial No",
    pop: "DOP",
  };

  const validateStep = () => {
    const fields = requiredFieldsByStep[currentStep] || [];
    const newErrors = {};
    fields.forEach((f) => {
      if (!`${formData[f] ?? ""}`.trim()) {
        newErrors[f] = `Please fill the required field: ${fieldLabels[f]}`;
      }
    });
    if (currentStep === 1) {
      const pin = `${formData.pincode || ""}`.trim();
      if (pincodeStatus === "checking") {
        newErrors.pincode = "Validating pincode… please wait";
      } else if (pin.length !== 6) {
        newErrors.pincode = "Please enter a 6-digit pincode";
      } else if (pincodeStatus !== "valid") {
        newErrors.pincode = "Please enter a valid pincode";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && validateStep()) setCurrentStep((s) => s + 1);
  };
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const submitCall = async () => {
    setLoading(true);

    const payload = {
      SALUTATION: formData.title || "",
      FIRSTNAME: formData.firstName || "",
      LASTNAME: formData.lastName || "",
      HMPH: formData.altPhone || "",
      WKPH: formData.altPhone || "",
      stdcode: formData.stdCode || "",
      pincode: formData.pincode || "",
      MOBILE: formData.phone || "",
      ADDRESS1: formData.customerAddress || "",
      ADDRESS2: formData.address2 || "",
      City_ID: formData.cityId || 0,
      Locality_ID: formData.localityId || 0,
      landmark: formData.landmark || "",
      Call_Category: formData.callType || "NA",
      Call_TypeID: formData.callTypeId || 4,
      CallBy_ID: formData.callById || 1,
      WarrantyID: formData.warrantyId || 3,
      CALL_TYPE: formData.callType || "NA",
      CALL_BY: formData.callBy || "Customer",
      Dealer: formData.dealer || "",
      WARRANTY: formData.warranty || "",
      PRODUCT: formData.product || "",
      Product_ID: formData.productID || 0,
      Model_ID: formData.modelID || 0,
      PURCHASE_DATE: formData.pop || "",
      SERIAL_NO: formData.serialNo || "",
      PROMISE_DATE: formData.serviceDate || "",
      PROMISE_TIME: formData.availableTime || "",
      Category: formData.productCategory || "",
      EnterBy: loggedInUser?.userName ? `${loggedInUser.firstName}-web` : "Unknown User",
      COMPLAINT_STATUS: "OK",
      Remarks: formData.faultVoc || "",
      Email: formData.email || "",
      Complaint_SubStatus: "",
      Excalated: 0,
      Legal: 0,
      EnteredBy: loggedInUser?.userName || "Unknown User",
      EnteredByID: loggedInUser?.userID || 0,
      IPAddress: formData.userIP || "0.0.0.0",
      Complaint: formData.callerNumber,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/callregister/create-complaint`,
        payload
      );
      setCallNumber(response.data?.returnNo || "");

      if (response.data.statusCode === 1) {
        await handleSendMessage(response.data?.returnNo);
      }
      setCurrentStep(0);
    } catch (err) {
      console.error("Call Register Error:", err);
      logger.error(`Call Register Error: ${err.message}`, "call/register", {
        payload,
      });
      alert("Error creating call: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  async function handleSendMessage(requestNo) {
    if (!requestNo) return;

    const { callType, phone: phoneNumber } = formData;
    if (!phoneNumber) return;

    const validTypes = ["Installation", "Demo", "Service"];
    if (!validTypes.includes(callType)) return;

    let message = "";

    if (["Installation", "Demo"].includes(callType)) {
      message = `Dear Customer, Thank you for choosing our product. Your installation request has been registered with ${requestNo}, Our team will contact you shortly. Jaina India`;
    } else if (callType === "Service") {
      message = `Dear Customer, Happy to serve you! Your request for service has been registered with ${requestNo}, Our team will contact you shortly. Jaina India`;
    }
    // TODO: this route is for next js, change this to real backend route
    try {
      await axiosInstance.post(
        `${BASE_URL}/SMS/send`,
        new URLSearchParams({
          message,
          mobile: phoneNumber,
          ticketKey: requestNo,
          source: "Welcome",
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
    } catch (error) {
      console.error("SMS send failed:", error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (currentStep === steps.length - 1) {
      submitCall();
    } else {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CustomerDetailsStep
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 1:
        return (
          <AddressDetailsStep
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            errors={errors}
            pincodeStatus={pincodeStatus}
            setPincodeStatus={setPincodeStatus}
          />
        );
      case 2:
        return (
          <ProductDetailsStep
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <ServiceDetailsStep
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {showSidebar && <SideBar />}

      <div className="ml-[60px] min-h-screen bg-gray-100 p-5 transition-all">
        <div className="mx-auto mt-10 max-w-[1100px] rounded-xl bg-white p-8 shadow-md">
          <h2 className="mb-8 rounded-lg border-2 border-[#714b67] px-3 py-2 text-left text-lg font-bold text-[#714b67]">
            Call Registration
          </h2>

          {callNumber ? (
            <div className="text-center">
              <h3 className="mb-8 text-xl font-semibold text-gray-800">
                Service Request Created Successfully!
              </h3>

              <p className="mb-6 text-base text-gray-700">
                Your Service Request Number is: <strong>{callNumber}</strong>
              </p>

              <button
                onClick={() => {
                  setCallNumber("");
                  setFormData({});
                }}
                className="cursor-pointer rounded-md bg-[#714b67] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#9b7f94]"
              >
                Register Another
              </button>
            </div>
          ) : (
            <>
              {/* Stepper */}
              <div className="relative mb-12 flex justify-between">
                {steps.map((label, idx) => (
                  <div
                    key={idx}
                    className="relative flex flex-1 flex-col items-center text-center"
                  >
                    <div
                      className={`z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${
                        idx <= currentStep ? "bg-[#714b67]" : "bg-gray-300"
                      }`}
                    >
                      {idx <= currentStep ? "\u2714\uFE0E" : ""}
                    </div>

                    <span className="mt-2 text-sm text-gray-700">{label}</span>

                    {idx < steps.length - 1 && (
                      <div className="absolute top-[18px] left-1/2 h-[3px] w-full bg-gray-300">
                        <div
                          className={`h-full ${idx < currentStep ? "bg-[#714b67]" : ""}`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {renderStep()}

                <div className="mt-6 flex justify-between gap-3">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={loading}
                      className="cursor-pointer rounded-md bg-[#714b67] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#9b7f94] disabled:opacity-50"
                    >
                      ← Back
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer rounded-md bg-[#714b67] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#9b7f94] disabled:opacity-50"
                  >
                    {currentStep < steps.length - 1
                      ? "Next →"
                      : loading
                        ? "Submitting…"
                        : "Submit \u2714\uFE0E"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ✅ Wrap in Suspense boundary for production builds
export default function CallRegister({ showSidebar = true }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallRegisterInner showSidebar={showSidebar} />
    </Suspense>
  );
}
