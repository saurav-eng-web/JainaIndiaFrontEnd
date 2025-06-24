// // // 'use client';
// // // import { useEffect, useState } from 'react';

// // // export default function AddressDetailsStep({ formData, handleChange, setFormData }) {
// // //   const [allLocalities, setAllLocalities] = useState([]);
// // //   const [pincodeStatus, setPincodeStatus] = useState(''); // ✅ For valid/invalid message

// // //   // Fetch all locality data on mount
// // //   useEffect(() => {
// // //     fetch('https://ncapi.jainaindia.com/api/LocalityMaster/all')
// // //       .then(res => res.json())
// // //       .then(data => setAllLocalities(data))
// // //       .catch(err => console.error('Error fetching localities:', err));
// // //   }, []);

// // //   const handlePincodeChange = (e) => {
// // //     const value = e.target.value;
// // //     handleChange(e);

// // //     if (value.length === 6) {
// // //       const matched = allLocalities.find(loc => String(loc.pincode) === value);

// // //       if (matched) {
// // //         setFormData(prev => ({
// // //           ...prev,
// // //           state: matched.locality_State,
// // //           city: matched.locality_City,
// // //           locality: matched.locality_Name,
// // //         }));
// // //         setPincodeStatus('valid');
// // //       } else {
// // //         setFormData(prev => ({
// // //           ...prev,
// // //           state: '',
// // //           city: '',
// // //           locality: '',
// // //         }));
// // //         setPincodeStatus('invalid');
// // //       }
// // //     } else {
// // //       setPincodeStatus('');
// // //     }
// // //   };

// // //   const fields = ['customerAddress', 'landmark', 'pincode', 'state', 'city', 'locality'];

// // //   // Convert camelCase or PascalCase to "Capitalized Words"
// // //   const formatLabel = (field) =>
// // //     field
// // //       .replace(/([A-Z])/g, ' $1')
// // //       .replace(/^./, str => str.toUpperCase())
// // //       .trim();

// // //   return (
// // //     <>
// // //       <h3>Address Details</h3>
// // //       <div className="form-grid">
// // //         {fields.map(field => (
// // //           <div className="form-group" key={field}>
// // //             <label htmlFor={field}>{formatLabel(field)}</label>
// // //             <input
// // //               id={field}
// // //               name={field}
// // //               placeholder={formatLabel(field)}
// // //               value={formData[field] || ''}
// // //               onChange={field === 'pincode' ? handlePincodeChange : handleChange}
// // //               readOnly={['state', 'city', 'locality'].includes(field)}
// // //             />
// // //             {field === 'pincode' && pincodeStatus === 'valid' && (
// // //               <small style={{ color: 'green' }}>✅ Valid Pincode</small>
// // //             )}
// // //             {field === 'pincode' && pincodeStatus === 'invalid' && (
// // //               <small style={{ color: 'red' }}>❌ Invalid Pincode</small>
// // //             )}
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </>
// // //   );
// // // }


// // 'use client';
// // import { useState } from 'react';

// // export default function AddressDetailsStep({ formData, handleChange, setFormData }) {
// //   const [pincodeStatus, setPincodeStatus] = useState(''); // valid, invalid, or ''

// //   const handlePincodeChange = async (e) => {
// //     const value = e.target.value;
// //     handleChange(e);

// //     if (value.length === 6) {
// //       try {
// //         const res = await fetch(`https://ncapi.jainaindia.com/api/LocalityMaster/by-pincode/${value}`);
// //         const data = await res.json();

// //         if (data && data.length > 0) {
// //           const matched = data[0]; // use the first match
// //           setFormData(prev => ({
// //             ...prev,
// //             state: matched.locality_State,
// //             city: matched.locality_City,
// //             locality: matched.locality_Name,
// //           }));
// //           setPincodeStatus('valid');
// //         } else {
// //           setFormData(prev => ({
// //             ...prev,
// //             state: '',
// //             city: '',
// //             locality: '',
// //           }));
// //           setPincodeStatus('invalid');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching locality by pincode:', error);
// //         setPincodeStatus('invalid');
// //       }
// //     } else {
// //       setPincodeStatus('');
// //     }
// //   };

// //   const fields = ['customerAddress', 'landmark', 'pincode', 'state', 'city', 'locality'];

// //   const formatLabel = (field) =>
// //     field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();

// //   return (
// //     <>
// //       <h3>Address Details</h3>
// //       <div className="form-grid">
// //         {fields.map(field => (
// //           <div className="form-group" key={field}>
// //             <label htmlFor={field}>{formatLabel(field)}</label>
// //             <input
// //               id={field}
// //               name={field}
// //               placeholder={formatLabel(field)}
// //               value={formData[field] || ''}
// //               onChange={field === 'pincode' ? handlePincodeChange : handleChange}
// //               readOnly={['state', 'city', 'locality'].includes(field)}
// //             />
// //             {field === 'pincode' && pincodeStatus === 'valid' && (
// //               <small style={{ color: 'green' }}>✅ Valid Pincode</small>
// //             )}
// //             {field === 'pincode' && pincodeStatus === 'invalid' && (
// //               <small style={{ color: 'red' }}>❌ Invalid Pincode</small>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </>
// //   );
// // }


// 'use client';
// import { useState } from 'react';

// export default function AddressDetailsStep({ formData, handleChange, setFormData }) {
//   const [localities, setLocalities] = useState([]);
//   const [pincodeStatus, setPincodeStatus] = useState(''); // valid / invalid / ''

//   const handlePincodeChange = async (e) => {
//     const value = e.target.value;
//     handleChange(e);

//     if (value.length === 6) {
//       try {
//         const res = await fetch(`https://ncapi.jainaindia.com/api/LocalityMaster/by-pincode/${value}`);
//         const data = await res.json();

//         if (Array.isArray(data) && data.length > 0) {
//           setLocalities(data);
//           setFormData(prev => ({
//             ...prev,
//             state: data[0].locality_State,
//             city: data[0].locality_City,
//             locality: data[0].locality_Name, // default to first
//           }));
//           setPincodeStatus('valid');
//         } else {
//           setLocalities([]);
//           setFormData(prev => ({
//             ...prev,
//             state: '',
//             city: '',
//             locality: '',
//           }));
//           setPincodeStatus('invalid');
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setPincodeStatus('invalid');
//       }
//     } else {
//       setPincodeStatus('');
//       setLocalities([]);
//     }
//   };

//   const handleLocalityChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       locality: e.target.value,
//     }));
//   };

//   const fields = ['customerAddress', 'landmark', 'pincode', 'state', 'city'];

//   const formatLabel = (field) =>
//     field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();

//   return (
//     <>
//       <h3>Address Details</h3>
//       <div className="form-grid">
//         {fields.map(field => (
//           <div className="form-group" key={field}>
//             <label htmlFor={field}>{formatLabel(field)}</label>
//             <input
//               id={field}
//               name={field}
//               placeholder={formatLabel(field)}
//               value={formData[field] || ''}
//               onChange={field === 'pincode' ? handlePincodeChange : handleChange}
//               readOnly={['state', 'city'].includes(field)}
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
import { useState } from 'react';

export default function AddressDetailsStep({ formData, handleChange, setFormData }) {
  const [localities, setLocalities] = useState([]);
  const [pincodeStatus, setPincodeStatus] = useState('');

  const handlePincodeChange = async (e) => {
    let value = e.target.value.replace(/\D/g, ''); // allow only digits

    // Limit to 6 digits
    if (value.length > 6) value = value.slice(0, 6);

    // Update pincode in form data
    setFormData(prev => ({ ...prev, pincode: value }));

    if (value.length === 6) {
      try {
        const res = await fetch(`https://ncapi.jainaindia.com/api/LocalityMaster/by-pincode/${value}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setLocalities(data);
          setFormData(prev => ({
            ...prev,
            state: data[0].state_Name || '',
            city: data[0].city_Name || '',
            locality: data[0].locality_Name || '',
          }));
          setPincodeStatus('valid');
        } else {
          setLocalities([]);
          setFormData(prev => ({
            ...prev,
            state: '',
            city: '',
            locality: '',
          }));
          setPincodeStatus('invalid');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setPincodeStatus('invalid');
      }
    } else {
      setPincodeStatus('');
      setLocalities([]);
      setFormData(prev => ({
        ...prev,
        state: '',
        city: '',
        locality: '',
      }));
    }
  };

  const handleLocalityChange = (e) => {
    setFormData(prev => ({
      ...prev,
      locality: e.target.value,
    }));
  };

  const fields = ['customerAddress', 'landmark', 'pincode', 'state', 'city'];

  const formatLabel = (field) =>
    field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();

  return (
    <>
      <h3>Address Details</h3>
      <div className="form-grid">
        {fields.map(field => (
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
        </div>
      </div>
    </>
  );
}

