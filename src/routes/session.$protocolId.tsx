import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProtocol } from "@/lib/protocols";
import { SessionPage } from "@/features/session/SessionPage";

export const Route = createFileRoute("/session/$protocolId")({
  head: () => ({
    meta: [
      { title: "Active Protocol — Sanctuary" },
      {
        name: "description",
        content: "A guided executive reset protocol in progress. Timed breath, posture, voice, and focus.",
      },
      { property: "og:title", content: "Active Protocol — Sanctuary" },
      { property: "og:description", content: "Guided executive reset session in progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ params }) => {
    if (!getProtocol(params.protocolId)) throw notFound();
  },
  component: SessionPage,
});
