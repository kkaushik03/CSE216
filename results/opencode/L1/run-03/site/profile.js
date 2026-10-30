document.addEventListener('DOMContentLoaded', function () {
  const avatar = $('#profile-avatar');
  const nameNode = $('#profile-name');
  const emailNode = $('#profile-email');
  const programNode = $('#profile-program');
  const yearNode = $('#profile-year');
  const idNode = $('#profile-id');
  const coursesStat = $('#stat-my-courses');
  const creditsStat = $('#stat-my-credits');
  const semestersStat = $('#stat-my-semesters');
  const editButton = $('#edit-profile-btn');
  const form = $('#profile-form');
  const cancelButton = $('#cancel-profile-btn');
  const tbody = $('#profile-registrations-body');
  const tableSummary = $('#profile-table-summary');

  const inputs = {
    profileName: $('#profileName'),
    profileStudentId: $('#profileStudentId'),
    profileEmail: $('#profileEmail'),
    profileProgram: $('#profileProgram'),
    profileYear: $('#profileYear')
  };

  function currentProfile() {
    return getProfile() || {};
  }

  function updateProfileView() {
    const profile = currentProfile();
    const name = profile.name || 'Guest Student';

    avatar.textContent = getInitials(name);
    nameNode.textContent = name;
    emailNode.textContent = profile.email || 'Register for a course to set up your profile.';
    programNode.textContent = profile.program || 'Undeclared';
    yearNode.textContent = profile.year || 'First year';
    idNode.textContent = profile.studentId ? 'ID ' + profile.studentId : 'No student ID';

    const summary = getRegistrationSummary(getRegistrations());
    coursesStat.textContent = String(summary.count);
    creditsStat.textContent = String(summary.credits);
    semestersStat.textContent = String(summary.semesters.length);
  }

  function renderProfileTable() {
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
        '<strong>Your schedule is empty</strong>' +
        'Head to <a href="catalog.html">the catalog</a> to find a course you love.' +
        '</td></tr>';
      tableSummary.textContent = 'No courses registered yet';
    }
  }

  function clearFieldError(name) {
    const errorNode = $('[data-error-for="' + name + '"]');
    if (errorNode) {
      errorNode.textContent = '';
    }
    if (inputs[name]) {
      inputs[name].classList.remove('is-invalid');
    }
  }

  function setFieldError(name, message) {
    const errorNode = $('[data-error-for="' + name + '"]');
    if (errorNode) {
      errorNode.textContent = message;
    }
    if (inputs[name]) {
      inputs[name].classList.add('is-invalid');
    }
  }

  function populateForm() {
    const profile = currentProfile();
    inputs.profileName.value = profile.name || '';
    inputs.profileStudentId.value = profile.studentId || '';
    inputs.profileEmail.value = profile.email || '';
    inputs.profileProgram.value = profile.program || 'Undeclared';
    inputs.profileYear.value = profile.year || 'First year';

    $$('.field-error', form).forEach(function (node) {
      node.textContent = '';
    });
    $$('.is-invalid', form).forEach(function (node) {
      node.classList.remove('is-invalid');
    });
  }

  function openForm() {
    populateForm();
    form.hidden = false;
    editButton.setAttribute('aria-expanded', 'true');
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    window.setTimeout(function () {
      inputs.profileName.focus();
    }, 200);
  }

  function closeForm() {
    form.hidden = true;
    editButton.setAttribute('aria-expanded', 'false');
  }

  editButton.addEventListener('click', function () {
    if (form.hidden) {
      openForm();
    } else {
      closeForm();
    }
  });

  cancelButton.addEventListener('click', closeForm);

  Object.keys(inputs).forEach(function (name) {
    inputs[name].addEventListener('input', function () {
      clearFieldError(name);
    });
    inputs[name].addEventListener('change', function () {
      clearFieldError(name);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    let isValid = true;
    const nameValue = inputs.profileName.value.trim();
    const idValue = inputs.profileStudentId.value.trim();
    const emailValue = inputs.profileEmail.value.trim();

    if (nameValue.length < 2) {
      setFieldError('profileName', 'Please enter your full name.');
      isValid = false;
    }

    if (!/^[A-Za-z0-9-]{3,}$/.test(idValue)) {
      setFieldError('profileStudentId', 'Use at least 3 letters, numbers, or dashes.');
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setFieldError('profileEmail', 'Enter a valid university email address.');
      isValid = false;
    }

    if (!isValid) {
      const firstInvalid = $('.is-invalid', form);
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    const profile = Object.assign({}, currentProfile(), {
      name: nameValue,
      studentId: idValue,
      email: emailValue,
      program: inputs.profileProgram.value,
      year: inputs.profileYear.value
    });

    saveProfile(profile);

    const registrations = getRegistrations().map(function (registration) {
      return Object.assign({}, registration, {
        studentName: nameValue,
        studentId: idValue,
        email: emailValue
      });
    });
    saveRegistrations(registrations);

    updateProfileView();
    closeForm();
    showToast('Profile saved.', 'success');
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
      subtitle: 'The seat will be released from your schedule.',
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
    updateProfileView();
    renderProfileTable();
    refreshRegistrationCount();
    showToast('Course removed from your schedule.', 'info');
  });

  editButton.setAttribute('aria-expanded', 'false');
  updateProfileView();
  renderProfileTable();
});
