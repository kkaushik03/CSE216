/* Home page: statistics and department shortcuts. */
"use strict";

(function () {
  const registered = Store.getRegistrations();
  document.getElementById("stat-courses").textContent = COURSES.length;
  document.getElementById("stat-open").textContent = COURSES.filter(function (c) { return availability(c) !== "full"; }).length;
  document.getElementById("stat-depts").textContent = Object.keys(DEPARTMENTS).length;
  document.getElementById("stat-mine").textContent = registered.length;

  const list = document.getElementById("dept-list");
  Object.keys(DEPARTMENTS).forEach(function (code) {
    const dept = DEPARTMENTS[code];
    const count = COURSES.filter(function (c) { return c.dept === code; }).length;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "catalog.html?dept=" + encodeURIComponent(code);
    a.style.backgroundColor = dept.color;
    a.textContent = dept.name + " (" + count + (count === 1 ? " course)" : " courses)");
    li.appendChild(a);
    list.appendChild(li);
  });
})();
