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
  // Hashes that a navigation click opened, also for a view that was the same as an earlier one (for example, #home).
  const routes = new Set();
  await first.close();
  for (const [i, item] of items.entries()) {
    if (!item.visible || views.length >= MAX_VIEWS) continue;
    const view = { name: item.name, nav: i };
    const { page, close } = await open(browser, base, view).catch(() => ({}));
    if (!page) continue;
    const key = await viewKey(page);
    if (page.url().startsWith(base) && new URL(page.url()).hash.length > 1) routes.add(new URL(page.url()).hash);
    if (page.url().startsWith(base) && !seen.has(key)) { seen.add(key); views.push({ ...view, url: page.url() }); }
    await close();
  }
  return { views, routes };
}

const clip = (s) => (s ?? '').replace(/\s+/g, ' ').trim().slice(0, 300);

// WCAG success criteria: axe tag "wcag143" and Pa11y code "Guideline1_4.1_4_3" both give "1.4.3".
const axeCriteria = (tags) => tags.flatMap((t) => t.match(/^wcag(\d)(\d)(\d+)$/)?.slice(1).join('.') ?? []);
const pa11yCriteria = (code) => [code.match(/Guideline\d+_\d+\.(\d+)_(\d+)_(\d+)/)?.slice(1).join('.')].filter(Boolean);

// axe violations or incomplete results: one issue per rule, with each failing element.
const axeIssues = (list) => list.map((v) => ({
  rule: v.id, impact: v.impact, wcag: axeCriteria(v.tags), help: v.help, help_url: v.helpUrl, count: v.nodes.length,
  nodes: v.nodes.map((n) => {
    const c = n.any.find((check) => check.data?.contrastRatio !== undefined)?.data;
    return { selector: n.target.join(' '), html: clip(n.html), summary: clip(n.failureSummary),
      ...(c && { contrast: { fg: c.fgColor, bg: c.bgColor, ratio: c.contrastRatio, expected: c.expectedContrastRatio } }) };
  }),
}));

// Group Pa11y issues by rule: [{ rule, impact, wcag, message, count, nodes }].
const byRule = (list) => Object.values(list.reduce((acc, i) => {
  acc[i.code] ??= { rule: i.code, impact: i.type, wcag: pa11yCriteria(i.code), message: i.message, count: 0, nodes: [] };
  acc[i.code].count += 1;
  acc[i.code].nodes.push({ selector: i.selector, html: clip(i.context), message: i.message });
  return acc;
}, {}));

const TOOLS = {
  async axe(page) {
    const r = await new AxePuppeteer(page).withTags(WCAG_TAGS).analyze();
    return { issues: axeIssues(r.violations), needs_review: axeIssues(r.incomplete) };
  },
  async pa11y(page, browser, routes) {
    const r = await pa11y(page.url(), { browser, page, ignoreUrl: true, standard: 'WCAG2AA', runners: ['htmlcs'] });
    // HTML_CodeSniffer reads single-page-app routes as links to a missing id. Not a real issue.
    // A route is href="#/catalog", or href="#catalog" when a navigation click opened a view at that hash.
    const route = (i) => i.code.endsWith('.NoSuchID')
      && (/href="#\//.test(i.context) || routes.has(i.context.match(/href="(#[^"]*)"/)?.[1]));
    return { issues: byRule(r.issues.filter((i) => !route(i))), ignored_route_links: r.issues.filter(route).length };
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
    const { views, routes } = await findViews(browser, base);
    for (const view of views) {
      const entry = { name: view.name, url: view.url.replace(base, '') };
      // Each tool gets its own fresh view, so one tool's injected scripts cannot change another tool's result.
      for (const [tool, run] of Object.entries(TOOLS)) {
        const { page, close } = await open(browser, base, view);
        entry[tool] = await run(page, browser, routes).catch((e) => ({ error: String(e.message ?? e).slice(0, 300) }));
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

const csv = (rows) => rows.map((r) => r.map((c) => /[",\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c).join(',')).join('\n') + '\n';

// One row per run, from every checks.json found. Issue counts add up over all views.
// The "unique" counts take an element with the same rule and selector on several views (for example, in the navigation bar) one time.
// checks-issues.csv: one row per failing element, per view and tool.
function writeSummary() {
  const sum = (views, tool, pick = () => true, list = 'issues') => views.reduce((n, v) =>
    n + (v[tool]?.[list] ?? []).filter(pick).reduce((m, i) => m + i.count, 0), 0);
  const rules = (views, tool) => new Set(views.flatMap((v) => (v[tool]?.issues ?? []).map((i) => i.rule))).size;
  const unique = (views, tool) => new Set(views.flatMap((v) => (v[tool]?.issues ?? []).flatMap((i) =>
    (i.nodes ?? []).map((n) => `${i.rule} ${n.selector}`)))).size;
  const rows = [['assistant', 'level', 'run', 'views', 'axe_issues', 'axe_rules', 'axe_critical', 'axe_serious',
    'pa11y_errors', 'pa11y_rules', 'lighthouse_min', 'lighthouse_mean', 'tool_errors',
    'axe_unique', 'pa11y_unique', 'axe_needs_review', 'pa11y_ignored_route_links']];
  const issues = [['assistant', 'level', 'run', 'view', 'url', 'tool', 'kind', 'rule', 'wcag', 'impact', 'selector', 'html', 'detail',
    'contrast_ratio', 'contrast_expected', 'fg', 'bg']];
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
      views.flatMap((v) => Object.keys(TOOLS).filter((t) => v[t]?.error)).length,
      unique(views, 'axe'), unique(views, 'pa11y'), sum(views, 'axe', undefined, 'needs_review'),
      views.reduce((n, v) => n + (v.pa11y?.ignored_route_links ?? 0), 0)]);
    for (const v of views) for (const [tool, kind] of [['axe', 'issues'], ['axe', 'needs_review'], ['pa11y', 'issues']])
      for (const i of v[tool]?.[kind] ?? []) for (const n of i.nodes ?? [])
        issues.push([assistant, level, run, v.name, v.url, tool, kind === 'issues' ? 'violation' : 'needs_review', i.rule,
          (i.wcag ?? []).join(' '), i.impact, n.selector, n.html, n.summary ?? n.message,
          n.contrast?.ratio ?? '', n.contrast?.expected ?? '', n.contrast?.fg ?? '', n.contrast?.bg ?? '']);
  }
  fs.writeFileSync(path.join(RESULTS, 'checks-summary.csv'), csv(rows));
  fs.writeFileSync(path.join(RESULTS, 'checks-issues.csv'), csv(issues));
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
