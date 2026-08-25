import { getRouteApi, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const route = getRouteApi("/verify-email");
const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

type Status = "checking" | "verified" | "invalid";

export function VerifyEmailPage() {
  const { token } = route.useSearch();
  const [status, setStatus] = useState<Status>("checking");
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch(`${API_URL}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => setStatus(res.ok ? "verified" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, [token]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <section className="mx-auto max-w-xl px-4 py-16 sm:px-5 sm:py-24">
          <p className="eyebrow">Email confirmation</p>

          {status === "checking" && (
            <>
              <h1 className="mt-6 font-display text-3xl font-normal italic leading-snug tracking-tight sm:text-4xl">
                Confirming your email
              </h1>
              <p className="mt-6 text-sm text-muted-foreground">One moment…</p>
            </>
          )}

          {status === "invalid" && (
            <>
              <h1 className="mt-6 font-display text-3xl font-normal italic leading-snug tracking-tight sm:text-4xl">
                Link expired
              </h1>
              <p className="mt-6 text-sm text-muted-foreground">
                This confirmation link is invalid or has expired. Sign in and request a new one from the
                sign-in page.
              </p>
              <Link
                to="/purchase"
                className="mt-8 inline-flex items-center justify-center rounded-md px-8 py-4 text-sm uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                Go to sign in
              </Link>
            </>
          )}

          {status === "verified" && (
            <>
              <h1 className="mt-6 font-display text-3xl font-normal italic leading-snug tracking-tight sm:text-4xl">
                Email confirmed
              </h1>
              <p className="mt-6 text-sm text-muted-foreground">Your email is confirmed — you can sign in now.</p>
              <Link
                to="/purchase"
                className="mt-8 inline-flex items-center justify-center rounded-md px-8 py-4 text-sm uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                Go to sign in
              </Link>
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
