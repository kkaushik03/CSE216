# Milestone Report 1 (Revised)

**Team:** Liza Babior, Braxton Conley, Khushi Kaushik, and Rahat Bhatia  
**Project:** Assessing Accessibility Outcomes in AI-Assisted User Interface Development  
**Initial report:** October 23, 2026 · **Revised:** November 5, 2026

## What Changed After the Meeting

- **Feedback:** base our prompts on prompt-engineering best practices and prior research, and name the prompting technique each prompt uses.
- **Change:** we rewrote the prompts for all three levels to follow published prompting guidance.
- **Effect on the plan:** sites made with the old prompts (Claude Code and Gemini) must be generated again.

## Current Progress

We compare three prompt conditions for AI coding assistants: no accessibility guidance (Level 1), a general request for accessibility (Level 2), and specific WCAG requirements (Level 3). We assess the generated websites with automated checkers and a manual keyboard and screen reader review.

**Prompt revision.** We based the new prompts on the prompting guides of OpenAI, Anthropic, and Google and the Prompt Engineering Guide. All three levels are *zero-shot* prompts: they describe the task without worked examples. Each run is *single-turn*: the assistant gets the prompt once and works with no reply from us. The main changes:

- **Same structure at every level.** All prompts use the same sections (Task, Pages, Features, Design, Technology and output, How to work). Levels 2 and 3 add an Accessibility section, so the levels differ only there.
- **Clear finish line.** The assistant makes its own choices instead of asking questions. "Done" means all four pages are reachable and there are no JavaScript errors.
- **Fixed output.** Plain HTML, CSS, and JavaScript with `index.html` as the start page, so every site has the same layout for our checkers.
- **Precise Level 3 rules.** The old Level 3 list had vague items such as "Sufficient color contrast". Level 3 now requires WCAG 2.2 AA and gives the assistant a rules file based on WCAG 2.2 and the W3C WAI-ARIA Authoring Practices.

We did not use examples (*few-shot* prompting) or a role such as "You are an accessibility expert", because both would add accessibility guidance to Level 1.

**Runs.** We replaced GitHub Copilot with OpenCode on DeepSeek, because Copilot and Codex used the same model in our setup. Codex and OpenCode have three runs per level with the revised prompts. The recorded prompt versions show that all Claude Code runs and the Gemini runs used the old prompts.

## Planned Activities

- **Generate again.** Three new runs per level for Claude Code and Gemini with the revised prompts. The old runs stay in the repository but are not part of the comparison.
- **Automated checks.** We have run axe-core, Pa11y, and Lighthouse on the current sites. We will run them again after the new runs.
- **Manual review.** Start the keyboard and screen reader review with a shared WCAG 2.2 checklist, including states the automated checks miss, such as the open modal and form errors.
