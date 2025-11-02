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
    
    const stored = storedData ? JSON.parse(storedData) : [];
    const container = document.getElementById('project-list');
    
    if(!container) {
      console.error('Container project-list non trouvé');
      return;
    }
    
    if(stored.length === 0) {
      console.log('Aucun projet stocké');
      return;
    }

    console.log('Projets à afficher:', stored);

    // نتأكد أننا لا نضيف المشاريع مرتين
    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
                               .map(h=>h.textContent.trim());

    stored.forEach(p=>{
      if (existingTitles.includes(p.title.trim())) {
        console.log('Projet déjà affiché:', p.title);
        return; // ✅ لا نكرر نفس المشروع
      }

      const div = document.createElement('div');
      div.className = 'project-card';
      
      // إنشاء أزرار التحميل بناءً على الملفات المتاحة
      let buttonsHtml = '';
      
      if (p.files && p.files.blend) {
        buttonsHtml += `
          <a href="${p.files.blend.url}" 
             download="${p.files.blend.name}" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            📁 Télécharger Blender
          </a>
        `;
      }
      
      if (p.files && p.files.image) {
        buttonsHtml += `
          <a href="${p.files.image.url}" 
             download="${p.files.image.name}" 
             class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🖼 Télécharger Image
          </a>
        `;
      }
      
      if (p.files && p.files.video) {
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
        buttonsHtml = '<p class="muted">Aucun fichier disponible</p>';
      }
      
      div.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <div style="margin-top:12px">
          ${buttonsHtml}
        </div>
      `;
      container.appendChild(div);
      console.log('Projet ajouté:', p.title);
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
      console.log('Aucune donnée dans localStorage');
      localStorage.setItem('projects', JSON.stringify([]));
      return;
    }
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      console.log('Les données ne sont pas un tableau, correction...');
      localStorage.setItem('projects', JSON.stringify([]));
    }
  } catch (e) {
    console.error('Erreur dans les données, réinitialisation...', e);
    localStorage.setItem('projects', JSON.stringify([]));
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  console.log('Page index chargée');
  
  // تصحيح أي مشاكل في التخزين
  fixStorageIssues();
  
  // إضافة المشاريع المخزنة
  appendStoredProjects();
  
  // إعداد الأزرار
  setupActions();
  
  // إعداد التمرير
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
  
  // للتصحيح: عرض البيانات الحالية
  console.log('Contenu final du localStorage:', localStorage.getItem('projects'));
});
