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

// Fonction pour créer la visualisation 3D
function createBlenderViewer(blendFileUrl, container) {
  // Pour une vraie visualisation 3D, vous devriez utiliser Three.js
  // Ceci est une version simplifiée avec une iframe et message d'information
  const viewerHTML = `
    <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 20px; margin: 10px 0; text-align: center;">
      <h4 style="color: var(--accent1); margin-bottom: 10px;">🔄 Visualisation 3D Blender</h4>
      <p style="color: var(--muted); margin-bottom: 15px;">
        Le fichier Blender est prêt à être téléchargé. Pour une visualisation 3D interactive, 
        vous pouvez utiliser des outils comme Blender Web ou le télécharger pour l'ouvrir dans Blender Desktop.
      </p>
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <a href="${blendFileUrl}" download="modele_3d.blend" class="btn ghost">
          📥 Télécharger Blender
        </a>
        <button class="btn" onclick="showBlenderInfo()">
          ℹ️ Aide Visualisation
        </button>
      </div>
    </div>
  `;
  container.innerHTML = viewerHTML;
}

function showBlenderInfo() {
  alert("Pour visualiser les modèles 3D Blender de manière interactive:\n\n1. Téléchargez le fichier .blend\n2. Ouvrez-le avec Blender (logiciel gratuit)\n3. Ou utilisez Blender Web Viewer en ligne\n\nLes fonctionnalités de rotation/zoom sont disponibles dans Blender.");
}

// Fonction pour créer la galerie médias
function createMediaGallery(project, container) {
  let mediaHTML = '<div style="margin: 15px 0;">';
  
  if (project.imageFile) {
    mediaHTML += `
      <div style="margin-bottom: 15px;">
        <h4 style="color: var(--accent2); margin-bottom: 8px;">🖼️ Image du Projet</h4>
        <img src="${project.imageFile}" 
             alt="${project.title}" 
             style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="margin-top: 10px;">
          <a href="${project.imageFile}" download="${project.imageName || 'image.png'}" class="btn ghost">
            📥 Télécharger Image
          </a>
        </div>
      </div>
    `;
  }
  
  if (project.videoFile) {
    mediaHTML += `
      <div style="margin-bottom: 15px;">
        <h4 style="color: var(--accent2); margin-bottom: 8px;">🎥 Vidéo du Projet</h4>
        <video controls 
               style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <source src="${project.videoFile}" type="video/mp4">
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
        <div style="margin-top: 10px;">
          <a href="${project.videoFile}" download="${project.videoName || 'video.mp4'}" class="btn ghost">
            📥 Télécharger Vidéo
          </a>
        </div>
      </div>
    `;
  }
  
  mediaHTML += '</div>';
  container.innerHTML = mediaHTML;
}

// ✅ Fonction principale pour ajouter les projets stockés
function appendStoredProjects(){
  try {
    const stored = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('project-list');
    if(!container || stored.length === 0) return;

    // Éviter les doublons
    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
                               .map(h=>h.textContent.trim());

    stored.forEach(p=>{
      if (existingTitles.includes(p.title.trim())) return;

      const div = document.createElement('div');
      div.className = 'project-card';
      
      let buttonsHTML = '';
      let extraContent = '';
      
      if (p.type === 'blender' && p.blendFile) {
        buttonsHTML = `
          <a href="${p.blendFile}" download="${p.fileName || 'modele_3d.blend'}" class="btn ghost">
            📥 Télécharger Blender
          </a>
        `;
        // Ajouter un conteneur pour la visualisation 3D
        extraContent = `<div id="viewer-${p.title.replace(/\s+/g, '-')}" class="blender-viewer"></div>`;
      } 
      else if (p.type === 'media') {
        buttonsHTML = '';
        if (p.imageFile) {
          buttonsHTML += `
            <a href="${p.imageFile}" download="${p.imageName || 'image.png'}" class="btn ghost">
              📥 Télécharger Image
            </a>
          `;
        }
        if (p.videoFile) {
          buttonsHTML += `
            <a href="${p.videoFile}" download="${p.videoName || 'video.mp4'}" class="btn ghost">
              📥 Télécharger Vidéo
            </a>
          `;
        }
        // Ajouter un conteneur pour la galerie médias
        extraContent = `<div id="media-${p.title.replace(/\s+/g, '-')}" class="media-gallery"></div>`;
      }
      else {
        // Projet avec lien standard
        buttonsHTML = `
          <a href="${p.link}" target="_blank" class="btn ghost">
            Voir le projet
          </a>
        `;
      }

      div.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        ${p.type === 'blender' ? '<p style="font-size:0.9rem;color:#7c4dff">🎮 Fichier Blender 3D - Téléchargez et ouvrez dans Blender</p>' : ''}
        ${p.type === 'media' ? '<p style="font-size:0.9rem;color:#00e5ff">🖼️ Projet avec Médias - Images et Vidéos disponibles</p>' : ''}
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin: 15px 0;">
          ${buttonsHTML}
        </div>
        ${extraContent}
      `;
      
      container.appendChild(div);
      
      // Initialiser les visualisations après l'ajout au DOM
      setTimeout(() => {
        if (p.type === 'blender' && p.blendFile) {
          const viewerContainer = document.getElementById(`viewer-${p.title.replace(/\s+/g, '-')}`);
          if (viewerContainer) {
            createBlenderViewer(p.blendFile, viewerContainer);
          }
        }
        else if (p.type === 'media') {
          const mediaContainer = document.getElementById(`media-${p.title.replace(/\s+/g, '-')}`);
          if (mediaContainer) {
            createMediaGallery(p, mediaContainer);
          }
        }
      }, 100);
    });
  } catch(e){
    console.error('Erreur lors du chargement des projets depuis localStorage', e);
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', ()=>{
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
