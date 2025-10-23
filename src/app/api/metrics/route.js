import client from "prom-client";

// Create a Registry
const register = new client.Registry();

// Collect default metrics
client.collectDefaultMetrics({ register });

// Example counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});
register.registerMetric(httpRequestCounter);

export async function GET(req) {
  // Increment the counter for metrics requests (optional)
  httpRequestCounter.inc({
    method: "GET",
    route: "/api/metrics",
    status: "200",
  });

  return new Response(await register.metrics(), {
    status: 200,
    headers: {
      "Content-Type": register.contentType,
    },
  });
}
