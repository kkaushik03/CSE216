# How to do a generation run

Each run makes one website in a new, clean Docker container. The container does not see your home folder, your settings, your skills or your memory. All teammates use the same pinned image.

## Before your first run

1. Install Docker Desktop and start it.
2. Clone the repo:
   ```sh
   git clone git@github.com:kkaushik03/CSE216.git && cd CSE216
   ```
3. Copy the settings file:
   ```sh
   cp env/.env.example .env
   ```
4. In `.env`, set the model for your assistant. Use the model that the group agreed on.
5. In `.env`, set your login for your assistant:

   | Assistant | Owner | Login |
   |---|---|---|
   | `claude` | Khushi | Run `claude setup-token` on your computer. Put the token in `CLAUDE_CODE_OAUTH_TOKEN`. Or set `ANTHROPIC_API_KEY`. |
   | `codex` | Braxton | Run `codex login` on your computer. Set `CODEX_AUTH_FILE=~/.codex/auth.json`. Or set `OPENAI_API_KEY`. |
   | `gemini` | Rahat | Get a key at https://aistudio.google.com/apikey. Put it in `GEMINI_API_KEY`. |
   | `opencode` | Liza | No login. The free model needs no key. |

Do not commit `.env`. Git ignores it.

## Do a run

```sh
env/run.sh <assistant> <level> <run number>
```

Example: OpenCode, Level 2, first run:

```sh
env/run.sh opencode 2 1
```

The first run builds the image. This takes some minutes.

The runner stops if the output folder already exists. Use a new run number.

The container gets only the files in `prompts/L<level>/`. It sends `prompt.md` to the assistant and puts every other file in that folder (for example `ACCESSIBILITY.md` at Level 3) into the empty workspace.

## Output

The runner writes to `results/<assistant>/L<level>/run-<NN>/`:

| File | Content |
|---|---|
| `input/` | A copy of `prompts/L<level>/`: the exact prompt and files of this run. |
| `site/` | The generated website, without the input files, `.git` and `node_modules`. |
| `transcript.jsonl` | Full log of the assistant session. |
| `stderr.log` | Errors from the assistant CLI. |
| `meta.json` | CLI version, model, start and end time, exit code. |

## Push your results

1. Look at `meta.json`. Make sure that `exit_code` is `0`.
2. If the run failed, keep the folder. Write the cause in `results/NOTES.md`. Do the run again with a new run number.
3. Commit and push:
   ```sh
   git pull --rebase
   git add results/<assistant>
   git commit -m "results: <assistant> L<level> run <NN>"
   git push
   ```

Each person writes only to `results/<their assistant>/`. This prevents merge conflicts.

## Rules for a fair comparison

- Do not change a run. Do not fix the generated code.
- Do not use your assistant outside the runner for this project.
- Do not change files in `env/` or `prompts/` without agreement from the group.
