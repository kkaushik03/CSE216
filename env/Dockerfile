# One image for all generation runs. Pin every version, so all teammates get the same toolchain.
# Multi-arch digest: works on Apple Silicon and x86.
FROM node:22-bookworm-slim@sha256:de170b39439eb0e5a3444ad7d60b015614a381e10fecae2e30ec9e735122f38d

RUN apt-get update \
 && apt-get install -y --no-install-recommends git ca-certificates curl python3 jq \
 && rm -rf /var/lib/apt/lists/*

ARG CLAUDE_CODE_VERSION=2.1.308
ARG CODEX_VERSION=0.163.0
ARG GEMINI_CLI_VERSION=0.65.0
ARG COPILOT_CLI_VERSION=1.0.103
RUN npm install -g \
      @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION} \
      @openai/codex@${CODEX_VERSION} \
      @google/gemini-cli@${GEMINI_CLI_VERSION} \
      @github/copilot@${COPILOT_CLI_VERSION} \
 && npm cache clean --force

# Non-root user (Claude Code refuses to skip permissions as root).
# Home starts empty: no user rules, skills, memory or MCP servers.
USER node
WORKDIR /work
COPY --chown=node:node run-in-container.sh /usr/local/bin/run-in-container.sh
ENTRYPOINT ["/usr/local/bin/run-in-container.sh"]
