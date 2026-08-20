import { Activity } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { CropId, PhenologyModelEvaluation } from "@/lib/data/types";

import { CROP_LABELS, PHENOLOGY_COPY, PHENOLOGY_CROPS } from "./phenology-copy";

export interface PhenologyMetricsProps {
  readonly metrics: readonly PhenologyModelEvaluation[];
  readonly focusedCrop?: CropId;
}

export function PhenologyMetrics({ focusedCrop, metrics }: PhenologyMetricsProps) {
  const byCrop = new Map(metrics.map((metric) => [metric.crop, metric]));

  return (
    <Card>
      <section aria-label={PHENOLOGY_COPY.metricsRegionLabel} className="px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <span className="rounded-full border border-field/30 bg-field/10 p-2 text-field-dark">
            <Activity aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h3 className="font-semibold text-ink">HSGP model fit, crop by crop</h3>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              Lower error is better; coverage reports the share captured by each posterior interval.
            </p>
          </div>
        </div>

        <table className="mt-4 w-full table-fixed border-collapse text-left text-xs sm:text-sm">
          <thead className="border-b border-rule text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
            <tr>
              <th className="w-[31%] pb-2 pr-2 font-semibold">Crop</th>
              <th className="pb-2 pr-2 font-semibold">RMSE</th>
              <th className="pb-2 pr-2 font-semibold">Coverage 90</th>
              <th className="hidden pb-2 pr-2 font-semibold sm:table-cell">MAE</th>
              <th className="hidden pb-2 pr-2 font-semibold md:table-cell">Coverage 50</th>
              <th className="hidden pb-2 font-semibold lg:table-cell">Mean CRPS</th>
            </tr>
          </thead>
          <tbody>
            {PHENOLOGY_CROPS.map((crop) => (
              <MetricRow
                key={crop}
                crop={crop}
                focused={focusedCrop === crop}
                metric={byCrop.get(crop)}
              />
            ))}
          </tbody>
        </table>
      </section>
    </Card>
  );
}

function MetricRow({
  crop,
  focused,
  metric
}: {
  readonly crop: (typeof PHENOLOGY_CROPS)[number];
  readonly focused: boolean;
  readonly metric?: PhenologyModelEvaluation;
}) {
  const cellClass = "border-b border-rule/70 py-3 pr-2 tabular-nums last:border-b-0";

  return (
    <tr className={focused ? "bg-field/5" : undefined}>
      <th className={`${cellClass} font-semibold text-ink`} scope="row">
        <span className="block leading-tight">{CROP_LABELS[crop]}</span>
        <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground sm:text-xs">
          {metric ? `${formatCount(metric.nObservations)} obs.` : "No metrics"}
        </span>
      </th>
      <td className={cellClass}>{metric ? formatMetric(metric.rmse) : "—"}</td>
      <td className={cellClass}>{metric ? formatPercent(metric.coverage90) : "—"}</td>
      <td className={`${cellClass} hidden sm:table-cell`}>
        {metric ? formatMetric(metric.mae) : "—"}
      </td>
      <td className={`${cellClass} hidden md:table-cell`}>
        {metric ? formatPercent(metric.coverage50) : "—"}
      </td>
      <td className={`${cellClass} hidden lg:table-cell`}>
        {metric ? formatMetric(metric.meanCrps) : "—"}
      </td>
    </tr>
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
