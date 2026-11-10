/* Sample data and shared storage helpers for the course registration app. */
"use strict";

const DEPARTMENTS = {
  CSE: { name: "Computer Science", color: "#1d4ed8" },
  MATH: { name: "Mathematics", color: "#7e22ce" },
  BIO: { name: "Biology", color: "#15803d" },
  ENG: { name: "English", color: "#be123c" },
  HIST: { name: "History", color: "#b45309" },
  PHYS: { name: "Physics", color: "#0f766e" },
  ART: { name: "Art and Design", color: "#a21caf" },
  ECON: { name: "Economics", color: "#4338ca" }
};

const DAY_NAMES = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };

/* start/end are minutes after midnight. */
const COURSES = [
  { id: "CSE 114", dept: "CSE", level: 100, title: "Introduction to Programming", credits: 4, instructor: "Dr. Ana Reyes", days: ["Mon", "Wed"], start: 600, end: 680, room: "Engineering 101", capacity: 40, enrolled: 31, description: "Learn to write programs in Python: variables, loops, functions and simple data structures." },
  { id: "CSE 216", dept: "CSE", level: 200, title: "Software Engineering", credits: 4, instructor: "Dr. Kwame Mensah", days: ["Tue", "Thu"], start: 780, end: 860, room: "Engineering 220", capacity: 35, enrolled: 35, description: "Design, test and maintain software in teams, with version control and code review." },
  { id: "CSE 310", dept: "CSE", level: 300, title: "Web Accessibility", credits: 3, instructor: "Prof. Lin Zhao", days: ["Fri"], start: 540, end: 710, room: "Library Lab 2", capacity: 25, enrolled: 22, description: "Build websites that everyone can use. Covers WCAG, assistive technology and inclusive design." },
  { id: "MATH 125", dept: "MATH", level: 100, title: "Calculus I", credits: 4, instructor: "Dr. Priya Nair", days: ["Mon", "Wed", "Fri"], start: 480, end: 530, room: "Science Hall 12", capacity: 60, enrolled: 41, description: "Limits, derivatives and an introduction to integrals, with applications." },
  { id: "MATH 221", dept: "MATH", level: 200, title: "Linear Algebra", credits: 3, instructor: "Dr. Tomás García", days: ["Tue", "Thu"], start: 600, end: 680, room: "Science Hall 30", capacity: 45, enrolled: 44, description: "Vectors, matrices, linear transformations, eigenvalues and their uses." },
  { id: "BIO 101", dept: "BIO", level: 100, title: "Principles of Biology", credits: 4, instructor: "Dr. Grace Okafor", days: ["Mon", "Wed"], start: 780, end: 860, room: "Life Sciences 5", capacity: 80, enrolled: 52, description: "Cells, genetics, evolution and ecology, with a weekly lab." },
  { id: "BIO 240", dept: "BIO", level: 200, title: "Marine Ecology", credits: 3, instructor: "Dr. Sven Larsen", days: ["Thu"], start: 840, end: 1010, room: "Life Sciences 40", capacity: 20, enrolled: 20, description: "Life in oceans and coasts, with two field trips to the bay." },
  { id: "ENG 102", dept: "ENG", level: 100, title: "Academic Writing", credits: 3, instructor: "Prof. Maya Cohen", days: ["Tue", "Thu"], start: 540, end: 590, room: "Humanities 8", capacity: 25, enrolled: 12, description: "Plan, draft and revise clear essays that use evidence well." },
  { id: "ENG 230", dept: "ENG", level: 200, title: "World Literature", credits: 3, instructor: "Dr. Hiro Tanaka", days: ["Mon", "Wed"], start: 900, end: 980, room: "Humanities 21", capacity: 30, enrolled: 26, description: "Read novels, poems and plays from six continents in translation." },
  { id: "HIST 150", dept: "HIST", level: 100, title: "Modern World History", credits: 3, instructor: "Dr. Fatima Haddad", days: ["Mon", "Wed", "Fri"], start: 660, end: 710, room: "Humanities 2", capacity: 70, enrolled: 39, description: "Major events and ideas that shaped the world since 1750." },
  { id: "HIST 320", dept: "HIST", level: 300, title: "History of Science", credits: 3, instructor: "Prof. Daniel Brooks", days: ["Tue"], start: 1080, end: 1250, room: "Humanities 30", capacity: 20, enrolled: 17, description: "How scientific ideas developed, from ancient astronomy to genetics." },
  { id: "PHYS 151", dept: "PHYS", level: 100, title: "Physics I: Mechanics", credits: 4, instructor: "Dr. Olga Petrova", days: ["Tue", "Thu"], start: 690, end: 770, room: "Physics 100", capacity: 50, enrolled: 47, description: "Motion, forces, energy and momentum, with hands-on labs." },
  { id: "PHYS 305", dept: "PHYS", level: 300, title: "Astrophysics", credits: 3, instructor: "Dr. Samuel Adeyemi", days: ["Wed"], start: 1080, end: 1250, room: "Observatory", capacity: 18, enrolled: 9, description: "Stars, galaxies and cosmology. Includes evening telescope sessions." },
  { id: "ART 110", dept: "ART", level: 100, title: "Drawing Fundamentals", credits: 3, instructor: "Prof. Lucia Romano", days: ["Fri"], start: 780, end: 950, room: "Arts Studio A", capacity: 18, enrolled: 18, description: "Line, shape, value and perspective, drawn from life." },
  { id: "ART 215", dept: "ART", level: 200, title: "Digital Illustration", credits: 3, instructor: "Prof. Jae Park", days: ["Tue", "Thu"], start: 900, end: 980, room: "Arts Lab 3", capacity: 22, enrolled: 15, description: "Create illustrations with tablets and vector tools, from sketch to final piece." },
  { id: "ECON 101", dept: "ECON", level: 100, title: "Principles of Microeconomics", credits: 3, instructor: "Dr. Elena Popescu", days: ["Mon", "Wed"], start: 540, end: 590, room: "Business 10", capacity: 90, enrolled: 63, description: "How people and firms make choices: supply, demand, markets and prices." },
  { id: "ECON 340", dept: "ECON", level: 300, title: "Behavioral Economics", credits: 3, instructor: "Dr. Ravi Shah", days: ["Thu"], start: 1080, end: 1250, room: "Business 40", capacity: 30, enrolled: 27, description: "Why real decisions differ from theory: biases, habits and nudges." }
];

const MAX_CREDITS = 18;

const DEFAULT_PROFILE = {
  name: "Jordan Lee",
  email: "jordan.lee@example.edu",
  studentId: "20241234",
  major: "CSE",
  year: "2"
};

const DEFAULT_REGISTRATIONS = [
  { id: "MATH 125", term: "Spring 2027" },
  { id: "ENG 102", term: "Spring 2027" }
];

/* In-memory copy, so the app still works for this page view when localStorage is unavailable. */
const memoryStore = {};

const Store = {
  read(key, fallback) {
    if (Object.prototype.hasOwnProperty.call(memoryStore, key)) return JSON.parse(memoryStore[key]);
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  write(key, value) {
    memoryStore[key] = JSON.stringify(value);
    try {
      window.localStorage.setItem(key, memoryStore[key]);
    } catch (e) {
      /* Storage can be unavailable (private mode or file restrictions). The memory copy is used instead. */
    }
  },
  getProfile() {
    return Object.assign({}, DEFAULT_PROFILE, this.read("ucr-profile", {}));
  },
  saveProfile(profile) {
    this.write("ucr-profile", profile);
  },
  getRegistrations() {
    return this.read("ucr-registrations", DEFAULT_REGISTRATIONS).filter(function (r) {
      return findCourse(r.id);
    });
  },
  saveRegistrations(list) {
    this.write("ucr-registrations", list);
  }
};

function findCourse(id) {
  return COURSES.find(function (c) { return c.id === id; }) || null;
}

function seatsLeft(course) {
  return Math.max(0, course.capacity - course.enrolled);
}

/* Returns "open", "few" or "full". */
function availability(course) {
  const left = seatsLeft(course);
  if (left === 0) return "full";
  if (left <= 5) return "few";
  return "open";
}

const AVAILABILITY_TEXT = { open: "Open", few: "Few seats left", full: "Full" };
const AVAILABILITY_ICON = { open: "✓", few: "!", full: "✕" };

function formatTime(minutes) {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = ((h24 + 11) % 12) + 1;
  return h12 + ":" + String(m).padStart(2, "0") + " " + suffix;
}

function formatSchedule(course) {
  return course.days.join(", ") + " " + formatTime(course.start) + "–" + formatTime(course.end);
}

function formatScheduleLong(course) {
  return course.days.map(function (d) { return DAY_NAMES[d]; }).join(", ") +
    ", " + formatTime(course.start) + " to " + formatTime(course.end);
}

function coursesOverlap(a, b) {
  const sharedDay = a.days.some(function (d) { return b.days.indexOf(d) !== -1; });
  return sharedDay && a.start < b.end && b.start < a.end;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function (ch) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}
