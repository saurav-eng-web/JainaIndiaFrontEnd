'use client';

export default function ServiceDetailsStep({ formData, handleChange }) {
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 10 + i;
    const start = `${hour.toString().padStart(2, '0')}:00`;
    const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
    return `${start} - ${end}`;
  });

  return (
    <>
      <h3>Service Details</h3>
      <div className="form-grid">
        {/* Call Type */}
        <div className="form-group">
          <label htmlFor="callType">Call Type</label>
          <select id="callType" name="callType" onChange={handleChange} value={formData.callType}>
            <option value="">Select Call Type</option>
            <option value="Demo/Installation">Demo/Installation</option>
            <option value="Service">Service</option>
            <option value="PMS Dry/Wet">PMS Dry/Wet</option>
          </select>
        </div>

        {/* Fault VOC */}
        <div className="form-group">
          <label htmlFor="faultVoc">Fault/VOC</label>
          <textarea
            id="faultVoc"
            name="faultVoc"
            rows="4"
            onChange={handleChange}
            value={formData.faultVoc}
          />
        </div>

        {/* Customer Available Time - Dropdown */}
        <div className="form-group">
          <label htmlFor="availableTime">Customer Available Time</label>
          <select
            id="availableTime"
            name="availableTime"
            onChange={handleChange}
            value={formData.availableTime}
          >
            <option value="">Select Time Slot</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
