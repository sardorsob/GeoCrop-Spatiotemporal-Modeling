import type { RegimeMetric, RotationRegimeId } from "@/lib/data/types";

import { formatCount, formatPercent, predictionCopy, regimeLabels } from "./prediction-copy";

interface RegimeMetricsChartProps {
  readonly metrics: readonly RegimeMetric[];
}

const regimeOrder: readonly RotationRegimeId[] = ["monoculture", "regular", "irregular"];

export function RegimeMetricsChart({ metrics }: RegimeMetricsChartProps) {
  if (metrics.length === 0) {
    return (
      <section className="rounded-xl border border-rule bg-paper p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold text-ink">Rotation regime accuracy</h3>
        <p className="mt-2 text-sm text-muted-foreground">No regime-stratified metrics are available.</p>
      </section>
    );
  }

  const metricsByRegime = new Map(metrics.map((metric) => [metric.rotationRegime, metric]));
  const sortedMetrics = regimeOrder.flatMap((regime) => {
    const metric = metricsByRegime.get(regime);
    return metric ? [metric] : [];
  });
  const highest = sortedMetrics[0];
  const lowest = sortedMetrics.at(-1);
  const gap = highest && lowest ? (highest.overallAccuracy - lowest.overallAccuracy) * 100 : undefined;
  const source = sortedMetrics[0]?.source;

  return (
    <section
      aria-label="Rotation regime accuracy"
      className="min-w-0 overflow-hidden rounded-xl border border-ink bg-ink text-paper"
    >
      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-paper/60">
            Closing evidence
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold">
            The land is easiest to predict where crop history repeats.
          </h3>
          {gap !== undefined ? (
            <p className="mt-3 font-mono text-lg font-semibold tabular-nums text-corn">
              {gap.toFixed(1)} percentage-point gap
            </p>
          ) : null}
          <p className="mt-2 text-sm leading-6 text-paper/70">{predictionCopy.regimeCaveat}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {sortedMetrics.map((metric) => (
            <article
              aria-label={`${regimeLabels[metric.rotationRegime]} accuracy ${formatPercent(metric.overallAccuracy)}`}
              className="rounded-lg border border-paper/20 bg-paper/10 p-4"
              key={metric.rotationRegime}
            >
              <h4 className="font-semibold">{regimeLabels[metric.rotationRegime]}</h4>
              <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">
                {formatPercent(metric.overallAccuracy)}
              </p>
              <p className="mt-1 text-xs text-paper/60">{formatCount(metric.nPixels)} pixels</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-paper/15 pt-3 text-xs">
                <div>
                  <dt className="text-paper/55">Corn F1</dt>
                  <dd className="mt-0.5 font-mono tabular-nums">{formatPercent(metric.f1Corn)}</dd>
                </div>
                <div>
                  <dt className="text-paper/55">Soy F1</dt>
                  <dd className="mt-0.5 font-mono tabular-nums">{formatPercent(metric.f1Soybean)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>

      {source ? (
        <div className="border-t border-paper/15 px-4 py-3 text-xs leading-5 text-paper/60 sm:px-5">
          <span className="font-semibold text-paper">{source.label ?? source.sourceId}</span>
          {source.path ? <span className="ml-2 break-all font-mono">{source.path}</span> : null}
        </div>
      ) : null}
    </section>
  );
}
