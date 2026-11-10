/* Sample data for the Northfield University course registration demo.
   There is no backend: everything lives in this file and in localStorage. */
window.UCR_DATA = {
  term: "Spring 2027",
  maxCredits: 18,

  departments: [
    { id: "CS",   name: "Computer Science", color: "#1d4ed8", tint: "#dbeafe" },
    { id: "MATH", name: "Mathematics",      color: "#7e22ce", tint: "#f3e8ff" },
    { id: "BIO",  name: "Biology",          color: "#15803d", tint: "#dcfce7" },
    { id: "HIST", name: "History",          color: "#b45309", tint: "#fef3c7" },
    { id: "ART",  name: "Art & Design",     color: "#be185d", tint: "#fce7f3" },
    { id: "PSYC", name: "Psychology",       color: "#0f766e", tint: "#ccfbf1" },
    { id: "MUS",  name: "Music",            color: "#c2410c", tint: "#ffedd5" },
    { id: "ECON", name: "Economics",        color: "#4338ca", tint: "#e0e7ff" }
  ],

  levels: ["Introductory", "Intermediate", "Advanced"],

  majors: [
    "Undeclared", "Computer Science", "Mathematics", "Biology", "History",
    "Art & Design", "Psychology", "Music", "Economics"
  ],

  courses: [
    { id: "CS101", code: "CS 101", dept: "CS", title: "Introduction to Programming", credits: 4, level: "Introductory",
      instructor: "Dr. Amara Okafor", days: ["Mon", "Wed", "Fri"], start: "09:00", end: "09:50", room: "Turing Hall 110",
      seats: 40, enrolled: 31, description: "Learn to think like a programmer using Python: variables, loops, functions and simple data structures." },
    { id: "CS220", code: "CS 220", dept: "CS", title: "Data Structures", credits: 4, level: "Intermediate",
      instructor: "Prof. Lin Wei", days: ["Tue", "Thu"], start: "10:30", end: "11:45", room: "Turing Hall 204",
      seats: 35, enrolled: 35, description: "Lists, trees, hash tables and graphs, with an emphasis on choosing the right structure for the job." },
    { id: "CS340", code: "CS 340", dept: "CS", title: "Accessible Web Development", credits: 3, level: "Advanced",
      instructor: "Dr. Sofia Reyes", days: ["Mon", "Wed"], start: "13:00", end: "14:15", room: "Turing Hall 301",
      seats: 25, enrolled: 18, description: "Build inclusive websites with semantic HTML, CSS and JavaScript, and test them with assistive technologies." },
    { id: "MATH120", code: "MATH 120", dept: "MATH", title: "Calculus I", credits: 4, level: "Introductory",
      instructor: "Prof. Daniel Kim", days: ["Mon", "Wed", "Fri"], start: "10:00", end: "10:50", room: "Euler Building 101",
      seats: 50, enrolled: 42, description: "Limits, derivatives and integrals, with applications to motion, growth and optimization." },
    { id: "MATH250", code: "MATH 250", dept: "MATH", title: "Linear Algebra", credits: 3, level: "Intermediate",
      instructor: "Dr. Priya Nair", days: ["Tue", "Thu"], start: "09:00", end: "10:15", room: "Euler Building 210",
      seats: 30, enrolled: 21, description: "Vectors, matrices, linear transformations and eigenvalues, with applications in data science." },
    { id: "BIO110", code: "BIO 110", dept: "BIO", title: "Principles of Biology", credits: 4, level: "Introductory",
      instructor: "Dr. Grace Mensah", days: ["Tue", "Thu"], start: "13:00", end: "14:15", room: "Darwin Center 120",
      seats: 60, enrolled: 47, description: "Cells, genetics, evolution and ecosystems. Includes a weekly hands-on lab section." },
    { id: "BIO305", code: "BIO 305", dept: "BIO", title: "Marine Ecology", credits: 3, level: "Advanced",
      instructor: "Prof. Mateo Silva", days: ["Fri"], start: "13:00", end: "15:50", room: "Darwin Center 015",
      seats: 20, enrolled: 14, description: "Explore coastal and ocean ecosystems through field trips, data collection and research projects." },
    { id: "HIST105", code: "HIST 105", dept: "HIST", title: "World History Since 1500", credits: 3, level: "Introductory",
      instructor: "Dr. Hannah Becker", days: ["Mon", "Wed"], start: "11:00", end: "12:15", room: "Heritage Hall 140",
      seats: 45, enrolled: 30, description: "Global connections, empires, revolutions and the making of the modern world." },
    { id: "HIST210", code: "HIST 210", dept: "HIST", title: "History of Science and Technology", credits: 3, level: "Intermediate",
      instructor: "Prof. Omar Haddad", days: ["Tue", "Thu"], start: "15:00", end: "16:15", room: "Heritage Hall 220",
      seats: 30, enrolled: 19, description: "From the printing press to the internet: how inventions shaped societies, and how societies shaped inventions." },
    { id: "ART101", code: "ART 101", dept: "ART", title: "Foundations of Drawing", credits: 3, level: "Introductory",
      instructor: "Prof. Yuki Tanaka", days: ["Tue", "Thu"], start: "09:00", end: "10:15", room: "Studio Arts 2",
      seats: 18, enrolled: 12, description: "Observation, line, value and composition. Materials are provided in the studio." },
    { id: "ART230", code: "ART 230", dept: "ART", title: "Color Theory and Practice", credits: 3, level: "Intermediate",
      instructor: "Dr. Lucia Moretti", days: ["Wed"], start: "14:00", end: "16:50", room: "Studio Arts 4",
      seats: 16, enrolled: 16, description: "How color works physically, perceptually and culturally, explored through painting and digital media." },
    { id: "PSYC100", code: "PSYC 100", dept: "PSYC", title: "Introduction to Psychology", credits: 3, level: "Introductory",
      instructor: "Dr. Kwame Asante", days: ["Mon", "Wed", "Fri"], start: "12:00", end: "12:50", room: "Wundt Hall 100",
      seats: 80, enrolled: 66, description: "Survey of the science of mind and behavior: perception, memory, learning, emotion and development." },
    { id: "PSYC320", code: "PSYC 320", dept: "PSYC", title: "Cognitive Neuroscience", credits: 4, level: "Advanced",
      instructor: "Prof. Elena Petrova", days: ["Tue", "Thu"], start: "10:30", end: "11:45", room: "Wundt Hall 310",
      seats: 28, enrolled: 20, description: "How the brain supports attention, language, memory and decision-making, using imaging and lesion studies." },
    { id: "MUS115", code: "MUS 115", dept: "MUS", title: "Music Theory I", credits: 3, level: "Introductory",
      instructor: "Prof. Ravi Shankar Iyer", days: ["Mon", "Wed"], start: "14:30", end: "15:45", room: "Harmony Hall 12",
      seats: 24, enrolled: 15, description: "Notation, scales, intervals, chords and rhythm, with ear-training and keyboard practice." },
    { id: "MUS260", code: "MUS 260", dept: "MUS", title: "World Music Ensemble", credits: 1, level: "Intermediate",
      instructor: "Dr. Ana Lucía Torres", days: ["Fri"], start: "16:00", end: "17:50", room: "Harmony Hall Stage",
      seats: 30, enrolled: 22, description: "Perform music from West Africa, Latin America and Indonesia. No previous experience required." },
    { id: "ECON101", code: "ECON 101", dept: "ECON", title: "Principles of Microeconomics", credits: 3, level: "Introductory",
      instructor: "Prof. Michael O'Brien", days: ["Tue", "Thu"], start: "12:00", end: "13:15", room: "Smith Hall 150",
      seats: 70, enrolled: 58, description: "Supply and demand, markets, consumer choice and the role of government in the economy." },
    { id: "ECON345", code: "ECON 345", dept: "ECON", title: "Behavioral Economics", credits: 3, level: "Advanced",
      instructor: "Dr. Fatima Zahra", days: ["Mon", "Wed"], start: "16:00", end: "17:15", room: "Smith Hall 305",
      seats: 25, enrolled: 23, description: "Why people do not always act rationally, and what that means for markets, policy and everyday decisions." }
  ],

  defaultProfile: {
    fullName: "Jordan Rivera",
    studentId: "S2041587",
    email: "jordan.rivera@northfield.edu",
    major: "Computer Science",
    year: "2",
    advisor: "Dr. Sofia Reyes"
  },

  // Courses the sample student is registered for on first visit.
  defaultRegistrations: ["MATH120", "HIST210"]
};
