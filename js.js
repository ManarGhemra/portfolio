// ----- Animation d'apparition -----
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  for (const r of reveals) {
    const windowHeight = window.innerHeight;
    const elementTop = r.getBoundingClientRect().top;
    const elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) {
      r.classList.add("visible");
    }
  }
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ----- Bouton Télécharger CV -----
document.getElementById("downloadBtn").addEventListener("click", () => {
  window.print();
});

// ----- Bouton Imprimer -----
const printBtn = document.getElementById("printBtn");
if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
}

// ----- Fonction pour échapper le HTML -----
function escapeHtml(s) {
  if (!s) return "";
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[m]));
}

// ----- Charger les projets dynamiques ajoutés via admin.html -----
function loadDynamicProjects() {
  const list = document.getElementById("project-list");
  if (!list) return;

  const projets = JSON.parse(localStorage.getItem("projets") || "[]");
  for (const p of projets) {
    const div = document.createElement("div");
    div.className = "project-card";
    div.innerHTML = `
      <h3>${escapeHtml(p.titre)}</h3>
      <p>${escapeHtml(p.description)}</p>
      <a href="${escapeHtml(p.lien)}" target="_blank" class="btn ghost">Voir le projet</a>
    `;
    list.appendChild(div);
  }
}

// تحميل المشاريع عند بدء التشغيل
document.addEventListener('DOMContentLoaded', function() {
  loadDynamicProjects();
});
