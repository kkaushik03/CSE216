#!/usr/bin/env bash
# Generate one website in a new, clean container.
# Usage: env/run.sh <claude|codex|gemini|opencode> <level 1-3> <run number>
set -euo pipefail

assistant="${1:?assistant}"; level="${2:?level}"; run="$(printf '%02d' "${3:?run number}")"
root="$(cd "$(dirname "$0")/.." && pwd)"
image="cse216-gen:latest"
input="$root/prompts/L$level"

[[ -f "$input/prompt.md" ]] || { echo "No prompt for level $level: $input/prompt.md" >&2; exit 2; }
[[ -f "$root/.env" ]] || { echo "Missing .env. Copy env/.env.example to .env and fill it in." >&2; exit 2; }
set -a; source "$root/.env"; set +a

model_var="$(echo "$assistant" | tr a-z A-Z)_MODEL"
model="${!model_var:-}"
[[ -n "$model" ]] || { echo "Set $model_var in .env." >&2; exit 2; }

out="$root/results/$assistant/L$level/run-$run"
[[ ! -e "$out" ]] || { echo "$out exists. Use a new run number." >&2; exit 2; }

docker build -q -t "$image" "$root/env" >/dev/null
mkdir -p "$out"
cp -R "$input" "$out/input"   # Exact inputs of this run.

# Mount only this level's inputs. The container cannot see your home folder or the repo.
mounts=(-v "$input:/input:ro" -v "$out:/out")
[[ "$assistant" == codex && -n "${CODEX_AUTH_FILE:-}" ]] && mounts+=(-v "$CODEX_AUTH_FILE:/auth/codex-auth.json:ro")

# Pass only the keys that are set. An empty key can block another login method.
secrets=()
for v in ANTHROPIC_API_KEY CLAUDE_CODE_OAUTH_TOKEN OPENAI_API_KEY GEMINI_API_KEY; do
  if [[ -n "${!v:-}" ]]; then secrets+=(-e "$v"); fi
done

status=0
docker run --rm "${mounts[@]}" -e ASSISTANT="$assistant" -e MODEL="$model" \
  ${secrets[@]+"${secrets[@]}"} -e DISABLE_AUTOUPDATER=1 "$image" || status=$?
echo "Exit code: $status. Output: ${out#$root/}"
exit "$status"
