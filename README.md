# CSE 216 Final Project: Accessibility of UIs built with AI coding assistants

We give the same website prompt to four AI coding assistants at three levels of guidance. Then we check the accessibility of each website with automated checkers and a manual review.

| Level | Guidance |
|---|---|
| 1 | The prompt does not mention accessibility. |
| 2 | The prompt asks for an accessible UI. |
| 3 | The prompt lists strict WCAG 2.2 AA requirements. |

| Assistant | Model | Owner |
|---|---|---|
| Codex | gpt-6-luna | Braxton |
| OpenCode | deepseek-v4.1-flash-free | Liza |
| Claude Code | claude-opus-5-5 | Khushi |
| Gemini CLI | Gemini 3.8 Flash | Rahat |

## Repo structure

```
prompts/   One folder per level: prompt.md, plus ACCESSIBILITY.md at Level 3
env/       Docker image and runner for the generation runs
checks/    Docker image and script for the automated accessibility checks
docs/      How-to documents
results/   Output of each run: results/<assistant>/L<level>/run-<NN>/
```

## Start here

Read [docs/running.md](docs/running.md). To check the sites, read [docs/checks.md](docs/checks.md).
