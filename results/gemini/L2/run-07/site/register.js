/**
 * Apex University Course Registration Logic
 * Form Validation, Schedule Conflict Checking, Confirmation Modal & Course Dropping
 */

let pendingEnrollPayload = null;
let pendingDropCourseId = null;

document.addEventListener('DOMContentLoaded', () => {
  initCourseSelect();
  checkUrlCourseParam();
  setupRegistrationEventListeners();
  updateCreditMeter();
  renderSidebarRegisteredList();

  // Listen for registration state changes
  window.addEventListener('apex:state-changed', () => {
    initCourseSelect();
    updateCreditMeter();
    renderSidebarRegisteredList();
  });
});

function initCourseSelect() {
  const select = document.getElementById('select-course');
  if (!select) return;

  const currentSelected = select.value;
  select.innerHTML = '<option value="">-- Choose an available course from catalog --</option>';

  // Group by department
  const depts = {};
  SAMPLE_COURSES.forEach(course => {
    if (!depts[course.department]) depts[course.department] = [];
    depts[course.department].push(course);
  });

  Object.keys(depts).sort().forEach(deptName => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = deptName;

    depts[deptName].forEach(course => {
      const isReg = App.state.isRegistered(course.id);
      const isFull = course.enrolled >= course.capacity;

      const opt = document.createElement('option');
      opt.value = course.id;

      let suffix = '';
      if (isReg) suffix = ' [Enrolled ✓]';
      else if (isFull) suffix = ' [Full - Waitlist]';

      opt.textContent = `${course.code}: ${course.title} (${course.credits} cr) - ${course.schedule.daysShort} ${course.schedule.time}${suffix}`;
      optgroup.appendChild(opt);
    });

    select.appendChild(optgroup);
  });

  if (currentSelected && select.querySelector(`option[value="${currentSelected}"]`)) {
    select.value = currentSelected;
  }
}

function checkUrlCourseParam() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('course');
  if (courseId) {
    const select = document.getElementById('select-course');
    if (select && select.querySelector(`option[value="${courseId}"]`)) {
      select.value = courseId;
      onCourseSelected(courseId);
    }
  }
}

function setupRegistrationEventListeners() {
  const select = document.getElementById('select-course');
  const regForm = document.getElementById('course-registration-form');
  const quickForm = document.getElementById('quick-add-form');
  const clearBtn = document.getElementById('btn-clear-form');
  const confirmEnrollBtn = document.getElementById('confirm-enroll-btn');
  const confirmDropBtn = document.getElementById('confirm-drop-action-btn');

  if (select) {
    select.addEventListener('change', (e) => {
      onCourseSelected(e.target.value);
    });
  }

  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const codeInput = document.getElementById('quick-code-input');
      const val = (codeInput?.value || '').replace(/\s+/g, '').toUpperCase();
      if (!val) return;

      const found = SAMPLE_COURSES.find(c => c.id.toUpperCase() === val || c.code.replace(/\s+/g, '').toUpperCase() === val);
      if (found) {
        select.value = found.id;
        onCourseSelected(found.id);
        App.showToast(`Found ${found.code}: ${found.title}`, 'info');
        // Scroll smoothly to form
        select.focus();
      } else {
        App.showToast(`No course found matching code "${codeInput.value}". Please check catalog.`, 'error');
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      regForm.reset();
      onCourseSelected('');
      clearValidationErrors();
      App.showToast('Registration form cleared.', 'info');
    });
  }

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleRegistrationSubmit();
    });
  }

  if (confirmEnrollBtn) {
    confirmEnrollBtn.addEventListener('click', () => {
      if (!pendingEnrollPayload) return;

      const { courseId, gradingBasis, notes } = pendingEnrollPayload;
      const res = App.state.registerCourse(courseId, gradingBasis, notes);
      App.closeModal();

      if (res.success) {
        App.showToast(`Successfully registered for ${res.course.code}: ${res.course.title}!`, 'success');
        regForm.reset();
        onCourseSelected('');
        clearValidationErrors();
      } else {
        App.showToast(res.reason, 'error');
      }
      pendingEnrollPayload = null;
    });
  }

  if (confirmDropBtn) {
    confirmDropBtn.addEventListener('click', () => {
      if (!pendingDropCourseId) return;

      const res = App.state.dropCourse(pendingDropCourseId);
      App.closeModal();

      if (res.success) {
        App.showToast(`Dropped ${res.course.code}. Credits and seat released.`, 'info');
      } else {
        App.showToast(res.reason, 'error');
      }
      pendingDropCourseId = null;
    });
  }
}

function onCourseSelected(courseId) {
  const previewBox = document.getElementById('selected-course-preview');
  const conflictAlert = document.getElementById('registration-conflict-alert');
  const conflictContent = document.getElementById('conflict-alert-content');
  const submitBtn = document.getElementById('btn-submit-registration');

  if (!courseId) {
    if (previewBox) {
      previewBox.classList.remove('is-active');
      previewBox.innerHTML = '';
    }
    if (conflictAlert) conflictAlert.classList.remove('is-visible');
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  const course = App.state.getCourse(courseId);
  if (!course) return;

  // Render course preview
  previewBox.classList.add('is-active');
  previewBox.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
      <span class="course-badge" style="background: ${course.bgColor}; color: ${course.textColor}; border: 1px solid ${course.borderColor}; font-weight: 700;">
        ${course.department}
      </span>
      <span style="font-weight: 700; color: var(--color-primary-700); font-size: 0.95rem;">
        ${course.credits} Credits &bull; Section 01
      </span>
    </div>
    <div style="font-size: 1.2rem; font-weight: 800; color: var(--color-text-main); margin-bottom: 0.25rem;">
      ${course.code}: ${course.title}
    </div>
    <p style="font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.5; margin-bottom: 0.85rem;">
      ${course.description}
    </p>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.65rem; font-size: 0.85rem; color: var(--color-text-main); background: #ffffff; padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
      <div><strong>Meeting:</strong> ${course.schedule.daysShort} ${course.schedule.time}</div>
      <div><strong>Location:</strong> ${course.schedule.location}</div>
      <div><strong>Instructor:</strong> ${course.instructor}</div>
      <div><strong>Prerequisites:</strong> ${course.prerequisites}</div>
    </div>
  `;

  // Validation Checks
  let hasBlocker = false;
  let blockerHtml = '';

  if (App.state.isRegistered(courseId)) {
    hasBlocker = true;
    blockerHtml = `
      <strong>Already Registered:</strong> You are currently enrolled in ${course.code}. You cannot register twice for the same course.
    `;
  } else {
    // Check credit limit
    const currentCredits = App.state.getTotalCredits();
    const maxCredits = App.state.data.student.maxCreditsPerTerm;
    if (currentCredits + course.credits > maxCredits) {
      hasBlocker = true;
      blockerHtml = `
        <strong>Credit Limit Exceeded:</strong> Adding this course (${course.credits} credits) would raise your load to ${currentCredits + course.credits} credits, which exceeds the maximum term cap of ${maxCredits} credits. Please drop a course first or request an advisor overload waiver.
      `;
    } else {
      // Check schedule conflict
      const conflictCheck = App.state.checkConflicts(courseId);
      if (conflictCheck.hasConflict) {
        hasBlocker = true;
        const c = conflictCheck.conflicts[0];
        blockerHtml = `
          <strong>Schedule Time Conflict Detected!</strong><br>
          ${course.code} (${course.schedule.time} on ${course.schedule.daysShort}) overlaps with your registered course <strong>${c.conflictingCourse.code}: ${c.conflictingCourse.title}</strong> (${c.enrolledTime} on ${c.sharedDays}).
        `;
      }
    }
  }

  if (hasBlocker) {
    conflictAlert.classList.add('is-visible');
    conflictContent.innerHTML = blockerHtml;
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-disabled', 'true');
    App.announce(conflictContent.textContent);
  } else {
    conflictAlert.classList.remove('is-visible');
    conflictContent.innerHTML = '';
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-disabled');
  }
}

function clearValidationErrors() {
  const courseError = document.getElementById('course-error');
  const ackError = document.getElementById('ack-error');
  const courseSelect = document.getElementById('select-course');

  if (courseError) courseError.classList.remove('is-visible');
  if (ackError) ackError.classList.remove('is-visible');
  if (courseSelect) courseSelect.removeAttribute('aria-invalid');
}

function handleRegistrationSubmit() {
  clearValidationErrors();

  const courseSelect = document.getElementById('select-course');
  const ackCheckbox = document.getElementById('ack-prereq');
  const courseError = document.getElementById('course-error');
  const ackError = document.getElementById('ack-error');
  const notes = document.getElementById('reg-notes')?.value || '';

  const courseId = courseSelect.value;
  let hasError = false;

  if (!courseId) {
    courseError.classList.add('is-visible');
    courseSelect.setAttribute('aria-invalid', 'true');
    courseSelect.focus();
    hasError = true;
  }

  if (!ackCheckbox.checked) {
    ackError.classList.add('is-visible');
    if (!hasError) ackCheckbox.focus();
    hasError = true;
  }

  if (hasError) return;

  const course = App.state.getCourse(courseId);
  if (!course) return;

  // Final check
  const check = App.state.canRegister(courseId);
  if (!check.allowed) {
    App.showToast(check.reason, 'error');
    return;
  }

  // Read selected grading option
  const gradingOptionEl = document.querySelector('input[name="gradingBasis"]:checked');
  const gradingBasis = gradingOptionEl ? gradingOptionEl.value : 'Letter Grade (A-F)';

  // Open confirmation modal
  pendingEnrollPayload = {
    courseId,
    gradingBasis,
    notes
  };

  const summaryBox = document.getElementById('confirm-summary-box');
  summaryBox.innerHTML = `
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Student:</span>
      <span class="modal-confirm-value">${App.state.data.student.name} (#${App.state.data.student.id})</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Course:</span>
      <span class="modal-confirm-value">${course.code} &bull; ${course.title}</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Department:</span>
      <span class="modal-confirm-value">${course.department}</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Credits:</span>
      <span class="modal-confirm-value">${course.credits} Semester Units</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Class Schedule:</span>
      <span class="modal-confirm-value">${course.schedule.daysShort} ${course.schedule.time}</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Classroom:</span>
      <span class="modal-confirm-value">${course.schedule.location}</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Instructor:</span>
      <span class="modal-confirm-value">${course.instructor}</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Grading Basis:</span>
      <span class="modal-confirm-value">${gradingBasis}</span>
    </div>
    ${notes ? `
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Special Notes:</span>
      <span class="modal-confirm-value">${notes}</span>
    </div>
    ` : ''}
  `;

  App.openModal('confirm-registration-modal');
}

function updateCreditMeter() {
  const current = App.state.getTotalCredits();
  const max = App.state.data.student.maxCreditsPerTerm;
  const remaining = Math.max(0, max - current);
  const percent = Math.min(100, Math.round((current / max) * 100));

  const labelEl = document.getElementById('reg-credits-label');
  const statusEl = document.getElementById('reg-credits-status');
  const progressEl = document.getElementById('reg-progress-bar');
  const fillEl = document.getElementById('reg-progress-fill');

  if (labelEl) labelEl.textContent = `Credit Load: ${current} / ${max} Credits`;

  if (statusEl) {
    if (remaining === 0) {
      statusEl.textContent = 'Maximum Capacity Reached';
      statusEl.style.color = '#dc2626';
    } else {
      statusEl.textContent = `${remaining} Credit${remaining === 1 ? '' : 's'} Remaining`;
      statusEl.style.color = '#059669';
    }
  }

  if (progressEl) {
    progressEl.setAttribute('aria-valuenow', percent);
  }

  if (fillEl) {
    fillEl.style.width = `${percent}%`;
    fillEl.className = 'progress-bar__fill ' + (percent >= 90 ? 'progress-bar__fill--full' : (percent >= 70 ? 'progress-bar__fill--warning' : 'progress-bar__fill--open'));
  }
}

function renderSidebarRegisteredList() {
  const container = document.getElementById('sidebar-registered-list');
  if (!container) return;

  const courses = App.state.getRegisteredCourses();

  if (courses.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; background: var(--color-bg-base); border-radius: var(--radius-md); color: var(--color-text-muted);">
        No courses registered yet. Select a course from the form to register.
      </div>
    `;
    return;
  }

  container.innerHTML = courses.map(course => `
    <div style="background: var(--color-bg-base); border-radius: var(--radius-md); border-left: 4px solid ${course.color}; padding: 0.85rem; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.25rem;">
        <span style="font-weight: 800; font-size: 0.95rem; color: var(--color-text-main);">${course.code}</span>
        <span class="course-credits-badge" style="font-size: 0.75rem;">${course.credits} cr</span>
      </div>
      <div style="font-size: 0.85rem; font-weight: 600; color: var(--color-text-main); line-height: 1.3; margin-bottom: 0.4rem;">
        ${course.title}
      </div>
      <div style="font-size: 0.78rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">
        ${course.schedule.daysShort} &bull; ${course.schedule.time}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.75rem; color: var(--color-text-light);">${course.gradingBasis || 'Letter Grade'}</span>
        <button type="button" class="btn btn--sm btn--danger" onclick="promptDropCourse('${course.id}', this)" aria-label="Drop ${course.code}">
          Drop
        </button>
      </div>
    </div>
  `).join('');
}

window.promptDropCourse = function(courseId, triggerBtn) {
  const course = App.state.getCourse(courseId);
  if (!course) return;

  pendingDropCourseId = courseId;
  const infoBox = document.getElementById('drop-course-info');
  infoBox.innerHTML = `
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Course:</span>
      <span class="modal-confirm-value">${course.code} &bull; ${course.title}</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Credits to Release:</span>
      <span class="modal-confirm-value">${course.credits} Credits</span>
    </div>
    <div class="modal-confirm-row">
      <span class="modal-confirm-label">Meeting Time:</span>
      <span class="modal-confirm-value">${course.schedule.daysShort} ${course.schedule.time}</span>
    </div>
  `;

  App.openModal('drop-course-modal', triggerBtn);
};
