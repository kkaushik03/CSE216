/* Shared helpers used on every page. */
(function () {
  "use strict";

  var DATA = window.UCR_DATA;
  var KEYS = { selected: "ucr-selected", registered: "ucr-registered", student: "ucr-student" };
  var MAX_CREDITS = 18;

  /* ---------- storage ---------- */
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
      /* storage may be unavailable (private mode); the app still works for this page view */
    }
  }

  var store = {
    getSelected: function () { return read(KEYS.selected, []); },
    setSelected: function (codes) { write(KEYS.selected, codes); updateNavBadge(); },
    getRegistered: function () { return read(KEYS.registered, []); },
    setRegistered: function (list) { write(KEYS.registered, list); },
    getStudent: function () { return read(KEYS.student, DATA.defaultStudent); },
    setStudent: function (s) { write(KEYS.student, s); }
  };

  /* ---------- data helpers ---------- */
  function findCourse(code) {
    for (var i = 0; i < DATA.courses.length; i++) {
      if (DATA.courses[i].code === code) return DATA.courses[i];
    }
    return null;
  }
  function findDept(id) {
    for (var i = 0; i < DATA.departments.length; i++) {
      if (DATA.departments[i].id === id) return DATA.departments[i];
    }
    return { id: id, name: id, color: "violet" };
  }
  function termName(id) {
    for (var i = 0; i < DATA.terms.length; i++) {
      if (DATA.terms[i].id === id) return DATA.terms[i].name;
    }
    return id;
  }
  function isRegistered(code) {
    return store.getRegistered().some(function (r) { return r.code === code; });
  }

  var DAY_NAMES = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };

  function formatTime(t) {
    var parts = t.split(":");
    var h = parseInt(parts[0], 10);
    var suffix = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + parts[1] + " " + suffix;
  }
  /* Short visual form plus a full spoken form for assistive technology. */
  function scheduleText(c) {
    return c.days.join(", ") + " " + formatTime(c.start) + "–" + formatTime(c.end);
  }
  function scheduleLong(c) {
    return c.days.map(function (d) { return DAY_NAMES[d]; }).join(", ") +
      ", " + formatTime(c.start) + " to " + formatTime(c.end);
  }
  function minutes(t) {
    var p = t.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function overlaps(a, b) {
    var sharesDay = a.days.some(function (d) { return b.days.indexOf(d) !== -1; });
    return sharesDay && minutes(a.start) < minutes(b.end) && minutes(b.start) < minutes(a.end);
  }
  /* Returns pairs of course codes whose meeting times overlap. */
  function findConflicts(courses) {
    var out = [];
    for (var i = 0; i < courses.length; i++) {
      for (var j = i + 1; j < courses.length; j++) {
        if (overlaps(courses[i], courses[j])) out.push([courses[i], courses[j]]);
      }
    }
    return out;
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  /* ---------- live announcements ---------- */
  function announce(message) {
    var region = document.getElementById("sr-announcer");
    if (!region) return;
    region.textContent = "";
    /* small delay so repeated identical messages are still announced */
    window.setTimeout(function () { region.textContent = message; }, 50);
  }

  /* ---------- navigation ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("primary-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
    updateNavBadge();
  }

  function updateNavBadge() {
    var badge = document.getElementById("nav-selected-count");
    if (!badge) return;
    var n = store.getSelected().length;
    badge.hidden = n === 0;
    badge.textContent = n ? "(" + n + " selected)" : "";
  }

  /* ---------- confirmation modal ----------
     Uses the native <dialog> element with showModal(), which makes the rest of
     the page inert, traps focus and supports Escape. Focus is returned to the
     element that opened the dialog when it closes. */
  function confirmDialog(opts) {
    return new Promise(function (resolve) {
      var opener = document.activeElement;
      var dialog = document.createElement("dialog");
      dialog.className = "modal" + (opts.tone === "danger" ? " modal--danger" : "");
      dialog.setAttribute("aria-labelledby", "modal-title");
      dialog.setAttribute("aria-describedby", "modal-desc");
      dialog.innerHTML =
        '<div class="modal__header">' +
          '<h2 id="modal-title" class="modal__title">' + escapeHTML(opts.title) + "</h2>" +
        "</div>" +
        '<div class="modal__body">' +
          '<p id="modal-desc">' + escapeHTML(opts.description || "") + "</p>" +
          (opts.bodyHTML || "") +
        "</div>" +
        '<div class="modal__actions">' +
          '<button type="button" class="btn btn--ghost" data-action="cancel">' +
            escapeHTML(opts.cancelText || "Cancel") + "</button>" +
          '<button type="button" class="btn ' + (opts.tone === "danger" ? "btn--danger" : "btn--primary") +
            '" data-action="confirm">' + escapeHTML(opts.confirmText || "Confirm") + "</button>" +
        "</div>";
      document.body.appendChild(dialog);

      var result = false;
      dialog.addEventListener("click", function (e) {
        var action = e.target.closest && e.target.closest("[data-action]");
        if (!action) return;
        result = action.getAttribute("data-action") === "confirm";
        dialog.close();
      });
      dialog.addEventListener("close", function () {
        dialog.remove();
        if (opts.returnFocus !== false && opener && document.contains(opener)) opener.focus();
        resolve(result);
      });

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        /* very old browsers: fall back to a basic confirm */
        dialog.remove();
        resolve(window.confirm(opts.title + "\n\n" + (opts.description || "")));
        return;
      }
      /* For destructive actions, start on the safe choice. */
      var first = dialog.querySelector(opts.tone === "danger" ? '[data-action="cancel"]' : '[data-action="confirm"]');
      if (first) first.focus();
    });
  }

  /* ---------- course card ---------- */
  function seatsLabel(c) {
    if (c.seats === 0) return "Full — 0 of " + c.capacity + " seats open";
    return c.seats + " of " + c.capacity + " seats open";
  }

  function courseCardHTML(c, opts) {
    opts = opts || {};
    var dept = findDept(c.dept);
    var selected = opts.selected;
    var registered = isRegistered(c.code);
    var pct = Math.round(((c.capacity - c.seats) / c.capacity) * 100);
    var headingId = "course-" + c.code.replace(/\s+/g, "-").toLowerCase();
    var hLevel = opts.headingLevel || 3;

    var action;
    if (registered) {
      action = '<p class="card__status card__status--ok"><span aria-hidden="true">✔ </span>Registered · <a href="profile.html">View in profile</a></p>';
    } else if (c.seats === 0) {
      action = '<p class="card__status card__status--full"><span aria-hidden="true">⛔ </span>This course is full</p>';
    } else {
      action = '<button type="button" class="btn ' + (selected ? "btn--ghost" : "btn--primary") +
        ' btn--block" data-toggle-course="' + escapeHTML(c.code) + '">' +
        (selected ? "Remove from selection" : "Add to selection") +
        '<span class="visually-hidden">: ' + escapeHTML(c.code + " " + c.title) + "</span></button>";
    }

    return (
      '<article class="card card--' + dept.color + (selected ? " is-selected" : "") + '" aria-labelledby="' + headingId + '">' +
        '<div class="card__band">' +
          '<span class="card__dept">' + escapeHTML(dept.name) + "</span>" +
          '<span class="card__level">Level ' + c.level + "</span>" +
        "</div>" +
        '<div class="card__body">' +
          "<h" + hLevel + ' class="card__title" id="' + headingId + '">' +
            '<span class="card__code">' + escapeHTML(c.code) + "</span> " + escapeHTML(c.title) +
          "</h" + hLevel + ">" +
          '<p class="card__desc">' + escapeHTML(c.description) + "</p>" +
          '<dl class="card__meta">' +
            "<div><dt>Credits</dt><dd>" + c.credits + "</dd></div>" +
            "<div><dt>Instructor</dt><dd>" + escapeHTML(c.instructor) + "</dd></div>" +
            '<div><dt>Schedule</dt><dd><span aria-hidden="true">' + escapeHTML(scheduleText(c)) +
              '</span><span class="visually-hidden">' + escapeHTML(scheduleLong(c)) + "</span></dd></div>" +
            "<div><dt>Room</dt><dd>" + escapeHTML(c.room) + "</dd></div>" +
          "</dl>" +
          '<div class="seats">' +
            '<p class="seats__label">' + escapeHTML(seatsLabel(c)) + "</p>" +
            '<div class="seats__bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
          "</div>" +
        "</div>" +
        '<div class="card__footer">' + action + "</div>" +
      "</article>"
    );
  }

  /* Wire up "Add to selection" buttons inside a container. onChange re-renders. */
  function bindCardToggles(container, onChange) {
    container.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-toggle-course]");
      if (!btn) return;
      var code = btn.getAttribute("data-toggle-course");
      var course = findCourse(code);
      var list = store.getSelected();
      var idx = list.indexOf(code);
      var msg;
      if (idx === -1) {
        list.push(code);
        msg = code + " " + course.title + " added to your selection. " + list.length + " selected.";
      } else {
        list.splice(idx, 1);
        msg = code + " " + course.title + " removed from your selection. " + list.length + " selected.";
      }
      store.setSelected(list);
      onChange(code);
      /* keep keyboard focus on the same course's button after re-render */
      var again = container.querySelector('[data-toggle-course="' + code + '"]');
      if (again) again.focus();
      announce(msg);
    });
  }

  function initYear() {
    var y = document.getElementById("footer-year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  document.documentElement.classList.add("js");
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initYear();
  });

  window.UCR = {
    DATA: DATA,
    MAX_CREDITS: MAX_CREDITS,
    store: store,
    findCourse: findCourse,
    findDept: findDept,
    termName: termName,
    isRegistered: isRegistered,
    scheduleText: scheduleText,
    scheduleLong: scheduleLong,
    findConflicts: findConflicts,
    escapeHTML: escapeHTML,
    announce: announce,
    confirmDialog: confirmDialog,
    courseCardHTML: courseCardHTML,
    bindCardToggles: bindCardToggles
  };
})();
