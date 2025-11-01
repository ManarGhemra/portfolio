// js.js — Gestion des projets du portfolio

// Échapper les caractères HTML
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

// Télécharger un fichier Blender depuis dataURL
function downloadBlenderFile(fileData, fileName){
  try{
    const byteCharacters = atob(fileData.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for(let i=0;i<byteCharacters.length;i++){
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type:'application/octet-stream'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'projet.blend';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }catch(e){
    console.error('Erreur téléchargement:',e);
    alert('Erreur lors du téléchargement du fichier');
  }
}

// Affichage d’un projet Blender
function handleBlenderProject(evt,fileData,fileName){
  evt.preventDefault();
  downloadBlenderFile(fileData,fileName);
}

// Ajouter un projet dynamique à la page (index.html)
function appendOneProject(p){
  const container = document.getElementById('project-list');
  if(!container) return;

  const div = document.createElement('div');
  div.className = 'project-card';

  const titleEl = document.createElement('h3');
  titleEl.textContent = p.title || '';
  const descEl = document.createElement('p');
  descEl.textContent = p.desc || '';

  let actionElem;
  if(p.type === 'blender'){
    actionElem = document.createElement('a');
    actionElem.href = '#';
    actionElem.className = 'btn ghost';
    actionElem.textContent = 'Voir le projet';
    actionElem.addEventListener('click', e=> handleBlenderProject(e,p.fileData,p.fileName));
  }else{
    actionElem = document.createElement('a');
    actionElem.href = p.link || '#';
    actionElem.target = '_blank';
    actionElem.className = 'btn ghost';
    actionElem.textContent = 'Voir le projet';
  }

  div.appendChild(titleEl);
  div.appendChild(descEl);
  if(p.type==='blender'){
    const tag = document.createElement('div');
    tag.style.fontSize='0.9rem';
    tag.style.color='#7c4dff';
    tag.textContent='📁 Modèle 3D';
    div.appendChild(tag);
  }
  div.appendChild(actionElem);
  container.appendChild(div);
}

// Charger tous les projets dynamiques depuis localStorage
function appendStoredProjects(){
  try{
    const stored = JSON.parse(localStorage.getItem('projects'))||[];
    stored.forEach(p=> appendOneProject(p));
  }catch(e){
    console.error('Erreur chargement projets:',e);
  }
}

// Impression / téléchargement CV
function setupActions(){
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  if(printBtn) printBtn.addEventListener('click', ()=> window.print());
  if(downloadBtn) downloadBtn.addEventListener('click', ()=> window.print());
}

// Animation reveal au scroll
function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('visible');
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
