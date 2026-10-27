/* Shared logic for all pages: storage, navigation, modal, toast, helpers. */
const MAX_CREDITS = 18;
const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/* ---------- Storage ---------- */
const Store = {
  getRegistrations() {
    try { return JSON.parse(localStorage.getItem("hu_registrations")) || []; }
    catch { return []; }
  },
  saveRegistrations(list) {
    localStorage.setItem("hu_registrations", JSON.stringify(list));
  },
  getStudent() {
    const fallback = { name: "", studentId: "", email: "", program: "", year: "", phone: "" };
    try { return { ...fallback, ...JSON.parse(localStorage.getItem("hu_student")) }; }
    catch { return fallback; }
  },
  saveStudent(student) {
    localStorage.setItem("hu_student", JSON.stringify(student));
  },
};

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function escapeHTML(str) {
  return String(str ?? "").replace(/[&<>"']/g, ch => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

function getCourse(id) { return COURSES.find(c => c.id === id); }
function deptOf(course) { return DEPARTMENTS[course.dept]; }

function isRegistered(id) {
  return Store.getRegistrations().some(r => r.courseId === id);
}

function registeredCourses() {
  return Store.getRegistrations()
    .map(r => ({ ...getCourse(r.courseId), registeredOn: r.date }))
    .filter(c => c.id);
}

function totalCredits(courses) {
  return courses.reduce((sum, c) => sum + c.credits, 0);
}

function seatsLeft(course) {
  return course.seats - course.enrolled - (isRegistered(course.id) ? 1 : 0);
}

function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
}

function scheduleText(c) {
  return `${c.days.join(", ")} · ${formatTime(c.start)} – ${formatTime(c.end)}`;
}

function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function coursesConflict(a, b) {
  if (a.id === b.id) return false;
  const sharedDay = a.days.some(d => b.days.includes(d));
  return sharedDay && toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
}

/** Returns a list of human-readable time conflicts within a set of courses. */
function findConflicts(courses) {
  const conflicts = [];
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      if (coursesConflict(courses[i], courses[j])) {
        conflicts.push(`${courses[i].id} and ${courses[j].id} overlap`);
      }
    }
  }
  return conflicts;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/* ---------- Navigation ---------- */
function renderNav() {
  const header = $("#site-header");
  if (!header) return;
  const page = document.body.dataset.page;
  const links = [
    { href: "index.html",    key: "home",     label: "Home",     icon: "🏠" },
    { href: "catalog.html",  key: "catalog",  label: "Catalog",  icon: "📖" },
    { href: "register.html", key: "register", label: "Register", icon: "📝" },
    { href: "profile.html",  key: "profile",  label: "Profile",  icon: "👤" },
  ];
  const count = Store.getRegistrations().length;

  header.innerHTML = `
    <nav class="navbar" aria-label="Main navigation">
      <a class="brand" href="index.html">
        <span class="brand-logo">H</span>
        <span class="brand-text">Horizon<span>University</span></span>
      </a>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="nav-links">
        ${links.map(l => `
          <li>
            <a href="${l.href}" class="${page === l.key ? "active" : ""}" ${page === l.key ? 'aria-current="page"' : ""}>
              <span aria-hidden="true">${l.icon}</span> ${l.label}
              ${l.key === "profile" && count ? `<span class="badge" id="nav-count">${count}</span>` : ""}
            </a>
          </li>`).join("")}
      </ul>
    </nav>`;

  const toggle = $(".nav-toggle", header);
  const menu = $(".nav-links", header);
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  });
}

function refreshNavCount() {
  renderNav();
}

/* ---------- Modal ---------- */
function openModal({ title, body, confirmText = "Confirm", cancelText = "Cancel", onConfirm, variant = "primary", hideCancel = false }) {
  closeModal();
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header ${variant}">
        <h2 id="modal-title">${title}</h2>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">${body}</div>
      <div class="modal-footer">
        ${hideCancel ? "" : `<button class="btn btn-ghost" data-action="cancel">${cancelText}</button>`}
        ${confirmText ? `<button class="btn btn-${variant}" data-action="confirm">${confirmText}</button>` : ""}
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.body.classList.add("no-scroll");
  requestAnimationFrame(() => overlay.classList.add("show"));

  const lastFocused = document.activeElement;
  overlay._lastFocused = lastFocused;
  (overlay.querySelector('[data-action="confirm"]') || overlay.querySelector(".modal-close")).focus();

  overlay.addEventListener("click", e => {
    if (e.target === overlay || e.target.closest(".modal-close") || e.target.closest('[data-action="cancel"]')) {
      closeModal();
    } else if (e.target.closest('[data-action="confirm"]')) {
      const keepOpen = onConfirm && onConfirm() === false;
      if (!keepOpen) closeModal();
    }
  });
}

function closeModal() {
  const overlay = $(".modal-overlay");
  if (!overlay) return;
  overlay.remove();
  document.body.classList.remove("no-scroll");
  if (overlay._lastFocused) overlay._lastFocused.focus();
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

/* ---------- Toast ---------- */
function showToast(message, type = "success") {
  let container = $(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("hide"), 2800);
  setTimeout(() => toast.remove(), 3300);
}

/* ---------- Course card ---------- */
function courseCardHTML(c) {
  const d = deptOf(c);
  const left = seatsLeft(c);
  const registered = isRegistered(c.id);
  const pct = Math.min(100, Math.round(((c.seats - left) / c.seats) * 100));
  const status = registered ? "registered" : left <= 0 ? "full" : left <= 5 ? "low" : "open";
  const statusLabel = { registered: "Registered ✓", full: "Full", low: `${left} seats left`, open: `${left} seats left` }[status];

  return `
    <article class="course-card" style="--accent:${d.color}">
      <div class="card-top">
        <span class="dept-chip"><span aria-hidden="true">${d.icon}</span> ${d.name}</span>
        <span class="status status-${status}">${statusLabel}</span>
      </div>
      <h3 class="card-title"><span class="course-code">${c.id}</span> ${c.title}</h3>
      <p class="card-desc">${c.description}</p>
      <ul class="card-meta">
        <li>👩‍🏫 ${c.instructor}</li>
        <li>🕒 ${scheduleText(c)}</li>
        <li>🎓 ${c.credits} credits · Level ${c.level}</li>
      </ul>
      <div class="seat-bar" aria-label="${pct}% full"><span style="width:${pct}%"></span></div>
      <div class="card-actions">
        <button class="btn btn-ghost btn-sm" data-details="${c.id}">Details</button>
        ${registered
          ? `<a class="btn btn-success btn-sm" href="profile.html">View in profile</a>`
          : left <= 0
            ? `<button class="btn btn-sm" disabled>Course full</button>`
            : `<a class="btn btn-primary btn-sm" href="register.html?add=${c.id}">Register</a>`}
      </div>
    </article>`;
}

function showCourseDetails(id) {
  const c = getCourse(id);
  if (!c) return;
  const d = deptOf(c);
  const left = seatsLeft(c);
  const canRegister = !isRegistered(c.id) && left > 0;
  openModal({
    title: `${d.icon} ${c.id} — ${c.title}`,
    body: `
      <p>${c.description}</p>
      <dl class="detail-list">
        <dt>Department</dt><dd>${d.name}</dd>
        <dt>Instructor</dt><dd>${c.instructor}</dd>
        <dt>Schedule</dt><dd>${scheduleText(c)}</dd>
        <dt>Credits</dt><dd>${c.credits}</dd>
        <dt>Level</dt><dd>${c.level}</dd>
        <dt>Seats</dt><dd>${Math.max(left, 0)} of ${c.seats} available</dd>
      </dl>`,
    confirmText: canRegister ? "Register for this course" : "",
    cancelText: "Close",
    onConfirm: () => { location.href = `register.html?add=${c.id}`; },
  });
}

/** Delegate "Details" clicks anywhere on the page. */
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-details]");
  if (btn) showCourseDetails(btn.dataset.details);
});

function dropCourse(id, onDone) {
  const c = getCourse(id);
  openModal({
    title: "Drop course?",
    body: `<p>Are you sure you want to drop <strong>${c.id} — ${c.title}</strong>? Your seat may be given to another student.</p>`,
    confirmText: "Yes, drop course",
    variant: "danger",
    onConfirm: () => {
      Store.saveRegistrations(Store.getRegistrations().filter(r => r.courseId !== id));
      refreshNavCount();
      showToast(`${c.id} dropped from your schedule`, "warning");
      onDone && onDone();
    },
  });
}

/* ---------- Registered courses table (shared by Register & Profile) ---------- */
function renderRegisteredTable(container, { filterText = "", filterDept = "", onChange } = {}) {
  const all = registeredCourses();
  const rows = all.filter(c => {
    const q = filterText.trim().toLowerCase();
    const matchesText = !q || [c.id, c.title, c.instructor].some(v => v.toLowerCase().includes(q));
    return matchesText && (!filterDept || c.dept === filterDept);
  });

  if (!all.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗂️</div>
        <p>You haven't registered for any courses yet.</p>
        <a class="btn btn-primary" href="catalog.html">Browse the catalog</a>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Code</th><th>Course</th><th>Instructor</th><th>Schedule</th><th>Credits</th><th>Registered</th><th><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map(c => `
            <tr style="--accent:${deptOf(c).color}">
              <td data-label="Code"><span class="code-pill">${c.id}</span></td>
              <td data-label="Course">${c.title}<small>${deptOf(c).name}</small></td>
              <td data-label="Instructor">${c.instructor}</td>
              <td data-label="Schedule">${scheduleText(c)}</td>
              <td data-label="Credits">${c.credits}</td>
              <td data-label="Registered">${formatDate(c.registeredOn)}</td>
              <td data-label="Actions"><button class="btn btn-danger btn-sm" data-drop="${c.id}">Drop</button></td>
            </tr>`).join("")
          : `<tr><td colspan="7" class="no-match">No registered courses match your filters.</td></tr>`}
        </tbody>
        <tfoot>
          <tr><td colspan="4">Total (${all.length} courses)</td><td colspan="3">${totalCredits(all)} / ${MAX_CREDITS} credits</td></tr>
        </tfoot>
      </table>
    </div>`;

  $$("[data-drop]", container).forEach(btn =>
    btn.addEventListener("click", () => dropCourse(btn.dataset.drop, onChange))
  );
}

function fillDeptSelect(select) {
  Object.entries(DEPARTMENTS).forEach(([key, d]) => {
    select.insertAdjacentHTML("beforeend", `<option value="${key}">${d.name}</option>`);
  });
}

/* ---------- Page bootstrapping ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  const year = $("#footer-year");
  if (year) year.textContent = new Date().getFullYear();
  const page = document.body.dataset.page;
  const init = { home: initHome, catalog: initCatalog, register: initRegister, profile: initProfile }[page];
  if (init) init();
});

/* ===================== HOME ===================== */
function initHome() {
  $("#hero-search").addEventListener("submit", e => {
    e.preventDefault();
    const q = $("#hero-query").value.trim();
    const dept = $("#hero-dept").value;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (dept) params.set("dept", dept);
    location.href = `catalog.html${params.toString() ? "?" + params : ""}`;
  });
  fillDeptSelect($("#hero-dept"));

  $("#stat-courses").textContent = COURSES.length;
  $("#stat-depts").textContent = Object.keys(DEPARTMENTS).length;
  $("#stat-seats").textContent = COURSES.reduce((s, c) => s + Math.max(seatsLeft(c), 0), 0);

  $("#dept-grid").innerHTML = Object.entries(DEPARTMENTS).map(([key, d]) => {
    const n = COURSES.filter(c => c.dept === key).length;
    return `
      <a class="dept-tile" href="catalog.html?dept=${key}" style="--accent:${d.color}">
        <span class="dept-icon" aria-hidden="true">${d.icon}</span>
        <strong>${d.name}</strong>
        <small>${n} course${n === 1 ? "" : "s"}</small>
      </a>`;
  }).join("");

  // Featured: open courses with the most demand
  const featured = COURSES.filter(c => seatsLeft(c) > 0)
    .sort((a, b) => b.enrolled / b.seats - a.enrolled / a.seats)
    .slice(0, 3);
  $("#featured-grid").innerHTML = featured.map(courseCardHTML).join("");
}

/* ===================== CATALOG ===================== */
function initCatalog() {
  const search = $("#search");
  const dept = $("#filter-dept");
  const level = $("#filter-level");
  const credits = $("#filter-credits");
  const day = $("#filter-day");
  const sort = $("#sort");
  const openOnly = $("#open-only");
  const grid = $("#course-grid");
  const count = $("#result-count");

  fillDeptSelect(dept);

  const params = new URLSearchParams(location.search);
  if (params.get("q")) search.value = params.get("q");
  if (params.get("dept")) dept.value = params.get("dept");

  function render() {
    const q = search.value.trim().toLowerCase();
    let list = COURSES.filter(c =>
      (!q || [c.id, c.title, c.instructor, c.description, deptOf(c).name].some(v => v.toLowerCase().includes(q))) &&
      (!dept.value || c.dept === dept.value) &&
      (!level.value || c.level === Number(level.value)) &&
      (!credits.value || c.credits === Number(credits.value)) &&
      (!day.value || c.days.includes(day.value)) &&
      (!openOnly.checked || seatsLeft(c) > 0)
    );

    const sorters = {
      code: (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }),
      title: (a, b) => a.title.localeCompare(b.title),
      credits: (a, b) => b.credits - a.credits,
      seats: (a, b) => seatsLeft(b) - seatsLeft(a),
    };
    list.sort(sorters[sort.value]);

    count.textContent = `${list.length} course${list.length === 1 ? "" : "s"} found`;
    grid.innerHTML = list.length
      ? list.map(courseCardHTML).join("")
      : `<div class="empty-state wide"><div class="empty-icon">🔍</div><p>No courses match your search. Try different filters.</p></div>`;
  }

  [search, dept, level, credits, day, sort, openOnly].forEach(el =>
    el.addEventListener(el === search ? "input" : "change", render)
  );
  $("#reset-filters").addEventListener("click", () => {
    search.value = "";
    [dept, level, credits, day].forEach(s => (s.value = ""));
    sort.value = "code";
    openOnly.checked = false;
    history.replaceState(null, "", "catalog.html");
    render();
  });

  render();
}

/* ===================== REGISTER ===================== */
function initRegister() {
  const form = $("#registration-form");
  const list = $("#course-picker");
  const pickerSearch = $("#picker-search");
  const pickerDept = $("#picker-dept");
  const summary = $("#selection-summary");
  const tableContainer = $("#registered-table");
  const selected = new Set();

  fillDeptSelect(pickerDept);

  // Prefill student information from storage
  const student = Store.getStudent();
  Object.entries(student).forEach(([k, v]) => {
    if (form.elements[k]) form.elements[k].value = v;
  });

  const preselect = new URLSearchParams(location.search).get("add");
  if (preselect && getCourse(preselect) && !isRegistered(preselect) && seatsLeft(getCourse(preselect)) > 0) {
    selected.add(preselect);
  }

  function renderPicker() {
    const q = pickerSearch.value.trim().toLowerCase();
    const items = COURSES.filter(c =>
      (!q || [c.id, c.title, c.instructor].some(v => v.toLowerCase().includes(q))) &&
      (!pickerDept.value || c.dept === pickerDept.value)
    );
    list.innerHTML = items.map(c => {
      const reg = isRegistered(c.id);
      const full = seatsLeft(c) <= 0;
      const disabled = reg || full;
      return `
        <label class="picker-item ${disabled ? "disabled" : ""} ${selected.has(c.id) ? "checked" : ""}" style="--accent:${deptOf(c).color}">
          <input type="checkbox" value="${c.id}" ${selected.has(c.id) ? "checked" : ""} ${disabled ? "disabled" : ""}>
          <span class="picker-info">
            <strong>${c.id} · ${c.title}</strong>
            <small>${scheduleText(c)} · ${c.credits} cr</small>
          </span>
          <span class="picker-tag">${reg ? "Registered" : full ? "Full" : `${seatsLeft(c)} left`}</span>
        </label>`;
    }).join("") || `<p class="no-match">No courses match.</p>`;
  }

  function renderSummary() {
    const chosen = [...selected].map(getCourse);
    const existing = registeredCourses();
    const credits = totalCredits(chosen);
    const total = credits + totalCredits(existing);
    const conflicts = findConflicts([...existing, ...chosen]);
    const pct = Math.min(100, (total / MAX_CREDITS) * 100);

    summary.innerHTML = `
      <h3>Your selection</h3>
      ${chosen.length ? `
        <ul class="chip-list">
          ${chosen.map(c => `
            <li style="--accent:${deptOf(c).color}">
              ${c.id} <small>${c.credits} cr</small>
              <button type="button" aria-label="Remove ${c.id}" data-remove="${c.id}">&times;</button>
            </li>`).join("")}
        </ul>` : `<p class="muted">No courses selected yet.</p>`}
      <div class="credit-meter ${total > MAX_CREDITS ? "over" : ""}">
        <div class="credit-label"><span>Total credits</span><strong>${total} / ${MAX_CREDITS}</strong></div>
        <div class="meter"><span style="width:${pct}%"></span></div>
        <small>${totalCredits(existing)} already registered + ${credits} selected</small>
      </div>
      ${conflicts.length ? `<div class="alert alert-warning">⚠️ Time conflict: ${conflicts.join("; ")}</div>` : ""}
      ${total > MAX_CREDITS ? `<div class="alert alert-danger">⛔ You exceed the ${MAX_CREDITS}-credit limit.</div>` : ""}`;

    $$("[data-remove]", summary).forEach(btn => btn.addEventListener("click", () => {
      selected.delete(btn.dataset.remove);
      update();
    }));
    $("#course-error").textContent = "";
  }

  function update() {
    renderPicker();
    renderSummary();
  }

  function renderTable() {
    renderRegisteredTable(tableContainer, { onChange: () => { renderTable(); update(); } });
  }

  list.addEventListener("change", e => {
    if (e.target.type !== "checkbox") return;
    e.target.checked ? selected.add(e.target.value) : selected.delete(e.target.value);
    update();
  });
  pickerSearch.addEventListener("input", renderPicker);
  pickerDept.addEventListener("change", renderPicker);

  // Live validation feedback
  $$("input, select", $("#student-fields")).forEach(el => {
    el.addEventListener("blur", () => validateField(el));
    el.addEventListener("input", () => el.classList.contains("invalid") && validateField(el));
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const fields = $$("input, select", $("#student-fields"));
    const fieldsOk = fields.map(validateField).every(Boolean);

    const chosen = [...selected].map(getCourse);
    const existing = registeredCourses();
    const total = totalCredits(chosen) + totalCredits(existing);
    const conflicts = findConflicts([...existing, ...chosen]);
    let courseError = "";
    if (!chosen.length) courseError = "Please select at least one course.";
    else if (total > MAX_CREDITS) courseError = `Total credits (${total}) exceed the ${MAX_CREDITS}-credit limit.`;
    else if (conflicts.length) courseError = `Resolve time conflicts first: ${conflicts.join("; ")}.`;
    $("#course-error").textContent = courseError;

    if (!fieldsOk) {
      form.querySelector(".invalid")?.focus();
      showToast("Please fix the highlighted fields", "error");
      return;
    }
    if (courseError) {
      showToast(courseError, "error");
      return;
    }
    if (!$("#agree").checked) {
      $("#agree-error").textContent = "You must accept the registration policy.";
      return;
    }
    $("#agree-error").textContent = "";

    const data = Object.fromEntries(["name", "studentId", "email", "phone", "program", "year"].map(k => [k, form.elements[k].value.trim()]));

    openModal({
      title: "Confirm your registration",
      body: `
        <p>Please review your registration details before submitting.</p>
        <dl class="detail-list">
          <dt>Student</dt><dd>${escapeHTML(data.name)} (${escapeHTML(data.studentId)})</dd>
          <dt>Email</dt><dd>${escapeHTML(data.email)}</dd>
          <dt>Program</dt><dd>${escapeHTML(data.program)} · ${escapeHTML(data.year)}</dd>
        </dl>
        <table class="mini-table">
          <thead><tr><th>Course</th><th>Schedule</th><th>Cr</th></tr></thead>
          <tbody>
            ${chosen.map(c => `<tr><td><strong>${c.id}</strong> ${c.title}</td><td>${scheduleText(c)}</td><td>${c.credits}</td></tr>`).join("")}
          </tbody>
          <tfoot><tr><td colspan="2">New credits</td><td>${totalCredits(chosen)}</td></tr></tfoot>
        </table>`,
      confirmText: "Confirm registration",
      onConfirm: () => {
        Store.saveStudent(data);
        const now = new Date().toISOString();
        Store.saveRegistrations([...Store.getRegistrations(), ...chosen.map(c => ({ courseId: c.id, date: now }))]);
        selected.clear();
        $("#agree").checked = false;
        history.replaceState(null, "", "register.html");
        refreshNavCount();
        update();
        renderTable();
        setTimeout(() => openModal({
          title: "🎉 Registration successful!",
          body: `<p>You are now enrolled in <strong>${chosen.length}</strong> new course${chosen.length > 1 ? "s" : ""}. A confirmation has been sent to <strong>${escapeHTML(data.email)}</strong>.</p>`,
          confirmText: "View my profile",
          cancelText: "Stay here",
          variant: "success",
          onConfirm: () => { location.href = "profile.html"; },
        }), 50);
      },
    });
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      selected.clear();
      $$(".invalid", form).forEach(el => el.classList.remove("invalid"));
      $$(".field-error", form).forEach(el => (el.textContent = ""));
      update();
    });
  });

  update();
  renderTable();
}

const VALIDATORS = {
  name: v => v.length >= 2 || "Please enter your full name.",
  studentId: v => /^[A-Z]{2}\d{6}$/i.test(v) || "Format: two letters + 6 digits (e.g. HU123456).",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email address.",
  phone: v => !v || /^[+\d][\d\s()-]{6,}$/.test(v) || "Please enter a valid phone number.",
  program: v => !!v || "Please choose your program.",
  year: v => !!v || "Please choose your year of study.",
};

function validateField(el) {
  const rule = VALIDATORS[el.name];
  if (!rule) return true;
  const result = rule(el.value.trim());
  const ok = result === true;
  el.classList.toggle("invalid", !ok);
  el.setAttribute("aria-invalid", !ok);
  const err = el.closest(".form-group")?.querySelector(".field-error");
  if (err) err.textContent = ok ? "" : result;
  return ok;
}

/* ===================== PROFILE ===================== */
function initProfile() {
  const tableContainer = $("#profile-table");
  const search = $("#table-search");
  const dept = $("#table-dept");
  fillDeptSelect(dept);

  function renderProfile() {
    const s = Store.getStudent();
    const courses = registeredCourses();
    const credits = totalCredits(courses);
    const initials = (s.name || "Guest Student").split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();

    $("#avatar").textContent = initials;
    $("#profile-name").textContent = s.name || "Guest Student";
    $("#profile-program").textContent = s.program ? `${s.program} · ${s.year}` : "Complete your registration to set up your profile";
    $("#profile-details").innerHTML = `
      <div><dt>Student ID</dt><dd>${escapeHTML(s.studentId) || "—"}</dd></div>
      <div><dt>Email</dt><dd>${escapeHTML(s.email) || "—"}</dd></div>
      <div><dt>Phone</dt><dd>${escapeHTML(s.phone) || "—"}</dd></div>`;

    $("#stat-reg-courses").textContent = courses.length;
    $("#stat-reg-credits").textContent = credits;
    $("#stat-remaining").textContent = Math.max(MAX_CREDITS - credits, 0);
    $("#stat-hours").textContent = (courses.reduce((sum, c) =>
      sum + c.days.length * (toMinutes(c.end) - toMinutes(c.start)), 0) / 60).toFixed(1);
    $("#credit-progress").style.width = `${Math.min(100, (credits / MAX_CREDITS) * 100)}%`;
  }

  function renderSchedule() {
    const courses = registeredCourses();
    $("#weekly-schedule").innerHTML = DAY_ORDER.map(day => {
      const todays = courses.filter(c => c.days.includes(day)).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
      return `
        <div class="day-col">
          <h4>${day}</h4>
          ${todays.length ? todays.map(c => `
            <div class="slot" style="--accent:${deptOf(c).color}">
              <strong>${c.id}</strong>
              <span>${formatTime(c.start)} – ${formatTime(c.end)}</span>
            </div>`).join("") : `<p class="free">Free day ☀️</p>`}
        </div>`;
    }).join("");
  }

  function renderTable() {
    renderRegisteredTable(tableContainer, {
      filterText: search.value,
      filterDept: dept.value,
      onChange: renderAll,
    });
  }

  function renderAll() {
    renderProfile();
    renderSchedule();
    renderTable();
  }

  search.addEventListener("input", renderTable);
  dept.addEventListener("change", renderTable);

  $("#edit-profile").addEventListener("click", () => {
    const s = Store.getStudent();
    const programs = ["Computer Science", "Mathematics", "Biology", "Fine Arts", "Business", "Physics", "English"];
    const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
    openModal({
      title: "✏️ Edit profile",
      body: `
        <form id="edit-form" class="form-grid single" novalidate>
          ${[["name", "Full name", "text"], ["studentId", "Student ID", "text"], ["email", "Email", "email"], ["phone", "Phone", "tel"]].map(([k, label, type]) => `
            <div class="form-group">
              <label for="edit-${k}">${label}</label>
              <input id="edit-${k}" name="${k}" type="${type}" value="${escapeHTML(s[k])}">
              <small class="field-error"></small>
            </div>`).join("")}
          <div class="form-group">
            <label for="edit-program">Program</label>
            <select id="edit-program" name="program">
              <option value="">Select…</option>
              ${programs.map(p => `<option ${p === s.program ? "selected" : ""}>${p}</option>`).join("")}
            </select>
            <small class="field-error"></small>
          </div>
          <div class="form-group">
            <label for="edit-year">Year</label>
            <select id="edit-year" name="year">
              <option value="">Select…</option>
              ${years.map(y => `<option ${y === s.year ? "selected" : ""}>${y}</option>`).join("")}
            </select>
            <small class="field-error"></small>
          </div>
        </form>`,
      confirmText: "Save changes",
      onConfirm: () => {
        const f = $("#edit-form");
        const ok = $$("input, select", f).map(validateField).every(Boolean);
        if (!ok) return false;
        Store.saveStudent(Object.fromEntries($$("input, select", f).map(el => [el.name, el.value.trim()])));
        renderProfile();
        showToast("Profile updated");
      },
    });
  });

  renderAll();
}
