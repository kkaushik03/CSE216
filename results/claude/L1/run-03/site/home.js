// Home page: stats, departments, featured courses, search redirect.
document.addEventListener("DOMContentLoaded", () => {
  const { Store, departments, deptColor, courseCard, bindCardActions, totalCredits } = UCR;

  document.getElementById("home-search").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("home-q").value.trim();
    window.location.href = "catalog.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });

  function render() {
    const reg = Store.getRegistered();
    const openCount = COURSES.filter((c) => c.enrolled < c.seats).length;
    document.getElementById("home-stats").innerHTML =
      '<div class="stat"><strong>' + COURSES.length + "</strong>Courses offered</div>" +
      '<div class="stat"><strong>' + departments().length + "</strong>Departments</div>" +
      '<div class="stat"><strong>' + openCount + "</strong>Courses with open seats</div>" +
      '<div class="stat"><strong>' + totalCredits(reg) + "</strong>Your registered credits</div>";

    document.getElementById("dept-grid").innerHTML = departments().map((d) => {
      const n = COURSES.filter((c) => c.dept === d).length;
      return '<a class="dept-chip" style="background:' + deptColor(d) + '" href="catalog.html?dept=' + encodeURIComponent(d) + '">' +
        UCR.escapeHTML(d) + "<small>" + n + " course" + (n === 1 ? "" : "s") + "</small></a>";
    }).join("");

    // Featured: the courses with the most open seats.
    const featured = COURSES.slice().sort((a, b) => UCR.seatsLeft(b) - UCR.seatsLeft(a)).slice(0, 3);
    document.getElementById("featured").innerHTML = featured.map(courseCard).join("");
  }

  bindCardActions(document.getElementById("featured"), render);
  render();
});
