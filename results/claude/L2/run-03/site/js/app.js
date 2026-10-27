/*
 * Northbridge University course registration — shared behaviour and
 * page-specific controllers. Each page sets <body data-page="..."> and
 * the matching init function runs on load.
 */
(function () {
  'use strict';

  const { departments, courses, terms } = window.UR_DATA;

  const MAX_CREDITS = 18;
  const FULL_TIME_CREDITS = 12;
  const KEYS = {
    cart: 'nbu.cart',
    registered: 'nbu.registered',
    profile: 'nbu.profile',
    seeded: 'nbu.seeded'
  };
  const DEFAULT_PROFILE = {
    firstName: 'Alex',
    lastName: 'Rivera',
    studentId: 'S20261234',
    email: 'alex.rivera@northbridge.edu',
    major: 'Computer Science',
    year: 'Sophomore'
  };
  const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
  const DAY_NAMES = { MWF: 'Mon, Wed, Fri', TTh: 'Tue, Thu', Online: 'Online' };

  const courseMap = new Map(courses.map(c => [c.id, c]));
  const deptMap = new Map(departments.map(d => [d.id, d]));
  const termMap = new Map(terms.map(t => [t.id, t]));

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------------------------------------------------------------- storage */

  // Falls back to memory when localStorage is unavailable (e.g. private mode).
  const memoryStore = {};

  function readStore(key, fallback) {
    let raw;
    try { raw = localStorage.getItem(key); } catch (e) { raw = memoryStore[key]; }
    if (raw == null) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  function writeStore(key, value) {
    const raw = JSON.stringify(value);
    try { localStorage.setItem(key, raw); } catch (e) { memoryStore[key] = raw; }
  }

  function seedDemoData(force) {
    if (!force && readStore(KEYS.seeded, false)) return;
    writeStore(KEYS.registered, [
      { id: 'PSY101', term: 'spring-2027', date: '2026-10-14' },
      { id: 'HIST105', term: 'spring-2027', date: '2026-10-14' }
    ]);
    writeStore(KEYS.cart, []);
    writeStore(KEYS.profile, DEFAULT_PROFILE);
    writeStore(KEYS.seeded, true);
  }

  const state = {
    cart: () => readStore(KEYS.cart, []).filter(id => courseMap.has(id)),
    setCart(ids) {
      writeStore(KEYS.cart, Array.from(new Set(ids)));
      updateCartBadge();
    },
    registered: () => readStore(KEYS.registered, []).filter(r => courseMap.has(r.id)),
    setRegistered: list => writeStore(KEYS.registered, list),
    profile: () => Object.assign({}, DEFAULT_PROFILE, readStore(KEYS.profile, {})),
    setProfile: p => writeStore(KEYS.profile, p)
  };

  /* ---------------------------------------------------------------- helpers */

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
  }

  const isRegistered = id => state.registered().some(r => r.id === id);
  const inCart = id => state.cart().includes(id);
  const courseCode = c => `${c.id.replace(/\d+$/, '')} ${c.number}`;
  const seatsLeft = c => Math.max(0, c.capacity - c.enrolled - (isRegistered(c.id) ? 1 : 0));
  const sumCredits = ids => ids.reduce((sum, id) => sum + (courseMap.get(id)?.credits || 0), 0);
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

  function formatTime(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
  }

  function formatSchedule(c) {
    if (c.pattern === 'Online') return 'Online, self-paced';
    return `${DAY_NAMES[c.pattern]}, ${formatTime(c.start)} to ${formatTime(c.end)}`;
  }

  const toMinutes = hhmm => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  function hasConflict(a, b) {
    if (a.pattern === 'Online' || b.pattern === 'Online' || a.pattern !== b.pattern) return false;
    return toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
  }

  function findConflicts(ids) {
    const list = ids.map(id => courseMap.get(id));
    const pairs = [];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (hasConflict(list[i], list[j])) pairs.push([list[i], list[j]]);
      }
    }
    return pairs;
  }

  function seatStatus(c) {
    const left = seatsLeft(c);
    if (left === 0) return { cls: 'full', text: 'Full, 0 seats open' };
    if (left <= 5) return { cls: 'low', text: `${plural(left, 'seat')} left` };
    return { cls: 'open', text: `${left} of ${c.capacity} seats open` };
  }

  const ICONS = {
    check: '<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
    plus: '<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    close: '<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    trash: '<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
    lock: '<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
  };

  /* ------------------------------------------------- announcements & toast */

  let toastEl;
  let toastTimer;

  function initToast() {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    toastEl.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastEl);
  }

  // Shows a short visual message that is also announced to screen readers.
  function toast(message, tone = 'info') {
    if (!toastEl) return;
    window.clearTimeout(toastTimer);
    toastEl.textContent = '';
    toastEl.dataset.tone = tone;
    // A fresh text node after a tick makes repeat messages re-announce.
    window.setTimeout(() => {
      toastEl.textContent = message;
      toastEl.classList.add('is-visible');
    }, 60);
    toastTimer = window.setTimeout(() => toastEl.classList.remove('is-visible'), 5000);
  }

  /* ----------------------------------------------------- confirmation modal */

  let dialogEl;

  function ensureDialog() {
    if (dialogEl) return dialogEl;
    dialogEl = document.createElement('dialog');
    dialogEl.className = 'modal';
    dialogEl.setAttribute('aria-labelledby', 'modal-title');
    dialogEl.setAttribute('aria-describedby', 'modal-desc');
    dialogEl.innerHTML = `
      <form method="dialog" class="modal__panel">
        <div class="modal__header">
          <h2 id="modal-title" class="modal__title"></h2>
          <button type="submit" value="cancel" class="modal__close">
            ${ICONS.close}<span class="sr-only">Close dialog</span>
          </button>
        </div>
        <div class="modal__body">
          <p id="modal-desc" class="modal__desc"></p>
          <div class="modal__content"></div>
        </div>
        <div class="modal__actions">
          <button type="submit" value="cancel" class="btn btn--ghost" data-modal-cancel></button>
          <button type="submit" value="confirm" class="btn btn--primary" data-modal-confirm></button>
        </div>
      </form>`;
    document.body.appendChild(dialogEl);
    // Clicking the backdrop (outside the panel) cancels.
    dialogEl.addEventListener('click', e => {
      if (e.target === dialogEl) dialogEl.close('cancel');
    });
    return dialogEl;
  }

  /**
   * Opens an accessible modal confirmation. Resolves true when confirmed.
   * Native <dialog> provides the focus trap, Escape handling and inert page.
   */
  function confirmDialog({ title, description, content = '', confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false }) {
    if (typeof HTMLDialogElement !== 'function') {
      return Promise.resolve(window.confirm(`${title}\n\n${description}`));
    }
    const d = ensureDialog();
    const opener = document.activeElement;
    const confirmBtn = $('[data-modal-confirm]', d);
    const cancelBtn = $('[data-modal-cancel]', d);

    $('.modal__title', d).textContent = title;
    $('.modal__desc', d).textContent = description;
    $('.modal__content', d).innerHTML = content;
    confirmBtn.textContent = confirmLabel;
    cancelBtn.textContent = cancelLabel;
    confirmBtn.className = `btn ${danger ? 'btn--danger' : 'btn--primary'}`;
    d.classList.toggle('modal--danger', danger);
    d.returnValue = '';

    return new Promise(resolve => {
      d.addEventListener('close', () => {
        if (opener && document.contains(opener)) opener.focus();
        resolve(d.returnValue === 'confirm');
      }, { once: true });
      d.showModal();
      // Safer default focus for destructive actions.
      (danger ? cancelBtn : confirmBtn).focus();
    });
  }

  /* ------------------------------------------------------------- navigation */

  function initNav() {
    const toggle = $('.nav-toggle');
    const nav = $('#primary-nav');
    if (!toggle || !nav) return;

    const setOpen = open => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    const desktop = window.matchMedia('(min-width: 52em)');
    const onChange = () => setOpen(false);
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else desktop.addListener(onChange);
  }

  function updateCartBadge() {
    const n = state.cart().filter(id => !isRegistered(id)).length;
    $$('[data-cart-badge]').forEach(badge => {
      badge.hidden = n === 0;
      badge.innerHTML = `<span aria-hidden="true">${n}</span><span class="sr-only">, ${plural(n, 'course')} selected</span>`;
    });
  }

  /* ------------------------------------------------------------ course card */

  function cardAction(c) {
    const label = escapeHtml(`${courseCode(c)} ${c.title}`);
    if (isRegistered(c.id)) {
      return `<p class="status-tag status-tag--ok">${ICONS.check}Registered</p>`;
    }
    if (inCart(c.id)) {
      return `<button type="button" class="btn btn--selected" data-action="toggle-cart" data-id="${c.id}">
        ${ICONS.check}Selected<span class="sr-only"> ${label}. Activate to remove from selection</span>
      </button>`;
    }
    if (seatsLeft(c) === 0) {
      return `<p class="status-tag status-tag--full">${ICONS.lock}Section full</p>`;
    }
    return `<button type="button" class="btn btn--primary" data-action="toggle-cart" data-id="${c.id}">
      ${ICONS.plus}Add<span class="sr-only"> ${label}</span> to registration
    </button>`;
  }

  function courseCard(c, headingLevel = 3) {
    const dept = deptMap.get(c.dept);
    const seats = seatStatus(c);
    const h = `h${headingLevel}`;
    return `
      <article class="course-card" style="--dept:${dept.color}" data-course="${c.id}" aria-labelledby="title-${c.id}">
        <div class="course-card__top">
          <span class="course-code">${courseCode(c)}</span>
          <span class="dept-pill">${escapeHtml(dept.name)}</span>
        </div>
        <${h} id="title-${c.id}" class="course-card__title">${escapeHtml(c.title)}</${h}>
        <p class="course-card__desc">${escapeHtml(c.description)}</p>
        <dl class="course-meta">
          <div><dt>Instructor</dt><dd>${escapeHtml(c.instructor)}</dd></div>
          <div><dt>Schedule</dt><dd>${escapeHtml(formatSchedule(c))}</dd></div>
          <div><dt>Credits</dt><dd>${c.credits}</dd></div>
          <div><dt>Seats</dt><dd><span class="seat seat--${seats.cls}">${seats.text}</span></dd></div>
        </dl>
        <div class="course-card__action">${cardAction(c)}</div>
      </article>`;
  }

  // Handles "Add"/"Selected" buttons inside any container of course cards.
  function bindCardActions(container, onChange) {
    container.addEventListener('click', e => {
      const btn = e.target.closest('[data-action="toggle-cart"]');
      if (!btn) return;
      const c = courseMap.get(btn.dataset.id);
      const cart = state.cart();
      const adding = !cart.includes(c.id);
      state.setCart(adding ? cart.concat(c.id) : cart.filter(id => id !== c.id));

      const card = container.querySelector(`[data-course="${c.id}"]`);
      const action = $('.course-card__action', card);
      action.innerHTML = cardAction(c);
      const newBtn = $('button', action);
      if (newBtn) newBtn.focus();

      toast(adding
        ? `${courseCode(c)} ${c.title} added to your registration.`
        : `${courseCode(c)} ${c.title} removed from your registration.`, adding ? 'success' : 'info');
      if (onChange) onChange();
    });
  }

  /* ------------------------------------------------------------------ home */

  function initHome() {
    const featured = $('#featured-courses');
    featured.innerHTML = courses.filter(c => c.featured)
      .map(c => `<li>${courseCard(c, 3)}</li>`).join('');
    bindCardActions(featured);

    $('#dept-grid').innerHTML = departments.map(d => {
      const count = courses.filter(c => c.dept === d.id).length;
      return `<li>
        <a class="dept-tile" style="--dept:${d.color}" href="catalog.html?dept=${d.id}">
          <span class="dept-tile__name">${escapeHtml(d.name)}</span>
          <span class="dept-tile__count">${plural(count, 'course')}</span>
        </a>
      </li>`;
    }).join('');

    $('#stat-courses').textContent = courses.length;
    $('#stat-depts').textContent = departments.length;
    $('#stat-open').textContent = courses.filter(c => seatsLeft(c) > 0).length;
  }

  /* --------------------------------------------------------------- catalog */

  function initCatalog() {
    const form = $('#catalog-filters');
    const grid = $('#course-grid');
    const count = $('#results-count');
    const empty = $('#no-results');
    const f = {
      q: $('#search'),
      dept: $('#filter-dept'),
      level: $('#filter-level'),
      credits: $('#filter-credits'),
      days: $('#filter-days'),
      open: $('#filter-open'),
      sort: $('#sort')
    };

    departments.forEach(d => f.dept.add(new Option(d.name, d.id)));

    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) f.q.value = params.get('q');
    if (deptMap.has(params.get('dept'))) f.dept.value = params.get('dept');

    function filtered() {
      const q = f.q.value.trim().toLowerCase();
      const list = courses.filter(c => {
        if (q) {
          const haystack = [c.id, courseCode(c), c.title, c.instructor, c.description, deptMap.get(c.dept).name]
            .join(' ').toLowerCase();
          if (!q.split(/\s+/).every(word => haystack.includes(word))) return false;
        }
        if (f.dept.value && c.dept !== f.dept.value) return false;
        if (f.level.value && Math.floor(c.number / 100) * 100 !== Number(f.level.value)) return false;
        if (f.credits.value && c.credits !== Number(f.credits.value)) return false;
        if (f.days.value && c.pattern !== f.days.value) return false;
        if (f.open.checked && seatsLeft(c) === 0) return false;
        return true;
      });
      const sorters = {
        code: (a, b) => a.dept.localeCompare(b.dept) || a.number - b.number,
        title: (a, b) => a.title.localeCompare(b.title),
        'credits-desc': (a, b) => b.credits - a.credits || a.title.localeCompare(b.title),
        seats: (a, b) => seatsLeft(b) - seatsLeft(a)
      };
      return list.sort(sorters[f.sort.value] || sorters.code);
    }

    function updateSelectionBar() {
      const ids = state.cart().filter(id => !isRegistered(id));
      const bar = $('#selection-bar');
      bar.hidden = ids.length === 0;
      $('#selection-text').textContent =
        `${plural(ids.length, 'course')} selected, ${plural(sumCredits(ids), 'credit')}`;
    }

    function render() {
      const list = filtered();
      grid.innerHTML = list.map(c => `<li>${courseCard(c, 3)}</li>`).join('');
      empty.hidden = list.length > 0;
      count.textContent = list.length === courses.length
        ? `Showing all ${courses.length} courses`
        : `Showing ${list.length} of ${courses.length} courses`;
      updateSelectionBar();
    }

    let searchTimer;
    f.q.addEventListener('input', () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(render, 300);
    });
    form.addEventListener('change', e => { if (e.target !== f.q) render(); });
    form.addEventListener('submit', e => { e.preventDefault(); render(); });
    form.addEventListener('reset', () => {
      // Wait for the browser to reset field values before re-rendering.
      window.setTimeout(() => { render(); f.q.focus(); }, 0);
    });

    bindCardActions(grid, updateSelectionBar);
    render();
  }

  /* ------------------------------------------------------- form validation */

  function profileRules(prefix) {
    return [
      { id: `${prefix}first-name`, label: 'First name', test: v => v.trim() !== '', msg: 'Enter your first name.' },
      { id: `${prefix}last-name`, label: 'Last name', test: v => v.trim() !== '', msg: 'Enter your last name.' },
      {
        id: `${prefix}student-id`, label: 'Student ID',
        test: v => /^S\d{8}$/i.test(v.trim()),
        msg: 'Enter your student ID as the letter S followed by 8 digits, for example S20261234.'
      },
      {
        id: `${prefix}email`, label: 'Email',
        test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        msg: 'Enter an email address in the correct format, like name@northbridge.edu.'
      },
      { id: `${prefix}major`, label: 'Major', test: v => v !== '', msg: 'Select your major.' },
      { id: `${prefix}year`, label: 'Year', test: v => v !== '', msg: 'Select your year of study.' }
    ];
  }

  function setFieldError(field, message) {
    const err = document.getElementById(`${field.id}-error`);
    if (err) {
      err.innerHTML = message ? `<span class="sr-only">Error: </span>${escapeHtml(message)}` : '';
      err.hidden = !message;
    }
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function checkRule(rule) {
    const field = document.getElementById(rule.id);
    const value = field.type === 'checkbox' ? (field.checked ? 'on' : '') : field.value;
    const message = rule.test(value) ? '' : rule.msg;
    setFieldError(field, message);
    return message ? { id: rule.id, msg: message } : null;
  }

  function showErrorSummary(summary, errors) {
    const list = $('ul', summary);
    list.innerHTML = errors.map(e => `<li><a href="#${e.id}" data-target="${e.id}">${escapeHtml(e.msg)}</a></li>`).join('');
    summary.hidden = false;
    summary.focus();
    if (!document.title.startsWith('Error: ')) document.title = `Error: ${document.title}`;
  }

  function hideErrorSummary(summary) {
    summary.hidden = true;
    document.title = document.title.replace(/^Error: /, '');
  }

  function bindErrorSummaryLinks(summary) {
    summary.addEventListener('click', e => {
      const link = e.target.closest('a[data-target]');
      if (!link) return;
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      const focusable = target.matches('input, select, textarea, button')
        ? target
        : $('input, select, button', target);
      (focusable || target).focus();
      target.scrollIntoView({ block: 'center' });
    });
  }

  function fillProfileFields(prefix, profile) {
    $(`#${prefix}first-name`).value = profile.firstName;
    $(`#${prefix}last-name`).value = profile.lastName;
    $(`#${prefix}student-id`).value = profile.studentId;
    $(`#${prefix}email`).value = profile.email;
    $(`#${prefix}major`).value = profile.major;
    $(`#${prefix}year`).value = profile.year;
  }

  function readProfileFields(prefix) {
    return {
      firstName: $(`#${prefix}first-name`).value.trim(),
      lastName: $(`#${prefix}last-name`).value.trim(),
      studentId: $(`#${prefix}student-id`).value.trim().toUpperCase(),
      email: $(`#${prefix}email`).value.trim(),
      major: $(`#${prefix}major`).value,
      year: $(`#${prefix}year`).value
    };
  }

  function populateProfileSelects(prefix) {
    const major = $(`#${prefix}major`);
    departments.map(d => d.name).concat('Undeclared')
      .forEach(name => major.add(new Option(name, name)));
    const year = $(`#${prefix}year`);
    YEARS.forEach(y => year.add(new Option(y, y)));
  }

  /* ---------------------------------------------------------- registration */

  function initRegister() {
    const form = $('#registration-form');
    const summary = $('#error-summary');
    const pickList = $('#selected-courses');
    const pickEmpty = $('#selected-empty');
    const addSelect = $('#add-course');
    const termSelect = $('#term');
    const unchecked = new Set();
    let submitted = false;

    populateProfileSelects('');
    terms.forEach(t => termSelect.add(new Option(t.name, t.id)));
    termSelect.value = terms[0].id;
    fillProfileFields('', state.profile());
    bindErrorSummaryLinks(summary);

    const pending = () => state.cart().filter(id => !isRegistered(id));
    const chosen = () => pending().filter(id => !unchecked.has(id));
    const registeredInTerm = term => state.registered().filter(r => r.term === term).map(r => r.id);

    function renderPicks() {
      const ids = pending();
      pickList.innerHTML = ids.map(id => {
        const c = courseMap.get(id);
        const label = escapeHtml(`${courseCode(c)} ${c.title}`);
        return `<li class="pick" style="--dept:${deptMap.get(c.dept).color}">
          <input type="checkbox" class="pick__check" id="pick-${c.id}" name="courses" value="${c.id}"
            ${unchecked.has(c.id) ? '' : 'checked'}>
          <label class="pick__label" for="pick-${c.id}">
            <span class="pick__code">${courseCode(c)}</span>
            <span class="pick__title">${escapeHtml(c.title)}</span>
            <span class="pick__meta">${plural(c.credits, 'credit')} · ${escapeHtml(formatSchedule(c))}</span>
          </label>
          <button type="button" class="btn btn--icon" data-remove="${c.id}">
            ${ICONS.trash}<span class="sr-only">Remove ${label}</span>
          </button>
        </li>`;
      }).join('');
      pickEmpty.hidden = ids.length > 0;
      renderAddOptions();
      updateTotals();
    }

    function renderAddOptions() {
      const taken = new Set(pending());
      addSelect.innerHTML = '<option value="">Choose a course</option>';
      departments.forEach(d => {
        const options = courses.filter(c => c.dept === d.id && !taken.has(c.id) && !isRegistered(c.id) && seatsLeft(c) > 0);
        if (!options.length) return;
        const group = document.createElement('optgroup');
        group.label = d.name;
        options.forEach(c => group.appendChild(
          new Option(`${courseCode(c)}: ${c.title} (${plural(c.credits, 'credit')})`, c.id)
        ));
        addSelect.appendChild(group);
      });
    }

    function updateTotals() {
      const ids = chosen();
      const already = registeredInTerm(termSelect.value);
      const selectedCredits = sumCredits(ids);
      const existingCredits = sumCredits(already);
      const total = selectedCredits + existingCredits;

      $('#credits-selected').textContent = selectedCredits;
      $('#credits-existing').textContent = existingCredits;
      $('#credits-total').textContent = total;
      $('#credit-totals').classList.toggle('is-over', total > MAX_CREDITS);

      const conflicts = findConflicts(ids.concat(already));
      const box = $('#conflict-warning');
      box.hidden = conflicts.length === 0;
      $('ul', box).innerHTML = conflicts.map(([a, b]) =>
        `<li>${courseCode(a)} and ${courseCode(b)} both meet ${escapeHtml(formatSchedule(a))}.</li>`
      ).join('');
    }

    function courseError() {
      const ids = chosen();
      const total = sumCredits(ids) + sumCredits(registeredInTerm(termSelect.value));
      if (ids.length === 0) return 'Select at least one course to register for.';
      if (total > MAX_CREDITS) return `Your total of ${total} credits is over the ${MAX_CREDITS} credit limit. Remove a course.`;
      if (findConflicts(ids.concat(registeredInTerm(termSelect.value))).length) {
        return 'Two or more of your courses meet at the same time. Remove one of the conflicting courses.';
      }
      return '';
    }

    const rules = profileRules('').concat([
      { id: 'term', label: 'Term', test: v => termMap.has(v), msg: 'Select a term.' },
      { id: 'agree', label: 'Agreement', test: v => v === 'on', msg: 'Confirm that you agree to the registration policies.' }
    ]);

    function validateCourses() {
      const message = courseError();
      const err = $('#courses-error');
      err.innerHTML = message ? `<span class="sr-only">Error: </span>${escapeHtml(message)}` : '';
      err.hidden = !message;
      $('#courses-fieldset').classList.toggle('has-error', Boolean(message));
      return message ? { id: 'courses-fieldset', msg: message } : null;
    }

    function validateAll() {
      const errors = rules.map(checkRule);
      const courseErr = validateCourses();
      // Keep summary order matching the visual order of the form.
      errors.splice(rules.length - 1, 0, courseErr);
      return errors.filter(Boolean);
    }

    pickList.addEventListener('change', e => {
      if (!e.target.matches('.pick__check')) return;
      if (e.target.checked) unchecked.delete(e.target.value);
      else unchecked.add(e.target.value);
      updateTotals();
      if (submitted) validateCourses();
    });

    pickList.addEventListener('click', e => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;
      const id = btn.dataset.remove;
      const c = courseMap.get(id);
      const removeButtons = $$('[data-remove]', pickList);
      const index = removeButtons.indexOf(btn);
      unchecked.delete(id);
      state.setCart(state.cart().filter(x => x !== id));
      renderPicks();
      if (submitted) validateCourses();
      const remaining = $$('[data-remove]', pickList);
      (remaining[Math.min(index, remaining.length - 1)] || addSelect).focus();
      toast(`${courseCode(c)} ${c.title} removed.`);
    });

    $('#add-course-btn').addEventListener('click', () => {
      const id = addSelect.value;
      if (!id) {
        toast('Choose a course from the list first.', 'warning');
        addSelect.focus();
        return;
      }
      const c = courseMap.get(id);
      state.setCart(state.cart().concat(id));
      renderPicks();
      if (submitted) validateCourses();
      $(`#pick-${id}`).focus();
      toast(`${courseCode(c)} ${c.title} added.`, 'success');
    });

    termSelect.addEventListener('change', () => {
      updateTotals();
      if (submitted) validateCourses();
    });

    // After the first submit attempt, re-check fields as the user fixes them.
    const recheck = e => {
      if (!submitted) return;
      const rule = rules.find(r => r.id === e.target.id);
      if (rule) checkRule(rule);
    };
    form.addEventListener('input', recheck);
    form.addEventListener('change', recheck);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      submitted = true;
      const errors = validateAll();
      if (errors.length) {
        showErrorSummary(summary, errors);
        return;
      }
      hideErrorSummary(summary);

      const ids = chosen();
      const profile = readProfileFields('');
      const term = termSelect.value;
      const total = sumCredits(ids);
      const rows = ids.map(id => {
        const c = courseMap.get(id);
        return `<tr><th scope="row">${courseCode(c)}</th><td>${escapeHtml(c.title)}</td><td class="num">${c.credits}</td></tr>`;
      }).join('');

      const ok = await confirmDialog({
        title: 'Confirm your registration',
        description: `${profile.firstName} ${profile.lastName} (${profile.studentId}), you are registering for ${plural(ids.length, 'course')} in ${termMap.get(term).name}.`,
        content: `
          <table class="mini-table">
            <caption class="sr-only">Courses to be registered</caption>
            <thead><tr><th scope="col">Code</th><th scope="col">Course</th><th scope="col" class="num">Credits</th></tr></thead>
            <tbody>${rows}</tbody>
            <tfoot><tr><th scope="row" colspan="2">Total credits</th><td class="num">${total}</td></tr></tfoot>
          </table>
          <p class="modal__note">You can drop courses from your profile until the add/drop deadline.</p>`,
        confirmLabel: 'Confirm registration',
        cancelLabel: 'Go back'
      });

      if (!ok) {
        toast('Registration not submitted. Your selections are saved.');
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      state.setRegistered(state.registered().concat(ids.map(id => ({ id, term, date: today }))));
      state.setCart(state.cart().filter(id => !ids.includes(id)));
      state.setProfile(profile);
      ids.forEach(id => unchecked.delete(id));
      showSuccess(ids, term);
    });

    function showSuccess(ids, term) {
      const panel = $('#success-panel');
      $('#success-list').innerHTML = ids.map(id => {
        const c = courseMap.get(id);
        return `<li><strong>${courseCode(c)}</strong> ${escapeHtml(c.title)}</li>`;
      }).join('');
      $('#success-term').textContent = termMap.get(term).name;
      form.hidden = true;
      panel.hidden = false;
      $('#success-heading').focus();
      document.title = 'Registration complete - Northbridge University';
    }

    $('#register-more').addEventListener('click', () => {
      $('#success-panel').hidden = true;
      form.hidden = false;
      submitted = false;
      $('#agree').checked = false;
      document.title = 'Register for Courses - Northbridge University';
      renderPicks();
      $('#register-heading').focus();
    });

    renderPicks();
  }

  /* --------------------------------------------------------------- profile */

  function initProfile() {
    const editBtn = $('#edit-profile');
    const form = $('#profile-form');
    const summary = $('#profile-error-summary');
    const tbody = $('#registered-body');
    const rules = profileRules('pf-');

    populateProfileSelects('pf-');
    bindErrorSummaryLinks(summary);

    function renderProfile() {
      const p = state.profile();
      $('#profile-initials').textContent = `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();
      $('#profile-name').textContent = `${p.firstName} ${p.lastName}`;
      $('#profile-id').textContent = p.studentId;
      $('#profile-email').textContent = p.email;
      $('#profile-email').href = `mailto:${p.email}`;
      $('#profile-major').textContent = p.major;
      $('#profile-year').textContent = p.year;
      $('#profile-role').textContent = p.year === 'Graduate' ? 'Graduate student' : 'Undergraduate student';
    }

    function renderCourses() {
      const regs = state.registered();
      const ids = regs.map(r => r.id);
      const credits = sumCredits(ids);
      const termCredits = sumCredits(regs.filter(r => r.term === terms[0].id).map(r => r.id));

      tbody.innerHTML = regs.length ? regs.map(r => {
        const c = courseMap.get(r.id);
        const dept = deptMap.get(c.dept);
        const label = escapeHtml(`${courseCode(c)} ${c.title}`);
        return `<tr>
          <th scope="row"><span class="code-chip" style="--dept:${dept.color}">${courseCode(c)}</span></th>
          <td><span class="cell-title">${escapeHtml(c.title)}</span><span class="cell-sub">${escapeHtml(dept.name)}</span></td>
          <td>${escapeHtml(formatSchedule(c))}<span class="cell-sub">${escapeHtml(c.room)}</span></td>
          <td>${escapeHtml(c.instructor)}</td>
          <td>${escapeHtml(termMap.get(r.term)?.name || r.term)}</td>
          <td class="num">${c.credits}</td>
          <td><span class="status-tag status-tag--ok">${ICONS.check}Enrolled</span></td>
          <td>
            <button type="button" class="btn btn--small btn--danger-outline" data-drop="${c.id}">
              Drop<span class="sr-only"> ${label}</span>
            </button>
          </td>
        </tr>`;
      }).join('') : `<tr><td colspan="8" class="table-empty">
          You are not registered for any courses yet. <a href="catalog.html">Browse the course catalog</a>.
        </td></tr>`;

      $('#total-credits').textContent = credits;
      $('#stat-courses').textContent = regs.length;
      $('#stat-credits').textContent = credits;
      $('#stat-status').textContent = termCredits >= FULL_TIME_CREDITS ? 'Full-time' : 'Part-time';

      const pct = Math.min(100, Math.round((termCredits / MAX_CREDITS) * 100));
      $('#credit-bar-fill').style.width = `${pct}%`;
      $('#credit-bar-text').textContent =
        `${termCredits} of ${MAX_CREDITS} maximum credits for ${terms[0].name}. ` +
        (termCredits >= FULL_TIME_CREDITS
          ? 'You are enrolled full-time.'
          : `${FULL_TIME_CREDITS - termCredits} more credits needed for full-time status.`);
    }

    function setEditing(open) {
      editBtn.setAttribute('aria-expanded', String(open));
      form.hidden = !open;
      if (open) {
        fillProfileFields('pf-', state.profile());
        rules.forEach(r => setFieldError(document.getElementById(r.id), ''));
        hideErrorSummary(summary);
        $('#pf-first-name').focus();
      }
    }

    editBtn.addEventListener('click', () => setEditing(form.hidden));
    $('#cancel-edit').addEventListener('click', () => {
      setEditing(false);
      editBtn.focus();
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const errors = rules.map(checkRule).filter(Boolean);
      if (errors.length) {
        showErrorSummary(summary, errors);
        return;
      }
      hideErrorSummary(summary);
      state.setProfile(readProfileFields('pf-'));
      renderProfile();
      setEditing(false);
      editBtn.focus();
      toast('Your profile has been saved.', 'success');
    });

    tbody.addEventListener('click', async e => {
      const btn = e.target.closest('[data-drop]');
      if (!btn) return;
      const c = courseMap.get(btn.dataset.drop);
      const index = $$('[data-drop]', tbody).indexOf(btn);

      const ok = await confirmDialog({
        title: `Drop ${courseCode(c)}?`,
        description: `You are about to drop ${courseCode(c)} ${c.title} (${plural(c.credits, 'credit')}). Your seat will be released to other students.`,
        confirmLabel: 'Drop course',
        cancelLabel: 'Keep course',
        danger: true
      });
      if (!ok) return;

      state.setRegistered(state.registered().filter(r => r.id !== c.id));
      renderCourses();
      const remaining = $$('[data-drop]', tbody);
      (remaining[Math.min(index, remaining.length - 1)] || $('#courses-heading')).focus();
      toast(`${courseCode(c)} ${c.title} has been dropped.`);
    });

    $('#reset-demo').addEventListener('click', async () => {
      const ok = await confirmDialog({
        title: 'Reset demo data?',
        description: 'This restores the sample profile and registered courses, and clears your current selections.',
        confirmLabel: 'Reset data',
        danger: true
      });
      if (!ok) return;
      seedDemoData(true);
      updateCartBadge();
      renderProfile();
      renderCourses();
      toast('Demo data has been reset.');
    });

    renderProfile();
    renderCourses();
  }

  /* ------------------------------------------------------------------ boot */

  function init() {
    seedDemoData(false);
    initToast();
    initNav();
    updateCartBadge();
    $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

    const pages = { home: initHome, catalog: initCatalog, register: initRegister, profile: initProfile };
    const page = pages[document.body.dataset.page];
    if (page) page();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
