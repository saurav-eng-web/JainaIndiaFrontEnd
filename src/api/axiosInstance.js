import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ncapi.jainaindia.com/api/',
});

// Request interceptor to attach token
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
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;
