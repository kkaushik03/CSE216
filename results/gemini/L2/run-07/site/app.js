/**
 * Apex University Course Registration System
 * Shared Application State, Accessibility & UI Helpers
 */

const STORAGE_KEY = 'apex_registration_state_v2';

class RegistrationState {
  constructor() {
    this.data = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using in-memory state', e);
    }

    // Default initialization
    const initialRegistrations = {};
    DEFAULT_STUDENT.initialRegisteredIds.forEach(id => {
      initialRegistrations[id] = {
        registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        gradingBasis: id === 'PSYC101' ? 'Pass/No Pass (P/NP)' : 'Letter Grade (A-F)',
        status: 'Enrolled'
      };
    });

    return {
      student: { ...DEFAULT_STUDENT },
      registrations: initialRegistrations
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
    // Dispatch custom event for cross-component reactivity
    window.dispatchEvent(new CustomEvent('apex:state-changed', {
      detail: { state: this.data }
    }));
  }

  getRegisteredIds() {
    return Object.keys(this.data.registrations);
  }

  getRegisteredCourses() {
    const ids = this.getRegisteredIds();
    return ids.map(id => {
      const course = SAMPLE_COURSES.find(c => c.id === id);
      const regMeta = this.data.registrations[id];
      if (!course) return null;
      return {
        ...course,
        ...regMeta
      };
    }).filter(Boolean);
  }

  isRegistered(courseId) {
    return Boolean(this.data.registrations[courseId]);
  }

  getTotalCredits() {
    const registered = this.getRegisteredCourses();
    return registered.reduce((sum, c) => sum + (c.credits || 0), 0);
  }

  getCourse(courseId) {
    return SAMPLE_COURSES.find(c => c.id === courseId) || null;
  }

  checkConflicts(candidateCourseId) {
    const candidate = this.getCourse(candidateCourseId);
    if (!candidate) return { hasConflict: false };

    const registeredCourses = this.getRegisteredCourses();
    const conflicts = [];

    for (const enrolled of registeredCourses) {
      if (enrolled.id === candidateCourseId) continue;

      // Check day overlaps
      const sharedDays = candidate.schedule.days.filter(d => enrolled.schedule.days.includes(d));
      if (sharedDays.length > 0) {
        // Check time overlaps
        const start1 = candidate.schedule.startHour;
        const end1 = start1 + candidate.schedule.durationHours;
        const start2 = enrolled.schedule.startHour;
        const end2 = start2 + enrolled.schedule.durationHours;

        // Overlap condition: start1 < end2 and end1 > start2
        if (start1 < end2 && end1 > start2) {
          conflicts.push({
            conflictingCourse: enrolled,
            sharedDays: sharedDays.join(', '),
            candidateTime: candidate.schedule.time,
            enrolledTime: enrolled.schedule.time
          });
        }
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts
    };
  }

  canRegister(courseId) {
    if (this.isRegistered(courseId)) {
      return {
        allowed: false,
        reason: 'You are already registered for this course.'
      };
    }

    const course = this.getCourse(courseId);
    if (!course) {
      return {
        allowed: false,
        reason: 'Course not found in catalog.'
      };
    }

    const currentCredits = this.getTotalCredits();
    const maxCredits = this.data.student.maxCreditsPerTerm;
    if (currentCredits + course.credits > maxCredits) {
      return {
        allowed: false,
        reason: `Adding this course (${course.credits} cr) exceeds your term limit of ${maxCredits} credits. Current: ${currentCredits} cr.`
      };
    }

    const conflictCheck = this.checkConflicts(courseId);
    if (conflictCheck.hasConflict) {
      const c = conflictCheck.conflicts[0];
      return {
        allowed: false,
        reason: `Schedule conflict with ${c.conflictingCourse.code} (${c.conflictingCourse.schedule.time} on ${c.sharedDays}).`,
        conflicts: conflictCheck.conflicts
      };
    }

    return { allowed: true };
  }

  registerCourse(courseId, gradingBasis = 'Letter Grade (A-F)', accommodations = '') {
    const check = this.canRegister(courseId);
    if (!check.allowed) {
      return { success: false, reason: check.reason };
    }

    this.data.registrations[courseId] = {
      registeredAt: new Date().toISOString(),
      gradingBasis: gradingBasis,
      accommodations: accommodations || 'None requested',
      status: 'Enrolled'
    };

    // Increment enrolled count in sample data in memory for this session
    const course = this.getCourse(courseId);
    if (course && course.enrolled < course.capacity) {
      course.enrolled += 1;
    }

    this.saveState();
    return { success: true, course };
  }

  dropCourse(courseId) {
    if (!this.isRegistered(courseId)) {
      return { success: false, reason: 'Course not registered.' };
    }

    const course = this.getCourse(courseId);
    delete this.data.registrations[courseId];

    // Decrement enrolled count
    if (course && course.enrolled > 0) {
      course.enrolled -= 1;
    }

    this.saveState();
    return { success: true, course };
  }

  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.loadState();
    this.saveState();
  }
}

// Global App State Instance
const App = {
  state: new RegistrationState(),

  init() {
    this.setupNavbar();
    this.setupLiveAnnouncer();
    this.setupModals();
    this.updateNavBadges();

    // Listen for state changes
    window.addEventListener('apex:state-changed', () => {
      this.updateNavBadges();
    });
  },

  // Accessible live announcer for screen readers
  setupLiveAnnouncer() {
    if (!document.getElementById('a11y-announcer')) {
      const el = document.createElement('div');
      el.id = 'a11y-announcer';
      el.className = 'sr-only';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      document.body.appendChild(el);
    }
  },

  announce(message) {
    const el = document.getElementById('a11y-announcer');
    if (el) {
      // Clear then set to re-trigger assistive tech
      el.textContent = '';
      setTimeout(() => {
        el.textContent = message;
      }, 50);
    }
  },

  // Toast Notification System
  showToast(message, type = 'info', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast__icon" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="toast__icon" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg class="toast__icon" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`;
    } else {
      iconSvg = `<svg class="toast__icon" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`;
    }

    toast.innerHTML = `
      <div class="toast__content">
        ${iconSvg}
        <span class="toast__message">${message}</span>
      </div>
      <button type="button" class="toast__close" aria-label="Dismiss notification">
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast__close');
    const dismiss = () => {
      toast.classList.add('toast--closing');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    };

    closeBtn.addEventListener('click', dismiss);
    container.appendChild(toast);

    // Announce via screen reader
    this.announce(message);

    setTimeout(dismiss, duration);
  },

  // Navigation Setup
  setupNavbar() {
    const navToggle = document.querySelector('.navbar__toggle');
    const navMenu = document.querySelector('.navbar__menu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navMenu.classList.toggle('is-open', !expanded);
      });

      // Close when pressing Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.focus();
        }
      });
    }

    // Highlight active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  },

  updateNavBadges() {
    const totalCredits = this.state.getTotalCredits();
    const count = this.state.getRegisteredIds().length;

    document.querySelectorAll('[data-bind="nav-credits"]').forEach(el => {
      el.textContent = `${totalCredits} cr`;
    });

    document.querySelectorAll('[data-bind="nav-count"]').forEach(el => {
      el.textContent = `${count}`;
    });

    document.querySelectorAll('[data-bind="nav-summary"]').forEach(el => {
      el.textContent = `${count} courses (${totalCredits} cr)`;
    });
  },

  // Accessible Modal Controller with Focus Trapping
  activeModal: null,
  previousActiveElement: null,

  setupModals() {
    // Backdrop click and close button listeners
    document.addEventListener('click', (e) => {
      const closeTarget = e.target.closest('[data-close-modal]');
      const isBackdropClick = this.activeModal && e.target === this.activeModal;
      if (closeTarget || isBackdropClick) {
        this.closeModal();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });
  },

  openModal(modalId, triggerElement = null) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.previousActiveElement = triggerElement || document.activeElement;
    this.activeModal = modal;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focusable elements inside modal
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      // Delay slight tick for layout
      setTimeout(() => firstFocusable.focus(), 50);

      // Focus trap handler
      this._focusTrapHandler = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        }
      };

      modal.addEventListener('keydown', this._focusTrapHandler);
    }
  },

  closeModal() {
    if (!this.activeModal) return;

    const modal = this.activeModal;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (this._focusTrapHandler) {
      modal.removeEventListener('keydown', this._focusTrapHandler);
      this._focusTrapHandler = null;
    }

    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
    }

    this.activeModal = null;
    this.previousActiveElement = null;
  }
};

// Expose globally
if (typeof window !== 'undefined') {
  window.App = App;
  window.RegistrationState = RegistrationState;
}
if (typeof global !== 'undefined') {
  global.App = App;
  global.RegistrationState = RegistrationState;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
