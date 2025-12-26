import * as metrics from '../metrics/prometheus.js'

export function errorHandlerMiddleware(err, req, res, next) {
  console.error("Unhandled error:", err);
  metrics.recordError("unhandled_exception", req.path);

  res.status(500).json({
    error: "Internal Server Error",
    requestId: req.requestId,
  });
}
