import type { CropId, PhenologyModelEvaluation } from "@/lib/data/types";

import { CROP_LABELS, PHENOLOGY_COPY } from "./phenology-copy";

export interface PhenologyMetricsProps {
  readonly crop: CropId;
  readonly metric?: PhenologyModelEvaluation;
}

export function PhenologyMetrics({ crop, metric }: PhenologyMetricsProps) {
  return (
    <section
      aria-label={PHENOLOGY_COPY.metricsRegionLabel}
      className="border border-slate-200 bg-white p-4"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            HSGP model metrics
          </h3>
          <p className="text-sm text-slate-600">{CROP_LABELS[crop]}</p>
        </div>
        {metric ? (
          <p className="text-sm font-medium text-slate-700">
            {formatCount(metric.nObservations)} observations
          </p>
        ) : null}
      </div>

      {metric ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["RMSE", formatMetric(metric.rmse)],
            ["MAE", formatMetric(metric.mae)],
            ["Coverage 50", formatPercent(metric.coverage50)],
            ["Coverage 90", formatPercent(metric.coverage90)],
            ["Mean CRPS", formatMetric(metric.meanCrps)]
          ].map(([label, value]) => (
            <div
              className="min-h-24 border border-slate-200 bg-slate-50 px-3 py-3"
              key={label}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {value}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 border border-dashed border-slate-300 bg-slate-50 px-4 py-5">
          <p className="text-sm font-medium text-slate-800">
            No HSGP model metrics for {CROP_LABELS[crop]}.
          </p>
        </div>
      )}
    </section>
  );
}

function formatMetric(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
  });
}

function formatPercent(value: number): string {
  const percent = Math.abs(value) <= 1 ? value * 100 : value;

  return `${percent.toLocaleString("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  })}%`;
}

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}
