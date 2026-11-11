/**
 * Apex University Course Registration System
 * WCAG 2.2 Level AA Accessible Client-Side Application
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DATA STATE: Catalog Courses & Registered Schedule
  // =========================================================================

  const COURSES_DATA = [
    {
      id: 'cse-216',
      crn: '84910',
      code: 'CSE 216',
      title: 'Computer Systems Security',
      dept: 'CSE',
      level: 'GRAD',
      units: 4,
      instructor: 'Prof. Stefan Savage',
      email: 'savage@apex.edu',
      schedule: 'MWF 10:00 AM – 10:50 AM',
      location: 'Center Hall 101',
      mode: 'In-Person',
      capacity: 50,
      enrolled: 42,
      waitlist: 0,
      prerequisites: 'CSE 221 (Operating Systems) or equivalent graduate systems course.',
      description: 'Comprehensive analysis of systems security, software vulnerabilities, memory corruption defense, hardware enclave isolation, and applied cryptography principles.',
      topics: [
        'Memory Safety & Control Flow Integrity (CFI)',
        'Operating System Access Controls & Sandboxing',
        'Side-Channel Attacks & Hardware Mitigations',
        'Network Protocol Vulnerabilities & TLS 1.3',
        'Secure Multi-Party Computation & Zero-Knowledge'
      ]
    },
    {
      id: 'dsc-100',
      crn: '91204',
      code: 'DSC 100',
      title: 'Introduction to Data Management',
      dept: 'DSC',
      level: 'UPPER',
      units: 4,
      instructor: 'Prof. Shannon Ellis',
      email: 'sellis@apex.edu',
      schedule: 'MWF 1:00 PM – 1:50 PM',
      location: 'Mandeville Auditorium',
      mode: 'Hybrid',
      capacity: 120,
      enrolled: 108,
      waitlist: 0,
      prerequisites: 'DSC 80 or CSE 12 (Data Structures) and discrete mathematics.',
      description: 'Design and implementation of relational databases, relational algebra, SQL optimization, distributed database architectures, schema normal forms, and NoSQL engines.',
      topics: [
        'Relational Algebra & Formal Query Languages',
        'Advanced SQL, Joins, and Window Functions',
        'B+ Trees, Hashing, and Index Storage Engines',
        'Transaction Isolation, ACID, and Two-Phase Locking',
        'Distributed Data Systems & Spark Integration'
      ]
    },
    {
      id: 'cse-221',
      crn: '85322',
      code: 'CSE 221',
      title: 'Operating Systems Principles',
      dept: 'CSE',
      level: 'GRAD',
      units: 4,
      instructor: 'Prof. Geoff Voelker',
      email: 'voelker@apex.edu',
      schedule: 'TuTh 2:00 PM – 3:20 PM',
      location: 'Warren Lecture Hall 2005',
      mode: 'In-Person',
      capacity: 60,
      enrolled: 56,
      waitlist: 0,
      prerequisites: 'Undergraduate operating systems (CSE 120) and systems programming proficiency.',
      description: 'Classic and modern operating system designs, virtual memory paging, process scheduling, multi-core synchronization primitives, and hypervisors.',
      topics: [
        'Microkernel vs. Monolithic Kernels',
        'Concurrency Primitives & Lock-Free Structures',
        'Virtual Memory Architectures & Translation',
        'File Systems & Crash Consistency (JFS, ZFS)',
        'Virtualization, Hypervisors, and Containers'
      ]
    },
    {
      id: 'dsc-180a',
      crn: '93411',
      code: 'DSC 180A',
      title: 'Data Science Capstone Project I',
      dept: 'DSC',
      level: 'UPPER',
      units: 4,
      instructor: 'Prof. Justin Eldridge',
      email: 'eldridge@apex.edu',
      schedule: 'TuTh 9:30 AM – 10:50 AM',
      location: 'Cognitive Science 180',
      mode: 'In-Person',
      capacity: 40,
      enrolled: 38,
      waitlist: 0,
      prerequisites: 'DSC 102 and senior standing in Data Science major.',
      description: 'First half of senior capstone sequence. Project methodology, reproducible pipelines, ethical considerations, and domain exploration with industry datasets.',
      topics: [
        'Reproducible Science & Docker Pipelines',
        'Exploratory Data Analysis at Scale',
        'Model Validation & Bias Detection',
        'Technical Communication & Scientific Writing'
      ]
    },
    {
      id: 'math-180a',
      crn: '77219',
      code: 'MATH 180A',
      title: 'Introduction to Probability',
      dept: 'MATH',
      level: 'UPPER',
      units: 4,
      instructor: 'Prof. Jason Schweinsberg',
      email: 'jschwein@apex.edu',
      schedule: 'MWF 11:00 AM – 11:50 AM',
      location: 'Applied Physics 212',
      mode: 'In-Person',
      capacity: 150,
      enrolled: 150,
      waitlist: 12,
      prerequisites: 'MATH 20C or MATH 31BH with grade of C- or better.',
      description: 'Axioms of probability, conditional probability, discrete and continuous random variables, joint distributions, expectation, variance, and Central Limit Theorem.',
      topics: [
        'Sample Spaces & Combinatorial Probability',
        'Random Variables & Probability Density Functions',
        'Markov and Chebyshev Inequalities',
        'Law of Large Numbers & Central Limit Theorem'
      ]
    },
    {
      id: 'math-20c',
      crn: '76802',
      code: 'MATH 20C',
      title: 'Calculus & Analytic Geometry',
      dept: 'MATH',
      level: 'LOWER',
      units: 4,
      instructor: 'Prof. Laura Stevens',
      email: 'lstevens@apex.edu',
      schedule: 'MWF 9:00 AM – 9:50 AM',
      location: 'Peterson Hall 108',
      mode: 'In-Person',
      capacity: 200,
      enrolled: 165,
      waitlist: 0,
      prerequisites: 'MATH 20B with grade of C- or higher.',
      description: 'Vector calculus in three dimensions, partial derivatives, directional derivatives, tangent planes, Lagrange multipliers, multiple integrals, and polar coordinates.',
      topics: [
        'Vectors, Dot Products, and Cross Products',
        'Lines, Planes, and Quadric Surfaces',
        'Partial Derivatives & Chain Rule',
        'Optimization & Lagrange Multipliers',
        'Double and Triple Integrals in Cylindrical & Spherical'
      ]
    },
    {
      id: 'cogs-108',
      crn: '65430',
      code: 'COGS 108',
      title: 'Data Science in Practice',
      dept: 'COGS',
      level: 'LOWER',
      units: 4,
      instructor: 'Prof. Bradley Voytek',
      email: 'bvoytek@apex.edu',
      schedule: 'TuTh 11:00 AM – 12:20 PM',
      location: 'Online / Remote Zoom',
      mode: 'Online',
      capacity: 250,
      enrolled: 220,
      waitlist: 0,
      prerequisites: 'COGS 18 or BILD 62 or CSE 8A or equivalent programming experience.',
      description: 'Hands-on data collection, cleaning, visualization, statistical modeling, and machine learning pipelines applied to real-world behavioral and social questions.',
      topics: [
        'Pandas, NumPy, and Scikit-Learn Ecosystem',
        'Web Scraping & Public API Integration',
        'Data Cleaning, Imputation, and Normalization',
        'Supervised vs. Unsupervised Machine Learning'
      ]
    },
    {
      id: 'cogs-220',
      crn: '68912',
      code: 'COGS 220',
      title: 'Information Visualization & Human-AI',
      dept: 'COGS',
      level: 'GRAD',
      units: 4,
      instructor: 'Prof. Philip Guo',
      email: 'pg@apex.edu',
      schedule: 'Wed 3:00 PM – 5:50 PM',
      location: 'Design Lab Studio 102',
      mode: 'In-Person',
      capacity: 25,
      enrolled: 21,
      waitlist: 0,
      prerequisites: 'Graduate standing in Computer Science, Cognitive Science, or Design.',
      description: 'Foundations of visual perception, graphical representation of complex data, interactive exploratory tools, visual debugging of neural networks, and user study methods.',
      topics: [
        'Graphical Marks, Channels, and Perception Theory',
        'D3.js and Observable Interactive Visualizations',
        'Visual Analytics for Deep Learning Explainability',
        'Empirical User Study Evaluation Methodologies'
      ]
    },
    {
      id: 'ece-143',
      crn: '54201',
      code: 'ECE 143',
      title: 'Programming for Data Analysis',
      dept: 'ECE',
      level: 'UPPER',
      units: 4,
      instructor: 'Prof. Alon Orlitsky',
      email: 'aorlitsky@apex.edu',
      schedule: 'TuTh 3:30 PM – 4:50 PM',
      location: 'Jacobs Hall 2315',
      mode: 'In-Person',
      capacity: 80,
      enrolled: 68,
      waitlist: 0,
      prerequisites: 'Basic programming skills in C or Python.',
      description: 'High-performance Python programming, memory profiling, vectorization with NumPy, multi-processing, asynchronous I/O, and data pipeline benchmarking.',
      topics: [
        'Python Memory Model, Cython, and C-Extensions',
        'Parallel Processing and Multi-threading GIL',
        'Vectorization Benchmarks & Memory Profiling',
        'Data Pipelines for Signal Processing'
      ]
    },
    {
      id: 'ece-250',
      crn: '59124',
      code: 'ECE 250',
      title: 'Random Processes & Signal Detection',
      dept: 'ECE',
      level: 'GRAD',
      units: 4,
      instructor: 'Prof. Tara Javidi',
      email: 'tjavidi@apex.edu',
      schedule: 'MW 2:00 PM – 3:20 PM',
      location: 'EBU1 Room 4307',
      mode: 'In-Person',
      capacity: 45,
      enrolled: 27,
      waitlist: 0,
      prerequisites: 'ECE 153 or graduate level probability fundamentals.',
      description: 'Discrete and continuous time random processes, stationarity, ergodicity, power spectral density, Wiener and Kalman filtering, and statistical decision theory.',
      topics: [
        'Wide-Sense Stationary (WSS) Stochastic Processes',
        'Linear Systems with Random Inputs',
        'Optimal Estimation & Kalman Filtering',
        'Hypothesis Testing & Neyman-Pearson Lemma'
      ]
    }
  ];

  // Current registered courses for student Alex Rivera (Initial state: CSE 216 and DSC 100)
  let registeredCourses = [
    {
      courseId: 'cse-216',
      crn: '84910',
      code: 'CSE 216',
      title: 'Computer Systems Security',
      units: 4,
      schedule: 'MWF 10:00 AM – 10:50 AM',
      location: 'Center Hall 101',
      instructor: 'Prof. Stefan Savage',
      gradeMode: 'Letter Grade',
      status: 'Enrolled'
    },
    {
      courseId: 'dsc-100',
      crn: '91204',
      code: 'DSC 100',
      title: 'Introduction to Data Management',
      units: 4,
      schedule: 'MWF 1:00 PM – 1:50 PM',
      location: 'Mandeville Auditorium',
      instructor: 'Prof. Shannon Ellis',
      gradeMode: 'Letter Grade',
      status: 'Enrolled'
    }
  ];

  const MAX_PERMITTED_UNITS = 18;

  // Track trigger element when opening modals for WCAG focus restoration
  let lastFocusedTrigger = null;
  // Pending actions
  let pendingCourseRegistration = null;
  let pendingCourseDrop = null;

  // =========================================================================
  // 2. DOM ELEMENT REFERENCES
  // =========================================================================

  const DOM = {
    // Nav & Announcer
    navLinks: document.querySelectorAll('.nav-link'),
    mobileNavToggle: document.getElementById('mobile-nav-toggle'),
    primaryNav: document.getElementById('primary-navigation'),
    pageViews: document.querySelectorAll('.page-view'),
    liveStatus: document.getElementById('aria-live-status'),
    liveAlert: document.getElementById('aria-live-alert'),
    navBadge: document.getElementById('nav-reg-badge'),
    toastContainer: document.getElementById('toast-container'),

    // Home view elements
    homeEnrolledUnits: document.getElementById('home-enrolled-units'),
    homeEnrolledCourses: document.getElementById('home-enrolled-courses'),

    // Catalog elements
    courseSearchInput: document.getElementById('course-search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    filterDept: document.getElementById('filter-department'),
    filterLevel: document.getElementById('filter-level'),
    filterMode: document.getElementById('filter-mode'),
    filterAvailability: document.getElementById('filter-availability'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),
    catalogResultsCount: document.getElementById('catalog-results-count'),
    courseCardsContainer: document.getElementById('course-cards-container'),
    catalogEmptyState: document.getElementById('catalog-empty-state'),

    // Registration page elements
    progressEnrolledUnits: document.getElementById('progress-enrolled-units'),
    progressMaxUnits: document.getElementById('progress-max-units'),
    unitsProgressBar: document.getElementById('units-progress-bar'),
    unitsProgressFill: document.getElementById('units-progress-fill'),
    unitsProgressPercent: document.getElementById('units-progress-percent'),
    directRegForm: document.getElementById('direct-registration-form'),
    regCourseSelect: document.getElementById('reg-course-select'),
    regTermSelect: document.getElementById('reg-term-select'),
    regGradeModeSelect: document.getElementById('reg-grade-mode-select'),
    regPrereqConfirm: document.getElementById('reg-prereq-confirm'),
    regPolicyConfirm: document.getElementById('reg-policy-confirm'),
    prereqConfirmError: document.getElementById('prereq-confirm-error'),
    policyConfirmError: document.getElementById('policy-confirm-error'),
    regFormErrorAlert: document.getElementById('reg-form-error-alert'),
    regErrorList: document.getElementById('reg-error-list'),
    resetRegFormBtn: document.getElementById('reset-reg-form-btn'),

    // Registered courses table
    registeredCoursesTable: document.getElementById('registered-courses-table'),
    registeredTableBody: document.getElementById('registered-table-body'),
    tableTotalUnits: document.getElementById('table-total-units'),
    registeredEmptyState: document.getElementById('registered-empty-state'),

    // Modals
    regModal: document.getElementById('registration-confirm-modal'),
    regModalCloseX: document.getElementById('reg-modal-close-x'),
    regModalCancelBtn: document.getElementById('reg-modal-cancel-btn'),
    regModalConfirmBtn: document.getElementById('reg-modal-confirm-btn'),
    regModalCourseDetails: document.getElementById('reg-modal-course-details'),

    dropModal: document.getElementById('drop-confirm-modal'),
    dropModalCloseX: document.getElementById('drop-modal-close-x'),
    dropModalCancelBtn: document.getElementById('drop-modal-cancel-btn'),
    dropModalConfirmBtn: document.getElementById('drop-modal-confirm-btn'),
    dropModalCourseDetails: document.getElementById('drop-modal-course-details'),

    detailsModal: document.getElementById('details-modal'),
    detailsModalCloseX: document.getElementById('details-modal-close-x'),
    detailsModalCloseBtn: document.getElementById('details-modal-close-btn'),
    detailsModalRegisterAction: document.getElementById('details-modal-register-action'),
    detailsModalBody: document.getElementById('details-modal-body'),
    detailsModalTitle: document.getElementById('details-modal-title')
  };

  // =========================================================================
  // 3. UTILITY & ACCESSIBILITY FUNCTIONS
  // =========================================================================

  /**
   * Announce message to assistive technology via polite aria-live region
   */
  function announceLive(message) {
    if (DOM.liveStatus) {
      DOM.liveStatus.textContent = '';
      setTimeout(() => {
        DOM.liveStatus.textContent = message;
      }, 50);
    }
  }

  /**
   * Announce high-priority assertive message
   */
  function announceAlert(message) {
    if (DOM.liveAlert) {
      DOM.liveAlert.textContent = '';
      setTimeout(() => {
        DOM.liveAlert.textContent = message;
      }, 50);
    }
  }

  /**
   * Calculate total registered units
   */
  function getTotalRegisteredUnits() {
    return registeredCourses.reduce((sum, item) => sum + item.units, 0);
  }

  /**
   * Check if a course is currently registered
   */
  function isCourseRegistered(courseCode) {
    return registeredCourses.some(item => item.code.toUpperCase() === courseCode.toUpperCase());
  }

  /**
   * Accessible Toast Notification
   */
  function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.setAttribute('role', 'status');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#be123c" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4338ca" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `
      <div style="flex-shrink:0;margin-top:2px;">${iconSvg}</div>
      <div class="toast-body">
        <h4 class="toast-title">${escapeHtml(title)}</h4>
        <p class="toast-message">${escapeHtml(message)}</p>
      </div>
      <button type="button" class="toast-close-btn" aria-label="Dismiss message">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    DOM.toastContainer.appendChild(toast);
    announceLive(`${title}: ${message}`);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 4500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    });
  }

  // =========================================================================
  // 4. NAVIGATION & VIEW CONTROLLER
  // =========================================================================

  function navigateTo(pageId, updateHistory = true) {
    const validPages = ['home', 'catalog', 'registration', 'profile'];
    if (!validPages.includes(pageId)) {
      pageId = 'home';
    }

    // Toggle pages
    DOM.pageViews.forEach(view => {
      if (view.id === `page-${pageId}`) {
        view.removeAttribute('hidden');
        view.classList.add('active');
      } else {
        view.setAttribute('hidden', '');
        view.classList.remove('active');
      }
    });

    // Update Nav links
    DOM.navLinks.forEach(link => {
      const targetPage = link.getAttribute('data-page');
      if (targetPage === pageId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Close mobile nav if open
    if (DOM.primaryNav.classList.contains('is-open')) {
      toggleMobileNav(false);
    }

    // Update URL hash
    if (updateHistory && window.location.hash !== `#${pageId}`) {
      window.location.hash = `#${pageId}`;
    }

    // Move focus to page's primary heading for screen reader context
    const activeSection = document.getElementById(`page-${pageId}`);
    if (activeSection) {
      const heading = activeSection.querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    }

    // Announce view change
    const pageTitles = {
      home: 'Home portal',
      catalog: 'Course Catalog and Search',
      registration: 'Course Registration and Schedule',
      profile: 'Student Profile and Academic Record'
    };
    announceLive(`Navigated to ${pageTitles[pageId] || pageId}`);
  }

  function toggleMobileNav(forceState) {
    const isOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !DOM.primaryNav.classList.contains('is-open');

    if (isOpen) {
      DOM.primaryNav.classList.add('is-open');
      DOM.mobileNavToggle.setAttribute('aria-expanded', 'true');
    } else {
      DOM.primaryNav.classList.remove('is-open');
      DOM.mobileNavToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // =========================================================================
  // 5. MODAL DIALOG CONTROLLER (WCAG 2.2 AA Focus Trap & Keyboard Handling)
  // =========================================================================

  function openAccessibleModal(dialogElement, triggerElement) {
    if (!dialogElement) return;
    lastFocusedTrigger = triggerElement || document.activeElement;

    if (typeof dialogElement.showModal === 'function') {
      dialogElement.showModal();
    } else {
      dialogElement.setAttribute('open', '');
    }

    // Trap focus inside modal
    setupFocusTrap(dialogElement);

    // Focus the first actionable button or close button
    const firstFocusable = dialogElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  function closeAccessibleModal(dialogElement) {
    if (!dialogElement) return;

    if (typeof dialogElement.close === 'function') {
      dialogElement.close();
    } else {
      dialogElement.removeAttribute('open');
    }

    // Return focus to the trigger element that opened the modal
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  }

  function setupFocusTrap(dialogElement) {
    const handleKeyDown = function (e) {
      if (!dialogElement.open) {
        dialogElement.removeEventListener('keydown', handleKeyDown);
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeAccessibleModal(dialogElement);
        return;
      }

      if (e.key === 'Tab') {
        const focusables = dialogElement.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

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
    };

    dialogElement.addEventListener('keydown', handleKeyDown);
  }

  // =========================================================================
  // 6. COURSE CATALOG RENDERING & FILTERING
  // =========================================================================

  function renderCatalog() {
    const searchTerm = (DOM.courseSearchInput.value || '').trim().toLowerCase();
    const selectedDept = DOM.filterDept.value;
    const selectedLevel = DOM.filterLevel.value;
    const selectedMode = DOM.filterMode.value;
    const selectedAvailability = DOM.filterAvailability.value;

    // Show/hide search clear button
    if (DOM.clearSearchBtn) {
      DOM.clearSearchBtn.hidden = searchTerm.length === 0;
    }

    // Filter logic
    const filteredCourses = COURSES_DATA.filter(course => {
      // Keyword match
      if (searchTerm) {
        const matchCode = course.code.toLowerCase().includes(searchTerm);
        const matchTitle = course.title.toLowerCase().includes(searchTerm);
        const matchInstructor = course.instructor.toLowerCase().includes(searchTerm);
        const matchDesc = course.description.toLowerCase().includes(searchTerm);
        const matchCrn = course.crn.includes(searchTerm);
        if (!matchCode && !matchTitle && !matchInstructor && !matchDesc && !matchCrn) {
          return false;
        }
      }

      // Department filter
      if (selectedDept !== 'ALL' && course.dept !== selectedDept) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'ALL' && course.level !== selectedLevel) {
        return false;
      }

      // Mode filter
      if (selectedMode !== 'ALL' && course.mode !== selectedMode) {
        return false;
      }

      // Availability filter
      if (selectedAvailability === 'OPEN') {
        const openSeats = course.capacity - course.enrolled;
        if (openSeats <= 0) return false;
      } else if (selectedAvailability === 'WAITLIST') {
        if (course.waitlist === 0 && (course.capacity - course.enrolled > 0)) return false;
      }

      return true;
    });

    // Update results status text
    const totalCount = COURSES_DATA.length;
    const count = filteredCourses.length;
    DOM.catalogResultsCount.textContent = `Showing ${count} of ${totalCount} courses`;

    // Render cards
    DOM.courseCardsContainer.innerHTML = '';

    if (count === 0) {
      DOM.courseCardsContainer.hidden = true;
      DOM.catalogEmptyState.hidden = false;
      return;
    }

    DOM.courseCardsContainer.hidden = false;
    DOM.catalogEmptyState.hidden = true;

    filteredCourses.forEach(course => {
      const card = createCourseCard(course);
      DOM.courseCardsContainer.appendChild(card);
    });
  }

  function createCourseCard(course) {
    const isEnrolled = isCourseRegistered(course.code);
    const openSeats = Math.max(0, course.capacity - course.enrolled);
    const isWaitlistOnly = openSeats === 0;
    const deptClass = `dept-${course.dept.toLowerCase()}`;

    const article = document.createElement('article');
    article.className = `course-card ${deptClass}`;
    article.setAttribute('aria-labelledby', `card-title-${course.id}`);

    // Department Badge color
    let deptBadgeColor = 'badge-indigo';
    if (course.dept === 'DSC') deptBadgeColor = 'badge-teal';
    if (course.dept === 'MATH') deptBadgeColor = 'badge-amber';
    if (course.dept === 'COGS') deptBadgeColor = 'badge-purple';
    if (course.dept === 'ECE') deptBadgeColor = 'badge-cyan';

    const levelText = course.level === 'GRAD' ? 'Graduate' : (course.level === 'UPPER' ? 'Upper Div' : 'Lower Div');

    article.innerHTML = `
      <div class="card-top-meta">
        <span class="course-code-badge">${escapeHtml(course.code)}</span>
        <div style="display:flex;gap:0.4rem;align-items:center;">
          <span class="badge ${deptBadgeColor}">${escapeHtml(course.dept)}</span>
          <span class="badge badge-indigo">${levelText}</span>
          <span class="badge badge-emerald">${course.units} Units</span>
        </div>
      </div>

      <div class="course-card-body">
        <h3 id="card-title-${course.id}" class="course-title">
          ${escapeHtml(course.title)}
        </h3>

        <p class="course-desc-brief">
          ${escapeHtml(course.description)}
        </p>

        <ul class="course-specs-list" role="list">
          <li class="spec-item">
            <span class="spec-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </span>
            <span class="spec-label">Schedule:</span>
            <span>${escapeHtml(course.schedule)}</span>
          </li>
          <li class="spec-item">
            <span class="spec-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <span class="spec-label">Location:</span>
            <span>${escapeHtml(course.location)} (${escapeHtml(course.mode)})</span>
          </li>
          <li class="spec-item">
            <span class="spec-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <span class="spec-label">Instructor:</span>
            <span>${escapeHtml(course.instructor)}</span>
          </li>
          <li class="spec-item">
            <span class="spec-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              </svg>
            </span>
            <span class="spec-label">CRN:</span>
            <span><code>${escapeHtml(course.crn)}</code></span>
          </li>
        </ul>

        <!-- Seats Meter -->
        <div class="seats-availability-box">
          <div class="seats-status-text ${isWaitlistOnly ? 'status-waitlist' : 'status-open'}">
            <span>${isWaitlistOnly ? `Waitlist: ${course.waitlist} Waiting` : `Seats: ${openSeats} of ${course.capacity} Available`}</span>
            <span>${course.enrolled}/${course.capacity} Filled</span>
          </div>
          <div class="seats-meter" role="progressbar" aria-valuenow="${course.enrolled}" aria-valuemin="0" aria-valuemax="${course.capacity}" aria-label="Seats filled for ${course.code}">
            <div class="seats-fill ${isWaitlistOnly ? 'fill-waitlist' : 'fill-open'}" style="width: ${(course.enrolled / course.capacity) * 100}%;"></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="course-card-actions">
          <button 
            type="button" 
            class="btn btn-outline-secondary btn-sm" 
            data-action="details" 
            data-course-id="${course.id}"
            aria-label="View syllabus and details for ${course.code}: ${course.title}"
          >
            Details &amp; Syllabus
          </button>

          ${
            isEnrolled
              ? `<button 
                   type="button" 
                   class="btn btn-teal btn-sm" 
                   disabled 
                   aria-disabled="true" 
                   aria-label="Already registered in ${course.code}"
                 >
                   Enrolled &#10003;
                 </button>`
              : `<button 
                   type="button" 
                   class="btn btn-primary btn-sm" 
                   data-action="quick-register" 
                   data-course-code="${course.code}"
                   aria-label="Register for ${course.code}: ${course.title}"
                 >
                   Register
                 </button>`
          }
        </div>
      </div>
    `;

    // Event listeners
    const detailsBtn = article.querySelector('[data-action="details"]');
    detailsBtn.addEventListener('click', (e) => {
      openCourseDetailsModal(course, e.currentTarget);
    });

    const regBtn = article.querySelector('[data-action="quick-register"]');
    if (regBtn) {
      regBtn.addEventListener('click', (e) => {
        initiateCourseRegistration(course.code, 'Letter Grade', e.currentTarget);
      });
    }

    return article;
  }

  function resetCatalogFilters() {
    DOM.courseSearchInput.value = '';
    DOM.filterDept.value = 'ALL';
    DOM.filterLevel.value = 'ALL';
    DOM.filterMode.value = 'ALL';
    DOM.filterAvailability.value = 'ALL';
    renderCatalog();
    announceLive('Filters reset. Showing all courses.');
  }

  // =========================================================================
  // 7. COURSE DETAILS & SYLLABUS MODAL
  // =========================================================================

  function openCourseDetailsModal(course, triggerBtn) {
    DOM.detailsModalTitle.textContent = `${course.code}: ${course.title}`;

    const isEnrolled = isCourseRegistered(course.code);

    let topicsHtml = course.topics.map(t => `<li>${escapeHtml(t)}</li>`).join('');

    DOM.detailsModalBody.innerHTML = `
      <div class="modal-notice-box notice-info" style="margin-bottom:1.25rem;">
        <h3 class="modal-notice-title">Course Information Overview</h3>
        <p class="modal-notice-text">
          <strong>Term:</strong> Fall 2026 &nbsp;|&nbsp; 
          <strong>Units:</strong> ${course.units} Credit Units &nbsp;|&nbsp; 
          <strong>CRN:</strong> ${course.crn} &nbsp;|&nbsp;
          <strong>Department:</strong> ${course.dept}
        </p>
      </div>

      <div style="margin-bottom:1.25rem;">
        <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.35rem;">Course Description</h3>
        <p style="font-size:0.95rem;color:var(--color-slate-700);line-height:1.5;">${escapeHtml(course.description)}</p>
      </div>

      <div style="margin-bottom:1.25rem;">
        <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.35rem;">Stated Prerequisites</h3>
        <p style="font-size:0.95rem;color:var(--color-slate-700);background:var(--color-slate-100);padding:0.6rem 0.85rem;border-radius:var(--radius-sm);border-left:4px solid var(--color-amber-600);">
          ${escapeHtml(course.prerequisites)}
        </p>
      </div>

      <div style="margin-bottom:1.25rem;">
        <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.35rem;">Key Syllabus Topics</h3>
        <ul style="padding-left:1.5rem;font-size:0.9rem;color:var(--color-slate-700);line-height:1.5;">
          ${topicsHtml}
        </ul>
      </div>

      <div style="margin-bottom:0.5rem;">
        <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.35rem;">Instructor &amp; Meeting Logistics</h3>
        <p style="font-size:0.9rem;color:var(--color-slate-700);">
          <strong>Instructor:</strong> ${escapeHtml(course.instructor)} (<a href="mailto:${course.email}" class="inline-link">${course.email}</a>)<br>
          <strong>Times &amp; Room:</strong> ${escapeHtml(course.schedule)} in ${escapeHtml(course.location)} (${escapeHtml(course.mode)})
        </p>
      </div>
    `;

    // Configure modal register button
    if (isEnrolled) {
      DOM.detailsModalRegisterAction.textContent = 'Already Enrolled';
      DOM.detailsModalRegisterAction.disabled = true;
      DOM.detailsModalRegisterAction.setAttribute('aria-disabled', 'true');
    } else {
      DOM.detailsModalRegisterAction.textContent = 'Register for this Course';
      DOM.detailsModalRegisterAction.disabled = false;
      DOM.detailsModalRegisterAction.removeAttribute('aria-disabled');
      DOM.detailsModalRegisterAction.onclick = () => {
        closeAccessibleModal(DOM.detailsModal);
        initiateCourseRegistration(course.code, 'Letter Grade', triggerBtn);
      };
    }

    openAccessibleModal(DOM.detailsModal, triggerBtn);
  }

  // =========================================================================
  // 8. REGISTRATION FORM CONTROLLER & VALIDATION
  // =========================================================================

  function populateCourseSelectDropdown() {
    DOM.regCourseSelect.innerHTML = '<option value="">-- Choose an available course from catalog --</option>';

    COURSES_DATA.forEach(course => {
      const isEnrolled = isCourseRegistered(course.code);
      const option = document.createElement('option');
      option.value = course.code;
      option.textContent = `${course.code}: ${course.title} (${course.units} Units, CRN: ${course.crn})${isEnrolled ? ' [Already Enrolled]' : ''}`;
      if (isEnrolled) {
        option.disabled = true;
      }
      DOM.regCourseSelect.appendChild(option);
    });
  }

  function handleDirectRegistrationSubmit(e) {
    e.preventDefault();

    const selectedCode = DOM.regCourseSelect.value;
    const gradeMode = DOM.regGradeModeSelect.value;
    const prereqChecked = DOM.regPrereqConfirm.checked;
    const policyChecked = DOM.regPolicyConfirm.checked;

    const errors = [];

    // Course selection check
    if (!selectedCode) {
      errors.push('Please select a course to register from the dropdown menu.');
      DOM.regCourseSelect.setAttribute('aria-invalid', 'true');
    } else {
      DOM.regCourseSelect.removeAttribute('aria-invalid');
    }

    // Duplicate check
    if (selectedCode && isCourseRegistered(selectedCode)) {
      errors.push(`You are already enrolled in ${selectedCode}.`);
      DOM.regCourseSelect.setAttribute('aria-invalid', 'true');
    }

    // Prerequisite checkbox check
    if (!prereqChecked) {
      errors.push('You must confirm that you meet course prerequisites.');
      DOM.regPrereqConfirm.setAttribute('aria-invalid', 'true');
      DOM.prereqConfirmError.hidden = false;
    } else {
      DOM.regPrereqConfirm.removeAttribute('aria-invalid');
      DOM.prereqConfirmError.hidden = true;
    }

    // Policy checkbox check
    if (!policyChecked) {
      errors.push('You must agree to university academic and refund policies.');
      DOM.regPolicyConfirm.setAttribute('aria-invalid', 'true');
      DOM.policyConfirmError.hidden = false;
    } else {
      DOM.regPolicyConfirm.removeAttribute('aria-invalid');
      DOM.policyConfirmError.hidden = true;
    }

    // Credit limit check
    if (selectedCode && !isCourseRegistered(selectedCode)) {
      const courseObj = COURSES_DATA.find(c => c.code.toUpperCase() === selectedCode.toUpperCase());
      const newTotal = getTotalRegisteredUnits() + (courseObj ? courseObj.units : 4);
      if (newTotal > MAX_PERMITTED_UNITS) {
        errors.push(`Adding this course would bring your total to ${newTotal} units, which exceeds the ${MAX_PERMITTED_UNITS} maximum permitted limit.`);
      }
    }

    // Handle Errors
    if (errors.length > 0) {
      DOM.regFormErrorAlert.hidden = false;
      DOM.regErrorList.innerHTML = errors.map(err => `<li>${escapeHtml(err)}</li>`).join('');
      announceAlert(`Registration form has ${errors.length} errors: ${errors[0]}`);

      // Focus error summary for WCAG compliance
      DOM.regFormErrorAlert.setAttribute('tabindex', '-1');
      DOM.regFormErrorAlert.focus();
      return;
    }

    // Clear errors
    DOM.regFormErrorAlert.hidden = true;
    DOM.regErrorList.innerHTML = '';

    // Initiate Confirmation Modal
    initiateCourseRegistration(selectedCode, gradeMode, document.getElementById('submit-registration-btn'));
  }

  function initiateCourseRegistration(courseCode, gradeMode = 'Letter Grade', triggerBtn) {
    const course = COURSES_DATA.find(c => c.code.toUpperCase() === courseCode.toUpperCase());
    if (!course) {
      showToast('Error', `Course with code ${courseCode} was not found.`, 'danger');
      return;
    }

    // Check duplicate
    if (isCourseRegistered(course.code)) {
      showToast('Notice', `You are already enrolled in ${course.code}.`, 'info');
      return;
    }

    // Check maximum units
    const currentUnits = getTotalRegisteredUnits();
    if (currentUnits + course.units > MAX_PERMITTED_UNITS) {
      showToast('Unit Limit Exceeded', `Cannot enroll: Adding ${course.code} (${course.units} units) exceeds the 18-unit limit.`, 'danger');
      return;
    }

    // Set pending registration state
    pendingCourseRegistration = {
      courseId: course.id,
      crn: course.crn,
      code: course.code,
      title: course.title,
      units: course.units,
      schedule: course.schedule,
      location: course.location,
      instructor: course.instructor,
      gradeMode: gradeMode,
      status: 'Enrolled'
    };

    // Populate registration confirmation modal
    DOM.regModalCourseDetails.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
        <span class="course-code-badge" style="font-size:1.25rem;">${escapeHtml(course.code)}</span>
        <span class="badge badge-emerald font-bold">${course.units} Credit Units</span>
      </div>
      <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:0.75rem;color:var(--color-slate-900);">
        ${escapeHtml(course.title)}
      </h3>
      <div style="font-size:0.9rem;color:var(--color-slate-700);display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
        <div><strong>CRN:</strong> ${escapeHtml(course.crn)}</div>
        <div><strong>Grade Option:</strong> ${escapeHtml(gradeMode)}</div>
        <div><strong>Schedule:</strong> ${escapeHtml(course.schedule)}</div>
        <div><strong>Building &amp; Room:</strong> ${escapeHtml(course.location)}</div>
        <div style="grid-column:1 / -1;"><strong>Instructor:</strong> ${escapeHtml(course.instructor)}</div>
      </div>
    `;

    openAccessibleModal(DOM.regModal, triggerBtn);
  }

  function confirmRegistrationAction() {
    if (!pendingCourseRegistration) return;

    registeredCourses.push(pendingCourseRegistration);
    const addedCode = pendingCourseRegistration.code;
    const addedTitle = pendingCourseRegistration.title;
    pendingCourseRegistration = null;

    closeAccessibleModal(DOM.regModal);

    // Refresh UI
    updateAllViews();

    showToast('Registration Confirmed', `Successfully enrolled in ${addedCode}: ${addedTitle}.`, 'success');
  }

  // =========================================================================
  // 9. COURSE DROP FLOW (Confirmation Modal & State Update)
  // =========================================================================

  function initiateDropCourse(courseCode, triggerBtn) {
    const course = registeredCourses.find(c => c.code.toUpperCase() === courseCode.toUpperCase());
    if (!course) return;

    pendingCourseDrop = course;

    // Populate drop confirmation modal
    DOM.dropModalCourseDetails.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
        <span class="course-code-badge" style="font-size:1.2rem;color:var(--color-rose-800);">${escapeHtml(course.code)}</span>
        <span class="badge badge-rose font-bold">${course.units} Units</span>
      </div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-slate-900);">
        ${escapeHtml(course.title)}
      </h3>
      <p style="font-size:0.875rem;color:var(--color-slate-700);">
        <strong>Schedule:</strong> ${escapeHtml(course.schedule)} &nbsp;|&nbsp; 
        <strong>Instructor:</strong> ${escapeHtml(course.instructor)}
      </p>
    `;

    openAccessibleModal(DOM.dropModal, triggerBtn);
  }

  function confirmDropAction() {
    if (!pendingCourseDrop) return;

    const droppedCode = pendingCourseDrop.code;
    const droppedTitle = pendingCourseDrop.title;

    registeredCourses = registeredCourses.filter(c => c.code.toUpperCase() !== droppedCode.toUpperCase());
    pendingCourseDrop = null;

    closeAccessibleModal(DOM.dropModal);

    // Refresh UI
    updateAllViews();

    showToast('Course Dropped', `You have dropped ${droppedCode}: ${droppedTitle}. Your schedule has been updated.`, 'danger');
  }

  // =========================================================================
  // 10. REGISTERED COURSES DATA TABLE & PROGRESS CONTROLLER
  // =========================================================================

  function renderRegisteredTable() {
    DOM.registeredTableBody.innerHTML = '';
    const totalUnits = getTotalRegisteredUnits();

    // Summary unit displays
    DOM.tableTotalUnits.textContent = `${totalUnits} Units`;
    DOM.homeEnrolledUnits.innerHTML = `<span class="highlight">${totalUnits}</span> / ${MAX_PERMITTED_UNITS} Max`;
    DOM.homeEnrolledCourses.innerHTML = `<span class="highlight">${registeredCourses.length}</span> Courses`;
    DOM.progressEnrolledUnits.textContent = totalUnits;
    DOM.progressMaxUnits.textContent = MAX_PERMITTED_UNITS;

    // Progress bar
    const percentage = Math.min(100, Math.round((totalUnits / MAX_PERMITTED_UNITS) * 100));
    DOM.unitsProgressFill.style.width = `${percentage}%`;
    DOM.unitsProgressPercent.textContent = `${percentage}% of Max`;
    DOM.unitsProgressBar.setAttribute('aria-valuenow', totalUnits);
    DOM.unitsProgressBar.setAttribute('aria-valuetext', `${totalUnits} of ${MAX_PERMITTED_UNITS} units registered (${percentage}%)`);

    // Nav Badge
    DOM.navBadge.textContent = registeredCourses.length;
    DOM.navBadge.setAttribute('aria-label', `${registeredCourses.length} courses registered`);

    if (registeredCourses.length === 0) {
      DOM.registeredCoursesTable.hidden = true;
      DOM.registeredEmptyState.hidden = false;
      return;
    }

    DOM.registeredCoursesTable.hidden = false;
    DOM.registeredEmptyState.hidden = true;

    registeredCourses.forEach(course => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <th scope="row" class="font-mono">${escapeHtml(course.code)}</th>
        <td><strong>${escapeHtml(course.title)}</strong></td>
        <td class="text-center font-bold">${course.units}</td>
        <td>${escapeHtml(course.schedule)}</td>
        <td>${escapeHtml(course.location)}</td>
        <td>${escapeHtml(course.instructor)}</td>
        <td>${escapeHtml(course.gradeMode)}</td>
        <td class="text-center">
          <span class="badge badge-emerald">${escapeHtml(course.status)}</span>
        </td>
        <td class="text-center">
          <button 
            type="button" 
            class="btn btn-danger btn-sm" 
            data-action="drop-course" 
            data-course-code="${course.code}"
            aria-label="Drop course ${course.code}: ${course.title}"
          >
            Drop
          </button>
        </td>
      `;

      const dropBtn = row.querySelector('[data-action="drop-course"]');
      dropBtn.addEventListener('click', (e) => {
        initiateDropCourse(course.code, e.currentTarget);
      });

      DOM.registeredTableBody.appendChild(row);
    });
  }

  function updateAllViews() {
    renderRegisteredTable();
    populateCourseSelectDropdown();
    renderCatalog();
  }

  // =========================================================================
  // 11. EVENT LISTENERS INITIALIZATION
  // =========================================================================

  function initEventListeners() {
    // Navigation link clicks
    DOM.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        navigateTo(pageId);
      });
    });

    // Mobile navigation toggle
    DOM.mobileNavToggle.addEventListener('click', () => {
      toggleMobileNav();
    });

    // Close mobile nav on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.primaryNav.classList.contains('is-open')) {
        toggleMobileNav(false);
        DOM.mobileNavToggle.focus();
      }
    });

    // Hash change routing (Back / Forward browser buttons)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      navigateTo(hash, false);
    });

    // Catalog search input
    DOM.courseSearchInput.addEventListener('input', () => {
      renderCatalog();
    });

    // Clear search button
    if (DOM.clearSearchBtn) {
      DOM.clearSearchBtn.addEventListener('click', () => {
        DOM.courseSearchInput.value = '';
        renderCatalog();
        DOM.courseSearchInput.focus();
      });
    }

    // Catalog filters change
    [DOM.filterDept, DOM.filterLevel, DOM.filterMode, DOM.filterAvailability].forEach(select => {
      select.addEventListener('change', () => {
        renderCatalog();
      });
    });

    // Reset filters button
    DOM.resetFiltersBtn.addEventListener('click', () => {
      resetCatalogFilters();
    });

    // Direct registration form submission
    DOM.directRegForm.addEventListener('submit', handleDirectRegistrationSubmit);

    // Direct registration form reset
    DOM.resetRegFormBtn.addEventListener('click', () => {
      DOM.regFormErrorAlert.hidden = true;
      DOM.regPrereqConfirm.removeAttribute('aria-invalid');
      DOM.regPolicyConfirm.removeAttribute('aria-invalid');
      DOM.prereqConfirmError.hidden = true;
      DOM.policyConfirmError.hidden = true;
    });

    // Registration confirmation modal buttons
    DOM.regModalConfirmBtn.addEventListener('click', confirmRegistrationAction);
    DOM.regModalCancelBtn.addEventListener('click', () => closeAccessibleModal(DOM.regModal));
    DOM.regModalCloseX.addEventListener('click', () => closeAccessibleModal(DOM.regModal));

    // Drop confirmation modal buttons
    DOM.dropModalConfirmBtn.addEventListener('click', confirmDropAction);
    DOM.dropModalCancelBtn.addEventListener('click', () => closeAccessibleModal(DOM.dropModal));
    DOM.dropModalCloseX.addEventListener('click', () => closeAccessibleModal(DOM.dropModal));

    // Course Details modal close buttons
    DOM.detailsModalCloseBtn.addEventListener('click', () => closeAccessibleModal(DOM.detailsModal));
    DOM.detailsModalCloseX.addEventListener('click', () => closeAccessibleModal(DOM.detailsModal));
  }

  // =========================================================================
  // 12. APPLICATION STARTUP
  // =========================================================================

  function initApp() {
    initEventListeners();
    updateAllViews();

    // Check initial hash
    const initialHash = window.location.hash.replace('#', '') || 'home';
    navigateTo(initialHash, false);
  }

  // Expose app methods for inline button actions (e.g., hero button shortcuts)
  window.app = {
    navigateTo: navigateTo,
    resetCatalogFilters: resetCatalogFilters,
    initiateCourseRegistration: initiateCourseRegistration,
    initiateDropCourse: initiateDropCourse
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
