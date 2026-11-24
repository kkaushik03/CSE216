/**
 * Apex University Course Registration System
 * Main Application Logic (Router, Search, Filter, Registration, Timetable, Profile)
 */

(function () {
  "use strict";

  // Application State
  const AppState = {
    courses: [],
    student: null,
    registeredCourses: [],
    activeView: "home",
    selectedCourseForDrop: null,
    selectedCourseForDetails: null,
    filters: {
      search: "",
      department: "all",
      level: "all",
      credits: "all",
      modality: "all",
      availability: "all",
      sort: "code-asc"
    }
  };

  // Local Storage Keys
  const STORAGE_KEYS = {
    STUDENT: "apex_univ_student",
    REGISTERED: "apex_univ_registered"
  };

  /**
   * Initialize State from LocalStorage or Defaults
   */
  function initState() {
    AppState.courses = COURSES_DATA.slice();

    // Load student data
    try {
      const savedStudent = localStorage.getItem(STORAGE_KEYS.STUDENT);
      AppState.student = savedStudent ? JSON.parse(savedStudent) : Object.assign({}, DEFAULT_STUDENT);
    } catch (e) {
      AppState.student = Object.assign({}, DEFAULT_STUDENT);
    }

    // Load registered courses
    try {
      const savedRegistered = localStorage.getItem(STORAGE_KEYS.REGISTERED);
      AppState.registeredCourses = savedRegistered ? JSON.parse(savedRegistered) : DEFAULT_REGISTERED_COURSES.slice();
    } catch (e) {
      AppState.registeredCourses = DEFAULT_REGISTERED_COURSES.slice();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(AppState.student));
      localStorage.setItem(STORAGE_KEYS.REGISTERED, JSON.stringify(AppState.registeredCourses));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  /**
   * Helper Calculations
   */
  function getCourseById(id) {
    return AppState.courses.find(c => c.id === id);
  }

  function getCourseByCode(code) {
    if (!code) return null;
    const clean = code.trim().toLowerCase().replace(/\s+/g, "");
    return AppState.courses.find(c => c.code.toLowerCase().replace(/\s+/g, "") === clean);
  }

  function isCourseRegistered(courseId) {
    return AppState.registeredCourses.some(r => r.courseId === courseId);
  }

  function getRegisteredCourseObjects() {
    return AppState.registeredCourses
      .map(reg => {
        const course = getCourseById(reg.courseId);
        return course ? { ...course, ...reg } : null;
      })
      .filter(Boolean);
  }

  function getTotalEnrolledCredits() {
    return getRegisteredCourseObjects().reduce((sum, c) => sum + (c.credits || 0), 0);
  }

  function isFullTime() {
    return getTotalEnrolledCredits() >= (AppState.student.minFullTimeCredits || 12);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  /**
   * Schedule Conflict Detector
   * Checks if candidateCourse has any overlapping day & time slot with enrolled courses
   */
  function checkScheduleConflict(candidateCourse) {
    if (!candidateCourse || !candidateCourse.days) return null;

    const enrolled = getRegisteredCourseObjects();
    for (const reg of enrolled) {
      if (reg.id === candidateCourse.id) continue;

      // Check if they share any days
      const commonDays = candidateCourse.days.filter(d => reg.days && reg.days.includes(d));
      if (commonDays.length > 0) {
        // Check time interval overlap: (startA < endB) and (startB < endA)
        const startA = candidateCourse.startMinutes;
        const endA = candidateCourse.endMinutes;
        const startB = reg.startMinutes;
        const endB = reg.endMinutes;

        if (startA < endB && startB < endA) {
          return {
            conflictingCourse: reg,
            sharedDays: commonDays,
            message: `Time overlap on ${commonDays.join(", ")} with ${reg.code} (${reg.schedule})`
          };
        }
      }
    }
    return null;
  }

  /**
   * =========================================================================
   * SPA ROUTER & VIEW SWITCHER
   * =========================================================================
   */
  function navigateTo(pageId) {
    const validPages = ["home", "catalog", "registration", "profile"];
    if (!validPages.includes(pageId)) {
      pageId = "home";
    }

    AppState.activeView = pageId;

    // Update URL hash without forcing jump
    if (window.location.hash !== "#" + pageId) {
      window.location.hash = pageId;
    }

    // Toggle view sections
    document.querySelectorAll(".page-view").forEach(view => {
      view.classList.remove("active");
    });
    const targetView = document.getElementById("view-" + pageId);
    if (targetView) {
      targetView.classList.add("active");
    }

    // Update active nav links
    document.querySelectorAll(".nav-link").forEach(link => {
      const page = link.getAttribute("data-page");
      if (page === pageId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Close mobile nav drawer if open
    const drawer = document.getElementById("mobile-nav-drawer");
    if (drawer) {
      drawer.classList.remove("open");
    }

    // Smooth scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Refresh view-specific content
    renderAllViews();
  }

  function handleHashChange() {
    const hash = window.location.hash.replace("#", "").trim();
    if (hash) {
      navigateTo(hash);
    } else {
      navigateTo("home");
    }
  }

  /**
   * =========================================================================
   * UI RENDERERS
   * =========================================================================
   */
  function renderAllViews() {
    renderGlobalStats();
    renderHomeView();
    renderCatalogView();
    renderRegistrationView();
    renderProfileView();
  }

  /**
   * Global Stats (Navbar counter, Avatar)
   */
  function renderGlobalStats() {
    const totalCredits = getTotalEnrolledCredits();
    const count = AppState.registeredCourses.length;

    // Navbar pills
    const navCredits = document.getElementById("nav-reg-credits");
    const navCount = document.getElementById("nav-reg-count");
    if (navCredits) navCredits.textContent = totalCredits;
    if (navCount) navCount.textContent = count;

    // Nav Avatar bubble
    const avatarBubble = document.getElementById("nav-avatar-bubble");
    if (avatarBubble && AppState.student) {
      avatarBubble.textContent = AppState.student.avatarInitials || "AR";
    }
  }

  /**
   * Home View Renderer
   */
  function renderHomeView() {
    const student = AppState.student;
    const totalCredits = getTotalEnrolledCredits();
    const regList = getRegisteredCourseObjects();

    // Student greeting
    const studentNameEl = document.getElementById("home-student-name");
    if (studentNameEl) studentNameEl.textContent = student.name;

    // Stat cards
    const statCourses = document.getElementById("home-stat-courses");
    const statCredits = document.getElementById("home-stat-credits");
    const statStatus = document.getElementById("home-stat-status");
    if (statCourses) statCourses.textContent = regList.length;
    if (statCredits) statCredits.textContent = totalCredits;
    if (statStatus) {
      statStatus.textContent = isFullTime() ? "Full-Time Status (>= 12 cr)" : "Part-Time Status (< 12 cr)";
      statStatus.style.color = isFullTime() ? "var(--success)" : "var(--warning)";
    }

    // Schedule preview list
    const schedulePreview = document.getElementById("home-schedule-preview");
    if (schedulePreview) {
      if (regList.length === 0) {
        schedulePreview.innerHTML = `
          <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); background: #f8fafc; border-radius: var(--radius-md);">
            <p style="margin-bottom: 0.75rem;">No courses registered for Fall 2026 yet.</p>
            <button class="btn btn-sm btn-primary nav-trigger" data-target="catalog">Browse Course Catalog</button>
          </div>
        `;
      } else {
        schedulePreview.innerHTML = regList.map(c => `
          <div class="home-schedule-item" style="border-left-color: ${c.color || 'var(--primary)'};">
            <div class="schedule-item-main">
              <span class="schedule-item-code" style="color: ${c.color || 'var(--primary)'};">${c.code}</span>
              <span class="schedule-item-title">${c.title}</span>
              <div class="schedule-item-time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>${c.schedule} &bull; ${c.location}</span>
              </div>
            </div>
            <div style="text-align: right;">
              <span class="credit-pill">${c.credits} Credits</span>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">${c.gradeOption || 'Letter Grade'}</div>
            </div>
          </div>
        `).join("");
      }
    }

    // Featured courses grid
    const featuredContainer = document.getElementById("home-featured-cards");
    if (featuredContainer) {
      const featured = AppState.courses.filter(c => c.featured).slice(0, 4);
      featuredContainer.innerHTML = featured.map(course => createCourseCardHtml(course)).join("");
      attachCardListeners(featuredContainer);
    }
  }

  /**
   * Course Card HTML Generator
   */
  function createCourseCardHtml(course) {
    const isReg = isCourseRegistered(course.id);
    const seatsLeft = Math.max(0, course.capacity - course.enrolled);
    const fillPercent = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));

    let seatBadge = `<span class="seat-status-tag status-open">Open &bull; ${seatsLeft} seats</span>`;
    if (seatsLeft === 0) {
      seatBadge = `<span class="seat-status-tag status-waitlist">Waitlist Open</span>`;
    } else if (seatsLeft <= 10) {
      seatBadge = `<span class="seat-status-tag status-fast">Filling Fast &bull; ${seatsLeft} left</span>`;
    }

    const regBtnHtml = isReg
      ? `<button class="btn btn-sm btn-success card-btn-registered" data-id="${course.id}" title="Already Enrolled">&#10004; Enrolled</button>`
      : `<button class="btn btn-sm btn-primary card-btn-register" data-id="${course.id}">Register</button>`;

    return `
      <div class="course-card" data-course-id="${course.id}">
        <div class="card-top-accent" style="background: ${course.color || 'var(--primary)'};"></div>
        <div class="course-card-body">
          <div class="card-badge-row">
            <span class="dept-pill" style="background: ${course.colorLight || '#eef2ff'}; color: ${course.color || 'var(--primary)'};">${course.deptCode} &bull; ${course.department}</span>
            <span class="credit-pill">${course.credits}.0 cr</span>
          </div>
          <div class="course-card-code">${course.code} &bull; ${course.level}</div>
          <h3 class="course-card-title">${course.title}</h3>
          <p class="course-card-desc">${course.description}</p>
          
          <div class="card-meta-list">
            <div class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>${course.schedule}</span>
            </div>
            <div class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${course.location} (${course.modality})</span>
            </div>
            <div class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>${course.instructor}</span>
            </div>
          </div>

          <div class="capacity-meter-group">
            <div class="capacity-labels">
              <span>Capacity: ${course.enrolled} / ${course.capacity}</span>
              ${seatBadge}
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${fillPercent}%; background: ${course.color || 'var(--primary)'};"></div>
            </div>
          </div>

          <div class="course-card-actions">
            <button class="btn btn-sm btn-outline card-btn-details" data-id="${course.id}">Details</button>
            ${regBtnHtml}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Course Catalog View Renderer
   */
  function renderCatalogView() {
    const container = document.getElementById("catalog-cards-container");
    if (!container) return;

    // Filter and Sort Courses
    const filtered = AppState.courses.filter(course => {
      // Search text
      if (AppState.filters.search) {
        const query = AppState.filters.search.toLowerCase().trim();
        const matchCode = course.code.toLowerCase().includes(query);
        const matchTitle = course.title.toLowerCase().includes(query);
        const matchDept = course.department.toLowerCase().includes(query);
        const matchInst = course.instructor.toLowerCase().includes(query);
        const matchDesc = course.description.toLowerCase().includes(query);
        if (!matchCode && !matchTitle && !matchDept && !matchInst && !matchDesc) {
          return false;
        }
      }

      // Department
      if (AppState.filters.department !== "all" && course.department !== AppState.filters.department) {
        return false;
      }

      // Level
      if (AppState.filters.level !== "all" && course.level !== AppState.filters.level) {
        return false;
      }

      // Credits
      if (AppState.filters.credits !== "all" && course.credits !== parseInt(AppState.filters.credits, 10)) {
        return false;
      }

      // Modality
      if (AppState.filters.modality !== "all" && course.modality !== AppState.filters.modality) {
        return false;
      }

      // Availability
      if (AppState.filters.availability === "open") {
        if (course.enrolled >= course.capacity) return false;
      } else if (AppState.filters.availability === "fast") {
        const left = course.capacity - course.enrolled;
        if (left <= 0 || left > 10) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (AppState.filters.sort) {
        case "code-asc":
          return a.code.localeCompare(b.code);
        case "code-desc":
          return b.code.localeCompare(a.code);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "credits-desc":
          return b.credits - a.credits;
        case "credits-asc":
          return a.credits - b.credits;
        case "seats-desc":
          return (b.capacity - b.enrolled) - (a.capacity - a.enrolled);
        default:
          return 0;
      }
    });

    // Counter updates
    const countVisibleEl = document.getElementById("catalog-visible-count");
    const countTotalEl = document.getElementById("catalog-total-count");
    if (countVisibleEl) countVisibleEl.textContent = filtered.length;
    if (countTotalEl) countTotalEl.textContent = AppState.courses.length;

    // Render Cards
    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">&#128269;</div>
          <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">No Courses Found</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">Try adjusting or clearing your search filters to find what you're looking for.</p>
          <button id="btn-empty-reset" class="btn btn-primary btn-sm">Clear All Filters</button>
        </div>
      `;
      const btnReset = document.getElementById("btn-empty-reset");
      if (btnReset) btnReset.addEventListener("click", resetCatalogFilters);
    } else {
      container.innerHTML = filtered.map(course => createCourseCardHtml(course)).join("");
      attachCardListeners(container);
    }
  }

  function attachCardListeners(parentEl) {
    // Details Buttons
    parentEl.querySelectorAll(".card-btn-details").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const courseId = btn.getAttribute("data-id");
        openCourseDetailsModal(courseId);
      });
    });

    // Register Buttons
    parentEl.querySelectorAll(".card-btn-register").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const courseId = btn.getAttribute("data-id");
        handleDirectRegistration(courseId);
      });
    });

    // Registered Indicator Buttons (clicking takes you to registration table)
    parentEl.querySelectorAll(".card-btn-registered").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        navigateTo("registration");
        showToast("Viewing your registered courses.", "info");
      });
    });
  }

  /**
   * Reset Catalog Filters
   */
  function resetCatalogFilters() {
    AppState.filters = {
      search: "",
      department: "all",
      level: "all",
      credits: "all",
      modality: "all",
      availability: "all",
      sort: "code-asc"
    };

    const searchInput = document.getElementById("catalog-search");
    const clearBtn = document.getElementById("search-clear-btn");
    const filterDept = document.getElementById("filter-dept");
    const filterLevel = document.getElementById("filter-level");
    const filterCredits = document.getElementById("filter-credits");
    const filterModality = document.getElementById("filter-modality");
    const filterAvail = document.getElementById("filter-availability");
    const filterSort = document.getElementById("filter-sort");

    if (searchInput) searchInput.value = "";
    if (clearBtn) clearBtn.classList.remove("visible");
    if (filterDept) filterDept.value = "all";
    if (filterLevel) filterLevel.value = "all";
    if (filterCredits) filterCredits.value = "all";
    if (filterModality) filterModality.value = "all";
    if (filterAvail) filterAvail.value = "all";
    if (filterSort) filterSort.value = "code-asc";

    renderCatalogView();
    showToast("Filters reset to default.", "info");
  }

  /**
   * =========================================================================
   * REGISTRATION VIEW RENDERER & INTERACTION
   * =========================================================================
   */
  function renderRegistrationView() {
    populateCourseSelectDropdown();
    renderRegisteredCoursesTable();
    renderWeeklyTimetable();
  }

  function populateCourseSelectDropdown() {
    const select = document.getElementById("reg-course-select");
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="">-- Choose a course from catalog --</option>';

    // Sort by code
    const sorted = AppState.courses.slice().sort((a, b) => a.code.localeCompare(b.code));

    sorted.forEach(c => {
      const isReg = isCourseRegistered(c.id);
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.code} - ${c.title} (${c.credits} cr)${isReg ? " [ENROLLED]" : ""}`;
      select.appendChild(opt);
    });

    if (currentVal && getCourseById(currentVal)) {
      select.value = currentVal;
      updateCoursePreview(currentVal);
    } else {
      updateCoursePreview("");
    }
  }

  function updateCoursePreview(courseId) {
    const previewBox = document.getElementById("reg-course-preview");
    const alertConflict = document.getElementById("reg-alert-conflict");
    const alertOverload = document.getElementById("reg-alert-overload");
    const alertAlready = document.getElementById("reg-alert-already");

    if (!previewBox) return;

    // Hide alerts
    if (alertConflict) alertConflict.classList.remove("active");
    if (alertOverload) alertOverload.classList.remove("active");
    if (alertAlready) alertAlready.classList.remove("active");

    if (!courseId) {
      previewBox.classList.remove("active");
      return;
    }

    const course = getCourseById(courseId);
    if (!course) {
      previewBox.classList.remove("active");
      return;
    }

    previewBox.classList.add("active");
    setText("prev-code", course.code);
    setText("prev-credits", `${course.credits} Credits`);
    setText("prev-title", course.title);
    setText("prev-instructor", course.instructor);
    setText("prev-modality", course.modality);
    setText("prev-schedule", course.schedule);
    setText("prev-location", course.location);
    setText("prev-prereqs", course.prerequisites || "None");

    // Validate Statuses
    if (isCourseRegistered(course.id)) {
      if (alertAlready) alertAlready.classList.add("active");
      return;
    }

    // Check conflict
    const conflict = checkScheduleConflict(course);
    if (conflict) {
      if (alertConflict) {
        document.getElementById("reg-conflict-msg").textContent = conflict.message;
        alertConflict.classList.add("active");
      }
    }

    // Check overload
    const currentCredits = getTotalEnrolledCredits();
    if (currentCredits + course.credits > 18) {
      if (alertOverload) {
        document.getElementById("reg-overload-msg").textContent =
          `Adding this course will result in ${currentCredits + course.credits} credits, exceeding the maximum allowed 18.0 credits.`;
        alertOverload.classList.add("active");
      }
    }
  }

  /**
   * Render Registered Courses Data Table
   */
  function renderRegisteredCoursesTable() {
    const tbody = document.getElementById("registered-courses-tbody");
    const emptyMsg = document.getElementById("table-empty-message");
    const totalCredits = getTotalEnrolledCredits();
    const regList = getRegisteredCourseObjects();

    // Badges and summary counters
    const badgeTotal = document.getElementById("badge-total-credits");
    if (badgeTotal) badgeTotal.textContent = totalCredits;

    const summaryCount = document.getElementById("summary-courses-count");
    if (summaryCount) summaryCount.textContent = regList.length;

    const summaryCredits = document.getElementById("summary-credits-count");
    if (summaryCredits) summaryCredits.textContent = totalCredits.toFixed(1);

    const summaryStatus = document.getElementById("summary-academic-status");
    if (summaryStatus) {
      if (isFullTime()) {
        summaryStatus.textContent = "Full-Time Status";
        summaryStatus.style.color = "var(--success)";
      } else {
        summaryStatus.textContent = "Part-Time Status (< 12 cr)";
        summaryStatus.style.color = "var(--warning)";
      }
    }

    if (!tbody) return;

    if (regList.length === 0) {
      tbody.innerHTML = "";
      if (emptyMsg) emptyMsg.style.display = "block";
      return;
    }

    if (emptyMsg) emptyMsg.style.display = "none";

    tbody.innerHTML = regList.map(item => `
      <tr data-course-id="${item.id}">
        <td>
          <span class="table-course-code" style="color: ${item.color || 'var(--primary)'};">${item.code}</span>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${item.deptCode}</div>
        </td>
        <td>
          <div class="table-course-title">${item.title}</div>
          <div class="table-course-sub">${item.modality} &bull; ${item.level}</div>
        </td>
        <td>
          <strong>${item.credits}.0</strong>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${item.schedule}</div>
          <div style="font-size: 0.775rem; color: var(--text-muted);">${item.location}</div>
        </td>
        <td>
          <div>${item.instructor}</div>
        </td>
        <td>
          <select class="table-grade-select" data-course-id="${item.id}" aria-label="Grading option">
            <option value="Letter Grade" ${item.gradeOption === 'Letter Grade' ? 'selected' : ''}>Letter Grade</option>
            <option value="Pass/No Pass" ${item.gradeOption === 'Pass/No Pass' ? 'selected' : ''}>Pass/No Pass</option>
            <option value="Audit" ${item.gradeOption === 'Audit' ? 'selected' : ''}>Audit</option>
          </select>
        </td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 0.4rem; justify-content: center;">
            <button class="btn btn-sm btn-outline btn-table-info" data-id="${item.id}" title="View Details">
              Info
            </button>
            <button class="btn btn-sm btn-danger btn-table-drop" data-id="${item.id}" title="Drop Course">
              Drop
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    // Attach row events
    tbody.querySelectorAll(".btn-table-info").forEach(btn => {
      btn.addEventListener("click", () => {
        openCourseDetailsModal(btn.getAttribute("data-id"));
      });
    });

    tbody.querySelectorAll(".btn-table-drop").forEach(btn => {
      btn.addEventListener("click", () => {
        openDropModal(btn.getAttribute("data-id"));
      });
    });

    tbody.querySelectorAll(".table-grade-select").forEach(sel => {
      sel.addEventListener("change", e => {
        const cId = sel.getAttribute("data-course-id");
        const newGrade = e.target.value;
        const regItem = AppState.registeredCourses.find(r => r.courseId === cId);
        if (regItem) {
          regItem.gradeOption = newGrade;
          saveState();
          showToast(`Grade option updated to ${newGrade}.`, "success");
        }
      });
    });
  }

  /**
   * Render Weekly Schedule Timetable Grid
   */
  function renderWeeklyTimetable() {
    const grid = document.getElementById("weekly-timetable-grid");
    if (!grid) return;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const hours = [
      { label: "08:00 AM", minuteStart: 480 },
      { label: "09:00 AM", minuteStart: 540 },
      { label: "10:00 AM", minuteStart: 600 },
      { label: "11:00 AM", minuteStart: 660 },
      { label: "12:00 PM", minuteStart: 720 },
      { label: "01:00 PM", minuteStart: 780 },
      { label: "02:00 PM", minuteStart: 840 },
      { label: "03:00 PM", minuteStart: 900 },
      { label: "04:00 PM", minuteStart: 960 },
      { label: "05:00 PM", minuteStart: 1020 }
    ];

    const enrolled = getRegisteredCourseObjects();

    let html = `
      <div class="timetable-col-header" style="background: #e2e8f0; font-weight: 800;">Time</div>
    `;
    dayLabels.forEach(d => {
      html += `<div class="timetable-col-header">${d}</div>`;
    });

    hours.forEach(hour => {
      html += `<div class="timetable-time-slot">${hour.label}</div>`;

      days.forEach(day => {
        // Find if any enrolled class falls in this hour slot
        const matchingClasses = enrolled.filter(c => {
          if (!c.days || !c.days.includes(day)) return false;
          // check if class intersects this 60 minute slot
          return c.startMinutes < (hour.minuteStart + 60) && c.endMinutes > hour.minuteStart;
        });

        html += `<div class="timetable-day-cell">`;
        matchingClasses.forEach(c => {
          // only display block on start hour or show compact
          html += `
            <div class="timetable-block" style="background: ${c.color || 'var(--primary)'};" onclick="ApexApp.openCourseDetails('${c.id}')" title="${c.code}: ${c.title} (${c.schedule})">
              <div>${c.code}</div>
              <div class="timetable-block-time">${c.startTime} - ${c.endTime}</div>
              <div class="timetable-block-room">${c.location}</div>
            </div>
          `;
        });
        html += `</div>`;
      });
    });

    grid.innerHTML = html;
  }

  /**
   * Registration Submission Handler
   */
  function handleRegistrationSubmit() {
    const select = document.getElementById("reg-course-select");
    const gradeSelect = document.getElementById("reg-grade-option");

    if (!select || !select.value) {
      showToast("Please choose a course from the dropdown first.", "warning");
      return;
    }

    const courseId = select.value;
    const gradeOption = gradeSelect ? gradeSelect.value : "Letter Grade";

    executeCourseEnrollment(courseId, gradeOption);
  }

  function handleDirectRegistration(courseId) {
    executeCourseEnrollment(courseId, "Letter Grade");
  }

  function executeCourseEnrollment(courseId, gradeOption) {
    const course = getCourseById(courseId);
    if (!course) {
      showToast("Selected course not found.", "danger");
      return;
    }

    // Validation 1: Already Enrolled
    if (isCourseRegistered(course.id)) {
      showToast(`You are already enrolled in ${course.code}.`, "warning");
      return;
    }

    // Validation 2: Credit Overload
    const currentCredits = getTotalEnrolledCredits();
    if (currentCredits + course.credits > 18) {
      showToast(`Cannot register! Exceeds maximum 18.0 term credits limit (currently ${currentCredits} cr).`, "danger");
      return;
    }

    // Validation 3: Schedule Conflict
    const conflict = checkScheduleConflict(course);
    if (conflict) {
      showToast(`Schedule conflict! Overlaps with ${conflict.conflictingCourse.code}.`, "danger");
      // Highlight conflict banner on registration page
      navigateTo("registration");
      const sel = document.getElementById("reg-course-select");
      if (sel) {
        sel.value = courseId;
        updateCoursePreview(courseId);
      }
      return;
    }

    // Execute Enrollment
    const confirmationNumber = "REG-2026-F" + Math.floor(1000 + Math.random() * 9000);
    const registrationRecord = {
      courseId: course.id,
      gradeOption: gradeOption || "Letter Grade",
      registeredAt: new Date().toISOString(),
      confirmationNumber: confirmationNumber
    };

    AppState.registeredCourses.push(registrationRecord);

    // Update course enrollment count
    if (course.enrolled < course.capacity) {
      course.enrolled += 1;
    }

    saveState();
    renderAllViews();

    // Trigger celebratory Confirmation Modal
    openConfirmationModal(course, registrationRecord);
  }

  /**
   * Drop Course Process
   */
  function openDropModal(courseId) {
    const course = getCourseById(courseId);
    if (!course) return;

    AppState.selectedCourseForDrop = course;

    const modal = document.getElementById("drop-modal");
    if (!modal) return;

    const codeTitleEl = document.getElementById("drop-course-code-title");
    const currCreditsEl = document.getElementById("drop-curr-credits");
    const nextCreditsEl = document.getElementById("drop-next-credits");

    const currCredits = getTotalEnrolledCredits();
    const nextCredits = Math.max(0, currCredits - course.credits);

    setText("drop-course-code-title", `${course.code} - ${course.title}`);
    setText("drop-curr-credits", currCredits);
    setText("drop-next-credits", nextCredits);

    modal.classList.add("open");
  }

  function confirmDropCourse() {
    if (!AppState.selectedCourseForDrop) return;

    const course = AppState.selectedCourseForDrop;
    const initialCount = AppState.registeredCourses.length;

    AppState.registeredCourses = AppState.registeredCourses.filter(r => r.courseId !== course.id);

    if (AppState.registeredCourses.length < initialCount && course.enrolled > 0) {
      course.enrolled -= 1;
    }

    saveState();
    renderAllViews();

    closeDropModal();
    showToast(`Successfully dropped ${course.code}.`, "success");
  }

  function closeDropModal() {
    const modal = document.getElementById("drop-modal");
    if (modal) modal.classList.remove("open");
    AppState.selectedCourseForDrop = null;
  }

  /**
   * Confirmation Modal
   */
  function openConfirmationModal(course, regRecord) {
    const modal = document.getElementById("confirmation-modal");
    if (!modal) return;

    setText("confirm-ref-id", `#${regRecord.confirmationNumber}`);
    setText("confirm-course-code", course.code);
    setText("confirm-course-credits", `${course.credits}.0 Credits`);
    setText("confirm-course-title", course.title);
    setText("confirm-schedule", course.schedule);
    setText("confirm-location", course.location);
    setText("confirm-instructor", course.instructor);
    setText("confirm-grading", regRecord.gradeOption);

    const totalCredits = getTotalEnrolledCredits();
    setText("confirm-updated-credits", `${totalCredits} / 18 Credits`);

    modal.classList.add("open");
  }

  function closeConfirmationModal() {
    const modal = document.getElementById("confirmation-modal");
    if (modal) modal.classList.remove("open");
  }

  /**
   * Course Details Modal
   */
  function openCourseDetailsModal(courseId) {
    const course = getCourseById(courseId);
    if (!course) return;

    AppState.selectedCourseForDetails = course;

    const modal = document.getElementById("course-details-modal");
    if (!modal) return;

    setText("details-modal-title", course.title);
    setText("details-code-term", `${course.code} \u2022 ${course.term}`);
    const deptPill = document.getElementById("details-dept-pill");
    if (deptPill) {
      deptPill.textContent = course.department;
      deptPill.style.background = course.colorLight || '#eef2ff';
      deptPill.style.color = course.color || 'var(--primary)';
    }
    setText("details-credits-pill", `${course.credits}.0 Credits`);
    setText("details-level-pill", course.level);

    setText("details-description", course.description);
    setText("details-instructor", `${course.instructor} (${course.instructorTitle || 'Faculty'})`);
    setText("details-email", course.instructorEmail || 'registrar@apex.edu');
    setText("details-schedule", course.schedule);
    setText("details-location", `${course.location} (${course.modality})`);
    setText("details-prereqs", course.prerequisites || "None");

    // Syllabus
    const syllabusList = document.getElementById("details-syllabus-list");
    if (syllabusList) {
      if (course.syllabus && course.syllabus.length > 0) {
        syllabusList.innerHTML = course.syllabus.map(topic => `
          <li style="border-left-color: ${course.color || 'var(--primary)'};">${topic}</li>
        `).join("");
      } else {
        syllabusList.innerHTML = `<li>Standard comprehensive curriculum covering foundational and advanced applied coursework.</li>`;
      }
    }

    // Modal register / drop action button state
    const actionBtn = document.getElementById("details-btn-register-action");
    if (actionBtn) {
      if (isCourseRegistered(course.id)) {
        actionBtn.textContent = "Drop Course";
        actionBtn.className = "btn btn-danger";
      } else {
        actionBtn.textContent = "Register for Course";
        actionBtn.className = "btn btn-primary";
      }
    }

    modal.classList.add("open");
  }

  function closeCourseDetailsModal() {
    const modal = document.getElementById("course-details-modal");
    if (modal) modal.classList.remove("open");
    AppState.selectedCourseForDetails = null;
  }

  /**
   * =========================================================================
   * STUDENT PROFILE VIEW RENDERER
   * =========================================================================
   */
  function renderProfileView() {
    const student = AppState.student;
    if (!student) return;

    const totalEnrolled = getTotalEnrolledCredits();

    // Profile card meta
    const nameEl = document.getElementById("profile-full-name");
    const idEl = document.getElementById("profile-student-id");
    const majorEl = document.getElementById("profile-major-text");
    const avatarBadge = document.getElementById("profile-avatar-badge");

    if (nameEl) nameEl.textContent = student.name;
    if (idEl) idEl.textContent = `#${student.id}`;
    if (majorEl) majorEl.textContent = `${student.degree} in ${student.major}`;
    if (avatarBadge) avatarBadge.textContent = student.avatarInitials || "AR";

    // Info rows
    const infoId = document.getElementById("info-id");
    const infoEmail = document.getElementById("info-email");
    const infoPhone = document.getElementById("info-phone");
    if (infoId) infoId.textContent = student.id;
    if (infoEmail) infoEmail.textContent = student.email;
    if (infoPhone) infoPhone.textContent = student.phone;

    // Degree Progress
    const completed = student.completedCredits || 96;
    const totalReq = student.totalDegreeCredits || 120;
    const overallPct = Math.round((completed / totalReq) * 100);

    const progText = document.getElementById("prog-degree-text");
    const progFill = document.getElementById("prog-degree-fill");
    if (progText) progText.textContent = `${completed} / ${totalReq} Credits (${overallPct}%)`;
    if (progFill) progFill.style.width = `${overallPct}%`;

    const termText = document.getElementById("prog-term-text");
    const termFill = document.getElementById("prog-term-fill");
    if (termText) termText.textContent = `${totalEnrolled} Credits Enrolled (${isFullTime() ? 'Full-Time' : 'Part-Time'})`;
    if (termFill) termFill.style.width = `${Math.min(100, Math.round((totalEnrolled / 18) * 100))}%`;

    // Profile registered courses table
    const profileTbody = document.getElementById("profile-registered-tbody");
    const regList = getRegisteredCourseObjects();

    if (profileTbody) {
      if (regList.length === 0) {
        profileTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No courses currently registered for Fall 2026.</td></tr>`;
      } else {
        profileTbody.innerHTML = regList.map(c => `
          <tr>
            <td><strong style="color: ${c.color || 'var(--primary)'};">${c.code}</strong></td>
            <td>${c.title}</td>
            <td>${c.credits}.0</td>
            <td>${c.schedule}</td>
            <td>${c.instructor}</td>
            <td><span class="seat-status-tag status-open">${c.gradeOption || 'Letter Grade'}</span></td>
          </tr>
        `).join("");
      }
    }

    // Past Academic Terms Accordion
    const accordionContainer = document.getElementById("past-terms-accordion");
    if (accordionContainer && accordionContainer.children.length === 0) {
      accordionContainer.innerHTML = PAST_TERMS.map((termData, idx) => `
        <div class="accordion-item">
          <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
            <div>
              <strong>${termData.term}</strong>
              <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 0.5rem;">(${termData.creditsCompleted} Credits Completed &bull; Term GPA: ${termData.termGpa})</span>
            </div>
            <span>&#9662;</span>
          </div>
          <div class="accordion-body">
            <table class="data-table" style="font-size: 0.825rem;">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Title</th>
                  <th>Credits</th>
                  <th>Grade</th>
                  <th>Grade Points</th>
                </tr>
              </thead>
              <tbody>
                ${termData.courses.map(pc => `
                  <tr>
                    <td><strong>${pc.code}</strong></td>
                    <td>${pc.title}</td>
                    <td>${pc.credits}.0</td>
                    <td><strong style="color: var(--primary);">${pc.grade}</strong></td>
                    <td>${pc.points.toFixed(1)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `).join("");
    }
  }

  /**
   * Edit Profile Modal
   */
  function openEditProfileModal() {
    const modal = document.getElementById("edit-profile-modal");
    if (!modal) return;

    const student = AppState.student;
    document.getElementById("edit-name").value = student.name;
    document.getElementById("edit-email").value = student.email;
    document.getElementById("edit-phone").value = student.phone;

    modal.classList.add("open");
  }

  function saveProfileChanges() {
    const name = document.getElementById("edit-name").value.trim();
    const email = document.getElementById("edit-email").value.trim();
    const phone = document.getElementById("edit-phone").value.trim();

    if (!name || !email) {
      showToast("Name and email are required.", "warning");
      return;
    }

    AppState.student.name = name;
    AppState.student.email = email;
    AppState.student.phone = phone;

    // Recalculate initials
    const parts = name.split(" ");
    if (parts.length >= 2) {
      AppState.student.avatarInitials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else {
      AppState.student.avatarInitials = name.substring(0, 2).toUpperCase();
    }

    saveState();
    renderAllViews();

    const modal = document.getElementById("edit-profile-modal");
    if (modal) modal.classList.remove("open");

    showToast("Profile information updated successfully.", "success");
  }

  /**
   * Reset Demo Data
   */
  function resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.STUDENT);
    localStorage.removeItem(STORAGE_KEYS.REGISTERED);
    initState();
    renderAllViews();
    showToast("Demo data successfully reset to default initial state.", "info");
  }

  /**
   * =========================================================================
   * TOAST NOTIFICATION SYSTEM
   * =========================================================================
   */
  function showToast(message, type = "info", duration = 3500) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "&#8505;";
    if (type === "success") icon = "&#10004;";
    if (type === "danger") icon = "&#9888;";
    if (type === "warning") icon = "&#9888;";

    toast.innerHTML = `
      <span style="font-size: 1.15rem; line-height: 1;">${icon}</span>
      <span style="flex: 1;">${message}</span>
      <button style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 1.1rem; line-height: 1;" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector("button");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        removeToast(toast);
      });
    }

    container.appendChild(toast);

    const timer = setTimeout(() => {
      removeToast(toast);
    }, duration);

    function removeToast(el) {
      clearTimeout(timer);
      el.style.opacity = "0";
      el.style.transform = "translateX(50px)";
      setTimeout(() => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 200);
    }
  }

  /**
   * =========================================================================
   * EVENT LISTENERS INITIALIZATION
   * =========================================================================
   */
  function setupEventListeners() {
    // SPA Hash routing
    window.addEventListener("hashchange", handleHashChange);

    // Nav Links (Desktop & Mobile)
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const page = link.getAttribute("data-page");
        navigateTo(page);
      });
    });

    // Brand link
    const brandLink = document.getElementById("brand-link");
    if (brandLink) {
      brandLink.addEventListener("click", e => {
        e.preventDefault();
        navigateTo("home");
      });
    }

    // Generic nav-triggers
    document.addEventListener("click", e => {
      const trigger = e.target.closest(".nav-trigger");
      if (trigger) {
        e.preventDefault();
        const target = trigger.getAttribute("data-target");
        if (target) navigateTo(target);
      }
    });

    // Mobile Hamburger
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const mobileDrawer = document.getElementById("mobile-nav-drawer");
    if (menuToggle && mobileDrawer) {
      menuToggle.addEventListener("click", () => {
        mobileDrawer.classList.toggle("open");
      });
    }

    // Nav cart badge click
    const navRegPill = document.getElementById("nav-reg-pill");
    if (navRegPill) {
      navRegPill.addEventListener("click", () => {
        navigateTo("registration");
      });
    }

    // Nav profile avatar click
    const navProfileBtn = document.getElementById("nav-profile-btn");
    if (navProfileBtn) {
      navProfileBtn.addEventListener("click", () => {
        navigateTo("profile");
      });
    }

    // Catalog Search Input
    const searchInput = document.getElementById("catalog-search");
    const searchClear = document.getElementById("search-clear-btn");
    if (searchInput) {
      searchInput.addEventListener("input", e => {
        AppState.filters.search = e.target.value;
        if (searchClear) {
          if (e.target.value.length > 0) {
            searchClear.classList.add("visible");
          } else {
            searchClear.classList.remove("visible");
          }
        }
        renderCatalogView();
      });
    }

    if (searchClear && searchInput) {
      searchClear.addEventListener("click", () => {
        searchInput.value = "";
        AppState.filters.search = "";
        searchClear.classList.remove("visible");
        renderCatalogView();
        searchInput.focus();
      });
    }

    // Catalog Filter Dropdowns
    const filterDept = document.getElementById("filter-dept");
    if (filterDept) {
      filterDept.addEventListener("change", e => {
        AppState.filters.department = e.target.value;
        renderCatalogView();
      });
    }

    const filterLevel = document.getElementById("filter-level");
    if (filterLevel) {
      filterLevel.addEventListener("change", e => {
        AppState.filters.level = e.target.value;
        renderCatalogView();
      });
    }

    const filterCredits = document.getElementById("filter-credits");
    if (filterCredits) {
      filterCredits.addEventListener("change", e => {
        AppState.filters.credits = e.target.value;
        renderCatalogView();
      });
    }

    const filterModality = document.getElementById("filter-modality");
    if (filterModality) {
      filterModality.addEventListener("change", e => {
        AppState.filters.modality = e.target.value;
        renderCatalogView();
      });
    }

    const filterAvail = document.getElementById("filter-availability");
    if (filterAvail) {
      filterAvail.addEventListener("change", e => {
        AppState.filters.availability = e.target.value;
        renderCatalogView();
      });
    }

    const filterSort = document.getElementById("filter-sort");
    if (filterSort) {
      filterSort.addEventListener("change", e => {
        AppState.filters.sort = e.target.value;
        renderCatalogView();
      });
    }

    const btnResetFilters = document.getElementById("btn-reset-filters");
    if (btnResetFilters) {
      btnResetFilters.addEventListener("click", resetCatalogFilters);
    }

    // Registration Form Controls
    const regSelect = document.getElementById("reg-course-select");
    if (regSelect) {
      regSelect.addEventListener("change", e => {
        const val = (e && e.target) ? e.target.value : regSelect.value;
        updateCoursePreview(val);
      });
    }

    const btnClearSel = document.getElementById("btn-clear-selection");
    if (btnClearSel && regSelect) {
      btnClearSel.addEventListener("click", () => {
        regSelect.value = "";
        updateCoursePreview("");
      });
    }

    const btnSubmitReg = document.getElementById("btn-submit-registration");
    if (btnSubmitReg) {
      btnSubmitReg.addEventListener("click", handleRegistrationSubmit);
    }

    // Quick Add Input
    const quickAddInput = document.getElementById("quick-add-input");
    const btnQuickAdd = document.getElementById("btn-quick-add");
    if (btnQuickAdd && quickAddInput) {
      const doQuickAdd = () => {
        const val = quickAddInput.value.trim();
        if (!val) {
          showToast("Please enter a course code (e.g. CS 101).", "warning");
          return;
        }
        const course = getCourseByCode(val);
        if (!course) {
          showToast(`Course code "${val}" was not found in catalog.`, "danger");
          return;
        }
        quickAddInput.value = "";
        executeCourseEnrollment(course.id, "Letter Grade");
      };

      btnQuickAdd.addEventListener("click", doQuickAdd);
      quickAddInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          doQuickAdd();
        }
      });
    }

    // Confirmation Modal Events
    const confirmClose = document.getElementById("confirm-modal-close");
    const confirmAnother = document.getElementById("confirm-btn-another");
    const confirmViewSched = document.getElementById("confirm-btn-view-schedule");
    if (confirmClose) confirmClose.addEventListener("click", closeConfirmationModal);
    if (confirmAnother) {
      confirmAnother.addEventListener("click", () => {
        closeConfirmationModal();
        const sel = document.getElementById("reg-course-select");
        if (sel) {
          sel.value = "";
          updateCoursePreview("");
        }
      });
    }
    if (confirmViewSched) {
      confirmViewSched.addEventListener("click", () => {
        closeConfirmationModal();
        navigateTo("registration");
        const table = document.getElementById("registered-courses-table");
        if (table) table.scrollIntoView({ behavior: "smooth" });
      });
    }

    // Drop Modal Events
    const dropClose = document.getElementById("drop-modal-close");
    const dropCancel = document.getElementById("drop-btn-cancel");
    const dropConfirm = document.getElementById("drop-btn-confirm");
    if (dropClose) dropClose.addEventListener("click", closeDropModal);
    if (dropCancel) dropCancel.addEventListener("click", closeDropModal);
    if (dropConfirm) dropConfirm.addEventListener("click", confirmDropCourse);

    // Course Details Modal Events
    const detailsClose = document.getElementById("details-modal-close");
    const detailsCloseBtn = document.getElementById("details-btn-close");
    const detailsActionBtn = document.getElementById("details-btn-register-action");
    if (detailsClose) detailsClose.addEventListener("click", closeCourseDetailsModal);
    if (detailsCloseBtn) detailsCloseBtn.addEventListener("click", closeCourseDetailsModal);
    if (detailsActionBtn) {
      detailsActionBtn.addEventListener("click", () => {
        if (!AppState.selectedCourseForDetails) return;
        const c = AppState.selectedCourseForDetails;
        closeCourseDetailsModal();
        if (isCourseRegistered(c.id)) {
          openDropModal(c.id);
        } else {
          executeCourseEnrollment(c.id, "Letter Grade");
        }
      });
    }

    // Edit Profile Modal Events
    const btnOpenEditProfile = document.getElementById("btn-open-edit-profile");
    const editProfileClose = document.getElementById("edit-profile-close");
    const editProfileCancel = document.getElementById("edit-profile-cancel");
    const editProfileSave = document.getElementById("edit-profile-save");
    if (btnOpenEditProfile) btnOpenEditProfile.addEventListener("click", openEditProfileModal);
    if (editProfileClose) editProfileClose.addEventListener("click", () => {
      document.getElementById("edit-profile-modal").classList.remove("open");
    });
    if (editProfileCancel) editProfileCancel.addEventListener("click", () => {
      document.getElementById("edit-profile-modal").classList.remove("open");
    });
    if (editProfileSave) editProfileSave.addEventListener("click", saveProfileChanges);

    // Demo Data Reset Button
    const btnResetDemo = document.getElementById("btn-reset-demo");
    if (btnResetDemo) btnResetDemo.addEventListener("click", resetDemoData);

    // Close modals on Escape key or clicking backdrop
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closeConfirmationModal();
        closeDropModal();
        closeCourseDetailsModal();
        const editModal = document.getElementById("edit-profile-modal");
        if (editModal) editModal.classList.remove("open");
      }
    });

    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", e => {
        if (e.target === backdrop) {
          backdrop.classList.remove("open");
        }
      });
    });
  }

  /**
   * Public API exposed to window for inline helpers
   */
  window.ApexApp = {
    showToast: showToast,
    openCourseDetails: openCourseDetailsModal,
    navigateTo: navigateTo
  };

  /**
   * App Launch on DOM Loaded
   */
  document.addEventListener("DOMContentLoaded", () => {
    initState();
    setupEventListeners();

    // Check initial URL hash
    const initialHash = window.location.hash.replace("#", "").trim();
    if (initialHash && ["home", "catalog", "registration", "profile"].includes(initialHash)) {
      navigateTo(initialHash);
    } else {
      navigateTo("home");
    }
  });

})();
