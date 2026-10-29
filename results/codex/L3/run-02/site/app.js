(() => {
  'use strict';

  const courses = [
    {code:'BIO 110',title:'Life in a Changing Planet',school:'School of Arts & Sciences',format:'In person',credits:4,days:'Mon / Wed',time:'9:30–10:45 a.m.',description:'Explore the living systems shaping our planet, from local habitats to global ecosystems.'},
    {code:'ART 214',title:'Color, Form & Feeling',school:'School of Design',format:'In person',credits:3,days:'Tue / Thu',time:'10:00–11:15 a.m.',description:'Build a visual vocabulary through studio experiments with color, shape, and meaning.'},
    {code:'CSE 160',title:'Creative Computing',school:'School of Engineering',format:'Hybrid',credits:4,days:'Mon / Wed',time:'1:00–2:15 p.m.',description:'Use code as a creative tool to make interactive experiences and playful projects.'},
    {code:'HIS 202',title:'Cities Through Time',school:'School of Arts & Sciences',format:'Online',credits:3,days:'Tue / Thu',time:'11:30 a.m.–12:45 p.m.',description:'Trace how cities grow, change, and reflect the people who call them home.'},
    {code:'ENV 230',title:'Food, Land & Justice',school:'School of Earth & Environment',format:'In person',credits:3,days:'Mon / Wed',time:'2:30–3:45 p.m.',description:'Study the connections between food systems, land stewardship, and community wellbeing.'},
    {code:'MUS 118',title:'Listening Lab',school:'School of Arts & Sciences',format:'Hybrid',credits:2,days:'Friday',time:'10:00 a.m.–12:00 p.m.',description:'Train your ear and discover how sound can tell stories across cultures and genres.'},
    {code:'PSY 205',title:'The Social Mind',school:'School of Arts & Sciences',format:'In person',credits:3,days:'Tue / Thu',time:'1:00–2:15 p.m.',description:'Investigate how relationships, groups, and shared spaces shape human behavior.'},
    {code:'DES 145',title:'Design for Everyday Life',school:'School of Design',format:'In person',credits:3,days:'Mon / Wed',time:'11:00 a.m.–12:15 p.m.',description:'Practice human-centered design by reimagining the objects and services around us.'},
    {code:'MAT 221',title:'Patterns in Nature',school:'School of Mathematics',format:'Online',credits:4,days:'Tue / Thu',time:'9:00–10:15 a.m.',description:'Find mathematical structure in plants, weather, movement, and the natural world.'},
    {code:'COM 178',title:'Stories That Move Us',school:'School of Media & Communication',format:'Hybrid',credits:3,days:'Mon / Wed',time:'3:00–4:15 p.m.',description:'Learn the craft of clear, memorable storytelling across modern media.'},
    {code:'ENG 310',title:'Writing the Future',school:'School of Arts & Sciences',format:'In person',credits:3,days:'Tue / Thu',time:'2:30–3:45 p.m.',description:'Create speculative fiction that asks thoughtful questions about tomorrow.'},
    {code:'BUS 240',title:'Ideas into Impact',school:'School of Business',format:'In person',credits:3,days:'Friday',time:'1:00–3:30 p.m.',description:'Turn promising ideas into useful ventures through collaboration and experimentation.'}
  ];

  const views = ['home','catalog','registration','profile'];
  const navLinks = [...document.querySelectorAll('[data-view]')];
  const grid = document.getElementById('course-grid');
  const selected = new Set();
  const status = document.getElementById('app-status');
  const dialog = document.getElementById('confirm-dialog');
  let registered = false;

  function announce(message) { status.textContent = ''; window.setTimeout(() => { status.textContent = message; }, 20); }
  function currentView() {
    const value = location.hash.replace(/^#/, '');
    return views.includes(value) ? value : 'home';
  }
  function showView(view, moveFocus = true) {
    views.forEach(name => { document.getElementById(`view-${name}`).hidden = name !== view; });
    navLinks.forEach(link => {
      if (link.dataset.view === view) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    document.title = `${view === 'home' ? 'Home' : view === 'catalog' ? 'Course Catalog' : view === 'registration' ? 'Registration' : 'Student Profile'} | Northstar University`;
    if (moveFocus) document.getElementById(`${view}-title`).focus();
    if (view === 'registration') renderRegistration();
    if (view === 'profile') renderProfile();
  }

  function makeCourseCard(course) {
    const li = document.createElement('li');
    const card = document.createElement('article');
    card.className = 'course-card';
    const meta = document.createElement('div'); meta.className = 'course-meta';
    const code = document.createElement('span'); code.className = 'course-code'; code.textContent = course.code;
    const format = document.createElement('span'); format.className = 'course-format'; format.textContent = course.format;
    meta.append(code, format);
    const heading = document.createElement('h2'); heading.textContent = course.title;
    const school = document.createElement('p'); school.className = 'course-school'; school.textContent = course.school;
    const description = document.createElement('p'); description.className = 'course-description'; description.textContent = course.description;
    const foot = document.createElement('div'); foot.className = 'course-foot';
    const detail = document.createElement('span'); detail.className = 'course-detail'; detail.textContent = `${course.credits} credits · ${course.days}`;
    const button = document.createElement('button'); button.className = 'add-course'; button.type = 'button';
    button.dataset.course = course.code;
    button.setAttribute('aria-pressed', String(selected.has(course.code)));
    button.textContent = selected.has(course.code) ? 'Added ✓' : 'Add course';
    button.setAttribute('aria-label', `${button.textContent} ${course.code}, ${course.title}`);
    foot.append(detail, button); card.append(meta, heading, school, description, foot); li.append(card);
    return li;
  }

  function renderCatalog() {
    const query = document.getElementById('course-search').value.trim().toLowerCase();
    const school = document.getElementById('school-filter').value;
    const format = document.getElementById('format-filter').value;
    const matches = courses.filter(course => {
      const searchable = `${course.code} ${course.title} ${course.school} ${course.format} ${course.description}`.toLowerCase();
      return searchable.includes(query) && (school === 'all' || course.school === school) && (format === 'all' || course.format === format);
    });
    grid.replaceChildren(...matches.map(makeCourseCard));
    const message = `${matches.length} ${matches.length === 1 ? 'course' : 'courses'} found`;
    document.getElementById('results-count').textContent = message;
    document.getElementById('course-total').textContent = String(matches.length);
    document.getElementById('empty-state').hidden = matches.length > 0;
  }

  function renderRegistration() {
    const rows = document.getElementById('registration-rows');
    rows.replaceChildren();
    const picked = courses.filter(course => selected.has(course.code));
    picked.forEach(course => {
      const tr = document.createElement('tr');
      const name = document.createElement('th'); name.scope = 'row'; name.textContent = `${course.code} · ${course.title}`;
      const schedule = document.createElement('td'); schedule.textContent = `${course.days}, ${course.time}`;
      const credits = document.createElement('td'); credits.textContent = String(course.credits);
      const action = document.createElement('td');
      const drop = document.createElement('button'); drop.className = 'drop-button'; drop.type = 'button'; drop.textContent = 'Drop';
      drop.setAttribute('aria-label', `Drop ${course.code}, ${course.title}`); drop.dataset.drop = course.code;
      action.append(drop); tr.append(name, schedule, credits, action); rows.append(tr);
    });
    const count = picked.length;
    const credits = picked.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('registration-empty').hidden = count > 0;
    document.getElementById('selected-count').textContent = String(count);
    document.getElementById('credit-total').textContent = String(credits);
    document.getElementById('nav-count').textContent = String(count);
    document.getElementById('open-confirm').disabled = count === 0;
    document.getElementById('open-confirm').textContent = registered ? 'Update registration →' : 'Confirm registration →';
    renderProfile();
  }

  function renderProfile() {
    const count = selected.size;
    const credits = courses.filter(course => selected.has(course.code)).reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('profile-course-count').textContent = String(count);
    document.getElementById('profile-credit-count').textContent = String(credits);
    document.getElementById('profile-status').textContent = registered ? 'Registered' : count ? 'Plan in progress' : 'Planning';
  }

  courses.map(course => course.school).filter((school, index, all) => all.indexOf(school) === index).sort().forEach(school => {
    const option = document.createElement('option'); option.value = school; option.textContent = school;
    document.getElementById('school-filter').append(option);
  });
  renderCatalog();
  showView(currentView(), false);
  window.addEventListener('hashchange', () => showView(currentView()));
  navLinks.forEach(link => link.addEventListener('click', () => {
    const menu = document.getElementById('primary-menu');
    const toggle = document.querySelector('.menu-toggle');
    if (menu.classList.contains('is-open')) { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); }
  }));

  const search = document.getElementById('course-search');
  search.addEventListener('input', renderCatalog);
  document.getElementById('search-form').addEventListener('submit', event => event.preventDefault());
  document.getElementById('school-filter').addEventListener('change', renderCatalog);
  document.getElementById('format-filter').addEventListener('change', renderCatalog);
  document.getElementById('clear-search').addEventListener('click', () => { search.value = ''; renderCatalog(); search.focus(); });
  document.getElementById('reset-filters').addEventListener('click', () => {
    search.value = ''; document.getElementById('school-filter').value = 'all'; document.getElementById('format-filter').value = 'all'; renderCatalog(); announce('Filters reset. 12 courses found.');
  });
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-course]'); if (!button) return;
    const code = button.dataset.course;
    if (selected.has(code)) { selected.delete(code); announce(`${code} removed from your plan.`); }
    else { selected.add(code); announce(`${code} added to your plan.`); }
    renderCatalog(); renderRegistration();
  });
  document.getElementById('registration-rows').addEventListener('click', event => {
    const button = event.target.closest('[data-drop]'); if (!button) return;
    const code = button.dataset.drop; selected.delete(code); registered = false;
    renderRegistration(); renderCatalog(); announce(`${code} dropped from your plan.`);
  });
  document.querySelector('.menu-toggle').addEventListener('click', event => {
    const button = event.currentTarget; const menu = document.getElementById('primary-menu');
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open)); menu.classList.toggle('is-open', open);
  });
  document.querySelector('.menu-toggle').addEventListener('keydown', event => {
    if (event.key === 'Escape' && event.currentTarget.getAttribute('aria-expanded') === 'true') {
      event.currentTarget.setAttribute('aria-expanded','false'); document.getElementById('primary-menu').classList.remove('is-open'); event.currentTarget.focus();
    }
  });
  document.getElementById('primary-menu').addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true') {
      const toggle = document.querySelector('.menu-toggle');
      toggle.setAttribute('aria-expanded','false');
      document.getElementById('primary-menu').classList.remove('is-open');
      toggle.focus();
    }
  });
  document.getElementById('open-confirm').addEventListener('click', () => {
    const picked = courses.filter(course => selected.has(course.code));
    document.getElementById('dialog-copy').textContent = `You’re about to ${registered ? 'update your registration to' : 'register for'} ${picked.length} ${picked.length === 1 ? 'course' : 'courses'} (${picked.reduce((sum, course) => sum + course.credits, 0)} credits).`;
    dialog.showModal(); dialog.querySelector('[value="cancel"]').focus();
  });
  document.getElementById('finish-registration').addEventListener('click', event => {
    event.preventDefault(); registered = true; dialog.close(); renderRegistration(); renderProfile(); announce('Registration saved. Your Spring 2026 courses are confirmed.');
  });
  dialog.addEventListener('close', () => {
    const opener = document.getElementById('open-confirm');
    if (opener && !opener.disabled) opener.focus();
  });
})();
