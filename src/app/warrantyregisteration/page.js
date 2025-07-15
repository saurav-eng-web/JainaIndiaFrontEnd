

// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import SideBar from '@/components/SideBar';
// import './WarrantyForm.css';

// export default function WarrantyForm() {
//   const [step, setStep] = useState(1);

//   const [serialNo, setSerialNo] = useState('');
//   const [serialData, setSerialData] = useState(null);
//   const [serialError, setSerialError] = useState('');
//   const [alreadyRegistered, setAlreadyRegistered] = useState(false);

//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [landmark, setLandmark] = useState('');
//   const [pincode, setPincode] = useState('');
//   const [cityName, setCityName] = useState('');
//   const [localities, setLocalities] = useState([]);
//   const [selectedLocality, setSelectedLocality] = useState('');
//   const [pincodeError, setPincodeError] = useState('');

//   const [dop, setDop] = useState('');
//   const [retailer, setRetailer] = useState('');
//   const [invoice, setInvoice] = useState(null);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);

//   const [brandList, setBrandList] = useState([]);
//   const [productList, setProductList] = useState([]);
//   const [modelList, setModelList] = useState([]);

//   const [manualBrand, setManualBrand] = useState('');
//   const [manualProduct, setManualProduct] = useState('');
//   const [manualModel, setManualModel] = useState('');

//   const fetchFallbackProductData = async () => {
//     try {
//       const [brandRes, productRes, modelRes] = await Promise.all([
//         axios.get('https://ncapi.jainaindia.com/api/BrandMaster'),
//         axios.get('https://ncapi.jainaindia.com/api/ProductMaster'),
//         axios.get('https://ncapi.jainaindia.com/api/Model')
//       ]);

//       setBrandList(brandRes.data || []);
//       setProductList(productRes.data || []);
//       setModelList(modelRes.data || []);
//     } catch (err) {
//       console.error('❌ Failed to load fallback brand/product/model', err);
//     }
//   };

//   const handleSerialCheck = async () => {
//     if (!serialNo.trim()) {
//       setSerialError('Please enter a serial number');
//       setSerialData(null);
//       return;
//     }

//     try {
//       const regCheck = await axios.get(`https://ncapi.jainaindia.com/api/WarrantyRegistration/by-serial/${serialNo}`);
//       if (regCheck.data && regCheck.data.serialNumber) {
//         setAlreadyRegistered(true);
//         setSerialError('❌ This serial number is already registered.');
//         setSerialNo('');
//         setSerialData(null);
//         return;
//       }
//     } catch {
//       setAlreadyRegistered(false);
//     }

//     try {
//       const res = await axios.get(`https://ncapi.jainaindia.com/api/SerialNoMaster/by-serial/${serialNo}`);
//       setSerialData(res.data);
//       setSerialError('');
//     } catch (err) {
//       setSerialError('❌ Invalid or unrecognized serial number');
//       setSerialData('manual');
//       fetchFallbackProductData();
//     }
//   };

//   const handlePincodeCheck = async () => {
//     if (!pincode.trim()) return;

//     try {
//       const res = await axios.get(`https://ncapi.jainaindia.com/api/LocalityMaster/by-pincode/${pincode}`);
//       const data = res.data;

//       if (data.length === 0) {
//         setPincodeError('❌ No serviceable area found for this pincode');
//         setCityName('');
//         setLocalities([]);
//         return;
//       }

//       setCityName(data[0].city_Name || '');
//       setLocalities(data);
//       setSelectedLocality('');
//       setPincodeError('');
//     } catch {
//       setPincodeError('❌ Failed to fetch city/locality for this pincode');
//       setCityName('');
//       setLocalities([]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const selectedCityObj = localities.find((l) => l.locality_Name === selectedLocality);
//     const finalSerial = serialData?.itemSerialNo1 || serialNo;

//     try {
//       const regCheck = await axios.get(`https://ncapi.jainaindia.com/api/WarrantyRegistration/by-serial/${finalSerial}`);
//       if (regCheck.data && regCheck.data.serialNumber) {
//         alert('❌ This serial number is already registered.');
//         return;
//       }
//     } catch {}

//     const payload = {
//       customerName: firstName,
//       lastName,
//       phoneNumber: phone,
//       address,
//       pincode,
//       city: cityName,
//       cityID: selectedCityObj?.locality_City || null,
//       locality: selectedLocality,
//       localityID: selectedCityObj?.locality_Id || null,
//       serialNumber: finalSerial,
//       product: serialData?.product || manualProduct,
//       productID: serialData?.productID || null,
//       model: serialData?.model || manualModel,
//       modelID: serialData?.modelID || null,
//       tdate: new Date().toISOString(),
//       enterBy: 'AdminUser',
//       dop,
//       purchaseFromRetailer: retailer,
//       invoice: invoice ? invoice.name : '',
//       brandID: serialData?.brandID || null,
//       brand: serialData?.brand || manualBrand,
//       landMark: landmark,
//       warranty: '1 Year'
//     };
//     console.log("🚀 Final Payload:", payload);

//     try {
//       const res = await axios.post('https://ncapi.jainaindia.com/api/WarrantyRegistration', payload);
//       setShowSuccessPopup(true);

//       setSerialNo('');
//       setSerialData(null);
//       setSerialError('');
//       setAlreadyRegistered(false);

//       setFirstName('');
//       setLastName('');
//       setPhone('');
//       setAddress('');
//       setLandmark('');
//       setPincode('');
//       setCityName('');
//       setLocalities([]);
//       setSelectedLocality('');
//       setPincodeError('');

//       setDop('');
//       setRetailer('');
//       setInvoice(null);
//       setStep(1);
//     } catch (err) {
//       console.error('❌ Save failed', err);
//       alert('❌ Failed to register warranty');
//     }
//   };

//   return (
//     <div className="warranty-layout">
//       <SideBar />
//       <div className="warranty-content">
//         <div className="header">Warranty Registration</div>
//         <div className="container">
//           <div className="steps">
//             <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} data-step="1">
//               <div className="step-title">Personal Information</div>
//             </div>
//             <div className={`step ${step === 2 ? 'active' : ''}`} data-step="2">
//               <div className="step-title">Product Details</div>
//             </div>
//           </div>

//           {step === 1 && (
//             <form>
//               <div className="form-grid">
//                 <div className="check-serial">
//                   <div style={{ flex: 1 }}>
//                     <label className="required">Serial Number</label>
//                     <input type="text" value={serialNo} onChange={(e) => setSerialNo(e.target.value)} placeholder="Enter serial number" />
//                   </div>
//                   <button type="button" onClick={handleSerialCheck}>Check</button>
//                 </div>
//                 {serialError && <div className="error-msg">{serialError}</div>}
//                 {serialData && serialData !== 'manual' && (
//                   <div className="success-msg">✅ Valid serial: <strong>{serialData.itemSerialNo1}</strong> ({serialData.brand} - {serialData.model})</div>
//                 )}
//                 <div><label className="required">First Name</label><input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" /></div>
//                 <div><label className="required">Last Name</label><input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" /></div>
//                 <div><label className="required">Phone Number</label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" /></div>
//                 <div className="full-width"><label className="required">Address</label><textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} placeholder="Enter your address" /></div>
//                 <div><label>Landmark</label><input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Enter landmark" /></div>
//                 <div><label className="required">Pincode</label><input value={pincode} onChange={(e) => setPincode(e.target.value)} onBlur={handlePincodeCheck} placeholder="Enter pincode" /></div>
//                 {pincodeError && <div className="error-msg">{pincodeError}</div>}
//                 <div><label className="required">City</label><input type="text" value={cityName} readOnly placeholder="City auto-fills" /></div>
//                 <div><label className="required">Locality</label><select value={selectedLocality} onChange={(e) => setSelectedLocality(e.target.value)}><option value="">----Select----</option>{localities.map((loc, i) => (<option key={i} value={loc.locality_Name}>{loc.locality_Name}</option>))}</select></div>
//               </div>
//               <div className="form-actions">
//                 {/* <button type="button" className="btn-next" onClick={() => setStep(2)} disabled={!serialNo}>Next</button> */}
//                 <button
//   type="button"
//   className="btn-next"
//   onClick={() => {
//     if (!firstName || !lastName || !phone || !address || !pincode || !selectedLocality || !cityName) {
//       alert('❌ Please fill all required fields before proceeding.');
//       return;
//     }
//     setStep(2);
//   }}
// >
//   Next
// </button>
//               </div>
//             </form>
//           )}

//           {step === 2 && (
//             <form onSubmit={handleSubmit}>
//               <div className="form-grid">
//                 {serialData === 'manual' ? (
//                   <>
//                     <div><label className="required">Brand</label><select value={manualBrand} onChange={(e) => setManualBrand(e.target.value)}><option value="">-- Select Brand --</option>{brandList.map((b, i) => (<option key={i} value={b.brand_Name}>{b.brand_Name}</option>))}</select></div>
//                     <div><label className="required">Product</label><select value={manualProduct} onChange={(e) => setManualProduct(e.target.value)}><option value="">-- Select Product --</option>{productList.map((p, i) => (<option key={i} value={p.product}>{p.product}</option>))}</select></div>
//                     <div><label className="required">Model</label><select value={manualModel} onChange={(e) => setManualModel(e.target.value)}><option value="">-- Select Model --</option>{modelList.map((m, i) => (<option key={i} value={m.modelNo}>{m.modelNo}</option>))}</select></div>
//                   </>
//                 ) : (
//                   <>
//                     <div><label className="required">Brand</label><input type="text" value={serialData?.brand || ''} readOnly /></div>
//                     <div><label className="required">Product</label><input type="text" value={serialData?.product || ''} readOnly /></div>
//                     <div><label className="required">Model</label><input type="text" value={serialData?.model || ''} readOnly /></div>
//                   </>
//                 )}
//                 <div><label className="required">Date of Purchase (D.O.P)</label><input type="date" value={dop} onChange={(e) => setDop(e.target.value)} /></div>
//                 <div><label className="required">Purchased From (Retailer)</label><input type="text" value={retailer} onChange={(e) => setRetailer(e.target.value)} /></div>
//                 <div><label className="required">Upload Invoice</label><input type="file" onChange={(e) => setInvoice(e.target.files[0])} /></div>
//               </div>
//               <div className="form-actions">
//                 <button type="button" className="btn-prev" onClick={() => setStep(1)}>Back</button>
//                 <button type="submit" className="btn-next">Save</button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//       {showSuccessPopup && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h2>🎉 Registration Successful</h2>
//             <p>Your warranty has been registered successfully.</p>
//             <button onClick={() => setShowSuccessPopup(false)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import axios from 'axios';
import SideBar from '@/components/SideBar';
import './WarrantyForm.css';

export default function WarrantyForm() {
  const [step, setStep] = useState(1);

  const [serialNo, setSerialNo] = useState('');
  const [serialData, setSerialData] = useState(null);
  const [serialError, setSerialError] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [cityName, setCityName] = useState('');
  const [localities, setLocalities] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState('');
  const [pincodeError, setPincodeError] = useState('');

  const [dop, setDop] = useState('');
  const [retailer, setRetailer] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [brandList, setBrandList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [modelList, setModelList] = useState([]);

  const [manualBrand, setManualBrand] = useState('');
  const [manualProduct, setManualProduct] = useState('');
  const [manualModel, setManualModel] = useState('');

  const fetchFallbackProductData = async () => {
    try {
      const [brandRes, productRes, modelRes] = await Promise.all([
        axios.get('https://ncapi.jainaindia.com/api/BrandMaster'),
        axios.get('https://ncapi.jainaindia.com/api/ProductMaster'),
        axios.get('https://ncapi.jainaindia.com/api/Model')
      ]);

      setBrandList(brandRes.data || []);
      setProductList(productRes.data || []);
      setModelList(modelRes.data || []);
    } catch (err) {
      console.error('❌ Failed to load fallback brand/product/model', err);
    }
  };

  const handleSerialCheck = async () => {
    if (!serialNo.trim()) {
      setSerialError('Please enter a serial number');
      setSerialData(null);
      return;
    }

    try {
      const regCheck = await axios.get(`https://ncapi.jainaindia.com/api/WarrantyRegistration/by-serial/${serialNo}`);
      if (regCheck.data && regCheck.data.serialNumber) {
        setAlreadyRegistered(true);
        setSerialError('❌ This serial number is already registered.');
        setSerialNo('');
        setSerialData(null);
        return;
      }
    } catch {
      setAlreadyRegistered(false);
    }

    try {
      const res = await axios.get(`https://ncapi.jainaindia.com/api/SerialNoMaster/by-serial/${serialNo}`);
      setSerialData(res.data);
      setSerialError('');
    } catch (err) {
      setSerialError('❌ Invalid or unrecognized serial number');
      setSerialData('manual');
      fetchFallbackProductData();
    }
  };

  const handlePincodeCheck = async () => {
    if (!pincode.trim()) return;

    try {
      const res = await axios.get(`https://ncapi.jainaindia.com/api/LocalityMaster/by-pincode/${pincode}`);
      const data = res.data;

      if (data.length === 0) {
        setPincodeError('❌ No serviceable area found for this pincode');
        setCityName('');
        setLocalities([]);
        return;
      }

      setCityName(data[0].city_Name || '');
      setLocalities(data);
      setSelectedLocality('');
      setPincodeError('');
    } catch {
      setPincodeError('❌ Failed to fetch city/locality for this pincode');
      setCityName('');
      setLocalities([]);
    }
  };

  const validateStep1 = () => {
    if (!firstName || !lastName || !phone || !address || !pincode || !selectedLocality || !cityName) {
      alert('❌ Please fill all required personal fields.');
      return false;
    }
    const isValidPhone = /^[0-9]{10}$/.test(phone);
    if (!isValidPhone) {
      alert('❌ Enter a valid 10-digit phone number.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!dop || !retailer) {
      alert('❌ Please fill Date of Purchase and Retailer fields.');
      return false;
    }
    if (serialData === 'manual' && (!manualBrand || !manualProduct || !manualModel)) {
      alert('❌ Please select brand, product, and model.');
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
      const regCheck = await axios.get(`https://ncapi.jainaindia.com/api/WarrantyRegistration/by-serial/${finalSerial}`);
      if (regCheck.data && regCheck.data.serialNumber) {
        alert('❌ This serial number is already registered.');
        return;
      }
    } catch {}

    const payload = {
      customerName: firstName,
      lastName,
      phoneNumber: phone,
      address,
      pincode,
      city: cityName,
      cityID: selectedCityObj?.locality_City || null,
      locality: selectedLocality,
      localityID: selectedCityObj?.locality_Id || null,
      serialNumber: finalSerial,
      product: serialData?.product || manualProduct,
      productID: serialData?.productID || null,
      model: serialData?.model || manualModel,
      modelID: serialData?.modelID || null,
      tdate: new Date().toISOString(),
      enterBy: 'AdminUser',
      dop,
      purchaseFromRetailer: retailer,
      invoice: invoice ? invoice.name : '',
      brandID: serialData?.brandID || null,
      brand: serialData?.brand || manualBrand,
      landMark: landmark,
      warranty: '1 Year'
    };

    try {
      const res = await axios.post('https://ncapi.jainaindia.com/api/WarrantyRegistration', payload);
      setShowSuccessPopup(true);
      setStep(1);
      setSerialNo('');
      setSerialData(null);
      setSerialError('');
      setAlreadyRegistered(false);
      setFirstName('');
      setLastName('');
      setPhone('');
      setAddress('');
      setLandmark('');
      setPincode('');
      setCityName('');
      setLocalities([]);
      setSelectedLocality('');
      setPincodeError('');
      setDop('');
      setRetailer('');
      setInvoice(null);
    } catch (err) {
      console.error('❌ Save failed', err);
      alert('❌ Failed to register warranty');
    }
  };

  return (
    <div className="warranty-layout">
      <SideBar />
      <div className="warranty-content">
        <div className="header">Warranty Registration</div>
        <div className="container">
          <div className="steps">
            <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} data-step="1">
              <div className="step-title">Personal Information</div>
            </div>
            <div className={`step ${step === 2 ? 'active' : ''}`} data-step="2">
              <div className="step-title">Product Details</div>
            </div>
          </div>

          {step === 1 && (
            <form>
              <div className="form-grid">
                <div className="check-serial">
                  <div style={{ flex: 1 }}>
                    <label className="required">Serial Number</label>
                    <input type="text" value={serialNo} onChange={(e) => setSerialNo(e.target.value)} placeholder="Enter serial number" />
                  </div>
                  <button type="button" onClick={handleSerialCheck}>Check</button>
                </div>
                {serialError && <div className="error-msg">{serialError}</div>}
                {serialData && serialData !== 'manual' && (
                  <div className="success-msg">✅ Valid serial: <strong>{serialData.itemSerialNo1}</strong> ({serialData.brand} - {serialData.model})</div>
                )}
                <div><label className="required">First Name</label><input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" /></div>
                <div><label className="required">Last Name</label><input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" /></div>
                <div><label className="required">Phone Number</label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" /></div>
                <div className="full-width"><label className="required">Address</label><textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} placeholder="Enter your address" /></div>
                <div><label>Landmark</label><input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Enter landmark" /></div>
                <div><label className="required">Pincode</label><input value={pincode} onChange={(e) => setPincode(e.target.value)} onBlur={handlePincodeCheck} placeholder="Enter pincode" /></div>
                {pincodeError && <div className="error-msg">{pincodeError}</div>}
                <div><label className="required">City</label><input type="text" value={cityName} readOnly placeholder="City auto-fills" /></div>
                <div><label className="required">Locality</label><select value={selectedLocality} onChange={(e) => setSelectedLocality(e.target.value)}><option value="">----Select----</option>{localities.map((loc, i) => (<option key={i} value={loc.locality_Name}>{loc.locality_Name}</option>))}</select></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-next" onClick={() => validateStep1() && setStep(2)}>Next</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {serialData === 'manual' ? (
                  <>
                    <div><label className="required">Brand</label><select value={manualBrand} onChange={(e) => setManualBrand(e.target.value)}><option value="">-- Select Brand --</option>{brandList.map((b, i) => (<option key={i} value={b.brand_Name}>{b.brand_Name}</option>))}</select></div>
                    <div><label className="required">Product</label><select value={manualProduct} onChange={(e) => setManualProduct(e.target.value)}><option value="">-- Select Product --</option>{productList.map((p, i) => (<option key={i} value={p.product}>{p.product}</option>))}</select></div>
                    <div><label className="required">Model</label><select value={manualModel} onChange={(e) => setManualModel(e.target.value)}><option value="">-- Select Model --</option>{modelList.map((m, i) => (<option key={i} value={m.modelNo}>{m.modelNo}</option>))}</select></div>
                  </>
                ) : (
                  <>
                    <div><label className="required">Brand</label><input type="text" value={serialData?.brand || ''} readOnly /></div>
                    <div><label className="required">Product</label><input type="text" value={serialData?.product || ''} readOnly /></div>
                    <div><label className="required">Model</label><input type="text" value={serialData?.model || ''} readOnly /></div>
                  </>
                )}
                <div><label className="required">Date of Purchase (D.O.P)</label><input type="date" value={dop} onChange={(e) => setDop(e.target.value)} /></div>
                <div><label className="required">Purchased From (Retailer)</label><input type="text" value={retailer} onChange={(e) => setRetailer(e.target.value)} /></div>
                <div><label className="required">Upload Invoice</label><input type="file" onChange={(e) => setInvoice(e.target.files[0])} /></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-prev" onClick={() => setStep(1)}>Back</button>
                <button type="submit" className="btn-next">Save</button>
              </div>
            </form>
          )}
        </div>
      </div>
      {showSuccessPopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>🎉 Registration Successful</h2>
            <p>Your warranty has been registered successfully.</p>
            <button onClick={() => setShowSuccessPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

