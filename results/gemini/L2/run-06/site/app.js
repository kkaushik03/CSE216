/**
 * Horizon University Course Registration System - Application Logic
 * Accessible, Responsive, Single-Data-Flow Architecture
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  // Active modal focus tracking
  _lastFocusedElement: null,

  init() {
    this.setupAccessibilityAnnouncer();
    this.setupMobileNav();
    this.updateHeaderBadge();
    this.setupGlobalModalListeners();

    // Determine current page from body attribute or location
    const pageId = document.body.dataset.page || this.detectPageId();

    switch (pageId) {
      case "home":
        this.initHomePage();
        break;
      case "catalog":
        this.initCatalogPage();
        break;
      case "register":
        this.initRegisterPage();
        break;
      case "profile":
        this.initProfilePage();
        break;
      default:
        break;
    }
  },

  detectPageId() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("catalog")) return "catalog";
    if (path.includes("register")) return "register";
    if (path.includes("profile")) return "profile";
    return "home";
  },

  /* --------------------------------------------------------------------------
     Screen Reader Live Announcer
     -------------------------------------------------------------------------- */
  setupAccessibilityAnnouncer() {
    if (!document.getElementById("live-announcer")) {
      const announcer = document.createElement("div");
      announcer.id = "live-announcer";
      announcer.className = "sr-only";
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      document.body.appendChild(announcer);
    }
  },

  announce(message, priority = "polite") {
    const announcer = document.getElementById("live-announcer");
    if (announcer) {
      announcer.setAttribute("aria-live", priority);
      // Clear and re-populate to ensure screen readers trigger announcement
      announcer.textContent = "";
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }
  },

  /* --------------------------------------------------------------------------
     Toast Notifications
     -------------------------------------------------------------------------- */
  showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      container.setAttribute("aria-label", "Notifications");
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "status");

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === "danger") {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.75rem;">
        ${iconSvg}
        <span style="font-weight:600;font-size:0.925rem;color:var(--text-main);">${this.escapeHtml(message)}</span>
      </div>
      <button type="button" class="btn-close-toast" aria-label="Dismiss notification" style="background:transparent;border:none;cursor:pointer;color:var(--text-muted);padding:4px;display:flex;align-items:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    const closeBtn = toast.querySelector(".btn-close-toast");
    closeBtn.addEventListener("click", () => {
      toast.remove();
    });

    container.appendChild(toast);
    this.announce(message);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 4500);
  },

  /* --------------------------------------------------------------------------
     Navigation & Header
     -------------------------------------------------------------------------- */
  setupMobileNav() {
    const toggleBtn = document.querySelector(".mobile-nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.contains("is-open");
        if (isOpen) {
          navMenu.classList.remove("is-open");
          toggleBtn.setAttribute("aria-expanded", "false");
          toggleBtn.setAttribute("aria-label", "Open navigation menu");
        } else {
          navMenu.classList.add("is-open");
          toggleBtn.setAttribute("aria-expanded", "true");
          toggleBtn.setAttribute("aria-label", "Close navigation menu");
        }
      });

      // Close menu if clicking outside
      document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains("is-open")) {
          navMenu.classList.remove("is-open");
          toggleBtn.setAttribute("aria-expanded", "false");
          toggleBtn.setAttribute("aria-label", "Open navigation menu");
        }
      });
    }
  },

  updateHeaderBadge() {
    const badgeCountEls = document.querySelectorAll(".nav-schedule-badge .badge-count");
    const creditsTotalEls = document.querySelectorAll(".nav-schedule-badge .badge-credits");
    const registered = PortalState.getRegisteredCourses();
    const totalCredits = PortalState.getTotalCredits();

    badgeCountEls.forEach(el => {
      el.textContent = `${registered.length}`;
    });

    creditsTotalEls.forEach(el => {
      el.textContent = `${totalCredits} cr`;
    });
  },

  /* --------------------------------------------------------------------------
     Accessible Confirmation Modal
     -------------------------------------------------------------------------- */
  setupGlobalModalListeners() {
    const overlay = document.getElementById("confirmation-modal");
    if (!overlay) return;

    const closeButtons = overlay.querySelectorAll("[data-close-modal]");
    closeButtons.forEach(btn => {
      btn.addEventListener("click", () => this.closeConfirmationModal());
    });

    // Close on overlay backdrop click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.closeConfirmationModal();
      }
    });

    // Handle Escape key and focus trap
    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("is-active")) return;

      if (e.key === "Escape") {
        e.preventDefault();
        this.closeConfirmationModal();
        return;
      }

      if (e.key === "Tab") {
        const focusable = overlay.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  },

  openConfirmationModal(course, onConfirmCallback) {
    this._lastFocusedElement = document.activeElement;
    const overlay = document.getElementById("confirmation-modal");
    if (!overlay) return;

    const modalTitle = overlay.querySelector("#modal-course-title");
    const modalCode = overlay.querySelector("#modal-course-code");
    const modalCredits = overlay.querySelector("#modal-course-credits");
    const modalInstructor = overlay.querySelector("#modal-course-instructor");
    const modalSchedule = overlay.querySelector("#modal-course-schedule");
    const modalLocation = overlay.querySelector("#modal-course-location");
    const modalPrereqs = overlay.querySelector("#modal-course-prereqs");
    const modalTerm = overlay.querySelector("#modal-course-term");
    const confirmBtn = overlay.querySelector("#modal-confirm-btn");

    if (modalTitle) modalTitle.textContent = course.title;
    if (modalCode) modalCode.textContent = course.code;
    if (modalCredits) modalCredits.textContent = `${course.credits} Credits`;
    if (modalInstructor) modalInstructor.textContent = course.instructor;
    if (modalSchedule) modalSchedule.textContent = course.schedule;
    if (modalLocation) modalLocation.textContent = course.location;
    if (modalPrereqs) modalPrereqs.textContent = course.prereqText || "None";
    if (modalTerm) modalTerm.textContent = course.term;

    // Reset confirm button listener
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener("click", () => {
      if (typeof onConfirmCallback === "function") {
        onConfirmCallback();
      }
      this.closeConfirmationModal();
    });

    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Set focus inside modal
    setTimeout(() => {
      const focusTarget = overlay.querySelector("#modal-confirm-btn") || overlay.querySelector(".modal-close-btn");
      if (focusTarget) focusTarget.focus();
    }, 50);

    this.announce(`Registration confirmation modal opened for ${course.code}: ${course.title}. Press Escape to cancel.`);
  },

  closeConfirmationModal() {
    const overlay = document.getElementById("confirmation-modal");
    if (!overlay) return;

    overlay.classList.remove("is-active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Return focus to the trigger
    if (this._lastFocusedElement && typeof this._lastFocusedElement.focus === "function") {
      this._lastFocusedElement.focus();
    }
  },

  /* --------------------------------------------------------------------------
     HOME PAGE LOGIC
     -------------------------------------------------------------------------- */
  initHomePage() {
    this.renderHomeFeaturedCourses();
    this.updateHomeStats();
  },

  updateHomeStats() {
    const statCourses = document.getElementById("stat-total-courses");
    const statEnrolled = document.getElementById("stat-enrolled-courses");
    const statCredits = document.getElementById("stat-total-credits");

    if (statCourses) statCourses.textContent = `${COURSES_DATA.length}`;
    if (statEnrolled) statEnrolled.textContent = `${PortalState.getRegisteredIds().length}`;
    if (statCredits) statCredits.textContent = `${PortalState.getTotalCredits()} / 18`;
  },

  renderHomeFeaturedCourses() {
    const container = document.getElementById("featured-courses-grid");
    if (!container) return;

    // Pick 3 popular courses (e.g. CS 101, MATH 150, DSGN 120)
    const featured = COURSES_DATA.filter(c => ["cs-101", "math-150", "dsgn-120"].includes(c.id));
    container.innerHTML = featured.map(course => this.generateCourseCardHtml(course)).join("");
    this.attachCourseCardListeners(container);
  },

  /* --------------------------------------------------------------------------
     CATALOG PAGE LOGIC
     -------------------------------------------------------------------------- */
  initCatalogPage() {
    this.renderCatalogCourses();
    this.setupCatalogFilters();
  },

  setupCatalogFilters() {
    const searchInput = document.getElementById("course-search");
    const deptFilter = document.getElementById("filter-dept");
    const levelFilter = document.getElementById("filter-level");
    const modeFilter = document.getElementById("filter-mode");
    const termFilter = document.getElementById("filter-term");
    const resetBtn = document.getElementById("btn-reset-filters");

    const applyFilters = () => {
      const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
      const dept = deptFilter ? deptFilter.value : "all";
      const level = levelFilter ? levelFilter.value : "all";
      const mode = modeFilter ? modeFilter.value : "all";
      const term = termFilter ? termFilter.value : "all";

      const filtered = COURSES_DATA.filter(course => {
        // Search query
        if (searchTerm) {
          const matchCode = course.code.toLowerCase().includes(searchTerm);
          const matchTitle = course.title.toLowerCase().includes(searchTerm);
          const matchInstructor = course.instructor.toLowerCase().includes(searchTerm);
          const matchDesc = course.description.toLowerCase().includes(searchTerm);
          if (!matchCode && !matchTitle && !matchInstructor && !matchDesc) return false;
        }

        // Department
        if (dept !== "all" && course.deptKey !== dept) return false;

        // Level
        if (level !== "all" && course.level.toString() !== level) return false;

        // Mode
        if (mode !== "all" && course.mode !== mode) return false;

        // Term
        if (term !== "all" && course.term !== term) return false;

        return true;
      });

      this.renderCatalogCourses(filtered);
    };

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (deptFilter) deptFilter.addEventListener("change", applyFilters);
    if (levelFilter) levelFilter.addEventListener("change", applyFilters);
    if (modeFilter) modeFilter.addEventListener("change", applyFilters);
    if (termFilter) termFilter.addEventListener("change", applyFilters);

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (deptFilter) deptFilter.value = "all";
        if (levelFilter) levelFilter.value = "all";
        if (modeFilter) modeFilter.value = "all";
        if (termFilter) termFilter.value = "all";
        this.renderCatalogCourses(COURSES_DATA);
        this.announce("Catalog filters have been reset. Showing all courses.");
        if (searchInput) searchInput.focus();
      });
    }
  },

  renderCatalogCourses(courses = COURSES_DATA) {
    const container = document.getElementById("catalog-courses-grid");
    const countDisplay = document.getElementById("results-count-display");
    if (!container) return;

    if (countDisplay) {
      countDisplay.textContent = `Showing ${courses.length} of ${COURSES_DATA.length} Courses`;
    }
    this.announce(`Showing ${courses.length} courses matching your criteria.`);

    if (courses.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--bg-surface-alt); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">No Courses Match Your Search</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem auto;">Try loosening your filter criteria or searching with a different keyword like "CS", "Calculus", or "Design".</p>
          <button type="button" class="btn btn-primary" onclick="document.getElementById('btn-reset-filters').click();">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = courses.map(course => this.generateCourseCardHtml(course)).join("");
    this.attachCourseCardListeners(container);
  },

  /* --------------------------------------------------------------------------
     Course Card Generator & Event Handlers
     -------------------------------------------------------------------------- */
  generateCourseCardHtml(course) {
    const isEnrolled = PortalState.isRegistered(course.id);
    const seatsRemaining = course.capacity - course.enrolled;
    const fillPercent = Math.round((course.enrolled / course.capacity) * 100);

    let seatClass = "seats-fill-open";
    let seatStatusBadge = `<span class="badge badge-open">Open Seats (${seatsRemaining} left)</span>`;
    if (seatsRemaining <= 0) {
      seatClass = "seats-fill-full";
      seatStatusBadge = `<span class="badge badge-full">Class Full</span>`;
    } else if (seatsRemaining <= 5) {
      seatClass = "seats-fill-warn";
      seatStatusBadge = `<span class="badge badge-waitlist">Waitlist Available (${seatsRemaining} left)</span>`;
    }

    return `
      <article class="course-card theme-${course.theme}" id="card-${course.id}" aria-labelledby="title-${course.id}">
        <div class="card-header-bar">
          <div class="course-code-wrap">
            <span class="course-code">${this.escapeHtml(course.code)}</span>
            <span class="badge badge-${course.theme}">${this.escapeHtml(course.dept)}</span>
          </div>
          <span class="badge" style="background:#f1f5f9;color:#334155;font-weight:700;">${course.credits} Credits</span>
        </div>

        <div class="card-body">
          <h3 class="course-title" id="title-${course.id}">${this.escapeHtml(course.title)}</h3>
          <p class="course-description">${this.escapeHtml(course.description)}</p>

          <div class="seats-progress-wrap" aria-label="Course enrollment capacity: ${course.enrolled} out of ${course.capacity} seats filled.">
            <div class="seats-label-row">
              <span>Enrollment: <strong>${course.enrolled} / ${course.capacity}</strong></span>
              <span>${seatStatusBadge}</span>
            </div>
            <div class="seats-meter" role="progressbar" aria-valuenow="${course.enrolled}" aria-valuemin="0" aria-valuemax="${course.capacity}">
              <div class="seats-fill ${seatClass}" style="width: ${fillPercent}%;"></div>
            </div>
          </div>

          <ul class="course-meta-list">
            <li class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span><strong>Instructor:</strong> ${this.escapeHtml(course.instructor)}</span>
            </li>
            <li class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span><strong>Schedule:</strong> ${this.escapeHtml(course.schedule)}</span>
            </li>
            <li class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span><strong>Location:</strong> ${this.escapeHtml(course.location)} (${this.escapeHtml(course.mode)})</span>
            </li>
            <li class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span><strong>Prerequisites:</strong> ${this.escapeHtml(course.prereqText)}</span>
            </li>
          </ul>
        </div>

        <div class="card-actions">
          <span style="font-size:0.8rem;font-weight:700;color:var(--text-subtle);">${this.escapeHtml(course.term)}</span>
          ${
            isEnrolled
              ? `<div style="display:flex;align-items:center;gap:0.5rem;">
                   <span class="badge badge-enrolled">✓ Enrolled</span>
                   <button type="button" class="btn btn-danger btn-sm btn-action-drop" data-course-id="${course.id}" aria-label="Drop ${this.escapeHtml(course.code)}">
                     Drop
                   </button>
                 </div>`
              : `<button type="button" class="btn btn-primary btn-sm btn-action-register" data-course-id="${course.id}" aria-label="Register for ${this.escapeHtml(course.code)}: ${this.escapeHtml(course.title)}">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                   Register Course
                 </button>`
          }
        </div>
      </article>
    `;
  },

  attachCourseCardListeners(container) {
    // Register buttons
    const regButtons = container.querySelectorAll(".btn-action-register");
    regButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const courseId = btn.getAttribute("data-course-id");
        const course = COURSES_DATA.find(c => c.id === courseId);
        if (!course) return;

        // Check credit limit before opening confirmation
        const currentCredits = PortalState.getTotalCredits();
        if (currentCredits + course.credits > INITIAL_STUDENT.maxCreditsPerTerm) {
          this.showToast(
            `Cannot add ${course.code}: Adding ${course.credits} credits exceeds maximum term limit (${INITIAL_STUDENT.maxCreditsPerTerm} credits).`,
            "danger"
          );
          return;
        }

        // Open Confirmation Modal
        this.openConfirmationModal(course, () => {
          const result = PortalState.addCourse(courseId);
          if (result.success) {
            this.showToast(`Successfully registered for ${course.code}: ${course.title}!`, "success");
            this.updateHeaderBadge();
            // Re-render card or catalog
            if (document.body.dataset.page === "catalog") {
              this.renderCatalogCourses();
            } else if (document.body.dataset.page === "home") {
              this.renderHomeFeaturedCourses();
              this.updateHomeStats();
            }
          } else {
            this.showToast(result.reason, "danger");
          }
        });
      });
    });

    // Drop buttons
    const dropButtons = container.querySelectorAll(".btn-action-drop");
    dropButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const courseId = btn.getAttribute("data-course-id");
        const course = COURSES_DATA.find(c => c.id === courseId);
        if (!course) return;

        const result = PortalState.dropCourse(courseId);
        if (result.success) {
          this.showToast(`Dropped ${course.code} from your registered courses.`, "warning");
          this.updateHeaderBadge();
          if (document.body.dataset.page === "catalog") {
            this.renderCatalogCourses();
          } else if (document.body.dataset.page === "home") {
            this.renderHomeFeaturedCourses();
            this.updateHomeStats();
          }
        }
      });
    });
  },

  /* --------------------------------------------------------------------------
     REGISTRATION PAGE LOGIC
     -------------------------------------------------------------------------- */
  initRegisterPage() {
    this.populateCourseDropdown();
    this.renderRegisteredTable();
    this.updateCreditMeter();
    this.setupRegistrationForm();
  },

  populateCourseDropdown() {
    const select = document.getElementById("select-course");
    if (!select) return;

    // Filter to courses not yet registered
    const registeredIds = PortalState.getRegisteredIds();
    const available = COURSES_DATA.filter(c => !registeredIds.includes(c.id));

    select.innerHTML = '<option value="">-- Choose a course to add --</option>';
    available.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = `${c.code}: ${c.title} (${c.credits} Credits, ${c.term})`;
      select.appendChild(option);
    });
  },

  setupRegistrationForm() {
    const form = document.getElementById("course-registration-form");
    const selectCourse = document.getElementById("select-course");
    const errorContainer = document.getElementById("form-alert-container");

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const selectedId = selectCourse ? selectCourse.value : "";
      if (!selectedId) {
        if (errorContainer) {
          errorContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
              <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div><strong>Selection Required:</strong> Please select a course from the dropdown menu to proceed.</div>
            </div>
          `;
          selectCourse.setAttribute("aria-invalid", "true");
          selectCourse.focus();
        }
        return;
      }

      if (errorContainer) {
        errorContainer.innerHTML = "";
        selectCourse.removeAttribute("aria-invalid");
      }

      const course = COURSES_DATA.find(c => c.id === selectedId);
      if (!course) return;

      // Check credit limit before opening modal
      const currentCredits = PortalState.getTotalCredits();
      if (currentCredits + course.credits > INITIAL_STUDENT.maxCreditsPerTerm) {
        if (errorContainer) {
          errorContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
              <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div><strong>Credit Limit Exceeded:</strong> Adding ${course.code} (${course.credits} credits) would bring your total to ${currentCredits + course.credits} credits, exceeding the maximum term limit of ${INITIAL_STUDENT.maxCreditsPerTerm} credits.</div>
            </div>
          `;
          this.announce(`Error: Course exceeds maximum credit limit of ${INITIAL_STUDENT.maxCreditsPerTerm}.`, "assertive");
        }
        return;
      }

      // Open accessible Confirmation Modal
      this.openConfirmationModal(course, () => {
        const result = PortalState.addCourse(selectedId);
        if (result.success) {
          this.showToast(`Successfully registered for ${course.code}: ${course.title}!`, "success");
          this.populateCourseDropdown();
          this.renderRegisteredTable();
          this.updateCreditMeter();
          this.updateHeaderBadge();
          if (selectCourse) selectCourse.value = "";
        } else {
          this.showToast(result.reason, "danger");
        }
      });
    });
  },

  updateCreditMeter() {
    const currentCredits = PortalState.getTotalCredits();
    const maxCredits = INITIAL_STUDENT.maxCreditsPerTerm;
    const minCredits = INITIAL_STUDENT.minFullTimeCredits;
    const percent = Math.min(Math.round((currentCredits / maxCredits) * 100), 100);

    const countEl = document.getElementById("credit-meter-count");
    const barEl = document.getElementById("credit-meter-fill");
    const statusTextEl = document.getElementById("credit-status-text");

    if (countEl) countEl.textContent = `${currentCredits}`;
    if (barEl) {
      barEl.style.width = `${percent}%`;
      barEl.setAttribute("aria-valuenow", currentCredits);
    }

    if (statusTextEl) {
      if (currentCredits < minCredits) {
        statusTextEl.innerHTML = `<span style="color:var(--warning);">Part-time Status (${minCredits - currentCredits} more credits needed for full-time)</span>`;
      } else if (currentCredits <= 16) {
        statusTextEl.innerHTML = `<span style="color:var(--success);">Full-time Status (Good Academic Load)</span>`;
      } else if (currentCredits <= maxCredits) {
        statusTextEl.innerHTML = `<span style="color:var(--dept-econ-text);">Heavy Load (${maxCredits - currentCredits} credits remaining)</span>`;
      } else {
        statusTextEl.innerHTML = `<span style="color:var(--danger);">Over Maximum Limit (${maxCredits} credits max)</span>`;
      }
    }
  },

  renderRegisteredTable() {
    const tbody = document.getElementById("registered-courses-tbody");
    const tfoot = document.getElementById("registered-courses-tfoot");
    const emptyState = document.getElementById("registered-empty-state");
    const tableWrap = document.getElementById("registered-table-wrapper");

    if (!tbody) return;

    const registered = PortalState.getRegisteredCourses();
    const totalCredits = PortalState.getTotalCredits();

    if (registered.length === 0) {
      if (tableWrap) tableWrap.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (tableWrap) tableWrap.style.display = "block";
    if (emptyState) emptyState.style.display = "none";

    tbody.innerHTML = registered.map(course => `
      <tr id="row-${course.id}">
        <th scope="row" style="font-weight:700;color:var(--text-main);">
          <span class="badge badge-${course.theme}" style="margin-right:0.35rem;">${this.escapeHtml(course.code)}</span>
        </th>
        <td>
          <div style="font-weight:700;color:var(--text-main);">${this.escapeHtml(course.title)}</div>
          <div style="font-size:0.8rem;color:var(--text-subtle);">${this.escapeHtml(course.term)} &bull; ${this.escapeHtml(course.location)}</div>
        </td>
        <td>${this.escapeHtml(course.dept)}</td>
        <td>${this.escapeHtml(course.instructor)}</td>
        <td>
          <span style="display:inline-flex;align-items:center;gap:0.25rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${this.escapeHtml(course.schedule)}
          </span>
        </td>
        <td style="font-weight:700;text-align:center;">${course.credits}</td>
        <td>
          <span class="badge badge-enrolled">Enrolled</span>
        </td>
        <td style="text-align:right;">
          <button type="button" class="btn btn-danger btn-sm btn-drop-row" data-course-id="${course.id}" aria-label="Drop course ${this.escapeHtml(course.code)}: ${this.escapeHtml(course.title)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Drop
          </button>
        </td>
      </tr>
    `).join("");

    if (tfoot) {
      tfoot.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:right;font-weight:700;">Total Registered Term Credits:</td>
          <td style="text-align:center;font-weight:800;font-size:1.05rem;color:var(--primary-700);">${totalCredits} cr</td>
          <td colspan="2" style="font-size:0.85rem;color:var(--text-muted);">${registered.length} course${registered.length === 1 ? "" : "s"} scheduled</td>
        </tr>
      `;
    }

    // Attach Drop Button Handlers
    const dropButtons = tbody.querySelectorAll(".btn-drop-row");
    dropButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const courseId = btn.getAttribute("data-course-id");
        const course = COURSES_DATA.find(c => c.id === courseId);
        if (!course) return;

        const result = PortalState.dropCourse(courseId);
        if (result.success) {
          this.showToast(`Dropped ${course.code}: ${course.title} from your schedule.`, "warning");
          this.populateCourseDropdown();
          this.renderRegisteredTable();
          this.updateCreditMeter();
          this.updateHeaderBadge();
          this.announce(`Course ${course.code} dropped.`);
        }
      });
    });
  },

  /* --------------------------------------------------------------------------
     STUDENT PROFILE PAGE LOGIC
     -------------------------------------------------------------------------- */
  initProfilePage() {
    this.renderProfileDetails();
    this.renderProfileScheduleTable();
    this.setupProfileForm();
  },

  renderProfileDetails() {
    const profile = PortalState.getStudentProfile();
    const totalCredits = PortalState.getTotalCredits();

    const nameEl = document.getElementById("profile-name");
    const idEl = document.getElementById("profile-id");
    const majorEl = document.getElementById("profile-major");
    const advisorEl = document.getElementById("profile-advisor");
    const gpaEl = document.getElementById("profile-gpa");
    const standingEl = document.getElementById("profile-standing");
    const currentCreditsEl = document.getElementById("profile-current-credits");
    const completedCreditsEl = document.getElementById("profile-completed-credits");
    const degreeReqEl = document.getElementById("profile-degree-req");
    const progressFillEl = document.getElementById("profile-progress-fill");
    const progressPercentEl = document.getElementById("profile-progress-percent");

    if (nameEl) nameEl.textContent = profile.name;
    if (idEl) idEl.textContent = profile.id;
    if (majorEl) majorEl.textContent = profile.major;
    if (advisorEl) advisorEl.textContent = profile.advisor;
    if (gpaEl) gpaEl.textContent = profile.gpa;
    if (standingEl) standingEl.textContent = profile.standing;
    if (currentCreditsEl) currentCreditsEl.textContent = `${totalCredits} cr`;
    if (completedCreditsEl) completedCreditsEl.textContent = `${profile.creditsCompleted} cr`;
    if (degreeReqEl) degreeReqEl.textContent = `${profile.degreeCreditsReq} cr`;

    const totalEarnedAndCurrent = profile.creditsCompleted + totalCredits;
    const degreePercent = Math.min(Math.round((totalEarnedAndCurrent / profile.degreeCreditsReq) * 100), 100);

    if (progressFillEl) {
      progressFillEl.style.width = `${degreePercent}%`;
      progressFillEl.setAttribute("aria-valuenow", degreePercent);
    }
    if (progressPercentEl) progressPercentEl.textContent = `${degreePercent}% Complete`;

    // Populate profile form inputs
    const inputName = document.getElementById("edit-name");
    const inputEmail = document.getElementById("edit-email");
    const inputPhone = document.getElementById("edit-phone");
    const inputGrad = document.getElementById("edit-grad");

    if (inputName) inputName.value = profile.name;
    if (inputEmail) inputEmail.value = profile.email;
    if (inputPhone) inputPhone.value = profile.phone;
    if (inputGrad) inputGrad.value = profile.targetGraduation;
  },

  renderProfileScheduleTable() {
    const tbody = document.getElementById("profile-schedule-tbody");
    if (!tbody) return;

    const registered = PortalState.getRegisteredCourses();
    if (registered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">
            No courses enrolled for Fall 2026. <a href="catalog.html">Browse Course Catalog</a> to register.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = registered.map(course => `
      <tr>
        <th scope="row" style="font-weight:700;">
          <span class="badge badge-${course.theme}">${this.escapeHtml(course.code)}</span>
        </th>
        <td style="font-weight:700;">${this.escapeHtml(course.title)}</td>
        <td>${this.escapeHtml(course.instructor)}</td>
        <td>${this.escapeHtml(course.schedule)}</td>
        <td>${this.escapeHtml(course.location)}</td>
        <td style="font-weight:700;text-align:center;">${course.credits}</td>
      </tr>
    `).join("");
  },

  setupProfileForm() {
    const form = document.getElementById("profile-edit-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const profile = PortalState.getStudentProfile();
      profile.name = document.getElementById("edit-name").value.trim();
      profile.email = document.getElementById("edit-email").value.trim();
      profile.phone = document.getElementById("edit-phone").value.trim();
      profile.targetGraduation = document.getElementById("edit-grad").value.trim();

      PortalState.saveStudentProfile(profile);
      this.renderProfileDetails();
      this.showToast("Student profile preferences updated successfully!", "success");
      this.announce("Profile details saved.");
    });
  },

  /* --------------------------------------------------------------------------
     Security Helper: HTML Escaping
     -------------------------------------------------------------------------- */
  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};
