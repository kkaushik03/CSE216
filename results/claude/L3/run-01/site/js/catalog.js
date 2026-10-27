/* Course catalog: search, filters, sorting and course cards. */
(function () {
  'use strict';

  var UCR = window.UCR;
  var form, list, countEl, emptyEl, fields;
  var announceTimer;

  function getState() {
    return {
      q: fields.q.value.trim(),
      dept: fields.dept.value,
      level: fields.level.value,
      credits: fields.credits.value,
      mode: fields.mode.value,
      sort: fields.sort.value,
      open: fields.open.checked
    };
  }

  function matches(course, s) {
    if (s.dept && course.dept !== s.dept) return false;
    if (s.level && String(course.level) !== s.level) return false;
    if (s.credits && String(course.credits) !== s.credits) return false;
    if (s.mode && course.mode !== s.mode) return false;
    if (s.open && course.seats === 0) return false;
    if (s.q) {
      var haystack = [
        course.id, UCR.courseCode(course), course.title, course.instructor,
        course.description, UCR.deptName(course)
      ].join(' ').toLowerCase();
      // Every word typed must appear somewhere.
      return s.q.toLowerCase().split(/\s+/).every(function (word) { return haystack.indexOf(word) !== -1; });
    }
    return true;
  }

  var sorters = {
    code: function (a, b) { return a.dept.localeCompare(b.dept) || a.number.localeCompare(b.number); },
    title: function (a, b) { return a.title.localeCompare(b.title); },
    seats: function (a, b) { return b.seats - a.seats; },
    credits: function (a, b) { return b.credits - a.credits || a.title.localeCompare(b.title); }
  };

  function cardHTML(c, registered) {
    var e = UCR.escapeHTML;
    var code = UCR.courseCode(c);
    var titleId = 'course-' + c.id + '-title';
    var openPct = Math.round((c.seats / c.capacity) * 100);
    var low = c.seats > 0 && c.seats <= 5;
    var footer;

    if (registered) {
      footer = '<p class="card-status status-registered"><span aria-hidden="true">✓ </span>You’re registered</p>' +
        '<a class="btn btn-secondary btn-small" href="profile.html">View in my profile<span class="visually-hidden">: ' + e(code) + '</span></a>';
    } else if (c.seats === 0) {
      footer = '<p class="card-status status-full">Course full</p>';
    } else {
      footer = '<a class="btn btn-primary" href="register.html?course=' + encodeURIComponent(c.id) + '">' +
        'Register<span class="visually-hidden"> for ' + e(code) + ', ' + e(c.title) + '</span></a>';
    }

    return '<li>' +
      '<article class="course-card dept-' + c.dept + '" aria-labelledby="' + titleId + '">' +
        '<div class="card-band"><span>' + e(UCR.deptName(c)) + '</span><span class="course-code">' + e(code) + '</span></div>' +
        '<div class="card-body">' +
          '<h3 id="' + titleId + '">' + e(c.title) + '</h3>' +
          '<p class="card-desc">' + e(c.description) + '</p>' +
          '<dl class="card-meta">' +
            '<div><dt>Course</dt><dd>' + e(code) + '</dd></div>' +
            '<div><dt>Instructor</dt><dd>' + e(c.instructor) + '</dd></div>' +
            '<div><dt>Schedule</dt><dd>' + e(UCR.formatSchedule(c)) + '</dd></div>' +
            '<div><dt>Credits</dt><dd>' + c.credits + '</dd></div>' +
            '<div><dt>Format</dt><dd><span class="' + UCR.modeTagClass(c.mode) + '">' + e(c.mode) + '</span></dd></div>' +
          '</dl>' +
          '<div class="seats">' +
            '<p>' + e(UCR.seatsText(c)) + (low ? ' – filling fast' : '') + '</p>' +
            '<div class="seat-bar' + (low || c.seats === 0 ? ' low' : '') + '" aria-hidden="true"><span style="width:' + openPct + '%"></span></div>' +
          '</div>' +
        '</div>' +
        '<div class="card-footer">' + footer + '</div>' +
      '</article>' +
    '</li>';
  }

  function updateURL(s) {
    var params = new URLSearchParams();
    ['q', 'dept', 'level', 'credits', 'mode'].forEach(function (k) { if (s[k]) params.set(k, s[k]); });
    if (s.sort !== 'code') params.set('sort', s.sort);
    if (s.open) params.set('open', '1');
    var qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function render(options) {
    var s = getState();
    var regs = UCR.getRegistrations();
    var registeredIds = regs.map(function (r) { return r.courseId; });
    var results = UCR.data.courses.filter(function (c) { return matches(c, s); }).sort(sorters[s.sort] || sorters.code);

    list.innerHTML = results.map(function (c) { return cardHTML(c, registeredIds.indexOf(c.id) !== -1); }).join('');
    list.hidden = results.length === 0;
    emptyEl.hidden = results.length !== 0;

    var total = UCR.data.courses.length;
    var message = results.length === total
      ? 'Showing all ' + total + ' courses'
      : 'Showing ' + results.length + ' of ' + total + ' courses';

    // Debounce the live-region update so screen readers aren't flooded while typing.
    window.clearTimeout(announceTimer);
    if (options && options.immediate) {
      countEl.textContent = message;
    } else {
      announceTimer = window.setTimeout(function () { countEl.textContent = message; }, 600);
    }
    updateURL(s);
  }

  function applyURLParams() {
    var params = new URLSearchParams(location.search);
    ['q', 'dept', 'level', 'credits', 'mode', 'sort'].forEach(function (k) {
      var v = params.get(k);
      if (v === null) return;
      var el = fields[k];
      if (el.tagName === 'SELECT' && !Array.prototype.some.call(el.options, function (o) { return o.value === v; })) return;
      el.value = v;
    });
    fields.open.checked = params.get('open') === '1';
  }

  document.addEventListener('DOMContentLoaded', function () {
    form = document.getElementById('filter-form');
    list = document.getElementById('course-list');
    countEl = document.getElementById('results-count');
    emptyEl = document.getElementById('no-results');
    fields = {
      q: document.getElementById('search'),
      dept: document.getElementById('filter-dept'),
      level: document.getElementById('filter-level'),
      credits: document.getElementById('filter-credits'),
      mode: document.getElementById('filter-mode'),
      sort: document.getElementById('filter-sort'),
      open: document.getElementById('filter-open')
    };

    Object.keys(UCR.data.departments).forEach(function (code) {
      var opt = document.createElement('option');
      opt.value = code;
      opt.textContent = UCR.data.departments[code];
      fields.dept.appendChild(opt);
    });

    applyURLParams();
    render({ immediate: true });

    fields.q.addEventListener('input', function () { render(); });
    form.addEventListener('change', function () { render({ immediate: true }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      render({ immediate: true });
      // Move focus to the results so keyboard users land on what they asked for.
      var heading = document.getElementById('results-heading');
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    });
    form.addEventListener('reset', function () {
      // The reset event fires before values are cleared, so render on the next tick.
      window.setTimeout(function () { render({ immediate: true }); }, 0);
      UCR.announce('All filters cleared');
    });
    document.getElementById('empty-clear').addEventListener('click', function () {
      form.reset();
      fields.q.focus();
    });
  });
})();
