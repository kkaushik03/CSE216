const $ = function (selector, root) {
  return (root || document).querySelector(selector);
};

const $$ = function (selector, root) {
  return Array.prototype.slice.call((root || document).querySelectorAll(selector));
};

const ICONS = {
  clock:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  user:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.3 3.4-5 7-5s6.2 1.7 7 5"/></svg>',
  pin:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  arrow:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>',
  info:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  book:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z"/></svg>',
  sparkle:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>'
};

function icon(name) {
  return ICONS[name] || '';
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
  });
}

function getInitials(name) {
  return String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(function (part) {
      return part.charAt(0).toUpperCase();
    })
    .join('') || 'GS';
}

function getAvailableSeats(course) {
  return Math.max(course.capacity - course.enrolled, 0);
}

function renderCourseCard(course) {
  const available = getAvailableSeats(course);
  const fill = Math.max(4, Math.round((available / course.capacity) * 100));
  const action = available
    ? '<a class="btn btn-small btn-gradient" href="register.html?course=' +
      encodeURIComponent(course.id) +
      '">Add course ' +
      icon('arrow') +
      '</a>'
    : '<span class="btn btn-small btn-disabled">Course full</span>';

  return (
    '<article class="course-card" style="--accent:' +
    course.color +
    ';--accent-2:' +
    course.color2 +
    '">' +
    '<div class="course-top">' +
    '<span class="course-code">' +
    escapeHtml(course.code) +
    '</span>' +
    '<span class="pill pill-soft">' +
    course.credits +
    ' credits</span>' +
    '</div>' +
    '<h3 class="course-title">' +
    escapeHtml(course.title) +
    '</h3>' +
    '<p class="course-desc">' +
    escapeHtml(course.description) +
    '</p>' +
    '<ul class="course-meta">' +
    '<li>' +
    icon('user') +
    '<span>' +
    escapeHtml(course.instructor) +
    '</span></li>' +
    '<li>' +
    icon('clock') +
    '<span>' +
    escapeHtml(course.schedule) +
    '</span></li>' +
    '<li>' +
    icon('pin') +
    '<span>' +
    escapeHtml(course.mode) +
    ' · Level ' +
    course.level +
    '</span></li>' +
    '</ul>' +
    '<div class="seat-meter">' +
    '<div class="seat-label"><span>Seats remaining</span><span>' +
    (available ? '<strong>' + available + '</strong> of ' + course.capacity : '<strong>Full</strong>') +
    '</span></div>' +
    '<div class="meter"><span style="width:' +
    fill +
    '%"></span></div>' +
    '</div>' +
    '<div class="course-footer">' +
    '<span class="course-dept">' +
    escapeHtml(course.department) +
    '</span>' +
    action +
    '</div>' +
    '</article>'
  );
}

function renderRegistrationRows(registrations) {
  return registrations
    .map(function (registration) {
      const course = getCourseById(registration.courseId);
      if (!course) {
        return '';
      }
      return (
        '<tr data-reg-id="' +
        escapeHtml(registration.id) +
        '" style="--accent:' +
        course.color +
        ';--accent-2:' +
        course.color2 +
        '">' +
        '<td><div class="cell-course"><span class="cell-dot"></span><div><strong>' +
        escapeHtml(course.code) +
        '</strong><span>' +
        escapeHtml(course.title) +
        '</span></div></div></td>' +
        '<td>' +
        escapeHtml(course.instructor) +
        '</td>' +
        '<td>' +
        escapeHtml(course.schedule) +
        '</td>' +
        '<td><span class="pill pill-soft">' +
        course.credits +
        ' cr</span></td>' +
        '<td>' +
        escapeHtml(registration.semester) +
        '</td>' +
        '<td class="cell-action"><button class="icon-btn js-remove-registration" type="button" data-id="' +
        escapeHtml(registration.id) +
        '" aria-label="Remove ' +
        escapeHtml(course.code) +
        '">' +
        icon('trash') +
        '</button></td>' +
        '</tr>'
      );
    })
    .join('');
}

function showToast(message, type) {
  const stack = $('.toast-stack') || document.createElement('div');
  if (!stack.parentNode) {
    stack.className = 'toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + (type || 'success');
  toast.innerHTML =
    '<span class="toast-icon">' +
    icon(type === 'error' ? 'info' : type === 'info' ? 'info' : 'check') +
    '</span><p>' +
    escapeHtml(message) +
    '</p>';
  stack.appendChild(toast);

  window.setTimeout(function () {
    toast.classList.add('is-leaving');
    window.setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3600);
}

function openModal(options) {
  const settings = Object.assign(
    {
      title: 'Confirm',
      subtitle: '',
      body: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      danger: false,
      hideCancel: false
    },
    options || {}
  );

  return new Promise(function (resolve) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<div class="modal-header">' +
      '<span class="modal-icon ' +
      (settings.danger ? 'is-danger' : '') +
      '">' +
      icon(settings.danger ? 'trash' : 'check') +
      '</span>' +
      '<div><h2 id="modal-title">' +
      escapeHtml(settings.title) +
      '</h2>' +
      (settings.subtitle ? '<p>' + escapeHtml(settings.subtitle) + '</p>' : '') +
      '</div>' +
      '</div>' +
      '<div class="modal-body">' +
      settings.body +
      '</div>' +
      '<div class="modal-actions">' +
      (settings.hideCancel
        ? ''
        : '<button class="btn btn-ghost" type="button" data-modal-cancel>' +
          escapeHtml(settings.cancelText) +
          '</button>') +
      '<button class="btn ' +
      (settings.danger ? 'btn-danger' : 'btn-primary') +
      '" type="button" data-modal-confirm>' +
      escapeHtml(settings.confirmText) +
      '</button>' +
      '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');

    let isClosed = false;
    const confirmButton = $('[data-modal-confirm]', overlay);
    const cancelButton = $('[data-modal-cancel]', overlay);

    function onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(false);
        return;
      }

      if (event.key === 'Tab') {
        const focusable = $$(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          overlay
        );
        if (!focusable.length) {
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    function close(result) {
      if (isClosed) {
        return;
      }
      isClosed = true;
      document.removeEventListener('keydown', onKeydown);
      overlay.classList.add('is-closing');
      window.setTimeout(function () {
        overlay.remove();
        if (!$('.modal-overlay')) {
          document.body.classList.remove('modal-open');
        }
        resolve(result);
      }, 180);
    }

    document.addEventListener('keydown', onKeydown);
    confirmButton.addEventListener('click', function () {
      close(true);
    });
    if (cancelButton) {
      cancelButton.addEventListener('click', function () {
        close(false);
      });
    }
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) {
        close(false);
      }
    });

    window.requestAnimationFrame(function () {
      confirmButton.focus();
    });
  });
}

function refreshRegistrationCount() {
  const count = getRegistrations().length;
  $$('.js-reg-count').forEach(function (badge) {
    badge.textContent = String(count);
    badge.hidden = count === 0;
  });
}

function initNavigation() {
  const toggle = $('.nav-toggle');
  const nav = $('#primary-nav');
  const header = $('.site-header');
  const page = document.body.getAttribute('data-page');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    $$('a', nav).forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (event) {
      if (!header.contains(event.target)) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (page) {
    const activeLink = $('[data-nav="' + page + '"]');
    if (activeLink) {
      activeLink.classList.add('is-active');
      activeLink.setAttribute('aria-current', 'page');
    }
  }
}

function initApp() {
  initNavigation();
  $$('.js-year').forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });
  refreshRegistrationCount();
}

document.addEventListener('DOMContentLoaded', initApp);
