/* Home page */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var U = window.UCR;
  var courses = U.DATA.courses;

  document.getElementById("stat-courses").textContent = courses.length;
  document.getElementById("stat-depts").textContent = U.DATA.departments.length;
  document.getElementById("stat-open").textContent = courses.filter(function (c) { return c.seats > 0; }).length;
  document.getElementById("stat-mine").textContent = U.store.getRegistered().length;

  var deptGrid = document.getElementById("dept-grid");
  deptGrid.innerHTML = U.DATA.departments.map(function (d) {
    var n = courses.filter(function (c) { return c.dept === d.id; }).length;
    return '<li><a class="dept-tile c-' + d.color + '" href="catalog.html?dept=' + encodeURIComponent(d.id) + '">' +
      U.escapeHTML(d.name) + "<span>" + n + (n === 1 ? " course" : " courses") + "</span></a></li>";
  }).join("");

  var featuredList = document.getElementById("featured-courses");
  var featuredCodes = ["CS 101", "PSY 101", "ART 260", "PHYS 350"];

  function renderFeatured() {
    var selected = U.store.getSelected();
    featuredList.innerHTML = featuredCodes.map(function (code) {
      var c = U.findCourse(code);
      return "<li>" + U.courseCardHTML(c, { selected: selected.indexOf(code) !== -1, headingLevel: 3 }) + "</li>";
    }).join("");
  }
  renderFeatured();
  U.bindCardToggles(featuredList, renderFeatured);
});
