
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import './stepper.css';

// import SideBar from '@/components/SideBar';
// import CustomerDetailsStep from '@/components/CallRegisterSteps/CustomerDetailsStep';
// import AddressDetailsStep from '@/components/CallRegisterSteps/AddressDetailsStep';
// import ProductDetailsStep from '@/components/CallRegisterSteps/ProductDetailsStep';
// import ServiceDetailsStep from '@/components/CallRegisterSteps/ServiceDetailsStep';

// const steps = ['Customer Details', 'Address Details', 'Product Details', 'Service Details'];

// export default function CallRegister() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [callNumber, setCallNumber] = useState('');
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     callBy: '',
//     title: '',
//     firstName: '',
//     lastName: '',
//     phone: '',
//     altPhone: '',
//     customerAddress: '',
//     landmark: '',
//     pincode: '',
//     state: '',
//     city: '',
//     locality: '',
//     serialNo: '',
//     productCategory: '',
//     brand: '',
//     pop: '',
//     product: '',
//     model: '',
//     warranty: '',
//     callType: '',
//     faultVoc: '',
//     availableTime: ''
//   });

//   // ✅ AUTH CHECK
//   useEffect(() => {
//     const userData = localStorage.getItem('userData');
//     if (!userData) {
//       router.replace('/');
//       return;
//     }

//     const user = JSON.parse(userData);
//     const role = user.roleName?.toLowerCase();

//     if (role !== 'nsp') {
//       router.replace('/');
//     }
//   }, [router]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const requiredFieldsByStep = [
//     ['callBy', 'title', 'firstName', 'lastName', 'phone', 'altPhone'],
//     ['customerAddress', 'pincode'],
//     ['productCategory', 'brand'],
//     ['callType', 'faultVoc', 'availableTime']
//   ];

//   const fieldLabels = {
//     callBy: 'Call By', title: 'Title', firstName: 'First Name', lastName: 'Last Name',
//     phone: 'Phone', altPhone: 'Alternate Phone', customerAddress: 'Customer Address',
//     pincode: 'Pincode', productCategory: 'Product Category', brand: 'Brand',
//     callType: 'Call Type', faultVoc: 'Fault Description', availableTime: 'Available Time'
//   };

//   const validateStep = () => {
//     const fields = requiredFieldsByStep[currentStep] || [];
//     for (let f of fields) {
//       if (!formData[f]?.trim()) {
//         alert(`Please fill the required field: ${fieldLabels[f]}`);
//         return false;
//       }
//     }
//     return true;
//   };

//   const nextStep = () => {
//     if (currentStep < steps.length - 1 && validateStep())
//       setCurrentStep(s => s + 1);
//   };
//   const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

//   const submitCall = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         ...formData,
//         pop: formData.pop ? new Date(formData.pop).toISOString() : null
//       };

//       const res = await fetch('https://ncapi.jainaindia.com/api/CallRegister', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setCallNumber(data.callNumber || data.CallNumber || '');
//       setCurrentStep(0);
//     } catch (err) {
//       console.error(err);
//       alert('Error creating call: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateStep()) return;
//     if (currentStep === steps.length - 1) {
//       submitCall();
//     } else {
//       nextStep();
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0: return <CustomerDetailsStep formData={formData} handleChange={handleChange} setFormData={setFormData} />;
//       case 1: return <AddressDetailsStep formData={formData} handleChange={handleChange} setFormData={setFormData} />;
//       case 2: return <ProductDetailsStep formData={formData} handleChange={handleChange} setFormData={setFormData} />;
//       case 3: return <ServiceDetailsStep formData={formData} handleChange={handleChange} />;
//       default: return null;
//     }
//   };

//   return (
//     <>
//       <SideBar />
//       <div className="main-content">
//         <div className="registration-container">
//           <h2>Call Registration</h2>

//           {callNumber ? (
//             <div className="success-message">
//               <h3>Service Request No Created Successfully!</h3>
//               <p>Your Service Request No Number is: <strong>{callNumber}</strong></p>
//               <button onClick={() => { setCallNumber(''); setFormData({}); }}>
//                 Register Another
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="stepper">
//                 {steps.map((label, idx) => (
//                   <div className="step" key={idx}>
//                     <div className={`circle ${idx <= currentStep ? 'active' : ''}`}>
//                       {idx < currentStep ? '✔' : idx + 1}
//                     </div>
//                     <div className="label">{label}</div>
//                     {idx < steps.length - 1 && <div className="line"></div>}
//                   </div>
//                 ))}
//               </div>

//               <form onSubmit={handleSubmit} className="registration-form">
//                 {renderStep()}

//                 <div className="button-wrapper">
//                   {currentStep > 0 && (
//                     <button type="button" onClick={prevStep} disabled={loading}>
//                       ← Back
//                     </button>
//                   )}
//                   <button type="submit" disabled={loading}>
//                     {currentStep < steps.length - 1 ? 'Next →' : loading ? 'Submitting…' : 'Submit ✔'}
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import './stepper.css';
// import axiosInstance from '@/api/axiosInstance';

// import SideBar from '@/components/SideBar';
// import CustomerDetailsStep from '@/components/CallRegisterSteps/CustomerDetailsStep';
// import AddressDetailsStep from '@/components/CallRegisterSteps/AddressDetailsStep';
// import ProductDetailsStep from '@/components/CallRegisterSteps/ProductDetailsStep';
// import ServiceDetailsStep from '@/components/CallRegisterSteps/ServiceDetailsStep';

// const steps = ['Customer Details', 'Address Details', 'Product Details', 'Service Details'];

// export default function CallRegister() {
//   const router = useRouter();
//   const [errors, setErrors] = useState({});
//   const [currentStep, setCurrentStep] = useState(0);
//   const [callNumber, setCallNumber] = useState('');
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     callBy: '', 
//     title: '',
//     firstName: '',
//     lastName: '',
//     phone: '',
//     altPhone: '',
//     customerAddress: '',
//     landmark: '',
//     pincode: '',
//     state: '',
//     city: '',
//     locality: '',
//     localityId: '',
//     modelID: '',
//     cityId: '',
//     serialNo: '',
//     productCategory: '',
//     brand: '',
//     pop: '',
//     product: '',
//     productID: '',
//     model: '',
//     warranty: '',
//     callType: '',
//     faultVoc: '',
//     availableTime: '',
//     userIP:''
//   }); 

//   // ✅ AUTH CHECK
//   useEffect(() => {
//     const userData = localStorage.getItem('userData');
//     if (!userData) {
//       router.replace('/');
//       return;
//     }

//     const user = JSON.parse(userData);
//     const role = user.roleName?.toLowerCase();

//     if (role !== 'cc') {
//       router.replace('/');
//     }
//   }, [router]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const requiredFieldsByStep = [
//     ['callBy', 'title', 'firstName', 'lastName', 'phone', 'altPhone'],
//     ['customerAddress', 'pincode'],
//     ['serialNo', 'productCategory', 'brand','pop'],
//     ['callType', 'faultVoc', 'availableTime']
//   ]; 

//   const fieldLabels = {
//     callBy: 'Call By', title: 'Title', firstName: 'First Name', lastName: 'Last Name',
//     phone: 'Phone', altPhone: 'Alternate Phone', customerAddress: 'Customer Address',
//     pincode: 'Pincode', productCategory: 'Product Category', brand: 'Brand',
//     callType: 'Call Type', faultVoc: 'Fault Description', availableTime: 'Available Time',serialNo:'serial No',pop:'DOP'
//   };

//   const validateStep = () => {
//     const fields = requiredFieldsByStep[currentStep] || [];
//     const newErrors = {};
  
//     fields.forEach(f => {
//       if (!formData[f]?.trim()) {
//         newErrors[f] = `Please fill the required field: ${fieldLabels[f]}`;
//       }
//     });
  
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (currentStep < steps.length - 1 && validateStep())
//       setCurrentStep(s => s + 1);
//   };
//   const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

//   // const submitCall = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const payload = {
//   //       SALUTATION: formData.title || "",
//   //       FIRSTNAME: formData.firstName || "",
//   //       LASTNAME: formData.lastName || "",
  
//   //       HMPH: formData.phone || "",        // home phone
//   //       WKPH: formData.altPhone || "",     // work phone
//   //       stdcode: formData.stdCode || "",
  
//   //       pincode: formData.pincode || "",
//   //       MOBILE: formData.phone || "",
//   //       ADDRESS1: formData.customerAddress || "",
//   //       ADDRESS2: formData.address2 || "",
//   //       City_ID: formData.cityId || 0,
//   //       Locality_ID: formData.localityId || 0,
//   //       landmark: formData.landmark || "",
  
//   //       Call_Category: formData.callType || "Service",
//   //       Call_TypeID: formData.callTypeId || 4,
//   //       CallBy_ID: formData.callById || 1,
//   //       WarrantyID: formData.warrantyId || 3,
//   //       CALL_TYPE: formData.callType || "Service",
//   //       CALL_BY: formData.callBy || "Customer",
//   //       Dealer: formData.dealer || "",
//   //       WARRANTY: formData.warranty || "",
        
//   //       PRODUCT: formData.product || "",
//   //       Product_ID: formData.productID || 0,
//   //       Model_ID: formData.modelID || 0,
//   //       PURCHASE_DATE: formData.pop || "",   // purchase date
//   //       SERIAL_NO: formData.serialNo || "",
  
//   //       PROMISE_DATE: formData.serviceDate || "",
//   //       PROMISE_TIME: formData.availableTime || "",
//   //       Category: formData.productCategory || "",
//   //       EnterBy: "Admin", 
  
//   //       COMPLAINT_STATUS: "OK",
//   //       Remarks: formData.faultVoc || "",
//   //       Email: formData.email || "",
//   //       Complaint_SubStatus: "Pending",
//   //       Excalated: 0,
//   //       Legal: 0,
  
//   //       EnteredBy: "Admin User",
//   //       EnteredByID: 101,
//   //       IPAddress: "192.168.1.100"
//   //     };
//   //     console.log("Payload being sent:", payload);
//   //     await axiosInstance.post("/callregister/create-complaint", payload);
  
//   //     // backend sends returnNo (not callNumber)
//   //     setCallNumber(data.returnNo || "");
//   //     setCurrentStep(0);
//   //   } catch (err) {
//   //     console.error("Call Register Error:", err);
//   //     alert("Error creating call: " + (err.response?.data?.message || err.message));
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const submitCall = async () => {
//   setLoading(true);
//   try {
//     const payload = {
//       SALUTATION: formData.title || "",
//       FIRSTNAME: formData.firstName || "",
//       LASTNAME: formData.lastName || "",

//       HMPH: formData.phone || "",
//       WKPH: formData.altPhone || "",
//       stdcode: formData.stdCode || "",

//       pincode: formData.pincode || "",
//       MOBILE: formData.phone || "",
//       ADDRESS1: formData.customerAddress || "",
//       ADDRESS2: formData.address2 || "",
//       City_ID: formData.cityId || 0,
//       Locality_ID: formData.localityId || 0,
//       landmark: formData.landmark || "",

//       Call_Category: formData.callType || "NA",
//       Call_TypeID: formData.callTypeId || 4,
//       CallBy_ID: formData.callById || 1,
//       WarrantyID: formData.warrantyId || 3,
//       CALL_TYPE: formData.callType || "NA",
//       CALL_BY: formData.callBy || "Customer",
//       Dealer: formData.dealer || "",
//       WARRANTY: formData.warranty || "",

//       PRODUCT: formData.product || "",
//       Product_ID: formData.productID || 0,
//       Model_ID: formData.modelID || 0,
//       PURCHASE_DATE: formData.pop || "",
//       SERIAL_NO: formData.serialNo || "",

//       PROMISE_DATE: formData.serviceDate || "",
//       PROMISE_TIME: formData.availableTime || "",
//       Category: formData.productCategory || "",
//       EnterBy: "Admin", 

//       COMPLAINT_STATUS: "OK",
//       Remarks: formData.faultVoc || "",
//       Email: formData.email || "",
//       Complaint_SubStatus: "Pending",
//       Excalated: 0,
//       Legal: 0,

//       EnteredBy: "Admin User",
//       EnteredByID: 101,
//       IPAddress: "192.168.1.100"
//     };

//     console.log("Payload being sent:", payload);

//     // ✅ Capture axios response
//     const response = await axiosInstance.post("/callregister/create-complaint", payload);

//     // backend usually returns data inside response.data
//     setCallNumber(response.data?.returnNo || "");

//     // reset to step 0
//     setCurrentStep(0);

//   } catch (err) {
//     console.error("Call Register Error:", err);
//     alert("Error creating call: " + (err.response?.data?.message || err.message));
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateStep()) return;
//     if (currentStep === steps.length - 1) {
//       submitCall();
//     } else {
//       nextStep();
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <CustomerDetailsStep
//             formData={formData}
//             handleChange={handleChange}
//             setFormData={setFormData}
//             errors={errors}
//           />
//         );
//       case 1:
//         return (
//           <AddressDetailsStep
//             formData={formData}
//             handleChange={handleChange}
//             setFormData={setFormData}
//             errors={errors}
//           />
//         );
//       case 2:
//         return (
//           <ProductDetailsStep
//             formData={formData}
//             handleChange={handleChange}
//             setFormData={setFormData}
//             errors={errors}
//           />
//         );
//       case 3:
//         return (
//           <ServiceDetailsStep
//             formData={formData}
//             handleChange={handleChange}
//             setFormData={setFormData} 
//             errors={errors}
//           />
//         );
//       default:
//         return null;
//     }
//   };
  

//   return (
//     <>
//       <SideBar />
//       <div className="main-content">
//         <div className="registration-container">
//           <h2>Call Registration</h2>

//           {callNumber ? (
//             <div className="success-message">
//               <h3>Service Request No Created Successfully!</h3>
//               <p>Your Service Request No Number is: <strong>{callNumber}</strong></p>
//               <button onClick={() => { setCallNumber(''); setFormData({}); }}>
//                 Register Another
//               </button>
//             </div>
//           ) : (
//             <>
//         <div className="stepper">
//   {steps.map((label, idx) => (
//     <div className="step" key={idx}>
//       <div className={`circle ${idx <= currentStep ? 'active' : ''}`}>
//         {idx <= currentStep ? '✔' : ''}
//       </div>
//       <div className="label">{label}</div>
//       {idx < steps.length - 1 && <div className="line"></div>}
//     </div>
//   ))}
// </div>

//               <form onSubmit={handleSubmit} className="registration-form">
//                 {renderStep()}

//                 <div className="button-wrapper">
//                   {currentStep > 0 && (
//                     <button type="button" onClick={prevStep} disabled={loading}>
//                       ← Back
//                     </button>
//                   )}
//                   <button type="submit" disabled={loading}>
//                     {currentStep < steps.length - 1 ? 'Next →' : loading ? 'Submitting…' : 'Submit ✔'}
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// } 






// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import './stepper.css';
// import axios from 'axios'; // for IP fetch
// import axiosInstance from '@/api/axiosInstance';

// import SideBar from '@/components/SideBar';
// import CustomerDetailsStep from '@/components/CallRegisterSteps/CustomerDetailsStep';
// import AddressDetailsStep from '@/components/CallRegisterSteps/AddressDetailsStep';
// import ProductDetailsStep from '@/components/CallRegisterSteps/ProductDetailsStep';
// import ServiceDetailsStep from '@/components/CallRegisterSteps/ServiceDetailsStep';

// const steps = ['Customer Details', 'Address Details', 'Product Details', 'Service Details'];

// export default function CallRegister() {
//   const router = useRouter();
//   const [errors, setErrors] = useState({});
//   const [currentStep, setCurrentStep] = useState(0);
//   const [callNumber, setCallNumber] = useState('');
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     callBy: '', 
//     title: '',
//     firstName: '',
//     lastName: '',
//     phone: '',
//     altPhone: '',
//     customerAddress: '',
//     landmark: '',
//     pincode: '',
//     state: '',
//     city: '',
//     locality: '',
//     localityId: '',
//     modelID: '',
//     cityId: '',
//     serialNo: '',
//     productCategory: '',
//     brand: '',
//     pop: '',
//     product: '',
//     productID: '',
//     model: '',
//     warranty: '',
//     callType: '',
//     faultVoc: '',
//     availableTime: '',
//     userIP: '' // <-- will be filled once
//   });

//   // AUTH CHECK
//   useEffect(() => {
//     const userData = localStorage.getItem('userData');
//     if (!userData) {
//       router.replace('/');
//       return;
//     }
//     const user = JSON.parse(userData);
//     const role = user.roleName?.toLowerCase();
//     if (role !== 'cc') {
//       router.replace('/');
//     }
//   }, [router]);

//   // Fetch public IP once (cached in localStorage)
//   useEffect(() => {
//     const existing = localStorage.getItem('clientIP');
//     if (existing) {
//       setFormData(prev => ({ ...prev, userIP: existing }));
//       return;
//     }
//     (async () => {
//       try {
//         const res = await axios.get('https://api.ipify.org?format=json');
//         const ip = res?.data?.ip || '';
//         if (ip) {
//           localStorage.setItem('clientIP', ip);
//           setFormData(prev => ({ ...prev, userIP: ip }));
//         }
//       } catch (e) {
//         console.error('Failed to fetch IP:', e);
//       }
//     })();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const requiredFieldsByStep = [
//     ['callBy', 'title', 'firstName', 'lastName', 'phone', 'altPhone'],
//     ['customerAddress', 'pincode'],
//     ['serialNo', 'productCategory', 'brand','pop'],
//     ['callType', 'faultVoc', 'availableTime']
//   ];

//   const fieldLabels = {
//     callBy: 'Call By', title: 'Title', firstName: 'First Name', lastName: 'Last Name',
//     phone: 'Phone', altPhone: 'Alternate Phone', customerAddress: 'Customer Address',
//     pincode: 'Pincode', productCategory: 'Product Category', brand: 'Brand',
//     callType: 'Call Type', faultVoc: 'Fault Description', availableTime: 'Available Time', serialNo:'serial No', pop:'DOP'
//   };

//   const validateStep = () => {
//     const fields = requiredFieldsByStep[currentStep] || [];
//     const newErrors = {};
//     fields.forEach(f => {
//       if (!`${formData[f] ?? ''}`.trim()) {
//         newErrors[f] = `Please fill the required field: ${fieldLabels[f]}`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (currentStep < steps.length - 1 && validateStep()) setCurrentStep(s => s + 1);
//   };
//   const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

//   const submitCall = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         SALUTATION: formData.title || "",
//         FIRSTNAME: formData.firstName || "",
//         LASTNAME: formData.lastName || "",

//         HMPH: formData.phone || "",
//         WKPH: formData.altPhone || "",
//         stdcode: formData.stdCode || "",

//         pincode: formData.pincode || "",
//         MOBILE: formData.phone || "",
//         ADDRESS1: formData.customerAddress || "",
//         ADDRESS2: formData.address2 || "",
//         City_ID: formData.cityId || 0,
//         Locality_ID: formData.localityId || 0,
//         landmark: formData.landmark || "",

//         Call_Category: formData.callType || "NA",
//         Call_TypeID: formData.callTypeId || 4,
//         CallBy_ID: formData.callById || 1,
//         WarrantyID: formData.warrantyId || 3,
//         CALL_TYPE: formData.callType || "NA",
//         CALL_BY: formData.callBy || "Customer",
//         Dealer: formData.dealer || "",
//         WARRANTY: formData.warranty || "",

//         PRODUCT: formData.product || "",
//         Product_ID: formData.productID || 0,
//         Model_ID: formData.modelID || 0,
//         PURCHASE_DATE: formData.pop || "",
//         SERIAL_NO: formData.serialNo || "",

//         PROMISE_DATE: formData.serviceDate || "",
//         PROMISE_TIME: formData.availableTime || "",
//         Category: formData.productCategory || "",
//         EnterBy: "Admin",

//         COMPLAINT_STATUS: "OK",
//         Remarks: formData.faultVoc || "",
//         Email: formData.email || "",
//         Complaint_SubStatus: "Pending",
//         Excalated: 0,
//         Legal: 0,

//         EnteredBy: "Admin User",
//         EnteredByID: 101,
//         IPAddress: formData.userIP || "0.0.0.0" // <-- IMPORTANT: use formData.userIP
//       };

//       console.log("Payload being sent:", payload);

//       const response = await axiosInstance.post("/callregister/create-complaint", payload);
//       setCallNumber(response.data?.returnNo || "");
//       setCurrentStep(0);
//     } catch (err) {
//       console.error("Call Register Error:", err);
//       alert("Error creating call: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateStep()) return;
//     if (currentStep === steps.length - 1) {
//       submitCall();
//     } else {
//       nextStep();
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <CustomerDetailsStep
//             formData={formData}
//             handleChange={handleChange}
//             setFormData={setFormData}
//             errors={errors}
//           />
//         );
//       case 1:
//         return (
//           <AddressDetailsStep
//             formData={formData}
//             handleChange={handleChange}
//             setFormData={setFormData}
//             errors={errors}
//           />
//         );
//       case 2:
//         return (
//           <ProductDetailsStep
//             formData={formData}
//             handleChange={handleChange}
//             setFormData={setFormData}
//             errors={errors}
//           />
//         );
//       case 3:
//         return (
//           <ServiceDetailsStep
//             formData={formData}
//             handleChange={handleChange}
//             setFormData={setFormData}
//             errors={errors}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <SideBar />
//       <div className="main-content">
//         <div className="registration-container">
//           <h2>Call Registration</h2>
 
//           {callNumber ? (
//           <div className="success-message">
//           <h3 style={{ marginBottom: "30px" }}>Service Request No Created Successfully!</h3>
//           <p style={{ marginBottom: "25px" }}>
//             Your Service Request No Number is: <strong>{callNumber}</strong>
//           </p>
//           <button onClick={() => { setCallNumber(''); setFormData({}); }}>
//             Register Another
//           </button>
//         </div>
//           ) : (
//             <>
//               <div className="stepper">
//                 {steps.map((label, idx) => (
//                   <div className="step" key={idx}>
//                     <div className={`circle ${idx <= currentStep ? 'active' : ''}`}>
//                       {idx <= currentStep ? '✔' : ''}
//                     </div>
//                     <div className="label">{label}</div>
//                     {idx < steps.length - 1 && <div className="line"></div>}
//                   </div>
//                 ))}
//               </div>

//               <form onSubmit={handleSubmit} className="registration-form">
//                 {renderStep()}
//                 <div className="button-wrapper">
//                   {currentStep > 0 && (
//                     <button type="button" onClick={prevStep} disabled={loading}>
//                       ← Back
//                     </button>
//                   )}
//                   <button type="submit" disabled={loading}>
//                     {currentStep < steps.length - 1 ? 'Next →' : loading ? 'Submitting…' : 'Submit ✔'}
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './stepper.css';
import axios from 'axios'; // for IP fetch
import axiosInstance from '@/api/axiosInstance';

import SideBar from '@/components/SideBar';
import CustomerDetailsStep from '@/components/CallRegisterSteps/CustomerDetailsStep';
import AddressDetailsStep from '@/components/CallRegisterSteps/AddressDetailsStep';
import ProductDetailsStep from '@/components/CallRegisterSteps/ProductDetailsStep';
import ServiceDetailsStep from '@/components/CallRegisterSteps/ServiceDetailsStep';

const steps = ['Customer Details', 'Address Details', 'Product Details', 'Service Details'];

export default function CallRegister() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [callNumber, setCallNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // NEW: pincode validation status lifted here
  // '', 'checking', 'valid', 'invalid'
  const [pincodeStatus, setPincodeStatus] = useState('');

  const [formData, setFormData] = useState({
    callBy: '',
    title: '',
    firstName: '',
    lastName: '',
    phone: '',
    altPhone: '',
    customerAddress: '',
    landmark: '',
    pincode: '',
    state: '',
    city: '',
    locality: '',
    localityId: '',
    modelID: '',
    cityId: '',
    serialNo: '',
    productCategory: '',
    brand: '',
    pop: '',
    product: '',
    productID: '',
    model: '',
    warranty: '',
    callType: '',
    faultVoc: '',
    availableTime: '',
    userIP: '' // <-- will be filled once
  });

  // AUTH CHECK
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.replace('/');
      return;
    }
    const user = JSON.parse(userData);
    const role = user.roleName?.toLowerCase();
    if (role !== 'cc') {
      router.replace('/');
    }
  }, [router]);

  // Fetch public IP once (cached in localStorage)
  useEffect(() => {
    const existing = localStorage.getItem('clientIP');
    if (existing) {
      setFormData(prev => ({ ...prev, userIP: existing }));
      return;
    }
    (async () => {
      try {
        const res = await axios.get('https://api.ipify.org?format=json');
        const ip = res?.data?.ip || '';
        if (ip) {
          localStorage.setItem('clientIP', ip);
          setFormData(prev => ({ ...prev, userIP: ip }));
        }
      } catch (e) {
        console.error('Failed to fetch IP:', e);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const requiredFieldsByStep = [
    ['callBy', 'title', 'firstName', 'lastName', 'phone', 'altPhone'],
    ['customerAddress', 'pincode'],
    ['serialNo', 'productCategory', 'brand','pop'],
    ['callType', 'faultVoc', 'availableTime']
  ];

  const fieldLabels = {
    callBy: 'Call By', title: 'Title', firstName: 'First Name', lastName: 'Last Name',
    phone: 'Phone', altPhone: 'Alternate Phone', customerAddress: 'Customer Address',
    pincode: 'Pincode', productCategory: 'Product Category', brand: 'Brand',
    callType: 'Call Type', faultVoc: 'Fault Description', availableTime: 'Available Time', serialNo:'serial No', pop:'DOP'
  };

  const validateStep = () => {
    const fields = requiredFieldsByStep[currentStep] || [];
    const newErrors = {};
    fields.forEach(f => {
      if (!`${formData[f] ?? ''}`.trim()) {
        newErrors[f] = `Please fill the required field: ${fieldLabels[f]}`;
      }
    });

    // EXTRA: Address Details (step index 1) must have a valid pincode
    if (currentStep === 1) {
      const pin = `${formData.pincode || ''}`.trim();
      // block while checking, when not 6 digits, or when API returned invalid
      if (pincodeStatus === 'checking') {
        newErrors.pincode = 'Validating pincode… please wait';
      } else if (pin.length !== 6) {
        newErrors.pincode = 'Please enter a 6-digit pincode';
      } else if (pincodeStatus !== 'valid') {
        newErrors.pincode = 'Please enter a valid pincode';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && validateStep()) setCurrentStep(s => s + 1);
  };
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

  const submitCall = async () => {
    setLoading(true);
    try {
      const payload = {
        SALUTATION: formData.title || "",
        FIRSTNAME: formData.firstName || "",
        LASTNAME: formData.lastName || "",

        HMPH: formData.phone || "",
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
        EnterBy: "Admin",

        COMPLAINT_STATUS: "OK",
        Remarks: formData.faultVoc || "",
        Email: formData.email || "",
        Complaint_SubStatus: "",
        Excalated: 0,
        Legal: 0,

        EnteredBy: "Admin User",
        EnteredByID: 101,
        IPAddress: formData.userIP || "0.0.0.0"
      };

      console.log("Payload being sent:", payload);

      const response = await axiosInstance.post("/callregister/create-complaint", payload);
      setCallNumber(response.data?.returnNo || "");
      setCurrentStep(0);
    } catch (err) {
      console.error("Call Register Error:", err);
      alert("Error creating call: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

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
            // pass pin validation state so parent can block Next
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
      <SideBar />
      <div className="main-content">
        <div className="registration-container">
          <h2>Call Registration</h2>

          {callNumber ? (
            <div className="success-message">
              <h3 style={{ marginBottom: "30px" }}>Service Request No Created Successfully!</h3>
              <p style={{ marginBottom: "25px" }}>
                Your Service Request No Number is: <strong>{callNumber}</strong>
              </p>
              <button onClick={() => { setCallNumber(''); setFormData({}); }}>
                Register Another
              </button>
            </div>
          ) : (
            <>
              <div className="stepper">
                {steps.map((label, idx) => (
                  <div className="step" key={idx}>
                    <div className={`circle ${idx <= currentStep ? 'active' : ''}`}>
                      {idx <= currentStep ? '✔' : ''}
                    </div>
                    <div className="label">{label}</div>
                    {idx < steps.length - 1 && <div className="line"></div>}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="registration-form">
                {renderStep()}
                <div className="button-wrapper">
                  {currentStep > 0 && (
                    <button type="button" onClick={prevStep} disabled={loading}>
                      ← Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading /* optional: strictly UI-disable during checking */}
                  >
                    {currentStep < steps.length - 1 ? 'Next →' : loading ? 'Submitting…' : 'Submit ✔'}
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
