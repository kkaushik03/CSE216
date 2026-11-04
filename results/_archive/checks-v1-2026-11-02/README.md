# Archived check results (v1)

The automated check results from commit a8f2dfa (2026-11-02), saved before `checks/check.mjs` was extended to save element-level detail.

- `<assistant>/L<level>/run-<NN>/checks.json`: the report of each run.
- `checks-summary.csv`: the summary of all runs.
- `check.mjs`: the script version that made these results.

Known problems of this version: Pa11y counts include route links of the form `href="#catalog"` as `NoSuchID` errors (codex L2 and L3), and an issue on several views is counted one time per view.
