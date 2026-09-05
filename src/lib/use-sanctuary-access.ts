import { useCallback, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  type StoredAuth,
  readSanctuaryAuth,
  refreshSanctuarySession,
} from "@/lib/sanctuary-auth";
import { apiFetch } from "@/lib/api";

export type SanctuaryAccessStatus =
  "checking" | "authorized" | "redirecting" | "unavailable";

// Four outcomes, not two. "unknown" means the backend could not be reached or
// did not answer usefully — distinct from a definite "no license", because
// only the latter should send someone to /purchase. Treating a network blip as
// "unlicensed" would show a paying member a buy-now page.
//
// "signed-out" is split from "unlicensed" so the redirect can say the right
// thing: someone whose session died needs to sign in, and telling them to buy
// a license they may already own is both wrong and alarming.
type LicenseCheck = "licensed" | "unlicensed" | "signed-out" | "unknown";

// Both redirects land on /purchase, which without a word of explanation reads
// as "the app lost my place". These say why.
//
// The ids matter: the effect below re-runs on retry and on remount, and sonner
// treats a repeated id as the same toast, so the message replaces itself
// instead of stacking copies.
function notifyLicenseRequired(): void {
  toast.error("You don't have a license", {
    id: "sanctuary-license-required",
    description: "Please buy a license first to open the protocols.",
    duration: 6000,
  });
}

function notifySignInRequired(): void {
  toast.error("Please sign in", {
    id: "sanctuary-sign-in-required",
    description: "Sign in to your Sanctuary account to continue.",
    duration: 6000,
  });
}

async function checkLicense(auth: StoredAuth): Promise<LicenseCheck> {
  let res: Response;
  try {
    res = await apiFetch("/api/sanctuary/subscription", {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
  } catch {
    // fetch rejects on DNS/TLS/offline/CORS failures.
    return "unknown";
  }

  if (res.status === 401) {
    const refreshed = await refreshSanctuarySession();
    // refreshSanctuarySession() returns null both for a genuinely dead session
    // and for a network failure during the refresh. Either way the session is
    // unusable, so this is "signed-out" rather than a verdict on the license.
    return refreshed ? checkLicense(refreshed) : "signed-out";
  }
  // 5xx is the backend being broken, not a verdict on this account.
  if (res.status >= 500) return "unknown";
  if (!res.ok) return "unlicensed";

  try {
    // `active` is the backend's own verdict and already accounts for expiry —
    // an admin-granted guest licence that has lapsed still reports status
    // "active", so deriving access from the status string here would keep
    // letting an expired guest in. Fall back to the status comparison only for
    // a backend too old to send `active`.
    const data = (await res.json()) as {
      subscription?: { status: string; active?: boolean };
    };
    const sub = data.subscription;
    const licensed =
      sub?.active ?? (sub?.status === "active" || sub?.status === "trialing");
    return licensed ? "licensed" : "unlicensed";
  } catch {
    return "unknown";
  }
}

// Gates a route behind a signed-in Sanctuary session and, optionally, an
// active/trialing license. Runs client-side only (auth lives in
// localStorage, unavailable during SSR) — pages render a "checking" state
// until this resolves. Unauthorized visitors are sent to /purchase, the
// app's single login + subscribe entry point.
//
// Returns a `retry` alongside the status: on "unavailable" the caller shows it
// as a button. Without one, a member whose check failed once has no way back in
// short of reloading the page.
export function useSanctuaryAccess(
  options: { requireSubscription?: boolean } = {},
): {
  status: SanctuaryAccessStatus;
  retry: () => void;
} {
  const { requireSubscription = false } = options;
  const router = useRouter();
  const [status, setStatus] = useState<SanctuaryAccessStatus>("checking");
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setStatus("checking");
    setAttempt((a) => a + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const auth = readSanctuaryAuth();
      if (!auth) {
        if (!cancelled) {
          setStatus("redirecting");
          notifySignInRequired();
          router.navigate({ to: "/purchase" });
        }
        return;
      }
      if (!requireSubscription) {
        if (!cancelled) setStatus("authorized");
        return;
      }

      const result = await checkLicense(auth);
      if (cancelled) return;
      if (result === "licensed") {
        setStatus("authorized");
      } else if (result === "unknown") {
        setStatus("unavailable");
      } else {
        setStatus("redirecting");
        if (result === "signed-out") notifySignInRequired();
        else notifyLicenseRequired();
        router.navigate({ to: "/purchase" });
      }
    }

    // A throw anywhere above would otherwise leave the gate stuck on
    // "checking" forever behind an unhandled rejection.
    run().catch(() => {
      if (!cancelled) setStatus("unavailable");
    });

    return () => {
      cancelled = true;
    };
  }, [requireSubscription, router, attempt]);

  return { status, retry };
}
