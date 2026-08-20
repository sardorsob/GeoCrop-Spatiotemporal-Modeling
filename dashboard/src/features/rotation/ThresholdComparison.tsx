"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import type { RotationThresholdSensitivity } from "@/lib/data/types";

import {
  formatCount,
  formatExactPercent,
  formatThreshold,
  ROTATION_COPY
} from "./rotation-copy";

export interface ThresholdComparisonProps {
  readonly onThresholdChange?: (row: RotationThresholdSensitivity) => void;
  readonly rows: readonly RotationThresholdSensitivity[];
  readonly selectedThresholdKey?: string;
}

export function ThresholdComparison({
  onThresholdChange,
  rows,
  selectedThresholdKey
}: ThresholdComparisonProps) {
  const supportedRows = rows.filter(isCompleteRow);
  const [localKey, setLocalKey] = useState(() => rowKey(supportedRows[0]));
  const requestedKey = selectedThresholdKey ?? localKey;
  const activeRow = supportedRows.find((row) => rowKey(row) === requestedKey) ?? supportedRows[0];

  const changeRow = (nextKey: string) => {
    const nextRow = supportedRows.find((row) => rowKey(row) === nextKey);
    if (!nextRow) return;
    setLocalKey(nextKey);
    onThresholdChange?.(nextRow);
  };

  return (
    <Card asChild>
      <section aria-label={ROTATION_COPY.thresholdRegionLabel} className="px-4 py-5 sm:px-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Sensitivity · discrete source rows
            </p>
            <h3 className="mt-1 font-serif text-xl font-semibold text-ink">Move only between measured choices</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              {ROTATION_COPY.methodCaveat}
            </p>
          </div>

          {supportedRows.length > 0 ? (
            <label className="grid gap-1.5 text-sm">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Source row
              </span>
              <select
                aria-label="Sensitivity threshold row"
                className="h-10 min-w-0 rounded-md border border-rule bg-paper px-3 font-medium text-ink focus:outline-none focus:ring-2 focus:ring-field"
                onChange={(event) => changeRow(event.currentTarget.value)}
                value={rowKey(activeRow)}
              >
                {supportedRows.map((row) => (
                  <option key={rowKey(row)} value={rowKey(row)}>
                    {`Alternation ≥ ${formatThreshold(row.alternationMin)} · distance ≤ ${formatThreshold(row.patternDistanceMax)}`}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        {activeRow ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <ThresholdValue label="Regular" value={activeRow.pctRegular} />
            <ThresholdValue label="Monoculture" value={activeRow.pctMonoculture} />
            <ThresholdValue label="Irregular" value={activeRow.pctIrregular} />
            <div className="rounded-lg border border-rule bg-muted/45 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Denominator</p>
              <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-ink">
                {formatCount(activeRow.nPixels)} pixels
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-rule bg-muted/45 px-4 py-5 text-sm text-muted-foreground">
            No complete Task 2 sensitivity rows are available.
          </p>
        )}
      </section>
    </Card>
  );
}

function ThresholdValue({ label, value }: { readonly label: string; readonly value: number }) {
  return (
    <div className="rounded-lg border border-rule bg-muted/45 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">
        {`${formatExactPercent(value)} ${label.toLowerCase()}`}
      </p>
    </div>
  );
}

function rowKey(row: RotationThresholdSensitivity | undefined): string {
  return row
    ? `a${formatThreshold(row.alternationMin)}-d${formatThreshold(row.patternDistanceMax)}`
    : "";
}

function isCompleteRow(row: RotationThresholdSensitivity): boolean {
  return [
    row.alternationMin,
    row.patternDistanceMax,
    row.pctRegular,
    row.pctMonoculture,
    row.pctIrregular,
    row.nPixels
  ].every(Number.isFinite);
}
