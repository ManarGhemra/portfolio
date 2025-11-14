// =======================
// URLs TP1
// =======================
const FILE_URLS = {
    CV: 'https://raw.githubusercontent.com/ManarGhemra/portfolio/main/CV-ManarGhemra.pdf',
    TP1_BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp.01.blend',
    TP1_IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp1.png'
};

// =======================
// URLs TP2 - CORRIGÉ (room.mp4)
// =======================
const FILE_URLS_TP2 = {
    BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/room.blend',
    PDF: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/Rapport_tp1_Ghemra_Manar.pdf',
    IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/render.image.room.jpg',
    VIDEO: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/room.mp4'  // ← CORRIGÉ : room.mp4
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
// Fonction download direct
// =======================
function downloadDirect(fileUrl, filename){
    console.log(`🎬 Tentative de téléchargement: ${filename}`);
    console.log(`🔗 URL: ${fileUrl}`);
    
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`✅ Téléchargement initié pour: ${filename}`);
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
function downloadTP1Blender(){ downloadDirect(FILE_URLS.TP1_BLEND, 'TP 01 - Manar Ghemra.blend'); }
function downloadTP1Image(){ downloadDirect(FILE_URLS.TP1_IMAGE, 'TP1 Preview - Manar Ghemra.jpg'); }

// =======================
// TP2 - Fonctions direct download
// =======================
function downloadTP2Blend() { downloadDirect(FILE_URLS_TP2.BLEND, 'room.blend'); }
function downloadTP2PDF() { downloadDirect(FILE_URLS_TP2.PDF, 'Rapport TP1 Ghemra Manar.pdf'); }
function downloadTP2Image() { downloadDirect(FILE_URLS_TP2.IMAGE, 'render.image.room.jpg'); }
function downloadTP2Video() { downloadDirect(FILE_URLS_TP2.VIDEO, 'video_room.mp4'); }

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
// Initialisation
// =======================
document.addEventListener('DOMContentLoaded', function(){
    addDownloadStyles();
    setupActions();
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
    
    console.log('🚀 Portfolio chargé — TP1 & TP2 téléchargements prêts');
    console.log('🎬 URL Vidéo TP2 (room.mp4):', FILE_URLS_TP2.VIDEO);
});
