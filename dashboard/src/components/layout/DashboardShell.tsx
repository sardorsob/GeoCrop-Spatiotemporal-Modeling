const researchTasks = [
  {
    name: "Phenology",
    status: "Stage timing",
    metric: "NDVI phase alignment",
    selected: true
  },
  {
    name: "Rotation",
    status: "Crop sequence",
    metric: "Field transition matrix",
    selected: false
  },
  {
    name: "Extremes",
    status: "Stress windows",
    metric: "Heat and rainfall flags",
    selected: false
  },
  {
    name: "Prediction",
    status: "Yield signal",
    metric: "Forecast readiness",
    selected: false
  }
];

const layerControls = [
  "County boundaries",
  "Crop mask",
  "Phenology index",
  "Weather anomalies"
];

const stateFilters = ["Iowa", "Illinois", "Minnesota", "Nebraska"];

export function DashboardShell() {
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
              Spatiotemporal crop evidence workspace for field-scale context,
              state filters, map layers, and model-readiness review.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm sm:min-w-96">
            <div className="border-l-4 border-emerald-600 bg-emerald-50 px-3 py-2">
              <p className="text-xs font-medium text-emerald-800">Season</p>
              <p className="font-semibold text-slate-950">2025 baseline</p>
            </div>
            <div className="border-l-4 border-sky-600 bg-sky-50 px-3 py-2">
              <p className="text-xs font-medium text-sky-800">Resolution</p>
              <p className="font-semibold text-slate-950">County grid</p>
            </div>
            <div className="border-l-4 border-amber-500 bg-amber-50 px-3 py-2">
              <p className="text-xs font-medium text-amber-800">Mode</p>
              <p className="font-semibold text-slate-950">Exploratory</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Research tasks"
          className="border-b border-slate-200 bg-white"
        >
          <div
            aria-label="Research tasks"
            className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4"
            role="tablist"
          >
            {researchTasks.map((task) => (
              <button
                aria-label={task.name}
                aria-selected={task.selected}
                className={[
                  "min-h-24 bg-white px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2",
                  task.selected ? "border-t-4 border-emerald-600" : "border-t-4 border-transparent"
                ].join(" ")}
                key={task.name}
                role="tab"
                type="button"
              >
                <span className="block text-base font-semibold text-slate-950">
                  {task.name}
                </span>
                <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  {task.status}
                </span>
                <span className="mt-2 block text-sm leading-5 text-slate-600">
                  {task.metric}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section
            aria-label="Main evidence"
            className="min-h-[32rem] border border-slate-200 bg-white"
          >
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Evidence map
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Placeholder for geospatial layers, crop signals, and selected
                  state context.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {stateFilters.map((state) => (
                  <span
                    className="border border-slate-300 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
                    key={state}
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid min-h-[24rem] grid-cols-1 bg-[linear-gradient(90deg,#e2e8f0_1px,transparent_1px),linear-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] p-4">
              <div className="grid h-full min-h-80 grid-cols-6 grid-rows-5 gap-2">
                <div className="col-span-4 row-span-3 border border-emerald-700 bg-emerald-100/80 p-3 text-sm font-semibold text-emerald-950">
                  Corn belt phenology signal
                </div>
                <div className="col-span-2 row-span-2 border border-sky-700 bg-sky-100/80 p-3 text-sm font-semibold text-sky-950">
                  Rainfall anomaly window
                </div>
                <div className="col-span-2 row-span-2 border border-amber-600 bg-amber-100/80 p-3 text-sm font-semibold text-amber-950">
                  Heat stress watch
                </div>
                <div className="col-span-3 row-span-2 border border-slate-500 bg-slate-100/90 p-3 text-sm font-semibold text-slate-800">
                  Rotation reference area
                </div>
                <div className="col-span-1 row-span-3 border border-rose-600 bg-rose-100/80 p-3 text-sm font-semibold text-rose-950">
                  Outlier
                </div>
              </div>
            </div>
          </section>

          <aside
            aria-label="Selected context"
            className="border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-200 px-4 py-4">
              <h2 className="text-lg font-semibold text-slate-950">
                Selected context
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Current task, region, filters, and layer stack.
              </p>
            </div>
            <div className="space-y-5 px-4 py-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Active task
                </h3>
                <p className="mt-2 text-xl font-semibold text-slate-950">
                  Phenology
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Compare crop-stage timing against weather-driven deviations
                  before handing evidence to downstream models.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Map layers
                </h3>
                <div className="mt-3 space-y-2">
                  {layerControls.map((layer) => (
                    <label
                      className="flex items-center justify-between gap-3 border border-slate-200 px-3 py-2 text-sm text-slate-700"
                      key={layer}
                    >
                      <span>{layer}</span>
                      <input
                        className="h-4 w-4 accent-emerald-700"
                        defaultChecked
                        type="checkbox"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  State filter
                </h3>
                <select
                  aria-label="State filter"
                  className="mt-3 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                  defaultValue="Iowa"
                >
                  {stateFilters.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>
        </div>

        <section
          aria-label="Analytical summary"
          className="border border-slate-200 bg-white"
        >
          <div className="grid gap-px bg-slate-200 sm:grid-cols-3">
            <div className="bg-white px-4 py-4">
              <h2 className="text-base font-semibold text-slate-950">
                Analytical summary
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Initial shell only. Data-backed evidence, charts, and linked
                model diagnostics can mount into this section as tasks land.
              </p>
            </div>
            <div className="bg-white px-4 py-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Priority review
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">12</p>
              <p className="mt-1 text-sm text-slate-600">
                Counties queued for phenology variance checks.
              </p>
            </div>
            <div className="bg-white px-4 py-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Model handoff
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">Ready</p>
              <p className="mt-1 text-sm text-slate-600">
                Shell exposes slots for filters, layer state, and summaries.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
