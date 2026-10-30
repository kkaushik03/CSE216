(() => {
  "use strict";

  const DATA = window.PRISM_DATA;
  if (!DATA) return;

  const COURSES = DATA.courses;
  const COURSE_MAP = new Map(COURSES.map((course) => [course.id, course]));
  const STORAGE = {
    profile: "prism_profile_v1",
    registered: "prism_registered_v1",
    plan: "prism_plan_v1",
    seeded: "prism_seeded_v1"
  };
  const PAGE = document.body.dataset.page || "home";

  const icons = {
    arrow: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    star: '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9Z"/></svg>',
    calendar: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
    clock: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    user: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    pin: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    menu: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    trash: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>',
    alert: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2.5 20h19Z"/><path d="M12 9v5M12 17.5v.1"/></svg>',
    printer: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7" rx="1"/></svg>',
    spark: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z"/></svg>',
    code: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
    pen: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    briefcase: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>',
    mind: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2Z"/></svg>',
    leaf: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 4 13C4 7 10 3 20 3c0 10-4 16-10 16Z"/><path d="M4 21c2-6 7-10 13-13"/></svg>',
    chat: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-4-.9L3 21l1.9-4.2A8.5 8.5 0 1 1 21 11.5Z"/></svg>'
  };

  const facultyCards = [
    { department: "Computer Science", blurb: "Code the future", theme: 1, icon: "code" },
    { department: "Design", blurb: "Make ideas visible", theme: 2, icon: "pen" },
    { department: "Business", blurb: "Build what matters", theme: 4, icon: "briefcase" },
    { department: "Psychology", blurb: "Understand people", theme: 5, icon: "mind" },
    { department: "Environmental Science", blurb: "Design for the planet", theme: 3, icon: "leaf" },
    { department: "Communication", blurb: "Tell stories that travel", theme: 6, icon: "chat" }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let lastFocusedElement = null;

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function readJSON(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
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

  function ensureSeedData() {
    if (readJSON(STORAGE.seeded, false)) return;
    writeJSON(STORAGE.profile, DATA.defaultProfile);
    writeJSON(STORAGE.registered, DATA.defaultRegistrations);
    writeJSON(STORAGE.plan, []);
    writeJSON(STORAGE.seeded, true);
  }

  function getProfile() {
    const stored = readJSON(STORAGE.profile, {});
    return { ...DATA.defaultProfile, ...(stored && typeof stored === "object" ? stored : {}) };
  }

  function saveProfile(profile) {
    writeJSON(STORAGE.profile, profile);
  }

  function getRegistered() {
    const records = readJSON(STORAGE.registered, []);
    if (!Array.isArray(records)) return [];
    return records.filter((record) => record && COURSE_MAP.has(record.courseId));
  }

  function saveRegistered(records) {
    writeJSON(STORAGE.registered, records);
  }

  function getPlan() {
    const records = readJSON(STORAGE.plan, []);
    if (!Array.isArray(records)) return [];
    const seen = new Set();
    return records.filter((id) => {
      if (typeof id !== "string" || seen.has(id) || !COURSE_MAP.has(id)) return false;
      seen.add(id);
      return !getRegistered().some((record) => record.courseId === id);
    });
  }

  function savePlan(plan) {
    writeJSON(STORAGE.plan, plan);
    updatePlanBadge();
  }

  function getCourse(courseId) {
    return COURSE_MAP.get(courseId);
  }

  function isRegistered(courseId) {
    return getRegistered().some((record) => record.courseId === courseId);
  }

  function isInPlan(courseId) {
    return getPlan().includes(courseId);
  }

  function totalCredits(plan) {
    return plan.reduce((sum, courseId) => {
      const course = getCourse(courseId);
      return sum + (course ? course.credits : 0);
    }, 0);
  }

  function addToPlan(courseId) {
    const course = getCourse(courseId);
    if (!course) return { ok: false, message: "That course could not be found." };
    if (isRegistered(courseId)) return { ok: false, message: `${course.code} is already on your schedule.` };
    if (isInPlan(courseId)) return { ok: false, message: `${course.code} is already in your plan.` };
    if (course.seats <= 0) return { ok: false, message: `${course.code} is currently full.` };

    const plan = getPlan();
    plan.push(courseId);
    savePlan(plan);
    return { ok: true, message: `${course.code} was added to your plan.` };
  }

  function updatePlanBadge() {
    const count = getPlan().length;
    $$("[data-plan-count]").forEach((badge) => {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
  }

  function getInitials(profile) {
    const first = (profile.firstName || "").trim().charAt(0);
    const last = (profile.lastName || "").trim().charAt(0);
    return `${first}${last}`.toUpperCase() || "PA";
  }

  function updateFooterYear() {
    $$("[data-current-year]").forEach((element) => {
      element.textContent = String(new Date().getFullYear());
    });
  }

  function initNavigation() {
    $$("[data-nav]").forEach((link) => {
      const active = link.dataset.nav === PAGE;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const toggle = $("#nav-toggle");
    const nav = $("#primary-nav");
    if (!toggle || !nav) return;

    const closeMenu = () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    };

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  function ensureToastRegion() {
    let region = $("#toast-region");
    if (!region) {
      region = document.createElement("div");
      region.id = "toast-region";
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "false");
      document.body.appendChild(region);
    }
    return region;
  }

  function showToast(message, options = {}) {
    const region = ensureToastRegion();
    const toast = document.createElement("div");
    const tone = options.tone === "warning" ? "toast--warning" : "toast--success";
    toast.className = `toast ${tone}`;

    const icon = document.createElement("span");
    icon.className = "toast__icon";
    icon.innerHTML = options.tone === "warning" ? icons.alert : icons.check;
    toast.appendChild(icon);

    const text = document.createElement("span");
    text.className = "toast__message";
    text.textContent = message;
    toast.appendChild(text);

    if (options.actionText && options.href) {
      const link = document.createElement("a");
      link.className = "toast__action";
      link.href = options.href;
      link.textContent = options.actionText;
      toast.appendChild(link);
    }

    const close = document.createElement("button");
    close.type = "button";
    close.className = "toast__close";
    close.setAttribute("aria-label", "Dismiss notification");
    close.innerHTML = icons.close;
    close.addEventListener("click", () => toast.remove());
    toast.appendChild(close);

    region.appendChild(toast);
    while (region.children.length > 4) region.firstElementChild.remove();

    window.setTimeout(() => {
      toast.classList.add("is-leaving");
      window.setTimeout(() => toast.remove(), 240);
    }, 4800);
  }

  function courseActionMarkup(course) {
    if (isRegistered(course.id)) {
      return `<span class="course-state course-state--enrolled">${icons.check} Enrolled</span>`;
    }
    if (isInPlan(course.id)) {
      return `<span class="course-state course-state--planned">${icons.check} In your plan</span>`;
    }
    if (course.seats <= 0) {
      return '<span class="course-state course-state--full">Course full</span>';
    }
    return `<button class="btn btn--small btn--ink" type="button" data-course-add="${course.id}">Add to plan ${icons.arrow}</button>`;
  }

  function courseCardMarkup(course, featured = false) {
    const openSeats = course.seats > 0;
    const seatClass = !openSeats ? "is-full" : course.seats <= 5 ? "is-low" : "";
    const seatText = openSeats ? `${course.seats} seats left` : "Full";
    return `
      <article class="course-card theme-${course.theme}${featured ? " course-card--featured" : ""}" data-course-id="${course.id}">
        <div class="course-card__art">
          <span class="course-card__monogram" aria-hidden="true">${escapeHTML(course.code.split(" ")[0])}</span>
          <div class="course-card__topline">
            <span class="dept-pill">${escapeHTML(course.department)}</span>
            <span class="rating-chip" title="Average student rating">${icons.star} ${course.rating.toFixed(1)}</span>
          </div>
          <div class="course-card__code">${escapeHTML(course.code)}</div>
          <div class="course-card__format">${escapeHTML(course.format)} · Level ${course.level}</div>
        </div>
        <div class="course-card__body">
          <div class="course-card__heading">
            <h3>${escapeHTML(course.title)}</h3>
            <p>${escapeHTML(course.description)}</p>
          </div>
          <div class="course-card__meta">
            <span>${icons.calendar} ${escapeHTML(course.schedule)}</span>
            <span>${icons.user} ${escapeHTML(course.instructor)}</span>
            <span>${icons.pin} ${escapeHTML(course.location)}</span>
          </div>
          <div class="course-card__tags">
            ${course.topics.slice(0, 3).map((topic) => `<span>${escapeHTML(topic)}</span>`).join("")}
          </div>
          <div class="course-card__footer">
            <div class="course-credits">
              <strong>${course.credits} credits</strong>
              <span class="seat-status ${seatClass}">${seatText}</span>
            </div>
            ${courseActionMarkup(course)}
          </div>
        </div>
      </article>
    `;
  }

  function renderFeaturedCourses() {
    const grid = $("#featured-grid");
    if (!grid) return;
    const featured = COURSES.filter((course) => course.featured).slice(0, 3);
    grid.innerHTML = featured.map((course) => courseCardMarkup(course, true)).join("");
  }

  function renderFacultyCards() {
    const grid = $("#faculty-grid");
    if (!grid) return;
    grid.innerHTML = facultyCards.map((faculty) => {
      const count = COURSES.filter((course) => course.department === faculty.department).length;
      return `
        <a class="faculty-card faculty-card--${faculty.theme}" href="catalog.html?department=${encodeURIComponent(faculty.department)}">
          <span class="faculty-card__icon">${icons[faculty.icon]}</span>
          <span class="faculty-card__copy">
            <strong>${escapeHTML(faculty.department)}</strong>
            <span>${escapeHTML(faculty.blurb)}</span>
          </span>
          <span class="faculty-card__count">${count} ${count === 1 ? "course" : "courses"}</span>
          <span class="faculty-card__arrow">${icons.arrow}</span>
        </a>
      `;
    }).join("");
  }

  function initHomePage() {
    renderFacultyCards();
    renderFeaturedCourses();
    const courseCount = $("#stat-course-count");
    if (courseCount) courseCount.textContent = String(COURSES.length);
  }

  let catalogInitialized = false;

  function initCatalogPage() {
    if (catalogInitialized) return;
    catalogInitialized = true;

    const departmentSelect = $("#department-filter");
    const levelSelect = $("#level-filter");
    const availabilitySelect = $("#availability-filter");
    const sortSelect = $("#sort-filter");
    const searchInput = $("#course-search");
    if (!departmentSelect || !levelSelect || !availabilitySelect || !sortSelect || !searchInput) return;

    const departments = [...new Set(COURSES.map((course) => course.department))].sort();
    departmentSelect.innerHTML = '<option value="all">All departments</option>' +
      departments.map((department) => `<option value="${escapeHTML(department)}">${escapeHTML(department)}</option>`).join("");

    const requestedDepartment = new URLSearchParams(window.location.search).get("department");
    if (requestedDepartment && departments.includes(requestedDepartment)) {
      departmentSelect.value = requestedDepartment;
    }

    const render = () => renderCatalog();
    searchInput.addEventListener("input", render);
    departmentSelect.addEventListener("change", render);
    levelSelect.addEventListener("change", render);
    availabilitySelect.addEventListener("change", render);
    sortSelect.addEventListener("change", render);

    const resetButton = $("#clear-filters");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        searchInput.value = "";
        departmentSelect.value = "all";
        levelSelect.value = "all";
        availabilitySelect.value = "all";
        sortSelect.value = "recommended";
        render();
        searchInput.focus();
      });
    }

    render();
  }

  function renderCatalog() {
    const grid = $("#course-grid");
    if (!grid) return;

    const searchInput = $("#course-search");
    const departmentSelect = $("#department-filter");
    const levelSelect = $("#level-filter");
    const availabilitySelect = $("#availability-filter");
    const sortSelect = $("#sort-filter");
    const emptyState = $("#catalog-empty");
    const resultCount = $("#result-count");
    const activeFilters = $("#active-filter-summary");

    const query = (searchInput?.value || "").trim().toLowerCase();
    const department = departmentSelect?.value || "all";
    const level = levelSelect?.value || "all";
    const availability = availabilitySelect?.value || "all";
    const sort = sortSelect?.value || "recommended";

    let results = COURSES.filter((course) => {
      const haystack = [
        course.code,
        course.title,
        course.department,
        course.instructor,
        course.description,
        course.topics.join(" ")
      ].join(" ").toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesDepartment = department === "all" || course.department === department;
      const matchesLevel = level === "all" || String(course.level) === level;
      const matchesAvailability = availability === "all" ||
        (availability === "open" && course.seats > 0) ||
        (availability === "few" && course.seats > 0 && course.seats <= 6) ||
        (availability === "full" && course.seats === 0);
      return matchesQuery && matchesDepartment && matchesLevel && matchesAvailability;
    });

    results = results.slice().sort((a, b) => {
      if (sort === "code") return a.code.localeCompare(b.code);
      if (sort === "credits") return b.credits - a.credits || a.code.localeCompare(b.code);
      if (sort === "rating") return b.rating - a.rating || a.code.localeCompare(b.code);
      return Number(b.featured) - Number(a.featured) || b.rating - a.rating;
    });

    grid.innerHTML = results.map((course) => courseCardMarkup(course)).join("");
    if (emptyState) emptyState.hidden = results.length !== 0;

    if (resultCount) {
      resultCount.textContent = `${results.length} ${results.length === 1 ? "course" : "courses"} found`;
    }

    if (activeFilters) {
      const labels = [];
      if (department !== "all") labels.push(department);
      if (level !== "all") labels.push(`Level ${level}`);
      if (availability === "open") labels.push("Open seats");
      if (availability === "few") labels.push("Few seats left");
      if (availability === "full") labels.push("Full courses");
      activeFilters.textContent = labels.length ? labels.join(" · ") : "All courses";
    }
  }

  function buildPlanTable() {
    const body = $("#plan-table-body");
    if (!body) return;
    const plan = getPlan();

    if (!plan.length) {
      body.innerHTML = `
        <tr class="empty-row">
          <td colspan="5">
            <div class="table-empty">
              <span class="table-empty__icon">${icons.spark}</span>
              <strong>Your plan is waiting for its first course.</strong>
              <span>Choose a course above, or browse the catalog for inspiration.</span>
            </div>
          </td>
        </tr>
      `;
    } else {
      body.innerHTML = plan.map((courseId) => {
        const course = getCourse(courseId);
        return `
          <tr>
            <td data-label="Course">
              <div class="table-course">
                <span class="course-swatch theme-${course.theme}" aria-hidden="true"></span>
                <span><strong>${escapeHTML(course.code)}</strong><small>${escapeHTML(course.title)}</small></span>
              </div>
            </td>
            <td data-label="Schedule"><span class="table-schedule">${escapeHTML(course.schedule)}</span><small>${escapeHTML(course.location)}</small></td>
            <td data-label="Credits">${course.credits}</td>
            <td data-label="Status"><span class="status-badge status-badge--planned">Selected</span></td>
            <td class="table-action" data-label="Action">
              <button class="icon-button" type="button" data-remove-plan="${course.id}" aria-label="Remove ${escapeHTML(course.code)} from your plan">${icons.trash}</button>
            </td>
          </tr>
        `;
      }).join("");
    }

    const credits = totalCredits(plan);
    const creditsElement = $("#plan-credits");
    const countElement = $("#plan-course-count");
    const reviewButton = $("#review-registration");
    if (creditsElement) creditsElement.textContent = String(credits);
    if (countElement) countElement.textContent = String(plan.length);
    if (reviewButton) reviewButton.disabled = plan.length === 0;

    const meter = $("#plan-meter");
    if (meter) meter.style.width = `${Math.min(100, (credits / 18) * 100)}%`;

    const planNote = $("#plan-note");
    if (planNote) {
      if (!plan.length) {
        planNote.textContent = "Add at least one course to review your registration.";
      } else if (credits > 18) {
        planNote.textContent = "You have more than 18 credits. Check with your advisor before confirming.";
      } else {
        planNote.textContent = "Looks good. Review your selections when you are ready.";
      }
    }
    populateCourseSelect();
  }

  function populateCourseSelect() {
    const select = $("#course-select");
    if (!select) return;
    const plan = getPlan();
    const unavailable = new Set([...plan, ...getRegistered().map((record) => record.courseId)]);
    const available = COURSES.filter((course) => !unavailable.has(course.id));
    const previousValue = select.value;

    if (!available.length) {
      select.innerHTML = '<option value="">All available courses are already selected</option>';
      select.disabled = true;
      return;
    }

    select.disabled = false;
    select.innerHTML = '<option value="">Choose a course...</option>' + available.map((course) => {
      const status = course.seats > 0 ? `${course.seats} seats` : "full";
      return `<option value="${course.id}">${escapeHTML(course.code)} · ${escapeHTML(course.title)} · ${course.credits} cr · ${status}</option>`;
    }).join("");

    if (available.some((course) => course.id === previousValue)) {
      select.value = previousValue;
    }
  }

  function buildCurrentEnrollmentTable() {
    const body = $("#current-enrollment-body");
    if (!body) return;
    const records = getRegistered();

    if (!records.length) {
      body.innerHTML = `
        <tr class="empty-row">
          <td colspan="4">
            <div class="table-empty table-empty--compact">
              <strong>No courses registered yet.</strong>
              <span>Your confirmed courses will appear here.</span>
            </div>
          </td>
        </tr>
      `;
    } else {
      body.innerHTML = records.map((record) => {
        const course = getCourse(record.courseId);
        return `
          <tr>
            <td data-label="Course">
              <div class="table-course">
                <span class="course-swatch theme-${course.theme}" aria-hidden="true"></span>
                <span><strong>${escapeHTML(course.code)}</strong><small>${escapeHTML(course.title)}</small></span>
              </div>
            </td>
            <td data-label="Term">${escapeHTML(record.term || "Spring 2027")}</td>
            <td data-label="Credits">${course.credits}</td>
            <td data-label="Status"><span class="status-badge status-badge--enrolled">${icons.check} Enrolled</span></td>
          </tr>
        `;
      }).join("");
    }

    const count = $("#current-enrollment-count");
    if (count) count.textContent = String(records.length);
  }

  function initRegistrationPage() {
    const form = $("#registration-form");
    if (!form) return;

    const profile = getProfile();
    const fields = {
      fullName: $("#full-name"),
      email: $("#email"),
      studentId: $("#student-id"),
      program: $("#program"),
      year: $("#year"),
      term: $("#term")
    };

    if (fields.fullName) fields.fullName.value = `${profile.firstName} ${profile.lastName}`.trim();
    if (fields.email) fields.email.value = profile.email;
    if (fields.studentId) fields.studentId.value = profile.studentId;
    if (fields.program) fields.program.value = profile.program;
    if (fields.year) fields.year.value = profile.year;

    if (fields.term) {
      fields.term.innerHTML = DATA.terms.map((term) => `<option value="${term}">${term}</option>`).join("");
      fields.term.value = DATA.terms[0];
    }

    buildPlanTable();
    buildCurrentEnrollmentTable();

    const addButton = $("#add-course");
    const courseSelect = $("#course-select");
    if (addButton && courseSelect) {
      addButton.addEventListener("click", () => {
        const courseId = courseSelect.value;
        if (!courseId) {
          showToast("Choose a course from the list first.", { tone: "warning" });
          return;
        }
        const result = addToPlan(courseId);
        if (!result.ok) {
          showToast(result.message, { tone: "warning" });
          return;
        }
        showToast(result.message);
        buildPlanTable();
        if (courseSelect.options.length) courseSelect.focus();
      });
    }

    const planBody = $("#plan-table-body");
    if (planBody) {
      planBody.addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-remove-plan]");
        if (!removeButton) return;
        const course = getCourse(removeButton.dataset.removePlan);
        const plan = getPlan().filter((courseId) => courseId !== removeButton.dataset.removePlan);
        savePlan(plan);
        buildPlanTable();
        if (course) showToast(`${course.code} was removed from your plan.`);
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (!getPlan().length) {
        showToast("Add at least one course before reviewing.", { tone: "warning" });
        return;
      }
      openConfirmationModal();
    });

    initModal();
  }

  function getFormProfile() {
    const fullName = ($("#full-name")?.value || "").trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    return {
      firstName: parts.shift() || "",
      lastName: parts.join(" "),
      email: ($("#email")?.value || "").trim(),
      studentId: ($("#student-id")?.value || "").trim(),
      program: ($("#program")?.value || "").trim(),
      year: $("#year")?.value || "Sophomore",
      advisor: getProfile().advisor
    };
  }

  function openConfirmationModal() {
    const modal = $("#confirmation-modal");
    const content = $("#modal-content");
    const actions = $("#modal-actions");
    if (!modal || !content || !actions) return;

    const plan = getPlan();
    const profile = getFormProfile();
    const term = $("#term")?.value || DATA.terms[0];
    const credits = totalCredits(plan);

    content.innerHTML = `
      <span class="eyebrow"><span class="eyebrow-dot"></span>Step 2 of 2 · Review</span>
      <h2 id="modal-title">Confirm your registration</h2>
      <p class="modal-intro">One last look before we save your spot. You can make changes after reviewing.</p>
      <div class="review-student">
        <div>
          <span>Student</span>
          <strong>${escapeHTML(`${profile.firstName} ${profile.lastName}`.trim())}</strong>
          <small>${escapeHTML(profile.studentId)} · ${escapeHTML(profile.email)}</small>
        </div>
        <div>
          <span>Term</span>
          <strong>${escapeHTML(term)}</strong>
          <small>${plan.length} ${plan.length === 1 ? "course" : "courses"} · ${credits} credits</small>
        </div>
      </div>
      <ul class="review-courses">
        ${plan.map((courseId) => {
          const course = getCourse(courseId);
          return `
            <li>
              <span class="course-swatch theme-${course.theme}" aria-hidden="true"></span>
              <span class="review-course-copy"><strong>${escapeHTML(course.code)} · ${escapeHTML(course.title)}</strong><small>${escapeHTML(course.schedule)} · ${escapeHTML(course.instructor)}</small></span>
              <span class="review-course-credits">${course.credits} cr</span>
            </li>
          `;
        }).join("")}
      </ul>
      <div class="review-total">
        <span>Total semester credits</span>
        <strong>${credits}</strong>
      </div>
      <p class="modal-note">By confirming, you agree to Prism University's registration and attendance policies. A confirmation will be available in your profile.</p>
    `;

    actions.innerHTML = `
      <button class="btn btn--ghost" type="button" data-modal-close>Keep editing</button>
      <button class="btn btn--primary" type="button" id="confirm-registration">Confirm registration ${icons.check}</button>
    `;

    openModal();

    const confirmButton = $("#confirm-registration");
    if (confirmButton) confirmButton.focus();
  }

  function completeRegistration() {
    const plan = getPlan();
    if (!plan.length) {
      closeModal();
      showToast("Your plan is empty. Add a course before confirming.", { tone: "warning" });
      return;
    }

    const form = $("#registration-form");
    if (form && !form.checkValidity()) {
      closeModal();
      form.reportValidity();
      return;
    }

    const profile = getFormProfile();
    const term = $("#term")?.value || DATA.terms[0];
    const now = new Date().toISOString();
    const records = getRegistered();
    plan.forEach((courseId) => {
      if (!records.some((record) => record.courseId === courseId)) {
        records.push({
          courseId,
          term,
          status: "Enrolled",
          registeredAt: now
        });
      }
    });

    saveRegistered(records);
    saveProfile(profile);
    savePlan([]);
    buildPlanTable();
    buildCurrentEnrollmentTable();

    const credits = totalCredits(plan);
    const confirmationNumber = `PR-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const content = $("#modal-content");
    const actions = $("#modal-actions");
    if (!content || !actions) {
      showToast("Registration complete. Your schedule is ready.");
      return;
    }

    content.innerHTML = `
      <div class="success-view">
        <span class="success-mark">${icons.check}</span>
        <span class="eyebrow"><span class="eyebrow-dot"></span>Registration confirmed</span>
        <h2 id="modal-title">You're all set, ${escapeHTML(profile.firstName)}!</h2>
        <p>Your place in ${plan.length} ${plan.length === 1 ? "course" : "courses"} is confirmed for ${escapeHTML(term)}. We've saved ${credits} credits to your schedule.</p>
        <div class="confirmation-code">
          <span>Confirmation number</span>
          <strong>${confirmationNumber}</strong>
        </div>
        <p class="modal-note">Your updated schedule is available on your profile and in the current enrollment table below.</p>
      </div>
    `;
    actions.innerHTML = `
      <button class="btn btn--ghost" type="button" data-modal-close>Stay on this page</button>
      <a class="btn btn--primary" href="profile.html">View my schedule ${icons.arrow}</a>
    `;

    const closeButton = actions.querySelector("[data-modal-close]");
    if (closeButton) closeButton.focus();
    showToast("Registration confirmed. Your schedule has been updated.");
  }

  function initModal() {
    const modal = $("#confirmation-modal");
    if (!modal) return;

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-modal-close]")) {
        closeModal();
        return;
      }
      if (event.target.closest("#confirm-registration")) {
        completeRegistration();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (modal.hidden || !modal.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        closeModal();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', modal)
        .filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function openModal() {
    const modal = $("#confirmation-modal");
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    window.requestAnimationFrame(() => modal.classList.add("is-open"));
    const panel = $(".modal__panel", modal);
    if (panel) {
      panel.focus({ preventScroll: true });
    }
  }

  function closeModal() {
    const modal = $("#confirmation-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    window.setTimeout(() => {
      modal.hidden = true;
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus({ preventScroll: true });
      }
    }, 200);
  }

  function initProfilePage() {
    const profile = getProfile();
    const records = getRegistered();
    const credits = records.reduce((sum, record) => {
      const course = getCourse(record.courseId);
      return sum + (course ? course.credits : 0);
    }, 0);

    const setText = (selector, value) => {
      const element = $(selector);
      if (element) element.textContent = value;
    };

    setText("#profile-initials", getInitials(profile));
    setText("#profile-name", `${profile.firstName} ${profile.lastName}`.trim());
    setText("#profile-program", profile.program);
    setText("#profile-program-detail", profile.program);
    setText("#profile-email", profile.email);
    setText("#profile-student-id", profile.studentId);
    setText("#profile-student-id-detail", profile.studentId);
    setText("#profile-year", profile.year);
    setText("#profile-advisor", profile.advisor);
    setText("#stat-credits", String(credits));
    setText("#stat-courses", String(records.length));
    setText("#stat-status", records.length ? "On track" : "Getting started");
    setText("#registered-count", String(records.length));
    setText("#semester-credit-label", `${credits} / 18 credits`);

    const progress = Math.min(100, Math.round((credits / 18) * 100));
    const ring = $("#progress-ring");
    if (ring) ring.style.setProperty("--progress", String(progress));
    setText("#progress-value", `${progress}%`);

    renderProfileTable();

    const printButton = $("#print-schedule");
    if (printButton) printButton.addEventListener("click", () => window.print());

    const tableBody = $("#profile-course-body");
    if (tableBody) {
      tableBody.addEventListener("click", (event) => {
        const dropButton = event.target.closest("[data-drop-course]");
        if (!dropButton) return;
        const course = getCourse(dropButton.dataset.dropCourse);
        const updated = getRegistered().filter((record) => record.courseId !== dropButton.dataset.dropCourse);
        saveRegistered(updated);
        updateProfileStats();
        renderProfileTable();
        if (course) showToast(`${course.code} was dropped from your schedule.`, { tone: "warning" });
      });
    }
  }

  function updateProfileStats() {
    const records = getRegistered();
    const credits = records.reduce((sum, record) => {
      const course = getCourse(record.courseId);
      return sum + (course ? course.credits : 0);
    }, 0);
    const setText = (selector, value) => {
      const element = $(selector);
      if (element) element.textContent = value;
    };
    const progress = Math.min(100, Math.round((credits / 18) * 100));
    setText("#stat-credits", String(credits));
    setText("#stat-courses", String(records.length));
    setText("#stat-status", records.length ? "On track" : "Getting started");
    setText("#registered-count", String(records.length));
    setText("#semester-credit-label", `${credits} / 18 credits`);
    setText("#progress-value", `${progress}%`);
    const ring = $("#progress-ring");
    if (ring) ring.style.setProperty("--progress", String(progress));
  }

  function renderProfileTable() {
    const body = $("#profile-course-body");
    if (!body) return;
    const records = getRegistered();

    if (!records.length) {
      body.innerHTML = `
        <tr class="empty-row">
          <td colspan="6">
            <div class="table-empty">
              <span class="table-empty__icon">${icons.calendar}</span>
              <strong>No courses on your schedule yet.</strong>
              <span>Find a course that sparks something and register in a few clicks.</span>
              <a class="btn btn--small btn--primary" href="catalog.html">Browse courses ${icons.arrow}</a>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    body.innerHTML = records.map((record) => {
      const course = getCourse(record.courseId);
      return `
        <tr>
          <td data-label="Course">
            <div class="table-course">
              <span class="course-swatch theme-${course.theme}" aria-hidden="true"></span>
              <span><strong>${escapeHTML(course.code)}</strong><small>${escapeHTML(course.title)}</small></span>
            </div>
          </td>
          <td data-label="Schedule"><span class="table-schedule">${escapeHTML(course.schedule)}</span><small>${escapeHTML(course.location)}</small></td>
          <td data-label="Instructor">${escapeHTML(course.instructor)}</td>
          <td data-label="Credits">${course.credits}</td>
          <td data-label="Status"><span class="status-badge status-badge--enrolled">${icons.check} ${escapeHTML(record.status || "Enrolled")}</span></td>
          <td class="table-action" data-label="Action">
            <button class="btn btn--tiny btn--danger-ghost" type="button" data-drop-course="${course.id}" aria-label="Drop ${escapeHTML(course.code)}">${icons.trash} Drop</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function initGlobalInteractions() {
    document.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-course-add]");
      if (!addButton) return;
      const result = addToPlan(addButton.dataset.courseAdd);
      if (!result.ok) {
        showToast(result.message, { tone: "warning" });
        return;
      }
      showToast(result.message, { actionText: "View plan", href: "registration.html" });
      if (PAGE === "home") renderFeaturedCourses();
      if (PAGE === "catalog") renderCatalog();
    });
  }

  function init() {
    ensureSeedData();
    initNavigation();
    updatePlanBadge();
    updateFooterYear();
    initGlobalInteractions();

    if (PAGE === "home") initHomePage();
    if (PAGE === "catalog") initCatalogPage();
    if (PAGE === "registration") initRegistrationPage();
    if (PAGE === "profile") initProfilePage();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
