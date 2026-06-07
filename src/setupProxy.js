const { createProxyMiddleware } = require("http-proxy-middleware");

const PROXY_TIMEOUT_MS = 300000;

const SKELETIX_API =
  process.env.REACT_APP_API_BASE_URL || "http://skeletix.runasp.net";

const CHATBOT_API = (
  process.env.REACT_APP_CHATBOT_URL ||
  process.env.REACT_APP_CHATBOT_API_URL ||
  "https://medical-chatbot-backend-production-e684.up.railway.app"
).replace(/\/$/, "");

module.exports = function setupProxy(app) {
  // Railway chatbot — POST /chat
  app.use(
    "/chat",
    createProxyMiddleware({
      target: CHATBOT_API,
      changeOrigin: true,
      timeout: PROXY_TIMEOUT_MS,
      proxyTimeout: PROXY_TIMEOUT_MS,
      onError(err, req, res) {
        console.error("[proxy:chatbot]", req.method, req.url, err.code || err.message);
        if (!res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              reply: "Chatbot server is unavailable. Please try again later.",
            })
          );
        }
      },
    })
  );

  // Skeletix ASP.NET API
  app.use(
    "/api",
    createProxyMiddleware({
      target: SKELETIX_API,
      changeOrigin: true,
      timeout: PROXY_TIMEOUT_MS,
      proxyTimeout: PROXY_TIMEOUT_MS,
      onError(err, req, res) {
        console.error("[proxy:api]", req.method, req.url, err.code || err.message);
        if (!res.headersSent) {
          res.writeHead(504, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message:
                "Gateway timeout — the backend took too long. Please try again.",
            })
          );
        }
      },
    })
  );
};
