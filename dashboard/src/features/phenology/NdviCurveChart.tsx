import type {
  CropId,
  PhenologyPoint,
  PhenologySeries
} from "@/lib/data/types";

import {
  CROP_LABELS,
  PHENOLOGY_COPY,
  STATIC_FALLBACK_FIGURES
} from "./phenology-copy";

export interface NdviCurveChartProps {
  readonly crop: CropId;
  readonly series: readonly PhenologySeries[];
}

interface PlotPoint {
  readonly dayOfYear: number;
  readonly value: number;
  readonly lower?: number;
  readonly upper?: number;
}

const chartWidth = 640;
const chartHeight = 320;
const padding = {
  top: 24,
  right: 88,
  bottom: 48,
  left: 48
};

export function NdviCurveChart({ crop, series }: NdviCurveChartProps) {
  const cropLabel = CROP_LABELS[crop];
  const cropSeries = series.filter((item) => item.crop === crop);
  const posteriorPoints = getPosteriorPoints(cropSeries);
  const empiricalPoints = getEmpiricalPoints(cropSeries);

  if (posteriorPoints.length === 0 && empiricalPoints.length === 0) {
    return <StaticFallback cropLabel={cropLabel} />;
  }

  const allPoints = [...posteriorPoints, ...empiricalPoints];
  const yValues = allPoints.flatMap((point) => [
    point.value,
    point.lower ?? point.value,
    point.upper ?? point.value
  ]);
  const xMin = Math.min(...allPoints.map((point) => point.dayOfYear));
  const xMax = Math.max(...allPoints.map((point) => point.dayOfYear));
  const yMin = Math.max(0, Math.min(...yValues) - 0.05);
  const yMax = Math.min(1, Math.max(...yValues) + 0.05);
  const xDomain = widenDomain(xMin, xMax);
  const yDomain = widenDomain(yMin, yMax);
  const x = (dayOfYear: number) =>
    scale(dayOfYear, xDomain[0], xDomain[1], padding.left, chartWidth - padding.right);
  const y = (value: number) =>
    scale(value, yDomain[0], yDomain[1], chartHeight - padding.bottom, padding.top);
  const posteriorLine = toPolylinePoints(posteriorPoints, x, y);
  const empiricalLine = toPolylinePoints(empiricalPoints, x, y);
  const bandPoints = toBandPoints(posteriorPoints, x, y);
  const posteriorPeak = getPeakPoint(posteriorPoints);
  const empiricalPeak = getPeakPoint(empiricalPoints);
  const posteriorLabelPoint = posteriorPoints.at(-1);
  const empiricalLabelPoint = empiricalPoints.at(-1);

  return (
    <section
      aria-label={PHENOLOGY_COPY.chartRegionLabel}
      className="border border-slate-200 bg-white p-4"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            NDVI curve
          </h3>
          <p className="text-sm text-slate-600">{cropLabel}</p>
        </div>
        <p className="text-sm font-medium text-slate-700">
          {PHENOLOGY_COPY.uncertaintyLabel}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg
          aria-label={`${cropLabel} NDVI phenology curve`}
          className="h-auto min-w-[36rem] max-w-full"
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          <rect fill="#f8fafc" height={chartHeight} width={chartWidth} />
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <g key={tick}>
              <line
                stroke="#e2e8f0"
                strokeWidth="1"
                x1={padding.left}
                x2={chartWidth - padding.right}
                y1={y(tick)}
                y2={y(tick)}
              />
              <text
                fill="#475569"
                fontSize="12"
                textAnchor="end"
                x={padding.left - 10}
                y={y(tick) + 4}
              >
                {tick.toFixed(2)}
              </text>
            </g>
          ))}
          {[xDomain[0], Math.round((xDomain[0] + xDomain[1]) / 2), xDomain[1]].map(
            (tick) => (
              <g key={tick}>
                <line
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  x1={x(tick)}
                  x2={x(tick)}
                  y1={chartHeight - padding.bottom}
                  y2={chartHeight - padding.bottom + 6}
                />
                <text
                  fill="#475569"
                  fontSize="12"
                  textAnchor="middle"
                  x={x(tick)}
                  y={chartHeight - 18}
                >
                  DOY {Math.round(tick)}
                </text>
              </g>
            )
          )}
          <line
            stroke="#94a3b8"
            strokeWidth="1.5"
            x1={padding.left}
            x2={chartWidth - padding.right}
            y1={chartHeight - padding.bottom}
            y2={chartHeight - padding.bottom}
          />
          <line
            stroke="#94a3b8"
            strokeWidth="1.5"
            x1={padding.left}
            x2={padding.left}
            y1={padding.top}
            y2={chartHeight - padding.bottom}
          />
          {bandPoints ? (
            <polygon fill="#99f6e4" fillOpacity="0.55" points={bandPoints} />
          ) : null}
          {posteriorLine ? (
            <polyline
              fill="none"
              points={posteriorLine}
              stroke="#0f766e"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          ) : null}
          {empiricalLine ? (
            <polyline
              fill="none"
              points={empiricalLine}
              stroke="#d97706"
              strokeDasharray="6 5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          ) : null}
          {posteriorLabelPoint ? (
            <text
              fill="#0f766e"
              fontSize="13"
              fontWeight="700"
              x={clamp(x(posteriorLabelPoint.dayOfYear) + 10, padding.left, chartWidth - padding.right + 48)}
              y={clamp(y(posteriorLabelPoint.value) - 10, padding.top + 12, chartHeight - padding.bottom)}
            >
              HSGP posterior
            </text>
          ) : null}
          {empiricalLabelPoint ? (
            <text
              fill="#b45309"
              fontSize="13"
              fontWeight="700"
              x={clamp(x(empiricalLabelPoint.dayOfYear) + 10, padding.left, chartWidth - padding.right + 48)}
              y={clamp(y(empiricalLabelPoint.value) + 20, padding.top + 16, chartHeight - padding.bottom)}
            >
              Empirical NDVI
            </text>
          ) : null}
          <text
            fill="#334155"
            fontSize="12"
            fontWeight="600"
            x={padding.left}
            y={16}
          >
            NDVI
          </text>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        {posteriorPeak ? (
          <p className="border-l-4 border-teal-600 bg-teal-50 px-3 py-2">
            Peak posterior: {formatNdvi(posteriorPeak.value)} at DOY{" "}
            {posteriorPeak.dayOfYear}
          </p>
        ) : null}
        {empiricalPeak ? (
          <p className="border-l-4 border-amber-500 bg-amber-50 px-3 py-2">
            Peak empirical: {formatNdvi(empiricalPeak.value)} at DOY{" "}
            {empiricalPeak.dayOfYear}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function StaticFallback({ cropLabel }: { readonly cropLabel: string }) {
  return (
    <section
      aria-label={PHENOLOGY_COPY.chartRegionLabel}
      className="border border-slate-200 bg-white p-4"
    >
      <div>
        <h3 className="text-base font-semibold text-slate-950">
          NDVI curve fallback
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          No NDVI curve series were provided for {cropLabel}. Static Task 1
          figure fallbacks are documented below.
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {STATIC_FALLBACK_FIGURES.map((figure) => (
          <figure
            aria-label={figure.alt}
            className="min-h-40 border border-dashed border-slate-300 bg-slate-50 p-3"
            key={figure.src}
            role="img"
          >
            <div className="flex h-20 items-center justify-center border border-slate-200 bg-white text-center text-sm font-semibold text-slate-700">
              {figure.label}
            </div>
            <figcaption className="mt-3 break-words text-xs leading-5 text-slate-600">
              {figure.src}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function getPosteriorPoints(series: readonly PhenologySeries[]): readonly PlotPoint[] {
  return series
    .flatMap((item) => item.points)
    .filter((point) => point.posteriorMean !== undefined)
    .map((point) => ({
      dayOfYear: point.dayOfYear,
      value: point.posteriorMean as number,
      lower: point.credibleInterval05,
      upper: point.credibleInterval95
    }))
    .sort(sortByDayOfYear);
}

function getEmpiricalPoints(series: readonly PhenologySeries[]): readonly PlotPoint[] {
  return series
    .flatMap((item) => item.points)
    .filter((point) => point.empiricalMeanNdvi !== undefined)
    .map((point) => ({
      dayOfYear: point.dayOfYear,
      value: point.empiricalMeanNdvi as number
    }))
    .sort(sortByDayOfYear);
}

function sortByDayOfYear(
  left: Pick<PhenologyPoint, "dayOfYear">,
  right: Pick<PhenologyPoint, "dayOfYear">
): number {
  return left.dayOfYear - right.dayOfYear;
}

function toPolylinePoints(
  points: readonly PlotPoint[],
  x: (dayOfYear: number) => number,
  y: (value: number) => number
): string | undefined {
  if (points.length === 0) {
    return undefined;
  }

  return points
    .map((point) => `${roundSvg(x(point.dayOfYear))},${roundSvg(y(point.value))}`)
    .join(" ");
}

function toBandPoints(
  points: readonly PlotPoint[],
  x: (dayOfYear: number) => number,
  y: (value: number) => number
): string | undefined {
  const band = points.filter(
    (point) => point.lower !== undefined && point.upper !== undefined
  );

  if (band.length < 2) {
    return undefined;
  }

  const upper = band.map(
    (point) => `${roundSvg(x(point.dayOfYear))},${roundSvg(y(point.upper as number))}`
  );
  const lower = [...band]
    .reverse()
    .map(
      (point) => `${roundSvg(x(point.dayOfYear))},${roundSvg(y(point.lower as number))}`
    );

  return [...upper, ...lower].join(" ");
}

function getPeakPoint(points: readonly PlotPoint[]): PlotPoint | undefined {
  return points.reduce<PlotPoint | undefined>((peak, point) => {
    if (!peak || point.value > peak.value) {
      return point;
    }

    return peak;
  }, undefined);
}

function widenDomain(min: number, max: number): readonly [number, number] {
  if (min === max) {
    return [min - 1, max + 1];
  }

  return [min, max];
}

function scale(
  value: number,
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number
): number {
  return rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundSvg(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatNdvi(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
}
