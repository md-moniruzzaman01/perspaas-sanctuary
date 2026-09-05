// Live license price for the landing and purchase pages, so they can never
// drift from whatever price is actually active in the admin dashboard (the
// dashboard's "activate price" only ever changed what Stripe charges at
// checkout — the marketing copy used to be hardcoded separately).
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

// Shown until the fetch resolves (or if it fails) — never the source of truth.
const FALLBACK_LIFETIME_AMOUNT = "1,200";

function formatWholeUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function useSanctuaryLifetimePrice(): string {
  const [amount, setAmount] = useState(FALLBACK_LIFETIME_AMOUNT);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/pricing")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { sanctuary_lifetime?: { unitAmountCents: number | null } } | null) => {
        if (cancelled) return;
        const cents = data?.sanctuary_lifetime?.unitAmountCents;
        if (cents != null) setAmount(formatWholeUsd(cents));
      })
      .catch(() => {
        // Keep the fallback — a pricing-endpoint hiccup shouldn't blank the page.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return amount;
}
