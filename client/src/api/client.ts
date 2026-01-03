// src/api/client.ts
import axios from "axios";

// Detect if running in Capacitor (mobile app) or web
const isCapacitor = typeof (window as unknown as { Capacitor?: unknown }).Capacitor !== 'undefined';
const isMobile = isCapacitor || window.location.protocol === 'capacitor:';

// In mobile app, use full production URL; in web, use relative URLs (handled by proxy/same-origin)
const API_BASE_URL = isMobile 
  ? 'https://finance.mstatilitechnologies.com'
  : '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send cookies (for session auth)
  xsrfCookieName: "csrftoken", // Django default cookie name
  xsrfHeaderName: "X-CSRFToken", // header Django expects
});

// Centralized error normalization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error?.response?.data;
    const message =
      payload?.detail || payload?.message || (payload && JSON.stringify(payload)) || error.message;
    return Promise.reject({ status: error?.response?.status, message, payload });
  }
);

// export default api;
