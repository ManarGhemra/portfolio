// GitHub URLs — version corrigée
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

// Nouvelle fonction pour télécharger depuis GitHub Releases
async function downloadFile(filename, fileUrl){
    try {
        console.log(`Téléchargement de ${filename} depuis ${fileUrl}`);
        
        // Méthode 1: Essayer avec fetch d'abord
        try {
            const response = await fetch(fileUrl);
            if(response.ok) {
                const blob = await response.blob();
                if (blob.size > 0) {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
                    console.log(`✅ ${filename} téléchargé avec succès via fetch`);
                    return;
                }
            }
        } catch (fetchError) {
            console.log('Fetch a échoué, utilisation de la méthode redirect...');
        }
        
        // Méthode 2: Redirection directe pour GitHub Releases
        // Créer un lien temporaire et le cliquer
        const tempLink = document.createElement('a');
        tempLink.href = fileUrl;
        tempLink.download = filename;
        tempLink.target = '_blank'; // Important pour GitHub Releases
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        
        console.log(`✅ ${filename} téléchargement initié via redirect`);
        
    } catch(e){
        console.error(`❌ Erreur téléchargement ${filename}:`, e);
        
        // Méthode 3: Ouvrir dans un nouvel onglet comme fallback
        alert(`Téléchargement de "${filename}"...\n\nSi le téléchargement ne démarre pas automatiquement, vérifiez votre bloqueur de pop-ups ou cliquez sur le lien qui va s'ouvrir.`);
        window.open(fileUrl, '_blank');
    }
}

// Alternative spécifique pour GitHub Releases
function downloadFromGitHubReleases(filename, fileUrl) {
    console.log(`📦 Téléchargement GitHub Releases: ${filename}`);
    
    // Créer un iframe invisible pour forcer le téléchargement
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = fileUrl;
    document.body.appendChild(iframe);
    
    // Fallback: ouvrir dans un nouvel onglet après un délai
    setTimeout(() => {
        window.open(fileUrl, '_blank');
    }, 1000);
    
    // Nettoyer après 5 secondes
    setTimeout(() => {
        if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
    }, 5000);
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

// Fonctions pour les téléchargements TP1 - VERSION CORRIGÉE
function downloadTP1Blender(){
    console.log('📁 Téléchargement du fichier Blender');
    
    // Utiliser l'URL directe de GitHub Releases
    const blendUrl = 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp.01.blend';
    
    // Méthode simple et efficace pour GitHub Releases
    const link = document.createElement('a');
    link.href = blendUrl;
    link.download = 'TP 01 - Manar Ghemra.blend';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Fallback après 1 seconde
    setTimeout(() => {
        if (!confirm('Le téléchargement a-t-il démarré ? Si non, cliquez OK pour ouvrir la page de téléchargement.')) {
            return;
        }
        window.open(blendUrl, '_blank');
    }, 1000);
}

function downloadTP1Image(){
    console.log('🖼 Téléchargement de l\'image TP1');
    
    const imageUrl = 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp1.png';
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'TP1 Preview - Manar Ghemra.png'; // Changé l'extension en .png
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Fallback
    setTimeout(() => {
        if (!confirm('Le téléchargement de l\'image a-t-il démarré ?')) {
            return;
        }
        window.open(imageUrl, '_blank');
    }, 1000);
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
        
        /* Styles pour les boutons de téléchargement */
        .btn {
            transition: all 0.3s ease;
        }
        
        .btn:active {
            transform: scale(0.95);
        }
        
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

// Version ultra-simple qui fonctionne à coup sûr
function forceDownload(filename, url) {
    console.log(`🚀 Force download: ${filename}`);
    
    // Méthode 1: Lien direct
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Méthode 2: Ouvrir dans nouvel onglet (fallback)
    setTimeout(() => {
        window.open(url, '_blank');
    }, 500);
}

// Initialisation principale
document.addEventListener('DOMContentLoaded', function(){
    console.log('🚀 Initialisation du portfolio...');
    
    addDownloadStyles();
    setupActions();
    revealOnScroll();
    
    // Écouter le scroll pour les animations
    window.addEventListener('scroll', revealOnScroll);
    
    console.log('✅ Portfolio chargé — Système de téléchargement activé');
    console.log('📁 URLs disponibles:');
    console.log('  - CV:', FILE_URLS.CV);
    console.log('  - Blender:', FILE_URLS.TP_BLEND);
    console.log('  - Image:', FILE_URLS.TP_IMAGE);
    
    // Exposer les fonctions globales pour les boutons HTML
    window.downloadTP1Blender = downloadTP1Blender;
    window.downloadTP1Image = downloadTP1Image;
    window.forceDownload = forceDownload;
});

// Test manuel des URLs (à exécuter dans la console)
function testDownloads() {
    console.log('🧪 Test manuel des téléchargements:');
    console.log('1. CV:', FILE_URLS.CV);
    console.log('2. Blender:', FILE_URLS.TP_BLEND);
    console.log('3. Image:', FILE_URLS.TP_IMAGE);
    
    // Tester chaque URL
    const testUrl = (name, url) => {
        fetch(url, { method: 'HEAD', mode: 'no-cors' })
            .then(() => console.log(`✅ ${name}: Accessible`))
            .catch(() => console.log(`❌ ${name}: Bloqué par CORS (normal pour GitHub Releases)`));
    };
    
    testUrl('CV', FILE_URLS.CV);
    testUrl('Blender', FILE_URLS.TP_BLEND);
    testUrl('Image', FILE_URLS.TP_IMAGE);
}
