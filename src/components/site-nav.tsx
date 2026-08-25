import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CircleUserRound, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearSanctuaryAuth, readSanctuaryAuth } from "@/lib/sanctuary-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { to: "/", label: "Home" },
  { to: "/protocols", label: "Protocols" },
];

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

  useEffect(() => {
    setSignedIn(readSanctuaryAuth() !== null);
  }, [path]);

  const signOut = () => {
    clearSanctuaryAuth();
    setSignedIn(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-5">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="block h-4 w-4 rotate-45 border border-primary/70 bg-primary/10" aria-hidden />
          <span className="text-sm font-medium uppercase tracking-[0.34em] text-foreground">Sanctuary</span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-6">
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "text-xs uppercase tracking-[0.18em] transition-colors duration-300",
                  path === l.to ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            ))}
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
                    <Link to="/purchase" className="text-xs uppercase tracking-[0.14em] text-primary">
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
        <nav className="border-t border-border bg-panel px-4 py-4 sm:px-5 md:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {links.map((l) => (
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
          </ul>
        </nav>
      )}
    </header>
  );
}
