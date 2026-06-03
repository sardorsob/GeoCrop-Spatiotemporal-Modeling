import type { DataPointSource, ShapFeature } from "@/lib/data/types";

import { formatFeatureLabel, formatShapValue } from "./prediction-copy";

interface ShapFeatureChartProps {
  readonly features: readonly ShapFeature[];
  readonly topN?: number;
}

export function ShapFeatureChart({ features, topN = 5 }: ShapFeatureChartProps) {
  if (features.length === 0) {
    return (
      <section className="border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-950">SHAP feature ranking</h3>
        <p className="mt-2 text-sm text-slate-600">No SHAP feature importance rows are available.</p>
      </section>
    );
  }

  const rankedFeatures = [...features]
    .sort((left, right) => right.meanAbsoluteShap - left.meanAbsoluteShap)
    .slice(0, topN);
  const maxValue = Math.max(...rankedFeatures.map((feature) => feature.meanAbsoluteShap), 0);
  const source = rankedFeatures[0]?.source;

  return (
    <section className="border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">SHAP feature ranking</h3>
          <p className="mt-1 text-sm text-slate-600">
            Top {rankedFeatures.length} features by mean absolute SHAP contribution.
          </p>
        </div>
        <SourcePill source={source} />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table aria-label="SHAP feature ranking" className="min-w-[32rem] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-3" scope="col">Rank</th>
              <th className="px-3 py-2" scope="col">Feature</th>
              <th className="px-3 py-2" scope="col">Mean abs SHAP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rankedFeatures.map((feature, index) => (
              <tr key={feature.feature}>
                <td className="py-3 pr-3 font-semibold text-slate-600">{index + 1}</td>
                <th className="px-3 py-3 text-left font-semibold text-slate-900" scope="row">
                  {formatFeatureLabel(feature.feature)}
                </th>
                <td className="px-3 py-3">
                  <ShapBar maxValue={maxValue} value={feature.meanAbsoluteShap} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ShapBar({
  maxValue,
  value
}: {
  readonly maxValue: number;
  readonly value: number;
}) {
  const width = maxValue > 0 ? Math.max(0, Math.min(100, (value / maxValue) * 100)) : 0;

  return (
    <div className="grid min-w-36 gap-1">
      <span className="font-semibold text-slate-950">{formatShapValue(value)}</span>
      <span className="h-2 w-full overflow-hidden bg-slate-100" aria-hidden="true">
        <span className="block h-full bg-sky-600" style={{ width: `${width}%` }} />
      </span>
    </div>
  );
}

function SourcePill({ source }: { readonly source?: DataPointSource }) {
  if (!source) {
    return null;
  }

  return (
    <p className="shrink-0 border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-900">
      {source.label ?? source.sourceId}
    </p>
  );
}
