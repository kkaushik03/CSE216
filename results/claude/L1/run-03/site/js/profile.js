/* Profile page: student card, stats, sortable registered-courses table and weekly schedule. */

const tableState = { sortKey: "code", direction: 1 };

function renderProfileCard() {
  const p = getProfile();
  const card = document.getElementById("profile-card");

  if (!p) {
    card.innerHTML = `
      <div class="profile-cover"></div>
      <div class="avatar">?</div>
      <h2>No profile yet</h2>
      <p class="muted" style="padding:0 1.5rem">Complete a registration to create your student profile.</p>
      <a href="register.html" class="btn btn-primary">Register Now</a>`;
    return;
  }

  const initials = `${p.firstName[0] || ""}${p.lastName[0] || ""}`.toUpperCase();
  const rows = [
    ["Student ID", p.studentId], ["Email", p.email], ["Year", p.year],
    ["Semester", p.semester], ["Phone", p.phone || "—"],
  ];
  card.innerHTML = `
    <div class="profile-cover"></div>
    <div class="avatar">${escapeHTML(initials)}</div>
    <h2>${escapeHTML(p.firstName)} ${escapeHTML(p.lastName)}</h2>
    <p class="program">${escapeHTML(p.program)}</p>
    <ul class="profile-details">
      ${rows.map(([k, v]) => `<li><span>${k}</span><span>${escapeHTML(v)}</span></li>`).join("")}
    </ul>
    <a href="register.html" class="btn btn-warm btn-sm">✏️ Edit / Add Courses</a>`;
}

function renderMiniStats(courses) {
  const credits = courses.reduce((s, c) => s + c.credits, 0);
  const hours = courses.reduce((s, c) => s + c.days.length * (toMinutes(c.end) - toMinutes(c.start)), 0) / 60;
  const stats = [
    { value: courses.length, label: "Courses registered", bg: "bg-main" },
    { value: `${credits}/${MAX_CREDITS}`, label: "Credits this semester", bg: "bg-warm" },
    { value: hours.toFixed(1), label: "Class hours per week", bg: "bg-cool" },
  ];
  document.getElementById("mini-stats").innerHTML = stats.map((s) =>
    `<div class="mini-stat ${s.bg}"><strong>${s.value}</strong><span>${s.label}</span></div>`).join("");
}

function sortValue(course, key) {
  if (key === "schedule") return DAY_ORDER.indexOf(course.days[0]) * 10000 + toMinutes(course.start);
  return course[key];
}

function renderTable(courses) {
  const table = document.getElementById("course-table");
  const q = document.getElementById("table-search").value.trim().toLowerCase();
  const { sortKey, direction } = tableState;

  const rows = courses
    .filter((c) => !q || `${c.code} ${c.title} ${c.instructor}`.toLowerCase().includes(q))
    .sort((a, b) => {
      const va = sortValue(a, sortKey), vb = sortValue(b, sortKey);
      return (typeof va === "number" ? va - vb : String(va).localeCompare(vb)) * direction;
    });

  table.querySelectorAll("th[data-sort]").forEach((th) => {
    th.classList.remove("asc", "desc");
    if (th.dataset.sort === sortKey) th.classList.add(direction === 1 ? "asc" : "desc");
  });

  const tbody = table.querySelector("tbody");
  if (!courses.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state" style="box-shadow:none">
      <div class="emoji">📭</div><h3>No registered courses yet</h3>
      <p><a href="catalog.html" class="btn btn-primary btn-sm">Browse the catalog</a></p></div></td></tr>`;
  } else if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--muted)">No courses match "${escapeHTML(q)}".</td></tr>`;
  } else {
    tbody.innerHTML = rows.map((c) => `
      <tr>
        <td><span class="code-pill" style="--accent:${DEPARTMENTS[c.dept].color}">${c.code}</span></td>
        <td><strong>${c.title}</strong><br><small style="color:var(--muted)">${DEPARTMENTS[c.dept].name}</small></td>
        <td>${c.instructor}</td>
        <td>${formatSchedule(c)}</td>
        <td>${c.credits}</td>
        <td><span class="status-pill">Enrolled</span></td>
        <td><button class="btn btn-danger btn-sm" data-drop="${c.code}">Drop</button></td>
      </tr>`).join("");
  }

  const credits = courses.reduce((s, c) => s + c.credits, 0);
  table.querySelector("tfoot").innerHTML = courses.length
    ? `<tr><td colspan="4">Total</td><td>${credits}</td><td colspan="2">${courses.length} course${courses.length === 1 ? "" : "s"}</td></tr>`
    : "";
}

function renderWeek(courses) {
  document.getElementById("week-grid").innerHTML = DAY_ORDER.map((day) => {
    const slots = courses
      .filter((c) => c.days.includes(day))
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    return `
      <div class="week-day">
        <h4>${day}</h4>
        ${slots.length ? slots.map((c) => `
          <div class="week-slot" style="--accent:${DEPARTMENTS[c.dept].color}">
            <strong>${c.code}</strong>${formatTime(c.start)} – ${formatTime(c.end)}
          </div>`).join("") : `<small style="color:var(--muted)">Free day 🎈</small>`}
      </div>`;
  }).join("");
}

function renderProfilePage() {
  const courses = getRegisteredCodes().map(getCourse).filter(Boolean);
  renderProfileCard();
  renderMiniStats(courses);
  renderTable(courses);
  renderWeek(courses);
}

document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("course-table");

  table.querySelector("thead").addEventListener("click", (e) => {
    const th = e.target.closest("th[data-sort]");
    if (!th) return;
    tableState.direction = tableState.sortKey === th.dataset.sort ? -tableState.direction : 1;
    tableState.sortKey = th.dataset.sort;
    renderProfilePage();
  });

  table.querySelector("tbody").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-drop]");
    if (!btn) return;
    const course = getCourse(btn.dataset.drop);
    openModal({
      title: "Drop Course?",
      icon: "🗑️",
      variant: "danger",
      confirmText: "Yes, drop it",
      cancelText: "Keep course",
      body: `
        <div class="modal-course" style="--accent:${DEPARTMENTS[course.dept].color}">
          <strong>${course.code} — ${course.title}</strong>
          <span>${course.instructor} · ${formatSchedule(course)}</span>
        </div>
        <p>Your seat will be released and may be taken by another student.</p>`,
      onConfirm: () => {
        dropRegistration(course.code);
        renderNavbar();
        renderProfilePage();
        showToast(`Dropped ${course.code}`, "info");
      },
    });
  });

  document.getElementById("table-search").addEventListener("input", renderProfilePage);

  renderProfilePage();
});
