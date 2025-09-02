// 'use client';
// import { useState } from 'react';
// import { useTheme } from '@/theme/ThemeContext';
// import {
//   MdTv,
//   MdAcUnit,
//   MdKitchen,
//   MdLocalLaundryService,
//   MdSpeaker,
//   MdOutlineAcUnit,
// } from 'react-icons/md';
 
// export default function AscCreationForm() {
//     const { colors } = useTheme(); 
//   const [categories, setCategories] = useState({
//     led: false,
//     ac: false,
//     fridge: false,
//     wm: false,
//     speaker: false,
//     cooler: false,
//   });

//   const [isChecked, setIsChecked] = useState(false);

//   const toggleCategory = (key) => {
//     setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const categoryItems = [
//     { key: 'led', label: 'LED', Icon: MdTv },
//     { key: 'ac', label: 'Air Conditioner', Icon: MdAcUnit },
//     { key: 'fridge', label: 'Refrigerator', Icon: MdKitchen },
//     { key: 'wm', label: 'Washing Machine', Icon: MdLocalLaundryService },
//     { key: 'speaker', label: 'Speaker', Icon: MdSpeaker },
//     { key: 'cooler', label: 'Cooler', Icon: MdOutlineAcUnit },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow">
//       <h2 className="text-2xl font-bold mb-8 text-left"style={{color:colors.primary,padding:5,fontWeight:700,fontSize:18,  border: `2px solid ${colors.primary}`,borderRadius:5}}>ASC Creation Request</h2>

//       {/* Form Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div>
//           <label className="block text-sm font-medium mb-1">ASC Name</label>
//           <input type="text" placeholder="Enter ASC name" className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">Owner Name</label>
//           <input type="text" placeholder="Enter owner name" className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Asc Email ID</label>
//           <input type="email" placeholder="Enter Email ID" className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none" />
//         </div>


//         <div>
//   <label className="block text-sm font-medium mb-1">Contact Number</label>
//   <input
//     type="text"
//     placeholder="Enter contact number"
//     maxLength={10} // prevents typing more than 10
//     className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none"
//     onInput={(e) => {
//       // allow only digits
//       e.target.value = e.target.value.replace(/\D/g, '');
//     }}
//     onBlur={(e) => {
//       if (e.target.value.length !== 10) {
//         alert("Contact number must be exactly 10 digits.");
//       }
//     }}
//   />
// </div>


// <div>
//           <label className="block text-sm font-medium mb-1">state</label>
//           <input type="text" placeholder="Enter GST number" className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none" />
//         </div>

//         {/* <div>
//           <label className="block text-sm font-medium mb-1">State</label>
//           <select className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none">
//             <option>Select state</option>
//           </select>
//         </div> */}
//         {/* <div>
//           <label className="block text-sm font-medium mb-1">City</label>
//           <select className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none">
//             <option>Select city</option>
//           </select>
//         </div> */}

// <div>
//           <label className="block text-sm font-medium mb-1">city</label>
//           <input type="text" placeholder="Enter GST number" className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Pincode</label>
//           <input type="text" placeholder="Enter GST number" className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none" />
//         </div>



//         <div>
//           <label className="block text-sm font-medium mb-1">GST Number</label>
//           <input type="text" placeholder="Enter GST number" className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none" />
//         </div>

       
//         <div>
//           <label className="block text-sm font-medium mb-1">PAN Number</label>
//           <input type="text" placeholder="Enter PAN number" className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">Adhar Card Number</label>
//           <input type="text" placeholder="Enter PAN number" className="w-full border border-gray-300 focus:ring-2    rounded-md px-4 py-2 outline-none" />
//         </div>
//       </div>

//       {/* Category Selection */}
//       <h3 className="text-lg font-semibold mt-10 mb-4">Select Category</h3>
//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
//       {categoryItems.map(({ key, label, Icon }) => (
//   <div
//     key={key}
//     onClick={() => toggleCategory(key)}
//     className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition ${
//       categories[key] ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
//     }`}
//   >
//     {/* Dynamic color based on selection */}
//     <Icon size={32} style={{ color: categories[key] ? colors.primary : '#4B5563' }} />
//     <div className="font-medium">{label}</div>
//     <input
//       type="checkbox"
//       checked={categories[key]}
//       readOnly
//       className="form-checkbox h-5 w-5 text-blue-600"
//     />
//   </div>
// ))}
//       </div>

//       {/* Confirmation */}
//       <div className="flex items-start gap-2 mb-6">
//         <input
//           type="checkbox"
//           id="confirm"
//           checked={isChecked}
//           onChange={(e) => setIsChecked(e.target.checked)}
//           className="mt-1"
//         />
//         <label htmlFor="confirm" className="text-sm text-gray-700">
//           I hereby confirm that the above details for new ASC creation request are correct and aligned with the John's agreement.
//         </label>
//       </div>

//       {/* Submit Button */}
//       <div className="flex justify-end">
//         <button
//           className="text-white px-6 py-2 rounded"
//           disabled={!isChecked}style={{background:colors.primary}}
//         >
//           Create Ticket No.
//         </button>
//       </div>
//     </div>
//   );
// }




'use client';
import { useState } from 'react';
import { useTheme } from '@/theme/ThemeContext';
import axiosInstance from '@/api/axiosInstance';
import {
  MdTv,
  MdAcUnit,
  MdKitchen,
  MdLocalLaundryService,
  MdSpeaker,
  MdOutlineAcUnit,
} from 'react-icons/md';
 
export default function AscCreationForm() {
  const { colors } = useTheme(); 
  const [categories, setCategories] = useState({
    led: false,
    ac: false,
    fridge: false,
    wm: false,
    speaker: false,
    cooler: false,
  });

  const [isChecked, setIsChecked] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    ASC_Name: '',
    ASC_Owner_Name: '',
    ASC_Contact_No: '',
    ASC_Address: '',
    State: '',
    City: '',
    ASC_PinCode: '',
    ASC_EMail: '',
    PanCardNo: '',
    GSTNo: '',
    AadharCardNo: '',
  });

  const toggleCategory = (key) => {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categoryItems = [
    { key: 'led', label: 'LED', Icon: MdTv },
    { key: 'ac', label: 'Air Conditioner', Icon: MdAcUnit },
    { key: 'fridge', label: 'Refrigerator', Icon: MdKitchen },
    { key: 'wm', label: 'Washing Machine', Icon: MdLocalLaundryService },
    { key: 'speaker', label: 'Speaker', Icon: MdSpeaker },
    { key: 'cooler', label: 'Cooler', Icon: MdOutlineAcUnit },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isChecked) return;

    try {
      const payload = {
        ...formData,
        LED: categories.led ? 'Yes' : 'No',
        AirConditioner: categories.ac ? 'Yes' : 'No',
        Refrigerator: categories.fridge ? 'Yes' : 'No',
        WashingMachine: categories.wm ? 'Yes' : 'No',
        Speaker: categories.speaker ? 'Yes' : 'No',
        Cooler: categories.cooler ? 'Yes' : 'No',
        CreatedBy: 'admin',      // You can make dynamic later
        MidifiedBy: 'admin',
      };

      const response = await axiosInstance.post('ASCCreation/create', payload);
      alert('ASC created successfully! Ticket No: ');
    } catch (error) {
      console.error(error);
      alert('Failed to create ASC. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-8 text-left"
        style={{
          color: colors.primary,
          padding: 5,
          fontWeight: 700,
          fontSize: 18,
          border: `2px solid ${colors.primary}`,
          borderRadius: 5
        }}
      >
        ASC Creation Request
      </h2>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">ASC Name</label>
          <input type="text" name="ASC_Name" value={formData.ASC_Name} onChange={handleInputChange}
            placeholder="Enter ASC name" className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Owner Name</label>
          <input type="text" name="ASC_Owner_Name" value={formData.ASC_Owner_Name} onChange={handleInputChange}
            placeholder="Enter owner name" className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Asc Email ID</label>
          <input type="email" name="ASC_EMail" value={formData.ASC_EMail} onChange={handleInputChange}
            placeholder="Enter Email ID" className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="text" name="ASC_Contact_No" value={formData.ASC_Contact_No} onChange={handleInputChange}
            maxLength={10}
            placeholder="Enter contact number"
            className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none"
            onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
            onBlur={(e) => {
              if (e.target.value.length !== 10) alert("Contact number must be exactly 10 digits.");
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input type="text" name="State" value={formData.State} onChange={handleInputChange}
            placeholder="Enter state" className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input type="text" name="City" value={formData.City} onChange={handleInputChange}
            placeholder="Enter city" className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pincode</label>
          <input type="text" name="ASC_PinCode" value={formData.ASC_PinCode} onChange={handleInputChange}
            placeholder="Enter pincode" className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GST Number</label>
          <input type="text" name="GSTNo" value={formData.GSTNo} onChange={handleInputChange}
            placeholder="Enter GST number" className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">PAN Number</label>
          <input type="text" name="PanCardNo" value={formData.PanCardNo} onChange={handleInputChange}
            placeholder="Enter PAN number" className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Aadhar Card Number</label>
          <input type="text" name="AadharCardNo" value={formData.AadharCardNo} onChange={handleInputChange}
            placeholder="Enter Aadhar number" className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input type="text" name="ASC_Address" value={formData.ASC_Address} onChange={handleInputChange}
            placeholder="Enter address" className="w-full border border-gray-300 focus:ring-2 rounded-md px-4 py-2 outline-none" />
        </div>
      </div>

      {/* Category Selection */}
      <h3 className="text-lg font-semibold mt-10 mb-4">Select Category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {categoryItems.map(({ key, label, Icon }) => (
          <div
            key={key}
            onClick={() => toggleCategory(key)}
            className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition ${
              categories[key] ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
            }`}
          >
            <Icon size={32} style={{ color: categories[key] ? colors.primary : '#4B5563' }} />
            <div className="font-medium">{label}</div>
            <input type="checkbox" checked={categories[key]} readOnly className="form-checkbox h-5 w-5 text-blue-600" />
          </div>
        ))}
      </div>

      {/* Confirmation */}
      <div className="flex items-start gap-2 mb-6">
        <input type="checkbox" id="confirm" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} className="mt-1" />
        <label htmlFor="confirm" className="text-sm text-gray-700">
          I hereby confirm that the above details for new ASC creation request are correct and aligned with the John's agreement.
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="text-white px-6 py-2 rounded"
          disabled={!isChecked}
          style={{ background: colors.primary }}
        >
          Create ASC.
        </button>
      </div>
    </div>
  );
}
