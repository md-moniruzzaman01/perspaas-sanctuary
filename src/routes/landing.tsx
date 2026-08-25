import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/features/marketing/LandingPage";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Sanctuary — Book a Private Demo" },
      {
        name: "description",
        content:
          "Book a private demo of Sanctuary. Executive-grade cognitive reset protocols for leaders under extreme pressure.",
      },
      { property: "og:title", content: "Sanctuary — Book a Private Demo" },
      {
        property: "og:description",
        content:
          "Private cognitive reset protocols for high-stakes decisions. See how Sanctuary works for your executive team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});
