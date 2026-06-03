import { artifactSources } from "./sources";
import type { ArtifactSource, ArtifactSourceId, SourceNote } from "./types";

export const sourceNotesById = Object.fromEntries(
  artifactSources.map((source): readonly [ArtifactSourceId, SourceNote] => {
    const typedSource = source as ArtifactSource;

    return [
      source.id,
      {
        sourceId: source.id,
        taskId: source.taskId,
        path: source.path,
        label: source.label,
        caveat: source.caveat,
        statusText: source.statusText,
        dateStamp: typedSource.dateStamp,
        denominator: typedSource.denominator
      }
    ];
  })
) as Readonly<Record<ArtifactSourceId, SourceNote>>;
