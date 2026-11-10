/* Registration form, validation and confirmation dialog. */
(function () {
  "use strict";

  var NB = window.NB;

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("register-form");
    var summary = document.getElementById("error-summary");
    var nameInput = document.getElementById("reg-name");
    var emailInput = document.getElementById("reg-email");
    var idInput = document.getElementById("reg-id");
    var ackInput = document.getElementById("reg-ack");
    var choices = document.getElementById("course-choices");
    var addSelect = document.getElementById("add-course-select");
    var addBtn = document.getElementById("add-course-btn");
    var reviewBtn = document.getElementById("review-btn");
    var currentSummary = document.getElementById("current-summary");
    var successPanel = document.getElementById("success-panel");
    var successTitle = document.getElementById("success-title");
    var successBody = document.getElementById("success-body");
    var dialog = document.getElementById("confirm-dialog");
    var confirmList = document.getElementById("confirm-list");
    var confirmTotals = document.getElementById("confirm-totals");
    var cancelBtn = document.getElementById("confirm-cancel");
    var okBtn = document.getElementById("confirm-ok");

    var errorEls = {
      name: document.getElementById("reg-name-error"),
      email: document.getElementById("reg-email-error"),
      id: document.getElementById("reg-id-error"),
      courses: document.getElementById("courses-error"),
      grading: document.getElementById("grading-error"),
      ack: document.getElementById("reg-ack-error")
    };

    NB.bindErrorSummary(summary);

    /* Fill in what the student already entered on their profile. */
    var profile = NB.getProfile();
    nameInput.value = profile.name;
    emailInput.value = profile.email;
    idInput.value = profile.studentId;

    /* Courses offered in the form: everything in the plan that is not already registered. */
    var checked = {};
    NB.getPlan().forEach(function (id) { checked[id] = true; });

    function formCourses() {
      return NB.getPlan()
        .map(NB.findCourse)
        .filter(function (c) { return c && !NB.isRegistered(c.id); });
    }

    function registeredCourses() {
      return NB.getRegistered().map(function (r) { return NB.findCourse(r.id); }).filter(Boolean);
    }

    function sumCredits(courses) {
      return courses.reduce(function (total, c) { return total + c.credits; }, 0);
    }

    function renderChoices() {
      var courses = formCourses();
      if (!courses.length) {
        choices.innerHTML = '<p class="empty-state">Your plan is empty. Add a course with the list below, or <a href="catalog.html">browse the course catalog</a>.</p>';
        return;
      }
      choices.innerHTML = courses.map(function (c) {
        var id = "course-" + c.id;
        var full = NB.seatsLeft(c) === 0;
        return '<div class="choice">' +
          '<input type="checkbox" id="' + id + '" name="courses" value="' + c.id + '"' + (checked[c.id] !== false ? " checked" : "") + ">" +
          '<label for="' + id + '"><strong>' + NB.escape(c.code) + "</strong> " + NB.escape(c.title) +
          '<span class="choice-detail">' + NB.creditsText(c.credits) + " · " + NB.escape(NB.scheduleText(c)) + " · " + NB.escape(c.instructor) +
          (full ? " · Full, no seats left" : "") + "</span></label></div>";
      }).join("");
    }

    function renderAddSelect() {
      var plan = NB.getPlan();
      var options = NB.courses.filter(function (c) {
        return plan.indexOf(c.id) === -1 && !NB.isRegistered(c.id) && NB.seatsLeft(c) > 0;
      });
      addSelect.innerHTML = '<option value="">Choose a course</option>' + options.map(function (c) {
        return '<option value="' + c.id + '">' + NB.escape(c.code + " – " + c.title + " (" + NB.creditsText(c.credits) + ")") + "</option>";
      }).join("");
    }

    function renderCurrent() {
      var courses = registeredCourses();
      if (!courses.length) {
        currentSummary.innerHTML = "<p>You are not registered for any courses yet.</p>";
        return;
      }
      currentSummary.innerHTML = "<p>You are registered for " + NB.coursesText(courses.length) + ", " + NB.creditsText(sumCredits(courses)) +
        " of " + NB.CREDIT_LIMIT + ' allowed.</p><ul class="summary-list">' +
        courses.map(function (c) { return "<li>" + NB.escape(c.code + " " + c.title) + "</li>"; }).join("") + "</ul>";
    }

    function renderAll() {
      renderChoices();
      renderAddSelect();
      renderCurrent();
    }

    choices.addEventListener("change", function (event) {
      if (event.target.name === "courses") checked[event.target.value] = event.target.checked;
    });

    addBtn.addEventListener("click", function () {
      var course = NB.findCourse(addSelect.value);
      if (!course) {
        NB.announce("Choose a course in the list first, then select Add course.");
        addSelect.focus();
        return;
      }
      var plan = NB.getPlan();
      plan.push(course.id);
      NB.setPlan(plan);
      checked[course.id] = true;
      renderChoices();
      renderAddSelect();
      NB.announce(course.code + " added to your plan and selected for registration.");
    });

    function selectedCourses() {
      var boxes = choices.querySelectorAll("input[name='courses']:checked");
      return Array.prototype.map.call(boxes, function (b) { return NB.findCourse(b.value); }).filter(Boolean);
    }

    function validate() {
      var errors = [];
      function check(key, field, targetId, message) {
        NB.setFieldError(field, errorEls[key], message);
        if (message) errors.push({ targetId: targetId, message: message });
      }

      var name = nameInput.value.trim();
      check("name", nameInput, "reg-name", name ? "" : "Enter your full name.");

      var email = emailInput.value.trim();
      check("email", emailInput, "reg-email",
        !email ? "Enter your email address." :
          !NB.isValidEmail(email) ? "Enter an email address in the format name@example.com." : "");

      var sid = idInput.value.trim();
      check("id", idInput, "reg-id", /^\d{8}$/.test(sid) ? "" : "Enter a student ID with 8 digits, for example 20231234.");

      var selected = selectedCourses();
      var boxes = choices.querySelectorAll("input[name='courses']");
      var courseTarget = boxes.length ? boxes[0].id : "add-course-select";
      var courseMessage = "";
      if (!selected.length) {
        courseMessage = boxes.length
          ? "Select at least one course to register."
          : "Add at least one course with the “Add another course” list.";
      } else {
        var full = selected.filter(function (c) { return NB.seatsLeft(c) === 0; });
        var current = registeredCourses();
        var all = current.concat(selected);
        var total = sumCredits(all);
        var clash = null;
        for (var i = 0; i < all.length && !clash; i++) {
          for (var j = i + 1; j < all.length && !clash; j++) {
            if ((selected.indexOf(all[i]) !== -1 || selected.indexOf(all[j]) !== -1) && NB.overlaps(all[i], all[j])) {
              clash = [all[i], all[j]];
            }
          }
        }
        if (full.length) {
          courseMessage = full[0].code + " is full. Uncheck it to continue.";
        } else if (clash) {
          courseMessage = clash[0].code + " and " + clash[1].code + " meet at the same time. Uncheck one of them.";
        } else if (total > NB.CREDIT_LIMIT) {
          courseMessage = "Your total would be " + total + " credits, but the limit is " + NB.CREDIT_LIMIT +
            ". Uncheck courses until the total is " + NB.CREDIT_LIMIT + " or fewer.";
        }
        if (clash || full.length) {
          var bad = full.length ? full[0] : (selected.indexOf(clash[1]) !== -1 ? clash[1] : clash[0]);
          courseTarget = "course-" + bad.id;
        }
      }
      check("courses", boxes.length ? boxes : addSelect, courseTarget, courseMessage);

      var gradingInputs = form.querySelectorAll("input[name='grading']");
      var grading = form.querySelector("input[name='grading']:checked");
      check("grading", gradingInputs, "grading-letter", grading ? "" : "Choose a grading option.");

      check("ack", ackInput, "reg-ack", ackInput.checked ? "" : "Check the box to confirm you have checked the prerequisites.");

      return errors;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var errors = validate();
      NB.showErrorSummary(summary, errors, "registration");
      if (errors.length) return;

      var selected = selectedCourses();
      var grading = form.querySelector("input[name='grading']:checked").value;
      confirmList.innerHTML = selected.map(function (c) {
        return "<li><strong>" + NB.escape(c.code) + "</strong> " + NB.escape(c.title) + " – " + NB.creditsText(c.credits) + ", " + NB.escape(NB.scheduleText(c)) + "</li>";
      }).join("");
      confirmTotals.textContent = "Total: " + NB.coursesText(selected.length) + ", " + NB.creditsText(sumCredits(selected)) + ". Grading: " + grading + ".";
      dialog.returnValue = "";
      dialog.showModal();
      cancelBtn.focus();
    });

    cancelBtn.addEventListener("click", function () {
      dialog.close("cancel");
    });

    okBtn.addEventListener("click", function () {
      var selected = selectedCourses();
      var grading = form.querySelector("input[name='grading']:checked").value;

      var registered = NB.getRegistered();
      selected.forEach(function (c) { registered.push({ id: c.id, grading: grading }); });
      NB.setRegistered(registered);

      var ids = selected.map(function (c) { return c.id; });
      NB.setPlan(NB.getPlan().filter(function (id) { return ids.indexOf(id) === -1; }));

      var updated = NB.getProfile();
      updated.name = nameInput.value.trim();
      updated.email = emailInput.value.trim();
      updated.studentId = idInput.value.trim();
      NB.setProfile(updated);

      successBody.innerHTML = "<p>You are now registered for " + NB.coursesText(selected.length) + " (" + NB.creditsText(sumCredits(selected)) +
        ") in Spring 2027. A confirmation was sent to " + NB.escape(updated.email) + '.</p><ul class="summary-list">' +
        selected.map(function (c) { return "<li>" + NB.escape(c.code + " " + c.title) + "</li>"; }).join("") + "</ul>";
      successPanel.hidden = false;
      ackInput.checked = false;
      dialog.close("confirm");
    });

    dialog.addEventListener("close", function () {
      if (dialog.returnValue === "confirm") {
        renderAll();
        document.title = "Registration complete – Northbridge University Course Registration";
        successTitle.focus();
      } else {
        reviewBtn.focus();
      }
    });

    renderAll();
  });
})();
