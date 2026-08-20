import type {
  AblationResult,
  PredictionSplitSummary,
  PredictionTestMetrics,
  RegimeMetric,
  ShapFeature
} from "@/lib/data/types";

import { AblationChart } from "./AblationChart";
import { ConfusionMatrix } from "./ConfusionMatrix";
import { FeatureSourceBraid } from "./FeatureSourceBraid";
import { RegimeMetricsChart } from "./RegimeMetricsChart";
import { ShapFeatureChart } from "./ShapFeatureChart";
import { formatCount, formatPercent, predictionCopy } from "./prediction-copy";

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
  splitSummaries = [],
  testMetrics
}: PredictionPanelProps) {
  const hasAnyData =
    Boolean(testMetrics) ||
    ablationResults.length > 0 ||
    regimeMetrics.length > 0 ||
    shapFeatures.length > 0 ||
    splitSummaries.length > 0;

  return (
    <section aria-label={predictionCopy.title} className="grid min-w-0 gap-4 text-ink">
      <header className="rounded-xl border border-rule bg-paper p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Act IV · Predict what comes next
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
          {predictionCopy.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {predictionCopy.summary}
        </p>
      </header>

      {!hasAnyData ? (
        <div
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-950"
          role="status"
        >
          {predictionCopy.emptyState}
        </div>
      ) : (
        <>
          <FeatureSourceBraid />
          <HeadlineMetrics metrics={testMetrics} splitSummaries={splitSummaries} />
          <AblationChart results={ablationResults} />
          <ShapFeatureChart features={shapFeatures} />
          <ConfusionMatrix metrics={testMetrics} />
          <RegimeMetricsChart metrics={regimeMetrics} />
          <PredictionEvidenceLimits
            shapFeatures={shapFeatures}
            splitSummaries={splitSummaries}
          />
        </>
      )}
    </section>
  );
}

function HeadlineMetrics({
  metrics,
  splitSummaries
}: {
  readonly metrics?: PredictionTestMetrics;
  readonly splitSummaries: readonly PredictionSplitSummary[];
}) {
  if (!metrics) {
    return (
      <section
        aria-label="Headline test metrics"
        className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-950"
      >
        {predictionCopy.missingMetrics}
      </section>
    );
  }

  const testSplit = findTestSplit(splitSummaries);

  return (
    <section
      aria-label="Headline test metrics"
      className="grid min-w-0 gap-3 rounded-xl border border-rule bg-paper p-4 sm:grid-cols-3 sm:p-5"
    >
      <Metric label="2023 overall accuracy" value={formatPercent(metrics.overallAccuracy)} />
      <Metric label="2023 macro F1" value={formatPercent(metrics.macroF1)} />
      <div className="rounded-lg border border-rule bg-muted/30 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Held-out test design
        </p>
        <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-ink">
          {testSplit ? formatCount(testSplit.nPixels) : "Not reported"} pixels
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {testSplit ? `${testSplit.years} · class-balanced export` : "Test split summary unavailable"}
        </p>
      </div>
      <div className="sm:col-span-3 border-t border-rule pt-3 text-xs leading-5 text-muted-foreground">
        <p className="font-semibold text-ink">{metrics.source.label ?? metrics.source.sourceId}</p>
        {metrics.source.path ? <p className="mt-1 break-all font-mono">{metrics.source.path}</p> : null}
        {metrics.source.caveat ? <p className="mt-1">{metrics.source.caveat}</p> : null}
      </div>
    </section>
  );
}

function Metric({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="rounded-lg border border-rule bg-muted/30 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}

function PredictionEvidenceLimits({
  shapFeatures,
  splitSummaries
}: {
  readonly shapFeatures: readonly ShapFeature[];
  readonly splitSummaries: readonly PredictionSplitSummary[];
}) {
  const testSplit = findTestSplit(splitSummaries);
  const perClass = testSplit ? getEqualClassCount(testSplit) : undefined;

  return (
    <section
      aria-label="Prediction evidence limits"
      className="grid min-w-0 gap-3 rounded-xl border border-rule bg-paper p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-4"
    >
      <LimitCard title="Forecast timing">
        This is not a pre-plant forecast: NDVI and SMAP include the concurrent growing season.
      </LimitCard>
      <LimitCard title="Evaluation sample">
        The 2023 test split contains {testSplit ? formatCount(testSplit.nPixels) : "an unreported number of"} pixels
        {perClass ? ` · ${formatCount(perClass)} per class` : ""}. SHAP uses a 1,000-pixel stratified subsample.
      </LimitCard>
      <LimitCard title="Spatial grain">
        SMAP&apos;s 9 km native signal was aligned with CDL and NDVI on the common ~557 m grid; do not read field-level precision into it.
      </LimitCard>
      <LimitCard title="Geographic claim">
        No geographic prediction layer is shown because the browser-safe Task 4 exports do not provide a truthful aggregate prediction geography.
      </LimitCard>
      <div className="break-all border-t border-rule pt-3 text-xs leading-5 text-muted-foreground md:col-span-2 xl:col-span-4">
        <span className="font-semibold text-ink">Sampling sources:</span>{" "}
        {testSplit?.source.path ?? "Task 4 split summary unavailable"} ·{" "}
        {shapFeatures[0]?.source.path ?? "Task 4 SHAP source unavailable"}
      </div>
    </section>
  );
}

function LimitCard({
  children,
  title
}: {
  readonly children: React.ReactNode;
  readonly title: string;
}) {
  return (
    <article className="rounded-lg border border-rule bg-muted/30 p-4">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink">{children}</p>
    </article>
  );
}

function findTestSplit(splitSummaries: readonly PredictionSplitSummary[]) {
  return splitSummaries.find((split) => split.split.trim().toLowerCase() === "test");
}

function getEqualClassCount(split: PredictionSplitSummary): number | undefined {
  const counts = [split.otherCropland, split.corn, split.soybean, split.winterWheat];
  return counts.every((count) => count === counts[0]) ? counts[0] : undefined;
}
