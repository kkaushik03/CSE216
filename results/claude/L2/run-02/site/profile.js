/* Student profile page: details, stats and the registered courses table. */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var U = window.UCR;
  var body = document.getElementById("reg-body");
  var foot = document.getElementById("reg-foot");
  var status = document.getElementById("drop-status");
  var YEARS = { "1": "First year", "2": "Second year", "3": "Third year", "4": "Fourth year" };

  function renderStudent() {
    var s = U.store.getStudent();
    document.getElementById("profile-name").textContent = s.name;
    document.getElementById("p-id").textContent = s.studentId;
    document.getElementById("p-email").textContent = s.email;
    document.getElementById("p-program").textContent = s.program;
    document.getElementById("p-year").textContent = YEARS[s.year] || s.year;
    document.getElementById("avatar").textContent = s.name.split(/\s+/).map(function (w) {
      return w.charAt(0);
    }).slice(0, 2).join("").toUpperCase();
  }

  function rows() {
    return U.store.getRegistered()
      .map(function (r) { return { reg: r, course: U.findCourse(r.code) }; })
      .filter(function (x) { return x.course; })
      .sort(function (a, b) { return a.course.code.localeCompare(b.course.code, undefined, { numeric: true }); });
  }

  function renderTable() {
    var data = rows();
    var credits = data.reduce(function (s, x) { return s + x.course.credits; }, 0);
    var days = {};
    data.forEach(function (x) { x.course.days.forEach(function (d) { days[d] = true; }); });

    document.getElementById("s-courses").textContent = data.length;
    document.getElementById("s-credits").textContent = credits;
    document.getElementById("s-remaining").textContent = Math.max(0, U.MAX_CREDITS - credits);
    document.getElementById("s-days").textContent = Object.keys(days).length;

    if (!data.length) {
      body.innerHTML = '<tr><td colspan="8" class="empty">' +
        "<strong>You haven't registered for any courses yet.</strong><br>" +
        '<a href="catalog.html">Browse the catalog</a> to find courses, then complete <a href="register.html">registration</a>.</td></tr>';
      foot.innerHTML = "";
      return;
    }

    body.innerHTML = data.map(function (x) {
      var c = x.course;
      var dept = U.findDept(c.dept);
      return "<tr>" +
        '<th scope="row">' + U.escapeHTML(c.code) + "</th>" +
        "<td>" + U.escapeHTML(c.title) + "</td>" +
        '<td class="c-' + dept.color + '"><span class="dot" aria-hidden="true"></span>' + U.escapeHTML(dept.name) + "</td>" +
        "<td>" + c.credits + "</td>" +
        '<td><span aria-hidden="true">' + U.escapeHTML(U.scheduleText(c)) + '</span><span class="visually-hidden">' +
          U.escapeHTML(U.scheduleLong(c)) + "</span><br><small>" + U.escapeHTML(c.room) + "</small></td>" +
        "<td>" + U.escapeHTML(c.instructor) + "</td>" +
        "<td>" + U.escapeHTML(U.termName(x.reg.term)) + "</td>" +
        '<td><button type="button" class="btn btn--ghost btn--small" data-drop="' + U.escapeHTML(c.code) + '">' +
          'Drop<span class="visually-hidden"> ' + U.escapeHTML(c.code + " " + c.title) + "</span></button></td>" +
        "</tr>";
    }).join("");

    foot.innerHTML = '<tr><th scope="row" colspan="3">Total</th><td>' + credits +
      '</td><td colspan="4">' + data.length + (data.length === 1 ? " course" : " courses") + "</td></tr>";
  }

  body.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-drop]");
    if (!btn) return;
    var code = btn.getAttribute("data-drop");
    var course = U.findCourse(code);

    U.confirmDialog({
      title: "Drop " + code + "?",
      description: "You will be removed from " + code + " " + course.title + ". Your seat may be given to another student.",
      confirmText: "Drop course",
      cancelText: "Keep course",
      tone: "danger"
    }).then(function (ok) {
      if (!ok) return;
      /* remember position so focus can move to a sensible neighbour */
      var buttons = Array.prototype.slice.call(body.querySelectorAll("[data-drop]"));
      var index = buttons.indexOf(btn);

      U.store.setRegistered(U.store.getRegistered().filter(function (r) { return r.code !== code; }));
      renderTable();

      status.textContent = code + " " + course.title + " was dropped from your schedule.";
      status.hidden = false;

      var remaining = body.querySelectorAll("[data-drop]");
      if (remaining.length) {
        remaining[Math.min(index, remaining.length - 1)].focus();
        U.announce(status.textContent);
      } else {
        status.focus();
      }
    });
  });

  document.getElementById("reset-demo").addEventListener("click", function () {
    U.confirmDialog({
      title: "Reset demo data?",
      description: "This removes all registered courses, your course selection and saved profile details from this browser.",
      confirmText: "Reset everything",
      cancelText: "Cancel",
      tone: "danger"
    }).then(function (ok) {
      if (!ok) return;
      U.store.setRegistered([]);
      U.store.setSelected([]);
      U.store.setStudent(U.DATA.defaultStudent);
      renderStudent();
      renderTable();
      status.textContent = "Demo data has been reset.";
      status.hidden = false;
      status.focus();
    });
  });

  renderStudent();
  renderTable();
});
