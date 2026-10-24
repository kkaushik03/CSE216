"use strict";

const courses = [
  {
    id: "art-214",
    code: "ART 214",
    title: "The Art of Seeing",
    department: "Art & Design",
    level: 200,
    instructor: "Mara Chen",
    schedule: "Tue / Thu · 10:00 AM",
    credits: 3,
    description: "Look closer at the images, objects, and visual stories that shape the way we see the world."
  },
  {
    id: "bio-150",
    code: "BIO 150",
    title: "Ecology in Our Backyard",
    department: "Life Sciences",
    level: 100,
    instructor: "Dev Patel",
    schedule: "Mon / Wed · 9:30 AM",
    credits: 4,
    description: "Explore the living systems all around us, from campus gardens to the changing climate."
  },
  {
    id: "com-308",
    code: "COM 308",
    title: "Stories That Move Us",
    department: "Communication",
    level: 300,
    instructor: "Avery Brooks",
    schedule: "Tue / Thu · 1:00 PM",
    credits: 3,
    description: "Discover how stories travel across cultures, connect communities, and inspire change."
  },
  {
    id: "cs-125",
    code: "CS 125",
    title: "Creative Coding",
    department: "Computer Science",
    level: 100,
    instructor: "Sam Rivera",
    schedule: "Mon / Wed · 11:00 AM",
    credits: 4,
    description: "Make playful programs and interactive art while learning the building blocks of code."
  },
  {
    id: "eng-241",
    code: "ENG 241",
    title: "Poetry & the Everyday",
    department: "English",
    level: 200,
    instructor: "Nia Williams",
    schedule: "Mon / Wed · 2:00 PM",
    credits: 3,
    description: "Read poems that find the extraordinary in ordinary life, and try writing a few of your own."
  },
  {
    id: "his-332",
    code: "HIS 332",
    title: "Cities Through Time",
    department: "History",
    level: 300,
    instructor: "Leo Martin",
    schedule: "Tue / Thu · 9:00 AM",
    credits: 3,
    description: "Trace how people, ideas, and architecture have shaped the cities we call home."
  },
  {
    id: "psy-180",
    code: "PSY 180",
    title: "The Curious Mind",
    department: "Psychology",
    level: 100,
    instructor: "Elena Torres",
    schedule: "Mon / Wed · 1:00 PM",
    credits: 3,
    description: "A lively introduction to the science of memory, emotion, behavior, and human connection."
  },
  {
    id: "env-420",
    code: "ENV 420",
    title: "Designing a Greener Future",
    department: "Environmental Studies",
    level: 400,
    instructor: "Noah Kim",
    schedule: "Fri · 10:00 AM",
    credits: 3,
    description: "Work together on practical, creative approaches to building more sustainable communities."
  }
];

const storageKey = "northstar-course-registration-v1";
const defaultStudent = { name: "Jordan Davis", email: "jordan.davis@northstar.edu" };
let registrations = [];
let student = { ...defaultStudent };
let pendingCourseId = "";
let lastStorageWarning = "";
const $ = (selector, parent = document) => parent.querySelector(selector);

function announceStorageWarning(message) {
  lastStorageWarning = message;
  const status = $("#form-status");
  if (status) status.textContent = message;
}

function loadData() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (!parsed || !Array.isArray(parsed.registrations)) throw new Error("Saved registration data is invalid.");
    registrations = parsed.registrations.filter((id) => courses.some((course) => course.id === id));
    if (parsed.student && typeof parsed.student.name === "string" && typeof parsed.student.email === "string") {
      student = { name: parsed.student.name, email: parsed.student.email };
    }
  } catch {
    registrations = [];
    student = { ...defaultStudent };
    announceStorageWarning("Saved registration data could not be read. Your current session will still work.");
  }
}

function saveData() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ registrations, student }));
    if (lastStorageWarning) {
      lastStorageWarning = "";
      $("#form-status").textContent = "";
    }
    return true;
  } catch {
    announceStorageWarning("Your changes are active for this session but could not be saved on this device.");
    return false;
  }
}

function getCourse(id) {
  return courses.find((course) => course.id === id);
}

function courseCard(course) {
  const alreadyRegistered = registrations.includes(course.id);
  return `
    <article class="course-card">
      <div class="course-card-top"><span class="department-pill">${course.department}</span><span class="credit-label">${course.credits} credits</span></div>
      <h3>${course.title}</h3>
      <p class="course-code">${course.code}</p>
      <p class="course-description">${course.description}</p>
      <div class="course-meta">
        <span><span aria-hidden="true">◷</span>${course.schedule}</span>
        <span><span aria-hidden="true">◎</span>${course.instructor}</span>
      </div>
      <button class="button button-primary course-select-button" type="button" data-course-id="${course.id}" ${alreadyRegistered ? "disabled" : ""}>
        ${alreadyRegistered ? "Already registered" : "Select this course"} <span aria-hidden="true">${alreadyRegistered ? "✓" : "→"}</span>
      </button>
    </article>`;
}

function renderCatalog() {
  const search = $("#course-search").value.trim().toLowerCase();
  const department = $("#department-filter").value;
  const level = $("#level-filter").value;
  const filtered = courses.filter((course) => {
    const searchable = `${course.code} ${course.title} ${course.department} ${course.instructor} ${course.description}`.toLowerCase();
    return (!search || searchable.includes(search))
      && (department === "all" || course.department === department)
      && (level === "all" || String(course.level) === level);
  });
  $("#catalog-courses").innerHTML = filtered.map(courseCard).join("");
  $("#catalog-results").textContent = `Showing ${filtered.length} of ${courses.length} courses`;
  $("#catalog-count").textContent = String(courses.length);
  $("#catalog-courses").hidden = filtered.length === 0;
  $("#no-courses").hidden = filtered.length !== 0;
  $("#clear-search").hidden = !search;
  $("#featured-courses").innerHTML = courses.slice(0, 3).map(courseCard).join("");
  renderCourseOptions();
}

function renderCourseOptions(selectedId = $("#course-select").value) {
  const select = $("#course-select");
  select.replaceChildren(new Option("Choose a course", ""));
  for (const course of courses) {
    const registered = registrations.includes(course.id);
    const option = new Option(
      `${course.code} — ${course.title}${registered ? " (registered)" : ""}`,
      course.id
    );
    option.disabled = registered;
    select.add(option);
  }
  if (selectedId && [...select.options].some((option) => option.value === selectedId && !option.disabled)) {
    select.value = selectedId;
  }
}

function renderRegistration() {
  const selectedId = $("#course-select").value;
  renderCourseOptions(selectedId);
  const body = $("#registered-table-body");
  body.replaceChildren();
  const enrolled = registrations.map(getCourse).filter(Boolean);
  for (const course of enrolled) {
    const row = document.createElement("tr");
    const courseCell = document.createElement("td");
    courseCell.className = "table-course";
    const title = document.createElement("strong");
    title.textContent = course.title;
    const code = document.createElement("span");
    code.textContent = course.code;
    courseCell.append(title, code);
    row.append(courseCell);
    for (const value of [course.department, course.instructor, course.schedule, String(course.credits)]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    const actionCell = document.createElement("td");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-course";
    remove.dataset.removeCourse = course.id;
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${course.title} from registration`);
    actionCell.append(remove);
    row.append(actionCell);
    body.append(row);
  }
  const credits = enrolled.reduce((total, course) => total + course.credits, 0);
  const count = String(enrolled.length);
  $("#registered-count").textContent = count;
  $("#registered-credits").textContent = String(credits);
  $("#home-course-count").textContent = count;
  $("#home-credit-count").textContent = String(credits);
  $("#profile-course-count").textContent = count;
  $("#profile-credit-count").textContent = String(credits);
  $("#registration-empty").hidden = enrolled.length > 0;
  $("#registered-table-body").parentElement.parentElement.hidden = enrolled.length === 0;
  renderCourseOptions(selectedId);
  renderCatalog();
}

function updateStudentDisplay() {
  const firstName = student.name.trim().split(/\s+/)[0] || "Jordan";
  $("#welcome-name").textContent = firstName;
  $("#student-name").value = student.name;
  $("#registration-email").value = student.email;
  $("#profile-name").textContent = student.name;
  $("#profile-email").textContent = student.email;
  $("#profile-initials").textContent = student.name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "JD";
}

function updateRoute(moveFocus = false) {
  const route = location.hash.slice(1);
  const current = ["home", "catalog", "registration", "profile"].includes(route) ? route : "home";
  for (const view of document.querySelectorAll(".page-view")) view.hidden = view.id !== current;
  for (const link of document.querySelectorAll("[data-nav]")) {
    if (link.dataset.nav === current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  const titles = {
    home: "Course registration",
    catalog: "Course catalog",
    registration: "Registration",
    profile: "Student profile"
  };
  document.title = `${titles[current]} | Northstar University`;
  if (moveFocus) {
    const heading = $(`#${current} h1`);
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  }
  if (current === "registration" && pendingCourseId) {
    renderCourseOptions(pendingCourseId);
    $("#course-select").value = pendingCourseId;
    pendingCourseId = "";
    $("#course-select").focus();
  }
}

function setFieldError(input, message) {
  const error = $(`#${input.id}-error`);
  error.textContent = message;
  error.hidden = !message;
  if (message) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
}

function clearFormErrors() {
  for (const id of ["student-name", "course-select", "registration-email"]) {
    setFieldError($(`#${id}`), "");
  }
}

function showConfirmation(course) {
  $("#confirmation-course").replaceChildren();
  const title = document.createElement("strong");
  title.textContent = `${course.code} · ${course.title}`;
  const details = document.createElement("span");
  details.textContent = `${course.schedule} · ${course.credits} credits`;
  $("#confirmation-course").append(title, details);
  $("#confirmation-dialog").showModal();
}

function handleRegistrationSubmit(event) {
  event.preventDefault();
  clearFormErrors();
  const nameInput = $("#student-name");
  const courseInput = $("#course-select");
  const emailInput = $("#registration-email");
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const course = getCourse(courseInput.value);
  let firstInvalid = null;

  if (!name) {
    setFieldError(nameInput, "Enter your name to register.");
    firstInvalid ||= nameInput;
  }
  if (!course) {
    setFieldError(courseInput, "Choose an available course to register.");
    firstInvalid ||= courseInput;
  } else if (registrations.includes(course.id)) {
    setFieldError(courseInput, "You’re already registered for this course. Choose another one.");
    firstInvalid ||= courseInput;
  }
  if (!email || !emailInput.validity.valid) {
    setFieldError(emailInput, "Enter a valid university email address.");
    firstInvalid ||= emailInput;
  }
  if (firstInvalid) {
    firstInvalid.focus();
    $("#form-status").textContent = "Please correct the highlighted fields and try again.";
    return;
  }

  student = { name, email };
  registrations.push(course.id);
  updateStudentDisplay();
  renderRegistration();
  saveData();
  showConfirmation(course);
}

function setUpDepartments() {
  const select = $("#department-filter");
  for (const department of [...new Set(courses.map((course) => course.department))].sort()) {
    select.add(new Option(department, department));
  }
}

loadData();
setUpDepartments();
updateStudentDisplay();
renderRegistration();
updateRoute();

window.addEventListener("hashchange", () => updateRoute(true));
$("#course-search").addEventListener("input", renderCatalog);
$("#department-filter").addEventListener("change", renderCatalog);
$("#level-filter").addEventListener("change", renderCatalog);
$("#clear-search").addEventListener("click", () => {
  $("#course-search").value = "";
  renderCatalog();
  $("#course-search").focus();
});
$("#reset-filters").addEventListener("click", () => {
  $("#course-search").value = "";
  $("#department-filter").value = "all";
  $("#level-filter").value = "all";
  renderCatalog();
  $("#course-search").focus();
});
$("#registration-form").addEventListener("submit", handleRegistrationSubmit);
$("#registered-table-body").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-course]");
  if (!button) return;
  const course = getCourse(button.dataset.removeCourse);
  registrations = registrations.filter((id) => id !== button.dataset.removeCourse);
  renderRegistration();
  saveData();
  $("#form-status").textContent = `${course ? course.title : "Course"} removed from your schedule.`;
});
document.addEventListener("click", (event) => {
  const button = event.target.closest(".course-select-button");
  if (!button || button.disabled) return;
  pendingCourseId = button.dataset.courseId;
  location.hash = "registration";
  if (location.hash === "#registration") {
    updateRoute();
    $("#course-select").focus();
  }
});
$("#dialog-close").addEventListener("click", () => $("#confirmation-dialog").close());
$("#confirmation-dialog").addEventListener("click", (event) => {
  if (event.target === $("#confirmation-dialog")) $("#confirmation-dialog").close();
});
$("#confirmation-dialog").addEventListener("close", () => {
  $("#form-status").textContent = "Registration confirmed. Your schedule has been updated.";
});
