/* Sample course data for the Horizon University registration system. */
window.COURSES = [
  { id: "CS101", code: "CS 101", title: "Introduction to Programming", dept: "Computer Science", level: "100", credits: 4, instructor: "Dr. Ada Okafor", days: "Mon, Wed, Fri", time: "9:00–9:50 AM", room: "Tech Hall 120", capacity: 40, enrolled: 31, description: "Learn the fundamentals of programming with JavaScript: variables, control flow, functions and problem solving." },
  { id: "CS220", code: "CS 220", title: "Data Structures", dept: "Computer Science", level: "200", credits: 4, instructor: "Prof. Lin Wei", days: "Tue, Thu", time: "10:30–11:45 AM", room: "Tech Hall 204", capacity: 35, enrolled: 35, description: "Lists, stacks, queues, trees, hash tables and graphs, with an emphasis on algorithmic efficiency." },
  { id: "CS340", code: "CS 340", title: "Web Accessibility & Design", dept: "Computer Science", level: "300", credits: 3, instructor: "Dr. Sam Rivera", days: "Mon, Wed", time: "1:00–2:15 PM", room: "Tech Hall 310", capacity: 30, enrolled: 18, description: "Build inclusive web interfaces using semantic HTML, ARIA, WCAG guidelines and assistive technology testing." },
  { id: "MATH150", code: "MATH 150", title: "Calculus I", dept: "Mathematics", level: "100", credits: 4, instructor: "Dr. Priya Nair", days: "Mon, Tue, Wed, Thu", time: "8:00–8:50 AM", room: "Euler Building 101", capacity: 50, enrolled: 44, description: "Limits, derivatives, and integrals of single-variable functions with applications." },
  { id: "MATH210", code: "MATH 210", title: "Linear Algebra", dept: "Mathematics", level: "200", credits: 3, instructor: "Prof. Jonas Berg", days: "Tue, Thu", time: "1:00–2:15 PM", room: "Euler Building 215", capacity: 40, enrolled: 22, description: "Vector spaces, matrices, determinants, eigenvalues and their applications to data science." },
  { id: "MATH330", code: "MATH 330", title: "Probability & Statistics", dept: "Mathematics", level: "300", credits: 3, instructor: "Dr. Elena Rossi", days: "Mon, Wed, Fri", time: "11:00–11:50 AM", room: "Euler Building 302", capacity: 35, enrolled: 29, description: "Random variables, distributions, estimation and hypothesis testing." },
  { id: "BIO110", code: "BIO 110", title: "Principles of Biology", dept: "Biology", level: "100", credits: 4, instructor: "Dr. Kwame Mensah", days: "Tue, Thu", time: "9:00–10:15 AM", room: "Life Sciences 140", capacity: 60, enrolled: 52, description: "Cell biology, genetics, evolution and ecology, with weekly laboratory sessions." },
  { id: "BIO305", code: "BIO 305", title: "Marine Ecology", dept: "Biology", level: "300", credits: 3, instructor: "Prof. Hana Sato", days: "Wed", time: "2:00–4:45 PM", room: "Life Sciences 220", capacity: 20, enrolled: 20, description: "Ocean ecosystems, coral reefs and conservation, including two coastal field trips." },
  { id: "ART120", code: "ART 120", title: "Color Theory & Design", dept: "Art & Design", level: "100", credits: 3, instructor: "Prof. Maya Lopez", days: "Mon, Wed", time: "3:00–4:15 PM", room: "Studio Arts 12", capacity: 25, enrolled: 14, description: "Explore how color works through hands-on studio projects in paint, paper and digital media." },
  { id: "ART260", code: "ART 260", title: "Digital Illustration", dept: "Art & Design", level: "200", credits: 3, instructor: "Prof. Theo Grant", days: "Tue, Thu", time: "3:00–4:15 PM", room: "Studio Arts 30", capacity: 22, enrolled: 9, description: "Create illustrations using vector and raster tools, building a portfolio of finished work." },
  { id: "HIST101", code: "HIST 101", title: "World History to 1500", dept: "History", level: "100", credits: 3, instructor: "Dr. Omar Haddad", days: "Mon, Wed, Fri", time: "10:00–10:50 AM", room: "Humanities 105", capacity: 80, enrolled: 61, description: "A survey of civilizations from antiquity to the early modern era across every continent." },
  { id: "HIST350", code: "HIST 350", title: "History of Science", dept: "History", level: "300", credits: 3, instructor: "Prof. Clara Dubois", days: "Thu", time: "6:00–8:45 PM", room: "Humanities 230", capacity: 30, enrolled: 12, description: "How scientific ideas developed and shaped society, from Galileo to the space age." },
  { id: "PSY100", code: "PSY 100", title: "Introduction to Psychology", dept: "Psychology", level: "100", credits: 3, instructor: "Dr. Grace Kim", days: "Tue, Thu", time: "12:00–1:15 PM", room: "Social Sciences 110", capacity: 100, enrolled: 87, description: "Perception, memory, learning, development and mental health: the science of mind and behavior." },
  { id: "PSY240", code: "PSY 240", title: "Cognitive Psychology", dept: "Psychology", level: "200", credits: 3, instructor: "Prof. Diego Santos", days: "Mon, Wed", time: "10:30–11:45 AM", room: "Social Sciences 204", capacity: 40, enrolled: 33, description: "Attention, language, reasoning and decision making, with hands-on experiments." },
  { id: "MUS115", code: "MUS 115", title: "Music Appreciation", dept: "Music", level: "100", credits: 2, instructor: "Prof. Leah Cohen", days: "Fri", time: "1:00–2:50 PM", room: "Concert Hall B", capacity: 45, enrolled: 27, description: "Listen critically to music from many traditions and eras, from Bach to Afrobeat." },
  { id: "MUS420", code: "MUS 420", title: "Composition Seminar", dept: "Music", level: "400", credits: 3, instructor: "Dr. Ravi Shankar", days: "Tue", time: "4:00–6:45 PM", room: "Concert Hall A", capacity: 12, enrolled: 7, description: "Advanced workshop composing original works for small ensembles, ending with a public recital." }
];

/* Department colors (all meet WCAG AA contrast with white text). */
window.DEPT_THEMES = {
  "Computer Science": { color: "#1d4ed8", icon: "💻" },
  "Mathematics": { color: "#6d28d9", icon: "📐" },
  "Biology": { color: "#047857", icon: "🧬" },
  "Art & Design": { color: "#be185d", icon: "🎨" },
  "History": { color: "#b45309", icon: "🏛️" },
  "Psychology": { color: "#0e7490", icon: "🧠" },
  "Music": { color: "#b91c1c", icon: "🎵" }
};

window.DEFAULT_STUDENT = {
  name: "Jordan Lee",
  studentId: "S1234567",
  email: "jordan.lee@horizon.edu",
  program: "Undeclared",
  year: "First year"
};

window.MAX_CREDITS = 18;
