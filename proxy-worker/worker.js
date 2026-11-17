/**
 * Cloudflare Worker Proxy for Google Gemini Interactions API (v1beta)
 * Securely proxies requests from allowed origins to generativelanguage.googleapis.com
 */

// Keep: Allowed origins check
const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/([a-z0-9-]+\.)*netlify\.app$/,
  /^https:\/\/([a-z0-9-]+\.)*pages\.dev$/,
  /^https:\/\/([a-z0-9-]+\.)*alexanders\.[a-z]+$/,
];

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com";

// Change: Retry only on 429 and 503; dropped 524
const RETRY_STATUSES = [429, 503];

// Keep: CORS headers configuration
const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin",
};

// Keep: Origin validation
function getCorsOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return "*";
  return ALLOWED_ORIGIN_PATTERNS.some((p) => p.test(origin)) ? origin : null;
}

// Keep: CORS response helper
function corsResponse(origin, body, status, extraHeaders = {}) {
  return new Response(body, {
    status,
    headers: {
      ...extraHeaders,
      ...CORS_HEADERS,
      "Access-Control-Allow-Origin": origin,
    },
  });
}

// Keep: JSON response helper
function jsonResponse(origin, obj, status) {
  return corsResponse(origin, JSON.stringify(obj), status, {
    "Content-Type": "application/json",
  });
}

export default {
  async fetch(request, env) {
    const origin = getCorsOrigin(request);

    // Keep: Reject unapproved origins with 403
    if (origin === null) {
      return new Response("Forbidden: Origin not allowed", { status: 403 });
    }

    // Keep: Handle CORS preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return corsResponse(origin, null, 204);
    }

    // Keep: Allow only GET and POST methods
    if (request.method !== "GET" && request.method !== "POST") {
      return corsResponse(origin, "Method Not Allowed", 405);
    }

    // Keep: Secret Gemini API key from environment variable
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return jsonResponse(origin, { error: "API key not configured" }, 500);
    }

    // Keep: Path filter for /v1beta/
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/v1beta/")) {
      return jsonResponse(origin, { error: "Not found. Use /v1beta/..." }, 404);
    }

    const upstreamUrl = `${GEMINI_API_BASE}${url.pathname}${url.search}`;
    const requestBody = request.method === "POST" ? await request.text() : undefined;

    // Change: Set fetch timeout to 10000 ms (was 20000 ms) and keep x-goog-api-key header
    const buildOptions = () => ({
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey, // Keep: x-goog-api-key header
      },
      body: requestBody,
      signal: AbortSignal.timeout(10000), // Change: 10000 ms fetch timeout
    });

    let upstreamRes = null;
    let lastError = null;

    // Change: Log elapsed time per request with console.log
    const requestStartTime = Date.now();

    // Change: Cut retries from 3 to 2
    for (let i = 0; i < 2; i++) {
      const attemptStartTime = Date.now();
      try {
        upstreamRes = await fetch(upstreamUrl, buildOptions());
        // Change: Log elapsed time for this attempt
        console.log(`[Worker] Upstream attempt ${i + 1} took ${Date.now() - attemptStartTime}ms, status: ${upstreamRes.status}`);

        // Change: Retry only on 429 and 503 (drop 524)
        if (!RETRY_STATUSES.includes(upstreamRes.status)) break;
      } catch (err) {
        upstreamRes = null;
        lastError = err;
        console.log(`[Worker] Upstream attempt ${i + 1} failed after ${Date.now() - attemptStartTime}ms: ${err.message}`);
      }

      // Delay before retry 2 (only needed if first attempt failed)
      if (i < 1) await new Promise((r) => setTimeout(r, 1000));
    }

    // Change: Log total elapsed time for the full proxy request
    const totalElapsed = Date.now() - requestStartTime;
    console.log(`[Worker] Total request elapsed time: ${totalElapsed}ms`);

    if (!upstreamRes) {
      return jsonResponse(
        origin,
        { error: "Gemini timeout", message: lastError ? lastError.message : "" },
        504
      );
    }

    const responseBody = await upstreamRes.text();

    console.log("Gemini status:", upstreamRes.status);
    if (!upstreamRes.ok) console.log("Gemini error:", responseBody);

    return corsResponse(origin, responseBody, upstreamRes.status, {
      "Content-Type": "application/json",
    });
  },
};
