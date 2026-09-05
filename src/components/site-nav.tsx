import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CircleUserRound, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { readSanctuaryAuth, signOutSanctuary } from "@/lib/sanctuary-auth";
import { LANDING_URL } from "@/lib/landing-url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Protocols sits behind SanctuaryGate(requireSubscription), so advertising it
// to signed-out visitors only sends them into a redirect. `authOnly` entries
// appear once there is a session; the gate still does the real enforcement.
const links = [
  { to: "/", label: "Overview", authOnly: false },
  { to: "/protocols", label: "Protocols", authOnly: true },
];

// Leaves the app for the ecosystem landing page, so it is an <a>, not a Link.
const LANDING_LINK_CLASS =
  "text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground";

const profileLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  // `signedIn` starts false and is only set in the effect below, because auth
  // lives in localStorage and is unreadable during SSR. That default is the
  // safe one here: the server renders the signed-out nav, and members see
  // Protocols appear on hydration rather than everyone seeing it flash away.
  const visibleLinks = links.filter((l) => !l.authOnly || signedIn);

  useEffect(() => {
    setSignedIn(readSanctuaryAuth() !== null);
  }, [path]);

  const signOut = () => {
    // Storage is cleared synchronously inside; the server-side revoke finishes
    // in the background so the UI never waits on the network to sign out.
    void signOutSanctuary();
    setSignedIn(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-5">
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span
            className="block h-4 w-4 rotate-45 border border-primary/70 bg-primary/10"
            aria-hidden
          />
          <span className="text-sm font-medium uppercase tracking-[0.34em] text-foreground">
            Sanctuary
          </span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-6">
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Primary"
          >
            {visibleLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "text-xs uppercase tracking-[0.18em] transition-colors duration-300",
                  path === l.to
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            ))}
            <a href={LANDING_URL} className={LANDING_LINK_CLASS}>
              Home
            </a>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Account menu"
              className="rounded-full p-1 text-muted-foreground transition-colors duration-300 hover:text-foreground focus:outline-none focus-visible:text-primary"
            >
              <CircleUserRound className="size-6" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              {profileLinks.map((l) => (
                <DropdownMenuItem key={l.to} asChild>
                  <Link
                    to={l.to}
                    className="text-xs uppercase tracking-[0.14em] text-foreground"
                  >
                    {l.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              {signedIn ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-xs uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    <LogOut className="size-3.5" aria-hidden="true" />
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/purchase"
                      className="text-xs uppercase tracking-[0.14em] text-primary"
                    >
                      Log in
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            className="-mr-2 p-2 text-muted-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-border bg-panel px-4 py-4 sm:px-5 md:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {visibleLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={LANDING_URL}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm uppercase tracking-[0.18em] text-muted-foreground"
              >
                Home
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
