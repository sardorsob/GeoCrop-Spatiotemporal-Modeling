import { cn } from "@/lib/utils";

export interface ActHeaderProps {
  readonly act: 1 | 2 | 3 | 4;
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly id?: string;
  readonly className?: string;
}

export function ActHeader({
  act,
  eyebrow,
  title,
  summary,
  id,
  className
}: ActHeaderProps) {
  return (
    <header className={cn("max-w-3xl text-ink", className)}>
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">
        <span>Act {String(act).padStart(2, "0")} / 04</span>
        <span aria-hidden="true" className="h-px w-10 bg-rule" />
        <span>{eyebrow}</span>
      </div>
      <h2
        id={id}
        className="max-w-[22ch] text-balance font-display text-4xl font-semibold leading-[1.04] tracking-[-0.025em] sm:text-5xl"
      >
        {title}
      </h2>
      <p className="mt-5 max-w-[62ch] text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
        {summary}
      </p>
    </header>
  );
}
