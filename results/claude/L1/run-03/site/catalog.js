// Catalog page: search + filter dropdowns + course cards.
document.addEventListener("DOMContentLoaded", () => {
  const { Store, departments, courseCard, bindCardActions, isFull } = UCR;
  const $ = (id) => document.getElementById(id);
  const q = $("q"), dept = $("f-dept"), level = $("f-level"), credits = $("f-credits"), avail = $("f-avail");
  const grid = $("catalog-grid");

  departments().forEach((d) => dept.add(new Option(d, d)));

  // Pre-fill from URL (?q=…&dept=…) so home page links work.
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) q.value = params.get("q");
  if (params.get("dept") && departments().includes(params.get("dept"))) dept.value = params.get("dept");

  function render() {
    const term = q.value.trim().toLowerCase();
    const reg = Store.getRegistered();
    const list = COURSES.filter((c) => {
      if (term && !(c.title + " " + c.id + " " + c.instructor + " " + c.dept + " " + c.description).toLowerCase().includes(term)) return false;
      if (dept.value && c.dept !== dept.value) return false;
      if (level.value && String(c.level) !== level.value) return false;
      if (credits.value && String(c.credits) !== credits.value) return false;
      if (avail.value === "open" && isFull(c)) return false;
      if (avail.value === "registered" && !reg.includes(c.id)) return false;
      return true;
    });
    $("result-count").textContent = "Showing " + list.length + " of " + COURSES.length + " courses";
    grid.innerHTML = list.length
      ? list.map(courseCard).join("")
      : '<div class="empty-state" style="grid-column:1/-1"><div class="emoji">🔍</div><p>No courses match your search. Try different filters.</p></div>';
  }

  q.addEventListener("input", render);
  [dept, level, credits, avail].forEach((el) => el.addEventListener("change", render));
  $("reset").addEventListener("click", () => {
    q.value = ""; dept.value = ""; level.value = ""; credits.value = ""; avail.value = "";
    history.replaceState(null, "", "catalog.html");
    render();
  });
  bindCardActions(grid, render);
  render();
});
