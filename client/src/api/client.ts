// src/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // DRF server
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
