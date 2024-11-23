import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_FRONTEN_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {

        const refreshToken = localStorage.getItem('refreshToken');
        
        const response = await axios.post(`${import.meta.env.VITE_FRONTEN_URL}/refresh-token`, { refreshToken });
        
        console.log(response,'response in refresh token ')

        
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('adminToken', newAccessToken);
        

        axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        

        return axiosInstance(originalRequest);
      } catch (refreshError) {

        localStorage.removeItem('adminToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin';  
      }
    }
    
    return Promise.reject(error);
  }
);


export default axiosInstance;
