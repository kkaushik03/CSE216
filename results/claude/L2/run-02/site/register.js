/* Registration page: form, validation, live summary and confirmation modal. */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var U = window.UCR;
  var D = U.DATA;
  var form = document.getElementById("reg-form");
  var optionsList = document.getElementById("course-options");
  var summaryList = document.getElementById("summary-list");
  var summaryCredits = document.getElementById("summary-credits");
  var summaryStatus = document.getElementById("summary-status");
  var meter = document.getElementById("credit-meter");
  var errorSummary = document.getElementById("error-summary");
  var errorList = document.getElementById("error-list");
  var success = document.getElementById("success");

  Array.prototype.forEach.call(document.querySelectorAll(".max-credits"), function (el) {
    el.textContent = U.MAX_CREDITS;
  });

  /* ---------- build dynamic controls ---------- */
  var program = document.getElementById("program");
  D.programs.forEach(function (p) {
    var o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    program.appendChild(o);
  });

  document.getElementById("term-options").innerHTML = D.terms.map(function (t, i) {
    return '<label class="check" for="term-' + t.id + '">' +
      '<input type="radio" name="term" id="term-' + t.id + '" value="' + t.id + '"' + ">" +
      "<span>" + U.escapeHTML(t.name) + "</span></label>";
  }).join("");

  /* prefill student details from the saved profile */
  var student = U.store.getStudent();
  ["name", "studentId", "email", "program", "year"].forEach(function (k) {
    if (student[k]) form.elements[k].value = student[k];
  });

  function registeredCourses() {
    return U.store.getRegistered().map(function (r) { return U.findCourse(r.code); }).filter(Boolean);
  }

  function renderOptions(preChecked) {
    optionsList.innerHTML = D.courses.map(function (c) {
      var dept = U.findDept(c.dept);
      var id = "opt-" + c.code.replace(/\s+/g, "-").toLowerCase();
      var registered = U.isRegistered(c.code);
      var full = c.seats === 0;
      var disabled = registered || full;
      var checked = !disabled && preChecked.indexOf(c.code) !== -1;
      var tag = registered ? '<span class="tag tag--ok">Already registered</span>'
        : full ? '<span class="tag tag--full">Full</span>' : "";
      return '<li class="course-option card--' + dept.color + (disabled ? " course-option--disabled" : "") + '">' +
        '<div class="check">' +
          '<input type="checkbox" name="courses" value="' + U.escapeHTML(c.code) + '" id="' + id + '"' +
            ' aria-describedby="' + id + '-meta"' + (checked ? " checked" : "") + (disabled ? " disabled" : "") + ">" +
          '<span class="course-option__main">' +
            '<label class="course-option__title" for="' + id + '">' + U.escapeHTML(c.code + " · " + c.title) + "</label>" +
            '<span class="course-option__meta" id="' + id + '-meta">' +
              c.credits + " credits · " + U.escapeHTML(U.scheduleText(c)) + " · " +
              (full ? "no seats left" : c.seats + " seats left") + " " + tag +
            "</span>" +
          "</span>" +
        "</div>" +
      "</li>";
    }).join("");
  }

  function checkedCourses() {
    return Array.prototype.filter.call(form.querySelectorAll('input[name="courses"]'), function (i) {
      return i.checked && !i.disabled;
    }).map(function (i) { return U.findCourse(i.value); });
  }

  function creditsOf(list) {
    return list.reduce(function (sum, c) { return sum + c.credits; }, 0);
  }

  /* ---------- live summary ---------- */
  function renderSummary(announceChange) {
    var chosen = checkedCourses();
    var already = creditsOf(registeredCourses());
    var credits = creditsOf(chosen);
    var total = credits + already;

    summaryList.innerHTML = chosen.length
      ? chosen.map(function (c) {
          return "<li><span>" + U.escapeHTML(c.code + " " + c.title) + "</span><span>" + c.credits + " cr</span></li>";
        }).join("")
      : "<li><span>No courses selected yet.</span></li>";

    summaryCredits.textContent = already ? credits + " (+" + already + " registered)" : String(credits);
    var pct = Math.min(100, Math.round((total / U.MAX_CREDITS) * 100));
    meter.querySelector("span").style.width = pct + "%";
    meter.classList.toggle("is-over", total > U.MAX_CREDITS);

    var msg = chosen.length + (chosen.length === 1 ? " course, " : " courses, ") + credits + " credits selected. ";
    if (total > U.MAX_CREDITS) msg += "That is " + (total - U.MAX_CREDITS) + " over the " + U.MAX_CREDITS + " credit limit.";
    else msg += (U.MAX_CREDITS - total) + " credits remaining.";
    /* Only update the live region after a user change, to avoid an announcement on page load. */
    if (announceChange) summaryStatus.textContent = msg;
    else summaryStatus.textContent = "";
  }

  /* ---------- validation ---------- */
  function setError(id, message) {
    var el = document.getElementById(id + "-error");
    var input = form.elements[id];
    if (message) {
      el.innerHTML = '<span aria-hidden="true">⚠</span><span><span class="visually-hidden">Error: </span>' + U.escapeHTML(message) + "</span>";
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
    if (input && input.nodeType === 1) {
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
  }

  function validate() {
    var errors = [];
    function check(id, message, target) {
      setError(id, message);
      if (message) errors.push({ message: message, target: target || id });
    }

    var name = form.elements.name.value.trim();
    check("name", name.length < 2 ? "Enter your full name." : "");

    var sid = form.elements.studentId.value.trim();
    check("studentId", !sid ? "Enter your student ID." : !/^\d{8}$/.test(sid) ? "Student ID must be exactly 8 digits." : "");

    var email = form.elements.email.value.trim();
    var emailMsg = "";
    if (!email) emailMsg = "Enter your university email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) emailMsg = "Enter an email address in the format name@northbridge.edu.";
    else if (!/@northbridge\.edu$/i.test(email)) emailMsg = "Use your university email address ending in @northbridge.edu.";
    check("email", emailMsg);

    check("program", form.elements.program.value ? "" : "Choose your program.");
    check("year", form.elements.year.value ? "" : "Choose your year of study.");

    var term = form.querySelector('input[name="term"]:checked');
    var firstTerm = form.querySelector('input[name="term"]');
    setError("term", term ? "" : "Choose a term.");
    if (!term) errors.push({ message: "Choose a term.", target: firstTerm.id });

    var chosen = checkedCourses();
    var courseMsg = "";
    var total = creditsOf(chosen) + creditsOf(registeredCourses());
    if (!chosen.length) {
      courseMsg = "Choose at least one course.";
    } else if (total > U.MAX_CREDITS) {
      courseMsg = "Your total of " + total + " credits is over the " + U.MAX_CREDITS + " credit limit. Remove a course.";
    } else {
      var conflicts = U.findConflicts(chosen.concat(registeredCourses()));
      if (conflicts.length) {
        courseMsg = "Time conflict: " + conflicts.map(function (p) {
          return p[0].code + " and " + p[1].code;
        }).join("; ") + " meet at the same time. Remove one of them.";
      }
    }
    setError("courses", courseMsg);
    if (courseMsg) {
      var firstCourse = form.querySelector('input[name="courses"]:checked:not(:disabled)') ||
        form.querySelector('input[name="courses"]:not(:disabled)');
      errors.push({ message: courseMsg, target: firstCourse ? firstCourse.id : "course-group" });
    }

    check("agree", form.elements.agree.checked ? "" : "Confirm that you understand the drop policy.");

    return errors;
  }

  function showErrorSummary(errors) {
    var title = document.getElementById("error-summary-title");
    title.textContent = errors.length === 1
      ? "There is 1 problem with your registration"
      : "There are " + errors.length + " problems with your registration";
    errorList.innerHTML = errors.map(function (e) {
      return '<li><a href="#' + e.target + '" data-target="' + e.target + '">' + U.escapeHTML(e.message) + "</a></li>";
    }).join("");
    errorSummary.hidden = false;
    errorSummary.focus();
  }

  errorList.addEventListener("click", function (e) {
    var link = e.target.closest("a[data-target]");
    if (!link) return;
    e.preventDefault();
    var target = document.getElementById(link.getAttribute("data-target"));
    if (target) {
      target.scrollIntoView({ block: "center" });
      target.focus();
    }
  });

  /* clear a field's error as soon as it is corrected */
  form.addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "courses") {
      renderSummary(true);
      if (!document.getElementById("courses-error").hidden) setError("courses", "");
    } else if (t.name === "term") {
      setError("term", "");
    } else if (t.name && document.getElementById(t.name + "-error") && t.getAttribute("aria-invalid") === "true") {
      validate();
    }
  });
  form.addEventListener("input", function (e) {
    var t = e.target;
    if (t.getAttribute && t.getAttribute("aria-invalid") === "true") validate();
  });
  /* ---------- submit & confirm ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    success.hidden = true;
    var errors = validate();
    if (errors.length) {
      showErrorSummary(errors);
      return;
    }
    errorSummary.hidden = true;

    var chosen = checkedCourses();
    var termId = form.querySelector('input[name="term"]:checked').value;
    var credits = creditsOf(chosen);

    var bodyHTML =
      "<p><strong>Term:</strong> " + U.escapeHTML(U.termName(termId)) + "<br>" +
      "<strong>Student:</strong> " + U.escapeHTML(form.elements.name.value.trim()) +
      " (" + U.escapeHTML(form.elements.studentId.value.trim()) + ")</p>" +
      "<ul>" + chosen.map(function (c) {
        return "<li><strong>" + U.escapeHTML(c.code) + "</strong> " + U.escapeHTML(c.title) +
          " — " + c.credits + " credits, " + U.escapeHTML(U.scheduleText(c)) + "</li>";
      }).join("") + "</ul>" +
      "<p><strong>Total: " + credits + " credits</strong></p>";

    U.confirmDialog({
      title: "Confirm your registration",
      description: "Please check the courses below. You are registering for " + chosen.length +
        (chosen.length === 1 ? " course." : " courses."),
      bodyHTML: bodyHTML,
      confirmText: "Confirm registration",
      cancelText: "Go back and edit"
    }).then(function (ok) {
      if (!ok) return;
      var now = new Date().toISOString();
      var registered = U.store.getRegistered();
      chosen.forEach(function (c) { registered.push({ code: c.code, term: termId, date: now }); });
      U.store.setRegistered(registered);
      U.store.setStudent({
        name: form.elements.name.value.trim(),
        studentId: form.elements.studentId.value.trim(),
        email: form.elements.email.value.trim(),
        program: form.elements.program.value,
        year: form.elements.year.value
      });
      var codes = chosen.map(function (c) { return c.code; });
      U.store.setSelected(U.store.getSelected().filter(function (code) { return codes.indexOf(code) === -1; }));

      form.elements.agree.checked = false;
      renderOptions([]);
      renderSummary(false);

      document.getElementById("success-text").textContent =
        "You are registered for " + codes.join(", ") + " in " + U.termName(termId) + " (" + credits + " credits).";
      success.hidden = false;
      success.focus();
      success.scrollIntoView({ block: "start" });
    });
  });

  /* ---------- initial state ---------- */
  var pre = U.store.getSelected().slice();
  var param = new URLSearchParams(window.location.search).get("course");
  if (param && pre.indexOf(param) === -1) pre.push(param);
  renderOptions(pre);
  renderSummary(false);

  /* keep the catalog selection in sync with checkbox changes */
  optionsList.addEventListener("change", function () {
    var codes = checkedCourses().map(function (c) { return c.code; });
    U.store.setSelected(codes);
  });
});
