"use client";

import { useState } from "react";

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

  const fetchModelsByProduct = async (productId) => {
    try {
      const res = await axiosInstance.get(`Model/productid/${productId}`);
      setModelList(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch models by product", err);
      setModelList([]);
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
      alert("❌ Failed to upload invoice");
      return null;
    }
  };

  const handleSerialCheck = async () => {
    if (!serialNo.trim()) {
      setSerialError("Please enter a serial number");
      setSerialData(null);
      return;
    }

    try {
      const regCheck = await axiosInstance.get(
        `WarrantyRegistration/by-serial/${serialNo}`
      );
      if (regCheck.data && regCheck.data.serialNumber) {
        setAlreadyRegistered(true);
        setSerialError("⚠︎ This serial number is already registered.");
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
      setSerialError("❌ Invalid or unrecognized serial number");
      // setSerialData("manual");
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
      alert("❌ Please fill Date of Purchase and Retailer fields.");
      return false;
    }
    if (serialData === "manual" && (!manualBrand || !manualProduct || !manualModel)) {
      alert("❌ Please select brand, product, and model.");
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
      alert("❌ Please fill all required personal fields.");
      return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("❌ Enter a valid 10-digit phone number.");
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
        alert("❌ This serial number is already registered.");
        return;
      }
    } catch {}

    // 🔹 Upload invoice first
    let uploadedFileName = null;
    if (invoice) {
      uploadedFileName = await handleInvoiceUpload(invoice);
      if (!uploadedFileName) {
        alert("❌ Invoice upload failed, please try again.");
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

      setShowSuccessPopup(true);
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
      alert("❌ Failed to register warranty");
    }
  };
  return (
    <ProtectedRoute allowedRoles={["cc"]}>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="ml-[60px] min-h-screen w-full bg-[#f4f6f8] p-8 transition-all">
          <div className="mx-auto my-8 max-w-4xl rounded-lg bg-white p-8 shadow">
            <div className="mb-8 rounded-md border-2 border-[#714b67] py-1 pl-2 text-left text-lg font-bold text-[#714b67]">
              Warranty Registration
            </div>

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
              <div className="absolute top-4 z-0 mx-auto h-0.5 w-[23%] bg-gray-300"></div>

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
                <div className="grid grid-cols-2 gap-5">
                  {/* Serial Number */}
                  <div className="col-span-1 flex items-end gap-3">
                    <div className="w-72">
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
                      className="rounded px-4 py-2 text-white"
                    >
                      Check
                    </button>
                  </div>

                  {serialError && (
                    // <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded col-span-2">
                    //   {serialError}
                    // </div>
                    <div
                      className={`col-span-2 rounded px-3 py-1 ${
                        serialError === "❌ Invalid or unrecognized serial number"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {serialError}
                    </div>
                  )}
                  {serialData && serialData !== "manual" && (
                    <div className="col-span-2 rounded bg-green-100 px-3 py-1 text-green-800">
                      ✅ Valid serial: <strong>{serialData.itemSerialNo1}</strong> (
                      {serialData.brand} - {serialData.model})
                    </div>
                  )}

                  {/* Brand/Product/Model Section */}
                  {/* -------- 🔴🔴have to remove this ---------- */}
                  {serialData === "manual" ? (
                    <>
                      <div>
                        <label className="mb-1 block font-medium">
                          Brand <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={manualBrand}
                          onChange={(e) => setManualBrand(e.target.value)}
                          className="w-full rounded border border-gray-300 px-2 py-1"
                        >
                          <option value="">-- Select Brand --</option>
                          {brandList.map((b, i) => (
                            <option key={i} value={b.brand_ID}>
                              {b.brand_Name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block font-medium">
                          Product <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={manualProduct}
                          onChange={(e) => {
                            const selectedProductId = e.target.value;
                            setManualProduct(selectedProductId); // now manualProduct = productID
                            if (selectedProductId) {
                              fetchModelsByProduct(selectedProductId); // fetch models correctly
                            } else {
                              setModelList([]);
                            }
                          }}
                          className="w-full rounded border border-gray-300 px-2 py-1"
                        >
                          <option value="">-- Select Product --</option>
                          {productList
                            .filter((p) => p.brandId === Number(manualBrand)) // still filter by brand
                            .map((p) => (
                              <option key={p.productID} value={p.productID}>
                                {p.product}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block font-medium">
                          Model <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={manualModel}
                          onChange={(e) => setManualModel(e.target.value)}
                          className="w-full rounded border border-gray-300 px-2 py-1"
                        >
                          <option value="">-- Select Model --</option>
                          {modelList.map((m) => (
                            <option key={m.modelID} value={m.modelID}>
                              {m.modelNo}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}

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
                  {/* ------------Invoice Old------------ */}
                  {/* <div>
                    <label className="mb-1 block font-medium">
                      Upload Invoice <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        // 🔹 File type check
                        const allowedTypes = [
                          "image/jpeg",
                          "image/png",
                          "application/pdf",
                        ];
                        if (!allowedTypes.includes(file.type)) {
                          alert("❌ Only JPG, PNG, and PDF files are allowed.");
                          e.target.value = "";
                          return;
                        }
                        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                        console.log(`File size: ${sizeMB} MB`);
                        // 🔹 File size check (1 MB = 1024 * 1024 bytes)
                        if (file.size > 2 * 1024 * 1024) {
                          alert("❌ File size must be less than 2 MB.");
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
                            },
                          );
                          setUploadedInvoiceName(res.data.fileName);
                          console.log(
                            "✅ Invoice uploaded:",
                            res.data.fileName,
                          );
                        } catch (err) {
                          console.error("❌ Upload failed", err);
                          alert("❌ Invoice upload failed");
                        }
                      }}
                      className="w-full"
                    />
                    <small className="text-gray-500">
                      Allowed formats: JPG, PNG, PDF | Max size: 2 MB
                    </small>
                  </div> */}
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
                            alert("❌ Only JPG, PNG, and PDF files are allowed.");
                            e.target.value = "";
                            return;
                          }

                          const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                          if (file.size > 2 * 1024 * 1024) {
                            alert("❌ File size must be less than 2 MB.");
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
                            alert("❌ Invoice upload failed");
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

                <div className="mt-8 flex justify-between">
                  {/* <button type="button" onClick={() => validateStep1() && setStep(2)} style={{ backgroundColor: colors.primary }} className="px-4 py-2 text-white rounded">Next</button> */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!dop || !retailer) {
                        alert("❌ Please fill Date of Purchase and Retailer fields.");
                        return;
                      }
                      if (
                        serialData === "manual" &&
                        (!manualBrand || !manualProduct || !manualModel)
                      ) {
                        alert("❌ Please select brand, product, and model.");
                        return;
                      }
                      if (!invoice && !uploadedInvoiceName) {
                        alert("❌ Please upload the invoice.");
                        return;
                      }
                      setStep(2);
                    }}
                    style={{ backgroundColor: colors.primary }}
                    className="rounded px-4 py-2 text-white"
                  >
                    Next
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 → Personal Information */}
            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-5">
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
                    {/* <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" className="w-full border border-gray-300 rounded px-2 py-1"/> */}
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
                      className="w-full rounded border border-gray-300 px-2 py-1"
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
                      placeholder="City auto-fills"
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
                      className="w-full rounded border border-gray-300 px-2 py-1"
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
                    className="rounded bg-gray-500 px-4 py-2 text-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded px-4 py-2 text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="w-11/12 max-w-sm rounded-lg bg-white p-8 text-center shadow-lg">
              <h2 className="mb-4 text-green-600">🎉 Registration Successful</h2>
              <p className="mb-4">Your warranty has been registered successfully.</p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
