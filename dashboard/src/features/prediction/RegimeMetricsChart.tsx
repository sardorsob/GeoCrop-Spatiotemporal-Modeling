import type { DataPointSource, RegimeMetric, RotationRegimeId } from "@/lib/data/types";

import { formatCount, formatPercent, predictionCopy, regimeLabels } from "./prediction-copy";

interface RegimeMetricsChartProps {
  readonly metrics: readonly RegimeMetric[];
}

const regimeOrder: Readonly<Record<RotationRegimeId, number>> = {
  regular: 0,
  monoculture: 1,
  irregular: 2
};

export function RegimeMetricsChart({ metrics }: RegimeMetricsChartProps) {
  if (metrics.length === 0) {
    return (
      <section className="border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-950">Rotation regime metrics</h3>
        <p className="mt-2 text-sm text-slate-600">No regime-stratified metrics are available.</p>
      </section>
    );
  }

  const sortedMetrics = [...metrics].sort(
    (left, right) => regimeOrder[left.rotationRegime] - regimeOrder[right.rotationRegime]
  );
  const source = sortedMetrics[0]?.source;

  return (
    <section className="border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Rotation regime metrics</h3>
          <p className="mt-1 text-sm text-slate-600">{predictionCopy.irregularRegimeCaveat}</p>
        </div>
        <SourcePill source={source} />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table aria-label="Rotation regime metrics" className="min-w-[42rem] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-3" scope="col">Regime</th>
              <th className="px-3 py-2" scope="col">Pixels</th>
              <th className="px-3 py-2" scope="col">Overall accuracy</th>
              <th className="px-3 py-2" scope="col">Macro F1</th>
              <th className="px-3 py-2" scope="col">Corn F1</th>
              <th className="px-3 py-2" scope="col">Soybean F1</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedMetrics.map((metric) => (
              <tr key={metric.rotationRegime}>
                <th className="py-3 pr-3 text-left font-semibold text-slate-900" scope="row">
                  {regimeLabels[metric.rotationRegime]}
                </th>
                <td className="px-3 py-3 text-slate-700">{formatCount(metric.nPixels)}</td>
                <td className="px-3 py-3 text-slate-700">{formatPercent(metric.overallAccuracy)}</td>
                <td className="px-3 py-3 font-semibold text-slate-950">
                  {formatPercent(metric.macroF1)}
                </td>
                <td className="px-3 py-3 text-slate-700">{formatPercent(metric.f1Corn)}</td>
                <td className="px-3 py-3 text-slate-700">{formatPercent(metric.f1Soybean)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SourcePill({ source }: { readonly source?: DataPointSource }) {
  if (!source) {
    return null;
  }

  return (
    <p className="shrink-0 border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
      {source.label ?? source.sourceId}
    </p>
  );
}
