# Automated accessibility checks

`checks/run.sh` checks the generated sites with three tools from our tool list. It runs in Docker, so all teammates get the same tool versions.

## See the results

The easiest way is the dashboard. It shows which WCAG rules each assistant's sites break at each level, and the failing elements.

- **In the repo:** open `results/checks-report.html` in a browser (double-click it). It is one file with all the data in it. It needs no server.
- **Online:** https://claude.ai/artifact/NjXeoZC1fecbxv6XETZm66. This is a copy of the same page, hosted on claude.ai.

How to use the dashboard:

- **Finding source** selects the data: axe violations, Pa11y errors, or axe "needs review" items.
- **Cell value** selects what a heatmap cell shows: the mean number of failing elements per run, or the number of runs with the rule.
- Click a **heatmap cell** to see the failing elements of that rule, assistant and level.
- Click a **rule name** to see that rule on all sites.
- Click a **site** in the table at the bottom to see all its failing elements.

Each element shows its CSS selector, its HTML, the views it is on and the failure message. For a contrast failure, it also shows the colors and the measured contrast ratio.

For your own analysis (R, pandas, Excel), use `results/checks-issues.csv` and `results/checks-summary.csv`. See [Output](#output).

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

`axe_issues` and `pa11y_errors` count an issue that is on all pages (for example, in the navigation bar) one time for each view. `axe_unique` and `pa11y_unique` count it one time. The dashboard uses the unique counts.

### Issue columns

| Column | Meaning |
|---|---|
| `assistant`, `level`, `run` | The run |
| `view`, `url` | The view where the element is |
| `tool` | `axe` or `pa11y` |
| `kind` | `violation`, or `needs_review` for an axe item that a person must check |
| `rule` | The axe rule id or the Pa11y code |
| `wcag` | The WCAG success criteria of the rule, for example `1.4.3` |
| `impact` | axe: `critical`, `serious`, `moderate` or `minor`. Pa11y: `error`. |
| `selector`, `html` | The element |
| `detail` | The failure message of the tool |
| `contrast_ratio`, `contrast_expected`, `fg`, `bg` | For contrast issues from axe: the measured ratio, the necessary ratio and the colors |

## How it works

1. The script serves the site folder on a local web server and opens `index.html` in Chromium (1280 × 800).
2. It finds the views: the start page, and the page after a click on each visible item in the navigation bar. This works for sites with one HTML file for each page and for single-page apps. It keeps a maximum of 8 different views.
3. It checks each view with each tool, in a new and clean browser context:
   - **axe-core**: the WCAG 2.0, 2.1 and 2.2 A and AA rules. It saves the violations and the "needs review" items.
   - **Pa11y**: the HTML_CodeSniffer runner with the WCAG2AA standard, errors only.
   - **Lighthouse**: the accessibility category, in snapshot mode.
4. It writes `checks.json` for each run, then the two CSV files for all runs.

`checks/report.mjs` reads all `checks.json` files and writes the dashboard. It runs outside Docker and needs only Node.

## Earlier results

The first check results (2026-11-02) did not save the failing elements and had the route-link problem (see [Limits](#limits)). They are saved in `results/_archive/checks-v1-2026-11-02/`, with the script version that made them. The git tag `checks-v1` points to the commit with these results.

## Limits

- The tools check only the views after the page loads and after one navigation click. They do not open the modal, submit the form or use the filters. The manual review must check these states.
- axe "needs review" items are not failures. axe could not decide them, for example text on a gradient or an image. The manual review must check a sample of them.
- Lighthouse uses axe-core for its accessibility audits. Thus, Lighthouse and axe-core are not independent. Pa11y (HTML_CodeSniffer) is a different engine.
- axe and Pa11y write selectors in different forms. To compare the two tools for one element, compare the HTML, not the selector.
- Pa11y reads single-page-app route links (`href="#/catalog"`, or `href="#catalog"` when a navigation click opens that hash) as links to a missing `id`. The script removes these false errors and writes their number in `ignored_route_links`. The first version removed only the `#/` form, so codex L2 and L3 had about 180 false errors.
- WAVE is not in the script. Its automated use needs the paid WAVE API. Use the WAVE browser extension in the manual review.
- Accessibility Insights for Web is not in the script. Its automated checks use axe-core, and its guided checks are manual.
