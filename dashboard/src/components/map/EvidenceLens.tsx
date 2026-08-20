import { MapPinned } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CornBeltMapSelectionContext } from "@/features/map/map-selection";

export function EvidenceLens({
  context,
  isPinned,
  onReset
}: {
  readonly context?: CornBeltMapSelectionContext;
  readonly isPinned: boolean;
  readonly onReset: () => void;
}) {
  return (
    <section
      aria-label="Evidence lens"
      className="rounded-2xl border border-rule bg-paper p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary">
            {isPinned ? "Pinned evidence" : "Evidence lens"}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">
            {context?.selection.label ?? "Inspect the study region"}
          </h3>
        </div>
        {isPinned ? (
          <Button
            aria-label="Reset pinned geography"
            onClick={onReset}
            size="sm"
            variant="outline"
          >
            Reset
          </Button>
        ) : null}
      </div>

      {context ? (
        <div className="mt-4 space-y-4 text-sm">
          <div className="rounded-xl bg-field/50 p-3">
            <p className="text-xs font-semibold text-muted-foreground">{context.metricLabel}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{context.displayValue}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {context.rank ? <span>Rank {context.rank} of {context.evidenceCount}</span> : null}
              <span>
                {context.selection.geographyKind === "county"
                  ? `GEOID ${context.geographyId}`
                  : `State ${context.geographyId}`}
              </span>
            </div>
          </div>

          {context.denominator !== undefined ? (
            <p className="leading-5 text-muted-foreground">
              <span className="font-semibold text-ink">Denominator:</span>{" "}
              {context.denominator.toLocaleString()} · {context.denominatorLabel}
            </p>
          ) : null}

          <div className="border-t border-rule pt-3 text-xs leading-5 text-muted-foreground">
            <p className="font-semibold text-ink">{context.sourceLabel}</p>
            {context.sourceDate ? <p>Artifact date: {context.sourceDate}</p> : null}
            {context.sourcePath ? <p className="break-words font-mono">{context.sourcePath}</p> : null}
            <p className="mt-2">{context.caveat}</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-rule p-4 text-sm leading-6 text-muted-foreground">
          <MapPinned className="mb-2 size-5 text-primary" aria-hidden="true" />
          Hover, focus, or tap a geography to inspect its measured value. Click,
          Enter, or Space pins the same evidence.
        </div>
      )}
    </section>
  );
}
