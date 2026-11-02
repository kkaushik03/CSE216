# One image for all accessibility checks. Pin every npm version, so all teammates get the same checkers.
FROM node:22-bookworm-slim@sha256:de170b39439eb0e5a3444ad7d60b015614a381e10fecae2e30ec9e735122f38d

# Debian Chromium works on Apple Silicon and x86. Its version goes into each report.
RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium fonts-liberation fonts-noto-color-emoji \
 && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_DOWNLOAD=1 CHROME_PATH=/usr/bin/chromium
WORKDIR /checks
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY check.mjs ./

USER node
ENTRYPOINT ["node", "/checks/check.mjs"]
