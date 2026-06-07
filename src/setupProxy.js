const { createProxyMiddleware } = require("http-proxy-middleware");

const PROXY_TIMEOUT_MS = 300000;

const SKELETIX_API =
  process.env.REACT_APP_API_BASE_URL || "http://skeletix.runasp.net";

const CHATBOT_API =
  process.env.REACT_APP_CHATBOT_API_URL || "https://medical-chatbot-backend-production-e684.up.railway.app";

const FLASK_API =
  process.env.REACT_APP_FLASK_API_URL || "http://127.0.0.1:5000";

module.exports = function setupProxy(app) {
  // Railway Python Chatbot Backend (production/local)
  app.use(
    "/chatbot",
    createProxyMiddleware({
      target: CHATBOT_API,
      changeOrigin: true,
      timeout: PROXY_TIMEOUT_MS,
      proxyTimeout: PROXY_TIMEOUT_MS,
      pathRewrite: {
        "^/chatbot": "",
      },
      onError(err, req, res) {
        console.error("[proxy:chatbot]", req.method, req.url, err.code || err.message);
        if (!res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Chatbot server is not reachable. Check your connection.",
            })
          );
        }
      },
    })
  );

  // Legacy Flask chatbot (local)
  app.use(
    "/chat",
    createProxyMiddleware({
      target: FLASK_API,
      changeOrigin: true,
      timeout: PROXY_TIMEOUT_MS,
      proxyTimeout: PROXY_TIMEOUT_MS,
      onError(err, req, res) {
        console.error("[proxy:flask]", req.method, req.url, err.code || err.message);
        if (!res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              reply: "Flask chat server is not reachable. Start it with: python backend/app.py",
            })
          );
        }
      },
    })
  );

  app.use(
    "/health",
    createProxyMiddleware({
      target: CHATBOT_API,
      changeOrigin: true,
    })
  );

  // Skeletix ASP.NET API (remote)
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
