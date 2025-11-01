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

function downloadBlenderFile(fileData, fileName) {
  try {
    // تحويل البيانات إلى Blob
    const byteCharacters = atob(fileData.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/octet-stream'});
    
    // إنشاء رابط تحميل تلقائي
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'projet.blend';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch(e) {
    console.error('Erreur lors du téléchargement:', e);
    alert('Erreur lors du téléchargement du fichier');
  }
}

function handleBlenderProject(event, fileData, fileName) {
  event.preventDefault();
  downloadBlenderFile(fileData, fileName);
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

    // إزالة المشاريع الافتراضية القديمة أولاً
    const defaultProjects = [
      'Chatbot universitaire',
      'API REST avec FastAPI', 
      'Site web de shopping',
      'Site web de prévisions météorologiques',
      'Site scientifique sur l\'espace',
      'Portfolio personnel'
    ];
    
    defaultProjects.forEach(title => {
      const existingProject = Array.from(container.querySelectorAll('.project-card h3'))
        .find(h3 => h3.textContent.trim() === title);
      if (existingProject) {
        existingProject.closest('.project-card').remove();
      }
    });

    // إضافة المشاريع المخزنة
    stored.forEach(p => {
      const div = document.createElement('div');
      div.className = 'project-card';
      
      let buttonHTML = '';
      if (p.type === 'blender') {
        buttonHTML = `
          <a href="#" class="btn ghost" onclick="handleBlenderProject(event, '${p.fileData}', '${p.fileName}')">
            Voir le projet
          </a>
        `;
      } else {
        buttonHTML = `<a href="${p.link}" target="_blank" class="btn ghost">Voir le projet</a>`;
      }
      
      div.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        ${p.type === 'blender' ? '<div style="font-size:0.9rem;color:#7c4dff">📁 Modèle 3D</div>' : ''}
        ${buttonHTML}
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
