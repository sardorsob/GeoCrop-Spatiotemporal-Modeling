# Bounded bibliography audit

Reviewer: classification agent. Scope: all 11 entries in `artifacts/reports/references_revised.bib`, citations in the integrated main manuscript and three section files, original bibliography for comparison, and primary publication/product records. No bibliography or manuscript edits made.

## Verdict

**One confirmed metadata correction** in `modis_vi_userguide`; the remaining entries have no material metadata or citation-support issue identified. Automated key checks find **11 unique bibliography keys, 11 cited keys, no duplicate keys, no missing cited entries, and no uncited entries**. The original bibliography's duplicated `roberts2017cv` entries are absent from the revised file.

## Finding: correct the MODIS guide authors, date, and document identity

**Location:** `references_revised.bib`, entry `modis_vi_userguide` (original audit snapshot lines 33–40).

The linked PDF is not authored by NASA LP DAAC in 2021. Its title page identifies **Kamel Didan and Armando Barreto Munoz**, **September 2019**, **MODIS Vegetation Index User's Guide (MOD13 Series)**, **Version 3.10 (Collection 6.1)**, Vegetation Index and Phenology Lab, University of Arizona. The host is a distributor, not the named author. [Primary guide, title page](https://lpdaac.usgs.gov/documents/621/MOD13_User_Guide_V61.pdf).

**Recommended fix:** Retain the key and working URL, but update author, title, institution, and year to that title-page identity; version/collection may be supplied in a note. Suggested fields: `author = {Didan, Kamel and Barreto Munoz, Armando}`, `year = {2019}`, `institution = {Vegetation Index and Phenology Lab, University of Arizona}`, `note = {Version 3.10, Collection 6.1}`. The nearby canopy-greenness claim remains supported after this bibliographic correction. This guide is not being used as evidence that the CropSmart composites themselves are weekly.

Root was notified of this finding while the audit continued. Check whether root's concurrent bibliography pass has already applied it before editing.

## Entry-by-entry checks

| Key | Metadata and nearby-claim assessment | Primary check |
|---|---|---|
| `wardlow2007modis` | Title, Wardlow/Egbert/Kastens authors, 2007, volume 108(3), 290–310, DOI `10.1016/j.rse.2006.11.021` agree. Supports MODIS time-series crop discrimination in the introduction. | [Publisher article record](https://www.sciencedirect.com/science/article/pii/S0034425706004949); [NASA MODIS team publication listing](https://modis-land.gsfc.nasa.gov/ValStatus.php?ProductID=MYD13Q1) |
| `zhang2019cropprediction` | Title, Chen Zhang/Liping Di/Li Lin/Liying Guo, 2019, volume 166, article 104989, DOI `10.1016/j.compag.2019.104989` agree. Directly supports historical crop-map prediction of subsequent planting. | [Publisher record and abstract](https://www.sciencedirect.com/science/article/abs/pii/S0168169919309482) |
| `cdl_cropscape` | Institutional authorship and product identity appropriate for the claim that CDL supplies crop categories. An undated service entry does not imply a particular annual data release. The direct application did not render through the web reader; USDA confirms the service URL and category role. | [USDA CDL metadata](https://www.nass.usda.gov/Research_and_Science/Cropland/metadata/metadata_ca21.htm); [USDA CropScape documentation](https://www.nass.usda.gov/Research_and_Science/Cropland/docs/YangJOG_CropScape.pdf) |
| `modis_vi_userguide` | Nearby NDVI meaning is supported; metadata needs the correction above. | [Guide title page and introduction](https://lpdaac.usgs.gov/documents/621/MOD13_User_Guide_V61.pdf) |
| `reichle2017smap` | Title, listed authors through Smith followed by `others`, 2017, volume 18(10), 2621–2645, DOI `10.1175/JHM-D-17-0063.1` agree. Supports the observation-plus-land-model description of SMAP L4. | [NASA publication identity and authors](https://ntrs.nasa.gov/citations/32167168392381); [NASA SMAP L4 documentation](https://gmao.gsfc.nasa.gov/gmao-products/smap-l4/documentation_smap-l4/) |
| `riutort2023hsgp` | All five authors, title, volume 33, article 17, and DOI `10.1007/s11222-022-10167-2` agree. The issue year 2023 is valid despite online publication in December 2022. Supports the finite-basis approximation claim. | [Springer article and abstract](https://link.springer.com/article/10.1007/s11222-022-10167-2) |
| `sahajpal2014recruit` | Five authors, title, 2014, volume 108, 173–182, DOI `10.1016/j.compag.2014.08.005` agree. Supports multi-year CDL sequence analysis as precedent, without falsely equating the project rule with the complete RECRUIT algorithm. | [Author-institution article record and abstract](https://www.pnnl.gov/publications/identifying-representative-crop-rotation-patterns-and-grassland-loss-us-western-corn); [PNNL bibliographic record](https://data.pnnl.gov/group/nodes/publication/21417) |
| `murphy2007conjugate` | Title, Kevin P. Murphy, and 2007 agree with the author-hosted document, updated October 3, 2007. Supports conjugate Gaussian/NIG inference and Student-t prediction. | [Author's report](https://www.cs.ubc.ca/~murphyk/Papers/bayesGauss.pdf) |
| `ke2017lightgbm` | Title, all eight authors, and 2017 conference identity agree; the reported page range is consistent with the original proceedings citation. Supports the classifier family, not the project's specific tuning settings. | [Official proceedings record](https://papers.nips.cc/paper_files/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html) |
| `lundberg2017shap` | Title, Lundberg/Lee authors, and 2017 conference identity agree; the reported page range is consistent with the original proceedings citation. Supports the SHAP attribution framework. The exact TreeExplainer call and sample size are repository methods, not claims attributed to the 2017 paper. | [Official proceedings record](https://papers.nips.cc/paper_files/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html) |
| `roberts2017cv` | Title, all 14 authors, volume 40(8), 913–929, DOI `10.1111/ecog.02881` agree. Issue year 2017 is valid despite first online publication in December 2016. Supports spatially structured evaluation for transfer to new locations. | [Wiley article and abstract](https://nsojournals.onlinelibrary.wiley.com/doi/10.1111/ecog.02881) |

## Scope notes

The manuscript uses citations for methods, product meanings, and precedents, while its quantitative findings are traced to saved repository artifacts. No nearby citation was found to be standing in for unsupported local performance, a causal agronomic claim, or independent validation. This audit does not turn missing web-reader access into a claim that a URL is broken. Publisher search-index records were used when the full publisher page blocked direct retrieval; primary institutional/author records supplied independent metadata checks.

The three earlier integrated evidence findings are all resolved; see the resolution checklist added to `integrated_evidence_review.md`. Once the MODIS guide metadata is corrected, this bounded citation audit passes.

## Coordinator resolution

Updated the retained guide entry to Didan and Barreto Munoz, 2019, University of Arizona, with Version 3.10/Collection 6.1 in its note; the working source URL is retained. The undated CropScape service is explicitly marked n.d. The final bibliography builds without warnings and contains all 11 cited entries. This resolves the sole citation finding.
