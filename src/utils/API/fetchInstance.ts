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

type ErrorProps = { [key: string]: any } & { [key: string]: any }[]
export const parseError = (error: ErrorProps) => {
     if (Array.isArray(error)) {
          if (error.length >= 1) {
               const [first] = error;
               return {
                    message: first?.errorMessage ?? first?.error,
                    status: first?.statusCode ?? first?.status
               }
          }
     }
     return {
          message: error?.errorMessage ?? error?.error,
          status: error?.statusCode ?? error?.status
     }
}

export default axiosInstance;
