import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  User,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SanctuaryGate } from "@/components/sanctuary-gate";
import { cn } from "@/lib/utils";
import { type StoredAuth, clearSanctuaryAuth, readSanctuaryAuth, refreshSanctuarySession } from "@/lib/sanctuary-auth";

const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

type MeResponse = {
  user: { id: string; email: string | null };
  profile: { displayName: string | null; phone: string | null; gender: string | null; location: string | null } | null;
  accountStatus: string;
};

type SubscriptionView = { status: string; plan: string | null; currentPeriodEnd: string | null };

const inputClasses =
  "w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-60";

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow mb-1.5 block">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function IconInput({ icon: Icon, className, ...props }: { icon: typeof User } & ComponentProps<"input">) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input {...props} className={cn(inputClasses, "pl-10", className)} />
    </div>
  );
}

function PasswordField({
  id,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete="new-password"
        minLength={8}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
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
        {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

export function ProfilePage() {
  return (
    <SanctuaryGate>
      <ProfileContent />
    </SanctuaryGate>
  );
}

function ProfileContent() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [accountStatus, setAccountStatus] = useState("active");
  const [subscription, setSubscription] = useState<SubscriptionView | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwDone, setPwDone] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  useEffect(() => {
    setAuth(readSanctuaryAuth());
  }, []);

  useEffect(() => {
    if (!auth) return;
    let cancelled = false;

    async function authedFetch(path: string, accessToken: string): Promise<Response | null> {
      const res = await fetch(`${API_URL}${path}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status !== 401) return res;
      const refreshed = await refreshSanctuarySession();
      if (!refreshed) return null;
      if (!cancelled) setAuth(refreshed);
      return authedFetch(path, refreshed.accessToken);
    }

    async function load(accessToken: string) {
      const [meRes, subRes] = await Promise.all([
        authedFetch("/api/auth/me", accessToken),
        authedFetch("/api/sanctuary/subscription", accessToken),
      ]);
      if (cancelled) return;
      if (meRes?.ok) {
        const data = (await meRes.json()) as MeResponse;
        setEmail(data.user.email ?? "");
        setAccountStatus(data.accountStatus);
        setDisplayName(data.profile?.displayName ?? "");
        setPhone(data.profile?.phone ?? "");
        setGender(data.profile?.gender ?? "");
        setLocation(data.profile?.location ?? "");
      }
      if (subRes?.ok) {
        const data = (await subRes.json()) as { subscription?: SubscriptionView };
        if (data.subscription) setSubscription(data.subscription);
      }
      setLoading(false);
    }

    load(auth.accessToken).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [auth]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || saving) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({
          displayName: displayName.trim() || null,
          phone: phone.trim() || null,
          gender: gender || null,
          location: location.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Could not save your profile.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || pwBusy) return;
    setPwError(null);
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords don't match.");
      return;
    }
    setPwBusy(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error("Could not update your password.");
      // Backend revokes every session's refresh token on a password change,
      // this one included — the visitor has to log in again.
      setPwDone(true);
      clearSanctuaryAuth();
      setTimeout(() => navigate({ to: "/purchase" }), 1800);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Something went wrong.");
      setPwBusy(false);
    }
  };

  const licenseActive = subscription?.status === "active" || subscription?.status === "trialing";
  const initial = (displayName || email || "?").slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-5 sm:py-16">
        <div>
          <p className="eyebrow">Profile</p>
          <h1 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">Your account.</h1>
        </div>

        {accountStatus !== "active" && (
          <div className="mt-8 flex gap-3 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3.5 text-sm text-destructive">
            <ShieldAlert className="mt-0.5 size-4 flex-none" aria-hidden="true" />
            <span>
              Your account status is <span className="font-medium">{accountStatus}</span>. Some features may be
              limited — contact support if this looks wrong.
            </span>
          </div>
        )}

        {/* Summary */}
        <section className="panel-surface mt-8 flex flex-col gap-6 rounded-md p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex size-14 flex-none items-center justify-center rounded-full border border-border-strong bg-secondary text-lg font-medium uppercase text-foreground">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-medium text-foreground">{displayName || "Add your name"}</p>
              <p className="truncate text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1.5">
            <p className={cn("eyebrow", licenseActive ? "text-primary" : "text-muted-foreground")}>
              {loading ? "Checking license…" : licenseActive ? "License active" : "No active license"}
            </p>
            {!loading && (
              <Link
                to="/purchase"
                className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:brightness-110"
              >
                {licenseActive ? "Manage license" : "Purchase license"}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Personal details */}
          <section className="panel-surface rounded-md p-6 sm:p-8">
            <h2 className="eyebrow">Personal details</h2>

            {error && (
              <div className="mt-4 flex gap-3 rounded-md border border-destructive/40 px-4 py-3.5 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 flex-none" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <form className="mt-5 space-y-4" onSubmit={saveProfile}>
              <Field label="Email" htmlFor="profile-email">
                <IconInput id="profile-email" icon={Mail} type="email" value={email} disabled readOnly />
              </Field>

              <Field label="Full name" htmlFor="profile-name">
                <IconInput
                  id="profile-name"
                  icon={User}
                  type="text"
                  autoComplete="name"
                  placeholder="Jordan Blake"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loading}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Contact number" htmlFor="profile-phone">
                  <IconInput
                    id="profile-phone"
                    icon={Phone}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 555 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </Field>
                <Field label="Gender" htmlFor="profile-gender">
                  <select
                    id="profile-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={loading}
                    className={cn(inputClasses, gender ? "text-foreground" : "text-muted-foreground")}
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </Field>
              </div>

              <Field label="Location" htmlFor="profile-location">
                <IconInput
                  id="profile-location"
                  icon={MapPin}
                  type="text"
                  autoComplete="address-level2"
                  placeholder="City, country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                />
              </Field>

              <button
                type="submit"
                disabled={saving || loading}
                className="flex w-full items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110 disabled:opacity-50"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                {saving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
                {saved && !saving && <CheckCircle2 className="size-4" aria-hidden="true" />}
              </button>
            </form>
          </section>

          {/* Security */}
          <section className="panel-surface rounded-md p-6 sm:p-8">
            <h2 className="eyebrow">Security</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Changing your password signs you out everywhere, including here.
            </p>

            {pwError && (
              <div className="mt-4 flex gap-3 rounded-md border border-destructive/40 px-4 py-3.5 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 flex-none" aria-hidden="true" />
                <span>{pwError}</span>
              </div>
            )}
            {pwDone && (
              <div className="mt-4 flex gap-3 rounded-md border border-primary/40 bg-primary/5 px-4 py-3.5 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 size-4 flex-none text-primary" aria-hidden="true" />
                <span>Password updated. Redirecting you to log back in…</span>
              </div>
            )}

            {!pwDone && (
              <form className="mt-5 space-y-4" onSubmit={changePassword}>
                <Field label="New password" htmlFor="profile-new-password" hint="At least 8 characters.">
                  <PasswordField
                    id="profile-new-password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={setNewPassword}
                    disabled={pwBusy}
                  />
                </Field>
                <Field label="Confirm new password" htmlFor="profile-confirm-password">
                  <PasswordField
                    id="profile-confirm-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    disabled={pwBusy}
                  />
                </Field>
                <button
                  type="submit"
                  disabled={pwBusy || loading}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-border-strong px-6 py-3.5 text-xs uppercase tracking-[0.18em] transition-colors duration-300 hover:border-primary/50 hover:text-primary disabled:opacity-50"
                >
                  {pwBusy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                  {pwBusy ? "Updating…" : "Update password"}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
