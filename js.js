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
    const storedData = localStorage.getItem('projects');
    console.log('Données récupérées du localStorage:', storedData);
    
    if (!storedData) {
      console.log('Aucune donnée dans localStorage');
      return;
    }
    
    const stored = JSON.parse(storedData);
    const container = document.getElementById('project-list');
    
    if(!container) {
      console.error('Container project-list non trouvé');
      return;
    }
    
    if(stored.length === 0) {
      console.log('Aucun projet stocké');
      return;
    }

    console.log('Projets à afficher:', stored.length, 'projets');

    // نتأكد أننا لا نضيف المشاريع مرتين
    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
                               .map(h=>h.textContent.trim());

    stored.forEach((p, index)=>{
      if (existingTitles.includes(p.title.trim())) {
        console.log('Projet déjà affiché:', p.title);
        return; // ✅ لا نكرر نفس المشروع
      }

      const div = document.createElement('div');
      div.className = 'project-card';
      
      // إنشاء أزرار التحميل بناءً على الملفات المتاحة
      let buttonsHtml = '';
      
      if (p.files && p.files.blend) {
        console.log('Ajout bouton Blender pour:', p.title);
        buttonsHtml += `
          <a href="${p.files.blend.url}" 
             download="${p.files.blend.name}" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            📁 Télécharger Blender
          </a>
        `;
      }
      
      if (p.files && p.files.image) {
        console.log('Ajout bouton Image pour:', p.title);
        buttonsHtml += `
          <a href="${p.files.image.url}" 
             download="${p.files.image.name}" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🖼 Télécharger Image
          </a>
        `;
      }
      
      if (p.files && p.files.video) {
        console.log('Ajout bouton Vidéo pour:', p.title);
        buttonsHtml += `
          <a href="${p.files.video.url}" 
             download="${p.files.video.name}" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🎬 Télécharger Vidéo
          </a>
        `;
      }
      
      // إذا لم يكن هناك ملفات، نعرض رسالة
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
      console.log('Projet ajouté avec succès:', p.title);
    });
  } catch(e){
    console.error('Erreur lors du chargement des projets depuis localStorage', e);
  }
}

// دالة لتصحيح أي مشاكل في البيانات
function fixStorageIssues() {
  try {
    const stored = localStorage.getItem('projects');
    if (!stored) {
      console.log('Aucune donnée dans localStorage - initialisation');
      localStorage.setItem('projects', JSON.stringify([]));
      return;
    }
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      console.log('Les données ne sont pas un tableau, correction...');
      localStorage.setItem('projects', JSON.stringify([]));
    } else {
      console.log('Données valides:', parsed.length, 'projets');
    }
  } catch (e) {
    console.error('Erreur dans les données, réinitialisation...', e);
    localStorage.setItem('projects', JSON.stringify([]));
  }
}

// دالة لفحص حالة التخزين
function checkStorage() {
  console.log('=== CHECK STORAGE ===');
  const stored = localStorage.getItem('projects');
  console.log('Storage key exists:', !!stored);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      console.log('Number of projects:', parsed.length);
      parsed.forEach((p, i) => {
        console.log(`Project ${i}:`, p.title);
        console.log('  Files:', p.files ? Object.keys(p.files) : 'none');
      });
    } catch(e) {
      console.error('Parse error:', e);
    }
  }
  console.log('=====================');
}

document.addEventListener('DOMContentLoaded', ()=>{
  console.log('Page index chargée');
  
  // تصحيح أي مشاكل في التخزين
  fixStorageIssues();
  
  // فحص التخزين
  checkStorage();
  
  // إضافة المشاريع المخزنة
  appendStoredProjects();
  
  // إعداد الأزرار
  setupActions();
  
  // إعداد التمرير
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
