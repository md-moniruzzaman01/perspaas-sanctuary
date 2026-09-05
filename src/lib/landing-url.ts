// The PersPaaS ecosystem landing page that every product links back to.
//
// Always a cross-origin URL in production (the products are subdomains, the
// landing page is the apex), so it must be rendered as a plain <a href> —
// a TanStack Router <Link> would try to resolve it as an in-app route.
export const LANDING_URL = (
  import.meta.env["VITE_LANDING_URL"] ?? "https://perspaas.com"
).replace(/\/+$/, "");
