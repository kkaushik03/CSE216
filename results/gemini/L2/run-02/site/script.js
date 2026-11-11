/**
 * Horizon University - Course Registration Portal
 * Core Application Script
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Course Database & Initial State
     -------------------------------------------------------------------------- */
  const INITIAL_COURSES = [
    {
      id: "CS-216",
      code: "CS 216",
      title: "Software Engineering & System Architecture",
      dept: "Computer Science",
      level: "Intermediate",
      term: "Fall 2026",
      mode: "In-Person",
      credits: 4,
      instructor: "Prof. Alan Mitchell",
      schedule: "Mon, Wed, Fri 10:00 AM – 11:15 AM",
      location: "Turing Hall, Room 301",
      enrolled: 42,
      capacity: 50,
      prereq: "CS 201 (Data Structures)",
      description: "Principles of modern software design, scalable microservices, agile engineering methodologies, test-driven development, and full-stack deployment patterns.",
      featured: true
    },
    {
      id: "MATH-312",
      code: "MATH 312",
      title: "Linear Algebra & Matrix Computation",
      dept: "Mathematics",
      level: "Intermediate",
      term: "Fall 2026",
      mode: "In-Person",
      credits: 4,
      instructor: "Dr. Rachel Sterling",
      schedule: "Tue, Thu 1:30 PM – 3:00 PM",
      location: "Newton Center, Room 108",
      enrolled: 48,
      capacity: 50,
      prereq: "MATH 180 (Calculus II)",
      description: "Vector spaces, linear transformations, eigen-decomposition, singular value decomposition, and computational techniques applicable to data science and machine learning.",
      featured: false
    },
    {
      id: "BIO-110",
      code: "BIO 110",
      title: "Molecular & Cellular Biology",
      dept: "Biological Sciences",
      level: "Introductory",
      term: "Fall 2026",
      mode: "Hybrid",
      credits: 3,
      instructor: "Dr. Marcus Vance",
      schedule: "Mon, Wed 2:00 PM – 3:30 PM",
      location: "Darwin Science Complex, Lab 204",
      enrolled: 68,
      capacity: 75,
      prereq: "None",
      description: "Fundamental cellular mechanisms, DNA replication, gene expression, metabolic pathways, and recombinant laboratory techniques.",
      featured: false
    },
    {
      id: "ART-140",
      code: "ART 140",
      title: "Digital Media & Visual Design",
      dept: "Arts & Design",
      level: "Introductory",
      term: "Fall 2026",
      mode: "In-Person",
      credits: 3,
      instructor: "Elena Moretti, M.F.A.",
      schedule: "Friday 9:00 AM – 12:30 PM",
      location: "Da Vinci Studios, Media Studio B",
      enrolled: 24,
      capacity: 25,
      prereq: "None",
      description: "Exploration of digital raster/vector design, visual hierarchy, typography, color theory, and digital creative expression.",
      featured: true
    },
    {
      id: "CS-482",
      code: "CS 482",
      title: "Deep Learning & Generative Systems",
      dept: "Computer Science",
      level: "Advanced",
      term: "Fall 2026",
      mode: "In-Person",
      credits: 4,
      instructor: "Dr. Kenji Takahashi",
      schedule: "Tue, Thu 10:00 AM – 11:45 AM",
      location: "Turing Hall, AI Lab 410",
      enrolled: 30,
      capacity: 30,
      prereq: "CS 216 and MATH 312",
      description: "Theoretical foundations of deep neural networks, transformer architectures, reinforcement learning, diffusion models, and ethical AI deployment.",
      featured: true
    },
    {
      id: "ECON-201",
      code: "ECON 201",
      title: "Principles of Macroeconomics",
      dept: "Economics",
      level: "Introductory",
      term: "Fall 2026",
      mode: "Online",
      credits: 3,
      instructor: "Prof. Sarah Jenkins",
      schedule: "Asynchronous Online Modules",
      location: "Canvas Virtual Classroom",
      enrolled: 110,
      capacity: 120,
      prereq: "None",
      description: "National economic performance, inflation, unemployment, monetary and fiscal policies, international trade dynamics, and global financial institutions.",
      featured: false
    },
    {
      id: "PHYS-205",
      code: "PHYS 205",
      title: "Classical Mechanics & Thermodynamics",
      dept: "Physics",
      level: "Intermediate",
      term: "Fall 2026",
      mode: "In-Person",
      credits: 4,
      instructor: "Dr. Evelyn Ward",
      schedule: "Mon, Wed, Fri 11:30 AM – 12:45 PM",
      location: "Curie Science Hall, Auditorium 101",
      enrolled: 36,
      capacity: 45,
      prereq: "MATH 180 and PHYS 101",
      description: "Newtonian dynamics, conservation laws, oscillations, Lagrangian mechanics, and the laws of thermodynamics with physical applications.",
      featured: false
    },
    {
      id: "PSYC-220",
      code: "PSYC 220",
      title: "Cognitive Psychology & Human Perception",
      dept: "Psychology",
      level: "Intermediate",
      term: "Fall 2026",
      mode: "Hybrid",
      credits: 3,
      instructor: "Dr. Jordan Ramirez",
      schedule: "Mon, Wed 1:00 PM – 2:15 PM",
      location: "Social Sciences Quad, Room 115",
      enrolled: 44,
      capacity: 60,
      prereq: "PSYC 101",
      description: "Empirical study of attention, memory encoding, decision-making, language acquisition, and the neural substrates of human reasoning.",
      featured: true
    },
    {
      id: "CS-350",
      code: "CS 350",
      title: "Operating Systems & Concurrency",
      dept: "Computer Science",
      level: "Advanced",
      term: "Fall 2026",
      mode: "In-Person",
      credits: 4,
      instructor: "Prof. Alan Mitchell",
      schedule: "Tue, Thu 3:30 PM – 5:00 PM",
      location: "Turing Hall, Room 204",
      enrolled: 38,
      capacity: 40,
      prereq: "CS 201",
      description: "Process synchronization, memory management, virtual memory, file systems, distributed architectures, and POSIX threads.",
      featured: false
    },
    {
      id: "MATH-410",
      code: "MATH 410",
      title: "Probability & Mathematical Statistics",
      dept: "Mathematics",
      level: "Advanced",
      term: "Fall 2026",
      mode: "In-Person",
      credits: 4,
      instructor: "Dr. David Thorne",
      schedule: "Mon, Wed, Fri 9:00 AM – 10:00 AM",
      location: "Newton Center, Room 202",
      enrolled: 28,
      capacity: 35,
      prereq: "MATH 312",
      description: "Random variables, joint distributions, expectation, central limit theorem, hypothesis testing, and maximum likelihood estimation.",
      featured: false
    },
    {
      id: "BIO-240",
      code: "BIO 240",
      title: "Genetics, Genomics & CRISPR Systems",
      dept: "Biological Sciences",
      level: "Intermediate",
      term: "Fall 2026",
      mode: "In-Person",
      credits: 4,
      instructor: "Dr. Linda Zhao",
      schedule: "Tue, Thu 8:30 AM – 10:00 AM",
      location: "Darwin Science Complex, Room 310",
      enrolled: 32,
      capacity: 32,
      prereq: "BIO 110",
      description: "Mendelian and molecular genetics, genome mapping, CRISPR-Cas9 genome editing, epigenetics, and genomic medicine.",
      featured: false
    },
    {
      id: "ART-225",
      code: "ART 225",
      title: "Interactive Web Art & UI Systems",
      dept: "Arts & Design",
      level: "Intermediate",
      term: "Fall 2026",
      mode: "Online",
      credits: 3,
      instructor: "Elena Moretti, M.F.A.",
      schedule: "Online Asynchronous",
      location: "Online Portal & Virtual Critique",
      enrolled: 18,
      capacity: 25,
      prereq: "ART 140",
      description: "Creative coding with web graphics, dynamic visual layout systems, CSS animation, responsive canvas experiments, and interactive user experiences.",
      featured: false
    },
    {
      id: "ECON-340",
      code: "ECON 340",
      title: "Econometrics & Quantitative Modeling",
      dept: "Economics",
      level: "Advanced",
      term: "Fall 2026",
      mode: "In-Person",
      credits: 4,
      instructor: "Prof. Sarah Jenkins",
      schedule: "Mon, Wed 3:30 PM – 5:00 PM",
      location: "Economics Hall, Room 212",
      enrolled: 25,
      capacity: 35,
      prereq: "ECON 201 and MATH 312",
      description: "Multiple regression analysis, time-series forecasting, instrumental variables, panel data methods, and causal inference with economic data.",
      featured: false
    },
    {
      id: "CS-110",
      code: "CS 110",
      title: "Introduction to Computational Thinking",
      dept: "Computer Science",
      level: "Introductory",
      term: "Fall 2026",
      mode: "Hybrid",
      credits: 4,
      instructor: "Dr. Kenji Takahashi",
      schedule: "Mon, Wed 10:00 AM – 11:30 AM",
      location: "Turing Hall, Auditorium 100",
      enrolled: 95,
      capacity: 100,
      prereq: "None",
      description: "Computational problem solving, programming with Python, data structures, recursion, algorithmic complexity, and real-world software applications.",
      featured: false
    }
  ];

  const INITIAL_REGISTERED_IDS = ["CS-216", "MATH-312", "BIO-110", "ART-140"];

  /* --------------------------------------------------------------------------
     2. Application State
     -------------------------------------------------------------------------- */
  const state = {
    allCourses: [],
    registered: [], // array of objects: { courseId, grading, registeredDate }
    maxCredits: 18,
    activeView: 'home',
    filters: {
      search: '',
      department: 'ALL',
      level: 'ALL',
      mode: 'ALL',
      term: 'Fall 2026',
      openSeatsOnly: false,
      sortBy: 'code-asc'
    },
    pendingAction: null // For confirmation modal: { type: 'register'|'drop', courseId, grading }
  };

  /* --------------------------------------------------------------------------
     3. Toast Notification Helper
     -------------------------------------------------------------------------- */
  const Toast = {
    container: document.getElementById('toastContainer'),
    show: function (message, type = 'info', duration = 4000) {
      if (!this.container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'status');

      let icon = 'ℹ️';
      if (type === 'success') icon = '✅';
      if (type === 'warning') icon = '⚠️';
      if (type === 'danger') icon = '🛑';

      toast.innerHTML = `
        <span aria-hidden="true">${icon}</span>
        <div>${message}</div>
      `;

      this.container.appendChild(toast);

      // Announce for screen readers
      announceSR(message);

      setTimeout(() => {
        toast.style.transition = 'opacity 300ms ease, transform 300ms ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 350);
      }, duration);
    }
  };
  window.toastSystem = Toast;

  function announceSR(msg) {
    const announcer = document.getElementById('srAnnouncer');
    if (announcer) {
      announcer.textContent = msg;
    }
  }

  /* --------------------------------------------------------------------------
     4. State Storage & Initialization
     -------------------------------------------------------------------------- */
  function loadPersistedState() {
    try {
      const savedCourses = localStorage.getItem('horizon_courses');
      const savedReg = localStorage.getItem('horizon_registered');
      
      if (savedCourses) {
        state.allCourses = JSON.parse(savedCourses);
      } else {
        state.allCourses = JSON.parse(JSON.stringify(INITIAL_COURSES));
      }

      if (savedReg) {
        state.registered = JSON.parse(savedReg);
      } else {
        state.registered = INITIAL_REGISTERED_IDS.map(id => ({
          courseId: id,
          grading: "Letter Grade (A-F)",
          registeredDate: "Aug 25, 2026"
        }));
      }
    } catch (e) {
      console.warn("LocalStorage fallback to memory state", e);
      state.allCourses = JSON.parse(JSON.stringify(INITIAL_COURSES));
      state.registered = INITIAL_REGISTERED_IDS.map(id => ({
        courseId: id,
        grading: "Letter Grade (A-F)",
        registeredDate: "Aug 25, 2026"
      }));
    }
  }

  function persistState() {
    try {
      localStorage.setItem('horizon_courses', JSON.stringify(state.allCourses));
      localStorage.setItem('horizon_registered', JSON.stringify(state.registered));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  }

  function getCourse(id) {
    return state.allCourses.find(c => c.id === id);
  }

  function isCourseRegistered(id) {
    return state.registered.some(r => r.courseId === id);
  }

  function calculateTotalCredits() {
    return state.registered.reduce((sum, reg) => {
      const course = getCourse(reg.courseId);
      return sum + (course ? course.credits : 0);
    }, 0);
  }

  /* --------------------------------------------------------------------------
     5. View Navigation & Routing
     -------------------------------------------------------------------------- */
  function navigateTo(viewName) {
    const targetView = document.getElementById(`view-${viewName}`);
    if (!targetView) return;

    state.activeView = viewName;

    // Update active nav links
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const isTarget = btn.getAttribute('data-view') === viewName;
      btn.classList.toggle('active', isTarget);
      if (isTarget) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    // Update active page views
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${viewName}`);
    });

    // Close mobile menu if open
    const mainNav = document.getElementById('mainNav');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mainNav && mainNav.classList.contains('mobile-open')) {
      mainNav.classList.remove('mobile-open');
      mobileBtn.setAttribute('aria-expanded', 'false');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Announce view change
    const viewTitles = {
      home: 'Home Page',
      catalog: 'Course Catalog',
      registration: 'Course Registration Hub',
      profile: 'Student Profile'
    };
    announceSR(`Navigated to ${viewTitles[viewName] || viewName}`);

    // Dynamic render updates
    if (viewName === 'catalog') {
      renderCatalog();
    } else if (viewName === 'registration') {
      renderRegistrationView();
    } else if (viewName === 'home') {
      renderHomeMetrics();
      renderFeaturedCourses();
    }
  }

  /* --------------------------------------------------------------------------
     6. Rendering: Home Page
     -------------------------------------------------------------------------- */
  function renderHomeMetrics() {
    const totalCredits = calculateTotalCredits();
    const courseCount = state.registered.length;

    const registeredCountEl = document.getElementById('homeRegisteredCount');
    const registeredCreditsEl = document.getElementById('homeRegisteredCredits');

    if (registeredCountEl) {
      registeredCountEl.textContent = `${courseCount} Course${courseCount === 1 ? '' : 's'}`;
    }
    if (registeredCreditsEl) {
      registeredCreditsEl.textContent = `${totalCredits} / ${state.maxCredits} Credits`;
    }
  }

  function renderFeaturedCourses() {
    const grid = document.getElementById('featuredCoursesGrid');
    if (!grid) return;

    const featured = state.allCourses.filter(c => c.featured);
    grid.innerHTML = featured.map(course => createCourseCardHTML(course)).join('');
    bindCourseCardEvents(grid);
  }

  /* --------------------------------------------------------------------------
     7. Rendering: Course Catalog
     -------------------------------------------------------------------------- */
  function filterAndSortCourses() {
    let list = [...state.allCourses];

    // Search query filter
    const query = state.filters.search.trim().toLowerCase();
    if (query) {
      list = list.filter(c =>
        c.code.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.instructor.toLowerCase().includes(query) ||
        c.dept.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }

    // Department filter
    if (state.filters.department !== 'ALL') {
      list = list.filter(c => c.dept === state.filters.department);
    }

    // Level filter
    if (state.filters.level !== 'ALL') {
      list = list.filter(c => c.level === state.filters.level);
    }

    // Delivery mode filter
    if (state.filters.mode !== 'ALL') {
      list = list.filter(c => c.mode === state.filters.mode);
    }

    // Term filter
    if (state.filters.term) {
      list = list.filter(c => c.term === state.filters.term);
    }

    // Open seats checkbox
    if (state.filters.openSeatsOnly) {
      list = list.filter(c => c.enrolled < c.capacity);
    }

    // Sorting
    list.sort((a, b) => {
      switch (state.filters.sortBy) {
        case 'code-asc':
          return a.code.localeCompare(b.code);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'credits-desc':
          return b.credits - a.credits;
        case 'seats-desc':
          return (b.capacity - b.enrolled) - (a.capacity - a.enrolled);
        default:
          return 0;
      }
    });

    return list;
  }

  function createCourseCardHTML(course) {
    const isEnrolled = isCourseRegistered(course.id);
    const availableSeats = Math.max(0, course.capacity - course.enrolled);
    const isFull = availableSeats <= 0;
    const percentFilled = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));

    let progressColorClass = 'green';
    if (percentFilled > 75) progressColorClass = 'amber';
    if (percentFilled >= 100) progressColorClass = 'red';

    let actionButtonHTML = '';
    if (isEnrolled) {
      actionButtonHTML = `
        <button type="button" class="btn btn-secondary btn-sm" disabled aria-label="Already registered in ${course.code}">
          ✓ Registered
        </button>
      `;
    } else if (isFull) {
      actionButtonHTML = `
        <button type="button" class="btn btn-secondary btn-sm" disabled aria-label="${course.code} is full">
          Class Full
        </button>
      `;
    } else {
      actionButtonHTML = `
        <button type="button" class="btn btn-primary btn-sm action-quick-register" data-id="${course.id}" aria-label="Register for ${course.code}: ${course.title}">
          + Register
        </button>
      `;
    }

    return `
      <article class="course-card" data-course-id="${course.id}" role="listitem">
        <div class="card-top-bar">
          <span class="dept-badge" data-dept="${course.dept}">${course.dept}</span>
          <span class="course-code">${course.code}</span>
        </div>

        <div class="card-content">
          <h3 class="course-title">${course.title}</h3>
          <p class="course-desc">${course.description}</p>

          <div class="course-specs-grid">
            <div class="spec-item">
              <span class="spec-label">Credits</span>
              <span class="spec-val">${course.credits} Units</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Mode</span>
              <span class="spec-val">${course.mode}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Schedule</span>
              <span class="spec-val">${course.schedule}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Instructor</span>
              <span class="spec-val">${course.instructor}</span>
            </div>
          </div>

          <div class="seat-status-box">
            <div class="seat-status-header">
              <span>Enrollment Capacity</span>
              <span class="${isFull ? 'seats-full-tag' : 'seats-open-tag'} font-bold">
                ${isFull ? '0 Seats Left' : `${availableSeats} Seats Open`} (${course.enrolled}/${course.capacity})
              </span>
            </div>
            <div class="seat-progress" role="progressbar" aria-valuenow="${percentFilled}" aria-valuemin="0" aria-valuemax="100" aria-label="Capacity ${percentFilled}% filled">
              <div class="seat-progress-fill ${progressColorClass}" style="width: ${percentFilled}%;"></div>
            </div>
          </div>

          <div class="card-actions-row">
            <button type="button" class="btn btn-outline btn-sm action-view-details" data-id="${course.id}" aria-label="View syllabus and requirements for ${course.code}">
              Details
            </button>
            ${actionButtonHTML}
          </div>
        </div>
      </article>
    `;
  }

  function renderCatalog() {
    const grid = document.getElementById('catalogCourseGrid');
    const emptyState = document.getElementById('catalogEmptyState');
    const countEl = document.getElementById('resultsCount');
    if (!grid) return;

    const filtered = filterAndSortCourses();

    if (countEl) {
      countEl.innerHTML = `Showing <strong>${filtered.length}</strong> course${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
    } else {
      if (emptyState) emptyState.hidden = true;
      grid.innerHTML = filtered.map(course => createCourseCardHTML(course)).join('');
      bindCourseCardEvents(grid);
    }
  }

  function bindCourseCardEvents(container) {
    // Quick register buttons
    container.querySelectorAll('.action-quick-register').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const courseId = e.currentTarget.getAttribute('data-id');
        initiateEnrollment(courseId);
      });
    });

    // View details modal buttons
    container.querySelectorAll('.action-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const courseId = e.currentTarget.getAttribute('data-id');
        openCourseDetailsModal(courseId);
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. Rendering: Registration Page & Data Table
     -------------------------------------------------------------------------- */
  function renderRegistrationView() {
    renderCreditTracker();
    renderCourseSelectDropdown();
    renderRegisteredTable();
  }

  function renderCreditTracker() {
    const totalCredits = calculateTotalCredits();
    const currentCreditsEl = document.getElementById('trackerCurrentCredits');
    const fillEl = document.getElementById('creditProgressFill');
    const barEl = document.getElementById('creditProgressBar');
    const badgeEl = document.getElementById('loadStatusBadge');

    if (currentCreditsEl) currentCreditsEl.textContent = totalCredits;

    const percentage = Math.min(100, (totalCredits / state.maxCredits) * 100);
    if (fillEl) fillEl.style.width = `${percentage}%`;

    if (barEl) {
      barEl.setAttribute('aria-valuenow', totalCredits);
      barEl.setAttribute('aria-valuetext', `${totalCredits} out of ${state.maxCredits} credits registered`);
    }

    if (badgeEl) {
      if (totalCredits >= 12 && totalCredits <= 18) {
        badgeEl.textContent = 'Full-Time Student Status (Eligible for Full Aid)';
        badgeEl.style.background = 'linear-gradient(135deg, #D1FAE5, #A7F3D0)';
        badgeEl.style.color = '#065F46';
        badgeEl.style.borderColor = '#34D399';
      } else if (totalCredits < 12) {
        badgeEl.textContent = 'Part-Time Status (<12 Credits)';
        badgeEl.style.background = 'linear-gradient(135deg, #FEF3C7, #FDE68A)';
        badgeEl.style.color = '#92400E';
        badgeEl.style.borderColor = '#F59E0B';
      } else {
        badgeEl.textContent = 'Overload Status (Requires Dean Approval)';
        badgeEl.style.background = 'linear-gradient(135deg, #FEE2E2, #FECACA)';
        badgeEl.style.color = '#991B1B';
        badgeEl.style.borderColor = '#F87171';
      }
    }

    // Update Header Pill and Nav Badge
    updateHeaderCounters();
  }

  function updateHeaderCounters() {
    const totalCredits = calculateTotalCredits();
    const count = state.registered.length;

    const pillCredits = document.getElementById('pillCredits');
    if (pillCredits) pillCredits.textContent = totalCredits;

    const navBadge = document.getElementById('navCourseCount');
    if (navBadge) {
      navBadge.textContent = count;
      navBadge.setAttribute('aria-label', `${count} courses registered`);
    }
  }

  function renderCourseSelectDropdown() {
    const select = document.getElementById('formCourseSelect');
    if (!select) return;

    // Filter available courses not yet registered
    const unregisteredCourses = state.allCourses.filter(c => !isCourseRegistered(c.id));

    let optionsHTML = '<option value="">-- Choose a Course to Add --</option>';
    unregisteredCourses.forEach(c => {
      const seats = c.capacity - c.enrolled;
      const isFull = seats <= 0;
      optionsHTML += `
        <option value="${c.id}" ${isFull ? 'disabled' : ''}>
          ${c.code}: ${c.title} (${c.credits} Credits) ${isFull ? '[CLASS FULL]' : `[${seats} seats open]`}
        </option>
      `;
    });

    select.innerHTML = optionsHTML;
  }

  function renderRegisteredTable() {
    const tbody = document.getElementById('registeredTableBody');
    const emptyState = document.getElementById('emptyRegisteredState');
    const tableElement = document.getElementById('registeredCoursesTable');
    const summaryCreditEl = document.getElementById('tableTotalCredits');

    if (!tbody) return;

    if (state.registered.length === 0) {
      tbody.innerHTML = '';
      if (tableElement) tableElement.style.display = 'none';
      if (emptyState) emptyState.hidden = false;
      if (summaryCreditEl) summaryCreditEl.textContent = '0';
      return;
    }

    if (tableElement) tableElement.style.display = 'table';
    if (emptyState) emptyState.hidden = true;

    let rowsHTML = '';
    let totalCredits = 0;

    state.registered.forEach(reg => {
      const course = getCourse(reg.courseId);
      if (!course) return;

      totalCredits += course.credits;

      rowsHTML += `
        <tr>
          <td>
            <span class="table-course-code">${course.code}</span>
          </td>
          <td>
            <span class="table-course-title">${course.title}</span>
          </td>
          <td>${course.schedule}</td>
          <td>${course.location}</td>
          <td>${course.instructor}</td>
          <td class="text-bold">${course.credits}</td>
          <td>${reg.grading || 'Letter Grade'}</td>
          <td>
            <span class="status-badge-enrolled">
              <span aria-hidden="true">✓</span> Enrolled
            </span>
          </td>
          <td class="text-center">
            <button type="button" class="btn btn-danger-outline btn-sm action-drop-course" data-id="${course.id}" aria-label="Drop ${course.code}">
              Drop
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHTML;
    if (summaryCreditEl) summaryCreditEl.textContent = totalCredits;

    // Attach Drop button event listeners
    tbody.querySelectorAll('.action-drop-course').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const courseId = e.currentTarget.getAttribute('data-id');
        initiateDrop(courseId);
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. Registration Logic & Confirmation Modals
     -------------------------------------------------------------------------- */
  function initiateEnrollment(courseId, gradingBasis = "Letter Grade (A-F)") {
    const course = getCourse(courseId);
    if (!course) return;

    // Validation 1: Already registered
    if (isCourseRegistered(courseId)) {
      Toast.show(`You are already enrolled in ${course.code}.`, 'warning');
      return;
    }

    // Validation 2: Available seats
    if (course.enrolled >= course.capacity) {
      Toast.show(`Cannot enroll: ${course.code} is currently full.`, 'danger');
      return;
    }

    // Validation 3: Credit limit check
    const currentCredits = calculateTotalCredits();
    if (currentCredits + course.credits > state.maxCredits) {
      Toast.show(`Enrollment blocked: Adding ${course.code} (${course.credits} cr) would exceed the term limit of ${state.maxCredits} credits.`, 'danger');
      return;
    }

    // Prepare confirmation modal
    state.pendingAction = {
      type: 'register',
      courseId: course.id,
      grading: gradingBasis
    };

    openConfirmationModal({
      title: `Confirm Course Enrollment`,
      subtitle: `Please review course details before finalizing registration`,
      desc: `You are about to register for the following course for the Fall 2026 academic term:`,
      course: course,
      callout: `Enrolling will increase your active workload to ${currentCredits + course.credits} credits.`,
      confirmText: `Confirm Enrollment`,
      confirmClass: 'btn-primary'
    });
  }

  function initiateDrop(courseId) {
    const course = getCourse(courseId);
    if (!course) return;

    const currentCredits = calculateTotalCredits();
    const newTotal = currentCredits - course.credits;

    state.pendingAction = {
      type: 'drop',
      courseId: course.id
    };

    let calloutText = `Dropping ${course.code} will reduce your workload to ${newTotal} credits.`;
    if (newTotal < 12) {
      calloutText += ` ⚠️ WARNING: Your credit load will drop below 12 credits, impacting full-time student status and financial aid!`;
    }

    openConfirmationModal({
      title: `Confirm Course Drop`,
      subtitle: `Action cannot be undone without re-registering subject to seat availability`,
      desc: `Are you sure you want to drop the following course from your Fall 2026 schedule?`,
      course: course,
      callout: calloutText,
      confirmText: `Yes, Drop Course`,
      confirmClass: 'btn-danger'
    });
  }

  function executePendingAction() {
    if (!state.pendingAction) return;

    const { type, courseId, grading } = state.pendingAction;
    const course = getCourse(courseId);

    if (type === 'register' && course) {
      // Add to registered
      state.registered.push({
        courseId: course.id,
        grading: grading || "Letter Grade (A-F)",
        registeredDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      // Increment enrollment count
      course.enrolled = Math.min(course.capacity, course.enrolled + 1);

      persistState();
      renderRegistrationView();
      renderCatalog();
      renderHomeMetrics();

      Toast.show(`Successfully enrolled in ${course.code}: ${course.title}!`, 'success');
    } else if (type === 'drop' && course) {
      // Remove from registered
      state.registered = state.registered.filter(r => r.courseId !== courseId);
      // Decrement enrollment count
      course.enrolled = Math.max(0, course.enrolled - 1);

      persistState();
      renderRegistrationView();
      renderCatalog();
      renderHomeMetrics();

      Toast.show(`Successfully dropped ${course.code}.`, 'info');
    }

    closeConfirmationModal();
    state.pendingAction = null;
  }

  /* --------------------------------------------------------------------------
     10. Modal Dialog Accessibility & Management
     -------------------------------------------------------------------------- */
  const confirmationModal = document.getElementById('confirmationModal');
  const detailsModal = document.getElementById('detailsModal');
  let lastActiveElementBeforeModal = null;

  function openConfirmationModal(config) {
    if (!confirmationModal) return;

    lastActiveElementBeforeModal = document.activeElement;

    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalDetails = document.getElementById('modalCourseDetails');
    const modalCalloutText = document.getElementById('modalCalloutText');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalIconBadge = document.getElementById('modalIconBadge');

    if (modalTitle) modalTitle.textContent = config.title;
    if (modalSubtitle) modalSubtitle.textContent = config.subtitle;
    if (modalDesc) modalDesc.textContent = config.desc;
    if (modalCalloutText) modalCalloutText.textContent = config.callout;

    if (modalIconBadge) {
      modalIconBadge.className = `modal-icon-badge ${config.confirmClass === 'btn-danger' ? 'danger' : ''}`;
    }

    if (modalConfirmBtn) {
      modalConfirmBtn.textContent = config.confirmText;
      modalConfirmBtn.className = `btn ${config.confirmClass}`;
    }

    if (modalDetails && config.course) {
      modalDetails.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="dept-badge" data-dept="${config.course.dept}">${config.course.dept}</span>
          <strong style="font-family: var(--font-heading); color: var(--primary-700);">${config.course.code}</strong>
        </div>
        <h4 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.5rem;">${config.course.title}</h4>
        <div style="font-size: 0.85rem; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
          <div><strong>Credits:</strong> ${config.course.credits} Units</div>
          <div><strong>Term:</strong> ${config.course.term}</div>
          <div><strong>Schedule:</strong> ${config.course.schedule}</div>
          <div><strong>Instructor:</strong> ${config.course.instructor}</div>
        </div>
      `;
    }

    confirmationModal.hidden = false;
    // Focus first interactive button
    setTimeout(() => {
      if (modalConfirmBtn) modalConfirmBtn.focus();
    }, 50);
  }

  function closeConfirmationModal() {
    if (!confirmationModal) return;
    confirmationModal.hidden = true;
    if (lastActiveElementBeforeModal && typeof lastActiveElementBeforeModal.focus === 'function') {
      lastActiveElementBeforeModal.focus();
    }
  }

  function openCourseDetailsModal(courseId) {
    const course = getCourse(courseId);
    if (!course || !detailsModal) return;

    lastActiveElementBeforeModal = document.activeElement;

    const deptBadge = document.getElementById('detailsDeptBadge');
    const titleEl = document.getElementById('detailsTitle');
    const bodyEl = document.getElementById('detailsModalBody');
    const regBtn = document.getElementById('detailsRegisterBtn');

    if (deptBadge) {
      deptBadge.textContent = course.dept.toUpperCase();
      deptBadge.setAttribute('data-dept', course.dept);
    }
    if (titleEl) {
      titleEl.textContent = `${course.code}: ${course.title}`;
    }

    const isEnrolled = isCourseRegistered(course.id);
    const availableSeats = Math.max(0, course.capacity - course.enrolled);

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="details-section">
          <div class="details-label">Course Description &amp; Objectives</div>
          <p>${course.description}</p>
        </div>

        <div class="details-section" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; background: var(--bg-page); padding: 1rem; border-radius: var(--radius-md);">
          <div>
            <div class="details-label">Instructor</div>
            <p><strong>${course.instructor}</strong></p>
          </div>
          <div>
            <div class="details-label">Academic Credits</div>
            <p><strong>${course.credits} Semester Units</strong></p>
          </div>
          <div>
            <div class="details-label">Schedule &amp; Times</div>
            <p><strong>${course.schedule}</strong></p>
          </div>
          <div>
            <div class="details-label">Classroom Location</div>
            <p><strong>${course.location}</strong></p>
          </div>
          <div>
            <div class="details-label">Instruction Delivery</div>
            <p><strong>${course.mode}</strong></p>
          </div>
          <div>
            <div class="details-label">Academic Term</div>
            <p><strong>${course.term}</strong></p>
          </div>
        </div>

        <div class="details-section mt-3">
          <div class="details-label">Prerequisites &amp; Restrictions</div>
          <p>${course.prereq !== 'None' ? `⚠️ Required completion of: <strong>${course.prereq}</strong> with a C- or better.` : 'None. Open to all students in good academic standing.'}</p>
        </div>

        <div class="details-section">
          <div class="details-label">Enrollment Status</div>
          <p>
            ${availableSeats > 0 ? `🟢 Open for registration (${availableSeats} of ${course.capacity} seats remaining)` : `🔴 Waitlist only (Class is at full capacity of ${course.capacity} students)`}
          </p>
        </div>
      `;
    }

    if (regBtn) {
      if (isEnrolled) {
        regBtn.textContent = 'Already Enrolled';
        regBtn.disabled = true;
      } else if (availableSeats <= 0) {
        regBtn.textContent = 'Class Full (Waitlist)';
        regBtn.disabled = true;
      } else {
        regBtn.textContent = `Register for ${course.code}`;
        regBtn.disabled = false;
        regBtn.onclick = () => {
          closeDetailsModal();
          initiateEnrollment(course.id);
        };
      }
    }

    detailsModal.hidden = false;
    const dismissBtn = document.getElementById('detailsDismissBtn');
    setTimeout(() => {
      if (dismissBtn) dismissBtn.focus();
    }, 50);
  }

  function closeDetailsModal() {
    if (!detailsModal) return;
    detailsModal.hidden = true;
    if (lastActiveElementBeforeModal && typeof lastActiveElementBeforeModal.focus === 'function') {
      lastActiveElementBeforeModal.focus();
    }
  }

  // Keyboard accessibility: ESC key to close modal & Tab trapping
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (confirmationModal && !confirmationModal.hidden) {
        closeConfirmationModal();
      }
      if (detailsModal && !detailsModal.hidden) {
        closeDetailsModal();
      }
    }
  });

  /* --------------------------------------------------------------------------
     11. Event Listeners Setup
     -------------------------------------------------------------------------- */
  function setupEventListeners() {
    // Navigation bar clicks
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        navigateTo(view);
      });
    });

    // In-page navigation helper buttons (e.g., hero buttons, empty state buttons)
    document.querySelectorAll('[data-navigate]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-navigate');
        navigateTo(view);
      });
    });

    // Quick credit pill click
    const creditPill = document.getElementById('quickCreditPill');
    if (creditPill) {
      creditPill.addEventListener('click', () => navigateTo('registration'));
    }

    // Brand logo click
    const brandLogo = document.getElementById('brandLogo');
    if (brandLogo) {
      brandLogo.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('home');
      });
    }

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    if (mobileBtn && mainNav) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('mobile-open');
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Catalog Search Input (live search with debouncing)
    const searchInput = document.getElementById('catalogSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const val = e.target.value;
        if (clearBtn) clearBtn.hidden = val.length === 0;

        debounceTimer = setTimeout(() => {
          state.filters.search = val;
          renderCatalog();
        }, 200);
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.hidden = true;
        state.filters.search = '';
        renderCatalog();
        searchInput.focus();
      });
    }

    // Catalog Filter Dropdowns
    const deptSelect = document.getElementById('filterDepartment');
    if (deptSelect) {
      deptSelect.addEventListener('change', (e) => {
        state.filters.department = e.target.value;
        renderCatalog();
      });
    }

    const levelSelect = document.getElementById('filterLevel');
    if (levelSelect) {
      levelSelect.addEventListener('change', (e) => {
        state.filters.level = e.target.value;
        renderCatalog();
      });
    }

    const modeSelect = document.getElementById('filterMode');
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        state.filters.mode = e.target.value;
        renderCatalog();
      });
    }

    const termSelect = document.getElementById('filterTerm');
    if (termSelect) {
      termSelect.addEventListener('change', (e) => {
        state.filters.term = e.target.value;
        renderCatalog();
      });
    }

    const openSeatsCheck = document.getElementById('filterOpenSeats');
    if (openSeatsCheck) {
      openSeatsCheck.addEventListener('change', (e) => {
        state.filters.openSeatsOnly = e.target.checked;
        renderCatalog();
      });
    }

    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.filters.sortBy = e.target.value;
        renderCatalog();
      });
    }

    // Reset filters buttons
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const resetFiltersEmptyBtn = document.getElementById('resetFiltersEmptyBtn');
    const resetAllFilters = () => {
      if (searchInput) searchInput.value = '';
      if (clearBtn) clearBtn.hidden = true;
      if (deptSelect) deptSelect.value = 'ALL';
      if (levelSelect) levelSelect.value = 'ALL';
      if (modeSelect) modeSelect.value = 'ALL';
      if (termSelect) termSelect.value = 'Fall 2026';
      if (openSeatsCheck) openSeatsCheck.checked = false;
      if (sortSelect) sortSelect.value = 'code-asc';

      state.filters = {
        search: '',
        department: 'ALL',
        level: 'ALL',
        mode: 'ALL',
        term: 'Fall 2026',
        openSeatsOnly: false,
        sortBy: 'code-asc'
      };
      renderCatalog();
      Toast.show('Catalog filters cleared.', 'info');
    };

    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
    if (resetFiltersEmptyBtn) resetFiltersEmptyBtn.addEventListener('click', resetAllFilters);

    // Registration Form Submit
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const courseSelect = document.getElementById('formCourseSelect');
        const gradingSelect = document.getElementById('formGradingOption');

        const courseId = courseSelect.value;
        const grading = gradingSelect ? gradingSelect.value : 'Letter Grade (A-F)';

        if (!courseId) {
          Toast.show('Please select a course to enroll from the dropdown.', 'warning');
          if (courseSelect) courseSelect.focus();
          return;
        }

        initiateEnrollment(courseId, grading);
      });
    }

    // Confirmation Modal Actions
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', executePendingAction);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeConfirmationModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeConfirmationModal);

    // Details Modal Actions
    const detailsCloseBtn = document.getElementById('detailsCloseBtn');
    const detailsDismissBtn = document.getElementById('detailsDismissBtn');
    if (detailsCloseBtn) detailsCloseBtn.addEventListener('click', closeDetailsModal);
    if (detailsDismissBtn) detailsDismissBtn.addEventListener('click', closeDetailsModal);

    // Print schedule button
    const printBtn = document.getElementById('printScheduleBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Advisor appointment button
    const bookAdvisorBtn = document.getElementById('bookAdvisorBtn');
    if (bookAdvisorBtn) {
      bookAdvisorBtn.addEventListener('click', () => {
        Toast.show('Appointment portal: Dr. Elena Rostova has open slots Tuesday at 3:00 PM PST. Reserved appointment placeholder sent to your university email.', 'success', 5000);
      });
    }

    // Accessibility Toggles
    const contrastToggleHeader = document.getElementById('contrastToggle');
    const prefContrastToggle = document.getElementById('prefHighContrastBtn');
    const prefMotionToggle = document.getElementById('prefReducedMotionBtn');
    const prefNotifyToggle = document.getElementById('prefNotificationsBtn');

    const toggleHighContrast = () => {
      const isHigh = document.body.getAttribute('data-contrast') === 'high';
      if (isHigh) {
        document.body.removeAttribute('data-contrast');
        if (prefContrastToggle) {
          prefContrastToggle.classList.remove('active');
          prefContrastToggle.setAttribute('aria-checked', 'false');
        }
        Toast.show('High Contrast Mode disabled.', 'info');
      } else {
        document.body.setAttribute('data-contrast', 'high');
        if (prefContrastToggle) {
          prefContrastToggle.classList.add('active');
          prefContrastToggle.setAttribute('aria-checked', 'true');
        }
        Toast.show('High Contrast Mode enabled.', 'info');
      }
    };

    if (contrastToggleHeader) contrastToggleHeader.addEventListener('click', toggleHighContrast);
    if (prefContrastToggle) prefContrastToggle.addEventListener('click', toggleHighContrast);

    if (prefMotionToggle) {
      prefMotionToggle.addEventListener('click', () => {
        const isReduced = document.body.getAttribute('data-reduced-motion') === 'true';
        if (isReduced) {
          document.body.removeAttribute('data-reduced-motion');
          prefMotionToggle.classList.remove('active');
          prefMotionToggle.setAttribute('aria-checked', 'false');
          Toast.show('Standard animations restored.', 'info');
        } else {
          document.body.setAttribute('data-reduced-motion', 'true');
          prefMotionToggle.classList.add('active');
          prefMotionToggle.setAttribute('aria-checked', 'true');
          Toast.show('Reduced Motion preference enabled.', 'info');
        }
      });
    }

    if (prefNotifyToggle) {
      prefNotifyToggle.addEventListener('click', () => {
        const isActive = prefNotifyToggle.classList.toggle('active');
        prefNotifyToggle.setAttribute('aria-checked', isActive ? 'true' : 'false');
        Toast.show(isActive ? 'Waitlist notifications enabled (SMS & Email).' : 'Waitlist notifications disabled.', 'info');
      });
    }

    // Edit profile preferences button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        Toast.show('Profile information verified with the University Registrar. Preferences saved.', 'success');
      });
    }
  }

  /* --------------------------------------------------------------------------
     12. Bootstrapping
     -------------------------------------------------------------------------- */
  function init() {
    loadPersistedState();
    setupEventListeners();

    // Initial render
    renderHomeMetrics();
    renderFeaturedCourses();
    renderCatalog();
    renderRegistrationView();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
