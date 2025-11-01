// js.js - comportement de la page index (reveal, print, ajout dynamique des projets si présents)

function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[m]));
}

function downloadBlenderFile(fileData, fileName) {
  try {
    // تحويل البيانات إلى Blob
    const byteCharacters = atob(fileData.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/octet-stream'});
    
    // إنشاء رابط تحميل تلقائي
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'projet.blend';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch(e) {
    console.error('Erreur lors du téléchargement:', e);
    alert('Erreur lors du téléchargement du fichier');
  }
}

function handleBlenderProject(event, fileData, fileName) {
  event.preventDefault();
  downloadBlenderFile(fileData, fileName);
}

function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('visible');
  });
}

function setupActions(){
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  if(printBtn) printBtn.addEventListener('click', ()=> window.print());
  if(downloadBtn) downloadBtn.addEventListener('click', ()=> window.print());
}

// ✅ هذه هي الدالة الوحيدة التي تضيف المشاريع المخزنة
function appendStoredProjects(){
  try {
    const stored = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('project-list');
    if(!container) return;

    // تنظيف الحاوية أولاً
    container.innerHTML = '';

    // إضافة المشاريع المخزنة أولاً (الأحدث أولاً)
    stored.forEach(p => {
      const div = document.createElement('div');
      div.className = 'project-card';
      
      let buttonHTML = '';
      if (p.type === 'blender') {
        buttonHTML = `
          <a href="#" class="btn ghost" onclick="handleBlenderProject(event, '${p.fileData}', '${p.fileName}')">
            Voir le projet
          </a>
        `;
      } else {
        buttonHTML = `<a href="${p.link}" target="_blank" class="btn ghost">Voir le projet</a>`;
      }
      
      div.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        ${p.type === 'blender' ? '<div style="font-size:0.9rem;color:#7c4dff">📁 Modèle 3D</div>' : ''}
        ${buttonHTML}
      `;
      container.appendChild(div);
    });

    // إضافة المشاريع الافتراضية فقط إذا لم تكن هناك مشاريع مخزنة
    if (stored.length === 0) {
      const defaultProjects = [
        {
          title: 'Chatbot universitaire',
          desc: 'Répond aux questions concernant la faculté.',
          link: '#',
          type: 'link'
        },
        {
          title: 'API REST avec FastAPI',
          desc: 'Fusion de plusieurs fichiers PDF.',
          link: '#',
          type: 'link'
        },
        {
          title: 'Site web de shopping',
          desc: 'Produits féminins.',
          link: '#',
          type: 'link'
        },
        {
          title: 'Site web de prévisions météorologiques',
          desc: 'Météo en temps réel.',
          link: '#',
          type: 'link'
        },
        {
          title: 'Site scientifique sur l\'espace',
          desc: 'Vulgarisation des découvertes spatiales.',
          link: '#',
          type: 'link'
        },
        {
          title: 'Portfolio personnel',
          desc: 'Mon site web moderne et responsive présentant mes projets et compétences.',
          link: 'https://moccasin-issi-75.tiiny.site/',
          type: 'link'
        }
      ];

      defaultProjects.forEach(project => {
        const div = document.createElement('div');
        div.className = 'project-card';
        
        div.innerHTML = `
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.desc)}</p>
          <a href="${project.link}" target="_blank" class="btn ghost">Voir le projet</a>
        `;
        container.appendChild(div);
      });
    }

  } catch(e){
    console.error('Erreur lors du chargement des projets depuis localStorage', e);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
