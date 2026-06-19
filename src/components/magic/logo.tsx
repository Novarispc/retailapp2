import { cn } from "@/lib/utils";

/**
 * CREASE wordmark — condensed display type with a volt "crease" tick mark.
 * Pure SVG/text so it scales crisp and themes with tokens (no raster logo).
 */
export function Logo({
  className,
  showWord = true,
}: {
  className?: string;
  showWord?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[var(--accent)] text-[var(--on-accent)]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          {/* batting-crease tick — a bold popping-crease angle */}
          <path
            d="M4 17.5 L13 6 L13 13 L20 13"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
      </span>
      {showWord && (
        <span className="font-display text-[1.35rem] font-bold uppercase leading-none tracking-[-0.01em] text-foreground">
          Crea<span className="text-[var(--accent)]">se</span>
        </span>
      )}
    </span>
  );
}
