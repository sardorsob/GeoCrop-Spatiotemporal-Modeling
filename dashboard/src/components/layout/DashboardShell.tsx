"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Leaf, Repeat, ShieldAlert, Target, CheckCircle2 } from "lucide-react";

import { CompactFilterBar } from "@/components/filters/CompactFilterBar";
import { MapPanel } from "@/components/map/MapPanel";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExtremesPanel } from "@/features/extremes/ExtremesPanel";
import type { CornBeltMapSelectionContext } from "@/features/map/map-selection";
import { PhenologyPanel } from "@/features/phenology/PhenologyPanel";
import { PredictionPanel } from "@/features/prediction/PredictionPanel";
import { RotationPanel } from "@/features/rotation/RotationPanel";
import type { NormalizedDashboardData } from "@/lib/data/normalize";
import type { DashboardFilterState, DashboardTab } from "@/lib/data/types";
import {
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

const TAB_META: Record<DashboardTab, { label: string; status: string; icon: React.ComponentType<{ className?: string }> }> = {
  phenology: { label: "Phenology", status: "Stage timing", icon: Leaf },
  rotation: { label: "Rotation", status: "Crop sequence", icon: Repeat },
  extremes: { label: "Extremes", status: "Stress windows", icon: ShieldAlert },
  prediction: { label: "Prediction", status: "Model diagnostics", icon: Target }
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
  }>({ searchParamString, state: parsedUrlState.state });
  const dashboardState =
    localState.searchParamString === searchParamString ? localState.state : parsedUrlState.state;

  function updateState(nextState: DashboardFilterState) {
    const normalized = normalizeDashboardFilterState(nextState);
    setLocalState({ searchParamString, state: normalized });
    const nextParams = updateDashboardUrlSearchParams(
      new URLSearchParams(searchParamString),
      normalized
    );
    const q = nextParams.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
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
    <div className="min-h-screen text-slate-900">
      <TopBar data={data} />

      <main className="mx-auto flex max-w-[1600px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* HERO */}
        <Hero data={data} />

        {/* FILTERS */}
        <Card asChild>
          <section aria-label="Dashboard filters">
            <CardContent className="py-4">
              <CompactFilterBar
                onChange={updateState}
                onReset={resetState}
                value={dashboardState}
                warnings={parsedUrlState.warnings}
              />
            </CardContent>
          </section>
        </Card>

        {/* MAP — full width */}
        <MapPanel
          activeLayerId={dashboardState.mapLayer}
          onLayerChange={(mapLayer) => patchState({ mapLayer })}
          onSelectionChange={handleMapSelection}
          selectedGeographyId={dashboardState.selectedEntity}
        />

        {/* TASK TABS */}
        <TaskTabs
          activeTab={dashboardState.tab}
          onTabChange={(tab) => patchState({ tab })}
        />

        <section
          aria-label="Active task panel"
          className="mt-1"
          id={`tabpanel-${dashboardState.tab}`}
          role="tabpanel"
        >
          {dashboardState.tab === "phenology" && (
            <PhenologyPanel
              modelEvaluation={data.task1.modelEvaluation}
              onCropChange={(crop) => patchState({ crop })}
              phenologySeries={data.task1.phenologySeries}
              selectedCrop={dashboardState.crop}
            />
          )}
          {dashboardState.tab === "rotation" && (
            <RotationPanel
              classSummaries={data.task2.classSummaries}
              geographySummaries={data.task2.geographySummaries}
              markovTransitions={data.task2.markovTransitions}
              selectedEntity={dashboardState.selectedEntity}
              thresholdSensitivity={data.task2.thresholdSensitivity}
            />
          )}
          {dashboardState.tab === "extremes" && (
            <ExtremesPanel
              anomalySummaries={data.task3.anomalySummaries}
              onCropChange={(crop) => patchState({ crop })}
              onEventChange={(event) => patchState({ event })}
              onStateChange={(s) => patchState({ state: s })}
              selectedCrop={dashboardState.crop}
              selectedEvent={dashboardState.event}
              selectedState={dashboardState.state}
            />
          )}
          {dashboardState.tab === "prediction" && (
            <PredictionPanel
              ablationResults={data.task4.ablationResults}
              regimeMetrics={data.task4.regimeMetrics}
              shapFeatures={data.task4.shapFeatures}
              splitSummaries={data.task4.splitSummaries}
              testMetrics={data.task4.testMetrics}
            />
          )}
        </section>

        <DataLoadStatus data={data} />
      </main>
    </div>
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
      role="tablist"
      className="inline-flex w-full items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
    >
      <div className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4">
        {(Object.entries(TAB_META) as [DashboardTab, typeof TAB_META[DashboardTab]][]).map(([id, meta]) => {
          const Icon = meta.icon;
          const isActive = id === activeTab;
          return (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`tabpanel-${id}`}
              onClick={() => onTabChange(id)}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                isActive
                  ? "bg-emerald-50 text-emerald-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Icon className="size-4" aria-hidden />
              {meta.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Hero({ data }: { readonly data: NormalizedDashboardData }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[2fr_3fr]">
      <h1 className="sr-only">GeoCrop Interactive Dashboard</h1>
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50 opacity-80" aria-hidden />
          <div className="relative px-6 py-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
              GeoCrop · Spatiotemporal Modeling
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              Source-backed crop evidence for the U.S. Corn Belt
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Phenology, rotation, soil-moisture extremes, and prediction
              diagnostics — every chart traces back to an exported task artifact.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Phenology crops"
          value={String(data.task1.modelEvaluation.length)}
          detail="HSGP rows"
          accent="emerald"
        />
        <KpiCard
          label="Rotation classes"
          value={String(data.task2.classSummaries.length)}
          detail="Class summaries"
          accent="violet"
        />
        <KpiCard
          label="Extreme rows"
          value={String(data.task3.anomalySummaries.length)}
          detail="State × crop"
          accent="amber"
        />
        <KpiCard
          label="Prediction"
          value={data.task4.testMetrics ? "Ready" : "Missing"}
          detail="Held-out diagnostics"
          accent={data.task4.testMetrics ? "sky" : "rose"}
        />
      </div>
    </section>
  );
}

const accentClasses = {
  emerald: { bar: "from-emerald-400 to-emerald-600", text: "text-emerald-700" },
  sky: { bar: "from-sky-400 to-sky-600", text: "text-sky-700" },
  amber: { bar: "from-amber-400 to-amber-600", text: "text-amber-700" },
  violet: { bar: "from-violet-400 to-violet-600", text: "text-violet-700" },
  rose: { bar: "from-rose-400 to-rose-600", text: "text-rose-700" }
} as const;

function KpiCard({
  label,
  value,
  detail,
  accent
}: {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly accent: keyof typeof accentClasses;
}) {
  const a = accentClasses[accent];
  return (
    <Card className="relative overflow-hidden">
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar}`} />
      <CardContent className="py-4">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${a.text}`}>{label}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
      </CardContent>
    </Card>
  );
}

function DataLoadStatus({ data }: { readonly data: NormalizedDashboardData }) {
  if (data.errors.length === 0) {
    return (
      <Card asChild className="border-emerald-100 bg-gradient-to-r from-emerald-50/60 to-white">
        <section role="status" aria-label="Data load status">
          <CardContent className="flex items-center gap-3 py-3">
            <CheckCircle2 className="size-5 text-emerald-600" />
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
      <section role="status" aria-label="Data load status">
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              {data.errors.length} source artifact{data.errors.length === 1 ? "" : "s"} reported a load issue
            </p>
            <p className="mt-0.5 text-sm leading-6 text-amber-700">
              Panels remain visible with the loaded data and explicit empty states where needed.
            </p>
            <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              {data.errors.map((error) => (
                <li key={`${error.sourceId}-${error.path}`} className="rounded-lg border border-amber-200 bg-white px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900">{error.label}</span>
                    <Badge variant="amber">Error</Badge>
                  </div>
                  <p className="mt-1 text-xs text-amber-700">{error.message}</p>
                  <p className="mt-1 break-all font-mono text-[10px] text-slate-500">{error.path}</p>
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
