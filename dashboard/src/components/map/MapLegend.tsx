import type { CornBeltMapLayer } from "@/features/map/map-layers";

export interface MapLegendProps {
  readonly layer: CornBeltMapLayer;
  readonly className?: string;
}

export function MapLegend({ layer, className }: MapLegendProps) {
  return (
    <aside
      aria-label={`${layer.label} sources and caveats`}
      className={["border border-slate-200 bg-white p-3", className ?? ""].join(
        " "
      )}
    >
      <div>
        <h3 className="text-sm font-semibold text-slate-950">Legend</h3>
        <ul
          aria-label={`${layer.label} legend`}
          className="mt-3 grid gap-2"
        >
          {layer.legend.map((item) => (
            <li className="flex items-center gap-2 text-sm" key={item.id}>
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 border border-slate-300"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-800">{item.label}</span>
              {item.value === undefined ? null : (
                <span className="text-slate-600">{item.value}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-3">
        <h3 className="text-sm font-semibold text-slate-950">Sources</h3>
        <ul className="mt-2 grid gap-2 text-sm text-slate-700">
          {layer.sourceNotes.map((source) => (
            <li className="border-l-4 border-slate-300 pl-3" key={source.sourceId}>
              <p className="font-medium text-slate-950">{source.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {source.statusText}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {source.path}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {source.caveat}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-3">
        <h3 className="text-sm font-semibold text-slate-950">Caveat</h3>
        <p className="mt-1 text-sm leading-6 text-slate-700">{layer.caveat}</p>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          {layer.fallbackReason}
        </p>
      </div>
    </aside>
  );
}
