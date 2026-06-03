import type { AblationResult, DataPointSource } from "@/lib/data/types";

import { formatCount, formatPercent } from "./prediction-copy";

interface AblationChartProps {
  readonly results: readonly AblationResult[];
}

export function AblationChart({ results }: AblationChartProps) {
  if (results.length === 0) {
    return (
      <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-950">Ablation comparison</h3>
        <p className="mt-2 text-sm text-slate-600">No ablation results are available.</p>
      </section>
    );
  }

  const sortedResults = [...results].sort((left, right) => right.macroF1 - left.macroF1);
  const source = sortedResults[0]?.source;

  return (
    <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Ablation comparison</h3>
          <p className="mt-1 text-sm text-slate-600">
            Rows are sorted by macro F1 so the strongest scoped feature set stays first.
          </p>
        </div>
        <SourcePill source={source} />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table aria-label="Ablation comparison" className="min-w-[44rem] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-3" scope="col">Model</th>
              <th className="px-3 py-2" scope="col">Features</th>
              <th className="px-3 py-2" scope="col">Overall accuracy</th>
              <th className="px-3 py-2" scope="col">Macro F1</th>
              <th className="px-3 py-2" scope="col">Corn F1</th>
              <th className="px-3 py-2" scope="col">Soybean F1</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedResults.map((result) => (
              <tr key={result.ablationId || result.name}>
                <th className="py-3 pr-3 text-left font-semibold text-slate-900" scope="row">
                  <span className="block">{result.name}</span>
                  <span className="mt-1 block text-xs font-medium text-slate-500">
                    {result.ablationId}
                  </span>
                </th>
                <td className="px-3 py-3 text-slate-700">{formatCount(result.nFeatures)}</td>
                <td className="px-3 py-3 text-slate-700">{formatPercent(result.overallAccuracy)}</td>
                <td className="px-3 py-3">
                  <MetricBar value={result.macroF1} />
                </td>
                <td className="px-3 py-3 text-slate-700">{formatPercent(result.f1Corn)}</td>
                <td className="px-3 py-3 text-slate-700">{formatPercent(result.f1Soybean)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MetricBar({ value }: { readonly value: number }) {
  const width = Math.max(0, Math.min(100, value * 100));

  return (
    <div className="grid min-w-28 gap-1">
      <span className="font-semibold text-slate-950">{formatPercent(value)}</span>
      <span className="h-2 w-full overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        <span
          className="block h-full rounded-full bg-emerald-600"
          style={{ width: `${width}%` }}
        />
      </span>
    </div>
  );
}

function SourcePill({ source }: { readonly source?: DataPointSource }) {
  if (!source) {
    return null;
  }

  return (
    <p className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
      {source.label ?? source.sourceId}
    </p>
  );
}
