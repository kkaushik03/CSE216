/**
 * UniEnroll - University Course Registration System
 * Main Application Logic & Interactive State Management
 */

(function () {
  'use strict';

  // ==========================================
  // Sample Data: 16 University Courses
  // ==========================================
  const INITIAL_COURSES = [
    {
      id: 'cse-101',
      code: 'CSE 101',
      title: 'Design & Analysis of Algorithms',
      department: 'CSE',
      deptName: 'Computer Science',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Miles Jones',
      schedule: 'Mon, Wed, Fri 10:00 - 10:50 AM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 10,
      endHour: 11,
      location: 'Center Hall 105',
      capacity: 35,
      enrolled: 28,
      description: 'Algorithm design paradigms: greedy algorithms, divide-and-conquer, dynamic programming, maximum flow, graph algorithms, and intractability (NP-completeness).',
      prereqs: 'CSE 21 and CSE 12 with grade C- or better.',
      tags: ['Core Requirement', 'Algorithms', 'Theory'],
      featured: true
    },
    {
      id: 'cse-110',
      code: 'CSE 110',
      title: 'Software Engineering Principles',
      department: 'CSE',
      deptName: 'Computer Science',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Gary Gillespie',
      schedule: 'Tue, Thu 2:00 - 3:20 PM',
      days: ['Tue', 'Thu'],
      startHour: 14,
      endHour: 15.5,
      location: 'Warren Lecture Hall 2001',
      capacity: 50,
      enrolled: 47,
      description: 'Introduction to software design patterns, agile workflows, CI/CD pipelines, git collaboration, unit testing, and full-stack software development in agile teams.',
      prereqs: 'CSE 100 with grade C- or better.',
      tags: ['Capstone Prep', 'Agile', 'Team Projects'],
      featured: true
    },
    {
      id: 'cse-150a',
      code: 'CSE 150A',
      title: 'Introduction to Artificial Intelligence',
      department: 'CSE',
      deptName: 'Computer Science',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Rose Yu',
      schedule: 'Mon, Wed 3:00 - 4:20 PM',
      days: ['Mon', 'Wed'],
      startHour: 15,
      endHour: 16.5,
      location: 'EBU3B Computer Lab 1202',
      capacity: 40,
      enrolled: 40,
      waitlist: 4,
      description: 'Foundations of artificial intelligence: state-space search, heuristic search, minimax game playing, Markov Decision Processes, and reinforcement learning.',
      prereqs: 'CSE 101 and MATH 180A.',
      tags: ['AI / ML Track', 'Upper Elective', 'Popular'],
      featured: true
    },
    {
      id: 'math-109',
      code: 'MATH 109',
      title: 'Mathematical Reasoning & Proofs',
      department: 'MATH',
      deptName: 'Mathematics',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Laura Stevens',
      schedule: 'Mon, Wed, Fri 9:00 - 9:50 AM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 9,
      endHour: 10,
      location: 'Applied Physics & Math 2301',
      capacity: 35,
      enrolled: 30,
      description: 'An introduction to mathematical logic, set theory, induction, equivalence relations, functions, cardinality, and writing rigorous proofs.',
      prereqs: 'MATH 20C or MATH 31BH.',
      tags: ['Proof Writing', 'Pure Math', 'Foundation'],
      featured: false
    },
    {
      id: 'math-180a',
      code: 'MATH 180A',
      title: 'Introduction to Probability',
      department: 'MATH',
      deptName: 'Mathematics',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Jason Schweinsberg',
      schedule: 'Tue, Thu 9:30 - 10:50 AM',
      days: ['Tue', 'Thu'],
      startHour: 9.5,
      endHour: 11,
      location: 'Peterson Hall 108',
      capacity: 45,
      enrolled: 41,
      description: 'Probability spaces, combinatorial analysis, conditional probability, independent events, random variables, distributions, expectation, variance, and Central Limit Theorem.',
      prereqs: 'MATH 20C or MATH 31BH.',
      tags: ['Core Requirement', 'Probability', 'STEM'],
      featured: true
    },
    {
      id: 'dsc-100',
      code: 'DSC 100',
      title: 'Data Wrangling & Management',
      department: 'DSC',
      deptName: 'Data Science',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Justin Eldridge',
      schedule: 'Tue, Thu 12:30 - 1:50 PM',
      days: ['Tue', 'Thu'],
      startHour: 12.5,
      endHour: 14,
      location: 'San Diego Supercomputer Center 101',
      capacity: 45,
      enrolled: 39,
      description: 'Principles and techniques for data acquisition, cleaning, transformation, integration, SQL database querying, relational algebra, and web scraping.',
      prereqs: 'DSC 80 or CSE 12.',
      tags: ['Data Engineering', 'SQL', 'Python'],
      featured: false
    },
    {
      id: 'dsc-140a',
      code: 'DSC 140A',
      title: 'Probabilistic Modeling for Data Science',
      department: 'DSC',
      deptName: 'Data Science',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Shannon Ellis',
      schedule: 'Mon, Wed 1:00 - 2:20 PM',
      days: ['Mon', 'Wed'],
      startHour: 13,
      endHour: 14.5,
      location: 'Center Hall 212',
      capacity: 35,
      enrolled: 32,
      description: 'Probabilistic machine learning: Bayesian modeling, maximum likelihood estimation, Gaussian Mixture Models, Markov chains, and latent variable models.',
      prereqs: 'DSC 40A and MATH 180A.',
      tags: ['Machine Learning', 'Modeling', 'Upper Elective'],
      featured: false
    },
    {
      id: 'bild-1',
      code: 'BILD 1',
      title: 'The Cell: Structure & Cellular Genetics',
      department: 'BILD',
      deptName: 'Biological Sciences',
      level: 'LOWER',
      credits: 4,
      instructor: 'Dr. Kathleen French',
      schedule: 'Mon, Wed, Fri 11:00 - 11:50 AM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 11,
      endHour: 12,
      location: 'Price Center Theater',
      capacity: 120,
      enrolled: 110,
      description: 'Introduction to cellular structure and function, molecular energetics, DNA replication, gene expression, and modern molecular biological mechanisms.',
      prereqs: 'None. Open to all students.',
      tags: ['General Ed', 'Natural Science', 'Biology'],
      featured: false
    },
    {
      id: 'bimm-100',
      code: 'BIMM 100',
      title: 'Molecular Biology & Gene Regulation',
      department: 'BILD',
      deptName: 'Biological Sciences',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Amy Pasquinelli',
      schedule: 'Tue, Thu 11:00 AM - 12:20 PM',
      days: ['Tue', 'Thu'],
      startHour: 11,
      endHour: 12.5,
      location: 'Bonner Hall 2130',
      capacity: 40,
      enrolled: 36,
      description: 'Detailed analysis of transcription, translation, chromatin remodeling, RNA processing, and gene regulation networks in eukaryotes.',
      prereqs: 'BILD 1 and CHEM 40A.',
      tags: ['Genetics', 'Molecular', 'Pre-Med'],
      featured: false
    },
    {
      id: 'econ-100a',
      code: 'ECON 100A',
      title: 'Microeconomics A: Consumer & Producer Theory',
      department: 'ECON',
      deptName: 'Economics',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Mark Machina',
      schedule: 'Mon, Wed 8:30 - 9:50 AM',
      days: ['Mon', 'Wed'],
      startHour: 8.5,
      endHour: 10,
      location: 'Solís Hall 107',
      capacity: 55,
      enrolled: 48,
      description: 'Theoretical foundations of individual decision making under constraints, consumer utility maximization, demand estimation, and cost-minimizing firms.',
      prereqs: 'ECON 1 and MATH 20C.',
      tags: ['Social Science', 'Microeconomics', 'Finance'],
      featured: false
    },
    {
      id: 'econ-120a',
      code: 'ECON 120A',
      title: 'Econometrics & Statistical Forecasting',
      department: 'ECON',
      deptName: 'Economics',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. James Hamilton',
      schedule: 'Tue, Thu 3:30 - 4:50 PM',
      days: ['Tue', 'Thu'],
      startHour: 15.5,
      endHour: 17,
      location: 'Sequoyah Hall 147',
      capacity: 50,
      enrolled: 45,
      description: 'Probability and statistics applied to economic analysis: hypothesis testing, ordinary least squares (OLS) regression, autocorrelation, and forecasting.',
      prereqs: 'ECON 1 and MATH 20C.',
      tags: ['Quantitative', 'Statistics', 'Economics'],
      featured: false
    },
    {
      id: 'psyc-100',
      code: 'PSYC 100',
      title: 'Clinical Psychology & Psychopathology',
      department: 'PSYC',
      deptName: 'Psychology',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Sandra Brown',
      schedule: 'Tue, Thu 8:00 - 9:20 AM',
      days: ['Tue', 'Thu'],
      startHour: 8,
      endHour: 9.5,
      location: 'McGill Hall 1110',
      capacity: 60,
      enrolled: 52,
      description: 'Comprehensive study of psychological disorders, diagnostic classifications, psychodynamic and cognitive-behavioral therapies, and ethical clinical practice.',
      prereqs: 'PSYC 1 or PSYC 60.',
      tags: ['Social Science', 'Clinical', 'Mental Health'],
      featured: false
    },
    {
      id: 'psyc-106',
      code: 'PSYC 106',
      title: 'Behavioral Neuroscience',
      department: 'PSYC',
      deptName: 'Psychology',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. David Wixted',
      schedule: 'Mon, Wed, Fri 1:00 - 1:50 PM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 13,
      endHour: 14,
      location: 'Mandler Hall 3500',
      capacity: 45,
      enrolled: 42,
      description: 'Neurobiological basis of memory, perception, motor behavior, sleep, and emotion. Structure and synaptic communication within the nervous system.',
      prereqs: 'PSYC 102 or BILD 1.',
      tags: ['Neuroscience', 'Upper Division', 'Brain Research'],
      featured: false
    },
    {
      id: 'vis-142',
      code: 'VIS 142',
      title: 'Interactive Digital Art & Media',
      department: 'VIS',
      deptName: 'Visual Arts',
      level: 'UPPER',
      credits: 4,
      instructor: 'Prof. Brett Stalbaum',
      schedule: 'Mon, Wed 4:30 - 5:50 PM',
      days: ['Mon', 'Wed'],
      startHour: 16.5,
      endHour: 18,
      location: 'Visual Arts Facility 302',
      capacity: 25,
      enrolled: 22,
      description: 'Exploration of interactive media installations, generative artwork, creative coding, responsive physical computing, and digital aesthetics.',
      prereqs: 'VIS 60 or VIS 84.',
      tags: ['Digital Media', 'Creative Studio', 'Fine Arts'],
      featured: true
    },
    {
      id: 'vis-160',
      code: 'VIS 160',
      title: 'Graphic Design Studio & Typography',
      department: 'VIS',
      deptName: 'Visual Arts',
      level: 'UPPER',
      credits: 3,
      instructor: 'Prof. Alena Vance',
      schedule: 'Tue, Thu 10:00 - 11:20 AM',
      days: ['Tue', 'Thu'],
      startHour: 10,
      endHour: 11.5,
      location: 'Visual Arts Facility 405',
      capacity: 20,
      enrolled: 18,
      description: 'In-depth studio in visual communication, layout hierarchy, grid systems, typography, color interaction, and brand identity development.',
      prereqs: 'VIS 1 or VIS 60.',
      tags: ['Design', 'Typography', 'Studio'],
      featured: false
    },
    {
      id: 'cogs-108',
      code: 'COGS 108',
      title: 'Data Science in Practice',
      department: 'COGS',
      deptName: 'Cognitive Science',
      level: 'UPPER',
      credits: 4,
      instructor: 'Dr. Bradley Voytek',
      schedule: 'Fri 1:00 - 3:50 PM',
      days: ['Fri'],
      startHour: 13,
      endHour: 16,
      location: 'Cognitive Science Building 001',
      capacity: 70,
      enrolled: 65,
      description: 'Hands-on practice applying data analysis, statistical modeling, machine learning, and visualization techniques to real-world questions and societal issues.',
      prereqs: 'COGS 18 or CSE 8A or CSE 11.',
      tags: ['Practical Data', 'Cognitive Sci', 'Python'],
      featured: true
    }
  ];

  // Default initial registered courses for Alex Morgan (11 Credits total)
  const INITIAL_REGISTERED = [
    {
      courseId: 'cse-110',
      gradeOption: 'Letter (A-F)',
      term: 'Spring 2026',
      registeredAt: '2026-03-15T09:12:00Z',
      status: 'Enrolled'
    },
    {
      courseId: 'math-180a',
      gradeOption: 'Letter (A-F)',
      term: 'Spring 2026',
      registeredAt: '2026-03-15T09:15:00Z',
      status: 'Enrolled'
    },
    {
      courseId: 'vis-160',
      gradeOption: 'Letter (A-F)',
      term: 'Spring 2026',
      registeredAt: '2026-03-15T09:18:00Z',
      status: 'Enrolled'
    }
  ];

  const STORAGE_KEY = 'uniEnroll_registered_data_v1';
  const MAX_CREDITS = 20;

  // ==========================================
  // Application State
  // ==========================================
  class RegistrationSystem {
    constructor() {
      this.courses = [...INITIAL_COURSES];
      this.registered = this.loadState();
      this.activePage = 'home';
      this.pendingRegistration = null;
      this.pendingDropCourseId = null;

      // Filter state for catalog
      this.filters = {
        search: '',
        department: 'ALL',
        level: 'ALL',
        credits: 'ALL',
        availability: 'ALL',
        sort: 'code-asc'
      };

      this.init();
    }

    loadState() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Could not read from localStorage, using initial sample registrations', e);
      }
      return [...INITIAL_REGISTERED];
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.registered));
      } catch (e) {
        console.warn('Could not save to localStorage', e);
      }
    }

    // ==========================================
    // Initialization & Event Listeners
    // ==========================================
    init() {
      this.setupNavigation();
      this.setupCatalogEvents();
      this.setupRegistrationForm();
      this.setupModals();
      this.setupAnnouncement();

      // Render initial views
      this.renderAll();

      // Process initial hash or default to home
      this.handleHashChange();
      window.addEventListener('hashchange', () => this.handleHashChange());
    }

    setupNavigation() {
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const page = link.getAttribute('data-page');
          if (page) {
            e.preventDefault();
            this.navigate(page);
          }
        });
      });

      // Mobile hamburger toggle
      const mobileBtn = document.getElementById('mobileMenuBtn');
      const navMenu = document.getElementById('navMenu');
      if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
          navMenu.classList.toggle('mobile-open');
        });

        // Close menu when clicked outside or on a link
        document.addEventListener('click', (e) => {
          if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            navMenu.classList.remove('mobile-open');
          }
        });
      }

      // User chip shortcut
      const userChip = document.getElementById('navUserChip');
      if (userChip) {
        userChip.addEventListener('click', () => this.navigate('profile'));
      }
    }

    setupAnnouncement() {
      const closeBtn = document.getElementById('closeAnnouncement');
      const bar = document.getElementById('announcementBar');
      if (closeBtn && bar) {
        closeBtn.addEventListener('click', () => {
          bar.style.display = 'none';
        });
      }
    }

    navigate(pageName) {
      if (!['home', 'catalog', 'registration', 'profile'].includes(pageName)) {
        pageName = 'home';
      }

      this.activePage = pageName;
      window.location.hash = pageName;

      // Update Nav Link styles
      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-page') === pageName) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Close mobile menu if open
      const navMenu = document.getElementById('navMenu');
      if (navMenu) {
        navMenu.classList.remove('mobile-open');
      }

      // Update Page Views
      document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
      });

      const targetView = document.getElementById(`page-${pageName}`);
      if (targetView) {
        targetView.classList.add('active');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Re-render specific dynamic components for the active view
      if (pageName === 'catalog') {
        this.renderCatalog();
      } else if (pageName === 'registration') {
        this.renderRegistrationSelect();
        this.renderRegisteredTable();
      } else if (pageName === 'profile') {
        this.renderWeeklyTimetable();
        this.renderProfileTable();
      } else if (pageName === 'home') {
        this.renderHomeStats();
        this.renderHomeSpotlight();
      }
    }

    handleHashChange() {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && ['home', 'catalog', 'registration', 'profile'].includes(hash)) {
        this.navigate(hash);
      } else {
        this.navigate('home');
      }
    }

    // ==========================================
    // Course Catalog Handlers
    // ==========================================
    setupCatalogEvents() {
      const searchInput = document.getElementById('courseSearchInput');
      const clearSearch = document.getElementById('clearSearchBtn');
      const deptFilter = document.getElementById('deptFilter');
      const levelFilter = document.getElementById('levelFilter');
      const creditsFilter = document.getElementById('creditsFilter');
      const availFilter = document.getElementById('availabilityFilter');
      const sortSelect = document.getElementById('sortBySelect');
      const resetBtn = document.getElementById('resetFiltersBtn');

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.filters.search = e.target.value.trim().toLowerCase();
          if (clearSearch) {
            clearSearch.style.display = this.filters.search ? 'block' : 'none';
          }
          this.renderCatalog();
        });
      }

      if (clearSearch && searchInput) {
        clearSearch.addEventListener('click', () => {
          searchInput.value = '';
          this.filters.search = '';
          clearSearch.style.display = 'none';
          this.renderCatalog();
          searchInput.focus();
        });
      }

      if (deptFilter) {
        deptFilter.addEventListener('change', (e) => {
          this.filters.department = e.target.value;
          this.renderCatalog();
        });
      }

      if (levelFilter) {
        levelFilter.addEventListener('change', (e) => {
          this.filters.level = e.target.value;
          this.renderCatalog();
        });
      }

      if (creditsFilter) {
        creditsFilter.addEventListener('change', (e) => {
          this.filters.credits = e.target.value;
          this.renderCatalog();
        });
      }

      if (availFilter) {
        availFilter.addEventListener('change', (e) => {
          this.filters.availability = e.target.value;
          this.renderCatalog();
        });
      }

      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.filters.sort = e.target.value;
          this.renderCatalog();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetCatalogFilters());
      }
    }

    resetCatalogFilters() {
      this.filters = {
        search: '',
        department: 'ALL',
        level: 'ALL',
        credits: 'ALL',
        availability: 'ALL',
        sort: 'code-asc'
      };

      const searchInput = document.getElementById('courseSearchInput');
      const clearSearch = document.getElementById('clearSearchBtn');
      const deptFilter = document.getElementById('deptFilter');
      const levelFilter = document.getElementById('levelFilter');
      const creditsFilter = document.getElementById('creditsFilter');
      const availFilter = document.getElementById('availabilityFilter');
      const sortSelect = document.getElementById('sortBySelect');

      if (searchInput) searchInput.value = '';
      if (clearSearch) clearSearch.style.display = 'none';
      if (deptFilter) deptFilter.value = 'ALL';
      if (levelFilter) levelFilter.value = 'ALL';
      if (creditsFilter) creditsFilter.value = 'ALL';
      if (availFilter) availFilter.value = 'ALL';
      if (sortSelect) sortSelect.value = 'code-asc';

      this.renderCatalog();
      this.showToast('Course filters reset to default view.', 'info');
    }

    getFilteredCourses() {
      let filtered = [...this.courses];

      // 1. Text Search Filter
      if (this.filters.search) {
        const query = this.filters.search;
        filtered = filtered.filter(c => {
          return (
            c.code.toLowerCase().includes(query) ||
            c.title.toLowerCase().includes(query) ||
            c.instructor.toLowerCase().includes(query) ||
            c.deptName.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.tags.some(t => t.toLowerCase().includes(query))
          );
        });
      }

      // 2. Department Filter
      if (this.filters.department !== 'ALL') {
        filtered = filtered.filter(c => c.department === this.filters.department);
      }

      // 3. Level Filter
      if (this.filters.level !== 'ALL') {
        filtered = filtered.filter(c => c.level === this.filters.level);
      }

      // 4. Credits Filter
      if (this.filters.credits !== 'ALL') {
        filtered = filtered.filter(c => c.credits === parseInt(this.filters.credits, 10));
      }

      // 5. Availability Filter
      if (this.filters.availability === 'OPEN') {
        filtered = filtered.filter(c => (c.capacity - c.enrolled) > 0);
      } else if (this.filters.availability === 'WAITLIST') {
        filtered = filtered.filter(c => (c.capacity - c.enrolled) <= 0);
      }

      // 6. Sorting
      filtered.sort((a, b) => {
        switch (this.filters.sort) {
          case 'code-asc':
            return a.code.localeCompare(b.code);
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

      return filtered;
    }

    renderCatalog() {
      const grid = document.getElementById('courseCardsGrid');
      const emptyState = document.getElementById('catalogEmptyState');
      const countEl = document.getElementById('catalogResultsCount');
      const totalEl = document.getElementById('catalogTotalCount');

      if (!grid) return;

      const filteredCourses = this.getFilteredCourses();

      if (countEl) countEl.textContent = filteredCourses.length;
      if (totalEl) totalEl.textContent = this.courses.length;

      if (filteredCourses.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';

      grid.innerHTML = filteredCourses.map(course => {
        const isRegistered = this.isCourseRegistered(course.id);
        const openSeats = Math.max(0, course.capacity - course.enrolled);
        const seatPercent = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));
        const seatColorClass = openSeats > 5 ? 'progress-emerald' : (openSeats > 0 ? 'progress-amber' : 'progress-blue');

        return `
          <div class="course-card">
            <div class="card-top-accent accent-${course.department}"></div>
            <div class="card-content">
              <div class="card-meta-row">
                <span class="badge-code">${course.code}</span>
                <span class="badge-dept dept-${course.department.toLowerCase()}-color">${course.deptName}</span>
              </div>
              <h3 class="course-card-title">${course.title}</h3>
              <p class="course-card-desc">${course.description}</p>
              
              <div class="course-info-list">
                <div class="info-item">
                  <span class="info-item-icon">👨‍🏫</span>
                  <span><strong>${course.instructor}</strong></span>
                </div>
                <div class="info-item">
                  <span class="info-item-icon">⏰</span>
                  <span>${course.schedule}</span>
                </div>
                <div class="info-item">
                  <span class="info-item-icon">📍</span>
                  <span>${course.location}</span>
                </div>
                <div class="info-item">
                  <span class="info-item-icon">🎓</span>
                  <span><strong>${course.credits} Credits</strong> &bull; ${course.level === 'UPPER' ? 'Upper Div' : 'Lower Div'}</span>
                </div>
              </div>

              <div class="seats-bar-wrapper">
                <div class="seats-labels">
                  <span>Seats Available: <strong>${openSeats}</strong> / ${course.capacity}</span>
                  <span>${openSeats > 0 ? `${seatPercent}% Full` : 'Waitlist Only'}</span>
                </div>
                <div class="seats-track">
                  <div class="seats-fill ${seatColorClass}" style="width: ${seatPercent}%;"></div>
                </div>
              </div>

              <div class="card-actions">
                <button class="btn btn-outline btn-sm" onclick="window.app.openDetailModal('${course.id}')">
                  Details
                </button>
                ${
                  isRegistered
                    ? `<button class="btn btn-danger btn-sm" onclick="window.app.openDropModal('${course.id}')">Drop</button>`
                    : `<button class="btn btn-primary btn-sm" onclick="window.app.startRegistrationFlow('${course.id}')">
                        + Register
                       </button>`
                }
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // ==========================================
    // Registration Form & Flow
    // ==========================================
    setupRegistrationForm() {
      const regForm = document.getElementById('registrationForm');
      const selectCourse = document.getElementById('regCourseSelect');
      const quickAddBtn = document.getElementById('quickAddBtn');
      const quickCodeInput = document.getElementById('quickCodeInput');
      const resetFormBtn = document.getElementById('resetRegFormBtn');

      if (selectCourse) {
        selectCourse.addEventListener('change', (e) => {
          this.handleCourseSelectChange(e.target.value);
        });
      }

      if (regForm) {
        regForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleFormSubmit();
        });
      }

      if (quickAddBtn && quickCodeInput) {
        quickAddBtn.addEventListener('click', () => {
          this.handleQuickAdd();
        });

        quickCodeInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.handleQuickAdd();
          }
        });
      }

      if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
          if (regForm) regForm.reset();
          const preview = document.getElementById('selectedCoursePreview');
          if (preview) preview.style.display = 'none';
        });
      }
    }

    handleCourseSelectChange(courseId) {
      const preview = document.getElementById('selectedCoursePreview');
      if (!preview) return;

      if (!courseId) {
        preview.style.display = 'none';
        return;
      }

      const course = this.courses.find(c => c.id === courseId);
      if (!course) {
        preview.style.display = 'none';
        return;
      }

      document.getElementById('previewCode').textContent = course.code;
      document.getElementById('previewTitle').textContent = course.title;
      document.getElementById('previewCredits').textContent = `${course.credits} Credits`;
      document.getElementById('previewInstructor').textContent = course.instructor;
      document.getElementById('previewSchedule').textContent = course.schedule;
      document.getElementById('previewLocation').textContent = course.location;
      document.getElementById('previewPrereq').textContent = course.prereqs;

      preview.style.display = 'block';
    }

    handleFormSubmit() {
      const selectCourse = document.getElementById('regCourseSelect');
      const gradeOption = document.getElementById('regGradeOption');
      const prereqCheck = document.getElementById('regPrereqCheck');

      if (!selectCourse || !selectCourse.value) {
        this.showToast('Please select a course to register.', 'warning');
        return;
      }

      if (prereqCheck && !prereqCheck.checked) {
        this.showToast('You must acknowledge prerequisites before registering.', 'warning');
        return;
      }

      const courseId = selectCourse.value;
      const selectedGrade = gradeOption ? gradeOption.value : 'Letter (A-F)';

      this.promptRegistrationConfirmation(courseId, selectedGrade);
    }

    handleQuickAdd() {
      const input = document.getElementById('quickCodeInput');
      if (!input || !input.value.trim()) {
        this.showToast('Please enter a valid course code (e.g., CSE 101).', 'warning');
        return;
      }

      const codeRaw = input.value.trim().toUpperCase().replace(/\s+/g, ' ');
      const match = this.courses.find(c => c.code.toUpperCase() === codeRaw || c.code.replace(/\s+/g, '').toUpperCase() === codeRaw.replace(/\s+/g, ''));

      if (!match) {
        this.showToast(`Course "${codeRaw}" not found in Spring 2026 catalog.`, 'danger');
        return;
      }

      if (this.isCourseRegistered(match.id)) {
        this.showToast(`You are already enrolled in ${match.code}!`, 'warning');
        return;
      }

      input.value = '';
      this.promptRegistrationConfirmation(match.id, 'Letter (A-F)');
    }

    startRegistrationFlow(courseId) {
      this.promptRegistrationConfirmation(courseId, 'Letter (A-F)');
    }

    promptRegistrationConfirmation(courseId, gradeMode) {
      const course = this.courses.find(c => c.id === courseId);
      if (!course) return;

      // Duplicate check
      if (this.isCourseRegistered(courseId)) {
        this.showToast(`You are already enrolled in ${course.code}.`, 'warning');
        return;
      }

      // Max credit limit check
      const currentCredits = this.calculateTotalCredits();
      if (currentCredits + course.credits > MAX_CREDITS) {
        this.showToast(`Registration blocked: Cannot exceed ${MAX_CREDITS} credits limit (${currentCredits + course.credits} credits).`, 'danger');
        return;
      }

      this.pendingRegistration = {
        courseId,
        gradeMode: gradeMode || 'Letter (A-F)'
      };

      // Populate Modal Fields
      document.getElementById('modalCourseCode').textContent = course.code;
      document.getElementById('modalCourseDept').textContent = course.deptName;
      document.getElementById('modalCourseTitle').textContent = course.title;
      document.getElementById('modalCourseCredits').textContent = `${course.credits} Units`;
      document.getElementById('modalGradeMode').textContent = this.pendingRegistration.gradeMode;
      document.getElementById('modalCourseInstructor').textContent = course.instructor;
      document.getElementById('modalCourseSchedule').textContent = course.schedule;
      document.getElementById('modalCourseLocation').textContent = course.location;
      document.getElementById('modalImpactCredits').textContent = `${currentCredits + course.credits} / ${MAX_CREDITS} Credits`;

      // Show Modal
      const modal = document.getElementById('regConfirmModal');
      if (modal) modal.classList.add('open');
    }

    confirmRegistration() {
      if (!this.pendingRegistration) return;

      const { courseId, gradeMode } = this.pendingRegistration;
      const course = this.courses.find(c => c.id === courseId);

      if (!course) return;

      // Add to registered list
      this.registered.push({
        courseId: course.id,
        gradeOption: gradeMode,
        term: 'Spring 2026',
        registeredAt: new Date().toISOString(),
        status: 'Enrolled'
      });

      // Increment enrollment count in course
      course.enrolled = Math.min(course.capacity, course.enrolled + 1);

      this.saveState();
      this.closeModal('regConfirmModal');
      this.pendingRegistration = null;

      // Reset form if applicable
      const selectCourse = document.getElementById('regCourseSelect');
      if (selectCourse) selectCourse.value = '';
      const preview = document.getElementById('selectedCoursePreview');
      if (preview) preview.style.display = 'none';

      // Update all UI components
      this.renderAll();

      this.showToast(`Success! You have officially enrolled in ${course.code} (${course.title}).`, 'success');
    }

    // ==========================================
    // Course Dropping Flow
    // ==========================================
    openDropModal(courseId) {
      const course = this.courses.find(c => c.id === courseId);
      if (!course) return;

      this.pendingDropCourseId = courseId;
      const targetText = document.getElementById('dropCourseTargetText');
      if (targetText) {
        targetText.textContent = `${course.code} - ${course.title} (${course.credits} Units)`;
      }

      const modal = document.getElementById('dropConfirmModal');
      if (modal) modal.classList.add('open');
    }

    confirmDropCourse() {
      if (!this.pendingDropCourseId) return;

      const courseId = this.pendingDropCourseId;
      const course = this.courses.find(c => c.id === courseId);

      this.registered = this.registered.filter(r => r.courseId !== courseId);

      if (course) {
        course.enrolled = Math.max(0, course.enrolled - 1);
      }

      this.saveState();
      this.closeModal('dropConfirmModal');
      this.pendingDropCourseId = null;

      this.renderAll();
      this.showToast(`Course dropped: ${course ? course.code : 'Selected course'} was removed from your schedule.`, 'info');
    }

    // ==========================================
    // Course Details Modal
    // ==========================================
    openDetailModal(courseId) {
      const course = this.courses.find(c => c.id === courseId);
      if (!course) return;

      document.getElementById('detailModalCode').textContent = course.code;
      document.getElementById('detailModalTitle').textContent = course.title;
      document.getElementById('detailModalDesc').textContent = course.description;
      document.getElementById('detailModalDept').textContent = `${course.deptName} (${course.department})`;
      document.getElementById('detailModalCredits').textContent = `${course.credits}.0 Units`;
      document.getElementById('detailModalInstructor').textContent = course.instructor;
      document.getElementById('detailModalSchedule').textContent = course.schedule;
      document.getElementById('detailModalLocation').textContent = course.location;
      document.getElementById('detailModalSeats').textContent = `${Math.max(0, course.capacity - course.enrolled)} / ${course.capacity} Open Seats`;
      document.getElementById('detailModalPrereqs').textContent = course.prereqs;

      // Tags
      const tagsContainer = document.getElementById('detailModalTags');
      if (tagsContainer) {
        tagsContainer.innerHTML = course.tags.map(t => `<span class="badge-pill bg-purple">${t}</span>`).join(' ');
      }

      // Dynamic action button inside modal
      const regBtn = document.getElementById('detailModalRegisterBtn');
      if (regBtn) {
        const isEnrolled = this.isCourseRegistered(course.id);
        if (isEnrolled) {
          regBtn.textContent = 'Already Enrolled';
          regBtn.disabled = true;
          regBtn.className = 'btn btn-outline';
        } else {
          regBtn.textContent = 'Register for this Course';
          regBtn.disabled = false;
          regBtn.className = 'btn btn-primary';
          regBtn.onclick = () => {
            this.closeModal('courseDetailModal');
            this.startRegistrationFlow(course.id);
          };
        }
      }

      const modal = document.getElementById('courseDetailModal');
      if (modal) modal.classList.add('open');
    }

    // ==========================================
    // Grade Option Live Change
    // ==========================================
    updateGradeOption(courseId, newGradeOption) {
      const record = this.registered.find(r => r.courseId === courseId);
      if (record) {
        record.gradeOption = newGradeOption;
        this.saveState();
        this.renderAll();
        const course = this.courses.find(c => c.id === courseId);
        this.showToast(`Grading option for ${course ? course.code : 'course'} changed to "${newGradeOption}".`, 'info');
      }
    }

    // ==========================================
    // Modals Wiring
    // ==========================================
    setupModals() {
      // 1. Reg Modal
      const closeReg = document.getElementById('closeRegModalBtn');
      const cancelReg = document.getElementById('cancelRegModalBtn');
      const confirmReg = document.getElementById('confirmRegModalBtn');

      if (closeReg) closeReg.addEventListener('click', () => this.closeModal('regConfirmModal'));
      if (cancelReg) cancelReg.addEventListener('click', () => this.closeModal('regConfirmModal'));
      if (confirmReg) confirmReg.addEventListener('click', () => this.confirmRegistration());

      // 2. Drop Modal
      const closeDrop = document.getElementById('closeDropModalBtn');
      const cancelDrop = document.getElementById('cancelDropModalBtn');
      const confirmDrop = document.getElementById('confirmDropModalBtn');

      if (closeDrop) closeDrop.addEventListener('click', () => this.closeModal('dropConfirmModal'));
      if (cancelDrop) cancelDrop.addEventListener('click', () => this.closeModal('dropConfirmModal'));
      if (confirmDrop) confirmDrop.addEventListener('click', () => this.confirmDropCourse());

      // 3. Detail Modal
      const closeDetail = document.getElementById('closeDetailModalBtn');
      const closeDetail2 = document.getElementById('closeDetailModalBtn2');

      if (closeDetail) closeDetail.addEventListener('click', () => this.closeModal('courseDetailModal'));
      if (closeDetail2) closeDetail2.addEventListener('click', () => this.closeModal('courseDetailModal'));

      // Backdrop click dismissal
      document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('open');
          }
        });
      });

      // Escape key listener
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
            modal.classList.remove('open');
          });
        }
      });
    }

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('open');
    }

    // ==========================================
    // Rendering: Data Tables & Metrics
    // ==========================================
    renderAll() {
      this.updateNavbarMetrics();
      this.renderHomeStats();
      this.renderHomeSpotlight();
      this.renderHomeMiniList();
      this.renderRegistrationSelect();
      this.renderRegistrationTopMetrics();
      this.renderRegisteredTable();
      this.renderCatalog();
      this.renderWeeklyTimetable();
      this.renderProfileTable();
    }

    isCourseRegistered(courseId) {
      return this.registered.some(r => r.courseId === courseId);
    }

    calculateTotalCredits() {
      return this.registered.reduce((acc, reg) => {
        const course = this.courses.find(c => c.id === reg.courseId);
        return acc + (course ? course.credits : 0);
      }, 0);
    }

    updateNavbarMetrics() {
      const badge = document.getElementById('navRegBadge');
      const navCredits = document.getElementById('navCreditsCount');
      const count = this.registered.length;
      const credits = this.calculateTotalCredits();

      if (badge) badge.textContent = count;
      if (navCredits) navCredits.textContent = credits;
    }

    renderHomeStats() {
      const countEl = document.getElementById('homeRegisteredCoursesCount');
      const creditsEl = document.getElementById('homeTotalCredits');
      const percentEl = document.getElementById('homeCreditPercent');
      const barEl = document.getElementById('homeCreditBar');

      const count = this.registered.length;
      const credits = this.calculateTotalCredits();
      const pct = Math.min(100, Math.round((credits / MAX_CREDITS) * 100));

      if (countEl) countEl.textContent = count;
      if (creditsEl) creditsEl.textContent = `${credits} Units`;
      if (percentEl) percentEl.textContent = `${pct}% (${credits}/${MAX_CREDITS})`;
      if (barEl) barEl.style.width = `${pct}%`;
    }

    renderHomeSpotlight() {
      const container = document.getElementById('spotlightCardsContainer');
      if (!container) return;

      const featured = this.courses.filter(c => c.featured).slice(0, 4);

      container.innerHTML = featured.map(course => {
        const isRegistered = this.isCourseRegistered(course.id);
        return `
          <div class="course-card" style="box-shadow: none;">
            <div class="card-top-accent accent-${course.department}"></div>
            <div class="card-content" style="padding: 1rem;">
              <div class="card-meta-row" style="margin-bottom: 0.35rem;">
                <span class="badge-code">${course.code}</span>
                <span class="badge-pill bg-purple">${course.credits} Units</span>
              </div>
              <h4 style="font-size: 0.95rem; margin-bottom: 0.4rem;">${course.title}</h4>
              <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.8rem;">
                ${course.schedule} &bull; ${course.instructor}
              </p>
              <div class="card-actions">
                <button class="btn btn-outline btn-sm" onclick="window.app.openDetailModal('${course.id}')">Info</button>
                ${
                  isRegistered
                    ? `<span class="badge-pill bg-emerald" style="display:flex;align-items:center;">✓ Enrolled</span>`
                    : `<button class="btn btn-primary btn-sm" onclick="window.app.startRegistrationFlow('${course.id}')">+ Register</button>`
                }
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    renderHomeMiniList() {
      const container = document.getElementById('homeMiniEnrolledList');
      if (!container) return;

      if (this.registered.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">
            No enrolled classes yet. <a href="#catalog" onclick="window.app.navigate('catalog')">Browse Catalog</a>
          </div>
        `;
        return;
      }

      container.innerHTML = this.registered.map(reg => {
        const course = this.courses.find(c => c.id === reg.courseId);
        if (!course) return '';
        return `
          <div class="mini-course-row dept-${course.department}">
            <div class="mini-info">
              <strong>${course.code}: ${course.title}</strong>
              <span>${course.schedule} &bull; ${course.credits} Credits</span>
            </div>
            <span class="badge-pill bg-blue">${reg.gradeOption.includes('Letter') ? 'Letter' : 'P/NP'}</span>
          </div>
        `;
      }).join('');
    }

    renderRegistrationSelect() {
      const select = document.getElementById('regCourseSelect');
      if (!select) return;

      // Filter courses that are not yet enrolled
      const availableCourses = this.courses.filter(c => !this.isCourseRegistered(c.id));

      select.innerHTML = `
        <option value="">-- Choose an available course (${availableCourses.length} available) --</option>
        ${availableCourses.map(course => `
          <option value="${course.id}">
            ${course.code} &mdash; ${course.title} (${course.credits} Credits, ${course.department})
          </option>
        `).join('')}
      `;
    }

    renderRegistrationTopMetrics() {
      const totalCoursesEl = document.getElementById('regTotalCourses');
      const totalCreditsEl = document.getElementById('regTotalCredits');
      const statusLabel = document.getElementById('regStatusLabel');
      const tuitionLabel = document.getElementById('regTuitionStatus');

      const count = this.registered.length;
      const credits = this.calculateTotalCredits();

      if (totalCoursesEl) totalCoursesEl.textContent = count;
      if (totalCreditsEl) totalCreditsEl.textContent = credits;

      if (statusLabel) {
        if (credits >= 20) {
          statusLabel.textContent = 'Maximum Load Reached';
        } else if (credits >= 12) {
          statusLabel.textContent = 'Active (Full-Time)';
        } else {
          statusLabel.textContent = 'Active (Part-Time)';
        }
      }

      if (tuitionLabel) {
        tuitionLabel.textContent = credits >= 12 ? 'Full-Time (12+ Units)' : 'Part-Time Rate (<12 Units)';
      }
    }

    renderRegisteredTable() {
      const tbody = document.getElementById('registeredTableBody');
      const emptyMsg = document.getElementById('emptyRegistrationMessage');
      const tableFoot = document.getElementById('registeredTableFoot');
      const totalCredEl = document.getElementById('tableTotalCredits');
      const totalCountEl = document.getElementById('tableTotalCount');

      if (!tbody) return;

      if (this.registered.length === 0) {
        tbody.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = 'block';
        if (tableFoot) tableFoot.style.display = 'none';
        return;
      }

      if (emptyMsg) emptyMsg.style.display = 'none';
      if (tableFoot) tableFoot.style.display = 'table-footer-group';

      let totalCredits = 0;

      tbody.innerHTML = this.registered.map(reg => {
        const course = this.courses.find(c => c.id === reg.courseId);
        if (!course) return '';
        totalCredits += course.credits;

        return `
          <tr>
            <td><span class="badge-code">${course.code}</span></td>
            <td><strong>${course.title}</strong></td>
            <td><span class="badge-pill dept-${course.department.toLowerCase()}-color">${course.deptName}</span></td>
            <td><strong>${course.credits} Units</strong></td>
            <td>
              <div>${course.schedule}</div>
              <small class="text-muted">${course.location}</small>
            </td>
            <td>${course.instructor}</td>
            <td>
              <select class="table-grade-select" onchange="window.app.updateGradeOption('${course.id}', this.value)" title="Change Grading Option">
                <option value="Letter (A-F)" ${reg.gradeOption === 'Letter (A-F)' ? 'selected' : ''}>Letter (A-F)</option>
                <option value="Pass / No Pass" ${reg.gradeOption === 'Pass / No Pass' ? 'selected' : ''}>Pass / No Pass</option>
                <option value="Audit" ${reg.gradeOption === 'Audit' ? 'selected' : ''}>Audit</option>
              </select>
            </td>
            <td><span class="badge-pill bg-emerald">${reg.status || 'Enrolled'}</span></td>
            <td class="text-right">
              <button class="btn btn-sm btn-outline" style="color: var(--danger); border-color: #fca5a5;" onclick="window.app.openDropModal('${course.id}')">
                Drop Course
              </button>
            </td>
          </tr>
        `;
      }).join('');

      if (totalCredEl) totalCredEl.textContent = `${totalCredits} Credits`;
      if (totalCountEl) totalCountEl.textContent = `${this.registered.length} Courses`;
    }

    renderProfileTable() {
      const tbody = document.getElementById('profileRegisteredTableBody');
      if (!tbody) return;

      if (this.registered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: var(--text-muted);">No enrolled courses recorded for Spring 2026.</td></tr>`;
        return;
      }

      tbody.innerHTML = this.registered.map(reg => {
        const course = this.courses.find(c => c.id === reg.courseId);
        if (!course) return '';

        return `
          <tr>
            <td><span class="badge-code">${course.code}</span></td>
            <td><strong>${course.title}</strong></td>
            <td><span class="badge-pill dept-${course.department.toLowerCase()}-color">${course.deptName}</span></td>
            <td>${course.credits} Units</td>
            <td>${course.schedule} &bull; ${course.location}</td>
            <td>${course.instructor}</td>
            <td><span class="badge-pill bg-blue">${reg.gradeOption}</span></td>
            <td><span class="badge-pill bg-emerald">Official Enrollment</span></td>
          </tr>
        `;
      }).join('');
    }

    // ==========================================
    // Visual Weekly Timetable (Monday - Friday)
    // ==========================================
    renderWeeklyTimetable() {
      const grid = document.getElementById('weeklyTimetableGrid');
      if (!grid) return;

      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const timeSlots = [
        { label: '8:00 AM', hour: 8 },
        { label: '9:00 AM', hour: 9 },
        { label: '10:00 AM', hour: 10 },
        { label: '11:00 AM', hour: 11 },
        { label: '12:00 PM', hour: 12 },
        { label: '1:00 PM', hour: 13 },
        { label: '2:00 PM', hour: 14 },
        { label: '3:00 PM', hour: 15 },
        { label: '4:00 PM', hour: 16 },
        { label: '5:00 PM', hour: 17 }
      ];

      // Build header row
      let html = `<div class="tt-header-cell">Time</div>`;
      daysOfWeek.forEach(day => {
        html += `<div class="tt-header-cell">${day}</div>`;
      });

      // Get enrolled course details
      const enrolledCourses = this.registered
        .map(r => this.courses.find(c => c.id === r.courseId))
        .filter(Boolean);

      // Color mapping for department classes in timetable
      const deptBgMap = {
        CSE: 'linear-gradient(135deg, #4f46e5, #6366f1)',
        MATH: 'linear-gradient(135deg, #9333ea, #a855f7)',
        DSC: 'linear-gradient(135deg, #0284c7, #38bdf8)',
        BILD: 'linear-gradient(135deg, #059669, #10b981)',
        ECON: 'linear-gradient(135deg, #d97706, #f59e0b)',
        PSYC: 'linear-gradient(135deg, #e11d48, #f43f5e)',
        VIS: 'linear-gradient(135deg, #c026d3, #d946ef)',
        COGS: 'linear-gradient(135deg, #0d9488, #14b8a6)'
      };

      // Build rows for each hour
      timeSlots.forEach(slot => {
        html += `<div class="tt-time-cell">${slot.label}</div>`;

        daysOfWeek.forEach(day => {
          // Find matching course for this day and hour
          const matchingCourses = enrolledCourses.filter(course => {
            const matchesDay = course.days && course.days.includes(day);
            const matchesHour = Math.floor(course.startHour) === slot.hour;
            return matchesDay && matchesHour;
          });

          if (matchingCourses.length > 0) {
            const courseBlocks = matchingCourses.map(course => {
              const bg = deptBgMap[course.department] || 'linear-gradient(135deg, #4f46e5, #7c3aed)';
              return `
                <div class="tt-event-block" style="background: ${bg};" onclick="window.app.openDetailModal('${course.id}')" title="${course.code}: ${course.title} (${course.location})">
                  <span class="tt-event-code">${course.code}</span>
                  <span class="tt-event-title">${course.title}</span>
                  <span class="tt-event-room">${course.location}</span>
                </div>
              `;
            }).join('');
            html += `<div class="tt-day-cell">${courseBlocks}</div>`;
          } else {
            html += `<div class="tt-day-cell"></div>`;
          }
        });
      });

      grid.innerHTML = html;
    }

    // ==========================================
    // Toast Notification System
    // ==========================================
    showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      const iconMap = {
        success: '✅',
        danger: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };

      toast.innerHTML = `
        <span class="toast-icon">${iconMap[type] || '🔔'}</span>
        <span class="toast-message">${message}</span>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 4200);
    }
  }

  // Instantiate and expose globally
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new RegistrationSystem();
  });
})();
