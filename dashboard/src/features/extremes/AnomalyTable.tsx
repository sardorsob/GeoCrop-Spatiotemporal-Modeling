import type { AnomalyStateCropSummary } from "@/lib/data/types";

import {
  formatCount,
  formatPercent,
  formatProbability,
  formatZScore,
  getCropLabel,
  getEventLabel
} from "./extremes-copy";

export interface AnomalyTableProps {
  readonly rows: readonly AnomalyStateCropSummary[];
}

export function AnomalyTable({ rows }: AnomalyTableProps) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No exact anomaly rows are available.</p>;
  }

  const sortedRows = [...rows].sort((left, right) =>
    `${left.eventId}-${left.state}-${left.crop}`.localeCompare(
      `${right.eventId}-${right.state}-${right.crop}`
    )
  );

  return (
    <div className="overflow-x-auto">
      <table
        aria-label="State and crop anomaly values"
        className="min-w-[72rem] w-full border-collapse text-sm"
      >
        <thead>
          <tr className="border-b border-rule text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <th className="py-2 pr-3" scope="col">Event</th>
            <th className="px-3 py-2" scope="col">State</th>
            <th className="px-3 py-2" scope="col">Crop</th>
            <th className="px-3 py-2" scope="col">Mean z</th>
            <th className="px-3 py-2" scope="col">Max z</th>
            <th className="px-3 py-2" scope="col">z &gt; 1</th>
            <th className="px-3 py-2" scope="col">z &gt; 1.5</th>
            <th className="px-3 py-2" scope="col">Pixel-weeks</th>
            <th className="px-3 py-2" scope="col">NIG percentile</th>
            <th className="px-3 py-2" scope="col">NIG &lt; 0.1</th>
            <th className="px-3 py-2" scope="col">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule/70">
          {sortedRows.map((row) => (
            <tr key={`${row.eventId}-${row.state}-${row.crop}`}>
              <th className="py-3 pr-3 text-left font-semibold text-ink" scope="row">
                {getEventLabel(row.eventId)}
              </th>
              <td className="px-3 py-3 font-medium text-ink">{row.state}</td>
              <td className="px-3 py-3 text-muted-foreground">{getCropLabel(row.crop)}</td>
              <td className="px-3 py-3 font-mono font-semibold tabular-nums text-ink">
                {formatZScore(row.meanZ)}
              </td>
              <td className="px-3 py-3 font-mono tabular-nums text-muted-foreground">
                {formatZScore(row.maxZ)}
              </td>
              <td className="px-3 py-3 tabular-nums text-muted-foreground">
                {formatPercent(row.fractionObservedZGreaterThan1)}
              </td>
              <td className="px-3 py-3 tabular-nums text-muted-foreground">
                {formatPercent(row.fractionObservedZGreaterThan1p5)}
              </td>
              <td className="px-3 py-3 tabular-nums text-muted-foreground">
                {formatCount(row.nPixelWeeks)}
              </td>
              <td className="px-3 py-3 font-mono tabular-nums text-muted-foreground">
                {formatProbability(row.meanNigPDrought)}
              </td>
              <td className="px-3 py-3 tabular-nums text-muted-foreground">
                {formatPercent(row.fractionPDroughtBelow0p1)}
              </td>
              <td className="px-3 py-3 text-xs text-muted-foreground">
                {row.source.sourceId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
