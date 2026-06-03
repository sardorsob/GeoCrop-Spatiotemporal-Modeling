import type { PredictionTestMetrics } from "@/lib/data/types";

import {
  cropLabels,
  cropOrder,
  formatCount,
  predictionCopy
} from "./prediction-copy";

interface ConfusionMatrixProps {
  readonly metrics?: PredictionTestMetrics;
}

export function ConfusionMatrix({ metrics }: ConfusionMatrixProps) {
  const matrix = metrics?.confusionMatrix;
  const hasCounts = matrix && matrix.some((row) => row.length > 0);

  return (
    <section className="border border-slate-200 bg-white p-4">
      <div>
        <h3 className="text-base font-semibold text-slate-950">Test confusion matrix</h3>
        <p className="mt-1 text-sm text-slate-600">{predictionCopy.cornSoyCaveat}</p>
      </div>

      {hasCounts ? (
        <div className="mt-4 overflow-x-auto">
          <table aria-label="Test confusion matrix" className="min-w-[40rem] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3" scope="col">Actual \ Predicted</th>
                {cropOrder.map((crop) => (
                  <th className="px-3 py-2" key={crop} scope="col">
                    {cropLabels[crop]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cropOrder.map((crop, rowIndex) => (
                <tr key={crop}>
                  <th className="py-3 pr-3 text-left font-semibold text-slate-900" scope="row">
                    {cropLabels[crop]}
                  </th>
                  {cropOrder.map((predictedCrop, columnIndex) => (
                    <td
                      className={[
                        "px-3 py-3 text-slate-800",
                        rowIndex === columnIndex ? "bg-emerald-50 font-semibold text-emerald-950" : ""
                      ].join(" ")}
                      key={`${crop}-${predictedCrop}`}
                    >
                      {formatCount(readMatrixCell(matrix, rowIndex, columnIndex))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-950" role="status">
          <p>{predictionCopy.confusionFallback}</p>
          <p className="mt-2 font-mono text-xs">{predictionCopy.confusionFallbackPath}</p>
        </div>
      )}
    </section>
  );
}

function readMatrixCell(
  matrix: readonly (readonly number[])[],
  rowIndex: number,
  columnIndex: number
): number {
  return matrix[rowIndex]?.[columnIndex] ?? 0;
}
