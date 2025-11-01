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
    const top = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if(top < windowHeight - 50) el.classList.add('active');
  });
}

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

function appendStoredProjects(){
  try {
    const stored = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('project-list');
    if(!container || stored.length === 0) return;

    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
      .map(el => el.textContent.trim().toLowerCase());

    stored.forEach(p => {
      if(existingTitles.includes(p.title.trim().toLowerCase())) return;

      const div = document.createElement('div');
      div.className = 'project-card';
      div.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        ${p.link ? `<a href="${p.link}" target="_blank" class="btn ghost">Voir le projet</a>` : ''}
        <a href="${p.fileData}" download="${p.fileName}" class="btn">Télécharger le fichier</a>
      `;
      container.appendChild(div);
    });
  } catch(e){
    console.error('Erreur appendStoredProjects', e);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  revealOnScroll();
  setupActions();
  appendStoredProjects();
  window.addEventListener('scroll', revealOnScroll);
});
