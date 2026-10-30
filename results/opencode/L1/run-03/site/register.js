document.addEventListener('DOMContentLoaded', function () {
  const form = $('#registration-form');
  const fullNameInput = $('#fullName');
  const studentIdInput = $('#studentId');
  const emailInput = $('#email');
  const semesterSelect = $('#semester');
  const courseSelect = $('#courseId');
  const preview = $('#course-preview');
  const tbody = $('#registrations-body');
  const tableSummary = $('#table-summary');
  const clearButton = $('#clear-registrations');
  const successBanner = $('#success-banner');
  const successText = $('#success-text');
  let successTimer = null;

  const previewEmpty =
    '<div class="preview-empty">' +
    icon('book') +
    '<p>Pick a course in the form to preview it here.</p>' +
    '</div>';

  const departments = Array.from(
    new Set(
      COURSES.map(function (course) {
        return course.department;
      })
    )
  ).sort(function (a, b) {
    return a.localeCompare(b);
  });

  departments.forEach(function (department) {
    const group = document.createElement('optgroup');
    group.label = department;

    COURSES.filter(function (course) {
      return course.department === department;
    })
      .sort(function (a, b) {
        return a.code.localeCompare(b.code);
      })
      .forEach(function (course) {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.code + ' — ' + course.title + ' (' + course.credits + ' credits)';
        group.appendChild(option);
      });

    courseSelect.appendChild(group);
  });

  const profile = getProfile();
  if (profile) {
    if (profile.name) {
      fullNameInput.value = profile.name;
    }
    if (profile.studentId) {
      studentIdInput.value = profile.studentId;
    }
    if (profile.email) {
      emailInput.value = profile.email;
    }
  }

  const params = new URLSearchParams(window.location.search);
  const preselected = params.get('course');
  if (preselected && getCourseById(preselected)) {
    courseSelect.value = preselected;
  }

  function updatePreview() {
    const course = getCourseById(courseSelect.value);
    if (!course) {
      preview.innerHTML = previewEmpty;
      return;
    }

    const available = getAvailableSeats(course);
    preview.innerHTML =
      '<div class="preview-course" style="--accent:' +
      course.color +
      ';--accent-2:' +
      course.color2 +
      '">' +
      '<div class="preview-top">' +
      '<span class="preview-code">' +
      escapeHtml(course.code) +
      '</span>' +
      '<span class="pill pill-soft">Level ' +
      course.level +
      '</span>' +
      '</div>' +
      '<h3>' +
      escapeHtml(course.title) +
      '</h3>' +
      '<ul class="preview-list">' +
      '<li><span>Instructor</span><span>' +
      escapeHtml(course.instructor) +
      '</span></li>' +
      '<li><span>Schedule</span><span>' +
      escapeHtml(course.schedule) +
      '</span></li>' +
      '<li><span>Format</span><span>' +
      escapeHtml(course.mode) +
      '</span></li>' +
      '<li><span>Seats left</span><span>' +
      (available ? available + ' of ' + course.capacity : 'Full') +
      '</span></li>' +
      '<li><span>Semester</span><span>' +
      escapeHtml(semesterSelect.value) +
      '</span></li>' +
      '</ul>' +
      '<div class="preview-total"><span>Total credits</span><strong>' +
      course.credits +
      ' credits</strong></div>' +
      '</div>';
  }

  function clearFieldError(name) {
    const errorNode = $('[data-error-for="' + name + '"]');
    if (errorNode) {
      errorNode.textContent = '';
    }
    const input = form.elements[name];
    if (input) {
      input.classList.remove('is-invalid');
    }
  }

  function clearAllErrors() {
    $$('.field-error').forEach(function (node) {
      node.textContent = '';
    });
    $$('.is-invalid', form).forEach(function (node) {
      node.classList.remove('is-invalid');
    });
  }

  function setFieldError(name, message) {
    const errorNode = $('[data-error-for="' + name + '"]');
    if (errorNode) {
      errorNode.textContent = message;
    }
    const input = form.elements[name];
    if (input) {
      input.classList.add('is-invalid');
    }
  }

  function validateForm() {
    clearAllErrors();
    let isValid = true;

    if (fullNameInput.value.trim().length < 2) {
      setFieldError('fullName', 'Please enter your full name.');
      isValid = false;
    }

    if (!/^[A-Za-z0-9-]{3,}$/.test(studentIdInput.value.trim())) {
      setFieldError('studentId', 'Use at least 3 letters, numbers, or dashes.');
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      setFieldError('email', 'Enter a valid university email address.');
      isValid = false;
    }

    if (!semesterSelect.value) {
      setFieldError('semester', 'Choose a semester.');
      isValid = false;
    }

    if (!getCourseById(courseSelect.value)) {
      setFieldError('courseId', 'Choose a course to register for.');
      isValid = false;
    }

    return isValid;
  }

  function showSuccess(course, semester) {
    successText.textContent =
      'You are registered for ' + course.code + ' — ' + course.title + ' · ' + semester + '.';
    successBanner.hidden = false;
    if (successTimer) {
      window.clearTimeout(successTimer);
    }
    successTimer = window.setTimeout(function () {
      successBanner.hidden = true;
    }, 7000);
  }

  function renderTable() {
    const registrations = getRegistrations();
    const summary = getRegistrationSummary(registrations);

    if (registrations.length) {
      tbody.innerHTML = renderRegistrationRows(registrations);
      tableSummary.textContent =
        summary.count +
        (summary.count === 1 ? ' course' : ' courses') +
        ' · ' +
        summary.credits +
        ' total credits';
    } else {
      tbody.innerHTML =
        '<tr class="empty-row"><td colspan="6">' +
        icon('book') +
        '<strong>No registered courses yet</strong>' +
        'Pick a course above or <a href="catalog.html">browse the catalog</a> to get started.' +
        '</td></tr>';
      tableSummary.textContent = 'No courses registered yet';
    }

    clearButton.disabled = registrations.length === 0;

    if (!registrations.length) {
      successBanner.hidden = true;
    }
  }

  form.addEventListener('input', function (event) {
    if (event.target.name) {
      clearFieldError(event.target.name);
    }
  });

  form.addEventListener('change', function (event) {
    if (event.target.name) {
      clearFieldError(event.target.name);
    }
  });

  courseSelect.addEventListener('change', updatePreview);
  semesterSelect.addEventListener('change', updatePreview);

  form.addEventListener('reset', function () {
    window.setTimeout(function () {
      clearAllErrors();
      updatePreview();
    }, 0);
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!validateForm()) {
      const firstInvalid = $('.is-invalid', form);
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    const course = getCourseById(courseSelect.value);
    const semester = semesterSelect.value;
    const studentName = fullNameInput.value.trim();
    const studentId = studentIdInput.value.trim();
    const email = emailInput.value.trim();

    const alreadyRegistered = getRegistrations().some(function (registration) {
      return registration.courseId === course.id && registration.semester === semester;
    });

    if (alreadyRegistered) {
      showToast("You're already registered for " + course.code + ' in ' + semester + '.', 'error');
      return;
    }

    const confirmed = await openModal({
      title: 'Confirm your registration',
      subtitle: 'One quick check, then your seat is reserved.',
      confirmText: 'Confirm registration',
      cancelText: 'Go back',
      body:
        '<div class="confirm-summary">' +
        '<div class="confirm-course" style="--accent:' +
        course.color +
        ';--accent-2:' +
        course.color2 +
        '">' +
        '<span class="cell-dot" aria-hidden="true"></span>' +
        '<div><strong>' +
        escapeHtml(course.code) +
        ' · ' +
        escapeHtml(course.title) +
        '</strong><span>' +
        escapeHtml(course.department) +
        ' · ' +
        escapeHtml(course.mode) +
        '</span></div>' +
        '</div>' +
        '<div class="confirm-rows">' +
        '<div class="confirm-row"><span>Student</span><strong>' +
        escapeHtml(studentName) +
        '</strong></div>' +
        '<div class="confirm-row"><span>Student ID</span><strong>' +
        escapeHtml(studentId) +
        '</strong></div>' +
        '<div class="confirm-row"><span>Semester</span><strong>' +
        escapeHtml(semester) +
        '</strong></div>' +
        '<div class="confirm-row"><span>Schedule</span><strong>' +
        escapeHtml(course.schedule) +
        '</strong></div>' +
        '<div class="confirm-row"><span>Credits</span><strong>' +
        course.credits +
        ' credits</strong></div>' +
        '</div>' +
        '</div>' +
        '<div class="modal-note">' +
        icon('info') +
        '<span>Your seat will be saved on this device. You can remove this course at any time from this page or your profile.</span>' +
        '</div>'
    });

    if (!confirmed) {
      return;
    }

    const result = addRegistration({
      courseId: course.id,
      semester: semester,
      studentName: studentName,
      studentId: studentId,
      email: email
    });

    if (!result.ok) {
      showToast(result.reason, 'error');
      return;
    }

    const existingProfile = getProfile() || {};
    saveProfile(
      Object.assign({}, existingProfile, {
        name: studentName,
        studentId: studentId,
        email: email,
        program: existingProfile.program || 'Undeclared',
        year: existingProfile.year || 'First year'
      })
    );

    renderTable();
    refreshRegistrationCount();
    showSuccess(course, semester);
    showToast('Registration confirmed for ' + course.code + ' · ' + semester + '.', 'success');
  });

  tbody.addEventListener('click', async function (event) {
    const button = event.target.closest('.js-remove-registration');
    if (!button) {
      return;
    }

    const id = button.getAttribute('data-id');
    const registration = getRegistrations().find(function (item) {
      return item.id === id;
    });

    if (!registration) {
      return;
    }

    const course = getCourseById(registration.courseId);
    if (!course) {
      return;
    }

    const confirmed = await openModal({
      danger: true,
      title: 'Remove this course?',
      subtitle: 'Your seat will be released for other students.',
      confirmText: 'Remove course',
      cancelText: 'Keep course',
      body:
        '<div class="confirm-summary">' +
        '<div class="confirm-course" style="--accent:' +
        course.color +
        ';--accent-2:' +
        course.color2 +
        '">' +
        '<span class="cell-dot" aria-hidden="true"></span>' +
        '<div><strong>' +
        escapeHtml(course.code) +
        ' · ' +
        escapeHtml(course.title) +
        '</strong><span>' +
        escapeHtml(registration.semester) +
        '</span></div>' +
        '</div>' +
        '<div class="confirm-rows">' +
        '<div class="confirm-row"><span>Instructor</span><strong>' +
        escapeHtml(course.instructor) +
        '</strong></div>' +
        '<div class="confirm-row"><span>Schedule</span><strong>' +
        escapeHtml(course.schedule) +
        '</strong></div>' +
        '<div class="confirm-row"><span>Credits</span><strong>' +
        course.credits +
        ' credits</strong></div>' +
        '</div>' +
        '</div>'
    });

    if (!confirmed) {
      return;
    }

    removeRegistration(id);
    successBanner.hidden = true;
    renderTable();
    refreshRegistrationCount();
    showToast('Course removed from your schedule.', 'info');
  });

  clearButton.addEventListener('click', async function () {
    const registrations = getRegistrations();
    if (!registrations.length) {
      return;
    }

    const summary = getRegistrationSummary(registrations);
    const confirmed = await openModal({
      danger: true,
      title: 'Clear your whole schedule?',
      subtitle: 'This removes every registered course for this device.',
      confirmText: 'Clear all courses',
      cancelText: 'Keep my courses',
      body:
        '<div class="confirm-summary">' +
        '<div class="confirm-rows" style="padding-top:0;border-top:0;">' +
        '<div class="confirm-row"><span>Registered courses</span><strong>' +
        summary.count +
        '</strong></div>' +
        '<div class="confirm-row"><span>Total credits</span><strong>' +
        summary.credits +
        '</strong></div>' +
        '<div class="confirm-row"><span>Semesters</span><strong>' +
        escapeHtml(summary.semesters.join(', ') || '—') +
        '</strong></div>' +
        '</div>' +
        '</div>'
    });

    if (!confirmed) {
      return;
    }

    clearRegistrations();
    renderTable();
    refreshRegistrationCount();
    showToast('All registered courses were removed.', 'info');
  });

  updatePreview();
  renderTable();
});
