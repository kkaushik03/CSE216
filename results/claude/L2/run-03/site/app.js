/* Northfield University – Course Registration
   Shared behaviour for every page plus page-specific controllers.
   No build step, no dependencies. */
(function () {
  "use strict";

  var DATA = window.UCR_DATA;
  var STORAGE_KEYS = { registrations: "ucr.registrations", profile: "ucr.profile" };

  /* ------------------------------------------------------------------
     Storage (falls back to memory when localStorage is unavailable)
     ------------------------------------------------------------------ */
  var memoryStore = {};
  function readStore(key) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw === null ? undefined : JSON.parse(raw);
    } catch (e) {
      return memoryStore[key];
    }
  }
  function writeStore(key, value) {
    memoryStore[key] = value;
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* memory only */ }
  }

  function getRegistrations() {
    var ids = readStore(STORAGE_KEYS.registrations);
    if (!Array.isArray(ids)) {
      ids = DATA.defaultRegistrations.slice();
      writeStore(STORAGE_KEYS.registrations, ids);
    }
    // Ignore any ids that no longer exist in the catalog
    return ids.filter(function (id) { return !!findCourse(id); });
  }
  function setRegistrations(ids) {
    writeStore(STORAGE_KEYS.registrations, ids);
    updateNavCount();
  }
  function isRegistered(id) { return getRegistrations().indexOf(id) !== -1; }

  function getProfile() {
    var p = readStore(STORAGE_KEYS.profile);
    return Object.assign({}, DATA.defaultProfile, p && typeof p === "object" ? p : {});
  }
  function setProfile(p) { writeStore(STORAGE_KEYS.profile, p); }

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  var DAY_NAMES = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };
  var YEAR_NAMES = { "1": "First year", "2": "Second year", "3": "Third year", "4": "Fourth year" };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function findCourse(id) {
    for (var i = 0; i < DATA.courses.length; i++) if (DATA.courses[i].id === id) return DATA.courses[i];
    return null;
  }
  function findDept(id) {
    for (var i = 0; i < DATA.departments.length; i++) if (DATA.departments[i].id === id) return DATA.departments[i];
    return { id: id, name: id, color: "#6d28d9", tint: "#ede9fe" };
  }

  function formatTime(hhmm) {
    var parts = hhmm.split(":");
    var h = parseInt(parts[0], 10);
    var suffix = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + parts[1] + " " + suffix;
  }

  /* Short day names visually, full names for screen readers. */
  function daysHTML(days) {
    var short = days.join(", ");
    var full = days.map(function (d) { return DAY_NAMES[d]; });
    var spoken = full.length > 1 ? full.slice(0, -1).join(", ") + " and " + full[full.length - 1] : full[0];
    return '<span aria-hidden="true">' + esc(short) + '</span><span class="visually-hidden">' + esc(spoken) + "</span>";
  }
  function scheduleHTML(c) {
    return daysHTML(c.days) + " " + esc(formatTime(c.start)) + " to " + esc(formatTime(c.end));
  }
  function scheduleText(c) {
    return c.days.map(function (d) { return DAY_NAMES[d]; }).join(", ") + ", " + formatTime(c.start) + " to " + formatTime(c.end);
  }

  function seatsTaken(c) { return c.enrolled + (isRegistered(c.id) ? 1 : 0); }
  function seatsOpen(c) { return Math.max(0, c.seats - seatsTaken(c)); }
  function isFull(c) { return !isRegistered(c.id) && seatsOpen(c) === 0; }

  function totalCredits(ids) {
    return ids.reduce(function (sum, id) { var c = findCourse(id); return sum + (c ? c.credits : 0); }, 0);
  }

  function coursesConflict(a, b) {
    var shareDay = a.days.some(function (d) { return b.days.indexOf(d) !== -1; });
    return shareDay && a.start < b.end && b.start < a.end;
  }
  function sharedDays(a, b) {
    return a.days.filter(function (d) { return b.days.indexOf(d) !== -1; }).map(function (d) { return DAY_NAMES[d]; });
  }

  function pluralize(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }

  /* ------------------------------------------------------------------
     Screen-reader announcer (polite live region, present from page load)
     ------------------------------------------------------------------ */
  var announcer;
  function setupAnnouncer() {
    announcer = document.createElement("div");
    announcer.className = "visually-hidden";
    announcer.setAttribute("role", "status");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    document.body.appendChild(announcer);
  }
  function announce(message) {
    if (!announcer) return;
    announcer.textContent = "";
    // A short delay makes repeated identical messages announce again
    setTimeout(function () { announcer.textContent = message; }, 100);
  }

  /* ------------------------------------------------------------------
     Navigation
     ------------------------------------------------------------------ */
  function setupNav() {
    var toggle = $(".nav-toggle");
    var menu = $("#nav-menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Escape closes the menu and returns focus to the toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close when focus or a click leaves the navigation (small screens only)
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !e.target.closest(".site-nav")) setOpen(false);
    });
    menu.addEventListener("focusout", function (e) {
      var nav = $(".site-nav");
      if (toggle.getAttribute("aria-expanded") === "true" && e.relatedTarget && !nav.contains(e.relatedTarget)) setOpen(false);
    });

    updateNavCount();
  }

  function updateNavCount() {
    var badge = $("#nav-count");
    if (!badge) return;
    var n = getRegistrations().length;
    badge.innerHTML = '<span aria-hidden="true">' + n + '</span><span class="visually-hidden">, ' + pluralize(n, "registered course") + "</span>";
  }

  /* ------------------------------------------------------------------
     Confirmation modal (native <dialog>: focus is contained, Escape closes)
     Returns a Promise<boolean>.
     ------------------------------------------------------------------ */
  var dialogCounter = 0;
  function confirmDialog(opts) {
    return new Promise(function (resolve) {
      var opener = document.activeElement;
      var id = "modal-" + (++dialogCounter);
      var dlg = document.createElement("dialog");
      dlg.className = "modal tone-" + (opts.tone || "primary");
      dlg.setAttribute("aria-labelledby", id + "-title");
      dlg.setAttribute("aria-describedby", id + "-desc");
      dlg.innerHTML =
        '<div class="modal-header"><h2 id="' + id + '-title"></h2></div>' +
        '<div class="modal-content"><p id="' + id + '-desc"></p><div class="modal-extra"></div></div>' +
        '<div class="modal-actions">' +
          '<button type="button" class="btn btn-secondary" value="cancel"></button>' +
          '<button type="button" class="btn ' + (opts.tone === "danger" ? "btn-danger" : "") + '" value="confirm"></button>' +
        "</div>";
      $("#" + id + "-title", dlg).textContent = opts.title;
      $("#" + id + "-desc", dlg).textContent = opts.description;
      if (opts.extraHTML) $(".modal-extra", dlg).innerHTML = opts.extraHTML;
      var cancelBtn = $('button[value="cancel"]', dlg);
      var confirmBtn = $('button[value="confirm"]', dlg);
      cancelBtn.textContent = opts.cancelLabel || "Cancel";
      confirmBtn.textContent = opts.confirmLabel || "Confirm";

      cancelBtn.addEventListener("click", function () { dlg.close("cancel"); });
      confirmBtn.addEventListener("click", function () { dlg.close("confirm"); });
      // Clicking the backdrop (the dialog element itself) cancels
      dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close("cancel"); });
      dlg.addEventListener("cancel", function () { dlg.returnValue = "cancel"; });

      dlg.addEventListener("close", function () {
        var confirmed = dlg.returnValue === "confirm";
        dlg.remove();
        document.body.classList.remove("modal-open");
        // Restore focus first; callers may then move it somewhere more useful
        if (opener && opener.isConnected && typeof opener.focus === "function") opener.focus();
        resolve(confirmed);
      });

      document.body.appendChild(dlg);
      document.body.classList.add("modal-open");
      dlg.showModal();
      // Destructive actions start on the safe choice
      (opts.tone === "danger" ? cancelBtn : confirmBtn).focus();
    });
  }

  /* ------------------------------------------------------------------
     Course card
     ------------------------------------------------------------------ */
  function courseCardHTML(c, headingLevel) {
    var h = "h" + (headingLevel || 3);
    var dept = findDept(c.dept);
    var registered = isRegistered(c.id);
    var full = isFull(c);
    var open = seatsOpen(c);
    var pct = Math.round((seatsTaken(c) / c.seats) * 100);
    var titleId = "card-" + c.id + "-title";
    var fullName = c.code + ": " + c.title;

    var actions;
    if (registered) {
      actions = '<span class="status-pill registered"><span aria-hidden="true">✓</span> Registered</span>' +
        '<a href="profile.html">View in profile<span class="visually-hidden"> (' + esc(fullName) + ")</span></a>";
    } else if (full) {
      actions = '<span class="status-pill full"><span aria-hidden="true">✕</span> Course full</span>';
    } else {
      actions = '<a class="btn btn-sm" href="register.html?course=' + encodeURIComponent(c.id) + '">Register' +
        '<span class="visually-hidden"> for ' + esc(fullName) + "</span></a>";
    }

    return '<li style="--dept-color:' + dept.color + ";--dept-tint:" + dept.tint + '">' +
      '<article class="course-card" aria-labelledby="' + titleId + '">' +
        '<div class="course-card-body">' +
          '<div class="course-card-top">' +
            '<span class="course-code">' + esc(c.code) + "</span>" +
            '<span class="course-credits">' + pluralize(c.credits, "credit") + "</span>" +
          "</div>" +
          "<" + h + ' id="' + titleId + '"><span class="visually-hidden">' + esc(c.code) + ": </span>" + esc(c.title) + "</" + h + ">" +
          '<p class="course-dept">' + esc(dept.name) + " · " + esc(c.level) + "</p>" +
          '<p class="course-desc">' + esc(c.description) + "</p>" +
          '<dl class="course-meta">' +
            "<dt>Instructor</dt><dd>" + esc(c.instructor) + "</dd>" +
            "<dt>Schedule</dt><dd>" + scheduleHTML(c) + "</dd>" +
            "<dt>Room</dt><dd>" + esc(c.room) + "</dd>" +
          "</dl>" +
          '<div class="seats' + (open === 0 ? " seats-full" : "") + '">' +
            '<p class="seats-text">' + (open === 0 ? "No seats left" : open + " of " + c.seats + " seats open") + "</p>" +
            '<div class="seats-bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
          "</div>" +
        "</div>" +
        '<div class="course-card-actions">' + actions + "</div>" +
      "</article></li>";
  }

  /* ------------------------------------------------------------------
     Home page
     ------------------------------------------------------------------ */
  function initHome() {
    var regs = getRegistrations();
    var statCourses = $("#stat-courses");
    if (statCourses) statCourses.textContent = DATA.courses.length;
    var statDepts = $("#stat-depts");
    if (statDepts) statDepts.textContent = DATA.departments.length;
    var statOpen = $("#stat-open");
    if (statOpen) statOpen.textContent = DATA.courses.filter(function (c) { return !isFull(c); }).length;
    var statMine = $("#stat-mine");
    if (statMine) statMine.textContent = regs.length;

    var deptList = $("#dept-list");
    if (deptList) {
      deptList.innerHTML = DATA.departments.map(function (d) {
        var count = DATA.courses.filter(function (c) { return c.dept === d.id; }).length;
        return '<li><a class="dept-chip" style="--dept-color:' + d.color + '" href="catalog.html?dept=' + d.id + '">' +
          esc(d.name) + '<span class="visually-hidden"> (' + pluralize(count, "course") + ")</span></a></li>";
      }).join("");
    }

    var featured = $("#featured-courses");
    if (featured) {
      var picks = ["CS340", "BIO305", "ART101", "ECON345"].map(findCourse).filter(Boolean);
      featured.innerHTML = picks.map(function (c) { return courseCardHTML(c, 3); }).join("");
    }
  }

  /* ------------------------------------------------------------------
     Catalog page
     ------------------------------------------------------------------ */
  function initCatalog() {
    var form = $("#filter-form");
    var q = $("#search");
    var dept = $("#filter-dept");
    var level = $("#filter-level");
    var credits = $("#filter-credits");
    var sort = $("#sort");
    var openOnly = $("#filter-open");
    var grid = $("#course-results");
    var count = $("#results-count");
    var empty = $("#no-results");

    // Populate dropdowns from data
    DATA.departments.forEach(function (d) { dept.add(new Option(d.name, d.id)); });
    DATA.levels.forEach(function (l) { level.add(new Option(l, l)); });
    var creditValues = DATA.courses.map(function (c) { return c.credits; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
    creditValues.forEach(function (v) { credits.add(new Option(pluralize(v, "credit"), String(v))); });

    // Restore state from the URL (e.g. links from the home page)
    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) q.value = params.get("q");
    if (DATA.departments.some(function (d) { return d.id === params.get("dept"); })) dept.value = params.get("dept");
    if (params.get("level") && DATA.levels.indexOf(params.get("level")) !== -1) level.value = params.get("level");
    if (params.get("credits")) credits.value = params.get("credits");
    if (params.get("open") === "1") openOnly.checked = true;
    if (params.get("sort")) sort.value = params.get("sort");
    if (!sort.value) sort.value = "code";
    if (!credits.value) credits.value = "";

    function matches(c) {
      var term = q.value.trim().toLowerCase();
      if (term) {
        var hay = [c.code, c.code.replace(" ", ""), c.title, c.instructor, c.description, findDept(c.dept).name].join(" ").toLowerCase();
        var words = term.split(/\s+/);
        if (!words.every(function (w) { return hay.indexOf(w) !== -1; })) return false;
      }
      if (dept.value && c.dept !== dept.value) return false;
      if (level.value && c.level !== level.value) return false;
      if (credits.value && String(c.credits) !== credits.value) return false;
      if (openOnly.checked && isFull(c)) return false;
      return true;
    }

    var sorters = {
      code: function (a, b) { return a.code.localeCompare(b.code, undefined, { numeric: true }); },
      title: function (a, b) { return a.title.localeCompare(b.title); },
      "credits-desc": function (a, b) { return b.credits - a.credits || sorters.code(a, b); },
      seats: function (a, b) { return seatsOpen(b) - seatsOpen(a) || sorters.code(a, b); }
    };

    function syncURL() {
      var p = new URLSearchParams();
      if (q.value.trim()) p.set("q", q.value.trim());
      if (dept.value) p.set("dept", dept.value);
      if (level.value) p.set("level", level.value);
      if (credits.value) p.set("credits", credits.value);
      if (openOnly.checked) p.set("open", "1");
      if (sort.value !== "code") p.set("sort", sort.value);
      var qs = p.toString();
      try { history.replaceState(null, "", qs ? "?" + qs : window.location.pathname); } catch (e) { /* file:// in some browsers */ }
    }

    var lastMessage = "";
    function render(shouldAnnounce) {
      var list = DATA.courses.filter(matches).sort(sorters[sort.value] || sorters.code);
      grid.innerHTML = list.map(function (c) { return courseCardHTML(c, 3); }).join("");
      grid.hidden = list.length === 0;
      empty.hidden = list.length !== 0;
      var message = list.length === DATA.courses.length
        ? "Showing all " + pluralize(list.length, "course")
        : "Showing " + list.length + " of " + pluralize(DATA.courses.length, "course");
      count.textContent = message;
      if (shouldAnnounce && message !== lastMessage) announce(message);
      lastMessage = message;
      syncURL();
    }

    var debounced = debounce(function () { render(true); }, 400);
    q.addEventListener("input", debounced);
    [dept, level, credits, sort, openOnly].forEach(function (el) {
      el.addEventListener("change", function () { render(true); });
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); render(true); });
    form.addEventListener("reset", function () {
      // Wait for the browser to reset the controls before re-rendering
      setTimeout(function () { sort.value = "code"; render(true); q.focus(); }, 0);
    });
    var clearBtn = $("#clear-filters");
    if (clearBtn) clearBtn.addEventListener("click", function () { form.reset(); });

    render(false);
  }

  /* ------------------------------------------------------------------
     Registration page
     ------------------------------------------------------------------ */
  function initRegister() {
    var form = $("#registration-form");
    var list = $("#course-options");
    var summaryBox = $("#error-summary");
    var successBox = $("#success-box");
    var termSelect = $("#term");
    var majorSelect = $("#major");

    DATA.majors.forEach(function (m) { majorSelect.add(new Option(m, m)); });
    termSelect.add(new Option(DATA.term, DATA.term));
    termSelect.add(new Option("Summer 2027", "Summer 2027"));
    $all(".term-name").forEach(function (el) { el.textContent = DATA.term; });
    $all(".max-credits").forEach(function (el) { el.textContent = DATA.maxCredits; });

    // Prefill student details from the stored profile
    var profile = getProfile();
    $("#full-name").value = profile.fullName || "";
    $("#student-id").value = profile.studentId || "";
    $("#email").value = profile.email || "";
    if (profile.major) majorSelect.value = profile.major;
    var yearRadio = profile.year && $('input[name="year"][value="' + profile.year + '"]');
    if (yearRadio) yearRadio.checked = true;
    termSelect.value = DATA.term;

    var preselect = new URLSearchParams(window.location.search).get("course");

    function renderOptions(selectedIds) {
      var regs = getRegistrations();
      list.innerHTML = DATA.courses.slice().sort(function (a, b) {
        return a.code.localeCompare(b.code, undefined, { numeric: true });
      }).map(function (c) {
        var dept = findDept(c.dept);
        var registered = regs.indexOf(c.id) !== -1;
        var full = isFull(c);
        var disabled = registered || full;
        var checked = !disabled && selectedIds.indexOf(c.id) !== -1;
        var note = registered ? "Already registered" : full ? "Course full – no seats left" : seatsOpen(c) + " seats open";
        var inputId = "course-" + c.id;
        return '<li class="course-option" style="--dept-color:' + dept.color + ";--dept-tint:" + dept.tint + '">' +
          '<div class="choice">' +
            '<input type="checkbox" name="courses" id="' + inputId + '" value="' + c.id + '"' +
              (checked ? " checked" : "") + (disabled ? " disabled" : "") + ">" +
            '<label for="' + inputId + '">' +
              '<span class="option-title">' + esc(c.code) + ": " + esc(c.title) + "</span>" +
              '<span class="option-meta">' + pluralize(c.credits, "credit") + " · " + scheduleHTML(c) + " · " + esc(c.instructor) + "</span>" +
              '<span class="option-note">' + esc(note) + "</span>" +
            "</label>" +
          "</div></li>";
      }).join("");
    }

    function selectedIds() {
      return $all('input[name="courses"]:checked', list).map(function (i) { return i.value; });
    }

    function updateSummary() {
      var ids = selectedIds();
      var existing = getRegistrations();
      var newCredits = totalCredits(ids);
      var currentCredits = totalCredits(existing);
      var total = newCredits + currentCredits;
      $("#sum-selected").textContent = ids.length;
      $("#sum-new-credits").textContent = newCredits;
      $("#sum-current-credits").textContent = currentCredits;
      $("#sum-total").textContent = total + " / " + DATA.maxCredits;
      var meter = $("#credit-meter");
      meter.firstElementChild.style.width = Math.min(100, (total / DATA.maxCredits) * 100) + "%";
      meter.classList.toggle("over", total > DATA.maxCredits);
      var note = $("#sum-note");
      note.textContent = total > DATA.maxCredits
        ? "Over the limit by " + pluralize(total - DATA.maxCredits, "credit") + "."
        : pluralize(DATA.maxCredits - total, "credit") + " remaining before the limit.";
      var chosen = $("#sum-list");
      chosen.innerHTML = ids.length
        ? ids.map(function (id) { var c = findCourse(id); return "<li>" + esc(c.code) + ": " + esc(c.title) + "</li>"; }).join("")
        : "<li>No courses selected yet</li>";
      $("#selection-status").textContent = pluralize(ids.length, "course") + " selected, " + pluralize(newCredits, "credit") + ". Total with current registrations: " + total + " of " + DATA.maxCredits + " credits.";
    }

    renderOptions(preselect ? [preselect] : []);
    updateSummary();
    list.addEventListener("change", updateSummary);

    /* ---- Validation ---- */
    var fields = {
      fullName: { el: $("#full-name"), error: $("#full-name-error") },
      studentId: { el: $("#student-id"), error: $("#student-id-error") },
      email: { el: $("#email"), error: $("#email-error") },
      major: { el: majorSelect, error: $("#major-error") },
      year: { el: $("#year-group"), error: $("#year-error"), focus: function () { return $('input[name="year"]:checked') || $('input[name="year"]'); } },
      term: { el: termSelect, error: $("#term-error") },
      courses: { el: $("#courses-group"), error: $("#courses-error"), focus: function () { return $('input[name="courses"]:not(:disabled)', list); } },
      agree: { el: $("#agree"), error: $("#agree-error") }
    };

    function setError(key, message) {
      var f = fields[key];
      f.error.hidden = !message;
      f.error.querySelector(".msg").textContent = message || "";
      if (message) f.el.setAttribute("aria-invalid", "true"); else f.el.removeAttribute("aria-invalid");
      if (f.el.tagName === "FIELDSET") f.el.classList.toggle("has-error", !!message);
    }

    function validate() {
      var errors = [];
      function check(key, message) { setError(key, message); if (message) errors.push({ key: key, message: message }); }

      var name = fields.fullName.el.value.trim();
      check("fullName", !name ? "Enter your full name" : name.length < 2 ? "Full name must be at least 2 characters" : "");

      var sid = fields.studentId.el.value.trim().toUpperCase();
      fields.studentId.el.value = sid;
      check("studentId", !sid ? "Enter your student ID" : !/^S\d{7}$/.test(sid) ? "Student ID must be the letter S followed by 7 digits, like S1234567" : "");

      var email = fields.email.el.value.trim();
      check("email", !email ? "Enter your university email address" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter an email address in the correct format, like name@northfield.edu" : "");

      check("major", !majorSelect.value ? "Select your major" : "");
      check("year", !$('input[name="year"]:checked') ? "Select your year of study" : "");
      check("term", !termSelect.value ? "Select a term" : "");

      var ids = selectedIds();
      var courseMsg = "";
      if (!ids.length) {
        courseMsg = "Select at least one course";
      } else {
        var total = totalCredits(ids) + totalCredits(getRegistrations());
        if (total > DATA.maxCredits) {
          courseMsg = "You have selected " + total + " credits in total. Remove courses so the total is " + DATA.maxCredits + " credits or fewer";
        } else {
          var all = ids.map(findCourse);
          var current = getRegistrations().map(findCourse);
          outer:
          for (var i = 0; i < all.length; i++) {
            var others = all.slice(i + 1).concat(current);
            for (var j = 0; j < others.length; j++) {
              if (coursesConflict(all[i], others[j])) {
                courseMsg = all[i].code + " and " + others[j].code + " meet at the same time on " + sharedDays(all[i], others[j]).join(" and ") +
                  ". Choose only one" + (isRegistered(others[j].id) ? " (you are already registered for " + others[j].code + ")" : "");
                break outer;
              }
            }
          }
        }
      }
      check("courses", courseMsg);
      check("agree", !fields.agree.el.checked ? "Confirm that you have read the registration policy" : "");
      return errors;
    }

    function showErrorSummary(errors) {
      var ul = $("ul", summaryBox);
      $("h2", summaryBox).textContent = "There " + (errors.length === 1 ? "is 1 problem" : "are " + errors.length + " problems") + " with your registration";
      ul.innerHTML = "";
      errors.forEach(function (err) {
        var f = fields[err.key];
        var target = f.focus ? f.focus() : f.el;
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + target.id;
        a.textContent = err.message;
        a.addEventListener("click", function (e) {
          e.preventDefault();
          target.focus();
          (f.el.closest(".field, fieldset") || target).scrollIntoView({ block: "center" });
        });
        li.appendChild(a);
        ul.appendChild(li);
      });
      summaryBox.hidden = false;
      summaryBox.focus();
    }

    // Re-validate a field as the user corrects it, once it has shown an error
    form.addEventListener("change", function (e) {
      if (!summaryBox.hidden || $('[aria-invalid="true"]', form)) {
        var key = Object.keys(fields).filter(function (k) {
          var el = fields[k].el;
          return el === e.target || (el.tagName === "FIELDSET" && el.contains(e.target));
        })[0];
        // Every field was validated on submit, so refreshing all messages keeps them in sync
        if (key && fields[key].el.getAttribute("aria-invalid") === "true") validate();
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      successBox.hidden = true;
      var errors = validate();
      if (errors.length) {
        document.title = "Error: Register for courses – Northfield University";
        showErrorSummary(errors);
        return;
      }
      summaryBox.hidden = true;
      document.title = "Register for courses – Northfield University";

      var ids = selectedIds();
      var courses = ids.map(findCourse);
      var credits = totalCredits(ids);
      var extra = "<ul>" + courses.map(function (c) {
        return "<li><strong>" + esc(c.code) + ": " + esc(c.title) + "</strong><br>" + pluralize(c.credits, "credit") + ", " + scheduleHTML(c) + "</li>";
      }).join("") + "</ul>" +
        "<p><strong>Student:</strong> " + esc(fields.fullName.el.value.trim()) + " (" + esc(fields.studentId.el.value) + ")<br>" +
        "<strong>Term:</strong> " + esc(termSelect.value) + "</p>";

      confirmDialog({
        title: "Confirm your registration",
        description: "You are about to register for " + pluralize(courses.length, "course") + " (" + pluralize(credits, "credit") + ").",
        extraHTML: extra,
        confirmLabel: "Confirm registration",
        cancelLabel: "Go back and edit"
      }).then(function (ok) {
        if (!ok) return;
        var regs = getRegistrations();
        ids.forEach(function (id) { if (regs.indexOf(id) === -1) regs.push(id); });
        setRegistrations(regs);
        var checkedYear = $('input[name="year"]:checked');
        setProfile(Object.assign(getProfile(), {
          fullName: fields.fullName.el.value.trim(),
          studentId: fields.studentId.el.value.trim(),
          email: fields.email.el.value.trim(),
          major: majorSelect.value,
          year: checkedYear ? checkedYear.value : ""
        }));

        $("#success-list").innerHTML = courses.map(function (c) { return "<li>" + esc(c.code) + ": " + esc(c.title) + "</li>"; }).join("");
        $("#success-total").textContent = pluralize(totalCredits(regs), "credit");
        fields.agree.el.checked = false;
        renderOptions([]);
        updateSummary();
        successBox.hidden = false;
        successBox.focus();
        successBox.scrollIntoView({ block: "start" });
        document.title = "Registration complete – Northfield University";
      });
    });
  }

  /* ------------------------------------------------------------------
     Profile page
     ------------------------------------------------------------------ */
  function initProfile() {
    var p = getProfile();
    var initials = p.fullName.split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
    $("#avatar").textContent = initials || "?";
    $("#profile-name").textContent = p.fullName;
    $("#profile-major").textContent = p.major + " major";
    $("#pd-id").textContent = p.studentId;
    $("#pd-email").innerHTML = '<a href="mailto:' + esc(p.email) + '">' + esc(p.email) + "</a>";
    $("#pd-year").textContent = YEAR_NAMES[p.year] || "Not set";
    $("#pd-advisor").textContent = p.advisor;
    $all(".term-name").forEach(function (el) { el.textContent = DATA.term; });

    var tbody = $("#registered-body");
    var tableWrap = $("#table-wrap");
    var empty = $("#no-registrations");
    var heading = $("#registered-heading");

    function render() {
      var regs = getRegistrations();
      var courses = regs.map(findCourse).sort(function (a, b) { return a.code.localeCompare(b.code, undefined, { numeric: true }); });
      var credits = totalCredits(regs);

      $("#stat-count").textContent = courses.length;
      $("#stat-credits").textContent = credits;
      $("#stat-remaining").textContent = Math.max(0, DATA.maxCredits - credits);

      tbody.innerHTML = courses.map(function (c) {
        var dept = findDept(c.dept);
        return '<tr style="--dept-color:' + dept.color + '">' +
          '<th scope="row"><span class="dept-dot" aria-hidden="true"></span>' + esc(c.code) + "</th>" +
          "<td>" + esc(c.title) + "</td>" +
          "<td>" + esc(dept.name) + "</td>" +
          "<td>" + scheduleHTML(c) + "<br><span class=\"hint\">" + esc(c.room) + "</span></td>" +
          "<td>" + esc(c.instructor) + "</td>" +
          '<td class="num">' + c.credits + "</td>" +
          '<td><button type="button" class="btn btn-sm btn-secondary" data-drop="' + c.id + '">Drop<span class="visually-hidden"> ' + esc(c.code) + ": " + esc(c.title) + "</span></button></td>" +
        "</tr>";
      }).join("");
      $("#total-credits").textContent = credits;
      tableWrap.hidden = courses.length === 0;
      empty.hidden = courses.length !== 0;
    }

    tbody.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-drop]");
      if (!btn) return;
      var c = findCourse(btn.getAttribute("data-drop"));
      var buttons = $all("button[data-drop]", tbody);
      var index = buttons.indexOf(btn);

      confirmDialog({
        title: "Drop " + c.code + "?",
        description: "You will be removed from " + c.code + ": " + c.title + " (" + pluralize(c.credits, "credit") + ", " + scheduleText(c) + "). Your seat may be given to another student.",
        confirmLabel: "Drop course",
        cancelLabel: "Keep course",
        tone: "danger"
      }).then(function (ok) {
        if (!ok) return;
        setRegistrations(getRegistrations().filter(function (id) { return id !== c.id; }));
        render();
        announce(c.code + " dropped. You now have " + pluralize(totalCredits(getRegistrations()), "credit") + ".");
        // Move focus to a sensible place: the next row's button, the previous one, or the section heading
        var remaining = $all("button[data-drop]", tbody);
        var next = remaining[Math.min(index, remaining.length - 1)];
        if (next) next.focus(); else heading.focus();
      });
    });

    render();
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function init() {
    setupAnnouncer();
    setupNav();
    var y = $("#copyright-year");
    if (y) y.textContent = new Date().getFullYear();
    var page = document.body.getAttribute("data-page");
    if (page === "home") initHome();
    else if (page === "catalog") initCatalog();
    else if (page === "register") initRegister();
    else if (page === "profile") initProfile();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
