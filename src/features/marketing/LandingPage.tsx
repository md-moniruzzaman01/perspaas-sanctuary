import { Link } from "@tanstack/react-router";
import {
  Activity,
  AudioLines,
  Brain,
  Lock,
  MessageCircle,
  Shield,
  Timer,
} from "lucide-react";
import { testimonials } from "./testimonials";
import { WHATSAPP_NUMBER, whatsAppDemoLink } from "./whatsapp-link";

const features = [
  {
    icon: Timer,
    title: "Under five minutes",
    body: "Protocols designed for acute moments, not lifestyle habits. Reset between meetings, before a board vote, or in transit.",
  },
  {
    icon: Activity,
    title: "Physiological first",
    body: "Down-regulate the stress response through breath, posture, and release sequences calibrated for high-pressure environments.",
  },
  {
    icon: AudioLines,
    title: "Voice & presence",
    body: "Steady vocal pitch and tempo before you enter the room. Presence protocols for negotiations, media, and crises.",
  },
  {
    icon: Brain,
    title: "Cognitive compartmentalization",
    body: "Isolate distraction, contain emotional spillover, and commit to a single immediate objective with clarity.",
  },
  {
    icon: Shield,
    title: "Privacy by design",
    body: "No public profiles. No social layer. Completed sessions are recorded privately to each member's own account — never sold, never shared with third parties, never attributed anywhere else.",
  },
  {
    icon: MessageCircle,
    title: "Built for executive rhythm",
    body: "Discreet enough for a private office, a car, or an airport lounge. Used by CEOs, board members, litigators, and crisis leaders.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-5">
          <Link to="/" className="flex items-center gap-3">
            <span
              className="block h-4 w-4 rotate-45 border border-primary/70 bg-primary/10"
              aria-hidden
            />
            <span className="text-sm font-medium uppercase tracking-[0.34em] text-foreground">
              Sanctuary
            </span>
          </Link>
          <a
            href={whatsAppDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:brightness-110 active:scale-[0.99]"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            Book a Demo
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/25"
            aria-hidden
          />
          <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-5 sm:py-24 md:py-36">
            <p className="animate-rise font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Private Cognitive Reset Protocols
            </p>
            <h1 className="animate-rise mt-8 max-w-3xl font-display text-[2.25rem] font-normal italic leading-[1.12] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Stillness
              <br />
              <span className="text-muted-foreground">Under Pressure.</span>
            </h1>
            <p className="animate-rise mt-8 max-w-2xl text-base font-light leading-relaxed tracking-wide text-muted-foreground sm:text-lg md:text-xl">
              Private physiological and cognitive reset protocols
              <br />
              designed to bring executives to stillness
              <br />
              before facing high-stake, difficult meeting and conversations.
            </p>

            <div className="animate-rise mt-10 flex justify-center">
              <a
                href={whatsAppDemoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md px-8 py-5 text-sm uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-gold)] transition-all duration-500 hover:brightness-110 active:scale-[0.99]"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                Book a Demo
              </a>
            </div>

            <p className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Lock className="size-3.5" aria-hidden /> Private by design · No
              public profiles
            </p>
          </div>
        </section>

        {/* What it is */}
        <section className="border-t border-border" aria-labelledby="what-is">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
            <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
              <div>
                <h2 id="what-is" className="eyebrow">
                  What Sanctuary is
                </h2>
                <p className="mt-6 font-display text-2xl font-normal italic leading-snug text-foreground sm:text-3xl tracking-tight">
                  Not a wellness app. A performance instrument for acute stress
                  recovery.
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Sanctuary is a private, executive-grade protocol system for
                leaders who need to recover composure quickly — before a board
                vote, between depositions, before a hostile negotiation, or
                during a brand crisis. Each protocol is a timed sequence of
                breath, posture, voice, and focus instructions built to
                down-regulate the acute stress response and restore decision
                quality in under five minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section
          className="border-t border-border"
          aria-labelledby="capabilities"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
            <h2 id="capabilities" className="eyebrow">
              Capabilities
            </h2>
            <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="panel-surface rounded-md p-6 sm:p-7"
                >
                  <f.icon className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-6 text-lg font-medium tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="border-t border-border" aria-labelledby="use-cases">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
            <h2 id="use-cases" className="eyebrow">
              Built for high-stakes moments
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Board meetings",
                "Hostile negotiations",
                "Investor pitches",
                "Media interviews",
                "Crisis communications",
                "Difficult conversations",
                "High-stakes litigation",
                "Executive transitions",
              ].map((item) => (
                <li
                  key={item}
                  className="bg-panel px-5 py-4 text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section
          className="border-t border-border"
          aria-labelledby="testimonials"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
            <h2 id="testimonials" className="eyebrow">
              Field notes
            </h2>
            <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t.attr}
                  className="rounded-md border border-border p-6 sm:p-7"
                >
                  <blockquote className="text-base leading-relaxed text-foreground">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {t.attr}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border" aria-labelledby="demo">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-5 sm:py-24 md:py-32">
            <h2 id="demo" className="eyebrow">
              Private demo
            </h2>
            <p className="mt-6 font-display text-2xl font-normal italic leading-snug text-foreground sm:text-3xl md:text-4xl tracking-tight">
              See Sanctuary in action.
            </p>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Book a short, confidential demo. We'll walk you through the
              protocol system, discuss deployment options for your organization,
              and answer any questions about privacy and enterprise
              customization.
            </p>
            <div className="mt-10 flex justify-center">
              <a
                href={whatsAppDemoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md px-8 py-5 text-sm uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-gold)] transition-all duration-500 hover:brightness-110 active:scale-[0.99]"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                Book a Demo
              </a>
            </div>
            {WHATSAPP_NUMBER && (
              <p className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <MessageCircle className="size-3.5" aria-hidden />
                WhatsApp: +{WHATSAPP_NUMBER}
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-panel">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-5 md:flex-row">
          <div className="flex items-center gap-3">
            <span
              className="block h-3.5 w-3.5 rotate-45 border border-primary/70 bg-primary/10"
              aria-hidden
            />
            <span className="text-sm uppercase tracking-[0.34em]">
              Sanctuary
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sanctuary. Private cognitive reset
            protocols.
          </p>
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Enter App
          </Link>
        </div>
      </footer>
    </div>
  );
}
