import type { ReactNode } from "react";

export interface EvidenceCaptionProps {
  readonly source: ReactNode;
  readonly denominator?: ReactNode;
  readonly caveat?: ReactNode;
}

export function EvidenceCaption({
  source,
  denominator,
  caveat
}: EvidenceCaptionProps) {
  return (
    <figcaption className="grid gap-2 border-t border-rule/80 pt-4 text-xs leading-5 text-muted-foreground sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <p>
        <span className="font-bold uppercase tracking-[0.12em] text-ink">Source</span>{" "}
        {source}
      </p>
      <div className="space-y-1 sm:text-right">
        {denominator ? (
          <p>
            <span className="font-semibold text-ink">Denominator:</span> {denominator}
          </p>
        ) : null}
        {caveat ? <p>{caveat}</p> : null}
      </div>
    </figcaption>
  );
}
