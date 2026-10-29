(function () {
  "use strict";

  const form = document.getElementById("registrationForm");
  if (!form || !window.App) {
    return;
  }

  const fullName = document.getElementById("fullName");
  const studentId = document.getElementById("studentId");
  const email = document.getElementById("email");
  const courseSelect = document.getElementById("courseSelect");
  const termSelect = document.getElementById("termSelect");
  const notes = document.getElementById("notes");
  const consent = document.getElementById("consent");

  const errorSummary = document.getElementById("formErrors");
  const errorList = document.getElementById("formErrorList");
  const preview = document.getElementById("coursePreview");
  const previewTitle = document.getElementById("coursePreviewTitle");
  const previewCode = document.getElementById("coursePreviewCode");
  const previewInstructor = document.getElementById("coursePreviewInstructor");
  const previewSchedule = document.getElementById("coursePreviewSchedule");
  const previewFormat = document.getElementById("coursePreviewFormat");
  const previewSeats = document.getElementById("coursePreviewSeats");
  const tableBody = document.getElementById("registrationTableBody");

  const fields = [fullName, studentId, email, courseSelect, termSelect, consent];

  const errorElements = {
    fullName: document.getElementById("fullName-error"),
    studentId: document.getElementById("studentId-error"),
    email: document.getElementById("email-error"),
    courseSelect: document.getElementById("course-error"),
    termSelect: document.getElementById("term-error"),
    consent: document.getElementById("consent-error")
  };

  let profile = window.App.loadProfile();

  function prefillStudentDetails() {
    fullName.value = profile.name || "";
    studentId.value = profile.studentId || "";
    email.value = profile.email || "";
  }

  function populateTerms() {
    const current = termSelect.value;
    while (termSelect.options.length > 1) {
      termSelect.remove(1);
    }

    window.App.terms.forEach(function (term) {
      const option = document.createElement("option");
      option.value = term.name;
      option.textContent = term.name + (term.status === "Waitlist" ? " (waitlist)" : "");
      termSelect.appendChild(option);
    });

    if (current) {
      termSelect.value = current;
    } else if (window.App.terms.length > 0) {
      termSelect.value = window.App.terms[0].name;
    }
  }

  function populateCourses() {
    const current = courseSelect.value;

    while (courseSelect.options.length > 1) {
      courseSelect.remove(1);
    }

    const grouped = {};
    window.App.courses
      .slice()
      .sort(function (a, b) {
        return a.department.localeCompare(b.department) || a.code.localeCompare(b.code);
      })
      .forEach(function (course) {
        if (!grouped[course.department]) {
          grouped[course.department] = [];
        }
        grouped[course.department].push(course);
      });

    Object.keys(grouped).forEach(function (department) {
      const group = document.createElement("optgroup");
      group.label = department;

      grouped[department].forEach(function (course) {
        const registered = window.App.isRegistered(course.id);
        const full = window.App.isFull(course);
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.code + " — " + course.title + " (" + course.credits + " cr)";

        if (registered) {
          option.disabled = true;
          option.textContent += " — already registered";
        } else if (full) {
          option.disabled = true;
          option.textContent += " — course full";
        }

        group.appendChild(option);
      });

      courseSelect.appendChild(group);
    });

    if (current) {
      const selected = Array.from(courseSelect.options).find(function (option) {
        return option.value === current && !option.disabled;
      });
      courseSelect.value = selected ? current : "";
    }
  }

  function updatePreview() {
    const course = window.App.getCourse(courseSelect.value);

    if (!course) {
      preview.hidden = true;
      return;
    }

    const available = window.App.getAvailableSeats(course);

    previewTitle.textContent = course.title;
    previewCode.textContent = course.code + " · " + course.credits + " credits · " + course.department;
    previewInstructor.textContent = course.instructor;
    previewSchedule.textContent = window.App.formatSchedule(course);
    previewFormat.textContent = course.modality;
    previewSeats.textContent = available + " of " + course.seats + " seats available";
    preview.hidden = false;
  }

  function clearFieldError(field) {
    if (!field) {
      return;
    }
    field.removeAttribute("aria-invalid");
    const error = errorElements[field.id];
    if (error) {
      error.hidden = true;
      error.textContent = "";
    }
  }

  function clearAllErrors() {
    fields.forEach(clearFieldError);
    if (errorSummary) {
      errorSummary.hidden = true;
    }
    if (errorList) {
      errorList.innerHTML = "";
    }
  }

  function showErrors(errors) {
    clearAllErrors();

    errors.forEach(function (item) {
      if (item.field) {
        item.field.setAttribute("aria-invalid", "true");
        const error = errorElements[item.field.id];
        if (error) {
          error.textContent = item.message;
          error.hidden = false;
        }
      }

      if (errorList) {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#" + (item.field ? item.field.id : "registrationForm");
        link.textContent = item.message;
        listItem.appendChild(link);
        errorList.appendChild(listItem);
      }
    });

    if (errorSummary) {
      errorSummary.hidden = false;
      errorSummary.focus();
    }
  }

  function validate() {
    const errors = [];
    const nameValue = fullName.value.trim();
    const idValue = studentId.value.trim();
    const emailValue = email.value.trim();
    const courseValue = courseSelect.value;
    const course = window.App.getCourse(courseValue);
    const termValue = termSelect.value;

    if (!nameValue) {
      errors.push({ field: fullName, message: "Enter your full name." });
    } else if (nameValue.length < 2) {
      errors.push({ field: fullName, message: "Your full name must be at least 2 characters." });
    }

    if (!idValue) {
      errors.push({ field: studentId, message: "Enter your student ID." });
    } else if (!/^[A-Za-z0-9-]{4,}$/.test(idValue)) {
      errors.push({ field: studentId, message: "Use at least 4 letters, numbers, or hyphens for your student ID." });
    }

    if (!emailValue) {
      errors.push({ field: email, message: "Enter your university email address." });
    } else if (!window.App.emailPattern.test(emailValue)) {
      errors.push({ field: email, message: "Enter a valid email address, such as name@university.edu." });
    }

    if (!courseValue) {
      errors.push({ field: courseSelect, message: "Choose a course to register for." });
    } else if (!course) {
      errors.push({ field: courseSelect, message: "Choose a valid course from the list." });
    } else if (window.App.isRegistered(course.id)) {
      errors.push({ field: courseSelect, message: "You are already registered for this course." });
    } else if (window.App.isFull(course)) {
      errors.push({ field: courseSelect, message: "This course is full. Please choose another course." });
    }

    if (!termValue) {
      errors.push({ field: termSelect, message: "Choose a term." });
    } else if (!window.App.terms.some(function (term) { return term.name === termValue; })) {
      errors.push({ field: termSelect, message: "Choose a valid term from the list." });
    }

    if (!consent.checked) {
      errors.push({ field: consent, message: "Confirm that your details are correct before registering." });
    }

    return {
      errors: errors,
      values: {
        name: nameValue,
        studentId: idValue,
        email: emailValue,
        course: course,
        term: termValue,
        notes: notes.value.trim()
      }
    };
  }

  function renderTable() {
    window.App.renderRegistrationTable(tableBody);
  }

  function resetFormAfterRegistration() {
    courseSelect.value = "";
    notes.value = "";
    consent.checked = false;
    populateCourses();
    updatePreview();
    renderTable();
    window.App.updateStats();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const result = validate();

    if (result.errors.length > 0) {
      showErrors(result.errors);
      return;
    }

    const values = result.values;
    const added = window.App.addRegistration(values.course.id, values.term, values.notes);

    if (!added) {
      showErrors([{ field: courseSelect, message: "We could not add that course. Please choose another course." }]);
      return;
    }

    profile.name = values.name;
    profile.studentId = values.studentId;
    profile.email = values.email;
    window.App.saveProfile(profile);

    clearAllErrors();
    resetFormAfterRegistration();

    const prefersReducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.App.showModal({
      tone: "success",
      icon: "✓",
      title: "You are registered!",
      message: values.course.code + " — " + values.course.title + " has been added to your " + values.term + " schedule. A confirmation has been sent to " + values.email + ".",
      details: [
        { label: "Term", value: values.term },
        { label: "Credits", value: String(values.course.credits) },
        { label: "Instructor", value: values.course.instructor },
        { label: "Schedule", value: window.App.formatSchedule(values.course) }
      ],
      primaryLabel: "View my courses",
      secondaryLabel: "Register another course",
      onPrimary: function () {
        const heading = document.getElementById("registeredHeading");
        if (heading) {
          heading.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
          heading.focus({ preventScroll: true });
        }
      },
      onSecondary: function () {
        courseSelect.focus();
      }
    });
  }

  prefillStudentDetails();
  populateTerms();
  populateCourses();

  const requestedCourse = new URLSearchParams(window.location.search).get("course");
  if (requestedCourse) {
    const matchingOption = Array.from(courseSelect.options).find(function (option) {
      return option.value === requestedCourse && !option.disabled;
    });
    if (matchingOption) {
      courseSelect.value = requestedCourse;
    }
  }

  updatePreview();
  renderTable();
  window.App.updateStats();

  form.addEventListener("submit", handleSubmit);

  fields.forEach(function (field) {
    if (!field) {
      return;
    }
    const eventName = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventName, function () {
      clearFieldError(field);
      if (errorSummary && !form.querySelector('[aria-invalid="true"]')) {
        errorSummary.hidden = true;
      }
    });
  });

  courseSelect.addEventListener("change", updatePreview);

  document.addEventListener("registrations:changed", function () {
    populateCourses();
    updatePreview();
    renderTable();
    window.App.updateStats();
  });
})();
