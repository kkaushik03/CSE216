const courses = [
  {id:'bio220',code:'BIO 220',name:'Ecology & Evolution',department:'Biology',credits:3,days:'MWF',time:'10:30 – 11:20 AM',location:'Science Hall 204',instructor:'Dr. Mira Patel',initials:'MP',icon:'✿',art:'art-bio',description:'Explore the beautiful connections that shape life on Earth.'},
  {id:'cs201',code:'CS 201',name:'Creative Coding',department:'Computer Science',credits:4,days:'TR',time:'9:00 – 10:50 AM',location:'Tech Center 310',instructor:'Prof. Leo Kim',initials:'LK',icon:'⌘',art:'art-cs',description:'Build interactive experiences with code, curiosity, and play.'},
  {id:'eng315',code:'ENG 315',name:'Stories & Society',department:'English',credits:3,days:'MWF',time:'2:00 – 2:50 PM',location:'Humanities 108',instructor:'Dr. Celeste Reed',initials:'CR',icon:'✎',art:'art-eng',description:'Discover how the stories we share shape the world around us.'},
  {id:'psy205',code:'PSY 205',name:'The Social Mind',department:'Psychology',credits:3,days:'TR',time:'11:00 – 12:20 PM',location:'Behavioral Sciences 118',instructor:'Dr. Nia Brooks',initials:'NB',icon:'☼',art:'art-psych',description:'Take a closer look at how we think, connect, and belong.'},
  {id:'des140',code:'DES 140',name:'Designing for Good',department:'Design',credits:3,days:'MWF',time:'1:00 – 1:50 PM',location:'Arts Studio 12',instructor:'Prof. Sam Rivera',initials:'SR',icon:'✧',art:'art-design',description:'Use creative problem-solving to make a difference in your community.'},
  {id:'env230',code:'ENV 230',name:'Climate & Community',department:'Environmental Studies',credits:3,days:'TR',time:'3:00 – 4:20 PM',location:'Green Building 202',instructor:'Dr. Amara Okafor',initials:'AO',icon:'♧',art:'art-env',description:'Connect climate science with the communities already creating change.'}
];
const initialCourses=['bio220','cs201','eng315'];
let registered = [...initialCourses];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const dialog=$('#confirm-dialog');

function courseById(id){return courses.find(c=>c.id===id)}
function go(page){
  if(!$('#'+page)) page='home';
  $$('.page').forEach(p=>{const active=p.id===page;p.classList.toggle('active',active);p.hidden=!active});
  $$('.nav-link').forEach(a=>{if(a.dataset.page===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');a.classList.toggle('active',a.dataset.page===page)});
  const names={home:'Overview',catalog:'Course catalog',registration:'Registration',profile:'My profile'};
  $('#crumb').textContent=names[page];history.replaceState(null,'','#'+page);window.scrollTo({top:0,behavior:'smooth'});
}
function cardTemplate(c){
  const added=registered.includes(c.id);
  return `<article class="course-card"><div class="course-art ${c.art}"><span aria-hidden="true">${c.icon}</span></div><div class="course-body"><div class="course-topline"><span class="course-code-tag">${c.code} · ${c.department.toUpperCase()}</span><span class="course-credits">${c.credits} credits</span></div><h2>${c.name}</h2><p class="course-description">${c.description}</p><div class="course-meta"><span>◷ &nbsp;${c.days} · ${c.time}</span></div><div class="instructor"><span class="instructor-avatar" aria-hidden="true">${c.initials}</span><span>${c.instructor}</span></div><button class="button ${added?'is-added':'button-outline'}" data-course="${c.id}" ${added?'disabled':''} aria-label="${added?'Already registered for':'Register for'} ${c.code}: ${c.name}">${added?'✓  Added to schedule':'＋  Add to my schedule'}</button></div></article>`;
}
function renderCatalog(){
  const q=$('#course-search').value.trim().toLowerCase(),dept=$('#department-filter').value,day=$('#day-filter').value,sort=$('#sort-filter').value;
  let filtered=courses.filter(c=>(!q||[c.code,c.name,c.department,c.instructor,c.description].some(v=>v.toLowerCase().includes(q)))&&(dept==='all'||c.department===dept)&&(day==='all'||c.days===day));
  if(sort==='name')filtered.sort((a,b)=>a.name.localeCompare(b.name));else if(sort==='credits')filtered.sort((a,b)=>b.credits-a.credits||a.name.localeCompare(b.name));
  $('#course-grid').innerHTML=filtered.map(cardTemplate).join('');$('#result-count').textContent=`${filtered.length} course${filtered.length===1?'':'s'} to explore`;
  $('#course-grid').hidden=filtered.length===0;$('#empty-state').hidden=filtered.length!==0;
}
function renderRegistration(){
  const list=registered.map(courseById).filter(Boolean),credits=list.reduce((n,c)=>n+c.credits,0),percent=Math.min(100,credits/18*100);
  $('#registered-table').innerHTML=list.map(c=>`<tr><td><div class="table-course"><span class="table-icon ${c.art}" aria-hidden="true">${c.icon}</span><span><strong>${c.name}</strong><small>${c.code} · ${c.department}</small></span></div></td><td><span class="table-days">${c.days}</span><br>${c.time}</td><td>${c.location}</td><td>${c.credits}</td><td><button class="remove-course" data-remove="${c.id}" aria-label="Remove ${c.code}: ${c.name}">×</button></td></tr>`).join('');
  $('#table-empty').hidden=list.length>0;$('.table-scroll').hidden=list.length===0;$('#table-count').textContent=list.length;
  $('#credit-total').textContent=credits;$('#course-total').textContent=list.length;$('#nav-count').textContent=list.length;
  $('#credit-progress').style.width=percent+'%';$('#sidebar-progress').style.width=percent+'%';$('#sidebar-credits').textContent=credits;$('#profile-credit').textContent=credits+' credits';
  $('#credit-message').textContent=credits>=18?'You’ve reached the recommended maximum course load.':credits>=12?'You’re meeting the full-time credit requirement.':`Add ${12-credits} more credit${12-credits===1?'':'s'} to reach full-time status.`;
}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2400)}
function addCourse(id){
  if(registered.includes(id))return;
  if(registered.reduce((n,key)=>n+courseById(key).credits,0)+courseById(id).credits>18){toast('That would put you over the 18 credit maximum.');return}
  const c=courseById(id);registered.push(id);renderRegistration();renderCatalog();
  $('#modal-course-name').textContent=`${c.code} · ${c.name}`;$('#modal-course-details').textContent=`${c.credits} credits  ·  ${c.days}  ·  ${c.time}`;dialog.showModal();
}
function removeCourse(id){const c=courseById(id);registered=registered.filter(key=>key!==id);renderRegistration();renderCatalog();toast(`${c.code} removed from your schedule.`)}

document.addEventListener('click',e=>{
  const nav=e.target.closest('[data-page]');if(nav){e.preventDefault();go(nav.dataset.page);return}
  const goButton=e.target.closest('[data-go]');if(goButton){e.preventDefault();if(dialog.open)dialog.close();go(goButton.dataset.go);return}
  const add=e.target.closest('[data-course]');if(add){addCourse(add.dataset.course);return}
  const remove=e.target.closest('[data-remove]');if(remove){removeCourse(remove.dataset.remove);return}
  if(e.target.closest('.dialog-close,.modal-done'))dialog.close();
});
$('#course-search').addEventListener('input',renderCatalog);
['department-filter','day-filter','sort-filter'].forEach(id=>$('#'+id).addEventListener('change',renderCatalog));
$('#clear-filters').addEventListener('click',()=>{$('#course-search').value='';$('#department-filter').value='all';$('#day-filter').value='all';$('#sort-filter').value='popular';renderCatalog();$('#course-search').focus()});
$('#edit-profile').addEventListener('click',()=>toast('Profile details are managed by Student Services.'));
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();go('catalog');$('#course-search').focus()}});
window.addEventListener('hashchange',()=>go(location.hash.slice(1)||'home'));
go(location.hash.slice(1)||'home');renderCatalog();renderRegistration();
