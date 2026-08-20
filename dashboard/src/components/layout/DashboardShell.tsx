"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  Leaf,
  Repeat,
  ShieldAlert,
  Target
} from "lucide-react";

import { MapPanel } from "@/components/map/MapPanel";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ExtremesPanel } from "@/features/extremes/ExtremesPanel";
import type { CornBeltMapSelectionContext } from "@/features/map/map-selection";
import { PhenologyPanel } from "@/features/phenology/PhenologyPanel";
import { PredictionPanel } from "@/features/prediction/PredictionPanel";
import { RotationPanel } from "@/features/rotation/RotationPanel";
import type { NormalizedDashboardData } from "@/lib/data/normalize";
import type { DashboardFilterState, DashboardTab } from "@/lib/data/types";
import { normalizeDashboardFilterState } from "@/lib/state/dashboard-state";
import {
  parseDashboardUrlState,
  type DashboardUrlStateWarning,
  updateDashboardUrlSearchParams
} from "@/lib/state/url-state";
import { cn } from "@/lib/utils";

export interface DashboardShellProps {
  readonly data: NormalizedDashboardData;
}

const TAB_META: Record<
  DashboardTab,
  { readonly label: string; readonly icon: ComponentType<{ className?: string }> }
> = {
  phenology: { label: "Phenology", icon: Leaf },
  rotation: { label: "Rotation", icon: Repeat },
  extremes: { label: "Extremes", icon: ShieldAlert },
  prediction: { label: "Prediction", icon: Target }
};

const PAPER_REFERENCE = {
  title: "GeoCrop research paper",
  fileName: "NAFSI_Predictive_Modeling_for_Agricultural_Resilience.pdf",
  href: "/papers/NAFSI_Predictive_Modeling_for_Agricultural_Resilience.pdf"
} as const;

export function DashboardShell({ data }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamString = searchParams.toString();
  const parsedUrlState = useMemo(
    () => parseDashboardUrlState(new URLSearchParams(searchParamString)),
    [searchParamString]
  );
  const [localState, setLocalState] = useState<{
    readonly searchParamString: string;
    readonly state: DashboardFilterState;
  }>({ searchParamString, state: parsedUrlState.state });
  const dashboardState =
    localState.searchParamString === searchParamString
      ? localState.state
      : parsedUrlState.state;

  function updateState(nextState: DashboardFilterState) {
    const normalized = normalizeDashboardFilterState(nextState);
    setLocalState({ searchParamString, state: normalized });
    const nextParams = updateDashboardUrlSearchParams(
      new URLSearchParams(searchParamString),
      normalized
    );
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function patchState(patch: Partial<DashboardFilterState>) {
    updateState({ ...dashboardState, ...patch });
  }

  function handleMapSelection(context: CornBeltMapSelectionContext) {
    patchState({ selectedEntity: context.selection.id });
  }

  return (
    <div className="min-h-screen min-w-0 text-ink">
      <TopBar
        data={data}
        paperAction={<PaperReferenceAction />}
      />

      <ExploreExperience
        data={data}
        onMapSelection={handleMapSelection}
        onStatePatch={patchState}
        state={dashboardState}
        warnings={parsedUrlState.warnings}
      />
    </div>
  );
}

function ExploreExperience({
  data,
  onMapSelection,
  onStatePatch,
  state,
  warnings
}: {
  readonly data: NormalizedDashboardData;
  readonly onMapSelection: (context: CornBeltMapSelectionContext) => void;
  readonly onStatePatch: (patch: Partial<DashboardFilterState>) => void;
  readonly state: DashboardFilterState;
  readonly warnings: readonly DashboardUrlStateWarning[];
}) {
  return (
    <main className="mx-auto flex max-w-[1600px] min-w-0 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">
          Evidence lab
        </p>
        <h2 className="mt-2 text-balance font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Examine one research task at a time.
        </h2>
        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-muted-foreground sm:text-base">
          Controls stay beside the evidence they affect. Exact values, denominators,
          uncertainty, sources, and limitations remain part of the reading path.
        </p>
      </header>

      <UrlStateWarnings warnings={warnings} />
      <TaskTabs
        activeTab={state.tab}
        onTabChange={(tab) => onStatePatch({ tab })}
      />
      <section
        aria-label="Active task panel"
        className="mt-1 min-w-0"
        id={`tabpanel-${state.tab}`}
        role="tabpanel"
      >
        <TaskPanel
          data={data}
          onMapSelection={onMapSelection}
          onStatePatch={onStatePatch}
          state={state}
          tab={state.tab}
        />
      </section>
      <DataLoadStatus data={data} />
    </main>
  );
}

function TaskPanel({
  data,
  onMapSelection,
  onStatePatch,
  state,
  tab
}: {
  readonly data: NormalizedDashboardData;
  readonly onMapSelection: (context: CornBeltMapSelectionContext) => void;
  readonly onStatePatch: (patch: Partial<DashboardFilterState>) => void;
  readonly state: DashboardFilterState;
  readonly tab: DashboardTab;
}) {
  if (tab === "phenology") {
    return (
      <PhenologyPanel
        modelEvaluation={data.task1.modelEvaluation}
        onCropChange={(crop) => onStatePatch({ crop })}
        phenologySeries={data.task1.phenologySeries}
        selectedCrop={state.crop}
      />
    );
  }

  if (tab === "rotation") {
    return (
      <RotationPanel
        classSummaries={data.task2.classSummaries}
        geographyFigure={
          <MapPanel
            activeLayerId="rotation-regular-probability"
            data={{ task2: data.task2, task3: data.task3 }}
            onSelectionChange={onMapSelection}
            selectedGeographyId={state.selectedEntity}
            showLayerControl={false}
          />
        }
        geographySummaries={data.task2.geographySummaries}
        markovTransitions={data.task2.markovTransitions}
        selectedEntity={state.selectedEntity}
        thresholdSensitivity={data.task2.thresholdSensitivity}
      />
    );
  }

  if (tab === "extremes") {
    return (
      <ExtremesPanel
        anomalySummaries={data.task3.anomalySummaries}
        onCropChange={(crop) => onStatePatch({ crop })}
        onStateChange={(selectedState) => onStatePatch({ state: selectedState })}
        selectedCrop={state.crop}
        selectedEvent={state.event}
        selectedState={state.state}
      />
    );
  }

  return (
    <PredictionPanel
      ablationResults={data.task4.ablationResults}
      regimeMetrics={data.task4.regimeMetrics}
      shapFeatures={data.task4.shapFeatures}
      splitSummaries={data.task4.splitSummaries}
      testMetrics={data.task4.testMetrics}
    />
  );
}

function TaskTabs({
  activeTab,
  onTabChange
}: {
  readonly activeTab: DashboardTab;
  readonly onTabChange: (tab: DashboardTab) => void;
}) {
  return (
    <nav
      aria-label="Research tasks"
      className="inline-flex w-full items-center rounded-xl border border-rule bg-paper p-1 shadow-sm"
      role="tablist"
    >
      <div className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4">
        {(Object.entries(TAB_META) as [DashboardTab, (typeof TAB_META)[DashboardTab]][]).map(
          ([id, meta]) => {
            const Icon = meta.icon;
            const isActive = id === activeTab;
            return (
              <button
                aria-controls={`tabpanel-${id}`}
                aria-selected={isActive}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                  isActive
                    ? "bg-field text-ink shadow-sm"
                    : "text-muted-foreground hover:bg-field/45 hover:text-ink"
                )}
                key={id}
                onClick={() => onTabChange(id)}
                role="tab"
                type="button"
              >
                <Icon className="size-4" aria-hidden="true" />
                {meta.label}
              </button>
            );
          }
        )}
      </div>
    </nav>
  );
}

function PaperReferenceAction() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open GeoCrop research paper"
          className="min-h-11 min-w-11 shrink-0"
          size="sm"
          type="button"
          variant="outline"
        >
          <BookOpen className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Paper</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        aria-label={PAPER_REFERENCE.title}
        className="flex w-[min(100vw,980px)] flex-col sm:max-w-5xl"
      >
        <SheetHeader>
          <SheetTitle>{PAPER_REFERENCE.title}</SheetTitle>
          <SheetDescription>
            Predictive Modeling for Agricultural Resilience. Open the PDF in a new
            tab, download it, or read it directly in the embedded viewer.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-wrap gap-2 border-b border-rule px-6 py-3">
          <Button asChild size="sm" variant="outline">
            <a href={PAPER_REFERENCE.href} rel="noreferrer" target="_blank">
              <ExternalLink className="size-4" aria-hidden="true" />
              Open PDF
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a download={PAPER_REFERENCE.fileName} href={PAPER_REFERENCE.href}>
              <Download className="size-4" aria-hidden="true" />
              Download PDF
            </a>
          </Button>
        </div>
        <div className="min-h-0 flex-1 p-4 sm:p-6">
          <div className="flex h-[72vh] min-h-[440px] overflow-hidden rounded-xl border border-rule bg-muted">
            <iframe
              className="h-full w-full"
              src={PAPER_REFERENCE.href}
              title={`${PAPER_REFERENCE.title} PDF`}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function UrlStateWarnings({
  warnings
}: {
  readonly warnings: readonly DashboardUrlStateWarning[];
}) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="URL compatibility notice"
      className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950"
      role="status"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">This shared view needed a safe update.</p>
          <ul className="mt-1 space-y-1 text-sm leading-6">
            {warnings.map((warning) => (
              <li key={`${warning.param}-${warning.value}`}>{warning.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DataLoadStatus({ data }: { readonly data: NormalizedDashboardData }) {
  if (data.errors.length === 0) {
    return (
      <Card asChild className="border-emerald-100 bg-gradient-to-r from-emerald-50/60 to-white">
        <section aria-label="Data load status" role="status">
          <CardContent className="flex items-center gap-3 py-3">
            <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
            <p className="text-sm text-emerald-900">
              All scoped source artifacts loaded for this dashboard snapshot.
            </p>
          </CardContent>
        </section>
      </Card>
    );
  }

  return (
    <Card asChild className="border-amber-200 bg-gradient-to-r from-amber-50/60 to-white">
      <section aria-label="Data load status" role="status">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-amber-900">
                {data.errors.length} source artifact{data.errors.length === 1 ? "" : "s"} reported a load issue
              </p>
              <p className="mt-0.5 text-sm leading-6 text-amber-700">
                Chapters remain visible with loaded evidence and named empty states where needed.
              </p>
              <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                {data.errors.map((error) => (
                  <li
                    className="rounded-lg border border-amber-200 bg-white px-3 py-2"
                    key={`${error.sourceId}-${error.path}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">{error.label}</span>
                      <Badge variant="amber">Error</Badge>
                    </div>
                    <p className="mt-1 text-xs text-amber-700">{error.message}</p>
                    <p className="mt-1 break-all font-mono text-[10px] text-slate-500">
                      {error.path}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </section>
    </Card>
  );
}
