"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import type { PhenologySeries } from "@/lib/data/types";
import { cn } from "@/lib/utils";

import {
  CROP_CHART_COLORS,
  CROP_LABELS,
  CROP_STAGES,
  PHENOLOGY_COPY,
  PHENOLOGY_CROPS,
  STATIC_FALLBACK_FIGURES
} from "./phenology-copy";
import { filterRowsByWindow, getSeasonBounds, type SeasonWindow } from "./season-window";

type ComparatorCrop = (typeof PHENOLOGY_CROPS)[number];

export interface NdviCurveChartProps {
  readonly crop: ComparatorCrop;
  readonly emphasized?: boolean;
  readonly seasonWindow?: SeasonWindow;
  readonly series: readonly PhenologySeries[];
}

interface ChartRow {
  dayOfYear: number;
  posteriorMean?: number;
  posteriorIqr?: [number, number];
  posterior90?: [number, number];
  empiricalQ25?: number;
  empiricalQ75?: number;
}

const MONTH_TICKS = [91, 121, 152, 182, 213, 244, 274] as const;
const MONTH_LABELS = new Map([
  [91, "Apr"],
  [121, "May"],
  [152, "Jun"],
  [182, "Jul"],
  [213, "Aug"],
  [244, "Sep"],
  [274, "Oct"]
]);

export function NdviCurveChart({
  crop,
  emphasized = false,
  seasonWindow,
  series
}: NdviCurveChartProps) {
  const cropLabel = CROP_LABELS[crop];
  const rows = buildRows(series.filter((item) => item.crop === crop));
  const ownBounds = getSeasonBounds(rows);

  if (!ownBounds) return <StaticFallback cropLabel={cropLabel} />;

  const activeWindow = seasonWindow ?? ownBounds;
  const visibleRows = filterRowsByWindow(rows, activeWindow);
  const posteriorPeak = peak(visibleRows, (row) => row.posteriorMean);
  const color = CROP_CHART_COLORS[crop];
  const iqrFillId = `phenology-iqr-${crop}`;
  const intervalFillId = `phenology-90-${crop}`;

  return (
    <Card className={cn("min-w-0 overflow-hidden", emphasized && "ring-2 ring-field/45")}>
      <article aria-labelledby={`phenology-${crop}-heading`}>
        <header className="border-b border-rule px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <h3 className="font-serif text-xl font-semibold text-ink" id={`phenology-${crop}-heading`}>
                  {cropLabel}
                </h3>
              </div>
              {posteriorPeak && (
                <p className="mt-1 text-sm font-semibold tabular-nums text-ink-soft">
                  {`${cropLabel} peak · DOY ${posteriorPeak.dayOfYear} · NDVI ${fmt(posteriorPeak.value)}`}
                </p>
              )}
            </div>
            <ChartLegend color={color} />
          </div>
        </header>

        <CardContent className="min-w-0 px-2 py-4 sm:px-5">
          <p className="px-2 text-xs leading-5 text-muted-foreground">
            {PHENOLOGY_COPY.uncertaintyLabel}
          </p>
          <p className="px-2 text-xs font-semibold leading-5 text-ink-soft">
            {PHENOLOGY_COPY.focusedScaleNote}
          </p>

          <div
            role="img"
            aria-label={`${cropLabel} NDVI phenology curve`}
            className="mt-2 h-64 min-h-64 min-w-0 w-full sm:h-72 sm:min-h-72"
          >
            <ResponsiveContainer
              height="100%"
              initialDimension={{ height: 256, width: 320 }}
              minHeight={0}
              minWidth={0}
              width="100%"
            >
              <ComposedChart
                data={visibleRows}
                margin={{ top: 10, right: 12, bottom: 16, left: -8 }}
              >
                <defs>
                  <linearGradient id={intervalFillId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.13} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id={iqrFillId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.14} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#d9d3c7" strokeDasharray="2 5" vertical={false} />
                <XAxis
                  allowDataOverflow
                  axisLine={{ stroke: "#b9b0a2" }}
                  dataKey="dayOfYear"
                  domain={[activeWindow.startDay, activeWindow.endDay]}
                  fontSize={11}
                  tickFormatter={(value) => MONTH_LABELS.get(Number(value)) ?? `${value}`}
                  tickLine={false}
                  ticks={MONTH_TICKS.filter(
                    (day) => day >= activeWindow.startDay && day <= activeWindow.endDay
                  )}
                  type="number"
                />
                <YAxis
                  allowDataOverflow
                  axisLine={false}
                  domain={[0.5, 1]}
                  fontSize={11}
                  tickFormatter={(value) => Number(value).toFixed(1)}
                  tickLine={false}
                  ticks={[0.5, 0.6, 0.7, 0.8, 0.9, 1]}
                  width={42}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fffdf8",
                    border: "1px solid #d9d3c7",
                    borderRadius: 10,
                    boxShadow: "0 12px 30px -18px rgba(43, 38, 31, 0.45)",
                    fontSize: 12
                  }}
                  formatter={(value, name) => {
                    if (Array.isArray(value)) {
                      return [`${fmt(Number(value[0]))}–${fmt(Number(value[1]))}`, labelFor(String(name))];
                    }
                    return [fmt(Number(value)), labelFor(String(name))];
                  }}
                  labelFormatter={(value) => `Day of year ${value}`}
                />
                <Area
                  dataKey="posterior90"
                  fill={`url(#${intervalFillId})`}
                  isAnimationActive={false}
                  stroke="none"
                  type="monotone"
                />
                <Area
                  dataKey="posteriorIqr"
                  fill={`url(#${iqrFillId})`}
                  isAnimationActive={false}
                  stroke="none"
                  type="monotone"
                />
                <Line
                  dataKey="posteriorMean"
                  dot={false}
                  isAnimationActive={false}
                  stroke={color}
                  strokeWidth={2.7}
                  type="monotone"
                />
                <Line
                  dataKey="empiricalQ25"
                  dot={false}
                  isAnimationActive={false}
                  stroke={color}
                  strokeDasharray="4 4"
                  strokeOpacity={0.7}
                  strokeWidth={1.4}
                  type="monotone"
                />
                <Line
                  dataKey="empiricalQ75"
                  dot={false}
                  isAnimationActive={false}
                  stroke={color}
                  strokeDasharray="4 4"
                  strokeOpacity={0.7}
                  strokeWidth={1.4}
                  type="monotone"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <StageList crop={crop} />
        </CardContent>
      </article>
    </Card>
  );
}

function ChartLegend({ color }: { readonly color: string }) {
  return (
    <div className="flex max-w-2xl flex-wrap gap-x-4 gap-y-2 text-[11px] leading-4 text-muted-foreground">
      <LegendSwatch color={color} label="Posterior mean" />
      <LegendSwatch color={color} fillOpacity={0.3} label="Posterior IQR (25–75%)" />
      <LegendSwatch color={color} fillOpacity={0.11} label="Posterior 90% interval" />
      <LegendSwatch color={color} dashed label="Empirical spatial IQR (Q25–Q75)" />
    </div>
  );
}

function LegendSwatch({
  color,
  dashed = false,
  fillOpacity,
  label
}: {
  readonly color: string;
  readonly dashed?: boolean;
  readonly fillOpacity?: number;
  readonly label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className="h-2.5 w-5 rounded-sm border"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)`
            : fillOpacity === undefined
              ? color
              : `color-mix(in srgb, ${color} ${fillOpacity * 100}%, transparent)`,
          borderColor: fillOpacity === undefined || dashed ? "transparent" : color
        }}
      />
      {label}
    </span>
  );
}

function StageList({ crop }: { readonly crop: ComparatorCrop }) {
  return (
    <ul
      aria-label={`${CROP_LABELS[crop]} growth stages`}
      className="mt-3 flex list-none flex-wrap gap-1.5 border-t border-rule px-2 pt-3 text-[10px] leading-4 text-ink-soft sm:text-xs"
    >
      {CROP_STAGES[crop].map((stage) => (
        <li
          key={`${stage.startDay}-${stage.label}`}
          aria-label={`${stage.label}, day ${stage.startDay} to ${stage.endDay}`}
          className="rounded-full border border-rule bg-muted/55 px-2 py-1"
          title={`${stage.label} · DOY ${stage.startDay}–${stage.endDay}`}
        >
          <span>{stage.shortLabel}</span>
          <span aria-hidden="true" className="ml-1 tabular-nums text-muted-foreground">
            {stage.startDay}–{stage.endDay}
          </span>
        </li>
      ))}
    </ul>
  );
}

function StaticFallback({ cropLabel }: { readonly cropLabel: string }) {
  return (
    <Card className="min-w-0">
      <section aria-label={PHENOLOGY_COPY.chartRegionLabel} className="p-5">
        <h3 className="font-semibold text-ink">NDVI evidence unavailable for {cropLabel}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          The normalized series is missing. These versioned paper figures are the documented fallback sources.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {STATIC_FALLBACK_FIGURES.map((figure) => (
            <figure
              key={figure.src}
              aria-label={figure.alt}
              role="img"
              className="min-w-0 rounded-lg border border-dashed border-rule bg-muted/45 p-3 text-xs"
            >
              <div className="flex min-h-16 items-center justify-center rounded-md bg-paper px-2 text-center font-semibold text-ink">
                {figure.label}
              </div>
              <figcaption className="mt-2 break-words font-mono text-[10px] leading-4 text-muted-foreground">
                {figure.src}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </Card>
  );
}

function buildRows(series: readonly PhenologySeries[]): ChartRow[] {
  const byDoy = new Map<number, ChartRow>();

  for (const item of series) {
    for (const point of item.points) {
      const row = byDoy.get(point.dayOfYear) ?? { dayOfYear: point.dayOfYear };
      if (point.posteriorMean !== undefined) row.posteriorMean = point.posteriorMean;
      if (point.posteriorIqr25 !== undefined && point.posteriorIqr75 !== undefined) {
        row.posteriorIqr = [point.posteriorIqr25, point.posteriorIqr75];
      }
      if (point.credibleInterval05 !== undefined && point.credibleInterval95 !== undefined) {
        row.posterior90 = [point.credibleInterval05, point.credibleInterval95];
      }
      if (point.empiricalQ25Ndvi !== undefined) row.empiricalQ25 = point.empiricalQ25Ndvi;
      if (point.empiricalQ75Ndvi !== undefined) row.empiricalQ75 = point.empiricalQ75Ndvi;
      byDoy.set(point.dayOfYear, row);
    }
  }

  return [...byDoy.values()].sort((a, b) => a.dayOfYear - b.dayOfYear);
}

function peak(
  rows: readonly ChartRow[],
  pick: (row: ChartRow) => number | undefined
): { dayOfYear: number; value: number } | undefined {
  let best: { dayOfYear: number; value: number } | undefined;
  for (const row of rows) {
    const value = pick(row);
    if (value !== undefined && (!best || value > best.value)) {
      best = { dayOfYear: row.dayOfYear, value };
    }
  }
  return best;
}

function fmt(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
}

function labelFor(key: string): string {
  const labels: Readonly<Record<string, string>> = {
    posteriorMean: "Posterior mean",
    posteriorIqr: "Posterior IQR",
    posterior90: "Posterior 90% interval",
    empiricalQ25: "Empirical Q25",
    empiricalQ75: "Empirical Q75"
  };
  return labels[key] ?? key;
}
