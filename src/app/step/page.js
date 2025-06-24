'use client';

import { useState } from 'react';
import './stepper.css';

const steps = ['Customer Details', 'Address Details', 'Product Details', 'Service Details'];

export default function Stepper2() {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    callBy: '',
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    altPhone: '',
    customerAddress: '',
    landmark: '',
    pincode: '',
    state: '',
    city: '',
    locality: '',
    serialNo: '',
    productCategory: '',
    pop: '',
    product: '',
    model: '',
    warranty: '',
    callType: '',
    faultVoc: '',
    availableTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    const requiredFieldsByStep = [
      ['callBy', 'title', 'firstName', 'lastName', 'email', 'altPhone'],
      ['customerAddress', 'pincode'],
      ['productCategory'],
      ['callType']
    ];

    const fieldLabels = {
      callBy: 'Call By',
      title: 'Title',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      altPhone: 'Alternate Phone',
      customerAddress: 'Customer Address',
      pincode: 'Pincode',
      productCategory: 'Product Category',
      callType: 'Call Type',
    };

    const fields = requiredFieldsByStep[currentStep];
    for (let field of fields) {
      if (!formData[field] || formData[field].trim() === '') {
        alert(`Please fill the required field: ${fieldLabels[field] || field}`);
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Submitted Data:', formData);
      alert('Call Registered Successfully');
    }
  };

  return (
    <div className="call-register-wrapper">
      <h2>Call Registration</h2>
      <div className="stepper">
        {steps.map((label, index) => (
          <div className="step" key={index}>
            <div className={`circle ${index <= currentStep ? 'active' : ''}`}>
              {index < currentStep ? '✔' : index + 1}
            </div>
            <div className="label">{label}</div>
            {index < steps.length - 1 && <div className="line"></div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="form-section">
        {currentStep === 0 && (
          <>
            <h3>Customer Details</h3>
            <div className="form-grid">
              <select name="callBy" value={formData.callBy} onChange={handleChange}>
                <option value="">Call By</option>
                <option value="Customer">Customer</option>
                <option value="Dealer">Dealer</option>
              </select>
              <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
              <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
              <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              <input name="altPhone" type="tel" placeholder="Alternate Phone" value={formData.altPhone} onChange={handleChange} />
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <h3>Address Details</h3>
            <div className="form-grid">
              <input name="customerAddress" placeholder="Customer Address" value={formData.customerAddress} onChange={handleChange} />
              <input name="landmark" placeholder="Landmark" value={formData.landmark} onChange={handleChange} />
              <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
              <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
              <input name="locality" placeholder="Locality" value={formData.locality} onChange={handleChange} />
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h3>Product Details</h3>
            <div className="form-grid">
              <input name="serialNo" placeholder="Serial No." value={formData.serialNo} onChange={handleChange} />
              <select name="productCategory" value={formData.productCategory} onChange={handleChange}>
                <option value="">Product Category</option>
                <option value="TV">TV</option>
                <option value="AC">AC</option>
              </select>
              <input name="pop" type="date" value={formData.pop} onChange={handleChange} />
              <input name="product" placeholder="Product" value={formData.product} onChange={handleChange} />
              <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} />
              <input name="warranty" placeholder="Warranty" value={formData.warranty} onChange={handleChange} />
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h3>Service Details</h3>
            <div className="form-grid">
              <select name="callType" value={formData.callType} onChange={handleChange}>
                <option value="">Select Call Type</option>
                <option value="Demo/Installation">Demo/Installation</option>
                <option value="Service">Service</option>
                <option value="PMS Dry/Wet">PMS Dry/Wet</option>
              </select>
              <textarea name="faultVoc" placeholder="Fault/VOC" value={formData.faultVoc} onChange={handleChange} rows={4}></textarea>
              <input name="availableTime" placeholder="Customer Available Time" value={formData.availableTime} onChange={handleChange} />
            </div>
          </>
        )}

        <div className="form-actions">
          {currentStep > 0 && <button type="button" onClick={prevStep}>← Back</button>}
          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={nextStep}>Next →</button>
          ) : (
            <button type="submit">Submit ✔</button>
          )}
        </div>
      </form>
    </div>
  );
}
