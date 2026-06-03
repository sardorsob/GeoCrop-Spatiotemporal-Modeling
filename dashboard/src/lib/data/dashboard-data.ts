import { loadArtifactSources } from "./loaders";
import { normalizeDashboardData, type NormalizedDashboardData } from "./normalize";
import { artifactSources } from "./sources";

export async function loadDashboardData(): Promise<NormalizedDashboardData> {
  const artifacts = await loadArtifactSources(artifactSources);

  return normalizeDashboardData(artifacts);
}
