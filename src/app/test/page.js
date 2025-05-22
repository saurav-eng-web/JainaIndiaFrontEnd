'use client';

import { useState } from 'react';
import './test.css';
import Header from '@/components/header';

export default function Test() {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    gender: '',
    occupation: '',
    idType: '',
    idNumber: '',
    issueAuthority: '',
    issueDate: '',
    issueState: '',
    expiryDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration Data:', formData);
  };

  return (
    <>
      <Header />
      <div className="registration-container">
        <h2>Complaint Details</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <h3>Product Details</h3>
          <div className="form-grid">
            <input name="fullName" placeholder="Enter your Product Name" onChange={handleChange} required />
            <input name="dob" type="date" placeholder="Enter birth date" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Enter your email" onChange={handleChange} required />
            <input name="phone" placeholder="Enter mobile number" onChange={handleChange} required />
            <input name="gender" placeholder="Enter your Serial No." onChange={handleChange} required />
            <input name="occupation" placeholder="Enter Model" onChange={handleChange} required />
          </div>

          <h3>Customer Details</h3>
          <div className="form-grid">
            <input name="idType" placeholder="Enter Name" onChange={handleChange} required />
            <input name="idNumber" placeholder="Enter Address" onChange={handleChange} required />
            <input name="issueAuthority" placeholder="Enter Mobile" onChange={handleChange} required />
            <input name="issueDate" type="date" placeholder="Enter ID issue date" onChange={handleChange} required />
            <input name="issueState" placeholder="Enter" onChange={handleChange} required />
            <input name="expiryDate" type="date" placeholder="Enter ID expiry date" onChange={handleChange} required />
          </div>
          <div className="button-wrapper">
  <button type="submit" className="next-button">Submit ➞</button>
</div>
        </form>
      </div>
    </>
  );
}
