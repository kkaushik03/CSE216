/* Shared logic for all pages: navigation, storage, course cards, modal, toast. */
(function () {
  "use strict";

  const STORAGE_KEY = "uniReg.registrations";
  const PROFILE_KEY = "uniReg.profile";

  // ---------- Storage ----------
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable (e.g. private mode); keep working in memory */
    }
  }

  const Store = {
    getRegistrations() {
      return readJSON(STORAGE_KEY, []);
    },
    saveRegistrations(list) {
      writeJSON(STORAGE_KEY, list);
    },
    isRegistered(id) {
      return this.getRegistrations().some((r) => r.courseId === id);
    },
    addRegistrations(ids, term) {
      const list = this.getRegistrations();
      const date = new Date().toISOString();
      ids.forEach((id) => {
        if (!list.some((r) => r.courseId === id)) list.push({ courseId: id, term, date });
      });
      this.saveRegistrations(list);
    },
    drop(id) {
      this.saveRegistrations(this.getRegistrations().filter((r) => r.courseId !== id));
    },
    totalCredits() {
      return this.getRegistrations().reduce((sum, r) => {
        const c = getCourse(r.courseId);
        return sum + (c ? c.credits : 0);
      }, 0);
    },
    getProfile() {
      return Object.assign({}, DEFAULT_STUDENT, readJSON(PROFILE_KEY, {}));
    },
    saveProfile(p) {
      writeJSON(PROFILE_KEY, p);
    },
  };

  // ---------- Helpers ----------
  function getCourse(id) {
    return COURSES.find((c) => c.id === id);
  }
  function seatsLeft(course) {
    const extra = Store.isRegistered(course.id) ? 1 : 0;
    return Math.max(0, course.seats - course.enrolled - extra);
  }
  function deptColor(dept) {
    return DEPT_COLORS[dept] || "#6c5ce7";
  }
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  // ---------- Navigation ----------
  const NAV_LINKS = [
    { href: "index.html", label: "Home", page: "home", icon: "🏠" },
    { href: "catalog.html", label: "Course Catalog", page: "catalog", icon: "📚" },
    { href: "register.html", label: "Registration", page: "register", icon: "📝" },
    { href: "profile.html", label: "My Profile", page: "profile", icon: "🎓" },
  ];

  function renderNav() {
    const header = document.getElementById("site-header");
    if (!header) return;
    const current = document.body.dataset.page;
    const count = Store.getRegistrations().length;
    header.innerHTML = `
      <nav class="navbar" aria-label="Main navigation">
        <a class="brand" href="index.html"><span class="brand-logo">U</span><span>Uni<strong>Reg</strong></span></a>
        <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links" id="nav-links">
          ${NAV_LINKS.map(
            (l) => `<li><a href="${l.href}" class="${l.page === current ? "active" : ""}" ${l.page === current ? 'aria-current="page"' : ""}>
              <span class="nav-icon" aria-hidden="true">${l.icon}</span>${l.label}${
                l.page === "profile" && count ? ` <span class="badge" aria-label="${count} registered courses">${count}</span>` : ""
              }</a></li>`
          ).join("")}
        </ul>
      </nav>`;
    const toggle = header.querySelector(".nav-toggle");
    const links = header.querySelector(".nav-links");
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function renderFooter() {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    footer.innerHTML = `<p>© ${new Date().getFullYear()} UniReg · University Course Registration · Demo app with sample data</p>`;
  }

  // ---------- Course card ----------
  function courseCardHTML(course) {
    const left = seatsLeft(course);
    const registered = Store.isRegistered(course.id);
    const full = left === 0 && !registered;
    const pct = Math.round(((course.seats - left) / course.seats) * 100);
    let action;
    if (registered) action = `<span class="btn btn-success btn-sm is-static">✔ Registered</span>`;
    else if (full) action = `<span class="btn btn-disabled btn-sm is-static">Course full</span>`;
    else action = `<a class="btn btn-primary btn-sm" href="register.html?course=${encodeURIComponent(course.id)}">Register</a>`;

    return `
      <article class="course-card" style="--accent:${deptColor(course.dept)}">
        <div class="course-card-top">
          <span class="course-code">${escapeHTML(course.id)}</span>
          <span class="chip">${escapeHTML(course.dept)}</span>
        </div>
        <h3 class="course-title">${escapeHTML(course.title)}</h3>
        <p class="course-desc">${escapeHTML(course.description)}</p>
        <ul class="course-meta">
          <li><span aria-hidden="true">👩‍🏫</span> ${escapeHTML(course.instructor)}</li>
          <li><span aria-hidden="true">🕒</span> ${escapeHTML(course.schedule)}</li>
          <li><span aria-hidden="true">⭐</span> ${course.credits} credits · Level ${course.level}</li>
        </ul>
        <div class="seats">
          <div class="seats-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Seats filled">
            <span style="width:${pct}%"></span>
          </div>
          <small class="${left <= 3 ? "seats-low" : ""}">${left} of ${course.seats} seats left</small>
        </div>
        <div class="course-card-actions">${action}</div>
      </article>`;
  }

  // ---------- Modal ----------
  let lastFocus = null;
  function openModal({ title, body, confirmText = "Confirm", cancelText = "Cancel", onConfirm, variant = "primary" }) {
    closeModal();
    lastFocus = document.activeElement;
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <h2 id="modal-title">${escapeHTML(title)}</h2>
          <button class="modal-close" aria-label="Close">×</button>
        </div>
        <div class="modal-body">${body}</div>
        <div class="modal-footer">
          ${cancelText ? `<button class="btn btn-ghost" data-action="cancel">${escapeHTML(cancelText)}</button>` : ""}
          <button class="btn btn-${variant}" data-action="confirm">${escapeHTML(confirmText)}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => overlay.classList.add("show"));

    const confirmBtn = overlay.querySelector('[data-action="confirm"]');
    confirmBtn.focus();
    confirmBtn.addEventListener("click", () => {
      closeModal();
      if (onConfirm) onConfirm();
    });
    overlay.querySelectorAll('[data-action="cancel"], .modal-close').forEach((b) => b.addEventListener("click", closeModal));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }
  function closeModal() {
    const overlay = document.querySelector(".modal-overlay");
    if (!overlay) return;
    overlay.remove();
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener("keydown", (e) => {
    const overlay = document.querySelector(".modal-overlay");
    if (!overlay) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") {
      const focusables = overlay.querySelectorAll("button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // ---------- Toast ----------
  function toast(message, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      container.setAttribute("role", "status");
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.classList.add("hide"), 2800);
    setTimeout(() => el.remove(), 3300);
  }

  window.App = { Store, getCourse, seatsLeft, deptColor, escapeHTML, courseCardHTML, openModal, closeModal, toast, renderNav };

  document.addEventListener("DOMContentLoaded", () => {
    renderNav();
    renderFooter();
  });
})();
