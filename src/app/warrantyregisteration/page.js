"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function WarrantyForm() {
  const { colors } = useTheme();
  const [step, setStep] = useState(1);

  const [serialNo, setSerialNo] = useState("");
  const [serialData, setSerialData] = useState(null);
  const [serialError, setSerialError] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [cityName, setCityName] = useState("");
  const [localities, setLocalities] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState("");
  const [pincodeError, setPincodeError] = useState("");

  const [dop, setDop] = useState("");
  const [retailer, setRetailer] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [brandList, setBrandList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [modelList, setModelList] = useState([]);

  const [manualBrand, setManualBrand] = useState("");
  const [manualProduct, setManualProduct] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [uploadedInvoiceName, setUploadedInvoiceName] = useState("");

  const fetchFallbackProductData = async () => {
    try {
      const [brandRes, productRes, modelRes] = await Promise.all([
        axiosInstance.get("BrandMaster"),
        axiosInstance.get("productmaster/GetAll"),
        // axiosInstance.get('Model')
      ]);
      setBrandList(brandRes.data || []);
      setProductList(productRes.data || []);
      setModelList(modelRes.data || []);
    } catch (err) {
      console.error("❌ Failed to load fallback brand/product/model", err);
    }
  };

  const handleInvoiceUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file); // ✅ must match backend param name

    try {
      const res = await axiosInstance.post(
        "WarrantyRegistration/upload-invoice",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      return res.data.fileName; // server returns { fileName: "xyz.png" }
    } catch (err) {
      console.error("❌ Invoice upload failed", err);
      toast.error("Failed to upload invoice");
      return null;
    }
  };

  const handleSerialCheck = async () => {
    if (!serialNo.trim()) {
      toast.error("Please enter a serial number");
      setSerialData(null);
      return;
    }

    try {
      const regCheck = await axiosInstance.get(
        `WarrantyRegistration/by-serial/${serialNo}`
      );
      if (regCheck.data && regCheck.data.serialNumber) {
        setAlreadyRegistered(true);
        toast.error("This serial number is already registered.");
        setSerialNo("");
        setSerialData(null);
        return;
      }
    } catch {
      setAlreadyRegistered(false);
    }

    try {
      const res = await axiosInstance.get(`SerialNoMaster/by-serial/${serialNo}`);
      setSerialData(res.data);
      setSerialError("");
    } catch (err) {
      toast.error("Invalid or unrecognized serial number");
      console.error("❌ Invalid or unrecognized serial number", err);
      fetchFallbackProductData();
    }
  };

  const handlePincodeCheck = async () => {
    if (!pincode.trim()) return;
    try {
      const res = await axiosInstance.get(`LocalityMaster/by-pincode/${pincode}`);
      const data = res.data;
      if (data.length === 0) {
        setPincodeError("❌ No serviceable area found for this pincode");
        setCityName("");
        setLocalities([]);
        return;
      }
      setCityName(data[0].city_Name || "");
      setLocalities(data);
      setSelectedLocality("");
      setPincodeError("");
    } catch {
      setPincodeError("❌ Failed to fetch city/locality for this pincode");
      setCityName("");
      setLocalities([]);
    }
  };

  const validateStep1 = () => {
    if (!dop || !retailer) {
      toast.error("Please fill Date of Purchase and Retailer fields.");
      return false;
    }
    if (serialData === "manual" && (!manualBrand || !manualProduct || !manualModel)) {
      toast.error("Please select brand, product, and model.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !pincode ||
      !selectedLocality ||
      !cityName
    ) {
      toast.error("Please fill all required personal fields.");
      return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const selectedCityObj = localities.find((l) => l.locality_Name === selectedLocality);
    const finalSerial = serialData?.itemSerialNo1 || serialNo;

    try {
      const regCheck = await axiosInstance.get(
        `WarrantyRegistration/by-serial/${finalSerial}`
      );
      if (regCheck.data && regCheck.data.serialNumber) {
        toast.error("This serial number is already registered.");
        return;
      }
    } catch {}

    // 🔹 Upload invoice first
    let uploadedFileName = null;
    if (invoice) {
      uploadedFileName = await handleInvoiceUpload(invoice);
      if (!uploadedFileName) {
        toast.error("Invoice upload failed, please try again.");
        return;
      }
    }

    // Construct JSON payload
    const payload = {
      CustomerName: firstName,
      LastName: lastName,
      PhoneNumber: phone,
      Address: address,
      Pincode: pincode,
      City: cityName,
      CityID: selectedCityObj?.locality_City || 0,
      Locality: selectedLocality,
      LocalityID: selectedCityObj?.locality_Id || 0,
      SerialNumber: finalSerial,
      Product: serialData?.product || manualProduct,
      ProductID: serialData?.productID || manualProduct,
      Model: serialData?.model || manualModel,
      ModelID: serialData?.modelID || manualModel,
      Tdate: new Date().toISOString(),
      EnterBy: "admin",
      DOP: dop,
      PurchaseFromRetailer: retailer,
      Invoice: uploadedFileName || "", // ✅ Save uploaded fileName here
      BrandID: serialData?.brandID || manualBrand,
      Brand: serialData?.brand || manualBrand,
      LandMark: landmark,
    };

    try {
      await axiosInstance.post("WarrantyRegistration/create", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // setShowSuccessPopup(true);
      toast.success("Registration successful!");
      setStep(1);

      // Reset all fields
      setSerialNo("");
      setSerialData(null);
      setSerialError("");
      setAlreadyRegistered(false);
      setFirstName("");
      setLastName("");
      setPhone("");
      setAddress("");
      setLandmark("");
      setPincode("");
      setCityName("");
      setLocalities([]);
      setSelectedLocality("");
      setPincodeError("");
      setDop("");
      setRetailer("");
      setInvoice(null);
      setManualBrand("");
      setManualProduct("");
      setManualModel("");
    } catch (err) {
      console.error("❌ Save failed", err);
      toast.error("Failed to register warranty");
    }
  };
  return (
    <ProtectedRoute allowedRoles={["cc"]}>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="ml-[60px] min-h-screen w-full bg-[#f4f6f8] p-8 transition-all">
          <div className="mx-auto my-8 max-w-[1100px] rounded-lg bg-white p-8 shadow">
            <h2
              className="mb-6 rounded-lg p-2 text-[18px] font-semibold"
              style={{
                color: colors.primary,
                border: `2px solid ${colors.primary}`,
              }}
            >
              Warranty Registration
            </h2>

            {/* Step Tracker */}
            <div className="relative mb-8 flex w-full items-center justify-center space-x-16">
              {/* Step 1 */}
              <div
                className={`z-10 flex flex-col items-center ${
                  step >= 1 ? "text-[#714b67]" : "text-gray-400"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 1 ? "bg-[#714b67] text-white" : "bg-gray-400 text-white"
                  }`}
                >
                  ✓
                </div>
                <span className="mt-1 text-sm">Product Details</span>
              </div>

              {/* Step line */}
              <div className="absolute top-4 z-0 mx-auto h-0.5 w-[18%] bg-gray-300"></div>

              {/* Step 2 */}
              <div
                className={`z-10 flex flex-col items-center ${
                  step >= 2 ? "text-[#714b67]" : "text-gray-400"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 2 ? "bg-[#714b67] text-white" : "bg-gray-400 text-white"
                  }`}
                ></div>
                <span className="mt-1 text-sm">Personal Information</span>
              </div>
            </div>

            {/* Step 1 → Product Details */}
            {step === 1 && (
              <form>
                <div className="mb-5 flex items-end gap-5">
                  <div className="w-82">
                    <label className="mb-1 block font-medium">
                      Serial Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serialNo}
                      onChange={(e) => setSerialNo(e.target.value)}
                      placeholder="Enter serial number"
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSerialCheck}
                    style={{ backgroundColor: colors.primary }}
                    className="w-24 cursor-pointer rounded px-4 py-2 text-white"
                  >
                    Check
                  </button>
                  {serialData && serialData !== "manual" && (
                    <div className="col-span-2 h-10 rounded bg-green-100 px-3 py-1 text-green-800">
                      ✅ Valid serial: <strong>{serialData.itemSerialNo1}</strong> (
                      {serialData.brand} - {serialData.model})
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-5">
                  {/* Brand/Product/Model Section */}

                  <div>
                    <label className="mb-1 block font-medium text-gray-400">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serialData?.brand || ""}
                      readOnly
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-gray-400">
                      Product <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serialData?.product || ""}
                      readOnly
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-gray-400">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serialData?.model || ""}
                      readOnly
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>

                  {/* Rest Fields */}
                  <div>
                    <label className="mb-1 block font-medium">
                      Date of Purchase (D.O.P) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={dop}
                      onChange={(e) => setDop(e.target.value)}
                      max={new Date().toISOString().split("T")[0]} // 🔹 Prevents future dates
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium">
                      Purchased From (Retailer) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={retailer}
                      onChange={(e) => setRetailer(e.target.value)}
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>

                  {/* ------------Invoice New------------ */}
                  <div className="">
                    <label className="mb-1 block font-medium">
                      Upload Invoice <span className="text-red-500">*</span>
                    </label>

                    <div className="flex h-10 items-center rounded-lg border border-gray-300 px-1">
                      {/* Custom Upload Button */}
                      <label
                        htmlFor="invoice-upload"
                        className="cursor-pointer rounded-md bg-[#714b67] px-3 py-1.5 text-sm whitespace-nowrap text-white transition hover:opacity-90"
                      >
                        Choose File
                      </label>

                      {/* Hidden File Input */}
                      <input
                        id="invoice-upload"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const allowedTypes = [
                            "image/jpeg",
                            "image/png",
                            "application/pdf",
                          ];
                          if (!allowedTypes.includes(file.type)) {
                            toast.error("Only JPG, PNG, and PDF files are allowed.");
                            e.target.value = "";
                            return;
                          }

                          const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                          if (file.size > 2 * 1024 * 1024) {
                            toast.error("File size must be less than 2 MB.");
                            e.target.value = "";
                            return;
                          }

                          setInvoice(file);

                          const formData = new FormData();
                          formData.append("file", file);

                          try {
                            const res = await axiosInstance.post(
                              "WarrantyRegistration/upload-invoice",
                              formData,
                              {
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                  Accept: "application/json",
                                },
                              }
                            );
                            setUploadedInvoiceName(res.data.fileName);
                          } catch (err) {
                            console.error("❌ Upload failed", err);
                            toast.error("Invoice upload failed");
                          }
                        }}
                        className="hidden"
                      />

                      {/* File Name Display */}
                      <span
                        className="ml-3 truncate text-sm text-gray-700"
                        style={{
                          maxWidth: "250px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                        title={uploadedInvoiceName}
                      >
                        {uploadedInvoiceName || "No file chosen"}
                      </span>
                    </div>

                    <small className="text-gray-500">
                      Allowed formats: JPG, PNG, PDF | Max size: 2 MB
                    </small>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!dop || !retailer) {
                        toast.error(
                          "❌ Please fill Date of Purchase and Retailer fields."
                        );
                        return;
                      }
                      if (
                        serialData === "manual" &&
                        (!manualBrand || !manualProduct || !manualModel)
                      ) {
                        toast.error("Please select brand, product, and model.");
                        return;
                      }
                      if (!invoice && !uploadedInvoiceName) {
                        toast.error("Please upload the invoice.");
                        return;
                      }
                      setStep(2);
                    }}
                    style={{ backgroundColor: colors.primary }}
                    className="w-24 cursor-pointer rounded px-4 py-2 text-white"
                  >
                    Next
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 → Personal Information */}
            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="mb-1 block font-medium">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 10) {
                          setPhone(val);
                        }
                      }}
                      placeholder="Enter phone number"
                      maxLength={10}
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block font-medium">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      placeholder="Enter your address"
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium">Landmark</label>
                    <input
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Enter landmark"
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      onBlur={handlePincodeCheck}
                      placeholder="Enter pincode"
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                    {pincodeError && (
                      <div className="mt-1 rounded bg-red-100 px-2 py-1 text-red-700">
                        {pincodeError}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block font-medium">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cityName}
                      readOnly
                      disabled
                      placeholder="City"
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium">
                      Locality <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedLocality}
                      onChange={(e) => setSelectedLocality(e.target.value)}
                      className="h-10 w-full rounded border border-gray-300 px-2 py-1"
                    >
                      <option value="">----Select----</option>
                      {localities.map((loc, i) => (
                        <option key={i} value={loc.locality_Name}>
                          {loc.locality_Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-24 cursor-pointer rounded bg-gray-500 px-4 py-2 text-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-24 cursor-pointer rounded px-4 py-2 text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
