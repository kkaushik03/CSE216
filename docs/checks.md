# Automated accessibility checks

`checks/run.sh` checks the generated sites with five automated tools. It runs in Docker, so all teammates get the same tool versions. [Tools](#tools) tells which tools we use, which settings, and why. Use it for the method section of the paper.

## See the results

The easiest way is the dashboard. It shows which WCAG rules each assistant's sites break at each level, and the failing elements.

- **In the repo:** open `results/checks-report.html` in a browser (double-click it). It is one file with all the data in it. It needs no server.
- **Online:** https://claude.ai/artifact/NjXeoZC1fecbxv6XETZm66. This is a copy of the same page, hosted on claude.ai.

How to use the dashboard:

- **Finding source** selects the data: axe violations, Pa11y errors, axe "needs review" items, Alfa failures, or Nu HTML errors.
- **Cell value** selects what a heatmap cell shows: the mean number of failing elements per run, or the number of runs with the rule.
- Click a **heatmap cell** to see the failing elements of that rule, assistant and level.
- Click a **rule name** to see that rule on all sites.
- Click a **site** in the table at the bottom to see all its failing elements.

Each element shows its CSS selector, its HTML, the views it is on and the failure message. For a contrast failure, it also shows the colors and the measured contrast ratio.

For your own analysis (R, pandas, Excel), use `results/checks-issues.csv` and `results/checks-summary.csv`. See [Output](#output).

## Tools

| Tool | Version | What it checks | Settings | What we keep |
|---|---|---|---|---|
| [axe-core](https://github.com/dequelabs/axe-core) (Deque), the engine of the axe DevTools extension | 4.14.0 | WCAG rules | Rules with the tags of WCAG 2.0, 2.1 and 2.2, Level A and AA | Violations, and "needs review" items (axe `incomplete`) |
| [Pa11y](https://pa11y.org) with [HTML_CodeSniffer](https://squizlabs.github.io/HTML_CodeSniffer/) | 10.0.0 | WCAG rules | Standard `WCAG2AA`, runner `htmlcs` | Errors only (no warnings, no notices) |
| [Lighthouse](https://developer.chrome.com/docs/lighthouse) (Google) | 13.6.0 | WCAG rules, as one score | Category `accessibility`, snapshot mode, desktop | Score 0–100 and the failed audits |
| [Siteimprove Alfa](https://github.com/Siteimprove/alfa), the open-source engine of the Siteimprove Accessibility Checker | 0.84.3 | WCAG rules, written in the W3C ACT Rules format (ids `sia-r1`, `sia-r2`, …) | Rules of WCAG 2.2 Level A and AA (`Rules.aaFilter`) | Failed outcomes, and "needs review" items (Alfa `cantTell`) |
| [Nu HTML Checker](https://validator.github.io/validator/) (W3C), `vnu.jar` | 26.11.4 | HTML validity, not WCAG | The page as the browser has it after load (rendered DOM) | Errors only (no warnings, no info) |

All tools check the same views in the same browser: Chromium 156 (Debian package), controlled by Puppeteer 25.16.0, window 1280 × 800. Each `checks.json` saves the exact versions in `tools`. `checks/package-lock.json` pins all npm packages.

**Independent engines.** axe-core, HTML_CodeSniffer and Alfa are three different rule engines with their own rules. Lighthouse uses axe-core for its audits, so it is not independent from axe. Its score adds a weighted summary. The Nu HTML Checker is not an accessibility tool. Invalid HTML can cause accessibility problems (for example, duplicate `id` values break labels and ARIA references), so we keep it as extra data. WCAG 2.2 removed success criterion 4.1.1 Parsing, so Nu errors are not WCAG failures.

### How we chose the tools

We started from two lists: the ranked tool list of our group (axe DevTools, Lighthouse, WAVE, Pa11y, Accessibility Insights for Web) and the free tools on the Harvard University IT page ["Automated tools for testing accessibility"](https://accessibility.huit.harvard.edu/auto-tools-testing). Our rule: the tool must run with no human action and no paid account, so the script can check all sites in the same way and teammates can repeat the checks. Tools that need a person go into the manual review.

| Tool | Source | Decision | Reason |
|---|---|---|---|
| axe DevTools | Group list, Harvard | Used (axe-core) | Its engine, axe-core, runs from a script |
| Lighthouse | Group list | Used | Runs from a script. Gives a score that is easy to compare |
| Pa11y | Group list | Used | Runs from a script. Uses a second engine (HTML_CodeSniffer) |
| Siteimprove Accessibility Checker | Harvard | Used (Alfa) | Its engine, Alfa, is open source and runs from a script. A third engine |
| Nu HTML Checker | Harvard | Used | Runs from a script. Checks HTML validity |
| WAVE | Group list, Harvard | Manual review | Automated use needs the paid WAVE API |
| Accessibility Insights for Web | Group list, Harvard | Manual review | Its automated checks use axe-core (no new data). Its guided checks are manual |
| ANDI | Harvard | Manual review | A bookmarklet that shows information to a person |
| HeadingsMap | Harvard | Manual review | A browser extension that shows the heading outline to a person. axe and Alfa check some heading rules |
| WebAIM Contrast Checker, Colour Contrast Analyser, Contrast Ratio | Harvard | Manual review | Manual tools. axe and Alfa check contrast (WCAG 1.4.3) and save the measured ratio |
| PEAT | Harvard | Not used | Checks flashing in videos. Our sites have no video |

### For the paper

A short text for the method section, to change as necessary:

> We checked each generated site with five automated tools in a pinned Docker image: axe-core 4.14.0, Pa11y 10.0.0 (HTML_CodeSniffer runner, WCAG2AA), Lighthouse 13.6.0 (accessibility category), Siteimprove Alfa 0.84.3 (WCAG 2.2 A and AA rules) and the W3C Nu HTML Checker 26.11.4. axe-core, HTML_CodeSniffer and Alfa are independent rule engines; Lighthouse builds on axe-core, and the Nu HTML Checker checks HTML validity, not WCAG. A script opened each site in headless Chromium (1280 × 800), checked the start page and the view after each click on a navigation item, and gave each tool a new browser context for each view. We report failing elements per rule and WCAG success criterion. Items that a tool could not decide (axe "incomplete", Alfa "cantTell") went to the manual review. We chose the tools from the free automated tools that Harvard University IT recommends, and kept the tools that run without human action and without a paid account.

## Run the checks

Start Docker. Then, from the repo root:

```bash
checks/run.sh                                  # all runs in results/
checks/run.sh results/opencode/L2/run-01       # one or more runs
```

A full check of 30 sites takes about 30 minutes. The script writes one line for each site when the site is done. Run the checks again after you add or change a run.

Then make the dashboard again (no Docker needed, takes a second):

```bash
node checks/report.mjs
```

## Output

| File | Content |
|---|---|
| `results/<assistant>/L<level>/run-<NN>/checks.json` | The full report of one run: for each view and each tool, the failed rules, their WCAG criteria and each failing element (selector, HTML, message; for contrast, the colors and the ratio). The tool versions. |
| `results/checks-summary.csv` | One row for each run. See the columns below. |
| `results/checks-issues.csv` | One row for each failing element, for each view and tool. Use it for analysis by rule, WCAG criterion or element. |
| `results/checks-report.html` | The dashboard. Made by `checks/report.mjs` from all `checks.json` files. |

`checks/run.sh` makes both CSV files again from all `checks.json` files after each check.

### Summary columns

| Column | Meaning |
|---|---|
| `views` | Number of views that were checked |
| `axe_issues` | axe-core WCAG violations: number of elements, added for all views |
| `axe_rules` | Number of different axe rules that failed |
| `axe_critical`, `axe_serious` | `axe_issues` with that impact |
| `pa11y_errors` | Pa11y errors (HTML_CodeSniffer, WCAG 2 AA): number of elements, added for all views |
| `pa11y_rules` | Number of different Pa11y rules that failed |
| `lighthouse_min`, `lighthouse_mean` | Lighthouse accessibility score (0–100) of the views |
| `tool_errors` | Number of tool runs that failed. Must be 0. |
| `axe_unique`, `pa11y_unique` | Failing elements, with an element that has the same rule and selector on several views counted one time |
| `axe_needs_review` | axe-core items that need a manual check, added for all views |
| `pa11y_ignored_route_links` | Pa11y route-link errors that the script removed (see [Limits](#limits)) |
| `alfa_issues`, `alfa_rules`, `alfa_unique` | Like the axe columns, for Siteimprove Alfa failures |
| `alfa_needs_review` | Alfa items that need a manual check (`cantTell`), added for all views |
| `nu_errors`, `nu_rules`, `nu_unique` | Like the Pa11y columns, for Nu HTML Checker errors |

`axe_issues` and `pa11y_errors` count an issue that is on all pages (for example, in the navigation bar) one time for each view. `axe_unique` and `pa11y_unique` count it one time. The dashboard uses the unique counts.

### Issue columns

| Column | Meaning |
|---|---|
| `assistant`, `level`, `run` | The run |
| `view`, `url` | The view where the element is |
| `tool` | `axe`, `pa11y`, `alfa` or `nu` |
| `kind` | `violation`, or `needs_review` for an axe or Alfa item that a person must check |
| `rule` | The axe rule id, the Pa11y code, the Alfa rule id (`sia-r69`), or the Nu message with each quoted name replaced by "…" (Nu has no rule ids) |
| `wcag` | The WCAG success criteria of the rule, for example `1.4.3`. Empty for Nu. |
| `impact` | axe: `critical`, `serious`, `moderate` or `minor`. Pa11y: `error`. Empty for Alfa and Nu. |
| `selector`, `html` | The element. Alfa gives an XPath. Nu gives only a short extract of the HTML, in both columns. |
| `detail` | The failure message of the tool |
| `contrast_ratio`, `contrast_expected`, `fg`, `bg` | For contrast issues from axe: the measured ratio, the necessary ratio and the colors |

## How it works

1. The script serves the site folder on a local web server and opens `index.html` in Chromium (1280 × 800).
2. It finds the views: the start page, and the page after a click on each visible item in the navigation bar. This works for sites with one HTML file for each page and for single-page apps. It keeps a maximum of 8 different views.
3. It checks each view with each tool, in a new and clean browser context:
   - **axe-core**: the WCAG 2.0, 2.1 and 2.2 A and AA rules. It saves the violations and the "needs review" items.
   - **Pa11y**: the HTML_CodeSniffer runner with the WCAG2AA standard, errors only.
   - **Lighthouse**: the accessibility category, in snapshot mode.
   - **Siteimprove Alfa**: the WCAG 2.2 A and AA rules. It saves the failures and the "needs review" items.
   - **Nu HTML Checker**: the rendered HTML of the view, errors only.
4. It writes `checks.json` for each run, then the two CSV files for all runs.

`checks/report.mjs` reads all `checks.json` files and writes the dashboard. It runs outside Docker and needs only Node.

## Earlier results

The first check results (2026-11-02) did not save the failing elements and had the route-link problem (see [Limits](#limits)). They are saved in `results/_archive/checks-v1-2026-11-02/`, with the script version that made them. The git tag `checks-v1` points to the commit with these results.

The git tag `checks-v2` points to the last results with three tools (axe-core, Pa11y, Lighthouse), before we added Alfa and the Nu HTML Checker (2026-11-18).

## Limits

- The tools check only the views after the page loads and after one navigation click. They do not open the modal, submit the form or use the filters. The manual review must check these states.
- axe "needs review" items are not failures. axe could not decide them, for example text on a gradient or an image. The manual review must check a sample of them.
- Lighthouse uses axe-core for its accessibility audits. Thus, Lighthouse and axe-core are not independent. Pa11y (HTML_CodeSniffer) and Alfa are different engines.
- The tools find the same problem in different ways. For example, axe `color-contrast`, Pa11y `G18` and Alfa `sia-r69` all check WCAG 1.4.3. To compare tools, compare by WCAG criterion (`wcag` column), not by rule.
- HTML_CodeSniffer (in Pa11y 10.0.0) has a bug: its image rule writes to an undeclared global variable `elements`. On a site with its own global `const elements`, Pa11y fails ("Assignment to constant variable"). `checks/Dockerfile` makes this variable local in the image. This changes nothing else. Before this fix (up to the tag `checks-v2`), Pa11y failed on all views of gemini L1 run-04, so that run showed 0 Pa11y errors.
- The Nu HTML Checker checks the rendered DOM, not the files that the assistant wrote. The browser repairs some errors in the source when it reads the page (for example, a missing end tag), so Nu does not see them. Nu sees the HTML that JavaScript made, which is most of the HTML in single-page apps.
- axe and Pa11y write selectors in different forms. To compare the two tools for one element, compare the HTML, not the selector.
- Pa11y reads single-page-app route links (`href="#/catalog"`, or `href="#catalog"` when a navigation click opens that hash) as links to a missing `id`. The script removes these false errors and writes their number in `ignored_route_links`. The first version removed only the `#/` form, so codex L2 and L3 had about 180 false errors.
- WAVE, Accessibility Insights for Web, ANDI, HeadingsMap and the contrast tools are not in the script. See [How we chose the tools](#how-we-chose-the-tools). Use them in the manual review.
