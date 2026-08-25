import { createFileRoute } from "@tanstack/react-router";
import { PurchasePage } from "@/features/purchase/PurchasePage";

export const Route = createFileRoute("/purchase")({
  // Stripe Checkout returns here with ?checkout=success|canceled.
  validateSearch: (search: Record<string, unknown>): { checkout?: string } => ({
    ...(typeof search["checkout"] === "string"
      ? { checkout: search["checkout"] }
      : {}),
  }),
  head: () => ({
    meta: [
      { title: "Sanctuary — Individual License" },
      {
        name: "description",
        content: "Sanctuary individual lifetime license — USD 1,200, one time.",
      },
    ],
  }),
  component: PurchasePage,
});
