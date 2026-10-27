/* Shared utilities: storage, navigation, live announcements and dialogs. */
(function () {
  'use strict';

  var DATA = window.UCR_DATA;
  var REG_KEY = 'ucr.registrations.v1';
  var PROFILE_KEY = 'ucr.profile.v1';

  var DEFAULT_REGISTRATIONS = [
    { courseId: 'CS101', grading: 'letter', date: '2026-10-15' },
    { courseId: 'MATH210', grading: 'letter', date: '2026-10-15' }
  ];
  var DEFAULT_PROFILE = {
    studentId: 'S2024581',
    fullName: 'Jordan Rivera',
    email: 'jordan.rivera@northfield.edu',
    year: 'Sophomore',
    program: 'B.S. Computer Science',
    advisor: 'Dr. Amara Okafor'
  };
  var GRADING_LABELS = { letter: 'Letter grade', passfail: 'Pass / Fail', audit: 'Audit (no credit)' };

  /* ---------- Storage (falls back to memory if localStorage is blocked) ---------- */
  var memory = {};
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return key in memory ? memory[key] : fallback;
    }
  }
  function write(key, value) {
    memory[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* memory only */ }
  }

  function getRegistrations() {
    var regs = read(REG_KEY, null);
    if (!Array.isArray(regs)) {
      regs = DEFAULT_REGISTRATIONS.slice();
      write(REG_KEY, regs);
    }
    return regs.filter(function (r) { return getCourse(r.courseId); });
  }
  function addRegistration(reg) {
    var regs = getRegistrations().filter(function (r) { return r.courseId !== reg.courseId; });
    regs.push(reg);
    write(REG_KEY, regs);
  }
  function removeRegistration(courseId) {
    write(REG_KEY, getRegistrations().filter(function (r) { return r.courseId !== courseId; }));
  }
  function isRegistered(courseId) {
    return getRegistrations().some(function (r) { return r.courseId === courseId; });
  }
  function getProfile() {
    var p = read(PROFILE_KEY, null);
    return Object.assign({}, DEFAULT_PROFILE, p || {});
  }
  function saveProfile(updates) {
    write(PROFILE_KEY, Object.assign(getProfile(), updates));
  }

  /* ---------- Course helpers ---------- */
  function getCourse(id) {
    for (var i = 0; i < DATA.courses.length; i++) {
      if (DATA.courses[i].id === id) return DATA.courses[i];
    }
    return null;
  }
  function courseCode(c) { return c.dept + ' ' + c.number; }
  function deptName(c) { return DATA.departments[c.dept]; }

  function formatTime(t) {
    var parts = t.split(':');
    var h = parseInt(parts[0], 10);
    var suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + parts[1] + ' ' + suffix;
  }
  function formatSchedule(c) {
    return c.days.join(', ') + ', ' + formatTime(c.start) + ' to ' + formatTime(c.end);
  }
  function seatsText(c) {
    if (c.seats === 0) return 'No seats available (' + c.capacity + ' capacity)';
    return c.seats + ' of ' + c.capacity + ' seats open';
  }

  /** Credits that count toward the term load (audits carry none). */
  function creditsFor(reg) {
    var c = getCourse(reg.courseId);
    return c && reg.grading !== 'audit' ? c.credits : 0;
  }
  function totalCredits(regs) {
    return (regs || getRegistrations()).reduce(function (sum, r) { return sum + creditsFor(r); }, 0);
  }

  function toMinutes(t) {
    var p = t.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  /** Returns the first registered course whose meeting time overlaps `course`, or null. */
  function findConflict(course, regs) {
    regs = regs || getRegistrations();
    for (var i = 0; i < regs.length; i++) {
      var other = getCourse(regs[i].courseId);
      if (!other || other.id === course.id) continue;
      var sharesDay = other.days.some(function (d) { return course.days.indexOf(d) !== -1; });
      if (sharesDay && toMinutes(course.start) < toMinutes(other.end) && toMinutes(other.start) < toMinutes(course.end)) {
        return other;
      }
    }
    return null;
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /* ---------- Screen reader announcements ---------- */
  var liveRegion;
  function ensureLiveRegion() {
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.className = 'visually-hidden';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }
    return liveRegion;
  }
  function announce(message) {
    var region = ensureLiveRegion();
    region.textContent = '';
    // A short delay ensures repeated identical messages are still announced.
    window.setTimeout(function () { region.textContent = message; }, 100);
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    if (!toggle) return;
    var nav = document.getElementById(toggle.getAttribute('aria-controls'));

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true' && nav.contains(document.activeElement)) {
        setOpen(false);
        toggle.focus();
      }
    });
    var wide = window.matchMedia('(min-width: 48em)');
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onChange);
  }

  /* ---------- Accessible confirmation dialog ---------- */
  var dialog;
  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'modal';
    dialog.id = 'confirm-dialog';
    dialog.setAttribute('aria-labelledby', 'confirm-dialog-title');
    dialog.setAttribute('aria-describedby', 'confirm-dialog-message');
    dialog.innerHTML =
      '<form method="dialog" class="modal-inner">' +
        '<div class="modal-header">' +
          '<h2 id="confirm-dialog-title"></h2>' +
          '<button type="submit" value="cancel" class="modal-close" aria-label="Close dialog"><span aria-hidden="true">&times;</span></button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<p id="confirm-dialog-message"></p>' +
          '<div id="confirm-dialog-details"></div>' +
        '</div>' +
        '<div class="modal-actions">' +
          '<button type="submit" value="cancel" class="btn btn-secondary" data-role="cancel"></button>' +
          '<button type="submit" value="confirm" class="btn" data-role="confirm"></button>' +
        '</div>' +
      '</form>';
    document.body.appendChild(dialog);

    // Clicking the dimmed backdrop (outside the dialog box) cancels.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close('cancel');
    });
    return dialog;
  }

  /**
   * Opens a modal confirmation dialog.
   * options: title, message, details (HTML string, already escaped), confirmLabel,
   *          cancelLabel, danger (bool), onConfirm(), onCancel()
   * Focus is trapped by the native <dialog>; Escape cancels; focus returns to
   * the triggering control unless onConfirm moves it somewhere more useful.
   */
  function confirmDialog(options) {
    var dlg = ensureDialog();
    var opener = document.activeElement;
    var confirmBtn = dlg.querySelector('[data-role="confirm"]');
    var cancelBtn = dlg.querySelector('[data-role="cancel"]');

    dlg.querySelector('#confirm-dialog-title').textContent = options.title;
    dlg.querySelector('#confirm-dialog-message').textContent = options.message;
    dlg.querySelector('#confirm-dialog-details').innerHTML = options.details || '';
    confirmBtn.textContent = options.confirmLabel || 'Confirm';
    cancelBtn.textContent = options.cancelLabel || 'Cancel';
    confirmBtn.className = 'btn ' + (options.danger ? 'btn-danger' : 'btn-primary');
    dlg.classList.toggle('is-danger', !!options.danger);
    dlg.returnValue = '';

    dlg.addEventListener('close', function handleClose() {
      dlg.removeEventListener('close', handleClose);
      document.body.style.overflow = '';
      if (dlg.returnValue === 'confirm') {
        if (options.onConfirm) options.onConfirm();
      } else {
        if (options.onCancel) options.onCancel();
        if (opener && document.contains(opener)) opener.focus();
      }
    });

    document.body.style.overflow = 'hidden';
    dlg.showModal();
    // For destructive actions, start on the safe choice.
    (options.danger ? cancelBtn : confirmBtn).focus();
  }

  /* ---------- Rendering helpers shared by several pages ---------- */
  function modeTagClass(mode) {
    return 'tag tag-' + mode.toLowerCase().replace(/\s+/g, '');
  }

  window.UCR = {
    data: DATA,
    gradingLabels: GRADING_LABELS,
    getRegistrations: getRegistrations,
    addRegistration: addRegistration,
    removeRegistration: removeRegistration,
    isRegistered: isRegistered,
    getProfile: getProfile,
    saveProfile: saveProfile,
    getCourse: getCourse,
    courseCode: courseCode,
    deptName: deptName,
    formatTime: formatTime,
    formatSchedule: formatSchedule,
    seatsText: seatsText,
    creditsFor: creditsFor,
    totalCredits: totalCredits,
    findConflict: findConflict,
    escapeHTML: escapeHTML,
    announce: announce,
    confirmDialog: confirmDialog,
    modeTagClass: modeTagClass
  };

  document.addEventListener('DOMContentLoaded', function () {
    ensureLiveRegion();
    initNav();
  });
})();
