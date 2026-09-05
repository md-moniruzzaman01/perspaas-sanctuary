import { Link } from "@tanstack/react-router";
import {
  Activity,
  AudioLines,
  Brain,
  Clock,
  Lock,
  MessageCircle,
  Target,
  Wind,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { protocols } from "@/lib/protocols";
import { useSanctuaryLifetimePrice } from "../pricing/pricing.api";
import { whatsAppDemoLink } from "./whatsapp-link";

const DIAL_CENTER = 200;
const TICKS = Array.from({ length: 60 }, (_, i) => i);

// Radii are tuned as a set — the phase labels sit in the corridor between the
// inner circle and the inner end of the major ticks, and "Posture" (the widest
// label, on the tightest axis) has to clear both. Changing one of these without
// re-checking the others is what put that label on top of its tick.
const DIAL_INNER_RING = 88;
const DIAL_TICK_OUTER = 170;
const DIAL_TICK_INNER_MAJOR = 152;
const DIAL_TICK_INNER_MINOR = 161;
const DIAL_LABEL_RADIUS = 120;

// Tuned for the navy ground: structure in low-alpha white, the accent and the
// one moving marker in gold.
const DIAL_RING = "oklch(1 0 0 / 14%)";
const DIAL_TICK_MINOR = "oklch(1 0 0 / 11%)";
const DIAL_TICK_MAJOR = "oklch(0.78 0.1 80 / 55%)";
const DIAL_MARKER = "oklch(0.82 0.1 82)";

// Clockwise from the top, matching the order the subhead reads them in. The
// notes are drawn from the actual protocol steps in src/lib/protocols.ts.
const PHASES = [
  {
    label: "Breath",
    angle: -90,
    icon: Wind,
    note: "Physiological sighs and long, complete exhales — the fastest way down from an acute stress response.",
  },
  {
    label: "Posture",
    angle: 0,
    icon: Activity,
    note: "Ground through the heels, unlock the knees, and let the floor carry the weight your shoulders were holding.",
  },
  {
    label: "Voice",
    angle: 90,
    icon: AudioLines,
    note: "Release the jaw and separate the back teeth, so pitch settles and tempo stops running ahead of you.",
  },
  {
    label: "Focus",
    angle: 180,
    icon: Brain,
    note: "Hold attention on one cold, specific point. It interrupts the alarm loop and restores sequenced thinking.",
  },
];

const durations = protocols.map((p) => p.durationMinutes);
const MIN_MINUTES = Math.min(...durations);
const MAX_MINUTES = Math.max(...durations);
// "About 3 minutes" was simply untrue — half the library runs 4–5 minutes.
const DURATION_LABEL = MIN_MINUTES + "–" + MAX_MINUTES + " minutes";

const assurances = [
  { icon: Target, label: "Before high-stakes moments" },
  { icon: Clock, label: DURATION_LABEL },
  { icon: Lock, label: "Private · no public profiles" },
];

// Same speckle Executive Edge scatters around its panels.
const ORBIT_PARTICLES = [
  { top: "8%", left: "16%", size: 5, tone: "gold" as const },
  { top: "22%", left: "88%", size: 4, tone: "slate" as const },
  { top: "72%", left: "92%", size: 5, tone: "gold" as const },
  { top: "84%", left: "10%", size: 4, tone: "slate" as const },
];

/** Executive Edge's navy→gold rule, used to cap a panel or a band. */
function GradientBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        background:
          "linear-gradient(90deg, var(--navy-deep), var(--navy) 45%, var(--gold))",
      }}
    />
  );
}

function Particles() {
  return (
    <>
      {ORBIT_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor:
              p.tone === "gold" ? "var(--gold)" : "var(--slate-soft)",
            boxShadow: `0 0 8px ${
              p.tone === "gold" ? "var(--gold)" : "var(--slate-soft)"
            }`,
          }}
        />
      ))}
    </>
  );
}

function polar(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: DIAL_CENTER + radius * Math.cos(rad),
    y: DIAL_CENTER + radius * Math.sin(rad),
  };
}

function ResetDial() {
  return (
    <div className="relative h-full w-full">
      {/* Lifts the dial off the ground without tinting it. Gold at any real
          strength composites to brown over navy — the breathing element is
          therefore a cool raised disc, with gold left to the ticks and the
          marker where it actually reads as gold. */}
      <span
        className="absolute inset-8 -z-10 rounded-full blur-2xl"
        style={{
          animation: "breathe 12s ease-in-out infinite",
          backgroundColor: "color-mix(in oklab, var(--navy) 85%, transparent)",
        }}
        aria-hidden
      />
      <span
        className="absolute inset-6 -z-10 rounded-full"
        style={{
          border: "1px solid color-mix(in oklab, var(--gold) 12%, transparent)",
        }}
        aria-hidden
      />

      {/* role="img" plus a label: without it the bare "Breath Posture Voice
          Focus" text nodes reach assistive tech as four orphan words with no
          statement of what they belong to. */}
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        role="img"
        aria-label={
          "Reset dial: a " +
          MIN_MINUTES +
          "-minute cycle through breath, posture, voice, and focus."
        }
      >
        <circle
          cx="200"
          cy="200"
          r={DIAL_TICK_OUTER}
          strokeWidth="1"
          fill="none"
          stroke={DIAL_RING}
        />
        <circle
          cx="200"
          cy="200"
          r={DIAL_INNER_RING}
          strokeWidth="1"
          fill="none"
          stroke={DIAL_RING}
        />

        {TICKS.map((i) => {
          const isMajor = i % 5 === 0;
          const angle = i * 6 - 90;
          const outer = polar(DIAL_TICK_OUTER, angle);
          const inner = polar(
            isMajor ? DIAL_TICK_INNER_MAJOR : DIAL_TICK_INNER_MINOR,
            angle,
          );
          return (
            <line
              key={i}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              strokeWidth={isMajor ? 1.5 : 1}
              stroke={isMajor ? DIAL_TICK_MAJOR : DIAL_TICK_MINOR}
            />
          );
        })}

        {PHASES.map((p) => {
          const pos = polar(DIAL_LABEL_RADIUS, p.angle);
          return (
            <text
              key={p.label}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground font-mono text-[9px] uppercase tracking-[0.12em]"
            >
              {p.label}
            </text>
          );
        })}

        {/* A marker riding the tick ring, not a hand pivoting at the centre.
            The old centre-origin line swept straight through the "03:00"
            readout on every pass, and its pivot dot sat on the colon. One
            turn is one reset, so the motion states the same duration the
            numerals do instead of contradicting it. */}
        <g
          style={{
            transformBox: "view-box",
            transformOrigin: "200px 200px",
            animation: "spin " + MIN_MINUTES * 60 + "s linear infinite",
          }}
        >
          {/* Confined to the tick band (r 152–168). Reaching any further in
              would clip the phase labels, whose widest — "Posture" — ends at
              r≈143 on the horizontal axis. */}
          <line
            x1="200"
            y1={DIAL_CENTER - (DIAL_TICK_OUTER - 2)}
            x2="200"
            y2={DIAL_CENTER - DIAL_TICK_INNER_MAJOR}
            strokeWidth="3"
            strokeLinecap="round"
            stroke={DIAL_MARKER}
          />
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl tracking-tight text-foreground sm:text-5xl">
          0{MIN_MINUTES}:00
        </span>
        <span className="mt-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Reset length
        </span>
      </div>
    </div>
  );
}

function CtaPair({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <Link
        to="/purchase"
        className="inline-flex items-center justify-center rounded-md border border-transparent px-8 py-4 text-sm tracking-wide text-primary-foreground shadow-[var(--shadow-gold)] transition-all duration-300 hover:brightness-110 active:scale-[0.99]"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      >
        Get Sanctuary
      </Link>
      <a
        href={whatsAppDemoLink}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-8 py-4 text-sm tracking-wide text-foreground transition-colors duration-300 hover:bg-accent"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        Chat on WhatsApp
      </a>
    </div>
  );
}

export function HomePage() {
  const lifetimePrice = useSanctuaryLifetimePrice();

  return (
    // theme-edge re-points the palette to Executive Edge's dark tokens (see
    // styles.css). It sits on the page root so the shared nav and footer
    // re-tone with it.
    <div className="theme-edge min-h-screen bg-background">
      <SiteNav />

      <main>
        {/* HERO — asymmetric editorial. Not Executive Edge's rounded panel
            with a card floating in an orbit, and not the centred stack this
            replaced: that one ran 1016px tall to hold a 465px-wide column,
            pushing the CTA onto the fold line while the dial and the headline
            competed for the same middle. Copy anchors the left rail at a size
            that can carry the page, the dial sits right as a real instrument,
            and the assurances close the band. */}
        <section className="relative overflow-hidden border-b border-border">
          {/* Cool lift under the whole band. The previous hero put a gold blur
              directly behind the dial — gold at 26% over navy composites to
              brown, which read as grime rather than light. */}
          <div
            className="pointer-events-none absolute -top-32 -left-24 h-[34rem] w-[34rem] rounded-full blur-3xl"
            style={{
              backgroundColor:
                "color-mix(in oklab, var(--navy) 65%, transparent)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-64 right-0 h-[30rem] w-[30rem] rounded-full blur-3xl"
            style={{
              backgroundColor:
                "color-mix(in oklab, var(--gold) 8%, transparent)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-5 sm:pt-16">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
              {/* copy */}
              <div>
                <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--gold)" }}
                  />
                  Private Cognitive Reset
                </div>

                {/* One lockup. Split across two elements at two sizes, the
                    headline read as two unrelated lines. */}
                <h1 className="animate-rise [animation-delay:160ms] mt-8 max-w-[15ch] font-display text-5xl leading-[1.02] tracking-tight text-foreground sm:text-6xl md:text-7xl">
                  Be Ready For What{" "}
                  <span
                    className="font-display italic"
                    style={{ color: "var(--gold)" }}
                  >
                    Matters.
                  </span>
                </h1>

                <p className="animate-rise [animation-delay:240ms] mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">
                  Breath, posture, voice, and focus — recalibrated before you
                  face the room.
                </p>

                <CtaPair className="animate-rise [animation-delay:320ms] mt-9" />

                <p className="animate-rise [animation-delay:400ms] mt-5 text-xs uppercase tracking-widest text-muted-foreground">
                  USD {lifetimePrice} · one time · private license
                </p>
              </div>

              {/* instrument */}
              <div className="animate-rise [animation-delay:80ms] relative mx-auto w-full max-w-[26rem]">
                <Particles />
                <div className="aspect-square w-full">
                  <ResetDial />
                </div>
              </div>
            </div>
          </div>

          {/* meta strip — the three assurances, on the page rail */}
          <div className="relative mx-auto max-w-6xl px-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-border py-7 sm:justify-between">
              {assurances.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--gold)" }}
                    aria-hidden
                  />
                  <span className="text-sm text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <GradientBar className="h-1 w-full" />
        </section>

        {/* THE RESET — editorial numbered split, the shape Executive Edge
            uses for its "moment / shift" section. */}
        <section aria-labelledby="reset-heading">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-5 sm:py-24">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              The Reset
            </p>
            <h2
              id="reset-heading"
              className="mt-4 max-w-2xl font-display text-3xl leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Four channels, recalibrated in order.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Pressure shows up in the body before it shows up in the decision.
              Every protocol works the same four channels, in the same sequence,
              on a fixed clock.
            </p>

            <ol className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-0 lg:grid-cols-4 lg:divide-x lg:divide-border">
              {PHASES.map((p, i) => (
                <li key={p.label} className="relative lg:px-8 lg:first:pl-0">
                  <span
                    className="pointer-events-none block font-display text-[5.5rem] leading-none"
                    style={{
                      color:
                        "color-mix(in oklab, var(--gold) 16%, transparent)",
                    }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="-mt-1">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                      <p.icon
                        className="h-3.5 w-3.5"
                        style={{ color: "var(--gold)" }}
                        aria-hidden
                      />
                      {p.label}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-foreground/85">
                      {p.note}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FINAL CTA — framed panel, bookending the hero the way Executive
            Edge closes its long page. */}
        <section className="px-4 pb-10 md:px-6 md:pb-14">
          <div
            className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-border"
            style={{ backgroundColor: "var(--secondary)" }}
          >
            <GradientBar className="h-1.5 w-full" />
            <div
              className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full blur-3xl"
              style={{
                backgroundColor:
                  "color-mix(in oklab, var(--gold) 14%, transparent)",
              }}
            />
            <Particles />

            <div className="relative flex flex-col items-center px-6 py-16 text-center md:py-20">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Restore executive composure in under five minutes
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-3xl tracking-tight text-foreground md:text-4xl">
                Be ready for the moment that matters.
              </h2>
              <CtaPair className="mt-9 justify-center" />
              <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">
                USD {lifetimePrice} · one time · private license
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
