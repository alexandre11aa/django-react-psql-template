// src/services/api.ts

import axios from 'axios';
import notify from "../services/notificationService";
// import { navigateTo } from '../utils/navigate';
import type { AxiosResponse, AxiosError } from "axios";

let VITE_SYSTEM_API_URL;

if (import.meta.env.MODE == "production") {
  VITE_SYSTEM_API_URL = import.meta.env.VITE_SYSTEM_API_URL_PRODUCTION
} else {
  VITE_SYSTEM_API_URL = import.meta.env.VITE_SYSTEM_API_URL_DEVELOPMENT
}

const API_URL = VITE_SYSTEM_API_URL;

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
  return null;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    "X-CSRFToken": getCookie("csrftoken"),
  },
});

// Interceptor de response → tenta renovar o token automaticamente se expirar
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest || !originalRequest.url) {
      return Promise.reject(error);
    }

    // Ignorar se a requisição for logout ou refresh
    if (
        originalRequest.url.includes('auth/logout') || 
        originalRequest.url.includes('auth/refresh') // ||
        // window.location.pathname === '/login' // ProtectedRouter e PublicRoutes já resolvem!
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      try {
        await api.post('auth/refresh/', {}, { withCredentials: true });
        return api.request(originalRequest);
      } catch (refreshError) {
        if (localStorage.getItem("user")) { 
          localStorage.clear();
          notify.error('Sessão expirada. Faça login novamente.'); 
        }
        // navigateTo('/login'); // ProtectedRouter e PublicRoutes já resolvem!
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
