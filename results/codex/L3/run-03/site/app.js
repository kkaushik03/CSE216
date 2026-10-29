const courses = [
  {code:"ENV 240",title:"Climate, Culture & Change",department:"Environmental Studies",credits:3,day:"Mon · Wed",time:"10:00–11:15 AM",slot:"morning",instructor:"Dr. Maya Chen",color:"mint"},
  {code:"ART 210",title:"The Art of Looking",department:"Visual Arts",credits:3,day:"Tue · Thu",time:"1:00–2:15 PM",slot:"afternoon",instructor:"Prof. Elena Ruiz",color:"peach"},
  {code:"CS 150",title:"Creative Coding Studio",department:"Computer Science",credits:4,day:"Mon · Wed · Fri",time:"11:00–11:50 AM",slot:"morning",instructor:"Dr. Sam Okafor",color:"lilac"},
  {code:"PSY 220",title:"The Science of Happiness",department:"Psychology",credits:3,day:"Tue · Thu",time:"2:30–3:45 PM",slot:"afternoon",instructor:"Dr. Nina Patel",color:"yellow"},
  {code:"ENG 315",title:"Stories of Belonging",department:"English",credits:3,day:"Mon · Wed",time:"4:00–5:15 PM",slot:"afternoon",instructor:"Prof. Theo Brooks",color:"peach"},
  {code:"BIO 110",title:"Living Systems",department:"Biology",credits:4,day:"Tue · Thu",time:"9:00–10:50 AM",slot:"morning",instructor:"Dr. Amara Davis",color:"mint"},
  {code:"MUS 180",title:"Sound & Society",department:"Music",credits:2,day:"Wed",time:"6:00–8:30 PM",slot:"evening",instructor:"Prof. Luca Moretti",color:"lilac"},
  {code:"BUS 205",title:"Ideas into Action",department:"Business",credits:3,day:"Mon · Wed",time:"1:00–2:15 PM",slot:"afternoon",instructor:"Dr. Aisha Morgan",color:"yellow"},
  {code:"HIS 260",title:"Cities Through Time",department:"History",credits:3,day:"Tue · Thu",time:"10:00–11:15 AM",slot:"morning",instructor:"Prof. Daniel Kim",color:"peach"}
];
const defaultCodes = ["ENV 240", "ART 210"];
let registered = JSON.parse(localStorage.getItem("campuslyCourses") || "null") || defaultCodes;
const byId = id => document.getElementById(id);
const safeRegistered = () => registered.filter(code => courses.some(course => course.code === code));
registered = safeRegistered();

function courseCard(course) {
  const added = registered.includes(course.code);
  return `<article class="course-card"><div class="course-top"><span class="course-dept">${course.department}</span><span class="course-credits">${course.credits} credits</span></div><h3>${course.title}</h3><span class="course-code">${course.code}</span><div class="course-meta"><span><span aria-hidden="true">◷</span>${course.day}, ${course.time}</span></div><div class="course-bottom"><span class="course-instructor">${course.instructor}</span><button class="add-course" type="button" data-add="${course.code}" ${added ? "disabled" : ""}>${added ? "✓ Added" : "+ Add course"}</button></div></article>`;
}
function renderCatalog() {
  const term = byId("course-search").value.trim().toLowerCase();
  const department = byId("department-filter").value;
  const time = byId("time-filter").value;
  const matches = courses.filter(course => (department === "all" || course.department === department) && (time === "all" || course.slot === time) && (!term || `${course.code} ${course.title} ${course.department} ${course.instructor}`.toLowerCase().includes(term)));
  byId("course-results").innerHTML = matches.map(courseCard).join("");
  byId("results-count").textContent = `${matches.length} ${matches.length === 1 ? "course" : "courses"} to explore`;
  byId("no-results").hidden = matches.length !== 0;
  byId("clear-search").hidden = !term;
}
function persist() { localStorage.setItem("campuslyCourses", JSON.stringify(registered)); }
function updateSchedule() {
  registered = safeRegistered();
  const selected = registered.map(code => courses.find(course => course.code === code));
  const credits = selected.reduce((sum, course) => sum + course.credits, 0);
  byId("registered-count").textContent = `${selected.length} ${selected.length === 1 ? "course" : "courses"}`;
  byId("registered-subtitle").textContent = selected.length ? "Your schedule at a glance" : "Your schedule is ready when you are";
  byId("registered-table").innerHTML = selected.map(course => `<tr><td class="table-course"><b>${course.title}</b><span>${course.code} · ${course.department}</span></td><td class="table-time">${course.day}<br>${course.time}</td><td>${course.credits}</td><td><button type="button" class="remove-course" data-remove="${course.code}" aria-label="Remove ${course.code} ${course.title} from your schedule">Remove</button></td></tr>`).join("");
  byId("empty-registered").hidden = selected.length > 0;
  byId("credit-total").innerHTML = `${credits} <small>${credits === 1 ? "credit" : "credits"}</small>`;
  const meter = document.querySelector(".credit-meter");
  meter.setAttribute("aria-valuenow", String(Math.min(18, credits)));
  byId("credit-meter-fill").style.width = `${Math.min(100, credits / 18 * 100)}%`;
  byId("credit-message").textContent = credits >= 18 ? "You’ve reached the 18 credit maximum." : `${18 - credits} credits available in your 18 credit maximum.`;
  byId("profile-credits").textContent = credits;
  byId("profile-course-count").textContent = selected.length;
  renderCatalog();
  byId("popular-courses").innerHTML = courses.slice(0, 3).map(courseCard).join("");
}
function addCourse(code) {
  if (!courses.some(course => course.code === code) || registered.includes(code)) return;
  const course = courses.find(item => item.code === code);
  const currentCredits = registered.reduce((sum, current) => sum + courses.find(item => item.code === current).credits, 0);
  if (currentCredits + course.credits > 18) {
    byId("status-message").textContent = `Cannot add ${course.code}. The 18 credit maximum would be exceeded.`;
    return;
  }
  registered.push(code); persist(); updateSchedule();
  byId("dialog-course").innerHTML = `<b>${course.code} · ${course.title}</b><span>${course.day} · ${course.time} · ${course.credits} credits</span>`;
  byId("confirmation-dialog").showModal();
  byId("status-message").textContent = `${course.title} added to your schedule.`;
}
function removeCourse(code) {
  const course = courses.find(item => item.code === code);
  registered = registered.filter(item => item !== code); persist(); updateSchedule();
  byId("status-message").textContent = `${course.title} removed from your schedule.`;
}
function navigate() {
  const route = location.hash.slice(1) || "home";
  const page = document.querySelector(`[data-page="${route}"]`) ? route : "home";
  document.querySelectorAll("[data-page]").forEach(el => { const active = el.dataset.page === page; el.hidden = !active; el.classList.toggle("active", active); });
  document.querySelectorAll("[data-route]").forEach(link => { if (link.dataset.route === page) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current"); });
  byId("primary-nav").classList.remove("open"); byId("nav-toggle").setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}
function setError(input, message, errorId) {
  input.setAttribute("aria-invalid", message ? "true" : "false");
  byId(errorId).textContent = message;
}
document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]"); if (add) addCourse(add.dataset.add);
  const remove = event.target.closest("[data-remove]"); if (remove) removeCourse(remove.dataset.remove);
});
window.addEventListener("hashchange", navigate);
byId("nav-toggle").addEventListener("click", () => { const open = byId("primary-nav").classList.toggle("open"); byId("nav-toggle").setAttribute("aria-expanded", String(open)); });
byId("course-search").addEventListener("input", renderCatalog);
byId("department-filter").addEventListener("change", renderCatalog);
byId("time-filter").addEventListener("change", renderCatalog);
byId("clear-search").addEventListener("click", () => { byId("course-search").value = ""; renderCatalog(); byId("course-search").focus(); });
byId("registration-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = byId("student-name"), email = byId("student-email"), code = byId("course-code");
  const courseCode = code.value.trim().toUpperCase().replace(/\s+/g, " ");
  let valid = true;
  if (!name.value.trim()) { setError(name, "Enter your name.", "student-name-error"); valid = false; } else setError(name, "", "student-name-error");
  if (!email.validity.valid || !email.value.trim()) { setError(email, "Enter a valid university email address.", "student-email-error"); valid = false; } else setError(email, "", "student-email-error");
  const course = courses.find(item => item.code === courseCode);
  if (!course) { setError(code, "Enter a course code from the catalog, such as ART 210.", "course-code-error"); valid = false; }
  else if (registered.includes(course.code)) { setError(code, "You’re already registered for this course.", "course-code-error"); valid = false; }
  else setError(code, "", "course-code-error");
  if (valid) { code.value = ""; addCourse(course.code); }
  else document.querySelector("[aria-invalid=true]")?.focus();
});
document.querySelectorAll("#registration-form input").forEach(input => input.addEventListener("input", () => { if (input.getAttribute("aria-invalid") === "true") setError(input, "", `${input.id}-error`); }));
byId("dialog-done").addEventListener("click", () => byId("confirmation-dialog").close());
byId("confirmation-dialog").addEventListener("click", event => { if (event.target === byId("confirmation-dialog")) byId("confirmation-dialog").close(); });
const departments = [...new Set(courses.map(course => course.department))].sort();
departments.forEach(department => { const option = document.createElement("option"); option.value = department; option.textContent = department; byId("department-filter").append(option); });
updateSchedule(); navigate();
