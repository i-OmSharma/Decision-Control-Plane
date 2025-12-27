/**
 * ============================================================================
 * METRICS MODULE - Prometheus-compatible metrics for monitoring
 * ============================================================================
 * 
 * Design Decisions:
 * 1. Using prom-client for Prometheus compatibility
 * 2. Histogram for latency (better than gauge for percentiles)
 * 3. Counters for decision outcomes (for rate calculations)
 * 4. Labels for dimensional analysis (outcome, rule_id, ai_used)
 * 5. Default buckets optimized for API latency (ms range)
 * 
 * Key Metrics for MLOps-style monitoring:
 * - Request latency distribution
 * - Decision outcome distribution  
 * - AI invocation rate
 * - Error rate
 * - Rule hit distribution
 * ============================================================================
 */

import client from 'prom-client';

// Create a registry for all metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({ register, prefix: 'decision_platform_' });

// ============================================================================
// CUSTOM METRICS
// ============================================================================

/**
 * Request duration histogram
 * Tracks how long /decide requests take
 * Labels: outcome, ai_used, version
 */
export const requestDuration = new client.Histogram({
  name: 'decision_platform_request_duration_ms',
  help: 'Duration of decision requests in milliseconds',
  labelNames: ['outcome', 'ai_used', 'version'],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  registers: [register]
});

/**
 * Decision outcome counter
 * Tracks distribution of decisions
 * Labels: outcome, source (RULE, AI_RECOMMENDED, etc.)
 */
export const decisionCounter = new client.Counter({
  name: 'decision_platform_decisions_total',
  help: 'Total number of decisions made',
  labelNames: ['outcome', 'source', 'version'],
  registers: [register]
});

/**
 * Rule evaluation counter
 * Tracks which rules are being hit
 * Labels: rule_id, matched (true/false)
 */
export const ruleEvaluationCounter = new client.Counter({
  name: 'decision_platform_rule_evaluations_total',
  help: 'Total number of rule evaluations',
  labelNames: ['rule_id', 'matched'],
  registers: [register]
});

/**
 * AI invocation counter
 * Tracks AI analyzer usage
 * Labels: success, provider
 */
export const aiInvocationCounter = new client.Counter({
  name: 'decision_platform_ai_invocations_total',
  help: 'Total number of AI analyzer invocations',
  labelNames: ['success', 'provider'],
  registers: [register]
});

/**
 * AI latency histogram
 * Tracks AI analysis duration separately
 */
export const aiLatency = new client.Histogram({
  name: 'decision_platform_ai_latency_ms',
  help: 'Duration of AI analysis in milliseconds',
  labelNames: ['provider', 'success'],
  buckets: [100, 250, 500, 1000, 2000, 3000, 5000, 10000],
  registers: [register]
});

/**
 * Error counter
 * Tracks errors by type
 */
export const errorCounter = new client.Counter({
  name: 'decision_platform_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'endpoint'],
  registers: [register]
});

/**
 * Grey zone rate gauge
 * Tracks percentage of requests falling into grey zone
 * Useful for alerting if too many requests need AI review
 */
export const greyZoneRateGauge = new client.Gauge({
  name: 'decision_platform_grey_zone_rate',
  help: 'Current rate of grey zone decisions (rolling window)',
  registers: [register]
});

/**
 * Active requests gauge
 * Tracks concurrent request processing
 */
export const activeRequests = new client.Gauge({
  name: 'decision_platform_active_requests',
  help: 'Number of requests currently being processed',
  registers: [register]
});

/**
 * Rule engine info gauge
 * Exposes version and configuration as labels
 */
export const engineInfo = new client.Gauge({
  name: 'decision_platform_engine_info',
  help: 'Information about the decision engine',
  labelNames: ['version', 'rules_count', 'ai_enabled'],
  registers: [register]
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Record a complete decision with all relevant metrics
 */
export function recordDecision(params) {
  const {
    outcome,
    source,
    version,
    aiUsed,
    durationMs,
    evaluationPath,
    matchedRuleId
  } = params;

  // Record request duration
  requestDuration.observe(
    { outcome, ai_used: String(aiUsed), version },
    durationMs
  );

  // Increment decision counter
  decisionCounter.inc({ outcome, source, version });

  // Record rule evaluations
  if (evaluationPath) {
    evaluationPath.forEach(evaluation => {
      ruleEvaluationCounter.inc({
        rule_id: evaluation.ruleId,
        matched: String(evaluation.matched)
      });
    });
  }
}

/**
 * Record AI invocation metrics
 */
export function recordAIInvocation(params) {
  const { success, provider, durationMs } = params;

  aiInvocationCounter.inc({ success: String(success), provider });
  
  if (durationMs) {
    aiLatency.observe({ provider, success: String(success) }, durationMs);
  }
}

/**
 * Record an error
 */
export function recordError(type, endpoint) {
  errorCounter.inc({ type, endpoint });
}

/**
 * Update engine info (call on startup and config reload)
 */
export function updateEngineInfo(version, rulesCount, aiEnabled) {
  // Reset to avoid stale labels
  engineInfo.reset();
  engineInfo.set(
    { version, rules_count: String(rulesCount), ai_enabled: String(aiEnabled) },
    1
  );
}

/**
 * Get metrics in Prometheus format
 */
export async function getMetrics() {
  return await register.metrics();
}

/**
 * Get content type for metrics endpoint
 */
export function getContentType() {
  return register.contentType;
}

/**
 * Export the registry for testing
 */
export { register };
