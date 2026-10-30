(function () {
  "use strict";

  var COURSES = [
    {
      id: "cs201",
      code: "CS 201",
      title: "Data Structures & Algorithms",
      department: "Computer Science",
      level: 200,
      credits: 4,
      instructor: "Dr. Maya Chen",
      days: "Mon & Wed",
      time: "10:00–11:15",
      format: "In person",
      seats: 8,
      capacity: 40,
      theme: "violet",
      description: "Build the problem-solving toolkit behind modern software, from linked lists and trees to efficient sorting and graph search.",
      tags: ["coding", "logic", "computer science", "algorithms"]
    },
    {
      id: "cs310",
      code: "CS 310",
      title: "Human-Computer Interaction",
      department: "Computer Science",
      level: 300,
      credits: 3,
      instructor: "Prof. Jonah Reed",
      days: "Tue & Thu",
      time: "13:00–14:15",
      format: "Hybrid",
      seats: 15,
      capacity: 35,
      theme: "blue",
      description: "Design digital products people can actually use. Prototype, test, and critique interfaces with a focus on real human needs.",
      tags: ["design", "technology", "interfaces", "usability"]
    },
    {
      id: "cs420",
      code: "CS 420",
      title: "AI Ethics & Society",
      department: "Computer Science",
      level: 400,
      credits: 3,
      instructor: "Dr. Maya Chen",
      days: "Wed",
      time: "15:00–17:45",
      format: "Hybrid",
      seats: 11,
      capacity: 25,
      theme: "indigo",
      description: "Untangle the social, political, and human questions raised by artificial intelligence through cases and lively debate.",
      tags: ["ethics", "artificial intelligence", "society", "technology"]
    },
    {
      id: "des120",
      code: "DES 120",
      title: "Design Foundations",
      department: "Design",
      level: 100,
      credits: 3,
      instructor: "Prof. Lena Ortiz",
      days: "Mon & Wed",
      time: "14:30–15:45",
      format: "In person",
      seats: 6,
      capacity: 30,
      theme: "coral",
      description: "Learn to see like a designer. Explore composition, color, type, and visual problem-solving through hands-on studio projects.",
      tags: ["design", "studio", "creative", "visual"]
    },
    {
      id: "des240",
      code: "DES 240",
      title: "Typography in Motion",
      department: "Design",
      level: 200,
      credits: 4,
      instructor: "Prof. Aria Bell",
      days: "Tue & Thu",
      time: "09:30–10:45",
      format: "In person",
      seats: 4,
      capacity: 24,
      theme: "pink",
      description: "Make words move. Experiment with kinetic type, rhythm, and storytelling for screens, title sequences, and interactive media.",
      tags: ["design", "typography", "motion", "creative"]
    },
    {
      id: "env101",
      code: "ENV 101",
      title: "Climate & Society",
      department: "Environmental Science",
      level: 100,
      credits: 3,
      instructor: "Dr. Sam Okafor",
      days: "Tue & Thu",
      time: "11:00–12:15",
      format: "Online",
      seats: 22,
      capacity: 60,
      theme: "teal",
      description: "Understand the science, policy, and human stories behind climate change, and what communities are doing about it now.",
      tags: ["climate", "environment", "society", "science"]
    },
    {
      id: "env330",
      code: "ENV 330",
      title: "Urban Ecology",
      department: "Environmental Science",
      level: 300,
      credits: 4,
      instructor: "Dr. Priya Nair",
      days: "Wed",
      time: "09:00–11:45",
      format: "Hybrid",
      seats: 3,
      capacity: 20,
      theme: "emerald",
      description: "Study the living systems inside cities, from street trees and stormwater to the surprising wildlife sharing our blocks.",
      tags: ["environment", "cities", "ecology", "fieldwork"]
    },
    {
      id: "env210",
      code: "ENV 210",
      title: "Food Systems & Justice",
      department: "Environmental Science",
      level: 200,
      credits: 3,
      instructor: "Dr. Sam Okafor",
      days: "Mon & Wed",
      time: "13:00–14:15",
      format: "In person",
      seats: 8,
      capacity: 32,
      theme: "lime",
      description: "Follow food from farm to table and examine the inequities, innovations, and choices that shape what we eat.",
      tags: ["food", "justice", "environment", "community"]
    },
    {
      id: "bus150",
      code: "BUS 150",
      title: "Foundations of Entrepreneurship",
      department: "Business",
      level: 100,
      credits: 3,
      instructor: "Prof. Daniel Kim",
      days: "Mon & Wed",
      time: "08:30–09:45",
      format: "In person",
      seats: 10,
      capacity: 45,
      theme: "amber",
      description: "Turn a promising idea into a real experiment. Learn customer discovery, pitching, and the habits of resourceful founders.",
      tags: ["business", "startup", "entrepreneurship", "pitch"]
    },
    {
      id: "bus275",
      code: "BUS 275",
      title: "Marketing for Good",
      department: "Business",
      level: 200,
      credits: 3,
      instructor: "Prof. Nia Williams",
      days: "Tue & Thu",
      time: "15:30–16:45",
      format: "Hybrid",
      seats: 17,
      capacity: 40,
      theme: "orange",
      description: "Use marketing to move people and communities in positive directions, with real clients and a focus on ethical persuasion.",
      tags: ["business", "marketing", "social impact", "strategy"]
    },
    {
      id: "psy110",
      code: "PSY 110",
      title: "Introduction to Psychology",
      department: "Psychology",
      level: 100,
      credits: 3,
      instructor: "Dr. Ellis Grant",
      days: "Mon, Wed & Fri",
      time: "10:00–10:50",
      format: "In person",
      seats: 30,
      capacity: 90,
      theme: "rose",
      description: "Explore how people think, feel, remember, and connect through a tour of the field's most compelling questions and findings.",
      tags: ["psychology", "behavior", "mind", "research"]
    },
    {
      id: "psy305",
      code: "PSY 305",
      title: "Cognitive Neuroscience",
      department: "Psychology",
      level: 300,
      credits: 4,
      instructor: "Dr. Hana Ito",
      days: "Tue",
      time: "14:00–16:45",
      format: "In person",
      seats: 5,
      capacity: 18,
      theme: "purple",
      description: "Connect brain activity to attention, memory, and decision-making using classic studies and contemporary imaging research.",
      tags: ["psychology", "neuroscience", "brain", "cognition"]
    },
    {
      id: "mat221",
      code: "MAT 221",
      title: "Linear Algebra",
      department: "Mathematics",
      level: 200,
      credits: 4,
      instructor: "Dr. Luis Romero",
      days: "Mon, Wed & Fri",
      time: "09:00–09:50",
      format: "In person",
      seats: 12,
      capacity: 35,
      theme: "cyan",
      description: "Discover the elegant language of vectors, matrices, and transformations that powers graphics, data science, and more.",
      tags: ["mathematics", "vectors", "data", "logic"]
    },
    {
      id: "mat340",
      code: "MAT 340",
      title: "Probability & Statistics",
      department: "Mathematics",
      level: 300,
      credits: 3,
      instructor: "Dr. Amara Singh",
      days: "Tue & Thu",
      time: "10:00–11:15",
      format: "Online",
      seats: 9,
      capacity: 50,
      theme: "sky",
      description: "Make sense of uncertainty and variation. Build the statistical reasoning behind research, forecasting, and good decisions.",
      tags: ["mathematics", "statistics", "probability", "data"]
    },
    {
      id: "fil140",
      code: "FIL 140",
      title: "Storytelling Through Film",
      department: "Film & Media",
      level: 100,
      credits: 3,
      instructor: "Prof. Jordan Lee",
      days: "Tue",
      time: "18:00–20:45",
      format: "In person",
      seats: 7,
      capacity: 28,
      theme: "coral",
      description: "Watch, discuss, and analyze films from around the world while learning how image, sound, and editing create meaning.",
      tags: ["film", "storytelling", "media", "creative"]
    },
    {
      id: "fil260",
      code: "FIL 260",
      title: "Documentary Practice",
      department: "Film & Media",
      level: 200,
      credits: 4,
      instructor: "Prof. Casey Bloom",
      days: "Thu",
      time: "13:00–16:45",
      format: "In person",
      seats: 2,
      capacity: 16,
      theme: "fuchsia",
      description: "Tell true stories with care. Plan, shoot, and edit a short documentary while grappling with ethics and point of view.",
      tags: ["film", "documentary", "production", "storytelling"]
    }
  ];

  var SEMESTERS = ["Spring 2027", "Summer 2027", "Fall 2027"];
  var STORAGE_KEYS = {
    profile: "campusCourseHub.profile.v1",
    registrations: "campusCourseHub.registrations.v1"
  };
  var DEFAULT_PROFILE = {
    name: "Alex Morgan",
    email: "alex.morgan@university.edu",
    studentId: "20481736",
    program: "B.A. Interaction Design",
    year: "2nd year",
    advisor: "Dr. Maya Chen"
  };
  var DEFAULT_REGISTRATIONS = [
    {
      courseId: "des120",
      semester: "Spring 2027",
      registeredAt: "2026-10-16T14:20:00.000Z"
    },
    {
      courseId: "env101",
      semester: "Spring 2027",
      registeredAt: "2026-10-18T09:05:00.000Z"
    }
  ];

  var courseMap = new Map(COURSES.map(function (course) {
    return [course.id, course];
  }));
  var pageParams = new URLSearchParams(window.location.search);
  var profile = loadProfile();
  var registrations = loadRegistrations();
  var toastTimer = null;

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function readJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (raw === null) {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadProfile() {
    var stored = readJSON(STORAGE_KEYS.profile, null);
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
      writeJSON(STORAGE_KEYS.profile, DEFAULT_PROFILE);
      return Object.assign({}, DEFAULT_PROFILE);
    }

    var merged = Object.assign({}, DEFAULT_PROFILE, stored);
    Object.keys(DEFAULT_PROFILE).forEach(function (key) {
      if (typeof merged[key] !== "string") {
        merged[key] = DEFAULT_PROFILE[key];
      }
    });
    return merged;
  }

  function loadRegistrations() {
    var stored = readJSON(STORAGE_KEYS.registrations, null);
    if (!Array.isArray(stored)) {
      var defaults = DEFAULT_REGISTRATIONS.map(function (registration) {
        return Object.assign({}, registration);
      });
      writeJSON(STORAGE_KEYS.registrations, defaults);
      return defaults;
    }

    var seen = new Set();
    return stored.filter(function (registration) {
      if (!registration || typeof registration.courseId !== "string") {
        return false;
      }
      if (!courseMap.has(registration.courseId) || SEMESTERS.indexOf(registration.semester) === -1) {
        return false;
      }
      var key = registration.courseId + "::" + registration.semester;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    }).map(function (registration) {
      return {
        courseId: registration.courseId,
        semester: registration.semester,
        registeredAt: registration.registeredAt || new Date().toISOString()
      };
    });
  }

  function persistRegistrations() {
    writeJSON(STORAGE_KEYS.registrations, registrations);
  }

  function persistProfile() {
    writeJSON(STORAGE_KEYS.profile, profile);
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.textContent = value;
    });
  }

  function pluralize(count, singular, plural) {
    return count + " " + (count === 1 ? singular : plural);
  }

  function getInitials(name) {
    var parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return "ST";
    }
    return parts.slice(0, 2).map(function (part) {
      return part.charAt(0).toUpperCase();
    }).join("");
  }

  function isRegistered(courseId, semester) {
    return registrations.some(function (registration) {
      return registration.courseId === courseId && (!semester || registration.semester === semester);
    });
  }

  function getSeatState(course) {
    if (course.seats === 0) {
      return {
        className: "seat-status--full",
        label: "Waitlist only"
      };
    }
    if (course.seats <= 5) {
      return {
        className: "seat-status--low",
        label: pluralize(course.seats, "seat", "seats") + " left"
      };
    }
    return {
      className: "",
      label: pluralize(course.seats, "seat", "seats") + " left"
    };
  }

  function courseCard(course) {
    var seatState = getSeatState(course);
    var registered = isRegistered(course.id);
    var action = registered
      ? '<a class="btn btn-small btn-soft" href="profile.html" aria-label="' +
        escapeHTML(course.code + " " + course.title) +
        ' is registered. View your schedule">View schedule</a>'
      : '<a class="btn btn-small btn-primary" href="registration.html?course=' +
        encodeURIComponent(course.id) +
        '" aria-label="Register for ' +
        escapeHTML(course.code + " " + course.title) +
        '">Register</a>';

    return '<li>' +
      '<article class="course-card theme-' + escapeHTML(course.theme) + '" aria-labelledby="course-' + escapeHTML(course.id) + '-title">' +
        '<div class="course-card__header">' +
          '<span class="course-code">' + escapeHTML(course.code) + '</span>' +
          '<span class="format-badge">' + escapeHTML(course.format) + '</span>' +
        '</div>' +
        '<p class="course-dept">' + escapeHTML(course.department) + '</p>' +
        '<h3 id="course-' + escapeHTML(course.id) + '-title">' + escapeHTML(course.title) + '</h3>' +
        '<p class="course-desc">' + escapeHTML(course.description) + '</p>' +
        '<dl class="course-facts">' +
          '<div><dt>Schedule</dt><dd>' + escapeHTML(course.days) + ' · ' + escapeHTML(course.time) + '</dd></div>' +
          '<div><dt>Credits</dt><dd>' + escapeHTML(course.credits) + '</dd></div>' +
          '<div><dt>Instructor</dt><dd>' + escapeHTML(course.instructor) + '</dd></div>' +
        '</dl>' +
        '<div class="course-card__footer">' +
          '<span class="seat-status ' + seatState.className + '">' + escapeHTML(seatState.label) + '</span>' +
          action +
        '</div>' +
      '</article>' +
    '</li>';
  }

  function renderFeaturedCourses() {
    var list = document.getElementById("featured-courses");
    if (!list) {
      return;
    }

    var featuredIds = ["des240", "cs310", "env210", "fil140"];
    list.innerHTML = featuredIds.map(function (courseId) {
      return courseMap.has(courseId) ? courseCard(courseMap.get(courseId)) : "";
    }).join("");
  }

  function mediaMatches(query) {
    return typeof window.matchMedia === "function" ? window.matchMedia(query).matches : false;
  }

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) {
      return;
    }

    function setOpen(open, restoreFocus) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      var label = toggle.querySelector(".nav-toggle-label");
      if (label) {
        label.textContent = open ? "Close" : "Menu";
      }
      if (!open && restoreFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true", false);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && mediaMatches("(max-width: 860px)")) {
        setOpen(false, false);
      }
    });

    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") !== "true") {
        return;
      }
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false, false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false, true);
      }
    });

    if (typeof window.matchMedia === "function") {
      var desktopQuery = window.matchMedia("(min-width: 861px)");
      var handleDesktopChange = function (event) {
        if (event.matches) {
          setOpen(false, false);
        }
      };

      if (typeof desktopQuery.addEventListener === "function") {
        desktopQuery.addEventListener("change", handleDesktopChange);
      } else if (typeof desktopQuery.addListener === "function") {
        desktopQuery.addListener(handleDesktopChange);
      }
    }
  }

  function populateCatalogFilters() {
    var departmentSelect = document.getElementById("department-filter");
    var formatSelect = document.getElementById("format-filter");
    if (!departmentSelect || !formatSelect) {
      return;
    }

    var departments = Array.from(new Set(COURSES.map(function (course) {
      return course.department;
    }))).sort(function (a, b) {
      return a.localeCompare(b);
    });

    var formats = Array.from(new Set(COURSES.map(function (course) {
      return course.format;
    }))).sort(function (a, b) {
      return a.localeCompare(b);
    });

    departmentSelect.innerHTML = '<option value="all">All departments</option>' +
      departments.map(function (department) {
        return '<option value="' + escapeHTML(department) + '">' + escapeHTML(department) + '</option>';
      }).join("");

    formatSelect.innerHTML = '<option value="all">All formats</option>' +
      formats.map(function (format) {
        return '<option value="' + escapeHTML(format) + '">' + escapeHTML(format) + '</option>';
      }).join("");
  }

  function initCatalog() {
    var list = document.getElementById("course-list");
    if (!list) {
      return;
    }

    populateCatalogFilters();

    var form = document.getElementById("catalog-filters");
    var searchInput = document.getElementById("catalog-search");
    var departmentSelect = document.getElementById("department-filter");
    var levelSelect = document.getElementById("level-filter");
    var formatSelect = document.getElementById("format-filter");
    var sortSelect = document.getElementById("sort-filter");
    var resetButton = document.getElementById("reset-filters");
    var emptyResetButton = document.getElementById("empty-reset");
    var emptyState = document.getElementById("empty-state");
    var resultsCount = document.getElementById("results-count");

    var state = {
      q: (pageParams.get("q") || "").slice(0, 100),
      department: departmentSelect ? (pageParams.get("department") || "all") : "all",
      level: levelSelect ? (pageParams.get("level") || "all") : "all",
      format: formatSelect ? (pageParams.get("format") || "all") : "all",
      sort: sortSelect ? (pageParams.get("sort") || "featured") : "featured"
    };

    if (searchInput) {
      searchInput.value = state.q;
    }
    function hasOption(select, value) {
      return Boolean(select) && Array.from(select.options).some(function (option) {
        return option.value === value;
      });
    }

    if (hasOption(departmentSelect, state.department)) {
      departmentSelect.value = state.department;
    } else {
      state.department = "all";
    }
    if (hasOption(levelSelect, state.level)) {
      levelSelect.value = state.level;
    } else {
      state.level = "all";
    }
    if (hasOption(formatSelect, state.format)) {
      formatSelect.value = state.format;
    } else {
      state.format = "all";
    }
    if (hasOption(sortSelect, state.sort)) {
      sortSelect.value = state.sort;
    } else {
      state.sort = "featured";
    }

    function hasFilters() {
      return Boolean(state.q.trim()) || state.department !== "all" || state.level !== "all" || state.format !== "all";
    }

    function updateURL() {
      var nextParams = new URLSearchParams();
      if (state.q.trim()) {
        nextParams.set("q", state.q.trim());
      }
      if (state.department !== "all") {
        nextParams.set("department", state.department);
      }
      if (state.level !== "all") {
        nextParams.set("level", state.level);
      }
      if (state.format !== "all") {
        nextParams.set("format", state.format);
      }
      if (state.sort !== "featured") {
        nextParams.set("sort", state.sort);
      }

      var query = nextParams.toString();
      var nextURL = window.location.pathname + (query ? "?" + query : "");
      try {
        window.history.replaceState(null, "", nextURL);
      } catch (error) {
        return;
      }
    }

    function renderCatalog() {
      var terms = state.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var filtered = COURSES.filter(function (course) {
        var haystack = [
          course.code,
          course.title,
          course.department,
          course.instructor,
          course.description,
          course.tags.join(" ")
        ].join(" ").toLowerCase();

        var matchesSearch = terms.every(function (term) {
          return haystack.indexOf(term) !== -1;
        });
        var matchesDepartment = state.department === "all" || course.department === state.department;
        var matchesLevel = state.level === "all" || String(course.level) === state.level;
        var matchesFormat = state.format === "all" || course.format === state.format;

        return matchesSearch && matchesDepartment && matchesLevel && matchesFormat;
      });

      filtered.sort(function (a, b) {
        if (state.sort === "code") {
          return a.code.localeCompare(b.code, undefined, { numeric: true });
        }
        if (state.sort === "seats") {
          return b.seats - a.seats || a.code.localeCompare(b.code);
        }
        if (state.sort === "credits") {
          return a.credits - b.credits || a.code.localeCompare(b.code);
        }
        return COURSES.indexOf(a) - COURSES.indexOf(b);
      });

      if (filtered.length === 0) {
        list.innerHTML = "";
        list.hidden = true;
      } else {
        list.hidden = false;
        list.innerHTML = filtered.map(courseCard).join("");
      }

      if (emptyState) {
        emptyState.hidden = filtered.length !== 0;
      }

      if (resultsCount) {
        if (filtered.length === 0) {
          resultsCount.textContent = "No courses match your filters";
        } else if (hasFilters()) {
          resultsCount.textContent = "Showing " + filtered.length + " of " + COURSES.length + " courses";
        } else {
          resultsCount.textContent = "Showing all " + COURSES.length + " courses";
        }
      }

      updateURL();
    }

    function resetFilters() {
      state.q = "";
      state.department = "all";
      state.level = "all";
      state.format = "all";
      state.sort = "featured";

      if (searchInput) {
        searchInput.value = "";
      }
      if (departmentSelect) {
        departmentSelect.value = "all";
      }
      if (levelSelect) {
        levelSelect.value = "all";
      }
      if (formatSelect) {
        formatSelect.value = "all";
      }
      if (sortSelect) {
        sortSelect.value = "featured";
      }

      renderCatalog();
      if (searchInput) {
        searchInput.focus();
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.q = searchInput.value;
        renderCatalog();
      });
    }

    if (departmentSelect) {
      departmentSelect.addEventListener("change", function () {
        state.department = departmentSelect.value;
        renderCatalog();
      });
    }

    if (levelSelect) {
      levelSelect.addEventListener("change", function () {
        state.level = levelSelect.value;
        renderCatalog();
      });
    }

    if (formatSelect) {
      formatSelect.addEventListener("change", function () {
        state.format = formatSelect.value;
        renderCatalog();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        renderCatalog();
      });
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        renderCatalog();
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", resetFilters);
    }
    if (emptyResetButton) {
      emptyResetButton.addEventListener("click", resetFilters);
    }

    renderCatalog();
  }

  function populateCourseSelect(select) {
    var departments = Array.from(new Set(COURSES.map(function (course) {
      return course.department;
    }))).sort(function (a, b) {
      return a.localeCompare(b);
    });

    var markup = '<option value="">Select a course to register</option>';
    departments.forEach(function (department) {
      markup += '<optgroup label="' + escapeHTML(department) + '">';
      COURSES.filter(function (course) {
        return course.department === department;
      }).sort(function (a, b) {
        return a.code.localeCompare(b.code, undefined, { numeric: true });
      }).forEach(function (course) {
        markup += '<option value="' + escapeHTML(course.id) + '">' +
          escapeHTML(course.code) + " — " + escapeHTML(course.title) +
          " (" + escapeHTML(course.credits) + " cr)</option>";
      });
      markup += "</optgroup>";
    });

    select.innerHTML = markup;

    var requestedCourse = pageParams.get("course");
    if (requestedCourse && courseMap.has(requestedCourse)) {
      select.value = requestedCourse;
    }
  }

  function updateCourseSummary() {
    var container = document.getElementById("course-summary");
    var select = document.getElementById("course-select");
    var semesterSelect = document.getElementById("semester");
    if (!container || !select) {
      return;
    }

    var course = courseMap.get(select.value);
    var semester = semesterSelect ? semesterSelect.value : "";

    if (!course) {
      container.className = "course-summary course-summary--empty";
      container.innerHTML = "<p>Pick a course from the form to see the schedule, instructor, and credit details here.</p>";
      return;
    }

    var duplicate = semester && isRegistered(course.id, semester);
    container.className = "course-summary theme-" + course.theme;
    container.innerHTML =
      '<div class="summary-course-top">' +
        '<span class="course-code">' + escapeHTML(course.code) + '</span>' +
        '<span class="format-badge">' + escapeHTML(course.format) + '</span>' +
      '</div>' +
      '<h3 class="summary-title">' + escapeHTML(course.title) + '</h3>' +
      '<p class="summary-code-line">' + escapeHTML(course.department) + ' · ' + escapeHTML(course.credits) + ' credits</p>' +
      '<dl class="summary-facts">' +
        '<div><dt>Instructor</dt><dd>' + escapeHTML(course.instructor) + '</dd></div>' +
        '<div><dt>Schedule</dt><dd>' + escapeHTML(course.days) + ' · ' + escapeHTML(course.time) + '</dd></div>' +
        '<div><dt>Seats</dt><dd>' + escapeHTML(course.seats) + ' of ' + escapeHTML(course.capacity) + ' available</dd></div>' +
      '</dl>' +
      (duplicate
        ? '<p class="summary-warning">This course is already on your schedule for ' + escapeHTML(semester) + '. <a href="profile.html">View schedule</a></p>'
        : "");

  }

  function registrationFieldMap() {
    return {
      fullName: "fullName",
      email: "email",
      studentId: "studentId",
      semester: "semester",
      courseId: "course-select"
    };
  }

  function setRegistrationError(name, message, form) {
    var inputId = registrationFieldMap()[name];
    var input = inputId ? document.getElementById(inputId) : null;
    var error = document.getElementById(name + "-error");
    if (input) {
      input.setAttribute("aria-invalid", "true");
    }
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
  }

  function clearRegistrationErrors(form, summary) {
    form.querySelectorAll(".field-error").forEach(function (error) {
      error.hidden = true;
      error.textContent = "";
    });
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (input) {
      input.removeAttribute("aria-invalid");
    });
    if (summary) {
      summary.hidden = true;
    }
  }

  function validateRegistration(data) {
    var errors = {};

    if (data.fullName.length < 2) {
      errors.fullName = "Enter your full name using at least two characters.";
    } else if (data.fullName.length > 80) {
      errors.fullName = "Keep your full name under 80 characters.";
    }

    if (!data.email) {
      errors.email = "Enter your university email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      errors.email = "Enter a valid email address, such as name@university.edu.";
    }

    if (!/^[A-Za-z0-9-]{6,12}$/.test(data.studentId)) {
      errors.studentId = "Use 6–12 letters, numbers, or hyphens for your student ID.";
    }

    if (SEMESTERS.indexOf(data.semester) === -1) {
      errors.semester = "Choose a semester.";
    }

    if (!courseMap.has(data.courseId)) {
      errors.courseId = "Choose a course to register for.";
    } else {
      var course = courseMap.get(data.courseId);
      if (data.semester && isRegistered(course.id, data.semester)) {
        errors.courseId = "You are already registered for " + course.code + " in " + data.semester + ".";
      }
    }

    return errors;
  }

  function openConfirmation(data, course) {
    var backdrop = document.getElementById("confirmation-modal");
    if (!backdrop) {
      return;
    }

    var dialog = backdrop.querySelector(".modal");
    var message = document.getElementById("confirmation-message");

    setText("#confirmation-student", data.fullName);
    setText("#confirmation-course", course.code + " — " + course.title);
    setText("#confirmation-term", data.semester);
    setText("#confirmation-schedule", course.days + " · " + course.time);

    if (message) {
      message.textContent = "Your spot in " + course.code + " is saved for " + data.semester + ". Here is a quick look at what you registered for.";
    }

    backdrop.dataset.returnFocus = "true";
    backdrop.hidden = false;
    document.body.classList.add("modal-open");
    if (dialog) {
      window.setTimeout(function () {
        dialog.focus();
      }, 0);
    }
  }

  function closeConfirmation(restoreFocus) {
    var backdrop = document.getElementById("confirmation-modal");
    if (!backdrop || backdrop.hidden) {
      return;
    }

    backdrop.hidden = true;
    document.body.classList.remove("modal-open");
    var shouldRestore = restoreFocus !== false;
    if (shouldRestore) {
      var active = document.activeElement;
      if (active && typeof active.blur === "function" && backdrop.contains(active)) {
        active.blur();
      }
      var submitButton = document.querySelector('#registration-form button[type="submit"]');
      if (submitButton) {
        submitButton.focus();
      }
    }
  }

  function initRegistration() {
    var form = document.getElementById("registration-form");
    if (!form) {
      return;
    }

    var select = document.getElementById("course-select");
    var semesterSelect = document.getElementById("semester");
    var summary = document.getElementById("registration-errors");
    var summaryList = document.getElementById("registration-errors-list");

    populateCourseSelect(select);

    var fullNameInput = document.getElementById("fullName");
    var emailInput = document.getElementById("email");
    var studentIdInput = document.getElementById("studentId");

    if (fullNameInput) {
      fullNameInput.value = profile.name;
    }
    if (emailInput) {
      emailInput.value = profile.email;
    }
    if (studentIdInput) {
      studentIdInput.value = profile.studentId;
    }

    if (select) {
      select.addEventListener("change", updateCourseSummary);
    }
    if (semesterSelect) {
      semesterSelect.addEventListener("change", updateCourseSummary);
    }

    updateCourseSummary();

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var data = {
        fullName: fullNameInput ? fullNameInput.value.trim() : "",
        email: emailInput ? emailInput.value.trim() : "",
        studentId: studentIdInput ? studentIdInput.value.trim() : "",
        semester: semesterSelect ? semesterSelect.value : "",
        courseId: select ? select.value : ""
      };

      clearRegistrationErrors(form, summary);
      var errors = validateRegistration(data);
      var errorNames = Object.keys(errors);

      if (errorNames.length) {
        errorNames.forEach(function (name) {
          setRegistrationError(name, errors[name], form);
        });

        if (summary && summaryList) {
          summaryList.innerHTML = errorNames.map(function (name) {
            var inputId = registrationFieldMap()[name];
            return '<li><a href="#' + escapeHTML(inputId) + '">' + escapeHTML(errors[name]) + "</a></li>";
          }).join("");
          summary.hidden = false;
          summary.focus();
        }
        return;
      }

      var course = courseMap.get(data.courseId);
      registrations.push({
        courseId: course.id,
        semester: data.semester,
        registeredAt: new Date().toISOString()
      });
      persistRegistrations();
      refreshRegistrationViews();
      openConfirmation(data, course);

      if (select) {
        select.value = "";
      }
      updateCourseSummary();
    });

    var backdrop = document.getElementById("confirmation-modal");
    var closeButton = document.getElementById("modal-close");
    var registerAnother = document.getElementById("register-another");

    if (backdrop) {
      backdrop.addEventListener("click", function (event) {
        if (event.target === backdrop) {
          closeConfirmation(true);
        }
      });

      document.addEventListener("keydown", function (event) {
        if (backdrop.hidden) {
          return;
        }

        if (event.key === "Escape") {
          event.preventDefault();
          closeConfirmation(true);
          return;
        }

        if (event.key !== "Tab") {
          return;
        }

        var dialog = backdrop.querySelector(".modal");
        if (!dialog) {
          return;
        }

        var focusable = Array.from(dialog.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(function (element) {
          return element.getClientRects().length > 0;
        });

        if (!focusable.length) {
          event.preventDefault();
          dialog.focus();
          return;
        }

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        closeConfirmation(true);
      });
    }

    if (registerAnother) {
      registerAnother.addEventListener("click", function () {
        closeConfirmation(false);
        if (select) {
          select.focus();
        }
      });
    }
  }

  function sortedRegistrations() {
    return registrations.slice().sort(function (a, b) {
      var termDifference = SEMESTERS.indexOf(a.semester) - SEMESTERS.indexOf(b.semester);
      if (termDifference !== 0) {
        return termDifference;
      }
      var courseA = courseMap.get(a.courseId);
      var courseB = courseMap.get(b.courseId);
      if (!courseA || !courseB) {
        return 0;
      }
      return courseA.code.localeCompare(courseB.code, undefined, { numeric: true });
    });
  }

  function renderRegistrationTable() {
    var tbody = document.getElementById("registered-courses-body");
    if (!tbody) {
      return;
    }

    var sorted = sortedRegistrations();

    if (!sorted.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="table-empty">' +
          "<strong>Your schedule is wide open.</strong>" +
          'No courses yet. <a href="catalog.html">Find your first course</a>.' +
        "</td></tr>";
      return;
    }

    tbody.innerHTML = sorted.map(function (registration) {
      var course = courseMap.get(registration.courseId);
      if (!course) {
        return "";
      }

      return "<tr>" +
        '<td><span class="course-cell-title">' + escapeHTML(course.title) + '</span>' +
          '<span class="course-cell-meta">' + escapeHTML(course.instructor) + "</span></td>" +
        "<td>" + escapeHTML(course.code) + "</td>" +
        "<td>" + escapeHTML(course.credits) + "</td>" +
        "<td>" + escapeHTML(course.days) + " · " + escapeHTML(course.time) + "</td>" +
        "<td>" + escapeHTML(registration.semester) + "</td>" +
        '<td><button class="btn btn-small btn-danger-ghost" type="button" ' +
          'data-drop-course="' + escapeHTML(course.id) + '" ' +
          'data-drop-semester="' + escapeHTML(registration.semester) + '" ' +
          'aria-label="Drop ' + escapeHTML(course.code + " " + course.title) + " from " + escapeHTML(registration.semester) + '">Drop</button></td>' +
      "</tr>";
    }).join("");
  }

  function renderProfileStats() {
    var credits = registrations.reduce(function (total, registration) {
      var course = courseMap.get(registration.courseId);
      return total + (course ? course.credits : 0);
    }, 0);

    var departments = new Set(registrations.map(function (registration) {
      var course = courseMap.get(registration.courseId);
      return course ? course.department : "";
    }).filter(Boolean));

    var terms = Array.from(new Set(registrations.map(function (registration) {
      return registration.semester;
    }))).sort(function (a, b) {
      return SEMESTERS.indexOf(a) - SEMESTERS.indexOf(b);
    });

    setText("[data-registration-count]", pluralize(registrations.length, "course", "courses"));
    setText("[data-registration-credits]", pluralize(credits, "credit", "credits"));
    setText("[data-stat-courses]", String(registrations.length));
    setText("[data-stat-credits]", String(credits));
    setText("[data-stat-departments]", String(departments.size));
    setText("[data-stat-term]", terms.length ? terms[0] : "Not set");
  }

  function refreshRegistrationViews() {
    renderRegistrationTable();
    renderProfileStats();
    updateCourseSummary();
  }

  function showToast(message, undoHandler) {
    var toast = document.getElementById("app-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.setAttribute("aria-atomic", "true");
      toast.hidden = true;
      toast.innerHTML = '<span class="toast-message"></span><button class="toast-undo" type="button" hidden>Undo</button>';
      document.body.appendChild(toast);
    }

    var messageElement = toast.querySelector(".toast-message");
    var undoButton = toast.querySelector(".toast-undo");

    if (messageElement) {
      messageElement.textContent = message;
    }

    if (undoButton) {
      undoButton.hidden = typeof undoHandler !== "function";
      undoButton.onclick = null;
      if (typeof undoHandler === "function") {
        undoButton.onclick = function () {
          toast.hidden = true;
          window.clearTimeout(toastTimer);
          undoHandler();
        };
      }
    }

    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.hidden = true;
    }, 8000);
  }

  function dropRegistration(courseId, semester) {
    var index = registrations.findIndex(function (registration) {
      return registration.courseId === courseId && registration.semester === semester;
    });
    if (index === -1) {
      return;
    }

    var course = courseMap.get(courseId);
    var removed = registrations.splice(index, 1)[0];
    persistRegistrations();
    refreshRegistrationViews();

    var heading = document.querySelector("[data-registration-heading]");
    if (heading) {
      heading.focus();
    }

    showToast(
      (course ? course.code : "Course") + " was dropped from " + semester + ".",
      function () {
        registrations.splice(Math.min(index, registrations.length), 0, removed);
        persistRegistrations();
        refreshRegistrationViews();
        showToast((course ? course.code : "Course") + " was added back to your schedule.");
      }
    );
  }

  function initDropActions() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-drop-course]");
      if (!button) {
        return;
      }
      dropRegistration(button.getAttribute("data-drop-course"), button.getAttribute("data-drop-semester"));
    });
  }

  function renderProfilePage() {
    var displayName = document.getElementById("profile-display-name");
    if (!displayName) {
      return;
    }

    var firstName = profile.name.trim().split(/\s+/)[0] || "there";

    setText("#profile-hero-name", firstName);
    setText("#profile-display-name", profile.name);
    setText("#profile-display-program", profile.program + " · " + profile.year);
    setText("#profile-detail-name", profile.name);
    setText("#profile-detail-email", profile.email);
    setText("#profile-detail-id", profile.studentId);
    setText("#profile-detail-program", profile.program);
    setText("#profile-detail-year", profile.year);
    setText("#profile-detail-advisor", profile.advisor || "Not assigned yet");

    var avatar = document.getElementById("profile-avatar");
    if (avatar) {
      avatar.textContent = getInitials(profile.name);
    }
  }

  function clearProfileErrors(form, summary) {
    form.querySelectorAll(".field-error").forEach(function (error) {
      error.hidden = true;
      error.textContent = "";
    });
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (input) {
      input.removeAttribute("aria-invalid");
    });
    if (summary) {
      summary.hidden = true;
    }
  }

  function setProfileError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (input) {
      input.setAttribute("aria-invalid", "true");
    }
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
  }

  function initProfile() {
    var editButton = document.getElementById("edit-profile-btn");
    var form = document.getElementById("profile-edit-form");
    if (!editButton || !form) {
      renderProfilePage();
      return;
    }

    var view = document.getElementById("profile-view");
    var cancelButton = document.getElementById("cancel-profile-btn");
    var summary = document.getElementById("profile-errors");
    var summaryList = document.getElementById("profile-errors-list");
    var status = document.getElementById("profile-status");

    var nameInput = document.getElementById("profile-name-input");
    var emailInput = document.getElementById("profile-email-input");
    var idInput = document.getElementById("profile-id-input");
    var programInput = document.getElementById("profile-program-input");
    var yearInput = document.getElementById("profile-year-input");
    var advisorInput = document.getElementById("profile-advisor-input");

    renderProfilePage();

    function fillForm() {
      nameInput.value = profile.name;
      emailInput.value = profile.email;
      idInput.value = profile.studentId;
      programInput.value = profile.program;
      yearInput.value = profile.year;
      advisorInput.value = profile.advisor;
    }

    function closeEditor(restoreFocus) {
      form.hidden = true;
      view.hidden = false;
      editButton.hidden = false;
      editButton.setAttribute("aria-expanded", "false");
      if (restoreFocus !== false) {
        editButton.focus();
      }
    }

    editButton.addEventListener("click", function () {
      fillForm();
      clearProfileErrors(form, summary);
      view.hidden = true;
      form.hidden = false;
      editButton.hidden = true;
      editButton.setAttribute("aria-expanded", "true");
      nameInput.focus();
    });

    if (cancelButton) {
      cancelButton.addEventListener("click", function () {
        closeEditor(true);
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var values = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        studentId: idInput.value.trim(),
        program: programInput.value.trim(),
        year: yearInput.value,
        advisor: advisorInput.value.trim()
      };

      clearProfileErrors(form, summary);
      var errors = {};

      if (values.name.length < 2) {
        errors.name = "Enter your full name using at least two characters.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
        errors.email = "Enter a valid university email address.";
      }
      if (!/^[A-Za-z0-9-]{6,12}$/.test(values.studentId)) {
        errors.studentId = "Use 6–12 letters, numbers, or hyphens for your student ID.";
      }
      if (values.program.length < 2) {
        errors.program = "Enter the name of your program.";
      }
      if (!values.year) {
        errors.year = "Choose your current year.";
      }

      var errorNames = Object.keys(errors);

      if (errorNames.length) {
        var fieldIds = {
          name: ["profile-name-input", "profile-name-error"],
          email: ["profile-email-input", "profile-email-error"],
          studentId: ["profile-id-input", "profile-id-error"],
          program: ["profile-program-input", "profile-program-error"],
          year: ["profile-year-input", "profile-year-error"]
        };

        errorNames.forEach(function (name) {
          setProfileError(fieldIds[name][0], fieldIds[name][1], errors[name]);
        });

        if (summary && summaryList) {
          summaryList.innerHTML = errorNames.map(function (name) {
            return '<li><a href="#' + fieldIds[name][0] + '">' + escapeHTML(errors[name]) + "</a></li>";
          }).join("");
          summary.hidden = false;
          summary.focus();
        }
        return;
      }

      profile = {
        name: values.name,
        email: values.email,
        studentId: values.studentId,
        program: values.program,
        year: values.year,
        advisor: values.advisor
      };
      persistProfile();
      renderProfilePage();
      closeEditor(true);
      if (status) {
        status.textContent = "Your profile was updated.";
      }
      showToast("Profile updated. Your registration form will use these details.");
    });
  }

  function initCommon() {
    setText("[data-year]", String(new Date().getFullYear()));
    setText("[data-course-count]", String(COURSES.length));
    setText("[data-department-count]", String(new Set(COURSES.map(function (course) {
      return course.department;
    })).size));

    initNavigation();
    initDropActions();
  }

  initCommon();
  renderFeaturedCourses();
  initCatalog();
  initRegistration();
  initProfile();
  renderRegistrationTable();
  renderProfileStats();
})();
