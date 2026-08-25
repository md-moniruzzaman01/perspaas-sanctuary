import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const route = getRouteApi("/reset-password");
const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

type Status = "checking" | "ready" | "invalid";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = route.useSearch();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus(token ? "ready" : "invalid");
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!token) {
      setStatus("invalid");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not reset your password.");
      navigate({ to: "/purchase" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <section className="mx-auto max-w-xl px-4 py-16 sm:px-5 sm:py-24">
          <p className="eyebrow">Reset password</p>

          {status === "checking" && (
            <>
              <h1 className="mt-6 font-display text-3xl font-normal italic leading-snug tracking-tight sm:text-4xl">
                Reset your password
              </h1>
              <p className="mt-6 text-sm text-muted-foreground">Verifying your reset link…</p>
            </>
          )}

          {status === "invalid" && (
            <>
              <h1 className="mt-6 font-display text-3xl font-normal italic leading-snug tracking-tight sm:text-4xl">
                Link expired
              </h1>
              <p className="mt-6 text-sm text-muted-foreground">
                This reset link is invalid or has expired. Request a new one to continue.
              </p>
              <Link
                to="/forgot-password"
                className="mt-8 inline-flex items-center justify-center rounded-md px-8 py-4 text-sm uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                Request a new link
              </Link>
            </>
          )}

          {status === "ready" && (
            <>
              <h1 className="mt-6 font-display text-3xl font-normal italic leading-snug tracking-tight sm:text-4xl">
                Choose a new password
              </h1>
              <div className="panel-surface mt-10 rounded-md p-6 sm:p-8">
                <form className="space-y-4" onSubmit={submit}>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    autoFocus
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {error && (
                    <p className="rounded-md border border-destructive/40 px-4 py-3 text-sm text-destructive">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-md px-6 py-3.5 text-sm uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110 disabled:opacity-50"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  >
                    {saving ? "Updating…" : "Update password"}
                  </button>
                </form>
              </div>
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
