#!/usr/bin/env bash
# Make an empty manual review file for each run of one assistant.
# Usage: checks/manual-init.sh <claude|codex|gemini|opencode> "<your name>"
set -euo pipefail
assistant="${1:?assistant}"; reviewer="${2:?your name}"
root="$(cd "$(dirname "$0")/.." && pwd)"
for run in "$root"/results/"$assistant"/L*/run-*; do
  [[ -f "$run/site/index.html" ]] || continue
  out="$run/manual-review.csv"
  if [[ -e "$out" ]]; then echo "keep   ${out#$root/} (exists)"; continue; fi
  # Columns: the check list, then the columns you fill in.
  {
    echo "check,area,wcag,title,result,note,evidence,reviewer"
    tail -n +2 "$root/checks/manual-checklist.csv" | sed "s/\$/,,,,$reviewer/"
  } > "$out"
  mkdir -p "$run/manual-img"
  echo "made   ${out#$root/}"
done
