

// 'use client';
// import { useState } from 'react';
// import axiosInstance from '@/api/axiosInstance'; // adjust path if needed

// export default function AddressDetailsStep({ formData, handleChange, setFormData }) {
//   const [localities, setLocalities] = useState([]);
//   const [pincodeStatus, setPincodeStatus] = useState('');

//   const handlePincodeChange = async (e) => {
//     let value = e.target.value.replace(/\D/g, ''); // allow only digits

//     // Limit to 6 digits
//     if (value.length > 6) value = value.slice(0, 6);

//     // Update pincode in form data
//     setFormData((prev) => ({ ...prev, pincode: value }));

//     if (value.length === 6) {
//       try {
//         const res = await axiosInstance.get(`LocalityMaster/by-pincode/${value}`);
//         const data = res.data;

//         if (Array.isArray(data) && data.length > 0) {
//           setLocalities(data);
//           setFormData((prev) => ({
//             ...prev,
//             state: data[0].state_Name || '',
//             city: data[0].city_Name || '',
//             locality: data[0].locality_Name || '',
//           }));
//           setPincodeStatus('valid');
//         } else {
//           setLocalities([]);
//           setFormData((prev) => ({
//             ...prev,
//             state: '',
//             city: '',
//             locality: '',
//           }));
//           setPincodeStatus('invalid');
//         }
//       } catch (err) {
//         console.error('API error:', err);
//         setPincodeStatus('invalid');
//       }
//     } else {
//       setPincodeStatus('');
//       setLocalities([]);
//       setFormData((prev) => ({
//         ...prev,
//         state: '',
//         city: '',
//         locality: '',
//       }));
//     }
//   };

//   const handleLocalityChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       locality: e.target.value,
//     }));
//   };

//   const fields = ['customerAddress', 'landmark', 'pincode', 'state', 'city'];

//   const formatLabel = (field) =>
//     field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();

//   return (
//     <>
//       <h3>Address Details</h3>
//       <div className="form-grid">
//         {fields.map((field) => (
//           <div className="form-group" key={field}>
//             <label htmlFor={field}>{formatLabel(field)}</label>
//             <input
//               id={field}
//               name={field}
//               placeholder={formatLabel(field)}
//               value={formData[field] || ''}
//               onChange={field === 'pincode' ? handlePincodeChange : handleChange}
//               readOnly={['state', 'city'].includes(field)}
//               maxLength={field === 'pincode' ? 6 : undefined}
//             />
//             {field === 'pincode' && pincodeStatus === 'valid' && (
//               <small style={{ color: 'green' }}>✅ Valid Pincode</small>
//             )}
//             {field === 'pincode' && pincodeStatus === 'invalid' && (
//               <small style={{ color: 'red' }}>❌ Invalid Pincode</small>
//             )}
//           </div>
//         ))}

//         <div className="form-group">
//           <label htmlFor="locality">Locality</label>
//           {localities.length > 0 ? (
//             <select
//               id="locality"
//               name="locality"
//               value={formData.locality || ''}
//               onChange={handleLocalityChange}
//             >
//               {localities.map((loc, idx) => (
//                 <option key={idx} value={loc.locality_Name}>
//                   {loc.locality_Name}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <input
//               id="locality"
//               name="locality"
//               placeholder="Locality"
//               value={formData.locality || ''}
//               readOnly
//             />
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


'use client';
import { useState, useRef } from 'react';
import axiosInstance from '@/api/axiosInstance';

export default function AddressDetailsStep({ formData, handleChange, setFormData, errors }) {
  const [localities, setLocalities] = useState([]);
  const [pincodeStatus, setPincodeStatus] = useState('');
  const debounceTimer = useRef(null);

  const handlePincodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // digits only
    if (value.length > 6) value = value.slice(0, 6);

    setFormData((prev) => ({ ...prev, pincode: value }));

    clearTimeout(debounceTimer.current);

    if (value.length === 6) {
      debounceTimer.current = setTimeout(() => fetchPincodeDetails(value), 400);
    } else {
      resetAddressFields();
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    try {
      const res = await axiosInstance.get(`LocalityMaster/by-pincode/${pincode}`);
      const data = res.data;

      if (Array.isArray(data) && data.length > 0) {
        setLocalities(data);
        setFormData((prev) => ({
          ...prev,
          state: data[0].state_Name || '',
          city: data[0].city_Name || '',
          locality: data[0].locality_Name || '',
        }));
        setPincodeStatus('valid');
      } else {
        resetAddressFields('invalid');
      }
    } catch (err) {
      console.error('API error:', err);
      resetAddressFields('invalid');
    }
  };

  const resetAddressFields = (status = '') => {
    setLocalities([]);
    setPincodeStatus(status);
    setFormData((prev) => ({
      ...prev,
      state: '',
      city: '',
      locality: '',
    }));
  };

  const handleLocalityChange = (e) => {
    setFormData((prev) => ({ ...prev, locality: e.target.value }));
  };

  const fields = ['customerAddress', 'landmark', 'pincode', 'state', 'city'];

  const formatLabel = (field) =>
    field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();

  return (
    <>
      <h3>Address Details</h3>
      <div className="form-grid">
        {fields.map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{formatLabel(field)}</label>
            <input
              id={field}
              name={field}
              placeholder={formatLabel(field)}
              value={formData[field] || ''}
              onChange={field === 'pincode' ? handlePincodeChange : handleChange}
              readOnly={['state', 'city'].includes(field)}
              maxLength={field === 'pincode' ? 6 : undefined}
            />
            {errors?.[field] && <p className="error-text">{errors[field]}</p>}
            {field === 'pincode' && pincodeStatus === 'valid' && (
              <small style={{ color: 'green' }}>✅ Valid Pincode</small>
            )}
            {field === 'pincode' && pincodeStatus === 'invalid' && (
              <small style={{ color: 'red' }}>❌ Invalid Pincode</small>
            )}
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="locality">Locality</label>
          {localities.length > 0 ? (
            <select
              id="locality"
              name="locality"
              value={formData.locality || ''}
              onChange={handleLocalityChange}
            >
              {localities.map((loc, idx) => (
                <option key={idx} value={loc.locality_Name}>
                  {loc.locality_Name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="locality"
              name="locality"
              placeholder="Locality"
              value={formData.locality || ''}
              readOnly
            />
          )}
          {errors?.locality && <p className="error-text">{errors.locality}</p>}
        </div>
      </div>
    </>
  );
}
