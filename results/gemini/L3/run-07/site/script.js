/**
 * Triton University Course Registration System
 * Accessible, Responsive Web Application (WCAG 2.2 Level AA Compliant)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. SAMPLE DATA (15 Realistic University Courses)
  // =========================================================================
  const INITIAL_COURSES = [
    {
      id: 'CSE216',
      code: 'CSE 216',
      title: 'Web Application Development',
      dept: 'CSE',
      level: 'Upper',
      units: 4.0,
      instructor: 'Prof. Elena Vance',
      schedule: 'Tue / Thu 10:00 AM – 11:50 AM',
      location: 'Warren Hall 210',
      format: 'In-Person',
      seatsTotal: 35,
      seatsAvailable: 16,
      waitlistCount: 0,
      prereq: 'CSE 100 or consent of instructor',
      description: 'Comprehensive study of accessible, responsive full-stack web applications, front-end architecture, API integrations, and modern web standards.'
    },
    {
      id: 'CSE101',
      code: 'CSE 101',
      title: 'Design & Analysis of Algorithms',
      dept: 'CSE',
      level: 'Upper',
      units: 4.0,
      instructor: 'Prof. Sanjay Gupta',
      schedule: 'Tue / Thu 12:30 PM – 1:50 PM',
      location: 'Centaur Hall 105',
      format: 'In-Person',
      seatsTotal: 150,
      seatsAvailable: 12,
      waitlistCount: 0,
      prereq: 'CSE 21 or MATH 154, and CSE 100',
      description: 'Design paradigms including divide-and-conquer, greedy heuristics, dynamic programming, graph algorithms, and NP-completeness proofs.'
    },
    {
      id: 'COGS120',
      code: 'COGS 120',
      title: 'Human-Computer Interaction Design',
      dept: 'COGS',
      level: 'Upper',
      units: 4.0,
      instructor: 'Prof. David Chen',
      schedule: 'Tue / Thu 9:30 AM – 10:50 AM',
      location: 'Cognitive Science Bldg 001',
      format: 'In-Person',
      seatsTotal: 60,
      seatsAvailable: 22,
      waitlistCount: 0,
      prereq: 'COGS 1 or COGS 10',
      description: 'User-centered design methodologies, cognitive ergonomics, prototyping accessible interactive technologies, and empirical user testing.'
    },
    {
      id: 'MATH180A',
      code: 'MATH 180A',
      title: 'Introduction to Probability',
      dept: 'MATH',
      level: 'Upper',
      units: 4.0,
      instructor: 'Prof. Sarah Miller',
      schedule: 'Mon / Wed / Fri 9:00 AM – 9:50 AM',
      location: 'Applied Physics & Math 2301',
      format: 'In-Person',
      seatsTotal: 80,
      seatsAvailable: 5,
      waitlistCount: 0,
      prereq: 'MATH 20C or MATH 31BH',
      description: 'Axioms of probability, conditional probability, discrete and continuous random variables, Markov chains, and the central limit theorem.'
    },
    {
      id: 'DSC140A',
      code: 'DSC 140A',
      title: 'Probabilistic Modeling for Data Science',
      dept: 'DSC',
      level: 'Upper',
      units: 4.0,
      instructor: 'Prof. Maya Patel',
      schedule: 'Mon / Wed / Fri 2:00 PM – 3:20 PM',
      location: 'Data Science & AI 114',
      format: 'Hybrid',
      seatsTotal: 50,
      seatsAvailable: 14,
      waitlistCount: 0,
      prereq: 'DSC 40B and DSC 80',
      description: 'Theoretical foundations of probabilistic inference, Bayesian networks, maximum likelihood estimators, and machine learning models.'
    },
    {
      id: 'CSE110',
      code: 'CSE 110',
      title: 'Software Engineering & Agile Systems',
      dept: 'CSE',
      level: 'Upper',
      units: 4.0,
      instructor: 'Prof. Thomas Wright',
      schedule: 'Tue / Thu 2:00 PM – 3:20 PM',
      location: 'Center Hall 109',
      format: 'In-Person',
      seatsTotal: 120,
      seatsAvailable: 0,
      waitlistCount: 6,
      prereq: 'CSE 100',
      description: 'Team software development utilizing agile methodologies, continuous integration, test-driven development, and architectural design patterns.'
    },
    {
      id: 'DES101',
      code: 'DES 101',
      title: 'Visual Communication & Design Foundations',
      dept: 'DES',
      level: 'Lower',
      units: 4.0,
      instructor: 'Prof. Chloe Dupont',
      schedule: 'Mon / Wed 4:00 PM – 5:50 PM',
      location: 'Visual Arts Facility 280',
      format: 'In-Person',
      seatsTotal: 30,
      seatsAvailable: 10,
      waitlistCount: 0,
      prereq: 'None',
      description: 'Fundamental principles of visual hierarchy, accessible typography, color harmony, composition, and digital illustration tools.'
    },
    {
      id: 'BILD1',
      code: 'BILD 1',
      title: 'The Cell & Molecular Biology',
      dept: 'BILD',
      level: 'Lower',
      units: 4.0,
      instructor: 'Prof. Robert King',
      schedule: 'Mon / Wed / Fri 11:00 AM – 11:50 AM',
      location: 'Pacific Hall 101',
      format: 'In-Person',
      seatsTotal: 250,
      seatsAvailable: 38,
      waitlistCount: 0,
      prereq: 'CHEM 6A or equivalent',
      description: 'Introduction to cell structure and function, molecular energetics, genetic transfer, and fundamental biological macromolecules.'
    },
    {
      id: 'CSE150A',
      code: 'CSE 150A',
      title: 'Introduction to Artificial Intelligence',
      dept: 'CSE',
      level: 'Upper',
      units: 4.0,
      instructor: 'Prof. Li Zhang',
      schedule: 'Tue / Thu 3:30 PM – 4:50 PM',
      location: 'Cognitive Science 003',
      format: 'Hybrid',
      seatsTotal: 90,
      seatsAvailable: 8,
      waitlistCount: 0,
      prereq: 'CSE 100 and MATH 180A',
      description: 'Search algorithms, adversarial games, constraint satisfaction, probabilistic reasoning, and foundational neural networks.'
    },
    {
      id: 'MATH20C',
      code: 'MATH 20C',
      title: 'Calculus & Analytic Geometry for Science',
      dept: 'MATH',
      level: 'Lower',
      units: 4.0,
      instructor: 'Prof. James Morales',
      schedule: 'Mon / Wed / Fri 1:00 PM – 1:50 PM',
      location: 'Galbraith Hall 242',
      format: 'In-Person',
      seatsTotal: 120,
      seatsAvailable: 24,
      waitlistCount: 0,
      prereq: 'MATH 20B or AP Calculus BC',
      description: 'Vector geometry, partial derivatives, directional derivatives, multiple integration, and applications in scientific modeling.'
    },
    {
      id: 'DSC180A',
      code: 'DSC 180A',
      title: 'Data Science Senior Capstone Project',
      dept: 'DSC',
      level: 'Graduate',
      units: 4.0,
      instructor: 'Prof. Jessica Wu',
      schedule: 'Mon 6:00 PM – 8:50 PM',
      location: 'San Diego Supercomputer Ctr',
      format: 'Online',
      seatsTotal: 40,
      seatsAvailable: 4,
      waitlistCount: 0,
      prereq: 'DSC 102 and Senior Standing',
      description: 'Mentored team capstone project involving real-world multi-terabyte data collection, pipeline development, analysis, and ethical reporting.'
    },
    {
      id: 'COGS10',
      code: 'COGS 10',
      title: 'Cognitive Neuroscience & the Mind',
      dept: 'COGS',
      level: 'Lower',
      units: 4.0,
      instructor: 'Prof. Alan Turing',
      schedule: 'Tue / Thu 11:00 AM – 12:20 PM',
      location: 'Price Center Theater',
      format: 'In-Person',
      seatsTotal: 200,
      seatsAvailable: 45,
      waitlistCount: 0,
      prereq: 'None',
      description: 'Exploration of human perception, memory, language, and executive control through neural mechanisms and cognitive experimentation.'
    },
    {
      id: 'CSE230',
      code: 'CSE 230',
      title: 'Programming Languages & Formal Verification',
      dept: 'CSE',
      level: 'Graduate',
      units: 4.0,
      instructor: 'Prof. Nadia Rostova',
      schedule: 'Tue / Thu 10:00 AM – 11:20 AM',
      location: 'Franklin Hall 120',
      format: 'In-Person',
      seatsTotal: 30,
      seatsAvailable: 11,
      waitlistCount: 0,
      prereq: 'Graduate standing or consent of instructor',
      description: 'Type systems, operational semantics, functional programming paradigms, static analysis, and computer-assisted mathematical proofs.'
    },
    {
      id: 'DES115',
      code: 'DES 115',
      title: 'Accessible & Inclusive Digital Systems',
      dept: 'DES',
      level: 'Upper',
      units: 4.0,
      instructor: 'Prof. Marcus Bell',
      schedule: 'Wed 2:00 PM – 4:50 PM',
      location: 'Design Studio Lab 14',
      format: 'In-Person',
      seatsTotal: 25,
      seatsAvailable: 7,
      waitlistCount: 0,
      prereq: 'DES 101 or COGS 120',
      description: 'Applied study of WCAG 2.2 accessibility, assistive tech emulation, screen reader navigation, high-contrast visual ergonomics, and inclusive design.'
    },
    {
      id: 'MATH109',
      code: 'MATH 109',
      title: 'Mathematical Reasoning & Proofs',
      dept: 'MATH',
      level: 'Upper',
      units: 4.0,
      instructor: 'Prof. Rachel Adams',
      schedule: 'Mon / Wed / Fri 12:00 PM – 12:50 PM',
      location: 'Mayer Hall 2623',
      format: 'Online',
      seatsTotal: 65,
      seatsAvailable: 19,
      waitlistCount: 0,
      prereq: 'MATH 20C or MATH 31BH',
      description: 'Introduction to mathematical rigor: set theory, propositional logic, mathematical induction, relations, equivalence classes, and cardinality.'
    }
  ];

  // Initial student enrollment for Alex Rivera
  const INITIAL_ENROLLED = [
    {
      courseId: 'CSE101',
      term: 'Fall 2026',
      grading: 'Letter Grade',
      registeredAt: '2026-10-15',
      isWaitlisted: false
    },
    {
      courseId: 'COGS120',
      term: 'Fall 2026',
      grading: 'Letter Grade',
      registeredAt: '2026-10-15',
      isWaitlisted: false
    },
    {
      courseId: 'MATH180A',
      term: 'Fall 2026',
      grading: 'Pass / No Pass',
      registeredAt: '2026-10-16',
      isWaitlisted: false
    }
  ];

  const STORAGE_KEY = 'triton_course_portal_state_v1';

  // =========================================================================
  // 2. STATE STORE & PERSISTENCE
  // =========================================================================
  const state = {
    courses: [],
    registered: [],
    student: {
      fullName: 'Alex Rivera',
      preferredName: 'Alex',
      email: 'arivera@triton.university.edu',
      phone: '(858) 534-2230',
      address: '9500 Gilman Dr, Warren Residence Hall #304, La Jolla, CA 92093',
      notifyEnroll: true,
      notifyWaitlist: true,
      notifyDeadlines: true
    },
    filters: {
      search: '',
      department: 'ALL',
      level: 'ALL',
      format: 'ALL',
      availability: 'ALL'
    },
    activeView: 'home',
    pendingRegistration: null, // Holds course data pending modal confirmation
    pendingDrop: null,         // Holds course data pending drop confirmation
    lastActiveElement: null    // Preserves focus trigger for accessible dialogs (WCAG 2.4.3)
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state.courses = parsed.courses || INITIAL_COURSES;
        state.registered = parsed.registered || INITIAL_ENROLLED;
        state.student = { ...state.student, ...(parsed.student || {}) };
        return;
      }
    } catch (e) {
      console.warn('Storage unavailable or corrupted, using defaults:', e);
    }
    state.courses = JSON.parse(JSON.stringify(INITIAL_COURSES));
    state.registered = JSON.parse(JSON.stringify(INITIAL_ENROLLED));
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          courses: state.courses,
          registered: state.registered,
          student: state.student
        })
      );
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  // =========================================================================
  // 3. ACCESSIBLE ANNOUNCEMENTS (WCAG 4.1.3)
  // =========================================================================
  const liveAnnouncer = document.getElementById('live-announcer');
  const liveAlert = document.getElementById('live-alert');

  function announce(message, priority = 'polite') {
    const target = priority === 'assertive' ? liveAlert : liveAnnouncer;
    if (!target) return;
    // Clear first to guarantee screen readers announce identical sequential messages
    target.textContent = '';
    setTimeout(() => {
      target.textContent = message;
    }, 50);
  }

  // =========================================================================
  // 4. ROUTER / VIEW CONTROLLER (WCAG 2.4.2, 2.4.4, 2.4.5)
  // =========================================================================
  const views = {
    home: {
      panelId: 'view-home',
      navId: 'nav-home',
      title: 'Home - Triton University Course Registration',
      headingId: 'home-title'
    },
    catalog: {
      panelId: 'view-catalog',
      navId: 'nav-catalog',
      title: 'Course Catalog - Triton University Course Registration',
      headingId: 'catalog-title'
    },
    register: {
      panelId: 'view-register',
      navId: 'nav-register',
      title: 'Course Registration & Schedule - Triton University Course Registration',
      headingId: 'register-title'
    },
    profile: {
      panelId: 'view-profile',
      navId: 'nav-profile',
      title: 'Student Profile - Triton University Course Registration',
      headingId: 'profile-title'
    }
  };

  function navigateTo(viewKey, shouldFocus = true) {
    if (!views[viewKey]) {
      viewKey = 'home';
    }

    state.activeView = viewKey;
    const viewConfig = views[viewKey];

    // 1. Hide all panels, show target panel (WCAG 1.3.1)
    Object.keys(views).forEach(key => {
      const panel = document.getElementById(views[key].panelId);
      if (panel) {
        if (key === viewKey) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      }
    });

    // 2. Update navigation aria-current="page" (WCAG 2.1)
    Object.keys(views).forEach(key => {
      const link = document.getElementById(views[key].navId);
      if (link) {
        if (key === viewKey) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      }
    });

    // 3. Update descriptive page title (WCAG 2.4.2)
    document.title = viewConfig.title;

    // 4. Close mobile menu if open
    closeMobileNav();

    // 5. Scroll smoothly to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 6. Move keyboard focus to view's h1 (WCAG rule 45)
    if (shouldFocus) {
      setTimeout(() => {
        const h1 = document.getElementById(viewConfig.headingId);
        if (h1) {
          h1.focus();
        } else {
          const main = document.getElementById('main-content');
          if (main) main.focus();
        }
      }, 50);
    }

    // 7. Announce view change for screen readers
    const viewNameMap = {
      home: 'Dashboard Home',
      catalog: 'Course Catalog',
      register: 'Course Registration',
      profile: 'Student Profile'
    };
    announce(`Navigated to ${viewNameMap[viewKey]} page`);

    // 8. Re-render dynamic components for this view
    if (viewKey === 'catalog') {
      renderCatalog();
    } else if (viewKey === 'register') {
      renderRegistrationFormOptions();
      renderRegisteredTable();
    } else if (viewKey === 'home') {
      renderHomeSchedule();
    }
  }

  function handleHashChange() {
    const hash = window.location.hash.replace('#', '').trim();
    if (views[hash]) {
      navigateTo(hash, true);
    } else if (hash === '' || hash === 'home') {
      navigateTo('home', false);
    }
  }

  // =========================================================================
  // 5. MOBILE NAVIGATION TOGGLE (WCAG 4.1.2, rule 70-71)
  // =========================================================================
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  function openMobileNav() {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Menu - Close navigation');
    primaryNav.classList.add('is-open');
  }

  function closeMobileNav() {
    if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Menu - Open navigation');
      primaryNav.classList.remove('is-open');
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close on Escape and return focus to toggle button (WCAG rule 71)
    primaryNav.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeMobileNav();
        navToggle.focus();
      }
    });
  }

  // Close mobile nav on outside click
  document.addEventListener('click', e => {
    if (
      primaryNav &&
      primaryNav.classList.contains('is-open') &&
      !primaryNav.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  // =========================================================================
  // 6. ENROLLMENT HELPERS & COMPUTED METRICS
  // =========================================================================
  function isCourseRegistered(courseId) {
    return state.registered.some(r => r.courseId === courseId);
  }

  function getTotalRegisteredUnits() {
    return state.registered.reduce((acc, r) => {
      const course = state.courses.find(c => c.id === r.courseId);
      return acc + (course ? course.units : 0);
    }, 0);
  }

  function updateGlobalBadges() {
    const totalUnits = getTotalRegisteredUnits();
    const count = state.registered.length;

    // Header nav badge
    const navBadge = document.getElementById('nav-reg-count');
    if (navBadge) {
      navBadge.textContent = count;
      navBadge.setAttribute('aria-label', `${count} courses registered`);
    }

    // Home stats
    const homeUnits = document.getElementById('home-stat-units');
    if (homeUnits) {
      homeUnits.textContent = `${totalUnits} / 18`;
    }

    // Registration page unit tracker
    const regUnits = document.getElementById('reg-current-units');
    if (regUnits) {
      regUnits.textContent = totalUnits.toFixed(1);
    }

    const unitBar = document.getElementById('unit-progress-fill');
    if (unitBar) {
      const pct = Math.min(100, Math.round((totalUnits / 18) * 100));
      unitBar.style.width = `${pct}%`;
    }

    const unitMsg = document.getElementById('unit-status-msg');
    if (unitMsg) {
      if (totalUnits >= 12) {
        unitMsg.innerHTML = '<span class="status-check-icon" aria-hidden="true">✔️</span><span>You meet full-time enrollment requirements (12.0 units minimum).</span>';
        unitMsg.className = 'status-alert-note';
      } else {
        unitMsg.innerHTML = '<span class="status-check-icon" aria-hidden="true">ℹ️</span><span>Part-time status. Add ' + (12 - totalUnits) + ' more units for full-time financial aid.</span>';
        unitMsg.className = 'status-alert-note status-alert-note-warning';
      }
    }
  }

  // =========================================================================
  // 7. COURSE CATALOG RENDERING & FILTERING (WCAG 1.3.1, 2.4.4, 2.5.3, 4.1.2)
  // =========================================================================
  const catalogList = document.getElementById('catalog-course-list');
  const emptyState = document.getElementById('catalog-empty-state');
  const resultsBadge = document.getElementById('results-count-badge');
  const filterSummary = document.getElementById('active-filter-summary');
  const searchInput = document.getElementById('course-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const deptSelect = document.getElementById('filter-dept');
  const levelSelect = document.getElementById('filter-level');
  const formatSelect = document.getElementById('filter-format');
  const availSelect = document.getElementById('filter-availability');
  const resetFiltersBtn = document.getElementById('filter-reset-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');

  function getFilteredCourses() {
    const q = state.filters.search.toLowerCase().trim();
    const dept = state.filters.department;
    const level = state.filters.level;
    const format = state.filters.format;
    const avail = state.filters.availability;

    return state.courses.filter(course => {
      // Search matching (code, title, instructor, description, dept)
      if (q) {
        const matchText = `${course.code} ${course.title} ${course.instructor} ${course.dept} ${course.description}`.toLowerCase();
        if (!matchText.includes(q)) return false;
      }

      // Department filter
      if (dept !== 'ALL' && course.dept !== dept) return false;

      // Level filter
      if (level !== 'ALL' && course.level !== level) return false;

      // Format filter
      if (format !== 'ALL' && course.format !== format) return false;

      // Availability filter
      if (avail === 'open' && course.seatsAvailable <= 0) return false;
      if (avail === 'waitlist' && course.seatsAvailable > 0) return false;

      return true;
    });
  }

  function renderCatalog(announceResults = false) {
    if (!catalogList) return;

    const filtered = getFilteredCourses();
    catalogList.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.hidden = false;
      catalogList.hidden = true;
      if (resultsBadge) resultsBadge.textContent = '0 courses found';
      if (filterSummary) filterSummary.textContent = 'No courses match current criteria';
      if (announceResults) announce('0 courses found matching your criteria.');
      return;
    }

    emptyState.hidden = true;
    catalogList.hidden = false;

    if (resultsBadge) {
      resultsBadge.textContent = `${filtered.length} course${filtered.length === 1 ? '' : 's'} found`;
    }

    if (filterSummary) {
      const activeDepts = state.filters.department === 'ALL' ? 'all departments' : state.filters.department;
      filterSummary.textContent = `Showing ${filtered.length} of ${state.courses.length} courses (${activeDepts})`;
    }

    if (announceResults) {
      announce(`${filtered.length} courses found matching your criteria.`);
    }

    // Populate course cards (WCAG 1.3.1: <ul> of <article> elements, each with heading)
    filtered.forEach(course => {
      const isEnrolled = isCourseRegistered(course.id);
      const isFull = course.seatsAvailable === 0;

      const li = document.createElement('li');
      li.className = 'course-card-wrapper';

      // Accessible status badge
      let statusBadgeHtml = '';
      if (isEnrolled) {
        statusBadgeHtml = `<span class="status-badge status-badge-registered"><span aria-hidden="true">✓</span> Registered</span>`;
      } else if (isFull) {
        statusBadgeHtml = `<span class="status-badge status-badge-waitlist"><span aria-hidden="true">⏳</span> Full &ndash; Waitlist (${course.waitlistCount})</span>`;
      } else {
        statusBadgeHtml = `<span class="status-badge status-badge-open"><span aria-hidden="true">🟢</span> Open (${course.seatsAvailable} seats left)</span>`;
      }

      // Action button with accessible name starting with visible text (WCAG 2.4.4, 2.5.3)
      let actionBtnHtml = '';
      if (isEnrolled) {
        actionBtnHtml = `
          <button type="button" 
                  class="btn btn-secondary" 
                  disabled 
                  aria-label="Already registered for ${course.code}: ${course.title}">
            <span aria-hidden="true">✓</span> Enrolled
          </button>
        `;
      } else if (isFull) {
        actionBtnHtml = `
          <button type="button" 
                  class="btn btn-warning btn-course-register" 
                  data-course-id="${course.id}" 
                  data-action="waitlist"
                  aria-label="Join Waitlist for ${course.code}: ${course.title}">
            Join Waitlist
          </button>
        `;
      } else {
        actionBtnHtml = `
          <button type="button" 
                  class="btn btn-primary btn-course-register" 
                  data-course-id="${course.id}" 
                  data-action="register"
                  aria-label="Register Course: ${course.code} - ${course.title}">
            Register Course
          </button>
        `;
      }

      li.innerHTML = `
        <article class="course-card" aria-labelledby="card-heading-${course.id}">
          <div class="course-card-top">
            <div class="course-badges-group">
              <span class="dept-badge dept-badge-${course.dept}">${course.dept}</span>
              <span class="format-badge">${course.format}</span>
              <span class="format-badge">${course.level} Div</span>
            </div>
            ${statusBadgeHtml}
          </div>

          <h3 id="card-heading-${course.id}" class="course-code-heading">
            ${course.code}
          </h3>
          <p class="course-card-title">${course.title}</p>

          <p class="course-desc-text">${course.description}</p>

          <ul class="course-meta-list" role="list">
            <li class="course-meta-item">
              <span class="course-meta-label">Credits:</span>
              <span><strong>${course.units.toFixed(1)} Units</strong></span>
            </li>
            <li class="course-meta-item">
              <span class="course-meta-label">Instructor:</span>
              <span>${course.instructor}</span>
            </li>
            <li class="course-meta-item">
              <span class="course-meta-label">Schedule:</span>
              <span>${course.schedule}</span>
            </li>
            <li class="course-meta-item">
              <span class="course-meta-label">Location:</span>
              <span>${course.location}</span>
            </li>
            <li class="course-meta-item">
              <span class="course-meta-label">Prerequisites:</span>
              <span>${course.prereq}</span>
            </li>
          </ul>

          <div class="course-card-actions">
            ${actionBtnHtml}
          </div>
        </article>
      `;

      catalogList.appendChild(li);
    });
  }

  // Bind catalog filter controls
  let searchDebounceTimer = null;
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      state.filters.search = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.hidden = e.target.value.length === 0;
      }
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        renderCatalog(true);
      }, 300);
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.filters.search = '';
      searchClearBtn.hidden = true;
      searchInput.focus();
      renderCatalog(true);
    });
  }

  [deptSelect, levelSelect, formatSelect, availSelect].forEach(select => {
    if (select) {
      select.addEventListener('change', () => {
        state.filters[select.name] = select.value;
        renderCatalog(true);
      });
    }
  });

  function resetAllFilters() {
    state.filters = {
      search: '',
      department: 'ALL',
      level: 'ALL',
      format: 'ALL',
      availability: 'ALL'
    };
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.hidden = true;
    if (deptSelect) deptSelect.value = 'ALL';
    if (levelSelect) levelSelect.value = 'ALL';
    if (formatSelect) formatSelect.value = 'ALL';
    if (availSelect) availSelect.value = 'ALL';
    renderCatalog(true);
    announce('All catalog filters have been reset.');
  }

  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

  // Delegate click for course card Register / Waitlist buttons
  if (catalogList) {
    catalogList.addEventListener('click', e => {
      const btn = e.target.closest('.btn-course-register');
      if (!btn) return;

      const courseId = btn.getAttribute('data-course-id');
      const course = state.courses.find(c => c.id === courseId);
      if (!course) return;

      openRegistrationModal(course, 'Letter Grade', btn);
    });
  }

  // =========================================================================
  // 8. REGISTRATION PAGE FORM & OPTIONS (WCAG 1.3.1, 3.3.1, 3.3.2, 3.3.3)
  // =========================================================================
  const regForm = document.getElementById('course-registration-form');
  const regCourseSelect = document.getElementById('reg-course-select');
  const regAgreement = document.getElementById('reg-agreement');
  const regErrorSummary = document.getElementById('reg-error-summary');
  const regErrorList = document.getElementById('reg-error-list');
  const regCourseError = document.getElementById('reg-course-error');
  const regAgreementError = document.getElementById('reg-agreement-error');

  function renderRegistrationFormOptions() {
    if (!regCourseSelect) return;

    const currentVal = regCourseSelect.value;
    regCourseSelect.innerHTML = '<option value="">-- Choose a course from the catalog --</option>';

    state.courses.forEach(c => {
      const enrolled = isCourseRegistered(c.id);
      const isFull = c.seatsAvailable <= 0;
      const opt = document.createElement('option');
      opt.value = c.id;

      let suffix = '';
      if (enrolled) {
        suffix = ' [Already Enrolled]';
        opt.disabled = true;
      } else if (isFull) {
        suffix = ' [Full - Waitlist]';
      } else {
        suffix = ` [${c.seatsAvailable} seats open]`;
      }

      opt.textContent = `${c.code}: ${c.title} (${c.units.toFixed(1)} units)${suffix}`;
      regCourseSelect.appendChild(opt);
    });

    if (currentVal && !isCourseRegistered(currentVal)) {
      regCourseSelect.value = currentVal;
    }
  }

  function clearRegistrationFormErrors() {
    if (regErrorSummary) regErrorSummary.hidden = true;
    if (regErrorList) regErrorList.innerHTML = '';
    if (regCourseError) {
      regCourseError.hidden = true;
      regCourseError.textContent = '';
    }
    if (regCourseSelect) {
      regCourseSelect.removeAttribute('aria-invalid');
    }
    if (regAgreementError) {
      regAgreementError.hidden = true;
      regAgreementError.textContent = '';
    }
    if (regAgreement) {
      regAgreement.removeAttribute('aria-invalid');
    }
  }

  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      clearRegistrationFormErrors();

      const errors = [];
      const courseId = regCourseSelect.value;
      const agreementChecked = regAgreement.checked;
      const gradingOption = regForm.elements['gradingOption'].value || 'Letter Grade';

      // Validate course selection
      if (!courseId) {
        const msg = 'Select a valid course from the dropdown catalog to register.';
        errors.push({ id: 'reg-course-select', message: msg });
        regCourseError.textContent = msg;
        regCourseError.hidden = false;
        regCourseSelect.setAttribute('aria-invalid', 'true');
      } else if (isCourseRegistered(courseId)) {
        const msg = 'You are already registered for this course.';
        errors.push({ id: 'reg-course-select', message: msg });
        regCourseError.textContent = msg;
        regCourseError.hidden = false;
        regCourseSelect.setAttribute('aria-invalid', 'true');
      }

      // Check credit unit limit
      if (courseId && !isCourseRegistered(courseId)) {
        const course = state.courses.find(c => c.id === courseId);
        const currentUnits = getTotalRegisteredUnits();
        if (course && currentUnits + course.units > 18.0) {
          const msg = `Adding ${course.code} (${course.units} units) exceeds the maximum limit of 18.0 units per quarter (Current: ${currentUnits}).`;
          errors.push({ id: 'reg-course-select', message: msg });
          regCourseError.textContent = msg;
          regCourseError.hidden = false;
          regCourseSelect.setAttribute('aria-invalid', 'true');
        }
      }

      // Validate policy agreement checkbox
      if (!agreementChecked) {
        const msg = 'You must confirm that you meet prerequisites and agree to enrollment policies.';
        errors.push({ id: 'reg-agreement', message: msg });
        regAgreementError.textContent = msg;
        regAgreementError.hidden = false;
        regAgreement.setAttribute('aria-invalid', 'true');
      }

      // Handle validation errors (WCAG 3.3.1: focus to error summary or first invalid field)
      if (errors.length > 0) {
        regErrorSummary.hidden = false;
        regErrorList.innerHTML = '';
        errors.forEach(err => {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = `#${err.id}`;
          link.textContent = err.message;
          link.addEventListener('click', ev => {
            ev.preventDefault();
            const el = document.getElementById(err.id);
            if (el) el.focus();
          });
          li.appendChild(link);
          regErrorList.appendChild(li);
        });

        regErrorSummary.focus();
        announce(`Form submission failed with ${errors.length} errors. Please correct the highlighted fields.`, 'assertive');
        return;
      }

      // Open accessible confirmation modal
      const course = state.courses.find(c => c.id === courseId);
      const submitBtn = document.getElementById('reg-submit-btn');
      openRegistrationModal(course, gradingOption, submitBtn);
    });
  }

  // =========================================================================
  // 9. DATA TABLE OF REGISTERED COURSES (WCAG 1.3.1, 1.4.10, 2.4.4, 2.5.3)
  // =========================================================================
  const regTableBody = document.getElementById('registered-table-body');
  const tableTotalUnits = document.getElementById('table-total-units');
  const registeredCountText = document.getElementById('registered-count-text');
  const tableEmptyNotice = document.getElementById('table-empty-notice');
  const regTableWrapper = document.querySelector('.table-responsive-wrapper');

  function renderRegisteredTable() {
    if (!regTableBody) return;

    regTableBody.innerHTML = '';
    const registeredCourses = state.registered;
    const totalUnits = getTotalRegisteredUnits();

    if (tableTotalUnits) tableTotalUnits.textContent = `${totalUnits.toFixed(1)} Units`;
    if (registeredCountText) registeredCountText.textContent = `${registeredCourses.length} course${registeredCourses.length === 1 ? '' : 's'}`;

    if (registeredCourses.length === 0) {
      if (tableEmptyNotice) tableEmptyNotice.hidden = false;
      if (regTableWrapper) regTableWrapper.hidden = true;
      updateGlobalBadges();
      return;
    }

    if (tableEmptyNotice) tableEmptyNotice.hidden = true;
    if (regTableWrapper) regTableWrapper.hidden = false;

    registeredCourses.forEach(r => {
      const course = state.courses.find(c => c.id === r.courseId);
      if (!course) return;

      const tr = document.createElement('tr');

      const statusBadge = r.isWaitlisted
        ? `<span class="badge badge-warning" aria-label="Status: Waitlisted">Waitlisted</span>`
        : `<span class="badge badge-success" aria-label="Status: Enrolled">Enrolled</span>`;

      // WCAG 1.3.1: <th scope="row"> for course code row header
      // WCAG 2.4.4, 2.5.3: Drop button with specific course name in accessible name
      tr.innerHTML = `
        <th scope="row">${course.code}</th>
        <td>${course.title}</td>
        <td><span class="dept-badge dept-badge-${course.dept}">${course.dept}</span></td>
        <td>${course.units.toFixed(1)}</td>
        <td>${r.grading}</td>
        <td>${course.instructor}</td>
        <td>
          <div>${course.schedule}</div>
          <small class="form-hint">${course.location}</small>
        </td>
        <td>${statusBadge}</td>
        <td class="text-center">
          <button type="button" 
                  class="btn btn-danger-outline btn-sm btn-drop-course" 
                  data-course-id="${course.id}"
                  aria-label="Drop ${course.code}: ${course.title}">
            Drop Course
          </button>
        </td>
      `;

      regTableBody.appendChild(tr);
    });

    updateGlobalBadges();
  }

  // Handle Drop Button Click from Data Table
  if (regTableBody) {
    regTableBody.addEventListener('click', e => {
      const btn = e.target.closest('.btn-drop-course');
      if (!btn) return;

      const courseId = btn.getAttribute('data-course-id');
      const course = state.courses.find(c => c.id === courseId);
      if (!course) return;

      openDropModal(course, btn);
    });
  }

  // =========================================================================
  // 10. HOME SCHEDULE SUMMARY CARDS
  // =========================================================================
  const homeScheduleList = document.getElementById('home-schedule-list');

  function renderHomeSchedule() {
    if (!homeScheduleList) return;

    homeScheduleList.innerHTML = '';
    if (state.registered.length === 0) {
      homeScheduleList.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <p>No courses registered yet for Fall 2026.</p>
          <a href="#catalog" class="btn btn-primary btn-sm">Browse Catalog</a>
        </div>
      `;
      return;
    }

    state.registered.forEach(r => {
      const course = state.courses.find(c => c.id === r.courseId);
      if (!course) return;

      const card = document.createElement('div');
      card.className = 'summary-schedule-card';
      card.innerHTML = `
        <div class="summary-schedule-header">
          <span class="summary-course-code">${course.code}</span>
          <span class="summary-course-units">${course.units.toFixed(1)} Units &bull; ${r.grading}</span>
        </div>
        <h3 class="summary-course-title">${course.title}</h3>
        <div class="summary-course-time">
          <span aria-hidden="true">📅</span>
          <span>${course.schedule} (${course.location})</span>
        </div>
      `;
      homeScheduleList.appendChild(card);
    });

    updateGlobalBadges();
  }

  // =========================================================================
  // 11. CONFIRMATION MODALS (Native <dialog> with showModal, WCAG 4.1.2, rule 85-90)
  // =========================================================================
  const regConfirmDialog = document.getElementById('registration-confirm-dialog');
  const regDialogCloseBtn = document.getElementById('reg-dialog-x-btn');
  const regDialogCancelBtn = document.getElementById('reg-dialog-cancel-btn');
  const regDialogConfirmBtn = document.getElementById('reg-dialog-confirm-btn');

  const modalRegCode = document.getElementById('modal-reg-code');
  const modalRegTitle = document.getElementById('modal-reg-title');
  const modalRegUnits = document.getElementById('modal-reg-units');
  const modalRegGrading = document.getElementById('modal-reg-grading');
  const modalRegInstructor = document.getElementById('modal-reg-instructor');
  const modalRegSchedule = document.getElementById('modal-reg-schedule');
  const modalRegTerm = document.getElementById('modal-reg-term');

  function openRegistrationModal(course, gradingOption, triggerElement) {
    if (!regConfirmDialog || !course) return;

    state.lastActiveElement = triggerElement;
    state.pendingRegistration = {
      courseId: course.id,
      grading: gradingOption || 'Letter Grade',
      term: 'Fall 2026',
      isWaitlisted: course.seatsAvailable <= 0
    };

    if (modalRegCode) modalRegCode.textContent = course.code;
    if (modalRegTitle) modalRegTitle.textContent = course.title;
    if (modalRegUnits) modalRegUnits.textContent = `${course.units.toFixed(1)} Units`;
    if (modalRegGrading) modalRegGrading.textContent = gradingOption || 'Letter Grade';
    if (modalRegInstructor) modalRegInstructor.textContent = course.instructor;
    if (modalRegSchedule) modalRegSchedule.textContent = `${course.schedule} (${course.location})`;
    if (modalRegTerm) modalRegTerm.textContent = 'Fall 2026';

    const confirmBtn = document.getElementById('reg-dialog-confirm-btn');
    if (confirmBtn) {
      confirmBtn.textContent = course.seatsAvailable <= 0 ? 'Confirm Waitlist' : 'Confirm Registration';
    }

    // Open native dialog modal
    regConfirmDialog.showModal();

    // Move focus to least destructive control (Cancel) (WCAG rule 88)
    if (regDialogCancelBtn) {
      setTimeout(() => regDialogCancelBtn.focus(), 50);
    }
  }

  function closeRegistrationModal() {
    if (regConfirmDialog && regConfirmDialog.open) {
      regConfirmDialog.close();
    }
    state.pendingRegistration = null;

    // Return focus to triggering control (WCAG rule 86)
    if (state.lastActiveElement && document.body.contains(state.lastActiveElement)) {
      state.lastActiveElement.focus();
    }
  }

  if (regDialogCancelBtn) regDialogCancelBtn.addEventListener('click', closeRegistrationModal);
  if (regDialogCloseBtn) regDialogCloseBtn.addEventListener('click', closeRegistrationModal);

  if (regDialogConfirmBtn) {
    regDialogConfirmBtn.addEventListener('click', () => {
      if (!state.pendingRegistration) return;

      const { courseId, grading, term, isWaitlisted } = state.pendingRegistration;
      const course = state.courses.find(c => c.id === courseId);

      if (course) {
        // Add to registered array
        state.registered.push({
          courseId,
          grading,
          term,
          registeredAt: new Date().toISOString().split('T')[0],
          isWaitlisted
        });

        // Update course seat count
        if (!isWaitlisted && course.seatsAvailable > 0) {
          course.seatsAvailable--;
        } else if (isWaitlisted) {
          course.waitlistCount++;
        }

        saveState();
        updateGlobalBadges();

        // Close dialog
        regConfirmDialog.close();

        // Screen reader announcement (WCAG 4.1.3)
        const actionLabel = isWaitlisted ? 'added to waitlist' : 'successfully registered';
        announce(`${course.code}: ${course.title} ${actionLabel} for ${term}.`);

        // Re-render UI
        renderCatalog();
        renderRegistrationFormOptions();
        renderRegisteredTable();
        renderHomeSchedule();

        // Reset registration form if on register page
        if (regForm) {
          regForm.reset();
          clearRegistrationFormErrors();
        }

        // Return focus
        if (state.lastActiveElement && document.body.contains(state.lastActiveElement)) {
          state.lastActiveElement.focus();
        } else {
          const mainHeading = document.querySelector('main h1');
          if (mainHeading) mainHeading.focus();
        }
      }
    });
  }

  // --- Drop Course Confirmation Modal ---
  const dropConfirmDialog = document.getElementById('drop-confirm-dialog');
  const dropDialogCloseBtn = document.getElementById('drop-dialog-x-btn');
  const dropDialogCancelBtn = document.getElementById('drop-dialog-cancel-btn');
  const dropDialogConfirmBtn = document.getElementById('drop-dialog-confirm-btn');

  const modalDropCode = document.getElementById('modal-drop-code');
  const modalDropTitle = document.getElementById('modal-drop-title');
  const modalDropUnits = document.getElementById('modal-drop-units');

  function openDropModal(course, triggerElement) {
    if (!dropConfirmDialog || !course) return;

    state.lastActiveElement = triggerElement;
    state.pendingDrop = course;

    if (modalDropCode) modalDropCode.textContent = course.code;
    if (modalDropTitle) modalDropTitle.textContent = course.title;
    if (modalDropUnits) modalDropUnits.textContent = `Units: ${course.units.toFixed(1)} Units`;

    dropConfirmDialog.showModal();

    // Move focus to least destructive control ("Keep Course / Cancel") (WCAG rule 88)
    if (dropDialogCancelBtn) {
      setTimeout(() => dropDialogCancelBtn.focus(), 50);
    }
  }

  function closeDropModal() {
    if (dropConfirmDialog && dropConfirmDialog.open) {
      dropConfirmDialog.close();
    }
    state.pendingDrop = null;

    // Return focus if opening button still exists
    if (state.lastActiveElement && document.body.contains(state.lastActiveElement)) {
      state.lastActiveElement.focus();
    }
  }

  if (dropDialogCancelBtn) dropDialogCancelBtn.addEventListener('click', closeDropModal);
  if (dropDialogCloseBtn) dropDialogCloseBtn.addEventListener('click', closeDropModal);

  if (dropDialogConfirmBtn) {
    dropDialogConfirmBtn.addEventListener('click', () => {
      if (!state.pendingDrop) return;

      const course = state.pendingDrop;
      const index = state.registered.findIndex(r => r.courseId === course.id);

      if (index !== -1) {
        const removed = state.registered.splice(index, 1)[0];
        if (!removed.isWaitlisted) {
          course.seatsAvailable++;
        } else if (course.waitlistCount > 0) {
          course.waitlistCount--;
        }

        saveState();
        updateGlobalBadges();

        dropConfirmDialog.close();

        // Screen reader announcement (WCAG 4.1.3)
        announce(`${course.code}: ${course.title} has been dropped from your Fall 2026 schedule.`);

        // Re-render UI
        renderRegisteredTable();
        renderRegistrationFormOptions();
        renderCatalog();
        renderHomeSchedule();

        // WCAG rule 89: When it closes and opening button no longer exists, move focus to nearest logical place
        setTimeout(() => {
          const tableHeading = document.getElementById('enrolled-table-heading');
          if (tableHeading) {
            tableHeading.setAttribute('tabindex', '-1');
            tableHeading.focus();
          } else {
            const h1 = document.querySelector('main h1');
            if (h1) h1.focus();
          }
        }, 50);
      }
    });
  }

  // --- Help & Advising Modal Dialog ---
  const helpDialog = document.getElementById('help-dialog');
  const helpDialogCloseBtn = document.getElementById('help-dialog-close-btn');
  const helpDialogXBtn = document.getElementById('help-dialog-x-btn');

  function openHelpModal(triggerElement) {
    if (!helpDialog) return;
    state.lastActiveElement = triggerElement;
    helpDialog.showModal();
    if (helpDialogCloseBtn) {
      setTimeout(() => helpDialogCloseBtn.focus(), 50);
    }
  }

  function closeHelpModal() {
    if (helpDialog && helpDialog.open) {
      helpDialog.close();
    }
    if (state.lastActiveElement && document.body.contains(state.lastActiveElement)) {
      state.lastActiveElement.focus();
    }
  }

  if (helpDialogCloseBtn) helpDialogCloseBtn.addEventListener('click', closeHelpModal);
  if (helpDialogXBtn) helpDialogXBtn.addEventListener('click', closeHelpModal);

  // Bind all help/advising triggers
  const helpTriggers = [
    'nav-help-btn',
    'reg-advisor-link',
    'prof-schedule-adv-btn',
    'footer-advising-link',
    'footer-calendar-link',
    'footer-osd-link',
    'footer-privacy-link'
  ];

  helpTriggers.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', e => {
        e.preventDefault();
        openHelpModal(el);
      });
    }
  });

  // =========================================================================
  // 12. STUDENT PROFILE FORM HANDLING (WCAG 1.3.1, 1.3.5, 3.3.1, 3.3.2)
  // =========================================================================
  const profileForm = document.getElementById('student-profile-form');
  const profSuccessMsg = document.getElementById('profile-success-msg');
  const profFullName = document.getElementById('prof-fullname');
  const profPrefName = document.getElementById('prof-pref-name');
  const profEmail = document.getElementById('prof-email');
  const profPhone = document.getElementById('prof-phone');
  const profAddress = document.getElementById('prof-address');

  const profNameError = document.getElementById('prof-name-error');
  const profEmailError = document.getElementById('prof-email-error');
  const profPhoneError = document.getElementById('prof-phone-error');
  const profAddressError = document.getElementById('prof-address-error');

  function populateProfileForm() {
    if (!profileForm) return;
    if (profFullName) profFullName.value = state.student.fullName;
    if (profPrefName) profPrefName.value = state.student.preferredName;
    if (profEmail) profEmail.value = state.student.email;
    if (profPhone) profPhone.value = state.student.phone;
    if (profAddress) profAddress.value = state.student.address;

    const enrollCb = document.getElementById('pref-notify-enroll');
    if (enrollCb) enrollCb.checked = state.student.notifyEnroll;
    const waitlistCb = document.getElementById('pref-notify-waitlist');
    if (waitlistCb) waitlistCb.checked = state.student.notifyWaitlist;
    const deadCb = document.getElementById('pref-notify-deadlines');
    if (deadCb) deadCb.checked = state.student.notifyDeadlines;
  }

  function clearProfileErrors() {
    [profFullName, profEmail, profPhone, profAddress].forEach(el => {
      if (el) el.removeAttribute('aria-invalid');
    });
    [profNameError, profEmailError, profPhoneError, profAddressError].forEach(el => {
      if (el) {
        el.hidden = true;
        el.textContent = '';
      }
    });
    if (profSuccessMsg) profSuccessMsg.hidden = true;
  }

  if (profileForm) {
    profileForm.addEventListener('submit', e => {
      e.preventDefault();
      clearProfileErrors();

      let hasError = false;
      let firstErrorField = null;

      // Validate Name
      if (!profFullName.value.trim()) {
        profNameError.textContent = 'Please enter your full legal name.';
        profNameError.hidden = false;
        profFullName.setAttribute('aria-invalid', 'true');
        hasError = true;
        if (!firstErrorField) firstErrorField = profFullName;
      }

      // Validate Email (WCAG 3.3.3)
      const emailVal = profEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        profEmailError.textContent = 'Please enter a valid university email address (e.g., student@triton.university.edu).';
        profEmailError.hidden = false;
        profEmail.setAttribute('aria-invalid', 'true');
        hasError = true;
        if (!firstErrorField) firstErrorField = profEmail;
      }

      // Validate Phone
      const phoneVal = profPhone.value.trim();
      if (!phoneVal || phoneVal.length < 10) {
        profPhoneError.textContent = 'Please enter a valid 10-digit phone number with area code.';
        profPhoneError.hidden = false;
        profPhone.setAttribute('aria-invalid', 'true');
        hasError = true;
        if (!firstErrorField) firstErrorField = profPhone;
      }

      // Validate Address
      if (!profAddress.value.trim()) {
        profAddressError.textContent = 'Please enter your campus or local mailing address.';
        profAddressError.hidden = false;
        profAddress.setAttribute('aria-invalid', 'true');
        hasError = true;
        if (!firstErrorField) firstErrorField = profAddress;
      }

      if (hasError) {
        if (firstErrorField) firstErrorField.focus();
        announce('Profile form has errors. Please correct the highlighted fields.', 'assertive');
        return;
      }

      // Save state
      state.student.fullName = profFullName.value.trim();
      state.student.preferredName = profPrefName.value.trim();
      state.student.email = profEmail.value.trim();
      state.student.phone = profPhone.value.trim();
      state.student.address = profAddress.value.trim();

      const enrollCb = document.getElementById('pref-notify-enroll');
      if (enrollCb) state.student.notifyEnroll = enrollCb.checked;
      const waitlistCb = document.getElementById('pref-notify-waitlist');
      if (waitlistCb) state.student.notifyWaitlist = waitlistCb.checked;
      const deadCb = document.getElementById('pref-notify-deadlines');
      if (deadCb) state.student.notifyDeadlines = deadCb.checked;

      saveState();

      if (profSuccessMsg) profSuccessMsg.hidden = false;
      announce('Profile information updated successfully!');

      // Update student name in profile header
      const nameHeader = document.querySelector('.profile-student-name');
      if (nameHeader) nameHeader.textContent = state.student.fullName;
    });
  }

  // =========================================================================
  // 13. INITIALIZATION
  // =========================================================================
  function init() {
    loadState();
    updateGlobalBadges();
    populateProfileForm();

    // Listen to hash change routing
    window.addEventListener('hashchange', handleHashChange);

    // Initial page load navigation
    const initialHash = window.location.hash.replace('#', '').trim();
    if (views[initialHash]) {
      navigateTo(initialHash, false);
    } else {
      navigateTo('home', false);
    }

    renderHomeSchedule();
    renderCatalog();
    renderRegistrationFormOptions();
    renderRegisteredTable();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
