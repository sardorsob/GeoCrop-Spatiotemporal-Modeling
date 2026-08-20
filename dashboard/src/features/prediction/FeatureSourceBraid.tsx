const SOURCES = [
  {
    name: "CDL history",
    detail: "30 m · 19 features",
    role: "Five lag years, transitions, rotation memory, and neighborhood context",
    tone: "border-primary bg-primary/5"
  },
  {
    name: "NDVI phenology",
    detail: "250 m · 15 features",
    role: "Seasonal shape, timing, amplitude, and interannual stability",
    tone: "border-corn bg-corn/5"
  },
  {
    name: "SMAP moisture",
    detail: "9 km · 4 features",
    role: "Growing-season and planting-window moisture context",
    tone: "border-wet bg-wet/5"
  }
] as const;

export function FeatureSourceBraid() {
  return (
    <section
      aria-label="Feature sources feeding LightGBM"
      className="min-w-0 rounded-xl border border-rule bg-paper p-4 sm:p-5"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Evidence braid
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold text-ink">
          Three measurement systems, one classifier
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Native scales stay visible because the model&apos;s inputs are complementary, not interchangeable.
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_2.5rem_minmax(12rem,0.8fr)] lg:items-stretch">
        {SOURCES.map((source) => (
          <article className={`rounded-lg border-t-4 p-3 ${source.tone}`} key={source.name}>
            <h4 className="font-semibold text-ink">{source.name}</h4>
            <p className="mt-1 font-mono text-xs font-semibold tabular-nums text-ink">
              {source.detail}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{source.role}</p>
          </article>
        ))}

        <div className="hidden items-center justify-center text-2xl text-primary lg:flex" aria-hidden="true">
          →
        </div>
        <article className="rounded-lg border border-ink bg-ink p-4 text-paper">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/65">
            Gradient-boosted trees
          </p>
          <h4 className="mt-1 font-display text-xl font-semibold">LightGBM</h4>
          <p className="mt-2 font-mono text-xs font-semibold tabular-nums">
            38 features · 4 crop classes
          </p>
          <p className="mt-2 text-xs leading-5 text-paper/70">
            500 estimators · 2023 temporal holdout
          </p>
        </article>
      </div>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Native resolution: CDL 30 m · NDVI 250 m · SMAP 9 km. Inputs were aligned to the common ~557 m analysis grid.
      </p>
    </section>
  );
}
