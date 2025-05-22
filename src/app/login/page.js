
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('john@mail.com'); 
//   const [password, setPassword] = useState('changeme'); 
//   const [loading, setLoading] = useState(false);

  
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       router.push('/dashboard');
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: email.trim(),
//           password: password.trim(),
//         }),
//       });

//       const data = await response.json();

//       console.log('API Response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       localStorage.setItem('token', data.access_token);
//       localStorage.setItem('refreshToken', data.refresh_token);

//       router.push('/dashboard');
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
//       <h1>Login</h1>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         /><br /><br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         /><br /><br />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('john@mail.com');
//   const [password, setPassword] = useState('changeme');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       router.push('/dashboard');
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
//         email: email.trim(),
//         password: password.trim(),
//       });

//       console.log('API Response:', response.data);

//       const { access_token, refresh_token } = response.data;

//       localStorage.setItem('token', access_token);
//       localStorage.setItem('refreshToken', refresh_token);
//       router.push('/dashboard');
//     } catch (err) {
//       const message =
//         err.response?.data?.message || 'Login failed. Please try again.';
//       alert(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
//       <h1>Login</h1>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         /><br /><br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         /><br /><br />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function LoginPage() {
//   const router = useRouter();
//   const [userName, setUserName] = useState('test');
//   const [uPassword, setUPassword] = useState('password123');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const userData = localStorage.getItem('userData');
//     if (userData) {
//       router.push('/dashboard');
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         'https://ncapi.jainaindia.com/api/users/login?encryptionKey=TNCbe2bu5Zt9SwVdidyJOUY0IondnrhbPw4TR9W%2FsY%3D&encryptionIv=HdCz+tyRX%2FqQMJXjxRbxBQ%3D%3D',
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

//   return (
//     <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
//       <h1>Login</h1>
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//           required
//         /><br /><br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={uPassword}
//           onChange={(e) => setUPassword(e.target.value)}
//           required
//         /><br /><br />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

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
//         'https://ncapi.jainaindia.com/api/users/login?encryptionKey=TNCbe2bu5Zt9SwVdidyJOUY0IondnrhbPw4TR9W%2FsY%3D&encryptionIv=HdCz+tyRX%2FqQMJXjxRbxBQ%3D%3D',
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
//     <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
//       <h1>Login</h1>
//       {userExists && (
//         <div style={{ marginBottom: '1rem', color: 'gray' }}>
//           Already logged in. <button onClick={handleSwitchUser}>Switch User</button>
//         </div>
//       )}
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//           required
//         /><br /><br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={uPassword}
//           onChange={(e) => setUPassword(e.target.value)}
//           required
//         /><br /><br />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './login.css'; // Make sure this path matches where your CSS file lives

export default function LoginPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [uPassword, setUPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUserExists(true);
      router.push('/dashboard');
    }
  }, []);

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

  const handleSwitchUser = () => {
    localStorage.removeItem('userData');
    setUserExists(false);
    setUserName('');
    setUPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/crmLogo.png" alt="Security Illustration" />
      </div>
      <div className="login-right">
        <div className="login-box">
          <div className="avatar" />
          <h2>WELCOME</h2>
          {userExists && (
            <div className="switch-user">
              Already logged in. <button onClick={handleSwitchUser}>Switch User</button>
            </div>
          )}
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
    </div>
  );
}
