/* Course catalog data for the Horizon University registration demo. */
const DEPARTMENTS = {
  CS:   { name: "Computer Science", color: "#6c5ce7", icon: "💻" },
  MATH: { name: "Mathematics",      color: "#0984e3", icon: "📐" },
  BIO:  { name: "Biology",          color: "#00b894", icon: "🧬" },
  ART:  { name: "Fine Arts",        color: "#e84393", icon: "🎨" },
  BUS:  { name: "Business",         color: "#fdcb6e", icon: "📈" },
  PHYS: { name: "Physics",          color: "#e17055", icon: "⚛️" },
  ENG:  { name: "English",          color: "#00cec9", icon: "📚" },
};

const COURSES = [
  { id: "CS101",   dept: "CS",   title: "Intro to Programming",       level: 100, credits: 3, instructor: "Dr. Ada Park",       days: ["Mon", "Wed"],        start: "09:00", end: "10:15", seats: 40, enrolled: 31, description: "Learn the fundamentals of programming with Python: variables, control flow, functions and problem solving." },
  { id: "CS220",   dept: "CS",   title: "Data Structures",            level: 200, credits: 4, instructor: "Prof. Liam Chen",    days: ["Tue", "Thu"],        start: "10:30", end: "12:00", seats: 35, enrolled: 35, description: "Lists, trees, hash tables and graphs, with an emphasis on algorithmic efficiency." },
  { id: "CS340",   dept: "CS",   title: "Web Development",            level: 300, credits: 3, instructor: "Dr. Maya Singh",     days: ["Mon", "Wed"],        start: "13:00", end: "14:15", seats: 30, enrolled: 22, description: "Build modern responsive web applications with HTML, CSS, JavaScript and REST APIs." },
  { id: "CS410",   dept: "CS",   title: "Machine Learning",           level: 400, credits: 4, instructor: "Prof. Omar Haddad",  days: ["Fri"],               start: "09:00", end: "12:00", seats: 25, enrolled: 19, description: "Supervised and unsupervised learning, neural networks and model evaluation." },
  { id: "MATH110", dept: "MATH", title: "Calculus I",                 level: 100, credits: 4, instructor: "Dr. Elena Rossi",    days: ["Mon", "Wed", "Fri"], start: "08:00", end: "08:50", seats: 60, enrolled: 48, description: "Limits, derivatives and integrals of single-variable functions with applications." },
  { id: "MATH230", dept: "MATH", title: "Linear Algebra",             level: 200, credits: 3, instructor: "Prof. Sam Okafor",   days: ["Tue", "Thu"],        start: "13:00", end: "14:15", seats: 45, enrolled: 30, description: "Vectors, matrices, linear transformations, eigenvalues and their applications." },
  { id: "MATH350", dept: "MATH", title: "Probability & Statistics",   level: 300, credits: 3, instructor: "Dr. Hana Kim",       days: ["Mon", "Wed"],        start: "09:00", end: "10:15", seats: 40, enrolled: 12, description: "Random variables, distributions, estimation and hypothesis testing." },
  { id: "BIO101",  dept: "BIO",  title: "General Biology",            level: 100, credits: 4, instructor: "Dr. Grace Mensah",   days: ["Tue", "Thu"],        start: "08:30", end: "10:00", seats: 80, enrolled: 66, description: "Cell biology, genetics, evolution and ecology, with weekly lab sessions." },
  { id: "BIO310",  dept: "BIO",  title: "Genetics",                   level: 300, credits: 3, instructor: "Prof. Ravi Patel",   days: ["Mon", "Wed"],        start: "14:30", end: "15:45", seats: 30, enrolled: 27, description: "Mendelian and molecular genetics, gene regulation and genomic technologies." },
  { id: "ART120",  dept: "ART",  title: "Drawing Fundamentals",       level: 100, credits: 2, instructor: "Prof. Lucia Gómez",  days: ["Fri"],               start: "13:00", end: "15:30", seats: 20, enrolled: 14, description: "Line, form, perspective and composition through observational drawing." },
  { id: "ART250",  dept: "ART",  title: "Digital Illustration",       level: 200, credits: 3, instructor: "Dr. Kenji Mori",     days: ["Tue", "Thu"],        start: "15:00", end: "16:15", seats: 24, enrolled: 9,  description: "Create vibrant digital artwork using industry-standard illustration tools." },
  { id: "BUS100",  dept: "BUS",  title: "Principles of Management",   level: 100, credits: 3, instructor: "Prof. Nora Becker",  days: ["Mon", "Wed"],        start: "10:30", end: "11:45", seats: 70, enrolled: 52, description: "Planning, organizing, leading and controlling in modern organizations." },
  { id: "BUS320",  dept: "BUS",  title: "Marketing Strategy",         level: 300, credits: 3, instructor: "Dr. Tomás Silva",    days: ["Thu"],               start: "17:00", end: "19:30", seats: 35, enrolled: 20, description: "Market research, branding, digital marketing and campaign planning." },
  { id: "PHYS150", dept: "PHYS", title: "Physics I: Mechanics",       level: 100, credits: 4, instructor: "Prof. Ingrid Larsen",days: ["Tue", "Thu"],        start: "10:30", end: "12:00", seats: 50, enrolled: 41, description: "Kinematics, Newton's laws, energy, momentum and rotational motion." },
  { id: "PHYS420", dept: "PHYS", title: "Quantum Mechanics",          level: 400, credits: 4, instructor: "Dr. Arjun Rao",      days: ["Mon", "Wed"],        start: "15:00", end: "16:30", seats: 20, enrolled: 11, description: "Wave functions, the Schrödinger equation, spin and quantum systems." },
  { id: "ENG105",  dept: "ENG",  title: "Academic Writing",           level: 100, credits: 3, instructor: "Prof. Claire Dubois",days: ["Tue", "Thu"],        start: "13:00", end: "14:15", seats: 25, enrolled: 18, description: "Develop clear, persuasive writing and research skills for university study." },
  { id: "ENG280",  dept: "ENG",  title: "World Literature",           level: 200, credits: 3, instructor: "Dr. Yusuf Ali",      days: ["Fri"],               start: "10:00", end: "12:30", seats: 30, enrolled: 16, description: "Explore major literary works from across the globe and their cultural contexts." },
  { id: "BIO420",  dept: "BIO",  title: "Marine Ecology",             level: 400, credits: 3, instructor: "Prof. Leilani Kai",  days: ["Wed"],               start: "17:00", end: "19:30", seats: 18, enrolled: 18, description: "Ocean ecosystems, biodiversity and conservation, including field trips." },
];
