import axios from "axios";

import { API_BASE_URL } from "./config"  // ← change this line
// Client-only axios instance (reads localStorage), used for authenticated
// browser requests like the wishlist. The server-side hotel listing fetch
// in lib/api.ts stays on native `fetch` since it needs Next's
// `next: { revalidate }` caching, which axios doesn't support.
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Attach token automatically, same as the old project.
httpClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default httpClient;
