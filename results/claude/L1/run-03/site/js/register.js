/* Registration page: student form, course picker, validation and confirmation modal. */

const PROGRAMS = [
  "Computer Science", "Mathematics", "Biology", "Fine Arts",
  "Business Administration", "Psychology", "Undeclared",
];

const selected = new Set();

/* ---------- Course picker ---------- */

function renderPicker() {
  const q = document.getElementById("pick-search").value.trim().toLowerCase();
  const dept = document.getElementById("pick-dept").value;
  const registered = getRegisteredCodes();

  const list = COURSES.filter((c) =>
    (!dept || c.dept === dept) &&
    (!q || `${c.code} ${c.title} ${c.instructor}`.toLowerCase().includes(q)));

  document.getElementById("course-picker").innerHTML = list.length ? list.map((c) => {
    const already = registered.includes(c.code);
    const full = seatsLeft(c) === 0;
    const disabled = already || full;
    const checked = selected.has(c.code);
    const tag = already ? "✓ Already registered" : full ? "Class full" : "";
    return `
      <label class="pick ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}" style="--accent:${DEPARTMENTS[c.dept].color}">
        <input type="checkbox" value="${c.code}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}>
        <span>
          <strong>${c.code}</strong> · ${c.credits} cr<br>
          ${c.title}
          <small>${formatSchedule(c)}</small>
          ${tag ? `<span class="tag" style="${already ? "color:#16a34a" : ""}">${tag}</span>` : `<small>${seatsLeft(c)} seats left</small>`}
        </span>
      </label>`;
  }).join("") : `<p class="muted">No courses match this filter.</p>`;
}

/* ---------- Summary + conflict checks ---------- */

function getSelectionIssues() {
  const registered = getRegisteredCodes();
  const chosen = [...selected];
  const conflicts = [];

  chosen.forEach((code, i) => {
    const course = getCourse(code);
    // Compare against already-registered courses and earlier selections (avoid duplicate pairs).
    const other = findConflict(course, [...registered, ...chosen.slice(0, i)]);
    if (other) conflicts.push([course, other]);
  });

  const credits = totalCredits([...registered, ...chosen]);
  return { conflicts, credits, overLimit: credits > MAX_CREDITS };
}

function renderSummary() {
  const registered = getRegisteredCodes();
  const items = [
    ...registered.map((code) => ({ course: getCourse(code), existing: true })),
    ...[...selected].map((code) => ({ course: getCourse(code), existing: false })),
  ];

  document.getElementById("summary-list").innerHTML = items.length
    ? items.map(({ course, existing }) => `
        <li class="${existing ? "existing" : ""}" style="--accent:${DEPARTMENTS[course.dept].color}">
          <span><strong>${course.code}</strong> ${course.title}${existing ? " <em>(registered)</em>" : ""}</span>
          <span>${course.credits} cr</span>
        </li>`).join("")
    : `<li style="--accent:#cbd5e1">No courses selected yet</li>`;

  const { conflicts, credits, overLimit } = getSelectionIssues();
  const meter = document.getElementById("credit-meter");
  meter.classList.toggle("over", overLimit);
  meter.querySelector("span").style.width = `${Math.min(100, (credits / MAX_CREDITS) * 100)}%`;
  document.getElementById("summary-credits").textContent = `${credits} / ${MAX_CREDITS}`;

  const alerts = conflicts.map(([a, b]) =>
    `<div class="alert alert-danger">⚠️ <strong>${a.code}</strong> conflicts with <strong>${b.code}</strong> (${formatSchedule(b)})</div>`);
  if (overLimit) alerts.push(`<div class="alert alert-warn">⛔ You are over the ${MAX_CREDITS}-credit limit.</div>`);
  if (!alerts.length && selected.size) alerts.push(`<div class="alert alert-info">👍 No conflicts — you're good to go!</div>`);
  document.getElementById("summary-alerts").innerHTML = alerts.join("");
}

/* ---------- Validation ---------- */

const validators = {
  firstName: (v) => v.trim() ? "" : "First name is required.",
  lastName:  (v) => v.trim() ? "" : "Last name is required.",
  studentId: (v) => /^[A-Za-z]\d{5,8}$/.test(v.trim()) ? "" : "Use a letter followed by 5–8 digits (e.g. S2024001).",
  email:     (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address.",
  program:   (v) => v ? "" : "Please choose a program.",
  studyYear: (v) => v ? "" : "Please choose your year of study.",
  phone:     (v) => !v.trim() || /^[+\d][\d\s()-]{6,}$/.test(v.trim()) ? "" : "Enter a valid phone number.",
};

function setFieldError(el, message) {
  const field = el.closest(".field");
  field.classList.toggle("invalid", Boolean(message));
  field.querySelector(".error-msg").textContent = message;
}

function validateField(id) {
  const el = document.getElementById(id);
  const message = validators[id](el.value);
  setFieldError(el, message);
  return !message;
}

function validateForm() {
  let ok = Object.keys(validators).map(validateField).every(Boolean);

  const coursesField = document.getElementById("courses-field");
  const { conflicts, overLimit } = getSelectionIssues();
  let courseMsg = "";
  if (!selected.size) courseMsg = "Select at least one course.";
  else if (conflicts.length) courseMsg = "Resolve schedule conflicts before continuing.";
  else if (overLimit) courseMsg = `Reduce your load to ${MAX_CREDITS} credits or fewer.`;
  coursesField.querySelector(".error-msg").textContent = courseMsg;
  if (courseMsg) ok = false;

  const terms = document.getElementById("terms");
  setFieldError(terms, terms.checked ? "" : "You must accept the policies to continue.");
  if (!terms.checked) ok = false;

  return ok;
}

/* ---------- Form data ---------- */

function readProfileFromForm() {
  const val = (id) => document.getElementById(id).value.trim();
  return {
    firstName: val("firstName"),
    lastName: val("lastName"),
    studentId: val("studentId").toUpperCase(),
    email: val("email"),
    program: val("program"),
    year: val("studyYear"),
    phone: val("phone"),
    semester: val("semester"),
  };
}

function fillFormFromProfile(profile) {
  if (!profile) return;
  const map = { firstName: "firstName", lastName: "lastName", studentId: "studentId", email: "email",
                program: "program", studyYear: "year", phone: "phone", semester: "semester" };
  Object.entries(map).forEach(([id, key]) => {
    if (profile[key]) document.getElementById(id).value = profile[key];
  });
}

/* ---------- Submit flow ---------- */

function showConfirmation() {
  const profile = readProfileFromForm();
  const courses = [...selected].map(getCourse);
  const credits = courses.reduce((s, c) => s + c.credits, 0);

  openModal({
    title: "Confirm Your Registration",
    icon: "📋",
    confirmText: "✓ Confirm & Register",
    cancelText: "Go back",
    body: `
      <dl class="modal-info">
        <dt>Student</dt><dd>${escapeHTML(profile.firstName)} ${escapeHTML(profile.lastName)}</dd>
        <dt>ID</dt><dd>${escapeHTML(profile.studentId)}</dd>
        <dt>Email</dt><dd>${escapeHTML(profile.email)}</dd>
        <dt>Program</dt><dd>${escapeHTML(profile.program)} · ${escapeHTML(profile.year)}</dd>
        <dt>Semester</dt><dd>${escapeHTML(profile.semester)}</dd>
      </dl>
      ${courses.map((c) => `
        <div class="modal-course" style="--accent:${DEPARTMENTS[c.dept].color}">
          <strong>${c.code} — ${c.title} (${c.credits} cr)</strong>
          <span>${c.instructor} · ${formatSchedule(c)}</span>
        </div>`).join("")}
      <p>Adding <strong>${credits}</strong> credits · New total:
         <strong>${totalCredits([...getRegisteredCodes(), ...selected])} / ${MAX_CREDITS}</strong></p>`,
    onConfirm: () => completeRegistration(profile),
  });
}

function completeRegistration(profile) {
  const codes = [...selected];
  saveProfile(profile);
  addRegistrations(codes);
  selected.clear();
  renderNavbar();
  renderPicker();
  renderSummary();
  document.getElementById("terms").checked = false;

  // Show the success modal once the confirmation modal has closed.
  setTimeout(() => openModal({
    title: "Registration Successful!",
    icon: "🎉",
    variant: "success",
    confirmText: "View My Profile",
    cancelText: "Register More",
    body: `<p>You're enrolled in <strong>${codes.join(", ")}</strong>.</p>
           <p>A confirmation has been sent to <strong>${escapeHTML(profile.email)}</strong>.</p>`,
    onConfirm: () => { window.location.href = "profile.html"; },
  }), 300);
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("program").insertAdjacentHTML("beforeend",
    PROGRAMS.map((p) => `<option>${p}</option>`).join(""));
  document.getElementById("pick-dept").insertAdjacentHTML("beforeend",
    Object.entries(DEPARTMENTS).map(([k, d]) => `<option value="${k}">${d.icon} ${d.name}</option>`).join(""));

  fillFormFromProfile(getProfile());

  // Preselect a course passed from the catalog (?course=CS101).
  const pre = new URLSearchParams(window.location.search).get("course");
  const preCourse = getCourse(pre);
  if (preCourse && !isRegistered(pre) && seatsLeft(preCourse) > 0) selected.add(pre);

  const form = document.getElementById("register-form");

  document.getElementById("course-picker").addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    e.target.checked ? selected.add(e.target.value) : selected.delete(e.target.value);
    e.target.closest(".pick").classList.toggle("checked", e.target.checked);
    document.querySelector("#courses-field .error-msg").textContent = "";
    renderSummary();
  });

  document.getElementById("pick-search").addEventListener("input", renderPicker);
  document.getElementById("pick-dept").addEventListener("change", renderPicker);

  Object.keys(validators).forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener("blur", () => validateField(id));
    el.addEventListener("input", () => {
      if (el.closest(".field").classList.contains("invalid")) validateField(id);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      showConfirmation();
    } else {
      showToast("Please fix the highlighted fields.", "error");
      form.querySelector(".invalid .input, .invalid select, .invalid input")?.focus();
    }
  });

  form.addEventListener("reset", () => {
    selected.clear();
    form.querySelectorAll(".field.invalid").forEach((f) => f.classList.remove("invalid"));
    form.querySelectorAll(".error-msg").forEach((m) => { m.textContent = ""; });
    // Let the browser finish resetting inputs before re-rendering.
    setTimeout(() => { renderPicker(); renderSummary(); });
  });

  renderPicker();
  renderSummary();
});
