/* Student profile: details, credit summary and sortable registered-courses table. */
(function () {
  'use strict';

  var UCR = window.UCR;
  var sortState = { key: 'code', dir: 'ascending' };

  var comparators = {
    code: function (a, b) { return a.dept.localeCompare(b.dept) || a.number.localeCompare(b.number); },
    title: function (a, b) { return a.title.localeCompare(b.title); },
    credits: function (a, b) { return a.credits - b.credits || a.title.localeCompare(b.title); }
  };
  var sortLabels = { code: 'course', title: 'title', credits: 'credits' };

  function renderProfile() {
    var p = UCR.getProfile();
    var initials = p.fullName.split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
    document.getElementById('avatar').textContent = initials;
    document.getElementById('profile-name-display').textContent = p.fullName;
    document.getElementById('profile-program-display').textContent = p.year + ', ' + p.program;
    document.getElementById('profile-name').textContent = p.fullName;
    document.getElementById('profile-id').textContent = p.studentId;
    document.getElementById('profile-email').textContent = p.email;
    document.getElementById('profile-year').textContent = p.year;
    document.getElementById('profile-program').textContent = p.program;
    document.getElementById('profile-advisor').textContent = p.advisor;
  }

  function renderSummary(regs) {
    var credits = UCR.totalCredits(regs);
    var max = UCR.data.maxCredits;
    document.getElementById('sum-courses').textContent = regs.length;
    document.getElementById('sum-credits').textContent = credits;
    document.getElementById('sum-remaining').textContent = Math.max(0, max - credits);
    document.getElementById('sum-meter-text').textContent = credits + ' of ' + max + ' maximum credits used';
    document.getElementById('sum-meter-bar').style.width = Math.min(100, Math.round((credits / max) * 100)) + '%';
  }

  function renderTable(regs) {
    var e = UCR.escapeHTML;
    var tbody = document.getElementById('courses-body');
    var hasRows = regs.length > 0;
    document.getElementById('table-wrap').hidden = !hasRows;
    document.getElementById('no-courses').hidden = hasRows;

    var rows = regs.map(function (r) { return { reg: r, course: UCR.getCourse(r.courseId) }; });
    var cmp = comparators[sortState.key];
    rows.sort(function (a, b) {
      var result = cmp(a.course, b.course);
      return sortState.dir === 'ascending' ? result : -result;
    });

    tbody.innerHTML = rows.map(function (row) {
      var c = row.course;
      var code = UCR.courseCode(c);
      return '<tr class="dept-' + c.dept + '">' +
        '<th scope="row"><span class="dot" aria-hidden="true"></span>' + e(code) + '</th>' +
        '<td>' + e(c.title) + '</td>' +
        '<td>' + e(UCR.formatSchedule(c)) + '<br><span class="hint">' + e(c.room) + '</span></td>' +
        '<td>' + e(c.instructor) + '</td>' +
        '<td class="num">' + UCR.creditsFor(row.reg) + '</td>' +
        '<td>' + e(UCR.gradingLabels[row.reg.grading] || row.reg.grading) + '</td>' +
        '<td><button type="button" class="btn btn-danger btn-small" data-drop="' + e(c.id) + '">' +
          'Drop<span class="visually-hidden"> ' + e(code) + ', ' + e(c.title) + '</span></button></td>' +
      '</tr>';
    }).join('');

    document.getElementById('total-credits').textContent = UCR.totalCredits(regs);
    updateSortHeaders();
  }

  function updateSortHeaders() {
    document.querySelectorAll('#courses-table th[data-sort-key]').forEach(function (th) {
      var key = th.getAttribute('data-sort-key');
      var icon = th.querySelector('.sort-icon');
      if (key === sortState.key) {
        th.setAttribute('aria-sort', sortState.dir);
        icon.textContent = sortState.dir === 'ascending' ? '▲' : '▼';
      } else {
        th.removeAttribute('aria-sort');
        icon.textContent = '⇅';
      }
    });
  }

  function renderAll() {
    var regs = UCR.getRegistrations();
    renderSummary(regs);
    renderTable(regs);
  }

  function dropCourse(courseId) {
    var c = UCR.getCourse(courseId);
    var code = UCR.courseCode(c);
    UCR.confirmDialog({
      title: 'Drop ' + code + '?',
      message: 'You will lose your seat in ' + code + ', ' + c.title + '. If the course fills up, you may not be able to register again.',
      confirmLabel: 'Drop course',
      cancelLabel: 'Keep course',
      danger: true,
      onConfirm: function () {
        UCR.removeRegistration(courseId);
        renderAll();
        // The Drop button no longer exists; move focus to the section heading.
        document.getElementById('courses-heading').focus();
        UCR.announce(code + ' dropped. You now have ' + UCR.totalCredits() + ' credits.');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.term-name').textContent = UCR.data.term;
    renderProfile();
    renderAll();

    document.querySelector('#courses-table thead').addEventListener('click', function (e) {
      var btn = e.target.closest('.sort-btn');
      if (!btn) return;
      var key = btn.closest('th').getAttribute('data-sort-key');
      sortState.dir = sortState.key === key && sortState.dir === 'ascending' ? 'descending' : 'ascending';
      sortState.key = key;
      renderTable(UCR.getRegistrations());
      UCR.announce('Table sorted by ' + sortLabels[key] + ', ' + sortState.dir);
    });

    document.getElementById('courses-body').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-drop]');
      if (btn) dropCourse(btn.getAttribute('data-drop'));
    });
  });
})();
