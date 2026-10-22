/* Halden University — Course Registration (Spring 2027)
   Plain JavaScript single-page app: hash routing, catalog filters,
   registration form with validation, confirmation modal, profile table. */

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
  const DAY_LABEL = { M: "Mon", Tu: "Tue", W: "Wed", Th: "Thu", F: "Fri" };

  // c(id, dept, num, title, level, units, instructor, days, start, end, room, cap, enrolled, desc)
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
    c(9, "COGS", "108", "Data Science in Practice", "Upper Division", 4, "Dr. Hannah Cole", ["M","W","F"], "11:00", "11:50", "Ledden Aud.", 200, 198,
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
    registered: [ { id: 1, grading: "Letter", date: "2026-11-09" }, { id: 8, grading: "Letter", date: "2026-11-09" } ],
    cart: [10, 18],
    grading: {}
  };
  const STORE_KEY = "halden-registration-v1";
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
    let h = Math.floor(min / 60), m = min % 60;
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + String(m).padStart(2, "0") + " " + ap;
  }
  function fmtRange(course) {
    const a = fmtTime(course.start), b = fmtTime(course.end);
    return a.slice(-2) === b.slice(-2) ? a.slice(0, -3) + "–" + b : a + "–" + b;
  }
  const fmtDays = (days) => days.join("");
  const seatsLeft = (course) => Math.max(0, course.cap - course.enrolled);
  const isRegistered = (id) => state.registered.some((r) => r.id === id);
  const inCart = (id) => state.cart.includes(id);
  const regUnits = () => state.registered.reduce((s, r) => s + byId(r.id).units, 0);
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const deptStyle = (dept) => `--c:${DEPTS[dept].color}`;
  const inkClass = (dept) => (DEPTS[dept].darkInk ? " dark-ink" : "");

  function overlaps(a, b) {
    return a.id !== b.id && a.days.some((d) => b.days.includes(d)) && a.start < b.end && b.start < a.end;
  }

  function toast(msg) {
    const root = $("#toastRoot");
    root.innerHTML = `<div class="toast">${esc(msg)}</div>`;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => (root.innerHTML = ""), 2600);
  }

  // ---------------- Router ----------------
  const VIEWS = ["home", "catalog", "register", "profile"];
  function route() {
    const hash = location.hash.replace("#", "");
    const view = VIEWS.includes(hash) ? hash : "home";
    VIEWS.forEach((v) => { $("#view-" + v).hidden = v !== view; });
    document.querySelectorAll(".nav-links a").forEach((a) => {
      if (a.dataset.view === view) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    $("#nav").classList.remove("open");
    $("#navToggle").setAttribute("aria-expanded", "false");
    render(view);
    window.scrollTo({ top: 0 });
  }
  function go(view) {
    if (location.hash === "#" + view) route();
    else location.hash = view;
  }

  function render(view) {
    $("#cartBadge").textContent = state.cart.length;
    if (view === "home") renderHome();
    if (view === "catalog") renderCatalog();
    if (view === "register") renderRegister();
    if (view === "profile") renderProfile();
  }

  // ---------------- Timetable ----------------
  function renderTimetable(el, courses, opts = {}) {
    const startH = 8, endH = 18, span = (endH - startH) * 60;
    let hours = "";
    for (let h = startH; h < endH; h++) {
      const top = ((h - startH) * 60 / span) * 100;
      hours += `<span style="top:${top}%">${h > 12 ? h - 12 : h}${h >= 12 ? "p" : "a"}</span>`;
    }
    let html = `<div class="tt"><div></div>${DAY_ORDER.map((d) => `<div class="tt-head">${DAY_LABEL[d]}</div>`).join("")}`;
    html += `<div class="tt-hours">${hours}</div>`;
    DAY_ORDER.forEach((d) => {
      html += `<div class="tt-col">`;
      courses.filter((x) => x.days.includes(d)).forEach((x) => {
        const top = ((x.start - startH * 60) / span) * 100;
        const h = ((x.end - x.start) / span) * 100;
        const conflict = opts.conflicts && opts.conflicts.has(x.id) ? " conflict" : "";
        html += `<div class="tt-block${inkClass(x.dept)}${conflict}" style="${deptStyle(x.dept)};top:${top}%;height:${h}%" title="${esc(x.code + " · " + x.title + " · " + fmtRange(x))}">${esc(x.code)}<small>${esc(x.room)}</small></div>`;
      });
      html += `</div>`;
    });
    if (!courses.length) html += `<div class="tt-empty">No courses yet. Add some from the catalog.</div>`;
    html += `</div>`;
    el.innerHTML = html;
  }

  // ---------------- Home ----------------
  function renderHome() {
    const list = state.registered.map((r) => byId(r.id));
    renderTimetable($("#homeTimetable"), list);
    $("#deptTiles").innerHTML = Object.entries(DEPTS).map(([code, d]) => {
      const n = COURSES.filter((x) => x.dept === code).length;
      return `<button class="dept-tile${d.darkInk ? " dark-ink" : ""}" style="--c:${d.color}" data-dept="${code}">
        <span class="code">${code}</span>
        <span><strong>${esc(d.name)}</strong><br><span class="count">${n} section${n > 1 ? "s" : ""}</span></span>
      </button>`;
    }).join("");
  }

  // ---------------- Catalog ----------------
  const filters = { q: "", dept: "", level: "", units: "", days: "", open: false, sort: "code" };

  function initCatalogControls() {
    $("#fDept").innerHTML = `<option value="">All departments</option>` +
      Object.entries(DEPTS).map(([k, d]) => `<option value="${k}">${k} · ${esc(d.name)}</option>`).join("");
    $("#catTotal").textContent = COURSES.length;
    const bind = (id, key, ev = "change", prop = "value") => $(id).addEventListener(ev, (e) => { filters[key] = e.target[prop]; renderCatalog(); });
    bind("#q", "q", "input");
    bind("#fDept", "dept");
    bind("#fLevel", "level");
    bind("#fUnits", "units");
    bind("#fDays", "days");
    bind("#fOpen", "open", "change", "checked");
    bind("#fSort", "sort");
    $("#clearFilters").addEventListener("click", () => {
      Object.assign(filters, { q: "", dept: "", level: "", units: "", days: "", open: false, sort: "code" });
      syncFilterInputs();
      renderCatalog();
    });
  }
  function syncFilterInputs() {
    $("#q").value = filters.q; $("#fDept").value = filters.dept; $("#fLevel").value = filters.level;
    $("#fUnits").value = filters.units; $("#fDays").value = filters.days; $("#fOpen").checked = filters.open; $("#fSort").value = filters.sort;
  }

  function filteredCourses() {
    const q = filters.q.trim().toLowerCase().replace(/\s+/g, " ");
    let list = COURSES.filter((x) => {
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
    const reg = isRegistered(x.id), cart = inCart(x.id);
    let action;
    if (reg) action = `<button class="btn btn-ghost" disabled>Registered</button>`;
    else if (left === 0) action = `<button class="btn btn-ghost" disabled>Section full</button>`;
    else if (cart) action = `<button class="btn btn-outline" data-action="uncart" data-id="${x.id}">Remove from cart</button>`;
    else action = `<button class="btn btn-primary" data-action="cart" data-id="${x.id}">Add to cart</button>`;

    return `<article class="card">
      <div class="card-band${inkClass(x.dept)}" style="${deptStyle(x.dept)}">
        <span class="code">${esc(x.code)}</span><span class="lvl">${esc(x.level)}</span>
      </div>
      <div class="card-body">
        <h3>${esc(x.title)}</h3>
        <p class="desc">${esc(x.desc)}</p>
        <dl class="meta">
          <dt>Instructor</dt><dd>${esc(x.instructor)}</dd>
          <dt>Meets</dt><dd class="num">${fmtDays(x.days)} · ${fmtRange(x)}</dd>
          <dt>Room</dt><dd>${esc(x.room)}</dd>
          <dt>Units</dt><dd class="num">${x.units}</dd>
        </dl>
        <div class="seats">
          <div class="seats-row num"><span>${left === 0 ? "Full · waitlist closed" : left + " seats open"}</span><span>${x.enrolled}/${x.cap}</span></div>
          <div class="bar ${barCls}" role="img" aria-label="${pct}% enrolled"><i style="width:${pct}%"></i></div>
        </div>
      </div>
      <div class="card-foot">${action}${cart && !reg ? `<button class="btn btn-ghost" data-action="register-now" data-id="${x.id}">Register</button>` : ""}</div>
    </article>`;
  }

  function renderCatalog() {
    const list = filteredCourses();
    $("#resultCount").textContent = `${list.length} of ${COURSES.length} courses`;
    $("#cards").innerHTML = list.length
      ? list.map(courseCard).join("")
      : `<div class="empty" style="grid-column:1/-1"><h3>No courses match those filters</h3><p>Try a broader search or clear the filters.</p></div>`;
  }

  // ---------------- Register ----------------
  let regErrors = {};

  function renderRegister() {
    const s = state.student;
    // only fill fields from state the first time / after a change of state
    ["name:sName", "sid:sId", "email:sEmail", "major:sMajor", "year:sYear"].forEach((pair) => {
      const [k, id] = pair.split(":");
      const el = $("#" + id);
      if (document.activeElement !== el) el.value = s[k];
    });
    renderPickList();
    renderAddSelect();
    renderSummary();
  }

  function pendingCourses() {
    return state.cart.map(byId).filter(Boolean);
  }
  function selectedIds() {
    return [...document.querySelectorAll("#pickList input[type=checkbox]:checked")].map((i) => Number(i.value));
  }

  function conflictsFor(list) {
    const enrolled = state.registered.map((r) => byId(r.id));
    const out = new Map();
    list.forEach((x) => {
      const hits = [...enrolled, ...list].filter((y) => overlaps(x, y));
      if (hits.length) out.set(x.id, hits.map((h) => h.code));
    });
    return out;
  }

  function renderPickList() {
    const list = pendingCourses();
    const prevChecked = new Set(document.querySelectorAll("#pickList input").length ? selectedIds() : list.map((x) => x.id));
    const checkedList = list.filter((x) => prevChecked.has(x.id) || !renderPickList.seen?.has(x.id));
    const conflicts = conflictsFor(checkedList);
    renderPickList.seen = new Set(list.map((x) => x.id));

    if (!list.length) {
      $("#pickList").innerHTML = `<div class="empty" style="padding:24px;border:1.5px dashed var(--line);border-radius:12px">
        <h3>Your cart is empty</h3><p>Add courses from the <a href="#catalog">catalog</a> or pick one below.</p></div>`;
      return;
    }
    $("#pickList").innerHTML = list.map((x) => {
      const on = checkedList.some((y) => y.id === x.id);
      const g = state.grading[x.id] || (x.num === "87" ? "P/NP" : "Letter");
      const conf = on && conflicts.get(x.id);
      return `<div class="pick${on ? " on" : ""}" style="${deptStyle(x.dept)}">
        <input type="checkbox" id="pick-${x.id}" value="${x.id}" ${on ? "checked" : ""} aria-label="Enroll in ${esc(x.code)}">
        <label class="pick-info" for="pick-${x.id}">
          <strong><span class="mono">${esc(x.code)}</span> · ${esc(x.title)}</strong>
          <span class="num">${fmtDays(x.days)} ${fmtRange(x)} · ${x.units} units · ${esc(x.instructor)}</span>
        </label>
        <select class="select" id="grade-${x.id}" data-grade="${x.id}" aria-label="Grading option for ${esc(x.code)}">
          ${["Letter", "P/NP", "Audit"].map((o) => `<option ${o === g ? "selected" : ""}>${o}</option>`).join("")}
        </select>
        ${conf ? `<span class="flag">Time conflict with ${esc(conf.join(", "))}</span>` : ""}
      </div>`;
    }).join("");
  }

  function renderAddSelect() {
    const avail = COURSES.filter((x) => !isRegistered(x.id) && !inCart(x.id) && seatsLeft(x) > 0);
    $("#addCourse").innerHTML = `<option value="">Choose a course…</option>` +
      avail.map((x) => `<option value="${x.id}">${esc(x.code)} · ${esc(x.title)} (${x.units}u, ${fmtDays(x.days)} ${fmtRange(x)})</option>`).join("");
  }

  function renderSummary() {
    const sel = selectedIds().map(byId);
    const enrolled = state.registered.map((r) => byId(r.id));
    const all = [...enrolled.map((x) => ({ x, kind: "enrolled" })), ...sel.map((x) => ({ x, kind: "new" }))];
    const total = all.reduce((s, o) => s + o.x.units, 0);
    $("#sumUnits").innerHTML = `${total} <small>/ ${MAX_UNITS} units</small>`;
    $("#sumBar").innerHTML = all.map((o) =>
      `<i style="width:${(o.x.units / MAX_UNITS) * 100}%;background:${DEPTS[o.x.dept].color};${o.kind === "new" ? "opacity:.7" : ""}" title="${esc(o.x.code)}"></i>`).join("");
    $("#sumLegend").innerHTML = all.length ? all.map((o) =>
      `<div><span class="sw" style="background:${DEPTS[o.x.dept].color}"></span><span class="mono" style="font-weight:700">${esc(o.x.code)}</span>
       <span style="color:var(--muted)">${o.kind === "enrolled" ? "enrolled" : "adding"} · ${o.x.units}u</span></div>`).join("")
      : `<div style="color:var(--muted)">No courses selected.</div>`;

    const notes = [];
    if (total > MAX_UNITS) notes.push(`<div class="notice bad">This is ${total - MAX_UNITS} units over the ${MAX_UNITS}-unit term limit.</div>`);
    const conf = conflictsFor(sel);
    if (conf.size) notes.push(`<div class="notice bad">${conf.size} selected course${conf.size > 1 ? "s have" : " has"} a time conflict.</div>`);
    if (!notes.length && sel.length) notes.push(`<div class="notice ok">No conflicts. You're within the unit limit.</div>`);
    $("#sumNotices").innerHTML = notes.join("");
  }

  function setErr(id, msg) {
    const input = $("#" + id), err = $("#" + id + "Err");
    if (err) err.textContent = msg || "";
    if (input && input.tagName === "INPUT" && input.type !== "checkbox") input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) regErrors[id] = msg; else delete regErrors[id];
  }

  function validate() {
    regErrors = {};
    const name = $("#sName").value.trim();
    const sid = $("#sId").value.trim();
    const email = $("#sEmail").value.trim();
    setErr("sName", name.length < 2 ? "Enter your full name." : "");
    setErr("sId", /^A\d{8}$/i.test(sid) ? "" : "Student IDs are an A followed by 8 digits, e.g. A12345678.");
    setErr("sEmail", /^[^\s@]+@halden\.edu$/i.test(email) ? "" : "Use your @halden.edu email address.");

    const sel = selectedIds().map(byId);
    const total = regUnits() + sel.reduce((s, x) => s + x.units, 0);
    let pick = "";
    if (!sel.length) pick = "Select at least one course to enroll in.";
    else if (total > MAX_UNITS) pick = `That brings you to ${total} units. Remove a course to stay at or under ${MAX_UNITS}.`;
    else if (conflictsFor(sel).size) pick = "Resolve the time conflicts before registering.";
    setErr("pick", pick);
    setErr("ack", $("#ack").checked ? "" : "Check the box to confirm prerequisites and deadlines.");
    return Object.keys(regErrors).length === 0;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      const first = Object.keys(regErrors)[0];
      const el = first === "pick" ? $("#pickList input") || $("#addCourse") : $("#" + first);
      if (el) el.focus();
      toast("Fix the highlighted fields to continue.");
      return;
    }
    const sel = selectedIds().map(byId);
    openConfirmRegister(sel);
  }

  // ---------------- Modal ----------------
  let lastFocus = null;
  function openModal(html, onReady) {
    lastFocus = document.activeElement;
    $("#modalRoot").innerHTML = `<div class="modal-backdrop" data-close><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">${html}</div></div>`;
    const modal = $(".modal");
    const focusables = () => [...modal.querySelectorAll("button, [href], select, input")].filter((el) => !el.disabled);
    (focusables()[focusables().length - 1] || modal).focus();
    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const f = focusables(); const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    if (onReady) onReady(modal);
  }
  function closeModal() {
    $("#modalRoot").innerHTML = "";
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function openConfirmRegister(sel) {
    const total = regUnits() + sel.reduce((s, x) => s + x.units, 0);
    const grade = (x) => ($("#grade-" + x.id) || {}).value || "Letter";
    openModal(`
      <div class="modal-head">
        <span class="eyebrow">Confirm registration · Spring 2027</span>
        <h2 id="modalTitle">Enroll in ${sel.length} course${sel.length > 1 ? "s" : ""}?</h2>
        <p>${esc($("#sName").value.trim())} · <span class="mono">${esc($("#sId").value.trim().toUpperCase())}</span></p>
      </div>
      <div class="modal-body">
        <ul class="confirm-list">
          ${sel.map((x) => `<li style="${deptStyle(x.dept)}">
            <span class="code-cell"><i></i>${esc(x.code)}</span>
            <span>${esc(x.title)}<small class="num">${fmtDays(x.days)} ${fmtRange(x)} · ${esc(grade(x))}</small></span>
            <span class="num" style="font-weight:700">${x.units}u</span></li>`).join("")}
        </ul>
        <div class="notice ok num">Your term total will be ${total} of ${MAX_UNITS} units.</div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline" data-close-btn>Go back</button>
        <button class="btn btn-primary" id="confirmReg">Confirm registration</button>
      </div>`, (modal) => {
      $("#confirmReg", modal).addEventListener("click", () => {
        const today = new Date().toISOString().slice(0, 10);
        sel.forEach((x) => {
          state.registered.push({ id: x.id, grading: grade(x), date: today });
          x.enrolled = Math.min(x.cap, x.enrolled + 1);
        });
        state.cart = state.cart.filter((id) => !sel.some((x) => x.id === id));
        state.student = {
          name: $("#sName").value.trim(), sid: $("#sId").value.trim().toUpperCase(), email: $("#sEmail").value.trim(),
          major: $("#sMajor").value, year: $("#sYear").value
        };
        $("#ack").checked = false;
        save();
        showRegSuccess(sel);
      });
    });
  }

  function showRegSuccess(sel) {
    $(".modal").innerHTML = `
      <div class="modal-head">
        <div class="success-mark" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg></div>
        <h2 id="modalTitle">You're registered</h2>
        <p>${sel.map((x) => esc(x.code)).join(", ")} ${sel.length > 1 ? "are" : "is"} now on your Spring 2027 schedule.</p>
      </div>
      <div class="modal-foot" style="padding-top:18px">
        <button class="btn btn-outline" data-close-btn>Keep browsing</button>
        <button class="btn btn-primary" id="toProfile">View my schedule</button>
      </div>`;
    $("#cartBadge").textContent = state.cart.length;
    $("#toProfile").addEventListener("click", () => { closeModal(); go("profile"); });
    $("#toProfile").focus();
  }

  function openConfirmDrop(id) {
    const x = byId(id);
    openModal(`
      <div class="modal-head">
        <span class="eyebrow">Drop course</span>
        <h2 id="modalTitle">Drop ${esc(x.code)}?</h2>
        <p>${esc(x.title)} will be removed from your schedule and your seat released. Dropping before February 5, 2027 leaves no W on your transcript.</p>
      </div>
      <div class="modal-foot" style="padding-top:18px">
        <button class="btn btn-outline" data-close-btn>Keep course</button>
        <button class="btn btn-primary" id="confirmDrop" style="background:var(--bad)">Drop course</button>
      </div>`, (modal) => {
      $("#confirmDrop", modal).addEventListener("click", () => {
        state.registered = state.registered.filter((r) => r.id !== id);
        x.enrolled = Math.max(0, x.enrolled - 1);
        save();
        closeModal();
        renderProfile();
        toast(`Dropped ${x.code}.`);
      });
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
    document.querySelectorAll("th button[data-sort]").forEach((b) => {
      const on = b.dataset.sort === k;
      b.parentElement.setAttribute("aria-sort", on ? (profileSort.dir > 0 ? "ascending" : "descending") : "none");
      b.textContent = b.textContent.replace(/ [▲▼]$/, "") + (on ? (profileSort.dir > 0 ? " ▲" : " ▼") : "");
    });

    $("#regBody").innerHTML = rows.length ? rows.map(({ r, x }) => `<tr>
        <td><span class="code-cell" style="${deptStyle(x.dept)}"><i></i>${esc(x.code)}</span></td>
        <td>${esc(x.title)}</td>
        <td class="num">${x.units}</td>
        <td class="num" style="white-space:nowrap">${fmtDays(x.days)} · ${fmtRange(x)}</td>
        <td>${esc(x.room)}</td>
        <td>${esc(x.instructor)}</td>
        <td>${esc(r.grading)}</td>
        <td><span class="status">Enrolled</span></td>
        <td><button class="btn btn-danger" data-drop="${x.id}" aria-label="Drop ${esc(x.code)}">Drop</button></td>
      </tr>`).join("")
      : `<tr><td colspan="9"><div class="empty" style="padding:28px"><h3>No registered courses</h3><p>Head to the <a href="#catalog">catalog</a> to start building your schedule.</p></div></td></tr>`;
    $("#regTotal").textContent = units;

    renderTimetable($("#profileTimetable"), rows.map((o) => o.x));
  }

  // ---------------- Events ----------------
  function bindEvents() {
    window.addEventListener("hashchange", route);

    $("#navToggle").addEventListener("click", () => {
      const open = $("#nav").classList.toggle("open");
      $("#navToggle").setAttribute("aria-expanded", String(open));
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
      if (b.dataset.action === "cart") {
        state.cart.push(id); save(); toast(`${x.code} added to your cart.`);
      } else if (b.dataset.action === "uncart") {
        state.cart = state.cart.filter((i) => i !== id); save(); toast(`${x.code} removed from your cart.`);
      } else if (b.dataset.action === "register-now") {
        go("register"); return;
      }
      $("#cartBadge").textContent = state.cart.length;
      renderCatalog();
    });

    $("#regForm").addEventListener("submit", onSubmit);
    $("#pickList").addEventListener("change", (e) => {
      if (e.target.dataset.grade) { state.grading[e.target.dataset.grade] = e.target.value; save(); return; }
      renderPickList(); renderSummary();
      if (regErrors.pick) validate();
    });
    $("#addCourseBtn").addEventListener("click", () => {
      const id = Number($("#addCourse").value);
      if (!id) { $("#addCourse").focus(); return; }
      state.cart.push(id); save();
      $("#cartBadge").textContent = state.cart.length;
      renderPickList(); renderAddSelect(); renderSummary();
      toast(`${byId(id).code} added.`);
    });
    ["sName", "sId", "sEmail"].forEach((id) => $("#" + id).addEventListener("input", () => { if (regErrors[id]) validate(); }));
    $("#ack").addEventListener("change", () => { if (regErrors.ack) validate(); });

    $("#regBody").addEventListener("click", (e) => {
      const b = e.target.closest("[data-drop]");
      if (b) openConfirmDrop(Number(b.dataset.drop));
    });
    document.querySelectorAll("th button[data-sort]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.sort;
      profileSort = { key: k, dir: profileSort.key === k ? -profileSort.dir : 1 };
      renderProfile();
    }));

    $("#modalRoot").addEventListener("click", (e) => {
      if (e.target.matches("[data-close]") || e.target.closest("[data-close-btn]")) {
        closeModal();
        if (!$("#view-register").hidden) renderRegister();
        if (!$("#view-catalog").hidden) renderCatalog();
      }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#modalRoot").innerHTML) closeModal(); });
  }

  // ---------------- Init ----------------
  initCatalogControls();
  bindEvents();
  route();
})();
