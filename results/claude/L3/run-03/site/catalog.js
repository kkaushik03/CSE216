(function () {
  'use strict';
  var UCR = window.UCR;

  var form = document.getElementById('search-form');
  var search = document.getElementById('search');
  var dept = document.getElementById('filter-dept');
  var level = document.getElementById('filter-level');
  var credits = document.getElementById('filter-credits');
  var avail = document.getElementById('filter-availability');
  var clearBtn = document.getElementById('clear-filters');
  var list = document.getElementById('course-list');
  var count = document.getElementById('results-count');
  var empty = document.getElementById('no-results');

  UCR.data.departments.forEach(function (d) {
    dept.appendChild(UCR.el('option', { value: d.id, text: d.name }));
  });

  var params = new URLSearchParams(window.location.search);
  if (params.get('q')) search.value = params.get('q');
  if (params.get('dept')) dept.value = params.get('dept');

  function matches(course) {
    var q = search.value.trim().toLowerCase();
    if (q) {
      var haystack = [course.code, course.code.replace(/\s+/g, ''), course.title, course.instructor,
        course.description, UCR.deptName(course.dept)].join(' ').toLowerCase();
      var words = q.split(/\s+/);
      if (!words.every(function (w) { return haystack.indexOf(w) !== -1; })) return false;
    }
    if (dept.value && course.dept !== dept.value) return false;
    if (level.value && String(course.level) !== level.value) return false;
    if (credits.value && String(course.credits) !== credits.value) return false;
    if (avail.value === 'open' && UCR.seatsLeft(course) === 0) return false;
    if (avail.value === 'full' && UCR.seatsLeft(course) > 0) return false;
    return true;
  }

  function summary(n) {
    return n === 1 ? '1 course found' : n + ' courses found';
  }

  var announceTimer;
  function render(announceNow) {
    var results = UCR.data.courses.filter(matches);
    list.textContent = '';
    results.forEach(function (c) { list.appendChild(UCR.createCourseCard(c)); });
    empty.hidden = results.length !== 0;
    count.textContent = summary(results.length) + ' of ' + UCR.data.courses.length;

    window.clearTimeout(announceTimer);
    var message = summary(results.length) + '.';
    if (announceNow) UCR.announce(message);
    else announceTimer = window.setTimeout(function () { UCR.announce(message); }, 700);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    render(true);
  });
  search.addEventListener('input', function () { render(false); });
  [dept, level, credits, avail].forEach(function (s) {
    s.addEventListener('change', function () { render(true); });
  });
  clearBtn.addEventListener('click', function () {
    search.value = '';
    dept.value = level.value = credits.value = avail.value = '';
    render(true);
  });

  UCR.bindWaitlist(list);

  render(false);
  /* Only announce on load when a search came from another page. */
  if (!search.value && !dept.value) window.clearTimeout(announceTimer);
})();
