// =======================
// URLs TP1
// =======================
const FILE_URLS = {
    CV: 'https://raw.githubusercontent.com/ManarGhemra/portfolio/main/CV-ManarGhemra.pdf',
    TP1_BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp.01.blend',
    TP1_IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp1.png'
};

// =======================
// URLs TP2 - CORRIGÉ
// =======================
const FILE_URLS_TP2 = {
    BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/room.blend',
    PDF: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/Rapport_tp1_Ghemra_Manar.pdf',
    IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/render.image.room.jpg',
    VIDEO: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/room.mp4'
};

// =======================
// Fonctions utilitaires
// =======================
function escapeHtml(s){
    if(!s) return '';
    return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function revealOnScroll(){
    document.querySelectorAll('.reveal').forEach(el=>{
        const r = el.getBoundingClientRect();
        if(r.top < window.innerHeight - 80) el.classList.add('visible');
    });
}

// =======================
// Fonction download direct CORRIGÉE
// =======================
function downloadDirect(fileUrl, filename){
    console.log(`📥 Téléchargement: ${filename}`);
    
    try {
        // Méthode 1: Téléchargement direct
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ Téléchargement initié');
        
        // Méthode 2: Fallback après 2 secondes
        setTimeout(() => {
            console.log('🔄 Lancement du fallback...');
            window.open(fileUrl, '_blank');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        // Méthode 3: Ouverture directe en cas d'erreur
        window.open(fileUrl, '_blank');
    }
}

// =======================
// Setup actions (CV + impression)
// =======================
function setupActions(){
    const printBtn = document.getElementById('printBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    if(printBtn) printBtn.addEventListener('click', ()=> window.print());
    if(downloadBtn) downloadBtn.addEventListener('click', ()=> downloadDirect(FILE_URLS.CV, 'CV-ManarGhemra.pdf'));
}

// =======================
// TP1 - Fonctions
// =======================
function downloadTP1Blender(){ 
    console.log('🎯 downloadTP1Blender appelé');
    downloadDirect(FILE_URLS.TP1_BLEND, 'TP 01 - Manar Ghemra.blend'); 
}

function downloadTP1Image(){ 
    console.log('🎯 downloadTP1Image appelé');
    downloadDirect(FILE_URLS.TP1_IMAGE, 'TP1 Preview - Manar Ghemra.jpg'); 
}

// =======================
// TP2 - Fonctions direct download CORRIGÉES
// =======================
function downloadTP2Blend() { 
    console.log('🎯 downloadTP2Blend appelé');
    downloadDirect(FILE_URLS_TP2.BLEND, 'room.blend'); 
}

function downloadTP2PDF() { 
    console.log('🎯 downloadTP2PDF appelé');
    downloadDirect(FILE_URLS_TP2.PDF, 'Rapport TP1 Ghemra Manar.pdf'); 
}

function downloadTP2Image() { 
    console.log('🎯 downloadTP2Image appelé');
    downloadDirect(FILE_URLS_TP2.IMAGE, 'render.image.room.jpg'); 
}

function downloadTP2Video() { 
    console.log('🎯 downloadTP2Video appelé');
    console.log('🎬 URL vidéo:', FILE_URLS_TP2.VIDEO);
    
    // Méthode spéciale pour la vidéo
    const videoUrl = 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/room.mp4';
    
    // Créer un iframe invisible pour forcer le téléchargement
    const iframe = document.createElement('iframe');
    iframe.src = videoUrl;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Fallback: ouvrir dans un nouvel onglet
    setTimeout(() => {
        window.open(videoUrl, '_blank');
    }, 500);
    
    // Nettoyer après 5 secondes
    setTimeout(() => {
        if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
    }, 5000);
}

// =======================
// Styles additionnels pour animations
// =======================
function addDownloadStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .btn {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

// =======================
// Test de débogage
// =======================
function testAllDownloads() {
    console.log('🧪 Test de tous les téléchargements:');
    console.log('📄 CV:', FILE_URLS.CV);
    console.log('📁 TP1 Blend:', FILE_URLS.TP1_BLEND);
    console.log('🖼 TP1 Image:', FILE_URLS.TP1_IMAGE);
    console.log('📁 TP2 Blend:', FILE_URLS_TP2.BLEND);
    console.log('📝 TP2 PDF:', FILE_URLS_TP2.PDF);
    console.log('🖼 TP2 Image:', FILE_URLS_TP2.IMAGE);
    console.log('🎬 TP2 Video:', FILE_URLS_TP2.VIDEO);
}

// =======================
// Initialisation COMPLÈTE
// =======================
document.addEventListener('DOMContentLoaded', function(){
    addDownloadStyles();
    setupActions();
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
    
    // Exposer toutes les fonctions globalement
    window.downloadTP1Blender = downloadTP1Blender;
    window.downloadTP1Image = downloadTP1Image;
    window.downloadTP2Blend = downloadTP2Blend;
    window.downloadTP2PDF = downloadTP2PDF;
    window.downloadTP2Image = downloadTP2Image;
    window.downloadTP2Video = downloadTP2Video;
    window.testAllDownloads = testAllDownloads;
    
    console.log('🚀 Portfolio chargé — Tous les téléchargements sont prêts');
    console.log('🎬 URL Vidéo TP2:', FILE_URLS_TP2.VIDEO);
    
    // Test automatique
    testAllDownloads();
});

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('💥 Erreur globale:', e.error);
});
