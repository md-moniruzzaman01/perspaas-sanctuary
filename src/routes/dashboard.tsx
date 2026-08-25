import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard/DashboardPage";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Personal Dashboard — Sanctuary" },
      {
        name: "description",
        content:
          "Review recent reset sessions, favorites, streak, minutes recovered, and your recommended protocol.",
      },
      { property: "og:title", content: "Personal Dashboard — Sanctuary" },
      { property: "og:description", content: "Private performance record of your executive reset sessions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});
