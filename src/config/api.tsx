const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API base URL is not configured");
}

export { API_BASE_URL };