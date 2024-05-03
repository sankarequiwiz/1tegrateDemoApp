import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_ITEGRATE_BASE_URL,
      timeout: 5000, // Timeout in milliseconds
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
      function (config) {
            return config;
      },
      function (error) {
            return Promise.reject(error);
      }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
      function (response) {
            // Do something with successful response
            return response;
      },
      function (error) {
            // Do something with response error
            return Promise.reject(error);
      }
);

export default axiosInstance;
