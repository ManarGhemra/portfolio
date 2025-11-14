// =======================
// URLs TP1
// =======================
const FILE_URLS = {
    CV: 'https://raw.githubusercontent.com/ManarGhemra/portfolio/main/CV-ManarGhemra.pdf',
    TP1_BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp.01.blend',
    TP1_IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp1.png'
};

// =======================
// URLs TP2
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
// NOUVELLE FONCTION DOWNLOAD QUI FONCTIONNE
// =======================
function downloadFile(fileUrl, filename) {
    console.log(`🎯 Téléchargement: ${filename}`);
    console.log(`🔗 URL: ${fileUrl}`);
    
    // Méthode qui fonctionne avec GitHub Releases
    // Créer un lien temporaire et le cliquer
    const tempLink = document.createElement('a');
    tempLink.href = fileUrl;
    tempLink.setAttribute('download', filename);
    tempLink.setAttribute('target', '_blank'); // Important pour GitHub
    tempLink.style.display = 'none';
    
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    
    console.log(`✅ Téléchargement initié pour: ${filename}`);
}

// =======================
// Setup actions (CV + impression)
// =======================
function setupActions(){
    const printBtn = document.getElementById('printBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    if(printBtn) printBtn.addEventListener('click', ()=> window.print());
    if(downloadBtn) downloadBtn.addEventListener('click', ()=> downloadFile(FILE_URLS.CV, 'CV-ManarGhemra.pdf'));
}

// =======================
// TP1 - Fonctions
// =======================
function downloadTP1Blender(){ 
    console.log('📁 downloadTP1Blender appelé');
    downloadFile(FILE_URLS.TP1_BLEND, 'TP_01_Manar_Ghemra.blend'); 
}

function downloadTP1Image(){ 
    console.log('🖼 downloadTP1Image appelé');
    downloadFile(FILE_URLS.TP1_IMAGE, 'TP1_Preview_Manar_Ghemra.jpg'); 
}

// =======================
// TP2 - Fonctions
// =======================
function downloadTP2Blend() { 
    console.log('📁 downloadTP2Blend appelé');
    downloadFile(FILE_URLS_TP2.BLEND, 'Room_TP2_Manar_Ghemra.blend'); 
}

function downloadTP2PDF() { 
    console.log('📝 downloadTP2PDF appelé');
    downloadFile(FILE_URLS_TP2.PDF, 'Rapport_TP1_Ghemra_Manar.pdf'); 
}

function downloadTP2Image() { 
    console.log('🖼 downloadTP2Image appelé');
    downloadFile(FILE_URLS_TP2.IMAGE, 'Render_Room_TP2.jpg'); 
}

function downloadTP2Video() { 
    console.log('🎬 downloadTP2Video appelé');
    downloadFile(FILE_URLS_TP2.VIDEO, 'Video_Room_TP2.mp4'); 
}

// =======================
// FONCTION DE TEST
// =======================
function testVideoDownload() {
    console.log('🧪 TEST MANUEL VIDÉO');
    const videoUrl = 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/room.mp4';
    
    // Test 1: Vérifier si l'URL est accessible
    fetch(videoUrl)
        .then(response => {
            console.log('📡 Statut vidéo:', response.status, response.statusText);
            if (response.ok) {
                console.log('✅ Vidéo accessible - Problème dans la fonction download');
            } else {
                console.log('❌ Vidéo non accessible - Erreur:', response.status);
            }
        })
        .catch(error => {
            console.log('❌ Erreur fetch:', error.message);
        });
    
    // Test 2: Téléchargement direct
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'test_video.mp4';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// =======================
// Styles additionnels
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
    window.testVideoDownload = testVideoDownload;
    
    console.log('🚀 Portfolio chargé');
    console.log('🔧 Pour tester la vidéo, tapez dans la console: testVideoDownload()');
});
