/**
 * CORS Middleware (Production-safe)
 * Explicit origin allowlist
 */

export function corsMiddleware(req, res, next) {
  const allowedOrigins = [
    "http://localhost:5173",        // frontend dev
    "http://127.0.0.1:5173",
    "http://decision.local",        // ingress (future)
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, X-Canary"
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
}
