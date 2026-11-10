/* Course catalog page: search, filter dropdowns, sorting and course cards. */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var U = window.UCR;
  var form = document.getElementById("filters");
  var list = document.getElementById("course-list");
  var countEl = document.getElementById("results-count");
  var emptyState = document.getElementById("empty-state");
  var selectionBar = document.getElementById("selection-bar");
  var selectionText = document.getElementById("selection-text");
  var fields = {
    q: document.getElementById("q"),
    dept: document.getElementById("dept"),
    level: document.getElementById("level"),
    credits: document.getElementById("credits"),
    day: document.getElementById("day"),
    sort: document.getElementById("sort"),
    open: document.getElementById("open")
  };

  /* department options from data */
  U.DATA.departments.forEach(function (d) {
    var opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.name;
    fields.dept.appendChild(opt);
  });

  /* restore filters from the URL (e.g. links from the home page) */
  var params = new URLSearchParams(window.location.search);
  if (params.get("q")) fields.q.value = params.get("q");
  ["dept", "level", "credits", "day", "sort"].forEach(function (k) {
    var v = params.get(k);
    if (v && fields[k].querySelector('option[value="' + CSS.escape(v) + '"]')) fields[k].value = v;
  });
  if (params.get("open") === "1") fields.open.checked = true;

  function normalize(s) { return s.toLowerCase().replace(/\s+/g, " ").trim(); }

  function filtered() {
    var q = normalize(fields.q.value);
    var compactQ = q.replace(/\s/g, "");
    var out = U.DATA.courses.filter(function (c) {
      if (fields.dept.value && c.dept !== fields.dept.value) return false;
      if (fields.level.value && String(c.level) !== fields.level.value) return false;
      if (fields.credits.value && String(c.credits) !== fields.credits.value) return false;
      if (fields.day.value && c.days.indexOf(fields.day.value) === -1) return false;
      if (fields.open.checked && c.seats === 0) return false;
      if (q) {
        var hay = normalize([c.code, c.title, c.instructor, c.description, U.findDept(c.dept).name].join(" "));
        /* allow "cs101" to match "CS 101" */
        if (hay.indexOf(q) === -1 && c.code.toLowerCase().replace(/\s/g, "").indexOf(compactQ) === -1) return false;
      }
      return true;
    });
    var sort = fields.sort.value;
    out.sort(function (a, b) {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "seats") return b.seats - a.seats || a.code.localeCompare(b.code);
      if (sort === "credits") return b.credits - a.credits || a.code.localeCompare(b.code);
      return a.code.localeCompare(b.code, undefined, { numeric: true });
    });
    return out;
  }

  function syncURL() {
    var p = new URLSearchParams();
    if (fields.q.value.trim()) p.set("q", fields.q.value.trim());
    ["dept", "level", "credits", "day"].forEach(function (k) { if (fields[k].value) p.set(k, fields[k].value); });
    if (fields.sort.value !== "code") p.set("sort", fields.sort.value);
    if (fields.open.checked) p.set("open", "1");
    var qs = p.toString();
    window.history.replaceState(null, "", qs ? "?" + qs : window.location.pathname);
  }

  function renderSelection() {
    var n = U.store.getSelected().length;
    selectionBar.hidden = n === 0;
    selectionText.textContent = n === 1 ? "1 course selected" : n + " courses selected";
  }

  function render() {
    var results = filtered();
    var selected = U.store.getSelected();
    list.innerHTML = results.map(function (c) {
      return "<li>" + U.courseCardHTML(c, { selected: selected.indexOf(c.code) !== -1 }) + "</li>";
    }).join("");
    emptyState.hidden = results.length !== 0;
    renderSelection();
    return results.length;
  }

  var total = U.DATA.courses.length;
  function updateCount(n) {
    countEl.textContent = n === total
      ? "Showing all " + total + " courses"
      : "Showing " + n + " of " + total + " courses";
  }

  var timer;
  function update(immediate) {
    window.clearTimeout(timer);
    var run = function () {
      updateCount(render());
      syncURL();
    };
    /* debounce typing so screen readers aren't flooded with result counts */
    if (immediate) run(); else timer = window.setTimeout(run, 350);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); update(true); });
  fields.q.addEventListener("input", function () { update(false); });
  ["dept", "level", "credits", "day", "sort", "open"].forEach(function (k) {
    fields[k].addEventListener("change", function () { update(true); });
  });
  form.addEventListener("reset", function () {
    /* the reset happens after this event; render once fields are cleared */
    window.setTimeout(function () { update(true); }, 0);
  });
  document.getElementById("empty-clear").addEventListener("click", function () {
    form.reset();
    fields.q.focus();
  });

  U.bindCardToggles(list, function () { render(); });

  update(true);
});
