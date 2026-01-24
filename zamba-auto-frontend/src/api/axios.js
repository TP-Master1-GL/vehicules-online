// src/api/axios.js
import axios from 'axios';

// Configuration de base de l'instance axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajustez selon votre configuration backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour les cookies/sessions
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
);

export default api;