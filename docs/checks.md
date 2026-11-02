# Automated accessibility checks

`checks/run.sh` checks the generated sites with three tools from our tool list. It runs in Docker, so all teammates get the same tool versions.

## Run the checks

Start Docker. Then, from the repo root:

```bash
checks/run.sh                                  # all runs in results/
checks/run.sh results/opencode/L2/run-01       # one or more runs
```

A full check of 30 sites takes about 30 minutes. Run the checks again after you add or change a run.

## Output

- `results/<assistant>/L<level>/run-<NN>/checks.json`: the issues of each view, for each tool, with the tool versions.
- `results/checks-summary.csv`: one row for each run. The script makes it again from all `checks.json` files after each check.

Summary columns:

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

An issue that is on all pages (for example, in the navigation bar) is counted one time for each view.

## How it works

1. The script serves the site folder on a local web server and opens `index.html` in Chromium (1280 × 800).
2. It finds the views: the start page, and the page after a click on each visible item in the navigation bar. This works for sites with one HTML file for each page and for single-page apps. It keeps a maximum of 8 different views.
3. It checks each view with each tool, in a new and clean browser context:
   - **axe-core**: the WCAG 2.0, 2.1 and 2.2 A and AA rules.
   - **Pa11y**: the HTML_CodeSniffer runner with the WCAG2AA standard, errors only.
   - **Lighthouse**: the accessibility category, in snapshot mode.

## Limits

- The tools check only the views after the page loads and after one navigation click. They do not open the modal, submit the form or use the filters. The manual review must check these states.
- Lighthouse uses axe-core for its accessibility audits. Thus, Lighthouse and axe-core are not independent. Pa11y (HTML_CodeSniffer) is a different engine.
- Pa11y reads single-page-app route links (`href="#/catalog"`) as links to a missing `id`. The script removes these false errors and writes their number in `ignored_route_links`.
- WAVE is not in the script. Its automated use needs the paid WAVE API. Use the WAVE browser extension in the manual review.
- Accessibility Insights for Web is not in the script. Its automated checks use axe-core, and its guided checks are manual.
