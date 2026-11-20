# Manual accessibility review

The automated checks (see [checks.md](checks.md)) find only part of the problems. They do not use the keyboard, they do not listen with a screen reader, and they do not open the modal, submit the form or use the filters. The manual review checks these things.

Each teammate reviews the runs of their own assistant, with the same checklist and the same steps. Each check is linked to a WCAG 2.2 success criterion.

Gemini is not in the study (it did not follow the run protocol), so there is no Gemini review.

| Reviewer | Assistant | Sites |
|---|---|---|
| Braxton | codex | 9 |
| Liza | opencode | 9 |
| Khushi | claude | 9 |

Start with one site. If it takes too long, the team agrees on fewer sites. The required minimum is one run per assistant and level.

## 1. Before you start: the calibration site

Everybody reviews **`results/claude/L1/run-01`** first. Then compare your results together and agree how to judge the checks where you do not agree. Write the decisions in [Decisions](#decisions). After that, review your own sites.

Why: each person reviews a different assistant. If two reviewers judge the same thing differently, we would see a difference between assistants that does not exist. For the paper, we also report how much the reviewers agreed on the calibration site.

Keep your calibration result as `results/claude/L1/run-01/manual-review-<your name>.csv`.

## 2. Set up (one time)

1. Use **Safari** on a Mac. VoiceOver works best with Safari.
2. In Safari, go to **Settings → Advanced** and turn on **Press Tab to highlight each item on a webpage**. Without this setting, Tab skips links, and every site looks broken for the keyboard.
3. Also in **Settings → Advanced**, turn on **Show features for web developers**. You need it for the responsive design mode (check Z1).
4. Install the free [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) (TPGi). You need it for checks C1 and C2.
5. Learn the VoiceOver basics (Apple's VoiceOver Utility has a short tutorial):
   - **Cmd+F5**: turn VoiceOver on or off.
   - **Ctrl+Option+→ / ←**: read the next or previous item.
   - **Ctrl+Option+U**: open the rotor. The rotor is a VoiceOver menu that lists all elements of one type on the page (headings, landmarks, links, form controls). Screen reader users use it to see how a page is built.
     1. Click once in the page content, then press Ctrl+Option+U.
     2. Press ← and → to change the list.
     3. Press ↑ and ↓ to move through the items. VoiceOver reads each item.
     4. Press Enter to go to an item, or Esc to close the rotor.
   - **Ctrl**: stop speaking.
6. Make your review files. From the repo root:

   ```bash
   checks/manual-init.sh opencode "Liza"
   ```

   This makes `manual-review.csv` and an empty `manual-img/` folder in each run folder of your assistant. It does not change files that exist.

## 3. Open a site

Serve all sites. From the repo root:

```bash
python3 -m http.server 8800 --directory results
```

Open `http://localhost:8800/<assistant>/L<level>/run-<NN>/site/` in a **new Private Window** (Cmd+Shift+N).

Use a new Private Window for each site. All sites have the same address (`localhost:8800`), so they share saved data. Without a private window, courses that you registered on one site can show on the next site.

Keep the window at full screen (about 1280 px wide), except for check Z1.

## 4. Steps for each site

Do the steps in this order. Each step tells which checks to fill in. [5. Checks](#5-checks) tells how to judge each check.

**Step A. Keyboard only (no mouse, VoiceOver off).** Start on the home page. Use Tab, Shift+Tab, Enter, Space, the arrow keys and Esc.

1. Press Tab one time. Look for a skip link. (K1)
2. Go to each page or view through the navigation bar. (K2, K6–K9 on all pages)
3. On the catalog: search for "data", change each filter, and use a course card button. (K3, K5)
4. Go to the registration form. Submit it empty. Then fill it in correctly and submit. (K4, F2, F3, F4)
5. Open the confirmation modal. Tab through it, close it with Esc, open it again, and close it with its button. (M1–M4)
6. In the registered-courses table, drop a course. (K5)

**Step B. VoiceOver (Cmd+F5), in a new Private Window.** Do the same path again, and listen.

1. On each page or view: listen to the page title (V1). Then open the rotor (Ctrl+Option+U) and look at these lists:
   - **Headings**: one heading level 1 and levels in order. (V2)
   - **Landmarks**: main, navigation, banner, content information. (V3, and K1 if there is no skip link)
   - **Links** and **Form Controls**: the names of links and buttons. (V4)
   - Also listen for image names (V5) and for "current page" on the navigation item (V8).
2. Search and change a filter. Listen for the result count. (S1, V7)
3. Submit the form empty. Listen for the errors. Move through the fields and listen for the labels. (F1, F5)
4. Register. Listen to the modal and the confirmation. (M5, S2)
5. In the table, move through the cells with Ctrl+Option+arrow keys. Listen for the column headers. (V6)

**Step C. Visual (VoiceOver off).**

1. **Develop → Enter Responsive Design Mode**. Set the size to 320 × 568 px. WCAG tests only the width, but a very small height hides the page behind the header. Look at each page and scroll down. (Z1)
2. Leave responsive design mode. Zoom to 200% (Cmd+plus, 4 times). Look at each page. (Z2)
3. Look at the errors, status messages and selected filters from steps A and B. (Z3)

**Step D. Contrast.** Use the Colour Contrast Analyser eyedropper.

1. Measure the focus indicator of 2 elements (a link and a field) against the background. Measure one field border. (C1)
2. Open `results/checks-report.html`, select **axe needs review**, and click your site in the table at the bottom. Choose up to 3 color-contrast items. Measure each one. If the site has no such items, write `n/a`. (C2)

## 5. Checks

A check **fails** if one element on one page fails. Write each failing element and page in `note`.

| Check | WCAG | How to judge |
|---|---|---|
| K1 | 2.4.1 | Pass: a skip link shows on the first Tab and moves the focus to the main content, **or** VoiceOver lists a main landmark (V3). Write which one. |
| K2 | 2.1.1 | Pass: you can open each navigation item with Enter. Dropdown menus open with the keyboard. |
| K3 | 2.1.1 | Pass: you can type a search and change each filter with the keyboard. |
| K4 | 2.1.1 | Pass: you can fill in each field (also dropdowns, checkboxes, radio buttons) and submit. |
| K5 | 2.1.1 | Pass: each card button and table button works with Enter or Space. |
| K6 | 2.1.2 | Fail: the focus stays in one part of the page, and Tab or Shift+Tab cannot leave it. A modal that keeps the focus while it is open is correct (M2). |
| K7 | 2.4.3 | Fail: the focus jumps to a part of the page that is not next in reading order, or goes to hidden elements. |
| K8 | 2.4.7 | Fail: at one Tab stop, you cannot see where the focus is. |
| K9 | 2.4.11 | Fail: a sticky header, a banner or other content covers the full focused element. |
| M1 | 2.4.3 | Pass: after the modal opens, the focus is on the modal or on an element in it. |
| M2 | 2.4.3 | Pass: Tab and Shift+Tab move only through the modal elements. |
| M3 | 2.1.1 | Pass: Esc closes the modal, and its close or cancel button also closes it. |
| M4 | 2.4.3 | Pass: after the modal closes, the focus is on the button that opened it (or on a logical next element, if that button is gone). |
| M5 | 4.1.2 | Pass: VoiceOver says "dialog" (or "web dialog") and reads the dialog title. |
| F1 | 3.3.2, 1.3.1 | Pass: each field has visible text that says what to type, and VoiceOver reads it when the field gets the focus. A placeholder only is a fail. |
| F2 | 3.3.2, 1.4.1 | Pass: required fields have text ("required") or a symbol (*) that the form explains. A red border only is a fail. N/a if no field is required. |
| F3 | 3.3.1 | Pass: each error shows in text and tells which field has the error. A red border only is a fail. |
| F4 | 3.3.3 | Pass: the message tells how to correct the error (for example, "Enter an email such as name@ucsd.edu"). "Invalid input" is a fail. |
| F5 | 3.3.1, 4.1.3 | Pass: after submit, VoiceOver reads the errors, or the focus moves to the first error or to an error summary. |
| S1 | 4.1.3 | Pass: VoiceOver reads the new result count (for example, "5 courses found") and the focus does not move. |
| S2 | 4.1.3 | Pass: VoiceOver reads the confirmation text after register or drop. |
| V1 | 2.4.2 | Pass: each page has a title that tells what the page is, for example "Course catalog – University". A single-page app passes if the title changes for each view, or if the title is the same but the main heading changes and VoiceOver reads it. Write which one. |
| V2 | 1.3.1, 2.4.6 | Pass: each view has one h1, levels do not jump from h1 to h3 without a reason, and heading text tells what the section is. Text that looks like a heading but is not one in the rotor is a fail. |
| V3 | 1.3.1 | Pass: the rotor shows main and navigation, and banner and content information (footer) if the page has a header and footer. |
| V4 | 2.4.4 | Pass: in the rotor link list, each name tells where it goes or what it does, with its card or row. Many "Register" buttons are a pass if VoiceOver also reads the course name (for example, "Register for CSE 110"). "Click here" or "More" is a fail. Icon-only buttons with no name are a fail. |
| V5 | 1.1.1 | Pass: each meaningful image or icon has a text alternative that tells the same thing. Decorative images and emoji icons are hidden, or VoiceOver reads them in a way that makes sense. N/a if there are no images or icons. |
| V6 | 1.3.1 | Pass: when you move to another column, VoiceOver reads the column header. N/a if there is no table. |
| V7 | 4.1.2 | Pass: VoiceOver reads the role (pop-up button, tab, toggle) and the state (expanded, selected, checked) of custom controls. N/a if the site uses only native controls. |
| V8 | 1.3.1 | Pass: VoiceOver says "current page" (or a similar word) on the navigation item of the current page. A visual highlight only is a fail. |
| Z1 | 1.4.10 | Fail: at 320 px, the page scrolls left and right (a wide data table can scroll in its own box), or content or buttons are missing or cannot be used. |
| Z2 | 1.4.4 | Fail: at 200%, text is cut off, is on top of other text, or is not there. |
| Z3 | 1.4.1 | Fail: you need color to see an error, a status or a selected filter (no text, icon or shape tells it). |
| C1 | 1.4.11 | Pass: each measured focus indicator and field border has at least 3:1 against the colors next to it. Write the lowest ratio. |
| C2 | 1.4.3 | Pass: each measured item has at least 4.5:1 (normal text) or 3:1 (large text: 24 px, or 18.66 px bold). Write each ratio. |

## 6. Write the results

Fill in `results/<assistant>/L<level>/run-<NN>/manual-review.csv` for each site. Do not change the first four columns.

| Column | What to write |
|---|---|
| `result` | `pass`, `fail` or `n/a`. Use `n/a` only when the site does not have the thing that the check needs (for example, no table). |
| `note` | For a fail: which element on which page, and what happens. For a pass that needed a decision: why it passes. Keep it short. |
| `evidence` | For a fail: the name of a screenshot in `manual-img/`, for example `F3-empty-submit.png`. Use Cmd+Shift+4 for a screenshot. |
| `reviewer` | Your name. The script fills it in. |

Rules:

- Fill in each row. An empty `result` means "not checked".
- If a feature is missing (for example, the site has no modal), write `fail` for the checks that need it, and write "no modal" in `note`. The prompt asked for these features, so a missing feature is a result, not `n/a`.
- If a check fails because of an earlier failure (for example, the form cannot be submitted, so F3–F5 cannot be checked), write `fail` and give the reason in `note`.
- Commit the CSV files and the screenshots when you finish a site. Use a message like `feat(review): add manual review for opencode L1 run-01`.

## Decisions

Write here the decisions from the calibration meeting, so that all reviewers judge the same way.

- (none yet)
