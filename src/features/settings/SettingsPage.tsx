import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SanctuaryGate } from "@/components/sanctuary-gate";
import { useSanctuary } from "@/lib/sanctuary-store";
import { Row, Toggle } from "./settings-controls";

export function SettingsPage() {
  return (
    <SanctuaryGate>
      <SettingsContent />
    </SanctuaryGate>
  );
}

function SettingsContent() {
  const { state, update } = useSanctuary();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-5 sm:py-20">
        <div>
          <p className="eyebrow">Settings</p>
          <h1 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">Configuration.</h1>
        </div>

        <section className="panel-surface mt-10 rounded-md px-5 py-2 sm:mt-14 sm:px-9 sm:py-4">

          <Row label="Dark interface" hint="Default and permanent for low-light discretion.">
            <Toggle checked label="Dark interface" disabled />
          </Row>
          <Row label="Text guidance" hint="On-screen instruction during protocols.">

            <Toggle
              checked={state.textGuidance}
              onChange={(v) => update({ textGuidance: v })}
              label="Text guidance"
            />
          </Row>
        </section>

        <section className="panel-surface mt-6 rounded-md p-6 sm:mt-8 sm:p-9">

          <h2 className="eyebrow">Privacy</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Session history, favorites, and preferences are stored locally on this device. Nothing is
            published, shared, or attributed. Built for executives who value discretion.
          </p>
          <button
            onClick={() => update({ sessions: [], favorites: [] })}
            className="mt-6 w-full rounded-md border border-border-strong px-6 py-3 text-xs uppercase tracking-[0.18em] transition-colors duration-300 hover:border-destructive/60 hover:text-destructive sm:w-auto"
          >
            Clear local session data
          </button>

        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
