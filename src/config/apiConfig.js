/**
 * Skeletix ASP.NET Core API (auth, upload, reports, dashboard)
 * In development, CRA proxies /api -> REACT_APP_API_BASE_URL via setupProxy.js
 */
export const getSkeletixApiBaseUrl = () =>
  process.env.REACT_APP_API_BASE_URL || "";

/**
 * Railway Python (Gunicorn) Chatbot Backend
 * Production: https://medical-chatbot-backend-production-e684.up.railway.app/
 * In development, CRA proxies /chatbot -> REACT_APP_CHATBOT_API_URL via setupProxy.js
 */
export const getChatbotApiBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? ""
    : process.env.REACT_APP_CHATBOT_API_URL || "https://medical-chatbot-backend-production-e684.up.railway.app";

export const CHATBOT_CHAT_ENDPOINT = "/chat";
export const CHATBOT_HEALTH_ENDPOINT = "/health";

/**
 * Legacy Flask + Gemini chat API (POST /chat only)
 * In development, CRA proxies /chat -> REACT_APP_FLASK_API_URL via setupProxy.js
 * @deprecated Use getChatbotApiBaseUrl instead
 */
export const getFlaskApiBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? ""
    : process.env.REACT_APP_FLASK_API_URL || "http://localhost:5000";

export const FLASK_CHAT_ENDPOINT = "/chat";
export const FLASK_HEALTH_ENDPOINT = "/health";
