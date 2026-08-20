import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import countiesTopo from "us-atlas/counties-albers-10m.json";
import statesTopo from "us-atlas/states-albers-10m.json";

import type { StudyStateCode } from "@/lib/data/types";

interface AtlasProperties {
  readonly name?: string;
}

export interface StudyMapProperties {
  readonly geographyId: string;
  readonly name: string;
  readonly stateCode: StudyStateCode;
}

export type StudyMapFeature = Feature<Geometry, StudyMapProperties>;

const STUDY_STATES = [
  { code: "IL", name: "Illinois", fips: "17" },
  { code: "IN", name: "Indiana", fips: "18" },
  { code: "IA", name: "Iowa", fips: "19" },
  { code: "KS", name: "Kansas", fips: "20" },
  { code: "KY", name: "Kentucky", fips: "21" },
  { code: "MI", name: "Michigan", fips: "26" },
  { code: "MN", name: "Minnesota", fips: "27" },
  { code: "MO", name: "Missouri", fips: "29" },
  { code: "NE", name: "Nebraska", fips: "31" },
  { code: "ND", name: "North Dakota", fips: "38" },
  { code: "OH", name: "Ohio", fips: "39" },
  { code: "SD", name: "South Dakota", fips: "46" },
  { code: "WI", name: "Wisconsin", fips: "55" }
] as const;

const studyStateByFips = new Map<string, (typeof STUDY_STATES)[number]>(
  STUDY_STATES.map((state) => [state.fips, state])
);

const stateFeatures = convertFeatures(statesTopo, statesTopo.objects.states)
  .flatMap((atlasFeature): readonly StudyMapFeature[] => {
    const fips = String(atlasFeature.id ?? "").padStart(2, "0");
    const state = studyStateByFips.get(fips);

    return state
      ? [
          {
            ...atlasFeature,
            properties: {
              geographyId: state.code,
              name: state.name,
              stateCode: state.code
            }
          }
        ]
      : [];
  });

const countyFeatures = convertFeatures(countiesTopo, countiesTopo.objects.counties)
  .flatMap((atlasFeature): readonly StudyMapFeature[] => {
    const geographyId = String(atlasFeature.id ?? "").padStart(5, "0");
    const state = studyStateByFips.get(geographyId.slice(0, 2));

    return state
      ? [
          {
            ...atlasFeature,
            properties: {
              geographyId,
              name: atlasFeature.properties?.name ?? `County ${geographyId}`,
              stateCode: state.code
            }
          }
        ]
      : [];
  });

export const STUDY_VIEW_BOX = createStudyViewBox(stateFeatures);

export function getStudyStateFeatures(): readonly StudyMapFeature[] {
  return stateFeatures;
}

export function getStudyCountyFeatures(): readonly StudyMapFeature[] {
  return countyFeatures;
}

function convertFeatures(
  topology: unknown,
  object: unknown
): readonly Feature<Geometry, AtlasProperties>[] {
  return (
    feature(
      topology as Parameters<typeof feature>[0],
      object as Parameters<typeof feature>[1]
    ) as unknown as FeatureCollection<Geometry, AtlasProperties>
  ).features;
}

function createStudyViewBox(features: readonly StudyMapFeature[]) {
  const collection: FeatureCollection<Geometry, StudyMapProperties> = {
    type: "FeatureCollection",
    features: [...features]
  };
  const [[minX, minY], [maxX, maxY]] = geoPath().bounds(collection);
  const padding = 18;

  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2
  } as const;
}
