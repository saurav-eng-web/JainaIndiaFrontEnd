

'use client';

import { useState } from 'react';
import SideBar from '@/components/SideBar';
import { useTheme } from '@/theme/ThemeContext';
import axiosInstance from '@/api/axiosInstance';

export default function WarrantyForm() {
  const { colors } = useTheme(); 
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
        axiosInstance.get('BrandMaster'),
        axiosInstance.get('productmaster/GetAll'),
        axiosInstance.get('Model')
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
      const regCheck = await axiosInstance.get(`WarrantyRegistration/by-serial/${serialNo}`);
      if (regCheck.data && regCheck.data.serialNumber) {
        setAlreadyRegistered(true);
        setSerialError('⚠︎ This serial number is already registered.');
        setSerialNo('');
        setSerialData(null);
        return;
      }
    } catch {
      setAlreadyRegistered(false);
    }

    try {
      const res = await axiosInstance.get(`SerialNoMaster/by-serial/${serialNo}`);
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
      const res = await axiosInstance.get(`LocalityMaster/by-pincode/${pincode}`);
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
  
  const validateStep2 = () => {
    if (!firstName || !lastName || !phone || !address || !pincode || !selectedLocality || !cityName) {
      alert('❌ Please fill all required personal fields.');
      return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      alert('❌ Enter a valid 10-digit phone number.');
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
      const regCheck = await axiosInstance.get(`WarrantyRegistration/by-serial/${finalSerial}`);
      if (regCheck.data && regCheck.data.serialNumber) {
        alert('❌ This serial number is already registered.');
        return;
      }
    } catch {}

    const formData = new FormData();
    formData.append('customerName', firstName);
    formData.append('lastName', lastName);
    formData.append('phoneNumber', phone);
    formData.append('address', address);
    formData.append('pincode', pincode);
    formData.append('city', cityName);
    formData.append('cityID', selectedCityObj?.locality_City || '');
    formData.append('locality', selectedLocality);
    formData.append('localityID', selectedCityObj?.locality_Id || '');
    formData.append('serialNumber', finalSerial);
    formData.append('product', serialData?.product || manualProduct);
    formData.append('productID', serialData?.productID || '');
    formData.append('model', serialData?.model || manualModel);
    formData.append('modelID', serialData?.modelID || '');
    formData.append('tdate', new Date().toISOString());
    formData.append('enterBy', 'AdminUser');
    formData.append('dop', dop);
    formData.append('purchaseFromRetailer', retailer);
    formData.append('invoice', invoice ? invoice.name : '');
    formData.append('invoiceFile', invoice);
    formData.append('brandID', serialData?.brandID || '');
    formData.append('brand', serialData?.brand || manualBrand);
    formData.append('landMark', landmark);
    formData.append('warranty', '1 Year');

    try {
      await axiosInstance.post('WarrantyRegistration', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
      setManualBrand('');
      setManualProduct('');
      setManualModel('');
    } catch (err) {
      console.error('❌ Save failed', err);
      alert('❌ Failed to register warranty');
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 ml-[60px] transition-all">
        <div className="max-w-4xl mx-auto my-8 bg-white p-8 rounded-lg shadow">
          <div className="text-left pl-2 mb-8 font-bold text-lg border-2 border-[#714b67] text-[#714b67] rounded-md py-1">
            Warranty Registration
          </div>
  
          {/* Step Tracker */}
          <div className="flex justify-between mb-8 relative">
            {/* Step 1 → Product Details */}
            <div className={`flex flex-col items-center z-10 ${step === 1 ? 'text-[#714b67]' : step > 1 ? 'text-[#714b67]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step === 1 ? 'bg-[#714b67] text-white' : step > 1 ? 'bg-[#714b67] text-white' : 'bg-gray-400 text-white'}`}>
                {step > 1 ? '✓' : 1}
              </div>
              <span className="mt-1 text-sm">Product Details</span>
            </div>
  
            {/* Step 2 → Personal Information */}
            <div className={`flex flex-col items-center z-10 ${step === 2 ? 'text-[#714b67]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step === 2 ? 'bg-[#714b67] text-white' : 'bg-gray-400 text-white'}`}>
                2
              </div>
              <span className="mt-1 text-sm">Personal Information</span>
            </div>
  
            {/* Step line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>
          </div>
  
          {/* Step 1 → Product Details */}
          {step === 1 && (
            <form>
              <div className="grid grid-cols-2 gap-5">
                {/* Serial Number */}
                <div className="flex items-end gap-3 col-span-2">
                  <div className="flex-1">
                    <label className="block font-medium mb-1">Serial Number <span className="text-red-500">*</span></label>
                    <input type="text" value={serialNo} onChange={(e) => setSerialNo(e.target.value)} placeholder="Enter serial number" className="w-full border border-gray-300 rounded px-2 py-1"/>
                  </div>
                  <button type="button" onClick={handleSerialCheck} style={{ backgroundColor: colors.primary }} className="px-4 py-2 text-white rounded">Check</button>
                </div>
  
                {serialError && <div className="bg-red-100 text-red-700 px-3 py-1 rounded col-span-2">{serialError}</div>}
                {serialData && serialData !== 'manual' && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded col-span-2">
                    ✅ Valid serial: <strong>{serialData.itemSerialNo1}</strong> ({serialData.brand} - {serialData.model})
                  </div>
                )}
  
                {/* Brand/Product/Model Section */}
                {serialData === 'manual' ? (
                  <>
                     <div>
      <label className="block font-medium mb-1">Brand <span className="text-red-500">*</span></label>
      <select
        value={manualBrand}
        onChange={(e) => setManualBrand(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
      >
        <option value="">-- Select Brand --</option>
        {brandList.map((b, i) => (
          <option key={i} value={b.brand_ID}>{b.brand_Name}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block font-medium mb-1">Product <span className="text-red-500">*</span></label>
      <select
        value={manualProduct}
        onChange={(e) => setManualProduct(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
      >
        <option value="">-- Select Product --</option>
        {productList
          .filter((p) => p.brandId === Number(manualBrand))   // 🔥 filter products by brandId
          .map((p) => (
            <option key={p.productID} value={p.product}>{p.product}</option>
          ))}
      </select>
    </div>
    <div>
      <label className="block font-medium mb-1">Model <span className="text-red-500">*</span></label>
      <select
        value={manualModel}
        onChange={(e) => setManualModel(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
      >
        <option value="">-- Select Model --</option>
        {modelList.map((m, i) => (
          <option key={i} value={m.modelNo}>{m.modelNo}</option>
        ))}
      </select>
    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block font-medium mb-1">Brand <span className="text-red-500">*</span></label>
                      <input type="text" value={serialData?.brand || ''} readOnly className="w-full border border-gray-300 rounded px-2 py-1"/>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Product <span className="text-red-500">*</span></label>
                      <input type="text" value={serialData?.product || ''} readOnly className="w-full border border-gray-300 rounded px-2 py-1"/>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Model <span className="text-red-500">*</span></label>
                      <input type="text" value={serialData?.model || ''} readOnly className="w-full border border-gray-300 rounded px-2 py-1"/>
                    </div>
                  </>
                )}
  
                {/* Rest Fields */}
                <div>
                  <label className="block font-medium mb-1">Date of Purchase (D.O.P) <span className="text-red-500">*</span></label>
                  <input type="date" value={dop} onChange={(e) => setDop(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1"/>
                </div>
                <div>
                  <label className="block font-medium mb-1">Purchased From (Retailer) <span className="text-red-500">*</span></label>
                  <input type="text" value={retailer} onChange={(e) => setRetailer(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1"/>
                </div>
                <div>
                  <label className="block font-medium mb-1">Upload Invoice <span className="text-red-500">*</span></label>
                  <input type="file" onChange={(e) => setInvoice(e.target.files[0])} className="w-full"/>
                </div>
              </div>
  
              <div className="flex justify-between mt-8">
                <button type="button" onClick={() => validateStep1() && setStep(2)} style={{ backgroundColor: colors.primary }} className="px-4 py-2 text-white rounded">Next</button>
              </div>
            </form>
          )}
  
          {/* Step 2 → Personal Information */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" className="w-full border border-gray-300 rounded px-2 py-1"/>
                </div>
                <div>
                  <label className="block font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" className="w-full border border-gray-300 rounded px-2 py-1"/>
                </div>
                <div>
                  <label className="block font-medium mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" className="w-full border border-gray-300 rounded px-2 py-1"/>
                </div>
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Address <span className="text-red-500">*</span></label>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} placeholder="Enter your address" className="w-full border border-gray-300 rounded px-2 py-1"/>
                </div>
                <div>
                  <label className="block font-medium mb-1">Landmark</label>
                  <input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Enter landmark" className="w-full border border-gray-300 rounded px-2 py-1"/>
                </div>
                <div>
                  <label className="block font-medium mb-1">Pincode <span className="text-red-500">*</span></label>
                  <input value={pincode} onChange={(e) => setPincode(e.target.value)} onBlur={handlePincodeCheck} placeholder="Enter pincode" className="w-full border border-gray-300 rounded px-2 py-1"/>
                  {pincodeError && <div className="bg-red-100 text-red-700 px-2 py-1 rounded mt-1">{pincodeError}</div>}
                </div>
                <div>
                  <label className="block font-medium mb-1">City <span className="text-red-500">*</span></label>
                  <input type="text" value={cityName} readOnly placeholder="City auto-fills" className="w-full border border-gray-300 rounded px-2 py-1"/>
                </div>
                <div>
                  <label className="block font-medium mb-1">Locality <span className="text-red-500">*</span></label>
                  <select value={selectedLocality} onChange={(e) => setSelectedLocality(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1">
                    <option value="">----Select----</option>
                    {localities.map((loc, i) => (
                      <option key={i} value={loc.locality_Name}>{loc.locality_Name}</option>
                    ))}
                  </select>
                </div>
              </div>
  
              <div className="flex justify-between mt-8">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-white rounded bg-gray-500">Back</button>
                <button type="submit" className="px-4 py-2 text-white rounded" style={{ backgroundColor: colors.primary }}>Save</button>
              </div>
            </form>
          )}
        </div>
      </div>
  
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-11/12 text-center shadow-lg">
            <h2 className="text-green-600 mb-4">🎉 Registration Successful</h2>
            <p className="mb-4">Your warranty has been registered successfully.</p>
            <button onClick={() => setShowSuccessPopup(false)} className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
