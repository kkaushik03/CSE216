(function () {
  "use strict";

  const TERM = "Spring 2027";
  const STORAGE = {
    registered: "northbridge.registered.v1",
    waitlist: "northbridge.waitlist.v1",
    student: "northbridge.student.v1"
  };

  const DEFAULT_STUDENT = {
    name: "Jordan Ellis",
    email: "jordan.ellis@northbridge.edu",
    studentId: "20458731",
    program: "Computer Science",
    year: "3",
    phone: "555-0142"
  };

  const DEFAULT_REGISTERED = ["CSE 216", "PSY 101"];
  const memoryStore = new Map();
  let pendingAction = null;

  /* ------------------------------------------------------------------ */
  /* Storage helpers                                                     */
  /* ------------------------------------------------------------------ */

  function readRaw(key) {
    try {
      const value = window.localStorage.getItem(key);
      if (value !== null) return value;
    } catch (error) {
      /* localStorage can be unavailable in private browsing. */
    }
    return memoryStore.has(key) ? memoryStore.get(key) : null;
  }

  function writeRaw(key, value) {
    memoryStore.set(key, value);
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* Keep the in-memory copy as a fallback. */
    }
  }

  function readJSON(key, fallback) {
    const raw = readRaw(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    writeRaw(key, JSON.stringify(value));
  }

  function getCourse(code) {
    return COURSES.find(function (course) {
      return course.code === code;
    });
  }

  function getRegistered() {
    const stored = readJSON(STORAGE.registered, null);
    if (stored === null) {
      writeJSON(STORAGE.registered, DEFAULT_REGISTERED);
      return DEFAULT_REGISTERED.slice();
    }
    if (!Array.isArray(stored)) return [];
    const valid = stored.filter(function (code) {
      return typeof code === "string" && Boolean(getCourse(code));
    });
    return Array.from(new Set(valid));
  }

  function setRegistered(codes) {
    writeJSON(STORAGE.registered, codes);
  }

  function getWaitlist() {
    const stored = readJSON(STORAGE.waitlist, []);
    if (!Array.isArray(stored)) return [];
    return stored.filter(function (code) {
      return typeof code === "string" && Boolean(getCourse(code));
    });
  }

  function setWaitlist(codes) {
    writeJSON(STORAGE.waitlist, codes);
  }

  function getStudent() {
    const stored = readJSON(STORAGE.student, null);
    if (stored === null || typeof stored !== "object") {
      writeJSON(STORAGE.student, DEFAULT_STUDENT);
      return Object.assign({}, DEFAULT_STUDENT);
    }
    return Object.assign({}, DEFAULT_STUDENT, stored);
  }

  function setStudent(student) {
    writeJSON(STORAGE.student, student);
  }

  /* ------------------------------------------------------------------ */
  /* Small helpers                                                       */
  /* ------------------------------------------------------------------ */

  function escapeHtml(value) {
    const escapes = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return String(value).replace(/[&<>"']/g, function (character) {
      return escapes[character];
    });
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getStatus(course) {
    const available = Math.max(0, course.capacity - course.enrolled);
    if (available === 0) {
      return {
        key: "full",
        label: "Full",
        available: 0,
        text: "Full — no seats available"
      };
    }
    if (available <= 4) {
      return {
        key: "almost",
        label: "Almost full",
        available: available,
        text:
          "Almost full — " +
          available +
          " seat" +
          (available === 1 ? "" : "s") +
          " left"
      };
    }
    return {
      key: "open",
      label: "Open",
      available: available,
      text:
        available +
        " seat" +
        (available === 1 ? "" : "s") +
        " available"
    };
  }

  function statusBadge(status) {
    return (
      '<span class="badge badge-status ' +
      status.key +
      '">' +
      status.label +
      "</span>"
    );
  }

  function departmentClass(department) {
    return "dept-" + slugify(department);
  }

  function courseCardMarkup(course, options) {
    const settings = options || {};
    const status = getStatus(course);
    const registered =
      settings.registeredSet && settings.registeredSet.has(course.code);
    const waitlisted =
      settings.waitlistSet && settings.waitlistSet.has(course.code);
    const titleId = "course-" + slugify(course.code) + "-title";
    const department = escapeHtml(course.department);
    const code = escapeHtml(course.code);
    const title = escapeHtml(course.title);

    let action;
    let badges =
      '<span class="badge badge-dept">' + department + "</span>" + statusBadge(status);

    if (settings.context === "featured") {
      action =
        '<a class="btn btn-primary" href="courses.html?q=' +
        encodeURIComponent(course.code) +
        '" aria-label="View course ' +
        code +
        ' in the catalog">View course</a>';
    } else if (registered) {
      badges =
        '<span class="badge badge-dept">' +
        department +
        '</span><span class="badge badge-status registered"><span aria-hidden="true">✓</span> Registered</span>';
      action =
        '<a class="btn btn-secondary" href="registration.html" aria-label="Manage registration for ' +
        code +
        '">Manage registration</a>';
    } else if (status.key === "full") {
      if (waitlisted) {
        badges +=
          '<span class="badge badge-status waitlisted">Waitlisted</span>';
        action =
          '<button type="button" class="btn btn-secondary" data-waitlist="' +
          code +
          '" aria-label="Leave waitlist for ' +
          code +
          '">Leave waitlist</button>';
      } else {
        action =
          '<button type="button" class="btn btn-primary" data-waitlist="' +
          code +
          '" aria-label="Join waitlist for ' +
          code +
          '">Join waitlist</button>';
      }
    } else {
      action =
        '<a class="btn btn-primary" href="registration.html?course=' +
        encodeURIComponent(course.code) +
        '" aria-label="Register for ' +
        code +
        '">Register</a>';
    }

    if (waitlisted && !registered && status.key !== "full") {
      badges += '<span class="badge badge-status waitlisted">Waitlisted</span>';
    }

    return (
      "<li>" +
      '<article class="course-card ' +
      departmentClass(course.department) +
      '" aria-labelledby="' +
      titleId +
      '">' +
      '<div class="card-badges">' +
      badges +
      "</div>" +
      "<h3 id=\"" +
      titleId +
      '"><span class="course-code">' +
      code +
      '</span><span class="course-title">' +
      title +
      "</span></h3>" +
      '<p class="course-desc">' +
      escapeHtml(course.description) +
      "</p>" +
      '<dl class="course-meta">' +
      "<div><dt>Level</dt><dd>" +
      course.level +
      "-level</dd></div>" +
      "<div><dt>Credits</dt><dd>" +
      course.credits +
      "</dd></div>" +
      "<div><dt>Instructor</dt><dd>" +
      escapeHtml(course.instructor) +
      "</dd></div>" +
      "<div><dt>Schedule</dt><dd>" +
      escapeHtml(course.schedule) +
      "</dd></div>" +
      "</dl>" +
      '<div class="card-footer"><span class="seats">' +
      status.text +
      "</span>" +
      action +
      "</div>" +
      "</article>" +
      "</li>"
    );
  }

  /* ------------------------------------------------------------------ */
  /* Navigation                                                          */
  /* ------------------------------------------------------------------ */

  function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("primary-menu");
    if (!toggle || !menu) return;

    function closeMenu(returnFocus) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu(false);
      } else {
        menu.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu(true);
      }
    });

    document.addEventListener("click", function (event) {
      if (!menu.classList.contains("is-open")) return;
      if (event.target.closest(".primary-nav") || event.target.closest(".nav-toggle")) {
        return;
      }
      closeMenu(false);
    });

    const desktop = window.matchMedia("(min-width: 821px)");
    function handleDesktopChange(event) {
      if (event.matches) closeMenu(false);
    }
    if (desktop.addEventListener) {
      desktop.addEventListener("change", handleDesktopChange);
    } else if (desktop.addListener) {
      desktop.addListener(handleDesktopChange);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Home page                                                           */
  /* ------------------------------------------------------------------ */

  function initHome() {
    const list = document.getElementById("featured-courses");
    if (!list) return;

    let featured = COURSES.filter(function (course) {
      return course.featured;
    });
    if (featured.length === 0) featured = COURSES.slice(0, 3);

    list.innerHTML = featured
      .slice(0, 3)
      .map(function (course) {
        return courseCardMarkup(course, { context: "featured" });
      })
      .join("");

    const count = document.getElementById("course-count");
    if (count) count.textContent = String(COURSES.length);
  }

  /* ------------------------------------------------------------------ */
  /* Course catalog                                                      */
  /* ------------------------------------------------------------------ */

  function initCatalog() {
    const list = document.getElementById("course-list");
    if (!list) return;

    const form = document.getElementById("catalog-search");
    const search = document.getElementById("course-search");
    const department = document.getElementById("filter-department");
    const level = document.getElementById("filter-level");
    const availability = document.getElementById("filter-availability");
    const statusElement = document.getElementById("catalog-status");
    const emptyState = document.getElementById("empty-state");
    const clearButton = document.getElementById("clear-filters");
    const emptyClearButton = document.getElementById("empty-clear");

    const departments = Array.from(
      new Set(
        COURSES.map(function (course) {
          return course.department;
        })
      )
    ).sort();

    departments.forEach(function (name) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      department.appendChild(option);
    });

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");
    if (initialQuery) search.value = initialQuery;

    function filterCourses() {
      const query = search.value.trim().toLowerCase();
      const departmentValue = department.value;
      const levelValue = level.value;
      const availabilityValue = availability.value;

      return COURSES.filter(function (course) {
        if (departmentValue !== "all" && course.department !== departmentValue) {
          return false;
        }
        if (levelValue !== "all" && String(course.level) !== levelValue) {
          return false;
        }

        const status = getStatus(course);
        if (availabilityValue === "open" && status.available === 0) {
          return false;
        }
        if (
          availabilityValue === "almost" &&
          !(status.available > 0 && status.available <= 4)
        ) {
          return false;
        }
        if (availabilityValue === "full" && status.available !== 0) {
          return false;
        }

        if (query) {
          const haystack = [
            course.code,
            course.title,
            course.department,
            course.instructor,
            course.description
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(query)) return false;
        }

        return true;
      });
    }

    function render(focusWaitlistCode) {
      const filtered = filterCourses();
      const registered = new Set(getRegistered());
      const waitlist = new Set(getWaitlist());

      list.innerHTML = filtered
        .map(function (course) {
          return courseCardMarkup(course, {
            context: "catalog",
            registeredSet: registered,
            waitlistSet: waitlist
          });
        })
        .join("");

      list.hidden = filtered.length === 0;
      emptyState.hidden = filtered.length !== 0;

      statusElement.textContent =
        filtered.length === 0
          ? "No courses found. Showing 0 of " + COURSES.length + " courses."
          : "Showing " +
            filtered.length +
            " of " +
            COURSES.length +
            " courses.";

      if (focusWaitlistCode) {
        window.requestAnimationFrame(function () {
          const buttons = document.querySelectorAll("[data-waitlist]");
          for (let index = 0; index < buttons.length; index += 1) {
            if (buttons[index].dataset.waitlist === focusWaitlistCode) {
              buttons[index].focus();
              break;
            }
          }
        });
      }
    }

    function resetFilters(focusSearch) {
      search.value = "";
      department.value = "all";
      level.value = "all";
      availability.value = "all";
      render();
      if (focusSearch) search.focus();
    }

    search.addEventListener("input", function () {
      render();
    });

    [department, level, availability].forEach(function (select) {
      select.addEventListener("change", function () {
        render();
      });
    });

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        render();
      });
    }

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        resetFilters(true);
      });
    }

    if (emptyClearButton) {
      emptyClearButton.addEventListener("click", function () {
        resetFilters(true);
      });
    }

    list.addEventListener("click", function (event) {
      const button = event.target.closest("[data-waitlist]");
      if (!button) return;

      const code = button.dataset.waitlist;
      const current = getWaitlist();
      const wasWaitlisted = current.includes(code);
      const next = wasWaitlisted
        ? current.filter(function (item) {
            return item !== code;
          })
        : current.concat(code);

      setWaitlist(next);
      render(code);

      const course = getCourse(code);
      statusElement.textContent = wasWaitlisted
        ? "You left the waitlist for " + code + "."
        : "You joined the waitlist for " +
          code +
          (course ? " — " + course.title : "") +
          ". We will email you if a seat opens.";
    });

    render();
  }

  /* ------------------------------------------------------------------ */
  /* Shared form helpers                                                 */
  /* ------------------------------------------------------------------ */

  const fieldRules = {
    name: function (value) {
      return value.trim().length >= 2 ? "" : "Enter your full name.";
    },
    studentId: function (value) {
      return /^\d{8}$/.test(value.trim())
        ? ""
        : "Enter a student ID with 8 digits, for example 20458731.";
    },
    email: function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? ""
        : "Enter a valid email address, for example name@example.com.";
    },
    program: function (value) {
      return value ? "" : "Select your program.";
    },
    year: function (value) {
      return value ? "" : "Select your year of study.";
    }
  };

  function setFieldError(input, errorElement, message) {
    if (!input || !errorElement) return;
    if (message) {
      errorElement.textContent = message;
      errorElement.hidden = false;
      input.setAttribute("aria-invalid", "true");
    } else {
      errorElement.textContent = "";
      errorElement.hidden = true;
      input.removeAttribute("aria-invalid");
    }
  }

  function attachLiveValidation(fields) {
    fields.forEach(function (field) {
      function refresh() {
        if (field.input.getAttribute("aria-invalid") !== "true") return;
        const message = field.validate();
        setFieldError(field.input, field.error, message);
        if (!message) {
          removeSummaryLink(field.input);
        }
      }
      field.input.addEventListener("input", refresh);
      field.input.addEventListener("change", refresh);
      field.input.addEventListener("blur", refresh);
    });
  }

  function removeSummaryLink(input) {
    const summary = document.getElementById("form-errors");
    const list = document.getElementById("form-error-list");
    if (!summary || !list) return;
    const link = list.querySelector('a[href="#' + input.id + '"]');
    if (link && link.parentElement) link.parentElement.remove();
    if (!document.querySelector('#registration-form [aria-invalid="true"]')) {
      summary.hidden = true;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Registration page                                                   */
  /* ------------------------------------------------------------------ */

  function initRegistration() {
    const form = document.getElementById("registration-form");
    if (!form) return;

    const nameInput = document.getElementById("student-name");
    const idInput = document.getElementById("student-id");
    const emailInput = document.getElementById("student-email");
    const courseSelect = document.getElementById("course-select");
    const nameError = document.getElementById("name-error");
    const idError = document.getElementById("student-id-error");
    const emailError = document.getElementById("email-error");
    const courseError = document.getElementById("course-error");
    const errorSummary = document.getElementById("form-errors");
    const errorList = document.getElementById("form-error-list");
    const statusElement = document.getElementById("registration-status");
    const tableWrap = document.getElementById("table-wrap");
    const emptyState = document.getElementById("registered-empty");
    const tableBody = document.getElementById("registered-body");
    const tableCaption = document.getElementById("registered-caption");
    const summary = document.getElementById("registration-summary");
    const registeredHeading = document.getElementById("registered-heading");

    const dialog = document.getElementById("confirm-dialog");
    const dialogTitle = document.getElementById("confirm-title");
    const dialogDescription = document.getElementById("confirm-description");
    const dialogDetails = document.getElementById("confirm-details");
    const dialogCancel = document.getElementById("confirm-cancel");
    const dialogConfirm = document.getElementById("confirm-submit");

    const student = getStudent();
    nameInput.value = student.name;
    idInput.value = student.studentId;
    emailInput.value = student.email;

    function populateCourseSelect() {
      const current = courseSelect.value;
      courseSelect.innerHTML = '<option value="">Select a course</option>';

      const groups = new Map();
      COURSES.forEach(function (course) {
        if (!groups.has(course.department)) {
          groups.set(course.department, []);
        }
        groups.get(course.department).push(course);
      });

      const registered = new Set(getRegistered());

      groups.forEach(function (courses, departmentName) {
        const group = document.createElement("optgroup");
        group.label = departmentName;

        courses.forEach(function (course) {
          const option = document.createElement("option");
          option.value = course.code;
          const status = getStatus(course);

          if (registered.has(course.code)) {
            option.textContent =
              course.code + " — " + course.title + " (already registered)";
            option.disabled = true;
          } else if (status.available === 0) {
            option.textContent =
              course.code + " — " + course.title + " (full)";
            option.disabled = true;
          } else {
            option.textContent =
              course.code +
              " — " +
              course.title +
              " (" +
              status.available +
              " seat" +
              (status.available === 1 ? "" : "s") +
              " available)";
          }

          group.appendChild(option);
        });

        courseSelect.appendChild(group);
      });

      if (
        current &&
        Array.from(courseSelect.options).some(function (option) {
          return option.value === current && !option.disabled;
        })
      ) {
        courseSelect.value = current;
      } else {
        courseSelect.value = "";
      }
    }

    function preselectFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("course");
      if (!requested) return;

      const course = COURSES.find(function (item) {
        return item.code.toLowerCase() === requested.trim().toLowerCase();
      });

      if (!course) {
        statusElement.textContent =
          "The course you selected was not found. Choose a course from the list.";
        return;
      }

      if (getRegistered().includes(course.code)) {
        statusElement.textContent =
          "You are already registered for " +
          course.code +
          " — " +
          course.title +
          ".";
        return;
      }

      if (getStatus(course).available === 0) {
        statusElement.textContent =
          course.code +
          " — " +
          course.title +
          " is full. You can join the waitlist from the course catalog.";
        return;
      }

      courseSelect.value = course.code;
      statusElement.textContent =
        course.code +
        " — " +
        course.title +
        " is selected. Review the details and submit to register.";
    }

    function renderRegisteredCourses() {
      const registered = getRegistered();
      const courses = registered
        .map(function (code) {
          return getCourse(code);
        })
        .filter(Boolean);
      const credits = courses.reduce(function (total, course) {
        return total + course.credits;
      }, 0);

      if (courses.length === 0) {
        tableWrap.hidden = true;
        emptyState.hidden = false;
        summary.textContent = "No courses registered for " + TERM + ".";
        return;
      }

      tableWrap.hidden = false;
      emptyState.hidden = true;
      summary.textContent =
        courses.length +
        (courses.length === 1 ? " course" : " courses") +
        " · " +
        credits +
        " credits";

      tableCaption.textContent =
        "Registered courses for " +
        TERM +
        ": " +
        courses.length +
        (courses.length === 1 ? " course" : " courses") +
        ", " +
        credits +
        " credits";

      tableBody.innerHTML = courses
        .map(function (course) {
          return (
            "<tr>" +
            '<th scope="row"><span class="table-code">' +
            escapeHtml(course.code) +
            '</span><span class="table-title">' +
            escapeHtml(course.title) +
            "</span></th>" +
            "<td>" +
            escapeHtml(course.department) +
            "</td>" +
            "<td>" +
            course.credits +
            "</td>" +
            "<td>" +
            escapeHtml(course.schedule) +
            "</td>" +
            "<td>" +
            TERM +
            "</td>" +
            '<td><button type="button" class="btn btn-small btn-danger" data-drop="' +
            escapeHtml(course.code) +
            '" aria-label="Drop ' +
            escapeHtml(course.code) +
            '">Drop</button></td>' +
            "</tr>"
          );
        })
        .join("");
    }

    function courseValidationMessage() {
      const code = courseSelect.value;
      if (!code) return "Select a course to register for.";
      const course = getCourse(code);
      if (!course) return "Choose a course from the list.";
      if (getRegistered().includes(code)) {
        return (
          "You are already registered for " +
          code +
          ". Choose another course."
        );
      }
      if (getStatus(course).available === 0) {
        return (
          code +
          " is full. Choose another course or join the waitlist from the catalog."
        );
      }
      return "";
    }

    function validateRegistration() {
      const errors = [];

      const nameMessage = fieldRules.name(nameInput.value);
      setFieldError(nameInput, nameError, nameMessage);
      if (nameMessage) errors.push({ input: nameInput, message: nameMessage });

      const idMessage = fieldRules.studentId(idInput.value);
      setFieldError(idInput, idError, idMessage);
      if (idMessage) errors.push({ input: idInput, message: idMessage });

      const emailMessage = fieldRules.email(emailInput.value);
      setFieldError(emailInput, emailError, emailMessage);
      if (emailMessage) {
        errors.push({ input: emailInput, message: emailMessage });
      }

      const courseMessage = courseValidationMessage();
      setFieldError(courseSelect, courseError, courseMessage);
      if (courseMessage) {
        errors.push({ input: courseSelect, message: courseMessage });
      }

      return errors;
    }

    function showErrorSummary(errors) {
      errorList.innerHTML = errors
        .map(function (error) {
          return (
            '<li><a href="#' +
            error.input.id +
            '">' +
            escapeHtml(error.message) +
            "</a></li>"
          );
        })
        .join("");
      errorSummary.hidden = false;
      errorSummary.focus();
    }

    function openDialog(action) {
      const course = getCourse(action.code);
      if (!course || !dialog) return;

      pendingAction = action;

      if (action.type === "register") {
        dialogTitle.textContent = "Confirm your registration";
        dialogDescription.textContent =
          "Please review the details below. Selecting confirm saves this course to your Spring 2027 schedule.";
        dialogConfirm.textContent = "Confirm registration";
        dialogConfirm.className = "btn btn-primary";
        dialogDetails.innerHTML =
          "<div><dt>Course</dt><dd>" +
          escapeHtml(course.code) +
          " — " +
          escapeHtml(course.title) +
          "</dd></div>" +
          "<div><dt>Credits</dt><dd>" +
          course.credits +
          "</dd></div>" +
          "<div><dt>Schedule</dt><dd>" +
          escapeHtml(course.schedule) +
          "</dd></div>" +
          "<div><dt>Term</dt><dd>" +
          TERM +
          "</dd></div>" +
          "<div><dt>Student</dt><dd>" +
          escapeHtml(nameInput.value.trim()) +
          "</dd></div>";
      } else {
        dialogTitle.textContent = "Drop " + course.code + "?";
        dialogDescription.textContent =
          "This removes " +
          course.code +
          " from your Spring 2027 schedule. You can register again later if seats are available.";
        dialogConfirm.textContent = "Drop course";
        dialogConfirm.className = "btn btn-danger";
        dialogDetails.innerHTML =
          "<div><dt>Course</dt><dd>" +
          escapeHtml(course.code) +
          " — " +
          escapeHtml(course.title) +
          "</dd></div>" +
          "<div><dt>Credits</dt><dd>" +
          course.credits +
          "</dd></div>" +
          "<div><dt>Instructor</dt><dd>" +
          escapeHtml(course.instructor) +
          "</dd></div>" +
          "<div><dt>Term</dt><dd>" +
          TERM +
          "</dd></div>";
      }

      dialog.showModal();
      if (dialogCancel) dialogCancel.focus();
    }

    attachLiveValidation([
      { input: nameInput, error: nameError, validate: function () { return fieldRules.name(nameInput.value); } },
      { input: idInput, error: idError, validate: function () { return fieldRules.studentId(idInput.value); } },
      { input: emailInput, error: emailError, validate: function () { return fieldRules.email(emailInput.value); } },
      { input: courseSelect, error: courseError, validate: courseValidationMessage }
    ]);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const errors = validateRegistration();

      if (errors.length > 0) {
        showErrorSummary(errors);
        return;
      }

      errorSummary.hidden = true;
      openDialog({ type: "register", code: courseSelect.value });
    });

    if (errorList) {
      errorList.addEventListener("click", function (event) {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        const target = document.getElementById(link.getAttribute("href").slice(1));
        if (!target) return;
        event.preventDefault();
        target.focus();
      });
    }

    if (dialogCancel) {
      dialogCancel.addEventListener("click", function () {
        dialog.close();
      });
    }

    if (dialog) {
      dialog.addEventListener("close", function () {
        pendingAction = null;
      });
    }

    if (dialogConfirm) {
      dialogConfirm.addEventListener("click", function () {
        if (!pendingAction) {
          dialog.close();
          return;
        }

        const action = pendingAction;
        const course = getCourse(action.code);

        if (action.type === "register" && course) {
          const registered = getRegistered();
          if (!registered.includes(action.code)) {
            registered.push(action.code);
            setRegistered(registered);
          }

          const existingStudent = getStudent();
          setStudent(
            Object.assign({}, existingStudent, {
              name: nameInput.value.trim(),
              email: emailInput.value.trim(),
              studentId: idInput.value.trim()
            })
          );

          renderRegisteredCourses();
          populateCourseSelect();
          courseSelect.value = "";
          errorSummary.hidden = true;
          dialog.close();
          statusElement.textContent =
            "Registration saved. You are now enrolled in " +
            action.code +
            " — " +
            course.title +
            ".";
        } else if (action.type === "drop" && course) {
          setRegistered(
            getRegistered().filter(function (code) {
              return code !== action.code;
            })
          );
          renderRegisteredCourses();
          populateCourseSelect();
          dialog.close();
          statusElement.textContent =
            action.code +
            " — " +
            course.title +
            " has been dropped from your " +
            TERM +
            " schedule.";
          window.requestAnimationFrame(function () {
            if (registeredHeading) registeredHeading.focus();
          });
        }
      });
    }

    if (tableBody) {
      tableBody.addEventListener("click", function (event) {
        const button = event.target.closest("[data-drop]");
        if (!button) return;
        openDialog({ type: "drop", code: button.dataset.drop });
      });
    }

    populateCourseSelect();
    preselectFromUrl();
    renderRegisteredCourses();
  }

  /* ------------------------------------------------------------------ */
  /* Profile page                                                        */
  /* ------------------------------------------------------------------ */

  function initProfile() {
    const form = document.getElementById("profile-form");
    if (!form) return;

    const nameInput = document.getElementById("profile-name");
    const idInput = document.getElementById("profile-student-id");
    const emailInput = document.getElementById("profile-email");
    const phoneInput = document.getElementById("profile-phone");
    const programSelect = document.getElementById("profile-program");
    const yearSelect = document.getElementById("profile-year");
    const nameError = document.getElementById("profile-name-error");
    const idError = document.getElementById("profile-student-id-error");
    const emailError = document.getElementById("profile-email-error");
    const programError = document.getElementById("profile-program-error");
    const yearError = document.getElementById("profile-year-error");
    const statusElement = document.getElementById("profile-status");

    const student = getStudent();
    nameInput.value = student.name;
    idInput.value = student.studentId;
    emailInput.value = student.email;
    phoneInput.value = student.phone || "";
    programSelect.value = student.program;
    yearSelect.value = student.year;

    function updateSummary() {
      const registered = getRegistered();
      const courses = registered
        .map(function (code) {
          return getCourse(code);
        })
        .filter(Boolean);
      const credits = courses.reduce(function (total, course) {
        return total + course.credits;
      }, 0);

      const courseCount = document.getElementById("summary-courses");
      const creditCount = document.getElementById("summary-credits");
      if (courseCount) courseCount.textContent = String(courses.length);
      if (creditCount) creditCount.textContent = String(credits);
    }

    attachLiveValidation([
      { input: nameInput, error: nameError, validate: function () { return fieldRules.name(nameInput.value); } },
      { input: idInput, error: idError, validate: function () { return fieldRules.studentId(idInput.value); } },
      { input: emailInput, error: emailError, validate: function () { return fieldRules.email(emailInput.value); } },
      { input: programSelect, error: programError, validate: function () { return fieldRules.program(programSelect.value); } },
      { input: yearSelect, error: yearError, validate: function () { return fieldRules.year(yearSelect.value); } }
    ]);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const checks = [
        {
          input: nameInput,
          error: nameError,
          message: fieldRules.name(nameInput.value)
        },
        {
          input: idInput,
          error: idError,
          message: fieldRules.studentId(idInput.value)
        },
        {
          input: emailInput,
          error: emailError,
          message: fieldRules.email(emailInput.value)
        },
        {
          input: programSelect,
          error: programError,
          message: fieldRules.program(programSelect.value)
        },
        {
          input: yearSelect,
          error: yearError,
          message: fieldRules.year(yearSelect.value)
        }
      ];

      let firstInvalid = null;
      checks.forEach(function (check) {
        setFieldError(check.input, check.error, check.message);
        if (check.message && !firstInvalid) firstInvalid = check.input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      setStudent({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        studentId: idInput.value.trim(),
        program: programSelect.value,
        year: yearSelect.value,
        phone: phoneInput.value.trim()
      });

      updateSummary();
      statusElement.textContent =
        "Profile saved. Your registration form will use these details.";
    });

    updateSummary();
  }

  /* ------------------------------------------------------------------ */
  /* Start                                                               */
  /* ------------------------------------------------------------------ */

  initNavigation();
  initHome();
  initCatalog();
  initRegistration();
  initProfile();
})();
