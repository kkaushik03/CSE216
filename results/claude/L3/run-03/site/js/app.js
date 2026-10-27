/* Northfield University – Course Registration
   Shared behaviour plus page-specific controllers (chosen by <body data-page>). */
(function () {
  'use strict';

  const KEYS = { regs: 'nu.registrations', profile: 'nu.profile' };
  const DEFAULT_PROFILE = {
    name: 'Jordan Rivera',
    studentId: 'S1234567',
    email: 'jordan.rivera@northfield.edu',
    major: 'Computer Science',
    year: 'Sophomore'
  };
  const ID_PATTERN = /^S\d{7}$/;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ERROR_ICON =
    '<svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M12 2 1 21h22L12 2zm1 15h-2v2h2v-2zm0-7h-2v5h2v-5z"/></svg>';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ---------- Storage ---------- */
  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  function getRegs() {
    let regs = read(KEYS.regs, null);
    if (!Array.isArray(regs)) {
      // Seed one course so the profile table has example content on first visit.
      regs = [{ id: 'MATH120', term: TERMS[0], date: new Date().toISOString() }];
      write(KEYS.regs, regs);
    }
    return regs.filter((r) => courseById(r.id));
  }
  const saveRegs = (regs) => write(KEYS.regs, regs);
  const getProfile = () => Object.assign({}, DEFAULT_PROFILE, read(KEYS.profile, {}));
  const saveProfile = (p) => write(KEYS.profile, p);

  /* ---------- Course helpers ---------- */
  function courseById(id) { return COURSES.find((c) => c.id === id); }
  function isRegistered(id) { return getRegs().some((r) => r.id === id); }
  function seatsOpen(c) { return c.seats - c.enrolled - (isRegistered(c.id) ? 1 : 0); }

  function formatTime(t) {
    let [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, '0')} ${suffix}`;
  }
  function schedule(c) {
    return `${c.days.join(', ')}, ${formatTime(c.start)} to ${formatTime(c.end)}`;
  }
  function overlaps(a, b) {
    return a.days.some((d) => b.days.includes(d)) && a.start < b.end && b.start < a.end;
  }
  function credits(ids) {
    return ids.reduce((sum, id) => sum + courseById(id).credits, 0);
  }
  function plural(n, word) { return `${n} ${word}${n === 1 ? '' : 's'}`; }

  function seatBadge(c) {
    if (isRegistered(c.id)) {
      return '<span class="badge badge--registered"><span aria-hidden="true">✓</span> Registered</span>';
    }
    const open = seatsOpen(c);
    if (open <= 0) return '<span class="badge badge--full"><span aria-hidden="true">✕</span> Full – 0 seats open</span>';
    if (open <= 5) return `<span class="badge badge--low"><span aria-hidden="true">!</span> Only ${plural(open, 'seat')} left</span>`;
    return `<span class="badge badge--open"><span aria-hidden="true">●</span> ${plural(open, 'seat')} open</span>`;
  }

  /* ---------- Live announcements ---------- */
  function announce(message) {
    const region = $('#sr-announcer');
    if (!region) return;
    region.textContent = '';
    window.setTimeout(() => { region.textContent = message; }, 100);
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    const toggle = $('.nav-toggle');
    const menu = $('#primary-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    // Close the menu when focus or a click leaves the navigation.
    const nav = toggle.closest('nav');
    nav.addEventListener('focusout', (e) => {
      if (e.relatedTarget && !nav.contains(e.relatedTarget)) setOpen(false);
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) setOpen(false);
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', (mq) => {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- Modal dialogs (native <dialog> provides focus containment & Esc) ---------- */
  function setupDialog(dialog) {
    $$('[data-close]', dialog).forEach((btn) => btn.addEventListener('click', () => dialog.close('cancel')));
    // Clicking the backdrop closes the dialog.
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close('cancel'); });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      const target = dialog._returnFocus;
      dialog._returnFocus = null;
      if (target && target.isConnected) target.focus();
    });
  }
  function openDialog(dialog, returnFocus) {
    dialog._returnFocus = returnFocus || document.activeElement;
    dialog.showModal();
    document.body.classList.add('modal-open');
    const first = $('[data-initial-focus]', dialog);
    if (first) first.focus();
  }

  /* ---------- Form error helpers ---------- */
  function setFieldError(control, message) {
    const errorEl = document.getElementById(`${control.id}-error`);
    const isGroup = control.tagName === 'FIELDSET';
    if (message) {
      if (isGroup) control.classList.add('is-invalid');
      else control.setAttribute('aria-invalid', 'true');
      errorEl.innerHTML = `${ERROR_ICON}<span><span class="visually-hidden">Error: </span>${esc(message)}</span>`;
      errorEl.hidden = false;
    } else {
      if (isGroup) control.classList.remove('is-invalid');
      else control.removeAttribute('aria-invalid');
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  }

  function showErrorSummary(summary, errors) {
    const list = $('ul', summary);
    list.innerHTML = errors.map((e) => `<li><a href="#${e.focusId}">${esc(e.message)}</a></li>`).join('');
    summary.hidden = false;
    summary.focus();
  }
  function hideErrorSummary(summary) {
    summary.hidden = true;
    $('ul', summary).innerHTML = '';
  }
  function wireErrorSummaryLinks(summary) {
    summary.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) {
        e.preventDefault();
        target.focus();
      }
    });
  }

  /* ---------- Course card markup ---------- */
  function cardHTML(c) {
    const dept = DEPARTMENTS[c.dept];
    const headingId = `course-${c.id}-title`;
    const fullName = `${c.code}: ${c.title}`;
    let action;
    if (isRegistered(c.id)) {
      action = `<a class="btn btn-secondary btn-small" href="profile.html">View in profile<span class="visually-hidden">: ${esc(fullName)}</span></a>`;
    } else if (seatsOpen(c) <= 0) {
      action = '<span class="hint">Registration closed</span>';
    } else {
      action = `<a class="btn btn-primary btn-small" href="register.html?course=${encodeURIComponent(c.id)}">Register<span class="visually-hidden"> for ${esc(fullName)}</span></a>`;
    }
    return `
      <li class="course-card dept-${dept.color}">
        <article aria-labelledby="${headingId}">
          <div class="card-band">
            <span>${esc(dept.name)}</span>
            <span class="card-code">${esc(c.code)}</span>
          </div>
          <div class="card-body">
            <h3 id="${headingId}"><span class="visually-hidden">${esc(c.code)}: </span>${esc(c.title)}</h3>
            <p class="card-desc">${esc(c.description)}</p>
            <dl class="meta">
              <dt>Instructor</dt><dd>${esc(c.instructor)}</dd>
              <dt>Schedule</dt><dd>${esc(schedule(c))}</dd>
              <dt>Credits</dt><dd>${c.credits}</dd>
              <dt>Level</dt><dd>${c.level}-level</dd>
            </dl>
            <div class="card-footer">
              ${seatBadge(c)}
              ${action}
            </div>
          </div>
        </article>
      </li>`;
  }

  /* ======================================================================
     Page: Home
     ====================================================================== */
  function initHome() {
    const tiles = $('#dept-tiles');
    if (tiles) {
      tiles.innerHTML = Object.entries(DEPARTMENTS).map(([key, d]) => {
        const count = COURSES.filter((c) => c.dept === key).length;
        return `<li><a class="dept-tile dept-${d.color}" href="catalog.html?dept=${key}">
            ${esc(d.name)}<span>${plural(count, 'course')}<span class="visually-hidden"> in ${esc(d.name)}</span></span>
          </a></li>`;
      }).join('');
    }
    const regCount = $('#home-reg-count');
    if (regCount) regCount.textContent = String(getRegs().length);
    const courseCount = $('#home-course-count');
    if (courseCount) courseCount.textContent = String(COURSES.length);
  }

  /* ======================================================================
     Page: Course catalog
     ====================================================================== */
  function initCatalog() {
    const form = $('#catalog-filters');
    const search = $('#search');
    const dept = $('#filter-dept');
    const level = $('#filter-level');
    const creditsSel = $('#filter-credits');
    const openOnly = $('#filter-open');
    const grid = $('#course-grid');
    const empty = $('#empty-state');
    const count = $('#results-count');

    Object.entries(DEPARTMENTS).forEach(([key, d]) => dept.add(new Option(d.name, key)));

    const params = new URLSearchParams(location.search);
    if (params.get('q')) search.value = params.get('q');
    if (DEPARTMENTS[params.get('dept')]) dept.value = params.get('dept');

    function render() {
      const term = search.value.trim().toLowerCase();
      const results = COURSES.filter((c) => {
        const haystack = [c.id, c.code, c.title, c.instructor, c.description, DEPARTMENTS[c.dept].name]
          .join(' ').toLowerCase();
        return (!term || haystack.includes(term)) &&
          (!dept.value || c.dept === dept.value) &&
          (!level.value || String(c.level) === level.value) &&
          (!creditsSel.value || String(c.credits) === creditsSel.value) &&
          (!openOnly.checked || seatsOpen(c) > 0);
      });
      grid.innerHTML = results.map(cardHTML).join('');
      grid.hidden = results.length === 0;
      empty.hidden = results.length !== 0;
      count.textContent = results.length === COURSES.length
        ? `Showing all ${COURSES.length} courses.`
        : `Showing ${results.length} of ${COURSES.length} courses.`;
    }

    let timer;
    search.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(render, 350);
    });
    [dept, level, creditsSel, openOnly].forEach((el) => el.addEventListener('change', render));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.clearTimeout(timer);
      render();
    });
    form.addEventListener('reset', () => {
      window.setTimeout(() => {
        render();
        search.focus();
      }, 0);
    });
    $('#empty-reset').addEventListener('click', () => form.reset());

    render();
  }

  /* ======================================================================
     Page: Registration
     ====================================================================== */
  function initRegister() {
    const form = $('#registration-form');
    const summary = $('#error-summary');
    const fields = {
      studentId: $('#student-id'),
      name: $('#student-name'),
      email: $('#student-email'),
      term: $('#term'),
      courses: $('#courses'),
      agree: $('#agree')
    };
    const optionsWrap = $('#course-options');
    const tally = $('#credit-tally');
    const meter = $('#credit-meter-fill');
    const selectedList = $('#selected-list');
    const dialog = $('#confirm-dialog');
    const success = $('#reg-success');
    const touched = new Set();

    setupDialog(dialog);
    wireErrorSummaryLinks(summary);

    // Pre-fill from the stored profile (WCAG 3.3.7 Redundant Entry).
    const profile = getProfile();
    fields.studentId.value = profile.studentId;
    fields.name.value = profile.name;
    fields.email.value = profile.email;
    TERMS.forEach((t) => fields.term.add(new Option(t, t)));

    const preselect = new Set();
    const requested = new URLSearchParams(location.search).get('course');
    if (requested && courseById(requested)) preselect.add(requested);

    function renderOptions(selected) {
      optionsWrap.innerHTML = Object.entries(DEPARTMENTS).map(([key, d]) => {
        const items = COURSES.filter((c) => c.dept === key).map((c) => {
          const registered = isRegistered(c.id);
          const full = !registered && seatsOpen(c) <= 0;
          const disabled = registered || full;
          const status = registered
            ? '<span class="opt-status opt-status--registered">Already registered</span>'
            : full
              ? '<span class="opt-status opt-status--full">Course full</span>'
              : `<span class="opt-status">${plural(seatsOpen(c), 'seat')} open</span>`;
          return `
            <li class="course-option${disabled ? ' is-disabled' : ''}">
              <input type="checkbox" id="opt-${c.id}" name="courses" value="${c.id}"
                aria-describedby="opt-${c.id}-desc"
                ${selected.has(c.id) && !disabled ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
              <label for="opt-${c.id}"><span class="opt-code">${esc(c.code)}</span> ${esc(c.title)}</label>
              <p class="opt-desc" id="opt-${c.id}-desc">${plural(c.credits, 'credit')} · ${esc(schedule(c))} · ${status}</p>
            </li>`;
        }).join('');
        return `<fieldset class="dept-group dept-${d.color}">
            <legend>${esc(d.name)}</legend>
            <ul class="course-options" role="list">${items}</ul>
          </fieldset>`;
      }).join('');
    }

    const selectedIds = () => $$('input[name="courses"]:checked', optionsWrap).map((i) => i.value);
    const termRegs = (term) => getRegs().filter((r) => r.term === term).map((r) => r.id);

    function updateTally() {
      const ids = selectedIds();
      const existing = fields.term.value ? credits(termRegs(fields.term.value)) : 0;
      const total = credits(ids) + existing;
      meter.style.width = `${Math.min(100, (total / MAX_CREDITS) * 100)}%`;
      meter.classList.toggle('is-over', total > MAX_CREDITS);
      const termText = fields.term.value
        ? `${plural(existing, 'credit')} already registered for ${fields.term.value}.`
        : 'Choose a term to include credits you already have.';
      tally.textContent = `${plural(ids.length, 'course')} selected, ${plural(credits(ids), 'credit')}. ` +
        `${termText} Term total: ${total} of ${MAX_CREDITS} credits.`;
      selectedList.innerHTML = ids.length
        ? ids.map((id) => `<li>${esc(courseById(id).code)} – ${esc(courseById(id).title)}</li>`).join('')
        : '<li>No courses selected yet.</li>';
    }

    /* Validation: each validator returns an error message or ''. */
    const validators = {
      studentId: () => {
        const v = fields.studentId.value.trim();
        if (!v) return 'Enter your student ID.';
        if (!ID_PATTERN.test(v.toUpperCase())) return 'Student ID must be the letter S followed by 7 digits, for example S1234567.';
        return '';
      },
      name: () => (fields.name.value.trim() ? '' : 'Enter your full name.'),
      email: () => {
        const v = fields.email.value.trim();
        if (!v) return 'Enter your university email address.';
        if (!EMAIL_PATTERN.test(v)) return 'Enter an email address in the correct format, like name@northfield.edu.';
        return '';
      },
      term: () => (fields.term.value ? '' : 'Select a term.'),
      courses: () => {
        const ids = selectedIds();
        if (!ids.length) return 'Select at least one course.';
        if (fields.term.value) {
          const total = credits(ids) + credits(termRegs(fields.term.value));
          if (total > MAX_CREDITS) {
            return `Your ${fields.term.value} total would be ${total} credits. Remove courses to stay at or below ${MAX_CREDITS} credits.`;
          }
          const existing = termRegs(fields.term.value);
          for (let i = 0; i < ids.length; i++) {
            const others = ids.slice(i + 1).concat(existing);
            const a = courseById(ids[i]);
            const clash = others.map(courseById).find((b) => overlaps(a, b));
            if (clash) {
              const already = existing.includes(clash.id) ? ' (already registered)' : '';
              return `${a.code} and ${clash.code}${already} meet at the same time. Choose only one of them.`;
            }
          }
        }
        return '';
      },
      agree: () => (fields.agree.checked ? '' : 'Confirm that you meet the prerequisites to continue.')
    };
    const focusTargets = {
      courses: () => ($('input[name="courses"]:not(:disabled)', optionsWrap) || fields.courses).id
    };

    function validateField(name) {
      const message = validators[name]();
      setFieldError(fields[name], message);
      return message;
    }

    // Re-validate fields after the first submit attempt so errors clear as they are fixed.
    ['studentId', 'name', 'email', 'term', 'agree'].forEach((name) => {
      const el = fields[name];
      const evt = ['text', 'email'].includes(el.type) ? 'input' : 'change';
      el.addEventListener(evt, () => { if (touched.has(name)) validateField(name); });
    });
    optionsWrap.addEventListener('change', () => {
      updateTally();
      if (touched.has('courses')) validateField('courses');
    });
    fields.term.addEventListener('change', () => {
      updateTally();
      if (touched.has('courses')) validateField('courses');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      success.hidden = true;
      const errors = [];
      Object.keys(fields).forEach((name) => {
        touched.add(name);
        const message = validateField(name);
        if (message) {
          errors.push({ message, focusId: focusTargets[name] ? focusTargets[name]() : fields[name].id });
        }
      });
      if (errors.length) {
        showErrorSummary(summary, errors);
        return;
      }
      hideErrorSummary(summary);
      fillConfirmation();
      openDialog(dialog, $('#review-btn'));
    });

    function fillConfirmation() {
      const ids = selectedIds();
      $('#confirm-student').textContent = `${fields.name.value.trim()} (${fields.studentId.value.trim().toUpperCase()})`;
      $('#confirm-term').textContent = fields.term.value;
      $('#confirm-list').innerHTML = ids.map((id) => {
        const c = courseById(id);
        return `<li><strong>${esc(c.code)}</strong> ${esc(c.title)} – ${plural(c.credits, 'credit')}, ${esc(schedule(c))}</li>`;
      }).join('');
      $('#confirm-credits').textContent = plural(credits(ids), 'credit');
    }

    $('#confirm-submit').addEventListener('click', () => {
      const ids = selectedIds();
      const term = fields.term.value;
      const now = new Date().toISOString();
      saveRegs(getRegs().concat(ids.map((id) => ({ id, term, date: now }))));
      saveProfile(Object.assign(getProfile(), {
        studentId: fields.studentId.value.trim().toUpperCase(),
        name: fields.name.value.trim(),
        email: fields.email.value.trim()
      }));

      const codes = ids.map((id) => courseById(id).code).join(', ');
      $('#reg-success-text').textContent =
        `You are registered for ${plural(ids.length, 'course')} in ${term}: ${codes}.`;
      success.hidden = false;
      dialog._returnFocus = success; // move focus to the confirmation message
      dialog.close('confirm');

      fields.agree.checked = false;
      touched.clear();
      renderOptions(new Set());
      updateTally();
    });

    renderOptions(preselect);
    updateTally();
  }

  /* ======================================================================
     Page: Student profile
     ====================================================================== */
  function initProfile() {
    const form = $('#profile-form');
    const summary = $('#profile-error-summary');
    const status = $('#profile-status');
    const f = {
      name: $('#p-name'),
      studentId: $('#p-id'),
      email: $('#p-email'),
      major: $('#p-major'),
      year: $('#p-year')
    };
    const dialog = $('#drop-dialog');
    let pendingDrop = null;

    setupDialog(dialog);
    wireErrorSummaryLinks(summary);

    function fillProfile() {
      const p = getProfile();
      Object.keys(f).forEach((k) => { f[k].value = p[k]; });
      $('#profile-display-name').textContent = p.name;
      $('#profile-display-meta').textContent = `${p.year} · ${p.major} · ${p.studentId}`;
      $('#avatar').textContent = p.name.split(/\s+/).filter(Boolean).map((s) => s[0]).slice(0, 2).join('').toUpperCase();
    }

    const validators = {
      name: () => (f.name.value.trim() ? '' : 'Enter your full name.'),
      studentId: () => {
        const v = f.studentId.value.trim();
        if (!v) return 'Enter your student ID.';
        return ID_PATTERN.test(v.toUpperCase()) ? '' : 'Student ID must be the letter S followed by 7 digits, for example S1234567.';
      },
      email: () => {
        const v = f.email.value.trim();
        if (!v) return 'Enter your university email address.';
        return EMAIL_PATTERN.test(v) ? '' : 'Enter an email address in the correct format, like name@northfield.edu.';
      }
    };
    Object.keys(validators).forEach((k) => {
      f[k].addEventListener('input', () => {
        if (f[k].getAttribute('aria-invalid') === 'true') setFieldError(f[k], validators[k]());
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = '';
      const errors = [];
      Object.keys(validators).forEach((k) => {
        const message = validators[k]();
        setFieldError(f[k], message);
        if (message) errors.push({ message, focusId: f[k].id });
      });
      if (errors.length) {
        showErrorSummary(summary, errors);
        return;
      }
      hideErrorSummary(summary);
      saveProfile({
        name: f.name.value.trim(),
        studentId: f.studentId.value.trim().toUpperCase(),
        email: f.email.value.trim(),
        major: f.major.value,
        year: f.year.value
      });
      fillProfile();
      status.textContent = 'Your profile has been saved.';
    });

    function renderTable() {
      const regs = getRegs().slice().sort((a, b) =>
        TERMS.indexOf(a.term) - TERMS.indexOf(b.term) || a.id.localeCompare(b.id));
      const tbody = $('#reg-tbody');
      const wrap = $('#table-wrap');
      const empty = $('#reg-empty');
      const total = regs.reduce((s, r) => s + courseById(r.id).credits, 0);

      $('#stat-courses').textContent = String(regs.length);
      $('#stat-credits').textContent = String(total);
      $('#stat-terms').textContent = String(new Set(regs.map((r) => r.term)).size);

      wrap.hidden = regs.length === 0;
      empty.hidden = regs.length !== 0;

      tbody.innerHTML = regs.map((r) => {
        const c = courseById(r.id);
        const d = DEPARTMENTS[c.dept];
        return `<tr>
            <th scope="row"><span class="dept-dot dept-${d.color}" aria-hidden="true"></span>${esc(c.code)}</th>
            <td>${esc(c.title)}</td>
            <td>${esc(d.name)}</td>
            <td>${esc(r.term)}</td>
            <td>${esc(schedule(c))}</td>
            <td>${esc(c.instructor)}</td>
            <td class="num">${c.credits}</td>
            <td><button type="button" class="btn btn-secondary btn-small" data-drop="${c.id}" data-term="${esc(r.term)}">
              Drop<span class="visually-hidden"> ${esc(c.code)}: ${esc(c.title)}</span></button></td>
          </tr>`;
      }).join('');
      $('#reg-total').textContent = String(total);
    }

    $('#reg-tbody').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-drop]');
      if (!btn) return;
      const c = courseById(btn.dataset.drop);
      pendingDrop = { id: c.id, term: btn.dataset.term };
      $('#drop-text').textContent =
        `Are you sure you want to drop ${c.code}: ${c.title} (${btn.dataset.term})? Your seat will be released to other students.`;
      openDialog(dialog, btn);
    });

    $('#drop-confirm').addEventListener('click', () => {
      if (!pendingDrop) return;
      const c = courseById(pendingDrop.id);
      saveRegs(getRegs().filter((r) => !(r.id === pendingDrop.id && r.term === pendingDrop.term)));
      pendingDrop = null;
      dialog._returnFocus = $('#registered-heading');
      dialog.close('confirm');
      renderTable();
      const remaining = getRegs().length;
      announce(`${c.code} dropped. You are now registered for ${plural(remaining, 'course')}.`);
    });
    dialog.addEventListener('close', () => { pendingDrop = null; });

    fillProfile();
    renderTable();
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    const page = document.body.dataset.page;
    if (page === 'home') initHome();
    if (page === 'catalog') initCatalog();
    if (page === 'register') initRegister();
    if (page === 'profile') initProfile();
  });
})();
