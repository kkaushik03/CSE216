document.addEventListener("DOMContentLoaded", () => {
  const { Store, courseCardHTML, deptColor, escapeHTML, seatsLeft } = App;

  // Stats
  const depts = [...new Set(COURSES.map((c) => c.dept))];
  document.getElementById("stat-courses").textContent = COURSES.length;
  document.getElementById("stat-depts").textContent = depts.length;
  document.getElementById("stat-open").textContent = COURSES.filter((c) => seatsLeft(c) > 0).length;
  document.getElementById("stat-mine").textContent = Store.getRegistrations().length;

  // Department tiles
  document.getElementById("dept-grid").innerHTML = depts
    .map((d) => {
      const n = COURSES.filter((c) => c.dept === d).length;
      return `<a class="dept-tile" style="--accent:${deptColor(d)}" href="catalog.html?dept=${encodeURIComponent(d)}">
        <strong>${escapeHTML(d)}</strong><span>${n} course${n === 1 ? "" : "s"}</span></a>`;
    })
    .join("");

  // Featured: open courses with the most seats available
  const featured = COURSES.filter((c) => seatsLeft(c) > 0)
    .sort((a, b) => seatsLeft(b) - seatsLeft(a))
    .slice(0, 3);
  document.getElementById("featured-grid").innerHTML = featured.map(courseCardHTML).join("");
});
