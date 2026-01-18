// Frontend/scripts/config.js
export const API_CONFIG = {
  // Change this when deploying. For local dev, backend is usually on 5000.
  baseUrl: "http://127.0.0.1:5000",

  endpoints: {
    bundle: "/api/bundle",
    login: "/api/login",
  },
};
