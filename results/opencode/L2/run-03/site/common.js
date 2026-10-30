(function () {
  "use strict";

  const { COURSES, DEFAULT_PROFILE, DEFAULT_REGISTRATIONS } = window.AURORA;
  const STORAGE_KEYS = {
    registrations: "aurora.registrations.v1",
    profile: "aurora.profile.v1"
  };

  const memoryStore = {};

  function readStorage(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : fallback;
    }
  }

  function writeStorage(key, value) {
    memoryStore[key] = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // The app remains usable in private or storage-restricted contexts.
    }
  }

  function getCourseById(id) {
    return COURSES.find(function (course) {
      return course.id === id;
    });
  }

  function getRegistrations() {
    const stored = readStorage(STORAGE_KEYS.registrations, null);
    if (!Array.isArray(stored)) {
      writeStorage(STORAGE_KEYS.registrations, DEFAULT_REGISTRATIONS);
      return DEFAULT_REGISTRATIONS.slice();
    }
    return stored.filter(function (id) {
      return Boolean(getCourseById(id));
    });
  }

  function setRegistrations(ids) {
    const uniqueIds = ids.filter(function (id, index) {
      return getCourseById(id) && ids.indexOf(id) === index;
    });
    writeStorage(STORAGE_KEYS.registrations, uniqueIds);
    updateRegistrationCount();
    return uniqueIds;
  }

  function isRegistered(courseId) {
    return getRegistrations().indexOf(courseId) !== -1;
  }

  function addRegistration(courseId) {
    const registrations = getRegistrations();
    if (getCourseById(courseId) && registrations.indexOf(courseId) === -1) {
      registrations.push(courseId);
      return setRegistrations(registrations);
    }
    return registrations;
  }

  function removeRegistration(courseId) {
    return setRegistrations(
      getRegistrations().filter(function (id) {
        return id !== courseId;
      })
    );
  }

  function getProfile() {
    const stored = readStorage(STORAGE_KEYS.profile, {});
    return Object.assign({}, DEFAULT_PROFILE, stored && typeof stored === "object" ? stored : {});
  }

  function saveProfile(updates) {
    const profile = Object.assign({}, getProfile(), updates);
    writeStorage(STORAGE_KEYS.profile, profile);
    return profile;
  }

  function getInitials(name) {
    return String(name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(function (part) {
        return part.charAt(0).toUpperCase();
      })
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function updateRegistrationCount() {
    const count = getRegistrations().length;
    document.querySelectorAll("[data-registration-count]").forEach(function (element) {
      element.textContent = String(count);
    });
    document.querySelectorAll("[data-registration-label]").forEach(function (element) {
      element.textContent = count === 1 ? "course registered" : "courses registered";
    });
    document.querySelectorAll("[data-credits-count]").forEach(function (element) {
      const credits = getRegistrations().reduce(function (total, id) {
        const course = getCourseById(id);
        return total + (course ? course.credits : 0);
      }, 0);
      element.textContent = String(credits);
    });
  }

  function createCourseCard(course, options) {
    const settings = options || {};
    const meta = window.AURORA.DEPARTMENTS[course.department];
    const registered = isRegistered(course.id);
    const titleId = "course-" + course.id + "-title";
    const openSeats = Math.max(0, course.seatsAvailable);
    const seatPercent = Math.min(100, Math.round((openSeats / course.capacity) * 100));
    const seatLabel = openSeats + " of " + course.capacity + " seats open";
    const article = document.createElement("article");
    article.className = "course-card";
    article.setAttribute("aria-labelledby", titleId);
    article.style.setProperty("--accent", meta.accent);
    article.style.setProperty("--accent-dark", meta.dark);
    article.style.setProperty("--accent-soft", meta.soft);

    const action = registered
      ? '<a class="btn btn-small btn-registered" href="registration.html">View schedule<span class="sr-only"> for ' +
        escapeHtml(course.code) +
        "</span></a>"
      : '<a class="btn btn-small" href="registration.html?course=' +
        encodeURIComponent(course.id) +
        '">Choose course<span class="sr-only"> — ' +
        escapeHtml(course.code) +
        " " +
        escapeHtml(course.title) +
        "</span></a>";

    article.innerHTML =
      '<div class="course-card__top">' +
      '<span class="dept-badge">' +
      escapeHtml(course.department) +
      "</span>" +
      '<span class="course-code">' +
      escapeHtml(course.code) +
      "</span>" +
      "</div>" +
      '<h3 class="course-title" id="' +
      titleId +
      '"><a class="course-title-link" href="registration.html?course=' +
      encodeURIComponent(course.id) +
      '">' +
      escapeHtml(course.title) +
      '<svg class="icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a></h3>' +
      '<p class="course-description">' +
      escapeHtml(course.description) +
      "</p>" +
      '<ul class="course-facts" role="list">' +
      '<li><svg class="icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect x="3" y="4" width="14" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6.5 2.5v3M13.5 2.5v3M3 8h14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span>' +
      escapeHtml(course.schedule) +
      "</span></li>" +
      '<li><svg class="icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 17s5.5-5.1 5.5-9a5.5 5.5 0 1 0-11 0c0 3.9 5.5 9 5.5 9Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="10" cy="8" r="1.8" fill="currentColor"/></svg><span>' +
      escapeHtml(course.format) +
      " · " +
      escapeHtml(course.location) +
      "</span></li>" +
      '<li><svg class="icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H16v12H6.5A2.5 2.5 0 0 0 4 17.5v-12Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 17.5V5.5M16 15H6.5A2.5 2.5 0 0 0 4 17.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span>' +
      escapeHtml(course.credits) +
      " credits · Level " +
      escapeHtml(course.level) +
      "</span></li>" +
      "</ul>" +
      '<div class="seat-block">' +
      '<div class="seat-row"><span class="seat-label"><strong>' +
      escapeHtml(openSeats) +
      "</strong> of " +
      escapeHtml(course.capacity) +
      ' seats open</span><span class="format-badge">' +
      escapeHtml(course.format) +
      "</span></div>" +
      '<div class="seat-meter" role="img" aria-label="' +
      escapeHtml(seatLabel) +
      '"><span style="width: ' +
      seatPercent +
      '%"></span></div>' +
      "</div>" +
      '<div class="course-card__footer"><span class="instructor">' +
      escapeHtml(course.instructor) +
      "</span>" +
      action +
      "</div>";

    if (settings.highlight) {
      article.classList.add("course-card--featured");
    }

    return article;
  }

  function renderEmptySchedule(container) {
    container.innerHTML =
      '<div class="empty-state">' +
      '<span class="empty-icon" aria-hidden="true">' +
      '<svg viewBox="0 0 48 48" focusable="false"><path d="M12 10h24a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M16 6v8M32 6v8M8 20h32M17 28h14M17 34h9" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>' +
      "</span>" +
      "<h3>Your schedule is wide open</h3>" +
      '<p>Find a course that sparks your curiosity and add it to your Spring schedule.</p>' +
      '<a class="btn" href="courses.html">Browse courses</a>' +
      "</div>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateRegistrationCount();
    document.querySelectorAll("[data-current-year]").forEach(function (element) {
      element.textContent = String(new Date().getFullYear());
    });
  });

  window.AURORA_APP = {
    getCourseById,
    getRegistrations,
    setRegistrations,
    isRegistered,
    addRegistration,
    removeRegistration,
    getProfile,
    saveProfile,
    getInitials,
    updateRegistrationCount,
    createCourseCard,
    renderEmptySchedule,
    escapeHtml
  };
})();
