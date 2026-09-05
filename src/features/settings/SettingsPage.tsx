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
          <h1 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Configuration.
          </h1>
        </div>

        <section className="panel-surface mt-10 rounded-md px-5 py-2 sm:mt-14 sm:px-9 sm:py-4">
          <Row
            label="Dark interface"
            hint="Default and permanent for low-light discretion."
          >
            <Toggle checked label="Dark interface" disabled />
          </Row>
          <Row
            label="Text guidance"
            hint="On-screen instruction during protocols."
          >
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
            When you complete a protocol, Sanctuary records which protocol it
            was and how long it ran to your own account — that is the whole of
            it. No audio, no notes, nothing you type. Favorites and preferences
            never leave this device.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Nothing is public. There are no profiles and no social layer, and
            your activity is never sold, shared with third parties, or
            attributed to you anywhere outside your own account.
          </p>
          <button
            onClick={() => update({ sessions: [], favorites: [] })}
            className="mt-6 w-full rounded-md border border-border-strong px-6 py-3 text-xs uppercase tracking-[0.18em] transition-colors duration-300 hover:border-destructive/60 hover:text-destructive sm:w-auto"
          >
            Clear local session data
          </button>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Clears the history and favorites held on this device. The record on
            your account is kept — to remove that, contact us and we will erase
            it.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
