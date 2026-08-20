import { Card } from "@/components/ui/card";
import type { RotationClassId, RotationClassSummary } from "@/lib/data/types";

import {
  formatAreaHa,
  formatCount,
  formatExactPercent,
  rotationClassDescriptions,
  rotationClassLabels,
  ROTATION_COPY,
  toPercentValue
} from "./rotation-copy";

interface RotationClassChartProps {
  readonly classSummaries: readonly RotationClassSummary[];
}

const CLASS_ORDER = ["regular", "monoculture", "irregular"] as const satisfies readonly RotationClassId[];

const CLASS_STYLE = {
  regular: { cell: "bg-primary", dot: "bg-primary" },
  monoculture: { cell: "bg-corn", dot: "bg-corn" },
  irregular: { cell: "bg-neutral", dot: "bg-neutral" }
} as const satisfies Readonly<Record<RotationClassId, { readonly cell: string; readonly dot: string }>>;

export function RotationClassChart({ classSummaries }: RotationClassChartProps) {
  const summaries = CLASS_ORDER.map((rotationClass) =>
    classSummaries.find((summary) => summary.rotationClass === rotationClass)
  );
  const available = summaries.filter((summary): summary is RotationClassSummary => Boolean(summary));
  const totalPixels = available.reduce((total, summary) => total + summary.pixelCount, 0);
  const cells = allocateCompositionCells(available);
  const source = available[0]?.source;

  return (
    <Card asChild>
      <section aria-label={ROTATION_COPY.classRegionLabel} className="px-4 py-5 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">02 · The composition</p>
            <h3 className="mt-1 font-serif text-xl font-semibold text-ink">One hundred cells, one dated result</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Each cell represents approximately one percentage point; exact artifact values remain printed below.
            </p>
          </div>
          {source ? (
            <p className="shrink-0 text-xs leading-5 text-muted-foreground">
              <span className="block font-semibold text-ink">{source.label ?? source.sourceId}</span>
              {source.dateStamp ? <span>{source.dateStamp}</span> : null}
            </p>
          ) : null}
        </div>

        {available.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-rule bg-muted/45 px-4 py-5 text-sm text-ink">
            {ROTATION_COPY.classEmptyState}
          </p>
        ) : (
          <>
            <div
              aria-label="Rotation composition layout"
              className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)] lg:items-stretch"
              data-layout="field-summary"
              role="group"
            >
              <div className="flex min-w-0 flex-col justify-center rounded-lg border border-rule/70 bg-muted/20 p-3 sm:p-4">
                <div
                  aria-label="100-cell rotation composition field"
                  className="mx-auto grid w-full max-w-lg grid-cols-10 gap-1.5"
                  role="img"
                >
                  {cells.map((rotationClass, index) => (
                    <span
                      aria-hidden="true"
                      className={`aspect-square rounded-[3px] ${CLASS_STYLE[rotationClass].cell}`}
                      data-testid="rotation-composition-cell"
                      key={`${rotationClass}-${index}`}
                    />
                  ))}
                </div>

                <p className="mt-3 text-xs font-semibold tabular-nums text-ink">
                  {`${formatCount(totalPixels)} eligible pixels`}
                </p>
                {source?.denominator ? (
                  <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                    {`Denominator · ${source.denominator}`}
                  </p>
                ) : null}
              </div>

              <div
                aria-label="Rotation class summaries"
                className="grid gap-2"
                data-layout="stacked"
                role="group"
              >
                {available.map((summary) => (
                  <article
                    aria-label={`${rotationClassLabels[summary.rotationClass]} summary`}
                    className="rounded-lg border border-rule bg-muted/35 p-3 sm:p-4"
                    key={summary.rotationClass}
                  >
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true" className={`size-2.5 rounded-full ${CLASS_STYLE[summary.rotationClass].dot}`} />
                      <h4 className="font-semibold text-ink">{rotationClassLabels[summary.rotationClass]}</h4>
                      <span className="ml-auto font-mono text-lg font-semibold tabular-nums text-ink">
                        {formatExactPercent(summary.percentOfValid)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {rotationClassDescriptions[summary.rotationClass]}
                    </p>
                    <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                      {`${formatCount(summary.pixelCount)} pixels · ${formatAreaHa(summary.areaHa)}`}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </Card>
  );
}

function allocateCompositionCells(
  summaries: readonly RotationClassSummary[]
): readonly RotationClassId[] {
  const shares = CLASS_ORDER.map((rotationClass) => ({
    rotationClass,
    share: Math.max(
      0,
      toPercentValue(
        summaries.find((summary) => summary.rotationClass === rotationClass)?.percentOfValid ?? 0
      )
    )
  }));
  const total = shares.reduce((sum, item) => sum + item.share, 0);
  if (total <= 0) return [];

  const quotas = shares.map((item) => ({
    ...item,
    quota: (item.share / total) * 100
  }));
  const counts = new Map(
    quotas.map((item) => [item.rotationClass, Math.floor(item.quota)] as const)
  );
  let remaining = 100 - [...counts.values()].reduce((sum, count) => sum + count, 0);
  const remainderOrder = [...quotas].sort(
    (left, right) =>
      right.quota - Math.floor(right.quota) - (left.quota - Math.floor(left.quota)) ||
      CLASS_ORDER.indexOf(left.rotationClass) - CLASS_ORDER.indexOf(right.rotationClass)
  );

  for (const item of remainderOrder) {
    if (remaining <= 0) break;
    counts.set(item.rotationClass, (counts.get(item.rotationClass) ?? 0) + 1);
    remaining -= 1;
  }

  return CLASS_ORDER.flatMap((rotationClass) =>
    Array.from({ length: counts.get(rotationClass) ?? 0 }, () => rotationClass)
  );
}
