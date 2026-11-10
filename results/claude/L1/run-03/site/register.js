// Registration page: student form, course picker, confirmation modal, registered table.
document.addEventListener("DOMContentLoaded", () => {
  const { Store, getCourse, deptColor, escapeHTML, isFull, totalCredits, departments, findConflicts, openModal, toast, registeredTableHTML, bindCardActions } = UCR;
  const $ = (id) => document.getElementById(id);
  const form = $("reg-form");
  const selected = new Set();
  const fields = { name: $("r-name"), studentId: $("r-id"), email: $("r-email"), major: $("r-major"), year: $("r-year"), term: $("r-term") };

  $("max-credits").textContent = MAX_CREDITS;
  departments().forEach((d) => { $("r-major").add(new Option(d, d)); $("pick-dept").add(new Option(d, d)); });
  ["Undeclared"].forEach((d) => $("r-major").add(new Option(d, d)));

  // Prefill student info from saved profile.
  const s = Store.getStudent();
  fields.name.value = s.name;
  fields.studentId.value = s.studentId;
  fields.email.value = s.email;
  fields.major.value = s.major;
  fields.year.value = s.year;
  if (s.term) fields.term.value = s.term;

  // Preselect a course passed via ?add=ID
  const addId = new URLSearchParams(window.location.search).get("add");
  if (addId && getCourse(addId) && !Store.isRegistered(addId) && !isFull(getCourse(addId))) selected.add(addId);

  function renderPicker() {
    const term = $("pick-q").value.trim().toLowerCase();
    const d = $("pick-dept").value;
    const reg = Store.getRegistered();
    const list = COURSES.filter((c) =>
      (!d || c.dept === d) &&
      (!term || (c.id + " " + c.title + " " + c.instructor).toLowerCase().includes(term)));
    $("picker").innerHTML = list.length ? list.map((c) => {
      const already = reg.includes(c.id);
      const full = isFull(c);
      const disabled = already || full;
      const note = already ? " · ✔ already registered" : full ? " · full" : "";
      return '<label class="pick' + (disabled ? " disabled" : "") + '" style="--dept:' + deptColor(c.dept) + '">' +
        '<input type="checkbox" value="' + c.id + '"' + (already || selected.has(c.id) ? " checked" : "") + (disabled ? " disabled" : "") + ">" +
        '<span class="pick-info"><strong>' + c.id + "</strong> " + escapeHTML(c.title) +
        "<small>" + c.days + " " + c.time + " · " + c.credits + " cr" + note + "</small></span></label>";
    }).join("") : '<p style="color:var(--muted)">No courses match.</p>';
  }

  function renderSummary() {
    const reg = Store.getRegistered();
    const ids = Array.from(selected);
    const total = totalCredits(reg) + totalCredits(ids);
    $("summary").innerHTML = ids.length
      ? ids.map((id) => { const c = getCourse(id); return "<li><span>" + c.id + " " + escapeHTML(c.title) + "</span><strong>" + c.credits + " cr</strong></li>"; }).join("")
      : '<li style="color:var(--muted)">No new courses selected yet.</li>';
    $("credit-text").textContent = "Credits: " + total + " / " + MAX_CREDITS + (reg.length ? " (incl. " + totalCredits(reg) + " already registered)" : "");
    const meter = $("credit-meter");
    meter.querySelector("span").style.width = Math.min(100, (total / MAX_CREDITS) * 100) + "%";
    meter.classList.toggle("over", total > MAX_CREDITS);
    const pairs = findConflicts(reg.concat(ids));
    $("conflict-msg").textContent = pairs.length ? "⚠ Time conflict: " + pairs.map((p) => p[0].id + " & " + p[1].id).join(", ") : "";
  }

  function renderTable() {
    $("reg-table").innerHTML = registeredTableHTML(Store.getRegistered(), true);
  }

  function renderAll() { renderPicker(); renderSummary(); renderTable(); }

  $("picker").addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    if (e.target.checked) selected.add(e.target.value); else selected.delete(e.target.value);
    $("e-courses").textContent = "";
    renderSummary();
  });
  $("pick-q").addEventListener("input", renderPicker);
  $("pick-dept").addEventListener("change", renderPicker);

  function setError(field, msg) {
    const el = $("e-" + field);
    if (el) el.textContent = msg || "";
    if (fields[field] && fields[field].classList) fields[field].classList.toggle("invalid", !!msg);
    return !msg;
  }

  function validate() {
    let ok = true;
    ok = setError("name", fields.name.value.trim().length < 2 ? "Please enter your full name." : "") && ok;
    ok = setError("studentId", /^S\d{4}-\d{4}$/.test(fields.studentId.value.trim()) ? "" : "Format: S2026-0147") && ok;
    ok = setError("email", /^[^\s@]+@[^\s@]+\.edu$/i.test(fields.email.value.trim()) ? "" : "Use your university (.edu) email.") && ok;
    ok = setError("major", fields.major.value ? "" : "Select your major.") && ok;
    const total = totalCredits(Store.getRegistered()) + totalCredits(Array.from(selected));
    let courseMsg = "";
    if (!selected.size) courseMsg = "Select at least one new course.";
    else if (total > MAX_CREDITS) courseMsg = "Total credits (" + total + ") exceed the " + MAX_CREDITS + "-credit limit.";
    $("e-courses").textContent = courseMsg;
    ok = !courseMsg && ok;
    const agree = $("r-agree").checked;
    $("e-agree").textContent = agree ? "" : "Please confirm prerequisites.";
    return ok && agree;
  }

  ["name", "studentId", "email"].forEach((f) => fields[f].addEventListener("input", () => setError(f, "")));
  $("r-agree").addEventListener("change", () => { $("e-agree").textContent = ""; });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) {
      toast("Please fix the highlighted fields.", "warn");
      return;
    }
    const ids = Array.from(selected);
    const student = {
      name: fields.name.value.trim(), studentId: fields.studentId.value.trim(), email: fields.email.value.trim(),
      major: fields.major.value, year: fields.year.value, term: fields.term.value
    };
    const pairs = findConflicts(Store.getRegistered().concat(ids));
    const total = totalCredits(Store.getRegistered()) + totalCredits(ids);
    const body =
      "<p>Please review your registration for <strong>" + escapeHTML(student.term) + "</strong>.</p>" +
      '<ul class="profile-details">' +
      "<li><span>Student</span><strong>" + escapeHTML(student.name) + "</strong></li>" +
      "<li><span>ID</span><strong>" + escapeHTML(student.studentId) + "</strong></li>" +
      "<li><span>Email</span><strong>" + escapeHTML(student.email) + "</strong></li></ul>" +
      "<h3>New courses</h3><ul class=\"summary-list\">" +
      ids.map((id) => { const c = getCourse(id); return "<li><span>" + c.id + " – " + escapeHTML(c.title) + "<br><small>" + c.days + " " + c.time + "</small></span><strong>" + c.credits + " cr</strong></li>"; }).join("") +
      "</ul><p><strong>Total credits after registration: " + total + " / " + MAX_CREDITS + "</strong></p>" +
      (pairs.length ? '<p class="error">⚠ Time conflicts: ' + pairs.map((p) => p[0].id + " & " + p[1].id).join(", ") + "</p>" : "");

    openModal({
      title: "Confirm registration",
      body,
      actions: [
        { label: "Go back", className: "btn-outline" },
        { label: "Confirm & register", className: "btn-primary", onClick: () => {
          Store.setStudent(student);
          Store.add(ids);
          selected.clear();
          $("r-agree").checked = false;
          renderAll();
          setTimeout(() => openModal({
            title: "🎉 You're registered!",
            body: "<p>You have successfully registered for <strong>" + ids.length + "</strong> course" + (ids.length === 1 ? "" : "s") + ". A confirmation was sent to <strong>" + escapeHTML(student.email) + "</strong>.</p>",
            actions: [
              { label: "Stay here", className: "btn-outline" },
              { label: "View profile", className: "btn-primary", onClick: () => { window.location.href = "profile.html"; } }
            ]
          }));
        } }
      ]
    });
  });

  bindCardActions($("reg-table"), renderAll);
  renderAll();
});
