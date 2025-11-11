// GitHub Raw URLs — عدل حسب المستودع والملفات
const FILE_URLS = {
    CV: 'https://raw.githubusercontent.com/ManarGhemra/portfolio/main/CV-ManarGhemra.pdf',
    TP_BLEND: 'sha256:7aef4a0cbe7defd4717555e3d1363f6556c2bc330def8918cd6abec47ee15816',
    TP_IMAGE: 'sha256:455f5a596481117a028a87ccbd1BQZKqdp2CV3QV5nUEsqSg1ygegLmqRygj0592'
};



function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('visible');
  });
}

// Fonction pour télécharger un fichier depuis GitHub
async function downloadFile(filename, fileUrl){
    try {
        const response = await fetch(fileUrl);
        if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const blob = await response.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    } catch(e){
        console.error(`Erreur téléchargement ${filename}:`, e);
        alert(`Impossible de télécharger ${filename}. Vérifie le lien ou le fichier.`);
    }
}

// Setup des boutons
function setupActions(){
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  if(printBtn) printBtn.addEventListener('click', ()=> window.print());
  if(downloadBtn){
    downloadBtn.addEventListener('click', ()=> downloadFile('CV-ManarGhemra.pdf', FILE_URLS.CV));
  }
}

// Buttons TP1
function downloadTP1Blender(){
    downloadFileFromGitHub('TP 01 - Manar Ghemra.blend',
        'https://raw.githubusercontent.com/ManarGhemra/portfolio/main/tp%2001%20.blend');
}

function downloadTP1Image(){
    downloadFile('TP1 Preview - Manar Ghemra.jpg', FILE_URLS.TP_IMAGE);
}

// Ajouter les styles CSS pour animations
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
  console.log('🚀 Portfolio chargé — GitHub Raw URLs activés');
});
