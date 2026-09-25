# Revised GeoCrop paper

The current paper is [geocrop_revised.pdf](../geocrop_revised.pdf), with [LaTeX source](../geocrop_revised.tex), [plain text](../geocrop_revised.txt), and a [curated bibliography](../references_revised.bib). It retains all four analyses in 10 pages, including references, using 11 pt body text, 10 pt references, and one-inch margins. The five figures and two tables replace repeated panels and long result inventories.

The earlier 23-page [PDF](../archive/NAFSI_Predictive_Modeling_for_Agricultural_Resilience_original.pdf), [source](../neurips_2024.tex), and [bibliography](../references.bib) remain available. The original source and PDF were not fully synchronized; the archive preserves that historical state. The root-level PDF and dashboard copy retain their existing filenames for compatibility.

## Build the paper

The checked-in figure PDFs are sufficient to compile. From the repository root, with Tectonic installed:

```sh
cd artifacts/reports
mkdir -p build
tectonic -X compile --untrusted --outdir build geocrop_revised.tex
```

Tectonic 0.17.0 was used for this revision. It runs BibTeX and the required citation passes automatically. On first use, it may download TeX resources. A conventional LaTeX/BibTeX installation can also compile this standard article; that route was not tested here. Build products stay in the ignored `build/` directory. Copy the accepted PDF to `artifacts/reports/geocrop_revised.pdf`, the existing root PDF, and the dashboard's existing `public/papers/` asset only after checking the result. The plain-text file is a PDF extraction for reading, not an alternate manuscript source.

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
