import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, X } from "lucide-react";
import { SanctuaryGate } from "@/components/sanctuary-gate";
import { getProtocol, protocolDuration } from "@/lib/protocols";
import { useSanctuary } from "@/lib/sanctuary-store";
import { cn } from "@/lib/utils";
import { reportSanctuarySession, formatClock } from "./report-session";

const route = getRouteApi("/session/$protocolId");

export function SessionPage() {
  return (
    <SanctuaryGate requireSubscription>
      <SessionContent />
    </SanctuaryGate>
  );
}

function SessionContent() {
  const { protocolId } = route.useParams();
  const protocol = getProtocol(protocolId)!;
  const navigate = useNavigate();
  const { state, update, toggleFavorite, recordSession } = useSanctuary();

  const total = useMemo(() => protocolDuration(protocol), [protocol]);
  const [stepIndex, setStepIndex] = useState(0);
  const [remaining, setRemaining] = useState(protocol.steps[0].seconds);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const recorded = useRef(false);

  useEffect(() => {
    if (!running || done) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        setStepIndex((i) => {
          if (i + 1 < protocol.steps.length) {
            setRemaining(protocol.steps[i + 1].seconds);
            return i + 1;
          }
          setDone(true);
          setRunning(false);
          return i;
        });
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, done, protocol]);

  useEffect(() => {
    if (done && !recorded.current) {
      recorded.current = true;
      recordSession(protocol.id, total);
      reportSanctuarySession(protocol, total);
    }
  }, [done, protocol.id, total, recordSession]);

  const elapsed =
    protocol.steps.slice(0, stepIndex).reduce((a, s) => a + s.seconds, 0) +
    (protocol.steps[stepIndex].seconds - remaining);
  const progress = Math.min(100, Math.round((elapsed / total) * 100));
  const step = protocol.steps[stepIndex];

  const restart = () => {
    recorded.current = false;
    setStepIndex(0);
    setRemaining(protocol.steps[0].seconds);
    setDone(false);
    setRunning(true);
  };

  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
        <p className="eyebrow animate-rise">Protocol complete</p>
        <h1 className="animate-rise mt-6 text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
          Composure Restored.
        </h1>
        <p className="animate-rise mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          You are ready. Take your next step with clarity.
        </p>
        <p className="animate-rise mt-6 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {protocol.name} · {formatClock(total)} completed
        </p>
        <div className="animate-rise mt-10 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row">
          <button
            onClick={restart}
            className="rounded-md px-8 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            Repeat
          </button>
          <button
            onClick={() => toggleFavorite(protocol.id)}
            className={cn(
              "rounded-md border px-8 py-4 text-xs uppercase tracking-[0.18em] transition-colors duration-300",
              state.favorites.includes(protocol.id)
                ? "border-primary/50 text-primary"
                : "border-border-strong text-foreground hover:text-primary",
            )}
          >
            {state.favorites.includes(protocol.id) ? "Favorited" : "Favorite"}
          </button>
          <Link
            to="/protocols"
            className="rounded-md border border-border px-8 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            Another Protocol
          </Link>
        </div>
        <Link
          to="/"
          className="animate-rise mt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          Return Home
        </Link>

      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="h-px w-full bg-border">
        <div
          className="h-px bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Protocol progress"
        />
      </div>

      <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <p className="eyebrow min-w-0 truncate">
          {protocol.name} · Step {stepIndex + 1} of {protocol.steps.length}
        </p>
        <button
          onClick={() => navigate({ to: "/" })}
          aria-label="Exit protocol"
          className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12 sm:px-5 sm:pb-16 text-center">
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64 md:h-80 md:w-80">
          <span
            className="absolute inset-0 rounded-full border border-primary/25"
            style={
              step.breathing && running
                ? { animation: "breathe 10s ease-in-out infinite" }
                : { transform: "scale(0.9)", opacity: 0.5 }
            }
            aria-hidden
          />
          <span className="absolute inset-8 rounded-full border border-border" aria-hidden />
          <span className="font-mono text-4xl tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {formatClock(remaining)}
          </span>
        </div>

        <p className="eyebrow mt-10">{step.title}</p>
        {state.textGuidance && (
          <p className="mt-4 max-w-md text-lg leading-relaxed text-foreground">{step.instruction}</p>
        )}

        <div className="mt-10 flex w-full max-w-xs items-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border-strong px-8 py-4 text-xs uppercase tracking-[0.18em] transition-colors duration-300 hover:border-primary/50 hover:text-primary"
          >
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {running ? "Pause" : "Resume"}
          </button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={state.textGuidance}
              onChange={(e) => update({ textGuidance: e.target.checked })}
              className="size-3.5 accent-[oklch(0.775_0.126_86.6)]"
            />
            Text guidance
          </label>
        </div>

      </main>
    </div>
  );
}
