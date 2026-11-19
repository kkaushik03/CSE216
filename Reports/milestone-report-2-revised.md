# Milestone Report 2 (Revised)

**Team:** Liza Babior, Braxton Conley, and Khushi Kaushik  
**Project:** Assessing Accessibility Outcomes in AI-Assisted User Interface Development  
**Initial report:** November 16, 2026 · **Revised:** November 19, 2026

## What Changed After the Meeting

- **Gemini is dropped.** Rahat's Gemini runs did not follow our run protocol: they used the old prompts and ran in Google Antigravity outside our runner. Staff advised us to drop Gemini rather than report it separately. The study now compares three assistants: Claude Code, Codex, and OpenCode (27 sites).
- **No statistical test.** A test would normally be expected, but with three runs per assistant and level it would not be meaningful, and the timeline does not allow a larger study. We will report descriptive results (means and ranges per WCAG criterion) and name the missing test as a limitation in the paper.
- **The focused manual review is approved.** We will review one run per assistant and level. Without Gemini this is 9 sites instead of the 12 we proposed.

## Current Progress

**Site generation.** Claude Code, Codex, and OpenCode each have three runs per level (27 sites). All were made in our Docker runner with the revised zero-shot prompts, with the model and prompt recorded for each run.

**Automated checks.** Our Docker-based tool checks each site with axe-core, Pa11y, and Lighthouse and records the WCAG criterion and the failing element for every issue. A dashboard lists the failing elements by rule, assistant, and level. All 27 sites are checked.

**Preliminary analysis.** Failing elements found by axe-core, mean per run (Lighthouse accessibility score in brackets):

| Assistant | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Claude Code | 30.0 (97) | 0.0 (100) | 0.3 (99) |
| Codex | 80.3 (91) | 74.7 (95) | 8.0 (99) |
| OpenCode | 31.7 (97) | 2.0 (100) | 0.0 (100) |

- **Guidance helps, but the amount it takes differs by assistant.** A general request (Level 2) almost removes the automated issues for Claude Code and OpenCode. Codex improves only with the specific WCAG rules (Level 3).
- **Two WCAG criteria cause most failures.** Text contrast (1.4.3) fails in every Level 1 run of Claude Code and Codex. Label in Name (2.5.3) still fails in all three Codex Level 3 runs.
- **Lighthouse scores hide the differences.** Sites with 74 to 112 failing elements still score 90 to 95, so we report failures by WCAG criterion instead of scores.
- **Automated checks leave a lot undecided.** axe-core marks up to 337 elements per site as "needs review", almost all of them contrast on gradients and images. These need a person to check.

**Manual review.** The review is in progress but not complete.

## Planned Activities

- **Finish the manual review (9 sites).** For each assistant and level we review the run with the median axe-core count, so the sample is typical rather than best or worst. Each review covers keyboard use and a VoiceOver pass, including the states the automated tools do not reach (the open modal, form errors, and the filters), and a sample of the "needs review" contrast items. We use a shared WCAG 2.2 checklist.
- **Compare the tools.** We will compare where axe-core and Pa11y agree and disagree on the same elements.
- **Write the research paper.** Introduction and related work on the accessibility of AI-generated code and on prompting; our method (prompt levels, runner, checks, manual review); results by WCAG criterion, assistant, and level with run-to-run ranges; and a discussion of the findings and the limits of automated checking. The limitations section will cover the small number of runs, the lack of a statistical test, the dropped Gemini condition, and the focused manual review.
