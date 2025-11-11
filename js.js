// IDs fichiers sur Google Drive
const DRIVE_IDS = {
    TP_BLEND: '1YRkuF7Ieluxs1lkewLxNVRD6meAbfKnj', // TP 01.blend
    TP_IMAGE: '1LoWadusBBoFiRgZpmnWPIzaoAFulovaK'  // tp1.jpg
};

// Fonction escape HTML
function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
}

// Animation au scroll
function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('visible');
  });
}

// Télécharger fichier depuis Google Drive
async function downloadFileFromDrive(filename, fileId){
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const blob = await response.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    } catch(e){
        console.error(`Erreur téléchargement ${filename}:`, e);
        alert(`Impossible de télécharger ${filename}.`);
    }
}

// Dummy projects depuis le HTML (tu peux remplacer par IndexedDB si tu veux)
function getProjectsFromHTML() {
    const projects = [];
    document.querySelectorAll('#project-list .project-card').forEach(card=>{
        const title = card.querySelector('h3')?.innerText || '';
        const desc = card.querySelector('p')?.innerText || '';
        projects.push({title, desc});
    });
    return projects;
}

// Générer CV automatiquement en PDF
function generateCV() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const projects = getProjectsFromHTML();

    doc.setFontSize(22);
    doc.text("Ghemra Manar", 20, 20);

    doc.setFontSize(16);
    doc.text("Portfolio Projects:", 20, 35);

    let y = 45;
    projects.forEach((p, i)=>{
        doc.setFontSize(14);
        doc.text(`${i+1}. ${p.title}`, 20, y);
        y += 7;
        doc.setFontSize(12);
        doc.text(p.desc, 25, y);
        y += 10;
        if(y > 280) { doc.addPage(); y = 20; }
    });

    doc.save("CV-Generated.pdf");
}

// Setup actions
function setupActions(){
    const printBtn = document.getElementById('printBtn');
    const downloadCVBtn = document.getElementById('downloadBtn');

    if(printBtn) printBtn.addEventListener('click', ()=> window.print());

    if(downloadCVBtn) downloadCVBtn.addEventListener('click', generateCV);
}

// Buttons projets
function downloadTP1Blender(){
    downloadFileFromDrive('TP 01 - Manar Ghemra.blend', DRIVE_IDS.TP_BLEND);
}
function downloadTP1Image(){
    downloadFileFromDrive('TP1 Preview - Manar Ghemra.jpg', DRIVE_IDS.TP_IMAGE);
}

// Initialisation
document.addEventListener('DOMContentLoaded', function(){
    setupActions();
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
    console.log('🚀 Portfolio chargé - Google Drive & CV dynamique activés');
});
