import type { AnomalyStateCropSummary, ExtremeEventId } from "@/lib/data/types";
import { EXTREME_EVENT_OPTIONS } from "@/lib/state/dashboard-state";

import {
  EXTREME_EVENT_DETAILS,
  formatCount,
  formatProbability,
  formatSignedZScore
} from "./extremes-copy";

export interface AnomalySummaryChartProps {
  readonly rows: readonly AnomalyStateCropSummary[];
}

export function AnomalySummaryChart({ rows }: AnomalySummaryChartProps) {
  return (
    <section
      aria-label="Event comparison summary"
      className="rounded-xl border border-rule bg-paper p-4 sm:p-5"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Comparison anchors
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold text-ink">
          Direction first, posterior context second
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Weighted summaries orient the eye; pin a state to inspect the exact evidence behind either map.
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {EXTREME_EVENT_OPTIONS.map((event) => (
          <EventSummary
            eventId={event.id}
            key={event.id}
            rows={rows.filter((row) => row.eventId === event.id)}
          />
        ))}
      </div>
    </section>
  );
}

function EventSummary({
  eventId,
  rows
}: {
  readonly eventId: ExtremeEventId;
  readonly rows: readonly AnomalyStateCropSummary[];
}) {
  const details = EXTREME_EVENT_DETAILS[eventId];

  if (rows.length === 0) {
    return (
      <article className="rounded-lg border border-dashed border-rule bg-muted/30 p-4">
        <p className="font-semibold text-ink">{details.label}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          No state values are available for this crop and event.
        </p>
      </article>
    );
  }

  const aggregate = summarizeRows(rows);

  return (
    <article className="rounded-lg border border-rule bg-muted/30 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-ink">{details.label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {rows.length} state{rows.length === 1 ? "" : "s"}
          </p>
        </div>
        <span className="rounded-full border border-rule bg-paper px-2 py-1 text-xs tabular-nums text-muted-foreground">
          {formatCount(aggregate.totalPixelWeeks)} pixel-weeks
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="border-l-2 border-sky-700 pl-3">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Mean z magnitude
          </dt>
          <dd className="mt-1 font-mono text-xl font-semibold tabular-nums text-ink">
            {formatSignedZScore(aggregate.weightedMeanZ)}
          </dd>
        </div>
        <div className="border-l-2 border-amber-700 pl-3">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            NIG percentile context
          </dt>
          <dd className="mt-1 font-mono text-xl font-semibold tabular-nums text-ink">
            {formatProbability(aggregate.weightedNigPercentile)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

function summarizeRows(rows: readonly AnomalyStateCropSummary[]) {
  const totalPixelWeeks = rows.reduce((sum, row) => sum + row.nPixelWeeks, 0);
  const denominator = totalPixelWeeks > 0 ? totalPixelWeeks : rows.length;
  const weight = (row: AnomalyStateCropSummary) =>
    totalPixelWeeks > 0 ? row.nPixelWeeks : 1;
  const nigRows = rows.filter((row) => Number.isFinite(row.meanNigPDrought));
  const nigPixelWeeks = nigRows.reduce((sum, row) => sum + row.nPixelWeeks, 0);
  const nigDenominator = nigPixelWeeks > 0 ? nigPixelWeeks : nigRows.length;
  const nigWeight = (row: AnomalyStateCropSummary) =>
    nigPixelWeeks > 0 ? row.nPixelWeeks : 1;

  return {
    totalPixelWeeks,
    weightedMeanZ: weightedAverage(rows, (row) => row.meanZ, weight, denominator),
    weightedNigPercentile: weightedAverage(
      nigRows,
      (row) => row.meanNigPDrought,
      nigWeight,
      nigDenominator
    )
  };
}

function weightedAverage(
  rows: readonly AnomalyStateCropSummary[],
  getValue: (row: AnomalyStateCropSummary) => number,
  getWeight: (row: AnomalyStateCropSummary) => number,
  denominator: number
): number {
  if (rows.length === 0 || denominator === 0) {
    return Number.NaN;
  }

  return rows.reduce((sum, row) => sum + getValue(row) * getWeight(row), 0) / denominator;
}
