/**
 * Horizon University Course Registration System
 * Plain JavaScript Application - WCAG 2.2 Level AA Accessible
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DATA STATE & COURSES DATABASE
  // =========================================================================

  const COURSES_DATA = [
    {
      code: 'CSE 100',
      title: 'Advanced Data Structures',
      department: 'Computer Science',
      level: 'Upper Division',
      credits: 4,
      instructor: 'Prof. Sanjoy Dasgupta',
      schedule: 'Mon/Wed/Fri 10:00 – 10:50 AM',
      room: 'Center Hall 105',
      seatsTotal: 60,
      seatsEnrolled: 36,
      status: 'open',
      prereqs: 'CSE 30 and CSE 21 with grades of C- or better',
      description: 'Design and analysis of efficient data structures including balanced binary search trees, B-trees, hash tables, disjoint sets, and priority queues. Amortized computational complexity analysis and memory hierarchy optimization.'
    },
    {
      code: 'CSE 105',
      title: 'Theory of Computability',
      department: 'Computer Science',
      level: 'Upper Division',
      credits: 4,
      instructor: 'Prof. Shachar Lovett',
      schedule: 'Tue/Thu 9:30 – 10:50 AM',
      room: 'Warren Lecture Hall 2005',
      seatsTotal: 75,
      seatsEnrolled: 52,
      status: 'open',
      prereqs: 'CSE 21 or MATH 154',
      description: 'Introduction to formal language theory, finite automata, regular languages, context-free grammars, pushdown automata, Turing machines, undecidability, and the Chomsky hierarchy.'
    },
    {
      code: 'CSE 158',
      title: 'Recommender Systems & Web Mining',
      department: 'Computer Science',
      level: 'Upper Division',
      credits: 4,
      instructor: 'Prof. Julian McAuley',
      schedule: 'Mon/Wed 3:30 – 4:50 PM',
      room: 'Pepper Canyon 120',
      seatsTotal: 50,
      seatsEnrolled: 50,
      status: 'waitlist',
      waitlistCount: 6,
      prereqs: 'CSE 100 and basic linear algebra and probability',
      description: 'Predictive modeling and machine learning techniques for personalized recommendations, collaborative filtering, matrix factorization, graph neural networks, and web data mining.'
    },
    {
      code: 'CSE 216',
      title: 'Software Engineering & Architecture',
      department: 'Computer Science',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. Alan Turing',
      schedule: 'Tue/Thu 2:00 – 3:20 PM',
      room: 'Warren Hall 201',
      seatsTotal: 45,
      seatsEnrolled: 33,
      status: 'open',
      prereqs: 'Graduate standing or consent of instructor',
      description: 'Design and implementation of resilient distributed software architectures, domain-driven design, microservices, continuous integration pipelines, automated static analysis, and accessible UI frameworks.'
    },
    {
      code: 'DSC 10',
      title: 'Principles of Data Science',
      department: 'Data Science',
      level: 'Lower Division',
      credits: 4,
      instructor: 'Dr. Marina Langlois',
      schedule: 'Tue/Thu 9:30 – 10:50 AM',
      room: 'Price Center East',
      seatsTotal: 120,
      seatsEnrolled: 75,
      status: 'open',
      prereqs: 'None. Open to all students.',
      description: 'Foundational concepts in data manipulation, exploratory visualization, computational thinking, statistical simulation, and hypothesis testing using modern scientific computing tools.'
    },
    {
      code: 'DSC 100',
      title: 'Principles of Data Systems',
      department: 'Data Science',
      level: 'Upper Division',
      credits: 4,
      instructor: 'Dr. Suraj Rampure',
      schedule: 'Mon/Wed/Fri 1:00 – 1:50 PM',
      room: 'Peterson Hall 108',
      seatsTotal: 90,
      seatsEnrolled: 65,
      status: 'open',
      prereqs: 'DSC 10 and DSC 20',
      description: 'Relational database schema modeling, SQL query execution, transaction processing, indexing architectures, document stores, and scalable data warehousing.'
    },
    {
      code: 'DSC 102',
      title: 'Systems for Scalable Analytics',
      department: 'Data Science',
      level: 'Upper Division',
      credits: 4,
      instructor: 'Dr. Babak Salimi',
      schedule: 'Mon/Wed 1:00 – 2:20 PM',
      room: 'Atkinson Hall 110',
      seatsTotal: 40,
      seatsEnrolled: 22,
      status: 'open',
      prereqs: 'DSC 100 and CSE 100',
      description: 'Distributed compute frameworks, map-reduce paradigms, streaming processing engines, cloud memory management, and high-throughput data processing workflows.'
    },
    {
      code: 'DSC 240',
      title: 'Machine Learning in Practice',
      department: 'Data Science',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. Arun Kumar',
      schedule: 'Tue/Thu 11:00 AM – 12:20 PM',
      room: 'SDSC Auditorium',
      seatsTotal: 35,
      seatsEnrolled: 35,
      status: 'waitlist',
      waitlistCount: 4,
      prereqs: 'Graduate standing or DSC 102',
      description: 'End-to-end machine learning engineering pipelines, feature extraction architectures, hyperparameter optimization, model explainability, drift detection, and production model governance.'
    },
    {
      code: 'MATH 20C',
      title: 'Calculus & Analytic Geometry III',
      department: 'Mathematics',
      level: 'Lower Division',
      credits: 4,
      instructor: 'Dr. Katherine Johnson',
      schedule: 'Mon/Wed/Fri 11:00 – 11:50 AM',
      room: 'Peterson Hall 108',
      seatsTotal: 90,
      seatsEnrolled: 60,
      status: 'open',
      prereqs: 'MATH 20B or AP Calculus BC with score of 4 or 5',
      description: 'Vector calculus, partial derivatives, directional derivatives, multiple integrals in rectangular, polar, and spherical coordinate systems, line integrals, and Green’s Theorem.'
    },
    {
      code: 'MATH 180A',
      title: 'Introduction to Probability',
      department: 'Mathematics',
      level: 'Upper Division',
      credits: 4,
      instructor: 'Dr. Robert Gauss',
      schedule: 'Tue/Thu 12:30 – 1:50 PM',
      room: 'Applied Physics 114',
      seatsTotal: 55,
      seatsEnrolled: 40,
      status: 'open',
      prereqs: 'MATH 20C or MATH 31BH',
      description: 'Probability spaces, random variables, cumulative distribution functions, joint distributions, mathematical expectation, law of large numbers, and the central limit theorem.'
    },
    {
      code: 'MATH 200A',
      title: 'Graduate Abstract Algebra',
      department: 'Mathematics',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. David Hilbert',
      schedule: 'Mon/Wed 9:00 – 10:20 AM',
      room: 'AP&M 4218',
      seatsTotal: 25,
      seatsEnrolled: 17,
      status: 'open',
      prereqs: 'Graduate standing or consent of instructor',
      description: 'Group theory, isomorphism theorems, Sylow theorems, solvable groups, rings, modules over principal ideal domains, and foundational Galois theory.'
    },
    {
      code: 'ECE 101',
      title: 'Linear Systems Fundamentals',
      department: 'Electrical Engineering',
      level: 'Upper Division',
      credits: 4,
      instructor: 'Dr. Claude Shannon',
      schedule: 'Tue/Thu 8:00 – 9:20 AM',
      room: 'Jacobs Hall 250',
      seatsTotal: 50,
      seatsEnrolled: 28,
      status: 'open',
      prereqs: 'MATH 20D and PHYS 2B',
      description: 'Continuous-time and discrete-time signals and systems, convolution, linear time-invariance, Fourier series, Fourier transforms, Laplace transforms, and frequency response analysis.'
    },
    {
      code: 'ECE 260A',
      title: 'VLSI Digital System Design',
      department: 'Electrical Engineering',
      level: 'Graduate',
      credits: 4,
      instructor: 'Prof. Lynn Conway',
      schedule: 'Mon/Wed 5:00 – 6:20 PM',
      room: 'Jacobs Hall 430',
      seatsTotal: 30,
      seatsEnrolled: 30,
      status: 'waitlist',
      waitlistCount: 3,
      prereqs: 'ECE 165 or graduate standing',
      description: 'CMOS digital integrated circuits, timing constraints, clock tree synthesis, dynamic power optimization, layout verification, and hardware description language synthesis.'
    },
    {
      code: 'BENG 100',
      title: 'Introduction to Bioengineering',
      department: 'Bioengineering',
      level: 'Lower Division',
      credits: 4,
      instructor: 'Dr. Rosalind Franklin',
      schedule: 'Tue/Thu 3:30 – 4:50 PM',
      room: 'Powell-Focht Hall 102',
      seatsTotal: 60,
      seatsEnrolled: 44,
      status: 'open',
      prereqs: 'CHEM 6A and MATH 20A',
      description: 'Fundamental biomechanics, bioinstrumentation, physiological modeling, transport phenomena in biological systems, and biomaterials engineering.'
    },
    {
      code: 'PHIL 167',
      title: 'Ethics in Science and Technology',
      department: 'Philosophy',
      level: 'Upper Division',
      credits: 4,
      instructor: 'Dr. Mary Midgley',
      schedule: 'Tue/Thu 10:00 – 11:20 AM',
      room: 'Humanities Bldg 112',
      seatsTotal: 40,
      seatsEnrolled: 26,
      status: 'open',
      prereqs: 'Upper division standing',
      description: 'Ethical analysis of emerging computational technologies, algorithmic bias, autonomous decision systems, biotechnology regulation, surveillance, and intellectual property.'
    }
  ];

  // Current registered courses for student (initial state: 2 courses, 8 units)
  const studentRegistrations = [
    {
      code: 'CSE 216',
      title: 'Software Engineering & Architecture',
      credits: 4,
      schedule: 'Tue/Thu 2:00 – 3:20 PM',
      room: 'Warren Hall 201',
      instructor: 'Prof. Alan Turing',
      gradingBasis: 'Letter Grade',
      term: 'Fall Quarter 2026',
      status: 'Enrolled'
    },
    {
      code: 'MATH 180A',
      title: 'Introduction to Probability',
      credits: 4,
      schedule: 'Tue/Thu 12:30 – 1:50 PM',
      room: 'Applied Physics 114',
      instructor: 'Dr. Robert Gauss',
      gradingBasis: 'Letter Grade',
      term: 'Fall Quarter 2026',
      status: 'Enrolled'
    }
  ];

  // Keep track of pending registration details
  let pendingRegistrationData = null;
  // Keep track of pending drop course code
  let pendingDropCourseCode = null;
  // Store the element that triggered a modal to restore focus properly on close
  let lastFocusedElementBeforeModal = null;

  // Search debounce timer
  let searchDebounceTimer = null;

  // =========================================================================
  // 2. DOM ELEMENT REFERENCES
  // =========================================================================

  // Announcements
  const liveStatus = document.getElementById('live-status');
  const liveAlert = document.getElementById('live-alert');

  // Navigation
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const primaryNavMenu = document.getElementById('primary-nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Views
  const views = {
    home: document.getElementById('view-home'),
    catalog: document.getElementById('view-catalog'),
    register: document.getElementById('view-register'),
    profile: document.getElementById('view-profile')
  };

  const viewHeadings = {
    home: document.getElementById('home-heading'),
    catalog: document.getElementById('catalog-heading'),
    register: document.getElementById('register-heading'),
    profile: document.getElementById('profile-heading')
  };

  // Catalog Elements
  const catalogSearchInput = document.getElementById('catalog-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const filterDept = document.getElementById('filter-department');
  const filterLevel = document.getElementById('filter-level');
  const filterAvailability = document.getElementById('filter-availability');
  const sortCourses = document.getElementById('sort-courses');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  const catalogResultsStatus = document.getElementById('catalog-results-status');
  const displayedCoursesCount = document.getElementById('displayed-courses-count');
  const totalCoursesCount = document.getElementById('total-courses-count');
  const courseCardsList = document.getElementById('course-cards-list');
  const catalogEmptyState = document.getElementById('catalog-empty-state');

  // Registration Elements
  const registrationForm = document.getElementById('registration-form');
  const regCourseSelect = document.getElementById('reg-course-select');
  const formErrorSummary = document.getElementById('form-error-summary');
  const errorSummaryList = document.getElementById('error-summary-list');

  // Profile Elements
  const homeEnrolledCount = document.getElementById('home-enrolled-count');
  const homeCreditsCount = document.getElementById('home-credits-count');
  const trackerCurrentCredits = document.getElementById('tracker-current-credits');
  const creditProgressBar = document.getElementById('credit-progress-bar');
  const creditProgressFill = document.getElementById('credit-progress-fill');
  const trackerStatusDesc = document.getElementById('tracker-status-description');
  const registeredCoursesTable = document.getElementById('registered-courses-table');
  const registeredCoursesTbody = document.getElementById('registered-courses-tbody');
  const captionEnrolledCount = document.getElementById('caption-enrolled-count');
  const captionCreditsCount = document.getElementById('caption-credits-count');
  const tableTotalCredits = document.getElementById('table-total-credits');
  const profileEmptyTable = document.getElementById('profile-empty-table');

  // Modals
  const regConfirmDialog = document.getElementById('reg-confirm-dialog');
  const regModalCancelBtn = document.getElementById('reg-modal-cancel-btn');
  const regModalConfirmBtn = document.getElementById('reg-modal-confirm-btn');

  const dropConfirmDialog = document.getElementById('drop-confirm-dialog');
  const dropModalCourseName = document.getElementById('drop-modal-course-name');
  const dropModalCancelBtn = document.getElementById('drop-modal-cancel-btn');
  const dropModalConfirmBtn = document.getElementById('drop-modal-confirm-btn');

  const courseDetailsDialog = document.getElementById('course-details-dialog');
  const detailsModalCloseBtn = document.getElementById('details-modal-close-btn');
  const detailsModalRegisterBtn = document.getElementById('details-modal-register-btn');

  const helpDialog = document.getElementById('help-dialog');
  const helpModalCloseBtn = document.getElementById('help-modal-close-btn');

  // =========================================================================
  // 3. ACCESSIBILITY HELPER FUNCTIONS
  // =========================================================================

  /**
   * Polite live status announcer for non-urgent feedback (WCAG 4.1.3)
   */
  function announceStatus(message) {
    if (!liveStatus) return;
    liveStatus.textContent = '';
    setTimeout(function () {
      liveStatus.textContent = message;
    }, 50);
  }

  /**
   * Assertive live alert announcer for urgent warnings/errors (WCAG 4.1.3, 3.3.1)
   */
  function announceAlert(message) {
    if (!liveAlert) return;
    liveAlert.textContent = '';
    setTimeout(function () {
      liveAlert.textContent = message;
    }, 50);
  }

  /**
   * Calculate total enrolled credits
   */
  function calculateTotalCredits() {
    return studentRegistrations.reduce(function (sum, item) {
      return sum + Number(item.credits);
    }, 0);
  }

  /**
   * Check if student is already registered for a course
   */
  function isCourseRegistered(courseCode) {
    return studentRegistrations.some(function (item) {
      return item.code === courseCode;
    });
  }

  // =========================================================================
  // 4. ROUTING & VIEW NAVIGATION (WCAG 2.4.2, 2.4.4, 3.2.3)
  // =========================================================================

  const PAGE_TITLES = {
    home: 'Home | Horizon University Course Registration',
    catalog: 'Course Catalog | Horizon University Course Registration',
    register: 'Course Registration | Horizon University Course Registration',
    profile: 'Student Profile | Horizon University Course Registration'
  };

  /**
   * Navigate to a view based on hash (#home, #catalog, #register, #profile)
   */
  function navigateToRoute(routeHash, preserveFocus) {
    var viewKey = (routeHash || '').replace('#', '').trim().toLowerCase();
    if (!views[viewKey]) {
      viewKey = 'home';
    }

    // Toggle views
    Object.keys(views).forEach(function (key) {
      if (key === viewKey) {
        views[key].removeAttribute('hidden');
      } else {
        views[key].setAttribute('hidden', '');
      }
    });

    // Update nav links aria-current="page"
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href').replace('#', '').trim().toLowerCase();
      if (href === viewKey) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Update document title (WCAG 2.4.2)
    document.title = PAGE_TITLES[viewKey] || PAGE_TITLES.home;

    // Close mobile menu if open
    closeMobileMenu();

    // Move focus to view's h1 heading (WCAG 2.4.3, Section 5)
    if (!preserveFocus && viewHeadings[viewKey]) {
      // Small timeout ensures element is visible and painted before focusing
      setTimeout(function () {
        viewHeadings[viewKey].focus();
      }, 50);
    }
  }

  /**
   * Mobile menu toggle handler (WCAG Section 8)
   */
  function toggleMobileMenu() {
    var isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    primaryNavMenu.classList.add('is-open');
  }

  function closeMobileMenu() {
    if (menuToggleBtn && primaryNavMenu) {
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      primaryNavMenu.classList.remove('is-open');
    }
  }

  // =========================================================================
  // 5. CATALOG RENDERING, SEARCH & FILTERS (WCAG Section 8)
  // =========================================================================

  /**
   * Filter and sort courses based on user inputs
   */
  function getFilteredCourses() {
    var query = (catalogSearchInput.value || '').trim().toLowerCase();
    var deptVal = filterDept.value;
    var levelVal = filterLevel.value;
    var availVal = filterAvailability.value;
    var sortVal = sortCourses.value;

    var filtered = COURSES_DATA.filter(function (course) {
      // Department filter
      if (deptVal !== 'all' && course.department !== deptVal) {
        return false;
      }
      // Academic Level filter
      if (levelVal !== 'all' && course.level !== levelVal) {
        return false;
      }
      // Availability filter
      if (availVal === 'open' && course.status !== 'open') {
        return false;
      }
      if (availVal === 'waitlist' && course.status !== 'waitlist') {
        return false;
      }
      // Search query (code, title, instructor, department, keywords)
      if (query) {
        var matchCode = course.code.toLowerCase().includes(query);
        var matchTitle = course.title.toLowerCase().includes(query);
        var matchInstructor = course.instructor.toLowerCase().includes(query);
        var matchDept = course.department.toLowerCase().includes(query);
        var matchDesc = course.description.toLowerCase().includes(query);
        if (!matchCode && !matchTitle && !matchInstructor && !matchDept && !matchDesc) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    filtered.sort(function (a, b) {
      if (sortVal === 'code-asc') {
        return a.code.localeCompare(b.code);
      } else if (sortVal === 'code-desc') {
        return b.code.localeCompare(a.code);
      } else if (sortVal === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else if (sortVal === 'credits-desc') {
        return b.credits - a.credits;
      } else if (sortVal === 'seats-desc') {
        var aSeats = a.seatsTotal - a.seatsEnrolled;
        var bSeats = b.seatsTotal - b.seatsEnrolled;
        return bSeats - aSeats;
      }
      return 0;
    });

    return filtered;
  }

  /**
   * Render course cards to DOM
   */
  function renderCourseCatalog(announceCount) {
    var filteredCourses = getFilteredCourses();
    var totalCount = COURSES_DATA.length;
    var matchCount = filteredCourses.length;

    // Update counter display
    displayedCoursesCount.textContent = matchCount;
    totalCoursesCount.textContent = totalCount;

    // Announce search result count to screen reader if requested (WCAG 4.1.3, SC 7)
    if (announceCount) {
      if (matchCount === 0) {
        announceStatus('No courses found matching your search and filter criteria.');
      } else {
        announceStatus(matchCount + ' course' + (matchCount === 1 ? '' : 's') + ' found matching criteria.');
      }
    }

    // Handle empty state
    if (matchCount === 0) {
      courseCardsList.innerHTML = '';
      courseCardsList.classList.add('hidden');
      catalogEmptyState.classList.remove('hidden');
      return;
    }

    catalogEmptyState.classList.add('hidden');
    courseCardsList.classList.remove('hidden');

    // Build course cards HTML
    var html = '';
    filteredCourses.forEach(function (course) {
      var isRegistered = isCourseRegistered(course.code);
      var seatsLeft = Math.max(0, course.seatsTotal - course.seatsEnrolled);
      
      var statusBadgeHtml = '';
      var actionBtnHtml = '';

      if (isRegistered) {
        statusBadgeHtml = '<span class="badge badge-open"><span aria-hidden="true">&#10003;</span> Registered</span>';
        actionBtnHtml = '<button type="button" class="btn btn-secondary btn-sm" disabled aria-label="Already registered for ' + course.code + '"><span aria-hidden="true">&#10003;</span> Enrolled</button>';
      } else if (course.status === 'open' && seatsLeft > 0) {
        statusBadgeHtml = '<span class="badge badge-open"><span aria-hidden="true">&#10003;</span> Open (' + seatsLeft + ' seats left)</span>';
        actionBtnHtml = '<button type="button" class="btn btn-primary btn-sm register-card-btn" data-code="' + course.code + '" aria-label="Register for ' + course.code + ': ' + course.title + '">Register</button>';
      } else {
        statusBadgeHtml = '<span class="badge badge-waitlist"><span aria-hidden="true">&#9679;</span> Waitlist (' + (course.waitlistCount || 0) + ' waiting)</span>';
        actionBtnHtml = '<button type="button" class="btn btn-primary btn-sm register-card-btn" data-code="' + course.code + '" aria-label="Register for waitlist on ' + course.code + ': ' + course.title + '">Join Waitlist</button>';
      }

      html += '<li class="course-card-item">' +
        '<article class="course-card" aria-labelledby="card-title-' + course.code.replace(/\s+/g, '-') + '">' +
          '<div class="course-card-header">' +
            '<div class="course-badges-row">' +
              '<span class="badge badge-dept">' + course.department + '</span>' +
              '<span class="badge badge-level">' + course.level + '</span>' +
              statusBadgeHtml +
            '</div>' +
            '<div class="course-code">' + course.code + '</div>' +
            '<h3 id="card-title-' + course.code.replace(/\s+/g, '-') + '" class="course-title">' + course.title + '</h3>' +
            '<div class="course-instructor">Instructor: ' + course.instructor + '</div>' +
          '</div>' +
          '<p class="course-description">' + course.description + '</p>' +
          '<div class="course-meta-grid">' +
            '<div class="meta-row">' +
              '<span class="meta-label">Schedule:</span>' +
              '<span class="meta-value">' + course.schedule + '</span>' +
            '</div>' +
            '<div class="meta-row">' +
              '<span class="meta-label">Location:</span>' +
              '<span class="meta-value">' + course.room + '</span>' +
            '</div>' +
            '<div class="meta-row">' +
              '<span class="meta-label">Credits:</span>' +
              '<span class="meta-value">' + course.credits + ' Units</span>' +
            '</div>' +
            '<div class="meta-row">' +
              '<span class="meta-label">Capacity:</span>' +
              '<span class="meta-value">' + course.seatsEnrolled + ' / ' + course.seatsTotal + ' Seats</span>' +
            '</div>' +
          '</div>' +
          '<div class="course-card-footer">' +
            '<div class="card-actions">' +
              '<button type="button" class="btn btn-outline btn-sm view-details-btn" data-code="' + course.code + '" aria-label="View details for ' + course.code + ': ' + course.title + '">View Details</button>' +
              actionBtnHtml +
            '</div>' +
          '</div>' +
        '</article>' +
      '</li>';
    });

    courseCardsList.innerHTML = html;
  }

  /**
   * Populate registration form course dropdown
   */
  function populateRegistrationDropdown() {
    var currentVal = regCourseSelect.value;
    var optionsHtml = '<option value="">-- Choose an available course --</option>';

    COURSES_DATA.forEach(function (course) {
      var isReg = isCourseRegistered(course.code);
      var seatsLeft = Math.max(0, course.seatsTotal - course.seatsEnrolled);
      var statusLabel = isReg ? ' [Already Enrolled]' : (course.status === 'open' ? ' (' + seatsLeft + ' seats open)' : ' (Waitlist)');
      optionsHtml += '<option value="' + course.code + '"' + (isReg ? ' disabled' : '') + '>' +
        course.code + ' – ' + course.title + ' (' + course.credits + ' Units)' + statusLabel +
      '</option>';
    });

    regCourseSelect.innerHTML = optionsHtml;
    if (currentVal && regCourseSelect.querySelector('option[value="' + currentVal + '"]')) {
      regCourseSelect.value = currentVal;
    }
  }

  // =========================================================================
  // 6. STUDENT PROFILE & DATA TABLE (WCAG Section 8)
  // =========================================================================

  /**
   * Render registered courses data table & update credit meters
   */
  function renderProfileAndTable() {
    var totalCredits = calculateTotalCredits();
    var courseCount = studentRegistrations.length;

    // Update Home page counters
    if (homeEnrolledCount) homeEnrolledCount.textContent = courseCount;
    if (homeCreditsCount) homeCreditsCount.textContent = totalCredits;

    // Update Profile tracker
    if (trackerCurrentCredits) trackerCurrentCredits.textContent = totalCredits;
    if (captionEnrolledCount) captionEnrolledCount.textContent = courseCount;
    if (captionCreditsCount) captionCreditsCount.textContent = totalCredits;
    if (tableTotalCredits) tableTotalCredits.textContent = totalCredits + ' Units';

    // Update progress bar element (WCAG progressbar pattern)
    if (creditProgressBar && creditProgressFill) {
      var maxUnits = 18;
      var percentage = Math.min(100, Math.round((totalCredits / maxUnits) * 100));
      creditProgressBar.setAttribute('aria-valuenow', totalCredits);
      creditProgressFill.style.width = percentage + '%';

      var statusText = '';
      if (totalCredits >= 12) {
        statusText = 'Current status: <strong>Full-Time Enrollment (' + totalCredits + ' Units)</strong>. You meet university full-time academic criteria.';
      } else if (totalCredits > 0) {
        statusText = 'Current status: <strong>Part-Time Enrollment (' + totalCredits + ' Units)</strong>. Enrolling in 12 or more units qualifies you for full-time status.';
      } else {
        statusText = 'Current status: <strong>No Units Enrolled</strong>. Please register for at least 12 units to maintain full-time standing.';
      }
      trackerStatusDesc.innerHTML = statusText;
    }

    // Render registered courses table rows
    if (courseCount === 0) {
      registeredCoursesTable.classList.add('hidden');
      profileEmptyTable.classList.remove('hidden');
      registeredCoursesTbody.innerHTML = '';
      return;
    }

    registeredCoursesTable.classList.remove('hidden');
    profileEmptyTable.classList.add('hidden');

    var rowsHtml = '';
    studentRegistrations.forEach(function (reg) {
      rowsHtml += '<tr>' +
        '<th scope="row">' + reg.code + '</th>' +
        '<td>' + reg.title + '</td>' +
        '<td>' + reg.credits + ' Units</td>' +
        '<td>' + reg.schedule + '<br><small>' + reg.room + '</small></td>' +
        '<td>' + reg.instructor + '</td>' +
        '<td><span class="badge badge-level">' + reg.gradingBasis + '</span></td>' +
        '<td><span class="badge badge-open"><span aria-hidden="true">&#10003;</span> ' + reg.status + '</span></td>' +
        '<td>' +
          '<button type="button" class="btn btn-danger btn-sm drop-course-btn" data-code="' + reg.code + '" aria-label="Drop ' + reg.code + ': ' + reg.title + '">' +
            'Drop' +
          '</button>' +
        '</td>' +
      '</tr>';
    });

    registeredCoursesTbody.innerHTML = rowsHtml;
  }

  // =========================================================================
  // 7. MODAL DIALOG CONTROLLERS (WCAG Section 8 native <dialog>)
  // =========================================================================

  /**
   * Open Course Details Modal
   */
  function openCourseDetailsModal(courseCode, openerElement) {
    var course = COURSES_DATA.find(function (c) { return c.code === courseCode; });
    if (!course) return;

    lastFocusedElementBeforeModal = openerElement || document.activeElement;

    // Populate modal fields
    document.getElementById('details-dept').textContent = course.department;
    document.getElementById('details-level').textContent = course.level;
    
    var seatsLeft = Math.max(0, course.seatsTotal - course.seatsEnrolled);
    var isReg = isCourseRegistered(course.code);
    var statusBadge = document.getElementById('details-status');

    if (isReg) {
      statusBadge.textContent = 'Enrolled in Schedule';
      statusBadge.className = 'badge badge-open';
    } else if (course.status === 'open') {
      statusBadge.textContent = 'Open (' + seatsLeft + ' seats available)';
      statusBadge.className = 'badge badge-open';
    } else {
      statusBadge.textContent = 'Waitlist Active (' + (course.waitlistCount || 0) + ' waiting)';
      statusBadge.className = 'badge badge-waitlist';
    }

    document.getElementById('details-code-title').textContent = course.code + ': ' + course.title;
    document.getElementById('details-description').textContent = course.description;
    document.getElementById('details-credits').textContent = course.credits + ' Units';
    document.getElementById('details-instructor').textContent = course.instructor;
    document.getElementById('details-schedule').textContent = course.schedule;
    document.getElementById('details-room').textContent = course.room;
    document.getElementById('details-prereqs').textContent = course.prereqs;

    // Update Action button in details modal
    if (isReg) {
      detailsModalRegisterBtn.textContent = 'Already Enrolled';
      detailsModalRegisterBtn.disabled = true;
      detailsModalRegisterBtn.removeAttribute('data-code');
    } else {
      detailsModalRegisterBtn.textContent = course.status === 'open' ? 'Register for this Course' : 'Join Course Waitlist';
      detailsModalRegisterBtn.disabled = false;
      detailsModalRegisterBtn.setAttribute('data-code', course.code);
    }

    courseDetailsDialog.showModal();
    // Move focus to least destructive control (Close button)
    detailsModalCloseBtn.focus();
  }

  /**
   * Open Registration Confirmation Modal
   */
  function openRegistrationConfirmModal(formData, course) {
    lastFocusedElementBeforeModal = document.activeElement;

    pendingRegistrationData = {
      formData: formData,
      course: course
    };

    // Populate confirmation modal details
    document.getElementById('modal-confirm-name').textContent = formData.studentName;
    document.getElementById('modal-confirm-id').textContent = formData.studentId;
    document.getElementById('modal-confirm-course').textContent = course.code + ' – ' + course.title;
    document.getElementById('modal-confirm-credits').textContent = course.credits + ' Units';
    document.getElementById('modal-confirm-grading').textContent = formData.gradingOption;
    document.getElementById('modal-confirm-schedule').textContent = course.schedule + ' (' + course.room + ')';
    document.getElementById('modal-confirm-instructor').textContent = course.instructor;

    regConfirmDialog.showModal();
    // Move focus to least destructive control (Cancel button)
    regModalCancelBtn.focus();
  }

  /**
   * Open Drop Course Confirmation Modal
   */
  function openDropConfirmModal(courseCode, openerElement) {
    var regItem = studentRegistrations.find(function (item) { return item.code === courseCode; });
    if (!regItem) return;

    lastFocusedElementBeforeModal = openerElement || document.activeElement;
    pendingDropCourseCode = courseCode;

    dropModalCourseName.textContent = regItem.code + ' – ' + regItem.title;

    dropConfirmDialog.showModal();
    // Move focus to least destructive control (Cancel button)
    dropModalCancelBtn.focus();
  }

  /**
   * Open Help Modal
   */
  function openHelpModal(openerElement) {
    lastFocusedElementBeforeModal = openerElement || document.activeElement;
    helpDialog.showModal();
    helpModalCloseBtn.focus();
  }

  // =========================================================================
  // 8. FORM VALIDATION & REGISTRATION WORKFLOW (WCAG Section 6)
  // =========================================================================

  /**
   * Clear error state from input element and message container
   */
  function clearFieldError(inputElement, errorElement) {
    if (inputElement) {
      inputElement.removeAttribute('aria-invalid');
    }
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  /**
   * Set accessible error state on input element and error message container
   */
  function setFieldError(inputElement, errorElement, message) {
    if (inputElement) {
      inputElement.setAttribute('aria-invalid', 'true');
    }
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  /**
   * Handle registration form submission
   */
  function handleRegistrationSubmit(event) {
    event.preventDefault();

    // Field references
    var nameInput = document.getElementById('reg-student-name');
    var idInput = document.getElementById('reg-student-id');
    var emailInput = document.getElementById('reg-student-email');
    var programSelect = document.getElementById('reg-program');
    var courseSelect = document.getElementById('reg-course-select');
    var termSelect = document.getElementById('reg-term-select');
    var gradingInput = registrationForm.querySelector('input[name="gradingOption"]:checked');
    var prereqCheck = document.getElementById('reg-prereq-ack');
    var policyCheck = document.getElementById('reg-policy-ack');
    var notesInput = document.getElementById('reg-notes');

    // Error container references
    var nameError = document.getElementById('reg-student-name-error');
    var idError = document.getElementById('reg-student-id-error');
    var emailError = document.getElementById('reg-student-email-error');
    var programError = document.getElementById('reg-program-error');
    var courseError = document.getElementById('reg-course-error');
    var termError = document.getElementById('reg-term-error');
    var prereqError = document.getElementById('reg-prereq-error');
    var policyError = document.getElementById('reg-policy-error');

    // Clear previous errors
    clearFieldError(nameInput, nameError);
    clearFieldError(idInput, idError);
    clearFieldError(emailInput, emailError);
    clearFieldError(programSelect, programError);
    clearFieldError(courseSelect, courseError);
    clearFieldError(termSelect, termError);
    clearFieldError(prereqCheck, prereqError);
    clearFieldError(policyCheck, policyError);

    var errors = [];

    // Validate Student Name
    var nameVal = (nameInput.value || '').trim();
    if (!nameVal) {
      var msg = 'Enter your legal or university-preferred full name.';
      setFieldError(nameInput, nameError, msg);
      errors.push({ id: 'reg-student-name', message: 'Full Name: ' + msg });
    } else if (nameVal.length < 2) {
      var msg2 = 'Full name must contain at least 2 characters.';
      setFieldError(nameInput, nameError, msg2);
      errors.push({ id: 'reg-student-name', message: 'Full Name: ' + msg2 });
    }

    // Validate Student ID (8 numeric digits)
    var idVal = (idInput.value || '').trim();
    var idPattern = /^[0-9]{8}$/;
    if (!idVal) {
      var idMsg = 'Enter your 8-digit student ID number.';
      setFieldError(idInput, idError, idMsg);
      errors.push({ id: 'reg-student-id', message: 'Student ID: ' + idMsg });
    } else if (!idPattern.test(idVal)) {
      var idMsg2 = 'Student ID must be exactly 8 numbers (e.g. 90482156).';
      setFieldError(idInput, idError, idMsg2);
      errors.push({ id: 'reg-student-id', message: 'Student ID: ' + idMsg2 });
    }

    // Validate Email
    var emailVal = (emailInput.value || '').trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      var emailMsg = 'Enter your university email address.';
      setFieldError(emailInput, emailError, emailMsg);
      errors.push({ id: 'reg-student-email', message: 'University Email: ' + emailMsg });
    } else if (!emailPattern.test(emailVal)) {
      var emailMsg2 = 'Enter a valid email address containing an "@" and domain (e.g. student@horizon.edu).';
      setFieldError(emailInput, emailError, emailMsg2);
      errors.push({ id: 'reg-student-email', message: 'University Email: ' + emailMsg2 });
    }

    // Validate Program
    if (!programSelect.value) {
      var progMsg = 'Select your declared degree program from the list.';
      setFieldError(programSelect, programError, progMsg);
      errors.push({ id: 'reg-program', message: 'Degree Program: ' + progMsg });
    }

    // Validate Course Selection
    var selectedCourseCode = courseSelect.value;
    if (!selectedCourseCode) {
      var courseMsg = 'Select a course you wish to add to your registered schedule.';
      setFieldError(courseSelect, courseError, courseMsg);
      errors.push({ id: 'reg-course-select', message: 'Course Selection: ' + courseMsg });
    }

    // Validate Term
    if (!termSelect.value) {
      var termMsg = 'Select the academic enrollment term.';
      setFieldError(termSelect, termError, termMsg);
      errors.push({ id: 'reg-term-select', message: 'Academic Term: ' + termMsg });
    }

    // Validate Prerequisite Acknowledgment
    if (!prereqCheck.checked) {
      var prereqMsg = 'You must confirm that you meet prerequisites or hold instructor approval.';
      setFieldError(prereqCheck, prereqError, prereqMsg);
      errors.push({ id: 'reg-prereq-ack', message: 'Prerequisite Acknowledgment: ' + prereqMsg });
    }

    // Validate Policy Acknowledgment
    if (!policyCheck.checked) {
      var policyMsg = 'You must accept Horizon University registration policies to continue.';
      setFieldError(policyCheck, policyError, policyMsg);
      errors.push({ id: 'reg-policy-ack', message: 'Policy Agreement: ' + policyMsg });
    }

    // If validation errors exist, present summary and move focus (WCAG 3.3.1, 3.3.3)
    if (errors.length > 0) {
      var errorItemsHtml = '';
      errors.forEach(function (err) {
        errorItemsHtml += '<li><a href="#' + err.id + '">' + err.message + '</a></li>';
      });
      errorSummaryList.innerHTML = errorItemsHtml;
      formErrorSummary.classList.remove('hidden');
      formErrorSummary.focus();
      announceAlert('Registration form has ' + errors.length + ' error' + (errors.length === 1 ? '' : 's') + '. Review the error summary at the top of the form.');
      return;
    }

    // Validation passed! Now verify academic logic
    var course = COURSES_DATA.find(function (c) { return c.code === selectedCourseCode; });
    if (!course) {
      var notFoundMsg = 'Selected course could not be located in catalog.';
      setFieldError(courseSelect, courseError, notFoundMsg);
      errors.push({ id: 'reg-course-select', message: notFoundMsg });
      formErrorSummary.classList.remove('hidden');
      formErrorSummary.focus();
      return;
    }

    // Check duplicate enrollment
    if (isCourseRegistered(course.code)) {
      var dupMsg = 'You are already registered for ' + course.code + '. View your registered schedule on the Student Profile page.';
      setFieldError(courseSelect, courseError, dupMsg);
      errorSummaryList.innerHTML = '<li><a href="#reg-course-select">' + dupMsg + '</a></li>';
      formErrorSummary.classList.remove('hidden');
      formErrorSummary.focus();
      announceAlert(dupMsg);
      return;
    }

    // Check credit limit (18 units maximum)
    var currentCredits = calculateTotalCredits();
    if (currentCredits + course.credits > 18) {
      var creditLimitMsg = 'Credit limit exceeded: Adding ' + course.credits + ' units would bring your total to ' + (currentCredits + course.credits) + ' units. The maximum permitted is 18 units. Drop another class or petition for an overload.';
      setFieldError(courseSelect, courseError, creditLimitMsg);
      errorSummaryList.innerHTML = '<li><a href="#reg-course-select">' + creditLimitMsg + '</a></li>';
      formErrorSummary.classList.remove('hidden');
      formErrorSummary.focus();
      announceAlert(creditLimitMsg);
      return;
    }

    // Clear error summary if any was previously shown
    formErrorSummary.classList.add('hidden');
    errorSummaryList.innerHTML = '';

    // Collect valid form payload
    var payload = {
      studentName: nameVal,
      studentId: idVal,
      studentEmail: emailVal,
      program: programSelect.value,
      courseCode: selectedCourseCode,
      term: termSelect.value,
      gradingOption: gradingInput ? gradingInput.value : 'Letter Grade',
      notes: (notesInput.value || '').trim()
    };

    // Open confirmation modal (native <dialog>)
    openRegistrationConfirmModal(payload, course);
  }

  /**
   * Finalize confirmed registration from modal
   */
  function confirmRegistration() {
    if (!pendingRegistrationData) return;

    var course = pendingRegistrationData.course;
    var formData = pendingRegistrationData.formData;

    // Add to student registrations
    studentRegistrations.push({
      code: course.code,
      title: course.title,
      credits: course.credits,
      schedule: course.schedule,
      room: course.room,
      instructor: course.instructor,
      gradingBasis: formData.gradingOption,
      term: formData.term,
      status: 'Enrolled'
    });

    // Update course catalog capacity
    course.seatsEnrolled = Math.min(course.seatsTotal, course.seatsEnrolled + 1);

    // Close modal
    regConfirmDialog.close();
    pendingRegistrationData = null;

    // Reset registration form course select & checkmarks
    regCourseSelect.value = '';
    document.getElementById('reg-prereq-ack').checked = false;
    document.getElementById('reg-policy-ack').checked = false;
    document.getElementById('reg-notes').value = '';

    // Refresh displays across the application
    populateRegistrationDropdown();
    renderCourseCatalog(false);
    renderProfileAndTable();

    var newTotalCredits = calculateTotalCredits();
    announceStatus('Registration confirmed! Successfully enrolled in ' + course.code + ': ' + course.title + '. Current total: ' + newTotalCredits + ' units.');

    // Navigate to student profile to show the newly added course in the data table
    window.location.hash = '#profile';
    navigateToRoute('#profile');
  }

  /**
   * Finalize dropping course from modal
   */
  function confirmDropCourse() {
    if (!pendingDropCourseCode) return;

    var courseCode = pendingDropCourseCode;
    var index = studentRegistrations.findIndex(function (item) { return item.code === courseCode; });

    if (index !== -1) {
      studentRegistrations.splice(index, 1);

      // Restore seat in catalog
      var course = COURSES_DATA.find(function (c) { return c.code === courseCode; });
      if (course && course.seatsEnrolled > 0) {
        course.seatsEnrolled -= 1;
      }

      dropConfirmDialog.close();
      pendingDropCourseCode = null;

      // Refresh displays
      populateRegistrationDropdown();
      renderCourseCatalog(false);
      renderProfileAndTable();

      var currentCredits = calculateTotalCredits();
      announceStatus(courseCode + ' has been dropped from your registered schedule. Current total: ' + currentCredits + ' units.');

      // Return keyboard focus to a logical heading or button
      var heading = document.getElementById('registered-courses-heading');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    } else {
      dropConfirmDialog.close();
      pendingDropCourseCode = null;
    }
  }

  // =========================================================================
  // 9. EVENT LISTENERS SETUP
  // =========================================================================

  function setupEventListeners() {
    // -----------------------------------------------------------------------
    // Mobile navigation events
    // -----------------------------------------------------------------------
    if (menuToggleBtn) {
      menuToggleBtn.addEventListener('click', toggleMobileMenu);

      menuToggleBtn.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleMobileMenu();
        }
      });
    }

    // Escape key closes mobile menu and restores focus
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNavMenu.classList.contains('is-open')) {
        closeMobileMenu();
        if (menuToggleBtn) menuToggleBtn.focus();
      }
    });

    // Close menu when clicking nav link
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    // -----------------------------------------------------------------------
    // Routing & Hash changes
    // -----------------------------------------------------------------------
    window.addEventListener('hashchange', function () {
      navigateToRoute(window.location.hash);
    });

    // Featured department links on Home page
    document.querySelectorAll('[data-dept-filter]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var dept = this.getAttribute('data-dept-filter');
        if (dept) {
          filterDept.value = dept;
          renderCourseCatalog(true);
        }
      });
    });

    // -----------------------------------------------------------------------
    // Catalog controls & search
    // -----------------------------------------------------------------------
    catalogSearchInput.addEventListener('input', function () {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(function () {
        renderCourseCatalog(true);
      }, 300);
    });

    clearSearchBtn.addEventListener('click', function () {
      catalogSearchInput.value = '';
      renderCourseCatalog(true);
      catalogSearchInput.focus();
      announceStatus('Search cleared. Showing all courses.');
    });

    filterDept.addEventListener('change', function () { renderCourseCatalog(true); });
    filterLevel.addEventListener('change', function () { renderCourseCatalog(true); });
    filterAvailability.addEventListener('change', function () { renderCourseCatalog(true); });
    sortCourses.addEventListener('change', function () { renderCourseCatalog(false); });

    function resetAllFilters() {
      catalogSearchInput.value = '';
      filterDept.value = 'all';
      filterLevel.value = 'all';
      filterAvailability.value = 'all';
      sortCourses.value = 'code-asc';
      renderCourseCatalog(true);
      filterDept.focus();
      announceStatus('All filters reset. Showing all courses.');
    }

    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

    // -----------------------------------------------------------------------
    // Course Card & List Delegated Events
    // -----------------------------------------------------------------------
    courseCardsList.addEventListener('click', function (e) {
      // View Details button
      var detailsBtn = e.target.closest('.view-details-btn');
      if (detailsBtn) {
        var code = detailsBtn.getAttribute('data-code');
        openCourseDetailsModal(code, detailsBtn);
        return;
      }

      // Register button from card
      var regBtn = e.target.closest('.register-card-btn');
      if (regBtn) {
        var code2 = regBtn.getAttribute('data-code');
        // Preselect course in registration dropdown and navigate to registration page
        regCourseSelect.value = code2;
        window.location.hash = '#register';
        navigateToRoute('#register', true);
        setTimeout(function () {
          regCourseSelect.focus();
          announceStatus('Registration form opened for ' + code2 + '. Complete required fields to register.');
        }, 80);
      }
    });

    // Details Modal Register button
    detailsModalRegisterBtn.addEventListener('click', function () {
      var code = this.getAttribute('data-code');
      if (!code) return;
      courseDetailsDialog.close();
      regCourseSelect.value = code;
      window.location.hash = '#register';
      navigateToRoute('#register', true);
      setTimeout(function () {
        regCourseSelect.focus();
        announceStatus('Registration form opened for ' + code + '. Complete required fields to register.');
      }, 80);
    });

    detailsModalCloseBtn.addEventListener('click', function () {
      courseDetailsDialog.close();
    });

    // -----------------------------------------------------------------------
    // Registration Form Events
    // -----------------------------------------------------------------------
    registrationForm.addEventListener('submit', handleRegistrationSubmit);

    // Registration confirm dialog buttons
    regModalCancelBtn.addEventListener('click', function () {
      regConfirmDialog.close();
      announceStatus('Registration cancelled.');
      if (lastFocusedElementBeforeModal) {
        lastFocusedElementBeforeModal.focus();
      }
    });

    regModalConfirmBtn.addEventListener('click', confirmRegistration);

    // -----------------------------------------------------------------------
    // Registered Courses Data Table Delegated Events
    // -----------------------------------------------------------------------
    registeredCoursesTbody.addEventListener('click', function (e) {
      var dropBtn = e.target.closest('.drop-course-btn');
      if (dropBtn) {
        var code = dropBtn.getAttribute('data-code');
        openDropConfirmModal(code, dropBtn);
      }
    });

    // Drop confirm dialog buttons
    dropModalCancelBtn.addEventListener('click', function () {
      dropConfirmDialog.close();
      announceStatus('Course drop cancelled.');
      if (lastFocusedElementBeforeModal) {
        lastFocusedElementBeforeModal.focus();
      }
    });

    dropModalConfirmBtn.addEventListener('click', confirmDropCourse);

    // -----------------------------------------------------------------------
    // Help & Advising Modal Events
    // -----------------------------------------------------------------------
    document.querySelectorAll('.open-help-modal-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openHelpModal(this);
      });
    });

    helpModalCloseBtn.addEventListener('click', function () {
      helpDialog.close();
    });

    // -----------------------------------------------------------------------
    // Dialog closing focus restoration (WCAG Section 8)
    // -----------------------------------------------------------------------
    [courseDetailsDialog, regConfirmDialog, dropConfirmDialog, helpDialog].forEach(function (dialog) {
      if (!dialog) return;
      dialog.addEventListener('close', function () {
        if (lastFocusedElementBeforeModal && typeof lastFocusedElementBeforeModal.focus === 'function') {
          // If the element still exists in document and is connected
          if (document.body.contains(lastFocusedElementBeforeModal)) {
            lastFocusedElementBeforeModal.focus();
          }
        }
      });
    });

    // Clear inline error on input change
    registrationForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.removeAttribute('aria-invalid');
      });
      field.addEventListener('change', function () {
        this.removeAttribute('aria-invalid');
      });
    });
  }

  // =========================================================================
  // 10. INITIALIZATION
  // =========================================================================

  function initialize() {
    populateRegistrationDropdown();
    renderCourseCatalog(false);
    renderProfileAndTable();
    setupEventListeners();

    // Initialize current view from URL hash or default to #home
    var initialHash = window.location.hash || '#home';
    navigateToRoute(initialHash, false);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
