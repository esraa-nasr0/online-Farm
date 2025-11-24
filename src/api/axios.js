import axios from "axios";
import { getToken } from "../utils/authToken";

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: "https://api.mazraaonline.com/api",
});

// Add request interceptor to include token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

