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
- PDF: 10 pages; 4,245 extracted words versus the original 23 pages and 9,167 words. Five figures and two tables retain all four analyses.
- Verified all seven figure-source SHA-256 entries, the correct repository hyperlink, link rectangles within page boundaries, and no unresolved draft markers.
- Original PDF archive preserves its prior hash. Canonical, root, and dashboard current PDF copies match. No models or analysis artifacts were changed.
- Dashboard Builder reported passing typecheck, lint, four existing reader tests, and workflow checks. Root independently checked the byte-identical PDF handoff and scoped diff; asset-only acceptance introduces no application changes.

Known scientific limits are explicit in the paper and HANDOVER. They are not unresolved editing defects and were not silently repaired by rewriting.
