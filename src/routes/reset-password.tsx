import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/features/auth/ResetPasswordPage";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    ...(typeof search["token"] === "string" ? { token: search["token"] } : {}),
  }),
  head: () => ({
    meta: [{ title: "Choose a New Password — Sanctuary" }],
  }),
  component: ResetPasswordPage,
});
