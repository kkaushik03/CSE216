# Horizon University – Course Registration

A responsive, colorful course registration web app built with plain HTML, CSS and JavaScript (no build step).

## Run
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Pages
| Page | File | Highlights |
|------|------|-----------|
| Home | `index.html` | Hero search, stats, department tiles, popular courses |
| Catalog | `catalog.html` | Live search, department/level/credits/day filters, sort, open-seats toggle, course cards, details modal |
| Register | `register.html` | Validated student form, filterable course picker, credit meter, conflict detection, confirmation modal, registered-courses table |
| Profile | `profile.html` | Student card with edit modal, stats, weekly schedule, searchable registered-courses table with drop |

## Structure
- `css/styles.css` – theme, components and responsive breakpoints (1024 / 820 / 600 / 400 px)
- `js/data.js` – departments and course catalog
- `js/app.js` – shared nav, modal, toast, storage and per-page logic

Registrations and the student profile are saved in `localStorage`, so data stays between page visits.
