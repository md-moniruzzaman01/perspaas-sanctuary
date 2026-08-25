import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, app: "sanctuary" }),
      });
      if (!res.ok) throw new Error("Could not send the reset link.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <section className="mx-auto max-w-xl px-4 py-16 sm:px-5 sm:py-24">
          <p className="eyebrow">Forgot password</p>
          <h1 className="mt-6 font-display text-3xl font-normal italic leading-snug tracking-tight sm:text-4xl">
            Reset your password
          </h1>

          {sent ? (
            <p className="mt-6 rounded-md border border-primary/40 bg-primary/5 px-5 py-4 text-sm text-foreground">
              If an account exists for that email, a reset link is on its way. Check your inbox.
            </p>
          ) : (
            <div className="panel-surface mt-10 rounded-md p-6 sm:p-8">
              <p className="text-sm text-muted-foreground">
                Enter the email on your account and we'll send you a link to reset your password.
              </p>
              <form className="mt-6 space-y-4" onSubmit={submit}>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  autoFocus
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                {error && (
                  <p className="rounded-md border border-destructive/40 px-4 py-3 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-md px-6 py-3.5 text-sm uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110 disabled:opacity-50"
                  style={{ backgroundImage: "var(--gradient-gold)" }}
                >
                  {busy ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
