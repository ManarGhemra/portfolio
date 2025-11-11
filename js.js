// js.js - Solution finale pour le téléchargement direct

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

// ========== SOLUTION DE TÉLÉCHARGEMENT DIRECT ==========

function downloadFileDirect(fileUrl, fileName) {
    console.log(`Tentative de téléchargement: ${fileName}`);
    
    // Afficher un indicateur de chargement
    showLoadingIndicator(fileName);
    
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    // Ajouter au document et cliquer
    document.body.appendChild(link);
    
    // Utiliser une méthode plus agressive pour forcer le téléchargement
    try {
        link.click();
        console.log(`✅ Téléchargement initié: ${fileName}`);
        
        // Vérifier si le téléchargement a réussi après un délai
        setTimeout(() => {
            hideLoadingIndicator();
            showSuccessMessage(fileName);
        }, 1500);
        
    } catch (error) {
        console.error(`❌ Erreur téléchargement: ${error}`);
        hideLoadingIndicator();
        showErrorMessage(fileName, fileUrl);
    }
    
    // Nettoyer
    setTimeout(() => {
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
    }, 1000);
}

// Fonction améliorée avec fetch pour les fichiers plus gros
async function downloadFileWithFetch(fileUrl, fileName) {
    showLoadingIndicator(fileName);
    
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Fichier non trouvé');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Nettoyer
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        hideLoadingIndicator();
        showSuccessMessage(fileName);
        
    } catch (error) {
        console.error('Erreur fetch:', error);
        hideLoadingIndicator();
        // Retourner à la méthode simple
        downloadFileDirect(fileUrl, fileName);
    }
}

// Indicateurs visuels
function showLoadingIndicator(fileName) {
    // Supprimer tout indicateur existant
    hideLoadingIndicator();
    
    const loader = document.createElement('div');
    loader.id = 'download-loader';
    loader.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card);
        border: 2px solid var(--accent1);
        border-radius: 15px;
        padding: 20px;
        z-index: 10000;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.7);
    `;
    
    loader.innerHTML = `
        <div style="color: var(--accent2); font-size: 1.1rem; margin-bottom: 10px;">📥 Téléchargement en cours</div>
        <div style="color: var(--muted); font-size: 0.9rem; margin-bottom: 15px;">${fileName}</div>
        <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid var(--muted); border-top: 3px solid var(--accent1); border-radius: 50%; animation: spin 1s linear infinite;"></div>
    `;
    
    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loader);
}

function hideLoadingIndicator() {
    const loader = document.getElementById('download-loader');
    if (loader) {
        loader.remove();
    }
}

function showSuccessMessage(fileName) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #00C853;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,200,83,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    message.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.2rem;">✅</span>
            <div>
                <div style="font-weight: bold;">Téléchargement réussi!</div>
                <div style="font-size: 0.8rem; opacity: 0.9;">${fileName}</div>
            </div>
        </div>
    `;
    
    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(message);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 3000);
}

function showErrorMessage(fileName, fileUrl) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #FF5252;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(255,82,82,0.3);
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    message.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.2rem;">❌</span>
            <div>
                <div style="font-weight: bold;">Erreur de téléchargement</div>
                <div style="font-size: 0.8rem; opacity: 0.9; margin: 5px 0;">${fileName}</div>
                <button onclick="window.open('${fileUrl}', '_blank')" 
                        style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.7rem;">
                    Ouvrir dans un nouvel onglet
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// Vérifier la disponibilité des fichiers
async function checkFilesAvailability() {
    const files = [
        { url: 'tp 01.blend', name: 'Fichier Blender' },
        { url: 'tp1.jpg', name: 'Image TP1' }
    ];
    
    for (const file of files) {
        try {
            const response = await fetch(file.url, { method: 'HEAD' });
            if (response.ok) {
                console.log(`✅ ${file.name} accessible`);
            } else {
                console.warn(`❌ ${file.name} non accessible`);
            }
        } catch (error) {
            console.error(`❌ Erreur vérification ${file.name}:`, error);
        }
    }
}

// ========== FONCTIONS EXISTANTES (IndexedDB) ==========

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

async function appendStoredProjects(){
    try {
        await initDB();
        const stored = await getAllProjects();
        const container = document.getElementById('project-list');
        
        if(!container || stored.length === 0) return;

        const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
                                   .map(h=>h.textContent.trim());

        stored.forEach((p)=>{
            if (existingTitles.includes(p.title.trim())) return;

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
            
            if (!buttonsHtml) {
                buttonsHtml = '<p class="muted" style="font-size:0.9rem">Aucun fichier disponible</p>';
            }
            
            div.innerHTML = `
                <h3 style="color:var(--accent1);margin-bottom:8px">${escapeHtml(p.title)}</h3>
                <p style="margin-bottom:12px;color:var(--muted)">${escapeHtml(p.desc)}</p>
                <div style="margin-top:12px">${buttonsHtml}</div>
            `;
            container.appendChild(div);
        });
    } catch(e){
        console.error('Erreur chargement projets IndexedDB:', e);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function(){
    appendStoredProjects();
    setupActions();
    revealOnScroll();
    checkFilesAvailability();
    
    window.addEventListener('scroll', revealOnScroll);
    
    console.log('🚀 Portfolio chargé - Téléchargement direct activé!');
});
