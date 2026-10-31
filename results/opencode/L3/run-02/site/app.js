"use strict";

const COURSES = [
  {
    id: "CSE216",
    code: "CSE 216",
    title: "Software Engineering",
    dept: "CSE",
    deptName: "Computer Science",
    level: 200,
    credits: 4,
    instructor: "Dr. Maya Chen",
    schedule: "Tue & Thu, 10:00-11:30",
    seats: 12,
    capacity: 30,
    description: "Design and build maintainable software in teams, from requirements and testing to delivery."
  },
  {
    id: "CSE320",
    code: "CSE 320",
    title: "Human-Computer Interaction",
    dept: "CSE",
    deptName: "Computer Science",
    level: 300,
    credits: 3,
    instructor: "Prof. Ana Ruiz",
    schedule: "Mon & Wed, 13:00-14:15",
    seats: 8,
    capacity: 24,
    description: "Explore usability, accessible design and evaluation methods for interactive products."
  },
  {
    id: "CSE412",
    code: "CSE 412",
    title: "Machine Learning Foundations",
    dept: "CSE",
    deptName: "Computer Science",
    level: 400,
    credits: 4,
    instructor: "Dr. Omar Haddad",
    schedule: "Tue & Thu, 14:00-15:30",
    seats: 0,
    capacity: 20,
    description: "Learn core machine learning models, evaluation techniques and responsible practice."
  },
  {
    id: "MAT210",
    code: "MAT 210",
    title: "Linear Algebra",
    dept: "MAT",
    deptName: "Mathematics",
    level: 200,
    credits: 3,
    instructor: "Dr. Priya Nair",
    schedule: "Mon, Wed & Fri, 09:00-09:50",
    seats: 18,
    capacity: 40,
    description: "Vectors, matrices, linear transformations and eigenvalues with applications in science."
  },
  {
    id: "MAT331",
    code: "MAT 331",
    title: "Probability and Statistics",
    dept: "MAT",
    deptName: "Mathematics",
    level: 300,
    credits: 3,
    instructor: "Dr. Leo Martins",
    schedule: "Tue & Thu, 08:00-09:15",
    seats: 5,
    capacity: 32,
    description: "Build a strong foundation in probability, statistical inference and data analysis."
  },
  {
    id: "PHY150",
    code: "PHY 150",
    title: "Astronomy of the Solar System",
    dept: "PHY",
    deptName: "Physics",
    level: 100,
    credits: 3,
    instructor: "Dr. Sofia Ivanova",
    schedule: "Mon & Wed, 15:00-16:15",
    seats: 22,
    capacity: 50,
    description: "A tour of planets, moons and small bodies, with evening observation sessions when weather allows."
  },
  {
    id: "PHY305",
    code: "PHY 305",
    title: "Quantum Mechanics",
    dept: "PHY",
    deptName: "Physics",
    level: 300,
    credits: 4,
    instructor: "Dr. Ben Okafor",
    schedule: "Tue & Thu, 11:00-12:30",
    seats: 3,
    capacity: 18,
    description: "Wave functions, uncertainty and quantum systems, supported by problem-solving workshops."
  },
  {
    id: "BIO110",
    code: "BIO 110",
    title: "Foundations of Biology",
    dept: "BIO",
    deptName: "Biology",
    level: 100,
    credits: 4,
    instructor: "Dr. Grace Kim",
    schedule: "Mon, Wed & Fri, 10:00-10:50",
    seats: 30,
    capacity: 60,
    description: "Cells, genetics, evolution and ecosystems with a weekly laboratory component."
  },
  {
    id: "BIO240",
    code: "BIO 240",
    title: "Ecology and Conservation",
    dept: "BIO",
    deptName: "Biology",
    level: 200,
    credits: 3,
    instructor: "Dr. Elena Rossi",
    schedule: "Tue & Thu, 13:00-14:15",
    seats: 16,
    capacity: 28,
    description: "Study populations, communities and conservation strategies through local field projects."
  },
  {
    id: "ART101",
    code: "ART 101",
    title: "Art History: Renaissance to Modern",
    dept: "ART",
    deptName: "Art and Design",
    level: 100,
    credits: 3,
    instructor: "Prof. Daniel Weiss",
    schedule: "Wed, 17:00-19:30",
    seats: 25,
    capacity: 45,
    description: "Trace major movements in art and architecture from the Renaissance to the twentieth century."
  },
  {
    id: "ART260",
    code: "ART 260",
    title: "Digital Illustration",
    dept: "ART",
    deptName: "Art and Design",
    level: 200,
    credits: 3,
    instructor: "Prof. Nia Brooks",
    schedule: "Fri, 13:00-15:30",
    seats: 9,
    capacity: 20,
    description: "Develop visual storytelling and digital drawing skills in a studio-style workshop."
  },
  {
    id: "ENG215",
    code: "ENG 215",
    title: "Creative Writing Workshop",
    dept: "ENG",
    deptName: "English",
    level: 200,
    credits: 3,
    instructor: "Dr. Samuel Adeyemi",
    schedule: "Mon, 15:00-17:30",
    seats: 14,
    capacity: 18,
    description: "Write and revise fiction, poetry and creative nonfiction in a supportive peer workshop."
  },
  {
    id: "ENG340",
    code: "ENG 340",
    title: "Modern Literature",
    dept: "ENG",
    deptName: "English",
    level: 300,
    credits: 3,
    instructor: "Dr. Hana Suzuki",
    schedule: "Tue & Thu, 09:30-10:45",
    seats: 7,
    capacity: 25,
    description: "Read twentieth and twenty-first century literature through close analysis and discussion."
  },
  {
    id: "HIS120",
    code: "HIS 120",
    title: "World History since 1500",
    dept: "HIS",
    deptName: "History",
    level: 100,
    credits: 3,
    instructor: "Dr. Lucas Meyer",
    schedule: "Mon & Wed, 11:00-12:15",
    seats: 35,
    capacity: 55,
    description: "Examine global connections, empires and social change across five centuries."
  },
  {
    id: "HIS310",
    code: "HIS 310",
    title: "Revolutions and Social Change",
    dept: "HIS",
    deptName: "History",
    level: 300,
    credits: 3,
    instructor: "Dr. Amara Diallo",
    schedule: "Thu, 14:00-16:30",
    seats: 0,
    capacity: 22,
    description: "Compare revolutionary movements and the people who shaped political and social change."
  },
  {
    id: "BUS201",
    code: "BUS 201",
    title: "Principles of Marketing",
    dept: "BUS",
    deptName: "Business",
    level: 200,
    credits: 3,
    instructor: "Prof. Ravi Patel",
    schedule: "Tue & Fri, 10:00-11:15",
    seats: 20,
    capacity: 35,
    description: "Understand customers, markets and brand strategy through practical case studies."
  }
];

const DEPARTMENTS = [
  { code: "CSE", name: "Computer Science" },
  { code: "MAT", name: "Mathematics" },
  { code: "PHY", name: "Physics" },
  { code: "BIO", name: "Biology" },
  { code: "ART", name: "Art and Design" },
  { code: "ENG", name: "English" },
  { code: "HIS", name: "History" },
  { code: "BUS", name: "Business" }
];

const PROGRAMS = [
  "BSc Computer Science",
  "BSc Mathematics",
  "BSc Physics",
  "BSc Biology",
  "BA English Literature",
  "BA History",
  "BFA Art and Design",
  "BBA Business Administration"
];

const TERMS = ["Fall 2026", "Spring 2027"];

const PROFILE = {
  name: "Jordan Ellis",
  studentId: "20261457",
  email: "jordan.ellis@northgate.edu",
  program: "BSc Computer Science",
  year: "Year 2",
  advisor: "Dr. Maya Chen",
  contact: "Email"
};

const DEFAULT_REGISTRATIONS = [
  { courseId: "CSE216", term: "Fall 2026" },
  { courseId: "MAT210", term: "Fall 2026" },
  { courseId: "ART101", term: "Fall 2026" }
];

const STORAGE_KEY = "northgate-registrations-v1";

const ROUTES = {
  "#/home": {
    title: "Home | Northgate University Course Registration",
    render: renderHome
  },
  "#/catalog": {
    title: "Course catalog | Northgate University Course Registration",
    render: renderCatalog
  },
  "#/register": {
    title: "Registration | Northgate University Course Registration",
    render: renderRegistration
  },
  "#/profile": {
    title: "Student profile | Northgate University Course Registration",
    render: renderProfile
  }
};

const catalogState = {
  query: "",
  dept: "all",
  level: "all",
  availability: "all"
};

let registrations = loadRegistrations();
let registrationDraft = null;
let flashMessage = "";
let preselectCourseId = "";

const main = document.getElementById("main-content");
const appStatus = document.getElementById("app-status");
const skipLink = document.querySelector(".skip-link");
const menuToggle = document.getElementById("menu-toggle");
const primaryNav = document.getElementById("primary-nav");
const confirmDialog = document.getElementById("confirm-dialog");
const dialogTitle = document.getElementById("dialog-title");
const dialogDescription = document.getElementById("dialog-description");
const dialogCancel = document.getElementById("dialog-cancel");
const dialogConfirm = document.getElementById("dialog-confirm");

let pendingDialogAction = null;
let statusTimer = null;

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

function loadRegistrations() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_REGISTRATIONS.map(function (item) {
        return { courseId: item.courseId, term: item.term };
      });
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return DEFAULT_REGISTRATIONS.map(function (item) {
        return { courseId: item.courseId, term: item.term };
      });
    }

    return parsed.filter(function (item) {
      return (
        item &&
        typeof item.courseId === "string" &&
        typeof item.term === "string" &&
        COURSES.some(function (course) {
          return course.id === item.courseId;
        }) &&
        TERMS.indexOf(item.term) !== -1
      );
    });
  } catch (error) {
    return DEFAULT_REGISTRATIONS.map(function (item) {
      return { courseId: item.courseId, term: item.term };
    });
  }
}

function saveRegistrations() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  } catch (error) {
    /* Storage can be unavailable; the in-memory schedule still works. */
  }
}

function getCourse(courseId) {
  return COURSES.find(function (course) {
    return course.id === courseId;
  });
}

function isRegistered(courseId) {
  return registrations.some(function (item) {
    return item.courseId === courseId;
  });
}

function getStudentInfo() {
  return {
    name: registrationDraft ? registrationDraft.fullName : PROFILE.name,
    studentId: registrationDraft ? registrationDraft.studentId : PROFILE.studentId,
    email: registrationDraft ? registrationDraft.email : PROFILE.email,
    program: registrationDraft ? registrationDraft.program : PROFILE.program,
    contact: registrationDraft ? registrationDraft.contact : PROFILE.contact
  };
}

function breakableEmail(email) {
  const atIndex = email.indexOf("@");
  if (atIndex === -1) {
    return escapeHTML(email);
  }
  return escapeHTML(email.slice(0, atIndex + 1)) + "<wbr>" + escapeHTML(email.slice(atIndex + 1));
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(function (part) {
      return part.charAt(0).toUpperCase();
    })
    .join("");
}

function currentHash() {
  return ROUTES[window.location.hash] ? window.location.hash : "#/home";
}

function updateNavigation(hash) {
  document.querySelectorAll(".nav-list a[data-route]").forEach(function (link) {
    if (link.dataset.route === hash) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function focusViewHeading() {
  window.requestAnimationFrame(function () {
    const heading = document.querySelector("#main-content h1");
    if (heading) {
      heading.focus();
    }
  });
}

function renderRoute(options) {
  const settings = options || {};
  const hash = currentHash();

  if (window.location.hash !== hash) {
    window.history.replaceState(null, "", hash);
  }

  updateNavigation(hash);
  document.title = ROUTES[hash].title;
  ROUTES[hash].render();

  if (settings.focus) {
    focusViewHeading();
  }
}

function consumeFlash() {
  const message = flashMessage;
  flashMessage = "";
  return message;
}

function announce(message) {
  if (!appStatus) {
    return;
  }
  window.clearTimeout(statusTimer);
  appStatus.textContent = "";
  statusTimer = window.setTimeout(function () {
    appStatus.textContent = message;
  }, 60);
}

function flashHTML(message) {
  if (!message) {
    return "";
  }
  return '<div class="flash">' + escapeHTML(message) + "</div>";
}

function optionList(items, selectedValue) {
  return items
    .map(function (item) {
      const selected = item === selectedValue ? " selected" : "";
      return '<option value="' + escapeHTML(item) + '"' + selected + ">" + escapeHTML(item) + "</option>";
    })
    .join("");
}

function deptOptions(selectedValue) {
  const options = ['<option value="all"' + (selectedValue === "all" ? " selected" : "") + ">All departments</option>"];
  DEPARTMENTS.forEach(function (department) {
    const selected = department.code === selectedValue ? " selected" : "";
    options.push(
      '<option value="' +
        escapeHTML(department.code) +
        '"' +
        selected +
        ">" +
        escapeHTML(department.code + " - " + department.name) +
        "</option>"
    );
  });
  return options.join("");
}

function levelOptions(selectedValue) {
  const levels = ["100", "200", "300", "400"];
  const options = ['<option value="all"' + (selectedValue === "all" ? " selected" : "") + ">All levels</option>"];
  levels.forEach(function (level) {
    const selected = level === String(selectedValue) ? " selected" : "";
    options.push('<option value="' + level + '"' + selected + ">Level " + level + "</option>");
  });
  return options.join("");
}

function availabilityOptions(selectedValue) {
  return [
    '<option value="all"' + (selectedValue === "all" ? " selected" : "") + ">All courses</option>",
    '<option value="open"' + (selectedValue === "open" ? " selected" : "") + ">Open courses</option>",
    '<option value="full"' + (selectedValue === "full" ? " selected" : "") + ">Full courses</option>"
  ].join("");
}

function courseOptionsHTML(selectedId) {
  const available = COURSES.filter(function (course) {
    return !isRegistered(course.id);
  });
  const open = available.filter(function (course) {
    return course.seats > 0;
  });
  const full = available.filter(function (course) {
    return course.seats <= 0;
  });

  let options = ['<option value="">Select a course</option>'];

  if (open.length === 0) {
    options = ['<option value="">No open courses available</option>'];
  }

  open.forEach(function (course) {
    const selected = course.id === selectedId ? " selected" : "";
    options.push(
      '<option value="' +
        escapeHTML(course.id) +
        '"' +
        selected +
        ">" +
        escapeHTML(course.code + " - " + course.title + " (" + course.credits + " credits)") +
        "</option>"
    );
  });

  full.forEach(function (course) {
    options.push(
      '<option value="' +
        escapeHTML(course.id) +
        '" disabled>' +
        escapeHTML(course.code + " - " + course.title + " (Full)") +
        "</option>"
    );
  });

  return options.join("");
}

function courseCardHTML(course) {
  const registered = isRegistered(course.id);
  const full = course.seats <= 0;
  let action = "";

  if (registered) {
    action =
      '<button class="btn btn-secondary" type="button" disabled aria-label="Registered for ' +
      escapeHTML(course.code) +
      '">Registered</button>';
  } else if (full) {
    action =
      '<button class="btn btn-secondary" type="button" disabled aria-label="Full: ' +
      escapeHTML(course.code) +
      '">Full</button>';
  } else {
    action =
      '<button class="btn btn-primary" type="button" data-action="register-course" data-course-id="' +
      escapeHTML(course.id) +
      '" aria-label="Register for ' +
      escapeHTML(course.code) +
      '">Register</button>';
  }

  const availabilityBadge = full
    ? '<span class="badge badge-full">Full &middot; 0 of ' + course.capacity + " seats</span>"
    : '<span class="badge badge-open">' +
      course.seats +
      " of " +
      course.capacity +
      " seats open</span>";

  const registeredBadge = registered ? '<span class="badge badge-registered">Registered</span>' : "";

  return (
    '<li><article class="course-card dept-' +
    course.dept.toLowerCase() +
    '" aria-labelledby="course-title-' +
    escapeHTML(course.id) +
    '">' +
    '<div class="badge-row">' +
    '<span class="badge">' +
    escapeHTML(course.deptName) +
    "</span>" +
    '<span class="badge">Level ' +
    course.level +
    "</span>" +
    availabilityBadge +
    registeredBadge +
    "</div>" +
    '<h3 id="course-title-' +
    escapeHTML(course.id) +
    '"><span class="course-code">' +
    escapeHTML(course.code) +
    "</span> " +
    escapeHTML(course.title) +
    "</h3>" +
    '<p class="course-description">' +
    escapeHTML(course.description) +
    "</p>" +
    '<dl class="course-meta">' +
    "<div><dt>Credits</dt><dd>" +
    course.credits +
    "</dd></div>" +
    "<div><dt>Level</dt><dd>" +
    course.level +
    "</dd></div>" +
    "<div><dt>Instructor</dt><dd>" +
    escapeHTML(course.instructor) +
    "</dd></div>" +
    "<div><dt>Schedule</dt><dd>" +
    escapeHTML(course.schedule) +
    "</dd></div>" +
    "</dl>" +
    '<div class="course-action">' +
    action +
    "</div>" +
    "</article></li>"
  );
}

function filteredCourses() {
  const query = catalogState.query.trim().toLowerCase();

  return COURSES.filter(function (course) {
    const searchable = [course.code, course.title, course.deptName, course.instructor].join(" ").toLowerCase();
    const matchesQuery = query === "" || searchable.indexOf(query) !== -1;
    const matchesDept = catalogState.dept === "all" || course.dept === catalogState.dept;
    const matchesLevel = catalogState.level === "all" || String(course.level) === catalogState.level;
    const matchesAvailability =
      catalogState.availability === "all" ||
      (catalogState.availability === "open" && course.seats > 0) ||
      (catalogState.availability === "full" && course.seats <= 0);

    return matchesQuery && matchesDept && matchesLevel && matchesAvailability;
  });
}

function updateCatalogResults() {
  const list = document.getElementById("course-list");
  const count = document.getElementById("catalog-count");

  if (!list || !count) {
    return;
  }

  const results = filteredCourses();
  const hasFilters =
    catalogState.query.trim() !== "" ||
    catalogState.dept !== "all" ||
    catalogState.level !== "all" ||
    catalogState.availability !== "all";

  if (hasFilters) {
    count.textContent =
      results.length + " course" + (results.length === 1 ? "" : "s") + " found with the current search and filters.";
  } else {
    count.textContent = "Showing all " + COURSES.length + " courses.";
  }

  announce(count.textContent);

  if (results.length === 0) {
    list.innerHTML =
      '<li class="empty-state"><p><strong>No courses match your search.</strong></p>' +
      "<p>Try a different course code, department or level, or clear the filters.</p></li>";
    return;
  }

  list.innerHTML = results.map(courseCardHTML).join("");
}

function renderHome() {
  const flash = consumeFlash();

  main.innerHTML =
    '<div class="page-shell">' +
    flashHTML(flash) +
    '<section class="hero" aria-labelledby="home-title">' +
    '<div class="hero-content">' +
    '<span class="eyebrow">Fall 2026 registration is open</span>' +
    '<h1 class="view-title" id="home-title" tabindex="-1">Plan your next semester with confidence</h1>' +
    '<p class="hero-lead">Explore more than a dozen courses across eight departments, compare schedules and build a registration that fits your goals.</p>' +
    '<div class="hero-actions">' +
    '<a class="btn btn-primary" href="#/catalog">Browse the course catalog</a>' +
    '<a class="btn btn-secondary" href="#/register">Start your registration</a>' +
    "</div>" +
    "</div>" +
    "</section>" +
    '<section class="section" aria-labelledby="home-features-heading">' +
    '<h2 id="home-features-heading">Everything you need in one place</h2>' +
    '<ul class="feature-grid">' +
    '<li><article class="feature-card feature-purple">' +
    '<span class="feature-icon" aria-hidden="true">01</span>' +
    "<h3>Search with clarity</h3>" +
    "<p>Filter by department, level and availability to find the right class in seconds.</p>" +
    "</article></li>" +
    '<li><article class="feature-card feature-pink">' +
    '<span class="feature-icon" aria-hidden="true">02</span>' +
    "<h3>Register with confidence</h3>" +
    "<p>Review every detail in a confirmation dialog before your registration is saved.</p>" +
    "</article></li>" +
    '<li><article class="feature-card feature-teal">' +
    '<span class="feature-icon" aria-hidden="true">03</span>' +
    "<h3>Manage your schedule</h3>" +
    "<p>See your registered courses, credits and meeting times in one accessible table.</p>" +
    "</article></li>" +
    "</ul>" +
    "</section>" +
    '<section class="section" aria-labelledby="home-deadlines-heading">' +
    '<h2 id="home-deadlines-heading">Important dates</h2>' +
    '<div class="deadline-panel">' +
    '<article class="deadline-card">' +
    '<p class="date">August 24, 2026</p>' +
    "<h3>Fall classes begin</h3>" +
    "<p>Check your schedule and room assignments before the first day of teaching.</p>" +
    "</article>" +
    '<article class="deadline-card">' +
    '<p class="date">September 4, 2026</p>' +
    "<h3>Add and drop deadline</h3>" +
    "<p>The last day to add a course or drop one without a record on your transcript.</p>" +
    "</article>" +
    '<article class="deadline-card">' +
    '<p class="date">December 11, 2026</p>' +
    "<h3>Final examinations begin</h3>" +
    "<p>Review the examination timetable and confirm any accessibility arrangements.</p>" +
    "</article>" +
    "</div>" +
    "</section>" +
    "</div>";
}

function renderCatalog() {
  const flash = consumeFlash();

  main.innerHTML =
    '<div class="page-shell">' +
    flashHTML(flash) +
    '<h1 class="view-title" tabindex="-1">Course catalog</h1>' +
    '<p class="view-intro">Search the Fall 2026 catalog by course code, title, department or instructor. Use the filters to narrow the list, then register for an open course.</p>' +
    '<form class="toolbar" id="catalog-search-form" role="search" aria-label="Search and filter courses">' +
    '<div class="toolbar-grid">' +
    '<div class="field field-wide">' +
    '<label for="course-search">Search courses</label>' +
    '<input type="search" id="course-search" name="query" value="' +
    escapeHTML(catalogState.query) +
    '" placeholder="Course code, title or instructor" aria-describedby="course-search-hint">' +
    '<p class="field-hint" id="course-search-hint">For example, enter CSE, biology or Dr. Chen.</p>' +
    "</div>" +
    '<div class="field">' +
    '<label for="dept-filter">Department</label>' +
    '<select id="dept-filter" name="department">' +
    deptOptions(catalogState.dept) +
    "</select>" +
    "</div>" +
    '<div class="field">' +
    '<label for="level-filter">Course level</label>' +
    '<select id="level-filter" name="level">' +
    levelOptions(catalogState.level) +
    "</select>" +
    "</div>" +
    '<div class="field">' +
    '<label for="availability-filter">Availability</label>' +
    '<select id="availability-filter" name="availability">' +
    availabilityOptions(catalogState.availability) +
    "</select>" +
    "</div>" +
    '<div class="toolbar-actions">' +
    '<button class="btn btn-secondary" type="button" data-action="reset-filters">Clear filters</button>' +
    "</div>" +
    "</div>" +
    "</form>" +
    '<section aria-labelledby="catalog-results-heading">' +
    '<h2 id="catalog-results-heading">Search results</h2>' +
    '<p class="results-count" id="catalog-count"></p>' +
    '<ul class="course-grid" id="course-list"></ul>' +
    "</section>" +
    "</div>";

  updateCatalogResults();
}

function registrationValues() {
  return {
    fullName: registrationDraft ? registrationDraft.fullName : PROFILE.name,
    studentId: registrationDraft ? registrationDraft.studentId : PROFILE.studentId,
    email: registrationDraft ? registrationDraft.email : PROFILE.email,
    program: registrationDraft ? registrationDraft.program : PROFILE.program,
    term: registrationDraft ? registrationDraft.term : TERMS[0],
    contact: registrationDraft ? registrationDraft.contact : PROFILE.contact
  };
}

function renderRegistration() {
  const flash = consumeFlash();
  const values = registrationValues();
  const selectedCourse = preselectCourseId;
  preselectCourseId = "";

  main.innerHTML =
    '<div class="page-shell">' +
    flashHTML(flash) +
    '<h1 class="view-title" tabindex="-1">Course registration</h1>' +
    '<p class="view-intro">Register for a Fall 2026 or Spring 2027 course. Your saved student details are filled in for you, and you can review everything before confirming.</p>' +
    '<section aria-labelledby="registration-form-heading">' +
    '<h2 id="registration-form-heading">Registration form</h2>' +
    '<form class="form-card" id="registration-form" novalidate>' +
    '<div class="error-summary" id="reg-error-summary" role="alert" tabindex="-1" hidden>' +
    "<h3>There is a problem</h3>" +
    "<p>Fix the errors below and submit the form again.</p>" +
    "<ul></ul>" +
    "</div>" +
    '<div class="form-grid">' +
    '<div class="field field-full">' +
    '<label for="full-name">Full name <span class="required-text">(required)</span></label>' +
    '<input type="text" id="full-name" name="fullName" autocomplete="name" required value="' +
    escapeHTML(values.fullName) +
    '" aria-describedby="full-name-hint full-name-error">' +
    '<p class="field-hint" id="full-name-hint">Use the name on your university record.</p>' +
    '<p class="error-message" id="full-name-error" hidden></p>' +
    "</div>" +
    '<div class="field">' +
    '<label for="student-id">Student ID <span class="required-text">(required)</span></label>' +
    '<input type="text" id="student-id" name="studentId" inputmode="numeric" pattern="[0-9]{8}" autocomplete="off" required value="' +
    escapeHTML(values.studentId) +
    '" aria-describedby="student-id-hint student-id-error">' +
    '<p class="field-hint" id="student-id-hint">Enter the 8-digit ID from your university card, for example 20261457.</p>' +
    '<p class="error-message" id="student-id-error" hidden></p>' +
    "</div>" +
    '<div class="field">' +
    '<label for="email">Email address <span class="required-text">(required)</span></label>' +
    '<input type="email" id="email" name="email" autocomplete="email" required value="' +
    escapeHTML(values.email) +
    '" aria-describedby="email-hint email-error">' +
    '<p class="field-hint" id="email-hint">We will send registration updates to this address.</p>' +
    '<p class="error-message" id="email-error" hidden></p>' +
    "</div>" +
    '<div class="field">' +
    '<label for="program">Academic program <span class="required-text">(required)</span></label>' +
    '<select id="program" name="program" required aria-describedby="program-error">' +
    '<option value="">Select a program</option>' +
    optionList(PROGRAMS, values.program) +
    "</select>" +
    '<p class="error-message" id="program-error" hidden></p>' +
    "</div>" +
    '<div class="field">' +
    '<label for="term">Term <span class="required-text">(required)</span></label>' +
    '<select id="term" name="term" required aria-describedby="term-hint term-error">' +
    optionList(TERMS, values.term) +
    "</select>" +
    '<p class="field-hint" id="term-hint">Choose the term you are registering for.</p>' +
    '<p class="error-message" id="term-error" hidden></p>' +
    "</div>" +
    '<div class="field field-full">' +
    '<label for="course">Course <span class="required-text">(required)</span></label>' +
    '<select id="course" name="course" required aria-describedby="course-hint course-error">' +
    courseOptionsHTML(selectedCourse) +
    "</select>" +
    '<p class="field-hint" id="course-hint">Full courses are listed but cannot be selected.</p>' +
    '<p class="error-message" id="course-error" hidden></p>' +
    "</div>" +
    '<fieldset class="field-full" aria-describedby="contact-hint">' +
    "<legend>Contact preference</legend>" +
    '<p class="field-hint" id="contact-hint">How should we contact you about this registration?</p>' +
    '<div class="radio-group">' +
    '<label class="choice"><input type="radio" name="contact" value="Email"' +
    (values.contact === "Email" ? " checked" : "") +
    "> Email</label>" +
    '<label class="choice"><input type="radio" name="contact" value="Text message"' +
    (values.contact === "Text message" ? " checked" : "") +
    "> Text message</label>" +
    '<label class="choice"><input type="radio" name="contact" value="Phone call"' +
    (values.contact === "Phone call" ? " checked" : "") +
    "> Phone call</label>" +
    "</div>" +
    "</fieldset>" +
    "</div>" +
    '<div class="form-actions">' +
    '<button class="btn btn-primary" type="submit">Review registration</button>' +
    '<p class="field-hint">You will review the details in a confirmation dialog before your registration is saved.</p>' +
    "</div>" +
    "</form>" +
    "</section>" +
    '<section class="section" aria-labelledby="registration-courses-heading">' +
    '<div class="section-heading">' +
    '<h2 id="registration-courses-heading">Your registered courses</h2>' +
    '<a href="#/profile">View student profile</a>' +
    "</div>" +
    registeredTableHTML("Registered courses and meeting times") +
    "</section>" +
    "</div>";
}

function registeredTableHTML(caption) {
  const rows = registrations
    .map(function (item) {
      const course = getCourse(item.courseId);
      if (!course) {
        return null;
      }
      return { course: course, term: item.term };
    })
    .filter(function (item) {
      return item !== null;
    });

  if (rows.length === 0) {
    return (
      '<div class="empty-state">' +
      "<p><strong>You have no registered courses.</strong></p>" +
      '<p>Browse the <a href="#/catalog">course catalog</a> to find your next class.</p>' +
      "</div>"
    );
  }

  const body = rows
    .map(function (item) {
      const course = item.course;
      return (
        "<tr>" +
        '<th scope="row"><span class="course-code">' +
        escapeHTML(course.code) +
        '</span><span class="course-cell-title">' +
        escapeHTML(course.title) +
        "</span></th>" +
        "<td>" +
        escapeHTML(item.term) +
        "</td>" +
        "<td>" +
        course.credits +
        "</td>" +
        "<td>" +
        escapeHTML(course.schedule) +
        "</td>" +
        "<td>" +
        escapeHTML(course.instructor) +
        "</td>" +
        '<td><button class="btn btn-danger btn-small" type="button" data-action="drop-course" data-course-id="' +
        escapeHTML(course.id) +
        '" aria-label="Drop ' +
        escapeHTML(course.code) +
        '">Drop</button></td>' +
        "</tr>"
      );
    })
    .join("");

  return (
    '<div class="table-scroll" tabindex="0" role="region" aria-label="' +
    escapeHTML(caption) +
    ' table. Scroll horizontally to see all columns.">' +
    "<table>" +
    "<caption>" +
    escapeHTML(caption) +
    "</caption>" +
    "<thead><tr>" +
    '<th scope="col">Course</th>' +
    '<th scope="col">Term</th>' +
    '<th scope="col">Credits</th>' +
    '<th scope="col">Schedule</th>' +
    '<th scope="col">Instructor</th>' +
    '<th scope="col">Action</th>' +
    "</tr></thead>" +
    "<tbody>" +
    body +
    "</tbody>" +
    "</table>" +
    "</div>"
  );
}

function renderProfile() {
  const flash = consumeFlash();
  const student = getStudentInfo();
  const initials = getInitials(student.name);

  main.innerHTML =
    '<div class="page-shell">' +
    flashHTML(flash) +
    '<h1 class="view-title" tabindex="-1">Student profile</h1>' +
    '<p class="view-intro">Review your student details and manage the courses in your current schedule.</p>' +
    '<div class="profile-banner">' +
    '<span class="avatar" aria-hidden="true">' +
    escapeHTML(initials) +
    "</span>" +
    "<div>" +
    "<h2>" +
    escapeHTML(student.name) +
    "</h2>" +
    "<p>" +
    escapeHTML(student.program) +
    " &middot; " +
    escapeHTML(PROFILE.year) +
    "</p>" +
    "</div>" +
    "</div>" +
    '<section class="section" aria-labelledby="profile-details-heading">' +
    '<h2 id="profile-details-heading">Student details</h2>' +
    '<dl class="profile-grid">' +
    '<div class="profile-item"><dt>Student ID</dt><dd>' +
    escapeHTML(student.studentId) +
    "</dd></div>" +
    '<div class="profile-item"><dt>Email</dt><dd>' +
    breakableEmail(student.email) +
    "</dd></div>" +
    '<div class="profile-item"><dt>Program</dt><dd>' +
    escapeHTML(student.program) +
    "</dd></div>" +
    '<div class="profile-item"><dt>Year</dt><dd>' +
    escapeHTML(PROFILE.year) +
    "</dd></div>" +
    '<div class="profile-item"><dt>Academic advisor</dt><dd>' +
    escapeHTML(PROFILE.advisor) +
    "</dd></div>" +
    '<div class="profile-item"><dt>Contact preference</dt><dd>' +
    escapeHTML(student.contact) +
    "</dd></div>" +
    "</dl>" +
    "</section>" +
    '<section class="section" aria-labelledby="profile-courses-heading">' +
    '<div class="section-heading">' +
    '<h2 id="profile-courses-heading">Registered courses</h2>' +
    '<a href="#/register">Register for another course</a>' +
    "</div>" +
    registeredTableHTML("Registered courses and meeting times") +
    "</section>" +
    "</div>";
}

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "-error");

  if (!field || !error) {
    return;
  }

  field.setAttribute("aria-invalid", "true");
  error.textContent = message;
  error.hidden = false;
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "-error");
  const summary = document.getElementById("reg-error-summary");

  if (field) {
    field.removeAttribute("aria-invalid");
  }

  if (error) {
    error.textContent = "";
    error.hidden = true;
  }

  if (summary) {
    const link = summary.querySelector('a[data-error-field="' + fieldId + '"]');
    if (link) {
      const item = link.closest("li");
      if (item) {
        item.remove();
      }
    }
    if (!summary.querySelector("li")) {
      summary.hidden = true;
    }
  }
}

function clearFormErrors() {
  const form = document.getElementById("registration-form");
  const summary = document.getElementById("reg-error-summary");

  if (form) {
    form.querySelectorAll("[aria-invalid]").forEach(function (field) {
      field.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".error-message").forEach(function (error) {
      error.textContent = "";
      error.hidden = true;
    });
  }

  if (summary) {
    const list = summary.querySelector("ul");
    if (list) {
      list.innerHTML = "";
    }
    summary.hidden = true;
  }
}

function showErrorSummary(errors) {
  const summary = document.getElementById("reg-error-summary");
  if (!summary) {
    return;
  }

  const list = summary.querySelector("ul");
  list.innerHTML = errors
    .map(function (error) {
      return (
        '<li><a href="#' +
        escapeHTML(error.field) +
        '" data-error-field="' +
        escapeHTML(error.field) +
        '">' +
        escapeHTML(error.message) +
        "</a></li>"
      );
    })
    .join("");

  summary.hidden = false;
  summary.focus();
}

function handleRegistrationSubmit(form) {
  clearFormErrors();

  const fullName = document.getElementById("full-name");
  const studentId = document.getElementById("student-id");
  const email = document.getElementById("email");
  const program = document.getElementById("program");
  const term = document.getElementById("term");
  const courseSelect = document.getElementById("course");
  const errors = [];

  if (fullName.value.trim().length < 2) {
    errors.push({ field: "full-name", message: "Enter your full name using at least 2 characters." });
  }

  if (!/^[0-9]{8}$/.test(studentId.value.trim())) {
    errors.push({ field: "student-id", message: "Enter a student ID with 8 digits, for example 20261457." });
  }

  if (email.value.trim() === "") {
    errors.push({ field: "email", message: "Enter your email address, for example name@northgate.edu." });
  } else if (!email.validity.valid) {
    errors.push({ field: "email", message: "Enter a valid email address, for example name@northgate.edu." });
  }

  if (program.value === "") {
    errors.push({ field: "program", message: "Select your academic program." });
  }

  if (term.value === "") {
    errors.push({ field: "term", message: "Select a term." });
  }

  const course = getCourse(courseSelect.value);

  if (courseSelect.value === "") {
    errors.push({ field: "course", message: "Select a course to register for." });
  } else if (!course) {
    errors.push({ field: "course", message: "Select a course from the list." });
  } else if (isRegistered(course.id)) {
    errors.push({ field: "course", message: "You are already registered for " + course.code + ". Select another course." });
  } else if (course.seats <= 0) {
    errors.push({ field: "course", message: course.code + " is full. Select another course." });
  }

  if (errors.length > 0) {
    errors.forEach(function (error) {
      setFieldError(error.field, error.message);
    });
    showErrorSummary(errors);
    return;
  }

  const contactField = form.querySelector('input[name="contact"]:checked');
  const details = {
    fullName: fullName.value.trim(),
    studentId: studentId.value.trim(),
    email: email.value.trim(),
    program: program.value,
    term: term.value,
    contact: contactField ? contactField.value : "Email"
  };

  openRegistrationDialog(course, details);
}

function appendDialogRow(list, label, value) {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value;
  row.appendChild(term);
  row.appendChild(description);
  list.appendChild(row);
}

function openRegistrationDialog(course, details) {
  const content = document.createDocumentFragment();
  const intro = document.createElement("p");
  intro.textContent =
    "Confirming will add " + course.code + " " + course.title + " to your schedule for " + details.term + ".";
  content.appendChild(intro);

  const summary = document.createElement("dl");
  summary.className = "dialog-summary";
  appendDialogRow(summary, "Student", details.fullName);
  appendDialogRow(summary, "Student ID", details.studentId);
  appendDialogRow(summary, "Email", details.email);
  appendDialogRow(summary, "Course", course.code + " - " + course.title);
  appendDialogRow(summary, "Term", details.term);
  appendDialogRow(summary, "Credits", String(course.credits));
  content.appendChild(summary);

  openDialog({
    title: "Confirm your registration",
    description: content,
    confirmLabel: "Confirm registration",
    destructive: false,
    onConfirm: function () {
      registrationDraft = {
        fullName: details.fullName,
        studentId: details.studentId,
        email: details.email,
        program: details.program,
        term: details.term,
        contact: details.contact
      };

      if (isRegistered(course.id)) {
        flashMessage = "You are already registered for " + course.code + ".";
        announce(flashMessage);
        renderRoute({ focus: true });
        return;
      }

      if (course.seats <= 0) {
        flashMessage = course.code + " is now full. Choose another course.";
        announce(flashMessage);
        renderRoute({ focus: true });
        return;
      }

      registrations.push({ courseId: course.id, term: details.term });
      saveRegistrations();
      flashMessage = "Registration saved: " + course.code + " " + course.title + " for " + details.term + ".";
      announce(flashMessage);
      renderRoute({ focus: true });
    }
  });
}

function openDropDialog(course) {
  const content = document.createElement("p");
  content.textContent =
    "This will remove " + course.code + " " + course.title + " from your registered courses. You can register again later if seats are available.";

  openDialog({
    title: "Drop " + course.code + "?",
    description: content,
    confirmLabel: "Drop course",
    destructive: true,
    onConfirm: function () {
      registrations = registrations.filter(function (item) {
        return item.courseId !== course.id;
      });
      saveRegistrations();
      flashMessage = course.code + " " + course.title + " was dropped from your schedule.";
      announce(flashMessage);
      renderRoute({ focus: true });
    }
  });
}

function openDialog(options) {
  if (confirmDialog.open) {
    return;
  }

  setMenuOpen(false);
  dialogTitle.textContent = options.title;
  dialogDescription.replaceChildren();

  if (typeof options.description === "string") {
    const paragraph = document.createElement("p");
    paragraph.textContent = options.description;
    dialogDescription.appendChild(paragraph);
  } else {
    dialogDescription.appendChild(options.description);
  }

  dialogConfirm.textContent = options.confirmLabel;
  dialogConfirm.className = "btn " + (options.destructive ? "btn-danger" : "btn-primary");
  pendingDialogAction = options.onConfirm;

  confirmDialog.showModal();
  dialogCancel.focus();
}

function closeDialog() {
  if (confirmDialog.open) {
    confirmDialog.close();
  }
}

function setMenuOpen(open) {
  primaryNav.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
}

menuToggle.addEventListener("click", function () {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

primaryNav.addEventListener("click", function (event) {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

primaryNav.addEventListener("focusout", function (event) {
  if (
    event.relatedTarget &&
    !primaryNav.contains(event.relatedTarget) &&
    event.relatedTarget !== menuToggle
  ) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", function (event) {
  if (confirmDialog.open) {
    return;
  }
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

if (skipLink) {
  skipLink.addEventListener("click", function (event) {
    event.preventDefault();
    main.focus();
  });
}

window.addEventListener("resize", function () {
  if (window.innerWidth > 860) {
    setMenuOpen(false);
  }
});

dialogCancel.addEventListener("click", closeDialog);

dialogConfirm.addEventListener("click", function () {
  const action = pendingDialogAction;
  pendingDialogAction = null;
  closeDialog();
  if (typeof action === "function") {
    action();
  }
});

confirmDialog.addEventListener("close", function () {
  pendingDialogAction = null;
});

main.addEventListener("input", function (event) {
  if (event.target.id === "course-search") {
    catalogState.query = event.target.value;
    updateCatalogResults();
    return;
  }

  if (event.target.closest("#registration-form") && event.target.id) {
    clearFieldError(event.target.id);
  }
});

main.addEventListener("change", function (event) {
  if (event.target.id === "dept-filter") {
    catalogState.dept = event.target.value;
    updateCatalogResults();
    return;
  }

  if (event.target.id === "level-filter") {
    catalogState.level = event.target.value;
    updateCatalogResults();
    return;
  }

  if (event.target.id === "availability-filter") {
    catalogState.availability = event.target.value;
    updateCatalogResults();
    return;
  }

  if (event.target.closest("#registration-form") && event.target.id) {
    clearFieldError(event.target.id);
  }
});

main.addEventListener("submit", function (event) {
  if (event.target.id === "catalog-search-form") {
    event.preventDefault();
    updateCatalogResults();
    return;
  }

  if (event.target.id === "registration-form") {
    event.preventDefault();
    handleRegistrationSubmit(event.target);
  }
});

main.addEventListener("click", function (event) {
  const errorLink = event.target.closest("a[data-error-field]");
  if (errorLink) {
    event.preventDefault();
    const field = document.getElementById(errorLink.dataset.errorField);
    if (field) {
      field.focus();
    }
    return;
  }

  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.action;
  const courseId = actionButton.dataset.courseId || "";

  if (action === "register-course") {
    preselectCourseId = courseId;
    if (window.location.hash === "#/register") {
      renderRoute({ focus: true });
    } else {
      window.location.hash = "#/register";
    }
    return;
  }

  if (action === "drop-course") {
    const course = getCourse(courseId);
    if (course) {
      openDropDialog(course);
    }
    return;
  }

  if (action === "reset-filters") {
    catalogState.query = "";
    catalogState.dept = "all";
    catalogState.level = "all";
    catalogState.availability = "all";

    const search = document.getElementById("course-search");
    const dept = document.getElementById("dept-filter");
    const level = document.getElementById("level-filter");
    const availability = document.getElementById("availability-filter");

    if (search) {
      search.value = "";
    }
    if (dept) {
      dept.value = "all";
    }
    if (level) {
      level.value = "all";
    }
    if (availability) {
      availability.value = "all";
    }

    updateCatalogResults();
  }
});

window.addEventListener("hashchange", function () {
  renderRoute({ focus: true });
});

renderRoute();
