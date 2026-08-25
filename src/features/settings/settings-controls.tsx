export function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-6 last:border-b-0 sm:gap-8 sm:py-8">
      <div className="min-w-0">
        <p className="text-sm text-foreground">{label}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className="h-6 w-11 shrink-0 rounded-full border border-border-strong bg-accent p-0.5 transition-colors duration-300 disabled:opacity-40"
    >
      <span
        className="block size-4 rounded-full bg-muted-foreground transition-all duration-300"
        style={
          checked
            ? { transform: "translateX(20px)", backgroundImage: "var(--gradient-gold)" }
            : undefined
        }
      />
    </button>
  );
}
