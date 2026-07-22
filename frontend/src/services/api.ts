import axios from "axios";

const port = import.meta.env.VITE_PORT || 8000;

const api = axios.create({
  baseURL: `http://localhost:${port}/api/v1`,
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
