// Sanctuary's account layer, shared by anything that needs to know whether a
// visitor is signed in. Sessions are a plain access/refresh token pair from
// central-backend's /api/auth/*. This is the single place that reads/writes
// that storage — routes should never touch localStorage directly.
import { apiFetch } from "@/lib/api";

export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
  email: string;
};

const AUTH_KEY = "sanctuary:auth";

export function readSanctuaryAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function writeSanctuaryAuth(auth: StoredAuth): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearSanctuaryAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

// Ends the session on the server as well as on this device. Every sign-out in
// the app must go through here.
//
// Clearing localStorage alone leaves the refresh token valid server-side for
// its full 30-day life, so a token captured earlier keeps working long after
// the visitor pressed "Sign out" — the one control people rely on to end a
// session. /api/auth/logout revokes it for real.
//
// Two details this has to get right:
//   - The endpoint needs a *live* access token, but access tokens last 15
//     minutes, so the common case (sign out after a while on the page) arrives
//     with an expired one. On a 401 we refresh and retry, revoking the rotated
//     token the refresh just issued.
//   - Local sign-out must happen no matter what the network does. The revoke
//     is best-effort; the finally always clears this device.
export async function signOutSanctuary(): Promise<void> {
  const current = readSanctuaryAuth();
  // Clear this device first, before any awaiting: sign-out must be instant and
  // must not depend on the network. Everything below works from the tokens
  // captured above, so it keeps working with storage already empty.
  clearSanctuaryAuth();
  if (!current) return;

  const revoke = (auth: StoredAuth) =>
    apiFetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify({ refreshToken: auth.refreshToken }),
    });

  try {
    const res = await revoke(current);
    if (res.status !== 401) return;

    // Expired access token — mint a fresh pair from the captured refresh token
    // and revoke that. Done inline rather than via refreshSanctuarySession()
    // because that reads and writes the storage this function just cleared.
    const refreshRes = await apiFetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });
    if (!refreshRes.ok) return; // Already invalid server-side — nothing to revoke.

    const data = (await refreshRes.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    await revoke({ ...current, ...data });
  } catch {
    // Offline or backend down. The device is already signed out; the token
    // expires on its own. Nothing useful to show the visitor here.
  }
}

// Attempts one silent refresh using the stored refresh token. Clears storage
// and returns null on any failure (expired/revoked/no session) — callers
// should treat that as "signed out."
export async function refreshSanctuarySession(): Promise<StoredAuth | null> {
  const current = readSanctuaryAuth();
  if (!current) return null;
  try {
    const res = await apiFetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });
    if (!res.ok) {
      clearSanctuaryAuth();
      return null;
    }
    const data = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
      user: { email: string | null };
    };
    const next: StoredAuth = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      email: data.user.email ?? current.email,
    };
    writeSanctuaryAuth(next);
    return next;
  } catch {
    return null;
  }
}
