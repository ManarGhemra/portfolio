// js.js - comportement de la page index (reveal, print, ajout dynamique des projets si présents)

function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[m]));
}

function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('visible');
  });
}

function setupActions(){
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  if(printBtn) printBtn.addEventListener('click', ()=> window.print());
  if(downloadBtn) downloadBtn.addEventListener('click', ()=> window.print());
}

// ✅ هذه هي الدالة التي تضيف المشاريع المخزنة في localStorage إلى الصفحة الرئيسية
function appendStoredProjects(){
  try {
    const stored = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('project-list');
    if(!container || stored.length === 0) return;

    // نتأكد أننا لا نضيف المشاريع مرتين
    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
      .map(el => el.textContent.trim().toLowerCase());

    stored.forEach(p => {
      if(!p.title || existingTitles.includes(p.title.trim().toLowerCase())) return;

      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <a href="${p.link}" target="_blank" class="btn ghost">Voir le projet</a>
      `;
      container.prepend(card); // نضيفهم في الأعلى باش يبانوا كمشاريع جديدة
    });
  } catch(e){
    console.error('Erreur chargement projets:', e);
  }
}

// ✅ عندما تجهز الصفحة
document.addEventListener('DOMContentLoaded', ()=>{
  revealOnScroll();
  setupActions();
  appendStoredProjects();
});

window.addEventListener('scroll', revealOnScroll);
