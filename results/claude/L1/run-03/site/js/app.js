/* Shared helpers: navigation, storage, modal, toasts and course rendering. */

const STORAGE_KEYS = { registered: "unireg.registered", profile: "unireg.profile" };

const NAV_LINKS = [
  { page: "home",     href: "index.html",    label: "Home",       icon: "🏠" },
  { page: "catalog",  href: "catalog.html",  label: "Catalog",    icon: "📚" },
  { page: "register", href: "register.html", label: "Register",   icon: "📝" },
  { page: "profile",  href: "profile.html",  label: "My Profile", icon: "🎓" },
];

/* ---------- Utilities ---------- */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch]);
}

function getCourse(code) {
  return COURSES.find((c) => c.code === code);
}

function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
}

function formatSchedule(course) {
  return `${course.days.join("/")} · ${formatTime(course.start)}–${formatTime(course.end)}`;
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/* Returns the first course in `codes` whose meeting time overlaps `course`. */
function findConflict(course, codes) {
  return codes
    .map(getCourse)
    .filter((other) => other && other.code !== course.code)
    .find((other) =>
      other.days.some((d) => course.days.includes(d)) &&
      toMinutes(course.start) < toMinutes(other.end) &&
      toMinutes(other.start) < toMinutes(course.end));
}

/* ---------- Storage ---------- */

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getRegistrations() {
  return readJSON(STORAGE_KEYS.registered, []);
}

function getRegisteredCodes() {
  return getRegistrations().map((r) => r.code);
}

function isRegistered(code) {
  return getRegisteredCodes().includes(code);
}

function addRegistrations(codes) {
  const existing = getRegistrations();
  const now = new Date().toISOString();
  codes.forEach((code) => {
    if (!existing.some((r) => r.code === code)) existing.push({ code, registeredAt: now });
  });
  localStorage.setItem(STORAGE_KEYS.registered, JSON.stringify(existing));
}

function dropRegistration(code) {
  const remaining = getRegistrations().filter((r) => r.code !== code);
  localStorage.setItem(STORAGE_KEYS.registered, JSON.stringify(remaining));
}

function getProfile() {
  return readJSON(STORAGE_KEYS.profile, null);
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

function totalCredits(codes = getRegisteredCodes()) {
  return codes.reduce((sum, code) => sum + (getCourse(code)?.credits || 0), 0);
}

/* Seats left, counting the current student's own registration. */
function seatsLeft(course) {
  const taken = course.enrolled + (isRegistered(course.code) ? 1 : 0);
  return Math.max(course.seats - taken, 0);
}

/* ---------- Navigation ---------- */

function renderNavbar() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const current = document.body.dataset.page;
  const count = getRegisteredCodes().length;

  header.innerHTML = `
    <nav class="navbar" aria-label="Main navigation">
      <a class="brand" href="index.html"><span class="brand-logo">🎓</span><span>Uni<strong>Reg</strong></span></a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="nav-links">
        ${NAV_LINKS.map((l) => `
          <li><a href="${l.href}" class="${l.page === current ? "active" : ""}" ${l.page === current ? 'aria-current="page"' : ""}>
            <span aria-hidden="true">${l.icon}</span> ${l.label}
            ${l.page === "profile" && count ? `<span class="nav-badge" id="nav-badge">${count}</span>` : ""}
          </a></li>`).join("")}
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

/* ---------- Modal ---------- */

let modalOnConfirm = null;

function ensureModal() {
  let overlay = document.getElementById("modal-overlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <span class="modal-icon" id="modal-icon"></span>
        <h2 id="modal-title"></h2>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body" id="modal-body"></div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="modal-confirm">Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  overlay.querySelector(".modal-close").addEventListener("click", closeModal);
  overlay.querySelector("#modal-cancel").addEventListener("click", closeModal);
  overlay.querySelector("#modal-confirm").addEventListener("click", () => {
    const cb = modalOnConfirm;
    closeModal();
    if (cb) cb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("show")) closeModal();
  });
  return overlay;
}

/**
 * Opens the shared modal.
 * options: { title, body (HTML), icon, confirmText, cancelText, variant: "primary"|"danger"|"success", onConfirm, hideCancel }
 */
function openModal(options) {
  const overlay = ensureModal();
  overlay.querySelector("#modal-title").textContent = options.title;
  overlay.querySelector("#modal-icon").textContent = options.icon || "✨";
  overlay.querySelector("#modal-body").innerHTML = options.body || "";

  const confirmBtn = overlay.querySelector("#modal-confirm");
  confirmBtn.textContent = options.confirmText || "Confirm";
  confirmBtn.className = `btn btn-${options.variant || "primary"}`;

  const cancelBtn = overlay.querySelector("#modal-cancel");
  cancelBtn.textContent = options.cancelText || "Cancel";
  cancelBtn.hidden = Boolean(options.hideCancel);

  modalOnConfirm = options.onConfirm || null;
  overlay.classList.add("show");
  document.body.classList.add("no-scroll");
  confirmBtn.focus();
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;
  overlay.classList.remove("show");
  document.body.classList.remove("no-scroll");
  modalOnConfirm = null;
}

/* ---------- Toasts ---------- */

function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("hide"), 2800);
  setTimeout(() => toast.remove(), 3200);
}

/* ---------- Course cards ---------- */

function courseCardHTML(course) {
  const dept = DEPARTMENTS[course.dept];
  const left = seatsLeft(course);
  const registered = isRegistered(course.code);
  const pct = Math.min(100, Math.round(((course.seats - left) / course.seats) * 100));
  const status = left === 0 ? "full" : left <= 5 ? "low" : "open";
  const statusLabel = { full: "Full", low: `${left} seats left`, open: `${left} seats open` }[status];

  let action;
  if (registered) action = `<button class="btn btn-success btn-sm" disabled>✓ Registered</button>`;
  else if (left === 0) action = `<button class="btn btn-ghost btn-sm" disabled>Class Full</button>`;
  else action = `<button class="btn btn-primary btn-sm" data-action="register" data-code="${course.code}">+ Register</button>`;

  return `
    <article class="course-card" style="--accent:${dept.color}">
      <div class="course-card-top">
        <span class="dept-chip">${dept.icon} ${dept.name}</span>
        <span class="credits-chip">${course.credits} cr</span>
      </div>
      <h3 class="course-code">${course.code}</h3>
      <p class="course-title">${course.title}</p>
      <p class="course-desc">${course.description}</p>
      <ul class="course-meta">
        <li>👩‍🏫 ${course.instructor}</li>
        <li>🗓️ ${formatSchedule(course)}</li>
        <li>🎯 Level ${course.level}</li>
      </ul>
      <div class="seat-bar" aria-label="${pct}% full"><span style="width:${pct}%"></span></div>
      <div class="course-card-bottom">
        <span class="seat-status ${status}">${statusLabel}</span>
        ${action}
      </div>
    </article>`;
}

/* Quick-register flow used on the home and catalog pages. */
function confirmQuickRegister(code, onDone) {
  const course = getCourse(code);
  const codes = getRegisteredCodes();
  const conflict = findConflict(course, codes);
  const newTotal = totalCredits(codes) + course.credits;

  if (conflict) {
    openModal({
      title: "Schedule Conflict", icon: "⚠️", variant: "danger", hideCancel: true, confirmText: "Got it",
      body: `<p><strong>${course.code}</strong> overlaps with <strong>${conflict.code} – ${conflict.title}</strong>
             (${formatSchedule(conflict)}). Drop that course first from your profile to register.</p>`,
    });
    return;
  }
  if (newTotal > MAX_CREDITS) {
    openModal({
      title: "Credit Limit Reached", icon: "⛔", variant: "danger", hideCancel: true, confirmText: "OK",
      body: `<p>Adding this course would bring you to <strong>${newTotal}</strong> credits.
             The maximum per semester is <strong>${MAX_CREDITS}</strong>.</p>`,
    });
    return;
  }
  if (!getProfile()) {
    window.location.href = `register.html?course=${encodeURIComponent(code)}`;
    return;
  }

  openModal({
    title: "Confirm Registration", icon: "📝", confirmText: "Yes, register me",
    body: `
      <div class="modal-course" style="--accent:${DEPARTMENTS[course.dept].color}">
        <strong>${course.code} — ${course.title}</strong>
        <span>${course.instructor}</span>
        <span>${formatSchedule(course)}</span>
      </div>
      <p>Your total will be <strong>${newTotal} / ${MAX_CREDITS}</strong> credits.</p>`,
    onConfirm: () => {
      addRegistrations([code]);
      showToast(`🎉 Registered for ${course.code}!`);
      renderNavbar();
      if (onDone) onDone();
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
