# Run notes

Write one line for each failed or unusual run.

| Assistant | Level | Run | Date | Note |
|---|---|---|---|---|
| claude | 1 | 01 | 2026-10-22 | Manual run by Khushi, not in env/run.sh. No meta.json: model and CLI version unknown. `prompt.md` is the prompt used. May need a rerun in the runner. |
| claude | 2 | 01 | 2026-10-22 | Manual run by Khushi, not in env/run.sh. No meta.json: model and CLI version unknown. `prompt.md` is the prompt used. May need a rerun in the runner. |
| claude | 3 | 01 | 2026-10-22 | Manual run by Khushi, not in env/run.sh. No meta.json: model and CLI version unknown. `prompt.md` is the prompt used. May need a rerun in the runner. |
| claude | 1 | 01 | 2026-10-22 | Manual chat-app build moved to results/claude/chat-app/L1 (outside the runner, not part of the comparison). Level redone in env/run.sh as run 03. |
| claude | 2 | 01 | 2026-10-22 | Manual chat-app build moved to results/claude/chat-app/L2 (outside the runner, not part of the comparison). Level redone in env/run.sh starting at run 01. |
| claude | 3 | 01 | 2026-10-22 | Manual chat-app build moved to results/claude/chat-app/L3 (outside the runner, not part of the comparison). Level redone in env/run.sh starting at run 01. |
| claude | 2 | 01 | 2026-10-22 | Failed (exit 1): invalid API key, 401. Subscription token was in ANTHROPIC_API_KEY instead of CLAUDE_CODE_OAUTH_TOKEN. Setup error, no output. Redone as run 02. |
| claude | 3 | 01 | 2026-10-22 | Failed (exit 1): invalid API key, 401. Subscription token was in ANTHROPIC_API_KEY instead of CLAUDE_CODE_OAUTH_TOKEN. Setup error, no output. Redone as run 02. |
| claude | 2-3 | 01 | 2026-10-22 | Failed setup runs (L2 run 01, L3 run 01) moved to results/claude/claude-failed-runs/ as L<level>-run-<NN>. The valid runs reuse run number 01. |
| claude | 3 | 02 | 2026-10-22 | Failed (exit 1) after 7 min: subscription session limit (429). Partial site generated. Moved to results/claude/claude-failed-runs/L3-run-02; valid run reuses run number 02. |
