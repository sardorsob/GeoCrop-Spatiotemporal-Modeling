import type { RotationGeoSummary } from "@/lib/data/types";

import {
  formatCount,
  formatPercent,
  geographyKindLabels,
  ROTATION_COPY
} from "./rotation-copy";

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

  return (
    <section className="border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Geographic rotation summaries
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

      {rankedGeographies.length === 0 ? (
        <div className="mt-4 border border-dashed border-slate-300 bg-slate-50 px-4 py-5">
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
              {rankedGeographies.map((geography) => {
                const isSelected = geography === selectedGeography;

                return (
                  <tr
                    aria-current={isSelected ? "true" : undefined}
                    className={
                      isSelected
                        ? "border-l-4 border-emerald-600 bg-emerald-50"
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
                        <span className="border border-emerald-300 bg-white px-2 py-1 text-xs font-semibold text-emerald-800">
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
      <span aria-hidden="true" className="h-2 w-full overflow-hidden bg-slate-100">
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
      <p className="shrink-0 border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900">
        Selected geography: {selectedGeography.geographyName}
      </p>
    );
  }

  if (selectedInput) {
    return (
      <p className="shrink-0 border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
        Selected geography: {selectedInput} is not present in the loaded
        geographic summaries.
      </p>
    );
  }

  return (
    <p className="shrink-0 border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
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
