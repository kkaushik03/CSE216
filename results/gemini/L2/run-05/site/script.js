/**
 * Apex University - Course Registration System
 * Pure JavaScript Application (Accessible, Responsive, Dynamic)
 */

(function () {
  'use strict';

  // ==========================================================================
  // Sample Data: 16 University Courses
  // ==========================================================================
  const COURSES = [
    {
      id: 'cse101',
      code: 'CSE 101',
      title: 'Design & Analysis of Algorithms',
      department: 'Computer Science',
      deptClass: 'dept-cs',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Sanjoy Dasgupta',
      schedule: 'MWF 10:00 AM - 10:50 AM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 10,
      endHour: 11,
      room: 'Warren Hall 101',
      capacity: 180,
      enrolled: 146,
      status: 'Open',
      prerequisites: 'CSE 21 and CSE 100',
      description: 'Design and analysis of efficient algorithms. Greedy algorithms, divide-and-conquer, dynamic programming, graph algorithms, and NP-completeness.',
      textbook: 'Algorithm Design by Kleinberg & Tardos',
      syllabus: [
        'Week 1-2: Asymptotic Analysis & Divide-and-Conquer',
        'Week 3-4: Graph Decompositions & Greedy Algorithms',
        'Week 5-6: Dynamic Programming Patterns',
        'Week 7-8: Network Flow & Reductions',
        'Week 9-10: Intractability and NP-Completeness'
      ]
    },
    {
      id: 'cse216',
      code: 'CSE 216',
      title: 'Advanced Software Engineering',
      department: 'Computer Science',
      deptClass: 'dept-cs',
      level: 'Graduate',
      credits: 4.0,
      instructor: 'Prof. Rahat Vance',
      schedule: 'TuTh 11:00 AM - 12:20 PM',
      days: ['Tue', 'Thu'],
      startHour: 11,
      endHour: 12.33,
      room: 'Atkinson Hall 302',
      capacity: 65,
      enrolled: 52,
      status: 'Open',
      prerequisites: 'CSE 100 or instructor consent',
      description: 'Advanced principles of software architecture, microservices, continuous integration/continuous deployment (CI/CD), software verification, and agile practices.',
      textbook: 'Software Engineering at Google by Winters et al.',
      syllabus: [
        'Week 1-2: Architectural Styles & Domain-Driven Design',
        'Week 3-4: Test Automation, TDD, and Mutation Testing',
        'Week 5-6: Microservice Orchestration and API Gateways',
        'Week 7-8: Reliability Engineering and Observability',
        'Week 9-10: Capstone Project Deployment & Showcase'
      ]
    },
    {
      id: 'cse158',
      code: 'CSE 158',
      title: 'Recommender Systems & Web Mining',
      department: 'Computer Science',
      deptClass: 'dept-cs',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Julian McAuley',
      schedule: 'TuTh 2:00 PM - 3:20 PM',
      days: ['Tue', 'Thu'],
      startHour: 14,
      endHour: 15.33,
      room: 'Center Hall 115',
      capacity: 150,
      enrolled: 150,
      status: 'Waitlist',
      prerequisites: 'CSE 100 and MATH 180A',
      description: 'Quantitative methods for predicting user behavior, collaborative filtering, matrix factorization, graph neural networks for recommendations, and natural language sentiment analysis.',
      textbook: 'Web Data Mining by Bing Liu',
      syllabus: [
        'Week 1-2: Regression Models for User Ratings',
        'Week 3-4: Latent Factor Models and SVD',
        'Week 5-6: Content-Based Recommendations and TF-IDF',
        'Week 7-8: Deep Learning Recommenders',
        'Week 9-10: Fairness and Ethics in Recommender Systems'
      ]
    },
    {
      id: 'math180a',
      code: 'MATH 180A',
      title: 'Introduction to Probability',
      department: 'Mathematics',
      deptClass: 'dept-math',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Todd Kemp',
      schedule: 'MWF 1:00 PM - 1:50 PM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 13,
      endHour: 14,
      room: 'Applied Physics 212',
      capacity: 130,
      enrolled: 108,
      status: 'Open',
      prerequisites: 'MATH 20C or MATH 31BH',
      description: 'Probability spaces, random variables, cumulative distribution functions, conditional probability, combinatorial analysis, Law of Large Numbers, and Central Limit Theorem.',
      textbook: 'Introduction to Probability by Anderson & Seppäläinen',
      syllabus: [
        'Week 1-2: Axioms of Probability & Combinatorics',
        'Week 3-4: Discrete Random Variables & Expectation',
        'Week 5-6: Continuous Distributions & Joint Densities',
        'Week 7-8: Covariance, Correlation, and Conditioning',
        'Week 9-10: Limit Theorems and Markov Chains'
      ]
    },
    {
      id: 'math109',
      code: 'MATH 109',
      title: 'Mathematical Reasoning & Proofs',
      department: 'Mathematics',
      deptClass: 'dept-math',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Laura Stevens',
      schedule: 'TuTh 9:30 AM - 10:50 AM',
      days: ['Tue', 'Thu'],
      startHour: 9.5,
      endHour: 11,
      room: 'Peterson Hall 108',
      capacity: 80,
      enrolled: 68,
      status: 'Open',
      prerequisites: 'MATH 20B',
      description: 'An introduction to mathematical reasoning and proof writing. Topics include logic, set theory, functions, relations, mathematical induction, and cardinalities.',
      textbook: 'Mathematical Proofs: A Transition to Advanced Math by Chartrand',
      syllabus: [
        'Week 1-2: Propositional Logic and Quantifiers',
        'Week 3-4: Proof Techniques: Direct, Contrapositive, Contradiction',
        'Week 5-6: Principle of Mathematical Induction',
        'Week 7-8: Relations, Equivalence, and Partitions',
        'Week 9-10: Cardinality and Infinite Sets'
      ]
    },
    {
      id: 'bio100',
      code: 'BIO 100',
      title: 'Molecular & Cell Biology',
      department: 'Biology',
      deptClass: 'dept-bio',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Sarah Ramirez',
      schedule: 'MWF 9:00 AM - 9:50 AM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 9,
      endHour: 10,
      room: 'Pacific Hall 104',
      capacity: 220,
      enrolled: 184,
      status: 'Open',
      prerequisites: 'CHEM 6A and BILD 1',
      description: 'Biochemical mechanisms of gene expression, protein structure, intracellular transport, signal transduction pathways, cell cycle checkpoints, and cancer biology.',
      textbook: 'Molecular Biology of the Cell by Alberts et al.',
      syllabus: [
        'Week 1-2: Membrane Structure and Organelle Transport',
        'Week 3-4: Signal Transduction and Second Messengers',
        'Week 5-6: The Cytoskeleton and Cellular Motors',
        'Week 7-8: Cell Division Cycle and Apoptosis Mechanisms',
        'Week 9-10: Oncogenes, Tumor Suppressors, and Cancer'
      ]
    },
    {
      id: 'bio140',
      code: 'BIO 140',
      title: 'Genetics and Genomics',
      department: 'Biology',
      deptClass: 'dept-bio',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Ethan Morales',
      schedule: 'TuTh 3:30 PM - 4:50 PM',
      days: ['Tue', 'Thu'],
      startHour: 15.5,
      endHour: 17,
      room: 'Bonner Hall 215',
      capacity: 90,
      enrolled: 82,
      status: 'Open',
      prerequisites: 'BIO 100',
      description: 'Mendelian and non-Mendelian inheritance, chromosome dynamics, CRISPR genome editing, next-generation sequencing bioinformatics, and quantitative genetics.',
      textbook: 'Genetics: From Genes to Genomes by Hartwell',
      syllabus: [
        'Week 1-2: Transmission Genetics & Chromosome Mapping',
        'Week 3-4: DNA Recombination and Repair Pathways',
        'Week 5-6: High-Throughput Sequencing Technologies',
        'Week 7-8: CRISPR-Cas Systems and Synthetic Biology',
        'Week 9-10: Epigenetics and Population Genomics'
      ]
    },
    {
      id: 'econ100a',
      code: 'ECON 100A',
      title: 'Microeconomics Theory',
      department: 'Economics',
      deptClass: 'dept-econ',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Mark Jacobsen',
      schedule: 'MWF 11:00 AM - 11:50 AM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 11,
      endHour: 12,
      room: 'Solis Hall 107',
      capacity: 220,
      enrolled: 170,
      status: 'Open',
      prerequisites: 'ECON 1 and MATH 20C',
      description: 'Consumer choice theory, budget constraints, utility maximization, elasticity, theory of the firm, cost minimization, profit maximization, and competitive equilibrium.',
      textbook: 'Microeconomic Theory by Mas-Colell & Whinston',
      syllabus: [
        'Week 1-2: Preferences and Utility Functions',
        'Week 3-4: Utility Maximization and Demand Functions',
        'Week 5-6: Production Technology and Cost Functions',
        'Week 7-8: Profit Maximization and Competitive Supply',
        'Week 9-10: General Equilibrium and Welfare Theorems'
      ]
    },
    {
      id: 'econ120a',
      code: 'ECON 120A',
      title: 'Econometrics & Data Analysis',
      department: 'Economics',
      deptClass: 'dept-econ',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Valerie Ramey',
      schedule: 'TuTh 12:30 PM - 1:50 PM',
      days: ['Tue', 'Thu'],
      startHour: 12.5,
      endHour: 14,
      room: 'Sequoyah Hall 148',
      capacity: 110,
      enrolled: 95,
      status: 'Open',
      prerequisites: 'ECON 1 and MATH 10A',
      description: 'Statistical methods applied to empirical economic data. Probability foundations, hypothesis testing, Ordinary Least Squares (OLS) regression, and instrumental variables.',
      textbook: 'Introductory Econometrics by Jeffrey Wooldridge',
      syllabus: [
        'Week 1-2: Statistical Foundations and Hypothesis Testing',
        'Week 3-4: Simple Linear Regression and Gauss-Markov',
        'Week 5-6: Multiple Regression Analysis and OLS',
        'Week 7-8: Heteroskedasticity and Multicollinearity',
        'Week 9-10: Instrumental Variables and Natural Experiments'
      ]
    },
    {
      id: 'psyc101',
      code: 'PSYC 101',
      title: 'Introduction to Cognitive Psychology',
      department: 'Psychology',
      deptClass: 'dept-psyc',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Karen Dobkins',
      schedule: 'MWF 2:00 PM - 2:50 PM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 14,
      endHour: 15,
      room: 'McGill Hall 110',
      capacity: 140,
      enrolled: 110,
      status: 'Open',
      prerequisites: 'PSYC 1',
      description: 'Theoretical and empirical approaches to mental processes: sensory perception, visual attention, working memory, problem solving, decision making, and cognitive neuroscience.',
      textbook: 'Cognition: Exploring the Science of the Mind by Reisberg',
      syllabus: [
        'Week 1-2: Visual Perception and Object Recognition',
        'Week 3-4: Selective Attention and Attentional Bottlenecks',
        'Week 5-6: Working Memory Architecture and Long-Term Storage',
        'Week 7-8: Language Processing and Mental Lexicons',
        'Week 9-10: Decision Biases and Executive Control'
      ]
    },
    {
      id: 'psyc134',
      code: 'PSYC 134',
      title: 'Brain and Behavioral Disorders',
      department: 'Psychology',
      deptClass: 'dept-psyc',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Robert Clark',
      schedule: 'TuTh 8:00 AM - 9:20 AM',
      days: ['Tue', 'Thu'],
      startHour: 8,
      endHour: 9.33,
      room: 'Cognitive Science 180',
      capacity: 75,
      enrolled: 75,
      status: 'Waitlist',
      prerequisites: 'PSYC 101 or PSYC 106',
      description: 'Neurobiological underpinnings of neurological and psychiatric conditions, including Alzheimer\'s disease, Parkinson\'s, schizophrenia, depression, and traumatic brain injury.',
      textbook: 'Neuropsychology: Clinical and Experimental Foundations',
      syllabus: [
        'Week 1-2: Clinical Neuroanatomy and Lesion Methods',
        'Week 3-4: Neurodegenerative Disorders: Dementia and Parkinson\'s',
        'Week 5-6: Mood Disorders, Serotonergic and Dopaminergic Pathways',
        'Week 7-8: Traumatic Brain Injury and Neuroplastic Recovery',
        'Week 9-10: Emerging Neuromodulation Treatments'
      ]
    },
    {
      id: 'phys2a',
      code: 'PHYS 2A',
      title: 'Mechanics & Physics for Scientists',
      department: 'Physics',
      deptClass: 'dept-phys',
      level: 'Lower Division',
      credits: 4.0,
      instructor: 'Dr. Oleg Shpyrko',
      schedule: 'MWF 8:00 AM - 8:50 AM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 8,
      endHour: 9,
      room: 'York Hall 2622',
      capacity: 300,
      enrolled: 240,
      status: 'Open',
      prerequisites: 'MATH 20A',
      description: 'Calculus-based introduction to classical mechanics. Vectors, Newton\'s laws of motion, work, energy, linear momentum, rotational kinematics, gravity, and harmonic oscillators.',
      textbook: 'Physics for Scientists and Engineers by Giancoli',
      syllabus: [
        'Week 1-2: Vectors and One/Two-Dimensional Kinematics',
        'Week 3-4: Newton\'s Laws and Friction Dynamics',
        'Week 5-6: Work, Kinetic Energy, and Conservation Laws',
        'Week 7-8: Rotational Dynamics and Angular Momentum',
        'Week 9-10: Gravitation and Simple Harmonic Motion'
      ]
    },
    {
      id: 'phys130a',
      code: 'PHYS 130A',
      title: 'Quantum Mechanics I',
      department: 'Physics',
      deptClass: 'dept-phys',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Frank Wuerthwein',
      schedule: 'MWF 12:00 PM - 12:50 PM',
      days: ['Mon', 'Wed', 'Fri'],
      startHour: 12,
      endHour: 13,
      room: 'Mayer Hall 4301',
      capacity: 45,
      enrolled: 31,
      status: 'Open',
      prerequisites: 'PHYS 2D and MATH 20E',
      description: 'Historical origins of quantum theory, wave-particle duality, wave packets, Schrödinger equation in one dimension, harmonic oscillator, and Dirac notation.',
      textbook: 'Introduction to Quantum Mechanics by David J. Griffiths',
      syllabus: [
        'Week 1-2: The Wave Function & Probability Interpretation',
        'Week 3-4: Time-Independent Schrödinger Equation',
        'Week 5-6: Infinite Square Well and Quantum Harmonic Oscillator',
        'Week 7-8: Formalism, Hilbert Spaces, and Dirac Bra-Ket Notation',
        'Week 9-10: Quantum Tunneling and Delta-Function Potentials'
      ]
    },
    {
      id: 'lit112w',
      code: 'LIT 112W',
      title: 'Science Fiction and Futuristic Worlds',
      department: 'Literature',
      deptClass: 'dept-lit',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. Angela Davis',
      schedule: 'TuTh 11:00 AM - 12:20 PM',
      days: ['Tue', 'Thu'],
      startHour: 11,
      endHour: 12.33,
      room: 'Literature Bldg 155',
      capacity: 35,
      enrolled: 23,
      status: 'Open',
      prerequisites: 'None',
      description: 'Literary examination of speculative fiction from Mary Shelley to contemporary Afrofuturism and cyberpunk. Topics include artificial intelligence, dystopia, ecology, and human post-humanity.',
      textbook: 'Speculative Visions: An Anthology of Modern Sci-Fi',
      syllabus: [
        'Week 1-2: The Birth of Sci-Fi: Frankenstein & The Time Machine',
        'Week 3-4: Golden Age & Dystopian Visions (1984, Brave New World)',
        'Week 5-6: Cyberpunk and Digital Consciousness (Neuromancer)',
        'Week 7-8: Afrofuturism and Ecological Speculation (Octavia Butler)',
        'Week 9-10: Post-Humanity and Artificial Sentience'
      ]
    },
    {
      id: 'art160',
      code: 'ART 160',
      title: 'Digital Art & Interaction Design',
      department: 'Art & Design',
      deptClass: 'dept-art',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Prof. Maya Lin',
      schedule: 'MW 3:00 PM - 4:50 PM',
      days: ['Mon', 'Wed'],
      startHour: 15,
      endHour: 17,
      room: 'Visual Arts Facility 201',
      capacity: 25,
      enrolled: 19,
      status: 'Open',
      prerequisites: 'None',
      description: 'Creative studio exploration of interactive digital art, creative coding, responsive generative visuals, physical computing interfaces, and exhibition installation techniques.',
      textbook: 'Design as Art by Bruno Munari',
      syllabus: [
        'Week 1-2: Foundations of Interaction Aesthetics and Creative Code',
        'Week 3-4: Generative Visual Systems and Algorithmic Geometry',
        'Week 5-6: Sensor Interactivity and Physical Computing',
        'Week 7-8: Responsive Multi-Modal Environments',
        'Week 9-10: Capstone Interactive Installation Gallery'
      ]
    },
    {
      id: 'phil165',
      code: 'PHIL 165',
      title: 'Bioethics & Technological Futures',
      department: 'Philosophy',
      deptClass: 'dept-phil',
      level: 'Upper Division',
      credits: 4.0,
      instructor: 'Dr. David Brink',
      schedule: 'TuTh 9:30 AM - 10:50 AM',
      days: ['Tue', 'Thu'],
      startHour: 9.5,
      endHour: 11,
      room: 'HSS Bldg 2250',
      capacity: 60,
      enrolled: 41,
      status: 'Open',
      prerequisites: 'None',
      description: 'Moral philosophy applied to cutting-edge biomedical and technological breakthroughs. Human enhancement, synthetic biology, AI alignment, autonomous weapons, and existential risk.',
      textbook: 'Ethical Issues in Modern Technology by Beauchamp',
      syllabus: [
        'Week 1-2: Normative Ethical Frameworks: Deontology vs Consequentialism',
        'Week 3-4: Human Genetic Engineering and CRISPR Morality',
        'Week 5-6: Autonomous Systems, Algorithmic Bias, and AI Governance',
        'Week 7-8: Privacy, Surveillance Capitalism, and Digital Sovereignty',
        'Week 9-10: Longtermism and Existential Risk Philosophy'
      ]
    }
  ];

  // ==========================================================================
  // Application State
  // ==========================================================================
  const STORAGE_KEY = 'apex_registration_state_v1';

  const defaultState = {
    // Alex Chen is enrolled in 3 default courses (MWF 10-10:50, MWF 1-1:50, MW 3-4:50) totaling 12 units
    registeredCourseIds: ['cse101', 'math180a', 'art160'],
    gradingOptions: {
      'cse101': 'Letter',
      'math180a': 'Letter',
      'art160': 'Pass/No Pass'
    },
    student: {
      name: 'Alex Chen',
      id: 'A17894230',
      email: 'alchen@apex.edu',
      phone: '(858) 534-2230',
      major: 'B.S. Computer Science',
      standing: 'Senior Standing',
      gpa: 3.84,
      college: 'Sixth College',
      advisor: 'Dr. Eleanor Vance (CSE Dept)'
    },
    theme: 'light'
  };

  // Load state from localStorage if available
  let appState = (function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          registeredCourseIds: parsed.registeredCourseIds || defaultState.registeredCourseIds,
          gradingOptions: parsed.gradingOptions || defaultState.gradingOptions,
          student: { ...defaultState.student, ...(parsed.student || {}) },
          theme: parsed.theme || 'light'
        };
      }
    } catch (e) {
      console.warn('LocalStorage not available, falling back to in-memory state.', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  })();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.warn('Could not persist state:', e);
    }
  }

  // Active filter parameters for catalog
  const catalogFilters = {
    search: '',
    department: 'all',
    level: 'all',
    status: 'all',
    days: 'all',
    sort: 'code-asc'
  };

  // Modal Action Callback Storage
  let pendingModalConfirmAction = null;
  let lastActiveElementBeforeModal = null;

  // ==========================================================================
  // DOM Element Selectors
  // ==========================================================================
  const elements = {
    // Announcer
    announcer: document.getElementById('aria-announcer'),

    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    navCreditPill: document.getElementById('nav-credit-pill'),
    navTotalCreditsText: document.getElementById('nav-total-credits-text'),
    navRegCount: document.getElementById('nav-reg-count'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    themeIconSun: document.getElementById('theme-icon-sun'),
    themeIconMoon: document.getElementById('theme-icon-moon'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    primaryNav: document.getElementById('primary-navigation'),

    // Views
    pageViews: {
      home: document.getElementById('page-home'),
      catalog: document.getElementById('page-catalog'),
      registration: document.getElementById('page-registration'),
      profile: document.getElementById('page-profile')
    },

    // Home Page
    heroStudentName: document.getElementById('hero-student-name'),
    homeStatCredits: document.getElementById('home-stat-credits'),
    homeStatCourses: document.getElementById('home-stat-courses'),

    // Catalog Page
    catalogSearch: document.getElementById('catalog-search'),
    searchClearBtn: document.getElementById('search-clear'),
    filterDepartment: document.getElementById('filter-department'),
    filterLevel: document.getElementById('filter-level'),
    filterStatus: document.getElementById('filter-status'),
    filterDays: document.getElementById('filter-days'),
    filterSort: document.getElementById('filter-sort'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),
    catalogResultsCount: document.getElementById('catalog-results-count'),
    coursesGridContainer: document.getElementById('courses-grid-container'),

    // Registration Page
    regCourseSelect: document.getElementById('reg-course-select'),
    regGradeOption: document.getElementById('reg-grade-option'),
    regAgreement: document.getElementById('reg-agreement'),
    registrationForm: document.getElementById('registration-form'),
    btnResetRegForm: document.getElementById('btn-reset-reg-form'),
    coursePreviewBox: document.getElementById('course-preview'),
    previewDetails: document.getElementById('preview-details'),
    conflictWarning: document.getElementById('conflict-warning'),
    conflictWarningText: document.getElementById('conflict-warning-text'),
    registeredTableBody: document.getElementById('registered-table-body'),
    tableTotalCredits: document.getElementById('table-total-credits'),
    tableStandingStatus: document.getElementById('table-standing-status'),
    btnPrintSchedule: document.getElementById('btn-print-schedule'),

    // Profile Page
    studentNameTitle: document.getElementById('student-name-title'),
    profileAvatarLetters: document.getElementById('profile-avatar-letters'),
    profileId: document.getElementById('profile-id'),
    profileEmail: document.getElementById('profile-email'),
    profilePhone: document.getElementById('profile-phone'),
    btnEditProfile: document.getElementById('btn-edit-profile'),
    weeklyScheduleGrid: document.getElementById('weekly-schedule-grid'),
    scheduleCountLabel: document.getElementById('schedule-count-label'),
    degreeProgressPercent: document.getElementById('degree-progress-percent'),
    degreeProgressFill: document.getElementById('degree-progress-fill'),

    // Modals
    confirmationModal: document.getElementById('confirmation-modal'),
    confirmModalTitle: document.getElementById('confirm-modal-title'),
    confirmModalDesc: document.getElementById('confirm-modal-desc'),
    btnCloseConfirmModal: document.getElementById('btn-close-confirm-modal'),
    btnCancelConfirm: document.getElementById('btn-cancel-confirm'),
    btnExecuteConfirm: document.getElementById('btn-execute-confirm'),

    detailsModal: document.getElementById('details-modal'),
    detailsModalTitle: document.getElementById('details-modal-title'),
    detailsModalContent: document.getElementById('details-modal-content'),
    btnCloseDetailsModal: document.getElementById('btn-close-details-modal'),
    btnCloseDetails: document.getElementById('btn-close-details'),
    btnModalActionRegister: document.getElementById('btn-modal-action-register'),

    profileModal: document.getElementById('profile-modal'),
    editProfileForm: document.getElementById('edit-profile-form'),
    editStudentName: document.getElementById('edit-student-name'),
    editStudentEmail: document.getElementById('edit-student-email'),
    editStudentPhone: document.getElementById('edit-student-phone'),
    btnCloseProfileModal: document.getElementById('btn-close-profile-modal'),
    btnCancelEditProfile: document.getElementById('btn-cancel-edit-profile'),

    // Toast Container
    toastContainer: document.getElementById('toast-container')
  };

  // ==========================================================================
  // Accessibility & Announcer Helpers
  // ==========================================================================
  function announce(message) {
    if (elements.announcer) {
      elements.announcer.textContent = '';
      setTimeout(() => {
        elements.announcer.textContent = message;
      }, 50);
    }
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'status');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    }

    toast.innerHTML = `
      <span aria-hidden="true" style="color: ${type === 'success' ? 'var(--status-open)' : type === 'error' ? 'var(--status-full)' : 'var(--color-primary)'}">${iconSvg}</span>
      <span>${escapeHtml(message)}</span>
    `;

    elements.toastContainer.appendChild(toast);
    announce(message);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, 4000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // Calculations & State Getters
  // ==========================================================================
  function getRegisteredCourses() {
    return appState.registeredCourseIds
      .map(id => COURSES.find(c => c.id === id))
      .filter(Boolean);
  }

  function getTotalRegisteredCredits() {
    const courses = getRegisteredCourses();
    return courses.reduce((acc, c) => acc + (c.credits || 0), 0);
  }

  function isCourseRegistered(courseId) {
    return appState.registeredCourseIds.includes(courseId);
  }

  // Check if a course has a time overlap with any enrolled course
  function checkScheduleConflict(targetCourse) {
    const enrolled = getRegisteredCourses();
    for (const cur of enrolled) {
      if (cur.id === targetCourse.id) continue;
      // Check day intersection
      const sharedDays = cur.days.filter(d => targetCourse.days.includes(d));
      if (sharedDays.length > 0) {
        // Check hour overlap: (StartA < EndB) and (EndA > StartB)
        if (targetCourse.startHour < cur.endHour && targetCourse.endHour > cur.startHour) {
          return {
            hasConflict: true,
            conflictingCourse: cur,
            sharedDays: sharedDays.join(', ')
          };
        }
      }
    }
    return { hasConflict: false };
  }

  // ==========================================================================
  // Navigation & Page Switching
  // ==========================================================================
  function switchPage(pageId) {
    if (!elements.pageViews[pageId]) {
      pageId = 'home';
    }

    // Update active class on views
    Object.keys(elements.pageViews).forEach(id => {
      const view = elements.pageViews[id];
      if (id === pageId) {
        view.classList.add('active');
        view.removeAttribute('hidden');
      } else {
        view.classList.remove('active');
        view.setAttribute('hidden', 'true');
      }
    });

    // Update Nav links aria-current
    elements.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${pageId}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Close mobile nav menu if open
    elements.primaryNav.classList.remove('open');
    elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');

    // Page-specific render trigger
    if (pageId === 'catalog') {
      renderCatalog();
    } else if (pageId === 'registration') {
      renderRegistrationPage();
    } else if (pageId === 'profile') {
      renderProfilePage();
    } else {
      renderHomeStats();
    }

    // Scroll to top and set focus to main landmark for accessibility
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.focus();
    }

    // Announce page change to screen reader
    const titleMap = {
      home: 'Home page loaded',
      catalog: 'Course catalog loaded with searchable courses',
      registration: 'Registration and enrolled courses data table loaded',
      profile: 'Student profile and weekly timetable loaded'
    };
    announce(titleMap[pageId] || `${pageId} page loaded`);
  }

  function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'home';
    switchPage(hash);
  }

  // ==========================================================================
  // Theme Toggle (Dark / Light)
  // ==========================================================================
  function applyTheme(theme) {
    appState.theme = theme;
    saveState();
    document.documentElement.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      elements.themeIconSun.style.display = 'block';
      elements.themeIconMoon.style.display = 'none';
      elements.themeToggleBtn.setAttribute('title', 'Switch to light theme');
    } else {
      elements.themeIconSun.style.display = 'none';
      elements.themeIconMoon.style.display = 'block';
      elements.themeToggleBtn.setAttribute('title', 'Switch to dark theme');
    }
  }

  function toggleTheme() {
    const nextTheme = appState.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    announce(`Switched to ${nextTheme} theme`);
  }

  // ==========================================================================
  // Render: Global Badges & Home Dashboard
  // ==========================================================================
  function updateGlobalBadges() {
    const totalCredits = getTotalRegisteredCredits();
    const enrolledCount = appState.registeredCourseIds.length;

    // Navbar Badge
    elements.navTotalCreditsText.textContent = `${totalCredits.toFixed(1)} Units`;
    elements.navCreditPill.setAttribute('aria-label', `Academic load: ${totalCredits.toFixed(1)} units registered`);
    elements.navRegCount.textContent = enrolledCount;
    elements.navRegCount.setAttribute('aria-label', `${enrolledCount} courses registered`);

    // Home Page Stats
    elements.homeStatCredits.textContent = `${totalCredits.toFixed(1)} / 19`;
    elements.homeStatCourses.textContent = `${enrolledCount} Course${enrolledCount === 1 ? '' : 's'}`;
    elements.heroStudentName.textContent = appState.student.name;

    // Profile Progress
    const totalCompletedUnits = 120 + totalCredits;
    const progressPct = Math.min(100, Math.round((totalCompletedUnits / 180) * 100));
    elements.degreeProgressPercent.textContent = `${totalCompletedUnits} / 180 Units Completed (${progressPct}%)`;
    elements.degreeProgressFill.style.width = `${progressPct}%`;
    const track = document.querySelector('.progress-track');
    if (track) {
      track.setAttribute('aria-valuenow', progressPct);
    }
  }

  function renderHomeStats() {
    updateGlobalBadges();
  }

  // ==========================================================================
  // Render: Course Catalog Page
  // ==========================================================================
  function filterAndSortCourses() {
    const query = catalogFilters.search.trim().toLowerCase();

    return COURSES.filter(course => {
      // Search matching
      if (query) {
        const matchCode = course.code.toLowerCase().includes(query);
        const matchTitle = course.title.toLowerCase().includes(query);
        const matchInst = course.instructor.toLowerCase().includes(query);
        const matchDesc = course.description.toLowerCase().includes(query);
        const matchDept = course.department.toLowerCase().includes(query);
        if (!matchCode && !matchTitle && !matchInst && !matchDesc && !matchDept) {
          return false;
        }
      }

      // Department filter
      if (catalogFilters.department !== 'all' && course.department !== catalogFilters.department) {
        return false;
      }

      // Level filter
      if (catalogFilters.level !== 'all' && course.level !== catalogFilters.level) {
        return false;
      }

      // Status filter
      if (catalogFilters.status !== 'all') {
        if (catalogFilters.status === 'Open' && course.status !== 'Open') return false;
        if (catalogFilters.status === 'Waitlist' && course.status !== 'Waitlist') return false;
      }

      // Schedule Days filter
      if (catalogFilters.days !== 'all') {
        const daysCode = course.days.length === 3 ? 'MWF' : (course.days.length === 2 && course.days[0] === 'Tue' ? 'TuTh' : 'MW');
        if (daysCode !== catalogFilters.days) return false;
      }

      return true;
    }).sort((a, b) => {
      if (catalogFilters.sort === 'code-asc') return a.code.localeCompare(b.code);
      if (catalogFilters.sort === 'code-desc') return b.code.localeCompare(a.code);
      if (catalogFilters.sort === 'title-asc') return a.title.localeCompare(b.title);
      if (catalogFilters.sort === 'seats-desc') {
        const openA = a.capacity - a.enrolled;
        const openB = b.capacity - b.enrolled;
        return openB - openA;
      }
      return 0;
    });
  }

  function renderCatalog() {
    const filtered = filterAndSortCourses();
    const container = elements.coursesGridContainer;

    elements.catalogResultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> of ${COURSES.length} courses`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" role="status">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <h3 class="empty-state-title">No matching courses found</h3>
          <p class="empty-state-text">
            We couldn't find any courses matching your search query and selected filter options. Try resetting your filters.
          </p>
          <button id="btn-empty-reset" class="btn btn-primary" type="button">Reset All Filters</button>
        </div>
      `;
      const btnReset = document.getElementById('btn-empty-reset');
      if (btnReset) {
        btnReset.addEventListener('click', resetFilters);
      }
      return;
    }

    container.innerHTML = filtered.map(course => {
      const enrolled = isCourseRegistered(course.id);
      const availableSeats = Math.max(0, course.capacity - course.enrolled);
      const isWaitlist = course.status === 'Waitlist';

      let statusBadge = '';
      if (enrolled) {
        statusBadge = `<span class="status-pill status-registered" aria-label="Course is currently enrolled">✓ Enrolled</span>`;
      } else if (isWaitlist) {
        statusBadge = `<span class="status-pill status-waitlist" aria-label="Waitlist available">Waitlist (${course.enrolled}/${course.capacity})</span>`;
      } else {
        statusBadge = `<span class="status-pill status-open" aria-label="${availableSeats} open seats">${availableSeats} Seats Open</span>`;
      }

      return `
        <article class="course-card ${enrolled ? 'is-registered' : ''}" data-course-id="${course.id}" aria-labelledby="card-title-${course.id}">
          <div>
            <div class="card-top-badges">
              <span class="dept-badge ${course.deptClass}">${escapeHtml(course.department)}</span>
              ${statusBadge}
            </div>
            <div class="course-code-row">
              <span class="course-code">${escapeHtml(course.code)}</span>
              <span class="course-units">${course.credits.toFixed(1)} Units</span>
            </div>
            <h3 id="card-title-${course.id}" class="course-title">${escapeHtml(course.title)}</h3>
            <div class="course-meta">
              <div class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>${escapeHtml(course.instructor)}</span>
              </div>
              <div class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>${escapeHtml(course.schedule)}</span>
              </div>
              <div class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>${escapeHtml(course.room)}</span>
              </div>
            </div>
            <p class="course-description">${escapeHtml(course.description)}</p>
          </div>
          <div class="course-card-actions">
            <button
              type="button"
              class="btn btn-secondary btn-sm btn-view-details"
              data-course-id="${course.id}"
              aria-label="View details and syllabus for ${escapeHtml(course.code)}"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>Details</span>
            </button>
            ${enrolled ? `
              <button
                type="button"
                class="btn btn-danger btn-sm btn-quick-drop"
                data-course-id="${course.id}"
                aria-label="Drop course ${escapeHtml(course.code)}"
              >
                <span>Drop Course</span>
              </button>
            ` : `
              <button
                type="button"
                class="btn btn-primary btn-sm btn-quick-register"
                data-course-id="${course.id}"
                aria-label="Register for ${escapeHtml(course.code)}"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 5v14"/>
                  <path d="M5 12h14"/>
                </svg>
                <span>Register</span>
              </button>
            `}
          </div>
        </article>
      `;
    }).join('');

    // Attach event listeners to buttons
    container.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        openCourseDetailsModal(id);
      });
    });

    container.querySelectorAll('.btn-quick-register').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        promptRegisterCourse(id);
      });
    });

    container.querySelectorAll('.btn-quick-drop').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        promptDropCourse(id);
      });
    });
  }

  function resetFilters() {
    catalogFilters.search = '';
    catalogFilters.department = 'all';
    catalogFilters.level = 'all';
    catalogFilters.status = 'all';
    catalogFilters.days = 'all';
    catalogFilters.sort = 'code-asc';

    elements.catalogSearch.value = '';
    elements.searchClearBtn.classList.remove('visible');
    elements.filterDepartment.value = 'all';
    elements.filterLevel.value = 'all';
    elements.filterStatus.value = 'all';
    elements.filterDays.value = 'all';
    elements.filterSort.value = 'code-asc';

    renderCatalog();
    announce('Catalog filters reset to show all 16 courses.');
  }

  // ==========================================================================
  // Render: Registration Page & Data Table
  // ==========================================================================
  function renderRegistrationPage() {
    updateGlobalBadges();
    renderRegistrationFormOptions();
    renderRegisteredCoursesTable();
  }

  function renderRegistrationFormOptions() {
    const select = elements.regCourseSelect;
    const currentVal = select.value;
    select.innerHTML = '<option value="">-- Choose an available course --</option>';

    COURSES.forEach(course => {
      const isEnrolled = isCourseRegistered(course.id);
      const option = document.createElement('option');
      option.value = course.id;
      const statusNote = isEnrolled ? ' [ALREADY ENROLLED]' : (course.status === 'Waitlist' ? ' [Waitlist]' : '');
      option.textContent = `${course.code}: ${course.title} (${course.credits.toFixed(1)} Units) - ${course.schedule}${statusNote}`;
      if (isEnrolled) {
        option.disabled = true;
      }
      select.appendChild(option);
    });

    if (currentVal && !isCourseRegistered(currentVal)) {
      select.value = currentVal;
    } else {
      select.value = '';
      hideCoursePreview();
    }
  }

  function handleCourseSelectChange() {
    const courseId = elements.regCourseSelect.value;
    if (!courseId) {
      hideCoursePreview();
      return;
    }

    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    // Check for conflict
    const conflict = checkScheduleConflict(course);
    if (conflict.hasConflict) {
      elements.conflictWarningText.innerHTML = `
        <strong>Schedule Conflict:</strong> ${escapeHtml(course.code)} overlaps with <strong>${escapeHtml(conflict.conflictingCourse.code)}</strong> (${escapeHtml(conflict.conflictingCourse.schedule)}) on ${escapeHtml(conflict.sharedDays)}.
      `;
      elements.conflictWarning.classList.add('visible');
    } else {
      elements.conflictWarning.classList.remove('visible');
    }

    // Show Preview Box
    elements.previewDetails.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
        <strong style="font-size: 1.05rem; color: var(--text-main);">${escapeHtml(course.code)}: ${escapeHtml(course.title)}</strong>
        <span class="dept-badge ${course.deptClass}">${escapeHtml(course.department)}</span>
      </div>
      <div><strong>Schedule &amp; Room:</strong> ${escapeHtml(course.schedule)} • ${escapeHtml(course.room)}</div>
      <div><strong>Instructor:</strong> ${escapeHtml(course.instructor)}</div>
      <div><strong>Prerequisites:</strong> ${escapeHtml(course.prerequisites)}</div>
    `;
    elements.coursePreviewBox.classList.add('visible');
  }

  function hideCoursePreview() {
    elements.coursePreviewBox.classList.remove('visible');
    elements.conflictWarning.classList.remove('visible');
  }

  function renderRegisteredCoursesTable() {
    const enrolled = getRegisteredCourses();
    const tbody = elements.registeredTableBody;
    const totalCredits = getTotalRegisteredCredits();

    elements.tableTotalCredits.innerHTML = `<strong>${totalCredits.toFixed(1)} Units</strong>`;

    if (totalCredits >= 12) {
      elements.tableStandingStatus.className = 'status-pill status-open';
      elements.tableStandingStatus.textContent = 'Full-Time Student Status (12 - 19 Units)';
    } else {
      elements.tableStandingStatus.className = 'status-pill status-waitlist';
      elements.tableStandingStatus.textContent = 'Part-Time Student Status (Under 12 Units)';
    }

    if (enrolled.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2.5rem 1rem;">
            <div style="color: var(--text-muted); font-size: 1rem; margin-bottom: 0.75rem;">
              You have no active course registrations for Fall Quarter 2026.
            </div>
            <a href="#catalog" class="btn btn-primary btn-sm">
              <span>Browse Course Catalog</span>
            </a>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = enrolled.map(course => {
      const gradeOption = appState.gradingOptions[course.id] || 'Letter';
      return `
        <tr data-course-id="${course.id}">
          <td>
            <span class="table-course-code">${escapeHtml(course.code)}</span>
            <span class="table-course-dept">${escapeHtml(course.department)}</span>
          </td>
          <td>
            <strong>${escapeHtml(course.title)}</strong>
          </td>
          <td>${course.credits.toFixed(1)}</td>
          <td>
            <div>${escapeHtml(course.schedule)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(course.room)}</div>
          </td>
          <td>${escapeHtml(course.instructor)}</td>
          <td>
            <label for="grade-select-${course.id}" class="sr-only">Grading option for ${escapeHtml(course.code)}</label>
            <select
              id="grade-select-${course.id}"
              class="grading-select"
              data-course-id="${course.id}"
              aria-label="Grading option for ${escapeHtml(course.code)}"
            >
              <option value="Letter" ${gradeOption === 'Letter' ? 'selected' : ''}>Letter (A-F)</option>
              <option value="Pass/No Pass" ${gradeOption === 'Pass/No Pass' ? 'selected' : ''}>Pass / No Pass</option>
              <option value="Audit" ${gradeOption === 'Audit' ? 'selected' : ''}>Audit</option>
            </select>
          </td>
          <td>
            <span class="status-pill status-open">Enrolled</span>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.35rem;">
              <button
                type="button"
                class="btn btn-secondary btn-sm btn-table-details"
                data-course-id="${course.id}"
                aria-label="View syllabus for ${escapeHtml(course.code)}"
                title="View details"
              >
                Details
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm btn-table-drop"
                data-course-id="${course.id}"
                aria-label="Drop course ${escapeHtml(course.code)}"
                title="Drop course"
              >
                Drop
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach event listeners in table
    tbody.querySelectorAll('.grading-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        const val = e.currentTarget.value;
        appState.gradingOptions[id] = val;
        saveState();
        showToast(`Grading option for ${id.toUpperCase()} updated to ${val}`, 'info');
      });
    });

    tbody.querySelectorAll('.btn-table-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        openCourseDetailsModal(id);
      });
    });

    tbody.querySelectorAll('.btn-table-drop').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        promptDropCourse(id);
      });
    });
  }

  // ==========================================================================
  // Render: Student Profile Page & Visual Timetable
  // ==========================================================================
  function renderProfilePage() {
    updateGlobalBadges();

    // Bio values
    elements.studentNameTitle.textContent = appState.student.name;
    elements.profileId.textContent = appState.student.id;
    elements.profileEmail.textContent = appState.student.email;
    elements.profilePhone.textContent = appState.student.phone;

    // Avatar initials
    const parts = appState.student.name.split(' ').filter(Boolean);
    const initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
    elements.profileAvatarLetters.textContent = initials;

    renderWeeklyScheduleGrid();
  }

  function renderWeeklyScheduleGrid() {
    const grid = elements.weeklyScheduleGrid;
    const enrolled = getRegisteredCourses();

    elements.scheduleCountLabel.textContent = `${enrolled.length} Course${enrolled.length === 1 ? '' : 's'} Scheduled`;

    // Time slots from 8:00 AM to 5:00 PM (10 one-hour rows)
    const timeRows = [
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

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    // Header cells
    let html = `
      <div class="schedule-header-cell">Time</div>
      <div class="schedule-header-cell">Monday</div>
      <div class="schedule-header-cell">Tuesday</div>
      <div class="schedule-header-cell">Wednesday</div>
      <div class="schedule-header-cell">Thursday</div>
      <div class="schedule-header-cell">Friday</div>
    `;

    // Construct grid rows
    timeRows.forEach(row => {
      html += `<div class="schedule-time-cell">${row.label}</div>`;

      days.forEach(day => {
        // Find if any enrolled course takes place on this day at this hour
        const matchingCourse = enrolled.find(c => {
          return c.days.includes(day) && Math.floor(c.startHour) === row.hour;
        });

        if (matchingCourse) {
          html += `
            <div class="schedule-slot">
              <div class="schedule-event-block dept-badge ${matchingCourse.deptClass}" style="width: 100%; border: 1.5px solid var(--border-color);">
                <span style="font-weight: 800;">${escapeHtml(matchingCourse.code)}</span>
                <span style="font-size: 0.7rem; opacity: 0.9;">${escapeHtml(matchingCourse.room)}</span>
              </div>
            </div>
          `;
        } else {
          html += `<div class="schedule-slot"></div>`;
        }
      });
    });

    grid.innerHTML = html;
  }

  // ==========================================================================
  // Course Registration Actions & Confirmation Modal
  // ==========================================================================
  function promptRegisterCourse(courseId, selectedGrade = 'Letter') {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    if (isCourseRegistered(courseId)) {
      showToast(`You are already enrolled in ${course.code}.`, 'info');
      return;
    }

    const currentCredits = getTotalRegisteredCredits();
    if (currentCredits + course.credits > 19.5) {
      showToast(`Cannot register for ${course.code}. Maximum credit limit (19.5 units) exceeded.`, 'error');
      return;
    }

    const conflict = checkScheduleConflict(course);
    let conflictWarningHtml = '';
    if (conflict.hasConflict) {
      conflictWarningHtml = `
        <div class="conflict-alert visible" style="margin-top: 1rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div><strong>Schedule Warning:</strong> Overlaps with enrolled course <strong>${escapeHtml(conflict.conflictingCourse.code)}</strong>.</div>
        </div>
      `;
    }

    openConfirmationModal({
      title: 'Confirm Course Registration',
      bodyHtml: `
        <p>Please review and confirm your enrollment in the following course:</p>
        <div style="background-color: var(--bg-surface-alt); padding: 1rem; border-radius: var(--radius-md); margin-top: 0.75rem; border: 1px solid var(--border-color);">
          <div style="font-size: 1.15rem; font-weight: 800; color: var(--color-primary);">${escapeHtml(course.code)}: ${escapeHtml(course.title)}</div>
          <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">
            <strong>Units:</strong> ${course.credits.toFixed(1)} • <strong>Instructor:</strong> ${escapeHtml(course.instructor)}
          </div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">
            <strong>Meeting Time:</strong> ${escapeHtml(course.schedule)} (${escapeHtml(course.room)})
          </div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">
            <strong>Grading Option:</strong> ${escapeHtml(selectedGrade)}
          </div>
        </div>
        ${conflictWarningHtml}
      `,
      confirmText: 'Register Now',
      onConfirm: () => {
        executeCourseRegistration(courseId, selectedGrade);
      }
    });
  }

  function executeCourseRegistration(courseId, gradeOption = 'Letter') {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    if (!appState.registeredCourseIds.includes(courseId)) {
      appState.registeredCourseIds.push(courseId);
      appState.gradingOptions[courseId] = gradeOption;
      saveState();

      showToast(`Successfully registered for ${course.code}: ${course.title}!`, 'success');

      updateGlobalBadges();
      renderCatalog();
      renderRegistrationPage();
      renderProfilePage();
    }
  }

  function promptDropCourse(courseId) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    const remainingCredits = getTotalRegisteredCredits() - course.credits;
    let warningPart = '';
    if (remainingCredits < 12) {
      warningPart = `
        <div class="conflict-alert visible" style="margin-top: 1rem; background-color: var(--status-waitlist-bg); border-color: var(--status-waitlist-border); color: #92400e;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div><strong>Credit Load Alert:</strong> Dropping this course will reduce your total load to <strong>${remainingCredits.toFixed(1)} Units</strong>, dropping you below full-time status.</div>
        </div>
      `;
    }

    openConfirmationModal({
      title: 'Drop Course Confirmation',
      bodyHtml: `
        <p>Are you sure you want to drop <strong>${escapeHtml(course.code)} - ${escapeHtml(course.title)}</strong>?</p>
        <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem;">
          Your seat will be released immediately to waitlisted students.
        </p>
        ${warningPart}
      `,
      confirmText: 'Drop Course',
      isDanger: true,
      onConfirm: () => {
        executeDropCourse(courseId);
      }
    });
  }

  function executeDropCourse(courseId) {
    const course = COURSES.find(c => c.id === courseId);
    appState.registeredCourseIds = appState.registeredCourseIds.filter(id => id !== courseId);
    delete appState.gradingOptions[courseId];
    saveState();

    showToast(`Dropped ${course ? course.code : 'course'} from your schedule.`, 'info');

    updateGlobalBadges();
    renderCatalog();
    renderRegistrationPage();
    renderProfilePage();
  }

  // ==========================================================================
  // Modal Management (Focus Trapping & Keyboard Accessibility)
  // ==========================================================================
  function trapFocus(modalElement) {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(modalElement.querySelectorAll(focusableSelectors))
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    function keyHandler(e) {
      if (e.key === 'Escape') {
        closeAllModals();
        return;
      }
      if (e.key === 'Tab') {
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
    }

    modalElement._keyHandler = keyHandler;
    document.addEventListener('keydown', keyHandler);
  }

  function releaseFocusTrap(modalElement) {
    if (modalElement && modalElement._keyHandler) {
      document.removeEventListener('keydown', modalElement._keyHandler);
      delete modalElement._keyHandler;
    }
    if (lastActiveElementBeforeModal && typeof lastActiveElementBeforeModal.focus === 'function') {
      lastActiveElementBeforeModal.focus();
      lastActiveElementBeforeModal = null;
    }
  }

  function openConfirmationModal({ title, bodyHtml, confirmText = 'Confirm', isDanger = false, onConfirm }) {
    lastActiveElementBeforeModal = document.activeElement;
    pendingModalConfirmAction = onConfirm;

    elements.confirmModalTitle.textContent = title;
    elements.confirmModalDesc.innerHTML = bodyHtml;
    elements.btnExecuteConfirm.textContent = confirmText;

    if (isDanger) {
      elements.btnExecuteConfirm.className = 'btn btn-danger';
    } else {
      elements.btnExecuteConfirm.className = 'btn btn-primary';
    }

    elements.confirmationModal.classList.add('open');
    trapFocus(elements.confirmationModal);
  }

  function closeConfirmationModal() {
    elements.confirmationModal.classList.remove('open');
    releaseFocusTrap(elements.confirmationModal);
    pendingModalConfirmAction = null;
  }

  function openCourseDetailsModal(courseId) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    lastActiveElementBeforeModal = document.activeElement;
    const isEnrolled = isCourseRegistered(courseId);

    elements.detailsModalTitle.textContent = `${course.code}: ${course.title}`;

    const syllabusList = course.syllabus.map(topic => `<li>${escapeHtml(topic)}</li>`).join('');

    elements.detailsModalContent.innerHTML = `
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
        <span class="dept-badge ${course.deptClass}">${escapeHtml(course.department)}</span>
        <span class="status-pill ${isEnrolled ? 'status-registered' : 'status-open'}">${isEnrolled ? '✓ Enrolled' : `${course.credits.toFixed(1)} Credits`}</span>
        <span class="status-pill status-open">${escapeHtml(course.level)}</span>
      </div>

      <div style="margin-bottom: 1rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">Course Description</h4>
        <p style="font-size: 0.925rem; color: var(--text-secondary); line-height: 1.55;">${escapeHtml(course.description)}</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; background-color: var(--bg-surface-alt); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block;">Instructor</span>
          <span style="font-weight: 700; color: var(--text-main);">${escapeHtml(course.instructor)}</span>
        </div>
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block;">Meeting Schedule</span>
          <span style="font-weight: 700; color: var(--text-main);">${escapeHtml(course.schedule)}</span>
        </div>
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block;">Location / Room</span>
          <span style="font-weight: 700; color: var(--text-main);">${escapeHtml(course.room)}</span>
        </div>
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block;">Enrollment Capacity</span>
          <span style="font-weight: 700; color: var(--text-main);">${course.enrolled} / ${course.capacity} Students</span>
        </div>
      </div>

      <div style="margin-bottom: 1rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">Prerequisites &amp; Textbooks</h4>
        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;"><strong>Required:</strong> ${escapeHtml(course.prerequisites)}</div>
        <div style="font-size: 0.875rem; color: var(--text-secondary);"><strong>Textbook:</strong> ${escapeHtml(course.textbook)}</div>
      </div>

      <div>
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Syllabus Weekly Breakdown</h4>
        <ul style="padding-left: 1.25rem; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
          ${syllabusList}
        </ul>
      </div>
    `;

    // Configure Register / Drop button inside details modal
    if (isEnrolled) {
      elements.btnModalActionRegister.textContent = 'Drop Course';
      elements.btnModalActionRegister.className = 'btn btn-danger';
      elements.btnModalActionRegister.onclick = () => {
        closeDetailsModal();
        promptDropCourse(courseId);
      };
    } else {
      elements.btnModalActionRegister.textContent = 'Register for Course';
      elements.btnModalActionRegister.className = 'btn btn-primary';
      elements.btnModalActionRegister.onclick = () => {
        closeDetailsModal();
        promptRegisterCourse(courseId);
      };
    }

    elements.detailsModal.classList.add('open');
    trapFocus(elements.detailsModal);
  }

  function closeDetailsModal() {
    elements.detailsModal.classList.remove('open');
    releaseFocusTrap(elements.detailsModal);
  }

  function openProfileModal() {
    lastActiveElementBeforeModal = document.activeElement;
    elements.editStudentName.value = appState.student.name;
    elements.editStudentEmail.value = appState.student.email;
    elements.editStudentPhone.value = appState.student.phone;

    elements.profileModal.classList.add('open');
    trapFocus(elements.profileModal);
  }

  function closeProfileModal() {
    elements.profileModal.classList.remove('open');
    releaseFocusTrap(elements.profileModal);
  }

  function closeAllModals() {
    closeConfirmationModal();
    closeDetailsModal();
    closeProfileModal();
  }

  // ==========================================================================
  // Event Listeners Initialization
  // ==========================================================================
  function initEventListeners() {
    // Hash Routing
    window.addEventListener('hashchange', handleHashChange);

    // Mobile Hamburger Menu
    elements.mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = elements.mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      elements.mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      elements.primaryNav.classList.toggle('open');
    });

    // Theme Switcher
    elements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Catalog Search Live Input (Debounced)
    let searchTimer = null;
    elements.catalogSearch.addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      const val = e.target.value;
      if (val) {
        elements.searchClearBtn.classList.add('visible');
      } else {
        elements.searchClearBtn.classList.remove('visible');
      }

      searchTimer = setTimeout(() => {
        catalogFilters.search = val;
        renderCatalog();
        announce(`Catalog search updated. ${elements.catalogResultsCount.textContent}`);
      }, 200);
    });

    elements.searchClearBtn.addEventListener('click', () => {
      elements.catalogSearch.value = '';
      elements.searchClearBtn.classList.remove('visible');
      catalogFilters.search = '';
      renderCatalog();
      elements.catalogSearch.focus();
    });

    // Catalog Dropdown Filters
    elements.filterDepartment.addEventListener('change', (e) => {
      catalogFilters.department = e.target.value;
      renderCatalog();
    });

    elements.filterLevel.addEventListener('change', (e) => {
      catalogFilters.level = e.target.value;
      renderCatalog();
    });

    elements.filterStatus.addEventListener('change', (e) => {
      catalogFilters.status = e.target.value;
      renderCatalog();
    });

    elements.filterDays.addEventListener('change', (e) => {
      catalogFilters.days = e.target.value;
      renderCatalog();
    });

    elements.filterSort.addEventListener('change', (e) => {
      catalogFilters.sort = e.target.value;
      renderCatalog();
    });

    elements.resetFiltersBtn.addEventListener('click', resetFilters);

    // Registration Form Events
    elements.regCourseSelect.addEventListener('change', handleCourseSelectChange);

    elements.registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const courseId = elements.regCourseSelect.value;
      const grade = elements.regGradeOption.value;
      const agreed = elements.regAgreement.checked;

      if (!courseId) {
        showToast('Please select a course to register.', 'error');
        elements.regCourseSelect.focus();
        return;
      }

      if (!agreed) {
        showToast('Please check the acknowledgment box to proceed with enrollment.', 'warning');
        elements.regAgreement.focus();
        return;
      }

      promptRegisterCourse(courseId, grade);
    });

    elements.btnResetRegForm.addEventListener('click', () => {
      elements.registrationForm.reset();
      hideCoursePreview();
    });

    // Print Schedule Action
    elements.btnPrintSchedule.addEventListener('click', () => {
      window.print();
    });

    // Student Profile Modal Events
    elements.btnEditProfile.addEventListener('click', openProfileModal);
    elements.btnCloseProfileModal.addEventListener('click', closeProfileModal);
    elements.btnCancelEditProfile.addEventListener('click', closeProfileModal);

    elements.editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = elements.editStudentName.value.trim();
      const newEmail = elements.editStudentEmail.value.trim();
      const newPhone = elements.editStudentPhone.value.trim();

      if (newName && newEmail && newPhone) {
        appState.student.name = newName;
        appState.student.email = newEmail;
        appState.student.phone = newPhone;
        saveState();

        renderProfilePage();
        closeProfileModal();
        showToast('Student contact information successfully updated!', 'success');
      }
    });

    // Confirmation Modal Events
    elements.btnCloseConfirmModal.addEventListener('click', closeConfirmationModal);
    elements.btnCancelConfirm.addEventListener('click', closeConfirmationModal);
    elements.btnExecuteConfirm.addEventListener('click', () => {
      if (typeof pendingModalConfirmAction === 'function') {
        const action = pendingModalConfirmAction;
        closeConfirmationModal();
        action();
      } else {
        closeConfirmationModal();
      }
    });

    // Details Modal Events
    elements.btnCloseDetailsModal.addEventListener('click', closeDetailsModal);
    elements.btnCloseDetails.addEventListener('click', closeDetailsModal);

    // Click outside backdrop to close modal
    [elements.confirmationModal, elements.detailsModal, elements.profileModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeAllModals();
        }
      });
    });
  }

  // ==========================================================================
  // Application Entry Point
  // ==========================================================================
  function init() {
    applyTheme(appState.theme);
    initEventListeners();

    // Initial Route determination
    const initialHash = window.location.hash.replace('#', '') || 'home';
    switchPage(initialHash);

    // Render initial data
    updateGlobalBadges();
    renderCatalog();
    renderRegistrationPage();
    renderProfilePage();
  }

  // Boot on DOMContentLoaded or immediately if ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
