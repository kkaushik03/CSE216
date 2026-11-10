(function () {
  'use strict';
  var UCR = window.UCR;
  var Store = UCR.store;

  var detailsEl = document.getElementById('profile-details');
  var avatar = document.getElementById('avatar');
  var waitlistEl = document.getElementById('waitlist');
  var form = document.getElementById('profile-form');

  function renderProfile() {
    var p = Store.getProfile();
    detailsEl.textContent = '';
    [['Name', p.name], ['Email', p.email], ['Student ID', p.studentId], ['Major', p.major], ['Year', p.year]]
      .forEach(function (row) {
        detailsEl.appendChild(UCR.el('div', null, [
          UCR.el('dt', { text: row[0] }),
          UCR.el('dd', { text: row[1] || 'Not provided' })
        ]));
      });
    var initials = (p.name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
    avatar.textContent = initials || '?';
  }

  function renderStats(regs) {
    var credits = regs.reduce(function (sum, r) {
      var c = UCR.findCourse(r.code);
      return sum + (c ? c.credits : 0);
    }, 0);
    document.getElementById('stat-courses').textContent = regs.length;
    document.getElementById('stat-credits').textContent = credits;
    document.getElementById('stat-waitlist').textContent = Store.getWaitlist().length;
  }

  function renderWaitlist() {
    var codes = Store.getWaitlist();
    waitlistEl.textContent = '';
    if (!codes.length) {
      waitlistEl.appendChild(UCR.el('p', { text: 'You are not on any waitlists. Full courses in the catalog have a “Join waitlist” button.' }));
      return;
    }
    var list = UCR.el('ul', { className: 'card-grid' });
    codes.forEach(function (code) {
      var c = UCR.findCourse(code);
      if (c) list.appendChild(UCR.createCourseCard(c));
    });
    waitlistEl.appendChild(list);
    UCR.bindWaitlist(list, function () { renderStats(Store.getRegistrations()); });
  }

  renderProfile();
  renderWaitlist();
  UCR.initRegisteredTable(document.getElementById('registered-table'), {
    headingId: 'registered-heading',
    onRender: renderStats
  });

  /* ---------- Edit form ---------- */
  var p = Store.getProfile();
  var fields = {
    name: document.getElementById('pf-name'),
    email: document.getElementById('pf-email'),
    studentId: document.getElementById('pf-id'),
    major: document.getElementById('pf-major'),
    year: document.getElementById('pf-year')
  };
  Object.keys(fields).forEach(function (k) { fields[k].value = p[k] || ''; });

  var rules = [
    { input: fields.name, error: 'pf-name-error', hint: null,
      check: function (v) { return v ? '' : 'Enter your full name.'; } },
    { input: fields.email, error: 'pf-email-error', hint: 'pf-email-hint',
      check: function (v) {
        if (!v) return 'Enter your email address.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter an email address in the format name@example.edu.';
      } },
    { input: fields.studentId, error: 'pf-id-error', hint: 'pf-id-hint',
      check: function (v) {
        v = v.replace(/\s+/g, '');
        if (!v) return 'Enter your student ID.';
        return /^\d{8}$/.test(v) ? '' : 'Enter a student ID with 8 digits, for example 20231234.';
      } }
  ];

  function validate(rule) {
    var message = rule.check(rule.input.value.trim());
    var errorEl = document.getElementById(rule.error);
    errorEl.textContent = '';
    if (message) {
      errorEl.appendChild(UCR.el('span', { 'aria-hidden': 'true', text: '⚠' }));
      errorEl.appendChild(document.createTextNode(' ' + message));
      rule.input.setAttribute('aria-invalid', 'true');
    } else {
      rule.input.removeAttribute('aria-invalid');
    }
    errorEl.hidden = !message;
    var ids = [rule.hint, message ? rule.error : null].filter(Boolean);
    if (ids.length) rule.input.setAttribute('aria-describedby', ids.join(' '));
    else rule.input.removeAttribute('aria-describedby');
    rule.message = message;
    return message;
  }

  rules.forEach(function (rule) {
    rule.input.addEventListener('input', function () { if (rule.message) validate(rule); });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var failing = rules.filter(function (r) { return validate(r); });
    if (failing.length) {
      failing[0].input.focus();
      UCR.announce(failing.length === 1 ? 'There is 1 problem. Check the highlighted field.' : 'There are ' + failing.length + ' problems. Check the highlighted fields.');
      return;
    }
    Store.saveProfile({
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      studentId: fields.studentId.value.replace(/\s+/g, ''),
      major: fields.major.value.trim(),
      year: fields.year.value
    });
    renderProfile();
    UCR.announce('Your details have been saved.');
  });
})();
