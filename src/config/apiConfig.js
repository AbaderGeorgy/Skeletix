/**
 * Skeletix ASP.NET Core API (auth, upload, reports, dashboard)
 * In development, CRA proxies /api -> REACT_APP_API_BASE_URL via setupProxy.js
 */
export const getSkeletixApiBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? ""
    : process.env.REACT_APP_API_BASE_URL || "http://skeletix.runasp.net";

const RAILWAY_CHATBOT_DEFAULT =
  "https://medical-chatbot-backend-production-e684.up.railway.app";

/**
 * Railway Flask chatbot backend
 * REACT_APP_CHATBOT_URL is used in production builds.
 * In development, requests go through the /chat proxy (see setupProxy.js).
 */
export const getChatbotApiBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "";
  }
  return (
    process.env.REACT_APP_CHATBOT_URL ||
    process.env.REACT_APP_CHATBOT_API_URL ||
    RAILWAY_CHATBOT_DEFAULT
  ).replace(/\/$/, "");
};

export const CHATBOT_CHAT_ENDPOINT = "/chat";
