import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FigureFrameProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly children: ReactNode;
  readonly caption?: ReactNode;
  readonly controls?: ReactNode;
  readonly className?: string;
}

export function FigureFrame({
  eyebrow,
  title,
  children,
  caption,
  controls,
  className
}: FigureFrameProps) {
  const titleId = useId();

  return (
    <figure
      aria-labelledby={titleId}
      className={cn(
        "overflow-hidden rounded-[1.35rem] border border-rule/80 bg-paper shadow-[0_18px_60px_-45px_rgba(23,34,28,0.55)]",
        className
      )}
    >
      <header className="flex flex-col gap-4 border-b border-rule/70 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h3 id={titleId} className="mt-1 text-pretty font-display text-2xl font-semibold text-ink">
            {title}
          </h3>
        </div>
        {controls ? <div className="shrink-0">{controls}</div> : null}
      </header>
      <div className="min-w-0 px-3 py-4 sm:px-6 sm:py-6">{children}</div>
      {caption ? <div className="px-4 pb-4 sm:px-6 sm:pb-6">{caption}</div> : null}
    </figure>
  );
}
