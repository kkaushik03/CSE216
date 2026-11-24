/**
 * TritonRegister - University Course Registration System
 * Core Application Logic & State Management
 */

// ==========================================================================
// 1. SAMPLE COURSE DATA (16 Realistic University Courses)
// ==========================================================================
const DEFAULT_COURSES = [
  {
    id: "CSE110",
    code: "CSE 110",
    title: "Software Engineering",
    department: "Computer Science",
    deptKey: "cs",
    level: "upper",
    credits: 4,
    instructor: "Prof. Gary Gillespie",
    rating: 4.8,
    schedule: "Mon, Wed, Fri 10:00 AM - 10:50 AM",
    days: ["Mon", "Wed", "Fri"],
    startHour: 10,
    durationHours: 1,
    room: "Center Hall 105",
    capacity: 150,
    enrolled: 142,
    prereqs: "CSE 100 or DSC 30",
    description: "Team-based software engineering principles, Agile sprints, Git workflows, continuous integration, design patterns, and modern web application development.",
    color: "#4f46e5",
    tagBg: "#eef2ff",
    tagColor: "#4338ca"
  },
  {
    id: "CSE150A",
    code: "CSE 150A",
    title: "Introduction to Artificial Intelligence",
    department: "Computer Science",
    deptKey: "cs",
    level: "upper",
    credits: 4,
    instructor: "Prof. Sanjoy Dasgupta",
    rating: 4.9,
    schedule: "Tue, Thu 02:00 PM - 03:20 PM",
    days: ["Tue", "Thu"],
    startHour: 14,
    durationHours: 1.5,
    room: "Warren Lecture 2001",
    capacity: 180,
    enrolled: 175,
    prereqs: "CSE 101 & MATH 180A",
    description: "Foundational AI techniques: state-space search, heuristic optimization, game theory, Bayesian belief networks, Markov decision processes, and reinforcement learning.",
    color: "#3b82f6",
    tagBg: "#eff6ff",
    tagColor: "#1d4ed8"
  },
  {
    id: "DSC100",
    code: "DSC 100",
    title: "Principles of Data Science",
    department: "Data Science",
    deptKey: "ds",
    level: "upper",
    credits: 4,
    instructor: "Prof. Justin Eldridge",
    rating: 4.7,
    schedule: "Mon, Wed, Fri 01:00 PM - 01:50 PM",
    days: ["Mon", "Wed", "Fri"],
    startHour: 13,
    durationHours: 1,
    room: "Mandeville Auditorium B",
    capacity: 120,
    enrolled: 110,
    prereqs: "DSC 30 & DSC 40A",
    description: "End-to-end data pipelines: data ingestion, tidying, feature engineering, exploratory statistical analysis, visualization, and distributed parallel computing.",
    color: "#7c3aed",
    tagBg: "#f5f3ff",
    tagColor: "#6d28d9"
  },
  {
    id: "COGS120",
    code: "COGS 120",
    title: "Human-Computer Interaction Design",
    department: "Cognitive Science & Design",
    deptKey: "cogs",
    level: "upper",
    credits: 4,
    instructor: "Prof. Scott Klemmer",
    rating: 4.9,
    schedule: "Tue, Thu 11:00 AM - 12:20 PM",
    days: ["Tue", "Thu"],
    startHour: 11,
    durationHours: 1.5,
    room: "Cognitive Science 001",
    capacity: 90,
    enrolled: 85,
    prereqs: "COGS 1 or COGS 10",
    description: "Theory and practice of designing user interfaces: user research, contextual inquiry, wireframing, interactive prototyping, cognitive walkthroughs, and accessibility.",
    color: "#ea580c",
    tagBg: "#fff7ed",
    tagColor: "#c2410c"
  },
  {
    id: "MATH180A",
    code: "MATH 180A",
    title: "Introduction to Probability",
    department: "Mathematics",
    deptKey: "math",
    level: "upper",
    credits: 4,
    instructor: "Prof. Ruth Williams",
    rating: 4.5,
    schedule: "Mon, Wed, Fri 09:00 AM - 09:50 AM",
    days: ["Mon", "Wed", "Fri"],
    startHour: 9,
    durationHours: 1,
    room: "AP&M 2402",
    capacity: 200,
    enrolled: 188,
    prereqs: "MATH 20C or MATH 31BH",
    description: "Probability spaces, combinatorics, random variables, cumulative distribution functions, joint distributions, mathematical expectation, and the Central Limit Theorem.",
    color: "#e11d48",
    tagBg: "#fff1f2",
    tagColor: "#be123c"
  },
  {
    id: "BENG100",
    code: "BENG 100",
    title: "Frontiers of Bioengineering",
    department: "Bioengineering & Biology",
    deptKey: "bio",
    level: "upper",
    credits: 3,
    instructor: "Prof. Bernhard Palsson",
    rating: 4.6,
    schedule: "Tue, Thu 09:30 AM - 10:50 AM",
    days: ["Tue", "Thu"],
    startHour: 9.5,
    durationHours: 1.5,
    room: "Powell-Focht 110",
    capacity: 75,
    enrolled: 62,
    prereqs: "BENG 1 & CHEM 6A",
    description: "Exploration of cellular engineering, synthetic biology, molecular imaging, medical robotics, and modern genome-scale biological simulations.",
    color: "#059669",
    tagBg: "#ecfdf5",
    tagColor: "#047857"
  },
  {
    id: "ECON100A",
    code: "ECON 100A",
    title: "Microeconomics I: Consumer Theory",
    department: "Economics & Business",
    deptKey: "econ",
    level: "upper",
    credits: 4,
    instructor: "Prof. Mark Machina",
    rating: 4.4,
    schedule: "Mon, Wed, Fri 11:00 AM - 11:50 AM",
    days: ["Mon", "Wed", "Fri"],
    startHour: 11,
    durationHours: 1,
    room: "Peterson Hall 108",
    capacity: 250,
    enrolled: 245,
    prereqs: "ECON 1 & MATH 20C",
    description: "Formal mathematical modeling of consumer choices, utility maximization subject to budget constraints, demand functions, elasticity, and price indices.",
    color: "#0284c7",
    tagBg: "#f0f9ff",
    tagColor: "#0369a1"
  },
  {
    id: "CSE120",
    code: "CSE 120",
    title: "Principles of Computer Operating Systems",
    department: "Computer Science",
    deptKey: "cs",
    level: "upper",
    credits: 4,
    instructor: "Prof. Geoffrey Voelker",
    rating: 4.8,
    schedule: "Tue, Thu 12:30 PM - 01:50 PM",
    days: ["Tue", "Thu"],
    startHour: 12.5,
    durationHours: 1.5,
    room: "Center Hall 115",
    capacity: 160,
    enrolled: 154,
    prereqs: "CSE 100 & CSE 30",
    description: "Fundamental abstractions in OS design: multi-threading, concurrency control, locks, semaphores, virtual memory management, page replacement, and file systems.",
    color: "#4f46e5",
    tagBg: "#eef2ff",
    tagColor: "#4338ca"
  },
  {
    id: "VIS142",
    code: "VIS 142",
    title: "Digital Media & Graphic Communication",
    department: "Visual Arts & Media",
    deptKey: "art",
    level: "lower",
    credits: 4,
    instructor: "Prof. Amy Adler",
    rating: 4.9,
    schedule: "Mon, Wed 02:00 PM - 03:50 PM",
    days: ["Mon", "Wed"],
    startHour: 14,
    durationHours: 2,
    room: "Visual Arts Facility 284",
    capacity: 40,
    enrolled: 38,
    prereqs: "None",
    description: "Creative digital production studio focusing on typography, color theory, layout systems, vector illustrations, and responsive visual branding.",
    color: "#db2777",
    tagBg: "#fdf2f8",
    tagColor: "#be185d"
  },
  {
    id: "PSYC101",
    code: "PSYC 101",
    title: "Introduction to Cognitive Psychology",
    department: "Cognitive Science & Design",
    deptKey: "cogs",
    level: "lower",
    credits: 4,
    instructor: "Prof. John Wixted",
    rating: 4.7,
    schedule: "Tue, Thu 03:30 PM - 04:50 PM",
    days: ["Tue", "Thu"],
    startHour: 15.5,
    durationHours: 1.5,
    room: "McGill Hall 1109",
    capacity: 180,
    enrolled: 160,
    prereqs: "PSYC 1 or COGS 1",
    description: "Investigates empirical findings on human perceptual systems, working memory, long-term memory retrieval, mental representation, and judgment.",
    color: "#d97706",
    tagBg: "#fffbeb",
    tagColor: "#b45309"
  },
  {
    id: "CSE258",
    code: "CSE 258",
    title: "Recommender Systems & Web Mining",
    department: "Computer Science",
    deptKey: "cs",
    level: "grad",
    credits: 4,
    instructor: "Prof. Julian McAuley",
    rating: 4.9,
    schedule: "Mon, Wed 03:30 PM - 04:50 PM",
    days: ["Mon", "Wed"],
    startHour: 15.5,
    durationHours: 1.5,
    room: "Warren Lecture 2111",
    capacity: 95,
    enrolled: 92,
    prereqs: "CSE 150A or CSE 100",
    description: "Machine learning for personalized recommendation: matrix factorization, latent factor models, collaborative filtering, deep recommender architectures, and NLP for reviews.",
    color: "#6366f1",
    tagBg: "#eef2ff",
    tagColor: "#4338ca"
  },
  {
    id: "CHEM140A",
    code: "CHEM 140A",
    title: "Organic Chemistry I",
    department: "Bioengineering & Biology",
    deptKey: "bio",
    level: "upper",
    credits: 4,
    instructor: "Prof. Haim Weizman",
    rating: 4.6,
    schedule: "Mon, Wed, Fri 12:00 PM - 12:50 PM",
    days: ["Mon", "Wed", "Fri"],
    startHour: 12,
    durationHours: 1,
    room: "York Hall 2622",
    capacity: 300,
    enrolled: 292,
    prereqs: "CHEM 6C",
    description: "Atomic structure, chemical bonding, stereochemistry, conformational dynamics, and mechanistic pathways of nucleophilic substitution and elimination reactions.",
    color: "#10b981",
    tagBg: "#ecfdf5",
    tagColor: "#047857"
  },
  {
    id: "MGT181",
    code: "MGT 181",
    title: "Enterprise Finance & Valuation",
    department: "Economics & Business",
    deptKey: "econ",
    level: "upper",
    credits: 4,
    instructor: "Prof. Michael Melvin",
    rating: 4.7,
    schedule: "Tue, Thu 08:00 AM - 09:20 AM",
    days: ["Tue", "Thu"],
    startHour: 8,
    durationHours: 1.5,
    room: "Rady School 1S114",
    capacity: 65,
    enrolled: 56,
    prereqs: "ECON 1 or MGT 4",
    description: "Corporate capital budgeting, cost of capital, discounted cash flow (DCF) valuation, dividend policy, capital structure optimization, and venture capital financing.",
    color: "#0284c7",
    tagBg: "#f0f9ff",
    tagColor: "#0369a1"
  },
  {
    id: "CSE101",
    code: "CSE 101",
    title: "Design and Analysis of Algorithms",
    department: "Computer Science",
    deptKey: "cs",
    level: "upper",
    credits: 4,
    instructor: "Prof. Russell Impagliazzo",
    rating: 4.7,
    schedule: "Mon, Wed, Fri 08:00 AM - 08:50 AM",
    days: ["Mon", "Wed", "Fri"],
    startHour: 8,
    durationHours: 1,
    room: "Center Hall 109",
    capacity: 220,
    enrolled: 216,
    prereqs: "CSE 21 & CSE 100",
    description: "Design paradigms including divide-and-conquer, greedy heuristics, dynamic programming, maximum network flow, NP-completeness proofs, and randomized algorithms.",
    color: "#4f46e5",
    tagBg: "#eef2ff",
    tagColor: "#4338ca"
  },
  {
    id: "COMM106G",
    code: "COMM 106G",
    title: "Cultural Communication in Technology",
    department: "Humanities & Social Sciences",
    deptKey: "hum",
    level: "upper",
    credits: 4,
    instructor: "Prof. Lilly Irani",
    rating: 4.8,
    schedule: "Tue, Thu 05:00 PM - 06:20 PM",
    days: ["Tue", "Thu"],
    startHour: 17,
    durationHours: 1.5,
    room: "Sequoyah Hall 147",
    capacity: 50,
    enrolled: 40,
    prereqs: "None",
    description: "Critical inquiry into how digital platforms, automated decision engines, and technology supply chains shape social interactions, cultural identity, and digital labor.",
    color: "#b45309",
    tagBg: "#fef3c7",
    tagColor: "#92400e"
  },
  {
    id: "MATH20E",
    code: "MATH 20E",
    title: "Vector Calculus",
    department: "Mathematics",
    deptKey: "math",
    level: "lower",
    credits: 4,
    instructor: "Prof. Peter Ebenfelt",
    rating: 4.5,
    schedule: "Mon, Wed, Fri 10:00 AM - 10:50 AM",
    days: ["Mon", "Wed", "Fri"],
    startHour: 10,
    durationHours: 1,
    room: "AP&M 2301",
    capacity: 180,
    enrolled: 168,
    prereqs: "MATH 20C or MATH 20D",
    description: "Differential and integral calculus of vector-valued fields in Euclidean spaces: double and triple integrals, Green's Theorem, Stokes' Theorem, and Gauss' Divergence Theorem.",
    color: "#e11d48",
    tagBg: "#fff1f2",
    tagColor: "#be123c"
  }
];

// Initial default student profile data
const DEFAULT_STUDENT = {
  name: "Maya Patel",
  id: "A16894021",
  email: "mpatel@university.edu",
  major: "Computer Science & Data Analytics (B.S.)",
  minor: "Cognitive Science",
  gpa: "3.88",
  classLevel: "Senior",
  standing: "Good Standing (Honors)",
  maxCredits: 20,
  term: "Fall Quarter 2026",
  initialRegistered: [
    { courseId: "CSE110", gradeOption: "Letter Grade (A-F)", registeredAt: "2026-09-12 09:15" },
    { courseId: "DSC100", gradeOption: "Letter Grade (A-F)", registeredAt: "2026-09-12 09:18" },
    { courseId: "COGS120", gradeOption: "Letter Grade (A-F)", registeredAt: "2026-09-12 09:22" }
  ]
};

// ==========================================================================
// 2. STATE MANAGEMENT & STORAGE
// ==========================================================================
const STORAGE_KEY = "triton_registration_state_v1";

let appState = {
  courses: [],
  student: {},
  registered: [] // Array of { courseId, gradeOption, registeredAt, confirmationId }
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      appState = JSON.parse(saved);
      return;
    } catch (e) {
      console.warn("Could not parse saved state. Loading default data.", e);
    }
  }
  // Load default initial state
  appState = {
    courses: JSON.parse(JSON.stringify(DEFAULT_COURSES)),
    student: JSON.parse(JSON.stringify(DEFAULT_STUDENT)),
    registered: JSON.parse(JSON.stringify(DEFAULT_STUDENT.initialRegistered))
  };
  saveState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

function resetDemoData() {
  const shouldReset = (typeof window !== "undefined" && typeof window.confirm === "function") 
    ? window.confirm("Reset registration data to original demo state?") 
    : true;

  if (shouldReset) {
    localStorage.removeItem(STORAGE_KEY);
    loadState();
    refreshAllViews();
    showToast("Data Reset", "Demo data has been restored to default.", "info");
  }
}

// ==========================================================================
// 3. NAVIGATION CONTROLLER (SPA Routing)
// ==========================================================================
function navigateTo(pageId, options = {}) {
  const validPages = ["home", "catalog", "registration", "profile"];
  if (!validPages.includes(pageId)) {
    pageId = "home";
  }

  // Update hash without triggering reload
  window.location.hash = pageId;

  // Toggle page visibility
  document.querySelectorAll(".page-view").forEach(page => {
    page.classList.remove("active");
  });
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  // Update active state in navbar
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-page") === pageId) {
      btn.classList.add("active");
    }
  });

  // Close mobile navigation drawer if open
  const navMenu = document.getElementById("nav-menu");
  if (navMenu && navMenu.classList.contains("open")) {
    navMenu.classList.remove("open");
  }

  // Page-specific initialization hooks
  if (pageId === "catalog") {
    if (options.searchQuery !== undefined) {
      const searchInput = document.getElementById("catalog-search");
      if (searchInput) searchInput.value = options.searchQuery;
    }
    if (options.department !== undefined) {
      const deptFilter = document.getElementById("filter-dept");
      if (deptFilter) deptFilter.value = options.department;
    }
    renderCatalog();
  } else if (pageId === "registration") {
    populateRegistrationDropdown();
    if (options.preselectedCourseId) {
      const select = document.getElementById("reg-course-select");
      if (select) {
        select.value = options.preselectedCourseId;
        onRegistrationCourseChange();
      }
    }
    updateRegistrationSidebar();
  } else if (pageId === "profile") {
    renderProfileView();
  } else if (pageId === "home") {
    updateHomeStats();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Toggle mobile navigation menu
function toggleMobileMenu() {
  const navMenu = document.getElementById("nav-menu");
  if (navMenu) {
    navMenu.classList.toggle("open");
  }
}

// Listen for browser back/forward and URL hash changes
window.addEventListener("hashchange", () => {
  const page = window.location.hash.replace("#", "") || "home";
  navigateTo(page);
});

// ==========================================================================
// 4. COMPUTED HELPERS & STATE GETTERS
// ==========================================================================
function getCourseById(courseId) {
  return appState.courses.find(c => c.id === courseId);
}

function isCourseRegistered(courseId) {
  return appState.registered.some(r => r.courseId === courseId);
}

function getTotalRegisteredCredits() {
  return appState.registered.reduce((sum, item) => {
    const course = getCourseById(item.courseId);
    return sum + (course ? course.credits : 0);
  }, 0);
}

function updateBadgeCounts() {
  const count = appState.registered.length;
  const badge = document.getElementById("nav-reg-count");
  if (badge) {
    badge.textContent = count;
  }
}

// ==========================================================================
// 5. VIEW 1: HOME PAGE LOGIC
// ==========================================================================
function updateHomeStats() {
  const enrolledCredits = getTotalRegisteredCredits();
  const enrolledCount = appState.registered.length;
  const totalCourses = appState.courses.length;

  const statCredits = document.getElementById("stat-enrolled-credits");
  if (statCredits) statCredits.textContent = `${enrolledCredits} / 20`;

  const statClasses = document.getElementById("stat-enrolled-classes");
  if (statClasses) statClasses.textContent = `${enrolledCount} Classes`;

  const statTotal = document.getElementById("stat-total-courses");
  if (statTotal) statTotal.textContent = totalCourses;
}

// Quick filter jump from Home page
function jumpToCatalogFilter(deptKey) {
  navigateTo("catalog", { department: deptKey });
}

// ==========================================================================
// 6. VIEW 2: COURSE CATALOG LOGIC
// ==========================================================================
function renderCatalog() {
  const grid = document.getElementById("courses-grid");
  const countDisplay = document.getElementById("course-results-count");
  const filterTagsContainer = document.getElementById("active-filter-tags");
  if (!grid) return;

  const searchQuery = (document.getElementById("catalog-search")?.value || "").toLowerCase().trim();
  const deptFilter = document.getElementById("filter-dept")?.value || "all";
  const levelFilter = document.getElementById("filter-level")?.value || "all";
  const creditsFilter = document.getElementById("filter-credits")?.value || "all";
  const availFilter = document.getElementById("filter-availability")?.value || "all";
  const sortBy = document.getElementById("sort-courses")?.value || "code-asc";

  // Filter courses
  let filtered = appState.courses.filter(course => {
    // Search match
    if (searchQuery) {
      const matchSearch =
        course.code.toLowerCase().includes(searchQuery) ||
        course.title.toLowerCase().includes(searchQuery) ||
        course.instructor.toLowerCase().includes(searchQuery) ||
        course.department.toLowerCase().includes(searchQuery) ||
        course.description.toLowerCase().includes(searchQuery);
      if (!matchSearch) return false;
    }

    // Department match
    if (deptFilter !== "all" && course.deptKey !== deptFilter) {
      return false;
    }

    // Level match
    if (levelFilter !== "all" && course.level !== levelFilter) {
      return false;
    }

    // Credits match
    if (creditsFilter !== "all" && course.credits !== parseInt(creditsFilter, 10)) {
      return false;
    }

    // Availability match
    const seatsRemaining = course.capacity - course.enrolled;
    if (availFilter === "open" && seatsRemaining <= 0) {
      return false;
    }
    if (availFilter === "almost-full" && (seatsRemaining > 10 || seatsRemaining <= 0)) {
      return false;
    }

    return true;
  });

  // Sort courses
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "code-asc":
        return a.code.localeCompare(b.code);
      case "code-desc":
        return b.code.localeCompare(a.code);
      case "credits-high":
        return b.credits - a.credits;
      case "credits-low":
        return a.credits - b.credits;
      case "seats-high":
        return (b.capacity - b.enrolled) - (a.capacity - a.enrolled);
      case "rating-high":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Update counter
  if (countDisplay) {
    countDisplay.innerHTML = `Showing <span>${filtered.length}</span> of ${appState.courses.length} courses`;
  }

  // Render active filter chips
  if (filterTagsContainer) {
    filterTagsContainer.innerHTML = "";
    if (deptFilter !== "all") {
      createFilterChip(filterTagsContainer, `Dept: ${deptFilter.toUpperCase()}`, () => {
        document.getElementById("filter-dept").value = "all";
        renderCatalog();
      });
    }
    if (levelFilter !== "all") {
      createFilterChip(filterTagsContainer, `Level: ${levelFilter}`, () => {
        document.getElementById("filter-level").value = "all";
        renderCatalog();
      });
    }
    if (creditsFilter !== "all") {
      createFilterChip(filterTagsContainer, `Credits: ${creditsFilter}`, () => {
        document.getElementById("filter-credits").value = "all";
        renderCatalog();
      });
    }
    if (availFilter !== "all") {
      createFilterChip(filterTagsContainer, `Seats: ${availFilter}`, () => {
        document.getElementById("filter-availability").value = "all";
        renderCatalog();
      });
    }
    if (searchQuery) {
      createFilterChip(filterTagsContainer, `Search: "${searchQuery}"`, () => {
        document.getElementById("catalog-search").value = "";
        renderCatalog();
      });
    }
  }

  // Render cards
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h3>No matching courses found</h3>
        <p>Try clearing your filters or adjusting your search keyword.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="resetCatalogFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(course => {
    const isEnrolled = isCourseRegistered(course.id);
    const seatsLeft = Math.max(0, course.capacity - course.enrolled);
    const fillPercent = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));
    
    let capacityFillClass = "fill-green";
    if (fillPercent >= 90) capacityFillClass = "fill-red";
    else if (fillPercent >= 75) capacityFillClass = "fill-yellow";

    return `
      <div class="course-card ${isEnrolled ? "is-enrolled" : ""}" id="card-${course.id}">
        <div class="course-card-top-bar" style="background: ${course.color};"></div>
        ${isEnrolled ? '<div class="enrolled-ribbon">Enrolled</div>' : ""}
        
        <div class="course-card-body">
          <div class="course-meta-top">
            <span class="dept-badge" style="background: ${course.tagBg}; color: ${course.tagColor}; border: 1px solid ${course.tagColor}30;">
              ${course.department}
            </span>
            <span class="units-pill">${course.credits} Units</span>
          </div>

          <h3 class="course-code">${escapeHtml(course.code)}</h3>
          <p class="course-title">${escapeHtml(course.title)}</p>

          <div class="course-details-list">
            <div class="course-detail-item" title="Instructor & Student Evaluation Rating">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span><strong>${escapeHtml(course.instructor)}</strong> (★ ${course.rating})</span>
            </div>
            <div class="course-detail-item" title="Class Meeting Time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${escapeHtml(course.schedule)}</span>
            </div>
            <div class="course-detail-item" title="Lecture Hall">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${escapeHtml(course.room)}</span>
            </div>
          </div>

          <div class="capacity-box">
            <div class="capacity-labels">
              <span>Seats: ${seatsLeft > 0 ? `${seatsLeft} open` : "Full (Waitlist)"}</span>
              <span>${course.enrolled}/${course.capacity} (${fillPercent}%)</span>
            </div>
            <div class="capacity-bar-track">
              <div class="capacity-bar-fill ${capacityFillClass}" style="width: ${fillPercent}%;"></div>
            </div>
          </div>

          <div class="course-card-actions">
            <button class="btn btn-secondary btn-sm" onclick="openCourseDetailsModal('${course.id}')" title="View detailed syllabus and prerequisites">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Details
            </button>
            ${isEnrolled ? `
              <button class="btn btn-success btn-sm" disabled style="opacity: 0.9; cursor: default;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Enrolled
              </button>
            ` : `
              <button class="btn btn-primary btn-sm" onclick="quickRegisterCourse('${course.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                Register
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function createFilterChip(container, text, onRemove) {
  const chip = document.createElement("span");
  chip.className = "filter-chip";
  chip.innerHTML = `
    ${escapeHtml(text)}
    <button type="button" class="filter-chip-remove" title="Remove filter">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 14px; height: 14px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;
  chip.querySelector(".filter-chip-remove").addEventListener("click", onRemove);
  container.appendChild(chip);
}

function resetCatalogFilters() {
  const search = document.getElementById("catalog-search");
  const dept = document.getElementById("filter-dept");
  const level = document.getElementById("filter-level");
  const credits = document.getElementById("filter-credits");
  const avail = document.getElementById("filter-availability");
  const sort = document.getElementById("sort-courses");

  if (search) search.value = "";
  if (dept) dept.value = "all";
  if (level) level.value = "all";
  if (credits) credits.value = "all";
  if (avail) avail.value = "all";
  if (sort) sort.value = "code-asc";

  renderCatalog();
  showToast("Filters Cleared", "Catalog is displaying all available courses.", "info");
}

// Quick register directly from Catalog card
function quickRegisterCourse(courseId) {
  navigateTo("registration", { preselectedCourseId: courseId });
}

// ==========================================================================
// 7. VIEW 3: REGISTRATION PAGE LOGIC
// ==========================================================================
function populateRegistrationDropdown() {
  const select = document.getElementById("reg-course-select");
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = `<option value="">-- Choose a Course from Catalog --</option>`;

  appState.courses.forEach(course => {
    const isEnrolled = isCourseRegistered(course.id);
    const seatsRemaining = course.capacity - course.enrolled;
    const option = document.createElement("option");
    option.value = course.id;
    option.disabled = isEnrolled;
    option.textContent = `${course.code} - ${course.title} (${course.credits} Units) ${isEnrolled ? "[Already Enrolled]" : seatsRemaining > 0 ? `[${seatsRemaining} seats open]` : "[Full / Waitlist]"}`;
    select.appendChild(option);
  });

  if (currentVal && !isCourseRegistered(currentVal)) {
    select.value = currentVal;
  }
}

function onRegistrationCourseChange() {
  const select = document.getElementById("reg-course-select");
  const preview = document.getElementById("course-preview-card");
  if (!select || !preview) return;

  const courseId = select.value;
  if (!courseId) {
    preview.classList.remove("visible");
    preview.innerHTML = "";
    return;
  }

  const course = getCourseById(courseId);
  if (!course) return;

  const seatsLeft = Math.max(0, course.capacity - course.enrolled);

  preview.innerHTML = `
    <div class="preview-top">
      <span class="preview-code">${escapeHtml(course.code)}</span>
      <span class="preview-units">${course.credits} Units • ${escapeHtml(course.department)}</span>
    </div>
    <div class="preview-title">${escapeHtml(course.title)}</div>
    <div class="preview-meta">
      <span>👤 <strong>${escapeHtml(course.instructor)}</strong> (★ ${course.rating})</span>
      <span>🕒 ${escapeHtml(course.schedule)}</span>
      <span>📍 ${escapeHtml(course.room)}</span>
      <span>🪑 ${seatsLeft} Open Seats</span>
    </div>
    <div style="margin-top: 0.6rem; font-size: 0.82rem; color: #065f46;">
      <strong>Prerequisites:</strong> ${escapeHtml(course.prereqs)}
    </div>
  `;
  preview.classList.add("visible");
}

function handleRegistrationSubmit(event) {
  event.preventDefault();

  const courseSelect = document.getElementById("reg-course-select");
  const courseId = courseSelect ? courseSelect.value : "";
  const gradeOption = document.getElementById("reg-grade-option")?.value || "Letter Grade (A-F)";
  const termsCheckbox = document.getElementById("reg-terms-check");

  if (!courseId) {
    showToast("Selection Required", "Please select a course to register.", "warning");
    return;
  }

  if (termsCheckbox && !termsCheckbox.checked) {
    showToast("Agreement Required", "You must accept the enrollment terms.", "warning");
    return;
  }

  const course = getCourseById(courseId);
  if (!course) return;

  // Check if already registered
  if (isCourseRegistered(courseId)) {
    showToast("Already Registered", `You are already registered for ${course.code}.`, "warning");
    return;
  }

  // Check credit limit
  const currentCredits = getTotalRegisteredCredits();
  if (currentCredits + course.credits > appState.student.maxCredits) {
    showToast(
      "Unit Limit Exceeded",
      `Adding ${course.code} (${course.credits} units) exceeds your ${appState.student.maxCredits}-unit quarterly limit. (Current: ${currentCredits})`,
      "danger"
    );
    return;
  }

  // Register the course!
  const confId = `REG-2026-F${Math.floor(1000 + Math.random() * 9000)}`;
  const registrationRecord = {
    courseId: course.id,
    gradeOption: gradeOption,
    registeredAt: new Date().toLocaleString(),
    confirmationId: confId
  };

  appState.registered.push(registrationRecord);

  // Update course enrollment count
  if (course.enrolled < course.capacity) {
    course.enrolled += 1;
  }

  saveState();
  refreshAllViews();

  // Reset form
  const form = document.getElementById("registration-form");
  if (form) form.reset();
  const preview = document.getElementById("course-preview-card");
  if (preview) preview.classList.remove("visible");

  // Show detailed Confirmation Modal!
  showConfirmationModal(registrationRecord, course);
  showToast("Registration Confirmed!", `Successfully registered for ${course.code}.`, "success");
}

function updateRegistrationSidebar() {
  const currentCredits = getTotalRegisteredCredits();
  const maxLimit = appState.student.maxCredits;
  const pct = Math.min(100, Math.round((currentCredits / maxLimit) * 100));

  const gaugeNum = document.getElementById("sidebar-credits-num");
  const meterFill = document.getElementById("sidebar-meter-fill");
  const meterSub = document.getElementById("sidebar-meter-sub");
  const miniList = document.getElementById("sidebar-mini-list");

  if (gaugeNum) gaugeNum.textContent = currentCredits;
  if (meterFill) meterFill.style.width = `${pct}%`;
  if (meterSub) meterSub.textContent = `${maxLimit - currentCredits} units remaining`;

  if (miniList) {
    if (appState.registered.length === 0) {
      miniList.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem 0;">No courses registered yet.</p>`;
    } else {
      miniList.innerHTML = appState.registered.map(item => {
        const c = getCourseById(item.courseId);
        if (!c) return "";
        return `
          <div class="mini-course-row">
            <div class="mini-course-info">
              <span class="mini-course-code">${escapeHtml(c.code)}</span>
              <span class="mini-course-title" title="${escapeHtml(c.title)}">${escapeHtml(c.title)}</span>
            </div>
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary-600);">${c.credits}u</span>
          </div>
        `;
      }).join("");
    }
  }
}

// ==========================================================================
// 8. VIEW 4: STUDENT PROFILE & DATA TABLE
// ==========================================================================
function renderProfileView() {
  const tableBody = document.getElementById("registered-table-body");
  const totalCoursesDisplay = document.getElementById("prof-total-courses");
  const totalCreditsDisplay = document.getElementById("prof-total-credits");
  const filterQuery = (document.getElementById("profile-table-search")?.value || "").toLowerCase().trim();

  const totalCredits = getTotalRegisteredCredits();
  if (totalCoursesDisplay) totalCoursesDisplay.textContent = appState.registered.length;
  if (totalCreditsDisplay) totalCreditsDisplay.textContent = `${totalCredits} Units`;

  const bannerCredits = document.getElementById("prof-banner-credits");
  if (bannerCredits) bannerCredits.textContent = totalCredits;

  if (!tableBody) return;

  const filteredRegistrations = appState.registered.filter(item => {
    const c = getCourseById(item.courseId);
    if (!c) return false;
    if (!filterQuery) return true;
    return (
      c.code.toLowerCase().includes(filterQuery) ||
      c.title.toLowerCase().includes(filterQuery) ||
      c.instructor.toLowerCase().includes(filterQuery) ||
      item.gradeOption.toLowerCase().includes(filterQuery)
    );
  });

  if (filteredRegistrations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          ${appState.registered.length === 0 ? "You have not registered for any courses yet. Visit the Course Catalog to enroll." : "No registered courses match your search."}
        </td>
      </tr>
    `;
  } else {
    tableBody.innerHTML = filteredRegistrations.map(item => {
      const c = getCourseById(item.courseId);
      if (!c) return "";
      return `
        <tr>
          <td class="table-code-cell">${escapeHtml(c.code)}</td>
          <td class="table-title-cell">${escapeHtml(c.title)}</td>
          <td style="font-weight: 700; color: var(--text-main);">${c.credits}</td>
          <td>${escapeHtml(c.instructor)}</td>
          <td style="font-size: 0.85rem; color: var(--text-muted);">
            <div>${escapeHtml(c.schedule)}</div>
            <div style="color: var(--text-light); font-size: 0.78rem;">${escapeHtml(c.room)}</div>
          </td>
          <td>
            <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">${escapeHtml(item.gradeOption)}</span>
          </td>
          <td>
            <span class="table-status-badge badge-enrolled">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 12px; height: 12px;"><polyline points="20 6 9 17 4 12"/></svg>
              Enrolled
            </span>
          </td>
          <td class="table-actions-cell">
            <button class="btn btn-secondary btn-sm" onclick="openCourseDetailsModal('${c.id}')" title="Course details">
              Details
            </button>
            <button class="btn btn-danger-outline btn-sm" onclick="confirmDropCourse('${c.id}')" title="Drop this course">
              Drop
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  renderTimetable();
}

// Render Weekly Schedule Grid (Timetable)
function renderTimetable() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const startHourMin = 8; // 8:00 AM
  const totalHours = 11; // 8 AM to 7 PM

  days.forEach(day => {
    const col = document.getElementById(`timetable-day-${day}`);
    if (!col) return;

    // Clear previous events (keep the background hour cells)
    col.querySelectorAll(".timetable-event").forEach(el => el.remove());

    // Find registered courses on this day
    appState.registered.forEach(reg => {
      const course = getCourseById(reg.courseId);
      if (course && course.days.includes(day)) {
        const topOffset = (course.startHour - startHourMin) * 60; // 60px per hour
        const height = course.durationHours * 60;

        const eventBlock = document.createElement("div");
        eventBlock.className = "timetable-event";
        eventBlock.style.top = `${topOffset}px`;
        eventBlock.style.height = `${height}px`;
        eventBlock.style.backgroundColor = course.color;
        eventBlock.title = `${course.code}: ${course.title} (${course.schedule}) at ${course.room}`;
        eventBlock.innerHTML = `
          <span class="event-code">${escapeHtml(course.code)}</span>
          <span class="event-room">${escapeHtml(course.room)}</span>
        `;
        eventBlock.addEventListener("click", () => openCourseDetailsModal(course.id));
        col.appendChild(eventBlock);
      }
    });
  });
}

// ==========================================================================
// 9. MODALS: CONFIRMATION, DROP, & DETAILS
// ==========================================================================
let currentCourseToDrop = null;

function showConfirmationModal(regRecord, course) {
  const modal = document.getElementById("confirmation-modal");
  if (!modal) return;

  document.getElementById("conf-reg-id").textContent = regRecord.confirmationId;
  document.getElementById("conf-student-name").textContent = appState.student.name;
  document.getElementById("conf-student-id").textContent = appState.student.id;
  document.getElementById("conf-course-code").textContent = course.code;
  document.getElementById("conf-course-name").textContent = course.title;
  document.getElementById("conf-instructor").textContent = course.instructor;
  document.getElementById("conf-schedule").textContent = `${course.schedule} (${course.room})`;
  document.getElementById("conf-credits").textContent = `${course.credits} Units`;
  document.getElementById("conf-grade-option").textContent = regRecord.gradeOption;
  document.getElementById("conf-total-credits").textContent = `${getTotalRegisteredCredits()} / ${appState.student.maxCredits} Units`;

  modal.classList.add("open");
}

function closeConfirmationModal() {
  const modal = document.getElementById("confirmation-modal");
  if (modal) modal.classList.remove("open");
}

function confirmDropCourse(courseId) {
  const course = getCourseById(courseId);
  if (!course) return;

  currentCourseToDrop = course;
  const modal = document.getElementById("drop-modal");
  if (!modal) return;

  document.getElementById("drop-course-code").textContent = course.code;
  document.getElementById("drop-course-name").textContent = course.title;
  modal.classList.add("open");
}

function executeDropCourse() {
  if (!currentCourseToDrop) return;

  const courseId = currentCourseToDrop.id;
  const courseCode = currentCourseToDrop.code;

  // Remove from registered list
  appState.registered = appState.registered.filter(r => r.courseId !== courseId);

  // Restore seat in course
  const course = getCourseById(courseId);
  if (course && course.enrolled > 0) {
    course.enrolled -= 1;
  }

  saveState();
  closeDropModal();
  refreshAllViews();

  showToast("Course Dropped", `You have dropped ${courseCode}.`, "danger");
}

function closeDropModal() {
  const modal = document.getElementById("drop-modal");
  if (modal) modal.classList.remove("open");
  currentCourseToDrop = null;
}

function openCourseDetailsModal(courseId) {
  const course = getCourseById(courseId);
  if (!course) return;

  const modal = document.getElementById("details-modal");
  if (!modal) return;

  document.getElementById("detail-modal-code").textContent = course.code;
  document.getElementById("detail-modal-title").textContent = course.title;
  document.getElementById("detail-modal-dept").textContent = course.department;
  document.getElementById("detail-modal-instructor").textContent = `${course.instructor} (★ ${course.rating}/5.0)`;
  document.getElementById("detail-modal-units").textContent = `${course.credits} Units`;
  document.getElementById("detail-modal-schedule").textContent = course.schedule;
  document.getElementById("detail-modal-room").textContent = course.room;
  document.getElementById("detail-modal-prereqs").textContent = course.prereqs;
  document.getElementById("detail-modal-desc").textContent = course.description;

  const seatsLeft = Math.max(0, course.capacity - course.enrolled);
  document.getElementById("detail-modal-seats").textContent = `${seatsLeft} available (${course.enrolled} filled of ${course.capacity} cap)`;

  const regActionBtn = document.getElementById("detail-modal-action-btn");
  if (regActionBtn) {
    if (isCourseRegistered(course.id)) {
      regActionBtn.textContent = "Already Enrolled";
      regActionBtn.className = "btn btn-success";
      regActionBtn.disabled = true;
    } else {
      regActionBtn.textContent = "Register for this Course";
      regActionBtn.className = "btn btn-primary";
      regActionBtn.disabled = false;
      regActionBtn.onclick = () => {
        closeDetailsModal();
        quickRegisterCourse(course.id);
      };
    }
  }

  modal.classList.add("open");
}

function closeDetailsModal() {
  const modal = document.getElementById("details-modal");
  if (modal) modal.classList.remove("open");
}

// ==========================================================================
// 10. TOAST NOTIFICATION UTILITY
// ==========================================================================
function showToast(title, message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconSvg = "";
  if (type === "success") {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  } else if (type === "danger") {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else if (type === "warning") {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-desc">${escapeHtml(message)}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Print official registration confirmation
function printRegistrationConfirmation() {
  window.print();
}

// Escape HTML utility to prevent XSS
function escapeHtml(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Global Refresh Helper
function refreshAllViews() {
  updateBadgeCounts();
  updateHomeStats();
  renderCatalog();
  populateRegistrationDropdown();
  updateRegistrationSidebar();
  renderProfileView();
}

// ==========================================================================
// 11. INITIALIZATION ON DOM LOAD
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Load State from storage or defaults
  loadState();

  // Attach search and filter event listeners with debounce
  const catalogSearch = document.getElementById("catalog-search");
  if (catalogSearch) {
    catalogSearch.addEventListener("input", () => renderCatalog());
  }

  ["filter-dept", "filter-level", "filter-credits", "filter-availability", "sort-courses"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", () => renderCatalog());
  });

  // Attach table search listener in profile
  const profileTableSearch = document.getElementById("profile-table-search");
  if (profileTableSearch) {
    profileTableSearch.addEventListener("input", () => renderProfileView());
  }

  // Attach registration course select change
  const regCourseSelect = document.getElementById("reg-course-select");
  if (regCourseSelect) {
    regCourseSelect.addEventListener("change", onRegistrationCourseChange);
  }

  // Attach registration form submit
  const regForm = document.getElementById("registration-form");
  if (regForm) {
    regForm.addEventListener("submit", handleRegistrationSubmit);
  }

  // Close modals on clicking outside
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", e => {
      if (e.target === overlay) {
        overlay.classList.remove("open");
      }
    });
  });

  // ESC key closes modals
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach(modal => modal.classList.remove("open"));
    }
  });

  // Route to page based on URL hash or default to home
  const initialPage = window.location.hash.replace("#", "") || "home";
  navigateTo(initialPage);
  refreshAllViews();
});
