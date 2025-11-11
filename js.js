// Google Drive IDs — remplace par tes IDs réels
const DRIVE_IDS = {
    CV: '1YRkuF7Ieluxs1lkewLxNVRD6meAbfKnj',
    TP_BLEND: 'ID_DU_BLEND',
    TP_IMAGE: 'ID_DU_IMAGE'
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

// Fonction pour télécharger un fichier depuis Google Drive
async function downloadFileFromDrive(filename, fileId){
    const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
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
        alert(`Impossible de télécharger ${filename}.`);
    }
}

// Setup des boutons
function setupActions(){
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  if(printBtn) printBtn.addEventListener('click', ()=> window.print());
  if(downloadBtn){
    downloadBtn.addEventListener('click', ()=>{
      downloadFileFromDrive('CV‑ManarGhemra.pdf', DRIVE_IDS.CV);
    });
  }
}

// Buttons TP1
function downloadTP1Blender(){
    downloadFileFromDrive('TP 01 ‑ Manar Ghemra.blend', DRIVE_IDS.TP_BLEND);
}

function downloadTP1Image(){
    downloadFileFromDrive('TP1 Preview ‑ Manar Ghemra.png', DRIVE_IDS.TP_IMAGE);
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
  console.log('🚀 Portfolio chargé — Google Drive Download activé');
});
