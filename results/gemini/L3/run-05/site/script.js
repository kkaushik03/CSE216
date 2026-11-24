/**
 * Horizon University Course Registration System
 * Accessible JavaScript Application conforming to WCAG 2.2 Level AA
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Initial State & Course Catalog Dataset (16 Comprehensive Courses)
  // --------------------------------------------------------------------------
  const INITIAL_COURSES = [
    {
      id: 'cse216',
      code: 'CSE 216',
      title: 'Web Application Engineering',
      department: 'Computer Science',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. Miller',
      schedule: 'Tue/Thu 11:00 AM – 12:20 PM',
      location: 'CSB 130',
      description: 'Modern web architectures, single-page application engineering, accessible user interfaces (WCAG 2.2 AA), client-side state management, and full-stack integration.',
      prerequisites: 'CSE 110 (Software Engineering) or graduate standing',
      capacity: 30,
      enrolled: 18,
      waitlist: 0,
      status: 'open',
      featured: true
    },
    {
      id: 'cse220',
      code: 'CSE 220',
      title: 'Advanced Database Systems',
      department: 'Computer Science',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. Gupta',
      schedule: 'Mon/Wed 2:00 PM – 3:20 PM',
      location: 'EBU3B 1202',
      description: 'Relational query optimization, concurrency control, distributed databases, transaction isolation levels, NoSQL datastores, and modern column-oriented architectures.',
      prerequisites: 'CSE 132A or equivalent database fundamentals',
      capacity: 25,
      enrolled: 12,
      waitlist: 0,
      status: 'open',
      featured: true
    },
    {
      id: 'cse250a',
      code: 'CSE 250A',
      title: 'Principles of Artificial Intelligence',
      department: 'Computer Science',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. Lawrence',
      schedule: 'Tue/Thu 9:30 AM – 10:50 AM',
      location: 'WLH 2001',
      description: 'Probabilistic graphical models, Bayesian networks, exact and approximate inference, Markov decision processes, reinforcement learning, and automated decision making.',
      prerequisites: 'Linear algebra, multivariate calculus, and algorithms',
      capacity: 30,
      enrolled: 30,
      waitlist: 4,
      status: 'waitlist',
      featured: true
    },
    {
      id: 'cse110',
      code: 'CSE 110',
      title: 'Software Engineering Principles',
      department: 'Computer Science',
      level: 'Undergraduate',
      credits: 4,
      instructor: 'Prof. Gary',
      schedule: 'Mon/Wed/Fri 10:00 AM – 10:50 AM',
      location: 'Center Hall 115',
      description: 'Team software engineering, Agile methodologies, CI/CD automated test pipelines, software design patterns, and accessible user experience design.',
      prerequisites: 'CSE 12 and CSE 30',
      capacity: 120,
      enrolled: 85,
      waitlist: 0,
      status: 'open',
      featured: false
    },
    {
      id: 'dsc100',
      code: 'DSC 100',
      title: 'Introduction to Data Management',
      department: 'Data Science',
      level: 'Undergraduate',
      credits: 4,
      instructor: 'Prof. Eldridge',
      schedule: 'Tue/Thu 3:30 PM – 4:50 PM',
      location: 'Warren Hall 101',
      description: 'Data wrangling, relational modeling, SQL transformations, pandas pipelines, exploratory data analysis, and ethical data management.',
      prerequisites: 'DSC 10 or CSE 8A',
      capacity: 60,
      enrolled: 45,
      waitlist: 0,
      status: 'open',
      featured: false
    },
    {
      id: 'dsc240',
      code: 'DSC 240',
      title: 'Machine Learning in Practice',
      department: 'Data Science',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. Kumar',
      schedule: 'Mon/Wed 11:00 AM – 12:20 PM',
      location: 'EBU3B 2154',
      description: 'Applied supervised and unsupervised learning, high-dimensional feature engineering, model interpretability, bias mitigation, and production deployment.',
      prerequisites: 'DSC 200 or graduate standing',
      capacity: 25,
      enrolled: 20,
      waitlist: 0,
      status: 'open',
      featured: true
    },
    {
      id: 'math180a',
      code: 'MATH 180A',
      title: 'Introduction to Probability',
      department: 'Mathematics',
      level: 'Undergraduate',
      credits: 4,
      instructor: 'Prof. Schweinsberg',
      schedule: 'Mon/Wed/Fri 1:00 PM – 1:50 PM',
      location: 'AP&M 4301',
      description: 'Probability spaces, combinatorial methods, conditioning, independence, discrete and continuous random variables, and the Central Limit Theorem.',
      prerequisites: 'MATH 20C or MATH 31BH',
      capacity: 100,
      enrolled: 100,
      waitlist: 12,
      status: 'full',
      featured: false
    },
    {
      id: 'math283',
      code: 'MATH 283',
      title: 'Statistical Methods in Bioinformatics',
      department: 'Mathematics',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. Pevzner',
      schedule: 'Tue/Thu 12:30 PM – 1:50 PM',
      location: 'Mayer Hall 5301',
      description: 'Statistical hypothesis testing, multiple comparison adjustments, false discovery rates, hidden Markov models, and biological sequence modeling.',
      prerequisites: 'MATH 181A or graduate standing',
      capacity: 20,
      enrolled: 15,
      waitlist: 0,
      status: 'open',
      featured: false
    },
    {
      id: 'ece165',
      code: 'ECE 165',
      title: 'Digital Integrated Circuit Design',
      department: 'Electrical Engineering',
      level: 'Undergraduate',
      credits: 4,
      instructor: 'Prof. Mercier',
      schedule: 'Tue/Thu 2:00 PM – 3:20 PM',
      location: 'Jacobs Hall 2512',
      description: 'MOS transistors, static and dynamic CMOS logic design, timing analysis, clock distribution networks, and low-power circuit optimization.',
      prerequisites: 'ECE 108 or ECE 102',
      capacity: 35,
      enrolled: 28,
      waitlist: 0,
      status: 'open',
      featured: false
    },
    {
      id: 'ece253',
      code: 'ECE 253',
      title: 'Fundamentals of Digital Image Processing',
      department: 'Electrical Engineering',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. Nguyen',
      schedule: 'Mon/Wed 3:30 PM – 4:50 PM',
      location: 'Jacobs Hall 4309',
      description: '2D continuous and discrete systems, discrete Fourier transforms, image enhancement, restoration, compression algorithms, and morphological filtering.',
      prerequisites: 'ECE 161A or graduate standing',
      capacity: 30,
      enrolled: 22,
      waitlist: 0,
      status: 'open',
      featured: false
    },
    {
      id: 'cogs108',
      code: 'COGS 108',
      title: 'Data Science in Practice',
      department: 'Cognitive Science',
      level: 'Undergraduate',
      credits: 4,
      instructor: 'Prof. Fleischer',
      schedule: 'Tue/Thu 8:00 AM – 9:20 AM',
      location: 'Mandeville Auditorium',
      description: 'Real-world data collection, ethical considerations, open-source scientific workflows, reproducibility, and communication of findings to diverse audiences.',
      prerequisites: 'COGS 18 or CSE 8A or CSE 11',
      capacity: 200,
      enrolled: 150,
      waitlist: 0,
      status: 'open',
      featured: false
    },
    {
      id: 'cogs220',
      code: 'COGS 220',
      title: 'Information Visualization',
      department: 'Cognitive Science',
      level: 'Graduate',
      credits: 3,
      instructor: 'Prof. Ellis',
      schedule: 'Wed 5:00 PM – 7:50 PM',
      location: 'CSB 002',
      description: 'Visual cognition, perceptual principles for charts and dashboards, accessible data visualization techniques, D3.js programming, and interaction design.',
      prerequisites: 'Graduate standing in COGS, CSE, or DSC',
      capacity: 20,
      enrolled: 16,
      waitlist: 0,
      status: 'open',
      featured: false
    },
    {
      id: 'beng211',
      code: 'BENG 211',
      title: 'Systems Biology and Bioengineering',
      department: 'Bioengineering',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. Palsson',
      schedule: 'Mon/Wed 9:00 AM – 10:20 AM',
      location: 'Powell-Focht 212',
      description: 'Mathematical modeling of cellular biochemical pathways, constraint-based genome-scale reconstructions, flux balance analysis, and metabolic network engineering.',
      prerequisites: 'BENG 100 or graduate standing',
      capacity: 25,
      enrolled: 25,
      waitlist: 2,
      status: 'waitlist',
      featured: false
    },
    {
      id: 'phil167',
      code: 'PHIL 167',
      title: 'Science and Philosophy of Mind',
      department: 'Philosophy',
      level: 'Undergraduate',
      credits: 4,
      instructor: 'Prof. Callender',
      schedule: 'Tue/Thu 11:00 AM – 12:20 PM',
      location: 'HSS 2250',
      description: 'Philosophical inquiries into artificial intelligence, machine consciousness, mental representation, perception, and free will from physicalist perspectives.',
      prerequisites: 'Upper-division standing',
      capacity: 40,
      enrolled: 35,
      waitlist: 0,
      status: 'open',
      featured: false
    },
    {
      id: 'eng100d',
      code: 'ENG 100D',
      title: 'Design for Development',
      department: 'Engineering',
      level: 'Undergraduate',
      credits: 3,
      instructor: 'Prof. Delson',
      schedule: 'Fri 9:00 AM – 11:50 AM',
      location: 'SME 208',
      description: 'Multidisciplinary engineering teams developing humanitarian technology solutions for underserved global communities. Rapid prototyping and field testing.',
      prerequisites: 'Upper-division engineering standing',
      capacity: 30,
      enrolled: 30,
      waitlist: 0,
      status: 'full',
      featured: false
    },
    {
      id: 'mgt181',
      code: 'MGT 181',
      title: 'Enterprise Finance',
      department: 'Management',
      level: 'Undergraduate',
      credits: 4,
      instructor: 'Prof. Schlingemann',
      schedule: 'Mon/Wed 5:00 PM – 6:20 PM',
      location: 'Wells Fargo Hall 110',
      description: 'Corporate capital allocation, risk management, valuation techniques, financial restructuring, mergers and acquisitions, and governance principles.',
      prerequisites: 'MGT 45 or ECON 100A',
      capacity: 65,
      enrolled: 55,
      waitlist: 0,
      status: 'open',
      featured: false
    }
  ];

  // Initial Student Profile
  const DEFAULT_STUDENT = {
    name: 'Alex Chen',
    studentId: '84729103',
    email: 'alex.chen@horizon.edu',
    phone: '(858) 555-0192',
    major: 'Computer Science',
    degreeLevel: 'Graduate',
    degree: 'M.S. in Computer Science',
    gpa: '3.88',
    term: 'Fall 2026',
    maxUnits: 16,
    registered: [
      {
        courseId: 'cse216',
        code: 'CSE 216',
        title: 'Web Application Engineering',
        units: 4,
        instructor: 'Prof. Miller',
        schedule: 'Tue/Thu 11:00 AM – 12:20 PM',
        location: 'CSB 130',
        gradingOption: 'Letter Grade',
        registeredAt: '2026-09-01'
      },
      {
        courseId: 'dsc240',
        code: 'DSC 240',
        title: 'Machine Learning in Practice',
        units: 4,
        instructor: 'Prof. Kumar',
        schedule: 'Mon/Wed 11:00 AM – 12:20 PM',
        location: 'EBU3B 2154',
        gradingOption: 'Letter Grade',
        registeredAt: '2026-09-02'
      }
    ]
  };

  // --------------------------------------------------------------------------
  // 2. Storage & Application State Management
  // --------------------------------------------------------------------------
  const STORAGE_KEY_STUDENT = 'horizon_student_profile_v1';
  const STORAGE_KEY_COURSES = 'horizon_courses_catalog_v1';

  let student = loadStudent();
  let courses = loadCourses();

  function loadStudent() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage unavailable, using default student data.', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STUDENT));
  }

  function saveStudent() {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(student));
    } catch (e) {
      console.warn('Unable to persist student to localStorage.', e);
    }
  }

  function loadCourses() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_COURSES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage unavailable, using initial course dataset.', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_COURSES));
  }

  function saveCourses() {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.warn('Unable to persist courses to localStorage.', e);
    }
  }

  // --------------------------------------------------------------------------
  // 3. Screen Reader Live Announcer Utilities (Rules 63-65)
  // --------------------------------------------------------------------------
  const liveRegion = document.getElementById('global-live-region');
  const alertRegion = document.getElementById('global-alert-region');

  function announce(message, isAlert = false) {
    if (isAlert) {
      if (alertRegion) {
        alertRegion.textContent = '';
        setTimeout(() => {
          alertRegion.textContent = message;
        }, 50);
      }
    } else {
      if (liveRegion) {
        liveRegion.textContent = '';
        setTimeout(() => {
          liveRegion.textContent = message;
        }, 50);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 4. View Routing & Navigation System (Rules 17, 19, 21, 45)
  // --------------------------------------------------------------------------
  const PAGE_TITLES = {
    home: 'Horizon University Course Registration System - Home',
    catalog: 'Course Catalog | Horizon University Registration System',
    registration: 'Course Registration | Horizon University Registration System',
    profile: 'Student Profile & Registered Courses | Horizon University Registration System'
  };

  const views = {
    home: document.getElementById('view-home'),
    catalog: document.getElementById('view-catalog'),
    registration: document.getElementById('view-registration'),
    profile: document.getElementById('view-profile')
  };

  const navLinks = {
    home: document.getElementById('nav-link-home'),
    catalog: document.getElementById('nav-link-catalog'),
    registration: document.getElementById('nav-link-registration'),
    profile: document.getElementById('nav-link-profile')
  };

  let currentViewId = 'home';
  let lastActiveElementBeforeModal = null;

  function navigateTo(viewId, options = {}) {
    if (!views[viewId]) {
      viewId = 'home';
    }

    currentViewId = viewId;

    // 1. Hide all views and show active view
    Object.keys(views).forEach(key => {
      const viewEl = views[key];
      if (viewEl) {
        if (key === viewId) {
          viewEl.hidden = false;
        } else {
          viewEl.hidden = true;
        }
      }
    });

    // 2. Update navigation aria-current="page" (Rule 21)
    Object.keys(navLinks).forEach(key => {
      const linkEl = navLinks[key];
      if (linkEl) {
        if (key === viewId) {
          linkEl.setAttribute('aria-current', 'page');
        } else {
          linkEl.removeAttribute('aria-current');
        }
      }
    });

    // 3. Update descriptive document.title (Rule 17)
    document.title = PAGE_TITLES[viewId] || 'Horizon University Course Registration';

    // 4. Close mobile menu if currently expanded
    closeMobileMenu();

    // 5. Move keyboard focus to the new view's <h1> (Rule 45)
    if (!options.skipFocus) {
      const activeHeading = views[viewId].querySelector('h1');
      if (activeHeading) {
        activeHeading.focus();
      }
    }

    // 6. Refresh view contents
    if (viewId === 'catalog') {
      renderCatalog();
    } else if (viewId === 'profile') {
      renderProfile();
    } else if (viewId === 'registration') {
      prepareRegistrationForm(options.preselectCourseId);
    } else if (viewId === 'home') {
      renderHomeStats();
      renderFeaturedCourses();
    }

    // 7. Update URL hash without forcing redundant reload
    if (window.location.hash !== `#${viewId}`) {
      window.history.pushState(null, '', `#${viewId}`);
    }

    // 8. Polite announcement of page load
    announce(`${PAGE_TITLES[viewId]} loaded.`);
  }

  // --------------------------------------------------------------------------
  // 5. Mobile Menu Toggle Logic (Rules 70-72)
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  function openMobileMenu() {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'true');
    mainNav.classList.add('is-open');
    announce('Navigation menu opened');
  }

  function closeMobileMenu() {
    if (!menuToggle || !mainNav) return;
    if (menuToggle.getAttribute('aria-expanded') === 'true') {
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
    }
  }

  function toggleMobileMenu() {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
      menuToggle.focus();
    } else {
      openMobileMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Escape closes mobile menu and returns focus (Rule 71)
    menuToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        menuToggle.focus();
      }
    });
  }

  if (mainNav) {
    mainNav.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        if (menuToggle) menuToggle.focus();
      }
    });
  }

  // Handle all hash navigation link clicks
  document.addEventListener('click', (e) => {
    const targetLink = e.target.closest('a[href^="#"]');
    if (!targetLink) return;

    const hash = targetLink.getAttribute('href');
    if (!hash || hash === '#') return;

    // If skip link, let native anchor jump handle it
    if (targetLink.classList.contains('skip-link')) {
      const mainEl = document.getElementById('main-content');
      if (mainEl) {
        mainEl.focus();
      }
      return;
    }

    const viewId = hash.replace('#', '');
    if (views[viewId]) {
      e.preventDefault();
      navigateTo(viewId);
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    if (views[hash]) {
      navigateTo(hash, { skipFocus: false });
    }
  });

  // --------------------------------------------------------------------------
  // 6. Home View Logic
  // --------------------------------------------------------------------------
  function renderHomeStats() {
    const totalCountEl = document.getElementById('home-stat-total-courses');
    const openCountEl = document.getElementById('home-stat-open-courses');
    const enrolledUnitsEl = document.getElementById('home-stat-enrolled-units');

    if (totalCountEl) totalCountEl.textContent = courses.length;

    const openCount = courses.filter(c => c.status === 'open').length;
    if (openCountEl) openCountEl.textContent = openCount;

    const totalUnits = calculateEnrolledUnits();
    if (enrolledUnitsEl) enrolledUnitsEl.textContent = `${totalUnits} / ${student.maxUnits}`;

    updateNavBadge();
  }

  function renderFeaturedCourses() {
    const featuredList = document.getElementById('home-featured-courses-list');
    if (!featuredList) return;

    const featuredCourses = courses.filter(c => c.featured);
    featuredList.innerHTML = '';

    featuredCourses.forEach(course => {
      const cardEl = createCourseCardElement(course);
      featuredList.appendChild(cardEl);
    });
  }

  // --------------------------------------------------------------------------
  // 7. Course Catalog View, Search, & Filters (Rules 74-84)
  // --------------------------------------------------------------------------
  const searchInput = document.getElementById('catalog-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const filterDept = document.getElementById('filter-department');
  const filterLevel = document.getElementById('filter-level');
  const filterAvailability = document.getElementById('filter-availability');
  const filterUnits = document.getElementById('filter-units');
  const filterSort = document.getElementById('filter-sort');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const emptyResetBtn = document.getElementById('empty-reset-filters-btn');
  const catalogStatus = document.getElementById('catalog-results-status');
  const catalogList = document.getElementById('catalog-courses-list');
  const catalogEmpty = document.getElementById('catalog-empty-state');

  let searchDebounceTimer = null;

  function renderCatalog(options = {}) {
    if (!catalogList) return;

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const dept = (filterDept && filterDept.value) ? filterDept.value : 'all';
    const level = (filterLevel && filterLevel.value) ? filterLevel.value : 'all';
    const availability = (filterAvailability && filterAvailability.value) ? filterAvailability.value : 'all';
    const units = (filterUnits && filterUnits.value) ? filterUnits.value : 'all';
    const sort = (filterSort && filterSort.value) ? filterSort.value : 'code-asc';

    // Show/hide clear search button
    if (clearSearchBtn) {
      clearSearchBtn.hidden = !query;
    }

    // Filter courses
    let filtered = courses.filter(course => {
      // Keyword search
      if (query) {
        const fullSearchText = `${course.code} ${course.title} ${course.department} ${course.instructor} ${course.description}`.toLowerCase();
        if (!fullSearchText.includes(query)) return false;
      }

      // Department
      if (dept !== 'all' && course.department !== dept) return false;

      // Level
      if (level !== 'all' && course.level !== level) return false;

      // Availability
      if (availability === 'open' && course.status !== 'open') return false;
      if (availability === 'waitlist' && course.status !== 'waitlist') return false;
      if (availability === 'open-waitlist' && course.status === 'full') return false;

      // Units
      if (units !== 'all' && course.credits !== parseInt(units, 10)) return false;

      return true;
    });

    // Sort courses
    filtered.sort((a, b) => {
      if (sort === 'code-asc') return a.code.localeCompare(b.code);
      if (sort === 'code-desc') return b.code.localeCompare(a.code);
      if (sort === 'title-asc') return a.title.localeCompare(b.title);
      if (sort === 'units-desc') return b.credits - a.credits;
      return 0;
    });

    // Render list
    catalogList.innerHTML = '';

    if (filtered.length === 0) {
      if (catalogEmpty) catalogEmpty.hidden = false;
      if (catalogStatus) catalogStatus.textContent = 'Showing 0 courses matching criteria';
      if (!options.silent) {
        announce('No courses found matching your criteria.');
      }
    } else {
      if (catalogEmpty) catalogEmpty.hidden = true;
      const statusText = `Showing ${filtered.length} of ${courses.length} courses`;
      if (catalogStatus) catalogStatus.textContent = statusText;

      filtered.forEach(course => {
        const cardEl = createCourseCardElement(course);
        catalogList.appendChild(cardEl);
      });

      if (!options.silent) {
        announce(`${filtered.length} courses found.`);
      }
    }
  }

  // Course Card Builder with full WCAG AA compliance (Rule 81-84)
  function createCourseCardElement(course) {
    const isEnrolled = isStudentEnrolled(course.id);
    const li = document.createElement('li');
    li.className = 'course-card-item';

    // Status Badge Markup with Text + Icon (Rule 35)
    let statusBadge = '';
    if (course.status === 'open') {
      const openSeats = course.capacity - course.enrolled;
      statusBadge = `
        <span class="badge badge-open">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
          Open (${openSeats} seats left)
        </span>
      `;
    } else if (course.status === 'waitlist') {
      statusBadge = `
        <span class="badge badge-waitlist">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Waitlist (${course.waitlist} waiting)
        </span>
      `;
    } else {
      statusBadge = `
        <span class="badge badge-full">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
          Full (0 seats left)
        </span>
      `;
    }

    // Accessible Action Button (Rules 28-29: starts with visible text)
    let actionButton = '';
    if (isEnrolled) {
      actionButton = `
        <button type="button" 
                class="btn btn-secondary btn-sm" 
                data-action="view-profile" 
                data-course-id="${course.id}" 
                aria-label="Enrolled in ${course.code}: ${course.title} - View schedule in Profile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
          Enrolled (View)
        </button>
        <button type="button" 
                class="btn btn-danger btn-sm" 
                data-action="drop" 
                data-course-id="${course.id}" 
                aria-label="Drop ${course.code}: ${course.title}">
          Drop
        </button>
      `;
    } else if (course.status === 'open') {
      actionButton = `
        <button type="button" 
                class="btn btn-primary btn-sm" 
                data-action="register" 
                data-course-id="${course.id}" 
                aria-label="Register for ${course.code}: ${course.title}">
          Register
        </button>
      `;
    } else if (course.status === 'waitlist') {
      actionButton = `
        <button type="button" 
                class="btn btn-warning btn-sm" 
                data-action="register" 
                data-course-id="${course.id}" 
                aria-label="Join Waitlist for ${course.code}: ${course.title}">
          Join Waitlist
        </button>
      `;
    } else {
      actionButton = `
        <button type="button" 
                class="btn btn-secondary btn-sm" 
                disabled 
                aria-label="${course.code}: ${course.title} is currently full">
          Class Full
        </button>
      `;
    }

    li.innerHTML = `
      <article class="course-card" aria-labelledby="card-title-${course.id}">
        <div class="card-top-badges">
          <span class="badge badge-purple">${course.department}</span>
          <span class="badge badge-teal">${course.credits} Units</span>
          ${statusBadge}
        </div>

        <div class="course-code-title">
          <h3 id="card-title-${course.id}" class="course-card-heading">
            ${course.code}: ${course.title}
          </h3>
        </div>

        <ul class="course-meta-list">
          <li class="meta-item">
            <span class="meta-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <span><strong>Instructor:</strong> ${course.instructor}</span>
          </li>
          <li class="meta-item">
            <span class="meta-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <span><strong>Time:</strong> ${course.schedule}</span>
          </li>
          <li class="meta-item">
            <span class="meta-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <span><strong>Location:</strong> ${course.location}</span>
          </li>
        </ul>

        <p class="course-card-desc">${course.description}</p>

        <div class="course-prereqs-box">
          <strong>Prerequisites:</strong> ${course.prerequisites}
        </div>

        <div class="card-actions-row">
          ${actionButton}
          <button type="button" 
                  class="btn btn-secondary btn-sm" 
                  data-action="details" 
                  data-course-id="${course.id}" 
                  aria-label="View syllabus and course details for ${course.code}: ${course.title}">
            Course Details
          </button>
        </div>
      </article>
    `;

    return li;
  }

  // Event Listeners for Filters
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        renderCatalog();
      }, 300);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        renderCatalog();
        searchInput.focus();
        announce('Search cleared.');
      }
    });
  }

  [filterDept, filterLevel, filterAvailability, filterUnits, filterSort].forEach(el => {
    if (el) {
      el.addEventListener('change', () => {
        renderCatalog();
      });
    }
  });

  function resetAllFilters() {
    if (searchInput) searchInput.value = '';
    if (filterDept) filterDept.value = 'all';
    if (filterLevel) filterLevel.value = 'all';
    if (filterAvailability) filterAvailability.value = 'all';
    if (filterUnits) filterUnits.value = 'all';
    if (filterSort) filterSort.value = 'code-asc';
    renderCatalog();
    if (searchInput) searchInput.focus();
    announce('All filters reset. Showing all courses.');
  }

  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

  // Card button actions (delegation)
  document.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('button[data-action]');
    if (!actionBtn) return;

    const action = actionBtn.dataset.action;
    const courseId = actionBtn.dataset.courseId;

    if (action === 'register') {
      navigateTo('registration', { preselectCourseId: courseId });
    } else if (action === 'details') {
      openCourseDetailsModal(courseId, actionBtn);
    } else if (action === 'drop') {
      openDropConfirmModal(courseId, actionBtn);
    } else if (action === 'view-profile') {
      navigateTo('profile');
    }
  });

  // --------------------------------------------------------------------------
  // 8. Registration Form & Validation (Rules 51-59)
  // --------------------------------------------------------------------------
  const regForm = document.getElementById('course-registration-form');
  const regCourseSelect = document.getElementById('reg-course-select');
  const regFullName = document.getElementById('reg-fullname');
  const regStudentId = document.getElementById('reg-studentid');
  const regEmail = document.getElementById('reg-email');
  const regMajor = document.getElementById('reg-major');
  const regLevel = document.getElementById('reg-level');
  const regAckPrereqs = document.getElementById('ack-prereqs');
  const regAckIntegrity = document.getElementById('ack-integrity');
  const regErrorSummary = document.getElementById('reg-error-summary');
  const regErrorList = document.getElementById('reg-error-list');
  const regSuccessBanner = document.getElementById('reg-success-banner');
  const regAnotherBtn = document.getElementById('reg-another-course-btn');
  const coursePreview = document.getElementById('selected-course-preview');
  const previewDetails = document.getElementById('preview-course-details');
  const previewTitle = document.getElementById('preview-course-title');

  function prepareRegistrationForm(targetCourseId, options = {}) {
    // Populate Course Select Dropdown
    if (regCourseSelect) {
      regCourseSelect.innerHTML = '<option value="">-- Choose a course to register --</option>';
      courses.forEach(c => {
        const isEnrolled = isStudentEnrolled(c.id);
        const opt = document.createElement('option');
        opt.value = c.id;
        if (isEnrolled) {
          opt.textContent = `${c.code} - ${c.title} (${c.credits} units) [ALREADY ENROLLED]`;
          opt.disabled = true;
        } else if (c.status === 'full') {
          opt.textContent = `${c.code} - ${c.title} (${c.credits} units) [FULL - NO SEATS]`;
          opt.disabled = true;
        } else if (c.status === 'waitlist') {
          opt.textContent = `${c.code} - ${c.title} (${c.credits} units) [WAITLIST - ${c.waitlist} waiting]`;
        } else {
          opt.textContent = `${c.code} - ${c.title} (${c.credits} units) [OPEN]`;
        }
        regCourseSelect.appendChild(opt);
      });

      if (targetCourseId) {
        regCourseSelect.value = targetCourseId;
        updateCoursePreview(targetCourseId);
      } else {
        updateCoursePreview('');
      }
    }

    // Pre-fill user profile info (Rule 58)
    if (regFullName) regFullName.value = student.name;
    if (regStudentId) regStudentId.value = student.studentId;
    if (regEmail) regEmail.value = student.email;
    if (regMajor) regMajor.value = student.major;
    if (regLevel) regLevel.value = student.degreeLevel || 'Graduate';

    // Update status chips
    const summaryName = document.getElementById('reg-summary-student-name');
    const summaryUnits = document.getElementById('reg-summary-enrolled-units');
    if (summaryName) summaryName.textContent = student.name;
    if (summaryUnits) summaryUnits.textContent = `${calculateEnrolledUnits()} of ${student.maxUnits} Max Units`;

    // Clear previous errors
    clearAllFormErrors();
    if (regSuccessBanner && !options.keepSuccessBanner) {
      regSuccessBanner.hidden = true;
    }
  }

  function updateCoursePreview(courseId) {
    if (!coursePreview || !previewDetails) return;
    if (!courseId) {
      coursePreview.hidden = true;
      return;
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) {
      coursePreview.hidden = true;
      return;
    }

    coursePreview.hidden = false;
    if (previewTitle) {
      previewTitle.textContent = `${course.code}: ${course.title}`;
    }

    previewDetails.innerHTML = `
      <div><strong>Department:</strong> ${course.department}</div>
      <div><strong>Credits:</strong> ${course.credits} Units</div>
      <div><strong>Instructor:</strong> ${course.instructor}</div>
      <div><strong>Schedule:</strong> ${course.schedule}</div>
      <div><strong>Location:</strong> ${course.location}</div>
      <div><strong>Status:</strong> ${course.status === 'open' ? 'Open for Enrollment' : 'Waitlist Position Available'}</div>
    `;
  }

  if (regCourseSelect) {
    regCourseSelect.addEventListener('change', (e) => {
      updateCoursePreview(e.target.value);
      clearFieldError('reg-course-select');
    });
  }

  function setFieldError(fieldId, errorText) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (field) {
      field.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) {
      errorEl.textContent = errorText;
      errorEl.hidden = false;
    }
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (field) {
      field.removeAttribute('aria-invalid');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  }

  function clearAllFormErrors() {
    if (regErrorSummary) regErrorSummary.hidden = true;
    if (regErrorList) regErrorList.innerHTML = '';
    ['reg-course-select', 'reg-fullname', 'reg-studentid', 'reg-email', 'reg-major', 'reg-level', 'ack-prereqs', 'ack-integrity'].forEach(clearFieldError);
  }

  // Real-time error clearance upon user typing
  [regFullName, regStudentId, regEmail, regMajor, regLevel].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        clearFieldError(input.id);
      });
    }
  });

  if (regAckPrereqs) {
    regAckPrereqs.addEventListener('change', () => clearFieldError('ack-prereqs'));
  }
  if (regAckIntegrity) {
    regAckIntegrity.addEventListener('change', () => clearFieldError('ack-integrity'));
  }

  // Registration Form Submission Validation Handler (Rules 51-57)
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllFormErrors();

      const errors = [];
      const courseId = regCourseSelect ? regCourseSelect.value : '';
      const fullName = regFullName ? regFullName.value.trim() : '';
      const studentIdVal = regStudentId ? regStudentId.value.trim() : '';
      const emailVal = regEmail ? regEmail.value.trim() : '';
      const majorVal = regMajor ? regMajor.value.trim() : '';
      const ackPrereq = regAckPrereqs ? regAckPrereqs.checked : false;
      const ackIntegrity = regAckIntegrity ? regAckIntegrity.checked : false;

      // 1. Course Selection validation
      if (!courseId) {
        errors.push({
          fieldId: 'reg-course-select',
          message: 'Select a course from the list to register.'
        });
      } else {
        const selectedCourse = courses.find(c => c.id === courseId);
        if (selectedCourse && isStudentEnrolled(courseId)) {
          errors.push({
            fieldId: 'reg-course-select',
            message: `You are already enrolled in ${selectedCourse.code}. Select another course.`
          });
        } else if (selectedCourse) {
          const currentUnits = calculateEnrolledUnits();
          if (currentUnits + selectedCourse.credits > student.maxUnits) {
            errors.push({
              fieldId: 'reg-course-select',
              message: `Adding ${selectedCourse.code} (${selectedCourse.credits} units) exceeds your ${student.maxUnits}-unit maximum term limit. Total would be ${currentUnits + selectedCourse.credits} units.`
            });
          }
        }
      }

      // 2. Full Name validation
      if (!fullName) {
        errors.push({
          fieldId: 'reg-fullname',
          message: 'Enter your full legal name as it appears in university records.'
        });
      }

      // 3. Student ID validation (Rule 56: specific fix instructions)
      if (!studentIdVal) {
        errors.push({
          fieldId: 'reg-studentid',
          message: 'Enter your student ID number.'
        });
      } else if (!/^\d{8}$/.test(studentIdVal)) {
        errors.push({
          fieldId: 'reg-studentid',
          message: 'Enter a student ID with exactly 8 digits (e.g. 84729103).'
        });
      }

      // 4. University Email validation
      if (!emailVal) {
        errors.push({
          fieldId: 'reg-email',
          message: 'Enter your university email address.'
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) || !emailVal.endsWith('.edu')) {
        errors.push({
          fieldId: 'reg-email',
          message: 'Enter a valid university email address ending in .edu (e.g. alex.chen@horizon.edu).'
        });
      }

      // 5. Major validation
      if (!majorVal) {
        errors.push({
          fieldId: 'reg-major',
          message: 'Enter your declared major or academic department.'
        });
      }

      // 6. Prerequisites Acknowledgement Checkbox
      if (!ackPrereq) {
        errors.push({
          fieldId: 'ack-prereqs',
          message: 'You must certify that you satisfy all course prerequisites before registering.'
        });
      }

      // 7. Academic Integrity Checkbox
      if (!ackIntegrity) {
        errors.push({
          fieldId: 'ack-integrity',
          message: 'You must agree to the University Academic Integrity & Attendance Policy.'
        });
      }

      // If Errors Found: populate error summary, move focus (Rule 57)
      if (errors.length > 0) {
        regErrorSummary.hidden = false;
        regErrorList.innerHTML = '';

        errors.forEach(err => {
          setFieldError(err.fieldId, err.message);

          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${err.fieldId}`;
          a.textContent = err.message;
          a.addEventListener('click', (ev) => {
            ev.preventDefault();
            const targetEl = document.getElementById(err.fieldId);
            if (targetEl) targetEl.focus();
          });
          li.appendChild(a);
          regErrorList.appendChild(li);
        });

        // Move keyboard focus to error summary or first invalid field (Rule 57)
        regErrorSummary.focus();
        announce(`Form submission failed with ${errors.length} errors. Please correct the fields listed in the error summary.`, true);
        return;
      }

      // Form is valid! Gather pending registration data and open confirmation modal
      const course = courses.find(c => c.id === courseId);
      const gradingOption = regForm.elements['gradingOption'] ? regForm.elements['gradingOption'].value : 'Letter Grade';

      const pendingData = {
        courseId: course.id,
        code: course.code,
        title: course.title,
        units: course.credits,
        instructor: course.instructor,
        schedule: course.schedule,
        location: course.location,
        gradingOption: gradingOption,
        registeredAt: new Date().toISOString().split('T')[0]
      };

      openRegistrationConfirmModal(pendingData, document.getElementById('submit-registration-btn'));
    });

    regForm.addEventListener('reset', () => {
      clearAllFormErrors();
      updateCoursePreview('');
      if (regSuccessBanner) regSuccessBanner.hidden = true;
      announce('Registration form has been reset.');
    });
  }

  if (regAnotherBtn) {
    regAnotherBtn.addEventListener('click', () => {
      if (regSuccessBanner) regSuccessBanner.hidden = true;
      if (regCourseSelect) {
        regCourseSelect.value = '';
        regCourseSelect.focus();
      }
      updateCoursePreview('');
      if (regAckPrereqs) regAckPrereqs.checked = false;
      if (regAckIntegrity) regAckIntegrity.checked = false;
    });
  }

  // --------------------------------------------------------------------------
  // 9. Accessible Modals (<dialog>) (Rules 85-90)
  // --------------------------------------------------------------------------
  const regConfirmDialog = document.getElementById('registration-confirm-dialog');
  const regCancelBtn = document.getElementById('reg-dialog-cancel-btn');
  const regConfirmBtn = document.getElementById('reg-dialog-confirm-btn');

  const dropConfirmDialog = document.getElementById('drop-confirm-dialog');
  const dropCancelBtn = document.getElementById('drop-dialog-cancel-btn');
  const dropConfirmBtn = document.getElementById('drop-dialog-confirm-btn');

  const detailsDialog = document.getElementById('course-details-dialog');
  const detailsCloseBtn = document.getElementById('details-dialog-close-btn');
  const detailsRegisterBtn = document.getElementById('details-dialog-register-btn');

  let activePendingRegistration = null;
  let activePendingDropCourseId = null;

  // Open Registration Confirm Modal
  function openRegistrationConfirmModal(pendingData, triggeringElement) {
    if (!regConfirmDialog) return;
    lastActiveElementBeforeModal = triggeringElement || document.activeElement;
    activePendingRegistration = pendingData;

    document.getElementById('confirm-modal-course-name').textContent = `${pendingData.code}: ${pendingData.title}`;
    document.getElementById('confirm-modal-instructor').textContent = pendingData.instructor;
    document.getElementById('confirm-modal-schedule').textContent = `${pendingData.schedule} (${pendingData.location})`;
    document.getElementById('confirm-modal-units').textContent = `${pendingData.units} Units`;
    document.getElementById('confirm-modal-grading').textContent = pendingData.gradingOption;
    document.getElementById('confirm-modal-student').textContent = `${student.name} (ID: ${student.studentId})`;

    regConfirmDialog.showModal(); // Native HTML dialog makes background inert (Rule 86)

    // Focus least destructive control ("Cancel") (Rule 88)
    if (regCancelBtn) {
      regCancelBtn.focus();
    }
  }

  if (regCancelBtn) {
    regCancelBtn.addEventListener('click', () => {
      regConfirmDialog.close();
      if (lastActiveElementBeforeModal) lastActiveElementBeforeModal.focus();
    });
  }

  if (regConfirmBtn) {
    regConfirmBtn.addEventListener('click', () => {
      if (!activePendingRegistration) return;

      // 1. Add course to student registered list
      student.registered.push(activePendingRegistration);
      saveStudent();

      // 2. Increment course enrolled count
      const course = courses.find(c => c.id === activePendingRegistration.courseId);
      if (course) {
        course.enrolled += 1;
        if (course.enrolled >= course.capacity) {
          course.status = course.waitlist > 0 ? 'waitlist' : 'full';
        }
        saveCourses();
      }

      regConfirmDialog.close();

      // 3. Update Success State
      if (regSuccessBanner) {
        regSuccessBanner.hidden = false;
        document.getElementById('reg-success-title').textContent = `Enrolled in ${activePendingRegistration.code}!`;
        document.getElementById('reg-success-message').textContent = `You have officially registered for ${activePendingRegistration.code}: ${activePendingRegistration.title} (${activePendingRegistration.units} units). Your Fall 2026 schedule has been updated.`;
      }

      // 4. Update UI counters and views
      updateNavBadge();
      renderHomeStats();
      prepareRegistrationForm(null, { keepSuccessBanner: true });

      // 5. Announce status
      const totalUnits = calculateEnrolledUnits();
      announce(`Registration confirmed for ${activePendingRegistration.code}: ${activePendingRegistration.title}. You are now enrolled in ${totalUnits} units.`);

      // 6. Return focus to success banner or another button
      if (regAnotherBtn) {
        regAnotherBtn.focus();
      }
    });
  }

  // Open Drop Course Modal
  function openDropConfirmModal(courseId, triggeringElement) {
    if (!dropConfirmDialog) return;
    lastActiveElementBeforeModal = triggeringElement || document.activeElement;
    activePendingDropCourseId = courseId;

    const course = courses.find(c => c.id === courseId) || student.registered.find(r => r.courseId === courseId);
    if (!course) return;

    document.getElementById('drop-modal-course-name').textContent = `${course.code}: ${course.title}`;
    document.getElementById('drop-modal-details').textContent = `${course.units || course.credits} Units • ${course.instructor}`;

    dropConfirmDialog.showModal();

    // Focus least destructive control ("Cancel") (Rule 88)
    if (dropCancelBtn) {
      dropCancelBtn.focus();
    }
  }

  if (dropCancelBtn) {
    dropCancelBtn.addEventListener('click', () => {
      dropConfirmDialog.close();
      if (lastActiveElementBeforeModal && document.body.contains(lastActiveElementBeforeModal)) {
        lastActiveElementBeforeModal.focus();
      }
    });
  }

  if (dropConfirmBtn) {
    dropConfirmBtn.addEventListener('click', () => {
      if (!activePendingDropCourseId) return;

      const droppedCourse = student.registered.find(r => r.courseId === activePendingDropCourseId);
      const droppedCode = droppedCourse ? droppedCourse.code : 'course';

      // 1. Remove course from student registered list
      student.registered = student.registered.filter(r => r.courseId !== activePendingDropCourseId);
      saveStudent();

      // 2. Decrement course enrolled count
      const course = courses.find(c => c.id === activePendingDropCourseId);
      if (course) {
        course.enrolled = Math.max(0, course.enrolled - 1);
        if (course.enrolled < course.capacity) {
          course.status = 'open';
        }
        saveCourses();
      }

      dropConfirmDialog.close();

      // 3. Refresh views
      updateNavBadge();
      renderHomeStats();
      renderProfile();
      if (currentViewId === 'catalog') {
        renderCatalog();
      }

      // 4. Announce drop completion
      const totalUnits = calculateEnrolledUnits();
      announce(`Successfully dropped ${droppedCode}. Total registered units is now ${totalUnits}.`);

      // 5. Restore focus to table container or browse button
      const tableContainer = document.querySelector('.table-container');
      if (tableContainer) {
        tableContainer.focus();
      }
    });
  }

  // Open Course Details Modal
  function openCourseDetailsModal(courseId, triggeringElement) {
    if (!detailsDialog) return;
    lastActiveElementBeforeModal = triggeringElement || document.activeElement;

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    document.getElementById('details-modal-title').textContent = `${course.code}: ${course.title}`;
    document.getElementById('details-modal-dept').textContent = `${course.department} • ${course.level} Level`;

    const body = document.getElementById('details-modal-body');
    body.innerHTML = `
      <div class="details-meta-grid">
        <div><strong>Credits:</strong> ${course.credits} Quarter Units</div>
        <div><strong>Instructor:</strong> ${course.instructor}</div>
        <div><strong>Class Schedule:</strong> ${course.schedule}</div>
        <div><strong>Classroom:</strong> ${course.location}</div>
        <div><strong>Capacity:</strong> ${course.enrolled} / ${course.capacity} Students Enrolled</div>
        <div><strong>Waitlist:</strong> ${course.waitlist} Waiting</div>
      </div>

      <div class="details-desc-box">
        <h3>Course Description</h3>
        <p>${course.description}</p>
      </div>

      <div class="details-desc-box">
        <h3>Prerequisites &amp; Academic Advising</h3>
        <p>${course.prerequisites}</p>
      </div>

      <div class="details-desc-box">
        <h3>Grading Standards</h3>
        <p>Available for Letter Grade, Pass/No Pass, or Audit grading options. Final exam schedule corresponds with registrar published quarterly calendar.</p>
      </div>
    `;

    // Configure register button inside details modal
    if (detailsRegisterBtn) {
      const isEnrolled = isStudentEnrolled(course.id);
      if (isEnrolled) {
        detailsRegisterBtn.textContent = 'Enrolled in Course';
        detailsRegisterBtn.disabled = true;
      } else if (course.status === 'full') {
        detailsRegisterBtn.textContent = 'Course is Full';
        detailsRegisterBtn.disabled = true;
      } else if (course.status === 'waitlist') {
        detailsRegisterBtn.textContent = 'Join Course Waitlist';
        detailsRegisterBtn.disabled = false;
        detailsRegisterBtn.onclick = () => {
          detailsDialog.close();
          navigateTo('registration', { preselectCourseId: course.id });
        };
      } else {
        detailsRegisterBtn.textContent = 'Register for this Course';
        detailsRegisterBtn.disabled = false;
        detailsRegisterBtn.onclick = () => {
          detailsDialog.close();
          navigateTo('registration', { preselectCourseId: course.id });
        };
      }
    }

    detailsDialog.showModal();

    // Focus close button (least destructive, Rule 88)
    if (detailsCloseBtn) {
      detailsCloseBtn.focus();
    }
  }

  if (detailsCloseBtn) {
    detailsCloseBtn.addEventListener('click', () => {
      detailsDialog.close();
      if (lastActiveElementBeforeModal && document.body.contains(lastActiveElementBeforeModal)) {
        lastActiveElementBeforeModal.focus();
      }
    });
  }

  // Native Dialog Cancel/Close Events (Handles Escape Key)
  [regConfirmDialog, dropConfirmDialog, detailsDialog].forEach(dialog => {
    if (dialog) {
      dialog.addEventListener('cancel', () => {
        // Native Escape closes dialog
        if (lastActiveElementBeforeModal && document.body.contains(lastActiveElementBeforeModal)) {
          lastActiveElementBeforeModal.focus();
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 10. Student Profile View & Registered Courses Table (Rules 91-95)
  // --------------------------------------------------------------------------
  const profileDisplayName = document.getElementById('profile-display-name');
  const profileDisplayDegree = document.getElementById('profile-display-degree');
  const profileDisplayId = document.getElementById('profile-display-id');
  const profileDisplayEmail = document.getElementById('profile-display-email');
  const profileDisplayUnits = document.getElementById('profile-display-units');
  const profileAvatarInitials = document.getElementById('profile-avatar-initials');
  const progressUnitsText = document.getElementById('progress-units-text');
  const progressFill = document.getElementById('unit-progress-fill');
  const progressTrack = document.getElementById('unit-progress-bar');
  const progressBadge = document.getElementById('progress-status-badge');

  const registeredTbody = document.getElementById('registered-courses-tbody');
  const tableTotalUnits = document.getElementById('table-total-units');
  const tableEnrollmentStatus = document.getElementById('table-enrollment-status');
  const tableEmptyState = document.getElementById('table-empty-state');
  const tableContainer = document.querySelector('.table-container');

  const editProfileForm = document.getElementById('edit-profile-form');
  const profileEditName = document.getElementById('profile-edit-name');
  const profileEditEmail = document.getElementById('profile-edit-email');
  const profileEditPhone = document.getElementById('profile-edit-phone');
  const profileEditMajor = document.getElementById('profile-edit-major');
  const profileSaveStatus = document.getElementById('profile-save-status');

  function renderProfile() {
    // 1. Profile Overview
    if (profileDisplayName) profileDisplayName.textContent = student.name;
    if (profileDisplayDegree) profileDisplayDegree.textContent = `${student.degree || student.major} — Department of ${student.major}`;
    if (profileDisplayId) profileDisplayId.textContent = student.studentId;
    if (profileDisplayEmail) profileDisplayEmail.textContent = student.email;

    // Initials
    if (profileAvatarInitials && student.name) {
      const parts = student.name.split(' ');
      const initials = parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
      profileAvatarInitials.textContent = initials || 'ST';
    }

    // Units & Progress Bar
    const totalUnits = calculateEnrolledUnits();
    if (profileDisplayUnits) profileDisplayUnits.textContent = `${totalUnits} Units`;
    if (progressUnitsText) progressUnitsText.textContent = `${totalUnits} of ${student.maxUnits} Units`;

    const pct = Math.min(100, Math.round((totalUnits / student.maxUnits) * 100));
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressTrack) {
      progressTrack.setAttribute('aria-valuenow', totalUnits);
    }

    if (progressBadge) {
      if (totalUnits >= 12) {
        progressBadge.textContent = 'Full-Time (12+ units)';
        progressBadge.className = 'unit-progress-status badge-open';
      } else if (totalUnits >= 8) {
        progressBadge.textContent = 'Half-Time (8+ units)';
        progressBadge.className = 'unit-progress-status badge-open';
      } else if (totalUnits > 0) {
        progressBadge.textContent = 'Part-Time (<8 units)';
        progressBadge.className = 'unit-progress-status badge-waitlist';
      } else {
        progressBadge.textContent = 'Not Enrolled (0 units)';
        progressBadge.className = 'unit-progress-status badge-full';
      }
    }

    // 2. Render Registered Courses Data Table (Rules 91-95)
    if (registeredTbody) {
      registeredTbody.innerHTML = '';

      if (student.registered.length === 0) {
        if (tableContainer) tableContainer.hidden = true;
        if (tableEmptyState) tableEmptyState.hidden = false;
      } else {
        if (tableContainer) tableContainer.hidden = false;
        if (tableEmptyState) tableEmptyState.hidden = true;

        student.registered.forEach(regCourse => {
          const tr = document.createElement('tr');

          // Row Header <th scope="row"> for course code (Rule 92)
          // Action button accessible name: aria-label="Drop CSE 216" (Rule 93)
          tr.innerHTML = `
            <th scope="row">${regCourse.code}</th>
            <td>${regCourse.title}</td>
            <td><strong>${regCourse.units}</strong></td>
            <td>${regCourse.instructor}</td>
            <td>${regCourse.schedule}</td>
            <td>${regCourse.location}</td>
            <td><span class="badge badge-purple">${regCourse.gradingOption}</span></td>
            <td class="text-center">
              <button type="button" 
                      class="btn btn-danger btn-sm" 
                      data-action="drop" 
                      data-course-id="${regCourse.courseId}" 
                      aria-label="Drop ${regCourse.code}">
                Drop
              </button>
            </td>
          `;

          registeredTbody.appendChild(tr);
        });

        if (tableTotalUnits) tableTotalUnits.innerHTML = `<strong>${totalUnits} Units</strong>`;
        if (tableEnrollmentStatus) {
          tableEnrollmentStatus.innerHTML = `Status: <strong>${totalUnits >= 8 ? 'Full-Time' : 'Part-Time'} (${student.registered.length} courses enrolled)</strong>`;
        }
      }
    }

    // 3. Edit Profile Form Inputs
    if (profileEditName) profileEditName.value = student.name;
    if (profileEditEmail) profileEditEmail.value = student.email;
    if (profileEditPhone) profileEditPhone.value = student.phone || '';
    if (profileEditMajor) profileEditMajor.value = student.major;
  }

  // Handle Edit Profile Form Save
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newName = profileEditName.value.trim();
      const newEmail = profileEditEmail.value.trim();
      const newPhone = profileEditPhone.value.trim();
      const newMajor = profileEditMajor.value.trim();

      if (!newName || !newEmail || !newMajor) {
        announce('Profile update failed. Please fill in all required fields.', true);
        return;
      }

      student.name = newName;
      student.email = newEmail;
      student.phone = newPhone;
      student.major = newMajor;
      student.degree = `M.S. in ${newMajor}`;
      saveStudent();

      renderProfile();

      if (profileSaveStatus) {
        profileSaveStatus.hidden = false;
        setTimeout(() => {
          profileSaveStatus.hidden = true;
        }, 4000);
      }

      announce('Student profile changes saved successfully.');
    });
  }

  // --------------------------------------------------------------------------
  // 11. Helper Functions
  // --------------------------------------------------------------------------
  function calculateEnrolledUnits() {
    return student.registered.reduce((acc, c) => acc + (c.units || 0), 0);
  }

  function isStudentEnrolled(courseId) {
    return student.registered.some(r => r.courseId === courseId);
  }

  function updateNavBadge() {
    const navBadge = document.getElementById('nav-registered-count');
    if (navBadge) {
      const count = student.registered.length;
      navBadge.textContent = count;
      navBadge.setAttribute('aria-label', `${count} enrolled course${count === 1 ? '' : 's'}`);
    }
  }

  // --------------------------------------------------------------------------
  // 12. Application Initialization
  // --------------------------------------------------------------------------
  function initApp() {
    // 1. Initial renders
    updateNavBadge();
    renderHomeStats();
    renderFeaturedCourses();

    // 2. Determine initial view from URL hash
    const initialHash = window.location.hash.replace('#', '') || 'home';
    if (views[initialHash]) {
      navigateTo(initialHash, { skipFocus: true });
    } else {
      navigateTo('home', { skipFocus: true });
    }
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
