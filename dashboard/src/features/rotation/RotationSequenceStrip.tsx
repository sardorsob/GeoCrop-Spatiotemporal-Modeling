import { Card } from "@/components/ui/card";
import type { RotationClassId } from "@/lib/data/types";

import {
  cropLabels,
  rotationClassDescriptions,
  rotationClassLabels,
  ROTATION_COPY
} from "./rotation-copy";

type SequenceCrop = "corn" | "soybean" | "winter_wheat" | "oats";

const SEQUENCES = {
  regular: ["corn", "soybean", "corn", "soybean", "corn", "soybean", "corn", "soybean", "corn", "soybean"],
  monoculture: ["corn", "corn", "corn", "corn", "corn", "corn", "corn", "corn", "corn", "corn"],
  irregular: ["corn", "soybean", "soybean", "corn", "oats", "soybean", "corn", "corn", "winter_wheat", "soybean"]
} as const satisfies Readonly<Record<RotationClassId, readonly SequenceCrop[]>>;

const CROP_STYLE = {
  corn: { code: "C", className: "border-corn/50 bg-corn/20 text-ink" },
  soybean: { code: "S", className: "border-soybean/50 bg-soybean/15 text-ink" },
  winter_wheat: { code: "W", className: "border-wheat/50 bg-wheat/15 text-ink" },
  oats: { code: "O", className: "border-rule bg-muted text-muted-foreground" }
} as const;

export function RotationSequenceStrip() {
  return (
    <Card asChild>
      <section aria-label={ROTATION_COPY.sequenceRegionLabel} className="px-4 py-5 sm:px-5">
        <div className="max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            01 · The rule
          </p>
          <h3 className="mt-1 font-serif text-xl font-semibold text-ink">Ten years become a pattern</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            These strips teach the class definitions. They are deliberately schematic and are not sampled or reconstructed fields.
          </p>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {(Object.keys(SEQUENCES) as RotationClassId[]).map((rotationClass) => (
            <SequenceExample key={rotationClass} rotationClass={rotationClass} />
          ))}
        </div>

        <ul aria-label="Sequence crop key" className="mt-4 flex list-none flex-wrap gap-3 text-xs text-muted-foreground">
          {(Object.keys(CROP_STYLE) as SequenceCrop[]).map((crop) => (
            <li className="inline-flex items-center gap-1.5" key={crop}>
              <span className={`inline-flex size-6 items-center justify-center rounded border font-mono font-bold ${CROP_STYLE[crop].className}`}>
                {CROP_STYLE[crop].code}
              </span>
              {cropLabels[crop]}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function SequenceExample({ rotationClass }: { readonly rotationClass: RotationClassId }) {
  return (
    <article className="min-w-0 rounded-lg border border-rule bg-muted/35 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-semibold text-ink">{rotationClassLabels[rotationClass]}</h4>
        <span className="rounded-full border border-rule bg-paper px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          Schematic example · not an observed field
        </span>
      </div>
      <ol
        aria-label={`${rotationClassLabels[rotationClass]} decade sequence`}
        className="mt-3 grid list-none grid-cols-5 gap-1.5 sm:grid-cols-10 lg:grid-cols-5 xl:grid-cols-10"
      >
        {SEQUENCES[rotationClass].map((crop, index) => (
          <li
            aria-label={`Year ${index + 1}: ${cropLabels[crop]}`}
            className={`flex aspect-square min-w-0 items-center justify-center rounded border font-mono text-xs font-bold ${CROP_STYLE[crop].className}`}
            key={`${crop}-${index}`}
            title={`Year ${index + 1} · ${cropLabels[crop]}`}
          >
            {CROP_STYLE[crop].code}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {rotationClassDescriptions[rotationClass]}
      </p>
    </article>
  );
}
