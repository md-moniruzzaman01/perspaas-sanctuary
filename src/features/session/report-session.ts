import { readSanctuaryAuth } from "@/lib/sanctuary-auth";

const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

// Best-effort usage report for signed-in members only — protocols work
// without an account, and that anonymous use is intentionally never sent
// anywhere. Never blocks or surfaces an error: a failed report shouldn't
// interrupt someone finishing a reset protocol.
export function reportSanctuarySession(protocol: { id: string; name: string; category: string }, seconds: number) {
  const auth = readSanctuaryAuth();
  if (!auth) return;
  fetch(`${API_URL}/api/sanctuary/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.accessToken}` },
    body: JSON.stringify({
      protocolId: protocol.id,
      protocolName: protocol.name,
      category: protocol.category,
      seconds,
    }),
  }).catch(() => {});
}

export const formatClock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
