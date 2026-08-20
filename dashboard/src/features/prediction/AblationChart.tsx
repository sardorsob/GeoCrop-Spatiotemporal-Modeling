import type { AblationResult } from "@/lib/data/types";

import {
  formatFeatureLabel,
  formatPercent,
  formatPercentagePointDelta,
  predictionCopy
} from "./prediction-copy";

interface AblationChartProps {
  readonly results: readonly AblationResult[];
}

const CONFIGURATIONS = [
  { id: "A", label: "CDL only" },
  { id: "B", label: "CDL + NDVI", referenceId: "A", referenceLabel: "CDL" },
  { id: "C", label: "CDL + SMAP", referenceId: "A", referenceLabel: "CDL" },
  { id: "D", label: "Full model", referenceId: "B", referenceLabel: "CDL + NDVI" }
] as const;

export function AblationChart({ results }: AblationChartProps) {
  if (results.length === 0) {
    return (
      <section className="rounded-xl border border-rule bg-paper p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold text-ink">Incremental ablation</h3>
        <p className="mt-2 text-sm text-muted-foreground">No ablation results are available.</p>
      </section>
    );
  }

  const resultById = new Map(results.map((result) => [result.ablationId.toUpperCase(), result]));
  const knownIds = new Set<string>(CONFIGURATIONS.map((configuration) => configuration.id));
  const rows = [
    ...CONFIGURATIONS.flatMap((configuration) => {
      const result = resultById.get(configuration.id);
      return result ? [{ configuration, result }] : [];
    }),
    ...results
      .filter((result) => !knownIds.has(result.ablationId.toUpperCase()))
      .map((result) => ({
        configuration: { id: result.ablationId, label: formatFeatureLabel(result.name) },
        result
      }))
  ];
  const source = rows[0]?.result.source;

  return (
    <section
      aria-label="Incremental ablation evidence"
      className="min-w-0 rounded-xl border border-rule bg-paper p-4 sm:p-5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            What each source adds
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">
            Incremental ablation
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {predictionCopy.ablationBranchCaveat}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-rule bg-muted/45 px-3 py-1 text-xs text-muted-foreground">
          2022 validation · 500,000 pixels
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        {rows.map(({ configuration, result }) => {
          const reference = "referenceId" in configuration
            ? resultById.get(configuration.referenceId)
            : undefined;
          const delta = reference
            ? (result.overallAccuracy - reference.overallAccuracy) * 100
            : undefined;

          return (
            <article
              aria-label={`${configuration.label} ablation result`}
              className="min-w-0 rounded-lg border border-rule bg-muted/30 p-4"
              key={configuration.id}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    Configuration {configuration.id}
                  </p>
                  <h4 className="mt-1 font-semibold text-ink">{configuration.label}</h4>
                </div>
                <span className="rounded-full border border-rule bg-paper px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                  {result.nFeatures} features
                </span>
              </div>
              <p className="mt-4 font-mono text-2xl font-semibold tabular-nums text-ink">
                {formatPercent(result.overallAccuracy)} accuracy
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-rule/60" aria-hidden="true">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(0, Math.min(100, result.overallAccuracy * 100))}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-primary">
                {delta === undefined || !("referenceLabel" in configuration)
                  ? "Baseline"
                  : `${formatPercentagePointDelta(delta)} vs ${configuration.referenceLabel}`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Macro F1 · {formatPercent(result.macroF1)}
              </p>
            </article>
          );
        })}
      </div>

      {source ? (
        <div className="mt-4 border-t border-rule pt-3 text-xs leading-5 text-muted-foreground">
          <p className="font-semibold text-ink">{source.label ?? source.sourceId}</p>
          {source.path ? <p className="mt-1 break-all font-mono">{source.path}</p> : null}
          {source.caveat ? <p className="mt-1">{source.caveat}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
