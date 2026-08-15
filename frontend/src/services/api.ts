import axios from "axios";

// Environment variable VITE_API_URL takes precedence in production deployment.
// Defaults to http://localhost:${port}/api/v1 for local development.
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL.replace(/\/$/, "");
    return url.endsWith("/api/v1") ? url : `${url}/api/v1`;
  }
  const port = import.meta.env.VITE_PORT || 8000;
  return `http://localhost:${port}/api/v1`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
