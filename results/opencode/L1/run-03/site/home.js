document.addEventListener('DOMContentLoaded', function () {
  const departments = [];
  COURSES.forEach(function (course) {
    const existing = departments.find(function (item) {
      return item.name === course.department;
    });
    if (existing) {
      existing.count += 1;
    } else {
      departments.push({
        name: course.department,
        count: 1,
        color: course.color,
        color2: course.color2
      });
    }
  });

  departments.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  const deptGrid = $('#dept-grid');
  if (deptGrid) {
    deptGrid.innerHTML = departments
      .map(function (department) {
        return (
          '<a class="dept-card" href="catalog.html?dept=' +
          encodeURIComponent(department.name) +
          '" style="--accent:' +
          department.color +
          ';--accent-2:' +
          department.color2 +
          '">' +
          '<span class="dept-mark" aria-hidden="true">' +
          escapeHtml(department.name.charAt(0)) +
          '</span>' +
          '<span class="dept-copy"><strong>' +
          escapeHtml(department.name) +
          '</strong><span class="dept-count">' +
          department.count +
          (department.count === 1 ? ' course' : ' courses') +
          '</span></span>' +
          '</a>'
        );
      })
      .join('');
  }

  const featuredGrid = $('#featured-grid');
  if (featuredGrid) {
    const featured = COURSES.filter(function (course) {
      return course.featured;
    });
    const extras = COURSES.filter(function (course) {
      return !course.featured;
    });
    const selection = featured.concat(extras).slice(0, 6);
    featuredGrid.innerHTML = selection.map(renderCourseCard).join('');
  }

  const courseStat = $('#stat-courses');
  const deptStat = $('#stat-departments');
  const seatStat = $('#stat-seats');

  if (courseStat) {
    courseStat.textContent = String(COURSES.length);
  }
  if (deptStat) {
    deptStat.textContent = String(departments.length);
  }
  if (seatStat) {
    const seats = COURSES.reduce(function (total, course) {
      return total + getAvailableSeats(course);
    }, 0);
    seatStat.textContent = String(seats);
  }
});
