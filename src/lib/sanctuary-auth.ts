// Sanctuary's account layer, shared by anything that needs to know whether a
// visitor is signed in. Sessions are a plain access/refresh token pair from
// central-backend's /api/auth/*. This is the single place that reads/writes
// that storage — routes should never touch localStorage directly.
export type StoredAuth = { accessToken: string; refreshToken: string; email: string };

const AUTH_KEY = "sanctuary:auth";
const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

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

// Attempts one silent refresh using the stored refresh token. Clears storage
// and returns null on any failure (expired/revoked/no session) — callers
// should treat that as "signed out."
export async function refreshSanctuarySession(): Promise<StoredAuth | null> {
  const current = readSanctuaryAuth();
  if (!current) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
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
