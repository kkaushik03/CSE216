/* Sample data for the Northbridge University course registration demo. No backend. */
(function () {
  "use strict";

  var NB = (window.NB = window.NB || {});

  NB.TERM = "Spring 2027";
  NB.CREDIT_LIMIT = 18;

  NB.departments = [
    { id: "CSE", name: "Computer Science" },
    { id: "MATH", name: "Mathematics" },
    { id: "BIO", name: "Biology" },
    { id: "ART", name: "Art and Design" },
    { id: "HIST", name: "History" },
    { id: "PSY", name: "Psychology" },
    { id: "MUS", name: "Music" }
  ];

  NB.levels = [
    { id: "100", name: "100-level (introductory)" },
    { id: "200", name: "200-level (intermediate)" },
    { id: "300", name: "300-level (advanced)" },
    { id: "400", name: "400-level (senior)" }
  ];

  NB.courses = [
    { id: "CSE101", code: "CSE 101", title: "Introduction to Programming", dept: "CSE", level: "100", credits: 4,
      instructor: "Dr. Priya Raman", days: ["Mon", "Wed"], start: "09:00", end: "10:15", room: "Tech Hall 101",
      capacity: 40, enrolled: 31,
      description: "Learn to solve problems with code. Variables, loops, functions and debugging in JavaScript." },
    { id: "CSE216", code: "CSE 216", title: "Data Structures", dept: "CSE", level: "200", credits: 4,
      instructor: "Dr. Marcus Chen", days: ["Tue", "Thu"], start: "10:30", end: "11:45", room: "Tech Hall 204",
      capacity: 35, enrolled: 32,
      description: "Lists, stacks, queues, trees, hash tables and graphs, with analysis of their running time." },
    { id: "CSE340", code: "CSE 340", title: "Web Accessibility and Design", dept: "CSE", level: "300", credits: 3,
      instructor: "Prof. Elena Torres", days: ["Mon", "Wed"], start: "13:00", end: "14:15", room: "Tech Hall 310",
      capacity: 30, enrolled: 30,
      description: "Build inclusive websites. Semantic HTML, ARIA, keyboard support and testing with assistive technology." },
    { id: "CSE452", code: "CSE 452", title: "Machine Learning", dept: "CSE", level: "400", credits: 3,
      instructor: "Dr. Samuel Okafor", days: ["Tue", "Thu"], start: "14:00", end: "15:15", room: "Tech Hall 120",
      capacity: 25, enrolled: 18,
      description: "Regression, classification, neural networks and the ethics of automated decisions." },
    { id: "MATH121", code: "MATH 121", title: "Calculus I", dept: "MATH", level: "100", credits: 4,
      instructor: "Dr. Hannah Weiss", days: ["Mon", "Wed", "Fri"], start: "10:30", end: "11:20", room: "Science Center 120",
      capacity: 50, enrolled: 44,
      description: "Limits, derivatives and integrals, with applications to motion, growth and optimization." },
    { id: "MATH221", code: "MATH 221", title: "Linear Algebra", dept: "MATH", level: "200", credits: 3,
      instructor: "Dr. Luis Ortega", days: ["Tue", "Thu"], start: "09:00", end: "10:15", room: "Science Center 215",
      capacity: 40, enrolled: 22,
      description: "Vectors, matrices, linear transformations, eigenvalues and their use in data science." },
    { id: "MATH310", code: "MATH 310", title: "Probability and Statistics", dept: "MATH", level: "300", credits: 3,
      instructor: "Dr. Aisha Bello", days: ["Mon", "Wed"], start: "15:00", end: "16:15", room: "Science Center 230",
      capacity: 35, enrolled: 35,
      description: "Random variables, distributions, estimation and hypothesis testing." },
    { id: "BIO110", code: "BIO 110", title: "Principles of Biology", dept: "BIO", level: "100", credits: 4,
      instructor: "Dr. Grace Kim", days: ["Tue", "Thu"], start: "10:30", end: "11:45", room: "Life Sciences 140",
      capacity: 60, enrolled: 41,
      description: "Cells, genetics, evolution and ecosystems, with a weekly hands-on lab." },
    { id: "BIO305", code: "BIO 305", title: "Genetics", dept: "BIO", level: "300", credits: 3,
      instructor: "Dr. Omar Haddad", days: ["Mon", "Wed"], start: "09:00", end: "10:15", room: "Life Sciences 210",
      capacity: 30, enrolled: 27,
      description: "Inheritance, gene expression, genomics and genetic engineering." },
    { id: "ART105", code: "ART 105", title: "Drawing Foundations", dept: "ART", level: "100", credits: 3,
      instructor: "Prof. Mei Lin", days: ["Fri"], start: "13:00", end: "15:45", room: "Arts Building 12",
      capacity: 20, enrolled: 14,
      description: "Line, shape, value and perspective. Draw from observation in pencil, charcoal and ink." },
    { id: "ART230", code: "ART 230", title: "Digital Illustration", dept: "ART", level: "200", credits: 3,
      instructor: "Prof. Diego Alvarez", days: ["Tue", "Thu"], start: "15:30", end: "16:45", room: "Arts Building 30",
      capacity: 20, enrolled: 20,
      description: "Create illustrations with vector and raster tools, from sketch to finished piece." },
    { id: "HIST150", code: "HIST 150", title: "World History Since 1500", dept: "HIST", level: "100", credits: 3,
      instructor: "Dr. Ruth Abernathy", days: ["Mon", "Wed", "Fri"], start: "11:30", end: "12:20", room: "Founders Hall 5",
      capacity: 80, enrolled: 52,
      description: "Empires, revolutions and globalization from the early modern period to today." },
    { id: "HIST340", code: "HIST 340", title: "History of Science and Technology", dept: "HIST", level: "300", credits: 3,
      instructor: "Dr. Kwame Mensah", days: ["Tue"], start: "18:00", end: "20:45", room: "Founders Hall 22",
      capacity: 30, enrolled: 26,
      description: "How scientific ideas and inventions shaped societies, from the printing press to the internet." },
    { id: "PSY101", code: "PSY 101", title: "Introduction to Psychology", dept: "PSY", level: "100", credits: 3,
      instructor: "Dr. Laura Novak", days: ["Mon", "Wed"], start: "13:00", end: "14:15", room: "Commons Auditorium",
      capacity: 100, enrolled: 77,
      description: "Perception, memory, learning, emotion, development and mental health." },
    { id: "PSY320", code: "PSY 320", title: "Cognitive Psychology", dept: "PSY", level: "300", credits: 3,
      instructor: "Dr. Ben Adeyemi", days: ["Tue", "Thu"], start: "12:00", end: "13:15", room: "Commons 214",
      capacity: 35, enrolled: 20,
      description: "Attention, language, problem solving and decision making, with classic experiments." },
    { id: "MUS120", code: "MUS 120", title: "Music Theory I", dept: "MUS", level: "100", credits: 2,
      instructor: "Prof. Sofia Rossi", days: ["Mon", "Wed"], start: "16:30", end: "17:20", room: "Music Hall 3",
      capacity: 25, enrolled: 19,
      description: "Scales, intervals, chords and rhythm. Read and write music notation." },
    { id: "MUS210", code: "MUS 210", title: "University Chorus", dept: "MUS", level: "200", credits: 1,
      instructor: "Prof. Isaac Park", days: ["Thu"], start: "18:00", end: "19:50", room: "Music Hall Stage",
      capacity: 60, enrolled: 34,
      description: "Rehearse and perform choral works from many traditions. No audition required." }
  ];

  NB.defaultProfile = {
    name: "Jordan Lee",
    email: "jordan.lee@northbridge.example",
    studentId: "20231234",
    phone: "",
    program: "Computer Science",
    year: "Second year"
  };

  NB.defaultRegistered = [
    { id: "MATH221", grading: "Letter grade" },
    { id: "ART105", grading: "Letter grade" }
  ];
})();
