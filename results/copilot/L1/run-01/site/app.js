const courses = [
  { id: "dmd-240", code: "DMD 240", title: "Designing for Everyday Life", department: "Design", instructor: "Prof. Elena Park", schedule: "MWF", time: "10:00 – 10:50 AM", room: "Arts 204", credits: 3, icon: "✳", color: "#f1eaff", accent: "#8165d9", tags: "design creativity visual" },
  { id: "cs-218", code: "CS 218", title: "Data Stories & Visualization", department: "Computer Science", instructor: "Dr. Theo Bennett", schedule: "TR", time: "11:00 AM – 12:15 PM", room: "Tech 318", credits: 3, icon: "▥", color: "#e4f4ed", accent: "#4ca985", tags: "data science visualization design" },
  { id: "eng-207", code: "ENG 207", title: "Writing the Future", department: "English", instructor: "Prof. Maya Alvarez", schedule: "MWF", time: "1:00 – 1:50 PM", room: "Humanities 112", credits: 3, icon: "✎", color: "#fff0e5", accent: "#d98a61", tags: "writing literature creativity" },
  { id: "psy-230", code: "PSY 230", title: "The Science of Happiness", department: "Psychology", instructor: "Dr. Samira Patel", schedule: "TR", time: "9:30 – 10:45 AM", room: "North Hall 105", credits: 3, icon: "☼", color: "#fff4d9", accent: "#d09a3b", tags: "psychology wellness science" },
  { id: "bio-150", code: "BIO 150", title: "Living Systems & Our Planet", department: "Biology", instructor: "Dr. Noah Williams", schedule: "MWF", time: "2:00 – 2:50 PM", room: "Science 221", credits: 4, icon: "❋", color: "#e7f5e7", accent: "#62a86c", tags: "biology nature science" },
  { id: "bus-305", code: "BUS 305", title: "Ideas Into Impact", department: "Business", instructor: "Prof. Riley Morgan", schedule: "TR", time: "1:00 – 2:15 PM", room: "Commerce 302", credits: 3, icon: "↗", color: "#e7f0ff", accent: "#648ace", tags: "business innovation leadership" },
  { id: "his-214", code: "HIS 214", title: "A World of Cities", department: "History", instructor: "Dr. Aisha Okafor", schedule: "online", time: "Online · self-paced", room: "Online", credits: 3, icon: "⌂", color: "#fce9ed", accent: "#c8798b", tags: "history cities culture" },
  { id: "dmd-311", code: "DMD 311", title: "The Art of Interaction", department: "Design", instructor: "Prof. Elena Park", schedule: "TR", time: "3:00 – 4:15 PM", room: "Arts 216", credits: 3, icon: "◌", color: "#eeeaff", accent: "#8165d9", tags: "design interaction creativity" }
];

const defaultRegistrations = ["dmd-240", "cs-218", "eng-207"];
const storedRegistrations = localStorage.getItem("campusly-registrations");
let registrations = storedRegistrations ? JSON.parse(storedRegistrations) : defaultRegistrations;
let toastTimer;

const byId = (id) => document.getElementById(id);
const courseFor = (id) => courses.find((course) => course.id === id);

function courseCard(course) {
  const registered = registrations.includes(course.id);
  return `<article class="course-card">
    <div class="course-card-top"><span class="course-dept"><i class="dept-dot" style="background:${course.accent}"></i>${course.department.toUpperCase()}</span><span class="course-visual" style="color:${course.accent};background:${course.color}">${course.icon}</span></div>
    <h3>${course.title}</h3><span class="course-code">${course.code} <span>·</span> ${course.credits} credits</span>
    <div class="course-meta"><span>◷ ${course.schedule === "online" ? "Online" : course.schedule === "MWF" ? "Mon · Wed · Fri" : "Tue · Thu"}</span><span>⌖ ${course.time}</span></div>
    <div class="course-card-footer"><span class="instructor-mini">${course.instructor}</span><button class="add-course${registered ? " added" : ""}" data-register="${course.id}" ${registered ? "disabled" : ""}>${registered ? "✓ Added" : "＋ Add class"}</button></div>
  </article>`;
}

function renderCatalog() {
  const query = byId("course-search").value.trim().toLowerCase();
  const department = byId("department-filter").value;
  const schedule = byId("schedule-filter").value;
  const results = courses.filter((course) => {
    const matchesQuery = !query || `${course.title} ${course.code} ${course.department} ${course.instructor} ${course.tags}`.toLowerCase().includes(query);
    return matchesQuery && (department === "all" || course.department === department) && (schedule === "all" || course.schedule === schedule);
  });
  byId("catalog-courses").innerHTML = results.map(courseCard).join("");
  byId("catalog-count").textContent = results.length;
  byId("filter-result").textContent = query || department !== "all" || schedule !== "all" ? `${results.length} ${results.length === 1 ? "course" : "courses"} found` : "";
  byId("empty-state").hidden = results.length > 0;
}

function renderRegistration() {
  const registeredCourses = registrations.map(courseFor).filter(Boolean);
  const credits = registeredCourses.reduce((total, course) => total + course.credits, 0);
  byId("registration-table").innerHTML = registeredCourses.length ? registeredCourses.map((course) => `<tr>
    <td><div class="table-course"><span class="course-visual" style="color:${course.accent};background:${course.color}">${course.icon}</span><span><strong>${course.title}</strong><small>${course.code} · ${course.department}</small></span></div></td>
    <td>${course.instructor}</td><td>${course.schedule === "online" ? "Online · self-paced" : `${course.schedule === "MWF" ? "M / W / F" : "T / Th"} · ${course.time}`}</td><td>${course.credits}</td><td><span class="status-badge">✓ Enrolled</span></td><td><button class="remove-course" data-remove="${course.id}" aria-label="Remove ${course.title}" title="Remove course">×</button></td>
  </tr>`).join("") : `<tr><td colspan="6" class="table-empty">No courses registered yet. Explore the catalog to get started.</td></tr>`;
  byId("credit-count").innerHTML = `${credits} <small>/ 18</small>`;
  byId("credit-progress").style.width = `${Math.min(credits / 18 * 100, 100)}%`;
  byId("class-count").textContent = registeredCourses.length;
  byId("registration-credits").textContent = credits;
  byId("registration-course-count").textContent = registeredCourses.length;
  byId("table-course-count").textContent = registeredCourses.length;
  byId("course-select").innerHTML = `<option value="">Choose a course...</option>${courses.filter((course) => !registrations.includes(course.id)).map((course) => `<option value="${course.id}">${course.code} — ${course.title} (${course.credits} credits)</option>`).join("")}`;
  byId("featured-courses").innerHTML = courses.slice(0, 3).map(courseCard).join("");
  renderCatalog();
}

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function showConfirmation(course) {
  byId("modal-course").innerHTML = `<span class="course-visual" style="color:${course.accent};background:${course.color}">${course.icon}</span><span><strong>${course.title}</strong><small>${course.code} · ${course.credits} credits · ${course.instructor}</small></span>`;
  byId("modal-message").textContent = `${course.code} has been added to your fall schedule.`;
  byId("confirmation-modal").hidden = false;
  byId("modal-done").focus();
}

function addCourse(id) {
  const course = courseFor(id);
  if (!course || registrations.includes(id)) return;
  registrations.push(id);
  localStorage.setItem("campusly-registrations", JSON.stringify(registrations));
  renderRegistration();
  showConfirmation(course);
}

function closeModal() {
  byId("confirmation-modal").hidden = true;
}

function setPage(page) {
  const validPages = ["home", "catalog", "registration", "profile"];
  const selected = validPages.includes(page) ? page : "home";
  document.querySelectorAll(".page").forEach((section) => section.classList.toggle("active", section.id === `page-${selected}`));
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.page === selected));
  const labels = { home: "Overview", catalog: "Course catalog", registration: "My registration", profile: "Student profile" };
  byId("breadcrumb-current").textContent = labels[selected];
  byId("sidebar").classList.remove("open");
  byId("menu-toggle").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-page]").forEach((element) => element.addEventListener("click", () => setPage(element.dataset.page)));
document.addEventListener("click", (event) => {
  const registerButton = event.target.closest("[data-register]");
  if (registerButton) addCourse(registerButton.dataset.register);
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    const course = courseFor(removeButton.dataset.remove);
    registrations = registrations.filter((id) => id !== removeButton.dataset.remove);
    localStorage.setItem("campusly-registrations", JSON.stringify(registrations));
    renderRegistration();
    showToast(`${course.title} removed from your schedule.`);
  }
});

const departmentFilter = byId("department-filter");
[...new Set(courses.map((course) => course.department))].sort().forEach((department) => {
  const option = document.createElement("option");
  option.value = department;
  option.textContent = department;
  departmentFilter.append(option);
});
byId("course-search").addEventListener("input", renderCatalog);
departmentFilter.addEventListener("change", renderCatalog);
byId("schedule-filter").addEventListener("change", renderCatalog);
document.querySelectorAll("[data-search-tag]").forEach((button) => button.addEventListener("click", () => {
  const active = button.classList.contains("active");
  document.querySelectorAll("[data-search-tag]").forEach((tag) => tag.classList.remove("active"));
  byId("course-search").value = active ? "" : button.dataset.searchTag;
  if (!active) button.classList.add("active");
  renderCatalog();
}));
byId("clear-filters").addEventListener("click", () => {
  byId("course-search").value = "";
  departmentFilter.value = "all";
  byId("schedule-filter").value = "all";
  document.querySelectorAll("[data-search-tag]").forEach((tag) => tag.classList.remove("active"));
  renderCatalog();
});
byId("registration-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const course = courseFor(byId("course-select").value);
  if (!course || registrations.includes(course.id)) {
    showToast("Choose an available course to continue.");
    return;
  }
  const name = byId("student-name").value.trim();
  const email = byId("student-email").value.trim();
  if (!name || !email) {
    showToast("Enter your name and university email.");
    return;
  }
  addCourse(course.id);
});
byId("modal-close").addEventListener("click", closeModal);
byId("modal-done").addEventListener("click", () => { closeModal(); setPage("registration"); });
byId("modal-continue").addEventListener("click", () => { closeModal(); setPage("catalog"); });
byId("confirmation-modal").addEventListener("click", (event) => { if (event.target === byId("confirmation-modal")) closeModal(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    byId("sidebar").classList.remove("open");
    byId("menu-toggle").setAttribute("aria-expanded", "false");
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    setPage("catalog");
    byId("course-search").focus();
  }
});
byId("menu-toggle").addEventListener("click", () => {
  const open = byId("sidebar").classList.toggle("open");
  byId("menu-toggle").setAttribute("aria-expanded", String(open));
});
byId("download-schedule").addEventListener("click", () => {
  const rows = registrations.map(courseFor).filter(Boolean);
  const content = [["Course", "Title", "Instructor", "Schedule", "Credits"], ...rows.map((course) => [course.code, course.title, course.instructor, `${course.schedule} ${course.time}`, course.credits])].map((row) => row.map((item) => `"${String(item).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  link.download = "campusly-fall-2026-schedule.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Your schedule download is ready.");
});
byId("edit-profile").addEventListener("click", () => {
  const name = window.prompt("Update your display name:", byId("profile-name").textContent);
  if (name?.trim()) {
    byId("profile-name").textContent = name.trim();
    document.querySelector(".student-mini strong").textContent = name.trim();
    byId("student-name").value = name.trim();
    showToast("Your display name has been updated.");
  }
});

renderRegistration();
