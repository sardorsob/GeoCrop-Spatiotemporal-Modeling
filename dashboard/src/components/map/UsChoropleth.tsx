"use client";

import { useMemo } from "react";
import { geoPath } from "d3-geo";

import type { MapEvidenceValue } from "@/lib/data/selectors";
import { cn } from "@/lib/utils";

import {
  STUDY_VIEW_BOX,
  getStudyCountyFeatures,
  getStudyStateFeatures
} from "./map-geometry";

export interface UsChoroplethProps {
  readonly values: readonly MapEvidenceValue[];
  readonly geographyKind: "state" | "county";
  readonly colorScale: (value: number | undefined) => string;
  readonly selectedId?: string;
  readonly previewId?: string;
  readonly onPreview?: (geographyId: string, geographyName: string) => void;
  readonly onPreviewEnd?: () => void;
  readonly onPin?: (geographyId: string, geographyName: string) => void;
  readonly formatValue: (value: number) => string;
  readonly className?: string;
}

export function UsChoropleth({
  values,
  geographyKind,
  colorScale,
  selectedId,
  previewId,
  onPreview,
  onPreviewEnd,
  onPin,
  formatValue,
  className
}: UsChoroplethProps) {
  const path = useMemo(() => geoPath(), []);
  const features =
    geographyKind === "state" ? getStudyStateFeatures() : getStudyCountyFeatures();
  const valuesById = useMemo(
    () => new Map(values.map((value) => [value.geographyId, value])),
    [values]
  );

  return (
    <div className={cn("relative min-w-0 overflow-hidden rounded-2xl bg-field/45", className)}>
      <svg
        aria-label={`Corn Belt ${geographyKind} choropleth`}
        className="block h-auto min-h-72 w-full"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        viewBox={`${STUDY_VIEW_BOX.x} ${STUDY_VIEW_BOX.y} ${STUDY_VIEW_BOX.width} ${STUDY_VIEW_BOX.height}`}
      >
        {features.map((mapFeature) => {
          const { geographyId, name } = mapFeature.properties;
          const evidence = valuesById.get(geographyId);
          const isSelected = selectedId === geographyId;
          const isPreviewed = previewId === geographyId;
          const isInteractive = geographyKind === "state" || evidence !== undefined;
          const featureName = evidence?.geographyName ?? name;

          return (
            <path
              aria-label={isInteractive ? `Select ${featureName}` : undefined}
              d={path(mapFeature) ?? ""}
              data-geography-id={geographyId}
              fill={colorScale(evidence?.value)}
              key={geographyId}
              onBlur={onPreviewEnd}
              onClick={() => isInteractive && onPin?.(geographyId, featureName)}
              onFocus={() => isInteractive && onPreview?.(geographyId, featureName)}
              onKeyDown={(event) => {
                if (isInteractive && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  onPin?.(geographyId, featureName);
                }
              }}
              onMouseEnter={() => isInteractive && onPreview?.(geographyId, featureName)}
              onMouseLeave={onPreviewEnd}
              role={isInteractive ? "button" : undefined}
              stroke={isSelected || isPreviewed ? "#d97722" : "#fffdf7"}
              strokeWidth={isSelected ? 3 : isPreviewed ? 2.2 : geographyKind === "state" ? 1.2 : 0.35}
              tabIndex={isInteractive && (geographyKind === "state" || evidence) ? 0 : undefined}
            >
              {evidence ? <title>{`${featureName}: ${formatValue(evidence.value)}`}</title> : null}
            </path>
          );
        })}

        {geographyKind === "state"
          ? features.map((mapFeature) => {
              const centroid = path.centroid(mapFeature);
              const { geographyId, stateCode } = mapFeature.properties;

              return (
                <text
                  aria-hidden="true"
                  className="pointer-events-none fill-ink font-sans text-[11px] font-bold"
                  key={`label-${geographyId}`}
                  paintOrder="stroke"
                  stroke="#fffdf7"
                  strokeWidth={2.5}
                  textAnchor="middle"
                  x={centroid[0]}
                  y={centroid[1]}
                >
                  {stateCode}
                </text>
              );
            })
          : null}
      </svg>
    </div>
  );
}
