/**
 * University Course Registration System - Data Store
 * Horizon University Academic Portal
 */

const COURSES_DATA = [
  {
    id: "cs-101",
    code: "CS 101",
    title: "Introduction to Computer Science",
    dept: "Computer Science",
    deptKey: "cs",
    level: 100,
    credits: 4,
    term: "Fall 2026",
    instructor: "Dr. Alan Turing",
    schedule: "Mon, Wed 10:00 AM - 11:30 AM",
    days: "MW",
    time: "10:00 AM - 11:30 AM",
    location: "Turing Hall 101",
    mode: "In-Person",
    capacity: 60,
    enrolled: 48,
    prereqs: [],
    prereqText: "None",
    description: "Fundamentals of programming, algorithm design, data structures, and computational thinking using Python. Includes hands-on weekly laboratory exercises.",
    theme: "indigo"
  },
  {
    id: "cs-201",
    code: "CS 201",
    title: "Data Structures & Algorithms",
    dept: "Computer Science",
    deptKey: "cs",
    level: 200,
    credits: 4,
    term: "Fall 2026",
    instructor: "Dr. Ada Lovelace",
    schedule: "Tue, Thu 01:00 PM - 02:30 PM",
    days: "TR",
    time: "01:00 PM - 02:30 PM",
    location: "Silicon Auditorium 204",
    mode: "In-Person",
    capacity: 45,
    enrolled: 41,
    prereqs: ["CS 101"],
    prereqText: "CS 101",
    description: "Abstract data types, stacks, queues, trees, priority heaps, hash tables, graph algorithms, and asymptotic complexity analysis (Big-O notation).",
    theme: "indigo"
  },
  {
    id: "cs-305",
    code: "CS 305",
    title: "Web Architecture & Cloud Systems",
    dept: "Computer Science",
    deptKey: "cs",
    level: 300,
    credits: 4,
    term: "Fall 2026",
    instructor: "Prof. Tim Berners-Lee",
    schedule: "Mon, Wed, Fri 09:00 AM - 10:00 AM",
    days: "MWF",
    time: "09:00 AM - 10:00 AM",
    location: "Engineering Complex 310",
    mode: "Hybrid",
    capacity: 35,
    enrolled: 29,
    prereqs: ["CS 201"],
    prereqText: "CS 201",
    description: "Full-stack web application development, microservices, cloud deployments, asynchronous distributed messaging, RESTful APIs, and browser accessibility.",
    theme: "indigo"
  },
  {
    id: "cs-410",
    code: "CS 410",
    title: "Machine Learning & Intelligent Agents",
    dept: "Computer Science",
    deptKey: "cs",
    level: 400,
    credits: 4,
    term: "Spring 2027",
    instructor: "Dr. Geoffrey Hinton",
    schedule: "Tue, Thu 03:00 PM - 04:30 PM",
    days: "TR",
    time: "03:00 PM - 04:30 PM",
    location: "AI Innovation Center 501",
    mode: "In-Person",
    capacity: 30,
    enrolled: 26,
    prereqs: ["CS 201", "MATH 220"],
    prereqText: "CS 201, MATH 220",
    description: "Supervised and unsupervised learning, loss optimization, neural networks, decision trees, reinforcement learning, and ethical AI deployment.",
    theme: "indigo"
  },
  {
    id: "math-150",
    code: "MATH 150",
    title: "Calculus for Sciences I",
    dept: "Mathematics",
    deptKey: "math",
    level: 100,
    credits: 4,
    term: "Fall 2026",
    instructor: "Dr. Katherine Johnson",
    schedule: "Mon, Wed, Fri 11:00 AM - 12:15 PM",
    days: "MWF",
    time: "11:00 AM - 12:15 PM",
    location: "Newton Hall 105",
    mode: "In-Person",
    capacity: 80,
    enrolled: 71,
    prereqs: [],
    prereqText: "High School Pre-Calculus",
    description: "Differential calculus, limits, continuity, derivative applications, optimization problems, curve sketching, and an introduction to Riemann integrals.",
    theme: "emerald"
  },
  {
    id: "math-220",
    code: "MATH 220",
    title: "Linear Algebra & Matrix Analysis",
    dept: "Mathematics",
    deptKey: "math",
    level: 200,
    credits: 3,
    term: "Fall 2026",
    instructor: "Dr. Carl Friedrich Gauss",
    schedule: "Tue, Thu 10:00 AM - 11:20 AM",
    days: "TR",
    time: "10:00 AM - 11:20 AM",
    location: "Euler Hall 215",
    mode: "In-Person",
    capacity: 50,
    enrolled: 39,
    prereqs: ["MATH 150"],
    prereqText: "MATH 150",
    description: "Vector spaces, linear transformations, matrix inverses, determinants, eigenvalues, eigenvectors, orthogonalization, and inner product spaces.",
    theme: "emerald"
  },
  {
    id: "math-310",
    code: "MATH 310",
    title: "Probability & Statistics for Engineers",
    dept: "Mathematics",
    deptKey: "math",
    level: 300,
    credits: 3,
    term: "Spring 2027",
    instructor: "Dr. Florence Nightingale",
    schedule: "Mon, Wed 02:00 PM - 03:20 PM",
    days: "MW",
    time: "02:00 PM - 03:20 PM",
    location: "Gauss Center 302",
    mode: "Online",
    capacity: 40,
    enrolled: 36,
    prereqs: ["MATH 150"],
    prereqText: "MATH 150",
    description: "Probability laws, random variables, probability density functions, expectation, hypothesis testing, linear regression, and error propagation.",
    theme: "emerald"
  },
  {
    id: "bio-110",
    code: "BIO 110",
    title: "Principles of Cellular & Molecular Biology",
    dept: "Biology",
    deptKey: "bio",
    level: 100,
    credits: 4,
    term: "Fall 2026",
    instructor: "Dr. Rosalind Franklin",
    schedule: "Tue, Thu 09:30 AM - 11:00 AM",
    days: "TR",
    time: "09:30 AM - 11:00 AM",
    location: "Darwin Laboratory 102",
    mode: "In-Person",
    capacity: 50,
    enrolled: 44,
    prereqs: [],
    prereqText: "None",
    description: "Molecular basis of cellular life, DNA replication, transcription, protein synthesis, bioenergetics, and cell signaling networks.",
    theme: "teal"
  },
  {
    id: "bio-240",
    code: "BIO 240",
    title: "Genetics & Genomic Medicine",
    dept: "Biology",
    deptKey: "bio",
    level: 200,
    credits: 4,
    term: "Spring 2027",
    instructor: "Dr. Gregor Mendel",
    schedule: "Mon, Wed 01:00 PM - 02:30 PM",
    days: "MW",
    time: "01:00 PM - 02:30 PM",
    location: "BioTech Wing 204",
    mode: "In-Person",
    capacity: 35,
    enrolled: 31,
    prereqs: ["BIO 110"],
    prereqText: "BIO 110",
    description: "Mendelian genetics, chromosome mapping, population genetics, CRISPR genome editing, and modern genomic medicine case studies.",
    theme: "teal"
  },
  {
    id: "dsgn-120",
    code: "DSGN 120",
    title: "Foundations of Visual Design & UX",
    dept: "Design",
    deptKey: "dsgn",
    level: 100,
    credits: 3,
    term: "Fall 2026",
    instructor: "Prof. Dieter Rams",
    schedule: "Mon, Wed 03:30 PM - 05:00 PM",
    days: "MW",
    time: "03:30 PM - 05:00 PM",
    location: "Arts Media Studio 12",
    mode: "In-Person",
    capacity: 25,
    enrolled: 22,
    prereqs: [],
    prereqText: "None",
    description: "Visual hierarchy, typography, color theory, layout grids, wireframing, and user-centered design methodologies for digital products.",
    theme: "rose"
  },
  {
    id: "dsgn-250",
    code: "DSGN 250",
    title: "Interactive Systems & Accessibility",
    dept: "Design",
    deptKey: "dsgn",
    level: 200,
    credits: 3,
    term: "Spring 2027",
    instructor: "Prof. Don Norman",
    schedule: "Tue, Thu 11:30 AM - 01:00 PM",
    days: "TR",
    time: "11:30 AM - 01:00 PM",
    location: "Human Factors Lab 3",
    mode: "Hybrid",
    capacity: 25,
    enrolled: 19,
    prereqs: ["DSGN 120"],
    prereqText: "DSGN 120",
    description: "Accessible design principles, WCAG 2.2 guidelines, screen reader testing, assistive technologies, keyboard interactions, and inclusive design.",
    theme: "rose"
  },
  {
    id: "econ-101",
    code: "ECON 101",
    title: "Principles of Microeconomics",
    dept: "Economics",
    deptKey: "econ",
    level: 100,
    credits: 3,
    term: "Fall 2026",
    instructor: "Dr. Adam Smith",
    schedule: "Mon, Wed, Fri 10:00 AM - 10:50 AM",
    days: "MWF",
    time: "10:00 AM - 10:50 AM",
    location: "Keynes Hall 201",
    mode: "In-Person",
    capacity: 75,
    enrolled: 64,
    prereqs: [],
    prereqText: "None",
    description: "Market equilibrium, price elasticity, consumer theory, production costs, perfect competition, monopolies, and government intervention.",
    theme: "amber"
  },
  {
    id: "econ-230",
    code: "ECON 230",
    title: "Econometrics & Quantitative Policy",
    dept: "Economics",
    deptKey: "econ",
    level: 200,
    credits: 4,
    term: "Fall 2026",
    instructor: "Dr. Esther Duflo",
    schedule: "Tue, Thu 02:00 PM - 03:30 PM",
    days: "TR",
    time: "02:00 PM - 03:30 PM",
    location: "Social Sciences 118",
    mode: "In-Person",
    capacity: 40,
    enrolled: 33,
    prereqs: ["ECON 101", "MATH 150"],
    prereqText: "ECON 101, MATH 150",
    description: "Empirical economic research, ordinary least squares regression, multicollinearity, instrumental variables, and causal inference in public policy.",
    theme: "amber"
  },
  {
    id: "psyc-101",
    code: "PSYC 101",
    title: "Introduction to Psychology & Cognition",
    dept: "Psychology",
    deptKey: "psyc",
    level: 100,
    credits: 3,
    term: "Fall 2026",
    instructor: "Dr. William James",
    schedule: "Tue, Thu 08:30 AM - 09:50 AM",
    days: "TR",
    time: "08:30 AM - 09:50 AM",
    location: "Behavioral Sciences 101",
    mode: "In-Person",
    capacity: 90,
    enrolled: 82,
    prereqs: [],
    prereqText: "None",
    description: "Biological bases of behavior, perceptual systems, conditioning and learning, memory architecture, developmental stages, and social psychology.",
    theme: "purple"
  },
  {
    id: "psyc-330",
    code: "PSYC 330",
    title: "Cognitive Neuroscience & Memory Systems",
    dept: "Psychology",
    deptKey: "psyc",
    level: 300,
    credits: 3,
    term: "Spring 2027",
    instructor: "Dr. Brenda Milner",
    schedule: "Mon, Wed 01:30 PM - 02:50 PM",
    days: "MW",
    time: "01:30 PM - 02:50 PM",
    location: "Neuroscience Wing 412",
    mode: "Hybrid",
    capacity: 30,
    enrolled: 27,
    prereqs: ["PSYC 101"],
    prereqText: "PSYC 101",
    description: "Brain systems mediating attention, executive control, episodic and semantic memory encoding, fMRI imaging paradigms, and amnesia.",
    theme: "purple"
  },
  {
    id: "phil-205",
    code: "PHIL 205",
    title: "Technology Ethics & Modern Society",
    dept: "Philosophy",
    deptKey: "phil",
    level: 200,
    credits: 3,
    term: "Fall 2026",
    instructor: "Dr. Hannah Arendt",
    schedule: "Tue, Thu 04:00 PM - 05:20 PM",
    days: "TR",
    time: "04:00 PM - 05:20 PM",
    location: "Humanities Hall 210",
    mode: "In-Person",
    capacity: 40,
    enrolled: 30,
    prereqs: [],
    prereqText: "None",
    description: "Ethical frameworks applied to artificial intelligence, algorithmic bias, data privacy, social media platforms, autonomous weapons, and digital citizenship.",
    theme: "cyan"
  }
];

const INITIAL_STUDENT = {
  id: "U20268841",
  name: "Alex Mercer",
  email: "a.mercer@horizon.edu",
  phone: "(555) 382-9104",
  major: "Computer Science, B.S.",
  minor: "Data Analytics",
  college: "College of Computing & Natural Sciences",
  advisor: "Dr. Ada Lovelace",
  standing: "Junior (Year 3)",
  gpa: "3.84",
  creditsCompleted: 68,
  degreeCreditsReq: 120,
  targetGraduation: "Spring 2028",
  academicHold: "None (Clear to Register)",
  maxCreditsPerTerm: 18,
  minFullTimeCredits: 12
};

const DEFAULT_REGISTERED_IDS = ["cs-101", "math-150"];

// Safe localStorage helper with in-memory fallback
const StorageManager = {
  _memoryStore: {},

  isAvailable() {
    try {
      const testKey = "__test_storage__";
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },

  getItem(key, defaultValue = null) {
    if (this.isAvailable()) {
      try {
        const val = window.localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    }
    return this._memoryStore[key] !== undefined ? this._memoryStore[key] : defaultValue;
  },

  setItem(key, value) {
    if (this.isAvailable()) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        // Fallback
      }
    }
    this._memoryStore[key] = value;
  }
};

// University Registration State APIs
const PortalState = {
  getRegisteredIds() {
    return StorageManager.getItem("portal_registered_course_ids", DEFAULT_REGISTERED_IDS);
  },

  setRegisteredIds(ids) {
    StorageManager.setItem("portal_registered_course_ids", ids);
  },

  getRegisteredCourses() {
    const ids = this.getRegisteredIds();
    return ids.map(id => COURSES_DATA.find(c => c.id === id)).filter(Boolean);
  },

  getTotalCredits() {
    const registered = this.getRegisteredCourses();
    return registered.reduce((sum, c) => sum + c.credits, 0);
  },

  isRegistered(courseId) {
    const ids = this.getRegisteredIds();
    return ids.includes(courseId);
  },

  addCourse(courseId) {
    const ids = this.getRegisteredIds();
    if (ids.includes(courseId)) {
      return { success: false, reason: "Already registered for this course." };
    }
    const course = COURSES_DATA.find(c => c.id === courseId);
    if (!course) {
      return { success: false, reason: "Course not found." };
    }
    const currentCredits = this.getTotalCredits();
    if (currentCredits + course.credits > INITIAL_STUDENT.maxCreditsPerTerm) {
      return {
        success: false,
        reason: `Exceeds credit limit! Current: ${currentCredits} credits. Adding this course (+${course.credits}) would exceed the maximum term limit of ${INITIAL_STUDENT.maxCreditsPerTerm} credits.`
      };
    }
    const updated = [...ids, courseId];
    this.setRegisteredIds(updated);
    return { success: true, course: course };
  },

  dropCourse(courseId) {
    const ids = this.getRegisteredIds();
    const course = COURSES_DATA.find(c => c.id === courseId);
    if (!ids.includes(courseId)) {
      return { success: false, reason: "Course is not currently in your schedule." };
    }
    const updated = ids.filter(id => id !== courseId);
    this.setRegisteredIds(updated);
    return { success: true, course: course };
  },

  getStudentProfile() {
    return StorageManager.getItem("portal_student_profile", INITIAL_STUDENT);
  },

  saveStudentProfile(profile) {
    StorageManager.setItem("portal_student_profile", profile);
  }
};
