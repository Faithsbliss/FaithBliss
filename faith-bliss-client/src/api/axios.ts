import axios from "axios";
import { getAuth } from "firebase/auth";

// VITE_API_URL is the backend origin (no `/api`); we append `/api` here so
// callers can reference resource paths like `/stories` cleanly.
const baseURL = `${import.meta.env.VITE_API_URL || ""}/api`;

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach the Firebase ID token to every outgoing request. Without this the
// backend `protect` middleware rejects the call with 401 (the previous
// instance shipped no Authorization header at all, which broke /api/stories
// in particular).
apiClient.interceptors.request.use(async (config) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Failed to attach Firebase ID token to request:", err);
  }
  return config;
});

export default apiClient;
