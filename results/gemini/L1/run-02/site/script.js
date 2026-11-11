/**
 * TritonRegister - University Course Registration System
 * Pure JavaScript Application Logic
 */

// =============================================================================
// 1. DATASET: COURSE CATALOG & UNIVERSITY DATA
// =============================================================================
const COURSE_CATALOG = [
  {
    crn: "52101",
    code: "CSE 110",
    dept: "CSE",
    deptName: "Computer Science & Engineering",
    title: "Software Engineering",
    units: 4,
    level: "Upper",
    instructor: "Prof. Gary Gillespie",
    schedule: "MWF 10:00 AM - 10:50 AM",
    location: "Center Hall 101",
    capacity: 150,
    enrolled: 122,
    status: "OPEN",
    featured: true,
    prereqs: "CSE 100 or DSC 30 with a grade of C- or better",
    description: "Introduction to software engineering principles, design patterns, testing frameworks, agile workflows, and team-based full-stack project development."
  },
  {
    crn: "52108",
    code: "CSE 151A",
    dept: "CSE",
    deptName: "Computer Science & Engineering",
    title: "Introduction to Machine Learning",
    units: 4,
    level: "Upper",
    instructor: "Prof. Kamalika Chaudhuri",
    schedule: "TuTh 2:00 PM - 3:20 PM",
    location: "Warren Lecture Hall 2001",
    capacity: 180,
    enrolled: 180,
    status: "WAITLIST",
    featured: true,
    prereqs: "MATH 18 or MATH 31AH, and CSE 100",
    description: "Foundational algorithms and mathematical formulations of supervised and unsupervised machine learning, regression, classification, and neural models."
  },
  {
    crn: "52115",
    code: "DSC 102",
    dept: "DSC",
    deptName: "Data Science",
    title: "Systems for Scalable Analytics",
    units: 4,
    level: "Upper",
    instructor: "Prof. Arun Kumar",
    schedule: "TuTh 9:30 AM - 10:50 AM",
    location: "PETER 108",
    capacity: 120,
    enrolled: 94,
    status: "OPEN",
    featured: true,
    prereqs: "DSC 80 and DSC 100",
    description: "Design and architectures of modern distributed data systems, map-reduce, Spark processing, database internals, and big-data engineering workflows."
  },
  {
    crn: "52120",
    code: "MATH 109",
    dept: "MATH",
    deptName: "Mathematics",
    title: "Mathematical Reasoning",
    units: 4,
    level: "Upper",
    instructor: "Prof. David Meyer",
    schedule: "MWF 1:00 PM - 1:50 PM",
    location: "AP&M 4218",
    capacity: 100,
    enrolled: 98,
    status: "OPEN",
    featured: false,
    prereqs: "MATH 20C or MATH 31BH",
    description: "Introduction to mathematical proofs, set theory, functions, equivalence relations, cardinality, and deductive logic essential for advanced analysis."
  },
  {
    crn: "52126",
    code: "MATH 180A",
    dept: "MATH",
    deptName: "Mathematics",
    title: "Introduction to Probability",
    units: 4,
    level: "Upper",
    instructor: "Prof. Jason Schweinsberg",
    schedule: "MWF 11:00 AM - 11:50 AM",
    location: "Ledden Auditorium",
    capacity: 220,
    enrolled: 195,
    status: "OPEN",
    featured: false,
    prereqs: "MATH 20C with C- or better",
    description: "Probability spaces, random variables, expectation, conditional probability distributions, independence, Central Limit Theorem, and laws of large numbers."
  },
  {
    crn: "52132",
    code: "COGS 108",
    dept: "COGS",
    deptName: "Cognitive Science",
    title: "Data Science in Practice",
    units: 4,
    level: "Upper",
    instructor: "Prof. Shannon Ellis",
    schedule: "TuTh 12:30 PM - 1:50 PM",
    location: "Cognitive Science Bldg 001",
    capacity: 250,
    enrolled: 242,
    status: "OPEN",
    featured: true,
    prereqs: "COGS 18 or CSE 11 or CSE 8A",
    description: "Real-world data science lifecycle, hypothesis formulation, wrangling, exploratory data analysis, ethical algorithmic implications, and public dissemination."
  },
  {
    crn: "52140",
    code: "COGS 120",
    dept: "COGS",
    deptName: "Cognitive Science",
    title: "Human-Computer Interaction Design",
    units: 4,
    level: "Upper",
    instructor: "Prof. Scott Klemmer",
    schedule: "MWF 3:00 PM - 3:50 PM",
    location: "Design and Innovation Bldg 202",
    capacity: 140,
    enrolled: 140,
    status: "WAITLIST",
    featured: false,
    prereqs: "COGS 1 or CSE 11 or VIS 30",
    description: "Hands-on studio course focusing on user-centered design, iterative prototyping, heuristics evaluation, cognitive psychology, and modern UX design systems."
  },
  {
    crn: "52145",
    code: "BILD 1",
    dept: "BILD",
    deptName: "Biological Sciences",
    title: "The Cell & Molecular Biology",
    units: 4,
    level: "Lower",
    instructor: "Prof. Kathleen French",
    schedule: "TuTh 8:00 AM - 9:20 AM",
    location: "Price Center Theater",
    capacity: 350,
    enrolled: 310,
    status: "OPEN",
    featured: false,
    prereqs: "CHEM 6A or concurrent enrollment",
    description: "Principles of cell biology, biochemical pathways, genetics, cellular reproduction, gene expression, and modern biotechnology foundations."
  },
  {
    crn: "52150",
    code: "BILD 62",
    dept: "BILD",
    deptName: "Biological Sciences",
    title: "Introduction to Python for Biology",
    units: 2,
    level: "Lower",
    instructor: "Prof. Niema Moshiri",
    schedule: "Fri 2:00 PM - 3:50 PM",
    location: "Biological Studies Bldg 1103",
    capacity: 90,
    enrolled: 62,
    status: "OPEN",
    featured: false,
    prereqs: "None",
    description: "Practical programming tailored to genomics, biological sequence analysis, mutation tracking, and bioinformatics data visualization using Python."
  },
  {
    crn: "52155",
    code: "ECON 100A",
    dept: "ECON",
    deptName: "Economics",
    title: "Microeconomics A: Consumer Behavior",
    units: 4,
    level: "Upper",
    instructor: "Prof. Mark Machina",
    schedule: "MWF 9:00 AM - 9:50 AM",
    location: "Galbraith Hall 242",
    capacity: 160,
    enrolled: 148,
    status: "OPEN",
    featured: false,
    prereqs: "ECON 1 and MATH 20C or MATH 10C",
    description: "Formal mathematical modeling of consumer preference, utility maximization, demand elasticities, choice under risk, and welfare economics."
  },
  {
    crn: "52162",
    code: "VIS 141B",
    dept: "VIS",
    deptName: "Visual Arts & Design",
    title: "Interface & Interactive Media",
    units: 4,
    level: "Upper",
    instructor: "Prof. Brett Stalbaum",
    schedule: "TuTh 3:30 PM - 5:20 PM",
    location: "Visual Arts Facility 462",
    capacity: 40,
    enrolled: 36,
    status: "OPEN",
    featured: false,
    prereqs: "VIS 41 or VIS 60",
    description: "Exploration of physical computing, generative digital art, front-end creative coding, responsive installations, and media critique."
  },
  {
    crn: "52170",
    code: "CSE 250A",
    dept: "CSE",
    deptName: "Computer Science & Engineering",
    title: "Principles of Artificial Intelligence",
    units: 4,
    level: "Grad",
    instructor: "Prof. Lawrence Saul",
    schedule: "TuTh 11:00 AM - 12:20 PM",
    location: "EBU3B 1202",
    capacity: 75,
    enrolled: 75,
    status: "WAITLIST",
    featured: false,
    prereqs: "Graduate Standing or Department Approval",
    description: "Advanced graduate-level study of probabilistic graphical models, Markov decision processes, reinforcement learning, and Bayesian inferential algorithms."
  }
];

// =============================================================================
// 2. STUDENT STATE & INITIAL ENROLLMENTS
// =============================================================================
const studentState = {
  name: "Alex Chen",
  studentId: "A16892401",
  email: "alchen@ucsd.edu",
  major: "Computer Science (B.S.)",
  minor: "Data Science",
  college: "Warren College",
  gpa: 3.84,
  maxCredits: 18,
  minCredits: 12,
  completedUnits: 88,
  // 3 initial registrations (12 total units)
  registeredCourses: [
    {
      crn: "52120",
      code: "MATH 109",
      dept: "MATH",
      deptName: "Mathematics",
      title: "Mathematical Reasoning",
      units: 4,
      instructor: "Prof. David Meyer",
      schedule: "MWF 1:00 PM - 1:50 PM",
      location: "AP&M 4218",
      section: "Section A01",
      grading: "Letter Grade (A-F)",
      registeredAt: "Oct 24, 2026, 09:15 AM",
      status: "Enrolled"
    },
    {
      crn: "52132",
      code: "COGS 108",
      dept: "COGS",
      deptName: "Cognitive Science",
      title: "Data Science in Practice",
      units: 4,
      instructor: "Prof. Shannon Ellis",
      schedule: "TuTh 12:30 PM - 1:50 PM",
      location: "Cognitive Science Bldg 001",
      section: "Section B02",
      grading: "Letter Grade (A-F)",
      registeredAt: "Oct 24, 2026, 09:22 AM",
      status: "Enrolled"
    },
    {
      crn: "52145",
      code: "BILD 1",
      dept: "BILD",
      deptName: "Biological Sciences",
      title: "The Cell & Molecular Biology",
      units: 4,
      instructor: "Prof. Kathleen French",
      schedule: "TuTh 8:00 AM - 9:20 AM",
      location: "Price Center Theater",
      section: "Section A01",
      grading: "Pass / No Pass (P/NP)",
      registeredAt: "Oct 24, 2026, 09:40 AM",
      status: "Enrolled"
    }
  ]
};

// Global context for modals
let activePendingCourse = null;
let activeDropCourseCrn = null;

// Filter and search state
const filterState = {
  keyword: "",
  department: "ALL",
  level: "ALL",
  credits: "ALL",
  status: "ALL",
  sortBy: "code-asc"
};

// =============================================================================
// 3. INITIALIZATION & ROUTING
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initRouting();
  initEventListeners();
  populateCourseDropdown();
  renderFeaturedCourses();
  renderCatalogGrid();
  updateRegistrationViews();
  setupMobileNav();
});

/**
 * Handle Single-Page App view navigation
 */
function initRouting() {
  const hash = window.location.hash.replace("#", "") || "home";
  navigateTo(hash, false);

  window.addEventListener("hashchange", () => {
    const currentHash = window.location.hash.replace("#", "") || "home";
    navigateTo(currentHash, false);
  });
}

function navigateTo(viewName, updateHash = true) {
  const validViews = ["home", "catalog", "registration", "profile"];
  const targetView = validViews.includes(viewName) ? viewName : "home";

  // Hide all views
  document.querySelectorAll(".page-view").forEach(view => {
    view.classList.remove("active");
  });

  // Show target view
  const activeViewEl = document.getElementById(`view-${targetView}`);
  if (activeViewEl) {
    activeViewEl.classList.add("active");
  }

  // Update navigation links
  document.querySelectorAll(".nav-link").forEach(btn => {
    if (btn.getAttribute("data-view") === targetView) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Close mobile navigation drawer if open
  const mainNav = document.getElementById("main-nav");
  if (mainNav && mainNav.classList.contains("mobile-active")) {
    mainNav.classList.remove("mobile-active");
  }

  if (updateHash) {
    window.location.hash = targetView;
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupMobileNav() {
  const mobileToggle = document.getElementById("mobile-toggle");
  const mainNav = document.getElementById("main-nav");
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      mainNav.classList.toggle("mobile-active");
    });
  }
}

// =============================================================================
// 4. RENDERING FUNCTIONS
// =============================================================================

/**
 * Renders featured courses for the Home page
 */
function renderFeaturedCourses() {
  const container = document.getElementById("home-featured-courses");
  if (!container) return;

  const featuredList = COURSE_CATALOG.filter(c => c.featured).slice(0, 3);
  container.innerHTML = featuredList.map(course => generateCourseCardHtml(course)).join("");
}

/**
 * Renders Course Catalog Grid with active filters, search, and sort applied
 */
function renderCatalogGrid() {
  const grid = document.getElementById("catalog-course-grid");
  const emptyState = document.getElementById("no-courses-found");
  const countText = document.getElementById("results-count-text");
  const totalCountEl = document.getElementById("catalog-total-count");
  const openCountEl = document.getElementById("catalog-open-count");
  if (!grid) return;

  // Update KPI counters
  if (totalCountEl) totalCountEl.textContent = COURSE_CATALOG.length;
  if (openCountEl) openCountEl.textContent = COURSE_CATALOG.filter(c => c.status === "OPEN").length;

  // Filter courses
  let filtered = COURSE_CATALOG.filter(course => {
    // Keyword match
    if (filterState.keyword) {
      const q = filterState.keyword.toLowerCase();
      const matchText = (
        course.code + " " +
        course.title + " " +
        course.deptName + " " +
        course.instructor + " " +
        course.description
      ).toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Department match
    if (filterState.department !== "ALL" && course.dept !== filterState.department) {
      return false;
    }

    // Level match
    if (filterState.level !== "ALL" && course.level !== filterState.level) {
      return false;
    }

    // Credits match
    if (filterState.credits !== "ALL" && course.units !== parseInt(filterState.credits, 10)) {
      return false;
    }

    // Availability status
    if (filterState.status === "OPEN" && course.status !== "OPEN") {
      return false;
    }
    if (filterState.status === "WAITLIST" && course.status !== "WAITLIST") {
      return false;
    }

    return true;
  });

  // Sort courses
  filtered.sort((a, b) => {
    switch (filterState.sortBy) {
      case "code-asc":
        return a.code.localeCompare(b.code);
      case "code-desc":
        return b.code.localeCompare(a.code);
      case "seats-desc":
        return (b.capacity - b.enrolled) - (a.capacity - a.enrolled);
      case "credits-desc":
        return b.units - a.units;
      default:
        return 0;
    }
  });

  // Render cards or empty message
  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    if (countText) countText.textContent = "Found 0 matching courses";
  } else {
    if (emptyState) emptyState.style.display = "none";
    grid.innerHTML = filtered.map(course => generateCourseCardHtml(course)).join("");
    if (countText) countText.textContent = `Showing ${filtered.length} of ${COURSE_CATALOG.length} courses`;
  }

  renderActiveFilterTags();
}

/**
 * Generates an HTML card for a course
 */
function generateCourseCardHtml(course) {
  const isEnrolled = studentState.registeredCourses.some(c => c.crn === course.crn);
  const deptClass = `dept-${course.dept.toLowerCase()}`;
  const openSeats = Math.max(0, course.capacity - course.enrolled);
  const percentFill = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));

  let statusBadgeHtml = "";
  if (isEnrolled) {
    statusBadgeHtml = `<span class="status-pill status-enrolled">✓ Enrolled</span>`;
  } else if (course.status === "OPEN") {
    statusBadgeHtml = `<span class="status-pill status-open">● ${openSeats} Open Seats</span>`;
  } else {
    statusBadgeHtml = `<span class="status-pill status-waitlist">▲ Waitlist</span>`;
  }

  const registerBtnHtml = isEnrolled
    ? `<button class="btn btn-outline" onclick="openDropModal('${course.crn}')">Drop Course</button>`
    : `<button class="btn btn-primary" onclick="initiateCourseRegistration('${course.crn}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon"><path d="M12 5v14M5 12h14"/></svg>
        Register
       </button>`;

  return `
    <article class="course-card ${deptClass}" data-crn="${course.crn}">
      <div class="course-card-top-strip"></div>
      <div class="course-card-body">
        <div class="course-card-header">
          <div class="course-code-wrap">
            <span class="course-code">${course.code}</span>
            <span class="course-dept-name">${course.deptName}</span>
          </div>
          ${statusBadgeHtml}
        </div>

        <h3 class="course-card-title">${course.title}</h3>
        <p class="course-card-desc">${course.description}</p>

        <div class="course-meta-list">
          <div class="course-meta-row">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span><strong>Instructor:</strong> ${course.instructor}</span>
          </div>
          <div class="course-meta-row">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span><strong>Schedule:</strong> ${course.schedule}</span>
          </div>
          <div class="course-meta-row">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span><strong>Location:</strong> ${course.location}</span>
          </div>
        </div>

        <div class="course-capacity-bar">
          <div class="capacity-labels">
            <span>Capacity (${course.enrolled}/${course.capacity})</span>
            <span class="badge-pill badge-indigo">${course.units} Units</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill ${course.status === 'OPEN' ? 'bg-gradient-emerald' : 'bg-gradient-amber'}" style="width: ${percentFill}%;"></div>
          </div>
        </div>

        <div class="course-card-actions">
          <button class="btn btn-outline btn-details" onclick="openDetailsModal('${course.crn}')" title="View Syllabus & Prerequisites">
            Details
          </button>
          ${registerBtnHtml}
        </div>
      </div>
    </article>
  `;
}

/**
 * Render active filter tags row with quick dismiss
 */
function renderActiveFilterTags() {
  const container = document.getElementById("active-filter-tags");
  if (!container) return;

  const tags = [];
  if (filterState.keyword) {
    tags.push({ label: `Search: "${filterState.keyword}"`, key: "keyword" });
  }
  if (filterState.department !== "ALL") {
    tags.push({ label: `Dept: ${filterState.department}`, key: "department" });
  }
  if (filterState.level !== "ALL") {
    tags.push({ label: `Level: ${filterState.level}`, key: "level" });
  }
  if (filterState.credits !== "ALL") {
    tags.push({ label: `${filterState.credits} Units`, key: "credits" });
  }
  if (filterState.status !== "ALL") {
    tags.push({ label: `Status: ${filterState.status}`, key: "status" });
  }

  if (tags.length === 0) {
    container.innerHTML = "";
    container.style.display = "none";
    return;
  }

  container.style.display = "flex";
  container.innerHTML = tags.map(t => `
    <span class="filter-pill-tag">
      ${t.label}
      <span class="remove-tag" onclick="removeFilterTag('${t.key}')">&times;</span>
    </span>
  `).join("");
}

function removeFilterTag(key) {
  if (key === "keyword") {
    filterState.keyword = "";
    const searchInput = document.getElementById("course-search-input");
    if (searchInput) searchInput.value = "";
    const clearBtn = document.getElementById("clear-search-btn");
    if (clearBtn) clearBtn.style.display = "none";
  } else if (key === "department") {
    filterState.department = "ALL";
    const el = document.getElementById("filter-department");
    if (el) el.value = "ALL";
  } else if (key === "level") {
    filterState.level = "ALL";
    const el = document.getElementById("filter-level");
    if (el) el.value = "ALL";
  } else if (key === "credits") {
    filterState.credits = "ALL";
    const el = document.getElementById("filter-credits");
    if (el) el.value = "ALL";
  } else if (key === "status") {
    filterState.status = "ALL";
    const el = document.getElementById("filter-status");
    if (el) el.value = "ALL";
  }
  renderCatalogGrid();
}

function resetAllFilters() {
  filterState.keyword = "";
  filterState.department = "ALL";
  filterState.level = "ALL";
  filterState.credits = "ALL";
  filterState.status = "ALL";
  filterState.sortBy = "code-asc";

  const searchInput = document.getElementById("course-search-input");
  if (searchInput) searchInput.value = "";
  const clearBtn = document.getElementById("clear-search-btn");
  if (clearBtn) clearBtn.style.display = "none";

  const d1 = document.getElementById("filter-department"); if (d1) d1.value = "ALL";
  const d2 = document.getElementById("filter-level"); if (d2) d2.value = "ALL";
  const d3 = document.getElementById("filter-credits"); if (d3) d3.value = "ALL";
  const d4 = document.getElementById("filter-status"); if (d4) d4.value = "ALL";
  const s1 = document.getElementById("sort-courses"); if (s1) s1.value = "code-asc";

  renderCatalogGrid();
  showToast("Filters Cleared", "Displaying all available courses.", "info");
}

/**
 * Updates All Registration and Enrolled Course Views
 */
function updateRegistrationViews() {
  const registered = studentState.registeredCourses;
  const totalUnits = registered.reduce((acc, c) => acc + c.units, 0);

  // Update navigation badge
  const navBadge = document.getElementById("nav-reg-count");
  if (navBadge) navBadge.textContent = registered.length;

  // Update Home page units stat
  const homeUnits = document.getElementById("home-registered-units");
  if (homeUnits) homeUnits.textContent = totalUnits;

  // Update Credit Progress Meters
  const meterText = document.getElementById("credit-meter-text");
  const progressBar = document.getElementById("credit-progress-bar");
  const statusPill = document.getElementById("credit-status-pill");
  const remainingText = document.getElementById("credit-remaining-text");

  const percentUsed = Math.min(100, Math.round((totalUnits / studentState.maxCredits) * 100));
  const remainingUnits = Math.max(0, studentState.maxCredits - totalUnits);

  if (meterText) meterText.textContent = `${totalUnits} / ${studentState.maxCredits} Units Enrolled`;
  if (progressBar) progressBar.style.width = `${percentUsed}%`;
  if (remainingText) remainingText.textContent = `${remainingUnits} units available`;

  if (statusPill) {
    if (totalUnits > studentState.maxCredits) {
      statusPill.textContent = "Overload Warning";
      statusPill.className = "pill-badge badge-rose";
    } else if (totalUnits >= studentState.minCredits) {
      statusPill.textContent = "Normal Load (Full-Time)";
      statusPill.className = "pill-badge pill-safe";
    } else {
      statusPill.textContent = "Part-Time Load";
      statusPill.className = "pill-badge badge-amber";
    }
  }

  // Update checklist counters
  const checkCount = document.getElementById("checklist-enrolled-count");
  const checkUnits = document.getElementById("checklist-units-count");
  if (checkCount) checkCount.textContent = registered.length;
  if (checkUnits) checkUnits.textContent = totalUnits;

  // Update registered courses table
  renderRegisteredCoursesTable(registered, totalUnits);

  // Update profile snapshot
  renderProfileCurrentCourses(registered);

  // Refresh catalog cards in case button changed to "Drop"
  renderCatalogGrid();
  renderFeaturedCourses();
}

/**
 * Render the Registered Courses Data Table
 */
function renderRegisteredCoursesTable(registered, totalUnits) {
  const tbody = document.getElementById("registered-table-body");
  const emptyNotice = document.getElementById("registered-table-empty");
  const summaryBadge = document.getElementById("table-credit-summary");
  const rowCountEl = document.getElementById("table-row-count");
  if (!tbody) return;

  if (summaryBadge) {
    summaryBadge.textContent = `Total: ${totalUnits} Units | ${registered.length} Courses`;
  }
  if (rowCountEl) {
    rowCountEl.textContent = registered.length;
  }

  if (registered.length === 0) {
    tbody.innerHTML = "";
    if (emptyNotice) emptyNotice.style.display = "block";
    return;
  }

  if (emptyNotice) emptyNotice.style.display = "none";

  tbody.innerHTML = registered.map(course => `
    <tr>
      <td>
        <span class="course-table-code">${course.code}</span>
        <br><small class="text-muted">CRN: ${course.crn}</small>
      </td>
      <td>
        <span class="course-table-title">${course.title}</span>
        <br><small class="text-muted">${course.section || 'Sec 01'}</small>
      </td>
      <td><span class="badge-pill badge-light">${course.dept}</span></td>
      <td>${course.instructor}</td>
      <td>
        <div>${course.schedule}</div>
        <small class="text-muted">${course.location}</small>
      </td>
      <td><strong>${course.units}.0</strong></td>
      <td><span class="badge-pill badge-indigo">${course.grading || 'Letter Grade'}</span></td>
      <td><span class="status-pill status-open">✓ ${course.status || 'Enrolled'}</span></td>
      <td>
        <div class="table-actions-cell">
          <button class="btn-table-drop" onclick="openDropModal('${course.crn}')" title="Drop this course">
            Drop
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

/**
 * Render registered courses in the Profile View
 */
function renderProfileCurrentCourses(registered) {
  const container = document.getElementById("profile-current-courses-list");
  if (!container) return;

  if (registered.length === 0) {
    container.innerHTML = `<p class="text-muted p-2">No registered courses for this term.</p>`;
    return;
  }

  container.innerHTML = registered.map(course => `
    <div class="profile-course-item">
      <div>
        <span class="p-course-code">${course.code}</span>
        <span class="p-course-title">${course.title}</span>
        <div class="text-muted" style="font-size: 0.8rem; margin-top: 0.15rem;">
          ${course.schedule} • ${course.location} • ${course.instructor}
        </div>
      </div>
      <div class="p-course-right">
        <span class="badge-pill badge-primary">${course.units} Units</span>
        <span class="badge-pill badge-light">${course.grading}</span>
      </div>
    </div>
  `).join("");
}

/**
 * Populate the select dropdown in the Registration Form
 */
function populateCourseDropdown() {
  const select = document.getElementById("select-course-dropdown");
  if (!select) return;

  // Preserve placeholder
  select.innerHTML = `<option value="" disabled selected>-- Choose a course from catalog --</option>` +
    COURSE_CATALOG.map(c => `
      <option value="${c.crn}">
        ${c.code}: ${c.title} (${c.units} Units) - ${c.status === 'OPEN' ? 'Open' : 'Waitlist'}
      </option>
    `).join("");

  select.addEventListener("change", (e) => {
    const crn = e.target.value;
    updateFormCoursePreview(crn);
  });
}

function updateFormCoursePreview(crn) {
  const previewBox = document.getElementById("course-form-preview");
  const course = COURSE_CATALOG.find(c => c.crn === crn);
  if (!course || !previewBox) return;

  document.getElementById("preview-code").textContent = course.code;
  document.getElementById("preview-units").textContent = `${course.units}.0 Units`;
  document.getElementById("preview-title").textContent = course.title;
  document.getElementById("preview-instructor").textContent = course.instructor;
  document.getElementById("preview-schedule").textContent = course.schedule;
  document.getElementById("preview-location").textContent = course.location;

  const seatsEl = document.getElementById("preview-seats");
  const openSeats = Math.max(0, course.capacity - course.enrolled);
  seatsEl.textContent = `${openSeats} seats available (${course.status})`;
  seatsEl.className = course.status === "OPEN" ? "text-emerald font-semibold" : "text-amber font-semibold";

  previewBox.style.display = "block";
}

// =============================================================================
// 5. REGISTRATION FLOW & FORM SUBMISSION
// =============================================================================

/**
 * Called when submitting the direct registration form
 */
function handleRegistrationFormSubmit(event) {
  event.preventDefault();

  const selectCourse = document.getElementById("select-course-dropdown");
  const selectSection = document.getElementById("select-section");
  const selectGrading = document.getElementById("select-grading");

  const crn = selectCourse.value;
  if (!crn) {
    showToast("Selection Needed", "Please select a course to register.", "error");
    return;
  }

  const course = COURSE_CATALOG.find(c => c.crn === crn);
  if (!course) return;

  const section = selectSection ? selectSection.value : "Section A01";
  const grading = selectGrading ? selectGrading.value : "Letter Grade (A-F)";

  initiateCourseRegistration(crn, section, grading);
}

/**
 * Begins registration and triggers the confirmation modal
 */
function initiateCourseRegistration(crn, section = "Section A01", grading = "Letter Grade (A-F)") {
  const course = COURSE_CATALOG.find(c => c.crn === crn);
  if (!course) return;

  // Check 1: Already Enrolled?
  const alreadyEnrolled = studentState.registeredCourses.some(c => c.crn === crn);
  if (alreadyEnrolled) {
    showToast("Already Enrolled", `You are already registered for ${course.code}.`, "error");
    return;
  }

  // Check 2: Unit Cap Exceeded?
  const currentUnits = studentState.registeredCourses.reduce((sum, c) => sum + c.units, 0);
  const projectedUnits = currentUnits + course.units;
  if (projectedUnits > studentState.maxCredits) {
    showToast("Unit Limit Exceeded", `Adding ${course.code} would exceed your ${studentState.maxCredits} unit maximum cap!`, "error");
    return;
  }

  // Store in pending context
  activePendingCourse = {
    ...course,
    section: section,
    grading: grading
  };

  // Populate Modal Fields
  document.getElementById("modal-course-code").textContent = course.code;
  document.getElementById("modal-course-units").textContent = `${course.units}.0 Units`;
  document.getElementById("modal-course-title").textContent = course.title;
  document.getElementById("modal-course-dept").textContent = course.deptName;
  document.getElementById("modal-course-instructor").textContent = course.instructor;
  document.getElementById("modal-course-schedule").textContent = `${course.schedule} (${section})`;
  document.getElementById("modal-course-location").textContent = course.location;
  document.getElementById("modal-course-grading").textContent = grading;

  document.getElementById("modal-prev-credits").textContent = currentUnits;
  document.getElementById("modal-new-credits").textContent = `${projectedUnits} Units`;

  const agreeCheckbox = document.getElementById("modal-agree-checkbox");
  if (agreeCheckbox) agreeCheckbox.checked = true;

  // Open the Modal
  openModal("confirm-modal");
}

/**
 * Confirms registration after user clicks "Confirm & Enroll Now" in modal
 */
function finalizeEnrollment() {
  if (!activePendingCourse) return;

  const agreeCheckbox = document.getElementById("modal-agree-checkbox");
  if (agreeCheckbox && !agreeCheckbox.checked) {
    showToast("Agreement Required", "Please accept the prerequisite verification terms.", "error");
    return;
  }

  // Add course to student state
  const newEnrollment = {
    crn: activePendingCourse.crn,
    code: activePendingCourse.code,
    dept: activePendingCourse.dept,
    deptName: activePendingCourse.deptName,
    title: activePendingCourse.title,
    units: activePendingCourse.units,
    instructor: activePendingCourse.instructor,
    schedule: activePendingCourse.schedule,
    location: activePendingCourse.location,
    section: activePendingCourse.section,
    grading: activePendingCourse.grading,
    registeredAt: new Date().toLocaleString(),
    status: "Enrolled"
  };

  studentState.registeredCourses.push(newEnrollment);

  // Update enrolled count in mock catalog
  const catalogItem = COURSE_CATALOG.find(c => c.crn === activePendingCourse.crn);
  if (catalogItem) {
    catalogItem.enrolled = Math.min(catalogItem.capacity, catalogItem.enrolled + 1);
  }

  // Close modal & reset preview
  closeModal("confirm-modal");
  const form = document.getElementById("add-course-form");
  if (form) form.reset();
  const previewBox = document.getElementById("course-form-preview");
  if (previewBox) previewBox.style.display = "none";

  // Refresh Views
  updateRegistrationViews();

  // Show Toast
  showToast(
    "Enrollment Confirmed!",
    `Successfully registered for ${newEnrollment.code} (${newEnrollment.units} Units).`,
    "success"
  );

  activePendingCourse = null;
}

// =============================================================================
// 6. DROP COURSE FLOW
// =============================================================================
function openDropModal(crn) {
  const course = studentState.registeredCourses.find(c => c.crn === crn);
  if (!course) return;

  activeDropCourseCrn = crn;
  document.getElementById("drop-course-code-title").textContent = `${course.code} - ${course.title}`;
  document.getElementById("drop-course-units").textContent = course.units;

  openModal("drop-modal");
}

function finalizeDropCourse() {
  if (!activeDropCourseCrn) return;

  const index = studentState.registeredCourses.findIndex(c => c.crn === activeDropCourseCrn);
  if (index !== -1) {
    const dropped = studentState.registeredCourses.splice(index, 1)[0];

    // Decrement catalog enrolled count
    const catalogItem = COURSE_CATALOG.find(c => c.crn === activeDropCourseCrn);
    if (catalogItem && catalogItem.enrolled > 0) {
      catalogItem.enrolled -= 1;
    }

    updateRegistrationViews();
    closeModal("drop-modal");

    showToast("Course Dropped", `You have dropped ${dropped.code} from your schedule.`, "info");
  }

  activeDropCourseCrn = null;
}

// =============================================================================
// 7. COURSE DETAILS MODAL
// =============================================================================
function openDetailsModal(crn) {
  const course = COURSE_CATALOG.find(c => c.crn === crn);
  if (!course) return;

  document.getElementById("detail-modal-code").textContent = course.code;
  document.getElementById("detail-modal-units").textContent = `${course.units} Units`;
  document.getElementById("detail-modal-title").textContent = course.title;
  document.getElementById("detail-modal-desc").textContent = course.description;
  document.getElementById("detail-modal-dept").textContent = course.deptName;
  document.getElementById("detail-modal-instructor").textContent = course.instructor;
  document.getElementById("detail-modal-time").textContent = course.schedule;
  document.getElementById("detail-modal-room").textContent = course.location;
  document.getElementById("detail-modal-prereqs").textContent = course.prereqs;

  const openSeats = Math.max(0, course.capacity - course.enrolled);
  document.getElementById("detail-modal-seats-text").textContent =
    `${course.enrolled} / ${course.capacity} Enrolled (${openSeats} Open)`;

  const pct = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));
  const bar = document.getElementById("detail-modal-seats-bar");
  if (bar) bar.style.width = `${pct}%`;

  // Action button in detail modal
  const enrollBtn = document.getElementById("detail-modal-enroll-btn");
  const isEnrolled = studentState.registeredCourses.some(c => c.crn === course.crn);

  if (isEnrolled) {
    enrollBtn.textContent = "Drop Course";
    enrollBtn.className = "btn btn-danger";
    enrollBtn.onclick = () => {
      closeModal("details-modal");
      openDropModal(course.crn);
    };
  } else {
    enrollBtn.textContent = "Enroll in This Course";
    enrollBtn.className = "btn btn-primary";
    enrollBtn.onclick = () => {
      closeModal("details-modal");
      initiateCourseRegistration(course.crn);
    };
  }

  openModal("details-modal");
}

// =============================================================================
// 8. MODAL CONTROLS & UTILITIES
// =============================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modals on clicking backdrop
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Close modal on Escape key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.active").forEach(m => {
      m.classList.remove("active");
    });
    document.body.style.overflow = "";
  }
});

// =============================================================================
// 9. TOAST NOTIFICATIONS SYSTEM
// =============================================================================
function showToast(title, message, type = "info", duration = 4000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "⚠️";

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// =============================================================================
// 10. EVENT LISTENERS
// =============================================================================
function initEventListeners() {
  // Modal confirm submit
  const confirmBtn = document.getElementById("modal-confirm-submit-btn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", finalizeEnrollment);
  }

  // Modal drop submit
  const dropBtn = document.getElementById("confirm-drop-btn");
  if (dropBtn) {
    dropBtn.addEventListener("click", finalizeDropCourse);
  }

  // Course search input
  const searchInput = document.getElementById("course-search-input");
  const clearBtn = document.getElementById("clear-search-btn");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterState.keyword = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = filterState.keyword ? "flex" : "none";
      }
      renderCatalogGrid();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      filterState.keyword = "";
      clearBtn.style.display = "none";
      renderCatalogGrid();
    });
  }

  // Filter dropdowns
  const deptSelect = document.getElementById("filter-department");
  if (deptSelect) {
    deptSelect.addEventListener("change", (e) => {
      filterState.department = e.target.value;
      renderCatalogGrid();
    });
  }

  const levelSelect = document.getElementById("filter-level");
  if (levelSelect) {
    levelSelect.addEventListener("change", (e) => {
      filterState.level = e.target.value;
      renderCatalogGrid();
    });
  }

  const creditsSelect = document.getElementById("filter-credits");
  if (creditsSelect) {
    creditsSelect.addEventListener("change", (e) => {
      filterState.credits = e.target.value;
      renderCatalogGrid();
    });
  }

  const statusSelect = document.getElementById("filter-status");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      filterState.status = e.target.value;
      renderCatalogGrid();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById("sort-courses");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      filterState.sortBy = e.target.value;
      renderCatalogGrid();
    });
  }

  // Reset filters button
  const resetBtn = document.getElementById("reset-filters-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetAllFilters);
  }
}

// =============================================================================
// 11. PRINT RECEIPT & ADVISOR HELPER
// =============================================================================
function printScheduleReceipt() {
  const registered = studentState.registeredCourses;
  const totalUnits = registered.reduce((a, b) => a + b.units, 0);

  const printWindow = window.open("", "_blank", "width=800,height=700");
  if (!printWindow) {
    window.print();
    return;
  }

  const courseRows = registered.map(c => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ccc;">${c.code}</td>
      <td style="padding: 8px; border: 1px solid #ccc;">${c.title}</td>
      <td style="padding: 8px; border: 1px solid #ccc;">${c.schedule}</td>
      <td style="padding: 8px; border: 1px solid #ccc;">${c.location}</td>
      <td style="padding: 8px; border: 1px solid #ccc;">${c.units}.0</td>
      <td style="padding: 8px; border: 1px solid #ccc;">${c.grading}</td>
    </tr>
  `).join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Official Course Registration Slip - ${studentState.name}</title>
      <style>
        body { font-family: sans-serif; padding: 30px; color: #1e293b; }
        h1 { margin-bottom: 4px; color: #4338ca; }
        .meta { margin-bottom: 20px; font-size: 14px; color: #64748b; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
        th { background: #f1f5f9; text-align: left; padding: 8px; border: 1px solid #ccc; }
        .footer { margin-top: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
      </style>
    </head>
    <body>
      <h1>TritonRegister - Official Enrollment Verification</h1>
      <div class="meta">
        <strong>Student:</strong> ${studentState.name} (${studentState.studentId}) &nbsp;|&nbsp;
        <strong>Major:</strong> ${studentState.major} &nbsp;|&nbsp;
        <strong>Term:</strong> Fall Quarter 2026<br>
        <strong>Total Enrolled Units:</strong> ${totalUnits}.0 &nbsp;|&nbsp;
        <strong>Date:</strong> ${new Date().toLocaleDateString()}
      </div>
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Title</th>
            <th>Schedule</th>
            <th>Room</th>
            <th>Units</th>
            <th>Grading</th>
          </tr>
        </thead>
        <tbody>
          ${courseRows}
        </tbody>
      </table>
      <div class="footer">
        Office of the University Registrar • Verified Official Record • Print Timestamp: ${new Date().toLocaleString()}
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function showAcademicAdviserModal() {
  alert(
    "Warren College Academic Advising:\n\n" +
    "Advisor: Dr. Eleanor Vance\n" +
    "Email: advising-warren@ucsd.edu\n" +
    "Walk-in Hours: Mon-Thu 1:00 PM - 3:30 PM\n" +
    "Virtual Drop-in: https://zoom.us/my/warrenadvising"
  );
}
