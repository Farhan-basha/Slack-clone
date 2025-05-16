import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Django backend URL
  withCredentials: true,
});

// Add JWT token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          'http://localhost:8000/api/token/refresh/',
          { refresh: refreshToken }
        );
        
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return API(originalRequest);
      } catch (err) {
        console.error('Refresh token failed', err);
        // Redirect to login
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;