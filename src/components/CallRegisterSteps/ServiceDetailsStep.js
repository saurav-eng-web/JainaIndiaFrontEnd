// // // 'use client';

// // // export default function ServiceDetailsStep({ formData, handleChange }) {
// // //   const timeSlots = Array.from({ length: 10 }, (_, i) => {
// // //     const hour = 10 + i;
// // //     const start = `${hour.toString().padStart(2, '0')}:00`;
// // //     const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
// // //     return `${start} - ${end}`;
// // //   });

// // //   return (
// // //     <>
// // //       <h3>Service Details</h3>
// // //       <div className="form-grid">
// // //         {/* Call Type */}
// // //         <div className="form-group">
// // //           <label htmlFor="callType">Call Type</label>
// // //           <select id="callType" name="callType" onChange={handleChange} value={formData.callType}>
// // //             <option value="">Select Call Type</option>
// // //             <option value="Demo/Installation">Demo/Installation</option>
// // //             <option value="Service">Service</option>
// // //             <option value="PMS Dry/Wet">PMS Dry/Wet</option>
// // //           </select>
// // //         </div>

// // //         {/* Fault VOC */}
// // //         <div className="form-group">
// // //           <label htmlFor="faultVoc">Fault/VOC</label>
// // //           <textarea
// // //             id="faultVoc"
// // //             name="faultVoc"
// // //             rows="4"
// // //             onChange={handleChange}
// // //             value={formData.faultVoc}
// // //           />
// // //         </div>

// // //         {/* Customer Available Time - Dropdown */}
// // //         <div className="form-group">
// // //           <label htmlFor="availableTime">Customer Available Time</label>
// // //           <select
// // //             id="availableTime"
// // //             name="availableTime"
// // //             onChange={handleChange}
// // //             value={formData.availableTime}
// // //           >
// // //             <option value="">Select Time Slot</option>
// // //             {timeSlots.map((slot, index) => (
// // //               <option key={index} value={slot}>
// // //                 {slot}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // }

// // 'use client';

// // import { useState, useEffect } from 'react';

// // export default function ServiceDetailsStep({ formData, handleChange }) {
// //   const [timeSlots, setTimeSlots] = useState([]);
// //   const [selectedDate, setSelectedDate] = useState('');

// //   // Generate filtered time slots based on selected date
// //   useEffect(() => {
// //     const now = new Date();
// //     const currentHour = now.getHours();

// //     const slots = Array.from({ length: 10 }, (_, i) => {
// //       const hour = 10 + i;
// //       const start = `${hour.toString().padStart(2, '0')}:00`;
// //       const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
// //       return { hour, label: `${start} - ${end}` };
// //     });

// //     // If selected date is today, filter slots to only those in the future
// //     const filteredSlots =
// //       selectedDate === now.toISOString().split('T')[0]
// //         ? slots.filter((slot) => slot.hour > currentHour)
// //         : slots;

// //     setTimeSlots(filteredSlots);
// //   }, [selectedDate]);

// //   // Get today's date and max date (D+3)
// //   const today = new Date();
// //   const maxDate = new Date();
// //   maxDate.setDate(today.getDate() + 3);

// //   const formatDate = (date) => date.toISOString().split('T')[0];

// //   return (
// //     <>
// //       <h3>Service Details</h3>
// //       <div className="form-grid">
// //         {/* Call Type */}
// //                 <div className="form-group">
// //           <label htmlFor="callType">Call Type</label>
// //           <select
// //             id="callType"
// //             name="callType"
// //             onChange={handleChange}
// //             value={formData.callType}
// //           >
// //             <option value="">Select Call Type</option>
// //             <option value="Service">Service</option>
// //             <option value="Demo">Demo</option>
// //             <option value="Installation">Installation</option>
// //             <option value="Stock">Stock</option>
// //             <option value="Repair">Repair</option>
// //             <option value="PMS Dry">PMS Dry</option>
// //             <option value="PMS Wet">PMS Wet</option>
// //             <option value="Case Closed over the Call">Case Closed over the Call</option>
// //           </select>
// //         </div>

       

// //         {/* Service Date */}
// //         <div className="form-group">
// //   <label htmlFor="serviceDateTime">Customer Available Date & Time</label>
// //   <div style={{ display: "flex", gap: "8px" }}>
// //     {/* Date Picker */}
// //     <input
// //       type="date"
// //       id="serviceDate"
// //       name="serviceDate"
// //       min={formatDate(today)}
// //       max={formatDate(maxDate)}
// //       value={formData.serviceDate || ''}
// //       onChange={(e) => {
// //         handleChange(e);
// //         setSelectedDate(e.target.value);
// //       }}
// //       style={{ flex: 1 }}
// //     />

// //     {/* Time Slots */}
// //     <select
// //       id="availableTime"
// //       name="availableTime"
// //       onChange={handleChange}
// //       value={formData.availableTime}
// //       disabled={!selectedDate}
// //       style={{ flex: 1 }}
// //     >
// //       <option value="">Select Time</option>
// //       {timeSlots.length > 0 ? (
// //         timeSlots.map((slot, index) => (
// //           <option key={index} value={slot.label}>
// //             {slot.label}
// //           </option>
// //         ))
// //       ) : (
// //         <option value="" disabled>
// //           No slots available
// //         </option>
// //       )}
// //     </select>
// //   </div>
// // </div>
// //          {/* Fault VOC */}
// //          <div className="form-group">
// //   <label htmlFor="faultVoc">Fault/VOC</label>
// //   <select
// //     id="faultVoc"
// //     name="faultVoc"
// //     onChange={handleChange}
// //     value={formData.faultVoc}
// //   >
// //     <option value="">Select</option>
// //     <option value="No Power">No Power</option>
// //     <option value="Water Leakage">Water Leakage</option>
// //     <option value="Noise Issue">Noise Issue</option>
// //     <option value="Not Cooling">Not Cooling</option>
// //     <option value="Display Error">Display Error</option>
// //     <option value="Other">Other</option>
// //   </select>
// // </div>
// //       </div>
// //     </>
// //   );
// // }


// 'use client';

// import { useState, useEffect } from 'react';

// export default function ServiceDetailsStep({ formData, handleChange, errors }) {
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('');

//   // Generate filtered time slots based on selected date
//   useEffect(() => {
//     const now = new Date();
//     const currentHour = now.getHours();

//     const slots = Array.from({ length: 10 }, (_, i) => {
//       const hour = 10 + i;
//       const start = `${hour.toString().padStart(2, '0')}:00`;
//       const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
//       return { hour, label: `${start} - ${end}` };
//     });

//     const filteredSlots =
//       selectedDate === now.toISOString().split('T')[0]
//         ? slots.filter((slot) => slot.hour > currentHour)
//         : slots;

//     setTimeSlots(filteredSlots);
//   }, [selectedDate]);

//   const today = new Date();
//   const maxDate = new Date();
//   maxDate.setDate(today.getDate() + 3);

//   const formatDate = (date) => date.toISOString().split('T')[0];

//   return (
//     <>
//       <h3>Service Details</h3>
//       <div className="form-grid">
        
//         {/* Call Type */}
//         <div className="form-group">
//           <label htmlFor="callType">Call Type</label>
//           <select
//             id="callType"
//             name="callType"
//             onChange={handleChange}
//             value={formData.callType}
//           >
//             <option value="">Select Call Type</option>
//             <option value="Service">Service</option>
//             <option value="Demo">Demo</option>
//             <option value="Installation">Installation</option>
//             <option value="Stock">Stock</option>
//             <option value="Repair">Repair</option>
//             <option value="PMS Dry">PMS Dry</option>
//             <option value="PMS Wet">PMS Wet</option>
//             <option value="Case Closed over the Call">Case Closed over the Call</option>
//           </select>
//           {errors.callType && <span className="error-text">{errors.callType}</span>}
//         </div>

//         {/* Service Date & Time */}
//         <div className="form-group">
//           <label htmlFor="serviceDateTime">Customer Available Date & Time</label>
//           <div style={{ display: "flex", gap: "8px" }}>
//             {/* Date Picker */}
//             <input
//               type="date"
//               id="serviceDate"
//               name="serviceDate"
//               min={formatDate(today)}
//               max={formatDate(maxDate)}
//               value={formData.serviceDate || ''}
//               onChange={(e) => {
//                 handleChange(e);
//                 setSelectedDate(e.target.value);
//               }}
//               style={{ flex: 1 }}
//             />

//             {/* Time Slots */}
//             <select
//               id="availableTime"
//               name="availableTime"
//               onChange={handleChange}
//               value={formData.availableTime}
//               disabled={!selectedDate}
//               style={{ flex: 1 }}
//             >
//               <option value="">Select Time</option>
//               {timeSlots.length > 0 ? (
//                 timeSlots.map((slot, index) => (
//                   <option key={index} value={slot.label}>
//                     {slot.label}
//                   </option>
//                 ))
//               ) : (
//                 <option value="" disabled>
//                   No slots available
//                 </option>
//               )}
//             </select>
//           </div>
//           {errors.availableTime && <span className="error-text">{errors.availableTime}</span>}
//         </div>

//         {/* Fault VOC */}
//         <div className="form-group">
//           <label htmlFor="faultVoc">Fault/VOC</label>
//           <select
//             id="faultVoc"
//             name="faultVoc"
//             onChange={handleChange}
//             value={formData.faultVoc}
//           >
//             <option value="">Select</option>
//             <option value="No Power">No Power</option>
//             <option value="Water Leakage">Water Leakage</option>
//             <option value="Noise Issue">Noise Issue</option>
//             <option value="Not Cooling">Not Cooling</option>
//             <option value="Display Error">Display Error</option>
//             <option value="Other">Other</option>
//           </select>
//           {errors.faultVoc && <span className="error-text">{errors.faultVoc}</span>}
//         </div>
//       </div>
//     </>
//   );
// }




// 'use client';

// import { useState, useEffect } from 'react';
// import axiosInstance from '@/api/axiosInstance';

// export default function ServiceDetailsStep({ formData, handleChange, errors, setFormData }) {
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [callTypes, setCallTypes] = useState([]);

//   // ✅ Fetch Call Types from API
//   useEffect(() => {
//     const fetchCallTypes = async () => {
//       try {
//         const res = await axiosInstance.get('calltypemaster');
//         if (Array.isArray(res.data)) {
//           setCallTypes(res.data);
//         }
//       } catch (err) {
//         console.error('Error fetching call types:', err);
//       }
//     };

//     fetchCallTypes();
//   }, []);

//   // ✅ Generate filtered time slots based on selected date
//   useEffect(() => {
//     const now = new Date();
//     const currentHour = now.getHours();

//     const slots = Array.from({ length: 10 }, (_, i) => {
//       const hour = 10 + i;
//       const start = `${hour.toString().padStart(2, '0')}:00`;
//       const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
//       return { hour, label: `${start} - ${end}` };
//     });

//     const filteredSlots =
//       selectedDate === now.toISOString().split('T')[0]
//         ? slots.filter((slot) => slot.hour > currentHour)
//         : slots;

//     setTimeSlots(filteredSlots);
//   }, [selectedDate]);

//   const today = new Date();
//   const maxDate = new Date();
//   maxDate.setDate(today.getDate() + 3);

//   const formatDate = (date) => date.toISOString().split('T')[0];

//   // ✅ Handle call type change (store ID + Name in formData)
//   const handleCallTypeChange = (e) => {
//     const selectedId = e.target.value;
//     const selectedObj = callTypes.find((c) => c.callType_ID.toString() === selectedId);

//     setFormData((prev) => ({
//       ...prev,
//       callTypeId: selectedId,
//       callType: selectedObj?.callType_Name || '',
//     }));
//   };

//   return (
//     <>
//       <h3>Service Details</h3>
//       <div className="form-grid">

//         {/* ✅ Call Type from API */}
//         <div className="form-group">
//           <label htmlFor="callType">Call Type</label>
//           <select
//             id="callType"
//             name="callType"
//             onChange={handleCallTypeChange}
//             value={formData.callTypeId || ''}
//           >
//             <option value="">Select Call Type</option>
//             {callTypes.map((type) => (
//               <option key={type.callType_ID} value={type.callType_ID}>
//                 {type.callType_Name}
//               </option>
//             ))}
//           </select>
//           {errors.callType && <span className="error-text">{errors.callType}</span>}
//         </div>

//         {/* ✅ Service Date & Time */}
//         <div className="form-group">
//           <label htmlFor="serviceDateTime">Customer Available Date & Time</label>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <input
//               type="date"
//               id="serviceDate"
//               name="serviceDate"
//               min={formatDate(today)}
//               max={formatDate(maxDate)}
//               value={formData.serviceDate || ''}
//               onChange={(e) => {
//                 handleChange(e);
//                 setSelectedDate(e.target.value);
//               }}
//               style={{ flex: 1 }}
//             />

//             <select
//               id="availableTime"
//               name="availableTime"
//               onChange={handleChange}
//               value={formData.availableTime}
//               disabled={!selectedDate}
//               style={{ flex: 1 }}
//             >
//               <option value="">Select Time</option>
//               {timeSlots.length > 0 ? (
//                 timeSlots.map((slot, index) => (
//                   <option key={index} value={slot.label}>
//                     {slot.label}
//                   </option>
//                 ))
//               ) : (
//                 <option value="" disabled>
//                   No slots available
//                 </option>
//               )}
//             </select>
//           </div>
//           {errors.availableTime && <span className="error-text">{errors.availableTime}</span>}
//         </div>

//         {/* Fault VOC */}
//         <div className="form-group">
//           <label htmlFor="faultVoc">Fault/VOC</label>
//           <select
//             id="faultVoc"
//             name="faultVoc"
//             onChange={handleChange}
//             value={formData.faultVoc}
//           >
//             <option value="">Select</option>
//             <option value="No Power">No Power</option>
//             <option value="Water Leakage">Water Leakage</option>
//             <option value="Noise Issue">Noise Issue</option>
//             <option value="Not Cooling">Not Cooling</option>
//             <option value="Display Error">Display Error</option>
//             <option value="Other">Other</option>
//           </select>
//           {errors.faultVoc && <span className="error-text">{errors.faultVoc}</span>}
//         </div>
//       </div>
//     </>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';

export default function ServiceDetailsStep({ formData, handleChange, errors, setFormData }) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [callTypes, setCallTypes] = useState([]);
  const [faults, setFaults] = useState([]);

  // ✅ Fetch Call Types from API
  useEffect(() => {
    const fetchCallTypes = async () => {
      try {
        const res = await axiosInstance.get('calltypemaster');
        if (Array.isArray(res.data)) {
          setCallTypes(res.data);
        }
      } catch (err) {
        console.error('Error fetching call types:', err);
      }
    };

    fetchCallTypes();
  }, []);

  // ✅ Fetch Faults (Symptoms) from API
  useEffect(() => {
    const fetchFaults = async () => {
      try {
        const res = await axiosInstance.get('SymptomMaster');
        if (Array.isArray(res.data)) {
          setFaults(res.data);
        }
      } catch (err) {
        console.error('Error fetching faults:', err);
      }
    };

    fetchFaults();
  }, []);

  // ✅ Generate filtered time slots based on selected date
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    const slots = Array.from({ length: 10 }, (_, i) => {
      const hour = 10 + i;
      const start = `${hour.toString().padStart(2, '0')}:00`;
      const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
      return { hour, label: `${start} - ${end}` };
    });

    const filteredSlots =
      selectedDate === now.toISOString().split('T')[0]
        ? slots.filter((slot) => slot.hour > currentHour)
        : slots;

    setTimeSlots(filteredSlots);
  }, [selectedDate]);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 3);

  const formatDate = (date) => date.toISOString().split('T')[0];

  // ✅ Handle call type change (store ID + Name in formData)
  const handleCallTypeChange = (e) => {
    const selectedId = e.target.value;
    const selectedObj = callTypes.find((c) => c.callType_ID.toString() === selectedId);

    setFormData((prev) => ({
      ...prev,
      callTypeId: selectedId,
      callType: selectedObj?.callType_Name || '',
    }));
  };

  // ✅ Handle fault (symptom) change (store syid + symptom)
  const handleFaultChange = (e) => {
    const selectedId = e.target.value;
    const selectedObj = faults.find((f) => f.syid.toString() === selectedId);

    setFormData((prev) => ({
      ...prev,
      faultVocId: selectedId,
      faultVoc: selectedObj?.symptom || '',
    }));
  };

  return (
    <>
      <h3>Service Details</h3>
      <div className="form-grid">

        {/* ✅ Call Type from API */}
        <div className="form-group">
          <label htmlFor="callType">Call Type</label>
          <select
            id="callType"
            name="callType"
            onChange={handleCallTypeChange}
            value={formData.callTypeId || ''}
          >
            <option value="">Select Call Type</option>
            {callTypes.map((type) => (
              <option key={type.callType_ID} value={type.callType_ID}>
                {type.callType_Name}
              </option>
            ))}
          </select>
          {errors.callType && <span className="error-text">{errors.callType}</span>}
        </div>

        {/* ✅ Service Date & Time */}
        <div className="form-group">
          <label htmlFor="serviceDateTime">Customer Available Date & Time</label>
          <div style={{ display: "flex", gap: "8px" }}>
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
              style={{ flex: 1 }}
            />

            <select
              id="availableTime"
              name="availableTime"
              onChange={handleChange}
              value={formData.availableTime}
              disabled={!selectedDate}
              style={{ flex: 1 }}
            >
              <option value="">Select Time</option>
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
          {errors.availableTime && <span className="error-text">{errors.availableTime}</span>}
        </div>

        {/* ✅ Fault VOC from API */}
        <div className="form-group">
          <label htmlFor="faultVoc">Fault/VOC</label>
          <select
            id="faultVoc"
            name="faultVoc"
            onChange={handleFaultChange}
            value={formData.faultVocId || ''}
          >
            <option value="">Select Fault</option>
            {faults.map((f) => (
              <option key={f.syid} value={f.syid}>
                {f.symptom}
              </option>
            ))}
          </select>
          {errors.faultVoc && <span className="error-text">{errors.faultVoc}</span>}
        </div>
      </div>
    </>
  );
}
