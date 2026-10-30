(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const app = window.AURORA_APP;
    const form = document.getElementById("profile-form");
    if (!app || !form) {
      return;
    }

    const nameInput = document.getElementById("profile-full-name");
    const emailInput = document.getElementById("profile-email-input");
    const programInput = document.getElementById("profile-program-input");
    const yearInput = document.getElementById("profile-year-input");
    const errorSummary = document.getElementById("profile-error-summary");
    const errorList = document.getElementById("profile-error-list");
    const status = document.getElementById("profile-status");
    const scheduleBody = document.getElementById("profile-schedule-body");
    const scheduleTableWrap = document.getElementById("profile-table-wrap");
    const scheduleEmpty = document.getElementById("profile-schedule-empty");
    const printButton = document.getElementById("print-schedule");

    const nameError = document.getElementById("profile-full-name-error");
    const emailError = document.getElementById("profile-email-input-error");

    const fields = [
      {
        control: nameInput,
        error: nameError,
        label: "Full name",
        validate: function () {
          return nameInput.value.trim().length >= 2 ? "" : "Enter your full name.";
        }
      },
      {
        control: emailInput,
        error: emailError,
        label: "University email",
        validate: function () {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())
            ? ""
            : "Enter a valid email address.";
        }
      }
    ];

    function fillProfile(profile) {
      nameInput.value = profile.fullName;
      emailInput.value = profile.email;
      programInput.value = profile.program;
      yearInput.value = profile.year;

      document.getElementById("profile-avatar").textContent = app.getInitials(profile.fullName) || "ST";
      document.getElementById("profile-name").textContent = profile.fullName;
      document.getElementById("profile-program").textContent = profile.program;
      document.getElementById("profile-year").textContent = profile.year;
      document.getElementById("profile-student-id").textContent = profile.studentId;
      document.getElementById("profile-email").textContent = profile.email;
      document.getElementById("stat-gpa").textContent = profile.gpa;
      document.getElementById("stat-completed").textContent = String(profile.creditsCompleted);
      document.getElementById("stat-graduation").textContent = profile.expectedGraduation;
      document.getElementById("stat-advisor").textContent = profile.advisor;
      document.getElementById("stat-program").textContent = profile.program;

      const totalCredits = 120;
      const percent = Math.min(100, Math.round((Number(profile.creditsCompleted) / totalCredits) * 1000) / 10);
      document.getElementById("degree-progress").setAttribute("aria-valuenow", String(profile.creditsCompleted));
      document.getElementById("degree-progress-text").textContent =
        profile.creditsCompleted + " of " + totalCredits + " credits";
      document.getElementById("degree-progress-heading").textContent =
        "Degree progress: " + profile.creditsCompleted + " of " + totalCredits + " credits completed";
      document.getElementById("degree-progress-bar").style.width = percent + "%";
    }

    function renderSchedule() {
      const courses = app
        .getRegistrations()
        .map(function (id) {
          return app.getCourseById(id);
        })
        .filter(Boolean);

      scheduleBody.innerHTML = "";
      scheduleEmpty.innerHTML = "";
      scheduleTableWrap.hidden = courses.length === 0;

      if (courses.length === 0) {
        app.renderEmptySchedule(scheduleEmpty);
      }

      courses.forEach(function (course) {
        const row = document.createElement("tr");
        const codeCell = document.createElement("th");
        const titleCell = document.createElement("td");
        const instructorCell = document.createElement("td");
        const scheduleCell = document.createElement("td");
        const creditsCell = document.createElement("td");
        const title = document.createElement("span");
        const schedule = document.createElement("span");

        codeCell.scope = "row";
        codeCell.textContent = course.code;
        title.className = "table-course-title";
        title.textContent = course.title;
        titleCell.appendChild(title);
        instructorCell.textContent = course.instructor;
        schedule.className = "table-schedule";
        schedule.textContent = course.schedule + " · " + course.format;
        scheduleCell.appendChild(schedule);
        creditsCell.textContent = String(course.credits);

        row.appendChild(codeCell);
        row.appendChild(titleCell);
        row.appendChild(instructorCell);
        row.appendChild(scheduleCell);
        row.appendChild(creditsCell);
        scheduleBody.appendChild(row);
      });

      app.updateRegistrationCount();
    }

    function clearError(field) {
      field.control.removeAttribute("aria-invalid");
      field.error.textContent = "";
    }

    function hideSummary() {
      errorSummary.hidden = true;
      errorList.innerHTML = "";
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const errors = [];

      fields.forEach(clearError);
      hideSummary();

      fields.forEach(function (field) {
        const message = field.validate();
        if (message) {
          field.control.setAttribute("aria-invalid", "true");
          field.error.textContent = message;
          errors.push({ field: field, message: message });
        }
      });

      if (errors.length) {
        errors.forEach(function (error) {
          const item = document.createElement("li");
          const link = document.createElement("a");
          link.href = "#" + error.field.control.id;
          link.textContent = error.field.label + ": " + error.message;
          item.appendChild(link);
          errorList.appendChild(item);
        });
        errorSummary.hidden = false;
        errorSummary.focus();
        return;
      }

      const updated = app.saveProfile({
        fullName: nameInput.value.trim(),
        email: emailInput.value.trim(),
        program: programInput.value,
        year: yearInput.value
      });

      fillProfile(updated);
      status.textContent = "Profile updated. Your details have been saved.";
    });

    fields.forEach(function (field) {
      field.control.addEventListener("input", function () {
        clearError(field);
        hideSummary();
        status.textContent = "";
      });
    });

    [programInput, yearInput].forEach(function (control) {
      control.addEventListener("change", function () {
        status.textContent = "";
      });
    });

    printButton.addEventListener("click", function () {
      window.print();
    });

    fillProfile(app.getProfile());
    renderSchedule();
  });
})();
