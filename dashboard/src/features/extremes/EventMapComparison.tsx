"use client";

import { useEffect, useMemo, useState } from "react";

import { UsChoropleth } from "@/components/map/UsChoropleth";
import {
  formatEvidenceValue,
  getEvidenceFill,
  getEvidenceGradient,
  getEvidenceMapLayer
} from "@/features/map/map-layers";
import { getStudyStateFeatures } from "@/components/map/map-geometry";
import { selectEventMapEvidence } from "@/lib/data/selectors";
import type {
  AnomalyStateCropSummary,
  CropId,
  ExtremeEventId
} from "@/lib/data/types";
import { EXTREME_EVENT_OPTIONS } from "@/lib/state/dashboard-state";

import {
  EXTREME_EVENT_DETAILS,
  EXTREMES_COPY,
  formatCount,
  formatProbability,
  formatSignedZScore,
  getCropLabel
} from "./extremes-copy";

interface GeographyReference {
  readonly id: string;
  readonly name: string;
}

export interface EventMapComparisonProps {
  readonly rows: readonly AnomalyStateCropSummary[];
  readonly crop: CropId;
  readonly selectedState?: string;
  readonly onStateChange?: (state: string | undefined) => void;
}

export function EventMapComparison({
  rows,
  crop,
  selectedState,
  onStateChange
}: EventMapComparisonProps) {
  const layer = getEvidenceMapLayer("soil-moisture-anomaly");
  const [preview, setPreview] = useState<GeographyReference>();
  const [pinned, setPinned] = useState<GeographyReference>();
  const selectedFromProps = useMemo(
    () => resolveStateReference(selectedState),
    [selectedState]
  );
  const selected = selectedFromProps ?? pinned;
  const evidence = EXTREME_EVENT_OPTIONS.map((event) => ({
    event,
    result: selectEventMapEvidence(
      { anomalySummaries: rows },
      { eventId: event.id, crop }
    )
  }));

  useEffect(() => {
    function clearPinned(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreview(undefined);
        setPinned(undefined);
        onStateChange?.(undefined);
      }
    }

    document.addEventListener("keydown", clearPinned);
    return () => document.removeEventListener("keydown", clearPinned);
  }, [onStateChange]);

  function pinState(id: string, name: string) {
    setPreview(undefined);
    setPinned({ id, name });
    onStateChange?.(name);
  }

  return (
    <section aria-label="Matched flood and drought maps" className="space-y-4">
      <div
        className="grid gap-4 lg:grid-cols-2"
        data-layout="stack-to-pair"
        data-testid="event-map-comparison"
      >
        {evidence.map(({ event, result }) => (
          <article
            aria-label={`${event.label} map`}
            className="min-w-0 overflow-hidden rounded-xl border border-rule bg-paper"
            data-domain={`${result.domain[0].toFixed(4)}:${result.domain[1].toFixed(4)}`}
            data-testid="event-map-frame"
            key={event.id}
          >
            <header className="border-b border-rule px-4 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    {EXTREME_EVENT_DETAILS[event.id].shortLabel}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                    {event.label}
                  </h3>
                </div>
                <span className="rounded-full border border-rule bg-muted/50 px-2.5 py-1 text-xs font-semibold text-ink">
                  {getCropLabel(crop)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Shared mean z scale · {formatDomain(result.domain[0])} to {formatDomain(result.domain[1])}
              </p>
            </header>

            <div className="p-3 sm:p-4">
              <UsChoropleth
                colorScale={(value) => getEvidenceFill(layer, value, result.domain)}
                formatValue={(value) => formatEvidenceValue(value, layer.unit)}
                geographyKind="state"
                onPin={pinState}
                onPreview={(id, name) => setPreview({ id, name })}
                onPreviewEnd={() => setPreview(undefined)}
                previewId={preview?.id}
                selectedId={selected?.id}
                values={result.values}
              />
              <MapLegend domain={result.domain} gradient={getEvidenceGradient(layer)} />
            </div>
          </article>
        ))}
      </div>

      {selected ? (
        <PinnedEvidence
          crop={crop}
          onReset={() => {
            setPinned(undefined);
            onStateChange?.(undefined);
          }}
          rows={rows}
          state={selected}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-rule bg-muted/30 px-4 py-5 text-sm text-muted-foreground">
          Hover or focus to preview. Select a state in either frame to pin the same geography across both events.
        </div>
      )}
    </section>
  );
}

function MapLegend({
  domain,
  gradient
}: {
  readonly domain: readonly [number, number];
  readonly gradient: string;
}) {
  return (
    <ul
      aria-label="Mean z legend"
      className="mt-3 grid grid-cols-3 gap-x-2 gap-y-2 text-[10px] text-muted-foreground"
    >
      <li className="col-span-3 h-2.5 rounded-full border border-rule" style={{ background: gradient }} />
      <li>{formatDomain(domain[0])}</li>
      <li className="text-center">0</li>
      <li className="text-right">{formatDomain(domain[1])}</li>
      <li className="col-span-3 flex items-center gap-2">
        <span className="size-3 rounded-sm border border-rule bg-[#ded8cb]" />
        No state × crop value
      </li>
    </ul>
  );
}

function PinnedEvidence({
  crop,
  onReset,
  rows,
  state
}: {
  readonly crop: CropId;
  readonly onReset: () => void;
  readonly rows: readonly AnomalyStateCropSummary[];
  readonly state: GeographyReference;
}) {
  return (
    <aside
      aria-label="Pinned event evidence"
      className="rounded-xl border border-rule bg-paper p-4 sm:p-5"
      role="region"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            Pinned comparison
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">
            {state.name} · {getCropLabel(crop)}
          </h3>
        </div>
        <button
          className="min-h-10 rounded-full border border-rule bg-paper px-3 text-sm font-medium text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-focus"
          onClick={onReset}
          type="button"
        >
          Clear pin
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {EXTREME_EVENT_OPTIONS.map((event) => {
          const row = findRow(rows, event.id, crop, state);
          return (
            <EventEvidenceCard
              crop={crop}
              eventId={event.id}
              key={event.id}
              row={row}
              stateName={state.name}
            />
          );
        })}
      </div>
    </aside>
  );
}

function EventEvidenceCard({
  crop,
  eventId,
  row,
  stateName
}: {
  readonly crop: CropId;
  readonly eventId: ExtremeEventId;
  readonly row?: AnomalyStateCropSummary;
  readonly stateName: string;
}) {
  const details = EXTREME_EVENT_DETAILS[eventId];

  if (!row) {
    return (
      <article className="rounded-lg border border-dashed border-rule bg-muted/30 p-4">
        <h4 className="font-semibold text-ink">{details.label}</h4>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          No {details.label} value for {getCropLabel(crop)} in {stateName}.
        </p>
      </article>
    );
  }

  return (
    <article className="rounded-lg border border-rule bg-muted/30 p-4">
      <h4 className="font-semibold text-ink">{details.label}</h4>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Map magnitude</dt>
          <dd className="mt-0.5 font-mono font-semibold tabular-nums text-ink">
            Mean z · {formatSignedZScore(row.meanZ)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Posterior context</dt>
          <dd className="mt-0.5 font-mono font-semibold tabular-nums text-ink">
            NIG percentile · {formatProbability(row.meanNigPDrought)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Denominator</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-ink">
            {formatCount(row.nPixelWeeks)} pixel-weeks
          </dd>
        </div>
      </dl>
      <div className="mt-4 border-t border-rule pt-3 text-xs leading-5 text-muted-foreground">
        <p className="font-semibold text-ink">{row.source.label ?? row.source.sourceId}</p>
        <p className="mt-1">{row.source.denominator ?? EXTREMES_COPY.denominatorFallback}</p>
        {row.source.caveat ? <p className="mt-1">{row.source.caveat}</p> : null}
      </div>
    </article>
  );
}

function findRow(
  rows: readonly AnomalyStateCropSummary[],
  eventId: ExtremeEventId,
  crop: CropId,
  state: GeographyReference
) {
  const stateName = state.name.toLowerCase();
  return rows.find(
    (row) =>
      row.eventId === eventId &&
      row.crop === crop &&
      (row.stateCode === state.id || row.state.toLowerCase() === stateName)
  );
}

function resolveStateReference(value: string | undefined): GeographyReference | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(/^state:/i, "").toLowerCase();
  const feature = getStudyStateFeatures().find(
    (candidate) =>
      candidate.properties.geographyId.toLowerCase() === normalized ||
      candidate.properties.name.toLowerCase() === normalized
  );

  return feature
    ? { id: feature.properties.geographyId, name: feature.properties.name }
    : undefined;
}

function formatDomain(value: number): string {
  const sign = value < 0 ? "−" : "+";
  return `${sign}${Math.abs(value).toFixed(4)}`;
}
