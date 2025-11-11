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

// ========== SOLUTIONS DE TÉLÉCHARGEMENT POUR TP1 ==========

// Solution 1: Liens directs avec gestion d'erreur
function downloadTP1Blender() {
  const fileName = 'TP 01 - Manar Ghemra.blend';
  
  // Essayer plusieurs méthodes
  try {
    // Méthode 1: Lien direct
    const directLink = 'tp 01.blend';
    window.open(directLink, '_blank');
    
    // Afficher des instructions
    setTimeout(() => {
      showDownloadInstructions(fileName);
    }, 1000);
    
  } catch (error) {
    console.error('Erreur téléchargement Blender:', error);
    // Méthode de secours
    showAlternativeDownload(fileName, 'tp 01.blend');
  }
}

function downloadTP1Image() {
  const fileName = 'TP1 Preview - Manar Ghemra.jpg';
  
  try {
    // Méthode 1: Lien direct
    const directLink = 'tp1.jpg';
    window.open(directLink, '_blank');
    
    // Afficher des instructions
    setTimeout(() => {
      showDownloadInstructions(fileName);
    }, 1000);
    
  } catch (error) {
    console.error('Erreur téléchargement image:', error);
    // Méthode de secours
    showAlternativeDownload(fileName, 'tp1.jpg');
  }
}

// Solution 2: Utiliser GitHub RAW URLs (REMPLACEZ AVEC VOS VRAIS LIENS)
function downloadWithGitHubRAW() {
  // REMPLACEZ 'username' et 'repository' par vos vraies valeurs
  const username = 'TON_USERNAME_GITHUB';
  const repository = 'TON_REPO_NAME';
  
  const blenderURL = `https://raw.githubusercontent.com/${username}/${repository}/main/tp%2001.blend`;
  const imageURL = `https://raw.githubusercontent.com/${username}/${repository}/main/tp1.jpg`;
  
  // Utilisez ces URLs dans les fonctions ci-dessus
  return { blenderURL, imageURL };
}

// Solution 3: Téléchargement forcé avec création de blob
function forceDownloadTP1Blender() {
  // Cette méthode ne fonctionne que si les fichiers sont accessibles
  const link = document.createElement('a');
  link.href = 'tp 01.blend';
  link.download = 'TP 01 - Manar Ghemra.blend';
  link.style.display = 'none';
  
  document.body.appendChild(link);
  
  // Simuler le clic
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  
  link.dispatchEvent(clickEvent);
  document.body.removeChild(link);
}

// Fonctions d'aide pour l'utilisateur
function showDownloadInstructions(fileName) {
  const message = `
📥 Téléchargement de: ${fileName}

Si le téléchargement ne commence pas automatiquement:
1. Cliquez droit sur la page qui s'est ouverte
2. Sélectionnez "Enregistrer sous..."
3. Choisissez l'emplacement de sauvegarde

Ou essayez:
• Ctrl + S (Windows/Linux)
• Cmd + S (Mac)
  `;
  
  // Afficher une alerte stylisée
  const alertDiv = document.createElement('div');
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--card);
    border: 1px solid var(--accent1);
    border-radius: 10px;
    padding: 15px;
    max-width: 300px;
    z-index: 10000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    font-size: 0.9rem;
  `;
  
  alertDiv.innerHTML = `
    <div style="color: var(--accent2); margin-bottom: 10px;">💡 Instructions de téléchargement</div>
    <div style="color: var(--muted); font-size: 0.8rem; line-height: 1.4;">
      Fichier: <strong>${fileName}</strong><br>
      Cliquez droit → "Enregistrer sous"
    </div>
    <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; background: var(--accent1); border: none; border-radius: 5px; cursor: pointer;">Fermer</button>
  `;
  
  document.body.appendChild(alertDiv);
  
  // Supprimer automatiquement après 10 secondes
  setTimeout(() => {
    if (alertDiv.parentElement) {
      alertDiv.remove();
    }
  }, 10000);
}

function showAlternativeDownload(fileName, filePath) {
  const fullURL = window.location.origin + '/' + filePath;
  
  const message = `
🚨 Téléchargement alternatif pour: ${fileName}

1. Copiez ce lien: ${fullURL}
2. Collez-le dans un nouvel onglet
3. Cliquez droit → "Enregistrer sous"

Ou visitez directement:
${fullURL}
  `;
  
  alert(message);
}

// Vérifier si les fichiers existent
async function checkFilesAvailability() {
  const filesToCheck = ['tp 01.blend', 'tp1.jpg'];
  
  for (const file of filesToCheck) {
    try {
      const response = await fetch(file, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ Fichier accessible: ${file}`);
      } else {
        console.warn(`❌ Fichier non accessible: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Erreur vérification ${file}:`, error);
    }
  }
}

// Télécharger un fichier depuis Base64 (pour les projets admin)
function downloadFile(base64Data, fileName) {
  try {
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

// Ajouter les projets stockés depuis IndexedDB
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

// Initialiser la page
document.addEventListener('DOMContentLoaded', function(){
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  
  // Vérifier la disponibilité des fichiers
  checkFilesAvailability();
  
  window.addEventListener('scroll', revealOnScroll);
  
  console.log('🚀 Portfolio TP1 chargé - Système de téléchargement activé');
});
