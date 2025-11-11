// GitHub Releases URLs — عدّل حسب المستودع والملفات
const FILE_URLS = {
    CV: 'https://raw.githubusercontent.com/ManarGhemra/portfolio/main/CV-ManarGhemra.pdf',
    TP_BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp.01.blend',
    TP_IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp1.png'
};

// Fonction pour échapper HTML
function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

// Animation reveal au scroll
function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('visible');
  });
}

// Fonction pour télécharger un fichier via redirection
function downloadFileDirect(filename, fileUrl){
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Setup des boutons
function setupActions(){
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  if(printBtn) printBtn.addEventListener('click', ()=> window.print());
  if(downloadBtn){
    downloadBtn.addEventListener('click', ()=> downloadFileDirect('CV-ManarGhemra.pdf', FILE_URLS.CV));
  }
}

// Buttons TP1
function downloadTP1Blender(){
    downloadFileDirect('TP 01 - Manar Ghemra.blend', FILE_URLS.TP_BLEND);
}

function downloadTP1Image(){
    downloadFileDirect('TP1 Preview - Manar Ghemra.png', FILE_URLS.TP_IMAGE);
}

// Ajouter styles CSS pour animations
function addDownloadStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// IndexedDB pour projets
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PortfolioDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('projects')) {
        const store = db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
        store.createIndex('title', 'title', { unique: false });
      }
    };
  });
}

function getAllProjects() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PortfolioDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

async function appendStoredProjects(){
  try {
    await initDB();
    const stored = await getAllProjects();
    const container = document.getElementById('project-list');
    if(!container || stored.length === 0) return;
    stored.forEach((p)=>{
      const div = document.createElement('div');
      div.className = 'project-card';
      div.innerHTML = `
        <h3 style="color:var(--accent1);margin-bottom:8px">${escapeHtml(p.title)}</h3>
        <p style="margin-bottom:12px;color:var(--muted)">${escapeHtml(p.desc)}</p>
      `;
      container.appendChild(div);
    });
  } catch(e){
    console.error('Erreur IndexedDB:', e);
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function(){
  addDownloadStyles();
  setupActions();
  revealOnScroll();
  appendStoredProjects();
  window.addEventListener('scroll', revealOnScroll);
  console.log('🚀 Portfolio chargé — GitHub Releases ready pour téléchargement');
});
