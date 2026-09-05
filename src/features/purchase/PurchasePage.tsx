import { getRouteApi, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import {
  type StoredAuth,
  signOutSanctuary,
  readSanctuaryAuth,
  refreshSanctuarySession,
  writeSanctuaryAuth,
} from "@/lib/sanctuary-auth";
import { apiFetch } from "@/lib/api";
import { useSanctuaryLifetimePrice } from "../pricing/pricing.api";

const route = getRouteApi("/purchase");

type SubscriptionView = {
  status: string;
  // The backend's own verdict, expiry included. Optional so a backend that
  // predates the field still parses; see licenseActive below for the fallback.
  active?: boolean;
  plan: string | null;
  currentPeriodEnd: string | null;
};

const inputClasses =
  "w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

function Field({
  label,
  htmlFor,
  optional,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="eyebrow">
          {label}
        </label>
        {optional && (
          <span className="text-[0.65rem] tracking-normal text-muted-foreground/60">
            optional
          </span>
        )}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function IconInput({
  icon: Icon,
  className,
  ...props
}: { icon: typeof User } & ComponentProps<"input">) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input {...props} className={cn(inputClasses, "pl-10", className)} />
    </div>
  );
}

// Mirrors Executive Edge's PasswordInput (src/components/ui/password-input.tsx):
// each instance owns its own show/hide state, so a login field and a confirm
// field never share visibility.
function PasswordField({
  id,
  autoComplete,
  placeholder,
  value,
  onChange,
  minLength,
  maxLength,
}: {
  id: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  maxLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Lock
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id={id}
        type={visible ? "text" : "password"}
        required
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClasses, "pl-10 pr-11")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

const includedItems = [
  "Full protocol library, available the moment your license activates",
  "Personal dashboard — streak, minutes recovered, sessions logged",
  "One-time payment — yours for life, no renewal",
];

export function PurchasePage() {
  const { checkout } = route.useSearch();
  const lifetimePrice = useSanctuaryLifetimePrice();
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionView | null>(
    null,
  );
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setAuth(readSanctuaryAuth());
  }, []);

  // With a session, load license state (re-checked after returning from
  // Stripe so a completed payment shows as active once the webhook lands).
  // On a 401, attempt one silent refresh-and-retry before giving up and
  // signing the visitor out — mirrors Executive Edge's apiFetch behavior.
  useEffect(() => {
    if (!auth) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Reads current license state; returns true once it is active/trialing
    // so the caller can stop polling.
    async function load(accessToken: string): Promise<boolean> {
      const res = await apiFetch("/api/sanctuary/subscription", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401) {
        const refreshed = await refreshSanctuarySession();
        if (!refreshed) {
          if (!cancelled) setAuth(null);
          return false;
        }
        if (!cancelled) setAuth(refreshed);
        return load(refreshed.accessToken);
      }
      if (!res.ok) return false;
      const data = (await res.json()) as { subscription?: SubscriptionView };
      if (cancelled || !data.subscription) return false;
      setSubscription(data.subscription);
      return (
        data.subscription.status === "active" ||
        data.subscription.status === "trialing"
      );
    }

    // Stripe confirms a one-time payment out of band via webhook, so right
    // after returning from checkout the license can take a second or two to
    // flip to active. Poll a few times before giving up rather than
    // stranding a paying visitor on "no active license" until they reload
    // the page by hand.
    let attempt = 0;
    const maxAttempts = checkout === "success" ? 8 : 1;

    async function run(accessToken: string) {
      attempt += 1;
      const active = await load(accessToken).catch(() => false);
      if (cancelled || active || attempt >= maxAttempts) return;
      timer = setTimeout(() => run(accessToken), 2500);
    }

    run(auth.accessToken);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [auth, checkout]);

  const resetFormFields = () => {
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setGender("");
    setLocation("");
  };

  const switchMode = (next: "login" | "signup") => {
    if (next === mode) return;
    setMode(next);
    setError(null);
    setNotice(null);
    setUnconfirmed(false);
    setResendSent(false);
    resetFormFields();
  };

  const submitAuth = async () => {
    if (busy) return;
    setError(null);
    setNotice(null);
    setUnconfirmed(false);
    setResendSent(false);

    // Same client-side checks as Executive Edge's /signup (src/routes/signup.tsx)
    // — name and gender are optional in the backend schema, but both apps
    // require them at the form level for a consistent account record.
    if (mode === "signup") {
      if (!displayName.trim()) {
        setError("Enter your name.");
        return;
      }
      if (!gender) {
        setError("Select your gender.");
        return;
      }
      if (password.length < 8 || password.length > 20) {
        setError("Password must be between 8 and 20 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
      }
    }

    setBusy(true);
    try {
      const response = await apiFetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "signup"
            ? {
                email,
                password,
                app: "sanctuary",
                displayName: displayName.trim(),
                gender,
                ...(phone.trim() ? { phone: phone.trim() } : {}),
                ...(location.trim() ? { location: location.trim() } : {}),
              }
            : { email, password },
        ),
      });
      const data = (await response.json()) as {
        accessToken?: string;
        refreshToken?: string;
        user?: { email: string | null };
        emailVerificationRequired?: boolean;
        error?: string;
        code?: string;
      };
      if (!response.ok) {
        if (data.code === "EMAIL_NOT_VERIFIED") setUnconfirmed(true);
        throw new Error(data.error ?? "Could not sign you in.");
      }
      if (!data.accessToken || !data.refreshToken) {
        setNotice(
          "Check your inbox to confirm your email address, then log in here.",
        );
        setMode("login");
        resetFormFields();
        return;
      }
      const stored: StoredAuth = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        email: data.user?.email ?? email,
      };
      writeSanctuaryAuth(stored);
      setAuth(stored);
      resetFormFields();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const resendConfirmationEmail = async () => {
    if (resendBusy) return;
    setResendBusy(true);
    try {
      await apiFetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, app: "sanctuary" }),
      });
      setResendSent(true);
    } catch {
      // Best-effort — the endpoint never reveals whether the email exists.
    } finally {
      setResendBusy(false);
    }
  };

  const startCheckout = async () => {
    if (!auth || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await apiFetch("/api/sanctuary/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Could not start the checkout.");
      }
      window.location.assign(data.url);
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const signOut = () => {
    // Revokes the session server-side; storage is cleared synchronously inside.
    void signOutSanctuary();
    setAuth(null);
    setSubscription(null);
  };

  // Prefer `active`: a lapsed guest licence still reports status "active", so
  // the status strings alone would show "License active" to someone whose
  // access has already ended.
  const licenseActive =
    subscription?.active ??
    (subscription?.status === "active" || subscription?.status === "trialing");

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
            {/* Value panel */}
            <div className="animate-rise">
              <p className="eyebrow">Individual license</p>
              <h1 className="mt-4 font-display text-4xl font-normal italic leading-[1.05] tracking-tight sm:text-5xl">
                Sanctuary
              </h1>
              <p className="mt-4 font-display text-xl italic leading-snug text-primary sm:text-2xl">
                Be ready for the moment that matters.
              </p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                A discreet three-minute transition designed around the situation
                you are about to face — stay steady, fully present, and respond
                at your best when the stakes are high.
              </p>

              <div className="hairline mt-8 flex items-baseline gap-2 pt-8">
                <span className="font-mono text-3xl tabular-nums text-foreground">
                  USD {lifetimePrice}
                </span>
                <span className="text-sm text-muted-foreground">one time</span>
              </div>

              <ul className="mt-6 space-y-3">
                {includedItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 flex-none text-primary"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="hairline mt-8 flex items-start gap-2.5 pt-6 text-xs text-muted-foreground">
                <ShieldCheck
                  className="mt-0.5 size-4 flex-none"
                  aria-hidden="true"
                />
                <span>
                  Payments are processed securely by Stripe. Sanctuary never
                  sees or stores your card details.
                </span>
              </div>
            </div>

            {/* Interactive panel */}
            <div className="panel-surface animate-rise rounded-md p-6 sm:p-8">
              {checkout === "success" && (
                <div className="mb-6 flex gap-3 rounded-md border border-primary/40 bg-primary/5 px-4 py-3.5 text-sm text-foreground">
                  <CheckCircle2
                    className="mt-0.5 size-4 flex-none text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    Payment received. Your license activates as soon as the
                    confirmation from our payment provider arrives.
                  </span>
                </div>
              )}
              {checkout === "canceled" && (
                <div className="mb-6 flex gap-3 rounded-md border border-border px-4 py-3.5 text-sm text-muted-foreground">
                  <Info
                    className="mt-0.5 size-4 flex-none"
                    aria-hidden="true"
                  />
                  <span>Checkout was canceled. You have not been charged.</span>
                </div>
              )}
              {notice && (
                <div className="mb-6 flex gap-3 rounded-md border border-border px-4 py-3.5 text-sm text-muted-foreground">
                  <Mail
                    className="mt-0.5 size-4 flex-none"
                    aria-hidden="true"
                  />
                  <span>{notice}</span>
                </div>
              )}
              {error && (
                <div className="mb-6 rounded-md border border-destructive/40 px-4 py-3.5 text-sm text-destructive">
                  <div className="flex gap-3">
                    <AlertCircle
                      className="mt-0.5 size-4 flex-none"
                      aria-hidden="true"
                    />
                    <span>{error}</span>
                  </div>
                  {unconfirmed && (
                    <div className="mt-2.5 pl-7">
                      {resendSent ? (
                        <span className="text-xs text-muted-foreground">
                          Confirmation email sent — check your inbox.
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={resendConfirmationEmail}
                          disabled={resendBusy}
                          className="text-xs font-medium text-foreground underline underline-offset-2 hover:text-primary disabled:opacity-50"
                        >
                          {resendBusy
                            ? "Sending…"
                            : "Resend confirmation email"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!auth ? (
                <>
                  <div
                    role="group"
                    aria-label="Choose login or create account"
                    className="mb-6 grid grid-cols-2 gap-1 rounded-md border border-border bg-secondary/30 p-1"
                  >
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      aria-pressed={mode === "login"}
                      className={cn(
                        "rounded-sm px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors",
                        mode === "login"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Log in
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      aria-pressed={mode === "signup"}
                      className={cn(
                        "rounded-sm px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors",
                        mode === "signup"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Create account
                    </button>
                  </div>

                  <div className="mb-4 flex gap-3 rounded-md border border-border px-4 py-3 text-xs text-muted-foreground">
                    <Info
                      className="mt-0.5 size-3.5 flex-none"
                      aria-hidden="true"
                    />
                    <span>
                      Your PersPaaS account is shared across all our products.
                      If you already have one — from Executive Edge, for example
                      — {mode === "login" ? "log in" : "log in instead"} with
                      the same email and password.
                    </span>
                  </div>

                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitAuth();
                    }}
                  >
                    {mode === "signup" && (
                      <>
                        <Field label="Full name" htmlFor="sanctuary-name">
                          <IconInput
                            id="sanctuary-name"
                            icon={User}
                            type="text"
                            required
                            autoFocus
                            autoComplete="name"
                            placeholder="Jordan Blake"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                          />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label="Contact number"
                            htmlFor="sanctuary-phone"
                            optional
                          >
                            <IconInput
                              id="sanctuary-phone"
                              icon={Phone}
                              type="tel"
                              autoComplete="tel"
                              placeholder="+1 555 000 0000"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </Field>
                          <Field label="Gender" htmlFor="sanctuary-gender">
                            <select
                              id="sanctuary-gender"
                              required
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                              className={cn(
                                inputClasses,
                                gender
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              <option value="" disabled>
                                Select
                              </option>
                              <option value="female">Female</option>
                              <option value="male">Male</option>
                              <option value="other">Other</option>
                              <option value="prefer_not_to_say">
                                Prefer not to say
                              </option>
                            </select>
                          </Field>
                        </div>
                        <Field
                          label="Location"
                          htmlFor="sanctuary-location"
                          optional
                        >
                          <IconInput
                            id="sanctuary-location"
                            icon={MapPin}
                            type="text"
                            autoComplete="address-level2"
                            placeholder="City, country"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </Field>
                      </>
                    )}

                    <Field label="Email" htmlFor="sanctuary-email">
                      <IconInput
                        id="sanctuary-email"
                        icon={Mail}
                        type="email"
                        required
                        autoComplete={mode === "login" ? "username" : "email"}
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>

                    <Field
                      label="Password"
                      htmlFor="sanctuary-password"
                      hint={mode === "signup" ? "8–20 characters." : undefined}
                    >
                      <PasswordField
                        id="sanctuary-password"
                        placeholder="••••••••"
                        autoComplete={
                          mode === "login" ? "current-password" : "new-password"
                        }
                        value={password}
                        onChange={setPassword}
                        minLength={mode === "signup" ? 8 : undefined}
                        maxLength={mode === "signup" ? 20 : undefined}
                      />
                    </Field>

                    {mode === "login" && (
                      <div className="-mt-2 text-right">
                        <Link
                          to="/forgot-password"
                          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    )}

                    {mode === "signup" && (
                      <Field
                        label="Confirm password"
                        htmlFor="sanctuary-confirm-password"
                      >
                        <PasswordField
                          id="sanctuary-confirm-password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={setConfirmPassword}
                          minLength={8}
                          maxLength={20}
                        />
                      </Field>
                    )}

                    <button
                      type="submit"
                      disabled={busy}
                      className="flex w-full items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110 disabled:opacity-50"
                      style={{ backgroundImage: "var(--gradient-gold)" }}
                    >
                      {busy && (
                        <Loader2
                          className="size-4 animate-spin"
                          aria-hidden="true"
                        />
                      )}
                      {busy
                        ? mode === "login"
                          ? "Logging in…"
                          : "Creating account…"
                        : mode === "login"
                          ? "Log in"
                          : "Create account"}
                    </button>
                  </form>
                </>
              ) : (
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 flex-none items-center justify-center rounded-full border border-border-strong bg-secondary text-sm font-medium uppercase text-foreground">
                      {auth.email.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {auth.email}
                      </p>
                      <p className="eyebrow mt-0.5">
                        {licenseActive ? "License active" : "No active license"}
                      </p>
                    </div>
                  </div>

                  {licenseActive ? (
                    <div className="hairline mt-6 pt-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <CheckCircle2
                          className="size-4 text-primary"
                          aria-hidden="true"
                        />
                        Your license is active.
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Lifetime access — no renewal, ever.
                      </p>
                      <Link
                        to="/dashboard"
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:brightness-110"
                      >
                        Go to your dashboard
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  ) : (
                    <div className="hairline mt-6 pt-6">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-2xl tabular-nums text-foreground">
                          USD {lifetimePrice}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          one time
                        </span>
                      </div>
                      <button
                        onClick={startCheckout}
                        disabled={busy}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110 disabled:opacity-50"
                        style={{ backgroundImage: "var(--gradient-gold)" }}
                      >
                        {busy && (
                          <Loader2
                            className="size-4 animate-spin"
                            aria-hidden="true"
                          />
                        )}
                        {busy ? "Redirecting…" : "Purchase license"}
                      </button>
                    </div>
                  )}
                  <button
                    onClick={signOut}
                    className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
