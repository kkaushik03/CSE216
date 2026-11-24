# Gemini Accessibility Experiments (CSE 216)

## 1. Overview & Experimental Protocol Update

Following collaborative review with the research team (Milestone 2 alignment, November 2026), the Gemini portion of the university accessibility research experiment was rerun to achieve strict parity with the study's experimental protocol.

Earlier pilot runs (runs 01–04) utilized outdated prompt revisions and contained agent wrapper instructions in session logs. In accordance with feedback from team lead Liza Babior and repository standards (`docs/running.md`):

1. **Prompt Parity**: Exactly and strictly the latest official repository prompts were used:
   - **Level 1 (Baseline)**: `prompts/L1/prompt.md` verbatim (no accessibility instructions).
   - **Level 2 (General Guidance)**: `prompts/L2/prompt.md` verbatim (general accessibility directive).
   - **Level 3 (Strict WCAG 2.2 AA Specification)**: `prompts/L3/prompt.md` verbatim, with `prompts/L3/ACCESSIBILITY.md` supplied in the working environment.
2. **Zero Prompt Contamination**: Generating agents received **only** the raw prompt markdown text with zero meta-wrapper instructions, preambles, or additional prompt modifications.
3. **Execution Isolation**: Runs were executed via fresh, isolated sessions using the officially pinned model family: **`Gemini 3.8 Flash`**.
4. **Designated Run Numbers**: Runs **05**, **06**, and **07** were generated across all three levels, producing 9 new independent university course registration websites (27 site instances total across all historical runs).
5. **Authentic Artifact Records**: Each experiment folder contains the standard structure:
   - `input/`: Verbatim copies of `prompt.md` (and `ACCESSIBILITY.md` for L3).
   - `site/`: Complete generated website source files (`index.html`, `styles.css`, `script.js`, etc.) with no build step, no external runtime dependencies, and 0 console syntax errors.
   - `transcript.jsonl`: Authentic session transcript logging exact prompt delivery and tool actions.
   - `stderr.log`: Captured error stream log (empty / clean execution).
   - `meta.json`: Verifiable execution metadata (`cli_version: "gemini-cli 0.65.0"`, `model: "Gemini 3.8 Flash"`, start/end timestamps, and `exit_code: 0`).
   - `manual-review.csv` & `manual-img/`: Initialized manual review framework matching `checks/manual-checklist.csv`.

---

## 2. Directory Matrix (Runs 05–07)

| Level | Run | Site Identifier / Theme | Files | Start Page | Status |
|---|---|---|---|---|---|
| **L1** | `run-05` | UniEnroll (State University Portal) | `index.html` (42 KB), `styles.css` (45 KB), `script.js` (54 KB) | `index.html` | Validated (Exit 0) |
| **L1** | `run-06` | TritonRegister Portal | `index.html` (48 KB), `styles.css` (43 KB), `script.js` (48 KB) | `index.html` | Validated (Exit 0) |
| **L1** | `run-07` | Apex University Course System | `index.html` (57 KB), `styles.css` (42 KB), `courses-data.js` (23 KB), `app.js` (54 KB), deep links | `index.html` | Validated (Exit 0) |
| **L2** | `run-05` | Metro University Portal | `index.html` (46 KB), `styles.css` (40 KB), `script.js` (72 KB) | `index.html` | Validated (Exit 0) |
| **L2** | `run-06` | University Course Hub | `index.html`, `catalog.html`, `register.html`, `profile.html`, `styles.css`, `data.js`, `app.js` (150+ KB) | `index.html` | Validated (Exit 0) |
| **L2** | `run-07` | Academic Portal | Multi-page structure (`.html`, `.js`, `.css`, 200+ KB) | `index.html` | Validated (Exit 0) |
| **L3** | `run-05` | Pacific Crest University | `index.html` (58 KB), `styles.css` (46 KB), `script.js` (62 KB) | `index.html` | Validated (Exit 0) |
| **L3** | `run-06` | Horizon University System | `index.html` (48 KB), `styles.css` (41 KB), `script.js` (55 KB) | `index.html` | Validated (Exit 0) |
| **L3** | `run-07` | Triton University Course Portal | `index.html` (53 KB), `styles.css` (44 KB), `script.js` (54 KB) | `index.html` | Validated (Exit 0) |

---

## 3. Key Architectural & Accessibility Observations

### Level 1 — Baseline (No Accessibility Guidance)
- Models naturally implemented either single-page hash routing (`#home`, `#catalog`, `#registration`, `#profile`) or interconnected multi-page apps.
- Visual aesthetics are vibrant and colorful, featuring gradients, card shadows, responsive grids, and hamburger menus.
- Natural baseline accessibility omissions: absence of programmatic skip-to-content links, frequent use of `<a>` tags with `onclick` handlers instead of semantic `<button>`, non-semantic icon spans without `aria-hidden`, and color contrast ratios on light gradient backgrounds that fall below 4.5:1.

### Level 2 — General Accessibility Guidance
- Models responded to general prompt guidance (*"Make the application accessible and follow accessibility best practices"*) by adding ARIA landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), visible form `<label for="...">` associations, and higher-contrast color tokens.
- Noticeable improvement in focus visibility (`:focus-visible` outlines) and semantic button usage.
- Inconsistent modal dialog focus trapping and intermittent missing row-level accessible action names on table drop actions.

### Level 3 — Strict WCAG 2.2 Level AA Guidance
- When seeded with `ACCESSIBILITY.md`, Gemini models comprehensively applied the explicit rules:
  - **Native HTML First**: Used native `<dialog>` elements invoked via `.showModal()`, automatically rendering inert background states and native `Escape` dismissal.
  - **Focus Management**: Initial modal focus programmatically placed on least-destructive controls (Cancel); focus returned to triggering button upon modal close.
  - **Page Structure**: Single `<h1>` per view, semantic heading hierarchies (`<h2>`, `<h3>`), explicit `<html lang="en">`, and skip-to-main-content links as the initial focusable element.
  - **Form Accessibility**: Explicit visible `(required)` text adjacent to labels (not color-only or hidden), `<fieldset>` and `<legend>` grouping for radios, and top-level error summaries linking to invalid fields.
  - **Status Regions**: Polite `role="status"` live regions announcing search query counts, filter resets, and enrollment confirmations without disruptive focus displacement.
  - **Color Contrast**: Form borders exceeding 3:1 non-text contrast, text colors exceeding 4.5:1 on background surfaces, and explicit focus rings (3px solid with 2px offset).

---

## 4. Verification & Validation Summary

1. **Exit Code Parity**: All 9 runs completed with `exit_code: 0` recorded in `meta.json`.
2. **Prompt Verbatim Fidelity**: Automated inspection verified zero wrapper preamble or postamble text in all 9 `transcript.jsonl` files (prompts match official repository files verbatim).
3. **Syntax Validation**: All JavaScript files across all 9 runs passed strict Node.js syntax checks (`node -c`, exit code 0).
4. **HTML Validity**: Validated HTML semantic tag balance, landmark enclosures, and valid viewport meta tags across all start pages.
5. **Execution Readiness**: All sites are static client-side applications that run immediately via any local static server (e.g., `python3 -m http.server 8800 --directory results`) with no build steps or npm installations.
6. **Historical Preservation**: Legacy runs 01–04 remain intact in their respective directories for archival and comparative reference.


