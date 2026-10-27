/* Northbrook University course registration – shared behaviour and page controllers. */
(function () {
  'use strict';

  const { COURSES, DEPARTMENTS, TERM, MAX_CREDITS } = window.UCR_DATA;
  const DAY_NAMES = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };

  /* ---------- Storage ---------- */

  const KEYS = {
    cart: 'ucr.cart',
    registered: 'ucr.registered',
    student: 'ucr.student',
    seeded: 'ucr.seeded'
  };

  const store = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* Storage unavailable (e.g. private mode) – the app still works for this page view. */
      }
    }
  };

  // Give first-time visitors a sample student and two courses so every page has content.
  function seedDemoData() {
    if (store.get(KEYS.seeded, false)) return;
    store.set(KEYS.student, {
      fullName: 'Jordan Lee',
      studentId: '20241234',
      email: 'jordan.lee@northbrook.edu',
      major: 'Computer Science',
      standing: 'Sophomore',
      term: TERM
    });
    store.set(KEYS.registered, ['ENG110', 'MATH151']);
    store.set(KEYS.cart, []);
    store.set(KEYS.seeded, true);
  }

  const getRegistered = () => store.get(KEYS.registered, []).filter(findCourse);
  const getStudent = () => store.get(KEYS.student, null);
  // The cart never contains courses that are already registered.
  const getCart = () => {
    const registered = getRegistered();
    return store.get(KEYS.cart, []).filter((id) => findCourse(id) && !registered.includes(id));
  };
  const setCart = (ids) => store.set(KEYS.cart, ids);

  /* ---------- Course helpers ---------- */

  function findCourse(id) {
    return COURSES.find((c) => c.id === id) || null;
  }

  function toMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  function formatTime(time) {
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  }

  function formatDays(course) {
    return course.days.map((d) => DAY_NAMES[d]).join(', ');
  }

  function formatSchedule(course) {
    return `${formatDays(course)}, ${formatTime(course.start)} to ${formatTime(course.end)}`;
  }

  function courseName(course) {
    return `${course.id} ${course.title}`;
  }

  function openSeats(course) {
    const taken = course.enrolled + (getRegistered().includes(course.id) ? 1 : 0);
    return Math.max(0, course.seats - taken);
  }

  function coursesConflict(a, b) {
    const sharesDay = a.days.some((d) => b.days.includes(d));
    return sharesDay && toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
  }

  function totalCredits(ids) {
    return ids.reduce((sum, id) => sum + (findCourse(id)?.credits || 0), 0);
  }

  /* ---------- DOM helpers ---------- */

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === 'className') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key === 'style') node.style.cssText = value;
      else node.setAttribute(key, value === true ? '' : value);
    });
    children.flat().forEach((child) => {
      if (child === null || child === undefined || child === false) return;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  }

  const srOnly = (text) => el('span', { className: 'visually-hidden', text });

  function announce(message) {
    const region = document.getElementById('sr-announcer');
    if (!region) return;
    region.textContent = '';
    // A short delay makes screen readers treat repeated messages as new.
    window.setTimeout(() => { region.textContent = message; }, 100);
  }

  function debounce(fn, wait) {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), wait);
    };
  }

  /* ---------- Accessible modal (native <dialog>) ---------- */

  function createModal(dialog) {
    let returnFocusTo = null;

    dialog.addEventListener('close', () => {
      if (returnFocusTo && document.contains(returnFocusTo)) returnFocusTo.focus();
      returnFocusTo = null;
    });

    // Clicking the backdrop (outside .modal-inner) closes the dialog.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close('cancel');
    });

    dialog.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => dialog.close('cancel'));
    });

    return {
      open(trigger) {
        returnFocusTo = trigger || document.activeElement;
        dialog.showModal();
        const initial = dialog.querySelector('[data-autofocus]');
        if (initial) initial.focus();
      },
      close(focusTarget) {
        if (focusTarget) returnFocusTo = focusTarget;
        dialog.close('confirm');
      }
    };
  }

  /* ---------- Navigation ---------- */

  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('primary-menu');
    if (toggle && menu) {
      const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        menu.classList.toggle('is-open', open);
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
      window.matchMedia('(min-width: 48em)').addEventListener('change', (event) => {
        if (event.matches) setOpen(false);
      });
    }
    updateCartBadge();
  }

  function updateCartBadge() {
    const count = getCart().length;
    document.querySelectorAll('[data-cart-count]').forEach((badge) => {
      badge.replaceChildren(String(count), srOnly(count === 1 ? ' course selected' : ' courses selected'));
      badge.hidden = count === 0;
    });
  }

  /* ---------- Catalog page ---------- */

  function initCatalog() {
    const form = document.getElementById('filter-form');
    const list = document.getElementById('course-list');
    const count = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    const controls = {
      q: document.getElementById('search'),
      dept: document.getElementById('filter-dept'),
      level: document.getElementById('filter-level'),
      credits: document.getElementById('filter-credits'),
      days: document.getElementById('filter-days'),
      availability: document.getElementById('filter-availability'),
      sort: document.getElementById('sort-by')
    };

    Object.entries(DEPARTMENTS).forEach(([code, dept]) => {
      controls.dept.append(el('option', { value: code, text: dept.name }));
    });

    // Restore state from the URL (e.g. links from the home page).
    const params = new URLSearchParams(window.location.search);
    Object.entries(controls).forEach(([key, control]) => {
      const value = params.get(key);
      if (value === null) return;
      if (control.tagName === 'SELECT' && ![...control.options].some((o) => o.value === value)) return;
      control.value = value;
    });

    function getFilters() {
      return Object.fromEntries(Object.entries(controls).map(([key, c]) => [key, c.value.trim()]));
    }

    function matches(course, f) {
      if (f.q) {
        const haystack = [course.id, course.title, course.instructor, course.description, DEPARTMENTS[course.dept].name]
          .join(' ').toLowerCase();
        const terms = f.q.toLowerCase().split(/\s+/);
        if (!terms.every((t) => haystack.includes(t))) return false;
      }
      if (f.dept && course.dept !== f.dept) return false;
      if (f.level && course.level !== Number(f.level)) return false;
      if (f.credits && course.credits !== Number(f.credits)) return false;
      if (f.days && !course.days.includes(f.days)) return false;
      if (f.availability === 'open' && openSeats(course) === 0) return false;
      return true;
    }

    const sorters = {
      code: (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }),
      title: (a, b) => a.title.localeCompare(b.title),
      seats: (a, b) => openSeats(b) - openSeats(a),
      credits: (a, b) => b.credits - a.credits || a.id.localeCompare(b.id)
    };

    function render() {
      const filters = getFilters();
      const results = COURSES.filter((c) => matches(c, filters)).sort(sorters[filters.sort] || sorters.code);

      list.replaceChildren(...results.map((c) => el('li', {}, buildCard(c))));
      noResults.hidden = results.length > 0;
      count.textContent = results.length === 1
        ? '1 course found'
        : `${results.length} courses found`;

      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && !(key === 'sort' && value === 'code')) query.set(key, value);
      });
      const qs = query.toString();
      try {
        window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
      } catch (e) {
        /* Some browsers block history updates for file:// pages. */
      }
    }

    function buildCard(course) {
      const dept = DEPARTMENTS[course.dept];
      const seats = openSeats(course);
      const pct = Math.round(((course.seats - seats) / course.seats) * 100);
      let seatText = `${seats} of ${course.seats} seats open`;
      if (seats === 0) seatText = 'Full – no seats open';
      else if (seats <= 5) seatText = `Only ${seats} of ${course.seats} seats left`;

      return el('article', {
        className: 'course-card',
        style: `--dept-color:${dept.color}`,
        'aria-labelledby': `code-${course.id} title-${course.id}`
      },
      el('div', { className: 'course-card-top' },
        el('span', { className: 'course-code', id: `code-${course.id}`, text: course.id }),
        el('span', { className: 'course-dept', text: dept.name })
      ),
      el('div', { className: 'course-card-body' },
        el('h3', { id: `title-${course.id}`, text: course.title }),
        el('p', { className: 'course-desc', text: course.description }),
        el('dl', { className: 'course-meta' },
          metaRow('Instructor', course.instructor),
          metaRow('Schedule', formatSchedule(course)),
          metaRow('Room', course.room),
          metaRow('Credits', String(course.credits)),
          metaRow('Level', `${course.level} level`)
        ),
        el('div', { className: `seats${seats === 0 ? ' seats-full' : seats <= 5 ? ' seats-low' : ''}` },
          el('p', { className: 'seats-text', text: seatText }),
          el('div', { className: 'seat-bar', 'aria-hidden': 'true' },
            el('span', { style: `width:${pct}%` })
          )
        )
      ),
      el('div', { className: 'course-card-footer' }, buildAction(course, seats))
      );
    }

    function metaRow(term, value) {
      return el('div', {}, el('dt', { text: term }), el('dd', { text: value }));
    }

    function buildAction(course, seats) {
      if (getRegistered().includes(course.id)) {
        return el('p', { className: 'tag tag-success' }, el('span', { 'aria-hidden': 'true', text: '✓ ' }), 'Already registered');
      }
      if (seats === 0) {
        return el('p', { className: 'tag tag-muted', text: 'Course full – registration closed' });
      }
      const inCart = getCart().includes(course.id);
      const btn = el('button', {
        type: 'button',
        className: inCart ? 'btn btn-secondary btn-block' : 'btn btn-primary btn-block',
        'data-course': course.id
      });
      setActionLabel(btn, course, inCart);
      return btn;
    }

    function setActionLabel(btn, course, inCart) {
      // Visible text comes first so the accessible name contains it (WCAG 2.5.3).
      btn.replaceChildren(
        inCart ? 'Remove from registration list' : 'Add to registration list',
        srOnly(`: ${courseName(course)}`)
      );
      btn.className = inCart ? 'btn btn-secondary btn-block' : 'btn btn-primary btn-block';
    }

    list.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-course]');
      if (!btn) return;
      const course = findCourse(btn.dataset.course);
      const cart = getCart();
      const inCart = cart.includes(course.id);
      const next = inCart ? cart.filter((id) => id !== course.id) : [...cart, course.id];
      setCart(next);
      setActionLabel(btn, course, !inCart);
      updateCartBadge();

      const countText = next.length === 1 ? '1 course' : `${next.length} courses`;
      announce(inCart
        ? `${courseName(course)} removed from your registration list. ${countText} selected.`
        : `${courseName(course)} added to your registration list. ${countText} selected.`);
    });

    const debouncedRender = debounce(render, 350);
    controls.q.addEventListener('input', debouncedRender);
    form.addEventListener('change', (event) => {
      if (event.target !== controls.q) render();
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      render();
    });
    form.addEventListener('reset', () => {
      // Values are reset after the event handlers run.
      window.setTimeout(() => {
        render();
        announce('Search and filters cleared.');
      }, 0);
    });

    render();
  }

  /* ---------- Registration page ---------- */

  function initRegistration() {
    const form = document.getElementById('registration-form');
    const summary = document.getElementById('error-summary');
    const summaryList = document.getElementById('error-summary-list');
    const choices = document.getElementById('course-choices');
    const creditTotal = document.getElementById('credit-total');
    const successPanel = document.getElementById('success-panel');
    const successMessage = document.getElementById('success-message');
    const modal = createModal(document.getElementById('confirm-dialog'));
    let attempted = false;
    let pending = null;

    // Pre-fill from the saved profile.
    const student = getStudent();
    if (student) {
      form.fullName.value = student.fullName || '';
      form.studentId.value = student.studentId || '';
      form.email.value = student.email || '';
      form.major.value = student.major || '';
      const standing = form.querySelector(`input[name="standing"][value="${student.standing}"]`);
      if (standing) standing.checked = true;
    }

    function renderChoices() {
      const cart = getCart();
      if (cart.length === 0) {
        choices.replaceChildren(
          el('p', { className: 'notice notice-info' },
            'Your registration list is empty. ',
            el('a', { href: 'catalog.html', id: 'courses-empty-link', text: 'Browse the course catalog to add courses' })
          )
        );
      } else {
        choices.replaceChildren(...cart.map((id) => {
          const course = findCourse(id);
          const inputId = `course-${id}`;
          return el('div', { className: 'choice choice-card', style: `--dept-color:${DEPARTMENTS[course.dept].color}` },
            el('input', { type: 'checkbox', id: inputId, name: 'courses', value: id, checked: true }),
            el('label', { for: inputId },
              el('span', { className: 'choice-title', text: courseName(course) }),
              el('span', { className: 'choice-detail', text: `${course.credits} credits · ${formatSchedule(course)} · ${course.instructor}` })
            )
          );
        }));
      }
      updateCreditTotal();
    }

    const selectedCourses = () => [...form.querySelectorAll('input[name="courses"]:checked')].map((i) => i.value);

    function updateCreditTotal() {
      const registered = getRegistered();
      const selected = totalCredits(selectedCourses());
      const already = totalCredits(registered);
      const total = selected + already;
      creditTotal.textContent = registered.length
        ? `Selected: ${selected} credits. With your ${already} registered credits, your total would be ${total} of ${MAX_CREDITS} credits.`
        : `Selected: ${selected} of ${MAX_CREDITS} credits.`;
      creditTotal.classList.toggle('is-over', total > MAX_CREDITS);
    }

    function validate() {
      const errors = [];
      const add = (field, focusId, message) => errors.push({ field, focusId, message });

      const name = form.fullName.value.trim();
      if (!name) add('full-name', 'full-name', 'Enter your full name');

      const sid = form.studentId.value.trim();
      if (!sid) add('student-id', 'student-id', 'Enter your student ID');
      else if (!/^\d{8}$/.test(sid)) add('student-id', 'student-id', 'Student ID must be exactly 8 digits, like 20241234');

      const email = form.email.value.trim();
      if (!email) add('email', 'email', 'Enter your university email address');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) add('email', 'email', 'Enter an email address in the correct format, like name@northbrook.edu');

      if (!form.major.value) add('major', 'major', 'Select your major');
      if (!form.querySelector('input[name="standing"]:checked')) add('standing', 'standing-1', 'Select your class standing');
      if (!form.term.value) add('term', 'term', 'Select a term');

      const firstCourse = form.querySelector('input[name="courses"]');
      const selected = selectedCourses();
      const registered = getRegistered();
      if (selected.length === 0) {
        add('courses', firstCourse ? firstCourse.id : 'courses-empty-link', 'Select at least one course to register for');
      } else {
        const total = totalCredits([...selected, ...registered]);
        if (total > MAX_CREDITS) {
          add('courses', firstCourse.id, `Your total would be ${total} credits. Deselect courses to stay at or below ${MAX_CREDITS} credits`);
        }
        const conflicts = findConflicts(selected, registered);
        if (conflicts.length) {
          const [a, b] = conflicts[0];
          const tail = registered.includes(b.id) ? ' (already registered)' : '';
          add('courses', `course-${a.id}`, `${a.id} ${a.title} meets at the same time as ${b.id} ${b.title}${tail}. Deselect one of them`);
        }
      }

      if (!form.agree.checked) add('agree', 'agree', 'Confirm that your information is correct and that you agree to the registration policies');
      return errors;
    }

    function findConflicts(selected, registered) {
      const result = [];
      selected.forEach((id, i) => {
        const a = findCourse(id);
        [...selected.slice(i + 1), ...registered].forEach((otherId) => {
          const b = findCourse(otherId);
          if (coursesConflict(a, b)) result.push([a, b]);
        });
      });
      return result;
    }

    const FIELD_INPUTS = {
      'full-name': () => [form.fullName],
      'student-id': () => [form.studentId],
      email: () => [form.email],
      major: () => [form.major],
      term: () => [form.term],
      standing: () => [...form.querySelectorAll('input[name="standing"]')],
      courses: () => [...form.querySelectorAll('input[name="courses"]')],
      agree: () => [form.agree]
    };

    function showErrors(errors) {
      Object.keys(FIELD_INPUTS).forEach((field) => {
        const fieldErrors = errors.filter((e) => e.field === field);
        const errorEl = document.getElementById(`${field}-error`);
        const container = errorEl.closest('.field, .form-section');
        if (fieldErrors.length) {
          errorEl.replaceChildren(srOnly('Error: '), fieldErrors.map((e) => e.message).join('. ') + '.');
        } else {
          errorEl.replaceChildren();
        }
        container.classList.toggle('has-error', fieldErrors.length > 0);
        FIELD_INPUTS[field]().forEach((input) => {
          if (fieldErrors.length) input.setAttribute('aria-invalid', 'true');
          else input.removeAttribute('aria-invalid');
        });
      });

      summaryList.replaceChildren(...errors.map((e) =>
        el('li', {}, el('a', { href: `#${e.focusId}`, 'data-focus': e.focusId, text: e.message }))
      ));
      summary.hidden = errors.length === 0;
      document.getElementById('error-summary-title').textContent = errors.length === 1
        ? 'There is 1 problem with your registration'
        : `There are ${errors.length} problems with your registration`;
    }

    summaryList.addEventListener('click', (event) => {
      const link = event.target.closest('a[data-focus]');
      if (!link) return;
      const target = document.getElementById(link.dataset.focus);
      if (!target) return;
      event.preventDefault();
      target.focus();
      target.scrollIntoView({ block: 'center' });
    });

    form.addEventListener('change', (event) => {
      if (event.target.name === 'courses') updateCreditTotal();
      if (attempted) showErrors(validate());
    });
    form.addEventListener('input', (event) => {
      // Clear an error as soon as the user fixes a text field, without announcing new ones mid-typing.
      if (!attempted || !['fullName', 'studentId', 'email'].includes(event.target.name)) return;
      const remaining = validate();
      if (!remaining.some((e) => e.focusId === event.target.id)) showErrors(remaining);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      attempted = true;
      successPanel.hidden = true;
      const errors = validate();
      showErrors(errors);
      if (errors.length) {
        summary.focus();
        return;
      }
      openConfirmation(event.submitter);
    });

    function openConfirmation(trigger) {
      const data = {
        fullName: form.fullName.value.trim(),
        studentId: form.studentId.value.trim(),
        email: form.email.value.trim(),
        major: form.major.value,
        standing: form.querySelector('input[name="standing"]:checked').value,
        term: form.term.value
      };
      const courses = selectedCourses();
      pending = { data, courses };

      const details = [
        ['Student', `${data.fullName} (ID ${data.studentId})`],
        ['Email', data.email],
        ['Major', data.major],
        ['Term', data.term]
      ];
      document.getElementById('confirm-student').replaceChildren(...details.map(([t, d]) =>
        el('div', {}, el('dt', { text: t }), el('dd', { text: d }))
      ));
      document.getElementById('confirm-courses').replaceChildren(...courses.map((id) => {
        const c = findCourse(id);
        return el('li', { style: `--dept-color:${DEPARTMENTS[c.dept].color}` },
          el('strong', { text: courseName(c) }),
          el('span', { text: `${c.credits} credits · ${formatSchedule(c)}` })
        );
      }));
      document.getElementById('confirm-credits').textContent =
        `Total for this registration: ${totalCredits(courses)} credits`;

      modal.open(trigger || form.querySelector('[type="submit"]'));
    }

    document.getElementById('confirm-submit').addEventListener('click', () => {
      if (!pending) return;
      const { data, courses } = pending;
      const registered = [...new Set([...getRegistered(), ...courses])];
      store.set(KEYS.registered, registered);
      store.set(KEYS.student, data);
      setCart(getCart().filter((id) => !courses.includes(id)));
      pending = null;

      renderChoices();
      updateCartBadge();
      form.agree.checked = false;
      attempted = false;
      showErrors([]);

      const names = courses.map((id) => courseName(findCourse(id))).join(', ');
      successMessage.textContent = `You are now registered for ${names}. You have ${totalCredits(registered)} credits for ${data.term}.`;
      successPanel.hidden = false;
      modal.close(successPanel);
      successPanel.scrollIntoView({ block: 'start' });
    });

    renderChoices();
  }

  /* ---------- Profile page ---------- */

  function initProfile() {
    const body = document.getElementById('schedule-body');
    const tableContainer = document.getElementById('table-container');
    const emptyState = document.getElementById('empty-schedule');
    const status = document.getElementById('drop-status');
    const heading = document.getElementById('schedule-title');
    const modal = createModal(document.getElementById('drop-dialog'));
    const headers = [...document.querySelectorAll('#schedule-table th[data-sort-key]')];
    let sort = { key: 'id', dir: 'ascending' };
    let dropping = null;

    heading.setAttribute('tabindex', '-1');
    renderStudent();

    function renderStudent() {
      const student = getStudent();
      const name = student?.fullName || 'Guest student';
      document.getElementById('profile-name').textContent = name;
      document.getElementById('avatar').textContent = name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
      const rows = [
        ['Student ID', student?.studentId],
        ['Email', student?.email],
        ['Major', student?.major],
        ['Class standing', student?.standing],
        ['Term', student?.term || TERM]
      ];
      document.getElementById('profile-details').replaceChildren(...rows.map(([t, d]) =>
        el('div', {}, el('dt', { text: t }), el('dd', { text: d || 'Not provided' }))
      ));
    }

    function sortValue(course, key) {
      if (key === 'dept') return DEPARTMENTS[course.dept].name;
      return course[key];
    }

    function render() {
      const registered = getRegistered().map(findCourse);
      registered.sort((a, b) => {
        const x = sortValue(a, sort.key);
        const y = sortValue(b, sort.key);
        const cmp = typeof x === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
        return sort.dir === 'ascending' ? cmp : -cmp;
      });

      body.replaceChildren(...registered.map((c) => el('tr', {},
        el('th', { scope: 'row' },
          el('span', { className: 'code-pill', style: `--dept-color:${DEPARTMENTS[c.dept].color}`, text: c.id })
        ),
        el('td', { text: c.title }),
        el('td', { text: DEPARTMENTS[c.dept].name }),
        el('td', { text: String(c.credits) }),
        el('td', { text: formatSchedule(c) }),
        el('td', { text: c.instructor }),
        el('td', { text: c.room }),
        el('td', {},
          el('button', { type: 'button', className: 'btn btn-danger btn-small', 'data-drop': c.id },
            'Drop', srOnly(` ${courseName(c)}`))
        )
      )));

      const credits = totalCredits(registered.map((c) => c.id));
      document.getElementById('total-credits').textContent = String(credits);
      document.getElementById('stat-courses').textContent = String(registered.length);
      document.getElementById('stat-credits').textContent = String(credits);
      document.getElementById('stat-remaining').textContent = String(Math.max(0, MAX_CREDITS - credits));

      tableContainer.hidden = registered.length === 0;
      emptyState.hidden = registered.length > 0;

      headers.forEach((th) => {
        if (th.dataset.sortKey === sort.key) th.setAttribute('aria-sort', sort.dir);
        else th.removeAttribute('aria-sort');
      });
    }

    headers.forEach((th) => {
      th.querySelector('button').addEventListener('click', () => {
        const key = th.dataset.sortKey;
        sort = {
          key,
          dir: sort.key === key && sort.dir === 'ascending' ? 'descending' : 'ascending'
        };
        render();
        const label = th.querySelector('button').firstChild.textContent.trim();
        announce(`Table sorted by ${label}, ${sort.dir}.`);
      });
    });

    body.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-drop]');
      if (!btn) return;
      const course = findCourse(btn.dataset.drop);
      dropping = course;
      document.getElementById('drop-title').textContent = `Drop ${course.id}?`;
      document.getElementById('drop-desc').textContent =
        `You are about to drop ${courseName(course)} (${course.credits} credits, ${formatSchedule(course)}). ` +
        'You can register again later if seats are still available.';
      modal.open(btn);
    });

    document.getElementById('drop-confirm').addEventListener('click', () => {
      if (!dropping) return;
      const course = dropping;
      dropping = null;

      // Choose where focus goes once the row disappears: the next row's button, else the section heading.
      const buttons = [...body.querySelectorAll('button[data-drop]')];
      const index = buttons.findIndex((b) => b.dataset.drop === course.id);
      const nextId = (buttons[index + 1] || buttons[index - 1])?.dataset.drop;

      store.set(KEYS.registered, getRegistered().filter((id) => id !== course.id));
      render();

      const remaining = totalCredits(getRegistered());
      status.textContent = `${courseName(course)} has been dropped. You are now registered for ${remaining} credits.`;
      const nextBtn = nextId && body.querySelector(`button[data-drop="${nextId}"]`);
      modal.close(nextBtn || heading);
    });

    render();
  }

  /* ---------- Boot ---------- */

  seedDemoData();
  initNav();
  const page = document.body.dataset.page;
  if (page === 'catalog') initCatalog();
  if (page === 'register') initRegistration();
  if (page === 'profile') initProfile();
})();
