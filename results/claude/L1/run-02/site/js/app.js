/* UniReg — shared logic plus per-page controllers (selected via <body data-page>). */
(() => {
  "use strict";

  const MAX_CREDITS = 18;
  const STORAGE_KEYS = { regs: "unireg.registrations", profile: "unireg.profile" };
  const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const DEFAULT_PROFILE = {
    name: "Jordan Rivera",
    studentId: "S2026-0417",
    email: "jordan.rivera@uni.edu",
    major: "Computer Science",
    year: "Sophomore",
    phone: "",
    advisor: "Dr. Priya Nair",
  };

  /* ---------- Utilities ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const escapeHTML = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const formatTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
  };

  const scheduleText = (c) => `${c.days.join("/")} · ${formatTime(c.start)}–${formatTime(c.end)}`;
  const findCourse = (id) => COURSES.find((c) => c.id === id);
  const deptOf = (c) => DEPARTMENTS[c.dept];

  /* ---------- Storage ---------- */
  const readJSON = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };
  const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const getRegistrations = () => readJSON(STORAGE_KEYS.regs, []).filter((r) => findCourse(r.id));
  const saveRegistrations = (regs) => writeJSON(STORAGE_KEYS.regs, regs);
  const getProfile = () => ({ ...DEFAULT_PROFILE, ...readJSON(STORAGE_KEYS.profile, {}) });
  const saveProfile = (p) => writeJSON(STORAGE_KEYS.profile, p);

  const isRegistered = (id) => getRegistrations().some((r) => r.id === id);
  const registeredCourses = () => getRegistrations().map((r) => ({ ...findCourse(r.id), registeredAt: r.registeredAt }));
  const totalCredits = (courses = registeredCourses()) => courses.reduce((sum, c) => sum + c.credits, 0);

  const enrolledCount = (c) => c.enrolled + (isRegistered(c.id) ? 1 : 0);
  const seatsLeft = (c) => Math.max(0, c.seats - enrolledCount(c));

  const coursesOverlap = (a, b) =>
    a.days.some((d) => b.days.includes(d)) &&
    toMinutes(a.start) < toMinutes(b.end) &&
    toMinutes(b.start) < toMinutes(a.end);

  /** Validates adding `ids` on top of current registrations. Returns a list of error strings. */
  const validateSelection = (ids) => {
    const errors = [];
    const current = registeredCourses();
    const incoming = ids.map(findCourse);

    incoming.forEach((c) => {
      if (isRegistered(c.id)) errors.push(`You are already registered for ${c.id}.`);
      else if (seatsLeft(c) === 0) errors.push(`${c.id} is full.`);
    });

    const all = [...current, ...incoming.filter((c) => !isRegistered(c.id))];
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        if (coursesOverlap(all[i], all[j])) {
          errors.push(`Schedule conflict: ${all[i].id} and ${all[j].id} overlap (${all[i].days.filter((d) => all[j].days.includes(d)).join("/")}).`);
        }
      }
    }

    const credits = totalCredits(all);
    if (credits > MAX_CREDITS) errors.push(`Total credits (${credits}) would exceed the ${MAX_CREDITS}-credit limit.`);
    return errors;
  };

  const addRegistrations = (ids) => {
    const regs = getRegistrations();
    const now = new Date().toISOString();
    ids.forEach((id) => regs.push({ id, registeredAt: now }));
    saveRegistrations(regs);
    updateNavBadge();
  };

  const dropRegistration = (id) => {
    saveRegistrations(getRegistrations().filter((r) => r.id !== id));
    updateNavBadge();
  };

  /* ---------- Layout: navbar + footer ---------- */
  const NAV_LINKS = [
    { href: "index.html", label: "Home", page: "home", icon: "🏠" },
    { href: "catalog.html", label: "Course Catalog", page: "catalog", icon: "📖" },
    { href: "register.html", label: "Registration", page: "register", icon: "📝" },
    { href: "profile.html", label: "My Profile", page: "profile", icon: "👤" },
  ];

  const renderLayout = (page) => {
    const header = document.createElement("header");
    header.className = "navbar";
    header.innerHTML = `
      <div class="container nav-inner">
        <a class="brand" href="index.html" aria-label="UniReg home">
          <span class="brand-logo">🎓</span><span class="brand-text">Uni<strong>Reg</strong></span>
        </a>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-menu">
          <span></span><span></span><span></span>
        </button>
        <nav id="nav-menu" class="nav-menu">
          ${NAV_LINKS.map((l) => `
            <a href="${l.href}" class="nav-link ${l.page === page ? "active" : ""}" ${l.page === page ? 'aria-current="page"' : ""}>
              <span aria-hidden="true">${l.icon}</span> ${l.label}
              ${l.page === "register" ? '<span class="nav-badge" id="nav-badge" hidden>0</span>' : ""}
            </a>`).join("")}
        </nav>
      </div>`;
    document.body.prepend(header);

    const toggle = $(".nav-toggle", header);
    const menu = $(".nav-menu", header);
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    const footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML = `
      <div class="container footer-inner">
        <p>🎓 <strong>UniReg</strong> — Fall 2026 Course Registration</p>
        <p class="muted">Registration closes Nov 30, 2026 · Need help? <a href="mailto:registrar@uni.edu">registrar@uni.edu</a></p>
      </div>`;
    document.body.append(footer);

    updateNavBadge();
  };

  const updateNavBadge = () => {
    const badge = $("#nav-badge");
    if (!badge) return;
    const count = getRegistrations().length;
    badge.textContent = count;
    badge.hidden = count === 0;
  };

  /* ---------- Toasts ---------- */
  const toast = (message, type = "success") => {
    let stack = $(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("aria-live", "polite");
      document.body.append(stack);
    }
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.textContent = message;
    stack.append(el);
    setTimeout(() => el.classList.add("hide"), 2800);
    setTimeout(() => el.remove(), 3200);
  };

  /* ---------- Modal ---------- */
  let lastFocused = null;
  let hideTimer = null;

  const ensureModal = () => {
    let overlay = $("#modal");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "modal";
    overlay.className = "modal-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <h2 id="modal-title"></h2>
          <button class="modal-close" aria-label="Close dialog">&times;</button>
        </div>
        <div class="modal-body"></div>
        <div class="modal-footer"></div>
      </div>`;
    document.body.append(overlay);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
    $(".modal-close", overlay).addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) closeModal(); });
    return overlay;
  };

  /**
   * Opens the shared modal.
   * buttons: [{ label, className, onClick }] — onClick returning false keeps the modal open.
   */
  const openModal = ({ title, body, buttons = [], variant = "" }) => {
    const overlay = ensureModal();
    clearTimeout(hideTimer);
    if (overlay.hidden) lastFocused = document.activeElement;
    $(".modal", overlay).className = `modal ${variant}`;
    $("#modal-title", overlay).innerHTML = title;
    $(".modal-body", overlay).innerHTML = body;
    const footer = $(".modal-footer", overlay);
    footer.innerHTML = "";
    (buttons.length ? buttons : [{ label: "Close", className: "btn btn-primary" }]).forEach((b) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = b.className || "btn";
      btn.textContent = b.label;
      btn.addEventListener("click", () => {
        if (b.onClick && b.onClick() === false) return;
        closeModal();
      });
      footer.append(btn);
    });
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("show"));
    document.body.classList.add("no-scroll");
    footer.lastElementChild?.focus();
  };

  const closeModal = () => {
    const overlay = $("#modal");
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
    hideTimer = setTimeout(() => { overlay.hidden = true; }, 200);
    lastFocused?.focus?.();
  };

  /* ---------- Shared components ---------- */
  const seatBadge = (c) => {
    const left = seatsLeft(c);
    const cls = left === 0 ? "full" : left <= 5 ? "low" : "ok";
    const text = left === 0 ? "Full" : `${left} seat${left === 1 ? "" : "s"} left`;
    return `<span class="seat-badge ${cls}">${text}</span>`;
  };

  const courseCardHTML = (c) => {
    const d = deptOf(c);
    const registered = isRegistered(c.id);
    const full = seatsLeft(c) === 0;
    const pct = Math.min(100, Math.round((enrolledCount(c) / c.seats) * 100));
    return `
      <article class="course-card" style="--dept:${d.color}" data-id="${c.id}">
        <div class="card-top">
          <span class="dept-chip">${d.icon} ${d.name}</span>
          <span class="credit-chip">${c.credits} cr</span>
        </div>
        <h3 class="card-title"><span class="course-code">${c.id}</span> ${escapeHTML(c.title)}</h3>
        <p class="card-desc">${escapeHTML(c.description)}</p>
        <ul class="card-meta">
          <li>👩‍🏫 ${escapeHTML(c.instructor)}</li>
          <li>🗓️ ${scheduleText(c)}</li>
          <li>📍 ${c.room} · Level ${c.level}</li>
        </ul>
        <div class="capacity">
          <div class="capacity-bar"><span style="width:${pct}%"></span></div>
          ${seatBadge(c)}
        </div>
        <div class="card-actions">
          <button class="btn btn-ghost" data-action="details" data-id="${c.id}">Details</button>
          ${registered
            ? `<button class="btn btn-success" disabled>✓ Registered</button>`
            : `<button class="btn btn-primary" data-action="register" data-id="${c.id}" ${full ? "disabled" : ""}>${full ? "Full" : "Register"}</button>`}
        </div>
      </article>`;
  };

  const courseDetailsHTML = (c) => {
    const d = deptOf(c);
    return `
      <div class="details" style="--dept:${d.color}">
        <span class="dept-chip">${d.icon} ${d.name}</span>
        <p>${escapeHTML(c.description)}</p>
        <dl class="details-grid">
          <dt>Instructor</dt><dd>${escapeHTML(c.instructor)}</dd>
          <dt>Schedule</dt><dd>${scheduleText(c)}</dd>
          <dt>Room</dt><dd>${c.room}</dd>
          <dt>Credits</dt><dd>${c.credits}</dd>
          <dt>Level</dt><dd>${c.level}</dd>
          <dt>Enrollment</dt><dd>${enrolledCount(c)} / ${c.seats} ${seatBadge(c)}</dd>
        </dl>
      </div>`;
  };

  /** Shows the confirmation modal for registering `ids`; calls onDone after a successful save. */
  const confirmRegistration = (ids, onDone) => {
    const errors = validateSelection(ids);
    if (errors.length) {
      openModal({
        title: "⚠️ Unable to register",
        variant: "modal-error",
        body: `<p>Please resolve the following:</p><ul class="error-list">${errors.map((e) => `<li>${escapeHTML(e)}</li>`).join("")}</ul>`,
      });
      return;
    }
    const courses = ids.map(findCourse);
    const newTotal = totalCredits() + totalCredits(courses);
    openModal({
      title: "✅ Confirm Registration",
      body: `
        <p>You are about to register for the following course${courses.length > 1 ? "s" : ""}:</p>
        <ul class="confirm-list">
          ${courses.map((c) => `
            <li style="--dept:${deptOf(c).color}">
              <strong>${c.id}</strong> — ${escapeHTML(c.title)}
              <small>${scheduleText(c)} · ${c.credits} credits</small>
            </li>`).join("")}
        </ul>
        <div class="confirm-total">
          <span>Credits after registration</span>
          <strong>${newTotal} / ${MAX_CREDITS}</strong>
        </div>`,
      buttons: [
        { label: "Cancel", className: "btn btn-ghost" },
        {
          label: "Confirm Registration",
          className: "btn btn-primary",
          onClick: () => {
            addRegistrations(ids);
            toast(`🎉 Registered for ${ids.join(", ")}`);
            onDone?.();
          },
        },
      ],
    });
  };

  const confirmDrop = (id, onDone) => {
    const c = findCourse(id);
    openModal({
      title: "Drop course?",
      variant: "modal-error",
      body: `<p>Are you sure you want to drop <strong>${c.id} — ${escapeHTML(c.title)}</strong>? Your seat will be released.</p>`,
      buttons: [
        { label: "Keep Course", className: "btn btn-ghost" },
        {
          label: "Drop Course",
          className: "btn btn-danger",
          onClick: () => {
            dropRegistration(id);
            toast(`${id} dropped`, "warn");
            onDone?.();
          },
        },
      ],
    });
  };

  /** Renders the registered-courses data table into `container`. */
  const renderRegisteredTable = (container, onChange) => {
    const courses = registeredCourses();
    if (!courses.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <p>You haven't registered for any courses yet.</p>
          <a href="catalog.html" class="btn btn-primary">Browse Catalog</a>
        </div>`;
      return;
    }
    container.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Code</th><th scope="col">Course</th><th scope="col">Instructor</th>
              <th scope="col">Schedule</th><th scope="col">Room</th><th scope="col">Credits</th>
              <th scope="col">Registered</th><th scope="col"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            ${courses.map((c) => `
              <tr style="--dept:${deptOf(c).color}">
                <td data-label="Code"><span class="code-pill">${c.id}</span></td>
                <td data-label="Course">${escapeHTML(c.title)}</td>
                <td data-label="Instructor">${escapeHTML(c.instructor)}</td>
                <td data-label="Schedule">${scheduleText(c)}</td>
                <td data-label="Room">${c.room}</td>
                <td data-label="Credits">${c.credits}</td>
                <td data-label="Registered">${new Date(c.registeredAt).toLocaleDateString()}</td>
                <td data-label="Actions"><button class="btn btn-danger btn-sm" data-drop="${c.id}">Drop</button></td>
              </tr>`).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5">Total (${courses.length} course${courses.length > 1 ? "s" : ""})</td>
              <td colspan="3"><strong>${totalCredits(courses)}</strong> / ${MAX_CREDITS} credits</td>
            </tr>
          </tfoot>
        </table>
      </div>`;
    $$("[data-drop]", container).forEach((btn) =>
      btn.addEventListener("click", () => confirmDrop(btn.dataset.drop, onChange))
    );
  };

  /** Wires Details / Register buttons inside a course-card grid via event delegation. */
  const bindCardActions = (grid, rerender) => {
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const c = findCourse(btn.dataset.id);
      if (btn.dataset.action === "details") {
        openModal({
          title: `${c.id} · ${escapeHTML(c.title)}`,
          body: courseDetailsHTML(c),
          buttons: [
            { label: "Close", className: "btn btn-ghost" },
            ...(!isRegistered(c.id) && seatsLeft(c) > 0
              ? [{ label: "Register", className: "btn btn-primary", onClick: () => { setTimeout(() => confirmRegistration([c.id], rerender)); } }]
              : []),
          ],
        });
      } else if (btn.dataset.action === "register") {
        confirmRegistration([c.id], rerender);
      }
    });
  };

  const populateDeptSelect = (select) => {
    Object.entries(DEPARTMENTS).forEach(([code, d]) => {
      select.insertAdjacentHTML("beforeend", `<option value="${code}">${d.icon} ${d.name}</option>`);
    });
  };

  const animateCount = (el, target) => {
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Page: Home ---------- */
  const initHome = () => {
    const profile = getProfile();
    $("#welcome-name").textContent = profile.name.split(" ")[0];

    $("#hero-search").addEventListener("submit", (e) => {
      e.preventDefault();
      const q = $("#hero-query").value.trim();
      location.href = `catalog.html${q ? `?q=${encodeURIComponent(q)}` : ""}`;
    });

    const stats = {
      "stat-courses": COURSES.length,
      "stat-depts": Object.keys(DEPARTMENTS).length,
      "stat-seats": COURSES.reduce((s, c) => s + seatsLeft(c), 0),
      "stat-mine": getRegistrations().length,
    };
    Object.entries(stats).forEach(([id, val]) => animateCount($(`#${id}`), val));

    $("#dept-grid").innerHTML = Object.entries(DEPARTMENTS).map(([code, d]) => {
      const count = COURSES.filter((c) => c.dept === code).length;
      return `
        <a class="dept-tile" href="catalog.html?dept=${code}" style="--dept:${d.color}">
          <span class="dept-icon">${d.icon}</span>
          <span class="dept-name">${d.name}</span>
          <span class="dept-count">${count} course${count > 1 ? "s" : ""}</span>
        </a>`;
    }).join("");

    const renderFeatured = () => {
      const featured = [...COURSES].filter((c) => seatsLeft(c) > 0).sort((a, b) => seatsLeft(b) - seatsLeft(a)).slice(0, 3);
      $("#featured-grid").innerHTML = featured.map(courseCardHTML).join("");
      $("#stat-mine").textContent = getRegistrations().length;
    };
    renderFeatured();
    bindCardActions($("#featured-grid"), renderFeatured);
  };

  /* ---------- Page: Catalog ---------- */
  const initCatalog = () => {
    const els = {
      search: $("#search"),
      dept: $("#filter-dept"),
      level: $("#filter-level"),
      credits: $("#filter-credits"),
      day: $("#filter-day"),
      sort: $("#sort"),
      openOnly: $("#filter-open"),
      grid: $("#course-grid"),
      count: $("#result-count"),
      reset: $("#reset-filters"),
      chips: $("#active-filters"),
    };
    populateDeptSelect(els.dept);

    const params = new URLSearchParams(location.search);
    if (params.get("q")) els.search.value = params.get("q");
    if (params.get("dept") && DEPARTMENTS[params.get("dept")]) els.dept.value = params.get("dept");

    const sorters = {
      code: (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }),
      title: (a, b) => a.title.localeCompare(b.title),
      creditsDesc: (a, b) => b.credits - a.credits,
      seats: (a, b) => seatsLeft(b) - seatsLeft(a),
    };

    const render = () => {
      const q = els.search.value.trim().toLowerCase();
      const filtered = COURSES.filter((c) => {
        const haystack = `${c.id} ${c.title} ${c.instructor} ${c.description} ${deptOf(c).name}`.toLowerCase();
        return (!q || haystack.includes(q)) &&
          (!els.dept.value || c.dept === els.dept.value) &&
          (!els.level.value || c.level === Number(els.level.value)) &&
          (!els.credits.value || c.credits === Number(els.credits.value)) &&
          (!els.day.value || c.days.includes(els.day.value)) &&
          (!els.openOnly.checked || seatsLeft(c) > 0);
      }).sort(sorters[els.sort.value]);

      els.count.textContent = `${filtered.length} course${filtered.length === 1 ? "" : "s"} found`;
      els.grid.innerHTML = filtered.length
        ? filtered.map(courseCardHTML).join("")
        : `<div class="empty-state wide"><div class="empty-icon">🔍</div><p>No courses match your search. Try adjusting the filters.</p></div>`;

      const active = [
        q && `Search: “${escapeHTML(els.search.value.trim())}”`,
        els.dept.value && DEPARTMENTS[els.dept.value].name,
        els.level.value && `${els.level.value}-level`,
        els.credits.value && `${els.credits.value} credits`,
        els.day.value && `Meets ${els.day.value}`,
        els.openOnly.checked && "Open seats only",
      ].filter(Boolean);
      els.chips.innerHTML = active.map((a) => `<span class="filter-chip">${a}</span>`).join("");
    };

    let debounce;
    els.search.addEventListener("input", () => { clearTimeout(debounce); debounce = setTimeout(render, 150); });
    [els.dept, els.level, els.credits, els.day, els.sort, els.openOnly].forEach((el) => el.addEventListener("change", render));
    $("#catalog-search").addEventListener("submit", (e) => { e.preventDefault(); render(); });
    els.reset.addEventListener("click", () => {
      $("#catalog-search").reset();
      els.sort.value = "code";
      history.replaceState(null, "", location.pathname);
      render();
    });

    bindCardActions(els.grid, render);
    render();
  };

  /* ---------- Page: Registration ---------- */
  const initRegister = () => {
    const form = $("#register-form");
    const list = $("#course-options");
    const deptFilter = $("#reg-dept");
    const searchBox = $("#reg-search");
    const summary = $("#selection-summary");
    const tableContainer = $("#registered-table");
    populateDeptSelect(deptFilter);

    const profile = getProfile();
    ["name", "studentId", "email", "major", "year"].forEach((k) => {
      if (form.elements[k]) form.elements[k].value = profile[k] || "";
    });

    const preselect = new Set();
    const pre = new URLSearchParams(location.search).get("course");
    if (pre && findCourse(pre)) preselect.add(pre);

    const selectedIds = () => $$('input[name="courses"]:checked', list).map((i) => i.value);

    const renderOptions = () => {
      const keep = new Set([...selectedIds(), ...preselect]);
      preselect.clear();
      const q = searchBox.value.trim().toLowerCase();
      const options = COURSES.filter((c) =>
        (!deptFilter.value || c.dept === deptFilter.value) &&
        (!q || `${c.id} ${c.title} ${c.instructor}`.toLowerCase().includes(q))
      );
      // Keep checked courses visible even if they no longer match the filter.
      const visible = [...options, ...COURSES.filter((c) => keep.has(c.id) && !options.includes(c))];
      list.innerHTML = visible.length ? visible.map((c) => {
        const registered = isRegistered(c.id);
        const full = seatsLeft(c) === 0;
        const disabled = registered || full;
        return `
          <label class="course-option ${disabled ? "disabled" : ""}" style="--dept:${deptOf(c).color}">
            <input type="checkbox" name="courses" value="${c.id}" ${disabled ? "disabled" : ""} ${keep.has(c.id) && !disabled ? "checked" : ""}>
            <span class="option-body">
              <span class="option-title"><strong>${c.id}</strong> ${escapeHTML(c.title)}</span>
              <span class="option-meta">${scheduleText(c)} · ${c.credits} cr · ${escapeHTML(c.instructor)}</span>
            </span>
            ${registered ? '<span class="seat-badge ok">Registered</span>' : seatBadge(c)}
          </label>`;
      }).join("") : `<p class="muted center">No courses match.</p>`;
      updateSummary();
    };

    const updateSummary = () => {
      const ids = selectedIds();
      const selCredits = totalCredits(ids.map(findCourse));
      const current = totalCredits();
      const total = current + selCredits;
      const pct = Math.min(100, (total / MAX_CREDITS) * 100);
      const over = total > MAX_CREDITS;
      const warnings = ids.length ? validateSelection(ids) : [];
      summary.innerHTML = `
        <div class="summary-row"><span>Selected</span><strong>${ids.length} course${ids.length === 1 ? "" : "s"} · ${selCredits} cr</strong></div>
        <div class="summary-row"><span>Already registered</span><strong>${current} cr</strong></div>
        <div class="credit-meter ${over ? "over" : ""}" role="progressbar" aria-valuemin="0" aria-valuemax="${MAX_CREDITS}" aria-valuenow="${total}">
          <span style="width:${pct}%"></span>
        </div>
        <div class="summary-row total"><span>Total</span><strong>${total} / ${MAX_CREDITS} credits</strong></div>
        ${warnings.length ? `<ul class="warning-list">${warnings.map((w) => `<li>⚠️ ${escapeHTML(w)}</li>`).join("")}</ul>` : ""}`;
    };

    list.addEventListener("change", updateSummary);
    deptFilter.addEventListener("change", renderOptions);
    searchBox.addEventListener("input", renderOptions);

    const setError = (input, msg) => {
      const field = input.closest(".field");
      field.classList.toggle("invalid", Boolean(msg));
      $(".field-error", field).textContent = msg || "";
    };

    const validators = {
      name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
      studentId: (v) => (/^S\d{4}-\d{4}$/i.test(v.trim()) ? "" : "Format: S2026-0417"),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address."),
      major: (v) => (v ? "" : "Select your major."),
      year: (v) => (v ? "" : "Select your academic year."),
      term: (v) => (v ? "" : "Select a term."),
    };

    Object.keys(validators).forEach((k) => {
      form.elements[k].addEventListener("blur", (e) => setError(e.target, validators[k](e.target.value)));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      Object.entries(validators).forEach(([k, fn]) => {
        const msg = fn(form.elements[k].value);
        setError(form.elements[k], msg);
        if (msg) valid = false;
      });
      const ids = selectedIds();
      const courseErr = $("#courses-error");
      courseErr.textContent = ids.length ? "" : "Select at least one course.";
      if (!ids.length) valid = false;
      if (!form.elements.agree.checked) {
        $("#agree-error").textContent = "You must accept the registration policy.";
        valid = false;
      } else {
        $("#agree-error").textContent = "";
      }
      if (!valid) {
        toast("Please fix the highlighted fields", "error");
        form.querySelector(".invalid input, .invalid select")?.focus();
        return;
      }

      // Persist student details so the profile stays in sync.
      saveProfile({
        ...getProfile(),
        name: form.elements.name.value.trim(),
        studentId: form.elements.studentId.value.trim().toUpperCase(),
        email: form.elements.email.value.trim(),
        major: form.elements.major.value,
        year: form.elements.year.value,
      });

      confirmRegistration(ids, () => {
        $$('input[name="courses"]', list).forEach((i) => (i.checked = false));
        form.elements.agree.checked = false;
        refresh();
        tableContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    form.addEventListener("reset", () => setTimeout(() => {
      $$(".field.invalid", form).forEach((f) => f.classList.remove("invalid"));
      $$(".field-error", form).forEach((f) => (f.textContent = ""));
      renderOptions();
    }));

    const refresh = () => {
      renderOptions();
      renderRegisteredTable(tableContainer, refresh);
    };
    refresh();
  };

  /* ---------- Page: Profile ---------- */
  const initProfile = () => {
    const form = $("#profile-form");

    const renderCard = () => {
      const p = getProfile();
      const courses = registeredCourses();
      const credits = totalCredits(courses);
      const initials = p.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      $("#profile-card").innerHTML = `
        <div class="avatar">${escapeHTML(initials)}</div>
        <h2>${escapeHTML(p.name)}</h2>
        <p class="muted">${escapeHTML(p.major)} · ${escapeHTML(p.year)}</p>
        <ul class="profile-info">
          <li><span>🆔 Student ID</span><strong>${escapeHTML(p.studentId)}</strong></li>
          <li><span>✉️ Email</span><strong>${escapeHTML(p.email)}</strong></li>
          <li><span>📞 Phone</span><strong>${escapeHTML(p.phone || "—")}</strong></li>
          <li><span>🧑‍🏫 Advisor</span><strong>${escapeHTML(p.advisor || "—")}</strong></li>
        </ul>`;
      $("#p-courses").textContent = courses.length;
      $("#p-credits").textContent = credits;
      $("#p-remaining").textContent = Math.max(0, MAX_CREDITS - credits);
      $("#p-status").textContent = credits >= 12 ? "Full-time" : credits > 0 ? "Part-time" : "Not enrolled";
    };

    const renderSchedule = () => {
      const courses = registeredCourses();
      $("#weekly-schedule").innerHTML = DAY_ORDER.map((day) => {
        const items = courses.filter((c) => c.days.includes(day)).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
        return `
          <div class="day-col">
            <h4>${day}</h4>
            ${items.length ? items.map((c) => `
              <div class="slot" style="--dept:${deptOf(c).color}">
                <strong>${c.id}</strong>
                <span>${formatTime(c.start)} – ${formatTime(c.end)}</span>
                <small>${c.room}</small>
              </div>`).join("") : `<p class="slot-empty">Free day 🎉</p>`}
          </div>`;
      }).join("");
    };

    const fillForm = () => {
      const p = getProfile();
      Object.keys(DEFAULT_PROFILE).forEach((k) => { if (form.elements[k]) form.elements[k].value = p[k] || ""; });
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        toast("Name and a valid email are required", "error");
        return;
      }
      Object.keys(data).forEach((k) => (data[k] = data[k].trim()));
      saveProfile({ ...getProfile(), ...data });
      renderCard();
      toast("Profile updated ✨");
    });
    form.addEventListener("reset", (e) => { e.preventDefault(); fillForm(); });

    const refresh = () => {
      renderCard();
      renderSchedule();
      renderRegisteredTable($("#profile-table"), refresh);
    };
    fillForm();
    refresh();
  };

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    renderLayout(page);
    ({ home: initHome, catalog: initCatalog, register: initRegister, profile: initProfile }[page] || (() => {}))();
  });
})();
