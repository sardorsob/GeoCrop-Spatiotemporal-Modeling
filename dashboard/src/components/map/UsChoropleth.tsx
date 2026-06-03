"use client";

import { useMemo, useState } from "react";
import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import statesTopo from "us-atlas/states-albers-10m.json";
import type { Feature, FeatureCollection, Geometry } from "geojson";

import { cn } from "@/lib/utils";

interface StateGeoProps {
  readonly name: string;
}

interface UsChoroplethProps {
  readonly values: Readonly<Record<string, number | undefined>>;
  readonly stateCodeByName?: Readonly<Record<string, string>>;
  readonly colorScale: (value: number | undefined) => string;
  readonly selectedState?: string;
  readonly onSelect?: (stateCode: string, stateName: string) => void;
  readonly format?: (value: number) => string;
  readonly className?: string;
}

const WIDTH = 975;
const HEIGHT = 610;

const STATE_NAME_TO_CODE: Readonly<Record<string, string>> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI",
  Wyoming: "WY"
};

export function UsChoropleth({
  values,
  stateCodeByName = STATE_NAME_TO_CODE,
  colorScale,
  selectedState,
  onSelect,
  format = (v) => v.toFixed(2),
  className
}: UsChoroplethProps) {
  const [hovered, setHovered] = useState<{ name: string; code: string; value?: number; x: number; y: number } | null>(null);

  const features = useMemo(() => {
    const collection = feature(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      statesTopo as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (statesTopo as any).objects.states
    ) as unknown as FeatureCollection<Geometry, StateGeoProps>;
    return collection.features;
  }, []);

  const pathGen = useMemo(() => geoPath(), []);

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white", className)}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" aria-label="US states choropleth map">
        <defs>
          <filter id="state-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>
        <g>
          {features.map((f) => {
            const name = f.properties?.name ?? "";
            const code = stateCodeByName[name] ?? "";
            const value = code ? values[code] : undefined;
            const fill = colorScale(value);
            const isSelected = selectedState === code;
            const isHovered = hovered?.code === code;
            const d = pathGen(f as Feature<Geometry, StateGeoProps>) ?? "";

            return (
              <path
                key={(f.id as string) ?? name}
                d={d}
                fill={fill}
                stroke={isSelected ? "#0f172a" : "#ffffff"}
                strokeWidth={isSelected ? 2 : 1}
                role={code ? "button" : undefined}
                aria-label={code ? `Select ${name}` : undefined}
                tabIndex={code ? 0 : undefined}
                style={{
                  cursor: code ? "pointer" : "default",
                  transition: "filter 0.15s ease, stroke 0.15s ease",
                  filter: isSelected || isHovered ? "url(#state-shadow)" : undefined,
                  opacity: hovered && !isHovered && !isSelected ? 0.85 : 1,
                  outline: "none"
                }}
                onClick={() => code && onSelect?.(code, name)}
                onKeyDown={(e) => {
                  if (code && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelect?.(code, name);
                  }
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (!rect) return;
                  setHovered({ name, code, value, x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </g>
        {features.map((f) => {
          const name = f.properties?.name ?? "";
          const code = stateCodeByName[name] ?? "";
          if (!code) return null;
          const centroid = pathGen.centroid(f as Feature<Geometry, StateGeoProps>);
          if (!centroid || Number.isNaN(centroid[0])) return null;
          const isSelected = selectedState === code;
          return (
            <text
              key={`label-${code}`}
              x={centroid[0]}
              y={centroid[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              className={cn(
                "pointer-events-none select-none font-semibold",
                isSelected ? "fill-slate-950" : "fill-slate-700"
              )}
              style={{ fontSize: 11, paintOrder: "stroke", stroke: "#ffffff", strokeWidth: 2.5, strokeLinejoin: "round" }}
            >
              {code}
            </text>
          );
        })}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: hovered.x + 12, top: hovered.y + 12 }}
        >
          <p className="font-semibold text-slate-900">{hovered.name}</p>
          <p className="mt-0.5 text-slate-500">
            {hovered.value !== undefined ? format(hovered.value) : "No data"}
          </p>
        </div>
      )}
    </div>
  );
}
