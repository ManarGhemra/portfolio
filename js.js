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

// إضافة المشاريع المخزنة
function appendStoredProjects(){
  try {
    const storedData = localStorage.getItem('projects');
    
    if (!storedData) {
      return;
    }
    
    const stored = JSON.parse(storedData);
    const container = document.getElementById('project-list');
    
    if(!container || stored.length === 0) {
      return;
    }

    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
                               .map(h=>h.textContent.trim());

    stored.forEach((p)=>{
      if (existingTitles.includes(p.title.trim())) {
        return;
      }

      const div = document.createElement('div');
      div.className = 'project-card';
      
      let buttonsHtml = '';
      
      if (p.links && p.links.blend) {
        buttonsHtml += `
          <a href="${p.links.blend}" 
             target="_blank" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            📁 Télécharger Blender
          </a>
        `;
      }
      
      if (p.links && p.links.image) {
        buttonsHtml += `
          <a href="${p.links.image}" 
             target="_blank" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🖼 Télécharger Image
          </a>
        `;
      }
      
      if (p.links && p.links.video) {
        buttonsHtml += `
          <a href="${p.links.video}" 
             target="_blank" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🎬 Télécharger Vidéo
          </a>
        `;
      }
      
      if (!buttonsHtml) {
        buttonsHtml = '<p class="muted" style="font-size:0.9rem">Aucun fichier disponible</p>';
      }
      
      div.innerHTML = `
        <h3 style="color:var(--accent1);margin-bottom:8px">${escapeHtml(p.title)}</h3>
        <p style="margin-bottom:12px;color:var(--muted)">${escapeHtml(p.desc)}</p>
        <div style="margin-top:12px">
          ${buttonsHtml}
        </div>
      `;
      container.appendChild(div);
    });
  } catch(e){
    console.error('Erreur lors du chargement des projets', e);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
