import axios from "axios";

const api = axios.create({
  baseURL:
    "https://dzhn62mxyewzl4dir2b7ijoqli0pxour.lambda-url.us-east-1.on.aws",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
