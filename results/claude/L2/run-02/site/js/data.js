/* Course catalog data. In a real system this would come from an API. */
"use strict";

const DEPARTMENTS = {
  CS:   { name: "Computer Science", color: "purple" },
  MATH: { name: "Mathematics",      color: "blue" },
  BIO:  { name: "Biology",          color: "green" },
  ART:  { name: "Fine Arts",        color: "pink" },
  HIST: { name: "History",          color: "amber" },
  PSY:  { name: "Psychology",       color: "teal" },
};

const LEVELS = {
  100: "100 – Introductory",
  200: "200 – Intermediate",
  300: "300 – Advanced",
  400: "400 – Senior / Capstone",
};

const TERMS = ["Spring 2027", "Summer 2027", "Fall 2027"];

const MAX_CREDITS = 18;

/* days: array of "Mon" | "Tue" | "Wed" | "Thu" | "Fri"; times are 24h "HH:MM". */
const COURSES = [
  { code: "CS101",   dept: "CS",   level: 100, credits: 3, title: "Introduction to Programming",
    instructor: "Dr. Ada Okafor",     days: ["Mon", "Wed"],        start: "09:00", end: "10:15",
    room: "Tech Hall 120",  capacity: 60, enrolled: 41,
    description: "Learn the fundamentals of programming with Python: variables, control flow, functions, and problem solving." },
  { code: "CS220",   dept: "CS",   level: 200, credits: 4, title: "Data Structures & Algorithms",
    instructor: "Prof. Lin Wei",      days: ["Tue", "Thu"],        start: "10:30", end: "12:00",
    room: "Tech Hall 210",  capacity: 45, enrolled: 45,
    description: "Lists, trees, graphs, hashing and sorting, with an emphasis on analysing efficiency." },
  { code: "CS340",   dept: "CS",   level: 300, credits: 3, title: "Web Accessibility & Design",
    instructor: "Dr. Sam Rivera",     days: ["Mon", "Wed", "Fri"], start: "13:00", end: "13:50",
    room: "Tech Hall 305",  capacity: 30, enrolled: 18,
    description: "Build inclusive web experiences using semantic HTML, ARIA, and WCAG 2.2 guidelines." },
  { code: "CS450",   dept: "CS",   level: 400, credits: 4, title: "Machine Learning Capstone",
    instructor: "Prof. Priya Nair",   days: ["Tue", "Thu"],        start: "14:00", end: "15:30",
    room: "Innovation Lab", capacity: 25, enrolled: 22,
    description: "Design, train, and evaluate a machine-learning system in a semester-long team project." },
  { code: "MATH110", dept: "MATH", level: 100, credits: 4, title: "Calculus I",
    instructor: "Dr. Elena Petrova",  days: ["Mon", "Wed", "Fri"], start: "08:00", end: "08:50",
    room: "Science 101",    capacity: 80, enrolled: 63,
    description: "Limits, derivatives, and integrals with applications to science and engineering." },
  { code: "MATH250", dept: "MATH", level: 200, credits: 3, title: "Linear Algebra",
    instructor: "Prof. Kwame Mensah", days: ["Tue", "Thu"],        start: "09:00", end: "10:15",
    room: "Science 204",    capacity: 50, enrolled: 29,
    description: "Vector spaces, matrices, eigenvalues, and their uses in data science and graphics." },
  { code: "BIO105",  dept: "BIO",  level: 100, credits: 4, title: "Foundations of Biology",
    instructor: "Dr. Maya Thompson",  days: ["Mon", "Wed"],        start: "11:00", end: "12:15",
    room: "Life Sci 110",   capacity: 90, enrolled: 77,
    description: "Cells, genetics, evolution, and ecology, with a weekly hands-on laboratory." },
  { code: "BIO310",  dept: "BIO",  level: 300, credits: 3, title: "Marine Ecology",
    instructor: "Prof. Diego Alvarez", days: ["Fri"],              start: "09:00", end: "11:45",
    room: "Coastal Center", capacity: 20, enrolled: 20,
    description: "Explore ocean ecosystems through field trips, data collection, and research seminars." },
  { code: "ART120",  dept: "ART",  level: 100, credits: 3, title: "Color Theory & Painting",
    instructor: "Prof. Yuki Tanaka",  days: ["Tue", "Thu"],        start: "13:00", end: "14:15",
    room: "Arts Studio B",  capacity: 24, enrolled: 15,
    description: "Discover how color works and apply it in acrylic and watercolor studio projects." },
  { code: "ART330",  dept: "ART",  level: 300, credits: 3, title: "Digital Illustration",
    instructor: "Dr. Noor Haddad",    days: ["Wed"],               start: "15:00", end: "17:45",
    room: "Media Lab",      capacity: 20, enrolled: 9,
    description: "Create vector and raster illustrations for print, web, and animation." },
  { code: "HIST201", dept: "HIST", level: 200, credits: 3, title: "World History Since 1500",
    instructor: "Dr. James Osei",     days: ["Mon", "Wed"],        start: "14:00", end: "15:15",
    room: "Humanities 230", capacity: 70, enrolled: 38,
    description: "Global connections, empires, revolutions, and the making of the modern world." },
  { code: "HIST420", dept: "HIST", level: 400, credits: 3, title: "Senior Seminar: Oral Histories",
    instructor: "Prof. Rosa Delgado", days: ["Thu"],               start: "16:00", end: "18:45",
    room: "Humanities 410", capacity: 15, enrolled: 11,
    description: "Conduct, record, and archive interviews that preserve community memory." },
  { code: "PSY100",  dept: "PSY",  level: 100, credits: 3, title: "Introduction to Psychology",
    instructor: "Dr. Hannah Becker",  days: ["Tue", "Thu"],        start: "08:00", end: "09:15",
    room: "Social Sci 100", capacity: 120, enrolled: 96,
    description: "Survey of the science of mind and behavior: perception, memory, emotion, and more." },
  { code: "PSY260",  dept: "PSY",  level: 200, credits: 4, title: "Research Methods & Statistics",
    instructor: "Prof. Omar Farouk",  days: ["Mon", "Wed", "Fri"], start: "10:00", end: "10:50",
    room: "Social Sci 215", capacity: 40, enrolled: 33,
    description: "Design experiments, analyse data, and report findings using APA style." },
];
