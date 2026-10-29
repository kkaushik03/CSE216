const courses = [
  {code:'ART 210',title:'Color, Form & Feeling',subject:'Art & Design',schedule:'Morning',credits:3,seats:8,description:'Explore how color and shape tell stories, shift moods, and change the way we see.'},
  {code:'BIO 145',title:'The Secret Life of Plants',subject:'Biology',schedule:'Afternoon',credits:4,seats:3,description:'Get to know the ingenious organisms that keep our planet breathing.'},
  {code:'BUS 230',title:'Small Business, Big Ideas',subject:'Business',schedule:'Evening',credits:3,seats:12,description:'Turn a promising idea into a practical plan with a community of makers.'},
  {code:'COM 218',title:'Stories That Stick',subject:'Communication',schedule:'Morning',credits:3,seats:6,description:'Practice writing and speaking with clarity, warmth, and purpose.'},
  {code:'CSE 216',title:'Code for Everyone',subject:'Computer Science',schedule:'Afternoon',credits:4,seats:0,description:'Build a friendly foundation in programming through creative projects.'},
  {code:'DES 305',title:'Design for a Better World',subject:'Art & Design',schedule:'Afternoon',credits:3,seats:5,description:'Use human-centered design to imagine more thoughtful everyday systems.'},
  {code:'ECO 202',title:'Economics of Everyday Life',subject:'Economics',schedule:'Evening',credits:3,seats:9,description:'Understand the choices, tradeoffs, and forces shaping daily life.'},
  {code:'ENG 240',title:'The Art of the Essay',subject:'English',schedule:'Morning',credits:3,seats:4,description:'Read bold essays and find your own voice on the page.'},
  {code:'ENV 115',title:'Climate & Community',subject:'Environmental Studies',schedule:'Afternoon',credits:4,seats:11,description:'Connect climate science with local action and resilient communities.'},
  {code:'HIS 180',title:'A World in Motion',subject:'History',schedule:'Morning',credits:3,seats:7,description:'Trace the connections that have shaped our shared modern world.'},
  {code:'MTH 125',title:'Math for Curious Minds',subject:'Mathematics',schedule:'Morning',credits:4,seats:2,description:'Find patterns and surprising ideas in the mathematics around us.'},
  {code:'MUS 260',title:'Sound, Song & Society',subject:'Music',schedule:'Evening',credits:3,seats:10,description:'Listen closely to how music carries identity, memory, and change.'},
  {code:'PSY 205',title:'How We Become Us',subject:'Psychology',schedule:'Afternoon',credits:3,seats:0,description:'Explore the science of personality, relationships, and human growth.'},
  {code:'SOC 150',title:'The City as Classroom',subject:'Sociology',schedule:'Evening',credits:3,seats:13,description:'Study neighborhoods and public spaces as living social stories.'}
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
let registered = [];
try {
  const stored = JSON.parse(localStorage.getItem('campus-compass-registration') || '[]');
  if (Array.isArray(stored)) registered = stored.filter(code => courses.some(course => course.code === code));
} catch { /* Start with an empty schedule if saved browser data is unreadable. */ }
let lastAction = null;
const status = $('#status');

function announce(message){ status.textContent=''; window.setTimeout(()=>{status.textContent=message;},20); }
function saveRegistration(){ localStorage.setItem('campus-compass-registration',JSON.stringify(registered)); }
function courseCard(course, compact=false){
  const isAdded=registered.includes(course.code), full=course.seats===0;
  if(compact) return `<article class="quick-card"><div class="course-meta"><span class="subject-tag">${course.subject}</span><span class="course-code">${course.code}</span></div><h3><a class="course-title" href="#catalog">${course.title}</a></h3><p>${course.description}</p><div class="quick-bottom"><span>${course.credits} credits · ${course.schedule}</span><a href="#catalog" aria-label="View ${course.code} in course catalog">Explore course →</a></div></article>`;
  return `<article class="course-card"><div class="course-meta"><span class="subject-tag">${course.subject}</span><span class="course-code">${course.code}</span></div><h2>${course.title}</h2><p class="description">${course.description}</p><div class="course-card-footer"><div class="course-facts">${course.credits} credits · ${course.schedule}<span class="seat-note ${full?'full':''}">${full?'Full · Join waitlist soon':`${course.seats} seats available`}</span></div><button class="button card-action ${isAdded?'added':''}" type="button" data-course="${course.code}" ${full&&!isAdded?'disabled':''} aria-label="${isAdded?'Remove':'Add'} ${course.code} ${isAdded?'from':'to'} your registration">${isAdded?'✓ Added':full?'Full':'Add course'}</button></div></article>`;
}
function renderFeatured(){ $('#featured-courses').innerHTML=courses.slice(0,3).map(course=>courseCard(course,true)).join(''); }
function renderCatalog(){
  const query=$('#search-input').value.trim().toLowerCase(), subject=$('#subject-filter').value, schedule=$('#schedule-filter').value, sort=$('#sort-filter').value;
  let filtered=courses.filter(c=>(subject==='all'||c.subject===subject)&&(schedule==='all'||c.schedule===schedule)&&(!query||`${c.code} ${c.title} ${c.subject} ${c.description}`.toLowerCase().includes(query)));
  if(sort==='code') filtered.sort((a,b)=>a.code.localeCompare(b.code));
  if(sort==='seats') filtered.sort((a,b)=>b.seats-a.seats);
  $('#course-grid').innerHTML=filtered.map(c=>courseCard(c)).join('');
  $('#empty-state').hidden=filtered.length>0;
  $('#result-count').textContent=`Showing ${filtered.length} ${filtered.length===1?'course':'courses'}`;
  announce(`${filtered.length} ${filtered.length===1?'course':'courses'} found`);
}
function renderRegistration(){
  const selected=registered.map(code=>courses.find(c=>c.code===code)).filter(Boolean), credits=selected.reduce((sum,c)=>sum+c.credits,0);
  $('#nav-count').textContent=selected.length;
  $('#summary-count').textContent=selected.length; $('#summary-credits').textContent=credits;
  $('#credit-total').textContent=`${credits} ${credits===1?'credit':'credits'}`;
  $('#progress-label').textContent=`${Math.min(credits,15)} / 15`;
  const progress=$('#credit-progress'); progress.setAttribute('aria-valuenow',Math.min(credits,15)); progress.querySelector('span').style.width=`${Math.min(credits/15*100,100)}%`;
  $('#review-registration').disabled=selected.length===0;
  $('#registration-empty').hidden=selected.length>0;
  $('#registered-table-body').innerHTML=selected.map(c=>`<tr><th scope="row"><span class="table-course-name">${c.title}</span><span class="table-course-code">${c.code} · ${c.subject}</span></th><td>${c.schedule}</td><td>${c.credits}</td><td>Registered</td><td><button class="drop-button" type="button" data-drop="${c.code}" aria-label="Drop ${c.code}">Drop</button></td></tr>`).join('');
}
function navigate(view,moveFocus=true){
  if(!['home','catalog','registration','profile'].includes(view)) view='home';
  $$('.view').forEach(section=>section.hidden=section.dataset.page!==view);
  $$('[data-view]').forEach(link=>{if(link.dataset.view===view) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');});
  document.title=`${view==='home'?'Home':view==='catalog'?'Course catalog':view==='registration'?'My registration':'My profile'} | Campus Compass`;
  $('#primary-menu').classList.remove('open'); $('#menu-toggle').setAttribute('aria-expanded','false');
  if(view==='catalog') renderCatalog();
  if(view==='registration') renderRegistration();
  if(moveFocus) $(`#${view}-title`).focus();
}
function fillSubjects(){[...new Set(courses.map(c=>c.subject))].sort().forEach(subject=>$('#subject-filter').insertAdjacentHTML('beforeend',`<option value="${subject}">${subject}</option>`));}

fillSubjects(); renderFeatured(); renderRegistration();
if(location.hash) navigate(location.hash.slice(1),false); else navigate('home',false);
window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)));
$('#menu-toggle').addEventListener('click',()=>{const open=$('#menu-toggle').getAttribute('aria-expanded')==='true';$('#menu-toggle').setAttribute('aria-expanded',String(!open));$('#primary-menu').classList.toggle('open',!open);});
$('#menu-toggle').addEventListener('keydown',event=>{if(event.key==='Escape'&&$('#menu-toggle').getAttribute('aria-expanded')==='true'){event.preventDefault();$('#menu-toggle').setAttribute('aria-expanded','false');$('#primary-menu').classList.remove('open');$('#menu-toggle').focus();}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('#menu-toggle').getAttribute('aria-expanded')==='true'){event.preventDefault();$('#menu-toggle').setAttribute('aria-expanded','false');$('#primary-menu').classList.remove('open');$('#menu-toggle').focus();}});
$('#course-search').addEventListener('submit',event=>{event.preventDefault();renderCatalog();});
$('#search-input').addEventListener('input',renderCatalog); $('#subject-filter').addEventListener('change',renderCatalog); $('#schedule-filter').addEventListener('change',renderCatalog); $('#sort-filter').addEventListener('change',renderCatalog);
$('#course-grid').addEventListener('click',event=>{const button=event.target.closest('[data-course]');if(!button)return;const code=button.dataset.course;if(registered.includes(code)){registered=registered.filter(item=>item!==code);announce(`${code} removed from your registration`);}else{registered.push(code);announce(`${code} added to your registration`);}saveRegistration();renderCatalog();renderRegistration();});
$('#registered-table-body').addEventListener('click',event=>{const button=event.target.closest('[data-drop]');if(!button)return;registered=registered.filter(code=>code!==button.dataset.drop);saveRegistration();renderRegistration();announce(`${button.dataset.drop} dropped from your registration`);});
$('#review-registration').addEventListener('click',event=>{lastAction=event.currentTarget;const count=registered.length,credits=registered.reduce((sum,code)=>sum+courses.find(c=>c.code===code).credits,0);$('#dialog-course-count').textContent=`${count} ${count===1?'course':'courses'}`;$('#dialog-credit-count').textContent=`${credits} ${credits===1?'credit':'credits'}`;$('#confirm-dialog').showModal();$('#cancel-registration').focus();});
$('#cancel-registration').addEventListener('click',()=>$('#confirm-dialog').close());
$('#confirm-registration').addEventListener('click',()=>{$('#confirm-dialog').close();announce('Registration saved. Your Fall 2026 courses are confirmed.');navigate('registration',false);$('#registration-title').focus();});
$('#confirm-dialog').addEventListener('close',()=>{if(lastAction?.isConnected)lastAction.focus();else $('#registration-title').focus();});
