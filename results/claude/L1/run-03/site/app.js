// Shared logic for all pages: storage, navbar, modal, toast, course cards.
(function () {
  "use strict";

  const STORE_REG = "ucr.registered";
  const STORE_STUDENT = "ucr.student";

  // ---------- Storage ----------
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  const Store = {
    getRegistered() {
      const ids = readJSON(STORE_REG, []);
      return Array.isArray(ids) ? ids.filter((id) => getCourse(id)) : [];
    },
    setRegistered(ids) { writeJSON(STORE_REG, Array.from(new Set(ids))); updateBadge(); },
    isRegistered(id) { return Store.getRegistered().includes(id); },
    add(ids) { Store.setRegistered(Store.getRegistered().concat(ids)); },
    drop(id) { Store.setRegistered(Store.getRegistered().filter((x) => x !== id)); },
    getStudent() { return Object.assign({}, DEFAULT_STUDENT, readJSON(STORE_STUDENT, {})); },
    setStudent(s) { writeJSON(STORE_STUDENT, s); }
  };

  // ---------- Helpers ----------
  function getCourse(id) { return COURSES.find((c) => c.id === id); }
  function deptColor(dept) { return DEPT_COLORS[dept] || "#6c5ce7"; }
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }
  function seatsTaken(c) { return c.enrolled + (Store.isRegistered(c.id) ? 1 : 0); }
  function seatsLeft(c) { return Math.max(0, c.seats - seatsTaken(c)); }
  function isFull(c) { return !Store.isRegistered(c.id) && c.enrolled >= c.seats; }
  function totalCredits(ids) { return ids.reduce((sum, id) => sum + (getCourse(id) ? getCourse(id).credits : 0), 0); }
  function departments() { return Array.from(new Set(COURSES.map((c) => c.dept))).sort(); }

  function parseSlot(c) {
    const [start, end] = c.time.split("–").map((t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    });
    return { days: c.days.split("/"), start, end };
  }
  function conflicts(a, b) {
    const sa = parseSlot(a), sb = parseSlot(b);
    const sharedDay = sa.days.some((d) => sb.days.includes(d));
    return sharedDay && sa.start < sb.end && sb.start < sa.end;
  }
  // Returns list of [courseA, courseB] pairs that overlap in time.
  function findConflicts(ids) {
    const list = ids.map(getCourse).filter(Boolean);
    const pairs = [];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (conflicts(list[i], list[j])) pairs.push([list[i], list[j]]);
      }
    }
    return pairs;
  }

  // ---------- Navbar ----------
  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    const page = document.body.dataset.page;
    document.querySelectorAll(".nav-links a").forEach((a) => {
      if (a.dataset.page === page) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
    updateBadge();
  }
  function updateBadge() {
    const badge = document.getElementById("nav-badge");
    if (badge) badge.textContent = Store.getRegistered().length;
  }

  // ---------- Modal ----------
  let modalEl = null;
  let lastFocus = null;
  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.className = "modal-backdrop";
    modalEl.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<div class="modal-head"><h2 id="modal-title"></h2><button class="modal-close" aria-label="Close">&times;</button></div>' +
      '<div class="modal-body"></div><div class="modal-foot"></div></div>';
    document.body.appendChild(modalEl);
    modalEl.addEventListener("click", (e) => { if (e.target === modalEl) closeModal(); });
    modalEl.querySelector(".modal-close").addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalEl.classList.contains("show")) closeModal();
    });
    return modalEl;
  }
  // actions: [{ label, className, onClick }] — onClick returning false keeps modal open.
  function openModal({ title, body, actions }) {
    const el = ensureModal();
    lastFocus = document.activeElement;
    el.querySelector("#modal-title").textContent = title;
    el.querySelector(".modal-body").innerHTML = body;
    const foot = el.querySelector(".modal-foot");
    foot.innerHTML = "";
    (actions || [{ label: "Close", className: "btn-outline" }]).forEach((a) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn " + (a.className || "btn-primary");
      btn.textContent = a.label;
      btn.addEventListener("click", () => {
        const keep = a.onClick ? a.onClick() === false : false;
        if (!keep) closeModal();
      });
      foot.appendChild(btn);
    });
    el.classList.add("show");
    const first = foot.querySelector("button:last-child");
    if (first) first.focus();
  }
  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove("show");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // ---------- Toast ----------
  let toastTimer = null;
  function toast(msg, type) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = "toast " + (type || "");
    // Force reflow so the transition replays.
    void el.offsetWidth;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  // ---------- Course cards ----------
  function courseCard(c) {
    const registered = Store.isRegistered(c.id);
    const full = isFull(c);
    const pct = Math.min(100, Math.round((seatsTaken(c) / c.seats) * 100));
    const status = registered
      ? '<span class="tag open">✔ Registered</span>'
      : full ? '<span class="tag full">Full</span>' : '<span class="tag open">' + seatsLeft(c) + " seats left</span>";
    const mainBtn = registered
      ? '<button class="btn btn-sm btn-danger" data-action="drop" data-id="' + c.id + '">Drop</button>'
      : '<button class="btn btn-sm btn-primary" data-action="register" data-id="' + c.id + '"' + (full ? " disabled" : "") + ">" + (full ? "Full" : "Register") + "</button>";
    return (
      '<article class="course-card" style="--dept:' + deptColor(c.dept) + '">' +
      '<div class="card-top"><div class="code">' + c.id + " · " + escapeHTML(c.dept) + "</div><h3>" + escapeHTML(c.title) + "</h3></div>" +
      '<div class="card-body">' +
      '<div class="meta"><span class="tag credits">' + c.credits + ' credits</span><span class="tag">Level ' + c.level + '</span><span class="tag time">' + c.days + " " + c.time + "</span></div>" +
      "<p>" + escapeHTML(c.description) + "</p>" +
      '<p><strong>Instructor:</strong> ' + escapeHTML(c.instructor) + "</p>" +
      '<div class="seats-bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
      '<div class="meta"><span class="seats-text">' + seatsTaken(c) + "/" + c.seats + " enrolled</span>" + status + "</div>" +
      '<div class="card-actions"><button class="btn btn-sm btn-outline" data-action="details" data-id="' + c.id + '">Details</button>' + mainBtn + "</div>" +
      "</div></article>"
    );
  }

  function courseDetailsHTML(c) {
    return (
      '<p style="margin-top:0"><span class="tag" style="background:' + deptColor(c.dept) + ';color:#fff">' + escapeHTML(c.dept) + "</span></p>" +
      "<p>" + escapeHTML(c.description) + "</p>" +
      '<ul class="profile-details">' +
      "<li><span>Course code</span><strong>" + c.id + "</strong></li>" +
      "<li><span>Instructor</span><strong>" + escapeHTML(c.instructor) + "</strong></li>" +
      "<li><span>Schedule</span><strong>" + c.days + ", " + c.time + "</strong></li>" +
      "<li><span>Credits</span><strong>" + c.credits + "</strong></li>" +
      "<li><span>Level</span><strong>" + c.level + "</strong></li>" +
      "<li><span>Seats</span><strong>" + seatsTaken(c) + " / " + c.seats + "</strong></li>" +
      "</ul>"
    );
  }

  // Confirmation flow for registering a single course. onDone runs after state changes.
  function confirmRegister(id, onDone) {
    const c = getCourse(id);
    if (!c) return;
    const current = Store.getRegistered();
    const newTotal = totalCredits(current) + c.credits;
    const clash = current.map(getCourse).filter((r) => conflicts(r, c));
    let body = "<p>Do you want to register for <strong>" + c.id + " – " + escapeHTML(c.title) + "</strong>?</p>" +
      '<ul class="profile-details"><li><span>Schedule</span><strong>' + c.days + ", " + c.time + "</strong></li>" +
      "<li><span>Credits</span><strong>" + c.credits + "</strong></li>" +
      "<li><span>Total after registering</span><strong>" + newTotal + " / " + MAX_CREDITS + "</strong></li></ul>";
    if (newTotal > MAX_CREDITS) {
      openModal({
        title: "Credit limit reached",
        body: body + '<p class="error">You cannot exceed ' + MAX_CREDITS + " credits per term. Drop a course first.</p>",
        actions: [{ label: "OK", className: "btn-primary" }]
      });
      return;
    }
    if (clash.length) {
      body += '<p class="error">⚠ Time conflict with: ' + clash.map((x) => x.id).join(", ") + ". You can still register, but please check your schedule.</p>";
    }
    openModal({
      title: "Confirm registration",
      body,
      actions: [
        { label: "Cancel", className: "btn-outline" },
        { label: "Confirm", className: "btn-primary", onClick: () => {
          Store.add([id]);
          toast("Registered for " + c.id + "!", "success");
          if (onDone) onDone();
        } }
      ]
    });
  }

  function confirmDrop(id, onDone) {
    const c = getCourse(id);
    if (!c) return;
    openModal({
      title: "Drop course?",
      body: "<p>Are you sure you want to drop <strong>" + c.id + " – " + escapeHTML(c.title) + "</strong>? Your seat may be taken by another student.</p>",
      actions: [
        { label: "Keep course", className: "btn-outline" },
        { label: "Drop course", className: "btn-danger", onClick: () => {
          Store.drop(id);
          toast("Dropped " + c.id, "warn");
          if (onDone) onDone();
        } }
      ]
    });
  }

  // Delegated handler for card buttons inside a container.
  function bindCardActions(container, rerender) {
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn || btn.disabled) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === "register") confirmRegister(id, rerender);
      else if (action === "drop") confirmDrop(id, rerender);
      else if (action === "details") {
        const c = getCourse(id);
        const registered = Store.isRegistered(id);
        const actions = [{ label: "Close", className: "btn-outline" }];
        if (registered) actions.push({ label: "Drop", className: "btn-danger", onClick: () => { setTimeout(() => confirmDrop(id, rerender)); } });
        else if (!isFull(c)) actions.push({ label: "Register", className: "btn-primary", onClick: () => { setTimeout(() => confirmRegister(id, rerender)); } });
        openModal({ title: c.id + " · " + c.title, body: courseDetailsHTML(c), actions });
      }
    });
  }

  // Rows for the registered courses table. withDrop adds a drop button column.
  function registeredTableHTML(ids, withDrop) {
    if (!ids.length) {
      return '<div class="empty-state"><div class="emoji">📚</div><p>You have not registered for any courses yet.</p>' +
        '<a class="btn btn-primary" href="catalog.html">Browse the catalog</a></div>';
    }
    const rows = ids.map(getCourse).map((c) =>
      "<tr><td><strong>" + c.id + "</strong></td><td>" + escapeHTML(c.title) + '</td><td><span class="dot" style="background:' + deptColor(c.dept) + '"></span>' + escapeHTML(c.dept) + "</td>" +
      "<td>" + escapeHTML(c.instructor) + "</td><td>" + c.days + " " + c.time + "</td><td>" + c.credits + "</td>" +
      (withDrop ? '<td><button class="btn btn-sm btn-danger" data-action="drop" data-id="' + c.id + '">Drop</button></td>' : "") + "</tr>"
    ).join("");
    return '<div class="table-wrap"><table><thead><tr><th>Code</th><th>Title</th><th>Department</th><th>Instructor</th><th>Schedule</th><th>Credits</th>' +
      (withDrop ? "<th>Action</th>" : "") + "</tr></thead><tbody>" + rows + "</tbody>" +
      '<tfoot><tr><td colspan="5">Total credits</td><td colspan="' + (withDrop ? 2 : 1) + '">' + totalCredits(ids) + " / " + MAX_CREDITS + "</td></tr></tfoot></table></div>";
  }

  document.addEventListener("DOMContentLoaded", initNav);

  window.UCR = {
    Store, getCourse, deptColor, escapeHTML, seatsLeft, seatsTaken, isFull, totalCredits, departments,
    findConflicts, openModal, closeModal, toast, courseCard, bindCardActions, confirmRegister, confirmDrop,
    registeredTableHTML
  };
})();
