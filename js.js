// --------------------------
// js.js - Version simplifiée
// --------------------------

// Configuration GitHub
const GITHUB_USERNAME = 'ManarGhemra';
const GITHUB_REPO = 'portfolio';
const GITHUB_BRANCH = 'main';

// Fonction pour échapper le HTML (sécurité)
function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

// Reveal éléments au scroll
function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('visible');
  });
}

// Setup boutons
function setupActions(){
  // Print button
  const printBtn = document.getElementById('printBtn');
  if(printBtn) printBtn.addEventListener('click', ()=> window.print());

  // Download CV bouton
  const downloadBtn = document.getElementById('downloadBtn');
  if(downloadBtn){
    downloadBtn.addEventListener('click', ()=>{
      const url = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/CV-ManarGhemra.pdf`;
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CV-ManarGhemra.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}

// Fonctions pour télécharger les projets
function downloadFile(filename, fileUrl){
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Exemples pour les boutons projets
function downloadTP1Blender(){
  const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/tp%2001.blend`;
  downloadFile('TP 01 - Manar Ghemra.blend', fileUrl);
}

function downloadTP1Image(){
  const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/tp1.jpg`;
  downloadFile('TP1 Preview - Manar Ghemra.jpg', fileUrl);
}

// Initialisation au DOM chargé
document.addEventListener('DOMContentLoaded', function(){
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
  console.log('🚀 Portfolio chargé');
});
