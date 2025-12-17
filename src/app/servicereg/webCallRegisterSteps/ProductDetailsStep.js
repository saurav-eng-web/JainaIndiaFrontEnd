"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

import CustomDropdown from "./CustomDropdown";

import axiosInstance from "@/api/axiosInstance";

export default function ProductDetailsStep({
  formData,
  handleChange,
  setFormData,
  errors = {},
  setIsSerialValidParent,
}) {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [models, setModels] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
  const [isSerialValid, setIsSerialValid] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("BrandMaster")
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Brand fetch error", err));

    axiosInstance
      .get("productmaster/GetAll")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Product fetch error", err));

    axiosInstance
      .get("warrantymaster")
      .then((res) => setWarranties(res.data))
      .catch((err) => console.error("Warranty fetch error", err));
  }, []);

  useEffect(() => {
    if (!formData.productID) {
      setModels([]);
      return;
    }

    axiosInstance
      .get(`Model/productid/${formData.productID}`)
      .then((res) => {
        setModels(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        setModels([]);
        console.error("Model fetch error", err);
      });
  }, [formData.productID]);

  const showPopup = (message, type) => setPopup({ visible: true, message, type });

  const checkSerialNumber = async (serial) => {
    try {
      if (!serial) return;
      const res = await axiosInstance.get(`SerialNoMaster/by-serial/${serial}`);
      const matched = res.data;

      if (matched.brand && !brands.find((b) => b.brand_Name === matched.brand)) {
        setBrands((prev) => [
          ...prev,
          { brand_ID: Date.now(), brand_Name: matched.brand },
        ]);
      }
      if (matched.product && !products.find((p) => p.product === matched.product)) {
        setProducts((prev) => [
          ...prev,
          { productID: Date.now(), product: matched.product },
        ]);
      }
      if (matched.productID) {
        const modelRes = await axiosInstance.get(`Model/productid/${matched.productID}`);
        setModels(modelRes.data);
      }

      const selectedWarranty = warranties.find(
        (w) => w.warranty_Desc === matched.purchstatus
      );

      const selectedProduct = products.find((p) => p.product === matched.product);
      const selectedModel = models.find((m) => m.modelNo === matched.model);

      setFormData((prev) => ({
        ...prev,
        serialNo: serial,
        brand: matched.brand || "",
        brandId: matched.brandID || "",
        productCategory: matched.productCategory || "",
        productCategoryID: matched.productCategoryID || "",
        product: matched.product || "",
        productID: matched.productID || "",
        model: matched.model || "",
        modelID: matched.modelID || "",
        modelDescription: matched.modeldes || "",
        warranty: selectedWarranty ? selectedWarranty.warranty_Desc : "",
        warranty_ID: selectedWarranty ? selectedWarranty.warranty_ID : "",
      }));

      setIsSerialValid(true);
      setIsSerialValidParent(true);
      showPopup("✅ Serial number is valid", "success");
    } catch (err) {
      if (err.response?.status === 404) {
        setFormData((prev) => ({
          ...prev,
          serialNo: serial,
          brand: "",
          model: "",
          modelID: "",
          product: "",
          productID: "",
          productCategory: "",
          warranty: "",
          warranty_ID: "",
        }));
        setModels([]);
        setIsSerialValid(false);
        setIsSerialValidParent(false);
        showPopup("❌ Invalid serial number", "error");
      } else {
        console.error("Error validating serial number:", err);

        showPopup(
          "Error! The serial number may not exist. Please try again or select the model manually.",
          "error"
        );
      }
    }
  };

  const getFieldOptions = (id) => {
    if (id === "brand")
      return brands.map((b) => ({ value: b.brand_Name, label: b.brand_Name }));
    if (id === "productCategory") {
      const filtered = products.filter((p) => p.brandId === formData.brandId);
      const uniqueCats = [...new Set(filtered.map((p) => p.prd_Category))];
      return uniqueCats.map((cat) => ({ value: cat, label: cat }));
    }
    if (id === "product") {
      return products
        .filter(
          (p) =>
            p.brandId === formData.brandId && p.prd_Category === formData.productCategory
        )
        .map((p) => ({ value: p.product, label: p.product }));
    }
    if (id === "model")
      return models.map((m) => ({ value: m.modelNo, label: m.modelNo }));

    return [];
  };

  const fields = [
    { id: "serialNo", type: "text" },
    { id: "pop", type: "date" },

    { id: "brand", type: "text", disabled: true },
    { id: "productCategory", type: "text", disabled: true },
    { id: "product", type: "text", disabled: true },
    { id: "model", type: "text", disabled: true },
    {
      id: "modelDescription",
      type: "text",
      disabled: true,
    },
    // { id: "pop", type: "date" },
  ];

  return (
    <>
      <h3>Product Details</h3>
      <div className="form-grid">
        {fields.map(({ id, type, disabled }) => {
          const label =
            id === "pop"
              ? "DOP"
              : id.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

          return (
            <div className="form-group" key={id}>
              <label htmlFor={id}>{label}</label>

              <input
                id={id}
                name={id}
                type={type}
                disabled={disabled}
                placeholder={label}
                onChange={handleChange}
                onBlur={
                  id === "serialNo" ? (e) => checkSerialNumber(e.target.value) : undefined
                }
                value={formData[id] || ""}
                max={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
              />

              {errors[id] && (
                <div
                  style={{
                    color: "red",
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  {errors[id]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {popup.visible && (
        <div className="popup-overlay">
          <div className={`popup-box ${popup.type}`}>
            <p>{popup.message}</p>
            <button onClick={() => setPopup({ ...popup, visible: false })}>OK</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .popup-box {
          background: #fff;
          padding: 80px 100px;
          border-radius: 8px;
          min-width: 250px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          max-width: 90%;
          display: flex;
          flex-direction: column;
          align-items: center; /* keeps button centered */
        }

        .popup-box.success {
          border: 2px solid green;
        }

        .popup-box.error {
          border: 2px solid red;
        }

        .popup-box button {
          margin-top: 10px;
          padding: 8px 16px;
          background: #714b67;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          align-self: center; /* ensures button stays centered */
        }

        /* Responsive adjustment for smaller screens */
        @media (max-width: 768px) {
          .popup-box {
            padding: 40px 24px;
            margin: 0 16px;
            width: auto;
          }
        }

        @media (max-width: 480px) {
          .popup-box {
            padding: 32px 20px;
            margin: 0 12px;
          }
        }
      `}</style>
    </>
  );
}
