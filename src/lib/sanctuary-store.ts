import { useCallback, useEffect, useState } from "react";

export interface SessionRecord {
  protocolId: string;
  completedAt: string;
  seconds: number;
}

export interface SanctuaryState {
  favorites: string[];
  sessions: SessionRecord[];
  textGuidance: boolean;
}

const KEY = "sanctuary:v1";

const initialState: SanctuaryState = {
  favorites: [],
  sessions: [],
  textGuidance: true,
};

function read(): SanctuaryState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...initialState, ...(JSON.parse(raw) as SanctuaryState) } : initialState;
  } catch {
    return initialState;
  }
}

const listeners = new Set<(s: SanctuaryState) => void>();
let memory: SanctuaryState | null = null;

function write(next: SanctuaryState) {
  memory = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l(next));
}

export function useSanctuary() {
  const [state, setState] = useState<SanctuaryState>(initialState);

  useEffect(() => {
    if (!memory) memory = read();
    setState(memory);
    const listener = (s: SanctuaryState) => setState(s);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const update = useCallback((patch: Partial<SanctuaryState>) => {
    write({ ...(memory ?? read()), ...patch });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const current = memory ?? read();
    const favorites = current.favorites.includes(id)
      ? current.favorites.filter((f) => f !== id)
      : [...current.favorites, id];
    write({ ...current, favorites });
  }, []);

  const recordSession = useCallback((protocolId: string, seconds: number) => {
    const current = memory ?? read();
    write({
      ...current,
      sessions: [{ protocolId, completedAt: new Date().toISOString(), seconds }, ...current.sessions].slice(
        0,
        50,
      ),
    });
  }, []);

  return { state, update, toggleFavorite, recordSession };
}

export function weeklyStreak(sessions: SessionRecord[]) {
  const days = new Set(sessions.map((s) => s.completedAt.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 30; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) streak++;
    else if (i > 0) break;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
