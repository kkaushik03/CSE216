/**
 * Apex University Course Registration System
 * Core Application Logic & State Management
 */

(function () {
  'use strict';

  // ==========================================
  // Mock Data: Initial Course Catalog
  // ==========================================
  const INITIAL_COURSES = [
    {
      id: "CSE-216",
      code: "CSE 216",
      title: "Advanced Software Engineering",
      dept: "CSE",
      level: "Graduate",
      units: 4.0,
      instructor: "Prof. David Martinez",
      schedule: "Mon/Wed 10:00 - 11:30 AM",
      location: "CSE Hall 1202",
      mode: "In-Person",
      capacity: 35,
      enrolled: 28,
      prereqs: "CSE 110 or equivalent software development experience",
      description: "Explores advanced design patterns, distributed architectures, microservices, DevOps pipelines, test-driven development, and scalable cloud solutions.",
      featured: true,
      accentColor: "#6366f1"
    },
    {
      id: "CSE-224",
      code: "CSE 224",
      title: "Graduate Networked Systems",
      dept: "CSE",
      level: "Graduate",
      units: 4.0,
      instructor: "Prof. Alex Snoeren",
      schedule: "Tue/Thu 2:00 - 3:30 PM",
      location: "Warren Lecture Hall 2001",
      mode: "In-Person",
      capacity: 40,
      enrolled: 39,
      prereqs: "CSE 123 or consent of instructor",
      description: "Principles of computer networks, RPC mechanisms, fault tolerance, consensus algorithms (Raft/Paxos), and modern software-defined data center fabrics.",
      featured: true,
      accentColor: "#8b5cf6"
    },
    {
      id: "MATH-180A",
      code: "MATH 180A",
      title: "Introduction to Probability",
      dept: "MATH",
      level: "Upper",
      units: 4.0,
      instructor: "Dr. Elena Vance",
      schedule: "Mon/Wed/Fri 1:00 - 1:50 PM",
      location: "Applied Physics 110",
      mode: "In-Person",
      capacity: 120,
      enrolled: 115,
      prereqs: "MATH 20C or MATH 31BH with grade of C- or better",
      description: "Probability spaces, conditional probability, independence, random variables, distribution functions, mathematical expectation, law of large numbers, and central limit theorem.",
      featured: true,
      accentColor: "#0ea5e9"
    },
    {
      id: "CSE-258",
      code: "CSE 258",
      title: "Recommender Systems & Web Mining",
      dept: "CSE",
      level: "Graduate",
      units: 4.0,
      instructor: "Prof. Julian McAuley",
      schedule: "Tue/Thu 11:00 AM - 12:20 PM",
      location: "Center Hall 105",
      mode: "Hybrid",
      capacity: 80,
      enrolled: 62,
      prereqs: "Basic linear algebra, probability, and proficiency in Python",
      description: "Current methods for web mining and recommender systems. Collaborative filtering, matrix factorization, content-based recommendation, latent factor models, and deep learning for NLP.",
      featured: true,
      accentColor: "#ec4899"
    },
    {
      id: "ECE-140A",
      code: "ECE 140A",
      title: "Full-Stack Embedded Systems",
      dept: "ECE",
      level: "Upper",
      units: 4.0,
      instructor: "Prof. Ramsin Khoshabeh",
      schedule: "Mon/Wed 3:30 - 4:50 PM",
      location: "Jacobs Hall 4309",
      mode: "In-Person",
      capacity: 45,
      enrolled: 45, // Full / Waitlist
      prereqs: "ECE 16 or CSE 30",
      description: "Hands-on engineering connecting physical microcontrollers (ESP32/Raspberry Pi) to cloud backends, WebSockets, time-series dashboards, and edge AI inference.",
      featured: false,
      accentColor: "#f59e0b"
    },
    {
      id: "COGS-108",
      code: "COGS 108",
      title: "Data Science in Practice",
      dept: "COGS",
      level: "Upper",
      units: 4.0,
      instructor: "Dr. Shannon Ellis",
      schedule: "Tue/Thu 9:30 - 10:50 AM",
      location: "Cognitive Sci Bldg 001",
      mode: "Hybrid",
      capacity: 150,
      enrolled: 130,
      prereqs: "COGS 18 or CSE 8A or BILD 62",
      description: "End-to-end data lifecycle: data collection, API wrangling, exploratory data analysis, inferential modeling, visualization, reproducible workflows, and ethical implications.",
      featured: true,
      accentColor: "#ec4899"
    },
    {
      id: "CSE-150B",
      code: "CSE 150B",
      title: "Applications of Artificial Intelligence",
      dept: "CSE",
      level: "Upper",
      units: 4.0,
      instructor: "Prof. Gary Cottrell",
      schedule: "Mon/Wed/Fri 11:00 - 11:50 AM",
      location: "Peterson Hall 108",
      mode: "In-Person",
      capacity: 90,
      enrolled: 74,
      prereqs: "CSE 100 and CSE 101",
      description: "Heuristic search, game playing, constraint satisfaction, probabilistic reasoning, Markov decision processes, reinforcement learning, and neural network foundations.",
      featured: false,
      accentColor: "#6366f1"
    },
    {
      id: "ECON-120A",
      code: "ECON 120A",
      title: "Econometrics & Statistical Methods",
      dept: "ECON",
      level: "Upper",
      units: 4.0,
      instructor: "Prof. Jeffrey Candido",
      schedule: "Tue/Thu 5:00 - 6:20 PM",
      location: "Galbraith Hall 242",
      mode: "Online",
      capacity: 100,
      enrolled: 82,
      prereqs: "MATH 10C or MATH 20C and ECON 1",
      description: "Statistical inference and probability distributions for business and economic data, sampling distributions, hypothesis testing, and introduction to ordinary least squares.",
      featured: false,
      accentColor: "#10b981"
    },
    {
      id: "BIOL-100",
      code: "BIOL 100",
      title: "Structural & Molecular Biology",
      dept: "BIOL",
      level: "Upper",
      units: 4.0,
      instructor: "Dr. Maya Lin",
      schedule: "Mon/Wed 8:30 - 9:50 AM",
      location: "Bonner Hall 2130",
      mode: "In-Person",
      capacity: 60,
      enrolled: 48,
      prereqs: "BIOL 1 and CHEM 140A",
      description: "Biochemical structures of proteins, enzymes, and nucleic acids. Thermodynamic mechanisms, genetic transcription dynamics, and macromolecular crystallography.",
      featured: false,
      accentColor: "#8b5cf6"
    },
    {
      id: "CSE-100",
      code: "CSE 100",
      title: "Advanced Data Structures",
      dept: "CSE",
      level: "Upper",
      units: 4.0,
      instructor: "Prof. Christine Alvarado",
      schedule: "Mon/Wed/Fri 2:00 - 2:50 PM",
      location: "York Hall 2622",
      mode: "In-Person",
      capacity: 200,
      enrolled: 185,
      prereqs: "CSE 21 and CSE 12 or equivalent C++ competency",
      description: "Design and rigorous analysis of data structures in C++: balanced search trees, B-trees, disjoint-set forests, hash graphs, amortized analysis, and bitwise optimization.",
      featured: false,
      accentColor: "#6366f1"
    },
    {
      id: "MATH-20C",
      code: "MATH 20C",
      title: "Calculus & Analytic Geometry for Sci/Eng",
      dept: "MATH",
      level: "Lower",
      units: 4.0,
      instructor: "Dr. Aaron Stevens",
      schedule: "Tue/Thu 8:00 - 9:20 AM",
      location: "Ledden Auditorium",
      mode: "Online",
      capacity: 250,
      enrolled: 210,
      prereqs: "MATH 20B or AP Calculus BC score of 4 or 5",
      description: "Vector geometry, dot products, cross products, lines, planes, multivariate calculus, partial derivatives, directional derivatives, gradient vectors, and multiple integration.",
      featured: false,
      accentColor: "#0ea5e9"
    },
    {
      id: "CSE-110",
      code: "CSE 110",
      title: "Software Engineering Agile Studio",
      dept: "CSE",
      level: "Upper",
      units: 4.0,
      instructor: "Prof. Thomas Powell",
      schedule: "Tue/Thu 3:30 - 4:50 PM",
      location: "Center Hall 212",
      mode: "In-Person",
      capacity: 140,
      enrolled: 138,
      prereqs: "CSE 100",
      description: "Team-based production software engineering. Agile methodology, user stories, automated CI/CD pipelines, Git teamwork, code reviews, and stakeholder presentations.",
      featured: false,
      accentColor: "#6366f1"
    }
  ];

  // ==========================================
  // Application State
  // ==========================================
  const state = {
    courses: [...INITIAL_COURSES],
    // Initial 3 registered courses
    registered: [
      {
        courseId: "CSE-216",
        gradeOption: "Letter Grade",
        term: "Fall 2026",
        dateRegistered: "2026-10-14"
      },
      {
        courseId: "CSE-224",
        gradeOption: "Letter Grade",
        term: "Fall 2026",
        dateRegistered: "2026-10-14"
      },
      {
        courseId: "MATH-180A",
        gradeOption: "Letter Grade",
        term: "Fall 2026",
        dateRegistered: "2026-10-15"
      }
    ],
    maxUnitsLimit: 20.0,
    filters: {
      search: "",
      dept: "ALL",
      level: "ALL",
      mode: "ALL",
      availability: "ALL",
      sort: "code-asc"
    },
    pendingAction: null // For confirmation modal: { type: 'REGISTER' | 'DROP', payload: {...} }
  };

  // ==========================================
  // Router / Navigation Manager
  // ==========================================
  const router = {
    init() {
      // Setup hash change listener
      window.addEventListener('hashchange', () => this.handleHash());

      // Navigation links
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const targetPage = link.getAttribute('data-page');
          if (targetPage) {
            e.preventDefault();
            this.navigate(targetPage);
          }
        });
      });

      // Mobile hamburger toggle
      const navToggle = document.getElementById('nav-toggle');
      const navMenu = document.getElementById('nav-menu');
      if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
          navMenu.classList.toggle('open');
        });

        // Close mobile menu on clicking any link inside
        navMenu.querySelectorAll('a').forEach(a => {
          a.addEventListener('click', () => {
            navMenu.classList.remove('open');
          });
        });
      }

      // Initial route load
      this.handleHash();
    },

    navigate(pageName) {
      window.location.hash = pageName;
    },

    handleHash() {
      let hash = window.location.hash.replace('#', '').trim();
      const validPages = ['home', 'catalog', 'registration', 'profile'];
      if (!validPages.includes(hash)) {
        hash = 'home';
      }

      // Switch active class on pages
      validPages.forEach(p => {
        const pageElem = document.getElementById(`page-${p}`);
        if (pageElem) {
          if (p === hash) {
            pageElem.classList.add('active');
          } else {
            pageElem.classList.remove('active');
          }
        }

        // Switch active state on nav links
        const navLink = document.querySelector(`.nav-link[data-page="${p}"]`);
        if (navLink) {
          if (p === hash) {
            navLink.classList.add('active');
          } else {
            navLink.classList.remove('active');
          }
        }
      });

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Run view-specific refreshes
      if (hash === 'catalog') {
        catalogController.renderCatalog();
      } else if (hash === 'registration') {
        registrationController.populateDropdown();
        registrationController.renderRegisteredTable();
      } else if (hash === 'profile') {
        profileController.renderProfileView();
      } else if (hash === 'home') {
        homeController.renderFeaturedCourses();
        homeController.updateHomeMetrics();
      }
    },

    showToast(message, type = 'success') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close">&times;</button>
      `;

      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 250);
      });

      container.appendChild(toast);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        if (toast.parentElement) {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(100%)';
          setTimeout(() => toast.remove(), 250);
        }
      }, 4000);
    }
  };

  // ==========================================
  // Home Page Controller
  // ==========================================
  const homeController = {
    init() {
      this.renderFeaturedCourses();
      this.updateHomeMetrics();
    },

    updateHomeMetrics() {
      const enrolledCount = state.registered.length;
      const totalUnits = calculateTotalRegisteredUnits();

      const homeCountElem = document.getElementById('home-enrolled-count');
      const homeUnitsElem = document.getElementById('home-registered-units');
      const navBadgeElem = document.getElementById('nav-registered-count');

      if (homeCountElem) homeCountElem.textContent = enrolledCount;
      if (homeUnitsElem) homeUnitsElem.textContent = totalUnits.toFixed(1);
      if (navBadgeElem) navBadgeElem.textContent = enrolledCount;
    },

    renderFeaturedCourses() {
      const container = document.getElementById('featured-courses-container');
      if (!container) return;

      const featured = state.courses.filter(c => c.featured).slice(0, 3);
      container.innerHTML = featured.map(course => createCourseCardHTML(course, true)).join('');

      attachCardEventListeners(container);
    }
  };

  // ==========================================
  // Course Catalog Controller
  // ==========================================
  const catalogController = {
    init() {
      this.bindFilterEvents();
      this.renderCatalog();
    },

    bindFilterEvents() {
      const searchInput = document.getElementById('catalog-search');
      const clearSearchBtn = document.getElementById('btn-clear-search');
      const deptFilter = document.getElementById('filter-dept');
      const levelFilter = document.getElementById('filter-level');
      const modeFilter = document.getElementById('filter-mode');
      const availFilter = document.getElementById('filter-availability');
      const sortFilter = document.getElementById('filter-sort');
      const resetBtn = document.getElementById('btn-reset-filters');

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          state.filters.search = e.target.value.trim().toLowerCase();
          if (clearSearchBtn) {
            clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
          }
          this.renderCatalog();
        });
      }

      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = '';
            state.filters.search = '';
            clearSearchBtn.style.display = 'none';
            this.renderCatalog();
          }
        });
      }

      if (deptFilter) {
        deptFilter.addEventListener('change', (e) => {
          state.filters.dept = e.target.value;
          this.renderCatalog();
        });
      }

      if (levelFilter) {
        levelFilter.addEventListener('change', (e) => {
          state.filters.level = e.target.value;
          this.renderCatalog();
        });
      }

      if (modeFilter) {
        modeFilter.addEventListener('change', (e) => {
          state.filters.mode = e.target.value;
          this.renderCatalog();
        });
      }

      if (availFilter) {
        availFilter.addEventListener('change', (e) => {
          state.filters.availability = e.target.value;
          this.renderCatalog();
        });
      }

      if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
          state.filters.sort = e.target.value;
          this.renderCatalog();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetAllFilters());
      }
    },

    resetAllFilters() {
      state.filters = {
        search: "",
        dept: "ALL",
        level: "ALL",
        mode: "ALL",
        availability: "ALL",
        sort: "code-asc"
      };

      const searchInput = document.getElementById('catalog-search');
      const clearSearchBtn = document.getElementById('btn-clear-search');
      const deptFilter = document.getElementById('filter-dept');
      const levelFilter = document.getElementById('filter-level');
      const modeFilter = document.getElementById('filter-mode');
      const availFilter = document.getElementById('filter-availability');
      const sortFilter = document.getElementById('filter-sort');

      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      if (deptFilter) deptFilter.value = 'ALL';
      if (levelFilter) levelFilter.value = 'ALL';
      if (modeFilter) modeFilter.value = 'ALL';
      if (availFilter) availFilter.value = 'ALL';
      if (sortFilter) sortFilter.value = 'code-asc';

      this.renderCatalog();
    },

    renderCatalog() {
      const container = document.getElementById('course-cards-container');
      const emptyState = document.getElementById('catalog-empty-state');
      const countElem = document.getElementById('displayed-courses-count');
      const totalCountElem = document.getElementById('catalog-total-count');
      const openCountElem = document.getElementById('catalog-open-count');
      const chipsContainer = document.getElementById('active-filter-chips');

      if (!container) return;

      // Update total & open catalog metrics
      if (totalCountElem) totalCountElem.textContent = state.courses.length;
      if (openCountElem) {
        const openCourses = state.courses.filter(c => c.enrolled < c.capacity).length;
        openCountElem.textContent = openCourses;
      }

      // Filter courses
      let filtered = state.courses.filter(course => {
        // Search term
        if (state.filters.search) {
          const q = state.filters.search;
          const matchCode = course.code.toLowerCase().includes(q);
          const matchTitle = course.title.toLowerCase().includes(q);
          const matchInstructor = course.instructor.toLowerCase().includes(q);
          const matchDesc = course.description.toLowerCase().includes(q);
          const matchDept = course.dept.toLowerCase().includes(q);
          if (!matchCode && !matchTitle && !matchInstructor && !matchDesc && !matchDept) {
            return false;
          }
        }

        // Department
        if (state.filters.dept !== 'ALL' && course.dept !== state.filters.dept) {
          return false;
        }

        // Level
        if (state.filters.level !== 'ALL' && course.level !== state.filters.level) {
          return false;
        }

        // Delivery Mode
        if (state.filters.mode !== 'ALL' && course.mode !== state.filters.mode) {
          return false;
        }

        // Availability
        if (state.filters.availability === 'OPEN') {
          if (course.enrolled >= course.capacity) return false;
        } else if (state.filters.availability === 'WAITLIST') {
          if (course.enrolled < course.capacity) return false;
        }

        return true;
      });

      // Sorting
      filtered.sort((a, b) => {
        switch (state.filters.sort) {
          case 'code-asc':
            return a.code.localeCompare(b.code);
          case 'code-desc':
            return b.code.localeCompare(a.code);
          case 'units-desc':
            return b.units - a.units;
          case 'units-asc':
            return a.units - b.units;
          case 'seats-desc':
            return (b.capacity - b.enrolled) - (a.capacity - a.enrolled);
          default:
            return 0;
        }
      });

      // Display count
      if (countElem) countElem.textContent = filtered.length;

      // Render Active Filter Chips
      this.renderFilterChips(chipsContainer);

      // Toggle Empty State
      if (filtered.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
      } else {
        if (emptyState) emptyState.classList.add('hidden');
        container.innerHTML = filtered.map(course => createCourseCardHTML(course)).join('');
        attachCardEventListeners(container);
      }
    },

    renderFilterChips(container) {
      if (!container) return;
      let chipsHtml = '';

      if (state.filters.search) {
        chipsHtml += `<div class="filter-chip">Search: "${state.filters.search}" <button onclick="window.catalogController.clearFilter('search')">&times;</button></div>`;
      }
      if (state.filters.dept !== 'ALL') {
        chipsHtml += `<div class="filter-chip">Dept: ${state.filters.dept} <button onclick="window.catalogController.clearFilter('dept')">&times;</button></div>`;
      }
      if (state.filters.level !== 'ALL') {
        chipsHtml += `<div class="filter-chip">Level: ${state.filters.level} <button onclick="window.catalogController.clearFilter('level')">&times;</button></div>`;
      }
      if (state.filters.mode !== 'ALL') {
        chipsHtml += `<div class="filter-chip">Mode: ${state.filters.mode} <button onclick="window.catalogController.clearFilter('mode')">&times;</button></div>`;
      }
      if (state.filters.availability !== 'ALL') {
        chipsHtml += `<div class="filter-chip">Status: ${state.filters.availability} <button onclick="window.catalogController.clearFilter('availability')">&times;</button></div>`;
      }

      container.innerHTML = chipsHtml;
    },

    clearFilter(type) {
      if (type === 'search') {
        state.filters.search = '';
        const input = document.getElementById('catalog-search');
        if (input) input.value = '';
      } else if (type === 'dept') {
        state.filters.dept = 'ALL';
        const select = document.getElementById('filter-dept');
        if (select) select.value = 'ALL';
      } else if (type === 'level') {
        state.filters.level = 'ALL';
        const select = document.getElementById('filter-level');
        if (select) select.value = 'ALL';
      } else if (type === 'mode') {
        state.filters.mode = 'ALL';
        const select = document.getElementById('filter-mode');
        if (select) select.value = 'ALL';
      } else if (type === 'availability') {
        state.filters.availability = 'ALL';
        const select = document.getElementById('filter-availability');
        if (select) select.value = 'ALL';
      }
      this.renderCatalog();
    }
  };

  // ==========================================
  // Registration Page Controller
  // ==========================================
  const registrationController = {
    init() {
      this.populateDropdown();
      this.bindFormEvents();
      this.renderRegisteredTable();
      this.updateUnitsMeter();
    },

    populateDropdown() {
      const select = document.getElementById('reg-course-select');
      if (!select) return;

      const registeredIds = new Set(state.registered.map(r => r.courseId));
      let optionsHtml = '<option value="" disabled selected>-- Choose a course from catalog --</option>';

      state.courses.forEach(course => {
        const isRegistered = registeredIds.has(course.id);
        const isFull = course.enrolled >= course.capacity;
        const statusNote = isRegistered ? ' (Already Enrolled)' : isFull ? ' (Waitlist Only)' : '';
        const disabledAttr = isRegistered ? 'disabled' : '';

        optionsHtml += `<option value="${course.id}" ${disabledAttr}>
          ${course.code} - ${course.title} (${course.units} Units)${statusNote}
        </option>`;
      });

      select.innerHTML = optionsHtml;
    },

    bindFormEvents() {
      const form = document.getElementById('registration-form');
      const courseSelect = document.getElementById('reg-course-select');
      const previewBox = document.getElementById('selected-course-preview');

      // Live course preview on dropdown change
      if (courseSelect) {
        courseSelect.addEventListener('change', (e) => {
          const selectedId = e.target.value;
          const course = state.courses.find(c => c.id === selectedId);

          if (course && previewBox) {
            document.getElementById('preview-dept').textContent = course.dept;
            document.getElementById('preview-title').textContent = course.title;
            document.getElementById('preview-code').textContent = course.code;
            document.getElementById('preview-units').textContent = `${course.units} Units`;
            document.getElementById('preview-instructor').textContent = course.instructor;
            document.getElementById('preview-schedule').textContent = `${course.schedule} | ${course.location}`;
            previewBox.classList.remove('hidden');
          } else if (previewBox) {
            previewBox.classList.add('hidden');
          }
        });
      }

      // Form submission validation
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleFormSubmission();
        });

        // Reset button handling
        const resetBtn = document.getElementById('btn-reset-form');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (previewBox) previewBox.classList.add('hidden');
            clearFormErrors();
          });
        }
      }
    },

    handleFormSubmission() {
      clearFormErrors();

      const courseSelect = document.getElementById('reg-course-select');
      const gradeOptionSelect = document.getElementById('reg-grade-option');
      const termSelect = document.getElementById('reg-term');
      const prereqAck = document.getElementById('reg-prereq-ack');

      const courseId = courseSelect.value;
      const gradeOption = gradeOptionSelect.value;
      const term = termSelect.value;

      let hasError = false;

      if (!courseId) {
        showFieldError('feedback-course', 'Please select a course to register.');
        hasError = true;
      }

      if (!prereqAck.checked) {
        showFieldError('feedback-ack', 'You must verify prerequisites and schedule eligibility.');
        hasError = true;
      }

      if (hasError) return;

      const course = state.courses.find(c => c.id === courseId);
      if (!course) return;

      // Check duplicate
      const alreadyEnrolled = state.registered.some(r => r.courseId === courseId);
      if (alreadyEnrolled) {
        showFieldError('feedback-course', 'You are already registered in this course.');
        return;
      }

      // Check unit limit
      const currentUnits = calculateTotalRegisteredUnits();
      if (currentUnits + course.units > state.maxUnitsLimit) {
        router.showToast(`Cannot register: Exceeds term limit of ${state.maxUnitsLimit} units! Current: ${currentUnits.toFixed(1)} units.`, 'error');
        return;
      }

      // Open Confirmation Modal
      modalController.openRegistrationModal(course, gradeOption, term);
    },

    updateUnitsMeter() {
      const totalUnits = calculateTotalRegisteredUnits();
      const percent = Math.min((totalUnits / state.maxUnitsLimit) * 100, 100);
      const remaining = Math.max(state.maxUnitsLimit - totalUnits, 0);

      const meterCurrent = document.getElementById('reg-meter-current');
      const progressBar = document.getElementById('reg-units-progress');
      const meterRemaining = document.getElementById('reg-units-remaining');

      if (meterCurrent) meterCurrent.textContent = totalUnits.toFixed(1);
      if (progressBar) {
        progressBar.style.width = `${percent}%`;
        if (percent >= 90) {
          progressBar.classList.add('warning');
        } else {
          progressBar.classList.remove('warning');
        }
      }
      if (meterRemaining) {
        meterRemaining.textContent = `${remaining.toFixed(1)} units remaining before petition required`;
      }
    },

    renderRegisteredTable() {
      const tbody = document.getElementById('registered-courses-tbody');
      const emptyState = document.getElementById('table-empty-state');
      const summaryTotal = document.getElementById('summary-total-courses');
      const summaryUnits = document.getElementById('summary-total-units');
      const summaryStatus = document.getElementById('summary-academic-status');

      if (!tbody) return;

      if (state.registered.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (summaryTotal) summaryTotal.textContent = '0';
        if (summaryUnits) summaryUnits.textContent = '0.0 Units';
        if (summaryStatus) {
          summaryStatus.textContent = 'Part-Time (0 units)';
          summaryStatus.className = 'badge badge-warning';
        }
        return;
      }

      if (emptyState) emptyState.classList.add('hidden');

      let rowsHtml = '';
      let totalUnits = 0;

      state.registered.forEach(reg => {
        const course = state.courses.find(c => c.id === reg.courseId);
        if (!course) return;

        totalUnits += course.units;

        rowsHtml += `
          <tr data-course-id="${course.id}">
            <td class="table-course-code">${course.code}</td>
            <td class="table-course-title"><strong>${course.title}</strong></td>
            <td><span class="course-dept-pill dept-${course.dept.toLowerCase()}">${course.dept}</span></td>
            <td><strong>${course.units.toFixed(1)}</strong></td>
            <td>
              <div>${course.schedule}</div>
              <small class="text-muted">${course.location}</small>
            </td>
            <td>${course.instructor}</td>
            <td>
              <span class="badge badge-info">${reg.gradeOption}</span>
            </td>
            <td>
              <span class="badge badge-success">Enrolled</span>
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-danger btn-drop-course" data-course-id="${course.id}" title="Drop this course">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Drop
              </button>
            </td>
          </tr>
        `;
      });

      tbody.innerHTML = rowsHtml;

      // Update footer counters
      if (summaryTotal) summaryTotal.textContent = state.registered.length;
      if (summaryUnits) summaryUnits.textContent = `${totalUnits.toFixed(1)} Units`;
      if (summaryStatus) {
        if (totalUnits >= 12) {
          summaryStatus.textContent = 'Full-Time';
          summaryStatus.className = 'badge badge-success';
        } else {
          summaryStatus.textContent = 'Part-Time';
          summaryStatus.className = 'badge badge-warning';
        }
      }

      // Attach drop action listeners
      tbody.querySelectorAll('.btn-drop-course').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const courseId = btn.getAttribute('data-course-id');
          const course = state.courses.find(c => c.id === courseId);
          if (course) {
            modalController.openDropModal(course);
          }
        });
      });
    }
  };

  // ==========================================
  // Student Profile Controller
  // ==========================================
  const profileController = {
    renderProfileView() {
      const container = document.getElementById('profile-enrolled-list');
      const unitsVal = document.getElementById('profile-term-units');
      const totalUnits = calculateTotalRegisteredUnits();

      if (unitsVal) unitsVal.textContent = totalUnits.toFixed(1);

      if (!container) return;

      if (state.registered.length === 0) {
        container.innerHTML = '<p class="text-muted" style="font-size: 0.9rem;">No courses currently enrolled for Fall 2026.</p>';
        return;
      }

      container.innerHTML = state.registered.map(reg => {
        const course = state.courses.find(c => c.id === reg.courseId);
        if (!course) return '';
        return `
          <div class="profile-enrolled-item">
            <div>
              <div class="pei-code">${course.code} &bull; ${course.units} Units</div>
              <div class="pei-title">${course.title}</div>
            </div>
            <span class="badge badge-info">${reg.gradeOption}</span>
          </div>
        `;
      }).join('');
    }
  };

  // ==========================================
  // Confirmation & Details Modals Controller
  // ==========================================
  const modalController = {
    init() {
      const confirmModal = document.getElementById('confirmation-modal');
      const closeBtn = document.getElementById('modal-close-btn');
      const cancelBtn = document.getElementById('modal-cancel-btn');
      const confirmBtn = document.getElementById('modal-confirm-btn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeConfirmModal());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeConfirmModal());

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          this.executePendingAction();
        });
      }

      // Close when clicking backdrop
      if (confirmModal) {
        confirmModal.addEventListener('click', (e) => {
          if (e.target === confirmModal) {
            this.closeConfirmModal();
          }
        });
      }

      // Course Details Modal Listeners
      const detailModal = document.getElementById('course-detail-modal');
      const detailCloseBtn = document.getElementById('detail-close-btn');
      const detailDismissBtn = document.getElementById('detail-dismiss-btn');
      const detailEnrollBtn = document.getElementById('detail-enroll-btn');

      if (detailCloseBtn) detailCloseBtn.addEventListener('click', () => this.closeDetailModal());
      if (detailDismissBtn) detailDismissBtn.addEventListener('click', () => this.closeDetailModal());

      if (detailEnrollBtn) {
        detailEnrollBtn.addEventListener('click', () => {
          const courseId = detailEnrollBtn.getAttribute('data-course-id');
          this.closeDetailModal();
          if (courseId) {
            initiateDirectEnroll(courseId);
          }
        });
      }

      if (detailModal) {
        detailModal.addEventListener('click', (e) => {
          if (e.target === detailModal) {
            this.closeDetailModal();
          }
        });
      }
    },

    openRegistrationModal(course, gradeOption, term) {
      state.pendingAction = {
        type: 'REGISTER',
        payload: { course, gradeOption, term }
      };

      const modal = document.getElementById('confirmation-modal');
      const titleElem = document.getElementById('modal-title');
      const subtitleElem = document.getElementById('modal-subtitle');
      const nameElem = document.getElementById('modal-course-name');
      const unitsElem = document.getElementById('modal-course-units');
      const gradingElem = document.getElementById('modal-course-grading');
      const scheduleElem = document.getElementById('modal-course-schedule');
      const instructorElem = document.getElementById('modal-course-instructor');
      const alertElem = document.getElementById('modal-alert-note');
      const confirmBtn = document.getElementById('modal-confirm-btn');

      if (titleElem) titleElem.textContent = 'Confirm Course Registration';
      if (subtitleElem) subtitleElem.textContent = 'Please review your registration details before finalizing.';
      if (nameElem) nameElem.textContent = `${course.code} - ${course.title}`;
      if (unitsElem) unitsElem.textContent = `${course.units.toFixed(1)} Units`;
      if (gradingElem) gradingElem.textContent = gradeOption;
      if (scheduleElem) scheduleElem.textContent = `${course.schedule} (${course.location})`;
      if (instructorElem) instructorElem.textContent = course.instructor;

      if (alertElem) {
        alertElem.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>By confirming, you will be officially enrolled in this course for ${term}. You may drop or adjust grading option before the deadline.</span>
        `;
      }

      if (confirmBtn) {
        confirmBtn.textContent = 'Confirm & Enroll';
        confirmBtn.className = 'btn btn-primary';
      }

      if (modal) modal.classList.remove('hidden');
    },

    openDropModal(course) {
      state.pendingAction = {
        type: 'DROP',
        payload: { course }
      };

      const modal = document.getElementById('confirmation-modal');
      const titleElem = document.getElementById('modal-title');
      const subtitleElem = document.getElementById('modal-subtitle');
      const nameElem = document.getElementById('modal-course-name');
      const unitsElem = document.getElementById('modal-course-units');
      const gradingElem = document.getElementById('modal-course-grading');
      const scheduleElem = document.getElementById('modal-course-schedule');
      const instructorElem = document.getElementById('modal-course-instructor');
      const alertElem = document.getElementById('modal-alert-note');
      const confirmBtn = document.getElementById('modal-confirm-btn');

      if (titleElem) titleElem.textContent = 'Confirm Course Drop';
      if (subtitleElem) subtitleElem.textContent = 'Are you sure you want to drop this course from your schedule?';
      if (nameElem) nameElem.textContent = `${course.code} - ${course.title}`;
      if (unitsElem) unitsElem.textContent = `${course.units.toFixed(1)} Units`;
      if (gradingElem) gradingElem.textContent = 'Current Enrollment';
      if (scheduleElem) scheduleElem.textContent = course.schedule;
      if (instructorElem) instructorElem.textContent = course.instructor;

      if (alertElem) {
        alertElem.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span style="color: #b91c1c;">Dropping this course will immediately release your reserved seat to waitlisted students. This action takes effect instantly.</span>
        `;
      }

      if (confirmBtn) {
        confirmBtn.textContent = 'Yes, Drop Course';
        confirmBtn.className = 'btn btn-danger';
      }

      if (modal) modal.classList.remove('hidden');
    },

    closeConfirmModal() {
      const modal = document.getElementById('confirmation-modal');
      if (modal) modal.classList.add('hidden');
      state.pendingAction = null;
    },

    openDetailModal(course) {
      const modal = document.getElementById('course-detail-modal');
      const deptText = document.getElementById('detail-dept-text');
      const title = document.getElementById('detail-title');
      const codeTerm = document.getElementById('detail-code-term');
      const body = document.getElementById('detail-body');
      const enrollBtn = document.getElementById('detail-enroll-btn');

      if (deptText) deptText.textContent = course.dept;
      if (title) title.textContent = course.title;
      if (codeTerm) codeTerm.textContent = `${course.code} &bull; ${course.level} Division &bull; Fall 2026`;

      const isRegistered = state.registered.some(r => r.courseId === course.id);
      const isFull = course.enrolled >= course.capacity;

      if (body) {
        body.innerHTML = `
          <div class="detail-meta-grid">
            <div class="detail-meta-item">
              <div class="detail-label">Credits</div>
              <div class="detail-val">${course.units.toFixed(1)} Units</div>
            </div>
            <div class="detail-meta-item">
              <div class="detail-label">Seats Remaining</div>
              <div class="detail-val text-primary">${Math.max(course.capacity - course.enrolled, 0)} / ${course.capacity}</div>
            </div>
            <div class="detail-meta-item">
              <div class="detail-label">Format</div>
              <div class="detail-val text-violet">${course.mode}</div>
            </div>
          </div>

          <div class="detail-section">
            <h4>Description & Overview</h4>
            <p>${course.description}</p>
          </div>

          <div class="detail-section">
            <h4>Prerequisites & Requirements</h4>
            <p>${course.prereqs}</p>
          </div>

          <div class="detail-section">
            <h4>Class Meeting Schedule</h4>
            <p><strong>${course.schedule}</strong> in <strong>${course.location}</strong></p>
          </div>

          <div class="detail-section">
            <h4>Instructor of Record</h4>
            <p>${course.instructor} &bull; Office hours: Tuesday 4-5 PM via Zoom / In-Person</p>
          </div>
        `;
      }

      if (enrollBtn) {
        enrollBtn.setAttribute('data-course-id', course.id);
        if (isRegistered) {
          enrollBtn.textContent = 'Already Enrolled';
          enrollBtn.disabled = true;
          enrollBtn.className = 'btn btn-secondary';
        } else if (isFull) {
          enrollBtn.textContent = 'Course Full (Waitlist in Form)';
          enrollBtn.disabled = false;
          enrollBtn.className = 'btn btn-primary';
        } else {
          enrollBtn.textContent = 'Enroll in this Course';
          enrollBtn.disabled = false;
          enrollBtn.className = 'btn btn-primary';
        }
      }

      if (modal) modal.classList.remove('hidden');
    },

    closeDetailModal() {
      const modal = document.getElementById('course-detail-modal');
      if (modal) modal.classList.add('hidden');
    },

    executePendingAction() {
      if (!state.pendingAction) return;

      const { type, payload } = state.pendingAction;

      if (type === 'REGISTER') {
        const { course, gradeOption, term } = payload;

        // Add to state
        state.registered.push({
          courseId: course.id,
          gradeOption: gradeOption,
          term: term,
          dateRegistered: new Date().toISOString().split('T')[0]
        });

        // Increment enrolled seats
        course.enrolled = Math.min(course.enrolled + 1, course.capacity);

        // Reset form
        const form = document.getElementById('registration-form');
        if (form) form.reset();
        const previewBox = document.getElementById('selected-course-preview');
        if (previewBox) previewBox.classList.add('hidden');

        router.showToast(`Successfully registered for ${course.code}: ${course.title}!`, 'success');
      } else if (type === 'DROP') {
        const { course } = payload;

        // Remove from state
        state.registered = state.registered.filter(r => r.courseId !== course.id);

        // Decrement enrolled seats
        course.enrolled = Math.max(course.enrolled - 1, 0);

        router.showToast(`Dropped ${course.code} from your schedule.`, 'warning');
      }

      // Close modal
      this.closeConfirmModal();

      // Refresh all dependent views
      registrationController.populateDropdown();
      registrationController.renderRegisteredTable();
      registrationController.updateUnitsMeter();
      catalogController.renderCatalog();
      homeController.renderFeaturedCourses();
      homeController.updateHomeMetrics();
      profileController.renderProfileView();
    }
  };

  // ==========================================
  // Shared Helper Functions & HTML Generators
  // ==========================================

  function calculateTotalRegisteredUnits() {
    return state.registered.reduce((total, reg) => {
      const course = state.courses.find(c => c.id === reg.courseId);
      return total + (course ? course.units : 0);
    }, 0);
  }

  function showFieldError(feedbackElemId, message) {
    const feedback = document.getElementById(feedbackElemId);
    if (feedback) {
      feedback.textContent = message;
      feedback.classList.add('error');
    }
  }

  function clearFormErrors() {
    document.querySelectorAll('.field-feedback').forEach(el => {
      el.textContent = '';
      el.classList.remove('error');
    });
  }

  function createCourseCardHTML(course, isCompact = false) {
    const isRegistered = state.registered.some(r => r.courseId === course.id);
    const availableSeats = Math.max(course.capacity - course.enrolled, 0);
    const fillPercent = Math.min((course.enrolled / course.capacity) * 100, 100);

    let seatBadgeClass = 'fill-open';
    let seatStatusText = `${availableSeats} Seats Available`;
    if (availableSeats === 0) {
      seatBadgeClass = 'fill-full';
      seatStatusText = 'Waitlist Only (0 Seats)';
    } else if (availableSeats <= 5) {
      seatBadgeClass = 'fill-filling';
      seatStatusText = `Only ${availableSeats} Seats Left!`;
    }

    return `
      <div class="course-card" style="--card-accent: ${course.accentColor}">
        <div>
          <div class="card-top">
            <span class="course-dept-pill dept-${course.dept.toLowerCase()}">${course.dept}</span>
            <span class="course-units-badge">${course.units} Units</span>
          </div>

          <h3 class="course-code">${course.code}</h3>
          <h4 class="course-name">${course.title}</h4>
          
          <p class="course-desc-snippet">${course.description}</p>

          <div class="course-meta-tags">
            <div class="meta-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>${course.instructor}</span>
            </div>
            <div class="meta-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${course.schedule}</span>
            </div>
            <div class="meta-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${course.location} &bull; ${course.mode}</span>
            </div>
          </div>

          <div class="seat-status-box">
            <div class="seat-header">
              <span class="text-muted">Capacity (${course.enrolled}/${course.capacity})</span>
              <strong class="${availableSeats === 0 ? 'text-rose' : 'text-success'}">${seatStatusText}</strong>
            </div>
            <div class="seat-progress-bar">
              <div class="seat-progress-fill ${seatBadgeClass}" style="width: ${fillPercent}%;"></div>
            </div>
          </div>
        </div>

        <div class="card-actions-grid">
          <button class="btn btn-secondary btn-view-detail" data-course-id="${course.id}">
            Details
          </button>
          ${isRegistered ? `
            <button class="btn btn-outline-primary" disabled>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              Enrolled
            </button>
          ` : `
            <button class="btn btn-primary btn-quick-enroll" data-course-id="${course.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              Register
            </button>
          `}
        </div>
      </div>
    `;
  }

  function attachCardEventListeners(container) {
    // Details button
    container.querySelectorAll('.btn-view-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const courseId = btn.getAttribute('data-course-id');
        const course = state.courses.find(c => c.id === courseId);
        if (course) {
          modalController.openDetailModal(course);
        }
      });
    });

    // Quick Enroll button
    container.querySelectorAll('.btn-quick-enroll').forEach(btn => {
      btn.addEventListener('click', () => {
        const courseId = btn.getAttribute('data-course-id');
        initiateDirectEnroll(courseId);
      });
    });
  }

  function initiateDirectEnroll(courseId) {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;

    // Check if already registered
    if (state.registered.some(r => r.courseId === course.id)) {
      router.showToast(`You are already enrolled in ${course.code}.`, 'warning');
      return;
    }

    // Check unit limit
    const currentUnits = calculateTotalRegisteredUnits();
    if (currentUnits + course.units > state.maxUnitsLimit) {
      router.showToast(`Cannot register: Adding ${course.units} units would exceed maximum term limit of ${state.maxUnitsLimit} units!`, 'error');
      return;
    }

    // Switch to registration view and prefill course selection
    router.navigate('registration');
    const select = document.getElementById('reg-course-select');
    if (select) {
      select.value = course.id;
      // Trigger change event to fire preview
      const event = new Event('change', { bubbles: true });
      select.dispatchEvent(event);
    }

    // Scroll to registration form
    const formElem = document.getElementById('registration-form');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ==========================================
  // Initialize Application on DOM Ready
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    router.init();
    homeController.init();
    catalogController.init();
    registrationController.init();
    modalController.init();

    // Expose controllers to window for inline onclick handlers
    window.appRouter = router;
    window.catalogController = catalogController;
    window.registrationController = registrationController;
    window.modalController = modalController;
  });

})();
