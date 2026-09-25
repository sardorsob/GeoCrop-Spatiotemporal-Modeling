# Review notes

Initial diagnosis and evidence audit are in `../paper_rewrite_assessment.md`. Section receipts and review feedback live in `reviews/`. Root owns the integrated decisions and final verification here.

Decision: retain four tasks, combine each method with its findings, and keep the central contribution at the level supported by the saved analyses. Correct misleading prose; expose limitations that would require new experiments. Preserve the original PDF and source. Use a standard article layout, not the unrelated NeurIPS 2024 template.

## Final integrated decisions

The three writers completed initial sections, source-focused revisions, and a prose pass. Integrated evidence, scientific-story, and writing reviews then covered the complete manuscript; their actionable findings are resolved. The final evidence review passed the core results and figure sources. The writing and story reviewers recorded acceptance after rereading the revised text.

Changes from cross-review include the buffered raster denominator (66,107 eligible cells outside the configured states), event-matched baseline weeks, exact classifier eligibility, missing pre-2015 SMAP inputs, and latent-mean versus predictive-interval labels. Deleted the peripheral Dirichlet diagnostic from the main paper and moved detailed settings to METHOD_NOTES. Repeated qualifications now stay nearest their claims or in the consolidated limitations subsection.

The curated bibliography contains 11 unique keys, all cited. Corrected the HSGP journal DOI and the MODIS guide's author/year/institution. The original bibliography, including its historical errors, remains with the original source. The current manuscript uses only the curated file.

## Final verification

- Tectonic 0.17.0 completed with exit 0. The final pass had no warnings, undefined citations/references, or overfull/underfull boxes; its excerpt is `reviews/final_compile.txt`.
- Inspected every rendered page. Final pages 1–3 were byte-identical to already inspected renderings; pages 4–10 were reinspected after final pagination. No clipping, unreadable legend, stray empty page, or orphan reference remained.
- PDF: 10 pages; 4,246 extracted words versus the original 23 pages and 9,167 words. Five figures and two tables retain all four analyses.
- Verified all seven figure-source SHA-256 entries, the correct repository hyperlink, link rectangles within page boundaries, and no unresolved draft markers.
- Original PDF archive preserves its prior hash. Canonical, root, and dashboard current PDF copies match. No models or analysis artifacts were changed.
- Dashboard Builder reported passing typecheck, lint, four existing reader tests, and workflow checks. Root independently checked the byte-identical PDF handoff and scoped diff; asset-only acceptance introduces no application changes.

Known scientific limits are explicit in the paper and HANDOVER. They are not unresolved editing defects and were not silently repaired by rewriting.

User follow-up: added the clickable full GitHub URL directly beneath the abstract, tightened unused title spacing to retain ten pages, rebuilt with no final-pass warnings, checked page-one link placement and page ten, and confirmed pages 2–9 match the previously inspected renders. Current root/dashboard copies and text extraction are synchronized; verification.json contains the new hash.

## Main-paper naming and archive

The paper is now **Reading the Corn Belt: Crop History, Vegetation Timing, and Soil Moisture**. The root entry point is `Reading_the_Corn_Belt.pdf`; current source and report copies use the same basename under `artifacts/reports/`. The current bibliography is `artifacts/reports/references.bib`. Updated the title, PDF metadata, active documentation, and dashboard reader/download names. The rebuilt paper remains ten pages with no final-pass warnings; its first page was visually checked, and pages 2–10 match the previous accepted renders.

Moved the original PDF, original TeX (formerly `neurips_2024.tex`), and original bibliography into `context/archive/`. Verified all three hashes before and after the move; the archive manifest records their original locations. Git ignores other context files while allowing this archive to remain versioned. Historical review receipts retain the filenames of the snapshots they evaluated, as explained in README.md.
