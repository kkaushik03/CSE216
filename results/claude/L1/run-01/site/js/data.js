// Sample course data (no backend).
const COURSES = [
  { id: "CS101", title: "Introduction to Programming", dept: "Computer Science", level: "100", credits: 4, instructor: "Dr. Ada Kim", schedule: "Mon/Wed 9:00–10:30", seats: 40, enrolled: 32, description: "Learn the fundamentals of programming using Python: variables, control flow, functions and data structures." },
  { id: "CS220", title: "Data Structures & Algorithms", dept: "Computer Science", level: "200", credits: 4, instructor: "Prof. Alan Reyes", schedule: "Tue/Thu 11:00–12:30", seats: 35, enrolled: 35, description: "Lists, trees, graphs, hashing, sorting and algorithm analysis with hands-on projects." },
  { id: "CS340", title: "Web Development", dept: "Computer Science", level: "300", credits: 3, instructor: "Dr. Grace Liu", schedule: "Mon/Wed 13:00–14:30", seats: 30, enrolled: 18, description: "Build modern responsive web applications with HTML, CSS, JavaScript and REST APIs." },
  { id: "CS410", title: "Machine Learning", dept: "Computer Science", level: "400", credits: 3, instructor: "Prof. Yann Okafor", schedule: "Tue/Thu 14:00–15:30", seats: 25, enrolled: 21, description: "Supervised and unsupervised learning, neural networks, and model evaluation." },
  { id: "MATH110", title: "Calculus I", dept: "Mathematics", level: "100", credits: 4, instructor: "Dr. Emmy Noor", schedule: "Mon/Wed/Fri 8:00–9:00", seats: 60, enrolled: 44, description: "Limits, derivatives, and integrals with applications to science and engineering." },
  { id: "MATH210", title: "Linear Algebra", dept: "Mathematics", level: "200", credits: 3, instructor: "Prof. Carl Fischer", schedule: "Tue/Thu 9:30–11:00", seats: 45, enrolled: 30, description: "Vectors, matrices, linear transformations, eigenvalues and applications." },
  { id: "MATH305", title: "Probability & Statistics", dept: "Mathematics", level: "300", credits: 3, instructor: "Dr. Florence Ng", schedule: "Mon/Wed 15:00–16:30", seats: 40, enrolled: 27, description: "Probability theory, random variables, distributions and statistical inference." },
  { id: "PHYS101", title: "General Physics I", dept: "Physics", level: "100", credits: 4, instructor: "Dr. Isaac Mendes", schedule: "Tue/Thu 8:00–9:30", seats: 50, enrolled: 38, description: "Mechanics, energy, momentum, and waves with weekly laboratory sessions." },
  { id: "PHYS330", title: "Quantum Mechanics", dept: "Physics", level: "300", credits: 3, instructor: "Prof. Lise Bohr", schedule: "Mon/Wed 10:30–12:00", seats: 20, enrolled: 12, description: "Wave functions, the Schrödinger equation, and introductory quantum systems." },
  { id: "BIO120", title: "Cell Biology", dept: "Biology", level: "100", credits: 4, instructor: "Dr. Rosalind Park", schedule: "Mon/Wed/Fri 11:00–12:00", seats: 55, enrolled: 50, description: "Structure and function of cells, membranes, organelles and cell division." },
  { id: "BIO260", title: "Genetics", dept: "Biology", level: "200", credits: 3, instructor: "Prof. Gregor Diaz", schedule: "Tue/Thu 13:00–14:30", seats: 40, enrolled: 40, description: "Mendelian and molecular genetics, gene expression, and genomics." },
  { id: "ENG105", title: "Academic Writing", dept: "English", level: "100", credits: 3, instructor: "Dr. Toni Walker", schedule: "Mon/Wed 12:00–13:00", seats: 25, enrolled: 15, description: "Develop clear, persuasive academic writing through drafting and peer review." },
  { id: "ENG315", title: "Modern World Literature", dept: "English", level: "300", credits: 3, instructor: "Prof. Chinua Hart", schedule: "Tue/Thu 15:30–17:00", seats: 30, enrolled: 22, description: "Explore 20th and 21st century literature from around the globe." },
  { id: "ART140", title: "Digital Illustration", dept: "Art & Design", level: "100", credits: 3, instructor: "Ms. Frida Lopez", schedule: "Fri 13:00–16:00", seats: 20, enrolled: 9, description: "Create expressive illustrations using digital tools, color theory and composition." },
  { id: "ART350", title: "UX & Interaction Design", dept: "Art & Design", level: "300", credits: 3, instructor: "Dr. Don Norris", schedule: "Tue/Thu 10:00–11:30", seats: 25, enrolled: 19, description: "User research, prototyping, usability testing, and interaction patterns." },
  { id: "BUS200", title: "Principles of Marketing", dept: "Business", level: "200", credits: 3, instructor: "Prof. Philip Kotlar", schedule: "Mon/Wed 16:30–18:00", seats: 50, enrolled: 41, description: "Market research, branding, consumer behavior, and marketing strategy." },
];

const DEPT_COLORS = {
  "Computer Science": "#6c5ce7",
  "Mathematics": "#0984e3",
  "Physics": "#00b894",
  "Biology": "#e17055",
  "English": "#e84393",
  "Art & Design": "#fd9644",
  "Business": "#00a8a8",
};

const DEFAULT_STUDENT = {
  name: "Jordan Rivera",
  studentId: "S2026-0417",
  email: "jordan.rivera@university.edu",
  major: "Computer Science",
  year: "Sophomore",
  advisor: "Dr. Grace Liu",
};

const MAX_CREDITS = 18;
