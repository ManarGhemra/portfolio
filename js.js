// ======== Fonction pour sécuriser le texte =========
function escapeHtml(s){ 
  if(!s) return ''; 
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'": '&#39;'
  }[m])); 
}

// ======== Crée un élément projet dynamique =========
function appendOneProject(p){
  const div = document.createElement('div');
  div.className = 'project-card dynamic';

  const titleEl = document.createElement('h3');
  titleEl.textContent = escapeHtml(p.title || '');
  const descEl = document.createElement('p');
  descEl.textContent = escapeHtml(p.desc || '');

  let actionElem;
  if(p.type === 'blender'){
    actionElem = document.createElement('a');
    actionElem.href = '#';
    actionElem.className = 'btn ghost';
    actionElem.textContent = 'Voir le projet';
    actionElem.addEventListener('click', e=>{
      e.preventDefault();
      try{
        const byteCharacters = atob(p.fileData.split(',')[1]);
        const byteNumbers = Array.from({length: byteCharacters.length}, (_,i)=>byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type:'application/octet-stream'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = p.fileName || 'projet.blend';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }catch(err){
        alert('Erreur téléchargement fichier');
      }
    });
  } else {
    actionElem = document.createElement('a');
    actionElem.href = p.link || '#';
    actionElem.target = '_blank';
    actionElem.className = 'btn ghost';
    actionElem.textContent = 'Voir le projet';
  }

  div.appendChild(titleEl);
  div.appendChild(descEl);

  if(p.type === 'blender'){
    const tag = document.createElement('div');
    tag.style.fontSize='0.85rem';
    tag.style.color='#7c4dff';
    tag.textContent='📁 Modèle 3D';
    div.appendChild(tag);
  }

  div.appendChild(actionElem);
  return div;
}

// ======== Render tous les projets dynamiques =========
function renderProjects(){
  const container = document.getElementById('project-list');
  if(!container) return;

  // نحافظ على المشاريع الأصلية (HTML statique)
  const staticProjects = Array.from(container.querySelectorAll('.project-card:not(.dynamic)'));

  // نمسح المشاريع الديناميكية القديمة
  container.querySelectorAll('.project-card.dynamic').forEach(el=>el.remove());

  // نقرأ جميع المشاريع من localStorage
  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem('projects')) || [];
  } catch(e){ stored = []; }

  // نضيف كل مشروع ديناميكي بعد المشاريع الأصلية
  stored.forEach(p=>{
    const el = appendOneProject(p);
    container.appendChild(el);
  });
}

// ======== تشغيل عند تحميل الصفحة =========
document.addEventListener('DOMContentLoaded', ()=>{
  renderProjects();
});
