/* Shared helpers: storage, navigation menu, status messages, form errors. */
(function () {
  "use strict";

  var NB = (window.NB = window.NB || {});

  /* ---------- Storage (falls back to memory if localStorage is blocked) ---------- */
  var memory = {};
  NB.store = {
    get: function (key, fallback) {
      try {
        var value = window.localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch (e) {
        return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : fallback;
      }
    },
    set: function (key, value) {
      memory[key] = value;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* memory fallback already set */
      }
    }
  };

  NB.getPlan = function () { return NB.store.get("nb-plan", []); };
  NB.setPlan = function (ids) { NB.store.set("nb-plan", ids); NB.updatePlanCount(); };
  NB.getRegistered = function () { return NB.store.get("nb-registered", NB.defaultRegistered.slice()); };
  NB.setRegistered = function (list) { NB.store.set("nb-registered", list); };
  NB.getProfile = function () {
    var saved = NB.store.get("nb-profile", null);
    var profile = {};
    Object.keys(NB.defaultProfile).forEach(function (k) {
      profile[k] = saved && typeof saved[k] === "string" ? saved[k] : NB.defaultProfile[k];
    });
    return profile;
  };
  NB.setProfile = function (profile) { NB.store.set("nb-profile", profile); };

  NB.isRegistered = function (id) {
    return NB.getRegistered().some(function (r) { return r.id === id; });
  };
  NB.isPlanned = function (id) { return NB.getPlan().indexOf(id) !== -1; };

  /* ---------- Course helpers ---------- */
  NB.findCourse = function (id) {
    for (var i = 0; i < NB.courses.length; i++) {
      if (NB.courses[i].id === id) return NB.courses[i];
    }
    return null;
  };
  NB.deptName = function (id) {
    for (var i = 0; i < NB.departments.length; i++) {
      if (NB.departments[i].id === id) return NB.departments[i].name;
    }
    return id;
  };
  NB.seatsLeft = function (course) {
    return Math.max(0, course.capacity - course.enrolled);
  };
  NB.availability = function (course) {
    var left = NB.seatsLeft(course);
    if (left === 0) return { key: "full", label: "Full", detail: "Full, no seats left" };
    if (left <= 5) return { key: "few", label: "Few seats", detail: "Few seats, " + left + " left" };
    return { key: "open", label: "Open", detail: "Open, " + left + " seats left" };
  };
  NB.scheduleText = function (course) {
    return course.days.join(", ") + " · " + course.start + "–" + course.end;
  };
  NB.creditsText = function (n) { return n + (n === 1 ? " credit" : " credits"); };
  NB.coursesText = function (n) { return n + (n === 1 ? " course" : " courses"); };

  function toMinutes(t) {
    var parts = t.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  /* Returns true when two courses meet on a shared day at overlapping times. */
  NB.overlaps = function (a, b) {
    var sharedDay = a.days.some(function (d) { return b.days.indexOf(d) !== -1; });
    if (!sharedDay) return false;
    return toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
  };

  NB.escape = function (value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  /* ---------- Status messages (role="status" element exists in each page from load) ---------- */
  var announceTimer = null;
  NB.announce = function (message, regionId) {
    var region = document.getElementById(regionId || "announcer");
    if (!region) return;
    region.textContent = "";
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(function () { region.textContent = message; }, 60);
  };

  /* ---------- Plan count shown on the Registration navigation link ---------- */
  NB.updatePlanCount = function () {
    var count = NB.getPlan().length;
    var badges = document.querySelectorAll("[data-plan-count]");
    Array.prototype.forEach.call(badges, function (badge) {
      if (count > 0) {
        badge.hidden = false;
        badge.innerHTML = count + '<span class="sr-only"> ' + (count === 1 ? "course" : "courses") + " in plan</span>";
      } else {
        badge.hidden = true;
        badge.textContent = "";
      }
    });
  };

  /* ---------- Form errors ---------- */
  NB.setFieldError = function (field, errorEl, message) {
    var targets = field.length !== undefined && !field.tagName ? Array.prototype.slice.call(field) : [field];
    targets.forEach(function (el) {
      var ids = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
      if (message) {
        el.setAttribute("aria-invalid", "true");
        if (ids.indexOf(errorEl.id) === -1) ids.push(errorEl.id);
      } else {
        el.removeAttribute("aria-invalid");
        ids = ids.filter(function (id) { return id !== errorEl.id; });
      }
      if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
      else el.removeAttribute("aria-describedby");
    });
    if (message) {
      errorEl.innerHTML = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 6.5v7M12 16.5v1" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>' +
        '<span><span class="sr-only">Error: </span>' + NB.escape(message) + "</span>";
      errorEl.hidden = false;
    } else {
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  };

  /* errors: [{ targetId, message }] */
  NB.showErrorSummary = function (summaryEl, errors, noun) {
    if (!errors.length) {
      summaryEl.hidden = true;
      summaryEl.innerHTML = "";
      return;
    }
    var heading = errors.length === 1
      ? "There is 1 problem with your " + noun
      : "There are " + errors.length + " problems with your " + noun;
    var items = errors.map(function (err) {
      return '<li><a href="#' + err.targetId + '">' + NB.escape(err.message) + "</a></li>";
    }).join("");
    summaryEl.innerHTML = '<h2 class="error-summary-title" id="' + summaryEl.id + '-title">' + heading + "</h2><ul>" + items + "</ul>";
    summaryEl.hidden = false;
    summaryEl.focus();
  };

  /* Links in an error summary move focus to the field itself. */
  NB.bindErrorSummary = function (summaryEl) {
    summaryEl.addEventListener("click", function (event) {
      var link = event.target.closest("a[href^='#']");
      if (!link) return;
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (target) {
        event.preventDefault();
        target.focus();
        target.scrollIntoView({ block: "center" });
      }
    });
  };

  NB.isValidEmail = function (value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  /* ---------- Mobile navigation menu ---------- */
  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var menu = document.getElementById("primary-menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      menu.classList.toggle("is-open", open);
    }
    setOpen(false);

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || toggle.getAttribute("aria-expanded") !== "true") return;
      if (document.querySelector("dialog[open]")) return;
      setOpen(false);
      toggle.focus();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    NB.updatePlanCount();
    var year = document.getElementById("footer-year");
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
