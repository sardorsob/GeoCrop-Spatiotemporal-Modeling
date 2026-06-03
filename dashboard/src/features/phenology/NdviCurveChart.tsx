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
import type { CropId, PhenologySeries } from "@/lib/data/types";

import { CROP_LABELS, PHENOLOGY_COPY, STATIC_FALLBACK_FIGURES } from "./phenology-copy";

export interface NdviCurveChartProps {
  readonly crop: CropId;
  readonly series: readonly PhenologySeries[];
}

interface ChartRow {
  dayOfYear: number;
  posteriorMean?: number;
  band?: [number, number];
  empirical?: number;
}

export function NdviCurveChart({ crop, series }: NdviCurveChartProps) {
  const cropLabel = CROP_LABELS[crop];
  const cropSeries = series.filter((s) => s.crop === crop);

  const rows = buildRows(cropSeries);

  if (rows.length === 0) {
    return <StaticFallback cropLabel={cropLabel} />;
  }

  const posteriorPeak = peak(rows, (r) => r.posteriorMean);
  const empiricalPeak = peak(rows, (r) => r.empirical);

  return (
    <Card>
      <section aria-label={PHENOLOGY_COPY.chartRegionLabel}>
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">NDVI seasonality</h3>
            <p className="text-sm text-slate-500">{cropLabel}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <LegendDot color="#0d9488" label="HSGP posterior" />
            <LegendDot color="#a7f3d0" filled label="90% credible interval" />
            <LegendDot color="#d97706" dashed label="Empirical NDVI" />
          </div>
        </div>

        <p className="px-5 pt-3 text-xs font-medium text-slate-500">
          {PHENOLOGY_COPY.uncertaintyLabel}
        </p>

        <CardContent className="px-2 py-3 sm:px-5">
          <div
            role="img"
            aria-label={`${cropLabel} NDVI phenology curve`}
            className="h-72 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={rows} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <defs>
                  <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5eead4" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#5eead4" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="dayOfYear"
                  tickFormatter={(v) => `DOY ${v}`}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  domain={[0, 1]}
                  ticks={[0, 0.25, 0.5, 0.75, 1]}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)",
                    padding: "8px 12px",
                    fontSize: 12
                  }}
                  labelFormatter={(v) => `Day of year ${v}`}
                  formatter={(value, name) => {
                    if (Array.isArray(value)) return [`${fmt(value[0])} – ${fmt(value[1])}`, "CI 5–95"];
                    return [fmt(value as number), labelFor(name as string)];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="band"
                  stroke="none"
                  fill="url(#bandFill)"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="posteriorMean"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="empirical"
                  stroke="#d97706"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid gap-2 px-3 text-sm sm:grid-cols-2">
            {posteriorPeak && (
              <p className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white px-4 py-3 font-medium text-teal-900">
                {`Peak posterior: ${fmt(posteriorPeak.value)} at DOY ${posteriorPeak.dayOfYear}`}
              </p>
            )}
            {empiricalPeak && (
              <p className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white px-4 py-3 font-medium text-amber-900">
                {`Peak empirical: ${fmt(empiricalPeak.value)} at DOY ${empiricalPeak.dayOfYear}`}
              </p>
            )}
          </div>
        </CardContent>
      </section>
    </Card>
  );
}

function StaticFallback({ cropLabel }: { readonly cropLabel: string }) {
  return (
    <Card>
      <section aria-label={PHENOLOGY_COPY.chartRegionLabel} className="p-5">
        <h3 className="text-base font-semibold text-slate-900">NDVI curve fallback</h3>
        <p className="mt-1 text-sm text-slate-500">
          No NDVI series available for {cropLabel}. Static figure fallbacks are referenced below.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {STATIC_FALLBACK_FIGURES.map((figure) => (
            <figure
              key={figure.src}
              aria-label={figure.alt}
              role="img"
              className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs"
            >
              <div className="flex h-20 items-center justify-center rounded-lg border border-slate-100 bg-white text-sm font-semibold text-slate-700">
                {figure.label}
              </div>
              <figcaption className="mt-2 break-words leading-5 text-slate-500">
                {figure.src}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </Card>
  );
}

function LegendDot({ color, label, filled, dashed }: { color: string; label: string; filled?: boolean; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-600">
      {filled ? (
        <span className="h-2 w-4 rounded-sm" style={{ backgroundColor: color }} />
      ) : (
        <span
          className="h-0.5 w-4 rounded-full"
          style={{
            background: dashed
              ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)`
              : color
          }}
        />
      )}
      {label}
    </span>
  );
}

function buildRows(series: readonly PhenologySeries[]): ChartRow[] {
  const byDoy = new Map<number, ChartRow>();
  for (const s of series) {
    for (const p of s.points) {
      const existing = byDoy.get(p.dayOfYear) ?? { dayOfYear: p.dayOfYear };
      if (p.posteriorMean !== undefined) existing.posteriorMean = p.posteriorMean;
      if (p.credibleInterval05 !== undefined && p.credibleInterval95 !== undefined) {
        existing.band = [p.credibleInterval05, p.credibleInterval95];
      }
      if (p.empiricalMeanNdvi !== undefined) existing.empirical = p.empiricalMeanNdvi;
      byDoy.set(p.dayOfYear, existing);
    }
  }
  return [...byDoy.values()].sort((a, b) => a.dayOfYear - b.dayOfYear);
}

function peak(rows: readonly ChartRow[], pick: (r: ChartRow) => number | undefined): { dayOfYear: number; value: number } | undefined {
  let best: { dayOfYear: number; value: number } | undefined;
  for (const r of rows) {
    const v = pick(r);
    if (v === undefined) continue;
    if (!best || v > best.value) best = { dayOfYear: r.dayOfYear, value: v };
  }
  return best;
}

function fmt(v: number): string {
  return v.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function labelFor(key: string): string {
  if (key === "posteriorMean") return "HSGP posterior";
  if (key === "empirical") return "Empirical NDVI";
  return key;
}
