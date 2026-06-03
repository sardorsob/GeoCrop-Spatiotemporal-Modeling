import type {
  DataPointSource,
  MarkovTransition,
  RotationClassSummary,
  RotationGeoSummary,
  RotationThresholdSensitivity
} from "@/lib/data/types";

import { RotationClassChart } from "./RotationClassChart";
import { RotationGeoRanking } from "./RotationGeoRanking";
import {
  cropLabels,
  formatCount,
  formatPercent,
  formatThreshold,
  ROTATION_COPY
} from "./rotation-copy";

export interface RotationPanelProps {
  readonly classSummaries: readonly RotationClassSummary[];
  readonly geographySummaries: readonly RotationGeoSummary[];
  readonly markovTransitions?: readonly MarkovTransition[];
  readonly selectedEntity?: string;
  readonly selectedGeographyId?: string;
  readonly thresholdSensitivity?: readonly RotationThresholdSensitivity[];
}

export function RotationPanel({
  classSummaries,
  geographySummaries,
  markovTransitions = [],
  selectedEntity,
  selectedGeographyId,
  thresholdSensitivity = []
}: RotationPanelProps) {
  const sourceNotes = collectSources([
    ...classSummaries.map((summary) => summary.source),
    ...geographySummaries.map((summary) => summary.source),
    ...markovTransitions.map((transition) => transition.source),
    ...thresholdSensitivity.map((row) => row.source)
  ]);

  return (
    <section className="space-y-4" aria-labelledby="rotation-heading">
      <div className="border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {ROTATION_COPY.eyebrow}
        </p>
        <h2
          className="mt-1 text-xl font-semibold leading-tight text-slate-950"
          id="rotation-heading"
        >
          {ROTATION_COPY.heading}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {ROTATION_COPY.summary}
        </p>
      </div>

      <RotationMethodCaveat
        markovTransitions={markovTransitions}
        thresholdSensitivity={thresholdSensitivity}
      />

      <RotationClassChart classSummaries={classSummaries} />
      <RotationGeoRanking
        geographySummaries={geographySummaries}
        selectedEntity={selectedEntity}
        selectedGeographyId={selectedGeographyId}
      />

      {sourceNotes.length > 0 ? <SourceNotes sources={sourceNotes} /> : null}
    </section>
  );
}

function RotationMethodCaveat({
  markovTransitions,
  thresholdSensitivity
}: {
  readonly markovTransitions: readonly MarkovTransition[];
  readonly thresholdSensitivity: readonly RotationThresholdSensitivity[];
}) {
  const leadingTransition = [...markovTransitions].sort(
    (left, right) => right.probability - left.probability
  )[0];
  const firstThreshold = thresholdSensitivity[0];

  return (
    <section
      aria-label="Rotation methodology caveat"
      className="border border-amber-300 bg-amber-50 p-4 text-amber-950"
    >
      <h3 className="text-base font-semibold">Modeling caveat</h3>
      <p className="mt-2 text-sm leading-6">{ROTATION_COPY.methodCaveat}</p>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <p className="border border-amber-200 bg-white/70 px-3 py-2">
          Markov rows: {formatCount(markovTransitions.length)}
        </p>
        <p className="border border-amber-200 bg-white/70 px-3 py-2">
          Threshold rows: {formatCount(thresholdSensitivity.length)}
        </p>
        {leadingTransition ? (
          <p className="border border-amber-200 bg-white/70 px-3 py-2">
            Top transition: {cropLabels[leadingTransition.fromCrop]} to{" "}
            {cropLabels[leadingTransition.toCrop]}{" "}
            {formatPercent(leadingTransition.probability)}
          </p>
        ) : null}
        {firstThreshold ? (
          <p className="border border-amber-200 bg-white/70 px-3 py-2">
            Baseline sensitivity: alternation{" "}
            {formatThreshold(firstThreshold.alternationMin)}, distance{" "}
            {formatThreshold(firstThreshold.patternDistanceMax)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function SourceNotes({
  sources
}: {
  readonly sources: readonly DataPointSource[];
}) {
  return (
    <section
      aria-label={ROTATION_COPY.sourceRegionLabel}
      className="border border-slate-200 bg-white p-4"
    >
      <h3 className="text-base font-semibold text-slate-950">Source notes</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {sources.map((source, index) => (
          <article
            className="border border-slate-200 bg-slate-50 p-3 text-sm"
            key={`${source.sourceId}-${source.path ?? ""}`}
          >
            <h4 className="font-semibold text-slate-950">
              {source.label ?? source.sourceId}
            </h4>
            {source.path ? (
              <p className="mt-2 break-words font-mono text-xs leading-5 text-slate-600">
                {source.path}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
              {source.rowCount !== undefined ? (
                <span className="border border-slate-300 bg-white px-2 py-1">
                  {formatCount(source.rowCount)} rows
                </span>
              ) : null}
              {source.dateStamp ? (
                <span className="border border-slate-300 bg-white px-2 py-1">
                  {index === 0 ? source.dateStamp : `Date: ${source.dateStamp}`}
                </span>
              ) : null}
            </div>
            {source.denominator ? (
              <p className="mt-3 text-xs leading-5 text-slate-600">
                {getDenominatorLabel(sources, source.denominator, index)}:{" "}
                {source.denominator}
              </p>
            ) : null}
            {source.caveat ? (
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {source.caveat}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function getDenominatorLabel(
  sources: readonly DataPointSource[],
  denominator: string,
  index: number
): "Denominator" | "Denominator detail" {
  const firstIndex = sources.findIndex(
    (source) => source.denominator === denominator
  );

  return firstIndex === index ? "Denominator" : "Denominator detail";
}

function collectSources(
  sources: readonly (DataPointSource | undefined)[]
): readonly DataPointSource[] {
  const seen = new Set<string>();

  return sources.filter((source): source is DataPointSource => {
    if (!source) {
      return false;
    }

    const key = `${source.sourceId}-${source.path ?? ""}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
