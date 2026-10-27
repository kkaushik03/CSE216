/* Registration form: validation, error summary, confirmation dialog. */
(function () {
  'use strict';

  var UCR = window.UCR;
  var form, summary, summaryList, success, preview;
  var fields = {};
  var submittedOnce = false;
  var baseTitle = document.title;

  function selectedGrading() {
    var checked = form.querySelector('input[name="grading"]:checked');
    return checked ? checked.value : '';
  }

  /* ---------- Validation rules (return an error message or '') ---------- */
  var rules = {
    studentId: function () {
      var v = fields.studentId.input.value.trim();
      if (!v) return 'Enter your student ID.';
      if (!/^S\d{7}$/i.test(v)) return 'Enter a student ID that starts with S followed by 7 digits, like S2024581.';
      return '';
    },
    fullName: function () {
      var v = fields.fullName.input.value.trim();
      if (!v) return 'Enter your full name.';
      if (v.length < 2) return 'Full name must be at least 2 characters.';
      return '';
    },
    email: function () {
      var v = fields.email.input.value.trim();
      if (!v) return 'Enter your university email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter an email address in the correct format, like name@northfield.edu.';
      if (!/@northfield\.edu$/i.test(v)) return 'Use your university email address ending in @northfield.edu.';
      return '';
    },
    year: function () {
      return fields.year.input.value ? '' : 'Select your year of study.';
    },
    course: function () {
      var id = fields.course.input.value;
      if (!id) return 'Select a course to register for.';
      var c = UCR.getCourse(id);
      var code = UCR.courseCode(c);
      if (UCR.isRegistered(id)) return 'You are already registered for ' + code + '. Select a different course.';
      if (c.seats === 0) return code + ' is full. Select a course that has open seats.';
      var conflict = UCR.findConflict(c);
      if (conflict) {
        return code + ' meets at the same time as ' + UCR.courseCode(conflict) + ' (' +
          UCR.formatSchedule(conflict) + '). Select a different course.';
      }
      var grading = selectedGrading();
      if (grading !== 'audit') {
        var after = UCR.totalCredits() + c.credits;
        if (after > UCR.data.maxCredits) {
          return 'Adding ' + code + ' would bring you to ' + after + ' credits, over the ' +
            UCR.data.maxCredits + '-credit limit. Choose “Audit” or a course with fewer credits.';
        }
      }
      return '';
    },
    grading: function () {
      return selectedGrading() ? '' : 'Select a grading option.';
    },
    policy: function () {
      return fields.policy.input.checked ? '' : 'Confirm that you agree to the registration and tuition policy.';
    }
  };

  /* ---------- Error display ---------- */
  function setDescribedBy(el, errorId, hasError) {
    var ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (id) {
      return id && id !== errorId;
    });
    // Error message first so it is read before the hint.
    if (hasError) ids.unshift(errorId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  }

  function showFieldError(name, message) {
    var f = fields[name];
    var errorEl = document.getElementById(name + '-error');
    var hasError = !!message;
    errorEl.querySelector('.msg').textContent = message;
    errorEl.hidden = !hasError;
    f.container.classList.toggle('has-error', hasError);
    f.controls.forEach(function (control) {
      if (hasError) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    });
    setDescribedBy(f.describedByTarget, errorEl.id, hasError);
  }

  function validateField(name) {
    var message = rules[name]();
    showFieldError(name, message);
    return message;
  }

  function validateAll() {
    var errors = [];
    Object.keys(rules).forEach(function (name) {
      var message = validateField(name);
      if (message) errors.push({ name: name, message: message });
    });
    return errors;
  }

  function renderSummary(errors, moveFocus) {
    if (!errors.length) {
      summary.hidden = true;
      document.title = baseTitle;
      return;
    }
    var count = errors.length;
    document.getElementById('error-summary-title').textContent =
      count === 1 ? 'There is 1 problem with your registration' : 'There are ' + count + ' problems with your registration';
    summaryList.innerHTML = errors.map(function (err) {
      return '<li><a href="#' + fields[err.name].focusTarget().id + '" data-field="' + err.name + '">' +
        UCR.escapeHTML(err.message) + '</a></li>';
    }).join('');
    summary.hidden = false;
    document.title = 'Error: ' + baseTitle;
    if (moveFocus) summary.focus();
  }

  /* ---------- Course select & preview ---------- */
  function populateCourses() {
    var select = fields.course.input;
    var current = select.value;
    var regs = UCR.getRegistrations();
    while (select.options.length > 1) select.remove(1);
    Array.prototype.slice.call(select.querySelectorAll('optgroup')).forEach(function (g) { g.remove(); });

    Object.keys(UCR.data.departments).forEach(function (dept) {
      var group = document.createElement('optgroup');
      group.label = UCR.data.departments[dept];
      UCR.data.courses.filter(function (c) { return c.dept === dept; }).forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.id;
        var label = UCR.courseCode(c) + ': ' + c.title + ' (' + c.credits + ' credits)';
        if (regs.some(function (r) { return r.courseId === c.id; })) label += ' – already registered';
        else if (c.seats === 0) label += ' – full';
        opt.textContent = label;
        group.appendChild(opt);
      });
      select.appendChild(group);
    });
    select.value = current;
  }

  function renderPreview() {
    var c = UCR.getCourse(fields.course.input.value);
    preview.className = 'course-preview';
    if (!c) { preview.innerHTML = ''; return; }
    var e = UCR.escapeHTML;
    var warnings = [];
    if (UCR.isRegistered(c.id)) warnings.push('You are already registered for this course.');
    else if (c.seats === 0) warnings.push('This course is full.');
    var conflict = UCR.findConflict(c);
    if (conflict && !UCR.isRegistered(c.id)) warnings.push('Time conflict with ' + UCR.courseCode(conflict) + '.');

    preview.classList.add('dept-' + c.dept);
    preview.innerHTML =
      '<h3>Selected: ' + e(UCR.courseCode(c)) + ', ' + e(c.title) + '</h3>' +
      '<ul>' +
        '<li>Instructor: ' + e(c.instructor) + '</li>' +
        '<li>Schedule: ' + e(UCR.formatSchedule(c)) + '</li>' +
        '<li>Location: ' + e(c.room) + ' (' + e(c.mode) + ')</li>' +
        '<li>Credits: ' + c.credits + '</li>' +
        '<li>' + e(UCR.seatsText(c)) + '</li>' +
      '</ul>' +
      warnings.map(function (w) {
        return '<p class="preview-warning"><span aria-hidden="true">⚠ </span>' + e(w) + '</p>';
      }).join('');
  }

  /* ---------- Sidebar ---------- */
  function renderSchedule() {
    var regs = UCR.getRegistrations();
    var credits = UCR.totalCredits(regs);
    var max = UCR.data.maxCredits;
    document.getElementById('credit-text').textContent = credits + ' of ' + max + ' credits used';
    document.getElementById('credit-bar').style.width = Math.min(100, Math.round((credits / max) * 100)) + '%';

    var list = document.getElementById('schedule-list');
    if (!regs.length) {
      list.innerHTML = '<li>You are not registered for any courses yet.</li>';
      return;
    }
    list.innerHTML = regs.map(function (r) {
      var c = UCR.getCourse(r.courseId);
      return '<li class="dept-' + c.dept + '"><span class="code">' + UCR.escapeHTML(UCR.courseCode(c)) + '</span>' +
        UCR.escapeHTML(c.title) + '<br>' + UCR.escapeHTML(UCR.formatSchedule(c)) + '</li>';
    }).join('');
  }

  /* ---------- Submit & confirm ---------- */
  function confirmationDetails(c, grading) {
    var e = UCR.escapeHTML;
    var creditsAfter = UCR.totalCredits() + (grading === 'audit' ? 0 : c.credits);
    var rows = [
      ['Student', fields.fullName.input.value.trim() + ' (' + fields.studentId.input.value.trim().toUpperCase() + ')'],
      ['Course', UCR.courseCode(c) + ', ' + c.title],
      ['Schedule', UCR.formatSchedule(c)],
      ['Instructor', c.instructor],
      ['Location', c.room + ' (' + c.mode + ')'],
      ['Grading', UCR.gradingLabels[grading]],
      ['Term credits', creditsAfter + ' of ' + UCR.data.maxCredits + ' after this registration']
    ];
    return '<dl>' + rows.map(function (row) {
      return '<div><dt>' + e(row[0]) + '</dt><dd>' + e(row[1]) + '</dd></div>';
    }).join('') + '</dl>';
  }

  function completeRegistration(c, grading) {
    UCR.addRegistration({ courseId: c.id, grading: grading, date: new Date().toISOString().slice(0, 10) });
    UCR.saveProfile({
      studentId: fields.studentId.input.value.trim().toUpperCase(),
      fullName: fields.fullName.input.value.trim(),
      email: fields.email.input.value.trim(),
      year: fields.year.input.value
    });

    document.getElementById('success-text').textContent =
      'You’re registered for ' + UCR.courseCode(c) + ', ' + c.title + ' (' + UCR.gradingLabels[grading] +
      '). You now have ' + UCR.totalCredits() + ' credits for ' + UCR.data.term + '.';

    // Keep student details, clear the course-specific choices.
    fields.course.input.value = '';
    form.querySelectorAll('input[name="grading"]').forEach(function (r) { r.checked = false; });
    fields.policy.input.checked = false;
    document.getElementById('notes').value = '';
    submittedOnce = false;
    history.replaceState(null, '', location.pathname);

    populateCourses();
    renderPreview();
    renderSchedule();
    summary.hidden = true;
    document.title = 'Registration confirmed – ' + baseTitle;
    success.hidden = false;
    success.focus();
  }

  function onSubmit(e) {
    e.preventDefault();
    submittedOnce = true;
    success.hidden = true;
    var errors = validateAll();
    renderSummary(errors, true);
    if (errors.length) return;

    var c = UCR.getCourse(fields.course.input.value);
    var grading = selectedGrading();
    UCR.confirmDialog({
      title: 'Confirm your registration',
      message: 'Please check these details. Your seat is reserved once you confirm.',
      details: confirmationDetails(c, grading),
      confirmLabel: 'Confirm registration',
      cancelLabel: 'Go back and edit',
      onConfirm: function () { completeRegistration(c, grading); }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    form = document.getElementById('registration-form');
    summary = document.getElementById('error-summary');
    summaryList = document.getElementById('error-summary-list');
    success = document.getElementById('success-message');
    preview = document.getElementById('course-preview');

    function simpleField(id) {
      var input = document.getElementById(id);
      return {
        input: input,
        controls: [input],
        container: document.getElementById('field-' + id),
        describedByTarget: input,
        focusTarget: function () { return input; }
      };
    }
    ['studentId', 'fullName', 'email', 'year', 'course', 'policy'].forEach(function (id) {
      fields[id] = simpleField(id);
    });
    var radios = Array.prototype.slice.call(form.querySelectorAll('input[name="grading"]'));
    var gradingGroup = document.getElementById('field-grading');
    fields.grading = {
      controls: radios,
      container: gradingGroup,
      describedByTarget: gradingGroup,
      focusTarget: function () { return form.querySelector('input[name="grading"]:checked') || radios[0]; }
    };

    // Pre-fill known student details to save typing.
    var profile = UCR.getProfile();
    fields.studentId.input.value = profile.studentId;
    fields.fullName.input.value = profile.fullName;
    fields.email.input.value = profile.email;
    fields.year.input.value = profile.year;

    populateCourses();
    var requested = new URLSearchParams(location.search).get('course');
    if (requested && UCR.getCourse(requested)) fields.course.input.value = requested;
    renderPreview();
    renderSchedule();

    form.addEventListener('submit', onSubmit);

    // After the first submit attempt, re-check fields as the user corrects them.
    function revalidate(name) {
      if (!submittedOnce) return;
      validateField(name);
      var remaining = Object.keys(rules).filter(function (n) { return rules[n](); })
        .map(function (n) { return { name: n, message: rules[n]() }; });
      renderSummary(remaining, false);
    }
    ['studentId', 'fullName', 'email'].forEach(function (name) {
      fields[name].input.addEventListener('blur', function () { revalidate(name); });
    });
    fields.year.input.addEventListener('change', function () { revalidate('year'); });
    fields.course.input.addEventListener('change', function () { renderPreview(); revalidate('course'); });
    radios.forEach(function (r) {
      r.addEventListener('change', function () { revalidate('grading'); revalidate('course'); });
    });
    fields.policy.input.addEventListener('change', function () { revalidate('policy'); });

    // Error summary links move focus straight to the problem field.
    summaryList.addEventListener('click', function (e) {
      var link = e.target.closest('a[data-field]');
      if (!link) return;
      e.preventDefault();
      var target = fields[link.getAttribute('data-field')].focusTarget();
      target.scrollIntoView({ block: 'center' });
      target.focus();
    });
  });
})();
