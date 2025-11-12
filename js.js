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
    VIDEO: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/video.mp4'
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

function downloadFile(filename, fileUrl) {
    try {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        alert('Le téléchargement a échoué. Essayez d’ouvrir le lien dans un nouvel onglet.');
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
    if(downloadBtn) downloadBtn.addEventListener('click', ()=> downloadFile('CV-ManarGhemra.pdf', FILE_URLS.CV));
}

// =======================
// TP1 - Fonctions
// =======================
function downloadTP1Blender(){ downloadFile('TP 01 - Manar Ghemra.blend', FILE_URLS.TP1_BLEND); }
function downloadTP1Image(){ downloadFile('TP1 Preview - Manar Ghemra.jpg', FILE_URLS.TP1_IMAGE); }

// =======================
// TP2 - Fonctions avec fetch + Blob
// =======================
async function downloadTP2File(url, filename){
    try{
        const response = await fetch(url);
        if(!response.ok) throw new Error('Erreur lors du téléchargement');
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch(e){
        // حذف alert والفشل
        console.warn(`Téléchargement direct impossible, ouverture du lien en fallback.`);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


// TP2 spécifiques
function downloadTP2Blend() { downloadTP2File(FILE_URLS_TP2.BLEND, 'room.blend'); }
function downloadTP2PDF() { downloadTP2File(FILE_URLS_TP2.PDF, 'Rapport TP1 Ghemra Manar.pdf'); }
function downloadTP2Image() { downloadTP2File(FILE_URLS_TP2.IMAGE, 'render.image.room.jpg'); }
function downloadTP2Video() { downloadTP2File(FILE_URLS_TP2.VIDEO, 'video.mp4'); }

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
});
