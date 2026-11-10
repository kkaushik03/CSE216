/* Student profile: details, registered courses table, drop dialog and edit form. */
(function () {
  "use strict";

  var NB = window.NB;

  document.addEventListener("DOMContentLoaded", function () {
    var details = document.getElementById("profile-details");
    var avatar = document.getElementById("avatar");
    var stats = document.getElementById("stats");
    var tbody = document.getElementById("registered-body");
    var totalCell = document.getElementById("total-credits");
    var tableWrap = document.getElementById("table-wrap");
    var emptyState = document.getElementById("registered-empty");
    var regSummary = document.getElementById("registered-summary");
    var regTitle = document.getElementById("registered-title");
    var dialog = document.getElementById("drop-dialog");
    var dropDesc = document.getElementById("drop-desc");
    var dropTitle = document.getElementById("drop-title");
    var dropCancel = document.getElementById("drop-cancel");
    var dropOk = document.getElementById("drop-ok");

    var form = document.getElementById("profile-form");
    var summary = document.getElementById("profile-error-summary");
    var fields = {
      name: document.getElementById("p-name"),
      email: document.getElementById("p-email"),
      phone: document.getElementById("p-phone"),
      studentId: document.getElementById("p-id"),
      program: document.getElementById("p-program"),
      year: document.getElementById("p-year")
    };

    NB.bindErrorSummary(summary);

    function initials(name) {
      var parts = name.trim().split(/\s+/).filter(Boolean);
      if (!parts.length) return "?";
      return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
    }

    function renderProfile() {
      var p = NB.getProfile();
      avatar.textContent = initials(p.name);
      var rows = [
        ["Name", p.name],
        ["Student ID", p.studentId],
        ["Email", p.email],
        ["Phone", p.phone || "Not provided"],
        ["Program", p.program],
        ["Year", p.year]
      ];
      details.innerHTML = rows.map(function (r) {
        return "<dt>" + r[0] + "</dt><dd>" + NB.escape(r[1]) + "</dd>";
      }).join("");
    }

    function registeredRows() {
      return NB.getRegistered().map(function (r) {
        return { course: NB.findCourse(r.id), grading: r.grading };
      }).filter(function (r) { return r.course; });
    }

    function renderTable() {
      var rows = registeredRows();
      var credits = rows.reduce(function (t, r) { return t + r.course.credits; }, 0);

      tbody.innerHTML = rows.map(function (r) {
        var c = r.course;
        return '<tr class="dept-' + c.dept + '">' +
          '<th scope="row"><span class="code-chip">' + NB.escape(c.code) + "</span></th>" +
          "<td>" + NB.escape(c.title) + "</td>" +
          "<td>" + NB.escape(NB.scheduleText(c)) + "<br>" + NB.escape(c.room) + "</td>" +
          "<td>" + NB.escape(c.instructor) + "</td>" +
          '<td class="num">' + c.credits + "</td>" +
          "<td>" + NB.escape(r.grading) + "</td>" +
          '<td><button type="button" class="btn btn-secondary btn-small" data-drop="' + c.id + '" aria-label="Drop ' + NB.escape(c.code) + '">Drop</button></td>' +
          "</tr>";
      }).join("");
      totalCell.textContent = String(credits);

      tableWrap.hidden = rows.length === 0;
      emptyState.hidden = rows.length > 0;
      regSummary.textContent = rows.length
        ? "You are registered for " + NB.coursesText(rows.length) + " with " + NB.creditsText(credits) + " of " + NB.CREDIT_LIMIT + " allowed."
        : "";

      var planCount = NB.getPlan().length;
      stats.innerHTML =
        '<li class="stat stat-1">' + NB.coursesText(rows.length) + " registered</li>" +
        '<li class="stat stat-2">' + NB.creditsText(credits) + "</li>" +
        '<li class="stat stat-3">' + NB.coursesText(planCount) + " in plan</li>";
    }

    /* ----- Drop a course ----- */
    var pending = null;

    tbody.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-drop]");
      if (!button) return;
      var course = NB.findCourse(button.getAttribute("data-drop"));
      if (!course) return;
      pending = { course: course, button: button };
      dropTitle.textContent = "Drop " + course.code + "?";
      dropDesc.textContent = "You will no longer be registered for " + course.code + " " + course.title +
        ". Your seat may be given to another student.";
      dialog.returnValue = "";
      dialog.showModal();
      dropCancel.focus();
    });

    dropCancel.addEventListener("click", function () {
      dialog.close("cancel");
    });

    dropOk.addEventListener("click", function () {
      dialog.close("drop");
    });

    dialog.addEventListener("close", function () {
      if (!pending) return;
      var course = pending.course;
      var opener = pending.button;
      pending = null;

      if (dialog.returnValue !== "drop") {
        if (document.body.contains(opener)) opener.focus();
        return;
      }

      /* Work out where focus should go once the row is gone: next row, else previous row, else the heading. */
      var buttons = Array.prototype.slice.call(tbody.querySelectorAll("button[data-drop]"));
      var index = buttons.indexOf(opener);
      var neighbour = buttons[index + 1] || buttons[index - 1];
      var neighbourId = neighbour ? neighbour.getAttribute("data-drop") : null;

      NB.setRegistered(NB.getRegistered().filter(function (r) { return r.id !== course.id; }));
      renderTable();

      var target = neighbourId ? tbody.querySelector('button[data-drop="' + neighbourId + '"]') : null;
      (target || regTitle).focus();

      var rows = registeredRows();
      NB.announce(course.code + " dropped. You are registered for " + NB.coursesText(rows.length) + ".");
    });

    /* ----- Edit details ----- */
    function fillForm() {
      var p = NB.getProfile();
      Object.keys(fields).forEach(function (k) { fields[k].value = p[k]; });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var errors = [];
      function check(key, message) {
        var input = fields[key];
        NB.setFieldError(input, document.getElementById(input.id + "-error"), message);
        if (message) errors.push({ targetId: input.id, message: message });
      }

      var name = fields.name.value.trim();
      check("name", name ? "" : "Enter your full name.");
      var email = fields.email.value.trim();
      check("email", !email ? "Enter your email address." :
        !NB.isValidEmail(email) ? "Enter an email address in the format name@example.com." : "");
      var phone = fields.phone.value.trim();
      var digits = phone.replace(/\D/g, "");
      check("phone", phone && (digits.length < 10 || /[^\d\s()+.-]/.test(phone))
        ? "Enter a phone number with at least 10 digits, for example 555-123-4567, or leave it empty." : "");
      var sid = fields.studentId.value.trim();
      check("studentId", /^\d{8}$/.test(sid) ? "" : "Enter a student ID with 8 digits, for example 20231234.");

      document.getElementById("profile-status").textContent = "";
      NB.showErrorSummary(summary, errors, "details");
      if (errors.length) return;

      NB.setProfile({
        name: name,
        email: email,
        phone: phone,
        studentId: sid,
        program: fields.program.value,
        year: fields.year.value
      });
      renderProfile();
      NB.announce("Your details were saved.", "profile-status");
    });

    renderProfile();
    renderTable();
    fillForm();
  });
})();
