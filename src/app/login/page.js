

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import './login.css'; 

// export default function LoginPage() {
//   const router = useRouter();
//   const [userName, setUserName] = useState('');
//   const [uPassword, setUPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   // const handleLogin = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);

//   //   try {
//   //     const response = await axios.post(
//   //       'https://ncapi.jainaindia.com/api/users/login',
//   //       {
//   //         userName: userName.trim(),
//   //         uPassword: uPassword.trim(),
//   //       },
//   //       {
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //         },
//   //       }
//   //     );

//   //     const data = response.data;

//   //     if (data.returnCode === 1) {
//   //       // Overwrite existing userData if present
//   //       localStorage.setItem('userData', JSON.stringify({
//   //         userID: data.userID,
//   //         roleID: data.roleID,
//   //         userName: data.userName,
//   //         roleName: data.roleName,
//   //       }));

//   //       router.push('/test');
//   //     } else {
//   //       alert(data.message || 'Login failed. Please try again.');
//   //     }
//   //   } catch (err) {
//   //     alert('Login failed. Please try again.');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
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
//         const user = {
//           userID: data.userID,
//           roleID: data.roleID,
//           userName: data.userName,
//           roleName: data.roleName,
//         };
  
//         localStorage.setItem('userData', JSON.stringify(user));
  
//         // 🔁 Dynamic route based on roleName
//         const role = data.roleName?.toLowerCase();
  
//         if (role === 'nsp') {
//           router.push('/testadmin');
//         } else if (role === 'manager') {
//           router.push('/manager/home');
//         } else if (role === 'technician') {
//           router.push('/technician/jobs');
//         } else {
//           router.push('/test'); // Default or generic role
//         }
//       } else {
//         alert(data.message || 'Login failed. Please try again.');
//       }
//     } catch (err) {
//       alert('Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <div className="avatar" />
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
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/redux/slices/authSlice';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userName = e.target.username.value;
    const uPassword = e.target.password.value;
    dispatch(loginUser({ userName, uPassword }));
  };

  useEffect(() => {
    if (user) {
      const role = user.roleName?.toLowerCase();
      if (role === 'nsp') {
        router.push('/test');
      } else if (role === 'manager') {
        router.push('/manager/home');
      } else if (role === 'technician') {
        router.push('/technician/jobs');
      } else {
        router.push('/test');
      }
    }
  }, [user]);

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="avatar" />
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

