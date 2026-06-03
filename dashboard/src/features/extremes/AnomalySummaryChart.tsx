import type { AnomalyStateCropSummary, ExtremeEventId } from "@/lib/data/types";

import {
  EXTREME_EVENT_DETAILS,
  formatCount,
  formatPercent,
  formatProbability,
  formatZScore
} from "./extremes-copy";

export interface AnomalySummaryChartProps {
  readonly eventId: ExtremeEventId;
  readonly rows: readonly AnomalyStateCropSummary[];
}

export function AnomalySummaryChart({
  eventId,
  rows
}: AnomalySummaryChartProps) {
  if (rows.length === 0) {
    return (
      <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-950">
          Anomaly summary
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          No anomaly rows are available for the selected filters.
        </p>
      </section>
    );
  }

  const aggregate = summarizeRows(rows);

  return (
    <section
      aria-label="Anomaly z-score summary"
      className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Anomaly summary
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {EXTREME_EVENT_DETAILS[eventId].description}
          </p>
        </div>
        <p className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
          {formatCount(aggregate.totalPixelWeeks)} pixel-weeks
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Weighted mean z-score"
          tone={aggregate.weightedMeanZ >= 0 ? "wet" : "dry"}
          value={formatZScore(aggregate.weightedMeanZ)}
        />
        <MetricCard
          label="Max z-score"
          tone="wet"
          value={formatZScore(aggregate.maxZ)}
        />
        <MetricCard
          label="Observed z > 1"
          tone="wet"
          value={formatPercent(aggregate.fractionObservedZGreaterThan1)}
        />
        <MetricCard
          label="Mean NIG P(drought)"
          tone="dry"
          value={formatProbability(aggregate.meanNigPDrought)}
        />
      </div>
    </section>
  );
}

function MetricCard({
  label,
  tone,
  value
}: {
  readonly label: string;
  readonly tone: "dry" | "wet";
  readonly value: string;
}) {
  const toneClassName =
    tone === "wet"
      ? "border-sky-400 bg-sky-50 text-sky-950"
      : "border-amber-400 bg-amber-50 text-amber-950";

  return (
    <div className={`rounded-xl border-l-4 px-4 py-4 shadow-sm ${toneClassName}`}>
      <p className="text-xs font-semibold uppercase tracking-widest">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function summarizeRows(rows: readonly AnomalyStateCropSummary[]) {
  const totalPixelWeeks = rows.reduce((sum, row) => sum + row.nPixelWeeks, 0);
  const weight = (row: AnomalyStateCropSummary) =>
    totalPixelWeeks > 0 ? row.nPixelWeeks : 1;
  const denominator = totalPixelWeeks > 0 ? totalPixelWeeks : rows.length;

  return {
    totalPixelWeeks,
    weightedMeanZ: weightedAverage(rows, (row) => row.meanZ, weight, denominator),
    maxZ: Math.max(...rows.map((row) => row.maxZ)),
    fractionObservedZGreaterThan1: weightedAverage(
      rows,
      (row) => row.fractionObservedZGreaterThan1,
      weight,
      denominator
    ),
    meanNigPDrought: weightedAverage(
      rows,
      (row) => row.meanNigPDrought,
      weight,
      denominator
    )
  };
}

function weightedAverage(
  rows: readonly AnomalyStateCropSummary[],
  getValue: (row: AnomalyStateCropSummary) => number,
  getWeight: (row: AnomalyStateCropSummary) => number,
  denominator: number
): number {
  if (denominator === 0) {
    return 0;
  }

  return rows.reduce((sum, row) => sum + getValue(row) * getWeight(row), 0) / denominator;
}
