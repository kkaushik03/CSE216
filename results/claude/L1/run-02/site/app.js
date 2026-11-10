/* Shared logic for all pages. Depends on data.js. */
(function () {
  "use strict";

  /* ---------- Storage ---------- */
  const STORE_REG = "cr_registrations";
  const STORE_STUDENT = "cr_student";

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  const getRegistrations = () => load(STORE_REG, []);
  const setRegistrations = (list) => save(STORE_REG, list);
  const getStudent = () => Object.assign({}, DEFAULT_STUDENT, load(STORE_STUDENT, {}));
  const setStudent = (s) => save(STORE_STUDENT, s);

  /* ---------- Helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  const findCourse = (id) => COURSES.find((c) => c.id === id);
  const isRegistered = (id) => getRegistrations().some((r) => r.id === id);
  const registeredCourses = () => getRegistrations().map((r) => Object.assign({}, findCourse(r.id), { reg: r })).filter((c) => c.id);
  const totalCredits = () => registeredCourses().reduce((sum, c) => sum + c.credits, 0);

  function seatsLeft(course) {
    const taken = course.enrolled + (isRegistered(course.id) ? 1 : 0);
    return Math.max(course.seats - taken, 0);
  }

  function toMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }
  function timeRange(course) {
    const [start, end] = course.time.split("–");
    return [toMinutes(start), toMinutes(end)];
  }
  function conflictsWith(course) {
    const [s1, e1] = timeRange(course);
    return registeredCourses().find((c) => {
      if (c.id === course.id) return false;
      const sharesDay = course.days.split("").some((d) => c.days.includes(d));
      if (!sharesDay) return false;
      const [s2, e2] = timeRange(c);
      return s1 < e2 && s2 < e1;
    });
  }

  const DAY_NAMES = { M: "Mon", T: "Tue", W: "Wed", R: "Thu", F: "Fri" };
  const formatDays = (days) => days.split("").map((d) => DAY_NAMES[d]).join(", ");
  const deptColor = (dept) => (DEPARTMENTS[dept] ? DEPARTMENTS[dept].color : "#636e72");

  /* ---------- Navigation ---------- */
  function initNav() {
    const toggle = $(".nav-toggle");
    const links = $(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    const page = document.body.dataset.page;
    $$(".nav-links a").forEach((a) => {
      if (a.dataset.page === page) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
    updateNavBadge();
  }

  function updateNavBadge() {
    const badge = $("#nav-badge");
    if (!badge) return;
    const n = getRegistrations().length;
    badge.textContent = n;
    badge.hidden = n === 0;
  }

  /* ---------- Modal ---------- */
  let lastFocus = null;
  function openModal(opts) {
    const overlay = $("#modal");
    if (!overlay) return;
    lastFocus = document.activeElement;
    $("#modal-title").textContent = opts.title;
    $("#modal-body").innerHTML = opts.body;
    const icon = $("#modal-icon");
    icon.textContent = opts.icon || "✓";
    icon.className = "modal-icon " + (opts.variant || "primary");

    const confirmBtn = $("#modal-confirm");
    const cancelBtn = $("#modal-cancel");
    confirmBtn.textContent = opts.confirmText || "Confirm";
    confirmBtn.className = "btn " + (opts.variant === "danger" ? "btn-danger" : "btn-primary");
    cancelBtn.textContent = opts.cancelText || "Cancel";
    cancelBtn.hidden = opts.hideCancel === true;

    confirmBtn.onclick = () => {
      closeModal();
      if (opts.onConfirm) opts.onConfirm();
    };
    cancelBtn.onclick = closeModal;

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("show"));
    confirmBtn.focus();
  }
  function closeModal() {
    const overlay = $("#modal");
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove("show");
    overlay.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function initModal() {
    const overlay = $("#modal");
    if (!overlay) return;
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
    $("#modal-close").addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  /* ---------- Toast ---------- */
  function toast(message, type) {
    let box = $("#toast");
    if (!box) {
      box = document.createElement("div");
      box.id = "toast";
      box.setAttribute("role", "status");
      document.body.appendChild(box);
    }
    box.textContent = message;
    box.className = "toast show " + (type || "");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => box.classList.remove("show"), 2800);
  }

  /* ---------- Course card ---------- */
  function courseCard(c) {
    const left = seatsLeft(c);
    const full = left === 0;
    const registered = isRegistered(c.id);
    const pct = Math.round(((c.seats - left) / c.seats) * 100);
    let action;
    if (registered) action = `<span class="btn btn-success btn-sm is-static">✓ Registered</span>`;
    else if (full) action = `<span class="btn btn-disabled btn-sm is-static">Class full</span>`;
    else action = `<a class="btn btn-primary btn-sm" href="register.html?course=${encodeURIComponent(c.id)}">Register</a>`;

    return `
      <article class="course-card" style="--accent:${deptColor(c.dept)}">
        <div class="card-top">
          <span class="course-code">${esc(c.id)}</span>
          <span class="chip">${esc(DEPARTMENTS[c.dept].name)}</span>
        </div>
        <h3>${esc(c.title)}</h3>
        <p class="card-desc">${esc(c.description)}</p>
        <ul class="card-meta">
          <li><span aria-hidden="true">👩‍🏫</span> ${esc(c.instructor)}</li>
          <li><span aria-hidden="true">🗓️</span> ${formatDays(c.days)} · ${esc(c.time)}</li>
          <li><span aria-hidden="true">📍</span> ${esc(c.room)}</li>
          <li><span aria-hidden="true">⭐</span> ${c.credits} credits · Level ${c.level}</li>
        </ul>
        <div class="seat-bar" title="${c.seats - left} of ${c.seats} seats taken">
          <div class="seat-fill${full ? " full" : pct > 80 ? " almost" : ""}" style="width:${pct}%"></div>
        </div>
        <div class="card-bottom">
          <span class="seats ${full ? "text-danger" : ""}">${full ? "No seats left" : left + " seats left"}</span>
          ${action}
        </div>
      </article>`;
  }

  /* ---------- Home page ---------- */
  function initHome() {
    const stats = $("#home-stats");
    if (stats) {
      const openCourses = COURSES.filter((c) => seatsLeft(c) > 0).length;
      stats.innerHTML = `
        <div class="stat stat-1"><strong>${COURSES.length}</strong><span>Courses offered</span></div>
        <div class="stat stat-2"><strong>${Object.keys(DEPARTMENTS).length}</strong><span>Departments</span></div>
        <div class="stat stat-3"><strong>${openCourses}</strong><span>Open for enrollment</span></div>
        <div class="stat stat-4"><strong>${totalCredits()}</strong><span>Your credits</span></div>`;
    }

    const depts = $("#home-depts");
    if (depts) {
      depts.innerHTML = Object.entries(DEPARTMENTS).map(([code, d]) => {
        const count = COURSES.filter((c) => c.dept === code).length;
        return `<a class="dept-tile" style="--accent:${d.color}" href="catalog.html?dept=${code}">
          <strong>${esc(d.name)}</strong><span>${count} course${count === 1 ? "" : "s"}</span></a>`;
      }).join("");
    }

    const featured = $("#featured-courses");
    if (featured) {
      const picks = ["CS340", "BIO360", "ART320", "PSY420"].map(findCourse);
      featured.innerHTML = picks.map(courseCard).join("");
    }

    const greeting = $("#home-greeting");
    if (greeting) greeting.textContent = getStudent().firstName;

    const form = $("#home-search");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = $("#home-search-input").value.trim();
        window.location.href = "catalog.html" + (q ? "?q=" + encodeURIComponent(q) : "");
      });
    }
  }

  /* ---------- Catalog page ---------- */
  function initCatalog() {
    const grid = $("#course-grid");
    const search = $("#search");
    const fDept = $("#filter-dept");
    const fLevel = $("#filter-level");
    const fCredits = $("#filter-credits");
    const fDays = $("#filter-days");
    const fAvail = $("#filter-availability");
    const sort = $("#sort");
    const count = $("#result-count");

    fDept.innerHTML = `<option value="">All departments</option>` +
      Object.entries(DEPARTMENTS).map(([k, d]) => `<option value="${k}">${esc(d.name)}</option>`).join("");

    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) search.value = params.get("q");
    if (params.get("dept") && DEPARTMENTS[params.get("dept")]) fDept.value = params.get("dept");

    function render() {
      const q = search.value.trim().toLowerCase();
      let list = COURSES.filter((c) => {
        if (q) {
          const hay = [c.id, c.title, c.instructor, c.description, DEPARTMENTS[c.dept].name].join(" ").toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (fDept.value && c.dept !== fDept.value) return false;
        if (fLevel.value && String(c.level) !== fLevel.value) return false;
        if (fCredits.value && String(c.credits) !== fCredits.value) return false;
        if (fDays.value === "MWF" && !/[MWF]/.test(c.days)) return false;
        if (fDays.value === "TR" && !/[TR]/.test(c.days)) return false;
        if (fAvail.value === "open" && seatsLeft(c) === 0) return false;
        if (fAvail.value === "registered" && !isRegistered(c.id)) return false;
        return true;
      });

      const sorters = {
        code: (a, b) => a.id.localeCompare(b.id),
        title: (a, b) => a.title.localeCompare(b.title),
        credits: (a, b) => b.credits - a.credits || a.id.localeCompare(b.id),
        seats: (a, b) => seatsLeft(b) - seatsLeft(a)
      };
      list = list.slice().sort(sorters[sort.value] || sorters.code);

      count.textContent = `${list.length} course${list.length === 1 ? "" : "s"} found`;
      grid.innerHTML = list.length
        ? list.map(courseCard).join("")
        : `<div class="empty-state"><span aria-hidden="true">🔍</span><h3>No courses match your search</h3><p>Try a different keyword or clear the filters.</p></div>`;
    }

    [search, fDept, fLevel, fCredits, fDays, fAvail, sort].forEach((el) => {
      el.addEventListener(el === search ? "input" : "change", render);
    });
    $("#clear-filters").addEventListener("click", () => {
      search.value = "";
      [fDept, fLevel, fCredits, fDays, fAvail].forEach((el) => (el.value = ""));
      sort.value = "code";
      history.replaceState(null, "", "catalog.html");
      render();
    });

    render();
  }

  /* ---------- Registration page ---------- */
  function initRegister() {
    const form = $("#register-form");
    const student = getStudent();
    const courseSelect = $("#reg-course");
    const deptSelect = $("#reg-dept");
    const preview = $("#course-preview");
    const errorBox = $("#form-errors");

    $("#reg-term").textContent = TERM;
    $("#reg-name").value = student.firstName + " " + student.lastName;
    $("#reg-id").value = student.id;
    $("#reg-email").value = student.email;
    $("#reg-major").value = student.major;

    deptSelect.innerHTML = `<option value="">All departments</option>` +
      Object.entries(DEPARTMENTS).map(([k, d]) => `<option value="${k}">${esc(d.name)}</option>`).join("");

    function fillCourses(selected) {
      const list = COURSES.filter((c) => !deptSelect.value || c.dept === deptSelect.value);
      courseSelect.innerHTML = `<option value="">— Select a course —</option>` + list.map((c) => {
        const tag = isRegistered(c.id) ? " (registered)" : seatsLeft(c) === 0 ? " (full)" : "";
        return `<option value="${c.id}">${esc(c.id)} — ${esc(c.title)}${tag}</option>`;
      }).join("");
      if (selected && list.some((c) => c.id === selected)) courseSelect.value = selected;
      showPreview();
    }

    function showPreview() {
      const c = findCourse(courseSelect.value);
      if (!c) {
        preview.innerHTML = `<p class="muted">Choose a course to see its details here.</p>`;
        preview.style.removeProperty("--accent");
        return;
      }
      preview.style.setProperty("--accent", deptColor(c.dept));
      const conflict = conflictsWith(c);
      preview.innerHTML = `
        <span class="course-code">${esc(c.id)}</span>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.description)}</p>
        <dl class="detail-list">
          <dt>Instructor</dt><dd>${esc(c.instructor)}</dd>
          <dt>Schedule</dt><dd>${formatDays(c.days)} · ${esc(c.time)}</dd>
          <dt>Room</dt><dd>${esc(c.room)}</dd>
          <dt>Credits</dt><dd>${c.credits}</dd>
          <dt>Seats left</dt><dd>${seatsLeft(c)} / ${c.seats}</dd>
        </dl>
        ${conflict && !isRegistered(c.id) ? `<p class="warn">⚠️ Time conflict with ${esc(conflict.id)} (${esc(conflict.title)}).</p>` : ""}`;
    }

    function updateSummary() {
      const credits = totalCredits();
      $("#summary-courses").textContent = getRegistrations().length;
      $("#summary-credits").textContent = credits + " / " + MAX_CREDITS;
      const fill = $("#credit-fill");
      fill.style.width = Math.min((credits / MAX_CREDITS) * 100, 100) + "%";
      const list = $("#summary-list");
      const regs = registeredCourses();
      list.innerHTML = regs.length
        ? regs.map((c) => `<li style="--accent:${deptColor(c.dept)}"><strong>${esc(c.id)}</strong> ${esc(c.title)}<span>${c.credits} cr</span></li>`).join("")
        : `<li class="muted">No courses yet.</li>`;
    }

    function validate() {
      const errors = [];
      const c = findCourse(courseSelect.value);
      const email = $("#reg-email").value.trim();
      if (!$("#reg-name").value.trim()) errors.push("Please enter your full name.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address.");
      if (!c) errors.push("Please select a course.");
      else {
        if (isRegistered(c.id)) errors.push(`You are already registered for ${c.id}.`);
        else if (seatsLeft(c) === 0) errors.push(`${c.id} is full.`);
        else {
          if (totalCredits() + c.credits > MAX_CREDITS) errors.push(`Adding ${c.id} would exceed the ${MAX_CREDITS}-credit limit.`);
          const conflict = conflictsWith(c);
          if (conflict) errors.push(`${c.id} conflicts with ${conflict.id} on your schedule.`);
        }
      }
      if (!$("#reg-agree").checked) errors.push("Please accept the registration policy.");
      return errors;
    }

    deptSelect.addEventListener("change", () => fillCourses(courseSelect.value));
    courseSelect.addEventListener("change", showPreview);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errors = validate();
      if (errors.length) {
        errorBox.innerHTML = `<strong>Please fix the following:</strong><ul>${errors.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>`;
        errorBox.hidden = false;
        errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      errorBox.hidden = true;
      const c = findCourse(courseSelect.value);
      const grading = $("#reg-grading").value;
      const notes = $("#reg-notes").value.trim();

      openModal({
        title: "Confirm registration",
        icon: "📝",
        confirmText: "Yes, register me",
        body: `
          <p>Please review your registration for <strong>${TERM}</strong>:</p>
          <dl class="detail-list confirm-list">
            <dt>Student</dt><dd>${esc($("#reg-name").value.trim())} (${esc($("#reg-id").value)})</dd>
            <dt>Course</dt><dd>${esc(c.id)} — ${esc(c.title)}</dd>
            <dt>Schedule</dt><dd>${formatDays(c.days)} · ${esc(c.time)}</dd>
            <dt>Credits</dt><dd>${c.credits} (new total: ${totalCredits() + c.credits})</dd>
            <dt>Grading</dt><dd>${esc(grading)}</dd>
            ${notes ? `<dt>Notes</dt><dd>${esc(notes)}</dd>` : ""}
          </dl>`,
        onConfirm: () => {
          const regs = getRegistrations();
          regs.push({ id: c.id, grading: grading, notes: notes, date: new Date().toISOString() });
          setRegistrations(regs);

          const s = getStudent();
          s.email = $("#reg-email").value.trim();
          setStudent(s);

          updateNavBadge();
          updateSummary();
          fillCourses("");
          $("#reg-notes").value = "";
          $("#reg-agree").checked = false;
          history.replaceState(null, "", "register.html");

          setTimeout(() => openModal({
            title: "You're registered! 🎉",
            icon: "🎉",
            variant: "success",
            confirmText: "View my courses",
            cancelText: "Register another",
            body: `<p>You have been successfully registered for <strong>${esc(c.id)} — ${esc(c.title)}</strong>.</p>`,
            onConfirm: () => { window.location.href = "profile.html"; }
          }), 50);
        }
      });
    });

    form.addEventListener("reset", () => {
      setTimeout(() => {
        errorBox.hidden = true;
        $("#reg-name").value = student.firstName + " " + student.lastName;
        $("#reg-id").value = student.id;
        $("#reg-email").value = student.email;
        $("#reg-major").value = student.major;
        fillCourses("");
      }, 0);
    });

    const pre = new URLSearchParams(window.location.search).get("course");
    fillCourses(pre && findCourse(pre) ? pre : "");
    updateSummary();
  }

  /* ---------- Profile page ---------- */
  function initProfile() {
    let sortKey = "id";
    let sortDir = 1;

    function renderInfo() {
      const s = getStudent();
      $("#avatar").textContent = (s.firstName[0] || "") + (s.lastName[0] || "");
      $("#profile-name").textContent = s.firstName + " " + s.lastName;
      $("#profile-sub").textContent = `${s.major} · ${s.year}`;
      $("#profile-details").innerHTML = `
        <dt>Student ID</dt><dd>${esc(s.id)}</dd>
        <dt>Email</dt><dd>${esc(s.email)}</dd>
        <dt>Major</dt><dd>${esc(s.major)}</dd>
        <dt>Year</dt><dd>${esc(s.year)}</dd>
        <dt>Advisor</dt><dd>${esc(s.advisor)}</dd>
        <dt>GPA</dt><dd>${Number(s.gpa).toFixed(2)}</dd>`;
    }

    function renderStats() {
      const credits = totalCredits();
      $("#profile-stats").innerHTML = `
        <div class="stat stat-1"><strong>${getRegistrations().length}</strong><span>Courses</span></div>
        <div class="stat stat-2"><strong>${credits}</strong><span>Credits</span></div>
        <div class="stat stat-3"><strong>${MAX_CREDITS - credits}</strong><span>Credits available</span></div>
        <div class="stat stat-4"><strong>${TERM}</strong><span>Term</span></div>`;
    }

    function renderTable() {
      const tbody = $("#reg-table tbody");
      const rows = registeredCourses().sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey];
        return (typeof va === "number" ? va - vb : String(va).localeCompare(String(vb))) * sortDir;
      });
      $$("#reg-table th[data-sort]").forEach((th) => {
        th.setAttribute("aria-sort", th.dataset.sort === sortKey ? (sortDir === 1 ? "ascending" : "descending") : "none");
      });
      $("#table-empty").hidden = rows.length > 0;
      $("#reg-table").hidden = rows.length === 0;
      tbody.innerHTML = rows.map((c) => `
        <tr>
          <td data-label="Code"><span class="dot" style="background:${deptColor(c.dept)}"></span><strong>${esc(c.id)}</strong></td>
          <td data-label="Title">${esc(c.title)}</td>
          <td data-label="Instructor">${esc(c.instructor)}</td>
          <td data-label="Schedule">${formatDays(c.days)}<br><small>${esc(c.time)}</small></td>
          <td data-label="Room">${esc(c.room)}</td>
          <td data-label="Credits">${c.credits}</td>
          <td data-label="Grading">${esc(c.reg.grading || "Letter grade")}</td>
          <td data-label="Action"><button class="btn btn-danger btn-sm" data-drop="${esc(c.id)}">Drop</button></td>
        </tr>`).join("");
      $("#table-total").textContent = totalCredits();
    }

    function renderAll() {
      renderInfo();
      renderStats();
      renderTable();
      updateNavBadge();
    }

    $("#reg-table tbody").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-drop]");
      if (!btn) return;
      const c = findCourse(btn.dataset.drop);
      openModal({
        title: "Drop course?",
        icon: "⚠️",
        variant: "danger",
        confirmText: "Drop course",
        body: `<p>Are you sure you want to drop <strong>${esc(c.id)} — ${esc(c.title)}</strong>? Your seat may be given to another student.</p>`,
        onConfirm: () => {
          setRegistrations(getRegistrations().filter((r) => r.id !== c.id));
          renderAll();
          toast(`${c.id} was dropped.`, "danger");
        }
      });
    });

    $$("#reg-table th[data-sort]").forEach((th) => {
      const activate = () => {
        if (sortKey === th.dataset.sort) sortDir = -sortDir;
        else { sortKey = th.dataset.sort; sortDir = 1; }
        renderTable();
      };
      th.addEventListener("click", activate);
      th.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } });
    });

    // Edit profile
    const editForm = $("#edit-form");
    const editBtn = $("#edit-btn");
    editBtn.addEventListener("click", () => {
      const s = getStudent();
      $("#edit-first").value = s.firstName;
      $("#edit-last").value = s.lastName;
      $("#edit-email").value = s.email;
      $("#edit-major").value = s.major;
      $("#edit-year").value = s.year;
      editForm.hidden = false;
      $("#profile-details").hidden = true;
      editBtn.hidden = true;
      $("#edit-first").focus();
    });
    function closeEdit() {
      editForm.hidden = true;
      $("#profile-details").hidden = false;
      editBtn.hidden = false;
    }
    $("#edit-cancel").addEventListener("click", closeEdit);
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#edit-email").value.trim();
      if (!$("#edit-first").value.trim() || !$("#edit-last").value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast("Please enter a name and a valid email.", "danger");
        return;
      }
      const s = getStudent();
      s.firstName = $("#edit-first").value.trim();
      s.lastName = $("#edit-last").value.trim();
      s.email = email;
      s.major = $("#edit-major").value.trim() || s.major;
      s.year = $("#edit-year").value;
      setStudent(s);
      closeEdit();
      renderInfo();
      toast("Profile updated.", "success");
    });

    $("#drop-all").addEventListener("click", () => {
      if (!getRegistrations().length) { toast("You have no courses to drop."); return; }
      openModal({
        title: "Drop all courses?",
        icon: "🗑️",
        variant: "danger",
        confirmText: "Drop all",
        body: `<p>This will remove all ${getRegistrations().length} registered courses for ${TERM}.</p>`,
        onConfirm: () => {
          setRegistrations([]);
          renderAll();
          toast("All courses dropped.", "danger");
        }
      });
    });

    renderAll();
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initModal();
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
    const pages = { home: initHome, catalog: initCatalog, register: initRegister, profile: initProfile };
    const init = pages[document.body.dataset.page];
    if (init) init();
  });
})();
