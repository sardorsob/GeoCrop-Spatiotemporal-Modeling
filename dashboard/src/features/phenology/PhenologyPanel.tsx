import { Card, CardContent } from "@/components/ui/card";
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
  const cropSeries = phenologySeries.filter((s) => s.crop === activeCrop);
  const metric = modelEvaluation.find((row) => row.crop === activeCrop);
  const isMissing = modelEvaluation.length === 0 && phenologySeries.length === 0;
  const sourceNotes = collectSources(metric, cropSeries);

  return (
    <section className="space-y-4" aria-labelledby="phenology-heading">
      <PanelHeader
        eyebrow={PHENOLOGY_COPY.eyebrow}
        heading={PHENOLOGY_COPY.heading}
        summary={PHENOLOGY_COPY.summary}
        headingId="phenology-heading"
        right={
          <label className="grid min-w-44 gap-1.5 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Crop</span>
            <select
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={activeCrop}
              onChange={(e) => onCropChange?.(e.currentTarget.value as CropId)}
            >
              {CROP_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </label>
        }
      />

      {isMissing && (
        <Card>
          <CardContent className="border-l-4 border-amber-400">
            <h3 className="text-base font-semibold text-slate-900">{PHENOLOGY_COPY.missingHeading}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{PHENOLOGY_COPY.missingBody}</p>
          </CardContent>
        </Card>
      )}

      <PhenologyMetrics crop={activeCrop} metric={metric} />
      <NdviCurveChart crop={activeCrop} series={cropSeries} />

      {sourceNotes.length > 0 && <SourceNotes sources={sourceNotes} />}
    </section>
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold leading-tight text-slate-900" id={headingId}>
            {heading}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{summary}</p>
        </div>
        {right}
      </CardContent>
    </Card>
  );
}

function SourceNotes({ sources }: { readonly sources: readonly DataPointSource[] }) {
  return (
    <Card>
      <section aria-label="Task 1 source notes" className="px-5 py-5">
        <h3 className="text-base font-semibold text-slate-900">Source notes</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {sources.map((source) => (
            <article
              key={`${source.sourceId}-${source.path ?? ""}`}
              className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3 text-sm"
            >
              <h4 className="font-semibold text-slate-900">{source.label ?? source.sourceId}</h4>
              {source.path && (
                <p className="mt-2 break-words font-mono text-[11px] leading-4 text-slate-500">{source.path}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                {source.rowCount !== undefined && (
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-600">
                    {source.rowCount.toLocaleString("en-US")} rows
                  </span>
                )}
                {source.dateStamp && (
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-600">
                    {source.dateStamp}
                  </span>
                )}
              </div>
              {source.denominator && (
                <p className="mt-3 text-xs leading-5 text-slate-500">Denominator: {source.denominator}</p>
              )}
              {source.caveat && (
                <p className="mt-3 text-sm leading-6 text-slate-600">{source.caveat}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </Card>
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
  const sources = [metric?.source, ...series.map((s) => s.source)].filter(
    (s): s is DataPointSource => Boolean(s)
  );
  const seen = new Set<string>();
  return sources.filter((s) => {
    const key = `${s.sourceId}-${s.path ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
