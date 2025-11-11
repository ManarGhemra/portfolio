// js.js - Solution garantie pour le téléchargement

// Fonctions d'animation
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

// ========== SOLUTION GARANTIE POUR TÉLÉCHARGEMENT ==========

// Fonction pour forcer le téléchargement IMMÉDIAT
function forceDownload(filename, url) {
    console.log(`🚀 Début du téléchargement: ${filename}`);
    
    // Afficher un indicateur de progression
    showDownloadStatus(`Préparation du téléchargement: ${filename}`);
    
    // Méthode 1: Utiliser un lien avec download attribute
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        // Ajouter des événements pour suivre le processus
        link.addEventListener('click', function() {
            console.log('✅ Clic sur le lien de téléchargement');
            showDownloadStatus(`Téléchargement en cours: ${filename}`);
        });
        
        document.body.appendChild(link);
        
        // Simuler un clic COMPLET
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            button: 0
        });
        
        // Déclencher l'événement
        link.dispatchEvent(clickEvent);
        
        // Méthode alternative: clic natif
        link.click();
        
        // Nettoyer après 2 secondes
        setTimeout(() => {
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            showDownloadSuccess(filename);
        }, 2000);
        
    }, 500);
}

// Fonction pour gérer le téléchargement avec fetch (pour les gros fichiers)
async function downloadWithFetch(filename, url) {
    try {
        showDownloadStatus(`Téléchargement de ${filename}...`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Nettoyer
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            showDownloadSuccess(filename);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erreur fetch:', error);
        // Retour à la méthode simple
        forceDownload(filename, url);
    }
}

// Indicateurs visuels améliorés
function showDownloadStatus(message) {
    // Supprimer tout statut existant
    const existingStatus = document.getElementById('download-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
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

function showDownloadSuccess(filename) {
    const existingStatus = document.getElementById('download-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.id = 'download-success';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 25px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 18px;">✅</span>
            <div>
                <div style="font-weight: bold;">Téléchargement réussi!</div>
                <div style="font-size: 12px; opacity: 0.9;">${filename}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

// CSS Animations
function addDownloadStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Styles pour les liens de téléchargement */
        .download-btn {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(124, 77, 255, 0.4);
        }
        
        .download-btn:active {
            transform: translateY(0);
        }
        
        /* Effet de pulsation pour indiquer que c'est cliquable */
        .download-btn.pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(124, 77, 255, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(124, 77, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(124, 77, 255, 0); }
        }
    `;
    document.head.appendChild(style);
}

// Améliorer les boutons de téléchargement
function enhanceDownloadButtons() {
    const downloadButtons = document.querySelectorAll('a[download]');
    downloadButtons.forEach(btn => {
        // Ajouter des classes CSS
        btn.classList.add('download-btn', 'pulse');
        
        // Ajouter un écouteur d'événements pour le suivi
        btn.addEventListener('click', function(e) {
            const filename = this.download;
            console.log(`🎯 Clic sur le bouton de téléchargement: ${filename}`);
            showDownloadStatus(`Lancement du téléchargement: ${filename}`);
        });
    });
}

// Vérifier que les fichiers existent
async function verifyFiles() {
    const files = [
        { name: 'tp 01.blend', url: 'tp 01.blend' },
        { name: 'tp1.jpg', url: 'tp1.jpg' }
    ];
    
    console.group('🔍 Vérification des fichiers');
    for (const file of files) {
        try {
            const response = await fetch(file.url, { method: 'HEAD' });
            if (response.ok) {
                console.log(`✅ ${file.name} - DISPONIBLE (${response.status})`);
            } else {
                console.warn(`⚠️ ${file.name} - NON DISPONIBLE (${response.status})`);
            }
        } catch (error) {
            console.error(`❌ ${file.name} - ERREUR:`, error.message);
        }
    }
    console.groupEnd();
}

// ========== FONCTIONS EXISTANTES ==========

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

// ========== INITIALISATION ==========

document.addEventListener('DOMContentLoaded', function(){
    // Ajouter les styles CSS
    addDownloadStyles();
    
    // Configurer les actions
    setupActions();
    revealOnScroll();
    
    // Améliorer les boutons de téléchargement
    enhanceDownloadButtons();
    
    // Vérifier les fichiers
    verifyFiles();
    
    // Charger les projets stockés
    appendStoredProjects();
    
    // Événement de scroll
    window.addEventListener('scroll', revealOnScroll);
    
    console.log('🎉 Portfolio complètement chargé - Téléchargements activés!');
    console.log('📁 Fichiers disponibles:');
    console.log('   - tp 01.blend');
    console.log('   - tp1.jpg');
});
