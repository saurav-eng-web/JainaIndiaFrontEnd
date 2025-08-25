

// // 'use client';

// // import { useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import axios from 'axios';
// // import './login.css'; 

// // export default function LoginPage() {
// //   const router = useRouter();
// //   const [userName, setUserName] = useState('');
// //   const [uPassword, setUPassword] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   // const handleLogin = async (e) => {
// //   //   e.preventDefault();
// //   //   setLoading(true);

// //   //   try {
// //   //     const response = await axios.post(
// //   //       'https://ncapi.jainaindia.com/api/users/login',
// //   //       {
// //   //         userName: userName.trim(),
// //   //         uPassword: uPassword.trim(),
// //   //       },
// //   //       {
// //   //         headers: {
// //   //           'Content-Type': 'application/json',
// //   //         },
// //   //       }
// //   //     );

// //   //     const data = response.data;

// //   //     if (data.returnCode === 1) {
// //   //       // Overwrite existing userData if present
// //   //       localStorage.setItem('userData', JSON.stringify({
// //   //         userID: data.userID,
// //   //         roleID: data.roleID,
// //   //         userName: data.userName,
// //   //         roleName: data.roleName,
// //   //       }));

// //   //       router.push('/test');
// //   //     } else {
// //   //       alert(data.message || 'Login failed. Please try again.');
// //   //     }
// //   //   } catch (err) {
// //   //     alert('Login failed. Please try again.');
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };
// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
  
// //     try {
// //       const response = await axios.post(
// //         'https://ncapi.jainaindia.com/api/users/login',
// //         {
// //           userName: userName.trim(),
// //           uPassword: uPassword.trim(),
// //         },
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //         }
// //       );
  
// //       const data = response.data;
  
// //       if (data.returnCode === 1) {
// //         const user = {
// //           userID: data.userID,
// //           roleID: data.roleID,
// //           userName: data.userName,
// //           roleName: data.roleName,
// //         };
  
// //         localStorage.setItem('userData', JSON.stringify(user));
  
// //         // 🔁 Dynamic route based on roleName
// //         const role = data.roleName?.toLowerCase();
  
// //         if (role === 'nsp') {
// //           router.push('/testadmin');
// //         } else if (role === 'manager') {
// //           router.push('/manager/home');
// //         } else if (role === 'technician') {
// //           router.push('/technician/jobs');
// //         } else {
// //           router.push('/test'); // Default or generic role
// //         }
// //       } else {
// //         alert(data.message || 'Login failed. Please try again.');
// //       }
// //     } catch (err) {
// //       alert('Login failed. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   return (
// //     <div className="login-container">
// //       <div className="login-box">
// //         <div className="avatar" />
// //         <form onSubmit={handleLogin}>
// //           <input
// //             type="text"
// //             placeholder="Username"
// //             value={userName}
// //             onChange={(e) => setUserName(e.target.value)}
// //             required
// //           />
// //           <input
// //             type="password"
// //             placeholder="Password"
// //             value={uPassword}
// //             onChange={(e) => setUPassword(e.target.value)}
// //             required
// //           />
// //           <div className="forgot-password">
// //             <a href="#">Forgot Password?</a>
// //           </div>
// //           <button type="submit" className="login-button" disabled={loading}>
// //             {loading ? 'Logging in...' : 'LOGIN'}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // // }








// // 'use client';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { loginUser } from '@/redux/slices/authSlice';
// // import { useEffect } from 'react';
// // import { useRouter } from 'next/navigation';
// // import './login.css';

// // export default function LoginPage() {
// //   const dispatch = useDispatch();
// //   const router = useRouter();
// //   const { user, loading, error } = useSelector((state) => state.auth);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     const userName = e.target.username.value;
// //     const uPassword = e.target.password.value;
// //     dispatch(loginUser({ userName, uPassword }));
// //   };

// //   useEffect(() => {
// //     if (user) {
// //       const role = user.roleName?.toLowerCase();
// //       if (role === 'nsp') {
// //         router.push('/test');
// //       } else if (role === 'manager') {
// //         router.push('/manager/home');
// //       } else if (role === 'technician') {
// //         router.push('/technician/jobs');
// //       } else {
// //         router.push('/test');
// //       }
// //     }
// //   }, [user]);

// //   return (
// //     <div className="login-container">
// //       <div className="login-box">
// //         <div className="avatar" />
// //         <form onSubmit={handleSubmit}>
// //           <input type="text" name="username" placeholder="Username" required />
// //           <input type="password" name="password" placeholder="Password" required />
// //           <div className="forgot-password">
// //             <a href="#">Forgot Password?</a>
// //           </div>
// //           <button type="submit" className="login-button" disabled={loading}>
// //             {loading ? 'Logging in...' : 'LOGIN'}
// //           </button>
// //           {error && <p className="error">{error}</p>}
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }




// 'use client';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '@/redux/slices/authSlice';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import './login.css';

// export default function LoginPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { user, loading, error } = useSelector((state) => state.auth);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const userName = e.target.username.value;
//     const uPassword = e.target.password.value;
//     dispatch(loginUser({ userName, uPassword }));
//   };

//   useEffect(() => {
//     if (user) {
//       const role = user.roleName?.toLowerCase();
//       if (role === 'nsp') {
//         router.push('/test');
//       } else if (role === 'manager') {
//         router.push('/manager/home');
//       } else if (role === 'technician') {
//         router.push('/technician/jobs');
//       } else {
//         router.push('/test');
//       }
//     }
//   }, [user]);

//   return (
//     <div className="login-wrapper">
//       {/* Left Section */}
//       <div className="login-left">
        
//       </div>

//       {/* Right Section */}
//       <div className="login-right">
//         <div className="login-form-container">
//           <h2>Sign in to your account</h2>
//           <p>Enter your credentials to access your account</p>
//           <form onSubmit={handleSubmit}>
//             <label>Email address</label>
//             <input type="text" name="username" placeholder="name@company.com" required />

//             <label>Password</label>
//             <input type="password" name="password" placeholder="Enter your password" required />

          

//             <button type="submit" className="sign-in-btn" disabled={loading}>
//               {loading ? 'Logging in...' : 'Sign in'}
//             </button>

//             {error && <p className="error">{error}</p>}

           
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/redux/slices/authSlice';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="flex h-screen font-sans">
      {/* Left Section */}
      <div
        className="flex-1 bg-cover bg-center text-white flex flex-col justify-center p-16 relative"
        style={{ backgroundImage: "url('/crmLogo.png')" }}
      >
        <div className="relative">
          <div className="text-lg font-bold mb-8">CRM Portal</div>
          <h1 className="text-3xl font-semibold mb-4">Welcome Back</h1>
          <p className="text-base opacity-90">
            Manage your complaints, jobs, and more efficiently.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-white flex justify-center items-center">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-2">Sign in to your account</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email address</label>
              <input
                type="text"
                name="username"
                placeholder="name@company.com"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 "
              />
            </div>

            {/* Sign In Button */}
            <button
  type="submit"
  className="w-full text-white py-3 rounded-lg transition duration-200 hover:opacity-90"
  style={{ backgroundColor: '#714b67' }}
  disabled={loading}
>
  {loading ? 'Logging in...' : 'Sign in'}
</button>
            {/* Error */}
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
