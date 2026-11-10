/* Profile page: student details form and registered courses table. */
"use strict";

(function () {
  const YEARS = { "1": "First year", "2": "Second year", "3": "Third year", "4": "Fourth year" };
  const form = document.getElementById("profile-form");
  const fields = {
    name: document.getElementById("p-name"),
    email: document.getElementById("p-email"),
    studentId: document.getElementById("p-id"),
    major: document.getElementById("p-major"),
    year: document.getElementById("p-year")
  };
  const summary = document.getElementById("error-summary");
  const errorList = document.getElementById("error-list");
  const body = document.getElementById("schedule-body");
  const dialog = document.getElementById("drop-dialog");
  const baseTitle = document.title;
  let pendingDrop = null;

  Object.keys(DEPARTMENTS).forEach(function (code) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = DEPARTMENTS[code].name;
    fields.major.appendChild(option);
  });

  /* ---------- Details ---------- */

  function showProfile() {
    const p = Store.getProfile();
    document.getElementById("show-name").textContent = p.name;
    document.getElementById("show-email").textContent = p.email;
    document.getElementById("show-id").textContent = p.studentId;
    document.getElementById("show-major").textContent = DEPARTMENTS[p.major] ? DEPARTMENTS[p.major].name : p.major;
    document.getElementById("show-year").textContent = YEARS[p.year] || p.year;
    document.getElementById("avatar").textContent = p.name.split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
  }

  function fillForm() {
    const p = Store.getProfile();
    Object.keys(fields).forEach(function (key) { fields[key].value = p[key]; });
  }

  function clearErrors() {
    form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
    form.querySelectorAll(".error-message").forEach(function (el) { el.hidden = true; el.textContent = ""; });
    errorList.innerHTML = "";
    summary.hidden = true;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();
    const errors = [];
    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const studentId = fields.studentId.value.trim();
    if (!name) errors.push([fields.name, "p-name-error", "Enter your full name."]);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push([fields.email, "p-email-error", "Enter an email address in the format name@example.edu."]);
    if (!/^\d{8}$/.test(studentId)) errors.push([fields.studentId, "p-id-error", "Enter a student ID with 8 digits, for example 20241234."]);

    if (errors.length) {
      errors.forEach(function (e) {
        const error = document.getElementById(e[1]);
        error.textContent = e[2];
        error.hidden = false;
        e[0].setAttribute("aria-invalid", "true");
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#" + e[0].id;
        a.textContent = e[2];
        a.addEventListener("click", function (ev) { ev.preventDefault(); e[0].focus(); });
        li.appendChild(a);
        errorList.appendChild(li);
      });
      document.getElementById("error-summary-title").textContent =
        errors.length === 1 ? "There is 1 problem with your details" : "There are " + errors.length + " problems with your details";
      summary.hidden = false;
      document.title = "Error: " + baseTitle;
      summary.focus();
      return;
    }

    document.title = baseTitle;
    Store.saveProfile({ name: name, email: email, studentId: studentId, major: fields.major.value, year: fields.year.value });
    showProfile();
    announce("Your details were saved.");
  });

  /* ---------- Schedule table ---------- */

  function renderTable() {
    const regs = Store.getRegistrations();
    const wrap = document.getElementById("table-wrap");
    const empty = document.getElementById("schedule-empty");
    let total = 0;
    body.innerHTML = regs.map(function (r) {
      const c = findCourse(r.id);
      total += c.credits;
      return "<tr>" +
        '<th scope="row">' + escapeHtml(c.id) + "</th>" +
        "<td>" + escapeHtml(c.title) + "</td>" +
        "<td>" + c.credits + "</td>" +
        "<td>" + escapeHtml(formatSchedule(c)) + "<br>" + escapeHtml(c.room) + "</td>" +
        "<td>" + escapeHtml(c.instructor) + "</td>" +
        "<td>" + escapeHtml(r.grading || "Letter grade") + "</td>" +
        '<td><button class="btn btn-danger btn-small" type="button" data-course="' + escapeHtml(c.id) +
          '" aria-label="Drop ' + escapeHtml(c.id) + '">Drop</button></td>' +
      "</tr>";
    }).join("");
    document.getElementById("total-credits").textContent = total;
    document.getElementById("schedule-summary").textContent = regs.length
      ? "You are registered for " + regs.length + (regs.length === 1 ? " course" : " courses") + ", " + total + " of " + MAX_CREDITS + " credits."
      : "";
    wrap.hidden = regs.length === 0;
    empty.hidden = regs.length !== 0;
  }

  body.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-course]");
    if (!button) return;
    pendingDrop = button.getAttribute("data-course");
    const c = findCourse(pendingDrop);
    document.getElementById("drop-title").textContent = "Drop " + c.id + "?";
    document.getElementById("drop-text").textContent =
      "You will lose your seat in " + c.id + ": " + c.title + ". You can register again later if seats are still open.";
    dialog.returnValue = "";
    dialog.showModal();
    document.getElementById("drop-cancel").focus();
  });

  document.getElementById("drop-cancel").addEventListener("click", function () { dialog.close("cancel"); });
  document.getElementById("drop-ok").addEventListener("click", function () { dialog.close("drop"); });

  dialog.addEventListener("close", function () {
    const id = pendingDrop;
    pendingDrop = null;
    const buttons = Array.prototype.slice.call(body.querySelectorAll("button[data-course]"));
    const index = buttons.findIndex(function (b) { return b.getAttribute("data-course") === id; });

    if (dialog.returnValue !== "drop") {
      if (buttons[index]) buttons[index].focus();
      return;
    }

    Store.saveRegistrations(Store.getRegistrations().filter(function (r) { return r.id !== id; }));
    renderTable();

    /* The Drop button is gone: focus the Drop button that took its place, or the previous one, or the heading. */
    const remaining = body.querySelectorAll("button[data-course]");
    const next = remaining[index] || remaining[index - 1];
    (next || document.getElementById("schedule-title")).focus();
    announce(id + " was dropped from your schedule.");
  });

  fillForm();
  showProfile();
  renderTable();
})();
