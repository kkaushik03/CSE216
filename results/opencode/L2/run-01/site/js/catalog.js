(function () {
  "use strict";

  const grid = document.getElementById("courseGrid");
  if (!grid || !window.App) {
    return;
  }

  const courses = window.App.courses;
  const form = document.getElementById("catalogFilters");
  const searchInput = document.getElementById("catalogSearch");
  const deptFilter = document.getElementById("deptFilter");
  const levelFilter = document.getElementById("levelFilter");
  const modalityFilter = document.getElementById("modalityFilter");
  const dayFilter = document.getElementById("dayFilter");
  const sortFilter = document.getElementById("sortFilter");
  const resultsCount = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");
  const clearButton = document.getElementById("clearFilters");
  const emptyReset = document.getElementById("emptyReset");

  let searchTimer = null;

  function addOptions(select, values) {
    values.forEach(function (value) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function populateFilters() {
    const departments = Array.from(new Set(courses.map(function (course) {
      return course.department;
    }))).sort();

    const levels = Array.from(new Set(courses.map(function (course) {
      return String(course.level);
    }))).sort(function (a, b) {
      return Number(a) - Number(b);
    });

    const modalities = Array.from(new Set(courses.map(function (course) {
      return course.modality;
    }))).sort();

    const fixedDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const days = fixedDays.filter(function (day) {
      return courses.some(function (course) {
        return course.days.indexOf(day) !== -1;
      });
    });

    if (courses.some(function (course) { return course.days.length === 0; })) {
      days.push("Self-paced");
    }

    addOptions(deptFilter, departments);
    addOptions(levelFilter, levels);
    addOptions(modalityFilter, modalities);
    addOptions(dayFilter, days);
  }

  function setSelectValue(select, value) {
    if (!value) {
      return;
    }
    const match = Array.from(select.options).some(function (option) {
      return option.value === value;
    });
    if (match) {
      select.value = value;
    }
  }

  function applyQueryParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) {
      searchInput.value = params.get("q");
    }
    setSelectValue(deptFilter, params.get("dept"));
    setSelectValue(levelFilter, params.get("level"));
    setSelectValue(modalityFilter, params.get("modality"));
    setSelectValue(dayFilter, params.get("day"));
    setSelectValue(sortFilter, params.get("sort"));
  }

  function readFilters() {
    return {
      query: searchInput.value.trim().toLowerCase(),
      department: deptFilter.value,
      level: levelFilter.value,
      modality: modalityFilter.value,
      day: dayFilter.value,
      sort: sortFilter.value
    };
  }

  function matchesFilters(course, filters) {
    if (filters.department && course.department !== filters.department) {
      return false;
    }

    if (filters.level && String(course.level) !== filters.level) {
      return false;
    }

    if (filters.modality && course.modality !== filters.modality) {
      return false;
    }

    if (filters.day === "Self-paced" && course.days.length !== 0) {
      return false;
    }

    if (filters.day && filters.day !== "Self-paced" && course.days.indexOf(filters.day) === -1) {
      return false;
    }

    if (filters.query) {
      const haystack = [
        course.code,
        course.title,
        course.department,
        course.instructor,
        course.description,
        course.modality,
        course.tags.join(" ")
      ].join(" ").toLowerCase();

      const tokens = filters.query.split(/\s+/).filter(Boolean);
      const everyTokenMatches = tokens.every(function (token) {
        return haystack.indexOf(token) !== -1;
      });

      if (!everyTokenMatches) {
        return false;
      }
    }

    return true;
  }

  function sortCourses(list, sortValue) {
    const sorted = list.slice();

    if (sortValue === "code") {
      sorted.sort(function (a, b) {
        return a.code.localeCompare(b.code);
      });
    } else if (sortValue === "title") {
      sorted.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
    } else if (sortValue === "credits") {
      sorted.sort(function (a, b) {
        return b.credits - a.credits || a.code.localeCompare(b.code);
      });
    } else if (sortValue === "seats") {
      sorted.sort(function (a, b) {
        return window.App.getAvailableSeats(b) - window.App.getAvailableSeats(a) || a.code.localeCompare(b.code);
      });
    }

    return sorted;
  }

  function updateUrl(filters) {
    const params = new URLSearchParams();
    if (filters.query) {
      params.set("q", searchInput.value.trim());
    }
    if (filters.department) {
      params.set("dept", filters.department);
    }
    if (filters.level) {
      params.set("level", filters.level);
    }
    if (filters.modality) {
      params.set("modality", filters.modality);
    }
    if (filters.day) {
      params.set("day", filters.day);
    }
    if (filters.sort && filters.sort !== "recommended") {
      params.set("sort", filters.sort);
    }

    const query = params.toString();
    const newUrl = window.location.pathname + (query ? "?" + query : "");

    try {
      window.history.replaceState(null, "", newUrl);
    } catch {
    }
  }

  function applyFilters() {
    const filters = readFilters();
    const filtered = courses.filter(function (course) {
      return matchesFilters(course, filters);
    });
    const sorted = sortCourses(filtered, filters.sort);

    window.App.renderCourseCards(grid, sorted, { idPrefix: "catalog" });

    grid.hidden = sorted.length === 0;
    emptyState.hidden = sorted.length !== 0;

    if (sorted.length === 0) {
      resultsCount.textContent = "No courses found";
    } else if (sorted.length === courses.length) {
      resultsCount.textContent = "Showing all " + courses.length + " courses";
    } else {
      resultsCount.textContent = "Showing " + sorted.length + " of " + courses.length + " courses";
    }

    updateUrl(filters);
  }

  function resetFilters() {
    searchInput.value = "";
    deptFilter.value = "";
    levelFilter.value = "";
    modalityFilter.value = "";
    dayFilter.value = "";
    sortFilter.value = "recommended";
    applyFilters();
    searchInput.focus();
  }

  populateFilters();
  applyQueryParams();

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      window.clearTimeout(searchTimer);
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(applyFilters, 140);
    });
  }

  [deptFilter, levelFilter, modalityFilter, dayFilter, sortFilter].forEach(function (select) {
    if (select) {
      select.addEventListener("change", function () {
        window.clearTimeout(searchTimer);
        applyFilters();
      });
    }
  });

  if (clearButton) {
    clearButton.addEventListener("click", resetFilters);
  }

  if (emptyReset) {
    emptyReset.addEventListener("click", resetFilters);
  }

  applyFilters();
})();
