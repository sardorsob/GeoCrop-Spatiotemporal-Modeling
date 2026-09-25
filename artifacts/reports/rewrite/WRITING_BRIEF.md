# GeoCrop rewrite brief

Mode: rewrite-with-notes. Coordinator: root. Tier: Full, with independent section writers and cross-review. Authorized: rewrite, simplify, delegate, review iteratively, regenerate PDF, correct repository URL, commit once finished. No push or new model experiments requested.

Audience: readers with general remote-sensing/data-science knowledge who need a clear account of this project. Working destination: revised project paper, retaining all four original tasks. The original challenge's historical submission rules are not a claim that this later revision is a new competition submission.

Target: approximately 10–12 pages including references, readable 11 pt article, selected figures, sufficient reproducibility detail. Preserve the original paper in an archive and make the revised source buildable. Correct repository: https://github.com/sardorsob/GeoCrop-Spatiotemporal-Modeling.

Reader promise: explain what crop history, seasonal vegetation, and soil moisture each contribute to crop mapping and monitoring across the 13-state Corn Belt, and bound the evidence honestly. Resilience is motivation, not a measured outcome.

Outline: abstract; purpose/introduction; data and actual workflow; seasonal crop signatures (Task 1); crop-history patterns (Task 2); wet and dry conditions (Task 3); crop classification (Task 4); synthesis and limitations; conclusion; references. Each task combines the necessary method, result, and interpretation so readers need not remember methods across long gaps.

Voice: direct, specific academic prose, active verbs, natural sentence lengths. Explain purpose before machinery. Connect what was used, how, why, and the result without repeating a fixed formula. Terms earn their place. Avoid prestige adjectives, dramatic framing, fake casualness, stock transitions, and re-listing numbers in the discussion.

Source authority: saved artifacts plus inspected implementation. Prior paper and paper_review.m2 are context, not proof. Read ../paper_rewrite_assessment.md for the audit. References: ../references.bib, with exact metadata verified before inclusion.

Scientific decisions: do not rerun analyses for this writing task. Describe existing results accurately; omit unsupported validation and causal claims. Crop 26 must be named winter wheat/soybean double crop in Task 3. Explain retrospective event baseline includes 2019. Moisture CDF is a percentile, not drought probability. HSGP checks are in sample. Task 4 uses concurrent growing-season inputs and balanced samples, not preseason forecasting or area-representative accuracy. Mention spatial transfer and feature-construction limitations. Do not assert all models feed into the classifier. Shared grid claims must be task-specific and qualified where metadata is unavailable.

Owners: phenology_rotation writes only sections/phenology_rotation.tex and reviews/phenology_rotation.md; moisture writes only sections/moisture.tex and reviews/moisture.md; classification writes only sections/classification.tex and reviews/classification.md. Root owns all shared state, main file, figures, bibliography, build, and commit.

Acceptance: every retained number traceable; corrected method definitions; no unresolved draft markers in PDF; natural prose; valid citations/links; all figures legible; no overfull boxes or broken references; final PDF and reproducible source; independent substantive and style review followed by root integration.
