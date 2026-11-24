/**
 * Apex University Student Profile & Registered Schedule Logic
 * Data Table Rendering, Timetable Visualization, Drop Modal & JSON Export
 */

let pendingDropCourseId = null;

document.addEventListener('DOMContentLoaded', () => {
  renderProfile();
  setupProfileEventListeners();

  // Listen for registration state changes
  window.addEventListener('apex:state-changed', () => {
    renderProfile();
  });
});

function setupProfileEventListeners() {
  const confirmDropBtn = document.getElementById('confirm-drop-action-btn');
  const resetBtn = document.getElementById('profile-reset-demo-btn');

  if (confirmDropBtn) {
    confirmDropBtn.addEventListener('click', () => {
      if (!pendingDropCourseId) return;

      const res = App.state.dropCourse(pendingDropCourseId);
      App.closeModal();

      if (res.success) {
        App.showToast(`Successfully dropped ${res.course.code}.`, 'info');
        renderProfile();
      } else {
        App.showToast(res.reason, 'error');
      }
      pendingDropCourseId = null;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      App.state.resetToDefaults();
      App.showToast('Demo data reset to default (3 enrolled courses).', 'info');
      renderProfile();
    });
  }
}

function renderProfile() {
  renderRegisteredTable();
  renderWeeklyTimetable();
  updateProfileStats();
}

function updateProfileStats() {
  const totalCredits = App.state.getTotalCredits();
  const count = App.state.getRegisteredIds().length;

  const creditsEl = document.getElementById('profile-load-credits');
  const countEl = document.getElementById('profile-load-courses');

  if (creditsEl) creditsEl.textContent = `${totalCredits} cr`;
  if (countEl) countEl.textContent = `${count} Course${count === 1 ? '' : 's'} Registered`;
}

function renderRegisteredTable() {
  const tbody = document.getElementById('registered-table-body');
  const totalCreditsEl = document.getElementById('table-total-credits');
  const fulltimeStatusEl = document.getElementById('table-fulltime-status');

  if (!tbody) return;

  const courses = App.state.getRegisteredCourses();
  const totalCredits = App.state.getTotalCredits();

  if (totalCreditsEl) totalCreditsEl.textContent = `${totalCredits} Credits`;
  if (fulltimeStatusEl) {
    if (totalCredits >= 12) {
      fulltimeStatusEl.textContent = 'Status: Full-Time Student (12+ credits)';
      fulltimeStatusEl.style.color = '#059669';
    } else {
      fulltimeStatusEl.textContent = `Status: Part-Time (${12 - totalCredits} credits to Full-Time)`;
      fulltimeStatusEl.style.color = '#d97706';
    }
  }

  if (courses.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <div style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-main); margin-bottom: 0.5rem;">No Courses Registered for Fall 2026</div>
          <p style="margin-bottom: 1.25rem;">You are not currently enrolled in any classes. Browse the catalog to begin registration.</p>
          <a href="catalog.html" class="btn btn--primary">
            Explore Course Catalog &rarr;
          </a>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = courses.map(course => `
    <tr>
      <th scope="row" style="font-weight: 800; color: var(--color-text-main); white-space: nowrap;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${course.color}; margin-right: 0.5rem;" aria-hidden="true"></span>
        ${course.code}
      </th>
      <td>
        <div style="font-weight: 700; color: var(--color-text-main);">${course.title}</div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted);">${course.department}</div>
      </td>
      <td>
        <div style="font-weight: 600;">${course.instructor}</div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted);">${course.schedule.location}</div>
      </td>
      <td style="white-space: nowrap;">
        <div style="font-weight: 600;">${course.schedule.daysShort}</div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted);">${course.schedule.time}</div>
      </td>
      <td>
        <span class="course-credits-badge">${course.credits} cr</span>
      </td>
      <td>
        <span style="font-size: 0.85rem; font-weight: 600;">${course.gradingBasis || 'Letter Grade (A-F)'}</span>
      </td>
      <td>
        <span class="status-badge status-badge--enrolled">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          Enrolled
        </span>
      </td>
      <td class="no-print" style="white-space: nowrap;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="btn btn--sm btn--secondary" onclick="viewCourseDetails('${course.id}', this)" aria-label="View syllabus for ${course.code}">
            Details
          </button>
          <button type="button" class="btn btn--sm btn--danger" onclick="promptDrop('${course.id}', this)" aria-label="Drop ${course.code}">
            Drop
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderWeeklyTimetable() {
  const container = document.getElementById('timetable-slots-container');
  if (!container) return;

  const hours = [
    { label: '08:00 AM', hour: 8 },
    { label: '09:00 AM', hour: 9 },
    { label: '10:00 AM', hour: 10 },
    { label: '11:00 AM', hour: 11 },
    { label: '12:00 PM', hour: 12 },
    { label: '01:00 PM', hour: 13 },
    { label: '02:00 PM', hour: 14 },
    { label: '03:00 PM', hour: 15 },
    { label: '04:00 PM', hour: 16 },
    { label: '05:00 PM', hour: 17 }
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const registered = App.state.getRegisteredCourses();

  let html = '';

  hours.forEach(timeSlot => {
    // Left column: Time
    html += `<div class="timetable-time-slot">${timeSlot.label}</div>`;

    // 5 Days columns
    days.forEach(day => {
      // Find course matching this day and hour
      const matchingCourses = registered.filter(course => {
        const onThisDay = course.schedule.days.includes(day);
        if (!onThisDay) return false;

        const startH = course.schedule.startHour;
        const endH = startH + course.schedule.durationHours;
        return (timeSlot.hour >= Math.floor(startH) && timeSlot.hour < endH);
      });

      html += `<div class="timetable-day-slot" aria-label="${day} at ${timeSlot.label}">`;

      matchingCourses.forEach(course => {
        const isStartHour = Math.floor(course.schedule.startHour) === timeSlot.hour;
        const endTimeStr = course.schedule.time.includes('-') ? course.schedule.time.split('-')[1].trim() : '';

        if (isStartHour) {
          html += `
            <div class="timetable-event" style="background: ${course.bgColor}; color: ${course.textColor}; border-left-color: ${course.color}; border: 1px solid ${course.borderColor};">
              <div class="timetable-event__title">${course.code} &bull; ${course.title}</div>
              <div class="timetable-event__room">${course.schedule.location} (${course.schedule.time})</div>
            </div>
          `;
        } else {
          html += `
            <div class="timetable-event" style="background: ${course.bgColor}; color: ${course.textColor}; border-left-color: ${course.color}; border: 1px dashed ${course.borderColor}; opacity: 0.9;">
              <div class="timetable-event__title">&darr; ${course.code} (ends ${endTimeStr})</div>
            </div>
          `;
        }
      });

      html += `</div>`;
    });
  });

  container.innerHTML = html;
}

window.viewCourseDetails = function(courseId, triggerBtn) {
  const course = App.state.getCourse(courseId);
  if (!course) return;

  const badge = document.getElementById('modal-dept-badge');
  const title = document.getElementById('modal-course-title');
  const body = document.getElementById('modal-course-body');

  badge.textContent = course.department;
  badge.style.backgroundColor = course.bgColor;
  badge.style.color = course.textColor;
  badge.style.border = `1px solid ${course.borderColor}`;

  title.textContent = `${course.code}: ${course.title}`;

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

window.promptDrop = function(courseId, triggerBtn) {
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

window.exportScheduleJson = function() {
  const registered = App.state.getRegisteredCourses();
  const exportPayload = {
    university: 'Apex University',
    term: 'Fall 2026',
    generatedAt: new Date().toISOString(),
    student: App.state.data.student,
    totalCredits: App.state.getTotalCredits(),
    enrolledCourses: registered.map(c => ({
      code: c.code,
      title: c.title,
      department: c.department,
      credits: c.credits,
      instructor: c.instructor,
      schedule: c.schedule,
      gradingBasis: c.gradingBasis,
      status: c.status
    }))
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `apex-schedule-fall-2026-${App.state.data.student.id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  App.showToast('Schedule exported as JSON.', 'success');
};
