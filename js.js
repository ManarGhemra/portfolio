// GitHub URLs — version corrigée
const FILE_URLS = {
    CV: 'https://raw.githubusercontent.com/ManarGhemra/portfolio/main/CV-ManarGhemra.pdf',
    TP_BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp.01.blend',
    TP_IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.0/tp1.png',
    // ✅ nouveaux fichiers TP2
    TP2_BLEND: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/room.blend',
    TP2_IMAGE: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/render.image.room.jpg',
    TP2_VIDEO: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/vedeo.mp4',
    TP2_PDF: 'https://github.com/ManarGhemra/portfolio/releases/download/v1.1/Rapport_tp1_Ghemra_Manar.pdf'
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

// 🔹 Fonction simple pour téléchargement direct
function downloadFile(filename, fileUrl) {
    try {
        console.log(`📥 Téléchargement de ${filename} depuis ${fileUrl}`);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error(`Erreur:`, err);
        window.open(fileUrl, '_blank');
    }
}

// ⚙️ Actions boutons
function setupActions(){
    const printBtn = document.getElementById('printBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    if(printBtn) printBtn.addEventListener('click', ()=> window.print());
    if(downloadBtn) downloadBtn.addEventListener('click', ()=> downloadFile('CV-ManarGhemra.pdf', FILE_URLS.CV));
}

// TP1
function downloadTP1Blender(){ downloadFile('TP 01 - Manar Ghemra.blend', FILE_URLS.TP_BLEND); }
function downloadTP1Image(){ downloadFile('TP1 Preview - Manar Ghemra.jpg', FILE_URLS.TP_IMAGE); }

// ✅ TP2 — nouvelles fonctions
function downloadTP2Blender(){ downloadFile('room.blend', FILE_URLS.TP2_BLEND); }
function downloadTP2Image(){ downloadFile('render.image.room.jpg', FILE_URLS.TP2_IMAGE); }
function downloadTP2Video(){ downloadFile('vedeo.mp4', FILE_URLS.TP2_VIDEO); }
function downloadTP2PDF(){ downloadFile('Rapport_tp1_Ghemra_Manar.pdf', FILE_URLS.TP2_PDF); }

function addDownloadStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', function(){
    addDownloadStyles();
    setupActions();
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
    console.log('🚀 Portfolio chargé — Téléchargements TP2 activés');
});
