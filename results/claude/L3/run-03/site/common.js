/* Shared helpers: storage, navigation, status messages, course cards,
   registered-courses table and the drop confirmation dialog. */
(function () {
  'use strict';

  var DATA = window.UCR_DATA;
  var KEYS = {
    registrations: 'ucr.registrations',
    profile: 'ucr.profile',
    waitlist: 'ucr.waitlist'
  };

  /* ---------- Storage ---------- */
  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* Storage can be unavailable (private mode); the app still works for this page view. */
    }
  }

  var Store = {
    getRegistrations: function () { return read(KEYS.registrations, []); },
    isRegistered: function (code) {
      return Store.getRegistrations().some(function (r) { return r.code === code; });
    },
    addRegistration: function (reg) {
      var list = Store.getRegistrations().filter(function (r) { return r.code !== reg.code; });
      list.push(reg);
      write(KEYS.registrations, list);
      Store.removeWaitlist(reg.code);
    },
    removeRegistration: function (code) {
      write(KEYS.registrations, Store.getRegistrations().filter(function (r) { return r.code !== code; }));
    },
    getProfile: function () {
      return Object.assign({ name: '', email: '', studentId: '', major: '', year: '' }, read(KEYS.profile, {}));
    },
    saveProfile: function (profile) {
      write(KEYS.profile, Object.assign(Store.getProfile(), profile));
    },
    getWaitlist: function () { return read(KEYS.waitlist, []); },
    isWaitlisted: function (code) { return Store.getWaitlist().indexOf(code) !== -1; },
    addWaitlist: function (code) {
      var list = Store.getWaitlist();
      if (list.indexOf(code) === -1) list.push(code);
      write(KEYS.waitlist, list);
    },
    removeWaitlist: function (code) {
      write(KEYS.waitlist, Store.getWaitlist().filter(function (c) { return c !== code; }));
    }
  };

  /* ---------- Course helpers ---------- */
  function findCourse(code) {
    return DATA.courses.filter(function (c) { return c.code === code; })[0] || null;
  }
  function deptName(id) {
    var d = DATA.departments.filter(function (x) { return x.id === id; })[0];
    return d ? d.name : id;
  }
  function seatsLeft(course) {
    var extra = Store.isRegistered(course.code) ? 1 : 0;
    return Math.max(0, course.capacity - course.enrolled - extra);
  }
  function availability(course) {
    var left = seatsLeft(course);
    if (left === 0) return { state: 'full', icon: '✕', text: 'Full' };
    if (left <= 5) return { state: 'few', icon: '!', text: 'Few seats: ' + left + ' left' };
    return { state: 'open', icon: '✓', text: 'Open: ' + left + ' seats left' };
  }
  function slug(code) { return code.replace(/\s+/g, '-').toLowerCase(); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'text') node.textContent = attrs[k];
        else if (k === 'className') node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function badge(className, icon, text) {
    return el('span', { className: 'badge ' + className }, [
      el('span', { 'aria-hidden': 'true', text: icon }),
      ' ' + text
    ]);
  }

  /* Course card: <li><article> with an h3 and one main action. */
  function createCourseCard(course, options) {
    options = options || {};
    var id = 'course-' + slug(course.code);
    var avail = availability(course);
    var registered = Store.isRegistered(course.code);
    var waitlisted = Store.isWaitlisted(course.code);

    var badges = el('div', { className: 'card-badges' }, [
      el('span', { className: 'badge badge-dept', text: deptName(course.dept) }),
      registered
        ? badge('badge-registered', '✓', 'Registered')
        : badge('badge-' + avail.state, avail.icon, avail.text),
      waitlisted && !registered ? badge('badge-waitlist', '⏳', 'On waitlist') : null
    ]);

    var heading = el('h3', { id: id + '-title' }, [
      el('span', { className: 'course-code', text: course.code }),
      course.title
    ]);

    var meta = el('dl', { className: 'course-meta' }, [
      el('div', null, [el('dt', { text: 'Instructor' }), el('dd', { text: course.instructor })]),
      el('div', null, [el('dt', { text: 'Schedule' }), el('dd', { text: course.days + ', ' + course.time })]),
      el('div', null, [el('dt', { text: 'Credits' }), el('dd', { text: String(course.credits) })]),
      el('div', null, [el('dt', { text: 'Level' }), el('dd', { text: course.level + '-level' })])
    ]);

    var action;
    if (registered) {
      action = el('a', {
        className: 'btn btn-secondary',
        href: 'profile.html#registered-heading',
        'aria-label': 'View registration for ' + course.code + ' ' + course.title
      }, ['View registration']);
    } else if (avail.state === 'full') {
      action = el('button', {
        type: 'button',
        className: 'btn ' + (waitlisted ? 'btn-secondary' : 'btn-teal'),
        'data-waitlist': course.code,
        'aria-label': (waitlisted ? 'Leave waitlist for ' : 'Join waitlist for ') + course.code + ' ' + course.title
      }, [waitlisted ? 'Leave waitlist' : 'Join waitlist']);
    } else {
      action = el('a', {
        className: 'btn btn-primary',
        href: 'register.html?course=' + encodeURIComponent(course.code),
        'aria-label': 'Register for ' + course.code + ' ' + course.title
      }, ['Register']);
    }

    var article = el('article', {
      className: 'course-card dept-' + course.dept,
      'aria-labelledby': id + '-title'
    }, [
      badges,
      heading,
      el('p', { text: course.description }),
      meta,
      el('div', { className: 'card-action' }, [action])
    ]);

    return el('li', { 'data-code': course.code }, [article]);
  }

  /* Waitlist toggle inside any card list. Keeps focus on the same (re-labelled) button. */
  function bindWaitlist(listEl, onChange) {
    listEl.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-waitlist]');
      if (!button) return;
      var code = button.getAttribute('data-waitlist');
      var course = findCourse(code);
      var joining = !Store.isWaitlisted(code);
      if (joining) Store.addWaitlist(code); else Store.removeWaitlist(code);

      var li = button.closest('li');
      var fresh = createCourseCard(course);
      li.replaceWith(fresh);
      var newButton = fresh.querySelector('button[data-waitlist]');
      if (newButton) newButton.focus();

      announce(joining
        ? 'You joined the waitlist for ' + code + ' ' + course.title + '.'
        : 'You left the waitlist for ' + code + ' ' + course.title + '.');
      if (onChange) onChange();
    });
  }

  /* ---------- Status messages ---------- */
  var announceTimer;
  function announce(message) {
    var region = document.getElementById('status');
    if (!region) return;
    window.clearTimeout(announceTimer);
    region.textContent = '';
    announceTimer = window.setTimeout(function () { region.textContent = message; }, 100);
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    document.documentElement.classList.add('js');
    var toggle = document.querySelector('.menu-toggle');
    var menu = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.classList.toggle('is-open', open);
    }
    setOpen(false);

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (document.querySelector('dialog[open]')) return;
      setOpen(false);
      toggle.focus();
    });
  }

  /* ---------- Generic dialog helper ---------- */
  /* Opens a native <dialog> modally, focuses the least destructive control, and on close
     returns focus to the opener, or to fallback() when the opener is gone. */
  function openDialog(dialog, opts) {
    var opener = opts.opener || document.activeElement;
    var confirmBtn = dialog.querySelector('[data-dialog-confirm]');
    var cancelBtn = dialog.querySelector('[data-dialog-cancel]');
    var confirmed = false;

    function onConfirm() { confirmed = true; dialog.close(); }
    function onCancel() { dialog.close(); }
    function onClose() {
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
      dialog.removeEventListener('close', onClose);
      if (confirmed && opts.onConfirm) opts.onConfirm();
      var target = opener && document.body.contains(opener) ? opener : (opts.fallback ? opts.fallback() : null);
      if (target) target.focus();
    }

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
    dialog.addEventListener('close', onClose);
    dialog.showModal();
    cancelBtn.focus();
  }

  /* ---------- Registered courses table ---------- */
  function initRegisteredTable(container, options) {
    options = options || {};
    var dialog = document.getElementById('drop-dialog');
    var heading = document.getElementById(options.headingId || 'registered-heading');

    function render() {
      var regs = Store.getRegistrations();
      container.textContent = '';

      if (!regs.length) {
        container.appendChild(el('div', { className: 'empty-state' }, [
          el('p', { text: 'You have not registered for any courses yet.' }),
          el('a', { href: 'catalog.html' }, ['Browse the course catalog'])
        ]));
        if (options.onRender) options.onRender(regs);
        return;
      }

      var totalCredits = 0;
      var tbody = el('tbody');
      regs.forEach(function (reg) {
        var c = findCourse(reg.code);
        if (!c) return;
        totalCredits += c.credits;
        var dropBtn = el('button', {
          type: 'button',
          className: 'btn btn-danger btn-small',
          'data-drop': c.code,
          'aria-label': 'Drop ' + c.code + ' ' + c.title
        }, ['Drop']);
        tbody.appendChild(el('tr', null, [
          el('th', { scope: 'row' }, [el('span', { className: 'cell-code', text: c.code }), c.title]),
          el('td', { text: deptName(c.dept) }),
          el('td', { text: String(c.credits) }),
          el('td', { text: c.days + ', ' + c.time }),
          el('td', { text: c.instructor }),
          el('td', { text: reg.term }),
          el('td', { text: reg.grading }),
          el('td', null, [dropBtn])
        ]));
      });

      var count = regs.length;
      var table = el('table', null, [
        el('caption', {
          text: 'Registered courses: ' + count + (count === 1 ? ' course, ' : ' courses, ') + totalCredits + ' credits'
        }),
        el('thead', null, [el('tr', null, ['Course', 'Department', 'Credits', 'Schedule', 'Instructor', 'Term', 'Grading', 'Action']
          .map(function (h) { return el('th', { scope: 'col', text: h }); }))]),
        tbody,
        el('tfoot', null, [el('tr', null, [
          el('th', { scope: 'row', text: 'Total' }),
          el('td'),
          el('td', { text: String(totalCredits) }),
          el('td', { colspan: '5' })
        ])])
      ]);

      container.appendChild(el('div', {
        className: 'table-wrap',
        role: 'region',
        tabindex: '0',
        'aria-label': 'Registered courses table, scrolls sideways'
      }, [table]));

      if (options.onRender) options.onRender(regs);
    }

    container.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-drop]');
      if (!button) return;
      var code = button.getAttribute('data-drop');
      var course = findCourse(code);
      var allButtons = Array.prototype.slice.call(container.querySelectorAll('button[data-drop]'));
      var index = allButtons.indexOf(button);

      dialog.querySelector('[data-dialog-course]').textContent = code + ' ' + course.title;
      openDialog(dialog, {
        opener: button,
        onConfirm: function () {
          Store.removeRegistration(code);
          render();
          announce('Dropped ' + code + ' ' + course.title + '.');
        },
        fallback: function () {
          var remaining = container.querySelectorAll('button[data-drop]');
          if (remaining.length) return remaining[Math.min(index, remaining.length - 1)];
          return heading;
        }
      });
    });

    render();
    return { render: render };
  }

  initNav();

  window.UCR = {
    data: DATA,
    store: Store,
    findCourse: findCourse,
    deptName: deptName,
    seatsLeft: seatsLeft,
    availability: availability,
    createCourseCard: createCourseCard,
    bindWaitlist: bindWaitlist,
    announce: announce,
    openDialog: openDialog,
    initRegisteredTable: initRegisteredTable,
    el: el
  };
})();
