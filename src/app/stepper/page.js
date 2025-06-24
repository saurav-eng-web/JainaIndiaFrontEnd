

'use client';

import { useState } from 'react';
import './stepper.css';
import Header from '@/components/header';
import SideBar from '@/components/SideBar'; 

const steps = ['Customer Details', 'Address Details', 'Product Details', 'Service Details'];

export default function CallRegister() {
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
      callType: 'Call Type'
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
      console.log('Form Submitted', formData);
      alert('Form Submitted! Check console for details.');
    }
  };

  return (
    <>
      <SideBar />
      <div className="main-content">
        <div className="registration-container">
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

          <form onSubmit={handleSubmit} className="registration-form">
            {currentStep === 0 && (
              <>
                <h3>Customer Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="callBy">Call By</label>
                    <select id="callBy" name="callBy" onChange={handleChange} value={formData.callBy} required>
                      <option value="">Call By</option>
                      <option value="Customer">Customer</option>
                      <option value="Dealer">Dealer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input id="title" name="title" placeholder="Title" onChange={handleChange} value={formData.title} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="altPhone">Alternate Phone</label>
                    <input id="altPhone" name="altPhone" type="tel" placeholder="Alternate Phone" onChange={handleChange} value={formData.altPhone} required />
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <h3>Address Details</h3>
                <div className="form-grid">
                  {['customerAddress', 'landmark', 'pincode', 'state', 'city', 'locality'].map((field) => (
                    <div className="form-group" key={field}>
                      <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</label>
                      <input id={field} name={field} placeholder={field.replace(/([A-Z])/g, ' $1')} onChange={handleChange} value={formData[field]} required={['customerAddress', 'pincode'].includes(field)} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h3>Product Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="serialNo">Serial No.</label>
                    <input id="serialNo" name="serialNo" placeholder="Serial No." onChange={handleChange} value={formData.serialNo} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="productCategory">Product Category</label>
                    <select id="productCategory" name="productCategory" onChange={handleChange} value={formData.productCategory} required>
                      <option value="">Select Product Category</option>
                      <option value="TV">TV</option>
                      <option value="AC">AC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="pop">POP</label>
                    <input id="pop" name="pop" type="date" placeholder="POP" onChange={handleChange} value={formData.pop} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="product">Product</label>
                    <input id="product" name="product" placeholder="Product" onChange={handleChange} value={formData.product} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="model">Model</label>
                    <input id="model" name="model" placeholder="Model" onChange={handleChange} value={formData.model} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="warranty">Warranty</label>
                    <input id="warranty" name="warranty" placeholder="Warranty" onChange={handleChange} value={formData.warranty} />
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h3>Service Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="callType">Call Type</label>
                    <select id="callType" name="callType" onChange={handleChange} value={formData.callType} required>
                      <option value="">Select Call Type</option>
                      <option value="Demo/Installation">Demo/Installation</option>
                      <option value="Service">Service</option>
                      <option value="PMS Dry/Wet">PMS Dry/Wet</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="faultVoc">Fault/VOC</label>
                    <textarea id="faultVoc" name="faultVoc" rows="4" placeholder="Fault/VOC" onChange={handleChange} value={formData.faultVoc} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availableTime">Customer Available Time</label>
                    <input id="availableTime" name="availableTime" placeholder="Customer available time" onChange={handleChange} value={formData.availableTime} />
                  </div>
                </div>
              </>
            )}

            <div className="button-wrapper">
              {currentStep > 0 && <button type="button" onClick={prevStep}>← Back</button>}
              {currentStep < steps.length - 1 ? (
                <button type="button" onClick={nextStep}>Next →</button>
              ) : (
                <button type="submit">Submit ✔</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
