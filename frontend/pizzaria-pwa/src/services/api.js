import axios from 'axios';
import { URL_BASE_API } from '../utils/constantes';

const api = axios.create({
  baseURL: URL_BASE_API,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (erro) => Promise.reject(erro)
);

export default api;
