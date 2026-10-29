#!/usr/bin/env bash
# Runs inside the container. Use env/run.sh to start it.
set -euo pipefail

prompt="$(cat /input/prompt.md)"

# Every other input file (for example ACCESSIBILITY.md at Level 3) goes into the workspace.
cp -R /input/. /work/ && rm /work/prompt.md
git -C /work init -q

case "$ASSISTANT" in
  claude)
    cmd=(claude -p "$prompt" --model "$MODEL" --dangerously-skip-permissions
         --strict-mcp-config --output-format stream-json --verbose) ;;
  codex)
    if [[ -f /auth/codex-auth.json ]]; then
      mkdir -p ~/.codex && cp /auth/codex-auth.json ~/.codex/auth.json
    else
      printenv OPENAI_API_KEY | codex login --with-api-key >/dev/null
    fi
    cmd=(codex exec "$prompt" --model "$MODEL" --json
         --dangerously-bypass-approvals-and-sandbox) ;;
  gemini)
    cmd=(gemini -p "$prompt" --model "$MODEL" --yolo --skip-trust --output-format stream-json) ;;
  opencode)
    # Use the same model for session titles, so no other model family runs.
    mkdir -p ~/.config/opencode
    jq -n --arg m "opencode/$MODEL" '{autoupdate: false, share: "disabled", small_model: $m}' \
      > ~/.config/opencode/opencode.json
    cmd=(opencode run "$prompt" --model "opencode/$MODEL" --auto --pure --format json --print-logs) ;;
  *) echo "Unknown assistant: $ASSISTANT" >&2; exit 2 ;;
esac
version="$("$ASSISTANT" --version | head -1)"

start="$(date -u +%FT%TZ)"
status=0
cd /work
"${cmd[@]}" > /out/transcript.jsonl 2> /out/stderr.log &
pid=$!
# The CLIs retry a rate limit (HTTP 429) silently, so the run stalls. Stop it at the first one.
while kill -0 "$pid" 2>/dev/null; do
  if grep -qiE 'usage limit|rate limit|status(code)?.?429' /out/stderr.log; then
    echo "Rate limit reached. Run stopped. Delete the run folder and try again later." >&2
    kill "$pid"; status=75; break
  fi
  sleep 10
done
if [[ $status -eq 0 ]]; then wait "$pid" || status=$?; else wait "$pid" || true; fi
end="$(date -u +%FT%TZ)"

# Keep only what the assistant made: no inputs, git data or installed packages.
excludes=(--exclude=./.git --exclude=node_modules)
for f in /input/*; do excludes+=(--exclude="./$(basename "$f")"); done
mkdir -p /out/site
tar -C /work "${excludes[@]}" -cf - . | tar -C /out/site -xf -

jq -n --arg cli_version "$version" --arg model "$MODEL" \
      --arg start "$start" --arg end "$end" --argjson exit_code "$status" \
      '$ARGS.named' > /out/meta.json
exit "$status"
