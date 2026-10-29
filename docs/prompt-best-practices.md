
## 1. Structure tips

- **S1.** A prompt can have four elements: instruction, context, input data, output indicator. Not every prompt needs all four. — https://www.promptingguide.ai/introduction/elements
- **S2.** Put the instruction at the start, and separate it from the context with a clear separator such as `###`. — https://www.promptingguide.ai/introduction/tips
- **S3.** Use Markdown headers and lists to mark the sections of a prompt. Use XML tags to mark where content starts and ends. — https://developers.openai.com/api/docs/guides/prompt-engineering
- **S4.** Use XML tags or Markdown headings, but choose one format and use it consistently in one prompt. — https://ai.google.dev/gemini-api/docs/prompting-strategies
- **S5.** *(Claude-specific)* XML tags such as `<instructions>`, `<context>` help Claude parse prompts that mix instructions, context and data. — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- **S6.** Use numbered lists or bullets when the order or completeness of steps matters. — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- **S7.** Recommended order for a complex prompt: task context, tone, detailed task and rules, examples, input data, then the immediate task at the end. Not every prompt needs every element. — Anthropic prompt engineering tutorial, Chapter 9: https://github.com/anthropics/courses/tree/master/prompt_engineering_interactive_tutorial (repo archived on 2026-09-15)
- **S8.** Order developer messages as identity, instructions, examples, context. — https://developers.openai.com/api/docs/guides/prompt-engineering
- **S9.** Put long context first and the specific question or instruction at the end. — https://ai.google.dev/gemini-api/docs/prompting-strategies and https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices ("Long context prompting", for 20k+ token inputs)
- **S10.** Put long input variables before the directions about them. — Anthropic metaprompt: https://github.com/anthropics/claude-cookbooks/blob/main/misc/metaprompt.ipynb
- **S11.** A structured spec with clear sections makes instructions easy to refer to. — https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide

Note on S2/S8/S9: they disagree on where the instruction goes. They agree on clear sections. Our prompt is short (no long context), so S9 matters little.

---

## 2. Content tips

- **C1.** Be specific and direct. More descriptive prompts give better results. Do not get "too clever" with wording. — https://www.promptingguide.ai/introduction/tips
- **C2.** Replace vague words with precise ones (for example, a number instead of "short"). — https://www.promptingguide.ai/introduction/tips
- **C3.** Say what to do, not what not to do. — https://www.promptingguide.ai/introduction/tips and https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- **C4.** Golden rule: show the prompt to a colleague with little context. If they are confused, the model is too. — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices and Anthropic tutorial Chapter 2
- **C5.** Give the reason behind an instruction. The model can generalize from it. — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- **C6.** Specify output format and constraints. — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices and https://ai.google.dev/gemini-api/docs/prompting-strategies
- **C7.** Give the model the information it needs. Do not assume it has it. — https://ai.google.dev/gemini-api/docs/prompting-strategies
- **C8.** Contradictory or vague instructions hurt GPT-5 more than other models. Check prompts for conflicts. — https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide
- **C9.** *(Claude Sonnet 5)* The model follows prompts literally. It does not apply an instruction from one item to another. State the scope ("every section, not just the first one"). — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5
- **C10.** *(Claude Sonnet 5)* For single-turn autonomous coding agents, give the task, intent and constraints up front in the first turn. — same page, "Interactive coding products"
- **C11.** *(Codex)* For evals, turn up autonomy or ask for a "non-interactive" mode. Default to reasonable assumptions; do not end the turn with questions unless truly blocked. — https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide
- **C12.** *(Codex)* "Finish the website or app to completion ... It should be in a working state for a user to run and test." Make sure the page loads on desktop and mobile. — same page
- **C13.** Give the agent a check that comes back pass or fail, and say what "done" looks like. — https://code.claude.com/docs/en/best-practices ("Give Claude a check to run", "Write a specific prompt")
- **C14.** Prompt wording is not a guarantee. If a rule must always hold, enforce it outside the prompt. — https://code.claude.com/docs/en/best-practices ("Deterministic and non-deterministic instructions"); same idea in your notes (section 1)
- **C15.** *(Claude Code)* `be ambitious` widens scope; Claude otherwise builds the smallest thing that satisfies the request. — https://code.claude.com/docs/en/best-practices
- **C16.** Reasoning models do well with high-level goals; GPT (non-reasoning) models need explicit instructions. — https://developers.openai.com/api/docs/guides/prompt-engineering
- **C17.** Gemini 3: be concise, precise and direct; avoid overly persuasive language. — https://ai.google.dev/gemini-api/docs/prompting-strategies and https://ai.google.dev/gemini-api/docs/gemini-3 (page marked deprecated)
- **C18.** Verify generated code; models can omit details such as imports. — https://www.promptingguide.ai/applications/coding
- **C19.** *(Claude, Codex)* Without guidance, models fall into generic "AI slop" front-end design. Both vendors give a front-end aesthetics block. — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices and https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide
- **C20.** Examples (few-shot) are a reliable way to steer format. Google recommends them "always". — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices and https://ai.google.dev/gemini-api/docs/prompting-strategies
- **C21.** Start simple and iterate; test each prompt change with evals. — https://www.promptingguide.ai/introduction/tips, https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide, Anthropic metaprompt notebook

---

## 3. Suggested updates to our prompts

### All levels

- **Run without questions.** Add: "Work without asking questions. If something is unclear, make a reasonable choice and continue." Why: each run is one shot with no human reply. Codex and Claude give this advice for single-turn agents (C10, C11).
- **Say what "done" means.** Add: "Finish the full application in this run. All four pages are reachable from the navigation bar, and there are no JavaScript errors in the console." Why: agents work better with a clear finish line (C12, C13).
- **Fix the output.** Replace the last line with: "Use plain HTML, CSS and JavaScript with no build step. Put all files in the current folder. The start page is `index.html`." Why: every run then has the same layout for the checkers (C6). Open question for the group: also forbid external libraries? A UI library can add or remove accessibility features by itself.
- **Say where the data comes from.** Add: "Use sample data stored in JavaScript (about 10–20 courses). There is no backend." Why: today each agent fills this gap in a different way (C7, C8).
- **Group the design items.** Move "Responsive design" and "Make the page colorful" into a short Design list, and change the second item to "Use a colorful design on all pages". Why: they are qualities, not components, and "the page" can be read as one page only (C9, S6). Add no words about contrast.
- **Use Markdown headings.** Use the same sections in all levels: Task, Pages, Features, Design, Technology and output, How to work. Why: Markdown works for all four vendors; XML tags are mainly a Claude tip (S3, S4, S5).

Sketch of the updated shared brief (L1):

```markdown
## Task
Create a responsive web application for a university course registration system.

## Pages
- Home page
- Course catalog page
- Registration page
- Student profile page

## Features
- Navigation bar
- Search functionality
- Filter dropdowns
- Course cards
- Registration form
- Confirmation modal
- Data table showing registered courses

## Design
- Responsive design
- Use a colorful design on all pages

## Technology and output
- Use plain HTML, CSS and JavaScript with no build step.
- Put all files in the current folder. The start page is `index.html`.
- Use sample data stored in JavaScript (about 10–20 courses). There is no backend.

## How to work
- Work without asking questions. If something is unclear, make a reasonable choice and continue.
- Finish the full application in this run. All four pages are reachable from the navigation bar, and there are no JavaScript errors in the console.
```

### Level 1

No changes other than the shared brief. L1 must not get any accessibility words.

### Level 2

- **Put the accessibility line in its own section.** Add `## Accessibility` before `## Technology and output`, with the current sentence. Why: the same place as in L3, so only the content differs (S4).
- **State the scope.** Add: "This applies to every page, component and state." Why: models follow instructions literally and may apply them to one part only (C9).

### Level 3

- **Same section and sentences as Level 2.** Level 3 adds to Level 2, so each level adds exactly one thing.
- **Replace the 12-item WCAG list with a skill file.** Add: "The application must meet WCAG 2.2 Level AA. Before you write any code, read `ACCESSIBILITY.md` in the current folder. Apply every rule in it." The runner copies `prompts/L3/ACCESSIBILITY.md` into the empty workspace. Why: the list was short and vague ("Sufficient color contrast"). The skill gives precise, checkable rules (C1, C2, C4), and every tool can read a file, so the delivery is the same for all four vendors.
- **About the skill.** It is our own file, adapted from the GitHub awesome-copilot accessibility instructions and Addy Osmani's web-quality-skills (both MIT), the W3C WAI-ARIA Authoring Practices and WCAG 2.2. It tells the agent how to build each part. It has no audit or test steps. We wrote it with the writing-for-agents guidelines: target behavior instead of prohibitions, one goal line ("done when every rule holds"), one place for each rule.

---

## 4. Do not apply

- **Examples (few-shot), C20.** Any HTML example shows markup patterns such as labels and headings, and they leak into L1.
- **Plan first, ask me questions, write `spec.md`, pick a visual direction.** Each needs a human reply, but our runs are one shot. Sources: your `Prompt Templates.md`; https://code.claude.com/docs/en/best-practices; https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5
- **Vendor-specific blocks:** XML tags (S5), "be ambitious" (C15), front-end aesthetics blocks (C19), persistence and self-reflection blocks (https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide). They are written for one vendor. Also, aesthetics blocks change colors, which affects contrast, and "be ambitious" can add accessibility work to L1.
- **A role, such as "You are a senior front-end engineer".** An accessibility role leaks into L1. A neutral role can change the quality by a different amount for each model.
- **Tuning the prompt per model (metaprompt, DSPy), C21.** Each model then gets a different prompt. Use these tools only to test the shared prompt before the runs.
- **Effort, reasoning and temperature settings.** These are run settings, not prompt text. Record them in the run notes.
- **A reason in L2, such as "so that people with disabilities can use it", C5.** It moves L2 toward L3. L2 must stay a general request.
