/* Course catalog: search, filters and course cards. */
"use strict";

(function () {
  const form = document.getElementById("search-form");
  const search = document.getElementById("search");
  const dept = document.getElementById("filter-dept");
  const level = document.getElementById("filter-level");
  const day = document.getElementById("filter-day");
  const avail = document.getElementById("filter-avail");
  const list = document.getElementById("course-list");
  const empty = document.getElementById("empty-state");
  const status = document.getElementById("status");
  const registeredIds = Store.getRegistrations().map(function (r) { return r.id; });

  Object.keys(DEPARTMENTS).forEach(function (code) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = DEPARTMENTS[code].name;
    dept.appendChild(option);
  });

  /* Prefill from the URL, e.g. catalog.html?q=calculus or ?dept=BIO from the home page. */
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) search.value = params.get("q");
  if (params.get("dept") && DEPARTMENTS[params.get("dept")]) dept.value = params.get("dept");

  function matches(course) {
    const q = search.value.trim().toLowerCase();
    if (q) {
      const haystack = [course.id, course.id.replace(" ", ""), course.title, course.instructor,
        course.description, DEPARTMENTS[course.dept].name].join(" ").toLowerCase();
      const words = q.split(/\s+/);
      if (!words.every(function (w) { return haystack.indexOf(w) !== -1; })) return false;
    }
    if (dept.value && course.dept !== dept.value) return false;
    if (level.value && String(course.level) !== level.value) return false;
    if (day.value && course.days.indexOf(day.value) === -1) return false;
    if (avail.value === "open" && availability(course) === "full") return false;
    if (avail.value === "full" && availability(course) !== "full") return false;
    return true;
  }

  function cardHtml(course) {
    const d = DEPARTMENTS[course.dept];
    const state = availability(course);
    const isRegistered = registeredIds.indexOf(course.id) !== -1;
    const left = seatsLeft(course);
    let action;
    if (isRegistered) {
      action = '<a class="btn btn-secondary" href="profile.html" aria-label="View in profile, ' + escapeHtml(course.id) + '">View in profile</a>';
    } else if (state === "full") {
      action = "<p>No seats available. Check back later.</p>";
    } else {
      action = '<a class="btn" href="register.html?course=' + encodeURIComponent(course.id) +
        '" aria-label="Register for ' + escapeHtml(course.id) + '">Register</a>';
    }
    return '<article class="course-card" style="--dept-color:' + d.color + '">' +
      '<h3><span class="course-code">' + escapeHtml(course.id) + '</span> ' + escapeHtml(course.title) + '</h3>' +
      '<p class="badges">' +
        '<span class="badge badge-dept" style="background:' + d.color + '">' + escapeHtml(d.name) + '</span>' +
        '<span class="badge badge-' + state + '"><span aria-hidden="true">' + AVAILABILITY_ICON[state] + '</span> ' + AVAILABILITY_TEXT[state] + '</span>' +
        (isRegistered ? '<span class="badge badge-registered"><span aria-hidden="true">★</span> Registered</span>' : '') +
      '</p>' +
      '<p>' + escapeHtml(course.description) + '</p>' +
      '<dl>' +
        '<dt>Credits</dt><dd>' + course.credits + '</dd>' +
        '<dt>Instructor</dt><dd>' + escapeHtml(course.instructor) + '</dd>' +
        '<dt>When</dt><dd>' + escapeHtml(formatSchedule(course)) + '</dd>' +
        '<dt>Room</dt><dd>' + escapeHtml(course.room) + '</dd>' +
        '<dt>Seats</dt><dd>' + left + ' of ' + course.capacity + ' left</dd>' +
      '</dl>' +
      '<div class="card-action">' + action + '</div>' +
    '</article>';
  }

  let announceTimer = null;

  function render() {
    const results = COURSES.filter(matches);
    list.innerHTML = results.map(function (c) { return "<li>" + cardHtml(c) + "</li>"; }).join("");
    empty.hidden = results.length !== 0;
    /* Wait until typing pauses so screen readers hear one count, not one per key. */
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(function () {
      status.textContent = results.length === 1 ? "1 course found" : results.length + " courses found";
    }, 500);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    render();
  });
  search.addEventListener("input", render);
  [dept, level, day, avail].forEach(function (select) {
    select.addEventListener("change", render);
  });

  document.getElementById("clear-filters").addEventListener("click", function () {
    search.value = "";
    dept.value = "";
    level.value = "";
    day.value = "";
    avail.value = "";
    render();
    search.focus();
  });

  render();
})();
