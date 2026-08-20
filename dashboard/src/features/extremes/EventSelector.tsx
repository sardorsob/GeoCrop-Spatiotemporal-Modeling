import { EXTREME_EVENT_OPTIONS } from "@/lib/state/dashboard-state";

import { EXTREME_EVENT_DETAILS } from "./extremes-copy";

export function EventSelector() {
  return (
    <aside aria-label="Compared extreme events" className="grid gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Matched event frames
      </p>
      <div className="grid grid-cols-2 gap-2">
        {EXTREME_EVENT_OPTIONS.map((option, index) => {
          const details = EXTREME_EVENT_DETAILS[option.id];

          return (
            <div
              className="rounded-lg border border-rule bg-muted/40 px-3 py-3"
              key={option.id}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                {index === 0 ? "Frame A" : "Frame B"}
              </span>
              <span className="mt-1 block text-sm font-semibold text-ink">
                {option.label}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {details.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
