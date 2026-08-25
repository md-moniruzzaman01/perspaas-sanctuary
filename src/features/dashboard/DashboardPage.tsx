import { Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SanctuaryGate } from "@/components/sanctuary-gate";
import { getProtocol, protocols } from "@/lib/protocols";
import { useSanctuary, weeklyStreak } from "@/lib/sanctuary-store";

export function DashboardPage() {
  return (
    <SanctuaryGate>
      <DashboardContent />
    </SanctuaryGate>
  );
}

function DashboardContent() {
  const { state } = useSanctuary();
  const minutes = Math.round(state.sessions.reduce((a, s) => a + s.seconds, 0) / 60);
  const streak = weeklyStreak(state.sessions);
  const recommended = protocols[1];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-16">
        <div>
          <p className="eyebrow">Personal Dashboard</p>
          <h1 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">Your record.</h1>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            { label: "Weekly streak", value: `${streak} d` },
            { label: "Minutes recovered", value: `${minutes}` },
            { label: "Sessions logged", value: `${state.sessions.length}` },
          ].map((m) => (
            <div key={m.label} className="bg-panel p-5 sm:p-7">
              <p className="eyebrow">{m.label}</p>
              <p className="mt-3 font-mono text-2xl text-primary sm:text-3xl">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:gap-6 lg:grid-cols-2">
          <section className="panel-surface rounded-md p-5 sm:p-7">
            <h2 className="eyebrow">Recent sessions</h2>
            <ul className="mt-5 space-y-4">
              {state.sessions.slice(0, 5).map((s, i) => (
                <li key={i} className="flex items-center justify-between gap-3 border-b border-border pb-3 text-sm">
                  <span className="min-w-0 truncate">{getProtocol(s.protocolId)?.name ?? s.protocolId}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(s.completedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
              {state.sessions.length === 0 && (
                <li className="text-sm text-muted-foreground">No sessions recorded on this device yet.</li>
              )}
            </ul>
          </section>

          <section className="panel-surface rounded-md p-5 sm:p-7">
            <h2 className="eyebrow">Favorite protocols</h2>
            <ul className="mt-5 space-y-4">
              {state.favorites.map((id) => (
                <li key={id} className="flex items-center justify-between border-b border-border pb-3 text-sm">
                  <span>{getProtocol(id)?.name ?? id}</span>
                  <Link
                    to="/session/$protocolId"
                    params={{ protocolId: id }}
                    className="text-xs uppercase tracking-[0.18em] text-primary"
                  >
                    Begin
                  </Link>
                </li>
              ))}
              {state.favorites.length === 0 && (
                <li className="text-sm text-muted-foreground">No favorites yet.</li>
              )}
            </ul>
          </section>

          <section className="panel-surface rounded-md p-5 sm:p-7">
            <h2 className="eyebrow">Stress check-ins</h2>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Stress check-in">
              {["Low", "Elevated", "High", "Acute"].map((l) => (
                <button
                  key={l}
                  className="rounded-md border border-border py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {l}
                </button>
              ))}
            </div>
            <h2 className="eyebrow mt-8">Upcoming calendar events</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex justify-between border-b border-border pb-2">
                <span>Board session</span> <span className="font-mono text-xs">Placeholder</span>
              </li>
              <li className="flex justify-between border-b border-border pb-2">
                <span>Investor update</span> <span className="font-mono text-xs">Placeholder</span>
              </li>
            </ul>
          </section>

          <section className="panel-surface rounded-md p-5 sm:p-7">
            <h2 className="eyebrow">Recommended protocol</h2>
            <h3 className="mt-4 text-lg font-medium tracking-tight">{recommended.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{recommended.description}</p>
            <Link
              to="/session/$protocolId"
              params={{ protocolId: recommended.id }}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md px-6 py-3 sm:w-auto text-xs uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              Begin Protocol
            </Link>
          </section>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
