/**
 * Apex University Course Registration System
 * Pure Vanilla JavaScript Application Logic
 */

// --- 1. COURSE CATALOG DATA ---
const COURSE_CATALOG = [
  {
    id: "CS101",
    code: "CS101",
    title: "Introduction to Computer Science & Problem Solving",
    department: "CS",
    deptName: "Computer Science",
    level: "Undergraduate",
    credits: 4,
    modality: "In-Person",
    instructor: "Prof. Alan Turing",
    schedule: "MWF 10:00 AM - 10:50 AM",
    room: "Turing Hall 101",
    seatsAvailable: 42,
    totalSeats: 50,
    description: "Foundational principles of algorithmic thinking, software abstraction, data types, and Python programming fundamentals.",
    prerequisites: "None. High school algebra recommended.",
    accentColor: "#6366f1"
  },
  {
    id: "CS216",
    code: "CS216",
    title: "Advanced Software Architecture & Distributed Systems",
    department: "CS",
    deptName: "Computer Science",
    level: "Graduate",
    credits: 4,
    modality: "Hybrid",
    instructor: "Prof. Barbara Liskov",
    schedule: "TR 2:00 PM - 3:20 PM",
    room: "Tech Center 204",
    seatsAvailable: 18,
    totalSeats: 30,
    description: "Design and evaluation of scalable microservice architectures, fault tolerance, distributed consensus, and event-driven data fabrics.",
    prerequisites: "CS101 and Data Structures (CS105).",
    accentColor: "#6366f1"
  },
  {
    id: "CS182",
    code: "CS182",
    title: "Deep Learning, Neural Networks & Generative AI",
    department: "CS",
    deptName: "Computer Science",
    level: "Undergraduate",
    credits: 4,
    modality: "In-Person",
    instructor: "Prof. Geoffrey Hinton",
    schedule: "MWF 1:00 PM - 1:50 PM",
    room: "SciHall 301",
    seatsAvailable: 5,
    totalSeats: 45,
    description: "Architectures of modern deep learning: backpropagation, Convolutional Nets, Transformers, attention mechanisms, and diffusion models.",
    prerequisites: "MATH180A and CS101.",
    accentColor: "#6366f1"
  },
  {
    id: "MATH109",
    code: "MATH109",
    title: "Mathematical Reasoning & Discrete Foundations",
    department: "MATH",
    deptName: "Mathematics",
    level: "Undergraduate",
    credits: 4,
    modality: "In-Person",
    instructor: "Prof. Terence Tao",
    schedule: "MWF 9:00 AM - 9:50 AM",
    room: "Euclid Hall 120",
    seatsAvailable: 25,
    totalSeats: 60,
    description: "Rigorous mathematical proof techniques: induction, contradiction, set theory, relations, combinatorics, and modular arithmetic.",
    prerequisites: "Calculus II (MATH20B).",
    accentColor: "#059669"
  },
  {
    id: "MATH180A",
    code: "MATH180A",
    title: "Introduction to Probability Theory & Stochastic Models",
    department: "MATH",
    deptName: "Mathematics",
    level: "Undergraduate",
    credits: 4,
    modality: "Online",
    instructor: "Prof. Persi Diaconis",
    schedule: "TR 9:30 AM - 10:50 AM",
    room: "Virtual Classroom Zoom",
    seatsAvailable: 12,
    totalSeats: 50,
    description: "Random variables, joint probability distributions, expectations, Markov chains, Law of Large Numbers, and Central Limit Theorem.",
    prerequisites: "MATH109 or Multivariable Calculus.",
    accentColor: "#059669"
  },
  {
    id: "DS100",
    code: "DS100",
    title: "Principles & Techniques of Data Science",
    department: "DS",
    deptName: "Data Science",
    level: "Undergraduate",
    credits: 4,
    modality: "In-Person",
    instructor: "Prof. Hadley Wickham",
    schedule: "TR 12:30 PM - 1:50 PM",
    room: "DataHub 110",
    seatsAvailable: 22,
    totalSeats: 55,
    description: "Exploratory data analysis, reproducible statistical modeling, data wrangling pipelines, feature engineering, and inference.",
    prerequisites: "CS101 and MATH180A.",
    accentColor: "#0284c7"
  },
  {
    id: "DS210",
    code: "DS210",
    title: "Scalable Machine Learning & Big Data Engineering",
    department: "DS",
    deptName: "Data Science",
    level: "Graduate",
    credits: 4,
    modality: "In-Person",
    instructor: "Prof. Matei Zaharia",
    schedule: "MW 3:30 PM - 4:50 PM",
    room: "DataHub 205",
    seatsAvailable: 10,
    totalSeats: 35,
    description: "Distributed computing using Apache Spark, GPU clusters, streaming data pipelines, and production machine learning serving.",
    prerequisites: "CS216 or DS100.",
    accentColor: "#0284c7"
  },
  {
    id: "BIO100",
    code: "BIO100",
    title: "Molecular & Cellular Biology",
    department: "BIO",
    deptName: "Biological Sciences",
    level: "Undergraduate",
    credits: 4,
    modality: "In-Person",
    instructor: "Prof. Jennifer Doudna",
    schedule: "MWF 11:00 AM - 11:50 AM",
    room: "BioMed 102",
    seatsAvailable: 8,
    totalSeats: 60,
    description: "Structure and function of cells, genetic regulation, CRISPR molecular tools, metabolic pathways, and cellular signal transduction.",
    prerequisites: "General Chemistry I.",
    accentColor: "#0d9488"
  },
  {
    id: "BIO150",
    code: "BIO150",
    title: "Human Genetics & Computational Genomics",
    department: "BIO",
    deptName: "Biological Sciences",
    level: "Undergraduate",
    credits: 3,
    modality: "Hybrid",
    instructor: "Prof. Francis Collins",
    schedule: "TR 11:00 AM - 12:20 PM",
    room: "BioMed 215",
    seatsAvailable: 15,
    totalSeats: 40,
    description: "Mendelian inheritance, population genetics, next-generation DNA sequencing analysis, bioinformatics algorithms, and ethical genetic testing.",
    prerequisites: "BIO100.",
    accentColor: "#0d9488"
  },
  {
    id: "ECON101",
    code: "ECON101",
    title: "Principles of Macroeconomics & Monetary Policy",
    department: "ECON",
    deptName: "Economics",
    level: "Undergraduate",
    credits: 3,
    modality: "Online",
    instructor: "Prof. Janet Yellen",
    schedule: "MWF 2:00 PM - 2:50 PM",
    room: "Virtual Lecture Hall",
    seatsAvailable: 30,
    totalSeats: 80,
    description: "National income determination, fiscal policies, central bank interest mechanisms, international currency exchange, and global economic cycles.",
    prerequisites: "None.",
    accentColor: "#d97706"
  },
  {
    id: "ECON130",
    code: "ECON130",
    title: "Behavioral Economics & Decision Sciences",
    department: "ECON",
    deptName: "Economics",
    level: "Undergraduate",
    credits: 3,
    modality: "In-Person",
    instructor: "Prof. Daniel Kahneman",
    schedule: "TR 3:30 PM - 4:50 PM",
    room: "SocialSci 210",
    seatsAvailable: 14,
    totalSeats: 40,
    description: "Heuristics, biases, prospect theory, nudge policies, and irrational behavior modeling in modern markets and institutional finance.",
    prerequisites: "ECON101 or PSYC101.",
    accentColor: "#d97706"
  },
  {
    id: "ART105",
    code: "ART105",
    title: "Digital Design Systems & User Experience Interaction",
    department: "ART",
    deptName: "Visual & Digital Arts",
    level: "Undergraduate",
    credits: 3,
    modality: "In-Person",
    instructor: "Prof. John Maeda",
    schedule: "TR 10:00 AM - 11:50 AM",
    room: "Arts Studio B",
    seatsAvailable: 6,
    totalSeats: 25,
    description: "Typography, color theory, design thinking methodologies, accessibility standards, responsive prototyping, and design systems.",
    prerequisites: "None.",
    accentColor: "#db2777"
  },
  {
    id: "PSYC101",
    code: "PSYC101",
    title: "Cognitive Psychology & Human Memory Systems",
    department: "PSYC",
    deptName: "Psychology",
    level: "Undergraduate",
    credits: 3,
    modality: "In-Person",
    instructor: "Prof. Elizabeth Loftus",
    schedule: "MWF 12:00 PM - 12:50 PM",
    room: "MindCenter 101",
    seatsAvailable: 20,
    totalSeats: 65,
    description: "Empirical study of attention, working memory, perception, language acquisition, problem solving, and neural cognitive mechanisms.",
    prerequisites: "None.",
    accentColor: "#7c3aed"
  },
  {
    id: "PHIL110",
    code: "PHIL110",
    title: "Ethics of Artificial Intelligence & Autonomous Systems",
    department: "PHIL",
    deptName: "Philosophy & Ethics",
    level: "Undergraduate",
    credits: 3,
    modality: "Hybrid",
    instructor: "Prof. Michael Sandel",
    schedule: "TR 1:00 PM - 2:20 PM",
    room: "Humanities 302",
    seatsAvailable: 16,
    totalSeats: 35,
    description: "Ethical inquiries surrounding algorithmic bias, machine surveillance, autonomous weapons, deepfakes, copyright, and moral responsibility.",
    prerequisites: "None.",
    accentColor: "#2563eb"
  }
];

// --- 2. APPLICATION STATE ---
let state = {
  activeView: "home",
  // Initial pre-registered courses (CS101 and MATH109)
  registeredCourses: [
    {
      courseId: "CS101",
      gradeOption: "Letter Grade (A-F)",
      registeredDate: "2026-10-02"
    },
    {
      courseId: "MATH109",
      gradeOption: "Letter Grade (A-F)",
      registeredDate: "2026-10-03"
    }
  ],
  filters: {
    search: "",
    department: "ALL",
    level: "ALL",
    credits: "ALL",
    modality: "ALL",
    sort: "code-asc"
  },
  pendingRegistration: null, // holds course data while confirmation modal is open
  pendingDropCode: null      // holds course code to drop
};

// Base completed credits for student Alex Morgan
const BASE_COMPLETED_UNITS = 76;
const DEGREE_TARGET_UNITS = 120;
const MAX_ENROLLMENT_UNITS = 18;

// --- 3. DOM ELEMENTS ---
const elements = {
  // Navigation
  navLinks: document.querySelectorAll(".nav-item, .mobile-nav-item, [data-target]"),
  navRegisteredCount: document.getElementById("navRegisteredCount"),
  mobileRegisteredCount: document.getElementById("mobileRegisteredCount"),
  mobileMenuBtn: document.getElementById("mobileMenuBtn"),
  mobileDrawer: document.getElementById("mobileDrawer"),
  views: document.querySelectorAll(".page-view"),

  // Home
  homeTotalCourses: document.getElementById("homeTotalCourses"),
  homeRegisteredUnits: document.getElementById("homeRegisteredUnits"),
  homeFeaturedGrid: document.getElementById("homeFeaturedGrid"),

  // Catalog
  courseSearchInput: document.getElementById("courseSearchInput"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  sortCoursesSelect: document.getElementById("sortCoursesSelect"),
  filterDepartment: document.getElementById("filterDepartment"),
  filterLevel: document.getElementById("filterLevel"),
  filterCredits: document.getElementById("filterCredits"),
  filterModality: document.getElementById("filterModality"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),
  catalogCoursesGrid: document.getElementById("catalogCoursesGrid"),
  catalogResultsCount: document.getElementById("catalogResultsCount"),
  activeFilterTags: document.getElementById("activeFilterTags"),
  catalogNoResults: document.getElementById("catalogNoResults"),

  // Registration Workbench
  regCurrentUnits: document.getElementById("regCurrentUnits"),
  regCoursesCount: document.getElementById("regCoursesCount"),
  regUnitsProgressBar: document.getElementById("regUnitsProgressBar"),
  regCourseSelect: document.getElementById("regCourseSelect"),
  courseQuickPreview: document.getElementById("courseQuickPreview"),
  prevCode: document.getElementById("prevCode"),
  prevDept: document.getElementById("prevDept"),
  prevTitle: document.getElementById("prevTitle"),
  prevInstructor: document.getElementById("prevInstructor"),
  prevSchedule: document.getElementById("prevSchedule"),
  prevCredits: document.getElementById("prevCredits"),
  prevSeats: document.getElementById("prevSeats"),
  registrationForm: document.getElementById("registrationForm"),
  regGradeOption: document.getElementById("regGradeOption"),
  regPrereqAgree: document.getElementById("regPrereqAgree"),

  // Registered Data Table
  registeredTableBody: document.getElementById("registeredTableBody"),
  registeredTableFooter: document.getElementById("registeredTableFooter"),
  totalTableUnits: document.getElementById("totalTableUnits"),
  emptyRegisteredState: document.getElementById("emptyRegisteredState"),

  // Profile
  profileCompletedUnits: document.getElementById("profileCompletedUnits"),
  profileUnitsPercent: document.getElementById("profileUnitsPercent"),
  profileProgressBar: document.getElementById("profileProgressBar"),
  profileCurrentRegUnits: document.getElementById("profileCurrentRegUnits"),
  profileProjectedUnits: document.getElementById("profileProjectedUnits"),
  profileRegisteredList: document.getElementById("profileRegisteredList"),

  // Confirmation Modal
  confirmationModal: document.getElementById("confirmationModal"),
  modalCourseCode: document.getElementById("modalCourseCode"),
  modalCourseDept: document.getElementById("modalCourseDept"),
  modalCourseTitle: document.getElementById("modalCourseTitle"),
  modalCourseInstructor: document.getElementById("modalCourseInstructor"),
  modalCourseSchedule: document.getElementById("modalCourseSchedule"),
  modalCourseRoom: document.getElementById("modalCourseRoom"),
  modalCourseCredits: document.getElementById("modalCourseCredits"),
  modalCourseGradeOption: document.getElementById("modalCourseGradeOption"),

  // Drop Modal
  dropModal: document.getElementById("dropModal"),
  dropCourseTarget: document.getElementById("dropCourseTarget"),

  // Detail Modal
  courseDetailModal: document.getElementById("courseDetailModal"),
  detailCourseCode: document.getElementById("detailCourseCode"),
  detailCourseDept: document.getElementById("detailCourseDept"),
  detailCourseTitle: document.getElementById("detailCourseTitle"),
  detailCourseDesc: document.getElementById("detailCourseDesc"),
  detailInstructor: document.getElementById("detailInstructor"),
  detailSchedule: document.getElementById("detailSchedule"),
  detailLocation: document.getElementById("detailLocation"),
  detailCredits: document.getElementById("detailCredits"),
  detailLevel: document.getElementById("detailLevel"),
  detailModality: document.getElementById("detailModality"),
  detailSeats: document.getElementById("detailSeats"),
  detailPrereqs: document.getElementById("detailPrereqs"),
  detailRegisterActionBtn: document.getElementById("detailRegisterActionBtn"),

  // Advisor Modal
  advisorModal: document.getElementById("advisorModal"),
  toastContainer: document.getElementById("toastContainer")
};

// --- 4. INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCatalogFilters();
  initRegistrationForm();
  renderAllViews();

  // Listen to hash change for deep-linking
  window.addEventListener("hashchange", handleHashChange);
  if (window.location.hash) {
    const targetView = window.location.hash.replace("#", "");
    navigateTo(targetView);
  }
});

// --- 5. NAVIGATION ROUTER ---
function initNavigation() {
  // Mobile drawer toggle
  if (elements.mobileMenuBtn) {
    elements.mobileMenuBtn.addEventListener("click", () => {
      elements.mobileDrawer.classList.toggle("open");
    });
  }

  // Click on any element with data-target
  document.addEventListener("click", (e) => {
    const targetElement = e.target.closest("[data-target]");
    if (targetElement) {
      const page = targetElement.getAttribute("data-target");
      if (page) {
        e.preventDefault();
        navigateTo(page);
        if (elements.mobileDrawer) elements.mobileDrawer.classList.remove("open");
      }
    }
  });
}

function handleHashChange() {
  const hash = window.location.hash.replace("#", "");
  if (["home", "catalog", "registration", "profile"].includes(hash)) {
    navigateTo(hash, false);
  }
}

function navigateTo(viewName, updateHash = true) {
  if (!["home", "catalog", "registration", "profile"].includes(viewName)) {
    viewName = "home";
  }

  state.activeView = viewName;
  if (updateHash) {
    window.location.hash = viewName;
  }

  // Switch active page view
  elements.views.forEach((v) => {
    v.classList.remove("active");
  });

  const activeElem = document.getElementById(`view-${viewName}`);
  if (activeElem) {
    activeElem.classList.add("active");
  }

  // Update Nav links active states
  document.querySelectorAll(".nav-item, .mobile-nav-item").forEach((item) => {
    if (item.getAttribute("data-target") === viewName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Refresh view-specific dynamic contents
  if (viewName === "catalog") {
    renderCatalog();
  } else if (viewName === "registration") {
    renderRegistrationView();
  } else if (viewName === "profile") {
    renderProfileView();
  }
}

// --- 6. CATALOG SEARCH & FILTERING LOGIC ---
function initCatalogFilters() {
  // Search text input
  elements.courseSearchInput.addEventListener("input", (e) => {
    state.filters.search = e.target.value.trim().toLowerCase();
    elements.clearSearchBtn.style.display = state.filters.search ? "block" : "none";
    renderCatalog();
  });

  // Clear search button
  elements.clearSearchBtn.addEventListener("click", () => {
    elements.courseSearchInput.value = "";
    state.filters.search = "";
    elements.clearSearchBtn.style.display = "none";
    renderCatalog();
  });

  // Sort dropdown
  elements.sortCoursesSelect.addEventListener("change", (e) => {
    state.filters.sort = e.target.value;
    renderCatalog();
  });

  // Department filter
  elements.filterDepartment.addEventListener("change", (e) => {
    state.filters.department = e.target.value;
    renderCatalog();
  });

  // Level filter
  elements.filterLevel.addEventListener("change", (e) => {
    state.filters.level = e.target.value;
    renderCatalog();
  });

  // Credits filter
  elements.filterCredits.addEventListener("change", (e) => {
    state.filters.credits = e.target.value;
    renderCatalog();
  });

  // Modality filter
  elements.filterModality.addEventListener("change", (e) => {
    state.filters.modality = e.target.value;
    renderCatalog();
  });

  // Reset Filters Button
  elements.resetFiltersBtn.addEventListener("click", resetAllFilters);
}

function resetAllFilters() {
  state.filters.search = "";
  state.filters.department = "ALL";
  state.filters.level = "ALL";
  state.filters.credits = "ALL";
  state.filters.modality = "ALL";
  state.filters.sort = "code-asc";

  elements.courseSearchInput.value = "";
  elements.clearSearchBtn.style.display = "none";
  elements.filterDepartment.value = "ALL";
  elements.filterLevel.value = "ALL";
  elements.filterCredits.value = "ALL";
  elements.filterModality.value = "ALL";
  elements.sortCoursesSelect.value = "code-asc";

  renderCatalog();
  showToast("Filters reset to default view", "info");
}

function getFilteredCourses() {
  return COURSE_CATALOG.filter((course) => {
    // Search match
    if (state.filters.search) {
      const q = state.filters.search;
      const matchCode = course.code.toLowerCase().includes(q);
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchInstructor = course.instructor.toLowerCase().includes(q);
      const matchDept = course.deptName.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchInstructor && !matchDept && !matchDesc) {
        return false;
      }
    }

    // Department match
    if (state.filters.department !== "ALL" && course.department !== state.filters.department) {
      return false;
    }

    // Level match
    if (state.filters.level !== "ALL" && course.level !== state.filters.level) {
      return false;
    }

    // Credits match
    if (state.filters.credits !== "ALL" && course.credits !== parseInt(state.filters.credits, 10)) {
      return false;
    }

    // Modality match
    if (state.filters.modality !== "ALL" && course.modality !== state.filters.modality) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (state.filters.sort) {
      case "code-asc":
        return a.code.localeCompare(b.code);
      case "code-desc":
        return b.code.localeCompare(a.code);
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "seats-desc":
        return b.seatsAvailable - a.seatsAvailable;
      case "credits-desc":
        return b.credits - a.credits;
      default:
        return 0;
    }
  });
}

function renderCatalog() {
  const filtered = getFilteredCourses();

  // Update counts
  elements.catalogResultsCount.textContent = `Showing ${filtered.length} of ${COURSE_CATALOG.length} courses`;

  // Render active filter badges
  renderActiveFilterTags();

  // Handle empty state
  if (filtered.length === 0) {
    elements.catalogCoursesGrid.innerHTML = "";
    elements.catalogNoResults.classList.remove("hidden");
    return;
  }

  elements.catalogNoResults.classList.add("hidden");
  elements.catalogCoursesGrid.innerHTML = filtered.map((course) => createCourseCardHTML(course)).join("");
}

function renderActiveFilterTags() {
  const tags = [];
  if (state.filters.department !== "ALL") {
    tags.push({ key: "department", label: `Dept: ${state.filters.department}` });
  }
  if (state.filters.level !== "ALL") {
    tags.push({ key: "level", label: `Level: ${state.filters.level}` });
  }
  if (state.filters.credits !== "ALL") {
    tags.push({ key: "credits", label: `${state.filters.credits} Credits` });
  }
  if (state.filters.modality !== "ALL") {
    tags.push({ key: "modality", label: `Modality: ${state.filters.modality}` });
  }
  if (state.filters.search) {
    tags.push({ key: "search", label: `Keyword: "${state.filters.search}"` });
  }

  elements.activeFilterTags.innerHTML = tags.map(t => `
    <span class="filter-tag-pill">
      ${t.label}
      <button onclick="removeFilterTag('${t.key}')" aria-label="Remove filter">&times;</button>
    </span>
  `).join("");
}

function removeFilterTag(key) {
  if (key === "search") {
    state.filters.search = "";
    elements.courseSearchInput.value = "";
    elements.clearSearchBtn.style.display = "none";
  } else if (key === "department") {
    state.filters.department = "ALL";
    elements.filterDepartment.value = "ALL";
  } else if (key === "level") {
    state.filters.level = "ALL";
    elements.filterLevel.value = "ALL";
  } else if (key === "credits") {
    state.filters.credits = "ALL";
    elements.filterCredits.value = "ALL";
  } else if (key === "modality") {
    state.filters.modality = "ALL";
    elements.filterModality.value = "ALL";
  }
  renderCatalog();
}

// --- 7. COURSE CARD COMPONENT ---
function createCourseCardHTML(course) {
  const isRegistered = state.registeredCourses.some((rc) => rc.courseId === course.id);
  const seatsPercent = Math.round((course.seatsAvailable / course.totalSeats) * 100);
  const deptClass = `badge-dept-${course.department.toLowerCase()}`;

  let seatsColorClass = "fill-green";
  if (course.seatsAvailable <= 6) {
    seatsColorClass = "fill-rose";
  } else if (course.seatsAvailable <= 15) {
    seatsColorClass = "fill-amber";
  }

  return `
    <article class="course-card" id="card-${course.id}">
      <div class="course-card-top-accent" style="background: ${course.accentColor}"></div>
      
      <div class="course-card-header">
        <div class="course-code-wrap">
          <span class="course-code">${course.code}</span>
          <span class="dept-badge ${deptClass}">${course.deptName}</span>
        </div>
        <div class="credit-pill">${course.credits} Units</div>
      </div>

      <div class="course-card-body">
        <h3 class="course-title">${course.title}</h3>
        <p class="course-desc-short">${course.description}</p>

        <div class="course-meta-list">
          <div class="course-meta-row">
            <i class="fa-solid fa-chalkboard-user"></i>
            <span><strong>${course.instructor}</strong></span>
          </div>
          <div class="course-meta-row">
            <i class="fa-regular fa-clock"></i>
            <span>${course.schedule}</span>
          </div>
          <div class="course-meta-row">
            <i class="fa-solid fa-location-dot"></i>
            <span>${course.room} (${course.modality})</span>
          </div>
        </div>

        <div class="seats-progress-wrap">
          <div class="seats-label-row">
            <span>Seat Availability</span>
            <span class="${course.seatsAvailable <= 6 ? 'seats-low' : 'seats-open'}">
              ${course.seatsAvailable} of ${course.totalSeats} seats open
            </span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill ${seatsColorClass}" style="width: ${seatsPercent}%;"></div>
          </div>
        </div>

        <div class="course-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="openDetailModal('${course.id}')">
            <i class="fa-solid fa-circle-info"></i> Details
          </button>
          
          ${
            isRegistered
              ? `<div class="badge-registered-indicator">
                   <i class="fa-solid fa-circle-check"></i> Enrolled
                 </div>`
              : `<button class="btn btn-primary btn-sm btn-full" onclick="promptDirectEnrollment('${course.id}')">
                   <i class="fa-solid fa-plus-circle"></i> Quick Register
                 </button>`
          }
        </div>
      </div>
    </article>
  `;
}

// --- 8. REGISTRATION WORKBENCH & DATA TABLE ---
function initRegistrationForm() {
  elements.regCourseSelect.addEventListener("change", (e) => {
    const selectedCourseId = e.target.value;
    const course = COURSE_CATALOG.find((c) => c.id === selectedCourseId);
    if (course) {
      elements.prevCode.textContent = course.code;
      elements.prevDept.textContent = course.deptName;
      elements.prevTitle.textContent = course.title;
      elements.prevInstructor.textContent = course.instructor;
      elements.prevSchedule.textContent = course.schedule;
      elements.prevCredits.textContent = `${course.credits} Credits`;
      elements.prevSeats.textContent = `${course.seatsAvailable} Open Seats`;
      elements.courseQuickPreview.classList.remove("hidden");
    } else {
      elements.courseQuickPreview.classList.add("hidden");
    }
  });
}

function handleRegistrationFormSubmit(e) {
  e.preventDefault();

  const selectedCourseId = elements.regCourseSelect.value;
  const gradeOption = elements.regGradeOption.value;
  const prereqAgreed = elements.regPrereqAgree.checked;

  if (!selectedCourseId) {
    showToast("Please choose a course to register.", "warning");
    return;
  }

  if (!prereqAgreed) {
    showToast("Please acknowledge course prerequisites.", "warning");
    return;
  }

  promptDirectEnrollment(selectedCourseId, gradeOption);
}

function promptDirectEnrollment(courseId, gradeOption = "Letter Grade (A-F)") {
  const course = COURSE_CATALOG.find((c) => c.id === courseId);
  if (!course) return;

  // Check if already registered
  const alreadyEnrolled = state.registeredCourses.some((rc) => rc.courseId === course.id);
  if (alreadyEnrolled) {
    showToast(`You are already enrolled in ${course.code}!`, "warning");
    return;
  }

  // Check credit overload limit
  const currentUnits = calculateRegisteredUnits();
  if (currentUnits + course.credits > MAX_ENROLLMENT_UNITS) {
    showToast(`Cannot enroll: Adding ${course.credits} units exceeds max term limit of ${MAX_ENROLLMENT_UNITS} units.`, "error");
    return;
  }

  // Check seat capacity
  if (course.seatsAvailable <= 0) {
    showToast(`Registration closed: ${course.code} has 0 seats remaining.`, "error");
    return;
  }

  // Open Confirmation Modal with course data
  state.pendingRegistration = {
    course: course,
    gradeOption: gradeOption
  };

  elements.modalCourseCode.textContent = course.code;
  elements.modalCourseDept.textContent = course.deptName;
  elements.modalCourseTitle.textContent = course.title;
  elements.modalCourseInstructor.textContent = course.instructor;
  elements.modalCourseSchedule.textContent = course.schedule;
  elements.modalCourseRoom.textContent = course.room;
  elements.modalCourseCredits.textContent = `${course.credits} Units`;
  elements.modalCourseGradeOption.textContent = gradeOption;

  elements.confirmationModal.classList.remove("hidden");
}

function closeConfirmationModal() {
  elements.confirmationModal.classList.add("hidden");
  state.pendingRegistration = null;
}

function executeRegistrationConfirmation() {
  if (!state.pendingRegistration) return;

  const { course, gradeOption } = state.pendingRegistration;

  // Add course to registered list
  state.registeredCourses.push({
    courseId: course.id,
    gradeOption: gradeOption,
    registeredDate: new Date().toISOString().split("T")[0]
  });

  // Decrement seat count
  course.seatsAvailable = Math.max(0, course.seatsAvailable - 1);

  // Close modals
  closeConfirmationModal();
  closeDetailModal();

  // Reset form inputs
  elements.regCourseSelect.value = "";
  elements.courseQuickPreview.classList.add("hidden");
  elements.regPrereqAgree.checked = false;

  // Refresh UI
  renderAllViews();
  showToast(`Successfully registered for ${course.code}: ${course.title}!`, "success");
}

// --- 9. DROP COURSE FLOW ---
function promptDropCourse(courseId) {
  const course = COURSE_CATALOG.find((c) => c.id === courseId);
  if (!course) return;

  state.pendingDropCode = course.id;
  elements.dropCourseTarget.textContent = `${course.code} - ${course.title}`;
  elements.dropModal.classList.remove("hidden");
}

function closeDropModal() {
  elements.dropModal.classList.add("hidden");
  state.pendingDropCode = null;
}

function executeDropCourse() {
  if (!state.pendingDropCode) return;

  const courseId = state.pendingDropCode;
  const course = COURSE_CATALOG.find((c) => c.id === courseId);

  // Remove from registeredCourses
  state.registeredCourses = state.registeredCourses.filter((rc) => rc.courseId !== courseId);

  // Increment seat back
  if (course) {
    course.seatsAvailable = Math.min(course.totalSeats, course.seatsAvailable + 1);
  }

  closeDropModal();
  renderAllViews();
  showToast(`Successfully dropped ${course ? course.code : 'course'}. Seat released.`, "info");
}

// --- 10. RENDERING ALL VIEWS & DATA TABLES ---
function calculateRegisteredUnits() {
  return state.registeredCourses.reduce((sum, item) => {
    const course = COURSE_CATALOG.find((c) => c.id === item.courseId);
    return sum + (course ? course.credits : 0);
  }, 0);
}

function renderAllViews() {
  const totalUnits = calculateRegisteredUnits();
  const enrolledCount = state.registeredCourses.length;

  // 1. Update Navbar Badges
  elements.navRegisteredCount.textContent = enrolledCount;
  elements.mobileRegisteredCount.textContent = enrolledCount;

  // 2. Update Home View Stats & Featured
  if (elements.homeTotalCourses) elements.homeTotalCourses.textContent = COURSE_CATALOG.length;
  if (elements.homeRegisteredUnits) elements.homeRegisteredUnits.textContent = `${totalUnits} Units`;
  renderHomeFeatured();

  // 3. Update Registration View
  renderRegistrationView();

  // 4. Update Profile View
  renderProfileView();

  // 5. Update Catalog View (if active)
  if (state.activeView === "catalog") {
    renderCatalog();
  }
}

function renderHomeFeatured() {
  if (!elements.homeFeaturedGrid) return;
  // Pick 3 popular courses (CS182, CS216, BIO100)
  const featured = COURSE_CATALOG.filter(c => ["CS182", "CS216", "DS100"].includes(c.id));
  elements.homeFeaturedGrid.innerHTML = featured.map(course => createCourseCardHTML(course)).join("");
}

function renderRegistrationView() {
  const totalUnits = calculateRegisteredUnits();
  const enrolledCount = state.registeredCourses.length;

  // Overview stats
  elements.regCurrentUnits.textContent = totalUnits;
  elements.regCoursesCount.textContent = `${enrolledCount} Course${enrolledCount === 1 ? '' : 's'}`;
  const percentUnits = Math.min(100, (totalUnits / MAX_ENROLLMENT_UNITS) * 100);
  elements.regUnitsProgressBar.style.width = `${percentUnits}%`;

  // Populate Add Course Dropdown with UNREGISTERED courses
  const unregisteredCourses = COURSE_CATALOG.filter(
    (c) => !state.registeredCourses.some((rc) => rc.courseId === c.id)
  );

  let selectHTML = '<option value="" disabled selected>-- Choose an available course --</option>';
  unregisteredCourses.forEach((course) => {
    selectHTML += `<option value="${course.id}">${course.code} - ${course.title} (${course.credits} Units • ${course.seatsAvailable} seats)</option>`;
  });
  elements.regCourseSelect.innerHTML = selectHTML;

  // Populate Registered Courses Data Table
  if (enrolledCount === 0) {
    elements.registeredTableBody.innerHTML = "";
    elements.registeredTableFooter.classList.add("hidden");
    elements.emptyRegisteredState.classList.remove("hidden");
  } else {
    elements.emptyRegisteredState.classList.add("hidden");
    elements.registeredTableFooter.classList.remove("hidden");
    elements.totalTableUnits.textContent = `${totalUnits} Units`;

    elements.registeredTableBody.innerHTML = state.registeredCourses.map((regItem) => {
      const course = COURSE_CATALOG.find((c) => c.id === regItem.courseId);
      if (!course) return "";

      const deptClass = `badge-dept-${course.department.toLowerCase()}`;

      return `
        <tr>
          <td>
            <span class="table-code-badge">${course.code}</span>
            <span class="dept-badge ${deptClass}">${course.department}</span>
          </td>
          <td>
            <div class="table-course-title">${course.title}</div>
            <small class="text-muted">${course.level}</small>
          </td>
          <td>${course.deptName}</td>
          <td><strong>${course.instructor}</strong></td>
          <td>
            <div class="table-schedule-block">
              <span class="table-schedule-time">${course.schedule}</span>
              <span class="table-schedule-room"><i class="fa-solid fa-location-dot"></i> ${course.room}</span>
            </div>
          </td>
          <td><strong>${course.credits}</strong></td>
          <td><span class="table-grade-pill">${regItem.gradeOption}</span></td>
          <td><span class="badge-status-enrolled">Enrolled</span></td>
          <td class="text-center">
            <button class="btn-drop-action" onclick="promptDropCourse('${course.id}')" title="Drop course">
              <i class="fa-solid fa-trash-can"></i> Drop
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }
}

function renderProfileView() {
  const currentRegUnits = calculateRegisteredUnits();
  const projectedUnits = BASE_COMPLETED_UNITS + currentRegUnits;
  const percentCompleted = Math.round((projectedUnits / DEGREE_TARGET_UNITS) * 100);

  elements.profileCompletedUnits.textContent = BASE_COMPLETED_UNITS;
  elements.profileCurrentRegUnits.textContent = currentRegUnits;
  elements.profileProjectedUnits.textContent = projectedUnits;
  elements.profileUnitsPercent.textContent = `${percentCompleted}% Completed`;
  elements.profileProgressBar.style.width = `${percentCompleted}%`;

  // Render enrolled courses schedule list in profile
  if (state.registeredCourses.length === 0) {
    elements.profileRegisteredList.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); background: var(--bg-subtle); border-radius: 12px;">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
        No registered courses for Fall 2026.
      </div>
    `;
  } else {
    elements.profileRegisteredList.innerHTML = state.registeredCourses.map((item) => {
      const course = COURSE_CATALOG.find((c) => c.id === item.courseId);
      if (!course) return "";

      return `
        <div class="profile-course-item" style="border-left-color: ${course.accentColor}">
          <div class="profile-course-info">
            <span class="p-course-code">${course.code}</span>
            <span class="p-course-title">${course.title}</span>
            <span class="p-course-schedule"><i class="fa-regular fa-clock"></i> ${course.schedule} • ${course.room}</span>
          </div>
          <div class="p-units-pill">${course.credits} Units</div>
        </div>
      `;
    }).join("");
  }
}

// --- 11. COURSE DETAIL MODAL ---
function openDetailModal(courseId) {
  const course = COURSE_CATALOG.find((c) => c.id === courseId);
  if (!course) return;

  const isEnrolled = state.registeredCourses.some((rc) => rc.courseId === course.id);

  elements.detailCourseCode.textContent = course.code;
  elements.detailCourseDept.textContent = `${course.deptName} Department`;
  elements.detailCourseTitle.textContent = course.title;
  elements.detailCourseDesc.textContent = course.description;
  elements.detailInstructor.textContent = course.instructor;
  elements.detailSchedule.textContent = course.schedule;
  elements.detailLocation.textContent = course.room;
  elements.detailCredits.textContent = `${course.credits} Units`;
  elements.detailLevel.textContent = course.level;
  elements.detailModality.textContent = course.modality;
  elements.detailSeats.textContent = `${course.seatsAvailable} of ${course.totalSeats} seats open`;
  elements.detailPrereqs.textContent = course.prerequisites;

  if (isEnrolled) {
    elements.detailRegisterActionBtn.innerHTML = `<i class="fa-solid fa-check"></i> Already Enrolled`;
    elements.detailRegisterActionBtn.disabled = true;
    elements.detailRegisterActionBtn.className = "btn btn-secondary";
  } else {
    elements.detailRegisterActionBtn.innerHTML = `<i class="fa-solid fa-plus-circle"></i> Register for This Course`;
    elements.detailRegisterActionBtn.disabled = false;
    elements.detailRegisterActionBtn.className = "btn btn-primary";
    elements.detailRegisterActionBtn.onclick = () => {
      closeDetailModal();
      promptDirectEnrollment(course.id);
    };
  }

  elements.courseDetailModal.classList.remove("hidden");
}

function closeDetailModal() {
  elements.courseDetailModal.classList.add("hidden");
}

// --- 12. ADVISOR MODAL & ACTIONS ---
function showAdvisorModal() {
  elements.advisorModal.classList.remove("hidden");
}

function closeAdvisorModal() {
  elements.advisorModal.classList.add("hidden");
}

function handleAdvisorSubmit(e) {
  e.preventDefault();
  closeAdvisorModal();
  showToast("Your message has been dispatched to Dr. Patricia Vance.", "success");
}

function printSchedule() {
  window.print();
}

// --- 13. TOAST NOTIFICATION SYSTEM ---
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconHTML = '<i class="fa-solid fa-circle-info"></i>';
  let title = "Notification";

  if (type === "success") {
    iconHTML = '<i class="fa-solid fa-circle-check"></i>';
    title = "Success";
  } else if (type === "warning") {
    iconHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    title = "Notice";
  } else if (type === "error") {
    iconHTML = '<i class="fa-solid fa-circle-xmark"></i>';
    title = "Action Blocked";
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconHTML}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  elements.toastContainer.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.classList.add("hiding");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// Close modals when clicking backdrop
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    e.target.classList.add("hidden");
  }
});
