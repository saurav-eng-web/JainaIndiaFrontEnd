

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import './login.css'; 

// export default function LoginPage() {
//   const router = useRouter();
//   const [userName, setUserName] = useState('');
//   const [uPassword, setUPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [userExists, setUserExists] = useState(false);

//   useEffect(() => {
//     const userData = localStorage.getItem('userData');
//     if (userData) {
//       setUserExists(true);
//       router.push('/dashboard');
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         'https://ncapi.jainaindia.com/api/users/login',
//         {
//           userName: userName.trim(),
//           uPassword: uPassword.trim(),
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       const data = response.data;

//       if (data.returnCode === 1) {
//         localStorage.setItem('userData', JSON.stringify({
//           userID: data.userID,
//           roleID: data.roleID,
//           userName: data.userName,
//           roleName: data.roleName,
//         }));

//         router.push('/dashboard');
//       } else {
//         alert(data.message || 'Login failed. Please try again.');
//       }
//     } catch (err) {
//       alert('Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSwitchUser = () => {
//     localStorage.removeItem('userData');
//     setUserExists(false);
//     setUserName('');
//     setUPassword('');
//   };

 
//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <div className="avatar" />
//         {userExists && (
//           <div className="switch-user">
//             Already logged in. <button onClick={handleSwitchUser}>Switch User</button>
//           </div>
//         )}
//         <form onSubmit={handleLogin}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={userName}
//             onChange={(e) => setUserName(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={uPassword}
//             onChange={(e) => setUPassword(e.target.value)}
//             required
//           />
//           <div className="forgot-password">
//             <a href="#">Forgot Password?</a>
//           </div>
//           <button type="submit" className="login-button" disabled={loading}>
//             {loading ? 'Logging in...' : 'LOGIN'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );

// }



'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './login.css'; 

export default function LoginPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [uPassword, setUPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'https://ncapi.jainaindia.com/api/users/login',
        {
          userName: userName.trim(),
          uPassword: uPassword.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (data.returnCode === 1) {
        // Overwrite existing userData if present
        localStorage.setItem('userData', JSON.stringify({
          userID: data.userID,
          roleID: data.roleID,
          userName: data.userName,
          roleName: data.roleName,
        }));

        router.push('/dashboard');
      } else {
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="avatar" />
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={uPassword}
            onChange={(e) => setUPassword(e.target.value)}
            required
          />
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}

