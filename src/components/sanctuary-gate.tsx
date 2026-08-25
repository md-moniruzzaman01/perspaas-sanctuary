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
  const status = useSanctuaryAccess({ requireSubscription });

  if (status !== "authorized") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="eyebrow text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  return <>{children}</>;
}
