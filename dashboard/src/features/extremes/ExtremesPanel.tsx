import type {
  AnomalyStateCropSummary,
  CropId,
  DataPointSource,
  ExtremeEventId
} from "@/lib/data/types";
import { CROP_OPTIONS } from "@/lib/state/dashboard-state";

import { AnomalySummaryChart } from "./AnomalySummaryChart";
import { AnomalyTable } from "./AnomalyTable";
import { EventSelector } from "./EventSelector";
import {
  EXTREME_EVENT_DETAILS,
  EXTREMES_COPY,
  formatCount
} from "./extremes-copy";

export interface ExtremesPanelProps {
  readonly anomalySummaries: readonly AnomalyStateCropSummary[];
  readonly selectedEvent?: ExtremeEventId;
  readonly selectedCrop?: CropId;
  readonly selectedState?: string;
  readonly onEventChange?: (eventId: ExtremeEventId) => void;
  readonly onCropChange?: (crop: CropId | undefined) => void;
  readonly onStateChange?: (state: string | undefined) => void;
}

const defaultEventId: ExtremeEventId = "midwest_flood_2019";
const inputClassName =
  "w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600";

export function ExtremesPanel({
  anomalySummaries,
  onCropChange,
  onEventChange,
  onStateChange,
  selectedCrop,
  selectedEvent,
  selectedState
}: ExtremesPanelProps) {
  const activeEvent = selectedEvent ?? anomalySummaries[0]?.eventId ?? defaultEventId;
  const eventRows = anomalySummaries.filter((row) => row.eventId === activeEvent);
  const stateOptions = getStateOptions(eventRows, selectedState);
  const filteredRows = eventRows.filter(
    (row) =>
      (!selectedCrop || row.crop === selectedCrop) &&
      (!selectedState || row.state.toLowerCase() === selectedState.toLowerCase())
  );
  const sources = collectSources(eventRows.length > 0 ? eventRows : filteredRows);

  return (
    <section aria-labelledby="extremes-heading" className="space-y-4 text-slate-950">
      <div className="border border-slate-200 bg-white p-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {EXTREMES_COPY.eyebrow}
            </p>
            <h2
              className="mt-1 text-xl font-semibold leading-tight text-slate-950"
              id="extremes-heading"
            >
              {EXTREMES_COPY.heading}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {EXTREMES_COPY.summary}
            </p>
          </div>
          <EventSelector
            onEventChange={onEventChange}
            selectedEvent={activeEvent}
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Crop
            <select
              className={inputClassName}
              onChange={(event) =>
                onCropChange?.(optionalCrop(event.currentTarget.value))
              }
              value={selectedCrop ?? ""}
            >
              <option value="">All crops</option>
              {CROP_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            State
            <select
              className={inputClassName}
              onChange={(event) =>
                onStateChange?.(optionalText(event.currentTarget.value))
              }
              value={selectedState ?? ""}
            >
              <option value="">All states</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <CaveatCards eventId={activeEvent} />

      {filteredRows.length === 0 ? (
        <div
          className="border border-amber-300 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950"
          role="status"
        >
          {EXTREMES_COPY.emptyState}
        </div>
      ) : (
        <>
          <AnomalySummaryChart eventId={activeEvent} rows={filteredRows} />
          <AnomalyTable rows={filteredRows} />
        </>
      )}

      {sources.length > 0 ? <SourceNotes sources={sources} /> : null}
    </section>
  );
}

function CaveatCards({ eventId }: { readonly eventId: ExtremeEventId }) {
  return (
    <section
      aria-label="Task 3 soil moisture caveats"
      className="grid gap-3 md:grid-cols-3"
    >
      <article className="border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          z-score
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {EXTREMES_COPY.zScoreCaveat}
        </p>
      </article>
      <article className="border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          NIG P(drought)
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {EXTREMES_COPY.nigCaveat}
        </p>
      </article>
      <article className="border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Interpretation
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {EXTREME_EVENT_DETAILS[eventId].interpretation}
        </p>
      </article>
    </section>
  );
}

function SourceNotes({
  sources
}: {
  readonly sources: readonly DataPointSource[];
}) {
  return (
    <section
      aria-label="Task 3 source notes"
      className="border border-slate-200 bg-white p-4"
    >
      <h3 className="text-base font-semibold text-slate-950">Source notes</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {sources.map((source) => (
          <article
            className="border border-slate-200 bg-slate-50 p-3 text-sm"
            key={`${source.sourceId}-${source.path ?? ""}`}
          >
            <h4 className="font-semibold text-slate-950">
              {source.label ?? source.sourceId}
            </h4>
            {source.path ? (
              <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-600">
                {source.path}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
              {source.rowCount !== undefined ? (
                <span className="border border-slate-300 bg-white px-2 py-1">
                  {formatCount(source.rowCount)} rows
                </span>
              ) : null}
              {source.dateStamp ? (
                <span className="border border-slate-300 bg-white px-2 py-1">
                  {source.dateStamp}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-600">
              Denominator: {source.denominator ?? EXTREMES_COPY.denominatorFallback}
            </p>
            {source.caveat ? (
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {source.caveat}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function getStateOptions(
  rows: readonly AnomalyStateCropSummary[],
  selectedState: string | undefined
): readonly string[] {
  const states = new Set(rows.map((row) => row.state).filter(Boolean));

  if (selectedState) {
    states.add(selectedState);
  }

  return [...states].sort((left, right) => left.localeCompare(right));
}

function collectSources(
  rows: readonly AnomalyStateCropSummary[]
): readonly DataPointSource[] {
  const seen = new Set<string>();
  const sources: DataPointSource[] = [];

  for (const row of rows) {
    const key = `${row.source.sourceId}-${row.source.path ?? ""}`;

    if (!seen.has(key)) {
      seen.add(key);
      sources.push(row.source);
    }
  }

  return sources;
}

function optionalCrop(value: string): CropId | undefined {
  return optionalText(value) as CropId | undefined;
}

function optionalText(value: string): string | undefined {
  const trimmed = value.trim();

  return trimmed ? trimmed : undefined;
}
