/* Registration page: course selection, validation, confirmation dialog. */
"use strict";

(function () {
  const form = document.getElementById("register-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const idInput = document.getElementById("student-id");
  const prereq = document.getElementById("prereq");
  const coursesGroup = document.getElementById("courses-group");
  const optionsList = document.getElementById("course-options");
  const meter = document.getElementById("credit-meter");
  const summary = document.getElementById("error-summary");
  const errorList = document.getElementById("error-list");
  const success = document.getElementById("success");
  const dialog = document.getElementById("confirm-dialog");
  const reviewButton = document.getElementById("review-button");
  const baseTitle = document.title;

  /* Fill in what the student already gave us (WCAG 3.3.7). */
  const profile = Store.getProfile();
  nameInput.value = profile.name;
  emailInput.value = profile.email;
  idInput.value = profile.studentId;

  const preselect = new URLSearchParams(window.location.search).get("course");

  function registeredCourses() {
    return Store.getRegistrations().map(function (r) { return findCourse(r.id); });
  }

  function registeredCredits() {
    return registeredCourses().reduce(function (sum, c) { return sum + c.credits; }, 0);
  }

  function renderOptions(checkedIds) {
    const registeredIds = Store.getRegistrations().map(function (r) { return r.id; });
    optionsList.innerHTML = COURSES.map(function (course) {
      const isRegistered = registeredIds.indexOf(course.id) !== -1;
      const isFull = availability(course) === "full";
      const unavailable = isRegistered || isFull;
      const checked = !unavailable && checkedIds.indexOf(course.id) !== -1;
      const inputId = "course-" + course.id.replace(/\s+/g, "-").toLowerCase();
      let note = "";
      if (isRegistered) note = " — <strong>Already registered</strong>";
      else if (isFull) note = " — <strong>Full</strong>";
      return '<li class="course-option' + (unavailable ? " is-unavailable" : "") + '" style="--dept-color:' + DEPARTMENTS[course.dept].color + '">' +
        '<input type="checkbox" name="courses" id="' + inputId + '" value="' + escapeHtml(course.id) + '"' +
          (checked ? " checked" : "") + (unavailable ? " disabled" : "") + (isRegistered ? " checked" : "") + '>' +
        '<label for="' + inputId + '"><strong>' + escapeHtml(course.id) + ': ' + escapeHtml(course.title) + '</strong>' + note +
          '<span class="option-meta">' + course.credits + ' credits · ' + escapeHtml(formatSchedule(course)) +
          ' · ' + seatsLeft(course) + ' seats left</span></label>' +
      '</li>';
    }).join("");
    updateMeter();
  }

  function selectedCourses() {
    return Array.prototype.slice.call(optionsList.querySelectorAll('input[name="courses"]:checked:not(:disabled)'))
      .map(function (input) { return findCourse(input.value); });
  }

  function updateMeter() {
    const selected = selectedCourses();
    const credits = selected.reduce(function (sum, c) { return sum + c.credits; }, 0);
    const already = registeredCredits();
    meter.textContent = "Selected: " + selected.length + (selected.length === 1 ? " course, " : " courses, ") +
      credits + " credits. With your current " + already + " credits, total " + (credits + already) +
      " of " + MAX_CREDITS + " credits.";
  }

  optionsList.addEventListener("change", updateMeter);

  /* ---------- Validation ---------- */

  function setError(field, errorId, message) {
    const error = document.getElementById(errorId);
    error.textContent = message;
    error.hidden = false;
    field.setAttribute("aria-invalid", "true");
  }

  function clearErrors() {
    form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
    form.querySelectorAll(".error-message").forEach(function (el) { el.hidden = true; el.textContent = ""; });
    errorList.innerHTML = "";
    summary.hidden = true;
  }

  function validate() {
    const errors = [];
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const studentId = idInput.value.trim();

    if (!name) {
      errors.push({ field: nameInput, errorId: "name-error", message: "Enter your full name." });
    }
    if (!email) {
      errors.push({ field: emailInput, errorId: "email-error", message: "Enter your university email address, for example name@example.edu." });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: emailInput, errorId: "email-error", message: "Enter an email address in the format name@example.edu." });
    }
    if (!/^\d{8}$/.test(studentId)) {
      errors.push({ field: idInput, errorId: "student-id-error", message: "Enter a student ID with 8 digits, for example 20241234." });
    }

    const selected = selectedCourses();
    const firstCourse = optionsList.querySelector('input[name="courses"]:not(:disabled)');
    if (selected.length === 0) {
      errors.push({ field: coursesGroup, focusTarget: firstCourse, errorId: "courses-error", message: "Choose at least one course." });
    } else {
      const total = selected.reduce(function (s, c) { return s + c.credits; }, 0) + registeredCredits();
      const all = registeredCourses().concat(selected);
      let conflict = null;
      for (let i = 0; i < selected.length && !conflict; i++) {
        for (let j = 0; j < all.length; j++) {
          if (all[j] !== selected[i] && coursesOverlap(selected[i], all[j])) {
            conflict = [selected[i], all[j]];
            break;
          }
        }
      }
      const firstSelected = optionsList.querySelector('input[name="courses"]:checked:not(:disabled)');
      if (total > MAX_CREDITS) {
        errors.push({ field: coursesGroup, focusTarget: firstSelected, errorId: "courses-error",
          message: "Your total would be " + total + " credits. Remove courses until the total is " + MAX_CREDITS + " credits or fewer." });
      } else if (conflict) {
        errors.push({ field: coursesGroup, focusTarget: firstSelected, errorId: "courses-error",
          message: conflict[0].id + " and " + conflict[1].id + " meet at the same time. Remove " +
            (registeredCourses().indexOf(conflict[1]) !== -1 ? conflict[0].id : "one of them") + "." });
      }
    }

    if (!prereq.checked) {
      errors.push({ field: prereq, errorId: "prereq-error", message: "Check the box to confirm that you have met the prerequisites." });
    }
    return errors;
  }

  function showErrors(errors) {
    errors.forEach(function (e) {
      setError(e.field, e.errorId, e.message);
      const target = e.focusTarget || e.field;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + target.id;
      a.textContent = e.message;
      a.addEventListener("click", function (event) {
        event.preventDefault();
        target.focus();
      });
      li.appendChild(a);
      errorList.appendChild(li);
    });
    document.getElementById("error-summary-title").textContent =
      errors.length === 1 ? "There is 1 problem with your registration" : "There are " + errors.length + " problems with your registration";
    summary.hidden = false;
    document.title = "Error: " + baseTitle;
    summary.focus();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();
    success.hidden = true;
    const errors = validate();
    if (errors.length) {
      showErrors(errors);
      return;
    }
    document.title = baseTitle;
    openDialog();
  });

  /* ---------- Confirmation dialog ---------- */

  function openDialog() {
    const selected = selectedCourses();
    const grading = form.querySelector('input[name="grading"]:checked').value;
    document.getElementById("confirm-list").innerHTML = selected.map(function (c) {
      return "<li><strong>" + escapeHtml(c.id) + ": " + escapeHtml(c.title) + "</strong>, " + c.credits + " credits, " +
        escapeHtml(formatSchedule(c)) + "</li>";
    }).join("");
    const credits = selected.reduce(function (s, c) { return s + c.credits; }, 0);
    document.getElementById("confirm-total").textContent =
      "Total: " + credits + " credits. Grading option: " + grading + ".";
    dialog.showModal();
    document.getElementById("confirm-cancel").focus();
  }

  document.getElementById("confirm-cancel").addEventListener("click", function () {
    dialog.close("cancel");
  });

  document.getElementById("confirm-ok").addEventListener("click", function () {
    dialog.close("confirm");
  });

  dialog.addEventListener("close", function () {
    if (dialog.returnValue !== "confirm") {
      reviewButton.focus();
      return;
    }
    dialog.returnValue = "";
    saveRegistration();
  });

  function saveRegistration() {
    const selected = selectedCourses();
    const grading = form.querySelector('input[name="grading"]:checked').value;
    const list = Store.getRegistrations().concat(selected.map(function (c) {
      return { id: c.id, term: "Spring 2027", grading: grading };
    }));
    Store.saveRegistrations(list);
    Store.saveProfile(Object.assign(Store.getProfile(), {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      studentId: idInput.value.trim()
    }));

    const ids = selected.map(function (c) { return c.id; });
    document.getElementById("success-text").textContent =
      "You are registered for " + ids.join(", ") + ". You now have " + registeredCredits() + " credits for Spring 2027.";
    prereq.checked = false;
    renderOptions([]);
    success.hidden = false;
    success.focus();
  }

  renderOptions(preselect ? [preselect] : []);
})();
