document.addEventListener("DOMContentLoaded", () => {
  const { courseCardHTML, seatsLeft } = App;

  const search = document.getElementById("search");
  const deptSel = document.getElementById("filter-dept");
  const levelSel = document.getElementById("filter-level");
  const creditSel = document.getElementById("filter-credits");
  const availSel = document.getElementById("filter-availability");
  const sortSel = document.getElementById("sort");
  const grid = document.getElementById("course-grid");
  const count = document.getElementById("result-count");
  const empty = document.getElementById("empty-state");

  // Populate dropdowns from data
  const addOptions = (select, values, labelFn = (v) => v) => {
    values.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = labelFn(v);
      select.appendChild(opt);
    });
  };
  addOptions(deptSel, [...new Set(COURSES.map((c) => c.dept))].sort());
  addOptions(levelSel, [...new Set(COURSES.map((c) => c.level))].sort(), (v) => `${v}-level`);
  addOptions(creditSel, [...new Set(COURSES.map((c) => c.credits))].sort(), (v) => `${v} credits`);

  // Initial state from URL (e.g. from home page search / department tiles)
  const params = new URLSearchParams(location.search);
  if (params.get("q")) search.value = params.get("q");
  if (params.get("dept") && [...deptSel.options].some((o) => o.value === params.get("dept"))) deptSel.value = params.get("dept");

  function render() {
    const q = search.value.trim().toLowerCase();
    let list = COURSES.filter((c) => {
      if (q && ![c.id, c.title, c.instructor, c.dept, c.description].some((f) => f.toLowerCase().includes(q))) return false;
      if (deptSel.value && c.dept !== deptSel.value) return false;
      if (levelSel.value && c.level !== levelSel.value) return false;
      if (creditSel.value && String(c.credits) !== creditSel.value) return false;
      if (availSel.value === "open" && seatsLeft(c) === 0) return false;
      if (availSel.value === "registered" && !App.Store.isRegistered(c.id)) return false;
      return true;
    });

    const sorters = {
      code: (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }),
      title: (a, b) => a.title.localeCompare(b.title),
      credits: (a, b) => b.credits - a.credits || a.id.localeCompare(b.id),
      seats: (a, b) => seatsLeft(b) - seatsLeft(a),
    };
    list = list.slice().sort(sorters[sortSel.value] || sorters.code);

    grid.innerHTML = list.map(courseCardHTML).join("");
    count.textContent = `Showing ${list.length} of ${COURSES.length} courses`;
    empty.hidden = list.length > 0;
  }

  search.addEventListener("input", render);
  [deptSel, levelSel, creditSel, availSel, sortSel].forEach((el) => el.addEventListener("change", render));
  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    render();
  });
  document.getElementById("reset-filters").addEventListener("click", () => {
    search.value = "";
    [deptSel, levelSel, creditSel, availSel].forEach((s) => (s.value = ""));
    sortSel.value = "code";
    history.replaceState(null, "", location.pathname);
    render();
  });

  render();
});
