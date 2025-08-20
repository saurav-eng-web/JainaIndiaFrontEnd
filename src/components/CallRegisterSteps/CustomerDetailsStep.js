
'use client';

export default function CustomerDetailsStep({ formData, handleChange, setFormData, errors }) {
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, [name]: digitsOnly }));
  };

  // ✅ Custom label mapping
  const fieldLabels = {
    title: 'Title',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    altPhone: 'Alternate Number'
  };

  return (
    <>
    <h3>Customer Details</h3>
    <div className="form-grid">
      <div className="form-group">
        <label htmlFor="callBy">Select</label>
        <select
          id="callBy"
          name="callBy"
          onChange={handleChange}
          value={formData.callBy || ''}
        >
          <option value="">Select</option>
          <option value="Customer">Customer</option>
          <option value="Dealer">Dealer</option>
        </select>
        {errors.callBy && <p className="error-text">{errors.callBy}</p>}
      </div>

      {['title', 'firstName', 'lastName', 'phone', 'altPhone'].map(field => (
        <div className="form-group" key={field}>
          <label htmlFor={field}>{fieldLabels[field] || field}</label>
          {field === 'title' ? (
            <select
              id={field}
              name={field}
              onChange={handleChange}
              value={formData[field] || ''}
            >
              <option value="">Select Title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>
          ) : (
            <input
            id={field}
            name={field}
            placeholder={fieldLabels[field] || field}
            type={field === 'phone' || field === 'altPhone' ? 'tel' : 'text'}
            value={formData[field] || ''}
            maxLength={field === 'phone' || field === 'altPhone' ? 10 : 50} // ✅ fixed
            onChange={
              field === 'phone' || field === 'altPhone'
                ? handleNumberChange
                : handleChange
            }
          />
          
          )}
          {errors[field] && <p className="error-text">{errors[field]}</p>}
        </div>
      ))}
    </div>
  </>
  );
}

