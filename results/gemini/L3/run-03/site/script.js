/**
 * Apex University - Course Registration Portal
 * Accessible JavaScript Application (WCAG 2.2 AA Compliant)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Course Catalog & Student State Data
     ========================================================================== */

  const COURSE_DATABASE = [
    {
      crn: "10450",
      code: "CSE 101",
      title: "Design and Analysis of Algorithms",
      dept: "CSE",
      deptName: "Computer Science",
      term: "Fall 2026",
      level: "upper",
      mode: "In-Person",
      units: 4.0,
      schedule: "Tue, Thu 11:00 AM – 12:20 PM",
      location: "WLH 2001",
      instructor: "Prof. Sanjoy Dasgupta",
      seatsTotal: 150,
      seatsTaken: 142,
      prereqs: "CSE 21 or MATH 154, and CSE 100",
      description: "Design and analysis of efficient algorithms. Dynamic programming, greedy algorithms, divide-and-conquer, graph algorithms, and NP-completeness.",
      syllabus: [
        "Divide and Conquer & Master Theorem",
        "Greedy Algorithms & Matroids",
        "Dynamic Programming Paradigms",
        "Network Flow & Min-Cut Theorems",
        "NP-Completeness and Reductions"
      ],
      textbook: "Introduction to Algorithms (CLRS 4th Edition)"
    },
    {
      crn: "10452",
      code: "CSE 216",
      title: "Advanced Software Engineering",
      dept: "CSE",
      deptName: "Computer Science",
      term: "Fall 2026",
      level: "upper",
      mode: "In-Person",
      units: 4.0,
      schedule: "Mon, Wed 10:00 AM – 11:50 AM",
      location: "WLH 2204",
      instructor: "Prof. Maya Lin",
      seatsTotal: 60,
      seatsTaken: 42,
      prereqs: "CSE 110 or equivalent software team project experience",
      description: "Modern software architecture, CI/CD automated test frameworks, microservices design patterns, accessibility engineering (WCAG 2.2), and cloud system scalability.",
      syllabus: [
        "Software Architectural Design Patterns",
        "Continuous Integration & Automated Testing Pipelines",
        "Accessible Web Interface Standards (WCAG 2.2)",
        "Microservices & Event-Driven Architecture",
        "Containerization and Cloud Deployment"
      ],
      textbook: "Designing Data-Intensive Applications by Martin Kleppmann"
    },
    {
      crn: "10455",
      code: "DSC 140A",
      title: "Probabilistic Modeling & ML",
      dept: "DSC",
      deptName: "Data Science",
      term: "Fall 2026",
      level: "upper",
      mode: "In-Person",
      units: 4.0,
      schedule: "Tue, Thu 2:00 PM – 3:20 PM",
      location: "CSB 002",
      instructor: "Dr. Arthur Chen",
      seatsTotal: 90,
      seatsTaken: 82,
      prereqs: "DSC 40B and DSC 80, and MATH 20C or MATH 31BH",
      description: "Principles of probabilistic inference, Bayesian networks, maximum likelihood estimation, linear classifiers, and foundational machine learning architectures.",
      syllabus: [
        "Probability Theory and Random Vectors",
        "Maximum Likelihood & MAP Estimation",
        "Bayesian Classifiers & Naive Bayes",
        "Support Vector Machines & Kernel Tricks",
        "Expectation-Maximization & Clustering"
      ],
      textbook: "Pattern Recognition and Machine Learning by Christopher Bishop"
    },
    {
      crn: "10456",
      code: "DSGN 100",
      title: "Prototyping Accessible Interfaces",
      dept: "DSGN",
      deptName: "Cognitive Science & Design",
      term: "Fall 2026",
      level: "upper",
      mode: "Hybrid",
      units: 4.0,
      schedule: "Fri 9:00 AM – 12:50 PM",
      location: "Design Lab Studio 1",
      instructor: "Prof. Sarah Jenkins",
      seatsTotal: 35,
      seatsTaken: 35,
      prereqs: "DSGN 1 or COGS 10",
      description: "Hands-on studio course focusing on universal accessibility, screen reader testing, assistive technologies, and rapid interactive prototyping for diverse audiences.",
      syllabus: [
        "Universal Design & Assistive Tech Overview",
        "Screen Reader Testing (NVDA/JAWS/VoiceOver)",
        "WCAG 2.2 AA Contrast & Focus Visibility Rules",
        "Figma High-Fidelity Interactive Wireframing",
        "Usability Evaluations with Community Participants"
      ],
      textbook: "A Web for Everyone by Sarah Horton & Whitney Quesenbery"
    },
    {
      crn: "10460",
      code: "MATH 180A",
      title: "Introduction to Probability",
      dept: "MATH",
      deptName: "Mathematics",
      term: "Fall 2026",
      level: "upper",
      mode: "In-Person",
      units: 4.0,
      schedule: "Mon, Wed, Fri 1:00 PM – 1:50 PM",
      location: "PETER 108",
      instructor: "Dr. David Thorne",
      seatsTotal: 120,
      seatsTaken: 110,
      prereqs: "MATH 20C or MATH 31BH with a grade of C- or better",
      description: "Probability spaces, random variables, cumulative distribution functions, joint distributions, conditional probability, expectation, variance, and the Central Limit Theorem.",
      syllabus: [
        "Sample Spaces and Axioms of Probability",
        "Discrete and Continuous Random Variables",
        "Joint and Conditional Probability Distributions",
        "Law of Large Numbers",
        "Central Limit Theorem and Applications"
      ],
      textbook: "Probability by Jim Pitman"
    },
    {
      crn: "10465",
      code: "CSE 110",
      title: "Software Engineering Project Lab",
      dept: "CSE",
      deptName: "Computer Science",
      term: "Fall 2026",
      level: "upper",
      mode: "In-Person",
      units: 4.0,
      schedule: "Tue, Thu 3:30 PM – 4:50 PM",
      location: "CENTR 115",
      instructor: "Prof. Thomas Powell",
      seatsTotal: 200,
      seatsTaken: 195,
      prereqs: "CSE 100",
      description: "Introduction to software development life cycle, agile scrum methodologies, sprint planning, pull request reviews, and building full-stack web applications in teams.",
      syllabus: [
        "Agile Scrum and Sprint Lifecycles",
        "User Stories and Acceptance Criteria",
        "Git Branching Strategies & Code Reviews",
        "Unit Testing and Integration Frameworks",
        "Final Product Showcase and Demo"
      ],
      textbook: "Agile Software Development: Principles, Patterns, and Practices"
    },
    {
      crn: "10470",
      code: "PHYS 2A",
      title: "Physics - Mechanics",
      dept: "PHYS",
      deptName: "Physics",
      term: "Fall 2026",
      level: "lower",
      mode: "In-Person",
      units: 4.0,
      schedule: "Mon, Wed, Fri 8:00 AM – 8:50 AM",
      location: "YORK 2722",
      instructor: "Dr. Brian Anderson",
      seatsTotal: 250,
      seatsTaken: 180,
      prereqs: "MATH 10A or MATH 20A",
      description: "Vectors, motion in one and two dimensions, Newton's laws of motion, work and energy, conservation of momentum, collisions, and rotational dynamics.",
      syllabus: [
        "Kinematics in One and Two Dimensions",
        "Newtonian Laws of Motion & Forces",
        "Kinetic and Potential Energy Conservation",
        "Momentum, Impulse, and Center of Mass",
        "Rotational Kinematics and Torque"
      ],
      textbook: "University Physics with Modern Physics by Young & Freedman"
    },
    {
      crn: "10480",
      code: "BENG 100",
      title: "Frontiers of Bioengineering",
      dept: "BENG",
      deptName: "Bioengineering",
      term: "Fall 2026",
      level: "upper",
      mode: "In-Person",
      units: 3.0,
      schedule: "Mon, Wed 3:00 PM – 4:20 PM",
      location: "PFBH 110",
      instructor: "Prof. Karen Bailey",
      seatsTotal: 50,
      seatsTaken: 32,
      prereqs: "BENG 1 and CHEM 6A",
      description: "Overview of modern biotechnology breakthroughs, neural interfaces, biomaterials, genetic engineering therapies, and biomechanical instrumentation.",
      syllabus: [
        "Cellular & Tissue Engineering Foundations",
        "Neural Prosthetics & Signal Decoding",
        "Synthetic Biology and CRISPR Applications",
        "Biomechanics of Cardiovascular Flow",
        "Bioethics & Regulatory Approval"
      ],
      textbook: "Bioengineering Fundamentals by Ann Saterbak"
    },
    {
      crn: "10490",
      code: "CSE 120",
      title: "Principles of Computer Operating Systems",
      dept: "CSE",
      deptName: "Computer Science",
      term: "Spring 2027",
      level: "upper",
      mode: "In-Person",
      units: 4.0,
      schedule: "Tue, Thu 9:30 AM – 10:50 AM",
      location: "WLH 2005",
      instructor: "Prof. Geoffrey Voelker",
      seatsTotal: 160,
      seatsTaken: 110,
      prereqs: "CSE 30 and CSE 101",
      description: "Basic functions of operating systems: process synchronization, thread scheduling, virtual memory management, file systems, device drivers, and virtualization.",
      syllabus: [
        "Processes, Threads, and Concurrency",
        "Synchronization Primitives & Semaphores",
        "Virtual Memory and Paging Algorithms",
        "File System Architecture & Consistency",
        "Security and OS Isolation Mechanisms"
      ],
      textbook: "Operating Systems: Three Easy Pieces by Remzi H. Arpaci-Dusseau"
    },
    {
      crn: "10495",
      code: "MATH 20C",
      title: "Calculus & Analytic Geometry for Science",
      dept: "MATH",
      deptName: "Mathematics",
      term: "Fall 2026",
      level: "lower",
      mode: "Online",
      units: 4.0,
      schedule: "Online Asynchronous",
      location: "Canvas Online",
      instructor: "Dr. Angela Foster",
      seatsTotal: 200,
      seatsTaken: 165,
      prereqs: "MATH 20B or AP Calculus BC score of 4 or 5",
      description: "Vector geometry, dot and cross products, lines and planes in 3D, partial derivatives, directional derivatives, gradient vectors, and multiple integrals.",
      syllabus: [
        "Vectors, Dot and Cross Products in R^3",
        "Planes and Quadric Surfaces",
        "Partial Derivatives and Chain Rules",
        "Optimization & Lagrange Multipliers",
        "Double and Triple Integrals in Polar/Cylindrical"
      ],
      textbook: "Calculus: Early Transcendentals by Stewart"
    }
  ];

  // Initial Registered Courses State (Alex Morgan is registered for 3 classes = 12.0 units)
  const state = {
    currentView: 'home',
    registeredCourses: [
      {
        crn: "10450",
        gradingOption: "Letter Grade",
        enrolledDate: "2026-11-02",
        status: "Enrolled"
      },
      {
        crn: "10460",
        gradingOption: "Letter Grade",
        enrolledDate: "2026-11-02",
        status: "Enrolled"
      },
      {
        crn: "10465",
        gradingOption: "Letter Grade",
        enrolledDate: "2026-11-03",
        status: "Enrolled"
      }
    ],
    pendingAction: null, // Holds { type: 'register'|'drop', course, gradingOption, triggerElement }
    lastFocusedElement: null
  };

  /* ==========================================================================
     2. DOM Element Selectors
     ========================================================================== */

  const DOM = {
    // Announcer & Navigation
    announcer: document.getElementById('status-announcer'),
    navLinks: document.querySelectorAll('.nav-link'),
    mobileNavBtn: document.getElementById('mobile-nav-btn'),
    primaryNav: document.getElementById('primary-navigation'),
    pageViews: document.querySelectorAll('.page-view'),
    mainContent: document.getElementById('main-content'),
    brandHomeLink: document.getElementById('brand-home-link'),
    navRegisteredCount: document.getElementById('nav-registered-count'),
    headerQuickCredits: document.querySelector('.header-credits-quick'),
    headerQuickCount: document.querySelector('.header-count-quick'),

    // Home View Elements
    homeStatCourses: document.getElementById('home-stat-courses'),
    homeStatCredits: document.getElementById('home-stat-credits'),

    // Catalog View Elements
    catalogSearchInput: document.getElementById('catalog-search-input'),
    catalogSearchForm: document.getElementById('catalog-search-form'),
    filterDept: document.getElementById('filter-department'),
    filterTerm: document.getElementById('filter-term'),
    filterLevel: document.getElementById('filter-level'),
    filterAvail: document.getElementById('filter-availability'),
    filterMode: document.getElementById('filter-mode'),
    btnResetFilters: document.getElementById('btn-reset-filters'),
    catalogCardsContainer: document.getElementById('catalog-cards-container'),
    catalogResultsCount: document.getElementById('catalog-count-num'),
    activeFilterTags: document.getElementById('active-filter-tags'),

    // Registration View Elements
    regForm: document.getElementById('course-registration-form'),
    regCourseSelect: document.getElementById('reg-course-select'),
    regCrnInput: document.getElementById('reg-crn-input'),
    regPrereqCheck: document.getElementById('reg-prereq-check'),
    regErrorSummary: document.getElementById('registration-error-summary'),
    errorSummaryList: document.getElementById('error-summary-list'),
    regSuccessAlert: document.getElementById('registration-success-alert'),
    regSuccessTitle: document.getElementById('reg-success-title'),
    regSuccessMsg: document.getElementById('reg-success-message'),
    registeredCoursesTbody: document.getElementById('registered-courses-tbody'),
    tfootTotalUnits: document.getElementById('tfoot-total-units'),
    regTotalUnits: document.getElementById('reg-total-units'),
    tableEmptyState: document.getElementById('table-empty-state'),
    tableCoursesCountBadge: document.getElementById('table-courses-count-badge'),

    // Profile View Elements
    profileForm: document.getElementById('student-profile-form'),
    profileStatusMsg: document.getElementById('profile-status-message'),

    // Modals
    confirmModal: document.getElementById('confirmation-modal'),
    confirmModalTitle: document.getElementById('confirm-modal-title'),
    confirmModalDesc: document.getElementById('confirm-modal-desc'),
    modalCourseDetails: document.getElementById('modal-course-details'),
    modalWarningNote: document.getElementById('modal-warning-note'),
    modalIconContainer: document.getElementById('modal-icon-container'),
    btnModalAction: document.getElementById('btn-modal-action'),
    btnModalCancel: document.getElementById('btn-modal-cancel'),
    btnModalClose: document.getElementById('btn-modal-close'),

    detailsModal: document.getElementById('details-modal'),
    detailsModalTitle: document.getElementById('details-modal-title'),
    detailsDeptBadge: document.getElementById('details-dept-badge'),
    detailsModalBody: document.getElementById('details-modal-body'),
    btnDetailsClose: document.getElementById('btn-details-close'),
    btnDetailsDismiss: document.getElementById('btn-details-dismiss'),
    btnDetailsRegisterAction: document.getElementById('btn-details-register-action')
  };

  /* ==========================================================================
     3. Utility & Accessibility Functions
     ========================================================================== */

  /**
   * Speak a message to screen readers via aria-live
   */
  function announce(message) {
    if (DOM.announcer) {
      DOM.announcer.textContent = '';
      setTimeout(() => {
        DOM.announcer.textContent = message;
      }, 50);
    }
  }

  /**
   * Return total enrolled units
   */
  function getTotalEnrolledUnits() {
    return state.registeredCourses.reduce((sum, reg) => {
      const course = COURSE_DATABASE.find(c => c.crn === reg.crn);
      return sum + (course ? course.units : 0);
    }, 0);
  }

  /**
   * Check if student is registered for a specific course
   */
  function isCourseRegistered(crn) {
    return state.registeredCourses.some(reg => reg.crn === crn);
  }

  /**
   * Calculate seat badge text and class
   */
  function getSeatStatus(course) {
    const remaining = course.seatsTotal - course.seatsTaken;
    if (remaining > 5) {
      return { text: `Open Seats: ${remaining}`, cssClass: 'badge-success', state: 'open' };
    } else if (remaining > 0) {
      return { text: `Almost Full (${remaining} left)`, cssClass: 'badge-warning', state: 'waitlist' };
    } else {
      return { text: `Waitlist (3 ahead)`, cssClass: 'badge-danger', state: 'full' };
    }
  }

  /* ==========================================================================
     4. Navigation & View Routing
     ========================================================================== */

  function navigateTo(targetView, updateHistory = true) {
    const validViews = ['home', 'catalog', 'registration', 'profile'];
    if (!validViews.includes(targetView)) {
      targetView = 'home';
    }

    state.currentView = targetView;

    // Toggle active view sections
    DOM.pageViews.forEach(view => {
      const isTarget = view.id === `view-${targetView}`;
      if (isTarget) {
        view.classList.add('active');
        view.removeAttribute('hidden');
      } else {
        view.classList.remove('active');
        view.setAttribute('hidden', 'true');
      }
    });

    // Toggle nav link active states and aria-current
    DOM.navLinks.forEach(link => {
      const viewAttr = link.getAttribute('data-view');
      if (viewAttr === targetView) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Close mobile nav if open
    if (DOM.primaryNav.classList.contains('open')) {
      DOM.primaryNav.classList.remove('open');
      DOM.mobileNavBtn.setAttribute('aria-expanded', 'false');
    }

    // Set page title for screen readers
    const viewTitles = {
      home: 'Home - Apex University Course Registration',
      catalog: 'Course Catalog - Apex University',
      registration: 'Course Registration & Schedule - Apex University',
      profile: 'Student Profile & Degree Progress - Apex University'
    };
    document.title = viewTitles[targetView] || 'Apex University';

    // Update URL hash
    if (updateHistory && window.location.hash !== `#${targetView}`) {
      window.location.hash = `#${targetView}`;
    }

    // Focus main content for keyboard & screen reader users
    DOM.mainContent.focus();

    // Announce to screen reader
    const friendlyNames = {
      home: 'Home page',
      catalog: 'Course Catalog',
      registration: 'Course Registration & Schedule page',
      profile: 'Student Profile & Degree Progress'
    };
    announce(`Navigated to ${friendlyNames[targetView] || targetView}`);

    // If navigating to catalog, re-render catalog cards
    if (targetView === 'catalog') {
      renderCatalog();
    }
  }

  // Handle Hash Changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== state.currentView) {
      navigateTo(hash, false);
    }
  });

  // Mobile menu toggle button
  if (DOM.mobileNavBtn) {
    DOM.mobileNavBtn.addEventListener('click', () => {
      const isOpen = DOM.primaryNav.classList.toggle('open');
      DOM.mobileNavBtn.setAttribute('aria-expanded', String(isOpen));
      announce(isOpen ? 'Navigation menu expanded' : 'Navigation menu collapsed');
    });
  }

  // Delegate clicks for view links
  document.addEventListener('click', (e) => {
    const viewLink = e.target.closest('[data-view]');
    if (viewLink) {
      e.preventDefault();
      const targetView = viewLink.getAttribute('data-view');
      navigateTo(targetView);
    }
  });

  /* ==========================================================================
     5. Catalog Filtering & Rendering
     ========================================================================== */

  function getFilteredCourses() {
    const query = DOM.catalogSearchInput ? DOM.catalogSearchInput.value.trim().toLowerCase() : '';
    const dept = DOM.filterDept ? DOM.filterDept.value : 'all';
    const term = DOM.filterTerm ? DOM.filterTerm.value : 'all';
    const level = DOM.filterLevel ? DOM.filterLevel.value : 'all';
    const avail = DOM.filterAvail ? DOM.filterAvail.value : 'all';
    const mode = DOM.filterMode ? DOM.filterMode.value : 'all';

    return COURSE_DATABASE.filter(course => {
      // Keyword search
      if (query) {
        const fullString = `${course.code} ${course.title} ${course.instructor} ${course.deptName} ${course.description}`.toLowerCase();
        if (!fullString.includes(query)) return false;
      }
      // Department
      if (dept !== 'all' && course.dept !== dept) return false;
      // Term
      if (term !== 'all' && course.term !== term) return false;
      // Level
      if (level !== 'all' && course.level !== level) return false;
      // Delivery Mode
      if (mode !== 'all' && course.mode !== mode) return false;
      // Availability
      if (avail === 'open') {
        if (course.seatsTaken >= course.seatsTotal) return false;
      } else if (avail === 'waitlist') {
        if (course.seatsTaken < course.seatsTotal) return false;
      } else if (avail === 'unregistered') {
        if (isCourseRegistered(course.crn)) return false;
      }

      return true;
    });
  }

  function renderFilterTags() {
    if (!DOM.activeFilterTags) return;
    DOM.activeFilterTags.innerHTML = '';

    const tags = [];
    const query = DOM.catalogSearchInput.value.trim();
    if (query) tags.push({ label: `"${query}"`, clear: () => { DOM.catalogSearchInput.value = ''; } });
    if (DOM.filterDept.value !== 'all') tags.push({ label: `Dept: ${DOM.filterDept.value}`, clear: () => { DOM.filterDept.value = 'all'; } });
    if (DOM.filterTerm.value !== 'all') tags.push({ label: `Term: ${DOM.filterTerm.value}`, clear: () => { DOM.filterTerm.value = 'all'; } });
    if (DOM.filterLevel.value !== 'all') tags.push({ label: `Level: ${DOM.filterLevel.value}`, clear: () => { DOM.filterLevel.value = 'all'; } });
    if (DOM.filterAvail.value !== 'all') tags.push({ label: `Status: ${DOM.filterAvail.value}`, clear: () => { DOM.filterAvail.value = 'all'; } });
    if (DOM.filterMode.value !== 'all') tags.push({ label: `Mode: ${DOM.filterMode.value}`, clear: () => { DOM.filterMode.value = 'all'; } });

    tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'filter-tag';
      span.innerHTML = `${tag.label} <button type="button" aria-label="Remove filter ${tag.label}" style="background:none;border:none;cursor:pointer;font-weight:bold;margin-left:4px;">&times;</button>`;
      span.querySelector('button').addEventListener('click', () => {
        tag.clear();
        renderCatalog();
      });
      DOM.activeFilterTags.appendChild(span);
    });
  }

  function renderCatalog() {
    if (!DOM.catalogCardsContainer) return;
    const courses = getFilteredCourses();

    if (DOM.catalogResultsCount) {
      DOM.catalogResultsCount.textContent = courses.length;
    }
    renderFilterTags();

    if (courses.length === 0) {
      DOM.catalogCardsContainer.innerHTML = `
        <div class="table-empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon" aria-hidden="true">🔍</div>
          <h3 class="empty-title">No matching courses found</h3>
          <p class="empty-desc">We couldn't find any courses matching your search criteria. Try clearing some filters or searching with a different keyword.</p>
          <button type="button" class="btn btn-primary" id="btn-empty-reset-filters">Reset All Filters</button>
        </div>
      `;
      const btnReset = document.getElementById('btn-empty-reset-filters');
      if (btnReset) {
        btnReset.addEventListener('click', resetFilters);
      }
      announce('Search completed. No matching courses found.');
      return;
    }

    const deptBadges = {
      CSE: 'badge-dept',
      DSC: 'badge-dept-cyan',
      MATH: 'badge-dept-amber',
      DSGN: 'badge-dept-purple',
      BENG: 'badge-dept-emerald',
      PHYS: 'badge-dept-orange'
    };

    const cardAccents = {
      CSE: 'card-accent-blue',
      DSC: 'card-accent-teal',
      MATH: 'card-accent-amber',
      DSGN: 'card-accent-purple',
      BENG: 'card-accent-emerald',
      PHYS: 'card-accent-rose'
    };

    DOM.catalogCardsContainer.innerHTML = courses.map(course => {
      const isRegistered = isCourseRegistered(course.crn);
      const seatInfo = getSeatStatus(course);
      const deptClass = deptBadges[course.dept] || 'badge-dept';
      const accentClass = cardAccents[course.dept] || 'card-accent-blue';
      const seatPercent = Math.min(100, Math.round((course.seatsTaken / course.seatsTotal) * 100));

      return `
        <article class="course-card ${accentClass}" aria-labelledby="card-title-${course.crn}">
          <div class="card-badge-row">
            <span class="badge ${deptClass}">${course.deptName}</span>
            <span class="badge ${seatInfo.cssClass}">${seatInfo.text}</span>
          </div>

          <h3 id="card-title-${course.crn}" class="course-title">${course.code}: ${course.title}</h3>
          
          <p class="course-meta">
            <span><strong>CRN:</strong> ${course.crn}</span> • 
            <span><strong>Units:</strong> ${course.units.toFixed(1)}</span> • 
            <span><strong>Term:</strong> ${course.term}</span> • 
            <span><strong>Format:</strong> ${course.mode}</span>
          </p>

          <p class="course-schedule">
            <span aria-hidden="true">🕒</span> ${course.schedule} (${course.location})
          </p>
          <p class="course-instructor">
            <span aria-hidden="true">👨‍🏫</span> <strong>Instructor:</strong> ${course.instructor}
          </p>

          <div class="course-seats-meter">
            <div class="seats-label-row">
              <span>Enrollment: ${course.seatsTaken}/${course.seatsTotal} enrolled</span>
              <span>${seatPercent}%</span>
            </div>
            <div class="progress-bar-track" role="progressbar" aria-valuenow="${course.seatsTaken}" aria-valuemin="0" aria-valuemax="${course.seatsTotal}" aria-label="Seats filled for ${course.code}">
              <div class="progress-bar-fill ${seatPercent >= 100 ? 'bg-danger' : 'progress-fill-primary'}" style="width: ${seatPercent}%; background-color: ${seatPercent >= 100 ? '#e11d48' : '#4338ca'};"></div>
            </div>
          </div>

          <p class="course-desc-snip">${course.description}</p>

          <div class="card-actions">
            <button type="button" 
                    class="btn btn-sm btn-outline btn-card-details" 
                    data-crn="${course.crn}" 
                    aria-label="View syllabus and prerequisites for ${course.code}: ${course.title}">
              Syllabus & Details
            </button>
            ${isRegistered ? `
              <button type="button" 
                      class="btn btn-sm btn-secondary" 
                      disabled 
                      aria-label="Already registered for ${course.code}">
                ✓ Enrolled
              </button>
            ` : `
              <button type="button" 
                      class="btn btn-sm btn-primary btn-card-register" 
                      data-crn="${course.crn}" 
                      aria-label="Register for ${course.code}: ${course.title}">
                Register
              </button>
            `}
          </div>
        </article>
      `;
    }).join('');

    announce(`Catalog updated: showing ${courses.length} courses`);
  }

  function resetFilters() {
    if (DOM.catalogSearchInput) DOM.catalogSearchInput.value = '';
    if (DOM.filterDept) DOM.filterDept.value = 'all';
    if (DOM.filterTerm) DOM.filterTerm.value = 'all';
    if (DOM.filterLevel) DOM.filterLevel.value = 'all';
    if (DOM.filterAvail) DOM.filterAvail.value = 'all';
    if (DOM.filterMode) DOM.filterMode.value = 'all';
    renderCatalog();
    announce('All filters have been reset.');
  }

  // Filter input listeners
  if (DOM.catalogSearchInput) {
    let debounceTimer;
    DOM.catalogSearchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(renderCatalog, 250);
    });
  }
  [DOM.filterDept, DOM.filterTerm, DOM.filterLevel, DOM.filterAvail, DOM.filterMode].forEach(sel => {
    if (sel) sel.addEventListener('change', renderCatalog);
  });
  if (DOM.btnResetFilters) {
    DOM.btnResetFilters.addEventListener('click', resetFilters);
  }

  /* ==========================================================================
     6. Registration Form & Dropdown Population
     ========================================================================== */

  function populateRegistrationCourseDropdown() {
    if (!DOM.regCourseSelect) return;
    const currentVal = DOM.regCourseSelect.value;
    
    // Clear existing options except placeholder
    DOM.regCourseSelect.innerHTML = `<option value="" disabled selected>-- Choose an open course --</option>`;

    COURSE_DATABASE.forEach(course => {
      const isRegistered = isCourseRegistered(course.crn);
      const option = document.createElement('option');
      option.value = course.crn;
      option.textContent = `${course.code}: ${course.title} (${course.units} units) - CRN ${course.crn}${isRegistered ? ' [Already Enrolled]' : ''}`;
      if (isRegistered) {
        option.disabled = true;
      }
      DOM.regCourseSelect.appendChild(option);
    });

    if (currentVal && !isCourseRegistered(currentVal)) {
      DOM.regCourseSelect.value = currentVal;
    }
  }

  // Synchronize Dropdown & CRN text input
  if (DOM.regCourseSelect) {
    DOM.regCourseSelect.addEventListener('change', () => {
      if (DOM.regCourseSelect.value && DOM.regCrnInput) {
        DOM.regCrnInput.value = DOM.regCourseSelect.value;
        clearFieldErrors(DOM.regCrnInput);
        clearFieldErrors(DOM.regCourseSelect);
      }
    });
  }

  if (DOM.regCrnInput) {
    DOM.regCrnInput.addEventListener('input', () => {
      const crn = DOM.regCrnInput.value.trim();
      if (crn.length === 5 && DOM.regCourseSelect) {
        const match = Array.from(DOM.regCourseSelect.options).find(opt => opt.value === crn);
        if (match) {
          DOM.regCourseSelect.value = crn;
          clearFieldErrors(DOM.regCourseSelect);
        }
      }
    });
  }

  /* ==========================================================================
     7. Registered Courses Data Table Rendering
     ========================================================================== */

  function renderRegisteredCoursesTable() {
    if (!DOM.registeredCoursesTbody) return;

    const totalUnits = getTotalEnrolledUnits();
    const count = state.registeredCourses.length;

    // Update summary pills & counters
    if (DOM.tfootTotalUnits) DOM.tfootTotalUnits.textContent = totalUnits.toFixed(1);
    if (DOM.regTotalUnits) DOM.regTotalUnits.textContent = totalUnits.toFixed(1);
    if (DOM.navRegisteredCount) {
      DOM.navRegisteredCount.textContent = count;
      DOM.navRegisteredCount.setAttribute('aria-label', `${count} courses registered`);
    }
    if (DOM.headerQuickCredits) DOM.headerQuickCredits.textContent = totalUnits.toFixed(0);
    if (DOM.headerQuickCount) DOM.headerQuickCount.textContent = count;
    if (DOM.tableCoursesCountBadge) DOM.tableCoursesCountBadge.textContent = `${count} Classes`;
    if (DOM.homeStatCourses) DOM.homeStatCourses.textContent = count;
    if (DOM.homeStatCredits) DOM.homeStatCredits.textContent = totalUnits.toFixed(1);

    if (count === 0) {
      DOM.registeredCoursesTbody.innerHTML = '';
      if (DOM.tableEmptyState) DOM.tableEmptyState.classList.remove('d-none');
      return;
    } else {
      if (DOM.tableEmptyState) DOM.tableEmptyState.classList.add('d-none');
    }

    DOM.registeredCoursesTbody.innerHTML = state.registeredCourses.map(reg => {
      const course = COURSE_DATABASE.find(c => c.crn === reg.crn);
      if (!course) return '';

      return `
        <tr>
          <td class="font-mono"><strong>${course.crn}</strong></td>
          <td><span class="badge badge-primary font-bold">${course.code}</span></td>
          <td><strong>${course.title}</strong></td>
          <td class="text-center font-bold">${course.units.toFixed(1)}</td>
          <td>${course.schedule}<br><span class="text-muted font-bold">${course.location}</span></td>
          <td>${course.instructor}</td>
          <td>${reg.gradingOption}</td>
          <td><span class="badge badge-success">Enrolled</span></td>
          <td class="text-right">
            <button type="button" 
                    class="btn btn-sm btn-danger btn-drop-course" 
                    data-crn="${course.crn}"
                    aria-label="Drop ${course.code}: ${course.title} from Fall 2026 schedule">
              Drop
            </button>
          </td>
        </tr>
      `;
    }).join('');

    populateRegistrationCourseDropdown();
  }

  /* ==========================================================================
     8. Form Validation & Error Handling (WCAG 2.2 AA)
     ========================================================================== */

  function clearFieldErrors(field) {
    if (!field) return;
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
    const errContainer = document.getElementById(`err-${field.id}`);
    if (errContainer) {
      errContainer.textContent = '';
      field.removeAttribute('aria-describedby');
    }
  }

  function setFieldError(field, errorMessage) {
    if (!field) return;
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    const errContainer = document.getElementById(`err-${field.id}`);
    if (errContainer) {
      errContainer.textContent = errorMessage;
      field.setAttribute('aria-describedby', `err-${field.id}`);
    }
  }

  function validateRegistrationForm() {
    const errors = [];
    const crn = DOM.regCrnInput.value.trim();
    const prereqChecked = DOM.regPrereqCheck.checked;

    // Clear previous errors
    clearFieldErrors(DOM.regCrnInput);
    clearFieldErrors(DOM.regCourseSelect);
    clearFieldErrors(DOM.regPrereqCheck);
    DOM.regErrorSummary.classList.add('d-none');
    DOM.errorSummaryList.innerHTML = '';

    // Validate CRN
    if (!crn) {
      errors.push({ field: DOM.regCrnInput, message: 'Please enter a 5-digit Course Reference Number (CRN).' });
    } else if (!/^\d{5}$/.test(crn)) {
      errors.push({ field: DOM.regCrnInput, message: 'CRN must be exactly 5 numeric digits.' });
    } else {
      const course = COURSE_DATABASE.find(c => c.crn === crn);
      if (!course) {
        errors.push({ field: DOM.regCrnInput, message: `CRN ${crn} was not found in the course catalog. Please check the catalog.` });
      } else if (isCourseRegistered(crn)) {
        errors.push({ field: DOM.regCrnInput, message: `You are already registered for ${course.code}: ${course.title}.` });
      } else {
        const potentialUnits = getTotalEnrolledUnits() + course.units;
        if (potentialUnits > 19.0) {
          errors.push({ field: DOM.regCrnInput, message: `Registration would exceed the maximum limit of 19.0 units (current: ${getTotalEnrolledUnits()} + course: ${course.units} = ${potentialUnits} units). An advisor petition is required.` });
        }
      }
    }

    // Validate Prerequisites
    if (!prereqChecked) {
      errors.push({ field: DOM.regPrereqCheck, message: 'You must acknowledge having satisfied prerequisite requirements before registering.' });
    }

    // Display Error Summary Box if errors exist
    if (errors.length > 0) {
      DOM.regErrorSummary.classList.remove('d-none');
      errors.forEach(err => {
        setFieldError(err.field, err.message);
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${err.field.id}`;
        link.textContent = err.message;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          err.field.focus();
        });
        li.appendChild(link);
        DOM.errorSummaryList.appendChild(li);
      });

      DOM.regErrorSummary.focus();
      announce(`Form has ${errors.length} validation error${errors.length > 1 ? 's' : ''}. Please review the summary above.`);
      return false;
    }

    return true;
  }

  /* ==========================================================================
     9. Accessible Modals & Focus Trap
     ========================================================================== */

  function trapFocus(modalElement, event) {
    if (event.key !== 'Tab') return;
    const focusable = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    }
  }

  function openConfirmationModal(actionType, course, gradingOption = 'Letter Grade', triggerElement = null) {
    state.lastFocusedElement = triggerElement || document.activeElement;
    state.pendingAction = { actionType, course, gradingOption };

    if (actionType === 'register') {
      DOM.confirmModalTitle.textContent = 'Confirm Course Registration';
      DOM.confirmModalDesc.textContent = `Please verify the details below before completing enrollment for this class.`;
      DOM.modalIconContainer.textContent = '📝';
      DOM.btnModalAction.textContent = 'Confirm & Register';
      DOM.btnModalAction.className = 'btn btn-primary';

      DOM.modalCourseDetails.innerHTML = `
        <h3 class="modal-course-title">${course.code}: ${course.title}</h3>
        <div class="modal-details-grid">
          <div><strong>CRN:</strong> ${course.crn}</div>
          <div><strong>Units:</strong> ${course.units.toFixed(1)} Units</div>
          <div><strong>Instructor:</strong> ${course.instructor}</div>
          <div><strong>Grading:</strong> ${gradingOption}</div>
          <div><strong>Schedule:</strong> ${course.schedule}</div>
          <div><strong>Location:</strong> ${course.location}</div>
        </div>
      `;

      DOM.modalWarningNote.classList.add('d-none');
    } else if (actionType === 'drop') {
      DOM.confirmModalTitle.textContent = 'Confirm Drop Course';
      DOM.confirmModalDesc.textContent = `Are you sure you want to drop this course from your Fall 2026 schedule?`;
      DOM.modalIconContainer.textContent = '⚠️';
      DOM.btnModalAction.textContent = 'Yes, Drop Course';
      DOM.btnModalAction.className = 'btn btn-danger';

      const remainingUnits = getTotalEnrolledUnits() - course.units;
      const isDroppingBelowFullTime = remainingUnits < 12.0;

      DOM.modalCourseDetails.innerHTML = `
        <h3 class="modal-course-title">${course.code}: ${course.title}</h3>
        <div class="modal-details-grid">
          <div><strong>CRN:</strong> ${course.crn}</div>
          <div><strong>Units:</strong> ${course.units.toFixed(1)} Units</div>
          <div><strong>Instructor:</strong> ${course.instructor}</div>
          <div><strong>Enrolled Units After Drop:</strong> ${remainingUnits.toFixed(1)} Units</div>
        </div>
      `;

      if (isDroppingBelowFullTime) {
        DOM.modalWarningNote.classList.remove('d-none');
        DOM.modalWarningNote.innerHTML = `
          <strong>Important Warning:</strong> Dropping this course will reduce your enrollment to 
          <strong>${remainingUnits.toFixed(1)} units</strong>, which is below the 12.0 units required for 
          <strong>Full-Time Undergraduate Status</strong>. This may impact your financial aid eligibility, visa status, or campus housing.
        `;
      } else {
        DOM.modalWarningNote.classList.add('d-none');
      }
    }

    if (typeof DOM.confirmModal.showModal === 'function') {
      DOM.confirmModal.showModal();
    } else {
      DOM.confirmModal.setAttribute('open', 'true');
    }

    DOM.btnModalCancel.focus();
    announce(`${DOM.confirmModalTitle.textContent} dialog opened.`);
  }

  function closeConfirmationModal() {
    if (typeof DOM.confirmModal.close === 'function') {
      DOM.confirmModal.close();
    } else {
      DOM.confirmModal.removeAttribute('open');
    }

    if (state.lastFocusedElement) {
      state.lastFocusedElement.focus();
      state.lastFocusedElement = null;
    }
    state.pendingAction = null;
  }

  function openDetailsModal(course, triggerElement = null) {
    state.lastFocusedElement = triggerElement || document.activeElement;
    DOM.detailsModalTitle.textContent = `${course.code}: ${course.title}`;
    DOM.detailsDeptBadge.textContent = course.deptName;

    const isRegistered = isCourseRegistered(course.crn);
    DOM.btnDetailsRegisterAction.disabled = isRegistered;
    DOM.btnDetailsRegisterAction.textContent = isRegistered ? 'Already Enrolled' : 'Register for This Course';
    DOM.btnDetailsRegisterAction.setAttribute('data-crn', course.crn);

    DOM.detailsModalBody.innerHTML = `
      <div class="syllabus-section">
        <h3 class="syllabus-heading"><span aria-hidden="true">📌</span> Course Overview</h3>
        <p>${course.description}</p>
      </div>

      <div class="syllabus-section">
        <h3 class="syllabus-heading"><span aria-hidden="true">📋</span> Course Specifications</h3>
        <div class="modal-details-grid">
          <div><strong>CRN:</strong> ${course.crn}</div>
          <div><strong>Units:</strong> ${course.units.toFixed(1)} Units</div>
          <div><strong>Academic Term:</strong> ${course.term}</div>
          <div><strong>Delivery Format:</strong> ${course.mode}</div>
          <div><strong>Schedule:</strong> ${course.schedule}</div>
          <div><strong>Classroom:</strong> ${course.location}</div>
          <div><strong>Instructor:</strong> ${course.instructor}</div>
          <div><strong>Prerequisites:</strong> ${course.prereqs}</div>
        </div>
      </div>

      <div class="syllabus-section">
        <h3 class="syllabus-heading"><span aria-hidden="true">📚</span> Key Syllabus Topics</h3>
        <ul class="syllabus-list">
          ${course.syllabus.map(topic => `<li>${topic}</li>`).join('')}
        </ul>
      </div>

      <div class="syllabus-section">
        <h3 class="syllabus-heading"><span aria-hidden="true">📖</span> Required Textbook</h3>
        <p class="mb-0"><em>${course.textbook}</em></p>
      </div>
    `;

    if (typeof DOM.detailsModal.showModal === 'function') {
      DOM.detailsModal.showModal();
    } else {
      DOM.detailsModal.setAttribute('open', 'true');
    }

    DOM.btnDetailsDismiss.focus();
    announce(`Course details dialog opened for ${course.code}`);
  }

  function closeDetailsModal() {
    if (typeof DOM.detailsModal.close === 'function') {
      DOM.detailsModal.close();
    } else {
      DOM.detailsModal.removeAttribute('open');
    }

    if (state.lastFocusedElement) {
      state.lastFocusedElement.focus();
      state.lastFocusedElement = null;
    }
  }

  // Handle modal keyboard focus trap & Escape key
  [DOM.confirmModal, DOM.detailsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (modal === DOM.confirmModal) closeConfirmationModal();
          if (modal === DOM.detailsModal) closeDetailsModal();
        } else {
          trapFocus(modal, e);
        }
      });
    }
  });

  // Modal Cancel / Close Buttons
  if (DOM.btnModalClose) DOM.btnModalClose.addEventListener('click', closeConfirmationModal);
  if (DOM.btnModalCancel) DOM.btnModalCancel.addEventListener('click', closeConfirmationModal);
  if (DOM.btnDetailsClose) DOM.btnDetailsClose.addEventListener('click', closeDetailsModal);
  if (DOM.btnDetailsDismiss) DOM.btnDetailsDismiss.addEventListener('click', closeDetailsModal);

  // Execute Action on Confirm
  if (DOM.btnModalAction) {
    DOM.btnModalAction.addEventListener('click', () => {
      if (!state.pendingAction) return;
      const { actionType, course, gradingOption } = state.pendingAction;

      if (actionType === 'register') {
        state.registeredCourses.push({
          crn: course.crn,
          gradingOption: gradingOption || 'Letter Grade',
          enrolledDate: new Date().toISOString().split('T')[0],
          status: 'Enrolled'
        });

        renderRegisteredCoursesTable();
        renderCatalog();

        DOM.regSuccessAlert.classList.remove('d-none');
        DOM.regSuccessTitle.textContent = `Registration Confirmed: ${course.code}`;
        DOM.regSuccessMsg.textContent = `${course.code}: ${course.title} has been successfully added to your Fall 2026 schedule with ${gradingOption}.`;
        
        // Reset registration form
        DOM.regForm.reset();
        populateRegistrationCourseDropdown();

        announce(`Successfully registered for ${course.code}: ${course.title}`);
      } else if (actionType === 'drop') {
        state.registeredCourses = state.registeredCourses.filter(r => r.crn !== course.crn);
        renderRegisteredCoursesTable();
        renderCatalog();
        announce(`Successfully dropped ${course.code}: ${course.title} from your schedule.`);
      }

      closeConfirmationModal();
    });
  }

  // Register directly from details modal
  if (DOM.btnDetailsRegisterAction) {
    DOM.btnDetailsRegisterAction.addEventListener('click', (e) => {
      const crn = e.target.getAttribute('data-crn');
      const course = COURSE_DATABASE.find(c => c.crn === crn);
      closeDetailsModal();
      if (course) {
        openConfirmationModal('register', course, 'Letter Grade', e.target);
      }
    });
  }

  /* ==========================================================================
     10. Event Listeners for Registration Form & Actions
     ========================================================================== */

  // Registration Form Submission
  if (DOM.regForm) {
    DOM.regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateRegistrationForm()) {
        const crn = DOM.regCrnInput.value.trim();
        const course = COURSE_DATABASE.find(c => c.crn === crn);
        const gradingRadio = DOM.regForm.querySelector('input[name="gradingOption"]:checked');
        const gradingOption = gradingRadio ? gradingRadio.value : 'Letter Grade';
        
        openConfirmationModal('register', course, gradingOption, document.getElementById('btn-submit-registration'));
      }
    });

    DOM.regForm.addEventListener('reset', () => {
      setTimeout(() => {
        clearFieldErrors(DOM.regCrnInput);
        clearFieldErrors(DOM.regCourseSelect);
        clearFieldErrors(DOM.regPrereqCheck);
        DOM.regErrorSummary.classList.add('d-none');
        DOM.regSuccessAlert.classList.add('d-none');
        announce('Registration form cleared.');
      }, 10);
    });
  }

  // Global delegation for Details, Quick Register, and Drop buttons
  document.addEventListener('click', (e) => {
    // Drop course button
    const dropBtn = e.target.closest('.btn-drop-course');
    if (dropBtn) {
      const crn = dropBtn.getAttribute('data-crn');
      const course = COURSE_DATABASE.find(c => c.crn === crn);
      if (course) {
        openConfirmationModal('drop', course, 'Letter Grade', dropBtn);
      }
      return;
    }

    // View Details button
    const detailsBtn = e.target.closest('.btn-card-details, .btn-details');
    if (detailsBtn) {
      const crn = detailsBtn.getAttribute('data-crn');
      const course = COURSE_DATABASE.find(c => c.crn === crn);
      if (course) {
        openDetailsModal(course, detailsBtn);
      }
      return;
    }

    // Quick Register button from Card
    const quickRegBtn = e.target.closest('.btn-card-register, .btn-quick-reg');
    if (quickRegBtn) {
      const crn = quickRegBtn.getAttribute('data-crn');
      const course = COURSE_DATABASE.find(c => c.crn === crn);
      if (course) {
        if (isCourseRegistered(crn)) {
          announce(`You are already enrolled in ${course.code}.`);
          return;
        }
        openConfirmationModal('register', course, 'Letter Grade', quickRegBtn);
      }
      return;
    }
  });

  // Profile preferences form submission
  if (DOM.profileForm) {
    DOM.profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (DOM.profileStatusMsg) {
        DOM.profileStatusMsg.classList.remove('d-none');
        DOM.profileStatusMsg.focus();
      }
      announce('Student preferences saved successfully.');
    });
  }

  /* ==========================================================================
     11. Application Initialization
     ========================================================================== */

  function init() {
    renderRegisteredCoursesTable();
    populateRegistrationCourseDropdown();
    renderCatalog();

    // Route according to initial hash or default to home
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'catalog', 'registration', 'profile'].includes(hash)) {
      navigateTo(hash, false);
    } else {
      navigateTo('home', false);
    }

    announce('Apex University Course Registration Portal loaded and ready.');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
