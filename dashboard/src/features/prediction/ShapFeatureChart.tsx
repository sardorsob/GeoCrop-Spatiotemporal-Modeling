import type { ShapFeature } from "@/lib/data/types";

import { formatFeatureLabel, formatShapValue } from "./prediction-copy";

interface ShapFeatureChartProps {
  readonly features: readonly ShapFeature[];
}

const FEATURE_FAMILIES = [
  {
    id: "cdl",
    label: "CDL history",
    description: "Prior crops, transitions, rotation memory, and neighborhood context",
    barClassName: "bg-primary"
  },
  {
    id: "ndvi",
    label: "NDVI phenology",
    description: "Seasonal greenness, timing, shape, and thermal context",
    barClassName: "bg-corn"
  },
  {
    id: "smap",
    label: "SMAP moisture",
    description: "Growing-season and planting-window soil-moisture context",
    barClassName: "bg-wet"
  },
  {
    id: "other",
    label: "Other / context",
    description: "Unrecognized source rows retained without forced relabeling",
    barClassName: "bg-ink-soft"
  }
] as const;

type FeatureFamilyId = (typeof FEATURE_FAMILIES)[number]["id"];

export function ShapFeatureChart({ features }: ShapFeatureChartProps) {
  if (features.length === 0) {
    return (
      <section className="rounded-xl border border-rule bg-paper p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold text-ink">Grouped SHAP importance</h3>
        <p className="mt-2 text-sm text-muted-foreground">No SHAP feature rows are available.</p>
      </section>
    );
  }

  const maxValue = Math.max(...features.map((feature) => feature.meanAbsoluteShap), 0);
  const grouped = FEATURE_FAMILIES.map((family) => ({
    ...family,
    features: features
      .filter((feature) => getFeatureFamily(feature.feature) === family.id)
      .sort((left, right) => right.meanAbsoluteShap - left.meanAbsoluteShap)
  })).filter((family) => family.features.length > 0);
  const source = features[0]?.source;

  return (
    <section
      aria-label="Grouped SHAP feature importance"
      className="min-w-0 rounded-xl border border-rule bg-paper p-4 sm:p-5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            What the model leans on
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">
            Grouped SHAP importance
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Mean absolute SHAP magnitude; direction and causality are not encoded.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-rule bg-muted/45 px-3 py-1 text-xs text-muted-foreground">
          {features.length} source rows · none hidden
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {grouped.map((family) => (
          <article className="rounded-lg border border-rule bg-muted/25 p-4" key={family.id}>
            <h4 className="font-semibold text-ink">{family.label}</h4>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{family.description}</p>
            <ul className="mt-3 space-y-3">
              {family.features.map((feature) => {
                const width = maxValue > 0
                  ? Math.max(0, Math.min(100, (feature.meanAbsoluteShap / maxValue) * 100))
                  : 0;
                return (
                  <li key={feature.feature}>
                    <div className="flex items-baseline justify-between gap-3 text-xs">
                      <span className="font-medium text-ink">{formatFeatureLabel(feature.feature)}</span>
                      <span className="font-mono font-semibold tabular-nums text-ink">
                        {formatShapValue(feature.meanAbsoluteShap)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-rule/60" aria-hidden="true">
                      <span className={`block h-full rounded-full ${family.barClassName}`} style={{ width: `${width}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      {source ? (
        <div className="mt-4 border-t border-rule pt-3 text-xs leading-5 text-muted-foreground">
          <p className="font-semibold text-ink">{source.label ?? source.sourceId}</p>
          {source.path ? <p className="mt-1 break-all font-mono">{source.path}</p> : null}
          <p className="mt-1">{source.caveat ?? "Mean absolute SHAP values summarize the scoped model."}</p>
        </div>
      ) : null}
    </section>
  );
}

function getFeatureFamily(feature: string): FeatureFamilyId {
  const normalized = feature.trim().toLowerCase();

  if (
    normalized.startsWith("cdl_") ||
    normalized.includes("previous_crop") ||
    normalized.startsWith("rotation_") ||
    normalized.startsWith("time_since_") ||
    normalized.startsWith("neigh_") ||
    normalized.startsWith("sequence_") ||
    normalized.startsWith("pattern_") ||
    normalized.startsWith("frac_years_") ||
    normalized.startsWith("n_corn_") ||
    normalized.startsWith("n_soy_") ||
    normalized.includes("alternation") ||
    normalized.includes("entropy") ||
    normalized.includes("edit_distance") ||
    normalized.includes("max_run")
  ) {
    return "cdl";
  }

  if (
    normalized.startsWith("ndvi_") ||
    normalized.includes("thermal") ||
    normalized.includes("greenup") ||
    normalized.includes("green_up")
  ) {
    return "ndvi";
  }

  if (
    normalized.startsWith("smap_") ||
    normalized.includes("soil_moisture") ||
    normalized.includes("moisture")
  ) {
    return "smap";
  }

  return "other";
}
