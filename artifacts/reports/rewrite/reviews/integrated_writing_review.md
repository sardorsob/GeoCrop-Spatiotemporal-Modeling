# Integrated writing review

Status: ready-for-check. Reviewer: moisture, reviewing the integrated draft independently of root's integration. The reviewer wrote the moisture section earlier; recommendations here cover the whole paper and include a fresh pass on that section. No manuscript edits were made.

Mode: diagnose-only, with concrete replacement suggestions. Read `geocrop_revised.tex` and every file in `rewrite/sections/`, the shared brief/voice/claims files, and the writing kit's Core, profile, substantive and structural checklists, final-polish skill, and hygiene/voice references. Line references below refer to the snapshot inspected in this review; paragraph-opening anchors remain usable if root edits concurrently.

## Verdict

The central story now works. The purpose-led introduction explains why the three sources belong together; each analysis places necessary method next to the result; and the classification comparison supplies the clearest test of added information. The draft is specific and appropriately restrained. It does not need another structural rebuild or more methodological exposition.

The remaining writing problem is repeated boundary-setting. The data section, task sections, discussion, and conclusion sometimes repeat the same distinction in slightly different words. Retain the scientific qualification nearest its claim, then use the discussion to state its consequence for interpretation or the next experiment. The density can be reduced without deleting verified results or weakening limitations.

Strongest material to preserve: the concrete opening; the phenology peak comparison; the exact rotation rule and sensitivity comparison; the moisture percentile definition and denominators; the feature ablation table; the error-direction counts; and the candid feature-construction limitations. Captions must remain sufficiently self-contained even when that repeats a crucial denominator or warning.

## Prioritized edits

### 1. Explain the regular-group metric contrast instead of leaving it as an unexplained low number

**Location:** `sections/classification.tex:87–92`, paragraph beginning “Accuracy was 95.55%”.

**Problem:** The paragraph moves from very high regular-group accuracy to macro F1 of 0.559 without explaining the useful point. “Only” signals disappointment but does not help readers interpret the result. This is the clearest underdeveloped paragraph in the draft.

**Replace the final two sentences with:**

> Different class mixtures across these groups prevent a causal interpretation of the accuracy gaps. The regular group's high accuracy also masks uneven performance across classes: corn and soybean F1 scores were 0.879 and 0.907, while four-class macro F1 was 0.559.

This makes the paragraph's job explicit using the existing numbers; it adds no claim about why other classes perform poorly. Keep the sample supports.

### 2. Remove the orphaned rotation diagnostic

**Location:** `sections/phenology_rotation.tex:29`, paragraph beginning “An additional Dirichlet--multinomial diagnostic”.

**Problem:** This introduces a new model family at the end of the section, gives no result, and immediately explains what its probability does not mean. It has no later role in the paper. The paragraph asks the reader to learn another method without a payoff.

**Action:** Delete this paragraph from the main paper. Keep its definition and outputs in the repository or supplement if desired. The deterministic rotation rule and its uncertainty about thresholds remain fully explained in the preceding paragraphs.

### 3. Give repeated caveats one main home

**Locations and precise changes:**

- `geocrop_revised.tex:53`, beginning “We address each question”: the preceding paragraph already lists all four questions. Replace the first three sentences with **“The first three analyses describe regional patterns; the fourth tests how seasonal observations add to crop-history-based classification.”** Keep the final sentence limiting the resilience claim.
- `geocrop_revised.tex:79`: delete **“Keeping these paths separate avoids implying that success in one task validates the others.”** The preceding concrete dependency statement does the scientific work; this last sentence sounds like an instruction to an editor.
- `sections/classification.tex:22–26`: keep **“These features were calculated directly from the weekly observations.”** Remove the repeated HSGP exclusion and final NIG exclusion sentence. The exact exclusions remain in the main workflow paragraph and figure caption.
- `sections/phenology_rotation.tex:12`: remove the final sentence beginning **“The curves supply descriptive context…”** Its point appears in the introduction, workflow, classification interpretation, and discussion. Preserve the immediately preceding in-sample qualification.
- `sections/classification.tex:103–105`: delete the paragraph announcing what the Discussion addresses. The next section makes those limits explicit; a forward announcement adds no evidence.
- `sections/moisture.tex:60–65`: retain the first two sentences, ending **“they provide context for crop-condition monitoring.”** Remove the two future-evaluation sentences if the final discussion paragraph at `geocrop_revised.tex:117` is retained. That paragraph already provides the independent-label and prospective-reference requirements.

**Protected qualifications:** Keep the baseline overlap in the moisture method, the plain statement that its CDF is not drought probability, the code-26 double-crop label, in-sample HSGP evaluation, the classifier's concurrent-season cutoff, the balanced denominator, the group-mixture qualification, and all material feature-builder limitations. This edit removes duplication, not those limits.

### 4. Make the discussion interpret the task evidence rather than paraphrase it again

**Location:** `geocrop_revised.tex:106–110`, first three discussion paragraphs.

**Problem:** Each paragraph largely revisits its matching task paragraph, including the same caveat. A short synthesis is justified in a four-task paper, but the current three-paragraph version can be more decisive.

**Suggested replacement for the three paragraphs:**

> Seasonal NDVI has the clearest measured value for crop classification in this study. Its improvement over crop history agrees with the distinct timing seen in the regional curves, although the experiment does not identify which timing feature accounts for the gain. Crop history remains a useful baseline, but its interpretation depends on the sequence rule and the crop classes represented. The rotation sensitivity and regime-specific errors therefore point to the need to evaluate performance across crop histories, with class composition reported alongside accuracy.
>
> The moisture analysis serves a different purpose: it describes departures from usual seasonal conditions. The small classification gain from the selected SMAP features applies to that feature set and validation year. Evaluating moisture for crop-condition monitoring would require a defined outcome and an evaluation designed around it.

This preserves the synthesis and confidence level, while reducing repeated peaks, repeated irregularity warnings, and lists of untested applications. The full limitations subsection still carries spatial support, feature construction, and event-reference constraints. If page balance favors the current length, the same ideas can remain in three shorter paragraphs; do not add filler to meet a page target.

### 5. Make the conclusion land on the central finding and next test

**Location:** `geocrop_revised.tex:120`.

**Problem:** The current conclusion returns to a three-source recap before repeating the discussion's follow-up list. It is sound but generic relative to the precise paper.

**Suggested replacement:**

> Seasonal NDVI added more to crop-history-based classification than the selected soil-moisture features in the reported validation comparison. The descriptive analyses explain the regional patterns behind these inputs while showing the limits imposed by aggregation and classification rules. The next test is to construct features consistently at explicit time cutoffs and evaluate them across years and unseen locations. Moisture monitoring needs its own crop-condition outcome and validation data.

The conclusion need not repeat rotation shares, peaks, or test accuracy. Keep the year-specific and feature-specific scope.

## Smaller copy edits

1. **Abstract, `geocrop_revised.tex:44`:** change **“four linked analyses”** to **“four complementary analyses.”** The workflow explains shared inputs but no chain of fitted models. “Complementary” fits that actual relationship more precisely.
2. **Data, `geocrop_revised.tex:59`:** delete **“Catalog availability is broader than the data used in any one experiment.”** The table already states the actual windows, and no catalog date range remains for the reader to confuse with them.
3. **Grid paragraph, `geocrop_revised.tex:77`:** replace **“We report that spacing where the output metadata establishes it, rather than assigning a nominal 250 m resolution to every analysis.”** with **“That spacing is verified for the saved rotation output.”** The existing final sentence preserves the missing-alignment-metadata limitation. This removes language that seems to answer the earlier manuscript rather than address the current reader.
4. **Phenology, `sections/phenology_rotation.tex:6`:** replace the final sentence with **“Annual CDL masks let cells enter or leave a crop's summary as their labels change.”** Same point, cleaner movement.
5. **Phenology, `sections/phenology_rotation.tex:8`:** if empirical spatial quartiles are not plotted or otherwise reported in the final PDF, remove their computation from line 6 and the final sentence of line 8. The necessary distinction remains in the predictive-band definition and caption. Keep the quartile method if the final figure actually displays those summaries.
6. **Moisture, `sections/moisture.tex:19–22`:** replace **“so the two windows serve as retrospective case studies with unequal separation from the reference period”** with **“so the two windows are retrospective comparisons with different dependence on the reference data.”** The existing wording is more abstract than the underlying issue. Keep the next sentence on excluding event years, unless root prefers to explain that prospective remedy only in the discussion.
7. **Moisture, `sections/moisture.tex:27–29`:** the unintroduced symbols `$\lambda_0=1$` and `$\alpha_0=2$` interrupt otherwise plain prose. Either define them briefly or move their exact values to a compact implementation note. The paragraph can end the prior specification at **“cell-level baseline variances”** because the code and configuration remain the reproducibility source. Do not remove the explanation that priors depend on regional data.
8. **Classifier opening, `sections/classification.tex:6–8`:** replace the first two sentences with **“We tested whether current-season NDVI and soil moisture improve crop classification beyond the information in preceding crop labels.”** The introduction has already explained what crop history records.
9. **SHAP, `sections/classification.tex:96–101`:** the purpose could lead: **“To examine which inputs influenced the fitted model, we applied SHAP TreeExplainer…”** Retain the model-attribution scope. Delete **“Irrigation status and causes of crop choice were not evaluated.”** No sentence in this revised paragraph suggests either claim, so this warning answers an argument the paper no longer makes.
10. **Prediction caption, `geocrop_revised.tex:100`:** replace **“other is the residual selected code group”** with **“Other combines the remaining selected CDL labels.”** The full selected-code range remains in the section.

## Reverse-outline check

| Part | Current job | Disposition |
|---|---|---|
| Abstract | Four-task result map and scope | Keep; replace “linked” |
| Introduction | Explain source roles and questions | Keep opening and questions; compress repeated task inventory |
| Data and design | Establish units, windows, resolution, dependencies | Keep; remove audit-facing wording |
| Phenology | Regional seasonal difference and fitting scope | Keep; trim duplicate classifier handoff |
| Rotation | Define rule, map shares, show threshold sensitivity | Keep exact rule; cut orphaned Bayesian diagnostic |
| Moisture | Explain reference, CDF, event summaries | Keep method and denominator; centralize later validation requirements |
| Classification | Test incremental information, report errors and regimes | Keep results; explain macro-F1 contrast; streamline repeated dependency exclusions |
| Discussion | Synthesize source roles and identify limits | Shorten recap; preserve detailed feature-construction paragraph |
| Conclusion | State central finding and concrete next experiment | Tighten to the proposed four sentences |
| Code and reproducibility | Locate artifacts and distinguish revision from rerun | Keep |

## Review bounds and next pass

This was a prose and structure review, not a new evidence audit or PDF layout check. No fresh quantitative result or external citation is proposed. Root should apply the prioritized edits selectively, then rerun the build and check that figure captions still contain their units, sample definition, and essential interpretation. The suggested cuts should come before sentence-level synonym changes; the current direct vocabulary is already appropriate.

## Final resolution and writing verdict

Final writing disposition: **accepted**. Reread the current `geocrop_revised.tex` and all three section files after integration. The material recommendations are resolved: the regular-regime metric contrast is explained, the orphaned rotation diagnostic is removed, repeated dependency statements are reduced, the discussion synthesizes rather than recites, and the conclusion states a bounded finding and concrete next test. The smaller edits to the abstract, data wording, phenology, moisture priors, classifier opening, SHAP purpose, and prediction caption are also present.

The remaining repetition is justified: captions preserve units and interpretation for readers viewing figures independently, while the discussion collects the major limits. It retains independent event/outcome validation requirements after their removal from the moisture ending. In-sample phenology, baseline overlap, percentile meaning, crop-code distinctions, balanced evaluation, differing regime mixtures, and feature-construction discrepancies remain visible.

No remaining repeated or awkward paragraph materially harms clarity. No further prose expansion or revision is required. This acceptance covers prose and structure; root separately completed the ten-page PDF build and visual checks.
