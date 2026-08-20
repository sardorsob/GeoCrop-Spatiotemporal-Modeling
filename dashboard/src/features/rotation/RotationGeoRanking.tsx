"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { GeographyKind, RotationGeoSummary } from "@/lib/data/types";

import {
  formatCount,
  formatExactPercent,
  ROTATION_COPY
} from "./rotation-copy";

const COMPACT_ROW_COUNT = 7;
type RankedGrain = "state" | "county";

interface RotationGeoRankingProps {
  readonly geographySummaries: readonly RotationGeoSummary[];
  readonly selectedEntity?: string;
  readonly selectedGeographyId?: string;
}

interface RankedGeography {
  readonly geography: RotationGeoSummary;
  readonly rank: number;
}

export function RotationGeoRanking({
  geographySummaries,
  selectedEntity,
  selectedGeographyId
}: RotationGeoRankingProps) {
  const selectedInput = selectedEntity ?? selectedGeographyId;
  const selectedGeography = geographySummaries.find((geography) =>
    matchesSelection(geography, selectedEntity, selectedGeographyId)
  );
  const activeGrain = toRankedGrain(selectedGeography?.geographyKind) ?? defaultGrain(geographySummaries);
  const ranked = rankGeographies(
    geographySummaries.filter((geography) => geography.geographyKind === activeGrain)
  );
  const selectedRank = ranked.find((item) => item.geography === selectedGeography);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasOverflow = ranked.length > COMPACT_ROW_COUNT;
  const visible = !hasOverflow || isExpanded ? ranked : ranked.slice(0, COMPACT_ROW_COUNT);

  return (
    <Card asChild>
      <section aria-label={ROTATION_COPY.geographyRegionLabel} className="px-4 py-5 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              03 · The measured geography
            </p>
            <h3 className="mt-1 font-serif text-xl font-semibold text-ink">
              {activeGrain === "state" ? "State" : "County"} regular-share ranking
            </h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              Ranks compare regular-rotation share only within the same geographic grain. Equal measured shares receive the same rank.
            </p>
          </div>
          <SelectionStatus
            activeGrain={activeGrain}
            rankedCount={ranked.length}
            selectedGeography={selectedGeography}
            selectedInput={selectedInput}
            selectedRank={selectedRank?.rank}
          />
        </div>

        {selectedGeography && selectedRank ? (
          <PinnedDetail geography={selectedGeography} rank={selectedRank.rank} total={ranked.length} />
        ) : null}

        {ranked.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-rule bg-muted/45 px-4 py-5 text-sm text-ink">
            {ROTATION_COPY.geographyEmptyState}
          </p>
        ) : (
          <ol aria-label={`${activeGrain} regular-share ranks`} className="mt-4 grid list-none gap-2">
            {visible.map(({ geography, rank }) => {
              const isSelected = geography === selectedGeography;
              return (
                <li
                  aria-current={isSelected ? "true" : undefined}
                  aria-label={`${geography.geographyName}, rank ${rank}, ${formatExactPercent(geography.pctRegular)} regular`}
                  className={
                    isSelected
                      ? "grid min-w-0 grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-primary bg-field/55 px-3 py-3"
                      : "grid min-w-0 grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-rule bg-muted/30 px-3 py-3"
                  }
                  key={`${geography.geographyKind}-${geography.geographyId}`}
                >
                  <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">Rank {rank}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink">{geography.geographyName}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {`${geography.geographyId} · ${formatCount(geography.nPixels)} pixels`}
                    </span>
                  </span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-ink">
                    {formatExactPercent(geography.pctRegular)}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {hasOverflow ? (
          <button
            aria-expanded={isExpanded}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-rule bg-paper px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-focus"
            onClick={() => setIsExpanded((value) => !value)}
            type="button"
          >
            <ChevronDown aria-hidden="true" className={`size-4 ${isExpanded ? "rotate-180" : ""}`} />
            {isExpanded ? "Show less" : `Show ${ranked.length - COMPACT_ROW_COUNT} more`}
          </button>
        ) : null}
      </section>
    </Card>
  );
}

function PinnedDetail({
  geography,
  rank,
  total
}: {
  readonly geography: RotationGeoSummary;
  readonly rank: number;
  readonly total: number;
}) {
  const grainLabel = geography.geographyKind === "county" ? "counties" : "states";
  return (
    <article className="mt-4 rounded-lg border border-primary/35 bg-field/45 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-ink">Pinned geography · {geography.geographyName}</h4>
        <p className="text-xs font-semibold text-primary">{`Rank ${rank} of ${total} ${grainLabel}`}</p>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <DetailValue label="Regular" value={formatExactPercent(geography.pctRegular)} />
        <DetailValue label="Monoculture" value={formatExactPercent(geography.pctMonoculture)} />
        <DetailValue label="Irregular" value={formatExactPercent(geography.pctIrregular)} />
        <DetailValue label="Denominator" value={`${formatCount(geography.nPixels)} pixels`} />
      </dl>
    </article>
  );
}

function DetailValue({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="rounded-md bg-paper/80 px-3 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-mono font-semibold tabular-nums text-ink">{value}</dd>
    </div>
  );
}

function SelectionStatus({
  activeGrain,
  rankedCount,
  selectedGeography,
  selectedInput,
  selectedRank
}: {
  readonly activeGrain: RankedGrain;
  readonly rankedCount: number;
  readonly selectedGeography?: RotationGeoSummary;
  readonly selectedInput?: string;
  readonly selectedRank?: number;
}) {
  if (selectedGeography && selectedRank !== undefined) {
    return (
      <p className="shrink-0 rounded-full border border-primary/35 bg-field/55 px-3 py-1 text-xs font-semibold text-primary">
        {`${selectedGeography.geographyName} · rank ${selectedRank}/${rankedCount}`}
      </p>
    );
  }
  if (selectedInput) {
    return (
      <p className="max-w-md rounded-lg border border-dry/35 bg-dry/10 px-3 py-2 text-xs leading-5 text-dry">
        {`Pinned geography ${selectedInput} is outside the loaded Task 2 state/county table.`}
      </p>
    );
  }
  return (
    <p className="shrink-0 rounded-full border border-rule bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
      {`${ROTATION_COPY.noSelection} Showing ${activeGrain}s.`}
    </p>
  );
}

function rankGeographies(geographies: readonly RotationGeoSummary[]): readonly RankedGeography[] {
  const sorted = [...geographies].sort(
    (left, right) =>
      right.pctRegular - left.pctRegular || left.geographyName.localeCompare(right.geographyName)
  );
  let previousValue: number | undefined;
  let previousRank = 0;
  return sorted.map((geography, index) => {
    const rank = previousValue === geography.pctRegular ? previousRank : index + 1;
    previousValue = geography.pctRegular;
    previousRank = rank;
    return { geography, rank };
  });
}

function defaultGrain(geographies: readonly RotationGeoSummary[]): RankedGrain {
  return geographies.some((geography) => geography.geographyKind === "state") ? "state" : "county";
}

function toRankedGrain(kind: GeographyKind | undefined): RankedGrain | undefined {
  return kind === "state" || kind === "county" ? kind : undefined;
}

function matchesSelection(
  geography: RotationGeoSummary,
  selectedEntity?: string,
  selectedGeographyId?: string
): boolean {
  const candidates = [
    geography.geographyId,
    geography.geographyName,
    geography.stateCode,
    geography.stateFips,
    geography.countyFips
  ].filter((value): value is string => Boolean(value)).map(normalizeSelectionKey);
  const selectedKeys = [selectedEntity, selectedGeographyId]
    .filter((value): value is string => Boolean(value))
    .map(normalizeSelectionKey);
  return selectedKeys.some((selectedKey) => candidates.includes(selectedKey));
}

function normalizeSelectionKey(value: string): string {
  return value.trim().toLowerCase().replace(/^(state|county):/, "");
}
