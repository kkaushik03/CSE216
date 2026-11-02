#!/usr/bin/env bash
# Run the accessibility checks on generated sites, in a container.
# Usage: checks/run.sh [run folder ...]   (no argument: all results/<assistant>/L<level>/run-<NN>)
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
image="cse216-checks:latest"
docker build -q -t "$image" "$root/checks" >/dev/null
runs=()
for r in "$@"; do runs+=("/results/${r#*results/}"); done
docker run --rm --init -v "$root/results:/results" "$image" ${runs[@]+"${runs[@]}"}
