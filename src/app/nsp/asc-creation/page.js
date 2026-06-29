"use client";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  MdTv,
  MdAcUnit,
  MdKitchen,
  MdLocalLaundryService,
  MdSpeaker,
  MdOutlineAcUnit,
} from "react-icons/md";
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import PageSkeleton from "@/components/customui/PageSkeleton";
import { useTheme } from "@/theme/ThemeContext";

export default function AscCreationForm() {
  const { colors } = useTheme();
  const debounceTimer = useRef(null);

  const [categories, setCategories] = useState({
    led: false,
    ac: false,
    fridge: false,
    wm: false,
    speaker: false,
    cooler: false,
  });

  const [isChecked, setIsChecked] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    ASC_Name: "",
    ASC_Owner_Name: "",
    ASC_Contact_No: "",
    ASC_Address: "",
    State: "",
    City: "",
    ASC_PinCode: "",
    ASC_EMail: "",
    PanCardNo: "",
    GSTNo: "",
    AadharCardNo: "",
  });

  const [errors, setErrors] = useState({});
  const { user } = useSelector((state) => state.auth);
  const [pincodeStatus, setPincodeStatus] = useState("");
  const [localities, setLocalities] = useState([]);
  const loggedInUser = user?.userName || "Unknown";

  // Toggle category selection
  const toggleCategory = (key) => {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "ASC_PinCode") {
      let cleanValue = value.replace(/\D/g, "");
      if (cleanValue.length > 6) cleanValue = cleanValue.slice(0, 6);

      setFormData((prev) => ({ ...prev, ASC_PinCode: cleanValue }));

      clearTimeout(debounceTimer.current);

      if (cleanValue.length === 6) {
        setPincodeStatus("checking");
        debounceTimer.current = setTimeout(() => fetchPincodeDetails(cleanValue), 400);
      } else {
        resetAddressFields("");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error on input
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Fetch city/state based on pincode
  const fetchPincodeDetails = async (pincode) => {
    try {
      const res = await axiosInstance.get(`LocalityMaster/by-pincode/${pincode}`);
      const data = res.data;

      if (Array.isArray(data) && data.length > 0) {
        setLocalities(data);
        const first = data[0];
        setFormData((prev) => ({
          ...prev,
          State: first.state_Name || "",
          City: first.city_Name || "",
        }));
        setPincodeStatus("valid");
      } else {
        resetAddressFields("invalid");
      }
    } catch (err) {
      console.error("API error:", err);
      resetAddressFields("invalid");
    }
  };

  // Reset city/state if invalid
  const resetAddressFields = (status = "") => {
    setLocalities([]);
    setPincodeStatus(status);
    setFormData((prev) => ({
      ...prev,
      State: "",
      City: "",
    }));
  };

  // Validate all fields
  const validateFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] || formData[key].trim() === "") {
        newErrors[key] = "This field is required";
      }
    });

    // Pincode validation
    if (formData.ASC_PinCode && formData.ASC_PinCode.length !== 6) {
      newErrors.ASC_PinCode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit ASC creation
  const handleSubmit = async () => {
    if (!isChecked) return;

    if (!validateFields()) return;

    try {
      const payload = {
        ASC_Name: formData.ASC_Name,
        ASC_Owner_Name: formData.ASC_Owner_Name,
        ASC_Contact_No: formData.ASC_Contact_No,
        ASC_Address: formData.ASC_Address,
        State: formData.State,
        City: formData.City,
        ASC_PinCode: formData.ASC_PinCode,
        ASC_EMail: formData.ASC_EMail,
        PanCardNo: formData.PanCardNo,
        GSTNo: formData.GSTNo,
        AadharCardNo: formData.AadharCardNo,

        // Categories
        LED: categories.led ? "Yes" : "No",
        AirConditioner: categories.ac ? "Yes" : "No",
        Refrigerator: categories.fridge ? "Yes" : "No",
        WashingMachine: categories.wm ? "Yes" : "No",
        Speaker: categories.speaker ? "Yes" : "No",
        Cooler: categories.cooler ? "Yes" : "No",

        // Metadata
        CreatedBy: loggedInUser,
        MidifiedBy: loggedInUser,
      };

      await axiosInstance.post("ASCCreation/create", payload);
      // setShowSuccessPopup(true);
      toast.success("Your ASC request has been submitted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ASC. Please try again.");
    }
  };

  const categoryItems = [
    { key: "led", label: "LED", Icon: MdTv },
    { key: "ac", label: "Air Conditioner", Icon: MdAcUnit },
    { key: "fridge", label: "Refrigerator", Icon: MdKitchen },
    { key: "wm", label: "Washing Machine", Icon: MdLocalLaundryService },
    { key: "speaker", label: "Speaker", Icon: MdSpeaker },
    { key: "cooler", label: "Cooler", Icon: MdOutlineAcUnit },
  ];

  // <ProtectedRoute allowedRoles={["br"]}>  ASC Creation Request
  return (
    <PageSkeleton title="ASC Creation Request" rolesAllowed={["br"]}>
      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Object.entries({
          ASC_Name: "ASC Name",
          ASC_Owner_Name: "Owner Name",
          ASC_EMail: "Email ID",
          ASC_Contact_No: "Contact Number",
          ASC_PinCode: "Pincode",
          State: "State",
          City: "City",
          GSTNo: "GST Number",
          PanCardNo: "PAN Number",
          AadharCardNo: "Aadhar Number",
          ASC_Address: "Address",
        }).map(([key, label]) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <input
              type={key === "ASC_EMail" ? "email" : "text"}
              name={key}
              value={formData[key]}
              onChange={handleInputChange}
              placeholder={`Enter ${label}`}
              maxLength={
                key === "ASC_Contact_No" ? 10 : key === "ASC_PinCode" ? 6 : undefined
              }
              className={`w-full rounded-md border px-4 py-2 outline-none ${
                key === "State" || key === "City" ? "bg-gray-100" : ""
              }`}
              readOnly={key === "State" || key === "City"}
              onInput={
                key === "ASC_Contact_No"
                  ? (e) => (e.target.value = e.target.value.replace(/\D/g, ""))
                  : undefined
              }
            />
            {errors[key] && <small className="text-red-600">{errors[key]}</small>}
            {key === "ASC_PinCode" && pincodeStatus === "valid" && (
              <small className="text-green-600">✅ Valid Pincode</small>
            )}
            {key === "ASC_PinCode" && pincodeStatus === "invalid" && (
              <small className="text-red-600">❌ Invalid Pincode</small>
            )}
          </div>
        ))}
      </div>

      {/* Category Selection */}
      <h3 className="mt-10 mb-4 text-lg font-semibold">Select Category</h3>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {categoryItems.map(({ key, label, Icon }) => (
          <div
            key={key}
            onClick={() => toggleCategory(key)}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border p-4 transition ${
              categories[key] ? "border-blue-500 bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
            <Icon
              size={32}
              style={{ color: categories[key] ? colors.primary : "#4B5563" }}
            />
            <div className="font-medium">{label}</div>
            <input
              type="checkbox"
              checked={categories[key]}
              readOnly
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
        ))}
      </div>

      {/* Confirmation */}
      <div className="mb-6 flex items-start gap-2">
        <input
          type="checkbox"
          id="confirm"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="confirm" className="text-sm text-gray-700">
          I hereby confirm that the above details for new ASC creation request are correct
          and aligned with the Jaina agreement.
        </label>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="cursor-pointer rounded px-6 py-2 text-white"
          disabled={!isChecked}
          style={{ background: colors.primary }}
        >
          Create ASC
        </button>
      </div>
    </PageSkeleton>
  );
}
