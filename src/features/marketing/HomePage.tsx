import { Link } from "@tanstack/react-router";
import { Lock, Activity, AudioLines, Brain } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { protocols } from "@/lib/protocols";
import { useSanctuaryLifetimePrice } from "../pricing/pricing.api";
import { testimonials } from "./testimonials";
import { whatsAppDemoLink } from "./whatsapp-link";

const features = [
  {
    icon: Activity,
    title: "Rapid Physiological Reset",
    body: "Down-regulate the acute stress response with timed breath, posture, and release sequences.",
  },
  {
    icon: AudioLines,
    title: "Voice & Presence Calibration",
    body: "Resonance work that lowers vocal pitch and steadies tempo before the room hears you speak.",
  },
  {
    icon: Brain,
    title: "Cognitive Compartmentalization",
    body: "Isolate distraction, contain emotional spillover, and commit to a single immediate objective.",
  },
];

const audience = [
  "CEOs",
  "Founders",
  "Board members",
  "Investment bankers",
  "Private equity partners",
  "Corporate attorneys",
  "Crisis communication executives",
  "Family office principals",
  "Executive recruiters",
  "High-performance professionals",
];

const steps = [
  { n: "01", t: "Select or launch", d: "One click enters the default three-minute reset. No configuration." },
  { n: "02", t: "Follow the sequence", d: "Timed instructions guide breath, posture, voice, and focus." },
  { n: "03", t: "Return composed", d: "Complete, note the objective, and step into the room." },
];

export function HomePage() {
  const lifetimePrice = useSanctuaryLifetimePrice();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/25" aria-hidden />
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
              <Link
                to="/protocols"
                className="inline-flex items-center justify-center rounded-md px-8 py-5 text-sm uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-gold)] transition-all duration-500 hover:brightness-110 active:scale-[0.99]"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                Select Your Custom Reset
              </Link>
            </div>

            <p className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Lock className="size-3.5" aria-hidden /> Private by design · No public profiles
            </p>
          </div>
        </section>

        <section className="border-t border-border" aria-labelledby="capabilities">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
            <h2 id="capabilities" className="eyebrow">
              Capabilities
            </h2>
            <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="panel-surface rounded-md p-6 sm:p-7">
                  <f.icon className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-6 text-lg font-medium tracking-tight">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border" aria-labelledby="audience">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-5 sm:py-20 md:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 id="audience" className="eyebrow">
                Who Sanctuary is for
              </h2>
              <p className="mt-6 text-xl font-medium leading-snug sm:text-2xl tracking-tight">
                Leaders whose composure is measured in seconds, not sessions.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
              {audience.map((a) => (
                <li key={a} className="bg-panel px-5 py-4 text-sm text-muted-foreground">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border" aria-labelledby="how">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
            <h2 id="how" className="eyebrow">
              How it works
            </h2>
            <ol className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="rounded-md border border-border p-6 sm:p-7">
                  <span className="font-mono text-sm text-primary">{s.n}</span>
                  <h3 className="mt-5 text-base font-medium tracking-tight">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-border" aria-labelledby="privacy">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
            <div className="panel-surface rounded-md p-6 sm:p-10">
              <h2 id="privacy" className="eyebrow">
                Privacy statement
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-snug sm:text-xl tracking-tight">
                Sessions remain confidential. Progress is stored on your device. There are no public
                profiles, no social layer, and nothing to disclose.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border" aria-labelledby="protocols-preview">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="protocols-preview" className="eyebrow">
                Selected protocols
              </h2>
              <Link
                to="/protocols"
                className="text-xs uppercase tracking-[0.18em] text-primary transition-opacity hover:opacity-70"
              >
                View all
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
              {protocols.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  to="/session/$protocolId"
                  params={{ protocolId: p.id }}
                  className="group bg-panel p-6 transition-colors sm:p-7 duration-500 hover:bg-card"
                >
                  <p className="eyebrow">{p.category}</p>
                  <h3 className="mt-3 text-lg font-medium tracking-tight group-hover:text-primary">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.goal}</p>
                  <p className="mt-4 font-mono text-xs text-primary">{p.durationMinutes} MIN</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border" aria-labelledby="license">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
            <h2 id="license" className="eyebrow">
              Individual license
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
              <div>
                <p className="font-display text-3xl font-normal italic leading-snug tracking-tight sm:text-4xl">
                  USD {lifetimePrice} <span className="text-muted-foreground">one time</span>
                </p>
                <div className="mt-8 flex flex-col items-start gap-5">
                  <Link
                    to="/purchase"
                    className="inline-flex items-center justify-center rounded-md px-8 py-4 text-sm uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-gold)] transition-all duration-500 hover:brightness-110 active:scale-[0.99]"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  >
                    Purchase Your License
                  </Link>
                  <a
                    href="/Sanctuary_Executive_Solution_Brief.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs uppercase tracking-[0.18em] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
              <div className="rounded-md border border-border p-6 sm:p-7">
                <p className="text-sm text-muted-foreground">Based in Latin America?</p>
                <a
                  href={whatsAppDemoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs uppercase tracking-[0.18em] text-primary transition-opacity hover:opacity-70"
                >
                  Schedule a Conversation
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border" aria-labelledby="testimonials">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
            <h2 id="testimonials" className="eyebrow">
              Field notes
            </h2>
            <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.attr} className="rounded-md border border-border p-6 sm:p-7">
                  <blockquote className="text-base leading-relaxed text-foreground">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {t.attr}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
