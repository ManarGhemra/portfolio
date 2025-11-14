// =======================
// URLs TP1
// =======================
const FILE_URLS = {
    CV: 'https://raw.githubusercontent.com/ManarGhemra/portfolio/main/CV-ManarGhemra.pdf',
    TP1_BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp.01.blend',
    TP1_IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp1.png'
};

// =======================
// URLs TP2 - AVEC LA BONNE URL VIDÉO
// =======================
const FILE_URLS_TP2 = {
    BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/room.blend',
    PDF: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/Rapport_tp1_Ghemra_Manar.pdf',
    IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/render.image.room.jpg',
    VIDEO: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/vedeo.mp4'  // ← CORRECTION ICI
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
// Fonction download direct SIMPLIFIÉE
// =======================
function downloadDirect(fileUrl, filename){
    console.log(`📥 Téléchargement: ${filename}`);
    console.log(`🔗 URL: ${fileUrl}`);
    
    // Méthode simple et efficace
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    downloadDirect(FILE_URLS.TP1_BLEND, 'TP 01 - Manar Ghemra.blend'); 
}

function downloadTP1Image(){ 
    downloadDirect(FILE_URLS.TP1_IMAGE, 'TP1 Preview - Manar Ghemra.jpg'); 
}

// =======================
// TP2 - Fonctions direct download
// =======================
function downloadTP2Blend() { 
    downloadDirect(FILE_URLS_TP2.BLEND, 'room.blend'); 
}

function downloadTP2PDF() { 
    downloadDirect(FILE_URLS_TP2.PDF, 'Rapport TP1 Ghemra Manar.pdf'); 
}

function downloadTP2Image() { 
    downloadDirect(FILE_URLS_TP2.IMAGE, 'render.image.room.jpg'); 
}

function downloadTP2Video() { 
    console.log('🎬 Téléchargement vidéo TP2');
    
    // URL CORRECTE - le fichier s'appelle "vedeo.mp4" (avec un e)
    const videoUrl = 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/vedeo.mp4';
    
    // Téléchargement direct
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'TP2_Video_Demo.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Vidéo téléchargement initié');
}

// =======================
// Styles additionnels pour animations
// =======================
function addDownloadStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
}

// =======================
// VÉRIFICATION AUTOMATIQUE DES URLs
// =======================
function verifyAllUrls() {
    console.log('🔍 Vérification des URLs...');
    
    const urlsToCheck = [
        { name: 'CV', url: FILE_URLS.CV },
        { name: 'TP1 Blend', url: FILE_URLS.TP1_BLEND },
        { name: 'TP1 Image', url: FILE_URLS.TP1_IMAGE },
        { name: 'TP2 Blend', url: FILE_URLS_TP2.BLEND },
        { name: 'TP2 PDF', url: FILE_URLS_TP2.PDF },
        { name: 'TP2 Image', url: FILE_URLS_TP2.IMAGE },
        { name: 'TP2 Video', url: FILE_URLS_TP2.VIDEO }
    ];
    
    urlsToCheck.forEach(item => {
        fetch(item.url, { method: 'HEAD' })
            .then(response => {
                console.log(response.ok ? `✅ ${item.name}: OK` : `❌ ${item.name}: ${response.status}`);
            })
            .catch(error => {
                console.log(`❌ ${item.name}: Erreur - ${error.message}`);
            });
    });
}

// =======================
// Initialisation
// =======================
document.addEventListener('DOMContentLoaded', function(){
    addDownloadStyles();
    setupActions();
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
    
    // Exposer les fonctions globalement
    window.downloadTP1Blender = downloadTP1Blender;
    window.downloadTP1Image = downloadTP1Image;
    window.downloadTP2Blend = downloadTP2Blend;
    window.downloadTP2PDF = downloadTP2PDF;
    window.downloadTP2Image = downloadTP2Image;
    window.downloadTP2Video = downloadTP2Video;
    window.verifyAllUrls = verifyAllUrls;
    
    console.log('🚀 Portfolio chargé');
    console.log('🎬 URL Vidéo TP2 corrigée:', FILE_URLS_TP2.VIDEO);
    
    // Vérification automatique
    setTimeout(verifyAllUrls, 1000);
});
