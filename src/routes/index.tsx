import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/features/marketing/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sanctuary — Stillness Under Pressure" },
      {
        name: "description",
        content:
          "Private cognitive reset protocols for high-stakes decisions. Restore stillness under pressure in under five minutes.",
      },
      { property: "og:title", content: "Sanctuary — Stillness Under Pressure" },
      {
        property: "og:description",
        content: "Private physiological and cognitive reset protocols for leaders under extreme pressure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});
