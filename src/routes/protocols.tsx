import { createFileRoute } from "@tanstack/react-router";
import { ProtocolsPage } from "@/features/protocols/ProtocolsPage";

export const Route = createFileRoute("/protocols")({
  head: () => ({
    meta: [
      { title: "Protocol Selection — Sanctuary" },
      {
        name: "description",
        content:
          "Search and select an executive reset protocol by scenario, duration, goal, stress level, and outcome.",
      },
      { property: "og:title", content: "Protocol Selection — Sanctuary" },
      {
        property: "og:description",
        content: "Executive reset protocols for boards, investors, media, negotiation, and crisis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProtocolsPage,
});
