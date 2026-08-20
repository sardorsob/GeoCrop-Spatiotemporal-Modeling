import type {
  AnomalyStateCropSummary,
  CropId,
  DataPointSource,
  ExtremeEventId
} from "@/lib/data/types";
import { CROP_OPTIONS } from "@/lib/state/dashboard-state";

import { AnomalySummaryChart } from "./AnomalySummaryChart";
import { AnomalyTable } from "./AnomalyTable";
import { EventMapComparison } from "./EventMapComparison";
import { EventSelector } from "./EventSelector";
import {
  EXTREMES_COPY,
  formatCount,
  getCropLabel
} from "./extremes-copy";

export interface ExtremesPanelProps {
  readonly anomalySummaries: readonly AnomalyStateCropSummary[];
  readonly selectedEvent?: ExtremeEventId;
  readonly selectedCrop?: CropId;
  readonly selectedState?: string;
  readonly onEventChange?: (eventId: ExtremeEventId) => void;
  readonly onCropChange?: (crop: CropId | undefined) => void;
  readonly onStateChange?: (state: string | undefined) => void;
}

const inputClassName =
  "h-10 w-full rounded-md border border-rule bg-paper px-3 text-sm font-medium text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-focus";

export function ExtremesPanel({
  anomalySummaries,
  onCropChange,
  onStateChange,
  selectedCrop,
  selectedState
}: ExtremesPanelProps) {
  const activeCrop = selectedCrop ?? "corn";
  const cropRows = anomalySummaries.filter((row) => row.crop === activeCrop);
  const sources = collectSources(anomalySummaries);

  return (
    <section aria-labelledby="extremes-heading" className="space-y-4 text-ink">
      <header className="rounded-xl border border-rule bg-paper p-4 sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {EXTREMES_COPY.eyebrow}
            </p>
            <h2
              className="mt-1 font-display text-2xl font-semibold leading-tight text-ink"
              id="extremes-heading"
            >
              {EXTREMES_COPY.heading}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {EXTREMES_COPY.summary}
            </p>
          </div>
          <EventSelector />
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-rule pt-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="grid max-w-xs gap-1 text-sm font-medium text-ink">
            Compared crop
            <select
              aria-label="Compared crop"
              className={inputClassName}
              onChange={(event) => onCropChange?.(event.currentTarget.value as CropId)}
              value={activeCrop}
            >
              {CROP_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <p className="text-sm font-semibold text-primary">
            Compared crop · {getCropLabel(activeCrop)}
          </p>
        </div>
      </header>

      <ComparisonGuide />

      {cropRows.length === 0 ? (
        <p
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"
          role="status"
        >
          {EXTREMES_COPY.emptyState}
        </p>
      ) : null}

      <EventMapComparison
        crop={activeCrop}
        onStateChange={onStateChange}
        rows={anomalySummaries}
        selectedState={selectedState}
      />

      <AnomalySummaryChart rows={cropRows} />

      <details className="rounded-xl border border-rule bg-paper p-4 sm:p-5">
        <summary className="cursor-pointer font-semibold text-ink focus-visible:ring-2 focus-visible:ring-focus">
          Exact state × crop values · {anomalySummaries.length.toLocaleString("en-US")} rows
        </summary>
        <div className="mt-4 border-t border-rule pt-4">
          <AnomalyTable rows={anomalySummaries} />
        </div>
      </details>

      {sources.length > 0 ? <SourceNotes sources={sources} /> : null}
    </section>
  );
}

function ComparisonGuide() {
  return (
    <section
      aria-label="How to read the extreme-event comparison"
      className="grid gap-3 md:grid-cols-3"
    >
      <article className="rounded-xl border border-rule bg-paper p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-800">
          Color · magnitude
        </p>
        <p className="mt-2 text-sm leading-6 text-ink">{EXTREMES_COPY.zScoreCaveat}</p>
      </article>
      <article className="rounded-xl border border-rule bg-paper p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
          Detail · posterior context
        </p>
        <p className="mt-2 text-sm leading-6 text-ink">{EXTREMES_COPY.nigCaveat}</p>
      </article>
      <article className="rounded-xl border border-rule bg-paper p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
          Comparison rule
        </p>
        <p className="mt-2 text-sm leading-6 text-ink">{EXTREMES_COPY.comparisonCaveat}</p>
      </article>
    </section>
  );
}

function SourceNotes({
  sources
}: {
  readonly sources: readonly DataPointSource[];
}) {
  return (
    <details className="rounded-xl border border-rule bg-paper p-4 sm:p-5">
      <summary className="cursor-pointer font-semibold text-ink focus-visible:ring-2 focus-visible:ring-focus">
        Sources and limitations · {sources.length}
      </summary>
      <div className="mt-4 grid gap-3 border-t border-rule pt-4 md:grid-cols-2">
        {sources.map((source) => (
          <article className="rounded-lg border border-rule bg-muted/30 p-3 text-sm" key={`${source.sourceId}-${source.path ?? ""}`}>
            <h3 className="font-semibold text-ink">{source.label ?? source.sourceId}</h3>
            {source.path ? (
              <p className="mt-2 break-all font-mono text-xs leading-5 text-muted-foreground">
                {source.path}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {source.rowCount !== undefined ? <span>{formatCount(source.rowCount)} rows</span> : null}
              {source.dateStamp ? <span>· {source.dateStamp}</span> : null}
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Denominator: {source.denominator ?? EXTREMES_COPY.denominatorFallback}
            </p>
            {source.caveat ? <p className="mt-2 text-sm leading-6 text-ink">{source.caveat}</p> : null}
          </article>
        ))}
      </div>
    </details>
  );
}

function collectSources(
  rows: readonly AnomalyStateCropSummary[]
): readonly DataPointSource[] {
  const seen = new Set<string>();
  const sources: DataPointSource[] = [];

  for (const row of rows) {
    const key = `${row.source.sourceId}-${row.source.path ?? ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      sources.push(row.source);
    }
  }

  return sources;
}
