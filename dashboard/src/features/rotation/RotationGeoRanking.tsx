"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { RotationGeoSummary } from "@/lib/data/types";

import {
  formatCount,
  formatPercent,
  geographyKindLabels,
  ROTATION_COPY
} from "./rotation-copy";

const COMPACT_ROW_COUNT = 5;

interface RotationGeoRankingProps {
  readonly geographySummaries: readonly RotationGeoSummary[];
  readonly selectedEntity?: string;
  readonly selectedGeographyId?: string;
}

export function RotationGeoRanking({
  geographySummaries,
  selectedEntity,
  selectedGeographyId
}: RotationGeoRankingProps) {
  const selectedInput = selectedEntity ?? selectedGeographyId;
  const rankedGeographies = [...geographySummaries].sort(
    (left, right) => right.pctRegular - left.pctRegular
  );
  const selectedGeography = rankedGeographies.find((geography) =>
    matchesSelection(geography, selectedEntity, selectedGeographyId)
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const hasOverflow = rankedGeographies.length > COMPACT_ROW_COUNT;
  const visibleGeographies =
    !hasOverflow || isExpanded
      ? rankedGeographies
      : rankedGeographies.slice(0, COMPACT_ROW_COUNT);
  const hiddenCount = rankedGeographies.length - COMPACT_ROW_COUNT;

  return (
    <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-950">
            Geographic rotation summaries
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {rankedGeographies.length}
            </span>
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Regions are ranked by regular-rotation share while retaining
            monoculture and irregular percentages for comparison.
          </p>
        </div>
        <SelectionStatus
          selectedGeography={selectedGeography}
          selectedInput={selectedInput}
        />
      </div>

      <div>

      {rankedGeographies.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
          <p className="text-sm font-medium text-slate-800">
            {ROTATION_COPY.geographyEmptyState}
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table
            aria-label={ROTATION_COPY.geographyRegionLabel}
            className="w-full min-w-[46rem] border-collapse text-sm"
          >
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3" scope="col">
                  Geography
                </th>
                <th className="px-3 py-2" scope="col">
                  Pixels
                </th>
                <th className="px-3 py-2" scope="col">
                  Regular
                </th>
                <th className="px-3 py-2" scope="col">
                  Monoculture
                </th>
                <th className="px-3 py-2" scope="col">
                  Irregular
                </th>
                <th className="px-3 py-2" scope="col">
                  Map state
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleGeographies.map((geography) => {
                const isSelected = geography === selectedGeography;

                return (
                  <tr
                    aria-current={isSelected ? "true" : undefined}
                    className={
                      isSelected
                        ? "border-l-4 border-emerald-500 bg-emerald-50"
                        : undefined
                    }
                    key={`${geography.geographyKind}-${geography.geographyId}`}
                  >
                    <th
                      className="py-3 pr-3 text-left font-semibold text-slate-900"
                      scope="row"
                    >
                      <span className="block">{geography.geographyName}</span>
                      <span className="mt-1 block text-xs font-medium text-slate-500">
                        {geographyKindLabels[geography.geographyKind]} -{" "}
                        {geography.geographyId}
                      </span>
                    </th>
                    <td className="px-3 py-3 text-slate-700">
                      {formatCount(geography.nPixels)}
                    </td>
                    <td className="px-3 py-3">
                      <PercentCell
                        colorClassName="bg-emerald-600"
                        value={geography.pctRegular}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <PercentCell
                        colorClassName="bg-amber-500"
                        value={geography.pctMonoculture}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <PercentCell
                        colorClassName="bg-rose-600"
                        value={geography.pctIrregular}
                      />
                    </td>
                    <td className="px-3 py-3">
                      {isSelected ? (
                        <span className="rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-xs font-semibold text-emerald-800">
                          Selected
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-500">
                          Available
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {hasOverflow && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {isExpanded ? (
            <>
              <ChevronDown className="size-4 rotate-180" aria-hidden />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="size-4" aria-hidden />
              Show {hiddenCount} more
            </>
          )}
        </button>
      )}
      </div>
    </section>
  );
}

function PercentCell({
  colorClassName,
  value
}: {
  readonly colorClassName: string;
  readonly value: number;
}) {
  const width = Math.max(0, Math.min(100, Math.abs(value) <= 1 ? value * 100 : value));

  return (
    <div className="grid min-w-28 gap-1">
      <span className="font-semibold text-slate-950">
        {formatPercent(value)}
      </span>
      <span aria-hidden="true" className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <span
          className={["block h-full", colorClassName].join(" ")}
          style={{ width: `${width}%` }}
        />
      </span>
    </div>
  );
}

function SelectionStatus({
  selectedGeography,
  selectedInput
}: {
  readonly selectedGeography?: RotationGeoSummary;
  readonly selectedInput?: string;
}) {
  if (selectedGeography) {
    return (
      <p className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
        Selected geography: {selectedGeography.geographyName}
      </p>
    );
  }

  if (selectedInput) {
    return (
      <p className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        Selected geography: {selectedInput} is not present in the loaded
        geographic summaries.
      </p>
    );
  }

  return (
    <p className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
      {ROTATION_COPY.noSelection}
    </p>
  );
}

function matchesSelection(
  geography: RotationGeoSummary,
  selectedEntity?: string,
  selectedGeographyId?: string
): boolean {
  const candidates = [
    geography.geographyId,
    geography.geographyName,
    geography.stateFips,
    geography.countyFips
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeSelectionKey);
  const selectedKeys = [selectedEntity, selectedGeographyId]
    .filter((value): value is string => Boolean(value))
    .map(normalizeSelectionKey);

  return selectedKeys.some((selectedKey) => candidates.includes(selectedKey));
}

function normalizeSelectionKey(value: string): string {
  return value.trim().toLowerCase();
}
