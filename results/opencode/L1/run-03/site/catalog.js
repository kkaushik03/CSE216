document.addEventListener('DOMContentLoaded', function () {
  const searchInput = $('#course-search');
  const deptSelect = $('#filter-dept');
  const levelSelect = $('#filter-level');
  const creditsSelect = $('#filter-credits');
  const sortSelect = $('#filter-sort');
  const resultsCount = $('#results-count');
  const grid = $('#course-grid');
  const emptyState = $('#empty-state');
  const clearButton = $('#clear-filters');
  const resetButton = $('#reset-filters');

  const departments = Array.from(
    new Set(
      COURSES.map(function (course) {
        return course.department;
      })
    )
  ).sort(function (a, b) {
    return a.localeCompare(b);
  });

  departments.forEach(function (department) {
    const option = document.createElement('option');
    option.value = department;
    option.textContent = department;
    deptSelect.appendChild(option);
  });

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');
  const initialDept = params.get('dept');

  if (initialQuery) {
    searchInput.value = initialQuery;
  }
  if (initialDept && departments.indexOf(initialDept) !== -1) {
    deptSelect.value = initialDept;
  }

  function hasActiveFilters() {
    return (
      searchInput.value.trim() !== '' ||
      deptSelect.value !== 'all' ||
      levelSelect.value !== 'all' ||
      creditsSelect.value !== 'all' ||
      sortSelect.value !== 'recommended'
    );
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    const department = deptSelect.value;
    const level = levelSelect.value;
    const credits = creditsSelect.value;
    const sort = sortSelect.value;

    let results = COURSES.filter(function (course) {
      if (department !== 'all' && course.department !== department) {
        return false;
      }
      if (level !== 'all' && String(course.level) !== level) {
        return false;
      }
      if (credits !== 'all' && String(course.credits) !== credits) {
        return false;
      }
      if (terms.length) {
        const haystack = (
          course.code +
          ' ' +
          course.title +
          ' ' +
          course.department +
          ' ' +
          course.instructor +
          ' ' +
          course.description +
          ' ' +
          course.mode
        ).toLowerCase();
        return terms.every(function (term) {
          return haystack.indexOf(term) !== -1;
        });
      }
      return true;
    });

    results = results.slice();

    if (sort === 'title') {
      results.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
    } else if (sort === 'credits') {
      results.sort(function (a, b) {
        return a.credits - b.credits || a.title.localeCompare(b.title);
      });
    } else if (sort === 'seats') {
      results.sort(function (a, b) {
        return getAvailableSeats(b) - getAvailableSeats(a);
      });
    }

    grid.innerHTML = results.map(renderCourseCard).join('');
    emptyState.hidden = results.length !== 0;
    grid.hidden = results.length === 0;

    if (results.length === 0) {
      resultsCount.textContent = 'No courses found';
    } else if (hasActiveFilters()) {
      resultsCount.innerHTML =
        '<strong>' +
        results.length +
        '</strong> ' +
        (results.length === 1 ? 'course' : 'courses') +
        ' found';
    } else {
      resultsCount.innerHTML =
        'Showing all <strong>' + results.length + '</strong> courses';
    }
  }

  function resetFilters() {
    searchInput.value = '';
    deptSelect.value = 'all';
    levelSelect.value = 'all';
    creditsSelect.value = 'all';
    sortSelect.value = 'recommended';
    applyFilters();
  }

  searchInput.addEventListener('input', applyFilters);
  deptSelect.addEventListener('change', applyFilters);
  levelSelect.addEventListener('change', applyFilters);
  creditsSelect.addEventListener('change', applyFilters);
  sortSelect.addEventListener('change', applyFilters);
  clearButton.addEventListener('click', resetFilters);
  resetButton.addEventListener('click', resetFilters);

  applyFilters();
});
