const courses = [
  {id:'ENV-210',title:'The Living City',subject:'Environmental Studies',instructor:'Dr. Avery Chen',schedule:'Mon · Wed, 10:00–11:15',format:'In person',credits:3,description:'Explore how nature and communities shape the places we call home.',symbol:'✿'},
  {id:'ART-145',title:'Color, Culture & Us',subject:'Art & Design',instructor:'Prof. Maya Brooks',schedule:'Tue · Thu, 13:00–14:15',format:'Hybrid',credits:3,description:'See how color tells stories across art, identity, and everyday life.',symbol:'✳'},
  {id:'BIO-220',title:'Ocean Futures',subject:'Biology',instructor:'Dr. Luis Ramirez',schedule:'Mon · Wed · Fri, 09:00–09:50',format:'In person',credits:4,description:'Dive into marine ecosystems and the science of a changing ocean.',symbol:'≈'},
  {id:'HIS-118',title:'Stories That Changed Us',subject:'History',instructor:'Dr. Nia Patel',schedule:'Tue · Thu, 11:00–12:15',format:'Online',credits:3,description:'Meet the bold ideas and ordinary people behind turning points in history.',symbol:'✦'},
  {id:'CS-175',title:'Creative Coding',subject:'Computer Science',instructor:'Prof. Theo Park',schedule:'Mon · Wed, 14:00–15:15',format:'Hybrid',credits:3,description:'Make playful, interactive projects while learning the language of code.',symbol:'⌘'},
  {id:'PSY-201',title:'The Science of Belonging',subject:'Psychology',instructor:'Dr. Lena Okafor',schedule:'Tue · Thu, 09:30–10:45',format:'In person',credits:3,description:'Understand the connections that help people and communities thrive.',symbol:'♡'}
];
const registered = [];
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const htmlEscape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function cardMarkup(course){
  const index=courses.indexOf(course);
  const already=registered.some(item=>item.id===course.id);
  return `<article class="course-card"><div class="course-color tone-${index%6}"><span>${course.subject.toUpperCase()}</span><span class="course-symbol" aria-hidden="true">${course.symbol}</span></div><div class="course-body"><h3>${course.title}</h3><p class="course-code">${course.id} · ${course.instructor}</p><p class="course-description">${course.description}</p><div class="course-meta"><span>◷ ${course.schedule}</span><span>◉ ${course.format}</span></div><div class="course-bottom"><span class="credits">${course.credits} credits</span><button class="small-button" type="button" data-register="${course.id}" ${already?'disabled':''}>${already?'Added to schedule':'Register for course'}</button></div></div></article>`;
}
function renderCatalog(){
  const term=$('#course-search').value.trim().toLowerCase(), subject=$('#subject-filter').value, format=$('#format-filter').value;
  const matches=courses.filter(c=>(subject==='all'||c.subject===subject)&&(format==='all'||c.format===format)&&[c.title,c.id,c.subject,c.instructor,c.description].some(value=>value.toLowerCase().includes(term)));
  $('#catalog-courses').innerHTML=matches.map(cardMarkup).join('');
  $('#result-count').textContent=`${matches.length} ${matches.length===1?'course':'courses'}${term||subject!=='all'||format!=='all'?' found':''}`;
  $('#empty-state').hidden=matches.length!==0;
  $('#clear-search').hidden=!$('#course-search').value;
}
function renderFeatured(){ $('#featured-courses').innerHTML=courses.slice(0,3).map(cardMarkup).join(''); }
function renderRegistered(){
  const body=$('#registered-courses');
  body.innerHTML=registered.map(c=>`<tr><td>${c.title}<small>${c.id}</small></td><td>${c.schedule}</td><td><button type="button" class="remove-course" data-remove="${c.id}" aria-label="Remove ${c.title} from registered courses">Remove</button></td></tr>`).join('');
  const count=registered.length;
  $('#table-empty').hidden=count>0;
  $('#schedule-count').textContent=`${count} ${count===1?'course':'courses'}`;
  $('#profile-course-count').textContent=`${count} ${count===1?'course':'courses'}`;
  renderCatalog();renderFeatured();
}
function goTo(route){
  const valid=['home','catalog','registration','profile'].includes(route)?route:'home';
  $$('.page').forEach(page=>{const active=page.id===`page-${valid}`;page.hidden=!active;page.classList.toggle('active',active)});
  $$('#primary-nav a').forEach(link=>{if(link.dataset.route===valid)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});
  $('#primary-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle .sr-only').textContent='Open navigation menu';
  if(valid==='catalog')$('#course-search').focus({preventScroll:true});
  window.scrollTo(0,0);
}
function clearErrors(){
  $$('.error-message').forEach(el=>{el.hidden=true;el.textContent=''});
  $$('#registration-form [aria-invalid="true"]').forEach(el=>el.removeAttribute('aria-invalid'));
}
function showError(field,message){field.setAttribute('aria-invalid','true');const error=$(`#${field.getAttribute('aria-describedby').split(' ').find(id=>id.endsWith('-error'))}`);error.textContent=message;error.hidden=false;}
function validateForm(){
  clearErrors();const course=$('#registration-course'),name=$('#student-name'),email=$('#student-email'),id=$('#student-id'),terms=$('#terms');let firstInvalid=null;
  const check=(field,message)=>{if(!field.checkValidity()){showError(field,message);if(!firstInvalid)firstInvalid=field}};
  check(course,'Choose a course to continue.');check(name,'Enter your full name.');
  if(!email.value.trim())showError(email,'Enter your university email address.');else if(!email.validity.valid)showError(email,'Enter a valid email address, such as you@northstar.edu.');
  if(email.hasAttribute('aria-invalid')&&!firstInvalid)firstInvalid=email;
  if(!id.value.trim())showError(id,'Enter your 8-digit student ID.');else if(!/^\d{8}$/.test(id.value.trim()))showError(id,'Student ID must contain exactly 8 digits.');
  if(id.hasAttribute('aria-invalid')&&!firstInvalid)firstInvalid=id;
  if(!terms.checked)showError(terms,'Confirm that your information is accurate and you meet the prerequisites.');
  if(terms.hasAttribute('aria-invalid')&&!firstInvalid)firstInvalid=terms;
  if(firstInvalid){firstInvalid.focus();return false}return true;
}
function openConfirmation(){
  const course=courses.find(c=>c.id===$('#registration-course').value);if(!course)return;
  $('#confirmation-details').innerHTML=`<div><dt>Course</dt><dd>${course.title} (${course.id})</dd></div><div><dt>Schedule</dt><dd>${course.schedule}</dd></div><div><dt>Student</dt><dd>${htmlEscape($('#student-name').value.trim())}</dd></div><div><dt>Email</dt><dd>${htmlEscape($('#student-email').value.trim())}</dd></div>`;
  $('#confirmation-dialog').showModal();$('#confirm-registration').focus();
}
function registerSelected(){
  const course=courses.find(c=>c.id===$('#registration-course').value);if(!course)return;
  if(!registered.some(c=>c.id===course.id)){registered.push(course);renderRegistered();$('#status-message').textContent=`${course.title} has been added to your registered courses.`}
  $('#confirmation-dialog').close();$('#registration-form').reset();clearErrors();
}
function populateForm(courseId=''){
  const select=$('#registration-course');select.innerHTML='<option value="">Select a course</option>'+courses.map(c=>`<option value="${c.id}" ${registered.some(item=>item.id===c.id)?'disabled':''}>${c.id} — ${c.title}${registered.some(item=>item.id===c.id)?' (already registered)':''}</option>`).join('');
  if(courseId&&!registered.some(c=>c.id===courseId))select.value=courseId;
}

const subjectSelect=$('#subject-filter');[...new Set(courses.map(c=>c.subject))].sort().forEach(subject=>{const option=document.createElement('option');option.value=subject;option.textContent=subject;subjectSelect.append(option)});
populateForm();renderCatalog();renderFeatured();renderRegistered();
function handleRoute(){goTo(location.hash.slice(1)||'home')}
window.addEventListener('hashchange',handleRoute);handleRoute();
$('#course-search').addEventListener('input',renderCatalog);$('#subject-filter').addEventListener('change',renderCatalog);$('#format-filter').addEventListener('change',renderCatalog);
$('#clear-search').addEventListener('click',()=>{$('#course-search').value='';renderCatalog();$('#course-search').focus()});
document.addEventListener('click',event=>{
  const register=event.target.closest('[data-register]');
  if(register){populateForm(register.dataset.register);location.hash='registration';return}
  const remove=event.target.closest('[data-remove]');
  if(remove){const course=registered.find(c=>c.id===remove.dataset.remove);registered.splice(registered.findIndex(c=>c.id===remove.dataset.remove),1);renderRegistered();populateForm();$('#status-message').textContent=`${course.title} was removed from your registered courses.`}
});
$('#registration-form').addEventListener('submit',event=>{event.preventDefault();if(validateForm())openConfirmation()});
$('#confirm-registration').addEventListener('click',registerSelected);
$('#edit-registration').addEventListener('click',()=>$('#confirmation-dialog').close());
$('.dialog-close').addEventListener('click',()=>$('#confirmation-dialog').close());
$('#confirmation-dialog').addEventListener('click',event=>{if(event.target===$('#confirmation-dialog'))$('#confirmation-dialog').close()});
$('#student-id').addEventListener('input',event=>{event.target.value=event.target.value.replace(/\D/g,'').slice(0,8)});
const menu=$('.menu-toggle');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.querySelector('.sr-only').textContent=open?'Close navigation menu':'Open navigation menu';$('#primary-nav').classList.toggle('open',open)});
