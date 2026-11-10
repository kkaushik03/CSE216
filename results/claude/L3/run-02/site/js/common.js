/* Shared behaviour for every page: mobile menu and status announcements. */
"use strict";

(function () {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("primary-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  /* Reset the menu state when the layout switches between mobile and desktop. */
  const wide = window.matchMedia("(min-width: 48em)");
  function onChange() { if (wide.matches) setOpen(false); }
  if (wide.addEventListener) wide.addEventListener("change", onChange);
})();

/* Writes a message to the page's role="status" element.
   Clearing first makes screen readers announce the same text twice in a row. */
function announce(message) {
  const region = document.getElementById("status");
  if (!region) return;
  region.textContent = "";
  window.setTimeout(function () { region.textContent = message; }, 100);
}
