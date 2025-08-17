import axios from 'axios';

const BASE = 'https://naya-backend-8afj.onrender.com';

const API = axios.create({
  baseURL: BASE,
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
