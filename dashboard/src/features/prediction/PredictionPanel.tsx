import type {
  AblationResult,
  DataPointSource,
  PredictionSplitSummary,
  PredictionTestMetrics,
  RegimeMetric,
  ShapFeature
} from "@/lib/data/types";

import { AblationChart } from "./AblationChart";
import { ConfusionMatrix } from "./ConfusionMatrix";
import { RegimeMetricsChart } from "./RegimeMetricsChart";
import { ShapFeatureChart } from "./ShapFeatureChart";
import { formatPercent, predictionCopy } from "./prediction-copy";

export interface PredictionPanelProps {
  readonly ablationResults: readonly AblationResult[];
  readonly regimeMetrics: readonly RegimeMetric[];
  readonly shapFeatures: readonly ShapFeature[];
  readonly splitSummaries?: readonly PredictionSplitSummary[];
  readonly testMetrics?: PredictionTestMetrics;
}

export function PredictionPanel({
  ablationResults,
  regimeMetrics,
  shapFeatures,
  testMetrics
}: PredictionPanelProps) {
  const hasAnyData =
    Boolean(testMetrics) ||
    ablationResults.length > 0 ||
    regimeMetrics.length > 0 ||
    shapFeatures.length > 0;

  return (
    <section
      aria-label={predictionCopy.title}
      className="grid gap-4 text-slate-950"
    >
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Prediction
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">
          {predictionCopy.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {predictionCopy.summary}
        </p>
      </div>

      {!hasAnyData ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900"
          role="status"
        >
          {predictionCopy.emptyState}
        </div>
      ) : (
        <>
          <HeadlineMetrics metrics={testMetrics} />
          <div className="grid gap-4 xl:grid-cols-2">
            <AblationChart results={ablationResults} />
            <ShapFeatureChart features={shapFeatures} />
          </div>
          <RegimeMetricsChart metrics={regimeMetrics} />
          <ConfusionMatrix metrics={testMetrics} />
        </>
      )}
    </section>
  );
}

function HeadlineMetrics({ metrics }: { readonly metrics?: PredictionTestMetrics }) {
  if (!metrics) {
    return (
      <section
        aria-label="Headline test metrics"
        className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900"
      >
        {predictionCopy.missingMetrics}
      </section>
    );
  }

  return (
    <section
      aria-label="Headline test metrics"
      className="grid gap-3 sm:grid-cols-[1fr_1fr_2fr]"
    >
      <MetricCard label="Overall accuracy" value={formatPercent(metrics.overallAccuracy)} />
      <MetricCard label="Macro F1" value={formatPercent(metrics.macroF1)} />
      <SourceCard source={metrics.source} />
    </section>
  );
}

function MetricCard({
  label,
  value
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-5 py-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function SourceCard({ source }: { readonly source: DataPointSource }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-5 py-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Source</p>
      <p className="mt-2 font-semibold text-slate-950">{source.label ?? source.sourceId}</p>
      {source.path ? (
        <p className="mt-1 break-all font-mono text-xs text-slate-600">{source.path}</p>
      ) : null}
      {source.caveat ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{source.caveat}</p>
      ) : null}
    </div>
  );
}
