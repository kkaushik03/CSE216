// Check each generated site with axe-core, Pa11y and Lighthouse. Runs inside the container (see checks/run.sh).
// A "view" is the start page, or the state after a click on one navigation item.
// This covers sites with one HTML file per page and single-page apps.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';
import pa11y from 'pa11y';
import { startFlow } from 'lighthouse';

const RESULTS = '/results';
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const NAV = 'nav a[href], nav button, [role="navigation"] a[href], [role="navigation"] button';
const MAX_VIEWS = 8;
const VIEWPORT = { width: 1280, height: 800 };
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };

const version = (pkg) => JSON.parse(fs.readFileSync(`/checks/node_modules/${pkg}/package.json`)).version;

// Serve one site folder on a free local port.
function serve(dir) {
  const server = http.createServer((req, res) => {
    let file = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (file.endsWith('/')) file += 'index.html';
    if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

// Open a view in a new, clean browser context (no localStorage from an earlier view).
async function open(browser, base, view) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport(VIEWPORT);
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle0' });
  if (view.nav !== null) {
    const items = await page.$$(NAV);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 3000 }).catch(() => {}),
      items[view.nav].click(),
    ]);
  }
  await new Promise((r) => setTimeout(r, 500));
  return { page, close: () => context.close() };
}

// Same visible text: same view, even at a different URL (for example, index.html and #home).
const viewKey = (page) => page.evaluate(() => document.body.innerText);

async function findViews(browser, base) {
  const home = { name: 'home', nav: null };
  const first = await open(browser, base, home);
  const items = await first.page.$$eval(NAV, (els) => els.map((e) => ({
    name: (e.textContent.trim() || e.getAttribute('aria-label') || '').replace(/\s+/g, ' '),
    visible: e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden',
  })));
  const views = [{ ...home, url: first.page.url() }];
  const seen = new Set([await viewKey(first.page)]);
  await first.close();
  for (const [i, item] of items.entries()) {
    if (!item.visible || views.length >= MAX_VIEWS) continue;
    const view = { name: item.name, nav: i };
    const { page, close } = await open(browser, base, view).catch(() => ({}));
    if (!page) continue;
    const key = await viewKey(page);
    if (page.url().startsWith(base) && !seen.has(key)) { seen.add(key); views.push({ ...view, url: page.url() }); }
    await close();
  }
  return views;
}

// Group issues by rule: [{ rule, impact, count }].
const byRule = (list) => Object.values(list.reduce((acc, { rule, impact }) => {
  acc[rule] ??= { rule, impact, count: 0 };
  acc[rule].count += 1;
  return acc;
}, {}));

const TOOLS = {
  async axe(page) {
    const r = await new AxePuppeteer(page).withTags(WCAG_TAGS).analyze();
    return { issues: r.violations.map((v) => ({ rule: v.id, impact: v.impact, count: v.nodes.length })) };
  },
  async pa11y(page, browser) {
    const r = await pa11y(page.url(), { browser, page, ignoreUrl: true, standard: 'WCAG2AA', runners: ['htmlcs'] });
    // HTML_CodeSniffer reads single-page-app routes (href="#/catalog") as links to a missing id. Not a real issue.
    const route = (i) => i.code.endsWith('.NoSuchID') && /href="#\//.test(i.context);
    return { issues: byRule(r.issues.filter((i) => !route(i)).map((i) => ({ rule: i.code, impact: i.type }))),
      ignored_route_links: r.issues.filter(route).length };
  },
  async lighthouse(page) {
    const flow = await startFlow(page, { config: { extends: 'lighthouse:default', settings: {
      onlyCategories: ['accessibility'], formFactor: 'desktop', screenEmulation: { disabled: true } } } });
    await flow.snapshot();
    const { lhr } = (await flow.createFlowResult()).steps[0];
    const failed = Object.values(lhr.audits).filter((a) => a.score === 0 && a.scoreDisplayMode === 'binary');
    return { score: Math.round(lhr.categories.accessibility.score * 100),
      issues: failed.map((a) => ({ rule: a.id, count: a.details?.items?.length ?? 1 })) };
  },
};

async function checkRun(browser, runDir) {
  const site = path.join(runDir, 'site');
  const server = await serve(site);
  const base = `http://127.0.0.1:${server.address().port}`;
  const report = { checked: new Date().toISOString(), tools: {
    chromium: await browser.version(), 'axe-core': version('axe-core'), pa11y: version('pa11y'), lighthouse: version('lighthouse') },
    views: [] };
  try {
    for (const view of await findViews(browser, base)) {
      const entry = { name: view.name, url: view.url.replace(base, '') };
      // Each tool gets its own fresh view, so one tool's injected scripts cannot change another tool's result.
      for (const [tool, run] of Object.entries(TOOLS)) {
        const { page, close } = await open(browser, base, view);
        entry[tool] = await run(page, browser).catch((e) => ({ error: String(e.message ?? e).slice(0, 300) }));
        await close();
      }
      report.views.push(entry);
    }
  } finally {
    server.close();
  }
  fs.writeFileSync(path.join(runDir, 'checks.json'), JSON.stringify(report, null, 2) + '\n');
  return report;
}

const allRuns = () => fs.readdirSync(RESULTS).flatMap((a) =>
  fs.existsSync(path.join(RESULTS, a)) && fs.statSync(path.join(RESULTS, a)).isDirectory()
    ? fs.readdirSync(path.join(RESULTS, a)).filter((l) => /^L\d$/.test(l)).flatMap((l) =>
      fs.readdirSync(path.join(RESULTS, a, l)).filter((r) => /^run-\d+$/.test(r)).map((r) => path.join(RESULTS, a, l, r)))
    : []);

// One row per run, from every checks.json found. Issue counts add up over all views.
function writeSummary() {
  const sum = (views, tool, pick = () => true) => views.reduce((n, v) =>
    n + (v[tool]?.issues ?? []).filter(pick).reduce((m, i) => m + i.count, 0), 0);
  const rules = (views, tool) => new Set(views.flatMap((v) => (v[tool]?.issues ?? []).map((i) => i.rule))).size;
  const rows = [['assistant', 'level', 'run', 'views', 'axe_issues', 'axe_rules', 'axe_critical', 'axe_serious',
    'pa11y_errors', 'pa11y_rules', 'lighthouse_min', 'lighthouse_mean', 'tool_errors']];
  for (const dir of allRuns().sort()) {
    const file = path.join(dir, 'checks.json');
    if (!fs.existsSync(file)) continue;
    const { views } = JSON.parse(fs.readFileSync(file));
    const scores = views.map((v) => v.lighthouse?.score).filter((s) => s !== undefined);
    const [assistant, level, run] = path.relative(RESULTS, dir).split(path.sep);
    rows.push([assistant, level, run, views.length,
      sum(views, 'axe'), rules(views, 'axe'),
      sum(views, 'axe', (i) => i.impact === 'critical'), sum(views, 'axe', (i) => i.impact === 'serious'),
      sum(views, 'pa11y'), rules(views, 'pa11y'),
      scores.length ? Math.min(...scores) : '', scores.length ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : '',
      views.flatMap((v) => Object.keys(TOOLS).filter((t) => v[t]?.error)).length]);
  }
  fs.writeFileSync(path.join(RESULTS, 'checks-summary.csv'), rows.map((r) => r.join(',')).join('\n') + '\n');
}

const runs = process.argv.length > 2 ? process.argv.slice(2) : allRuns();
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] });
try {
  for (const dir of runs) {
    if (!fs.existsSync(path.join(dir, 'site', 'index.html'))) { console.log(`skip ${path.relative(RESULTS, dir)}: no site/index.html`); continue; }
    const { views } = await checkRun(browser, dir);
    const errors = views.flatMap((v) => Object.keys(TOOLS).filter((t) => v[t]?.error).map((t) => `${v.name}/${t}`));
    console.log(`${path.relative(RESULTS, dir)}: ${views.length} views${errors.length ? `, tool errors: ${errors.join(' ')}` : ''}`);
  }
} finally {
  await browser.close();
}
writeSummary();
