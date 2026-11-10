// Profile page: student info, stats, registered courses table, edit modal.
document.addEventListener("DOMContentLoaded", () => {
  const { Store, getCourse, escapeHTML, totalCredits, departments, registeredTableHTML, bindCardActions, openModal, toast } = UCR;
  const $ = (id) => document.getElementById(id);

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
  }

  function render() {
    const s = Store.getStudent();
    const reg = Store.getRegistered();
    $("avatar").textContent = initials(s.name);
    $("p-name").textContent = s.name;
    $("p-major").textContent = s.major + " · " + s.year;
    $("p-details").innerHTML =
      "<li><span>Student ID</span><strong>" + escapeHTML(s.studentId) + "</strong></li>" +
      "<li><span>Email</span><strong>" + escapeHTML(s.email) + "</strong></li>" +
      "<li><span>Advisor</span><strong>" + escapeHTML(s.advisor || "—") + "</strong></li>" +
      "<li><span>Term</span><strong>" + escapeHTML(s.term || "Spring 2027") + "</strong></li>";

    const credits = totalCredits(reg);
    $("p-stats").innerHTML =
      '<div class="stat"><strong>' + reg.length + "</strong>Courses</div>" +
      '<div class="stat"><strong>' + credits + "</strong>Credits</div>" +
      '<div class="stat"><strong>' + (MAX_CREDITS - credits) + "</strong>Credits available</div>";

    const term = $("p-q").value.trim().toLowerCase();
    const filtered = reg.filter((id) => {
      const c = getCourse(id);
      return !term || (c.id + " " + c.title + " " + c.instructor + " " + c.dept).toLowerCase().includes(term);
    });
    $("p-table").innerHTML = reg.length && !filtered.length
      ? '<div class="empty-state"><div class="emoji">🔍</div><p>No registered courses match “' + escapeHTML(term) + "”.</p></div>"
      : registeredTableHTML(filtered, true);
  }

  $("p-q").addEventListener("input", render);

  $("edit-profile").addEventListener("click", () => {
    const s = Store.getStudent();
    const majors = departments().concat(["Undeclared"]);
    const years = ["Freshman", "Sophomore", "Junior", "Senior"];
    openModal({
      title: "Edit profile",
      body:
        '<form id="edit-form" class="form-grid" novalidate>' +
        '<div class="full"><label for="ed-name">Full name</label><input id="ed-name" value="' + escapeHTML(s.name) + '"></div>' +
        '<div class="full"><label for="ed-email">Email</label><input id="ed-email" type="email" value="' + escapeHTML(s.email) + '"></div>' +
        '<div><label for="ed-major">Major</label><select id="ed-major">' + majors.map((m) => "<option" + (m === s.major ? " selected" : "") + ">" + escapeHTML(m) + "</option>").join("") + "</select></div>" +
        '<div><label for="ed-year">Year</label><select id="ed-year">' + years.map((y) => "<option" + (y === s.year ? " selected" : "") + ">" + y + "</option>").join("") + "</select></div>" +
        '<span class="error full" id="ed-error"></span></form>',
      actions: [
        { label: "Cancel", className: "btn-outline" },
        { label: "Save", className: "btn-primary", onClick: () => {
          const name = $("ed-name").value.trim();
          const email = $("ed-email").value.trim();
          if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $("ed-error").textContent = "Please enter a valid name and email.";
            return false;
          }
          Store.setStudent(Object.assign(s, { name, email, major: $("ed-major").value, year: $("ed-year").value }));
          toast("Profile updated", "success");
          render();
        } }
      ]
    });
  });

  bindCardActions($("p-table"), render);
  render();
});
