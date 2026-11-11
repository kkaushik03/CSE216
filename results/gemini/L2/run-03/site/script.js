/**
 * HORIZON STATE UNIVERSITY - COURSE REGISTRATION SYSTEM
 * JavaScript Application Logic
 */

// =============================================================================
// 1. DATASET: COURSES CATALOG
// =============================================================================
const COURSES_DATA = [
  {
    id: "cse-101",
    crn: "40291",
    code: "CSE 101",
    title: "Design and Analysis of Algorithms",
    department: "Computer Science",
    deptTag: "dept-cs-tag",
    level: "Upper Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Dr. Alan Turing",
    schedule: "Mon, Wed, Fri 10:00 AM - 10:50 AM",
    timeSlot: "Morning",
    days: "MWF",
    location: "Center Hall 105",
    format: "In-Person",
    seatsAvailable: 14,
    totalSeats: 65,
    prereqs: "CSE 21 (Mathematics for Algorithms) and CSE 100 (Advanced Data Structures)",
    description: "Design and comprehensive analysis of efficient algorithms. Dynamic programming, divide-and-conquer, greedy heuristics, graph traversals, network flows, NP-completeness, and approximation algorithms.",
    isFeatured: true
  },
  {
    id: "dsc-100",
    crn: "38102",
    code: "DSC 100",
    title: "Principles of Data Science & Machine Learning",
    department: "Data Science",
    deptTag: "dept-dsc-tag",
    level: "Upper Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Prof. Cynthia Dwork",
    schedule: "Tue, Thu 12:30 PM - 1:50 PM",
    timeSlot: "Afternoon",
    days: "TuTh",
    location: "San Diego Supercomputer Aud",
    format: "In-Person",
    seatsAvailable: 28,
    totalSeats: 80,
    prereqs: "DSC 40B, DSC 80, and MATH 18",
    description: "Explores the fundamental lifecycle of data science: statistical modeling, regression techniques, classification algorithms, regularization, bias-variance tradeoff, cross-validation, and ethical AI stewardship.",
    isFeatured: true
  },
  {
    id: "math-109",
    crn: "29114",
    code: "MATH 109",
    title: "Mathematical Reasoning & Proofs",
    department: "Mathematics",
    deptTag: "dept-math-tag",
    level: "Upper Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Dr. Terence Tao",
    schedule: "Mon, Wed, Fri 2:00 PM - 2:50 PM",
    timeSlot: "Afternoon",
    days: "MWF",
    location: "Applied Physics & Math 2402",
    format: "In-Person",
    seatsAvailable: 8,
    totalSeats: 50,
    prereqs: "MATH 20C or MATH 31BH",
    description: "An introduction to rigorous mathematical proofs. Logic, propositions, quantifiers, set theory, functions, relations, cardinality, mathematical induction, and foundational number theory.",
    isFeatured: false
  },
  {
    id: "cse-110",
    crn: "41982",
    code: "CSE 110",
    title: "Software Engineering Principles",
    department: "Computer Science",
    deptTag: "dept-cs-tag",
    level: "Upper Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Prof. Gary Gillespie",
    schedule: "Tue, Thu 3:30 PM - 4:50 PM",
    timeSlot: "Afternoon",
    days: "TuTh",
    location: "Warren Lecture Hall 2001",
    format: "Hybrid",
    seatsAvailable: 4,
    totalSeats: 90,
    prereqs: "CSE 100 (Advanced Data Structures)",
    description: "Introduction to agile software development processes, user stories, sprint planning, CI/CD pipelines, automated unit/integration testing, Git workflows, and large-team collaborative client projects.",
    isFeatured: true
  },
  {
    id: "cogs-120",
    crn: "34812",
    code: "COGS 120",
    title: "Human-Computer Interaction Design",
    department: "Design",
    deptTag: "dept-cogs-tag",
    level: "Upper Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Dr. Don Norman",
    schedule: "Mon, Wed 5:00 PM - 6:20 PM",
    timeSlot: "Evening",
    days: "MW",
    location: "Cognitive Science Bldg 001",
    format: "In-Person",
    seatsAvailable: 19,
    totalSeats: 60,
    prereqs: "COGS 1 or COGS 10",
    description: "Techniques in user-centered design, user research, wireframing, high-fidelity interactive prototyping, usability heuristics, cognitive ergonomics, and digital accessibility compliance (WCAG 2.1).",
    isFeatured: true
  },
  {
    id: "bild-1",
    crn: "18920",
    code: "BILD 1",
    title: "The Cell & Molecular Biology",
    department: "Biology",
    deptTag: "dept-bio-tag",
    level: "Lower Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Dr. Jennifer Doudna",
    schedule: "Mon, Wed, Fri 9:00 AM - 9:50 AM",
    timeSlot: "Morning",
    days: "MWF",
    location: "Price Center Theater",
    format: "In-Person",
    seatsAvailable: 45,
    totalSeats: 150,
    prereqs: "CHEM 6A or equivalent",
    description: "An introduction to cellular architecture, metabolic pathways, enzyme catalysis, cell division, molecular genetics, DNA replication, transcription, translation, and genetic engineering technologies.",
    isFeatured: false
  },
  {
    id: "econ-100a",
    crn: "23891",
    code: "ECON 100A",
    title: "Microeconomics: Consumer & Firm Theory",
    department: "Economics",
    deptTag: "dept-econ-tag",
    level: "Upper Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Dr. Esther Duflo",
    schedule: "Tue, Thu 9:30 AM - 10:50 AM",
    timeSlot: "Morning",
    days: "TuTh",
    location: "Solís Hall 107",
    format: "In-Person",
    seatsAvailable: 2,
    totalSeats: 110,
    prereqs: "ECON 1 and MATH 20C or MATH 31BH",
    description: "Neoclassical consumer choice theory, utility maximization, expenditure minimization, production theory, cost functions, competitive supply, and partial equilibrium analysis.",
    isFeatured: false
  },
  {
    id: "phys-2a",
    crn: "15478",
    code: "PHYS 2A",
    title: "Physics: Mechanics & Particle Dynamics",
    department: "Physics",
    deptTag: "dept-phys-tag",
    level: "Lower Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Dr. Richard Feynman",
    schedule: "Mon, Wed, Fri 11:00 AM - 11:50 AM",
    timeSlot: "Morning",
    days: "MWF",
    location: "York Hall 2622",
    format: "In-Person",
    seatsAvailable: 22,
    totalSeats: 120,
    prereqs: "MATH 20A and concurrent enrollment in MATH 20B",
    description: "Vectors, kinematics in one and three dimensions, Newton's laws of motion, work, kinetic energy, conservation of momentum, rotational motion, gravitational fields, and harmonic oscillation.",
    isFeatured: false
  },
  {
    id: "cse-150a",
    crn: "45091",
    code: "CSE 150A",
    title: "Introduction to Artificial Intelligence",
    department: "Computer Science",
    deptTag: "dept-cs-tag",
    level: "Upper Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Dr. Stuart Russell",
    schedule: "Tue, Thu 11:00 AM - 12:20 PM",
    timeSlot: "Morning",
    days: "TuTh",
    location: "Peterson Hall 108",
    format: "Online",
    seatsAvailable: 0,
    totalSeats: 75,
    prereqs: "CSE 100 and MATH 183 or CSE 103",
    description: "Heuristic search, A* algorithms, adversarial game playing, probabilistic reasoning, Bayesian networks, Markov decision processes (MDPs), reinforcement learning, and reinforcement agents.",
    isFeatured: false
  },
  {
    id: "dsc-180a",
    crn: "39201",
    code: "DSC 180A",
    title: "Senior Data Science Capstone I",
    department: "Data Science",
    deptTag: "dept-dsc-tag",
    level: "Upper Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Dr. Yaron Singer",
    schedule: "Wed 2:00 PM - 4:50 PM",
    timeSlot: "Afternoon",
    days: "W",
    location: "Halıcıoğlu Data Science Inst 202",
    format: "In-Person",
    seatsAvailable: 12,
    totalSeats: 35,
    prereqs: "DSC 102 and Senior Standing",
    description: "The first quarter of the senior capstone sequence. Students conduct original empirical research or build domain-specific ML platforms with academic or industry mentor supervision.",
    isFeatured: false
  },
  {
    id: "cogs-10",
    crn: "31005",
    code: "COGS 10",
    title: "Cognitive Psychology: Mind & Media",
    department: "Design",
    deptTag: "dept-cogs-tag",
    level: "Lower Division",
    term: "Fall 2026",
    credits: 4,
    instructor: "Prof. Angela Davis",
    schedule: "Online Asynchronous",
    timeSlot: "Async",
    days: "Async",
    location: "Canvas Virtual Classroom",
    format: "Online",
    seatsAvailable: 60,
    totalSeats: 150,
    prereqs: "None",
    description: "How the human visual and auditory system perceives interfaces, digital narratives, multimedia communications, cognitive load, attention span, and immersive augmented environments.",
    isFeatured: false
  },
  {
    id: "cse-291",
    crn: "48203",
    code: "CSE 291",
    title: "Graduate Seminar: Frontier Generative AI",
    department: "Computer Science",
    deptTag: "dept-cs-tag",
    level: "Graduate",
    term: "Fall 2026",
    credits: 4,
    instructor: "Dr. Geoffrey Hinton",
    schedule: "Fri 1:00 PM - 3:50 PM",
    timeSlot: "Afternoon",
    days: "F",
    location: "Atkinson Hall Auditorium",
    format: "In-Person",
    seatsAvailable: 6,
    totalSeats: 30,
    prereqs: "Graduate standing or advisor consent",
    description: "Explores transformer architectures, diffusion probabilistic models, multimodality, agentic tool reasoning, alignment strategies, RLHF, and frontier reasoning benchmarks.",
    isFeatured: false
  }
];

// =============================================================================
// 2. APPLICATION STATE
// =============================================================================
const AppState = {
  // Courses currently placed in cart awaiting registration
  cart: [],
  // Courses officially registered for the term
  enrolled: [
    // Pre-enrolled with 1 sample course so the table is never empty on arrival
    {
      ...COURSES_DATA[0], // CSE 101
      gradingOption: "Letter Grade (A - F)",
      enrolledAt: "2026-09-15"
    }
  ],
  // Max units allowable
  maxUnits: 18,
  // Filters & Search state
  filters: {
    searchQuery: "",
    department: "all",
    level: "all",
    format: "all",
    term: "Fall 2026",
    availability: "all",
    sort: "code-asc"
  },
  // Modal tracking
  pendingDropCourse: null,
  activeDetailCourse: null,
  lastFocusedElement: null
};

// =============================================================================
// 3. INITIALIZATION & DOM CACHE
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCatalogFilters();
  initRegistrationCart();
  initModals();
  initQuickAdd();
  initProfileView();
  renderAll();

  // Listen for hashchange to support browser back/forward and deep linking
  window.addEventListener("hashchange", handleHashChange);
  if (window.location.hash) {
    handleHashChange();
  }
});

function handleHashChange() {
  const hash = window.location.hash.replace("#", "");
  const viewMap = {
    home: "home-view",
    catalog: "catalog-view",
    registration: "registration-view",
    profile: "profile-view"
  };
  if (viewMap[hash]) {
    switchView(viewMap[hash], false);
  }
}

// =============================================================================
// 4. NAVIGATION LOGIC
// =============================================================================
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileToggle = document.getElementById("mobileNavToggle");
  const primaryNav = document.getElementById("primaryNav");

  // Nav link click events
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("data-target");
      switchView(targetId);
      // Close mobile menu if open
      if (primaryNav.classList.contains("is-open")) {
        primaryNav.classList.remove("is-open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && primaryNav) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("is-open");
      mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Header quick buttons
  document.getElementById("brandHomeLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    switchView("home-view");
  });

  document.getElementById("headerAvatarBtn")?.addEventListener("click", () => {
    switchView("profile-view");
  });

  // Home view call-to-actions
  document.getElementById("homeBrowseBtn")?.addEventListener("click", () => switchView("catalog-view"));
  document.getElementById("homeGoRegisterBtn")?.addEventListener("click", () => switchView("registration-view"));
  document.getElementById("homeViewAllCatalogBtn")?.addEventListener("click", () => switchView("catalog-view"));
  document.getElementById("catalogViewCartBtn")?.addEventListener("click", () => switchView("registration-view"));
  document.getElementById("browseMoreBtn")?.addEventListener("click", () => switchView("catalog-view"));

  // Feature cards links
  document.querySelectorAll(".card-link-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (target) switchView(target);
    });
  });

  // Footer nav links
  document.querySelectorAll(".footer-nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-target");
      if (target) switchView(target);
    });
  });

  // Dismiss global banner
  document.getElementById("dismissBannerBtn")?.addEventListener("click", () => {
    const banner = document.querySelector(".announcement-banner");
    if (banner) banner.style.display = "none";
  });
}

function switchView(viewId, updateHash = true) {
  // Update views active state
  const views = document.querySelectorAll(".app-view");
  views.forEach(v => {
    if (v.id === viewId) {
      v.classList.add("active");
    } else {
      v.classList.remove("active");
    }
  });

  // Update nav buttons active state
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.getAttribute("data-target") === viewId) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });

  // Sync hash
  if (updateHash) {
    const hashMap = {
      "home-view": "home",
      "catalog-view": "catalog",
      "registration-view": "registration",
      "profile-view": "profile"
    };
    if (hashMap[viewId]) {
      history.pushState(null, "", `#${hashMap[viewId]}`);
    }
  }

  // Smooth scroll to top of view
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Focus management for accessibility
  const main = document.getElementById("main-content");
  if (main) main.focus();
}

// =============================================================================
// 5. CATALOG, SEARCH & FILTERING LOGIC
// =============================================================================
function initCatalogFilters() {
  const searchInput = document.getElementById("courseSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const deptFilter = document.getElementById("deptFilter");
  const levelFilter = document.getElementById("levelFilter");
  const formatFilter = document.getElementById("formatFilter");
  const termFilter = document.getElementById("termFilter");
  const availabilityFilter = document.getElementById("availabilityFilter");
  const sortFilter = document.getElementById("sortFilter");
  const resetBtn = document.getElementById("resetFiltersBtn");
  const emptyResetBtn = document.getElementById("emptyResetBtn");

  // Search input with live debounce
  let debounceTimer;
  searchInput?.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      AppState.filters.searchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.hidden = !e.target.value;
      }
      renderCatalog();
    }, 150);
  });

  clearSearchBtn?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    clearSearchBtn.hidden = true;
    AppState.filters.searchQuery = "";
    renderCatalog();
    searchInput?.focus();
  });

  // Dropdown changes
  deptFilter?.addEventListener("change", (e) => {
    AppState.filters.department = e.target.value;
    renderCatalog();
  });

  levelFilter?.addEventListener("change", (e) => {
    AppState.filters.level = e.target.value;
    renderCatalog();
  });

  formatFilter?.addEventListener("change", (e) => {
    AppState.filters.format = e.target.value;
    renderCatalog();
  });

  termFilter?.addEventListener("change", (e) => {
    AppState.filters.term = e.target.value;
    renderCatalog();
  });

  availabilityFilter?.addEventListener("change", (e) => {
    AppState.filters.availability = e.target.value;
    renderCatalog();
  });

  sortFilter?.addEventListener("change", (e) => {
    AppState.filters.sort = e.target.value;
    renderCatalog();
  });

  // Reset Filters
  const resetAllFilters = () => {
    if (searchInput) searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.hidden = true;
    if (deptFilter) deptFilter.value = "all";
    if (levelFilter) levelFilter.value = "all";
    if (formatFilter) formatFilter.value = "all";
    if (termFilter) termFilter.value = "Fall 2026";
    if (availabilityFilter) availabilityFilter.value = "all";
    if (sortFilter) sortFilter.value = "code-asc";

    AppState.filters = {
      searchQuery: "",
      department: "all",
      level: "all",
      format: "all",
      term: "Fall 2026",
      availability: "all",
      sort: "code-asc"
    };

    renderCatalog();
    showToast("Filters reset to default view.", "info");
  };

  resetBtn?.addEventListener("click", resetAllFilters);
  emptyResetBtn?.addEventListener("click", resetAllFilters);
}

function getFilteredCourses() {
  const { searchQuery, department, level, format, term, availability, sort } = AppState.filters;

  return COURSES_DATA.filter(course => {
    // 1. Text Search query (title, code, crn, instructor, desc)
    if (searchQuery) {
      const matchCode = course.code.toLowerCase().includes(searchQuery);
      const matchTitle = course.title.toLowerCase().includes(searchQuery);
      const matchCRN = course.crn.includes(searchQuery);
      const matchInstructor = course.instructor.toLowerCase().includes(searchQuery);
      const matchDesc = course.description.toLowerCase().includes(searchQuery);
      if (!matchCode && !matchTitle && !matchCRN && !matchInstructor && !matchDesc) {
        return false;
      }
    }

    // 2. Department
    if (department !== "all" && course.department !== department) {
      return false;
    }

    // 3. Level
    if (level !== "all" && course.level !== level) {
      return false;
    }

    // 4. Format
    if (format !== "all" && course.format !== format) {
      return false;
    }

    // 5. Term
    if (term !== "all" && course.term !== term) {
      return false;
    }

    // 6. Availability
    if (availability === "open" && course.seatsAvailable <= 0) {
      return false;
    }
    if (availability === "unregistered") {
      const isEnrolled = AppState.enrolled.some(c => c.id === course.id);
      if (isEnrolled) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sort === "code-asc") return a.code.localeCompare(b.code);
    if (sort === "title-asc") return a.title.localeCompare(b.title);
    if (sort === "seats-desc") return b.seatsAvailable - a.seatsAvailable;
    if (sort === "units-desc") return b.credits - a.credits;
    return 0;
  });
}

function renderCatalog() {
  const catalogGrid = document.getElementById("catalogGrid");
  const emptyState = document.getElementById("catalogEmptyState");
  const countBadge = document.getElementById("catalogResultsCount");
  const badgesContainer = document.getElementById("filterBadgesContainer");

  if (!catalogGrid) return;

  const filtered = getFilteredCourses();

  // Results count
  if (countBadge) {
    countBadge.textContent = `Showing ${filtered.length} of ${COURSES_DATA.length} courses`;
  }

  // Active filter tags
  renderActiveFilterTags(badgesContainer);

  if (filtered.length === 0) {
    catalogGrid.innerHTML = "";
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;

  catalogGrid.innerHTML = filtered.map(course => createCourseCardHTML(course)).join("");
  attachCourseCardEventListeners(catalogGrid);
}

function renderActiveFilterTags(container) {
  if (!container) return;
  const { searchQuery, department, level, format, term, availability } = AppState.filters;
  const tags = [];

  if (searchQuery) {
    tags.push({ key: "search", label: `Search: "${searchQuery}"` });
  }
  if (department !== "all") {
    tags.push({ key: "dept", label: `Dept: ${department}` });
  }
  if (level !== "all") {
    tags.push({ key: "level", label: `Level: ${level}` });
  }
  if (format !== "all") {
    tags.push({ key: "format", label: `Format: ${format}` });
  }
  if (term !== "Fall 2026" && term !== "all") {
    tags.push({ key: "term", label: `Term: ${term}` });
  }
  if (availability !== "all") {
    tags.push({ key: "avail", label: availability === "open" ? "Seats Open" : "Not Enrolled" });
  }

  container.innerHTML = tags.map(tag => `
    <span class="filter-tag">
      ${tag.label}
      <button type="button" data-tag-key="${tag.key}" aria-label="Remove filter ${tag.label}">&times;</button>
    </span>
  `).join("");

  // Remove tag click event
  container.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-tag-key");
      if (key === "search") {
        AppState.filters.searchQuery = "";
        const sInput = document.getElementById("courseSearchInput");
        if (sInput) sInput.value = "";
      } else if (key === "dept") {
        AppState.filters.department = "all";
        const dSelect = document.getElementById("deptFilter");
        if (dSelect) dSelect.value = "all";
      } else if (key === "level") {
        AppState.filters.level = "all";
        const lSelect = document.getElementById("levelFilter");
        if (lSelect) lSelect.value = "all";
      } else if (key === "format") {
        AppState.filters.format = "all";
        const fSelect = document.getElementById("formatFilter");
        if (fSelect) fSelect.value = "all";
      } else if (key === "term") {
        AppState.filters.term = "Fall 2026";
        const tSelect = document.getElementById("termFilter");
        if (tSelect) tSelect.value = "Fall 2026";
      } else if (key === "avail") {
        AppState.filters.availability = "all";
        const aSelect = document.getElementById("availabilityFilter");
        if (aSelect) aSelect.value = "all";
      }
      renderCatalog();
    });
  });
}

function createCourseCardHTML(course) {
  const isEnrolled = AppState.enrolled.some(c => c.id === course.id);
  const isInCart = AppState.cart.some(c => c.id === course.id);

  // Seat ratio & bar calculation
  const seatPercent = Math.max(0, Math.min(100, Math.round((course.seatsAvailable / course.totalSeats) * 100)));
  let seatClass = "high";
  if (course.seatsAvailable <= 0) seatClass = "low";
  else if (course.seatsAvailable < 10) seatClass = "medium";

  // Action button status
  let actionButtonHtml = "";
  if (isEnrolled) {
    actionButtonHtml = `
      <button class="btn btn-secondary btn-sm" disabled aria-label="${course.code} already enrolled">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Enrolled</span>
      </button>
    `;
  } else if (isInCart) {
    actionButtonHtml = `
      <button class="btn btn-secondary btn-sm" data-action="remove-cart" data-id="${course.id}" aria-label="Remove ${course.code} from cart">
        <span>In Cart (Remove)</span>
      </button>
    `;
  } else if (course.seatsAvailable <= 0) {
    actionButtonHtml = `
      <button class="btn btn-secondary btn-sm" disabled aria-label="${course.code} course is full">
        <span>Waitlist Only</span>
      </button>
    `;
  } else {
    actionButtonHtml = `
      <button class="btn btn-primary btn-sm" data-action="add-cart" data-id="${course.id}" aria-label="Add ${course.code} to registration cart">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add to Cart</span>
      </button>
    `;
  }

  return `
    <article class="course-card" data-course-id="${course.id}">
      <div class="card-top-badges">
        <span class="dept-pill ${course.deptTag}">${course.department}</span>
        <span class="units-badge">${course.credits}.0 Units</span>
      </div>

      <div class="course-code-row">
        <span class="course-code">${course.code}</span>
        <span class="course-crn">CRN: ${course.crn}</span>
      </div>

      <h3 class="course-title">${course.title}</h3>
      <p class="course-desc-snip">${course.description}</p>

      <ul class="course-info-list" aria-label="Course schedule and location">
        <li class="course-info-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>${course.schedule}</span>
        </li>
        <li class="course-info-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>${course.location} &bull; ${course.format}</span>
        </li>
        <li class="course-info-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>${course.instructor}</span>
        </li>
      </ul>

      <div class="seats-status-wrapper">
        <div class="seats-labels">
          <span>Available Seats</span>
          <strong>${course.seatsAvailable} of ${course.totalSeats} Open</strong>
        </div>
        <div class="seats-bar-track" role="progressbar" aria-valuenow="${seatPercent}" aria-valuemin="0" aria-valuemax="100" aria-label="Seats available percentage">
          <div class="seats-bar-fill ${seatClass}" style="width: ${seatPercent}%;"></div>
        </div>
      </div>

      <div class="course-card-actions">
        <button class="btn btn-outline btn-sm" data-action="details" data-id="${course.id}" aria-label="View syllabus and prerequisites for ${course.code}">
          Details
        </button>
        ${actionButtonHtml}
      </div>
    </article>
  `;
}

function attachCourseCardEventListeners(container) {
  // Details button
  container.querySelectorAll('[data-action="details"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      openCourseDetailsModal(id);
    });
  });

  // Add to Cart button
  container.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      addToCart(id);
    });
  });

  // Remove from Cart button
  container.querySelectorAll('[data-action="remove-cart"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      removeFromCart(id);
    });
  });
}

function renderFeaturedCourses() {
  const homeFeaturedGrid = document.getElementById("homeFeaturedGrid");
  if (!homeFeaturedGrid) return;

  const featured = COURSES_DATA.filter(c => c.isFeatured);
  homeFeaturedGrid.innerHTML = featured.map(course => createCourseCardHTML(course)).join("");
  attachCourseCardEventListeners(homeFeaturedGrid);
}

// =============================================================================
// 6. REGISTRATION CART & WORKLOAD LOGIC
// =============================================================================
function initRegistrationCart() {
  const clearCartBtn = document.getElementById("clearCartBtn");
  const regForm = document.getElementById("registrationForm");
  const checkBoxes = [
    document.getElementById("checkPrereqs"),
    document.getElementById("checkFinancial"),
    document.getElementById("checkHonorCode")
  ];

  clearCartBtn?.addEventListener("click", () => {
    if (AppState.cart.length === 0) return;
    AppState.cart = [];
    renderCart();
    renderCatalog();
    renderStats();
    showToast("Registration cart cleared.", "info");
  });

  // Checkbox listeners to validate and enable submit button
  checkBoxes.forEach(cb => {
    cb?.addEventListener("change", validateRegistrationForm);
  });

  regForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateRegistrationForm()) return;

    if (AppState.cart.length === 0) {
      showToast("Your registration cart is empty. Please add courses first.", "warning");
      return;
    }

    const totalEnrolled = calculateTotalUnits(AppState.enrolled);
    const totalCart = calculateTotalUnits(AppState.cart);
    const combined = totalEnrolled + totalCart;

    if (combined > AppState.maxUnits) {
      const advOverride = document.getElementById("regAdvisorSignature")?.value.trim();
      if (!advOverride) {
        showToast(`Cannot exceed ${AppState.maxUnits} units without Advisor Clearance Code.`, "error");
        document.getElementById("regAdvisorSignature")?.focus();
        return;
      }
    }

    openRegConfirmModal();
  });
}

function addToCart(courseId) {
  const course = COURSES_DATA.find(c => c.id === courseId);
  if (!course) return;

  // Check if enrolled
  if (AppState.enrolled.some(c => c.id === course.id)) {
    showToast(`You are already enrolled in ${course.code}.`, "warning");
    return;
  }

  // Check if in cart
  if (AppState.cart.some(c => c.id === course.id)) {
    showToast(`${course.code} is already in your registration cart.`, "info");
    return;
  }

  // Check unit limit warning
  const currentUnits = calculateTotalUnits(AppState.enrolled) + calculateTotalUnits(AppState.cart);
  if (currentUnits + course.credits > AppState.maxUnits) {
    showToast(`Adding ${course.code} (${course.credits} units) exceeds the 18-unit limit. Advisor approval will be required at checkout.`, "warning");
  }

  AppState.cart.push({
    ...course,
    gradingOption: "Letter Grade (A - F)"
  });

  renderAll();
  showToast(`Added ${course.code} to registration cart!`, "success");
  announceToScreenReader(`${course.code} has been added to your course registration cart.`);
}

function removeFromCart(courseId) {
  const index = AppState.cart.findIndex(c => c.id === courseId);
  if (index !== -1) {
    const course = AppState.cart[index];
    AppState.cart.splice(index, 1);
    renderAll();
    showToast(`Removed ${course.code} from cart.`, "info");
    announceToScreenReader(`${course.code} removed from registration cart.`);
  }
}

function renderCart() {
  const container = document.getElementById("cartItemsContainer");
  const cartCardBadge = document.getElementById("cartCardBadge");
  const submitBtn = document.getElementById("submitRegistrationBtn");

  if (!container) return;

  if (cartCardBadge) {
    cartCardBadge.textContent = `${AppState.cart.length} ${AppState.cart.length === 1 ? 'course' : 'courses'}`;
  }

  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-box">
        <p>Your registration cart is empty.</p>
        <button class="btn btn-primary btn-sm" id="cartEmptyBrowseBtn">Browse Course Catalog</button>
      </div>
    `;
    document.getElementById("cartEmptyBrowseBtn")?.addEventListener("click", () => switchView("catalog-view"));
    validateRegistrationForm();
    return;
  }

  container.innerHTML = AppState.cart.map((course, idx) => `
    <div class="cart-item-card">
      <div class="cart-course-info">
        <div class="cart-course-header">
          <span class="cart-course-code">${course.code}</span>
          <span class="cart-course-title">${course.title}</span>
          <span class="badge badge-primary">${course.credits}.0 Units</span>
        </div>
        <div class="cart-course-meta">
          <span>CRN: ${course.crn}</span> &bull; 
          <span>${course.schedule}</span> &bull; 
          <span>${course.instructor}</span>
        </div>
      </div>

      <div class="cart-grading-picker">
        <label for="gradeSelect_${course.id}" class="sr-only">Grading basis for ${course.code}</label>
        <select id="gradeSelect_${course.id}" class="cart-grade-select" data-id="${course.id}">
          <option value="Letter Grade (A - F)" ${course.gradingOption.startsWith("Letter") ? "selected" : ""}>Letter Grade (A - F)</option>
          <option value="Pass / No Pass (P/NP)" ${course.gradingOption.startsWith("Pass") ? "selected" : ""}>Pass / No Pass (P/NP)</option>
        </select>
      </div>

      <button type="button" class="cart-remove-btn" data-id="${course.id}" aria-label="Remove ${course.code} from registration cart">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </button>
    </div>
  `).join("");

  // Grade option change
  container.querySelectorAll(".cart-grade-select").forEach(sel => {
    sel.addEventListener("change", (e) => {
      const id = sel.getAttribute("data-id");
      const targetCourse = AppState.cart.find(c => c.id === id);
      if (targetCourse) {
        targetCourse.gradingOption = e.target.value;
      }
    });
  });

  // Remove button
  container.querySelectorAll(".cart-remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      removeFromCart(id);
    });
  });

  validateRegistrationForm();
}

function validateRegistrationForm() {
  const submitBtn = document.getElementById("submitRegistrationBtn");
  const pCheck = document.getElementById("checkPrereqs")?.checked;
  const fCheck = document.getElementById("checkFinancial")?.checked;
  const hCheck = document.getElementById("checkHonorCode")?.checked;

  const hasItems = AppState.cart.length > 0;
  const allChecked = Boolean(pCheck && fCheck && hCheck);

  const isValid = hasItems && allChecked;

  if (submitBtn) {
    submitBtn.disabled = !isValid;
  }
  return isValid;
}

// =============================================================================
// 7. REGISTERED COURSES DATA TABLE LOGIC
// =============================================================================
function renderRegisteredTable() {
  const tbody = document.getElementById("registeredTableBody");
  const emptyNotice = document.getElementById("registeredTableEmpty");
  const table = document.getElementById("registeredCoursesTable");
  const totalUnitsCell = document.getElementById("tableTotalUnits");

  if (!tbody) return;

  const totalEnrolledUnits = calculateTotalUnits(AppState.enrolled);
  if (totalUnitsCell) {
    totalUnitsCell.innerHTML = `<strong>${totalEnrolledUnits}.0 Units</strong>`;
  }

  if (AppState.enrolled.length === 0) {
    tbody.innerHTML = "";
    if (table) table.hidden = true;
    if (emptyNotice) emptyNotice.hidden = false;
    return;
  }

  if (table) table.hidden = false;
  if (emptyNotice) emptyNotice.hidden = true;

  tbody.innerHTML = AppState.enrolled.map(course => `
    <tr>
      <td><strong>${course.crn}</strong></td>
      <td>
        <div><strong>${course.code}</strong></div>
        <div style="font-size: 0.85rem; color: #475569;">${course.title}</div>
      </td>
      <td><strong>${course.credits}.0</strong></td>
      <td><span class="badge badge-primary">${course.gradingOption || 'Letter Grade'}</span></td>
      <td>${course.schedule}</td>
      <td>
        <div>${course.location}</div>
        <div style="font-size: 0.82rem; color: #64748b;">${course.instructor}</div>
      </td>
      <td>
        <span class="badge badge-success">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Enrolled
        </span>
      </td>
      <td class="text-right">
        <button 
          class="btn btn-outline-danger btn-sm" 
          data-drop-id="${course.id}" 
          aria-label="Drop course ${course.code} ${course.title}"
        >
          Drop
        </button>
      </td>
    </tr>
  `).join("");

  // Attach drop event listeners
  tbody.querySelectorAll("[data-drop-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-drop-id");
      openDropModal(id);
    });
  });

  // Study list print
  document.getElementById("printScheduleBtn")?.addEventListener("click", () => {
    window.print();
  });
}

// =============================================================================
// 8. QUICK ADD BY CRN
// =============================================================================
function initQuickAdd() {
  const form = document.getElementById("quickAddForm");
  const input = document.getElementById("quickCrnInput");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const crn = input?.value.trim();
    if (!crn) return;

    const matched = COURSES_DATA.find(c => c.crn === crn);
    if (!matched) {
      showToast(`No course found matching CRN "${crn}". Please verify the number.`, "error");
      return;
    }

    addToCart(matched.id);
    if (input) input.value = "";
  });
}

// =============================================================================
// 9. MODALS MANAGEMENT (ACCESSIBLE FOCUS & ESCAPE HANDLING)
// =============================================================================
function initModals() {
  // 1. Registration Confirmation Modal
  const regModal = document.getElementById("regConfirmModal");
  const regCloseBtn = document.getElementById("regModalCloseBtn");
  const regCancelBtn = document.getElementById("regModalCancelBtn");
  const regConfirmBtn = document.getElementById("regModalConfirmBtn");

  regCloseBtn?.addEventListener("click", closeRegConfirmModal);
  regCancelBtn?.addEventListener("click", closeRegConfirmModal);
  regConfirmBtn?.addEventListener("click", executeRegistrationSubmission);

  // 2. Drop Confirmation Modal
  const dropModal = document.getElementById("dropConfirmModal");
  const dropCloseBtn = document.getElementById("dropModalCloseBtn");
  const dropCancelBtn = document.getElementById("dropModalCancelBtn");
  const dropConfirmBtn = document.getElementById("dropModalConfirmBtn");

  dropCloseBtn?.addEventListener("click", closeDropModal);
  dropCancelBtn?.addEventListener("click", closeDropModal);
  dropConfirmBtn?.addEventListener("click", executeCourseDrop);

  // 3. Course Details Modal
  const detailModal = document.getElementById("courseDetailModal");
  const detailCloseBtn = document.getElementById("courseDetailCloseBtn");
  const detailCloseActionBtn = document.getElementById("courseDetailCloseActionBtn");
  const detailAddToCartBtn = document.getElementById("detailAddToCartBtn");

  detailCloseBtn?.addEventListener("click", closeCourseDetailsModal);
  detailCloseActionBtn?.addEventListener("click", closeCourseDetailsModal);
  detailAddToCartBtn?.addEventListener("click", () => {
    if (AppState.activeDetailCourse) {
      addToCart(AppState.activeDetailCourse.id);
      closeCourseDetailsModal();
    }
  });

  // Global keydown listener for ESC & Tab trapping
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
    if (e.key === "Tab") {
      handleModalTabTrap(e);
    }
  });

  // Close modals on clicking backdrop outside dialog
  [regModal, dropModal, detailModal].forEach(backdrop => {
    backdrop?.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });
}

function handleModalTabTrap(e) {
  const activeModal = document.querySelector('.modal-backdrop:not([hidden])');
  if (!activeModal) return;

  const focusable = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return;

  const firstElem = focusable[0];
  const lastElem = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElem) {
      lastElem.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastElem) {
      firstElem.focus();
      e.preventDefault();
    }
  }
}

function openModal(modal) {
  if (!modal) return;
  AppState.lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";

  // Focus first interactive control in modal
  const firstInteractive = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (firstInteractive) {
    setTimeout(() => firstInteractive.focus(), 50);
  }
}

function closeModal(modal) {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = "";

  if (AppState.lastFocusedElement && typeof AppState.lastFocusedElement.focus === "function") {
    AppState.lastFocusedElement.focus();
  }
}

function closeAllModals() {
  closeRegConfirmModal();
  closeDropModal();
  closeCourseDetailsModal();
}

// Registration Confirm Modal
function openRegConfirmModal() {
  const modal = document.getElementById("regConfirmModal");
  const summaryList = document.getElementById("modalCourseSummaryList");
  const summaryUnits = document.getElementById("modalSummaryTotalUnits");

  const totalCartUnits = calculateTotalUnits(AppState.cart);
  if (summaryUnits) summaryUnits.textContent = `${totalCartUnits}.0 Units`;

  if (summaryList) {
    summaryList.innerHTML = AppState.cart.map(course => `
      <div class="modal-course-row">
        <div>
          <strong>${course.code}</strong> - ${course.title}
          <div style="font-size: 0.8rem; color: #64748b;">${course.schedule} &bull; ${course.gradingOption}</div>
        </div>
        <span class="badge badge-primary">${course.credits}.0 Units</span>
      </div>
    `).join("");
  }

  openModal(modal);
}

function closeRegConfirmModal() {
  closeModal(document.getElementById("regConfirmModal"));
}

function executeRegistrationSubmission() {
  closeRegConfirmModal();

  // Move cart items into enrolled
  AppState.cart.forEach(course => {
    AppState.enrolled.push({
      ...course,
      enrolledAt: new Date().toISOString()
    });
  });

  const registeredCount = AppState.cart.length;
  AppState.cart = [];

  // Reset compliance checkboxes
  const cb1 = document.getElementById("checkPrereqs");
  const cb2 = document.getElementById("checkFinancial");
  const cb3 = document.getElementById("checkHonorCode");
  if (cb1) cb1.checked = false;
  if (cb2) cb2.checked = false;
  if (cb3) cb3.checked = false;

  renderAll();
  showToast(`Congratulations! Successfully enrolled in ${registeredCount} courses for Fall 2026.`, "success");
  announceToScreenReader(`Registration confirmed. Successfully enrolled in ${registeredCount} courses.`);

  // Scroll to registered courses table
  const tableSection = document.getElementById("registeredTableSection");
  tableSection?.scrollIntoView({ behavior: "smooth" });
}

// Drop Modal
function openDropModal(courseId) {
  const course = AppState.enrolled.find(c => c.id === courseId);
  if (!course) return;

  AppState.pendingDropCourse = course;
  const nameEl = document.getElementById("dropCourseTargetName");
  if (nameEl) nameEl.textContent = `${course.code} (${course.title})`;

  openModal(document.getElementById("dropConfirmModal"));
}

function closeDropModal() {
  AppState.pendingDropCourse = null;
  closeModal(document.getElementById("dropConfirmModal"));
}

function executeCourseDrop() {
  if (!AppState.pendingDropCourse) return;
  const dropped = AppState.pendingDropCourse;

  AppState.enrolled = AppState.enrolled.filter(c => c.id !== dropped.id);
  closeDropModal();

  renderAll();
  showToast(`Dropped ${dropped.code}. Your schedule has been updated.`, "info");
  announceToScreenReader(`Course ${dropped.code} was dropped from your schedule.`);
}

// Course Details Modal
function openCourseDetailsModal(courseId) {
  const course = COURSES_DATA.find(c => c.id === courseId);
  if (!course) return;

  AppState.activeDetailCourse = course;
  const modal = document.getElementById("courseDetailModal");

  document.getElementById("detailCourseDept").textContent = course.department;
  document.getElementById("courseDetailTitle").textContent = `${course.code}: ${course.title}`;
  document.getElementById("detailDescriptionText").textContent = course.description;
  document.getElementById("detailScheduleInfo").textContent = `Schedule: ${course.schedule}`;
  document.getElementById("detailLocationInfo").textContent = `Location: ${course.location} (${course.format})`;
  document.getElementById("detailInstructorInfo").textContent = `Instructor: ${course.instructor}`;
  document.getElementById("detailDeptInfo").textContent = `Academic Department: ${course.department}`;
  document.getElementById("detailPrereqInfo").textContent = course.prereqs;

  const ratioEl = document.getElementById("detailSeatRatio");
  const fillEl = document.getElementById("detailSeatFill");
  const meterEl = document.getElementById("detailSeatMeter");

  const seatPercent = Math.round((course.seatsAvailable / course.totalSeats) * 100);
  if (ratioEl) ratioEl.textContent = `${course.seatsAvailable} / ${course.totalSeats} Seats Available`;
  if (fillEl) fillEl.style.width = `${seatPercent}%`;
  if (meterEl) meterEl.setAttribute("aria-valuenow", seatPercent);

  // Meta tags
  const tagsContainer = document.getElementById("detailMetaTags");
  if (tagsContainer) {
    tagsContainer.innerHTML = `
      <span class="badge badge-primary">${course.credits}.0 Credits</span>
      <span class="badge badge-accent">CRN: ${course.crn}</span>
      <span class="badge badge-indigo">${course.level}</span>
      <span class="badge badge-success">${course.term}</span>
    `;
  }

  // Update button in details modal
  const isEnrolled = AppState.enrolled.some(c => c.id === course.id);
  const isInCart = AppState.cart.some(c => c.id === course.id);
  const addBtn = document.getElementById("detailAddToCartBtn");

  if (addBtn) {
    if (isEnrolled) {
      addBtn.textContent = "Already Enrolled";
      addBtn.disabled = true;
    } else if (isInCart) {
      addBtn.textContent = "Already in Cart";
      addBtn.disabled = true;
    } else if (course.seatsAvailable <= 0) {
      addBtn.textContent = "Course Full (Waitlist)";
      addBtn.disabled = true;
    } else {
      addBtn.textContent = `Add to Registration Cart (${course.credits} Units)`;
      addBtn.disabled = false;
    }
  }

  openModal(modal);
}

function closeCourseDetailsModal() {
  AppState.activeDetailCourse = null;
  closeModal(document.getElementById("courseDetailModal"));
}

// =============================================================================
// 10. PROFILE VIEW & PREFERENCES
// =============================================================================
function initProfileView() {
  const prefForm = document.getElementById("profilePreferencesForm");
  prefForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Registration preferences updated successfully!", "success");
  });

  document.getElementById("advisorScheduleBtn")?.addEventListener("click", () => {
    showToast("Advising calendar opened: Dr. Evelyn Carter has open slots on Wednesday 2:00 PM.", "info");
  });

  document.getElementById("contactAdvisorBtn")?.addEventListener("click", () => {
    showToast("Direct advising chat initiated with Dr. Evelyn Carter.", "info");
  });
}

// =============================================================================
// 11. STATS, PROGRESS BARS & SYNCHRONIZATION
// =============================================================================
function calculateTotalUnits(courseList) {
  return courseList.reduce((acc, curr) => acc + (curr.credits || 0), 0);
}

function renderStats() {
  const enrolledUnits = calculateTotalUnits(AppState.enrolled);
  const cartUnits = calculateTotalUnits(AppState.cart);
  const combinedUnits = enrolledUnits + cartUnits;

  // Header badges
  const cartBadge = document.getElementById("cartCountBadge");
  const catalogCartBadge = document.getElementById("catalogCartCount");
  const headerUnits = document.getElementById("headerEnrolledUnits");

  if (cartBadge) cartBadge.textContent = AppState.cart.length;
  if (catalogCartBadge) catalogCartBadge.textContent = AppState.cart.length;
  if (headerUnits) headerUnits.textContent = `${enrolledUnits} Units`;

  // Home view stats
  const homeEnrolledCount = document.getElementById("homeEnrolledCount");
  const homeUnitsCount = document.getElementById("homeUnitsCount");
  const creditPercent = document.getElementById("creditProgressPercent");
  const creditBar = document.getElementById("creditProgressBar");

  if (homeEnrolledCount) homeEnrolledCount.textContent = AppState.enrolled.length;
  if (homeUnitsCount) homeUnitsCount.textContent = `${enrolledUnits} / ${AppState.maxUnits}`;

  const pct = Math.min(100, Math.round((enrolledUnits / AppState.maxUnits) * 100));
  if (creditPercent) creditPercent.textContent = `${pct}%`;
  if (creditBar) {
    creditBar.setAttribute("aria-valuenow", enrolledUnits);
    const fill = creditBar.querySelector(".progress-fill");
    if (fill) fill.style.width = `${pct}%`;
  }

  // Registration workload card
  const regTotalEnrolled = document.getElementById("regTotalEnrolledUnits");
  const regTotalCart = document.getElementById("regTotalCartUnits");
  const regCombined = document.getElementById("regCombinedUnits");
  const regMeter = document.getElementById("combinedCreditMeter");
  const meterFillEnrolled = document.getElementById("meterFillEnrolled");
  const meterFillCart = document.getElementById("meterFillCart");
  const regFullTimeLabel = document.getElementById("regFullTimeLabel");

  if (regTotalEnrolled) regTotalEnrolled.textContent = `${enrolledUnits}.0 Units`;
  if (regTotalCart) regTotalCart.textContent = `${cartUnits}.0 Units`;
  if (regCombined) regCombined.textContent = `${combinedUnits} / ${AppState.maxUnits}`;

  if (regMeter) {
    regMeter.setAttribute("aria-valuenow", combinedUnits);
    const pctEnrolled = Math.min(100, (enrolledUnits / AppState.maxUnits) * 100);
    const pctCart = Math.min(100 - pctEnrolled, (cartUnits / AppState.maxUnits) * 100);

    if (meterFillEnrolled) meterFillEnrolled.style.width = `${pctEnrolled}%`;
    if (meterFillCart) meterFillCart.style.width = `${pctCart}%`;
  }

  if (regFullTimeLabel) {
    if (enrolledUnits >= 12) {
      regFullTimeLabel.textContent = "Status: Full-Time Active (Good)";
      regFullTimeLabel.style.color = "var(--color-success)";
    } else {
      const needed = 12 - enrolledUnits;
      regFullTimeLabel.textContent = `Need +${needed} Units for Full-Time`;
      regFullTimeLabel.style.color = "var(--color-accent-amber)";
    }
  }
}

function renderAll() {
  renderCatalog();
  renderFeaturedCourses();
  renderCart();
  renderRegisteredTable();
  renderStats();
}

// =============================================================================
// 12. TOAST NOTIFICATIONS & ACCESSIBILITY ANNOUNCER
// =============================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "status");

  let iconSvg = "";
  if (type === "success") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      ${iconSvg}
      <span>${message}</span>
    </div>
    <button style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #64748b;" aria-label="Dismiss toast">&times;</button>
  `;

  toast.querySelector("button").addEventListener("click", () => toast.remove());
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.transition = "opacity 200ms ease, transform 200ms ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(() => toast.remove(), 200);
    }
  }, 4000);
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById("srLiveStatus");
  if (liveRegion) {
    liveRegion.textContent = message;
  }
}
