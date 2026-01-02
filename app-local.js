// معاينة محلية تستخدم data.json في نفس المجلد
let data = {};
async function loadData(){
  try{
    const res = await fetch('data.json');
    data = await res.json();
    renderAnnouncements();
    renderClasses();
    renderTeachers();
    renderAttendance([]); // تبدأ فارغة
    renderHomework([]);
  }catch(e){
    console.error('خطأ في ت��ميل data.json', e);
  }
}

function renderAnnouncements(){
  const ul = document.getElementById('ann-list');
  ul.innerHTML = '';
  (data.announcements||[]).forEach(a=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${a.title}</strong><div>${a.body}</div><small>${a.date||''}</small>`;
    ul.appendChild(li);
  });
}

function renderClasses(){
  const ul = document.getElementById('class-list');
  ul.innerHTML = '';
  (data.classes||[]).forEach(c=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${c.name}</strong> — <small>المدرس: ${c.teacher}</small>`;
    ul.appendChild(li);
  });
}

function renderTeachers(){
  const ul = document.getElementById('teacher-list');
  ul.innerHTML = '';
  (data.teachers||[]).forEach(t=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${t.name}</strong> — <small>${t.email||''}</small>`;
    ul.appendChild(li);
  });
}

function renderAttendance(items){
  const ul = document.getElementById('att-log');
  ul.innerHTML = '';
  (items||[]).forEach(item=>{
    const li = document.createElement('li');
    li.textContent = `${item.time} — ${item.name} — ${item.status}`;
    ul.appendChild(li);
  });
}

function renderHomework(items){
  const ul = document.getElementById('hw-list');
  ul.innerHTML = '';
  (items||[]).forEach(h=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${h.title}</strong> — ${h.student} <small>${h.time||''}</small>`;
    ul.appendChild(li);
  });
}

// Tab switching
document.getElementById('tab-ann').addEventListener('click',()=>showTab('announcements'));
document.getElementById('tab-classes').addEventListener('click',()=>showTab('classes'));
document.getElementById('tab-teachers').addEventListener('click',()=>showTab('teachers'));
document.getElementById('tab-attend').addEventListener('click',()=>showTab('attendance'));
document.getElementById('tab-homework').addEventListener('click',()=>showTab('homework'));

function showTab(id){
  document.querySelectorAll('.tab').forEach(s=>s.hidden=true);
  document.getElementById(id).hidden=false;
}

// Local attendance list (in-memory)
const localAttendance = [];
document.getElementById('att-form').addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('att-name').value.trim();
  const status = document.getElementById('att-status').value;
  if(!name) return;
  const now = new Date().toLocaleString();
  localAttendance.unshift({time: now, name, status});
  renderAttendance(localAttendance);
  document.getElementById('att-form').reset();
});

// Local homework list (in-memory)
const localHomework = [];
document.getElementById('hw-form').addEventListener('submit', e=>{
  e.preventDefault();
  const title = document.getElementById('hw-title').value.trim();
  const student = document.getElementById('hw-student').value.trim();
  if(!title || !student) return;
  const now = new Date().toLocaleString();
  localHomework.unshift({title, student, time: now});
  renderHomework(localHomework);
  document.getElementById('hw-form').reset();
});

// Simple search for announcements
document.getElementById('search').addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  const filtered = (data.announcements||[]).filter(a=>{
    return (a.title+' '+a.body).toLowerCase().includes(q);
  });
  const ul = document.getElementById('ann-list');
  ul.innerHTML = '';
  filtered.forEach(a=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${a.title}</strong><div>${a.body}</div><small>${a.date||''}</small>`;
    ul.appendChild(li);
  });
});

loadData();
showTab('announcements');
