(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const featuredGrid = document.getElementById("featured-courses");
    if (!featuredGrid || !window.AURORA || !window.AURORA_APP) {
      return;
    }

    ["cs-330", "env-150", "des-110"].forEach(function (id) {
      const course = window.AURORA_APP.getCourseById(id);
      if (course) {
        featuredGrid.appendChild(window.AURORA_APP.createCourseCard(course, { highlight: true }));
      }
    });
  });
})();
