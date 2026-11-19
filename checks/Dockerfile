# One image for all accessibility checks. Pin every npm version, so all teammates get the same checkers.
FROM node:22-bookworm-slim@sha256:de170b39439eb0e5a3444ad7d60b015614a381e10fecae2e30ec9e735122f38d

# Debian Chromium works on Apple Silicon and x86. Its version goes into each report.
# Java runs the Nu HTML Checker (vnu.jar).
RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium fonts-liberation fonts-noto-color-emoji openjdk-17-jre-headless \
 && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_DOWNLOAD=1 CHROME_PATH=/usr/bin/chromium
WORKDIR /checks
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
# HTML_CodeSniffer bug: its image rule writes to an undeclared global "elements". A site with its own
# global "const elements" makes Pa11y fail ("Assignment to constant variable"). Make it local (2 places).
RUN f=node_modules/@pa11y/html_codesniffer/build/HTMLCS.js \
 && [ "$(grep -o '};elements=HTMLCS.util.getAllElements' $f | wc -l)" = 2 ] \
 && sed -i 's/};elements=HTMLCS.util.getAllElements/};var elements=HTMLCS.util.getAllElements/g' $f
COPY check.mjs ./

USER node
ENTRYPOINT ["node", "/checks/check.mjs"]
