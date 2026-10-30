(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const app = window.AURORA_APP;
    const form = document.getElementById("registration-form");
    if (!app || !form) {
      return;
    }

    const nameInput = document.getElementById("reg-name");
    const studentIdInput = document.getElementById("reg-student-id");
    const emailInput = document.getElementById("reg-email");
    const courseSelect = document.getElementById("course-select");
    const accommodationsInput = document.getElementById("reg-accommodations");
    const agreementInput = document.getElementById("reg-agreement");
    const preview = document.getElementById("course-preview");
    const errorSummary = document.getElementById("form-error-summary");
    const errorList = document.getElementById("form-error-list");
    const scheduleBody = document.getElementById("schedule-body");
    const scheduleTableWrap = document.getElementById("schedule-table-wrap");
    const scheduleEmpty = document.getElementById("schedule-empty");
    const statusBanner = document.getElementById("registration-status");
    const dialog = document.getElementById("confirm-dialog");
    const dialogTitle = document.getElementById("confirm-title");
    const dialogDescription = document.getElementById("confirm-description");
    const dialogDetails = document.getElementById("confirm-details");
    const dialogIcon = document.getElementById("confirm-icon");
    const confirmAction = document.getElementById("confirm-action");
    const profile = app.getProfile();

    let pendingMode = null;
    let pendingCourseId = null;
    let pendingRegistration = null;

    nameInput.value = profile.fullName;
    studentIdInput.value = profile.studentId;
    emailInput.value = profile.email;

    const fieldConfig = [
      {
        control: nameInput,
        error: document.getElementById("reg-name-error"),
        label: "Full name",
        validate: function () {
          return nameInput.value.trim().length >= 2 ? "" : "Enter your full name.";
        }
      },
      {
        control: studentIdInput,
        error: document.getElementById("reg-student-id-error"),
        label: "Student ID",
        validate: function () {
          return /^[A-Za-z0-9-]{4,16}$/.test(studentIdInput.value.trim())
            ? ""
            : "Enter a valid student ID, for example AUR-20481.";
        }
      },
      {
        control: emailInput,
        error: document.getElementById("reg-email-error"),
        label: "University email",
        validate: function () {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())
            ? ""
            : "Enter a valid email address, for example maya.thompson@aurora.edu.";
        }
      },
      {
        control: courseSelect,
        error: document.getElementById("course-select-error"),
        label: "Course",
        validate: function () {
          return courseSelect.value ? "" : "Choose a course to register for.";
        }
      },
      {
        control: agreementInput,
        error: document.getElementById("reg-agreement-error"),
        label: "Agreement",
        validate: function () {
          return agreementInput.checked ? "" : "Confirm that you understand the registration terms.";
        }
      }
    ];

    function placeholderPreview() {
      preview.innerHTML =
        '<span class="course-preview__icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v16H7.5A2.5 2.5 0 0 0 5 20.5v-16Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M5 20.5V4.5M20 18H7.5A2.5 2.5 0 0 0 5 20.5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>' +
        "</span>" +
        "<p>Select a course to preview its schedule, instructor, and credits.</p>";
    }

    function updatePreview() {
      const course = app.getCourseById(courseSelect.value);
      if (!course) {
        placeholderPreview();
        return;
      }

      preview.innerHTML =
        '<span class="course-preview__icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v16H7.5A2.5 2.5 0 0 0 5 20.5v-16Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M5 20.5V4.5M20 18H7.5A2.5 2.5 0 0 0 5 20.5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>' +
        "</span>" +
        "<div>" +
        '<span class="preview-course-title"><strong>' +
        app.escapeHtml(course.code) +
        "</strong> · " +
        app.escapeHtml(course.title) +
        "</span>" +
        '<ul class="preview-meta">' +
        "<li>" +
        app.escapeHtml(course.credits) +
        " credits</li>" +
        "<li>" +
        app.escapeHtml(course.schedule) +
        "</li>" +
        "<li>" +
        app.escapeHtml(course.format) +
        "</li>" +
        "<li>" +
        app.escapeHtml(course.instructor) +
        "</li>" +
        "</ul>" +
        "</div>";
    }

    function populateCourses(selectedId) {
      const registered = app.getRegistrations();
      const available = window.AURORA.COURSES.filter(function (course) {
        return registered.indexOf(course.id) === -1;
      });

      courseSelect.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = available.length
        ? "Select an available course"
        : "All courses are already in your schedule";
      courseSelect.appendChild(placeholder);

      available.forEach(function (course) {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.code + " · " + course.title + " (" + course.credits + " credits)";
        courseSelect.appendChild(option);
      });

      if (selectedId && available.some(function (course) { return course.id === selectedId; })) {
        courseSelect.value = selectedId;
      }
      updatePreview();
    }

    function renderSchedule() {
      const courses = app
        .getRegistrations()
        .map(function (id) {
          return app.getCourseById(id);
        })
        .filter(Boolean);

      document.querySelectorAll("[data-schedule-count]").forEach(function (element) {
        element.textContent = String(courses.length);
      });
      document.querySelectorAll("[data-schedule-label]").forEach(function (element) {
        element.textContent = courses.length === 1 ? "course" : "courses";
      });

      scheduleBody.innerHTML = "";
      scheduleEmpty.innerHTML = "";
      scheduleTableWrap.hidden = courses.length === 0;

      if (courses.length === 0) {
        app.renderEmptySchedule(scheduleEmpty);
      }

      courses.forEach(function (course) {
        const row = document.createElement("tr");
        const codeCell = document.createElement("th");
        const scheduleCell = document.createElement("td");
        const creditsCell = document.createElement("td");
        const actionCell = document.createElement("td");
        const code = document.createElement("span");
        const title = document.createElement("span");
        const schedule = document.createElement("span");
        const dropButton = document.createElement("button");

        codeCell.scope = "row";
        code.className = "table-course-code";
        code.textContent = course.code;
        title.className = "table-course-title";
        title.textContent = course.title;
        codeCell.appendChild(code);
        codeCell.appendChild(title);
        schedule.className = "table-schedule";
        schedule.textContent = course.schedule + " · " + course.format;
        scheduleCell.appendChild(schedule);
        creditsCell.textContent = String(course.credits);
        dropButton.type = "button";
        dropButton.className = "btn-drop";
        dropButton.setAttribute("data-drop-course", course.id);
        dropButton.setAttribute("aria-haspopup", "dialog");
        dropButton.innerHTML =
          'Drop<span class="sr-only"> ' + app.escapeHtml(course.code) + " " + app.escapeHtml(course.title) + "</span>";
        actionCell.appendChild(dropButton);

        row.appendChild(codeCell);
        row.appendChild(scheduleCell);
        row.appendChild(creditsCell);
        row.appendChild(actionCell);
        scheduleBody.appendChild(row);
      });

      app.updateRegistrationCount();
    }

    function clearFieldError(config) {
      config.control.removeAttribute("aria-invalid");
      config.error.textContent = "";
    }

    function clearErrors() {
      fieldConfig.forEach(clearFieldError);
      errorSummary.hidden = true;
      errorList.innerHTML = "";
    }

    function showErrors(errors) {
      errorList.innerHTML = "";
      errors.forEach(function (error) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#" + error.control.id;
        link.textContent = error.label + ": " + error.message;
        item.appendChild(link);
        errorList.appendChild(item);
      });
      errorSummary.hidden = false;
      errorSummary.focus();
    }

    function validateForm() {
      clearErrors();
      const errors = [];

      fieldConfig.forEach(function (config) {
        const message = config.validate();
        if (message) {
          config.control.setAttribute("aria-invalid", "true");
          config.error.textContent = message;
          errors.push({ control: config.control, label: config.label, message: message });
        }
      });

      if (errors.length) {
        showErrors(errors);
        return null;
      }

      const course = app.getCourseById(courseSelect.value);
      if (!course) {
        return null;
      }

      return {
        fullName: nameInput.value.trim(),
        studentId: studentIdInput.value.trim(),
        email: emailInput.value.trim(),
        course: course,
        accommodations: accommodationsInput.value.trim()
      };
    }

    function addDetail(term, description) {
      const wrapper = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = term;
      dd.textContent = description;
      wrapper.appendChild(dt);
      wrapper.appendChild(dd);
      return wrapper;
    }

    function openRegisterDialog(data) {
      pendingMode = "register";
      pendingRegistration = data;
      pendingCourseId = data.course.id;

      dialog.classList.remove("modal--danger");
      dialogIcon.innerHTML =
        '<svg viewBox="0 0 32 32" focusable="false"><path d="M6 17.5 12.5 24 26 8.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      dialogTitle.textContent = "Confirm your registration";
      dialogDescription.textContent = "Please review the details below before making it official.";

      const list = document.createElement("dl");
      list.appendChild(addDetail("Student", data.fullName));
      list.appendChild(addDetail("Student ID", data.studentId));
      list.appendChild(addDetail("Course", data.course.code + " · " + data.course.title));
      list.appendChild(addDetail("Schedule", data.course.schedule + " · " + data.course.format));
      list.appendChild(addDetail("Credits", data.course.credits + " credits"));
      dialogDetails.innerHTML = "";
      dialogDetails.appendChild(list);

      const warning = document.createElement("p");
      warning.className = "modal-warning";
      warning.textContent = "Once confirmed, this course will be added to your Spring 2027 schedule.";
      dialogDetails.appendChild(warning);

      confirmAction.textContent = "Confirm registration";
      confirmAction.className = "btn";
      if (!dialog.open) {
        dialog.showModal();
      }
      confirmAction.focus();
    }

    function openDropDialog(course) {
      pendingMode = "drop";
      pendingCourseId = course.id;
      pendingRegistration = null;

      dialog.classList.add("modal--danger");
      dialogIcon.innerHTML =
        '<svg viewBox="0 0 24 24" focusable="false"><path d="M8 8v10M12 8v10M16 8v10M5 5h14M9 5V3h6v2M6 5l1 16h10l1-16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      dialogTitle.textContent = "Drop this course?";
      dialogDescription.textContent = "This course will be removed from your Spring 2027 schedule.";

      const list = document.createElement("dl");
      list.appendChild(addDetail("Course", course.code + " · " + course.title));
      list.appendChild(addDetail("Schedule", course.schedule));
      list.appendChild(addDetail("Credits", course.credits + " credits"));
      dialogDetails.innerHTML = "";
      dialogDetails.appendChild(list);

      const warning = document.createElement("p");
      warning.className = "modal-warning";
      warning.textContent = "You can register for this course again later if seats remain available.";
      dialogDetails.appendChild(warning);

      confirmAction.textContent = "Drop course";
      confirmAction.className = "btn btn-danger";
      if (!dialog.open) {
        dialog.showModal();
      }
      confirmAction.focus();
    }

    function announce(message) {
      statusBanner.textContent = message;
      statusBanner.hidden = false;
    }

    function closeDialog() {
      if (dialog.open) {
        dialog.close();
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = validateForm();
      if (data) {
        openRegisterDialog(data);
      }
    });

    courseSelect.addEventListener("change", function () {
      updatePreview();
      const courseConfig = fieldConfig.find(function (config) {
        return config.control === courseSelect;
      });
      clearFieldError(courseConfig);
      errorSummary.hidden = true;
    });

    [nameInput, studentIdInput, emailInput, agreementInput].forEach(function (control) {
      control.addEventListener("input", function () {
        const config = fieldConfig.find(function (item) {
          return item.control === control;
        });
        if (config) {
          clearFieldError(config);
        }
        errorSummary.hidden = true;
      });
      control.addEventListener("change", function () {
        if (control === agreementInput) {
          const config = fieldConfig.find(function (item) {
            return item.control === agreementInput;
          });
          clearFieldError(config);
        }
      });
    });

    scheduleBody.addEventListener("click", function (event) {
      const dropButton = event.target.closest("[data-drop-course]");
      if (!dropButton) {
        return;
      }
      const course = app.getCourseById(dropButton.getAttribute("data-drop-course"));
      if (course) {
        openDropDialog(course);
      }
    });

    dialog.querySelectorAll("[data-close-dialog]").forEach(function (button) {
      button.addEventListener("click", closeDialog);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        closeDialog();
      }
    });

    dialog.addEventListener("close", function () {
      pendingMode = null;
      pendingCourseId = null;
      pendingRegistration = null;
    });

    confirmAction.addEventListener("click", function () {
      if (!pendingMode || !pendingCourseId) {
        closeDialog();
        return;
      }

      const mode = pendingMode;
      const course = app.getCourseById(pendingCourseId);
      const registration = pendingRegistration;
      closeDialog();

      if (mode === "register" && course && registration) {
        app.addRegistration(course.id);
        renderSchedule();
        populateCourses();
        courseSelect.value = "";
        updatePreview();
        agreementInput.checked = false;
        accommodationsInput.value = "";
        announce(
          "You are now registered for " +
            course.code +
            " " +
            course.title +
            ". It has been added to your Spring 2027 schedule."
        );
      } else if (mode === "drop" && course) {
        app.removeRegistration(course.id);
        renderSchedule();
        populateCourses();
        announce(course.code + " " + course.title + " has been dropped from your schedule.");
        document.getElementById("schedule-heading").focus();
      }
    });

    const requestedCourse = new URLSearchParams(window.location.search).get("course");
    populateCourses(requestedCourse);
    renderSchedule();
  });
})();
