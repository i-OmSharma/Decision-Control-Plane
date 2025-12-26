export function awarenessMiddleware(isShuttingDown) {
  return function (req, res, next) {
    if (isShuttingDown() && req.path !== "/health") {
      return res.status(503).json({
        error: "Service shutting down",
        retryAfter: 5,
      });
    }
    next();
  };
}


