// GitHub Raw URLs — corrigé
const FILE_URLS = {
    CV: 'https://raw.githubusercontent.com/ManarGhemra/portfolio/main/CV-ManarGhemra.pdf',
    TP_BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp.01.blend',
    TP_IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp1.png'
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

// Fonction principale pour télécharger les fichiers
async function downloadFile(filename, fileUrl){
    try {
        // Afficher un indicateur de charnement
        console.log(`Téléchargement de ${filename} depuis ${fileUrl}`);
        
        const response = await fetch(fileUrl);
        if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const blob = await response.blob();
        
        // Vérifier si le blob n'est pas vide
        if (blob.size === 0) {
            throw new Error('Fichier vide ou inaccessible');
        }
        
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        
        console.log(`✅ ${filename} téléchargé avec succès`);
    } catch(e){
        console.error(`❌ Erreur téléchargement ${filename}:`, e);
        alert(`Impossible de télécharger "${filename}".\n\nVérifie que le fichier existe bien sur GitHub.\n\nErreur: ${e.message}`);
    }
}

// Setup des boutons d'action
function setupActions(){
    const printBtn = document.getElementById('printBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    if(printBtn) {
        printBtn.addEventListener('click', ()=> {
            console.log('🖨 Impression du portfolio');
            window.print();
        });
    }
    
    if(downloadBtn){
        downloadBtn.addEventListener('click', ()=> {
            console.log('📄 Téléchargement du CV');
            downloadFile('CV-ManarGhemra.pdf', FILE_URLS.CV);
        });
    }
}

// Fonctions pour les téléchargements TP1
function downloadTP1Blender(){
    console.log('📁 Téléchargement du fichier Blender');
    downloadFile('TP 01 - Manar Ghemra.blend', FILE_URLS.TP_BLEND);
}

function downloadTP1Image(){
    console.log('🖼 Téléchargement de l\'image TP1');
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
        
        /* Styles pour les indicateurs de chargement */
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

// IndexedDB pour projets (optionnel)
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
        
        console.log(`✅ ${stored.length} projet(s) chargé(s) depuis IndexedDB`);
    } catch(e){
        console.error('❌ Erreur IndexedDB:', e);
    }
}

// Fonction pour tester les URLs (debug)
function testFileUrls() {
    console.log('🧪 Test des URLs de fichiers:');
    console.log('📄 CV:', FILE_URLS.CV);
    console.log('📁 Blender:', FILE_URLS.TP_BLEND);
    console.log('🖼 Image:', FILE_URLS.TP_IMAGE);
    
    // Test simple de disponibilité
    Object.entries(FILE_URLS).forEach(([key, url]) => {
        fetch(url, { method: 'HEAD' })
            .then(response => {
                console.log(`✅ ${key}: ${response.status} ${response.statusText}`);
            })
            .catch(error => {
                console.error(`❌ ${key}: ${error.message}`);
            });
    });
}

// Fonction utilitaire pour ajouter un projet à IndexedDB
function addProjectToDB(title, description) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await initDB();
            const transaction = db.transaction(['projects'], 'readwrite');
            const store = transaction.objectStore('projects');
            
            const project = {
                title: title,
                desc: description,
                date: new Date().toISOString()
            };
            
            const request = store.add(project);
            request.onsuccess = () => {
                console.log('✅ Projet ajouté à la base de données');
                resolve(request.result);
            };
            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
}

// Initialisation principale
document.addEventListener('DOMContentLoaded', function(){
    console.log('🚀 Initialisation du portfolio...');
    
    addDownloadStyles();
    setupActions();
    revealOnScroll();
    
    // Charger les projets depuis IndexedDB
    appendStoredProjects();
    
    // Tester les URLs (optionnel - pour debug)
    testFileUrls();
    
    // Écouter le scroll pour les animations
    window.addEventListener('scroll', revealOnScroll);
    
    console.log('✅ Portfolio complètement chargé — Téléchargements activés');
    
    // Exposer les fonctions globales pour les boutons HTML
    window.downloadTP1Blender = downloadTP1Blender;
    window.downloadTP1Image = downloadTP1Image;
});

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('💥 Erreur globale:', e.error);
});

// Gestion des promesses rejetées
window.addEventListener('unhandledrejection', function(e) {
    console.error('💥 Promesse rejetée:', e.reason);
});
