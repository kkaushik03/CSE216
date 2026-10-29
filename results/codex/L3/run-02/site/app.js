const courses = [
  {id:'BIO-214',title:'The Secret Life of Plants',department:'Biology',schedule:'Morning',time:'Mon · Wed · 9:30 AM',instructor:'Prof. Maya Chen',credits:3,seats:8,description:'Explore the remarkable ways plants communicate, adapt, and shape the world around us.',popular:true},
  {id:'ART-108',title:'Color, Form & Feeling',department:'Art & Design',schedule:'Afternoon',time:'Tue · Thu · 1:00 PM',instructor:'Prof. Eli Rivera',credits:3,seats:12,description:'A hands-on introduction to visual storytelling, creative practice, and seeing differently.',popular:true},
  {id:'PSY-230',title:'The Science of Happiness',department:'Psychology',schedule:'Morning',time:'Mon · Wed · 10:00 AM',instructor:'Dr. Naomi Brooks',credits:3,seats:5,description:'What makes a good life? Examine the psychology behind wellbeing, joy, and human connection.',popular:true},
  {id:'HIS-162',title:'Food, Culture & History',department:'History',schedule:'Afternoon',time:'Tue · Thu · 2:30 PM',instructor:'Dr. Samir Patel',credits:3,seats:16,description:'Travel through time by way of the table and discover how food shaped civilizations.',popular:false},
  {id:'CSC-105',title:'Creative Coding Lab',department:'Computer Science',schedule:'Evening',time:'Wed · Fri · 5:00 PM',instructor:'Prof. June Park',credits:4,seats:9,description:'Make interactive art and playful experiments while learning the foundations of code.',popular:false},
  {id:'ENV-201',title:'Our Changing Planet',department:'Environmental Studies',schedule:'Morning',time:'Tue · Thu · 9:00 AM',instructor:'Dr. Alex Morgan',credits:4,seats:7,description:'Understand the forces transforming Earth and imagine practical paths toward a better future.',popular:false},
  {id:'LIT-244',title:'Stories of the Sea',department:'Literature',schedule:'Evening',time:'Mon · Wed · 6:00 PM',instructor:'Prof. Lena Ward',credits:3,seats:14,description:'From ancient epics to modern novels, explore what the sea reveals about us.',popular:false},
  {id:'MUS-119',title:'Sound & Society',department:'Music',schedule:'Afternoon',time:'Mon · Wed · 3:00 PM',instructor:'Dr. Theo Ellis',credits:2,seats:11,description:'Listen across genres and eras to uncover the ways music moves communities.',popular:false},
  {id:'BUS-178',title:'Design Thinking for Good',department:'Business',schedule:'Evening',time:'Tue · Thu · 6:30 PM',instructor:'Prof. Quinn James',credits:3,seats:6,description:'Use human-centered design to build ideas that make a meaningful difference.',popular:false}
];
const registrations = new Set();
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function navigate(){
  const requested = location.hash.slice(1) || 'home';
  const route = ['home','catalog','registration','profile'].includes(requested) ? requested : 'home';
  $$('.page').forEach(page => { const active = page.dataset.page === route; page.hidden = !active; page.classList.toggle('active',active); });
  $$('#primary-nav a').forEach(link => { if(link.dataset.nav === route) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current'); });
  $('#primary-nav').classList.remove('open'); $('.menu-toggle').setAttribute('aria-expanded','false');
  if(route === 'catalog') renderCatalog();
  if(route === 'registration') renderRegistrations();
  $('#main-content').focus({preventScroll:true});
  window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
function courseCard(course){
  const added=registrations.has(course.id);
  return `<article class="course-card"><span class="course-tag">${esc(course.department)}</span><h2>${esc(course.title)}</h2><span class="course-code">${esc(course.id)}</span><p class="course-desc">${esc(course.description)}</p><div class="course-info"><span><strong>Schedule</strong><br>${esc(course.time)}</span><span><strong>Instructor</strong><br>${esc(course.instructor)}</span><span><strong>Credits</strong><br>${course.credits}</span><span><strong>Seats left</strong><br>${course.seats}</span></div><div class="course-actions"><a class="button button-outline" href="#registration" aria-label="Register for ${esc(course.title)}" data-register-link="${course.id}">View registration</a><button class="button button-primary" type="button" data-add-course="${course.id}" ${added?'disabled aria-disabled="true"':''}>${added?'Added':'Add course'} <span aria-hidden="true">${added?'✓':'＋'}</span></button></div></article>`;
}
function renderCatalog(){
  const query=$('#course-search').value.trim().toLowerCase(), department=$('#department-filter').value, schedule=$('#schedule-filter').value;
  const filtered=courses.filter(course=>(department==='all'||course.department===department)&&(schedule==='all'||course.schedule===schedule)&&(!query||[course.title,course.id,course.department,course.instructor,course.description].some(value=>value.toLowerCase().includes(query))));
  $('#course-grid').innerHTML=filtered.map(courseCard).join('');
  $('#catalog-count').textContent=`${filtered.length} ${filtered.length===1?'course':'courses'} found`;
  $('#empty-state').hidden=filtered.length>0;
  $$('[data-add-course]').forEach(button=>button.addEventListener('click',()=>openRegistration(button.dataset.addCourse)));
  $$('[data-register-link]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();openRegistration(link.dataset.registerLink);}));
}
function fillCourseOptions(){
  const departments=[...new Set(courses.map(course=>course.department))].sort();
  departments.forEach(department=>$('#department-filter').insertAdjacentHTML('beforeend',`<option value="${esc(department)}">${esc(department)}</option>`));
  courses.forEach(course=>$('#course-select').insertAdjacentHTML('beforeend',`<option value="${esc(course.id)}">${esc(course.id)} · ${esc(course.title)} (${course.credits} credits)</option>`));
  $('#popular-courses').innerHTML=courses.filter(c=>c.popular).map(course=>`<article class="popular-card"><span class="course-tag">${esc(course.department)}</span><h3>${esc(course.title)}</h3><p>${esc(course.description)}</p><div class="popular-meta"><span>${esc(course.id)} · ${course.credits} credits</span><span>${course.seats} seats left</span></div><button class="button button-outline" type="button" data-popular-course="${course.id}">Explore this course <span aria-hidden="true">→</span></button></article>`).join('');
  $$('[data-popular-course]').forEach(button=>button.addEventListener('click',()=>{location.hash='catalog';}));
  $('#home-available').textContent=courses.length;
}
function openRegistration(id){
  const select=$('#course-select'); select.value=id;
  location.hash='registration';
  window.setTimeout(()=>select.focus(),0);
}
function renderRegistrations(){
  const selected=courses.filter(course=>registrations.has(course.id));
  const tbody=$('#registered-list');
  tbody.innerHTML=selected.map(course=>`<tr><td>${esc(course.title)}<small>${esc(course.id)} · ${esc(course.department)}</small></td><td>${esc(course.time)}</td><td>${course.credits}</td><td><button class="remove-button" type="button" data-remove-course="${course.id}" aria-label="Remove ${esc(course.title)} from your registration">Remove</button></td></tr>`).join('');
  $('#registration-empty').hidden=selected.length>0;
  $('#credit-pill').textContent=`${selected.reduce((sum,course)=>sum+course.credits,0)} ${selected.reduce((sum,course)=>sum+course.credits,0)===1?'credit':'credits'}`;
  $('#home-credits').innerHTML=`${selected.reduce((sum,course)=>sum+course.credits,0)} <small>/ 18</small>`;
  $$('[data-remove-course]').forEach(button=>button.addEventListener('click',()=>{registrations.delete(button.dataset.removeCourse);renderRegistrations();renderCatalog();}));
}
function showError(id,message){ const el=$('#'+id); el.textContent=message; if(message) el.setAttribute('role','alert'); else el.removeAttribute('role'); }
function validateForm(){
  const course=$('#course-select').value,email=$('#student-email').value.trim(),checked=$('#acknowledge').checked;
  showError('course-error',course?'':'Choose a course to continue.');
  showError('email-error',!email?'Enter your university email address.':!$('#student-email').validity.valid?'Enter a valid email address.':'');
  showError('ack-error',checked?'':'Confirm that you have checked the course prerequisites.');
  if(!course) $('#course-select').focus(); else if(!email||!$('#student-email').validity.valid) $('#student-email').focus(); else if(!checked) $('#acknowledge').focus();
  return Boolean(course&&email&&$('#student-email').validity.valid&&checked);
}
function init(){
  fillCourseOptions();
  $('#course-search').addEventListener('input',renderCatalog);
  $('#department-filter').addEventListener('change',renderCatalog);
  $('#schedule-filter').addEventListener('change',renderCatalog);
  $('#clear-filters').addEventListener('click',()=>{$('#course-search').value='';$('#department-filter').value='all';$('#schedule-filter').value='all';renderCatalog();$('#course-search').focus();});
  $('.menu-toggle').addEventListener('click',event=>{const button=event.currentTarget,open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));$('#primary-nav').classList.toggle('open',!open);if(!open)$('#primary-nav a').item(0).focus();});
  $('#registration-form').addEventListener('submit',event=>{
    event.preventDefault();if(!validateForm())return;
    const course=courses.find(item=>item.id===$('#course-select').value);
    if(registrations.has(course.id)){showError('course-error','You are already registered for this course.');$('#course-select').focus();return;}
    registrations.add(course.id);renderRegistrations();renderCatalog();
    $('#confirmation-course').innerHTML=`${esc(course.title)}<small>${esc(course.id)} · ${course.credits} credits · ${esc(course.time)}</small>`;
    $('#confirmation-dialog').showModal();
  });
  $('#dialog-done').addEventListener('click',()=>$('#confirmation-dialog').close());
  $('#confirmation-dialog').addEventListener('close',()=>{renderRegistrations();$('#registration-title').focus?.();});
  ['course-select','student-email','acknowledge'].forEach(id=>$('#'+id).addEventListener('input',()=>{if(id==='course-select')showError('course-error','');if(id==='student-email')showError('email-error','');if(id==='acknowledge')showError('ack-error','');}));
  window.addEventListener('hashchange',navigate);renderCatalog();renderRegistrations();navigate();
}
document.addEventListener('DOMContentLoaded',init);
