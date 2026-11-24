/**
 * Apex University Course Catalog Page Logic
 * Search, Multi-Filter, Sorting & Course Card Interaction
 */

let pendingEnrollCourseId = null;

document.addEventListener('DOMContentLoaded', () => {
  initDepartmentSelect();
  applyUrlParams();
  setupFilterEventListeners();
  renderCatalog();

  // Listen for registration state changes
  window.addEventListener('apex:state-changed', () => {
    renderCatalog();
  });
});

function initDepartmentSelect() {
  const deptSelect = document.getElementById('filter-department');
  if (!deptSelect) return;

  deptSelect.innerHTML = DEPARTMENTS.map(dept => {
    const val = dept === 'All Departments' ? 'all' : dept;
    return `<option value="${val}">${dept}</option>`;
  }).join('');
}

function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const dept = params.get('dept');
  const level = params.get('level');

  if (q) {
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) searchInput.value = q;
  }

  if (dept) {
    const deptSelect = document.getElementById('filter-department');
    if (deptSelect) deptSelect.value = dept;
  }

  if (level) {
    const levelSelect = document.getElementById('filter-level');
    if (levelSelect) levelSelect.value = level;
  }
}

function setupFilterEventListeners() {
  const searchInput = document.getElementById('catalog-search');
  const deptSelect = document.getElementById('filter-department');
  const levelSelect = document.getElementById('filter-level');
  const creditsSelect = document.getElementById('filter-credits');
  const seatsSelect = document.getElementById('filter-seats');
  const sortSelect = document.getElementById('filter-sort');
  const resetBtn = document.getElementById('btn-reset-filters');

  let debounceTimer = null;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderCatalog();
      }, 200);
    });
  }

  [deptSelect, levelSelect, creditsSelect, seatsSelect, sortSelect].forEach(el => {
    if (el) {
      el.addEventListener('change', () => {
        renderCatalog();
      });
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', resetAllCatalogFilters);
  }
}

window.resetAllCatalogFilters = function() {
  const searchInput = document.getElementById('catalog-search');
  const deptSelect = document.getElementById('filter-department');
  const levelSelect = document.getElementById('filter-level');
  const creditsSelect = document.getElementById('filter-credits');
  const seatsSelect = document.getElementById('filter-seats');
  const sortSelect = document.getElementById('filter-sort');

  if (searchInput) searchInput.value = '';
  if (deptSelect) deptSelect.value = 'all';
  if (levelSelect) levelSelect.value = 'all';
  if (creditsSelect) creditsSelect.value = 'all';
  if (seatsSelect) seatsSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'code-asc';

  // Clear URL params without reloading
  window.history.replaceState({}, '', window.location.pathname);

  renderCatalog();
  App.showToast('All filters have been reset.', 'info');
};

function getFilteredCourses() {
  const searchVal = (document.getElementById('catalog-search')?.value || '').trim().toLowerCase();
  const deptVal = document.getElementById('filter-department')?.value || 'all';
  const levelVal = document.getElementById('filter-level')?.value || 'all';
  const creditsVal = document.getElementById('filter-credits')?.value || 'all';
  const seatsVal = document.getElementById('filter-seats')?.value || 'all';
  const sortVal = document.getElementById('filter-sort')?.value || 'code-asc';

  let results = [...SAMPLE_COURSES];

  // 1. Keyword search (Code, Title, Instructor, Description, Dept)
  if (searchVal) {
    results = results.filter(course => {
      const matchCode = course.code.toLowerCase().includes(searchVal);
      const matchTitle = course.title.toLowerCase().includes(searchVal);
      const matchInstructor = course.instructor.toLowerCase().includes(searchVal);
      const matchDept = course.department.toLowerCase().includes(searchVal);
      const matchDesc = course.description.toLowerCase().includes(searchVal);
      return matchCode || matchTitle || matchInstructor || matchDept || matchDesc;
    });
  }

  // 2. Department filter
  if (deptVal !== 'all') {
    results = results.filter(c => c.department.toLowerCase() === deptVal.toLowerCase());
  }

  // 3. Level filter
  if (levelVal !== 'all') {
    results = results.filter(c => c.level === levelVal);
  }

  // 4. Credits filter
  if (creditsVal !== 'all') {
    results = results.filter(c => String(c.credits) === creditsVal);
  }

  // 5. Seat availability filter
  if (seatsVal === 'open') {
    results = results.filter(c => (c.capacity - c.enrolled) > 0);
  }

  // 6. Sorting
  results.sort((a, b) => {
    switch (sortVal) {
      case 'code-asc':
        return a.code.localeCompare(b.code);
      case 'code-desc':
        return b.code.localeCompare(a.code);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'credits-desc':
        return b.credits - a.credits;
      case 'credits-asc':
        return a.credits - b.credits;
      case 'seats-desc':
        return (b.capacity - b.enrolled) - (a.capacity - a.enrolled);
      default:
        return 0;
    }
  });

  return results;
}

function renderCatalog() {
  const container = document.getElementById('catalog-courses-container');
  const emptyState = document.getElementById('catalog-empty-state');
  const countEl = document.getElementById('catalog-results-count');
  const chipsContainer = document.getElementById('active-filter-chips');

  if (!container) return;

  const courses = getFilteredCourses();

  // Update counts and announcements
  const total = SAMPLE_COURSES.length;
  if (countEl) {
    countEl.textContent = `Showing ${courses.length} of ${total} course${total === 1 ? '' : 's'}`;
  }
  App.announce(`Showing ${courses.length} courses in catalog.`);

  // Update Active Filter Chips
  updateFilterChips(chipsContainer);

  if (courses.length === 0) {
    container.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  container.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  container.innerHTML = courses.map(course => {
    const isEnrolled = App.state.isRegistered(course.id);
    const seatsRemaining = course.capacity - course.enrolled;
    const percentFilled = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));

    let fillClass = 'progress-bar__fill--open';
    if (percentFilled >= 95) fillClass = 'progress-bar__fill--full';
    else if (percentFilled >= 75) fillClass = 'progress-bar__fill--warning';

    return `
      <article class="course-card" aria-labelledby="card-heading-${course.id}">
        <div class="course-card__banner" style="background: ${course.color};"></div>
        <div class="course-card__inner">
          <div class="course-card__header">
            <span class="course-badge course-badge--dept" style="background: ${course.bgColor}; color: ${course.textColor}; border: 1px solid ${course.borderColor};">
              ${course.department}
            </span>
            <span class="course-credits-badge">${course.credits} Credits</span>
          </div>

          <div class="course-card__code">${course.code}</div>
          <h2 class="course-card__title" id="card-heading-${course.id}">${course.title}</h2>
          <p class="course-card__desc">${course.description}</p>

          <ul class="course-card__meta" aria-label="Course Schedule and Details">
            <li class="course-card__meta-item">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span><strong>${course.schedule.daysShort}</strong> &bull; ${course.schedule.time}</span>
            </li>
            <li class="course-card__meta-item">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>${course.instructor}</span>
            </li>
            <li class="course-card__meta-item">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${course.schedule.location}</span>
            </li>
            <li class="course-card__meta-item">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <span>Prereqs: ${course.prerequisites}</span>
            </li>
          </ul>

          <div class="seats-indicator">
            <div class="seats-indicator__header">
              <span>Enrollment: ${course.enrolled} / ${course.capacity} filled</span>
              <span><strong>${seatsRemaining > 0 ? `${seatsRemaining} open` : 'Waitlist only'}</strong></span>
            </div>
            <div class="progress-bar" role="progressbar" aria-valuenow="${percentFilled}" aria-valuemin="0" aria-valuemax="100" aria-label="${percentFilled}% filled">
              <div class="progress-bar__fill ${fillClass}" style="width: ${percentFilled}%;"></div>
            </div>
          </div>

          <div class="course-card__footer">
            <button type="button" class="btn btn--secondary btn--sm" onclick="openCourseDetails('${course.id}', this)" aria-label="View syllabus and details for ${course.code}">
              Details & Syllabus
            </button>
            ${
              isEnrolled
                ? `<a href="profile.html" class="btn btn--success btn--sm" aria-label="${course.code} is registered. View in profile.">
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                    Enrolled ✓
                   </a>`
                : `<button type="button" class="btn btn--primary btn--sm" onclick="promptQuickEnroll('${course.id}', this)" aria-label="Register for ${course.code}">
                    + Register
                   </button>`
            }
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function updateFilterChips(container) {
  if (!container) return;

  const searchVal = (document.getElementById('catalog-search')?.value || '').trim();
  const deptVal = document.getElementById('filter-department')?.value || 'all';
  const levelVal = document.getElementById('filter-level')?.value || 'all';
  const creditsVal = document.getElementById('filter-credits')?.value || 'all';
  const seatsVal = document.getElementById('filter-seats')?.value || 'all';

  const chips = [];

  if (searchVal) {
    chips.push({
      label: `Keyword: "${searchVal}"`,
      clear: () => {
        document.getElementById('catalog-search').value = '';
        renderCatalog();
      }
    });
  }

  if (deptVal !== 'all') {
    chips.push({
      label: `Dept: ${deptVal}`,
      clear: () => {
        document.getElementById('filter-department').value = 'all';
        renderCatalog();
      }
    });
  }

  if (levelVal !== 'all') {
    chips.push({
      label: `Level: ${levelVal}-Level`,
      clear: () => {
        document.getElementById('filter-level').value = 'all';
        renderCatalog();
      }
    });
  }

  if (creditsVal !== 'all') {
    chips.push({
      label: `Credits: ${creditsVal} cr`,
      clear: () => {
        document.getElementById('filter-credits').value = 'all';
        renderCatalog();
      }
    });
  }

  if (seatsVal === 'open') {
    chips.push({
      label: 'Open Seats Only',
      clear: () => {
        document.getElementById('filter-seats').value = 'all';
        renderCatalog();
      }
    });
  }

  window._activeFilterChips = chips;

  container.innerHTML = chips.map((chip, idx) => `
    <span class="chip">
      <span>${chip.label}</span>
      <button type="button" class="chip__remove" onclick="removeFilterChip(${idx})" aria-label="Remove filter ${chip.label}">
        &times;
      </button>
    </span>
  `).join('');
}

window.removeFilterChip = function(index) {
  if (window._activeFilterChips && window._activeFilterChips[index]) {
    window._activeFilterChips[index].clear();
  }
};

window.openCourseDetails = function(courseId, triggerBtn) {
  const course = App.state.getCourse(courseId);
  if (!course) return;

  const badge = document.getElementById('modal-dept-badge');
  const title = document.getElementById('modal-course-title');
  const body = document.getElementById('modal-course-body');
  const regBtn = document.getElementById('modal-register-action-btn');

  badge.textContent = course.department;
  badge.style.backgroundColor = course.bgColor;
  badge.style.color = course.textColor;
  badge.style.border = `1px solid ${course.borderColor}`;

  title.textContent = `${course.code}: ${course.title}`;

  const isEnrolled = App.state.isRegistered(course.id);
  if (isEnrolled) {
    regBtn.textContent = 'Enrolled ✓ (View in Profile)';
    regBtn.className = 'btn btn--success';
    regBtn.onclick = () => {
      window.location.href = 'profile.html';
    };
  } else {
    regBtn.textContent = `Register for ${course.code} (${course.credits} Credits)`;
    regBtn.className = 'btn btn--primary';
    regBtn.onclick = () => {
      App.closeModal();
      promptQuickEnroll(course.id, triggerBtn);
    };
  }

  body.innerHTML = `
    <div style="margin-bottom: 1.25rem;">
      <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--color-text-main);">Course Overview</h3>
      <p style="color: var(--color-text-muted); line-height: 1.6;">${course.description}</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; background: var(--color-bg-base); padding: 1rem; border-radius: var(--radius-md);">
      <div>
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-light); text-transform: uppercase;">Instructor</div>
        <div style="font-weight: 600; color: var(--color-text-main);">${course.instructor}</div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted);">${course.instructorEmail}</div>
      </div>
      <div>
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-light); text-transform: uppercase;">Meeting Schedule</div>
        <div style="font-weight: 600; color: var(--color-text-main);">${course.schedule.daysShort} ${course.schedule.time}</div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted);">${course.schedule.location}</div>
      </div>
      <div>
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-light); text-transform: uppercase;">Prerequisites</div>
        <div style="font-weight: 600; color: var(--color-text-main);">${course.prerequisites}</div>
      </div>
      <div>
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-light); text-transform: uppercase;">Term & Credits</div>
        <div style="font-weight: 600; color: var(--color-text-main);">${course.semester} &bull; ${course.credits} Credits</div>
      </div>
    </div>

    <div>
      <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.6rem; color: var(--color-text-main);">Syllabus Modules</h3>
      <ul style="padding-left: 1.25rem; color: var(--color-text-muted); display: flex; flex-direction: column; gap: 0.35rem;">
        ${course.syllabus.map(topic => `<li>${topic}</li>`).join('')}
      </ul>
    </div>
  `;

  App.openModal('course-details-modal', triggerBtn);
};

window.promptQuickEnroll = function(courseId, triggerBtn) {
  const course = App.state.getCourse(courseId);
  if (!course) return;

  const check = App.state.canRegister(courseId);
  if (!check.allowed) {
    App.showToast(check.reason, 'error');
    return;
  }

  pendingEnrollCourseId = courseId;
  const summaryBox = document.getElementById('confirm-summary-box');
  summaryBox.innerHTML = `
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Course:</span>
      <span class="modal-confirm-value">${course.code} &bull; ${course.title}</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Credits:</span>
      <span class="modal-confirm-value">${course.credits} Semester Units</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Schedule & Location:</span>
      <span class="modal-confirm-value">${course.schedule.daysShort} ${course.schedule.time} (${course.schedule.location})</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Instructor:</span>
      <span class="modal-confirm-value">${course.instructor}</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Grading Basis:</span>
      <span class="modal-confirm-value">Standard Letter Grade (A-F)</span>
    </div>
  `;

  const confirmBtn = document.getElementById('confirm-enroll-btn');
  confirmBtn.onclick = () => {
    const res = App.state.registerCourse(pendingEnrollCourseId, 'Standard Letter Grade (A-F)');
    App.closeModal();
    if (res.success) {
      App.showToast(`Successfully registered for ${res.course.code}!`, 'success');
      renderCatalog();
    } else {
      App.showToast(res.reason, 'error');
    }
  };

  App.openModal('confirm-registration-modal', triggerBtn);
};
