// Configuration
const GITHUB_USERNAME = 'ManarGhemra';
const GITHUB_REPO = 'portfolio';
const GITHUB_BRANCH = 'main';

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

function setupActions(){
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  if(printBtn) printBtn.addEventListener('click', ()=> window.print());
  if(downloadBtn){
    downloadBtn.addEventListener('click', ()=>{
      const url = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/CV-ManarGhemra.pdf`;
      downloadFile('CV-ManarGhemra.pdf', url);
    });
  }
}

// Fonction générale pour télécharger un fichier
function downloadFile(filename, fileUrl){
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = filename; // <-- garantit le téléchargement
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Buttons TP1
function downloadTP1Blender(){
  const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/tp%2001.blend`;
  downloadFile('TP 01 - Manar Ghemra.blend', fileUrl);
}

function downloadTP1Image(){
  const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/tp1.png`;
  downloadFile('TP1 Preview - Manar Ghemra.png', fileUrl);
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

// Vérifier disponibilité fichiers (facultatif)
async function checkFilesAvailability() {
  const files = [
    { name: 'tp 01.blend', url: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/tp%2001.blend` },
    { name: 'tp1.png', url: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/tp1.png` }
  ];
  console.group('🔍 Vérification des fichiers sur GitHub');
  for (const file of files) {
    try {
      const response = await fetch(file.url, { method: 'HEAD' });
      if (response.ok) console.log(`✅ ${file.name} - DISPONIBLE`);
      else console.warn(`❌ ${file.name} - NON DISPONIBLE (${response.status})`);
    } catch (error) {
      console.error(`❌ ${file.name} - ERREUR:`, error.message);
    }
  }
  console.groupEnd();
}

// Initialisation
document.addEventListener('DOMContentLoaded', function(){
  addDownloadStyles();
  setupActions();
  revealOnScroll();
  appendStoredProjects();
  checkFilesAvailability();
  window.addEventListener('scroll', revealOnScroll);
  console.log('🚀 Portfolio chargé - GitHub Raw URLs activés');
});
