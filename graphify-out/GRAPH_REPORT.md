# Graph Report - GeoCrop-Spatiotemporal-Modeling  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1034 nodes · 2168 edges · 44 communities (38 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `51618523`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29

## God Nodes (most connected - your core abstractions)
1. `cn()` - 36 edges
2. `NormalizedDashboardData` - 24 edges
3. `normalizeDashboardData()` - 22 edges
4. `CropId` - 21 edges
5. `compilerOptions` - 16 edges
6. `assemble_training_panel()` - 16 edges
7. `MapPanel()` - 15 edges
8. `build_test_year_frame()` - 15 edges
9. `readString()` - 14 edges
10. `AnomalyStateCropSummary` - 14 edges

## Surprising Connections (you probably didn't know these)
- `_active_grid()` --uses--> `WmsStudyGrid`  [INFERRED]
  scripts/download_data.py → src/utils/study_extent.py
- `_cdl_grid()` --uses--> `WmsStudyGrid`  [INFERRED]
  scripts/download_data.py → src/utils/study_extent.py
- `DashboardShellProps` --references--> `NormalizedDashboardData`  [EXTRACTED]
  dashboard/src/components/layout/DashboardShell.tsx → dashboard/src/lib/data/normalize.ts
- `main()` --calls--> `load_cdl_spatial_metadata()`  [EXTRACTED]
  scripts/_refresh_task2_areal_region_artifacts.py → src/io/cdl_parquet.py
- `main()` --calls--> `load_cornbelt_state_boundaries_5070()`  [EXTRACTED]
  scripts/_refresh_task2_areal_region_artifacts.py → src/viz/rotation_maps.py

## Import Cycles
- None detected.

## Communities (44 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (65): Home(), createContext(), emptyEvidence(), MapPanel(), changeGrain(), clearSelection(), pinGeography(), MapPanelProps (+57 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (62): AtlasProperties, countyFeatures, getStudyCountyFeatures(), getStudyStateFeatures(), stateFeatures, STUDY_STATES, STUDY_VIEW_BOX, StudyMapFeature (+54 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (70): _active_grid(), _cdl_grid(), cdl_layer_name(), configure_from_external(), download_cdl(), download_geotiff(), download_ndvi(), download_smap() (+62 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (52): Card, buildRows(), ChartRow, ComparatorCrop, fmt(), labelFor(), MONTH_LABELS, MONTH_TICKS (+44 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (45): DashboardShellProps, PAPER_REFERENCE, TAB_META, TaskTabs(), TopBar(), EvidenceLens(), GeographyReference, EvidenceCaption() (+37 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (51): AblationChart(), AblationChartProps, CONFIGURATIONS, cellColor(), ConfusionCallouts(), ConfusionMatrix(), ConfusionMatrixProps, getCropIndex() (+43 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (55): cropLabels, formatAreaHa(), formatCount(), formatExactPercent(), formatPercent(), formatPixels(), formatThreshold(), geographyKindLabels (+47 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (51): DashboardShell(), handleMapSelection(), patchState(), updateState(), dashboardData, mockNavigation, DashboardFilterState, DashboardTab (+43 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (47): main(), default_feature_columns(), evaluate_multiclass(), Any, DataFrame, ndarray, Path, Run Optuna TPE search over LightGBM hyperparameters. Returns a dict with keys… (+39 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (43): Affine, main(), cdl_spatial_metadata_path(), cdl_wide_parquet_path(), load_cdl_spatial_metadata(), load_cdl_wide_years(), DataFrame, ndarray (+35 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (45): ArtifactLoadErrorCode, aggregatePhenologyPoints(), DashboardDataLoadError, emptyToUndefined(), eventIdFromSourceId(), getCsvArtifact(), getJsonArtifact(), getStudyStateByFips() (+37 more)

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (39): devDependencies, eslint, eslint-config-next, jsdom, tailwindcss, @tailwindcss/postcss, @testing-library/jest-dom, @testing-library/react (+31 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (38): int_, alternation_score(), alternation_score_batch(), classify_batch(), classify_pixel(), cornsoy_years_count(), cornsoy_years_count_batch(), crop_share() (+30 more)

### Community 13 - "Community 13"
Cohesion: 0.06
Nodes (31): class-variance-authority, clsx, d3-geo, dependencies, class-variance-authority, clsx, d3-geo, lucide-react (+23 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (28): _bbox_5070_from_states(), _default_cdl_stack_path(), _discover_ndvi_layers(), _fit_resolution(), _list_ndvi_interim_nc(), _list_smap_interim_nc(), _load_cfg(), main() (+20 more)

### Community 15 - "Community 15"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (26): Pattern, find_repo_root(), load_cdl_stack_from_interim(), load_ndvi_weekly_all_years(), load_smap_weekly_all_years(), _parse_year_from_stem(), DataArray, Path (+18 more)

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (26): event_week_columns(), iso_week_for_w_index(), load_smap_year_metadata(), Any, Path, First ``w###`` column in this calendar year whose ISO week equals ``iso_week``., List (wcol, date_str, iso_week) for columns whose start date falls in [start,…, smap_metadata_path() (+18 more)

### Community 18 - "Community 18"
Cohesion: 0.13
Nodes (24): fetch_3dep_terrain(), fetch_csb_boundaries(), fetch_gridmet_climate(), _fetch_mukey_raster(), _fetch_mukey_tiled(), _fetch_soil_attributes(), fetch_ssurgo_soil(), load_grid_meta() (+16 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (15): date, build_cdl_stack(), build_ndvi_stack(), build_smap_stack(), cdl_raw_tif_path(), main(), parse_ndvi_layer_date(), parse_smap_layer_date() (+7 more)

### Community 20 - "Community 20"
Cohesion: 0.16
Nodes (13): nig_posterior_params(), nig_predictive_scores(), float32, float64, floating, integer, NDArray, Per-``iso_week`` grand mean across all pixels — used as μ₀ in the NIG prior. (+5 more)

### Community 21 - "Community 21"
Cohesion: 0.24
Nodes (11): int32, _alpha_matrix_from_cfg(), p_regular_and_uncertainty_chunked(), per_pixel_transition_counts(), float32, float64, integer, NDArray (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (6): labels_to_raster(), plot_crop_type_map(), Axes, ndarray, Scatter pixel-level labels into a 2-D raster array. Parameters ---------- iy,…, Plot a categorical crop-type raster with a discrete colour legend. Parameters…

### Community 23 - "Community 23"
Cohesion: 0.60
Nodes (5): _extract_dir(), load_cornbelt_counties_5070(), Path, Load county polygons for the 13 Corn Belt states, reprojected to EPSG:5070.…, _zip_path()

## Knowledge Gaps
- **174 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+169 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 4` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `CropId` connect `Community 3` to `Community 0`, `Community 1`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 10`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `DashboardShell()` connect `Community 7` to `Community 0`, `Community 4`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `normalizeDashboardData()` (e.g. with `isLoadError()` and `toDataLoadError()`) actually correct?**
  _`normalizeDashboardData()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _174 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05308641975308642 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.055246913580246915 - nodes in this community are weakly interconnected._