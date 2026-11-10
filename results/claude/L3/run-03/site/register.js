(function () {
  'use strict';
  var UCR = window.UCR;
  var Store = UCR.store;

  var form = document.getElementById('register-form');
  var nameInput = document.getElementById('reg-name');
  var emailInput = document.getElementById('reg-email');
  var idInput = document.getElementById('reg-id');
  var majorInput = document.getElementById('reg-major');
  var courseSelect = document.getElementById('reg-course');
  var notesInput = document.getElementById('reg-notes');
  var agreeInput = document.getElementById('reg-agree');
  var termGroup = document.getElementById('term-group');
  var termRadios = Array.prototype.slice.call(form.querySelectorAll('input[name="term"]'));
  var preview = document.getElementById('course-preview');
  var summaryBox = document.getElementById('error-summary');
  var summaryHeading = document.getElementById('error-summary-heading');
  var summaryList = document.getElementById('error-summary-list');
  var successBox = document.getElementById('success-box');
  var successText = document.getElementById('success-text');
  var dialog = document.getElementById('confirm-dialog');
  var details = document.getElementById('confirm-details');

  /* ---------- Course options ---------- */
  function buildCourseOptions(selected) {
    while (courseSelect.options.length > 1) courseSelect.remove(1);
    Array.prototype.slice.call(courseSelect.querySelectorAll('optgroup')).forEach(function (g) { g.remove(); });

    UCR.data.departments.forEach(function (d) {
      var group = UCR.el('optgroup', { label: d.name });
      UCR.data.courses.filter(function (c) { return c.dept === d.id; }).forEach(function (c) {
        var left = UCR.seatsLeft(c);
        var registered = Store.isRegistered(c.code);
        var suffix = registered ? ' (already registered)'
          : left === 0 ? ' (Full)'
          : ' (' + c.credits + ' credits, ' + left + (left === 1 ? ' seat' : ' seats') + ' left)';
        var option = UCR.el('option', { value: c.code, text: c.code + ' – ' + c.title + suffix });
        if (registered || left === 0) option.disabled = true;
        group.appendChild(option);
      });
      courseSelect.appendChild(group);
    });

    var target = selected && UCR.findCourse(selected);
    courseSelect.value = target && !Store.isRegistered(target.code) && UCR.seatsLeft(target) > 0 ? target.code : '';
    updatePreview();
  }

  function updatePreview() {
    var course = UCR.findCourse(courseSelect.value);
    preview.textContent = '';
    if (!course) { preview.hidden = true; return; }
    preview.className = 'course-preview dept-' + course.dept;
    preview.appendChild(UCR.el('h3', { text: 'Selected: ' + course.code + ' ' + course.title }));
    preview.appendChild(UCR.el('p', { text: UCR.deptName(course.dept) + ' · ' + course.credits + ' credits' }));
    preview.appendChild(UCR.el('p', { text: course.days + ', ' + course.time + ' · ' + course.room }));
    preview.appendChild(UCR.el('p', { text: 'Instructor: ' + course.instructor }));
    preview.hidden = false;
  }

  /* ---------- Prefill from the profile (WCAG 3.3.7) ---------- */
  var profile = Store.getProfile();
  nameInput.value = profile.name;
  emailInput.value = profile.email;
  idInput.value = profile.studentId;
  majorInput.value = profile.major;

  buildCourseOptions(new URLSearchParams(window.location.search).get('course'));
  courseSelect.addEventListener('change', updatePreview);

  /* ---------- Validation ---------- */
  function checkedTerm() {
    var r = termRadios.filter(function (x) { return x.checked; })[0];
    return r ? r.value : '';
  }

  var rules = [
    {
      input: nameInput, focus: nameInput, error: 'reg-name-error', hint: null,
      check: function () { return nameInput.value.trim() ? '' : 'Enter your full name.'; }
    },
    {
      input: emailInput, focus: emailInput, error: 'reg-email-error', hint: 'reg-email-hint',
      check: function () {
        var v = emailInput.value.trim();
        if (!v) return 'Enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter an email address in the format name@example.edu.';
        return '';
      }
    },
    {
      input: idInput, focus: idInput, error: 'reg-id-error', hint: 'reg-id-hint',
      check: function () {
        var v = idInput.value.replace(/\s+/g, '');
        if (!v) return 'Enter your student ID.';
        if (!/^\d{8}$/.test(v)) return 'Enter a student ID with 8 digits, for example 20231234.';
        return '';
      }
    },
    {
      input: courseSelect, focus: courseSelect, error: 'reg-course-error', hint: 'reg-course-hint',
      check: function () {
        var course = UCR.findCourse(courseSelect.value);
        if (!course) return 'Choose a course from the list.';
        if (Store.isRegistered(course.code)) return 'You are already registered for ' + course.code + '. Choose a different course.';
        if (UCR.seatsLeft(course) === 0) return course.code + ' is full. Choose a course with open seats.';
        return '';
      }
    },
    {
      group: termGroup, inputs: termRadios, focus: termRadios[0], error: 'term-error',
      check: function () { return checkedTerm() ? '' : 'Choose a term: Fall 2026 or Spring 2027.'; }
    },
    {
      input: agreeInput, focus: agreeInput, error: 'reg-agree-error', hint: null,
      check: function () { return agreeInput.checked ? '' : 'Check the box to confirm you have read the registration policy.'; }
    }
  ];

  function showError(rule, message) {
    var errorEl = document.getElementById(rule.error);
    errorEl.textContent = '';
    if (message) {
      errorEl.appendChild(UCR.el('span', { 'aria-hidden': 'true', text: '⚠' }));
      errorEl.appendChild(document.createTextNode(' ' + message));
    }
    errorEl.hidden = !message;
    rule.message = message;

    var targets = rule.inputs || [rule.input];
    targets.forEach(function (t) {
      if (message) t.setAttribute('aria-invalid', 'true');
      else t.removeAttribute('aria-invalid');
    });

    if (rule.group) {
      rule.group.classList.toggle('has-error', !!message);
    } else {
      var ids = [rule.hint, message ? rule.error : null].filter(Boolean);
      if (ids.length) rule.input.setAttribute('aria-describedby', ids.join(' '));
      else rule.input.removeAttribute('aria-describedby');
    }
  }

  function renderSummary() {
    var failing = rules.filter(function (r) { return r.message; });
    summaryList.textContent = '';
    failing.forEach(function (r) {
      var link = UCR.el('a', { href: '#' + r.focus.id, text: r.message });
      link.addEventListener('click', function (event) {
        event.preventDefault();
        r.focus.focus();
      });
      summaryList.appendChild(UCR.el('li', null, [link]));
    });
    summaryHeading.textContent = failing.length === 1
      ? 'There is 1 problem with your registration'
      : 'There are ' + failing.length + ' problems with your registration';
    summaryBox.hidden = failing.length === 0;
    return failing;
  }

  /* After a failed submit, re-check a field as soon as the user fixes it. */
  rules.forEach(function (rule) {
    (rule.inputs || [rule.input]).forEach(function (input) {
      var evt = input.tagName === 'SELECT' || input.type === 'radio' || input.type === 'checkbox' ? 'change' : 'input';
      input.addEventListener(evt, function () {
        if (!rule.message) return;
        showError(rule, rule.check());
        if (!summaryBox.hidden) renderSummary();
      });
    });
  });

  /* ---------- Submit and confirm ---------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    successBox.hidden = true;
    rules.forEach(function (rule) { showError(rule, rule.check()); });
    var failing = renderSummary();
    if (failing.length) {
      summaryBox.focus();
      return;
    }

    var course = UCR.findCourse(courseSelect.value);
    var grading = form.querySelector('input[name="grading"]:checked').value;
    var rows = [
      ['Name', nameInput.value.trim()],
      ['Email', emailInput.value.trim()],
      ['Student ID', idInput.value.replace(/\s+/g, '')],
      ['Course', course.code + ' ' + course.title],
      ['Schedule', course.days + ', ' + course.time],
      ['Credits', String(course.credits)],
      ['Term', checkedTerm()],
      ['Grading', grading]
    ];
    details.textContent = '';
    rows.forEach(function (r) {
      details.appendChild(UCR.el('div', null, [UCR.el('dt', { text: r[0] }), UCR.el('dd', { text: r[1] })]));
    });

    UCR.openDialog(dialog, {
      opener: document.getElementById('submit-btn'),
      onConfirm: function () {
        Store.saveProfile({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          studentId: idInput.value.replace(/\s+/g, ''),
          major: majorInput.value.trim()
        });
        Store.addRegistration({
          code: course.code,
          term: checkedTerm(),
          grading: grading,
          notes: notesInput.value.trim()
        });

        var message = 'Registration saved. You are registered for ' + course.code + ' ' + course.title + ', ' + checkedTerm() + '.';
        successText.textContent = message;
        successBox.hidden = false;

        agreeInput.checked = false;
        notesInput.value = '';
        buildCourseOptions('');
        table.render();
        UCR.announce(message);
      }
    });
  });

  var table = UCR.initRegisteredTable(document.getElementById('registered-table'), {
    headingId: 'registered-heading',
    onRender: function () {
      if (table) buildCourseOptions(courseSelect.value);
    }
  });
})();
