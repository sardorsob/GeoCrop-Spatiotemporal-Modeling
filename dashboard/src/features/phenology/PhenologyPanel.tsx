import type {
  CropId,
  DataPointSource,
  PhenologyModelEvaluation,
  PhenologySeries
} from "@/lib/data/types";
import { CROP_OPTIONS } from "@/lib/state/dashboard-state";

import { NdviCurveChart } from "./NdviCurveChart";
import { PhenologyMetrics } from "./PhenologyMetrics";
import { PHENOLOGY_COPY } from "./phenology-copy";

export interface PhenologyPanelProps {
  readonly modelEvaluation: readonly PhenologyModelEvaluation[];
  readonly phenologySeries: readonly PhenologySeries[];
  readonly selectedCrop?: CropId;
  readonly onCropChange?: (crop: CropId) => void;
}

export function PhenologyPanel({
  modelEvaluation,
  onCropChange,
  phenologySeries,
  selectedCrop
}: PhenologyPanelProps) {
  const activeCrop = selectedCrop ?? getFirstCrop(modelEvaluation, phenologySeries);
  const cropSeries = phenologySeries.filter((series) => series.crop === activeCrop);
  const metric = modelEvaluation.find((row) => row.crop === activeCrop);
  const isMissing = modelEvaluation.length === 0 && phenologySeries.length === 0;
  const sourceNotes = collectSources(metric, cropSeries);

  return (
    <section className="space-y-4" aria-labelledby="phenology-heading">
      <div className="border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {PHENOLOGY_COPY.eyebrow}
            </p>
            <h2
              className="mt-1 text-xl font-semibold leading-tight text-slate-950"
              id="phenology-heading"
            >
              {PHENOLOGY_COPY.heading}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {PHENOLOGY_COPY.summary}
            </p>
          </div>
          <label className="grid min-w-44 gap-1 text-sm font-medium text-slate-700">
            Crop
            <select
              className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              onChange={(event) =>
                onCropChange?.(event.currentTarget.value as CropId)
              }
              value={activeCrop}
            >
              {CROP_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {isMissing ? (
        <div className="border border-dashed border-slate-300 bg-slate-50 p-4">
          <h3 className="text-base font-semibold text-slate-950">
            {PHENOLOGY_COPY.missingHeading}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {PHENOLOGY_COPY.missingBody}
          </p>
        </div>
      ) : null}

      <PhenologyMetrics crop={activeCrop} metric={metric} />
      <NdviCurveChart crop={activeCrop} series={cropSeries} />

      {sourceNotes.length > 0 ? <SourceNotes sources={sourceNotes} /> : null}
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
      aria-label="Task 1 source notes"
      className="border border-slate-200 bg-white p-4"
    >
      <h3 className="text-base font-semibold text-slate-950">Source notes</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {sources.map((source) => (
          <article
            className="border border-slate-200 bg-slate-50 p-3 text-sm"
            key={`${source.sourceId}-${source.path ?? ""}`}
          >
            <h4 className="font-semibold text-slate-950">
              {source.label ?? source.sourceId}
            </h4>
            {source.path ? (
              <p className="mt-2 break-words text-xs leading-5 text-slate-600">
                {source.path}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
              {source.rowCount !== undefined ? (
                <span className="border border-slate-300 bg-white px-2 py-1">
                  {source.rowCount.toLocaleString("en-US")} rows
                </span>
              ) : null}
              {source.dateStamp ? (
                <span className="border border-slate-300 bg-white px-2 py-1">
                  {source.dateStamp}
                </span>
              ) : null}
            </div>
            {source.denominator ? (
              <p className="mt-3 text-xs leading-5 text-slate-600">
                Denominator: {source.denominator}
              </p>
            ) : null}
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

function getFirstCrop(
  modelEvaluation: readonly PhenologyModelEvaluation[],
  phenologySeries: readonly PhenologySeries[]
): CropId {
  return modelEvaluation[0]?.crop ?? phenologySeries[0]?.crop ?? "corn";
}

function collectSources(
  metric: PhenologyModelEvaluation | undefined,
  series: readonly PhenologySeries[]
): readonly DataPointSource[] {
  const sources = [
    metric?.source,
    ...series.map((item) => item.source)
  ].filter((source): source is DataPointSource => Boolean(source));
  const seen = new Set<string>();

  return sources.filter((source) => {
    const key = `${source.sourceId}-${source.path ?? ""}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
