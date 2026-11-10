// Sample course data (no backend). Loaded before app.js on every page.
const COURSES = [
  { id: "CS101", title: "Introduction to Programming", dept: "Computer Science", level: 100, credits: 4, instructor: "Dr. Ada Moreno", days: "Mon/Wed", time: "09:00–10:30", seats: 40, enrolled: 32, description: "Learn the fundamentals of programming with Python: variables, control flow, functions and data structures." },
  { id: "CS220", title: "Data Structures & Algorithms", dept: "Computer Science", level: 200, credits: 4, instructor: "Prof. Liam Chen", days: "Tue/Thu", time: "11:00–12:30", seats: 35, enrolled: 35, description: "Lists, trees, graphs, hashing, sorting and the analysis of algorithm efficiency." },
  { id: "CS340", title: "Web Development", dept: "Computer Science", level: 300, credits: 3, instructor: "Dr. Priya Nair", days: "Mon/Wed", time: "13:00–14:30", seats: 30, enrolled: 18, description: "Build modern, responsive web applications with HTML, CSS, JavaScript and HTTP APIs." },
  { id: "CS410", title: "Machine Learning", dept: "Computer Science", level: 400, credits: 4, instructor: "Prof. Omar Haddad", days: "Tue/Thu", time: "14:00–15:30", seats: 25, enrolled: 21, description: "Supervised and unsupervised learning, model evaluation, and neural network basics." },
  { id: "MATH110", title: "Calculus I", dept: "Mathematics", level: 100, credits: 4, instructor: "Dr. Elena Rossi", days: "Mon/Wed/Fri", time: "08:00–09:00", seats: 60, enrolled: 44, description: "Limits, derivatives, and integrals of single-variable functions with applications." },
  { id: "MATH210", title: "Linear Algebra", dept: "Mathematics", level: 200, credits: 3, instructor: "Prof. Kenji Sato", days: "Tue/Thu", time: "09:30–11:00", seats: 45, enrolled: 30, description: "Vectors, matrices, linear transformations, eigenvalues and their applications." },
  { id: "MATH330", title: "Probability & Statistics", dept: "Mathematics", level: 300, credits: 3, instructor: "Dr. Grace Okafor", days: "Mon/Wed", time: "15:00–16:30", seats: 40, enrolled: 12, description: "Random variables, distributions, estimation and hypothesis testing." },
  { id: "BIO101", title: "General Biology", dept: "Biology", level: 100, credits: 4, instructor: "Dr. Sam Whitaker", days: "Tue/Thu", time: "08:00–09:30", seats: 80, enrolled: 71, description: "Cells, genetics, evolution and ecology — an introduction to the science of life." },
  { id: "BIO305", title: "Molecular Genetics", dept: "Biology", level: 300, credits: 4, instructor: "Prof. Hana Kim", days: "Mon/Wed", time: "10:30–12:00", seats: 30, enrolled: 29, description: "DNA replication, gene expression, regulation, and modern genomic techniques." },
  { id: "PSY100", title: "Introduction to Psychology", dept: "Psychology", level: 100, credits: 3, instructor: "Dr. Maya Fischer", days: "Fri", time: "10:00–13:00", seats: 100, enrolled: 63, description: "Survey of perception, memory, development, personality and social behavior." },
  { id: "PSY250", title: "Cognitive Psychology", dept: "Psychology", level: 200, credits: 3, instructor: "Prof. Diego Alvarez", days: "Tue/Thu", time: "13:00–14:30", seats: 40, enrolled: 22, description: "How people think, learn, remember, reason and make decisions." },
  { id: "ART120", title: "Drawing Foundations", dept: "Art & Design", level: 100, credits: 3, instructor: "Prof. Lena Novak", days: "Mon/Wed", time: "16:00–17:30", seats: 20, enrolled: 14, description: "Line, value, perspective and composition through observational drawing." },
  { id: "ART280", title: "Digital Illustration", dept: "Art & Design", level: 200, credits: 3, instructor: "Dr. Jonah Price", days: "Tue/Thu", time: "15:30–17:00", seats: 20, enrolled: 20, description: "Create expressive digital artwork using industry-standard illustration tools." },
  { id: "BUS200", title: "Principles of Marketing", dept: "Business", level: 200, credits: 3, instructor: "Dr. Aisha Rahman", days: "Mon/Wed", time: "11:00–12:30", seats: 50, enrolled: 37, description: "Market research, consumer behavior, branding, and the marketing mix." },
  { id: "BUS350", title: "Entrepreneurship", dept: "Business", level: 300, credits: 3, instructor: "Prof. Marcus Lee", days: "Thu", time: "18:00–21:00", seats: 30, enrolled: 9, description: "From idea to venture: business models, funding, pitching and growth." },
  { id: "PHYS150", title: "Physics I: Mechanics", dept: "Physics", level: 100, credits: 4, instructor: "Dr. Ingrid Larsen", days: "Mon/Wed/Fri", time: "12:00–13:00", seats: 50, enrolled: 41, description: "Kinematics, Newton's laws, energy, momentum and rotational motion." }
];

const DEPT_COLORS = {
  "Computer Science": "#6c5ce7",
  "Mathematics": "#0984e3",
  "Biology": "#00b894",
  "Psychology": "#e84393",
  "Art & Design": "#fd9644",
  "Business": "#e17055",
  "Physics": "#00a8b5"
};

const DEFAULT_STUDENT = {
  name: "Jordan Taylor",
  studentId: "S2026-0147",
  email: "jordan.taylor@university.edu",
  major: "Computer Science",
  year: "Sophomore",
  advisor: "Dr. Priya Nair"
};

const MAX_CREDITS = 18;
