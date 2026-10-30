(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const app = window.AURORA_APP;
    const allCourses = window.AURORA.COURSES;
    const form = document.getElementById("course-filters");
    const searchInput = document.getElementById("course-search");
    const departmentFilter = document.getElementById("department-filter");
    const levelFilter = document.getElementById("level-filter");
    const formatFilter = document.getElementById("format-filter");
    const sortSelect = document.getElementById("sort-courses");
    const clearButton = document.getElementById("clear-filters");
    const emptyResetButton = document.getElementById("empty-reset");
    const grid = document.getElementById("course-grid");
    const emptyState = document.getElementById("no-results");
    const summary = document.getElementById("results-summary");

    if (!app || !form || !grid || !summary) {
      return;
    }

    Object.keys(window.AURORA.DEPARTMENTS).forEach(function (department) {
      const option = document.createElement("option");
      option.value = department;
      option.textContent = department;
      departmentFilter.appendChild(option);
    });

    const query = new URLSearchParams(window.location.search).get("q");
    if (query) {
      searchInput.value = query;
    }

    function filteredCourses() {
      const term = searchInput.value.trim().toLowerCase();
      const department = departmentFilter.value;
      const level = levelFilter.value;
      const format = formatFilter.value;

      return allCourses.filter(function (course) {
        const searchable = [
          course.code,
          course.title,
          course.department,
          course.instructor,
          course.description,
          course.format
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!term || searchable.indexOf(term) !== -1) &&
          (!department || course.department === department) &&
          (!level || String(course.level) === level) &&
          (!format || course.format === format)
        );
      });
    }

    function sortedCourses(courses) {
      const sortBy = sortSelect.value;
      const sorted = courses.slice();

      if (sortBy === "title") {
        sorted.sort(function (a, b) {
          return a.title.localeCompare(b.title);
        });
      } else if (sortBy === "seats") {
        sorted.sort(function (a, b) {
          return b.seatsAvailable - a.seatsAvailable;
        });
      } else if (sortBy === "level") {
        sorted.sort(function (a, b) {
          return a.level - b.level || a.title.localeCompare(b.title);
        });
      } else {
        sorted.sort(function (a, b) {
          const featuredDifference = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
          return featuredDifference || allCourses.indexOf(a) - allCourses.indexOf(b);
        });
      }

      return sorted;
    }

    function render() {
      const matches = sortedCourses(filteredCourses());
      grid.innerHTML = "";
      emptyState.hidden = matches.length !== 0;

      if (matches.length === 0) {
        summary.textContent = "No courses match your filters. Try clearing one or more filters.";
        return;
      }

      const fragment = document.createDocumentFragment();
      matches.forEach(function (course) {
        fragment.appendChild(app.createCourseCard(course));
      });
      grid.appendChild(fragment);

      summary.textContent =
        matches.length === allCourses.length
          ? "Showing all " + allCourses.length + " courses"
          : "Showing " + matches.length + " of " + allCourses.length + " courses";
    }

    function resetFilters() {
      form.reset();
      sortSelect.value = "recommended";
      render();
      searchInput.focus();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      render();
    });

    [searchInput, departmentFilter, levelFilter, formatFilter].forEach(function (control) {
      control.addEventListener("input", render);
      control.addEventListener("change", render);
    });

    sortSelect.addEventListener("change", render);
    clearButton.addEventListener("click", resetFilters);
    emptyResetButton.addEventListener("click", resetFilters);

    render();
  });
})();
