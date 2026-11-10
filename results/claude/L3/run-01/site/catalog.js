/* Course catalog: search, filters and course cards. */
(function () {
  "use strict";

  var NB = window.NB;

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("search-form");
    var q = document.getElementById("q");
    var dept = document.getElementById("filter-dept");
    var level = document.getElementById("filter-level");
    var credits = document.getElementById("filter-credits");
    var availability = document.getElementById("filter-availability");
    var list = document.getElementById("course-list");
    var empty = document.getElementById("empty-state");
    var count = document.getElementById("results-count");
    var clearBtn = document.getElementById("clear-filters");

    NB.departments.forEach(function (d) {
      dept.add(new Option(d.name, d.id));
    });
    NB.levels.forEach(function (l) {
      level.add(new Option(l.name, l.id));
    });

    /* Prefill from the URL, for example catalog.html?q=bio or ?dept=CSE from the home page. */
    var params = new URLSearchParams(window.location.search);
    q.value = params.get("q") || "";
    [[dept, "dept"], [level, "level"], [credits, "credits"], [availability, "availability"]].forEach(function (pair) {
      var value = params.get(pair[1]);
      if (value && Array.prototype.some.call(pair[0].options, function (o) { return o.value === value; })) {
        pair[0].value = value;
      }
    });

    function matches(course) {
      var term = q.value.trim().toLowerCase();
      if (term) {
        var haystack = [course.code, course.code.replace(" ", ""), course.title, course.instructor,
          course.description, NB.deptName(course.dept)].join(" ").toLowerCase();
        var words = term.split(/\s+/);
        if (!words.every(function (w) { return haystack.indexOf(w) !== -1; })) return false;
      }
      if (dept.value && course.dept !== dept.value) return false;
      if (level.value && course.level !== level.value) return false;
      if (credits.value === "1-2" && course.credits > 2) return false;
      if (credits.value === "3" && course.credits !== 3) return false;
      if (credits.value === "4" && course.credits !== 4) return false;
      if (availability.value === "available" && NB.seatsLeft(course) === 0) return false;
      if (availability.value === "full" && NB.seatsLeft(course) > 0) return false;
      return true;
    }

    function actionHtml(course) {
      var name = course.code + " " + course.title;
      if (NB.isRegistered(course.id)) {
        return '<a class="btn btn-teal" href="profile.html" aria-label="View on profile: ' + NB.escape(name) + ', registered">View on profile</a>';
      }
      if (NB.seatsLeft(course) === 0 && !NB.isPlanned(course.id)) {
        return '<button type="button" class="btn" disabled aria-label="Course full: ' + NB.escape(name) + '">Course full</button>';
      }
      return planButtonHtml(course);
    }

    function planButtonHtml(course) {
      var planned = NB.isPlanned(course.id);
      var name = course.code + " " + course.title;
      return '<button type="button" class="btn ' + (planned ? "btn-primary is-added" : "btn-primary") + '" data-course="' + course.id + '"' +
        ' aria-label="' + (planned ? "Remove from plan: " : "Add to plan: ") + NB.escape(name) + '">' +
        (planned ? "Remove from plan" : "Add to plan") + "</button>";
    }

    function statusBadges(course) {
      var a = NB.availability(course);
      var icons = {
        open: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        few: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4 2.5 20h19z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M12 10v4.5M12 17.2v.3" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
        full: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M6 18 18 6" stroke="currentColor" stroke-width="2.5"/></svg>'
      };
      var html = '<span class="badge badge-dept">' + NB.escape(NB.deptName(course.dept)) + "</span>" +
        '<span class="badge badge-' + a.key + '">' + icons[a.key] + NB.escape(a.detail) + "</span>";
      if (NB.isRegistered(course.id)) {
        html += '<span class="badge badge-registered">Registered</span>';
      } else if (NB.isPlanned(course.id)) {
        html += '<span class="badge badge-planned" data-planned-badge>In your plan</span>';
      }
      return html;
    }

    function cardHtml(course) {
      var titleId = "course-" + course.id + "-title";
      return '<li><article class="course-card dept-' + course.dept + '" aria-labelledby="' + titleId + '">' +
        '<div class="card-top" data-badges>' + statusBadges(course) + "</div>" +
        '<h3 class="course-title" id="' + titleId + '"><span class="course-code">' + NB.escape(course.code) + "</span> " + NB.escape(course.title) + "</h3>" +
        '<p class="course-desc">' + NB.escape(course.description) + "</p>" +
        '<dl class="course-meta">' +
        "<dt>Instructor</dt><dd>" + NB.escape(course.instructor) + "</dd>" +
        "<dt>Schedule</dt><dd>" + NB.escape(NB.scheduleText(course)) + "</dd>" +
        "<dt>Room</dt><dd>" + NB.escape(course.room) + "</dd>" +
        "<dt>Credits</dt><dd>" + course.credits + "</dd>" +
        "</dl>" +
        '<div class="card-action">' + actionHtml(course) + "</div>" +
        "</article></li>";
    }

    function render() {
      var results = NB.courses.filter(matches);
      list.innerHTML = results.map(cardHtml).join("");
      empty.hidden = results.length > 0;
      var filtered = q.value.trim() || dept.value || level.value || credits.value || availability.value;
      var text;
      if (results.length === 0) text = "No courses found";
      else if (!filtered) text = "Showing all " + NB.coursesText(results.length);
      else text = NB.coursesText(results.length) + " found";
      if (count.textContent !== text) count.textContent = text;
    }

    function syncUrl() {
      var next = new URLSearchParams();
      if (q.value.trim()) next.set("q", q.value.trim());
      if (dept.value) next.set("dept", dept.value);
      if (level.value) next.set("level", level.value);
      if (credits.value) next.set("credits", credits.value);
      if (availability.value) next.set("availability", availability.value);
      var query = next.toString();
      try {
        window.history.replaceState(null, "", query ? "?" + query : window.location.pathname);
      } catch (e) {
        /* file:// in some browsers does not allow this; ignore */
      }
    }

    function update() {
      render();
      syncUrl();
    }

    var typingTimer = null;
    q.addEventListener("input", function () {
      window.clearTimeout(typingTimer);
      typingTimer = window.setTimeout(update, 400);
    });
    [dept, level, credits, availability].forEach(function (select) {
      select.addEventListener("change", update);
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      window.clearTimeout(typingTimer);
      update();
    });
    clearBtn.addEventListener("click", function () {
      form.reset();
      q.value = "";
      update();
      NB.announce("Search and filters cleared.");
    });

    /* Add or remove a course from the plan, updating the card in place so focus stays on the button. */
    list.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-course]");
      if (!button) return;
      var course = NB.findCourse(button.getAttribute("data-course"));
      if (!course) return;
      var plan = NB.getPlan();
      var index = plan.indexOf(course.id);
      var message;
      if (index === -1) {
        plan.push(course.id);
        message = course.code + " added to your plan. ";
      } else {
        plan.splice(index, 1);
        message = course.code + " removed from your plan. ";
      }
      NB.setPlan(plan);
      message += "Your plan has " + NB.coursesText(plan.length) + ".";

      var planned = index === -1;
      var name = course.code + " " + course.title;
      button.textContent = planned ? "Remove from plan" : "Add to plan";
      button.setAttribute("aria-label", (planned ? "Remove from plan: " : "Add to plan: ") + name);
      button.classList.toggle("is-added", planned);
      var card = button.closest("article");
      card.querySelector("[data-badges]").innerHTML = statusBadges(course);
      NB.announce(message);
    });

    render();
  });
})();
