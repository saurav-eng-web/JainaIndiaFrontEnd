

// 'use client';

// import { useEffect, useState } from 'react';
// import axiosInstance from '@/api/axiosInstance'; // adjust path if needed

// export default function ProductDetailsStep({ formData, handleChange, setFormData }) {
//   const [error, setError] = useState('');
//   const [isSerialValid, setIsSerialValid] = useState(false);
//   const [brands, setBrands] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [models, setModels] = useState([]);
//   const [productCategories, setProductCategories] = useState([]);

//   // Fetch fallback data
//   useEffect(() => {
//     axiosInstance
//       .get('BrandMaster')
//       .then((res) => setBrands(res.data))
//       .catch((err) => console.error('Brand fetch error', err));

//     axiosInstance
//       .get('productmaster')
//       .then((res) => {
//         const data = res.data;
//         setProducts(data);
//         const categories = [...new Set(data.map((p) => p.prd_Category))];
//         setProductCategories(
//           categories.map((cat) => ({
//             id: cat + '-' + Math.random(),
//             label: cat,
//           }))
//         );
//       })
//       .catch((err) => console.error('Product fetch error', err));

//     axiosInstance
//       .get('model')
//       .then((res) => setModels(res.data))
//       .catch((err) => console.error('Model fetch error', err));
//   }, []);

//   const checkSerialNumber = async (serial) => {
//     try {
//       const res = await axiosInstance.get('SerialNoMaster');
//       const data = res.data;

//       const matched = data.find(
//         (item) => item.itemSerialNo1 === serial || item.itemSerialNo2 === serial
//       );

//       if (matched) {
//         // Inject into dropdowns if not found
//         if (!brands.find((b) => b.brand_Name === matched.brand)) {
//           setBrands((prev) => [
//             ...prev,
//             { brand_ID: Date.now(), brand_Name: matched.brand },
//           ]);
//         }
//         if (!products.find((p) => p.product === matched.product)) {
//           setProducts((prev) => [
//             ...prev,
//             { productID: Date.now(), product: matched.product },
//           ]);
//         }
//         if (!models.find((m) => m.modelNo === matched.model)) {
//           setModels((prev) => [
//             ...prev,
//             { modelID: Date.now(), modelNo: matched.model },
//           ]);
//         }
//         if (!productCategories.find((p) => p.label === matched.productCategory)) {
//           setProductCategories((prev) => [
//             ...prev,
//             {
//               id: matched.productCategory + '-' + Date.now(),
//               label: matched.productCategory,
//             },
//           ]);
//         }

//         setFormData((prev) => ({
//           ...prev,
//           serialNo: serial,
//           brand: matched.brand,
//           product: matched.product,
//           model: matched.model,
//           productCategory: matched.productCategory,
//           warranty: matched.purchstatus,
//         }));
//         setIsSerialValid(true);
//         setError('');
//       } else {
//         setError('Invalid serial number');
//         setIsSerialValid(false);
//         setFormData((prev) => ({
//           ...prev,
//           serialNo: serial,
//           brand: '',
//           model: '',
//           product: '',
//           productCategory: '',
//           warranty: '',
//         }));
//       }
//     } catch (err) {
//       console.error('Error validating serial number:', err);
//       setError('API error while checking serial number');
//     }
//   };

//   const getFieldOptions = (id) => {
//     if (id === 'brand')
//       return brands.map((b) => ({ id: b.brand_ID, label: b.brand_Name }));
//     if (id === 'product')
//       return products.map((p) => ({ id: p.productID, label: p.product }));
//     if (id === 'model')
//       return models.map((m) => ({ id: m.modelID, label: m.modelNo }));
//     if (id === 'productCategory') return productCategories;
//     return [];
//   };

//   const fields = [
//     { id: 'serialNo', type: 'text' },
//     { id: 'productCategory', type: 'select', disabled: isSerialValid },
//     { id: 'brand', type: 'select', disabled: isSerialValid },
//     { id: 'model', type: 'select', disabled: isSerialValid },
//     { id: 'product', type: 'select', disabled: isSerialValid },
//     { id: 'pop', type: 'date' },
//     { id: 'warranty', type: 'text', disabled: true },
//   ];



//   return (
//     <>
//       <h3>Product Details</h3>
//       <div className="form-grid">
//         {fields.map(({ id, type = 'text', disabled }) => {
//           const label = id
//             .replace(/([A-Z])/g, ' $1')
//             .replace(/^./, (str) => str.toUpperCase());

//           return (
//             <div className="form-group" key={id}>
//               <label htmlFor={id}>{label}</label>
//               {type === 'select' ? (
//                 <select
//                   id={id}
//                   name={id}
//                   disabled={disabled}
//                   onChange={handleChange}
//                   value={formData[id] || ''}
//                 >
//                   <option value="">Select {label}</option>
//                   {getFieldOptions(id).map((opt) => (
//                     <option key={opt.id} value={opt.label}>
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   id={id}
//                   name={id}
//                   type={type}
//                   disabled={disabled}
//                   placeholder={label}
//                   onChange={handleChange}
//                   onBlur={
//                     id === 'serialNo'
//                       ? (e) => checkSerialNumber(e.target.value)
//                       : undefined
//                   }
//                   value={formData[id] || ''}
//                 />
//               )}
//             </div>
//           );
//         })}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//       </div>
//     </>
//   );
// }

























// 'use client';

// import { useEffect, useState } from 'react';
// import axiosInstance from '@/api/axiosInstance'; // adjust path if needed

// export default function ProductDetailsStep({ formData, handleChange, setFormData, errors = {} }) {
//   const [error, setError] = useState('');
//   const [isSerialValid, setIsSerialValid] = useState(false);
//   const [brands, setBrands] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [models, setModels] = useState([]);
//   const [productCategories, setProductCategories] = useState([]);

//   // Fetch fallback data
//   useEffect(() => {
//     axiosInstance
//       .get('BrandMaster')
//       .then((res) => setBrands(res.data))
//       .catch((err) => console.error('Brand fetch error', err));

//     axiosInstance
//       .get('productmaster')
//       .then((res) => {
//         const data = res.data;
//         setProducts(data);
//         const categories = [...new Set(data.map((p) => p.prd_Category))];
//         setProductCategories(
//           categories.map((cat) => ({
//             id: cat + '-' + Math.random(),
//             label: cat,
//           }))
//         );
//       })
//       .catch((err) => console.error('Product fetch error', err));

//     axiosInstance
//       .get('model')
//       .then((res) => setModels(res.data))
//       .catch((err) => console.error('Model fetch error', err));
//   }, []);

//   const checkSerialNumber = async (serial) => {
//     try {
//       const res = await axiosInstance.get('SerialNoMaster');
//       const data = res.data;

//       const matched = data.find(
//         (item) => item.itemSerialNo1 === serial || item.itemSerialNo2 === serial
//       );

//       if (matched) {
//         // Inject into dropdowns if not found
//         if (!brands.find((b) => b.brand_Name === matched.brand)) {
//           setBrands((prev) => [
//             ...prev,
//             { brand_ID: Date.now(), brand_Name: matched.brand },
//           ]);
//         }
//         if (!products.find((p) => p.product === matched.product)) {
//           setProducts((prev) => [
//             ...prev,
//             { productID: Date.now(), product: matched.product },
//           ]);
//         }
//         if (!models.find((m) => m.modelNo === matched.model)) {
//           setModels((prev) => [
//             ...prev,
//             { modelID: Date.now(), modelNo: matched.model },
//           ]);
//         }
//         if (!productCategories.find((p) => p.label === matched.productCategory)) {
//           setProductCategories((prev) => [
//             ...prev,
//             {
//               id: matched.productCategory + '-' + Date.now(),
//               label: matched.productCategory,
//             },
//           ]);
//         }

//         setFormData((prev) => ({
//           ...prev,
//           serialNo: serial,
//           brand: matched.brand,
//           product: matched.product,
//           model: matched.model,
//           productCategory: matched.productCategory,
//           warranty: matched.purchstatus,
//         }));
//         setIsSerialValid(true);
//         setError('');
//       } else {
//         setError('Invalid serial number');
//         setIsSerialValid(false);
//         setFormData((prev) => ({
//           ...prev,
//           serialNo: serial,
//           brand: '',
//           model: '',
//           product: '',
//           productCategory: '',
//           warranty: '',
//         }));
//       }
//     } catch (err) {
//       console.error('Error validating serial number:', err);
//       setError('API error while checking serial number');
//     }
//   };

//   const getFieldOptions = (id) => {
//     if (id === 'brand')
//       return brands.map((b) => ({ id: b.brand_ID, label: b.brand_Name }));
//     if (id === 'product')
//       return products.map((p) => ({ id: p.productID, label: p.product }));
//     if (id === 'model')
//       return models.map((m) => ({ id: m.modelID, label: m.modelNo }));
//     if (id === 'productCategory') return productCategories;
//     return [];
//   };

//   const fields = [
//     { id: 'serialNo', type: 'text' },
//     { id: 'brand', type: 'select', disabled: isSerialValid },
//     { id: 'product', type: 'select', disabled: isSerialValid },
//     { id: 'productCategory', type: 'select', disabled: isSerialValid },
//     { id: 'model', type: 'select', disabled: isSerialValid },
//     { id: 'modelDescription', type: 'text', disabled: isSerialValid },
//     { id: 'pop', type: 'date' },
//     {
//       id: 'warranty',
//       type: 'select',
//       disabled: false,
//       options: [
//         'In Warranty',
//         'Out Warranty',
//         'Special Warranty',
//         'Under Warranty Void',
//         'Extended Warranty',
//         'Repair Warranty'
//       ]
//     },
//   ];
//   return (
//     <>
//       <h3>Product Details</h3>
//       <div className="form-grid">
//         {fields.map(({ id, type = 'text', disabled, options }) => {
//           const label =
//             id === 'pop'
//               ? 'DOP'
//               : id.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

//           return (
//             <div className="form-group" key={id}>
//               <label htmlFor={id}>{label}</label>

//               {type === 'select' ? (
//                 <select
//                   id={id}
//                   name={id}
//                   disabled={disabled}
//                   onChange={handleChange}
//                   value={formData[id] || ''}
//                 >
//                   <option value="">Select {label}</option>
//                   {options
//                     ? options.map((opt) => (
//                         <option key={opt} value={opt}>
//                           {opt}
//                         </option>
//                       ))
//                     : getFieldOptions(id).map((opt) => (
//                         <option key={opt.id} value={opt.label}>
//                           {opt.label}
//                         </option>
//                       ))}
//                 </select>
//               ) : (
//                 <input
//                   id={id}
//                   name={id}
//                   type={type}
//                   disabled={disabled}
//                   placeholder={label}
//                   onChange={handleChange}
//                   onBlur={
//                     id === 'serialNo'
//                       ? (e) => checkSerialNumber(e.target.value)
//                       : undefined
//                   }
//                   value={formData[id] || ''}
//                   max={
//                     type === 'date'
//                       ? new Date().toISOString().split('T')[0]
//                       : undefined
//                   }
//                 />
//               )}

//               {/* ✅ show validation error under field */}
//               {errors[id] && (
//                 <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>
//                   {errors[id]}
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         {/* serial number API validation error */}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//       </div>
//     </>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import axiosInstance from '@/api/axiosInstance'; // adjust path if needed

// export default function ProductDetailsStep({ formData, handleChange, setFormData, errors = {} }) {
//   const [error, setError] = useState('');
//   const [validationStatus, setValidationStatus] = useState(null); // 'success' | 'error' | null
//   const [isSerialValid, setIsSerialValid] = useState(false);
//   const [brands, setBrands] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [models, setModels] = useState([]);
//   const [productCategories, setProductCategories] = useState([]);

//   // Fetch fallback data
//   useEffect(() => {
//     axiosInstance
//       .get('BrandMaster')
//       .then((res) => setBrands(res.data))
//       .catch((err) => console.error('Brand fetch error', err));

//     axiosInstance
//       .get('productmaster')
//       .then((res) => {
//         const data = res.data;
//         setProducts(data);
//         const categories = [...new Set(data.map((p) => p.prd_Category))];
//         setProductCategories(
//           categories.map((cat) => ({
//             id: cat + '-' + Math.random(),
//             label: cat,
//           }))
//         );
//       })
//       .catch((err) => console.error('Product fetch error', err));

//     axiosInstance
//       .get('model')
//       .then((res) => setModels(res.data))
//       .catch((err) => console.error('Model fetch error', err));
//   }, []);

//   const checkSerialNumber = async (serial) => {
//     try {
//       const res = await axiosInstance.get('SerialNoMaster');
//       const data = res.data;

//       const matched = data.find(
//         (item) => item.itemSerialNo1 === serial || item.itemSerialNo2 === serial
//       );

//       if (matched) {
//         // Inject into dropdowns if not found
//         if (!brands.find((b) => b.brand_Name === matched.brand)) {
//           setBrands((prev) => [
//             ...prev,
//             { brand_ID: Date.now(), brand_Name: matched.brand },
//           ]);
//         }
//         if (!products.find((p) => p.product === matched.product)) {
//           setProducts((prev) => [
//             ...prev,
//             { productID: Date.now(), product: matched.product },
//           ]);
//         }
//         if (!models.find((m) => m.modelNo === matched.model)) {
//           setModels((prev) => [
//             ...prev,
//             { modelID: Date.now(), modelNo: matched.model },
//           ]);
//         }
//         if (!productCategories.find((p) => p.label === matched.productCategory)) {
//           setProductCategories((prev) => [
//             ...prev,
//             {
//               id: matched.productCategory + '-' + Date.now(),
//               label: matched.productCategory,
//             },
//           ]);
//         }

//         setFormData((prev) => ({
//           ...prev,
//           serialNo: serial,
//           brand: matched.brand,
//           product: matched.product,
//           model: matched.model,
//           productCategory: matched.productCategory,
//           warranty: matched.purchstatus,
//         }));

//         setIsSerialValid(true);
//         setError('Serial number is valid ✅');
//         setValidationStatus('success');
//       } else {
//         setError('Invalid serial number ❌');
//         setValidationStatus('error');
//         setIsSerialValid(false);
//         setFormData((prev) => ({
//           ...prev,
//           serialNo: serial,
//           brand: '',
//           model: '',
//           product: '',
//           productCategory: '',
//           warranty: '',
//         }));
//       }
//     } catch (err) {
//       console.error('Error validating serial number:', err);
//       setError('API error while checking serial number');
//       setValidationStatus('error');
//     }
//   };

//   const getFieldOptions = (id) => {
//     if (id === 'brand')
//       return brands.map((b) => ({ id: b.brand_ID, label: b.brand_Name }));
//     if (id === 'product')
//       return products.map((p) => ({ id: p.productID, label: p.product }));
//     if (id === 'model')
//       return models.map((m) => ({ id: m.modelID, label: m.modelNo }));
//     if (id === 'productCategory') return productCategories;
//     return [];
//   };

//   const fields = [
//     { id: 'serialNo', type: 'text' },
//     { id: 'brand', type: 'select', disabled: isSerialValid },
//     { id: 'product', type: 'select', disabled: isSerialValid },
//     { id: 'productCategory', type: 'select', disabled: isSerialValid },
//     { id: 'model', type: 'select', disabled: isSerialValid },
//     { id: 'modelDescription', type: 'text', disabled: isSerialValid },
//     { id: 'pop', type: 'date' },
//     {
//       id: 'warranty',
//       type: 'select',
//       disabled: false,
//       options: [
//         'In Warranty',
//         'Out Warranty',
//         'Special Warranty',
//         'Under Warranty Void',
//         'Extended Warranty',
//         'Repair Warranty'
//       ]
//     },
//   ];

//   return (
//     <>
//       <h3>Product Details</h3>
//       <div className="form-grid">
//         {fields.map(({ id, type = 'text', disabled, options }) => {
//           const label =
//             id === 'pop'
//               ? 'DOP'
//               : id.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

//           return (
//             <div className="form-group" key={id}>
//               <label htmlFor={id}>{label}</label>

//               {type === 'select' ? (
//                 <select
//                   id={id}
//                   name={id}
//                   disabled={disabled}
//                   onChange={handleChange}
//                   value={formData[id] || ''}
//                 >
//                   <option value="">Select {label}</option>
//                   {options
//                     ? options.map((opt) => (
//                         <option key={opt} value={opt}>
//                           {opt}
//                         </option>
//                       ))
//                     : getFieldOptions(id).map((opt) => (
//                         <option key={opt.id} value={opt.label}>
//                           {opt.label}
//                         </option>
//                       ))}
//                 </select>
//               ) : (
//                 <input
//                   id={id}
//                   name={id}
//                   type={type}
//                   disabled={disabled}
//                   placeholder={label}
//                   onChange={handleChange}
//                   onBlur={
//                     id === 'serialNo'
//                       ? (e) => checkSerialNumber(e.target.value)
//                       : undefined
//                   }
//                   value={formData[id] || ''}
//                   max={
//                     type === 'date'
//                       ? new Date().toISOString().split('T')[0]
//                       : undefined
//                   }
//                 />
//               )}

//               {/* Field-level validation error */}
//               {errors[id] && (
//                 <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>
//                   {errors[id]}
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         {/* Serial number API validation result */}
//         {error && (
//           <p
//             style={{
//               color: validationStatus === 'success' ? 'green' : 'red',
//               fontSize: '0.9rem',
//               marginTop: '5px'
//             }}
//           >
//             {error}
//           </p>
//         )}
//       </div>
//     </>
//   );
// }




'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';

export default function ProductDetailsStep({ formData, handleChange, setFormData, errors = {} }) {
  const [isSerialValid, setIsSerialValid] = useState(false);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [models, setModels] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [popup, setPopup] = useState({ visible: false, message: '', type: '' });

  // Fetch fallback data
  useEffect(() => {
    axiosInstance.get('BrandMaster')
      .then((res) => setBrands(res.data))
      .catch((err) => console.error('Brand fetch error', err));

    axiosInstance.get('productmaster')
      .then((res) => {
        setProducts(res.data);
        const categories = [...new Set(res.data.map((p) => p.prd_Category))];
        setProductCategories(categories.map((cat) => ({
          id: cat + '-' + Math.random(),
          label: cat,
        })));
      })
      .catch((err) => console.error('Product fetch error', err));

    axiosInstance.get('model')
      .then((res) => setModels(res.data))
      .catch((err) => console.error('Model fetch error', err));
  }, []);

  const showPopup = (message, type) => {
    setPopup({ visible: true, message, type });
  };
  const checkSerialNumber = async (serial) => {
    try {
      if (!serial) return;
  
      const res = await axiosInstance.get(`SerialNoMaster/by-serial/${serial}`);
  
      const matched = res.data; // assuming object
  
      // Fill dropdowns dynamically
      if (matched.brand && !brands.find((b) => b.brand_Name === matched.brand)) {
        setBrands((prev) => [...prev, { brand_ID: Date.now(), brand_Name: matched.brand }]);
      }
      if (matched.product && !products.find((p) => p.product === matched.product)) {
        setProducts((prev) => [...prev, { productID: Date.now(), product: matched.product }]);
      }
      if (matched.model && !models.find((m) => m.modelNo === matched.model)) {
        setModels((prev) => [...prev, { modelID: Date.now(), modelNo: matched.model }]);
      }
      if (matched.productCategory && !productCategories.find((p) => p.label === matched.productCategory)) {
        setProductCategories((prev) => [
          ...prev,
          { id: matched.productCategory + '-' + Date.now(), label: matched.productCategory },
        ]);
      }
  
      setFormData((prev) => ({
        ...prev,
        serialNo: serial,
        brand: matched.brand || '',
        product: matched.product || '',
        model: matched.model || '',
        productCategory: matched.productCategory || '',
        warranty: matched.purchstatus || '',
      }));
  
      setIsSerialValid(true);
      showPopup('✅ Serial number is valid', 'success');
  
    } catch (err) {
      if (err.response?.status === 404) {
        // Serial number not found — treat as invalid
        setFormData((prev) => ({
          ...prev,
          serialNo: serial,
          brand: '',
          model: '',
          product: '',
          productCategory: '',
          warranty: '',
        }));
        setIsSerialValid(false);
        showPopup('❌ Invalid serial number', 'error');
      } else {
        console.error('Error validating serial number:', err);
        showPopup('⚠️ API error while checking serial number', 'error');
      }
    }
  };
  
  

  const getFieldOptions = (id) => {
    if (id === 'brand')
      return brands.map((b) => ({ id: b.brand_ID, label: b.brand_Name }));
    if (id === 'product')
      return products.map((p) => ({ id: p.productID, label: p.product }));
    if (id === 'model')
      return models.map((m) => ({ id: m.modelID, label: m.modelNo }));
    if (id === 'productCategory') return productCategories;
    return [];
  };

  const fields = [
    { id: 'serialNo', type: 'text' },
    { id: 'brand', type: 'select', disabled: isSerialValid },

    { id: 'productCategory', type: 'select', disabled: isSerialValid },
    { id: 'product', type: 'select', disabled: isSerialValid },
   
    { id: 'model', type: 'select', disabled: isSerialValid },
    { id: 'modelDescription', type: 'text', disabled: isSerialValid },
    { id: 'pop', type: 'date' },
    {
      id: 'warranty',
      type: 'select',
      disabled: false,
      options: [
        'In Warranty',
        'Out Warranty',
        'Special Warranty',
        'Under Warranty Void',
        'Extended Warranty',
        'Repair Warranty'
      ]
    },
  ];

  return (
    <>
      <h3>Product Details</h3>
      <div className="form-grid">
        {fields.map(({ id, type = 'text', disabled, options }) => {
          const label =
            id === 'pop'
              ? 'DOP'
              : id.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

          return (
            <div className="form-group" key={id}>
              <label htmlFor={id}>{label}</label>

              {type === 'select' ? (
                <select
                  id={id}
                  name={id}
                  disabled={disabled}
                  onChange={handleChange}
                  value={formData[id] || ''}
                >
                  <option value="">Select {label}</option>
                  {options
                    ? options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))
                    : getFieldOptions(id).map((opt) => (
                        <option key={opt.id} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                </select>
              ) : (
                <input
                  id={id}
                  name={id}
                  type={type}
                  disabled={disabled}
                  placeholder={label}
                  onChange={handleChange}
                  onBlur={
                    id === 'serialNo'
                      ? (e) => checkSerialNumber(e.target.value)
                      : undefined
                  }
                  value={formData[id] || ''}
                  max={
                    type === 'date'
                      ? new Date().toISOString().split('T')[0]
                      : undefined
                  }
                />
              )}

              {/* Field-level validation error */}
              {errors[id] && (
                <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>
                  {errors[id]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Popup */}
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
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex; justify-content: center; align-items: center;
          z-index: 9999;
        }
        .popup-box {
          background: #fff;
          padding: 80px 100px;
          border-radius: 8px;
          min-width: 250px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .popup-box.success {
          border: 2px solid green;
        }
        .popup-box.error {
          border: 2px solid red;
        }
        .popup-box button {
          margin-top: 10px;
          padding: 6px 12px;
          background: #714b67;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </>
  ); 
}
