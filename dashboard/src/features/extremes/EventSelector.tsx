import type { ExtremeEventId } from "@/lib/data/types";
import { EXTREME_EVENT_OPTIONS } from "@/lib/state/dashboard-state";

import { EXTREME_EVENT_DETAILS } from "./extremes-copy";

export interface EventSelectorProps {
  readonly selectedEvent: ExtremeEventId;
  readonly onEventChange?: (eventId: ExtremeEventId) => void;
}

export function EventSelector({
  onEventChange,
  selectedEvent
}: EventSelectorProps) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-semibold text-slate-700">Event</legend>
      <div className="grid gap-px bg-slate-200 sm:grid-cols-2" role="group">
        {EXTREME_EVENT_OPTIONS.map((option) => {
          const isSelected = option.id === selectedEvent;
          const details = EXTREME_EVENT_DETAILS[option.id];

          return (
            <button
              aria-current={isSelected ? "true" : undefined}
              aria-label={option.label}
              aria-pressed={isSelected}
              className={[
                "bg-white px-3 py-3 text-left text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2",
                isSelected
                  ? "border-l-4 border-emerald-600 text-slate-950"
                  : "border-l-4 border-transparent text-slate-700"
              ].join(" ")}
              key={option.id}
              onClick={() => onEventChange?.(option.id)}
              type="button"
            >
              <span className="block font-semibold">{option.label}</span>
              <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                {details.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
