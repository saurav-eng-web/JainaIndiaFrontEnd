// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'https://ncapi.jainaindia.com/api/',
// });

// // Request interceptor to attach token
// axiosInstance.interceptors.request.use((config) => {
//   const userData = localStorage.getItem('userData');
//   if (userData) {
//     const { token } = JSON.parse(userData);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response?.status === 401) {
//         localStorage.removeItem('userData');
//         window.location.href = '/login';
//       }
//       return Promise.reject(error);
//     }
//   );

// export default axiosInstance;


// axiosInstance.js
import axios from 'axios';  
import { logout } from '@/redux/slices/authSlice';
import { store } from '@/redux/store';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log("🟡base url axios: ",BASE_URL)

const axiosInstance = axios.create({
  baseURL: BASE_URL,

});

// Attach token in requests
axiosInstance.interceptors.request.use((config) => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    const { token } = JSON.parse(userData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle expired/invalid token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 1️⃣ clear Redux + localStorage
      store.dispatch(logout());

      // 2️⃣ redirect user to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
