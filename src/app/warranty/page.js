

  'use client';

  import { useState } from 'react';
  import './callregister.css';
  import Header from '@/components/header';
  import Sidebar from '@/components/SideBar';

  export default function CallRegister() {
    const [formData, setFormData] = useState({
      serialNumber: '',
      firstName: '',
      lastName: '',
      address: '',
      landmark: '',
      pincode: '',
      state: '',
      city: '',
      locality: '',
      brand: '',
      product: '',
      model: '',
      dop: '',
      installationDate: '',
      purchaseFrom: '',
      invoiceFile: null,
      serialFile1: null,
      serialFile2: null,
    });

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (files) {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Complaint Data:', formData);
      // You may want to use FormData and POST to an API here
    };

    return (
      <>
        
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div className="registration-container" style={{ marginLeft: '60px', flex: 1 }}>
        <h2>Warranty Registration</h2>
        <form onSubmit={handleSubmit} className="registration-form" encType="multipart/form-data">
            <h3>Product Details</h3>
            
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>
<div className="form-grid">
  <div className="input-with-icon">
    <i className="fas fa-hashtag"></i>
    <input name="serialNumber" placeholder="Serial Number" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-user"></i>
    <input name="firstName" placeholder="First Name" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-user"></i>
    <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-home"></i>
    <input name="address" placeholder="Address" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-map-marker-alt"></i>
    <input name="landmark" placeholder="Landmark" onChange={handleChange} />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-mail-bulk"></i>
    <input name="pincode" placeholder="Pincode" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-flag"></i>
    <input name="state" placeholder="State" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-city"></i>
    <input name="city" placeholder="City" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-street-view"></i>
    <input name="locality" placeholder="Locality" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-industry"></i>
    <select name="brand" onChange={handleChange} required>
      <option value="">Select Brand</option>
      <option value="LG">LG</option>
      <option value="Samsung">Samsung</option>
      <option value="Sony">Sony</option>
      <option value="Panasonic">Panasonic</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <div className="input-with-icon">
    <i className="fas fa-box"></i>
    <input name="product" placeholder="Product" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-cube"></i>
    <input name="model" placeholder="Model" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-calendar-day"></i>
    <input name="dop" type="date" placeholder="Date of Purchase" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-tools"></i>
    <input name="installationDate" type="date" placeholder="Installation Date" onChange={handleChange} required />
  </div>

  <div className="input-with-icon">
    <i className="fas fa-store"></i>
    <input name="purchaseFrom" placeholder="Purchase From (Retailer)" onChange={handleChange} required />
  </div>

  {/* File Uploads with labels */}
  <div className="file-upload">
    <label htmlFor="invoiceFile"><i className="fas fa-file-invoice"></i> Upload Invoice</label>
    <input id="invoiceFile" type="file" name="invoiceFile" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
  </div>

  <div className="file-upload">
    <label htmlFor="serialFile1"><i className="fas fa-barcode"></i> Upload Serial No. 1</label>
    <input id="serialFile1" type="file" name="serialFile1" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
  </div>

  <div className="file-upload">
    <label htmlFor="serialFile2"><i className="fas fa-barcode"></i> Upload Serial No. 2</label>
    <input id="serialFile2" type="file" name="serialFile2" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
  </div>
</div>

            <div className="button-wrapper">
              <button type="submit" className="submit-button">Submit ➞</button>
            </div>
            </form>
      </div>
    </div>
      </>
    );
  }
