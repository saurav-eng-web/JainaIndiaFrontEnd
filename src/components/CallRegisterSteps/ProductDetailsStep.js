
// 'use client';

// import { useEffect, useState } from 'react';

// export default function ProductDetailsStep({ formData, handleChange, setFormData }) {
//   const [error, setError] = useState('');
//   const [isSerialValid, setIsSerialValid] = useState(false);
//   const [brands, setBrands] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [models, setModels] = useState([]);
//   const [productCategories, setProductCategories] = useState([]);

//   // Fetch fallback data
//   useEffect(() => {
//     fetch('https://ncapi.jainaindia.com/api/BrandMaster')
//       .then(res => res.json())
//       .then(setBrands)
//       .catch(err => console.error('Brand fetch error', err));

//     fetch('https://ncapi.jainaindia.com/api/productmaster')
//       .then(res => res.json())
//       .then(data => {
//         setProducts(data);
//         const categories = [...new Set(data.map(p => p.prd_Category))];
//         setProductCategories(categories.map(cat => ({
//           id: cat + '-' + Math.random(), label: cat
//         })));
//       })
//       .catch(err => console.error('Product fetch error', err));

//     fetch('https://ncapi.jainaindia.com/api/model')
//       .then(res => res.json())
//       .then(setModels)
//       .catch(err => console.error('Model fetch error', err));
//   }, []);

//   const checkSerialNumber = async (serial) => {
//     try {
//       const response = await fetch(`https://ncapi.jainaindia.com/api/SerialNoMaster`);
//       const data = await response.json();

//       const matched = data.find(item =>
//         item.itemSerialNo1 === serial || item.itemSerialNo2 === serial
//       );

//       if (matched) {
//         // Inject into dropdowns if not found
//         if (!brands.find(b => b.brand_Name === matched.brand)) {
//           setBrands(prev => [...prev, { brand_ID: Date.now(), brand_Name: matched.brand }]);
//         }
//         if (!products.find(p => p.product === matched.product)) {
//           setProducts(prev => [...prev, { productID: Date.now(), product: matched.product }]);
//         }
//         if (!models.find(m => m.modelNo === matched.model)) {
//           setModels(prev => [...prev, { modelID: Date.now(), modelNo: matched.model }]);
//         }
//         if (!productCategories.find(p => p.label === matched.productCategory)) {
//           setProductCategories(prev => [...prev, {
//             id: matched.productCategory + '-' + Date.now(),
//             label: matched.productCategory
//           }]);
//         }

//         setFormData(prev => ({
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
//         setFormData(prev => ({
//           ...prev,
//           serialNo: serial,
//           brand: '',
//           model: '',
//           product: '',
//           productCategory: '',
//           warranty: ''
//         }));
//       }
//     } catch (err) {
//       console.error('Error validating serial number:', err);
//       setError('API error while checking serial number');
//     }
//   };

//   const getFieldOptions = (id) => {
//     if (id === 'brand') return brands.map(b => ({ id: b.brand_ID, label: b.brand_Name }));
//     if (id === 'product') return products.map(p => ({ id: p.productID, label: p.product }));
//     if (id === 'model') return models.map(m => ({ id: m.modelID, label: m.modelNo }));
//     if (id === 'productCategory') return productCategories;
//     return [];
//   };
//   const fields = [
//     { id: 'serialNo', type: 'text' },
//     { id: 'productCategory', type: 'select', disabled: isSerialValid },
//     { id: 'brand', type: 'select', disabled: isSerialValid },
//     { id: 'model', type: 'select', disabled: isSerialValid }, // 👈 moved model here
//     { id: 'product', type: 'select', disabled: isSerialValid },
//     { id: 'pop', type: 'date' }, // 👈 moved pop here
//     { id: 'warranty', type: 'text', disabled: true }
//   ];

//   return (
//     <>
//       <h3>Product Details</h3>
//       <div className="form-grid">
//         {fields.map(({ id, type = 'text', disabled }) => {
//           const label = id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

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
//                   {getFieldOptions(id).map(opt => (
//                     <option key={opt.id} value={opt.label}>{opt.label}</option>
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
//                   onBlur={id === 'serialNo' ? (e) => checkSerialNumber(e.target.value) : undefined}
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
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance'; // adjust path if needed

export default function ProductDetailsStep({ formData, handleChange, setFormData }) {
  const [error, setError] = useState('');
  const [isSerialValid, setIsSerialValid] = useState(false);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [models, setModels] = useState([]);
  const [productCategories, setProductCategories] = useState([]);

  // Fetch fallback data
  useEffect(() => {
    axiosInstance
      .get('BrandMaster')
      .then((res) => setBrands(res.data))
      .catch((err) => console.error('Brand fetch error', err));

    axiosInstance
      .get('productmaster')
      .then((res) => {
        const data = res.data;
        setProducts(data);
        const categories = [...new Set(data.map((p) => p.prd_Category))];
        setProductCategories(
          categories.map((cat) => ({
            id: cat + '-' + Math.random(),
            label: cat,
          }))
        );
      })
      .catch((err) => console.error('Product fetch error', err));

    axiosInstance
      .get('model')
      .then((res) => setModels(res.data))
      .catch((err) => console.error('Model fetch error', err));
  }, []);

  const checkSerialNumber = async (serial) => {
    try {
      const res = await axiosInstance.get('SerialNoMaster');
      const data = res.data;

      const matched = data.find(
        (item) => item.itemSerialNo1 === serial || item.itemSerialNo2 === serial
      );

      if (matched) {
        // Inject into dropdowns if not found
        if (!brands.find((b) => b.brand_Name === matched.brand)) {
          setBrands((prev) => [
            ...prev,
            { brand_ID: Date.now(), brand_Name: matched.brand },
          ]);
        }
        if (!products.find((p) => p.product === matched.product)) {
          setProducts((prev) => [
            ...prev,
            { productID: Date.now(), product: matched.product },
          ]);
        }
        if (!models.find((m) => m.modelNo === matched.model)) {
          setModels((prev) => [
            ...prev,
            { modelID: Date.now(), modelNo: matched.model },
          ]);
        }
        if (!productCategories.find((p) => p.label === matched.productCategory)) {
          setProductCategories((prev) => [
            ...prev,
            {
              id: matched.productCategory + '-' + Date.now(),
              label: matched.productCategory,
            },
          ]);
        }

        setFormData((prev) => ({
          ...prev,
          serialNo: serial,
          brand: matched.brand,
          product: matched.product,
          model: matched.model,
          productCategory: matched.productCategory,
          warranty: matched.purchstatus,
        }));
        setIsSerialValid(true);
        setError('');
      } else {
        setError('Invalid serial number');
        setIsSerialValid(false);
        setFormData((prev) => ({
          ...prev,
          serialNo: serial,
          brand: '',
          model: '',
          product: '',
          productCategory: '',
          warranty: '',
        }));
      }
    } catch (err) {
      console.error('Error validating serial number:', err);
      setError('API error while checking serial number');
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
    { id: 'productCategory', type: 'select', disabled: isSerialValid },
    { id: 'brand', type: 'select', disabled: isSerialValid },
    { id: 'model', type: 'select', disabled: isSerialValid },
    { id: 'product', type: 'select', disabled: isSerialValid },
    { id: 'pop', type: 'date' },
    { id: 'warranty', type: 'text', disabled: true },
  ];

  return (
    <>
      <h3>Product Details</h3>
      <div className="form-grid">
        {fields.map(({ id, type = 'text', disabled }) => {
          const label = id
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());

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
                  {getFieldOptions(id).map((opt) => (
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
                />
              )}
            </div>
          );
        })}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </>
  );
}
