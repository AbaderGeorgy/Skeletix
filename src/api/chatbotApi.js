import axios from "axios";
import { getChatbotApiBaseUrl, CHATBOT_CHAT_ENDPOINT, CHATBOT_HEALTH_ENDPOINT } from "../config/apiConfig";

const API_BASE_URL = getChatbotApiBaseUrl();
const DEFAULT_TIMEOUT_MS = 120000;

const chatbotClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add API key header if available (for authentication)
chatbotClient.interceptors.request.use(
  (config) => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (apiKey) {
      config.headers["X-API-Key"] = apiKey;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getErrorMessage = (error) => {
  const status = error.response?.status;
  const serverMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.response?.data?.detail;

  if (status === 504 || error.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }

  if (status === 502 || status === 503) {
    return "The server is temporarily unavailable. Please try again in a few seconds.";
  }

  if (error.message === "Network Error" || !error.response) {
    return "Could not reach the server. Check your connection and try again.";
  }

  return serverMessage || error.message || "An unexpected error occurred";
};

chatbotClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = getErrorMessage(error);

    return Promise.reject({
      status,
      message,
      code: error.code,
      data: error.response?.data,
      originalError: error,
    });
  }
);

/**
 * Send a message to the chatbot
 * @param {Object} payload - Message payload
 * @param {string} payload.message - User message
 * @param {string} [payload.session_id] - Session ID for conversation context
 * @returns {Promise<Object>} Response with bot reply
 */
export const sendMessage = async (payload) => {
  try {
    const response = await chatbotClient.post(CHATBOT_CHAT_ENDPOINT, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if the chatbot backend is healthy
 * @returns {Promise<Object>} Health check response
 */
export const checkHealth = async () => {
  try {
    const response = await chatbotClient.get(CHATBOT_HEALTH_ENDPOINT);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retry wrapper for API calls
 * @param {Function} requestFn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.retries - Number of retries (default: 2)
 * @param {number} options.delayMs - Delay between retries in ms (default: 2000)
 * @returns {Promise<any>} Result of the request
 */
export const withRetry = async (requestFn, { retries = 2, delayMs = 2000 } = {}) => {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFn();
    } catch (err) {
      lastError = err;
      const retryable =
        !err.status ||
        err.status === 504 ||
        err.status === 502 ||
        err.status === 503 ||
        err.code === "ECONNABORTED" ||
        err.message === "Network Error";

      if (!retryable || attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
  throw lastError;
};

export default chatbotClient;
export { API_BASE_URL, DEFAULT_TIMEOUT_MS };
