/* Horizon University – Course Registration app logic (no build step). */
(function () {
  "use strict";

  var COURSES = window.COURSES || [];
  var THEMES = window.DEPT_THEMES || {};
  var MAX_CREDITS = window.MAX_CREDITS || 18;
  var REG_KEY = "hu-registrations";
  var PROFILE_KEY = "hu-profile";

  /* ---------- Storage helpers ---------- */
  function readJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* Storage may be unavailable (private mode); app still works for this page view. */
    }
  }
  function getRegistrations() { return readJSON(REG_KEY, []); }
  function saveRegistrations(list) { writeJSON(REG_KEY, list); }
  function getProfile() { return readJSON(PROFILE_KEY, null); }
  function saveProfile(p) { writeJSON(PROFILE_KEY, p); }

  function isRegistered(id) {
    return getRegistrations().some(function (r) { return r.id === id; });
  }
  function findCourse(id) {
    for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === id) return COURSES[i];
    return null;
  }
  function seatsLeft(course) {
    var left = course.capacity - course.enrolled - (isRegistered(course.id) ? 1 : 0);
    return Math.max(0, left);
  }
  function registeredCourses() {
    return getRegistrations().map(function (r) {
      var c = findCourse(r.id);
      return c ? Object.assign({ registeredOn: r.date }, c) : null;
    }).filter(Boolean);
  }
  function registeredCredits() {
    return registeredCourses().reduce(function (sum, c) { return sum + c.credits; }, 0);
  }
  function themeFor(dept) { return THEMES[dept] || { color: "#5b21b6", icon: "📘" }; }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  /* ---------- DOM helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k];
        else if (k === "class") node.className = attrs[k];
        else if (k === "style") node.setAttribute("style", attrs[k]);
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }
  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    var toggle = $(".nav-toggle");
    var list = $("#nav-list");
    if (toggle && list) {
      var setOpen = function (open) {
        toggle.setAttribute("aria-expanded", String(open));
        list.classList.toggle("is-open", open);
      };
      toggle.addEventListener("click", function () {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true" && list.contains(document.activeElement)) {
          setOpen(false);
          toggle.focus();
        }
      });
    }
    updateNavBadge();
  }
  function updateNavBadge() {
    var badge = $("[data-registered-badge]");
    if (!badge) return;
    var n = getRegistrations().length;
    badge.textContent = "";
    if (n > 0) {
      badge.appendChild(el("span", { "aria-hidden": "true", text: String(n) }));
      badge.appendChild(el("span", { class: "visually-hidden", text: " (" + plural(n, "registered course") + ")" }));
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }
  function fillMaxCredits() {
    $all("[data-max-credits]").forEach(function (n) { n.textContent = String(MAX_CREDITS); });
  }

  /* ---------- Modal dialogs ---------- */
  var lastTrigger = null;
  function openDialog(dialog) {
    lastTrigger = document.activeElement;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    var first = dialog.querySelector("[data-dialog-cancel]") || dialog.querySelector("button");
    if (first) first.focus();
  }
  function closeDialog(dialog) {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  }
  function initDialogs() {
    $all("dialog.modal").forEach(function (dialog) {
      $all("[data-dialog-cancel]", dialog).forEach(function (btn) {
        btn.addEventListener("click", function () { closeDialog(dialog); });
      });
      // Click on the backdrop closes the dialog.
      dialog.addEventListener("click", function (e) {
        if (e.target === dialog) closeDialog(dialog);
      });
      // Return focus to the element that opened the dialog (unless the action moved focus elsewhere).
      dialog.addEventListener("close", function () {
        if (dialog.dataset.skipRestore === "true") {
          dialog.dataset.skipRestore = "";
          return;
        }
        if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
      });
    });
  }

  /* ---------- Course card ---------- */
  function availabilityPill(course) {
    if (isRegistered(course.id)) return el("span", { class: "pill pill-registered", text: "✓ Registered" });
    var left = seatsLeft(course);
    if (left === 0) return el("span", { class: "pill pill-full", text: "Full – waitlist only" });
    if (left <= 5) return el("span", { class: "pill pill-low", text: plural(left, "seat") + " left" });
    return el("span", { class: "pill pill-open", text: plural(left, "seat") + " open" });
  }
  function courseCard(course, headingLevel) {
    var theme = themeFor(course.dept);
    var titleId = "card-title-" + course.id;
    var action;
    if (isRegistered(course.id)) {
      action = el("a", { class: "btn btn-outline btn-small", href: "profile.html" }, [
        "View in profile", el("span", { class: "visually-hidden", text: ": " + course.title })
      ]);
    } else if (seatsLeft(course) === 0) {
      action = el("span", { class: "hint", text: "No seats available" });
    } else {
      action = el("a", { class: "btn btn-primary btn-small", href: "register.html?course=" + encodeURIComponent(course.id) }, [
        "Register", el("span", { class: "visually-hidden", text: " for " + course.code + " " + course.title })
      ]);
    }
    return el("li", null, [
      el("article", { class: "course-card", style: "--accent: " + theme.color, "aria-labelledby": titleId }, [
        el("div", { class: "course-card-top" }, [
          el("p", { class: "course-dept" }, [el("span", { "aria-hidden": "true", text: theme.icon + " " }), course.dept]),
          el("h" + (headingLevel || 3), { id: titleId }, [
            el("span", { class: "course-code", text: course.code }),
            el("span", { class: "visually-hidden", text: ": " }),
            course.title
          ])
        ]),
        el("div", { class: "course-card-body" }, [
          el("p", { text: course.description }),
          el("dl", { class: "course-meta" }, [
            el("dt", { text: "Credits" }), el("dd", { text: String(course.credits) }),
            el("dt", { text: "Level" }), el("dd", { text: course.level }),
            el("dt", { text: "When" }), el("dd", { text: course.days + ", " + course.time }),
            el("dt", { text: "Instructor" }), el("dd", { text: course.instructor }),
            el("dt", { text: "Room" }), el("dd", { text: course.room })
          ]),
          el("div", { class: "course-card-footer" }, [availabilityPill(course), action])
        ])
      ])
    ]);
  }

  /* ---------- Home page ---------- */
  function initHome() {
    var depts = Object.keys(THEMES).filter(function (d) {
      return COURSES.some(function (c) { return c.dept === d; });
    });
    var set = function (key, val) { var n = $('[data-stat="' + key + '"]'); if (n) n.textContent = String(val); };
    set("courses", COURSES.length);
    set("depts", depts.length);
    set("open", COURSES.filter(function (c) { return seatsLeft(c) > 0; }).length);
    set("credits", registeredCredits());

    var deptList = $("#dept-list");
    depts.forEach(function (d) {
      var theme = themeFor(d);
      var count = COURSES.filter(function (c) { return c.dept === d; }).length;
      deptList.appendChild(el("li", null, [
        el("a", { href: "catalog.html?dept=" + encodeURIComponent(d), style: "--accent: " + theme.color }, [
          el("span", { "aria-hidden": "true", text: theme.icon + " " }),
          d + " (" + plural(count, "course") + ")"
        ])
      ]));
    });

    var featured = $("#featured-courses");
    COURSES.filter(function (c) { return seatsLeft(c) > 5; })
      .sort(function (a, b) { return seatsLeft(b) - seatsLeft(a); })
      .slice(0, 3)
      .forEach(function (c) { featured.appendChild(courseCard(c, 3)); });
  }

  /* ---------- Catalog page ---------- */
  function initCatalog() {
    var form = $("#filter-form");
    var search = $("#search");
    var dept = $("#filter-dept");
    var level = $("#filter-level");
    var credits = $("#filter-credits");
    var seats = $("#filter-seats");
    var grid = $("#course-grid");
    var count = $("#results-count");
    var empty = $("#no-results");

    Object.keys(THEMES).forEach(function (d) {
      if (COURSES.some(function (c) { return c.dept === d; })) dept.appendChild(el("option", { value: d, text: d }));
    });

    // Apply URL parameters (from the home page quick search / department links).
    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) search.value = params.get("q");
    if (params.get("dept") && THEMES[params.get("dept")]) dept.value = params.get("dept");

    var announceTimer = null;
    function render(announceNow) {
      var q = search.value.trim().toLowerCase();
      var results = COURSES.filter(function (c) {
        var hay = [c.code, c.title, c.dept, c.instructor, c.description].join(" ").toLowerCase();
        if (q && hay.indexOf(q) === -1) return false;
        if (dept.value && c.dept !== dept.value) return false;
        if (level.value && c.level !== level.value) return false;
        if (credits.value && String(c.credits) !== credits.value) return false;
        if (seats.value === "open" && seatsLeft(c) === 0) return false;
        return true;
      });

      grid.textContent = "";
      results.forEach(function (c) { grid.appendChild(courseCard(c, 3)); });
      empty.hidden = results.length > 0;

      // Debounce the live-region update so screen readers aren't flooded while typing.
      var message = "Showing " + plural(results.length, "course") + " of " + COURSES.length + ".";
      clearTimeout(announceTimer);
      if (announceNow) count.textContent = message;
      else announceTimer = setTimeout(function () { count.textContent = message; }, 500);
    }

    form.addEventListener("submit", function (e) { e.preventDefault(); render(true); });
    search.addEventListener("input", function () { render(false); });
    [dept, level, credits, seats].forEach(function (s) { s.addEventListener("change", function () { render(true); }); });
    form.addEventListener("reset", function () {
      // Let the browser reset values first, then re-render.
      setTimeout(function () {
        if (window.history.replaceState) window.history.replaceState(null, "", "catalog.html");
        render(true);
        search.focus();
      }, 0);
    });

    render(true);
  }

  /* ---------- Registration page ---------- */
  function initRegister() {
    var form = $("#registration-form");
    var optionsList = $("#course-options");
    var errorSummary = $("#error-summary");
    var errorList = $("#error-list");
    var success = $("#success-message");
    var dialog = $("#confirm-dialog");
    var confirmContent = $("#confirm-content");
    var confirmBtn = $("#confirm-submit");
    var pending = null;

    function buildOptions() {
      var checked = $all('input[name="courses"]:checked', optionsList).map(function (i) { return i.value; });
      optionsList.textContent = "";
      COURSES.forEach(function (c) {
        var theme = themeFor(c.dept);
        var id = "course-" + c.id;
        var registered = isRegistered(c.id);
        var left = seatsLeft(c);
        var status = registered ? "Already registered" : left === 0 ? "Full" : plural(left, "seat") + " left";
        var input = el("input", { type: "checkbox", id: id, name: "courses", value: c.id });
        if (registered || left === 0) input.disabled = true;
        else if (checked.indexOf(c.id) !== -1) input.checked = true;
        optionsList.appendChild(el("li", null, [
          el("label", { class: "course-option", for: id, style: "--accent: " + theme.color }, [
            input,
            el("span", { class: "course-option-text" }, [
              el("span", { class: "course-option-title", text: c.code + " – " + c.title }),
              el("span", { class: "course-option-detail", text: plural(c.credits, "credit") + " · " + c.days + ", " + c.time + " · " + status })
            ])
          ])
        ]));
      });
    }

    function selectedCourses() {
      return $all('input[name="courses"]:checked', optionsList).map(function (i) { return findCourse(i.value); });
    }

    function updateSummary() {
      var list = $("#selection-list");
      var chosen = selectedCourses();
      var newCredits = chosen.reduce(function (s, c) { return s + c.credits; }, 0);
      var existing = registeredCredits();
      var total = newCredits + existing;
      list.textContent = "";
      chosen.forEach(function (c) {
        list.appendChild(el("li", null, [el("span", { text: c.code + " " + c.title }), el("strong", { text: plural(c.credits, "credit") })]));
      });
      $("#selection-empty").hidden = chosen.length > 0;
      var fill = $("#credit-meter-fill");
      fill.style.width = Math.min(100, (total / MAX_CREDITS) * 100) + "%";
      fill.classList.toggle("over", total > MAX_CREDITS);
      var msg = plural(chosen.length, "course") + " selected (" + plural(newCredits, "credit") + "). " +
        "Total with existing registrations: " + total + " of " + MAX_CREDITS + " credits.";
      if (total > MAX_CREDITS) msg += " This is over the credit limit.";
      $("#credit-status").textContent = msg;
    }

    function prefill() {
      var p = getProfile();
      if (!p) return;
      form.elements.fullName.value = p.name || "";
      form.studentId.value = p.studentId || "";
      form.email.value = p.email || "";
      form.program.value = p.program || "";
      $all('input[name="year"]', form).forEach(function (r) { r.checked = r.value === p.year; });
    }

    function setFieldError(field, errorEl, message) {
      errorEl.textContent = message || "";
      if (field) {
        if (message) field.setAttribute("aria-invalid", "true");
        else field.removeAttribute("aria-invalid");
      }
    }

    function validate() {
      var errors = [];
      var name = form.elements.fullName.value.trim();
      var sid = form.studentId.value.trim().toUpperCase();
      var email = form.email.value.trim();
      var year = $('input[name="year"]:checked', form);
      var chosen = selectedCourses();
      var total = registeredCredits() + chosen.reduce(function (s, c) { return s + c.credits; }, 0);

      function check(cond, field, errId, msg, focusId) {
        var errEl = document.getElementById(errId);
        if (cond) { setFieldError(field, errEl, ""); return; }
        setFieldError(field, errEl, msg);
        errors.push({ id: focusId, msg: msg });
      }

      check(name.length >= 2, form.elements.fullName, "fullName-error", "Enter your full name.", "fullName");
      check(/^S\d{7}$/.test(sid), form.studentId, "studentId-error",
        sid ? "Student ID must be the letter S followed by 7 digits, like S1234567." : "Enter your student ID.", "studentId");
      check(/^[^\s@]+@horizon\.edu$/i.test(email), form.email, "email-error",
        email ? "Enter a university email address ending in @horizon.edu." : "Enter your university email address.", "email");
      check(!!form.program.value, form.program, "program-error", "Select your program.", "program");
      check(!!year, null, "year-error", "Select your year of study.", "year-1");
      $all('input[name="year"]', form).forEach(function (r) {
        if (year) r.removeAttribute("aria-invalid"); else r.setAttribute("aria-invalid", "true");
      });

      var firstCourse = $('input[name="courses"]:not(:disabled)', optionsList);
      var courseMsg = "";
      if (chosen.length === 0) courseMsg = "Select at least one course.";
      else if (total > MAX_CREDITS) courseMsg = "Your total would be " + total + " credits. Remove courses to stay within " + MAX_CREDITS + " credits.";
      check(!courseMsg, null, "courses-error", courseMsg, firstCourse ? firstCourse.id : "courses-group");

      check(form.agree.checked, form.agree, "agree-error", "Confirm that you have reviewed prerequisites and the academic calendar.", "agree");

      return errors;
    }

    function showErrorSummary(errors) {
      errorList.textContent = "";
      errors.forEach(function (err) {
        var link = el("a", { href: "#" + err.id, text: err.msg });
        link.addEventListener("click", function (e) {
          e.preventDefault();
          var target = document.getElementById(err.id);
          if (target) target.focus();
        });
        errorList.appendChild(el("li", null, [link]));
      });
      errorSummary.hidden = false;
      success.hidden = true;
      document.title = "Error: Register – Horizon University Course Registration";
      errorSummary.focus();
    }

    function clearErrors() {
      errorSummary.hidden = true;
      document.title = "Register – Horizon University Course Registration";
      $all(".field-error", form).forEach(function (e) { e.textContent = ""; });
      $all("[aria-invalid]", form).forEach(function (f) { f.removeAttribute("aria-invalid"); });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var errors = validate();
      if (errors.length) { showErrorSummary(errors); return; }
      clearErrors();

      var chosen = selectedCourses();
      var credits = chosen.reduce(function (s, c) { return s + c.credits; }, 0);
      pending = {
        profile: {
          name: form.elements.fullName.value.trim(),
          studentId: form.studentId.value.trim().toUpperCase(),
          email: form.email.value.trim(),
          program: form.program.value,
          year: $('input[name="year"]:checked', form).value
        },
        courses: chosen
      };

      confirmContent.textContent = "";
      confirmContent.appendChild(el("dl", { class: "profile-details" }, [
        el("dt", { text: "Name" }), el("dd", { text: pending.profile.name }),
        el("dt", { text: "Student ID" }), el("dd", { text: pending.profile.studentId }),
        el("dt", { text: "Email" }), el("dd", { text: pending.profile.email }),
        el("dt", { text: "Program" }), el("dd", { text: pending.profile.program + ", " + pending.profile.year })
      ]));
      confirmContent.appendChild(el("h3", { text: "Courses (" + plural(credits, "credit") + ")", style: "margin-top: 1rem; font-size: 1.1rem" }));
      confirmContent.appendChild(el("ul", null, chosen.map(function (c) {
        return el("li", { text: c.code + " " + c.title + " – " + c.days + ", " + c.time });
      })));
      openDialog(dialog);
    });

    confirmBtn.addEventListener("click", function () {
      if (!pending) return;
      var regs = getRegistrations();
      var now = new Date().toISOString();
      pending.courses.forEach(function (c) {
        if (!regs.some(function (r) { return r.id === c.id; })) regs.push({ id: c.id, date: now });
      });
      saveRegistrations(regs);
      saveProfile(pending.profile);

      var names = pending.courses.map(function (c) { return c.code; }).join(", ");
      success.textContent = "";
      success.appendChild(el("h2", { text: "Registration complete" }));
      success.appendChild(el("p", null, [
        "You are registered for " + plural(pending.courses.length, "course") + ": " + names + ". ",
        el("a", { href: "profile.html", text: "View your registered courses" }),
        "."
      ]));
      success.hidden = false;
      pending = null;

      dialog.dataset.skipRestore = "true";
      closeDialog(dialog);
      form.agree.checked = false;
      buildOptions();
      $all('input[name="courses"]', optionsList).forEach(function (i) { i.checked = false; });
      updateSummary();
      updateNavBadge();
      success.focus();
      window.scrollTo(0, 0);
    });

    form.addEventListener("reset", function () {
      setTimeout(function () { clearErrors(); updateSummary(); form.elements.fullName.focus(); }, 0);
    });
    optionsList.addEventListener("change", updateSummary);

    buildOptions();
    prefill();

    // Pre-select a course passed from the catalog (?course=ID).
    var pre = new URLSearchParams(window.location.search).get("course");
    if (pre) {
      var box = document.getElementById("course-" + pre);
      if (box && !box.disabled) box.checked = true;
    }
    updateSummary();
  }

  /* ---------- Profile page ---------- */
  function initProfile() {
    var dialog = $("#drop-dialog");
    var dropBtn = $("#drop-confirm");
    var status = $("#profile-status");
    var pendingDrop = null;

    function renderProfile() {
      var saved = getProfile();
      var p = saved || window.DEFAULT_STUDENT;
      var details = $("#profile-details");
      details.textContent = "";
      [["Name", p.name], ["Student ID", p.studentId], ["Email", p.email], ["Program", p.program], ["Year", p.year]]
        .forEach(function (pair) {
          details.appendChild(el("dt", { text: pair[0] }));
          details.appendChild(el("dd", { text: pair[1] || "—" }));
        });
      $("#avatar").textContent = (p.name || "?").split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
      var note = $("#profile-note");
      note.textContent = "";
      if (!saved) {
        note.appendChild(document.createTextNode("Showing sample student details. Your details are saved when you complete a "));
        note.appendChild(el("a", { href: "register.html", text: "registration" }));
        note.appendChild(document.createTextNode("."));
      } else {
        note.appendChild(document.createTextNode("To update your details, submit a new "));
        note.appendChild(el("a", { href: "register.html", text: "registration" }));
        note.appendChild(document.createTextNode("."));
      }
    }

    function renderTable() {
      var courses = registeredCourses();
      var body = $("#registered-body");
      var foot = $("#registered-foot");
      var total = courses.reduce(function (s, c) { return s + c.credits; }, 0);
      body.textContent = "";
      foot.textContent = "";

      $("#table-wrap").hidden = courses.length === 0;
      $("#no-courses").hidden = courses.length > 0;
      $("#summary-courses").textContent = String(courses.length);
      $("#summary-credits").textContent = String(total);
      $("#profile-meter").style.width = Math.min(100, (total / MAX_CREDITS) * 100) + "%";

      courses.forEach(function (c) {
        var btn = el("button", { type: "button", class: "btn btn-danger btn-small", "data-drop": c.id }, [
          "Drop", el("span", { class: "visually-hidden", text: " " + c.code + " " + c.title })
        ]);
        body.appendChild(el("tr", null, [
          el("th", { scope: "row", "data-label": "Code", text: c.code }),
          el("td", { "data-label": "Title", text: c.title }),
          el("td", { "data-label": "Department" }, [el("span", { class: "dept-dot", style: "--accent: " + themeFor(c.dept).color, "aria-hidden": "true" }), c.dept]),
          el("td", { "data-label": "Credits", text: String(c.credits) }),
          el("td", { "data-label": "Schedule", text: c.days + ", " + c.time }),
          el("td", { "data-label": "Instructor", text: c.instructor }),
          el("td", { "data-label": "Registered", text: formatDate(c.registeredOn) }),
          el("td", { "data-label": "Actions" }, [btn])
        ]));
      });
      if (courses.length) {
        foot.appendChild(el("tr", null, [
          el("th", { scope: "row", colspan: "3", "data-label": "Total", text: "Total credits" }),
          el("td", { "data-label": "Credits", text: String(total) }),
          el("td", { colspan: "4" })
        ]));
      }
    }

    $("#registered-body").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-drop]");
      if (!btn) return;
      var course = findCourse(btn.getAttribute("data-drop"));
      if (!course) return;
      pendingDrop = course;
      $("#drop-desc").textContent = "You are about to drop " + course.code + " " + course.title +
        " (" + plural(course.credits, "credit") + "). You can register again later if seats are still available.";
      openDialog(dialog);
    });

    dropBtn.addEventListener("click", function () {
      if (!pendingDrop) return;
      var dropped = pendingDrop;
      pendingDrop = null;
      saveRegistrations(getRegistrations().filter(function (r) { return r.id !== dropped.id; }));
      status.textContent = "";
      status.appendChild(el("p", { text: "You dropped " + dropped.code + " " + dropped.title + "." }));
      status.hidden = false;
      dialog.dataset.skipRestore = "true";
      closeDialog(dialog);
      renderTable();
      updateNavBadge();
      status.focus();
    });

    renderProfile();
    renderTable();
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initDialogs();
    fillMaxCredits();
    var page = document.body.getAttribute("data-page");
    if (page === "home") initHome();
    else if (page === "catalog") initCatalog();
    else if (page === "register") initRegister();
    else if (page === "profile") initProfile();
  });
})();
