import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/features/auth/VerifyEmailPage";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    ...(typeof search["token"] === "string" ? { token: search["token"] } : {}),
  }),
  head: () => ({
    meta: [{ title: "Confirm Your Email — Sanctuary" }],
  }),
  component: VerifyEmailPage,
});
