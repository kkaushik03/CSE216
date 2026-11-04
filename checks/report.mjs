// Make results/checks-report.html: a dashboard of the failed rules and elements, from every checks.json.
// Usage: node checks/report.mjs   (no npm packages needed; runs outside the container)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const RESULTS = path.join(here, '..', 'results');

const allRuns = () => fs.readdirSync(RESULTS).flatMap((a) =>
  fs.statSync(path.join(RESULTS, a)).isDirectory()
    ? fs.readdirSync(path.join(RESULTS, a)).filter((l) => /^L\d$/.test(l)).flatMap((l) =>
      fs.readdirSync(path.join(RESULTS, a, l)).filter((r) => /^run-\d+$/.test(r)).map((r) => [a, l, r]))
    : []).filter(([a, l, r]) => fs.existsSync(path.join(RESULTS, a, l, r, 'checks.json'))).sort();

// Pa11y gives the contrast only in its message.
const pa11yContrast = (message) => {
  const ratio = message.match(/contrast ratio of ([\d.]+):1/)?.[1];
  return ratio && { ratio: Number(ratio), expected: `${message.match(/at least ([\d.]+):1/)?.[1]}:1` };
};

const SOURCES = [['axe', 'issues', 'axe'], ['axe', 'needs_review', 'review'], ['pa11y', 'issues', 'pa11y']];
const runs = [];
const findings = [];
let tools = {};
let checked = '';
for (const [assistant, level, run] of allRuns()) {
  const dir = path.join(RESULTS, assistant, level, run);
  const report = JSON.parse(fs.readFileSync(path.join(dir, 'checks.json')));
  if (!report.views.some((v) => v.axe?.issues?.some((i) => i.nodes) || v.axe?.needs_review)) {
    console.log(`skip ${assistant}/${level}/${run}: old checks.json without elements, run checks/run.sh again`);
    continue;
  }
  tools = report.tools;
  if (report.checked > checked) checked = report.checked;
  const r = runs.push({ assistant, level, run, meta: fs.existsSync(path.join(dir, 'meta.json')),
    views: report.views.map((v) => ({ name: v.name, url: v.url, lighthouse: v.lighthouse?.score ?? null })),
    routeLinks: report.views.reduce((n, v) => n + (v.pa11y?.ignored_route_links ?? 0), 0),
    errors: report.views.flatMap((v) => ['axe', 'pa11y', 'lighthouse'].filter((t) => v[t]?.error)).length }) - 1;
  for (const [tool, list, src] of SOURCES) {
    const rules = new Map();
    report.views.forEach((v, vi) => {
      for (const issue of v[tool]?.[list] ?? []) {
        const f = rules.get(issue.rule) ?? { run: r, src, rule: issue.rule, wcag: issue.wcag ?? [], impact: issue.impact,
          help: issue.help ?? issue.message, url: issue.help_url ?? '', els: new Map() };
        rules.set(issue.rule, f);
        for (const n of issue.nodes ?? []) {
          const el = f.els.get(n.selector) ?? { sel: n.selector, html: n.html, detail: n.summary ?? n.message,
            c: n.contrast ?? (n.message && pa11yContrast(n.message)) ?? undefined, views: [] };
          if (!el.views.includes(vi)) el.views.push(vi);
          f.els.set(n.selector, el);
        }
      }
    });
    for (const f of rules.values()) findings.push({ ...f, els: [...f.els.values()] });
  }
}

const data = JSON.stringify({ checked, tools, runs, findings }).replace(/</g, '\\u003c');
const html = fs.readFileSync(path.join(here, 'report-template.html'), 'utf8').replace('__DATA__', () => data);
fs.writeFileSync(path.join(RESULTS, 'checks-report.html'), html);
console.log(`results/checks-report.html: ${runs.length} runs, ${findings.length} rule findings, ${Math.round(html.length / 1024)} KB`);
