import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SanctuaryGate } from "@/components/sanctuary-gate";
import { ProtocolCard } from "./protocol-card";
import { categories, getProtocol, protocols } from "@/lib/protocols";
import { useSanctuary } from "@/lib/sanctuary-store";
import { cn } from "@/lib/utils";

export function ProtocolsPage() {
  return (
    <SanctuaryGate requireSubscription>
      <ProtocolsContent />
    </SanctuaryGate>
  );
}

function ProtocolsContent() {
  const { state, toggleFavorite } = useSanctuary();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const results = useMemo(
    () =>
      protocols.filter((p) => {
        const matchesCategory = !active || p.category === active;
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.goal.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      }),
    [query, active],
  );

  // recordSession prepends, so state.sessions is already newest-first — walk it
  // as-is. It used to be reversed here, which made this strip show the three
  // *oldest* protocols under a "Recently Used" heading.
  const recent = useMemo(() => {
    const seen: string[] = [];
    for (const s of state.sessions) {
      if (!seen.includes(s.protocolId) && getProtocol(s.protocolId))
        seen.push(s.protocolId);
      if (seen.length === 3) break;
    }
    return seen.map((id) => getProtocol(id)!);
  }, [state.sessions]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-16">
        <div>
          <p className="eyebrow">Protocol Selection</p>
          <h1 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Choose your reset.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Each protocol is calibrated to a specific pressure environment.
            Duration is fixed; outcome is explicit.
          </p>
        </div>

        {recent.length > 0 && (
          <section className="mt-8" aria-label="Recently used protocols">
            <p className="eyebrow">Recently Used</p>
            <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              {recent.map((p) => (
                <Link
                  key={p.id}
                  to="/session/$protocolId"
                  params={{ protocolId: p.id }}
                  className="shrink-0 rounded-md border border-primary/25 bg-panel px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 flex items-center gap-3 rounded-md border border-border bg-panel px-4 py-3">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search protocols"
            aria-label="Search protocols"
            className="w-full min-w-0 bg-transparent text-base sm:text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div
          className="mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          role="group"
          aria-label="Filter by category"
        >
          <button
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            className={cn(
              "shrink-0 rounded-md border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-300",
              active === null
                ? "border-primary/50 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c === active ? null : c)}
              aria-pressed={active === c}
              className={cn(
                "shrink-0 rounded-md border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-300",
                active === c
                  ? "border-primary/50 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2">
          {results.map((p) => (
            <ProtocolCard
              key={p.id}
              protocol={p}
              favorite={state.favorites.includes(p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
        {results.length === 0 && (
          <p className="mt-8 rounded-md border border-border bg-panel p-10 text-center text-sm text-muted-foreground">
            No protocols match that query.
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
