# Northfield University – Course Registration

A responsive, accessible course registration demo built with plain HTML, CSS and JavaScript (no build step or dependencies).

## Run

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Pages

| Page | File | Highlights |
|------|------|------------|
| Home | `index.html` | Hero search, key dates, live stats, department tiles, featured course cards |
| Course Catalog | `catalog.html` | Live search, department/level/credits/day filters, sort, open-seats toggle, course cards |
| Registration | `register.html` | Validated form, course picker with credit meter, time-conflict and 18-credit checks, confirmation modal |
| My Profile | `profile.html` | Student details, term summary, data table of registered courses with drop (confirmed via modal) |

State (selected courses, registrations, profile) is stored in `localStorage`, so it persists across pages. Course data lives in `js/data.js`.

## Accessibility

- Skip link, semantic landmarks, one `h1` per page, logical heading order
- `aria-current` on the active nav link; mobile menu button with `aria-expanded`/`aria-controls`, closes on Escape
- Every input has a visible label; hints and errors are linked with `aria-describedby`; invalid fields get `aria-invalid`
- Error summary receives focus and links to each problem field
- Native `<dialog>` modal: focus is trapped, Escape closes it, focus returns to the trigger (or a sensible fallback); destructive dialogs focus "Cancel" first
- Polite live regions announce result counts, cart changes and drops
- Data table with `caption`, `scope` headers, and a keyboard-scrollable region on small screens
- WCAG AA color contrast, information never conveyed by color alone, 44px touch targets, two-tone focus ring
- Respects `prefers-reduced-motion` and Windows High Contrast (`forced-colors`)
