document.addEventListener("DOMContentLoaded", () => {
  const { Store, getCourse, seatsLeft, deptColor, escapeHTML, openModal, toast } = App;

  const form = document.getElementById("register-form");
  const list = document.getElementById("course-options");
  const pickerSearch = document.getElementById("picker-search");
  const pickerDept = document.getElementById("picker-dept");
  const summaryList = document.getElementById("summary-list");
  const summaryCredits = document.getElementById("summary-credits");
  const creditMeter = document.getElementById("credit-meter");
  const courseError = document.getElementById("course-error");

  const selected = new Set();
  const preselect = new URLSearchParams(location.search).get("course");
  if (preselect && getCourse(preselect) && !Store.isRegistered(preselect) && seatsLeft(getCourse(preselect)) > 0) {
    selected.add(preselect);
  }

  // Prefill student info from saved profile
  const profile = Store.getProfile();
  ["name", "studentId", "email", "major", "year"].forEach((k) => {
    if (form.elements[k]) form.elements[k].value = profile[k] || "";
  });

  [...new Set(COURSES.map((c) => c.dept))].sort().forEach((d) => {
    pickerDept.insertAdjacentHTML("beforeend", `<option value="${escapeHTML(d)}">${escapeHTML(d)}</option>`);
  });

  function currentCredits() {
    return Store.totalCredits() + [...selected].reduce((s, id) => s + getCourse(id).credits, 0);
  }

  function renderOptions() {
    const q = pickerSearch.value.trim().toLowerCase();
    const dept = pickerDept.value;
    const items = COURSES.filter(
      (c) => (!dept || c.dept === dept) && (!q || `${c.id} ${c.title} ${c.instructor}`.toLowerCase().includes(q))
    );
    if (!items.length) {
      list.innerHTML = `<p class="muted">No courses match your search.</p>`;
      return;
    }
    list.innerHTML = items
      .map((c) => {
        const registered = Store.isRegistered(c.id);
        const full = seatsLeft(c) === 0 && !registered;
        const disabled = registered || full;
        const status = registered ? "Already registered" : full ? "Full" : `${seatsLeft(c)} seats left`;
        return `<label class="course-option ${disabled ? "is-disabled" : ""}" style="--accent:${deptColor(c.dept)}">
          <input type="checkbox" name="courses" value="${c.id}" ${selected.has(c.id) ? "checked" : ""} ${disabled ? "disabled" : ""}>
          <span class="option-body">
            <span class="option-title"><strong>${c.id}</strong> · ${escapeHTML(c.title)}</span>
            <span class="option-meta">${escapeHTML(c.schedule)} · ${c.credits} cr · <em>${status}</em></span>
          </span>
        </label>`;
      })
      .join("");
  }

  function renderSummary() {
    const ids = [...selected];
    summaryList.innerHTML = ids.length
      ? ids
          .map((id) => {
            const c = getCourse(id);
            return `<li style="--accent:${deptColor(c.dept)}"><span><strong>${c.id}</strong> ${escapeHTML(c.title)}</span>
              <button type="button" class="remove-btn" data-id="${c.id}" aria-label="Remove ${c.id}">×</button></li>`;
          })
          .join("")
      : `<li class="muted empty">No courses selected yet.</li>`;
    const total = currentCredits();
    summaryCredits.textContent = `${total} / ${MAX_CREDITS}`;
    creditMeter.style.width = `${Math.min(100, (total / MAX_CREDITS) * 100)}%`;
    creditMeter.classList.toggle("over", total > MAX_CREDITS);
  }

  list.addEventListener("change", (e) => {
    if (e.target.name !== "courses") return;
    if (e.target.checked) selected.add(e.target.value);
    else selected.delete(e.target.value);
    courseError.textContent = "";
    renderSummary();
  });
  summaryList.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-btn");
    if (!btn) return;
    selected.delete(btn.dataset.id);
    renderOptions();
    renderSummary();
  });
  pickerSearch.addEventListener("input", renderOptions);
  pickerDept.addEventListener("change", renderOptions);

  // Validation
  function setError(field, msg) {
    const el = form.elements[field];
    const err = document.getElementById(`${field}-error`);
    if (el) el.classList.toggle("invalid", !!msg);
    if (el) el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg || "";
    return !msg;
  }

  function validate() {
    const v = (k) => form.elements[k].value.trim();
    let ok = true;
    ok = setError("name", v("name").length < 2 ? "Please enter your full name." : "") && ok;
    ok = setError("studentId", !/^[A-Za-z0-9-]{4,}$/.test(v("studentId")) ? "Enter a valid student ID (e.g. S2026-0417)." : "") && ok;
    ok = setError("email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")) ? "Enter a valid email address." : "") && ok;
    ok = setError("major", !v("major") ? "Please choose your major." : "") && ok;
    ok = setError("year", !v("year") ? "Please choose your year." : "") && ok;
    ok = setError("term", !v("term") ? "Please choose a term." : "") && ok;
    ok = setError("agree", !form.elements.agree.checked ? "You must accept the registration policy." : "") && ok;

    if (selected.size === 0) {
      courseError.textContent = "Select at least one course.";
      ok = false;
    } else if (currentCredits() > MAX_CREDITS) {
      courseError.textContent = `Total credits (${currentCredits()}) exceed the ${MAX_CREDITS}-credit limit.`;
      ok = false;
    } else {
      courseError.textContent = "";
    }
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstBad = form.querySelector(".invalid") || list;
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      toast("Please fix the highlighted fields.", "error");
      return;
    }
    const ids = [...selected];
    const term = form.elements.term.value;
    const credits = ids.reduce((s, id) => s + getCourse(id).credits, 0);
    const rows = ids
      .map((id) => {
        const c = getCourse(id);
        return `<tr><td><strong>${c.id}</strong></td><td>${escapeHTML(c.title)}</td><td>${c.credits}</td></tr>`;
      })
      .join("");

    openModal({
      title: "Confirm your registration",
      confirmText: "Confirm registration",
      body: `
        <p>Please review your registration for <strong>${escapeHTML(term)}</strong>:</p>
        <dl class="confirm-details">
          <dt>Student</dt><dd>${escapeHTML(form.elements.name.value.trim())} (${escapeHTML(form.elements.studentId.value.trim())})</dd>
          <dt>Email</dt><dd>${escapeHTML(form.elements.email.value.trim())}</dd>
        </dl>
        <div class="table-wrap"><table class="mini-table">
          <thead><tr><th>Code</th><th>Course</th><th>Credits</th></tr></thead>
          <tbody>${rows}</tbody>
          <tfoot><tr><td colspan="2">Total new credits</td><td>${credits}</td></tr></tfoot>
        </table></div>`,
      onConfirm: () => {
        Store.saveProfile({
          name: form.elements.name.value.trim(),
          studentId: form.elements.studentId.value.trim(),
          email: form.elements.email.value.trim(),
          major: form.elements.major.value,
          year: form.elements.year.value,
          advisor: profile.advisor,
        });
        Store.addRegistrations(ids, term);
        selected.clear();
        form.elements.agree.checked = false;
        form.elements.notes.value = "";
        App.renderNav();
        renderOptions();
        renderSummary();
        openModal({
          title: "🎉 Registration complete!",
          body: `<p>You are now registered for <strong>${ids.length}</strong> course${ids.length === 1 ? "" : "s"} (${credits} credits).</p>
                 <p>You can review or drop courses on your profile page.</p>`,
          confirmText: "View my profile",
          cancelText: "Register more",
          variant: "success",
          onConfirm: () => (location.href = "profile.html"),
        });
      },
    });
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      selected.clear();
      form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
      form.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));
      renderOptions();
      renderSummary();
    });
  });

  renderOptions();
  renderSummary();
});
