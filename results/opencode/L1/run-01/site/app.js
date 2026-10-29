(function () {
  "use strict";

  var COURSES = Array.isArray(window.COURSES) ? window.COURSES : [];
  var TERMS = ["Fall 2026", "Spring 2027", "Summer 2027"];
  var PROGRAMS = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Biology",
    "Business",
    "Economics",
    "Design",
    "Psychology",
    "Engineering",
    "Humanities",
    "Undeclared"
  ];

  var DEPT_COLORS = {
    "Computer Science": ["#6366f1", "#a855f7"],
    "Mathematics": ["#0ea5e9", "#06b6d4"],
    "Physics": ["#8b5cf6", "#d946ef"],
    "Biology": ["#10b981", "#84cc16"],
    "Business": ["#f59e0b", "#f97316"],
    "Economics": ["#ef4444", "#f97316"],
    "Design": ["#ec4899", "#f43f5e"],
    "Psychology": ["#14b8a6", "#0ea5e9"],
    "Engineering": ["#3b82f6", "#6366f1"],
    "Humanities": ["#a855f7", "#ec4899"]
  };

  var DEFAULT_COLORS = ["#5b4bff", "#ff4d8d"];

  var KEYS = {
    registrations: "campusflow.registrations.v1",
    student: "campusflow.student.v1"
  };

  var DEFAULT_STUDENT = {
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@university.edu",
    studentId: "STU-2026-0142",
    program: "Computer Science",
    year: "3",
    gpa: "3.7"
  };

  var ICONS = {
    star: '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.4l2.65 5.55 6.05.82-4.42 4.2 1.1 5.96L12 16.99l-5.38 2.94 1.1-5.96-4.42-4.2 6.05-.82L12 3.4z"/></svg>',
    book: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20"/></svg>',
    clock: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/></svg>',
    user: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.7-3.6 3.5-5.5 7-5.5s6.3 1.9 7 5.5"/></svg>',
    pin: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s6.5-5.6 6.5-10.4A6.5 6.5 0 0 0 5.5 10.6C5.5 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.4"/></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
    arrow: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    trash: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 11v5M14 11v5"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>',
    spark: '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l1.9 5.4 5.4 1.9-5.4 1.9L12 17.4l-1.9-5.4L4.7 10.1l5.4-1.9L12 2.8z"/><path d="M19 15l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9L19 15z"/></svg>',
    cap: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 9.2L12 5l9.5 4.2L12 13.4 2.5 9.2z"/><path d="M6 11.3V16c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4.7"/><path d="M21.5 9.2v5"/></svg>',
    calendar: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>'
  };

  var memory = {};
  var lastFocused = null;

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function readJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) {
        return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : fallback;
      }
      return JSON.parse(raw);
    } catch (error) {
      return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : fallback;
    }
  }

  function writeJSON(key, value) {
    memory[key] = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      memory[key] = value;
    }
  }

  function getStudent() {
    var saved = readJSON(KEYS.student, null);
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      return Object.assign({}, DEFAULT_STUDENT);
    }
    return Object.assign({}, DEFAULT_STUDENT, saved);
  }

  function saveStudent(updates) {
    writeJSON(KEYS.student, Object.assign({}, getStudent(), updates));
  }

  function getRegistrations() {
    var saved = readJSON(KEYS.registrations, []);
    if (!Array.isArray(saved)) {
      return [];
    }
    return saved.filter(function (reg) {
      return reg && typeof reg === "object" && getCourse(reg.courseId);
    });
  }

  function saveRegistrations(list) {
    writeJSON(KEYS.registrations, list);
  }

  function isRegistered(courseId) {
    return getRegistrations().some(function (reg) {
      return reg.courseId === courseId;
    });
  }

  function getCourse(courseId) {
    for (var i = 0; i < COURSES.length; i += 1) {
      if (COURSES[i].id === courseId) {
        return COURSES[i];
      }
    }
    return null;
  }

  function seatsLeft(course) {
    return Math.max(0, course.seats - course.enrolled);
  }

  function addRegistration(courseId, term, notes) {
    var course = getCourse(courseId);
    if (!course) {
      return { ok: false, reason: "missing" };
    }
    if (isRegistered(courseId)) {
      return { ok: false, reason: "duplicate" };
    }
    if (seatsLeft(course) === 0) {
      return { ok: false, reason: "full" };
    }
    var registrations = getRegistrations();
    registrations.push({
      courseId: courseId,
      term: term || TERMS[0],
      notes: notes || "",
      registeredAt: new Date().toISOString()
    });
    saveRegistrations(registrations);
    return { ok: true };
  }

  function removeRegistration(courseId) {
    saveRegistrations(
      getRegistrations().filter(function (reg) {
        return reg.courseId !== courseId;
      })
    );
  }

  function deptColors(dept) {
    return DEPT_COLORS[dept] || DEFAULT_COLORS;
  }

  function courseVars(course) {
    var colors = deptColors(course.dept);
    return "--ca:" + colors[0] + ";--cb:" + colors[1] + ";";
  }

  function yearLabel(year) {
    var value = String(year == null ? "" : year).trim();
    var labels = { "1": "1st year", "2": "2nd year", "3": "3rd year", "4": "4th year", "5": "Graduate" };
    return labels[value] || (value ? value + " year" : "Year not set");
  }

  function initials(student) {
    var first = String(student.firstName || "").trim().charAt(0);
    var last = String(student.lastName || "").trim().charAt(0);
    return (first + last).toUpperCase() || "ST";
  }

  function studentName(student) {
    var name = (String(student.firstName || "") + " " + String(student.lastName || "")).trim();
    return name || "Student";
  }

  var toastTimer = null;

  function toast(message) {
    var el = $("#cfToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "cfToast";
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.classList.remove("show");
    }, 2800);
  }

  function courseCard(course) {
    var left = seatsLeft(course);
    var full = left === 0;
    var registered = isRegistered(course.id);
    var fill = Math.min(100, Math.round((course.enrolled / course.seats) * 100));
    var action;

    if (registered) {
      action = '<span class="btn btn-soft btn-sm is-disabled" aria-disabled="true">' + ICONS.check + " Registered</span>";
    } else if (full) {
      action = '<span class="btn btn-soft btn-sm is-disabled" aria-disabled="true">Full</span>';
    } else {
      action = '<a class="btn btn-primary btn-sm" href="register.html?course=' + encodeURIComponent(course.id) + '">Register ' + ICONS.arrow + "</a>";
    }

    return (
      '<article class="course-card" style="' + courseVars(course) + '">' +
        '<div class="course-top">' +
          '<span class="course-code">' + esc(course.code) + "</span>" +
          '<span class="course-rating">' + ICONS.star + " " + course.rating.toFixed(1) + "</span>" +
        "</div>" +
        '<div class="course-body">' +
          '<span class="dept-tag">' + esc(course.dept) + "</span>" +
          "<h3>" + esc(course.title) + "</h3>" +
          '<p class="course-desc">' + esc(course.description) + "</p>" +
          '<ul class="course-meta">' +
            '<li class="meta-wide">' + ICONS.clock + "<span>" + esc(course.days) + " · " + esc(course.time) + "</span></li>" +
            "<li>" + ICONS.book + "<span>" + course.credits + " credits</span></li>" +
            "<li>" + ICONS.pin + "<span>" + esc(course.room) + "</span></li>" +
            '<li class="meta-wide">' + ICONS.user + "<span>" + esc(course.instructor) + "</span></li>" +
          "</ul>" +
          '<div class="seat-meter" aria-hidden="true"><span style="width:' + fill + '%"></span></div>' +
          '<p class="seat-label">' +
            "<span>" + (full ? "Course is full" : left + " seat" + (left === 1 ? "" : "s") + " left") + "</span>" +
            "<span>" + course.level + " level</span>" +
          "</p>" +
        "</div>" +
        '<div class="course-footer">' +
          '<span class="course-term">Fall 2026</span>' +
          action +
        "</div>" +
      "</article>"
    );
  }

  function renderCourses(list, target) {
    if (!target) {
      return;
    }
    target.innerHTML = list.map(courseCard).join("");
  }

  function renderRegistrationTable(container) {
    if (!container) {
      return;
    }
    var registrations = getRegistrations();

    if (!registrations.length) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-icon">' + ICONS.book + "</div>" +
          "<h3>No courses yet</h3>" +
          "<p>Browse the catalog and add your first course for Fall 2026.</p>" +
          '<a class="btn btn-primary btn-sm" href="catalog.html">Explore courses ' + ICONS.arrow + "</a>" +
        "</div>";
      return;
    }

    var totalCredits = registrations.reduce(function (sum, reg) {
      var course = getCourse(reg.courseId);
      return sum + (course ? course.credits : 0);
    }, 0);

    var rows = registrations.map(function (reg) {
      var course = getCourse(reg.courseId);
      return (
        "<tr>" +
          "<td>" +
            '<div class="cell-course">' +
              '<span class="cell-code" style="' + courseVars(course) + '">' + esc(course.code) + "</span>" +
              "<div><strong>" + esc(course.title) + "</strong><span>" + esc(course.dept) + " · " + esc(course.instructor) + "</span></div>" +
            "</div>" +
          "</td>" +
          '<td><span class="cell-muted">' + esc(course.days) + "</span><br>" +
            '<span class="cell-small">' + esc(course.time) + " · " + esc(course.room) + "</span></td>" +
          '<td><span class="chip">' + course.credits + " cr</span></td>" +
          '<td><span class="cell-muted">' + esc(reg.term || TERMS[0]) + "</span></td>" +
          '<td class="cell-actions"><button class="icon-btn" type="button" data-remove-course="' + esc(course.id) + '" aria-label="Remove ' + esc(course.title) + '" title="Remove course">' + ICONS.trash + "</button></td>" +
        "</tr>"
      );
    }).join("");

    container.innerHTML =
      '<div class="table-wrap">' +
        '<table class="data-table">' +
          "<thead><tr>" +
            '<th scope="col">Course</th>' +
            '<th scope="col">Schedule</th>' +
            '<th scope="col">Credits</th>' +
            '<th scope="col">Term</th>' +
            '<th scope="col"><span class="sr-only">Actions</span></th>' +
          "</tr></thead>" +
          "<tbody>" + rows + "</tbody>" +
        "</table>" +
      "</div>" +
      '<div class="table-total">' +
        "<span>" + registrations.length + " course" + (registrations.length === 1 ? "" : "s") + " registered</span>" +
        "<span><strong>" + totalCredits + "</strong> total credits</span>" +
      "</div>";
  }

  function refreshViews() {
    $$("[data-registration-table]").forEach(renderRegistrationTable);
    if (typeof window.cfRefresh === "function") {
      window.cfRefresh();
    }
  }

  function openModal(modal) {
    if (!modal) {
      return;
    }
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    var closeButton = $("[data-modal-close]", modal);
    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeModal(modal) {
    if (!modal) {
      return;
    }
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function initModals() {
    $$(".modal").forEach(function (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal || event.target.closest("[data-modal-close]")) {
          closeModal(modal);
        }
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        var open = $(".modal.open");
        if (open) {
          closeModal(open);
        }
      }
    });
  }

  function initNav() {
    var toggle = $("[data-nav-toggle]");
    var links = $(".nav-links");

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      links.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    var page = document.body.getAttribute("data-page");
    $$("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    $$("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function initHome() {
    var featuredTarget = $("[data-featured]");
    var deptTarget = $("[data-dept-tiles]");

    if (!featuredTarget && !deptTarget) {
      return;
    }

    function renderFeatured() {
      if (!featuredTarget) {
        return;
      }
      var featured = COURSES.filter(function (course) {
        return seatsLeft(course) > 0;
      })
        .slice()
        .sort(function (a, b) {
          return b.rating - a.rating;
        })
        .slice(0, 4);
      renderCourses(featured, featuredTarget);
    }

    function renderDepartments() {
      if (!deptTarget) {
        return;
      }
      var groups = {};
      COURSES.forEach(function (course) {
        if (!groups[course.dept]) {
          groups[course.dept] = { name: course.dept, count: 0 };
        }
        groups[course.dept].count += 1;
      });
      deptTarget.innerHTML = Object.keys(groups)
        .sort()
        .map(function (name) {
          var colors = deptColors(name);
          return (
            '<a class="dept-tile" href="catalog.html?dept=' + encodeURIComponent(name) + '" style="--ca:' + colors[0] + ";--cb:" + colors[1] + ';">' +
              "<h3>" + esc(name) + "</h3>" +
              '<span class="dept-count">' + groups[name].count + " course" + (groups[name].count === 1 ? "" : "s") + "</span>" +
              ICONS.arrow +
            "</a>"
          );
        })
        .join("");
    }

    renderFeatured();
    renderDepartments();
    window.cfRefresh = function () {
      renderFeatured();
      renderDepartments();
    };
  }

  function initCatalog() {
    var grid = $("[data-course-grid]");
    if (!grid) {
      return;
    }

    var search = $("[data-search]");
    var deptFilter = $("[data-filter-dept]");
    var levelFilter = $("[data-filter-level]");
    var availFilter = $("[data-filter-availability]");
    var sortFilter = $("[data-sort]");
    var resultCount = $("[data-result-count]");
    var empty = $("[data-empty]");
    var clearButtons = $$("[data-clear-filters]");
    var params = new URLSearchParams(window.location.search);

    if (deptFilter) {
      var departments = COURSES.map(function (course) {
        return course.dept;
      })
        .filter(function (dept, index, list) {
          return list.indexOf(dept) === index;
        })
        .sort();

      deptFilter.innerHTML =
        '<option value="all">All departments</option>' +
        departments.map(function (dept) {
          return '<option value="' + esc(dept) + '">' + esc(dept) + "</option>";
        }).join("");
    }

    if (search && params.get("q")) {
      search.value = params.get("q");
    }

    if (deptFilter && params.get("dept")) {
      var requested = params.get("dept");
      var exists = $$("option", deptFilter).some(function (option) {
        return option.value === requested;
      });
      if (exists) {
        deptFilter.value = requested;
      }
    }

    function applyFilters() {
      var query = search ? search.value.trim().toLowerCase() : "";
      var dept = deptFilter ? deptFilter.value : "all";
      var level = levelFilter ? levelFilter.value : "all";
      var availability = availFilter ? availFilter.value : "all";
      var sort = sortFilter ? sortFilter.value : "featured";

      var list = COURSES.filter(function (course) {
        var haystack = (course.code + " " + course.title + " " + course.dept + " " + course.instructor + " " + course.description).toLowerCase();
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesDept = dept === "all" || course.dept === dept;
        var matchesLevel = level === "all" || String(course.level) === level;
        var matchesAvailability =
          availability === "all" ||
          (availability === "open" && seatsLeft(course) > 0) ||
          (availability === "full" && seatsLeft(course) === 0);
        return matchesQuery && matchesDept && matchesLevel && matchesAvailability;
      });

      if (sort === "rating") {
        list.sort(function (a, b) {
          return b.rating - a.rating;
        });
      } else if (sort === "credits-desc") {
        list.sort(function (a, b) {
          return b.credits - a.credits;
        });
      } else if (sort === "credits-asc") {
        list.sort(function (a, b) {
          return a.credits - b.credits;
        });
      } else if (sort === "title") {
        list.sort(function (a, b) {
          return a.title.localeCompare(b.title);
        });
      }

      grid.innerHTML = list.map(courseCard).join("");
      if (resultCount) {
        resultCount.textContent = "Showing " + list.length + " of " + COURSES.length + " courses";
      }
      if (empty) {
        empty.hidden = list.length > 0;
      }
    }

    [search, deptFilter, levelFilter, availFilter, sortFilter].forEach(function (control) {
      if (control) {
        control.addEventListener(control === search ? "input" : "change", applyFilters);
      }
    });

    clearButtons.forEach(function (clear) {
      clear.addEventListener("click", function () {
        if (search) {
          search.value = "";
        }
        if (deptFilter) {
          deptFilter.value = "all";
        }
        if (levelFilter) {
          levelFilter.value = "all";
        }
        if (availFilter) {
          availFilter.value = "all";
        }
        if (sortFilter) {
          sortFilter.value = "featured";
        }
        applyFilters();
        if (search) {
          search.focus();
        }
      });
    });

    applyFilters();
    window.cfRefresh = applyFilters;
  }

  function initRegister() {
    var form = $("[data-reg-form]");
    if (!form) {
      return;
    }

    var courseSelect = $("#courseSelect");
    var termSelect = $("#termSelect");
    var summary = $("[data-course-summary]");
    var errorBox = $("[data-form-error]");
    var table = $("[data-registration-table]");
    var modal = $("#confirmModal");

    function fillStudentFields() {
      var student = getStudent();
      ["firstName", "lastName", "email", "studentId", "program", "year"].forEach(function (name) {
        var field = form.elements.namedItem(name);
        if (field) {
          field.value = student[name] == null ? "" : student[name];
        }
      });
    }

    function populateCourses(preferred) {
      if (!courseSelect) {
        return;
      }
      var current = preferred == null ? courseSelect.value : preferred;
      var options = COURSES.map(function (course) {
        var left = seatsLeft(course);
        var taken = isRegistered(course.id);
        var disabled = left === 0 || taken;
        var suffix = taken ? " · Registered" : left === 0 ? " · Full" : " · " + left + " seats";
        return (
          '<option value="' + esc(course.id) + '"' + (disabled ? " disabled" : "") + ">" +
            esc(course.code) + " — " + esc(course.title) + " · " + esc(course.dept) + " · " + course.credits + " cr" + suffix +
          "</option>"
        );
      }).join("");

      courseSelect.innerHTML = '<option value="">Choose a course...</option>' + options;

      if (current && getCourse(current) && !isRegistered(current) && seatsLeft(getCourse(current)) > 0) {
        courseSelect.value = current;
      }
    }

    function updateSummary() {
      if (!summary) {
        return;
      }
      var course = getCourse(courseSelect ? courseSelect.value : "");
      if (!course) {
        summary.innerHTML =
          '<div class="summary-empty">' +
            '<div class="empty-icon">' + ICONS.cap + "</div>" +
            "<strong>No course selected</strong><br>Pick a course from the form to preview your schedule here." +
          "</div>";
        return;
      }

      var left = seatsLeft(course);
      var term = termSelect ? termSelect.value : TERMS[0];
      summary.innerHTML =
        '<div class="summary-card" style="' + courseVars(course) + '">' +
          '<div class="summary-head">' +
            '<span class="course-code">' + esc(course.code) + "</span>" +
            '<span class="course-rating">' + ICONS.star + " " + course.rating.toFixed(1) + "</span>" +
          "</div>" +
          '<div class="summary-body">' +
            "<h3>" + esc(course.title) + "</h3>" +
            '<p class="summary-dept">' + esc(course.dept) + " · " + course.level + " level</p>" +
            '<ul class="summary-list">' +
              "<li>" + ICONS.calendar + "<span>" + esc(course.days) + " · " + esc(course.time) + "</span></li>" +
              "<li>" + ICONS.user + "<span>" + esc(course.instructor) + "</span></li>" +
              "<li>" + ICONS.pin + "<span>" + esc(course.room) + "</span></li>" +
              "<li>" + ICONS.book + "<span>" + course.credits + " credits · " + esc(term) + "</span></li>" +
            "</ul>" +
            '<div class="summary-seats">' +
              "<span>" + (left === 0 ? "Course full" : left + " seats available") + "</span>" +
              '<span class="' + (left <= 5 ? "warn" : "ok") + '">' + (left === 0 ? "Waitlist" : "Open") + "</span>" +
            "</div>" +
          "</div>" +
        "</div>";
    }

    fillStudentFields();
    populateCourses(null);

    var preselect = new URLSearchParams(window.location.search).get("course");
    if (preselect && getCourse(preselect) && !isRegistered(preselect) && seatsLeft(getCourse(preselect)) > 0) {
      courseSelect.value = preselect;
    }

    renderRegistrationTable(table);
    updateSummary();

    if (courseSelect) {
      courseSelect.addEventListener("change", updateSummary);
    }
    if (termSelect) {
      termSelect.addEventListener("change", updateSummary);
    }

    if (errorBox) {
      form.addEventListener("input", function () {
        errorBox.textContent = "";
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (errorBox) {
        errorBox.textContent = "";
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var courseId = courseSelect ? courseSelect.value : "";
      var course = getCourse(courseId);

      if (!course) {
        if (errorBox) {
          errorBox.textContent = "Please choose a course to continue.";
        }
        if (courseSelect) {
          courseSelect.focus();
        }
        return;
      }

      if (isRegistered(courseId)) {
        if (errorBox) {
          errorBox.textContent = "You are already registered for this course.";
        }
        return;
      }

      if (seatsLeft(course) === 0) {
        if (errorBox) {
          errorBox.textContent = "This course is full. Please choose another course.";
        }
        return;
      }

      var data = new FormData(form);
      var term = String(data.get("term") || TERMS[0]);
      var notes = String(data.get("notes") || "").trim();
      var student = {
        firstName: String(data.get("firstName") || "").trim(),
        lastName: String(data.get("lastName") || "").trim(),
        email: String(data.get("email") || "").trim(),
        studentId: String(data.get("studentId") || "").trim(),
        program: String(data.get("program") || "").trim(),
        year: String(data.get("year") || "").trim()
      };

      var result = addRegistration(courseId, term, notes);
      if (!result.ok) {
        if (errorBox) {
          errorBox.textContent = result.reason === "duplicate"
            ? "You are already registered for this course."
            : "That course could not be added. Please try another one.";
        }
        return;
      }

      saveStudent(student);
      form.reset();
      fillStudentFields();
      if (courseSelect) {
        courseSelect.value = "";
      }
      refreshViews();
      if (modal) {
        var colors = deptColors(course.dept);
        var card = $("[data-modal-card]", modal);
        if (card) {
          card.style.setProperty("--ca", colors[0]);
          card.style.setProperty("--cb", colors[1]);
        }
        $$("[data-modal-code]", modal).forEach(function (el) {
          el.textContent = course.code;
        });
        $$("[data-modal-course]", modal).forEach(function (el) {
          el.textContent = course.title;
        });
        $$("[data-modal-schedule]", modal).forEach(function (el) {
          el.textContent = course.days + " · " + course.time;
        });
        $$("[data-modal-instructor]", modal).forEach(function (el) {
          el.textContent = course.instructor;
        });
        $$("[data-modal-credits]", modal).forEach(function (el) {
          el.textContent = course.credits + " credits";
        });
        $$("[data-modal-term]", modal).forEach(function (el) {
          el.textContent = term;
        });
        openModal(modal);
      }

      toast("Registration confirmed for " + course.code + ".");
    });

    window.cfRefresh = function () {
      populateCourses(courseSelect ? courseSelect.value : "");
      updateSummary();
    };
  }

  function initProfile() {
    var page = $("[data-profile-page]");
    if (!page) {
      return;
    }

    var editPanel = $("[data-edit-panel]");
    var editForm = $("[data-profile-form]");
    var editButton = $("[data-edit-profile]");
    var cancelButton = $("[data-cancel-edit]");
    var table = $("[data-registration-table]");

    function setText(selector, value) {
      $$(selector).forEach(function (el) {
        el.textContent = value;
      });
    }

    function fillProfileForm() {
      if (!editForm) {
        return;
      }
      var student = getStudent();
      ["firstName", "lastName", "email", "studentId", "program", "year", "gpa"].forEach(function (name) {
        var field = editForm.elements.namedItem(name);
        if (field) {
          field.value = student[name] == null ? "" : student[name];
        }
      });
    }

    function renderProfile() {
      var student = getStudent();
      var registrations = getRegistrations();
      var courses = registrations.map(function (reg) {
        return getCourse(reg.courseId);
      }).filter(Boolean);
      var credits = courses.reduce(function (sum, course) {
        return sum + course.credits;
      }, 0);
      var departments = courses.map(function (course) {
        return course.dept;
      }).filter(function (dept, index, list) {
        return list.indexOf(dept) === index;
      });
      var progress = Math.min(100, Math.round((credits / 120) * 100));
      var gpa = Number(student.gpa);

      setText("[data-profile-name]", studentName(student));
      setText("[data-profile-sub]", student.program + " · " + yearLabel(student.year));
      setText("[data-profile-id]", student.studentId || "Student ID not set");
      setText("[data-profile-email]", student.email || "Email not set");
      setText("[data-profile-avatar]", initials(student));
      setText("[data-profile-gpa]", Number.isFinite(gpa) ? gpa.toFixed(1) : "—");

      setText("[data-stat-courses]", String(registrations.length));
      setText("[data-stat-courses-label]", registrations.length === 1 ? "course registered" : "courses registered");
      setText("[data-stat-credits]", String(credits));
      setText("[data-stat-depts]", String(departments.length));
      setText("[data-stat-progress]", progress + "%");
      setText("[data-progress-credits]", String(credits));
      setText("[data-progress-label]", progress + "% complete");

      var bar = $("[data-progress-bar]");
      if (bar) {
        bar.style.width = progress + "%";
      }

      var track = $("[data-progress-track]");
      if (track) {
        track.setAttribute("aria-valuenow", String(progress));
      }

      var chips = $("[data-dept-chips]");
      if (chips) {
        if (!departments.length) {
          chips.innerHTML = '<span class="empty-note">No courses yet — your departments will appear here.</span>';
        } else {
          chips.innerHTML = departments.map(function (dept) {
            var colors = deptColors(dept);
            return '<span class="dept-chip"><i style="--ca:' + colors[0] + ";--cb:" + colors[1] + ';"></i>' + esc(dept) + "</span>";
          }).join("");
        }
      }
    }

    renderRegistrationTable(table);
    renderProfile();

    if (editButton && editPanel) {
      editButton.addEventListener("click", function () {
        editPanel.hidden = !editPanel.hidden;
        if (!editPanel.hidden) {
          fillProfileForm();
          var firstInput = $("input", editPanel);
          if (firstInput) {
            firstInput.focus();
          }
        }
      });
    }

    if (cancelButton && editPanel) {
      cancelButton.addEventListener("click", function () {
        editPanel.hidden = true;
        if (editButton) {
          editButton.focus();
        }
      });
    }

    if (editForm) {
      editForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!editForm.checkValidity()) {
          editForm.reportValidity();
          return;
        }
        var data = new FormData(editForm);
        saveStudent({
          firstName: String(data.get("firstName") || "").trim(),
          lastName: String(data.get("lastName") || "").trim(),
          email: String(data.get("email") || "").trim(),
          studentId: String(data.get("studentId") || "").trim(),
          program: String(data.get("program") || "").trim(),
          year: String(data.get("year") || "").trim(),
          gpa: String(data.get("gpa") || "").trim()
        });
        if (editPanel) {
          editPanel.hidden = true;
        }
        renderProfile();
        toast("Profile updated.");
      });
    }

    window.cfRefresh = renderProfile;
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-remove-course]");
    if (!button) {
      return;
    }
    var courseId = button.getAttribute("data-remove-course");
    var course = getCourse(courseId);
    removeRegistration(courseId);
    refreshViews();
    toast(course ? course.code + " removed from your schedule." : "Course removed from your schedule.");
  });

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      var open = $(".modal.open");
      if (open) {
        closeModal(open);
      }
      refreshViews();
    }
  });

  initNav();
  initModals();
  initHome();
  initCatalog();
  initRegister();
  initProfile();
})();
