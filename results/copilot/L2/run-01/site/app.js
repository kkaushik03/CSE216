const courses = [
  { id: "DES-110", title: "Designing for Everyday Life", department: "Design", level: 100, credits: 3, instructor: "Maya Chen", initials: "MC", schedule: "Mon · Wed, 10:00 AM", room: "Studio 204", color: "peach", description: "See the ordinary differently. Learn the fundamentals of thoughtful, human-centered design." },
  { id: "BIO-125", title: "The Secret Life of Plants", department: "Biology", level: 100, credits: 4, instructor: "Theo Brooks", initials: "TB", schedule: "Tue · Thu, 9:30 AM", room: "Life Sciences 118", color: "mint", description: "From forest canopies to your windowsill, discover the wild world growing all around us." },
  { id: "COM-215", title: "Stories That Move Us", department: "Communication", level: 200, credits: 3, instructor: "Aisha Patel", initials: "AP", schedule: "Mon · Wed, 1:00 PM", room: "Arts Center 310", color: "", description: "Explore how stories shape our culture, connect communities, and inspire change." },
  { id: "CSC-240", title: "Creative Coding", department: "Computer Science", level: 200, credits: 4, instructor: "Leo Kim", initials: "LK", schedule: "Tue · Thu, 11:00 AM", room: "Tech Hall 226", color: "mint", description: "Make code your creative medium. Build playful, interactive projects from the ground up." },
  { id: "PSY-301", title: "The Science of Happiness", department: "Psychology", level: 300, credits: 3, instructor: "Nora Williams", initials: "NW", schedule: "Mon · Wed, 2:30 PM", room: "West Hall 115", color: "peach", description: "What does it mean to flourish? Get curious about the research behind a good life." },
  { id: "ENV-330", title: "Cities & Climate Futures", department: "Environmental Studies", level: 300, credits: 3, instructor: "Sam Rivera", initials: "SR", schedule: "Tue · Thu, 1:00 PM", room: "Green Building 102", color: "mint", description: "Imagine more resilient cities and explore the people already making them a reality." },
  { id: "ART-405", title: "The Art of the Archive", department: "Art History", level: 400, credits: 3, instructor: "Imani Clarke", initials: "IC", schedule: "Wed, 9:00 AM", room: "Museum Annex 18", color: "", description: "Every object has a story. Investigate memory, meaning, and the histories we keep." },
  { id: "BUS-210", title: "Good Ideas, Better Business", department: "Business", level: 200, credits: 3, instructor: "Oliver James", initials: "OJ", schedule: "Mon · Wed, 11:00 AM", room: "Commerce 208", color: "peach", description: "Turn a spark of an idea into something that makes a meaningful difference." },
  { id: "MUS-145", title: "Listening to the World", department: "Music", level: 100, credits: 2, instructor: "Elena Rossi", initials: "ER", schedule: "Tue · Thu, 3:00 PM", room: "Music Hall 06", color: "mint", description: "A joyful introduction to music, sound, and the ways we experience both." }
];

const storageKeys = { courses: "campus-selected-courses", profile: "campus-student-profile" };
const defaultProfile = { name: "Jordan Smith", email: "jordan.smith@campus.edu", studentId: "20481572", major: "Design & Communication" };
const byId = (id) => document.getElementById(id);
const pageLinks = [...document.querySelectorAll("[data-route]")];
let selectedCourses = loadCourses();
let profile = loadProfile();
let toastTimer;

function loadCourses() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.courses) || "[]");
    return Array.isArray(saved) ? [...new Set(saved.filter((id) => courses.some((course) => course.id === id)))] : [];
  } catch (error) {
    console.error("Could not read saved course selections.", error);
    return [];
  }
}

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.profile) || "null");
    return saved && typeof saved === "object" ? { ...defaultProfile, ...saved } : { ...defaultProfile };
  } catch (error) {
    console.error("Could not read the saved student profile.", error);
    return { ...defaultProfile };
  }
}

function saveCourses() {
  try {
    localStorage.setItem(storageKeys.courses, JSON.stringify(selectedCourses));
  } catch (error) {
    console.error("Could not save course selections.", error);
    showToast("Your browser couldn't save this update. Please check your storage settings.");
  }
}

function saveProfile() {
  try {
    localStorage.setItem(storageKeys.profile, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error("Could not save the student profile.", error);
    showToast("Your browser couldn't save this update. Please check your storage settings.");
    return false;
  }
}

function routeToPage() {
  const route = window.location.hash.slice(1) || "home";
  const page = document.querySelector(`[data-page="${route}"]`) ? route : "home";
  document.querySelectorAll("[data-page]").forEach((section) => {
    const isActive = section.dataset.page === page;
    section.hidden = !isActive;
    section.classList.toggle("active", isActive);
  });
  pageLinks.forEach((link) => {
    if (link.dataset.route === page) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  byId("primary-nav").classList.remove("open");
  byId("menu-toggle").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (page === "registration") renderRegistration();
}

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2800);
}

function selected() {
  return selectedCourses.map((id) => courses.find((course) => course.id === id)).filter(Boolean);
}

function updateCounts() {
  const registered = selected();
  const credits = registered.reduce((total, course) => total + course.credits, 0);
  byId("nav-count").textContent = String(registered.length);
  byId("home-course-count").textContent = String(registered.length);
  byId("selected-count").textContent = `${registered.length} ${registered.length === 1 ? "course" : "courses"} selected`;
  byId("credit-total").textContent = String(credits);
  byId("load-indicator").textContent = `${credits} / 18 credits`;
  byId("profile-course-count").textContent = String(registered.length);
  byId("profile-credit-count").textContent = String(credits);
}

function courseCard(course) {
  const isAdded = selectedCourses.includes(course.id);
  const card = document.createElement("article");
  card.className = "course-card";
  card.innerHTML = `
    <div class="course-card-top"><span class="course-code">${course.id}</span><span class="course-chip ${course.color}">${course.department}</span></div>
    <h2>${course.title}</h2><p class="course-description">${course.description}</p>
    <div class="course-meta"><span aria-label="${course.credits} credits">◷ ${course.credits} credits</span><span>▤ ${course.level} level</span></div>
    <div class="course-card-bottom"><span class="instructor"><span class="instructor-avatar" aria-hidden="true">${course.initials}</span>${course.instructor}</span>
    <button class="add-course ${isAdded ? "added" : ""}" type="button" data-course-id="${course.id}" aria-label="${isAdded ? "Added" : "Add"} ${course.id}, ${course.title}" ${isAdded ? "disabled aria-pressed=\"true\"" : "aria-pressed=\"false\""}>${isAdded ? "✓ Added" : "+ Add"}</button></div>`;
  return card;
}

function renderCatalog() {
  const query = byId("course-search").value.trim().toLowerCase();
  const department = byId("department-filter").value;
  const level = byId("level-filter").value;
  const filtered = courses.filter((course) => {
    const matchesQuery = `${course.id} ${course.title} ${course.department} ${course.instructor} ${course.description}`.toLowerCase().includes(query);
    return matchesQuery && (!department || course.department === department) && (!level || String(course.level) === level);
  });
  const grid = byId("course-grid");
  grid.replaceChildren(...filtered.map(courseCard));
  byId("result-count").textContent = String(filtered.length);
  byId("results-summary").textContent = `Showing ${filtered.length} ${filtered.length === 1 ? "course" : "courses"}`;
  byId("empty-state").hidden = filtered.length > 0;
  grid.hidden = filtered.length === 0;
}

function renderRegistration() {
  const rows = byId("registration-table");
  const registered = selected();
  rows.replaceChildren(...registered.map((course) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td><strong>${course.title}</strong><small>${course.id} · ${course.department}</small></td><td>${course.schedule}<small>${course.room}</small></td><td>${course.credits}</td><td><button class="remove-course" type="button" data-remove-id="${course.id}" aria-label="Remove ${course.id}, ${course.title}">×</button></td>`;
    return row;
  }));
  byId("table-empty").hidden = registered.length > 0;
  byId("registration-table").closest(".table-wrap").hidden = registered.length === 0;
  byId("load-indicator").classList.toggle("over-limit", registered.reduce((sum, course) => sum + course.credits, 0) > 18);
  updateCounts();
  syncRegistrationForm();
}

function syncRegistrationForm() {
  byId("student-name").value = profile.name;
  byId("student-email").value = profile.email;
  byId("student-id").value = profile.studentId;
}

function addCourse(courseId) {
  if (selectedCourses.includes(courseId)) return;
  const course = courses.find((item) => item.id === courseId);
  const currentCredits = selected().reduce((sum, item) => sum + item.credits, 0);
  if (currentCredits + course.credits > 18) {
    showToast("That would put your schedule over the 18-credit maximum.");
    return;
  }
  selectedCourses.push(courseId);
  saveCourses();
  renderCatalog();
  renderRegistration();
  showToast(`${course.id} added to your schedule.`);
}

function removeCourse(courseId) {
  selectedCourses = selectedCourses.filter((id) => id !== courseId);
  saveCourses();
  renderCatalog();
  renderRegistration();
  showToast("Course removed from your schedule.");
}

function fillProfileForm() {
  byId("profile-name").value = profile.name;
  byId("profile-email").value = profile.email;
  byId("profile-id").value = profile.studentId;
  byId("profile-major").value = profile.major;
  syncRegistrationForm();
}

function openModal() {
  const registered = selected();
  byId("modal-course-count").textContent = `${registered.length} ${registered.length === 1 ? "course" : "courses"}`;
  byId("modal-credit-count").textContent = `${registered.reduce((sum, course) => sum + course.credits, 0)} credits`;
  byId("confirmation-modal").hidden = false;
  document.body.classList.add("modal-open");
  byId("confirmation-modal").querySelector(".modal-close").focus();
}

function closeModal() {
  byId("confirmation-modal").hidden = true;
  document.body.classList.remove("modal-open");
  byId("registration-title").focus({ preventScroll: true });
}

function initialize() {
  const departmentFilter = byId("department-filter");
  [...new Set(courses.map((course) => course.department))].sort().forEach((department) => {
    const option = document.createElement("option");
    option.value = department;
    option.textContent = department;
    departmentFilter.append(option);
  });
  fillProfileForm();
  renderCatalog();
  renderRegistration();
  window.addEventListener("hashchange", routeToPage);
  routeToPage();

  byId("course-search").addEventListener("input", renderCatalog);
  departmentFilter.addEventListener("change", renderCatalog);
  byId("level-filter").addEventListener("change", renderCatalog);
  byId("clear-filters").addEventListener("click", () => {
    byId("course-search").value = "";
    departmentFilter.value = "";
    byId("level-filter").value = "";
    renderCatalog();
    byId("course-search").focus();
  });
  byId("course-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-course-id]");
    if (button) addCourse(button.dataset.courseId);
  });
  byId("registration-table").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-id]");
    if (button) removeCourse(button.dataset.removeId);
  });
  byId("menu-toggle").addEventListener("click", () => {
    const isOpen = byId("primary-nav").classList.toggle("open");
    byId("menu-toggle").setAttribute("aria-expanded", String(isOpen));
  });
  byId("registration-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (selectedCourses.length === 0) {
      showToast("Add at least one course before confirming your registration.");
      return;
    }
    if (!event.currentTarget.reportValidity()) return;
    profile = { ...profile, name: byId("student-name").value.trim(), email: byId("student-email").value.trim(), studentId: byId("student-id").value.trim() };
    if (saveProfile()) {
      fillProfileForm();
      openModal();
    }
  });
  byId("profile-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    profile = Object.fromEntries(data.entries());
    if (saveProfile()) {
      syncRegistrationForm();
      byId("profile-status").textContent = "Your details have been saved.";
      window.setTimeout(() => { byId("profile-status").textContent = ""; }, 3000);
    }
  });
  byId("confirmation-modal").querySelector(".modal-close").addEventListener("click", closeModal);
  byId("confirmation-modal").querySelector(".modal-done").addEventListener("click", closeModal);
  byId("confirmation-modal").addEventListener("click", (event) => {
    if (event.target === byId("confirmation-modal")) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (!byId("confirmation-modal").hidden && event.key === "Escape") closeModal();
    if (!byId("confirmation-modal").hidden && event.key === "Tab") {
      const focusable = [...byId("confirmation-modal").querySelectorAll("button:not([disabled])")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}

initialize();
