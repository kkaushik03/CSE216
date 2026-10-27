/* Horizon University – Course Registration
   Shared helpers plus page-specific initialisers (selected via <body data-page>). */
"use strict";

/* ==========================================================================
   Storage
   ========================================================================== */
const Store = {
  REG_KEY: "hu.registrations",
  PROFILE_KEY: "hu.profile",

  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Storage unavailable (private mode etc.) – app still works for this page view. */
    }
  },

  getRegistrations() { return this.read(this.REG_KEY, []); },
  setRegistrations(list) { this.write(this.REG_KEY, list); },

  getProfile() {
    return this.read(this.PROFILE_KEY, {
      name: "Jordan Lee",
      studentId: "S2024817",
      email: "jordan.lee@horizon.edu",
      major: "Computer Science",
      year: "Sophomore",
    });
  },
  setProfile(profile) { this.write(this.PROFILE_KEY, profile); },
};

/* ==========================================================================
   Utilities
   ========================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function findCourse(code) {
  return COURSES.find((c) => c.code === code);
}

function formatCode(code) {
  // "CS101" -> "CS 101" (easier for screen readers and humans)
  return code.replace(/^([A-Z]+)(\d+)$/, "$1 $2");
}

function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
}

function formatSchedule(course) {
  return `${course.days.join(", ")} · ${formatTime(course.start)}–${formatTime(course.end)}`;
}

function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function coursesOverlap(a, b) {
  const sharedDay = a.days.some((d) => b.days.includes(d));
  return sharedDay && toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
}

function isRegistered(code) {
  return Store.getRegistrations().some((r) => r.code === code);
}

function seatsLeft(course) {
  return Math.max(0, course.capacity - course.enrolled - (isRegistered(course.code) ? 1 : 0));
}

function totalCredits(registrations = Store.getRegistrations()) {
  return registrations.reduce((sum, r) => sum + (findCourse(r.code)?.credits ?? 0), 0);
}

function deptColor(dept) {
  return DEPARTMENTS[dept]?.color ?? "purple";
}

/* Screen-reader announcements via a shared polite live region. */
function announce(message) {
  const region = $("#live-region");
  if (!region) return;
  region.textContent = "";
  // Small delay so repeated identical messages are still announced.
  setTimeout(() => { region.textContent = message; }, 50);
}

/* ==========================================================================
   Navigation
   ========================================================================== */
function initNav() {
  const toggle = $(".nav-toggle");
  const menu = $("#primary-menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.dataset.open = String(open);
  };
  setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close on Escape and return focus to the toggle
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close when focus/click leaves the header on small screens
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".site-header")) setOpen(false);
  });

  updateNavBadge();
}

function updateNavBadge() {
  const badge = $("#nav-reg-count");
  if (!badge) return;
  const count = Store.getRegistrations().length;
  badge.textContent = count;
  badge.hidden = count === 0;
  $("#nav-reg-count-label").textContent = count ? `, ${count} registered course${count === 1 ? "" : "s"}` : "";
}

/* ==========================================================================
   Confirmation modal (native <dialog> provides focus containment,
   Escape-to-close and an inert background).
   ========================================================================== */
const Modal = {
  dialog: null,
  opener: null,
  onConfirm: null,

  init() {
    this.dialog = $("#confirm-modal");
    if (!this.dialog) return;

    $("#modal-confirm", this.dialog).addEventListener("click", () => {
      const cb = this.onConfirm;
      this.close();
      if (cb) cb();
    });
    $$("[data-modal-close]", this.dialog).forEach((btn) =>
      btn.addEventListener("click", () => this.close())
    );
    // Click on backdrop closes
    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) this.close();
    });
    // Restore focus to whatever opened the dialog
    this.dialog.addEventListener("close", () => {
      if (this.opener && document.contains(this.opener)) this.opener.focus();
      this.opener = null;
    });
  },

  open({ title, body, confirmText = "Confirm", cancelText = "Cancel", danger = false, onConfirm }) {
    if (!this.dialog) return;
    this.opener = document.activeElement;
    this.onConfirm = onConfirm;

    $("#modal-title", this.dialog).textContent = title;
    $("#modal-body", this.dialog).innerHTML = body;
    const confirmBtn = $("#modal-confirm", this.dialog);
    confirmBtn.textContent = confirmText;
    confirmBtn.className = `btn ${danger ? "btn-danger" : "btn-primary"}`;
    $("#modal-cancel", this.dialog).textContent = cancelText;
    $(".modal-header", this.dialog).classList.toggle("danger", danger);

    this.dialog.showModal();
    // Focus the least destructive action by default
    $("#modal-cancel", this.dialog).focus();
  },

  close() {
    this.onConfirm = null;
    if (this.dialog?.open) this.dialog.close();
  },
};

/* ==========================================================================
   Course card
   ========================================================================== */
function courseCardHTML(course) {
  const dept = DEPARTMENTS[course.dept];
  const left = seatsLeft(course);
  const registered = isRegistered(course.code);
  const pctFull = Math.round(((course.capacity - left) / course.capacity) * 100);
  const headingId = `course-${course.code}-title`;

  let status;
  let action;
  if (registered) {
    status = `<span class="tag tag-success"><span aria-hidden="true">✓</span> Registered</span>`;
    action = `<a class="btn btn-outline btn-sm" href="profile.html">View schedule</a>`;
  } else if (left === 0) {
    status = `<span class="tag tag-danger"><span aria-hidden="true">✕</span> Full</span>`;
    action = `<button type="button" class="btn btn-outline btn-sm" disabled>Class full</button>`;
  } else {
    status = `<span class="tag tag-accent">${left} seat${left === 1 ? "" : "s"} open</span>`;
    action = `<a class="btn btn-primary btn-sm" href="register.html?course=${course.code}"
                 aria-describedby="${headingId}">Register</a>`;
  }

  return `
    <li class="course-card accent-${dept.color}">
      <article aria-labelledby="${headingId}">
        <div class="course-card-header">
          <span class="course-code">${formatCode(course.code)}</span>
          <h3 id="${headingId}">${escapeHTML(course.title)}</h3>
        </div>
        <div class="course-card-body">
          <p>${escapeHTML(course.description)}</p>
          <dl class="course-meta">
            <dt>Department</dt><dd>${escapeHTML(dept.name)}</dd>
            <dt>Instructor</dt><dd>${escapeHTML(course.instructor)}</dd>
            <dt>Schedule</dt><dd>${formatSchedule(course)}</dd>
            <dt>Room</dt><dd>${escapeHTML(course.room)}</dd>
            <dt>Credits</dt><dd>${course.credits}</dd>
          </dl>
          <div class="seat-bar" aria-hidden="true">
            <div class="seat-bar-fill" style="width:${pctFull}%"></div>
          </div>
          <p class="seat-text">${left} of ${course.capacity} seats available</p>
        </div>
        <div class="course-card-footer">
          ${status}
          ${action}
        </div>
      </article>
    </li>`;
}

/* ==========================================================================
   Registered courses table (used on Registration and Profile pages)
   ========================================================================== */
function renderRegistrationsTable() {
  const tbody = $("#registered-tbody");
  if (!tbody) return;
  const regs = Store.getRegistrations();
  const tfoot = $("#registered-tfoot");

  if (regs.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="8">You haven't registered for any courses yet.
          <a href="catalog.html">Browse the course catalog</a>.</td>
      </tr>`;
    if (tfoot) tfoot.innerHTML = "";
  } else {
    tbody.innerHTML = regs.map((r) => {
      const c = findCourse(r.code);
      if (!c) return "";
      return `
        <tr>
          <th scope="row">${formatCode(c.code)}</th>
          <td>${escapeHTML(c.title)}</td>
          <td class="num">${c.credits}</td>
          <td>${formatSchedule(c)}</td>
          <td>${escapeHTML(c.instructor)}</td>
          <td>${escapeHTML(r.term)}</td>
          <td>${escapeHTML(r.grading)}</td>
          <td>
            <button type="button" class="btn btn-danger btn-sm" data-drop="${c.code}">
              Drop<span class="visually-hidden"> ${formatCode(c.code)}, ${escapeHTML(c.title)}</span>
            </button>
          </td>
        </tr>`;
    }).join("");
    if (tfoot) {
      tfoot.innerHTML = `
        <tr>
          <th scope="row" colspan="2">Total credits</th>
          <td class="num">${totalCredits(regs)}</td>
          <td colspan="5">of ${MAX_CREDITS} maximum this term</td>
        </tr>`;
    }
  }
}

function initDropButtons(onChange) {
  const tbody = $("#registered-tbody");
  if (!tbody) return;

  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-drop]");
    if (!btn) return;
    const course = findCourse(btn.dataset.drop);

    Modal.open({
      title: "Drop this course?",
      body: `<p>Are you sure you want to drop <strong>${formatCode(course.code)}: ${escapeHTML(course.title)}</strong>?
             Your seat will be released to other students.</p>`,
      confirmText: "Yes, drop course",
      cancelText: "Keep course",
      danger: true,
      onConfirm: () => {
        Store.setRegistrations(Store.getRegistrations().filter((r) => r.code !== course.code));
        renderRegistrationsTable();
        updateNavBadge();
        if (onChange) onChange();
        announce(`${formatCode(course.code)} ${course.title} was dropped.`);
        // The button that opened the modal no longer exists; move focus somewhere sensible.
        const heading = $("#registered-heading");
        heading?.focus();
      },
    });
  });
}

/* ==========================================================================
   Page: Home
   ========================================================================== */
function initHome() {
  const deptGrid = $("#dept-grid");
  if (deptGrid) {
    deptGrid.innerHTML = Object.entries(DEPARTMENTS).map(([code, d]) => {
      const count = COURSES.filter((c) => c.dept === code).length;
      return `
        <li>
          <a class="dept-tile accent-${d.color}" href="catalog.html?dept=${code}">
            <span class="dept-icon" aria-hidden="true">${deptIcon(code)}</span>
            <span>${escapeHTML(d.name)}
              <span class="dept-count">${count} course${count === 1 ? "" : "s"}</span>
            </span>
          </a>
        </li>`;
    }).join("");
  }

  const stat = (id, value) => { const el = $(id); if (el) el.textContent = value; };
  stat("#stat-courses", COURSES.length);
  stat("#stat-depts", Object.keys(DEPARTMENTS).length);
  stat("#stat-open", COURSES.reduce((sum, c) => sum + seatsLeft(c), 0));
  stat("#stat-mine", Store.getRegistrations().length);

  const featured = $("#featured-courses");
  if (featured) {
    featured.innerHTML = COURSES.filter((c) => seatsLeft(c) > 0).slice(0, 3).map(courseCardHTML).join("");
  }
}

function deptIcon(code) {
  return { CS: "💻", MATH: "∑", BIO: "🧬", ART: "🎨", HIST: "🏛", PSY: "🧠" }[code] ?? "📘";
}

/* ==========================================================================
   Page: Catalog
   ========================================================================== */
function initCatalog() {
  const form = $("#filter-form");
  const search = $("#search");
  const deptSel = $("#filter-dept");
  const levelSel = $("#filter-level");
  const creditSel = $("#filter-credits");
  const openOnly = $("#filter-open");
  const list = $("#course-list");
  const count = $("#results-count");

  // Populate dropdowns from data
  deptSel.insertAdjacentHTML("beforeend", Object.entries(DEPARTMENTS)
    .map(([code, d]) => `<option value="${code}">${escapeHTML(d.name)}</option>`).join(""));
  levelSel.insertAdjacentHTML("beforeend", Object.entries(LEVELS)
    .map(([lvl, label]) => `<option value="${lvl}">${escapeHTML(label)}</option>`).join(""));
  const credits = [...new Set(COURSES.map((c) => c.credits))].sort();
  creditSel.insertAdjacentHTML("beforeend", credits
    .map((n) => `<option value="${n}">${n} credits</option>`).join(""));

  // Restore state from URL (?q=…&dept=…) so filtered views are linkable
  const params = new URLSearchParams(location.search);
  search.value = params.get("q") ?? "";
  deptSel.value = DEPARTMENTS[params.get("dept")] ? params.get("dept") : "";
  levelSel.value = LEVELS[params.get("level")] ? params.get("level") : "";
  creditSel.value = credits.includes(Number(params.get("credits"))) ? params.get("credits") : "";
  openOnly.checked = params.get("open") === "1";

  function apply({ announceResult = true } = {}) {
    const q = search.value.trim().toLowerCase();
    const results = COURSES.filter((c) => {
      const haystack = [c.code, formatCode(c.code), c.title, c.instructor, c.description,
                        DEPARTMENTS[c.dept].name].join(" ").toLowerCase();
      return (!q || haystack.includes(q))
        && (!deptSel.value || c.dept === deptSel.value)
        && (!levelSel.value || c.level === Number(levelSel.value))
        && (!creditSel.value || c.credits === Number(creditSel.value))
        && (!openOnly.checked || seatsLeft(c) > 0);
    });

    if (results.length) {
      list.innerHTML = results.map(courseCardHTML).join("");
      list.hidden = false;
      $("#no-results").hidden = true;
    } else {
      list.innerHTML = "";
      list.hidden = true;
      $("#no-results").hidden = false;
    }

    const msg = `Showing ${results.length} of ${COURSES.length} courses`;
    count.textContent = msg;
    if (announceResult) announce(msg);

    // Keep the URL in sync without adding history entries
    const next = new URLSearchParams();
    if (search.value.trim()) next.set("q", search.value.trim());
    if (deptSel.value) next.set("dept", deptSel.value);
    if (levelSel.value) next.set("level", levelSel.value);
    if (creditSel.value) next.set("credits", creditSel.value);
    if (openOnly.checked) next.set("open", "1");
    const qs = next.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }

  // Debounce typing so screen readers aren't flooded with announcements
  let timer;
  search.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 350);
  });
  [deptSel, levelSel, creditSel, openOnly].forEach((el) => el.addEventListener("change", () => apply()));

  form.addEventListener("submit", (e) => { e.preventDefault(); clearTimeout(timer); apply(); });
  form.addEventListener("reset", () => {
    // Wait for the browser to reset the controls before filtering
    setTimeout(() => { apply(); search.focus(); }, 0);
  });
  $("#clear-filters")?.addEventListener("click", () => form.reset());

  apply({ announceResult: false });
}

/* ==========================================================================
   Page: Registration
   ========================================================================== */
function initRegister() {
  const form = $("#registration-form");
  const courseSel = $("#reg-course");
  const termSel = $("#reg-term");
  const preview = $("#course-preview");
  const summary = $("#error-summary");
  const success = $("#success-message");

  // Populate selects
  termSel.insertAdjacentHTML("beforeend",
    TERMS.map((t) => `<option value="${t}">${t}</option>`).join(""));

  function populateCourses() {
    const current = courseSel.value;
    courseSel.innerHTML = `<option value="">Select a course…</option>` +
      Object.entries(DEPARTMENTS).map(([code, d]) => {
        const options = COURSES.filter((c) => c.dept === code).map((c) => {
          const left = seatsLeft(c);
          const registered = isRegistered(c.code);
          const note = registered ? " (already registered)" : left === 0 ? " (full)" : ` (${left} seats)`;
          return `<option value="${c.code}" ${registered || left === 0 ? "disabled" : ""}>
                    ${formatCode(c.code)} – ${escapeHTML(c.title)}${note}</option>`;
        }).join("");
        return `<optgroup label="${escapeHTML(d.name)}">${options}</optgroup>`;
      }).join("");
    const opt = $(`option[value="${current}"]`, courseSel);
    courseSel.value = opt && !opt.disabled ? current : "";
  }
  populateCourses();

  // Prefill from profile
  const profile = Store.getProfile();
  $("#reg-name").value = profile.name;
  $("#reg-id").value = profile.studentId;
  $("#reg-email").value = profile.email;
  termSel.value = TERMS[0];

  // Preselect course from ?course=
  const requested = new URLSearchParams(location.search).get("course");
  if (requested) {
    const opt = $(`option[value="${CSS.escape(requested)}"]`, courseSel);
    if (opt && !opt.disabled) courseSel.value = requested;
  }

  function updatePreview() {
    const c = findCourse(courseSel.value);
    preview.className = "course-preview full";
    if (!c) { preview.innerHTML = ""; return; }
    preview.classList.add(`accent-${deptColor(c.dept)}`);
    preview.innerHTML = `
      <h3>${formatCode(c.code)}: ${escapeHTML(c.title)}</h3>
      <p>${formatSchedule(c)} · ${escapeHTML(c.room)}</p>
      <p>${escapeHTML(c.instructor)} · ${c.credits} credits · ${seatsLeft(c)} seats left</p>`;
  }
  courseSel.addEventListener("change", updatePreview);
  updatePreview();

  /* ---- Validation ---- */
  const validators = {
    "reg-name": (v) => v.trim().length >= 2 || "Enter your full name.",
    "reg-id": (v) => /^S\d{7}$/i.test(v.trim()) || "Enter a student ID in the format S followed by 7 digits, for example S2024817.",
    "reg-email": (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email address, for example name@horizon.edu.",
    "reg-term": (v) => !!v || "Select a term.",
    "reg-course": (v) => {
      if (!v) return "Select a course to register for.";
      const c = findCourse(v);
      const regs = Store.getRegistrations();
      if (regs.some((r) => r.code === v)) return "You are already registered for this course.";
      if (seatsLeft(c) === 0) return "This course is full. Choose another course.";
      if (totalCredits(regs) + c.credits > MAX_CREDITS) {
        return `Adding this course would exceed the ${MAX_CREDITS}-credit limit (you have ${totalCredits(regs)} credits).`;
      }
      const clash = regs.map((r) => findCourse(r.code)).find((other) => other && coursesOverlap(c, other));
      if (clash) return `This course conflicts with ${formatCode(clash.code)} (${formatSchedule(clash)}).`;
      return true;
    },
    "reg-grading": () => !!$("input[name='grading']:checked", form) || "Choose a grading option.",
    "reg-agree": () => $("#reg-agree").checked || "You must confirm that you have read the registration policy.",
  };

  function setFieldError(id, message) {
    const errorEl = $(`#${id}-error`);
    const field = id === "reg-grading" ? $("#reg-grading") : $(`#${id}`);
    if (message) {
      errorEl.textContent = message;
      if (id === "reg-grading") {
        $$("input[name='grading']", form).forEach((r) => r.setAttribute("aria-invalid", "true"));
      } else {
        field.setAttribute("aria-invalid", "true");
      }
    } else {
      errorEl.textContent = "";
      if (id === "reg-grading") {
        $$("input[name='grading']", form).forEach((r) => r.removeAttribute("aria-invalid"));
      } else {
        field.removeAttribute("aria-invalid");
      }
    }
  }

  function validateField(id) {
    const el = $(`#${id}`);
    const result = validators[id](el?.value ?? "");
    const message = result === true ? "" : result;
    setFieldError(id, message);
    return message;
  }

  // Re-validate fields once the user has interacted and they were invalid
  Object.keys(validators).forEach((id) => {
    const targets = id === "reg-grading" ? $$("input[name='grading']", form) : [$(`#${id}`)];
    targets.forEach((el) => {
      const evt = el.type === "checkbox" || el.type === "radio" || el.tagName === "SELECT" ? "change" : "blur";
      el.addEventListener(evt, () => {
        if ($(`#${id}-error`).textContent) validateField(id);
      });
    });
  });

  function focusTargetFor(id) {
    return id === "reg-grading" ? $("input[name='grading']", form) : $(`#${id}`);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    success.hidden = true;

    const errors = Object.keys(validators)
      .map((id) => ({ id, message: validateField(id) }))
      .filter((r) => r.message);

    if (errors.length) {
      summary.innerHTML = `
        <div>
          <h2 id="error-summary-title">There ${errors.length === 1 ? "is 1 problem" : `are ${errors.length} problems`} with your registration</h2>
          <ul>${errors.map((err) => `<li><a href="#${err.id}" data-focus="${err.id}">${escapeHTML(err.message)}</a></li>`).join("")}</ul>
        </div>`;
      summary.hidden = false;
      summary.focus();
      return;
    }
    summary.hidden = true;

    const c = findCourse(courseSel.value);
    const data = {
      code: c.code,
      name: $("#reg-name").value.trim(),
      studentId: $("#reg-id").value.trim().toUpperCase(),
      email: $("#reg-email").value.trim(),
      term: termSel.value,
      grading: $("input[name='grading']:checked", form).value,
      notes: $("#reg-notes").value.trim(),
    };

    Modal.open({
      title: "Confirm your registration",
      body: `
        <p>Please review the details below before confirming.</p>
        <dl class="summary-list">
          <dt>Course</dt><dd>${formatCode(c.code)}: ${escapeHTML(c.title)}</dd>
          <dt>Schedule</dt><dd>${formatSchedule(c)}</dd>
          <dt>Instructor</dt><dd>${escapeHTML(c.instructor)}</dd>
          <dt>Credits</dt><dd>${c.credits} (new total: ${totalCredits() + c.credits} of ${MAX_CREDITS})</dd>
          <dt>Term</dt><dd>${escapeHTML(data.term)}</dd>
          <dt>Grading</dt><dd>${escapeHTML(data.grading)}</dd>
          <dt>Student</dt><dd>${escapeHTML(data.name)} (${escapeHTML(data.studentId)})</dd>
        </dl>`,
      confirmText: "Confirm registration",
      cancelText: "Go back",
      onConfirm: () => completeRegistration(data, c),
    });
  });

  summary.addEventListener("click", (e) => {
    const link = e.target.closest("[data-focus]");
    if (!link) return;
    e.preventDefault();
    focusTargetFor(link.dataset.focus)?.focus();
  });

  function completeRegistration(data, course) {
    const regs = Store.getRegistrations();
    regs.push({
      code: data.code,
      term: data.term,
      grading: data.grading,
      notes: data.notes,
      registeredAt: new Date().toISOString(),
    });
    Store.setRegistrations(regs);

    // Keep the profile in sync with the details the student entered
    Store.setProfile({ ...Store.getProfile(), name: data.name, studentId: data.studentId, email: data.email });

    $("#success-text").innerHTML =
      `You are registered for <strong>${formatCode(course.code)}: ${escapeHTML(course.title)}</strong>
       (${escapeHTML(data.term)}). <a href="profile.html">View your profile</a> or register for another course below.`;
    success.hidden = false;
    success.focus();

    courseSel.value = "";
    $("#reg-notes").value = "";
    $("#reg-agree").checked = false;
    populateCourses();
    updatePreview();
    renderRegistrationsTable();
    updateNavBadge();
  }

  renderRegistrationsTable();
  initDropButtons(() => { populateCourses(); updatePreview(); });
}

/* ==========================================================================
   Page: Profile
   ========================================================================== */
function initProfile() {
  const form = $("#profile-form");

  function initials(name) {
    const letters = name.split(/\s+/).map((part) => part.match(/\p{L}/u)?.[0]).filter(Boolean);
    return letters.slice(0, 2).join("").toUpperCase() || "?";
  }

  function renderProfile() {
    const p = Store.getProfile();
    $("#profile-avatar").textContent = initials(p.name);
    $("#profile-name").textContent = p.name;
    $("#profile-major").textContent = `${p.major} · ${p.year}`;
    $("#pd-id").textContent = p.studentId;
    $("#pd-email").textContent = p.email;
    $("#pd-major").textContent = p.major;
    $("#pd-year").textContent = p.year;
  }

  function renderStats() {
    const regs = Store.getRegistrations();
    const credits = totalCredits(regs);
    $("#ps-courses").textContent = regs.length;
    $("#ps-credits").textContent = credits;
    $("#ps-remaining").textContent = MAX_CREDITS - credits;
    const bar = $("#credit-progress");
    bar.max = MAX_CREDITS;
    bar.value = credits;
    $("#credit-progress-text").textContent = `${credits} of ${MAX_CREDITS} credits used`;
  }

  function fillForm() {
    const p = Store.getProfile();
    $("#pf-name").value = p.name;
    $("#pf-email").value = p.email;
    $("#pf-major").value = p.major;
    $("#pf-year").value = p.year;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstInvalid = null;
    const checks = [
      ["pf-name", (v) => v.trim().length >= 2, "Enter your full name."],
      ["pf-email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), "Enter a valid email address."],
      ["pf-major", (v) => v.trim().length > 0, "Enter your major."],
    ];
    checks.forEach(([id, test, msg]) => {
      const el = $(`#${id}`);
      const ok = test(el.value);
      $(`#${id}-error`).textContent = ok ? "" : msg;
      if (ok) el.removeAttribute("aria-invalid");
      else {
        el.setAttribute("aria-invalid", "true");
        firstInvalid ??= el;
      }
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    Store.setProfile({
      ...Store.getProfile(),
      name: $("#pf-name").value.trim(),
      email: $("#pf-email").value.trim(),
      major: $("#pf-major").value.trim(),
      year: $("#pf-year").value,
    });
    renderProfile();
    const msg = $("#profile-saved");
    msg.hidden = false;
    announce("Profile saved.");
  });

  form.addEventListener("input", () => { $("#profile-saved").hidden = true; });

  fillForm();
  renderProfile();
  renderStats();
  renderRegistrationsTable();
  initDropButtons(renderStats);
}

/* ==========================================================================
   Boot
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  Modal.init();

  const pages = { home: initHome, catalog: initCatalog, register: initRegister, profile: initProfile };
  pages[document.body.dataset.page]?.();
});
