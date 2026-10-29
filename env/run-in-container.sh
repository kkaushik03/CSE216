#!/usr/bin/env bash
# Runs inside the container. Do not call it directly: use env/run.sh.
# Inputs: $ASSISTANT, $MODEL, $LEVEL, /input/prompt.md.
# Output: /out/site/, /out/transcript.jsonl, /out/meta.json.
set -euo pipefail

prompt="$(cat /input/prompt.md)"

git -C /work init -q

case "$ASSISTANT" in
  claude)
    version="$(claude --version)"
    cmd=(claude -p "$prompt" --model "$MODEL" --dangerously-skip-permissions
         --strict-mcp-config --output-format stream-json --verbose) ;;
  codex)
    version="$(codex --version)"
    if [[ -f /input/codex-auth.json ]]; then
      mkdir -p ~/.codex && cp /input/codex-auth.json ~/.codex/auth.json
    else
      printenv OPENAI_API_KEY | codex login --with-api-key >/dev/null
    fi
    cmd=(codex exec "$prompt" --model "$MODEL" --json --skip-git-repo-check
         --dangerously-bypass-approvals-and-sandbox) ;;
  gemini)
    version="$(gemini --version)"
    cmd=(gemini -p "$prompt" --model "$MODEL" --yolo --skip-trust --output-format stream-json) ;;
  opencode)
    version="$(opencode --version)"
    # Use the same model for session titles, so no other model family runs.
    mkdir -p ~/.config/opencode
    jq -n --arg m "opencode/$MODEL" \
      '{autoupdate: false, share: "disabled", model: $m, small_model: $m}' \
      > ~/.config/opencode/opencode.json
    cmd=(opencode run "$prompt" --model "opencode/$MODEL" --auto --pure --format json) ;;
  *) echo "Unknown assistant: $ASSISTANT" >&2; exit 2 ;;
esac

start="$(date -u +%FT%TZ)"
set +e
(cd /work && "${cmd[@]}") > /out/transcript.jsonl 2> /out/stderr.log
status=$?
set -e
end="$(date -u +%FT%TZ)"

# Keep the generated site. Drop git data and installed packages (reinstall them from the lockfile).
mkdir -p /out/site
tar -C /work --exclude=.git --exclude=node_modules -cf - . | tar -C /out/site -xf -

jq -n --arg assistant "$ASSISTANT" --arg cli_version "$version" --arg model "$MODEL" \
      --argjson level "$LEVEL" --arg run "$RUN" --arg runner "$RUNNER" \
      --arg arch "$(uname -m)" --arg repo_commit "$REPO_COMMIT" --arg prompt_sha256 "$PROMPT_SHA" \
      --arg start "$start" --arg end "$end" --argjson exit_code "$status" \
      '$ARGS.named' > /out/meta.json
echo "Exit code: $status. Output: results/$ASSISTANT/L$LEVEL/run-$RUN"
exit "$status"
