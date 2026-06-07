/**
 * Skeletix ASP.NET Core API (auth, upload, reports, dashboard)
 * In development, CRA proxies /api -> REACT_APP_API_BASE_URL via setupProxy.js
 */
export const getSkeletixApiBaseUrl = () =>
  process.env.REACT_APP_API_BASE_URL || "";

/**
 * Flask + Gemini chat API (POST /chat only)
 * In development, CRA proxies /chat -> REACT_APP_FLASK_API_URL via setupProxy.js
 */
export const getFlaskApiBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? ""
    : process.env.REACT_APP_FLASK_API_URL || "http://localhost:5000";

export const FLASK_CHAT_ENDPOINT = "/chat";
export const FLASK_HEALTH_ENDPOINT = "/health";
