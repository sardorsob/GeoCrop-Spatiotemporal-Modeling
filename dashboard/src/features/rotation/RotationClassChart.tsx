import type {
  DataPointSource,
  RotationClassId,
  RotationClassSummary
} from "@/lib/data/types";

import {
  formatAreaHa,
  formatPercent,
  formatPixels,
  rotationClassDescriptions,
  rotationClassLabels,
  ROTATION_COPY,
  toPercentValue
} from "./rotation-copy";

interface RotationClassChartProps {
  readonly classSummaries: readonly RotationClassSummary[];
}

const classOrder: readonly RotationClassId[] = [
  "regular",
  "monoculture",
  "irregular"
];

const classStyles = {
  regular: {
    accent: "bg-emerald-600",
    border: "border-emerald-600",
    tint: "bg-emerald-50",
    text: "text-emerald-800"
  },
  monoculture: {
    accent: "bg-amber-500",
    border: "border-amber-500",
    tint: "bg-amber-50",
    text: "text-amber-800"
  },
  irregular: {
    accent: "bg-rose-600",
    border: "border-rose-600",
    tint: "bg-rose-50",
    text: "text-rose-800"
  }
} as const satisfies Readonly<
  Record<
    RotationClassId,
    {
      readonly accent: string;
      readonly border: string;
      readonly tint: string;
      readonly text: string;
    }
  >
>;

export function RotationClassChart({
  classSummaries
}: RotationClassChartProps) {
  const sortedSummaries = sortClassSummaries(classSummaries);
  const source = sortedSummaries[0]?.source;

  return (
    <section
      aria-label={ROTATION_COPY.classRegionLabel}
      className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Rotation class summaries
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Valid cropland split across regular, monoculture, and irregular
            Task 2 classes.
          </p>
        </div>
        <SourcePill source={source} />
      </div>

      {sortedSummaries.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
          <p className="text-sm font-medium text-slate-800">
            {ROTATION_COPY.classEmptyState}
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {sortedSummaries.map((summary) => (
            <ClassSummaryCard key={summary.rotationClass} summary={summary} />
          ))}
        </div>
      )}
    </section>
  );
}

function ClassSummaryCard({
  summary
}: {
  readonly summary: RotationClassSummary;
}) {
  const styles = classStyles[summary.rotationClass];
  const width = Math.max(0, Math.min(100, toPercentValue(summary.percentOfValid)));

  return (
    <article
      className={[
        "min-h-56 rounded-xl border p-4",
        styles.border,
        styles.tint
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-slate-950">
            {rotationClassLabels[summary.rotationClass]}
          </h4>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {rotationClassDescriptions[summary.rotationClass]}
          </p>
        </div>
        <span
          aria-hidden="true"
          className={["mt-1 h-3 w-3 shrink-0 rounded-full", styles.accent].join(" ")}
        />
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-950">
        {formatPercent(summary.percentOfValid)}
      </p>
      <div
        aria-hidden="true"
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/80"
      >
        <span
          className={["block h-full rounded-full", styles.accent].join(" ")}
          style={{ width: `${width}%` }}
        />
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-slate-700">
        <div className="flex items-center justify-between gap-3 border-t border-white/70 pt-2">
          <dt className="font-medium">Pixels</dt>
          <dd className="font-semibold text-slate-950">
            {formatPixels(summary.pixelCount)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/70 pt-2">
          <dt className="font-medium">Area</dt>
          <dd className="font-semibold text-slate-950">
            {formatAreaHa(summary.areaHa)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

function SourcePill({ source }: { readonly source?: DataPointSource }) {
  if (!source) {
    return null;
  }

  return (
    <p
      aria-label={source.label ?? source.sourceId}
      className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
    >
      Class artifact source
    </p>
  );
}

function sortClassSummaries(
  classSummaries: readonly RotationClassSummary[]
): readonly RotationClassSummary[] {
  return [...classSummaries].sort(
    (left, right) =>
      classOrder.indexOf(left.rotationClass) - classOrder.indexOf(right.rotationClass)
  );
}
