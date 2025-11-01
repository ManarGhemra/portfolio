// js.js - version finale corrigée (ajout projets sans suppression des anciens)

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
    const byteCharacters = atob(fileData.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/octet-stream'});
    
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

/* ✅ Nouvelle fonction sûre pour ajouter un projet */
function addProject(newProject){
  try {
    // Récupère l’ancien tableau ou tableau vide
    let oldProjects = JSON.parse(localStorage.getItem('projects')) || [];
    
    // Vérifier s’il existe déjà (même titre et desc)
    const exists = oldProjects.some(p => 
      p.title === newProject.title && p.desc === newProject.desc
    );
    if (exists) {
      alert("⚠️ Ce projet existe déjà !");
      return;
    }

    // Ajouter au début
    oldProjects.unshift(newProject);

    // Sauvegarde complète
    localStorage.setItem('projects', JSON.stringify(oldProjects));

    // ✅ Ajouter directement dans le DOM sans recharger
    appendOneProject(newProject, true);

    alert('✅ Projet ajouté avec succès !');
  } catch(e){
    console.error('Erreur lors de l’ajout du projet:', e);
    alert('Erreur lors de l’ajout du projet');
  }
}

/* ✅ Fonction pour ajouter un seul projet au DOM (sans effacer les autres) */
function appendOneProject(p, prepend = false){
  const container = document.getElementById('project-list');
  if(!container) return;

  const div = document.createElement('div');
  div.className = 'project-card';

  let actionElem = null;

  if (p.type === 'blender') {
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'btn ghost';
    a.textContent = 'Voir le projet';
    a.addEventListener('click', function(evt){
      handleBlenderProject(evt, p.fileData, p.fileName);
    });
    actionElem = a;
  } else {
    const a = document.createElement('a');
    a.href = p.link || '#';
    a.target = '_blank';
    a.className = 'btn ghost';
    a.textContent = 'Voir le projet';
    actionElem = a;
  }

  const titleEl = document.createElement('h3');
  titleEl.textContent = p.title || '';
  const descEl = document.createElement('p');
  descEl.textContent = p.desc || '';
  div.appendChild(titleEl);
  div.appendChild(descEl);

  if (p.type === 'blender') {
    const tag = document.createElement('div');
    tag.style.fontSize = '0.9rem';
    tag.style.color = '#7c4dff';
    tag.textContent = '📁 Modèle 3D';
    div.appendChild(tag);
  }

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.gap = '8px';
  wrapper.style.marginTop = '8px';
  wrapper.appendChild(actionElem);

  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn ghost';
  removeBtn.textContent = 'Supprimer';
  removeBtn.addEventListener('click', function(){
    try {
      let arr = JSON.parse(localStorage.getItem('projects')) || [];
      const idx = arr.findIndex(item => {
        if (item.title === p.title && item.desc === p.desc) {
          if (item.type === 'blender' && p.type === 'blender') {
            return item.fileName === p.fileName;
          }
          return item.type === p.type && item.link === p.link;
        }
        return false;
      });
      if (idx !== -1) {
        if(!confirm('Supprimer ce projet ?')) return;
        arr.splice(idx,1);
        localStorage.setItem('projects', JSON.stringify(arr));
        div.remove();
      } else {
        if(confirm('Impossible de supprimer précisément cet élément localement. Voulez-vous recharger la page ?')) {
          location.reload();
        }
      }
    } catch(err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression du projet');
    }
  });

  wrapper.appendChild(removeBtn);
  div.appendChild(wrapper);

  if(prepend) container.prepend(div);
  else container.appendChild(div);
}

/* ✅ Fonction pour charger tous les projets existants (sans supprimer les anciens) */
function appendStoredProjects(){
  try {
    const stored = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('project-list');
    if(!container) return;
    // ❌ Ne pas vider le contenu existant !
    stored.forEach(p => appendOneProject(p, false));
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
