// Single entry point for every call to central-backend. Two reasons it exists:
//
//  1. One place defines the API base URL (VITE_API_URL, localhost in dev).
//  2. Every request carries `ngrok-skip-browser-warning`. When VITE_API_URL
//     points at an ngrok free tunnel (used so Stripe webhooks can reach a
//     local backend, and sometimes so the app can be opened from a phone),
//     ngrok otherwise intercepts browser-originated requests with an HTML
//     interstitial that has no CORS headers — the fetch then throws
//     "Failed to fetch" and callers silently treat it as "no data". That is
//     what made a paid Sanctuary license read as inactive on the purchase
//     page: the webhook had activated it, but the browser could never read
//     `/api/sanctuary/subscription` back. The header is ignored by any
//     non-ngrok host, so it is safe to send unconditionally.
export const API_URL =
  import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

// VITE_* values are inlined at build time, so a production bundle built without
// them silently points every request at the developer's own machine and the
// deployed site fails in a way that looks like the backend is down. Committed
// .env.production is what normally prevents that; this is the backstop for when
// it is missing or overridden. A warning rather than a throw on purpose — the
// marketing pages render fine without an API, and white-screening the whole
// site would turn a config slip into a worse outage than the one it reports.
if (import.meta.env.PROD && /localhost|127\.0\.0\.1/.test(API_URL)) {
  console.error(
    `[sanctuary] Built with VITE_API_URL="${API_URL}". This is a production ` +
      `bundle pointing at a local backend — sign-in, pricing, and checkout ` +
      `will all fail. Rebuild with VITE_API_URL set (see .env.production).`,
  );
}

export function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const headers = new Headers(init.headers);
  headers.set("ngrok-skip-browser-warning", "true");
  return fetch(url, { ...init, headers });
}
