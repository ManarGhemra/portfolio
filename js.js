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

function appendOneProject(p){
  const div = document.createElement('div');
  div.className = 'project-card dynamic';
  const titleEl = document.createElement('h3');
  titleEl.textContent = escapeHtml(p.title || '');
  const descEl = document.createElement('p');
  descEl.textContent = escapeHtml(p.desc || '');

  let actionElem = document.createElement('a');
  actionElem.className = 'btn ghost';
  actionElem.textContent = 'Voir le projet';

  if(p.type === 'link') {
    actionElem.href = p.link || '#';
    actionElem.target = '_blank';
  } else if(p.type === 'blender') {
    actionElem.href = '#';
    actionElem.addEventListener('click', e=>{
      e.preventDefault();
      alert('Téléchargement non supporté pour fichiers volumineux (>10MB). Utilisez un lien externe.');
    });
  }

  div.appendChild(titleEl);
  div.appendChild(descEl);

  if(p.type === 'blender') {
    const tag = document.createElement('div');
    tag.style.fontSize='0.85rem';
    tag.style.color='#7c4dff';
    tag.textContent='📁 Modèle 3D';
    div.appendChild(tag);
  }

  div.appendChild(actionElem);
  return div;
}

function renderProjects(){
  const container = document.getElementById('project-list');
  if(!container) return;

  container.querySelectorAll('.project-card.dynamic').forEach(el=>el.remove());

  let stored = [];
  try { stored = JSON.parse(localStorage.getItem('projects')) || []; } catch(e){ stored=[]; }

  stored.forEach(p => {
    const el = appendOneProject(p);
    container.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderProjects();
});
