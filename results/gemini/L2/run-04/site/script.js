/**
 * ==========================================================================
 * APEX UNIVERSITY COURSE REGISTRATION SYSTEM - JAVASCRIPT CORE
 * ==========================================================================
 * Fully functional single-page university course registration application.
 * Manages view switching, course catalog search/filter, live registration,
 * credit limits calculation, accessible modals, and weekly timetable visuals.
 */

// Strict Mode
'use strict';

/* ==========================================================================
   1. Data Store: University Courses Database & Initial State
   ========================================================================== */
const COURSES_DATABASE = [
  {
    id: 'cse101',
    code: 'CSE 101',
    title: 'Design and Analysis of Algorithms',
    department: 'Computer Science',
    deptClass: 'badge-cs',
    credits: 4,
    instructor: 'Prof. Shachar Lovett',
    instructorEmail: 'slovett@apex.edu',
    schedule: 'MWF 10:00 AM - 10:50 AM',
    days: ['Mon', 'Wed', 'Fri'],
    timeSlot: '10:00 AM',
    location: 'Centaur Hall 115',
    term: 'Fall 2026',
    format: 'In-Person',
    level: 'Upper Division',
    enrolled: 135,
    capacity: 150,
    prerequisites: 'CSE 21 and CSE 100 with grade of C- or higher.',
    description: 'Design and analysis of efficient algorithms. Covers divide-and-conquer, greedy algorithms, dynamic programming, graph search, network flow, and introduction to NP-completeness and approximation algorithms.',
    sections: [
      { id: 'A01', time: 'Fri 9:00 AM - 9:50 AM', room: 'Centaur 102', ta: 'David Zhang' },
      { id: 'A02', time: 'Fri 1:00 PM - 1:50 PM', room: 'Centaur 104', ta: 'Elena Rostova' }
    ]
  },
  {
    id: 'cse110',
    code: 'CSE 110',
    title: 'Software Engineering & Agile Systems',
    department: 'Computer Science',
    deptClass: 'badge-cs',
    credits: 4,
    instructor: 'Prof. Gary Powell',
    instructorEmail: 'gpowell@apex.edu',
    schedule: 'TuTh 2:00 PM - 3:20 PM',
    days: ['Tue', 'Thu'],
    timeSlot: '2:00 PM',
    location: 'Science & Engineering Bldg 202',
    term: 'Fall 2026',
    format: 'In-Person',
    level: 'Upper Division',
    enrolled: 94,
    capacity: 100,
    prerequisites: 'CSE 100 and basic familiarity with Git and team programming.',
    description: 'Introduction to agile software engineering principles, design patterns, continuous integration and deployment (CI/CD), software architecture, user testing, and collaborative team project development.',
    sections: [
      { id: 'B01', time: 'Wed 3:00 PM - 3:50 PM', room: 'SEB Lab 12', ta: 'Sarah Lin' },
      { id: 'B02', time: 'Thu 4:00 PM - 4:50 PM', room: 'SEB Lab 14', ta: 'Marcus Bell' }
    ]
  },
  {
    id: 'dsc100',
    code: 'DSC 100',
    title: 'Introduction to Data Management & SQL',
    department: 'Data Science',
    deptClass: 'badge-ds',
    credits: 4,
    instructor: 'Prof. Justin Eldridge',
    instructorEmail: 'jeldridge@apex.edu',
    schedule: 'MWF 1:00 PM - 1:50 PM',
    days: ['Mon', 'Wed', 'Fri'],
    timeSlot: '1:00 PM',
    location: 'Franklin Quad 304',
    term: 'Fall 2026',
    format: 'Hybrid',
    level: 'Upper Division',
    enrolled: 76,
    capacity: 120,
    prerequisites: 'DSC 20 or CSE 11; MATH 18 or MATH 20C.',
    description: 'Storage, indexing, querying, and manipulation of tabular, relational, and unstructured datasets. In-depth SQL, relational algebra, database design, normalization, transactions, and NoSQL document stores.',
    sections: [
      { id: 'A01', time: 'Tue 10:00 AM - 10:50 AM', room: 'Virtual Zoom', ta: 'Priya Sen' },
      { id: 'A02', time: 'Thu 11:00 AM - 11:50 AM', room: 'FQ 308', ta: 'Leo Vance' }
    ]
  },
  {
    id: 'math180a',
    code: 'MATH 180A',
    title: 'Introduction to Probability',
    department: 'Mathematics',
    deptClass: 'badge-math',
    credits: 4,
    instructor: 'Prof. Yuriy Nemish',
    instructorEmail: 'ynemish@apex.edu',
    schedule: 'MWF 11:00 AM - 11:50 AM',
    days: ['Mon', 'Wed', 'Fri'],
    timeSlot: '11:00 AM',
    location: 'Applied Physics & Math 4218',
    term: 'Fall 2026',
    format: 'In-Person',
    level: 'Upper Division',
    enrolled: 62,
    capacity: 80,
    prerequisites: 'MATH 20C or MATH 31BH with grade of C- or higher.',
    description: 'Probability spaces, random variables, cumulative distribution functions, mathematical expectation, variance, central limit theorem, and law of large numbers with applications.',
    sections: [
      { id: 'A01', time: 'Tue 1:00 PM - 1:50 PM', room: 'APM 2101', ta: 'Kyle Morgan' },
      { id: 'A02', time: 'Thu 2:00 PM - 2:50 PM', room: 'APM 2101', ta: 'Chloe Adams' }
    ]
  },
  {
    id: 'cogs108',
    code: 'COGS 108',
    title: 'Data Science in Practice & Ethics',
    department: 'Cognitive Science',
    deptClass: 'badge-cogs',
    credits: 4,
    instructor: 'Prof. Shannon Ellis',
    instructorEmail: 'sellis@apex.edu',
    schedule: 'TuTh 9:30 AM - 10:50 AM',
    days: ['Tue', 'Thu'],
    timeSlot: '9:30 AM',
    location: 'Online Asynchronous / Zoom',
    term: 'Fall 2026',
    format: 'Online',
    level: 'Upper Division',
    enrolled: 142,
    capacity: 150,
    prerequisites: 'COGS 18 or CSE 8A or equivalent programming experience.',
    description: 'Practical data science workflow covering scraping, exploratory data analysis, data wrangling, algorithmic bias, ethical implications of AI models, and presentation of empirical findings.',
    sections: [
      { id: 'C01', time: 'Mon 2:00 PM - 2:50 PM', room: 'Remote Discord', ta: 'Amir Khan' }
    ]
  },
  {
    id: 'vis105',
    code: 'VIS 105',
    title: 'Contemporary Art, Visual Culture & Media',
    department: 'Arts & Humanities',
    deptClass: 'badge-arts',
    credits: 3,
    instructor: 'Prof. Nicole Vance',
    instructorEmail: 'nvance@apex.edu',
    schedule: 'MW 3:00 PM - 4:20 PM',
    days: ['Mon', 'Wed'],
    timeSlot: '3:00 PM',
    location: 'Visual Arts Complex 101',
    term: 'Fall 2026',
    format: 'In-Person',
    level: 'Lower Division',
    enrolled: 44,
    capacity: 50,
    prerequisites: 'None. Open to all university undergraduate students.',
    description: 'Investigation of contemporary visual expressions across digital media, installation, video art, and global cultural discourse. Emphasizes critical visual literacy.',
    sections: [
      { id: 'D01', time: 'Fri 12:00 PM - 1:20 PM', room: 'VAC Studio B', ta: 'Jordan Cole' }
    ]
  },
  {
    id: 'bio100',
    code: 'BIO 100',
    title: 'Molecular Genetics & Genomics',
    department: 'Biological Sciences',
    deptClass: 'badge-bio',
    credits: 4,
    instructor: 'Prof. Lisa Chen',
    instructorEmail: 'lchen@apex.edu',
    schedule: 'TuTh 11:00 AM - 12:20 PM',
    days: ['Tue', 'Thu'],
    timeSlot: '11:00 AM',
    location: 'Bonner Hall 2130',
    term: 'Fall 2026',
    format: 'In-Person',
    level: 'Upper Division',
    enrolled: 110,
    capacity: 110,
    prerequisites: 'BILD 1 and CHEM 40A.',
    description: 'Structure and function of genetic material, mechanisms of gene expression, recombinant DNA technology, and genomic technologies in modern biomedical research.',
    sections: [
      { id: 'E01', time: 'Wed 11:00 AM - 11:50 AM', room: 'Bonner 114', ta: 'Victor Vance' }
    ]
  },
  {
    id: 'psyc101',
    code: 'PSYC 101',
    title: 'General Psychology: Foundations & Mind',
    department: 'Psychology',
    deptClass: 'badge-psyc',
    credits: 3,
    instructor: 'Prof. Ricardo Martinez',
    instructorEmail: 'rmartinez@apex.edu',
    schedule: 'TuTh 8:00 AM - 9:20 AM',
    days: ['Tue', 'Thu'],
    timeSlot: '8:00 AM',
    location: 'McGill Hall 1110',
    term: 'Fall 2026',
    format: 'In-Person',
    level: 'Lower Division',
    enrolled: 168,
    capacity: 200,
    prerequisites: 'None.',
    description: 'Comprehensive overview of human cognitive processes, biological bases of behavior, developmental stages, social perception, psychological disorders, and psychotherapy.',
    sections: [
      { id: 'F01', time: 'Fri 10:00 AM - 10:50 AM', room: 'McGill 201', ta: 'Hanna Schmidt' }
    ]
  },
  {
    id: 'econ101',
    code: 'ECON 101',
    title: 'Principles of Microeconomics',
    department: 'Economics',
    deptClass: 'badge-econ',
    credits: 4,
    instructor: 'Prof. Robert Taylor',
    instructorEmail: 'rtaylor@apex.edu',
    schedule: 'MWF 9:00 AM - 9:50 AM',
    days: ['Mon', 'Wed', 'Fri'],
    timeSlot: '9:00 AM',
    location: 'Solís Hall 107',
    term: 'Fall 2026',
    format: 'In-Person',
    level: 'Lower Division',
    enrolled: 125,
    capacity: 150,
    prerequisites: 'MATH 10A or MATH 20A.',
    description: 'Analysis of individual economic behavior, markets, supply and demand pricing, elasticity, competition, monopoly, externalities, and public goods.',
    sections: [
      { id: 'G01', time: 'Mon 4:00 PM - 4:50 PM', room: 'Solís 112', ta: 'Grace Kim' }
    ]
  },
  {
    id: 'phys105',
    code: 'PHYS 105',
    title: 'Classical Mechanics & Oscillations',
    department: 'Physics',
    deptClass: 'badge-phys',
    credits: 4,
    instructor: 'Prof. Stephen Hawking Jr.',
    instructorEmail: 'shawking@apex.edu',
    schedule: 'TuTh 3:30 PM - 4:50 PM',
    days: ['Tue', 'Thu'],
    timeSlot: '3:30 PM',
    location: 'Mayer Hall 2623',
    term: 'Fall 2026',
    format: 'In-Person',
    level: 'Upper Division',
    enrolled: 38,
    capacity: 60,
    prerequisites: 'PHYS 2A and MATH 20D.',
    description: 'Newtonian mechanics, harmonic oscillator, non-inertial reference systems, central force motion, gravitation, and Lagrangian mechanics fundamentals.',
    sections: [
      { id: 'H01', time: 'Wed 5:00 PM - 5:50 PM', room: 'Mayer 5301', ta: 'Evan Ross' }
    ]
  },
  {
    id: 'dsc180a',
    code: 'DSC 180A',
    title: 'Data Science Senior Capstone Project I',
    department: 'Data Science',
    deptClass: 'badge-ds',
    credits: 4,
    instructor: 'Prof. Aaron Fraenkel',
    instructorEmail: 'afraenkel@apex.edu',
    schedule: 'MW 2:00 PM - 3:20 PM',
    days: ['Mon', 'Wed'],
    timeSlot: '2:00 PM',
    location: 'Halicioğlu Data Science Hub 210',
    term: 'Fall 2026',
    format: 'Hybrid',
    level: 'Upper Division',
    enrolled: 42,
    capacity: 50,
    prerequisites: 'Senior standing in Data Science major; DSC 102.',
    description: 'First quarter of yearlong capstone experience. Working in small domain-specific groups under faculty mentorship on end-to-end real world predictive modeling challenges.',
    sections: [
      { id: 'I01', time: 'Fri 2:00 PM - 3:50 PM', room: 'HDSI 214', ta: 'Zane Malik' }
    ]
  },
  {
    id: 'eng102',
    code: 'ENG 102',
    title: 'Academic Writing & Digital Communication',
    department: 'Arts & Humanities',
    deptClass: 'badge-arts',
    credits: 3,
    instructor: 'Prof. Melissa Walker',
    instructorEmail: 'mwalker@apex.edu',
    schedule: 'TuTh 1:00 PM - 2:20 PM',
    days: ['Tue', 'Thu'],
    timeSlot: '1:00 PM',
    location: 'Online Synchronous',
    term: 'Fall 2026',
    format: 'Online',
    level: 'Lower Division',
    enrolled: 24,
    capacity: 30,
    prerequisites: 'Completion of College Writing requirement.',
    description: 'Rhetorical analysis, scholarly argumentation, multimodal web publishing, and synthesis of research data for scientific and technical audiences.',
    sections: [
      { id: 'J01', time: 'Tue 3:00 PM - 3:50 PM', room: 'Zoom Room 1', ta: 'Olivia Cruz' }
    ]
  }
];

// Application Global State
const appState = {
  student: {
    name: 'Alex Rivera',
    id: 'A16942081',
    email: 'a.rivera@apex.edu',
    major: 'Computer Science & Data Analytics B.S.',
    level: 'Junior (Year 3)',
    gpa: 3.84,
    maxCredits: 20
  },
  // Default enrolled courses (Total: 4 + 4 + 3 = 11 Credits)
  registered: [
    {
      courseId: 'cse101',
      sectionId: 'A01',
      grading: 'Letter Grade',
      enrolledDate: 'Oct 28, 2026'
    },
    {
      courseId: 'math180a',
      sectionId: 'A01',
      grading: 'Letter Grade',
      enrolledDate: 'Oct 29, 2026'
    },
    {
      courseId: 'vis105',
      sectionId: 'D01',
      grading: 'Pass / No Pass',
      enrolledDate: 'Oct 30, 2026'
    }
  ],
  filters: {
    search: '',
    department: 'ALL',
    term: 'Fall 2026',
    format: 'ALL',
    level: 'ALL',
    openOnly: false,
    sortBy: 'code-asc',
    viewMode: 'grid'
  },
  // Pending modal action storage
  pendingAction: null,
  // Accessible focus return tracker
  lastFocusedElement: null
};

/* ==========================================================================
   2. DOM Element Selectors
   ========================================================================== */
const DOM = {
  // Navigation
  navLinks: document.querySelectorAll('.nav-link, .footer-nav-link'),
  pageViews: document.querySelectorAll('.page-view'),
  headerCreditsDisplay: document.getElementById('header-credits-display'),
  navRegCount: document.getElementById('nav-reg-count'),
  mobileToggleBtn: document.getElementById('mobile-menu-toggle'),
  mainNav: document.getElementById('main-navigation'),
  announcementCloseBtn: document.getElementById('close-announcement-btn'),
  quickProfileBtn: document.getElementById('quick-profile-btn'),
  navBrandLink: document.getElementById('nav-brand-link'),

  // Home View
  homeBrowseBtn: document.getElementById('home-browse-btn'),
  homeRegBtn: document.getElementById('home-registration-btn'),
  homeViewAllCats: document.getElementById('home-view-all-cats'),
  homeStatCredits: document.getElementById('home-stat-credits'),
  homeStatCourses: document.getElementById('home-stat-courses'),
  homeCreditRatio: document.getElementById('home-credit-ratio'),
  homeCreditProgressBar: document.getElementById('home-credit-progressbar'),
  homeCreditProgressFill: document.getElementById('home-credit-progressfill'),
  categoryCards: document.querySelectorAll('.category-card'),

  // Catalog View
  catalogSearchInput: document.getElementById('catalog-search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  filterDept: document.getElementById('filter-department'),
  filterTerm: document.getElementById('filter-term'),
  filterFormat: document.getElementById('filter-format'),
  filterLevel: document.getElementById('filter-level'),
  filterSort: document.getElementById('filter-sort'),
  filterOpenOnly: document.getElementById('filter-open-only'),
  resetFiltersBtn: document.getElementById('reset-filters-btn'),
  emptyResetBtn: document.getElementById('empty-reset-btn'),
  catalogCountDisplay: document.getElementById('catalog-count-display'),
  coursesCatalogGrid: document.getElementById('courses-catalog-grid'),
  catalogEmptyState: document.getElementById('catalog-empty-state'),
  viewModeGrid: document.getElementById('view-mode-grid'),
  viewModeList: document.getElementById('view-mode-list'),

  // Registration View
  regTotalCreditsVal: document.getElementById('reg-total-credits-val'),
  regStatusPill: document.getElementById('reg-status-pill'),
  regForm: document.getElementById('course-registration-form'),
  regCourseSelect: document.getElementById('reg-course-select'),
  regSectionSelect: document.getElementById('reg-section-select'),
  regGradingSelect: document.getElementById('reg-grading-select'),
  regAddCode: document.getElementById('reg-add-code'),
  regPrereqAck: document.getElementById('reg-prereq-ack'),
  regCourseError: document.getElementById('reg-course-error'),
  regAckError: document.getElementById('reg-ack-error'),
  coursePreviewBox: document.getElementById('course-preview-box'),
  previewCourseCode: document.getElementById('preview-course-code'),
  previewCourseDept: document.getElementById('preview-course-dept'),
  previewCourseTitle: document.getElementById('preview-course-title'),
  previewCourseTime: document.getElementById('preview-course-time'),
  previewCourseUnits: document.getElementById('preview-course-units'),
  previewCourseSeats: document.getElementById('preview-course-seats'),
  previewCoursePrereq: document.getElementById('preview-course-prereq'),
  impactCurrentUnits: document.getElementById('impact-current-units'),
  impactFutureUnits: document.getElementById('impact-future-units'),
  impactWarning: document.getElementById('impact-warning'),
  registeredTableBody: document.getElementById('registered-table-body'),
  tableTotalUnits: document.getElementById('table-total-units'),
  tableCourseCount: document.getElementById('table-course-count'),
  regTableEmpty: document.getElementById('reg-table-empty'),
  printScheduleBtn: document.getElementById('print-schedule-btn'),
  weeklyTimetable: document.getElementById('weekly-timetable'),

  // Profile View
  profileForm: document.getElementById('student-profile-form'),

  // Confirmation Modal
  confirmModal: document.getElementById('confirmation-modal'),
  modalConfirmTitle: document.getElementById('modal-confirm-title'),
  modalConfirmDesc: document.getElementById('modal-confirm-desc'),
  modalBadgeDept: document.getElementById('modal-badge-dept'),
  modalCode: document.getElementById('modal-code'),
  modalCourseName: document.getElementById('modal-course-name'),
  modalUnits: document.getElementById('modal-units'),
  modalGrading: document.getElementById('modal-grading'),
  modalInstructor: document.getElementById('modal-instructor'),
  modalSchedule: document.getElementById('modal-schedule'),
  modalAlertText: document.getElementById('modal-alert-text'),
  modalActionConfirmBtn: document.getElementById('modal-action-confirm-btn'),
  modalCancelBtn: document.getElementById('modal-cancel-btn'),
  modalCloseXBtn: document.getElementById('modal-close-x-btn'),
  modalIconBadge: document.getElementById('modal-icon-badge'),

  // Course Details Modal
  detailsModal: document.getElementById('course-details-modal'),
  detDeptBadge: document.getElementById('det-dept-badge'),
  detCode: document.getElementById('det-code'),
  detCredits: document.getElementById('det-credits'),
  detFormatBadge: document.getElementById('det-format-badge'),
  detTitle: document.getElementById('det-title'),
  detInstructor: document.getElementById('det-instructor'),
  detDescription: document.getElementById('det-description'),
  detSchedule: document.getElementById('det-schedule'),
  detLocation: document.getElementById('det-location'),
  detCapacityText: document.getElementById('det-capacity-text'),
  detCapacityFill: document.getElementById('det-capacity-fill'),
  detPrereqs: document.getElementById('det-prereqs'),
  detSectionsList: document.getElementById('det-sections-list'),
  detRegisterBtn: document.getElementById('modal-details-register-btn'),
  detCloseBtn: document.getElementById('modal-details-close-btn'),
  detCloseX: document.getElementById('modal-details-close-x'),

  // Live Regions
  toastRegion: document.getElementById('toast-region'),
  srAnnouncements: document.getElementById('sr-announcements')
};

/* ==========================================================================
   3. Helper Functions: State Calculations & Utilities
   ========================================================================== */

/**
 * Returns full course object by courseId string.
 */
function getCourseById(courseId) {
  return COURSES_DATABASE.find(c => c.id === courseId) || null;
}

/**
 * Checks if student is already enrolled in courseId.
 */
function isCourseEnrolled(courseId) {
  return appState.registered.some(r => r.courseId === courseId);
}

/**
 * Calculates total enrolled credits.
 */
function getTotalEnrolledCredits() {
  return appState.registered.reduce((sum, item) => {
    const course = getCourseById(item.courseId);
    return sum + (course ? course.credits : 0);
  }, 0);
}

/**
 * Announces a message to screen readers using ARIA live assertive.
 */
function announceToScreenReader(message) {
  if (DOM.srAnnouncements) {
    DOM.srAnnouncements.textContent = message;
  }
}

/**
 * Displays an accessible, dismissible toast notification.
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  else if (type === 'danger') icon = '⚠️';
  else if (type === 'warning') icon = '🔔';

  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icon}</span>
    <span class="toast-message">${escapeHTML(message)}</span>
    <button type="button" class="toast-close" aria-label="Dismiss notification">&times;</button>
  `;

  // Close button handler
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  });

  DOM.toastRegion.appendChild(toast);

  // Screen reader announcement
  announceToScreenReader(message);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }
  }, 5000);
}

/**
 * Basic HTML escaping helper to prevent XSS.
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ==========================================================================
   4. Router & View Management
   ========================================================================== */

/**
 * Switches the active application page view.
 */
function switchView(targetViewId, pushHash = true) {
  const validViews = ['home', 'catalog', 'register', 'profile'];
  if (!validViews.includes(targetViewId)) {
    targetViewId = 'home';
  }

  // Update Page Sections
  DOM.pageViews.forEach(view => {
    if (view.id === `view-${targetViewId}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Update Navigation Links
  document.querySelectorAll('.main-nav .nav-link').forEach(link => {
    const view = link.getAttribute('data-view');
    if (view === targetViewId) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  // Update hash without jumping
  if (pushHash && window.location.hash !== `#${targetViewId}`) {
    window.history.pushState(null, '', `#${targetViewId}`);
  }

  // Close mobile drawer if open
  DOM.mainNav.classList.remove('mobile-active');
  DOM.mobileToggleBtn.setAttribute('aria-expanded', 'false');

  // Scroll main container to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Inform screen readers
  const viewTitles = {
    home: 'Home Dashboard',
    catalog: 'Course Catalog and Search',
    register: 'Course Registration and Schedule',
    profile: 'Student Profile and Records'
  };
  announceToScreenReader(`Navigated to ${viewTitles[targetViewId]}`);
}

/**
 * Initializes router from hash or defaults to #home.
 */
function initRouter() {
  const hash = window.location.hash.replace('#', '') || 'home';
  switchView(hash, false);

  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.replace('#', '') || 'home';
    switchView(currentHash, false);
  });
}

/* ==========================================================================
   5. Global UI Counters & Sync
   ========================================================================== */

/**
 * Synchronizes credit counts, ratio bars, and status badges across all views.
 */
function updateGlobalCreditUI() {
  const totalCredits = getTotalEnrolledCredits();
  const maxCredits = appState.student.maxCredits;
  const enrolledCount = appState.registered.length;
  const percentage = Math.min(100, Math.round((totalCredits / maxCredits) * 100));

  // 1. Header display
  DOM.headerCreditsDisplay.textContent = `${totalCredits} / ${maxCredits}`;
  DOM.navRegCount.textContent = enrolledCount;
  DOM.navRegCount.setAttribute('aria-label', `${enrolledCount} courses registered`);

  // 2. Home view stats
  DOM.homeStatCredits.textContent = totalCredits;
  DOM.homeStatCourses.textContent = enrolledCount;
  DOM.homeCreditRatio.textContent = `${totalCredits} / ${maxCredits} Units (${percentage}%)`;
  DOM.homeCreditProgressBar.setAttribute('aria-valuenow', percentage);
  DOM.homeCreditProgressFill.style.width = `${percentage}%`;

  // 3. Registration view badges
  DOM.regTotalCreditsVal.textContent = totalCredits;
  if (totalCredits >= 18) {
    DOM.regStatusPill.className = 'badge badge-warning';
    DOM.regStatusPill.textContent = 'High Academic Load';
  } else if (totalCredits >= 12) {
    DOM.regStatusPill.className = 'badge badge-success';
    DOM.regStatusPill.textContent = 'Full-Time Student';
  } else {
    DOM.regStatusPill.className = 'badge badge-info';
    DOM.regStatusPill.textContent = 'Part-Time Student';
  }

  // 4. Data Table Summary
  DOM.tableTotalUnits.textContent = `${totalCredits} Units`;
  DOM.tableCourseCount.textContent = `${enrolledCount} Course${enrolledCount === 1 ? '' : 's'}`;
}

/* ==========================================================================
   6. Course Catalog: Rendering, Filtering & Search
   ========================================================================== */

/**
 * Filters and sorts course dataset according to current appState.filters.
 */
function getFilteredCourses() {
  const { search, department, term, format, level, openOnly, sortBy } = appState.filters;

  return COURSES_DATABASE.filter(course => {
    // Search keyword query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchCode = course.code.toLowerCase().includes(q);
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchInstructor = course.instructor.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchInstructor && !matchDesc) {
        return false;
      }
    }

    // Department Filter
    if (department !== 'ALL' && course.department !== department) {
      return false;
    }

    // Term Filter
    if (term && course.term !== term) {
      return false;
    }

    // Format Filter
    if (format !== 'ALL' && course.format !== format) {
      return false;
    }

    // Level Filter
    if (level !== 'ALL' && course.level !== level) {
      return false;
    }

    // Open Seats Only
    if (openOnly && course.enrolled >= course.capacity) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'code-asc':
        return a.code.localeCompare(b.code);
      case 'code-desc':
        return b.code.localeCompare(a.code);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'seats-desc':
        return (b.capacity - b.enrolled) - (a.capacity - a.enrolled);
      case 'credits-desc':
        return b.credits - a.credits;
      default:
        return 0;
    }
  });
}

/**
 * Renders course cards inside the catalog grid.
 */
function renderCourseCatalog() {
  const filtered = getFilteredCourses();
  DOM.coursesCatalogGrid.innerHTML = '';

  // Update counts
  DOM.catalogCountDisplay.innerHTML = `Showing <strong>${filtered.length}</strong> of ${COURSES_DATABASE.length} courses`;
  announceToScreenReader(`Course catalog updated. Showing ${filtered.length} courses.`);

  // Handle empty state
  if (filtered.length === 0) {
    DOM.catalogEmptyState.style.display = 'block';
    DOM.coursesCatalogGrid.style.display = 'none';
    return;
  } else {
    DOM.catalogEmptyState.style.display = 'none';
    DOM.coursesCatalogGrid.style.display = 'grid';
  }

  // Create cards
  filtered.forEach(course => {
    const isEnrolled = isCourseEnrolled(course.id);
    const seatsRemaining = course.capacity - course.enrolled;
    const isFull = seatsRemaining <= 0;
    const fillPercent = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));

    const card = document.createElement('article');
    card.className = `course-card ${isEnrolled ? 'registered-state' : ''}`;
    card.setAttribute('data-course-id', course.id);

    // Format badge class
    let formatClass = 'badge-primary';
    if (course.format === 'Online') formatClass = 'badge-purple';
    if (course.format === 'Hybrid') formatClass = 'badge-info';

    // Seating Meter color
    let seatColorClass = 'seats-open-text';
    let progressBg = '#10b981';
    if (isFull) {
      seatColorClass = 'seats-full-text';
      progressBg = '#dc2626';
    } else if (seatsRemaining <= 10) {
      seatColorClass = 'seats-full-text';
      progressBg = '#d97706';
    }

    card.innerHTML = `
      <div>
        <div class="card-top-row">
          <span class="course-code-pill">${escapeHTML(course.code)}</span>
          <div class="card-tag-group">
            <span class="badge ${course.deptClass}">${escapeHTML(course.department)}</span>
            <span class="badge ${formatClass}">${escapeHTML(course.format)}</span>
          </div>
        </div>

        <h3 class="course-title-text">${escapeHTML(course.title)}</h3>

        <div class="course-instructor-text">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>${escapeHTML(course.instructor)}</span>
        </div>

        <div class="course-schedule-box">
          <div class="schedule-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>${escapeHTML(course.schedule)} (${course.credits} Units)</span>
          </div>
          <div class="location-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${escapeHTML(course.location)}</span>
          </div>
        </div>

        <div class="card-capacity-box">
          <div class="capacity-meta">
            <span class="${seatColorClass}">
              ${isFull ? 'Waitlist Only (0 open)' : `${seatsRemaining} seats available`}
            </span>
            <span>${course.enrolled} / ${course.capacity} Filled</span>
          </div>
          <div class="progress-track sm" role="progressbar" aria-valuenow="${fillPercent}" aria-valuemin="0" aria-valuemax="100" aria-label="Seat capacity utilization">
            <div class="progress-fill" style="width: ${fillPercent}%; background-color: ${progressBg};"></div>
          </div>
        </div>
      </div>

      <div class="card-action-row">
        <button type="button" class="btn btn-secondary btn-sm btn-details" data-id="${course.id}" aria-label="View details for ${escapeHTML(course.code)}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>Details</span>
        </button>

        ${isEnrolled ? `
          <button type="button" class="btn btn-danger-outline btn-sm btn-drop-quick" data-id="${course.id}" aria-label="Drop ${escapeHTML(course.code)}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            <span>Drop</span>
          </button>
        ` : `
          <button type="button" class="btn ${isFull ? 'btn-secondary' : 'btn-primary'} btn-sm btn-register-quick" data-id="${course.id}" aria-label="Register for ${escapeHTML(course.code)}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>${isFull ? 'Waitlist' : 'Register'}</span>
          </button>
        `}
      </div>
    `;

    // Event Listeners for Card Buttons
    const detailsBtn = card.querySelector('.btn-details');
    detailsBtn.addEventListener('click', (e) => {
      appState.lastFocusedElement = e.currentTarget;
      openCourseDetailsModal(course.id);
    });

    const registerBtn = card.querySelector('.btn-register-quick');
    if (registerBtn) {
      registerBtn.addEventListener('click', (e) => {
        appState.lastFocusedElement = e.currentTarget;
        handleQuickRegisterClick(course.id);
      });
    }

    const dropBtn = card.querySelector('.btn-drop-quick');
    if (dropBtn) {
      dropBtn.addEventListener('click', (e) => {
        appState.lastFocusedElement = e.currentTarget;
        openDropConfirmationModal(course.id);
      });
    }

    DOM.coursesCatalogGrid.appendChild(card);
  });
}

/**
 * Pre-populates the registration form dropdown with available courses.
 */
function populateRegistrationCourseDropdown() {
  DOM.regCourseSelect.innerHTML = '<option value="">-- Choose an available course --</option>';

  COURSES_DATABASE.forEach(course => {
    const isEnrolled = isCourseEnrolled(course.id);
    const option = document.createElement('option');
    option.value = course.id;

    if (isEnrolled) {
      option.textContent = `${course.code}: ${course.title} (${course.credits} Units) - [ALREADY ENROLLED]`;
      option.disabled = true;
    } else {
      const seats = course.capacity - course.enrolled;
      const statusNote = seats <= 0 ? 'Waitlist Only' : `${seats} seats left`;
      option.textContent = `${course.code}: ${course.title} (${course.credits} Units) - ${statusNote}`;
    }

    DOM.regCourseSelect.appendChild(option);
  });
}

/**
 * Updates the course preview box in the registration form.
 */
function updateRegistrationPreview() {
  const selectedCourseId = DOM.regCourseSelect.value;
  const currentUnits = getTotalEnrolledCredits();
  DOM.impactCurrentUnits.textContent = currentUnits;

  if (!selectedCourseId) {
    DOM.coursePreviewBox.style.display = 'none';
    DOM.impactFutureUnits.textContent = currentUnits;
    DOM.impactWarning.style.display = 'none';
    return;
  }

  const course = getCourseById(selectedCourseId);
  if (!course) return;

  const seats = course.capacity - course.enrolled;
  const futureUnits = currentUnits + course.credits;

  DOM.previewCourseCode.textContent = course.code;
  DOM.previewCourseDept.textContent = course.department;
  DOM.previewCourseDept.className = `badge ${course.deptClass}`;
  DOM.previewCourseTitle.textContent = course.title;
  DOM.previewCourseTime.textContent = course.schedule;
  DOM.previewCourseUnits.textContent = `${course.credits} Units`;
  DOM.previewCourseSeats.textContent = seats <= 0 ? '0 open (Waitlist)' : `${seats} open`;
  DOM.previewCoursePrereq.innerHTML = `<strong>Prerequisites:</strong> ${escapeHTML(course.prerequisites)}`;

  DOM.coursePreviewBox.style.display = 'block';
  DOM.impactFutureUnits.textContent = futureUnits;

  // Credit limit warning
  if (futureUnits > appState.student.maxCredits) {
    DOM.impactWarning.style.display = 'block';
  } else {
    DOM.impactWarning.style.display = 'none';
  }

  // Update section dropdown with course-specific sections
  DOM.regSectionSelect.innerHTML = '';
  course.sections.forEach(sec => {
    const opt = document.createElement('option');
    opt.value = sec.id;
    opt.textContent = `Section ${sec.id} - ${sec.time} (${sec.room}) - TA: ${sec.ta}`;
    DOM.regSectionSelect.appendChild(opt);
  });
}

/* ==========================================================================
   7. Registered Courses Data Table & Visual Timetable
   ========================================================================== */

/**
 * Renders the data table of currently registered courses.
 */
function renderRegisteredTable() {
  DOM.registeredTableBody.innerHTML = '';

  if (appState.registered.length === 0) {
    DOM.regTableEmpty.style.display = 'block';
    return;
  } else {
    DOM.regTableEmpty.style.display = 'none';
  }

  appState.registered.forEach(regItem => {
    const course = getCourseById(regItem.courseId);
    if (!course) return;

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>
        <span class="table-course-code">${escapeHTML(course.code)}</span>
        <span class="badge ${course.deptClass} mt-1">${escapeHTML(course.department)}</span>
      </td>
      <td>
        <strong>${escapeHTML(course.title)}</strong>
        <span class="table-instructor-sub">Instructor: ${escapeHTML(course.instructor)}</span>
      </td>
      <td>
        <strong>${course.credits}.0</strong>
      </td>
      <td>
        <span>${escapeHTML(course.schedule)}</span>
        <span class="table-room-sub">${escapeHTML(course.location)} (Sec: ${escapeHTML(regItem.sectionId)})</span>
      </td>
      <td>
        <span class="badge badge-info">${escapeHTML(regItem.grading)}</span>
      </td>
      <td>
        <span class="badge badge-success">Confirmed</span>
      </td>
      <td class="text-right">
        <button type="button" class="btn btn-danger-outline btn-sm btn-drop-table" data-id="${course.id}" aria-label="Drop ${escapeHTML(course.code)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <span>Drop</span>
        </button>
      </td>
    `;

    // Drop handler
    const dropBtn = row.querySelector('.btn-drop-table');
    dropBtn.addEventListener('click', (e) => {
      appState.lastFocusedElement = e.currentTarget;
      openDropConfirmationModal(course.id);
    });

    DOM.registeredTableBody.appendChild(row);
  });
}

/**
 * Renders the colorful weekly class timetable (Mon - Fri, 8am - 5pm).
 */
function renderWeeklyTimetable() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  DOM.weeklyTimetable.innerHTML = '';

  // Header Row
  const timeHeader = document.createElement('div');
  timeHeader.className = 'timetable-header-cell';
  timeHeader.textContent = 'Time';
  DOM.weeklyTimetable.appendChild(timeHeader);

  days.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'timetable-header-cell';
    dayHeader.textContent = day;
    DOM.weeklyTimetable.appendChild(dayHeader);
  });

  // Time Rows
  times.forEach(timeSlot => {
    // Time label column
    const timeCell = document.createElement('div');
    timeCell.className = 'timetable-time-label';
    timeCell.textContent = timeSlot;
    DOM.weeklyTimetable.appendChild(timeCell);

    // Day slots
    days.forEach(day => {
      const slot = document.createElement('div');
      slot.className = 'timetable-slot';

      // Find course matching this day & approx time
      const matchReg = appState.registered.find(r => {
        const c = getCourseById(r.courseId);
        if (!c) return false;
        const dayMatch = c.days.includes(day);
        const timeMatch = c.timeSlot.split(':')[0] === timeSlot.split(':')[0] && c.timeSlot.includes(timeSlot.slice(-2));
        return dayMatch && timeMatch;
      });

      if (matchReg) {
        const c = getCourseById(matchReg.courseId);
        let slotColorClass = 'slot-cs';
        if (c.department === 'Mathematics') slotColorClass = 'slot-math';
        if (c.department === 'Arts & Humanities') slotColorClass = 'slot-vis';
        if (c.department === 'Biological Sciences') slotColorClass = 'slot-bio';
        if (c.department === 'Data Science') slotColorClass = 'slot-ds';

        slot.innerHTML = `
          <div class="timetable-course-pill ${slotColorClass}" title="${escapeHTML(c.title)}">
            <span>${escapeHTML(c.code)}</span>
            <span style="font-size:0.65rem; opacity:0.9;">${escapeHTML(c.location.split(' ')[0])}</span>
          </div>
        `;
      }

      DOM.weeklyTimetable.appendChild(slot);
    });
  });
}

/* ==========================================================================
   8. Registration Flow & Validations
   ========================================================================== */

/**
 * Handles quick register click from catalog cards.
 */
function handleQuickRegisterClick(courseId) {
  const course = getCourseById(courseId);
  if (!course) return;

  const currentUnits = getTotalEnrolledCredits();
  if (currentUnits + course.credits > appState.student.maxCredits) {
    showToast(`Cannot register for ${course.code}. Maximum limit of ${appState.student.maxCredits} credits will be exceeded!`, 'danger');
    return;
  }

  // Pre-fill registration form and switch view or open modal directly
  DOM.regCourseSelect.value = courseId;
  updateRegistrationPreview();
  switchView('register');
  DOM.regForm.scrollIntoView({ behavior: 'smooth' });
  showToast(`Selected ${course.code}. Choose your preferred section and confirm registration below.`, 'info');
}

/**
 * Handles direct registration form submission.
 */
function handleRegistrationFormSubmit(e) {
  e.preventDefault();

  // Reset errors
  DOM.regCourseError.style.display = 'none';
  DOM.regCourseError.textContent = '';
  DOM.regAckError.style.display = 'none';
  DOM.regAckError.textContent = '';

  const courseId = DOM.regCourseSelect.value;
  const sectionId = DOM.regSectionSelect.value;
  const grading = DOM.regGradingSelect.value;
  const ack = DOM.regPrereqAck.checked;

  let hasError = false;

  if (!courseId) {
    DOM.regCourseError.textContent = 'Please select a course to register.';
    DOM.regCourseError.style.display = 'block';
    DOM.regCourseSelect.focus();
    hasError = true;
  } else if (isCourseEnrolled(courseId)) {
    DOM.regCourseError.textContent = 'You are already registered for this course.';
    DOM.regCourseError.style.display = 'block';
    DOM.regCourseSelect.focus();
    hasError = true;
  }

  if (!ack) {
    DOM.regAckError.textContent = 'You must confirm prerequisite and tuition policy acknowledgment.';
    DOM.regAckError.style.display = 'block';
    if (!hasError) DOM.regPrereqAck.focus();
    hasError = true;
  }

  if (hasError) return;

  const course = getCourseById(courseId);
  const currentUnits = getTotalEnrolledCredits();
  if (currentUnits + course.credits > appState.student.maxCredits) {
    showToast(`Registration denied: Course will exceed the ${appState.student.maxCredits} credit maximum limit!`, 'danger');
    DOM.impactWarning.style.display = 'block';
    return;
  }

  // Open confirmation modal for registration
  openRegisterConfirmationModal(course, sectionId, grading);
}

/* ==========================================================================
   9. Accessible Modals: Confirmation & Course Details
   ========================================================================== */

/**
 * Opens confirmation modal for course addition.
 */
function openRegisterConfirmationModal(course, sectionId, grading) {
  appState.pendingAction = {
    type: 'ADD',
    courseId: course.id,
    sectionId: sectionId,
    grading: grading
  };

  DOM.modalConfirmTitle.textContent = 'Confirm Course Registration';
  DOM.modalConfirmDesc.textContent = `Please verify the details below before finalizing your enrollment in ${course.code}.`;
  DOM.modalIconBadge.style.background = '#e0e7ff';
  DOM.modalIconBadge.style.color = '#4338ca';
  DOM.modalIconBadge.innerHTML = '📝';

  DOM.modalBadgeDept.textContent = course.department;
  DOM.modalBadgeDept.className = `badge ${course.deptClass}`;
  DOM.modalCode.textContent = course.code;
  DOM.modalCourseName.textContent = course.title;
  DOM.modalUnits.textContent = `${course.credits}.0 Units`;
  DOM.modalGrading.textContent = grading;
  DOM.modalInstructor.textContent = course.instructor;
  DOM.modalSchedule.textContent = `${course.schedule} (Sec: ${sectionId})`;

  DOM.modalAlertText.textContent = 'By confirming, your seat will be secured and tuition assessment updated.';
  DOM.modalActionConfirmBtn.className = 'btn btn-primary';
  DOM.modalActionConfirmBtn.textContent = 'Confirm & Enroll';

  openModal(DOM.confirmModal);
  DOM.modalActionConfirmBtn.focus();
}

/**
 * Opens confirmation modal for dropping a course.
 */
function openDropConfirmationModal(courseId) {
  const course = getCourseById(courseId);
  if (!course) return;

  const regInfo = appState.registered.find(r => r.courseId === courseId);

  appState.pendingAction = {
    type: 'DROP',
    courseId: course.id
  };

  DOM.modalConfirmTitle.textContent = 'Confirm Course Drop / Withdrawal';
  DOM.modalConfirmDesc.textContent = `Are you sure you want to drop ${course.code} - ${course.title}? This will immediately release your reserved seat.`;
  DOM.modalIconBadge.style.background = '#fee2e2';
  DOM.modalIconBadge.style.color = '#dc2626';
  DOM.modalIconBadge.innerHTML = '⚠️';

  DOM.modalBadgeDept.textContent = course.department;
  DOM.modalBadgeDept.className = `badge ${course.deptClass}`;
  DOM.modalCode.textContent = course.code;
  DOM.modalCourseName.textContent = course.title;
  DOM.modalUnits.textContent = `${course.credits}.0 Units`;
  DOM.modalGrading.textContent = regInfo ? regInfo.grading : 'Letter Grade';
  DOM.modalInstructor.textContent = course.instructor;
  DOM.modalSchedule.textContent = course.schedule;

  DOM.modalAlertText.textContent = 'Dropping before the Nov 17 deadline ensures this course will not appear as a "W" on your transcript.';
  DOM.modalActionConfirmBtn.className = 'btn btn-danger-outline';
  DOM.modalActionConfirmBtn.style.background = '#dc2626';
  DOM.modalActionConfirmBtn.style.color = '#ffffff';
  DOM.modalActionConfirmBtn.textContent = 'Confirm & Drop Course';

  openModal(DOM.confirmModal);
  DOM.modalActionConfirmBtn.focus();
}

/**
 * Handles confirmation action click from modal.
 */
function executeModalAction() {
  if (!appState.pendingAction) return;

  const { type, courseId, sectionId, grading } = appState.pendingAction;
  const course = getCourseById(courseId);

  if (type === 'ADD') {
    appState.registered.push({
      courseId: courseId,
      sectionId: sectionId || 'A01',
      grading: grading || 'Letter Grade',
      enrolledDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    course.enrolled = Math.min(course.capacity, course.enrolled + 1);

    // Reset registration form
    DOM.regForm.reset();
    DOM.coursePreviewBox.style.display = 'none';

    showToast(`🎉 Success! You have enrolled in ${course.code} - ${course.title}.`, 'success');
  } else if (type === 'DROP') {
    appState.registered = appState.registered.filter(r => r.courseId !== courseId);
    course.enrolled = Math.max(0, course.enrolled - 1);

    showToast(`Course dropped: You have dropped ${course.code}.`, 'info');
  }

  // Refresh all state views
  updateGlobalCreditUI();
  renderCourseCatalog();
  populateRegistrationCourseDropdown();
  renderRegisteredTable();
  renderWeeklyTimetable();

  closeModal(DOM.confirmModal);
  appState.pendingAction = null;
}

/**
 * Opens Course Details modal with complete course syllabus & metrics.
 */
function openCourseDetailsModal(courseId) {
  const course = getCourseById(courseId);
  if (!course) return;

  const isEnrolled = isCourseEnrolled(course.id);
  const seatsRemaining = course.capacity - course.enrolled;
  const isFull = seatsRemaining <= 0;
  const fillPercent = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));

  DOM.detDeptBadge.textContent = course.department;
  DOM.detDeptBadge.className = `badge ${course.deptClass}`;
  DOM.detCode.textContent = course.code;
  DOM.detCredits.textContent = `${course.credits}.0 Quarter Units`;
  DOM.detFormatBadge.textContent = course.format;
  DOM.detTitle.textContent = course.title;
  DOM.detInstructor.textContent = `${course.instructor} (${course.instructorEmail})`;
  DOM.detDescription.textContent = course.description;
  DOM.detSchedule.textContent = course.schedule;
  DOM.detLocation.textContent = course.location;
  DOM.detPrereqs.textContent = course.prerequisites;

  DOM.detCapacityText.textContent = `${course.enrolled} / ${course.capacity} Seats Filled (${seatsRemaining} Open)`;
  DOM.detCapacityFill.style.width = `${fillPercent}%`;
  DOM.detCapacityFill.style.backgroundColor = isFull ? '#dc2626' : (seatsRemaining <= 10 ? '#d97706' : '#10b981');

  // Render sections list
  DOM.detSectionsList.innerHTML = '';
  course.sections.forEach(sec => {
    const item = document.createElement('div');
    item.className = 'detail-box mt-2';
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>Section ${escapeHTML(sec.id)}: ${escapeHTML(sec.time)}</strong>
        <span class="badge badge-primary">${escapeHTML(sec.room)}</span>
      </div>
      <span style="font-size:0.8rem; color:var(--text-light);">Teaching Assistant: ${escapeHTML(sec.ta)}</span>
    `;
    DOM.detSectionsList.appendChild(item);
  });

  // Dynamic Register / Drop Button inside details modal
  if (isEnrolled) {
    DOM.detRegisterBtn.className = 'btn btn-danger-outline';
    DOM.detRegisterBtn.innerHTML = '<span>Drop This Course</span>';
    DOM.detRegisterBtn.onclick = () => {
      closeModal(DOM.detailsModal);
      openDropConfirmationModal(course.id);
    };
  } else {
    DOM.detRegisterBtn.className = 'btn btn-primary';
    DOM.detRegisterBtn.innerHTML = `<span>${isFull ? 'Add to Waitlist' : 'Register for this Course'}</span>`;
    DOM.detRegisterBtn.onclick = () => {
      closeModal(DOM.detailsModal);
      handleQuickRegisterClick(course.id);
    };
  }

  openModal(DOM.detailsModal);
}

/**
 * Generic Modal Opener with Accessibility Focus Lock.
 */
function openModal(modalEl) {
  modalEl.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Find first focusable element
  const focusable = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) {
    focusable[0].focus();
  }

  // Trap focus listener
  modalEl.addEventListener('keydown', trapFocusHandler);
}

/**
 * Generic Modal Closer with Focus Return.
 */
function closeModal(modalEl) {
  modalEl.style.display = 'none';
  document.body.style.overflow = '';
  modalEl.removeEventListener('keydown', trapFocusHandler);

  // Return focus to triggering button for accessibility
  if (appState.lastFocusedElement && typeof appState.lastFocusedElement.focus === 'function') {
    appState.lastFocusedElement.focus();
  }
}

/**
 * Accessibility Focus Trap Handler inside Modals.
 */
function trapFocusHandler(e) {
  if (e.key === 'Escape') {
    closeModal(e.currentTarget);
    return;
  }

  if (e.key === 'Tab') {
    const focusable = e.currentTarget.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
}

/* ==========================================================================
   10. Event Listeners & Interactions Setup
   ========================================================================== */

function setupEventListeners() {
  // Navigation Links
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetView = link.getAttribute('data-view');
      if (targetView) {
        e.preventDefault();
        switchView(targetView);
      }
    });
  });

  // Brand Logo Link
  if (DOM.navBrandLink) {
    DOM.navBrandLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('home');
    });
  }

  // Quick Profile Pill in Header
  if (DOM.quickProfileBtn) {
    DOM.quickProfileBtn.addEventListener('click', () => {
      switchView('profile');
    });
  }

  // Mobile Menu Toggle
  if (DOM.mobileToggleBtn) {
    DOM.mobileToggleBtn.addEventListener('click', () => {
      const isExpanded = DOM.mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      DOM.mobileToggleBtn.setAttribute('aria-expanded', !isExpanded);
      DOM.mainNav.classList.toggle('mobile-active');
    });
  }

  // Announcement Banner Close
  if (DOM.announcementCloseBtn) {
    DOM.announcementCloseBtn.addEventListener('click', () => {
      const bar = DOM.announcementCloseBtn.closest('.announcement-bar');
      if (bar) bar.style.display = 'none';
    });
  }

  // Hero CTA Buttons
  if (DOM.homeBrowseBtn) {
    DOM.homeBrowseBtn.addEventListener('click', () => switchView('catalog'));
  }
  if (DOM.homeRegBtn) {
    DOM.homeRegBtn.addEventListener('click', () => switchView('register'));
  }
  if (DOM.homeViewAllCats) {
    DOM.homeViewAllCats.addEventListener('click', () => {
      appState.filters.department = 'ALL';
      DOM.filterDept.value = 'ALL';
      renderCourseCatalog();
      switchView('catalog');
    });
  }

  // Category Shortcut Cards in Home View
  DOM.categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const dept = card.getAttribute('data-dept');
      if (dept) {
        appState.filters.department = dept;
        DOM.filterDept.value = dept;
        renderCourseCatalog();
        switchView('catalog');
        showToast(`Filtered catalog by ${dept}`, 'info');
      }
    });
  });

  // Catalog Search Input
  DOM.catalogSearchInput.addEventListener('input', (e) => {
    appState.filters.search = e.target.value;
    DOM.searchClearBtn.style.display = e.target.value ? 'flex' : 'none';
    renderCourseCatalog();
  });

  // Search Clear Button
  DOM.searchClearBtn.addEventListener('click', () => {
    DOM.catalogSearchInput.value = '';
    appState.filters.search = '';
    DOM.searchClearBtn.style.display = 'none';
    DOM.catalogSearchInput.focus();
    renderCourseCatalog();
  });

  // Filter Dropdowns
  DOM.filterDept.addEventListener('change', (e) => {
    appState.filters.department = e.target.value;
    renderCourseCatalog();
  });

  DOM.filterTerm.addEventListener('change', (e) => {
    appState.filters.term = e.target.value;
    renderCourseCatalog();
  });

  DOM.filterFormat.addEventListener('change', (e) => {
    appState.filters.format = e.target.value;
    renderCourseCatalog();
  });

  DOM.filterLevel.addEventListener('change', (e) => {
    appState.filters.level = e.target.value;
    renderCourseCatalog();
  });

  DOM.filterSort.addEventListener('change', (e) => {
    appState.filters.sortBy = e.target.value;
    renderCourseCatalog();
  });

  DOM.filterOpenOnly.addEventListener('change', (e) => {
    appState.filters.openOnly = e.target.checked;
    renderCourseCatalog();
  });

  // Reset Filters Buttons
  const resetFiltersAction = () => {
    appState.filters.search = '';
    appState.filters.department = 'ALL';
    appState.filters.term = 'Fall 2026';
    appState.filters.format = 'ALL';
    appState.filters.level = 'ALL';
    appState.filters.openOnly = false;
    appState.filters.sortBy = 'code-asc';

    DOM.catalogSearchInput.value = '';
    DOM.searchClearBtn.style.display = 'none';
    DOM.filterDept.value = 'ALL';
    DOM.filterTerm.value = 'Fall 2026';
    DOM.filterFormat.value = 'ALL';
    DOM.filterLevel.value = 'ALL';
    DOM.filterSort.value = 'code-asc';
    DOM.filterOpenOnly.checked = false;

    renderCourseCatalog();
    showToast('Catalog filters have been reset.', 'info');
  };

  DOM.resetFiltersBtn.addEventListener('click', resetFiltersAction);
  DOM.emptyResetBtn.addEventListener('click', resetFiltersAction);

  // View Mode Toggles (Grid vs List)
  DOM.viewModeGrid.addEventListener('click', () => {
    DOM.viewModeGrid.classList.add('active');
    DOM.viewModeGrid.setAttribute('aria-checked', 'true');
    DOM.viewModeList.classList.remove('active');
    DOM.viewModeList.setAttribute('aria-checked', 'false');
    DOM.coursesCatalogGrid.classList.remove('list-view');
  });

  DOM.viewModeList.addEventListener('click', () => {
    DOM.viewModeList.classList.add('active');
    DOM.viewModeList.setAttribute('aria-checked', 'true');
    DOM.viewModeGrid.classList.remove('active');
    DOM.viewModeGrid.setAttribute('aria-checked', 'false');
    DOM.coursesCatalogGrid.classList.add('list-view');
  });

  // Registration Form Course Select Change
  DOM.regCourseSelect.addEventListener('change', updateRegistrationPreview);

  // Registration Form Submission
  DOM.regForm.addEventListener('submit', handleRegistrationFormSubmit);

  // Print Registered Schedule
  DOM.printScheduleBtn.addEventListener('click', () => {
    window.print();
  });

  // Confirmation Modal Actions
  DOM.modalActionConfirmBtn.addEventListener('click', executeModalAction);
  DOM.modalCancelBtn.addEventListener('click', () => closeModal(DOM.confirmModal));
  DOM.modalCloseXBtn.addEventListener('click', () => closeModal(DOM.confirmModal));

  // Course Details Modal Close
  DOM.detCloseBtn.addEventListener('click', () => closeModal(DOM.detailsModal));
  DOM.detCloseX.addEventListener('click', () => closeModal(DOM.detailsModal));

  // Close modals when clicking outside modal-container
  [DOM.confirmModal, DOM.detailsModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Profile Form Submission
  DOM.profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const prefName = document.getElementById('prof-pref-name').value;
    showToast(`Profile saved! Updated contact preferences for ${escapeHTML(prefName || 'Alex')}.`, 'success');
  });
}

/* ==========================================================================
   11. Application Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI components and dynamic data
  initRouter();
  updateGlobalCreditUI();
  renderCourseCatalog();
  populateRegistrationCourseDropdown();
  renderRegisteredTable();
  renderWeeklyTimetable();
  setupEventListeners();

  // Welcome user announcement for screen readers
  announceToScreenReader('Welcome to Apex University Course Registration System. Use the navigation links to explore the catalog and manage courses.');
});
