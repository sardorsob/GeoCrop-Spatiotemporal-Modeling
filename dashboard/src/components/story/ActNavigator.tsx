import { cn } from "@/lib/utils";

export const STORY_ACTS = [
  { id: "phenology", number: "01", label: "Phenology" },
  { id: "rotation", number: "02", label: "Rotation" },
  { id: "extremes", number: "03", label: "Extremes" },
  { id: "prediction", number: "04", label: "Prediction" }
] as const;

export type StoryActId = (typeof STORY_ACTS)[number]["id"];

export function ActNavigator({
  currentAct,
  className
}: {
  readonly currentAct?: StoryActId;
  readonly className?: string;
}) {
  return (
    <nav aria-label="Research story" className={className}>
      <ol className="flex snap-x gap-2 overflow-x-auto pb-2">
        {STORY_ACTS.map((act) => {
          const isCurrent = act.id === currentAct;

          return (
            <li key={act.id} className="min-w-fit snap-start">
              <a
                href={`#act-${act.id}`}
                aria-current={isCurrent ? "location" : undefined}
                className={cn(
                  "group flex min-h-11 items-center gap-2 border-b px-2 py-2 text-sm transition-colors",
                  isCurrent
                    ? "border-primary text-ink"
                    : "border-transparent text-muted-foreground hover:border-rule hover:text-ink"
                )}
              >
                <span className="font-mono text-[0.62rem] tracking-[0.14em] text-neutral">
                  {act.number}
                </span>
                <span className="font-semibold">{act.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
