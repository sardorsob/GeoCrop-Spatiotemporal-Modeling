"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FilterBar } from "@/components/filters/FilterBar";
import { CornBeltMap } from "@/components/map/CornBeltMap";
import { ExtremesPanel } from "@/features/extremes/ExtremesPanel";
import type { CornBeltMapSelectionContext } from "@/features/map/map-selection";
import { PhenologyPanel } from "@/features/phenology/PhenologyPanel";
import { PredictionPanel } from "@/features/prediction/PredictionPanel";
import { RotationPanel } from "@/features/rotation/RotationPanel";
import type { NormalizedDashboardData } from "@/lib/data/normalize";
import type {
  DashboardFilterState,
  DashboardTab,
} from "@/lib/data/types";
import {
  DASHBOARD_TAB_OPTIONS,
  DEFAULT_DASHBOARD_FILTER_STATE,
  normalizeDashboardFilterState
} from "@/lib/state/dashboard-state";
import {
  parseDashboardUrlState,
  updateDashboardUrlSearchParams
} from "@/lib/state/url-state";

export interface DashboardShellProps {
  readonly data: NormalizedDashboardData;
}

const tabSummaries: Readonly<
  Record<DashboardTab, { readonly status: string; readonly metric: string }>
> = {
  phenology: {
    status: "Stage timing",
    metric: "NDVI phase alignment"
  },
  rotation: {
    status: "Crop sequence",
    metric: "Rotation class share"
  },
  extremes: {
    status: "Stress windows",
    metric: "Soil moisture anomalies"
  },
  prediction: {
    status: "Model diagnostics",
    metric: "Held-out crop accuracy"
  }
};

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
  }>({
    searchParamString,
    state: parsedUrlState.state
  });
  const dashboardState =
    localState.searchParamString === searchParamString
      ? localState.state
      : parsedUrlState.state;

  function updateState(nextState: DashboardFilterState) {
    const normalizedState = normalizeDashboardFilterState(nextState);
    setLocalState({
      searchParamString,
      state: normalizedState
    });

    const nextParams = updateDashboardUrlSearchParams(
      new URLSearchParams(searchParamString),
      normalizedState
    );
    const nextQuery = nextParams.toString();

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false
    });
  }

  function patchState(patch: Partial<DashboardFilterState>) {
    updateState({ ...dashboardState, ...patch });
  }

  function resetState() {
    updateState(DEFAULT_DASHBOARD_FILTER_STATE);
  }

  function handleMapSelection(context: CornBeltMapSelectionContext) {
    patchState({ selectedEntity: context.selection.id });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              GeoCrop command center
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">
              GeoCrop Interactive Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Source-backed crop evidence workspace for phenology, rotation,
              soil moisture extremes, and prediction diagnostics.
            </p>
          </div>
          <StatusStrip data={data} />
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <FilterBar
          onChange={updateState}
          onReset={resetState}
          value={dashboardState}
          warnings={parsedUrlState.warnings}
        />

        <ResearchTabs
          activeTab={dashboardState.tab}
          onTabChange={(tab) => patchState({ tab })}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-5">
            <CornBeltMap
              activeLayerId={dashboardState.mapLayer}
              onLayerChange={(mapLayer) => patchState({ mapLayer })}
              onSelectionChange={handleMapSelection}
              selectedGeographyId={dashboardState.selectedEntity}
            />

            <section
              aria-label="Task evidence"
              className="min-w-0"
              role="tabpanel"
            >
              <ActivePanel
                data={data}
                state={dashboardState}
                updateState={patchState}
              />
            </section>
          </div>

          <aside
            aria-label="Selected context"
            className="border border-slate-200 bg-white"
          >
            <SelectedContext data={data} state={dashboardState} />
          </aside>
        </div>

        <DataLoadStatus data={data} />

        <AnalyticalSummary data={data} />
      </main>
    </div>
  );
}

function ResearchTabs({
  activeTab,
  onTabChange
}: {
  readonly activeTab: DashboardTab;
  readonly onTabChange: (tab: DashboardTab) => void;
}) {
  return (
    <nav aria-label="Research tasks" className="bg-white">
      <div
        aria-label="Research tasks"
        className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4"
        role="tablist"
      >
        {DASHBOARD_TAB_OPTIONS.map((tab) => {
          const isActive = tab.id === activeTab;
          const summary = tabSummaries[tab.id];

          return (
            <button
              aria-label={tab.label}
              aria-selected={isActive}
              className={[
                "min-h-24 bg-white px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2",
                isActive
                  ? "border-t-4 border-emerald-600"
                  : "border-t-4 border-transparent"
              ].join(" ")}
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              type="button"
            >
              <span className="block text-base font-semibold text-slate-950">
                {tab.label}
              </span>
              <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                {summary.status}
              </span>
              <span className="mt-2 block text-sm leading-5 text-slate-600">
                {summary.metric}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function StatusStrip({ data }: { readonly data: NormalizedDashboardData }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm sm:min-w-96">
      <div className="border-l-4 border-emerald-600 bg-emerald-50 px-3 py-2">
        <p className="text-xs font-medium text-emerald-800">Sources</p>
        <p className="font-semibold text-slate-950">
          {data.sources.length} tracked
        </p>
      </div>
      <div className="border-l-4 border-sky-600 bg-sky-50 px-3 py-2">
        <p className="text-xs font-medium text-sky-800">Tasks</p>
        <p className="font-semibold text-slate-950">1-4 wired</p>
      </div>
      <div className="border-l-4 border-amber-500 bg-amber-50 px-3 py-2">
        <p className="text-xs font-medium text-amber-800">Load issues</p>
        <p className="font-semibold text-slate-950">{data.errors.length}</p>
      </div>
    </div>
  );
}

function ActivePanel({
  data,
  state,
  updateState
}: {
  readonly data: NormalizedDashboardData;
  readonly state: DashboardFilterState;
  readonly updateState: (patch: Partial<DashboardFilterState>) => void;
}) {
  switch (state.tab) {
    case "rotation":
      return (
        <RotationPanel
          classSummaries={data.task2.classSummaries}
          geographySummaries={data.task2.geographySummaries}
          markovTransitions={data.task2.markovTransitions}
          selectedEntity={state.selectedEntity}
          thresholdSensitivity={data.task2.thresholdSensitivity}
        />
      );
    case "extremes":
      return (
        <ExtremesPanel
          anomalySummaries={data.task3.anomalySummaries}
          onCropChange={(crop) => updateState({ crop })}
          onEventChange={(event) => updateState({ event })}
          onStateChange={(selectedState) => updateState({ state: selectedState })}
          selectedCrop={state.crop}
          selectedEvent={state.event}
          selectedState={state.state}
        />
      );
    case "prediction":
      return (
        <PredictionPanel
          ablationResults={data.task4.ablationResults}
          regimeMetrics={data.task4.regimeMetrics}
          shapFeatures={data.task4.shapFeatures}
          splitSummaries={data.task4.splitSummaries}
          testMetrics={data.task4.testMetrics}
        />
      );
    case "phenology":
    default:
      return (
        <PhenologyPanel
          modelEvaluation={data.task1.modelEvaluation}
          onCropChange={(crop) => updateState({ crop })}
          phenologySeries={data.task1.phenologySeries}
          selectedCrop={state.crop}
        />
      );
  }
}

function SelectedContext({
  data,
  state
}: {
  readonly data: NormalizedDashboardData;
  readonly state: DashboardFilterState;
}) {
  return (
    <>
      <div className="border-b border-slate-200 px-4 py-4">
        <h2 className="text-lg font-semibold text-slate-950">
          Selected context
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          URL-backed task, map, filter, and source state.
        </p>
      </div>
      <div className="space-y-5 px-4 py-4">
        <ContextBlock label="Active tab" value={state.tab} />
        <ContextBlock label="Map layer" value={state.mapLayer} />
        <ContextBlock label="State" value={state.state ?? "All states"} />
        <ContextBlock label="Crop" value={state.crop ?? "All crops"} />
        <ContextBlock
          label="Extreme event"
          value={state.event ?? "All events"}
        />
        <ContextBlock
          label="Selection"
          value={state.selectedEntity ?? "No map geography selected"}
        />

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Source registry
          </h3>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {data.sources.length}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Scoped Task 1-4 CSV/JSON inputs tracked with labels, caveats, and
            denominators.
          </p>
        </div>
      </div>
    </>
  );
}

function ContextBlock({
  label,
  value
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </h3>
      <p className="mt-2 break-words text-base font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function DataLoadStatus({ data }: { readonly data: NormalizedDashboardData }) {
  if (data.errors.length === 0) {
    return (
      <section
        aria-label="Data load status"
        className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950"
        role="status"
      >
        All scoped source artifacts loaded for this dashboard snapshot.
      </section>
    );
  }

  return (
    <section
      aria-label="Data load status"
      className="border border-amber-300 bg-amber-50 p-4 text-amber-950"
      role="status"
    >
      <h2 className="text-base font-semibold">Data load status</h2>
      <p className="mt-1 text-sm leading-6">
        {data.errors.length} source artifact
        {data.errors.length === 1 ? "" : "s"} reported a load issue. Panels
        remain visible with the loaded data and explicit empty states where
        needed.
      </p>
      <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
        {data.errors.map((error) => (
          <li
            className="border border-amber-200 bg-white/70 px-3 py-2"
            key={`${error.sourceId}-${error.path}`}
          >
            <span className="block font-semibold">{error.label}</span>
            <span className="mt-1 block text-amber-900">{error.message}</span>
            <span className="mt-1 block break-all font-mono text-xs">
              {error.path}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AnalyticalSummary({ data }: { readonly data: NormalizedDashboardData }) {
  return (
    <section
      aria-label="Analytical summary"
      className="border border-slate-200 bg-white"
    >
      <div className="grid gap-px bg-slate-200 sm:grid-cols-4">
        <SummaryCard
          label="Phenology crops"
          value={String(data.task1.modelEvaluation.length)}
          detail="Task 1 model-evaluation rows available."
        />
        <SummaryCard
          label="Rotation classes"
          value={String(data.task2.classSummaries.length)}
          detail="Regular, monoculture, and irregular source summaries."
        />
        <SummaryCard
          label="Extreme rows"
          value={String(data.task3.anomalySummaries.length)}
          detail="State x crop anomaly rows loaded for Task 3."
        />
        <SummaryCard
          label="Prediction metrics"
          value={data.task4.testMetrics ? "Ready" : "Missing"}
          detail="Held-out Task 4 diagnostics panel status."
        />
      </div>
    </section>
  );
}

function SummaryCard({
  detail,
  label,
  value
}: {
  readonly detail: string;
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="bg-white px-4 py-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}
