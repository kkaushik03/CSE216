/* Course catalog data for the UniReg demo application. */
const DEPARTMENTS = {
  CS:   { name: "Computer Science", color: "#6366f1", icon: "💻" },
  MATH: { name: "Mathematics",      color: "#0ea5e9", icon: "📐" },
  BIO:  { name: "Biology",          color: "#16a34a", icon: "🧬" },
  ART:  { name: "Fine Arts",        color: "#ec4899", icon: "🎨" },
  BUS:  { name: "Business",         color: "#f59e0b", icon: "📈" },
  PSY:  { name: "Psychology",       color: "#a855f7", icon: "🧠" },
};

const COURSES = [
  { code: "CS101",   dept: "CS",   title: "Intro to Programming",          credits: 3, level: 100, instructor: "Dr. Ada Park",        days: ["Mon", "Wed"],        start: "09:00", end: "10:15", seats: 40, enrolled: 31, description: "Learn the fundamentals of programming with Python: variables, control flow, functions and basic data structures." },
  { code: "CS210",   dept: "CS",   title: "Data Structures",               credits: 4, level: 200, instructor: "Prof. Linus Grant",   days: ["Tue", "Thu"],        start: "10:30", end: "11:45", seats: 35, enrolled: 35, description: "Lists, stacks, queues, trees, hash tables and graphs, with an emphasis on algorithmic complexity." },
  { code: "CS340",   dept: "CS",   title: "Web Development",               credits: 3, level: 300, instructor: "Dr. Maya Chen",       days: ["Mon", "Wed", "Fri"], start: "13:00", end: "13:50", seats: 30, enrolled: 18, description: "Build modern responsive web applications using HTML, CSS, JavaScript and REST APIs." },
  { code: "CS450",   dept: "CS",   title: "Machine Learning",              credits: 4, level: 400, instructor: "Prof. Omar Haddad",   days: ["Tue", "Thu"],        start: "14:00", end: "15:15", seats: 25, enrolled: 22, description: "Supervised and unsupervised learning, neural networks, model evaluation and real-world ML projects." },
  { code: "MATH120", dept: "MATH", title: "Calculus I",                    credits: 4, level: 100, instructor: "Dr. Elena Rossi",     days: ["Mon", "Wed", "Fri"], start: "08:00", end: "08:50", seats: 60, enrolled: 44, description: "Limits, derivatives and integrals of single-variable functions with applications." },
  { code: "MATH220", dept: "MATH", title: "Linear Algebra",                credits: 3, level: 200, instructor: "Prof. Sam Okafor",    days: ["Tue", "Thu"],        start: "09:00", end: "10:15", seats: 45, enrolled: 29, description: "Vectors, matrices, linear transformations, eigenvalues and their applications in science and computing." },
  { code: "MATH330", dept: "MATH", title: "Probability & Statistics",      credits: 3, level: 300, instructor: "Dr. Priya Nair",      days: ["Mon", "Wed"],        start: "10:30", end: "11:45", seats: 40, enrolled: 38, description: "Probability theory, random variables, distributions, estimation and hypothesis testing." },
  { code: "BIO110",  dept: "BIO",  title: "General Biology",               credits: 4, level: 100, instructor: "Dr. Grace Liu",       days: ["Tue", "Thu"],        start: "08:00", end: "09:15", seats: 80, enrolled: 52, description: "Cells, genetics, evolution and ecology — a broad survey of the living world, with weekly labs." },
  { code: "BIO305",  dept: "BIO",  title: "Molecular Genetics",            credits: 3, level: 300, instructor: "Prof. Henry Adams",   days: ["Mon", "Wed"],        start: "14:00", end: "15:15", seats: 30, enrolled: 12, description: "DNA replication, gene expression and regulation, and modern genetic engineering techniques." },
  { code: "ART101",  dept: "ART",  title: "Drawing Fundamentals",          credits: 2, level: 100, instructor: "Prof. Lucia Moreno",  days: ["Fri"],               start: "09:00", end: "11:30", seats: 20, enrolled: 14, description: "Line, shape, value and perspective. Studio course focusing on observational drawing." },
  { code: "ART240",  dept: "ART",  title: "Digital Illustration",          credits: 3, level: 200, instructor: "Dr. Kenji Watanabe",  days: ["Tue", "Thu"],        start: "13:00", end: "14:15", seats: 22, enrolled: 21, description: "Create vibrant digital artwork using industry-standard tools, color theory and composition." },
  { code: "BUS100",  dept: "BUS",  title: "Intro to Business",             credits: 3, level: 100, instructor: "Prof. Rachel Stone",  days: ["Mon", "Wed"],        start: "12:00", end: "13:15", seats: 70, enrolled: 40, description: "An overview of management, marketing, finance and entrepreneurship in the modern economy." },
  { code: "BUS315",  dept: "BUS",  title: "Digital Marketing",             credits: 3, level: 300, instructor: "Dr. Tomás Silva",     days: ["Fri"],               start: "13:00", end: "15:30", seats: 35, enrolled: 9,  description: "SEO, social media strategy, analytics and campaign design for the digital marketplace." },
  { code: "BUS420",  dept: "BUS",  title: "Strategic Management",          credits: 4, level: 400, instructor: "Prof. Diana Brooks",  days: ["Tue", "Thu"],        start: "15:30", end: "16:45", seats: 30, enrolled: 30, description: "Case-based capstone on competitive strategy, corporate governance and long-term planning." },
  { code: "PSY101",  dept: "PSY",  title: "Intro to Psychology",           credits: 3, level: 100, instructor: "Dr. Noah Feldman",    days: ["Mon", "Wed", "Fri"], start: "11:00", end: "11:50", seats: 90, enrolled: 77, description: "Explore the science of mind and behavior: perception, memory, learning, emotion and personality." },
  { code: "PSY350",  dept: "PSY",  title: "Cognitive Neuroscience",        credits: 4, level: 300, instructor: "Prof. Amara Osei",    days: ["Tue", "Thu"],        start: "11:00", end: "12:15", seats: 28, enrolled: 16, description: "How the brain gives rise to cognition, studied through imaging, lesion studies and computation." },
];

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const MAX_CREDITS = 18;
