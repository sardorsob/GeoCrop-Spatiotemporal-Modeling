"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  CropId,
  DataPointSource,
  PhenologyModelEvaluation,
  PhenologySeries
} from "@/lib/data/types";

import { NdviCurveChart } from "./NdviCurveChart";
import { PhenologyMetrics } from "./PhenologyMetrics";
import { CROP_LABELS, PHENOLOGY_COPY, PHENOLOGY_CROPS } from "./phenology-copy";
import {
  clampSeasonWindow,
  getSeasonBounds,
  getSeasonWindowPreset,
  type SeasonWindow,
  type SeasonWindowPresetId
} from "./season-window";

export interface PhenologyPanelProps {
  readonly modelEvaluation: readonly PhenologyModelEvaluation[];
  readonly phenologySeries: readonly PhenologySeries[];
  readonly selectedCrop?: CropId;
  readonly onCropChange?: (crop: CropId) => void;
}

const SEASON_PRESET_IDS = [
  "full",
  "green_up",
  "peak",
  "senescence"
] as const satisfies readonly SeasonWindowPresetId[];

export function PhenologyPanel({
  modelEvaluation,
  onCropChange,
  phenologySeries,
  selectedCrop
}: PhenologyPanelProps) {
  const focusedCrop = isComparatorCrop(selectedCrop) ? selectedCrop : PHENOLOGY_CROPS[0];
  const sharedBounds = getSeasonBounds(
    phenologySeries
      .filter((series) => isComparatorCrop(series.crop))
      .flatMap((series) => series.points)
  );
  const [requestedWindow, setRequestedWindow] = useState<SeasonWindow>();
  const [windowMode, setWindowMode] = useState<SeasonWindowPresetId | "custom">("full");
  const activeWindow = sharedBounds
    ? clampSeasonWindow(requestedWindow ?? sharedBounds, sharedBounds)
    : undefined;
  const isMissing = modelEvaluation.length === 0 && phenologySeries.length === 0;
  const sourceNotes = collectSources(modelEvaluation, phenologySeries);

  const setPreset = (presetId: SeasonWindowPresetId) => {
    if (!sharedBounds) return;
    setRequestedWindow(getSeasonWindowPreset(presetId, sharedBounds).window);
    setWindowMode(presetId);
  };

  const setCustomDay = (edge: "start" | "end", value: number) => {
    if (!activeWindow || !sharedBounds || !Number.isFinite(value)) return;
    setRequestedWindow(
      clampSeasonWindow(
        edge === "start"
          ? { startDay: value, endDay: activeWindow.endDay }
          : { startDay: activeWindow.startDay, endDay: value },
        sharedBounds
      )
    );
    setWindowMode("custom");
  };

  return (
    <section className="min-w-0 space-y-4" aria-labelledby="phenology-heading">
      <PanelHeader
        eyebrow={PHENOLOGY_COPY.eyebrow}
        heading={PHENOLOGY_COPY.heading}
        summary={PHENOLOGY_COPY.summary}
        headingId="phenology-heading"
        right={
          <label className="grid min-w-44 gap-1.5 text-sm">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Focus crop
            </span>
            <select
              aria-label="Focus crop"
              className="h-9 w-full rounded-md border border-rule bg-paper px-3 text-sm font-medium text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-field"
              value={focusedCrop}
              onChange={(event) => onCropChange?.(event.currentTarget.value as CropId)}
            >
              {PHENOLOGY_CROPS.map((crop) => (
                <option key={crop} value={crop}>{CROP_LABELS[crop]}</option>
              ))}
            </select>
          </label>
        }
      />

      {isMissing && (
        <Card>
          <CardContent className="border-l-4 border-amber-500">
            <h3 className="font-semibold text-ink">{PHENOLOGY_COPY.missingHeading}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {PHENOLOGY_COPY.missingBody}
            </p>
          </CardContent>
        </Card>
      )}

      {!isMissing && (
        <PhenologyMetrics
          focusedCrop={focusedCrop}
          metrics={modelEvaluation}
        />
      )}

      {activeWindow && sharedBounds && (
        <SeasonControls
          activeWindow={activeWindow}
          bounds={sharedBounds}
          mode={windowMode}
          onCustomDay={setCustomDay}
          onPreset={setPreset}
        />
      )}

      <div className="grid min-w-0 gap-4">
        {isMissing ? (
          <NdviCurveChart crop="corn" series={[]} />
        ) : (
          PHENOLOGY_CROPS.map((crop) => (
            <NdviCurveChart
              key={crop}
              crop={crop}
              emphasized={crop === focusedCrop}
              seasonWindow={activeWindow}
              series={phenologySeries}
            />
          ))
        )}
      </div>

      {sourceNotes.length > 0 && <SourceNotes sources={sourceNotes} />}
    </section>
  );
}

function SeasonControls({
  activeWindow,
  bounds,
  mode,
  onCustomDay,
  onPreset
}: {
  readonly activeWindow: SeasonWindow;
  readonly bounds: SeasonWindow;
  readonly mode: SeasonWindowPresetId | "custom";
  readonly onCustomDay: (edge: "start" | "end", value: number) => void;
  readonly onPreset: (preset: SeasonWindowPresetId) => void;
}) {
  return (
    <Card>
      <details className="group px-4 py-3 sm:px-5">
        <summary className="cursor-pointer list-none text-sm font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-field">
          <span className="flex items-center justify-between gap-3">
            <span>{`Season window · DOY ${activeWindow.startDay}–${activeWindow.endDay}`}</span>
            <span aria-hidden="true" className="text-muted-foreground group-open:rotate-45">+</span>
          </span>
        </summary>
        <section
          aria-label="Season window controls"
          className="mt-4 grid gap-4 border-t border-rule pt-4 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <p className="text-sm font-medium tabular-nums text-ink-soft">
              {`Visible span: DOY ${activeWindow.startDay}–${activeWindow.endDay}`}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SEASON_PRESET_IDS.map((presetId) => {
                const preset = getSeasonWindowPreset(presetId, bounds);
                return (
                  <Button
                    key={presetId}
                    onClick={() => onPreset(presetId)}
                    size="sm"
                    type="button"
                    variant={mode === presetId ? "default" : "outline"}
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <DayInput
              bounds={bounds}
              label="Start day of year"
              onChange={(value) => onCustomDay("start", value)}
              value={activeWindow.startDay}
            />
            <DayInput
              bounds={bounds}
              label="End day of year"
              onChange={(value) => onCustomDay("end", value)}
              value={activeWindow.endDay}
            />
          </div>
        </section>
      </details>
    </Card>
  );
}

function DayInput({
  bounds,
  label,
  onChange,
  value
}: {
  readonly bounds: SeasonWindow;
  readonly label: string;
  readonly onChange: (value: number) => void;
  readonly value: number;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label.startsWith("Start") ? "Start DOY" : "End DOY"}
      </span>
      <input
        aria-label={label}
        className="h-9 min-w-0 w-full rounded-md border border-rule bg-paper px-2 tabular-nums text-ink focus:outline-none focus:ring-2 focus:ring-field"
        max={bounds.endDay}
        min={bounds.startDay}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        type="number"
        value={value}
      />
    </label>
  );
}

export function PanelHeader({
  eyebrow,
  heading,
  summary,
  headingId,
  right
}: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly summary: string;
  readonly headingId?: string;
  readonly right?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-field-dark">
            {eyebrow}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold leading-tight text-ink" id={headingId}>
            {heading}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{summary}</p>
        </div>
        {right}
      </CardContent>
    </Card>
  );
}

function SourceNotes({ sources }: { readonly sources: readonly DataPointSource[] }) {
  return (
    <Card>
      <section aria-label="Task 1 source notes" className="px-4 py-5 sm:px-5">
        <h3 className="font-semibold text-ink">Sources & reading limits</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {sources.map((source) => (
            <article
              key={`${source.sourceId}-${source.path ?? ""}`}
              className="min-w-0 rounded-lg border border-rule bg-muted/35 p-3 text-sm"
            >
              <h4 className="font-semibold text-ink">{source.label ?? source.sourceId}</h4>
              {source.path && (
                <p className="mt-2 break-words font-mono text-[10px] leading-4 text-muted-foreground">
                  {source.path}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-ink-soft">
                {source.rowCount !== undefined && (
                  <span className="rounded-full border border-rule bg-paper px-2 py-0.5">
                    {source.rowCount.toLocaleString("en-US")} rows
                  </span>
                )}
                {source.dateStamp && (
                  <span className="rounded-full border border-rule bg-paper px-2 py-0.5">
                    {source.dateStamp}
                  </span>
                )}
              </div>
              {source.denominator && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Denominator: {source.denominator}
                </p>
              )}
              {source.caveat && (
                <p className="mt-3 text-sm leading-6 text-ink-soft">{source.caveat}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </Card>
  );
}

function isComparatorCrop(crop: CropId | undefined): crop is (typeof PHENOLOGY_CROPS)[number] {
  return crop !== undefined && PHENOLOGY_CROPS.some((candidate) => candidate === crop);
}

function collectSources(
  metrics: readonly PhenologyModelEvaluation[],
  series: readonly PhenologySeries[]
): readonly DataPointSource[] {
  const sources = [...metrics.map((metric) => metric.source), ...series.map((item) => item.source)];
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.sourceId}-${source.path ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
