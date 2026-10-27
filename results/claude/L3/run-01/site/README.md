# Northfield University – Course Registration

A responsive, WCAG 2.2 AA–focused course registration app built with plain HTML, CSS and JavaScript (no build step).

## Run it
Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

Registrations are stored in `localStorage` (two sample courses are pre-registered on first visit).
To reset, clear the site's storage in your browser's dev tools.

## Pages
| Page | File | Highlights |
|------|------|-----------|
| Home | `index.html` | Quick search, stats, department tiles, important dates |
| Course catalog | `catalog.html` | Live search, filter dropdowns, sort, course cards, shareable URL filters |
| Register | `register.html` | Validated form, error summary, schedule-conflict and credit-limit checks, confirmation modal |
| My profile | `profile.html` | Student details, credit summary, sortable table of registered courses, drop with confirmation |

## Structure
```
css/styles.css   shared styles (colour tokens, layout, components)
js/data.js       course catalog data
js/app.js        shared helpers: storage, nav toggle, live announcements, modal dialog
js/home.js, js/catalog.js, js/register.js, js/profile.js   page scripts
```

## Accessibility notes
- Skip link, landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, no skipped heading levels.
- `aria-current="page"` on the active nav link; mobile menu button uses `aria-expanded` and closes with Escape.
- Every input has a visible `<label>`; hints and errors are linked with `aria-describedby`; invalid fields get `aria-invalid`.
- On submit, an error summary receives focus and links to each problem field; the page title is prefixed with "Error:".
- Modals use the native `<dialog>` (focus is trapped, Escape closes, focus returns to the triggering control) with `aria-labelledby`/`aria-describedby`. Destructive dialogs focus the safe option first.
- Search results, sorting and drops are announced through polite live regions.
- Tables use `caption`, `th scope`, row headers and `aria-sort` on sortable column buttons; the scroll container is a labelled, focusable region.
- Buttons and links have meaningful names (e.g. "Register for CS 101, Introduction to Programming").
- All text meets ≥ 4.5:1 contrast; focus indicators are a 3px outline (yellow on dark backgrounds). Supports `prefers-reduced-motion` and Windows forced-colours mode. Targets are at least 24×24 px (most are 44 px).
- No information is conveyed by colour alone (seat bars have text equivalents, errors have icons and text).
