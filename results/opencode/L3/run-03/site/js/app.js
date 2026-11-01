'use strict';

(function () {
  const STORAGE_KEY = 'nbu-registration-v1';
  const DEFAULT_STATE = {
    profile: {
      name: 'Jordan Rivera',
      email: 'jordan.rivera@northbridge.edu',
      studentId: '20261408',
      program: 'Computer Science',
      year: '2'
    },
    registrations: ['PSY 101', 'MATH 201']
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          profile: Object.assign({}, DEFAULT_STATE.profile, parsed.profile || {}),
          registrations: Array.isArray(parsed.registrations) ? parsed.registrations : []
        };
      }
    } catch (error) {
      /* Storage can be unavailable; fall back to sample data. */
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      /* The app still works for this page when storage is unavailable. */
    }
  }

  let state = loadState();

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const replacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return replacements[character];
    });
  }

  function courseByCode(code) {
    return COURSES.find((course) => course.code === code);
  }

  function courseElementId(code) {
    return 'course-' + code.replace(/[^a-zA-Z0-9]+/g, '-');
  }

  function debounce(fn, wait) {
    let timer;
    return function () {
      const args = arguments;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn.apply(null, args), wait);
    };
  }

  function courseCardMarkup(course) {
    const titleId = courseElementId(course.code);
    const isFull = course.seats <= 0;
    const seatsMarkup = isFull
      ? '<p class="course-seats is-full"><span class="seat-icon" aria-hidden="true">■</span> <strong>Full</strong> — no seats available</p>'
      : '<p class="course-seats is-open"><span class="seat-icon" aria-hidden="true">●</span> <strong>' + course.seats + ' seats</strong> available</p>';
    const actionMarkup = isFull
      ? '<button class="button button-small button-muted" type="button" disabled>Course full</button>'
      : '<a class="button button-small button-primary" href="register.html?course=' + encodeURIComponent(course.code) + '" aria-label="Register for ' + escapeHtml(course.code) + ': ' + escapeHtml(course.title) + '">Register</a>';

    return (
      '<li class="course-item">' +
        '<article class="course-card" aria-labelledby="' + titleId + '">' +
          '<div class="course-accent" style="background-color: ' + course.color + '" aria-hidden="true"></div>' +
          '<div class="course-body">' +
            '<p class="course-kicker">' +
              '<span class="badge badge-dept">' + escapeHtml(course.dept) + '</span>' +
              '<span>' + escapeHtml(course.code) + ' · ' + course.level + '-level</span>' +
            '</p>' +
            '<h3 id="' + titleId + '">' + escapeHtml(course.title) + '</h3>' +
            '<p class="course-desc">' + escapeHtml(course.description) + '</p>' +
            '<dl class="course-meta">' +
              '<div><dt>Instructor</dt><dd>' + escapeHtml(course.instructor) + '</dd></div>' +
              '<div><dt>Schedule</dt><dd>' + escapeHtml(course.days) + ', ' + escapeHtml(course.time) + '</dd></div>' +
              '<div><dt>Credits</dt><dd>' + course.credits + ' credits</dd></div>' +
            '</dl>' +
            seatsMarkup +
            '<div class="course-actions">' + actionMarkup + '</div>' +
          '</div>' +
        '</article>' +
      '</li>'
    );
  }

  function renderCourseList(container, courses) {
    if (!container) {
      return;
    }
    container.innerHTML = courses.map(courseCardMarkup).join('');
  }

  function initNavigation() {
    const toggle = $('.nav-toggle');
    const nav = $('#primary-nav');

    if (!toggle || !nav) {
      return;
    }

    const closeMenu = (returnFocus) => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu(false);
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        nav.classList.add('is-open');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });

    document.addEventListener('pointerdown', (event) => {
      if (
        toggle.getAttribute('aria-expanded') === 'true' &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        closeMenu(false);
      }
    });
  }

  function initHome() {
    const featuredList = $('#featured-courses');
    if (featuredList) {
      const featured = FEATURED_COURSE_CODES.map(courseByCode).filter(Boolean);
      renderCourseList(featuredList, featured);
    }

    const searchForm = $('#home-search-form');
    const searchInput = $('#home-search');
    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        window.location.href = 'courses.html' + (query ? '?q=' + encodeURIComponent(query) : '');
      });
    }
  }

  function initCatalog() {
    const grid = $('#course-grid');
    if (!grid) {
      return;
    }

    const searchForm = $('#catalog-search-form');
    const searchInput = $('#course-search');
    const departmentSelect = $('#filter-department');
    const levelSelect = $('#filter-level');
    const availabilitySelect = $('#filter-availability');
    const resetButton = $('#reset-filters');
    const status = $('#results-status');
    const emptyState = $('#catalog-empty');

    if (departmentSelect) {
      DEPARTMENTS.forEach((department) => {
        const option = document.createElement('option');
        option.value = department;
        option.textContent = department;
        departmentSelect.appendChild(option);
      });
    }

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    if (initialQuery && searchInput) {
      searchInput.value = initialQuery;
    }

    const applyFilters = () => {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const department = departmentSelect ? departmentSelect.value : 'all';
      const level = levelSelect ? levelSelect.value : 'all';
      const availability = availabilitySelect ? availabilitySelect.value : 'all';

      const filtered = COURSES.filter((course) => {
        const searchable = (
          course.code + ' ' +
          course.title + ' ' +
          course.instructor + ' ' +
          course.dept + ' ' +
          course.description
        ).toLowerCase();
        const matchesQuery = !query || searchable.includes(query);
        const matchesDepartment = department === 'all' || course.dept === department;
        const matchesLevel = level === 'all' || course.level === Number(level);
        const matchesAvailability =
          availability === 'all' ||
          (availability === 'open' && course.seats > 0) ||
          (availability === 'full' && course.seats <= 0);

        return matchesQuery && matchesDepartment && matchesLevel && matchesAvailability;
      }).sort((a, b) => a.code.localeCompare(b.code, 'en', { numeric: true }));

      renderCourseList(grid, filtered);
      grid.hidden = filtered.length === 0;
      if (emptyState) {
        emptyState.hidden = filtered.length !== 0;
      }

      if (status) {
        if (filtered.length === 0) {
          status.textContent = '0 courses found. Adjust your search or filters to see more courses.';
        } else {
          status.textContent = 'Showing ' + filtered.length + ' of ' + COURSES.length + ' courses.';
        }
      }
    };

    if (searchForm) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        applyFilters();
      });
    }

    const debouncedApply = debounce(applyFilters, 180);
    if (searchInput) {
      searchInput.addEventListener('input', debouncedApply);
    }
    [departmentSelect, levelSelect, availabilitySelect].forEach((select) => {
      if (select) {
        select.addEventListener('change', applyFilters);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
        }
        [departmentSelect, levelSelect, availabilitySelect].forEach((select) => {
          if (select) {
            select.value = 'all';
          }
        });
        applyFilters();
        if (searchInput) {
          searchInput.focus();
        }
        try {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (error) {
          /* Updating the URL is optional and can fail on file:// origins. */
        }
      });
    }

    applyFilters();
  }

  function initRegistration() {
    const form = $('#registration-form');
    if (!form) {
      return;
    }

    const nameInput = $('#reg-name');
    const emailInput = $('#reg-email');
    const idInput = $('#reg-student-id');
    const courseSelect = $('#reg-course');
    const status = $('#reg-status');
    const errorSummary = $('#error-summary');
    const errorSummaryList = $('#error-summary-list');
    const confirmDialog = $('#confirm-dialog');
    const confirmSummary = $('#confirm-summary');
    const confirmCancel = $('#confirm-cancel');
    const confirmSubmit = $('#confirm-submit');

    const nameError = $('#reg-name-error');
    const emailError = $('#reg-email-error');
    const idError = $('#reg-student-id-error');
    const courseError = $('#reg-course-error');

    const fieldMap = {
      name: { input: nameInput, error: nameError },
      email: { input: emailInput, error: emailError },
      studentId: { input: idInput, error: idError },
      course: { input: courseSelect, error: courseError }
    };

    if (!nameInput || !emailInput || !idInput || !courseSelect) {
      return;
    }

    if (state.profile) {
      nameInput.value = state.profile.name || '';
      emailInput.value = state.profile.email || '';
      idInput.value = state.profile.studentId || '';
    }

    const departments = [...new Set(COURSES.map((course) => course.dept))].sort((a, b) => a.localeCompare(b));
    let optionsMarkup = '<option value="">Choose a course</option>';
    departments.forEach((department) => {
      const courses = COURSES
        .filter((course) => course.dept === department)
        .sort((a, b) => a.code.localeCompare(b.code, 'en', { numeric: true }));
      optionsMarkup += '<optgroup label="' + escapeHtml(department) + '">';
      courses.forEach((course) => {
        const seatLabel = course.seats > 0 ? course.seats + ' seats available' : 'Full';
        optionsMarkup +=
          '<option value="' + escapeHtml(course.code) + '"' + (course.seats <= 0 ? ' disabled' : '') + '>' +
          escapeHtml(course.code + ' — ' + course.title + ' (' + seatLabel + ')') +
          '</option>';
      });
      optionsMarkup += '</optgroup>';
    });
    courseSelect.innerHTML = optionsMarkup;

    const requestedCourse = new URLSearchParams(window.location.search).get('course');
    if (requestedCourse) {
      const match = COURSES.find((course) => course.code === requestedCourse && course.seats > 0);
      if (match) {
        courseSelect.value = match.code;
      }
    }

    const setError = (key, message) => {
      const field = fieldMap[key];
      if (!field || !field.error) {
        return;
      }
      field.error.textContent = message;
      field.error.hidden = false;
      field.input.setAttribute('aria-invalid', 'true');
    };

    const clearError = (key) => {
      const field = fieldMap[key];
      if (!field || !field.error) {
        return;
      }
      field.error.textContent = '';
      field.error.hidden = true;
      field.input.removeAttribute('aria-invalid');
    };

    const clearAllErrors = () => {
      Object.keys(fieldMap).forEach(clearError);
      if (errorSummary) {
        errorSummary.hidden = true;
      }
    };

    Object.keys(fieldMap).forEach((key) => {
      const field = fieldMap[key];
      if (!field.input) {
        return;
      }
      field.input.addEventListener('input', () => clearError(key));
      field.input.addEventListener('change', () => clearError(key));
    });

    const validate = () => {
      clearAllErrors();
      const values = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        studentId: idInput.value.trim(),
        course: courseSelect.value
      };
      const errors = [];

      if (!values.name) {
        setError('name', 'Enter your full name.');
        errors.push({ key: 'name', id: nameInput.id, label: 'Full name', message: 'Enter your full name.' });
      }

      if (!values.email) {
        setError('email', 'Enter your email address.');
        errors.push({ key: 'email', id: emailInput.id, label: 'Email address', message: 'Enter your email address.' });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        setError('email', 'Enter a valid email address, for example name@example.com.');
        errors.push({
          key: 'email',
          id: emailInput.id,
          label: 'Email address',
          message: 'Enter a valid email address, for example name@example.com.'
        });
      }

      if (!values.studentId) {
        setError('studentId', 'Enter your 8-digit student ID.');
        errors.push({ key: 'studentId', id: idInput.id, label: 'Student ID', message: 'Enter your 8-digit student ID.' });
      } else if (!/^\d{8}$/.test(values.studentId)) {
        setError('studentId', 'Enter a student ID with exactly 8 digits, for example 20261408.');
        errors.push({
          key: 'studentId',
          id: idInput.id,
          label: 'Student ID',
          message: 'Enter a student ID with exactly 8 digits, for example 20261408.'
        });
      }

      if (!values.course) {
        setError('course', 'Choose a course to register for.');
        errors.push({ key: 'course', id: courseSelect.id, label: 'Course', message: 'Choose a course to register for.' });
      } else if (state.registrations.includes(values.course)) {
        setError('course', 'You are already registered for this course. Choose a different course.');
        errors.push({
          key: 'course',
          id: courseSelect.id,
          label: 'Course',
          message: 'You are already registered for this course. Choose a different course.'
        });
      }

      return { valid: errors.length === 0, values: values, errors: errors };
    };

    const showErrorSummary = (errors) => {
      if (!errorSummary || !errorSummaryList) {
        return;
      }
      errorSummaryList.innerHTML = errors
        .map((error) =>
          '<li><a href="#' + error.id + '">' + escapeHtml(error.label) + ': ' + escapeHtml(error.message) + '</a></li>'
        )
        .join('');
      errorSummary.hidden = false;
      errorSummary.focus();
    };

    let pendingRegistration = null;

    if (confirmCancel) {
      confirmCancel.addEventListener('click', () => {
        confirmDialog.close();
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = validate();

      if (!result.valid) {
        showErrorSummary(result.errors);
        return;
      }

      pendingRegistration = result.values;
      const course = courseByCode(result.values.course);
      if (!course || !confirmDialog || !confirmSummary) {
        return;
      }

      confirmSummary.innerHTML =
        '<div><dt>Student</dt><dd>' + escapeHtml(result.values.name) + '</dd></div>' +
        '<div><dt>Email</dt><dd>' + escapeHtml(result.values.email) + '</dd></div>' +
        '<div><dt>Student ID</dt><dd>' + escapeHtml(result.values.studentId) + '</dd></div>' +
        '<div><dt>Course</dt><dd>' + escapeHtml(course.code + ': ' + course.title) + '</dd></div>' +
        '<div><dt>Schedule</dt><dd>' + escapeHtml(course.days + ', ' + course.time) + '</dd></div>' +
        '<div><dt>Credits</dt><dd>' + course.credits + ' credits</dd></div>';

      if (!confirmDialog.open) {
        confirmDialog.showModal();
      }
      if (confirmCancel) {
        confirmCancel.focus();
      }
    });

    if (confirmSubmit) {
      confirmSubmit.addEventListener('click', () => {
        if (!pendingRegistration) {
          return;
        }

        const course = courseByCode(pendingRegistration.course);
        if (!course) {
          return;
        }

        if (!state.registrations.includes(course.code)) {
          state.registrations.push(course.code);
        }

        state.profile = Object.assign({}, state.profile, {
          name: pendingRegistration.name,
          email: pendingRegistration.email,
          studentId: pendingRegistration.studentId
        });
        saveState(state);

        confirmDialog.close();
        pendingRegistration = null;
        if (errorSummary) {
          errorSummary.hidden = true;
        }
        if (status) {
          status.textContent = 'Registration saved. You are now registered for ' + course.code + ': ' + course.title + '.';
        }
      });
    }
  }

  function initProfile() {
    const profileForm = $('#profile-form');
    if (!profileForm) {
      return;
    }

    const nameDisplay = $('#profile-name');
    const emailDisplay = $('#profile-email');
    const idDisplay = $('#profile-id');
    const programDisplay = $('#profile-program');
    const yearDisplay = $('#profile-year');
    const initialsDisplay = $('#profile-initials');

    const nameInput = $('#profile-name-input');
    const emailInput = $('#profile-email-input');
    const programInput = $('#profile-program-input');
    const yearInput = $('#profile-year-input');

    const nameError = $('#profile-name-error');
    const emailError = $('#profile-email-error');
    const profileStatus = $('#profile-status');

    const registeredBody = $('#registered-tbody');
    const registeredWrap = $('#registered-table-wrap');
    const registeredEmpty = $('#registered-empty');
    const registeredHeading = $('#registered-heading');
    const registeredCaption = $('#registered-caption');
    const registeredStatus = $('#registered-status');

    const dropDialog = $('#drop-dialog');
    const dropDescription = $('#drop-description');
    const dropCancel = $('#drop-cancel');
    const dropConfirm = $('#drop-confirm');

    let pendingDrop = null;

    const getInitials = (name) => {
      const parts = name.trim().split(/\s+/).filter(Boolean);
      if (parts.length === 0) {
        return 'NU';
      }
      return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
    };

    const renderProfile = () => {
      const profile = state.profile;
      if (nameDisplay) nameDisplay.textContent = profile.name;
      if (emailDisplay) emailDisplay.textContent = profile.email;
      if (idDisplay) idDisplay.textContent = profile.studentId;
      if (programDisplay) programDisplay.textContent = profile.program;
      if (yearDisplay) yearDisplay.textContent = 'Year ' + profile.year;
      if (initialsDisplay) initialsDisplay.textContent = getInitials(profile.name || '');
    };

    const fillForm = () => {
      if (nameInput) nameInput.value = state.profile.name || '';
      if (emailInput) emailInput.value = state.profile.email || '';
      if (programInput) programInput.value = state.profile.program || 'Computer Science';
      if (yearInput) yearInput.value = state.profile.year || '1';
    };

    const setProfileError = (input, errorElement, message) => {
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.hidden = false;
      }
      if (input) {
        input.setAttribute('aria-invalid', 'true');
      }
    };

    const clearProfileError = (input, errorElement) => {
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.hidden = true;
      }
      if (input) {
        input.removeAttribute('aria-invalid');
      }
    };

    if (nameInput) {
      nameInput.addEventListener('input', () => clearProfileError(nameInput, nameError));
    }
    if (emailInput) {
      emailInput.addEventListener('input', () => clearProfileError(emailInput, emailError));
    }

    profileForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearProfileError(nameInput, nameError);
      clearProfileError(emailInput, emailError);

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      let firstInvalid = null;

      if (!name) {
        setProfileError(nameInput, nameError, 'Enter your full name.');
        firstInvalid = nameInput;
      }

      if (!email) {
        setProfileError(emailInput, emailError, 'Enter your email address.');
        firstInvalid = firstInvalid || emailInput;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setProfileError(emailInput, emailError, 'Enter a valid email address, for example name@example.com.');
        firstInvalid = firstInvalid || emailInput;
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      state.profile = Object.assign({}, state.profile, {
        name: name,
        email: email,
        program: programInput ? programInput.value : state.profile.program,
        year: yearInput ? yearInput.value : state.profile.year
      });
      saveState(state);
      renderProfile();
      if (profileStatus) {
        profileStatus.textContent = 'Profile saved. Your details are up to date.';
      }
    });

    const openDropDialog = (code, opener) => {
      const course = courseByCode(code);
      if (!course || !dropDialog) {
        return;
      }
      pendingDrop = code;
      if (dropDescription) {
        dropDescription.textContent =
          'This will remove ' + course.code + ': ' + course.title + ' from your Spring 2027 schedule. ' +
          'You can register again later if seats are available.';
      }
      dropDialog.showModal();
      if (dropCancel) {
        dropCancel.focus();
      } else if (opener) {
        opener.focus();
      }
    };

    const renderRegistrations = () => {
      const registered = state.registrations.map(courseByCode).filter(Boolean);

      if (registeredCaption) {
        registeredCaption.textContent = 'Registered courses (' + registered.length + ')';
      }

      if (registeredBody) {
        registeredBody.innerHTML = registered
          .map((course) =>
            '<tr>' +
              '<th scope="row">' + escapeHtml(course.code) + '</th>' +
              '<td>' + escapeHtml(course.title) + '</td>' +
              '<td>' + escapeHtml(course.instructor) + '</td>' +
              '<td>' + escapeHtml(course.days + ', ' + course.time) + '</td>' +
              '<td>' + course.credits + '</td>' +
              '<td><button class="button button-small button-danger-outline" type="button" data-drop="' +
                escapeHtml(course.code) + '" aria-label="Drop ' + escapeHtml(course.code) + ': ' +
                escapeHtml(course.title) + '">Drop</button></td>' +
            '</tr>'
          )
          .join('');
      }

      if (registeredWrap) {
        registeredWrap.hidden = registered.length === 0;
      }
      if (registeredEmpty) {
        registeredEmpty.hidden = registered.length > 0;
      }

      $$('[data-drop]', registeredBody || document).forEach((button) => {
        button.addEventListener('click', () => {
          openDropDialog(button.getAttribute('data-drop'), button);
        });
      });
    };

    if (dropCancel) {
      dropCancel.addEventListener('click', () => {
        pendingDrop = null;
        dropDialog.close();
      });
    }

    if (dropConfirm) {
      dropConfirm.addEventListener('click', () => {
        if (!pendingDrop) {
          return;
        }
        const droppedCode = pendingDrop;
        state.registrations = state.registrations.filter((code) => code !== droppedCode);
        saveState(state);
        pendingDrop = null;
        dropDialog.close();
        renderRegistrations();
        if (registeredStatus) {
          registeredStatus.textContent = droppedCode + ' has been dropped from your schedule.';
        }
        window.setTimeout(() => {
          if (registeredHeading) {
            registeredHeading.focus();
          }
        }, 0);
      });
    }

    if (dropDialog) {
      dropDialog.addEventListener('close', () => {
        pendingDrop = null;
      });
    }

    renderProfile();
    fillForm();
    renderRegistrations();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    const page = document.body.getAttribute('data-page');
    if (page === 'home') {
      initHome();
    } else if (page === 'catalog') {
      initCatalog();
    } else if (page === 'register') {
      initRegistration();
    } else if (page === 'profile') {
      initProfile();
    }
  });
})();
