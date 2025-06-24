'use client';

export default function CustomerDetailsStep({ formData, handleChange, setFormData }) {
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10); // allow only digits, max 10
    setFormData(prev => ({ ...prev, [name]: digitsOnly }));
  };

  return (
    <>
      <h3>Customer Details</h3>
      <div className="form-grid">
        {/* Call By */}
        <div className="form-group">
          <label htmlFor="callBy">Call By</label>
          <select
            id="callBy"
            name="callBy"
            onChange={handleChange}
            value={formData.callBy || ''}
          >
            <option value="">Call By</option>
            <option value="Customer">Customer</option>
            <option value="Dealer">Dealer</option>
          </select>
        </div>

        {/* Title, First Name, Last Name, Phone, Alt Phone */}
        {['title', 'firstName', 'lastName', 'phone', 'altPhone'].map(field => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>

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
                placeholder={field}
                type="tel"
                value={formData[field] || ''}
                maxLength={10}
                onChange={
                  field === 'phone' || field === 'altPhone'
                    ? handleNumberChange
                    : handleChange
                }
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
