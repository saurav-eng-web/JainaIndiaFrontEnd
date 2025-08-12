// 'use client';

// export default function ServiceDetailsStep({ formData, handleChange }) {
//   const timeSlots = Array.from({ length: 10 }, (_, i) => {
//     const hour = 10 + i;
//     const start = `${hour.toString().padStart(2, '0')}:00`;
//     const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
//     return `${start} - ${end}`;
//   });

//   return (
//     <>
//       <h3>Service Details</h3>
//       <div className="form-grid">
//         {/* Call Type */}
//         <div className="form-group">
//           <label htmlFor="callType">Call Type</label>
//           <select id="callType" name="callType" onChange={handleChange} value={formData.callType}>
//             <option value="">Select Call Type</option>
//             <option value="Demo/Installation">Demo/Installation</option>
//             <option value="Service">Service</option>
//             <option value="PMS Dry/Wet">PMS Dry/Wet</option>
//           </select>
//         </div>

//         {/* Fault VOC */}
//         <div className="form-group">
//           <label htmlFor="faultVoc">Fault/VOC</label>
//           <textarea
//             id="faultVoc"
//             name="faultVoc"
//             rows="4"
//             onChange={handleChange}
//             value={formData.faultVoc}
//           />
//         </div>

//         {/* Customer Available Time - Dropdown */}
//         <div className="form-group">
//           <label htmlFor="availableTime">Customer Available Time</label>
//           <select
//             id="availableTime"
//             name="availableTime"
//             onChange={handleChange}
//             value={formData.availableTime}
//           >
//             <option value="">Select Time Slot</option>
//             {timeSlots.map((slot, index) => (
//               <option key={index} value={slot}>
//                 {slot}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </>
//   );
// }

'use client';

import { useState, useEffect } from 'react';

export default function ServiceDetailsStep({ formData, handleChange }) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Generate filtered time slots based on selected date
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    const slots = Array.from({ length: 10 }, (_, i) => {
      const hour = 10 + i;
      const start = `${hour.toString().padStart(2, '0')}:00`;
      const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
      return { hour, label: `${start} - ${end}` };
    });

    // If selected date is today, filter slots to only those in the future
    const filteredSlots =
      selectedDate === now.toISOString().split('T')[0]
        ? slots.filter((slot) => slot.hour > currentHour)
        : slots;

    setTimeSlots(filteredSlots);
  }, [selectedDate]);

  // Get today's date and max date (D+3)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 3);

  const formatDate = (date) => date.toISOString().split('T')[0];

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

        {/* Service Date */}
        <div className="form-group">
          <label htmlFor="serviceDate">Service Date</label>
          <input
            type="date"
            id="serviceDate"
            name="serviceDate"
            min={formatDate(today)}
            max={formatDate(maxDate)}
            value={formData.serviceDate || ''}
            onChange={(e) => {
              handleChange(e);
              setSelectedDate(e.target.value); 
            }}
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
            disabled={!selectedDate} // disable until date is chosen
          >
            <option value="">Select Time Slot</option>
            {timeSlots.length > 0 ? (
              timeSlots.map((slot, index) => (
                <option key={index} value={slot.label}>
                  {slot.label}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No slots available
              </option>
            )}
          </select>
        </div>
      </div>
    </>
  );
}

