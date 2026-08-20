import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import type {
  DataPointSource,
  MarkovTransition,
  RotationClassSummary,
  RotationGeoSummary,
  RotationThresholdSensitivity
} from "@/lib/data/types";

import { RotationClassChart } from "./RotationClassChart";
import { RotationGeoRanking } from "./RotationGeoRanking";
import { RotationSequenceStrip } from "./RotationSequenceStrip";
import { ThresholdComparison } from "./ThresholdComparison";
import {
  cropLabels,
  formatCount,
  formatPercent,
  ROTATION_COPY
} from "./rotation-copy";

export interface RotationPanelProps {
  readonly classSummaries: readonly RotationClassSummary[];
  readonly geographyFigure?: ReactNode;
  readonly geographySummaries: readonly RotationGeoSummary[];
  readonly markovTransitions?: readonly MarkovTransition[];
  readonly onThresholdChange?: (row: RotationThresholdSensitivity) => void;
  readonly selectedEntity?: string;
  readonly selectedGeographyId?: string;
  readonly selectedThresholdKey?: string;
  readonly thresholdSensitivity?: readonly RotationThresholdSensitivity[];
}

export function RotationPanel({
  classSummaries,
  geographyFigure,
  geographySummaries,
  markovTransitions = [],
  onThresholdChange,
  selectedEntity,
  selectedGeographyId,
  selectedThresholdKey,
  thresholdSensitivity = []
}: RotationPanelProps) {
  const sourceNotes = collectSources([
    ...classSummaries.map((summary) => summary.source),
    ...geographySummaries.map((summary) => summary.source),
    ...markovTransitions.map((transition) => transition.source),
    ...thresholdSensitivity.map((row) => row.source)
  ]);

  return (
    <section className="min-w-0 space-y-4" aria-labelledby="rotation-heading">
      <Card asChild>
        <header className="px-4 py-5 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            {ROTATION_COPY.eyebrow}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold leading-tight text-ink" id="rotation-heading">
            {ROTATION_COPY.heading}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {ROTATION_COPY.summary}
          </p>
        </header>
      </Card>

      <RotationSequenceStrip />
      <RotationClassChart classSummaries={classSummaries} />
      {geographyFigure}
      <RotationGeoRanking
        geographySummaries={geographySummaries}
        selectedEntity={selectedEntity}
        selectedGeographyId={selectedGeographyId}
      />
      <ThresholdComparison
        onThresholdChange={onThresholdChange}
        rows={thresholdSensitivity}
        selectedThresholdKey={selectedThresholdKey}
      />
      <TransitionContext markovTransitions={markovTransitions} />

      {sourceNotes.length > 0 ? <SourceNotes sources={sourceNotes} /> : null}
    </section>
  );
}

function TransitionContext({
  markovTransitions
}: {
  readonly markovTransitions: readonly MarkovTransition[];
}) {
  const leadingTransition = [...markovTransitions].sort(
    (left, right) => right.probability - left.probability
  )[0];

  return (
    <Card asChild>
      <aside aria-label="Rotation methodology caveat" className="border-l-4 border-corn px-4 py-4 sm:px-5">
        <h3 className="font-semibold text-ink">What the transition table adds</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Markov transitions summarize observed crop-to-crop changes; they support the memory interpretation but do not replace the class or geographic artifacts.
        </p>
        <p className="mt-2 text-xs font-medium text-ink">
          {leadingTransition
            ? `Largest loaded transition: ${cropLabels[leadingTransition.fromCrop]} → ${cropLabels[leadingTransition.toCrop]} · ${formatPercent(leadingTransition.probability)}.`
            : "No Markov transition rows are loaded."}
          {` ${formatCount(markovTransitions.length)} transition rows loaded.`}
        </p>
      </aside>
    </Card>
  );
}

function SourceNotes({ sources }: { readonly sources: readonly DataPointSource[] }) {
  return (
    <Card asChild>
      <section aria-label={ROTATION_COPY.sourceRegionLabel} className="px-4 py-5 sm:px-5">
        <h3 className="font-semibold text-ink">Sources & reading limits</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {sources.map((source) => (
            <article
              className="min-w-0 rounded-lg border border-rule bg-muted/35 p-3 text-sm"
              key={`${source.sourceId}-${source.path ?? ""}`}
            >
              <h4 className="font-semibold text-ink">{source.label ?? source.sourceId}</h4>
              {source.path ? (
                <p className="mt-2 break-words font-mono text-[10px] leading-4 text-muted-foreground">
                  {source.path}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                {source.rowCount !== undefined ? (
                  <span className="rounded-full border border-rule bg-paper px-2 py-0.5">
                    {formatCount(source.rowCount)} rows
                  </span>
                ) : null}
                {source.dateStamp ? (
                  <span className="rounded-full border border-rule bg-paper px-2 py-0.5">
                    {source.dateStamp}
                  </span>
                ) : null}
              </div>
              {source.denominator ? (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Denominator: {source.denominator}
                </p>
              ) : null}
              {source.caveat ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{source.caveat}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </Card>
  );
}

function collectSources(
  sources: readonly (DataPointSource | undefined)[]
): readonly DataPointSource[] {
  const seen = new Set<string>();
  return sources.filter((source): source is DataPointSource => {
    if (!source) return false;
    const key = `${source.sourceId}-${source.path ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
