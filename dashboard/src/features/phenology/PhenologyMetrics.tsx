import { TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { CropId, PhenologyModelEvaluation } from "@/lib/data/types";

import { CROP_LABELS, PHENOLOGY_COPY } from "./phenology-copy";

export interface PhenologyMetricsProps {
  readonly crop: CropId;
  readonly metric?: PhenologyModelEvaluation;
}

export function PhenologyMetrics({ crop, metric }: PhenologyMetricsProps) {
  return (
    <Card>
      <section aria-label={PHENOLOGY_COPY.metricsRegionLabel} className="px-5 py-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-600" />
              <h3 className="text-base font-semibold text-slate-900">HSGP model metrics</h3>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">{CROP_LABELS[crop]}</p>
          </div>
          {metric && (
            <p className="text-sm font-medium text-slate-700">{`${formatCount(metric.nObservations)} observations`}</p>
          )}
        </div>

        {metric ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            <MetricTile label="RMSE" value={formatMetric(metric.rmse)} tone="emerald" />
            <MetricTile label="MAE" value={formatMetric(metric.mae)} tone="emerald" />
            <MetricTile label="Coverage 50" value={formatPercent(metric.coverage50)} tone="sky" />
            <MetricTile label="Coverage 90" value={formatPercent(metric.coverage90)} tone="sky" />
            <MetricTile label="Mean CRPS" value={formatMetric(metric.meanCrps)} tone="violet" />
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-700">
            No HSGP model metrics for {CROP_LABELS[crop]}.
          </div>
        )}
      </section>
    </Card>
  );
}

const toneClasses = {
  emerald: "from-emerald-50 to-white border-emerald-100",
  sky: "from-sky-50 to-white border-sky-100",
  violet: "from-violet-50 to-white border-violet-100"
} as const;

const toneLabelClasses = {
  emerald: "text-emerald-700",
  sky: "text-sky-700",
  violet: "text-violet-700"
} as const;

function MetricTile({ label, value, tone }: { label: string; value: string; tone: keyof typeof toneClasses }) {
  return (
    <div className={`rounded-xl border bg-gradient-to-br px-4 py-3 ${toneClasses[tone]}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest ${toneLabelClasses[tone]}`}>{label}</p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
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
  return `${percent.toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`;
}

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}
