(function () {
  "use strict";

  const DATA = window.COURSE_DATA || { courses: [], terms: [] };
  const COURSES = DATA.courses;
  const TERMS = DATA.terms;

  const REGISTRATIONS_KEY = "campusflow.registrations.v1";
  const PROFILE_KEY = "campusflow.profile.v1";

  const DEFAULT_PROFILE = {
    name: "Jordan Rivera",
    email: "jordan.rivera@university.edu",
    studentId: "U20260418",
    program: "BSc Computer Science",
    year: "2nd year",
    pronouns: "they/them",
    interests: "Web development, artificial intelligence, accessible design",
    emailUpdates: true,
    waitlistAlerts: true
  };

  const SEED_REGISTRATIONS = [
    { courseId: "cs210", term: "Fall 2026", registeredAt: "2026-09-02T10:00:00.000Z" },
    { courseId: "art115", term: "Fall 2026", registeredAt: "2026-09-03T14:30:00.000Z" }
  ];

  const DEPARTMENT_THEMES = {
    "Computer Science": "violet",
    "Mathematics": "blue",
    "Biology": "green",
    "Psychology": "pink",
    "Art & Design": "orange",
    "Business": "amber",
    "Environmental Studies": "teal",
    "Music": "fuchsia",
    "English": "rose",
    "Physics": "indigo"
  };

  const DAY_ORDER = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let registrations = null;
  let toastTimer = null;
  let modal = null;

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
    }
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getCourse(courseId) {
    return COURSES.find(function (course) {
      return course.id === courseId;
    }) || null;
  }

  function getTheme(department) {
    return DEPARTMENT_THEMES[department] || "violet";
  }

  function getAvailableSeats(course) {
    return Math.max(0, course.seats - course.seatsTaken);
  }

  function isFull(course) {
    return getAvailableSeats(course) <= 0;
  }

  function formatSchedule(course) {
    if (!course.days || course.days.length === 0) {
      return "Self-paced";
    }
    return course.days.join(", ") + " · " + course.time;
  }

  function loadRegistrations() {
    if (registrations !== null) {
      return registrations.slice();
    }

    const stored = safeStorageGet(REGISTRATIONS_KEY);

    if (stored === null) {
      registrations = SEED_REGISTRATIONS.slice();
      safeStorageSet(REGISTRATIONS_KEY, JSON.stringify(registrations));
      return registrations.slice();
    }

    let parsed = [];
    try {
      parsed = JSON.parse(stored);
    } catch (error) {
      parsed = [];
    }

    if (!Array.isArray(parsed)) {
      parsed = [];
    }

    registrations = parsed.filter(function (entry) {
      return entry && typeof entry.courseId === "string" && getCourse(entry.courseId) && typeof entry.term === "string";
    });

    return registrations.slice();
  }

  function persistRegistrations() {
    safeStorageSet(REGISTRATIONS_KEY, JSON.stringify(registrations || []));
  }

  function getRegistrations() {
    return loadRegistrations();
  }

  function getRegistrationFor(courseId) {
    return getRegistrations().find(function (entry) {
      return entry.courseId === courseId;
    }) || null;
  }

  function isRegistered(courseId) {
    return Boolean(getRegistrationFor(courseId));
  }

  function addRegistration(courseId, term, notes) {
    const course = getCourse(courseId);
    if (!course || isRegistered(courseId) || isFull(course)) {
      return false;
    }

    loadRegistrations();
    registrations.push({
      courseId: courseId,
      term: term,
      notes: typeof notes === "string" ? notes : "",
      registeredAt: new Date().toISOString()
    });
    persistRegistrations();
    return true;
  }

  function removeRegistration(courseId) {
    loadRegistrations();
    const previousLength = registrations.length;
    registrations = registrations.filter(function (entry) {
      return entry.courseId !== courseId;
    });

    if (registrations.length !== previousLength) {
      persistRegistrations();
      return true;
    }
    return false;
  }

  function loadProfile() {
    const stored = safeStorageGet(PROFILE_KEY);
    if (!stored) {
      return Object.assign({}, DEFAULT_PROFILE);
    }

    try {
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object") {
        return Object.assign({}, DEFAULT_PROFILE);
      }
      return Object.assign({}, DEFAULT_PROFILE, parsed);
    } catch (error) {
      return Object.assign({}, DEFAULT_PROFILE);
    }
  }

  function saveProfile(profile) {
    safeStorageSet(PROFILE_KEY, JSON.stringify(Object.assign({}, DEFAULT_PROFILE, profile)));
  }

  function getInitials(name) {
    return String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (part) {
        return part.charAt(0).toUpperCase();
      })
      .join("") || "ST";
  }

  function createCourseCard(course, idPrefix) {
    const registered = isRegistered(course.id);
    const full = isFull(course);
    const available = getAvailableSeats(course);
    const titleId = idPrefix + "-" + course.id + "-title";
    const theme = getTheme(course.department);
    const seatText = full ? "Course full" : available + " seat" + (available === 1 ? "" : "s") + " left";
    const seatClass = full ? "seats seats--full" : "seats";

    let action;
    if (registered) {
      action = '<span class="status-pill status-pill--success"><span aria-hidden="true">✓</span> Registered</span>';
    } else if (full) {
      action = '<span class="status-pill status-pill--full">Course full</span>';
    } else {
      action = '<a class="btn btn--primary btn--small" href="registration.html?course=' +
        encodeURIComponent(course.id) +
        '" aria-label="Register for ' + escapeHTML(course.code + " " + course.title) + '">Register</a>';
    }

    const card = document.createElement("article");
    card.className = "course-card theme-" + theme;
    card.setAttribute("aria-labelledby", titleId);
    card.dataset.courseId = course.id;
    card.innerHTML =
      '<div class="course-card__top">' +
        '<span class="badge badge--department">' + escapeHTML(course.department) + "</span>" +
        '<span class="badge badge--level">' + course.level + " level</span>" +
      "</div>" +
      '<p class="course-card__code">' + escapeHTML(course.code) + " · " + course.credits + " credits</p>" +
      '<h3 class="course-card__title" id="' + titleId + '">' + escapeHTML(course.title) + "</h3>" +
      '<p class="course-card__description">' + escapeHTML(course.description) + "</p>" +
      '<ul class="course-card__meta" aria-label="Course details">' +
        "<li><span>Instructor</span><strong>" + escapeHTML(course.instructor) + "</strong></li>" +
        "<li><span>Schedule</span><strong>" + escapeHTML(formatSchedule(course)) + "</strong></li>" +
        "<li><span>Format</span><strong>" + escapeHTML(course.modality) + "</strong></li>" +
      "</ul>" +
      '<div class="course-card__footer">' +
        '<span class="' + seatClass + '">' + seatText + "</span>" +
        action +
      "</div>";

    return card;
  }

  function renderCourseCards(container, courses, options) {
    if (!container) {
      return;
    }

    const settings = options || {};
    const prefix = settings.idPrefix || "course";
    container.innerHTML = "";
    courses.forEach(function (course) {
      container.appendChild(createCourseCard(course, prefix));
    });
  }

  function renderRegistrationTable(tbody, options) {
    if (!tbody) {
      return;
    }

    const settings = options || {};
    const entries = getRegistrations();
    tbody.innerHTML = "";

    if (entries.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 6;
      cell.innerHTML =
        '<div class="table-empty">' +
          "<p><strong>No courses registered yet.</strong></p>" +
          "<p>Find a course that sparks your curiosity and add it to your plan.</p>" +
          '<a class="btn btn--primary btn--small" href="catalog.html">Browse the course catalog</a>' +
        "</div>";
      row.appendChild(cell);
      tbody.appendChild(row);
      return;
    }

    entries.forEach(function (entry) {
      const course = getCourse(entry.courseId);
      if (!course) {
        return;
      }

      const row = document.createElement("tr");
      row.innerHTML =
        '<th scope="row" class="cell-course">' +
          '<span class="cell-course__title">' + escapeHTML(course.title) + "</span>" +
          '<span class="cell-course__code">' + escapeHTML(course.code) + "</span>" +
        "</th>" +
        "<td>" + escapeHTML(entry.term) + "</td>" +
        "<td>" + course.credits + "</td>" +
        "<td>" + escapeHTML(formatSchedule(course)) + "</td>" +
        "<td>" + escapeHTML(course.modality) + "</td>" +
        '<td class="cell-action">' +
          '<button type="button" class="btn btn--ghost btn--small btn--remove" data-remove-course="' + course.id + '" aria-label="Remove ' + escapeHTML(course.code + " " + course.title) + ' from your schedule">Remove</button>' +
        "</td>";
      tbody.appendChild(row);
    });

    tbody.onclick = function (event) {
      const button = event.target.closest("[data-remove-course]");
      if (!button) {
        return;
      }
      confirmRemove(button.dataset.removeCourse);
    };
  }

  function getNextClass() {
    const entries = getRegistrations()
      .map(function (entry) {
        return getCourse(entry.courseId);
      })
      .filter(function (course) {
        return course && course.days && course.days.length > 0;
      });

    if (entries.length === 0) {
      return null;
    }

    entries.sort(function (a, b) {
      const dayDifference = (DAY_ORDER[a.days[0]] || 99) - (DAY_ORDER[b.days[0]] || 99);
      if (dayDifference !== 0) {
        return dayDifference;
      }
      return a.time.localeCompare(b.time);
    });

    return entries[0];
  }

  function updateStats() {
    const entries = getRegistrations();
    const totalCredits = entries.reduce(function (sum, entry) {
      const course = getCourse(entry.courseId);
      return sum + (course ? course.credits : 0);
    }, 0);
    const nextClass = getNextClass();

    document.querySelectorAll('[data-stat="courses"]').forEach(function (element) {
      element.textContent = String(entries.length);
    });

    document.querySelectorAll('[data-stat="credits"]').forEach(function (element) {
      element.textContent = String(totalCredits);
    });

    document.querySelectorAll('[data-stat="next"]').forEach(function (element) {
      element.textContent = nextClass ? nextClass.code + " · " + nextClass.days[0] : "None yet";
    });
  }

  function showToast(message) {
    let toast = document.getElementById("appToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "appToast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.setAttribute("aria-atomic", "true");
      document.body.appendChild(toast);
    }

    window.clearTimeout(toastTimer);
    toast.textContent = "";
    window.requestAnimationFrame(function () {
      toast.textContent = message;
      toast.classList.add("is-visible");
    });

    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 4200);
  }

  function ensureModal() {
    if (modal) {
      return modal;
    }

    modal = document.createElement("dialog");
    modal.className = "modal";
    modal.id = "appModal";
    modal.setAttribute("aria-labelledby", "appModalTitle");
    modal.setAttribute("aria-describedby", "appModalDescription");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML =
      '<div class="modal__card">' +
        '<button type="button" class="modal__close" data-modal-close aria-label="Close dialog">' +
          '<span aria-hidden="true">×</span>' +
        "</button>" +
        '<div class="modal__icon" data-modal-icon aria-hidden="true">✓</div>' +
        '<h2 id="appModalTitle" class="modal__title"></h2>' +
        '<p id="appModalDescription" class="modal__description"></p>' +
        '<dl class="modal__details" data-modal-details hidden></dl>' +
        '<div class="modal__actions">' +
          '<button type="button" class="btn btn--ghost" data-modal-secondary></button>' +
          '<button type="button" class="btn btn--primary" data-modal-primary></button>' +
        "</div>" +
      "</div>";

    document.body.appendChild(modal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.close();
      }
    });

    return modal;
  }

  function showModal(options) {
    const settings = Object.assign({
      title: "Notice",
      message: "",
      details: [],
      primaryLabel: "OK",
      secondaryLabel: "",
      onPrimary: null,
      onSecondary: null,
      tone: "success",
      icon: "✓"
    }, options || {});

    const dialog = ensureModal();
    const title = dialog.querySelector("#appModalTitle");
    const description = dialog.querySelector("#appModalDescription");
    const details = dialog.querySelector("[data-modal-details]");
    const icon = dialog.querySelector("[data-modal-icon]");
    const primary = dialog.querySelector("[data-modal-primary]");
    const secondary = dialog.querySelector("[data-modal-secondary]");
    const closeButton = dialog.querySelector("[data-modal-close]");

    dialog.dataset.tone = settings.tone;
    title.textContent = settings.title;
    description.textContent = settings.message;
    icon.textContent = settings.icon;

    details.innerHTML = "";
    if (settings.details && settings.details.length > 0) {
      settings.details.forEach(function (item) {
        const term = document.createElement("dt");
        const value = document.createElement("dd");
        term.textContent = item.label;
        value.textContent = item.value;
        details.appendChild(term);
        details.appendChild(value);
      });
      details.hidden = false;
    } else {
      details.hidden = true;
    }

    primary.textContent = settings.primaryLabel;
    primary.className = "btn " + (settings.tone === "danger" ? "btn--danger" : "btn--primary");

    if (settings.secondaryLabel) {
      secondary.textContent = settings.secondaryLabel;
      secondary.hidden = false;
    } else {
      secondary.hidden = true;
      secondary.textContent = "";
    }

    primary.onclick = function () {
      dialog.close();
      if (typeof settings.onPrimary === "function") {
        settings.onPrimary();
      }
    };

    secondary.onclick = function () {
      dialog.close();
      if (typeof settings.onSecondary === "function") {
        settings.onSecondary();
      }
    };

    closeButton.onclick = function () {
      dialog.close();
    };

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    window.requestAnimationFrame(function () {
      if (settings.tone === "danger" && !secondary.hidden) {
        secondary.focus();
      } else {
        primary.focus();
      }
    });
  }

  function confirmRemove(courseId) {
    const course = getCourse(courseId);
    const registration = getRegistrationFor(courseId);

    if (!course || !registration) {
      return;
    }

    showModal({
      tone: "danger",
      icon: "!",
      title: "Remove this course?",
      message: course.code + " — " + course.title + " will be removed from your registered courses.",
      details: [
        { label: "Term", value: registration.term },
        { label: "Credits", value: String(course.credits) },
        { label: "Schedule", value: formatSchedule(course) }
      ],
      primaryLabel: "Yes, remove course",
      secondaryLabel: "Keep course",
      onPrimary: function () {
        removeRegistration(courseId);
        updateStats();
        document.dispatchEvent(new CustomEvent("registrations:changed"));
        showToast(course.code + " was removed from your schedule.");

        const heading = document.getElementById("registeredHeading") ||
          document.getElementById("profileCoursesHeading");
        if (heading) {
          heading.focus({ preventScroll: true });
        }
      }
    });
  }

  function setupNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("primaryNav");
    const header = document.querySelector(".site-header");
    const toggleLabel = toggle ? toggle.querySelector(".sr-only") : null;
    const page = document.body.dataset.page;

    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.dataset.nav === page) {
        link.setAttribute("aria-current", "page");
      }
    });

    if (!toggle || !nav) {
      return;
    }

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      if (toggleLabel) {
        toggleLabel.textContent = open ? "Close navigation menu" : "Open navigation menu";
      }
    }

    toggle.addEventListener("click", function () {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") !== "true") {
        return;
      }
      if (header && !header.contains(event.target)) {
        setOpen(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) {
        setOpen(false);
      }
    });
  }

  window.App = {
    courses: COURSES,
    terms: TERMS,
    emailPattern: EMAIL_PATTERN,
    escapeHTML: escapeHTML,
    getCourse: getCourse,
    getTheme: getTheme,
    getAvailableSeats: getAvailableSeats,
    isFull: isFull,
    formatSchedule: formatSchedule,
    getRegistrations: getRegistrations,
    getRegistrationFor: getRegistrationFor,
    isRegistered: isRegistered,
    addRegistration: addRegistration,
    removeRegistration: removeRegistration,
    loadProfile: loadProfile,
    saveProfile: saveProfile,
    getInitials: getInitials,
    renderCourseCards: renderCourseCards,
    renderRegistrationTable: renderRegistrationTable,
    updateStats: updateStats,
    showToast: showToast,
    showModal: showModal,
    confirmRemove: confirmRemove
  };

  setupNavigation();
})();
