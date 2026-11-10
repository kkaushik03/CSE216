/* Sample data for the course registration system (no backend). */
const DEPARTMENTS = {
  CS:   { name: "Computer Science", color: "#6c5ce7" },
  MATH: { name: "Mathematics",      color: "#0984e3" },
  BIO:  { name: "Biology",          color: "#00b894" },
  ART:  { name: "Fine Arts",        color: "#e84393" },
  HIST: { name: "History",          color: "#e17055" },
  PSY:  { name: "Psychology",       color: "#fdcb6e" }
};

const COURSES = [
  { id: "CS101",   dept: "CS",   title: "Intro to Programming",        instructor: "Dr. Ada Park",       credits: 4, level: 100, days: "MWF", time: "09:00–09:50", room: "Tech 110",   seats: 40, enrolled: 31, description: "Learn the fundamentals of programming with Python: variables, control flow, functions and data structures." },
  { id: "CS220",   dept: "CS",   title: "Data Structures",             instructor: "Prof. Linus Ortega", credits: 4, level: 200, days: "TR",  time: "10:30–11:45", room: "Tech 204",   seats: 35, enrolled: 35, description: "Lists, trees, hash tables, graphs and the analysis of algorithms that use them." },
  { id: "CS340",   dept: "CS",   title: "Web Development",             instructor: "Dr. Grace Kim",      credits: 3, level: 300, days: "MW",  time: "13:00–14:15", room: "Tech 301",   seats: 30, enrolled: 18, description: "Build responsive, accessible web applications with HTML, CSS, JavaScript and modern tooling." },
  { id: "CS410",   dept: "CS",   title: "Machine Learning",            instructor: "Prof. Alan Moreau",  credits: 3, level: 400, days: "TR",  time: "14:00–15:15", room: "Tech 401",   seats: 25, enrolled: 22, description: "Supervised and unsupervised learning, model evaluation, and neural network basics." },
  { id: "MATH110", dept: "MATH", title: "Calculus I",                  instructor: "Dr. Sofia Lindqvist",credits: 4, level: 100, days: "MWF", time: "10:00–10:50", room: "Science 120",seats: 50, enrolled: 44, description: "Limits, derivatives, and integrals with applications to science and engineering." },
  { id: "MATH210", dept: "MATH", title: "Linear Algebra",              instructor: "Prof. Omar Haddad",  credits: 3, level: 200, days: "TR",  time: "09:00–10:15", room: "Science 215",seats: 40, enrolled: 27, description: "Vectors, matrices, linear transformations, eigenvalues and their applications." },
  { id: "MATH330", dept: "MATH", title: "Probability & Statistics",    instructor: "Dr. Mei Tanaka",     credits: 3, level: 300, days: "MW",  time: "15:00–16:15", room: "Science 310",seats: 35, enrolled: 12, description: "Random variables, distributions, estimation, hypothesis testing and regression." },
  { id: "BIO101",  dept: "BIO",  title: "General Biology",             instructor: "Dr. Rosa Alvarez",   credits: 4, level: 100, days: "MWF", time: "11:00–11:50", room: "Life Sci 100",seats: 60, enrolled: 52, description: "Cells, genetics, evolution and ecology — the foundations of life science." },
  { id: "BIO250",  dept: "BIO",  title: "Genetics",                    instructor: "Prof. Henry Osei",   credits: 3, level: 200, days: "TR",  time: "13:00–14:15", room: "Life Sci 205",seats: 30, enrolled: 9,  description: "Mendelian and molecular genetics, gene expression and genomics." },
  { id: "BIO360",  dept: "BIO",  title: "Marine Ecology",              instructor: "Dr. Coral Bennett",  credits: 4, level: 300, days: "F",   time: "13:00–16:00", room: "Ocean Lab",  seats: 20, enrolled: 19, description: "Ecosystems of the ocean, with weekly field labs along the coast." },
  { id: "ART105",  dept: "ART",  title: "Drawing Fundamentals",        instructor: "Prof. Luca Bianchi", credits: 3, level: 100, days: "TR",  time: "15:30–16:45", room: "Arts 012",   seats: 20, enrolled: 14, description: "Line, form, perspective and shading through observational drawing." },
  { id: "ART230",  dept: "ART",  title: "Digital Illustration",        instructor: "Dr. Yuki Sato",      credits: 3, level: 200, days: "MW",  time: "10:30–11:45", room: "Arts 220",   seats: 22, enrolled: 22, description: "Create vibrant illustrations using digital tools and color theory." },
  { id: "ART320",  dept: "ART",  title: "Color Theory",                instructor: "Prof. Iris Novak",   credits: 2, level: 300, days: "F",   time: "09:00–10:50", room: "Arts 305",   seats: 25, enrolled: 11, description: "The science and psychology of color in painting, design and media." },
  { id: "HIST120", dept: "HIST", title: "World History",               instructor: "Dr. Samuel Achebe",  credits: 3, level: 100, days: "MWF", time: "12:00–12:50", room: "Hall 140",   seats: 80, enrolled: 63, description: "A survey of global civilizations from antiquity to the modern era." },
  { id: "HIST315", dept: "HIST", title: "History of Science",          instructor: "Prof. Clara Weiss",  credits: 3, level: 300, days: "TR",  time: "12:00–13:15", room: "Hall 230",   seats: 30, enrolled: 16, description: "How scientific ideas developed and shaped society, from Galileo to genomics." },
  { id: "PSY101",  dept: "PSY",  title: "Introduction to Psychology",  instructor: "Dr. Nadia Rahman",   credits: 3, level: 100, days: "MW",  time: "09:00–10:15", room: "Hall 101",   seats: 90, enrolled: 71, description: "Mind and behavior: perception, memory, learning, emotion and personality." },
  { id: "PSY280",  dept: "PSY",  title: "Cognitive Psychology",        instructor: "Prof. Ethan Brooks", credits: 3, level: 200, days: "TR",  time: "15:30–16:45", room: "Hall 210",   seats: 35, enrolled: 20, description: "Attention, language, problem solving and decision making." },
  { id: "PSY420",  dept: "PSY",  title: "Positive Psychology",         instructor: "Dr. Joy Fernandes",  credits: 2, level: 400, days: "W",   time: "16:30–18:20", room: "Hall 305",   seats: 25, enrolled: 8,  description: "The science of well-being, resilience and human flourishing." }
];

const DEFAULT_STUDENT = {
  id: "S2026-0417",
  firstName: "Jordan",
  lastName: "Rivera",
  email: "jordan.rivera@university.edu",
  major: "Computer Science",
  year: "Sophomore",
  advisor: "Dr. Grace Kim",
  gpa: 3.62
};

const TERM = "Spring 2027";
const MAX_CREDITS = 18;
