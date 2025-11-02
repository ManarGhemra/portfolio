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

// Initialiser IndexedDB
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PortfolioDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains('projects')) {
        const store = database.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
        store.createIndex('title', 'title', { unique: false });
      }
    };
  });
}

// Obtenir tous les projets
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

// Télécharger un fichier depuis Base64
function downloadFile(base64Data, fileName) {
  try {
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    return false;
  }
}

// إضافة المشاريع المخزنة
async function appendStoredProjects(){
  try {
    await initDB();
    const stored = await getAllProjects();
    const container = document.getElementById('project-list');
    
    if(!container || stored.length === 0) {
      return;
    }

    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
                               .map(h=>h.textContent.trim());

    stored.forEach((p)=>{
      if (existingTitles.includes(p.title.trim())) {
        return;
      }

      const div = document.createElement('div');
      div.className = 'project-card';
      
      let buttonsHtml = '';
      
      if (p.files && p.files.blend) {
        buttonsHtml += `
          <button onclick="downloadFile('${p.files.blend.data}', '${p.files.blend.name}')" 
                  class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            📁 Télécharger Blender
          </button>
        `;
      }
      
      if (p.files && p.files.image) {
        buttonsHtml += `
          <button onclick="downloadFile('${p.files.image.data}', '${p.files.image.name}')" 
                  class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🖼 Télécharger Image
          </button>
        `;
      }
      
      if (p.files && p.files.video) {
        buttonsHtml += `
          <button onclick="downloadFile('${p.files.video.data}', '${p.files.video.name}')" 
                  class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🎬 Télécharger Vidéo
          </button>
        `;
      }
      
      if (!buttonsHtml) {
        buttonsHtml = '<p class="muted" style="font-size:0.9rem">Aucun fichier disponible</p>';
      }
      
      div.innerHTML = `
        <h3 style="color:var(--accent1);margin-bottom:8px">${escapeHtml(p.title)}</h3>
        <p style="margin-bottom:12px;color:var(--muted)">${escapeHtml(p.desc)}</p>
        <div style="margin-top:12px">
          ${buttonsHtml}
        </div>
      `;
      container.appendChild(div);
    });
  } catch(e){
    console.error('Erreur lors du chargement des projets depuis IndexedDB', e);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
