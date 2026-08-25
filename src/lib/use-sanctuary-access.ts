import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { type StoredAuth, readSanctuaryAuth, refreshSanctuarySession } from "@/lib/sanctuary-auth";

const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

export type SanctuaryAccessStatus = "checking" | "authorized" | "redirecting";

async function hasActiveSubscription(auth: StoredAuth): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/sanctuary/subscription`, {
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (res.status === 401) {
    const refreshed = await refreshSanctuarySession();
    return refreshed ? hasActiveSubscription(refreshed) : false;
  }
  if (!res.ok) return false;
  const data = (await res.json()) as { subscription?: { status: string } };
  return data.subscription?.status === "active" || data.subscription?.status === "trialing";
}

// Gates a route behind a signed-in Sanctuary session and, optionally, an
// active/trialing license. Runs client-side only (auth lives in
// localStorage, unavailable during SSR) — pages render a "checking" state
// until this resolves. Unauthorized visitors are sent to /purchase, the
// app's single login + subscribe entry point.
export function useSanctuaryAccess(options: { requireSubscription?: boolean } = {}): SanctuaryAccessStatus {
  const { requireSubscription = false } = options;
  const router = useRouter();
  const [status, setStatus] = useState<SanctuaryAccessStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const auth = readSanctuaryAuth();
      if (!auth) {
        if (!cancelled) {
          setStatus("redirecting");
          router.navigate({ to: "/purchase" });
        }
        return;
      }
      if (!requireSubscription) {
        if (!cancelled) setStatus("authorized");
        return;
      }
      const authorized = await hasActiveSubscription(auth);
      if (cancelled) return;
      if (authorized) {
        setStatus("authorized");
      } else {
        setStatus("redirecting");
        router.navigate({ to: "/purchase" });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [requireSubscription, router]);

  return status;
}
