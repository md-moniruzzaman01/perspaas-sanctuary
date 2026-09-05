import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { LANDING_URL } from "@/lib/landing-url";

// Static assurances, not links. They used to sit in a stacked column that
// mirrored the Platform link list beside them, so they read as clickable and
// did nothing when clicked. Rendered inline, dot-separated, they read as the
// prose they are.
const DISCRETION = [
  "Private by design",
  "No public profiles",
  "Sessions remain confidential",
  "Private to your account",
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-panel">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-5 sm:py-14 md:grid-cols-2">
        <div>
          {/* h-5 pins the heading slot to the same height as the Platform
              eyebrow beside it, so both columns' bodies start on one line —
              the two headings set different type sizes and would otherwise
              hang their `mt-4` content a few pixels apart. */}
          <div className="flex h-5 items-center gap-3">
            <span
              className="block h-3.5 w-3.5 rotate-45 border border-primary/70 bg-primary/10"
              aria-hidden
            />
            <span className="text-sm uppercase tracking-[0.34em]">
              Sanctuary
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Private cognitive reset protocols for high-stakes decisions. Built
            for executives who value discretion.
          </p>
        </div>
        {/* Anchored to the container's right edge on md+, mirroring the
            brand block on the left. Left-aligned inside a 1fr column, the
            three short links floated in ~390px of dead space while the
            copyright bar below them ran edge to edge. */}
        <div className="md:text-right">
          <p className="eyebrow flex h-5 items-center md:justify-end">
            Platform
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/protocols"
                className="transition-colors hover:text-foreground"
              >
                Protocols
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="transition-colors hover:text-foreground"
              >
                Settings
              </Link>
            </li>
            {/* Last, mirroring the header nav. Leaves the app for the
                ecosystem landing page, so it is an <a>, not a Link — a
                router Link would try to resolve the apex URL as a route. */}
            <li>
              <a
                href={LANDING_URL}
                className="transition-colors hover:text-foreground"
              >
                Home
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="eyebrow">Discretion</p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground sm:text-sm">
            {DISCRETION.map((item, i) => (
              <Fragment key={item}>
                {i > 0 && (
                  <li
                    className="text-primary/70"
                    role="presentation"
                    aria-hidden
                  >
                    &bull;
                  </li>
                )}
                <li>{item}</li>
              </Fragment>
            ))}
          </ul>
        </div>
      </div>
      <div className="hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:px-5 text-xs uppercase tracking-[0.18em] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Sanctuary</span>
          <span className="md:text-right">
            Restore executive composure in under five minutes
          </span>
        </div>
      </div>
    </footer>
  );
}
