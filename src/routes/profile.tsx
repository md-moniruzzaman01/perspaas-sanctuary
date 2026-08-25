import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/features/profile/ProfilePage";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Sanctuary" },
      {
        name: "description",
        content: "Manage your name, contact details, and location for your Sanctuary account.",
      },
      { property: "og:title", content: "Profile — Sanctuary" },
      { property: "og:description", content: "Account details for your Sanctuary license." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});
