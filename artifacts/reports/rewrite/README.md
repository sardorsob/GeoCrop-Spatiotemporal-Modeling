# Reading the Corn Belt

The main paper is [Reading the Corn Belt: Crop History, Vegetation Timing, and Soil Moisture](../../../Reading_the_Corn_Belt.pdf), with [LaTeX source](../Reading_the_Corn_Belt.tex), [plain text](../Reading_the_Corn_Belt.txt), and a [curated bibliography](../references.bib). It retains all four analyses in 10 pages, including references, using 11 pt body text, 10 pt references, and one-inch margins. The five figures and two tables replace repeated panels and long result inventories.

The earlier 23-page [PDF](../../../context/archive/NAFSI_Predictive_Modeling_for_Agricultural_Resilience_original.pdf), [source](../../../context/archive/NAFSI_Predictive_Modeling_for_Agricultural_Resilience_original.tex), and [bibliography](../../../context/archive/references.bib) are preserved in `context/archive/`. The original source and PDF were not fully synchronized; the archive preserves that historical state. Current PDF copies use the meaningful filename `Reading_the_Corn_Belt.pdf` at the repository root, in `artifacts/reports/`, and in the dashboard's `public/papers/` directory.

## Build the paper

The checked-in figure PDFs are sufficient to compile. From the repository root, with Tectonic installed:

```sh
cd artifacts/reports
mkdir -p build
tectonic -X compile --untrusted --outdir build Reading_the_Corn_Belt.tex
```

Tectonic 0.17.0 was used for this revision. It runs BibTeX and the required citation passes automatically. On first use, it may download TeX resources. A conventional LaTeX/BibTeX installation can also compile this standard article; that route was not tested here. Build products stay in the ignored `build/` directory. After checking the result, synchronize `Reading_the_Corn_Belt.pdf` in the three current locations above. The plain-text file is a PDF extraction for reading, not an alternate manuscript source.

## Regenerate the figures

From the repository root, in a Python environment containing NumPy, pandas, Matplotlib, and Pillow:

```sh
python artifacts/reports/rewrite/make_figures.py
```

The script reads seven saved result files, checks key counts, writes five PDF/PNG pairs, and records SHA-256 input hashes in [figures/source_manifest.json](figures/source_manifest.json). The input artifacts are already in the repository. No models are fitted and no source result tables are changed. PNGs are convenient previews; LaTeX uses the PDF figures.

## Evidence and editorial record

- [Writing brief](WRITING_BRIEF.md) and [voice profile](VOICE_PROFILE.md): scope, audience, and direct, purpose-led prose.
- [Claims and sources](CLAIMS_AND_SOURCES.md): traceability for the retained findings.
- [Method notes](METHOD_NOTES.md): implementation details kept outside the main narrative.
- [Review notes](REVIEW_NOTES.md) and [review receipts](reviews/): section reviews, cross-review, citation audit, and resolutions.
- [Verification record](verification.json): page and word counts, hashes, source checks, and PDF link checks.
- [Handover](HANDOVER.md): final status and known scientific limits.

This was a writing and presentation revision of saved experiments. The paper now distinguishes in-sample fit from held-out evaluation, raw from smoothed rotation classes, CDL 26 double crop from winter wheat, moisture percentiles from drought probabilities, and seasonal classification from preseason forecasting. It also states the feature-construction and grid-provenance limitations found during review. Those issues require new analysis to resolve; improved wording does not repair the experiments.

Historical review receipts retain the filenames that existed when those reviews ran: `geocrop_revised.tex` is now `Reading_the_Corn_Belt.tex`, `references_revised.bib` is now the current `references.bib`, and `neurips_2024.tex` and the original bibliography moved into `context/archive/`. Their line-specific comments describe the reviewed snapshots.
