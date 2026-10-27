/* Catalog page: search, filter dropdowns, day chips and course cards. */

const catalogState = { days: new Set(), openOnly: false };

function readFilters() {
  return {
    q: document.getElementById("search").value.trim().toLowerCase(),
    dept: document.getElementById("dept").value,
    level: document.getElementById("level").value,
    credits: document.getElementById("credits").value,
    sort: document.getElementById("sort").value,
  };
}

function filterCourses() {
  const f = readFilters();
  const list = COURSES.filter((c) => {
    const haystack = `${c.code} ${c.title} ${c.instructor} ${DEPARTMENTS[c.dept].name}`.toLowerCase();
    return (!f.q || haystack.includes(f.q)) &&
      (!f.dept || c.dept === f.dept) &&
      (!f.level || c.level === Number(f.level)) &&
      (!f.credits || c.credits === Number(f.credits)) &&
      (!catalogState.openOnly || seatsLeft(c) > 0) &&
      [...catalogState.days].every((d) => c.days.includes(d));
  });

  const sorters = {
    code: (a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }),
    title: (a, b) => a.title.localeCompare(b.title),
    seats: (a, b) => seatsLeft(b) - seatsLeft(a),
    credits: (a, b) => b.credits - a.credits || a.code.localeCompare(b.code),
  };
  return list.sort(sorters[f.sort]);
}

function renderCatalog() {
  const results = filterCourses();
  const grid = document.getElementById("course-grid");
  document.getElementById("result-count").innerHTML =
    `Showing <strong>${results.length}</strong> of ${COURSES.length} courses`;

  grid.innerHTML = results.length
    ? results.map(courseCardHTML).join("")
    : `<div class="empty-state">
         <div class="emoji">🔎</div>
         <h3>No courses match your search</h3>
         <p>Try a different keyword or reset the filters.</p>
       </div>`;
}

function renderDayChips() {
  const chips = DAY_ORDER.map((d) =>
    `<button type="button" class="chip ${catalogState.days.has(d) ? "active" : ""}" data-day="${d}" aria-pressed="${catalogState.days.has(d)}">${d}</button>`);
  chips.push(`<button type="button" class="chip ${catalogState.openOnly ? "active" : ""}" data-open style="--accent:#16a34a" aria-pressed="${catalogState.openOnly}">🟢 Open seats only</button>`);
  document.getElementById("day-chips").innerHTML = chips.join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const deptSelect = document.getElementById("dept");
  deptSelect.insertAdjacentHTML("beforeend", Object.entries(DEPARTMENTS)
    .map(([key, d]) => `<option value="${key}">${d.icon} ${d.name}</option>`).join(""));

  // Pre-fill from query string (links from home page).
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) document.getElementById("search").value = params.get("q");
  if (DEPARTMENTS[params.get("dept")]) deptSelect.value = params.get("dept");

  document.getElementById("search").addEventListener("input", renderCatalog);
  ["dept", "level", "credits", "sort"].forEach((id) => document.getElementById(id).addEventListener("change", renderCatalog));

  document.getElementById("day-chips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    if (chip.dataset.day) {
      const d = chip.dataset.day;
      catalogState.days.has(d) ? catalogState.days.delete(d) : catalogState.days.add(d);
    } else {
      catalogState.openOnly = !catalogState.openOnly;
    }
    renderDayChips();
    renderCatalog();
  });

  document.getElementById("reset").addEventListener("click", () => {
    document.getElementById("filters").reset();
    catalogState.days.clear();
    catalogState.openOnly = false;
    history.replaceState(null, "", "catalog.html");
    renderDayChips();
    renderCatalog();
  });

  document.getElementById("course-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='register']");
    if (btn) confirmQuickRegister(btn.dataset.code, renderCatalog);
  });

  renderDayChips();
  renderCatalog();
});
