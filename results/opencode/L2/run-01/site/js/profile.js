(function () {
  "use strict";

  const form = document.getElementById("profileForm");
  if (!form || !window.App) {
    return;
  }

  const nameInput = document.getElementById("profileNameInput");
  const emailInput = document.getElementById("profileEmail");
  const idInput = document.getElementById("profileId");
  const programSelect = document.getElementById("programSelect");
  const yearSelect = document.getElementById("yearSelect");
  const pronounsInput = document.getElementById("pronouns");
  const interestsInput = document.getElementById("interests");
  const emailUpdates = document.getElementById("emailUpdates");
  const waitlistAlerts = document.getElementById("waitlistAlerts");

  const errorSummary = document.getElementById("profileErrors");
  const errorList = document.getElementById("profileErrorList");
  const status = document.getElementById("profileStatus");
  const tableBody = document.getElementById("profileTableBody");

  const avatar = document.getElementById("profileAvatar");
  const displayName = document.getElementById("profileName");
  const displayMeta = document.getElementById("profileMeta");
  const programTag = document.getElementById("profileProgramTag");
  const yearTag = document.getElementById("profileYearTag");
  const snapshotProgram = document.getElementById("snapshotProgram");
  const snapshotYear = document.getElementById("snapshotYear");
  const snapshotId = document.getElementById("snapshotId");

  const fields = [nameInput, emailInput, idInput, programSelect, yearSelect];

  const errorElements = {
    profileNameInput: document.getElementById("profileNameInput-error"),
    profileEmail: document.getElementById("profileEmail-error"),
    profileId: document.getElementById("profileId-error"),
    programSelect: document.getElementById("programSelect-error"),
    yearSelect: document.getElementById("yearSelect-error")
  };

  let profile = window.App.loadProfile();

  function optionExists(select, value) {
    return Array.from(select.options).some(function (option) {
      return option.value === value;
    });
  }

  function updateDisplay() {
    avatar.textContent = window.App.getInitials(profile.name);
    displayName.textContent = profile.name;
    displayMeta.textContent = profile.studentId + " · " + profile.program + " · " + profile.year;
    programTag.textContent = profile.program;
    yearTag.textContent = profile.year;
    snapshotProgram.textContent = profile.program;
    snapshotYear.textContent = profile.year;
    snapshotId.textContent = profile.studentId;
  }

  function fillForm() {
    nameInput.value = profile.name || "";
    emailInput.value = profile.email || "";
    idInput.value = profile.studentId || "";
    pronounsInput.value = profile.pronouns || "";
    interestsInput.value = profile.interests || "";
    emailUpdates.checked = Boolean(profile.emailUpdates);
    waitlistAlerts.checked = Boolean(profile.waitlistAlerts);

    if (profile.program && optionExists(programSelect, profile.program)) {
      programSelect.value = profile.program;
    }

    if (profile.year && optionExists(yearSelect, profile.year)) {
      yearSelect.value = profile.year;
    }
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
      item.field.setAttribute("aria-invalid", "true");
      const error = errorElements[item.field.id];
      if (error) {
        error.textContent = item.message;
        error.hidden = false;
      }

      if (errorList) {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#" + item.field.id;
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

  function validateProfile() {
    const errors = [];
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const studentId = idInput.value.trim();

    if (!name) {
      errors.push({ field: nameInput, message: "Enter your full name." });
    } else if (name.length < 2) {
      errors.push({ field: nameInput, message: "Your full name must be at least 2 characters." });
    }

    if (!email) {
      errors.push({ field: emailInput, message: "Enter your university email address." });
    } else if (!window.App.emailPattern.test(email)) {
      errors.push({ field: emailInput, message: "Enter a valid email address, such as name@university.edu." });
    }

    if (!studentId) {
      errors.push({ field: idInput, message: "Enter your student ID." });
    } else if (!/^[A-Za-z0-9-]{4,}$/.test(studentId)) {
      errors.push({ field: idInput, message: "Use at least 4 letters, numbers, or hyphens for your student ID." });
    }

    if (!programSelect.value || !optionExists(programSelect, programSelect.value)) {
      errors.push({ field: programSelect, message: "Choose your program." });
    }

    if (!yearSelect.value || !optionExists(yearSelect, yearSelect.value)) {
      errors.push({ field: yearSelect, message: "Choose your year of study." });
    }

    return {
      errors: errors,
      values: {
        name: name,
        email: email,
        studentId: studentId,
        program: programSelect.value,
        year: yearSelect.value,
        pronouns: pronounsInput.value.trim(),
        interests: interestsInput.value.trim(),
        emailUpdates: emailUpdates.checked,
        waitlistAlerts: waitlistAlerts.checked
      }
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const result = validateProfile();
    if (result.errors.length > 0) {
      showErrors(result.errors);
      return;
    }

    profile = Object.assign({}, profile, result.values);
    window.App.saveProfile(profile);
    updateDisplay();
    fillForm();
    clearAllErrors();
    window.App.showToast("Profile updated successfully.");

    if (status) {
      status.textContent = "";
      window.requestAnimationFrame(function () {
        status.textContent = "Profile updated successfully.";
      });
    }
  }

  function renderTable() {
    window.App.renderRegistrationTable(tableBody);
  }

  updateDisplay();
  fillForm();
  renderTable();
  window.App.updateStats();

  form.addEventListener("submit", handleSubmit);

  fields.forEach(function (field) {
    if (!field) {
      return;
    }
    const eventName = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventName, function () {
      clearFieldError(field);
      if (errorSummary && !form.querySelector('[aria-invalid="true"]')) {
        errorSummary.hidden = true;
      }
    });
  });

  document.addEventListener("registrations:changed", function () {
    renderTable();
    window.App.updateStats();
  });
})();
