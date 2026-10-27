/* Northbridge University – Course Registration
   Shared behaviour for every page plus page-specific controllers.
   Data persists in localStorage so registrations survive page changes. */
(function () {
  'use strict';

  const { courses: COURSES, departments: DEPTS, terms: TERMS } = window.NU_DATA;
  const MAX_CREDITS = 18;
  const KEYS = { regs: 'nu-registrations-v1', profile: 'nu-profile-v1' };
  const DEFAULT_PROFILE = {
    name: 'Jordan Rivera', studentId: '20241234', email: 'jordan.rivera@northbridge.edu',
    phone: '', major: 'Computer Science', year: 'Sophomore', advisor: 'Dr. Grace Kim'
  };
  const SEED_REGS = [
    { code: 'MATH120', term: 'Fall 2027', grading: 'Letter grade', date: '2026-10-01' },
    { code: 'PSYC101', term: 'Fall 2027', grading: 'Letter grade', date: '2026-10-01' }
  ];

  /* ---------------------------------------------------------------------
     Storage (falls back to memory when localStorage is unavailable)
     --------------------------------------------------------------------- */
  const memory = {};
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return key in memory ? memory[key] : fallback;
    }
  }
  function save(key, value) {
    memory[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* memory only */ }
  }

  const getRegs = () => load(KEYS.regs, SEED_REGS.slice());
  const setRegs = (regs) => save(KEYS.regs, regs);
  const getProfile = () => Object.assign({}, DEFAULT_PROFILE, load(KEYS.profile, {}));
  const setProfile = (p) => save(KEYS.profile, p);
  const findReg = (code) => getRegs().find((r) => r.code === code);

  /* ---------------------------------------------------------------------
     Formatting helpers
     --------------------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  const courseByCode = (code) => COURSES.find((c) => c.code === code);
  const fmtCode = (code) => code.replace(/^([A-Z]+)(\d+)$/, '$1 $2');
  function fmtTime(t) {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
  }
  const DAY_NAMES = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };
  const fmtDays = (days) => days.join('/');
  const fmtSchedule = (c) => `${fmtDays(c.days)}, ${fmtTime(c.start)}–${fmtTime(c.end)}`;
  // Screen readers read "Mon/Wed" poorly, so give them full day names.
  const fmtScheduleLong = (c) => `${c.days.map((d) => DAY_NAMES[d]).join(', ')}, ${fmtTime(c.start)} to ${fmtTime(c.end)}`;
  const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const seatsOpen = (c) => Math.max(0, c.capacity - c.enrolled - (findReg(c.code) ? 1 : 0));
  const isFull = (c) => c.capacity - c.enrolled <= 0;
  function timeOfDay(c) {
    const start = toMinutes(c.start);
    if (start >= 17 * 60) return 'evening';
    if (start >= 12 * 60) return 'afternoon';
    return 'morning';
  }
  const initials = (name) => name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?';

  /* ---------------------------------------------------------------------
     Live announcements for screen readers
     --------------------------------------------------------------------- */
  let liveRegion;
  function announce(message) {
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.className = 'visually-hidden';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = '';
    // Small delay so repeated identical messages are still announced.
    setTimeout(() => { liveRegion.textContent = message; }, 100);
  }

  /* ---------------------------------------------------------------------
     Accessible confirmation modal (native <dialog> with showModal()):
     - focus is moved into the dialog and trapped; background is inert
     - Escape, the close button, Cancel, and backdrop click all cancel
     - focus returns to the element that opened it
     --------------------------------------------------------------------- */
  let dialogCount = 0;
  function confirmDialog({ title, bodyHtml, confirmLabel, cancelLabel = 'Cancel', destructive = false }) {
    const opener = document.activeElement;
    const id = `modal-${++dialogCount}`;

    if (typeof HTMLDialogElement !== 'function') {
      const tmp = document.createElement('div');
      tmp.innerHTML = bodyHtml;
      return Promise.resolve(window.confirm(`${title}\n\n${tmp.textContent.trim()}`));
    }

    return new Promise((resolve) => {
      const dlg = document.createElement('dialog');
      dlg.className = 'modal';
      dlg.setAttribute('aria-labelledby', `${id}-title`);
      dlg.setAttribute('aria-describedby', `${id}-body`);
      dlg.innerHTML = `
        <div class="modal-header${destructive ? ' danger' : ''}">
          <h2 class="modal-title" id="${id}-title"></h2>
          <button type="button" class="modal-close" data-act="cancel" aria-label="Close dialog"><span aria-hidden="true">×</span></button>
        </div>
        <div class="modal-body" id="${id}-body">${bodyHtml}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" data-act="cancel"></button>
          <button type="button" class="btn ${destructive ? 'btn-danger' : 'btn-primary'}" data-act="confirm"></button>
        </div>`;
      $('.modal-title', dlg).textContent = title;
      const [cancelBtn, confirmBtn] = $$('.modal-actions .btn', dlg);
      cancelBtn.textContent = cancelLabel;
      confirmBtn.textContent = confirmLabel;

      let result = false;
      dlg.addEventListener('click', (e) => {
        const actor = e.target.closest('[data-act]');
        if (actor) {
          result = actor.dataset.act === 'confirm';
          dlg.close();
        } else if (e.target === dlg) {
          dlg.close(); // backdrop click
        }
      });
      dlg.addEventListener('close', () => {
        dlg.remove();
        if (opener && document.contains(opener)) opener.focus();
        resolve(result);
      });

      document.body.appendChild(dlg);
      dlg.showModal();
      // For destructive actions start on the safe choice.
      (destructive ? cancelBtn : confirmBtn).focus();
    });
  }

  /* ---------------------------------------------------------------------
     Navigation: mobile menu toggle + disclosure dropdown
     --------------------------------------------------------------------- */
  function initNav() {
    const toggle = $('.nav-toggle');
    const nav = $('#primary-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('is-open', open);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true' && nav.contains(document.activeElement)
            && !$('.dropdown:not([hidden])', nav)) {
          toggle.setAttribute('aria-expanded', 'false');
          nav.classList.remove('is-open');
          toggle.focus();
        }
      });
    }

    $$('.has-dropdown').forEach((item) => {
      const btn = $('.dropdown-toggle', item);
      const menu = $('.dropdown', item);
      const links = () => $$('a', menu);
      const setOpen = (open) => {
        btn.setAttribute('aria-expanded', String(open));
        menu.hidden = !open;
      };

      btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setOpen(true);
          links()[0].focus();
        }
      });
      menu.addEventListener('keydown', (e) => {
        const list = links();
        const i = list.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
        if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
        if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.hidden) {
          e.stopPropagation();
          setOpen(false);
          btn.focus();
        }
      });
      // Close when focus or a click leaves the dropdown.
      item.addEventListener('focusout', (e) => {
        if (e.relatedTarget && !item.contains(e.relatedTarget)) setOpen(false);
      });
      document.addEventListener('click', (e) => { if (!item.contains(e.target)) setOpen(false); });
    });
  }

  /* ---------------------------------------------------------------------
     Course card
     --------------------------------------------------------------------- */
  function seatStatus(c) {
    const open = seatsOpen(c);
    if (isFull(c)) return { cls: 'full', label: 'Full', text: 'Full – no seats left' };
    if (open <= 5) return { cls: 'low', label: 'Few seats', text: `Few seats – ${open} of ${c.capacity} left` };
    return { cls: 'open', label: 'Open', text: `Open – ${open} of ${c.capacity} left` };
  }

  function courseCard(c, { headingLevel = 3, showActions = true } = {}) {
    const dept = DEPTS[c.dept];
    const reg = findReg(c.code);
    const status = seatStatus(c);
    const name = `${fmtCode(c.code)}, ${c.title}`;
    const fill = Math.round(((c.capacity - seatsOpen(c)) / c.capacity) * 100);
    const h = `h${headingLevel}`;

    let actions = '';
    if (showActions) {
      if (reg) {
        actions = `<span class="card-note registered">✓ Registered (${esc(reg.term)})</span>
          <a class="btn btn-outline btn-sm" href="profile.html#registered-heading">View in profile<span class="visually-hidden">: ${esc(name)}</span></a>`;
      } else if (isFull(c)) {
        actions = `<span class="card-note">This course is full.</span>`;
      } else {
        actions = `<a class="btn btn-primary" href="register.html?course=${encodeURIComponent(c.code)}">Register<span class="visually-hidden"> for ${esc(name)}</span></a>`;
      }
    }

    return `
      <article class="course-card" style="--dept:${dept.color};--dept-tint:${dept.tint}" aria-labelledby="title-${c.code}">
        <div class="card-body">
          <div class="card-top">
            <span class="dept-badge">${esc(dept.name)}</span>
            <span class="level-tag">${c.level}-level</span>
          </div>
          <${h} class="card-title" id="title-${c.code}"><span class="course-code">${fmtCode(c.code)}</span> ${esc(c.title)}</${h}>
          <p class="card-desc">${esc(c.description)}</p>
          <dl class="card-meta">
            <dt>Credits</dt><dd>${c.credits}</dd>
            <dt>Schedule</dt><dd><span aria-hidden="true">${fmtSchedule(c)}</span><span class="visually-hidden">${fmtScheduleLong(c)}</span></dd>
            <dt>Instructor</dt><dd>${esc(c.instructor)}</dd>
            <dt>Seats</dt><dd><span class="seat-status ${status.cls}">${status.text}</span></dd>
          </dl>
          <div class="seat-bar" aria-hidden="true"><span style="width:${fill}%"></span></div>
        </div>
        ${showActions ? `<div class="card-actions">${actions}</div>` : ''}
      </article>`;
  }

  /* ---------------------------------------------------------------------
     Registered-courses data table (register + profile pages)
     --------------------------------------------------------------------- */
  function renderRegTable(container) {
    const regs = getRegs()
      .map((r) => ({ ...r, course: courseByCode(r.code) }))
      .filter((r) => r.course)
      .sort((a, b) => TERMS.indexOf(a.term) - TERMS.indexOf(b.term) || a.code.localeCompare(b.code));

    if (!regs.length) {
      container.innerHTML = `
        <div class="empty-state">
          <p><strong>You are not registered for any courses yet.</strong></p>
          <p><a href="catalog.html">Browse the course catalog</a> to find courses that interest you.</p>
        </div>`;
      return;
    }

    const total = regs.reduce((sum, r) => sum + r.course.credits, 0);
    const captionId = `${container.id}-caption`;
    const rows = regs.map((r) => {
      const c = r.course;
      const dept = DEPTS[c.dept];
      return `
        <tr>
          <th scope="row"><span class="dept-dot" style="background:${dept.color}" aria-hidden="true"></span>${fmtCode(c.code)}</th>
          <td>${esc(c.title)}</td>
          <td>${esc(r.term)}</td>
          <td><span aria-hidden="true">${fmtSchedule(c)}</span><span class="visually-hidden">${fmtScheduleLong(c)}</span></td>
          <td>${esc(c.instructor)}</td>
          <td class="num">${c.credits}</td>
          <td>${esc(r.grading)}</td>
          <td><button type="button" class="btn btn-outline btn-sm" data-drop="${c.code}">Drop<span class="visually-hidden"> ${fmtCode(c.code)}, ${esc(c.title)}</span></button></td>
        </tr>`;
    }).join('');

    container.innerHTML = `
      <div class="table-wrap" role="region" aria-labelledby="${captionId}" tabindex="0">
        <table class="data-table">
          <caption id="${captionId}">Registered courses: ${regs.length} ${regs.length === 1 ? 'course' : 'courses'}, ${total} credits</caption>
          <thead>
            <tr>
              <th scope="col">Course</th>
              <th scope="col">Title</th>
              <th scope="col">Term</th>
              <th scope="col">Schedule</th>
              <th scope="col">Instructor</th>
              <th scope="col" class="num">Credits</th>
              <th scope="col">Grading</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <th scope="row" colspan="5">Total credits</th>
              <td class="num">${total}</td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>`;
  }

  /* Wires up Drop buttons; onChange lets each page refresh dependent UI. */
  function initRegTable(container, focusAfterDrop, onChange) {
    renderRegTable(container);
    container.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-drop]');
      if (!btn) return;
      const c = courseByCode(btn.dataset.drop);
      const reg = findReg(c.code);
      const ok = await confirmDialog({
        title: `Drop ${fmtCode(c.code)}?`,
        bodyHtml: `<p>You are about to drop <strong>${fmtCode(c.code)}: ${esc(c.title)}</strong> for ${esc(reg.term)}.</p>
                   <p>Your seat will be released and may be taken by another student. This cannot be undone.</p>`,
        confirmLabel: `Drop ${fmtCode(c.code)}`,
        cancelLabel: 'Keep course',
        destructive: true
      });
      if (!ok) return;
      setRegs(getRegs().filter((r) => r.code !== c.code));
      renderRegTable(container);
      if (onChange) onChange();
      // The button that opened the dialog is gone; move focus somewhere sensible.
      focusAfterDrop.focus();
      announce(`${fmtCode(c.code)} ${c.title} was dropped.`);
    });
  }

  /* ---------------------------------------------------------------------
     Form validation helpers
     --------------------------------------------------------------------- */
  function setFieldError(control, message) {
    const group = control.closest('fieldset.validate-group');
    const errorEl = document.getElementById(`${group ? group.id : control.id}-error`);
    const targets = group ? $$('input', group) : [control];

    if (message) {
      errorEl.innerHTML = `<span class="visually-hidden">Error:</span> ${esc(message)}`;
      errorEl.hidden = false;
      targets.forEach((t) => t.setAttribute('aria-invalid', 'true'));
      if (group) group.classList.add('invalid');
    } else {
      errorEl.textContent = '';
      errorEl.hidden = true;
      targets.forEach((t) => t.removeAttribute('aria-invalid'));
      if (group) group.classList.remove('invalid');
    }
  }

  /* Validates a form against rules {name: fn(form) -> message}.
     Returns [{control, message}] for failures. */
  function validateAll(form, rules) {
    const errors = [];
    Object.entries(rules).forEach(([name, rule]) => {
      const control = form.elements[name];
      const first = control instanceof RadioNodeList ? control[0] : control;
      const message = rule(form);
      setFieldError(first, message);
      if (message) errors.push({ control: first, message });
    });
    return errors;
  }

  function showErrorSummary(summary, errors, baseTitle) {
    const list = $('ul', summary);
    list.innerHTML = errors.map((e) => `<li><a href="#${e.control.id}">${esc(e.message)}</a></li>`).join('');
    $('.error-summary-title', summary).textContent = errors.length === 1 ? 'There is 1 problem with your submission' : `There are ${errors.length} problems with your submission`;
    summary.hidden = false;
    document.title = `Error: ${baseTitle}`;
    summary.focus();
  }

  function hideErrorSummary(summary, baseTitle) {
    summary.hidden = true;
    document.title = baseTitle;
  }

  function wireErrorSummaryLinks(summary) {
    summary.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) {
        target.scrollIntoView({ block: 'center' });
        target.focus();
      }
    });
  }

  /* Re-validate a field live once it has been flagged invalid, so the error
     clears (or updates) as soon as the user fixes it. */
  function wireLiveValidation(form, rules) {
    const handler = (e) => {
      const name = e.target.name;
      if (!rules[name]) return;
      const control = form.elements[name];
      const first = control instanceof RadioNodeList ? control[0] : control;
      if (first.getAttribute('aria-invalid') === 'true') setFieldError(first, rules[name](form));
    };
    form.addEventListener('input', handler);
    form.addEventListener('change', handler);
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------------------------------------------------------------------
     Home page
     --------------------------------------------------------------------- */
  function initHome() {
    const regs = getRegs();
    const credits = regs.reduce((sum, r) => sum + (courseByCode(r.code)?.credits || 0), 0);
    $('#stat-courses').textContent = COURSES.length;
    $('#stat-depts').textContent = Object.keys(DEPTS).length;
    $('#stat-open').textContent = COURSES.filter((c) => !isFull(c)).length;
    $('#stat-credits').textContent = credits;

    const featured = COURSES.filter((c) => c.featured);
    $('#featured-list').innerHTML = featured.map((c) => `<li>${courseCard(c)}</li>`).join('');

    const name = getProfile().name.split(' ')[0];
    const greet = $('#greeting-name');
    if (greet && name) greet.textContent = name;
  }

  /* ---------------------------------------------------------------------
     Catalog page: search, filters, sort, results
     --------------------------------------------------------------------- */
  function initCatalog() {
    const form = $('#filter-form');
    const search = $('#search');
    const dept = $('#filter-dept');
    const level = $('#filter-level');
    const credits = $('#filter-credits');
    const time = $('#filter-time');
    const openOnly = $('#filter-open');
    const sort = $('#sort');
    const list = $('#course-list');
    const count = $('#results-count');
    const resetBtn = $('#reset-filters');

    dept.insertAdjacentHTML('beforeend',
      Object.entries(DEPTS).map(([k, d]) => `<option value="${k}">${esc(d.name)}</option>`).join(''));

    // Restore state from the URL (supports search from the home page).
    const params = new URLSearchParams(location.search);
    search.value = params.get('q') || '';
    [[dept, 'dept'], [level, 'level'], [credits, 'credits'], [time, 'time'], [sort, 'sort']].forEach(([el, key]) => {
      const v = params.get(key);
      if (v && $$('option', el).some((o) => o.value === v)) el.value = v;
    });
    openOnly.checked = params.get('open') === '1';

    function apply({ announceResults = true } = {}) {
      const q = search.value.trim().toLowerCase();
      let results = COURSES.filter((c) => {
        const haystack = `${c.code} ${fmtCode(c.code)} ${c.title} ${c.instructor} ${c.description} ${DEPTS[c.dept].name}`.toLowerCase();
        return (!q || haystack.includes(q))
          && (!dept.value || c.dept === dept.value)
          && (!level.value || String(c.level) === level.value)
          && (!credits.value || String(c.credits) === credits.value)
          && (!time.value || timeOfDay(c) === time.value)
          && (!openOnly.checked || !isFull(c));
      });

      const sorters = {
        code: (a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }),
        title: (a, b) => a.title.localeCompare(b.title),
        seats: (a, b) => seatsOpen(b) - seatsOpen(a),
        credits: (a, b) => b.credits - a.credits || a.code.localeCompare(b.code)
      };
      results = results.sort(sorters[sort.value] || sorters.code);

      if (results.length) {
        list.innerHTML = results.map((c) => `<li>${courseCard(c)}</li>`).join('');
        list.hidden = false;
        $('#no-results').hidden = true;
      } else {
        list.innerHTML = '';
        list.hidden = true;
        $('#no-results').hidden = false;
      }

      const message = `Showing ${results.length} of ${COURSES.length} courses`;
      count.textContent = message + (q ? ` matching “${search.value.trim()}”` : '');
      if (announceResults) announce(count.textContent);

      // Keep the URL shareable and back-button friendly.
      const next = new URLSearchParams();
      if (search.value.trim()) next.set('q', search.value.trim());
      if (dept.value) next.set('dept', dept.value);
      if (level.value) next.set('level', level.value);
      if (credits.value) next.set('credits', credits.value);
      if (time.value) next.set('time', time.value);
      if (openOnly.checked) next.set('open', '1');
      if (sort.value !== 'code') next.set('sort', sort.value);
      const qs = next.toString();
      history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
    }

    let timer;
    search.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(apply, 350);
    });
    [dept, level, credits, time, openOnly, sort].forEach((el) => el.addEventListener('change', () => apply()));
    form.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
    $('#search-form').addEventListener('submit', (e) => { e.preventDefault(); clearTimeout(timer); apply(); });

    function reset() {
      search.value = '';
      [dept, level, credits, time].forEach((el) => { el.value = ''; });
      openOnly.checked = false;
      sort.value = 'code';
      apply();
    }
    resetBtn.addEventListener('click', () => { reset(); search.focus(); });
    $('#no-results-reset').addEventListener('click', () => { reset(); search.focus(); });

    apply({ announceResults: false });
  }

  /* ---------------------------------------------------------------------
     Registration page
     --------------------------------------------------------------------- */
  function courseProblem(code, term) {
    if (!code) return 'Select a course to register for.';
    const c = courseByCode(code);
    const existing = findReg(code);
    if (existing) return `You are already registered for ${fmtCode(code)} in ${existing.term}. Choose a different course.`;
    if (isFull(c)) return `${fmtCode(code)} is full. Choose a course that has open seats.`;
    if (!term) return '';

    const termRegs = getRegs().filter((r) => r.term === term).map((r) => courseByCode(r.code)).filter(Boolean);
    const clash = termRegs.find((o) =>
      o.days.some((d) => c.days.includes(d))
      && toMinutes(c.start) < toMinutes(o.end) && toMinutes(o.start) < toMinutes(c.end));
    if (clash) {
      return `${fmtCode(code)} (${fmtScheduleLong(c)}) conflicts with ${fmtCode(clash.code)}, which you already take in ${term} (${fmtScheduleLong(clash)}). Choose a different course or term.`;
    }
    const current = termRegs.reduce((s, o) => s + o.credits, 0);
    if (current + c.credits > MAX_CREDITS) {
      return `Adding ${fmtCode(code)} (${c.credits} credits) would bring your ${term} total to ${current + c.credits} credits. The maximum is ${MAX_CREDITS}.`;
    }
    return '';
  }

  function initRegister() {
    const BASE_TITLE = document.title;
    const form = $('#registration-form');
    const summary = $('#error-summary');
    const courseSelect = $('#course');
    const termSelect = $('#term');
    const preview = $('#course-preview');
    const success = $('#registration-success');
    const tableHeading = $('#registered-heading');
    const table = $('#registered-table');

    termSelect.insertAdjacentHTML('beforeend', TERMS.map((t) => `<option>${t}</option>`).join(''));
    termSelect.value = 'Fall 2027';

    function buildCourseOptions() {
      const selected = courseSelect.value;
      const groups = Object.entries(DEPTS).map(([key, d]) => {
        const opts = COURSES.filter((c) => c.dept === key).map((c) => {
          const note = findReg(c.code) ? ' (already registered)' : isFull(c) ? ' (full)' : '';
          return `<option value="${c.code}">${fmtCode(c.code)}: ${esc(c.title)} – ${c.credits} credits${note}</option>`;
        }).join('');
        return `<optgroup label="${esc(d.name)}">${opts}</optgroup>`;
      }).join('');
      courseSelect.innerHTML = `<option value="">Choose a course…</option>${groups}`;
      courseSelect.value = selected;
    }

    function updatePreview() {
      const c = courseByCode(courseSelect.value);
      preview.innerHTML = c
        ? courseCard(c, { headingLevel: 3, showActions: false })
        : '<p class="preview-empty">Select a course to see its schedule, instructor, and seat availability.</p>';
    }

    // Prefill from profile and from ?course= links on the catalog.
    const profile = getProfile();
    form.elements.fullName.value = profile.name;
    form.elements.studentId.value = profile.studentId;
    form.elements.email.value = profile.email;
    buildCourseOptions();
    const requested = new URLSearchParams(location.search).get('course');
    if (requested && courseByCode(requested)) courseSelect.value = requested;
    updatePreview();

    const rules = {
      fullName: (f) => (f.elements.fullName.value.trim() ? '' : 'Enter your full name.'),
      studentId: (f) => {
        const v = f.elements.studentId.value.trim();
        if (!v) return 'Enter your student ID.';
        return /^\d{8}$/.test(v) ? '' : 'Student ID must be exactly 8 digits, for example 20241234.';
      },
      email: (f) => {
        const v = f.elements.email.value.trim();
        if (!v) return 'Enter your email address.';
        return EMAIL_RE.test(v) ? '' : 'Enter an email address in the format name@example.edu.';
      },
      term: (f) => (f.elements.term.value ? '' : 'Select the term you want to register for.'),
      course: (f) => courseProblem(f.elements.course.value, f.elements.term.value),
      grading: (f) => (f.elements.grading.value ? '' : 'Choose a grading option: letter grade or pass/no pass.'),
      prereq: (f) => (f.elements.prereq.checked ? '' : 'Confirm that you have met the course prerequisites.')
    };

    wireLiveValidation(form, rules);
    wireErrorSummaryLinks(summary);

    // Warn about conflicts, full courses, and credit limits as soon as a course
    // is picked, rather than waiting for submit.
    const checkCourse = () => {
      if (courseSelect.value) setFieldError(courseSelect, rules.course(form));
    };
    courseSelect.addEventListener('change', () => { updatePreview(); checkCourse(); });
    termSelect.addEventListener('change', checkCourse);
    if (requested) checkCourse();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      success.hidden = true;
      const errors = validateAll(form, rules);
      if (errors.length) {
        showErrorSummary(summary, errors, BASE_TITLE);
        return;
      }
      hideErrorSummary(summary, BASE_TITLE);

      const c = courseByCode(courseSelect.value);
      const data = {
        name: form.elements.fullName.value.trim(),
        id: form.elements.studentId.value.trim(),
        email: form.elements.email.value.trim(),
        term: termSelect.value,
        grading: form.elements.grading.value,
        notes: form.elements.notes.value.trim()
      };

      const ok = await confirmDialog({
        title: 'Confirm your registration',
        bodyHtml: `
          <p>Please review your registration details before submitting.</p>
          <dl>
            <dt>Course</dt><dd>${fmtCode(c.code)}: ${esc(c.title)}</dd>
            <dt>Term</dt><dd>${esc(data.term)}</dd>
            <dt>Schedule</dt><dd>${fmtScheduleLong(c)}</dd>
            <dt>Instructor</dt><dd>${esc(c.instructor)}</dd>
            <dt>Credits</dt><dd>${c.credits}</dd>
            <dt>Grading</dt><dd>${esc(data.grading)}</dd>
            <dt>Student</dt><dd>${esc(data.name)} (ID ${esc(data.id)})</dd>
            <dt>Email</dt><dd>${esc(data.email)}</dd>
          </dl>`,
        confirmLabel: 'Confirm registration',
        cancelLabel: 'Go back and edit'
      });
      if (!ok) return;

      setRegs([...getRegs(), { code: c.code, term: data.term, grading: data.grading, date: new Date().toISOString().slice(0, 10) }]);

      // Reset course-specific fields; keep student details for the next course.
      courseSelect.value = '';
      form.elements.notes.value = '';
      form.elements.prereq.checked = false;
      buildCourseOptions();
      updatePreview();
      renderRegTable(table);

      $('#success-text').innerHTML = `You are registered for <strong>${fmtCode(c.code)}: ${esc(c.title)}</strong> in ${esc(data.term)}. A confirmation was sent to ${esc(data.email)}.`;
      success.hidden = false;
      $('h2', success).focus();
    });

    initRegTable(table, tableHeading, () => {
      buildCourseOptions();
      updatePreview();
    });
  }

  /* ---------------------------------------------------------------------
     Profile page
     --------------------------------------------------------------------- */
  function initProfile() {
    const BASE_TITLE = document.title;
    const form = $('#contact-form');
    const summary = $('#error-summary');
    const saved = $('#profile-saved');

    function renderOverview() {
      const p = getProfile();
      $('#avatar').textContent = initials(p.name);
      $('#profile-name').textContent = p.name;
      $('#profile-major').textContent = `${p.major} · ${p.year}`;
      $('#pd-id').textContent = p.studentId;
      $('#pd-email').textContent = p.email;
      $('#pd-phone').textContent = p.phone || 'Not provided';
      $('#pd-advisor').textContent = p.advisor;
    }

    function renderCredits() {
      const regs = getRegs();
      $('#credit-list').innerHTML = TERMS.map((term, i) => {
        const credits = regs.filter((r) => r.term === term).reduce((s, r) => s + (courseByCode(r.code)?.credits || 0), 0);
        return `<li>
            <label for="credits-${i}"><span>${term}</span><span>${credits} of ${MAX_CREDITS} credits</span></label>
            <progress id="credits-${i}" max="${MAX_CREDITS}" value="${credits}">${credits} of ${MAX_CREDITS} credits</progress>
          </li>`;
      }).join('');
    }

    function fillForm() {
      const p = getProfile();
      ['name', 'email', 'phone', 'major', 'year'].forEach((k) => { form.elements[k].value = p[k]; });
    }

    const rules = {
      name: (f) => (f.elements.name.value.trim() ? '' : 'Enter your full name.'),
      email: (f) => {
        const v = f.elements.email.value.trim();
        if (!v) return 'Enter your email address.';
        return EMAIL_RE.test(v) ? '' : 'Enter an email address in the format name@example.edu.';
      },
      phone: (f) => {
        const v = f.elements.phone.value.trim();
        return !v || /^[+()\d\s.-]{7,20}$/.test(v) ? '' : 'Enter a phone number using digits only, for example 555-123-4567.';
      },
      major: (f) => (f.elements.major.value ? '' : 'Select your major.'),
      year: (f) => (f.elements.year.value ? '' : 'Select your class year.')
    };

    renderOverview();
    renderCredits();
    fillForm();
    wireLiveValidation(form, rules);
    wireErrorSummaryLinks(summary);

    form.addEventListener('input', () => { saved.hidden = true; });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saved.hidden = true;
      const errors = validateAll(form, rules);
      if (errors.length) {
        showErrorSummary(summary, errors, BASE_TITLE);
        return;
      }
      hideErrorSummary(summary, BASE_TITLE);
      const p = getProfile();
      ['name', 'email', 'phone', 'major', 'year'].forEach((k) => { p[k] = form.elements[k].value.trim(); });
      setProfile(p);
      renderOverview();
      saved.hidden = false;
      announce('Your contact information was saved.');
    });

    $('#contact-reset').addEventListener('click', () => {
      fillForm();
      Object.keys(rules).forEach((name) => setFieldError(form.elements[name], ''));
      hideErrorSummary(summary, BASE_TITLE);
      saved.hidden = true;
      announce('Changes discarded.');
    });

    initRegTable($('#registered-table'), $('#registered-heading'), renderCredits);
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    const page = document.body.dataset.page;
    ({ home: initHome, catalog: initCatalog, register: initRegister, profile: initProfile }[page] || (() => {}))();
  });
})();
