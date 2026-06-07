import axios from "axios";
import {
  getChatbotApiBaseUrl,
  CHATBOT_CHAT_ENDPOINT,
} from "../config/apiConfig";

const API_BASE_URL = getChatbotApiBaseUrl();
const DEFAULT_TIMEOUT_MS = 120000;

const chatbotClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

const getErrorMessage = (error) => {
  const status = error.response?.status;
  const serverMessage =
    error.response?.data?.reply ||
    error.response?.data?.message ||
    error.response?.data?.error;

  if (status === 504 || error.code === "ECONNABORTED") {
    return "The chatbot took too long to respond. Please try again.";
  }

  if (status === 502 || status === 503) {
    return "Chatbot service is temporarily unavailable. Please try again shortly.";
  }

  if (error.message === "Network Error" || !error.response) {
    return "Cannot reach the chatbot server. Check your connection and try again.";
  }

  return serverMessage || error.message || "Unable to get a response from the assistant.";
};

chatbotClient.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject({
      status: error.response?.status,
      message: getErrorMessage(error),
      code: error.code,
      data: error.response?.data,
      originalError: error,
    })
);

export const sendMessage = async (payload) => {
  const response = await chatbotClient.post(CHATBOT_CHAT_ENDPOINT, payload);
  return response.data;
};

export default chatbotClient;
export { API_BASE_URL, DEFAULT_TIMEOUT_MS };
