/* Halden University — Course Registration (Spring 2027), accessible edition
   Plain JavaScript single-page app: hash routing with focus management,
   catalog filters with live result announcements, a validated registration form
   with an error summary, an accessible confirmation dialog, and a sortable table. */

(function () {
  "use strict";

  // ---------------- Data ----------------
  const DEPTS = {
    CSE:  { name: "Computer Science & Engineering", color: "var(--cse)" },
    MATH: { name: "Mathematics",                    color: "var(--math)" },
    COGS: { name: "Cognitive Science",              color: "var(--cogs)" },
    PHYS: { name: "Physics",                        color: "var(--phys)" },
    MUS:  { name: "Music",                          color: "var(--mus)", darkInk: true },
    LIT:  { name: "Literature",                     color: "var(--lit)" },
    BIO:  { name: "Biological Sciences",            color: "var(--bio)" },
    ECON: { name: "Economics",                      color: "var(--econ)" }
  };

  const MAX_UNITS = 20;
  const DAY_ORDER = ["M", "Tu", "W", "Th", "F"];
  const DAY_SHORT = { M: "Mon", Tu: "Tue", W: "Wed", Th: "Thu", F: "Fri" };
  const DAY_LONG = { M: "Monday", Tu: "Tuesday", W: "Wednesday", Th: "Thursday", F: "Friday" };

  const c = (id, dept, num, title, level, units, instructor, days, start, end, room, cap, enrolled, desc) =>
    ({ id, dept, num, code: dept + " " + num, title, level, units, instructor, days, start: toMin(start), end: toMin(end), room, cap, enrolled, desc });

  const COURSES = [
    c(1, "CSE", "110", "Software Engineering", "Upper Division", 4, "Prof. Dana Whitlock", ["M","W","F"], "10:00", "10:50", "CSE 1202", 180, 164,
      "Team-based software development: requirements, agile process, testing, code review and continuous integration on a quarter-long project."),
    c(2, "CSE", "151A", "Machine Learning: Learning Algorithms", "Upper Division", 4, "Prof. Amir Haddad", ["Tu","Th"], "11:00", "12:20", "Center 109", 150, 150,
      "Supervised learning foundations: linear models, kernels, decision trees, ensembles and an introduction to neural networks."),
    c(3, "CSE", "202", "Algorithm Design and Analysis", "Graduate", 4, "Prof. Lena Ostrova", ["Tu","Th"], "14:00", "15:20", "WLH 2005", 80, 61,
      "Graduate algorithms: greedy methods, dynamic programming, network flow, randomization, approximation and NP-completeness."),
    c(4, "CSE", "12", "Basic Data Structures", "Lower Division", 4, "Prof. Marcus Bell", ["M","W","F"], "13:00", "13:50", "Peterson 108", 300, 288,
      "Lists, stacks, queues, trees, heaps and hash tables, with analysis of running time and memory in Java."),
    c(5, "CSE", "291", "Topics: Efficient ML Systems", "Graduate", 4, "Prof. Kiran Desai", ["M","W"], "16:00", "17:20", "CSE 4140", 60, 47,
      "Model compression, quantization, pruning and serving at scale. Weekly paper discussions and a systems project."),
    c(6, "CSE", "87", "Freshman Seminar: Computing and Society", "Lower Division", 1, "Dr. Ruth Abernathy", ["F"], "15:00", "15:50", "CSE 2154", 20, 12,
      "Small-group seminar on how software shapes privacy, labor and public life. Pass/No Pass only."),
    c(7, "MATH", "20C", "Calculus and Analytic Geometry", "Lower Division", 4, "Dr. Priya Nair", ["M","W","F"], "08:00", "08:50", "York 2722", 250, 201,
      "Vector geometry, vector functions, partial derivatives and multiple integrals."),
    c(8, "MATH", "180A", "Introduction to Probability", "Upper Division", 4, "Dr. Tomás Ruiz", ["Tu","Th"], "09:30", "10:50", "APM 2402", 120, 97,
      "Probability spaces, random variables, expectation, limit theorems and common discrete and continuous distributions."),
    c(9, "COGS", "108", "Data Science in Practice", "Upper Division", 4, "Dr. Hannah Cole", ["M","W","F"], "11:00", "11:50", "Ledden Auditorium", 200, 198,
      "End-to-end data projects in Python: wrangling, visualization, inference and the ethics of working with real data."),
    c(10, "COGS", "120", "Interaction Design", "Upper Division", 4, "Dr. Yuki Tanaka", ["Tu","Th"], "12:30", "13:50", "CSB 001", 90, 72,
      "Needfinding, prototyping and evaluation of interfaces through studio critique and iterative team projects."),
    c(11, "PHYS", "2A", "Mechanics", "Lower Division", 4, "Prof. Eli Strand", ["M","W","F"], "09:00", "09:50", "Galbraith 242", 220, 150,
      "Calculus-based kinematics, Newton's laws, energy, momentum and rotational motion."),
    c(12, "PHYS", "1AL", "Mechanics Laboratory", "Lower Division", 2, "Dr. Felix Moreau", ["Tu"], "14:00", "15:50", "Mayer 2702", 48, 39,
      "Hands-on experiments in measurement, uncertainty and Newtonian mechanics. Take with or after PHYS 2A."),
    c(13, "PHYS", "141", "Computational Physics", "Upper Division", 4, "Prof. Ines Varga", ["Tu","Th"], "15:30", "16:50", "Mayer 5301", 60, 34,
      "Numerical methods for physical systems: ODE solvers, Monte Carlo methods and spectral techniques."),
    c(14, "MUS", "4", "Introduction to Western Music", "Lower Division", 4, "Dr. Rafael Mendes", ["Tu","Th"], "16:00", "17:20", "Conrad Prebys 127", 160, 118,
      "A listening-centered survey from medieval chant to contemporary concert music. No musical background needed."),
    c(15, "MUS", "126", "Blues: An Oral Tradition", "Upper Division", 4, "Prof. Lionel Hart", ["M","W"], "14:00", "15:20", "Conrad Prebys 131", 75, 75,
      "The history, forms and social life of the blues, from field recordings to electric Chicago blues."),
    c(16, "LIT", "25", "Reading Speculative Fiction", "Lower Division", 4, "Dr. Amara Okafor", ["M","W"], "15:30", "16:50", "Literature 155", 60, 41,
      "Close reading of science fiction and fantasy, with short critical essays each week."),
    c(17, "BIO", "1", "The Cell", "Lower Division", 4, "Prof. Grace Lindqvist", ["Tu","Th"], "08:00", "09:20", "Pacific Hall 4", 240, 233,
      "Cell structure and function, metabolism, genetics and the molecular basis of life."),
    c(18, "ECON", "1", "Principles of Microeconomics", "Lower Division", 4, "Prof. Samuel Ortiz", ["M","W","F"], "12:00", "12:50", "Price Center Theater", 280, 212,
      "Supply and demand, consumer choice, firm behavior, market structure and the role of government."),
    c(19, "ECON", "120B", "Econometrics", "Upper Division", 4, "Dr. Wen Li", ["Tu","Th"], "11:00", "12:20", "Sequoyah 147", 110, 88,
      "Regression analysis, hypothesis testing, instrumental variables and panel data with applied problem sets.")
  ];
  const byId = (id) => COURSES.find((x) => x.id === id);

  // ---------------- State ----------------
  const DEFAULT_STATE = {
    student: { name: "Alex Moreno", sid: "A17024419", email: "amoreno@halden.edu", major: "Computer Science", year: "Third year" },
    registered: [ { id: 1, grading: "Letter" }, { id: 8, grading: "Letter" } ],
    cart: [10, 18],
    grading: {},
    prefs: { theme: null, largeText: false }
  };
  const STORE_KEY = "halden-registration-a11y-v1";
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign(structuredClone(DEFAULT_STATE), JSON.parse(raw));
    } catch (e) { /* storage unavailable */ }
    return structuredClone(DEFAULT_STATE);
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---------------- Helpers ----------------
  function toMin(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
  function fmtTime(min) {
    let h = Math.floor(min / 60); const m = min % 60;
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + String(m).padStart(2, "0") + " " + ap;
  }
  function fmtRange(x) {
    const a = fmtTime(x.start), b = fmtTime(x.end);
    return a.slice(-2) === b.slice(-2) ? a.slice(0, -3) + "–" + b : a + "–" + b;
  }
  /* Spoken form: "Monday, Wednesday and Friday, 10:00 AM to 10:50 AM" */
  function spokenDays(days) {
    const names = days.map((d) => DAY_LONG[d]);
    return names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names.at(-1) : names[0];
  }
  const spokenTime = (x) => `${spokenDays(x.days)}, ${fmtTime(x.start)} to ${fmtTime(x.end)}`;
  const fmtDays = (days) => days.join("");
  /* Visible compact text with a spoken equivalent for screen readers */
  const meetsHtml = (x) => `<span aria-hidden="true">${fmtDays(x.days)} · ${fmtRange(x)}</span><span class="sr-only">${spokenTime(x)}</span>`;
  const seatsLeft = (x) => Math.max(0, x.cap - x.enrolled);
  const isRegistered = (id) => state.registered.some((r) => r.id === id);
  const inCart = (id) => state.cart.includes(id);
  const regUnits = () => state.registered.reduce((s, r) => s + byId(r.id).units, 0);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const deptStyle = (dept) => `--c:${DEPTS[dept].color}`;
  const inkClass = (dept) => (DEPTS[dept].darkInk ? " dark-ink" : "");

  function overlaps(a, b) {
    return a.id !== b.id && a.days.some((d) => b.days.includes(d)) && a.start < b.end && b.start < a.end;
  }

  /* Toast uses a persistent live region so screen readers announce each message */
  function toast(msg) {
    const root = $("#toastRoot");
    root.innerHTML = "";
    requestAnimationFrame(() => { root.innerHTML = `<div class="toast">${esc(msg)}</div>`; });
    clearTimeout(toast.t);
    toast.t = setTimeout(() => (root.innerHTML = ""), 5000);
  }

  function updateCartBadge() {
    const n = state.cart.length;
    $("#cartBadge").textContent = n;
    $("#cartBadgeSr").textContent = `, ${n} course${n === 1 ? "" : "s"} in cart`;
  }

  // ---------------- Display preferences ----------------
  function applyPrefs() {
    const root = document.documentElement;
    const systemDark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = state.prefs.theme ? state.prefs.theme === "dark" : systemDark;
    if (state.prefs.theme) root.setAttribute("data-theme", state.prefs.theme); else root.removeAttribute("data-theme");
    $("#themeBtn").setAttribute("aria-pressed", String(dark));
    document.body.classList.toggle("large-text", !!state.prefs.largeText);
    $("#textSizeBtn").setAttribute("aria-pressed", String(!!state.prefs.largeText));
  }

  // ---------------- Router ----------------
  const VIEWS = ["home", "catalog", "register", "profile"];
  const VIEW_TITLES = { home: "Home", catalog: "Course Catalog", register: "Registration", profile: "Student Profile" };
  let firstRoute = true;

  function route() {
    const hash = location.hash.replace("#", "");
    if (hash === "main") return; // skip link target, not a view
    const view = VIEWS.includes(hash) ? hash : "home";
    VIEWS.forEach((v) => { $("#view-" + v).hidden = v !== view; });
    $$(".nav-links a").forEach((a) => {
      if (a.dataset.view === view) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    $("#nav").classList.remove("open");
    $("#navToggle").setAttribute("aria-expanded", "false");
    document.title = `${VIEW_TITLES[view]} · Halden University Registration`;
    render(view);
    // Move focus to the new page heading so keyboard and screen-reader users land at the top of the new content.
    if (!firstRoute) {
      window.scrollTo({ top: 0 });
      const h1 = $("#view-" + view + " h1");
      if (h1) h1.focus({ preventScroll: true });
    }
    firstRoute = false;
  }
  function go(view) {
    if (location.hash === "#" + view) route();
    else location.hash = view;
  }

  function render(view) {
    updateCartBadge();
    if (view === "home") renderHome();
    if (view === "catalog") renderCatalog(false);
    if (view === "register") renderRegister();
    if (view === "profile") renderProfile();
  }

  // ---------------- Timetable ----------------
  /* The grid is decorative (aria-hidden); a list with the same information follows it for assistive tech. */
  function renderTimetable(el, courses, label) {
    const startH = 8, endH = 18, span = (endH - startH) * 60;
    let hours = "";
    for (let h = startH; h < endH; h++) {
      const top = ((h - startH) * 60 / span) * 100;
      hours += `<span style="top:${top}%">${h > 12 ? h - 12 : h}${h >= 12 ? "p" : "a"}</span>`;
    }
    let grid = `<div class="tt" aria-hidden="true"><div></div>${DAY_ORDER.map((d) => `<div class="tt-head">${DAY_SHORT[d]}</div>`).join("")}`;
    grid += `<div class="tt-hours">${hours}</div>`;
    DAY_ORDER.forEach((d) => {
      grid += `<div class="tt-col">`;
      courses.filter((x) => x.days.includes(d)).forEach((x) => {
        const top = ((x.start - startH * 60) / span) * 100;
        const h = ((x.end - x.start) / span) * 100;
        grid += `<div class="tt-block${inkClass(x.dept)}" style="${deptStyle(x.dept)};top:${top}%;height:${h}%">${esc(x.code)}<small>${esc(x.room)}</small></div>`;
      });
      grid += `</div>`;
    });
    if (!courses.length) grid += `<div class="tt-empty">No courses yet. Add some from the catalog.</div>`;
    grid += `</div>`;

    const list = courses.length
      ? `<ul class="sr-only" aria-label="${esc(label)}">${[...courses].sort((a, b) => DAY_ORDER.indexOf(a.days[0]) - DAY_ORDER.indexOf(b.days[0]) || a.start - b.start)
          .map((x) => `<li>${esc(x.code)}, ${esc(x.title)}: ${spokenTime(x)}, ${esc(x.room)}</li>`).join("")}</ul>`
      : `<p class="sr-only">${esc(label)}: no courses yet.</p>`;
    el.innerHTML = grid + list;
  }

  // ---------------- Home ----------------
  function renderHome() {
    renderTimetable($("#homeTimetable"), state.registered.map((r) => byId(r.id)), "Your enrolled courses this week");
    $("#deptTiles").innerHTML = Object.entries(DEPTS).map(([code, d]) => {
      const n = COURSES.filter((x) => x.dept === code).length;
      return `<li><button type="button" class="dept-tile${d.darkInk ? " dark-ink" : ""}" style="--c:${d.color}" data-dept="${code}">
        <span class="code" aria-hidden="true">${code}</span>
        <span><strong>${esc(d.name)}</strong><span class="count">${n} section${n > 1 ? "s" : ""}</span></span>
      </button></li>`;
    }).join("");
  }

  // ---------------- Catalog ----------------
  const filters = { q: "", dept: "", level: "", units: "", days: "", open: false, sort: "code" };

  function initCatalogControls() {
    $("#fDept").innerHTML = `<option value="">All departments</option>` +
      Object.entries(DEPTS).map(([k, d]) => `<option value="${k}">${k}: ${esc(d.name)}</option>`).join("");
    $("#catTotal").textContent = COURSES.length;
    let debounce;
    $("#q").addEventListener("input", (e) => {
      filters.q = e.target.value;
      clearTimeout(debounce);
      debounce = setTimeout(() => renderCatalog(true), 250); // debounce so the live region is not flooded
    });
    const bind = (id, key, prop = "value") => $(id).addEventListener("change", (e) => { filters[key] = e.target[prop]; renderCatalog(true); });
    bind("#fDept", "dept"); bind("#fLevel", "level"); bind("#fUnits", "units"); bind("#fDays", "days");
    bind("#fOpen", "open", "checked"); bind("#fSort", "sort");
    $("#filterForm").addEventListener("submit", (e) => { e.preventDefault(); renderCatalog(true); });
    $("#clearFilters").addEventListener("click", () => {
      Object.assign(filters, { q: "", dept: "", level: "", units: "", days: "", open: false, sort: "code" });
      syncFilterInputs();
      renderCatalog(true);
      $("#q").focus();
    });
  }
  function syncFilterInputs() {
    $("#q").value = filters.q; $("#fDept").value = filters.dept; $("#fLevel").value = filters.level;
    $("#fUnits").value = filters.units; $("#fDays").value = filters.days; $("#fOpen").checked = filters.open; $("#fSort").value = filters.sort;
  }

  function filteredCourses() {
    const q = filters.q.trim().toLowerCase().replace(/\s+/g, " ");
    const list = COURSES.filter((x) => {
      if (q) {
        const hay = (x.code + " " + x.dept + x.num + " " + x.title + " " + x.instructor).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.dept && x.dept !== filters.dept) return false;
      if (filters.level && x.level !== filters.level) return false;
      if (filters.units && x.units !== Number(filters.units)) return false;
      if (filters.days) {
        if (filters.days === "single") { if (x.days.length !== 1) return false; }
        else if (fmtDays(x.days) !== filters.days) return false;
      }
      if (filters.open && seatsLeft(x) === 0) return false;
      return true;
    });
    const sorters = {
      code: (a, b) => a.dept.localeCompare(b.dept) || a.num.localeCompare(b.num, undefined, { numeric: true }),
      seats: (a, b) => seatsLeft(b) - seatsLeft(a),
      time: (a, b) => a.start - b.start
    };
    return list.sort(sorters[filters.sort]);
  }

  function courseCard(x) {
    const left = seatsLeft(x);
    const pct = Math.round((x.enrolled / x.cap) * 100);
    const barCls = left === 0 ? "full" : pct >= 90 ? "warn" : "";
    const seatText = left === 0 ? "Full, waitlist closed" : pct >= 90 ? `Almost full: ${left} seat${left === 1 ? "" : "s"} open` : `${left} seats open`;
    const seatCls = left === 0 ? "state-full" : pct >= 90 ? "state-low" : "";
    const reg = isRegistered(x.id), cart = inCart(x.id);
    const titleId = `course-${x.id}-title`;
    let action;
    if (reg) action = `<button type="button" class="btn btn-ghost" aria-disabled="true" aria-describedby="${titleId}">Registered</button>`;
    else if (left === 0) action = `<button type="button" class="btn btn-ghost" aria-disabled="true" aria-describedby="${titleId}">Section full</button>`;
    else if (cart) action = `<button type="button" class="btn btn-outline" data-action="uncart" data-id="${x.id}" aria-label="Remove ${esc(x.code)} from cart">Remove from cart</button>`;
    else action = `<button type="button" class="btn btn-primary" data-action="cart" data-id="${x.id}" aria-label="Add ${esc(x.code)}, ${esc(x.title)}, to cart">Add to cart</button>`;

    return `<li><article class="card" aria-labelledby="${titleId}">
      <div class="card-band${inkClass(x.dept)}" style="${deptStyle(x.dept)}">
        <span class="code">${esc(x.code)}</span><span class="lvl">${esc(x.level)}</span>
      </div>
      <div class="card-body">
        <h3 id="${titleId}"><span class="sr-only">${esc(x.code)}: </span>${esc(x.title)}</h3>
        <p class="desc">${esc(x.desc)}</p>
        <dl class="meta">
          <dt>Instructor</dt><dd>${esc(x.instructor)}</dd>
          <dt>Meets</dt><dd class="num">${meetsHtml(x)}</dd>
          <dt>Room</dt><dd>${esc(x.room)}</dd>
          <dt>Units</dt><dd class="num">${x.units}</dd>
          <dt>Department</dt><dd>${esc(DEPTS[x.dept].name)}</dd>
        </dl>
        <div class="seats">
          <p class="seats-row num"><span class="${seatCls}">${seatText}</span><span><span class="sr-only">Enrolled: </span>${x.enrolled}<span aria-hidden="true">/</span><span class="sr-only"> of </span>${x.cap}</span></p>
          <div class="bar ${barCls}" aria-hidden="true"><i style="width:${pct}%"></i></div>
        </div>
      </div>
      <div class="card-foot">${action}${cart && !reg ? `<button type="button" class="btn btn-ghost" data-action="register-now" data-id="${x.id}" aria-label="Go to registration for ${esc(x.code)}">Register</button>` : ""}</div>
    </article></li>`;
  }

  function renderCatalog(announce) {
    const list = filteredCourses();
    const msg = `Showing ${list.length} of ${COURSES.length} courses`;
    // Only update the live region on user-driven changes, so arriving on the page isn't noisy.
    const rc = $("#resultCount");
    if (announce || rc.textContent === "") rc.textContent = msg; else rc.textContent = msg;
    $("#cards").innerHTML = list.length
      ? list.map(courseCard).join("")
      : `<li class="empty" style="grid-column:1/-1"><h2>No courses match those filters</h2><p>Try a broader search or choose Clear filters.</p></li>`;
  }

  // ---------------- Register ----------------
  let regErrors = [];
  let submitted = false;

  function renderRegister() {
    const s = state.student;
    [["name", "sName"], ["sid", "sId"], ["email", "sEmail"], ["major", "sMajor"], ["year", "sYear"]].forEach(([k, id]) => {
      const el = $("#" + id);
      if (document.activeElement !== el && !el.dataset.touched) el.value = s[k];
    });
    renderPickList();
    renderAddSelect();
    renderSummary();
  }

  const pendingCourses = () => state.cart.map(byId).filter(Boolean);
  const selectedIds = () => $$("#pickList input[type=checkbox]:checked").map((i) => Number(i.value));

  function conflictsFor(list) {
    const enrolled = state.registered.map((r) => byId(r.id));
    const out = new Map();
    list.forEach((x) => {
      const hits = [...enrolled, ...list].filter((y) => overlaps(x, y));
      if (hits.length) out.set(x.id, hits.map((h) => h.code));
    });
    return out;
  }

  const unchecked = new Set(); // courses in the cart the student has unticked
  function renderPickList() {
    const list = pendingCourses();
    const checkedList = list.filter((x) => !unchecked.has(x.id));
    const conflicts = conflictsFor(checkedList);
    const focusedId = document.activeElement && document.activeElement.id;

    if (!list.length) {
      $("#pickList").innerHTML = `<li class="empty" style="padding:24px;border:1.5px dashed var(--line-strong);border-radius:12px">
        <h3>Your cart is empty</h3><p>Add courses from the <a href="#catalog">catalog</a> or choose one below.</p></li>`;
      return;
    }
    $("#pickList").innerHTML = list.map((x) => {
      const on = !unchecked.has(x.id);
      const g = state.grading[x.id] || (x.num === "87" ? "P/NP" : "Letter");
      const conf = on && conflicts.get(x.id);
      const flagId = `flag-${x.id}`;
      return `<li class="pick${on ? " on" : ""}" style="${deptStyle(x.dept)}">
        <input type="checkbox" id="pick-${x.id}" value="${x.id}" ${on ? "checked" : ""} ${conf ? `aria-describedby="${flagId}" aria-invalid="true"` : ""}>
        <label class="pick-info" for="pick-${x.id}">
          <strong><span class="mono">${esc(x.code)}</span> · ${esc(x.title)}</strong>
          <span class="num">${meetsHtml(x)} · ${x.units} units · ${esc(x.instructor)}</span>
        </label>
        <label class="sr-only" for="grade-${x.id}">Grading option for ${esc(x.code)}</label>
        <select class="select" id="grade-${x.id}" data-grade="${x.id}">
          ${[["Letter", "Letter grade"], ["P/NP", "Pass / No Pass"], ["Audit", "Audit"]].map(([v, t]) => `<option value="${v}" ${v === g ? "selected" : ""}>${t}</option>`).join("")}
        </select>
        ${conf ? `<span class="flag" id="${flagId}">⚠ Time conflict with ${esc(conf.join(", "))}</span>` : ""}
      </li>`;
    }).join("");
    if (focusedId && $("#" + focusedId)) $("#" + focusedId).focus(); // keep focus after re-render
  }

  function renderAddSelect() {
    const avail = COURSES.filter((x) => !isRegistered(x.id) && !inCart(x.id) && seatsLeft(x) > 0);
    $("#addCourse").innerHTML = `<option value="">Choose a course…</option>` +
      avail.map((x) => `<option value="${x.id}">${esc(x.code)}: ${esc(x.title)} (${x.units} units, ${fmtDays(x.days)} ${fmtRange(x)})</option>`).join("");
  }

  function renderSummary() {
    const sel = selectedIds().map(byId);
    const enrolled = state.registered.map((r) => byId(r.id));
    const all = [...enrolled.map((x) => ({ x, kind: "enrolled" })), ...sel.map((x) => ({ x, kind: "new" }))];
    const total = all.reduce((s, o) => s + o.x.units, 0);
    $("#sumUnits").innerHTML = `${total} <small>/ ${MAX_UNITS} units</small><span class="sr-only"> planned for the term</span>`;
    $("#sumBar").innerHTML = all.map((o) =>
      `<i class="${o.kind}" style="width:${(o.x.units / MAX_UNITS) * 100}%;background-color:${DEPTS[o.x.dept].color}"></i>`).join("");
    $("#sumLegend").innerHTML = all.length ? all.map((o) =>
      `<li><span class="sw" style="background:${DEPTS[o.x.dept].color}" aria-hidden="true"></span><span class="mono" style="font-weight:700">${esc(o.x.code)}</span>
       <span class="tag">${o.kind === "enrolled" ? "already enrolled" : "adding"}, ${o.x.units} units</span></li>`).join("")
      : `<li class="tag">No courses selected.</li>`;

    const notes = [];
    if (total > MAX_UNITS) notes.push(`<p class="notice bad">⚠ This is ${total - MAX_UNITS} units over the ${MAX_UNITS}-unit term limit.</p>`);
    const conf = conflictsFor(sel);
    if (conf.size) notes.push(`<p class="notice bad">⚠ ${conf.size} selected course${conf.size > 1 ? "s have" : " has"} a time conflict.</p>`);
    if (!notes.length && sel.length) notes.push(`<p class="notice ok">✓ No conflicts. You're within the unit limit.</p>`);
    $("#sumNotices").innerHTML = notes.join("");
  }

  function setErr(id, msg, focusTarget) {
    const input = $("#" + id), err = $("#" + id + "Err");
    if (err) err.textContent = msg || "";
    if (input && (input.tagName === "INPUT" || input.tagName === "SELECT")) input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) regErrors.push({ id: focusTarget || id, msg });
  }

  function validate() {
    regErrors = [];
    const name = $("#sName").value.trim();
    const sid = $("#sId").value.trim();
    const email = $("#sEmail").value.trim();
    setErr("sName", name.length < 2 ? "Enter your full name." : "");
    setErr("sId", /^A\d{8}$/i.test(sid) ? "" : (sid ? "Student ID must be the letter A followed by 8 digits." : "Enter your student ID."));
    setErr("sEmail", /^[^\s@]+@halden\.edu$/i.test(email) ? "" : (email ? "Use your @halden.edu email address." : "Enter your university email."));

    const sel = selectedIds().map(byId);
    const total = regUnits() + sel.reduce((s, x) => s + x.units, 0);
    let pick = "";
    if (!sel.length) pick = "Select at least one course to enroll in.";
    else if (total > MAX_UNITS) pick = `Your selection brings you to ${total} units. Remove a course to stay at or under ${MAX_UNITS}.`;
    else if (conflictsFor(sel).size) pick = "Untick one of the courses with a time conflict.";
    const firstPick = $("#pickList input[type=checkbox]") ? $("#pickList input[type=checkbox]").id : "addCourse";
    setErr("pick", pick, firstPick);
    setErr("ack", $("#ack").checked ? "" : "Confirm that you meet the prerequisites and understand the drop deadline.");
    $("#ack").setAttribute("aria-invalid", $("#ack").checked ? "false" : "true");
    return regErrors.length === 0;
  }

  function renderErrorSummary() {
    const box = $("#errorSummary");
    if (!regErrors.length) { box.hidden = true; box.innerHTML = ""; return; }
    box.hidden = false;
    box.innerHTML = `<h2 id="errorSummaryTitle">There ${regErrors.length === 1 ? "is 1 problem" : `are ${regErrors.length} problems`} with your registration</h2>
      <ul>${regErrors.map((e) => `<li><a href="#${e.id}" data-focus="${e.id}">${esc(e.msg)}</a></li>`).join("")}</ul>`;
  }

  function onSubmit(e) {
    e.preventDefault();
    submitted = true;
    if (!validate()) {
      renderErrorSummary();
      $("#errorSummary").focus();
      document.title = `Error: Registration · Halden University Registration`;
      return;
    }
    renderErrorSummary();
    document.title = `Registration · Halden University Registration`;
    openConfirmRegister(selectedIds().map(byId));
  }

  // ---------------- Dialog ----------------
  let lastFocus = null;
  const BACKGROUND = () => [$(".skip-link"), $("#nav"), $("#main"), $(".site-foot")];

  function openModal(html, { initialFocus, onReady } = {}) {
    lastFocus = document.activeElement;
    $("#modalRoot").innerHTML = `<div class="modal-backdrop" data-close>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalDesc">${html}</div></div>`;
    BACKGROUND().forEach((el) => el && (el.inert = true)); // hide the rest of the page from AT and keyboard
    document.body.style.overflow = "hidden";
    const modal = $(".modal");
    modal.addEventListener("keydown", trapFocus);
    if (onReady) onReady(modal);
    const target = (initialFocus && $(initialFocus, modal)) || modal.querySelector("button");
    target.focus();
  }
  function trapFocus(e) {
    if (e.key !== "Tab") return;
    const f = $$("button, [href], select, input", e.currentTarget).filter((el) => !el.disabled);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function closeModal(restoreFocus = true) {
    $("#modalRoot").innerHTML = "";
    BACKGROUND().forEach((el) => el && (el.inert = false));
    document.body.style.overflow = "";
    if (restoreFocus && lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function openConfirmRegister(sel) {
    const total = regUnits() + sel.reduce((s, x) => s + x.units, 0);
    const gradeOf = (x) => ($("#grade-" + x.id) || {}).value || "Letter";
    openModal(`
      <div class="modal-head">
        <p class="eyebrow">Confirm registration · Spring 2027</p>
        <h2 id="modalTitle">Enroll in ${sel.length} course${sel.length > 1 ? "s" : ""}?</h2>
        <p id="modalDesc">Review your selection for ${esc($("#sName").value.trim())}, student ID <span class="mono">${esc($("#sId").value.trim().toUpperCase())}</span>. Nothing is submitted until you choose Confirm registration.</p>
      </div>
      <div class="modal-body">
        <ul class="confirm-list" aria-label="Courses to enroll">
          ${sel.map((x) => `<li style="${deptStyle(x.dept)}">
            <span class="code-cell"><i aria-hidden="true"></i>${esc(x.code)}</span>
            <span>${esc(x.title)}<small class="num">${meetsHtml(x)} · ${esc(gradeOf(x))}</small></span>
            <span class="num" style="font-weight:700">${x.units}<span class="sr-only"> units</span><span aria-hidden="true">u</span></span></li>`).join("")}
        </ul>
        <p class="notice ok num">Your term total will be ${total} of ${MAX_UNITS} units.</p>
      </div>
      <div class="modal-foot">
        <button type="button" class="btn btn-outline" data-close-btn>Go back and edit</button>
        <button type="button" class="btn btn-primary" id="confirmReg">Confirm registration</button>
      </div>`, {
      initialFocus: "#confirmReg",
      onReady: (modal) => {
        $("#confirmReg", modal).addEventListener("click", () => {
          sel.forEach((x) => {
            state.registered.push({ id: x.id, grading: gradeOf(x) });
            x.enrolled = Math.min(x.cap, x.enrolled + 1);
          });
          state.cart = state.cart.filter((id) => !sel.some((x) => x.id === id));
          state.student = {
            name: $("#sName").value.trim(), sid: $("#sId").value.trim().toUpperCase(), email: $("#sEmail").value.trim(),
            major: $("#sMajor").value, year: $("#sYear").value
          };
          $("#ack").checked = false;
          submitted = false;
          save();
          showRegSuccess(sel);
        });
      }
    });
  }

  function showRegSuccess(sel) {
    const modal = $(".modal");
    modal.innerHTML = `
      <div class="modal-head">
        <div class="success-mark" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" focusable="false"><path d="M5 12l5 5L20 7"/></svg></div>
        <h2 id="modalTitle" tabindex="-1">You're registered</h2>
        <p id="modalDesc">${sel.map((x) => esc(x.code)).join(", ")} ${sel.length > 1 ? "are" : "is"} now on your Spring 2027 schedule.</p>
      </div>
      <div class="modal-foot" style="padding-top:18px">
        <button type="button" class="btn btn-outline" data-close-btn>Stay on this page</button>
        <button type="button" class="btn btn-primary" id="toProfile">View my schedule</button>
      </div>`;
    updateCartBadge();
    $("#toProfile").addEventListener("click", () => { closeModal(false); go("profile"); });
    $("#modalTitle").focus(); // screen readers announce the result
    toast(`Registered for ${sel.map((x) => x.code).join(", ")}.`);
  }

  function openConfirmDrop(id) {
    const x = byId(id);
    openModal(`
      <div class="modal-head">
        <p class="eyebrow">Drop course</p>
        <h2 id="modalTitle">Drop ${esc(x.code)}?</h2>
        <p id="modalDesc">${esc(x.title)} will be removed from your schedule and your seat released. Dropping before February 5, 2027 leaves no W on your transcript.</p>
      </div>
      <div class="modal-foot" style="padding-top:18px">
        <button type="button" class="btn btn-outline" data-close-btn>Keep course</button>
        <button type="button" class="btn btn-danger-solid btn" id="confirmDrop">Drop ${esc(x.code)}</button>
      </div>`, {
      initialFocus: "[data-close-btn]", // safest default for a destructive action
      onReady: (modal) => {
        $("#confirmDrop", modal).addEventListener("click", () => {
          state.registered = state.registered.filter((r) => r.id !== id);
          x.enrolled = Math.max(0, x.enrolled - 1);
          save();
          closeModal(false);
          renderProfile();
          $("#regCoursesTitle").setAttribute("tabindex", "-1");
          $("#regCoursesTitle").focus();
          toast(`Dropped ${x.code}. You now have ${regUnits()} units.`);
        });
      }
    });
  }

  // ---------------- Profile ----------------
  let profileSort = { key: "time", dir: 1 };
  function renderProfile() {
    const s = state.student;
    $("#pName").textContent = s.name;
    $("#pSub").textContent = `${s.major} · ${s.year}`;
    $("#pId").textContent = s.sid;
    $("#pEmail").textContent = s.email;
    $("#pAvatar").textContent = s.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

    const units = regUnits();
    $("#stCourses").textContent = state.registered.length;
    $("#stUnits").textContent = units;
    $("#stLeft").textContent = Math.max(0, MAX_UNITS - units);

    const rows = state.registered.map((r) => ({ r, x: byId(r.id) }));
    const k = profileSort.key;
    rows.sort((a, b) => {
      const va = k === "time" ? DAY_ORDER.indexOf(a.x.days[0]) * 2000 + a.x.start : a.x[k];
      const vb = k === "time" ? DAY_ORDER.indexOf(b.x.days[0]) * 2000 + b.x.start : b.x[k];
      return (typeof va === "number" ? va - vb : String(va).localeCompare(String(vb))) * profileSort.dir;
    });
    $$(".sort-btn").forEach((b) => {
      const on = b.dataset.sort === k;
      b.parentElement.setAttribute("aria-sort", on ? (profileSort.dir > 0 ? "ascending" : "descending") : "none");
      b.querySelector(".arrow").textContent = on ? (profileSort.dir > 0 ? "▲" : "▼") : "↕";
    });

    $("#regBody").innerHTML = rows.length ? rows.map(({ r, x }) => `<tr>
        <th scope="row"><span class="code-cell" style="${deptStyle(x.dept)}"><i aria-hidden="true"></i>${esc(x.code)}</span></th>
        <td>${esc(x.title)}</td>
        <td class="num">${x.units}</td>
        <td class="num" style="white-space:nowrap">${meetsHtml(x)}</td>
        <td>${esc(x.room)}</td>
        <td>${esc(x.instructor)}</td>
        <td>${r.grading === "P/NP" ? "Pass / No Pass" : esc(r.grading)}</td>
        <td><span class="status">Enrolled</span></td>
        <td><button type="button" class="btn btn-danger" data-drop="${x.id}" aria-label="Drop ${esc(x.code)}, ${esc(x.title)}">Drop</button></td>
      </tr>`).join("")
      : `<tr><td colspan="9"><div class="empty" style="padding:28px"><h3>No registered courses</h3><p>Go to the <a href="#catalog">catalog</a> to start building your schedule.</p></div></td></tr>`;
    $("#regTotal").textContent = units;

    renderTimetable($("#profileTimetable"), rows.map((o) => o.x), "Weekly schedule");
  }

  // ---------------- Events ----------------
  function bindEvents() {
    window.addEventListener("hashchange", route);

    $("#navToggle").addEventListener("click", () => {
      const open = $("#nav").classList.toggle("open");
      $("#navToggle").setAttribute("aria-expanded", String(open));
      if (open) $(".nav-links a").focus();
    });
    $("#nav").addEventListener("keydown", (e) => {
      if (e.key === "Escape" && $("#nav").classList.contains("open")) {
        $("#nav").classList.remove("open");
        $("#navToggle").setAttribute("aria-expanded", "false");
        $("#navToggle").focus();
      }
    });

    $("#themeBtn").addEventListener("click", () => {
      const isDark = $("#themeBtn").getAttribute("aria-pressed") === "true";
      state.prefs.theme = isDark ? "light" : "dark";
      save(); applyPrefs();
      toast(isDark ? "Light mode on." : "Dark mode on.");
    });
    $("#textSizeBtn").addEventListener("click", () => {
      state.prefs.largeText = !state.prefs.largeText;
      save(); applyPrefs();
      toast(state.prefs.largeText ? "Larger text on." : "Standard text size.");
    });

    // Skip link: focus main without changing the hash-based view
    $(".skip-link").addEventListener("click", (e) => {
      e.preventDefault();
      const h1 = $(".view:not([hidden]) h1");
      (h1 || $("#main")).focus();
    });

    $("#heroSearch").addEventListener("submit", (e) => {
      e.preventDefault();
      filters.q = $("#heroQuery").value;
      syncFilterInputs();
      go("catalog");
    });

    $("#deptTiles").addEventListener("click", (e) => {
      const t = e.target.closest("[data-dept]");
      if (!t) return;
      Object.assign(filters, { q: "", dept: t.dataset.dept, level: "", units: "", days: "", open: false });
      syncFilterInputs();
      go("catalog");
    });

    $("#cards").addEventListener("click", (e) => {
      const b = e.target.closest("[data-action]");
      if (!b) return;
      const id = Number(b.dataset.id), x = byId(id);
      if (b.dataset.action === "register-now") { go("register"); return; }
      if (b.dataset.action === "cart") { state.cart.push(id); unchecked.delete(id); toast(`${x.code} added to your cart. ${state.cart.length} in cart.`); }
      if (b.dataset.action === "uncart") { state.cart = state.cart.filter((i) => i !== id); toast(`${x.code} removed from your cart.`); }
      save();
      updateCartBadge();
      renderCatalog(false);
      // Re-rendering replaces the button; return focus to the same card's primary action.
      const card = $(`#course-${id}-title`)?.closest(".card");
      const next = card && card.querySelector(".card-foot button");
      if (next) next.focus();
    });

    $("#regForm").addEventListener("submit", onSubmit);
    $("#pickList").addEventListener("change", (e) => {
      if (e.target.dataset.grade) { state.grading[e.target.dataset.grade] = e.target.value; save(); return; }
      const id = Number(e.target.value);
      if (e.target.checked) unchecked.delete(id); else unchecked.add(id);
      renderPickList(); renderSummary();
      if (submitted) { validate(); renderErrorSummary(); }
    });
    $("#addCourseBtn").addEventListener("click", () => {
      const id = Number($("#addCourse").value);
      if (!id) { $("#addCourse").focus(); toast("Choose a course from the list first."); return; }
      state.cart.push(id); unchecked.delete(id); save();
      updateCartBadge();
      renderPickList(); renderAddSelect(); renderSummary();
      $("#pick-" + id).focus();
      toast(`${byId(id).code} added to your selection.`);
    });
    ["sName", "sId", "sEmail"].forEach((id) => {
      $("#" + id).addEventListener("input", (e) => { e.target.dataset.touched = "1"; });
      // Validate on blur (not on every keystroke) once the form has been submitted
      $("#" + id).addEventListener("blur", () => { if (submitted) { validate(); renderErrorSummary(); } });
    });
    $("#ack").addEventListener("change", () => { if (submitted) { validate(); renderErrorSummary(); } });

    // Error summary links move focus to the field
    $("#errorSummary").addEventListener("click", (e) => {
      const a = e.target.closest("[data-focus]");
      if (!a) return;
      e.preventDefault();
      const el = $("#" + a.dataset.focus);
      if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
    });

    $("#regBody").addEventListener("click", (e) => {
      const b = e.target.closest("[data-drop]");
      if (b) openConfirmDrop(Number(b.dataset.drop));
    });
    $$(".sort-btn").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.sort;
      profileSort = { key: k, dir: profileSort.key === k ? -profileSort.dir : 1 };
      renderProfile();
      $(`.sort-btn[data-sort="${k}"]`).focus();
      toast(`Sorted by ${b.firstChild.textContent.toLowerCase()}, ${profileSort.dir > 0 ? "ascending" : "descending"}.`);
    }));

    $("#modalRoot").addEventListener("click", (e) => {
      if (e.target.matches("[data-close]") || e.target.closest("[data-close-btn]")) {
        closeModal();
        if (!$("#view-register").hidden) renderRegister();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && $("#modalRoot").innerHTML) {
        closeModal();
        if (!$("#view-register").hidden) renderRegister();
      }
    });
  }

  // ---------------- Init ----------------
  initCatalogControls();
  bindEvents();
  applyPrefs();
  route();
})();
