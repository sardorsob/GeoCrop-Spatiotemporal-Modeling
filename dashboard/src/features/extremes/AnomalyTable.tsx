import type { AnomalyStateCropSummary } from "@/lib/data/types";

import {
  formatCount,
  formatPercent,
  formatProbability,
  formatZScore,
  getCropLabel
} from "./extremes-copy";

export interface AnomalyTableProps {
  readonly rows: readonly AnomalyStateCropSummary[];
}

export function AnomalyTable({ rows }: AnomalyTableProps) {
  if (rows.length === 0) {
    return (
      <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-950">
          State and crop anomaly values
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          No state x crop rows are available for this filter set.
        </p>
      </section>
    );
  }

  const sortedRows = [...rows].sort((left, right) =>
    `${left.state}-${left.crop}`.localeCompare(`${right.state}-${right.crop}`)
  );

  return (
    <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            State and crop anomaly values
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Values are normalized from the Task 3 state x crop artifact rows.
          </p>
        </div>
        <p className="text-sm font-medium text-slate-700">
          {sortedRows.length.toLocaleString("en-US")} row
          {sortedRows.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table
          aria-label="State and crop anomaly values"
          className="min-w-[64rem] w-full border-collapse text-sm"
        >
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-3" scope="col">
                State
              </th>
              <th className="px-3 py-2" scope="col">
                Crop
              </th>
              <th className="px-3 py-2" scope="col">
                Mean z
              </th>
              <th className="px-3 py-2" scope="col">
                Max z
              </th>
              <th className="px-3 py-2" scope="col">
                z &gt; 1
              </th>
              <th className="px-3 py-2" scope="col">
                z &gt; 1.5
              </th>
              <th className="px-3 py-2" scope="col">
                Pixel-weeks
              </th>
              <th className="px-3 py-2" scope="col">
                Mean NIG P(drought)
              </th>
              <th className="px-3 py-2" scope="col">
                P(drought) &lt; 0.1
              </th>
              <th className="px-3 py-2" scope="col">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedRows.map((row) => (
              <tr key={`${row.eventId}-${row.state}-${row.crop}`}>
                <th className="py-3 pr-3 text-left font-semibold text-slate-900" scope="row">
                  <span className="block">{row.state}</span>
                  {row.nPixelWeeks > 0 && row.nPixelWeeks < 1000 ? (
                    <span className="mt-1 block text-xs font-medium text-amber-700">
                      Small denominator
                    </span>
                  ) : null}
                </th>
                <td className="px-3 py-3 text-slate-700">{getCropLabel(row.crop)}</td>
                <td className="px-3 py-3 font-semibold text-slate-950">
                  {formatZScore(row.meanZ)}
                </td>
                <td className="px-3 py-3 text-slate-700">{formatZScore(row.maxZ)}</td>
                <td className="px-3 py-3 text-slate-700">
                  {formatPercent(row.fractionObservedZGreaterThan1)}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {formatPercent(row.fractionObservedZGreaterThan1p5)}
                </td>
                <td className="px-3 py-3 text-slate-700">{formatCount(row.nPixelWeeks)}</td>
                <td className="px-3 py-3 text-slate-700">
                  {formatProbability(row.meanNigPDrought)}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {formatPercent(row.fractionPDroughtBelow0p1)}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {row.source.sourceId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
