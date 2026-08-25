import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/features/settings/SettingsPage";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Sanctuary" },
      {
        name: "description",
        content: "Configure audio, guidance, notifications, privacy, and accessibility for Sanctuary.",
      },
      { property: "og:title", content: "Settings — Sanctuary" },
      { property: "og:description", content: "Audio, guidance, privacy, and accessibility preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});
