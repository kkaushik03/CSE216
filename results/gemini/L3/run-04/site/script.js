/**
 * Triton Academy Course Registration System
 * Single-Page Architecture with Full WCAG 2.2 AA Accessibility Compliance
 */

// --- Initial Course Catalog Dataset ---
const COURSE_CATALOG = [
  {
    id: "CSE101",
    code: "CSE 101",
    title: "Design and Analysis of Algorithms",
    dept: "CSE",
    level: "Upper",
    credits: 4.0,
    instructor: "Prof. Sanjoy Dasgupta",
    schedule: "Mon, Wed, Fri 10:00 - 10:50 AM",
    location: "Center Hall 115",
    format: "In-Person",
    capacity: 220,
    enrolled: 184,
    status: "OPEN",
    prereqs: "CSE 21 and CSE 100",
    description: "Design and analysis of efficient algorithms for sorting, searching, graphs, dynamic programming, and NP-completeness."
  },
  {
    id: "CSE110",
    code: "CSE 110",
    title: "Software Engineering Practice",
    dept: "CSE",
    level: "Upper",
    credits: 4.0,
    instructor: "Prof. Thomas Powell",
    schedule: "Tue, Thu 2:00 - 3:20 PM",
    location: "Warren Lecture Hall 2001",
    format: "Hybrid",
    capacity: 180,
    enrolled: 178,
    status: "OPEN",
    prereqs: "CSE 100",
    description: "Hands-on team development of large web and mobile applications using Agile, CI/CD, testing, and modern UI frameworks."
  },
  {
    id: "COGS108",
    code: "COGS 108",
    title: "Data Science in Practice",
    dept: "COGS",
    level: "Upper",
    credits: 4.0,
    instructor: "Prof. Shannon Ellis",
    schedule: "Tue, Thu 11:00 AM - 12:20 PM",
    location: "Cognitive Science Building 001",
    format: "In-Person",
    capacity: 300,
    enrolled: 295,
    status: "OPEN",
    prereqs: "COGS 18 or CSE 11",
    description: "Exploratory data analysis, statistical modeling, data wrangling, reproducible workflows, and ethical implications of machine learning."
  },
  {
    id: "MATH18",
    code: "MATH 18",
    title: "Linear Algebra",
    dept: "MATH",
    level: "Lower",
    credits: 4.0,
    instructor: "Prof. Laura Stevens",
    schedule: "Mon, Wed, Fri 1:00 - 1:50 PM",
    location: "Applied Physics & Math 2402",
    format: "In-Person",
    capacity: 250,
    enrolled: 240,
    status: "OPEN",
    prereqs: "MATH 20C or equivalent",
    description: "Matrix algebra, Gaussian elimination, determinants, vector spaces, linear transformations, eigenvalues, and eigenvectors."
  },
  {
    id: "DSGN1",
    code: "DSGN 1",
    title: "Design of Everyday Things",
    dept: "DSGN",
    level: "Lower",
    credits: 4.0,
    instructor: "Prof. Don Norman",
    schedule: "Tue, Thu 9:30 - 10:50 AM",
    location: "Design and Innovation Building 202",
    format: "In-Person",
    capacity: 120,
    enrolled: 120,
    status: "WAITLIST",
    prereqs: "None",
    description: "Core principles of human-centered design, cognitive affordances, feedback systems, and designing accessible, error-tolerant products."
  },
  {
    id: "PHYS2A",
    code: "PHYS 2A",
    title: "Physics - Mechanics",
    dept: "PHYS",
    level: "Lower",
    credits: 4.0,
    instructor: "Prof. Brian Keating",
    schedule: "Mon, Wed, Fri 9:00 - 9:50 AM",
    location: "York Hall 2622",
    format: "In-Person",
    capacity: 280,
    enrolled: 260,
    status: "OPEN",
    prereqs: "MATH 20A",
    description: "Vectors, kinematics in one and two dimensions, Newton's laws of motion, work, kinetic and potential energy, gravitation."
  },
  {
    id: "ECON100A",
    code: "ECON 100A",
    title: "Microeconomics A",
    dept: "ECON",
    level: "Upper",
    credits: 4.0,
    instructor: "Prof. Mark Jacobsen",
    schedule: "Mon, Wed 3:00 - 4:20 PM",
    location: "Economics Building 104",
    format: "Hybrid",
    capacity: 150,
    enrolled: 142,
    status: "OPEN",
    prereqs: "ECON 1 and MATH 20C",
    description: "Consumer behavior, utility maximization, demand theory, production functions, cost minimization, and competitive markets."
  },
  {
    id: "CSE234",
    code: "CSE 234",
    title: "Data Systems for Machine Learning",
    dept: "CSE",
    level: "Graduate",
    credits: 4.0,
    instructor: "Prof. Arun Kumar",
    schedule: "Tue, Thu 3:30 - 4:50 PM",
    location: "CSE Building 1202",
    format: "Online",
    capacity: 65,
    enrolled: 52,
    status: "OPEN",
    prereqs: "Graduate standing or consent of instructor",
    description: "Architectures, algorithms, and systems optimizations for distributed deep learning and scalable data analytics pipelines."
  }
];

// --- Initial Registered Courses State ---
let registeredCourses = [
  {
    courseId: "CSE101",
    gradingOption: "Letter",
    registeredDate: "2026-09-15"
  },
  {
    courseId: "COGS108",
    gradingOption: "Letter",
    registeredDate: "2026-09-16"
  },
  {
    courseId: "MATH18",
    gradingOption: "Pass/No Pass",
    registeredDate: "2026-09-18"
  }
];

// --- Screen Reader Announcements ---
function announceToSR(message) {
  const announcer = document.getElementById("sr-announcements");
  if (announcer) {
    announcer.textContent = "";
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }
}

// ==========================================================================
// Router & Page Navigation
// ==========================================================================
const appRouter = {
  currentPage: "home",
  pageTitles: {
    home: "Home | Triton Course Registration Portal",
    catalog: "Course Catalog | Triton Course Registration Portal",
    registration: "Course Registration Form | Triton Course Registration Portal",
    profile: "My Schedule & Student Profile | Triton Course Registration Portal"
  },

  init() {
    // Navigation bar click listeners
    const navButtons = document.querySelectorAll(".nav-link");
    navButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetPage = btn.getAttribute("data-page");
        this.navigateTo(targetPage);
        this.closeMobileMenu();
      });
    });

    // Mobile menu toggle
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const nav = document.getElementById("primary-nav");
    if (toggleBtn && nav) {
      toggleBtn.addEventListener("click", () => {
        const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
        toggleBtn.setAttribute("aria-expanded", String(!isExpanded));
        nav.classList.toggle("is-open", !isExpanded);
      });
    }

    // Keyboard support: Close mobile menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        this.closeMobileMenu();
        toggleBtn.focus();
      }
    });

    // Sync initial state
    this.navigateTo("home", false);
  },

  closeMobileMenu() {
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const nav = document.getElementById("primary-nav");
    if (toggleBtn && nav) {
      toggleBtn.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }
  },

  navigateTo(pageId, focusMain = true) {
    const pages = ["home", "catalog", "registration", "profile"];
    if (!pages.includes(pageId)) return;

    this.currentPage = pageId;

    // Show/hide sections with semantic hidden attribute
    pages.forEach(p => {
      const sec = document.getElementById(`page-${p}`);
      if (sec) {
        if (p === pageId) {
          sec.removeAttribute("hidden");
          sec.classList.add("active");
        } else {
          sec.setAttribute("hidden", "");
          sec.classList.remove("active");
        }
      }
    });

    // Update nav links
    const navButtons = document.querySelectorAll(".nav-link");
    navButtons.forEach(btn => {
      const btnPage = btn.getAttribute("data-page");
      if (btnPage === pageId) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "page");
      } else {
        btn.classList.remove("active");
        btn.removeAttribute("aria-current");
      }
    });

    // Update document title
    document.title = this.pageTitles[pageId] || "Course Registration";

    // Inform screen readers of view change
    announceToSR(`Navigated to ${pageId} view.`);

    // Manage focus for keyboard users
    if (focusMain) {
      const activeSection = document.getElementById(`page-${pageId}`);
      if (activeSection) {
        const primaryHeading = activeSection.querySelector("h1");
        if (primaryHeading) {
          primaryHeading.setAttribute("tabindex", "-1");
          primaryHeading.focus();
        } else {
          const mainEl = document.getElementById("main-content");
          if (mainEl) mainEl.focus();
        }
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// ==========================================================================
// Catalog Manager (Filtering, Searching & Rendering)
// ==========================================================================
const catalogManager = {
  searchTerm: "",
  deptFilter: "ALL",
  levelFilter: "ALL",
  formatFilter: "ALL",
  availabilityFilter: "ALL",

  init() {
    const searchInput = document.getElementById("catalog-search");
    const deptSelect = document.getElementById("filter-dept");
    const levelSelect = document.getElementById("filter-level");
    const formatSelect = document.getElementById("filter-format");
    const availSelect = document.getElementById("filter-availability");
    const resetBtn = document.getElementById("btn-reset-filters");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchTerm = e.target.value.trim().toLowerCase();
        this.renderCatalog();
      });
    }

    if (deptSelect) {
      deptSelect.addEventListener("change", (e) => {
        this.deptFilter = e.target.value;
        this.renderCatalog();
      });
    }

    if (levelSelect) {
      levelSelect.addEventListener("change", (e) => {
        this.levelFilter = e.target.value;
        this.renderCatalog();
      });
    }

    if (formatSelect) {
      formatSelect.addEventListener("change", (e) => {
        this.formatFilter = e.target.value;
        this.renderCatalog();
      });
    }

    if (availSelect) {
      availSelect.addEventListener("change", (e) => {
        this.availabilityFilter = e.target.value;
        this.renderCatalog();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetFilters();
      });
    }

    this.renderCatalog();
    this.populateCourseSelectOptions();
  },

  resetFilters() {
    this.searchTerm = "";
    this.deptFilter = "ALL";
    this.levelFilter = "ALL";
    this.formatFilter = "ALL";
    this.availabilityFilter = "ALL";

    document.getElementById("catalog-search").value = "";
    document.getElementById("filter-dept").value = "ALL";
    document.getElementById("filter-level").value = "ALL";
    document.getElementById("filter-format").value = "ALL";
    document.getElementById("filter-availability").value = "ALL";

    this.renderCatalog();
    announceToSR("All filters have been cleared.");
  },

  getFilteredCourses() {
    return COURSE_CATALOG.filter(course => {
      // Search matching code, title, instructor
      if (this.searchTerm) {
        const matchCode = course.code.toLowerCase().includes(this.searchTerm);
        const matchTitle = course.title.toLowerCase().includes(this.searchTerm);
        const matchInst = course.instructor.toLowerCase().includes(this.searchTerm);
        if (!matchCode && !matchTitle && !matchInst) return false;
      }

      // Department filter
      if (this.deptFilter !== "ALL" && course.dept !== this.deptFilter) {
        return false;
      }

      // Level filter
      if (this.levelFilter !== "ALL" && course.level !== this.levelFilter) {
        return false;
      }

      // Format filter
      if (this.formatFilter !== "ALL" && course.format !== this.formatFilter) {
        return false;
      }

      // Availability filter
      if (this.availabilityFilter === "OPEN" && course.status !== "OPEN") {
        return false;
      }
      if (this.availabilityFilter === "WAITLIST" && course.status !== "WAITLIST") {
        return false;
      }

      return true;
    });
  },

  renderCatalog() {
    const container = document.getElementById("courses-container");
    const countBadge = document.getElementById("catalog-count");
    const emptyState = document.getElementById("catalog-empty-state");
    const tagsContainer = document.getElementById("filter-tags");

    if (!container) return;

    const filtered = this.getFilteredCourses();

    if (countBadge) {
      countBadge.textContent = filtered.length;
    }

    // Render active filter badges
    if (tagsContainer) {
      tagsContainer.innerHTML = "";
      const activeTags = [];
      if (this.deptFilter !== "ALL") activeTags.push(`Dept: ${this.deptFilter}`);
      if (this.levelFilter !== "ALL") activeTags.push(`Level: ${this.levelFilter}`);
      if (this.formatFilter !== "ALL") activeTags.push(`Modality: ${this.formatFilter}`);
      if (this.availabilityFilter !== "ALL") activeTags.push(`Status: ${this.availabilityFilter}`);
      if (this.searchTerm) activeTags.push(`Keyword: "${this.searchTerm}"`);

      activeTags.forEach(text => {
        const pill = document.createElement("span");
        pill.className = "filter-tag-pill";
        pill.textContent = text;
        tagsContainer.appendChild(pill);
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = "";
      emptyState.removeAttribute("hidden");
      announceToSR("No courses found matching criteria.");
      return;
    } else {
      emptyState.setAttribute("hidden", "");
    }

    container.innerHTML = filtered.map(course => {
      const isAlreadyRegistered = registeredCourses.some(r => r.courseId === course.id);
      const isWaitlist = course.status === "WAITLIST";

      let statusBadgeClass = "badge-success";
      let statusLabel = `Open (${course.capacity - course.enrolled} seats left)`;
      if (isWaitlist) {
        statusBadgeClass = "badge-warning";
        statusLabel = "Full - Waitlist Only";
      }

      let actionBtnMarkup = "";
      if (isAlreadyRegistered) {
        actionBtnMarkup = `
          <button 
            type="button" 
            class="btn btn-sm btn-ghost" 
            disabled 
            aria-disabled="true"
            aria-label="${course.code} already enrolled"
          >
            ✓ Enrolled
          </button>
        `;
      } else if (isWaitlist) {
        actionBtnMarkup = `
          <button 
            type="button" 
            class="btn btn-sm btn-secondary" 
            onclick="registrationManager.quickRegisterFromCatalog('${course.id}')"
            aria-label="Join Waitlist for ${course.code} ${course.title}"
          >
            Join Waitlist
          </button>
        `;
      } else {
        actionBtnMarkup = `
          <button 
            type="button" 
            class="btn btn-sm btn-primary" 
            onclick="registrationManager.quickRegisterFromCatalog('${course.id}')"
            aria-label="Register for ${course.code} ${course.title}"
          >
            + Register
          </button>
        `;
      }

      return `
        <article class="course-card" aria-labelledby="course-heading-${course.id}">
          <header class="course-card-header">
            <div class="course-card-top">
              <span class="course-code-tag">${course.code}</span>
              <span class="badge ${statusBadgeClass}">${course.status}</span>
            </div>
            <h3 id="course-heading-${course.id}" class="course-card-title">${course.title}</h3>
          </header>

          <div class="course-card-body">
            <div class="course-meta-row">
              <span class="course-meta-icon" aria-hidden="true">👨‍🏫</span>
              <span><strong>Instructor:</strong> ${course.instructor}</span>
            </div>
            <div class="course-meta-row">
              <span class="course-meta-icon" aria-hidden="true">🕒</span>
              <span><strong>Schedule:</strong> ${course.schedule}</span>
            </div>
            <div class="course-meta-row">
              <span class="course-meta-icon" aria-hidden="true">📍</span>
              <span><strong>Location:</strong> ${course.location} (${course.format})</span>
            </div>
            <div class="course-meta-row">
              <span class="course-meta-icon" aria-hidden="true">⭐</span>
              <span><strong>Units:</strong> ${course.credits.toFixed(1)} Credits</span>
            </div>

            <p class="course-description">${course.description}</p>

            <div class="course-prereqs">
              <strong>Prerequisites:</strong> ${course.prereqs}
            </div>
          </div>

          <footer class="course-card-footer">
            <span class="course-seats-status text-muted">${statusLabel}</span>
            ${actionBtnMarkup}
          </footer>
        </article>
      `;
    }).join("");
  },

  populateCourseSelectOptions() {
    const selectEl = document.getElementById("reg-course-select");
    if (!selectEl) return;

    // Preserve first default option
    selectEl.innerHTML = '<option value="">-- Choose a Course --</option>';

    COURSE_CATALOG.forEach(course => {
      const isAlready = registeredCourses.some(r => r.courseId === course.id);
      const opt = document.createElement("option");
      opt.value = course.id;
      opt.textContent = `${course.code}: ${course.title} (${course.credits} Units) ${isAlready ? '[Enrolled]' : ''}`;
      selectEl.appendChild(opt);
    });
  }
};

// ==========================================================================
// Registration Manager & Validation
// ==========================================================================
const registrationManager = {
  init() {
    const form = document.getElementById("course-reg-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit(form);
    });

    const resetBtn = document.getElementById("btn-reset-form");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.clearFormErrors();
      });
    }
  },

  quickRegisterFromCatalog(courseId) {
    // Fill select in direct registration or trigger confirmation directly
    const course = COURSE_CATALOG.find(c => c.id === courseId);
    if (!course) return;

    const selectEl = document.getElementById("reg-course-select");
    if (selectEl) {
      selectEl.value = course.id;
    }

    // Pre-fill agreement checkbox for smooth flow
    const chk = document.getElementById("reg-agreement");
    if (chk) chk.checked = true;

    // Navigate to registration page so student can review and submit
    appRouter.navigateTo("registration");
    setTimeout(() => {
      if (selectEl) selectEl.focus();
    }, 150);
  },

  clearFormErrors() {
    const errorSummary = document.getElementById("form-error-summary");
    const errorList = document.getElementById("form-error-list");
    if (errorSummary) errorSummary.setAttribute("hidden", "");
    if (errorList) errorList.innerHTML = "";

    // Clear individual field errors
    const errorContainers = document.querySelectorAll(".form-error");
    errorContainers.forEach(el => el.textContent = "");

    const controls = document.querySelectorAll(".form-control, .form-select");
    controls.forEach(c => {
      c.classList.remove("is-invalid");
      c.removeAttribute("aria-invalid");
    });
  },

  handleFormSubmit(form) {
    this.clearFormErrors();

    const courseSelect = document.getElementById("reg-course-select");
    const gradingOption = document.getElementById("reg-grading-option");
    const studentIdInput = document.getElementById("reg-student-id");
    const studentEmailInput = document.getElementById("reg-student-email");
    const agreementCheckbox = document.getElementById("reg-agreement");

    const errors = [];

    // Course validation
    if (!courseSelect.value) {
      errors.push({
        id: "reg-course-select",
        errorId: "reg-course-error",
        msg: "Please select a course to register."
      });
    } else {
      // Check if already registered
      const isAlready = registeredCourses.some(r => r.courseId === courseSelect.value);
      if (isAlready) {
        errors.push({
          id: "reg-course-select",
          errorId: "reg-course-error",
          msg: "You are already enrolled in this course."
        });
      }
    }

    // Student ID validation (pattern 8-10 alphanumeric)
    const pidVal = studentIdInput.value.trim();
    const pidRegex = /^[A-Za-z0-9]{8,10}$/;
    if (!pidVal) {
      errors.push({
        id: "reg-student-id",
        errorId: "reg-pid-error",
        msg: "Student PID / ID Number is required."
      });
    } else if (!pidRegex.test(pidVal)) {
      errors.push({
        id: "reg-student-id",
        errorId: "reg-pid-error",
        msg: "Student PID must be between 8 and 10 alphanumeric characters."
      });
    }

    // Email validation
    const emailVal = studentEmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      errors.push({
        id: "reg-student-email",
        errorId: "reg-email-error",
        msg: "University email address is required."
      });
    } else if (!emailRegex.test(emailVal)) {
      errors.push({
        id: "reg-student-email",
        errorId: "reg-email-error",
        msg: "Please provide a valid university email address."
      });
    }

    // Agreement checkbox validation
    if (!agreementCheckbox.checked) {
      errors.push({
        id: "reg-agreement",
        errorId: "reg-agreement-error",
        msg: "You must accept the prerequisite verification and Academic Integrity Code."
      });
    }

    // Total units limit check (Max 19.5 units)
    if (courseSelect.value && !errors.some(e => e.id === "reg-course-select")) {
      const selectedCourse = COURSE_CATALOG.find(c => c.id === courseSelect.value);
      const currentUnits = profileManager.calculateTotalCredits();
      if (selectedCourse && (currentUnits + selectedCourse.credits > 19.5)) {
        errors.push({
          id: "reg-course-select",
          errorId: "reg-course-error",
          msg: `Adding ${selectedCourse.code} (${selectedCourse.credits} units) exceeds the 19.5 unit quarterly limit. Petition required.`
        });
      }
    }

    // If errors, display accessible error summary & link focus
    if (errors.length > 0) {
      const errorSummary = document.getElementById("form-error-summary");
      const errorList = document.getElementById("form-error-list");

      errorList.innerHTML = "";
      errors.forEach(err => {
        // Individual inline error
        const field = document.getElementById(err.id);
        const errContainer = document.getElementById(err.errorId);
        if (field) {
          field.classList.add("is-invalid");
          field.setAttribute("aria-invalid", "true");
        }
        if (errContainer) {
          errContainer.textContent = err.msg;
        }

        // Summary list item with jump link
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${err.id}`;
        a.textContent = err.msg;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          field.focus();
        });
        li.appendChild(a);
        errorList.appendChild(li);
      });

      errorSummary.removeAttribute("hidden");
      errorSummary.focus();
      announceToSR(`Registration form has ${errors.length} validation errors. Review the error summary.`);
      return;
    }

    // Valid submission: add course to state
    const chosenCourseId = courseSelect.value;
    const chosenCourse = COURSE_CATALOG.find(c => c.id === chosenCourseId);

    registeredCourses.push({
      courseId: chosenCourseId,
      gradingOption: gradingOption.value,
      registeredDate: new Date().toISOString().split("T")[0]
    });

    // Update system components
    catalogManager.renderCatalog();
    catalogManager.populateCourseSelectOptions();
    profileManager.renderTable();
    profileManager.updateBadgesAndCounters();

    // Reset form
    form.reset();

    // Show confirmation modal dialog
    modalManager.showConfirmationModal(chosenCourse, gradingOption.value);
  }
};

// ==========================================================================
// Modal Dialog Manager (WCAG 2.2 Accessible Dialog Pattern)
// ==========================================================================
const modalManager = {
  lastFocusedElement: null,
  activeModal: null,

  init() {
    // Confirmation modal close buttons
    const btnCloseX = document.getElementById("btn-modal-close-x");
    const btnModalCatalog = document.getElementById("btn-modal-catalog");
    const btnModalProfile = document.getElementById("btn-modal-profile");

    if (btnCloseX) btnCloseX.addEventListener("click", () => this.closeModal());
    if (btnModalCatalog) {
      btnModalCatalog.addEventListener("click", () => {
        this.closeModal();
        appRouter.navigateTo("catalog");
      });
    }
    if (btnModalProfile) {
      btnModalProfile.addEventListener("click", () => {
        this.closeModal();
        appRouter.navigateTo("profile");
      });
    }

    // Drop modal close buttons
    const btnDropCloseX = document.getElementById("btn-drop-close-x");
    const btnCancelDrop = document.getElementById("btn-cancel-drop");
    const btnConfirmDrop = document.getElementById("btn-confirm-drop");

    if (btnDropCloseX) btnDropCloseX.addEventListener("click", () => this.closeDropModal());
    if (btnCancelDrop) btnCancelDrop.addEventListener("click", () => this.closeDropModal());
    if (btnConfirmDrop) {
      btnConfirmDrop.addEventListener("click", () => {
        if (this.pendingDropCourseId) {
          profileManager.dropCourse(this.pendingDropCourseId);
          this.closeDropModal();
        }
      });
    }

    // Universal key listener for ESC & Focus Trapping
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeModal) {
        if (this.activeModal.id === "confirmation-modal") {
          this.closeModal();
        } else if (this.activeModal.id === "drop-modal") {
          this.closeDropModal();
        }
      }

      if (e.key === "Tab" && this.activeModal) {
        this.trapFocus(e, this.activeModal);
      }
    });

    // Close on clicking backdrop outside dialog
    const confModal = document.getElementById("confirmation-modal");
    if (confModal) {
      confModal.addEventListener("click", (e) => {
        if (e.target === confModal) this.closeModal();
      });
    }

    const dropModal = document.getElementById("drop-modal");
    if (dropModal) {
      dropModal.addEventListener("click", (e) => {
        if (e.target === dropModal) this.closeDropModal();
      });
    }
  },

  trapFocus(e, modalContainer) {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(modalContainer.querySelectorAll(focusableSelectors))
      .filter(el => !el.hasAttribute("disabled") && !el.hasAttribute("hidden"));

    if (focusableElements.length === 0) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else { // Tab
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  },

  showConfirmationModal(course, gradingBasis) {
    this.lastFocusedElement = document.activeElement;
    const modal = document.getElementById("confirmation-modal");
    if (!modal) return;

    const randNum = Math.floor(100000 + Math.random() * 900000);
    document.getElementById("modal-confirm-id").textContent = `REG-${randNum}-F26`;
    document.getElementById("modal-course-badge").textContent = `${course.code} - ${course.credits} Units`;
    document.getElementById("modal-course-title").textContent = course.title;
    document.getElementById("modal-confirm-schedule").textContent = `${course.schedule} (${course.location})`;
    document.getElementById("modal-confirm-instructor").textContent = course.instructor;
    document.getElementById("modal-confirm-credits").textContent = `${course.credits.toFixed(1)} Units`;
    document.getElementById("modal-confirm-grading").textContent = gradingBasis || "Letter Grade";

    modal.removeAttribute("hidden");
    this.activeModal = modal;

    // Focus close button or primary action
    setTimeout(() => {
      const primaryBtn = document.getElementById("btn-modal-profile");
      if (primaryBtn) primaryBtn.focus();
    }, 50);

    announceToSR(`Registration confirmed for ${course.code}. Confirmation dialog opened.`);
  },

  closeModal() {
    const modal = document.getElementById("confirmation-modal");
    if (modal) {
      modal.setAttribute("hidden", "");
    }
    this.activeModal = null;
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === "function") {
      this.lastFocusedElement.focus();
    }
  },

  pendingDropCourseId: null,
  showDropModal(courseId, triggerButton) {
    this.lastFocusedElement = triggerButton || document.activeElement;
    this.pendingDropCourseId = courseId;
    const course = COURSE_CATALOG.find(c => c.id === courseId);
    if (!course) return;

    document.getElementById("drop-modal-course-name").textContent = `${course.code} - ${course.title}`;

    const modal = document.getElementById("drop-modal");
    modal.removeAttribute("hidden");
    this.activeModal = modal;

    setTimeout(() => {
      const cancelBtn = document.getElementById("btn-cancel-drop");
      if (cancelBtn) cancelBtn.focus();
    }, 50);

    announceToSR(`Drop course confirmation dialog opened for ${course.code}.`);
  },

  closeDropModal() {
    const modal = document.getElementById("drop-modal");
    if (modal) {
      modal.setAttribute("hidden", "");
    }
    this.activeModal = null;
    this.pendingDropCourseId = null;
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === "function") {
      this.lastFocusedElement.focus();
    }
  }
};

// ==========================================================================
// Profile & Registered Courses Data Table Manager
// ==========================================================================
const profileManager = {
  init() {
    this.renderTable();
    this.updateBadgesAndCounters();
  },

  calculateTotalCredits() {
    return registeredCourses.reduce((sum, reg) => {
      const course = COURSE_CATALOG.find(c => c.id === reg.courseId);
      return sum + (course ? course.credits : 0);
    }, 0);
  },

  updateBadgesAndCounters() {
    const totalUnits = this.calculateTotalCredits();
    const courseCount = registeredCourses.length;

    // Header nav badge
    const badge = document.getElementById("registered-badge");
    if (badge) {
      badge.textContent = courseCount;
      badge.setAttribute("aria-label", `${courseCount} courses registered`);
    }

    // Home page stat
    const homeCreditCount = document.getElementById("home-credit-count");
    if (homeCreditCount) {
      homeCreditCount.textContent = `${totalUnits.toFixed(1)} / 18`;
    }

    // Profile summary units
    const profUnits = document.getElementById("profile-total-units");
    if (profUnits) {
      profUnits.textContent = `${totalUnits.toFixed(1)} Units`;
    }

    // Table footer total units
    const tableUnits = document.getElementById("table-total-credits");
    if (tableUnits) {
      tableUnits.textContent = `${totalUnits.toFixed(1)} Units`;
    }
  },

  renderTable() {
    const tbody = document.getElementById("registered-courses-tbody");
    const emptyMsg = document.getElementById("table-empty-msg");
    const tableContainer = document.querySelector(".table-responsive");

    if (!tbody) return;

    if (registeredCourses.length === 0) {
      tbody.innerHTML = "";
      if (emptyMsg) emptyMsg.removeAttribute("hidden");
      if (tableContainer) tableContainer.setAttribute("hidden", "");
      return;
    } else {
      if (emptyMsg) emptyMsg.setAttribute("hidden", "");
      if (tableContainer) tableContainer.removeAttribute("hidden");
    }

    tbody.innerHTML = registeredCourses.map(reg => {
      const course = COURSE_CATALOG.find(c => c.id === reg.courseId);
      if (!course) return "";

      return `
        <tr>
          <td><strong class="font-mono text-primary">${course.code}</strong></td>
          <td><strong>${course.title}</strong></td>
          <td><span class="badge badge-purple">${course.dept}</span></td>
          <td>${course.credits.toFixed(1)}</td>
          <td>${course.schedule}<br><span class="text-sm text-muted">${course.location}</span></td>
          <td>${course.instructor}</td>
          <td><span class="badge badge-info">${reg.gradingOption}</span></td>
          <td class="text-right">
            <button 
              type="button" 
              class="btn btn-sm btn-danger" 
              onclick="modalManager.showDropModal('${course.id}', this)"
              aria-label="Drop course ${course.code} ${course.title}"
            >
              Drop
            </button>
          </td>
        </tr>
      `;
    }).join("");
  },

  dropCourse(courseId) {
    const course = COURSE_CATALOG.find(c => c.id === courseId);
    registeredCourses = registeredCourses.filter(r => r.courseId !== courseId);

    this.renderTable();
    this.updateBadgesAndCounters();
    catalogManager.renderCatalog();
    catalogManager.populateCourseSelectOptions();

    const courseName = course ? course.code : "Course";
    announceToSR(`${courseName} successfully dropped from your schedule.`);
  }
};

// Global Exposure for inline HTML handler references
window.appRouter = appRouter;
window.catalogManager = catalogManager;
window.registrationManager = registrationManager;
window.modalManager = modalManager;
window.profileManager = profileManager;

// Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  appRouter.init();
  catalogManager.init();
  registrationManager.init();
  modalManager.init();
  profileManager.init();
});
