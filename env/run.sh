#!/usr/bin/env bash
# Generate one website in a new, clean container.
# Usage: env/run.sh <claude|codex|gemini|copilot> <level 1-3> <run number>
set -euo pipefail

assistant="${1:?assistant}"; level="${2:?level}"; run="$(printf '%02d' "${3:?run number}")"
root="$(cd "$(dirname "$0")/.." && pwd)"
image="cse216-gen:latest"

[[ "$level" =~ ^[123]$ ]] || { echo "Level must be 1, 2 or 3." >&2; exit 2; }
[[ -f "$root/.env" ]] || { echo "Missing .env. Copy env/.env.example to .env and fill it in." >&2; exit 2; }
set -a; source "$root/.env"; set +a

model_var="$(echo "$assistant" | tr a-z A-Z)_MODEL"
model="${!model_var:-}"
[[ -n "$model" ]] || { echo "Set $model_var in .env." >&2; exit 2; }

out="$root/results/$assistant/L$level/run-$run"
[[ ! -e "$out" ]] || { echo "$out exists. Use a new run number." >&2; exit 2; }

if [[ -n "$(git -C "$root" status --porcelain -- prompts env)" ]]; then
  echo "prompts/ or env/ has uncommitted changes. Commit or revert them first." >&2; exit 2
fi

docker build -q -t "$image" "$root/env" >/dev/null
mkdir -p "$out"

# Mount only the prompt for this level. The container cannot see your home folder or the repo.
mounts=(-v "$root/prompts/L$level.md:/input/prompt.md:ro" -v "$out:/out")
[[ "$assistant" == codex && -n "${CODEX_AUTH_FILE:-}" ]] && mounts+=(-v "$CODEX_AUTH_FILE:/input/codex-auth.json:ro")

# Pass only the keys that are set. An empty key can block another login method.
secrets=()
for v in ANTHROPIC_API_KEY CLAUDE_CODE_OAUTH_TOKEN OPENAI_API_KEY GEMINI_API_KEY COPILOT_GITHUB_TOKEN; do
  if [[ -n "${!v:-}" ]]; then secrets+=(-e "$v"); fi
done

prompt_sha="$(shasum -a 256 "$root/prompts/L$level.md" | cut -d' ' -f1)"

docker run --rm "${mounts[@]}" \
  -e ASSISTANT="$assistant" -e MODEL="$model" -e LEVEL="$level" -e RUN="$run" \
  -e RUNNER="$(git -C "$root" config user.name)" \
  -e REPO_COMMIT="$(git -C "$root" rev-parse HEAD 2>/dev/null || echo none)" \
  -e PROMPT_SHA="$prompt_sha" \
  ${secrets[@]+"${secrets[@]}"} -e DISABLE_AUTOUPDATER=1 \
  "$image"
