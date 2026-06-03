import type {
  ArtifactSourceId,
  GeographyKind,
  MapLayerId,
  MapSelection
} from "@/lib/data/types";

import { getCornBeltMapLayer, type CornBeltMapLayer } from "./map-layers";

export interface CornBeltFallbackGeography {
  readonly id: string;
  readonly label: string;
  readonly geographyKind: GeographyKind;
  readonly stateCode: string;
  readonly gridColumn: number;
  readonly gridRow: number;
  readonly gridColumnSpan?: number;
  readonly gridRowSpan?: number;
  readonly values: Readonly<Record<MapLayerId, string>>;
  readonly legendItemIds: Readonly<Record<MapLayerId, string>>;
}

export interface CornBeltMapSelectionContext {
  readonly layerId: MapLayerId;
  readonly selection: MapSelection;
  readonly displayValue: string;
  readonly sourceIds: readonly ArtifactSourceId[];
  readonly sourceLabel: string;
  readonly caveat: string;
}

export const CORN_BELT_FALLBACK_GEOGRAPHIES = [
  defineGeography({
    id: "state:MN",
    label: "Minnesota",
    stateCode: "MN",
    gridColumn: 3,
    gridRow: 1,
    values: {
      "rotation-class": "Regular",
      "rotation-regular-probability": "High regular share",
      "soil-moisture-anomaly": "Mixed anomaly signal",
      "crop-prediction": "Corn",
      "prediction-agreement": "Agreement"
    },
    legendItemIds: {
      "rotation-class": "regular",
      "rotation-regular-probability": "high",
      "soil-moisture-anomaly": "mixed",
      "crop-prediction": "corn",
      "prediction-agreement": "agreement"
    }
  }),
  defineGeography({
    id: "state:SD",
    label: "South Dakota",
    stateCode: "SD",
    gridColumn: 2,
    gridRow: 2,
    values: {
      "rotation-class": "Irregular",
      "rotation-regular-probability": "Low regular share",
      "soil-moisture-anomaly": "Drought anomaly watch",
      "crop-prediction": "Other cropland",
      "prediction-agreement": "Review"
    },
    legendItemIds: {
      "rotation-class": "irregular",
      "rotation-regular-probability": "low",
      "soil-moisture-anomaly": "drought",
      "crop-prediction": "other",
      "prediction-agreement": "review"
    }
  }),
  defineGeography({
    id: "state:WI",
    label: "Wisconsin",
    stateCode: "WI",
    gridColumn: 4,
    gridRow: 2,
    values: {
      "rotation-class": "Regular",
      "rotation-regular-probability": "Moderate regular share",
      "soil-moisture-anomaly": "Lower anomaly signal",
      "crop-prediction": "Corn",
      "prediction-agreement": "Agreement"
    },
    legendItemIds: {
      "rotation-class": "regular",
      "rotation-regular-probability": "moderate",
      "soil-moisture-anomaly": "stable",
      "crop-prediction": "corn",
      "prediction-agreement": "agreement"
    }
  }),
  defineGeography({
    id: "state:IA",
    label: "Iowa",
    stateCode: "IA",
    gridColumn: 3,
    gridRow: 3,
    values: {
      "rotation-class": "Regular",
      "rotation-regular-probability": "High regular share",
      "soil-moisture-anomaly": "Flood anomaly watch",
      "crop-prediction": "Corn",
      "prediction-agreement": "Agreement"
    },
    legendItemIds: {
      "rotation-class": "regular",
      "rotation-regular-probability": "high",
      "soil-moisture-anomaly": "flood",
      "crop-prediction": "corn",
      "prediction-agreement": "agreement"
    }
  }),
  defineGeography({
    id: "state:IL",
    label: "Illinois",
    stateCode: "IL",
    gridColumn: 4,
    gridRow: 3,
    values: {
      "rotation-class": "Monoculture",
      "rotation-regular-probability": "Moderate regular share",
      "soil-moisture-anomaly": "Flood anomaly watch",
      "crop-prediction": "Soybean",
      "prediction-agreement": "Review"
    },
    legendItemIds: {
      "rotation-class": "monoculture",
      "rotation-regular-probability": "moderate",
      "soil-moisture-anomaly": "flood",
      "crop-prediction": "soybean",
      "prediction-agreement": "review"
    }
  }),
  defineGeography({
    id: "state:IN",
    label: "Indiana",
    stateCode: "IN",
    gridColumn: 5,
    gridRow: 3,
    values: {
      "rotation-class": "Monoculture",
      "rotation-regular-probability": "Moderate regular share",
      "soil-moisture-anomaly": "Lower anomaly signal",
      "crop-prediction": "Soybean",
      "prediction-agreement": "Agreement"
    },
    legendItemIds: {
      "rotation-class": "monoculture",
      "rotation-regular-probability": "moderate",
      "soil-moisture-anomaly": "stable",
      "crop-prediction": "soybean",
      "prediction-agreement": "agreement"
    }
  }),
  defineGeography({
    id: "state:NE",
    label: "Nebraska",
    stateCode: "NE",
    gridColumn: 2,
    gridRow: 4,
    values: {
      "rotation-class": "Irregular",
      "rotation-regular-probability": "Low regular share",
      "soil-moisture-anomaly": "Drought anomaly watch",
      "crop-prediction": "Corn",
      "prediction-agreement": "Review"
    },
    legendItemIds: {
      "rotation-class": "irregular",
      "rotation-regular-probability": "low",
      "soil-moisture-anomaly": "drought",
      "crop-prediction": "corn",
      "prediction-agreement": "review"
    }
  }),
  defineGeography({
    id: "state:MO",
    label: "Missouri",
    stateCode: "MO",
    gridColumn: 3,
    gridRow: 4,
    values: {
      "rotation-class": "Irregular",
      "rotation-regular-probability": "Low regular share",
      "soil-moisture-anomaly": "Mixed anomaly signal",
      "crop-prediction": "Soybean",
      "prediction-agreement": "Disagreement risk"
    },
    legendItemIds: {
      "rotation-class": "irregular",
      "rotation-regular-probability": "low",
      "soil-moisture-anomaly": "mixed",
      "crop-prediction": "soybean",
      "prediction-agreement": "disagreement"
    }
  }),
  defineGeography({
    id: "state:OH",
    label: "Ohio",
    stateCode: "OH",
    gridColumn: 6,
    gridRow: 3,
    values: {
      "rotation-class": "Monoculture",
      "rotation-regular-probability": "Moderate regular share",
      "soil-moisture-anomaly": "Lower anomaly signal",
      "crop-prediction": "Winter wheat",
      "prediction-agreement": "Agreement"
    },
    legendItemIds: {
      "rotation-class": "monoculture",
      "rotation-regular-probability": "moderate",
      "soil-moisture-anomaly": "stable",
      "crop-prediction": "winter-wheat",
      "prediction-agreement": "agreement"
    }
  }),
  defineGeography({
    id: "state:KS",
    label: "Kansas",
    stateCode: "KS",
    gridColumn: 2,
    gridRow: 5,
    values: {
      "rotation-class": "Irregular",
      "rotation-regular-probability": "Low regular share",
      "soil-moisture-anomaly": "Drought anomaly watch",
      "crop-prediction": "Winter wheat",
      "prediction-agreement": "Review"
    },
    legendItemIds: {
      "rotation-class": "irregular",
      "rotation-regular-probability": "low",
      "soil-moisture-anomaly": "drought",
      "crop-prediction": "winter-wheat",
      "prediction-agreement": "review"
    }
  })
] as const satisfies readonly CornBeltFallbackGeography[];

export function createCornBeltMapSelectionContext(
  geography: CornBeltFallbackGeography,
  layerOrId: CornBeltMapLayer | MapLayerId
): CornBeltMapSelectionContext {
  const layer =
    typeof layerOrId === "string" ? getCornBeltMapLayer(layerOrId) : layerOrId;
  const primarySource = layer.sourceNotes[0];

  return {
    layerId: layer.id,
    selection: {
      geographyKind: geography.geographyKind,
      id: geography.id,
      label: geography.label,
      sourceId: primarySource.sourceId
    },
    displayValue: geography.values[layer.id],
    sourceIds: layer.sourceIds,
    sourceLabel: primarySource.label,
    caveat: primarySource.caveat
  };
}

function defineGeography(
  geography: Omit<CornBeltFallbackGeography, "geographyKind">
): CornBeltFallbackGeography {
  return {
    ...geography,
    geographyKind: "state"
  };
}
