
'use client';
import { useState, useRef } from 'react';
import axiosInstance from '@/api/axiosInstance';

export default function AddressDetailsStep({
  formData,
  handleChange,
  setFormData,
  errors,
  // NEW: lifted to parent so stepper can block Next
  pincodeStatus,
  setPincodeStatus
}) {
  const [localities, setLocalities] = useState([]);
  const debounceTimer = useRef(null);

  const handlePincodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // digits only
    if (value.length > 6) value = value.slice(0, 6);

    setFormData((prev) => ({ ...prev, pincode: value }));

    clearTimeout(debounceTimer.current);

    if (value.length === 6) {
      // mark as checking to block Next during debounce/API
      setPincodeStatus('checking');
      debounceTimer.current = setTimeout(() => fetchPincodeDetails(value), 400);
    } else {
      resetAddressFields('');
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    try {
      const res = await axiosInstance.get(`LocalityMaster/by-pincode/${pincode}`);
      const data = res.data;

      if (Array.isArray(data) && data.length > 0) {
        setLocalities(data);
        // default select first locality
        const first = data[0];
        setFormData((prev) => ({
          ...prev,
          state: first.state_Name || '',
          city: first.city_Name || '',
          locality: first.locality_Name || '',
          localityId: first.locality_Id || '',
          cityId: first.locality_City || '',
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
      localityId: '',
      cityId: '',
    }));
  };

  const handleLocalityChange = (e) => {
    const selected = localities.find((loc) => loc.locality_Name === e.target.value);
    setFormData((prev) => ({
      ...prev,
      locality: selected?.locality_Name || '',
      localityId: selected?.locality_Id || '',
      cityId: selected?.locality_City || '',
    }));
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
