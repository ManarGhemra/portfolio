// Configuration - REMPLACEZ CES VALEURS
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
  if(downloadBtn) downloadBtn.addEventListener('click', ()=> window.print());
}

// SOLUTION GITHUB RAW
function downloadTP1Blender() {
    const filename = 'TP 01 - Manar Ghemra.blend';
    const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/tp%2001.blend`;
    
    showDownloadStatus(`Téléchargement de ${filename}...`);
    
    // Ouvrir dans un nouvel onglet - ça va télécharger directement
    window.open(fileUrl, '_blank');
    
    // Montrer les instructions après 1 seconde
    setTimeout(() => {
        showDownloadInstructions(filename, fileUrl);
    }, 1000);
}

function downloadTP1Image() {
    const filename = 'TP1 Preview - Manar Ghemra.jpg';
    const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/tp1.jpg`;
    
    showDownloadStatus(`Téléchargement de ${filename}...`);
    
    // Ouvrir dans un nouvel onglet
    window.open(fileUrl, '_blank');
    
    setTimeout(() => {
        showDownloadInstructions(filename, fileUrl);
    }, 1000);
}

// Fonctions d'affichage
function showDownloadStatus(message) {
    const existingStatus = document.getElementById('download-status');
    if (existingStatus) existingStatus.remove();
    
    const statusDiv = document.createElement('div');
    statusDiv.id = 'download-status';
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 25px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;
    
    statusDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <div>
                <div style="font-weight: bold; margin-bottom: 5px;">Téléchargement</div>
                <div style="font-size: 12px; opacity: 0.9;">${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(statusDiv);
}

function showDownloadInstructions(filename, fileUrl) {
    const existingInstructions = document.getElementById('download-instructions');
    if (existingInstructions) existingInstructions.remove();
    
    const instructionsDiv = document.createElement('div');
    instructionsDiv.id = 'download-instructions';
    instructionsDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card);
        border: 2px solid var(--accent1);
        border-radius: 15px;
        padding: 25px;
        z-index: 10001;
        box-shadow: 0 10px 40px rgba(0,0,0,0.7);
        max-width: 400px;
        color: white;
    `;
    
    instructionsDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 24px; margin-bottom: 10px;">💡</div>
            <div style="font-weight: bold; color: var(--accent2); margin-bottom: 10px;">Instructions de Téléchargement</div>
            <div style="color: var(--muted); font-size: 14px; margin-bottom: 15px;">${filename}</div>
        </div>
        
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <div style="font-weight: bold; margin-bottom: 10px; color: var(--accent1);">📝 Étapes:</div>
            <ol style="text-align: left; padding-left: 20px; margin: 0; font-size: 13px; line-height: 1.6;">
                <li>Une nouvelle page s'est ouverte</li>
                <li><strong>Cliquez droit</strong> n'importe où sur la page</li>
                <li>Sélectionnez <strong>"Enregistrer sous..."</strong></li>
                <li>Choisissez l'emplacement de sauvegarde</li>
            </ol>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="copyDownloadLink('${fileUrl}')" style="padding: 8px 15px; background: var(--accent1); border: none; border-radius: 8px; color: white; cursor: pointer; font-size: 12px;">
                📋 Copier le lien
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 8px 15px; background: rgba(255,255,255,0.1); border: 1px solid var(--muted); border-radius: 8px; color: white; cursor: pointer; font-size: 12px;">
                Fermer
            </button>
        </div>
    `;
    
    document.body.appendChild(instructionsDiv);
}

function copyDownloadLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Lien copié!';
        btn.style.background = '#00C853';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'var(--accent1)';
        }, 2000);
    });
}

// Vérifier la disponibilité des fichiers
async function checkFilesAvailability() {
    const files = [
        { name: 'tp 01.blend', url: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/tp%2001.blend` },
        { name: 'tp1.jpg', url: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/tp1.jpg` }
    ];
    
    console.group('🔍 Vérification des fichiers sur GitHub');
    for (const file of files) {
        try {
            const response = await fetch(file.url, { method: 'HEAD' });
            if (response.ok) {
                console.log(`✅ ${file.name} - DISPONIBLE`);
            } else {
                console.warn(`❌ ${file.name} - NON DISPONIBLE (${response.status})`);
            }
        } catch (error) {
            console.error(`❌ ${file.name} - ERREUR:`, error.message);
        }
    }
    console.groupEnd();
}

// Ajouter les styles CSS
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

// Fonctions IndexedDB existantes
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
    checkFilesAvailability();
    window.addEventListener('scroll', revealOnScroll);
    
    console.log('🚀 Portfolio chargé - GitHub Raw URLs activés');
    console.log('📁 Utilisateur GitHub:', GITHUB_USERNAME);
    console.log('📁 Repository:', GITHUB_REPO);
});
