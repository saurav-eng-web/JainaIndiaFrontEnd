// axiosInstance.js
import axios from "axios";

import { logout } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { logger } from "@/utils/logger";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Mask sensitive values before logging
function maskSensitive(data) {
  if (!data) return data;

  try {
    const obj = typeof data === "string" ? JSON.parse(data) : { ...data };

    const fields = ["password", "pass", "token", "otp"];
    for (const key of fields) {
      if (obj[key]) obj[key] = "***masked***";
    }

    return obj;
  } catch {
    return data; // if parsing fails, return raw
  }
}

// Attach token to requests
axiosInstance.interceptors.request.use((config) => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    const parsed = JSON.parse(userData);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

let isRedirecting = false;

// Handle API errors + log them
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const config = error.config || {};

    const safeParams = config.params || {};

    // Send error log to Loki
    logger.error(`API Request Failed on ${config.url}`, "api error", {
      method: config.method,
      status: error.response?.status,
      errorMessage: error.message,
      payload: config.data,
      params: safeParams,
    });

    // Handle redirect on auth/network error
    const isNetworkError = error.code === "ERR_NETWORK";
    const status = error.response?.status;
    const shouldLogout = isNetworkError || status === 401 || status === 403;

    if (shouldLogout && !isRedirecting) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        if (currentPath !== "/login") {
          isRedirecting = true;
          store.dispatch(logout());
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from "axios";

// import { logout } from "@/redux/slices/authSlice";
// import { store } from "@/redux/store";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
// });

// // Attach token in requests
// axiosInstance.interceptors.request.use((config) => {
//   const userData = localStorage.getItem("userData");
//   if (userData) {
//     const { token } = JSON.parse(userData);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

// let isRedirecting = false;

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log("error:", error);

//     const isNetworkError = error.code === "ERR_NETWORK";

//     const status = error.response?.status;

//     const shouldLogout = isNetworkError || status === 401 || status === 403;

//     if (shouldLogout && !isRedirecting) {
//       if (typeof window !== "undefined") {
//         const currentPath = window.location.pathname;

//         if (currentPath !== "/login") {
//           isRedirecting = true;

//           store.dispatch(logout());

//           window.location.href = "/login";
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
