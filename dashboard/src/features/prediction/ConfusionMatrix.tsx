import type { CropId, PredictionTestMetrics } from "@/lib/data/types";

import {
  cropLabels,
  cropOrder,
  formatCount,
  formatPercent,
  predictionCopy
} from "./prediction-copy";

interface ConfusionMatrixProps {
  readonly metrics?: PredictionTestMetrics;
}

export function ConfusionMatrix({ metrics }: ConfusionMatrixProps) {
  const matrix = metrics?.confusionMatrix;
  const hasCounts = matrix && matrix.some((row) => row.length > 0);
  const visibleCrops = matrix ? cropOrder.slice(0, matrix.length) : cropOrder.slice(0, 4);

  return (
    <section
      aria-label="Annotated test confusion matrix"
      className="min-w-0 rounded-xl border border-rule bg-paper p-4 sm:p-5"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Where the model hesitates
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold text-ink">
          Corn and soybean cross in both directions
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {predictionCopy.cornSoyCaveat}
        </p>
      </div>

      {hasCounts ? (
        <>
          <ConfusionCallouts matrix={matrix} />
          <div className="mt-4 max-w-full overflow-x-auto">
            <table aria-label="Test confusion matrix" className="min-w-[38rem] w-full border-separate border-spacing-1 text-sm">
              <thead>
                <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="p-2" scope="col">Actual ↓ / predicted →</th>
                  {visibleCrops.map((crop) => (
                    <th className="p-2 text-center" key={crop} scope="col">{cropLabels[crop]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleCrops.map((crop, rowIndex) => {
                  const row = matrix[rowIndex] ?? [];
                  const denominator = row.reduce((sum, value) => sum + value, 0);
                  return (
                    <tr key={crop}>
                      <th className="p-2 text-left font-semibold text-ink" scope="row">
                        <span className="block">{cropLabels[crop]}</span>
                        {denominator === 0 ? (
                          <span className="mt-1 block text-[10px] font-medium text-dry">No actual samples</span>
                        ) : (
                          <span className="mt-1 block text-[10px] font-normal tabular-nums text-muted-foreground">
                            n = {formatCount(denominator)}
                          </span>
                        )}
                      </th>
                      {visibleCrops.map((predictedCrop, columnIndex) => {
                        const count = readMatrixCell(matrix, rowIndex, columnIndex);
                        const share = denominator > 0 ? count / denominator : undefined;
                        return (
                          <td
                            className="rounded-md border border-rule p-2 text-center"
                            key={`${crop}-${predictedCrop}`}
                            style={{ backgroundColor: cellColor(share, rowIndex === columnIndex) }}
                          >
                            <span className="block font-mono font-semibold tabular-nums text-ink">
                              {formatCount(count)}
                            </span>
                            {share !== undefined ? (
                              <span className="mt-0.5 block text-[10px] tabular-nums text-muted-foreground">
                                {formatPercent(share)}
                              </span>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {metrics?.source ? (
            <div className="mt-4 border-t border-rule pt-3 text-xs leading-5 text-muted-foreground">
              <p className="font-semibold text-ink">{metrics.source.label ?? metrics.source.sourceId}</p>
              {metrics.source.path ? <p className="mt-1 break-all font-mono">{metrics.source.path}</p> : null}
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-950" role="status">
          <p>{predictionCopy.confusionFallback}</p>
          <p className="mt-2 font-mono text-xs">{predictionCopy.confusionFallbackPath}</p>
        </div>
      )}
    </section>
  );
}

function ConfusionCallouts({
  matrix
}: {
  readonly matrix: readonly (readonly number[])[];
}) {
  const cornIndex = getCropIndex("corn");
  const soybeanIndex = getCropIndex("soybean");
  const soybeanToCorn = readMatrixCell(matrix, soybeanIndex, cornIndex);
  const cornToSoybean = readMatrixCell(matrix, cornIndex, soybeanIndex);

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-3">
      <p className="rounded-lg border-l-4 border-corn bg-corn/10 px-3 py-3 text-sm font-semibold text-ink">
        {formatCount(soybeanToCorn)} soybean pixels → corn
      </p>
      <p className="rounded-lg border-l-4 border-soybean bg-soybean/10 px-3 py-3 text-sm font-semibold text-ink">
        {formatCount(cornToSoybean)} corn pixels → soybean
      </p>
      <p className="rounded-lg border-l-4 border-ink bg-muted/45 px-3 py-3 text-sm font-semibold text-ink">
        {formatCount(soybeanToCorn + cornToSoybean)} cross-confusions
      </p>
    </div>
  );
}

function getCropIndex(crop: CropId): number {
  return cropOrder.indexOf(crop);
}

function readMatrixCell(
  matrix: readonly (readonly number[])[],
  rowIndex: number,
  columnIndex: number
): number {
  return matrix[rowIndex]?.[columnIndex] ?? 0;
}

function cellColor(share: number | undefined, isDiagonal: boolean): string {
  if (share === undefined) {
    return "rgba(222, 216, 203, 0.35)";
  }

  const alpha = 0.08 + Math.min(0.42, share * 0.48);
  return isDiagonal
    ? `rgba(47, 111, 78, ${alpha})`
    : `rgba(217, 119, 34, ${alpha})`;
}
