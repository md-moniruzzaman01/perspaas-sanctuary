import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Protocol } from "@/lib/protocols";
import { cn } from "@/lib/utils";

interface Props {
  protocol: Protocol;
  favorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function ProtocolCard({ protocol, favorite, onToggleFavorite }: Props) {
  return (
    <article className="panel-surface group relative flex flex-col rounded-md p-5 sm:p-6 transition-all duration-500 hover:border-border-strong hover:shadow-[var(--shadow-gold)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{protocol.category}</p>
          <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground">{protocol.name}</h3>
        </div>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(protocol.id)}
            aria-label={favorite ? `Remove ${protocol.name} from favorites` : `Favorite ${protocol.name}`}
            aria-pressed={favorite}
            className="shrink-0 rounded-md border border-border p-2 text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            <Star className={cn("size-4", favorite && "fill-primary text-primary")} />
          </button>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{protocol.description}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-6 border-t border-border pt-5 text-sm">
        <div>
          <dt className="eyebrow">Duration</dt>
          <dd className="mt-1 font-mono text-foreground">{protocol.durationMinutes} min</dd>
        </div>
        <div>
          <dt className="eyebrow">Stress Level</dt>
          <dd className="mt-1 text-foreground">{protocol.stressLevel}</dd>
        </div>
        <div>
          <dt className="eyebrow">Goal</dt>
          <dd className="mt-1 text-foreground">{protocol.goal}</dd>
        </div>
        <div>
          <dt className="eyebrow">Outcome</dt>
          <dd className="mt-1 text-foreground [word-spacing:-0.04em]">{protocol.outcome}</dd>
        </div>
      </dl>

      <Link
        to="/session/$protocolId"
        params={{ protocolId: protocol.id }}
        className="mt-auto inline-flex items-center justify-center rounded-md border border-primary/25 bg-accent px-5 py-3 text-xs uppercase tracking-[0.18em] text-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary"
      >
        Begin Protocol
      </Link>
    </article>
  );
}
