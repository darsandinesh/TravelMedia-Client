import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:32000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling token refresh
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
        
        const response = await axios.post('http://localhost:4000/refresh-token', { refreshToken });
        
        console.log(response,'response in refresh token ')

        
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('userToken', newAccessToken);
        

        axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        

        return axiosInstance(originalRequest);
      } catch (refreshError) {

        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';  
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
