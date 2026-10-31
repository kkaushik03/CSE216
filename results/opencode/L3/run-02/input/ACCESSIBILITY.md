# Accessibility guidelines (WCAG 2.2 Level AA)

Build every page, component and state accessible as you write it. The work is done when every rule below holds in every place it applies.

The application uses plain HTML, CSS and JavaScript. Numbers in brackets are WCAG 2.2 success criteria.

## 1. Native HTML first

- Use the element that carries the meaning: `<button>` for actions, `<a href>` for navigation, `<select>` for a list of options, `<table>` for tabular data, `<dialog>` for a modal. [4.1.2]
- Attach click handlers only to native interactive elements. A custom control needs a role, `tabindex="0"`, and handlers for Enter and Space. [2.1.1, 4.1.2]
- Add ARIA only where native HTML cannot express the meaning.
- Use `aria-hidden="true"` only on content that has nothing focusable inside it.

## 2. Page structure

- Set the language: `<html lang="en">`. [3.1.1]
- Give each page or view a unique, descriptive `<title>`. In a single-page app, update `document.title` when the view changes. [2.4.2]
- Use landmarks: one `<header>`, one `<nav>` for the main navigation, one `<main>`, one `<footer>`. Give each extra `<nav>` its own `aria-label`. [1.3.1]
- Give each page or view one `<h1>`. Go down one heading level at a time (`<h2>` under `<h1>`, `<h3>` under `<h2>`). Choose the level by structure and set the size in CSS. [1.3.1, 2.4.6]
- Make a "Skip to main content" link the first focusable element. It can stay hidden until it gets focus. [2.4.1]
- Mark the current page in the navigation with `aria-current="page"`.
- Keep the navigation in the same place and order on every page. [3.2.3] Put any help or contact link in the same place on every page. [3.2.6]

## 3. Text alternatives and accessible names

- Give every informative image an `alt` that says what it shows or does. Give decorative images `alt=""`. [1.1.1]
- Give every control an accessible name. For an icon-only button, use `aria-label`, for example `<button aria-label="Close">`, and put `aria-hidden="true"` on the icon. [4.1.2]
- Make each link and button say where it goes or what it does, on its own. When several buttons share visible text (for example "Register" on each course card), add the course to the accessible name: `aria-label="Register for CSE 216"`. [2.4.4]
- Start the accessible name with the visible text of the control. [2.5.3]

## 4. Color and contrast

- Text contrast is at least 4.5:1 against its background. Large text (24px, or 18.66px bold, and larger) is at least 3:1. This includes text on colored backgrounds, gradients, badges and placeholders. [1.4.3]
- Input borders, meaningful icons and focus indicators have at least 3:1 contrast against adjacent colors. [1.4.11]
- Show every color-coded state also as text or an icon, for example the word "Full" on a full course. Underline links in body text. [1.4.1]
- A colorful design fits these rules: choose color pairs that meet the ratios.

## 5. Keyboard and focus

- Every action works with the keyboard alone. [2.1.1]
- The Tab order follows the visual reading order. Use `tabindex` only with the values `0` and `-1`. [2.4.3]
- Every focusable element shows a clearly visible focus indicator. Style it with `:focus-visible`, for example `outline: 3px solid <color>; outline-offset: 2px;`. [2.4.7]
- A focused element stays at least partly visible, also under sticky headers and banners. With a sticky header, set `scroll-padding-top`. [2.4.11]
- The user can always move focus out of every component with the keyboard. [2.1.2]
- When the view changes in a single-page app, move focus to the new view's `<h1>` (with `tabindex="-1"`) or to `<main>`.
- Click and touch targets are at least 24×24 CSS pixels, or have at least 24px of space around them. [2.5.8]
- Every action works with a single click or tap. [2.5.7]

## 6. Forms

- Give every input a visible `<label for="...">`. Placeholders are hints only. [1.3.1, 3.3.2]
- Group related radio buttons and checkboxes in a `<fieldset>` with a `<legend>`. [1.3.1]
- Mark required fields with the `required` attribute and the visible word "(required)". [3.3.2]
- Use the correct input `type` and `autocomplete` value for personal data, for example `type="email" autocomplete="email"` and `autocomplete="name"`. [1.3.5]
- Show each error as text next to its field. Link it with `aria-describedby` and set `aria-invalid="true"` on the field. [3.3.1]
- Each error message says what is wrong and how to fix it, for example "Enter a student ID with 8 digits". [3.3.3]
- When the user submits a form with errors, move focus to the first invalid field, or to an error summary at the top of the form with a link to each field. [3.3.1]
- Fill in information the user already entered in the same process, or let them select it. [3.3.7]
- For any login, allow paste and password managers. [3.3.8]

## 7. Status messages

- Announce messages that appear without a focus change, for example "12 courses found", "Course added" or "Registration saved". Put an element with `role="status"` in the page from the start and change its text. [4.1.3]
- Use `role="alert"` only for urgent errors.
- Change the page or move focus only when the user activates a button or link. Selecting a value or typing updates results in place. [3.2.2]

## 8. Components

**Navigation bar and mobile menu**
- Use `<nav>` with a list of links.
- The menu toggle is a `<button>` with an accessible name, `aria-expanded="true"` or `"false"`, and `aria-controls` pointing to the menu. Enter and Space toggle it. Escape closes it and returns focus to the toggle.

**Search**
- Use `<input type="search">` with a visible label, inside `<form role="search">` or a `<search>` element.
- Announce the number of results in the status element (section 7).

**Filter dropdowns**
- Use native `<select>` elements, each with a visible `<label>`.
- A custom dropdown must follow the WAI-ARIA Listbox or Combobox pattern in full: roles, `aria-expanded`, arrow keys to move, Enter to select, Escape to close.

**Course cards**
- Use a `<ul>` of `<article>` elements, each with a heading for the course name.
- Give each card one main action as a `<button>` or link.

**Confirmation modal**
- Use the native `<dialog>` element and open it with `showModal()`. It makes the rest of the page inert, closes on Escape, and returns focus to the opening button. A custom modal must do all three itself.
- Name the dialog with `aria-labelledby` pointing to its heading.
- When it opens, move focus to the least destructive control, for example "Cancel".
- When it closes and the opening button no longer exists, move focus to the nearest logical place.

**Data table of registered courses**
- Use `<table>` with a `<caption>`, `<thead>`, and `<th scope="col">` for column headers. Use `<th scope="row">` for the cell that names the row.
- Name row actions with the course: `aria-label="Drop CSE 216"`.
- On small screens, let the table scroll inside a container with `tabindex="0"`, `role="region"` and an `aria-label`, so keyboard users can scroll it.

## 9. Responsive layout, zoom and motion

- Content works at 320 CSS pixels wide with only vertical page scrolling. Data tables may scroll inside their container. [1.4.10]
- Text stays readable and working at 200% zoom. Use `rem`, `em` or `%` for font sizes. Use the viewport tag `<meta name="viewport" content="width=device-width, initial-scale=1">`. [1.4.4]
- Text containers grow with their content, so larger line, letter and word spacing still fits. [1.4.12]
- Pages work in both portrait and landscape. [1.3.4]
- Content that appears on hover or focus (for example a tooltip) stays visible while the pointer is over it, and Escape closes it. [1.4.13]
- Under `prefers-reduced-motion: reduce`, turn off non-essential animations and transitions.

---

Adapted from GitHub awesome-copilot `instructions/a11y.instructions.md` (MIT), Addy Osmani web-quality-skills `skills/accessibility` (MIT), the W3C WAI-ARIA Authoring Practices Guide, and W3C WCAG 2.2.
