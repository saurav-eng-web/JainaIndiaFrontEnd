// 'use client';

// import { useState } from 'react';
// import './callregister.css';
// import Header from '@/components/header';

// export default function CallRegistrationPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     reason: '',
//   });

//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Call registered:', formData);

//     setSubmitted(true);
//     setFormData({ name: '', phone: '', reason: '' });
//   };

//   return (
//     <>
//       <Header />
//       <div className="call-registration">
//         <h1>Register a Call</h1>
//         <form onSubmit={handleSubmit} className="call-form">
//           <label>
//             Name:
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </label>

//           <label>
//             Phone:
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//             />
//           </label>

//           <label>
//             Reason for Call:
//             <textarea
//               name="reason"
//               value={formData.reason}
//               onChange={handleChange}
//               required
//             />
//           </label>

//           <button type="submit">Submit</button>
//         </form>

//         {submitted && <p className="success-message">Call registered successfully!</p>}
//       </div>
//     </>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './callregister.css';
import Header from '@/components/header';

export default function CallRegistrationPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    reason: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Call registered:', formData);

    setSubmitted(true);
    setFormData({ name: '', phone: '', reason: '' });
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner while redirecting
  }

  return (
    <>
      <Header />
      <div className="call-registration">
        <h1>Register a Call</h1>
        <form onSubmit={handleSubmit} className="call-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Reason for Call:
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Submit</button>
        </form>

        {submitted && <p className="success-message">Call registered successfully!</p>}
      </div>
    </>
  );
}
  