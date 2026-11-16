# Milestone Report 2

**Team:** Liza Babior, Braxton Conley, and Khushi Kaushik  
**Project:** Assessing Accessibility Outcomes in AI-Assisted User Interface Development  
**Date:** November 16, 2026

## Current Progress

At Milestone 1 we planned to (1) generate the Claude Code and Gemini sites again with the revised prompts, (2) run the automated checks on all sites, and (3) start the manual keyboard and screen reader review. We finished the first two for three of our four assistants. The manual review is in progress but not complete.

**Site generation.** Claude Code, Codex, and OpenCode each have three runs per level (27 sites), all made in our Docker runner with the revised zero-shot prompts and with the model and prompt recorded. Gemini has four runs per level, but these sites are **not comparable** to the others, because they did not follow our run protocol. Rahat's new Gemini runs (02–04) used the old prompts instead of the revised ones, and ran in Google Antigravity outside our runner, which added its own system message. Run 01 also used the old prompts.

**Automated checks.** We built a Docker-based tool that checks each site with axe-core, Pa11y, and Lighthouse. For every issue it records the WCAG criterion and the failing element. It also has a dashboard that lists the failing elements by rule, assistant, and level. All 39 sites are checked. One Gemini run (L1, run 04) has no valid Pa11y result, because Pa11y failed on all its views.

**Preliminary analysis.** Failing elements found by axe-core, mean per run (Lighthouse accessibility score in brackets):

| Assistant | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Claude Code | 30.0 (97) | 0.0 (100) | 0.3 (99) |
| Codex | 80.3 (91) | 74.7 (95) | 8.0 (99) |
| OpenCode | 31.7 (97) | 2.0 (100) | 0.0 (100) |
| Gemini (old prompts, not comparable) | 36.8 (89) | 50.0 (96) | 10.5 (97) |

- **Guidance helps, but the amount it takes differs by assistant.** A general request (Level 2) almost removes the automated issues for Claude Code and OpenCode. Codex improves only with the specific WCAG rules (Level 3).
- **Two WCAG criteria cause most failures.** Text contrast (1.4.3) fails in every Level 1 run of Claude Code and Codex. Label in Name (2.5.3) still fails in all three Codex Level 3 runs.
- **Lighthouse scores hide the differences.** Sites with 74 to 123 failing elements still have mean scores of 90 to 95, so we will report failures by WCAG criterion instead of scores.
- **Automated checks leave a lot undecided.** axe-core marks up to 337 elements per site as "needs review", almost all of them contrast on gradients and images. These need a person to check.

## Planned Activities

- **Redo the Gemini runs.** Rahat needs to generate the Gemini runs again in our runner with the revised prompts, three runs per level, as our run protocol requires. If Gemini cannot run in the runner, we will report it separately as an exploratory result.
- **Finish the manual review, with a focused scope.** We will review one run per assistant and level (12 sites) instead of all sites. Each review covers keyboard use and a VoiceOver pass on the states the automated tools do not reach (the open modal, form errors, and the filters), and a sample of the "needs review" contrast items, with a shared WCAG 2.2 checklist.
- **Compare the tools.** We will compare where axe-core and Pa11y agree and disagree on the same elements.
- **Write the research paper.** Introduction and related work on accessibility of AI-generated code and on prompting, our method (prompt levels, runner, checks, manual review), results by WCAG criterion, assistant, and level with run-to-run ranges, and a discussion of the findings and of the limits of automated checking.

## Desired Feedback

1. If Gemini cannot run in our runner, is it acceptable to report it as a separate exploratory result, or should we drop it from the comparison?
2. With three runs per assistant and level and a large run-to-run variance, are descriptive results (means and ranges per WCAG criterion) enough, or would you expect a statistical test?
3. Is it acceptable to scope the manual review down to one run per assistant and level (12 sites)? If so, how should we present this choice in the final paper?
