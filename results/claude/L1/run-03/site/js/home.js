/* Home page: stats, department tiles, popular courses and hero search. */

function renderStats() {
  const openSeats = COURSES.reduce((sum, c) => sum + seatsLeft(c), 0);
  const stats = [
    { icon: "📚", value: COURSES.length, label: "Courses offered", bg: "bg-main" },
    { icon: "🏛️", value: Object.keys(DEPARTMENTS).length, label: "Departments", bg: "bg-cool" },
    { icon: "🪑", value: openSeats, label: "Open seats", bg: "bg-warm" },
    { icon: "✅", value: `${totalCredits()}/${MAX_CREDITS}`, label: "Your credits", bg: "bg-fresh" },
  ];
  document.getElementById("stats-grid").innerHTML = stats.map((s) => `
    <div class="stat-card">
      <div class="stat-icon ${s.bg}">${s.icon}</div>
      <div><strong>${s.value}</strong><span>${s.label}</span></div>
    </div>`).join("");
}

function renderDepartments() {
  document.getElementById("dept-grid").innerHTML = Object.entries(DEPARTMENTS).map(([key, d]) => {
    const count = COURSES.filter((c) => c.dept === key).length;
    return `
      <a class="dept-tile" href="catalog.html?dept=${key}" style="--accent:${d.color}">
        <span class="emoji">${d.icon}</span>
        <strong>${d.name}</strong>
        <small>${count} course${count === 1 ? "" : "s"} →</small>
      </a>`;
  }).join("");
}

function renderFeatured() {
  const popular = [...COURSES]
    .filter((c) => seatsLeft(c) > 0)
    .sort((a, b) => b.enrolled / b.seats - a.enrolled / a.seats)
    .slice(0, 3);
  document.getElementById("featured-grid").innerHTML = popular.map(courseCardHTML).join("");
}

function renderHome() {
  renderStats();
  renderFeatured();
}

document.addEventListener("DOMContentLoaded", () => {
  renderDepartments();
  renderHome();

  document.getElementById("featured-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='register']");
    if (btn) confirmQuickRegister(btn.dataset.code, renderHome);
  });

  document.getElementById("hero-search").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("hero-query").value.trim();
    window.location.href = q ? `catalog.html?q=${encodeURIComponent(q)}` : "catalog.html";
  });
});
