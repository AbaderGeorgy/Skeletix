import axios from "axios";
import { getSkeletixApiBaseUrl } from "../config/apiConfig";

const API_BASE_URL = getSkeletixApiBaseUrl();
const DEFAULT_TIMEOUT_MS = 120000;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

const getErrorMessage = (error) => {
  const status = error.response?.status;
  const serverMessage =
    error.response?.data?.message ||
    error.response?.data?.title;

  if (status === 504 || error.code === "ECONNABORTED") {
    return "The server took too long to respond. This can happen while AI analysis is running — please wait a moment and try again.";
  }

  if (status === 502 || status === 503) {
    return "The server is temporarily unavailable. Please try again in a few seconds.";
  }

  if (error.message === "Network Error" || !error.response) {
    return "Could not reach the server. Check your connection and try again.";
  }

  return serverMessage || error.message || "An unexpected error occurred";
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = getErrorMessage(error);

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (
        window.location.pathname !== "/" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/";
      }
    }

    return Promise.reject({
      status,
      message,
      code: error.code,
      data: error.response?.data,
      originalError: error,
    });
  }
);

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

export default axiosClient;
export { API_BASE_URL, DEFAULT_TIMEOUT_MS };
