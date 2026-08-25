import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-panel">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-5 sm:py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="block h-3.5 w-3.5 rotate-45 border border-primary/70 bg-primary/10" aria-hidden />
            <span className="text-sm uppercase tracking-[0.34em]">Sanctuary</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Private cognitive reset protocols for high-stakes decisions. Built for executives who value
            discretion.
          </p>
        </div>
        <div>
          <p className="eyebrow">Platform</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/protocols" className="transition-colors hover:text-foreground">
                Protocols
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="transition-colors hover:text-foreground">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/settings" className="transition-colors hover:text-foreground">
                Settings
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Discretion</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Private by design</li>
            <li>No public profiles</li>
            <li>Sessions remain confidential</li>
            <li>Local-first session data</li>
          </ul>
        </div>
      </div>
      <div className="hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:px-5 text-xs uppercase tracking-[0.18em] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Sanctuary</span>
          <span>Restore executive composure in under five minutes</span>
        </div>
      </div>
    </footer>
  );
}
