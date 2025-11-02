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

// ✅ هذه هي الدالة الوحيدة التي تضيف المشاريع المخزنة
function appendStoredProjects(){
  try {
    const stored = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('project-list');
    if(!container || stored.length === 0) return;

    // نتأكد أننا لا نضيف المشاريع مرتين
    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
                               .map(h=>h.textContent.trim());

    stored.forEach(p=>{
      if (existingTitles.includes(p.title.trim())) return; // ✅ لا نكرر نفس المشروع

      const div = document.createElement('div');
      div.className = 'project-card';
      
      // إنشاء أزرار التحميل بناءً على الملفات المتاحة
      let buttonsHtml = '';
      
      if (p.files.blend) {
        buttonsHtml += `
          <a href="${p.files.blend.url}" 
             download="${p.files.blend.name}" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            📁 Télécharger Blender
          </a>
        `;
      }
      
      if (p.files.image) {
        buttonsHtml += `
          <a href="${p.files.image.url}" 
             download="${p.files.image.name}" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🖼 Télécharger Image
          </a>
        `;
      }
      
      if (p.files.video) {
        buttonsHtml += `
          <a href="${p.files.video.url}" 
             download="${p.files.video.name}" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🎬 Télécharger Vidéo
          </a>
        `;
      }
      
      div.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <div style="margin-top:12px">
          ${buttonsHtml}
        </div>
      `;
      container.appendChild(div);
    });
  } catch(e){
    console.error('Erreur lors du chargement des projets depuis localStorage', e);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
