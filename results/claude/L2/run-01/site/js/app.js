/* Northfield University – Course Registration
   Shared behaviour for all pages. State lives in localStorage so the
   selection list, registrations and profile persist between pages. */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  const COURSES = window.COURSES || [];
  const DEPARTMENTS = window.DEPARTMENTS || {};
  const MAX_CREDITS = 18;
  const TERMS = ['Spring 2027', 'Summer 2027'];
  const DAY_NAMES = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };
  const KEYS = { cart: 'nu.cart', registered: 'nu.registered', profile: 'nu.profile' };
  const DEFAULT_PROFILE = {
    fullName: 'Jordan Avery',
    studentId: '20251234',
    email: 'jordan.avery@northfield.edu',
    program: 'Computer Science',
    year: 'Sophomore'
  };

  /* ---------- Storage ---------- */
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    }
  };

  const getCart = () => store.get(KEYS.cart, []).filter(courseById);
  const setCart = (ids) => { store.set(KEYS.cart, ids); updateCartBadge(); };
  // Registrations: [{ id, term, date }]
  const getRegistered = () => store.get(KEYS.registered, []).filter((r) => courseById(r.id));
  const setRegistered = (list) => store.set(KEYS.registered, list);
  const getProfile = () => Object.assign({}, DEFAULT_PROFILE, store.get(KEYS.profile, {}));
  const setProfile = (p) => store.set(KEYS.profile, p);

  const isRegistered = (id) => getRegistered().some((r) => r.id === id);
  const inCart = (id) => getCart().includes(id);

  /* ---------- Helpers ---------- */
  function courseById(id) { return COURSES.find((c) => c.id === id); }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function formatTime(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
  }

  const courseCode = (c) => `${c.dept} ${c.number}`;
  const formatDays = (c) => c.days.join(', ');
  const formatDaysLong = (c) => c.days.map((d) => DAY_NAMES[d]).join(', ');
  const formatSchedule = (c) => `${formatDays(c)} · ${formatTime(c.start)}–${formatTime(c.end)}`;
  const deptColor = (c) => (DEPARTMENTS[c.dept] || {}).color || 'var(--c-indigo)';
  const deptName = (c) => (DEPARTMENTS[c.dept] || {}).name || c.dept;
  const sumCredits = (list) => list.reduce((total, c) => total + c.credits, 0);

  function seatsLeft(c) {
    const taken = c.enrolled + (isRegistered(c.id) ? 1 : 0);
    return Math.max(0, c.capacity - taken);
  }

  function overlaps(a, b) {
    return a.days.some((d) => b.days.includes(d)) && a.start < b.end && b.start < a.end;
  }

  function findConflicts(courses) {
    const pairs = [];
    for (let i = 0; i < courses.length; i++) {
      for (let j = i + 1; j < courses.length; j++) {
        if (overlaps(courses[i], courses[j])) pairs.push([courses[i], courses[j]]);
      }
    }
    return pairs;
  }

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || '?';
  }

  /** Announce a message to screen readers through the page's polite live region. */
  function announce(message) {
    const region = document.getElementById('announcer');
    if (!region) return;
    region.textContent = '';
    // Small delay so repeated identical messages are still announced.
    window.setTimeout(() => { region.textContent = message; }, 50);
  }

  function debounce(fn, wait) {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), wait);
    };
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('open', open);
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset state when moving from the mobile to desktop layout.
    window.matchMedia('(min-width: 761px)').addEventListener('change', (mq) => {
      if (mq.matches) setOpen(false);
    });
  }

  function updateCartBadge() {
    const count = getCart().length;
    document.querySelectorAll('[data-cart-count]').forEach((badge) => {
      badge.dataset.count = String(count);
      badge.querySelector('[aria-hidden]').textContent = String(count);
      badge.querySelector('.visually-hidden').textContent =
        count ? `(${count} course${count === 1 ? '' : 's'} selected)` : '';
    });
  }

  /* ---------- Modal dialog ---------- */
  function initDialog() {
    const dialog = document.getElementById('confirm-dialog');
    if (!dialog) return null;

    const title = dialog.querySelector('#dialog-title');
    const body = dialog.querySelector('#dialog-body');
    const header = dialog.querySelector('.modal-header');
    const confirmBtn = dialog.querySelector('[data-dialog-confirm]');
    const cancelBtn = dialog.querySelector('[data-dialog-cancel]');
    let onConfirm = null;
    let returnFocusTo = null;
    let fallbackFocus = null;

    function close() {
      if (dialog.open) dialog.close();
    }

    dialog.addEventListener('close', () => {
      const target = returnFocusTo && document.contains(returnFocusTo) ? returnFocusTo : fallbackFocus;
      if (target) target.focus();
      onConfirm = null;
    });

    // Clicking the backdrop (the dialog element itself) closes the modal.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) close();
    });

    dialog.querySelectorAll('[data-dialog-cancel], .modal-close').forEach((btn) => {
      btn.addEventListener('click', close);
    });

    confirmBtn.addEventListener('click', () => {
      const action = onConfirm;
      // Run the action first so it can set where focus should land afterwards.
      if (action) action();
      close();
    });

    return {
      open(options) {
        title.textContent = options.title;
        body.innerHTML = options.bodyHTML;
        confirmBtn.textContent = options.confirmText || 'Confirm';
        confirmBtn.className = `btn ${options.danger ? 'btn-danger' : 'btn-primary'}`;
        cancelBtn.textContent = options.cancelText || 'Cancel';
        header.classList.toggle('danger', Boolean(options.danger));
        onConfirm = options.onConfirm;
        returnFocusTo = document.activeElement;
        fallbackFocus = options.fallbackFocus || null;
        dialog.showModal();
        // Destructive actions start on the safe choice.
        (options.danger ? cancelBtn : confirmBtn).focus();
      },
      setReturnFocus(el) { returnFocusTo = el; }
    };
  }

  /* ---------- Course card ---------- */
  function cardActionHTML(c) {
    if (isRegistered(c.id)) {
      return `<span class="status-pill status-registered"><span aria-hidden="true">✓</span> Registered</span>
              <a class="btn btn-secondary btn-sm" href="profile.html">View schedule</a>`;
    }
    if (seatsLeft(c) === 0 && !inCart(c.id)) {
      return '<span class="status-pill status-full"><span aria-hidden="true">✕</span> Class full</span>';
    }
    const selected = inCart(c.id);
    return `<button type="button" class="btn ${selected ? 'btn-primary' : 'btn-secondary'} btn-sm"
              data-action="toggle-cart" data-id="${c.id}" data-in-cart="${selected}"
              aria-label="${selected ? 'Remove' : 'Add'} ${courseCode(c)} ${escapeHTML(c.title)} ${selected ? 'from' : 'to'} registration list">
              ${selected ? '<span aria-hidden="true">✓</span> Added – remove' : '<span aria-hidden="true">+</span> Add to registration'}
            </button>`;
  }

  function courseCardHTML(c, headingLevel) {
    const h = headingLevel || 3;
    const left = seatsLeft(c);
    const pctFull = Math.round(((c.capacity - left) / c.capacity) * 100);
    const seatClass = left === 0 ? 'full' : left <= 5 ? 'low' : '';
    const seatText = left === 0 ? 'No seats left' : `${left} of ${c.capacity} seats available${left <= 5 ? ' – almost full' : ''}`;

    return `
      <li>
        <article class="course-card" style="--dept:${deptColor(c)}" aria-labelledby="title-${c.id}">
          <div class="course-card-body">
            <div class="card-top">
              <span class="dept-badge">${escapeHTML(deptName(c))}</span>
              <span class="credits-badge">${c.credits} credits</span>
            </div>
            <h${h} id="title-${c.id}">
              <span class="course-code">${courseCode(c)}</span>
              ${escapeHTML(c.title)}
            </h${h}>
            <p class="desc">${escapeHTML(c.description)}</p>
            <dl class="meta">
              <dt>Instructor</dt><dd>${escapeHTML(c.instructor)}</dd>
              <dt>Schedule</dt><dd><span aria-hidden="true">${formatSchedule(c)}</span><span class="visually-hidden">${formatDaysLong(c)}, ${formatTime(c.start)} to ${formatTime(c.end)}</span></dd>
              <dt>Location</dt><dd>${escapeHTML(c.location)}</dd>
            </dl>
            <div class="seats">
              <span class="seats-text ${seatClass}">${seatText}</span>
              <div class="meter" aria-hidden="true"><div class="meter-fill" style="width:${pctFull}%"></div></div>
            </div>
          </div>
          <div class="card-actions" data-actions-for="${c.id}">${cardActionHTML(c)}</div>
        </article>
      </li>`;
  }

  /** Delegated handler for add/remove buttons inside a card container. */
  function bindCardActions(container) {
    container.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-action="toggle-cart"]');
      if (!btn) return;
      const id = btn.dataset.id;
      const c = courseById(id);
      const cart = getCart();
      const adding = !cart.includes(id);
      setCart(adding ? cart.concat(id) : cart.filter((x) => x !== id));

      // Re-render the action area and keep focus on the (new) toggle button.
      const area = container.querySelector(`[data-actions-for="${id}"]`);
      area.innerHTML = cardActionHTML(c);
      const newBtn = area.querySelector('[data-action="toggle-cart"]');
      if (newBtn) newBtn.focus();

      const count = getCart().length;
      announce(`${courseCode(c)} ${adding ? 'added to' : 'removed from'} your registration list. ${count} course${count === 1 ? '' : 's'} selected.`);
    });
  }

  /* ---------- Home page ---------- */
  function initHome() {
    const stats = document.getElementById('home-stats');
    if (stats) {
      const openSeats = COURSES.reduce((total, c) => total + seatsLeft(c), 0);
      const values = {
        courses: COURSES.length,
        departments: Object.keys(DEPARTMENTS).length,
        seats: openSeats,
        registered: getRegistered().length
      };
      stats.querySelectorAll('[data-stat]').forEach((el) => { el.textContent = values[el.dataset.stat]; });
    }

    const deptList = document.getElementById('dept-list');
    if (deptList) {
      deptList.innerHTML = Object.entries(DEPARTMENTS).map(([code, d]) => {
        const count = COURSES.filter((c) => c.dept === code).length;
        return `<li>
          <a class="dept-tile" style="--dept:${d.color}" href="catalog.html?dept=${code}">
            <span class="dept-icon" aria-hidden="true">${d.icon}</span>
            <span>${escapeHTML(d.name)}<small>${count} course${count === 1 ? '' : 's'}</small></span>
          </a>
        </li>`;
      }).join('');
    }

    const featured = document.getElementById('featured-courses');
    if (featured) {
      const picks = ['CS350', 'PSY101', 'ART105'].map(courseById).filter(Boolean);
      featured.innerHTML = picks.map((c) => courseCardHTML(c, 3)).join('');
      bindCardActions(featured);
    }
  }

  /* ---------- Catalog page ---------- */
  function initCatalog() {
    const form = document.getElementById('filter-form');
    const results = document.getElementById('course-results');
    const countEl = document.getElementById('results-count');
    if (!form || !results) return;

    const fields = {
      q: form.elements.q,
      dept: form.elements.dept,
      level: form.elements.level,
      credits: form.elements.credits,
      day: form.elements.day,
      open: form.elements.open,
      sort: form.elements.sort
    };

    fields.dept.insertAdjacentHTML('beforeend', Object.entries(DEPARTMENTS)
      .map(([code, d]) => `<option value="${code}">${escapeHTML(d.name)}</option>`).join(''));

    // Pre-fill from the URL (e.g. links from the home page).
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) fields.q.value = params.get('q');
    if (params.get('dept') && DEPARTMENTS[params.get('dept')]) fields.dept.value = params.get('dept');

    function filtered() {
      const q = fields.q.value.trim().toLowerCase();
      const list = COURSES.filter((c) => {
        const haystack = [c.id, courseCode(c), c.title, c.instructor, c.description, deptName(c)].join(' ').toLowerCase();
        if (q && !q.split(/\s+/).every((term) => haystack.includes(term))) return false;
        if (fields.dept.value && c.dept !== fields.dept.value) return false;
        if (fields.level.value && Math.floor(c.number / 100) * 100 !== Number(fields.level.value)) return false;
        if (fields.credits.value && c.credits !== Number(fields.credits.value)) return false;
        if (fields.day.value && !c.days.includes(fields.day.value)) return false;
        if (fields.open.checked && seatsLeft(c) === 0) return false;
        return true;
      });

      const sorters = {
        code: (a, b) => a.dept.localeCompare(b.dept) || a.number - b.number,
        title: (a, b) => a.title.localeCompare(b.title),
        seats: (a, b) => seatsLeft(b) - seatsLeft(a),
        credits: (a, b) => b.credits - a.credits || a.title.localeCompare(b.title)
      };
      return list.sort(sorters[fields.sort.value] || sorters.code);
    }

    function render() {
      const list = filtered();
      if (list.length) {
        results.innerHTML = list.map((c) => courseCardHTML(c, 3)).join('');
      } else {
        results.innerHTML = `<li class="empty-state">
          <span class="emoji" aria-hidden="true">🔍</span>
          <h3>No courses match your search</h3>
          <p>Try a different keyword or clear some filters.</p>
        </li>`;
      }
      countEl.textContent = `Showing ${list.length} of ${COURSES.length} courses`;

      // Keep the URL shareable without adding history entries.
      const next = new URLSearchParams();
      if (fields.q.value.trim()) next.set('q', fields.q.value.trim());
      if (fields.dept.value) next.set('dept', fields.dept.value);
      const query = next.toString();
      window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
    }

    fields.q.addEventListener('input', debounce(render, 250));
    form.addEventListener('change', (event) => {
      if (event.target !== fields.q) render();
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      render();
    });
    form.addEventListener('reset', () => {
      // Wait for the browser to reset the controls before re-rendering.
      window.setTimeout(() => {
        render();
        fields.q.focus();
        announce('All filters cleared.');
      }, 0);
    });

    bindCardActions(results);
    render();
  }

  /* ---------- Registration page ---------- */
  function initRegister() {
    const form = document.getElementById('registration-form');
    if (!form) return;

    const dialog = initDialog();
    const optionsList = document.getElementById('course-options');
    const summary = document.getElementById('credit-summary');
    const summaryText = document.getElementById('credit-summary-text');
    const meterFill = summary.querySelector('.meter-fill');
    const errorSummary = document.getElementById('error-summary');
    const successBox = document.getElementById('registration-success');
    const termSelect = form.elements.term;

    termSelect.innerHTML = TERMS.map((t) => `<option>${t}</option>`).join('');

    // Prefill the student details from the saved profile.
    const profile = getProfile();
    ['fullName', 'studentId', 'email', 'program', 'year'].forEach((name) => {
      form.elements[name].value = profile[name] || '';
    });

    // Preselect a course passed in the URL (?course=CS101).
    const requested = new URLSearchParams(window.location.search).get('course');
    if (requested && courseById(requested) && !isRegistered(requested) && !inCart(requested)) {
      setCart(getCart().concat(requested));
    }

    function renderOptions() {
      const cart = getCart();
      optionsList.innerHTML = COURSES.map((c) => {
        const registered = isRegistered(c.id);
        const full = seatsLeft(c) === 0;
        const disabled = registered || full;
        let note = '';
        if (registered) note = '<span class="opt-note ok">Already registered</span>';
        else if (full) note = '<span class="opt-note">Class full – unavailable</span>';
        return `<li class="course-option" style="--dept:${deptColor(c)}">
          <label class="checkbox">
            <input type="checkbox" name="courses" value="${c.id}"
              ${cart.includes(c.id) && !disabled ? 'checked' : ''} ${disabled ? 'disabled' : ''}
              aria-describedby="courses-error">
            <span>
              <span class="opt-title">${courseCode(c)}: ${escapeHTML(c.title)}</span>
              <span class="opt-meta">${c.credits} credits · ${formatDaysLong(c)}, ${formatTime(c.start)} to ${formatTime(c.end)}</span>
              ${note}
            </span>
          </label>
        </li>`;
      }).join('');
    }

    const selectedCourses = () =>
      Array.from(form.querySelectorAll('input[name="courses"]:checked')).map((i) => courseById(i.value));
    const registeredCourses = () => getRegistered().map((r) => courseById(r.id));

    function updateSummary() {
      const selected = selectedCourses();
      const existing = sumCredits(registeredCourses());
      const total = existing + sumCredits(selected);
      const over = total > MAX_CREDITS;
      summary.classList.toggle('over', over);
      meterFill.style.width = `${Math.min(100, (total / MAX_CREDITS) * 100)}%`;
      summaryText.textContent =
        `${selected.length} course${selected.length === 1 ? '' : 's'} selected (${sumCredits(selected)} credits). ` +
        `Total with current registrations: ${total} of ${MAX_CREDITS} credits` +
        (over ? ' – over the limit.' : '.');
    }

    /* Validation */
    const validators = {
      fullName: (v) => (v.trim() ? '' : 'Enter your full name.'),
      studentId: (v) => (!v.trim() ? 'Enter your student ID.'
        : /^\d{8}$/.test(v.trim()) ? '' : 'Student ID must be exactly 8 digits, for example 20251234.'),
      email: (v) => (!v.trim() ? 'Enter your university email address.'
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address, for example name@northfield.edu.'),
      program: (v) => (v ? '' : 'Select your program of study.'),
      year: (v) => (v ? '' : 'Select your year of study.'),
      term: (v) => (v ? '' : 'Select a term.')
    };

    function setFieldError(name, message) {
      const errorEl = document.getElementById(`${name}-error`);
      if (errorEl) errorEl.textContent = message;
      const control = form.elements[name];
      if (control && !(control instanceof RadioNodeList)) {
        if (message) control.setAttribute('aria-invalid', 'true');
        else control.removeAttribute('aria-invalid');
      }
    }

    function validate() {
      const errors = [];
      Object.entries(validators).forEach(([name, check]) => {
        const message = check(form.elements[name].value);
        setFieldError(name, message);
        if (message) errors.push({ target: name, message });
      });

      const selected = selectedCourses();
      let courseMessage = '';
      if (!selected.length) {
        courseMessage = 'Select at least one course.';
      } else {
        const total = sumCredits(registeredCourses()) + sumCredits(selected);
        const conflicts = findConflicts(registeredCourses().concat(selected));
        if (total > MAX_CREDITS) {
          courseMessage = `You have ${total} credits; the maximum is ${MAX_CREDITS}. Remove a course to continue.`;
        } else if (conflicts.length) {
          const [a, b] = conflicts[0];
          courseMessage = `${courseCode(a)} and ${courseCode(b)} meet at the same time. Choose only one of them.`;
        }
      }
      document.getElementById('courses-error').textContent = courseMessage;
      if (courseMessage) errors.push({ target: 'courses', message: courseMessage });

      const agree = form.elements.agree;
      const agreeMessage = agree.checked ? '' : 'Confirm that you have read the registration policy.';
      setFieldError('agree', agreeMessage);
      if (agreeMessage) errors.push({ target: 'agree', message: agreeMessage });

      return errors;
    }

    function showErrorSummary(errors) {
      const list = errorSummary.querySelector('ul');
      list.innerHTML = errors.map((e) => {
        const id = e.target === 'courses' ? 'courses-legend' : e.target;
        return `<li><a href="#${id}">${escapeHTML(e.message)}</a></li>`;
      }).join('');
      errorSummary.hidden = false;
      errorSummary.focus();
    }

    // Error summary links move focus to the relevant control.
    errorSummary.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;
      event.preventDefault();
      const id = link.getAttribute('href').slice(1);
      const target = id === 'courses-legend'
        ? form.querySelector('input[name="courses"]:not(:disabled)')
        : document.getElementById(id);
      if (target) {
        target.focus();
        target.scrollIntoView({ block: 'center' });
      }
    });

    // Clear an individual field's error as soon as it becomes valid.
    form.addEventListener('input', (event) => {
      const name = event.target.name;
      if (validators[name] && event.target.getAttribute('aria-invalid') === 'true') {
        setFieldError(name, validators[name](event.target.value));
      }
    });

    form.addEventListener('change', (event) => {
      if (event.target.name === 'courses') {
        const ids = selectedCourses().map((c) => c.id);
        setCart(ids);
        updateSummary();
      }
      if (event.target.name === 'agree' && event.target.checked) setFieldError('agree', '');
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      successBox.hidden = true;
      const errors = validate();
      if (errors.length) {
        showErrorSummary(errors);
        return;
      }
      errorSummary.hidden = true;

      const selected = selectedCourses();
      const total = sumCredits(selected);
      const data = new FormData(form);
      dialog.open({
        title: 'Confirm your registration',
        confirmText: 'Confirm registration',
        cancelText: 'Go back and edit',
        bodyHTML: `
          <p id="dialog-desc">Please review your selection for <strong>${escapeHTML(data.get('term'))}</strong>.
            Registering as <strong>${escapeHTML(data.get('fullName').trim())}</strong> (ID ${escapeHTML(data.get('studentId').trim())}).</p>
          <ul class="summary-list">
            ${selected.map((c) => `<li style="--dept:${deptColor(c)}">
              <span><strong>${courseCode(c)}</strong> ${escapeHTML(c.title)}</span>
              <span>${c.credits} cr</span></li>`).join('')}
          </ul>
          <p><strong>${selected.length} course${selected.length === 1 ? '' : 's'}, ${total} credits.</strong>
            You can drop courses from your profile page until the add/drop deadline.</p>`,
        onConfirm: () => completeRegistration(data, selected)
      });
    });

    function completeRegistration(data, selected) {
      const today = new Date().toISOString().slice(0, 10);
      const term = data.get('term');
      setRegistered(getRegistered().concat(selected.map((c) => ({ id: c.id, term, date: today }))));
      setProfile({
        fullName: data.get('fullName').trim(),
        studentId: data.get('studentId').trim(),
        email: data.get('email').trim(),
        program: data.get('program'),
        year: data.get('year')
      });
      setCart([]);
      form.elements.agree.checked = false;
      renderOptions();
      updateSummary();

      const credits = sumCredits(selected);
      successBox.querySelector('[data-success-text]').textContent =
        `You are registered for ${selected.length} course${selected.length === 1 ? '' : 's'} ` +
        `(${selected.map(courseCode).join(', ')}) totalling ${credits} credits for ${term}.`;
      successBox.hidden = false;
      dialog.setReturnFocus(successBox);
    }

    renderOptions();
    updateSummary();
  }

  /* ---------- Profile page ---------- */
  function initProfile() {
    const tableBody = document.getElementById('registered-body');
    if (!tableBody) return;
    const dialog = initDialog();
    const heading = document.getElementById('registered-heading');

    function renderProfile() {
      const p = getProfile();
      document.getElementById('avatar').textContent = initials(p.fullName);
      document.querySelectorAll('[data-profile]').forEach((el) => {
        el.textContent = p[el.dataset.profile] || '—';
      });
    }

    function renderTable() {
      const regs = getRegistered();
      const courses = regs.map((r) => courseById(r.id));
      const credits = sumCredits(courses);

      document.querySelector('[data-stat="courses"]').textContent = courses.length;
      document.querySelector('[data-stat="credits"]').textContent = credits;
      document.querySelector('[data-stat="remaining"]').textContent = Math.max(0, MAX_CREDITS - credits);
      document.querySelector('[data-stat="selected"]').textContent = getCart().length;
      document.getElementById('total-credits').textContent = credits;

      if (!regs.length) {
        tableBody.innerHTML = `<tr><td colspan="7">
          <div class="empty-state">
            <span class="emoji" aria-hidden="true">📚</span>
            <p><strong>You have not registered for any courses yet.</strong></p>
            <a class="btn btn-primary" href="catalog.html">Browse the course catalog</a>
          </div></td></tr>`;
        return;
      }

      tableBody.innerHTML = regs.map((r) => {
        const c = courseById(r.id);
        return `<tr>
          <th scope="row"><span class="code-chip" style="--dept:${deptColor(c)}">${courseCode(c)}</span></th>
          <td>${escapeHTML(c.title)}</td>
          <td class="num">${c.credits}</td>
          <td>${escapeHTML(c.instructor)}</td>
          <td><span aria-hidden="true"><span class="nowrap">${formatDays(c)}</span><br><span class="nowrap">${formatTime(c.start)}–${formatTime(c.end)}</span></span><span class="visually-hidden">${formatDaysLong(c)}, ${formatTime(c.start)} to ${formatTime(c.end)}</span></td>
          <td>${escapeHTML(r.term)}</td>
          <td><button type="button" class="btn btn-danger btn-sm" data-drop="${c.id}"
                aria-label="Drop ${courseCode(c)} ${escapeHTML(c.title)}">Drop</button></td>
        </tr>`;
      }).join('');
    }

    tableBody.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-drop]');
      if (!btn) return;
      const c = courseById(btn.dataset.drop);
      dialog.open({
        title: `Drop ${courseCode(c)}?`,
        danger: true,
        confirmText: 'Yes, drop course',
        cancelText: 'Keep course',
        fallbackFocus: heading,
        bodyHTML: `<p>Are you sure you want to drop <strong>${courseCode(c)}: ${escapeHTML(c.title)}</strong>
          (${c.credits} credits)? Your seat will be released to other students.</p>`,
        onConfirm: () => {
          setRegistered(getRegistered().filter((r) => r.id !== c.id));
          renderTable();
          announce(`${courseCode(c)} dropped. You are now registered for ${sumCredits(getRegistered().map((r) => courseById(r.id)))} credits.`);
        }
      });
    });

    renderProfile();
    renderTable();
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    updateCartBadge();
    const page = document.body.dataset.page;
    if (page === 'home') initHome();
    if (page === 'catalog') initCatalog();
    if (page === 'register') initRegister();
    if (page === 'profile') initProfile();
  });
})();
