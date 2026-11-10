document.addEventListener("DOMContentLoaded", () => {
  const { Store, getCourse, deptColor, escapeHTML, openModal, toast } = App;

  const tbody = document.getElementById("reg-tbody");
  const tableWrap = document.getElementById("reg-table-wrap");
  const empty = document.getElementById("reg-empty");
  const tableSearch = document.getElementById("table-search");
  const termFilter = document.getElementById("table-term");
  let sortKey = "id";
  let sortDir = 1;

  function renderProfile() {
    const p = Store.getProfile();
    const initials = p.name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    document.getElementById("avatar").textContent = initials || "?";
    document.getElementById("p-name").textContent = p.name;
    document.getElementById("p-major").textContent = `${p.major} · ${p.year}`;
    document.getElementById("p-id").textContent = p.studentId;
    document.getElementById("p-email").textContent = p.email;
    document.getElementById("p-advisor").textContent = p.advisor;
  }

  function rows() {
    return Store.getRegistrations()
      .map((r) => ({ ...getCourse(r.courseId), term: r.term, date: r.date }))
      .filter((r) => r.id);
  }

  function renderStats() {
    const all = rows();
    const credits = all.reduce((s, r) => s + r.credits, 0);
    document.getElementById("s-courses").textContent = all.length;
    document.getElementById("s-credits").textContent = credits;
    document.getElementById("s-remaining").textContent = Math.max(0, MAX_CREDITS - credits);
    document.getElementById("s-depts").textContent = new Set(all.map((r) => r.dept)).size;
    document.getElementById("profile-meter").style.width = `${Math.min(100, (credits / MAX_CREDITS) * 100)}%`;

    // Term filter options
    const terms = [...new Set(all.map((r) => r.term))].sort();
    const prev = termFilter.value;
    termFilter.innerHTML = `<option value="">All terms</option>` + terms.map((t) => `<option>${escapeHTML(t)}</option>`).join("");
    termFilter.value = terms.includes(prev) ? prev : "";
  }

  function renderTable() {
    const all = rows();
    const q = tableSearch.value.trim().toLowerCase();
    const term = termFilter.value;
    const list = all
      .filter((r) => (!term || r.term === term) && (!q || `${r.id} ${r.title} ${r.instructor} ${r.dept}`.toLowerCase().includes(q)))
      .sort((a, b) => {
        const x = a[sortKey];
        const y = b[sortKey];
        return (typeof x === "number" ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })) * sortDir;
      });

    empty.hidden = all.length > 0;
    tableWrap.hidden = all.length === 0;
    document.querySelector(".table-tools").hidden = all.length === 0;

    tbody.innerHTML = list.length
      ? list
          .map(
            (r) => `<tr style="--accent:${deptColor(r.dept)}">
          <td data-label="Code"><span class="code-pill">${r.id}</span></td>
          <td data-label="Course">${escapeHTML(r.title)}</td>
          <td data-label="Department">${escapeHTML(r.dept)}</td>
          <td data-label="Instructor">${escapeHTML(r.instructor)}</td>
          <td data-label="Schedule">${escapeHTML(r.schedule)}</td>
          <td data-label="Credits">${r.credits}</td>
          <td data-label="Term">${escapeHTML(r.term)}</td>
          <td data-label="Registered">${new Date(r.date).toLocaleDateString()}</td>
          <td data-label="Action"><button class="btn btn-danger btn-sm" data-drop="${r.id}">Drop</button></td>
        </tr>`
          )
          .join("")
      : `<tr><td colspan="9" class="muted center">No registered courses match your filter.</td></tr>`;

    const total = list.reduce((s, r) => s + r.credits, 0);
    document.getElementById("reg-total").textContent = `${total} credits`;

    document.querySelectorAll("th[data-sort]").forEach((th) => {
      const active = th.dataset.sort === sortKey;
      th.setAttribute("aria-sort", active ? (sortDir === 1 ? "ascending" : "descending") : "none");
    });
  }

  function refresh() {
    renderStats();
    renderTable();
    App.renderNav();
  }

  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-drop]");
    if (!btn) return;
    const c = getCourse(btn.dataset.drop);
    openModal({
      title: "Drop course?",
      body: `<p>Are you sure you want to drop <strong>${c.id} – ${escapeHTML(c.title)}</strong> (${c.credits} credits)?</p>
             <p class="muted">Your seat will be released to other students.</p>`,
      confirmText: "Yes, drop course",
      variant: "danger",
      onConfirm: () => {
        Store.drop(c.id);
        refresh();
        toast(`${c.id} has been dropped.`, "info");
      },
    });
  });

  document.querySelectorAll("th[data-sort]").forEach((th) => {
    const activate = () => {
      if (sortKey === th.dataset.sort) sortDir *= -1;
      else {
        sortKey = th.dataset.sort;
        sortDir = 1;
      }
      renderTable();
    };
    th.addEventListener("click", activate);
    th.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  tableSearch.addEventListener("input", renderTable);
  termFilter.addEventListener("change", renderTable);

  document.getElementById("drop-all").addEventListener("click", () => {
    const n = Store.getRegistrations().length;
    if (!n) return;
    openModal({
      title: "Drop all courses?",
      body: `<p>This will drop all <strong>${n}</strong> registered course${n === 1 ? "" : "s"}. This cannot be undone.</p>`,
      confirmText: "Drop all",
      variant: "danger",
      onConfirm: () => {
        Store.saveRegistrations([]);
        refresh();
        toast("All courses dropped.", "info");
      },
    });
  });

  renderProfile();
  renderStats();
  renderTable();
});
