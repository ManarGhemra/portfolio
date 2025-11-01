// --- Fonction pour échapper les caractères spéciaux ---
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

// --- Animation d'apparition au scroll ---
function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const top = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if(top < windowHeight - 50) el.classList.add('active');
  });
}

// --- Actions globales comme imprimer ou télécharger le CV ---
function setupActions(){
  document.querySelectorAll('[data-action]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(btn.dataset.action === 'print'){
        window.print();
      }
      if(btn.dataset.action === 'download'){
        const link = document.createElement('a');
        link.href = 'cv.pdf';
        link.download = 'cv.pdf';
        link.click();
      }
    });
  });
}

// --- Afficher les projets enregistrés depuis localStorage ---
function appendStoredProjects(){
  try {
    const stored = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('project-list');
    if(!container || stored.length === 0) return;

    // Éviter les doublons
    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
      .map(el => el.textContent.trim().toLowerCase());

    stored.forEach(p => {
      if(existingTitles.includes(p.title.trim().toLowerCase())) return;

      const div = document.createElement('div');
      div.className = 'project-card';

      // --- Affichage du média (image ou lien de téléchargement) ---
      let media = '';
      if (p.fileType && p.fileType.startsWith('image/')) {
        // Si le fichier est une image (render)
        media = `<img src="${p.fileData}" alt="${p.title}" style="width:100%;border-radius:10px;margin-bottom:10px;">`;
      } else if (p.fileData && p.fileName) {
        // Si c’est un fichier .blend ou .zip
        media = `<a href="${p.fileData}" download="${p.fileName}" class="btn">Télécharger le fichier</a>`;
      }

      // --- Construction du bloc projet ---
      div.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        ${media}
        <p>${escapeHtml(p.desc)}</p>
        ${p.link ? `<a href="${p.link}" target="_blank" class="btn ghost">Voir le projet</a>` : ''}
      `;
      container.appendChild(div);
    });
  } catch(e){
    console.error('Erreur appendStoredProjects', e);
  }
}

// --- Initialisation une fois la page chargée ---
document.addEventListener('DOMContentLoaded', ()=>{
  revealOnScroll();
  setupActions();
  appendStoredProjects();
  window.addEventListener('scroll', revealOnScroll);
});
