import { readSanctuaryAuth } from "@/lib/sanctuary-auth";
import { apiFetch } from "@/lib/api";

// Best-effort usage report. Reaching a protocol already requires a signed-in
// member with an active license (SanctuaryGate requireSubscription), so the
// auth check below is a guard against calling this from anywhere else rather
// than support for anonymous use. Only the protocol identity and elapsed
// seconds are sent — see the privacy copy in SettingsPage, which describes
// exactly this payload and must be kept in step with it. Never blocks or
// surfaces an error: a failed report shouldn't interrupt someone finishing a
// reset protocol.
export function reportSanctuarySession(
  protocol: { id: string; name: string; category: string },
  seconds: number,
) {
  const auth = readSanctuaryAuth();
  if (!auth) return;
  apiFetch("/api/sanctuary/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.accessToken}`,
    },
    body: JSON.stringify({
      protocolId: protocol.id,
      protocolName: protocol.name,
      category: protocol.category,
      seconds,
    }),
  }).catch(() => {});
}

export const formatClock = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
