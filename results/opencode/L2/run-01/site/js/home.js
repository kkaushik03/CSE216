(function () {
  "use strict";

  const container = document.getElementById("featuredCourses");
  if (!container || !window.App) {
    return;
  }

  const featuredIds = ["cs315", "art115", "env205", "psy101"];
  const featuredCourses = featuredIds
    .map(function (courseId) {
      return window.App.getCourse(courseId);
    })
    .filter(Boolean);

  window.App.renderCourseCards(container, featuredCourses, { idPrefix: "featured" });
})();
