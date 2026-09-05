import type { ReactNode } from "react";
import { useSanctuaryAccess } from "@/lib/use-sanctuary-access";

// Wrap any protected page's content in this. Renders a neutral placeholder
// while the auth/subscription check runs (or after it fails and a redirect
// to /purchase is underway), and the real content only once authorized.
export function SanctuaryGate({
  requireSubscription,
  children,
}: {
  requireSubscription?: boolean;
  children: ReactNode;
}) {
  const { status, retry } = useSanctuaryAccess({ requireSubscription });

  // The backend was unreachable, so whether this visitor holds a license is
  // unknown. Say so and offer a retry rather than implying they need to buy.
  if (status === "unavailable") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm text-center">
          <p className="eyebrow text-muted-foreground">Connection problem</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We couldn&rsquo;t verify your license just now. Check your
            connection and try again — your access is unaffected.
          </p>
          <button
            onClick={retry}
            className="mt-8 rounded-md px-8 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (status !== "authorized") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="eyebrow text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  return <>{children}</>;
}
