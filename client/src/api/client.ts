// src/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // DRF server
  withCredentials: true,            // send cookies (for session auth)
});

// export default api;
